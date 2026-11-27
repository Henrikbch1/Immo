/**
 * Texte zu Kennzahl-Schlüsseln (03 §3.1: der Rechenkern liefert Schlüssel, die UI formuliert).
 * Ebene 1 = Titel + ein Satz mit echten Zahlen; Posten-Namen für Ebene 2; Vereinfachungen für Ebene 3.
 */
import {
  ALLE_PARAMETER,
  type Kennzahl,
  type KennzahlEinheit,
  type ParameterId,
  type Zeitbezug,
} from '@immo/sim-core';
import { formatEuro, formatProzentAusBp, formatZahl } from '@immo/ui';

const NBSP = ' ';

export function formatWert(wert: number, einheit: KennzahlEinheit): string {
  switch (einheit) {
    case 'EUR':
      return formatEuro(wert);
    case 'BP':
      return formatProzentAusBp(wert, 2);
    case 'FAKTOR':
      return formatZahl(wert, 2);
    case 'EUR_JE_M2':
      return `${formatEuro(wert)}/m²`;
    case 'M2':
      return `${formatZahl(wert, Number.isInteger(wert) ? 0 : 1)}${NBSP}m²`;
    case 'JAHRE':
      return `${formatZahl(wert)}${NBSP}Jahre`;
    case 'ANZAHL':
      return formatZahl(wert);
  }
}

export const ZEITBEZUG: Record<Zeitbezug, string> = {
  MONAT: 'pro Monat',
  JAHR: 'pro Jahr',
  EINMALIG: 'einmalig',
};

type Satz = (k: Kennzahl, alle: Readonly<Record<string, Kennzahl>>) => string;

const w = (k: Kennzahl | undefined) => (k ? formatWert(k.wert, k.einheit) : '–');

export const KENNZAHL_TEXTE: Record<string, { titel: string; satz: Satz }> = {
  'knk.grestBasis': {
    titel: 'Bemessungsgrundlage Grunderwerbsteuer',
    satz: (k) =>
      `Die Grunderwerbsteuer wird auf ${w(k)} berechnet – Kaufpreis ohne separat bezahltes Inventar.`,
  },
  'knk.grest': {
    titel: 'Grunderwerbsteuer',
    satz: (k) =>
      `Das Bundesland des Grundstücks verlangt ${w(k)} Grunderwerbsteuer; abgerundet auf volle Euro.`,
  },
  'knk.notarGrundbuch': {
    titel: 'Notar und Grundbuch',
    satz: (k) => `Für Beurkundung und Grundbucheintrag planst du pauschal ${w(k)} ein.`,
  },
  'knk.makler': {
    titel: 'Maklerprovision (dein Anteil)',
    satz: (k) => (k.wert > 0 ? `Für den Makler zahlst du ${w(k)}.` : 'Ohne Makler fällt keine Provision an.'),
  },
  'knk.summe': {
    titel: 'Kaufnebenkosten',
    satz: (k) =>
      `Zusätzlich zum Kaufpreis zahlst du ${w(k)} – meist aus Eigenkapital, weil kein Gegenwert entsteht.`,
  },
  'miete.jahr': {
    titel: 'Jahresnettokaltmiete',
    satz: (k) => `Im Jahr nimmst du ${w(k)} Kaltmiete ein, wenn die Wohnung durchgehend vermietet ist.`,
  },
  'rendite.brutto': {
    titel: 'Bruttomietrendite',
    satz: (k) =>
      `Die Jahreskaltmiete beträgt ${w(k)} des Kaufpreises – ein Erstfilter ohne Nebenkosten, Kosten und Finanzierung.`,
  },
  'rendite.faktor': {
    titel: 'Kaufpreisfaktor',
    satz: (k) => `Der Kaufpreis entspricht ${w(k)} Jahreskaltmieten. Das ist keine Amortisationsdauer.`,
  },
  'objekt.preisJeM2': {
    titel: 'Kaufpreis je m²',
    satz: (k) => `Du zahlst ${w(k)} Wohnfläche.`,
  },
  'miete.jeM2': {
    titel: 'Kaltmiete je m²',
    satz: (k) => `Die Miete liegt bei ${w(k)} im Monat – vergleiche sie mit dem örtlichen Mietspiegel.`,
  },
  'kauf.gesamtkosten': {
    titel: 'Gesamtkaufkosten',
    satz: (k) => `Insgesamt kostet dich der Erwerb ${w(k)}: Kaufpreis plus Kaufnebenkosten.`,
  },
  'kauf.darlehen': {
    titel: 'Darlehen',
    satz: (k) => `Was dein Eigenkapital nicht deckt, leihst du bei der Bank: ${w(k)}.`,
  },
  'kauf.finanzierungsquote': {
    titel: 'Finanzierungsquote',
    satz: (k) => `Das Darlehen entspricht ${w(k)} des Kaufpreises (Kaufpreis ohne Nebenkosten).`,
  },
  'kosten.nichtUmlagefaehigJahr': {
    titel: 'Nicht umlagefähige Kosten',
    satz: (k) => `Diese ${w(k)} im Jahr trägst du selbst; der Mieter zahlt sie nicht über die Nebenkosten.`,
  },
  'reserve.instandhaltungSatz': {
    titel: 'Instandhaltungssatz je m²',
    satz: (k) => `Nach Gebäudealter setzt die Orientierungstabelle ${w(k)} im Jahr an.`,
  },
  'reserve.instandhaltungJahr': {
    titel: 'Instandhaltungsreserve',
    satz: (k) =>
      `Für Reparaturen legst du rechnerisch ${w(k)} im Jahr zurück. Bezahlt ist damit noch nichts.`,
  },
  'reserve.mietausfallJahr': {
    titel: 'Mietausfallreserve',
    satz: (k) => `Für Leerstand und Zahlungsausfall legst du ${w(k)} im Jahr zurück.`,
  },
  'reserve.summeJahr': {
    titel: 'Rücklagen',
    satz: (k) => `Zusammen legst du ${w(k)} im Jahr für Instandhaltung und Mietausfall zurück.`,
  },
  'rendite.netto': {
    titel: 'Nettomietrendite',
    satz: (k) =>
      `Nach nicht umlagefähigen Kosten und bezogen auf die Gesamtkaufkosten bringt das Objekt ${w(k)} im Jahr.`,
  },
  'darlehen.zinsJahr1': {
    titel: 'Zinsen im ersten Jahr',
    satz: (k) => `In den ersten zwölf Raten zahlst du ${w(k)} Zinsen an die Bank.`,
  },
  'darlehen.tilgungJahr1': {
    titel: 'Tilgung im ersten Jahr',
    satz: (k) =>
      `Mit den ersten zwölf Raten zahlst du ${w(k)} vom Darlehen zurück – das bleibt dein Vermögen.`,
  },
  'cf.operativ': {
    titel: 'Operativer Cashflow',
    satz: (k) => `Aus eigener Kraft erwirtschaftet das Objekt ${w(k)} im Jahr, noch ohne Bankrate.`,
  },
  'cf.nachFinanzierung': {
    titel: 'Cashflow nach Finanzierung',
    satz: (k) =>
      k.wert >= 0
        ? `Nach Zins und Tilgung bleiben dir ${w(k)} im Jahr (${formatEuro(Math.round(k.wert / 12))} im Monat).`
        : `Nach Zins und Tilgung legst du ${formatEuro(-k.wert)} im Jahr dazu (${formatEuro(Math.round(-k.wert / 12))} im Monat).`,
  },
  'cf.liquiditaetNachRuecklagen': {
    titel: 'Liquidität nach Rücklagen',
    satz: (k, alle) =>
      `Ziehst du zusätzlich die Rücklagen (${w(alle['reserve.summeJahr'])}) ab, ${
        k.wert >= 0 ? `bleiben ${w(k)}` : `fehlen ${formatEuro(-k.wert)}`
      } im Jahr.`,
  },
};

/** Namen der Blatt-Posten (Eingaben). */
export const EINGABE_TEXTE: Record<string, string> = {
  kaufpreis: 'Kaufpreis',
  inventarSeparat: 'Inventar mit eigenem Preis',
  maklerSatz: 'Maklersatz (deine Eingabe)',
  notarSatz: 'Notar-/Grundbuchsatz (deine Eingabe)',
  mieteMonat: 'Nettokaltmiete pro Monat',
  monate: 'Monate',
  flaeche: 'Wohnfläche',
  nichtUmlagefaehigMonat: 'Nicht umlagefähig pro Monat (Hausgeldanteil + Sonstiges)',
  eigenkapital: 'Eingesetztes Eigenkapital',
  zinsenMonate1bis12: 'Summe der Zinsanteile, Raten 1–12',
  tilgungMonate1bis12: 'Summe der Tilgungsanteile, Raten 1–12',
  mietausfallJahr: 'Tatsächlicher Mietausfall',
  mietausfallQuote: 'Mietausfallquote (deine Eingabe)',
  zinsJahr: 'Zinsen',
  tilgungJahr: 'Tilgung',
  darlehen: 'Darlehen',
  renovierung: 'Anfangsrenovierung',
  puffer: 'Liquiditätspuffer',
};

export const VEREINFACHUNG_TEXTE: Record<string, string> = {
  notarPauschale:
    'Vereinfachung im Spiel: Notar und Grundbuch als Pauschale; tatsächlich sind die Gebühren gestaffelt, die Grundschuld kostet extra.',
  iiBvOrientierung:
    'Vereinfachung im Spiel: Die Sätze der II. Berechnungsverordnung gelten rechtlich nur für preisgebundenen Wohnraum und dienen hier als Orientierung.',
  ersterJahrKapitaldienst:
    'Vereinfachung im Spiel: Zins und Tilgung des ersten Darlehensjahres; in späteren Jahren sinkt der Zinsanteil.',
  steuerNaeherung:
    'Vereinfachung im Spiel: Steuer als Grenzsteuersatz × Ergebnis, ohne Soli und Kirchensteuer.',
};

export function titelVon(schluessel: string): string {
  if (schluessel.startsWith('eingabe.')) {
    const name = schluessel.slice('eingabe.'.length);
    return EINGABE_TEXTE[name] ?? name;
  }
  if (schluessel.startsWith('param.')) {
    const id = schluessel.slice('param.'.length) as ParameterId;
    return ALLE_PARAMETER[id]?.titel ?? id;
  }
  return KENNZAHL_TEXTE[schluessel]?.titel ?? schluessel;
}
