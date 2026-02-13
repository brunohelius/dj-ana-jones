'use client';

import { useEffect, useState } from 'react';

import { DEFAULT_HERO_IMAGES } from '@/lib/siteDefaults';

const STORAGE_KEY = 'ana-jones:hero-image-sequence';

const DEFAULT_IMAGES = DEFAULT_HERO_IMAGES.map((image) => image.src);
const FALLBACK_IMAGE = DEFAULT_IMAGES[0];

type HeroRotatingImageProps = {
  images?: string[];
  alt?: string;
};

const getStoredIndex = (total: number) => {
  try {
    const rawIndex = Number.parseInt(window.localStorage.getItem(STORAGE_KEY) || '', 10);

    if (!Number.isInteger(rawIndex)) {
      return null;
    }

    if (rawIndex < 0 || rawIndex >= total) {
      return null;
    }

    return rawIndex;
  } catch {
    return null;
  }
};

const getNextIndex = (total: number, previousIndex: number | null) => {
  if (total <= 1) {
    return 0;
  }

  if (previousIndex === null) {
    return Math.floor(Math.random() * total);
  }

  return (previousIndex + 1) % total;
};

const getNextImage = (images: string[]) => {
  const safeImages = images.length > 0 ? images : DEFAULT_IMAGES;

  if (typeof window === 'undefined') {
    return safeImages[0] || FALLBACK_IMAGE;
  }

  const total = safeImages.length;
  const previousIndex = getStoredIndex(total);
  const nextIndex = getNextIndex(total, previousIndex);

  try {
    window.localStorage.setItem(STORAGE_KEY, String(nextIndex));
  } catch {
    // localStorage is optional.
  }

  return safeImages[nextIndex] || FALLBACK_IMAGE;
};

export const HeroRotatingImage = ({ images, alt }: HeroRotatingImageProps) => {
  const safeImages = images && images.length > 0 ? images : DEFAULT_IMAGES;
  const [image, setImage] = useState(FALLBACK_IMAGE);

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      setImage(getNextImage(safeImages));
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [safeImages]);

  return (
    <img src={image} alt={alt || 'Ana Jones'} className='h-full w-full object-cover' />
  );
};
