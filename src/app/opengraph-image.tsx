import { OG_SIZE, OG_TYPE, shareCard } from '@/lib/og';

/** Default share card for the home page, Founders, Stories and anything without its own. */
export const alt = 'Udyam Manch, stories behind India’s next big businesses';
// Edge runtime: Next 14's Node image generator builds a broken file path on Windows, so local builds fail.
export const runtime = 'edge';
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return shareCard({ title: 'The stories behind India’s next big businesses', kicker: 'Founders and stories' });
}
