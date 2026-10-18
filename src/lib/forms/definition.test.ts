import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  availableChoices,
  choiceValues,
  conditionMet,
  isValidSubmission,
  normaliseValues,
  validateSubmission,
  valuesFromFormData,
  visibleFields,
  type FormChoice,
  type FormField,
} from './definition.ts';

/** Choices the way an editor typing a list into the Choices box gets them. */
const listed = (...values: string[]): FormChoice[] =>
  values.map((value) => ({ value, group: '' }));

const field = (overrides: Partial<FormField>): FormField => ({
  label: 'Field',
  name: 'field',
  type: 'text',
  required: false,
  choices: [],
  placeholder: '',
  width: 'full',
  ...overrides,
});

const contact: FormField[] = [
  field({ label: 'Full name', name: 'name', required: true }),
  field({ label: 'Email', name: 'email', type: 'email', required: true }),
  field({ label: 'Phone', name: 'phone', type: 'tel' }),
  field({
    label: 'Subject',
    name: 'subject',
    type: 'select',
    choices: listed('Programme enquiry', 'Partnership'),
  }),
  field({ label: 'Message', name: 'message', type: 'textarea', required: true }),
];

const good = {
  name: 'Layla Hassan',
  email: 'layla@example.com',
  phone: '+971 55 893 1013',
  subject: 'Programme enquiry',
  message: 'Which intake is next for the DBA?',
};

test('a complete submission passes', () => {
  assert.deepEqual(validateSubmission(contact, good), {});
  assert.equal(isValidSubmission(validateSubmission(contact, good)), true);
});

test('optional fields may be left empty', () => {
  assert.deepEqual(validateSubmission(contact, { ...good, phone: '', subject: '' }), {});
});

test('every required field is reported at once, not one at a time', () => {
  assert.deepEqual(Object.keys(validateSubmission(contact, {})).sort(), [
    'email',
    'message',
    'name',
  ]);
});

test('a required message names the field it is about', () => {
  assert.equal(validateSubmission(contact, {}).name, 'Full name is required.');
});

test('whitespace is not an answer', () => {
  const errors = validateSubmission(contact, { ...good, name: '   ' });

  assert.equal(errors.name, 'Full name is required.');
});

test('an address without a domain is rejected', () => {
  assert.ok(validateSubmission(contact, { ...good, email: 'layla@example' }).email);
  assert.ok(validateSubmission(contact, { ...good, email: 'layla example.com' }).email);
});

test('unusual but real addresses are accepted', () => {
  for (const email of ['layla+dba@example.co.uk', "o'neill@example.com", 'l@x.io']) {
    assert.deepEqual(validateSubmission(contact, { ...good, email }), {}, email);
  }
});

test('a phone number written any of the usual ways is accepted', () => {
  for (const phone of [
    '+971 55 893 1013',
    '0020 100 123 4567',
    '(020) 7123-4567',
    '+41 44 123 45 67',
  ]) {
    assert.deepEqual(validateSubmission(contact, { ...good, phone }), {}, phone);
  }
});

test('a phone number of letters is rejected', () => {
  assert.ok(validateSubmission(contact, { ...good, phone: 'call me' }).phone);
});

test('a choice that is not on the menu is rejected', () => {
  assert.equal(
    validateSubmission(contact, { ...good, subject: 'Something I invented' }).subject,
    'Please choose one of the options.',
  );
});

test('an over-long value is rejected', () => {
  assert.ok(
    validateSubmission(contact, { ...good, message: 'a'.repeat(5001) }).message?.includes(
      '5,000',
    ),
  );
});

test('a number field wants a number', () => {
  const fields = [field({ name: 'age', type: 'number', label: 'Age' })];

  assert.deepEqual(validateSubmission(fields, { age: '42' }), {});
  assert.equal(validateSubmission(fields, { age: 'forty' }).age, 'Please enter a number.');
});

test('a URL field wants a full address', () => {
  const fields = [field({ name: 'site', type: 'url', label: 'Website' })];

  assert.deepEqual(validateSubmission(fields, { site: 'https://ecc-group.ae' }), {});
  assert.ok(validateSubmission(fields, { site: 'ecc-group.ae' }).site);
});

test('a required tick box asks to be ticked', () => {
  const fields = [
    field({ name: 'consent', type: 'checkbox', label: 'I agree', required: true }),
  ];

  assert.equal(validateSubmission(fields, {}).consent, 'Please tick "I agree".');
  assert.deepEqual(validateSubmission(fields, { consent: 'yes' }), {});
});

test('a checkbox group accepts several answers, but only listed ones', () => {
  const fields = [
    field({
      name: 'interests',
      type: 'checkboxes',
      label: 'Interests',
      choices: listed('MBA', 'DBA', 'BBA'),
    }),
  ];

  assert.deepEqual(validateSubmission(fields, { interests: ['MBA', 'DBA'] }), {});
  assert.equal(
    validateSubmission(fields, { interests: ['MBA', 'Astronomy'] }).interests,
    'Please choose from the options listed.',
  );
});

test('a required checkbox group must have at least one answer', () => {
  const fields = [
    field({
      name: 'interests',
      type: 'checkboxes',
      label: 'Interests',
      choices: listed('MBA'),
      required: true,
    }),
  ];

  assert.ok(validateSubmission(fields, { interests: [] }).interests);
});

test('values the form never asked for are dropped', () => {
  const clean = normaliseValues(contact, {
    ...good,
    is_admin: 'true',
  } as Record<string, string>);

  assert.equal('is_admin' in clean, false);
  assert.equal(Object.keys(clean).length, contact.length);
});

test('a missing field normalises to empty rather than undefined', () => {
  assert.deepEqual(normaliseValues([field({ name: 'a' }), field({ name: 'b' })], {}), {
    a: '',
    b: '',
  });
});

test('reading a posted form keeps lists as lists and text as text', () => {
  const fields = [
    field({ name: 'name' }),
    field({ name: 'interests', type: 'checkboxes', choices: listed('MBA', 'DBA') }),
  ];

  const data = new FormData();
  data.set('name', '  Layla  ');
  data.append('interests', 'MBA');
  data.append('interests', 'DBA');
  data.set('uninvited', 'x');

  assert.deepEqual(valuesFromFormData(fields, data), {
    name: 'Layla',
    interests: ['MBA', 'DBA'],
  });
});

/* -------------------------------------------------------------------------- */
/* Conditional fields                                                         */
/* -------------------------------------------------------------------------- */

const conditional: FormField[] = [
  field({
    label: 'Enquiry type',
    name: 'kind',
    type: 'select',
    required: true,
    choices: listed('Programme', 'Partnership'),
  }),
  field({
    label: 'Organisation',
    name: 'organisation',
    required: true,
    condition: { field: 'kind', operator: 'is', value: 'Partnership' },
  }),
  field({
    label: 'Programme',
    name: 'programme',
    condition: { field: 'kind', operator: 'is not', value: 'Partnership' },
  }),
];

test('a field appears only when its condition holds', () => {
  assert.deepEqual(
    visibleFields(conditional, { kind: 'Partnership' }).map((f) => f.name),
    ['kind', 'organisation'],
  );
  assert.deepEqual(
    visibleFields(conditional, { kind: 'Programme' }).map((f) => f.name),
    ['kind', 'programme'],
  );
});

test('a hidden field is never required', () => {
  // Partnership shows the required Organisation field, so it is demanded…
  assert.ok(validateSubmission(conditional, { kind: 'Partnership' }).organisation);

  // …and Programme hides it, so the same empty value is fine.
  assert.deepEqual(validateSubmission(conditional, { kind: 'Programme' }), {});
});

test('an answer to a hidden field is not validated', () => {
  const fields = [
    field({ name: 'kind', type: 'select', choices: listed('a', 'b') }),
    field({
      name: 'website',
      type: 'url',
      condition: { field: 'kind', operator: 'is', value: 'a' },
    }),
  ];

  // Nonsense in a field the visitor never saw does not block the submission.
  assert.deepEqual(validateSubmission(fields, { kind: 'b', website: 'nonsense' }), {});
  assert.ok(validateSubmission(fields, { kind: 'a', website: 'nonsense' }).website);
});

test('"is filled" and "is empty" ask only whether there is an answer', () => {
  assert.equal(conditionMet({ field: 'a', operator: 'is filled', value: '' }, { a: 'x' }), true);
  assert.equal(conditionMet({ field: 'a', operator: 'is filled', value: '' }, { a: '  ' }), false);
  assert.equal(conditionMet({ field: 'a', operator: 'is empty', value: '' }, {}), true);
  assert.equal(conditionMet({ field: 'a', operator: 'is empty', value: '' }, { a: 'x' }), false);
});

test('on a group of tick boxes, "is" means "is one of"', () => {
  const values = { interests: ['MBA', 'DBA'] };

  assert.equal(conditionMet({ field: 'interests', operator: 'is', value: 'DBA' }, values), true);
  assert.equal(conditionMet({ field: 'interests', operator: 'is', value: 'BBA' }, values), false);
  assert.equal(conditionMet({ field: 'interests', operator: 'is not', value: 'BBA' }, values), true);
});

test('a condition naming a field that does not exist hides the field', () => {
  assert.equal(conditionMet({ field: 'ghost', operator: 'is', value: 'x' }, {}), false);
  assert.equal(conditionMet({ field: 'ghost', operator: 'is not', value: 'x' }, {}), true);
});

test('no condition means always shown', () => {
  assert.equal(conditionMet(null, {}), true);
  assert.equal(conditionMet(undefined, {}), true);
});

/* -------------------------------------------------------------------------- */
/* Dependent choices                                                          */
/* -------------------------------------------------------------------------- */

/** An institution select, and a programme select narrowed by it. */
const cascade: FormField[] = [
  field({
    label: 'Institution',
    name: 'institution',
    type: 'select',
    choices: listed('IBAS', 'VERN'),
  }),
  field({
    label: 'Programme',
    name: 'programme',
    type: 'select',
    filterBy: 'institution',
    choices: [
      { value: 'MBA', group: 'IBAS' },
      { value: 'DBA', group: 'IBAS' },
      { value: 'Design Thinking', group: 'VERN' },
      { value: 'Short course', group: '' },
    ],
  }),
];

const programme = cascade[1];

test('a field with no filter offers everything it has', () => {
  assert.deepEqual(
    availableChoices(cascade[0], { institution: 'IBAS' }).map((c) => c.value),
    ['IBAS', 'VERN'],
  );
});

test('a dependent field offers only its parent’s group', () => {
  assert.deepEqual(
    availableChoices(programme, { institution: 'IBAS' }).map((c) => c.value),
    ['MBA', 'DBA', 'Short course'],
  );
  assert.deepEqual(
    availableChoices(programme, { institution: 'VERN' }).map((c) => c.value),
    ['Design Thinking', 'Short course'],
  );
});

test('an ungrouped choice belongs to no group, so no group excludes it', () => {
  // With nothing chosen above, only the choices that never depended on it.
  assert.deepEqual(
    availableChoices(programme, {}).map((c) => c.value),
    ['Short course'],
  );
});

test('a programme the chosen institution does not award is rejected', () => {
  const errors = validateSubmission(cascade, {
    institution: 'VERN',
    programme: 'MBA',
  });

  assert.equal(
    errors.programme,
    'That is not offered by the institution selected above.',
  );
});

test('the same programme is accepted under the institution that awards it', () => {
  assert.ok(
    isValidSubmission(
      validateSubmission(cascade, { institution: 'IBAS', programme: 'MBA' }),
    ),
  );
});

test('choiceValues is every value a field knows, not just the offered ones', () => {
  assert.deepEqual(choiceValues(programme), [
    'MBA',
    'DBA',
    'Design Thinking',
    'Short course',
  ]);
});
