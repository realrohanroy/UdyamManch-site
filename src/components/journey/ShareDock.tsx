'use client';

import { useEffect, useState } from 'react';
import { shareLinks } from '@/lib/share';
import { copyLink, nativeShare } from './ShareControls';
import { BrandSvg, LinkSvg, MoreSvg } from './share-glyphs';

/**
 * Sticky share. A pill on desktop, a full width bar at the bottom on phones. [REQ-TMP-09]
 * Shows once the share row in the hero has scrolled away, and hides again when the
 * end of story share row is on screen, so it never sits on top of the same buttons twice.
 */
export default function ShareDock({ url, title, className = '' }: { url: string; title: string; className?: string }) {
  const [shown, setShown] = useState(false);
  const s = shareLinks(url, title, 'share_dock');

  useEffect(() => {
    const top = document.querySelector('[data-fj-actions]');
    const end = document.querySelector('[data-fj-end-share]');
    let topGone = false;
    let endInView = false;

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === top) topGone = !e.isIntersecting && e.boundingClientRect.top < 0;
        if (e.target === end) endInView = e.isIntersecting;
      }
      setShown(topGone && !endInView);
    });
    if (top) io.observe(top);
    if (end) io.observe(end);
    return () => io.disconnect();
  }, []);

  const more = async () => {
    if (await nativeShare(url, title, 'share_dock')) return;
    // No share sheet (most desktops): take the reader to the full set of buttons.
    document.querySelector('[data-fj-end-share]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className={`fj-dock${shown ? ' is-on' : ''} ${className}`.trim()} role="group" aria-label="Share this story">
      <a className="fj-dock-wa" href={s.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp">
        <BrandSvg name="whatsapp" />
        <span className="fj-dock-lbl">Share on WhatsApp</span>
      </a>
      <a className="fj-sb fj-dock-x" href={s.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
        <BrandSvg name="linkedin" />
      </a>
      <a className="fj-sb fj-dock-x" href={s.x} target="_blank" rel="noopener noreferrer" aria-label="Share on X">
        <BrandSvg name="x" />
      </a>
      <button type="button" className="fj-sb" aria-label="More ways to share" onClick={more}>
        <MoreSvg />
      </button>
      <button type="button" className="fj-sb" aria-label="Copy link to this story" onClick={() => copyLink(url, 'share_dock')}>
        <LinkSvg />
      </button>
    </div>
  );
}
