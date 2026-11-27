/** Parameter-Registry (ADR 0009, 04 §3.4): jede Fachzahl mit Status, Quelle und Stand. */
export type ParameterStatus = 'BELEGT' | 'ABGELEITET' | 'GESCHÄTZT' | 'DESIGN';

export interface Parameter<T = number> {
  id: string;
  titel: string;
  wert: T;
  einheit: 'bp' | 'cent' | 'jahre' | 'monate' | 'anteil' | 'text';
  status: ParameterStatus;
  /** Vault-Notiz oder Recherche-Dokument, z. B. „[[Zins]]“. */
  quelle: string;
  /** Inhaltlicher Stand, z. B. „2026-09-30“. */
  stand: string;
  gueltigAb?: string;
  gueltigBis?: string;
  hinweis?: string;
}

/** Regelstand der Spieldaten (rulesVersion). */
export const RULES_VERSION = 'de-2026.1';

export const PARAMETER = {
  'darlehen.sollzins.beispiel2026': {
    id: 'darlehen.sollzins.beispiel2026',
    titel: 'Beispiel-Sollzins 10 Jahre Zinsbindung',
    wert: 400,
    einheit: 'bp',
    status: 'GESCHÄTZT',
    quelle: '[[Zins]] (Marktbeobachtung 3,9–4,5 % effektiv, Sicherheit B)',
    stand: '2026-09-30',
    hinweis: 'Mitte der beobachteten Spanne; Sollzins ≈ Effektivzins angenommen (keine Kreditnebenkosten).',
  },
  'darlehen.anfangstilgung.standard': {
    id: 'darlehen.anfangstilgung.standard',
    titel: 'Anfängliche Tilgung (Voreinstellung)',
    wert: 200,
    einheit: 'bp',
    status: 'DESIGN',
    quelle: '[[Annuitaet]] (Beispiele mit 2 % Tilgung)',
    stand: '2020-11',
  },
  'darlehen.zinsbindung.standard': {
    id: 'darlehen.zinsbindung.standard',
    titel: 'Zinsbindung (Voreinstellung)',
    wert: 10,
    einheit: 'jahre',
    status: 'DESIGN',
    quelle: '[[Zins]] (Marktbeobachtung für 10 Jahre Zinsbindung)',
    stand: '2026-09-30',
  },
  'darlehen.verrechnung': {
    id: 'darlehen.verrechnung',
    titel: 'Zinsverrechnung monatlich nachschüssig',
    wert: 12,
    einheit: 'monate',
    status: 'BELEGT',
    quelle: '[[Annuitaet]], [[Tilgung]] (Tilgungsplan mit monatlicher Verrechnung)',
    stand: '2020-11',
  },
  'darlehen.sondertilgung.zeitpunkt': {
    id: 'darlehen.sondertilgung.zeitpunkt',
    titel: 'Sondertilgung jeweils am Ende eines Darlehensjahres',
    wert: 12,
    einheit: 'monate',
    status: 'DESIGN',
    quelle: 'Vereinfachung im Spiel; vertragliche Sondertilgungsrechte sind institutsabhängig',
    stand: '2026-11-27',
  },
} as const satisfies Record<string, Parameter>;

/** Bundesländer (ISO-3166-2-Kürzel ohne „DE-“). */
export const BUNDESLAENDER = [
  'BW',
  'BY',
  'BE',
  'BB',
  'HB',
  'HH',
  'HE',
  'MV',
  'NI',
  'NW',
  'RP',
  'SL',
  'SN',
  'ST',
  'SH',
  'TH',
] as const;
export type Bundesland = (typeof BUNDESLAENDER)[number];

const GREST_QUELLE_VAULT = '[[Regionale-Rechtsmatrix]], [[Kaufnebenkosten]] (Vault, Stand 2026-09-30)';
const GREST_OFFEN = 'Landesgesetz noch nicht im Wortlaut geprüft (LR-09); Satz am Tag des Erwerbsvorgangs.';

function grest(land: Bundesland, wert: number, extra: Partial<Parameter> = {}): Parameter {
  return {
    id: `knk.grest.${land}`,
    titel: `Grunderwerbsteuersatz ${land}`,
    wert,
    einheit: 'bp',
    status: 'GESCHÄTZT',
    quelle: GREST_QUELLE_VAULT,
    stand: '2026-09-30',
    hinweis: GREST_OFFEN,
    ...extra,
  };
}

/**
 * Grunderwerbsteuer je Land (research/10 K05, 02 §2.5, Primärprüfung research/25 §6).
 * NW ist gegen den Gesetzestext geprüft (BELEGT); NI und HB nur Sicherheit B → bis zur Primärquelle GESCHÄTZT.
 */
export const GREST_PARAMETER: Record<`knk.grest.${Bundesland}`, Parameter> = {
  'knk.grest.BW': grest('BW', 500),
  'knk.grest.BY': grest('BY', 350, { hinweis: `Bundessatz § 11 Abs. 1 GrEStG. ${GREST_OFFEN}` }),
  'knk.grest.BE': grest('BE', 600),
  'knk.grest.BB': grest('BB', 650),
  'knk.grest.HB': grest('HB', 550, {
    quelle: 'research/25 §6: Brem.GBl. 2025 Nr. 9 (Gesetz vom 22.01.2025), Sicherheit B',
    stand: '2026-11-27',
    gueltigAb: '2025-07-01',
    hinweis: 'Für Erwerbsvorgänge ab 01.07.2025 (vorher 5,0 %). Gesetzblatt nicht im Wortlaut geöffnet.',
  }),
  'knk.grest.HH': grest('HH', 550),
  'knk.grest.HE': grest('HE', 600),
  'knk.grest.MV': grest('MV', 600),
  'knk.grest.NI': grest('NI', 500, {
    quelle: 'research/25 §6: Haushaltsbegleitgesetz 2014 (lt. PwC), Sicherheit B/C',
    stand: '2026-11-27',
    gueltigAb: '2014-01-01',
    hinweis: 'Gesetzestext nicht gefunden, Fundstelle uneinheitlich (LR-09).',
  }),
  'knk.grest.NW': grest('NW', 650, {
    status: 'BELEGT',
    quelle:
      'Gesetz über die Festsetzung des Steuersatzes für die Grunderwerbsteuer NRW, § 1 Abs. 1 (GV. NRW. 2014 S. 954)',
    stand: '2026-11-27',
    gueltigAb: '2015-01-01',
    hinweis: 'Gesetzestext gelesen (research/25 §6, Sicherheit A).',
  }),
  'knk.grest.RP': grest('RP', 500),
  'knk.grest.SL': grest('SL', 650),
  'knk.grest.SN': grest('SN', 550),
  'knk.grest.ST': grest('ST', 500),
  'knk.grest.SH': grest('SH', 650),
  'knk.grest.TH': grest('TH', 500, { gueltigAb: '2024-01-01' }),
};

/** Kaufnebenkosten, laufende Kosten, Reserven und Bierdeckel (research/10 K05–K14, 02 §2.5). */
export const KALKULATION_PARAMETER = {
  'knk.notarGrundbuch': {
    id: 'knk.notarGrundbuch',
    titel: 'Notar und Grundbuch (Pauschale)',
    wert: 200,
    einheit: 'bp',
    status: 'GESCHÄTZT',
    quelle: '[[Kaufnebenkosten]], [[Prozess-Haushaltsplan-und-Vermoegensaufstellung]] („rund 2 %“)',
    stand: '2026-09-30',
    hinweis: 'Gebühren sind tatsächlich gestaffelt (GNotKG, LR-10); Grundschuldeintragung nicht enthalten.',
  },
  'knk.makler.kaeuferSatz': {
    id: 'knk.makler.kaeuferSatz',
    titel: 'Maklerprovision Käuferanteil (Voreinstellung)',
    wert: 357,
    einheit: 'bp',
    status: 'GESCHÄTZT',
    quelle: '02 §2.5 (ETW/EFH oft 3,57 % inkl. MwSt. bei Halbteilung, § 656c BGB)',
    stand: '2026-11-27',
    hinweis:
      'Kein Satz im Vault (LR-11). Halbteilung gilt nur für Wohnung/EFH an Verbraucher, nicht für MFH.',
  },
  'kalk.mietausfall.quote': {
    id: 'kalk.mietausfall.quote',
    titel: 'Mietausfallreserve (Anteil der Nettokaltmiete)',
    wert: 300,
    einheit: 'bp',
    status: 'GESCHÄTZT',
    quelle: '[[Mietausfallreserve]] („3 % der Kaltmiete“, Stand 2020-12)',
    stand: '2020-12',
    hinweis: 'Faustregel, lage- und objektabhängig.',
  },
  'kalk.instandhaltung.iiBv.unter22': {
    id: 'kalk.instandhaltung.iiBv.unter22',
    titel: 'Instandhaltung je m² und Jahr (II. BV, jünger als 22 Jahre)',
    wert: 1150,
    einheit: 'cent',
    status: 'BELEGT',
    quelle: '[[Instandhaltungsplanung]], § 28 Abs. 2 II. BV',
    stand: '2026-09-30',
    gueltigAb: '2026-01-01',
    hinweis: 'Gilt rechtlich nur für preisgebundenen Wohnraum; im Spiel als Orientierungswert.',
  },
  'kalk.instandhaltung.iiBv.unter32': {
    id: 'kalk.instandhaltung.iiBv.unter32',
    titel: 'Instandhaltung je m² und Jahr (II. BV, 22 bis 31 Jahre)',
    wert: 1458,
    einheit: 'cent',
    status: 'BELEGT',
    quelle: '[[Instandhaltungsplanung]], § 28 Abs. 2 II. BV',
    stand: '2026-09-30',
    gueltigAb: '2026-01-01',
    hinweis: 'Gilt rechtlich nur für preisgebundenen Wohnraum; im Spiel als Orientierungswert.',
  },
  'kalk.instandhaltung.iiBv.ab32': {
    id: 'kalk.instandhaltung.iiBv.ab32',
    titel: 'Instandhaltung je m² und Jahr (II. BV, ab 32 Jahre)',
    wert: 1862,
    einheit: 'cent',
    status: 'BELEGT',
    quelle: '[[Instandhaltungsplanung]], § 28 Abs. 2 II. BV',
    stand: '2026-09-30',
    gueltigAb: '2026-01-01',
    hinweis: 'Gilt rechtlich nur für preisgebundenen Wohnraum; im Spiel als Orientierungswert.',
  },
  'kalk.instandhaltung.iiBv.aufzug': {
    id: 'kalk.instandhaltung.iiBv.aufzug',
    titel: 'Zuschlag Aufzug je m² und Jahr (II. BV)',
    wert: 163,
    einheit: 'cent',
    status: 'BELEGT',
    quelle: '[[Instandhaltungsplanung]], § 28 Abs. 2 II. BV',
    stand: '2026-09-30',
    gueltigAb: '2026-01-01',
  },
  'kalk.instandhaltung.iiBv.grenze1': {
    id: 'kalk.instandhaltung.iiBv.grenze1',
    titel: 'Altersgrenze 1 der II.-BV-Staffel',
    wert: 22,
    einheit: 'jahre',
    status: 'BELEGT',
    quelle: '§ 28 Abs. 2 II. BV',
    stand: '2026-09-30',
  },
  'kalk.instandhaltung.iiBv.grenze2': {
    id: 'kalk.instandhaltung.iiBv.grenze2',
    titel: 'Altersgrenze 2 der II.-BV-Staffel',
    wert: 32,
    einheit: 'jahre',
    status: 'BELEGT',
    quelle: '§ 28 Abs. 2 II. BV',
    stand: '2026-09-30',
  },
  'kalk.rechenjahr': {
    id: 'kalk.rechenjahr',
    titel: 'Bezugsjahr für das Gebäudealter',
    wert: 2026,
    einheit: 'jahre',
    status: 'DESIGN',
    quelle: 'Regelstand de-2026.1',
    stand: '2026-11-27',
  },
  'kalk.bierdeckel.genauerBlick': {
    id: 'kalk.bierdeckel.genauerBlick',
    titel: 'Bierdeckel: ab hier lohnt ein genauerer Blick',
    wert: 500,
    einheit: 'bp',
    status: 'DESIGN',
    quelle: '02 §2.5 calc.bierdeckel.schwellen; [[Q-immocation-Tool-Bierdeckelrechnung]] (~5 %)',
    stand: '2026-11-27',
    hinweis: 'Schwellen hängen vom Zinsniveau ab (LR-55).',
  },
  'kalk.bierdeckel.selbsttragend': {
    id: 'kalk.bierdeckel.selbsttragend',
    titel: 'Bierdeckel: typisch für Objekte, die sich selbst tragen können',
    wert: 600,
    einheit: 'bp',
    status: 'DESIGN',
    quelle: '02 §2.5; [[Q-immocation-Blog-9-haeufigste-Fehler-beim-Kauf]] (~6 %)',
    stand: '2026-11-27',
    hinweis: 'Schwellen hängen vom Zinsniveau ab (LR-55).',
  },
  'kalk.bierdeckel.hoch': {
    id: 'kalk.bierdeckel.hoch',
    titel: 'Bierdeckel: hohe Bruttorendite',
    wert: 800,
    einheit: 'bp',
    status: 'DESIGN',
    quelle: '02 §2.5; [[Fallstudie-Dominik-Neunkirchen]] (8 %)',
    stand: '2026-11-27',
    hinweis: 'Hohe Bruttorendite garantiert keinen positiven Cashflow (Fall Hildesheim).',
  },
  'kalk.bierdeckel.selten': {
    id: 'kalk.bierdeckel.selten',
    titel: 'Bierdeckel: sehr selten',
    wert: 1000,
    einheit: 'bp',
    status: 'DESIGN',
    quelle: '02 §2.5; [[Q-immocation-Blog-Wie-lange-macht-die-Bank-mit]] (10 %, „rar“)',
    stand: '2026-11-27',
  },
} as const satisfies Record<string, Parameter>;

export const ALLE_PARAMETER: Record<ParameterId, Parameter> = {
  ...PARAMETER,
  ...GREST_PARAMETER,
  ...KALKULATION_PARAMETER,
};

export type ParameterId =
  | keyof typeof PARAMETER
  | keyof typeof GREST_PARAMETER
  | keyof typeof KALKULATION_PARAMETER;

export function parameter(id: ParameterId): Parameter {
  return ALLE_PARAMETER[id];
}

/** Zahlenwert eines Parameters (alle Fachzahlen der Registry sind Zahlen). */
export function pw(id: ParameterId): number {
  return ALLE_PARAMETER[id].wert;
}
