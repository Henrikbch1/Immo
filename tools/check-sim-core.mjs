// Lint-Verbote für packages/sim-core (04 §3.2, ADR 0004): kein Math.random/pow/exp/log, kein `**`, kein Date, kein crypto.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'packages/sim-core/src';
const VERBOTE = [
  [
    /\bMath\.(random|pow|exp|log|log2|log10|expm1|log1p)\b/,
    'Math.random/pow/exp/log sind verboten (detmath verwenden)',
  ],
  [/\*\*/, 'Potenzoperator ** ist verboten (detmath.powInt verwenden)'],
  [/\bnew Date\b|\bDate\.(now|parse|UTC)\b/, 'Date ist im Kern verboten (MonthIndex verwenden)'],
  [/\bcrypto\b/, 'crypto ist im Kern verboten'],
  [/\b(fetch|localStorage|indexedDB|document|window)\b/, 'I/O und DOM sind im Kern verboten'],
];

function dateien(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? dateien(p) : p.endsWith('.ts') && !p.endsWith('.test.ts') ? [p] : [];
  });
}

let fehler = 0;
for (const datei of dateien(ROOT)) {
  const original = readFileSync(datei, 'utf8');
  // Kommentare entfernen, Zeilennummern erhalten.
  const ohneKommentare = original
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/\/\/.*$/gm, '');
  const zeilen = original.split('\n');
  ohneKommentare.split('\n').forEach((code, i) => {
    for (const [re, text] of VERBOTE) {
      if (re.test(code)) {
        console.error(`${datei}:${i + 1}: ${text}\n  ${zeilen[i]?.trim()}`);
        fehler++;
      }
    }
  });
}
if (fehler) {
  console.error(`\nsim-core: ${fehler} Verstoß/Verstöße.`);
  process.exit(1);
}
console.log('sim-core: Determinismus-Verbote eingehalten.');
