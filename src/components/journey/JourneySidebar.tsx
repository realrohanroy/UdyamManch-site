import Link from 'next/link';
import ShareSquareBtn from '@/components/ShareSquareBtn';
import type { FounderJourney } from '@/lib/journey/types';
import { formatDate, plain, readMinutes } from '@/lib/journey/format';
import { Icon } from './icons';
import ShareIcons from './ShareIcons';

interface Props {
  j: FounderJourney;
  related: FounderJourney[];
  url: string;
}

export default function JourneySidebar({ j, related, url }: Props) {
  const { company, sidebar } = j;

  return (
    <aside className="sidebar" aria-label="Company overview and related stories">
      <div className="company-card">
        <div className="company-header">
          <div className="company-icon" aria-hidden="true">
            {company.logo ? (
              <img src={company.logo.url} alt="" width={30} height={30} className="fj-logo" />
            ) : (
              <Icon name={company.icon ?? 'leaf'} size={24} strokeWidth={2.2} />
            )}
          </div>
          <div>
            <h2 className="company-title">{company.name}</h2>
            <p className="company-subtitle">{company.summary}</p>
          </div>
        </div>

        {company.website && (
          <div className="visit-btn-row">
            <a href={company.website} target="_blank" rel="noopener noreferrer" className="visit-site-btn">
              Visit website <span aria-hidden="true">↗</span>
            </a>
            <ShareSquareBtn url={company.website} label={`Copy ${company.name} website link`} />
          </div>
        )}

        {sidebar.stats && sidebar.stats.length > 0 && (
          <dl className="company-stats-grid">
            {sidebar.stats.map((s) => (
              <div className="stat-cell" key={s.label}>
                <dt className="stat-lbl">{s.label}</dt>
                <dd className="stat-num">{s.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {sidebar.features && sidebar.features.length > 0 && (
          <ul className="fj-feats">
            {sidebar.features.map((f) => (
              <li key={f._key} className={`fj-feat fj-t-${f.tone}`}>
                <span className="fj-ic">
                  <Icon name={f.icon} size={16} />
                </span>
                <span className="fj-feat-l">{f.label}</span>
                <span className="fj-feat-d">{f.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {sidebar.quote && (
        <figure className="sidebar-quote-box">
          <span className="sq-sym" aria-hidden="true">“</span>
          <blockquote>
            <p>“{sidebar.quote.text}”</p>
          </blockquote>
          <figcaption>
            <cite>{sidebar.quote.cite}</cite>
          </figcaption>
        </figure>
      )}

      {related.length > 0 && (
        <section aria-labelledby="fj-related">
          <div className="sidebar-section-title">
            <h2 id="fj-related" className="fj-h-reset">Related stories</h2>
            <Link href="/founders">View all →</Link>
          </div>
          <div className="related-list">
            {related.map((r) => (
              <Link key={r.slug} href={`/founders/${r.slug}`} className="related-card">
                <div className="related-thumb">
                  <img src={r.hero.image.url} alt="" loading="lazy" />
                </div>
                <div>
                  <div className="related-cat">{r.sample ? 'Sample' : r.hero.kicker ?? 'Founder story'}</div>
                  <div className="related-title">{plain(r.hero.title)}</div>
                  <div className="related-meta">
                    {formatDate(r.publishedAt)} • {readMinutes(r)} min read
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="fj-share">
        <div className="sidebar-section-title">
          <h2 id="fj-share" className="fj-h-reset">Share this story</h2>
        </div>
        <ShareIcons url={url} title={plain(j.hero.title)} medium="share_sidebar" />
      </section>

      {j.topics && j.topics.length > 0 && (
        <section aria-labelledby="fj-topics">
          <div className="sidebar-section-title">
            <h2 id="fj-topics" className="fj-h-reset">Topics</h2>
          </div>
          <ul className="fj-topics">
            {j.topics.map((t) => (
              <li key={t} className="chip fj-topic">
                {t}
              </li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  );
}
