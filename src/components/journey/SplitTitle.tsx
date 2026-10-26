import React from 'react';

/**
 * The headline, one span per word so each word can rise in on its own (UI-SPEC 9.1).
 * Keeps the content rules from inline.tsx: ==highlight== and a literal newline for a break.
 * The h1 carries the plain title in aria-label, so screen readers never hear word by word.
 * Highlight is drawn per word, so the marker survives a line wrap.
 */
const TOKEN = /(==[^=]+==|\n)/g;
const MAX_STAGGER = 14;

export default function SplitTitle({ text }: { text: string }) {
  let i = 0; // word counter for the stagger, shared across the whole title
  const words = (chunk: string, mark: boolean, keyBase: string) =>
    chunk.split(/(\s+)/).map((part, k) => {
      if (part === '') return null;
      if (/^\s+$/.test(part)) return <React.Fragment key={`${keyBase}-${k}`}> </React.Fragment>;
      const idx = Math.min(i++, MAX_STAGGER);
      return (
        <span
          key={`${keyBase}-${k}`}
          className={mark ? 'fj-w fj-mk' : 'fj-w'}
          style={{ '--i': idx } as React.CSSProperties}
          aria-hidden="true"
        >
          {part}
        </span>
      );
    });

  return (
    <>
      {text
        .split(TOKEN)
        .filter((p) => p !== '')
        .map((p, n) => {
          // A deliberate break, kept on wide screens only (journey.css hides .fj-br on phones).
          // The space matters: with the break hidden on phones it is what separates the two words.
          if (p === '\n')
            return (
              <React.Fragment key={n}>
                <br className="fj-br" />{' '}
              </React.Fragment>
            );
          if (p.startsWith('==')) return <React.Fragment key={n}>{words(p.slice(2, -2), true, `m${n}`)}</React.Fragment>;
          return <React.Fragment key={n}>{words(p, false, `t${n}`)}</React.Fragment>;
        })}
    </>
  );
}
