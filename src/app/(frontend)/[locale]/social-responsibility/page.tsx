import type { Metadata } from 'next';
import Image from 'next/image';

import { CallToAction } from '@/components/sections/CallToAction';
import { EcosystemOrbit } from '@/components/social/EcosystemOrbit';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { VideoLightbox } from '@/components/ui/VideoLightbox';
import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n/config';
import { setRequestLocale } from '@/lib/i18n/server';
import { buildMetadata } from '@/lib/seo';
import { getSiteSettings, getSocialContent } from '@/lib/cms/api';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = isLocale(requested) ? requested : DEFAULT_LOCALE;

  const { content, seo, translated } = await getSocialContent(locale);

  return buildMetadata({
    title: seo?.title || content.intro.heading,
    description: seo?.description || content.intro.body,
    path: '/social-responsibility',
    locale,
    translated,
    seo: seo,
    robots: seo?.robots,
    openGraph: seo?.openGraph,
    image: content.initiative.image?.sourceUrl ?? null,
  });
}

export default async function SocialResponsibilityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: requested } = await params;
  const locale = await setRequestLocale(requested);

  const [{ content }, settings] = await Promise.all([
    getSocialContent(locale),
    getSiteSettings(locale),
  ]);

  const { initiative } = content;

  return (
    <>
      <PageHeader
        eyebrow={content.intro.eyebrow}
        title={content.intro.heading}
        description={content.intro.body}
      >
        {content.tags.length ? (
          <ul className="mt-9 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs uppercase tracking-[0.16em] text-brand-teal/70">
            {content.tags.map((tag, index) => (
              <li key={tag} className="flex items-center gap-3">
                {index > 0 ? (
                  <span aria-hidden className="text-brand-gold">
                    ·
                  </span>
                ) : null}
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
      </PageHeader>

      {/* --------------------------------------------------------- belief */}
      {content.quote ? (
        <section className="bg-brand-gradient-teal relative overflow-hidden py-16 lg:py-20">
          <div
            aria-hidden
            className="bg-logo-pattern pointer-events-none absolute inset-0 opacity-[0.05]"
          />

          <Container>
            <figure className="relative mx-auto max-w-3xl text-center">
              <span
                aria-hidden
                className="block font-serif text-6xl leading-none text-brand-gold"
              >
                &ldquo;
              </span>
              <blockquote className="mt-3">
                <p className="font-serif text-2xl font-bold leading-snug text-brand-beige sm:text-[1.75rem]">
                  {content.quote}
                </p>
              </blockquote>
              <span
                aria-hidden
                className="mx-auto mt-8 block h-px w-16 bg-brand-gold"
              />
            </figure>
          </Container>
        </section>
      ) : null}

      {/* -------------------------------------------------------- pillars */}
      <section className="bg-white py-16 lg:py-24">
        <Container size="wide">
          <SectionHeading
            eyebrow={content.pillars.eyebrow}
            title={content.pillars.heading}
            description={content.pillars.body}
          />

          <ul className="mt-12 grid gap-6 lg:grid-cols-3">
            {content.pillars.items.map((pillar, index) => (
              <li
                key={pillar.title}
                className="group relative overflow-hidden rounded-[calc(var(--radius-brand)*1.5)] border border-brand-sand/70 bg-white p-8 transition-all duration-300 ease-[var(--ease-brand)] hover:-translate-y-1 hover:border-brand-turquoise/40 hover:shadow-xl hover:shadow-brand-teal/[0.07]"
              >
                {/*
                  The pillar itself: a gold column that fills from the bottom
                  as you approach it. The one piece of ornament on the page
                  that means something — three columns holding the work up.
                */}
                <span
                  aria-hidden
                  className="absolute bottom-0 start-0 top-0 w-1 origin-bottom scale-y-[0.25] bg-brand-gold transition-transform duration-500 ease-[var(--ease-brand)] group-hover:scale-y-100"
                />

                <span
                  aria-hidden
                  className="block font-serif text-4xl font-bold leading-none text-brand-gold/40"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                <h3 className="mt-6 font-serif text-2xl font-bold leading-tight text-brand-teal">
                  {pillar.title}
                </h3>

                <p className="mt-4 text-base leading-relaxed text-brand-ink/70">
                  {pillar.description}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ------------------------------------------------------ ecosystem */}
      <section className="bg-brand-beige/40 py-16 lg:py-24">
        <Container size="wide">
          <SectionHeading
            eyebrow={content.ecosystem.eyebrow}
            title={content.ecosystem.heading}
            description={content.ecosystem.body}
          />

          <div className="mt-14">
            <EcosystemOrbit items={content.ecosystem.items} />
          </div>
        </Container>
      </section>

      {/* ----------------------------------------------------- initiative */}
      {initiative.heading ? (
        <section className="bg-white py-16 lg:py-24">
          <Container size="wide">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="relative">
                {initiative.image?.sourceUrl ? (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[calc(var(--radius-brand)*1.5)] bg-brand-beige">
                    <Image
                      src={initiative.image.sourceUrl}
                      alt={initiative.image.altText || ''}
                      fill
                      sizes="(min-width: 1024px) 40rem, 100vw"
                      className="object-cover"
                    />
                    {initiative.video ? (
                      <span className="absolute inset-0 grid place-items-center bg-brand-teal/30">
                        <VideoLightbox
                          url={initiative.video}
                          context={initiative.heading}
                        />
                      </span>
                    ) : null}
                  </div>
                ) : initiative.video ? (
                  // A film and no photograph: the brand's own ground stands in
                  // rather than an empty frame.
                  <div className="bg-brand-gradient-teal relative grid aspect-[4/3] place-items-center overflow-hidden rounded-[calc(var(--radius-brand)*1.5)]">
                    <div
                      aria-hidden
                      className="bg-logo-pattern pointer-events-none absolute inset-0 opacity-[0.06]"
                    />
                    <VideoLightbox
                      url={initiative.video}
                      context={initiative.heading}
                    />
                  </div>
                ) : null}

                {/*
                  The number, over the corner of the picture where there is
                  one and on its own where there is not. It is what anybody
                  remembers of this section.
                */}
                {initiative.figure ? (
                  <div
                    className={`flex items-end gap-3 rounded-[var(--radius-brand)] bg-brand-teal px-7 py-5 text-brand-beige shadow-xl shadow-brand-teal/20 ${
                      initiative.image?.sourceUrl || initiative.video
                        ? 'absolute -bottom-6 start-6 sm:start-8'
                        : 'inline-flex'
                    }`}
                  >
                    <span className="font-serif text-5xl font-bold leading-none text-brand-gold">
                      {initiative.figure}
                    </span>
                    {initiative.figureLabel ? (
                      <span className="pb-1 text-sm text-brand-beige/80">
                        {initiative.figureLabel}
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className={initiative.figure ? 'mt-10 lg:mt-0' : undefined}>
                <SectionHeading
                  eyebrow={initiative.eyebrow}
                  title={initiative.heading}
                />
                <p className="mt-6 text-lg leading-relaxed text-brand-ink/75">
                  {initiative.body}
                </p>
              </div>
            </div>
          </Container>
        </section>
      ) : null}

      <CallToAction settings={settings} surface="light" />
    </>
  );
}
