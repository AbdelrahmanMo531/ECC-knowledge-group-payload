import { BreadcrumbSchema } from '@/components/seo/StructuredData';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { Pagination } from '@/components/ui/Pagination';
import { PostCard } from '@/components/ui/PostCard';
import type { Post } from '@/lib/cms/types';
import { localePath, type Locale } from '@/lib/i18n/config';
import { t } from '@/lib/i18n/server';
import { paginate } from '@/lib/pagination';
import { POSTS_PER_PAGE } from '@/lib/posts';

/**
 * A page of articles — the blog, or one category of it.
 *
 * Paged as `/blog/`, `/blog/page/2/`…, the shape WordPress used, so page two
 * is a real, crawlable URL rather than a query string.
 */
export function BlogIndex({
  posts,
  page,
  base,
  locale,
  title,
  description,
}: {
  posts: Post[];
  page: number;
  /** The listing's first page, written the way English serves it: `/blog`. */
  base: string;
  locale: Locale;
  title: string;
  description?: string;
}) {
  const current = paginate(posts, page, POSTS_PER_PAGE);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: t('crumb.home'), path: localePath(locale, '/') },
          { name: title, path: localePath(locale, base) },
        ]}
      />
      <PageHeader eyebrow={t('page.insights.eyebrow')} title={title} description={description} />

      <section className="bg-white py-16 lg:py-24">
        <Container size="wide">
          {current.items.length === 0 ? (
            <div className="rounded-[var(--radius-brand)] border border-dashed border-brand-sand bg-brand-beige/40 p-12 text-center">
              <h2 className="text-lg font-bold text-brand-teal">{t('empty.insights')}</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-brand-ink/65">
                {t('empty.insights.body')}
              </p>
            </div>
          ) : (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {current.items.map((post) => (
                <li key={post.id}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}

          <Pagination
            current={current.current}
            total={current.total}
            href={(n) => (n <= 1 ? base : `${base}/page/${n}`)}
          />
        </Container>
      </section>
    </>
  );
}
