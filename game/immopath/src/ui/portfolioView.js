/**
 * portfolioView.js – Portfolio-Ansicht für IMMOPATH
 * Zeigt alle Objekte im Portfolio mit Restschuld, Belegung, Miete, Rate, Zustand, Lage
 */

import { getState } from '../state.js';
import { estimateMonthlyCashflow } from '../properties.js';
import { formatEUR } from '../utils.js';
import { createBadge, createCategoryBadge, createProgressBar } from './components.js';
import { navigate } from '../router.js';

/**
 * Rendert die Portfolio-Ansicht in #app.
 */
export function renderPortfolioView() {
  const app = document.getElementById('app');
  if (!app) return;

  const state = getState();
  app.innerHTML = '';

  if (state.portfolio.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML = `
      <p>📦 Noch keine Objekte im Portfolio.</p>
      <p>Besuche den <a href="#/market" class="link">Marktplatz</a>, um dein erstes Objekt zu kaufen.</p>
    `;
    app.appendChild(empty);
    return;
  }

  // Portfolio-Zusammenfassung
  const totalCF = state.portfolio.reduce((s, p) => s + estimateMonthlyCashflow(p), 0);
  const totalDebt = state.portfolio.reduce((s, p) => s + (p.mortgage?.principal || 0), 0);
  // Zeitwert = aktueller property.price (wächst monatlich durch Inflation)
  const totalValue = state.portfolio.reduce((s, p) => s + p.price, 0);
  const totalARV = state.portfolio.reduce((s, p) => s + (p.appraisal?.arv || 0), 0);

  const summary = document.createElement('div');
  summary.className = 'portfolio-summary';
  summary.innerHTML = `
    <div class="kpi-row">
      <div class="kpi"><span class="kpi__label">Objekte</span><span class="kpi__value">${state.portfolio.length}</span></div>
      <div class="kpi ${totalCF >= 0 ? 'kpi--positive' : 'kpi--negative'}">
        <span class="kpi__label">Gesamt-CF/Mo.</span>
        <span class="kpi__value">${totalCF >= 0 ? '+' : ''}${formatEUR(totalCF)}</span>
      </div>
      <div class="kpi"><span class="kpi__label">Ges. Restschuld</span><span class="kpi__value">${formatEUR(totalDebt)}</span></div>
      <div class="kpi"><span class="kpi__label">Ges. Zeitwert</span><span class="kpi__value">${formatEUR(totalValue)}</span></div>
      ${totalARV > 0 ? `<div class="kpi"><span class="kpi__label">Ges. ARV (Gutachten)</span><span class="kpi__value">${formatEUR(totalARV)}</span></div>` : ''}
    </div>
  `;
  app.appendChild(summary);

  const grid = document.createElement('div');
  grid.className = 'offer-grid';
  grid.setAttribute('aria-label', 'Portfolio-Objekte');

  for (const property of state.portfolio) {
    grid.appendChild(_buildPropertyCard(property));
  }
  app.appendChild(grid);
}

/** Gibt Status-Label für ein Portfolio-Objekt zurück. */
function _statusLabel(property) {
  if (property.selling.onMarket) return '🏷️ Zum Verkauf';
  if (property.occupied) return '✅ Vermietet';
  if (property.reno && !property.reno.done) return '🔨 Renovierung';
  return '🔍 Leer';
}

/** Gibt CSS-Klasse für den Status zurück. */
function _statusClass(property) {
  if (property.selling.onMarket) return 'status--selling';
  if (property.occupied) return 'status--occupied';
  if (property.reno && !property.reno.done) return 'status--reno';
  return 'status--vacant';
}

/** Gibt lesbares Restlaufzeit-Label zurück. */
function _termLabel(property) {
  if (!property.mortgage || property.mortgage.principal <= 0) return '✅ abbezahlt';
  if (property.mortgage.termMonths > 0) return `${property.mortgage.termMonths} Mo.`;
  return '< 1 Mo.';
}

/** Erzeugt das KPI-Grid-HTML für eine Portfolio-Karte. */
function _buildKpiGrid(property) {
  const cf = estimateMonthlyCashflow(property);
  const cfClass = cf >= 0 ? 'kpi--positive' : 'kpi--negative';
  const restschuld = property.mortgage?.principal || 0;
  const equity = property.price - restschuld;
  const purchasePrice = property.purchasePrice ?? property.price;
  const valueGain = property.price - purchasePrice;
  const valueGainClass = valueGain >= 0 ? 'kpi--positive' : 'kpi--negative';
  const valueGainStr = valueGain !== 0
    ? `<small>(${valueGain >= 0 ? '+' : ''}${formatEUR(valueGain)})</small>`
    : '';

  return `
    <div class="kpi-grid">
      <div class="kpi"><span class="kpi__label">Kaufpreis</span><span class="kpi__value">${formatEUR(purchasePrice)}</span></div>
      <div class="kpi ${valueGainClass}"><span class="kpi__label">Zeitwert</span><span class="kpi__value">${formatEUR(property.price)} ${valueGainStr}</span></div>
      <div class="kpi"><span class="kpi__label">ARV (Gutachten)</span><span class="kpi__value">${property.appraisal?.arv ? formatEUR(property.appraisal.arv) : '–'}</span></div>
      <div class="kpi"><span class="kpi__label">Restschuld</span><span class="kpi__value">${formatEUR(restschuld)}</span></div>
      <div class="kpi"><span class="kpi__label">Eigenkapital</span><span class="kpi__value">${formatEUR(equity)}</span></div>
      <div class="kpi"><span class="kpi__label">Akt. Miete/Mo.</span><span class="kpi__value">${property.occupied ? formatEUR(property.rentCurrent) : '–'}</span></div>
      <div class="kpi"><span class="kpi__label">Rate/Mo.</span><span class="kpi__value">${formatEUR(property.mortgage?.monthlyPayment || 0)}</span></div>
      <div class="kpi ${cfClass}"><span class="kpi__label">CF/Mo.</span><span class="kpi__value">${cf >= 0 ? '+' : ''}${formatEUR(cf)}</span></div>
      <div class="kpi"><span class="kpi__label">Fläche</span><span class="kpi__value">${property.areaM2} m²</span></div>
      <div class="kpi"><span class="kpi__label">Restlaufzeit</span><span class="kpi__value">${_termLabel(property)}</span></div>
    </div>`;
}

/** Erzeugt den Reno-Fortschritts-HTML-Block (leer wenn keine aktive Reno). */
function _buildRenoBlock(property) {
  if (!property.reno || property.reno.done) return '';
  const pct = 100 - Math.round(
    property.reno.remainingCost / (property.reno.weeklySpend * 16 || 1) * 100
  );
  return `
    <div class="card__reno-progress">
      <span class="kpi__label">Reno-Fortschritt</span>
      ${createProgressBar(pct, 'Renovierungsfortschritt').outerHTML}
      <small>Noch ${formatEUR(property.reno.remainingCost)} offen</small>
    </div>`;
}

/** Baut eine Portfolio-Karte */
function _buildPropertyCard(property) {
  const card = document.createElement('article');
  card.className = 'card portfolio-card';
  card.setAttribute('aria-label', property.name);
  card.dataset.propId = property.id;

  card.innerHTML = `
    <header class="card__header">
      <h3 class="card__title">${property.name}</h3>
      <div class="card__badges"></div>
    </header>
    <div class="card__status ${_statusClass(property)}">${_statusLabel(property)}</div>
    <div class="card__body">
      ${_buildKpiGrid(property)}
      <div class="card__condition">
        <span class="kpi__label">Zustand ${Math.round(property.building.condition)}/100</span>
        ${createProgressBar(property.building.condition, `Zustand: ${Math.round(property.building.condition)}`).outerHTML}
      </div>
      ${_buildRenoBlock(property)}
    </div>
    <footer class="card__footer">
      <button class="btn btn--primary btn--sm" data-action="detail" aria-label="Details zu ${property.name}">
        Details
      </button>
    </footer>
  `;

  const badges = card.querySelector('.card__badges');
  badges.appendChild(createCategoryBadge(property.category));
  badges.appendChild(createBadge(property.location.zoneId));
  if (property.autoMgmt) {
    const autoMgmtBadge = createBadge('🤖 Auto');
    autoMgmtBadge.classList.add('badge--auto-mgmt');
    autoMgmtBadge.title = 'Automatische Mieterverwaltung aktiv (5 €/Mo.)';
    badges.appendChild(autoMgmtBadge);
  }

  card.querySelector('[data-action="detail"]').addEventListener('click', () => {
    navigate(`/property/${property.id}`);
  });

  return card;
}

