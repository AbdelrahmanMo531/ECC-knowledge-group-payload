import type { Field } from 'payload';

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields';
import type {
  GenerateDescription,
  GenerateTitle,
  GenerateURL,
} from '@payloadcms/plugin-seo/types';

import { localePath, type Locale } from '@/lib/i18n/config';
import { siteUrl } from '@/lib/env';

import { seoExtraFields } from './fields/seo';

export const SITE_NAME = 'ECC Knowledge Group';

type Doc = Record<string, unknown> & {
  title?: string;
  name?: string;
  slug?: string;
  excerpt?: string;
  description?: string;
  language?: Locale;
  legacyPath?: string | null;
};

/** The route a document is served at, written the way English serves it. */
export function routeFor(collection: string | undefined, doc: Doc): string {
  const slug = doc?.slug ?? '';

  switch (collection) {
    case 'posts':
      return doc?.legacyPath || `/${slug}`;
    case 'pages':
      return `/${slug}`;
    case 'programs':
      return `/programs/${slug}`;
    case 'partners':
      return `/partners/${slug}`;
    case 'academic-members':
      return `/academic-members/${slug}`;
    case 'categories':
      return `/category/${slug}`;
    default:
      return '/';
  }
}

const GLOBAL_ROUTES: Record<string, string> = {
  'home-page': '/',
  'about-page': '/about-us',
  'contact-page': '/contact',
  'people-page': '/our-people',
  'staff-page': '/our-academic-staff',
  'stories-page': '/testimonials',
  'gallery-page': '/video-gallery',
  'podcast-page': '/podcast',
  'faq-page': '/faq',
  'accreditations-page': '/accreditations',
  'fees-page': '/fees-structure',
  'social-page': '/social-responsibility',
  'ceremonies-page': '/graduation-ceremonies',
};

export const generateTitle: GenerateTitle<Doc> = ({ doc }) => {
  const title = doc?.title || doc?.name;
  return title ? `${title} | ${SITE_NAME}` : SITE_NAME;
};

export const generateDescription: GenerateDescription<Doc> = ({ doc }) => {
  const source = String(doc?.excerpt || doc?.description || '').replace(/\s+/g, ' ').trim();
  return source.length > 155 ? `${source.slice(0, 152).trimEnd()}…` : source;
};

export const generateURL: GenerateURL<Doc> = ({ doc, collectionSlug, globalSlug, locale }) => {
  const route = globalSlug ? (GLOBAL_ROUTES[globalSlug] ?? '/') : routeFor(collectionSlug, doc);
  const language = (collectionSlug === 'posts' ? doc?.language : locale) as Locale | undefined;
  return `${siteUrl()}${localePath(language === 'ar' ? 'ar' : 'en', route)}`;
};

/**
 * The SEO group for a collection whose documents are each in one language —
 * articles. The plugin's fields are localized; here they are not, because an
 * Arabic article has Arabic metadata whichever locale the admin is showing.
 */
export const singleLanguageSeoGroup: Field = {
  name: 'meta',
  label: 'SEO',
  type: 'group',
  fields: [
    OverviewField({}),
    MetaTitleField({ hasGenerateFn: true, overrides: { localized: false } }),
    MetaDescriptionField({ hasGenerateFn: true, overrides: { localized: false } }),
    MetaImageField({ relationTo: 'media', hasGenerateFn: false, overrides: { localized: false } }),
    PreviewField({ hasGenerateFn: true }),
    ...seoExtraFields.map((field) => ('name' in field && field.type !== 'ui' ? ({ ...field, localized: false } as Field) : field)),
  ],
};
