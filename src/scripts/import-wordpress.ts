/**
 * Imports the live WordPress site's articles into Payload, keeping every URL.
 *
 *     WORDPRESS_URL=https://ecc-group.ae npm run import:wordpress
 *
 * Reads the public REST API (`/wp-json/wp/v2`), so it needs no credentials.
 * For each published post it creates an Article with:
 *
 *   - the same slug, decoded (Arabic stays Arabic)
 *   - its language (Polylang's `lang` when exposed, otherwise read from the
 *     script the title is written in)
 *   - the old address as Legacy path whenever it was not `/<slug>/` — so
 *     `/blogs/<slug>/`, `/arabic-blogs/<slug>/` keep answering exactly there
 *   - publish and modified dates, excerpt, categories
 *   - the body converted to rich text, with its images uploaded to Media and
 *     links to the old domain made relative
 *   - the featured image
 *   - with RANKMATH=true, the SEO title, description, canonical and robots
 *     Rank Math rendered for the page (needs Rank Math's "Headless CMS
 *     Support" switched on)
 *
 * Options (environment variables):
 *
 *   WORDPRESS_URL     the site to read, e.g. https://ecc-group.ae (required)
 *   IMPORT_MEDIA      "false" to skip downloading images (default true)
 *   IMPORT_PAGES      "true" to import WordPress pages as Pages too
 *   RANKMATH          "true" to read Rank Math's SEO values per URL
 *   UPDATE_EXISTING   "true" to overwrite articles that already exist
 *   LIMIT             stop after this many posts (for a trial run)
 *
 * Re-running is safe: an article whose slug exists is skipped unless
 * UPDATE_EXISTING is set.
 */
import config from '@payload-config';
import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical';
import { JSDOM } from 'jsdom';
import { getPayload, type Payload } from 'payload';

import { isArabicSegment } from '@/lib/i18n/config';
import { normalisePath, RESERVED_SEGMENTS } from '@/payload/fields/permalink';

const BASE = (process.env.WORDPRESS_URL ?? '').replace(/\/+$/, '');
if (!BASE) {
  console.error('Set WORDPRESS_URL, e.g. WORDPRESS_URL=https://ecc-group.ae npm run import:wordpress');
  process.exit(1);
}

const IMPORT_MEDIA = process.env.IMPORT_MEDIA !== 'false';
const IMPORT_PAGES = process.env.IMPORT_PAGES === 'true';
const RANKMATH = process.env.RANKMATH === 'true';
const UPDATE = process.env.UPDATE_EXISTING === 'true';
const LIMIT = Number(process.env.LIMIT || Infinity);
const ORIGIN = new URL(BASE).origin;

const payload: Payload = await getPayload({ config });
const editorConfig = await editorConfigFactory.default({ config: payload.config });
const context = { disableRevalidate: true };

type WPRendered = { rendered: string };
type WPPost = {
  id: number;
  date_gmt: string;
  modified_gmt: string;
  slug: string;
  link: string;
  status: string;
  title: WPRendered;
  excerpt: WPRendered;
  content: WPRendered;
  categories?: number[];
  lang?: string;
  featured_media?: number;
  _embedded?: {
    'wp:featuredmedia'?: { source_url?: string; alt_text?: string; media_details?: unknown }[];
    author?: { name?: string }[];
  };
};
type WPTerm = { id: number; name: string; slug: string; description: string };

/* ---------------------------------------------------------------- helpers */

async function getJSON<T>(path: string): Promise<{ data: T; totalPages: number }> {
  const response = await fetch(`${BASE}/wp-json${path}`, { headers: { accept: 'application/json' } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${path}`);
  return { data: (await response.json()) as T, totalPages: Number(response.headers.get('x-wp-totalpages') ?? 1) };
}

async function all<T>(path: string): Promise<T[]> {
  const out: T[] = [];
  for (let page = 1; ; page++) {
    const separator = path.includes('?') ? '&' : '?';
    const { data, totalPages } = await getJSON<T[]>(`${path}${separator}per_page=100&page=${page}`);
    out.push(...data);
    if (page >= totalPages || !data.length) break;
  }
  return out;
}

const decode = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

/** HTML entities and tags out of a rendered WordPress string. */
function text(html: string): string {
  const { window } = new JSDOM(`<body>${html}</body>`);
  return (window.document.body.textContent ?? '').replace(/\s+/g, ' ').trim();
}

/** Uploads a remote image once per run; returns its Media id. */
const uploaded = new Map<string, number | string>();

async function uploadImage(src: string, alt: string): Promise<number | string | null> {
  if (!IMPORT_MEDIA) return null;

  const url = new URL(src, BASE).toString();
  if (uploaded.has(url)) return uploaded.get(url)!;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${response.status}`);
    const data = Buffer.from(await response.arrayBuffer());
    const mimetype = response.headers.get('content-type')?.split(';')[0] ?? 'image/jpeg';
    const name = decode(new URL(url).pathname.split('/').pop() || 'image.jpg');

    const existing = await payload.find({ collection: 'media', where: { filename: { equals: name } }, limit: 1, depth: 0 });
    const doc = existing.docs[0]
      ? existing.docs[0]
      : await payload.create({ collection: 'media', data: { alt }, file: { data, mimetype, name, size: data.length }, context });

    uploaded.set(url, doc.id);
    return doc.id;
  } catch (error) {
    payload.logger.warn(`  could not import image ${url}: ${(error as Error).message}`);
    return null;
  }
}

/**
 * The post body as rich text: images uploaded and pointed at their Media
 * documents, links to the old site made relative so they follow the domain.
 */
async function toRichText(html: string) {
  const { window } = new JSDOM(`<body>${html}</body>`);
  const document = window.document;

  for (const img of [...document.querySelectorAll('img')]) {
    const src = img.getAttribute('data-src') || img.getAttribute('src');
    const id = src ? await uploadImage(src, img.getAttribute('alt') ?? '') : null;
    if (id) {
      img.setAttribute('data-lexical-upload-id', String(id));
      img.setAttribute('data-lexical-upload-relation-to', 'media');
    } else {
      img.remove();
    }
  }

  for (const anchor of [...document.querySelectorAll('a[href]')]) {
    const href = anchor.getAttribute('href') ?? '';
    if (href.startsWith(ORIGIN) && !/\/wp-content\//.test(href)) {
      const url = new URL(href);
      anchor.setAttribute('href', `${url.pathname}${url.search}${url.hash}`);
    }
  }

  // Shortcodes and page-builder leftovers render as literal text.
  const body = document.body.innerHTML.replace(/\[(?:\/)?[a-z_]+[^\]]*\]/gi, '');

  const state = convertHTMLToLexical({ editorConfig, html: body, JSDOM });

  // The converter reads upload ids from an attribute, so they arrive as
  // strings; Postgres ids are numbers.
  const coerce = (node: { type?: string; value?: unknown; children?: unknown[] }) => {
    if (node.type === 'upload' && typeof node.value === 'string' && /^\d+$/.test(node.value)) node.value = Number(node.value);
    for (const child of node.children ?? []) coerce(child as typeof node);
  };
  coerce(state.root as never);

  return state;
}

/** What Rank Math put in the page's <head>, when headless support is on. */
async function rankMath(link: string) {
  if (!RANKMATH) return {};

  try {
    const { data } = await getJSON<{ success?: boolean; head?: string }>(`/rankmath/v1/getHead?url=${encodeURIComponent(link)}`);
    if (!data.head) return {};

    const { window } = new JSDOM(`<head>${data.head}</head>`);
    const head = window.document.head;
    const meta = (selector: string) => head.querySelector(selector)?.getAttribute('content')?.trim() || null;
    const canonical = head.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null;
    const robots = (meta('meta[name="robots"]') ?? '')
      .split(',')
      .map((token) => token.trim())
      .filter((token) => ['noindex', 'nofollow', 'noarchive', 'nosnippet', 'noimageindex'].includes(token));

    return {
      title: head.querySelector('title')?.textContent?.trim() || null,
      description: meta('meta[name="description"]'),
      // Only an override that points somewhere else is worth keeping; a
      // canonical to the page itself is the default anyway.
      canonicalUrl: canonical && normalisePath(canonical) !== normalisePath(link) ? canonical : null,
      robots: robots.length ? robots : null,
    };
  } catch (error) {
    payload.logger.warn(`  Rank Math head unavailable for ${link}: ${(error as Error).message}`);
    return {};
  }
}

const languageOf = (post: { lang?: string; title: WPRendered; slug: string }): 'ar' | 'en' =>
  post.lang === 'ar' || post.lang === 'en'
    ? post.lang
    : isArabicSegment(decode(post.slug)) || /[؀-ۿ]/.test(post.title.rendered)
      ? 'ar'
      : 'en';

/* ------------------------------------------------------------- categories */

payload.logger.info(`Reading ${BASE} …`);

const categoryIds = new Map<number, number | string>();
for (const term of await all<WPTerm>('/wp/v2/categories?hide_empty=true')) {
  const slug = decode(term.slug);
  const found = await payload.find({ collection: 'categories', where: { slug: { equals: slug } }, limit: 1, depth: 0 });
  const doc =
    found.docs[0] ??
    (await payload.create({
      collection: 'categories',
      locale: isArabicSegment(slug) || /[؀-ۿ]/.test(term.name) ? 'ar' : 'en',
      data: { name: text(term.name), slug, description: text(term.description) },
      context,
    }));
  categoryIds.set(term.id, doc.id);
}
payload.logger.info(`✓ ${categoryIds.size} categories`);

/* ------------------------------------------------------------------ posts */

const posts = await all<WPPost>('/wp/v2/posts?_embed=wp:featuredmedia,author');
const report: { slug: string; path: string; status: string }[] = [];
let count = 0;

for (const post of posts) {
  if (count >= LIMIT) break;
  count++;

  const slug = decode(post.slug);
  const linkPath = normalisePath(post.link);
  const legacyPath = linkPath && linkPath !== `/${slug}` ? linkPath : null;

  const existing = await payload.find({ collection: 'posts', where: { slug: { equals: slug } }, limit: 1, depth: 0, draft: true });
  if (existing.docs[0] && !UPDATE) {
    report.push({ slug, path: legacyPath ?? `/${slug}`, status: 'exists' });
    continue;
  }

  try {
    const featured = post._embedded?.['wp:featuredmedia']?.[0];
    const featuredImage = featured?.source_url ? await uploadImage(featured.source_url, featured.alt_text ?? '') : null;
    const seo = await rankMath(post.link);

    const data = {
      title: text(post.title.rendered),
      slug,
      language: languageOf(post),
      legacyPath,
      publishedAt: `${post.date_gmt}Z`,
      excerpt: text(post.excerpt.rendered),
      content: await toRichText(post.content.rendered),
      featuredImage,
      categories: (post.categories ?? []).map((id) => categoryIds.get(id)).filter(Boolean),
      authorName: post._embedded?.author?.[0]?.name ?? null,
      meta: { ...seo, image: featuredImage },
      _status: 'published',
    };

    if (existing.docs[0]) {
      await payload.update({ collection: 'posts', id: existing.docs[0].id, data: data as never, context });
    } else {
      await payload.create({ collection: 'posts', data: data as never, context });
    }

    report.push({ slug, path: legacyPath ?? `/${slug}`, status: existing.docs[0] ? 'updated' : 'created' });
    payload.logger.info(`✓ ${legacyPath ?? `/${slug}`}`);
  } catch (error) {
    report.push({ slug, path: legacyPath ?? `/${slug}`, status: `failed: ${(error as Error).message}` });
    payload.logger.error(`✗ ${slug}: ${(error as Error).message}`);
  }
}

/* ------------------------------------------------------------------ pages */

if (IMPORT_PAGES) {
  for (const page of await all<WPPost>('/wp/v2/pages?_embed=wp:featuredmedia')) {
    const slug = decode(page.slug);
    const path = normalisePath(page.link);

    // The app builds these itself; their copy lives in the page Globals.
    if (RESERVED_SEGMENTS.has(slug) || path.split('/').filter(Boolean).length !== 1) {
      report.push({ slug, path, status: 'skipped (app route or nested — add a redirect if it moved)' });
      continue;
    }

    const language = languageOf(page);
    const found = await payload.find({ collection: 'pages', locale: language, where: { slug: { equals: slug } }, limit: 1, draft: true });
    if (found.docs[0] && !UPDATE) {
      report.push({ slug, path, status: 'exists' });
      continue;
    }

    const featured = page._embedded?.['wp:featuredmedia']?.[0];
    const data = {
      title: text(page.title.rendered),
      slug,
      content: await toRichText(page.content.rendered),
      featuredImage: featured?.source_url ? await uploadImage(featured.source_url, featured.alt_text ?? '') : null,
      meta: await rankMath(page.link),
      _status: 'published',
    };

    try {
      if (found.docs[0]) await payload.update({ collection: 'pages', id: found.docs[0].id, locale: language, data: data as never, context });
      else await payload.create({ collection: 'pages', locale: language, data: data as never, context });
      report.push({ slug, path, status: 'page imported' });
    } catch (error) {
      report.push({ slug, path, status: `page failed: ${(error as Error).message}` });
    }
  }
}

/* ----------------------------------------------------------------- report */

const failed = report.filter((row) => row.status.includes('failed'));
payload.logger.info(
  `Done: ${report.filter((row) => row.status === 'created').length} created, ` +
    `${report.filter((row) => row.status === 'updated').length} updated, ` +
    `${report.filter((row) => row.status === 'exists').length} already there, ${failed.length} failed.`,
);
for (const row of failed) payload.logger.error(`  ${row.path}: ${row.status}`);

process.exit(failed.length ? 1 : 0);
