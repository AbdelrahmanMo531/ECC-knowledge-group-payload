import type { CollectionConfig } from 'payload';

import { anyone, authenticated } from '../access';
import { image, text, textarea, url } from '../fields';
import { slugField } from '../fields/slug';
import { revalidates } from '../hooks/revalidate';

/** A film in the video gallery. */
export const Videos: CollectionConfig = {
  slug: 'videos',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'categories', 'updatedAt'], group: 'Media library' },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  hooks: revalidates('videos'),
  defaultSort: '-createdAt',
  fields: [
    text('title', { required: true }),
    slugField('title', { admin: { position: 'sidebar', description: 'Used in the share link.' } }),
    url('video', { required: true, admin: { description: 'YouTube, a YouTube Short, or Vimeo.' } }),
    text('credit', { admin: { description: 'The small line under the title — a name, a place, a date.' } }),
    textarea('description'),
    image('poster', { admin: { description: 'Optional. YouTube supplies its own still.' } }),
    { name: 'categories', type: 'relationship', relationTo: 'video-categories', hasMany: true },
  ],
};

export const VideoCategories: CollectionConfig = {
  slug: 'video-categories',
  labels: { singular: 'Video category', plural: 'Video categories' },
  admin: { useAsTitle: 'name', group: 'Media library' },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  hooks: revalidates('videos'),
  fields: [text('name', { required: true }), slugField('name')],
};
