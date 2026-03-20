/**
 * utils.js – Hilfsfunktionen für IMMOPATH
 * Enthält: clamp, rnd, EUR-Formatter, uuid, Datumshelfer
 */

/**
 * Begrenzt einen Wert auf [min, max].
 * @param {number} val
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}

/**
 * Zufallszahl im Bereich [min, max].
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function rnd(min, max) {
  return min + Math.random() * (max - min);
}

/**
 * Zufälliger ganzzahliger Wert im Bereich [min, max] (inklusiv).
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function rndInt(min, max) {
  return Math.floor(rnd(min, max + 1));
}

/**
 * Formatiert eine Zahl als EUR-Betrag (de-DE).
 * @param {number} value
 * @param {number} [fractionDigits=0]
 * @returns {string}
 */
export function formatEUR(value, fractionDigits = 0) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

/**
 * Formatiert eine Zahl als Prozentzahl (de-DE).
 * @param {number} value  – als Dezimal, z.B. 0.045
 * @param {number} [fractionDigits=1]
 * @returns {string}
 */
export function formatPct(value, fractionDigits = 1) {
  return new Intl.NumberFormat('de-DE', {
    style: 'percent',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

/**
 * Erzeugt eine einfache UUID v4 (kryptographisch hinreichend für Spielzwecke).
 * @returns {string}
 */
export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replaceAll(/[xy]/g, (c) => {
    const r = Math.trunc(Math.random() * 16);
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Gibt das aktuelle ISO-Datum als String "YYYY-MM-DD" zurück.
 * @param {Date} date
 * @returns {string}
 */
export function toISO(date) {
  return date.toISOString().slice(0, 10);
}

/**
 * Parst einen ISO-Datums-String "YYYY-MM-DD" zu einem Date-Objekt.
 * @param {string} iso
 * @returns {Date}
 */
export function fromISO(iso) {
  // Verwende UTC, um Zeitzone-Probleme zu vermeiden
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/**
 * Addiert eine Anzahl Tage zu einem Datum.
 * @param {Date} date
 * @param {number} days
 * @returns {Date}
 */
export function addDays(date, days) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

/**
 * Gibt Jahr und Monat (1-basiert) eines Datums zurück.
 * @param {Date} date
 * @returns {{ year: number, month: number }}
 */
export function yearMonth(date) {
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1 };
}

/**
 * Prüft ob zwei Daten im gleichen Monat liegen (UTC).
 * @param {Date} a
 * @param {Date} b
 * @returns {boolean}
 */
export function sameMonth(a, b) {
  return a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth();
}

/**
 * Formatiert ein Datum als lokalisierter String (de-DE).
 * @param {string} iso
 * @returns {string}
 */
export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * Kurzformat: "Jan 2026"
 * @param {string} iso
 * @returns {string}
 */
export function formatDateShort(iso) {
  return new Date(iso).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });
}



