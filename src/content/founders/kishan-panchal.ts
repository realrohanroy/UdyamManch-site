import type { FounderJourney } from '@/lib/journey/types';

const CDN = 'https://res.cloudinary.com/nkhny4aq/image/upload/f_auto,q_auto';

const journey: FounderJourney = {
  slug: 'kishan-panchal-farming-solutions-india',
  status: 'published',
  publishedAt: '2026-10-15T12:00:00Z',
  author: 'Udyam Manch Team',

  founder: { name: 'Kishan Panchal', location: 'Rajasthan, India' },

  company: {
    name: 'Farming Solutions India',
    summary:
      'Agriculture infrastructure, protected farming, irrigation, solar and agribusiness solutions across India.',
    website: 'https://farmingsolutions.in',
    icon: 'sprout',
    industry: 'Agritech',
    city: 'Jaipur',
    founded: '2006', // carried over from the old directory list: verify
  },

  hero: {
    title: "Kishan for ==Kisan==:\nFrom Rajasthan's soil\nto farms across India.",
    dek:
      'How Kishan Panchal turned decades of on-ground experience into Farming Solutions India, building real solutions for farmers across Rajasthan and 10+ states in India.',
    image: {
      url: `${CDN}/v1792668702/double-portrait-yellow-halo.webp`,
      alt: 'Kishan Panchal, founder of Farming Solutions India',
    },
    stage: {
      scriptName: 'Kishan\nPanchal',
      role: 'Founder\nFarming Solutions India',
      quote: "Farmers don't just need products. They need solutions.",
      signature: ['Kishan', 'for Kisan'],
    },
  },

  body: [
    {
      _type: 'section',
      _key: 'roots',
      heading: 'A journey rooted in Rajasthan',
      paragraphs: [
        "In 1970, in Rajasthan, a boy named Kishan Panchal was born. At that time, nobody could have known how closely his name would one day connect with his life's work.",
        'Because over the years, Kishan would become deeply connected with the Kisan, **किसान**. Not just as a businessman, but as someone who spent his life understanding agriculture, farmers, technology and the real problems that exist beyond city offices and presentations.',
        'His story did not begin with a big startup. It began in the fields: with farmers, with conversations, and with a simple question. *"How can farming become better?"*',
      ],
    },
    {
      _type: 'figure',
      _key: 'field',
      image: {
        url: `${CDN}/v1792668673/field-business-school.webp`,
        alt: 'Kishan Panchal in the field with the words: Every farmer teaches you something. The field is the real business school.',
      },
    },
    {
      _type: 'section',
      _key: 'vision',
      heading: 'From one venture to a bigger vision',
      paragraphs: [
        'Before Farming Solutions India, there were other chapters: Seema Enterprises and Green Bio Tech. Each phase taught a new lesson, brought him closer to the farmer and helped him understand the bigger picture. Over time, the journey moved from supplying products to providing complete agricultural solutions.',
      ],
    },
    {
      _type: 'steps',
      _key: 'ventures',
      label: 'How the ventures evolved',
      steps: [
        { _key: 'v1', title: 'Seema Enterprises', text: 'Early years of agri trading and solutions', icon: 'home', tone: 'gold' },
        { _key: 'v2', title: 'Green Bio Tech', text: 'Focused on irrigation and inputs', icon: 'droplet', tone: 'green' },
        { _key: 'v3', title: 'Farming Solutions India', text: 'Integrated solutions nationwide', icon: 'sprout', tone: 'teal' },
      ],
    },
    {
      _type: 'section',
      _key: 'expansion',
      heading: 'Expanding beyond Rajasthan',
      paragraphs: [
        'What started in Rajasthan gradually expanded across India. Today, Farming Solutions India works with farmers and projects in Maharashtra, Gujarat, Assam, Karnataka, Jharkhand, Odisha, Punjab, Uttar Pradesh, Chhattisgarh and Haryana, each with its own challenges, climate and opportunities.',
      ],
    },
    {
      _type: 'regions',
      _key: 'states',
      label: 'States with projects',
      map: {
        url: `${CDN}/v1792668717/india-network-map.png`,
        alt: 'Map of India marking the states where Farming Solutions India runs agricultural projects',
      },
      regions: [
        'Rajasthan', 'Maharashtra', 'Gujarat', 'Assam', 'Karnataka', 'Jharkhand',
        'Odisha', 'Punjab', 'Uttar Pradesh', 'Chhattisgarh', 'Haryana',
      ],
    },
    {
      _type: 'section',
      _key: 'philosophy',
      heading: 'The philosophy: protected agriculture and farmers first',
      paragraphs: [
        'For Kishan Panchal, the mission has never just been about commercial installations. It is about resilience. Unpredictable monsoons, falling groundwater and a changing climate mean that protected farming, such as shade nets, polyhouses, efficient micro irrigation and solar pumps, is an essential safeguard for Indian farmers.',
        'By designing affordable infrastructure suited to each climate, and standing with farmers until their first harvest comes in, Farming Solutions India represents the true spirit of Indian grassroots entrepreneurship.',
      ],
    },
  ],

  sidebar: {
    stats: [
      { value: '20+', label: 'Years experience' },
      { value: '5,00,000+', label: 'sq m of polyhouses' },
      { value: '10,000+', label: 'Farmers trained' },
      { value: '1,000+', label: 'Hectares of drip' },
      { value: '350+', label: 'Water pumps' },
      { value: '50+', label: 'Awards' },
    ],
    quote: { text: 'Protected agriculture is a necessity, not an option.', cite: 'Farming Solutions India' },
  },

  topics: ['Agriculture', 'Protected farming', 'Irrigation', 'Solar pumps', 'Rajasthan'],
  related: ['ayush-shaw-shaw-agrivolt-gas'],

  seo: {
    title: "Kishan for Kisan: from Rajasthan's soil to farms across India",
    description: 'How Kishan Panchal turned decades of on-ground experience into Farming Solutions India.',
    image: `${CDN},w_1200,h_630,c_fill/v1792668702/double-portrait-yellow-halo.webp`,
  },
};

export default journey;
