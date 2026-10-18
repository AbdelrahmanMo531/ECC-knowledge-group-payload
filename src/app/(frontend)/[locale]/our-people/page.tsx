import type { Metadata } from 'next';

import { CallToAction } from '@/components/sections/CallToAction';
import { PeopleTabs } from '@/components/people/PeopleTabs';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { DEFAULT_TEAMS, groupByTeam, withDefaultTeam } from '@/lib/people';
import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n/config';
import { setRequestLocale, t } from '@/lib/i18n/server';
import { buildMetadata } from '@/lib/seo';
import {
  getAcademicMembers,
  getPeopleContent,
  getSiteSettings,
  getTeamMembers,
} from '@/lib/cms/api';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = isLocale(requested) ? requested : DEFAULT_LOCALE;

  const { content, seo, translated } = await getPeopleContent(locale);

  return buildMetadata({
    title: seo?.title || 'Our People',
    description: seo?.description || content.intro.body,
    path: '/our-people',
    locale,
    translated,
    seo: seo,
    robots: seo?.robots,
    openGraph: seo?.openGraph,
  });
}

export default async function OurPeoplePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: requested } = await params;
  const locale = await setRequestLocale(requested);

  const [{ content }, faculty, team, settings] = await Promise.all([
    getPeopleContent(locale),
    getAcademicMembers(locale),
    getTeamMembers(locale),
    getSiteSettings(locale),
  ]);

  // Two collections, one page. Team members lead, because the board and the
  // managers are who a visitor scrolling to "our people" is looking for first;
  // the tab order on the page overrides this anyway once it is filled in.
  const groups = groupByTeam(
    [
      ...withDefaultTeam(team, DEFAULT_TEAMS.team),
      ...withDefaultTeam(faculty, DEFAULT_TEAMS.academic),
    ],
    content.teams,
  );

  return (
    <>
      <PageHeader
        eyebrow={content.intro.eyebrow}
        title={content.intro.heading}
        description={content.intro.body}
      />

      <section className="bg-white py-16 lg:py-24">
        <Container size="wide">
          {groups.length ? (
            <PeopleTabs groups={groups} />
          ) : (
            // Real, named people with photographs are never seeded, so an
            // empty page says so plainly rather than showing invented ones.
            <p className="mx-auto max-w-2xl text-center text-base leading-relaxed text-brand-ink/60">
              {t('empty.people')}{' '}
              <a
                href={`mailto:${settings.contact.email}`}
                className="font-medium text-brand-teal underline"
              >
                {settings.contact.email}
              </a>
              .
            </p>
          )}
        </Container>
      </section>

      <CallToAction settings={settings} />
    </>
  );
}
