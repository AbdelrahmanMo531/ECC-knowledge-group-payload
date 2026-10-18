import type { Metadata } from 'next';

import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_META,
  localePath,
  type Locale,
} from '@/lib/i18n/config';
import { siteUrl } from '@/lib/env';
import type { SeoFields } from '@/lib/cms/types';

// Re-exported: it reads configuration rather than deciding anything about
// SEO, but every page asks this module for it.
export { siteUrl };

export const SITE_NAME = 'ECC Knowledge Group';

/**
 * Translates the robots directives picked on a document's SEO tab into Next's
 * `robots` metadata: lowercase tokens such as `noindex`, `nofollow`,
 * `noarchive`, `nosnippet` and `noimageindex`.
 */
function toRobots(directives?: string[] | null): Metadata['robots'] {
  if (!directives?.length) return undefined;

  const set = new Set(directives.map((directive) => directive.toLowerCase().trim()));

  return {
    index: !set.has('noindex'),
    follow: !set.has('nofollow'),
    noarchive: set.has('noarchive') || undefined,
    nosnippet: set.has('nosnippet') || undefined,
    noimageindex: set.has('noimageindex') || undefined,
  };
}

/**
 * Builds page metadata, preferring values authored on the document's SEO tab
 * and falling back to the page's own title and excerpt.
 */
export function buildMetadata({
  title,
  description,
  path = '/',
  locale = DEFAULT_LOCALE,
  languages,
  translated = true,
  image,
  type = 'website',
  canonical,
  robots,
  openGraph,
  keywords,
  seo,
}: {
  title: string;
  description?: string | null;
  /** The route, written the way English serves it. */
  path?: string;
  /** The language this page is being served in. */
  locale?: Locale;
  /**
   * Where this page lives in each language.
   *
   * Left out, the route is assumed to have the same address in every language,
   * which is true of every route the app defines itself. Passed as `null`, no
   * `hreflang` is emitted at all — which is what an article or a CMS page with
   * no known translation needs: a guessed address is worse than none, because
   * it points a crawler at a 404 and tells it the two pages are the same.
   */
  languages?: Partial<Record<Locale, string>> | null;
  /**
   * Whether this page is really in the language it is being served as.
   *
   * An Arabic route with no Arabic translation behind it falls back to English
   * and is then a duplicate of the English page. Marked `noindex, follow`: the
   * links on it are still worth crawling, but a search engine indexing it
   * would be indexing the same page twice under two addresses.
   */
  translated?: boolean;
  image?: string | null;
  type?: 'website' | 'article';
  /** Canonical URL override; defaults to the route's own URL. */
  canonical?: string | null;
  /** Robots directives from the SEO tab. */
  robots?: string[] | null;
  /** Social-specific title/description overrides. */
  openGraph?: { title?: string | null; description?: string | null } | null;
  /** Focus and related keywords from the SEO tab. */
  keywords?: string[] | null;
  /**
   * A document's whole SEO tab. Anything it sets wins over the matching
   * argument, which then acts as the fallback.
   */
  seo?: SeoFields | null;
}): Metadata {
  // A meta title typed on the SEO tab is the whole title, brand included, as
  // it was in Rank Math; anything else gets the layout's " — ECC" suffix.
  const editorTitle = seo?.title?.trim() || null;

  if (seo) {
    description = seo.description || description;
    canonical = seo.canonicalUrl || canonical;
    robots = seo.robots ?? robots;
    image = seo.image || image;
    keywords = seo.keywords ?? keywords;
    openGraph = seo.openGraph ?? openGraph;
  }

  const url = `${siteUrl()}${localePath(locale, path)}`;

  const alternates =
    languages === null
      ? undefined
      : {
          ...Object.fromEntries(
            LOCALES.map((code) => [
              LOCALE_META[code].tag,
              `${siteUrl()}${localePath(code, languages?.[code] ?? path)}`,
            ]),
          ),
          'x-default': `${siteUrl()}${localePath(
            DEFAULT_LOCALE,
            languages?.[DEFAULT_LOCALE] ?? path,
          )}`,
        };
  const ogImage = image ?? `${siteUrl()}/brand/ecc-logo-horizontal.svg`;

  const socialTitle = openGraph?.title || editorTitle || title;
  const socialDescription = openGraph?.description || description || undefined;

  return {
    title: editorTitle ? { absolute: editorTitle } : title,
    description: description ?? undefined,
    ...(keywords?.length ? { keywords } : {}),
    alternates: {
      // The canonical is this page in this language. An editor can override
      // it, but it must not be allowed to point Arabic at English: two
      // languages that name each other as canonical are one page as far as a
      // crawler is concerned, and only one of them gets indexed.
      canonical: canonical || url,
      // Every language this page is served in, each pointing at the others.
      // `x-default` is the English one, which is what a search engine shows
      // someone whose language it cannot guess.
      languages: alternates,
    },
    // An untranslated page is a duplicate whatever its SEO tab says about it,
    // so this is decided here rather than by the editor.
    robots: translated
      ? toRobots(robots)
      : { index: false, follow: true },
    openGraph: {
      title: socialTitle,
      description: socialDescription,
      url,
      siteName: SITE_NAME,
      type,
      images: [{ url: ogImage }],
      locale: LOCALE_META[locale].og,
      alternateLocale: LOCALES.filter((code) => code !== locale).map(
        (code) => LOCALE_META[code].og,
      ),
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description: socialDescription,
      images: [ogImage],
    },
  };
}
