'use client';

import React from 'react';
import { useBoard } from '@/lib/board';

interface PinButtonProps {
  slug: string;
  type: 'founder' | 'story';
  title: string;
  subtitle: string;
  imageUrl?: string;
}

export default function PinButton({ slug, type, title, subtitle, imageUrl }: PinButtonProps) {
  const { togglePin, isPinned } = useBoard();
  const pinned = isPinned(slug);

  return (
    <button
      className="mbpin"
      aria-pressed={pinned}
      onClick={() => togglePin({ slug, type, title, subtitle, imageUrl })}
    >
      {pinned ? 'Pinned to My board' : 'Pin to My board'}
    </button>
  );
}
