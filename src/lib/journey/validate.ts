/**
 * Content guard. Runs over local journeys at build time, so a mistake fails the
 * build with a clear message instead of shipping a broken or off-brand page.
 * Mirrors the Sanity schema validation, which guards CMS content the same way.
 */
import type { FounderJourney, ImageRef } from './types';

const EM_DASH = /\u2014/; // Design_System 4.4: never use em dashes

export function validateJourney(j: FounderJourney): string[] {
  const errors: string[] = [];
  const where = (p: string) => `${j.slug}: ${p}`;

  const img = (i: ImageRef | undefined, path: string, decorativeOk = false) => {
    if (!i) return;
    if (!i.url) errors.push(where(`${path}.url is missing`));
    if (!decorativeOk && !i.alt?.trim()) errors.push(where(`${path}.alt is required`));
  };

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(j.slug)) errors.push(where('slug must be lowercase words joined by hyphens'));
  if (!j.hero.title.trim()) errors.push(where('hero.title is required'));
  if (!j.hero.dek.trim()) errors.push(where('hero.dek is required'));
  if (j.hero.title.replace(/==|\n/g, '').length > 90) errors.push(where('hero.title is over 90 characters'));
  img(j.hero.image, 'hero.image');
  img(j.company.logo, 'company.logo', true); // logo sits next to the company name, so empty alt is fine

  const keys = new Set<string>();
  j.body.forEach((b, i) => {
    if (keys.has(b._key)) errors.push(where(`body[${i}] duplicate _key "${b._key}"`));
    keys.add(b._key);
    if (b._type === 'figure') img(b.image, `body[${i}].image`);
    if (b._type === 'regions') img(b.map, `body[${i}].map`);
  });

  const text = JSON.stringify(j);
  if (EM_DASH.test(text)) errors.push(where('contains an em dash. Use a comma, colon or full stop.'));

  return errors;
}

export function assertJourneys(list: FounderJourney[]): void {
  const slugs = new Set<string>();
  const errors = list.flatMap((j) => {
    const e = validateJourney(j);
    if (slugs.has(j.slug)) e.push(`${j.slug}: duplicate slug`);
    slugs.add(j.slug);
    return e;
  });
  if (errors.length) {
    throw new Error(`Founder journey content errors:\n  - ${errors.join('\n  - ')}`);
  }
}
