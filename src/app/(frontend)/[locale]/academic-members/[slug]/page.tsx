import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { redirectIfMoved } from '@/lib/redirects';

import { CallToAction } from '@/components/sections/CallToAction';
import { Container } from '@/components/ui/Container';
import { DEFAULT_LOCALE, isLocale, localePath, translatedPaths } from '@/lib/i18n/config';
import { format, translate } from '@/lib/i18n/dictionary';
import { setRequestLocale, t } from '@/lib/i18n/server';
import { Link } from '@/components/ui/Link';
import { SITE_NAME, buildMetadata, siteUrl } from '@/lib/seo';
import {
  getAcademicMember,
  getAcademicMemberSlugs,
  getSiteSettings,
} from '@/lib/cms/api';
import type { AcademicMember } from '@/lib/cms/types';
import { Arrow } from '@/components/ui/Arrow';

type Params = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  const locale = isLocale(params.locale) ? params.locale : DEFAULT_LOCALE;

  const slugs = await getAcademicMemberSlugs(locale);

  return slugs.map((slug) => ({ slug }));
}

/** Academics added after a build render on first request. */
export const dynamicParams = true;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = isLocale(requested) ? requested : DEFAULT_LOCALE;

  const { slug } = await params;
  const member = await getAcademicMember(slug, locale);

  if (!member) return buildMetadata({ title: translate(locale, 'notfound.person'), locale });

  const where = member.institution
    ? format(translate(locale, 'meta.faculty.at'), { where: member.institution })
    : '';

  return buildMetadata({
    title: member.seo?.title || member.name,
    description:
      member.seo?.description ||
      format(translate(locale, 'meta.faculty'), {
        who: `${member.name}${member.position ? `, ${member.position}` : ''}${where}`,
        site: SITE_NAME,
      }),
    path: `/academic-members/${member.slug}`,
    locale,
    // Where the same thing lives in the other language, as the CMS knows it.
    // A profile is one localized document with one slug, so this is the same
    // address under the other prefix; going through `translatedPaths` keeps it
    // on the rule pages and articles follow, where the slug can differ and
    // `null` is what keeps a crawler and the switcher off a missing page.
    languages: translatedPaths(locale, `/academic-members/${member.slug}`, member.translations),
    image: member.photo?.sourceUrl,
    seo: member.seo,
    robots: member.seo?.robots,
    openGraph: member.seo?.openGraph,
  });
}

/**
 * The academic as a person, with the affiliation and credentials that make a
 * teaching claim checkable rather than asserted.
 */
function MemberSchema({ member }: { member: AcademicMember }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: member.name,
          url: `${siteUrl()}/academic-members/${member.slug}`,
          ...(member.position ? { jobTitle: member.position } : {}),
          ...(member.photo?.sourceUrl ? { image: member.photo.sourceUrl } : {}),
          ...(member.institution
            ? { affiliation: { '@type': 'Organization', name: member.institution } }
            : {}),
          ...(member.linkedin ? { sameAs: [member.linkedin] } : {}),
          ...(member.expertise.length ? { knowsAbout: member.expertise } : {}),
          worksFor: { '@type': 'EducationalOrganization', name: SITE_NAME },
        }).replace(/</g, '\\u003c'),
      }}
    />
  );
}

export default async function AcademicMemberPage({ params }: Params) {
  const { locale: requested } = await params;
  const locale = await setRequestLocale(requested);

  const { slug } = await params;
  const [member, settings] = await Promise.all([
    getAcademicMember(slug, locale),
    getSiteSettings(locale),
  ]);

  if (!member) {
    await redirectIfMoved(localePath(locale, `/academic-members/${slug}`));
    notFound();
  }

  return (
    <>
      <MemberSchema member={member} />

      <section className="relative overflow-hidden bg-brand-teal text-brand-beige">
        <div
          aria-hidden
          className="pointer-events-none absolute -end-32 -top-48 h-[34rem] w-[34rem] rounded-full bg-brand-turquoise/20 blur-3xl"
        />

        <Container size="wide" className="relative">
          <div className="py-14 lg:py-20">
            <Link
              href="/our-academic-staff"
              className="inline-flex items-center gap-2 text-sm text-brand-beige/70 transition-colors hover:text-brand-gold"
            >
              <Arrow back /> Our academic staff
            </Link>

            <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-4">
                <div className="relative mx-auto aspect-[4/5] w-full max-w-[20rem] overflow-hidden rounded-[calc(var(--radius-brand)*1.5)] bg-brand-teal/60 ring-1 ring-brand-beige/15">
                  {member.photo?.sourceUrl ? (
                    <Image
                      src={member.photo.sourceUrl}
                      alt={member.photo.altText || member.name}
                      fill
                      sizes="(min-width: 1024px) 20rem, 80vw"
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-6xl font-bold text-brand-beige/30">
                      {member.name.charAt(0)}
                    </span>
                  )}
                </div>
              </div>

              <div className="lg:col-span-8">
                <h1 className="text-3xl font-bold leading-tight tracking-[-0.02em] sm:text-4xl">
                  {member.name}
                </h1>

                {member.position ? (
                  <p className="mt-4 text-lg leading-relaxed text-brand-gold">
                    {member.position}
                  </p>
                ) : null}

                {member.institution ? (
                  <p className="mt-1.5 text-base text-brand-beige/75">
                    {member.institution}
                  </p>
                ) : null}

                {member.credentials ? (
                  <p className="mt-4 text-sm text-brand-beige/60">{member.credentials}</p>
                ) : null}

                {member.specializations.length ? (
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {member.specializations.map((term) => (
                      <li key={term.slug}>
                        <Link
                          href={`/our-academic-staff?specialization=${term.slug}`}
                          className="inline-flex rounded-full bg-brand-gold/15 px-4 py-1.5 text-sm text-brand-gold transition-colors hover:bg-brand-gold hover:text-brand-teal"
                        >
                          {term.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {member.expertise.length ? (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {member.expertise.map((area, index) => (
                      <li
                        key={`${index}-${area}`}
                        className="rounded-full border border-brand-beige/20 bg-brand-beige/[0.07] px-4 py-1.5 text-sm text-brand-beige/85"
                      >
                        {area}
                      </li>
                    ))}
                  </ul>
                ) : null}

                {member.linkedin ? (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-8 inline-flex items-center gap-2 rounded-full border border-brand-beige/30 px-5 py-2.5 text-sm font-medium transition-colors hover:border-brand-gold hover:text-brand-gold"
                  >
                    {t('people.linkedin')}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <Container size="wide">
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-7">
              {member.bio ? (
                <>
                  <h2 className="text-2xl font-bold text-brand-teal">
                    About {shortName(member.name)}
                  </h2>
                  <span aria-hidden className="mt-5 block h-px w-16 bg-brand-gold" />

                  <div
                    className="prose-ecc mt-6"
                    dangerouslySetInnerHTML={{ __html: member.bio }}
                  />
                </>
              ) : null}

              {member.experience.length ? (
                <div className={member.bio ? 'mt-14' : undefined}>
                  <h2 className="text-2xl font-bold text-brand-teal">
                    {t('people.experience')}
                  </h2>
                  <span aria-hidden className="mt-5 block h-px w-16 bg-brand-gold" />

                  <ol className="mt-8 space-y-0">
                    {member.experience.map((post, index) => (
                      <li
                        key={`${index}-${post.role}`}
                        // A rule down the left with a node per post: the shape
                        // of a career, not a bulleted list of job titles.
                        className="relative border-s border-brand-sand ps-8 pb-8 last:border-transparent last:pb-0"
                      >
                        <span
                          aria-hidden
                          className="absolute -start-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-brand-gold ring-4 ring-white"
                        />
                        <p className="text-base font-semibold text-brand-teal">
                          {post.role}
                        </p>
                        {post.organisation ? (
                          <p className="mt-1 text-sm text-brand-ink/70">
                            {post.organisation}
                          </p>
                        ) : null}
                        {post.period ? (
                          <p className="mt-1.5 text-xs uppercase tracking-[0.14em] text-brand-turquoise">
                            {post.period}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}
            </div>

            <aside className="space-y-10 lg:col-span-5">
              {member.qualifications.length ? (
                <Panel title={t('section.qualifications')}>
                  <ul className="space-y-5">
                    {member.qualifications.map((qualification, index) => (
                      <li key={`${index}-${qualification.title}`}>
                        <p className="text-sm font-semibold text-brand-teal">
                          {qualification.title}
                        </p>
                        {qualification.institution || qualification.year ? (
                          <p className="mt-1 text-sm text-brand-ink/65">
                            {[qualification.institution, qualification.year]
                              .filter(Boolean)
                              .join(' · ')}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </Panel>
              ) : null}

              {member.teaching.length ? (
                <Panel title={t('people.teaching')}>
                  <Pills items={member.teaching} />
                </Panel>
              ) : null}

              {member.research.length ? (
                <Panel title={t('people.research')}>
                  <Pills items={member.research} />
                </Panel>
              ) : null}
            </aside>
          </div>
        </Container>
      </section>

      <CallToAction settings={settings} />
    </>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[var(--radius-brand)] border border-brand-sand bg-brand-beige/40 p-7">
      <h2 className="text-xs uppercase tracking-[0.16em] text-brand-turquoise">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Pills({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <li
          key={`${index}-${item}`}
          className="rounded-full bg-white px-3.5 py-1.5 text-sm text-brand-ink/75 ring-1 ring-brand-sand"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

/**
 * "About Dr. Mohamed" rather than "About Prof. Mohamed Samy Tawfik El-Deep" —
 * the full name is already the H1 two inches above.
 */
function shortName(name: string): string {
  const parts = name.split(/\s+/);
  const honorific = /^(prof\.?|dr\.?|mr\.?|mrs\.?|ms\.?|eng\.?)$/i;

  return parts[0] && honorific.test(parts[0])
    ? parts.slice(0, 2).join(' ')
    : (parts[0] ?? name);
}
