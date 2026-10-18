import type { Metadata } from 'next';
import Image from 'next/image';

import { Logo } from '@/components/brand/Logo';
import { LeadTrigger } from '@/components/forms/LeadTrigger';
import { Accreditations } from '@/components/sections/Accreditations';
import { CallToAction } from '@/components/sections/CallToAction';
import { PartnersSection } from '@/components/sections/PartnersSection';
import { Stats } from '@/components/sections/Stats';
import { Testimonials } from '@/components/sections/Testimonials';
import { Button } from '@/components/ui/Button';
import { CardSlider } from '@/components/ui/CardSlider';
import { Container } from '@/components/ui/Container';
import { ProgramCard } from '@/components/ui/ProgramCard';
import { VideoLightbox } from '@/components/ui/VideoLightbox';
import { SectionTabs, type PageSection } from '@/components/ui/SectionTabs';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CompassIcon, TelescopeIcon } from '@/components/ui/icons';
import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n/config';
import { translate } from '@/lib/i18n/dictionary';
import { setRequestLocale, t } from '@/lib/i18n/server';
import { buildMetadata, SITE_NAME } from '@/lib/seo';
import {
  getAboutContent,
  getAccreditations,
  getPartners,
  getPrograms,
  getSiteSettings,
  getTestimonials,
} from '@/lib/cms/api';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = isLocale(requested) ? requested : DEFAULT_LOCALE;

  const { content, seo, translated } = await getAboutContent(locale);

  return buildMetadata({
    title: seo?.title || translate(locale, 'meta.about'),
    description: seo?.description || content.intro.body[0],
    path: '/about-us',
    locale,
    translated,
    image: content.intro.image?.sourceUrl,
    seo: seo,
    robots: seo?.robots,
    openGraph: seo?.openGraph,
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: requested } = await params;
  const locale = await setRequestLocale(requested);

  const [{ content }, programs, partners, accreditations, testimonials, settings] =
    await Promise.all([
      getAboutContent(locale),
      getPrograms(locale),
      getPartners(locale),
      getAccreditations(locale),
      getTestimonials(locale),
      getSiteSettings(locale),
    ]);

  // Same rule as the programme and partner pages: a tab exists only for a
  // section that will actually render.
  const sections: PageSection[] = [
    { id: 'who-we-are', label: t('tab.who') },
    ...(content.stats.length ? [{ id: 'figures', label: t('tab.figures') }] : []),
    ...(programs.length ? [{ id: 'programmes', label: t('tab.programmes') }] : []),
    ...(partners.length ? [{ id: 'network', label: t('tab.partners') }] : []),
    ...(accreditations.length
      ? [{ id: 'recognition', label: t('tab.accreditation') }]
      : []),
    { id: 'ceremonies', label: t('tab.ceremonies') },
    ...(testimonials.length ? [{ id: 'feedback', label: t('tab.feedback') }] : []),
  ];

  const [lead, ...rest] = content.intro.body;

  return (
    <>
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
          <div className="grid items-center gap-12 py-16 lg:grid-cols-12 lg:py-24">
            <div className="lg:col-span-7">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-brand-gold">
                {content.intro.eyebrow}
              </span>

              <h1 className="mt-4 text-4xl font-bold leading-[1.06] tracking-[-0.025em] text-brand-beige sm:text-5xl">
                {content.intro.heading}
              </h1>

              <span aria-hidden className="mt-7 block h-px w-16 bg-brand-gold" />

              {lead ? (
                <p className="mt-7 max-w-xl text-lg leading-relaxed text-brand-beige/80">
                  {lead}
                </p>
              ) : null}

              <div className="mt-9 flex flex-wrap gap-4">
                <Button href="/programs" variant="onDarkSolid">
                  {t('cta.programmes')}
                </Button>
                {/*
                  The enquiry form in place, not a trip to the contact page.

                  Someone who has read this far and wants to speak to an
                  adviser has already decided; sending them to another page to
                  find a form is a step at which people are lost. Falls back to
                  the contact page on a site with no `lead` form published.
                */}
                <LeadTrigger variant="onDark">
                  {t('link.advisor.talk')}
                </LeadTrigger>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative">
                <span
                  aria-hidden
                  className="absolute -bottom-5 -end-5 h-full w-full rounded-[calc(var(--radius-brand)*2)] border border-brand-gold/50"
                />
                <div className="relative overflow-hidden rounded-[calc(var(--radius-brand)*2)] bg-teal-900">
                  {content.intro.image?.sourceUrl ? (
                    <Image
                      src={content.intro.image.sourceUrl}
                      alt={content.intro.image.altText || SITE_NAME}
                      width={content.intro.image.mediaDetails?.width ?? 900}
                      height={content.intro.image.mediaDetails?.height ?? 700}
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
      </section>

      {/*
        Everything below the hero is one track, so the sticky tabs have
        something to measure their progress rail against.
      */}
      <div id="about-body">
        <SectionTabs sections={sections} trackId="about-body" />

        {/* ------------------------------------------------- Who we are */}
        <section id="who-we-are" className="scroll-mt-[9.5rem] bg-white py-20 lg:py-24">
          <Container size="wide">
            <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-7">
                <SectionHeading eyebrow={t('section.who')} title={t('section.house')} />

                <div className="mt-8 space-y-5">
                  {(rest.length ? rest : content.intro.body).map(
                    (paragraph, index) => (
                      <p
                        key={`${index}-${paragraph.slice(0, 32)}`}
                        className="text-base leading-relaxed text-brand-ink/75"
                      >
                        {paragraph}
                      </p>
                    ),
                  )}
                </div>
              </div>

              {/* Mission and vision, as the two halves of the same intent. */}
              <div className="grid gap-6 lg:col-span-5">
                {[
                  { label: t('section.mission'), text: content.mission, Icon: CompassIcon },
                  { label: t('section.vision'), text: content.vision, Icon: TelescopeIcon },
                ]
                  .filter((card) => card.text)
                  .map(({ label, text, Icon }) => (
                    <article
                      key={label}
                      className="relative overflow-hidden rounded-[calc(var(--radius-brand)*1.5)] bg-brand-teal p-8"
                    >
                      <div
                        aria-hidden
                        className="bg-logo-pattern pointer-events-none absolute inset-0 opacity-[0.04]"
                      />

                      <div className="relative">
                        <span
                          aria-hidden
                          className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-beige/10 text-brand-gold"
                        >
                          <Icon width={22} height={22} />
                        </span>

                        <h3 className="mt-5 text-xs font-medium uppercase tracking-[0.16em] text-brand-gold">
                          {label}
                        </h3>
                        <p className="mt-3 text-base leading-relaxed text-brand-beige/85">
                          {text}
                        </p>
                      </div>
                    </article>
                  ))}
              </div>
            </div>
          </Container>
        </section>

        <Stats stats={content.stats} icons={false} compact id="figures" />

        {/* ---------------------------------------------------- Programmes */}
        {programs.length > 0 ? (
          <section
            id="programmes"
            className="scroll-mt-[9.5rem] bg-white py-20 lg:py-24"
          >
            <Container size="wide">
              <CardSlider
                label={t('tab.programmes')}
                items={programs.map((program) => (
                  <ProgramCard key={program.id} program={program} />
                ))}
                itemClassName="w-[19rem] sm:w-[21rem]"
                heading={
                  <SectionHeading
                    eyebrow={t('tab.programmes')}
                    title={content.programmes.heading}
                    description={content.programmes.body}
                  />
                }
                className="mt-12"
              />
            </Container>
          </section>
        ) : null}

        <PartnersSection
          id="network"
          partners={partners}
          title={content.network.heading}
          description={content.network.body}
          surface="light"
        />

        <Accreditations
          id="recognition"
          items={accreditations}
          title={content.recognition.heading}
          description={content.recognition.body}
          surface="tint"
        />

        {/* ---------------------------------------------------- Ceremonies */}
        <section
          id="ceremonies"
          className="relative scroll-mt-[9.5rem] overflow-hidden bg-brand-teal py-20 lg:py-24"
        >
          <div
            aria-hidden
            className="bg-logo-pattern pointer-events-none absolute inset-0 opacity-[0.03]"
          />

          <Container size="wide" className="relative">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <SectionHeading
                  eyebrow={t('section.milestones')}
                  title={content.ceremonies.heading}
                  tone="dark"
                />
                <p className="mt-6 text-base leading-relaxed text-brand-beige/75">
                  {content.ceremonies.body}
                </p>

                {/*
                  The ceremony figures sit with the copy rather than in their
                  own band — they are the detail of this section, not a
                  statement about the whole organisation.
                */}
                {content.ceremonies.stats.length > 0 ? (
                  <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8">
                    {content.ceremonies.stats.map((stat, index) => (
                      <div key={`${index}-${stat.label}`}>
                        <dt className="sr-only">{stat.label}</dt>
                        <dd>
                          <p className="flex items-baseline text-3xl font-bold leading-none tracking-[-0.03em] text-brand-beige sm:text-4xl">
                            {stat.prefix ? <span>{stat.prefix}</span> : null}
                            <span className="tabular-nums">{stat.number}</span>
                            {stat.suffix ? (
                              <span className="text-brand-gold">{stat.suffix}</span>
                            ) : null}
                          </p>
                          <p className="mt-2 text-sm text-brand-beige/65">
                            {stat.label}
                          </p>
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}

                <div className="mt-9 flex flex-wrap items-center gap-4">
                  {content.ceremonies.ctaLabel && content.ceremonies.ctaHref ? (
                    <Button
                      href={content.ceremonies.ctaHref}
                      variant="onDarkSolid"
                    >
                      {content.ceremonies.ctaLabel}
                    </Button>
                  ) : null}

                  {/*
                    With no photograph to sit on, the play button belongs here
                    beside the call to action — so a video is never unreachable.
                  */}
                  {content.ceremonies.images.length === 0 ? (
                    <VideoLightbox
                      url={content.ceremonies.video}
                      label={t('link.ceremony')}
                    />
                  ) : null}
                </div>
              </div>

              {/*
                A collage rather than a row: the first photograph is the
                occasion and carries the play button, the other two are the
                detail around it.
              */}
              {content.ceremonies.images.length > 0 ? (
                <div className="lg:col-span-7">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {content.ceremonies.images.map((image, index) => (
                      <div
                        key={`${index}-${image.sourceUrl}`}
                        className={`relative overflow-hidden rounded-[calc(var(--radius-brand)*1.5)] ${
                          index === 0 ? 'sm:col-span-2' : ''
                        }`}
                      >
                        <Image
                          src={image.sourceUrl}
                          alt={image.altText || content.ceremonies.heading}
                          width={image.mediaDetails?.width ?? 900}
                          height={image.mediaDetails?.height ?? 600}
                          className={`w-full object-cover ${
                            index === 0 ? 'aspect-[16/9]' : 'aspect-[4/3]'
                          }`}
                        />

                        {index === 0 ? (
                          <>
                            <span
                              aria-hidden
                              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-teal/70 via-transparent to-transparent"
                            />
                            <VideoLightbox
                              url={content.ceremonies.video}
                              label={t('link.ceremony')}
                              className="absolute bottom-5 start-5"
                            />
                          </>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </Container>
        </section>

        <Testimonials
          id="feedback"
          testimonials={testimonials}
          title={content.feedback.heading}
          description={content.feedback.body}
          surface="light"
        />

        <CallToAction settings={settings} surface="tint" />
      </div>
    </>
  );
}
