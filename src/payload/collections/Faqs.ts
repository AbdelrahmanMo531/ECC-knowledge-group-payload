import type { CollectionConfig } from 'payload';

import { anyone, authenticated } from '../access';
import { text } from '../fields';
import { revalidates } from '../hooks/revalidate';

/** A question and its answer — also emitted as FAQPage structured data. */
export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  admin: { useAsTitle: 'question', defaultColumns: ['question', 'order'], group: 'Content' },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  hooks: revalidates('faqs'),
  defaultSort: 'order',
  fields: [
    text('question', { required: true }),
    { name: 'answer', type: 'richText', localized: true, required: true },
    { name: 'order', type: 'number', admin: { position: 'sidebar' } },
  ],
};
