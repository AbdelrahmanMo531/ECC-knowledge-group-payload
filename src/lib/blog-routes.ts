import 'server-only';

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getCategory, getPosts } from '@/lib/cms/api';
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/lib/i18n/config';
import { format, translate } from '@/lib/i18n/dictionary';
import { POSTS_PER_PAGE } from '@/lib/posts';
import { buildMetadata } from '@/lib/seo';

/**
 * What the blog's routes share: `/blog/`, `/blog/page/<n>/` and the same two
 * for each `/category/<slug>/`.
 */

export function pageNumber(value: string | undefined): number {
  const n = Number(value ?? 1);
  return Number.isInteger(n) && n >= 1 ? n : NaN;
}

/** The articles on a listing, or a 404 for a page past the end. */
export async function listing(locale: Locale, page: number, category?: string) {
  if (Number.isNaN(page)) notFound();

  const [posts, term] = await Promise.all([
    getPosts(locale, { category }),
    category ? getCategory(category, locale) : Promise.resolve(null),
  ]);

  if (category && !term) notFound();

  const pages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  // Page 1 lives at the listing's own address; `/page/1/` would duplicate it.
  if (page > pages) notFound();

  return { posts, term };
}

export async function listingMetadata(requested: string, page: number, category?: string): Promise<Metadata> {
  const locale = isLocale(requested) ? requested : DEFAULT_LOCALE;
  const term = category ? await getCategory(category, locale) : null;
  const base = category ? `/category/${category}` : '/blog';
  const title = term ? format(translate(locale, 'blog.category'), { name: term.name }) : translate(locale, 'meta.insights.title');
  const suffix = page > 1 ? ` — ${format(translate(locale, 'blog.page'), { n: page })}` : '';

  return buildMetadata({
    title: `${title}${suffix}`,
    description: term?.description || translate(locale, 'meta.insights'),
    path: page > 1 ? `${base}/page/${page}` : base,
    locale,
    seo: page > 1 ? null : term?.seo,
  });
}
