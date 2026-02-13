import { cache } from 'react';

import type { DjEvent } from '@/lib/events';
import { EVENTS } from '@/lib/events';
import type { SiteImage } from '@/lib/siteDefaults';
import { DEFAULT_GALLERY_IMAGES, DEFAULT_HERO_IMAGES } from '@/lib/siteDefaults';

import { readJson, writeJson } from '@/lib/dataStore';

export type SiteContent = {
  heroImages: SiteImage[];
  galleryImages: SiteImage[];
  events: DjEvent[];
  updatedAt: string;
};

const SITE_CONTENT_FILE = 'site-content.json';

const makeDefaultContent = (): SiteContent => ({
  heroImages: DEFAULT_HERO_IMAGES,
  galleryImages: DEFAULT_GALLERY_IMAGES,
  events: EVENTS,
  updatedAt: 'seed',
});

const normalizeText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const normalizeStringArray = (value: unknown) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map(normalizeText).filter((item) => item.length > 0);
};

const normalizeImages = (value: unknown, fallback: SiteImage[]) => {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const images = value
    .map((item) => {
      if (typeof item !== 'object' || item === null) {
        return null;
      }

      const record = item as Record<string, unknown>;
      const src = normalizeText(record.src);
      const alt = normalizeText(record.alt);

      if (!src) {
        return null;
      }

      return {
        src,
        alt: alt || 'Ana Jones',
      };
    })
    .filter((item): item is SiteImage => item !== null);

  return images.length > 0 ? images : fallback;
};

const normalizeEvent = (value: unknown): DjEvent | null => {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const record = value as Record<string, unknown>;
  const slug = normalizeText(record.slug);
  const title = normalizeText(record.title);
  const dateIso = normalizeText(record.dateIso);
  const dateLabel = normalizeText(record.dateLabel);
  const timeLabel = normalizeText(record.timeLabel);
  const location = normalizeText(record.location);
  const city = normalizeText(record.city);
  const description = normalizeText(record.description);
  const highlights = normalizeStringArray(record.highlights);
  const listRules = normalizeStringArray(record.listRules);
  const coverImage = normalizeText(record.coverImage);

  if (!slug || !title || !dateIso || !dateLabel) {
    return null;
  }

  return {
    slug,
    title,
    dateIso,
    dateLabel,
    timeLabel,
    location,
    city,
    description,
    highlights,
    listRules,
    coverImage,
  };
};

const normalizeEvents = (value: unknown, fallback: DjEvent[]) => {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const events = value
    .map((item) => normalizeEvent(item))
    .filter((item): item is DjEvent => item !== null);

  return events.length > 0 ? events : fallback;
};

const normalizeContent = (value: unknown, fallback: SiteContent): SiteContent => {
  if (typeof value !== 'object' || value === null) {
    return fallback;
  }

  const record = value as Record<string, unknown>;

  return {
    heroImages: normalizeImages(record.heroImages, fallback.heroImages),
    galleryImages: normalizeImages(record.galleryImages, fallback.galleryImages),
    events: normalizeEvents(record.events, fallback.events),
    updatedAt: normalizeText(record.updatedAt) || fallback.updatedAt,
  };
};

export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const fallback = makeDefaultContent();
  const raw = await readJson<unknown>(SITE_CONTENT_FILE, fallback as unknown);

  return normalizeContent(raw, fallback);
});

export const saveSiteContent = async (value: unknown): Promise<SiteContent> => {
  const fallback = makeDefaultContent();
  const normalized = normalizeContent(value, fallback);
  const payload: SiteContent = {
    ...normalized,
    updatedAt: new Date().toISOString(),
  };

  await writeJson(SITE_CONTENT_FILE, payload);
  return payload;
};

export const getEvents = async () => (await getSiteContent()).events;

export const getEventBySlug = async (slug: string) => {
  const safeSlug = slug.trim();

  if (!safeSlug) {
    return undefined;
  }

  const events = await getEvents();
  return events.find((event) => event.slug === safeSlug);
};

