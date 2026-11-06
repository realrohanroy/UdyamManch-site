import type { FounderJourney } from '@/lib/journey/types';

/**
 * Kartik Baladia, BOOKFOOD PVT. LTD. Written from the founder's own answers
 * (received 4 Nov 2026).
 *
 * Company, head office (Surat, Gujarat) and tagline ("Sustainable Dining, Smarter Living")
 * are from his answers. No founding year was given, so company.founded is left out. No
 * website or social links were given.
 *
 * Stage of the business, in his words: early business development and market validation.
 * The BOOKFOOD CANTEEN product model is ready for testing, and the Android and iOS apps are
 * in progress. MARKET, RESTRO, the Gujarat roll-out, the free introductory period for small
 * vendors and the supply network are all plans, and the page says so.
 *
 * Product names are written "BOOKFOOD Canteen", "BOOKFOOD Market" and "BOOKFOOD Restro" in
 * running text so the page does not shout; the brand itself stays BOOKFOOD.
 *
 * Photo: the founder's portrait, hosted on Cloudinary (received 5 Nov 2026, 1536x1024).
 * The hero adds resizing and AVIF/WebP itself (lib/cloudinary.ts), so the URL here is the
 * plain upload.
 */
const PHOTO = 'https://res.cloudinary.com/nkhny4aq/image/upload/v1793820112/18677549-d1dc-4dbd-b67b-07f1faf101ef.png';

const journey: FounderJourney = {
  slug: 'kartik-baladia-bookfood',
  status: 'published',
  publishedAt: '2026-11-04T18:30:00Z',
  author: 'Udyam Manch Team',

  founder: { name: 'Kartik Baladia', location: 'Surat, Gujarat' },

  company: {
    name: 'BOOKFOOD',
    summary:
      'A food and local commerce technology company in Surat, building one platform for corporate canteens, local shops and restaurants.',
    icon: 'factory',
    industry: 'Food tech',
    city: 'Surat',
  },

  hero: {
    title: 'Moving canteen orders from ==paper registers to an app==.',
    dek:
      'Kartik Baladia is building **BOOKFOOD** in Surat: one platform for corporate canteens, local shops and restaurants, starting with the canteen.',
    image: {
      url: PHOTO,
      alt: 'Kartik Baladia, founder and CEO of BOOKFOOD, in glasses and a dark shirt, leaning on a café table with a laptop and takeaway food boxes, shelves of jars and fresh vegetables behind him',
      width: 1536,
      height: 1024,
    },
    portrait: 'photo',
    stage: {
      scriptName: 'Kartik Baladia',
      role: 'Founder and CEO, BOOKFOOD',
      quote: 'Start with a real problem.',
    },
  },

  body: [
    {
      _type: 'note',
      _key: 'note',
      text: "This story is based on Kartik's own answers to our questions, and his quotes are lightly edited for clarity. BOOKFOOD is at an early stage: its canteen product is ready for testing and its apps are still being built. Everything described as a plan here is a goal, not a result yet.",
    },
    {
      _type: 'section',
      _key: 'who',
      heading: 'A founder who wants small vendors to win too',
      paragraphs: [
        'Kartik Baladia is the founder and CEO of BOOKFOOD PVT. LTD., a technology company based in Surat, Gujarat. Its tagline is *Sustainable Dining, Smarter Living*.',
        'His aim is to connect customers, food vendors, restaurants, corporate canteens and local businesses on one platform. He is clear about who it is for: technology, he says, should not only help large businesses. It should open doors for small vendors, local shops and traditional food businesses too.',
      ],
    },
    {
      _type: 'section',
      _key: 'inspiration',
      heading: 'The lunch order that still goes by phone',
      paragraphs: [
        'BOOKFOOD started with problems Kartik kept seeing in everyday food businesses. Many still run on phone calls, handwritten registers and orders taken by hand.',
        'In offices and industrial areas, employees often phone a nearby canteen for tea, coffee, lunch or snacks. With many people ordering at once, orders get mixed up, delayed or lost, and nobody can see the full picture of the day. Small food vendors and local shops have a different problem: little access to technology, and few ways to reach new customers.',
        'He saw room for something simple, affordable and practical that would help both sides.',
      ],
    },
    {
      _type: 'quote',
      _key: 'q1',
      text: 'My inspiration was not simply to start another food delivery company. I wanted to create a complete ecosystem that could improve how the food and local commerce industry operates.',
      cite: 'Kartik Baladia',
    },
    {
      _type: 'section',
      _key: 'problem',
      heading: 'Four places where things still run on paper',
      paragraphs: [
        '**Corporate canteens** take orders by phone and in handwritten registers, which makes it hard to track many orders at once and leaves little record of daily sales.',
        '**Small food vendors** find it hard to reach customers online, promote themselves and build a regular base, and some digital platforms cost more than they can afford.',
        '**Local shops** have little online visibility and struggle to compete with large organised platforms.',
        '**Restaurants** often buy daily raw materials in an unorganised way, with reliable suppliers hard to find and prices and quality that change.',
      ],
    },
    {
      _type: 'pillars',
      _key: 'pillars',
      label: 'The three parts of BOOKFOOD, and the supply network behind them',
      items: [
        { _key: 'k1', label: 'BOOKFOOD Canteen', icon: 'factory', tone: 'gold' },
        { _key: 'k2', label: 'BOOKFOOD Market', icon: 'home', tone: 'green' },
        { _key: 'k3', label: 'BOOKFOOD Restro', icon: 'flame', tone: 'teal' },
        { _key: 'k4', label: 'Raw material supply', icon: 'truck', tone: 'indigo' },
      ],
    },
    {
      _type: 'section',
      _key: 'solution',
      heading: 'One platform in three parts',
      paragraphs: [
        "**BOOKFOOD Canteen** is digital ordering and management for canteens in offices, factories, construction sites, schools, colleges, industrial areas and tiffin services. It is BOOKFOOD's first product.",
        '**BOOKFOOD Market** is planned to connect customers with nearby grocery stores, dairy shops and other daily-use retailers.',
        '**BOOKFOOD Restro** is planned as a set of digital tools for restaurants, backed by a business-to-business network for buying raw materials.',
      ],
    },
    {
      _type: 'section',
      _key: 'unique',
      heading: 'Built for the small vendor as much as the big client',
      paragraphs: [
        'Most food apps pick one slice of the business. Kartik wants the three parts of BOOKFOOD to connect, so customers, vendors, shops, restaurants and suppliers end up on the same network.',
        'He wants it to stay simple and affordable for businesses of every size, and he is building for long relationships with vendors. To help small vendors take the first step online, BOOKFOOD plans a limited free introductory period for eligible small vendors.',
        'The supply network is the part he sees as most different. The plan is to connect restaurants with farmers, wholesalers, manufacturers and verified distributors for everyday ingredients: vegetables, dairy, rice, flour, oils, spices and pulses.',
      ],
    },
    {
      _type: 'section',
      _key: 'challenges',
      heading: 'Starting small, and earning trust',
      paragraphs: [
        'Kartik started BOOKFOOD with limited money, no established team and no large business setup behind him. Much of the early work was building a team of developers, designers, managers, sales and operations people who share the vision, and turning an idea into a real project.',
        'Building the product meant planning, development, testing and constant improvement, with one goal: simple for customers and easy for vendors. Learning the market was its own task, because canteens, small vendors, restaurants and shops all work differently, price differently and have different customers.',
        "Then there is trust. Many traditional businesses have never used a digital system, and winning them over takes patience, demonstrations and steady support. Kartik sees these challenges as part of building a business that lasts, rather than one that only grows fast.",
      ],
    },
    {
      _type: 'section',
      _key: 'achievements',
      heading: 'Where BOOKFOOD stands today',
      paragraphs: [
        'Kartik is direct about where things are: BOOKFOOD is in early business development and market validation, and he would rather measure it by real progress than by big claims.',
        "So far, BOOKFOOD PVT. LTD. is set up as a technology company. The first version of BOOKFOOD Canteen is ready for testing and validation, and the Android and iOS apps are in progress. Around them sit a plan for all three parts of the platform, a Gujarat entry plan for ten cities, and an approach that pairs paid contracts with large clients with onboarding for small vendors.",
        'For him, the biggest achievement so far is turning an idea into a structured project with a product roadmap, a team-building plan and a long-term direction.',
      ],
    },
    {
      _type: 'steps',
      _key: 'plan',
      label: "Kartik's plan for BOOKFOOD",
      steps: [
        { _key: 's1', title: 'Canteen in Gujarat', text: 'Next: ten Gujarat cities, over about 6 to 12 months', icon: 'factory', tone: 'gold' },
        { _key: 's2', title: 'Market', text: 'Goal: nearby shops, with delivery or pickup', icon: 'home', tone: 'green' },
        { _key: 's3', title: 'Restro', text: 'Goal: restaurant tools and a raw material network', icon: 'truck', tone: 'teal' },
        { _key: 's4', title: 'Across India', text: 'Goal: other states, once Gujarat is stable', icon: 'map', tone: 'indigo' },
        { _key: 's5', title: 'Abroad', text: 'Goal: international markets, much later', icon: 'chart', tone: 'gold' },
      ],
    },
    {
      _type: 'section',
      _key: 'next',
      heading: 'Starting with ten cities in Gujarat',
      paragraphs: [
        'The first step is BOOKFOOD Canteen in Gujarat. BOOKFOOD plans two tracks at once: paid contracts with companies, factories, institutions and large canteens, and field representatives signing up small canteens and food businesses with introductory offers. Kartik expects this phase to take about 6 to 12 months, depending on how the market responds and how much the team can take on.',
      ],
    },
    {
      _type: 'regions',
      _key: 'cities',
      label: 'Gujarat cities planned for BOOKFOOD Canteen',
      regions: ['Surat', 'Ahmedabad', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Vapi', 'Bharuch', 'Ankleshwar', 'Jamnagar', 'Bhavnagar'],
    },
    {
      _type: 'section',
      _key: 'later',
      heading: 'Then shops, restaurants and beyond',
      paragraphs: [
        "Once the canteen business is on solid ground, BOOKFOOD plans to launch Market. Customers would choose how they get their order: delivery by the shop's own staff, picking it up themselves, or delivery through BOOKFOOD partners where available.",
        'After that comes Restro, with digital tools for restaurants and a supply network meant to bring quality raw materials at fair, open prices. When the Gujarat model is stable and pays for itself, the plan is to take it to other states, and in the long run, once the model is proven and the right partners and permissions are in place, to look at markets outside India.',
      ],
    },
    {
      _type: 'section',
      _key: 'advice',
      heading: 'Advice for aspiring entrepreneurs',
      paragraphs: [
        "Kartik's main advice is to **solve a real problem rather than chase a trend**. An idea alone does not build a company: execution, patience, teamwork, discipline and learning matter just as much.",
        "He keeps a short list. Understand people's difficulties before you build anything. Don't wait for perfect conditions; start with what you have and improve step by step. Build the right team. Never assume customers will want your product just because you believe in it. Value trust with customers, staff, partners and vendors over quick gains. Watch revenue, costs, cash flow and profit with equal care. And be patient, because a lasting company takes time and learning from failure.",
      ],
    },
    {
      _type: 'quote',
      _key: 'q2',
      text: `A successful entrepreneur should not only ask, "How much can my business earn?" but also, "How many people's lives and businesses can my idea improve?"`,
      cite: 'Kartik Baladia',
    },
  ],

  sidebar: {
    stats: [
      { value: '3', label: 'Parts of the platform planned' },
      { value: '10', label: 'Gujarat cities in the first plan' },
      { value: '1', label: 'Product ready for testing: Canteen' },
    ],
    features: [
      { _key: 'f1', label: 'Canteens', text: 'Ordering for offices, factories and campuses', icon: 'factory', tone: 'gold' },
      { _key: 'f2', label: 'Local shops', text: 'Nearby stores, planned for Market', icon: 'home', tone: 'green' },
      { _key: 'f3', label: 'Restaurants', text: 'Tools and supply, planned for Restro', icon: 'flame', tone: 'teal' },
      { _key: 'f4', label: 'Head office', text: 'Surat, Gujarat', icon: 'map', tone: 'indigo' },
    ],
    quote: {
      text: 'Focus on solving real problems rather than chasing business trends.',
      cite: 'Kartik Baladia',
    },
  },

  topics: ['Food tech', 'Canteens', 'Local commerce', 'Surat', 'Gujarat'],
  related: ['praveen-chaudhary-ultrapeak', 'hina-soni-abcd'],

  // Founders page. Surat, Gujarat, from his answers. No founding year was given and his
  // numbers are plans, so the card shows no metric.
  listing: {
    state: 'gj',
  },

  seo: {
    title: 'Kartik Baladia: moving canteen orders from paper to an app',
    description:
      'How Kartik Baladia is building BOOKFOOD in Surat, one platform for corporate canteens, local shops and restaurants, starting with ten cities in Gujarat.',
    image: 'https://res.cloudinary.com/nkhny4aq/image/upload/c_fill,g_face,w_1200,h_630/f_jpg,q_auto/v1793820112/18677549-d1dc-4dbd-b67b-07f1faf101ef.png',
  },
};

export default journey;
