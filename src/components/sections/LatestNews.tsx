import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { surfaceClass, type Surface } from '@/components/ui/surface';
import { PostCard } from '@/components/ui/PostCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { Post } from '@/lib/cms/types';
import { t } from '@/lib/i18n/server';

/** Hidden until posts exist, so the homepage never shows an empty shelf. */
export function LatestNews({
  posts,
  surface,
}: {
  posts: Post[];
  surface?: Surface;
}) {
  if (posts.length === 0) return null;

  return (
    <section className={`py-20 lg:py-28 ${surfaceClass(surface)}`}>
      <Container size="wide">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow={t('page.insights.eyebrow')}
            title={t('section.news.title')}
            description={t('section.news.body')}
          />
          <Button href="/blog" variant="secondary" className="shrink-0">
            {t('cta.insights.all')}
          </Button>
        </div>

        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <li key={post.id}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
