import { buildFacts } from '@/lib/journey/facts';
import type { FounderJourney } from '@/lib/journey/types';

/** "At a glance": who, what and where, built from fields that exist. Omitted if there is not enough data. */
export default function FactsStrip({ j, className = '' }: { j: FounderJourney; className?: string }) {
  const facts = buildFacts(j);
  if (facts.length === 0) return null;

  return (
    <section className={`fj-glance ${className}`} aria-labelledby="fj-facts">
      <h2 id="fj-facts" className="fj-label-h">
        {j.sample ? 'At a glance (sample details)' : 'At a glance'}
      </h2>
      <dl className="fj-facts">
        {facts.map((f, i) => (
          <div key={f.label} className={`fj-fact${f.label === 'Website' ? ' fj-fact-wide' : ''}`} style={{ '--i': i } as React.CSSProperties}>
            <dt>{f.label}</dt>
            <dd>
              {f.href ? (
                <a href={f.href} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${f.value}, opens in a new tab`}>
                  {f.value} <span aria-hidden="true">↗</span>
                </a>
              ) : (
                f.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
