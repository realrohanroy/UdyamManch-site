'use client';

import React from 'react';
import { useBoard } from '@/lib/board';

interface PinButtonProps {
  slug: string;
  type: 'founder' | 'story';
  title: string;
  subtitle: string;
  imageUrl?: string;
  className?: string;
}

/**
 * The label never changes. The pressed state is shown by a check mark and
 * aria-pressed, so assistive tech announces one stable control. (UI-SPEC 5)
 */
export default function PinButton({ slug, type, title, subtitle, imageUrl, className = '' }: PinButtonProps) {
  const { togglePin, isPinned } = useBoard();
  const pinned = isPinned(slug);

  return (
    <button
      type="button"
      className={`mbpin ${className}`.trim()}
      aria-pressed={pinned}
      onClick={() => togglePin({ slug, type, title, subtitle, imageUrl })}
    >
      {pinned && (
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      )}
      Pin to My board
    </button>
  );
}
