/**
 * properties.js – Objekt-Lebenszyklus für IMMOPATH
 * purchaseOffer, startRenovation, monthlyOperateProperty,
 * appraise, listForSale, trySellMonthly
 */

import { clamp, rnd, rndInt, uuid, formatEUR } from './utils.js';
import { getZone } from './market.js';
import { amortize } from './financing.js';
import { rentalProbability, vacateProbability, hiddenVacancyRate, generateApplicants, scoreApplicant } from './tenants.js';
import { rollPropertyEvent, applyPropertyEvent } from './events.js';
import { addLog, addLogToDraft } from './state.js';

/** Renovierungsscopes mit Kosten/m², Zustandsdelta und Dauer
 *  Kosten realistisch: leicht 50–100 €/m², mittel 80–150 €/m², umfassend 120–200 €/m²
 */
const RENO_SCOPES = {
  light:  { costLow:  50, costHigh: 90, deltaLow: 10, deltaHigh: 30, monthsLow: 1, monthsHigh: 1 },
  medium: { costLow:  80, costHigh: 120, deltaLow: 20, deltaHigh: 50, monthsLow: 1, monthsHigh: 3 },
  gut:    { costLow: 120, costHigh: 180, deltaLow: 35, deltaHigh: 80, monthsLow: 3, monthsHigh: 6 },
};

// ─── Private Hilfsfunktionen ─────────────────────────────────────────────────

/** Verarbeitet die monatliche Renovierungsphase eines Objekts. */
function _processRenovation(state, property) {
  const monthlySpend = Math.min(property.reno.weeklySpend * 4, property.reno.remainingCost);
  state.cash -= monthlySpend;
  property.reno.remainingCost -= monthlySpend;
  if (property.reno.remainingCost > 0) return;

  property.reno.done = true;
  property.reno.remainingCost = 0;
  property.building.condition = clamp(property.building.condition + property.reno.qualityDelta, 0, 100);
  if (property.reno.qualityDelta >= 30 && property.building.energyClass > 'C') {
    property.building.energyClass = String.fromCodePoint(property.building.energyClass.codePointAt(0) - 1);
  }
  addLog(`✅ Renovierung abgeschlossen bei „${property.name}". Zustand jetzt ${property.building.condition}.`, 'success');

  // Auto-Verwaltung: sofort nach Reno-Abschluss besten Bewerber einziehen (kein Leerstandsmonat)
  if (property.autoMgmt && !property.selling.onMarket) {
    const zone = _getZoneForProperty(state, property);
    if (zone) {
      const marketRentMid = Math.round(property.areaM2 * property.rentPotentialM2);
      property.rentCurrent = marketRentMid;
      const applicants = generateApplicants(zone, state.market, marketRentMid, marketRentMid);
      const best = applicants.toSorted(
        (a, b) => scoreApplicant(b, marketRentMid) - scoreApplicant(a, marketRentMid)
      )[0];
      if (best) {
        property.occupied = true;
        property._tenantWearFactor = rnd(0, 0.4);
        property.applicants = [];
        property._seekingTenant = false;
        addLog(`🤖 Auto-Verwaltung: Mieter sofort nach Renovierung eingezogen in „${property.name}" – Miete ${formatEUR(marketRentMid)}/Mo.`, 'success');
      }
    }
  }
}

/** Hilfsfunktion: Zone für ein Property aus dem State holen (innerhalb properties.js nutzbar). */
function _getZoneForProperty(state, property) {
  return getZone(state.market, property.location.cityId, property.location.zoneId) || null;
}

/** Verarbeitet Mieteinnahmen und prüft Auszug bei belegtem Objekt. */
function _processOccupied(state, property, zone) {
  const hvr = hiddenVacancyRate(zone, state.market);
  const netRent = property.rentCurrent * (1 - hvr) * (1 - property.mgmtPct);
  state.cash += Math.round(netRent);

  if (Math.random() < vacateProbability(state.market)) {
    property.occupied = false;
    property.rentCurrent = 0;
    addLog(`🚪 Mieter verlässt „${property.name}".`, 'warn');

    // Auto-Verwaltung: leichte Renovierung automatisch anstoßen wenn Zustand < 40
    if (property.autoMgmt && property.building.condition < 40) {
      const costFactor = state._renosCostFactor || 1;
      const def = { costLow: 50, costHigh: 90, deltaLow: 10, deltaHigh: 30 };
      const costPerM2 = rnd(def.costLow, def.costHigh) * costFactor;
      const totalCost = Math.round(costPerM2 * property.areaM2);
      const weeklySpend = Math.max(1, Math.round(totalCost / 4)); // min. 1 € damit Renovierung immer endet
      const qualityDelta = rndInt(def.deltaLow, def.deltaHigh);
      property.reno = { plannedScope: 'light', remainingCost: totalCost, weeklySpend, done: false, qualityDelta };
      addLog(`🤖 Auto-Verwaltung: Leichte Renovierung für „${property.name}" gestartet (Zustand ${Math.round(property.building.condition)}/100) – Kosten ca. ${formatEUR(totalCost)}.`, 'info');
    }
  }
}

/** Versucht einen neuen Mieter zu finden bei leerem Objekt mit aktivem Inserat. */
function _processVacant(state, property, zone) {
  // Auto-Mieterverwaltung: Inserat automatisch starten wenn aktiviert
  if (property.autoMgmt && !property._seekingTenant && property.reno.done && !property.selling.onMarket) {
    const marketRentMid = Math.round(property.areaM2 * property.rentPotentialM2);
    property.rentCurrent = marketRentMid;
    property._seekingTenant = true;
    property.applicants = generateApplicants(zone, state.market, marketRentMid, marketRentMid);
    addLog(`🤖 Auto-Verwaltung: Inserat für „${property.name}" automatisch gestartet – Miete ${formatEUR(marketRentMid)}/Mo.`, 'info');
  }

  if (!property._seekingTenant) return;
  const marketRentMid = Math.round(property.areaM2 * property.rentPotentialM2);
  const p = rentalProbability(zone, state.market, property.rentCurrent || marketRentMid, marketRentMid);
  if (Math.random() >= p) return;

  // Auto-Verwaltung: besten Bewerber automatisch einziehen lassen
  if (property.autoMgmt && (property.applicants || []).length > 0) {
    property.occupied = true;
    if (!property.rentCurrent) property.rentCurrent = marketRentMid;
    property._tenantWearFactor = rnd(0, 0.4);
    property.applicants = [];
    property._seekingTenant = false;
    addLog(`🤖 Auto-Verwaltung: Neuer Mieter für „${property.name}" – Miete ${formatEUR(property.rentCurrent)}/Mo.`, 'success');
    return;
  }

  property.occupied = true;
  if (!property.rentCurrent) property.rentCurrent = marketRentMid;
  property._tenantWearFactor = rnd(0, 0.4);
  property.applicants = [];
  property._seekingTenant = false;
  addLog(`✅ Neuer Mieter für „${property.name}" – Miete ${formatEUR(property.rentCurrent)}/Monat.`, 'success');
}

/** Verarbeitet Kreditrate und Amortisation; setzt Rate auf 0 wenn abbezahlt. */
function _processMortgage(state, property) {
  if (!property.mortgage || property.mortgage.principal <= 0) return;

  const { newPrincipal } = amortize(
    property.mortgage.principal,
    property.mortgage.annualRate,
    property.mortgage.monthlyPayment
  );
  state.cash -= property.mortgage.monthlyPayment;
  property.mortgage.principal = Math.max(0, newPrincipal);

  if (property.mortgage.principal <= 0) {
    property.mortgage.principal = 0;
    property.mortgage.monthlyPayment = 0;
    property.mortgage.termMonths = 0;
    addLog(`🎉 Kredit für „${property.name}" vollständig abbezahlt! Cashflow steigt sofort.`, 'success');
  } else if (property.mortgage.annualRate > 0) {
    const r = property.mortgage.annualRate / 12;
    const pmt = property.mortgage.monthlyPayment;
    const remaining = Math.ceil(-Math.log(1 - (r * property.mortgage.principal) / pmt) / Math.log(1 + r));
    property.mortgage.termMonths = Math.max(0, remaining);
  } else {
    property.mortgage.termMonths = Math.max(0, (property.mortgage.termMonths || 1) - 1);
  }
}

// ─── Öffentliche API ──────────────────────────────────────────────────────────

/**
 * Kauft ein Angebot und legt das Property im Portfolio an.
 * @param {object} state – mutable draft
 * @param {object} offer
 * @param {{ equity: number, closingCosts: number, loan: number, monthlyPayment: number, annualRate: number, termMonths: number }} params
 * @returns {object} neues Property
 */
export function purchaseOffer(state, offer, params) {
  const { equity, closingCosts, loan, monthlyPayment, annualRate, termMonths, includeKNK } = params;
  // Bei 100%+KNK sind die NK bereits im Kredit enthalten → nur EK aus Kasse
  state.cash -= includeKNK ? equity : (equity + closingCosts);

  const property = {
    id: `prop_${uuid().slice(0, 8)}`,
    fromOfferId: offer.id,
    name: offer.name,
    category: offer.category,
    location: { ...offer.location },
    building: { ...offer.building },
    areaM2: offer.areaM2,
    purchasePrice: offer.price,
    price: offer.price,
    pricePerM2: offer.pricePerM2,
    rentPotentialM2: offer.rentPotentialM2,
    fees: { ...offer.fees },
    mortgage: { principal: loan, annualRate, monthlyPayment, termMonths },
    strategy: 'none',
    occupied: false,
    autoMgmt: false,
    mgmtPct: 0.08,
    maintPctAnnual: 0.01,
    vacancyHiddenRisk: 0.03,
    reno: { plannedScope: null, remainingCost: 0, weeklySpend: 0, done: true, qualityDelta: 0 },
    appraisal: { arv: null, lastAppraisalISO: null },
    selling: { onMarket: false, minPrice: null, daysOnMarket: 0 },
    rentCurrent: 0,
    applicants: [],
  };

  state.offers = state.offers.filter((o) => o.id !== offer.id);
  state.portfolio.push(property);
  addLog(`🏠 Kauf abgeschlossen: „${property.name}" für ${formatEUR(offer.price)}.`, 'success');
  return property;
}

/**
 * Startet eine Renovierung für ein Objekt.
 * @param {object} property – mutable
 * @param {'light'|'medium'|'gut'} scope
 * @param {number} areaM2
 * @param {number} [costFactor=1] – Aufschlag durch Materialpreisanstieg
 */
export function startRenovation(property, scope, areaM2, costFactor = 1) {
  const def = RENO_SCOPES[scope];
  if (!def) throw new Error(`Unbekannter Renovierungsscope: ${scope}`);

  const costPerM2 = rnd(def.costLow, def.costHigh) * costFactor;
  const totalCost = Math.round(costPerM2 * areaM2);
  const durationMonths = rndInt(def.monthsLow, def.monthsHigh);
  const weeklySpend = Math.max(1, Math.round(totalCost / (durationMonths * 4)));
  const qualityDelta = rndInt(def.deltaLow, def.deltaHigh);

  property.reno = { plannedScope: scope, remainingCost: totalCost, weeklySpend, done: false, qualityDelta };
  property.occupied = false;
  property.rentCurrent = 0;
  addLog(`🔨 Renovierung „${scope}" gestartet bei „${property.name}" – Kosten ca. ${formatEUR(totalCost)}.`, 'info');
}

/**
 * Gibt die Renovierungskosten-Schätzung zurück (für Dialog).
 * @param {'light'|'medium'|'gut'} scope
 * @param {number} areaM2
 * @param {number} [costFactor=1]
 */
export function renoEstimate(scope, areaM2, costFactor = 1) {
  const def = RENO_SCOPES[scope];
  return {
    minCost: Math.round(def.costLow * areaM2 * costFactor),
    maxCost: Math.round(def.costHigh * areaM2 * costFactor),
    minMonths: def.monthsLow,
    maxMonths: def.monthsHigh,
    deltaRange: `+${def.deltaLow}–${def.deltaHigh} Zustand`,
  };
}

/**
 * Miete, Leerstand, Instandhaltung, Renovierung, Kreditrate, Restschuld.
 * @param {object} state – mutable draft
 * @param {object} property – mutable property im state.portfolio
 * @param {string} _dateISO – aktuelles Datum (reserviert)
 */
export function monthlyOperateProperty(state, property, _dateISO) {
  const zone = getZone(state.market, property.location.cityId, property.location.zoneId);
  if (!zone) return;

  // --- Renovierung ---
  if (!property.reno.done) {
    _processRenovation(state, property);
    return; // Keine weiteren Aktionen während Renovierung
  }

  // --- Vermietung / Leerstand ---
  if (property.occupied) {
    _processOccupied(state, property, zone);
  } else {
    _processVacant(state, property, zone);
  }

  // --- Instandhaltung (bei Leerstand 60 % günstiger) ---
  const maintFull = Math.round((property.price * property.maintPctAnnual) / 12);
  state.cash -= property.occupied ? maintFull : Math.round(maintFull * 0.4);

  // --- Zustandsabnutzung – individuell je Mieter ---
  const wearBase = property.occupied
    ? rnd(0.05, 0.15) + (property._tenantWearFactor ?? rnd(0, 0.25))
    : rnd(0.01, 0.05);
  property.building.condition = clamp(property.building.condition - wearBase, 0, 100);

  // --- Kreditrate & Amortisation ---
  _processMortgage(state, property);

  // --- Immobilienwert: monatliche Inflation (0–4 % p.a.) ---
  const annualInflation = clamp(
    (state.market.heat - 40) / 1000 + (state.market.rentIndex - 1) * 0.02,
    0,
    0.04
  );
  property.price = Math.round(property.price * (1 + annualInflation / 12));
  property.pricePerM2 = Math.round(property.price / property.areaM2);

  // --- Verkaufsfortschritt ---
  if (property.selling.onMarket) {
    property.selling.daysOnMarket += 30;
  }

  // --- Seltene Objekt-Events ---
  const event = rollPropertyEvent();
  if (event) {
    const result = applyPropertyEvent(event, state, property);
    addLogToDraft(state, result.logText, result.severity);
  }

  // --- Auto-Mieterverwaltungs-Gebühr ---
  if (property.autoMgmt) {
    state.cash -= 5;
  }
}

/**
 * Führt eine Bewertung (Gutachten) durch.
 * Kosten: 500–1.000 €, setzt appraisal.arv.
 * @param {object} state – mutable draft
 * @param {object} property – mutable
 * @param {string} dateISO
 */
export function appraise(state, property, dateISO) {
  const cost = rndInt(500, 1000);
  state.cash -= cost;

  const zone = getZone(state.market, property.location.cityId, property.location.zoneId);
  const qualityBonus = property.reno.qualityDelta / 150;
  const arv = Math.round(
    property.areaM2 * zone.pricePerM2 * state.market.rentIndex * (1 + qualityBonus)
  );

  property.appraisal.arv = arv;
  property.appraisal.lastAppraisalISO = dateISO;

  addLog(
    `📋 Gutachten für „${property.name}": ARV = ${formatEUR(arv)} (Kosten: ${formatEUR(cost)}).`,
    'info'
  );
}

/**
 * Stellt ein Objekt zum Verkauf ein.
 * @param {object} property – mutable
 * @param {number} minPrice
 */
export function listForSale(property, minPrice) {
  property.selling.onMarket = true;
  property.selling.minPrice = minPrice;
  property.selling.daysOnMarket = 0;
  property._seekingTenant = false;
  addLog(`📢 „${property.name}" wird zum Mindestpreis ${formatEUR(minPrice)} angeboten.`, 'info');
}

/**
 * Versucht monatlich, ein zum Verkauf stehendes Objekt zu verkaufen.
 * Verkaufswahrscheinlichkeit hängt von Preis vs. fair value und Markt ab.
 * @param {object} state – mutable draft
 * @param {object} property – mutable
 * @returns {boolean} true = verkauft
 */
export function trySellMonthly(state, property) {
  if (!property.selling.onMarket) return false;

  const zone = getZone(state.market, property.location.cityId, property.location.zoneId);
  const arvBase = property.appraisal.arv ||
    Math.round(property.areaM2 * zone.pricePerM2 * state.market.rentIndex);
  const fair = Math.round(arvBase * (1 + (state.market.heat - 50) / 500));

  // Verkaufswahrscheinlichkeit
  const priceRatio = property.selling.minPrice / fair;
  let sellProb = 0.15 + (state.market.heat / 200);
  if (priceRatio > 1) {
    sellProb *= Math.max(0, 1 - (priceRatio - 1) * 3);
  } else {
    sellProb *= Math.min(1.5, 1 + (1 - priceRatio) * 2);
  }
  sellProb = clamp(sellProb, 0.02, 0.6);

  if (Math.random() > sellProb) return false;

  // Verkauf abwickeln
  const sellPrice = Math.max(property.selling.minPrice, Math.round(fair * rnd(0.97, 1.03)));
  const sellingCosts = Math.round(sellPrice * 0.025); // ca. 2,5 % Verkaufskosten
  const restschuld = property.mortgage ? property.mortgage.principal : 0;
  const proceeds = sellPrice - sellingCosts - restschuld;

  state.cash += proceeds;
  state.portfolio = state.portfolio.filter((p) => p.id !== property.id);

  addLog(
    `💰 „${property.name}" verkauft für ${formatEUR(sellPrice)}. Erlös nach Kosten & Schulden: ${formatEUR(proceeds)}.`,
    proceeds > 0 ? 'success' : 'danger'
  );

  return true;
}

/**
 * Startet die Mietersuche für ein Objekt.
 * @param {object} state – mutable draft
 * @param {object} property – mutable
 * @param {number} rent – gewünschte Kaltmiete
 */
export function startRenting(state, property, rent) {
  if (!property.reno.done) {
    addLog(`❌ „${property.name}": Renovierung noch nicht abgeschlossen.`, 'warn');
    return;
  }
  property.rentCurrent = rent;
  property._seekingTenant = true;

  // Bewerber generieren – Anzahl sinkt bei überhöhtem Mietpreis
  const zone = getZone(state.market, property.location.cityId, property.location.zoneId);
  const marketRentMid = Math.round(property.areaM2 * property.rentPotentialM2);
  property.applicants = generateApplicants(zone, state.market, rent, marketRentMid);

  // Hinweis wenn Mietpreis deutlich über Mietspiegel
  const ratio = rent / marketRentMid;
  if (ratio > 1.3) {
    addLog(`⚠ Mietpreis für „${property.name}" ist ${Math.round((ratio - 1) * 100)} % über Mietspiegel – kaum Anfragen zu erwarten.`, 'warn');
  } else if (ratio > 1.2) {
    addLog(`⚠ Mietpreis für „${property.name}" ist ${Math.round((ratio - 1) * 100)} % über Mietspiegel – wenige Anfragen.`, 'warn');
  } else {
    addLog(`🔍 Mietersuche für „${property.name}" gestartet – Miete ${formatEUR(rent)}/Monat.`, 'info');
  }
}

/**
 * Lässt einen Bewerber einziehen.
 * @param {object} property – mutable
 * @param {string} applicantId
 */
export function moveInApplicant(property, applicantId) {
  const applicant = (property.applicants || []).find((a) => a.id === applicantId);
  if (!applicant) return;

  property.occupied = true;
  property._seekingTenant = false;
  property.applicants = [];

  addLog(`🏠 Mieter eingezogen in „${property.name}" – Miete ${formatEUR(property.rentCurrent)}/Monat.`, 'success');
}

/**
 * Berechnet den geschätzten monatlichen Netto-Cashflow eines Objekts.
 * @param {object} property
 * @returns {number}
 */
export function estimateMonthlyCashflow(property) {
  // Rate nur abziehen wenn noch Restschuld vorhanden
  const rate = (property.mortgage?.principal > 0) ? (property.mortgage?.monthlyPayment || 0) : 0;
  const maintFull = Math.round((property.price * property.maintPctAnnual) / 12);
  const autoMgmtFee = property.autoMgmt ? 5 : 0;

  if (!property.occupied) {
    // Leerstand: reduzierte Betriebskosten (40 % der normalen Instandhaltung)
    return -(rate + Math.round(maintFull * 0.4) + autoMgmtFee);
  }

  const netRent = property.rentCurrent * (1 - property.mgmtPct);
  const maint = maintFull;
  return Math.round(netRent - maint - rate - autoMgmtFee);
}

