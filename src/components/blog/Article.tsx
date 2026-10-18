import Image from 'next/image';

import { ArticleSchema, BreadcrumbSchema } from '@/components/seo/StructuredData';
import { Arrow } from '@/components/ui/Arrow';
import { Container } from '@/components/ui/Container';
import { Link } from '@/components/ui/Link';
import type { Post, SiteSettings } from '@/lib/cms/types';
import { LOCALE_META, localePath } from '@/lib/i18n/config';
import { translate } from '@/lib/i18n/dictionary';
import { postHref } from '@/lib/posts';

/**
 * One article.
 *
 * Rendered in the article's own language and direction, whatever the route
 * resolved to: an Arabic article with a Latin slug is served from the English
 * tree (it lives at the root, as it did in WordPress), and still reads right
 * to left.
 */
export function Article({ post, settings }: { post: Post; settings: SiteSettings }) {
  const language = post.language;
  const published = new Date(post.date);
  const blog = localePath(language, '/blog');

  return (
    <article lang={LOCALE_META[language].tag} dir={LOCALE_META[language].dir}>
      <ArticleSchema post={post} settings={settings} />
      <BreadcrumbSchema
        items={[
          { name: translate(language, 'crumb.home'), path: localePath(language, '/') },
          { name: translate(language, 'page.insights.eyebrow'), path: blog },
          { name: post.title, path: postHref(post) },
        ]}
      />

      <header className="bg-brand-beige">
        <Container size="narrow">
          <div className="py-14 lg:py-20">
            <Link
              href={blog}
              exact
              className="text-sm text-brand-turquoise transition-colors hover:text-brand-teal"
            >
              <Arrow back /> {translate(language, 'cta.insights.all')}
            </Link>

            <div className="mt-7 flex flex-wrap items-center gap-3 text-xs text-brand-ink/55">
              {post.categories[0] ? (
                <Link
                  href={localePath(language, `/category/${post.categorySlugs?.[0] ?? ''}`)}
                  exact
                  className="rounded-full bg-brand-teal/10 px-3 py-1 font-medium text-brand-teal"
                >
                  {post.categories[0]}
                </Link>
              ) : null}
              {!Number.isNaN(published.getTime()) ? (
                <time dateTime={post.date}>
                  {published.toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
              ) : null}
              {post.author?.name ? <span>· {post.author.name}</span> : null}
            </div>

            <h1 className="mt-4 text-3xl font-bold leading-[1.12] tracking-[-0.02em] text-brand-teal sm:text-4xl">
              {post.title}
            </h1>

            <span aria-hidden className="mt-6 block h-px w-16 bg-brand-gold" />
          </div>
        </Container>
      </header>

      {post.featuredImage?.sourceUrl ? (
        <Container size="wide">
          <Image
            src={post.featuredImage.sourceUrl}
            alt={post.featuredImage.altText || post.title}
            width={post.featuredImage.mediaDetails?.width ?? 1600}
            height={post.featuredImage.mediaDetails?.height ?? 900}
            className="mt-10 w-full rounded-[var(--radius-brand)] object-cover"
            sizes="(min-width: 1280px) 1200px, 100vw"
            priority
          />
        </Container>
      ) : null}

      <Container size="narrow">
        <div
          className="prose-ecc py-14 lg:py-20"
          // Rich text from the CMS, rendered to HTML on the server.
          dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
        />
      </Container>
    </article>
  );
}
