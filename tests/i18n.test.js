import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { DICT, translate, pickField } from '../src/lib/translations.js';

test('every dictionary entry has English and Arabic text', () => {
  for (const [k, v] of Object.entries(DICT)) {
    assert.equal(v.length, 2, k);
    assert.ok(v[0].trim() && v[1].trim(), `${k} is empty`);
  }
});

test('placeholders match between languages', () => {
  const ph = (s) => (s.match(/\{\w+\}/g) || []).sort().join();
  for (const [k, v] of Object.entries(DICT)) assert.equal(ph(v[0]), ph(v[1]), k);
});

test('no "June" left in any text', () => {
  for (const [k, v] of Object.entries(DICT)) assert.ok(!/june/i.test(v[0]) && !v[1].includes('يونيو') && !v[1].includes('حزيران'), k);
});

function walk(d) {
  return fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
}

test('every t("key") used in the source exists in the dictionary', () => {
  const missing = new Set();
  for (const f of walk('src').filter((f) => /\.jsx?$/.test(f) && !f.includes('admin') && !f.endsWith('i18n.jsx'))) {
    const src = fs.readFileSync(f, 'utf8');
    for (const m of src.matchAll(/\bt\(\s*'([^']+)'/g)) if (!DICT[m[1]]) missing.add(`${f}: ${m[1]}`);
    for (const m of src.matchAll(/\bt\(\s*`([^`$]+)\$\{/g)) {
      if (!Object.keys(DICT).some((k) => k.startsWith(m[1]))) missing.add(`${f}: ${m[1]}*`);
    }
  }
  assert.deepEqual([...missing], []);
});

test('translate + pickField', () => {
  assert.equal(translate('ar', 'nf.title'), 'الصفحة غير موجودة');
  assert.equal(translate('en', 'dp.until', { date: 'X' }), 'until X');
  assert.equal(pickField({ a: 'E', a_ar: 'ع' }, 'a', 'ar'), 'ع');
  assert.equal(pickField({ a: 'E', a_ar: '  ' }, 'a', 'ar'), 'E');
  assert.equal(pickField({ a: 'E', a_ar: 'ع' }, 'a', 'en'), 'E');
});
