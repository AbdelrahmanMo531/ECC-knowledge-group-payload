import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { aboutIntro } from '@/lib/content/site';
import { t } from '@/lib/i18n/server';

export function AboutIntro() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <Container size="wide">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <SectionHeading
              eyebrow={aboutIntro.eyebrow}
              title={aboutIntro.headline}
            />
            <div className="mt-7 space-y-5 text-base leading-relaxed text-brand-ink/75">
              {aboutIntro.body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
            <Button href="/about-us" variant="secondary" className="mt-9">
              {t('section.about.more')}
            </Button>
          </div>

          <div className="lg:col-span-6">
            <ul className="grid gap-4 sm:grid-cols-2">
              {aboutIntro.pillars.map((pillar) => (
                <li
                  key={pillar.title}
                  className="rounded-[var(--radius-brand)] border border-brand-sand/70 bg-brand-beige/50 p-6 transition-colors duration-200 hover:border-brand-turquoise/40 hover:bg-brand-beige"
                >
                  <h3 className="text-lg font-bold text-brand-teal">{pillar.title}</h3>
                  <span aria-hidden className="mt-3 block h-px w-8 bg-brand-gold" />
                  <p className="mt-4 text-sm leading-relaxed text-brand-ink/70">
                    {pillar.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
