import type { CollectionConfig } from 'payload';

import { anyone, authenticated } from '../access';
import { image, text, textarea, url } from '../fields';
import { slugField } from '../fields/slug';
import { revalidates } from '../hooks/revalidate';

/**
 * A show and its episodes. Episodes are rows rather than documents of their
 * own: they are read as a series and never linked to from anywhere but the
 * player.
 */
export const Podcasts: CollectionConfig = {
  slug: 'podcasts',
  admin: { useAsTitle: 'title', group: 'Media library' },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  hooks: revalidates('podcasts'),
  defaultSort: 'order',
  fields: [
    text('title', { required: true }),
    slugField('title'),
    text('subtitle'),
    { name: 'description', type: 'richText', localized: true },
    image('cover'),
    {
      type: 'row',
      fields: [url('channelUrl', { admin: { width: '50%' } }), text('channelLabel', { admin: { width: '50%' } })],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'layout',
          type: 'select',
          defaultValue: 'sidebar',
          options: [
            { label: 'Episode list beside the player', value: 'sidebar' },
            { label: 'Episode list beneath the player', value: 'stacked' },
          ],
          admin: { width: '50%' },
        },
        { name: 'search', type: 'checkbox', defaultValue: true, admin: { width: '25%' } },
        { name: 'autoplayNext', type: 'checkbox', defaultValue: true, admin: { width: '25%' } },
      ],
    },
    { name: 'order', type: 'number', admin: { position: 'sidebar' } },
    {
      name: 'episodes',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        text('title', { required: true }),
        {
          type: 'row',
          fields: [
            {
              name: 'source',
              type: 'select',
              required: true,
              defaultValue: 'youtube',
              options: [
                { label: 'YouTube', value: 'youtube' },
                { label: 'Video file (MP4)', value: 'video' },
                { label: 'Audio file (MP3)', value: 'audio' },
              ],
              admin: { width: '30%' },
            },
            url('url', { required: true, admin: { width: '70%' } }),
          ],
        },
        {
          type: 'row',
          fields: [
            url('thumb', { admin: { width: '50%' } }),
            { name: 'date', type: 'date', admin: { width: '25%' } },
            url('duration', { admin: { width: '25%', description: 'e.g. 42:10' } }),
          ],
        },
        textarea('description'),
      ],
    },
  ],
};
