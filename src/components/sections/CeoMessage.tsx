import Image from 'next/image';

import { Logo } from '@/components/brand/Logo';
import { Container } from '@/components/ui/Container';
import { surfaceClass, type Surface } from '@/components/ui/surface';
import type { HomeContent } from '@/lib/cms/types';
import { t } from '@/lib/i18n/server';

/**
 * The CEO's letter, set as an editorial spread.
 *
 * The first paragraph is pulled out as a large serif lead — a wall of even body
 * text reads as corporate filler, whereas a lead line reads as someone
 * speaking. The portrait sits in a gold-ruled frame on the brand's beige, and
 * falls back to the shield mark when no photograph has been uploaded, so the
 * section never renders a hole.
 */
export function CeoMessage({
  ceo,
  surface,
}: {
  ceo: HomeContent['ceo'];
  surface?: Surface;
}) {
  const [lead, ...rest] = ceo.message;

  if (!lead) return null;

  return (
    <section className={`relative overflow-hidden py-20 lg:py-28 ${surfaceClass(surface)}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute -start-40 top-1/4 h-[30rem] w-[30rem] rounded-full bg-brand-gold/15 blur-3xl"
      />

      <Container size="wide" className="relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Portrait */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-sm lg:mx-0">
              <span
                aria-hidden
                className="absolute -bottom-4 -end-4 h-full w-full rounded-[calc(var(--radius-brand)*2)] border border-brand-gold/60"
              />

              <div className="relative overflow-hidden rounded-[calc(var(--radius-brand)*2)] bg-brand-teal">
                {ceo.photo?.sourceUrl ? (
                  <Image
                    src={ceo.photo.sourceUrl}
                    alt={ceo.photo.altText || ceo.name}
                    width={ceo.photo.mediaDetails?.width ?? 720}
                    height={ceo.photo.mediaDetails?.height ?? 900}
                    className="aspect-[4/5] w-full object-cover"
                  />
                ) : (
                  <div className="bg-brand-gradient-teal flex aspect-[4/5] w-full items-center justify-center">
                    <Logo lockup="mark" variant="cream" height={150} />
                  </div>
                )}
              </div>

              <div className="relative mt-6 lg:mt-7">
                <p className="font-serif text-2xl font-bold text-brand-teal">
                  {ceo.name}
                </p>
                <p className="mt-1.5 text-sm text-brand-ink/60">{ceo.role}</p>
              </div>
            </div>
          </div>

          {/* Letter */}
          <div className="lg:col-span-7">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-brand-turquoise">
              {ceo.eyebrow}
            </span>

            <h2 className="mt-3 text-3xl font-bold leading-tight tracking-[-0.02em] text-brand-teal sm:text-4xl">
              {ceo.heading}
            </h2>

            <span aria-hidden className="mt-5 block h-px w-16 bg-brand-gold" />

            <blockquote className="mt-8">
              <svg
                width="40"
                height="32"
                viewBox="0 0 40 32"
                aria-hidden
                className="text-brand-gold"
              >
                <path
                  fill="currentColor"
                  d="M0 32V19.2C0 8.6 5.5 2.2 16.4 0l1.6 4.6C11.6 6.6 8.4 10.3 8.4 15.6H16V32H0Zm22 0V19.2C22 8.6 27.5 2.2 38.4 0L40 4.6c-6.4 2-9.6 5.7-9.6 11H38V32H22Z"
                />
              </svg>

              <p className="mt-5 font-serif text-2xl leading-snug text-brand-teal sm:text-[1.75rem]">
                {lead}
              </p>
            </blockquote>

            {rest.length > 0 ? (
              <div className="mt-7 space-y-5 text-base leading-relaxed text-brand-ink/75">
                {rest.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </div>
            ) : null}

            <p className="mt-9 font-serif text-xl italic text-brand-teal">
              {t('section.ceo.sign')}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
