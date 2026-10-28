import type { FounderJourney } from '@/lib/journey/types';

/**
 * Rohit Gour, Animation Cult. Written from the founder's own answers.
 *
 * TODO when the founder sends a photo: save it in public/assets/rohit-gour/, then change
 * hero.image.url and hero.image.alt below. The illustration is a stand-in.
 * TODO when we know the founding year: add company.founded (the Founders page shows it).
 */
const journey: FounderJourney = {
  slug: 'rohit-gour-animation-cult',
  status: 'published',
  publishedAt: '2026-10-28T10:00:00Z',
  author: 'Udyam Manch Team',

  founder: { name: 'Rohit Gour', location: 'Bhopal, Madhya Pradesh' },

  company: {
    name: 'Animation Cult',
    summary:
      'An animation studio in Bhopal that plans for three in four of its employees to be women, with safe work from home.',
    website: 'https://www.animationcult.com',
    icon: 'layers',
    industry: 'Animation',
    city: 'Bhopal', // from Rohan, 28 Oct 2026. Founding year not known yet.
  },

  hero: {
    title: 'Building an animation studio where ==most of the team are women==.',
    dek:
      'Rohit Gour started **Animation Cult** in Bhopal to create jobs in his city, with a plan for three in four of its people to be women.',
    image: {
      url: '/assets/rohit-gour/rohit-gour-hero.svg',
      alt: 'Illustration of three storyboard frames with a ball bouncing across them, a pencil and a play button, representing an animation studio',
    },
    stage: {
      scriptName: 'Rohit Gour',
      role: 'Founder, Animation Cult',
      quote: 'Just start the work.',
    },
  },

  body: [
    {
      _type: 'note',
      _key: 'note',
      text: "This story is based on Rohit's own answers to our questions, and his quotes are lightly edited for clarity. Animation Cult is a young company, so the plans described here are his goals, not results yet.",
    },
    {
      _type: 'section',
      _key: 'who',
      heading: 'A founder from Bhopal',
      paragraphs: [
        'Rohit Gour is the founder of Animation Cult, an animation studio based in Bhopal, Madhya Pradesh. The studio describes its work in three words: crafting visual narratives.',
        'His reason for starting it is personal. Life is too short, he says, and he wants to live a happy one. Building something of his own is how he chose to do that.',
      ],
    },
    {
      _type: 'quote',
      _key: 'q1',
      text: 'Life is too short, so I want to live a happy life. That is what inspired me.',
      cite: 'Rohit Gour',
    },
    {
      _type: 'section',
      _key: 'problem',
      heading: 'Jobs for his city',
      paragraphs: [
        'The problem Rohit wants to work on is one he sees around him: unemployment, in Bhopal and across India. A studio that grows is a studio that hires, and he wants those jobs to start at home.',
      ],
    },
    {
      _type: 'section',
      _key: 'unique',
      heading: 'A studio where most of the team are women',
      paragraphs: [
        "What sets Animation Cult apart is who it plans to hire. Rohit's goal is for **75% of the studio's employees to be women**.",
        'He also wants the studio to support women and help them work safely from home in the future.',
      ],
    },
    {
      _type: 'pillars',
      _key: 'pillars',
      label: 'What Animation Cult is built around',
      items: [
        { _key: 'k1', label: 'Animation and visual stories', icon: 'layers', tone: 'gold' },
        { _key: 'k2', label: 'A team that is 75% women', icon: 'users', tone: 'green' },
        { _key: 'k3', label: 'Safe work from home', icon: 'home', tone: 'teal' },
        { _key: 'k4', label: 'Jobs in Bhopal', icon: 'map', tone: 'indigo' },
      ],
    },
    {
      _type: 'section',
      _key: 'challenges',
      heading: 'Getting past the fear of failure',
      paragraphs: [
        'The hardest part so far was not a market or a competitor. It was the fear of failure.',
        'Getting past it is why Rohit counts setting up the company as his biggest achievement to date.',
      ],
    },
    {
      _type: 'section',
      _key: 'next',
      heading: 'Where Animation Cult goes next',
      paragraphs: [
        'Rohit thinks big. He wants Animation Cult to become a hub for Indian animation, and in time an animation brand known around the world.',
      ],
    },
    {
      _type: 'steps',
      _key: 'plan',
      label: "Rohit's plan for Animation Cult",
      steps: [
        { _key: 's1', title: 'Set up the studio', text: 'Done: Animation Cult is established', icon: 'check', tone: 'gold' },
        { _key: 's2', title: 'Build the team', text: 'Hire a team where 75% are women', icon: 'users', tone: 'green' },
        { _key: 's3', title: 'An Indian hub', text: 'Become a hub for Indian animation', icon: 'map', tone: 'teal' },
        { _key: 's4', title: 'A global brand', text: 'Grow into an animation brand known worldwide', icon: 'award', tone: 'indigo' },
      ],
    },
    {
      _type: 'section',
      _key: 'advice',
      heading: 'Advice for aspiring entrepreneurs',
      paragraphs: [
        "Rohit's advice is short. **Just start the work.** Then do whatever else you can to make your life better.",
      ],
    },
    {
      _type: 'quote',
      _key: 'q2',
      text: 'Just start the work, and do whatever you can to make your life better.',
      cite: 'Rohit Gour',
    },
    {
      _type: 'section',
      _key: 'more',
      paragraphs: ['To find out more about the studio, visit animationcult.com.'],
    },
  ],

  sidebar: {
    stats: [
      { value: '75%', label: 'Planned share of women on the team' },
      { value: 'Bhopal', label: 'Home city, Madhya Pradesh' },
      { value: 'Home', label: 'Safe work from home, planned' },
    ],
    features: [
      { _key: 'f1', label: 'Animation studio', text: 'Crafting visual narratives', icon: 'layers', tone: 'gold' },
      { _key: 'f2', label: 'Women first', text: 'Three in four employees planned to be women', icon: 'users', tone: 'green' },
      { _key: 'f3', label: 'Work from home', text: 'Planned: safe remote work for women', icon: 'home', tone: 'teal' },
      { _key: 'f4', label: 'Global ambition', text: 'An Indian animation hub, then a worldwide brand', icon: 'award', tone: 'indigo' },
    ],
    quote: {
      text: 'Just start the work.',
      cite: 'Rohit Gour',
    },
  },

  topics: ['Animation', 'Women in work', 'Jobs', 'Bhopal', 'Madhya Pradesh'],
  related: ['karthik-r-aurumcrypto', 'kishan-panchal-farming-solutions-india'],

  // Founders page. Bhopal is in Madhya Pradesh. The headline number is a plan, not a result.
  listing: {
    state: 'mp',
    metric: { value: '75%', label: 'women on the team, planned', verified: false },
  },

  seo: {
    title: 'Rohit Gour: an animation studio built around women and local jobs',
    description:
      'How Rohit Gour started Animation Cult in Bhopal to create jobs in his city, with a plan for 75% of the studio to be women working safely from home.',
  },
};

export default journey;
