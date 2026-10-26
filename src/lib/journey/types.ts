/**
 * Founder Journey content model.  [REQ-TMP-01] [REQ-TMP-02] [REQ-TMP-05] [REQ-TMP-07]
 *
 * WHY A BLOCK MODEL
 * A journey page is a fixed template (hero, article, sidebar) whose article is an
 * ordered list of typed blocks. Writers choose blocks and fill fields; they never
 * design pages (PRD 2, goal 4). Every block `_type` here has a matching object
 * type in the Sanity schema and a matching React component in
 * components/journey/blocks.tsx. Add a block in all three places or not at all.
 *
 * `_type` and `_key` follow Sanity's own conventions, so data coming out of the
 * CMS and data from local seed files have exactly the same shape.
 *
 * TEXT FIELDS
 * Plain strings with three inline marks, parsed safely (never as HTML):
 *   **bold**   *italic*   ==highlight==
 */

/**
 * Colour families for steps, pillars and features. Map to --tone-* tokens.
 * Arrays (not just types) so the Sanity schema builds its dropdowns from the
 * same list. One list, so code and CMS cannot drift apart.
 */
export const TONES = ['gold', 'green', 'teal', 'indigo'] as const;
export type Tone = (typeof TONES)[number];

/** Icons content may use. Rendered by components/journey/icons.tsx. */
export const ICON_NAMES = [
  'home', 'leaf', 'sprout', 'zap', 'recycle', 'users', 'chart',
  'factory', 'droplet', 'sun', 'flame', 'layers', 'clock', 'check',
  'smile', 'map', 'award', 'truck', 'shirt', 'wrench',
] as const;
export type IconName = (typeof ICON_NAMES)[number];

export interface ImageRef {
  url: string;
  alt: string;
  caption?: string;
  credit?: string;
  /** Pixel size, when known. Lets the page reserve space so nothing jumps while the image loads. */
  width?: number;
  height?: number;
}

export type JourneyBlock =
  | { _type: 'section'; _key: string; heading?: string; paragraphs: string[] }
  | { _type: 'quote'; _key: string; text: string; cite?: string }
  | { _type: 'figure'; _key: string; image: ImageRef }
  | {
      _type: 'steps';
      _key: string;
      label: string; // screen reader label for the list
      steps: { _key: string; title: string; text: string; icon: IconName; tone: Tone }[];
    }
  | {
      _type: 'pillars';
      _key: string;
      label: string;
      items: { _key: string; label: string; icon: IconName; tone: Tone }[];
    }
  | { _type: 'regions'; _key: string; label: string; map?: ImageRef; regions: string[] }
  | { _type: 'note'; _key: string; text: string };

export type BlockType = JourneyBlock['_type'];

export interface StatItem {
  value: string;
  label: string;
}

export interface Feature {
  _key: string;
  label: string;
  text: string;
  icon: IconName;
  tone: Tone;
}

/**
 * Indian states and union territories, as drawn on the Founders map.
 * An array (not just a type) so the Sanity dropdown is built from the same list.
 */
export const STATE_CODES = [
  'an', 'ap', 'ar', 'as', 'br', 'ch', 'ct', 'dn', 'dd', 'dl', 'ga', 'gj', 'hr', 'hp', 'jk', 'jh', 'ka', 'kl', 'ld', 'mp', 'mh', 'mn', 'ml', 'mz', 'nl', 'or', 'py', 'pb', 'rj', 'sk', 'tn', 'tg', 'tr', 'up', 'ut', 'wb',
] as const;
export type StateCode = (typeof STATE_CODES)[number];

/**
 * Reading page compositions. Same content, different structure:
 *   cover    title first, facts row, one centred column, end of story wrap (default)
 *   dossier  two columns with a short sticky profile rail and chapter list
 *   chapters full-width hero band, numbered chapters, docked story bar
 * An editor picks one per journey, so the template never needs `if (slug === ...)`.
 */
export const LAYOUTS = ['cover', 'dossier', 'chapters'] as const;
export type Layout = (typeof LAYOUTS)[number];

export type Placement = 'editors-pick' | 'sponsored';

/**
 * Facts for the Founders page (listing and map). Optional: a journey without
 * `listing` is simply not shown there. Sector, city and founding year come from
 * `company`, so nothing is entered twice.
 */
export interface Listing {
  state: StateCode;
  /** One headline number for the card, e.g. "10,000" and "farmers trained". */
  metric?: { value: string; label: string; verified: boolean };
  /** Paid slots are ALWAYS labelled "Sponsored" on the page (Design_System 6.x). */
  placement?: Placement;
  /** ISO date. A sponsored slot must have one; after it the slot lapses. */
  placementUntil?: string;
}

export interface FounderJourney {
  slug: string;
  status: 'draft' | 'published' | 'scheduled';
  /** Placeholder content. Renders a visible "Sample" label (Design_System 4.4). */
  sample?: boolean;
  publishedAt: string; // ISO 8601
  updatedAt?: string;
  author: string;

  founder: {
    name: string;
    /** Name as used in the breadcrumb, e.g. "Kishan Panchal". Defaults to name. */
    shortName?: string;
    location?: string;
  };

  company: {
    name: string;
    summary: string;
    website?: string;
    logo?: ImageRef;
    /** Used when there is no logo. */
    icon?: IconName;
    industry?: string;
    city?: string;
    founded?: string;
  };

  hero: {
    kicker?: string; // defaults to "Founder story"
    /** Supports ==highlight== and a literal "\n" for a deliberate line break. */
    title: string;
    dek: string;
    image: ImageRef;
    /** Optional decorations on the portrait, from the Kishan prototype. */
    stage?: {
      scriptName?: string; // handwritten name, "\n" allowed
      role?: string;
      quote?: string;
      signature?: [string, string];
    };
  };

  body: JourneyBlock[];

  sidebar: {
    stats?: StatItem[];
    features?: Feature[];
    quote?: { text: string; cite: string };
  };

  /** Founders page facts. Leave out to keep a journey off the Founders page. */
  listing?: Listing;

  /** Reading page composition. Defaults to 'cover'. [REQ-TMP-06] */
  layout?: Layout;

  /** Tags shown as topic chips. */
  topics?: string[];
  /** Slugs of other journeys. Unknown or unpublished slugs are dropped quietly. */
  related?: string[];

  seo?: {
    title?: string;
    description?: string;
    /** Absolute URL, 1200 x 630. Falls back to hero image. [REQ-SEO-05] */
    image?: string;
  };
}
