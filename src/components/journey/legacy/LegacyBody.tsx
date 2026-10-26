import React from 'react';
import type { JourneyBlock } from '@/lib/journey/types';
import { Inline } from '../inline';
import { Icon } from '../icons';

/**
 * One component per block type. The `never` check at the bottom makes the
 * build fail if someone adds a block type to the model and forgets to render it.
 */
function Block({ b }: { b: JourneyBlock }) {
  switch (b._type) {
    case 'section':
      return (
        <div>
          {b.heading && <h2>{b.heading}</h2>}
          {b.paragraphs.map((p, i) => (
            <p key={i}>
              <Inline text={p} />
            </p>
          ))}
        </div>
      );

    case 'quote':
      return (
        <blockquote className="pq">
          <p>{b.text}</p>
          {b.cite && <cite>{b.cite}</cite>}
        </blockquote>
      );

    case 'figure':
      return (
        <figure className="field-banner-wrap">
          <img src={b.image.url} alt={b.image.alt} loading="lazy" />
          {(b.image.caption || b.image.credit) && (
            <figcaption className="cap fl-cap">
              {b.image.caption}
              {b.image.credit && <span className="fl-credit"> Photo: {b.image.credit}</span>}
            </figcaption>
          )}
        </figure>
      );

    case 'steps':
      return (
        <div className="fl-steps" role="list" aria-label={b.label}>
          {b.steps.map((s, i) => (
            <React.Fragment key={s._key}>
              {i > 0 && (
                <div className="stepper-arrow" aria-hidden="true">
                  →
                </div>
              )}
              <div className={`stepper-card fl-t-${s.tone}`} role="listitem">
                <div className="st-icon">
                  <Icon name={s.icon} />
                </div>
                <h4>{s.title}</h4>
                <p>{s.text}</p>
              </div>
            </React.Fragment>
          ))}
        </div>
      );

    case 'pillars':
      return (
        <ul className="fl-pillars" aria-label={b.label}>
          {b.items.map((it) => (
            <li key={it._key} className={`fl-t-${it.tone}`}>
              <span className="fl-ic">
                <Icon name={it.icon} size={28} strokeWidth={1.8} />
              </span>
              <span>{it.label}</span>
            </li>
          ))}
        </ul>
      );

    case 'regions':
      return (
        <div className="expansion-container">
          {b.map && (
            <div className="expansion-map-fig">
              <img src={b.map.url} alt={b.map.alt} loading="lazy" />
            </div>
          )}
          <ul className="expansion-states-wrap fl-plain-list" aria-label={b.label}>
            {b.regions.map((r) => (
              <li key={r} className="state-pill">
                {r}
              </li>
            ))}
          </ul>
        </div>
      );

    case 'note':
      return (
        <p className="note">
          <Inline text={b.text} />
        </p>
      );

    default: {
      const unhandled: never = b;
      return unhandled;
    }
  }
}

export default function LegacyBody({ blocks }: { blocks: JourneyBlock[] }) {
  return (
    <>
      {blocks.map((b) => (
        <Block key={b._key} b={b} />
      ))}
    </>
  );
}
