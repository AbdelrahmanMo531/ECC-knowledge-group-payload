/**
 * Loads the site's built-in copy into Payload, so editors start from the
 * content the site already shows rather than an empty admin.
 *
 *     npm run seed
 *
 * Idempotent: a global is only written while it is empty, and a document is
 * only created when nothing with its slug exists — re-running never overwrites
 * an editor's work. Also creates the first admin user from SEED_ADMIN_EMAIL /
 * SEED_ADMIN_PASSWORD when there are no users yet.
 */
import config from '@payload-config';
import { getPayload, type Payload } from 'payload';

import * as seed from '@/lib/content/site';
import type { Module } from '@/lib/cms/types';

const payload: Payload = await getPayload({ config });
const context = { disableRevalidate: true };

/** The front-end's shapes back into Payload's: strings into `{ value }` rows, media dropped. */
function toInput(value: unknown): unknown {
  if (Array.isArray(value)) {
    if (value.every((entry) => typeof entry === 'string')) return value.map((entry) => ({ value: entry }));
    return value.map(toInput);
  }
  if (value && typeof value === 'object') {
    if ('sourceUrl' in value) return undefined;
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => key !== 'id')
        .map(([key, entry]) => [key, toInput(entry)])
        .filter(([, entry]) => entry !== undefined && entry !== null),
    );
  }
  return value;
}

const modules = (rows: Module[]) =>
  rows.map((row) => ({ ...row, outcomes: row.outcomes.join('\n') }));

/** Any typed string or row, however deep — empty groups and nulls do not count. */
function hasContent(value: unknown): boolean {
  if (typeof value === 'string') return value.trim() !== '';
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === 'object') return Object.values(value).some(hasContent);
  return false;
}

async function seedGlobal(slug: string, data: Record<string, unknown>) {
  const current = (await payload.findGlobal({ slug: slug as never, depth: 0 })) as Record<string, unknown>;
  const filled = hasContent(Object.fromEntries(
    Object.entries(current).filter(([key]) => !['id', 'globalType', 'createdAt', 'updatedAt'].includes(key)),
  ));
  if (filled) {
    payload.logger.info(`• ${slug}: already has content, left alone`);
    return;
  }
  await payload.updateGlobal({ slug: slug as never, locale: 'en', data: toInput(data) as never, context });
  payload.logger.info(`✓ ${slug}`);
}

async function exists(collection: string, slug: string) {
  const { totalDocs } = await payload.count({ collection: collection as never, where: { slug: { equals: slug } } });
  return totalDocs > 0;
}

/* ------------------------------------------------------------------ users */

const { totalDocs: users } = await payload.count({ collection: 'users' });
if (!users && process.env.SEED_ADMIN_EMAIL && process.env.SEED_ADMIN_PASSWORD) {
  await payload.create({
    collection: 'users',
    data: { email: process.env.SEED_ADMIN_EMAIL, password: process.env.SEED_ADMIN_PASSWORD, name: 'Administrator', role: 'admin' },
  });
  payload.logger.info(`✓ admin user ${process.env.SEED_ADMIN_EMAIL}`);
}

/* ---------------------------------------------------------------- globals */

const { code: _code, ...settings } = seed.siteSettings;
await seedGlobal('site-settings', settings);
await seedGlobal('navigation', {
  primary: seed.fallbackMenus.primary,
  footerExplore: seed.fallbackMenus.footerExplore,
  footerPrograms: seed.fallbackMenus.footerPrograms,
  footerLegal: seed.fallbackMenus.footerLegal,
});

const { countries, stats, ...home } = seed.homeContent;
await seedGlobal('home-page', { ...home, figures: { countries, stats } });

const { mission, vision, stats: aboutStats, programmes, network, recognition, feedback, ...about } = seed.aboutContent;
await seedGlobal('about-page', {
  ...about,
  purpose: { mission, vision, stats: aboutStats },
  sections: { programmes, network, recognition, feedback },
});

await seedGlobal('contact-page', seed.contactContent);
await seedGlobal('people-page', seed.peopleContent);
await seedGlobal('staff-page', seed.staffContent);
await seedGlobal('stories-page', seed.storiesContent);
await seedGlobal('gallery-page', seed.galleryContent);
await seedGlobal('podcast-page', seed.podcastContent);
await seedGlobal('faq-page', seed.faqPageContent);
await seedGlobal('accreditations-page', seed.recognitionContent);

const { highlights, quote, intro: feesIntro, ...fees } = seed.feesContent;
await seedGlobal('fees-page', { ...fees, intro: { ...feesIntro, highlights }, quote: { quote } });

const { tags, quote: socialQuote, intro: socialIntro, ...social } = seed.socialContent;
await seedGlobal('social-page', { ...social, intro: { ...socialIntro, tags, quote: socialQuote } });

const { intro: ceremonyIntro, stats: ceremonyStats, films, ...ceremony } = seed.ceremonyContent;
await seedGlobal('ceremonies-page', {
  ...ceremony,
  intro: { ...ceremonyIntro, stats: ceremonyStats },
  films: { ...films, items: films.items.map(({ title, credit, video }) => ({ title, credit, video })) },
});

/* ------------------------------------------------------------ collections */

const partnerIds = new Map<string, number | string>();

for (const partner of seed.partners) {
  if (await exists('partners', partner.slug)) continue;
  const { programs: _programs, accreditations: _accreditations, content: _content, ...data } = partner;
  const doc = await payload.create({ collection: 'partners', locale: 'en', data: toInput(data) as never, context });
  partnerIds.set(partner.slug, doc.id);
  payload.logger.info(`✓ partner ${partner.slug}`);
}

for (const [index, program] of seed.programs.entries()) {
  if (await exists('programs', program.slug)) continue;
  const { partner, curriculum: _curriculum, content: _content, majors, coreModules, brochure: _brochure, ...data } = program;

  let partnerId = partner ? partnerIds.get(partner.slug) : undefined;
  if (partner && !partnerId) {
    const found = await payload.find({ collection: 'partners', where: { slug: { equals: partner.slug } }, limit: 1 });
    partnerId = found.docs[0]?.id;
  }

  await payload.create({
    collection: 'programs',
    locale: 'en',
    context,
    data: {
      ...(toInput(data) as object),
      order: index + 1,
      partner: partnerId as never,
      coreModules: modules(coreModules),
      majors: majors.map(({ overview: _overview, brochure: _b, modules: rows, ...major }) => ({
        ...major,
        modules: modules(rows),
      })),
    } as never,
  });
  payload.logger.info(`✓ program ${program.slug}`);
}

const { totalDocs: accreditations } = await payload.count({ collection: 'accreditations' });
if (!accreditations) {
  for (const [index, body] of seed.accreditations.entries()) {
    await payload.create({ collection: 'accreditations', locale: 'en', data: { ...(toInput(body) as object), order: index + 1 } as never, context });
  }
  payload.logger.info(`✓ ${seed.accreditations.length} accreditations`);
}

const { totalDocs: faqs } = await payload.count({ collection: 'faqs' });
if (!faqs) {
  const { convertHTMLToLexical, editorConfigFactory } = await import('@payloadcms/richtext-lexical');
  const { JSDOM } = await import('jsdom');
  const editorConfig = await editorConfigFactory.default({ config: payload.config });

  for (const [index, faq] of seed.faqs.entries()) {
    await payload.create({
      collection: 'faqs',
      locale: 'en',
      context,
      data: { question: faq.question, answer: convertHTMLToLexical({ editorConfig, html: faq.answer, JSDOM }) as never, order: index + 1 },
    });
  }
  payload.logger.info(`✓ ${seed.faqs.length} FAQs`);
}

for (const form of seed.forms) {
  if ((await payload.count({ collection: 'forms', where: { slug: { equals: form.slug } } })).totalDocs) continue;

  await payload.create({
    collection: 'forms',
    locale: 'en',
    context,
    data: {
      ...form,
      fields: form.fields.map((field) => {
        const grouped = field.choices.some((choice) => choice.group);
        return {
          label: field.label,
          name: field.name,
          type: field.type,
          required: field.required,
          placeholder: field.placeholder,
          width: field.width,
          choicesSource: grouped ? 'programs' : 'manual',
          choices: field.choices.map((choice) => choice.value).join('\n'),
          condition: field.condition ?? undefined,
        };
      }),
    } as never,
  });
  payload.logger.info(`✓ form ${form.slug}`);
}

payload.logger.info('Seed complete.');
process.exit(0);
