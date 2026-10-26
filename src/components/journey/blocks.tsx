import React from 'react';
import type { JourneyBlock } from '@/lib/journey/types';
import { Inline } from './inline';
import { Icon } from './icons';

/**
 * One component per block type. The `never` check at the bottom makes the build fail if
 * someone adds a block type to the model and forgets to render it.
 *
 * Width tiers (fj-col 680, fj-mid 840, fj-wide 1100) are classes, and each layout decides
 * what they mean, so a block never knows which layout it is in. `data-rv` marks a block
 * for the once-only scroll reveal (JourneyFx).
 */
const idx = (i: number): React.CSSProperties => ({ '--i': i }) as React.CSSProperties;

export function Block({ b }: { b: JourneyBlock }) {
  switch (b._type) {
    case 'section':
      return (
        <section className="fj-sec fj-col" id={`ch-${b._key}`} aria-labelledby={b.heading ? `h-${b._key}` : undefined} data-rv>
          {b.heading && <h2 id={`h-${b._key}`}>{b.heading}</h2>}
          {b.paragraphs.map((p, i) => (
            <p key={i}>
              <Inline text={p} />
            </p>
          ))}
        </section>
      );

    case 'quote':
      return (
        <blockquote className="fj-quote fj-mid" data-rv>
          <span className="fj-qg" aria-hidden="true">“</span>
          <p>{b.text}</p>
          {b.cite && <cite>{b.cite}</cite>}
        </blockquote>
      );

    case 'figure':
      return (
        <figure className="fj-figure fj-wide" data-rv>
          <div className="fj-fig" style={b.image.width && b.image.height ? ({ '--ar': `${b.image.width} / ${b.image.height}` } as React.CSSProperties) : undefined}>
            <img src={b.image.url} alt={b.image.alt} width={b.image.width} height={b.image.height} loading="lazy" />
          </div>
          {(b.image.caption || b.image.credit) && (
            <figcaption className="fj-cap">
              {b.image.caption}
              {b.image.credit && <span className="fj-credit"> Photo: {b.image.credit}</span>}
            </figcaption>
          )}
        </figure>
      );

    case 'steps':
      return (
        <ol className="fj-steps fj-mid" aria-label={b.label} style={{ '--n': b.steps.length } as React.CSSProperties} data-rv>
          {b.steps.map((s, i) => (
            <li key={s._key} className={`fj-step fj-t-${s.tone}`} style={idx(i)}>
              <span className="fj-step-n" aria-hidden="true">{i + 1}</span>
              <span className="fj-ic">
                <Icon name={s.icon} size={20} />
              </span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      );

    case 'pillars':
      return (
        <ul className="fj-pillars fj-mid" aria-label={b.label} data-rv>
          {b.items.map((it, i) => (
            <li key={it._key} className={`fj-t-${it.tone}`} style={idx(i)}>
              <span className="fj-ic">
                <Icon name={it.icon} size={28} strokeWidth={1.8} />
              </span>
              <span>{it.label}</span>
            </li>
          ))}
        </ul>
      );

    case 'regions':
      return (
        <div className="fj-regions fj-mid" data-rv>
          {b.map && (
            <figure className="fj-figure">
              <div className="fj-fig">
                <img src={b.map.url} alt={b.map.alt} width={b.map.width} height={b.map.height} loading="lazy" />
              </div>
            </figure>
          )}
          <ul className="fj-pills" aria-label={b.label}>
            {b.regions.map((r, i) => (
              <li key={r} className="fj-pill" style={idx(Math.min(i, 12))}>
                {r}
              </li>
            ))}
          </ul>
        </div>
      );

    case 'note':
      return (
        <p className="fj-note fj-col" data-rv>
          <Inline text={b.text} />
        </p>
      );

    default: {
      const unhandled: never = b;
      return unhandled;
    }
  }
}

export default function JourneyBody({ blocks }: { blocks: JourneyBlock[] }) {
  return (
    <div className="fj-body">
      {blocks.map((b) => (
        <Block key={b._key} b={b} />
      ))}
    </div>
  );
}
