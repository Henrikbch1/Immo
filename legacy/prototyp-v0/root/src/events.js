/**
 * events.js – Seltene Zufallsereignisse für IMMOPATH
 * Jedes Event: id, title, effect(state, property?), severity, logEntry
 */

import { clamp, rnd, rndInt, formatEUR } from './utils.js';

/**
 * @typedef {object} GameEvent
 * @property {string} id
 * @property {string} title
 * @property {(state: object, property?: object) => { state: object, property?: object, logText: string }} effect
 * @property {'info'|'warn'|'danger'|'success'} severity
 */

/** Globale Events (betreffen den Spieler, nicht ein einzelnes Objekt) */
const GLOBAL_EVENTS = [
  {
    id: 'interest_shock',
    title: 'Zinsschock',
    severity: 'danger',
    effect(state) {
      const delta = rnd(0.005, 0.015);
      state.market.baseInterest = clamp(state.market.baseInterest + delta, 0.01, 0.08);
      return {
        state,
        logText: `⚡ Zinsschock: Leitzins steigt um ${(delta * 100).toFixed(2)} Prozentpunkte auf ${(state.market.baseInterest * 100).toFixed(2)} %.`,
      };
    },
  },
  {
    id: 'market_boom',
    title: 'Marktboom',
    severity: 'success',
    effect(state) {
      const delta = rndInt(5, 15);
      state.market.heat = clamp(state.market.heat + delta, 0, 100);
      return {
        state,
        logText: `🚀 Marktboom: Die Nachfrage steigt stark (heat +${delta}).`,
      };
    },
  },
  {
    id: 'market_crash',
    title: 'Marktkorrrektur',
    severity: 'warn',
    effect(state) {
      const delta = rndInt(8, 20);
      state.market.heat = clamp(state.market.heat - delta, 0, 100);
      return {
        state,
        logText: `📉 Marktkorrektur: Die Nachfrage bricht ein (heat -${delta}).`,
      };
    },
  },
  {
    id: 'off_market_deal',
    title: 'Off-Market-Angebot',
    severity: 'success',
    effect(state) {
      // Wird von marketplace gesondert behandelt, hier nur Log
      return {
        state,
        logText: `🤝 Off-Market-Deal: Ein Makler kontaktiert Sie mit einem exklusiven Angebot!`,
      };
    },
  },
  {
    id: 'material_prices_up',
    title: 'Materialpreisanstieg',
    severity: 'warn',
    effect(state) {
      // Erhöht versteckt die Renovierungskosten leicht (wird bei nächster Reno berücksichtigt)
      const factor = rnd(1.05, 1.2);
      // Wir speichern einen temporären Kostenaufschlag im State
      state._renosCostFactor = Math.min((state._renosCostFactor || 1) * factor, 2);
      return {
        state,
        logText: `🏗️ Materialpreisanstieg: Renovierungskosten steigen um ca. ${Math.round((factor - 1) * 100)} %.`,
      };
    },
  },
  {
    id: 'material_prices_down',
    title: 'Materialpreis Rabatt',
    severity: 'success',
    effect(state) {
      // Erhöht versteckt die Renovierungskosten leicht (wird bei nächster Reno berücksichtigt)
      const factor = rnd(0.95, 0.8);
      // Wir speichern einen temporären Kostenaufschlag im State
      state._renosCostFactor = Math.min((state._renosCostFactor || 1) * factor, 2);
      return {
        state,
        logText: `🏗️ Materialpreis Rabatt: Renovierungskosten sinken um ca. ${Math.round((factor - 1) * 100)} %.`,
      };
    },
  },
];

/** Objekt-bezogene Events (betreffen ein Objekt im Portfolio) */
const PROPERTY_EVENTS = [
  {
    id: 'building_defect',
    title: 'Baumangel',
    severity: 'danger',
    effect(state, property) {
      const cost = rndInt(200, 2000);
      state.cash -= cost;
      property.building.condition = clamp(property.building.condition - rndInt(1, 4), 0, 95);
      return {
        state,
        property,
        logText: `🔧 Baumangel bei „${property.name}": Unerwartete Reparatur kostet ${formatEUR(cost)}. Zustand sinkt.`,
      };
    },
  },
  {
    id: 'tenant_leaves',
    title: 'Mieter kündigt fristlos',
    severity: 'warn',
    effect(state, property) {
      if (property.occupied) {
        property.occupied = false;
        property.rentCurrent = 0;
      }
      return {
        state,
        property,
        logText: `🚪 Bei „${property.name}" zieht der Mieter überraschend aus.`,
      };
    },
  },
  {
    id: 'rent_increase_potential',
    title: 'Mieterhöhungspotenzial',
    severity: 'success',
    effect(state, property) {
      return {
        state,
        property,
        logText: `📈 Der Mietindex in der ${property.location.zoneId}-Lage steigt – Mieterhöhung für „${property.name}" prüfen.`,
      };
    },
  },
];

/**
 * Würfelt monatlich, ob ein globales Event eintritt.
 * Wahrscheinlichkeit: ca. 8 % pro Monat.
 * @returns {GameEvent|null}
 */
export function rollGlobalEvent() {
  if (Math.random() > 0.01) return null;
  return GLOBAL_EVENTS[Math.floor(Math.random() * GLOBAL_EVENTS.length)];
}

/**
 * Würfelt monatlich, ob für ein Objekt ein Event eintritt.
 * Wahrscheinlichkeit: ca. 5 % pro Objekt und Monat.
 * @returns {GameEvent|null}
 */
export function rollPropertyEvent() {
  if (Math.random() > 0.03) return null;
  return PROPERTY_EVENTS[Math.floor(Math.random() * PROPERTY_EVENTS.length)];
}

/**
 * Führt ein globales Event aus und gibt das Ergebnis zurück.
 * @param {GameEvent} event
 * @param {object} state – mutable draft
 * @returns {{ state: object, logText: string, severity: string }}
 */
export function applyGlobalEvent(event, state) {
  const result = event.effect(state);
  return { ...result, severity: event.severity };
}

/**
 * Führt ein Objekt-Event aus und gibt das Ergebnis zurück.
 * @param {GameEvent} event
 * @param {object} state – mutable draft
 * @param {object} property – mutable property draft
 * @returns {{ state: object, property: object, logText: string, severity: string }}
 */
export function applyPropertyEvent(event, state, property) {
  const result = event.effect(state, property);
  return { ...result, severity: event.severity };
}
