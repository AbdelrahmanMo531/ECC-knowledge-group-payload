import type { Metadata } from 'next';

import { BlogIndex } from '@/components/blog/BlogIndex';
import { listing, listingMetadata } from '@/lib/blog-routes';
import { setRequestLocale, t } from '@/lib/i18n/server';

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  return listingMetadata(locale, 1);
}

export default async function BlogPage({ params }: Params) {
  const locale = await setRequestLocale((await params).locale);
  const { posts } = await listing(locale, 1);

  return (
    <BlogIndex
      posts={posts}
      page={1}
      base="/blog"
      locale={locale}
      title={t('page.insights.title')}
      description={t('page.insights.body')}
    />
  );
}
