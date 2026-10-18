import type { CollectionConfig } from 'payload';

import { anyone, authenticated } from '../access';

/**
 * Every image and PDF on the site.
 *
 * Alt text is required and localized: it is what a screen reader says and
 * what an image search indexes, in each language.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Content' },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  upload: {
    mimeTypes: ['image/*', 'application/pdf', 'video/mp4', 'audio/mpeg'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 400 },
      { name: 'card', width: 768 },
      { name: 'hero', width: 1600 },
      { name: 'og', width: 1200, height: 630, crop: 'center' },
    ],
    adminThumbnail: 'thumbnail',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      localized: true,
      admin: { description: 'Describe the image for someone who cannot see it. Leave empty only for pure decoration.' },
    },
    { name: 'caption', type: 'text', localized: true },
  ],
};
