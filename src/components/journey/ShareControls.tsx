'use client';

import { useState } from 'react';
import { shareLinks, tagged } from '@/lib/share';
import { showToast } from '@/lib/journey/toast';
import { BrandSvg, CheckSvg, LinkSvg } from './share-glyphs';

export async function copyLink(url: string, medium: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(tagged(url, 'copy_link', medium));
    showToast('Link copied.');
    return true;
  } catch {
    showToast('Could not copy the link. Copy it from the address bar instead.');
    return false;
  }
}

/** Uses the phone's own share sheet (LinkedIn, X, Instagram, anything installed). Returns false if unavailable. */
export async function nativeShare(url: string, title: string, medium: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.share) return false;
  try {
    await navigator.share({ title, url: tagged(url, 'native', medium) });
  } catch {
    // The reader closed the sheet. That is not an error, so say nothing.
  }
  return true;
}

interface Props {
  url: string;
  title: string;
  medium: string;
  /** Marks the group so the dock knows when the hero row has left view and when the end row is on screen. */
  marker?: 'actions' | 'end';
}

/** Round share buttons. All are 40px and have a text label for screen readers. [REQ-TMP-09, 10, 11, 12] */
export default function ShareControls({ url, title, medium, marker }: Props) {
  const [copied, setCopied] = useState(false);
  const s = shareLinks(url, title, medium);
  const ext = { target: '_blank', rel: 'noopener noreferrer', className: 'fj-sb' } as const;

  return (
    <div
      className="fj-share"
      role="group"
      aria-label="Share this story"
      {...(marker === 'actions' ? { 'data-fj-actions': '' } : marker === 'end' ? { 'data-fj-end-share': '' } : {})}
    >
      <a href={s.whatsapp} {...ext} aria-label="Share on WhatsApp"><BrandSvg name="whatsapp" /></a>
      <a href={s.linkedin} {...ext} aria-label="Share on LinkedIn"><BrandSvg name="linkedin" /></a>
      <a href={s.x} {...ext} aria-label="Share on X"><BrandSvg name="x" /></a>
      <a href={s.facebook} {...ext} aria-label="Share on Facebook"><BrandSvg name="facebook" /></a>
      <button
        type="button"
        className="fj-sb"
        aria-label="Copy link to this story"
        onClick={async () => {
          if (await copyLink(url, medium)) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }
        }}
      >
        {copied ? <CheckSvg /> : <LinkSvg />}
      </button>
    </div>
  );
}

/** A single 40px button that copies any URL, for example the company website. */
export function CopyUrlButton({ url, label }: { url: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="fj-sb"
      aria-label={label}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
          showToast('Link copied.');
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          showToast('Could not copy the link. Copy it from the address bar instead.');
        }
      }}
    >
      {copied ? <CheckSvg /> : <LinkSvg />}
    </button>
  );
}
