'use client';

import { useState } from 'react';

const STORAGE_KEY = 'ana-jones:concept-bg-sequence';

const PRESSKIT_BACKGROUNDS = Array.from({ length: 28 }, (_, index) => {
  const fileNumber = String(index + 1).padStart(2, '0');
  return `/gallery/presskit/backgrounds/ana-presskit-${fileNumber}.jpg`;
});

const shuffle = (values: number[], seed: number) => {
  const shuffled = [...values];
  let cursor = seed;

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    cursor = (cursor * 9301 + 49297) % 233280;
    const next = cursor % (index + 1);
    [shuffled[index], shuffled[next]] = [shuffled[next], shuffled[index]];
  }

  return shuffled;
};

const getStoredSequence = (total: number) => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as {
      queue?: number[];
      lastIndex?: number;
    };

    if (!Array.isArray(parsed.queue) || typeof parsed.lastIndex !== 'number') {
      return null;
    }

    const validQueue = parsed.queue.every(
      (item) => Number.isInteger(item) && item >= 0 && item < total,
    );

    if (!validQueue) {
      return null;
    }

    return {
      queue: parsed.queue,
      lastIndex: parsed.lastIndex,
    };
  } catch {
    return null;
  }
};

const makeQueue = (total: number) => shuffle(Array.from({ length: total }, (_, index) => index), Date.now());

const getNextBackground = () => {
  if (typeof window === 'undefined') {
    return PRESSKIT_BACKGROUNDS[0];
  }

  const total = PRESSKIT_BACKGROUNDS.length;
  const source = getStoredSequence(total);

  let queue: number[] = makeQueue(total);
  let lastIndex = -1;

  if (source) {
    queue = source.queue;
    lastIndex = source.lastIndex;
  }

  const nextIndex = queue.pop() ?? lastIndex;
  const safeIndex = ((nextIndex % total) + total) % total;

  if (queue.length === 0) {
    queue = makeQueue(total);

    if (queue.length > 1 && queue[queue.length - 1] === safeIndex) {
      const swapped = queue.pop();

      if (swapped !== undefined) {
        queue.unshift(swapped);
      }
    }
  }

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        queue,
        lastIndex: safeIndex,
      }),
    );
  } catch {
    // localStorage not required for functionality
  }

  return PRESSKIT_BACKGROUNDS[safeIndex];
};

export const ConceptBackground = () => {
  const [background] = useState(() => getNextBackground());

  return (
    <div className='concept-bg-root' aria-hidden='true'>
      <div className='concept-bg-image' style={{ backgroundImage: `url('${background}')` }} />
      <div className='concept-bg-overlay' />
    </div>
  );
};
