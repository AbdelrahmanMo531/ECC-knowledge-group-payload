import type { CollectionConfig } from 'payload';

import { authenticated, publishedOrAuthenticated, anyone } from '../access';
import { slugField } from '../fields/slug';
import { uniqueRootSlug } from '../fields/permalink';
import { revalidates } from '../hooks/revalidate';
import { singleLanguageSeoGroup } from '../seo';

/**
 * Articles — the blog, and most of the organic traffic.
 *
 * Each article is written in one language and is its own document, as it was
 * in WordPress: the Arabic and English blogs target different keywords and are
 * not translations of each other. Where one is, link it under Translations and
 * the two pages name each other in `hreflang`.
 *
 * Served at the root, `/<slug>/`, which is where WordPress's `/%postname%/`
 * permalinks put them and where their rankings are. An article that lived
 * somewhere else — `/blogs/<slug>` — keeps that address in Legacy path.
 */
export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Article', plural: 'Articles' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'language', 'focusKeywordColumn', '_status', 'publishedAt'],
    listSearchableFields: ['title', 'slug', 'legacyPath'],
    group: 'Content',
    preview: (doc) => (doc?.legacyPath ? `${doc.legacyPath}/` : `/${doc?.slug ?? ''}/`),
  },
  access: { read: publishedOrAuthenticated, create: authenticated, update: authenticated, delete: authenticated },
  versions: { drafts: { schedulePublish: true }, maxPerDoc: 25 },
  hooks: {
    ...revalidates('posts'),
    beforeValidate: [uniqueRootSlug('posts')],
  },
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'language',
      type: 'select',
      required: true,
      defaultValue: 'ar',
      index: true,
      options: [
        { label: 'العربية', value: 'ar' },
        { label: 'English', value: 'en' },
      ],
      admin: { position: 'sidebar' },
    },
    slugField('title', { required: true, unique: true }),
    {
      name: 'legacyPath',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description:
          'Only for an article whose URL was not /<slug>/ on the old site, e.g. /blogs/mba-in-healthcare-management. It is then served there.',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      index: true,
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
      hooks: {
        beforeChange: [({ value, siblingData }) => value ?? (siblingData?._status === 'published' ? new Date() : value)],
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'excerpt', type: 'textarea', admin: { description: 'The summary on cards, and the fallback meta description.' } },
            { name: 'content', type: 'richText' },
            { name: 'featuredImage', type: 'upload', relationTo: 'media' },
          ],
        },
        { label: 'SEO', fields: [singleLanguageSeoGroup] },
      ],
    },
    { name: 'categories', type: 'relationship', relationTo: 'categories', hasMany: true, admin: { position: 'sidebar' } },
    { name: 'authorName', type: 'text', admin: { position: 'sidebar' } },
    {
      name: 'translations',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      admin: { position: 'sidebar', description: 'The same article in the other language, if there is one.' },
    },
    {
      // Surfaced in the list view so an SEO lead can see coverage at a glance.
      name: 'focusKeywordColumn',
      label: 'Focus keyword',
      type: 'text',
      virtual: true,
      admin: { hidden: true },
      hooks: { afterRead: [({ data }) => data?.meta?.focusKeyword ?? ''] },
    },
  ],
};

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Category', plural: 'Categories' },
  admin: { useAsTitle: 'name', group: 'Content' },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  hooks: revalidates('posts'),
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    slugField('name', { unique: true }),
    { name: 'description', type: 'textarea', localized: true },
  ],
};
