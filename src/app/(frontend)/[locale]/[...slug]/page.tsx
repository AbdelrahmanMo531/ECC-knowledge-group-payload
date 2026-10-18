import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound, permanentRedirect } from 'next/navigation';

import { Article } from '@/components/blog/Article';
import { BreadcrumbSchema } from '@/components/seo/StructuredData';
import { CallToAction } from '@/components/sections/CallToAction';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { getPageBySlug, getPageUris, getPostByPath, getSiteSettings } from '@/lib/cms/api';
import { redirectIfMoved } from '@/lib/redirects';
import {
  DEFAULT_LOCALE,
  encodePath,
  isArabicSegment,
  isLocale,
  localePath,
  translatedPaths,
  type Locale,
} from '@/lib/i18n/config';
import { translate } from '@/lib/i18n/dictionary';
import { setRequestLocale } from '@/lib/i18n/server';
import { postHref } from '@/lib/posts';
import { buildMetadata } from '@/lib/seo';

/**
 * Every address the app does not define itself.
 *
 * In order, a path is:
 *
 *   1. an article — at `/<slug>/`, where WordPress's `/%postname%/` permalinks
 *      put it, or at the legacy path it was published under (`/blogs/…`);
 *   2. a page an editor published in the CMS, at `/<slug>/`;
 *   3. an old address with a redirect set up under SEO → Redirects;
 *   4. a 404.
 */

type Params = { params: Promise<{ locale: string; slug: string[] }> };

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  const locale = isLocale(params.locale) ? params.locale : DEFAULT_LOCALE;
  const uris = await getPageUris(locale);
  return uris.map((slug) => ({ slug }));
}

/** Anything published after a build renders on first request. */
export const dynamicParams = true;

const pathOf = (segments: string[]) =>
  `/${segments.map((segment) => safeDecode(segment)).join('/')}`;

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

async function resolve(locale: Locale, segments: string[]) {
  const path = pathOf(segments);
  const post = await getPostByPath(path);
  if (post) return { post, page: null, path };

  const page = segments.length === 1 ? await getPageBySlug(safeDecode(segments[0]), locale) : null;
  return { post: null, page, path };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: requested, slug } = await params;
  const locale = isLocale(requested) ? requested : DEFAULT_LOCALE;
  const { post, page, path } = await resolve(locale, slug);

  if (post) {
    const languages = post.translations?.length
      ? Object.fromEntries([
          [post.language, post.path],
          ...post.translations.map((translation) => [translation.locale, translation.path ?? `/${translation.slug}`]),
        ])
      : null;

    return buildMetadata({
      title: post.title,
      description: post.excerpt,
      // Articles keep their root address in either language.
      path: post.path,
      locale: post.language === 'ar' ? 'ar' : DEFAULT_LOCALE,
      languages,
      type: 'article',
      seo: post.seo,
    });
  }

  if (page) {
    return buildMetadata({
      title: page.title,
      path,
      locale,
      languages: translatedPaths(locale, path, page.translations),
      translated: page.translated,
      seo: page.seo,
    });
  }

  return buildMetadata({ title: translate(locale, 'notfound.page'), locale, robots: ['noindex'] });
}

export default async function CatchAllPage({ params }: Params) {
  const { locale: requested, slug } = await params;
  const locale = await setRequestLocale(requested);
  const [{ post, page, path }, settings] = await Promise.all([resolve(locale, slug), getSiteSettings(locale)]);

  if (post) {
    // One article, one URL. Reached any other way — `/ar/<latin-slug>/`, an
    // old category permalink, its bare slug when it lives at a legacy path —
    // it is sent to the address it lives at. (An Arabic-script first segment
    // is served from the root and rewritten here by the proxy, so the prefix
    // alone does not count against it.)
    const viaPrefix = locale !== DEFAULT_LOCALE && !isArabicSegment(slug[0]);
    if (viaPrefix || path !== post.path) permanentRedirect(encodePath(postHref(post)));

    return (
      <>
        <Article post={post} settings={settings} />
        <CallToAction settings={settings} />
      </>
    );
  }

  if (!page) {
    await redirectIfMoved(localePath(locale, path));
    notFound();
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: translate(locale, 'crumb.home'), path: localePath(locale, '/') },
          { name: page.title, path: localePath(locale, path) },
        ]}
      />
      <PageHeader title={page.title} />

      {page.featuredImage?.sourceUrl ? (
        <Container size="wide">
          <Image
            src={page.featuredImage.sourceUrl}
            alt={page.featuredImage.altText || page.title}
            width={page.featuredImage.mediaDetails?.width ?? 1600}
            height={page.featuredImage.mediaDetails?.height ?? 900}
            className="mt-10 w-full rounded-[var(--radius-brand)] object-cover"
            sizes="(min-width: 1280px) 1200px, 100vw"
            priority
          />
        </Container>
      ) : null}

      <section className="bg-white py-14 lg:py-20">
        <Container size="narrow">
          <div
            className="prose-ecc"
            // Rich text from the CMS, rendered to HTML on the server.
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </Container>
      </section>

      <CallToAction settings={settings} />
    </>
  );
}
