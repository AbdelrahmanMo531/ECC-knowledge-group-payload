import type { Metadata } from 'next';

import { CallToAction } from '@/components/sections/CallToAction';
import { GalleryBrowser } from '@/components/video/GalleryBrowser';
import { Container } from '@/components/ui/Container';
import { Link } from '@/components/ui/Link';
import { PageHeader } from '@/components/ui/PageHeader';
import { Pagination } from '@/components/ui/Pagination';
import { DEFAULT_PER_PAGE, paginate } from '@/lib/pagination';
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/lib/i18n/config';
import { setRequestLocale, t } from '@/lib/i18n/server';
import { buildMetadata } from '@/lib/seo';
import { parseVideo, videoThumbnail } from '@/lib/video';
import {
  categoriesOf,
  filterByCategory,
  galleryHref,
  isKnownCategory,
  playable,
} from '@/lib/videos';
import { getGalleryContent, getGalleryVideos, getSiteSettings } from '@/lib/cms/api';
import type { GalleryVideo } from '@/lib/cms/types';

type Params = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; category?: string; video?: string }>;
};

/**
 * What the visitor asked for, resolved against what exists.
 *
 * An unknown category or a page past the end is shown as the gallery rather
 * than as an error: a stale bookmark, a renamed category or a link shared
 * after a video was unpublished should still land somewhere useful.
 */
async function resolve(
  query: Awaited<Params['searchParams']>,
  locale: Locale,
) {
  const [{ content, seo, translated }, videos] = await Promise.all([
    getGalleryContent(locale),
    getGalleryVideos(locale),
  ]);

  const films = playable(videos);
  const categories = categoriesOf(films);

  const category =
    query.category && isKnownCategory(films, query.category)
      ? query.category
      : '';

  const matching = filterByCategory(films, category);
  const page = paginate(
    matching,
    Number(query.page) || 1,
    content.perPage || DEFAULT_PER_PAGE,
  );

  // A shared link names a film; it opens only if it is on the page being
  // shown, which is what the link it came from encoded. A hand-edited URL
  // naming a film that is not on this page opens nothing — and, because the
  // metadata below reads the same answer, does not promise one either. A
  // preview showing a film the page will not play is worse than no preview.
  const at = query.video
    ? page.items.findIndex((film) => film.slug === query.video)
    : -1;

  const openAt = at >= 0 ? at : null;

  return {
    content,
    seo,
    translated,
    categories,
    category,
    page,
    openAt,
    shared: openAt === null ? undefined : page.items[openAt],
  };
}

export async function generateMetadata({ params, searchParams }: Params): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = isLocale(requested) ? requested : DEFAULT_LOCALE;

  const query = await searchParams;
  const { content, seo, categories, category, shared, translated } =
    await resolve(query, locale);

  const named = categories.find((term) => term.slug === category);

  // A link to one film describes that film. Pasted into a message it should
  // preview as the video someone meant to send, not as the gallery it came
  // from — which is the whole point of being able to share one.
  const title = shared
    ? shared.title
    : named
      ? `${named.name} — ${content.intro.heading}`
      : seo?.title || content.intro.heading;

  const description = shared
    ? shared.description || shared.credit || content.intro.body
    : seo?.description || content.intro.body;

  const still = shared ? posterFor(shared) : null;

  return buildMetadata({
    title,
    description,
    path: shared || category ? galleryHref({ category, video: shared?.slug }) : '/video-gallery',
    locale,
    seo: seo,
    // Every category and page is the same collection in a different order of
    // appearance, and a single film is a view of the gallery rather than a
    // page of its own. Only the plain gallery is worth indexing; the rest are
    // still crawled for the links they carry.
    robots:
      category || shared || Number(query.page) > 1
        ? ['noindex', 'follow']
        : seo?.robots,
    translated,
    // The film's own still, so a shared link previews as the video.
    image: still,
    openGraph: seo?.openGraph,
  });
}

/** The still to preview a shared film with, where one can be had. */
function posterFor(film: GalleryVideo): string | null {
  if (film.poster?.sourceUrl) return film.poster.sourceUrl;

  const parsed = parseVideo(film.video);

  return parsed ? videoThumbnail(parsed) : null;
}

export default async function VideosPage({ params, searchParams }: Params) {
  const { locale: requested } = await params;
  const locale = await setRequestLocale(requested);

  const query = await searchParams;
  const [{ content, categories, category, page, openAt }, settings] =
    await Promise.all([resolve(query, locale), getSiteSettings(locale)]);

  return (
    <>
      <PageHeader
        eyebrow={content.intro.eyebrow}
        title={content.intro.heading}
        description={content.intro.body}
      />

      <section className="bg-white py-14 lg:py-20">
        <Container size="wide">
          {categories.length ? (
            <nav aria-label={t('list.filter.category')} className="mb-10">
              <ul className="flex flex-wrap gap-2.5">
                <Chip
                  href={galleryHref()}
                  active={!category}
                  label={t('list.filter.all')}
                  count={page.count && !category ? page.count : undefined}
                />

                {categories.map((term) => (
                  <Chip
                    key={term.slug}
                    href={galleryHref({ category: term.slug })}
                    active={category === term.slug}
                    label={term.name}
                    count={term.count}
                  />
                ))}
              </ul>
            </nav>
          ) : null}

          {page.items.length ? (
            <>
              <p aria-live="polite" className="text-sm text-brand-ink/55">
                {page.count} {page.count === 1 ? t('list.video') : t('list.videos')}
                {page.total > 1 ? ` · page ${page.current} of ${page.total}` : ''}
              </p>

              <div className="mt-8">
                {/*
                  Keyed on the view, so filtering or paging rebuilds the
                  gallery — otherwise the lightbox would still be holding an
                  index into the films that were on screen before.
                */}
                <GalleryBrowser
                  key={`${category}:${page.current}`}
                  films={page.items}
                  category={category}
                  page={page.current}
                  openAt={openAt}
                />
              </div>

              {page.total > 1 ? (
                <div className="mt-14">
                  <Pagination
                    current={page.current}
                    total={page.total}
                    href={(next) => galleryHref({ category, page: next })}
                  />
                </div>
              ) : null}
            </>
          ) : (
            <p className="max-w-2xl text-base leading-relaxed text-brand-ink/60">
              {t('empty.videos')}{' '}
              <a
                href={`mailto:${settings.contact.email}`}
                className="font-medium text-brand-teal underline"
              >
                {settings.contact.email}
              </a>
              .
            </p>
          )}
        </Container>
      </section>

      <CallToAction settings={settings} surface="light" />
    </>
  );
}

/** One category in the filter row. */
function Chip({
  href,
  active,
  label,
  count,
}: {
  href: string;
  active: boolean;
  label: string;
  count?: number;
}) {
  return (
    <li>
      <Link
        href={href}
        aria-current={active ? 'true' : undefined}
        className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
          active
            ? 'border-brand-teal bg-brand-teal text-brand-beige'
            : 'border-brand-sand text-brand-ink/70 hover:border-brand-teal hover:text-brand-teal'
        }`}
      >
        {label}
        {count === undefined ? null : (
          <span className={active ? 'text-xs opacity-70' : 'text-xs opacity-50'}>
            {count}
          </span>
        )}
      </Link>
    </li>
  );
}
