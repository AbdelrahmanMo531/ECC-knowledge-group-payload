import Image from 'next/image';

import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import type { HomeContent } from '@/lib/cms/types';
import { t } from '@/lib/i18n/server';

/**
 * Homepage hero.
 *
 * Set on the brand's deep teal with the shield mark as a large watermark — the
 * guideline's own website treatment (p.19), scaled up. The H1 carries the
 * qualification names, and the badge row answers the two questions that decide
 * whether a working professional keeps reading: is it recognised, and can I fit
 * it around my job.
 */
export function Hero({
  hero,
  countries,
}: {
  hero: HomeContent['hero'];
  countries: string[];
}) {
  return (
    <section className="relative overflow-hidden bg-brand-teal">
      {/* Depth: a turquoise wash from the top-right, gold from the lower-left. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -end-40 -top-52 h-[46rem] w-[46rem] rounded-full bg-brand-turquoise/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-56 -start-40 h-[34rem] w-[34rem] rounded-full bg-brand-gold/10 blur-3xl"
      />
      <div
        aria-hidden
        className="bg-logo-pattern pointer-events-none absolute inset-0 opacity-[0.025]"
      />

      <Container size="wide" className="relative">
        <div className="grid items-center gap-12 py-20 lg:grid-cols-12 lg:gap-10 lg:py-28">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-brand-gold/30 bg-brand-beige/[0.06] px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-brand-gold">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
              {hero.eyebrow}
            </span>

            {/*
              Arabic is set smaller and looser: its letterforms are taller than
              Latin at the same size, and tight leading clips the marks above
              and below the line. Negative tracking is dropped too — letter
              spacing pulls apart the joins Arabic letters depend on.
            */}
            <h1 className="mt-7 text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-brand-beige sm:text-5xl lg:text-[3.5rem] rtl:text-3xl rtl:leading-[1.35] rtl:tracking-normal sm:rtl:text-4xl lg:rtl:text-[2.75rem]">
              {hero.heading}
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-brand-beige/75">
              {hero.body}
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Button href={hero.ctaHref} variant="onDarkSolid">
                {hero.ctaLabel}
              </Button>
              <Button href="/programs" variant="onDark">
                {t('link.compare')}
              </Button>
            </div>

            {hero.badges.length > 0 ? (
              <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3">
                {hero.badges.map((badge, index) => (
                  <li
                    key={`${index}-${badge}`}
                    className="flex items-center gap-2 text-sm text-brand-beige/70"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 16 16"
                      aria-hidden
                      className="shrink-0 text-brand-gold"
                    >
                      <path
                        d="M3.5 8.5l3 3 6-6.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {badge}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="hidden justify-center lg:col-span-5 lg:flex">
            {hero.image?.sourceUrl ? (
              // A photograph earns the space better than the mark; the gold
              // frame and teal wash keep it inside the brand.
              <div className="relative w-full max-w-md">
                <span
                  aria-hidden
                  className="absolute -bottom-5 -end-5 h-full w-full rounded-[calc(var(--radius-brand)*2)] border border-brand-gold/50"
                />
                <div className="relative overflow-hidden rounded-[calc(var(--radius-brand)*2)]">
                  <Image
                    src={hero.image.sourceUrl}
                    alt={hero.image.altText || ''}
                    width={hero.image.mediaDetails?.width ?? 900}
                    height={hero.image.mediaDetails?.height ?? 1100}
                    className="aspect-[4/5] w-full object-cover"
                    priority
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-brand-teal/45 to-transparent"
                  />
                </div>
              </div>
            ) : (
              <div className="relative">
                <div
                  aria-hidden
                  className="absolute inset-0 -m-10 rounded-full bg-brand-beige/[0.04] blur-2xl"
                />
                <Logo lockup="mark" variant="cream" height={360} priority />
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Awarding countries — the proof behind "globally recognised". */}
      {countries.length > 0 ? (
        <div className="relative border-t border-brand-beige/10">
          <Container size="wide">
            <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:gap-8">
              <span className="shrink-0 text-xs font-medium uppercase tracking-[0.16em] text-brand-beige/45">
                {t('section.degrees.from')}
              </span>
              <ul className="flex flex-wrap items-center gap-x-8 gap-y-2">
                {countries.map((country, index) => (
                  <li
                    key={`${index}-${country}`}
                    className="font-serif text-lg text-brand-beige/85"
                  >
                    {country}
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </div>
      ) : null}
    </section>
  );
}
