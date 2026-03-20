/**
 * settingsView.js – Einstellungen-Seite für IMMOPATH
 * Enthält: Spielstand zurücksetzen, Geschwindigkeitsregler, Debug-Infos
 */

import { getState } from '../state.js';
import { setSpeed } from '../time.js';
import { formatEUR, formatDate } from '../utils.js';

/**
 * Rendert die Einstellungen-Seite in #app.
 */
export function renderSettingsView() {
  const app = document.getElementById('app');
  if (!app) return;

  const s = getState();
  app.innerHTML = '';

  const section = document.createElement('section');
  section.className = 'settings-view';
  section.setAttribute('aria-label', 'Einstellungen');

  section.innerHTML = `
    <h2 class="settings-view__title">⚙️ Einstellungen</h2>

    <!-- Geschwindigkeit -->
    <div class="settings-card">
      <h3 class="settings-card__title">🕐 Zeitraffer-Geschwindigkeit</h3>
      <label for="settings-speed" class="dialog__label">
        Tempo: <strong id="settings-speed-label">${s.daysPerSecond}×</strong>
        <small>(Tage pro Sekunde)</small>
      </label>
      <input id="settings-speed" type="range" min="1" max="60" value="${s.daysPerSecond}"
        step="1" class="hud__speed-range"
        aria-label="Zeitraffer-Geschwindigkeit"
        aria-valuemin="1" aria-valuemax="60" aria-valuenow="${s.daysPerSecond}"
      />
    </div>

    <!-- Spielstand zurücksetzen -->
    <div class="settings-card settings-card--danger">
      <h3 class="settings-card__title">⚠️ Spielstand zurücksetzen</h3>
      <p class="settings-card__desc">
        Setzt alle Fortschritte unwiderruflich auf den Startzustand zurück.
        Portfolio, Kasse, Ereignisprotokoll und Markthistorie gehen verloren.
      </p>
      <button id="settings-btn-reset" class="btn btn--danger" aria-label="Spielstand zurücksetzen">
        Zurücksetzen
      </button>
    </div>

    <!-- Debug-Infos -->
    <details class="settings-card settings-card--debug">
      <summary class="settings-card__title">🛠️ Debug-Informationen</summary>
      <dl class="debug-list">
        <dt>Version</dt><dd>${s.version ?? 1}</dd>
        <dt>Spielstand-Datum</dt><dd>${formatDate(s.dateISO)}</dd>
        <dt>Kasse</dt><dd>${formatEUR(s.cash)}</dd>
        <dt>Bonität</dt><dd>${s.creditScore}</dd>
        <dt>Portfolio-Objekte</dt><dd>${s.portfolio.length}</dd>
        <dt>Aktive Angebote</dt><dd>${s.offers.length}</dd>
        <dt>Log-Einträge</dt><dd>${s.log.length}</dd>
        <dt>History-Snapshots</dt><dd>${s.history.length}</dd>
        <dt>Markt-Heat</dt><dd>${Math.round(s.market.heat)}</dd>
        <dt>Leitzins</dt><dd>${(s.market.baseInterest * 100).toFixed(2)} %</dd>
        <dt>Mietindex</dt><dd>${s.market.rentIndex.toFixed(3)}</dd>
      </dl>
    </details>
  `;

  app.appendChild(section);

  // Geschwindigkeitsregler
  const speedInput = section.querySelector('#settings-speed');
  const speedLabel = section.querySelector('#settings-speed-label');
  speedInput?.addEventListener('input', () => {
    const val = Number(speedInput.value);
    setSpeed(val);
    if (speedLabel) speedLabel.textContent = `${val}×`;
  });

  // Reset-Button
  section.querySelector('#settings-btn-reset')?.addEventListener('click', () => {
    if (confirm('Wirklich zurücksetzen? Alle Fortschritte gehen unwiderruflich verloren!')) {
      localStorage.clear();
      location.reload();
    }
  });
}

