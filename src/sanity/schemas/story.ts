import { defineField, defineType } from 'sanity';

export const storyType = defineType({
  name: 'story',
  title: 'Editorial Story',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Story Headline',
      type: 'string',
      validation: (Rule) => Rule.required().min(10).max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (Canonical URL)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      description: 'Permanent URL /stories/[slug].',
    }),
    defineField({
      name: 'excerpt',
      title: 'Standfirst / Excerpt',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(250),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Agritech & Rural Enterprise', value: 'agritech' },
          { title: 'Grassroots Innovation', value: 'innovation' },
          { title: 'Manufacturing & Hardware', value: 'manufacturing' },
          { title: 'Women In Enterprise', value: 'women-in-enterprise' },
          { title: 'Social Impact', value: 'social-impact' },
          { title: 'Bootstrapped Founders', value: 'bootstrapped' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author / Contributor',
      type: 'string',
      initialValue: 'Udyam Manch Editorial Desk',
    }),
    defineField({
      name: 'readingTimeMinutes',
      title: 'Reading Time (Minutes)',
      type: 'number',
      initialValue: 6,
    }),
    defineField({
      name: 'status',
      title: 'Publication Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publication Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text (Mandatory for Accessibility)',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'caption',
          title: 'Caption / Credits',
          type: 'string',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pullQuote',
      title: 'Highlighted Pull Quote',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'body',
      title: 'Article Body',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          fields: [
            { name: 'alt', title: 'Alt text', type: 'string', validation: (Rule) => Rule.required() },
            { name: 'caption', title: 'Caption', type: 'string' },
          ],
        },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO & Social Metadata',
      type: 'object',
      fields: [
        { name: 'ogTitle', title: 'Open Graph Title', type: 'string' },
        { name: 'ogDescription', title: 'Open Graph Description', type: 'text', rows: 2 },
        { name: 'ogImage', title: 'Open Graph Image (1200x630 px)', type: 'image' },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'coverImage',
    },
  },
});
