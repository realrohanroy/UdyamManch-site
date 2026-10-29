'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { STATE_CODES, type StateCode } from '@/lib/journey/types';
import { STATE_NAMES } from '@/lib/journey/states';
import { INDIA_PATHS, INDIA_VIEWBOX } from './india-states';

interface Props {
  counts: Partial<Record<StateCode, number>>;
  names: Partial<Record<StateCode, string[]>>;
  selected?: StateCode;
  /** Links for choosing a state, or clearing it when already selected. Real links, so they work without JavaScript. */
  hrefs: Record<StateCode, string>;
}

/** India map with a hover card and click to filter. Progressive: every state is a real link. */
export default function FounderMap({ counts, names, selected, hrefs }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const [tip, setTip] = useState<{ code: StateCode; x: number; y: number } | null>(null);
  const [done, setDone] = useState(false);

  const max = Math.max(1, ...STATE_CODES.map((c) => counts[c] ?? 0));
  const level = (n: number) => (n ? Math.min(4, Math.ceil((n / max) * 4)) : 0);

  // Let the states finish dropping in, then switch the entrance animation off.
  useEffect(() => {
    const t = window.setTimeout(() => setDone(true), 2600);
    return () => window.clearTimeout(t);
  }, [counts]);


  // Keyboard and screen reader users get the same name card, placed beside the focused state.
  const showAt = (code: StateCode, el: Element) => {
    const box = wrap.current?.getBoundingClientRect();
    if (!box) return;
    const r = el.getBoundingClientRect();
    let x = r.right - box.left + 12;
    if (x > box.width - 220) x = r.left - box.left - 220;
    const y = Math.min(Math.max(8, r.top - box.top), box.height - 150);
    setTip({ code, x: Math.max(8, x), y });
  };

  const onMove = (e: React.MouseEvent) => {
    const code = (e.target as Element).closest<SVGElement>('[data-id]')?.dataset.id as StateCode | undefined;
    const box = wrap.current?.getBoundingClientRect();
    if (!code || !box) return setTip(null);
    let x = e.clientX - box.left + 18;
    let y = e.clientY - box.top + 18;
    if (x > box.width - 220) x = e.clientX - box.left - 220;
    if (y > box.height - 150) y = e.clientY - box.top - 150;
    setTip({ code, x: Math.max(8, x), y: Math.max(8, y) });
  };

  const n = tip ? counts[tip.code] ?? 0 : 0;
  const who = tip ? names[tip.code] ?? [] : [];

  return (
    <div className="fd-mapwrap" ref={wrap} onMouseMove={onMove} onMouseLeave={() => setTip(null)}>
      <svg ref={svg} className={`fd-map${done ? ' fd-map--done' : ''}`} viewBox={INDIA_VIEWBOX} role="group" aria-label="Map of India. Choose a state to filter founders.">
        <g>
          {STATE_CODES.map((c) => {
            const k = counts[c] ?? 0;
            return (
              <a
                key={c}
                href={hrefs[c]}
                aria-label={`${STATE_NAMES[c]}, ${k} ${k === 1 ? 'founder' : 'founders'}${selected === c ? ', selected' : ''}`}
                onFocus={(e) => showAt(c, e.currentTarget.querySelector('path') ?? e.currentTarget)}
                onBlur={() => setTip(null)}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // new tab still works
                  e.preventDefault();
                  // Filtering happens in the browser (FounderBrowser), so only the URL changes. No server trip.
                  window.history.pushState(null, '', hrefs[c]);
                  document.getElementById('wall')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                <path
                  className={`fd-st${selected === c ? ' fd-st--sel' : ''}`}
                  data-id={c}
                  data-l={level(k)}
                  d={INDIA_PATHS[c]}
                  style={{ '--i': STATE_CODES.indexOf(c) } as CSSProperties}
                />
              </a>
            );
          })}
        </g>
        {/*
          The hovered state, drawn again on top so its lift is never covered by a neighbour.
          A copy, not a reorder: moving the real link in the DOM between pointer down and up
          made the browser drop the click whenever the pointer moved onto a state and clicked at once.
          pointer-events: none, so clicks always reach the real link underneath.
        */}
        {tip && <path key={tip.code} className="fd-st fd-st--top" data-l={level(counts[tip.code] ?? 0)} d={INDIA_PATHS[tip.code]} aria-hidden="true" />}
      </svg>
      <div className={`fd-tip${tip ? ' on' : ''}`} style={tip ? { left: tip.x, top: tip.y } : undefined} aria-hidden="true">
        {tip && (
          <>
            <b>{STATE_NAMES[tip.code]}</b>
            <div className="fd-tip__n">{n} {n === 1 ? 'founder' : 'founders'}</div>
            {n ? <small>{who.slice(0, 3).join(', ')}{who.length > 3 ? ' and more' : ''}</small> : <small>No founders here yet.</small>}
            {n ? <small className="fd-tip__go">Click to filter the list</small> : null}
          </>
        )}
      </div>
    </div>
  );
}
