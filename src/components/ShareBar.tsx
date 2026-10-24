'use client';

import React, { useState } from 'react';
import { Share2, Link as LinkIcon, Check, MessageCircle } from 'lucide-react';

interface ShareBarProps {
  title: string;
  url?: string;
}

export default function ShareBar({ title, url }: ShareBarProps) {
  const [copied, setCopied] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : url || 'https://udyammanch.in';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn('Failed to copy link:', e);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          url: currentUrl,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title}. Read on Udyam Manch: ${currentUrl}`)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}&via=udyammanch`;

  return (
    <aside
      aria-label="Share article"
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
        padding: '16px 20px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--card)',
        border: '1px solid var(--line)',
        margin: '32px 0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink)' }}>
        <Share2 size={16} color="var(--acc)" />
        <span>Share:</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {/* WhatsApp (Primary Indian Channel) */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(34, 197, 94, 0.12)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            color: 'var(--green)',
            fontSize: '0.82rem',
            fontWeight: 700,
            textDecoration: 'none',
          }}
          title="Share directly to WhatsApp chat or status"
        >
          <MessageCircle size={15} />
          <span>WhatsApp</span>
        </a>

        {/* LinkedIn */}
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(2, 132, 199, 0.12)',
            border: '1px solid rgba(2, 132, 199, 0.3)',
            color: 'var(--acc2)',
            fontSize: '0.82rem',
            fontWeight: 700,
            textDecoration: 'none',
          }}
          title="Share to LinkedIn feed"
        >
          <span>LinkedIn</span>
        </a>

        {/* X / Twitter */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--line)',
            color: 'var(--ink-secondary)',
            fontSize: '0.82rem',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          <span>X / Post</span>
        </a>

        {/* Copy Link Button */}
        <button
          onClick={handleCopy}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            background: copied ? 'var(--acc)' : 'var(--bg-subtle)',
            border: `1px solid ${copied ? 'var(--acc)' : 'var(--line)'}`,
            color: copied ? '#fff' : 'var(--ink)',
            fontSize: '0.82rem',
            fontWeight: 700,
            transition: 'all 0.2s ease',
          }}
          title="Copy direct permanent link"
        >
          {copied ? <Check size={14} /> : <LinkIcon size={14} />}
          <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
        </button>

        {/* Native Web Share for Mobile */}
        <button
          onClick={handleNativeShare}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--line)',
            color: 'var(--ink)',
            fontSize: '0.82rem',
            fontWeight: 700,
          }}
        >
          <span>More...</span>
        </button>
      </div>
    </aside>
  );
}
