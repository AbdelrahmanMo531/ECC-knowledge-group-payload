import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { redirectIfMoved } from '@/lib/redirects';

import { Link } from '@/components/ui/Link';
import { Logo } from '@/components/brand/Logo';
import { BrochureButton } from '@/components/programs/BrochureButton';
import { CurriculumSection } from '@/components/programs/CurriculumSection';
import { MajorExplorer } from '@/components/programs/MajorExplorer';
import { SectionTabs, type PageSection } from '@/components/ui/SectionTabs';
import { LeadTrigger } from '@/components/forms/LeadTrigger';
import { AccreditationMarquee } from '@/components/sections/AccreditationMarquee';
import { CallToAction } from '@/components/sections/CallToAction';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { DEFAULT_LOCALE, isLocale, localePath, translatedPaths } from '@/lib/i18n/config';
import { format, translate } from '@/lib/i18n/dictionary';
import { setRequestLocale, t } from '@/lib/i18n/server';
import { buildMetadata, SITE_NAME, siteUrl } from '@/lib/seo';
import { getProgramBySlug, getProgramSlugs, getSiteSettings } from '@/lib/cms/api';
import type { Program } from '@/lib/cms/types';
import { Arrow } from '@/components/ui/Arrow';

type Params = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  const locale = isLocale(params.locale) ? params.locale : DEFAULT_LOCALE;

  const slugs = await getProgramSlugs(locale);
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = isLocale(requested) ? requested : DEFAULT_LOCALE;

  const { slug } = await params;
  const program = await getProgramBySlug(slug, locale);

  if (!program) return buildMetadata({ title: translate(locale, 'notfound.programme'), locale });

  return buildMetadata({
    title: program.seo?.title || program.title,
    description: program.seo?.description || program.excerpt,
    path: `/programs/${program.slug}`,
    locale,
    // Where the same thing lives in the other language, as the CMS knows it.
    // A programme is one localized document with one slug, so this is the same
    // address under the other prefix; going through `translatedPaths` keeps it
    // on the rule pages and articles follow, where the slug can differ and
    // `null` is what keeps a crawler and the switcher off a missing page.
    languages: translatedPaths(locale, `/programs/${program.slug}`, program.translations),
    image: program.featuredImage?.sourceUrl,
    type: 'article',
    seo: program.seo,
    robots: program.seo?.robots,
    openGraph: program.seo?.openGraph,
  });
}

/** Course structured data, so the programme can surface in course listings. */
function CourseSchema({ program }: { program: Program }) {
  const url = `${siteUrl()}/programs/${program.slug}`;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: program.title,
          description: program.excerpt,
          url,
          provider: {
            '@type': 'EducationalOrganization',
            name: SITE_NAME,
            '@id': `${siteUrl()}/#organization`,
          },
          ...(program.awardingBody
            ? { educationalCredentialAwarded: program.awardingBody }
            : {}),
          ...(program.learningOutcomes.length
            ? { teaches: program.learningOutcomes }
            : {}),
          hasCourseInstance: {
            '@type': 'CourseInstance',
            courseMode: 'online',
            ...(program.duration ? { courseWorkload: program.duration } : {}),
          },
        }).replace(/</g, '\\u003c'),
      }}
    />
  );
}

export default async function ProgramPage({ params }: Params) {
  const { locale: requested } = await params;
  const locale = await setRequestLocale(requested);

  const { slug } = await params;
  const [program, settings] = await Promise.all([
    getProgramBySlug(slug, locale),
    getSiteSettings(locale),
  ]);

  if (!program) {
    await redirectIfMoved(localePath(locale, `/programs/${slug}`));
    notFound();
  }

  // The accrediting bodies belong to the partner. Named here so the section
  // below and the check that decides whether to render it read the same list.
  const partnerAccreditations = program.partner?.accreditations ?? [];

  const facts = [
    { label: t('fact.level'), value: program.level },
    { label: t('fact.credits'), value: program.credits },
    { label: t('fact.duration'), value: program.duration },
    { label: t('fact.mode'), value: program.studyMode },
    { label: t('fact.language'), value: program.language },
  ].filter((fact) => fact.value);

  // Sections hide themselves when their content is empty, so the tab bar is
  // built from what will actually render — a tab that scrolls nowhere is worse
  // than no tab.
  const sections: PageSection[] = [
    { id: 'overview', label: t('tab.overview') },
    ...(program.whyStudy.length ? [{ id: 'why-study', label: t('tab.why') }] : []),
    ...(program.curriculum.length
      ? [
          {
            id: 'curriculum',
            // "Structure" is what a bachelor's page shows; "Curriculum" covers
            // the flat module list a master's has.
            label: program.curriculum.some((group) => group.title)
              ? t('tab.structure')
              : t('tab.curriculum'),
          },
        ]
      : []),
    ...(program.majors.length ? [{ id: 'majors', label: t('tab.majors') }] : []),
    { id: 'apply', label: t('tab.apply') },
  ];

  return (
    <>
      <CourseSchema program={program} />

      {/* ------------------------------------------------------------ Hero */}
      <section className="relative overflow-hidden bg-brand-teal">
        <div
          aria-hidden
          className="bg-logo-pattern pointer-events-none absolute inset-0 opacity-[0.025]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -end-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-brand-turquoise/25 blur-3xl"
        />

        <Container size="wide" className="relative">
          <div className="grid items-center gap-12 py-16 lg:grid-cols-12 lg:gap-12 lg:py-20">
            <div className="lg:col-span-7">
              <Link
                href="/programs"
                className="text-sm text-brand-gold transition-colors hover:text-brand-beige"
              >
                <Arrow back /> {t('cta.programmes.all')}
              </Link>

              {/*
                Linked to the partner's own page when the programme names one,
                so "who awards this degree" is one click from the question
                rather than a claim the visitor has to take on trust.

                Both are `flex w-fit`, not `inline-flex`: each has to start its
                own row. Inline, they flowed onto the end of the line above and
                sat beside the breadcrumb. `w-fit` keeps each hugging its
                contents rather than stretching across the column.
              */}
              {program.partner ? (
                <Link
                  href={`/partners/${program.partner.slug}`}
                  className="mt-7 flex w-fit items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-brand-gold transition-colors hover:text-brand-beige"
                >
                  {program.partner.name}
                  <Arrow />
                </Link>
              ) : program.awardingBody ? (
                <p className="mt-7 text-xs font-medium uppercase tracking-[0.16em] text-brand-gold">
                  {program.awardingBody}
                </p>
              ) : null}

              {/*
                The mark comes after both links, not between them, and leads
                straight into the title — nothing separates the two.

                On a white tile rather than bare on the teal: a partner's logo
                is supplied for a light ground and most are dark ink, which on
                the hero would be a rectangle of nothing.
              */}
              {program.partner?.logo?.sourceUrl ? (
                <Link
                  href={`/partners/${program.partner.slug}`}
                  // Out of the tab order and hidden from assistive tech: the
                  // partner's name sits directly above with the same
                  // destination, and two adjacent links to one place is one
                  // stop too many on a keyboard and one announcement too many
                  // in a screen reader. Still clickable, because a logo looks
                  // clickable.
                  tabIndex={-1}
                  aria-hidden
                  className="mt-5 flex w-fit items-center justify-center rounded-[var(--radius-brand)] bg-white p-3 transition-transform duration-200 ease-[var(--ease-brand)] hover:-translate-y-0.5"
                >
                  <Image
                    src={program.partner.logo.sourceUrl}
                    alt=""
                    width={program.partner.logo.mediaDetails?.width ?? 240}
                    height={program.partner.logo.mediaDetails?.height ?? 80}
                    className="h-11 w-auto object-contain"
                  />
                </Link>
              ) : null}

              {/*
                A little further from the mark than from the institution's
                name: the name is a line of text the title follows on from, the
                mark is a block, and 12px under a white tile reads as the two
                being stuck together.
              */}
              <h1
                className={`text-4xl font-bold leading-[1.06] tracking-[-0.025em] text-brand-beige sm:text-5xl ${
                  program.partner?.logo?.sourceUrl ? 'mt-5' : 'mt-3'
                }`}
              >
                {program.title}
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-beige/75">
                {program.excerpt}
              </p>

              {program.accreditations.length > 0 ? (
                <ul className="mt-7 flex flex-wrap gap-2.5">
                  {program.accreditations.map((body, index) => (
                    <li
                      key={`${index}-${body}`}
                      className="rounded-full border border-brand-gold/40 px-3.5 py-1.5 text-xs font-medium tracking-wide text-brand-gold"
                    >
                      {body}
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-9 flex flex-wrap gap-4">
                {/*
                  Opened with this programme already chosen — and with the
                  partner that awards it, which is what the programme select
                  narrows on. Someone who has read this far has answered both
                  questions by being here.
                */}
                <LeadTrigger
                  variant="onDarkSolid"
                  defaults={{
                    programme: program.title,
                    institution: program.partner?.name ?? '',
                  }}
                >
                  {t('cta.enquire')}
                </LeadTrigger>
                {program.brochure ? (
                  <BrochureButton
                    brochure={program.brochure}
                    context={program.title}
                    tone="onDark"
                  />
                ) : (
                  <Button
                    href={`mailto:${settings.contact.email}?subject=${encodeURIComponent(
                      format(t('mail.prospectus'), {
                        programme: program.title,
                      }),
                    )}`}
                    variant="onDark"
                  >
                    {t('cta.prospectus')}
                  </Button>
                )}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative">
                <span
                  aria-hidden
                  className="absolute -bottom-5 -end-5 h-full w-full rounded-[calc(var(--radius-brand)*2)] border border-brand-gold/50"
                />
                <div className="relative overflow-hidden rounded-[calc(var(--radius-brand)*2)] bg-teal-900">
                  {program.featuredImage?.sourceUrl ? (
                    <Image
                      src={program.featuredImage.sourceUrl}
                      alt={program.featuredImage.altText || program.title}
                      width={program.featuredImage.mediaDetails?.width ?? 900}
                      height={program.featuredImage.mediaDetails?.height ?? 700}
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

        {/* Fact strip — the answers a prospective student scans for first. */}
        {facts.length > 0 ? (
          <div className="relative border-t border-brand-beige/10">
            <Container size="wide">
              <dl className="grid grid-cols-2 gap-px py-2 sm:grid-cols-3 lg:grid-cols-5">
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
        it and its progress rail is measured against its height, so the rail
        reads 100% exactly when the programme ends and the footer begins.
      */}
      <div id="program-body">
        <SectionTabs
          sections={sections}
          trackId="program-body"
          action={
            <BrochureButton
              brochure={program.brochure}
              context={program.title}
              tone="quiet"
              size="sm"
            />
          }
        />

        {/* -------------------------------------------------------- Overview */}
        <section id="overview" className="scroll-mt-[9.5rem] bg-white py-20 lg:py-24">
          <Container size="wide">
            <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-7">
                <SectionHeading eyebrow={t('tab.overview')} title={t('programme.about')} />

                {program.content ? (
                  <div
                    className="prose-ecc mt-8"
                    // HTML rendered on the server from the rich text editors write in the admin.
                    dangerouslySetInnerHTML={{ __html: program.content }}
                  />
                ) : (
                  <p className="mt-8 text-base leading-relaxed text-brand-ink/70">
                    {program.excerpt}
                  </p>
                )}

                {program.learningOutcomes.length > 0 ? (
                  <div className="mt-12">
                    <h3 className="text-xl font-bold text-brand-teal">
                      {t('section.outcomes')}
                    </h3>
                    <span aria-hidden className="mt-4 block h-px w-12 bg-brand-gold" />

                    <ul className="mt-6 space-y-4">
                      {program.learningOutcomes.map((outcome, index) => (
                        <li key={`${index}-${outcome}`} className="flex gap-3.5">
                          <span
                            aria-hidden
                            className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-gold/30 text-brand-teal"
                          >
                            <svg width="12" height="12" viewBox="0 0 16 16">
                              <path
                                d="M3.5 8.5l3 3 6-6.5"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                          <span className="text-base leading-relaxed text-brand-ink/75">
                            {outcome}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              {/* Sticky summary */}
              <aside className="lg:col-span-5">
                <div className="lg:sticky lg:top-28">
                  {program.highlights.length > 0 ? (
                    <div className="rounded-[calc(var(--radius-brand)*1.5)] bg-brand-beige/70 p-7">
                      <h3 className="text-lg font-bold text-brand-teal">
                        {t('programme.glance')}
                      </h3>
                      <span aria-hidden className="mt-4 block h-px w-10 bg-brand-gold" />
                      <ul className="mt-5 space-y-4">
                        {program.highlights.map((highlight, index) => (
                          <li
                            key={`${index}-${highlight}`}
                            className="flex gap-3 text-sm leading-relaxed text-brand-ink/75"
                          >
                            <span
                              aria-hidden
                              className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-turquoise"
                            />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {program.careers.length > 0 ? (
                    <div className="mt-6 rounded-[calc(var(--radius-brand)*1.5)] bg-brand-teal p-7">
                      <h3 className="text-lg font-bold text-brand-beige">
                        {t('programme.careers')}
                      </h3>
                      <p className="mt-2 text-sm text-brand-beige/65">
                        {t('section.careers.body')}
                      </p>
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {program.careers.map((role, index) => (
                          <li
                            key={`${index}-${role}`}
                            className="rounded-full border border-brand-beige/25 px-3.5 py-1.5 text-xs text-brand-beige/85"
                          >
                            {role}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </aside>
            </div>
          </Container>
        </section>

        {/* --------------------------------------- Who accredits the awarder */}
        {/*
          The partner's accrediting bodies, not the programme's.

          A programme page makes one claim a visitor cannot check for
          themselves — that the degree is worth something outside this website
          — and the answer is who recognises the institution awarding it. That
          belongs to the partner, so it is read from the partner and an editor
          maintains it once rather than on every programme the partner awards.

          The same marquee the homepage uses: it scrolls on its own, pauses on
          hover, and under `prefers-reduced-motion` stops and becomes a plain
          scroller the visitor drives. Renders nothing when the partner has no
          accreditations linked, which is most of them until someone links
          them.

          The marquee alone, with the small "Awarded by" label it carries
          itself. It used to sit under a full section heading — an eyebrow, a
          38px title, a rule and a paragraph — for a strip of five logos, which
          announced far more than it delivered and pushed the programme's own
          content down the page. The claim it makes is already made in the hero
          and on the accreditations page; here it is a band of marks, and the
          band says what it is.
        */}
        <AccreditationMarquee items={partnerAccreditations} surface="tint" />

        {/* ----------------------------------------------------- Why study */}
        {program.whyStudy.length > 0 ? (
          <section
            id="why-study"
            className="scroll-mt-[9.5rem] bg-brand-beige/60 py-20 lg:py-24"
          >
            <Container size="wide">
              <SectionHeading
                eyebrow={t('section.why.here')}
                // Awarding bodies are stored in full ("IBAS — International
                // Business Academy of Switzerland"). The short form ahead of the
                // dash is what belongs in a heading; the full name is already in
                // the hero directly above.
                title={format(t('section.why.with'), {
                  awarder: (program.awardingBody || SITE_NAME).split(
                    /\s+[—–-]\s+/,
                  )[0],
                })}
              />

              <ul className="mt-12 grid gap-6 sm:grid-cols-2">
                {program.whyStudy.map((reason, index) => (
                  <li
                    key={`${index}-${reason.title}`}
                    className="relative overflow-hidden rounded-[calc(var(--radius-brand)*1.5)] border border-brand-sand/70 bg-white p-8"
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -end-2 -top-6 font-serif text-[7rem] font-bold leading-none text-brand-teal/[0.05]"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <div className="relative">
                      <h3 className="text-lg font-bold text-brand-teal">
                        {reason.title}
                      </h3>
                      <span aria-hidden className="mt-4 block h-px w-10 bg-brand-gold" />
                      <p className="mt-4 text-sm leading-relaxed text-brand-ink/70">
                        {reason.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </Container>
          </section>
        ) : null}

        {/* ---------------------------------------------------- Curriculum */}
        <CurriculumSection
          id="curriculum"
          groups={program.curriculum}
          hasMajors={program.majors.length > 0}
        />

        {/* -------------------------------------------------------- Majors */}
        <MajorExplorer id="majors" majors={program.majors} />

        <CallToAction id="apply" settings={settings} surface="light" />
      </div>
    </>
  );
}
