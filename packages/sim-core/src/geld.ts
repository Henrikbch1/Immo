/** Geld als Integer-Cent, Zinssätze in Basispunkten (ADR 0003, 04 §3.1). */
export type Cents = number & { readonly __brand: 'Cents' };
/** Basispunkte: 1 bp = 0,01 %; 400 bp = 4 %. */
export type Bp = number & { readonly __brand: 'Bp' };

const CENT_PRO_EURO = 100;
const BP_PRO_EINS = 10_000;

export function cents(wert: number): Cents {
  if (!Number.isSafeInteger(wert)) throw new RangeError(`Kein ganzzahliger Centbetrag: ${wert}`);
  return wert as Cents;
}

/** Euro-Betrag → Cent (kaufmännisch gerundet). */
export function eur(euro: number): Cents {
  return cents(roundHalfAwayFromZero(euro * CENT_PRO_EURO));
}

export function bp(wert: number): Bp {
  if (!Number.isSafeInteger(wert)) throw new RangeError(`Keine ganzzahligen Basispunkte: ${wert}`);
  return wert as Bp;
}

/** Prozent → Basispunkte, z. B. 3,9 → 390. */
export function prozent(p: number): Bp {
  return bp(roundHalfAwayFromZero(p * CENT_PRO_EURO));
}

/** Basispunkte als Dezimalsatz (400 → 0,04). Nur für Zwischenrechnungen. */
export function bpAlsSatz(b: Bp): number {
  return b / BP_PRO_EINS;
}

/** Kaufmännisch runden: 0,5 → 1, −0,5 → −1. */
export function roundHalfAwayFromZero(x: number): number {
  const r = Math.round(Math.abs(x));
  return x < 0 ? -r : r;
}

/** Auf volle Euro abrunden (Cent-Betrag), z. B. für das zu versteuernde Einkommen. */
export function floorToEuro(c: Cents): Cents {
  return cents(Math.floor(c / CENT_PRO_EURO) * CENT_PRO_EURO);
}

export function summe(...werte: Cents[]): Cents {
  let s = 0;
  for (const w of werte) s += w;
  return cents(s);
}

/** Betrag × Satz in Basispunkten, an der Buchungsstelle auf Cent gerundet. */
export function anteil(betrag: Cents, satz: Bp): Cents {
  return cents(roundHalfAwayFromZero((betrag * satz) / BP_PRO_EINS));
}
