import type { FounderJourney } from '@/lib/journey/types';

/**
 * Navjot Kaur, C11 Aura (by Organic Skin Craft). Written from the founder's own
 * answers (received 4 Nov 2026), edited for clarity with every number, name,
 * date and claim kept as she gave it.
 *
 * Not given: founding year (she says the idea came about three years ago, which
 * is not a founding date), city or state, website, social handles. So there is
 * no company.founded, location is "India", and there is no `listing` (the
 * Founders map needs a state). Her phone number and email are deliberately not
 * on the page.
 *
 * Product claims ("science-backed", "clinically studied ingredients") are the
 * brand's own descriptions. The page attributes them to her and the note says
 * we have not tested the products. The roll-out dates are her plan.
 *
 * Photo: the founder's portrait, hosted on Cloudinary (received 5 Nov 2026,
 * 1536x1024). The hero adds resizing and AVIF/WebP itself (lib/cloudinary.ts),
 * so the URL here is the plain upload.
 */
const PHOTO = 'https://res.cloudinary.com/nkhny4aq/image/upload/v1793822615/Warm_Skincare_Studio_Portrait.png';

const journey: FounderJourney = {
  slug: 'navjot-kaur-c11-aura',
  status: 'published',
  publishedAt: '2026-11-04T19:30:00Z',
  author: 'Udyam Manch Team',

  founder: { name: 'Navjot Kaur', location: 'India' },

  company: {
    name: 'C11 Aura',
    summary:
      'An Indian skincare and personal care brand by Organic Skin Craft, starting with products for pigmentation.',
    icon: 'smile',
    industry: 'Beauty and personal care',
  },

  hero: {
    title: 'Building the skincare she ==spent years searching for==.',
    dek:
      'Navjot Kaur has lived with pigmentation since childhood. She left a secure career and a comfortable life in Canada to build **C11 Aura**, a skincare brand that starts with that one concern.',
    image: {
      url: PHOTO,
      alt: 'Navjot Kaur, founder of C11 Aura, smiling at a desk with a laptop in a pink blazer and white shirt, skincare bottles on the desk and on shelves behind her, and a line drawing of a face and leaves on the wall',
      width: 1536,
      height: 1024,
    },
    portrait: 'photo',
    stage: {
      scriptName: 'Navjot Kaur',
      role: 'Founder, C11 Aura',
      quote: "Don't wait until you have everything figured out.",
    },
  },

  body: [
    {
      _type: 'note',
      _key: 'note',
      text: "This story is based on Navjot's own answers to our questions, and her quotes are lightly edited for clarity. How the products work is described in her words; we have not tested them. The roll-out dates are her plan, not results yet.",
    },
    {
      _type: 'section',
      _key: 'who',
      heading: 'From IT to skincare',
      paragraphs: [
        'Navjot Kaur is the founder of C11 Aura, an Indian skincare and personal care brand from Organic Skin Craft. She is also a writer, and the author of two books, including the Amazon bestseller *Your Skincare Bible*.',
        'Before C11 Aura she spent several years in the IT sector. She credits that work with teaching her how to solve problems and how to work in a structured way, and she now brings both to a brand that aims to make effective, science-backed skincare easier to get.',
      ],
    },
    {
      _type: 'section',
      _key: 'inspiration',
      heading: 'A problem she knew from childhood',
      paragraphs: [
        'Navjot never planned to start a business. The idea for C11 Aura came about three years ago, out of something she had dealt with for as long as she can remember: pigmentation.',
        'Over the years she tried almost everything. Mesotherapy, Korean glass skin treatments, microneedling, and a long list of Indian and international products. After all that time, money and effort, nothing truly worked for her skin.',
        'She realised she was not the only one. Thousands of women were spending money on products and treatments and still not finding an answer.',
      ],
    },
    {
      _type: 'quote',
      _key: 'q1',
      text: 'Instead of continuously searching for a solution, I wanted to build one.',
      cite: 'Navjot Kaur',
    },
    {
      _type: 'section',
      _key: 'problem',
      heading: 'Why pigmentation',
      paragraphs: [
        'Hyperpigmentation is one of the most persistent skin concerns in India, and Navjot sees it as underserved. It affects a large number of Indian women, yet effective and affordable options are still hard to find.',
        'In her view, most products on the shelf rely on a single ingredient or on low concentrations of actives. Stubborn pigmentation, she says, usually needs more than that: several clinically studied ingredients working together on the different causes of excess pigment.',
        "That gap is where C11 Aura starts. The brand's formulations combine complementary active ingredients in effective concentrations, designed around the skin concerns Indian consumers face.",
      ],
    },
    {
      _type: 'pillars',
      _key: 'concerns',
      label: 'What pigmentation covers',
      items: [
        { _key: 'c1', label: 'Dark spots', icon: 'sun', tone: 'gold' },
        { _key: 'c2', label: 'Acne marks', icon: 'droplet', tone: 'green' },
        { _key: 'c3', label: 'Melasma', icon: 'layers', tone: 'teal' },
        { _key: 'c4', label: 'Uneven skin tone', icon: 'smile', tone: 'indigo' },
      ],
    },
    {
      _type: 'section',
      _key: 'unique',
      heading: 'Problem first, not ingredient first',
      paragraphs: [
        'Many skincare brands build their range around whichever ingredient is trending. C11 Aura works the other way round: find a real skin concern that keeps coming back, then build a product for it. Pigmentation is the first.',
        'Navjot also wants skincare to be simpler. Instead of a 10-step routine, she wants a few multifunctional products that deal with a concern in fewer steps. As she puts it, skincare should fit into women\'s lives, not make them more complicated.',
        'She wants the products to feel good to use and to look modern, too, so that effective skincare is also something people enjoy.',
      ],
    },
    {
      _type: 'section',
      _key: 'founder-led',
      heading: 'The founder is the face of the brand',
      paragraphs: [
        'C11 Aura does not lean on big advertising budgets or celebrity endorsements. Navjot is its face and its voice. She makes the content herself, explains skincare to her audience, shares how the brand is being built and talks to customers directly on social media.',
        'The idea is that showing up consistently builds trust, and that trust builds a community around the brand.',
      ],
    },
    {
      _type: 'section',
      _key: 'challenges',
      heading: 'Starting over, from scratch',
      paragraphs: [
        'The first hurdle was at home. Navjot had to convince her family, especially her parents, that leaving a secure career and a comfortable life in Canada for a startup with no guarantees was the right call.',
        'Then came the industry itself. She had never worked in skincare, so she learned it from the ground up: formulations, sourcing, manufacturing, regulations and what customers expect. Running a bootstrapped business as a woman entrepreneur in India brought its own set of challenges.',
        'The work was hands on. Finding the right manufacturing partners, several rounds of R&D, developing the formulations, packaging delays, difficult vendors and a tight budget were all part of it.',
        'There was a personal challenge too: she was uncomfortable in front of a camera. She pushed through it, started making content and learned to speak to her audience directly. Within three months she grew one of her Instagram accounts to 15,000 followers.',
      ],
    },
    {
      _type: 'quote',
      _key: 'q2',
      text: 'A lack of resources should never become a reason to stop pursuing a vision.',
      cite: 'Navjot Kaur',
    },
    {
      _type: 'section',
      _key: 'achievements',
      heading: 'What she has built so far',
      paragraphs: [
        'Navjot has published two books. *Your Skincare Bible* became an Amazon bestseller. *The Secrets of Mindfulness* grew out of her own journey of self discovery and growth.',
        'Her IT career led to an invitation for Canadian permanent residency, and with it international experience she still draws on.',
        'With C11 Aura she has turned a personal problem into a business. Working in an unfamiliar industry with limited resources, she has driven much of the work herself: product development, multiple rounds of R&D, choosing a manufacturer, packaging, brand positioning and marketing.',
        'For her, the real achievement is the habit behind all of it: taking an idea, learning whatever it takes to carry it out, and staying with it when things get hard.',
      ],
    },
    {
      _type: 'steps',
      _key: 'plan',
      label: "Navjot's plan for C11 Aura",
      steps: [
        { _key: 's1', title: 'Online first', text: 'Nov 2026 to Mar 2027: own website and leading marketplaces, first loyal customers', icon: 'chart', tone: 'gold' },
        { _key: 's2', title: 'Into shops', text: 'From Dec 2026: retail partnerships in key Indian markets', icon: 'home', tone: 'green' },
        { _key: 's3', title: 'More products', text: '2027 onwards: skincare and personal care beyond pigmentation', icon: 'layers', tone: 'teal' },
        { _key: 's4', title: 'Across India', text: '2027 to 2029: online, marketplaces and retail, nationwide', icon: 'map', tone: 'indigo' },
        { _key: 's5', title: 'Beyond India', text: '2029 to 2031: international markets', icon: 'award', tone: 'gold' },
      ],
    },
    {
      _type: 'section',
      _key: 'next',
      heading: 'Where C11 Aura goes next',
      paragraphs: [
        "Navjot's goal is to make C11 Aura India's number one skincare and personal care brand within five years.",
        'The first step, from November 2026 to March 2027, is selling directly to customers through the brand\'s own website and leading online marketplaces. The aim is to build awareness, win a first group of loyal customers, learn what they want and give them reasons to come back.',
        'Offline retail is planned from December 2026, through retail partnerships in key Indian markets. From 2027 the range is meant to grow beyond pigmentation into other skincare and personal care products, still science-backed, multifunctional and simple to use.',
        'Between 2027 and 2029 the plan is a nationwide presence across the brand\'s website, marketplaces and shops, backed by a stronger supply chain, manufacturing partners and distribution. Between 2029 and 2031 she hopes to take C11 Aura abroad as an Indian beauty brand known around the world.',
        "In her words, the point is not just to sell beauty products. It is to simplify beauty routines and solve real consumer problems at scale.",
      ],
    },
    {
      _type: 'section',
      _key: 'advice',
      heading: 'Advice for aspiring entrepreneurs',
      paragraphs: [
        "Navjot's main advice is not to wait until everything is figured out. You do not need all the resources, experience or connections at the start. You need a clear vision, a willingness to learn and the courage to take the first step.",
        'When she started C11 Aura she had to learn everything from scratch, from product development and manufacturing to marketing, sales and operations. There were uncertain moments and decisions that took her far outside her comfort zone. What she learned is that adapting and solving problems matter as much as the idea itself.',
        'Start with a problem worth solving, she says. Understand your customers, stay close to the business and do the work yourself, especially early on. Do not be discouraged by slow progress, and do not compare your journey with anyone else\'s.',
        'You do not need a business background to become an entrepreneur. You need the courage to start, the discipline to keep going and the resilience to figure things out along the way.',
      ],
    },
  ],

  sidebar: {
    stats: [
      { value: '2', label: 'Books published' },
      { value: '15,000', label: 'Instagram followers in three months' },
      { value: '5', label: 'Stages in her growth plan' },
    ],
    features: [
      { _key: 'f1', label: 'Pigmentation first', text: 'The first concern the brand works on', icon: 'sun', tone: 'gold' },
      { _key: 'f2', label: 'Combined actives', text: 'Complementary ingredients, not one hero ingredient', icon: 'layers', tone: 'green' },
      { _key: 'f3', label: 'Fewer steps', text: 'Multifunctional products for a simpler routine', icon: 'check', tone: 'teal' },
      { _key: 'f4', label: 'Founder led', text: 'Navjot makes the content and talks to customers', icon: 'users', tone: 'indigo' },
    ],
    quote: {
      text: 'You just need the courage to start.',
      cite: 'Navjot Kaur',
    },
  },

  topics: ['Skincare', 'Beauty and personal care', 'Women founders', 'D2C', 'Consumer brands'],
  related: ['praveen-chaudhary-ultrapeak', 'hina-soni-abcd'],

  seo: {
    title: 'Navjot Kaur: building C11 Aura, a skincare brand for pigmentation',
    description:
      'Navjot Kaur left a secure career and a life in Canada to build C11 Aura, an Indian skincare brand that starts with pigmentation.',
    image: 'https://res.cloudinary.com/nkhny4aq/image/upload/c_fill,g_face,w_1200,h_630/f_jpg,q_auto/v1793822615/Warm_Skincare_Studio_Portrait.png',
  },
};

export default journey;
