/**
 * "At a glance" facts, built only from fields that exist. A missing field is
 * left out, never shown as blank or "Not available". [REQ-TMP-07]
 */
import { STATE_NAMES } from './states';
import type { FounderJourney } from './types';

export interface Fact {
  label: string;
  value: string;
  href?: string;
}

export const hostOf = (url: string): string => {
  try {
    return new URL(url).host.replace(/^www\./, '');
  } catch {
    return url;
  }
};

export function basedIn(j: FounderJourney): string | undefined {
  const state = j.listing ? STATE_NAMES[j.listing.state] : undefined;
  const parts = [j.company.city, state].filter(Boolean) as string[];
  // Do not repeat a name that is already there ("Delhi, Delhi").
  const unique = parts.filter((p, i) => parts.indexOf(p) === i);
  return unique.length ? unique.join(', ') : j.founder.location;
}

export function buildFacts(j: FounderJourney): Fact[] {
  const { company, founder } = j;
  const facts: (Fact | null)[] = [
    { label: 'Founder', value: founder.name },
    { label: 'Company', value: company.name },
    company.industry ? { label: 'Industry', value: company.industry } : null,
    basedIn(j) ? { label: 'Based in', value: basedIn(j)! } : null,
    company.founded ? { label: 'Founded', value: company.founded } : null,
    company.website ? { label: 'Website', value: hostOf(company.website), href: company.website } : null,
  ];
  const out = facts.filter((f): f is Fact => f !== null);
  return out.length >= 2 ? out : [];
}
