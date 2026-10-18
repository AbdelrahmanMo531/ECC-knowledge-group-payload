import { Logo } from '@/components/brand/Logo';
import { Container } from '@/components/ui/Container';
import { NavLink } from '@/components/ui/NavLink';
import { socialIconFor } from '@/components/ui/icons';
import type { NavItem, SiteMenus, SiteSettings } from '@/lib/cms/types';
import { format } from '@/lib/i18n/dictionary';
import { t } from '@/lib/i18n/server';

/**
 * Footer columns are driven by the `footer_explore`, `footer_programs` and
 * `footer_legal` menu locations. Sub-items are flattened: a footer column is a
 * flat list by design, so a nested menu still renders every link rather than
 * hiding the children.
 */
function flatten(items: NavItem[]): NavItem[] {
  return items.flatMap((item) =>
    item.children?.length ? [item, ...flatten(item.children)] : [item],
  );
}

function FooterColumn({
  title,
  items,
  className = '',
}: {
  title: string;
  items: NavItem[];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <nav aria-label={title} className={className}>
      <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-brand-gold">
        {title}
      </h2>
      <ul className="mt-5 space-y-3">
        {flatten(items).map((item) => (
          <li key={item.id}>
            <NavLink
              item={item}
              className="text-sm text-brand-beige/75 transition-colors hover:text-brand-gold"
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SiteFooter({
  menus,
  settings,
}: {
  menus: SiteMenus;
  settings: SiteSettings;
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-brand-teal text-brand-beige">
      {/* Logo pattern (guideline p.17) held at a whisper so it reads as texture. */}
      <div
        aria-hidden
        className="bg-logo-pattern pointer-events-none absolute inset-0 opacity-[0.035]"
      />

      <Container size="wide" className="relative">
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-4">
            <Logo variant="cream" height={52} />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-brand-beige/70">
              {/*
                The sentence after the tagline is the site's own words, not the
                editor's, so it goes through the dictionary like the rest of
                them. It was written into the markup here, which meant an
                Arabic footer ended with an English paragraph — visible, and
                invisible to a sweep looking at JSX attributes and at lines
                that start with a capital letter.
              */}
              {settings.tagline}. {t('footer.about')}
            </p>

            <ul className="mt-7 flex flex-wrap gap-2.5">
              {settings.social.map((item) => {
                const Icon = socialIconFor(item.label, item.url);

                return (
                  <li key={item.url}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-beige/25 text-brand-beige/75 transition-all duration-200 ease-[var(--ease-brand)] hover:-translate-y-0.5 hover:border-brand-gold hover:bg-brand-gold hover:text-brand-teal"
                    >
                      {Icon ? (
                        <Icon width={16} height={16} />
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

          <FooterColumn
            title={t('aria.explore')}
            items={menus.footerExplore}
            className="lg:col-span-2"
          />

          <FooterColumn
            title={t('tab.programmes')}
            items={menus.footerPrograms}
            className="lg:col-span-3"
          />

          <div className="lg:col-span-3">
            <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-brand-gold">
              {t('aria.contact')}
            </h2>
            <address className="mt-5 space-y-3 text-sm not-italic text-brand-beige/75">
              <p className="leading-relaxed">{settings.contact.address}</p>
              <p>
                <a
                  href={`mailto:${settings.contact.email}`}
                  className="transition-colors hover:text-brand-gold"
                >
                  {settings.contact.email}
                </a>
              </p>
              <p>
                <a
                  href={`tel:${settings.contact.phone.replace(/\s/g, '')}`}
                  className="transition-colors hover:text-brand-gold"
                >
                  {settings.contact.phone}
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-brand-beige/15 py-8 text-xs text-brand-beige/55 sm:flex-row sm:items-center sm:justify-between">
          <p>{format(t('footer.rights'), { year, site: 'ECC Knowledge Group' })}</p>

          {menus.footerLegal.length > 0 ? (
            <nav aria-label={t('aria.footer.legal')}>
              <ul className="flex flex-wrap gap-6">
                {flatten(menus.footerLegal).map((item) => (
                  <li key={item.id}>
                    <NavLink
                      item={item}
                      className="transition-colors hover:text-brand-gold"
                    />
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </Container>
    </footer>
  );
}
