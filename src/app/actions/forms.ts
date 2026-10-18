'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { getForm, getFormDelivery, payloadClient } from '@/lib/cms/api';
import {
  isValidSubmission,
  validateSubmission,
  valuesFromFormData,
  visibleFields,
  type FormField,
  type FormState,
} from '@/lib/forms/definition';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config';
import { translate } from '@/lib/i18n/dictionary';

/** Submissions from one address allowed per window before it is throttled. */
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

/** The visitor's address, for rate limiting and the record. */
async function clientIp(): Promise<string> {
  const list = await headers();
  const forwarded = list.get('x-forwarded-for');

  return (forwarded?.split(',')[0] ?? list.get('x-real-ip') ?? '').trim();
}

/** The page the form was submitted from, recorded alongside it. */
async function source(): Promise<string> {
  const list = await headers();
  return list.get('referer') ?? '';
}

/** Said in the visitor's language, since it is the only thing they will see. */
const failure = (locale: Locale) => translate(locale, 'form.failed');

const escape = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);

/**
 * Sends one submission, for any form.
 *
 * Bound to a slug by the component that renders the form, so one action serves
 * every form on the site. The field definitions are re-read here rather than
 * taken from the request: what the browser posts decides nothing about what is
 * accepted, which is the difference between a form and an open mailbox.
 *
 * The submission is stored in Payload (Forms → Submissions) before any email
 * or webhook is attempted, so a silent SMTP failure still leaves a record.
 */
export async function submitForm(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const form = await getForm(slug, locale);

  if (!form) {
    return { status: 'error', message: failure(locale), errors: {}, values: {} };
  }

  const fields: FormField[] = form.fields;
  const values = valuesFromFormData(fields, formData);

  // The honeypot: only a bot filling every input reaches this branch. It is
  // answered as a success, because telling a bot it was caught teaches it.
  if (String(formData.get('ecc_hp') ?? '').trim()) {
    return { status: 'sent', message: '', errors: {}, values: {} };
  }

  const errors = validateSubmission(fields, values, locale);

  if (!isValidSubmission(errors)) {
    return { status: 'error', message: translate(locale, 'form.check'), errors, values };
  }

  const payload = await payloadClient();
  const delivery = await getFormDelivery(form.slug);

  if (!payload || !delivery) {
    return { status: 'error', message: translate(locale, 'form.unconnected'), errors: {}, values };
  }

  const ip = await clientIp();

  if (ip) {
    const { totalDocs } = await payload.count({
      collection: 'form-submissions',
      where: {
        and: [{ ip: { equals: ip } }, { createdAt: { greater_than: new Date(Date.now() - RATE_WINDOW_MS).toISOString() } }],
      },
    });
    if (totalDocs >= RATE_LIMIT) {
      return { status: 'error', message: translate(locale, 'form.throttled'), errors: {}, values };
    }
  }

  // Only what the visitor was actually shown: no empty answers to questions
  // that were never asked.
  const shown = visibleFields(fields, values);
  const answered = Object.fromEntries(shown.map((field) => [field.name, values[field.name]]));
  const from = await source();
  const summary =
    [answered.name, answered.full_name, answered.email, answered.phone].filter(Boolean).map(String).join(' · ') ||
    form.title;

  try {
    await payload.create({
      collection: 'form-submissions',
      overrideAccess: true,
      data: { form: Number(delivery.id), data: answered, summary: summary.slice(0, 200), locale, source: from, ip },
    });
  } catch (error) {
    console.error('[forms] Submission could not be stored', error);
    return { status: 'error', message: failure(locale), errors: {}, values };
  }

  // Notifications are best effort: the record above is what counts.
  const rows = shown
    .map((field) => {
      const value = answered[field.name];
      const text = Array.isArray(value) ? value.join(', ') : String(value ?? '');
      return `<tr><th align="left" style="padding:4px 12px 4px 0">${escape(field.label)}</th><td>${escape(text)}</td></tr>`;
    })
    .join('');

  await Promise.allSettled([
    ...(delivery.notify.length
      ? [
          payload.sendEmail({
            to: delivery.notify,
            subject: `${form.title}: ${summary}`.slice(0, 180),
            html: `<p>New submission (${locale}) from ${escape(from)}</p><table>${rows}</table>`,
            replyTo: typeof answered.email === 'string' ? answered.email : undefined,
          }),
        ]
      : []),
    ...(delivery.webhookUrl
      ? [
          fetch(delivery.webhookUrl, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ form: form.slug, locale, source: from, fields: answered, submittedAt: new Date().toISOString() }),
            signal: AbortSignal.timeout(8000),
          }),
        ]
      : []),
  ]).then((results) => {
    for (const result of results) {
      if (result.status === 'rejected') console.error('[forms] Notification failed', result.reason);
    }
  });

  // Thrown, not returned — `redirect()` works whether or not the browser ran
  // any of this.
  if (form.redirectUri) redirect(form.redirectUri);

  return { status: 'sent', message: '', errors: {}, values: {} };
}
