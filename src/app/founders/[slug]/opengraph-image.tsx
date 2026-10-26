import { getJourney } from '@/lib/journey/repo';
import { plain } from '@/lib/journey/format';
import { OG_SIZE, OG_TYPE, shareCard } from '@/lib/og';

export const alt = 'Founder story on Udyam Manch';
// Edge runtime: Next 14's Node image generator builds a broken file path on Windows, so local builds fail.
export const runtime = 'edge';
export const size = OG_SIZE;
export const contentType = OG_TYPE;

/** Used when a journey has no hand made share image (seo.image). */
export default async function Image({ params }: { params: { slug: string } }) {
  const j = await getJourney(params.slug);
  if (!j) return shareCard({ title: 'Founder stories from across India', kicker: 'Founders' });
  return shareCard({
    title: plain(j.hero.title),
    kicker: j.sample ? 'Sample founder story' : 'Founder story',
    byline: `${j.founder.name}, ${j.company.name}`,
  });
}
