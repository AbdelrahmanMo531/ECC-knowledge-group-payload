import { SITE_NAME, siteUrl } from '@/lib/seo';
import type { FaqItem, Post, Program, SiteSettings } from '@/lib/cms/types';
import { postHref } from '@/lib/posts';

/**
 * JSON-LD structured data.
 *
 * Three schemas earn their place on this page:
 *   • EducationalOrganization — establishes the entity for knowledge panels.
 *   • FAQPage — can surface the questions directly in search results, which is
 *     the highest-leverage thing on the page for a query like "is an online MBA
 *     recognised in Egypt".
 *   • Course — makes each programme eligible for course listings.
 *
 * Emitted server-side so crawlers see it in the initial HTML.
 */

/** Strips the HTML rich text renders to; JSON-LD wants plain text. */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8217;|&rsquo;/g, '’')
    .replace(/&#8216;|&lsquo;/g, '‘')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Angle brackets are escaped so a stray "</script>" in content cannot
      // break out of the tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}

export function OrganizationSchema({ settings }: { settings: SiteSettings }) {
  const url = siteUrl();

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        '@id': `${url}/#organization`,
        name: SITE_NAME,
        ...(settings.organization?.legalName ? { legalName: settings.organization.legalName } : {}),
        ...(settings.organization?.foundingDate ? { foundingDate: settings.organization.foundingDate } : {}),
        url,
        logo: settings.organization?.logo || `${url}/brand/ecc-logo-horizontal.svg`,
        description:
          'ECC Knowledge Group delivers globally recognised BBA, MBA and DBA degrees from accredited international institutions, studied online with flexible hours across Egypt and the Gulf.',
        email: settings.contact.email,
        telephone: settings.contact.phone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: settings.contact.address,
          addressCountry: 'AE',
        },
        areaServed: [
          { '@type': 'Country', name: 'United Arab Emirates' },
          { '@type': 'Country', name: 'Egypt' },
          { '@type': 'Country', name: 'Saudi Arabia' },
          { '@type': 'Country', name: 'Kuwait' },
          { '@type': 'Country', name: 'Qatar' },
        ],
        // `sameAs` is for pages that identify the organisation — its profiles.
        // A wa.me link is a way to message it, not a page about it, so the
        // WhatsApp link is left out rather than claimed as a profile.
        sameAs: settings.social
          .filter((item) => !item.url.includes('wa.me'))
          .map((item) => item.url),
      }}
    />
  );
}

export function FaqSchema({ faqs }: { faqs: FaqItem[] }) {
  if (faqs.length === 0) return null;

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: stripHtml(faq.answer),
          },
        })),
      }}
    />
  );
}

export function CourseListSchema({ programs }: { programs: Program[] }) {
  if (programs.length === 0) return null;

  const url = siteUrl();

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: programs.map((program, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Course',
            name: program.title,
            description: program.excerpt,
            url: `${url}/programs/${program.slug}/`,
            provider: {
              '@type': 'EducationalOrganization',
              name: SITE_NAME,
              '@id': `${url}/#organization`,
            },
            ...(program.awardingBody
              ? {
                  educationalCredentialAwarded: program.awardingBody,
                }
              : {}),
            hasCourseInstance: {
              '@type': 'CourseInstance',
              courseMode: 'online',
              ...(program.duration ? { courseWorkload: program.duration } : {}),
            },
          },
        })),
      }}
    />
  );
}

/** The site itself — lets a search engine name the site in results. */
export function WebsiteSchema({ locale }: { locale: 'en' | 'ar' }) {
  const url = siteUrl();

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${url}/#website`,
        url: `${url}/`,
        name: SITE_NAME,
        inLanguage: locale,
        publisher: { '@id': `${url}/#organization` },
      }}
    />
  );
}

/** An article: eligible for Top Stories and article rich results. */
export function ArticleSchema({ post, settings }: { post: Post; settings: SiteSettings }) {
  const url = siteUrl();
  const href = `${url}${postHref(post)}`;
  const image = post.seo?.image || settings.defaultOgImage;

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        '@id': `${href}#article`,
        mainEntityOfPage: href,
        headline: post.title.slice(0, 110),
        description: post.seo?.description || post.excerpt,
        inLanguage: post.language,
        datePublished: post.date,
        ...(post.modified ? { dateModified: post.modified } : {}),
        ...(image ? { image: [image] } : {}),
        ...(post.seo?.keywords?.length ? { keywords: post.seo.keywords.join(', ') } : {}),
        ...(post.categories.length ? { articleSection: post.categories[0] } : {}),
        author: post.author?.name
          ? { '@type': 'Person', name: post.author.name }
          : { '@type': 'Organization', name: SITE_NAME, '@id': `${url}/#organization` },
        publisher: {
          '@type': 'Organization',
          '@id': `${url}/#organization`,
          name: SITE_NAME,
          logo: { '@type': 'ImageObject', url: settings.organization?.logo || `${url}/brand/ecc-logo-horizontal.svg` },
        },
      }}
    />
  );
}

/** The trail from home to this page; `path` is site-relative. */
export function BreadcrumbSchema({ items }: { items: { name: string; path: string }[] }) {
  if (items.length < 2) return null;

  const url = siteUrl();

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: `${url}${item.path}`,
        })),
      }}
    />
  );
}
