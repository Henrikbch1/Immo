/**
 * Referenzobjekt und Referenzszenario für Demo, Golden-Hash-Test und Balancing (ADR 0004).
 * Werte sind DESIGN (Beispiel-ETW in Bremen, Standardregion laut Q9), keine Marktdaten.
 */
import { eur, prozent } from './geld.ts';
import { type KalkulationsEingabe, kalkuliere } from './kalkulation.ts';
import { pruefsumme } from './pruefsumme.ts';
import { randInt } from './zufall.ts';

export const BEISPIELOBJEKT: KalkulationsEingabe = {
  kaufpreis: eur(200_000),
  flaeche: 65,
  mieteMonat: eur(750),
  hausgeldMonat: eur(280),
  hausgeldNichtUmlagefaehigMonat: eur(110),
  bundesland: 'HB',
  baujahr: 1972,
  eigenkapital: eur(30_000),
  sollzins: prozent(4),
  anfangstilgung: prozent(2),
  zinsbindungJahre: 10,
};

export const REFERENZ_MONATE = 480;

/**
 * Referenzzustand: Vollkalkulation des Beispielobjekts, Tilgungsplan und Zufallsfolge über 480 Monate.
 * Bis ein Spielzustand existiert (Z5), ist das die Grundlage des Golden-Hash-Tests.
 */
export function referenzZustand(seed: number) {
  const k = kalkuliere(BEISPIELOBJEKT);
  const plan = k.darlehensplan?.plan ?? [];
  const monate = [];
  for (let m = 0; m < REFERENZ_MONATE; m++) {
    monate.push({
      m,
      restschuld: plan[m]?.restschuld ?? 0,
      zins: plan[m]?.zins ?? 0,
      ereignis: randInt(seed, 'test', m, 'referenz', 0, 999_999),
    });
  }
  return { seed, kennzahlen: k.kennzahlen, monate };
}

export function referenzPruefsumme(seed: number): string {
  return pruefsumme(referenzZustand(seed));
}
