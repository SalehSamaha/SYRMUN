import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { AR } from '../src/admin/adminDict.js';
import { CONTENT, SETTINGS_GROUPS, STATUS_LABEL, AGE_LABEL, EXP_LABEL, APPLICATIONS } from '../src/admin/config.js';

const need = new Set();
const add = (s) => s && need.add(s);

test('every admin text from config.js has an Arabic translation', () => {
  Object.values(CONTENT).forEach((c) => {
    add(c.title); add(c.singular);
    c.fields.forEach((f) => {
      add(f.baseLabel || f.label); add(f.help);
      (f.options || []).forEach(([, l]) => add(l));
    });
  });
  SETTINGS_GROUPS.forEach((g) => {
    add(g.title); add(g.note);
    g.fields.forEach((f) => { add(f.baseLabel || f.label); add(f.help); (f.options || []).forEach(([, l]) => add(l)); });
  });
  [STATUS_LABEL, AGE_LABEL, EXP_LABEL].forEach((o) => Object.values(o).forEach(add));
  Object.values(APPLICATIONS).forEach((a) => add(a.title));
  const missing = [...need].filter((s) => !AR[s]);
  assert.deepEqual(missing, []);
});

test('every a("...") text used in admin components has an Arabic translation', () => {
  const missing = new Set();
  for (const f of fs.readdirSync('src/admin').filter((f) => f.endsWith('.jsx'))) {
    const src = fs.readFileSync(`src/admin/${f}`, 'utf8');
    for (const m of src.matchAll(/\ba\(\s*(['"])((?:\\.|(?!\1).)*)\1/g)) {
      const text = m[2].replace(/\\'/g, "'");
      if (!AR[text]) missing.add(`${f}: ${text}`);
    }
  }
  assert.deepEqual([...missing], []);
});

test('placeholders match', () => {
  const ph = (s) => (s.match(/\{\w+\}/g) || []).sort().join();
  for (const [en, ar] of Object.entries(AR)) assert.equal(ph(en), ph(ar), en);
});
