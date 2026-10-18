import { Modules } from '@/components/programs/Modules';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { t } from '@/lib/i18n/server';
import { isStaged, isTabular } from '@/lib/programs/curriculum';
import type { CurriculumGroup } from '@/lib/cms/types';

/**
 * The taught curriculum, in whichever shape the programme has.
 *
 * A master's runs one flat set of core modules and puts its variety in the
 * majors. A bachelor's has no majors at all: its structure *is* the three
 * years, each introduced in its own words. Both are the same field in the CMS —
 * whether the modules name a stage is what decides which of the two renders.
 */
export function CurriculumSection({
  id,
  groups,
  hasMajors,
}: {
  id?: string;
  groups: CurriculumGroup[];
  /** Changes the copy: with majors, these are the modules everyone shares. */
  hasMajors?: boolean;
}) {
  if (groups.length === 0) return null;

  const staged = isStaged(groups);
  // Every group a table means the programme publishes a schedule rather than a
  // documented syllabus, and the section's own copy should not promise prose
  // that is not there.
  const tabular = groups.every((group) => isTabular(group.modules));

  return (
    <section id={id} className="scroll-mt-[9.5rem] bg-white py-20 lg:py-24">
      <Container size="narrow">
        <SectionHeading
          eyebrow={t('section.curriculum')}
          title={staged ? t('section.structure') : t('section.core')}
          description={
            staged
              ? tabular
                ? t('section.structure.body')
                : t('section.structure.body.units')
              : tabular
                ? t('section.modules.body')
                : hasMajors
                  ? t('section.core.body')
                  : t('section.core.body.short')
          }
        />

        {staged ? (
          <div className="mt-12 space-y-14">
            {groups.map((group, index) => (
              <div key={group.title ?? `stage-${index}`}>
                <div className="flex items-baseline gap-4">
                  <span
                    aria-hidden
                    className="font-serif text-3xl font-bold leading-none text-brand-gold"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-2xl font-bold leading-tight text-brand-teal">
                    {group.title ?? t('section.also.taught')}
                  </h3>
                </div>

                {group.subtitle ? (
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-ink/70">
                    {group.subtitle}
                  </p>
                ) : null}

                <Modules
                  modules={group.modules}
                  aimsLabel="Unit objectives"
                  className="mt-7"
                />
              </div>
            ))}
          </div>
        ) : (
          <Modules modules={groups[0].modules} className="mt-10" />
        )}
      </Container>
    </section>
  );
}
