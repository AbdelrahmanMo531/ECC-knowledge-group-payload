import type { Metadata } from 'next';

import { Accreditations } from '@/components/sections/Accreditations';
import { CallToAction } from '@/components/sections/CallToAction';
import { PartnersSection } from '@/components/sections/PartnersSection';
import { PageHeader } from '@/components/ui/PageHeader';
import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n/config';
import { translate } from '@/lib/i18n/dictionary';
import { setRequestLocale, t } from '@/lib/i18n/server';
import { buildMetadata } from '@/lib/seo';
import { getAccreditations, getPartners, getSiteSettings } from '@/lib/cms/api';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = isLocale(requested) ? requested : DEFAULT_LOCALE;

  return buildMetadata({
    title: translate(locale, 'meta.partners.title'),
    description: translate(locale, 'meta.partners'),
    path: '/partners',
    locale,
  });
}

export default async function PartnersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: requested } = await params;
  const locale = await setRequestLocale(requested);

  const [partners, accreditations, settings] = await Promise.all([
    getPartners(locale),
    getAccreditations(locale),
    getSiteSettings(locale),
  ]);

  return (
    <>
      <PageHeader
        eyebrow={t('page.partners.eyebrow')}
        title={t('page.partners.title')}
        description={t('page.partners.body')}
      />

      <PartnersSection partners={partners} />
      <Accreditations items={accreditations} />
      <CallToAction settings={settings} />
    </>
  );
}
