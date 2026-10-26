import { client } from '@/sanity/client';
import { getJourneys } from '@/lib/journey/repo';
import { formatDate, plain, readMinutes } from '@/lib/journey/format';

/**
 * Card shape used by FounderCard and the home page. Derived from the founder
 * journey, so there is one source of truth for founder content.
 */
export interface Founder {
  title: string; // founder name
  slug: string;
  company: string;
  tagline: string;
  location: string;
  verified: boolean;
  sample?: boolean;
  status: 'published';
  publishedAt: string;
  coverImage: { url: string; alt: string };
  stats?: { value: string; label: string }[];
}

export interface Story {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  readingTimeMinutes: number;
  status: 'draft' | 'published';
  /** Placeholder or unverified content. Shows a Sample label, is noindex and stays out of the sitemap. */
  sample?: boolean;
  publishedAt: string;
  coverImage: {
    url: string;
    alt: string;
    caption?: string;
  };
  pullQuote?: string;
  content: string[];
  founderSlug?: string;
  seo: {
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
  };
}

export const SEED_STORIES: Story[] = [
  {
    title: 'Beyond the Metro Moat: Why Tier-2 Manufacturing Is Having Its Decisive Moment',
    slug: 'beyond-the-metro-moat-tier-2-manufacturing',
    excerpt: 'From Rajkot to Coimbatore, specialized industrial clusters are quietly capturing domestic supply chains through vertical discipline and engineering agility.',
    category: 'Manufacturing & Hardware',
    author: 'Rajiv Chordia',
    readingTimeMinutes: 6,
    status: 'published',
    sample: true, // author and facts are unverified placeholders
    publishedAt: '2026-10-08T11:00:00Z',
    coverImage: {
      url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
      alt: 'High tech industrial milling machine cutting metal',
      caption: 'Advanced component machining in Tier-2 manufacturing hubs',
    },
    founderSlug: 'arjun-somani-aarav-hydraulics',
    pullQuote: 'Industrial clusters like Rajkot have 60 years of metallurgy knowledge baked into families. Software cannot replicate that overnight.',
    content: [
      'While venture headlines celebrate consumer internet apps, India’s core capital goods sectors are undergoing an unprecedented technological renaissance.',
      'Hardware founders in cities like Rajkot, Ludhiana, and Belgaum are pairing multi-generational machining expertise with modern 5-axis CNC automation.',
      'The outcome is imported-grade componentry at a fraction of the landed cost, insulating domestic vehicle and equipment makers from global supply chain disruptions.',
    ],
    seo: {
      ogTitle: 'Beyond the Metro Moat: Tier-2 Manufacturing Boom | Udyam Manch',
      ogDescription: 'How localized Indian engineering clusters are quietly replacing imported industrial hardware.',
      ogImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    },
  },
];

// Content Access Helpers (Hybrid Sanity + Curated Fallback)
export async function getFounders(): Promise<Founder[]> {
  const journeys = await getJourneys();
  return journeys.map((j) => ({
    title: j.founder.name,
    slug: j.slug,
    company: j.company.name,
    tagline: plain(j.hero.dek),
    location: j.founder.location ?? j.company.city ?? 'India',
    verified: !j.sample,
    sample: j.sample,
    status: 'published' as const,
    publishedAt: j.publishedAt,
    coverImage: { url: j.hero.image.url, alt: j.hero.image.alt },
    stats: j.sidebar.stats,
  }));
}

export async function getStories(): Promise<Story[]> {
  try {
    if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'udyammanch') {
      const sanityStories = await client.fetch(
        `*[_type == "story" && status == "published"] | order(publishedAt desc) {
          title,
          "slug": slug.current,
          excerpt,
          category,
          author,
          readingTimeMinutes,
          status,
          sample,
          publishedAt,
          "coverImage": {
            "url": coverImage.asset->url,
            "alt": coverImage.alt,
            "caption": coverImage.caption
          },
          pullQuote,
          seo
        }`
      );
      if (sanityStories && sanityStories.length > 0) return sanityStories;
    }
  } catch (err) {
    console.warn('Falling back to local curated stories dataset:', err);
  }
  return SEED_STORIES.filter((s) => s.status === 'published');
}

export async function getStoryBySlug(slug: string): Promise<Story | null> {
  try {
    if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'udyammanch') {
      const sanityStory = await client.fetch(
        `*[_type == "story" && slug.current == $slug && status == "published"][0] {
          title,
          "slug": slug.current,
          excerpt,
          category,
          author,
          readingTimeMinutes,
          status,
          sample,
          publishedAt,
          "coverImage": {
            "url": coverImage.asset->url,
            "alt": coverImage.alt,
            "caption": coverImage.caption
          },
          pullQuote,
          content,
          seo
        }`,
        { slug }
      );
      if (sanityStory) return sanityStory;
    }
  } catch (err) {
    console.warn(`Falling back to local story record for "${slug}":`, err);
  }
  const match = SEED_STORIES.find((s) => s.slug === slug);
  if (!match || match.status !== 'published') return null;
  return match;
}

/**
 * One feed of everything readers can read, newest first: founder journeys plus
 * editorial stories. [REQ-PUB-07] [REQ-PUB-09]
 *
 * WHY: /stories, the home "Latest" list and the sitemap used to read only the
 * hand-written story list, so a new founder journey never appeared there unless
 * someone copied it in by hand (Kishan was copied, Ayush was not). Deriving the
 * feed from both sources means publishing a journey is enough.
 */
export interface FeedItem {
  kind: 'journey' | 'story';
  slug: string;
  href: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  date: string; // "18 Oct 2026"
  readingTimeMinutes: number;
  coverImage: { url: string; alt: string };
  sample?: boolean;
}

export async function getFeed(): Promise<FeedItem[]> {
  const [journeys, stories] = await Promise.all([getJourneys(), getStories()]);
  const fromJourneys: FeedItem[] = journeys.map((j) => ({
    kind: 'journey',
    slug: j.slug,
    href: `/founders/${j.slug}`,
    title: plain(j.hero.title),
    excerpt: plain(j.hero.dek),
    category: j.hero.kicker ?? 'Founder story',
    author: j.author,
    publishedAt: j.publishedAt,
    date: formatDate(j.publishedAt),
    readingTimeMinutes: readMinutes(j),
    coverImage: { url: j.hero.image.url, alt: j.hero.image.alt },
    sample: j.sample,
  }));
  // A story that points at a founder journey is a legacy copy of it. Skip it, the journey is the source.
  const journeySlugs = new Set(journeys.map((j) => j.slug));
  const fromStories: FeedItem[] = stories
    .filter((s) => !(s.founderSlug && journeySlugs.has(s.founderSlug)))
    .map((s) => ({
      kind: 'story',
      slug: s.slug,
      href: `/stories/${s.slug}`,
      title: s.title,
      excerpt: s.excerpt,
      category: s.category,
      author: s.author,
      publishedAt: s.publishedAt,
      date: formatDate(s.publishedAt),
      readingTimeMinutes: s.readingTimeMinutes,
      coverImage: { url: s.coverImage.url, alt: s.coverImage.alt },
      sample: s.sample,
    }));
  return [...fromJourneys, ...fromStories].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/**
 * Slug to title for everything published, split by pin type. Passed to the board
 * so it can drop pins for unpublished items and refresh renamed titles.
 * [REQ-PUB-17] [REQ-PUB-18]
 */
export async function getLiveContent(): Promise<{ founder: Record<string, string>; story: Record<string, string> }> {
  const feed = await getFeed();
  const live = { founder: {} as Record<string, string>, story: {} as Record<string, string> };
  for (const f of feed) {
    if (f.kind === 'journey') live.founder[f.slug] = f.title;
    else live.story[f.slug] = f.title;
  }
  return live;
}
