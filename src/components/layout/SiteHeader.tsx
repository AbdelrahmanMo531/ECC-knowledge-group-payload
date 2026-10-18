'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Link } from '@/components/ui/Link';
import { Logo } from '@/components/brand/Logo';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { LeadTrigger } from '@/components/forms/LeadTrigger';
import { Container } from '@/components/ui/Container';
import { NavLink } from '@/components/ui/NavLink';
import { splitLocale } from '@/lib/i18n/config';
import { useT } from '@/lib/i18n/useT';
import type { NavItem } from '@/lib/cms/types';

export function SiteHeader({ navigation }: { navigation: NavItem[] }) {
  const pathname = usePathname();
  const t = useT();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Prevent the page behind the mobile menu from scrolling.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Compared without the language: the address bar says `/ar/programs`, the
  // menu item says `/programs`, and they are the same page.
  const { path: here } = splitLocale(pathname);

  /** A parent is also "active" while one of its children is the current page. */
  const isActive = (item: NavItem): boolean => {
    if (item.external) return false;

    const { path: there } = splitLocale(item.href);

    if (there === '/') return here === '/';
    if (here === there || here.startsWith(`${there}/`)) return true;

    return Boolean(item.children?.some(isActive));
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ease-[var(--ease-brand)] ${
        scrolled
          ? 'border-b border-brand-sand/60 bg-white/90 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <Container size="wide">
        <div className="flex h-20 items-center justify-between gap-6">
          <Link href="/" aria-label={t('nav.home')} className="shrink-0">
            <Logo height={44} priority />
          </Link>

          <nav aria-label={t('aria.nav.primary')} className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {navigation.map((item) => {
                const active = isActive(item);
                const hasChildren = Boolean(item.children?.length);

                return (
                  <li key={item.id} className="group relative">
                    <NavLink
                      item={item}
                      ariaCurrent={active && !hasChildren ? 'page' : undefined}
                      className={`relative flex items-center gap-1.5 text-sm font-medium transition-colors after:absolute after:-bottom-1.5 after:start-0 after:h-px after:bg-brand-gold after:transition-all after:duration-300 ${
                        active
                          ? 'text-brand-teal after:w-full'
                          : 'text-brand-ink/70 after:w-0 hover:text-brand-teal hover:after:w-full'
                      }`}
                    >
                      {item.label}
                      {hasChildren ? (
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          aria-hidden
                          className="mt-0.5 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
                        >
                          <path
                            d="M2 3.5L5 6.5L8 3.5"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            fill="none"
                            strokeLinecap="round"
                          />
                        </svg>
                      ) : null}
                    </NavLink>

                    {/*
                      Submenus open on hover and on keyboard focus. `focus-within`
                      is what makes them reachable by tabbing — without it the
                      dropdown would be mouse-only.
                    */}
                    {hasChildren ? (
                      <ul className="invisible absolute start-0 top-full z-50 mt-3 min-w-56 translate-y-1 rounded-[var(--radius-brand)] border border-brand-sand/70 bg-white p-2 opacity-0 shadow-xl shadow-brand-teal/[0.08] transition-all duration-200 ease-[var(--ease-brand)] group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                        {item.children!.map((child) => (
                          <li key={child.id}>
                            <NavLink
                              item={child}
                              ariaCurrent={isActive(child) ? 'page' : undefined}
                              className={`block rounded-lg px-3 py-2.5 text-sm transition-colors ${
                                isActive(child)
                                  ? 'bg-brand-beige text-brand-teal'
                                  : 'text-brand-ink/75 hover:bg-brand-beige/70 hover:text-brand-teal'
                              }`}
                            />
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/*
            The switcher sits in the header at every width, beside the menu
            button on a phone rather than inside it: somebody who has landed in
            a language they cannot read should not have to open a menu written
            in it to get out.
          */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            <div className="hidden lg:block">
              <LeadTrigger className="px-5 py-2.5">{t('cta.apply')}</LeadTrigger>
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={t(menuOpen ? 'nav.menu.close' : 'nav.menu.open')}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-sand text-brand-teal lg:hidden"
            >
              <span className="sr-only">
                {t(menuOpen ? 'nav.menu.close' : 'nav.menu.open')}
              </span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                aria-hidden
                focusable="false"
              >
                {menuOpen ? (
                  <path
                    d="M4 4l12 12M16 4L4 16"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M3 6h14M3 10h14M3 14h14"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </Container>

      {menuOpen ? (
        <div
          id="mobile-navigation"
          className="max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-brand-sand/60 bg-white lg:hidden"
        >
          <Container size="wide">
            <nav aria-label={t('aria.nav.mobile')} className="py-6">
              <ul className="flex flex-col gap-1">
                {navigation.map((item) => (
                  <li key={item.id}>
                    <NavLink
                      item={item}
                      ariaCurrent={isActive(item) ? 'page' : undefined}
                      className={`block rounded-lg px-3 py-3 text-base font-medium transition-colors ${
                        isActive(item)
                          ? 'bg-brand-beige text-brand-teal'
                          : 'text-brand-ink/80 hover:bg-brand-beige/60 hover:text-brand-teal'
                      }`}
                    />

                    {/* Children are always visible on mobile — no nested taps. */}
                    {item.children?.length ? (
                      <ul className="mb-1 ms-3 border-s border-brand-sand/70 ps-3">
                        {item.children.map((child) => (
                          <li key={child.id}>
                            <NavLink
                              item={child}
                              ariaCurrent={isActive(child) ? 'page' : undefined}
                              className={`block rounded-lg px-3 py-2.5 text-sm transition-colors ${
                                isActive(child)
                                  ? 'text-brand-teal'
                                  : 'text-brand-ink/70 hover:text-brand-teal'
                              }`}
                            />
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>
              <LeadTrigger className="mt-5 w-full">{t('cta.apply')}</LeadTrigger>
            </nav>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
