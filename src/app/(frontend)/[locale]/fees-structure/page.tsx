import type { Metadata } from 'next';

import { FeeCards } from '@/components/fees/FeeCards';
import { LeadTrigger } from '@/components/forms/LeadTrigger';
import { CallToAction } from '@/components/sections/CallToAction';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { isFeatured, paymentAccent, type PaymentAccent } from '@/lib/fees';
import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n/config';
import { setRequestLocale, t } from '@/lib/i18n/server';
import { buildMetadata } from '@/lib/seo';
import { getFeesContent, getSiteSettings } from '@/lib/cms/api';
import type { QuestionAnswer, ValueProp } from '@/lib/cms/types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = isLocale(requested) ? requested : DEFAULT_LOCALE;

  const { content, seo, translated } = await getFeesContent(locale);

  return buildMetadata({
    title: seo?.title || content.intro.heading,
    description: seo?.description || content.intro.body,
    path: '/fees-structure',
    locale,
    translated,
    seo: seo,
    robots: seo?.robots,
    openGraph: seo?.openGraph,
  });
}

export default async function FeesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: requested } = await params;
  const locale = await setRequestLocale(requested);

  const [{ content }, settings] = await Promise.all([
    getFeesContent(locale),
    getSiteSettings(locale),
  ]);

  return (
    <>
      {content.refund.questions.length ? (
        <RefundSchema questions={content.refund.questions} />
      ) : null}

      <PageHeader
        eyebrow={content.intro.eyebrow}
        title={content.intro.heading}
        description={content.intro.body}
      >
        {content.highlights.length ? (
          <ul className="mt-9 flex flex-wrap gap-2.5">
            {content.highlights.map((claim) => (
              <li
                key={claim}
                className="inline-flex items-center gap-2 rounded-full border border-brand-teal/15 bg-white/70 px-4 py-2 text-sm font-medium text-brand-teal backdrop-blur-sm"
              >
                <TickIcon />
                {claim}
              </li>
            ))}
          </ul>
        ) : null}
      </PageHeader>

      {/* --------------------------------------------- what each fee covers */}
      <section className="bg-white py-16 lg:py-24">
        <Container size="wide">
          <SectionHeading
            eyebrow={t('fees.what')}
            title={content.breakdown.heading}
            description={content.breakdown.body}
          />

          <div className="mt-12">
            <FeeCards items={content.breakdown.items} />
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------- the quote */}
      {content.quote ? (
        <section className="bg-brand-gradient-teal relative overflow-hidden py-16 lg:py-20">
          <div
            aria-hidden
            className="bg-logo-pattern pointer-events-none absolute inset-0 opacity-[0.05]"
          />

          <Container>
            <figure className="relative mx-auto max-w-3xl text-center">
              <span
                aria-hidden
                className="block font-serif text-6xl leading-none text-brand-gold"
              >
                &ldquo;
              </span>
              <blockquote className="mt-3">
                <p className="font-serif text-2xl font-bold leading-snug text-brand-beige sm:text-[1.75rem]">
                  {content.quote}
                </p>
              </blockquote>
              <span
                aria-hidden
                className="mx-auto mt-8 block h-px w-16 bg-brand-gold"
              />
            </figure>
          </Container>
        </section>
      ) : null}

      {/* -------------------------------------------------- paying for it */}
      <section className="bg-brand-beige/40 py-16 lg:py-24">
        <Container size="wide">
          <SectionHeading
            eyebrow={t('fees.payments')}
            title={content.payments.heading}
            description={content.payments.body}
          />

          <ul className="mt-12 grid items-stretch gap-6 lg:grid-cols-3">
            {content.payments.items.map((option, index) => (
              <PaymentCard key={option.title} option={option} index={index} />
            ))}
          </ul>

          {/*
            The question this page raises and cannot answer: what will *my*
            programme cost? Asking it here, where it is being asked, beats
            leaving it to the bottom of the page.
          */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-center">
            <p className="text-base text-brand-ink/70">
              {t('fees.ask')}
            </p>
            <LeadTrigger variant="primary">{t('cta.advisor.ask')}</LeadTrigger>
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------- the value */}
      <section className="bg-white py-16 lg:py-24">
        <Container size="wide">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow={t('fees.value')}
                title={content.value.heading}
                description={content.value.body}
              />
            </div>

            <ol className="lg:col-span-7">
              {content.value.points.map((point, index) => (
                <li
                  key={point}
                  className="flex gap-6 border-t border-brand-sand/70 py-7 first:border-t-0 first:pt-0"
                >
                  <span
                    aria-hidden
                    className="font-serif text-3xl font-bold leading-none text-brand-gold"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="text-base leading-relaxed text-brand-ink/75 sm:text-lg">
                    {point}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------- refunds */}
      <section className="bg-brand-beige/40 py-16 lg:py-24">
        <Container size="wide">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <SectionHeading
                eyebrow={t('fees.refunds')}
                title={content.refund.heading}
                description={content.refund.body}
              />
            </div>

            <div className="lg:col-span-8">
              <ul className="space-y-3">
                {content.refund.questions.map((item) => (
                  <li key={item.question}>
                    <details className="group rounded-[var(--radius-brand)] border border-brand-sand/70 bg-white [&_summary::-webkit-details-marker]:hidden">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-6 p-6 text-base font-semibold text-brand-teal">
                        {item.question}
                        <span
                          aria-hidden
                          className="mt-0.5 shrink-0 text-brand-turquoise transition-transform duration-300 group-open:rotate-180"
                        >
                          <ChevronIcon />
                        </span>
                      </summary>
                      <p className="px-6 pb-6 text-base leading-relaxed text-brand-ink/70">
                        {item.answer}
                      </p>
                    </details>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <CallToAction settings={settings} />
    </>
  );
}

/**
 * One way to pay.
 *
 * The option carrying a discount is drawn as the recommendation — on a teal
 * ground with the saving on a badge — because three identical cards ask the
 * visitor to compare three things they have no basis to compare, and this is
 * the one with an answer in it.
 */
function PaymentCard({ option, index }: { option: ValueProp; index: number }) {
  const accent = paymentAccent(option.description);
  const featured = isFeatured(accent);

  return (
    <li
      className={`relative flex flex-col rounded-[calc(var(--radius-brand)*1.5)] border p-8 transition-all duration-300 ease-[var(--ease-brand)] hover:-translate-y-1 ${
        featured
          ? 'border-brand-teal bg-brand-teal text-brand-beige shadow-xl shadow-brand-teal/15'
          : 'border-brand-sand/70 bg-white hover:shadow-lg hover:shadow-brand-teal/[0.06]'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          aria-hidden
          className={`text-xs uppercase tracking-[0.16em] ${
            featured ? 'text-brand-gold' : 'text-brand-turquoise'
          }`}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        <Badge accent={accent} />
      </div>

      <h3
        className={`mt-5 font-serif text-2xl font-bold leading-tight ${
          featured ? 'text-brand-beige' : 'text-brand-teal'
        }`}
      >
        {option.title}
      </h3>

      <p
        className={`mt-4 pb-8 text-base leading-relaxed ${
          featured ? 'text-brand-beige/75' : 'text-brand-ink/70'
        }`}
      >
        {option.description}
      </p>

      {accent?.kind === 'installments' ? (
        <ul className="mt-6 flex flex-wrap gap-2" aria-hidden>
          {accent.options.map((months) => (
            <li
              key={months}
              className="rounded-full border border-brand-turquoise/30 bg-brand-beige/50 px-3.5 py-1.5 text-xs font-semibold text-brand-teal"
            >
              {months} months
            </li>
          ))}
        </ul>
      ) : null}

      {/*
        Pushed to the bottom so the rule lines up across cards of different
        heights. The spacing above it is padding, not a second margin — two
        margin utilities on one element are resolved by stylesheet order, and
        `mt-auto` would lose.
      */}
      <span
        aria-hidden
        className={`mt-auto block h-1 w-12 rounded-full ${
          featured ? 'bg-brand-gold' : 'bg-brand-sand'
        }`}
        style={{ marginTop: 'auto' }}
      />
    </li>
  );
}

/** The saving, where the copy names one. */
function Badge({ accent }: { accent: PaymentAccent }) {
  if (accent?.kind !== 'discount') return null;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-teal">
      Save {accent.label}
    </span>
  );
}

/**
 * FAQPage structured data for the refund questions.
 *
 * "Can I get a refund" is typed into a search box far more often than it is
 * typed into a site, so the answer is worth publishing in the form a result
 * can be built from. Generated from the same questions the page renders, so
 * the two cannot drift.
 */
function RefundSchema({ questions }: { questions: QuestionAnswer[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: questions.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          })),
        }).replace(/</g, '\\u003c'),
      }}
    />
  );
}

function TickIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      className="text-brand-gold"
    >
      <path d="m5 13 4.5 4.5L19 7" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
