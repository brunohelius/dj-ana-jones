'use client';

import { useMemo } from 'react';

const STORAGE_KEY = 'ana-jones:hero-image-sequence';

const HERO_IMAGES = [
  '/gallery/real/ana-profile-djanemag.jpeg',
  '/gallery/real/ana-zamna-festival.jpeg',
  '/gallery/real/ana-dreams-release.jpg',
  '/gallery/real/ana-avatar-soundcloud.jpg',
  '/gallery/real/ana-sente-cover.jpg',
  '/gallery/real/ana-clubinho-goiania-artwork.png',
  '/gallery/real/artworks-MyVfYpeTrDzKDT2m-G36AhA-large.jpg',
  '/gallery/real/artworks-QAlcAWzmLyqFfcWx-MWgViQ-large.png',
];

const getNextIndex = (total: number, previousIndex: number) => {
  if (total <= 1) {
    return 0;
  }

  let nextIndex = Math.floor(Math.random() * total);

  if (nextIndex === previousIndex) {
    nextIndex = (nextIndex + 1) % total;
  }

  return nextIndex;
};

const getNextImage = () => {
  if (typeof window === 'undefined') {
    return HERO_IMAGES[0];
  }

  const total = HERO_IMAGES.length;
  const rawIndex = Number.parseInt(window.localStorage.getItem(STORAGE_KEY) || '', 10);
  const previousIndex = Number.isInteger(rawIndex) ? rawIndex : -1;
  const nextIndex = getNextIndex(total, previousIndex);

  try {
    window.localStorage.setItem(STORAGE_KEY, String(nextIndex));
  } catch {
    // localStorage is optional.
  }

  return HERO_IMAGES[nextIndex];
};

export const HeroRotatingImage = () => {
  const image = useMemo(() => getNextImage(), []);

  return (
    <img src={image} alt='Ana Jones' className='h-full w-full object-cover' />
  );
};
