import Image from 'next/image';

import { Container } from '@/components/ui/Container';
import { Link } from '@/components/ui/Link';
import { surfaceClass, type Surface } from '@/components/ui/surface';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Flag } from '@/components/ui/Flag';
import type { Partner } from '@/lib/cms/types';
import { Arrow } from '@/components/ui/Arrow';
import { t } from '@/lib/i18n/server';

/**
 * Partner cards.
 *
 * Each carries a rule in the partner's own brand colour — the guideline gives
 * IBAS, VERN, CMI and Genovasi their own palettes, and this is the one place
 * those colours are allowed alongside ECC's.
 *
 * The flag sits in a badge next to the country name, never instead of it — the
 * written country is what carries the meaning, and the flag is recognition at a
 * glance. It is an SVG rather than an emoji, because Windows has no flag glyphs
 * and renders emoji flags as their two-letter code.
 */
export function PartnersSection({
  partners,
  surface,
  id,
  title,
  description,
}: {
  partners: Partner[];
  surface?: Surface;
  /** Anchor target, so in-page navigation can link to the section. */
  id?: string;
  /** Overrides the built-in heading, e.g. with copy authored for a page. */
  title?: string;
  description?: string;
}) {
  if (partners.length === 0) return null;

  return (
    <section
      id={id}
      className={`relative scroll-mt-[9.5rem] overflow-hidden py-20 lg:py-28 ${surfaceClass(surface)}`}
    >
      <Container size="wide" className="relative">
        <SectionHeading
          eyebrow={t('page.partners.eyebrow')}
          title={title ?? t('section.partners.title')}
          description={
            description ??
            t('section.partners.body')
          }
        />

        <ul className="mt-14 grid gap-6 md:grid-cols-2">
          {partners.map((partner) => {
            const accent = partner.accentColor ?? '#E7DCAA';

            return (
              <li
                key={partner.id}
                className="group relative flex flex-col overflow-hidden rounded-[calc(var(--radius-brand)*1.5)] border border-brand-sand/70 bg-brand-beige/25 p-8 transition-all duration-300 ease-[var(--ease-brand)] hover:-translate-y-1 hover:border-brand-turquoise/40 hover:bg-white hover:shadow-xl hover:shadow-brand-teal/[0.07]"
              >
                {/* The partner's own brand colour. */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-1 transition-all duration-300 group-hover:h-1.5"
                  style={{ backgroundColor: accent }}
                />

                <div className="flex items-start justify-between gap-6">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                      <Flag
                        country={partner.country}
                        code={partner.countryCode}
                        size={24}
                        className="text-brand-ink/70 ring-1 ring-brand-sand"
                      />

                      <span className="text-xs font-medium uppercase tracking-[0.16em] text-brand-turquoise">
                        {partner.country}
                      </span>
                    </div>

                    <h3 className="mt-4 text-xl font-bold leading-snug text-brand-teal">
                      {/*
                        The heading link covers the whole card through the
                        overlay below, so the card is one target — while the
                        external "Visit" link below stays its own, separate one.
                      */}
                      <Link
                        href={`/partners/${partner.slug}`}
                        className="transition-colors after:absolute after:inset-0 after:content-[''] hover:text-brand-turquoise"
                      >
                        {partner.name}
                      </Link>
                    </h3>
                  </div>

                  {partner.logo?.sourceUrl ? (
                    <Image
                      src={partner.logo.sourceUrl}
                      alt={partner.logo.altText || partner.name}
                      width={120}
                      height={60}
                      className="h-14 w-auto shrink-0 object-contain"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full font-serif text-xl font-bold text-brand-beige"
                      style={{ backgroundColor: accent }}
                    >
                      {partner.name.charAt(0)}
                    </span>
                  )}
                </div>

                <p className="mt-5 line-clamp-4 text-sm leading-relaxed text-brand-ink/70">
                  {partner.description}
                </p>

                <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-6">
                  <span className="text-sm font-medium text-brand-turquoise">
                    View partner <Arrow />
                  </span>

                  {/* Counted from the linked programmes, never typed in. */}
                  {partner.programs.length > 0 ? (
                    <span className="text-xs text-brand-ink/55">
                      {partner.programs.length}{' '}
                      {partner.programs.length === 1 ? 'programme' : 'programmes'}
                    </span>
                  ) : null}

                  {partner.website ? (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noreferrer noopener"
                      // Above the heading's overlay, so it stays its own link.
                      className="relative z-10 ms-auto text-xs text-brand-ink/55 underline decoration-brand-sand underline-offset-4 transition-colors hover:text-brand-teal"
                    >
                      {t('link.website')} ↗
                    </a>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
