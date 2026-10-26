import Link from 'next/link';
import PinButton from '@/components/PinButton';
import type { FounderJourney } from '@/lib/journey/types';
import { formatDate, plain, readMinutes } from '@/lib/journey/format';
import { Icon } from './icons';
import ShareControls, { CopyUrlButton } from './ShareControls';

/**
 * End of story pieces. Every layout composes the same parts differently, so a fix to
 * one (say the related list) lands in all three. Each part omits itself when it has no data.
 */
const idx = (i: number): React.CSSProperties => ({ '--i': i }) as React.CSSProperties;

export function CompanyPanel({ j, compact = false }: { j: FounderJourney; compact?: boolean }) {
  const { company } = j;
  return (
    <div className={`fj-company${compact ? ' is-compact' : ''}`}>
      <div className="fj-company-head">
        <span className="fj-logo" aria-hidden="true">
          {company.logo ? <img src={company.logo.url} alt="" width={32} height={32} /> : <Icon name={company.icon ?? 'leaf'} size={24} strokeWidth={2.2} />}
        </span>
        <div>
          <h2 className="fj-company-name">About {company.name}</h2>
          <p className="fj-company-sum">{company.summary}</p>
        </div>
      </div>
      {company.website && (
        <div className="fj-company-actions">
          <a className="fj-btn" href={company.website} target="_blank" rel="noopener noreferrer">
            Visit website <span aria-hidden="true">↗</span>
            <span className="fj-sr"> (opens in a new tab)</span>
          </a>
          <CopyUrlButton url={company.website} label={`Copy ${company.name} website link`} />
        </div>
      )}
    </div>
  );
}

export function StatsAndFeatures({ j }: { j: FounderJourney }) {
  const { stats, features } = j.sidebar;
  if (!stats?.length && !features?.length) return null;
  return (
    <div className="fj-figures">
      {stats && stats.length > 0 && (
        <dl className="fj-stats">
          {stats.map((s) => (
            <div key={s.label} className="fj-stat">
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {features && features.length > 0 && (
        <ul className="fj-feats">
          {features.map((f) => (
            <li key={f._key} className={`fj-feat fj-t-${f.tone}`}>
              <span className="fj-ic">
                <Icon name={f.icon} size={18} />
              </span>
              <h3>{f.label}</h3>
              <p>{f.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function SideQuote({ j }: { j: FounderJourney }) {
  const q = j.sidebar.quote;
  if (!q) return null;
  return (
    <figure className="fj-sidequote" data-rv>
      <span className="fj-qg" aria-hidden="true">“</span>
      <blockquote>
        <p>{q.text}</p>
      </blockquote>
      <figcaption>
        <cite>{q.cite}</cite>
      </figcaption>
    </figure>
  );
}

export function ShareAndPin({ j, url }: { j: FounderJourney; url: string }) {
  return (
    <div className="fj-endshare">
      <h2 className="fj-label-h">Share this story</h2>
      <div className="fj-actions">
        <ShareControls url={url} title={plain(j.hero.title)} medium="share_end" marker="end" />
        <PinButton
          className="fj-pin"
          slug={j.slug}
          type="founder"
          title={j.founder.name}
          subtitle={j.company.name}
          imageUrl={j.hero.image.url}
        />
      </div>
    </div>
  );
}

export function Topics({ j }: { j: FounderJourney }) {
  if (!j.topics?.length) return null;
  return (
    <div className="fj-topicbox">
      <h2 className="fj-label-h">Topics</h2>
      <ul className="fj-topics">
        {j.topics.map((t) => (
          <li key={t} className="fj-tag">
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function KeepReading({ related }: { related: FounderJourney[] }) {
  if (related.length === 0) {
    return (
      <section className="fj-more" aria-labelledby="fj-more">
        <h2 id="fj-more" className="fj-label-h">Keep reading</h2>
        <div className="fj-empty">
          <p className="fj-empty-h">This is the only story here for now</p>
          <p>More founder stories are on the way. Meanwhile, browse everyone we have featured so far.</p>
          <Link className="fj-link" href="/founders">See all founder stories</Link>
        </div>
      </section>
    );
  }
  const [next, ...rest] = related;
  return (
    <section className="fj-more" aria-labelledby="fj-more">
      <h2 id="fj-more" className="fj-label-h">Keep reading</h2>
      <div className="fj-more-grid">
        <Link href={`/founders/${next.slug}`} className="fj-next" data-rv>
          <span className="fj-next-img">
            <img src={next.hero.image.url} alt="" loading="lazy" />
          </span>
          <span className="fj-next-body">
            <span className="fj-next-k">Read next{next.sample ? ' · Sample' : ''}</span>
            <span className="fj-next-t">{plain(next.hero.title)}</span>
            <span className="fj-next-m">
              {formatDate(next.publishedAt)} · {readMinutes(next)} min read
            </span>
          </span>
        </Link>
        {rest.length > 0 && (
          <ul className="fj-rel">
            {rest.map((r, i) => (
              <li key={r.slug} style={idx(i)} data-rv>
                <Link href={`/founders/${r.slug}`}>
                  <span className="fj-rel-k">{r.sample ? 'Sample' : r.hero.kicker ?? 'Founder story'}</span>
                  <span className="fj-rel-t">{plain(r.hero.title)}</span>
                  <span className="fj-rel-m">
                    {formatDate(r.publishedAt)} · {readMinutes(r)} min read
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Link className="fj-link" href="/founders">See all founder stories</Link>
    </section>
  );
}

/** Variant A: the whole end of story wrap. */
export default function JourneyEnd({ j, related, url }: { j: FounderJourney; related: FounderJourney[]; url: string }) {
  const hasFigures = Boolean(j.sidebar.stats?.length || j.sidebar.features?.length);
  return (
    <aside className="fj-end" aria-label="About the company and more stories">
      <div className={`fj-endpanel${hasFigures ? '' : ' is-single'}`} data-rv>
        <CompanyPanel j={j} />
        <StatsAndFeatures j={j} />
      </div>
      <SideQuote j={j} />
      <div className="fj-endrow" data-rv>
        <ShareAndPin j={j} url={url} />
        <Topics j={j} />
      </div>
      <KeepReading related={related} />
    </aside>
  );
}
