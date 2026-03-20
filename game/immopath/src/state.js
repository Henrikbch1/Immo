/**
 * state.js – Zentraler Spielzustand für IMMOPATH
 * Kapselt getState, setState, save, load, reset, migrate
 * Persistenz: localStorage, Key "immo_sim_v1"
 */

const STORAGE_KEY = 'immo_sim_v1';
const CURRENT_VERSION = 3;

/** Startzustand gemäß Spielvorgaben – auch exportiert für Tests */
export function defaultState() {
  return {
    version: CURRENT_VERSION,
    dateISO: '2026-01-01',
    running: false,
    daysPerSecond: 3,
    cash: 5000,
    netIncome: 2000,
    livingCosts: 1200,
    creditScore: 620,
    market: {
      heat: 55,
      supply: 50,
      baseInterest: 0.045,
      rentIndex: 1.0,
      cities: [
        {
          id: 'city1',
          name: 'Nordstadt',
          zones: [
            {
              id: 'A',
              name: 'A-Lage',
              attractiveness: 0.9,
              rentPerM2: 14,
              pricePerM2: 4200,
              vacBase: 0.02,
            },
            {
              id: 'B',
              name: 'B-Lage',
              attractiveness: 0.7,
              rentPerM2: 11,
              pricePerM2: 3200,
              vacBase: 0.03,
            },
            {
              id: 'C',
              name: 'C-Lage',
              attractiveness: 0.5,
              rentPerM2: 8,
              pricePerM2: 2400,
              vacBase: 0.04,
            },
          ],
        },
        {
          id: 'city2',
          name: 'Landkreis Heide',
          zones: [
            {
              id: 'rural-A',
              name: 'Dorfkern',
              attractiveness: 0.45,
              rentPerM2: 6,
              pricePerM2: 1700,   // Bandbreite ~1.600–2.000 über Marktdruck
              vacBase: 0.06,
              rural: true,
            },
            {
              id: 'rural-B',
              name: 'Außenlage',
              attractiveness: 0.30,
              rentPerM2: 4.5,
              pricePerM2: 1200,   // Bandbreite ~1.000–1.600 über Marktdruck
              vacBase: 0.08,
              rural: true,
            },
          ],
        },
      ],
    },
    /** @type {import('./marketplace.js').Offer[]} */
    offers: [],
    /** @type {import('./properties.js').Property[]} */
    portfolio: [],
    /** @type {import('./tenants.js').Applicant[]} */
    applicants: [],
    /** @type {Array<{t: string, cash: number, credit: number}>} */
    history: [],
    /** @type {Array<{id: string, t: string, text: string, severity: string}>} */
    log: [],
  };
}

/** Interner State-Container */
let _state = defaultState();

/** Gibt eine tiefe Kopie des aktuellen Zustands zurück (immutable für UI). */
export function getState() {
  return JSON.parse(JSON.stringify(_state));
}

/**
 * Aktualisiert den State per Updater-Funktion.
 * Die Updater-Funktion erhält eine tiefe Kopie und gibt den neuen State zurück.
 * @param {(draft: object) => object} updater
 */
export function setState(updater) {
  const draft = JSON.parse(JSON.stringify(_state));
  _state = updater(draft);
  // Benachrichtigt alle registrierten Listener
  _notify();
}

/** Listener-Liste für State-Änderungen */
const _listeners = new Set();

/**
 * Registriert einen Listener, der bei jedem setState aufgerufen wird.
 * @param {() => void} fn
 * @returns {() => void} Abmelde-Funktion
 */
export function subscribe(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

function _notify() {
  for (const fn of _listeners) {
    try {
      fn();
    } catch (e) {
      console.error('[state] Listener-Fehler:', e);
    }
  }
}

/** Speichert den aktuellen State in localStorage. */
export function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_state));
  } catch (e) {
    console.error('[state] Speichern fehlgeschlagen:', e);
  }
}

/**
 * Lädt den State aus localStorage.
 * Führt Migration durch, falls Version veraltet.
 * @returns {boolean} true wenn erfolgreich geladen
 */
export function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    _state = migrate(parsed);
    _notify();
    return true;
  } catch (e) {
    console.error('[state] Laden fehlgeschlagen:', e);
    return false;
  }
}

/**
 * Migriert einen veralteten State auf die aktuelle Version.
 * @param {object} old
 * @returns {object}
 */
export function migrate(old) {
  let s = old;
  // Version 0 → 1: Felder ergänzen die noch fehlen könnten
  if (!s.version || s.version < 1) {
    s = {
      ...defaultState(),
      ...s,
      version: 1,
    };
  }
  // Zukünftige Migrationen hier ergänzen:
  // Version 1 → 2: Stadt „Landkreis Heide" ergänzen
  if (s.version < 2) {
    const hasCity2 = s.market?.cities?.some((c) => c.id === 'city2');
    if (!hasCity2 && s.market?.cities) {
      s.market.cities.push(defaultState().market.cities[1]);
    }
    s.version = 2;
  }
  // Version 2 → 3: autoMgmt-Feld für bestehende Portfolio-Objekte ergänzen
  if (s.version < 3) {
    if (s.portfolio) {
      s.portfolio.forEach((p) => {
        if (p.autoMgmt === undefined) p.autoMgmt = false;
      });
    }
    s.version = 3;
  }

  // Sicherheitsnetz: fehlende Felder mit Defaults füllen
  const def = defaultState();
  if (!s.market) s.market = def.market;
  if (!s.offers) s.offers = [];
  if (!s.portfolio) s.portfolio = [];
  if (!s.applicants) s.applicants = [];
  if (!s.history) s.history = [];
  if (!s.log) s.log = [];

  return s;
}

/** Setzt den State auf Werkseinstellungen zurück und löscht localStorage. */
export function reset() {
  localStorage.removeItem(STORAGE_KEY);
  _state = defaultState();
  _notify();
}

/**
 * Schreibt einen Log-Eintrag direkt in einen mutable Draft-State.
 * Kein eigenes setState – geeignet für Aufrufe innerhalb von setState-Callbacks.
 * @param {object} draft – mutable state-Objekt
 * @param {string} text
 * @param {'info'|'warn'|'success'|'danger'} [severity='info']
 * @returns {object} der modifizierte Draft
 */
export function addLogToDraft(draft, text, severity = 'info') {
  const entry = {
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    t: draft.dateISO,
    text,
    severity,
  };
  draft.log = [entry, ...(draft.log || [])].slice(0, 200);
  return draft;
}

/**
 * Fügt einen Log-Eintrag hinzu (max. 200 Einträge, neueste zuerst).
 * Erzeugt einen eigenen setState-Aufruf – nur außerhalb von setState-Callbacks verwenden.
 * @param {string} text
 * @param {'info'|'warn'|'success'|'danger'} [severity='info']
 */
export function addLog(text, severity = 'info') {
  setState((s) => addLogToDraft(s, text, severity));
}


