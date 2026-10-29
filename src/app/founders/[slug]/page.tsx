/**
 * Founder journey page. One template for every founder.  [REQ-TMP-01..09] [REQ-SEO-03..07, 09]
 *
 * Content comes from lib/journey/repo (Sanity, or local files as fallback).
 * Nothing in this file is specific to a founder. If you are tempted to add
 * `if (slug === ...)`, add a field or a block type instead.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getJourney, getJourneys, getRelated } from '@/lib/journey/repo';
import { plain, readMinutes } from '@/lib/journey/format';
import { absoluteUrl, SITE_NAME } from '@/lib/site';
import LegacyLayout from '@/components/journey/legacy/LegacyLayout';
import '@/styles/legacy-journey.css';

type Props = { params: { slug: string } };

// Pre-build every known journey; re-check the CMS at most once a minute (ISR).
// New slugs published later still work: they render on first request, then cache.
export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const all = await getJourneys();
  return all.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const j = await getJourney(params.slug);
  if (!j) return {};

  const url = absoluteUrl(`/founders/${j.slug}`);
  const title = j.seo?.title ?? `${j.founder.name}, ${j.company.name}`;
  const description = j.seo?.description ?? plain(j.hero.dek);
  // Only a hand made share image (seo.image) overrides the generated 1200 x 630 card.
  const image = j.seo?.image ? absoluteUrl(j.seo.image) : undefined;

  return {
    title, // layout template appends " | Udyam Manch"
    description,
    alternates: { canonical: url },
    robots: j.sample ? { index: false, follow: true } : undefined,
    openGraph: {
      type: 'article',
      siteName: SITE_NAME,
      title,
      description,
      url,
      publishedTime: j.publishedAt,
      modifiedTime: j.updatedAt ?? j.publishedAt,
      authors: [j.author],
      section: 'Founder stories',
      ...(image && { images: [{ url: image, width: 1200, height: 630, alt: j.hero.image.alt }] }),
    },
    twitter: {
      card: 'summary_large_image',
      site: '@udyammanch',
      title,
      description,
      ...(image && { images: [image] }),
    },
  };
}

export default async function FounderJourneyPage({ params }: Props) {
  const j = await getJourney(params.slug);
  if (!j) notFound(); // drafts, scheduled and unknown slugs all 404

  const related = await getRelated(j);
  const url = absoluteUrl(`/founders/${j.slug}`);
  const minutes = readMinutes(j);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: plain(j.hero.title),
    description: plain(j.hero.dek),
    image: [j.seo?.image ? absoluteUrl(j.seo.image) : absoluteUrl(`/founders/${j.slug}/opengraph-image`)],
    datePublished: j.publishedAt,
    dateModified: j.updatedAt ?? j.publishedAt,
    author: [{ '@type': 'Organization', name: j.author }],
    about: { '@type': 'Person', name: j.founder.name, worksFor: { '@type': 'Organization', name: j.company.name, url: j.company.website } },
    publisher: { '@type': 'Organization', name: SITE_NAME, logo: { '@type': 'ImageObject', url: 'https://res.cloudinary.com/nkhny4aq/image/upload/f_auto,q_auto/v1792668848/logo-light.webp' } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // JSON.stringify output is data, and "<" is escaped so text cannot close the tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\u003c') }}
      />
      <LegacyLayout j={j} related={related} url={url} minutes={minutes} />
    </>
  );
}
