import type { Metadata } from 'next';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import '@/styles/founders.css';
import FounderCardView from '@/components/founders/FounderCardView';
import FounderMap from '@/components/founders/FounderMap';
import FoundersFx from '@/components/founders/FoundersFx';
import MagneticDots from '@/components/MagneticDots';
import { getFounderCards, initials, queryFounders, summarize } from '@/lib/journey/listing';
import { STATE_NAMES } from '@/lib/journey/states';
import { STATE_CODES, type StateCode } from '@/lib/journey/types';

/** Static with ISR, like the journey pages. New founders show up within a minute. */
export const revalidate = 60;

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? '';
const FORM = process.env.NEXT_PUBLIC_FEATURE_FORM_URL ?? '/get-featured';
const PAGE = 12;

export const metadata: Metadata = {
  title: 'Founders',
  description: 'Discover Indian founders by state, sector and stage. Real people, real businesses, real impact.',
  alternates: { canonical: '/founders' },
  openGraph: { title: 'Founders | Udyam Manch', description: 'Discover Indian founders by state, sector and stage.', type: 'website', images: ['/opengraph-image'] },
};

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function FoundersPage({ searchParams }: { searchParams: Promise<SP> | SP }) {
  const sp = await searchParams;
  const cards = await getFounderCards();
  const sum = summarize(cards);

  const stateParam = one(sp.state);
  const state = (STATE_CODES as readonly string[]).includes(stateParam ?? '') ? (stateParam as StateCode) : undefined;
  const sectorParam = one(sp.sector);
  const sector = sum.sectors.some(([s]) => s === sectorParam) ? sectorParam : undefined;
  const q = (one(sp.q) ?? '').slice(0, 60);
  const view = one(sp.view) === 'index' ? 'index' : 'wall';
  const pageNo = Math.max(1, Math.min(20, Number.parseInt(one(sp.page) ?? '1', 10) || 1));

  const res = queryFounders(cards, { state, sector, q, limit: PAGE * pageNo });

  /** Builds a link that keeps the current filters and changes some of them. */
  const href = (o: Partial<Record<'state' | 'sector' | 'q' | 'view' | 'page', string | undefined>>) => {
    const cur: Record<string, string | undefined> = { state, sector, q: q || undefined, view: view === 'index' ? 'index' : undefined };
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...cur, ...o })) if (v) p.set(k, v);
    const s = p.toString();
    return `/founders${s ? `?${s}` : ''}`;
  };
  const stateHrefs = Object.fromEntries(
    STATE_CODES.map((c) => [c, href({ state: state === c ? undefined : c, page: undefined })]),
  ) as Record<StateCode, string>;

  const sectorMax = sum.sectors[0]?.[1] ?? 1;
  const yearMax = Math.max(1, ...sum.years.map(([, n]) => n));
  const pct = (n: number, of: number) => `${Math.round((n / of) * 100)}%`;
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: res.matches.slice(0, 24).map((c, i) => ({
      '@type': 'ListItem', position: i + 1, name: c.name, url: `${SITE}/founders/${c.slug}`,
    })),
  };

  return (
    <div className="fd-root">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <section className="fd-w fd-hero">
        <div>
          <p className="fd-crumb"><Link href="/">Home</Link> / Founders</p>
          <p className="fd-eyebrow">THE FOUNDERS INDEX</p>
          <h1 className="fd-h1">
            {/* Three sentences, one per line, so the headline breaks the same way at every width */}
            {[['Real', 'people.'], ['Real', 'businesses.'], ['Real', 'impact.']].map((line, row) => (
              <span key={row} className="fd-ln">
                {line.map((w, c) => {
                  const k = row * 2 + c;
                  const word = <span className="fd-wd"><i style={{ '--k': k } as CSSProperties}>{w}</i></span>;
                  return <span key={c}>{row === 2 ? <mark className="fd-mark">{word}</mark> : word}{' '}</span>;
                })}
              </span>
            ))}
          </h1>
          <p className="fd-dek">Discover the journeys of Indian founders who are building, solving and creating opportunities across Bharat. Choose a state on the map to see who is there.</p>
          <div className="fd-stats">
            <a className="fd-stat" href="#wall"><b data-count={sum.total}>{sum.total}</b><span>Founders</span><small>Browse all</small></a>
            <a className="fd-stat" href="#insights"><b data-count={sum.sectors.length}>{sum.sectors.length}</b><span>Sectors</span><small>See the bars</small></a>
            <a className="fd-stat" href="#map"><b data-count={sum.stateCount}>{sum.stateCount}</b><span>States</span><small>Explore the map</small></a>
          </div>
        </div>
        <div className="fd-stage" id="map">
          <div className="fd-dots" aria-hidden="true"><MagneticDots size={1.6} /></div>
          <div className="fd-mapcap">
            <h2>Founders by state</h2>
            {state && <Link className="fd-selchip" href={href({ state: undefined })} scroll={false}>{STATE_NAMES[state]} <span aria-label="Clear state">&times;</span></Link>}
          </div>
          <FounderMap counts={sum.states} names={sum.namesByState} selected={state} hrefs={stateHrefs} />
          <div className="fd-leg">Fewer <i data-l="1" /><i data-l="2" /><i data-l="3" /><i data-l="4" /> More founders. Choose a state to filter the list.</div>
        </div>
      </section>

      <div className="fd-mq" aria-hidden="true">
        <div>{[0, 1, 2, 3].map((n) => sum.sectors.map(([s]) => <span key={`${n}${s}`}>{s}</span>))}</div>
      </div>

      {res.spotlight.length > 0 && (
        <section className="fd-spot">
          <div className="fd-w">
            <div className="fd-sh">
              <h2>Spotlight</h2><span className="fd-tag fd-tag--solid">Sponsored</span>
              <p>Paid placements are always labelled and rotate evenly. They never change the order of the results below.</p>
            </div>
            <div className="fd-grid fd-grid--spot">
              {res.spotlight.map((c, i) => <FounderCardView key={c.slug} c={c} i={i} />)}
              <div className="fd-slot">
                <small>YOUR SPOT</small>
                <h3>Be seen first by founders and investors.</h3>
                <p>Three spotlight slots. Clearly labelled. A monthly report with views and clicks.</p>
                <a className="fd-btn" href={FORM}>Get featured &rarr;</a>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="fd-w" id="wall">
        <div className="fd-ctl">
          <form className="fd-se" action="/founders" method="get" role="search">
            {state && <input type="hidden" name="state" value={state} />}
            {sector && <input type="hidden" name="sector" value={sector} />}
            {view === 'index' && <input type="hidden" name="view" value="index" />}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
            <input name="q" defaultValue={q} type="search" placeholder="Search founders, companies, sectors or states" aria-label="Search founders" />
          </form>
          <div className="fd-fl">
            <Link className="fd-chip" aria-current={!sector} href={href({ sector: undefined, page: undefined })} scroll={false}>All founders</Link>
            {sum.sectors.map(([s]) => (
              <Link key={s} className="fd-chip" aria-current={sector === s} href={href({ sector: sector === s ? undefined : s, page: undefined })} scroll={false}>{s}</Link>
            ))}
            <span className="fd-cnt">Showing {res.wall.length} of {res.total} founders{state ? ` in ${STATE_NAMES[state]}` : ''}</span>
            <nav className="fd-vs" aria-label="View">
              <Link aria-current={view === 'wall'} href={href({ view: undefined })} scroll={false}>Wall</Link>
              <Link aria-current={view === 'index'} href={href({ view: 'index' })} scroll={false}>Index</Link>
              <a href="#map">Map</a>
            </nav>
          </div>
        </div>

        {res.wall.length === 0 ? (
          <p className="fd-empty">No founders match. Try another state or sector.</p>
        ) : view === 'wall' ? (
          <div className="fd-grid">{res.wall.map((c, i) => <FounderCardView key={c.slug} c={c} i={i} />)}</div>
        ) : (
          <div className="fd-ix">
            {[...res.spotlight, ...res.matches].map((c, i) => (
              <Link key={c.slug} href={`/founders/${c.slug}`} data-tone={i % 4} data-ini={initials(c.name)}>
                <span className="fd-ix__nm">{c.name}{c.sponsored && <em className="fd-tag fd-tag--solid">Sponsored</em>}</span>
                <span className="fd-ix__sec">{c.sector}</span><span>{c.stateName}</span><span>{c.founded ?? ''}</span><span aria-hidden="true">&rarr;</span>
              </Link>
            ))}
          </div>
        )}
        {view === 'wall' && res.total > res.wall.length && (
          <div className="fd-more"><Link className="fd-btn" href={href({ page: String(pageNo + 1) })} scroll={false}>Load more founders</Link></div>
        )}
      </section>

      <section className="fd-w fd-ins" id="insights">
        <div className="fd-sh"><h2>By the numbers</h2><p>Redrawn automatically as founders are added.</p></div>
        <div className="fd-row">
          <div className="fd-pn fd-rv"><h3>Founders by sector</h3>
            {sum.sectors.slice(0, 6).map(([s, n]) => (
              <div className="fd-br" key={s}><span>{s}</span><div className="fd-bar"><i style={{ '--w': pct(n, sectorMax) } as CSSProperties} /></div><b>{n}</b></div>
            ))}
          </div>
          <div className="fd-pn fd-rv"><h3>Founded in</h3>
            <div className="fd-yr">
              {sum.years.map(([y, n]) => (
                <div key={y}><div className="fd-bar fd-bar--v"><i style={{ '--h': pct(n, yearMax) } as CSSProperties} /></div>{String(y).slice(2)}</div>
              ))}
            </div>
          </div>
          <div className="fd-pn fd-rv"><h3>How we label numbers</h3>
            <div className="fd-meter fd-bar"><i style={{ '--w': pct(sum.verified, Math.max(1, sum.total)) } as CSSProperties} /></div>
            <b>{sum.verified} verified by our team, {sum.total - sum.verified} self-reported</b>
            <p>We say Verified only after checking a number against a document or a call. Everything else says Self-reported.</p>
          </div>
        </div>
      </section>

      <section className="fd-cta">
        <div className="fd-w">
          <h2>Building something in India?</h2>
          <p>Tell us your story through our form. Our team reads every entry and decides what to publish. A submission never guarantees coverage.</p>
          <a className="fd-btn fd-btn--lg fd-mag" href={FORM}>Open the Google Form &rarr;</a>
        </div>
      </section>
      <p className="fd-w fd-credit">Map outline: @svg-maps/india, CC BY 4.0.</p>
      <FoundersFx />
    </div>
  );
}
