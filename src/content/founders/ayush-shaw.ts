import type { FounderJourney } from '@/lib/journey/types';

const journey: FounderJourney = {
  slug: 'ayush-shaw-shaw-agrivolt-gas',
  status: 'published',
  publishedAt: '2026-10-18T10:00:00Z',
  author: 'Udyam Manch Team',

  founder: { name: 'Ayush Shaw', location: 'India' },

  company: {
    name: 'Shaw Agrivolt Gas',
    summary:
      'Advancing renewable energy, waste management and rural development through Compressed Biogas (CBG).',
    website: 'https://shawagrivoltgas.com',
    logo: { url: '/assets/ayush-shaw/shaw-agrivolt-gas-logo.svg', alt: '' },
    industry: 'Clean energy',
    founded: '2023', // carried over from the old directory list: verify
  },

  hero: {
    title: 'From agricultural waste to ==clean energy== for a stronger India.',
    dek:
      'How Ayush Shaw is building **Shaw Agrivolt Gas**, a Compressed Biogas (CBG) venture that converts agricultural waste into clean energy, organic fertilisers and new opportunities for farmers and rural communities.',
    image: {
      url: '/assets/ayush-shaw/ayush-shaw-hero-transparent.webp',
      alt: 'Ayush Shaw, founder of Shaw Agrivolt Gas, photographed against agricultural and biogas imagery',
    },
  },

  body: [
    {
      _type: 'section',
      _key: 'vision',
      heading: 'A vision rooted in real challenges',
      paragraphs: [
        'Growing up in India, Ayush Shaw saw the enormous potential in agricultural waste. Every year, large quantities of crop residues like paddy straw, along with cow dung and other organic materials, are generated. Much of this potential still goes unused.',
        "He saw an opportunity to turn this challenge into a business: converting agricultural residues into Compressed Biogas (CBG). For Ayush, this journey is about more than producing fuel. It is about creating value from waste, supporting farmers and contributing to India's move towards cleaner and more sustainable energy.",
      ],
    },
    {
      _type: 'quote',
      _key: 'q1',
      text: 'Agricultural waste is not a problem. It is an opportunity for cleaner energy, healthier soil and stronger rural India.',
      cite: 'Ayush Shaw',
    },
    {
      _type: 'figure',
      _key: 'straw',
      image: {
        url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80',
        alt: 'Hands holding paddy straw, the main feedstock Shaw Agrivolt Gas turns into biogas',
        caption: 'Paddy straw, one of the main feedstocks for Compressed Biogas production.',
        credit: 'Unsplash',
      },
    },
    {
      _type: 'section',
      _key: 'value',
      heading: 'From waste to several sources of value',
      paragraphs: [
        'Shaw Agrivolt Gas is exploring a CBG model that uses several feedstocks: paddy straw, cow dung and other suitable organic materials. Through anaerobic digestion, these materials can be converted into clean, commercially valuable biogas and organic fertilisers.',
      ],
    },
    {
      _type: 'steps',
      _key: 'process',
      label: 'How CBG is produced',
      steps: [
        { _key: 's1', title: 'Agricultural waste', text: 'Paddy straw, cow dung and other organic feedstocks', icon: 'layers', tone: 'gold' },
        { _key: 's2', title: 'Anaerobic digestion', text: 'Conversion into biogas and digestate', icon: 'clock', tone: 'green' },
        { _key: 's3', title: 'Compressed Biogas', text: 'A cleaner alternative to fossil fuels', icon: 'check', tone: 'teal' },
        { _key: 's4', title: 'Organic fertilisers', text: 'Solid and liquid products for healthier soil', icon: 'sprout', tone: 'indigo' },
      ],
    },
    {
      _type: 'section',
      _key: 'future',
      heading: 'Building a sustainable and scalable future',
      paragraphs: [
        'The immediate priority is to develop the proposed CBG project into a technically sound, financially sustainable and commercially viable operation. Over the longer term, Shaw Agrivolt Gas aims to grow in the renewable energy sector, explore more waste streams and build a business model that can be repeated in other regions.',
        "By building around a circular economy, where waste becomes wealth, Ayush Shaw is showing that India's agricultural heartland holds the raw materials for its clean energy future.",
      ],
    },
    {
      _type: 'pillars',
      _key: 'impact',
      label: 'Impact the venture is working towards',
      items: [
        { _key: 'p1', label: 'Cleaner environment', icon: 'smile', tone: 'green' },
        { _key: 'p2', label: 'Higher farmer incomes', icon: 'users', tone: 'gold' },
        { _key: 'p3', label: 'Rural jobs and development', icon: 'home', tone: 'indigo' },
        { _key: 'p4', label: 'Circular economy', icon: 'recycle', tone: 'teal' },
        { _key: 'p5', label: 'Impact that can scale across India', icon: 'chart', tone: 'green' },
      ],
    },
  ],

  sidebar: {
    features: [
      { _key: 'f1', label: 'Renewable energy', text: 'A cleaner alternative to fossil fuels', icon: 'zap', tone: 'green' },
      { _key: 'f2', label: 'Waste management', text: 'Using agricultural and organic waste', icon: 'recycle', tone: 'teal' },
      { _key: 'f3', label: 'Organic fertilisers', text: 'Solid and liquid products', icon: 'sprout', tone: 'gold' },
      { _key: 'f4', label: 'Rural development', text: 'Supporting farmers and local communities', icon: 'users', tone: 'indigo' },
    ],
    quote: {
      text: 'Our goal is to build an integrated circular economy business where agricultural waste becomes a resource for energy, soil enrichment and rural economic activity.',
      cite: 'Ayush Shaw',
    },
  },

  topics: [
    'Renewable energy',
    'Compressed Biogas',
    'Waste management',
    'Agriculture',
    'Rural development',
    'Circular economy',
  ],
  related: ['kishan-panchal-farming-solutions-india'],
  // Founders page. State confirmed by Rohan on 24 Oct 2026. Swap the metric for a real headline number once verified.
  listing: {
    state: 'wb',
    metric: { value: '2023', label: 'year founded', verified: false },
  },

  seo: {
    title: 'Ayush Shaw: from agricultural waste to clean energy',
    description:
      'How Ayush Shaw is building Shaw Agrivolt Gas, a CBG venture turning agricultural waste into clean energy and organic fertilisers for Indian farmers.',
    image: '/assets/ayush-shaw/ayush-shaw-og.jpg',
  },
};

export default journey;
