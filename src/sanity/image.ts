import createImageUrlBuilder from '@sanity/image-url';
import type { Image } from 'sanity';
import { projectId, dataset } from './client';

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || 'udyammanch',
  dataset: dataset || 'production',
});

export const urlForImage = (source: Image | string | any) => {
  if (!source) return null;
  if (typeof source === 'string') return source;
  try {
    return imageBuilder.image(source).auto('format').fit('max').url();
  } catch (err) {
    return null;
  }
};
