import type { ArrayField, Field, GroupField, TextField, TextareaField, UploadField } from 'payload';

import { STAT_ICONS } from './icons';

/**
 * Field builders shared by every collection and global.
 *
 * The content model mirrors the front-end's own types in
 * `src/lib/cms/types.ts` field for field — a global's `hero.heading` is
 * `HomeContent['hero']['heading']` — so the read layer can normalise a
 * document generically instead of mapping a hundred names by hand.
 *
 * Words are localized; structure is not. A counter row, a module or a timeline
 * entry exists once and carries its English and Arabic text side by side, so a
 * translator fills in words without having to rebuild the rows, and an Arabic
 * field left empty falls back to the English one.
 */

export const text = (name: string, extra: Partial<TextField> = {}): TextField =>
  ({ name, type: 'text', localized: true, ...extra }) as TextField;

export const textarea = (name: string, extra: Partial<TextareaField> = {}): TextareaField =>
  ({ name, type: 'textarea', localized: true, ...extra }) as TextareaField;

/** A plain link or path — the same in every language. */
export const url = (name: string, extra: Partial<TextField> = {}): TextField =>
  ({ name, type: 'text', ...extra }) as TextField;

export const image = (name: string, extra: Partial<UploadField> = {}): UploadField =>
  ({ name, type: 'upload', relationTo: 'media', ...extra }) as UploadField;

/**
 * A list of short strings — highlights, badges, careers.
 *
 * Payload has no array-of-strings field, so each row is `{ value }`. The read
 * layer flattens any row whose only field is `value` back into a string.
 */
export const list = (
  name: string,
  extra: Partial<ArrayField> & { multiline?: boolean } = {},
): ArrayField => {
  const { multiline, ...rest } = extra;

  return {
    name,
    type: 'array',
    labels: { singular: 'Item', plural: 'Items' },
    admin: { initCollapsed: false },
    fields: [
      multiline
        ? textarea('value', { required: true })
        : text('value', { required: true }),
    ],
    ...rest,
  } as ArrayField;
};

/** One paragraph per row. */
export const paragraphs = (name: string, extra: Partial<ArrayField> = {}): ArrayField =>
  list(name, { multiline: true, labels: { singular: 'Paragraph', plural: 'Paragraphs' }, ...extra });

/** Title-and-description rows: values, reasons, payment options. */
export const valueProps = (name: string, extra: Partial<ArrayField> = {}): ArrayField =>
  ({
    name,
    type: 'array',
    fields: [text('title', { required: true }), textarea('description')],
    ...extra,
  }) as ArrayField;

/**
 * Counter rows. The number is separate from its prefix and suffix so the
 * animation counts the number and leaves the rest alone.
 */
export const stats = (name = 'stats', extra: Partial<ArrayField> = {}): ArrayField =>
  ({
    name,
    type: 'array',
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'icon',
            type: 'select',
            options: STAT_ICONS.map((value) => ({ label: value, value })),
            admin: { width: '25%' },
          },
          url('prefix', { admin: { width: '15%' } }),
          url('number', { required: true, admin: { width: '20%' } }),
          url('suffix', { admin: { width: '15%' } }),
        ],
      },
      text('label', { required: true }),
    ],
    ...extra,
  }) as ArrayField;

/** Eyebrow, heading and body — the band at the top of most pages. */
export const intro = (name = 'intro', extra: { paragraphs?: boolean } = {}): GroupField => ({
  name,
  type: 'group',
  fields: [
    text('eyebrow'),
    text('heading', { required: false }),
    extra.paragraphs ? paragraphs('body') : textarea('body'),
  ],
});

/** A titled section: eyebrow, heading, body, then whatever else it holds. */
export const section = (name: string, fields: Field[], label?: string): GroupField => ({
  name,
  label,
  type: 'group',
  fields,
});

/** Heading and body. */
export const headed = (name: string, label?: string): GroupField =>
  section(name, [text('heading'), textarea('body')], label);

/** A heading and a body, plus a call to action. */
export const cta = (name = 'cta'): GroupField =>
  section(name, [text('heading'), textarea('body'), text('label'), url('href')]);
