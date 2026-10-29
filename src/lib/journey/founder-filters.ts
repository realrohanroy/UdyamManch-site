/**
 * Founders page filtering. Pure functions with no server imports, so the
 * same code runs on the server (first HTML) and in the browser (instant
 * filter clicks). The filters live in the URL, so a filtered view can be
 * shared and the back button works.
 */
import { STATE_CODES, type StateCode } from './types';

export interface FounderCard {
  slug: string;
  name: string;
  company: string;
  sector: string;
  state: StateCode;
  stateName: string;
  city?: string;
  founded?: number;
  image?: string;
  metric?: { value: string; label: string; verified: boolean };
  sponsored: boolean;
  editorsPick: boolean;
  topics: string[];
  sample: boolean;
}

export interface FounderFilters {
  state?: StateCode;
  sector?: string;
  q: string;
  view: 'wall' | 'index';
  page: number;
}

export const NO_FILTERS: FounderFilters = { q: '', view: 'wall', page: 1 };
export const PAGE_SIZE = 12;

/** Reads filters from the query string. Unknown states and sectors are ignored, never trusted. */
export function parseFilters(sp: URLSearchParams, sectors: readonly string[]): FounderFilters {
  const st = sp.get('state') ?? '';
  const sec = sp.get('sector') ?? '';
  return {
    state: (STATE_CODES as readonly string[]).includes(st) ? (st as StateCode) : undefined,
    sector: sectors.includes(sec) ? sec : undefined,
    q: (sp.get('q') ?? '').slice(0, 60),
    view: sp.get('view') === 'index' ? 'index' : 'wall',
    page: Math.max(1, Math.min(20, Number.parseInt(sp.get('page') ?? '1', 10) || 1)),
  };
}

type Change = Partial<Record<'state' | 'sector' | 'q' | 'view' | 'page', string | undefined>>;

/** A link that keeps the current filters and changes some of them. Page resets unless given. */
export function filterHref(f: FounderFilters, change: Change): string {
  const cur: Change = { state: f.state, sector: f.sector, q: f.q || undefined, view: f.view === 'index' ? 'index' : undefined };
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries({ ...cur, ...change })) if (v) p.set(k, v);
  const s = p.toString();
  return `/founders${s ? `?${s}` : ''}`;
}

function rotate<T>(list: T[], by: number): T[] {
  if (!list.length) return list;
  const k = by % list.length;
  return [...list.slice(k), ...list.slice(0, k)];
}

/**
 * Sponsored founders only ever appear in the Spotlight, always labelled, and
 * never change the order of the normal list. Slots rotate daily so paying
 * founders are shown evenly.
 */
export function spotlightOf(cards: FounderCard[]): FounderCard[] {
  const day = Math.floor(Date.now() / 86_400_000);
  return rotate(cards.filter((c) => c.sponsored), day).slice(0, 3);
}

export function queryFounders(cards: FounderCard[], f: FounderFilters) {
  const q = f.q.trim().toLowerCase();
  const matches = cards.filter(
    (c) =>
      !c.sponsored &&
      (!f.state || c.state === f.state) &&
      (!f.sector || c.sector === f.sector) &&
      (!q || `${c.name} ${c.company} ${c.sector} ${c.stateName} ${c.topics.join(' ')}`.toLowerCase().includes(q)),
  );
  return { matches, wall: matches.slice(0, PAGE_SIZE * f.page), total: matches.length };
}

export const initials = (name: string) =>
  name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
