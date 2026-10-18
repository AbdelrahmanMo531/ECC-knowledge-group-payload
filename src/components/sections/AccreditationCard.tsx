import Image from 'next/image';

import type { Accreditation } from '@/lib/cms/types';
import { t } from '@/lib/i18n/server';

/**
 * One accreditation badge.
 *
 * Where an issuer link exists the card becomes a link to it — a claim a visitor
 * can check themselves is worth far more than one they have to take on trust,
 * and this is the single biggest objection for an international award.
 *
 * Its own component so the grid on the accreditations page and the slider on
 * the homepage render the same card rather than two that drift apart.
 */
export function AccreditationCard({ item }: { item: Accreditation }) {
  const inner = (
    <>
      {item.logo?.sourceUrl ? (
        <Image
          src={item.logo.sourceUrl}
          alt={item.logo.altText || item.name}
          width={180}
          height={72}
          className="mx-auto h-16 w-auto object-contain"
        />
      ) : (
        <span
          aria-hidden
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-brand-gold/50 font-serif text-2xl text-brand-teal"
        >
          {item.name.charAt(0)}
        </span>
      )}

      <h3 className="mt-6 text-base font-bold text-brand-teal">{item.name}</h3>

      {item.issuer ? (
        <p className="mt-1.5 text-xs uppercase tracking-[0.14em] text-brand-turquoise">
          {item.issuer}
        </p>
      ) : null}

      {item.description ? (
        <p className="mt-4 text-sm leading-relaxed text-brand-ink/65">
          {item.description}
        </p>
      ) : null}

      {item.website ? (
        <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-brand-turquoise">
          {t('cta.verify')}
          <span aria-hidden>↗</span>
        </span>
      ) : null}
    </>
  );

  const shell =
    'flex h-full w-full flex-col rounded-[calc(var(--radius-brand)*1.5)] border border-brand-sand/70 bg-white p-8 text-center transition-all duration-300 ease-[var(--ease-brand)]';

  if (!item.website) return <div className={shell}>{inner}</div>;

  return (
    <a
      href={item.website}
      target="_blank"
      rel="noreferrer noopener"
      className={`${shell} hover:-translate-y-1 hover:border-brand-turquoise/40 hover:shadow-lg hover:shadow-brand-teal/[0.06]`}
    >
      {inner}
    </a>
  );
}
