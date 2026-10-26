import { STATE_CODES, type FounderJourney } from './types';

/**
 * Build-time guard for the Founders page facts. Same idea as validate.ts:
 * rules that fail the build do not get forgotten.
 */
export function assertListings(journeys: FounderJourney[]): void {
  const errors: string[] = [];
  const dash = /\u2014/;
  for (const j of journeys) {
    const l = j.listing;
    if (!l) continue;
    const at = `[${j.slug}] listing`;
    if (!(STATE_CODES as readonly string[]).includes(l.state)) errors.push(`${at}: unknown state "${l.state}"`);
    if (!j.company.industry) errors.push(`${at}: company.industry is needed (it is the sector filter)`);
    if (l.metric) {
      if (!l.metric.value.trim() || l.metric.value.length > 12) errors.push(`${at}.metric.value must be 1 to 12 characters`);
      if (!l.metric.label.trim() || l.metric.label.length > 40) errors.push(`${at}.metric.label must be 1 to 40 characters`);
      if (dash.test(l.metric.value + l.metric.label)) errors.push(`${at}.metric: no em dashes`);
    }
    if (l.placement === 'sponsored' && !l.placementUntil) errors.push(`${at}: a sponsored slot needs placementUntil (paid slots must end)`);
    if (l.placementUntil && Number.isNaN(Date.parse(l.placementUntil))) errors.push(`${at}.placementUntil is not a valid date`);
  }
  if (errors.length) throw new Error(`Founders listing content problems:\n - ${errors.join('\n - ')}`);
}
