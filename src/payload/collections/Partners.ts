import type { CollectionConfig } from 'payload';

import { anyone, authenticated } from '../access';
import { image, paragraphs, stats, text, textarea, url, valueProps } from '../fields';
import { slugField } from '../fields/slug';
import { revalidates } from '../hooks/revalidate';

export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'country', 'updatedAt'],
    group: 'Academics',
    preview: (doc) => `/partners/${doc?.slug ?? ''}/`,
  },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  hooks: revalidates('partners', 'programs'),
  defaultSort: 'order',
  fields: [
    text('name', { required: true }),
    slugField('name', { unique: true }),
    { name: 'order', type: 'number', admin: { position: 'sidebar' } },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Institution',
          fields: [
            {
              type: 'row',
              fields: [
                text('country', { admin: { width: '50%' } }),
                url('countryCode', {
                  maxLength: 2,
                  admin: { width: '25%', description: 'ISO code for the flag, e.g. CH' },
                }),
                url('accentColor', { admin: { width: '25%', description: 'e.g. #C8102E' } }),
              ],
            },
            url('website'),
            textarea('description', { admin: { description: 'The one-paragraph lead in the hero and on the card.' } }),
            { name: 'content', type: 'richText', localized: true },
            image('logo'),
            image('image', { admin: { description: 'A photograph for the partner page — not the logo.' } }),
          ],
        },
        {
          label: 'About',
          fields: [
            paragraphs('about'),
            textarea('mission'),
            valueProps('values'),
            stats('stats'),
          ],
        },
      ],
    },
    {
      name: 'programs',
      type: 'join',
      collection: 'programs',
      on: 'partner',
      admin: { description: 'Programmes linked to this partner (set on each programme).' },
    },
    {
      name: 'accreditations',
      type: 'join',
      collection: 'accreditations',
      on: 'partner',
    },
  ],
};
