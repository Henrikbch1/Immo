/**
 * components.js – Wiederverwendbare DOM-Bausteine für IMMOPATH
 * Badge, KPI-Box, Sparkline, Fortschrittsbalken
 */

/**
 * Erzeugt ein Lage-Badge-Element.
 * @param {'A'|'B'|'C'} zoneId
 * @returns {HTMLElement}
 */
export function createBadge(zoneId) {
  const span = document.createElement('span');
  span.className = `badge badge--zone-${zoneId.toLowerCase()}`;
  span.textContent = `${zoneId}-Lage`;
  span.setAttribute('aria-label', `Lage: ${zoneId}`);
  return span;
}

/**
 * Erzeugt ein Kategorie-Badge.
 * @param {string} category
 * @returns {HTMLElement}
 */
export function createCategoryBadge(category) {
  const labels = { apartment: 'ETW', house: 'EFH', mfh: 'MFH' };
  const span = document.createElement('span');
  span.className = `badge badge--cat-${category}`;
  span.textContent = labels[category] || category;
  return span;
}

/**
 * Erzeugt eine KPI-Box mit Label und Wert.
 * @param {string} label
 * @param {string} value
 * @param {string} [modifier] – optionaler CSS-Modifier (z.B. 'positive', 'negative')
 * @returns {HTMLElement}
 */
export function createKPI(label, value, modifier = '') {
  const div = document.createElement('div');
  div.className = `kpi${modifier ? ' kpi--' + modifier : ''}`;
  div.innerHTML = `<span class="kpi__label">${label}</span><span class="kpi__value">${value}</span>`;
  return div;
}

/**
 * Zeichnet eine Sparkline (Liniendiagramm) auf einem Canvas.
 * @param {HTMLCanvasElement} canvas
 * @param {number[]} data – Array von Zahlen
 * @param {string} [color='#4f9cf9']
 */
export function drawSparkline(canvas, data, color = '#4f9cf9') {
  if (!data || data.length < 2) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const xStep = w / (data.length - 1);

  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;

  data.forEach((val, i) => {
    const x = i * xStep;
    const y = h - ((val - min) / range) * (h - 4) - 2;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

/**
 * Erzeugt einen Fortschrittsbalken.
 * @param {number} percent – 0..100
 * @param {string} [label]
 * @returns {HTMLElement}
 */
export function createProgressBar(percent, label = '') {
  const div = document.createElement('div');
  div.className = 'progress';
  div.setAttribute('role', 'progressbar');
  div.setAttribute('aria-valuenow', String(Math.round(percent)));
  div.setAttribute('aria-valuemin', '0');
  div.setAttribute('aria-valuemax', '100');
  if (label) div.setAttribute('aria-label', label);
  div.innerHTML = `<div class="progress__fill" style="width:${clamp(percent,0,100)}%"></div>`;
  return div;
}

function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

/**
 * Erzeugt ein Icon-Span aus der icons.svg-Sprite.
 * @param {string} id – ID des SVG-Symbols
 * @param {string} [label]
 * @returns {SVGElement}
 */
export function createIcon(id, label = '') {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'icon');
  svg.setAttribute('aria-hidden', label ? 'false' : 'true');
  if (label) svg.setAttribute('aria-label', label);
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `../public/assets/icons.svg#${id}`);
  svg.appendChild(use);
  return svg;
}


