'use client';

import { useEffect, useState } from 'react';

export interface ChapterLink {
  id: string;
  title: string;
}

/**
 * "In this story": jump links with a marker on the chapter being read.
 * Works as plain anchor links without JavaScript. The marker is added on top.
 */
export default function ChapterNav({ chapters, label = 'In this story' }: { chapters: ChapterLink[]; label?: string }) {
  const [active, setActive] = useState(chapters[0]?.id);

  useEffect(() => {
    const els = chapters.map((c) => document.getElementById(c.id)).filter((e): e is HTMLElement => Boolean(e));
    if (els.length === 0) return;
    // The chapter whose heading most recently passed the reading line is the current one.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-20% 0px -70% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [chapters]);

  if (chapters.length === 0) return null;
  // A div with a role, not <nav>: editorial.css hides every <nav> element on phones.
  return (
    <div className="fj-chapters" role="navigation" aria-label={label}>
      <h2 className="fj-label-h">{label}</h2>
      <ol>
        {chapters.map((c, i) => (
          <li key={c.id}>
            <a href={`#${c.id}`} aria-current={active === c.id ? 'true' : undefined}>
              <span className="fj-chn" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              {c.title}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
