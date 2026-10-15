import test from 'node:test';
import assert from 'node:assert/strict';
import { getRegistrationState, getFeeTable, formatDate, formatMoney } from '../src/lib/fees.js';

const S = {
  fee_early: '10',
  fee_regular: '12',
  fee_late: '15',
  registration_enabled: 'true',
  registration_opens: '2026-11-01',
  early_bird_ends: '2026-12-31',
  regular_ends: '2027-03-31',
  registration_closes: '2027-05-01',
};
const at = (iso) => new Date(iso);

test('before opening date -> not_open', () => {
  assert.equal(getRegistrationState(S, at('2026-10-31T20:59:59Z')).state, 'not_open');
});

test('opening day 00:00 Damascus time is open (early bird)', () => {
  // 2026-11-01T00:00:00+03:00 == 2026-10-31T21:00:00Z
  const r = getRegistrationState(S, at('2026-10-31T21:00:00Z'));
  assert.deepEqual([r.state, r.phase, r.amount], ['open', 'early', 10]);
});

test('early bird includes the whole last day (Damascus time)', () => {
  // 2026-12-31T23:59:00+03:00 == 20:59Z
  assert.equal(getRegistrationState(S, at('2026-12-31T20:59:00Z')).phase, 'early');
  // 2027-01-01T00:00:00+03:00 == 2026-12-31T21:00Z
  assert.equal(getRegistrationState(S, at('2026-12-31T21:00:00Z')).phase, 'regular');
});

test('regular then late then closed', () => {
  assert.equal(getRegistrationState(S, at('2027-02-01T12:00:00Z')).amount, 12);
  const late = getRegistrationState(S, at('2027-04-15T12:00:00Z'));
  assert.deepEqual([late.phase, late.amount], ['late', 15]);
  assert.equal(getRegistrationState(S, at('2027-05-01T21:00:00Z')).state, 'closed');
});

test('registration_enabled=false forces not_open', () => {
  assert.equal(getRegistrationState({ ...S, registration_enabled: 'false' }, at('2027-02-01T12:00:00Z')).state, 'not_open');
});

test('no dates configured -> open with flat regular fee', () => {
  const r = getRegistrationState({ fee_early: '10', fee_regular: '12', fee_late: '15' }, at('2027-02-01T12:00:00Z'));
  assert.deepEqual([r.state, r.phase, r.amount], ['open', 'regular', 12]);
});

test('invalid dates are ignored, bad fees fall back to defaults', () => {
  const r = getRegistrationState({ registration_opens: 'garbage', fee_regular: 'abc' }, at('2027-02-01T12:00:00Z'));
  assert.deepEqual([r.state, r.amount], ['open', 12]);
});

test('fee table + formatting', () => {
  assert.deepEqual(getFeeTable(S).map((r) => r.amount), [10, 12, 15]);
  assert.equal(formatDate('2027-03-01'), '1 March 2027');
  assert.equal(formatDate(''), '');
  assert.equal(formatMoney(12), '$12');
  assert.equal(formatMoney(12.5), '$12.50');
});
