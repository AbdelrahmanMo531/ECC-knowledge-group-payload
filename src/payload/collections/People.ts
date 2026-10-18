import type { CollectionConfig, Field } from 'payload';

import { anyone, authenticated } from '../access';
import { image, list, text, url } from '../fields';
import { slugField } from '../fields/slug';
import { revalidates } from '../hooks/revalidate';

/** What both kinds of person share: a name, a role and a photograph. */
const personFields: Field[] = [
  text('name', { required: true }),
  slugField('name'),
  {
    type: 'row',
    fields: [
      text('position', { admin: { width: '50%' } }),
      text('credentials', { admin: { width: '50%', description: 'e.g. "PhD, FCCA"' } }),
    ],
  },
  { name: 'bio', type: 'richText', localized: true },
  image('photo'),
  url('linkedin'),
  text('team', {
    admin: {
      position: 'sidebar',
      description: 'Which tab on Our People this person sits under. Matched loosely against the tab labels.',
    },
  }),
  {
    name: 'order',
    type: 'number',
    admin: { position: 'sidebar', description: 'Where they appear, 1 first. Empty follows everyone numbered.' },
  },
];

/**
 * Faculty — the homepage's academic board, the staff directory, and the only
 * people with a profile page of their own.
 */
export const AcademicMembers: CollectionConfig = {
  slug: 'academic-members',
  labels: { singular: 'Academic member', plural: 'Academic members' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'position', 'institution', 'order'],
    group: 'People',
    preview: (doc) => `/academic-members/${doc?.slug ?? ''}/`,
  },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  hooks: revalidates('faculty'),
  fields: [
    ...personFields,
    text('institution', { admin: { description: 'Where they hold their position, e.g. "MSA University, Cairo".' } }),
    {
      name: 'specializations',
      type: 'relationship',
      relationTo: 'specializations',
      hasMany: true,
      admin: { description: 'The filters on the staff directory.' },
    },
    {
      type: 'collapsible',
      label: 'Profile',
      fields: [
        list('expertise'),
        list('teaching'),
        list('research'),
        {
          name: 'qualifications',
          type: 'array',
          fields: [text('title', { required: true }), text('institution'), url('year')],
        },
        {
          name: 'experience',
          type: 'array',
          fields: [text('role', { required: true }), text('organisation'), text('period')],
        },
      ],
    },
  ],
};

/** Everybody else on Our People — the board, managers, the student network. */
export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  labels: { singular: 'Team member', plural: 'Team members' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'position', 'team', 'order'], group: 'People' },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  hooks: revalidates('team'),
  fields: personFields,
};

export const Specializations: CollectionConfig = {
  slug: 'specializations',
  admin: { useAsTitle: 'name', group: 'People' },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  hooks: revalidates('faculty'),
  fields: [text('name', { required: true }), slugField('name')],
};
