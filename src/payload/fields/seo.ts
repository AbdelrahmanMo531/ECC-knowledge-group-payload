import type { Field } from 'payload';

/**
 * The SEO fields every indexable document carries, beyond the title,
 * description and image `@payloadcms/plugin-seo` adds.
 *
 * Modelled on what the old site's Rank Math setup held, so nothing an SEO
 * specialist set there has nowhere to go: a focus keyword and its related
 * keywords (from the keyword plan), a canonical override, and robots
 * directives.
 */
export const ROBOTS_DIRECTIVES = [
  'noindex',
  'nofollow',
  'noarchive',
  'nosnippet',
  'noimageindex',
] as const;

export const seoExtraFields: Field[] = [
  {
    name: 'focusKeyword',
    type: 'text',
    localized: true,
    admin: {
      description:
        'The one search phrase this page should rank for. Use it in the meta title, the description, the first paragraph and a heading.',
    },
  },
  {
    name: 'keywordCheck',
    type: 'ui',
    admin: { components: { Field: '@/payload/components/KeywordCheck#KeywordCheck' } },
  },
  {
    name: 'relatedKeywords',
    type: 'textarea',
    localized: true,
    admin: {
      description: 'Secondary phrases, one per line. Work them into subheadings and body copy.',
    },
  },
  {
    name: 'canonicalUrl',
    type: 'text',
    admin: {
      description:
        'Leave empty — every page is canonical to itself. Only set this to consolidate a genuine duplicate onto another URL.',
    },
  },
  {
    name: 'robots',
    type: 'select',
    hasMany: true,
    options: ROBOTS_DIRECTIVES.map((value) => ({ label: value, value })),
    admin: {
      description: 'Empty means index, follow — what almost every page wants.',
    },
  },
];
