import type { Metadata } from 'next';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import '@/styles/founders.css';
import FounderCardView from '@/components/founders/FounderCardView';
import { FounderBrowser, FounderStage } from '@/components/founders/FounderBrowser';
import FoundersFx from '@/components/founders/FoundersFx';
import MagneticDots from '@/components/MagneticDots';
import { getFounderCards, spotlightOf, summarize } from '@/lib/journey/listing';
import { FLAGS } from '@/lib/flags';

/**
 * Static with ISR, like the journey pages. New founders show up within a minute.
 * Keep it static: do not read searchParams here, that makes every visit a server render.
 * Filters are applied in the browser by FounderBrowser.
 */
export const revalidate = 60;

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? '';
const FORM = process.env.NEXT_PUBLIC_FEATURE_FORM_URL ?? '/get-featured';

export const metadata: Metadata = {
  title: 'Founders',
  description: 'Discover Indian founders by state, sector and stage. Real people, real businesses, real impact.',
  alternates: { canonical: '/founders' },
  openGraph: { title: 'Founders | Udyam Manch', description: 'Discover Indian founders by state, sector and stage.', type: 'website', images: ['/opengraph-image'] },
};

export default async function FoundersPage() {
  const cards = await getFounderCards();
  const sum = summarize(cards);

  const spotlight = spotlightOf(cards);
  const sectors = sum.sectors.map(([s]) => s);

  const sectorMax = sum.sectors[0]?.[1] ?? 1;
  const yearMax = Math.max(1, ...sum.years.map(([, n]) => n));
  const pct = (n: number, of: number) => `${Math.round((n / of) * 100)}%`;
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: cards.filter((c) => !c.sponsored).slice(0, 24).map((c, i) => ({
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
          <FounderStage counts={sum.states} names={sum.namesByState} sectors={sectors} />
          <div className="fd-leg">Fewer <i data-l="1" /><i data-l="2" /><i data-l="3" /><i data-l="4" /> More founders. Choose a state to filter the list.</div>
        </div>
      </section>

      <div className="fd-mq" aria-hidden="true">
        <div>{[0, 1, 2, 3].map((n) => sum.sectors.map(([s]) => <span key={`${n}${s}`}>{s}</span>))}</div>
      </div>

      {spotlight.length > 0 && (
        <section className="fd-spot">
          <div className="fd-w">
            <div className="fd-sh">
              <h2>Spotlight</h2><span className="fd-tag fd-tag--solid">Sponsored</span>
              <p>Paid placements are always labelled and rotate evenly. They never change the order of the results below.</p>
            </div>
            <div className="fd-grid fd-grid--spot">
              {spotlight.map((c, i) => <FounderCardView key={c.slug} c={c} i={i} />)}
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
        <FounderBrowser cards={cards} sectors={sectors} />
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

      {/* Off for now, see lib/flags.ts. The credit line below stays: the map licence (CC BY 4.0) requires it. */}
      {FLAGS.foundersSubmitCta && (
        <section className="fd-cta">
          <div className="fd-w">
            <h2>Building something in India?</h2>
            <p>Tell us your story through our form. Our team reads every entry and decides what to publish. A submission never guarantees coverage.</p>
            <a className="fd-btn fd-btn--lg fd-mag" href={FORM}>Open the Google Form &rarr;</a>
          </div>
        </section>
      )}
      <p className="fd-w fd-credit">Map outline: @svg-maps/india, CC BY 4.0.</p>
      <FoundersFx />
    </div>
  );
}
