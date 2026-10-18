import type { CollectionBeforeValidateHook, Payload } from 'payload';
import { ValidationError } from 'payload';

/**
 * First path segments that belong to a route the app defines. A post or page
 * at one of these would be unreachable, so it is refused when saved rather
 * than discovered as a 404 later.
 */
export const RESERVED_SEGMENTS = new Set([
  'about',
  'about-us',
  'academic-members',
  'accreditations',
  'admin',
  'api',
  'ar',
  'blog',
  'category',
  'contact',
  'en',
  'faq',
  'fees-structure',
  'graduation-ceremonies',
  'home',
  'insights',
  'next',
  'our-academic-staff',
  'our-people',
  'partners',
  'podcast',
  'programs',
  'social-responsibility',
  'testimonials',
  'video-gallery',
]);

/** A legacy path as stored: leading slash, no trailing slash, decoded. */
export function normalisePath(value: string): string {
  let path = value.trim();
  try {
    path = decodeURIComponent(path);
  } catch {
    // Leave a stray `%` alone.
  }
  path = path.replace(/^https?:\/\/[^/]+/i, '').replace(/[?#].*$/, '');
  path = `/${path.replace(/^\/+|\/+$/g, '')}`;
  // A dated permalink (`/blog/2025/10/02/<slug>`) is redirected to `/<slug>/`
  // by the proxy, so it can never be where an article lives.
  if (path === '/' || /^\/(?:ar\/)?blog\/\d{4}\//.test(path)) return '';
  return path;
}

async function taken(payload: Payload, collection: 'posts' | 'pages', slug: string, id?: string | number) {
  const result = await payload.find({
    collection,
    where: { and: [{ slug: { equals: slug } }, ...(id ? [{ id: { not_equals: id } }] : [])] },
    limit: 1,
    depth: 0,
    draft: true,
    pagination: false,
  });
  return result.docs.length > 0;
}

/**
 * Posts and pages share one URL space — both are served from the root, as
 * WordPress served them — so a slug must be free in both, and must not shadow
 * a route the app owns.
 */
export const uniqueRootSlug =
  (collection: 'posts' | 'pages'): CollectionBeforeValidateHook =>
  async ({ data, originalDoc, req }) => {
    const slug = typeof data?.slug === 'string' ? data.slug : undefined;
    if (!slug) return data;

    if (RESERVED_SEGMENTS.has(slug)) {
      throw new ValidationError({
        collection,
        errors: [{ path: 'slug', message: `"/${slug}/" is a route the site already uses. Pick another slug.` }],
      });
    }

    const other = collection === 'posts' ? 'pages' : 'posts';
    const id = originalDoc?.id;

    if ((await taken(req.payload, collection, slug, id)) || (await taken(req.payload, other, slug))) {
      throw new ValidationError({
        collection,
        errors: [{ path: 'slug', message: `Another post or page already lives at "/${slug}/".` }],
      });
    }

    if (typeof data?.legacyPath === 'string') {
      data.legacyPath = normalisePath(data.legacyPath) || null;
    }

    return data;
  };
