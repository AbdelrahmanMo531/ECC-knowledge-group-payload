import type { Field, GlobalConfig, Tab } from 'payload';

import { authenticated, anyone } from '../access';
import {
  headed,
  image,
  intro,
  list,
  paragraphs,
  stats,
  text,
  textarea,
  url,
  valueProps,
} from '../fields';
import { revalidateGlobal } from '../hooks/revalidate';

/**
 * The app-built pages, one Global each.
 *
 * Their layouts are compiled into the app, so their fields are fixed — and are
 * the front-end's content types (`HomeContent`, `FeesContent`…) one for one.
 * Every field is optional: whatever is left empty falls back to the shipped
 * copy in `src/lib/content/site.ts`, so a half-filled page still renders a
 * complete one.
 */

/** A named tab: shows as a tab in the admin, stored as a group. */
const tab = (name: string, fields: Field[], label?: string): Tab => ({ name, label, fields });

function pageGlobal(slug: string, label: string, route: string, tabs: Tab[] | Field[], tags: string[] = []): GlobalConfig {
  const isTabs = (tabs as Tab[]).every((entry) => 'fields' in entry && !('type' in entry));

  return {
    slug,
    label,
    admin: {
      group: 'Pages',
      description: `Content for ${route}. Empty fields fall back to the built-in copy.`,
      preview: () => route,
    },
    access: { read: anyone, update: authenticated },
    hooks: { afterChange: [revalidateGlobal('pages', slug, ...tags)] },
    fields: isTabs ? [{ type: 'tabs', tabs: tabs as Tab[] }] : (tabs as Field[]),
  };
}

const perPage = (fallback: number): Field => ({
  name: 'perPage',
  type: 'number',
  min: 1,
  max: 60,
  admin: { description: `How many fit a page. Empty uses ${fallback}.` },
});

export const HomePage = pageGlobal(
  'home-page',
  'Home',
  '/',
  [
    tab('hero', [
      text('eyebrow'),
      text('heading'),
      textarea('body'),
      { type: 'row', fields: [text('ctaLabel', { admin: { width: '50%' } }), url('ctaHref', { admin: { width: '50%' } })] },
      list('badges'),
      image('image'),
    ]),
    tab('figures', [list('countries', { admin: { description: 'Where the partner institutions are.' } }), stats()], 'Countries & counters'),
    tab('why', [text('heading'), textarea('body'), valueProps('items')], 'Why ECC'),
    tab('about', [
      text('eyebrow'),
      text('heading'),
      textarea('body'),
      textarea('mission'),
      textarea('vision'),
      valueProps('values'),
      { type: 'row', fields: [text('ctaLabel', { admin: { width: '50%' } }), url('ctaHref', { admin: { width: '50%' } })] },
      image('image'),
      image('imageTwo', { admin: { description: 'A landscape second image. Hidden on small screens.' } }),
    ]),
    tab('video', [
      text('eyebrow'),
      text('heading'),
      textarea('body'),
      url('url', { admin: { description: 'Vimeo or YouTube. The section hides when empty.' } }),
      image('poster'),
    ]),
    tab('ceo', [text('eyebrow'), text('heading'), paragraphs('message'), text('name'), text('role'), image('photo')], 'CEO message'),
    tab('cta', [text('heading'), textarea('body'), text('label'), url('href'), image('image')], 'Closing call to action'),
  ],
  ['home'],
);

export const AboutPage = pageGlobal('about-page', 'About us', '/about-us/', [
  tab('intro', [text('eyebrow'), text('heading'), paragraphs('body'), image('image')]),
  tab('purpose', [textarea('mission'), textarea('vision'), stats()], 'Mission, vision & counters'),
  tab('sections', [headed('programmes'), headed('network'), headed('recognition'), headed('feedback')], 'Section headings'),
  tab('ceremonies', [
    text('heading'),
    textarea('body'),
    { name: 'images', type: 'upload', relationTo: 'media', hasMany: true, maxRows: 3 },
    url('video'),
    stats(),
    { type: 'row', fields: [text('ctaLabel', { admin: { width: '50%' } }), url('ctaHref', { admin: { width: '50%' } })] },
  ]),
]);

export const ContactPage = pageGlobal('contact-page', 'Contact', '/contact/', [
  tab('intro', [text('eyebrow'), text('heading'), paragraphs('body'), list('hours', { admin: { description: 'Opening hours, one line each.' } })]),
  tab('form', [text('heading'), textarea('body'), url('slug', { admin: { description: 'Which form to show — its slug under Forms.' } })]),
  tab('map', [text('heading'), url('embedUrl', { admin: { description: 'A Google Maps embed URL. Empty builds one from the address in Site settings.' } })]),
]);

export const PeoplePage = pageGlobal(
  'people-page',
  'Our people',
  '/our-people/',
  [
    intro(),
    {
      name: 'teams',
      type: 'array',
      admin: { description: 'The tabs people are grouped into, in order. Each person names their tab.' },
      fields: [text('label', { required: true }), textarea('description')],
    },
  ],
  ['team', 'faculty'],
);

export const StaffPage = pageGlobal('staff-page', 'Academic staff', '/our-academic-staff/', [intro(), perPage(12)], ['faculty']);

export const StoriesPage = pageGlobal('stories-page', 'Graduate stories', '/testimonials/', [intro(), perPage(9)], ['testimonials']);

export const GalleryPage = pageGlobal('gallery-page', 'Video gallery', '/video-gallery/', [intro(), perPage(12)], ['videos']);

export const PodcastPage = pageGlobal('podcast-page', 'Podcasts', '/podcast/', [intro()], ['podcasts']);

export const FaqPage = pageGlobal('faq-page', 'FAQ', '/faq/', [intro()], ['faqs']);

export const AccreditationsPage = pageGlobal('accreditations-page', 'Accreditations', '/accreditations/', [intro()], ['accreditations']);

export const FeesPage = pageGlobal('fees-page', 'Fees structure', '/fees-structure/', [
  tab('intro', [text('eyebrow'), text('heading'), textarea('body'), list('highlights')]),
  tab('breakdown', [text('heading'), textarea('body'), valueProps('items')], 'What fees cover'),
  tab('quote', [textarea('quote')], 'Pull quote'),
  tab('payments', [text('heading'), textarea('body'), valueProps('items')], 'Payment options'),
  tab('value', [text('heading'), textarea('body'), list('points', { multiline: true })]),
  tab('refund', [
    text('heading'),
    textarea('body'),
    { name: 'questions', type: 'array', fields: [text('question', { required: true }), textarea('answer')] },
  ]),
]);

const socialSection = (name: string, label: string): Tab =>
  tab(name, [text('eyebrow'), text('heading'), textarea('body'), valueProps('items')], label);

export const SocialPage = pageGlobal('social-page', 'Social responsibility', '/social-responsibility/', [
  tab('intro', [text('eyebrow'), text('heading'), textarea('body'), list('tags'), textarea('quote')]),
  socialSection('pillars', 'Pillars'),
  socialSection('ecosystem', 'Stakeholder ring'),
  tab('initiative', [
    text('eyebrow'),
    text('heading'),
    textarea('body'),
    { type: 'row', fields: [url('figure', { admin: { width: '30%' } }), text('figureLabel', { admin: { width: '70%' } })] },
    image('image'),
    url('video'),
  ], 'Featured initiative'),
]);

export const CeremoniesPage = pageGlobal('ceremonies-page', 'Graduation ceremonies', '/graduation-ceremonies/', [
  tab('intro', [text('eyebrow'), text('heading'), textarea('body'), stats()]),
  tab('legacy', [text('eyebrow'), text('heading'), textarea('body'), list('points'), image('image')]),
  tab('timeline', [
    text('eyebrow'),
    text('heading'),
    textarea('body'),
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'status',
              type: 'select',
              defaultValue: 'completed',
              options: [
                { label: 'Completed', value: 'completed' },
                { label: 'Upcoming', value: 'upcoming' },
              ],
              admin: { width: '30%' },
            },
            url('year', { admin: { width: '20%' } }),
            text('place', { admin: { width: '50%' } }),
          ],
        },
        textarea('description'),
      ],
    },
  ]),
  tab('gallery', [
    text('eyebrow'),
    text('heading'),
    { name: 'images', type: 'array', fields: [image('image', { required: true }), text('caption')] },
  ], 'Photo gallery'),
  tab('films', [
    text('eyebrow'),
    text('heading'),
    { name: 'items', type: 'array', fields: [text('title', { required: true }), text('credit'), url('video', { required: true }), image('poster')] },
  ]),
  tab('highlights', [text('eyebrow'), text('heading'), valueProps('items')], 'What to expect'),
  tab('next', [
    text('eyebrow'),
    text('heading'),
    textarea('body'),
    image('image'),
    { name: 'facts', type: 'array', fields: [text('label', { required: true }), text('value')] },
    { name: 'agenda', type: 'array', fields: [url('time'), text('item', { required: true })] },
  ], 'Next ceremony'),
  tab('cta', [text('heading'), textarea('body')], 'Closing call to action'),
]);

export const PAGE_GLOBALS = [
  HomePage,
  AboutPage,
  ContactPage,
  PeoplePage,
  StaffPage,
  StoriesPage,
  GalleryPage,
  PodcastPage,
  FaqPage,
  AccreditationsPage,
  FeesPage,
  SocialPage,
  CeremoniesPage,
];
