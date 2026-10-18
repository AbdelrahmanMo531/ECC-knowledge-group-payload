import { Container } from '@/components/ui/Container';
import { surfaceClass, type Surface } from '@/components/ui/surface';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { HomeContent } from '@/lib/cms/types';
import { t } from '@/lib/i18n/server';

/**
 * The objection-handling section.
 *
 * Each card answers a question a prospective student would otherwise have to
 * ask an advisor before enrolling — recognition, flexibility, prior credit and
 * transparency. Numbering them gives the eye a path through the grid.
 */
export function WhyEcc({
  why,
  surface,
}: {
  why: HomeContent['why'];
  surface?: Surface;
}) {
  if (why.items.length === 0) return null;

  return (
    <section className={`relative overflow-hidden py-20 lg:py-28 ${surfaceClass(surface)}`}>
      <Container size="wide">
        <SectionHeading
          eyebrow={t('section.why')}
          title={why.heading}
          description={why.body}
        />

        <ul className="mt-14 grid gap-6 sm:grid-cols-2">
          {why.items.map((item, index) => (
            <li
              key={`${index}-${item.title}`}
              className="group relative overflow-hidden rounded-[calc(var(--radius-brand)*1.5)] border border-brand-sand/70 bg-brand-beige/40 p-8 transition-all duration-300 ease-[var(--ease-brand)] hover:-translate-y-1 hover:border-brand-turquoise/40 hover:bg-brand-beige/70 hover:shadow-xl hover:shadow-brand-teal/[0.06]"
            >
              {/* Oversized index, held back so it reads as texture. */}
              <span
                aria-hidden
                className="pointer-events-none absolute -end-2 -top-6 font-serif text-[7rem] font-bold leading-none text-brand-teal/[0.05] transition-colors duration-300 group-hover:text-brand-teal/[0.08]"
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              <div className="relative">
                <h3 className="text-xl font-bold leading-snug text-brand-teal">
                  {item.title}
                </h3>
                <span aria-hidden className="mt-4 block h-px w-10 bg-brand-gold" />
                <p className="mt-5 max-w-md text-base leading-relaxed text-brand-ink/70">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
