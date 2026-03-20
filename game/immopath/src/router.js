/**
 * router.js – Hash-basierter SPA-Router für IMMOPATH
 * Routen: #/market, #/portfolio, #/log, #/property/:id
 * Fallback: #/market
 */

const ROUTES = [
  { pattern: /^\/market$/, name: 'market', params: () => ({}) },
  { pattern: /^\/portfolio$/, name: 'portfolio', params: () => ({}) },
  { pattern: /^\/log$/, name: 'log', params: () => ({}) },
  { pattern: /^\/property\/([^/]+)$/, name: 'property', params: (m) => ({ id: m[1] }) },
  { pattern: /^\/settings$/, name: 'settings', params: () => ({}) },
];

/** Aktuell registrierte Route-Handler: Map<name, handler> */
const _handlers = new Map();

/** Callback für unbekannte Routen */
let _fallback = null;

/**
 * Parst den aktuellen Hash und gibt Route-Name + Params zurück.
 * @returns {{ name: string, params: object }}
 */
function parseHash() {
  const hash = globalThis.location.hash.slice(1) || '/market';
  const path = hash.startsWith('/') ? hash : '/' + hash;

  for (const route of ROUTES) {
    const match = route.pattern.exec(path);
    if (match) {
      return { name: route.name, params: route.params(match) };
    }
  }
  return { name: 'market', params: {} };
}

/**
 * Löst die aktuelle Route auf und ruft den passenden Handler auf.
 */
function dispatch() {
  const { name, params } = parseHash();

  // Aktiven Nav-Tab hervorheben
  document.querySelectorAll('[data-route]').forEach((el) => {
    const active = el.dataset.route === name || el.dataset.route === `${name}/${params.id || ''}`;
    el.classList.toggle('nav__link--active', active);
    el.setAttribute('aria-current', active ? 'page' : 'false');
  });

  const handler = _handlers.get(name) || _fallback;
  if (handler) {
    handler(params);
  } else {
    navigate('/market');
  }
}

/**
 * Registriert einen Handler für eine benannte Route.
 * @param {string} name – z.B. 'market', 'property'
 * @param {(params: object) => void} handler
 */
export function onRoute(name, handler) {
  _handlers.set(name, handler);
}

/**
 * Registriert einen Fallback-Handler für unbekannte Routen.
 * @param {(params: object) => void} handler
 */
export function onFallback(handler) {
  _fallback = handler;
}

/**
 * Navigiert zu einem Hash-Pfad.
 * @param {string} path – z.B. '/market' oder '/property/prop_abc123'
 */
export function navigate(path) {
  const newHash = '#' + (path.startsWith('/') ? path : '/' + path);
  if (globalThis.location.hash === newHash) {
    // Gleicher Hash → manuell dispatchen
    dispatch();
  } else {
    globalThis.location.hash = newHash;
  }
}

/**
 * Gibt die aktuell aktive Route zurück.
 * @returns {{ name: string, params: object }}
 */
export function currentRoute() {
  return parseHash();
}

/**
 * Initialisiert den Router (bindet hashchange-Event).
 * Muss einmalig beim App-Start aufgerufen werden.
 */
export function initRouter() {
  globalThis.addEventListener('hashchange', dispatch);
  // Initial dispatch
  dispatch();
}
