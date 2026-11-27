import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { type Cents, eur, prozent } from './geld.ts';
import {
  bankMindestrendite,
  bierdeckel,
  bierdeckelStufe,
  cashflowKaskade,
  eigeneMittelBedarf,
  gesamtkaufkosten,
  instandhaltungIiBv,
  jahresnettokaltmiete,
  type KalkulationsEingabe,
  kalkuliere,
  kaufnebenkosten,
  mietausfallreserve,
  nettomietrendite,
} from './kalkulation.ts';
import { abgeleitet, eingabe, explain, type Kennzahl, werteHerleitungAus } from './kennzahl.ts';
import { ALLE_PARAMETER, BUNDESLAENDER, type Bundesland, pw } from './parameter.ts';
import { BEISPIELOBJEKT } from './referenz.ts';

const euro = (c: number) => c / 100;
const kosten = (schluessel: string, c: Cents): Kennzahl =>
  abgeleitet({
    schluessel,
    einheit: 'EUR',
    zeitbezug: 'JAHR',
    rechenart: 'summe',
    herleitung: [eingabe(schluessel, c, 'EUR')],
  });

const BEISPIEL = BEISPIELOBJEKT;

// Golden Tests aus docs/research/10-ic-finanzierung-wirtschaftlichkeit.md §1.9
describe('Kalkulation – Golden Tests', () => {
  it('T1: KP 120.000, NKM 500, 50 m² → Brutto 5,00 %, Faktor 20,0, 2.400 €/m², 10 €/m²', () => {
    const b = bierdeckel({ kaufpreis: eur(120_000), mieteMonat: eur(500), flaeche: 50 });
    expect(b.bruttorendite.wert).toBe(500);
    expect(b.faktor.wert).toBe(20);
    expect(b.preisJeM2.wert).toBe(240_000);
    expect(b.mieteJeM2.wert).toBe(1_000);
    expect(b.stufe).toBe('genauerBlick');
  });

  it('T6: Cashflow-Kaskade 250.000 € → op. CF 9.880, CF n. Fin. −3.320, Brutto 5,76 %', () => {
    const jnkm = jahresnettokaltmiete(eur(1_200));
    const k = cashflowKaskade({
      nettokaltmieteJahr: jnkm,
      mietausfallJahr: eur(720), // 5 % Ausfall
      nuKostenJahr: kosten('kosten', eur(1_800 + 2_000)), // lfd. Kosten + Instandhaltung
      zinsJahr: eur(8_800), // KD 13.200 vereinfacht auf Anfangsdarlehen (4 % + 2 % von 220.000)
      tilgungJahr: eur(4_400),
    });
    expect(euro(k.operativ.wert)).toBe(9_880);
    expect(euro(k.nachFinanzierung.wert)).toBe(-3_320);
    const b = bierdeckel({ kaufpreis: eur(250_000), mieteMonat: eur(1_200), flaeche: 80 });
    expect(b.bruttorendite.wert).toBeCloseTo(576, 10);
  });

  it('T7: KP 240.000, JNKM 10.800, nuK 2.700, KNK 18.000 → Brutto 4,50 %, Faktor 22,22, Netto 3,14 % / 3,15 %', () => {
    const b = bierdeckel({ kaufpreis: eur(240_000), mieteMonat: eur(900), flaeche: 70 });
    expect(b.bruttorendite.wert).toBeCloseTo(450, 10);
    expect(Math.round(b.faktor.wert * 100) / 100).toBe(22.22);
    const nuk = kosten('nuk', eur(2_700));
    const netto = (knk: number) =>
      nettomietrendite(b.jahresmiete, nuk, gesamtkaufkosten(eur(240_000), kosten('knk', eur(knk))));
    expect(Math.round(netto(18_000).wert)).toBe(314);
    expect(Math.round(netto(16_800).wert)).toBe(315);
    // Probe: KNK 18.000 entspricht in HB GrESt 5,5 % + Notar 2 %.
    expect(euro(kaufnebenkosten({ kaufpreis: eur(240_000), bundesland: 'HB' }).summe.wert)).toBe(18_000);
  });

  it('T8: KP 200.000 HB, Notar 2 %, D 180.000, Renov. 5.000, Puffer 10.000 → GrESt 11.000, KNK 15.000, eigene Mittel 50.000', () => {
    const knk = kaufnebenkosten({ kaufpreis: eur(200_000), bundesland: 'HB', notarSatz: prozent(2) });
    expect(euro(knk.grest.wert)).toBe(11_000);
    expect(euro(knk.summe.wert)).toBe(15_000);
    const em = eigeneMittelBedarf({
      kaufpreis: eur(200_000),
      knk: knk.summe,
      darlehen: eur(180_000),
      renovierung: eur(5_000),
      puffer: eur(10_000),
    });
    expect(euro(em.wert)).toBe(50_000);
  });

  it('T9: Stresszins 8 %, Mietabschlag 25 % → Mindestrendite 10,67 %', () => {
    expect(Math.round(bankMindestrendite(prozent(8), prozent(25)))).toBe(1_067);
  });

  it('T10: Miete 6.000, Kosten 2.000, Zins 2.000, Tilgung 2.000 → CF 0; nach Entschuldung 4.000 €/a', () => {
    const miete = kosten('miete', eur(6_000));
    const nachher = { nettokaltmieteJahr: miete, nuKostenJahr: kosten('k', eur(2_000)) };
    expect(
      cashflowKaskade({ ...nachher, zinsJahr: eur(2_000), tilgungJahr: eur(2_000) }).nachFinanzierung.wert,
    ).toBe(0);
    const entschuldet = cashflowKaskade({ ...nachher, zinsJahr: eur(0), tilgungJahr: eur(0) });
    expect(euro(entschuldet.nachFinanzierung.wert)).toBe(4_000);
  });

  it('T11: Steuerstufe (Näherung) → CF v. St. 500, st. Ergebnis 500, Steuer 210, CF n. St. 290, Liquidität −210', () => {
    const k = cashflowKaskade({
      nettokaltmieteJahr: kosten('miete', eur(6_000)),
      nuKostenJahr: kosten('k', eur(1_500)),
      zinsJahr: eur(2_000),
      tilgungJahr: eur(2_000),
      ruecklagen: [kosten('ruecklage', eur(500))],
      steuer: { afaJahr: eur(2_000), grenzsteuersatz: prozent(42) },
    });
    expect(euro(k.nachFinanzierung.wert)).toBe(500);
    expect(euro(k.steuerlichesErgebnis?.wert ?? Number.NaN)).toBe(500);
    expect(euro(k.steuerwirkung?.wert ?? Number.NaN)).toBe(210);
    expect(euro(k.nachSteuern?.wert ?? Number.NaN)).toBe(290);
    expect(euro(k.liquiditaetNachRuecklagen.wert)).toBe(-210);
  });

  it('T12: 65 m², Baujahr 1972, ohne Aufzug → 1.210,30 €/a Instandhaltung', () => {
    const i = instandhaltungIiBv({ flaeche: 65, baujahr: 1972 });
    expect(i.satz.wert).toBe(1_862);
    expect(i.jahr.wert).toBe(121_030);
    expect(instandhaltungIiBv({ flaeche: 65, baujahr: 1972, aufzug: true }).satz.wert).toBe(1_862 + 163);
    expect(instandhaltungIiBv({ flaeche: 10, baujahr: 2005 }).satz.wert).toBe(1_150); // 21 Jahre
    expect(instandhaltungIiBv({ flaeche: 10, baujahr: 2004 }).satz.wert).toBe(1_458); // 22 Jahre
    expect(instandhaltungIiBv({ flaeche: 10, baujahr: 1995 }).satz.wert).toBe(1_458); // 31 Jahre
    expect(instandhaltungIiBv({ flaeche: 10, baujahr: 1994 }).satz.wert).toBe(1_862); // 32 Jahre
  });

  it('T13: NKM 500 → Mietausfallreserve 15 €/Monat, 180 €/a', () => {
    const r = mietausfallreserve(jahresnettokaltmiete(eur(500)));
    expect(euro(r.wert)).toBe(180);
    expect(euro(r.wert) / 12).toBe(15);
  });
});

describe('Kaufnebenkosten je Bundesland (Abnahme Z2)', () => {
  const grestProzent = (land: Bundesland) =>
    euro(kaufnebenkosten({ kaufpreis: eur(100_000), bundesland: land }).grest.wert) / 1_000;

  it('NDS 5,0 % · NRW 6,5 % · HB 5,5 %', () => {
    expect(grestProzent('NI')).toBe(5);
    expect(grestProzent('NW')).toBe(6.5);
    expect(grestProzent('HB')).toBe(5.5);
  });

  it('alle 16 Länder haben einen Satz zwischen 3,5 % und 6,5 %; nur NW ist BELEGT', () => {
    for (const land of BUNDESLAENDER) {
      const p = ALLE_PARAMETER[`knk.grest.${land}`];
      expect(p.wert).toBeGreaterThanOrEqual(350);
      expect(p.wert).toBeLessThanOrEqual(650);
      expect(p.status).toBe(land === 'NW' ? 'BELEGT' : 'GESCHÄTZT');
    }
  });

  it('GrESt wird auf volle Euro abgerundet, Inventar mindert nur die GrESt-Basis', () => {
    const k = kaufnebenkosten({ kaufpreis: eur(123_456.78), bundesland: 'NW' });
    expect(k.grest.wert).toBe(eur(8_024)); // 8.024,69 → 8.024
    const mitInventar = kaufnebenkosten({
      kaufpreis: eur(200_000),
      bundesland: 'NI',
      inventarSeparat: eur(5_000),
    });
    expect(euro(mitInventar.grest.wert)).toBe(9_750);
    expect(euro(mitInventar.notarGrundbuch.wert)).toBe(4_000);
  });

  it('Makler nur, wenn ein Satz angegeben ist; Schätzung wird markiert', () => {
    const ohne = kaufnebenkosten({ kaufpreis: eur(200_000), bundesland: 'NW' });
    const mit = kaufnebenkosten({ kaufpreis: eur(200_000), bundesland: 'NW', maklerSatz: prozent(3.57) });
    expect(ohne.makler.wert).toBe(0);
    expect(euro(mit.makler.wert)).toBe(7_140);
    expect(ohne.grest.enthaeltSchaetzung).toBe(false); // NW belegt
    expect(ohne.summe.enthaeltSchaetzung).toBe(true); // Notarpauschale geschätzt
  });
});

describe('Bierdeckel-Ampel', () => {
  it('Schwellen 5/6/8/10 % (DESIGN)', () => {
    expect(bierdeckelStufe(499.99)).toBe('unter');
    expect(bierdeckelStufe(500)).toBe('genauerBlick');
    expect(bierdeckelStufe(600)).toBe('selbsttragend');
    expect(bierdeckelStufe(800)).toBe('hoch');
    expect(bierdeckelStufe(1_000)).toBe('selten');
    expect(ALLE_PARAMETER['kalk.bierdeckel.genauerBlick'].status).toBe('DESIGN');
  });
});

describe('Vollkalkulation Beispielobjekt (HB, 200.000 €)', () => {
  const r = kalkuliere(BEISPIEL);

  it('Kaufnebenkosten, Kapital, Renditen', () => {
    expect(euro(r.knk.grest.wert)).toBe(11_000);
    expect(euro(r.knk.notarGrundbuch.wert)).toBe(4_000);
    expect(euro(r.knk.summe.wert)).toBe(15_000);
    expect(euro(r.gesamtkosten.wert)).toBe(215_000);
    expect(euro(r.darlehen.wert)).toBe(185_000);
    expect(r.finanzierungsquote.wert).toBe(9_250);
    expect(r.bierdeckel.bruttorendite.wert).toBe(450);
    expect(r.bierdeckel.stufe).toBe('unter');
    expect(Math.round(r.nettorendite.wert)).toBe(357); // (9.000 − 1.320) / 215.000
  });

  it('Kaskade: operativ 7.680 €, Kapitaldienst Jahr 1 = 12 Raten, Liquidität nach Rücklagen', () => {
    expect(euro(r.kaskade.operativ.wert)).toBe(7_680);
    expect(r.zinsJahr1.wert + r.tilgungJahr1.wert).toBe(12 * 92_500);
    expect(euro(r.kaskade.nachFinanzierung.wert)).toBe(7_680 - 11_100);
    expect(euro(r.kaskade.ruecklagenSumme.wert)).toBe(1_210.3 + 270);
    expect(euro(r.kaskade.liquiditaetNachRuecklagen.wert)).toBeCloseTo(7_680 - 11_100 - 1_480.3, 2);
  });

  it('explain() liefert jede Kennzahl, verschachtelte Posten sind auflösbar', () => {
    const k = explain(r.kennzahlen, 'cf.nachFinanzierung');
    expect(k?.herleitung.map((p) => p.schluessel)).toEqual([
      'cf.operativ',
      'darlehen.zinsJahr1',
      'darlehen.tilgungJahr1',
    ]);
    for (const kz of Object.values(r.kennzahlen)) {
      for (const p of kz.herleitung) {
        const bekannt =
          p.schluessel.startsWith('eingabe.') ||
          p.schluessel.startsWith('param.') ||
          p.schluessel in r.kennzahlen;
        expect(bekannt, `${kz.schluessel} → ${p.schluessel}`).toBe(true);
      }
    }
    expect(explain(r.kennzahlen, 'gibt.es.nicht')).toBeNull();
  });

  it('Schätz-Markierung pflanzt sich fort (Notarpauschale, GrESt HB → Netto-Rendite)', () => {
    expect(r.knk.grest.enthaeltSchaetzung).toBe(true);
    expect(r.nettorendite.enthaeltSchaetzung).toBe(true);
    expect(r.bierdeckel.bruttorendite.enthaeltSchaetzung).toBe(false);
  });
});

describe('Kalkulation – Property-Tests', () => {
  const objekt = fc.record({
    kp: fc.integer({ min: 20_000, max: 2_000_000 }),
    miete: fc.integer({ min: 150, max: 8_000 }),
    flaeche: fc.integer({ min: 15, max: 400 }),
    nu: fc.integer({ min: 0, max: 600 }),
    land: fc.constantFrom(...BUNDESLAENDER),
    baujahr: fc.integer({ min: 1900, max: 2026 }),
    ekAnteil: fc.integer({ min: 0, max: 100 }),
    zins: fc.integer({ min: 50, max: 900 }),
    tilgung: fc.integer({ min: 100, max: 600 }),
    makler: fc.boolean(),
  });
  const eingabeAus = (o: {
    kp: number;
    miete: number;
    flaeche: number;
    nu: number;
    land: Bundesland;
    baujahr: number;
    ekAnteil: number;
    zins: number;
    tilgung: number;
    makler: boolean;
  }): KalkulationsEingabe => ({
    kaufpreis: eur(o.kp),
    flaeche: o.flaeche,
    mieteMonat: eur(o.miete),
    hausgeldMonat: eur(o.nu * 2),
    hausgeldNichtUmlagefaehigMonat: eur(o.nu),
    bundesland: o.land,
    baujahr: o.baujahr,
    eigenkapital: eur(Math.round((o.kp * o.ekAnteil) / 100)),
    sollzins: prozent(o.zins / 100),
    anfangstilgung: prozent(o.tilgung / 100),
    zinsbindungJahre: 10,
    maklerSatz: o.makler ? prozent(3.57) : null,
  });

  it('Herleitung ergibt immer den angezeigten Wert (AK-O01-2), Geldwerte sind ganze Cent', () => {
    fc.assert(
      fc.property(objekt, (o) => {
        const r = kalkuliere(eingabeAus(o));
        for (const k of Object.values(r.kennzahlen)) {
          expect(werteHerleitungAus(k.rechenart, k.herleitung, k.einheit, k.rundung)).toBe(k.wert);
          if (k.einheit === 'EUR') expect(Number.isInteger(k.wert)).toBe(true);
        }
      }),
      { numRuns: 200 },
    );
  });

  it('Kaskade konsistent: operativ − Kapitaldienst − Rücklagen = Liquidität; Faktor × Brutto = 1', () => {
    fc.assert(
      fc.property(objekt, (o) => {
        const r = kalkuliere(eingabeAus(o));
        const k = r.kaskade;
        expect(k.operativ.wert - r.zinsJahr1.wert - r.tilgungJahr1.wert - k.ruecklagenSumme.wert).toBe(
          k.liquiditaetNachRuecklagen.wert,
        );
        expect((r.bierdeckel.faktor.wert * r.bierdeckel.bruttorendite.wert) / 10_000).toBeCloseTo(1, 12);
        expect(r.gesamtkosten.wert).toBe(r.knk.summe.wert + eur(o.kp));
        expect(r.knk.grest.wert % 100).toBe(0);
      }),
      { numRuns: 200 },
    );
  });

  it('Bundesland ändert nur die GrESt (Notar, Bierdeckel unverändert)', () => {
    fc.assert(
      fc.property(objekt, fc.constantFrom(...BUNDESLAENDER), (o, land2) => {
        const a = kalkuliere(eingabeAus(o));
        const b = kalkuliere(eingabeAus({ ...o, land: land2 }));
        expect(b.knk.notarGrundbuch.wert).toBe(a.knk.notarGrundbuch.wert);
        expect(b.bierdeckel.bruttorendite.wert).toBe(a.bierdeckel.bruttorendite.wert);
        const satz = pw(`knk.grest.${land2}`);
        expect(b.knk.grest.wert).toBe(Math.floor((eur(o.kp) * satz) / 10_000 / 100) * 100);
      }),
      { numRuns: 100 },
    );
  });
});
