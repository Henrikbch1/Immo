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

/**
 * Deutsche Zahleneingabe → Zahl: „300.000“, „4,5“, „1.234,56 €“, „2 %“. Ungültig → null.
 * Punkte sind Tausendertrenner, das Komma ist das Dezimalzeichen.
 */
export function parseDeZahl(eingabe: string): number | null {
  const s = eingabe.replace(/[\s\u00A0€%]/g, '');
  if (!/^-?(\d{1,3}(\.\d{3})+|\d+)(,\d+)?$/.test(s)) return null;
  return Number(s.replace(/\./g, '').replace(',', '.'));
}

/** Monate → „34 Jahre 9 Monate“. */
export function formatJahreMonate(monate: number): string {
  const j = Math.floor(monate / 12);
  const m = monate % 12;
  const teile: string[] = [];
  if (j > 0) teile.push(`${j}${NBSP}${j === 1 ? 'Jahr' : 'Jahre'}`);
  if (m > 0 || j === 0) teile.push(`${m}${NBSP}${m === 1 ? 'Monat' : 'Monate'}`);
  return teile.join(' ');
}
