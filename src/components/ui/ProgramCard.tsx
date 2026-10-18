import Image from 'next/image';

import { Link } from '@/components/ui/Link';
import { Logo } from '@/components/brand/Logo';
import type { Program } from '@/lib/cms/types';
import { Arrow } from '@/components/ui/Arrow';
import { t } from '@/lib/i18n/server';

/**
 * Programme card.
 *
 * Leads with the featured image, with the level badge riding on it and the
 * awarding body in the footer — the two things a prospective student weighs
 * first. Without an image the header falls back to the teal gradient and the
 * shield, so a programme published before its photography still looks finished.
 */

const LEVEL_STYLES: Record<Program['level'], string> = {
  Bachelor: 'bg-brand-beige text-brand-teal',
  Master: 'bg-brand-gold text-brand-teal',
  Doctorate: 'bg-brand-teal text-brand-beige',
  Diploma: 'bg-brand-sand text-brand-ink',
  Executive: 'bg-brand-accent text-white',
};

export function ProgramCard({
  program,
  showAwardingBody = true,
}: {
  program: Program;
  /**
   * False on a partner's own page, where every card is awarded by the same
   * institution and repeating its name on each one says nothing.
   */
  showAwardingBody?: boolean;
}) {
  const facts = [program.duration, program.credits].filter(Boolean);
  const awardedBy = showAwardingBody ? program.awardingBody : '';

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-brand)*1.5)] border border-brand-sand/70 bg-white transition-all duration-300 ease-[var(--ease-brand)] hover:-translate-y-1 hover:border-brand-turquoise/40 hover:shadow-xl hover:shadow-brand-teal/[0.08]">
      <div className="relative overflow-hidden bg-brand-teal">
        {program.featuredImage?.sourceUrl ? (
          <Image
            src={program.featuredImage.sourceUrl}
            alt={program.featuredImage.altText || program.title}
            width={640}
            height={420}
            className="aspect-[3/2] w-full object-cover transition-transform duration-500 ease-[var(--ease-brand)] group-hover:scale-105"
          />
        ) : (
          /*
            Shallower than a real image: with no photograph this panel is
            decoration, and a full 3:2 of empty teal is the largest thing on
            the card.
          */
          <div
            aria-hidden
            className="bg-brand-gradient-teal flex aspect-[5/2] w-full items-center justify-center"
          >
            <Logo lockup="mark" variant="cream" height={56} />
          </div>
        )}

        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-brand-teal/60 via-transparent to-transparent"
        />

        <span
          className={`absolute start-4 top-4 rounded-full px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.1em] ${
            LEVEL_STYLES[program.level]
          }`}
        >
          {program.level}
        </span>

        {program.tuition ? (
          <span className="bidi-auto absolute end-4 top-4 rounded-full bg-brand-beige/95 px-3 py-1 text-xs font-medium text-brand-teal backdrop-blur-sm">
            {program.tuition}
          </span>
        ) : null}

        {facts.length > 0 ? (
          <div className="absolute inset-x-4 bottom-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-brand-beige/90">
            {facts.map((fact, index) => (
              <span
                key={`${index}-${fact}`}
                className="bidi-auto flex items-center gap-3"
              >
                {index > 0 ? (
                  <span aria-hidden className="h-3 w-px bg-brand-beige/40" />
                ) : null}
                {fact}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-bold leading-snug text-brand-teal transition-colors group-hover:text-brand-turquoise">
          <Link
            href={`/programs/${program.slug}`}
            className="after:absolute after:inset-0 focus:outline-none"
          >
            {program.title}
          </Link>
        </h3>

        {/* An empty excerpt would otherwise leave a gap the height of its
            margin under every title. */}
        {program.excerpt ? (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-brand-ink/70">
            {program.excerpt}
          </p>
        ) : null}

        {program.majors.length > 0 ? (
          <p className="mt-4 text-xs font-medium text-brand-turquoise">
            {program.majors.length}{' '}
            {program.majors.length === 1 ? 'major' : 'majors'} to choose from
          </p>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-brand-sand/60 pt-5">
          <span className="text-xs leading-snug text-brand-ink/55">
            {awardedBy ? (
              <>
                {t('programme.awarded')}
                <span className="mt-0.5 block font-medium text-brand-teal">
                  {awardedBy}
                </span>
              </>
            ) : (
              // The level is already a badge on the image, so the footer says
              // something new — or nothing, leaving the arrow on its own.
              <span className="font-medium text-brand-teal">
                {program.studyMode}
              </span>
            )}
          </span>

          {/*
            Nudged along the way the page reads: in Arabic the arrow points
            left, so travelling right on hover would send it backwards.
          */}
          <Arrow className="shrink-0 text-brand-turquoise transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
        </div>
      </div>
    </article>
  );
}
