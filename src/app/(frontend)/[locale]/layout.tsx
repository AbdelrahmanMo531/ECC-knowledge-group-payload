import type { Metadata, Viewport } from 'next';

import { LeadDialogProvider } from '@/components/forms/LeadDialog';
import { LeadLauncher } from '@/components/forms/LeadLauncher';
import { SiteCode } from '@/components/layout/SiteCode';
import { WebsiteSchema } from '@/components/seo/StructuredData';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SocialRail } from '@/components/layout/SocialRail';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { TopBar } from '@/components/layout/TopBar';
import { LEAD_FORM_SLUG } from '@/lib/forms/definition';
import { LOCALES, LOCALE_META, direction, isLocale } from '@/lib/i18n/config';
import { MessagesProvider } from '@/lib/i18n/Messages';
import { messages, setRequestLocale, t } from '@/lib/i18n/server';
import { SITE_NAME, siteUrl } from '@/lib/seo';
import { getForm, getMenus, getSiteSettings } from '@/lib/cms/api';

import '../globals.css';

const baseMetadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${SITE_NAME} — Crafting Excellence in Every Shade`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    'ECC Knowledge Group delivers internationally accredited business and management qualifications from Dubai, in partnership with institutions across Europe, Asia and the Gulf.',
  icons: {
    icon: [{ url: '/brand/ecc-mark.svg', type: 'image/svg+xml' }],
    apple: '/brand/ecc-mark.svg',
  },
  robots: { index: true, follow: true },
};

/** Site-wide metadata, plus the Search Console tokens set in Site settings. */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getSiteSettings(isLocale(locale) ? locale : undefined);
  const { google, bing } = settings.verification ?? {};

  return {
    ...baseMetadata,
    ...(google || bing
      ? { verification: { ...(google ? { google } : {}), ...(bing ? { other: { 'msvalidate.01': bing } } : {}) } }
      : {}),
  };
}

export const viewport: Viewport = {
  themeColor: '#004442',
  width: 'device-width',
  initialScale: 1,
};

/**
 * Every language the site is built for.
 *
 * Listing them is what keeps the pages statically rendered: without it Next
 * has no way to know `[locale]` is a closed set, and every page would have to
 * be produced on request.
 */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: requested } = await params;
  const locale = await setRequestLocale(requested);
  // The enquiry form is fetched once for the whole site rather than per page:
  // every layout renders this, and the read is cached and tagged like any
  // other, so a page carrying three triggers still costs one lookup.
  const [settings, menus, lead] = await Promise.all([
    getSiteSettings(locale),
    getMenus(locale),
    getForm(LEAD_FORM_SLUG, locale),
  ]);

  return (
    <html lang={LOCALE_META[locale].tag} dir={direction(locale)}>
      {/*
        Browser extensions — Grammarly is the common one — inject attributes
        such as `data-gr-ext-installed` onto <body> before React hydrates,
        which React reports as a hydration mismatch even though the app is
        correct. This suppresses the warning for <body>'s own attributes only:
        `suppressHydrationWarning` applies a single level deep, so genuine
        mismatches anywhere inside the tree are still reported.
      */}
      <body className="flex min-h-screen flex-col" suppressHydrationWarning>
        {/*
          Whatever an editor pasted into ECC Settings → Header code, first
          thing in the document so it runs before the page it is measuring.
        */}
        <SiteCode code={settings.code} slot="head" />
        <WebsiteSchema locale={locale} />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand-teal focus:px-5 focus:py-3 focus:text-sm focus:text-brand-beige"
        >
          {t('nav.skip')}
        </a>

        {/*
          Handed down once, so a control in the browser answers from the same
          table a heading rendered on the server did.
        */}
        <MessagesProvider messages={messages()}>
          <LeadDialogProvider
            form={lead}
            locale={locale}
            fallbackEmail={settings.contact.email}
          >
            <TopBar settings={settings} />
            <SiteHeader navigation={menus.primary} />

            <main id="main" className="flex-1">
              {children}
            </main>

            <SiteFooter menus={menus} settings={settings} />

            <SocialRail links={settings.social} />
            <LeadLauncher />
          </LeadDialogProvider>
        </MessagesProvider>

        {/* And Footer code, last thing in the document. */}
        <SiteCode code={settings.code} slot="body" />
      </body>
    </html>
  );
}
