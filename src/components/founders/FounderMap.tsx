'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import { STATE_CODES, type StateCode } from '@/lib/journey/types';
import { STATE_NAMES } from '@/lib/journey/states';
import { INDIA_PATHS, INDIA_VIEWBOX } from './india-states';

interface Props {
  counts: Partial<Record<StateCode, number>>;
  names: Partial<Record<StateCode, string[]>>;
  selected?: StateCode;
  /** Server-built links: choosing a state, or clearing it when already selected. Works without JavaScript. */
  hrefs: Record<StateCode, string>;
}

/** India map with a hover card and click to filter. Progressive: every state is a real link. */
export default function FounderMap({ counts, names, selected, hrefs }: Props) {
  const router = useRouter();
  const wrap = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const [tip, setTip] = useState<{ code: StateCode; x: number; y: number } | null>(null);
  const [rings, setRings] = useState<{ x: number; y: number }[]>([]);
  const [done, setDone] = useState(false);

  const max = Math.max(1, ...STATE_CODES.map((c) => counts[c] ?? 0));
  const level = (n: number) => (n ? Math.min(4, Math.ceil((n / max) * 4)) : 0);

  useEffect(() => {
    const top = STATE_CODES.filter((c) => counts[c]).sort((a, b) => (counts[b] ?? 0) - (counts[a] ?? 0)).slice(0, 3);
    const pts: { x: number; y: number }[] = [];
    for (const c of top) {
      const el = svg.current?.querySelector<SVGPathElement>(`[data-id="${c}"]`);
      if (!el) continue;
      const b = el.getBBox();
      pts.push({ x: b.x + b.width / 2, y: b.y + b.height / 2 });
    }
    setRings(pts);
    const t = window.setTimeout(() => setDone(true), 2600);
    return () => window.clearTimeout(t);
  }, [counts]);

  // The hovered state is drawn last so its lift is never covered by a neighbour.
  const order = tip ? [...STATE_CODES.filter((c) => c !== tip.code), tip.code] : [...STATE_CODES];

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
          {order.map((c) => {
            const k = counts[c] ?? 0;
            return (
              <a
                key={c}
                href={hrefs[c]}
                aria-label={`${STATE_NAMES[c]}, ${k} ${k === 1 ? 'founder' : 'founders'}${selected === c ? ', selected' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(hrefs[c], { scroll: false });
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
        <g aria-hidden="true">
          {rings.map((r, i) => (
            <circle key={i} className="fd-ring" cx={r.x} cy={r.y} r={16} style={{ animationDelay: `${i * 0.7}s` }} />
          ))}
        </g>
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
