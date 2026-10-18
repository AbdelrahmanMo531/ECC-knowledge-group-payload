import type { Metadata } from 'next';
import Image from 'next/image';

import { PhotoGallery } from '@/components/ceremonies/PhotoGallery';
import { LeadTrigger } from '@/components/forms/LeadTrigger';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { VideoGallery } from '@/components/video/VideoGallery';
import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n/config';
import { setRequestLocale, t } from '@/lib/i18n/server';
import { buildMetadata } from '@/lib/seo';
import { getCeremonyContent, getSiteSettings } from '@/lib/cms/api';
import type { Milestone, Stat } from '@/lib/cms/types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = isLocale(requested) ? requested : DEFAULT_LOCALE;

  const { content, seo, translated } = await getCeremonyContent(locale);

  return buildMetadata({
    title: seo?.title || content.intro.heading,
    description: seo?.description || content.intro.body,
    path: '/graduation-ceremonies',
    locale,
    translated,
    seo: seo,
    robots: seo?.robots,
    openGraph: seo?.openGraph,
    image:
      content.next.image?.sourceUrl ??
      content.legacy.image?.sourceUrl ??
      content.gallery.images[0]?.image.sourceUrl ??
      null,
  });
}

export default async function GraduationCeremoniesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: requested } = await params;
  const locale = await setRequestLocale(requested);

  const [{ content }, settings] = await Promise.all([
    getCeremonyContent(locale),
    getSiteSettings(locale),
  ]);

  const { legacy, timeline, gallery, films, highlights, next, cta } = content;

  return (
    <>
      <PageHeader
        eyebrow={content.intro.eyebrow}
        title={content.intro.heading}
        description={content.intro.body}
      >
        {content.stats.length ? (
          <dl className="mt-10 grid max-w-4xl grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-4">
            {content.stats.map((stat) => (
              <Figure key={stat.label} stat={stat} />
            ))}
          </dl>
        ) : null}
      </PageHeader>

      {/* ------------------------------------------------------- the legacy */}
      <section className="bg-white py-16 lg:py-24">
        <Container size="wide">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                eyebrow={legacy.eyebrow}
                title={legacy.heading}
                description={legacy.body}
              />

              {legacy.points.length ? (
                <ul className="mt-9 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  {legacy.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 text-base text-brand-ink/75"
                    >
                      <TickIcon />
                      {point}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            {legacy.image?.sourceUrl ? (
              <div className="relative">
                <span
                  aria-hidden
                  className="absolute -bottom-5 -start-5 h-full w-full rounded-[calc(var(--radius-brand)*2)] border border-brand-gold/50"
                />
                <div className="relative aspect-[4/3] overflow-hidden rounded-[calc(var(--radius-brand)*2)] bg-brand-beige">
                  <Image
                    src={legacy.image.sourceUrl}
                    alt={legacy.image.altText || ''}
                    fill
                    sizes="(min-width: 1024px) 40rem, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------- the timeline */}
      {timeline.items.length ? (
        <section className="bg-brand-gradient-teal relative overflow-hidden py-16 lg:py-24">
          <div
            aria-hidden
            className="bg-logo-pattern pointer-events-none absolute inset-0 opacity-[0.05]"
          />

          <Container size="wide" className="relative">
            <SectionHeading
              eyebrow={timeline.eyebrow}
              title={timeline.heading}
              description={timeline.body}
              tone="dark"
            />

            <ol className="mt-14 grid gap-10 lg:grid-cols-3 lg:gap-8">
              {timeline.items.map((milestone, index) => (
                <Step
                  key={`${milestone.year}-${milestone.place}`}
                  milestone={milestone}
                  last={index === timeline.items.length - 1}
                />
              ))}
            </ol>
          </Container>
        </section>
      ) : null}

      {/* ------------------------------------------------- the photographs */}
      {gallery.images.length ? (
        <section className="bg-white py-16 lg:py-24">
          <Container size="wide">
            <SectionHeading eyebrow={gallery.eyebrow} title={gallery.heading} />

            <div className="mt-12">
              <PhotoGallery images={gallery.images} />
            </div>
          </Container>
        </section>
      ) : null}

      {/* ------------------------------------------------------- the films */}
      {films.items.length ? (
        <section className="bg-brand-beige/40 py-16 lg:py-24">
          <Container size="wide">
            <SectionHeading eyebrow={films.eyebrow} title={films.heading} />

            <div className="mt-12">
              <VideoGallery films={films.items} />
            </div>
          </Container>
        </section>
      ) : null}

      {/* --------------------------------------------------- what to expect */}
      {highlights.items.length ? (
        <section className="bg-white py-16 lg:py-24">
          <Container size="wide">
            <SectionHeading
              eyebrow={highlights.eyebrow}
              title={highlights.heading}
            />

            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {highlights.items.map((item, index) => (
                <li
                  key={item.title}
                  className="group rounded-[calc(var(--radius-brand)*1.5)] border border-brand-sand/70 bg-white p-7 transition-all duration-300 ease-[var(--ease-brand)] hover:-translate-y-1 hover:border-brand-turquoise/40 hover:shadow-lg hover:shadow-brand-teal/[0.06]"
                >
                  <span
                    aria-hidden
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-beige font-serif text-lg font-bold text-brand-teal transition-colors duration-300 group-hover:bg-brand-gold"
                  >
                    {index + 1}
                  </span>
                  <h3 className="mt-6 text-lg font-bold leading-snug text-brand-teal">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-brand-ink/70">
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {/* ------------------------------------------------ the next ceremony */}
      <section className="bg-brand-beige/40 py-16 lg:py-24">
        <Container size="wide">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <SectionHeading
                eyebrow={next.eyebrow}
                title={next.heading}
                description={next.body}
              />

              {next.image?.sourceUrl ? (
                <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-[calc(var(--radius-brand)*1.5)] bg-brand-beige">
                  <Image
                    src={next.image.sourceUrl}
                    alt={next.image.altText || ''}
                    fill
                    sizes="(min-width: 1024px) 46rem, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : null}

              {next.facts.length ? (
                <dl className="bg-brand-gradient-teal relative mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-brand)] sm:grid-cols-4">
                  <div
                    aria-hidden
                    className="bg-logo-pattern pointer-events-none absolute inset-0 opacity-[0.06]"
                  />

                  {next.facts.map((fact) => (
                    <div
                      key={fact.label}
                      // Divided by a hairline of the ground showing through
                      // rather than by a border, so the strip reads as one
                      // panel with columns rather than four boxes.
                      className="relative border-brand-beige/15 p-5 sm:border-e sm:last:border-e-0"
                    >
                      <dt className="text-xs uppercase tracking-[0.16em] text-brand-gold">
                        {fact.label}
                      </dt>
                      <dd className="mt-2 text-base font-semibold text-brand-beige">
                        {fact.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>

            {/* ------------------------------------------------- the agenda */}
            {next.agenda.length ? (
              <div className="lg:col-span-5">
                <div className="rounded-[calc(var(--radius-brand)*1.5)] border border-brand-sand bg-white p-8">
                  <p className="text-xs uppercase tracking-[0.18em] text-brand-turquoise">
                    {t('section.programme')}
                  </p>
                  <h3 className="mt-3 font-serif text-2xl font-bold text-brand-teal">
                    {t('section.agenda')}
                  </h3>

                  <ol className="mt-7">
                    {next.agenda.map((entry, index) => (
                      <li
                        key={`${entry.time}-${entry.item}`}
                        className="relative flex gap-5 pb-7 last:pb-0"
                      >
                        {/*
                          The line runs between the marks rather than through
                          them, and stops at the last — a rule hanging below
                          the final item reads as a missing row.
                        */}
                        {index < next.agenda.length - 1 ? (
                          <span
                            aria-hidden
                            className="absolute bottom-0 start-[0.3125rem] top-4 w-px bg-brand-sand"
                          />
                        ) : null}

                        <span
                          aria-hidden
                          className="relative mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-gold ring-4 ring-white"
                        />

                        <span className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-4">
                          <span className="text-sm font-semibold tabular-nums text-brand-teal">
                            {entry.time}
                          </span>
                          <span className="text-base text-brand-ink/75">
                            {entry.item}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------- closing */}
      <section className="bg-white py-16 lg:py-24">
        <Container size="wide">
          <div className="bg-brand-gradient-teal relative overflow-hidden rounded-[calc(var(--radius-brand)*2)] px-8 py-16 text-center sm:px-14">
            <div
              aria-hidden
              className="bg-logo-pattern pointer-events-none absolute inset-0 opacity-[0.05]"
            />

            <div className="relative mx-auto max-w-2xl">
              <h2 className="font-serif text-3xl font-bold leading-tight tracking-[-0.02em] text-brand-beige sm:text-[2.5rem]">
                {cta.heading}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-brand-beige/75">
                {cta.body}
              </p>

              <div className="mt-9 flex flex-wrap justify-center gap-4">
                <LeadTrigger variant="onDarkSolid">{t('cta.apply')}</LeadTrigger>
                <Button href="/contact" variant="onDark">
                  {t('cta.contact')}
                </Button>
              </div>

              <p className="mt-7 text-xs text-brand-beige/50">
                {t('cta.reply')} · {settings.contact.email}
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

/** One of the counters in the beige band. */
function Figure({ stat }: { stat: Stat }) {
  return (
    <div>
      <dt className="sr-only">{stat.label}</dt>
      <dd>
        {/*
          `whitespace-nowrap`: a thousands separator is a break opportunity,
          and "3,200+" wrapping after the comma is the one way a counter can
          look broken.
        */}
        <span className="block whitespace-nowrap font-serif text-4xl font-bold leading-none text-brand-teal sm:text-5xl">
          {stat.prefix}
          {stat.number}
          {stat.suffix ? (
            <span className="text-brand-gold">{stat.suffix}</span>
          ) : null}
        </span>
        <span className="mt-3 block text-sm leading-snug text-brand-ink/65">
          {stat.label}
        </span>
      </dd>
    </div>
  );
}

/**
 * One ceremony on the timeline.
 *
 * An upcoming one is drawn in the brand's gold rather than as another finished
 * step, because the only entry a visitor can still act on should not look like
 * the two they missed.
 */
function Step({ milestone, last }: { milestone: Milestone; last: boolean }) {
  const upcoming = milestone.status === 'upcoming';

  return (
    <li className="relative">
      {/* The rule running to the next step, on a wide screen only. */}
      {!last ? (
        <span
          aria-hidden
          className="absolute start-0 top-5 hidden h-px w-full bg-brand-beige/20 lg:block"
        />
      ) : null}

      <div className="relative flex items-center gap-4">
        <span
          aria-hidden
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
            upcoming
              ? 'bg-brand-gold text-brand-teal'
              : 'bg-brand-beige/15 text-brand-beige'
          }`}
        >
          {upcoming ? <StarIcon /> : <TickIcon light />}
        </span>

        <span
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] ${
            upcoming
              ? 'bg-brand-gold/15 text-brand-gold'
              : 'bg-brand-beige/10 text-brand-beige/60'
          }`}
        >
          {upcoming ? 'Upcoming' : 'Completed'}
        </span>
      </div>

      <p className="mt-6 font-serif text-4xl font-bold leading-none text-brand-beige">
        {milestone.year}
      </p>
      <p className="mt-2 text-sm uppercase tracking-[0.16em] text-brand-gold">
        {milestone.place}
      </p>
      <p className="mt-4 text-base leading-relaxed text-brand-beige/70">
        {milestone.description}
      </p>
    </li>
  );
}

function TickIcon({ light = false }: { light?: boolean }) {
  return (
    <svg
      width={light ? 15 : 13}
      height={light ? 15 : 13}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      className={light ? undefined : 'mt-1.5 shrink-0 text-brand-gold'}
    >
      <path d="m5 13 4.5 4.5L19 7" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.5c.9 4.6 2.9 6.9 7.4 8.2v.1c-4.5 1.2-6.5 3.6-7.4 8.2h-.1c-.9-4.6-2.9-7-7.4-8.2v-.1c4.5-1.3 6.5-3.6 7.4-8.2Z" />
    </svg>
  );
}
