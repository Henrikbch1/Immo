/**
 * tenants.js – Mieterverwaltung für IMMOPATH
 * Bewerber-Erzeugung, Vermietungsentscheidung, Auszugschancen
 */

import { clamp, rnd, rndInt, uuid } from './utils.js';

/**
 * Erzeugt einen zufälligen Mietinteressenten.
 * @returns {object} Applicant
 */
export function generateApplicant() {
  return {
    id: `app_${uuid().slice(0, 8)}`,
    credit: Math.round(clamp(rnd(0.3, 1), 0, 1) * 100) / 100,
    income: rndInt(1200, 5500),
    householdSize: rndInt(1, 4),
    pets: Math.random() < 0.3,
    moveInReady: Math.random() < 0.75,
  };
}

/**
 * Erzeugt eine Liste von Bewerbern für ein Objekt.
 * Anzahl hängt von Markt, Lage und Preis-Niveau ab.
 * @param {object} zone – Zonen-Objekt
 * @param {object} market – state.market
 * @param {number} [askingRent=0] – geforderte Kaltmiete
 * @param {number} [marketRentMid=0] – Marktmiete (mittleres Band)
 * @returns {Array<object>}
 */
export function generateApplicants(zone, market, askingRent = 0, marketRentMid = 0) {
  // Mehr Bewerber bei hoher Nachfrage und attraktiver Lage
  const base = Math.round(1 + zone.attractiveness * 3 + market.heat / 20);
  let count = clamp(base + rndInt(-1, 2), 0, 12);

  // Preisbedingte Reduktion der Bewerberzahl
  if (marketRentMid > 0 && askingRent > 0) {
    const ratio = askingRent / marketRentMid;
    if (ratio > 1.3) {
      // > 30 % über Mietspiegel: maximal 1–2 Bewerber, meistens 0
      count = Math.random() < 0.75 ? 0 : rndInt(0, 1);
    } else if (ratio > 1.2) {
      // 20–30 % über: stark reduziert
      count = Math.max(0, Math.floor(count * 0.2));
    } else if (ratio > 1.1) {
      // 10–20 % über: deutlich reduziert
      count = Math.max(0, Math.floor(count * 0.5));
    }
  }

  return Array.from({ length: count }, generateApplicant);
}

/**
 * Berechnet die monatliche Vermietungswahrscheinlichkeit.
 * Berücksichtigt Markt-Hitze, Zonen-Attraktivität und Preis-Penalty.
 *
 * Preisband:
 *  ≤ 110 % Mietspiegel → normal
 *  110–120 % → leichte Penalty
 *  120–130 % → starke Penalty (schwer zu vermieten)
 *  > 130 %   → nahe 0 (fast niemand fragt an)
 *
 * @param {object} zone
 * @param {object} market
 * @param {number} askingRent – geforderte Miete
 * @param {number} marketRentMid – Markt-Mittlere Miete (areaM2 * rentPotentialM2)
 * @returns {number} Wahrscheinlichkeit 0..1
 */
export function rentalProbability(zone, market, askingRent, marketRentMid) {
  const ratio = askingRent / marketRentMid;   // 1.0 = genau Mietspiegel

  let penaltyPreis = 0;
  if (ratio > 1.3) {
    // > 30 % über Mietspiegel: fast unmöglich
    penaltyPreis = 0.9 + clamp((ratio - 1.3) * 2, 0, 0.09);
  } else if (ratio > 1.2) {
    // 20–30 % über: sehr schwer (starke Strafe)
    penaltyPreis = 0.55 + (ratio - 1.2) * 3.5;
  } else if (ratio > 1.1) {
    // 10–20 % über: merklich schwerer
    penaltyPreis = (ratio - 1.1) * 5.5;
  }
  penaltyPreis = clamp(penaltyPreis, 0, 0.99);

  const p = market.heat / 120 + zone.attractiveness / 4 - penaltyPreis;
  return clamp(p, 0.01, 0.85);
}

/**
 * Berechnet die monatliche Auszugswahrscheinlichkeit eines Mieters.
 * Baseline ca. 0,25 %/Monat + Markt-Penalty bei schwacher Nachfrage.
 * @param {object} market
 * @returns {number}
 */
export function vacateProbability(market) {
  const marketPenalty = clamp((50 - market.heat) / 10000, 0, 0.01);
  return 0.0025 + marketPenalty;
}

/**
 * Berechnet die versteckte Leerstandsrate pro Monat (für internen Cashflow).
 * Baseline ~3 % p.a. moduliert durch Markt und Lage.
 * @param {object} zone
 * @param {object} market
 * @returns {number} monatliche Ausfallquote 0..1
 */
export function hiddenVacancyRate(zone, market) {
  // Baseline: vacBase p.a. / 12
  const baseline = zone.vacBase / 12;
  // Markt-Modulation: heißer Markt reduziert, kalter erhöht
  const marketFactor = 1 + (50 - market.heat) / 200;
  return clamp(baseline * marketFactor, 0, 0.1);
}

/**
 * Bewertet einen Bewerber und gibt einen Score zurück (höher = besser).
 * Wird für die UI-Sortierung der Bewerberliste genutzt.
 * @param {object} applicant
 * @param {number} askingRent
 * @returns {number}
 */
export function scoreApplicant(applicant, askingRent) {
  // Kreditwürdigkeit am wichtigsten, dann Einkommen relativ zur Miete
  const affordability = clamp(applicant.income / (askingRent * 3), 0, 1);
  const score = applicant.credit * 0.6 + affordability * 0.3 + (applicant.moveInReady ? 0.1 : 0);
  return Math.round(score * 100) / 100;
}


