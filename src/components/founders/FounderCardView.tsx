import Link from 'next/link';
import type { CSSProperties } from 'react';
import { initials, type FounderCard } from '@/lib/journey/listing';

/**
 * One founder card. Server component: no JS needed to read or click it.
 * The whole card is clickable through a stretched link on the name.
 * Hover tilt and light are added by FoundersFx. No pin here, by decision.
 */
export default function FounderCardView({ c, i, tone }: { c: FounderCard; i: number; tone?: number }) {
  const t = (tone ?? i) % 4;
  return (
    <article className={`fd-card${c.sponsored ? ' fd-card--sp' : ''}`} style={{ '--d': i % 12 } as CSSProperties}>
      <div className={`fd-pt fd-tone-${t}`}>
        <div className="fd-pt__bg" />
        {c.image ? <img className="fd-pt__img" src={c.image} alt="" loading="lazy" /> : <span className="fd-pt__mono" aria-hidden="true">{initials(c.name)}</span>}
        {c.sample && <span className="fd-tag fd-tag--sample">Sample</span>}
        {c.sponsored && <span className="fd-tag">Sponsored</span>}
        {c.editorsPick && <span className="fd-tag fd-tag--ed">Editor&rsquo;s pick</span>}
        <span className="fd-pt__state">{c.stateName}</span>
      </div>
      <div className="fd-bd">
        <div className="fd-sec">{c.sector.toUpperCase()}</div>
        <h3><Link href={`/founders/${c.slug}`} className="fd-stretch">{c.name}</Link></h3>
        <div className="fd-role">Founder, {c.company}</div>
        {c.metric && (
          <>
            <div className="fd-metric"><b>{c.metric.value}</b><span>{c.metric.label}</span></div>
            <span className={`fd-vt${c.metric.verified ? ' fd-vt--ok' : ''}`}>{c.metric.verified ? 'Verified' : 'Self-reported'}</span>
          </>
        )}
        <div className="fd-rs" aria-hidden="true">Read story <span>&rarr;</span></div>
      </div>
    </article>
  );
}
