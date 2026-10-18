import Image from 'next/image';

import { CardSlider } from '@/components/ui/CardSlider';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { Accreditation } from '@/lib/cms/types';
import { format } from '@/lib/i18n/dictionary';
import { t } from '@/lib/i18n/server';

function Card({ item }: { item: Accreditation }) {
  return (
    <article className="flex h-full flex-col rounded-[calc(var(--radius-brand)*1.5)] border border-brand-beige/15 bg-brand-beige/[0.06] p-7 transition-colors duration-300 hover:border-brand-gold/40">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg font-bold leading-snug text-brand-beige">
            {item.name}
          </h3>

          {item.issuer ? (
            <p className="mt-1.5 text-xs uppercase tracking-[0.14em] text-brand-gold">
              {item.issuer}
            </p>
          ) : null}
        </div>

        {/*
          The mark sits with the name it belongs to rather than in a separate
          strip, so a visitor reads "this logo, this body, this country" as one
          thing. On white, because accreditation marks are drawn for white.
        */}
        {item.logo?.sourceUrl ? (
          <span className="flex h-14 w-20 shrink-0 items-center justify-center rounded-[var(--radius-brand)] bg-white p-2">
            <Image
              src={item.logo.sourceUrl}
              alt={item.logo.altText || item.name}
              width={120}
              height={60}
              className="max-h-10 w-auto object-contain"
            />
          </span>
        ) : null}
      </div>

      {item.description ? (
        <p className="mt-4 text-sm leading-relaxed text-brand-beige/70">
          {item.description}
        </p>
      ) : null}

      {item.website ? (
        <a
          href={item.website}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-auto inline-flex items-center gap-2 self-start pt-5 text-sm font-medium text-brand-gold transition-colors hover:text-brand-beige"
        >
          {t('cta.verify')}
          <span aria-hidden>↗</span>
        </a>
      ) : null}
    </article>
  );
}

/**
 * The bodies that accredit or recognise a partner.
 *
 * Three or fewer fit a row, so they are a grid; beyond that the cards become a
 * scroller rather than a grid that grows down the page and pushes the
 * programmes out of sight. Both shapes come from `CardSlider`, which the About
 * page's programmes use too.
 */
export function PartnerRecognition({
  id,
  items,
  partnerName,
}: {
  id?: string;
  items: Accreditation[];
  partnerName: string;
}) {
  if (items.length === 0) return null;

  return (
    <section
      id={id}
      className="relative scroll-mt-[9.5rem] overflow-hidden bg-brand-teal py-20 lg:py-24"
    >
      <div
        aria-hidden
        className="bg-logo-pattern pointer-events-none absolute inset-0 opacity-[0.03]"
      />

      <Container size="wide" className="relative">
        <CardSlider
          label={t('aria.accreditations')}
          tone="dark"
          items={items.map((item) => (
            <Card key={item.id} item={item} />
          ))}
          heading={
            <SectionHeading
              eyebrow={t('section.recognition.long')}
              title={t('section.recognition.title')}
              description={format(t('section.recognition.of'), {
                partner: partnerName,
              })}
              tone="dark"
            />
          }
          className="mt-12"
        />
      </Container>
    </section>
  );
}
