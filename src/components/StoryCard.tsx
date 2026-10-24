'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bookmark, Clock, ArrowRight } from 'lucide-react';
import { useBoard } from '@/lib/board';
import { Story } from '@/lib/content';

interface StoryCardProps {
  story: Story;
  featured?: boolean;
}

export default function StoryCard({ story, featured = false }: StoryCardProps) {
  const { togglePin, isPinned } = useBoard();
  const pinned = isPinned(story.slug);

  const handlePin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    togglePin({
      slug: story.slug,
      type: 'story',
      title: story.title,
      subtitle: story.category,
      imageUrl: story.coverImage.url,
    });
  };

  return (
    <article
      className="card-hover"
      style={{
        borderRadius: 'var(--radius-md)',
        background: 'var(--card)',
        border: '1px solid var(--line)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: featured ? 'row' : 'column',
        position: 'relative',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
      }}
    >
      {/* Cover Image Container */}
      <div
        style={{
          position: 'relative',
          width: featured ? '48%' : '100%',
          height: featured ? 'auto' : 240,
          minHeight: 220,
          background: 'var(--bg-subtle)',
          overflow: 'hidden',
        }}
      >
        <Link href={`/stories/${story.slug}`} style={{ display: 'block', width: '100%', height: '100%' }}>
          <Image
            src={story.coverImage.url}
            alt={story.coverImage.alt || story.title}
            fill
            sizes={featured ? '(max-width: 900px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
            style={{
              objectFit: 'cover',
              transition: 'transform 0.4s var(--ease-editorial)',
            }}
          />
        </Link>

        {/* Pin to Board Button */}
        <button
          onClick={handlePin}
          aria-label={pinned ? 'Unpin from My Board' : 'Pin to My Board'}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: pinned ? 'var(--pin-red)' : 'rgba(13, 15, 20, 0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.2s ease',
            zIndex: 5,
          }}
          title={pinned ? 'Unpin from My Board' : 'Pin to My Board'}
        >
          <Bookmark size={16} fill={pinned ? '#fff' : 'none'} />
        </button>

        {/* Category Badge on image */}
        <div style={{ position: 'absolute', bottom: 12, left: 12, zIndex: 4 }}>
          <span className="badge">{story.category}</span>
        </div>
      </div>

      {/* Content Body */}
      <div
        style={{
          padding: featured ? '36px 32px' : '24px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.78rem',
              color: 'var(--ink-muted)',
              marginBottom: 12,
            }}
          >
            <Clock size={13} />
            <span>{story.readingTimeMinutes} min read</span>
            <span>·</span>
            <span>{story.author}</span>
          </div>

          <h3
            style={{
              fontFamily: 'var(--font-sans), sans-serif',
              fontSize: featured ? 'clamp(1.4rem, 2vw, 1.85rem)' : '1.25rem',
              fontWeight: 800,
              lineHeight: 1.3,
              letterSpacing: '-0.02em',
              color: 'var(--ink)',
              marginBottom: 12,
            }}
          >
            <Link
              href={`/stories/${story.slug}`}
              style={{
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              {story.title}
            </Link>
          </h3>

          <p
            style={{
              fontSize: '0.94rem',
              lineHeight: 1.6,
              color: 'var(--ink-secondary)',
              marginBottom: 20,
              display: '-webkit-box',
              WebkitLineClamp: featured ? 3 : 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {story.excerpt}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <Link
            href={`/stories/${story.slug}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.88rem',
              fontWeight: 700,
              color: 'var(--acc)',
            }}
          >
            <span>Read Story</span>
            <ArrowRight size={14} />
          </Link>

          {story.founderSlug && (
            <Link
              href={`/founders/${story.founderSlug}`}
              style={{
                fontSize: '0.8rem',
                color: 'var(--ink-muted)',
                textDecoration: 'underline',
              }}
            >
              View Founder
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
