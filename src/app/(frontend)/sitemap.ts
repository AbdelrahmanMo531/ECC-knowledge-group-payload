import type { MetadataRoute } from 'next';

import {
  getAboutContent,
  getAcademicMemberSlugs,
  getCeremonyContent,
  getContactContent,
  getFaqPageContent,
  getFeesContent,
  getGalleryContent,
  getHomeContent,
  getPeopleContent,
  getPodcastContent,
  getRecognitionContent,
  getSocialContent,
  getStaffContent,
  getStoriesContent,
  getPageBySlug,
  getPageUris,
  getPartnerSlugs,
  getPosts,
  getProgramSlugs,
} from '@/lib/cms/api';
import { DEFAULT_LOCALE, LOCALES, LOCALE_META, localePath, type Locale } from '@/lib/i18n/config';
import { postHref } from '@/lib/posts';
import { siteUrl } from '@/lib/seo';

/**
 * The sitemap, at `/sitemap.xml`. WordPress's `sitemap_index.xml` and its
 * per-type children redirect here (next.config.ts), so the address already
 * submitted to Search Console keeps working.
 *
 * Every entry is the page's canonical URL — trailing slash included — and
 * names its other-language versions where there are any, so the sitemap and the
 * pages' own `hreflang` tags say the same thing.
 */

/** Routes the app defines, at the same address in every language. */
const STATIC_ROUTES = [
  { path: '/', priority: 1 },
  { path: '/programs', priority: 0.9 },
  { path: '/about-us', priority: 0.8 },
  { path: '/fees-structure', priority: 0.8 },
  { path: '/partners', priority: 0.7 },
  { path: '/contact', priority: 0.7 },
  { path: '/our-academic-staff', priority: 0.7 },
  { path: '/graduation-ceremonies', priority: 0.7 },
  { path: '/faq', priority: 0.7 },
  { path: '/accreditations', priority: 0.7 },
  { path: '/blog', priority: 0.7 },
  { path: '/our-people', priority: 0.6 },
  { path: '/testimonials', priority: 0.6 },
  { path: '/video-gallery', priority: 0.6 },
  { path: '/podcast', priority: 0.6 },
  { path: '/social-responsibility', priority: 0.6 },
];

/**
 * The app-built pages whose words come from a Global. In a language that Global
 * has not been translated into, the page is English under another address and
 * carries `noindex` — so it is left out here too. The rest (listings) are
 * translated by the interface dictionary and always count.
 */
const TRANSLATION_CHECKS: Record<string, (locale: Locale) => Promise<{ translated: boolean }>> = {
  '/': getHomeContent,
  '/about-us': getAboutContent,
  '/fees-structure': getFeesContent,
  '/contact': getContactContent,
  '/our-academic-staff': getStaffContent,
  '/graduation-ceremonies': getCeremonyContent,
  '/faq': getFaqPageContent,
  '/accreditations': getRecognitionContent,
  '/our-people': getPeopleContent,
  '/testimonials': getStoriesContent,
  '/video-gallery': getGalleryContent,
  '/podcast': getPodcastContent,
  '/social-responsibility': getSocialContent,
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const absolute = (path: string) => `${base}${path}`;

  /** A route that exists at the same address in every language. */
  const everyLanguage = (path: string, priority: number, languages: readonly Locale[] = LOCALES): MetadataRoute.Sitemap =>
    languages.map((locale) => ({
      url: absolute(localePath(locale, path)),
      priority: locale === DEFAULT_LOCALE ? priority : Math.max(0.1, priority - 0.1),
      alternates: {
        languages: {
          ...Object.fromEntries(languages.map((code) => [LOCALE_META[code].tag, absolute(localePath(code, path))])),
          'x-default': absolute(localePath(DEFAULT_LOCALE, path)),
        },
      },
    }));

  const [programs, partners, academics, english, arabic] = await Promise.all([
    getProgramSlugs(),
    getPartnerSlugs(),
    getAcademicMemberSlugs(),
    getPosts('en'),
    getPosts('ar'),
  ]);

  // Articles: one language each, at the address they ranked at.
  const posts: MetadataRoute.Sitemap = [...english, ...arabic].map((post) => ({
    url: absolute(postHref(post)),
    lastModified: post.modified || post.date || undefined,
    priority: 0.6,
    ...(post.translations?.length
      ? {
          alternates: {
            languages: Object.fromEntries([
              [post.language, absolute(postHref(post))],
              ...post.translations.map((t) => [t.locale, absolute(postHref({ path: t.path ?? `/${t.slug}` }))]),
            ]),
          },
        }
      : {}),
  }));

  // CMS pages: listed per language, paired where the CMS knows the pairing.
  const pages = (
    await Promise.all(
      LOCALES.map(async (locale: Locale) => {
        const uris = await getPageUris(locale);
        return Promise.all(
          uris.map(async ([slug]) => {
            const page = await getPageBySlug(slug, locale);
            if (!page || !page.translated) return null;
            const languages = Object.fromEntries([
              [locale, absolute(localePath(locale, `/${slug}`))],
              ...(page.translations ?? []).map((t) => [t.locale, absolute(localePath(t.locale as Locale, `/${t.slug}`))]),
            ]);
            return {
              url: absolute(localePath(locale, `/${slug}`)),
              priority: 0.5,
              ...(Object.keys(languages).length > 1 ? { alternates: { languages } } : {}),
            };
          }),
        );
      }),
    )
  )
    .flat()
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  // Category archives with something in them.
  const categories = new Map<string, Locale>();
  for (const post of [...english, ...arabic]) {
    for (const slug of post.categorySlugs ?? []) categories.set(`${post.language}:${slug}`, post.language);
  }

  const staticEntries = await Promise.all(
    STATIC_ROUTES.map(async (route) => {
      const check = TRANSLATION_CHECKS[route.path];
      const languages = check
        ? (await Promise.all(LOCALES.map(async (locale) => ((await check(locale)).translated ? locale : null)))).filter(
            (locale): locale is Locale => locale !== null,
          )
        : LOCALES;
      return everyLanguage(route.path, route.priority, languages);
    }),
  );

  return [
    ...staticEntries.flat(),
    ...programs.flatMap((slug) => everyLanguage(`/programs/${slug}`, 0.8)),
    ...partners.flatMap((slug) => everyLanguage(`/partners/${slug}`, 0.6)),
    ...academics.flatMap((slug) => everyLanguage(`/academic-members/${slug}`, 0.4)),
    ...posts,
    ...pages,
    ...[...categories.entries()].map(([key, locale]) => ({
      url: absolute(localePath(locale, `/category/${key.slice(3)}`)),
      priority: 0.3,
    })),
  ];
}
