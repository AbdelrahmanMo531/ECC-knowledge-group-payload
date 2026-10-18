import Image from 'next/image';

import { Container } from '@/components/ui/Container';
import { surfaceClass, type Surface } from '@/components/ui/surface';
import type { Accreditation } from '@/lib/cms/types';
import { t } from '@/lib/i18n/server';

/**
 * A continuously scrolling strip of accreditation logos.
 *
 * Pure CSS: the list is rendered twice and translated by exactly half its
 * width, which loops seamlessly with no JavaScript, no library and no layout
 * measurement. It pauses on hover and stops entirely under
 * `prefers-reduced-motion`, where it becomes a normal horizontal scroller the
 * visitor drives themselves.
 *
 * The duplicate is hidden from assistive tech so the logos are announced once.
 */
export function AccreditationMarquee({
  items,
  surface,
}: {
  items: Accreditation[];
  surface?: Surface;
}) {
  if (items.length === 0) return null;

  const Row = ({ 'aria-hidden': hidden }: { 'aria-hidden'?: boolean }) => (
    <ul
      aria-hidden={hidden}
      className="flex shrink-0 items-center gap-4 pe-4"
      // Marquee halves must be identical widths for the loop to be seamless.
    >
      {items.map((item) => (
        <li key={`${item.id}-${hidden ? 'dup' : 'main'}`}>
          <div className="flex h-24 w-56 items-center justify-center gap-3 rounded-[var(--radius-brand)] border border-brand-sand/70 bg-white px-6 transition-colors duration-300 hover:border-brand-turquoise/40">
            {item.logo?.sourceUrl ? (
              <Image
                src={item.logo.sourceUrl}
                alt={item.logo.altText || item.name}
                width={160}
                height={64}
                className="max-h-14 w-auto object-contain"
              />
            ) : (
              <div className="text-center">
                <span className="block font-serif text-base font-bold leading-tight text-brand-teal">
                  {item.name}
                </span>
                {item.issuer ? (
                  <span className="mt-1 block text-[0.65rem] uppercase tracking-[0.14em] text-brand-turquoise">
                    {item.issuer}
                  </span>
                ) : null}
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <section className={`border-y border-brand-sand/60 py-10 ${surfaceClass(surface)}`}>
      <Container size="wide">
        <p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-brand-ink/45">
          {t('section.awarded.by')}
        </p>
      </Container>

      <div className="group relative mt-7 overflow-hidden">
        {/* Fade the strip into the background at both edges. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-brand-beige/90 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-brand-beige/90 to-transparent"
        />

        <div className="ecc-marquee flex w-max group-hover:[animation-play-state:paused]">
          <Row />
          <Row aria-hidden />
        </div>
      </div>
    </section>
  );
}
