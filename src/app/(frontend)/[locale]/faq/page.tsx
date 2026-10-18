import type { Metadata } from 'next';

import { CallToAction } from '@/components/sections/CallToAction';
import { FaqList } from '@/components/sections/FaqList';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n/config';
import { setRequestLocale, t } from '@/lib/i18n/server';
import { buildMetadata } from '@/lib/seo';
import { getFaqPageContent, getFaqs, getSiteSettings } from '@/lib/cms/api';
import type { FaqItem } from '@/lib/cms/types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = isLocale(requested) ? requested : DEFAULT_LOCALE;

  const { content, seo, translated } = await getFaqPageContent(locale);

  return buildMetadata({
    title: seo?.title || content.intro.heading,
    description: seo?.description || content.intro.body,
    path: '/faq',
    locale,
    translated,
    seo: seo,
    robots: seo?.robots,
    openGraph: seo?.openGraph,
  });
}

/** Strips the HTML WordPress wraps answers in; JSON-LD wants plain text. */
function plain(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8217;|&rsquo;/g, '’')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * FAQPage structured data.
 *
 * The highest-leverage markup on the site: these answers can surface directly
 * in a search result for a question like "is an online MBA recognised in
 * Egypt", which is exactly what a prospective student types.
 */
function FaqSchema({ faqs }: { faqs: FaqItem[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: plain(faq.answer) },
          })),
        }).replace(/</g, '\\u003c'),
      }}
    />
  );
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: requested } = await params;
  const locale = await setRequestLocale(requested);

  const [{ content }, faqs, settings] = await Promise.all([
    getFaqPageContent(locale),
    getFaqs(locale),
    getSiteSettings(locale),
  ]);

  return (
    <>
      {faqs.length ? <FaqSchema faqs={faqs} /> : null}

      <PageHeader
        eyebrow={content.intro.eyebrow}
        title={content.intro.heading}
        description={content.intro.body}
      />

      <section className="bg-white py-14 lg:py-20">
        <Container size="wide">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-8">
              {faqs.length ? (
                <FaqList faqs={faqs} />
              ) : (
                <p className="max-w-2xl text-base leading-relaxed text-brand-ink/60">
                  {t('empty.faq')}{' '}
                  <a
                    href={`mailto:${settings.contact.email}`}
                    className="font-medium text-brand-teal underline"
                  >
                    {settings.contact.email}
                  </a>
                  .
                </p>
              )}
            </div>

            {/*
              The prompt sits second in the source and beside the questions on a
              wide screen: on a phone the questions are what the visitor came
              for, and this belongs after them rather than in front of them.
            */}
            <aside className="lg:col-span-4">
              <div className="rounded-[var(--radius-brand)] border border-brand-sand bg-brand-beige/40 p-7 lg:sticky lg:top-28">
                <h2 className="text-base font-bold text-brand-teal">
                  {t('link.deciding')}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-brand-ink/70">
                  {t('link.deciding.body')}
                </p>
                {/*
                  The contact page, not a mail client — the same change the
                  homepage's FAQ section had, which this copy of the panel was
                  left out of. "Check my eligibility" opened `mailto:` with a
                  subject line written in English whatever language the page
                  was in, and on a machine with no mail client configured it
                  opened nothing at all.
                */}
                <Button href="/contact" variant="secondary" className="mt-5 w-full">
                  {t('cta.contact')}
                </Button>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <CallToAction settings={settings} />
    </>
  );
}
