import type { Metadata } from 'next';

import { CallToAction } from '@/components/sections/CallToAction';
import { ProgramsGrid } from '@/components/sections/ProgramsGrid';
import { PageHeader } from '@/components/ui/PageHeader';
import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n/config';
import { translate } from '@/lib/i18n/dictionary';
import { setRequestLocale, t } from '@/lib/i18n/server';
import { buildMetadata } from '@/lib/seo';
import { getPrograms, getSiteSettings } from '@/lib/cms/api';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = isLocale(requested) ? requested : DEFAULT_LOCALE;

  return buildMetadata({
    title: translate(locale, 'meta.programmes'),
    description: translate(locale, 'meta.programs'),
    path: '/programs',
    locale,
  });
}

export default async function ProgramsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: requested } = await params;
  const locale = await setRequestLocale(requested);

  const [programs, settings] = await Promise.all([
    getPrograms(locale),
    getSiteSettings(locale),
  ]);

  return (
    <>
      <PageHeader
        eyebrow={t('page.programs.eyebrow')}
        title={t('page.programs.title')}
        description={t('page.programs.body')}
      />

      <ProgramsGrid
        programs={programs}
        showCta={false}
        eyebrow={t('page.programs.all')}
        title={t('page.programs.pathway')}
        description={t('page.programs.pathway.body')}
      />

      <CallToAction settings={settings} />
    </>
  );
}
