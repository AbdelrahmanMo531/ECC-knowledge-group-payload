import assert from 'node:assert/strict';
import { test } from 'node:test';

import { isFeatured, paymentAccent } from './fees.ts';

test('a discount is pulled out of the sentence around it', () => {
  assert.deepEqual(
    paymentAccent(
      'Pay tuition in full at enrollment and receive a 5% early-settlement discount.',
    ),
    { kind: 'discount', label: '5%' },
  );
});

test('a fractional discount survives', () => {
  assert.deepEqual(paymentAccent('A 2.5% discount applies.'), {
    kind: 'discount',
    label: '2.5%',
  });
});

test('a percentage that is not called a discount is left alone', () => {
  assert.equal(paymentAccent('Interest is charged at 5% a year.'), null);
  assert.equal(paymentAccent('98% of students complete the programme.'), null);
});

test('a list of installment plans becomes a set of options', () => {
  assert.deepEqual(
    paymentAccent(
      'Spread tuition across 3, 6, or 12 monthly installments with zero interest.',
    ),
    { kind: 'installments', options: ['3', '6', '12'] },
  );
});

test('British and American spellings both read', () => {
  assert.deepEqual(paymentAccent('Across 4 or 8 instalments.'), {
    kind: 'installments',
    options: ['4', '8'],
  });
});

test('one plan is a sentence, not a row of choices', () => {
  assert.equal(paymentAccent('Paid in 12 monthly installments.'), null);
});

test('a number elsewhere in the copy is not mistaken for a plan', () => {
  assert.equal(
    paymentAccent('Bank transfer, credit card, or approved financing partners.'),
    null,
  );
  assert.equal(
    paymentAccent('Requests submitted within 14 days qualify for a refund.'),
    null,
  );
});

test('copy the reader has not seen before simply gets no badge', () => {
  assert.equal(paymentAccent('Talk to us about a schedule that suits you.'), null);
  assert.equal(paymentAccent(''), null);
});

test('the option with a discount is the one to lead with', () => {
  assert.equal(isFeatured({ kind: 'discount', label: '5%' }), true);
  assert.equal(isFeatured({ kind: 'installments', options: ['3', '6'] }), false);
  assert.equal(isFeatured(null), false);
});
