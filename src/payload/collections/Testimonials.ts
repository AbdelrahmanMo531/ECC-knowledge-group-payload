import type { CollectionConfig } from 'payload';

import { anyone, authenticated } from '../access';
import { image, text, textarea, url } from '../fields';
import { revalidates } from '../hooks/revalidate';

/**
 * A graduate's words. With a video link it is a film on /testimonials; without
 * one it stays a written quote in the carousels.
 */
export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: { useAsTitle: 'authorName', defaultColumns: ['authorName', 'program', 'country', 'video'], group: 'Content' },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  hooks: revalidates('testimonials'),
  defaultSort: '-createdAt',
  fields: [
    text('authorName', { required: true }),
    text('authorRole'),
    textarea('quote'),
    {
      type: 'row',
      fields: [text('program', { admin: { width: '50%' } }), text('country', { admin: { width: '50%' } })],
    },
    image('avatar'),
    {
      type: 'collapsible',
      label: 'Film',
      fields: [
        url('video', { admin: { description: 'A YouTube or Vimeo link. Filled in, this becomes a film on /testimonials.' } }),
        text('videoTitle'),
        image('poster'),
      ],
    },
  ],
};
