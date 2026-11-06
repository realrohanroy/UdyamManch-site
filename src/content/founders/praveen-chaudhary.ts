import type { FounderJourney } from '@/lib/journey/types';

/**
 * Praveen Chaudhary, UltraPeak. Written from the founder's own answers
 * (received 2 Nov 2026).
 *
 * No founding year was given. Location: Himachal Pradesh (from Rohan,
 * 2 Nov 2026; city not known yet). Website healthssphere.com from Rohan,
 * 2 Nov 2026; on that date it read "UltraPeak by HealthSphere | Launching
 * soon". No registered company name was provided.
 * TODO: confirm founding year and city.
 *
 * Photo: the founder's portrait, hosted on Cloudinary (received 2 Nov 2026).
 * The hero adds resizing and AVIF/WebP itself (lib/cloudinary.ts), so the
 * URL here is the plain upload.
 */
const PHOTO = 'https://res.cloudinary.com/nkhny4aq/image/upload/v1793593948/25537b01-b551-49ad-844b-cc202cafb8f4.png';

const journey: FounderJourney = {
  slug: 'praveen-chaudhary-ultrapeak',
  status: 'published',
  publishedAt: '2026-11-02T04:00:00Z',
  author: 'Udyam Manch Team',

  founder: { name: 'Praveen Chaudhary', location: 'Himachal Pradesh' },

  company: {
    name: 'UltraPeak',
    summary:
      'An electrolyte energy-drink powder brand from Himachal Pradesh that makes everyday hydration convenient for people with busy and active lifestyles.',
    icon: 'droplet',
    industry: 'Food and Beverage',
    website: 'https://healthssphere.com',
  },

  hero: {
    title: 'Making ==electrolyte hydration== part of everyday life.',
    dek:
      'Praveen Chaudhary founded **UltraPeak** to take electrolyte drinks beyond the gym and into the routines of anyone with a busy, active day.',
    image: {
      url: PHOTO,
      alt: 'Praveen Chaudhary, founder of UltraPeak, leaning on a ledge beside a water bottle at a running track, in a black polo and a smartwatch, with a water splash and green wave graphics behind him',
      width: 1536,
      height: 1024,
    },
    portrait: 'photo',
    stage: {
      scriptName: 'Praveen Chaudhary',
      role: 'Founder, UltraPeak',
      quote: 'Stay consistent and never stop improving.',
    },
  },

  body: [
    {
      _type: 'note',
      _key: 'note',
      text: "This story is based on Praveen's own answers to our questions, and his quotes are lightly edited for clarity. The plans described here are his goals, not results yet.",
    },
    {
      _type: 'section',
      _key: 'who',
      heading: 'A founder rethinking who hydration is for',
      paragraphs: [
        'Praveen Chaudhary is the founder of UltraPeak, an electrolyte energy-drink powder brand. His idea is straightforward: electrolyte-based hydration should not be reserved for athletes and gym-goers. It belongs in everyone\'s day.',
      ],
    },
    {
      _type: 'section',
      _key: 'inspiration',
      heading: 'Beyond the gym',
      paragraphs: [
        'What pushed Praveen to start UltraPeak was a gap he kept noticing. Electrolyte drinks were marketed almost entirely to fitness enthusiasts, but the need for proper hydration runs through every kind of busy life.',
        'He wanted to build a brand that made convenient hydration feel relevant to people who may never set foot in a gym but still need it through a long workday, a commute or a hectic schedule.',
      ],
    },
    {
      _type: 'quote',
      _key: 'q1',
      text: 'I wanted to make electrolyte-based hydration relevant to everyone, not just athletes and gym enthusiasts.',
      cite: 'Praveen Chaudhary',
    },
    {
      _type: 'section',
      _key: 'problem',
      heading: 'The problem UltraPeak works on',
      paragraphs: [
        'People with busy and active lifestyles often do not think about hydration until they feel the effects of neglecting it. Convenient, everyday electrolyte hydration is still not a habit for most people.',
        'UltraPeak aims to change that by making it easy, accessible and part of a normal routine.',
      ],
    },
    {
      _type: 'pillars',
      _key: 'pillars',
      label: 'What UltraPeak focuses on',
      items: [
        { _key: 'k1', label: 'Everyday hydration', icon: 'droplet', tone: 'teal' },
        { _key: 'k2', label: 'Convenience', icon: 'zap', tone: 'gold' },
        { _key: 'k3', label: 'Beyond fitness', icon: 'users', tone: 'green' },
        { _key: 'k4', label: 'Workplace wellness', icon: 'home', tone: 'indigo' },
      ],
    },
    {
      _type: 'section',
      _key: 'unique',
      heading: 'Hydration as a daily habit, not a workout supplement',
      paragraphs: [
        'What sets UltraPeak apart, in Praveen\'s view, is its vision. Most electrolyte brands position themselves around sport and fitness. UltraPeak wants electrolyte hydration to be a part of everyday life, including workplace routines.',
        'That shift in positioning is the brand\'s core idea: hydration belongs everywhere, not just in the gym bag.',
      ],
    },
    {
      _type: 'section',
      _key: 'challenges',
      heading: 'Earning trust outside the fitness aisle',
      paragraphs: [
        'Praveen describes three challenges. Building brand awareness from scratch, gaining consumer trust for a new name, and introducing UltraPeak beyond the traditional fitness market where electrolyte drinks are already understood.',
        'Convincing everyday consumers that they need an electrolyte drink is a harder sell than reaching people who already buy one.',
      ],
    },
    {
      _type: 'section',
      _key: 'achievements',
      heading: 'Where UltraPeak stands today',
      paragraphs: [
        'So far, Praveen has focused on developing UltraPeak\'s brand positioning and exploring opportunities to reach everyday consumers. The work is still early, and the brand is building its foundation.',
      ],
    },
    {
      _type: 'section',
      _key: 'next',
      heading: 'Where UltraPeak goes next',
      paragraphs: [
        'Praveen plans to expand UltraPeak\'s reach through corporate partnerships, retail channels and stronger brand awareness.',
        'The goal is for electrolyte hydration to be as normal in an office as a cup of tea.',
      ],
    },
    {
      _type: 'steps',
      _key: 'plan',
      label: "Praveen's plan for UltraPeak",
      steps: [
        { _key: 's1', title: 'Brand positioning', text: 'Done: UltraPeak positioned for everyday hydration, not just fitness', icon: 'check', tone: 'gold' },
        { _key: 's2', title: 'Consumer research', text: 'Done: exploring how to reach people outside the gym market', icon: 'users', tone: 'green' },
        { _key: 's3', title: 'Corporate partnerships', text: 'Goal: bring UltraPeak into workplaces', icon: 'home', tone: 'teal' },
        { _key: 's4', title: 'Retail expansion', text: 'Goal: wider availability through retail channels', icon: 'map', tone: 'indigo' },
      ],
    },
    {
      _type: 'section',
      _key: 'advice',
      heading: 'Advice for aspiring entrepreneurs',
      paragraphs: [
        "Praveen's advice is to stay consistent, learn from challenges, understand your customers and never stop improving.",
        'For him, entrepreneurship is less about a single breakthrough and more about showing up every day with the willingness to get better.',
      ],
    },
    {
      _type: 'quote',
      _key: 'q2',
      text: 'Stay consistent, learn from challenges, understand your customers, and never stop improving.',
      cite: 'Praveen Chaudhary',
    },
  ],

  sidebar: {
    stats: [
      { value: 'Electrolyte', label: 'Energy-drink powder brand' },
      { value: 'Everyday', label: 'Hydration beyond fitness' },
      { value: '3', label: 'Growth channels planned' },
    ],
    features: [
      { _key: 'f1', label: 'Hydration', text: 'Electrolyte drinks for daily life', icon: 'droplet', tone: 'teal' },
      { _key: 'f2', label: 'Convenience', text: 'Powder format, easy to carry', icon: 'zap', tone: 'gold' },
      { _key: 'f3', label: 'Workplace wellness', text: 'Corporate partnerships planned', icon: 'home', tone: 'green' },
      { _key: 'f4', label: 'Retail', text: 'Expanding into retail channels', icon: 'map', tone: 'indigo' },
    ],
    quote: {
      text: 'Never stop improving.',
      cite: 'Praveen Chaudhary',
    },
  },

  topics: ['Food and Beverage', 'Health', 'Hydration', 'Consumer brands'],
  related: ['hina-soni-abcd', 'rohit-gour-animation-cult'],

  listing: {
    state: 'hp',
  },

  seo: {
    title: 'Praveen Chaudhary: making electrolyte hydration part of everyday life',
    description:
      'How Praveen Chaudhary built UltraPeak to take electrolyte drinks beyond the gym and into the daily routines of busy people across India.',
    image: 'https://res.cloudinary.com/nkhny4aq/image/upload/c_fill,g_face,w_1200,h_630/f_jpg,q_auto/v1793593948/25537b01-b551-49ad-844b-cc202cafb8f4.png',
  },
};

export default journey;
