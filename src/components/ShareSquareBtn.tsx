'use client';

import React, { useState } from 'react';

interface ShareSquareBtnProps {
  url?: string;
  label?: string;
  isLinkCircle?: boolean;
}

export default function ShareSquareBtn({
  url = 'https://farmingsolutions.in',
  label = 'Share company profile',
  isLinkCircle = false,
}: ShareSquareBtnProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  if (isLinkCircle) {
    return (
      <button
        className="share-btn link-btn"
        onClick={handleCopy}
        aria-label={label}
        title={copied ? 'Link copied!' : 'Copy link'}
        style={copied ? { background: 'var(--acc)', color: '#fff' } : undefined}
      >
        {copied ? (
          <span style={{ fontSize: '13px', fontWeight: 700 }}>✓</span>
        ) : (
          <svg viewBox="0 0 24 24">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        )}
      </button>
    );
  }

  return (
    <button
      className="share-square-btn"
      onClick={handleCopy}
      aria-label={label}
      title={copied ? 'Link copied!' : 'Copy link'}
    >
      {copied ? (
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--acc2)' }}>✓</span>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
      )}
    </button>
  );
}
