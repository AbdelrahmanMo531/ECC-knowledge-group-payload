import type { FieldHook, TextField } from 'payload';

/**
 * A URL slug that keeps Arabic as Arabic.
 *
 * The usual slug formatter strips everything outside `[a-z0-9-]`, which turns
 * `إدارة-سلسلة-الإمداد` into an empty string — and the Arabic articles are
 * exactly the URLs this site most needs to keep. Letters and digits in any
 * script survive; whitespace and punctuation become single hyphens.
 */
export function slugify(value: string): string {
  return value
    .normalize('NFC')
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\p{L}\p{M}\p{N}-]+/gu, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Decodes a slug pasted from a browser's address bar (`%d8%a5…`). */
function decoded(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

const formatSlug =
  (from: string): FieldHook =>
  ({ value, data, originalDoc }) => {
    if (typeof value === 'string' && value.trim()) return slugify(decoded(value));

    const source = data?.[from] ?? originalDoc?.[from];
    return typeof source === 'string' ? slugify(source) : value;
  };

/**
 * The slug field. Filled from `from` when left empty, editable afterwards.
 *
 * Changing the slug of a published page moves its URL: add a redirect from the
 * old address under Redirects, or the ranking it earned is lost.
 */
export function slugField(
  from = 'title',
  extra: Partial<TextField> & { localized?: boolean } = {},
): TextField {
  return {
    name: 'slug',
    type: 'text',
    index: true,
    required: false,
    hooks: { beforeValidate: [formatSlug(from)] },
    admin: {
      position: 'sidebar',
      description:
        'The last part of the URL. Arabic is kept as Arabic. Changing it on a published page moves the page — add a redirect from the old URL.',
    },
    ...extra,
  } as TextField;
}
