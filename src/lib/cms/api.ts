import 'server-only';

import config from '@payload-config';
import { unstable_cache } from 'next/cache';
import { getPayload, type Payload, type Where } from 'payload';
import { cache } from 'react';

import * as seed from '@/lib/content/site';
import {
  CONDITION_OPERATORS,
  FIELD_TYPES,
  type FormChoice,
  type FormDefinition,
  type FormField,
} from '@/lib/forms/definition';
import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from '@/lib/i18n/config';
import { translate } from '@/lib/i18n/dictionary';
import { toCurriculum } from '@/lib/programs/curriculum';
import { summarise } from '@/lib/text';

import { absolute, fill, lines, normalise, toHTML, toMedia, toSeo } from './normalise';
import { inEditorOrder } from './order';
import type {
  AboutContent,
  AcademicMember,
  Accreditation,
  Brochure,
  CeremonyContent,
  ContactContent,
  Episode,
  FaqContent,
  FaqItem,
  FeesContent,
  GalleryContent,
  GalleryVideo,
  HomeContent,
  Major,
  MediaItem,
  Module,
  NavItem,
  Page,
  Partner,
  PartnerRef,
  PeopleContent,
  Person,
  Podcast,
  PodcastContent,
  Post,
  Program,
  ProgramLevel,
  RecognitionContent,
  SeoFields,
  SiteMenus,
  SiteSettings,
  SocialContent,
  StaffContent,
  StoriesContent,
  Testimonial,
  Translation,
  VideoItem,
} from './types';

/**
 * Every read the site makes from Payload.
 *
 * Payload runs inside this Next app, so these go through the Local API — no
 * HTTP, no GraphQL, no tokens. Each function keeps the name and signature the
 * pages were written against, and returns the front-end's own types.
 *
 * Two rules hold throughout:
 *
 *   - **The site never hard-fails on the CMS.** If the database is
 *     unreachable — a build machine with no `DATABASE_URI`, an outage — every
 *     read falls back to the seeded content in `src/lib/content/site.ts` and
 *     logs why. So does a collection nobody has filled yet.
 *   - **Reads are cached under tags.** The collection and global hooks in
 *     `src/payload/hooks/revalidate.ts` purge those tags on save, so an edit is
 *     live on the next request.
 */

/** Cache tags. Purged by the Payload hooks when the content behind them changes. */
export const TAGS = {
  settings: 'settings',
  programs: 'programs',
  partners: 'partners',
  testimonials: 'testimonials',
  posts: 'posts',
  pages: 'pages',
  menus: 'menus',
  home: 'home',
  faculty: 'faculty',
  team: 'team',
  accreditations: 'accreditations',
  faqs: 'faqs',
  forms: 'forms',
  videos: 'videos',
  podcasts: 'podcasts',
  strings: 'strings',
  redirects: 'redirects',
} as const;

/* -------------------------------------------------------------------------- */
/* Plumbing                                                                   */
/* -------------------------------------------------------------------------- */

const configuredDatabase = () => Boolean(process.env.DATABASE_URI?.trim());

/** One Payload instance per process; `getPayload` memoises it. */
const client = cache(async (): Promise<Payload | null> => {
  if (!configuredDatabase()) return null;

  try {
    return await getPayload({ config });
  } catch (error) {
    console.error('[cms] Payload could not start; serving seeded content.', error);
    return null;
  }
});

/**
 * Part of every cache key, so a deployment never serves entries written by the
 * previous one's code — the Data Cache outlives deploys, and a change to how a
 * document is normalised would otherwise wait out the hour.
 */
const CACHE_VERSION = process.env.VERCEL_DEPLOYMENT_ID || process.env.VERCEL_GIT_COMMIT_SHA || process.env.CACHE_VERSION || 'local';

/**
 * Seconds a read stays cached. Saving anything in the admin purges the
 * affected tags at once (src/payload/hooks/revalidate.ts), so this is only the
 * backstop. Development keeps it short: edits still show immediately, and a
 * change to the normalising code shows within half a minute.
 */
const REVALIDATE = process.env.NODE_ENV === 'production' ? 3600 : 30;

/**
 * Reads already started while rendering this request, by key.
 *
 * A page, its layout and its `generateMetadata` each ask for the site
 * settings, the menus and their own content — six times over for the settings
 * alone. With the database across the internet (Neon), every repeat was
 * another round trip. One read per key per request.
 */
const inFlight = cache(() => new Map<string, Promise<unknown>>());

/**
 * Runs a read against Payload, cached under `tags`, falling back to `fallback`
 * when Payload is unavailable or the read throws.
 */
function read<T>(
  key: string[],
  tags: string[],
  fallback: T,
  run: (payload: Payload) => Promise<T | null | undefined>,
): Promise<{ data: T; live: boolean }> {
  const id = key.join('\u0000');
  const pending = inFlight();
  const existing = pending.get(id) as Promise<{ data: T; live: boolean }> | undefined;
  if (existing) return existing;

  const result = (async () => {
    const payload = await client();
    if (!payload) return { data: fallback, live: false };

    const execute = async () => {
      try {
        const data = await run(payload);
        return data === null || data === undefined ? { data: fallback, live: false } : { data, live: true };
      } catch (error) {
        console.error(`[cms] Falling back to seeded content for ${key.join(':')}:`, error);
        return { data: fallback, live: false };
      }
    };

    return unstable_cache(execute, ['cms', CACHE_VERSION, ...key], { tags, revalidate: REVALIDATE })();
  })();

  pending.set(id, result);
  return result;
}

/** A collection read, published documents only, at `depth`. */
async function find(
  payload: Payload,
  collection: Parameters<Payload['find']>[0]['collection'],
  locale: Locale,
  options: { where?: Where; depth?: number; limit?: number; sort?: string; drafts?: boolean } = {},
) {
  const where: Where = options.drafts
    ? { and: [{ _status: { equals: 'published' } }, ...(options.where ? [options.where] : [])] }
    : (options.where ?? {});

  const result = await payload.find({
    collection,
    locale,
    fallbackLocale: DEFAULT_LOCALE,
    where,
    depth: options.depth ?? 1,
    limit: options.limit ?? 500,
    sort: options.sort,
    pagination: false,
  });

  return result.docs as unknown as Record<string, unknown>[];
}

/**
 * A global, in `locale` with English filling any gap — plus whether this
 * language really has its own copy (the Arabic page untranslated is English,
 * and is marked `noindex` rather than indexed twice).
 */
async function global(payload: Payload, slug: string, locale: Locale) {
  const doc = (await payload.findGlobal({
    slug: slug as Parameters<Payload['findGlobal']>[0]['slug'],
    locale,
    fallbackLocale: DEFAULT_LOCALE,
    depth: 1,
  })) as unknown as Record<string, unknown>;

  let translated = true;
  if (locale !== DEFAULT_LOCALE) {
    const own = (await payload.findGlobal({
      slug: slug as Parameters<Payload['findGlobal']>[0]['slug'],
      locale,
      fallbackLocale: false,
      depth: 0,
    })) as unknown as Record<string, unknown>;
    translated = hasText(own);
  }

  return { doc, translated };
}

/** Whether a document carries any localized text of its own. */
function hasText(value: unknown, depth = 0): boolean {
  if (depth > 4 || value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 1 && !/^\d+$/.test(value.trim());
  if (Array.isArray(value)) return value.some((entry) => hasText(entry, depth + 1));
  if (typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).some(
      ([key, entry]) => !['id', 'globalType', 'updatedAt', 'createdAt', 'slug'].includes(key) && hasText(entry, depth + 1),
    );
  }
  return false;
}

const str = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');
const id = (doc: Record<string, unknown>): string => String(doc.id ?? '');

/** Where else a shared-slug document lives: the same slug, in each other language. */
function sameSlugTranslations(slug: string, locale: Locale): Translation[] {
  return LOCALES.filter((code) => code !== locale).map((code) => ({ locale: code, slug }));
}

/* -------------------------------------------------------------------------- */
/* Site settings, menus, interface strings                                    */
/* -------------------------------------------------------------------------- */

export async function getSiteSettings(locale: Locale = DEFAULT_LOCALE): Promise<SiteSettings> {
  const { data } = await read(['settings', locale], [TAGS.settings], seed.siteSettings, async (payload) => {
    const { doc } = await global(payload, 'site-settings', locale);
    const cms = normalise<Record<string, any>>(doc);
    const base = seed.siteSettings;

    return {
      tagline: str(cms.tagline) || base.tagline,
      contact: fill(base.contact, cms.contact),
      social: Array.isArray(cms.social) && cms.social.length
        ? cms.social.map((link: Record<string, unknown>) => ({
            label: str(link.label),
            url: str(link.url),
            sticky: Boolean(link.sticky),
          }))
        : base.social,
      // Never seeded: inventing a tracking snippet would report visits to
      // somebody else's account.
      code: { head: str(cms.code?.head), body: str(cms.code?.body) },
      defaultOgImage: absolute((cms.defaultOgImage as MediaItem | null)?.sourceUrl),
      organization: {
        legalName: str(cms.organization?.legalName) || null,
        logo: absolute((cms.organization?.logo as MediaItem | null)?.sourceUrl),
        foundingDate: str(cms.organization?.foundingDate) || null,
      },
      verification: {
        google: str(cms.verification?.google) || null,
        bing: str(cms.verification?.bing) || null,
      },
    } satisfies SiteSettings;
  });

  return data;
}

function toNav(rows: unknown, prefix: string): NavItem[] {
  if (!Array.isArray(rows)) return [];

  return rows
    .map((row: Record<string, any>, index): NavItem => {
      const href = str(row.href) || '/';
      return {
        id: `${prefix}-${index}`,
        label: str(row.label),
        href,
        external: /^https?:\/\//i.test(href),
        newTab: Boolean(row.newTab),
        children: toNav(row.children, `${prefix}-${index}`),
      };
    })
    .filter((item) => item.label);
}

/**
 * All four menus. Falls back per menu: a site with a header menu but no footer
 * one still gets its real header.
 */
export async function getMenus(locale: Locale = DEFAULT_LOCALE): Promise<SiteMenus> {
  const { data } = await read(['menus', locale], [TAGS.menus], seed.fallbackMenus, async (payload) => {
    const { doc } = await global(payload, 'navigation', locale);
    const at = (name: keyof SiteMenus) => {
      const tree = toNav(doc[name], name);
      return tree.length ? tree : seed.fallbackMenus[name];
    };

    return {
      primary: at('primary'),
      footerExplore: at('footerExplore'),
      footerPrograms: at('footerPrograms'),
      footerLegal: at('footerLegal'),
    };
  });

  return data;
}

/** Interface strings an editor has reworded, for one language. Usually empty. */
export async function getInterfaceStrings(locale: Locale = DEFAULT_LOCALE): Promise<Record<string, string>> {
  const { data } = await read(['strings', locale], [TAGS.strings], {} as Record<string, string>, async (payload) => {
    const doc = (await payload.findGlobal({
      slug: 'interface-strings',
      locale,
      // An override in English only must not replace the Arabic wording.
      fallbackLocale: false,
      depth: 0,
    })) as unknown as { overrides?: { key?: string; value?: string | null }[] };

    return Object.fromEntries(
      (doc.overrides ?? []).filter((row) => row.key && str(row.value)).map((row) => [row.key!, str(row.value)]),
    );
  });

  return data;
}

/* -------------------------------------------------------------------------- */
/* Programmes                                                                 */
/* -------------------------------------------------------------------------- */

const LEVELS: ProgramLevel[] = ['Bachelor', 'Master', 'Doctorate', 'Diploma', 'Executive'];

function toModules(rows: unknown): Module[] {
  if (!Array.isArray(rows)) return [];

  return rows
    .map((row: Record<string, unknown>) => ({
      title: str(row.title),
      aims: str(row.aims) || null,
      outcomes: lines(row.outcomes),
      group: str(row.group) || null,
      credits: str(row.credits) || null,
      level: str(row.level) || null,
    }))
    .filter((module) => module.title);
}

function toBrochure(value: unknown): Brochure | null {
  if (!value || typeof value !== 'object') return null;
  const doc = value as Record<string, unknown>;
  if (!str(doc.url)) return null;

  return { url: str(doc.url), title: str(doc.alt) || str(doc.filename) || null };
}

function toAccreditation(doc: Record<string, unknown>): Accreditation {
  return {
    id: id(doc),
    name: str(doc.name),
    description: str(doc.description),
    issuer: str(doc.issuer) || null,
    website: str(doc.website) || null,
    logo: toMedia(doc.logo),
  };
}

function toPartnerRef(value: unknown): PartnerRef | null {
  if (!value || typeof value !== 'object') return null;
  const doc = value as Record<string, any>;

  return {
    slug: str(doc.slug),
    name: str(doc.name),
    country: str(doc.country) || null,
    countryCode: str(doc.countryCode) || null,
    logo: toMedia(doc.logo),
    accreditations: (doc.accreditations?.docs ?? [])
      .filter((entry: unknown) => entry && typeof entry === 'object')
      .map(toAccreditation)
      .filter((body: Accreditation) => body.name),
  };
}

function toProgram(doc: Record<string, any>, locale: Locale): Program {
  const coreModules = toModules(doc.coreModules);
  const slug = str(doc.slug);

  return {
    id: id(doc),
    slug,
    translations: sameSlugTranslations(slug, locale),
    title: str(doc.title),
    excerpt: str(doc.excerpt),
    content: toHTML(doc.content) || null,
    featuredImage: toMedia(doc.featuredImage),
    level: LEVELS.find((level) => level === doc.level) ?? 'Executive',
    duration: str(doc.duration),
    studyMode: str(doc.studyMode),
    awardingBody: str(doc.awardingBody),
    tuition: str(doc.tuition) || null,
    highlights: normalise<string[]>(doc.highlights ?? []),
    credits: str(doc.credits) || null,
    language: str(doc.language) || null,
    accreditations: normalise<string[]>(doc.accreditations ?? []),
    learningOutcomes: normalise<string[]>(doc.learningOutcomes ?? []),
    careers: normalise<string[]>(doc.careers ?? []),
    whyStudy: (doc.whyStudy ?? [])
      .map((row: Record<string, unknown>) => ({ title: str(row.title), description: str(row.description) }))
      .filter((row: { title: string }) => row.title),
    coreModules,
    curriculum: toCurriculum(
      coreModules,
      (doc.structureGroups ?? [])
        .map((row: Record<string, unknown>) => ({ title: str(row.title), subtitle: str(row.subtitle) || null }))
        .filter((row: { title: string }) => row.title),
    ),
    majors: (doc.majors ?? [])
      .map(
        (major: Record<string, any>, index: number): Major => ({
          id: String(major.id ?? `${slug}-major-${index}`),
          slug: str(major.slug) || String(index),
          name: str(major.name),
          icon: str(major.icon) || null,
          overview: toHTML(major.overview) || null,
          modules: toModules(major.modules),
          brochure: toBrochure(major.brochure),
        }),
      )
      .filter((major: Major) => major.name),
    brochure: toBrochure(doc.brochure),
    partner: toPartnerRef(doc.partner),
    seo: toSeo(doc.meta, toMedia(doc.featuredImage)),
  };
}

export async function getPrograms(locale: Locale = DEFAULT_LOCALE): Promise<Program[]> {
  const { data } = await read(['programs', locale], [TAGS.programs], seed.programs, async (payload) => {
    const docs = await find(payload, 'programs', locale, { depth: 2, sort: 'order' });
    return docs.length ? docs.map((doc) => toProgram(doc, locale)) : null;
  });

  return data;
}

export async function getProgramBySlug(slug: string, locale: Locale = DEFAULT_LOCALE): Promise<Program | null> {
  const fallback = seed.programs.find((program) => program.slug === slug) ?? null;

  const { data } = await read(['program', slug, locale], [TAGS.programs, `program:${slug}`], fallback, async (payload) => {
    const [doc] = await find(payload, 'programs', locale, { where: { slug: { equals: slug } }, depth: 2, limit: 1 });
    return doc ? toProgram(doc, locale) : await hasAny(payload, 'programs') ? null : undefined;
  });

  return data;
}

export async function getProgramSlugs(locale: Locale = DEFAULT_LOCALE): Promise<string[]> {
  return (await getPrograms(locale)).map((program) => program.slug);
}

/**
 * Whether a collection has anything in it.
 *
 * A slug that matches nothing in a populated collection is a 404; in an empty
 * one, the seeded entry of that slug is still the best answer.
 */
async function hasAny(payload: Payload, collection: Parameters<Payload['count']>[0]['collection']) {
  const { totalDocs } = await payload.count({ collection });
  return totalDocs > 0;
}

/* -------------------------------------------------------------------------- */
/* Partners                                                                   */
/* -------------------------------------------------------------------------- */

function toPartner(doc: Record<string, any>, locale: Locale): Partner {
  const content = toHTML(doc.content);
  const slug = str(doc.slug);

  return {
    id: id(doc),
    slug,
    translations: sameSlugTranslations(slug, locale),
    name: str(doc.name),
    country: str(doc.country),
    countryCode: str(doc.countryCode) || null,
    description: str(doc.description) || summarise(content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(), 260),
    content: content || null,
    about: normalise<string[]>(doc.about ?? []),
    logo: toMedia(doc.logo),
    image: toMedia(doc.image),
    website: str(doc.website) || null,
    accentColor: str(doc.accentColor) || null,
    mission: str(doc.mission) || null,
    values: (doc.values ?? [])
      .map((row: Record<string, unknown>) => ({ title: str(row.title), description: str(row.description) }))
      .filter((row: { title: string }) => row.title),
    stats: toStats(doc.stats),
    programs: (doc.programs?.docs ?? [])
      .filter((entry: unknown) => entry && typeof entry === 'object')
      .map((entry: Record<string, unknown>) => toProgram(entry, locale)),
    accreditations: (doc.accreditations?.docs ?? [])
      .filter((entry: unknown) => entry && typeof entry === 'object')
      .map(toAccreditation),
    seo: toSeo(doc.meta, toMedia(doc.image) ?? toMedia(doc.logo)),
  };
}

export async function getPartners(locale: Locale = DEFAULT_LOCALE): Promise<Partner[]> {
  const { data } = await read(['partners', locale], [TAGS.partners, TAGS.programs], seed.partners, async (payload) => {
    const docs = await find(payload, 'partners', locale, { depth: 2, sort: 'order' });
    return docs.length ? docs.map((doc) => toPartner(doc, locale)) : null;
  });

  return data;
}

export async function getPartnerBySlug(slug: string, locale: Locale = DEFAULT_LOCALE): Promise<Partner | null> {
  const fallback = seed.partners.find((partner) => partner.slug === slug) ?? null;

  const { data } = await read(
    ['partner', slug, locale],
    [TAGS.partners, TAGS.programs, TAGS.accreditations, `partner:${slug}`],
    fallback,
    async (payload) => {
      const [doc] = await find(payload, 'partners', locale, { where: { slug: { equals: slug } }, depth: 2, limit: 1 });
      return doc ? toPartner(doc, locale) : (await hasAny(payload, 'partners')) ? null : undefined;
    },
  );

  return data;
}

export async function getPartnerSlugs(locale: Locale = DEFAULT_LOCALE): Promise<string[]> {
  return (await getPartners(locale)).map((partner) => partner.slug);
}

/* -------------------------------------------------------------------------- */
/* Testimonials                                                               */
/* -------------------------------------------------------------------------- */

export async function getTestimonials(locale: Locale = DEFAULT_LOCALE): Promise<Testimonial[]> {
  const { data } = await read(['testimonials', locale], [TAGS.testimonials], seed.testimonials, async (payload) => {
    const docs = await find(payload, 'testimonials', locale);
    const out = docs
      .map(
        (doc): Testimonial => ({
          id: id(doc),
          title: str(doc.videoTitle) || str(doc.authorName),
          quote: str(doc.quote),
          authorName: str(doc.authorName),
          authorRole: str(doc.authorRole),
          program: str(doc.program) || null,
          country: str(doc.country) || null,
          avatar: toMedia(doc.avatar),
          video: str(doc.video) || null,
          videoTitle: str(doc.videoTitle) || null,
          poster: toMedia(doc.poster),
        }),
      )
      // A testimonial has to say something: a quote, or a film.
      .filter((testimonial) => (testimonial.quote || testimonial.video) && testimonial.authorName);

    return out.length ? out : null;
  });

  return data;
}

/* -------------------------------------------------------------------------- */
/* Articles                                                                   */
/* -------------------------------------------------------------------------- */

function toPost(doc: Record<string, any>): Post {
  const language: Locale = doc.language === 'en' ? 'en' : 'ar';
  const slug = str(doc.slug);
  const categories = (doc.categories ?? []).filter((entry: unknown) => entry && typeof entry === 'object');

  return {
    id: id(doc),
    slug,
    language,
    path: str(doc.legacyPath) || `/${slug}`,
    translations: (doc.translations ?? [])
      .filter((entry: unknown) => entry && typeof entry === 'object')
      .map((entry: Record<string, unknown>) => ({
        locale: entry.language === 'en' ? 'en' : 'ar',
        slug: str(entry.slug),
        path: str(entry.legacyPath) || `/${str(entry.slug)}`,
      })),
    title: str(doc.title),
    excerpt: str(doc.excerpt),
    content: toHTML(doc.content) || null,
    date: str(doc.publishedAt) || str(doc.createdAt),
    modified: str(doc.updatedAt) || null,
    featuredImage: toMedia(doc.featuredImage),
    categories: categories.map((category: Record<string, unknown>) => str(category.name)).filter(Boolean),
    categorySlugs: categories.map((category: Record<string, unknown>) => str(category.slug)).filter(Boolean),
    author: str(doc.authorName) ? { name: str(doc.authorName) } : null,
    seo: toSeo(doc.meta, toMedia(doc.featuredImage)),
  };
}

/**
 * Published articles in one language, newest first.
 *
 * An article is written in one language and lives at its own address, so the
 * Arabic blog lists Arabic articles and the English one English — not one set
 * shown twice.
 */
export async function getPosts(locale: Locale = DEFAULT_LOCALE, options: { category?: string } = {}): Promise<Post[]> {
  const key = ['posts', locale, options.category ?? ''];

  const { data } = await read(key, [TAGS.posts], [] as Post[], async (payload) => {
    const where: Where = { language: { equals: locale } };
    let filter: Where = where;

    if (options.category) {
      const [category] = await find(payload, 'categories', locale, {
        where: { slug: { equals: options.category } },
        depth: 0,
        limit: 1,
      });
      if (!category) return [];
      filter = { and: [where, { categories: { contains: category.id } }] };
    }

    const docs = await find(payload, 'posts', locale, { where: filter, depth: 1, sort: '-publishedAt', drafts: true, limit: 2000 });
    return docs.map(toPost);
  });

  return data;
}

/**
 * The article at a path, whichever language it is in.
 *
 * `path` is written without a language prefix or trailing slash. An exact
 * legacy path wins (`/blogs/some-slug`); otherwise the last segment is read as
 * a slug, so `/some-slug` and an old category permalink such as
 * `/arabic-blogs/some-slug` both find the article. The caller compares
 * `post.path` with what was asked for and redirects to the canonical one.
 */
export async function getPostByPath(path: string): Promise<Post | null> {
  const clean = `/${path.replace(/^\/+|\/+$/g, '')}`;

  const { data } = await read(['post-path', clean], [TAGS.posts], null as Post | null, async (payload) => {
    const slug = clean.split('/').filter(Boolean).pop() ?? '';
    const docs = await find(payload, 'posts', DEFAULT_LOCALE, {
      where: { or: [{ legacyPath: { equals: clean } }, { slug: { equals: slug } }] },
      depth: 1,
      limit: 2,
      drafts: true,
    });
    const doc = docs.find((entry) => entry.legacyPath === clean) ?? docs[0];
    return doc ? toPost(doc) : null;
  });

  return data;
}

/** An article by its slug, whichever language it is written in. */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  return getPostByPath(`/${slug}`);
}

export async function getPostSlugs(locale: Locale = DEFAULT_LOCALE): Promise<string[]> {
  return (await getPosts(locale)).map((post) => post.slug);
}

/** A category, by slug — for its archive page. */
export async function getCategory(slug: string, locale: Locale = DEFAULT_LOCALE) {
  const { data } = await read(
    ['category', slug, locale],
    [TAGS.posts],
    null as { name: string; slug: string; description: string; seo: SeoFields | null } | null,
    async (payload) => {
      const [doc] = await find(payload, 'categories', locale, { where: { slug: { equals: slug } }, depth: 1, limit: 1 });
      return doc
        ? { name: str(doc.name), slug: str(doc.slug), description: str(doc.description), seo: toSeo(doc.meta) }
        : null;
    },
  );

  return data;
}

/* -------------------------------------------------------------------------- */
/* Editor-managed pages                                                       */
/* -------------------------------------------------------------------------- */

/**
 * A published page by its slug in `locale`.
 *
 * An Arabic address with no Arabic page behind it falls back to the English
 * page of that slug and says so (`translated: false`), so it is marked
 * `noindex` instead of being indexed as a duplicate.
 */
export async function getPageBySlug(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): Promise<(Page & { translated: boolean }) | null> {
  const { data } = await read(['page', slug, locale], [TAGS.pages, `page:${slug}`], null as (Page & { translated: boolean }) | null, async (payload) => {
    const lookup = async (language: Locale) =>
      (await find(payload, 'pages', language, { where: { slug: { equals: slug } }, depth: 2, limit: 1, drafts: true }))[0];

    let doc = await lookup(locale);
    let translated = true;
    if (!doc && locale !== DEFAULT_LOCALE) {
      doc = await lookup(DEFAULT_LOCALE);
      translated = false;
    }
    if (!doc) return null;

    // Each language can give the page its own slug; read them all back for
    // hreflang and the language switcher.
    const all = (await payload.findByID({
      collection: 'pages',
      id: doc.id as string,
      locale: 'all',
      depth: 0,
      select: { slug: true },
    })) as unknown as { slug?: Record<string, string | null> | string };
    const slugs = typeof all.slug === 'object' && all.slug ? all.slug : {};

    return {
      id: id(doc),
      slug: str(doc.slug),
      translations: Object.entries(slugs)
        .filter(([code, value]) => isLocale(code) && code !== locale && value)
        .map(([code, value]) => ({ locale: code, slug: String(value) })),
      title: str(doc.title),
      content: toHTML(doc.content),
      featuredImage: toMedia(doc.featuredImage),
      seo: toSeo(doc.meta, toMedia(doc.featuredImage)),
      translated,
    };
  });

  return data;
}

/** Every published page slug in a language, as segment arrays. */
export async function getPageUris(locale: Locale = DEFAULT_LOCALE): Promise<string[][]> {
  const { data } = await read(['page-uris', locale], [TAGS.pages], [] as string[][], async (payload) => {
    const docs = await find(payload, 'pages', locale, { depth: 0, drafts: true, limit: 2000 });
    return docs
      .map((doc) => str(doc.slug))
      .filter((slug) => slug && !RESERVED_ROUTES.has(`/${slug}`))
      .map((slug) => [slug]);
  });

  return data;
}

/** Top-level paths owned by the app rather than by the CMS. */
export const RESERVED_ROUTES = new Set([
  '/about',
  '/about-us',
  '/programs',
  '/partners',
  '/blog',
  '/category',
  '/insights',
  '/contact',
  '/our-people',
  '/our-academic-staff',
  '/testimonials',
  '/video-gallery',
  '/podcast',
  '/fees-structure',
  '/social-responsibility',
  '/graduation-ceremonies',
  '/faq',
  '/accreditations',
  '/academic-members',
  '/api',
  '/admin',
  '/home',
]);

/* -------------------------------------------------------------------------- */
/* Redirects                                                                  */
/* -------------------------------------------------------------------------- */

export type RedirectRule = { from: string; to: string; permanent: boolean };

/** Decoded, leading slash, no trailing slash, no query. */
export function redirectKey(path: string): string {
  let value = path.trim();
  try {
    value = decodeURIComponent(value);
  } catch {
    // keep as typed
  }
  value = value.replace(/^https?:\/\/[^/]+/i, '').replace(/[?#].*$/, '');
  return `/${value.replace(/^\/+|\/+$/g, '')}`;
}

/** Every redirect an editor has set up under SEO → Redirects. */
export async function getRedirects(): Promise<RedirectRule[]> {
  const { data } = await read(['redirects'], [TAGS.redirects, TAGS.posts, TAGS.pages, TAGS.programs, TAGS.partners], [] as RedirectRule[], async (payload) => {
    const result = await payload.find({ collection: 'redirects', depth: 1, limit: 5000, pagination: false });

    return (result.docs as unknown as Record<string, any>[])
      .map((doc) => {
        let to = str(doc.to?.url);
        const reference = doc.to?.reference;
        if (doc.to?.type === 'reference' && reference?.value && typeof reference.value === 'object') {
          const target = reference.value as Record<string, unknown>;
          to =
            reference.relationTo === 'posts'
              ? str(target.legacyPath) || `/${str(target.slug)}`
              : reference.relationTo === 'programs'
                ? `/programs/${str(target.slug)}`
                : reference.relationTo === 'partners'
                  ? `/partners/${str(target.slug)}`
                  : `/${str(target.slug)}`;
        }

        return { from: redirectKey(str(doc.from)), to, permanent: !['302', '307'].includes(String(doc.type ?? '301')) };
      })
      .filter((rule) => rule.from !== '/' && rule.to);
  });

  return data;
}

/** The redirect for a path, if an editor made one. */
export async function findRedirect(path: string): Promise<RedirectRule | null> {
  const key = redirectKey(path);
  return (await getRedirects()).find((rule) => rule.from === key) ?? null;
}

/* -------------------------------------------------------------------------- */
/* People                                                                     */
/* -------------------------------------------------------------------------- */

/** Where an academic member's own page lives. */
export function academicMemberPath(slug: string): string {
  return `/academic-members/${slug}`;
}

function toPerson(doc: Record<string, any>, detailPath: string | null = null): Person {
  return {
    id: id(doc),
    slug: str(doc.slug),
    date: str(doc.createdAt) || null,
    name: str(doc.name),
    position: str(doc.position),
    credentials: str(doc.credentials) || null,
    bio: toHTML(doc.bio) || null,
    linkedin: str(doc.linkedin) || null,
    photo: toMedia(doc.photo),
    team: str(doc.team) || null,
    order: typeof doc.order === 'number' && doc.order > 0 ? doc.order : null,
    detailPath,
  };
}

function toAcademicMember(doc: Record<string, any>, locale: Locale): AcademicMember {
  const slug = str(doc.slug);

  return {
    ...toPerson(doc, academicMemberPath(slug)),
    translations: sameSlugTranslations(slug, locale),
    institution: str(doc.institution) || null,
    expertise: normalise<string[]>(doc.expertise ?? []),
    teaching: normalise<string[]>(doc.teaching ?? []),
    research: normalise<string[]>(doc.research ?? []),
    qualifications: (doc.qualifications ?? [])
      .map((row: Record<string, unknown>) => ({
        title: str(row.title),
        institution: str(row.institution) || null,
        year: str(row.year) || null,
      }))
      .filter((row: { title: string }) => row.title),
    experience: (doc.experience ?? [])
      .map((row: Record<string, unknown>) => ({
        role: str(row.role),
        organisation: str(row.organisation) || null,
        period: str(row.period) || null,
      }))
      .filter((row: { role: string }) => row.role),
    specializations: (doc.specializations ?? [])
      .filter((term: unknown) => term && typeof term === 'object')
      .map((term: Record<string, unknown>) => ({ name: str(term.name), slug: str(term.slug) }))
      .filter((term: { name: string; slug: string }) => term.name && term.slug),
    seo: toSeo(doc.meta, toMedia(doc.photo)),
  };
}

export async function getAcademicMembers(locale: Locale = DEFAULT_LOCALE): Promise<AcademicMember[]> {
  const { data } = await read(['faculty', locale], [TAGS.faculty], seed.academicMembers, async (payload) => {
    const docs = await find(payload, 'academic-members', locale, { depth: 1, sort: '-createdAt' });
    return docs.length ? docs.map((doc) => toAcademicMember(doc, locale)) : null;
  });

  // Every listing without an order of its own reads the same way; the home
  // page's board deliberately overrides it and shows the most recent.
  return inEditorOrder(data);
}

export async function getAcademicMember(slug: string, locale: Locale = DEFAULT_LOCALE): Promise<AcademicMember | null> {
  const fallback = seed.academicMembers.find((member) => member.slug === slug) ?? null;

  const { data } = await read(['academic', slug, locale], [TAGS.faculty, `academic_member:${slug}`], fallback, async (payload) => {
    const [doc] = await find(payload, 'academic-members', locale, { where: { slug: { equals: slug } }, depth: 1, limit: 1 });
    return doc ? toAcademicMember(doc, locale) : (await hasAny(payload, 'academic-members')) ? null : undefined;
  });

  return data;
}

export async function getAcademicMemberSlugs(locale: Locale = DEFAULT_LOCALE): Promise<string[]> {
  return (await getAcademicMembers(locale)).map((member) => member.slug);
}

export async function getTeamMembers(locale: Locale = DEFAULT_LOCALE): Promise<Person[]> {
  const { data } = await read(['team', locale], [TAGS.team], seed.teamMembers, async (payload) => {
    const docs = await find(payload, 'team-members', locale, { depth: 1, sort: '-createdAt' });
    return docs.length ? inEditorOrder(docs.map((doc) => toPerson(doc))) : null;
  });

  return data;
}

/* -------------------------------------------------------------------------- */
/* Accreditations, FAQs                                                       */
/* -------------------------------------------------------------------------- */

export async function getAccreditations(locale: Locale = DEFAULT_LOCALE): Promise<Accreditation[]> {
  const { data } = await read(['accreditations', locale], [TAGS.accreditations], seed.accreditations, async (payload) => {
    // A body tied to a partner belongs on that partner's page.
    const docs = await find(payload, 'accreditations', locale, { where: { partner: { exists: false } }, sort: 'order' });
    return docs.length ? docs.map(toAccreditation) : null;
  });

  return data;
}

export async function getFaqs(locale: Locale = DEFAULT_LOCALE): Promise<FaqItem[]> {
  const { data } = await read(['faqs', locale], [TAGS.faqs], seed.faqs, async (payload) => {
    const docs = await find(payload, 'faqs', locale, { sort: 'order' });
    const out = docs
      .map((doc): FaqItem => ({ id: id(doc), question: str(doc.question), answer: toHTML(doc.answer) }))
      .filter((faq) => faq.question && faq.answer);
    return out.length ? out : null;
  });

  return data;
}

/* -------------------------------------------------------------------------- */
/* App-built pages (Globals)                                                  */
/* -------------------------------------------------------------------------- */

type PageRead<T> = { content: T; seo: SeoFields | null; translated: boolean };

/**
 * One app-built page: its Global, normalised, reshaped by `shape`, and filled
 * in field by field from the seeded copy.
 */
async function pageContent<T>(
  slug: string,
  locale: Locale,
  base: T,
  tags: string[],
  shape: (cms: Record<string, any>) => unknown = (cms) => cms,
  finish: (content: T, cms: Record<string, any>) => T = (content) => content,
): Promise<PageRead<T>> {
  const fallback: PageRead<T> = { content: base, seo: null, translated: locale === DEFAULT_LOCALE };

  const { data } = await read(['global', slug, locale], [TAGS.pages, slug, ...tags], fallback, async (payload) => {
    const { doc, translated } = await global(payload, slug, locale);
    const seo = toSeo(doc.meta);
    const cms = normalise<Record<string, any>>({ ...doc, meta: undefined });

    return { content: finish(fill(base, shape(cms)), cms), seo, translated };
  });

  return data;
}

export async function getHomeContent(locale: Locale = DEFAULT_LOCALE): Promise<PageRead<HomeContent>> {
  return pageContent<HomeContent>(
    'home-page',
    locale,
    seed.homeContent,
    [TAGS.home],
    ({ figures, ...rest }) => ({ ...rest, countries: figures?.countries, stats: figures?.stats }),
    // No fallback for the film: an absent link hides the section rather than
    // pointing at somebody else's video.
    (content, cms) => ({ ...content, video: { ...content.video, url: str(cms.video?.url) } }),
  );
}

export async function getAboutContent(locale: Locale = DEFAULT_LOCALE): Promise<PageRead<AboutContent>> {
  return pageContent<AboutContent>('about-page', locale, seed.aboutContent, [], ({ purpose, sections, ...rest }) => ({
    ...rest,
    mission: purpose?.mission,
    vision: purpose?.vision,
    stats: purpose?.stats,
    ...(sections ?? {}),
  }));
}

export async function getContactContent(locale: Locale = DEFAULT_LOCALE): Promise<PageRead<ContactContent>> {
  return pageContent<ContactContent>('contact-page', locale, seed.contactContent, ['contact']);
}

export async function getFaqPageContent(locale: Locale = DEFAULT_LOCALE): Promise<PageRead<FaqContent>> {
  return pageContent<FaqContent>('faq-page', locale, seed.faqPageContent, ['faq']);
}

export async function getRecognitionContent(locale: Locale = DEFAULT_LOCALE): Promise<PageRead<RecognitionContent>> {
  return pageContent<RecognitionContent>('accreditations-page', locale, seed.recognitionContent, ['accreditations']);
}

export async function getStoriesContent(locale: Locale = DEFAULT_LOCALE): Promise<PageRead<StoriesContent>> {
  return pageContent<StoriesContent>('stories-page', locale, seed.storiesContent, []);
}

export async function getGalleryContent(locale: Locale = DEFAULT_LOCALE): Promise<PageRead<GalleryContent>> {
  return pageContent<GalleryContent>('gallery-page', locale, seed.galleryContent, []);
}

export async function getStaffContent(locale: Locale = DEFAULT_LOCALE): Promise<PageRead<StaffContent>> {
  return pageContent<StaffContent>('staff-page', locale, seed.staffContent, []);
}

export async function getPodcastContent(locale: Locale = DEFAULT_LOCALE): Promise<PageRead<PodcastContent>> {
  return pageContent<PodcastContent>('podcast-page', locale, seed.podcastContent, []);
}

export async function getPeopleContent(locale: Locale = DEFAULT_LOCALE): Promise<PageRead<PeopleContent>> {
  return pageContent<PeopleContent>('people-page', locale, seed.peopleContent, [], (cms) => cms);
}

export async function getFeesContent(locale: Locale = DEFAULT_LOCALE): Promise<PageRead<FeesContent>> {
  return pageContent<FeesContent>('fees-page', locale, seed.feesContent, [], ({ intro, quote, ...rest }) => ({
    ...rest,
    intro: intro ? { eyebrow: intro.eyebrow, heading: intro.heading, body: intro.body } : undefined,
    highlights: intro?.highlights,
    quote: quote?.quote,
  }));
}

export async function getSocialContent(locale: Locale = DEFAULT_LOCALE): Promise<PageRead<SocialContent>> {
  return pageContent<SocialContent>('social-page', locale, seed.socialContent, [], ({ intro, ...rest }) => ({
    ...rest,
    intro: intro ? { eyebrow: intro.eyebrow, heading: intro.heading, body: intro.body } : undefined,
    tags: intro?.tags,
    quote: intro?.quote,
  }));
}

/** A film row on the ceremonies page, as the shared grid needs it. */
function toVideoItems(rows: unknown, prefix: string): VideoItem[] | undefined {
  if (!Array.isArray(rows) || !rows.length) return undefined;

  return rows
    .map((row: Record<string, any>, index) => ({
      id: `${prefix}-${index}`,
      slug: `${prefix}-${index + 1}`,
      title: str(row.title),
      credit: str(row.credit) || null,
      video: str(row.video),
      poster: (row.poster as MediaItem | null) ?? null,
    }))
    .filter((film) => film.video);
}

export async function getCeremonyContent(locale: Locale = DEFAULT_LOCALE): Promise<PageRead<CeremonyContent>> {
  return pageContent<CeremonyContent>('ceremonies-page', locale, seed.ceremonyContent, [], ({ intro, films, gallery, ...rest }) => ({
    ...rest,
    intro: intro ? { eyebrow: intro.eyebrow, heading: intro.heading, body: intro.body } : undefined,
    stats: intro?.stats,
    films: films ? { ...films, items: toVideoItems(films.items, 'ceremony-film') } : undefined,
    gallery: gallery
      ? {
          ...gallery,
          images: Array.isArray(gallery.images)
            ? gallery.images.filter((row: { image?: MediaItem | null }) => row.image?.sourceUrl)
            : undefined,
        }
      : undefined,
  }));
}

/* -------------------------------------------------------------------------- */
/* Videos and podcasts                                                        */
/* -------------------------------------------------------------------------- */

/** The whole gallery in one read: filtering and paging happen in the page. */
export async function getGalleryVideos(locale: Locale = DEFAULT_LOCALE): Promise<GalleryVideo[]> {
  const { data } = await read(['videos', locale], [TAGS.videos], seed.galleryVideos, async (payload) => {
    const docs = await find(payload, 'videos', locale, { depth: 1, sort: '-createdAt' });
    const out = docs
      .map(
        (doc): GalleryVideo => ({
          id: id(doc),
          slug: str(doc.slug) || id(doc),
          title: str(doc.title),
          credit: str(doc.credit) || null,
          video: str(doc.video),
          poster: toMedia(doc.poster),
          description: str(doc.description) || null,
          categories: ((doc.categories as unknown[]) ?? [])
            .filter((term): term is Record<string, unknown> => Boolean(term && typeof term === 'object'))
            .map((term) => ({ name: str(term.name), slug: str(term.slug) })),
        }),
      )
      .filter((film) => film.video !== '');
    return out.length ? out : null;
  });

  return data;
}

export async function getPodcasts(locale: Locale = DEFAULT_LOCALE): Promise<Podcast[]> {
  const { data } = await read(['podcasts', locale], [TAGS.podcasts], seed.podcasts, async (payload) => {
    const docs = await find(payload, 'podcasts', locale, { depth: 1, sort: 'order' });
    const out = docs.map(
      (doc): Podcast => ({
        id: id(doc),
        slug: str(doc.slug) || id(doc),
        title: str(doc.title),
        subtitle: str(doc.subtitle) || null,
        description: toHTML(doc.description) || null,
        cover: toMedia(doc.cover),
        channelUrl: str(doc.channelUrl) || null,
        channelLabel: str(doc.channelLabel) || null,
        layout: doc.layout === 'stacked' ? 'stacked' : 'sidebar',
        search: doc.search !== false,
        autoplayNext: doc.autoplayNext !== false,
        episodes: ((doc.episodes as Record<string, unknown>[]) ?? [])
          .map(
            (row, index): Episode => ({
              id: String(row.id ?? index),
              title: str(row.title),
              source: row.source === 'audio' ? 'audio' : row.source === 'video' ? 'video' : 'youtube',
              url: str(row.url),
              thumb: str(row.thumb) || null,
              date: str(row.date) || null,
              duration: str(row.duration) || null,
              description: str(row.description) || null,
            }),
          )
          .filter((episode) => episode.title && episode.url),
      }),
    );
    return out.length ? out : null;
  });

  return data;
}

/* -------------------------------------------------------------------------- */
/* Counters                                                                   */
/* -------------------------------------------------------------------------- */

function toStats(rows: unknown) {
  if (!Array.isArray(rows)) return [];

  return rows
    .map((row: Record<string, unknown>) => ({
      icon: str(row.icon) || null,
      prefix: str(row.prefix) || null,
      number: str(row.number),
      suffix: str(row.suffix) || null,
      label: str(row.label),
    }))
    .filter((row) => row.number || row.label);
}

/* -------------------------------------------------------------------------- */
/* Forms                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * One form, by slug, with choices resolved — a select fed by the partners or
 * programmes on this site is filled here, and a programme select narrows to
 * the institution chosen above it.
 *
 * Falls back to the seeded definition of the same slug, so the contact page
 * and the enquiry button work before the CMS is populated.
 */
export async function getForm(slug: string, locale: Locale = DEFAULT_LOCALE): Promise<FormDefinition | null> {
  const fallback = seed.forms.find((form) => form.slug === slug) ?? null;

  const { data } = await read(['form', slug, locale], [TAGS.forms, TAGS.partners, TAGS.programs, `form:${slug}`], fallback, async (payload) => {
    const [doc] = await find(payload, 'forms', locale, { where: { slug: { equals: slug } }, depth: 0, limit: 1 });
    if (!doc) return null;

    const needs = new Set(((doc.fields as Record<string, unknown>[]) ?? []).map((field) => field.choicesSource));
    const partners = needs.has('partners') || needs.has('programs') ? await getPartners(locale) : [];
    const programs = needs.has('programs') ? await getPrograms(locale) : [];
    const partnerField = ((doc.fields as Record<string, unknown>[]) ?? []).find((field) => field.choicesSource === 'partners');

    const fields = ((doc.fields as Record<string, any>[]) ?? [])
      .map((raw, index): FormField | null => {
        const name = str(raw.name);
        if (!name) return null;

        let choices: FormChoice[] = lines(raw.choices).map((value) => ({ value, group: '' }));
        let filterBy: string | null = null;
        if (raw.choicesSource === 'partners') {
          choices = partners.map((partner) => ({ value: partner.name, group: '' }));
        } else if (raw.choicesSource === 'programs') {
          choices = programs.map((program) => ({ value: program.title, group: program.partner?.name ?? '' }));
          filterBy = partnerField ? str(partnerField.name) : null;
        }

        const conditionField = str(raw.condition?.field);

        return {
          label: str(raw.label) || `Field ${index + 1}`,
          name,
          type: FIELD_TYPES.find((candidate) => candidate === raw.type) ?? 'text',
          required: Boolean(raw.required),
          choices,
          placeholder: str(raw.placeholder),
          width: raw.width === 'half' ? 'half' : 'full',
          condition: conditionField
            ? {
                field: conditionField,
                operator: CONDITION_OPERATORS.find((candidate) => candidate === raw.condition?.operator) ?? 'is',
                value: String(raw.condition?.value ?? ''),
              }
            : null,
          filterBy,
        };
      })
      .filter((field): field is FormField => field !== null);

    if (!fields.length) return null;

    return {
      slug: str(doc.slug) || slug,
      title: str(doc.title) || fallback?.title || '',
      intro: str(doc.intro),
      fields,
      submitLabel: str(doc.submitLabel) || translate(locale, 'form.submit'),
      consent: str(doc.consent),
      successMessage: str(doc.successMessage) || fallback?.successMessage || translate(locale, 'form.thanks'),
      redirectUri: str(doc.redirectUri),
    };
  });

  return data;
}

/** The parts of a form only the server needs: where its submissions go. */
export async function getFormDelivery(slug: string): Promise<{ id: string | number; notify: string[]; webhookUrl: string } | null> {
  const payload = await client();
  if (!payload) return null;

  const result = await payload.find({ collection: 'forms', where: { slug: { equals: slug } }, depth: 0, limit: 1 });
  const doc = result.docs[0] as unknown as Record<string, unknown> | undefined;
  if (!doc) return null;

  return {
    id: doc.id as string | number,
    notify: Array.isArray(doc.notify) ? (doc.notify as string[]).filter(Boolean) : [],
    webhookUrl: str(doc.webhookUrl),
  };
}

/** The Payload instance, for the few server paths that write (form submissions). */
export async function payloadClient(): Promise<Payload | null> {
  return client();
}
