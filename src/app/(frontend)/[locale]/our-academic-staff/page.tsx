import type { Metadata } from 'next';
import Image from 'next/image';

import { CallToAction } from '@/components/sections/CallToAction';
import { Container } from '@/components/ui/Container';
import { Link } from '@/components/ui/Link';
import { PageHeader } from '@/components/ui/PageHeader';
import { Pagination } from '@/components/ui/Pagination';
import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n/config';
import { format } from '@/lib/i18n/dictionary';
import { setRequestLocale, t } from '@/lib/i18n/server';
import { buildMetadata } from '@/lib/seo';
import { DEFAULT_PER_PAGE, paginate } from '@/lib/pagination';
import {
  filterBySpecialization,
  isKnownSpecialization,
  specializationsOf,
  staffHref,
} from '@/lib/staff';
import { getAcademicMembers, getSiteSettings, getStaffContent } from '@/lib/cms/api';
import type { AcademicMember } from '@/lib/cms/types';
import { Arrow } from '@/components/ui/Arrow';

type Params = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; specialization?: string }>;
};

export async function generateMetadata({ params, searchParams }: Params): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = isLocale(requested) ? requested : DEFAULT_LOCALE;

  const [{ content, seo, translated }, { page, specialization }] = await Promise.all([
    getStaffContent(locale),
    searchParams,
  ]);

  const filtered = Boolean(specialization) || Number(page) > 1;

  return buildMetadata({
    title: seo?.title || content.intro.heading,
    description: seo?.description || content.intro.body,
    path: '/our-academic-staff',
    locale,
    translated,
    seo: seo,
    // Every filter-and-page combination is the same set of people in a
    // different order of appearance. Only the unfiltered first page is worth
    // indexing; the rest still get crawled for the links they carry.
    robots: filtered ? ['noindex', 'follow'] : seo?.robots,
    openGraph: seo?.openGraph,
  });
}

export default async function AcademicStaffPage({ params, searchParams }: Params) {
  const { locale: requested } = await params;
  const locale = await setRequestLocale(requested);

  const [{ content }, members, settings, query] = await Promise.all([
    getStaffContent(locale),
    getAcademicMembers(locale),
    getSiteSettings(locale),
    searchParams,
  ]);

  const specializations = specializationsOf(members);
  const selected =
    query.specialization && isKnownSpecialization(members, query.specialization)
      ? query.specialization
      : '';

  const matching = filterBySpecialization(members, selected);
  const page = paginate(
    matching,
    Number(query.page) || 1,
    content.perPage || DEFAULT_PER_PAGE,
  );

  const current = specializations.find((term) => term.slug === selected);

  return (
    <>
      <PageHeader
        eyebrow={content.intro.eyebrow}
        title={content.intro.heading}
        description={content.intro.body}
      />

      <section className="bg-white py-14 lg:py-20">
        <Container size="wide">
          {specializations.length ? (
            <nav aria-label={t('list.filter.specialisation')} className="flex flex-wrap gap-2">
              <Filter
                href={staffHref()}
                label={t('aria.specialisations.all')}
                count={members.length}
                active={!selected}
              />
              {specializations.map((term) => (
                <Filter
                  key={term.slug}
                  href={staffHref({ specialization: term.slug })}
                  label={term.name}
                  count={term.count}
                  active={term.slug === selected}
                />
              ))}
            </nav>
          ) : null}

          <p
            // Announced when the list changes under a screen reader, which
            // otherwise has no way to know a filter did anything.
            aria-live="polite"
            className={`text-sm text-brand-ink/55 ${specializations.length ? 'mt-8' : ''}`}
          >
            {resultsLine(page, current?.name)}
          </p>

          {page.items.length ? (
            <>
              <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {page.items.map((member) => (
                  <li key={member.id}>
                    <StaffCard member={member} />
                  </li>
                ))}
              </ul>

              <Pagination
                current={page.current}
                total={page.total}
                href={(to) => staffHref({ page: to, specialization: selected })}
                label={t('aria.pages.academics')}
              />
            </>
          ) : (
            <p className="mt-10 max-w-2xl text-base leading-relaxed text-brand-ink/60">
              {t('empty.staff')}{' '}
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

/**
 * "17 academics in Finance · page 2 of 3".
 *
 * Was assembled inline out of English words and an English plural rule, which
 * put an English sentence on the Arabic page — and would have been wrong there
 * even translated, since Arabic does not divide counts into one and many the
 * way English does. Each clause is now a whole string per language with the
 * number inside it, and the middle dot is the only piece the two share.
 */
function resultsLine(
  page: { count: number; current: number; total: number },
  specialisation?: string,
): string {
  if (page.count === 0) return t('notfound.academics');

  const counted = specialisation
    ? format(t('list.academics.in'), {
        count: page.count,
        specialisation,
      })
    : page.count === 1
      ? t('list.academics.count.one')
      : format(t('list.academics.count'), { count: page.count });

  if (page.total <= 1) return counted;

  return `${counted} · ${format(t('list.page.of'), {
    current: page.current,
    total: page.total,
  })}`;
}

function Filter({
  href,
  label,
  count,
  active,
}: {
  href: string;
  label: string;
  count: number;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      // Links rather than buttons: each filter is a real URL that can be
      // shared, bookmarked and crawled, and it works before any JavaScript has
      // loaded.
      aria-current={active ? 'page' : undefined}
      scroll={false}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
        active
          ? 'bg-brand-teal text-brand-beige'
          : 'bg-brand-beige/70 text-brand-teal hover:bg-brand-sand'
      }`}
    >
      {label}
      <span className={active ? 'text-brand-beige/60' : 'text-brand-ink/40'}>
        {count}
      </span>
    </Link>
  );
}

function StaffCard({ member }: { member: AcademicMember }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-brand)*1.5)] border border-brand-sand/70 bg-brand-beige/30 transition-all duration-300 ease-[var(--ease-brand)] hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-teal/[0.07]">
      <div className="relative overflow-hidden bg-brand-teal">
        {member.photo?.sourceUrl ? (
          <Image
            src={member.photo.sourceUrl}
            alt={member.photo.altText || member.name}
            width={520}
            height={640}
            className="aspect-[4/5] w-full object-cover transition-transform duration-500 ease-[var(--ease-brand)] group-hover:scale-[1.04]"
          />
        ) : (
          <div
            aria-hidden
            className="bg-brand-gradient-teal flex aspect-[4/5] w-full items-center justify-center font-serif text-5xl text-brand-beige/80"
          >
            {member.name.charAt(0)}
          </div>
        )}

        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-brand-gold"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h2 className="text-base font-bold leading-snug text-brand-teal">
          {member.detailPath ? (
            <Link
              href={member.detailPath}
              className="before:absolute before:inset-0 before:content-['']"
            >
              {member.name}
            </Link>
          ) : (
            member.name
          )}
        </h2>

        {member.position ? (
          <p className="mt-2 text-sm leading-snug text-brand-ink/70">{member.position}</p>
        ) : null}

        {member.institution ? (
          <p className="mt-1.5 text-sm leading-snug text-brand-ink/50">
            {member.institution}
          </p>
        ) : null}

        {member.specializations.length ? (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {member.specializations.map((term) => (
              <li
                key={term.slug}
                className="rounded-full bg-white px-2.5 py-1 text-[0.7rem] leading-none text-brand-turquoise ring-1 ring-brand-sand"
              >
                {term.name}
              </li>
            ))}
          </ul>
        ) : null}

        <span
          aria-hidden
          className="mt-auto pt-5 text-xs font-medium text-brand-turquoise transition-colors group-hover:text-brand-teal"
        >
          {t('cta.profile')} <Arrow />
        </span>
      </div>
    </article>
  );
}
