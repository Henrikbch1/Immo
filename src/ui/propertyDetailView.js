/**
 * propertyDetailView.js – Objekt-Detail-Ansicht für IMMOPATH
 * Tabs: Vermietung, Renovierung, Bewertung, Verkauf, Finanzen
 */

import { getState, setState } from '../state.js';
import { startRenting, moveInApplicant, startRenovation, appraise, listForSale, renoEstimate } from '../properties.js';
import { rentBand } from '../marketplace.js';
import { formatEUR, formatPct, formatDate } from '../utils.js';
import { createBadge, createCategoryBadge, createProgressBar } from './components.js';
import { scoreApplicant } from '../tenants.js';
import { navigate } from '../router.js';

/** Aktiver Tab */
let _activeTab = 'rent';

/**
 * Rendert die Detailseite für ein Objekt (Portfolio oder Angebot).
 * @param {{ id: string }} params
 */
export function renderPropertyDetail(params) {
  const app = document.getElementById('app');
  if (!app) return;

  const state = getState();

  let property = state.portfolio.find((p) => p.id === params.id);
  const isOffer = !property;
  if (isOffer) {
    const offer = state.offers.find((o) => o.id === params.id);
    if (!offer) {
      app.innerHTML = '<p class="empty-state">Objekt nicht gefunden. <a href="#/market" class="link">Zum Marktplatz</a></p>';
      return;
    }
    _renderOfferDetail(app, offer);
    return;
  }

  _renderPortfolioDetail(app, property, state);
}

/** Rendert die Detail-Ansicht für ein Portfolio-Objekt */
function _renderPortfolioDetail(app, property, state) {
  app.innerHTML = '';

  // Zurück-Link
  const back = document.createElement('a');
  back.href = '#/portfolio';
  back.className = 'btn btn--back';
  back.setAttribute('aria-label', 'Zurück zum Portfolio');
  back.textContent = '← Portfolio';
  app.appendChild(back);

  // Objekt-Header
  const header = document.createElement('header');
  header.className = 'detail-header';
  header.innerHTML = `<h2 class="detail-header__title">${property.name}</h2>`;
  const badges = document.createElement('div');
  badges.className = 'detail-header__badges';
  badges.appendChild(createCategoryBadge(property.category));
  badges.appendChild(createBadge(property.location.zoneId));
  header.appendChild(badges);
  app.appendChild(header);

  // Basis-KPIs
  const kpiRow = document.createElement('div');
  kpiRow.className = 'kpi-row kpi-row--wrap';
  const band = rentBand({ areaM2: property.areaM2, rentPotentialM2: property.rentPotentialM2 });
  kpiRow.innerHTML = `
    <div class="kpi"><span class="kpi__label">Kaufpreis</span><span class="kpi__value">${formatEUR(property.price)}</span></div>
    <div class="kpi"><span class="kpi__label">Fläche</span><span class="kpi__value">${property.areaM2} m²</span></div>
    <div class="kpi"><span class="kpi__label">Zustand</span><span class="kpi__value">${property.building.condition}/100</span></div>
    <div class="kpi"><span class="kpi__label">Baujahr</span><span class="kpi__value">${property.building.year}</span></div>
    <div class="kpi"><span class="kpi__label">Energie</span><span class="kpi__value">${property.building.energyClass}</span></div>
    <div class="kpi"><span class="kpi__label">Restschuld</span><span class="kpi__value">${formatEUR(property.mortgage?.principal || 0)}</span></div>
    <div class="kpi"><span class="kpi__label">Miet-Band</span><span class="kpi__value">${formatEUR(band.low)}–${formatEUR(band.high)}/Mo.</span></div>
    <div class="kpi"><span class="kpi__label">ARV</span><span class="kpi__value">${property.appraisal?.arv ? formatEUR(property.appraisal.arv) : 'n.b.'}</span></div>
  `;
  app.appendChild(kpiRow);

  // Tab-Navigation
  const tabs = ['rent', 'reno', 'appraisal', 'sell', 'finance'];
  const tabLabels = { rent: '🏠 Vermietung', reno: '🔨 Renovierung', appraisal: '📋 Bewertung', sell: '💰 Verkauf', finance: '💳 Finanzen' };
  const tabNav = document.createElement('nav');
  tabNav.className = 'tab-nav';
  tabNav.setAttribute('role', 'tablist');
  tabNav.setAttribute('aria-label', 'Objekt-Aktionen');

  for (const tab of tabs) {
    const btn = document.createElement('button');
    btn.className = `tab-nav__btn${_activeTab === tab ? ' tab-nav__btn--active' : ''}`;
    btn.textContent = tabLabels[tab];
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', String(_activeTab === tab));
    btn.setAttribute('aria-controls', `tab-panel-${tab}`);
    btn.dataset.tab = tab;
    btn.addEventListener('click', () => {
      _activeTab = tab;
      _renderPortfolioDetail(app, getState().portfolio.find((p) => p.id === property.id) || property, getState());
    });
    tabNav.appendChild(btn);
  }
  app.appendChild(tabNav);

  // Tab-Panel
  const panel = document.createElement('div');
  panel.id = `tab-panel-${_activeTab}`;
  panel.className = 'tab-panel';
  panel.setAttribute('role', 'tabpanel');

  switch (_activeTab) {
    case 'rent':      _renderRentTab(panel, property); break;
    case 'reno':      _renderRenoTab(panel, property, state); break;
    case 'appraisal': _renderAppraisalTab(panel, property, state); break;
    case 'sell':      _renderSellTab(panel, property, state); break;
    case 'finance':   _renderFinanceTab(panel, property, state); break;
    default: break;
  }
  app.appendChild(panel);
}

/** Tab: Vermietung */
function _renderRentTab(panel, property) {
  const band = rentBand({ areaM2: property.areaM2, rentPotentialM2: property.rentPotentialM2 });
  const isRenovating = property.reno && !property.reno.done;
  const currentRent = property.rentCurrent || band.mid;
  const ratio = currentRent / band.mid;

  // Status-Text separat berechnen (kein nested ternary im Template)
  let statusHtml = '';
  if (property.occupied) {
    statusHtml = `<p class="status--occupied">✅ Aktuell vermietet – ${formatEUR(property.rentCurrent)}/Monat</p>`;
  } else if (property._seekingTenant) {
    statusHtml = '<p class="status--seeking">🔍 Mietersuche läuft…</p>';
  }

  // Überpreis-Warnung
  let overpriceWarn = '';
  if (!property.occupied && !isRenovating && ratio > 1.1) {
    const pctOver = Math.round((ratio - 1) * 100);
    if (ratio > 1.3) {
      overpriceWarn = `<p class="alert alert--danger">🚫 Mietpreis ist ${pctOver} % über Mietspiegel – kaum Anfragen, Vermietung fast unmöglich.</p>`;
    } else if (ratio > 1.2) {
      overpriceWarn = `<p class="alert alert--warn">⚠ Mietpreis ist ${pctOver} % über Mietspiegel – sehr wenige Anfragen zu erwarten.</p>`;
    } else {
      overpriceWarn = `<p class="alert alert--warn">⚠ Mietpreis ist ${pctOver} % über Mietspiegel – Anfragen deutlich reduziert.</p>`;
    }
  }

  // Inserat-Button: nur sichtbar wenn leer und keine Renovierung
  let insertBtn = '';
  if (!property.occupied && !isRenovating) {
    insertBtn = '<button class="btn btn--primary" id="btn-start-rent">Inserat starten</button>';
  }

  panel.innerHTML = `
    <h3 class="tab-panel__title">Vermietung</h3>
    ${isRenovating ? '<p class="alert alert--warn">⚠ Renovierung läuft – Vermietung nach Abschluss möglich.</p>' : ''}
    <div class="auto-mgmt-toggle">
      <label class="toggle-switch" aria-label="Automatische Mieterverwaltung">
        <input type="checkbox" id="auto-mgmt-toggle" role="switch"
          aria-checked="${property.autoMgmt ? 'true' : 'false'}"
          ${property.autoMgmt ? 'checked' : ''} />
        <span class="toggle-switch__slider"></span>
      </label>
      <span class="auto-mgmt-toggle__label">
        🤖 Auto-Mieterverwaltung
        <span class="auto-mgmt-toggle__cost">(5 €/Monat)</span>
        <span class="auto-mgmt-toggle__status ${property.autoMgmt ? 'status--on' : 'status--off'}">
          ${property.autoMgmt ? 'AN' : 'AUS'}
        </span>
      </span>
    </div>
    ${property.autoMgmt ? '<p class="alert alert--info">🤖 Die Verwaltung sucht automatisch Mieter und zieht den besten Bewerber ein – zum Marktmittelpreis.</p>' : ''}
    <div class="form-group">
      <label for="rent-amount" class="form-label">
        Kaltmiete/Monat
        <span class="form-hint">Marktband: ${formatEUR(band.low)} – ${formatEUR(band.high)} | Mietspiegel (Mitte): ${formatEUR(band.mid)}</span>
      </label>
      <input id="rent-amount" type="number" class="form-input" min="1"
        value="${currentRent}"
        step="10"
        aria-label="Kaltmiete in Euro pro Monat"
        ${isRenovating || property.autoMgmt ? 'disabled' : ''}
      />
    </div>
    ${overpriceWarn}
    ${statusHtml}
    <div class="tab-panel__actions">${insertBtn}</div>
    ${(property.applicants || []).length > 0 ? _renderApplicantList(property) : ''}
  `;

  // Auto-Mieterverwaltungs-Toggle
  panel.querySelector('#auto-mgmt-toggle')?.addEventListener('change', (e) => {
    const enabled = e.target.checked;
    _applyToProperty(property.id, (_s, p) => { p.autoMgmt = enabled; });
    _renderPortfolioDetail(panel.closest('#app'), getState().portfolio.find((p) => p.id === property.id), getState());
  });

  // Live-Überpreis-Warnung beim Tippen aktualisieren
  panel.querySelector('#rent-amount')?.addEventListener('input', (e) => {
    const newRent = Number(e.target.value);
    const newRatio = newRent / band.mid;
    let warn = panel.querySelector('.alert--overpriceWarn');
    if (!warn) {
      warn = document.createElement('p');
      warn.className = 'alert alert--warn alert--overpriceWarn';
      e.target.closest('.form-group').after(warn);
    }
    if (newRatio > 1.3) {
      warn.className = 'alert alert--danger alert--overpriceWarn';
      warn.textContent = `🚫 ${Math.round((newRatio - 1) * 100)} % über Mietspiegel – kaum Anfragen, Vermietung fast unmöglich.`;
      warn.style.display = '';
    } else if (newRatio > 1.2) {
      warn.className = 'alert alert--warn alert--overpriceWarn';
      warn.textContent = `⚠ ${Math.round((newRatio - 1) * 100)} % über Mietspiegel – sehr wenige Anfragen.`;
      warn.style.display = '';
    } else if (newRatio > 1.1) {
      warn.className = 'alert alert--warn alert--overpriceWarn';
      warn.textContent = `⚠ ${Math.round((newRatio - 1) * 100)} % über Mietspiegel – Anfragen deutlich reduziert.`;
      warn.style.display = '';
    } else {
      warn.style.display = 'none';
    }
  });

  panel.querySelector('#btn-start-rent')?.addEventListener('click', () => {
    const rent = Number(panel.querySelector('#rent-amount').value);
    if (rent < 1) return;
    _applyToProperty(property.id, (s, p) => { startRenting(s, p, rent); });
    _renderPortfolioDetail(panel.closest('#app'), getState().portfolio.find((p) => p.id === property.id), getState());
  });

  panel.querySelectorAll('[data-move-in]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const appId = btn.dataset.moveIn;
      _applyToProperty(property.id, (_s, p) => { moveInApplicant(p, appId); });
      navigate(`/property/${property.id}`);
    });
  });
}

/**
 * Hilfsfunktion: findet ein Property im State und wendet eine Mutation an.
 * Reduziert Nesting-Tiefe in Event-Listenern.
 * @param {string} propertyId
 * @param {(state: object, property: object) => void} fn
 */
function _applyToProperty(propertyId, fn) {
  setState((s) => {
    const p = s.portfolio.find((x) => x.id === propertyId);
    if (p) fn(s, p);
    return s;
  });
}

/** Bewerber-Liste HTML */
function _renderApplicantList(property) {
  const sorted = [...(property.applicants || [])].sort(
    (a, b) => scoreApplicant(b, property.rentCurrent) - scoreApplicant(a, property.rentCurrent)
  );
  const rows = sorted.map((a) => `
    <tr>
      <td>${Math.round(a.credit * 100)} %</td>
      <td>${formatEUR(a.income)}/Mo.</td>
      <td>${a.householdSize} Person(en)</td>
      <td>${a.pets ? '🐾 Ja' : 'Nein'}</td>
      <td>${a.moveInReady ? '✅' : '⏳'}</td>
      <td><button class="btn btn--sm btn--primary" data-move-in="${a.id}" aria-label="Bewerber einziehen lassen">Einziehen</button></td>
    </tr>
  `).join('');

  return `
    <h4 class="tab-panel__subtitle">Bewerber (${sorted.length})</h4>
    <div class="table-scroll">
      <table class="data-table" aria-label="Bewerberliste">
        <thead><tr>
          <th scope="col">Bonität</th><th scope="col">Einkommen</th><th scope="col">Haushalt</th>
          <th scope="col">Tiere</th><th scope="col">Einzugsbereit</th><th scope="col">Aktion</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

/** Tab: Renovierung */
function _renderRenoTab(panel, property, state) {
  const isRenovating = property.reno && !property.reno.done;
  const costFactor = state._renosCostFactor || 1;

  if (isRenovating) {
    const weeklyBudget = property.reno.weeklySpend * 16 || 1;
    const pct = Math.max(0, Math.min(100, 100 - Math.round((property.reno.remainingCost / weeklyBudget) * 100)));
    panel.innerHTML = `
      <h3 class="tab-panel__title">Renovierung läuft</h3>
      <p>Scope: <strong>${property.reno.plannedScope}</strong></p>
      <p>Verbleibende Kosten: <strong>${formatEUR(property.reno.remainingCost)}</strong></p>
      ${createProgressBar(pct, 'Renovierungsfortschritt').outerHTML}
      <p class="form-hint">Wöchentliche Ausgaben: ${formatEUR(property.reno.weeklySpend)}</p>
    `;
    return;
  }

  const scopes = ['light', 'medium', 'gut'];
  const scopeLabels = { light: 'Leicht', medium: 'Mittel', gut: 'Umfassend' };
  const costWarn = costFactor > 1.05
    ? `<p class="alert alert--warn">⚠ Materialpreisaufschlag aktiv: +${Math.round((costFactor - 1) * 100)} %</p>`
    : '';
  const occupiedWarn = property.occupied
    ? '<p class="alert alert--warn">⚠ Mieter muss ausziehen. Renovierung setzt Leerstand voraus.</p>'
    : '';

  const rows = scopes.map((scope) => {
    const est = renoEstimate(scope, property.areaM2, costFactor);
    return `
      <tr>
        <td><strong>${scopeLabels[scope]}</strong></td>
        <td>${formatEUR(est.minCost)} – ${formatEUR(est.maxCost)}</td>
        <td>${est.minMonths}–${est.maxMonths} Monate</td>
        <td>${est.deltaRange}</td>
        <td><button class="btn btn--sm btn--primary" data-reno="${scope}" aria-label="${scopeLabels[scope]} Renovierung starten">Starten</button></td>
      </tr>
    `;
  }).join('');

  panel.innerHTML = `
    <h3 class="tab-panel__title">Renovierung planen</h3>
    ${occupiedWarn}${costWarn}
    <div class="table-scroll">
      <table class="data-table" aria-label="Renovierungsoptionen">
        <thead><tr>
          <th scope="col">Scope</th><th scope="col">Kosten</th>
          <th scope="col">Dauer</th><th scope="col">Zustandsdelta</th><th scope="col">Aktion</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;

  panel.querySelectorAll('[data-reno]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const scope = btn.dataset.reno;
      _applyToProperty(property.id, (s, p) => {
        startRenovation(p, scope, p.areaM2, s._renosCostFactor || 1);
      });
      navigate(`/property/${property.id}`);
    });
  });
}

/** Tab: Bewertung */
function _renderAppraisalTab(panel, property, state) {
  const existing = property.appraisal?.arv
    ? `<p>Letztes Gutachten: <strong>${formatEUR(property.appraisal.arv)}</strong> (${formatDate(property.appraisal.lastAppraisalISO)})</p>`
    : '<p>Noch keine Bewertung vorhanden.</p>';

  panel.innerHTML = `
    <h3 class="tab-panel__title">Gutachten / Bewertung</h3>
    ${existing}
    <p class="form-hint">Kosten: 500 – 1.000 €. Setzt ARV (After Repair Value) fest.</p>
    <button class="btn btn--primary" id="btn-appraise">Gutachten beauftragen</button>
  `;

  panel.querySelector('#btn-appraise')?.addEventListener('click', () => {
    if (state.cash < 500) {
      alert('Nicht genug Kapital für ein Gutachten (mind. 500 €).');
      return;
    }
    _applyToProperty(property.id, (s, p) => { appraise(s, p, s.dateISO); });
    navigate(`/property/${property.id}`);
  });
}

/** Tab: Verkauf */
function _renderSellTab(panel, property, state) {
  const arv = property.appraisal?.arv || property.price;
  const fairEst = Math.round(arv * (1 + (state.market.heat - 50) / 500));

  // ARV-Warn separat (kein nested negated ternary)
  const arvWarn = property.appraisal?.arv
    ? ''
    : '<p class="alert alert--warn">⚠ Kein ARV vorhanden – Schätzung basiert auf Kaufpreis.</p>';

  const content = property.selling.onMarket
    ? `<p class="status--selling">🏷️ Objekt ist gelistet. Tage auf dem Markt: <strong>${property.selling.daysOnMarket}</strong></p>
       <p>Mindestpreis: <strong>${formatEUR(property.selling.minPrice)}</strong></p>
       <p class="form-hint">Fairer Schätzwert: ${formatEUR(fairEst)}</p>
       <button class="btn btn--secondary" id="btn-delist">Listing entfernen</button>`
    : `<p>Fairer Schätzwert (aktuell): <strong>${formatEUR(fairEst)}</strong></p>
       ${arvWarn}
       <div class="form-group">
         <label for="sell-min-price" class="form-label">Mindestpreis</label>
         <input id="sell-min-price" type="number" class="form-input"
           value="${fairEst}" min="1" step="1000" aria-label="Mindestverkaufspreis in Euro" />
       </div>
       <button class="btn btn--primary" id="btn-list">Zum Verkauf einstellen</button>`;

  panel.innerHTML = `<h3 class="tab-panel__title">Verkauf</h3>${content}`;

  panel.querySelector('#btn-list')?.addEventListener('click', () => {
    const minPrice = Number(panel.querySelector('#sell-min-price')?.value);
    if (!minPrice || minPrice < 1) return;
    _applyToProperty(property.id, (_s, p) => { listForSale(p, minPrice); });
    navigate(`/property/${property.id}`);
  });

  panel.querySelector('#btn-delist')?.addEventListener('click', () => {
    _applyToProperty(property.id, (_s, p) => {
      p.selling.onMarket = false;
      p.selling.daysOnMarket = 0;
    });
    navigate(`/property/${property.id}`);
  });
}

/** Tab: Finanzen */
function _renderFinanceTab(panel, property, state) {
  const m = property.mortgage;
  const r = m ? m.annualRate / 12 : 0;
  const interestMonth = m ? Math.round(m.principal * r) : 0;
  const repayMonth = m ? Math.round(m.monthlyPayment - interestMonth) : 0;

  const mortgageHtml = m ? `
    <div class="kpi-grid">
      <div class="kpi"><span class="kpi__label">Restschuld</span><span class="kpi__value">${formatEUR(m.principal)}</span></div>
      <div class="kpi"><span class="kpi__label">Jahreszins</span><span class="kpi__value">${formatPct(m.annualRate, 2)}</span></div>
      <div class="kpi"><span class="kpi__label">Restlaufzeit</span><span class="kpi__value">${m.termMonths} Monate</span></div>
      <div class="kpi"><span class="kpi__label">Rate/Mo.</span><span class="kpi__value">${formatEUR(m.monthlyPayment)}</span></div>
      <div class="kpi"><span class="kpi__label">Davon Zinsen</span><span class="kpi__value">${formatEUR(interestMonth)}</span></div>
      <div class="kpi"><span class="kpi__label">Davon Tilgung</span><span class="kpi__value">${formatEUR(repayMonth)}</span></div>
    </div>
    <div class="form-group" style="margin-top:1rem">
      <label for="extra-repay" class="form-label">Sondertilgung</label>
      <input id="extra-repay" type="number" class="form-input" min="0" step="500"
        placeholder="Betrag in €" aria-label="Sondertilgung in Euro" />
      <button class="btn btn--primary" id="btn-extra-repay" style="margin-top:0.5rem">Tilgen</button>
    </div>` : '<p>Kein Kredit vorhanden.</p>';

  panel.innerHTML = `<h3 class="tab-panel__title">Finanzierung</h3>${mortgageHtml}`;

  panel.querySelector('#btn-extra-repay')?.addEventListener('click', () => {
    const amount = Number(panel.querySelector('#extra-repay').value);
    if (!amount || amount <= 0) return;
    if (state.cash < amount) {
      alert('Nicht genug Kapital für Sondertilgung.');
      return;
    }
    _applyToProperty(property.id, (s, p) => {
      if (!p?.mortgage) return;
      const pay = Math.min(amount, p.mortgage.principal);
      s.cash -= pay;
      p.mortgage.principal -= pay;
    });
    navigate(`/property/${property.id}`);
  });
}

/** Rendert die Info-Ansicht für ein Angebot (noch nicht im Portfolio) */
function _renderOfferDetail(app, offer) {
  app.innerHTML = `
    <a href="#/market" class="btn btn--back" aria-label="Zurück zum Marktplatz">← Marktplatz</a>
    <header class="detail-header">
      <h2 class="detail-header__title">${offer.name}</h2>
    </header>
    <div class="kpi-grid">
      <div class="kpi"><span class="kpi__label">Preis</span><span class="kpi__value">${formatEUR(offer.price)}</span></div>
      <div class="kpi"><span class="kpi__label">€/m²</span><span class="kpi__value">${formatEUR(offer.pricePerM2)}</span></div>
      <div class="kpi"><span class="kpi__label">Fläche</span><span class="kpi__value">${offer.areaM2} m²</span></div>
      <div class="kpi"><span class="kpi__label">Baujahr</span><span class="kpi__value">${offer.building.year}</span></div>
      <div class="kpi"><span class="kpi__label">Zustand</span><span class="kpi__value">${offer.building.condition}/100</span></div>
      <div class="kpi"><span class="kpi__label">Energie</span><span class="kpi__value">${offer.building.energyClass}</span></div>
    </div>
    <p><a href="#/market" class="btn btn--primary">Zurück zum Marktplatz (Kaufen)</a></p>
  `;
}

