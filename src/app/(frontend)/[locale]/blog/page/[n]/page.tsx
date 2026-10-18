import type { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';

import { BlogIndex } from '@/components/blog/BlogIndex';
import { listing, listingMetadata, pageNumber } from '@/lib/blog-routes';
import { localePath } from '@/lib/i18n/config';
import { setRequestLocale, t } from '@/lib/i18n/server';

type Params = { params: Promise<{ locale: string; n: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, n } = await params;
  return listingMetadata(locale, pageNumber(n));
}

export default async function BlogPageN({ params }: Params) {
  const { locale: requested, n } = await params;
  const locale = await setRequestLocale(requested);
  const page = pageNumber(n);
  if (page === 1) permanentRedirect(localePath(locale, '/blog'));

  const { posts } = await listing(locale, page);

  return (
    <BlogIndex
      posts={posts}
      page={page}
      base="/blog"
      locale={locale}
      title={t('page.insights.title')}
      description={t('page.insights.body')}
    />
  );
}
