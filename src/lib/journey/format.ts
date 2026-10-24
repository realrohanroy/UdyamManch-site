import type { FounderJourney, JourneyBlock } from './types';

/** "18 Oct 2026" in Indian time, so a late-night publish never shows the wrong day. */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(iso));
}

/** Text a reader actually reads, for the read time estimate. [REQ-TMP-04] */
function blockText(b: JourneyBlock): string {
  switch (b._type) {
    case 'section':
      return [b.heading ?? '', ...b.paragraphs].join(' ');
    case 'quote':
      return b.text;
    case 'note':
      return b.text;
    case 'steps':
      return b.steps.map((s) => `${s.title} ${s.text}`).join(' ');
    default:
      return '';
  }
}

const WORDS_PER_MINUTE = 200;

export function readMinutes(j: FounderJourney): number {
  const text = [j.hero.dek, ...j.body.map(blockText)].join(' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

/** Strip inline marks for places that need plain text (meta tags, share text). */
export function plain(text: string): string {
  return text.replace(/\*\*|==|\*/g, '').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
}
