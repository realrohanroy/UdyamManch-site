import { getStoryBySlug } from '@/lib/content';
import { OG_SIZE, OG_TYPE, shareCard } from '@/lib/og';

export const alt = 'Story on Udyam Manch';
// Edge runtime: Next 14's Node image generator builds a broken file path on Windows, so local builds fail.
export const runtime = 'edge';
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default async function Image({ params }: { params: { slug: string } }) {
  const s = await getStoryBySlug(params.slug);
  if (!s) return shareCard({ title: 'Stories from across India', kicker: 'Stories' });
  return shareCard({ title: s.title, kicker: s.sample ? 'Sample story' : s.category, byline: s.author });
}
