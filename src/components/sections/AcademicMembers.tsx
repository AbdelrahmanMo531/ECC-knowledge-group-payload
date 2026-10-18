import Image from 'next/image';

import { CardSlider } from '@/components/ui/CardSlider';
import { Container } from '@/components/ui/Container';
import { Link } from '@/components/ui/Link';
import { surfaceClass, type Surface } from '@/components/ui/surface';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { AcademicMember } from '@/lib/cms/types';
import { Arrow } from '@/components/ui/Arrow';
import { t } from '@/lib/i18n/server';

/**
 * The academic faculty.
 *
 * Faculty only — the board and the managers are a separate collection, and this
 * section is called the academic board. Each card links to that person's own
 * profile, so the section is a way in rather than a wall of headshots.
 *
 * Renders nothing until members are added in the admin — these are real, named
 * people with photographs, so the list is never seeded with placeholders.
 */
export function AcademicMembers({
  members,
  surface,
}: {
  members: AcademicMember[];
  surface?: Surface;
}) {
  if (members.length === 0) return null;

  /*
   * The ten most recently added, newest first.
   *
   * The list arrives in the order an editor arranged it — which is what the
   * directory and the Our People tabs want, and not what a homepage wants. A
   * board that never changes stops being read; showing the newest additions
   * means adding an academic in the admin is visible on the front page the
   * same day.
   *
   * Sorted here rather than in the query because the query is shared with both
   * of those pages, and reordering it there would reorder them too. Members
   * with no date sort last rather than to 1970.
   */
  const shown = [...members]
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
    .slice(0, 10);

  return (
    <section className={`py-20 lg:py-28 ${surfaceClass(surface)}`}>
      <Container size="wide">
        <SectionHeading
          eyebrow={t('section.board.eyebrow')}
          title={t('section.board.title')}
          description={t('section.board.body')}
        />

        <div className="mt-14">
          <CardSlider
            label={t('section.board.eyebrow')}
            gridClassName="sm:grid-cols-2 lg:grid-cols-4"
            itemClassName="w-[17rem] sm:w-[18rem]"
            items={shown.map((member) => (
              <article
                key={member.id}
                className="group relative flex h-full w-full flex-col overflow-hidden rounded-[calc(var(--radius-brand)*1.5)] border border-brand-sand/70 bg-brand-beige/30 transition-all duration-300 ease-[var(--ease-brand)] hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-teal/[0.07]"
              >
                {/*
                  A square portrait, and `shrink-0` under it.

                  The photograph used to be a 4:5 portrait, which at the card's
                  width is 360px of the 550 the card stood at — and it was not
                  even getting them: the text block below claimed the card's
                  full height, so the flex row squeezed the photograph down to
                  209px and left a quarter of the card empty under the name.
                  Squaring the crop and letting the text be its own size is
                  what makes the card the height of what is in it.
                */}
                <div className="relative shrink-0 overflow-hidden bg-brand-teal">
                  {member.photo?.sourceUrl ? (
                    <Image
                      src={member.photo.sourceUrl}
                      alt={member.photo.altText || member.name}
                      width={520}
                      height={640}
                      className="aspect-square w-full object-cover transition-transform duration-500 ease-[var(--ease-brand)] group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div
                      aria-hidden
                      className="bg-brand-gradient-teal flex aspect-square w-full items-center justify-center font-serif text-5xl text-brand-beige/80"
                    >
                      {member.name.charAt(0)}
                    </div>
                  )}

                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-brand-gold"
                  />
                </div>

                <div className="flex flex-col p-6">
                  <h3 className="text-base font-bold leading-snug text-brand-teal">
                    {member.detailPath ? (
                      // Stretched over the whole card: the photograph is the
                      // obvious thing to click, and a name is a better link
                      // label for a screen reader than "read more".
                      <Link
                        href={member.detailPath}
                        className="before:absolute before:inset-0 before:content-['']"
                      >
                        {member.name}
                      </Link>
                    ) : (
                      member.name
                    )}
                  </h3>

                  {member.position ? (
                    <p className="mt-2 text-sm leading-snug text-brand-ink/70">
                      {member.position}
                    </p>
                  ) : null}

                  {member.institution ? (
                    <p className="mt-1.5 text-sm leading-snug text-brand-ink/50">
                      {member.institution}
                    </p>
                  ) : null}

                  {member.expertise.length ? (
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {member.expertise.slice(0, 3).map((area, index) => (
                        <li
                          key={`${index}-${area}`}
                          className="rounded-full bg-white px-2.5 py-1 text-[0.7rem] leading-none text-brand-ink/65 ring-1 ring-brand-sand"
                        >
                          {area}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {/*
                    `mt-5`, not `mt-auto pt-5`.

                    `mt-auto` pushed this to the bottom of the card so it lined
                    up across a row — but the cards are all as tall as the
                    tallest, and a card with no institution and no expertise
                    chips is much shorter than one with three. The gap grew to
                    fill whatever was left, which on a sparse card was most of
                    it. A fixed gap under the content reads as one card design
                    rather than as a mistake.
                  */}
                  {member.detailPath ? (
                    <span
                      aria-hidden
                      className="mt-5 text-xs font-medium text-brand-turquoise transition-colors group-hover:text-brand-teal"
                    >
                      {t('cta.profile')} <Arrow />
                    </span>
                  ) : null}
                </div>
              </article>
            ))}
          />
        </div>

        <div className="mt-12 text-center">
          {/*
            The academic staff directory, not Our People.

            This section is the academic board; the page that lists all of them
            with their specialisations is /our-academic-staff. Our People is the
            leadership and the wider team, which is a different question.

            The label used to interpolate a count into an English sentence that
            never went near the dictionary, so an Arabic homepage read "Meet all
            37 academics".
          */}
          <Link
            href="/our-academic-staff"
            className="inline-flex items-center gap-2 rounded-full border border-brand-teal px-7 py-3 text-sm font-medium text-brand-teal transition-colors hover:bg-brand-teal hover:text-brand-beige"
          >
            {t('section.academics.meet')}
            <Arrow />
          </Link>
        </div>
      </Container>
    </section>
  );
}
