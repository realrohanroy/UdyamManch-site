/**
 * Founder Journey document for Sanity Studio (/admin).  [REQ-ADM-03] [REQ-ADM-04] [REQ-TMP-02]
 *
 * Mirrors src/lib/journey/types.ts field for field. The body is an ordered list
 * of the same block types the site renders, so what an editor builds in the
 * Studio is exactly what the page shows. Validation here matches
 * lib/journey/validate.ts, so local content and CMS content follow one set of rules.
 */
import { defineArrayMember, defineField, defineType, type StringRule } from 'sanity';
import { ICON_NAMES, STATE_CODES, TONES } from '../../lib/journey/types';
import { STATE_NAMES } from '../../lib/journey/states';

const noEmDash = (v: string | undefined) => (v && /\u2014/.test(v) ? 'Avoid em dashes. Use a comma, colon or full stop.' : true);
const text = (name: string, title: string, opts: { required?: boolean; rows?: number; max?: number; description?: string } = {}) =>
  defineField({
    name,
    title,
    type: opts.rows ? 'text' : 'string',
    ...(opts.rows ? { rows: opts.rows } : {}),
    description: opts.description,
    validation: (r: StringRule) => {
      let rule = r.custom(noEmDash);
      if (opts.required) rule = rule.required();
      if (opts.max) rule = rule.max(opts.max).warning(`Keep it under ${opts.max} characters`);
      return rule;
    },
  });

const iconField = defineField({
  name: 'icon',
  title: 'Icon',
  type: 'string',
  options: { list: [...ICON_NAMES] },
  validation: (r) => r.required(),
});
const toneField = defineField({
  name: 'tone',
  title: 'Colour',
  type: 'string',
  options: { list: [...TONES], layout: 'radio', direction: 'horizontal' },
  initialValue: 'green',
  validation: (r) => r.required(),
});

/** Image with mandatory alt text (WCAG 2.2 AA, PRD 5.3). */
const imageWithAlt = (name: string, title: string, required = true) =>
  defineField({
    name,
    title,
    type: 'image',
    options: { hotspot: true },
    fields: [
      defineField({
        name: 'alt',
        title: 'Alt text',
        type: 'string',
        description: 'Describe the photo for people who cannot see it.',
        validation: (r) => (required ? r.required().error('Alt text is required before publishing') : r),
      }),
      defineField({ name: 'caption', title: 'Caption', type: 'string' }),
      defineField({ name: 'credit', title: 'Photo credit', type: 'string' }),
    ],
    validation: (r) => (required ? r.required() : r),
  });

const INLINE_HELP = 'Formatting: **bold**, *italic*, ==highlight==';

export const founderJourneyType = defineType({
  name: 'founderJourney',
  title: 'Founder journey',
  type: 'document',
  groups: [
    { name: 'story', title: 'Story', default: true },
    { name: 'company', title: 'Company' },
    { name: 'sidebar', title: 'Sidebar' },
    { name: 'publish', title: 'Publishing and SEO' },
  ],
  fields: [
    // ---- Story --------------------------------------------------------------
    defineField({
      name: 'founder',
      title: 'Founder',
      type: 'object',
      group: 'story',
      fields: [
        text('name', 'Founder name', { required: true }),
        text('shortName', 'Short name (breadcrumb)'),
        text('location', 'Location'),
      ],
    }),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      group: 'story',
      fields: [
        text('kicker', 'Label above the headline', { description: 'Defaults to "Founder story"' }),
        text('title', 'Headline', { required: true, max: 90, description: `${INLINE_HELP}. Line break: \\n` }),
        text('dek', 'Summary', { required: true, rows: 3, description: 'One or two sentences. Used on cards and share previews.' }),
        imageWithAlt('image', 'Portrait'),
        defineField({
          name: 'stage',
          title: 'Portrait decorations (optional)',
          type: 'object',
          options: { collapsible: true, collapsed: true },
          fields: [
            text('scriptName', 'Handwritten name'),
            text('role', 'Role under the name'),
            text('quote', 'Small quote card'),
            text('signatureLine1', 'Signature line 1'),
            text('signatureLine2', 'Signature line 2'),
          ],
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Story body',
      type: 'array',
      group: 'story',
      description: 'Add blocks in reading order.',
      validation: (r) => r.required().min(1),
      of: [
        defineArrayMember({
          name: 'section',
          title: 'Text section',
          type: 'object',
          fields: [
            text('heading', 'Sub heading', { description: 'Sentence case' }),
            defineField({
              name: 'paragraphs',
              title: 'Paragraphs',
              type: 'array',
              of: [{ type: 'text', rows: 4 }],
              description: INLINE_HELP,
              validation: (r) => r.required().min(1),
            }),
          ],
          preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title: title || 'Text', subtitle: 'Section' }) },
        }),
        defineArrayMember({
          name: 'quote',
          title: 'Pull quote',
          type: 'object',
          fields: [text('text', 'Quote', { required: true, rows: 3 }), text('cite', 'Said by')],
          preview: { select: { title: 'text' }, prepare: ({ title }) => ({ title, subtitle: 'Pull quote' }) },
        }),
        defineArrayMember({
          name: 'figure',
          title: 'Image',
          type: 'object',
          fields: [imageWithAlt('image', 'Image')],
          preview: { select: { media: 'image', title: 'image.caption' }, prepare: ({ media, title }) => ({ media, title: title || 'Image' }) },
        }),
        defineArrayMember({
          name: 'steps',
          title: 'Steps or timeline',
          type: 'object',
          fields: [
            text('label', 'What the steps show', { required: true, description: 'Read out by screen readers, e.g. "How CBG is produced"' }),
            defineField({
              name: 'steps',
              title: 'Steps',
              type: 'array',
              validation: (r) => r.min(2).max(5),
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'step',
                  fields: [text('title', 'Title', { required: true }), text('text', 'Short text', { required: true }), iconField, toneField],
                }),
              ],
            }),
          ],
          preview: { select: { title: 'label' }, prepare: ({ title }) => ({ title, subtitle: 'Steps' }) },
        }),
        defineArrayMember({
          name: 'pillars',
          title: 'Impact pillars',
          type: 'object',
          fields: [
            text('label', 'What the pillars show', { required: true }),
            defineField({
              name: 'items',
              title: 'Pillars',
              type: 'array',
              validation: (r) => r.min(2).max(6),
              of: [defineArrayMember({ type: 'object', name: 'pillar', fields: [text('label', 'Label', { required: true }), iconField, toneField] })],
            }),
          ],
          preview: { select: { title: 'label' }, prepare: ({ title }) => ({ title, subtitle: 'Pillars' }) },
        }),
        defineArrayMember({
          name: 'regions',
          title: 'Regions map',
          type: 'object',
          fields: [
            text('label', 'What the list shows', { required: true }),
            imageWithAlt('map', 'Map image', false),
            defineField({ name: 'regions', title: 'Regions', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } }),
          ],
          preview: { select: { title: 'label' }, prepare: ({ title }) => ({ title, subtitle: 'Regions' }) },
        }),
        defineArrayMember({
          name: 'note',
          title: 'Note box',
          type: 'object',
          fields: [text('text', 'Note', { required: true, rows: 2 })],
          preview: { select: { title: 'text' }, prepare: ({ title }) => ({ title, subtitle: 'Note' }) },
        }),
      ],
    }),

    // ---- Company ------------------------------------------------------------
    defineField({
      name: 'company',
      title: 'Company',
      type: 'object',
      group: 'company',
      fields: [
        text('name', 'Company name', { required: true }),
        text('summary', 'One line summary', { required: true, rows: 2 }),
        defineField({ name: 'website', title: 'Website', type: 'url' }),
        imageWithAlt('logo', 'Logo', false),
        defineField({ ...iconField, description: 'Shown when there is no logo', validation: undefined }),
        text('industry', 'Industry'),
        text('city', 'City'),
        text('founded', 'Year founded'),
      ],
    }),

    // ---- Sidebar ------------------------------------------------------------
    defineField({
      name: 'sidebar',
      title: 'Sidebar',
      type: 'object',
      group: 'sidebar',
      description: 'Use stats when you have verified numbers. Use features when you do not.',
      fields: [
        defineField({
          name: 'stats',
          title: 'Key numbers',
          type: 'array',
          validation: (r) => r.max(6),
          of: [defineArrayMember({ type: 'object', name: 'stat', fields: [text('value', 'Number', { required: true }), text('label', 'Label', { required: true })] })],
        }),
        defineField({
          name: 'features',
          title: 'What the company does',
          type: 'array',
          validation: (r) => r.max(4),
          of: [defineArrayMember({ type: 'object', name: 'feature', fields: [text('label', 'Label', { required: true }), text('text', 'Short text', { required: true }), iconField, toneField] })],
        }),
        defineField({ name: 'quote', title: 'Sidebar quote', type: 'object', fields: [text('text', 'Quote', { rows: 3 }), text('cite', 'Said by')] }),
      ],
    }),
    defineField({ name: 'topics', title: 'Topics', type: 'array', group: 'sidebar', of: [{ type: 'string' }], options: { layout: 'tags' } }),
    defineField({ name: 'related', title: 'Related journeys', type: 'array', group: 'sidebar', of: [{ type: 'reference', to: [{ type: 'founderJourney' }] }], validation: (r) => r.max(3) }),
    defineField({
      name: 'listing',
      title: 'Founders page listing',
      description: 'Leave empty to keep this journey off the Founders page and map.',
      type: 'object',
      group: 'sidebar',
      fields: [
        defineField({
          name: 'state', title: 'State or union territory', type: 'string',
          options: { list: STATE_CODES.map((c) => ({ value: c, title: STATE_NAMES[c] })) },
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'metric', title: 'Headline number', type: 'object',
          description: 'One number for the card, for example 10,000 and "farmers trained".',
          fields: [
            defineField({ name: 'value', type: 'string', validation: (r) => r.required().max(12) }),
            defineField({ name: 'label', type: 'string', validation: (r) => r.required().max(40) }),
            defineField({ name: 'verified', title: 'Verified by our team', type: 'boolean', initialValue: false }),
          ],
        }),
        defineField({
          name: 'placement', title: 'Placement', type: 'string',
          options: { list: [
            { value: 'editors-pick', title: "Editor's pick (free)" },
            { value: 'sponsored', title: 'Sponsored (paid, always labelled)' },
          ] },
        }),
        defineField({
          name: 'placementUntil', title: 'Placement ends', type: 'datetime',
          hidden: ({ parent }) => !parent?.placement,
          validation: (r) => r.custom((v, ctx) => ((ctx.parent as { placement?: string })?.placement === 'sponsored' && !v ? 'Sponsored slots need an end date' : true)),
        }),
      ],
    }),

    // ---- Publishing ---------------------------------------------------------
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      group: 'publish',
      options: { source: 'founder.name', maxLength: 96 },
      description: 'Becomes /founders/<slug>. After publishing, changing it needs a redirect.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'publish',
      options: { list: ['draft', 'published', 'scheduled'], layout: 'radio' },
      initialValue: 'draft',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'publishedAt', title: 'Publish date', type: 'datetime', group: 'publish', initialValue: () => new Date().toISOString(), validation: (r) => r.required() }),
    defineField({ name: 'author', title: 'Author', type: 'string', group: 'publish', initialValue: 'Udyam Manch Team', validation: (r) => r.required() }),
    defineField({ name: 'sample', title: 'Sample content', type: 'boolean', group: 'publish', initialValue: false, description: 'Shows a Sample label and hides the page from search engines.' }),
    defineField({
      name: 'seo',
      title: 'Share preview',
      type: 'object',
      group: 'publish',
      description: 'WhatsApp and LinkedIn cache previews for days. Check these before sharing widely.',
      fields: [
        text('title', 'Share title', { max: 70 }),
        text('description', 'Share description', { rows: 2, max: 160 }),
        defineField({ name: 'image', title: 'Share image (1200 x 630)', type: 'image', options: { hotspot: true } }),
      ],
    }),
  ],
  orderings: [{ title: 'Newest first', name: 'newest', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  preview: {
    select: { title: 'founder.name', subtitle: 'company.name', media: 'hero.image', status: 'status' },
    prepare: ({ title, subtitle, media, status }) => ({ title, subtitle: `${subtitle ?? ''} · ${status ?? 'draft'}`, media }),
  },
});
