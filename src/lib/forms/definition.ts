/**
 * Form definitions and validation.
 *
 * A form is authored under Forms in the admin — its fields, its labels, its
 * choices — and arrives here as data. Everything in this module is pure, so
 * the browser and the Server Action share one rule set and the rules can be
 * tested without a DOM or a database.
 *
 * The browser is not the last line of defence: `submitForm`
 * (`src/app/actions/forms.ts`) re-reads the form's definition from the CMS and
 * runs the same rules again before storing anything. In the browser, this is
 * what decides which message appears under which field.
 */

/**
 * The field types a form may use.
 *
 * A contract with the admin: the field-type select in
 * `src/payload/collections/Forms.ts` is built from this list, and
 * `DynamicForm` renders exactly these.
 */
import { DEFAULT_LOCALE, type Locale } from '../i18n/config.ts';
import { format, translate } from '../i18n/dictionary.ts';

export const FIELD_TYPES = [
  'text',
  'email',
  'tel',
  'number',
  'url',
  'date',
  'textarea',
  'select',
  'radio',
  'checkbox',
  'checkboxes',
] as const;

export type FormFieldType = (typeof FIELD_TYPES)[number];

/** How a field's visibility condition compares. */
export const CONDITION_OPERATORS = ['is', 'is not', 'is filled', 'is empty'] as const;

export type ConditionOperator = (typeof CONDITION_OPERATORS)[number];

/**
 * One option on a select, radio group or checkbox group.
 *
 * Choices reach the browser already resolved: where they came from — a list an
 * editor typed, or the partners and programmes read out of the CMS — is
 * `getForm`'s business (`src/lib/cms/api.ts`) and does not travel.
 *
 * `group` is what makes a dependent select possible: a programme's group is
 * the institution that awards it, so a programme select can show only the
 * programmes belonging to whichever institution was picked above it. An
 * option an editor typed by hand has no group and is always available.
 */
export type FormChoice = {
  value: string;
  group: string;
};

/** A rule deciding whether a field is shown. */
export type FieldCondition = {
  /** Name of the field this one depends on. */
  field: string;
  operator: ConditionOperator;
  value: string;
};

export type FormField = {
  label: string;
  /** The value is submitted, stored and merged under this name. */
  name: string;
  type: FormFieldType;
  required: boolean;
  /** Choices, for select, radio and checkboxes. */
  choices: FormChoice[];
  placeholder: string;
  /** How much of the row the field takes on a wide screen. */
  width: 'full' | 'half';
  /** When set, the field is shown only while this holds. */
  condition?: FieldCondition | null;
  /**
   * Name of the field whose answer narrows this one's choices, matched
   * against each choice's `group`. Derived when a form is read, not typed.
   */
  filterBy?: string | null;
};

export type FormDefinition = {
  slug: string;
  title: string;
  /** Optional copy above the fields. */
  intro: string;
  fields: FormField[];
  submitLabel: string;
  /** Small print beside the button. */
  consent: string;
  /** Shown in place of the form once sent — unless a redirect is set. */
  successMessage: string;
  /**
   * Where to send the visitor instead of showing the message: a site-relative
   * path for a page on this site, or an absolute URL. Empty means stay put.
   */
  redirectUri: string;
};

/** A submitted value. Only `checkboxes` produces a list. */
export type FormValue = string | string[];

export type FormValues = Record<string, FormValue>;

/** A message per invalid field, keyed by field name. */
export type FormErrors = Record<string, string>;

/** What the form renders from. */
export type FormState = {
  status: 'idle' | 'sent' | 'error';
  /** Shown above the form. Empty while idle. */
  message: string;
  errors: FormErrors;
  /**
   * Echoed back with a rejection so the form keeps what the visitor typed —
   * losing a long message to a mistyped email address is the fastest way to
   * lose the enquiry as well.
   */
  values: FormValues;
};

export const initialFormState: FormState = {
  status: 'idle',
  message: '',
  errors: {},
  values: {},
};

/**
 * Slug of the site-wide enquiry form.
 *
 * The one name shared between the seeded forms, which define a form under it
 * (`forms` in `src/lib/content/site.ts`, loaded by `npm run seed`), and the
 * layout, which opens that form from every trigger on the site. Renaming the
 * form under Forms in the admin is safe; changing its slug is what would
 * detach it.
 */
export const LEAD_FORM_SLUG = 'lead';

/** Longest single value accepted, in the browser and in `submitForm` alike. */
export const VALUE_MAX = 5000;

/**
 * Deliberately loose: `x@y` is a deliverable address on an intranet, and every
 * stricter pattern eventually rejects a real address someone is trying to use.
 * Deliverability is proved by the reply arriving, not by a regular expression.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Digits, spaces and the punctuation international numbers are written with. */
const PHONE = /^[+(]?[0-9][0-9\s()./-]{5,24}$/;

/** Whether this field holds a list rather than a single value. */
export function isMultiple(field: FormField): boolean {
  return field.type === 'checkboxes';
}

/** The empty value for a field — a list field starts as a list. */
export function emptyValue(field: FormField): FormValue {
  return isMultiple(field) ? [] : '';
}

/** Reads one field's value out of a submitted state, whatever shape it is in. */
export function valueOf(values: FormValues, field: FormField): FormValue {
  const value = values[field.name];

  if (isMultiple(field)) {
    return Array.isArray(value) ? value : value ? [value] : [];
  }

  return Array.isArray(value) ? value.join(', ') : (value ?? '');
}

/**
 * Whether one condition holds against a set of answers.
 *
 * A group of tick boxes holds a list, so "is" means "is one of" there —
 * otherwise a condition on a multiple-choice question could only ever fire
 * when exactly one box was ticked.
 */
export function conditionMet(
  condition: FieldCondition | null | undefined,
  values: FormValues,
): boolean {
  if (!condition) return true;

  const answer = values[condition.field] ?? '';
  const chosen = Array.isArray(answer)
    ? answer
    : answer.split(',').map((entry) => entry.trim());
  const filled = chosen.some((entry) => entry !== '');

  switch (condition.operator) {
    case 'is filled':
      return filled;
    case 'is empty':
      return !filled;
    case 'is not':
      return !chosen.includes(condition.value);
    default:
      return chosen.includes(condition.value);
  }
}

/**
 * The fields actually in play for a given set of answers.
 *
 * A field whose condition is not met is not shown, not required and not
 * submitted. The same rule runs again in `submitForm`: deciding it only in the
 * browser would mean a hidden required field blocking every submission that
 * legitimately skipped it.
 */
export function visibleFields(
  fields: FormField[],
  values: FormValues,
): FormField[] {
  return fields.filter((field) => conditionMet(field.condition, values));
}

/** Every value a field offers, before any narrowing. */
export function choiceValues(field: FormField): string[] {
  return field.choices.map((choice) => choice.value);
}

/**
 * The choices a field is offering right now.
 *
 * A field with no `filterBy` offers all of them. A filtered one offers the
 * choices whose group matches the answer above it — plus any choice with no
 * group at all, which belongs to no institution and so cannot be excluded by
 * one. Without that, a programme nobody has linked to a partner would be
 * unreachable rather than merely ungrouped.
 *
 * Used to render the select and to validate what comes back, so the two can
 * never disagree about what was on offer.
 */
export function availableChoices(
  field: FormField,
  values: FormValues,
): FormChoice[] {
  if (!field.filterBy) return field.choices;

  const parent = values[field.filterBy];
  const chosen = Array.isArray(parent) ? (parent[0] ?? '') : (parent ?? '');

  return field.choices.filter(
    (choice) => choice.group === '' || choice.group === chosen,
  );
}

/**
 * Trims every value, so " " never counts as an answer, and drops anything the
 * form did not ask for — a hand-crafted POST does not get to invent fields.
 */
export function normaliseValues(
  fields: FormField[],
  values: FormValues,
): FormValues {
  const clean: FormValues = {};

  for (const field of fields) {
    const value = valueOf(values, field);

    clean[field.name] = Array.isArray(value)
      ? value.map((entry) => entry.trim()).filter(Boolean)
      : value.trim();
  }

  return clean;
}

/** Pulls the submitted values out of a posted form. */
export function valuesFromFormData(
  fields: FormField[],
  formData: FormData,
): FormValues {
  const values: FormValues = {};

  for (const field of fields) {
    values[field.name] = isMultiple(field)
      ? formData.getAll(field.name).map((entry) => String(entry))
      : String(formData.get(field.name) ?? '');
  }

  return normaliseValues(fields, values);
}

/**
 * Validates one submission.
 *
 * An empty object means it is good. Every visible field is checked, so a
 * visitor sees everything that needs fixing at once rather than one error per
 * attempt — and nothing they were never shown.
 */
export function validateSubmission(
  fields: FormField[],
  values: FormValues,
  locale: Locale = DEFAULT_LOCALE,
): FormErrors {
  const clean = normaliseValues(fields, values);
  const errors: FormErrors = {};

  for (const field of visibleFields(fields, clean)) {
    const value = clean[field.name];
    const filled = Array.isArray(value) ? value.length > 0 : value !== '';

    if (!filled) {
      if (field.required) {
        errors[field.name] = format(
          translate(
            locale,
            field.type === 'checkbox' ? 'form.error.tick' : 'form.error.required',
          ),
          { field: field.label },
        );
      }
      continue;
    }

    const error = checkValue(field, value, availableChoices(field, clean), locale);

    if (error) errors[field.name] = error;
  }

  return errors;
}

/**
 * The type-specific rules, applied only to fields that have a value.
 *
 * `offered` is what the field was showing when it was answered, which for a
 * dependent select is narrower than everything it knows about — picking an
 * institution and then a programme that institution does not award has to be
 * rejected, not stored.
 */
function checkValue(
  field: FormField,
  value: FormValue,
  offered: FormChoice[],
  locale: Locale,
): string {
  const allowed = offered.map((choice) => choice.value);

  if (Array.isArray(value)) {
    return allowed.length && value.some((entry) => !allowed.includes(entry))
      ? translate(locale, 'form.error.listed')
      : '';
  }

  if (value.length > VALUE_MAX) {
    return format(translate(locale, 'form.error.long'), {
      field: field.label.toLowerCase(),
      max: VALUE_MAX.toLocaleString(locale),
    });
  }

  switch (field.type) {
    case 'email':
      return EMAIL.test(value) ? '' : translate(locale, 'form.error.email');

    case 'tel':
      return PHONE.test(value) ? '' : translate(locale, 'form.error.tel');

    case 'number':
      return Number.isFinite(Number(value))
        ? ''
        : translate(locale, 'form.error.number');

    case 'url':
      return /^https?:\/\/[^\s]+\.[^\s]+$/.test(value)
        ? ''
        : translate(locale, 'form.error.url');

    case 'select':
    case 'radio':
      if (!field.choices.length || allowed.includes(value)) return '';

      // Naming the field it depends on is the difference between "that is not
      // allowed" and knowing to change the institution above it.
      return translate(
        locale,
        field.filterBy ? 'form.error.filtered' : 'form.error.choice',
      );

    default:
      return '';
  }
}

/** Whether `validateSubmission` found nothing to complain about. */
export function isValidSubmission(errors: FormErrors): boolean {
  return Object.keys(errors).length === 0;
}
