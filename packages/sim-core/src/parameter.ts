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

export type ParameterId = keyof typeof PARAMETER;

export function parameter(id: ParameterId): Parameter {
  return PARAMETER[id];
}
