/**
 * Annuitätendarlehen (research/10 §1.6, K20–K24): monatlich nachschüssige Verrechnung, Geld in Cent,
 * Zinsen in Basispunkten. Gerundet wird an den Buchungsstellen Zins und Rate (kaufmännisch).
 */

import { lnDet } from './detmath.ts';
import { type Bp, bpAlsSatz, type Cents, cents, roundHalfAwayFromZero } from './geld.ts';

const MONATE = 12;
const BP_MONATSNENNER = 10_000 * MONATE;
/** Sicherheitsgrenze für den Tilgungsplan: 100 Jahre. */
const MAX_MONATE = 1200;

export interface DarlehensEingabe {
  betrag: Cents;
  sollzins: Bp;
  anfangstilgung: Bp;
  zinsbindungJahre: number;
  /** Jährliche Sondertilgung, jeweils am Ende eines Darlehensjahres (DESIGN-Vereinfachung). */
  sondertilgungJahr?: Cents;
}

export interface Planzeile {
  /** Laufender Monat ab 1. */
  monat: number;
  zins: Cents;
  tilgung: Cents;
  sondertilgung: Cents;
  /** Gezahlte Rate (Zins + Tilgung), ohne Sondertilgung. */
  rate: Cents;
  restschuld: Cents;
}

export interface Darlehensergebnis {
  monatsrate: Cents;
  jahresrate: Cents;
  plan: Planzeile[];
  zinsbindungMonate: number;
  restschuldEndeZinsbindung: Cents;
  zinsenInZinsbindung: Cents;
  tilgungInZinsbindung: Cents;
  sondertilgungInZinsbindung: Cents;
  /** Monate bis schuldenfrei bei unverändertem Zins; null, wenn die Rate die Zinsen nicht deckt. */
  laufzeitMonate: number | null;
  zinsenGesamt: Cents;
}

/** K21: Monatsrate = Darlehen × (Sollzins + anfängliche Tilgung) / 12. */
export function monatsrate(betrag: Cents, sollzins: Bp, anfangstilgung: Bp): Cents {
  return cents(roundHalfAwayFromZero((betrag * (sollzins + anfangstilgung)) / BP_MONATSNENNER));
}

/** K20: Monatszins auf die Restschuld. */
export function monatszins(restschuld: Cents, sollzins: Bp): Cents {
  return cents(roundHalfAwayFromZero((restschuld * sollzins) / BP_MONATSNENNER));
}

/** K22: vollständiger Tilgungsplan bis schuldenfrei (höchstens 100 Jahre). */
export function berechneDarlehen(e: DarlehensEingabe): Darlehensergebnis {
  if (e.betrag < 0 || e.sollzins < 0 || e.anfangstilgung < 0) throw new RangeError('Negative Eingaben');
  if (!Number.isInteger(e.zinsbindungJahre) || e.zinsbindungJahre < 1) {
    throw new RangeError('Zinsbindung muss eine ganze Zahl ≥ 1 Jahr sein');
  }
  const rate = monatsrate(e.betrag, e.sollzins, e.anfangstilgung);
  const sonder = e.sondertilgungJahr ?? (0 as Cents);
  const zinsbindungMonate = e.zinsbindungJahre * MONATE;
  const plan: Planzeile[] = [];

  let rest: number = e.betrag;
  let zinsenGesamt = 0;
  let zinsenZb = 0;
  let tilgungZb = 0;
  let sonderZb = 0;
  let restZb: number | null = null;
  let laufzeit: number | null = null;

  for (let m = 1; m <= MAX_MONATE && rest > 0; m++) {
    const zins = monatszins(rest as Cents, e.sollzins);
    const tilgung = Math.min(Math.max(rate - zins, 0), rest);
    rest -= tilgung;
    const st = m % MONATE === 0 ? Math.min(sonder, rest) : 0;
    rest -= st;
    plan.push({
      monat: m,
      zins,
      tilgung: tilgung as Cents,
      sondertilgung: st as Cents,
      rate: (zins + tilgung) as Cents,
      restschuld: rest as Cents,
    });
    zinsenGesamt += zins;
    if (m <= zinsbindungMonate) {
      zinsenZb += zins;
      tilgungZb += tilgung;
      sonderZb += st;
    }
    if (m === zinsbindungMonate) restZb = rest;
    if (rest === 0) laufzeit = m;
    if (tilgung === 0 && st === 0 && rest > 0) break; // Rate deckt die Zinsen nicht
  }

  return {
    monatsrate: rate,
    jahresrate: cents(rate * MONATE),
    plan,
    zinsbindungMonate,
    restschuldEndeZinsbindung: cents(restZb ?? 0),
    zinsenInZinsbindung: cents(zinsenZb),
    tilgungInZinsbindung: cents(tilgungZb),
    sondertilgungInZinsbindung: cents(sonderZb),
    laufzeitMonate: laufzeit,
    zinsenGesamt: cents(zinsenGesamt),
  };
}

/** Restschuld bei jährlich nachschüssiger Zahlung (Vergleichsrechnung aus dem Vault, T5). Ungerundet in Euro. */
export function restschuldJaehrlichEuro(
  betragEuro: number,
  sollzins: Bp,
  anfangstilgung: Bp,
  jahre: number,
): number {
  const i = bpAlsSatz(sollzins);
  const annuitaet = betragEuro * (i + bpAlsSatz(anfangstilgung));
  let rest = betragEuro;
  for (let j = 0; j < jahre; j++) rest = rest * (1 + i) - annuitaet;
  return rest;
}

/** K23: Laufzeit in Jahren bis schuldenfrei, jährliche Formel ln(1 + i/t) / ln(1 + i). */
export function laufzeitJahreJaehrlich(sollzins: Bp, anfangstilgung: Bp): number {
  const i = bpAlsSatz(sollzins);
  const t = bpAlsSatz(anfangstilgung);
  return lnDet(1 + i / t) / lnDet(1 + i);
}

/** K23: Laufzeit in Jahren bei monatlicher Verrechnung (geschlossene Form, ungerundet). */
export function laufzeitJahreMonatlich(sollzins: Bp, anfangstilgung: Bp): number {
  const i = bpAlsSatz(sollzins);
  const t = bpAlsSatz(anfangstilgung);
  const r = (i + t) / MONATE; // Rate je 1 € Darlehen
  return lnDet(r / (r - i / MONATE)) / lnDet(1 + i / MONATE) / MONATE;
}

/** K24: Mehrbelastung pro Jahr bei Anschlusszins (gleiche Tilgung), in Cent. */
export function anschlussMehrbelastungJahr(restschuld: Cents, alterZins: Bp, anschlussZins: Bp): Cents {
  return cents(roundHalfAwayFromZero((restschuld * (anschlussZins - alterZins)) / 10_000));
}

export interface Jahreszeile {
  jahr: number;
  zins: Cents;
  tilgung: Cents;
  sondertilgung: Cents;
  restschuld: Cents;
}

/** Tilgungsplan zu Darlehensjahren zusammenfassen (Summen, Restschuld am Jahresende). */
export function jahresuebersicht(plan: readonly Planzeile[]): Jahreszeile[] {
  const jahre: Jahreszeile[] = [];
  for (const z of plan) {
    const j = Math.ceil(z.monat / MONATE);
    let zeile = jahre[j - 1];
    if (!zeile) {
      zeile = {
        jahr: j,
        zins: cents(0),
        tilgung: cents(0),
        sondertilgung: cents(0),
        restschuld: z.restschuld,
      };
      jahre.push(zeile);
    }
    zeile.zins = cents(zeile.zins + z.zins);
    zeile.tilgung = cents(zeile.tilgung + z.tilgung);
    zeile.sondertilgung = cents(zeile.sondertilgung + z.sondertilgung);
    zeile.restschuld = z.restschuld;
  }
  return jahre;
}
