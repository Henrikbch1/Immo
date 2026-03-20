/**
 * marketplace.js – Angebotserzeugung für den Marktplatz
 * Erzeugt monatlich neue Angebote mit realistischen Feldern.
 */

import { clamp, rnd, rndInt, uuid, addDays, toISO, fromISO } from './utils.js';
import { getZone, marketPressure } from './market.js';

/** Angebotskategorien mit Gewichtung (ETW dominiert am Anfang) */
const CATEGORY_WEIGHTS = [
  { cat: 'apartment', weight: 65 },
  { cat: 'house', weight: 25 },
  { cat: 'mfh', weight: 10 },
];

/**
 * Prüft ob eine Zone ländlich ist (rural-Flag oder rural-Präfix in der ID).
 * @param {object} zone
 * @returns {boolean}
 */
function isRuralZone(zone) {
  return zone.rural === true || zone.id.startsWith('rural');
}

/**
 * Berechnet die Wohnungsgröße für Apartments.
 * Ländliche Zonen: 70 % Chance auf 40–70 m², 30 % auf 20–39 m².
 * Städtische Zonen: 35–120 m² gleichverteilt.
 * @param {object} zone
 * @returns {number}
 */
function apartmentSize(zone) {
  if (isRuralZone(zone)) {
    return Math.random() < 0.7 ? rndInt(40, 70) : rndInt(20, 39);
  }
  return rndInt(35, 120);
}

/**
 * Zieht eine gewichtete Zufallskategorie.
 * @returns {string}
 */
function randomCategory() {
  const total = CATEGORY_WEIGHTS.reduce((s, c) => s + c.weight, 0);
  let r = rnd(0, total);
  for (const { cat, weight } of CATEGORY_WEIGHTS) {
    r -= weight;
    if (r <= 0) return cat;
  }
  return 'apartment';
}

/**
 * Erzeugt die Gebäudedaten passend zur Kategorie und Zone.
 * @param {string} category
 * @param {object} zone
 * @returns {object}
 */
function buildingData(category, zone) {
  const year = rndInt(1960, 2022);
  const condition = clamp(
    Math.round(rnd(20, 95) * (0.7 + zone.attractiveness * 0.3)),
    20,
    95
  );
  const energyClasses = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  // Bessere Gebäude haben tendenziell bessere Energieklasse
  const eiIdx = clamp(Math.floor((100 - condition) / 15), 0, 6);
  const energyClass = energyClasses[eiIdx];

  const units = category === 'mfh' ? rndInt(2, 8) : 1;
  const floor = category === 'house' ? 0 : rndInt(0, 5);
  const parkingSpots = rndInt(0, category === 'mfh' ? 2 : 1);

  return { year, units, floor, parkingSpots, energyClass, condition };
}

/**
 * Berechnet den Angebotspreis.
 * Formel: areaM2 * zone.pricePerM2 * (0.95..1.12) * (1 + marketPressure)
 * @param {number} areaM2
 * @param {object} zone
 * @param {object} market
 * @returns {number}
 */
function calcPrice(areaM2, zone, market) {
  const spread = rnd(0.95, 1.12);
  const pressure = marketPressure(market);
  return Math.round(areaM2 * zone.pricePerM2 * spread * (1 + pressure));
}

/**
 * Berechnet das Mietpotenzial (Kaltmiete/Monat).
 * Basis: areaM2 * zone.rentPerM2 * rentIndex * (0.8 + condition/200)
 * @param {number} areaM2
 * @param {object} zone
 * @param {object} market
 * @param {number} condition
 * @returns {number}
 */
function calcRentPotential(areaM2, zone, market, condition) {
  const base = areaM2 * zone.rentPerM2 * market.rentIndex * (0.8 + condition / 200);
  return Math.round(base);
}

/**
 * Erzeugt die Nebenkosten-Struktur für ein Angebot.
 * Maklerprovision variabel je Angebot.
 * @returns {object}
 */
function rollFees() {
  return {
    agentPct: Math.round(rnd(0.015, 0.03) * 1000) / 1000,
    notaryPct: 0.015,
    transferTaxPct: 0.03,
    miscPct: 0.005,
  };
}

/** Zähler für lesbare Angebots-Namen */
let _offerCounter = 1000;

/**
 * Berechnet die Ablaufdauer in Monaten abhängig vom Marktheat.
 * Heißer Markt → Angebote verschwinden schneller (1–2 Monate).
 * Kalter Markt → Angebote bleiben länger (4–6 Monate).
 * @param {number} heat – 0..100
 * @returns {number} Monate bis Ablauf
 */
function offerLifetimeMonths(heat) {
  if (heat >= 70) return rndInt(1, 2);
  if (heat >= 45) return rndInt(2, 4);
  return rndInt(4, 6);
}

/**
 * Erzeugt ein einzelnes neues Angebot.
 * @param {object} market – state.market
 * @param {string} cityId
 * @param {string} zoneId
 * @param {string} [dateISO] – aktuelles Datum für expiresAt-Berechnung
 * @returns {object} Offer
 */
export function makeOffer(market, cityId, zoneId, dateISO = '2026-01-01') {
  const zone = getZone(market, cityId, zoneId);
  if (!zone) throw new Error(`Zone ${cityId}/${zoneId} nicht gefunden`);

  const category = randomCategory();
  const building = buildingData(category, zone);

  // Fläche abhängig von Kategorie und Zone (kein nested ternary)
  let areaM2;
  if (category === 'apartment') {
    areaM2 = apartmentSize(zone);
  } else if (category === 'house') {
    areaM2 = rndInt(80, 220);
  } else {
    areaM2 = rndInt(200, 600);
  }

  const price = calcPrice(areaM2, zone, market);
  const rentPotentialM2 = calcRentPotential(1, zone, market, building.condition);

  // Ablaufdatum basierend auf Marktheat
  const lifetimeDays = offerLifetimeMonths(market.heat) * 30;
  const expiresAt = toISO(addDays(fromISO(dateISO), lifetimeDays));

  // Label: ländliche Zonen erhalten „Land-"-Präfix
  const rural = isRuralZone(zone);
  let label;
  if (category === 'apartment') {
    label = rural ? 'Land-ETW' : 'ETW';
  } else if (category === 'house') {
    label = rural ? 'Land-EFH' : 'EFH';
  } else {
    label = rural ? 'Land-MFH' : 'MFH';
  }
  _offerCounter++;

  return {
    id: `offer_${uuid().slice(0, 8)}`,
    name: `${label} #${_offerCounter} – ${zone.name}`,
    category,
    location: { cityId, zoneId },
    building,
    areaM2,
    price,
    pricePerM2: Math.round(price / areaM2),
    rentPotentialM2,
    fees: rollFees(),
    expiresAt,
  };
}

/**
 * Erzeugt einen Satz neuer Angebote für einen Monatswechsel.
 * Anzahl hängt vom Angebotsdruck ab.
 * @param {object} market – state.market
 * @param {string} [dateISO] – aktuelles Datum für expiresAt-Berechnung
 * @returns {Array<object>} neue Angebote
 */
/**
 * Wählt cityId und zoneId für ein neues Angebot aus.
 * 60 % städtisch (city1 mit A/B/C-Gewichtung), 40 % ländlich (city2 gleichgewichtet).
 * @param {object} market
 * @returns {{ cityId: string, zoneId: string }}
 */
function pickCityAndZone(market) {
  const city1 = market.cities.find((c) => c.id === 'city1');
  const city2 = market.cities.find((c) => c.id === 'city2');

  if (city2 && Math.random() < 0.4) {
    const zones = city2.zones;
    return { cityId: city2.id, zoneId: zones[Math.floor(Math.random() * zones.length)].id };
  }

  // Städtische Zonen: A 20 %, B 45 %, C 35 %
  const zoneWeights = [0.2, 0.45, 0.35];
  const zoneIds = city1.zones.map((z) => z.id);
  let r = Math.random();
  let zoneId = zoneIds[zoneIds.length - 1];
  for (let j = 0; j < zoneWeights.length; j++) {
    r -= zoneWeights[j];
    if (r <= 0) { zoneId = zoneIds[j]; break; }
  }
  return { cityId: city1.id, zoneId };
}

export function rollOffers(market, dateISO = '2026-01-01') {
  const count = rndInt(3, 8);
  const offers = [];

  for (let i = 0; i < count; i++) {
    const { cityId, zoneId } = pickCityAndZone(market);
    try {
      offers.push(makeOffer(market, cityId, zoneId, dateISO));
    } catch (e) {
      console.warn('[marketplace] Angebot-Fehler:', e);
    }
  }

  return offers;
}

/**
 * Gibt das Miet-Band (±15 %) für ein Angebot zurück.
 * @param {object} offer
 * @returns {{ low: number, mid: number, high: number }}
 */
export function rentBand(offer) {
  const mid = Math.round(offer.areaM2 * offer.rentPotentialM2);
  return {
    low: Math.round(mid * 0.85),
    mid,
    high: Math.round(mid * 1.15),
  };
}


