import type { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';

import { BlogIndex } from '@/components/blog/BlogIndex';
import { listing, listingMetadata, pageNumber } from '@/lib/blog-routes';
import { encodePath, localePath } from '@/lib/i18n/config';
import { format } from '@/lib/i18n/dictionary';
import { setRequestLocale, t } from '@/lib/i18n/server';

type Params = { params: Promise<{ locale: string; slug: string; n: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug, n } = await params;
  return listingMetadata(locale, pageNumber(n), decodeURIComponent(slug));
}

export default async function CategoryPageN({ params }: Params) {
  const { locale: requested, slug, n } = await params;
  const locale = await setRequestLocale(requested);
  const category = decodeURIComponent(slug);
  const page = pageNumber(n);
  if (page === 1) permanentRedirect(encodePath(localePath(locale, `/category/${category}`)));

  const { posts, term } = await listing(locale, page, category);

  return (
    <BlogIndex
      posts={posts}
      page={page}
      base={`/category/${category}`}
      locale={locale}
      title={format(t('blog.category'), { name: term?.name ?? category })}
      description={term?.description}
    />
  );
}
