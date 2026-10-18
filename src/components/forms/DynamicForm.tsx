'use client';

import { useActionState, useEffect, useId, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { submitForm } from '@/app/actions/forms';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config';
import { useT } from '@/lib/i18n/useT';
import {
  availableChoices,
  initialFormState,
  valueOf,
  valuesFromFormData,
  visibleFields,
  type FormChoice,
  type FormDefinition,
  type FormField,
  type FormState,
  type FormValues,
} from '@/lib/forms/definition';

/**
 * Any form an editor built, rendered.
 *
 * The fields, their order, their choices, their widths and the conditions that
 * show them all come from WordPress; nothing here is specific to the contact
 * form. Driven by a Server Action, so it submits and reports without JavaScript
 * having to be the thing that sends it: the same `submitForm` runs whether
 * React hydrated or the browser posted the form itself. Without JavaScript a
 * conditional field is simply always shown, and the plugin still ignores the
 * answers to the ones the condition rules out.
 *
 * Inputs keep real `type` and `autocomplete` values, which is what gets a phone
 * keyboard on a phone and the browser's own saved details in the fields.
 */
export function DynamicForm({
  form,
  locale = DEFAULT_LOCALE,
  fallbackEmail = '',
  defaults,
  onSent,
}: {
  form: FormDefinition;
  /**
   * The language the form was read in.
   *
   * Sent along with the slug so the action re-reads the same definition the
   * visitor filled in — the field a condition names has to be the field that
   * is on their screen, and in Arabic that is a different set of rows.
   */
  locale?: Locale;
  /** Offered whenever sending fails, so no submission is left with nowhere to go. */
  fallbackEmail?: string;
  /**
   * Answers to start from — the programme someone was reading when they opened
   * the form, say. Only fills fields the form actually has, and the visitor can
   * change any of them.
   */
  defaults?: FormValues;
  /** Told when a submission succeeds, so a dialog can react to it. */
  onSent?: () => void;
}) {
  const t = useT();
  const send = submitForm.bind(null, form.slug, locale);
  const [state, action] = useActionState<FormState, FormData>(send, initialFormState);

  const id = useId();
  const status = useRef<HTMLDivElement>(null);

  // Conditional fields need to know what has been answered so far. The inputs
  // stay uncontrolled — React is not the thing typing in them — and the whole
  // form is read back on every change instead, which is one pass over a handful
  // of inputs and keeps the answers and the DOM from ever disagreeing.
  const [answers, setAnswers] = useState<FormValues>({ ...defaults, ...state.values });

  // React resets an uncontrolled form once its action completes. For a text
  // input that is harmless — the value comes straight back from `defaultValue`
  // — but a reset select falls back to the markup, which never carried
  // `selected`, so it lands on the placeholder and a rejected submission loses
  // the answer that decided which fields were on screen. Counting attempts and
  // keying the fields on it remounts them, and a select does honour
  // `defaultValue` on mount.
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    // Prefilled answers stay underneath: this effect also runs on mount, and
    // replacing them outright there would drop the programme a visitor opened
    // the form from before the select depending on it had a chance to read it.
    // A rejected submission's own values sit on top, because they are what the
    // visitor actually typed.
    setAnswers({ ...defaults, ...state.values });
    setAttempt((count) => count + 1);
    // `defaults` is fixed for the life of a mounted form — the dialog remounts
    // it to change them — so this tracks the submission state alone.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    if (state.status === 'sent') onSent?.();
  }, [state.status, onSent]);

  // Move focus to the outcome once it appears. A screen reader would announce
  // the live region anyway; this is for everyone else, who otherwise submits a
  // long form and is left looking at the same fields with no idea what happened.
  useEffect(() => {
    if (state.status !== 'idle') status.current?.focus();
  }, [state]);


  if (state.status === 'sent') {
    return (
      <div
        ref={status}
        tabIndex={-1}
        className="rounded-[var(--radius-brand)] border border-brand-turquoise/30 bg-brand-beige/60 p-8 sm:p-10"
      >
        <p className="text-lg font-semibold text-brand-teal">{t('form.sent')}</p>
        <p className="mt-3 text-sm leading-relaxed text-brand-ink/70">
          {form.successMessage}
        </p>
      </div>
    );
  }

  const shown = visibleFields(form.fields, answers);
  const halves = shown.filter((field) => field.width === 'half').length;

  // What each field was pre-filled with, or answered with on a rejected
  // attempt. A rejection wins: the visitor's own answer is the one to keep.
  const filled = (field: FormField) =>
    field.name in state.values
      ? valueOf(state.values, field)
      : valueOf(defaults ?? {}, field);

  const onChange = (event: React.FormEvent<HTMLFormElement>) => {
    setAnswers(valuesFromFormData(form.fields, new FormData(event.currentTarget)));
  };

  return (
    <form action={action} onChange={onChange} noValidate className="space-y-5">
      {form.intro ? (
        <p className="text-sm leading-relaxed text-brand-ink/70">{form.intro}</p>
      ) : null}

      {state.status === 'error' && state.message ? (
        <div
          ref={status}
          tabIndex={-1}
          role="alert"
          className="rounded-[calc(var(--radius-brand)/2)] border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {state.message}{' '}
          {fallbackEmail ? (
            <a href={`mailto:${fallbackEmail}`} className="underline">
              {fallbackEmail}
            </a>
          ) : null}
        </div>
      ) : null}

      {/*
        One grid for the whole form: a half-width field takes one column, a
        full-width one spans both. Laying it out row by row would leave a gap
        wherever an editor put an odd number of half fields together.
      */}
      <div key={attempt} className={halves ? 'grid gap-5 sm:grid-cols-2' : 'space-y-5'}>
        {shown.map((field) => (
          <Field
            // A dependent select is keyed on the answer it depends on, so
            // changing the institution above it remounts it empty rather than
            // leaving a programme that institution does not award selected.
            key={
              field.filterBy
                ? `${field.name}:${String(answers[field.filterBy] ?? '')}`
                : field.name
            }
            field={field}
            idPrefix={id}
            value={filled(field)}
            choices={availableChoices(field, answers)}
            parentAnswered={
              Boolean(field.filterBy) &&
              String(answers[field.filterBy ?? ''] ?? '') !== ''
            }
            error={state.errors[field.name]}
            spans={halves > 0}
          />
        ))}
      </div>

      {/*
        The honeypot. Off-screen rather than `display: none`, because some bots
        skip hidden fields; `aria-hidden` and `tabIndex` keep it away from
        anyone using the form for real, and `autoComplete="off"` stops a browser
        filling it in on their behalf.
      */}
      <div aria-hidden className="absolute start-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-hp`}>Company</label>
        <input type="text" id={`${id}-hp`} name="ecc_hp" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
        <Submit label={form.submitLabel} />
        {form.consent ? (
          <p className="text-xs text-brand-ink/50">{form.consent}</p>
        ) : null}
      </div>
    </form>
  );
}

const CONTROL =
  'mt-2 w-full rounded-[calc(var(--radius-brand)/2)] border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition-colors placeholder:text-brand-ink/35 focus:border-brand-turquoise focus:ring-2 focus:ring-brand-turquoise/20';

/**
 * The browser's own saved details, where the field name says what it holds.
 *
 * Guessing beyond these would be worse than not guessing: autofilling a
 * "Company" field with someone's name is a bug they have to notice.
 */
const AUTOCOMPLETE: Record<string, string> = {
  name: 'name',
  full_name: 'name',
  first_name: 'given-name',
  last_name: 'family-name',
  email: 'email',
  phone: 'tel',
  tel: 'tel',
  mobile: 'tel',
  company: 'organization',
  organisation: 'organization',
  organization: 'organization',
  country: 'country-name',
  city: 'address-level2',
};

function Field({
  field,
  idPrefix,
  value,
  choices,
  parentAnswered,
  error,
  spans,
}: {
  field: FormField;
  idPrefix: string;
  value: string | string[];
  /** What this field is offering — already narrowed by any parent answer. */
  choices: FormChoice[];
  /** Whether the field this one depends on has been answered. */
  parentAnswered: boolean;
  error?: string;
  spans: boolean;
}) {
  const t = useT();
  const id = `${idPrefix}-${field.name}`;
  const errorId = `${id}-error`;
  const single = Array.isArray(value) ? '' : value;

  // A field that depends on another and has nothing to offer: either the one
  // above has not been answered yet, or it has and nothing belongs to that
  // answer. Both leave an empty select, and they need different wording —
  // "choose an option above first" is confusing advice to give someone who
  // just did.
  const waiting = Boolean(field.filterBy) && choices.length === 0;
  const answeredParent = Boolean(field.filterBy) && Boolean(parentAnswered);

  const shared = {
    id,
    name: field.name,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
    className: `${CONTROL} ${error ? 'border-red-400' : 'border-brand-sand'}`,
  };

  // A group of tick boxes or radios is a fieldset, not a labelled control:
  // each input carries its own label and the question sits in the legend.
  const grouped = field.type === 'radio' || field.type === 'checkboxes';

  return (
    <div
      className={spans && field.width === 'full' ? 'sm:col-span-2' : undefined}
      // A fieldset cannot be a grid item in some engines without this.
      role={grouped ? 'group' : undefined}
      aria-labelledby={grouped ? `${id}-legend` : undefined}
    >
      {field.type === 'checkbox' ? null : (
        <Label htmlFor={grouped ? undefined : id} id={grouped ? `${id}-legend` : undefined}>
          {field.label} {field.required ? <Required /> : null}
        </Label>
      )}

      {field.type === 'textarea' ? (
        <textarea
          rows={6}
          required={field.required}
          placeholder={field.placeholder}
          defaultValue={single}
          {...shared}
        />
      ) : field.type === 'select' ? (
        <select
          required={field.required}
          defaultValue={single}
          // A dependent select with nothing to offer yet is disabled rather
          // than empty: an enabled select you cannot choose from reads as
          // broken, and the placeholder below says what to do instead.
          disabled={waiting}
          {...shared}
        >
          <option value="">
            {!waiting
              ? field.placeholder || t('form.choose')
              : answeredParent
                ? t('form.choose.empty')
                : t('form.choose.parent')}
          </option>
          {choices.map((choice, index) => (
            <option key={`${index}-${choice.value}`} value={choice.value}>
              {choice.value}
            </option>
          ))}
        </select>
      ) : field.type === 'checkbox' ? (
        <label htmlFor={id} className="flex items-start gap-3 text-sm text-brand-ink/80">
          <input
            type="checkbox"
            value="yes"
            required={field.required}
            defaultChecked={single === 'yes'}
            id={id}
            name={field.name}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className="mt-0.5 h-4 w-4 shrink-0 accent-brand-teal"
          />
          <span>
            {field.label} {field.required ? <Required /> : null}
          </span>
        </label>
      ) : grouped ? (
        <div className="mt-3 space-y-2">
          {choices.map((choice, index) => (
            <label
              key={`${index}-${choice.value}`}
              className="flex items-start gap-3 text-sm text-brand-ink/80"
            >
              <input
                type={field.type === 'radio' ? 'radio' : 'checkbox'}
                name={field.name}
                value={choice.value}
                defaultChecked={
                  Array.isArray(value)
                    ? value.includes(choice.value)
                    : value === choice.value
                }
                aria-describedby={error ? errorId : undefined}
                className="mt-0.5 h-4 w-4 shrink-0 accent-brand-teal"
              />
              <span>{choice.value}</span>
            </label>
          ))}
        </div>
      ) : (
        <input
          type={field.type}
          required={field.required}
          placeholder={field.placeholder}
          defaultValue={single}
          autoComplete={AUTOCOMPLETE[field.name]}
          {...shared}
        />
      )}

      {error ? (
        <p id={errorId} className="mt-1.5 text-xs text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Label({
  htmlFor,
  id,
  children,
}: {
  htmlFor?: string;
  id?: string;
  children: React.ReactNode;
}) {
  const className = 'text-xs uppercase tracking-[0.16em] text-brand-turquoise';

  return htmlFor ? (
    <label htmlFor={htmlFor} className={className}>
      {children}
    </label>
  ) : (
    <span id={id} className={`block ${className}`}>
      {children}
    </span>
  );
}

function Required() {
  const t = useT();

  return (
    <span className="text-brand-gold" title={t('form.required')}>
      *
    </span>
  );
}

/**
 * Separate so `useFormStatus` reads the pending state of the form above it —
 * the hook only reports for a form the component is a child of.
 */
function Submit({ label }: { label: string }) {
  const t = useT();
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-teal px-7 py-3 text-sm font-medium text-brand-beige transition-colors hover:bg-brand-turquoise disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? t('form.sending') : label}
    </button>
  );
}
