import {
  convertLexicalToHTML,
  defaultHTMLConverters,
  LinkHTMLConverter,
  type HTMLConvertersFunction,
} from '@payloadcms/richtext-lexical/html';
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';

import { localePath, type Locale } from '@/lib/i18n/config';
import { siteUrl } from '@/lib/env';

import type { MediaItem, SeoFields } from './types';

export { fill } from './fill';

/**
 * Turning Payload documents into the front-end's shapes, generically.
 *
 * The collections and globals are modelled on `types.ts` field for field, so
 * most of a document needs no mapping at all — only three things differ in
 * kind, and this handles them wherever they appear:
 *
 *   - an upload is a Media document; the components want a `MediaItem`
 *   - rich text is Lexical JSON; the components render HTML
 *   - a list of strings is stored as `{ value }` rows
 */

type Json = Record<string, unknown>;

const isObject = (value: unknown): value is Json =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** A Media document, after population. */
function isMedia(value: Json): boolean {
  return typeof value.url === 'string' && ('mimeType' in value || 'filename' in value);
}

function isRichText(value: Json): value is Json & SerializedEditorState {
  return isObject(value.root) && (value.root as Json).type === 'root';
}

/** A row of a `list()` field: its only data is `value`. */
function isValueRow(value: unknown): value is { value: string } {
  if (!isObject(value) || !('value' in value)) return false;

  return Object.keys(value).every((key) => key === 'value' || key === 'id');
}

export function toMedia(value: unknown): MediaItem | null {
  if (!isObject(value) || !isMedia(value)) return null;

  return {
    sourceUrl: String(value.url),
    altText: String(value.alt ?? ''),
    mediaDetails:
      typeof value.width === 'number' && typeof value.height === 'number'
        ? { width: value.width, height: value.height }
        : null,
  };
}

/** Where a document linked from rich text lives. */
function internalHref(collection: string, doc: unknown): string {
  if (!isObject(doc)) return '#';

  const slug = String(doc.slug ?? '');
  const language = doc.language === 'ar' ? 'ar' : 'en';

  switch (collection) {
    case 'posts':
      return localePath(language as Locale, String(doc.legacyPath || `/${slug}`));
    case 'pages':
      return localePath('en', `/${slug}`);
    case 'programs':
      return localePath('en', `/programs/${slug}`);
    case 'partners':
      return localePath('en', `/partners/${slug}`);
    default:
      return '#';
  }
}

const converters: HTMLConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkHTMLConverter({
    internalDocToHref: ({ linkNode }) => {
      const doc = linkNode.fields.doc as { relationTo?: string; value?: unknown } | undefined;
      return doc?.relationTo ? internalHref(doc.relationTo, doc.value) : '#';
    },
  }),
});

/** Rich text to HTML. Empty editor state becomes an empty string. */
export function toHTML(value: unknown): string {
  if (!isObject(value) || !isRichText(value)) return typeof value === 'string' ? value : '';

  try {
    return convertLexicalToHTML({
      data: value as unknown as SerializedEditorState,
      converters: converters ?? defaultHTMLConverters,
      disableContainer: true,
    });
  } catch (error) {
    console.error('[cms] Rich text could not be rendered', error);
    return '';
  }
}

/**
 * A document, recursively, in the front-end's shapes. Payload bookkeeping —
 * ids on rows, timestamps, block types — is dropped from nested objects.
 */
export function normalise<T = unknown>(value: unknown): T {
  if (Array.isArray(value)) {
    if (value.length && value.every(isValueRow)) {
      return value.map((row) => String(row.value ?? '').trim()).filter(Boolean) as T;
    }

    return value.map((entry) => normalise(entry)) as T;
  }

  if (!isObject(value)) return value as T;
  if (isMedia(value)) return toMedia(value) as T;
  if (isRichText(value)) return toHTML(value) as T;

  const out: Json = {};
  for (const [key, entry] of Object.entries(value)) {
    if (key === 'id' || key === 'blockType' || key === 'updatedAt' || key === 'createdAt' || key === 'globalType') {
      continue;
    }
    out[key] = normalise(entry);
  }

  return out as T;
}

/** Absolute, for Open Graph — a relative image URL is ignored by every crawler. */
export function absolute(url: string | null | undefined): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;

  return `${siteUrl()}${url.startsWith('/') ? '' : '/'}${url}`;
}

/** The SEO tab of a document, in the shape `buildMetadata` reads. */
export function toSeo(meta: unknown, fallbackImage?: MediaItem | null): SeoFields | null {
  if (!isObject(meta)) {
    return fallbackImage ? { image: absolute(fallbackImage.sourceUrl) } : null;
  }

  const image = toMedia(meta.image) ?? fallbackImage ?? null;
  const related = String(meta.relatedKeywords ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  const focus = String(meta.focusKeyword ?? '').trim() || null;

  return {
    title: String(meta.title ?? '').trim() || null,
    description: String(meta.description ?? '').trim() || null,
    canonicalUrl: String(meta.canonicalUrl ?? '').trim() || null,
    robots: Array.isArray(meta.robots) && meta.robots.length ? (meta.robots as string[]) : null,
    image: absolute(image?.sourceUrl),
    focusKeyword: focus,
    keywords: focus || related.length ? [...(focus ? [focus] : []), ...related] : null,
    openGraph: null,
  };
}

/** Splits a newline-separated textarea into lines. */
export function lines(value: unknown): string[] {
  return String(value ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}
