import { client } from '@/sanity/client';
import { getJourneys } from '@/lib/journey/repo';
import { plain } from '@/lib/journey/format';

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
    title: "Kishan for Kisan: From Rajasthan's Soil to Farms Across India.",
    slug: 'the-field-is-the-real-business-school',
    excerpt: 'How Kishan Panchal turned decades of on-ground experience into Farming Solutions India, building real solutions for farmers across Rajasthan and 10+ states in India.',
    category: 'Founder Story',
    author: 'Udyam Manch Team',
    readingTimeMinutes: 8,
    status: 'published',
    publishedAt: '2026-10-15T12:00:00Z',
    coverImage: {
      url: 'https://res.cloudinary.com/nkhny4aq/image/upload/f_auto,q_auto/v1792668673/field-business-school.webp',
      alt: 'Kishan Panchal with farmers discussing protected agriculture solutions',
      caption: 'The field is the real business school',
    },
    founderSlug: 'kishan-panchal-farming-solutions-india',
    pullQuote: 'The customer’s mud on your boots is the highest form of founder validation.',
    content: [
      'In metropolitan incubators, validation is frequently measured by pitch deck slide counts, investor pedigree, and vanity metrics like GMV subsidized by heavy discounts.',
      'Contrast this with the rural entrepreneur who must demonstrate clear ROI before a farmer commits hard-earned seasonal savings on a new piece of equipment. Here, there are no refunds for broken promises.',
      'When Kishan Panchal launched Farming Solutions India, he spent his first six months sleeping in tractor sheds across five tehsils. He did not pitch investors; he listened to mechanics curse at stripped bolts and observed how fine desert sand jammed delicate intake valves.',
      'This ground reality led to a completely re-engineered chassis that withstood the toughest terrain in northern Gujarat and Rajasthan.',
      'The lesson for modern builders is unambiguous: proximity to the user is your only defensible moat.',
    ],
    seo: {
      ogTitle: "Kishan for Kisan: From Rajasthan's Soil to Farms Across India | Udyam Manch",
      ogDescription: 'How Kishan Panchal turned decades of on-ground experience into Farming Solutions India.',
      ogImage: 'https://res.cloudinary.com/nkhny4aq/image/upload/f_auto,q_auto,w_1200,h_630,c_fill/v1792668702/double-portrait-yellow-halo.webp',
    },
  },
  {
    title: 'Beyond the Metro Moat: Why Tier-2 Manufacturing Is Having Its Decisive Moment',
    slug: 'beyond-the-metro-moat-tier-2-manufacturing',
    excerpt: 'From Rajkot to Coimbatore, specialized industrial clusters are quietly capturing domestic supply chains through vertical discipline and engineering agility.',
    category: 'Manufacturing & Hardware',
    author: 'Rajiv Chordia',
    readingTimeMinutes: 6,
    status: 'published',
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
