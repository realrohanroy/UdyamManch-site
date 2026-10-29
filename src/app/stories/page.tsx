import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getFeed } from '@/lib/content';
import { cld, cldSrcSet } from '@/lib/cloudinary';

export const metadata: Metadata = {
  title: 'Stories',
  description: 'Startup stories, founder journeys, case studies and business news.',
  openGraph: {
    title: 'Stories | Udyam Manch',
    description: 'Startup stories, founder journeys, case studies and business news.',
    images: ['/opengraph-image'],
  },
};

export const revalidate = 300;

export default async function StoriesDirectoryPage() {
  const stories = await getFeed();

  return (
    <div className="w">
      <div className="ph">
        <h1>Stories</h1>
        <p>Startup stories, founder journeys, case studies and business news.</p>
      </div>

      <div className="feed" style={{ marginBottom: 60 }}>
        {stories.map((s) => {
          return (
            <Link
              key={s.href}
              href={s.href}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(120px, 240px) 1fr',
                gap: 24,
                padding: '24px 0',
                borderBottom: '1px solid var(--line)',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <span
                className="art"
                style={{
                  aspectRatio: '16/11',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  background: 'var(--soft)',
                  position: 'relative',
                  display: 'block',
                }}
              >
                {/* Cards show at most about 400px wide. Cloudinary resizes; other hosts pass through. */}
                <img
                  src={cld(s.coverImage.url, 'c_limit,w_800')}
                  srcSet={cldSrcSet(s.coverImage.url, [400, 800])}
                  sizes="(max-width: 700px) 92vw, 400px"
                  alt={s.coverImage.alt}
                  loading="lazy"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center top',
                    transition: 'transform 0.4s',
                  }}
                />
              </span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 4 }}>
                  <span className="cat">
                    {s.category}
                    {s.sample && <b> · Sample</b>}
                  </span>
                  {s.kind === 'journey' && (
                    <span
                      style={{
                        font: '700 11.5px var(--hd)',
                        color: 'var(--acc2)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}
                    >
                      Founder journey
                    </span>
                  )}
                </div>
                <h3 style={{ fontSize: 28, margin: '4px 0 8px', color: 'var(--ink)' }}>
                  {s.title}
                </h3>
                <p className="dek" style={{ fontSize: 18, margin: '6px 0 12px' }}>
                  {s.excerpt}
                </p>
                <span className="meta">
                  {s.sample && <b>Sample. </b>}
                  {s.author}, {s.date}, {s.readingTimeMinutes} min read
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
