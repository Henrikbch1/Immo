/**
 * financing.js – Finanzierungslogik für IMMOPATH
 * Annuitätenrechnung, Nebenkosten, DTI-Prüfung
 */

import { clamp } from './utils.js';
import { effectiveInterestRate } from './market.js';

/**
 * Berechnet die monatliche Annuitätsrate.
 * @param {number} P – Kreditbetrag
 * @param {number} annualRate – Jahreszins als Dezimal (z.B. 0.045)
 * @param {number} n – Laufzeit in Monaten
 * @returns {number}
 */
export function monthlyRate(P, annualRate, n) {
  const r = annualRate / 12;
  if (r === 0) return P / n;
  const a = Math.pow(1 + r, n);
  return (P * r * a) / (a - 1);
}

// ─── Eigenkapital-Grenzen nach Bonitätsstufe ────────────────────────────────

/** Lookup: [minScore, minEK_apartment, minEK_house, minEK_mfh] */
const EQ_TIERS = [
  [830, 0,    0,    0.02   ],
  [800, 0,    0,    0.05   ],
  [700, 0.05, 0.05, 0.05],
  [680, 0.10, 0.10, 0.12],
  [620, 0.15, 0.15, 0.15],
  [550, 0.20, 0.20, 0.25],
  [  0, 0.25, 0.30, 0.35],
];

/** Gibt den Eigenkapital-Bereich je Kategorie und Bonitätsscore zurück.
 * @param {string} category – 'apartment'|'house'|'mfh'
 * @param {number} creditScore – 300..850
 * @returns {{ min: number, max: number, default: number }}
 */
export function equityRangeForScore(category, creditScore) {
  const colIdx = category === 'house' ? 2 : category === 'mfh' ? 3 : 1;
  const tier = EQ_TIERS.find(([minScore]) => creditScore >= minScore) ?? EQ_TIERS[EQ_TIERS.length - 1];
  const min = tier[colIdx];
  return { min, max: 1, default: Math.min(1, min + 0.05) };
}

/**
 * Gibt den Mindest-Eigenkapitalanteil je Kategorie zurück (Mitte der Spanne).
 * @deprecated Verwende equityRangeForScore für bonitätsabhängige Grenzen.
 * @param {string} category – 'apartment'|'house'|'mfh'
 * @returns {{ min: number, max: number, default: number }}
 */
export function equityRange(category) {
  switch (category) {
    case 'mfh':
      return { min: 0.2, max: 0.25, default: 0.22 };
    case 'house':
      return { min: 0.15, max: 0.2, default: 0.17 };
    default: // apartment
      return { min: 0.1, max: 0.15, default: 0.12 };
  }
}

/**
 * Schätzt alle Kaufnebenkosten und den gesamten Kassenbedarf.
 * @param {object} offer – Offer-Objekt
 * @param {number} downPct – Eigenkapitalanteil als Dezimal (z.B. 0.12)
 * @param {number} annualRate – effektiver Jahreszins
 * @param {number} [termMonths=360]
 * @param {boolean} [includeKNK=false] – Nebenkosten mitfinanzieren (100 % + KNK):
 *   Kredit = Kaufpreis − Eigenkapital + Nebenkosten; Kassenbedarf = nur EK
 * @returns {{
 *   equity: number,
 *   agentFee: number,
 *   notaryFee: number,
 *   transferTax: number,
 *   miscFee: number,
 *   closingCosts: number,
 *   totalCashNeed: number,
 *   loan: number,
 *   monthlyPayment: number,
 *   annualRate: number,
 *   termMonths: number,
 *   includeKNK: boolean
 * }}
 */
export function estimatePurchaseCosts(offer, downPct, annualRate, termMonths = 360, includeKNK = false) {
  const { price, fees } = offer;
  const equity = Math.round(price * downPct);
  const agentFee = Math.round(price * fees.agentPct);
  const notaryFee = Math.round(price * fees.notaryPct);
  const transferTax = Math.round(price * fees.transferTaxPct);
  const miscFee = Math.round(price * fees.miscPct);
  const closingCosts = agentFee + notaryFee + transferTax + miscFee;

  // Bei 100%+KNK: NK werden auf den Kredit aufgeschlagen
  const loan          = includeKNK ? (price - equity + closingCosts) : (price - equity);
  const totalCashNeed = includeKNK ? equity : (equity + closingCosts);

  const payment = Math.round(monthlyRate(loan, annualRate, termMonths));

  return {
    equity,
    agentFee,
    notaryFee,
    transferTax,
    miscFee,
    closingCosts,
    totalCashNeed,
    loan,
    monthlyPayment: payment,
    annualRate,
    termMonths,
    includeKNK,
  };
}

/**
 * Prüft ob ein Darlehen den erweiterten DTI nicht übersteigt.
 *
 * Formel:
 *   Zähler  = max(Gesamtschuldendienst − Portfolio-CF − newRentCF, 0)
 *   Nenner  = netIncome + cash / 12
 *   DTI     = Zähler / Nenner  ≤ 0.40
 *
 * Dadurch werden Miet-Cashflows und vorhandenes Kapital als
 * Puffer angerechnet (analog realer Kreditvergabe).
 *
 * @param {object} state          – vollständiger Spielstand
 * @param {number} newMonthlyDebt – neue monatliche Kreditrate
 * @param {number} [newRentCF=0]  – erwarteter Netto-Cashflow des neuen Objekts
 * @returns {{
 *   ok: boolean,
 *   dti: number,
 *   currentDebt: number,
 *   portfolioCF: number,
 *   effectiveDebt: number,
 *   effectiveIncome: number
 * }}
 */
export function approveLoan(state, newMonthlyDebt, newRentCF = 0) {
  // ── Bei exzellenter Bonität (≥ 800) DTI irrelevant ───────────────────
  const excellentCredit = (state.creditScore ?? 0) >= 800;

  // ── Bestehende Kreditraten aus dem Portfolio ──────────────────────────
  const currentDebt = state.portfolio.reduce((sum, prop) => {
    return sum + (prop.mortgage ? prop.mortgage.monthlyPayment : 0);
  }, 0);

  // ── Netto-Cashflow aller vermieteten Objekte im Portfolio ─────────────
  // rentCurrent ist die tatsächliche Kaltmiete; wir ziehen die Rate ab,
  // um den monatlichen Überschuss zu ermitteln.
  const portfolioCF = state.portfolio.reduce((sum, prop) => {
    const rent = prop.rentCurrent ?? 0;
    const rate = prop.mortgage ? prop.mortgage.monthlyPayment : 0;
    return sum + Math.max(rent - rate, 0);
  }, 0);

  // ── Erweiterter Zähler & Nenner ───────────────────────────────────────
  const totalDebt     = currentDebt + newMonthlyDebt;
  const totalCF       = portfolioCF + Math.max(newRentCF, 0);
  const effectiveDebt = Math.max(totalDebt - totalCF, 0);

  // Nenner: Einkommen + monatlicher Kapitalanteil (Cash-Puffer über 12 Monate)
  const effectiveIncome = state.netIncome + (state.cash / 12);

  const dti = effectiveIncome > 0 ? effectiveDebt / effectiveIncome : 9.99;

  return {
    ok: excellentCredit || dti <= 0.4,
    dti: clamp(dti, 0, 9.99),
    currentDebt,
    portfolioCF,
    effectiveDebt,
    effectiveIncome,
    excellentCredit,
  };
}

/**
 * Berechnet den Zins- und Tilgungsanteil einer Rate für einen Monat.
 * @param {number} principal – aktuelle Restschuld
 * @param {number} annualRate
 * @param {number} monthlyPayment
 * @returns {{ interest: number, repayment: number, newPrincipal: number }}
 */
export function amortize(principal, annualRate, monthlyPayment) {
  const r = annualRate / 12;
  const interest = Math.round(principal * r * 100) / 100;
  const repayment = Math.min(monthlyPayment - interest, principal);
  const newPrincipal = Math.max(0, principal - repayment);
  return { interest, repayment: Math.round(repayment * 100) / 100, newPrincipal };
}

/**
 * Liefert den effektiven Zins basierend auf Markt und Bonität.
 * Wrapper für Zugriff aus dem Kauf-Dialog.
 * @param {object} state
 * @returns {number}
 */
export function getEffectiveRate(state) {
  return effectiveInterestRate(state.market, state.creditScore);
}






