import type { CollectionConfig } from 'payload';

import { authenticated, publishedOrAuthenticated } from '../access';
import { image, text } from '../fields';
import { slugField } from '../fields/slug';
import { uniqueRootSlug } from '../fields/permalink';
import { revalidates } from '../hooks/revalidate';

/**
 * Pages an editor publishes at any address the app does not define itself —
 * a privacy policy, a programme landing page. Publish and it is live.
 *
 * The thirteen app-built pages (home, about, fees…) are Globals instead: their
 * layout is fixed, so their fields are too.
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    group: 'Content',
    preview: (doc) => `/${doc?.slug ?? ''}/`,
  },
  access: { read: publishedOrAuthenticated, create: authenticated, update: authenticated, delete: authenticated },
  versions: { drafts: true, maxPerDoc: 25 },
  hooks: {
    ...revalidates('pages'),
    beforeValidate: [uniqueRootSlug('pages')],
  },
  fields: [
    text('title', { required: true }),
    slugField('title', { localized: true, required: true }),
    { name: 'content', type: 'richText', localized: true },
    image('featuredImage'),
  ],
};
