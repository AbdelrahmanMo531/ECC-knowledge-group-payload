import type { Metadata } from 'next';

import { BlogIndex } from '@/components/blog/BlogIndex';
import { listing, listingMetadata } from '@/lib/blog-routes';
import { format } from '@/lib/i18n/dictionary';
import { setRequestLocale, t } from '@/lib/i18n/server';

/** A WordPress-style category archive, `/category/<slug>/`. */
type Params = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  return listingMetadata(locale, 1, decodeURIComponent(slug));
}

export default async function CategoryPage({ params }: Params) {
  const { locale: requested, slug } = await params;
  const locale = await setRequestLocale(requested);
  const category = decodeURIComponent(slug);
  const { posts, term } = await listing(locale, 1, category);

  return (
    <BlogIndex
      posts={posts}
      page={1}
      base={`/category/${category}`}
      locale={locale}
      title={format(t('blog.category'), { name: term?.name ?? category })}
      description={term?.description}
    />
  );
}
