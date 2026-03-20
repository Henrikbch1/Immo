/**
 * logView.js – Ereignis-Log-Ansicht für IMMOPATH
 * Zeigt Log-Einträge chronologisch (neuestes oben), max. 200
 */

import { getState } from '../state.js';
import { formatDate } from '../utils.js';

/**
 * Rendert die Log-Ansicht in #app.
 */
export function renderLogView() {
  const app = document.getElementById('app');
  if (!app) return;

  const state = getState();
  app.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'log-header';
  header.innerHTML = `<h2 class="log-header__title">Ereignis-Log</h2>
    <span class="log-header__count">${state.log.length} Einträge</span>`;
  app.appendChild(header);

  if (state.log.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'Noch keine Ereignisse. Starte das Spiel!';
    app.appendChild(empty);
    return;
  }

  const list = document.createElement('ol');
  list.className = 'log-list';
  list.setAttribute('aria-label', 'Ereignis-Log');
  list.setAttribute('aria-live', 'polite');
  list.setAttribute('aria-relevant', 'additions');

  for (const entry of state.log) {
    const li = document.createElement('li');
    li.className = `log-entry log-entry--${entry.severity}`;
    li.setAttribute('role', 'listitem');
    li.innerHTML = `
      <span class="log-entry__time">${formatDate(entry.t)}</span>
      <span class="log-entry__text">${escapeHtml(entry.text)}</span>
    `;
    list.appendChild(li);
  }

  app.appendChild(list);
}

/** Einfaches HTML-Escaping */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    // Emojis und Unicode sind OK
    ;
}

