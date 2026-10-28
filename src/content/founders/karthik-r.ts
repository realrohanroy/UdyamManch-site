import type { FounderJourney } from '@/lib/journey/types';

/**
 * Karthik R, AurumCrypto. Written from the founder's own answers.
 *
 * Photo: the founder's portrait, hosted on Cloudinary (received 28 Oct 2026). The hero
 * adds resizing and AVIF/WebP itself (lib/cloudinary.ts), so the URL here is the upload.
 */
const PHOTO = 'https://res.cloudinary.com/nkhny4aq/image/upload/v1793186538/Editorial_Portrait_with_Geometric_Accents.png';
const journey: FounderJourney = {
  slug: 'karthik-r-aurumcrypto',
  status: 'published',
  publishedAt: '2026-10-27T10:00:00Z',
  author: 'Udyam Manch Team',

  founder: { name: 'Karthik R', location: 'Bangalore, Karnataka' },

  company: {
    name: 'AurumCrypto',
    summary:
      'An AI-driven crypto asset management ecosystem with automated trading, a secure Web3 wallet and an academy for investors.',
    website: 'https://aurumcrypto.io',
    icon: 'chart',
    industry: 'Fintech',
    city: 'Bangalore',
    founded: '2025', // the company was incorporated in 2025 (from Rohan, 27 Oct 2026)
  },

  hero: {
    title: 'Making ==crypto investing== simple, secure and intelligent for everyone.',
    dek:
      'How Karthik R built **AurumCrypto**, an AI-driven crypto asset management ecosystem, to close the gap between institutional tools and everyday investors.',
    image: {
      url: PHOTO,
      alt: 'Karthik R, founder of AurumCrypto, in a brown blazer, seated in front of a cream wall with navy and gold shapes',
      width: 1536,
      height: 1024,
    },
    portrait: 'photo',
    stage: {
      scriptName: 'Karthik R',
      role: 'Founder, AurumCrypto',
      quote: 'Build trust before you build profits.',
    },
  },

  body: [
    {
      _type: 'note',
      _key: 'note',
      text: "This story is based on Karthik's own answers to our questions. The claims and figures are his, and Udyam Manch has not independently verified them. Nothing here is investment advice. Crypto assets can lose value quickly.",
    },
    {
      _type: 'section',
      _key: 'who',
      heading: 'A fintech founder with a simple mission',
      paragraphs: [
        'Karthik R is the founder of AurumCrypto.io, a fintech entrepreneur and crypto strategist based in Bangalore. His background is in finance, technology and AI-driven systems.',
        'He started AurumCrypto, which was incorporated in 2025, with one mission: to make crypto investing simple, secure and intelligent for everyone, not just for traders.',
      ],
    },
    {
      _type: 'section',
      _key: 'why',
      heading: 'Why he started AurumCrypto',
      paragraphs: [
        'Two things pushed Karthik to start. First, he saw thousands of retail investors losing money because crypto is complex, volatile and driven by emotion. Second, he saw institutions using AI and automation to win, while retail users were left with guesswork. He wanted to bridge that gap.',
        'The name carries the idea. Aurum is Latin for gold, and the team wanted to create a golden standard for crypto asset management, powered by AI and built on transparency.',
      ],
    },
    {
      _type: 'quote',
      _key: 'q1',
      text: 'We wanted to create a golden standard for crypto asset management, powered by AI, built on transparency.',
      cite: 'Karthik R',
    },
    {
      _type: 'section',
      _key: 'problems',
      heading: 'Three problems, one ecosystem',
      paragraphs: ['Karthik says AurumCrypto is built to solve three core problems for everyday investors.'],
    },
    {
      _type: 'steps',
      _key: 'problem-list',
      label: 'The three problems AurumCrypto solves',
      steps: [
        { _key: 'p1', title: 'Complexity', text: 'Managing a portfolio across several exchanges is hard', icon: 'layers', tone: 'gold' },
        { _key: 'p2', title: 'Risk', text: 'Most investors do not have risk management tools', icon: 'flame', tone: 'green' },
        { _key: 'p3', title: 'Trust and education', text: 'There are few secure platforms that put education first', icon: 'users', tone: 'teal' },
      ],
    },
    {
      _type: 'section',
      _key: 'answer',
      paragraphs: [
        'AurumCrypto answers with an ecosystem: AI-powered automated trading through its EX AI Bot, a secure Web3 wallet called Aurum Wallet with bank-grade encryption, and Aurum Academy to educate investors.',
      ],
    },
    {
      _type: 'figure',
      _key: 'ecosystem',
      image: {
        url: '/assets/karthik-r/aurum-ecosystem.svg',
        alt: 'Diagram of the AurumCrypto ecosystem: automated AI management, AI-Trader EX for risk control, Aurum Wallet for Web3 security and Aurum Academy for learning, all joined to AurumCrypto at the centre',
        caption: 'Illustration by Udyam Manch: how the parts of AurumCrypto fit together, as Karthik describes them.',
        width: 1200,
        height: 675,
      },
    },
    {
      _type: 'section',
      _key: 'challenges',
      heading: 'Earning trust in a hard market',
      paragraphs: [
        'The biggest challenge in crypto, Karthik says, is building trust. AurumCrypto faced a bear market, regulatory uncertainty in India and plenty of scepticism about AI trading bots.',
        'The team answered with transparency: no fake returns, real risk controls, audited security and community-first education.',
        'The engineering was demanding too. Building a 24/7 AI system that adapts to market sentiment, whale movements and liquidity shifts was, in his words, technically very demanding.',
      ],
    },
    {
      _type: 'figure',
      _key: 'signals',
      image: {
        url: '/assets/karthik-r/market-signals.svg',
        alt: 'Diagram: market sentiment, whale movements and liquidity shifts all feed into a 24/7 AI system that adapts',
        caption: 'Illustration by Udyam Manch: the three kinds of signal the AI system has to adapt to.',
        width: 1200,
        height: 675,
      },
    },
    {
      _type: 'section',
      _key: 'unique',
      heading: 'More than an exchange or a bot',
      paragraphs: [
        "Karthik says AurumCrypto is not just an exchange or just a bot. He calls it the world's first complete AI-driven crypto asset management ecosystem. That is his claim, and we have not verified it.",
        'It brings four pillars together in one place. The aim is to remove emotional trading and let data drive decisions.',
      ],
    },
    {
      _type: 'pillars',
      _key: 'pillars',
      label: 'The four pillars of AurumCrypto',
      items: [
        { _key: 'k1', label: 'Automated AI management', icon: 'zap', tone: 'gold' },
        { _key: 'k2', label: 'AI-Trader EX for risk control', icon: 'chart', tone: 'green' },
        { _key: 'k3', label: 'Aurum Wallet for security', icon: 'check', tone: 'teal' },
        { _key: 'k4', label: 'Aurum Academy for learning', icon: 'users', tone: 'indigo' },
      ],
    },
    {
      _type: 'section',
      _key: 'built',
      heading: 'What the team has built so far',
      paragraphs: [
        '**A global community.** Learners and investors across India, the Middle East and Europe.',
        '**AI-Trader EX.** A proprietary system that operates 24/7 and aims to minimise emotional losses.',
        '**Aurum Academy.** Karthik says it has helped thousands of beginners start their crypto journey safely.',
        '**Security.** No compromise on security, with AES-256 and TLS 1.3 encryption and secure Web3 infrastructure.',
      ],
    },
    {
      _type: 'section',
      _key: 'next',
      heading: 'Where AurumCrypto goes next',
      paragraphs: ["Karthik's roadmap has four clear steps."],
    },
    {
      _type: 'steps',
      _key: 'roadmap',
      label: 'AurumCrypto roadmap',
      steps: [
        { _key: 'r1', title: 'Aurum Exchange', text: 'Launch its own liquidity hub', icon: 'layers', tone: 'gold' },
        { _key: 'r2', title: 'Aurum Neobank', text: 'Virtual and physical cards for crypto-to-fiat spending', icon: 'zap', tone: 'green' },
        { _key: 'r3', title: 'Regional languages', text: 'Scale Aurum Academy to Kannada, Hindi and Tamil', icon: 'map', tone: 'teal' },
        { _key: 'r4', title: 'Licences', text: "Get regulatory compliant licences to become India's most trusted AI crypto asset manager", icon: 'check', tone: 'indigo' },
      ],
    },
    {
      _type: 'section',
      _key: 'goal',
      paragraphs: [
        'The goal, Karthik says, is to make AurumCrypto the go-to platform for anyone who wants to grow wealth with crypto intelligently.',
      ],
    },
    {
      _type: 'section',
      _key: 'advice',
      heading: 'Advice for aspiring entrepreneurs',
      paragraphs: [
        'Karthik shares three lessons.',
        '**Do not chase hype, solve a real problem.** Crypto is not about quick money.',
        '**Build trust before you build profits.** Transparency is your biggest asset.',
        '**AI is the future, but human education is irreplaceable.** Build products that empower people, not just automate them.',
      ],
    },
    {
      _type: 'quote',
      _key: 'q2',
      text: 'Build trust before you build profits. Transparency is your biggest asset.',
      cite: 'Karthik R',
    },
    {
      _type: 'section',
      _key: 'more',
      paragraphs: ["To see what AurumCrypto offers, visit Karthik's website at aurumcrypto.io."],
    },
  ],

  sidebar: {
    stats: [
      { value: '24/7', label: 'AI trading system' },
      { value: '3', label: 'Regions: India, Middle East, Europe' },
      { value: 'AES-256', label: 'Encryption standard' },
    ],
    features: [
      { _key: 'f1', label: 'EX AI Bot', text: 'Automated trading powered by AI', icon: 'zap', tone: 'gold' },
      { _key: 'f2', label: 'Aurum Wallet', text: 'Secure Web3 wallet with bank-grade encryption', icon: 'check', tone: 'green' },
      { _key: 'f3', label: 'Aurum Academy', text: 'Education for new investors', icon: 'users', tone: 'teal' },
      { _key: 'f4', label: 'Aurum Neobank', text: 'Planned: virtual and physical cards', icon: 'award', tone: 'indigo' },
    ],
    quote: {
      text: 'Do not chase hype. Solve a real problem.',
      cite: 'Karthik R',
    },
  },

  topics: ['Fintech', 'Crypto', 'Artificial intelligence', 'Bangalore', 'Investor education'],
  related: ['ayush-shaw-shaw-agrivolt-gas', 'kishan-panchal-farming-solutions-india'],

  // Founders page. Bangalore is in Karnataka. The headline number is the founder's own claim.
  listing: {
    state: 'ka',
    metric: { value: '24/7', label: 'AI trading system', verified: false },
  },

  seo: {
    title: 'Karthik R: making crypto investing simple, secure and intelligent',
    // 1200 x 630 crop centred on his face, as JPEG because LinkedIn is unreliable with WebP.
    image: 'https://res.cloudinary.com/nkhny4aq/image/upload/c_fill,g_face,w_1200,h_630/f_jpg,q_auto/v1793186538/Editorial_Portrait_with_Geometric_Accents.png',
    description:
      'How Karthik R built AurumCrypto, an AI-driven crypto asset management ecosystem in Bangalore with automated trading, a secure wallet and an investor academy.',
  },
};

export default journey;
