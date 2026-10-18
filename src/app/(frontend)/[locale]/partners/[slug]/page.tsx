import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { redirectIfMoved } from '@/lib/redirects';

import { Link } from '@/components/ui/Link';
import { Logo } from '@/components/brand/Logo';
import { PartnerRecognition } from '@/components/partners/PartnerRecognition';
import { CallToAction } from '@/components/sections/CallToAction';
import { Stats } from '@/components/sections/Stats';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { ProgramCard } from '@/components/ui/ProgramCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SectionTabs, type PageSection } from '@/components/ui/SectionTabs';
import { Flag } from '@/components/ui/Flag';
import { DEFAULT_LOCALE, isLocale, localePath, translatedPaths } from '@/lib/i18n/config';
import { format, translate } from '@/lib/i18n/dictionary';
import { setRequestLocale, t } from '@/lib/i18n/server';
import { buildMetadata, SITE_NAME, siteUrl } from '@/lib/seo';
import { shortName } from '@/lib/text';
import { getPartnerBySlug, getPartnerSlugs, getSiteSettings } from '@/lib/cms/api';
import type { Partner } from '@/lib/cms/types';
import { Arrow } from '@/components/ui/Arrow';

type Params = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  const locale = isLocale(params.locale) ? params.locale : DEFAULT_LOCALE;

  const slugs = await getPartnerSlugs(locale);
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = isLocale(requested) ? requested : DEFAULT_LOCALE;

  const { slug } = await params;
  const partner = await getPartnerBySlug(slug, locale);

  if (!partner) return buildMetadata({ title: translate(locale, 'notfound.partner'), locale });

  return buildMetadata({
    title: partner.seo?.title || partner.name,
    description:
      partner.seo?.description ||
      `${partner.name} in ${partner.country} — an academic partner of ${SITE_NAME}.`,
    path: `/partners/${partner.slug}`,
    locale,
    // Where the same thing lives in the other language, as the CMS knows it —
    // Polylang gives each translation its own slug, so this cannot be guessed
    // from the address. `null` when there is no translation, which is what
    // keeps a crawler and the switcher off a page that does not exist.
    languages: translatedPaths(locale, `/partners/${partner.slug}`, partner.translations),
    image: partner.image?.sourceUrl ?? partner.logo?.sourceUrl,
    seo: partner.seo,
    robots: partner.seo?.robots,
    openGraph: partner.seo?.openGraph,
  });
}

/**
 * The partner as an educational organisation, linked to the programmes it
 * awards so the two are connected in structured data as well as on the page.
 */
function PartnerSchema({ partner }: { partner: Partner }) {
  const url = `${siteUrl()}/partners/${partner.slug}`;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollegeOrUniversity',
          name: partner.name,
          description: partner.description,
          url,
          ...(partner.website ? { sameAs: [partner.website] } : {}),
          ...(partner.logo?.sourceUrl ? { logo: partner.logo.sourceUrl } : {}),
          ...(partner.country
            ? { address: { '@type': 'PostalAddress', addressCountry: partner.country } }
            : {}),
          ...(partner.programs.length
            ? {
                hasOfferCatalog: {
                  '@type': 'OfferCatalog',
                  name: format(t('schema.awarded.by'), {
                    partner: partner.name,
                  }),
                  itemListElement: partner.programs.map((program, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    item: {
                      '@type': 'Course',
                      name: program.title,
                      url: `${siteUrl()}/programs/${program.slug}`,
                      provider: { '@type': 'EducationalOrganization', name: SITE_NAME },
                    },
                  })),
                },
              }
            : {}),
        }).replace(/</g, '\\u003c'),
      }}
    />
  );
}

export default async function PartnerPage({ params }: Params) {
  const { locale: requested } = await params;
  const locale = await setRequestLocale(requested);

  const { slug } = await params;
  const [partner, settings] = await Promise.all([
    getPartnerBySlug(slug, locale),
    getSiteSettings(locale),
  ]);

  if (!partner) {
    await redirectIfMoved(localePath(locale, `/partners/${slug}`));
    notFound();
  }

  const accent = partner.accentColor ?? '#E7DCAA';
  // "… Academy of Switzerland (IBAS)" reads as "IBAS" inside a sentence.
  const short = shortName(partner.name);

  // Counted, not authored: the number of programmes and recognitions is a fact
  // about the content, and an editor should never have to keep it in sync.
  const facts = [
    { label: t('fact.country'), value: partner.country },
    {
      label: partner.programs.length === 1 ? 'Programme' : 'Programmes',
      value: partner.programs.length ? String(partner.programs.length) : null,
    },
    {
      label: partner.accreditations.length === 1 ? 'Accreditation' : 'Accreditations',
      value: partner.accreditations.length
        ? String(partner.accreditations.length)
        : null,
    },
    {
      label: t('fact.levels.awarded'),
      value: [...new Set(partner.programs.map((program) => program.level))].join(' · '),
    },
  ].filter((fact) => fact.value);

  // Same rule as the programme page: a tab only exists for a section that will
  // actually render.
  const sections: PageSection[] = [
    { id: 'about', label: `About ${short}` },
    ...(partner.stats.length ? [{ id: 'figures', label: t('tab.figures') }] : []),
    ...(partner.accreditations.length
      ? [{ id: 'recognition', label: t('tab.accreditation') }]
      : []),
    ...(partner.programs.length
      ? [{ id: 'programmes', label: t('tab.programmes') }]
      : []),
    { id: 'enquire', label: t('tab.enquire') },
  ];

  return (
    <>
      <PartnerSchema partner={partner} />

      {/* ------------------------------------------------------------ Hero */}
      <section className="relative overflow-hidden bg-brand-teal">
        <div
          aria-hidden
          className="bg-logo-pattern pointer-events-none absolute inset-0 opacity-[0.025]"
        />
        {/* The partner's own brand colour, as a wash rather than a block. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -end-32 -top-40 h-[34rem] w-[34rem] rounded-full opacity-25 blur-3xl"
          style={{ backgroundColor: accent }}
        />

        <Container size="wide" className="relative">
          <div className="grid items-center gap-12 py-16 lg:grid-cols-12 lg:py-20">
            <div className="lg:col-span-7">
              <Link
                href="/partners"
                className="text-sm text-brand-gold transition-colors hover:text-brand-beige"
              >
                <Arrow back /> All partners
              </Link>

              {/*
                Logo, flag and country on one line: the mark on its own white
                panel — partner logos are drawn for white — then the country it
                awards from. The large panel to the right belongs to the
                photograph.
              */}
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                {partner.logo?.sourceUrl ? (
                  <span className="flex h-14 items-center rounded-[var(--radius-brand)] bg-white px-4">
                    <Image
                      src={partner.logo.sourceUrl}
                      alt={partner.logo.altText || partner.name}
                      width={220}
                      height={80}
                      className="max-h-9 w-auto object-contain"
                      priority
                    />
                  </span>
                ) : null}

                <span className="flex items-center gap-2.5">
                  <Flag country={partner.country} code={partner.countryCode} size={24} />
                  <span className="text-xs font-medium uppercase tracking-[0.16em] text-brand-gold">
                    {partner.country}
                  </span>
                </span>
              </div>

              <h1 className="mt-4 text-4xl font-bold leading-[1.06] tracking-[-0.025em] text-brand-beige sm:text-5xl">
                {partner.name}
              </h1>

              {/*
                The editor body sits here, under the name — the introduction a
                visitor reads first. The longer "More about" text is its own
                field further down, so the two are separate pieces of writing.
              */}
              {partner.content ? (
                <div
                  className="prose-ecc prose-on-dark mt-6 max-w-xl"
                  dangerouslySetInnerHTML={{ __html: partner.content }}
                />
              ) : (
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-beige/75">
                  {partner.description}
                </p>
              )}

              <div className="mt-9 flex flex-wrap gap-4">
                {partner.programs.length > 0 ? (
                  <Button href="#programmes" variant="onDarkSolid">
                    {t('link.programmes.see')}
                  </Button>
                ) : null}
                {partner.website ? (
                  <Button href={partner.website} variant="onDark">
                    {t('link.institution')} ↗
                  </Button>
                ) : null}
              </div>
            </div>

            {/* The photograph. The logo has its own place on the left, so a
                partner with no photograph falls straight through to the mark
                rather than repeating the logo at four times the size. */}
            <div className="lg:col-span-5">
              <div className="relative">
                <span
                  aria-hidden
                  className="absolute -bottom-5 -end-5 h-full w-full rounded-[calc(var(--radius-brand)*2)] border border-brand-gold/50"
                />
                <div className="relative overflow-hidden rounded-[calc(var(--radius-brand)*2)] bg-white">
                  {partner.image?.sourceUrl ? (
                    <Image
                      src={partner.image.sourceUrl}
                      alt={partner.image.altText || partner.name}
                      width={partner.image.mediaDetails?.width ?? 900}
                      height={partner.image.mediaDetails?.height ?? 700}
                      className="aspect-[4/3] w-full object-cover"
                      priority
                    />
                  ) : (
                    <div className="bg-brand-gradient-teal flex aspect-[4/3] w-full items-center justify-center">
                      <Logo lockup="mark" variant="cream" height={130} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>

        {facts.length > 0 ? (
          <div className="relative border-t border-brand-beige/10">
            <Container size="wide">
              <dl className="grid grid-cols-2 gap-px py-2 sm:grid-cols-4">
                {facts.map((fact) => (
                  <div key={fact.label} className="px-2 py-5">
                    <dt className="text-[0.7rem] uppercase tracking-[0.14em] text-brand-beige/45">
                      {fact.label}
                    </dt>
                    <dd className="mt-1.5 text-sm font-medium text-brand-beige">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Container>
          </div>
        ) : null}
      </section>

      {/*
        Everything below the hero is one track: the tab bar pins to the top of
        it and its progress rail is measured against its height.
      */}
      <div id="partner-body">
        <SectionTabs sections={sections} trackId="partner-body" />

      {/* --------------------------------------------- About the partner */}
      {/*
        Always rendered. The body is the editor's "More about" text when there
        is one and the summary when there is not — a partner page with no
        prose at all would be a hero followed by a list of programmes.
      */}
      <section id="about" className="scroll-mt-[9.5rem] bg-white py-20 lg:py-24">
        <Container size="wide">
          <SectionHeading
            eyebrow={t('section.partner.about')}
            title={format(t('section.partner.more'), { partner: short })}
          />

          <div className="mt-10 grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className={partner.mission ? 'lg:col-span-7' : 'lg:col-span-8'}>
              {/*
                The "About the partner" field, not the editor body — that one
                is in the hero. With neither, the summary stands in rather than
                leaving a heading over nothing.
              */}
              {partner.about.length > 0 ? (
                <div className="space-y-5">
                  {partner.about.map((paragraph, index) => (
                    <p
                      key={`${index}-${paragraph.slice(0, 32)}`}
                      className="text-base leading-relaxed text-brand-ink/75"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-base leading-relaxed text-brand-ink/75">
                  {partner.description}
                </p>
              )}

              {partner.website ? (
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-brand-turquoise transition-colors hover:text-brand-teal"
                >
                  {`Visit ${short}`}
                  <span aria-hidden>↗</span>
                </a>
              ) : null}
            </div>

            {partner.mission ? (
              <aside className="lg:col-span-5">
                <div className="relative h-full overflow-hidden rounded-[calc(var(--radius-brand)*1.5)] bg-brand-beige/70 p-9">
                  <span
                    aria-hidden
                    className="absolute end-6 top-2 font-serif text-[7rem] leading-none text-brand-gold/25"
                  >
                    &rdquo;
                  </span>

                  <div className="relative">
                    <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-brand-turquoise">
                      {t('section.mission.short')}
                    </h3>
                    <p className="mt-5 font-serif text-xl leading-relaxed text-brand-teal">
                      {partner.mission}
                    </p>
                    <span
                      aria-hidden
                      className="mt-6 block h-1 w-12 rounded-full"
                      style={{ backgroundColor: accent }}
                    />
                  </div>
                </div>
              </aside>
            ) : null}
          </div>

          {partner.values.length > 0 ? (
            <div className="mt-16">
              <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-brand-turquoise">
                {t('section.values.short')}
              </h3>

              <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {partner.values.map((value, index) => (
                  <li
                    key={`${index}-${value.title}`}
                    className="relative overflow-hidden rounded-[calc(var(--radius-brand)*1.5)] border border-brand-sand/70 bg-brand-beige/25 p-8"
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -end-2 -top-6 font-serif text-[7rem] font-bold leading-none text-brand-teal/[0.05]"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <div className="relative">
                      <h4 className="text-lg font-bold text-brand-teal">
                        {value.title}
                      </h4>
                      <span
                        aria-hidden
                        className="mt-4 block h-px w-10 bg-brand-gold"
                      />
                      <p className="mt-4 text-sm leading-relaxed text-brand-ink/70">
                        {value.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Container>
      </section>

      {/*
        The same gold band as the homepage, run tighter and without icons: the
        figures are the point here, and a partner page already carries the
        institution's own mark above.
      */}
      <Stats stats={partner.stats} icons={false} compact id="figures" />

      <PartnerRecognition
        id="recognition"
        items={partner.accreditations}
        partnerName={short}
      />

      {/* ------------------------------------------------------ Programmes */}
      {partner.programs.length > 0 ? (
        <section
          id="programmes"
          className="scroll-mt-[9.5rem] bg-brand-beige/50 py-20 lg:py-24"
        >
          <Container size="wide">
            <SectionHeading
              eyebrow={t('section.partner.awarded')}
              title={t('section.partner.programmes')}
              description={format(t('section.partner.delivered'), {
                site: SITE_NAME,
                partner: short,
              })}
            />

            {/*
              Columns follow the count. A fixed three-column grid leaves an
              empty cell — and an oddly wide gap — whenever a partner awards
              one or two programmes, which most of them do.
            */}
            <ul
              className={`mt-12 grid gap-6 ${
                partner.programs.length === 1
                  ? 'max-w-md'
                  : partner.programs.length === 2
                    ? 'md:grid-cols-2'
                    : 'md:grid-cols-2 xl:grid-cols-3'
              }`}
            >
              {partner.programs.map((program) => (
                <li key={program.id} className="flex">
                  <ProgramCard program={program} showAwardingBody={false} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

        <CallToAction id="enquire" settings={settings} surface="light" />
      </div>
    </>
  );
}
