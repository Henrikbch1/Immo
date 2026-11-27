/** Absoluter Monatsindex ab Januar 2000 (0 = 2000-01). Keine Date-Objekte im Kern (04 §3.3). */
export type MonthIndex = number & { readonly __brand: 'MonthIndex' };

const BASISJAHR = 2000;
const MONATE_PRO_JAHR = 12;

export function monthIndex(jahr: number, monat: number): MonthIndex {
  if (!Number.isInteger(jahr) || !Number.isInteger(monat) || monat < 1 || monat > MONATE_PRO_JAHR) {
    throw new RangeError(`Ungültiger Monat: ${jahr}-${monat}`);
  }
  return ((jahr - BASISJAHR) * MONATE_PRO_JAHR + (monat - 1)) as MonthIndex;
}

export function jahrVon(m: MonthIndex): number {
  return BASISJAHR + Math.floor(m / MONATE_PRO_JAHR);
}

/** Kalendermonat 1–12. */
export function monatVon(m: MonthIndex): number {
  return (((m % MONATE_PRO_JAHR) + MONATE_PRO_JAHR) % MONATE_PRO_JAHR) + 1;
}

export function quartalVon(m: MonthIndex): 1 | 2 | 3 | 4 {
  return (Math.floor((monatVon(m) - 1) / 3) + 1) as 1 | 2 | 3 | 4;
}

export function plusMonate(m: MonthIndex, n: number): MonthIndex {
  return (m + n) as MonthIndex;
}

/** ISO-Schlüssel `JJJJ-MM`, z. B. für Routen (`/monatsbericht/2026-12`). */
export function monatsSchluessel(m: MonthIndex): string {
  return `${jahrVon(m)}-${String(monatVon(m)).padStart(2, '0')}`;
}
