import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import {
  anschlussMehrbelastungJahr,
  berechneDarlehen,
  jahresuebersicht,
  laufzeitJahreJaehrlich,
  laufzeitJahreMonatlich,
  monatsrate,
  restschuldJaehrlichEuro,
} from './darlehen.ts';
import { type Cents, eur, prozent } from './geld.ts';

const euro = (c: Cents) => c / 100;
const rund1 = (x: number) => Math.round(x * 10) / 10;

// Golden Tests aus docs/research/10-ic-finanzierung-wirtschaftlichkeit.md §1.9
describe('Darlehen – Golden Tests', () => {
  it('T2: 100.000 €, 2 %/2 % → 333,33 €/Monat, RS 10 J. ≈ 77.880 €, Laufzeit 35,0/34,7 J.', () => {
    expect(monatsrate(eur(100_000), prozent(2), prozent(2))).toBe(33_333);
    const r = berechneDarlehen({
      betrag: eur(100_000),
      sollzins: prozent(2),
      anfangstilgung: prozent(2),
      zinsbindungJahre: 10,
    });
    expect(Math.round(euro(r.restschuldEndeZinsbindung))).toBeCloseTo(77_880, -1);
    expect(rund1(laufzeitJahreJaehrlich(prozent(2), prozent(2)))).toBe(35.0);
    expect(rund1(laufzeitJahreMonatlich(prozent(2), prozent(2)))).toBe(34.7);
    // Tilgungsplan: 417 Monate (letzte Rate kleiner) ≈ geschlossene Form 34,69 J.
    expect(
      Math.abs((r.laufzeitMonate ?? 0) / 12 - laufzeitJahreMonatlich(prozent(2), prozent(2))),
    ).toBeLessThan(1 / 12);
  });

  it('T3: 100.000 €, 4 %/2 % → 500,00 €/Monat, Laufzeit 28,0 J. (jährlich)', () => {
    expect(monatsrate(eur(100_000), prozent(4), prozent(2))).toBe(50_000);
    expect(rund1(laufzeitJahreJaehrlich(prozent(4), prozent(2)))).toBe(28.0);
  });

  it('T4: 58.000 €, 2,5 %/3,5 % → 290 €/Monat, 3.480 €/Jahr, Laufzeit 21,8 J.', () => {
    const r = berechneDarlehen({
      betrag: eur(58_000),
      sollzins: prozent(2.5),
      anfangstilgung: prozent(3.5),
      zinsbindungJahre: 10,
    });
    expect(r.monatsrate).toBe(29_000);
    expect(r.jahresrate).toBe(348_000);
    expect(rund1(laufzeitJahreJaehrlich(prozent(2.5), prozent(3.5)))).toBe(21.8);
  });

  it('T5: 192.000 €, 3,9 %/2,0 % → 11.328 €/Jahr, RS jährlich 146.110 €, monatlich 145.128 €, +1 Pp. ≈ 1.461 €/Jahr', () => {
    const r = berechneDarlehen({
      betrag: eur(192_000),
      sollzins: prozent(3.9),
      anfangstilgung: prozent(2),
      zinsbindungJahre: 10,
    });
    expect(r.jahresrate).toBe(eur(11_328));
    expect(Math.round(restschuldJaehrlichEuro(192_000, prozent(3.9), prozent(2), 10))).toBe(146_110);
    expect(Math.abs(euro(r.restschuldEndeZinsbindung) - 145_128)).toBeLessThan(1);
    expect(Math.round(euro(anschlussMehrbelastungJahr(eur(146_110), prozent(3.9), prozent(4.9))))).toBe(
      1_461,
    );
    expect(rund1(laufzeitJahreJaehrlich(prozent(3.9), prozent(2)))).toBe(28.3);
  });
});

describe('Darlehen – Sondertilgung', () => {
  const basis = {
    betrag: eur(300_000),
    sollzins: prozent(4),
    anfangstilgung: prozent(2),
    zinsbindungJahre: 10,
  };

  it('verkürzt die Laufzeit und senkt Zinsen und Restschuld', () => {
    const ohne = berechneDarlehen(basis);
    const mit = berechneDarlehen({ ...basis, sondertilgungJahr: eur(5_000) });
    expect(mit.laufzeitMonate).toBeLessThan(ohne.laufzeitMonate ?? 0);
    expect(mit.zinsenGesamt).toBeLessThan(ohne.zinsenGesamt);
    expect(mit.restschuldEndeZinsbindung).toBeLessThan(ohne.restschuldEndeZinsbindung);
    expect(mit.sondertilgungInZinsbindung).toBe(eur(50_000));
    expect(mit.plan[11]?.sondertilgung).toBe(eur(5_000));
    expect(mit.plan[10]?.sondertilgung).toBe(0);
  });
});

describe('Darlehen – Invarianten (fast-check)', () => {
  const eingabe = fc.record({
    betrag: fc.integer({ min: 1_000, max: 2_000_000 }).map((e) => eur(e)),
    sollzins: fc.integer({ min: 0, max: 900 }).map((b) => b as never),
    anfangstilgung: fc.integer({ min: 50, max: 1_000 }).map((b) => b as never),
    zinsbindungJahre: fc.integer({ min: 1, max: 30 }),
    sondertilgungJahr: fc.integer({ min: 0, max: 20_000 }).map((e) => eur(e)),
  });

  it('Σ Tilgung + Σ Sondertilgung + Restschuld = Darlehen; Restschuld fällt monoton; Zahlung = Zins + Tilgung', () => {
    fc.assert(
      fc.property(eingabe, (e) => {
        const r = berechneDarlehen(e);
        let summe = 0;
        let vorher = e.betrag as number;
        for (const z of r.plan) {
          summe += z.tilgung + z.sondertilgung;
          if (z.restschuld > vorher) return false;
          if (z.rate !== z.zins + z.tilgung) return false;
          if (!Number.isInteger(z.zins) || z.restschuld < 0) return false;
          vorher = z.restschuld;
        }
        const rest = r.plan.at(-1)?.restschuld ?? 0;
        if (summe + rest !== e.betrag) return false;
        return r.laufzeitMonate === null ? rest > 0 : r.laufzeitMonate === r.plan.length && rest === 0;
      }),
      { numRuns: 150 },
    );
  });

  it('ist deterministisch (zweimal gleich)', () => {
    fc.assert(
      fc.property(eingabe, (e) => {
        const erster = JSON.stringify(berechneDarlehen(e));
        const zweiter = JSON.stringify(berechneDarlehen({ ...e }));
        return erster === zweiter;
      }),
      { numRuns: 30 },
    );
  });
});

describe('Jahresübersicht', () => {
  it('summiert Monate je Darlehensjahr', () => {
    const r = berechneDarlehen({
      betrag: eur(100_000),
      sollzins: prozent(4),
      anfangstilgung: prozent(2),
      zinsbindungJahre: 10,
    });
    const jahre = jahresuebersicht(r.plan);
    expect((jahre[0]?.zins ?? 0) + (jahre[0]?.tilgung ?? 0)).toBe(r.jahresrate);
    expect(jahre[9]?.restschuld).toBe(r.restschuldEndeZinsbindung);
    expect(jahre.reduce((s, j) => s + j.tilgung, 0)).toBe(eur(100_000));
  });
});
