import React from 'react';

/**
 * Renders **bold**, *italic*, ==highlight== and line breaks from a plain string.
 * Output is React elements only, so content can never inject HTML.
 */
const TOKEN = /(\*\*[^*]+\*\*|==[^=]+==|\*[^*]+\*|\n)/g;

export function Inline({ text }: { text: string }) {
  const parts = text.split(TOKEN).filter((p) => p !== '');
  return (
    <>
      {parts.map((p, i) => {
        if (p === '\n') return <br key={i} />;
        if (p.startsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>;
        if (p.startsWith('==')) return <mark key={i}>{p.slice(2, -2)}</mark>;
        if (p.startsWith('*') && p.length > 2) return <em key={i}>{p.slice(1, -1)}</em>;
        return <React.Fragment key={i}>{p}</React.Fragment>;
      })}
    </>
  );
}
