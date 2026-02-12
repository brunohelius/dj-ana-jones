'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'ana-jones:concept-bg-index';

const PRESSKIT_BACKGROUNDS = Array.from({ length: 28 }, (_, index) => {
  const fileNumber = String(index + 1).padStart(2, '0');
  return `/gallery/presskit/backgrounds/ana-presskit-${fileNumber}.jpg`;
});

const getNextIndex = (current: number | null) => {
  if (typeof window === 'undefined') {
    return 0;
  }

  let previousIndex = current;
  let saved = null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    saved = raw ? Number.parseInt(raw, 10) : null;
    previousIndex = Number.isInteger(saved) ? (saved as number) : current;
  } catch {
    saved = null;
  }

  const total = PRESSKIT_BACKGROUNDS.length;

  let nextIndex = Math.floor(Math.random() * total);

  if (total > 1 && previousIndex !== null) {
    while (nextIndex === previousIndex) {
      nextIndex = Math.floor(Math.random() * total);
    }
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, String(nextIndex));
  } catch {
    saved = null;
  }

  return nextIndex;
};

export const ConceptBackground = () => {
  const [backgroundIndex] = useState<number>(() => getNextIndex(null));

  const background =
    backgroundIndex === null ? PRESSKIT_BACKGROUNDS[0] : PRESSKIT_BACKGROUNDS[backgroundIndex];

  return (
    <div className='concept-bg-root' aria-hidden='true'>
      <div className='concept-bg-image' style={{ backgroundImage: `url('${background}')` }} />
      <div className='concept-bg-overlay' />
    </div>
  );
};
