import React from 'react';

/**
 * Renders **bold**, *italic*, ==highlight== and line breaks from a plain string.
 * Output is React elements only, so content can never inject HTML.
 * Devanagari runs get lang="hi" so screen readers pronounce them correctly (WCAG 3.1.2).
 */
const TOKEN = /(\*\*[^*]+\*\*|==[^=]+==|\*[^*]+\*|\n)/g;
const DEVANAGARI = /([ऀ-ॿ][ऀ-ॿ\s]*[ऀ-ॿ]|[ऀ-ॿ])/g;

function withLang(text: string, key: string | number) {
  const parts = text.split(DEVANAGARI);
  if (parts.length === 1) return <React.Fragment key={key}>{text}</React.Fragment>;
  return (
    <React.Fragment key={key}>
      {parts.map((p, i) => (i % 2 === 1 ? <span key={i} lang="hi">{p}</span> : p))}
    </React.Fragment>
  );
}

export function Inline({ text }: { text: string }) {
  const parts = text.split(TOKEN).filter((p) => p !== '');
  return (
    <>
      {parts.map((p, i) => {
        if (p === '\n') return <br key={i} />;
        if (p.startsWith('**')) return <strong key={i}>{withLang(p.slice(2, -2), i)}</strong>;
        if (p.startsWith('==')) return <mark key={i}>{withLang(p.slice(2, -2), i)}</mark>;
        if (p.startsWith('*') && p.length > 2) return <em key={i}>{withLang(p.slice(1, -1), i)}</em>;
        return withLang(p, i);
      })}
    </>
  );
}
