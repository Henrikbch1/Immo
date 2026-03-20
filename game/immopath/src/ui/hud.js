/**
 * hud.js – Head-Up-Display für IMMOPATH
 * Datum, Kasse, Cashflow, Bonität, Start/Pause, Tempo, Speichern, Reset
 */

import { getState, save } from '../state.js';
import { toggleTime, setSpeed } from '../time.js';
import { formatEUR, formatDate } from '../utils.js';

let _hudDate, _hudCash, _hudCashflow, _hudCredit, _btnToggle, _speedInput;

/**
 * Initialisiert das HUD (bindet Event-Listener).
 * Wird von main.js aufgerufen – muss einmalig nach dem DOM-Load ausgeführt werden.
 */
export function initHUD() {
  _hudDate     = document.getElementById('hud-date');
  _hudCash     = document.getElementById('hud-cash');
  _hudCashflow = document.getElementById('hud-cashflow');
  _hudCredit   = document.getElementById('hud-credit');
  _btnToggle   = document.getElementById('btn-toggle-run');
  _speedInput  = document.getElementById('speed');

  _bindToggle();
  _bindSpeed();
  _bindSave();
  _bindKeyboard();

  updateHUD();
}

function _bindToggle() {
  _btnToggle?.addEventListener('click', () => { toggleTime(); updateHUD(); });
}

function _bindSpeed() {
  _speedInput?.addEventListener('input', () => {
    setSpeed(Number(_speedInput.value));
    const lbl = document.getElementById('speed-label');
    if (lbl) lbl.textContent = `${_speedInput.value}×`;
  });
}

function _bindSave() {
  document.getElementById('btn-save')?.addEventListener('click', () => { save(); _flashSave(); });
}


function _bindKeyboard() {
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target === document.body) {
      e.preventDefault();
      toggleTime();
      updateHUD();
    }
  });
}

/**
 * Aktualisiert alle HUD-Anzeigen mit dem aktuellen State.
 * Aufgeteilt in Hilfsfunktionen um Cognitive Complexity ≤ 15 zu halten.
 */
export function updateHUD() {
  const s = getState();
  _updateDate(s);
  _updateCash(s);
  _updateCashflow(s);
  _updateCredit(s);
  _updateControls(s);
}

function _updateDate(s) {
  if (_hudDate) _hudDate.textContent = formatDate(s.dateISO);
}

function _updateCash(s) {
  if (!_hudCash) return;
  _hudCash.textContent = formatEUR(s.cash);
  _hudCash.className = `hud__cash${s.cash < 0 ? ' hud__cash--negative' : ''}`;
}

function _updateCashflow(s) {
  if (!_hudCashflow) return;
  const monthlyCF = _estimateMonthlyCashflow(s);
  const sign = monthlyCF >= 0 ? '+' : '';
  _hudCashflow.textContent = `CF: ${sign}${formatEUR(monthlyCF)}`;
  _hudCashflow.className = `hud__cashflow${monthlyCF < 0 ? ' hud__cashflow--negative' : ''}`;

  // Sparbetrag (Gehalt − Lebenshaltung) separat anzeigen
  const savings = document.getElementById('hud-savings');
  if (savings) {
    const savingsVal = s.netIncome - s.livingCosts;
    const savingsSign = savingsVal >= 0 ? '+' : '';
    savings.textContent = `Sparbetrag: ${savingsSign}${formatEUR(savingsVal)}`;
    savings.className = `hud__item hud__savings${savingsVal < 0 ? ' hud__savings--negative' : ''}`;
  }
}

function _updateCredit(s) {
  if (!_hudCredit) return;
  _hudCredit.textContent = `Bonität: ${s.creditScore}`;
  _hudCredit.className = `hud__credit${_creditClass(s.creditScore)}`;
}

function _updateControls(s) {
  if (_btnToggle) {
    _btnToggle.textContent = s.running ? 'Pause' : 'Start';
    _btnToggle.setAttribute('aria-pressed', String(s.running));
  }
  if (_speedInput) {
    _speedInput.value = String(s.daysPerSecond);
    const lbl = document.getElementById('speed-label');
    if (lbl) lbl.textContent = `${s.daysPerSecond}×`;
  }
}

/** Berechnet den reinen Portfolio-Netto-Cashflow (Miete − Verwaltung − Instandhaltung − Rate). */
function _estimateMonthlyCashflow(s) {
  let cf = 0;
  for (const p of s.portfolio) {
    const maintFull = Math.round((p.price * p.maintPctAnnual) / 12);
    // Rate nur wenn noch Restschuld > 0
    const rate = (p.mortgage?.principal > 0) ? (p.mortgage?.monthlyPayment || 0) : 0;
    if (p.occupied) {
      cf += Math.round(p.rentCurrent * (1 - p.mgmtPct));
      cf -= maintFull;
    } else {
      // Leerstand: nur 40 % der Instandhaltungskosten (kein Mieterverbrauch)
      cf -= Math.round(maintFull * 0.4);
    }
    cf -= rate;
    // Auto-Mieterverwaltungs-Gebühr
    if (p.autoMgmt) cf -= 5;
  }
  return cf;
}

/** CSS-Modifier für Bonitätsklassen */
function _creditClass(score) {
  if (score >= 750) return ' hud__credit--excellent';
  if (score >= 650) return ' hud__credit--good';
  if (score >= 550) return ' hud__credit--fair';
  return ' hud__credit--poor';
}

/** Kurzes visuelles Feedback beim Speichern */
function _flashSave() {
  const btn = document.getElementById('btn-save');
  if (!btn) return;
  const orig = btn.textContent;
  btn.textContent = '✓ Gespeichert';
  setTimeout(() => { btn.textContent = orig; }, 1500);
}
