import PinButton from '@/components/PinButton';
import type { FounderJourney } from '@/lib/journey/types';
import { formatDate, plain } from '@/lib/journey/format';
import { Inline } from './inline';
import ShareIcons from './ShareIcons';

interface Props {
  j: FounderJourney;
  minutes: number;
  url: string;
}

/** Hero: text left, portrait right. Stage decorations are optional. */
export default function JourneyHero({ j, minutes, url }: Props) {
  const { hero, founder, company } = j;
  const stage = hero.stage;
  const shareTitle = plain(hero.title);

  return (
    <section className="hero-grid" aria-label="Founder story header">
      <div className="hero-text-col">
        <span className="hero-tag">
          {hero.kicker ?? 'Founder story'}
          {j.sample && <span className="fj-sample">Sample</span>}
        </span>
        <h1 className="hero-title">
          <Inline text={hero.title} />
        </h1>
        <p className="hero-dek">
          <Inline text={hero.dek} />
        </p>
        <PinButton
          slug={j.slug}
          type="founder"
          title={founder.name}
          subtitle={company.name}
          imageUrl={hero.image.url}
        />
        <div className="hero-byline">
          <div className="av" aria-hidden="true">
            {j.author.charAt(0)}
          </div>
          <div>
            <div className="author">{j.author}</div>
            <div>
              <time dateTime={j.publishedAt}>{formatDate(j.publishedAt)}</time>
              <span className="fj-dot" aria-hidden="true">•</span>
              {minutes} min read
            </div>
          </div>
        </div>
        <div className="fj-share-top">
          <ShareIcons url={url} title={shareTitle} medium="share_top" />
        </div>
      </div>

      <div className="hero-stage">
        <img
          src={hero.image.url}
          alt={hero.image.alt}
          className="hero-double-portrait"
          fetchPriority="high"
        />
        {stage?.scriptName && (
          <div className="stage-label-founder" aria-hidden="true">
            <span className="script-name">
              <Inline text={stage.scriptName} />
            </span>
            {stage.role && (
              <span className="sub-role">
                <Inline text={stage.role} />
              </span>
            )}
          </div>
        )}
        {stage?.quote && (
          <div className="stage-quote-card">
            <span className="sq-mark" aria-hidden="true">“</span>
            <p>“{stage.quote}”</p>
          </div>
        )}
        {stage?.signature && (
          <div className="stage-signature" aria-hidden="true">
            <span className="sig-line1">{stage.signature[0]}</span>
            <span className="sig-line2">{stage.signature[1]}</span>
            <svg width="150" height="12" viewBox="0 0 160 14" fill="none" className="fj-sig-line">
              <path d="M3 10C45 2 110 3 157 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        )}
      </div>
    </section>
  );
}
