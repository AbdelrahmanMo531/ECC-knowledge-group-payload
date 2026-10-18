import Image from 'next/image';

import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { CompassIcon, TelescopeIcon } from '@/components/ui/icons';
import { surfaceClass, type Surface } from '@/components/ui/surface';
import type { HomeContent } from '@/lib/cms/types';
import { t } from '@/lib/i18n/server';

/**
 * About ECC — mission, vision and values.
 *
 * Set on white so it does not read as a continuation of the teal hero two
 * sections up. The contrast now comes from the content: mission and vision sit
 * in filled teal cards, and the image beside them carries a gold frame. Values
 * follow as a lighter row, so the section reads as two statements of intent
 * with the principles underneath rather than six equivalent boxes.
 */


export function AboutEcc({
  about,
  surface,
}: {
  about: HomeContent['about'];
  surface?: Surface;
}) {
  return (
    <section className={`relative overflow-hidden py-20 lg:py-28 ${surfaceClass(surface)}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute -start-40 top-10 h-[26rem] w-[26rem] rounded-full bg-brand-gold/15 blur-3xl"
      />

      <Container size="wide" className="relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Image */}
          <div className="lg:col-span-5">
            <div className="relative">
              <span
                aria-hidden
                className="absolute -bottom-5 -start-5 h-full w-full rounded-[calc(var(--radius-brand)*2)] border border-brand-gold"
              />

              <div className="relative overflow-hidden rounded-[calc(var(--radius-brand)*2)] bg-brand-teal">
                {about.image?.sourceUrl ? (
                  <Image
                    src={about.image.sourceUrl}
                    alt={about.image.altText || ''}
                    width={about.image.mediaDetails?.width ?? 800}
                    height={about.image.mediaDetails?.height ?? 1000}
                    className="aspect-[4/5] w-full object-cover"
                  />
                ) : (
                  <div className="bg-brand-gradient-teal flex aspect-[4/5] w-full items-center justify-center">
                    <Logo lockup="mark" variant="cream" height={150} />
                  </div>
                )}
              </div>
            </div>

            {/*
              A landscape second image under the portrait one, to bring this
              column up to the height of the copy beside it. Hidden below the
              breakpoint where the two sit side by side — stacked, it would
              only make the page longer.
            */}
            {about.imageTwo?.sourceUrl ? (
              <div className="mt-6 hidden overflow-hidden rounded-[calc(var(--radius-brand)*2)] bg-brand-teal lg:block">
                <Image
                  src={about.imageTwo.sourceUrl}
                  alt={about.imageTwo.altText || ''}
                  width={about.imageTwo.mediaDetails?.width ?? 800}
                  height={about.imageTwo.mediaDetails?.height ?? 450}
                  className="aspect-[16/9] w-full object-cover"
                />
              </div>
            ) : null}
          </div>

          {/* Copy */}
          <div className="lg:col-span-7">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-brand-turquoise">
              {about.eyebrow}
            </span>

            <h2 className="mt-3 text-3xl font-bold leading-tight tracking-[-0.02em] text-brand-teal sm:text-4xl">
              {about.heading}
            </h2>

            <span aria-hidden className="mt-5 block h-px w-16 bg-brand-gold" />

            <p className="mt-6 text-base leading-relaxed text-brand-ink/70">
              {about.body}
            </p>

            {/* Mission & vision */}
            <div className="mt-9 grid gap-5 sm:grid-cols-2">
              {[
                { label: t('section.mission'), text: about.mission, Icon: CompassIcon },
                { label: t('section.vision'), text: about.vision, Icon: TelescopeIcon },
              ].map(({ label, text, Icon }) => (
                <article
                  key={label}
                  className="relative overflow-hidden rounded-[calc(var(--radius-brand)*1.5)] bg-brand-teal p-7 transition-transform duration-300 ease-[var(--ease-brand)] hover:-translate-y-1"
                >
                  <div
                    aria-hidden
                    className="bg-logo-pattern pointer-events-none absolute inset-0 opacity-[0.04]"
                  />

                  <div className="relative">
                    <span
                      aria-hidden
                      className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gold/20 text-brand-gold"
                    >
                      <Icon />
                    </span>

                    <h3 className="mt-5 text-xs font-medium uppercase tracking-[0.16em] text-brand-gold">
                      {label}
                    </h3>

                    <p className="mt-3 text-base leading-relaxed text-brand-beige/90">
                      {text}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {/* Values */}
            {about.values.length > 0 ? (
              <>
                <h3 className="mt-10 text-xs font-medium uppercase tracking-[0.18em] text-brand-ink/45">
                  {t('section.values')}
                </h3>

                <ul className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                  {about.values.map((value, index) => (
                    <li key={`${index}-${value.title}`} className="flex gap-3.5">
                      <span
                        aria-hidden
                        className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-gold/30 text-brand-teal"
                      >
                        <svg width="12" height="12" viewBox="0 0 16 16">
                          <path
                            d="M3.5 8.5l3 3 6-6.5"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>

                      <div>
                        <h4 className="font-bold text-brand-teal">{value.title}</h4>
                        <p className="mt-1 text-sm leading-relaxed text-brand-ink/65">
                          {value.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            <Button href={about.ctaHref} className="mt-10">
              {about.ctaLabel}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
