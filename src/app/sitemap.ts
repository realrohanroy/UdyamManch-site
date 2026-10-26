import { MetadataRoute } from 'next';
import { getFounders, getStories } from '@/lib/content';
import { SITE_URL } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;
  const [founders, stories] = await Promise.all([getFounders(), getStories()]);

  // Sample pages are noindex, so keep them out of the sitemap too.
  const founderUrls = founders.filter((f) => !f.sample).map((founder) => ({
    url: `${baseUrl}/founders/${founder.slug}`,
    lastModified: new Date(founder.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const storyUrls = stories.filter((s) => !s.sample).map((story) => ({
    url: `${baseUrl}/stories/${story.slug}`,
    lastModified: new Date(story.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/founders`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/stories`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...founderUrls,
    ...storyUrls,
  ];
}
