import type { ArrayField, GlobalConfig } from 'payload';

import { DICTIONARY } from '@/lib/i18n/dictionary';

import { anyone, authenticated } from '../access';
import { image, text, textarea, url } from '../fields';
import { revalidateGlobal } from '../hooks/revalidate';

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: { group: 'Settings' },
  access: { read: anyone, update: authenticated },
  hooks: { afterChange: [revalidateGlobal('settings')] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            text('tagline'),
            {
              name: 'contact',
              type: 'group',
              fields: [
                { type: 'row', fields: [url('email', { admin: { width: '50%' } }), url('phone', { admin: { width: '50%' } })] },
                textarea('address'),
                url('mapUrl', { admin: { description: 'A link to the office on Google Maps.' } }),
              ],
            },
          ],
        },
        {
          label: 'Social',
          fields: [
            {
              name: 'social',
              type: 'array',
              admin: { description: 'One row per network. The label picks the icon (LinkedIn, Instagram, YouTube…).' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true, admin: { width: '30%' } },
                    { name: 'url', type: 'text', required: true, admin: { width: '50%' } },
                    { name: 'sticky', type: 'checkbox', label: 'Sticky bar', admin: { width: '20%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'SEO defaults',
          fields: [
            image('defaultOgImage', { admin: { description: 'Shared on social when a page has no image of its own. 1200×630.' } }),
            {
              name: 'organization',
              type: 'group',
              admin: { description: 'Feeds the Organization structured data every page carries.' },
              fields: [
                text('legalName'),
                image('logo'),
                url('foundingDate', { admin: { description: 'e.g. 2013' } }),
              ],
            },
            {
              name: 'verification',
              type: 'group',
              fields: [
                url('google', { admin: { description: 'Google Search Console HTML-tag token' } }),
                url('bing'),
              ],
            },
          ],
        },
        {
          label: 'Code',
          description:
            'Pasted exactly into every page — Google Tag Manager, analytics, the Meta pixel, a chat widget. Only administrators should edit this.',
          fields: [
            {
              name: 'code',
              type: 'group',
              // Runs on every page, unescaped: only administrators may change it.
              access: { update: ({ req: { user } }) => user?.role === 'admin' },
              fields: [
              { name: 'head', type: 'code', admin: { language: 'html', description: 'Runs before the page content.' } },
              { name: 'body', type: 'code', admin: { language: 'html', description: 'Runs after the page content.' } },
              ],
            },
          ],
        },
      ],
    },
  ],
};

/** A menu: links one level deep, with children for a dropdown. */
const menu = (name: string, label: string): ArrayField => ({
  name,
  label,
  type: 'array',
  localized: true,
  admin: { initCollapsed: true },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'label', type: 'text', required: true, admin: { width: '40%' } },
        { name: 'href', type: 'text', required: true, admin: { width: '45%', description: '/programs or https://…' } },
        { name: 'newTab', type: 'checkbox', admin: { width: '15%' } },
      ],
    },
    {
      name: 'children',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', required: true, admin: { width: '40%' } },
            { name: 'href', type: 'text', required: true, admin: { width: '45%' } },
            { name: 'newTab', type: 'checkbox', admin: { width: '15%' } },
          ],
        },
      ],
    },
  ],
});

/**
 * Header and footer links, per language. Empty menus fall back to the
 * built-in ones, so the site never renders without navigation.
 */
export const Navigation: GlobalConfig = {
  slug: 'navigation',
  admin: { group: 'Settings' },
  access: { read: anyone, update: authenticated },
  hooks: { afterChange: [revalidateGlobal('menus')] },
  fields: [
    menu('primary', 'Header'),
    menu('footerExplore', 'Footer — Explore'),
    menu('footerPrograms', 'Footer — Programmes'),
    menu('footerLegal', 'Footer — Legal'),
  ],
};

/**
 * The interface's own words — button labels, form messages — reworded or
 * translated without a developer. The site ships all of them in
 * `src/lib/i18n/dictionary.ts`; anything set here overrides that.
 */
export const InterfaceStrings: GlobalConfig = {
  slug: 'interface-strings',
  label: 'Interface strings',
  admin: { group: 'Settings' },
  access: { read: anyone, update: authenticated },
  hooks: { afterChange: [revalidateGlobal('strings')] },
  fields: [
    {
      name: 'overrides',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'key',
              type: 'select',
              required: true,
              options: Object.entries(DICTIONARY.en).map(([value, label]) => ({
                value,
                label: `${value} — ${String(label).slice(0, 50)}`,
              })),
              admin: { width: '50%' },
            },
            { name: 'value', type: 'text', localized: true, admin: { width: '50%' } },
          ],
        },
      ],
    },
  ],
};
