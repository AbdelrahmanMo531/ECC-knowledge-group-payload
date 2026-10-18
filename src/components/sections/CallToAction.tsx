import Image from 'next/image';

import { LeadTrigger } from '@/components/forms/LeadTrigger';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { surfaceClass, type Surface } from '@/components/ui/surface';
import { t } from '@/lib/i18n/server';
import type { HomeContent, SiteSettings } from '@/lib/cms/types';

/**
 * What the panel says when the CMS has nothing to say.
 *
 * A function, not a constant: `label` is one of the site's own words and has
 * to be read in the language of the page being rendered, which a value
 * evaluated once when the module loads cannot be.
 */
const defaultCta = (): NonNullable<HomeContent['cta']> => ({
  heading: t('cta.panel.title'),
  body: t('cta.panel.body'),
  label: t('cta.apply'),
  href: '/contact',
});

export function CallToAction({
  settings,
  cta,
  surface,
  id,
}: {
  settings: SiteSettings;
  cta?: HomeContent['cta'];
  surface?: Surface;
  /** Anchor target, so in-page navigation can link to it. */
  id?: string;
}) {
  const panel = cta ?? defaultCta();

  return (
    <section
      id={id}
      className={`scroll-mt-[9.5rem] py-20 lg:py-24 ${surfaceClass(surface)}`}
    >
      <Container size="wide">
        <div className="bg-brand-gradient-teal relative overflow-hidden rounded-[calc(var(--radius-brand)*2)] px-8 py-16 text-center sm:px-14">
          {panel.image?.sourceUrl ? (
            <>
              <Image
                src={panel.image.sourceUrl}
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
              />
              {/*
                A heavy teal wash over the photograph. The panel's text is the
                point, so the image is treated as texture — this keeps contrast
                safe whatever an editor uploads.
              */}
              <span
                aria-hidden
                className="absolute inset-0 bg-brand-teal/85"
              />
            </>
          ) : null}

          <div
            aria-hidden
            className="bg-logo-pattern pointer-events-none absolute inset-0 opacity-[0.04]"
          />

          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-serif text-3xl font-bold leading-tight tracking-[-0.02em] text-brand-beige sm:text-[2.5rem]">
              {panel.heading}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-brand-beige/75">
              {panel.body}
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-4">
              {/*
                Opens the enquiry form here rather than sending the visitor to
                the contact page to find one. The page the editor chose is the
                fallback, so a site with no enquiry form published still has a
                working call to action.
              */}
              <LeadTrigger variant="onDarkSolid" fallbackHref={panel.href}>
                {panel.label}
              </LeadTrigger>
              <Button
                href={`https://wa.me/${settings.contact.phone.replace(/\D/g, '')}`}
                variant="onDark"
              >
                {t('cta.whatsapp')}
              </Button>
            </div>

            <p className="mt-7 text-xs text-brand-beige/50">
              {t('cta.reply')} · {settings.contact.email}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
