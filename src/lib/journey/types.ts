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
