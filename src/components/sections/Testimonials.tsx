import Image from 'next/image';

import { CardSlider } from '@/components/ui/CardSlider';
import { Container } from '@/components/ui/Container';
import { Link } from '@/components/ui/Link';
import { Arrow } from '@/components/ui/Arrow';
import { surfaceClass, type Surface } from '@/components/ui/surface';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { Testimonial } from '@/lib/cms/types';
import { t } from '@/lib/i18n/server';

/**
 * Renders nothing until real, attributable testimonials exist in the CMS —
 * quotes are put in named people's mouths, so they are never seeded.
 */
export function Testimonials({
  testimonials,
  surface,
  id,
  title,
  description,
}: {
  testimonials: Testimonial[];
  surface?: Surface;
  /** Anchor target, so in-page navigation can link to the section. */
  id?: string;
  /** Overrides the built-in heading, e.g. with copy authored for a page. */
  title?: string;
  description?: string;
}) {
  // A testimonial may be a film instead of a quote; those belong on the
  // graduate stories page, and would render as an empty pair of quote marks
  // here.
  const quotes = testimonials.filter((one) => one.quote);

  if (quotes.length === 0) return null;

  return (
    <section
      id={id}
      className={`scroll-mt-[9.5rem] py-20 lg:py-28 ${surfaceClass(surface)}`}
    >
      <Container size="wide">
        <SectionHeading
          eyebrow={t('section.voices')}
          title={title ?? t('section.voices.title')}
          description={description}
        />

        <div className="mt-14">
          <CardSlider
            label={t('section.voices')}
            gridClassName="md:grid-cols-2 lg:grid-cols-3"
            itemClassName="w-[20rem] sm:w-[23rem]"
            items={quotes.map((testimonial) => (
              // A figure, not a blockquote wrapping a blockquote: the quote is
              // the blockquote and who said it is its caption.
              <figure
                key={testimonial.id}
                className="flex h-full w-full flex-col rounded-[var(--radius-brand)] border border-brand-sand/70 bg-white p-7"
              >
                <blockquote className="font-serif text-lg italic leading-relaxed text-brand-teal">
                  “{testimonial.quote}”
                </blockquote>

                <figcaption className="mt-auto flex items-center gap-4 pt-7">
                  {testimonial.avatar?.sourceUrl ? (
                    <Image
                      src={testimonial.avatar.sourceUrl}
                      alt={testimonial.avatar.altText || testimonial.authorName}
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-teal text-sm font-bold text-brand-beige"
                    >
                      {testimonial.authorName.charAt(0)}
                    </span>
                  )}

                  <div className="text-sm">
                    <p className="font-medium text-brand-teal">
                      {testimonial.authorName}
                    </p>
                    <p className="text-brand-ink/60">
                      {[
                        testimonial.authorRole,
                        testimonial.program,
                        testimonial.country,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  </div>
                </figcaption>
              </figure>
            ))}
          />
        </div>

        {/*
          Somewhere to go next.

          The section has never had one: a visitor who reads three quotes and
          wants more had no way from here to the graduate stories page except
          the menu.
        */}
        <div className="mt-12 text-center">
          <Link
            href="/testimonials"
            className="inline-flex items-center gap-2 rounded-full border border-brand-teal px-7 py-3 text-sm font-medium text-brand-teal transition-colors hover:bg-brand-teal hover:text-brand-beige"
          >
            {t('section.voices.all')}
            <Arrow />
          </Link>
        </div>
      </Container>
    </section>
  );
}
