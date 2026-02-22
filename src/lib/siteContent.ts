import { cache } from 'react';

import type { DjEvent } from '@/lib/events';
import { EVENTS } from '@/lib/events';
import type { SiteImage, SiteProfile, SiteSocialLinks, SiteMediaEmbed, SiteContactInfo } from '@/lib/siteDefaults';
import {
  DEFAULT_GALLERY_IMAGES,
  DEFAULT_HERO_IMAGES,
  DEFAULT_PROFILE,
  DEFAULT_SOCIAL_LINKS,
  DEFAULT_MEDIA_EMBEDS,
  DEFAULT_CONTACT_INFO,
} from '@/lib/siteDefaults';

import { readJson, writeJson } from '@/lib/dataStore';

export type SiteContent = {
  heroImages: SiteImage[];
  galleryImages: SiteImage[];
  events: DjEvent[];
  profile: SiteProfile;
  socialLinks: SiteSocialLinks;
  mediaEmbeds: SiteMediaEmbed[];
  contactInfo: SiteContactInfo;
  updatedAt: string;
};

const SITE_CONTENT_FILE = 'site-content.json';

const makeDefaultContent = (): SiteContent => ({
  heroImages: DEFAULT_HERO_IMAGES,
  galleryImages: DEFAULT_GALLERY_IMAGES,
  events: EVENTS,
  profile: DEFAULT_PROFILE,
  socialLinks: DEFAULT_SOCIAL_LINKS,
  mediaEmbeds: DEFAULT_MEDIA_EMBEDS,
  contactInfo: DEFAULT_CONTACT_INFO,
  updatedAt: 'seed',
});

const normalizeText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const normalizeBoolean = (value: unknown, fallback: boolean) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    if (value === 1) {
      return true;
    }
    if (value === 0) {
      return false;
    }
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();

    if (normalized === 'true') {
      return true;
    }

    if (normalized === 'false') {
      return false;
    }
  }

  return fallback;
};

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

// Variant that allows empty arrays (for content that user can fully clear)
const normalizeImagesAllowEmpty = (value: unknown, fallback: SiteImage[]) => {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value
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
  const signupOpen = normalizeBoolean(record.signupOpen, true);
  const signupClosedMessage = normalizeText(record.signupClosedMessage);

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
    signupOpen,
    signupClosedMessage,
  };
};

const normalizeEvents = (value: unknown, fallback: DjEvent[]) => {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const events = value
    .map((item) => normalizeEvent(item))
    .filter((item): item is DjEvent => item !== null);

  return events;
};

const normalizeProfile = (value: unknown, fallback: SiteProfile): SiteProfile => {
  if (typeof value !== 'object' || value === null) {
    return fallback;
  }

  const r = value as Record<string, unknown>;

  return {
    heroSubtitle: normalizeText(r.heroSubtitle) || fallback.heroSubtitle,
    heroBio: normalizeText(r.heroBio) || fallback.heroBio,
    aboutTitle: normalizeText(r.aboutTitle) || fallback.aboutTitle,
    aboutParagraph1: normalizeText(r.aboutParagraph1) || fallback.aboutParagraph1,
    aboutParagraph2: normalizeText(r.aboutParagraph2) || fallback.aboutParagraph2,
    base: normalizeText(r.base) || fallback.base,
    projeto: normalizeText(r.projeto) || fallback.projeto,
    formato: normalizeText(r.formato) || fallback.formato,
    booking: normalizeText(r.booking) || fallback.booking,
  };
};

const normalizeSocialLinks = (value: unknown, fallback: SiteSocialLinks): SiteSocialLinks => {
  if (typeof value !== 'object' || value === null) {
    return fallback;
  }

  const r = value as Record<string, unknown>;

  return {
    instagram: normalizeText(r.instagram) || fallback.instagram,
    soundcloud: normalizeText(r.soundcloud) || fallback.soundcloud,
    spotify: normalizeText(r.spotify) || fallback.spotify,
    youtube: normalizeText(r.youtube) || fallback.youtube,
  };
};

const normalizeMediaEmbeds = (value: unknown, fallback: SiteMediaEmbed[]): SiteMediaEmbed[] => {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const embeds = value
    .map((item) => {
      if (typeof item !== 'object' || item === null) {
        return null;
      }

      const r = item as Record<string, unknown>;
      const title = normalizeText(r.title);
      const description = normalizeText(r.description);
      const iframe = normalizeText(r.iframe);

      if (!title || !iframe) {
        return null;
      }

      return { title, description, iframe };
    })
    .filter((item): item is SiteMediaEmbed => item !== null);

  return embeds;
};

const normalizeContactInfo = (value: unknown, fallback: SiteContactInfo): SiteContactInfo => {
  if (typeof value !== 'object' || value === null) {
    return fallback;
  }

  const r = value as Record<string, unknown>;

  return {
    email: normalizeText(r.email) || fallback.email,
    whatsapp: normalizeText(r.whatsapp) || fallback.whatsapp,
    whatsappLabel: normalizeText(r.whatsappLabel) || fallback.whatsappLabel,
    bookingDescription: normalizeText(r.bookingDescription) || fallback.bookingDescription,
  };
};

const normalizeContent = (value: unknown, fallback: SiteContent): SiteContent => {
  if (typeof value !== 'object' || value === null) {
    return fallback;
  }

  const record = value as Record<string, unknown>;

  return {
    heroImages: normalizeImages(record.heroImages, fallback.heroImages),
    galleryImages: normalizeImagesAllowEmpty(record.galleryImages, fallback.galleryImages),
    events: normalizeEvents(record.events, fallback.events),
    profile: normalizeProfile(record.profile, fallback.profile),
    socialLinks: normalizeSocialLinks(record.socialLinks, fallback.socialLinks),
    mediaEmbeds: normalizeMediaEmbeds(record.mediaEmbeds, fallback.mediaEmbeds),
    contactInfo: normalizeContactInfo(record.contactInfo, fallback.contactInfo),
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
