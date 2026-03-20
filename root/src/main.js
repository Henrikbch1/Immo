/**
 * main.js – Einstiegspunkt fuer IMMOPATH SPA
 */
import { load, subscribe, getState, setState } from './state.js';
import { initRouter, onRoute, onFallback, navigate } from './router.js';
import { onTick } from './time.js';
import { rollOffers } from './marketplace.js';
import { initHUD, updateHUD } from './ui/hud.js';
import { renderMarketView } from './ui/marketView.js';
import { renderPortfolioView } from './ui/portfolioView.js';
import { renderLogView } from './ui/logView.js';
import { renderPropertyDetail } from './ui/propertyDetailView.js';
import { renderSettingsView } from './ui/settingsView.js';
let _currentRenderer = null;
function boot() {
  const loaded = load();
  const state = getState();
  if (state.offers.length === 0) {
    setState((s) => { s.offers = rollOffers(s.market, s.dateISO); return s; });
  }
  initHUD();
  onRoute('market', () => { _currentRenderer = renderMarketView; renderMarketView(); });
  onRoute('portfolio', () => { _currentRenderer = renderPortfolioView; renderPortfolioView(); });
  onRoute('log', () => { _currentRenderer = renderLogView; renderLogView(); });
  onRoute('property', (params) => {
    _currentRenderer = () => renderPropertyDetail(params);
    renderPropertyDetail(params);
  });
  onRoute('settings', () => { _currentRenderer = renderSettingsView; renderSettingsView(); });
  onFallback(() => navigate('/market'));
  initRouter();
  let _lastHudUpdate = 0;
  onTick(() => {
    const now = Date.now();
    if (now - _lastHudUpdate > 250) { updateHUD(); _lastHudUpdate = now; }
  });
  subscribe(() => {
    updateHUD();
    if (_currentRenderer) {
      const dlg = document.getElementById('dlg');
      if (!dlg?.open) { _currentRenderer(); }
    }
  });
  document.querySelectorAll('[data-route]').forEach((el) => {
    el.addEventListener('click', (e) => { e.preventDefault(); navigate('/' + el.dataset.route); });
  });
  console.log('[IMMOPATH] gestartet. Stand:', loaded ? 'geladen' : 'neu');
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
