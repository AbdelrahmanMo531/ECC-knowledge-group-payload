import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { surfaceClass, type Surface } from '@/components/ui/surface';
import { ProgramCard } from '@/components/ui/ProgramCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { Program } from '@/lib/cms/types';
import { t } from '@/lib/i18n/server';

export function ProgramsGrid({
  programs,
  surface,
  showCta = true,
  eyebrow = t('tab.programmes'),
  title = t('section.grid.title'),
  description = t('section.grid.body'),
}: {
  programs: Program[];
  surface?: Surface;
  showCta?: boolean;
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  if (programs.length === 0) return null;

  return (
    <section className={`py-20 lg:py-28 ${surfaceClass(surface)}`}>
      <Container size="wide">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            description={description}
          />
          {showCta ? (
            <Button href="/programs" variant="secondary" className="shrink-0">
              {t('cta.programmes.all')}
            </Button>
          ) : null}
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {programs.map((program) => (
            <div key={program.id} className="relative">
              <ProgramCard program={program} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
