/**
 * The languages the site runs in.
 *
 * English is the default and lives at the root — `/fees-structure`, not
 * `/en/fees-structure` — so no URL that already exists moves. Arabic is
 * prefixed with `/ar`, except where the address itself is written in Arabic
 * script: those keep the root they were published at on the old WordPress
 * site (see `isArabicSegment`).
 */

export const LOCALES = ['en', 'ar'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/** Everything that differs between languages other than the words. */
export const LOCALE_META: Record<
  Locale,
  {
    /** What the switcher calls it, in that language. */
    label: string;
    /** For `<html lang>` and hreflang. */
    tag: string;
    dir: 'ltr' | 'rtl';
    /** `og:locale`, which wants a region as well as a language. */
    og: string;
    /**
     * The flag shown beside the name in the switcher.
     *
     * A flag is a country and a language is not — Arabic is spoken in
     * twenty-odd of them — so it is decorative here and the name beside it
     * carries the meaning. These are the two the site is written for: an
     * international English, and the Arabic of the Emirates ECC works in.
     */
    flag: string;
  }
> = {
  en: { label: 'English', tag: 'en', dir: 'ltr', og: 'en_AE', flag: 'gb' },
  ar: { label: 'العربية', tag: 'ar', dir: 'rtl', og: 'ar_AE', flag: 'ae' },
};

/** Whether a string is one of the languages this site runs in. */
export function isLocale(value: string | undefined | null): value is Locale {
  return LOCALES.includes(value as Locale);
}

/**
 * Whether a path segment is written in Arabic script.
 *
 * The WordPress site this replaces served its Arabic articles at the root —
 * `/إدارة-سلسلة-الإمداد/`, not `/ar/إدارة-سلسلة-الإمداد/` — and those are the
 * addresses that rank. A segment in Arabic script can only be Arabic content,
 * so it is the one signal that needs no lookup: the middleware routes it to
 * the Arabic tree, and every link, canonical and sitemap entry keeps it
 * unprefixed.
 */
export function isArabicSegment(segment: string | undefined | null): boolean {
  if (!segment) return false;

  let decoded = segment;
  try {
    decoded = decodeURIComponent(segment);
  } catch {
    // A stray `%` is not an escape; read the segment as it is.
  }

  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(decoded);
}

/** Whether the last segment of a path names a file rather than a page. */
function isFilePath(path: string): boolean {
  return /\.[a-z0-9]{2,5}$/i.test(path.slice(path.lastIndexOf('/') + 1));
}

/**
 * The path a route is served at, in a given language.
 *
 * The one place the prefix rule lives, so a link, a canonical, an hreflang and
 * a sitemap entry can never disagree about where a page is.
 *
 * Page addresses end in a slash, as every WordPress permalink did. Serving the
 * same page with and without one would be two URLs for one page; the
 * middleware redirects the slash-less form, and this makes sure the site never
 * links to it in the first place.
 */
export function localePath(locale: Locale, path: string): string {
  const clean = path === '/' ? '' : path.replace(/\/+$/, '');
  const slash = clean && !isFilePath(clean) ? '/' : '';

  if (locale === DEFAULT_LOCALE) return clean ? `${clean}${slash}` : '/';

  // Arabic-script addresses keep the root they ranked at.
  const [, first] = clean.split('/');
  if (locale === 'ar' && isArabicSegment(first)) return `${clean}${slash}`;

  return clean ? `/${locale}${clean}${slash}` : `/${locale}/`;
}

/**
 * The language a path is in, and the path with its prefix removed.
 *
 * Used by the middleware to route, and by the switcher to keep a visitor on
 * the page they are reading rather than sending them to the homepage.
 */
export function splitLocale(pathname: string): {
  locale: Locale;
  path: string;
} {
  const [, first, ...rest] = pathname.split('/');

  // `/en/…` never reaches a visitor — the middleware sends it back to the
  // unprefixed form — but it is what a route under `app/[locale]` is called
  // internally, and it is what `usePathname` reports while a page is being
  // prerendered. Reading it as the default language rather than as a page
  // named "en" is what stops a link built at build time from coming out as
  // `/ar/en/fees-structure`.
  if (isLocale(first)) {
    return {
      locale: first,
      path: `/${rest.join('/')}`.replace(/\/$/, '') || '/',
    };
  }

  const path = (pathname || '/').replace(/(.)\/$/, '$1');

  if (isArabicSegment(first)) return { locale: 'ar', path };

  return { locale: DEFAULT_LOCALE, path };
}

/**
 * `href` as it should be followed from a page at `pathname`.
 *
 * Every internal address in this codebase is written the way English serves it
 * — `/programs`, `/contact`, `/partners/ibas` — because that is the URL the
 * site has always had and the one that must never change. Followed from `/ar`,
 * those same addresses would walk the visitor back into English mid-journey,
 * which is worse than not offering Arabic at all. This is where the prefix is
 * put back on.
 *
 * Left alone: anything that is not a path this app serves. Anything that
 * already carries a language keeps it — an editor may type `/ar/…` into a
 * menu — and is only given its trailing slash.
 */
export function inLanguageOf(pathname: string | null, href: string): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href;

  const { locale } = splitLocale(pathname ?? '/');

  // A query string or a fragment travels with the path, not inside it.
  const cut = href.search(/[?#]/);
  const path = cut === -1 ? href : href.slice(0, cut);
  const rest = cut === -1 ? '' : href.slice(cut);

  // Already in a language of its own — a menu item an editor typed with the
  // prefix on it. Prefixing it twice would 404; it only needs its slash.
  const own = splitLocale(path);
  const target = own.locale !== DEFAULT_LOCALE ? own.locale : locale;

  return `${localePath(target, own.path)}${rest}`;
}

/**
 * Where one thing lives in every language, given what the CMS knows.
 *
 * `here` is the route as English serves it — `/insights/hello-world`. Each
 * translation names its own slug, so the same article in Arabic is
 * `/insights/<its own slug>`, ready for `localePath` to prefix.
 *
 * Returns `null` when nothing is known beyond the current language: that is
 * the difference between "the same page, over there" and a guess, and a guess
 * points a visitor and a crawler at a page that does not exist.
 */
export function translatedPaths(
  locale: Locale,
  here: string,
  translations: { locale: string; slug: string }[] | undefined,
): Partial<Record<Locale, string>> | null {
  const known = (translations ?? []).filter((one) => isLocale(one.locale));
  if (!known.length) return null;

  const section = here.slice(0, here.lastIndexOf('/'));

  return {
    [locale]: here,
    ...Object.fromEntries(
      known.map((one) => [one.locale, `${section}/${one.slug}`]),
    ),
  };
}

/** The direction text runs in. */
export function direction(locale: Locale): 'ltr' | 'rtl' {
  return LOCALE_META[locale].dir;
}

/**
 * A path made safe for an HTTP header: each segment percent-encoded once.
 *
 * Arabic slugs are kept decoded everywhere else, but a `Location` header must
 * be ASCII — a redirect to `/إدارة-…/` written raw fails the response.
 */
export function encodePath(path: string): string {
  const cut = path.search(/[?#]/);
  const pathname = cut === -1 ? path : path.slice(0, cut);
  const rest = cut === -1 ? '' : path.slice(cut);

  return (
    pathname
      .split('/')
      .map((segment) => {
        try {
          return encodeURIComponent(decodeURIComponent(segment));
        } catch {
          return encodeURIComponent(segment);
        }
      })
      .join('/') + rest
  );
}
