/**
 * Layout comparison. /preview/cover/<slug>, /preview/dossier/<slug>, /preview/chapters/<slug>
 * render the same journey in each composition so the choice can be made by looking.
 * Not indexed, not in the sitemap. Delete this folder once a layout is chosen.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getJourney, getJourneys, getRelated } from '@/lib/journey/repo';
import { readMinutes } from '@/lib/journey/format';
import { absoluteUrl } from '@/lib/site';
import { LAYOUTS, type Layout } from '@/lib/journey/types';
import { LAYOUT_COMPONENTS } from '@/components/journey/layouts';
import '@/styles/journey.css';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Layout preview',
  robots: { index: false, follow: false },
};

export async function generateStaticParams() {
  const all = await getJourneys();
  return LAYOUTS.flatMap((variant) => all.map((j) => ({ variant, slug: j.slug })));
}

export default async function PreviewPage({ params }: { params: { variant: string; slug: string } }) {
  if (!(LAYOUTS as readonly string[]).includes(params.variant)) notFound();
  const j = await getJourney(params.slug);
  if (!j) notFound();

  const Layout = LAYOUT_COMPONENTS[params.variant as Layout];
  const related = await getRelated(j);
  return <Layout j={j} related={related} url={absoluteUrl(`/founders/${j.slug}`)} minutes={readMinutes(j)} />;
}
