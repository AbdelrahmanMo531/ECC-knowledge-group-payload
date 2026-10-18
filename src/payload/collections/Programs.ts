import type { ArrayField, CollectionConfig } from 'payload';

import { MAJOR_ICON_KEYS } from '@/lib/programs/majorIcon';

import { anyone, authenticated } from '../access';
import { image, list, text, textarea, url, valueProps } from '../fields';
import { slugField } from '../fields/slug';
import { revalidates } from '../hooks/revalidate';

const LEVELS = ['Bachelor', 'Master', 'Doctorate', 'Diploma', 'Executive'] as const;

/** A taught module — core, or specific to a major. */
const modules = (name: string, withGroup: boolean): ArrayField => ({
  name,
  type: 'array',
  admin: { initCollapsed: true },
  fields: [
    ...(withGroup
      ? [
          text('group', {
            admin: {
              description:
                'The stage it is taught in, e.g. "First Year". Leave empty on a programme taught as one list.',
            },
          }),
        ]
      : []),
    text('title', { required: true }),
    {
      type: 'row',
      fields: [
        url('credits', { admin: { width: '50%', description: 'e.g. "6" or "6 ECTS"' } }),
        url('level', { admin: { width: '50%', description: 'e.g. "MQF 7"' } }),
      ],
    },
    textarea('aims'),
    textarea('outcomes', { admin: { description: 'One learning outcome per line.' } }),
  ],
});

export const Programs: CollectionConfig = {
  slug: 'programs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'level', 'partner', 'updatedAt'],
    group: 'Academics',
    preview: (doc) => `/programs/${doc?.slug ?? ''}/`,
  },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  hooks: revalidates('programs', 'partners'),
  defaultSort: 'order',
  fields: [
    text('title', { required: true }),
    slugField('title', { unique: true }),
    {
      name: 'order',
      type: 'number',
      admin: { position: 'sidebar', description: 'Lower numbers are listed first.' },
    },
    {
      name: 'partner',
      type: 'relationship',
      relationTo: 'partners',
      admin: { position: 'sidebar', description: 'The institution awarding this programme.' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Overview',
          fields: [
            textarea('excerpt', { admin: { description: 'One or two sentences — the card and the lead.' } }),
            { name: 'content', type: 'richText', localized: true },
            image('featuredImage'),
            {
              type: 'row',
              fields: [
                {
                  name: 'level',
                  type: 'select',
                  required: true,
                  defaultValue: 'Master',
                  options: LEVELS.map((value) => ({ label: value, value })),
                  admin: { width: '33%' },
                },
                text('duration', { admin: { width: '33%', description: 'e.g. "18–24 months"' } }),
                text('studyMode', { admin: { width: '33%', description: 'e.g. "Online · Blended"' } }),
              ],
            },
            {
              type: 'row',
              fields: [
                text('awardingBody', { admin: { width: '33%' } }),
                text('credits', { admin: { width: '33%', description: 'e.g. "90 ECTS"' } }),
                text('language', { admin: { width: '33%' } }),
              ],
            },
            text('tuition', { admin: { description: 'Optional, e.g. "From $4,500". Hidden when empty.' } }),
            { name: 'brochure', type: 'upload', relationTo: 'media', filterOptions: { mimeType: { equals: 'application/pdf' } } },
          ],
        },
        {
          label: 'Selling points',
          fields: [
            list('highlights'),
            list('accreditations', { admin: { description: 'Accrediting bodies, e.g. ACBSP, IACBE.' } }),
            list('learningOutcomes', { multiline: true }),
            list('careers'),
            valueProps('whyStudy'),
          ],
        },
        {
          label: 'Curriculum',
          fields: [
            {
              name: 'structureGroups',
              type: 'array',
              admin: {
                description:
                  'Optional. The stages modules are grouped into (match the module "group" text), with a subtitle each.',
              },
              fields: [text('title', { required: true }), text('subtitle')],
            },
            modules('coreModules', true),
          ],
        },
        {
          label: 'Majors',
          fields: [
            {
              name: 'majors',
              type: 'array',
              admin: { initCollapsed: true },
              fields: [
                text('name', { required: true }),
                slugField('name', { admin: { position: undefined } }),
                {
                  name: 'icon',
                  type: 'select',
                  options: Object.entries(MAJOR_ICON_KEYS).map(([value, label]) => ({ value, label })),
                  admin: { description: 'Usually empty — the mark is read from the name.' },
                },
                { name: 'overview', type: 'richText', localized: true },
                modules('modules', false),
                { name: 'brochure', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
      ],
    },
  ],
};
