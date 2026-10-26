import PinButton from '@/components/PinButton';
import type { FounderJourney } from '@/lib/journey/types';
import { formatDate, plain } from '@/lib/journey/format';
import { Inline } from './inline';
import ShareControls from './ShareControls';
import SplitTitle from './SplitTitle';

interface Props {
  j: FounderJourney;
  minutes: number;
  url: string;
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');

/**
 * Hero shared by all three layouts. It is a div, not a <header>: editorial.css styles every
 * <header> element as the sticky, blurred site header, which pinned the hero to the top of the screen.
 *
 * Shared by all three layouts. The structure never changes, the layout CSS
 * (data-fj-layout on the page) decides where each part sits. Order in the DOM:
 * kicker, title, then the stage (lead text and actions, then the portrait art).
 */
export default function JourneyHero({ j, minutes, url }: Props) {
  const { hero, founder, company } = j;
  const stage = hero.stage;
  const img = hero.image;

  return (
    <div className="fj-hero">
      <p className="fj-kicker">
        <span className="fj-dot" aria-hidden="true" />
        <span>{hero.kicker ?? 'Founder story'}</span>
        {company.industry && <span className="fj-kicker-sub">{company.industry}</span>}
        {j.sample && <span className="fj-sample">Sample</span>}
      </p>

      <h1 className="fj-title" aria-label={plain(hero.title)}>
        <SplitTitle text={hero.title} />
      </h1>

      <div className="fj-stage">
        <div className="fj-lead">
          <p className="fj-dek">
            <Inline text={hero.dek} />
          </p>

          <div className="fj-meta">
            <span className="fj-av" aria-hidden="true">{initials(j.author)}</span>
            <span>
              <span className="fj-author">{j.author}</span>
              <span className="fj-when">
                <time dateTime={j.publishedAt}>{formatDate(j.publishedAt)}</time>
                <span aria-hidden="true"> · </span>
                {minutes} min read
              </span>
            </span>
          </div>

          <div className="fj-actions">
            <PinButton
              className="fj-pin"
              slug={j.slug}
              type="founder"
              title={founder.name}
              subtitle={company.name}
              imageUrl={img.url}
            />
            <ShareControls url={url} title={plain(hero.title)} medium="share_top" marker="actions" />
          </div>
        </div>

        <div className="fj-stage-art" style={img.width && img.height ? ({ '--ar': `${img.width} / ${img.height}` } as React.CSSProperties) : undefined}>
          <img
            className="fj-stage-img"
            src={img.url}
            alt={img.alt}
            width={img.width}
            height={img.height}
            fetchPriority="high"
          />

          {stage?.scriptName && (
            <div className="fj-script" aria-hidden="true">
              <span className="fj-script-name">
                <Inline text={stage.scriptName} />
              </span>
              {stage.role && (
                <span className="fj-role">
                  <Inline text={stage.role} />
                </span>
              )}
            </div>
          )}

          {stage?.signature && (
            <div className="fj-sig" aria-hidden="true">
              <span>{stage.signature[0]}</span>
              <span>{stage.signature[1]}</span>
              <svg width="150" height="12" viewBox="0 0 160 14" fill="none">
                <path d="M3 10C45 2 110 3 157 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          )}

          {stage?.quote && (
            <p className="fj-sq">
              <span aria-hidden="true">“</span>
              {stage.quote}
              <span aria-hidden="true">”</span>
            </p>
          )}

          <div className="fj-stage-cover" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
