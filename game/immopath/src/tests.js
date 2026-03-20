/**
 * tests.js – Einfache Unit-nahe Tests ohne Framework für IMMOPATH
 * Ausführen: Im Browser oder Node mit --experimental-vm-modules
 * Import als Modul: <script type="module" src="../src/tests.js"></script>
 */

import { monthlyRate, estimatePurchaseCosts, approveLoan } from './financing.js';
import { clamp, rnd } from './utils.js';
import { rentalProbability } from './tenants.js';
import { rollOffers, rentBand } from './marketplace.js';

// --- Test-Helfer ---
let _passed = 0;
let _failed = 0;

function assert(description, condition) {
  if (condition) {
    console.log(`  ✅ ${description}`);
    _passed++;
  } else {
    console.error(`  ❌ FAIL: ${description}`);
    _failed++;
  }
}

function assertClose(description, actual, expected, tolerance = 0.01) {
  const diff = Math.abs(actual - expected);
  assert(`${description} (erwartet ~${expected}, erhalten ${actual.toFixed(4)})`, diff <= tolerance);
}

function section(name) {
  console.group(`\n📦 ${name}`);
}
function sectionEnd() {
  console.groupEnd();
}

// ==============================================
// 1. monthlyRate
// ==============================================
section('monthlyRate');

assertClose(
  'Rate bei 200.000 €, 4,5 % p.a., 360 Monate ≈ 1.013,37 €',
  monthlyRate(200000, 0.045, 360),
  1013.37,
  1
);

assertClose(
  'Rate bei 0 % Zins = P/n',
  monthlyRate(120000, 0, 120),
  1000,
  0.01
);

assert(
  'Rate ist positiv',
  monthlyRate(100000, 0.05, 240) > 0
);

assertClose(
  'Rate bei kleinem Kredit 50.000 €, 3 % p.a., 180 Monate ≈ 345,41 €',
  monthlyRate(50000, 0.03, 180),
  345.41,
  1
);

sectionEnd();

// ==============================================
// 2. clamp
// ==============================================
section('clamp');

assert('clamp(150, 0, 100) = 100', clamp(150, 0, 100) === 100);
assert('clamp(-5, 0, 100) = 0',   clamp(-5, 0, 100) === 0);
assert('clamp(50, 0, 100) = 50',  clamp(50, 0, 100) === 50);
assert('clamp(0, 0, 0) = 0',      clamp(0, 0, 0) === 0);

sectionEnd();

// ==============================================
// 3. DTI-Prüfung
// ==============================================
section('DTI-Prüfung (approveLoan)');

const mockState = {
  netIncome: 2000,
  portfolio: [
    { mortgage: { monthlyPayment: 400 } },
  ]
};

const r1 = approveLoan(mockState, 300);
assert('DTI 700/2000 = 35 % → OK', r1.ok === true);
assertClose('DTI-Wert korrekt', r1.dti, 0.35, 0.001);

const r2 = approveLoan(mockState, 500);
assert('DTI 900/2000 = 45 % → BLOCKIERT', r2.ok === false);
assertClose('DTI-Wert korrekt (überschritten)', r2.dti, 0.45, 0.001);

const r3 = approveLoan({ netIncome: 5000, portfolio: [] }, 1999);
assert('DTI 1999/5000 = 39,98 % → OK', r3.ok === true);

const r4 = approveLoan({ netIncome: 5000, portfolio: [] }, 2001);
assert('DTI 2001/5000 = 40,02 % → BLOCKIERT', r4.ok === false);

sectionEnd();

// ==============================================
// 4. Angebotspreisbildung (rollOffers)
// ==============================================
section('Angebotspreisbildung (rollOffers)');

const mockMarket = {
  heat: 55,
  supply: 50,
  baseInterest: 0.045,
  rentIndex: 1,
  cities: [{
    id: 'city1',
    name: 'Nordstadt',
    zones: [
      { id: 'A', name: 'A-Lage', attractiveness: 0.9, rentPerM2: 14, pricePerM2: 4200, vacBase: 0.02 },
      { id: 'B', name: 'B-Lage', attractiveness: 0.7, rentPerM2: 11, pricePerM2: 3200, vacBase: 0.03 },
      { id: 'C', name: 'C-Lage', attractiveness: 0.5, rentPerM2:  8, pricePerM2: 2400, vacBase: 0.04 },
    ]
  }]
};

const offers = rollOffers(mockMarket);
assert('rollOffers erzeugt mind. 1 Angebot', offers.length >= 1);
assert('Alle Angebote haben eine ID', offers.every((o) => !!o.id));
assert('Alle Angebote haben einen Preis > 0', offers.every((o) => o.price > 0));
assert('Alle Angebote haben areaM2 > 0', offers.every((o) => o.areaM2 > 0));
assert(
  'Preis liegt plausibel im Bereich (z.B. C-Lage 35 m² ≥ 60.000 €)',
  offers.some((o) => o.price >= 60000)
);

// Preis-Formel-Plausibilität: C-Lage, 50 m²: 50 * 2400 * 0.95 ≈ 114.000 (untere Grenze)
const cOffers = offers.filter((o) => o.location.zoneId === 'C');
if (cOffers.length > 0) {
  const o = cOffers[0];
  assert(
    `C-Lage Preis/m² ≥ 2400 * 0.95 * 0.97 ≈ 2.203`,
    o.pricePerM2 >= 2200
  );
}

sectionEnd();

// ==============================================
// 5. Vermietungswahrscheinlichkeit – Grenzwerte
// ==============================================
section('Vermietungswahrscheinlichkeit (rentalProbability)');

const zoneA = { attractiveness: 0.9, vacBase: 0.02 };
const zoneC = { attractiveness: 0.5, vacBase: 0.04 };
const hotMarket  = { heat: 90, supply: 30 };
const coldMarket = { heat: 10, supply: 90 };

const pHotA = rentalProbability(zoneA, hotMarket, 1000, 1000);
assert('Heißer Markt, A-Lage, fairer Preis → p ≥ 0.7', pHotA >= 0.7);

const pColdC = rentalProbability(zoneC, coldMarket, 1000, 1000);
assert('Kalter Markt, C-Lage, fairer Preis → p ≤ 0.4', pColdC <= 0.4);

const pOverpriced = rentalProbability(zoneA, hotMarket, 2000, 1000); // 2x Marktmiete
assert('Überteuert (2× Marktband) → p ≤ 0.3', pOverpriced <= 0.3);

// Grenzen: immer in [0.05, 0.85]
for (let i = 0; i < 50; i++) {
  const market = { heat: rnd(0, 100), supply: rnd(0, 100) };
  const zone = { attractiveness: rnd(0, 1), vacBase: 0.03 };
  const p = rentalProbability(zone, market, rnd(500, 3000), 1000);
  assert(`Zufalls-p bleibt in [0.05, 0.85] (Durchlauf ${i})`, p >= 0.05 && p <= 0.85);
}

sectionEnd();

// ==============================================
// 6. estimatePurchaseCosts
// ==============================================
section('estimatePurchaseCosts');

const mockOffer = {
  price: 200000,
  category: 'apartment',
  fees: { agentPct: 0.0238, notaryPct: 0.015, transferTaxPct: 0.03, miscPct: 0.005 }
};
const costs = estimatePurchaseCosts(mockOffer, 0.12, 0.045, 360);
assert('equity = 12 % von 200.000 = 24.000', costs.equity === 24000);
assert('loan = 200.000 - 24.000 = 176.000', costs.loan === 176000);
assert('totalCashNeed = equity + closingCosts', costs.totalCashNeed === costs.equity + costs.closingCosts);
assert('monthlyPayment > 0', costs.monthlyPayment > 0);
assert(
  'closingCosts ≈ 14.76 % * 200.000 ≈ 14.760',
  costs.closingCosts >= 13000 && costs.closingCosts <= 16000
);

sectionEnd();

// ==============================================
// 7. rentBand
// ==============================================
section('rentBand');

const testOffer = { areaM2: 60, rentPotentialM2: 11 };
const band = rentBand(testOffer);
assert('mid = 60 * 11 = 660', band.mid === 660);
assert('low = mid * 0.85 = 561', band.low === Math.round(660 * 0.85));
assert('high = mid * 1.15 = 759', band.high === Math.round(660 * 1.15));
assert('low < mid < high', band.low < band.mid && band.mid < band.high);

sectionEnd();

// ==============================================
// Ergebnis
// ==============================================
console.log(`\n${'='.repeat(50)}`);
console.log(`Ergebnis: ${_passed} bestanden, ${_failed} fehlgeschlagen`);
if (_failed === 0) {
  console.log('🎉 Alle Tests bestanden!');
} else {
  console.error(`⚠ ${_failed} Test(s) fehlgeschlagen – bitte prüfen.`);
}






