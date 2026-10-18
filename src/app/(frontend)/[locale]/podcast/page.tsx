import type { Metadata } from 'next';

import { PodcastShows } from '@/components/podcast/PodcastShows';
import { CallToAction } from '@/components/sections/CallToAction';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n/config';
import { setRequestLocale, t } from '@/lib/i18n/server';
import { buildMetadata } from '@/lib/seo';
import { getPodcastContent, getPodcasts, getSiteSettings } from '@/lib/cms/api';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = isLocale(requested) ? requested : DEFAULT_LOCALE;

  const { content, seo, translated } = await getPodcastContent(locale);

  return buildMetadata({
    title: seo?.title || content.intro.heading,
    description: seo?.description || content.intro.body,
    path: '/podcast',
    locale,
    translated,
    seo: seo,
    robots: seo?.robots,
    openGraph: seo?.openGraph,
  });
}

export default async function PodcastPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: requested } = await params;
  const locale = await setRequestLocale(requested);

  const [{ content }, shows, settings] = await Promise.all([
    getPodcastContent(locale),
    getPodcasts(locale),
    getSiteSettings(locale),
  ]);

  return (
    <>
      <PageHeader
        eyebrow={content.intro.eyebrow}
        title={content.intro.heading}
        description={content.intro.body}
      />

      <section className="bg-white py-14 lg:py-20">
        <Container size="wide">
          {shows.length ? (
            <PodcastShows shows={shows} />
          ) : (
            <p className="max-w-2xl text-base leading-relaxed text-brand-ink/60">
              {t('empty.podcast')}{' '}
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
