import { FaqList } from '@/components/sections/FaqList';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { surfaceClass, type Surface } from '@/components/ui/surface';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { FaqItem } from '@/lib/cms/types';
import { t } from '@/lib/i18n/server';

/**
 * FAQ accordion.
 *
 * The homepage's framing around `FaqList` — a heading and a prompt to get in
 * touch beside the questions. The FAQ page renders the list on its own.
 *
 * The matching FAQPage structured data is emitted from the page, not here.
 */
export function Faq({
  faqs,
  surface,
}: {
  faqs: FaqItem[];
  surface?: Surface;
}) {
  if (faqs.length === 0) return null;

  return (
    <section className={`py-20 lg:py-28 ${surfaceClass(surface)}`}>
      <Container size="wide">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeading
              eyebrow={t('faq.eyebrow')}
              title={t('faq.title')}
              description={t('faq.body')}
            />

            <div className="mt-8 rounded-[var(--radius-brand)] border border-brand-sand bg-white p-6">
              <p className="text-sm leading-relaxed text-brand-ink/70">
                {t('link.deciding.short')}
              </p>
              {/*
                The contact page, not a mail client.

                "Check my eligibility" opened `mailto:` with a subject line
                written in English regardless of the page's language, and on a
                machine with no mail client configured it opened nothing at
                all. The contact page has the form, which is the thing that
                actually reaches anybody.
              */}
              <Button href="/contact" variant="secondary" className="mt-5 w-full">
                {t('cta.contact')}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-8">
            <FaqList faqs={faqs} />
          </div>
        </div>
      </Container>
    </section>
  );
}
