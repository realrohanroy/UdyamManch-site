import type { FounderJourney } from '@/lib/journey/types';

/**
 * Shraddhanjali Sonune, Sponsify Network India. Written from the founder's own answers
 * (received 30 Oct 2026).
 *
 * Location and launch year are from the company website, not her answers: the Contact page
 * gives an office in Sector 44, Gurugram, Haryana, and the home page says Sponsify launched
 * in 2025. Her phone number is left out on purpose; the website and Instagram are public.
 *
 * Photo: the founder's portrait, hosted on Cloudinary (received 31 Oct 2026). The hero
 * adds resizing and AVIF/WebP itself (lib/cloudinary.ts), so the URL here is the upload.
 */
const PHOTO = 'https://res.cloudinary.com/nkhny4aq/image/upload/v1793427834/bb519b9d-f1c3-48d0-a4b1-8bd3e5209e48.png';
const journey: FounderJourney = {
  slug: 'shraddhanjali-sonune-sponsify',
  status: 'published',
  publishedAt: '2026-10-30T10:00:00Z',
  author: 'Udyam Manch Team',

  founder: { name: 'Shraddhanjali Sonune', location: 'Gurugram, Haryana' },

  company: {
    name: 'Sponsify Network India',
    summary: 'A sponsorship platform in Gurugram that brings events and the companies that want to sponsor them together.',
    website: 'https://sponsify.co.in',
    icon: 'award',
    industry: 'Events',
    city: 'Gurugram',
    founded: '2025',
  },

  hero: {
    title: 'Bringing ==events and sponsors== onto one platform.',
    dek:
      'Shraddhanjali Sonune started **Sponsify** in Gurugram to close the gap between events that need funds and companies that want to back them.',
    image: {
      url: PHOTO,
      alt: 'Shraddhanjali Sonune, founder of Sponsify, smiling in a cream suit and blue shirt, seated in an armchair with a lit event stage and audience behind her',
      width: 1536,
      height: 1024,
    },
    portrait: 'photo',
    stage: {
      scriptName: 'Shraddhanjali Sonune',
      role: 'Founder and Director, Sponsify',
      quote: "Start first, and don't stop.",
    },
  },

  body: [
    {
      _type: 'note',
      _key: 'note',
      text: "This story is based on Shraddhanjali's own answers to our questions, and her quotes are lightly edited for clarity. Sponsify launched in 2025, so the plans described here are her goals, not results yet.",
    },
    {
      _type: 'section',
      _key: 'who',
      heading: 'A founder in Gurugram',
      paragraphs: [
        'Shraddhanjali Sonune is the founder and director of Sponsify Network India, a sponsorship platform based in Gurugram, Haryana.',
        'Sponsify works with events of many kinds. Its website lists corporate, sports and lifestyle events across India.',
      ],
    },
    {
      _type: 'section',
      _key: 'problem',
      heading: 'The gap she saw',
      paragraphs: [
        'Her inspiration came from a gap she kept seeing. Events need funds to happen, and companies want events to sponsor, but the two do not easily find each other.',
        'Sponsify sets out to fill that gap: to bring funds to events, and to make events more affordable to run.',
      ],
    },
    {
      _type: 'quote',
      _key: 'q1',
      text: 'We are filling the gap between events and sponsorship, making events affordable and bringing funds for events.',
      cite: 'Shraddhanjali Sonune',
    },
    {
      _type: 'section',
      _key: 'unique',
      heading: 'Events and sponsors in one place',
      paragraphs: [
        'Shraddhanjali says Sponsify is the only platform that brings events and sponsors together in one place. Organisers looking for funds and companies looking for events to back can meet there.',
      ],
    },
    {
      _type: 'pillars',
      _key: 'pillars',
      label: 'What Sponsify is built around',
      items: [
        { _key: 'k1', label: 'Events that need funds', icon: 'award', tone: 'gold' },
        { _key: 'k2', label: 'Companies that want to sponsor', icon: 'chart', tone: 'green' },
        { _key: 'k3', label: 'More affordable events', icon: 'check', tone: 'teal' },
        { _key: 'k4', label: 'Events that help people', icon: 'smile', tone: 'indigo' },
      ],
    },
    {
      _type: 'section',
      _key: 'challenges',
      heading: 'Winning trust takes time',
      paragraphs: [
        'The hardest part has been trust. Companies take time to trust a new platform, so every sponsorship takes patience to build.',
      ],
    },
    {
      _type: 'section',
      _key: 'achievement',
      heading: 'A free event for children',
      paragraphs: [
        "Even as a new firm, Sponsify organised a career counselling event for underprivileged children, free of cost. Shraddhanjali counts it as the company's biggest achievement so far.",
      ],
    },
    {
      _type: 'section',
      _key: 'next',
      heading: 'Where Sponsify goes next',
      paragraphs: [
        'Next, Sponsify plans to organise real estate events and raise funds for projects, so that companies can reach the goals they have set for themselves.',
      ],
    },
    {
      _type: 'steps',
      _key: 'plan',
      label: "Shraddhanjali's plan for Sponsify",
      steps: [
        { _key: 's1', title: 'Launch the platform', text: 'Done: Sponsify launched in 2025', icon: 'check', tone: 'gold' },
        { _key: 's2', title: 'A free event', text: 'Done: career counselling for underprivileged children', icon: 'smile', tone: 'green' },
        { _key: 's3', title: 'Real estate events', text: 'Organise events for real estate companies', icon: 'home', tone: 'teal' },
        { _key: 's4', title: 'Funds for projects', text: 'Raise funds so companies can reach their goals', icon: 'chart', tone: 'indigo' },
      ],
    },
    {
      _type: 'section',
      _key: 'advice',
      heading: 'Advice for aspiring entrepreneurs',
      paragraphs: [
        "Shraddhanjali's advice is simple. **Start first, and don't stop.** One day you will reach where you want to be.",
      ],
    },
    {
      _type: 'quote',
      _key: 'q2',
      text: "Start first, don't stop. One day you will reach where you want to.",
      cite: 'Shraddhanjali Sonune',
    },
    {
      _type: 'section',
      _key: 'more',
      paragraphs: ['To find out more, visit sponsify.co.in or find Sponsify on Instagram at @sponsifyindia.'],
    },
  ],

  sidebar: {
    stats: [
      { value: '2025', label: 'Year Sponsify launched' },
      { value: 'Gurugram', label: 'Home city, Haryana' },
      { value: 'Free', label: 'Career counselling event for children' },
    ],
    features: [
      { _key: 'f1', label: 'One platform', text: 'Events and sponsors in one place', icon: 'award', tone: 'gold' },
      { _key: 'f2', label: 'Funds for events', text: 'Sponsorship that makes events affordable', icon: 'chart', tone: 'green' },
      { _key: 'f3', label: 'Social impact', text: 'A free career event for underprivileged children', icon: 'smile', tone: 'teal' },
      { _key: 'f4', label: 'Next', text: 'Real estate events and funds for projects', icon: 'home', tone: 'indigo' },
    ],
    quote: {
      text: "Start first, and don't stop.",
      cite: 'Shraddhanjali Sonune',
    },
  },

  topics: ['Events', 'Sponsorship', 'Social impact', 'Gurugram', 'Haryana'],
  related: ['rohit-gour-animation-cult', 'karthik-r-aurumcrypto'],

  // Founders page. Sponsify's office is in Gurugram, Haryana (company website).
  listing: {
    state: 'hr',
    metric: { value: '2025', label: 'year launched' },
  },

  seo: {
    title: 'Shraddhanjali Sonune: bringing events and sponsors onto one platform',
    // 1200 x 630 crop centred on her face, as JPEG because LinkedIn is unreliable with WebP.
    image: 'https://res.cloudinary.com/nkhny4aq/image/upload/c_fill,g_face,w_1200,h_630/f_jpg,q_auto/v1793427834/bb519b9d-f1c3-48d0-a4b1-8bd3e5209e48.png',
    description:
      'How Shraddhanjali Sonune started Sponsify in Gurugram to bring events and sponsors together, make events affordable, and hold a free career event for children.',
  },
};

export default journey;
