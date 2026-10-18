import { AccreditationCard } from '@/components/sections/AccreditationCard';
import { CardSlider } from '@/components/ui/CardSlider';
import { Container } from '@/components/ui/Container';
import { surfaceClass, type Surface } from '@/components/ui/surface';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { Accreditation } from '@/lib/cms/types';
import { t } from '@/lib/i18n/server';

/**
 * Accreditation badges.
 *
 * Where an issuer link exists the card becomes a link to it — a claim a visitor
 * can check themselves is worth far more than one they have to take on trust,
 * and this is the single biggest objection for an international award.
 */
export function Accreditations({
  items,
  surface,
  id,
  title,
  description,
}: {
  items: Accreditation[];
  surface?: Surface;
  /** Anchor target, so in-page navigation can link to the section. */
  id?: string;
  /** Overrides the built-in heading, e.g. with copy authored for a page. */
  title?: string;
  description?: string;
}) {
  if (items.length === 0) return null;

  return (
    <section
      id={id}
      className={`scroll-mt-[9.5rem] py-20 lg:py-24 ${surfaceClass(surface)}`}
    >
      <Container size="wide">
        <SectionHeading
          align="center"
          eyebrow={t('section.recognition')}
          title={title ?? t('section.verify.title')}
          description={
            description ??
            t('section.verify.body')
          }
          className="mx-auto"
        />

        {/*
          Past three, a slider.

          Ten accreditations as a grid is four rows of tall cards between the
          section above and the section below, and a visitor scrolling the
          homepage is not reading all ten — they are checking that there are
          some. The slider says how many there are and gets out of the way. The
          accreditations page still shows every one at once, where that is the
          point of the page.
        */}
        <div className="mt-14">
          <CardSlider
            label={t('section.recognition')}
            items={items.map((item) => (
              <AccreditationCard key={item.id} item={item} />
            ))}
            gridClassName="sm:grid-cols-2 lg:grid-cols-3"
            itemClassName="w-[20rem] sm:w-[22rem]"
          />
        </div>
      </Container>
    </section>
  );
}
