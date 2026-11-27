/**
 * Datenvertrag für Kennzahlen mit Rechenweg (03 §3.1 O-01, 04 §3.3 `explain`).
 * Der Kern liefert nur Schlüssel, Werte, Parameter-IDs und Status – Texte formuliert die UI.
 */
import { roundHalfAwayFromZero } from './geld.ts';
import { ALLE_PARAMETER, type ParameterId, type ParameterStatus } from './parameter.ts';

/** EUR in Cent · BP Basispunkte (darf Nachkommastellen haben) · FAKTOR dimensionslos · ANZAHL z. B. 12 Monate. */
export type KennzahlEinheit = 'EUR' | 'BP' | 'FAKTOR' | 'EUR_JE_M2' | 'M2' | 'JAHRE' | 'ANZAHL';
export type Zeitbezug = 'MONAT' | 'JAHR' | 'EINMALIG';

/**
 * Rechenart der Herleitung:
 * - `summe`: Σ (+/−) der Posten
 * - `produkt`: Π der Posten (Basispunkt-Posten zählen als Satz, also ÷ 10.000)
 * - `quotient`: Σ (+/−) der Posten ÷ Π der Teiler-Posten; Ergebnis in Einheit der Kennzahl
 */
export type Rechenart = 'summe' | 'produkt' | 'quotient';
export type Rundung = 'keine' | 'cent' | 'euroAb';
export type Operator = '+' | '−' | '×' | '÷';

export interface Posten {
  /** Verweist auf eine Kennzahl im selben Ergebnis (verschachtelt antippbar), eine Eingabe (`eingabe.*`)
   *  oder eine Konstante (`konst.*`). */
  schluessel: string;
  op: Operator;
  wert: number;
  einheit: KennzahlEinheit;
  parameter?: ParameterId;
}

export interface Kennzahl {
  schluessel: string;
  wert: number;
  einheit: KennzahlEinheit;
  zeitbezug: Zeitbezug;
  status: ParameterStatus;
  /** Mindestens eine Eingangsgröße ist GESCHÄTZT. */
  enthaeltSchaetzung: boolean;
  rechenart: Rechenart;
  rundung: Rundung;
  herleitung: Posten[];
  /** Alle direkt verwendeten Parameter-IDs (Status/Quelle über die Registry). */
  parameter: ParameterId[];
  /** Schlüssel von Vereinfachungen (Text in der UI). */
  vereinfachungen: string[];
}

const BP_PRO_EINS = 10_000;

function runde(x: number, r: Rundung): number {
  if (r === 'cent') return roundHalfAwayFromZero(x);
  if (r === 'euroAb') return Math.floor(x / 100) * 100;
  return x;
}

/** Rechnet den Wert aus der Herleitung nach (Tracer = Direktergebnis, AK-O01-2). */
export function werteHerleitungAus(
  rechenart: Rechenart,
  herleitung: Posten[],
  einheit: KennzahlEinheit,
  rundung: Rundung,
): number {
  let wert: number;
  if (rechenart === 'summe') {
    wert = 0;
    for (const p of herleitung) wert += p.op === '−' ? -p.wert : p.wert;
  } else if (rechenart === 'produkt') {
    // Erst ganzzahlig multiplizieren, dann einmal durch 10.000 je Satz teilen (exakt für Cent × bp).
    wert = 1;
    let teiler = 1;
    for (const p of herleitung) {
      wert *= p.wert;
      if (p.einheit === 'BP') teiler *= BP_PRO_EINS;
    }
    wert /= teiler;
  } else {
    let zaehler = 0;
    let nenner = 1;
    for (const p of herleitung) {
      if (p.op === '÷') nenner *= p.wert;
      else zaehler += p.op === '−' ? -p.wert : p.wert;
    }
    wert = nenner === 0 ? 0 : zaehler / nenner;
    if (einheit === 'BP') wert *= BP_PRO_EINS;
  }
  return runde(wert, rundung);
}

/** Baut eine abgeleitete Kennzahl; Wert wird aus der Herleitung gerechnet, damit beide nie auseinanderlaufen. */
export function abgeleitet(a: {
  schluessel: string;
  einheit: KennzahlEinheit;
  zeitbezug: Zeitbezug;
  rechenart: Rechenart;
  rundung?: Rundung;
  herleitung: Posten[];
  /** Kennzahlen, aus denen Posten stammen (für die Schätz-Markierung). */
  aus?: Kennzahl[];
  vereinfachungen?: string[];
}): Kennzahl {
  const rundung = a.rundung ?? 'keine';
  const parameter = a.herleitung.flatMap((p) => (p.parameter ? [p.parameter] : []));
  const enthaeltSchaetzung =
    parameter.some((id) => ALLE_PARAMETER[id].status === 'GESCHÄTZT') ||
    (a.aus ?? []).some((k) => k.enthaeltSchaetzung);
  return {
    schluessel: a.schluessel,
    wert: werteHerleitungAus(a.rechenart, a.herleitung, a.einheit, rundung),
    einheit: a.einheit,
    zeitbezug: a.zeitbezug,
    status: 'ABGELEITET',
    enthaeltSchaetzung,
    rechenart: a.rechenart,
    rundung,
    herleitung: a.herleitung,
    parameter,
    vereinfachungen: a.vereinfachungen ?? [],
  };
}

/** Posten aus einer vorhandenen Kennzahl (verschachtelbar). */
export function aus(k: Kennzahl, op: Operator = '+'): Posten {
  return { schluessel: k.schluessel, op, wert: k.wert, einheit: k.einheit };
}

/** Posten aus einem Registry-Parameter. */
export function ausParameter(id: ParameterId, op: Operator = '×'): Posten {
  const p = ALLE_PARAMETER[id];
  const einheit: KennzahlEinheit = p.einheit === 'bp' ? 'BP' : p.einheit === 'cent' ? 'EUR' : 'ANZAHL';
  return { schluessel: `param.${id}`, op, wert: p.wert, einheit, parameter: id };
}

/** Posten aus einer Eingabe. */
export function eingabe(name: string, wert: number, einheit: KennzahlEinheit, op: Operator = '+'): Posten {
  return { schluessel: `eingabe.${name}`, op, wert, einheit };
}

/** Rechenweg einer Kennzahl aus einem Ergebnis (04 §3.3 `explain(state, metricRef)`). */
export function explain(kennzahlen: Readonly<Record<string, Kennzahl>>, schluessel: string): Kennzahl | null {
  return kennzahlen[schluessel] ?? null;
}
