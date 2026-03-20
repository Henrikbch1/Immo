/**
 * marketView.js – Marktplatz-Ansicht für IMMOPATH
 * Zeigt Angebotskarten mit Filter & Sortierung
 */

import { getState } from '../state.js';
import { rentBand } from '../marketplace.js';
import { estimatePurchaseCosts, equityRange, getEffectiveRate } from '../financing.js';
import { formatEUR, formatPct } from '../utils.js';
import { createBadge, createCategoryBadge } from './components.js';
import { openBuyDialog } from './dialogs.js';
import { navigate } from '../router.js';

/** Aktueller Filterzustand */
let _filters = {
  zone: 'all',
  category: 'all',
  minM2: '',
  maxM2: '',
  minPrice: '',
  maxPrice: '',
};

let _sortKey = 'price';
let _sortAsc = true;

/**
 * Rendert die gesamte Marktplatz-Ansicht in #app.
 */
export function renderMarketView() {
  const app = document.getElementById('app');
  if (!app) return;

  const state = getState();

  // Filter-Bar
  const filterBar = _buildFilterBar();

  // Angebote filtern & sortieren
  const filtered = _applyFilters(state.offers, _filters);
  const sorted = _applySort(filtered, _sortKey, _sortAsc);

  // Container
  app.innerHTML = '';
  app.appendChild(filterBar);

  if (sorted.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'Keine Angebote gefunden. Warte auf neue Marktangebote oder passe die Filter an.';
    app.appendChild(empty);
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'offer-grid';
  grid.setAttribute('aria-label', `${sorted.length} Angebote`);

  const rate = getEffectiveRate(state);
  for (const offer of sorted) {
    grid.appendChild(_buildOfferCard(offer, state, rate));
  }
  app.appendChild(grid);
}

/** Baut die Filter-Leiste */
function _buildFilterBar() {
  const bar = document.createElement('div');
  bar.className = 'filter-bar';
  bar.setAttribute('aria-label', 'Angebote filtern');
  bar.innerHTML = `
    <div class="filter-bar__row">
      <label class="filter-bar__label">
        Lage
        <select id="f-zone" class="filter-bar__select" aria-label="Lage filtern">
          <option value="all">Alle Lagen</option>
          <option value="A">A-Lage</option>
          <option value="B">B-Lage</option>
          <option value="C">C-Lage</option>
        </select>
      </label>
      <label class="filter-bar__label">
        Typ
        <select id="f-cat" class="filter-bar__select" aria-label="Typ filtern">
          <option value="all">Alle Typen</option>
          <option value="apartment">ETW</option>
          <option value="house">EFH</option>
          <option value="mfh">MFH</option>
        </select>
      </label>
      <label class="filter-bar__label">
        m² von
        <input id="f-minm2" type="number" min="0" class="filter-bar__input" placeholder="Min" aria-label="Mindestgröße m²" />
      </label>
      <label class="filter-bar__label">
        m² bis
        <input id="f-maxm2" type="number" min="0" class="filter-bar__input" placeholder="Max" aria-label="Maximalgröße m²" />
      </label>
      <label class="filter-bar__label">
        Preis von
        <input id="f-minp" type="number" min="0" class="filter-bar__input" placeholder="Min €" aria-label="Mindestpreis" />
      </label>
      <label class="filter-bar__label">
        Preis bis
        <input id="f-maxp" type="number" min="0" class="filter-bar__input" placeholder="Max €" aria-label="Maximalpreis" />
      </label>
      <label class="filter-bar__label">
        Sortieren nach
        <select id="f-sort" class="filter-bar__select" aria-label="Sortierung">
          <option value="price">Preis</option>
          <option value="pricePerM2">€/m²</option>
          <option value="areaM2">Fläche</option>
          <option value="building.year">Baujahr</option>
          <option value="building.condition">Zustand</option>
        </select>
      </label>
      <button id="f-sort-dir" class="btn btn--icon" aria-label="Sortierrichtung" title="Sortierrichtung">▲</button>
    </div>
  `;

  // Aktuelle Filter-Werte setzen
  bar.querySelector('#f-zone').value = _filters.zone;
  bar.querySelector('#f-cat').value = _filters.category;
  bar.querySelector('#f-minm2').value = _filters.minM2;
  bar.querySelector('#f-maxm2').value = _filters.maxM2;
  bar.querySelector('#f-minp').value = _filters.minPrice;
  bar.querySelector('#f-maxp').value = _filters.maxPrice;
  bar.querySelector('#f-sort').value = _sortKey;
  bar.querySelector('#f-sort-dir').textContent = _sortAsc ? '▲' : '▼';

  // Listener
  const rerender = () => renderMarketView();
  bar.querySelector('#f-zone').addEventListener('change', (e) => { _filters.zone = e.target.value; rerender(); });
  bar.querySelector('#f-cat').addEventListener('change', (e) => { _filters.category = e.target.value; rerender(); });
  bar.querySelector('#f-minm2').addEventListener('input', (e) => { _filters.minM2 = e.target.value; rerender(); });
  bar.querySelector('#f-maxm2').addEventListener('input', (e) => { _filters.maxM2 = e.target.value; rerender(); });
  bar.querySelector('#f-minp').addEventListener('input', (e) => { _filters.minPrice = e.target.value; rerender(); });
  bar.querySelector('#f-maxp').addEventListener('input', (e) => { _filters.maxPrice = e.target.value; rerender(); });
  bar.querySelector('#f-sort').addEventListener('change', (e) => { _sortKey = e.target.value; rerender(); });
  bar.querySelector('#f-sort-dir').addEventListener('click', () => { _sortAsc = !_sortAsc; rerender(); });

  return bar;
}

/** Baut eine Angebotskarte */
function _buildOfferCard(offer, state, rate) {
  const card = document.createElement('article');
  card.className = 'card offer-card';
  card.setAttribute('aria-label', offer.name);
  card.dataset.offerId = offer.id;

  const band = rentBand(offer);
  const eqRange = equityRange(offer.category);
  const costs = estimatePurchaseCosts(offer, eqRange.default, rate, 360);
  const canAfford = state.cash >= costs.totalCashNeed;

  // Zustandsfarbe separat (kein nested ternary)
  let condColor;
  if (offer.building.condition >= 70) {
    condColor = 'positive';
  } else if (offer.building.condition >= 40) {
    condColor = 'neutral';
  } else {
    condColor = 'negative';
  }

  card.innerHTML = `
    <header class="card__header">
      <h3 class="card__title">${offer.name}</h3>
      <div class="card__badges"></div>
    </header>
    <div class="card__body">
      <div class="kpi-grid">
        <div class="kpi"><span class="kpi__label">Preis</span><span class="kpi__value">${formatEUR(offer.price)}</span></div>
        <div class="kpi"><span class="kpi__label">€/m²</span><span class="kpi__value">${formatEUR(offer.pricePerM2)}</span></div>
        <div class="kpi"><span class="kpi__label">Fläche</span><span class="kpi__value">${offer.areaM2} m²</span></div>
        <div class="kpi"><span class="kpi__label">Einheiten</span><span class="kpi__value">${offer.building.units}</span></div>
        <div class="kpi"><span class="kpi__label">Etage</span><span class="kpi__value">${offer.building.floor === 0 ? 'EG' : offer.building.floor + '. OG'}</span></div>
        <div class="kpi"><span class="kpi__label">Stellplätze</span><span class="kpi__value">${offer.building.parkingSpots}</span></div>
        <div class="kpi kpi--${condColor}"><span class="kpi__label">Zustand</span><span class="kpi__value">${offer.building.condition}/100</span></div>
        <div class="kpi"><span class="kpi__label">Baujahr</span><span class="kpi__value">${offer.building.year}</span></div>
        <div class="kpi"><span class="kpi__label">Energie</span><span class="kpi__value">${offer.building.energyClass}</span></div>
        <div class="kpi"><span class="kpi__label">Makler</span><span class="kpi__value">${formatPct(offer.fees.agentPct)}</span></div>
      </div>
      <div class="card__rent-band">
        <span class="card__rent-label">Miet-Schätzung:</span>
        <span class="card__rent-range">${formatEUR(band.low)} – ${formatEUR(band.high)}/Mo.</span>
      </div>
      <div class="card__cash-need ${canAfford ? '' : 'card__cash-need--danger'}">
        Kassenbedarf (EK+NK): <strong>${formatEUR(costs.totalCashNeed)}</strong>
        ${canAfford ? '' : ' <span class="text--danger">⚠ Nicht genug Kapital</span>'}
      </div>
    </div>
    <footer class="card__footer">
      <button class="btn btn--secondary btn--sm" data-action="detail">Details</button>
      <button class="btn btn--primary btn--sm" data-action="buy">Kaufen</button>
    </footer>
  `;

  // Badges einfügen
  const badges = card.querySelector('.card__badges');
  badges.appendChild(createCategoryBadge(offer.category));
  badges.appendChild(createBadge(offer.location.zoneId));

  // Button-Listener
  card.querySelector('[data-action="detail"]').addEventListener('click', () => {
    navigate(`/property/${offer.id}?from=market`);
  });
  card.querySelector('[data-action="buy"]').addEventListener('click', () => {
    openBuyDialog(offer);
  });

  return card;
}

/** Filtert Angebote */
function _applyFilters(offers, f) {
  return offers.filter((o) => {
    if (f.zone !== 'all' && o.location.zoneId !== f.zone) return false;
    if (f.category !== 'all' && o.category !== f.category) return false;
    if (f.minM2 && o.areaM2 < Number(f.minM2)) return false;
    if (f.maxM2 && o.areaM2 > Number(f.maxM2)) return false;
    if (f.minPrice && o.price < Number(f.minPrice)) return false;
    return !(f.maxPrice && o.price > Number(f.maxPrice));
  });
}

/** Sortiert Angebote */
function _applySort(offers, key, asc) {
  return [...offers].sort((a, b) => {
    let va = _get(a, key);
    let vb = _get(b, key);
    if (typeof va === 'string') va = va.toLowerCase();
    if (typeof vb === 'string') vb = vb.toLowerCase();
    if (va < vb) return asc ? -1 : 1;
    if (va > vb) return asc ? 1 : -1;
    return 0;
  });
}

/** Tiefen-Zugriff mit Punkt-Notation */
function _get(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}








