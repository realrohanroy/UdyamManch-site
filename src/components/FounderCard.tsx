'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bookmark, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { useBoard } from '@/lib/board';
import { Founder } from '@/lib/content';

interface FounderCardProps {
  founder: Founder;
}

export default function FounderCard({ founder }: FounderCardProps) {
  const { togglePin, isPinned } = useBoard();
  const pinned = isPinned(founder.slug);

  const handlePin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    togglePin({
      slug: founder.slug,
      type: 'founder',
      title: founder.title,
      subtitle: founder.company,
      imageUrl: founder.coverImage.url,
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
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
      }}
    >
      {/* Portrait Header */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 280,
          background: 'var(--bg-subtle)',
          overflow: 'hidden',
        }}
      >
        <Link href={`/founders/${founder.slug}`} style={{ display: 'block', width: '100%', height: '100%' }}>
          <Image
            src={founder.coverImage.url}
            alt={founder.coverImage.alt || founder.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{
              objectFit: 'cover',
              objectPosition: 'top center',
            }}
          />
        </Link>

        {/* Pin Button */}
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

        {/* Location Badge */}
        <div style={{ position: 'absolute', bottom: 12, left: 12, zIndex: 4 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(13, 15, 20, 0.75)',
              backdropFilter: 'blur(6px)',
              color: '#fff',
            }}
          >
            <MapPin size={12} color="var(--acc)" />
            <span>{founder.location}</span>
          </span>
        </div>
      </div>

      {/* Profile Details */}
      <div
        style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <h3
              style={{
                fontFamily: 'var(--font-sans), sans-serif',
                fontSize: '1.35rem',
                fontWeight: 800,
                color: 'var(--ink)',
                letterSpacing: '-0.02em',
              }}
            >
              <Link href={`/founders/${founder.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {founder.title}
              </Link>
            </h3>
            {founder.verified && (
              <span title="Verified Udyam Manch Founder Story" style={{ display: 'inline-flex', color: 'var(--acc2)' }}>
                <CheckCircle2 size={17} />
              </span>
            )}
          </div>

          <div
            style={{
              fontSize: '0.88rem',
              fontWeight: 700,
              color: 'var(--acc)',
              marginBottom: 12,
            }}
          >
            {founder.company}
          </div>

          <p
            style={{
              fontSize: '0.92rem',
              lineHeight: 1.6,
              color: 'var(--ink-secondary)',
              marginBottom: 20,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {founder.tagline}
          </p>

          {/* First Stat highlight if present */}
          {founder.stats && founder.stats.length > 0 && (
            <div
              style={{
                background: 'var(--bg-subtle)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'baseline',
                gap: 8,
              }}
            >
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-sans)' }}>
                {founder.stats[0].value}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', fontWeight: 600 }}>
                {founder.stats[0].label}
              </span>
            </div>
          )}
        </div>

        <Link
          href={`/founders/${founder.slug}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.88rem',
            fontWeight: 700,
            color: 'var(--acc)',
            marginTop: 'auto',
          }}
        >
          <span>Explore Journey</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}
