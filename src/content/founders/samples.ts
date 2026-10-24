/**
 * SAMPLE founder journeys. Names, figures and details are placeholders, not
 * verified facts (Design_System 4.4). They render with a visible "Sample" label.
 * Delete each one when a real journey replaces it.
 */
import type { FounderJourney } from '@/lib/journey/types';

const SAMPLE_NOTE = {
  _type: 'note' as const,
  _key: 'sample',
  text: 'Sample profile. Names and details are placeholders and not verified facts.',
};

export const sunitaMeena: FounderJourney = {
  slug: 'sunita-meena-desert-loom-crafts',
  status: 'published',
  sample: true,
  publishedAt: '2026-10-10T10:00:00Z',
  author: 'Udyam Manch Team',
  founder: { name: 'Sunita Meena', location: 'Barmer, Rajasthan' },
  company: {
    name: 'Desert Loom Collective',
    summary: 'Micro cooperatives and fair wage systems for desert weavers across western Rajasthan.',
    icon: 'shirt',
    industry: 'Textiles',
    city: 'Barmer',
    founded: '2018',
  },
  hero: {
    title: "Weaving fair wages back into ==Barmer's== looms.",
    dek: 'How a weavers collective in western Rajasthan set out to keep more of the price of every rug with the people who make it.',
    image: {
      url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
      alt: 'A handloom weaver at work',
    },
  },
  body: [
    {
      _type: 'section',
      _key: 'lead',
      heading: 'Restoring ownership to the loom',
      paragraphs: [
        'Traditional handloom artisans often receive a small share of the retail price of heritage rugs and textiles. Desert Loom Collective set out to change that ratio.',
        'The collective set up community dye centres using plant pigments and solar powered finishing, aiming at natural home furnishings for lifestyle brands.',
      ],
    },
    SAMPLE_NOTE,
  ],
  sidebar: {},
  topics: ['Textiles', 'Handloom', 'Rajasthan'],
  related: ['kishan-panchal-farming-solutions-india'],
};

export const arjunSomani: FounderJourney = {
  slug: 'arjun-somani-aarav-hydraulics',
  status: 'published',
  sample: true,
  publishedAt: '2026-10-02T08:00:00Z',
  author: 'Udyam Manch Team',
  founder: { name: 'Arjun Somani', location: 'Rajkot, Gujarat' },
  company: {
    name: 'Aarav Precision Hydraulics',
    summary: 'Hydraulic valves engineered for Indian tractor makers.',
    icon: 'wrench',
    industry: 'Manufacturing',
    city: 'Rajkot',
    founded: '2014',
  },
  hero: {
    title: 'Precision engineering in the heart of ==Rajkot==.',
    dek: "A look at how a Rajkot workshop set out to build tractor hydraulics that survive Indian heat and dust.",
    image: {
      url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
      alt: 'A machine cutting a metal part on a factory floor',
    },
  },
  body: [
    {
      _type: 'section',
      _key: 'lead',
      heading: 'Precision on the factory floor',
      paragraphs: [
        'Tractor hydraulics in India often fail early because of heat and dust. The team set out to design valves that last longer than standard fittings.',
        'Instead of importing assemblies, they spent months tuning machining cycles with domestic tool steel.',
      ],
    },
    SAMPLE_NOTE,
  ],
  sidebar: {},
  topics: ['Manufacturing', 'Gujarat'],
  related: ['ayush-shaw-shaw-agrivolt-gas'],
};
