/**
 * time.js – Zeitsteuerung und Monatsabschluss für IMMOPATH
 * Zeitraffer: Standard 3 Tage/Sekunde, einstellbar 1–60x
 * Täglicher Tick via setInterval; Monatsanfangs-Hook für Abrechnung
 */

import { getState, setState, save, addLogToDraft } from './state.js';
import { evolveMarket } from './market.js';
import { rollOffers } from './marketplace.js';
import { monthlyOperateProperty, trySellMonthly, estimateMonthlyCashflow } from './properties.js';
import { rollGlobalEvent, applyGlobalEvent } from './events.js';
import { clamp, addDays, fromISO, toISO, formatEUR } from './utils.js';

let _intervalId = null;
let _lastDate = null;

/** Callbacks die nach jedem Tick ausgeführt werden */
const _tickListeners = new Set();

/**
 * Registriert einen Tick-Listener.
 * @param {() => void} fn
 * @returns {() => void}
 */
export function onTick(fn) {
  _tickListeners.add(fn);
  return () => _tickListeners.delete(fn);
}

function _notifyTick() {
  for (const fn of _tickListeners) {
    try { fn(); } catch (e) { console.error('[time] Tick-Listener-Fehler:', e); }
  }
}

/**
 * Startet den Zeitraffer.
 */
export function startTime() {
  if (_intervalId) return;
  _lastDate = fromISO(getState().dateISO);
  _scheduleNext();
  setState((s) => ({ ...s, running: true }));
}

/**
 * Pausiert den Zeitraffer.
 */
export function pauseTime() {
  if (_intervalId) {
    clearTimeout(_intervalId);
    _intervalId = null;
  }
  setState((s) => ({ ...s, running: false }));
}

/**
 * Toggled Start/Pause.
 */
export function toggleTime() {
  const state = getState();
  if (state.running) {
    pauseTime();
  } else {
    startTime();
  }
}

function _scheduleNext() {
  const state = getState();
  const msPerDay = 1000 / state.daysPerSecond;
  _intervalId = setTimeout(_tick, msPerDay);
}

/**
 * Ein Tages-Tick: Datum um 1 Tag vorrücken, bei Monatsanfang Abrechnung.
 */
function _tick() {
  _intervalId = null;

  setState((s) => {
    if (!s.running) return s;

    const oldDate = fromISO(s.dateISO);
    const newDate = addDays(oldDate, 1);
    s.dateISO = toISO(newDate);

    // Monatswechsel prüfen
    const wasMonth = oldDate.getUTCMonth();
    const isMonth = newDate.getUTCMonth();
    if (wasMonth !== isMonth) {
      s = _monthlyClose(s, toISO(newDate));
    }

    return s;
  });

  _notifyTick();

  // Nächsten Tick planen, wenn noch laufend
  if (getState().running) {
    _scheduleNext();
  }
}

/**
 * Führt den Monatsabschluss durch (beim ersten Tag eines neuen Monats).
 * - Gehalt / Lebenshaltungskosten
 * - Marktentwicklung
 * - Neue Angebote
 * - Objekt-Betrieb (Miete, Raten, Reno, Leerstand, Verkauf)
 * - Globale Events
 * - Bonität anpassen
 * - History-Snapshot
 * - Autosave
 * @param {object} s – mutable draft
 * @param {string} dateISO
 * @returns {object}
 */
function _monthlyClose(s, dateISO) {
  // 1. Gehalt und Lebenshaltungskosten
  s.cash += s.netIncome - s.livingCosts;

  // 2. Marktentwicklung
  s.market = evolveMarket(s.market);

  // 3. Abgelaufene Angebote entfernen, dann immer neue nachziehen (max. 25)
  s.offers = s.offers.filter((o) => !o.expiresAt || o.expiresAt > dateISO);
  const newOffers = rollOffers(s.market, dateISO);
  s.offers = [...s.offers, ...newOffers].slice(-25);

  // 4. Objekte betreiben
  for (const property of s.portfolio) {
    monthlyOperateProperty(s, property, dateISO);
  }

  // 5. Verkaufsversuche
  for (const property of s.portfolio) {
    if (property.selling.onMarket) {
      trySellMonthly(s, property);
    }
  }

  // 6. Globales Zufalls-Event – direkt in Draft loggen (kein zweiter setState)
  const event = rollGlobalEvent();
  if (event) {
    const result = applyGlobalEvent(event, s);
    s = result.state;
    addLogToDraft(s, result.logText, result.severity);
  }

  // 7. Bonität anpassen
  if (s.cash < -200) {
    s.creditScore = clamp(s.creditScore - 12, 300, 850);
  } else {
    const totalDebt = s.portfolio.reduce((sum, p) => sum + (p.mortgage?.monthlyPayment || 0), 0);
    const dti = totalDebt / s.netIncome;
    if (dti < 0.35 && s.cash >= 0) {
      s.creditScore = clamp(s.creditScore + 4, 300, 850);
    }
  }

  // 8. History-Snapshot (max. 120 Einträge = 10 Jahre monatlich)
  s.history = [
    ...s.history.slice(-119),
    { t: dateISO, cash: Math.round(s.cash), credit: s.creditScore },
  ];

  // 9. Monatsabschluss-Log direkt in Draft schreiben
  const monthCashflow = s.portfolio.reduce(
    (sum, p) => sum + estimateMonthlyCashflow(p), 0
  );
  addLogToDraft(
    s,
    `📅 Monatsabschluss ${dateISO}: Kasse ${formatEUR(s.cash)} | Bonität ${s.creditScore} | CF ${formatEUR(monthCashflow)}`,
    'info'
  );

  // 10. Autosave
  save();

  return s;
}

/**
 * Setzt die Ticks-pro-Sekunde (Zeitraffer-Geschwindigkeit).
 * @param {number} dps – 1..60
 */
export function setSpeed(dps) {
  const val = clamp(Math.round(dps), 1, 60);
  setState((s) => ({ ...s, daysPerSecond: val }));
  // Timer neu starten um neue Geschwindigkeit zu nutzen
  if (getState().running) {
    if (_intervalId) clearTimeout(_intervalId);
    _intervalId = null;
    _scheduleNext();
  }
}


