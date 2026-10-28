/**
 * Founder journey repository. The ONLY way pages read journeys.
 *
 * Pages never know whether content came from Sanity or local files. That keeps
 * the switch to the CMS a configuration change, not a rewrite, and gives us a
 * working site when the CMS is down (REQ-NFR-05).
 */
import { cache } from 'react';
import { client } from '@/sanity/client';
import { LOCAL_JOURNEYS } from '@/content/founders';
import type { FounderJourney } from './types';
import { assertJourneys } from './validate';
import { assertListings } from './validate-listing';

const sanityEnabled = () => {
  const id = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  return Boolean(id && id !== 'udyammanch');
};

const img = (field: string) =>
  `"${field.split('.').pop()}": ${field}{ "url": asset->url, alt, caption, credit }`;

/** Projection that turns Sanity documents into the FounderJourney shape. */
const PROJECTION = `{
  "slug": slug.current, status, sample, publishedAt, "updatedAt": _updatedAt, author,
  founder,
  company{ name, summary, website, icon, industry, city, founded, ${img('logo')} },
  hero{ kicker, title, dek, ${img('image')}, portrait,
        stage{ scriptName, role, quote, "signature": [signatureLine1, signatureLine2] } },
  body[]{
    ...,
    _type == "figure" => { ${img('image')} },
    _type == "regions" => { ${img('map')} }
  },
  sidebar,
  topics,
  listing{ state, metric, placement, placementUntil },
  layout,
  "related": related[]->slug.current,
  seo{ title, description, "image": image.asset->url }
}`;

/** Sanity returns null for empty fields. Drop the ones our types call optional. */
function normalize(j: FounderJourney): FounderJourney {
  const sig = j.hero.stage?.signature?.filter(Boolean) as string[] | undefined;
  return {
    ...j,
    body: (j.body ?? []).filter(Boolean),
    hero: {
      ...j.hero,
      portrait: j.hero.portrait ?? undefined,
      stage: j.hero.stage
        ? { ...j.hero.stage, signature: sig && sig.length === 2 ? (sig as [string, string]) : undefined }
        : undefined,
    },
    sidebar: j.sidebar ?? {},
    listing: j.listing ?? undefined,
    layout: j.layout ?? undefined,
    related: (j.related ?? []).filter(Boolean),
  };
}

let localChecked = false;
function local(): FounderJourney[] {
  if (!localChecked) {
    assertJourneys(LOCAL_JOURNEYS); // fail the build on bad seed content
    assertListings(LOCAL_JOURNEYS);
    localChecked = true;
  }
  return LOCAL_JOURNEYS;
}

const byNewest = (a: FounderJourney, b: FounderJourney) => b.publishedAt.localeCompare(a.publishedAt);
const isLive = (j: FounderJourney) => j.status === 'published' && new Date(j.publishedAt) <= new Date();

/** All published journeys, newest first. Cached per request with React cache(). */
export const getJourneys = cache(async (): Promise<FounderJourney[]> => {
  if (sanityEnabled()) {
    try {
      const docs = await client.fetch<FounderJourney[]>(
        `*[_type == "founderJourney" && status == "published" && !(_id in path("drafts.**"))] | order(publishedAt desc) ${PROJECTION}`,
        {},
        { next: { tags: ['founderJourney'] } },
      );
      if (docs?.length) return docs.map(normalize).filter(isLive);
    } catch (err) {
      console.warn('[journeys] Sanity unavailable, using local content.', err);
    }
  }
  return local().filter(isLive).sort(byNewest);
});

/** One journey, or null for drafts, scheduled and unknown slugs (they 404). [REQ-SEO-09] */
export const getJourney = cache(async (slug: string): Promise<FounderJourney | null> => {
  const all = await getJourneys();
  return all.find((j) => j.slug === slug) ?? null;
});

/** Related journeys that exist and are live. Missing ones drop out quietly. */
export async function getRelated(j: FounderJourney, limit = 3): Promise<FounderJourney[]> {
  const all = await getJourneys();
  const picked = (j.related ?? [])
    .map((s) => all.find((x) => x.slug === s))
    .filter((x): x is FounderJourney => Boolean(x));
  // Top up with the newest other journeys so the sidebar is never empty.
  for (const x of all) {
    if (picked.length >= limit) break;
    if (x.slug !== j.slug && !picked.includes(x)) picked.push(x);
  }
  return picked.slice(0, limit);
}
