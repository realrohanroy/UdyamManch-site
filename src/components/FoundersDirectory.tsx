'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

export interface DirectoryItem {
  slug: string;
  name: string;
  company: string;
  desc: string;
  industry: string;
  city: string;
  year: string;
  sample?: boolean;
}

/** Search and industry filter over server-provided items. [REQ-PUB-03] [REQ-PUB-04] */
export default function FoundersDirectory({ items }: { items: DirectoryItem[] }) {
  const [industry, setIndustry] = useState('all');
  const [q, setQ] = useState('');

  const industries = useMemo(
    () => Array.from(new Set(items.map((i) => i.industry).filter(Boolean))).sort(),
    [items],
  );

  const query = q.trim().toLowerCase();
  const shown = items.filter((i) => {
    const inIndustry = industry === 'all' || i.industry === industry;
    const hay = `${i.name} ${i.company} ${i.desc} ${i.city}`.toLowerCase();
    return inIndustry && (!query || hay.includes(query));
  });

  return (
    <>
      <div className="tools">
        <input
          type="search"
          placeholder="Search founders, companies, cities"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search founders"
        />
        <div className="chips" role="toolbar" aria-label="Filter by industry">
          {['all', ...industries].map((ind) => (
            <button key={ind} className="chip" aria-pressed={industry === ind} onClick={() => setIndustry(ind)}>
              {ind === 'all' ? 'All' : ind}
            </button>
          ))}
        </div>
      </div>

      <div className="dir" style={{ paddingBottom: 80 }} aria-live="polite">
        {shown.length === 0 ? (
          <div className="empty">No founders match your search.</div>
        ) : (
          shown.map((c) => (
            <Link key={c.slug} href={`/founders/${c.slug}`}>
              <div>
                <h3>
                  {c.name}, {c.company}
                </h3>
                <p>
                  {c.sample && <strong>Sample. </strong>}
                  {c.desc}
                </p>
              </div>
              <span className="meta">{c.industry}</span>
              <span className="meta">{c.city}</span>
              <span className="meta">{c.year}</span>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
