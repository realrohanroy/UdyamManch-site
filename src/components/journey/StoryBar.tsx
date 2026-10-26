'use client';

import { useEffect, useState } from 'react';
import { shareLinks } from '@/lib/share';
import { copyLink } from './ShareControls';
import { BrandSvg, LinkSvg } from './share-glyphs';
import type { ChapterLink } from './ChapterNav';

/**
 * Chapters layout only: a bar docked under the site header once the hero band has left view.
 * Shows which chapter you are in ("02 of 03"), and keeps share one tap away. Desktop only,
 * phones get the bottom ShareDock instead.
 */
export default function StoryBar({ company, chapters, url, title }: { company: string; chapters: ChapterLink[]; url: string; title: string }) {
  const [on, setOn] = useState(false);
  const [at, setAt] = useState(0);
  const s = shareLinks(url, title, 'share_bar');

  useEffect(() => {
    const hero = document.querySelector('.fj-hero');
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setOn(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const els = chapters.map((c) => document.getElementById(c.id));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setAt(els.indexOf(e.target as HTMLElement));
      },
      { rootMargin: '-20% 0px -70% 0px' },
    );
    els.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [chapters]);

  const cur = chapters[Math.max(0, at)];
  return (
    <div className={`fj-bar${on ? ' is-on' : ''}`} role="group" aria-label="Story bar">
      <span className="fj-bar-co">{company}</span>
      {cur && (
        <span className="fj-bar-ch">
          <span aria-hidden="true">{String(Math.max(0, at) + 1).padStart(2, '0')} of {String(chapters.length).padStart(2, '0')}</span>
          <span className="fj-sr">Chapter {Math.max(0, at) + 1} of {chapters.length}: </span> {cur.title}
        </span>
      )}
      <span className="fj-bar-actions">
        <a className="fj-sb" href={s.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp"><BrandSvg name="whatsapp" /></a>
        <a className="fj-sb" href={s.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn"><BrandSvg name="linkedin" /></a>
        <button type="button" className="fj-sb" aria-label="Copy link to this story" onClick={() => copyLink(url, 'share_bar')}><LinkSvg /></button>
      </span>
    </div>
  );
}
