import type { Metadata } from 'next';

import { CallToAction } from '@/components/sections/CallToAction';
import { VideoGallery } from '@/components/video/VideoGallery';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { Pagination } from '@/components/ui/Pagination';
import { DEFAULT_PER_PAGE, paginate } from '@/lib/pagination';
import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n/config';
import { setRequestLocale, t } from '@/lib/i18n/server';
import { buildMetadata } from '@/lib/seo';
import { playable, testimonialAsVideo } from '@/lib/videos';
import { getSiteSettings, getStoriesContent, getTestimonials } from '@/lib/cms/api';

type Params = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
};

/** Page one is the canonical URL; `?page=1` would be a second URL for it. */
function storiesHref(page: number): string {
  return page > 1 ? `/testimonials?page=${page}` : '/testimonials';
}

export async function generateMetadata({ params, searchParams }: Params): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = isLocale(requested) ? requested : DEFAULT_LOCALE;

  const [{ content, seo, translated }, { page }] = await Promise.all([
    getStoriesContent(locale),
    searchParams,
  ]);

  return buildMetadata({
    title: seo?.title || content.intro.heading,
    description: seo?.description || content.intro.body,
    path: '/testimonials',
    locale,
    translated,
    seo: seo,
    // Later pages are the same collection further down; they are crawled for
    // their links but only the first is worth indexing.
    robots: Number(page) > 1 ? ['noindex', 'follow'] : seo?.robots,
    openGraph: seo?.openGraph,
  });
}

export default async function TestimonialsPage({ params, searchParams }: Params) {
  const { locale: requested } = await params;
  const locale = await setRequestLocale(requested);

  const [{ content }, testimonials, settings, query] = await Promise.all([
    getStoriesContent(locale),
    getTestimonials(locale),
    getSiteSettings(locale),
    searchParams,
  ]);

  // A link the player cannot open is worse than no card: it would show a still
  // that opens an empty dialog. Anything unparseable is left out here.
  const films = playable(testimonials.map(testimonialAsVideo));

  const page = paginate(
    films,
    Number(query.page) || 1,
    content.perPage || DEFAULT_PER_PAGE,
  );

  return (
    <>
      <PageHeader
        eyebrow={content.intro.eyebrow}
        title={content.intro.heading}
        description={content.intro.body}
      />

      <section className="bg-white py-14 lg:py-20">
        <Container size="wide">
          {page.items.length ? (
            <>
              <p aria-live="polite" className="text-sm text-brand-ink/55">
                {page.count} {page.count === 1 ? t('list.story') : t('list.stories')}
                {page.total > 1 ? ` · page ${page.current} of ${page.total}` : ''}
              </p>

              <div className="mt-10">
                {/*
                  Keyed on the page, so moving through the grid rebuilds the
                  gallery — otherwise the lightbox would still be holding an
                  index into the previous page's films.
                */}
                <VideoGallery key={page.current} films={page.items} />
              </div>

              <Pagination
                current={page.current}
                total={page.total}
                href={storiesHref}
                label={t('aria.pages.stories')}
              />
            </>
          ) : (
            <p className="max-w-2xl text-base leading-relaxed text-brand-ink/60">
              {t('empty.stories')}{' '}
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

      <CallToAction settings={settings} />
    </>
  );
}
