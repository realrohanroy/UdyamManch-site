import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getStoryBySlug, getStories } from '@/lib/content';
import { formatDate } from '@/lib/journey/format';
import { absoluteUrl, SITE_NAME } from '@/lib/site';

interface StoryPageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 60;

export async function generateStaticParams() {
  const stories = await getStories();
  return stories.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const story = await getStoryBySlug(params.slug);
  if (!story) return {};

  const url = absoluteUrl(`/stories/${story.slug}`);
  const title = story.seo?.ogTitle?.replace(/\s*\|\s*Udyam Manch$/, '') || story.title;
  const description = story.seo?.ogDescription || story.excerpt;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: story.sample ? { index: false, follow: true } : undefined,
    // No images set: app/stories/[slug]/opengraph-image.tsx makes the 1200 x 630 card.
    openGraph: { title, description, url, type: 'article', siteName: SITE_NAME, publishedTime: story.publishedAt },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function StoryDetailPage({ params }: StoryPageProps) {
  // Old slugs of founder stories are 301 redirected in next.config.mjs, before this runs.
  const story = await getStoryBySlug(params.slug);

  if (!story || story.status !== 'published') {
    notFound();
  }

  const allStories = await getStories();
  const relatedStories = allStories.filter((s) => s.slug !== story.slug).slice(0, 3);

  return (
    <article>
      {/* Header */}
      <div className="art-h">
        <span className="cat">
          {story.category}
          {story.sample && <b> · Sample</b>}
        </span>
        <h1>{story.title}</h1>
        <p className="dek">{story.excerpt}</p>
        <div className="by">
          <span className="meta">
            {story.author}, {formatDate(story.publishedAt)}, {story.readingTimeMinutes} min read
          </span>
        </div>
      </div>

      {/* Cover Image */}
      <div className="fig">
        <div className="art">
          <img src={story.coverImage.url} alt={story.coverImage.alt} />
        </div>
      </div>

      {/* Article Body */}
      <div className="body">
        {story.founderSlug && (
          <div
            style={{
              background: 'color-mix(in srgb, var(--acc) 10%, var(--card))',
              border: '1.5px solid color-mix(in srgb, var(--acc) 25%, var(--line))',
              borderRadius: '12px',
              padding: '20px 24px',
              margin: '10px 0 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <span className="cat" style={{ fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Full Founder Story
              </span>
              <h3 style={{ font: '700 20px/1.2 var(--hd)', margin: '4px 0 4px', color: 'var(--ink)' }}>
                Kishan for Kisan: From Rajasthan&apos;s Soil to Farms Across India
              </h3>
              <p style={{ margin: 0, fontSize: '15px', color: 'var(--mute)' }}>
                Read the verified journey of how Kishan Panchal built Farming Solutions India across 10+ states.
              </p>
            </div>
            <Link
              href={`/founders/${story.founderSlug}`}
              className="btn"
              style={{ whiteSpace: 'nowrap' }}
            >
              Read Founder Story →
            </Link>
          </div>
        )}

        {story.pullQuote && (
          <blockquote className="pq">
            {story.pullQuote}
          </blockquote>
        )}

        {story.content.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}

        {story.founderSlug && (
          <div
            style={{
              borderTop: '1px solid var(--line)',
              paddingTop: '20px',
              marginTop: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <span style={{ font: '700 13px var(--hd)', color: 'var(--mute)', display: 'block' }}>
                ARCHIVE ENTRY
              </span>
              <span style={{ font: '600 16px var(--hd)', color: 'var(--ink)' }}>
                Part of the Kishan Panchal Founder Archive
              </span>
            </div>
            <Link
              href={`/founders/${story.founderSlug}`}
              className="btn alt"
              style={{ padding: '8px 18px', fontSize: '14px' }}
            >
              View Kishan for Kisan ↗
            </Link>
          </div>
        )}

        <div className="note" style={{ marginTop: '24px' }}>
          Sample story from the Udyam Manch Editorial Desk. Documenting grassroots Indian builders.
        </div>
      </div>

      {/* Related Stories */}
      {relatedStories.length > 0 && (
        <div className="rel">
          <div className="sec">
            <h2>Related stories</h2>
            <Link href="/stories">All stories</Link>
          </div>
          <div className="g">
            {relatedStories.map((s, idx) => (
              <Link key={idx} href={`/stories/${s.slug}`}>
                <div className="art" style={{ background: 'var(--soft)' }}>
                  <img src={s.coverImage.url} alt={s.coverImage.alt} />
                </div>
                <span className="cat">{s.category}</span>
                <h3>{s.title}</h3>
                <span className="meta">{s.readingTimeMinutes} min read</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
