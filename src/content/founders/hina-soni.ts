import type { FounderJourney } from '@/lib/journey/types';

/**
 * Hina Soni, ABCD (ABCD Learning Never Ends). Written from the founder's own answers
 * (received 31 Oct 2026).
 *
 * Registered company: "ABRAIN CHILD DEVELOPMENT PVT LTD", based in Uttar Pradesh (both
 * from Rohan, 31 Oct 2026; city not known yet, so company.city is left out). The page uses
 * the brand name she uses, ABCD Learning Never Ends. TODO: confirm the spelling of the
 * registered name (possibly "A Brain Child Development", which would spell ABCD).
 *
 * Founding year 2017, the City Excellence Award and the plan for 100 centres in two years
 * are from her answers. No website or Instagram was given, and a web search on 31 Oct 2026
 * found nothing for "ABCD Learning Never Ends", so nothing here comes from a website.
 * No contact details were sent.
 *
 * Photo: the founder's portrait, hosted on Cloudinary (received 31 Oct 2026). The hero
 * adds resizing and AVIF/WebP itself (lib/cloudinary.ts), so the URL here is the upload.
 * TODO: which city gave the City Excellence Award, and when. Until then it is written
 * exactly as she named it.
 */
const PHOTO = 'https://res.cloudinary.com/nkhny4aq/image/upload/v1793440523/2f8ffd2a-2e3b-4596-89bf-0f9b05e63092.png';

const journey: FounderJourney = {
  slug: 'hina-soni-abcd',
  status: 'published',
  publishedAt: '2026-10-31T08:00:00Z',
  author: 'Udyam Manch Team',

  founder: { name: 'Hina Soni', location: 'Uttar Pradesh' },

  company: {
    name: 'ABCD Learning Never Ends',
    summary:
      'A learning platform in Uttar Pradesh for psychology, counselling and personality development, founded in 2017 by Hina Soni.',
    icon: 'users',
    industry: 'Education',
    founded: '2017',
  },

  hero: {
    title: 'Turning ==psychology into skills== people use every day.',
    dek:
      'Hina Soni founded **ABCD** in 2017 to teach psychology, counselling and personality development in a way people can carry into their work, homes and classrooms.',
    image: {
      url: PHOTO,
      alt: 'Hina Soni, founder of ABCD Learning Never Ends, smiling with her chin on her hand, in a navy blazer at a desk with books, a notebook and a laptop, with a line drawing of a head and a sprout on the wall behind her',
      width: 1536,
      height: 1024,
    },
    portrait: 'photo',
    stage: {
      scriptName: 'Hina Soni',
      role: 'Founder, ABCD Learning Never Ends',
      quote: 'Start with what you have.',
    },
  },

  body: [
    {
      _type: 'note',
      _key: 'note',
      text: "This story is based on Hina's own answers to our questions, and her quotes are lightly edited for clarity. The plans described here are her goals, not results yet. Nothing here is medical or mental health advice; for help with your mental health, speak to a qualified professional.",
    },
    {
      _type: 'section',
      _key: 'who',
      heading: 'A founder drawn to how people think',
      paragraphs: [
        'Hina Soni is the founder of ABCD, short for ABCD Learning Never Ends. She set it up in 2017 to make psychology, counselling, therapy and personality development open to anyone who wants to learn them.',
        'Her interest runs through all of it: psychology, human behaviour and education, and helping people grow into who they want to be.',
      ],
    },
    {
      _type: 'section',
      _key: 'inspiration',
      heading: 'Knowledge that stayed on the page',
      paragraphs: [
        'What pushed her to start was a gap she kept noticing. Psychology was being studied, but it rarely reached the people who could use it in daily life.',
        "Parents, teachers and working people often wanted to understand behaviour better and support the people around them. What they lacked was guidance and practical skills. Hina wanted a place where learning psychology would make a real difference in people's lives.",
      ],
    },
    {
      _type: 'quote',
      _key: 'q1',
      text: 'Many individuals, parents and educators needed guidance, awareness and professional skills to understand human behaviour and support personal development.',
      cite: 'Hina Soni',
    },
    {
      _type: 'section',
      _key: 'problem',
      heading: 'Three gaps ABCD works on',
      paragraphs: [
        'Hina describes three problems. Most people know little about how psychology applies to everyday life. Practical training in counselling and therapeutic approaches is hard to find. And more and more people want help with communication, confidence and personality development.',
        'ABCD brings all three together on one platform.',
      ],
    },
    {
      _type: 'pillars',
      _key: 'pillars',
      label: 'What ABCD teaches',
      items: [
        { _key: 'k1', label: 'Psychology and psychoeducation', icon: 'layers', tone: 'gold' },
        { _key: 'k2', label: 'Counselling and therapy skills', icon: 'users', tone: 'green' },
        { _key: 'k3', label: 'Personality and communication', icon: 'smile', tone: 'teal' },
        { _key: 'k4', label: 'Learning for life', icon: 'clock', tone: 'indigo' },
      ],
    },
    {
      _type: 'section',
      _key: 'unique',
      heading: 'Learning that gets used',
      paragraphs: [
        'Hina sees the combination as what sets ABCD apart. Learners do not study psychology in one place, counselling in another and communication somewhere else. They get all three together, and the focus stays on applying it in the real world, not on theory alone.',
      ],
    },
    {
      _type: 'section',
      _key: 'challenges',
      heading: 'Building trust in a careful field',
      paragraphs: [
        'Psychology and education are not easy sectors to build in. Hina had to create awareness, earn credibility and put together a strong team.',
        'Part of the work was explaining a difference many people miss: a skill-based certification is not the same as a professional qualification. Being clear about that was part of earning trust.',
        'As a woman entrepreneur, she says she learned to face uncertainty, adapt as things changed and keep going even when resources were limited.',
      ],
    },
    {
      _type: 'section',
      _key: 'achievements',
      heading: 'What ABCD has built since 2017',
      paragraphs: [
        'Since 2017, ABCD has grown a learning community and created programmes in psychology, counselling and personality development. Its learners come from many educational and professional backgrounds across India.',
        'ABCD has also received the City Excellence Award for its contribution. For Hina, the bigger achievement is a platform that keeps people learning and spreads awareness of psychology.',
      ],
    },
    {
      _type: 'section',
      _key: 'next',
      heading: 'Where ABCD goes next',
      paragraphs: [
        'Hina wants to expand ABCD across India, with a goal of 100 learning and development centres over the next two years.',
        'She also plans a technology platform rooted in psychology, one that brings psychoeducation, mental health awareness, career guidance, support for parents and professional development into one place. Her long-term aim is for ABCD to be recognised as a national platform for psychology and human development.',
      ],
    },
    {
      _type: 'steps',
      _key: 'plan',
      label: "Hina's plan for ABCD",
      steps: [
        { _key: 's1', title: 'Founded', text: 'Done: ABCD started in 2017', icon: 'check', tone: 'gold' },
        { _key: 's2', title: 'Programmes', text: 'Done: courses in psychology, counselling and personality development', icon: 'layers', tone: 'green' },
        { _key: 's3', title: '100 centres', text: 'Goal: learning and development centres across India within two years', icon: 'map', tone: 'teal' },
        { _key: 's4', title: 'A tech platform', text: 'Goal: psychoeducation, career guidance and parent support in one place', icon: 'zap', tone: 'indigo' },
      ],
    },
    {
      _type: 'section',
      _key: 'advice',
      heading: 'Advice for aspiring entrepreneurs',
      paragraphs: [
        "Hina's advice is to begin before everything feels ready. **Don't wait for the perfect opportunity; start with what you have.**",
        'To her, a business is less about money and more about finding a problem and solving it well. Be consistent, keep learning, build the right team, and do not let a setback decide how your story ends.',
      ],
    },
    {
      _type: 'quote',
      _key: 'q2',
      text: 'Success is not a destination; it is a continuous learning process. At ABCD, our philosophy is simple: learning never ends.',
      cite: 'Hina Soni',
    },
  ],

  sidebar: {
    stats: [
      { value: '2017', label: 'Year ABCD was founded' },
      { value: '100', label: 'Centres planned over the next two years' },
      { value: '3', label: 'Areas taught together' },
    ],
    features: [
      { _key: 'f1', label: 'Psychology', text: 'Psychoeducation for everyday life', icon: 'layers', tone: 'gold' },
      { _key: 'f2', label: 'Counselling', text: 'Practical counselling and therapy skills', icon: 'users', tone: 'green' },
      { _key: 'f3', label: 'Personal growth', text: 'Communication, confidence and personality', icon: 'smile', tone: 'teal' },
      { _key: 'f4', label: 'Recognition', text: 'City Excellence Award', icon: 'award', tone: 'indigo' },
    ],
    quote: {
      text: 'Learning never ends.',
      cite: 'Hina Soni',
    },
  },

  topics: ['Psychology', 'Education', 'Counselling', 'Women founders', 'Uttar Pradesh'],
  related: ['shraddhanjali-sonune-sponsify', 'rohit-gour-animation-cult'],

  // Founders page. Uttar Pradesh, from Rohan. The 100 centres are a goal, so the
  // card shows the founding year instead.
  listing: {
    state: 'up',
    metric: { value: '2017', label: 'year founded' },
  },

  seo: {
    title: 'Hina Soni: turning psychology into skills people use every day',
    description:
      'How Hina Soni built ABCD Learning Never Ends since 2017 to teach psychology, counselling and personality development, and her plan for 100 centres across India.',
    // 1200 x 630 crop centred on her face, as JPEG because LinkedIn is unreliable with WebP.
    image: 'https://res.cloudinary.com/nkhny4aq/image/upload/c_fill,g_face,w_1200,h_630/f_jpg,q_auto/v1793440523/2f8ffd2a-2e3b-4596-89bf-0f9b05e63092.png',
  },
};

export default journey;
