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
import Breadcrumb from '@/components/journey/Breadcrumb';
import JourneyHero from '@/components/journey/JourneyHero';
import JourneyBody from '@/components/journey/blocks';
import JourneySidebar from '@/components/journey/JourneySidebar';
import '@/styles/journey.css';

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
  const image = absoluteUrl(j.seo?.image ?? j.hero.image.url);

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
      images: [{ url: image, width: 1200, height: 630, alt: j.hero.image.alt }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@udyammanch',
      title,
      description,
      images: [image],
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
    image: [absoluteUrl(j.seo?.image ?? j.hero.image.url)],
    datePublished: j.publishedAt,
    dateModified: j.updatedAt ?? j.publishedAt,
    author: [{ '@type': 'Organization', name: j.author }],
    about: { '@type': 'Person', name: j.founder.name, worksFor: { '@type': 'Organization', name: j.company.name, url: j.company.website } },
    publisher: { '@type': 'Organization', name: SITE_NAME, logo: { '@type': 'ImageObject', url: absoluteUrl('/assets/logo-light.webp') } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };

  return (
    <div className="w">
      <script
        type="application/ld+json"
        // JSON.stringify output is data, and "<" is escaped so text cannot close the tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      <Breadcrumb
        items={[
          { label: 'Founders', href: '/founders' },
          { label: j.founder.shortName ?? j.founder.name },
        ]}
      />

      <JourneyHero j={j} minutes={minutes} url={url} />

      <div className="article-layout">
        <article className="story-content">
          <JourneyBody blocks={j.body} />
        </article>
        <JourneySidebar j={j} related={related} url={url} />
      </div>
    </div>
  );
}
