/**
 * Zentrale Formatierung de-DE (K-01, 03 §5.1). Zahlen nie direkt mit toLocaleString formatieren.
 * Zwischen Zahl und Einheit steht ein geschütztes Leerzeichen (U+00A0).
 */
const NBSP = ' ';

const euroFmt = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });
const euroGanzFmt = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});
const monatFmt = new Intl.DateTimeFormat('de-DE', { month: 'short', year: 'numeric', timeZone: 'UTC' });

/** Betrag in Cent → „1.234,56 €“. */
export function formatEuro(cents: number, opts: { ganz?: boolean } = {}): string {
  const fmt = opts.ganz ? euroGanzFmt : euroFmt;
  return fmt.format(cents / 100).replace(/\s/g, NBSP);
}

/** Zahl mit fester Nachkommazahl → „1.234,5“. */
export function formatZahl(wert: number, nachkomma = 0): string {
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: nachkomma,
    maximumFractionDigits: nachkomma,
  }).format(wert);
}

/** Basispunkte → Prozent, z. B. 400 → „4,00 %“. */
export function formatProzentAusBp(bp: number, nachkomma = 2): string {
  return `${formatZahl(bp / 100, nachkomma)}${NBSP}%`;
}

/** Jahr/Monat → „Nov. 2026“. */
export function formatMonat(jahr: number, monat: number): string {
  return monatFmt.format(Date.UTC(jahr, monat - 1, 1));
}
