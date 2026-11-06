import type { FounderJourney } from '@/lib/journey/types';

/**
 * Punam Shail, Manshail Mission (Telangana), with BUTTA BOMMA as its flagship
 * platform. Written from the founder's own answers (received 5 Nov 2026). The
 * answers were prepared for a SheScale Fund application, so the page turns
 * them into a story and describes the funding as something she is seeking,
 * not something she has.
 *
 * Not given: founding year, city, website, social handles, the names of her
 * pageant titles, and how many women she has trained. The page states none of
 * them rather than guessing. Every plan is described as a goal.
 *
 * TODO: photo. Rohan will send it. Until then this journey is a draft (404, not
 * listed) and is not in index.ts. To publish: set PHOTO, hero.image width/height
 * and alt, seo.image, status 'published', publishedAt, then add it to index.ts
 * and tests/http.test.mjs.
 */
const PHOTO = '';

const journey: FounderJourney = {
  slug: 'punam-shail-manshail-mission',
  status: 'draft',
  publishedAt: '2026-11-05T04:00:00Z',
  author: 'Udyam Manch Team',

  founder: { name: 'Punam Shail', location: 'Telangana' },

  company: {
    name: 'Manshail Mission',
    summary:
      'A women-led empowerment and skill development organisation in Telangana, with BUTTA BOMMA as its flagship platform.',
    icon: 'users',
    industry: 'Skill development',
  },

  hero: {
    title: 'Giving women the training and ==the stage she never had==.',
    dek:
      'Actress, model and certified beautician Punam Shail founded **Manshail Mission** in Telangana to give women skills, confidence and a dignified stage, through its flagship platform BUTTA BOMMA.',
    image: {
      url: PHOTO,
      alt: 'Punam Shail, founder of Manshail Mission',
    },
    portrait: 'photo',
    stage: {
      scriptName: 'Punam Shail',
      role: 'Founder, Manshail Mission',
      quote: 'Your story is your strength.',
    },
  },

  body: [
    {
      _type: 'note',
      _key: 'note',
      text: "This story is based on Punam's own answers to our questions, and her quotes are lightly edited for clarity. Her plans for growth are goals, and some depend on funding she is seeking.",
    },
    {
      _type: 'section',
      _key: 'who',
      heading: 'An actress who built a stage for others',
      paragraphs: [
        'Punam Shail is an actress, a model, a beauty pageant title winner and a certified beautician. She is also the founder of Manshail Mission in Telangana, a women empowerment and skill development organisation that is fully women led.',
        'Its flagship platform is BUTTA BOMMA, which gives women training, a stage, portfolios and the confidence to restart their careers.',
      ],
    },
    {
      _type: 'section',
      _key: 'inspiration',
      heading: 'A childhood dream, and the women she met on the way back',
      paragraphs: [
        'Punam grew up wanting to act and model. When she restarted that journey as an adult, she kept meeting women with real talent: homemakers, mothers, working women and girls from small towns.',
        'What they lacked was not ability. It was proper training, a professional introduction and a safe place to be seen. She started Manshail Mission to give them exactly that.',
      ],
    },
    {
      _type: 'quote',
      _key: 'q1',
      text: 'I started Manshail Mission to give them what I never had: skill, confidence and a dignified stage.',
      cite: 'Punam Shail',
    },
    {
      _type: 'section',
      _key: 'problem',
      heading: 'Talent without training or a way in',
      paragraphs: [
        'In her work, Punam sees the same gap again and again. Women lack structured training in grooming, communication, digital literacy, beauty and wellness, tailoring, handicrafts and running a business.',
        'For women who want to start something of their own, the road is harder still. She points to three problems: women founders and artists struggle to get early funding and mentorship, there is little incubation and business support for women-led startups, and low visibility and weak networks keep women out of entrepreneurship.',
        'Manshail Mission puts training, mentorship and links to the market in one place.',
      ],
    },
    {
      _type: 'pillars',
      _key: 'model',
      label: 'What Manshail Mission brings together',
      items: [
        { _key: 'm1', label: 'Skill development', icon: 'wrench', tone: 'gold' },
        { _key: 'm2', label: 'Grooming', icon: 'smile', tone: 'green' },
        { _key: 'm3', label: 'Digital literacy', icon: 'zap', tone: 'teal' },
        { _key: 'm4', label: 'Entrepreneurship', icon: 'chart', tone: 'indigo' },
        { _key: 'm5', label: 'Market linkage', icon: 'map', tone: 'gold' },
      ],
    },
    {
      _type: 'section',
      _key: 'unique',
      heading: 'More than a pageant or a training centre',
      paragraphs: [
        'Punam is clear that Manshail Mission is neither just a pageant nor just a training centre. It is meant to be a complete model for women: skills, grooming, digital literacy, entrepreneurship and a route to the market, all in one.',
        'It works with real women of every age and background, including mothers and homemakers. Alongside the professional training, it offers emotional support and motivation, which for many women is what makes them show up in the first place.',
        'The model is designed to run online and offline, so it can grow across Telangana, Andhra Pradesh and the rest of India.',
      ],
    },
    {
      _type: 'section',
      _key: 'challenges',
      heading: 'Starting from zero',
      paragraphs: [
        'Punam began with no investor, no incubator and no industry godfather. As a first-time woman founder, she had to earn trust from scratch.',
        'She has run events, training and operations with a small team and limited funds. She has had to convince families to let women take part. And she taught herself business documentation, marketing and how to find sponsors.',
        'She believes those years have made Manshail Mission ready for structured incubation and funding.',
      ],
    },
    {
      _type: 'section',
      _key: 'achievements',
      heading: 'What she has built so far',
      paragraphs: [
        'As a model and actress, Punam has won multiple beauty pageant titles. As a founder, she has taken BUTTA BOMMA from an idea to a working platform that is already earning early revenue.',
        'She has trained and groomed many women, and given them stage exposure, portfolios and the confidence to restart their careers. Along the way she has built a loyal community of women through trust and steady work.',
        'Most recently she registered Manshail Mission as a formal organisation, so the work can grow beyond what she can do alone.',
      ],
    },
    {
      _type: 'steps',
      _key: 'plan',
      label: "Punam's plan for Manshail Mission",
      steps: [
        { _key: 's1', title: 'Get the basics in order', text: 'Goal: operations, documentation and finances, with incubation and mentorship', icon: 'check', tone: 'gold' },
        { _key: 's2', title: 'Grow BUTTA BOMMA', text: 'Goal: BUTTA BOMMA and skill programmes across Telangana, Andhra Pradesh and India', icon: 'map', tone: 'green' },
        { _key: 's3', title: 'Open an academy', text: 'Goal: grooming, beauty and wellness and personality development, online and offline', icon: 'award', tone: 'teal' },
        { _key: 's4', title: 'Create jobs for women', text: 'Goal: work for women trainers, makeup artists, choreographers, photographers and event staff', icon: 'users', tone: 'indigo' },
        { _key: 's5', title: 'Partner widely', text: 'Goal: programmes with brands, colleges and NGOs', icon: 'home', tone: 'gold' },
      ],
    },
    {
      _type: 'section',
      _key: 'next',
      heading: 'Where Manshail Mission goes next',
      paragraphs: [
        "Punam is seeking support of up to Rs 50 lakh from the SheScale Fund. With it, she plans to put Manshail Mission's operations, documentation and financial systems on a proper footing, with the help of incubation and mentorship.",
        'From there, she wants to take BUTTA BOMMA and the skill programmes across Telangana, Andhra Pradesh and the rest of India, and to launch an academy for grooming, beauty and wellness and personality development, both online and offline.',
        'Growth, for her, also means jobs. She wants to employ women as trainers, makeup artists, choreographers, photographers and event staff, and to partner with brands, colleges and NGOs on larger programmes for women.',
      ],
    },
    {
      _type: 'section',
      _key: 'advice',
      heading: 'Advice for aspiring entrepreneurs',
      paragraphs: [
        "Punam's advice starts simply: begin with what you have. Do not wait for the perfect amount of money or the perfect time.",
        'Your story is your strength, she says. Learn every part of your business, and take mentorship seriously, because the right guidance can save years of struggle.',
      ],
    },
    {
      _type: 'quote',
      _key: 'q2',
      text: 'If you can stand after your toughest days, you can build anything.',
      cite: 'Punam Shail',
    },
  ],

  sidebar: {
    stats: [
      { value: '100%', label: 'Women led' },
      { value: '7', label: 'Skill areas in its training' },
      { value: 'Early revenue', label: 'BUTTA BOMMA today' },
    ],
    features: [
      { _key: 'f1', label: 'BUTTA BOMMA', text: 'Flagship platform: training, stage and portfolios', icon: 'award', tone: 'gold' },
      { _key: 'f2', label: 'Skills', text: 'Grooming to tailoring, handicrafts and business', icon: 'wrench', tone: 'green' },
      { _key: 'f3', label: 'Support', text: 'Mentorship, motivation and emotional support', icon: 'users', tone: 'teal' },
      { _key: 'f4', label: 'Online and offline', text: 'Built to grow beyond Telangana', icon: 'map', tone: 'indigo' },
    ],
    quote: {
      text: 'Start with what you have.',
      cite: 'Punam Shail',
    },
  },

  topics: ['Women empowerment', 'Skill development', 'Women founders', 'Telangana'],
  related: ['navjot-kaur-c11-aura', 'hina-soni-abcd'],

  listing: {
    state: 'tg',
  },

  seo: {
    title: 'Punam Shail: giving women the training and the stage she never had',
    description:
      'How actress and model Punam Shail built Manshail Mission and BUTTA BOMMA in Telangana to give women skills, confidence and a dignified stage.',
  },
};

export default journey;
