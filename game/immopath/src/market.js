/**
 * market.js – Marktentwicklung & Zonen-Hilfsfunktionen
 * Mean-Reversion + Rauschen für heat, supply, baseInterest, rentIndex
 */

import { clamp, rnd } from './utils.js';

/**
 * Entwickelt den Markt um einen Monat weiter (Mean-Reversion + Rauschen).
 * Wird beim Monatsanfang-Hook aufgerufen.
 * @param {object} market – Referenz auf state.market (wird mutiert)
 * @returns {object} aktualisiertes market-Objekt
 */
export function evolveMarket(market) {
  // Nachfrage (heat): zieht zur Mitte 50, plus Rauschen
  market.heat = clamp(
    market.heat + rnd(-2, 2) + (50 - market.heat) * 0.02,
    0,
    100
  );

  // Angebot (supply): zieht zur Mitte 50, weniger Rauschen
  market.supply = clamp(
    market.supply + rnd(-1.5, 1.5) + (50 - market.supply) * 0.01,
    0,
    100
  );

  // Leitzins: steigt bei heißem Markt, fällt bei kaltem
  market.baseInterest = clamp(
    market.baseInterest + (market.heat - 50) / 10000 + rnd(-0.0005, 0.0005),
    0.01,
    0.08
  );

  // Mietindex: steigt wenn Nachfrage > Angebot
  market.rentIndex = clamp(
    market.rentIndex + (market.heat - market.supply) / 10000 + rnd(-0.002, 0.002),
    0.8,
    1.3
  );

  return market;
}

/**
 * Sucht eine Zone anhand cityId + zoneId aus dem State.
 * @param {object} market – state.market
 * @param {string} cityId
 * @param {string} zoneId
 * @returns {object|undefined}
 */
export function getZone(market, cityId, zoneId) {
  const city = market.cities.find((c) => c.id === cityId);
  if (!city) return undefined;
  return city.zones.find((z) => z.id === zoneId);
}

/**
 * Gibt alle Zonen aller Städte als flaches Array zurück.
 * @param {object} market
 * @returns {Array<{cityId: string, cityName: string, zone: object}>}
 */
export function allZones(market) {
  const result = [];
  for (const city of market.cities) {
    for (const zone of city.zones) {
      result.push({ cityId: city.id, cityName: city.name, zone });
    }
  }
  return result;
}

/**
 * Berechnet den Marktdruck-Faktor (beeinflusst Preise).
 * Positiv = heißer Markt, Negativ = kalter Markt.
 * @param {object} market
 * @returns {number}
 */
export function marketPressure(market) {
  return (market.heat - market.supply) / 300;
}

/**
 * Gibt den effektiven Jahreszins für einen Kredit zurück.
 * Schlechtere Bonität → höherer Aufschlag.
 * @param {object} market
 * @param {number} creditScore – 300..850
 * @returns {number} – Jahreszins als Dezimal
 */
export function effectiveInterestRate(market, creditScore) {
  return clamp(
    market.baseInterest + (700 - creditScore) / 10000,
    0.02,
    0.09
  );
}

