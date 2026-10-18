import type { Metadata } from 'next';

import { OfficeMap } from '@/components/contact/OfficeMap';
import { DynamicForm } from '@/components/forms/DynamicForm';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { socialIconFor } from '@/components/ui/icons';
import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n/config';
import { translate } from '@/lib/i18n/dictionary';
import { setRequestLocale, t } from '@/lib/i18n/server';
import { buildMetadata } from '@/lib/seo';
import { getContactContent, getForm, getSiteSettings } from '@/lib/cms/api';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = isLocale(requested) ? requested : DEFAULT_LOCALE;

  const { content, seo, translated } = await getContactContent(locale);

  return buildMetadata({
    title: seo?.title || translate(locale, 'meta.contact'),
    description:
      seo?.description ||
      content.intro.body[0] ||
      translate(locale, 'meta.contact.description'),
    path: '/contact',
    locale,
    translated,
    seo: seo,
    robots: seo?.robots,
    openGraph: seo?.openGraph,
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: requested } = await params;
  const locale = await setRequestLocale(requested);

  const [settings, { content }] = await Promise.all([
    getSiteSettings(locale),
    getContactContent(locale),
  ]);

  // The page names a form; the form itself — its fields, its confirmation
  // message, where submissions go — is authored under Forms in WordPress.
  const form = await getForm(content.form.slug, locale);

  const details = [
    {
      label: t('contact.email'),
      value: settings.contact.email,
      href: `mailto:${settings.contact.email}`,
    },
    {
      label: t('contact.phone'),
      value: settings.contact.phone,
      href: `tel:${settings.contact.phone.replace(/\s/g, '')}`,
    },
    {
      label: t('contact.office'),
      value: settings.contact.address,
      href: settings.contact.mapUrl ?? undefined,
    },
  ].filter((detail) => detail.value);

  return (
    <>
      <PageHeader
        eyebrow={content.intro.eyebrow}
        title={content.intro.heading}
        description={content.intro.body[0]}
      />

      <section className="bg-white py-16 lg:py-24">
        <Container size="wide">
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="text-2xl font-bold text-brand-teal">
                ECC Knowledge Group
              </h2>
              <span aria-hidden className="mt-5 block h-px w-16 bg-brand-gold" />

              {/* The opening paragraph is already the page header's standfirst. */}
              {content.intro.body.slice(1).map((paragraph, index) => (
                <p
                  key={`${index}-${paragraph.slice(0, 24)}`}
                  className="mt-5 text-base leading-relaxed text-brand-ink/75"
                >
                  {paragraph}
                </p>
              ))}

              <dl className="mt-8 space-y-7">
                {details.map((detail) => (
                  <div key={detail.label}>
                    <dt className="text-xs uppercase tracking-[0.16em] text-brand-turquoise">
                      {detail.label}
                    </dt>
                    <dd className="mt-2 text-base leading-relaxed text-brand-ink/80">
                      {detail.href ? (
                        <a
                          href={detail.href}
                          target={
                            detail.href.startsWith('http') ? '_blank' : undefined
                          }
                          rel={
                            detail.href.startsWith('http')
                              ? 'noreferrer noopener'
                              : undefined
                          }
                          className="transition-colors hover:text-brand-teal"
                        >
                          {detail.value}
                        </a>
                      ) : (
                        detail.value
                      )}
                    </dd>
                  </div>
                ))}

                {content.intro.hours.length ? (
                  <div>
                    <dt className="text-xs uppercase tracking-[0.16em] text-brand-turquoise">
                      {t('aria.hours')}
                    </dt>
                    <dd className="mt-2 space-y-1 text-base leading-relaxed text-brand-ink/80">
                      {content.intro.hours.map((line, index) => (
                        <p key={`${index}-${line}`}>{line}</p>
                      ))}
                    </dd>
                  </div>
                ) : null}
              </dl>

              {settings.social.length ? (
                <div className="mt-10">
                  <h3 className="text-xs uppercase tracking-[0.16em] text-brand-turquoise">
                    {t('section.follow')}
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-2.5">
                    {settings.social.map((item) => {
                      const Icon = socialIconFor(item.label, item.url);

                      return (
                        <li key={item.url}>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-sand text-brand-teal transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-turquoise hover:bg-brand-turquoise hover:text-white"
                          >
                            {Icon ? (
                              <Icon width={17} height={17} />
                            ) : (
                              <span className="text-xs font-medium">
                                {item.label.charAt(0)}
                              </span>
                            )}
                            <span className="sr-only">{item.label}</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-[var(--radius-brand)] border border-brand-sand bg-brand-beige/50 p-8 sm:p-10">
                <h2 className="text-xl font-bold text-brand-teal">
                  {content.form.heading}
                </h2>
                {content.form.body ? (
                  <p className="mt-3 text-sm leading-relaxed text-brand-ink/70">
                    {content.form.body}
                  </p>
                ) : null}

                <div className="mt-8">
                  {form ? (
                    <DynamicForm
                      form={form}
                      locale={locale}
                      fallbackEmail={settings.contact.email}
                    />
                  ) : (
                    <p className="text-sm leading-relaxed text-brand-ink/70">
                      Email us at{' '}
                      <a
                        href={`mailto:${settings.contact.email}`}
                        className="font-medium text-brand-teal underline"
                      >
                        {settings.contact.email}
                      </a>{' '}
                      and an advisor will pick it up.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <OfficeMap
        heading={content.map.heading}
        embedUrl={content.map.embedUrl}
        address={settings.contact.address}
        directionsUrl={settings.contact.mapUrl}
      />
    </>
  );
}
