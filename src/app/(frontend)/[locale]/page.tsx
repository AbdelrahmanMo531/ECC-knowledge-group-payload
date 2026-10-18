import type { Metadata } from 'next';

import { AboutEcc } from '@/components/sections/AboutEcc';
import { AcademicMembers } from '@/components/sections/AcademicMembers';
import { AccreditationMarquee } from '@/components/sections/AccreditationMarquee';
import { Accreditations } from '@/components/sections/Accreditations';
import { CallToAction } from '@/components/sections/CallToAction';
import { CeoMessage } from '@/components/sections/CeoMessage';
import { Faq } from '@/components/sections/Faq';
import { Hero } from '@/components/sections/Hero';
import { LatestNews } from '@/components/sections/LatestNews';
import { PartnersSection } from '@/components/sections/PartnersSection';
import { ProgramsGrid } from '@/components/sections/ProgramsGrid';
import { Stats } from '@/components/sections/Stats';
import { Testimonials } from '@/components/sections/Testimonials';
import { VideoSection } from '@/components/sections/VideoSection';
import { WhyEcc } from '@/components/sections/WhyEcc';
import {
  CourseListSchema,
  FaqSchema,
  OrganizationSchema,
} from '@/components/seo/StructuredData';
import { assignSurfaces } from '@/components/ui/surface';
import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n/config';
import { translate } from '@/lib/i18n/dictionary';
import { setRequestLocale, t } from '@/lib/i18n/server';
import { buildMetadata } from '@/lib/seo';
import { parseVideo } from '@/lib/video';
import {
  getAcademicMembers,
  getAccreditations,
  getFaqs,
  getHomeContent,
  getPartners,
  getPosts,
  getPrograms,
  getSiteSettings,
  getTestimonials,
} from '@/lib/cms/api';

/**
 * Homepage metadata.
 *
 * Values from the SEO tab of the Home global win when an editor has set them;
 * otherwise the defaults below target the search intent this page is built
 * for — a professional in Egypt or the Gulf looking for a recognised business
 * degree they can study online.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = isLocale(requested) ? requested : DEFAULT_LOCALE;

  const { seo, translated } = await getHomeContent(locale);

  return buildMetadata({
    title:
      seo?.title || translate(locale, 'meta.home.title'),
    description:
      seo?.description || translate(locale, 'meta.home.description'),
    path: '/',
    locale,
    translated,
    seo: seo,
    robots: seo?.robots,
    openGraph: seo?.openGraph,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: requested } = await params;
  const locale = await setRequestLocale(requested);

  const [
    { content },
    programs,
    partners,
    accreditations,
    members,
    testimonials,
    faqs,
    posts,
    settings,
  ] = await Promise.all([
    getHomeContent(locale),
    getPrograms(locale),
    getPartners(locale),
    getAccreditations(locale),
    getAcademicMembers(locale),
    getTestimonials(locale),
    getFaqs(locale),
    getPosts(locale),
    getSiteSettings(locale),
  ]);

  /*
   * Surfaces are assigned here rather than baked into each section, because
   * several sections hide themselves when they have no content. A hardcoded
   * alternation collapses the moment one drops out and leaves two identical
   * bands touching — which is exactly what happened with the video and news
   * sections empty. Assigning from the sections that actually render keeps the
   * rhythm right whatever the CMS holds.
   */
  const [
    about,
    why,
    programsSection,
    marquee,
    /* video: fixed dark, no prop */,
    ceo,
    partnersSection,
    accreditationCards,
    faculty,
    quotes,
    faqSection,
    news,
    closing,
  ] = assignSurfaces([
    { visible: true },
    { visible: content.why.items.length > 0 },
    { visible: programs.length > 0 },
    { visible: accreditations.length > 0 },
    // The video is always dark — it is the page's one mid-scroll punctuation.
    { visible: parseVideo(content.video.url) !== null, fixed: 'dark' as const },
    { visible: content.ceo.message.length > 0 },
    { visible: partners.length > 0 },
    { visible: accreditations.length > 0 },
    { visible: members.length > 0 },
    { visible: testimonials.length > 0 },
    { visible: faqs.length > 0 },
    { visible: posts.length > 0 },
    { visible: true },
  ]);

  return (
    <>
      <OrganizationSchema settings={settings} />
      <CourseListSchema programs={programs} />
      <FaqSchema faqs={faqs} />

      <Hero hero={content.hero} countries={content.countries} />
      <Stats stats={content.stats} />

      <AboutEcc about={content.about} surface={about.surface} />
      <WhyEcc why={content.why} surface={why.surface} />

      <ProgramsGrid
        programs={programs}
        surface={programsSection.surface}
        title={t('section.grid.home.title')}
        // Deliberately not "three routes" — the list is editor-managed, so any
        // hardcoded count goes stale the moment a programme is added.
        description={t('section.grid.home.body')}
      />

      <AccreditationMarquee items={accreditations} surface={marquee.surface} />
      <VideoSection video={content.video} />
      <CeoMessage ceo={content.ceo} surface={ceo.surface} />
      <PartnersSection partners={partners} surface={partnersSection.surface} />
      <Accreditations items={accreditations} surface={accreditationCards.surface} />
      <AcademicMembers members={members} surface={faculty.surface} />
      <Testimonials testimonials={testimonials} surface={quotes.surface} />
      <Faq faqs={faqs} surface={faqSection.surface} />
      <LatestNews posts={posts} surface={news.surface} />

      <CallToAction settings={settings} cta={content.cta} surface={closing.surface} />
    </>
  );
}
