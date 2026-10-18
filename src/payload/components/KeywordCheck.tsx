'use client';

import { useFormFields } from '@payloadcms/ui';

/**
 * The checks Rank Math ran on the old site, live in the editor: is the focus
 * keyword where a search engine looks for it?
 *
 * Reads the document as it is being edited, so a fix shows as soon as it is
 * typed. Advisory only — nothing here blocks a save.
 */

type Node = { text?: string; children?: Node[]; type?: string; tag?: string };

function textOf(node: Node | undefined): string {
  if (!node) return '';
  return `${node.text ?? ''} ${(node.children ?? []).map(textOf).join(' ')}`;
}

function headingsOf(node: Node | undefined): string[] {
  if (!node) return [];
  const own = node.type === 'heading' ? [textOf(node)] : [];
  return [...own, ...(node.children ?? []).flatMap(headingsOf)];
}

/** Lowercased, diacritics and Arabic tatweel/harakat removed, hyphens as spaces. */
function plain(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[ً-ٰٟـ]/g, '')
    .replace(/[آأإ]/g, 'ا')
    .replace(/[-_]+/g, ' ')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

export function KeywordCheck({ path }: { path?: string }) {
  const prefix = path?.includes('.') ? path.slice(0, path.lastIndexOf('.') + 1) : 'meta.';

  const fields = useFormFields(([state]) => ({
    keyword: state[`${prefix}focusKeyword`]?.value as string | undefined,
    metaTitle: state[`${prefix}title`]?.value as string | undefined,
    metaDescription: state[`${prefix}description`]?.value as string | undefined,
    slug: state.slug?.value as string | undefined,
    title: (state.title?.value ?? state.name?.value) as string | undefined,
    content: state.content?.value as { root?: Node } | undefined,
  }));

  const keyword = plain(fields.keyword ?? '');

  if (!keyword) {
    return (
      <div style={{ marginBottom: 24, padding: 12, border: '1px dashed var(--theme-elevation-200)', borderRadius: 4 }}>
        Set a focus keyword to see where it appears.
      </div>
    );
  }

  const body = plain(textOf(fields.content?.root));
  const words = body ? body.split(' ').length : 0;
  const occurrences = body ? body.split(keyword).length - 1 : 0;
  const density = words ? (occurrences * keyword.split(' ').length * 100) / words : 0;
  const opening = body.split(' ').slice(0, 120).join(' ');

  const checks: [string, boolean, string?][] = [
    ['In the meta title', plain(fields.metaTitle ?? fields.title ?? '').includes(keyword)],
    ['Near the start of the meta title', plain(fields.metaTitle ?? fields.title ?? '').indexOf(keyword) <= 10 && plain(fields.metaTitle ?? fields.title ?? '').includes(keyword)],
    ['In the meta description', plain(fields.metaDescription ?? '').includes(keyword)],
    ['In the URL slug', plain(decodeSafe(fields.slug ?? '')).includes(keyword)],
    ['In the page title (H1)', plain(fields.title ?? '').includes(keyword)],
    ['In the first paragraphs', opening.includes(keyword)],
    ['In a subheading', headingsOf(fields.content?.root).some((heading) => plain(heading).includes(keyword))],
    [
      'Keyword density 0.5–2.5%',
      density >= 0.5 && density <= 2.5,
      words ? `${density.toFixed(1)}% · ${occurrences}× in ${words} words` : 'No body text yet',
    ],
    ['At least 600 words', words >= 600, `${words} words`],
  ];

  const passed = checks.filter(([, ok]) => ok).length;

  return (
    <div style={{ marginBottom: 24, padding: 12, border: '1px solid var(--theme-elevation-150)', borderRadius: 4 }}>
      <strong>
        Focus keyword: {passed}/{checks.length} checks pass
      </strong>
      <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0' }}>
        {checks.map(([label, ok, detail]) => (
          <li key={label} style={{ display: 'flex', gap: 8, padding: '2px 0' }}>
            <span aria-hidden style={{ color: ok ? 'var(--theme-success-500)' : 'var(--theme-error-500)' }}>
              {ok ? '✓' : '✗'}
            </span>
            <span>
              {label}
              {detail ? <span style={{ opacity: 0.6 }}> — {detail}</span> : null}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function decodeSafe(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
