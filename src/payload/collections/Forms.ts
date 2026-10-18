import type { CollectionConfig } from 'payload';

import { CONDITION_OPERATORS, FIELD_TYPES } from '@/lib/forms/definition';

import { anyone, authenticated } from '../access';
import { text, textarea, url } from '../fields';
import { revalidates } from '../hooks/revalidate';

/**
 * A form, as data: its fields, conditions, emails, redirect and webhook.
 *
 * `lead` is the enquiry form behind the floating button, every closing call to
 * action and each programme's hero. The contact page picks a form by slug.
 */
export const Forms: CollectionConfig = {
  slug: 'forms',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug', 'updatedAt'], group: 'Forms' },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  hooks: revalidates('forms'),
  fields: [
    text('title', { required: true }),
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: '`lead` is the site-wide enquiry form.' },
    },
    textarea('intro'),
    {
      name: 'fields',
      type: 'array',
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            text('label', { required: true, admin: { width: '40%' } }),
            {
              name: 'name',
              type: 'text',
              required: true,
              admin: { width: '30%', description: 'Submitted under this key, e.g. `email`.' },
            },
            {
              name: 'type',
              type: 'select',
              required: true,
              defaultValue: 'text',
              options: FIELD_TYPES.map((value) => ({ label: value, value })),
              admin: { width: '30%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'required', type: 'checkbox', admin: { width: '20%' } },
            {
              name: 'width',
              type: 'select',
              defaultValue: 'full',
              options: [
                { label: 'Full row', value: 'full' },
                { label: 'Half row', value: 'half' },
              ],
              admin: { width: '30%' },
            },
            text('placeholder', { admin: { width: '50%' } }),
          ],
        },
        {
          name: 'choicesSource',
          type: 'select',
          defaultValue: 'manual',
          options: [
            { label: 'Typed below', value: 'manual' },
            { label: 'Partners on this site', value: 'partners' },
            { label: 'Programmes on this site (grouped by partner)', value: 'programs' },
          ],
          admin: { condition: (_, sibling) => ['select', 'radio', 'checkboxes'].includes(sibling?.type) },
        },
        textarea('choices', {
          admin: {
            description: 'One choice per line.',
            condition: (_, sibling) =>
              ['select', 'radio', 'checkboxes'].includes(sibling?.type) && (sibling?.choicesSource ?? 'manual') === 'manual',
          },
        }),
        {
          name: 'condition',
          type: 'group',
          admin: { description: 'Optional: only show this field when…' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'field', type: 'text', admin: { width: '40%', description: 'Name of the other field' } },
                {
                  name: 'operator',
                  type: 'select',
                  defaultValue: 'is',
                  options: CONDITION_OPERATORS.map((value) => ({ label: value, value })),
                  admin: { width: '20%' },
                },
                { name: 'value', type: 'text', admin: { width: '40%' } },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'After sending',
      fields: [
        text('submitLabel'),
        textarea('consent', { admin: { description: 'Small print beside the button.' } }),
        textarea('successMessage'),
        url('redirectUri', { admin: { description: 'Send the visitor here instead of showing the message.' } }),
      ],
    },
    {
      type: 'collapsible',
      label: 'Notifications',
      fields: [
        {
          name: 'notify',
          type: 'text',
          hasMany: true,
          admin: { description: 'Email addresses told about every submission.' },
        },
        url('webhookUrl', { admin: { description: 'Optional: every submission is POSTed here as JSON (CRM, Odoo, Zapier).' } }),
      ],
    },
  ],
};

/** Every submission, stored before any email is attempted. */
export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  labels: { singular: 'Submission', plural: 'Submissions' },
  admin: {
    useAsTitle: 'summary',
    defaultColumns: ['summary', 'form', 'locale', 'createdAt'],
    group: 'Forms',
  },
  access: { read: authenticated, create: () => false, update: authenticated, delete: authenticated },
  defaultSort: '-createdAt',
  fields: [
    { name: 'form', type: 'relationship', relationTo: 'forms', required: true, index: true },
    { name: 'summary', type: 'text', admin: { readOnly: true } },
    { name: 'data', type: 'json', required: true },
    {
      type: 'row',
      fields: [
        { name: 'locale', type: 'text', admin: { readOnly: true, width: '20%' } },
        { name: 'source', type: 'text', admin: { readOnly: true, width: '50%' } },
        { name: 'ip', type: 'text', admin: { readOnly: true, width: '30%' } },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: ['new', 'contacted', 'qualified', 'closed'].map((value) => ({ label: value, value })),
      admin: { position: 'sidebar' },
    },
  ],
};
