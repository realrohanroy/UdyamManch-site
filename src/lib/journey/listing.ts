/**
 * Founders page data. Reads ONLY through repo.ts (getJourneys), so it works the
 * same with Sanity or local files. Pure helpers below have no side effects.
 */
import { cache } from 'react';
import { getJourneys } from './repo';
import { STATE_NAMES } from './states';
import type { FounderJourney, StateCode } from './types';
import type { FounderCard } from './founder-filters';

// Filtering is shared with the browser, so it lives in founder-filters.ts (no server imports).
export * from './founder-filters';

function toCard(j: FounderJourney, now: number): FounderCard | null {
  const l = j.listing;
  if (!l) return null;
  const live = !l.placementUntil || Date.parse(l.placementUntil) >= now;
  const placement = live ? l.placement : undefined;
  const founded = Number.parseInt(j.company.founded ?? '', 10);
  return {
    slug: j.slug,
    name: j.founder.name,
    company: j.company.name,
    sector: j.company.industry ?? 'Other',
    state: l.state,
    stateName: STATE_NAMES[l.state],
    city: j.company.city,
    founded: Number.isFinite(founded) ? founded : undefined,
    image: j.hero.image?.url,
    metric: l.metric,
    sponsored: placement === 'sponsored',
    editorsPick: placement === 'editors-pick',
    topics: j.topics ?? [],
    sample: Boolean(j.sample),
  };
}

/** Every live journey that has Founders page facts. */
export const getFounderCards = cache(async (): Promise<FounderCard[]> => {
  const now = Date.now();
  const all = await getJourneys();
  return all.map((j) => toCard(j, now)).filter((c): c is FounderCard => c !== null);
});

/** Numbers for the hero, map and insights. Always computed from the real list. */
export function summarize(cards: FounderCard[]) {
  const states: Partial<Record<StateCode, number>> = {};
  const namesByState: Partial<Record<StateCode, string[]>> = {};
  const sectors = new Map<string, number>();
  const years = new Map<number, number>();
  let verified = 0;
  for (const c of cards) {
    states[c.state] = (states[c.state] ?? 0) + 1;
    (namesByState[c.state] ??= []).push(c.name);
    sectors.set(c.sector, (sectors.get(c.sector) ?? 0) + 1);
    if (c.founded) years.set(c.founded, (years.get(c.founded) ?? 0) + 1);
    if (c.metric?.verified) verified += 1;
  }
  return {
    total: cards.length,
    states,
    namesByState,
    stateCount: Object.keys(states).length,
    sectors: Array.from(sectors.entries()).sort((a, b) => b[1] - a[1]),
    years: Array.from(years.entries()).sort((a, b) => a[0] - b[0]),
    verified,
  };
}

