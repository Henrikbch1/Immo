/**
 * Balancing-CLI (Gerüst, Z2; 04 §2 `tools/balance`): Monte-Carlo über zufällige Objekte mit dem echten
 * Rechenkern, Verteilung der Kennzahlen und Prüfung gegen Bänder. Die Bänder sind DESIGN-Platzhalter;
 * echte Bänder aus Fallstudien und Marktdaten folgen ab P3 (LR-55).
 *
 * Aufruf: pnpm balance [--n 2000] [--seed 42] [--json]
 */
import {
  BUNDESLAENDER,
  type Bundesland,
  eur,
  type KalkulationsEingabe,
  kalkuliere,
  prozent,
  rand,
  randInt,
} from '../../packages/sim-core/src/index.ts';

const args = process.argv.slice(2);
const opt = (name: string, std: number) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : std;
};
const N = opt('n', 2000);
const SEED = opt('seed', 42);
const ALS_JSON = args.includes('--json');

/** Stichprobenräume (DESIGN, grob an research/20 und Fallstudien orientiert). */
const RAUM = {
  flaeche: [30, 110],
  preisJeM2: [1_200, 5_500],
  mieteJeM2: [6, 15],
  nuAnteilMiete: [0.08, 0.2],
  baujahr: [1900, 2024],
  ekAnteil: [0.05, 0.3],
  zins: [3.4, 4.6],
} as const;

function zwischen(lo: number, hi: number, i: number, k: number) {
  return lo + (hi - lo) * rand(SEED, 'test', 0, `balance-${i}`, k);
}

function objekt(i: number): KalkulationsEingabe {
  const flaeche = Math.round(zwischen(RAUM.flaeche[0], RAUM.flaeche[1], i, 1));
  const kp = Math.round((flaeche * zwischen(RAUM.preisJeM2[0], RAUM.preisJeM2[1], i, 2)) / 1_000) * 1_000;
  const miete = Math.round(flaeche * zwischen(RAUM.mieteJeM2[0], RAUM.mieteJeM2[1], i, 3));
  const nu = Math.round(miete * zwischen(RAUM.nuAnteilMiete[0], RAUM.nuAnteilMiete[1], i, 4));
  const land = BUNDESLAENDER[
    randInt(SEED, 'test', 0, `balance-${i}`, 0, BUNDESLAENDER.length - 1, 5)
  ] as Bundesland;
  return {
    kaufpreis: eur(kp),
    flaeche,
    mieteMonat: eur(miete),
    hausgeldMonat: eur(nu * 2),
    hausgeldNichtUmlagefaehigMonat: eur(nu),
    bundesland: land,
    baujahr: randInt(SEED, 'test', 0, `balance-${i}`, RAUM.baujahr[0], RAUM.baujahr[1], 6),
    eigenkapital: eur(Math.round(kp * zwischen(RAUM.ekAnteil[0], RAUM.ekAnteil[1], i, 7))),
    sollzins: prozent(Math.round(zwischen(RAUM.zins[0], RAUM.zins[1], i, 8) * 10) / 10),
    anfangstilgung: prozent(2),
    zinsbindungJahre: 10,
  };
}

function quantile(werte: number[]) {
  const s = [...werte].sort((a, b) => a - b);
  const q = (p: number) => s[Math.min(s.length - 1, Math.floor(p * s.length))] ?? 0;
  return { p10: q(0.1), p50: q(0.5), p90: q(0.9) };
}

const brutto: number[] = [];
const netto: number[] = [];
const cfMonat: number[] = [];
const stufen: Record<string, number> = {};
for (let i = 0; i < N; i++) {
  const r = kalkuliere(objekt(i));
  brutto.push(r.bierdeckel.bruttorendite.wert / 100);
  netto.push(r.nettorendite.wert / 100);
  cfMonat.push(r.kaskade.nachFinanzierung.wert / 100 / 12);
  stufen[r.bierdeckel.stufe] = (stufen[r.bierdeckel.stufe] ?? 0) + 1;
}

/** Bänder (DESIGN-Platzhalter): Median-Spannen, die das Spiel plausibel halten sollen. */
const BAENDER = [
  { name: 'Bruttorendite Median (%)', wert: quantile(brutto).p50, min: 3, max: 7 },
  { name: 'Nettorendite Median (%)', wert: quantile(netto).p50, min: 2, max: 5.5 },
  { name: 'Anteil Ampel „selten“ (%)', wert: ((stufen.selten ?? 0) / N) * 100, min: 0, max: 10 },
];

const bericht = {
  n: N,
  seed: SEED,
  bruttoProzent: quantile(brutto),
  nettoProzent: quantile(netto),
  cfNachFinanzierungEuroMonat: quantile(cfMonat),
  ampel: stufen,
  baender: BAENDER.map((b) => ({ ...b, ok: b.wert >= b.min && b.wert <= b.max })),
};

if (ALS_JSON) {
  console.log(JSON.stringify(bericht, null, 2));
} else {
  const f = (x: number) => x.toFixed(2).replace('.', ',');
  console.log(`Balancing (Gerüst) – ${N} Objekte, Seed ${SEED}\n`);
  console.log('Kennzahl                         P10       P50       P90');
  for (const [name, q] of [
    ['Bruttorendite (%)', bericht.bruttoProzent],
    ['Nettorendite (%)', bericht.nettoProzent],
    ['CF nach Finanzierung (€/Monat)', bericht.cfNachFinanzierungEuroMonat],
  ] as const) {
    console.log(
      `${name.padEnd(30)} ${f(q.p10).padStart(8)}  ${f(q.p50).padStart(8)}  ${f(q.p90).padStart(8)}`,
    );
  }
  console.log(
    `\nAmpel: ${Object.entries(stufen)
      .map(([k, v]) => `${k} ${v}`)
      .join(' · ')}`,
  );
  console.log('\nBänder (DESIGN-Platzhalter):');
  for (const b of bericht.baender) {
    console.log(`  ${b.ok ? '✓' : '⚠'} ${b.name}: ${f(b.wert)} (Soll ${f(b.min)}–${f(b.max)})`);
  }
}
if (bericht.baender.some((b) => !b.ok)) process.exitCode = 2;
