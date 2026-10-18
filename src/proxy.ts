import { NextResponse, type NextRequest } from 'next/server';

import { DEFAULT_LOCALE, LOCALES, isArabicSegment } from '@/lib/i18n/config';

/**
 * Routes every page request to its language, and keeps the old WordPress
 * addresses exactly where they were.
 *
 * Every page lives under `app/(frontend)/[locale]`. What reaches it:
 *
 *   /fees-structure/            → rewritten to /en/fees-structure/
 *   /ar/fees-structure/         → served as is
 *   /إدارة-سلسلة-الإمداد/        → rewritten to /ar/إدارة-سلسلة-الإمداد/
 *
 * Rewrites, not redirects: the address bar keeps the URL that ranks. The
 * redirects below exist only to stop one page answering at two addresses:
 *
 *   /en/…                       → /…            (English has no prefix)
 *   /ar/<arabic slug>/          → /<arabic slug>/ (Arabic slugs live at the root)
 *   /about-us                   → /about-us/    (every permalink ends in a slash,
 *                                                as WordPress's did)
 *   /blog/2025/10/02/<slug>/    → /<slug>/      (old dated permalinks)
 */
/**
 * Fixed moves: paths the previous builds used, folded into the WordPress ones.
 * Editors add their own under SEO → Redirects in the CMS; those are applied by
 * the page routes, which can read the database.
 */
const MOVED: [RegExp, (match: RegExpMatchArray) => string][] = [
  [/^\/videos\/?$/, () => '/video-gallery/'],
  [/^\/home\/?$/, () => '/'],
  [/^\/about\/?$/, () => '/about-us/'],
  [/^\/faculty\/([^/]+)\/?$/, (m) => `/academic-members/${m[1]}/`],
  [/^\/(ar\/)?insights\/?$/, (m) => `/${m[1] ?? ''}blog/`],
  [/^\/(?:ar\/)?insights\/([^/]+)\/?$/, (m) => `/${m[1]}/`],
  [/^\/(ar\/)?(?:feed|author\/[^/]+)\/?$/, (m) => `/${m[1] ?? ''}blog/`],
  // WordPress's dated permalinks, which some articles were published under.
  [/^\/(?:ar\/)?blog\/\d{4}\/\d{2}\/(?:\d{2}\/)?([^/]+)\/?$/, (m) => `/${m[1]}/`],
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split('/');
  const [, first, second] = segments;

  // A plain URL, not `nextUrl.clone()`: NextURL re-applies Next's own
  // trailing-slash setting and would strip the slash this is adding.
  const redirectTo = (path: string) => {
    const url = new URL(request.url);
    url.pathname = path;
    return NextResponse.redirect(url, 308);
  };

  for (const [pattern, target] of MOVED) {
    const match = pathname.match(pattern);
    if (match) return redirectTo(target(match));
  }

  // The default language has no prefix.
  if (first === DEFAULT_LOCALE) {
    return redirectTo(`${pathname.slice(DEFAULT_LOCALE.length + 1) || '/'}`.replace(/([^/])$/, '$1/'));
  }

  // An Arabic-script address belongs at the root, where it was published.
  if (first === 'ar' && isArabicSegment(second)) {
    return redirectTo(`/${segments.slice(2).join('/')}`.replace(/([^/])$/, '$1/'));
  }

  // One address per page: the one with the slash.
  if (!pathname.endsWith('/')) return redirectTo(`${pathname}/`);

  if (LOCALES.includes(first as (typeof LOCALES)[number])) return NextResponse.next();

  const url = new URL(request.url);
  url.pathname = `/${isArabicSegment(first) ? 'ar' : DEFAULT_LOCALE}${pathname}`;

  return NextResponse.rewrite(url);
}

export const config = {
  /**
   * Everything except what is not a page: Payload's admin and API, the
   * framework's own files, the public asset folders, and any path with a file
   * extension (the sitemap, robots.txt, images). Whole segments only — an
   * article called `/branding-tips/` is still a page.
   */
  matcher: ['/((?!(?:admin|api|_next|brand|flags|fonts)(?:/|$)|.*\\.[a-zA-Z0-9]{2,5}$).*)'],
};
