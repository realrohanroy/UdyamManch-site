'use client';

import { Suspense, useEffect, useState, type MouseEvent } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import FounderCardView from './FounderCardView';
import FounderMap from './FounderMap';
import { STATE_NAMES } from '@/lib/journey/states';
import { STATE_CODES, type StateCode } from '@/lib/journey/types';
import {
  NO_FILTERS,
  filterHref,
  initials,
  parseFilters,
  queryFounders,
  spotlightOf,
  type FounderCard,
  type FounderFilters,
} from '@/lib/journey/founder-filters';

/**
 * The filterable parts of /founders: the map caption and map, and the list with its controls.
 *
 * WHY THIS IS A CLIENT COMPONENT
 * Reading the query string on the server made /founders dynamic: every visit and every
 * filter click waited for a server render. Now the page is static (served from the CDN)
 * and filtering happens here, in the browser, on the full list.
 *
 * The server HTML is the unfiltered page (the Suspense fallback), so crawlers and
 * no-JavaScript visitors still get every founder. The trade-off: without JavaScript a
 * filter link opens the full list rather than the filtered one.
 * Clicks change the URL with history.pushState, which Next keeps in sync with
 * useSearchParams, so the back button and shared links keep working.
 */

const go = (e: MouseEvent, href: string) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return; // new tab still works
  e.preventDefault();
  window.history.pushState(null, '', href);
};

function useFilters(sectors: readonly string[]): FounderFilters {
  return parseFilters(new URLSearchParams(useSearchParams()?.toString()), sectors);
}

/* ---------- Map caption and map ---------- */

interface StageProps {
  counts: Partial<Record<StateCode, number>>;
  names: Partial<Record<StateCode, string[]>>;
  sectors: string[];
}

function StageView({ f, counts, names }: StageProps & { f: FounderFilters }) {
  const hrefs = Object.fromEntries(
    STATE_CODES.map((c) => [c, filterHref(f, { state: f.state === c ? undefined : c })]),
  ) as Record<StateCode, string>;
  return (
    <>
      <div className="fd-mapcap">
        <h2>Founders by state</h2>
        {f.state && (
          <a className="fd-selchip" href={filterHref(f, { state: undefined })} onClick={(e) => go(e, filterHref(f, { state: undefined }))}>
            {STATE_NAMES[f.state]} <span aria-label="Clear state">&times;</span>
          </a>
        )}
      </div>
      <FounderMap counts={counts} names={names} selected={f.state} hrefs={hrefs} />
    </>
  );
}

function StageLive(p: StageProps) {
  return <StageView {...p} f={useFilters(p.sectors)} />;
}

export function FounderStage(p: StageProps) {
  return (
    <Suspense fallback={<StageView {...p} f={NO_FILTERS} />}>
      <StageLive {...p} />
    </Suspense>
  );
}

/* ---------- Search, chips and the list ---------- */

interface ListProps {
  cards: FounderCard[];
  sectors: string[];
}

function ListView({ f, cards, sectors }: ListProps & { f: FounderFilters }) {
  const res = queryFounders(cards, f);
  const [q, setQ] = useState(f.q);
  useEffect(() => setQ(f.q), [f.q]); // back button or a cleared filter

  // Results follow the typing. replaceState, so each letter is not a history entry.
  const onType = (v: string) => {
    setQ(v);
    window.history.replaceState(null, '', filterHref(f, { q: v.trim() || undefined }));
  };

  const link = (href: string, label: string, current: boolean, className = 'fd-chip') => (
    <a key={label} className={className} aria-current={current} href={href} onClick={(e) => go(e, href)}>{label}</a>
  );

  return (
    <>
      <div className="fd-ctl">
        <form className="fd-se" action="/founders" method="get" role="search" onSubmit={(e) => e.preventDefault()}>
          {f.state && <input type="hidden" name="state" value={f.state} />}
          {f.sector && <input type="hidden" name="sector" value={f.sector} />}
          {f.view === 'index' && <input type="hidden" name="view" value="index" />}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
          <input name="q" value={q} onChange={(e) => onType(e.target.value)} type="search" placeholder="Search founders, companies, sectors or states" aria-label="Search founders" />
        </form>
        <div className="fd-fl">
          {link(filterHref(f, { sector: undefined }), 'All founders', !f.sector)}
          {sectors.map((s) => link(filterHref(f, { sector: f.sector === s ? undefined : s }), s, f.sector === s))}
          <span className="fd-cnt" role="status">Showing {res.wall.length} of {res.total} founders{f.state ? ` in ${STATE_NAMES[f.state]}` : ''}</span>
          <nav className="fd-vs" aria-label="View">
            {link(filterHref(f, { view: undefined }), 'Wall', f.view === 'wall', '')}
            {link(filterHref(f, { view: 'index' }), 'Index', f.view === 'index', '')}
            <a href="#map">Map</a>
          </nav>
        </div>
      </div>

      {res.wall.length === 0 ? (
        <p className="fd-empty">No founders match. Try another state or sector.</p>
      ) : f.view === 'wall' ? (
        <div className="fd-grid">{res.wall.map((c, i) => <FounderCardView key={c.slug} c={c} i={i} />)}</div>
      ) : (
        <div className="fd-ix">
          {[...spotlightOf(cards), ...res.matches].map((c, i) => (
            <Link key={c.slug} href={`/founders/${c.slug}`} data-tone={i % 4} data-ini={initials(c.name)}>
              <span className="fd-ix__nm">{c.name}{c.sponsored && <em className="fd-tag fd-tag--solid">Sponsored</em>}</span>
              <span className="fd-ix__sec">{c.sector}</span><span>{c.stateName}</span><span>{c.founded ?? ''}</span><span aria-hidden="true">&rarr;</span>
            </Link>
          ))}
        </div>
      )}
      {f.view === 'wall' && res.total > res.wall.length && (
        <div className="fd-more">{link(filterHref(f, { page: String(f.page + 1) }), 'Load more founders', false, 'fd-btn')}</div>
      )}
    </>
  );
}

function ListLive(p: ListProps) {
  return <ListView {...p} f={useFilters(p.sectors)} />;
}

export function FounderBrowser(p: ListProps) {
  return (
    <Suspense fallback={<ListView {...p} f={NO_FILTERS} />}>
      <ListLive {...p} />
    </Suspense>
  );
}
