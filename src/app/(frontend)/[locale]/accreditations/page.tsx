import type { Metadata } from 'next';

import { AccreditationGrid } from '@/components/sections/AccreditationGrid';
import { CallToAction } from '@/components/sections/CallToAction';
import { Container } from '@/components/ui/Container';
import { Link } from '@/components/ui/Link';
import { PageHeader } from '@/components/ui/PageHeader';
import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n/config';
import { setRequestLocale, t } from '@/lib/i18n/server';
import { buildMetadata } from '@/lib/seo';
import {
  getAccreditations,
  getPartners,
  getRecognitionContent,
  getSiteSettings,
} from '@/lib/cms/api';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = isLocale(requested) ? requested : DEFAULT_LOCALE;

  const { content, seo, translated } = await getRecognitionContent(locale);

  return buildMetadata({
    title: seo?.title || content.intro.heading,
    description: seo?.description || content.intro.body,
    path: '/accreditations',
    locale,
    translated,
    seo: seo,
    robots: seo?.robots,
    openGraph: seo?.openGraph,
  });
}

export default async function AccreditationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: requested } = await params;
  const locale = await setRequestLocale(requested);

  // `getAccreditations(locale)` already leaves out anything tied to a partner: a
  // body that accredits IBAS accredits IBAS, not ECC, and belongs on that
  // partner's own page rather than in a list of ECC's own recognition.
  const [{ content }, accreditations, partners, settings] = await Promise.all([
    getRecognitionContent(locale),
    getAccreditations(locale),
    getPartners(locale),
    getSiteSettings(locale),
  ]);

  const withOwn = partners.filter((partner) => partner.accreditations.length);

  return (
    <>
      <PageHeader
        eyebrow={content.intro.eyebrow}
        title={content.intro.heading}
        description={content.intro.body}
      />

      <section className="bg-white py-14 lg:py-20">
        <Container size="wide">
          {accreditations.length ? (
            <AccreditationGrid items={accreditations} />
          ) : (
            <p className="max-w-2xl text-base leading-relaxed text-brand-ink/60">
              {t('empty.accreditations')}{' '}
              <a
                href={`mailto:${settings.contact.email}`}
                className="font-medium text-brand-teal underline"
              >
                {settings.contact.email}
              </a>
              .
            </p>
          )}

          {withOwn.length ? (
            <div className="mt-16 rounded-[var(--radius-brand)] border border-brand-sand bg-brand-beige/40 p-8 sm:p-10">
              <h2 className="text-xl font-bold text-brand-teal">
                {t('section.partners.recognition')}
              </h2>
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-brand-ink/70">
                {t('section.partners.recognition.body')}
              </p>

              <ul className="mt-7 flex flex-wrap gap-2.5">
                {withOwn.map((partner) => (
                  <li key={partner.id}>
                    <Link
                      href={`/partners/${partner.slug}`}
                      aria-label={`${partner.name} — ${partner.accreditations.length} ${
                        partner.accreditations.length === 1
                          ? 'accreditation'
                          : 'accreditations'
                      }`}
                      className="inline-flex items-center gap-2 rounded-full border border-brand-teal px-5 py-2.5 text-sm font-medium text-brand-teal transition-colors hover:bg-brand-teal hover:text-brand-beige"
                    >
                      {partner.name}
                      {/*
                        The digit is visual shorthand only: read aloud on its
                        own it would announce as "IBAS 2", which says nothing.
                        The label on the link spells out what it counts, and
                        opens with the visible name so voice control still
                        matches what a user can see.
                      */}
                      <span className="text-xs opacity-60" aria-hidden>
                        {partner.accreditations.length}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Container>
      </section>

      <CallToAction settings={settings} />
    </>
  );
}
