/**
 * dialogs.js – Kauf-Dialog und generische Dialog-Helfer für IMMOPATH
 */

import { getState, setState } from '../state.js';
import { estimatePurchaseCosts, approveLoan, equityRangeForScore, getEffectiveRate } from '../financing.js';
import { purchaseOffer } from '../properties.js';
import { formatEUR, formatPct } from '../utils.js';
import { navigate } from '../router.js';

const dlg = /** @type {HTMLDialogElement} */ (document.getElementById('dlg'));

/**
 * Schließt den aktuellen Dialog.
 */
export function closeDialog() {
  dlg?.close();
}

/**
 * Öffnet den Kauf-Dialog für ein Angebot.
 * Zeigt NK aufgeschlüsselt, EK-Slider, Zins, Rate, DTI, Total Cash Need.
 * @param {object} offer
 */
export function openBuyDialog(offer) {
  const state = getState();
  const rate = getEffectiveRate(state);
  const eqRange = equityRangeForScore(offer.category, state.creditScore);

  // Initialer EK-Anteil
  let currentDownPct = eqRange.default;
  // Initiale Laufzeit: 30 Jahre (360 Monate)
  let currentTermMonths = 360;
  // KNK mitfinanzieren?
  let currentIncludeKNK = false;

  /** Rendert die Dialog-Inhalte auf Basis des gewählten EK-%, der Laufzeit und KNK-Flag */
  function render(downPct, termMonths, includeKNK) {
    const costs = estimatePurchaseCosts(offer, downPct, rate, termMonths, includeKNK);
    // Geschätzter Netto-CF des neuen Objekts (Mietpotenzial − neue Rate)
    const estimatedRent   = Math.round(offer.rentPotentialM2 * offer.areaM2);
    const estimatedRentCF = Math.max(estimatedRent - costs.monthlyPayment, 0);
    const approval = approveLoan(state, costs.monthlyPayment, estimatedRentCF);
    const canAfford = state.cash >= costs.totalCashNeed;
    const canApprove = approval.ok;
    const valid = canAfford && canApprove;
    const termYears = termMonths / 12;

    dlg.innerHTML = `
      <form method="dialog" class="dialog" aria-labelledby="dlg-title" novalidate>
        <button class="dialog__close" type="button" aria-label="Dialog schließen">✕</button>
        <h2 id="dlg-title" class="dialog__title">Kauf: ${offer.name}</h2>

        <div class="dialog__section">
          <div class="kpi-row">
            <span class="kpi__label">Kaufpreis</span>
            <span class="kpi__value">${formatEUR(offer.price)}</span>
          </div>
          <div class="kpi-row">
            <span class="kpi__label">Jahreszins</span>
            <span class="kpi__value">${formatPct(rate, 2)}</span>
          </div>
          <div class="kpi-row">
            <span class="kpi__label">Laufzeit</span>
            <span class="kpi__value"><strong id="dlg-term-display">${termYears} Jahre (${termMonths} Monate)</strong></span>
          </div>
        </div>

        <div class="dialog__section">
          <label for="dlg-term" class="dialog__label">
            Laufzeit: <strong id="dlg-term-label">${termYears} Jahre</strong>
          </label>
          <input id="dlg-term" type="range"
            min="5" max="40" value="${termYears}" step="5"
            aria-label="Kreditlaufzeit in Jahren"
          />
          <small class="dialog__hint">5 bis 40 Jahre – längere Laufzeit = niedrigere Rate, höhere Gesamtkosten</small>
        </div>

        <div class="dialog__section">
          <label for="dlg-equity" class="dialog__label">
            Eigenkapital: <strong id="dlg-eq-display">${formatPct(downPct)}</strong>
            (${formatEUR(costs.equity)})
          </label>
          <input id="dlg-equity" type="range"
            min="${Math.round(eqRange.min * 100)}"
            max="100"
            value="${Math.round(downPct * 100)}"
            step="1"
            aria-label="Eigenkapitalanteil in Prozent"
          />
          <small class="dialog__hint">
            Mindest-EK für Bonität ${state.creditScore}: ${Math.round(eqRange.min * 100)} %
            ${eqRange.min === 0 ? ' – Vollfinanzierung möglich (sehr gute Bonität)' : ''}
          </small>
        </div>

        <div class="dialog__section">
          <label class="dialog__checkbox-label">
            <input type="checkbox" id="dlg-KNK" ${includeKNK ? 'checked' : ''} />
            <strong>Nebenkosten mitfinanzieren (100 % + KNK)</strong>
          </label>
          <small class="dialog__hint">
            ${includeKNK
              ? `⚠️ NK (${formatEUR(costs.closingCosts)}) werden auf den Kredit aufgeschlagen → höherer Kreditbetrag &amp; Zinsaufwand. Aus der Kasse fließt nur das Eigenkapital.`
              : `NK (${formatEUR(costs.closingCosts)}) werden aus der Kasse bezahlt.`}
          </small>
        </div>

        <div class="dialog__section dialog__section--costs">
          <h3 class="dialog__subtitle">Nebenkosten</h3>
          <div class="kpi-row">
            <span class="kpi__label">Makler (${formatPct(offer.fees.agentPct)})</span>
            <span class="kpi__value">${formatEUR(costs.agentFee)}</span>
          </div>
          <div class="kpi-row">
            <span class="kpi__label">Notar (${formatPct(offer.fees.notaryPct)})</span>
            <span class="kpi__value">${formatEUR(costs.notaryFee)}</span>
          </div>
          <div class="kpi-row">
            <span class="kpi__label">Grunderwerbsteuer (${formatPct(offer.fees.transferTaxPct)})</span>
            <span class="kpi__value">${formatEUR(costs.transferTax)}</span>
          </div>
          <div class="kpi-row">
            <span class="kpi__label">Sonstiges (${formatPct(offer.fees.miscPct)})</span>
            <span class="kpi__value">${formatEUR(costs.miscFee)}</span>
          </div>
          <div class="kpi-row kpi-row--total">
            <span class="kpi__label">Nebenkosten gesamt</span>
            <span class="kpi__value">${formatEUR(costs.closingCosts)}</span>
          </div>
        </div>

        <div class="dialog__section dialog__section--summary">
          <div class="kpi-row kpi-row--highlight">
            <span class="kpi__label">Eigenkapital</span>
            <span class="kpi__value">${formatEUR(costs.equity)}</span>
          </div>
          <div class="kpi-row kpi-row--highlight">
            <span class="kpi__label">Gesamter Kassenbedarf ${includeKNK ? '(nur EK – NK im Kredit)' : '(EK + NK)'}</span>
            <span class="kpi__value ${canAfford ? '' : 'text--danger'}">${formatEUR(costs.totalCashNeed)}</span>
          </div>
          <div class="kpi-row">
            <span class="kpi__label">Kreditbetrag ${includeKNK ? '<em class="text--warn">(inkl. NK)</em>' : ''}</span>
            <span class="kpi__value">${formatEUR(costs.loan)}</span>
          </div>
          <div class="kpi-row kpi-row--highlight">
            <span class="kpi__label">Monatliche Rate</span>
            <span class="kpi__value">${formatEUR(costs.monthlyPayment)}</span>
          </div>

          <div class="kpi-row">
            <span class="kpi__label">Mietpotenzial (neues Objekt)</span>
            <span class="kpi__value">${formatEUR(estimatedRent)}</span>
          </div>
          <div class="kpi-row">
            <span class="kpi__label">Portfolio-CF (bestehend)</span>
            <span class="kpi__value">${formatEUR(approval.portfolioCF)}</span>
          </div>
          <div class="kpi-row">
            <span class="kpi__label">Effektiver Schulddienst</span>
            <span class="kpi__value">${formatEUR(approval.effectiveDebt)}</span>
          </div>
          <div class="kpi-row">
            <span class="kpi__label">Effektives Einkommen (E + Cash/12)</span>
            <span class="kpi__value">${formatEUR(Math.round(approval.effectiveIncome))}</span>
          </div>
          <div class="kpi-row kpi-row--highlight">
            <span class="kpi__label">DTI (erweitert) nach Kauf</span>
            <span class="kpi__value ${canApprove ? '' : 'text--danger'}">
              ${formatPct(approval.dti)}
              ${approval.excellentCredit ? ' <em class="text--success">(Bonität ≥ 800 – DTI-Limit entfällt)</em>' : ''}
            </span>
          </div>
          <div class="kpi-row">
            <span class="kpi__label">Ihre Kasse</span>
            <span class="kpi__value">${formatEUR(state.cash)}</span>
          </div>
        </div>

        ${canAfford ? '' : `<p class="dialog__error" role="alert">❌ Nicht genug Kapital! Sie benötigen ${formatEUR(costs.totalCashNeed)}, haben aber nur ${formatEUR(state.cash)}.</p>`}
        ${canApprove ? '' : `<p class="dialog__error" role="alert">❌ DTI-Limit überschritten! Nach Kauf ${formatPct(approval.dti)} > 40 %. Verbessern Sie Ihre Bonität auf ≥ 800 für automatische Genehmigung.</p>`}

        <div class="dialog__actions">
          <button type="button" class="btn btn--secondary" id="dlg-cancel">Abbrechen</button>
          <button type="button" class="btn btn--primary" id="dlg-confirm"
            ${valid ? '' : 'disabled aria-disabled="true"'}>
            Kaufen
          </button>
        </div>
      </form>
    `;

    // Event-Listener binden
    dlg.querySelector('#dlg-cancel')?.addEventListener('click', closeDialog);
    dlg.querySelector('.dialog__close')?.addEventListener('click', closeDialog);

    dlg.querySelector('#dlg-equity')?.addEventListener('input', (e) => {
      currentDownPct = Number(e.target.value) / 100;
      render(currentDownPct, currentTermMonths, currentIncludeKNK);
    });

    dlg.querySelector('#dlg-term')?.addEventListener('input', (e) => {
      currentTermMonths = Number(e.target.value) * 12;
      render(currentDownPct, currentTermMonths, currentIncludeKNK);
    });

    dlg.querySelector('#dlg-KNK')?.addEventListener('change', (e) => {
      currentIncludeKNK = e.target.checked;
      render(currentDownPct, currentTermMonths, currentIncludeKNK);
    });

    dlg.querySelector('#dlg-confirm')?.addEventListener('click', () => {
      if (!valid) return;
      const freshState    = getState();
      const freshCosts    = estimatePurchaseCosts(offer, currentDownPct, rate, currentTermMonths, currentIncludeKNK);
      const freshRent     = Math.round(offer.rentPotentialM2 * offer.areaM2);
      const freshRentCF   = Math.max(freshRent - freshCosts.monthlyPayment, 0);
      const freshApproval = approveLoan(freshState, freshCosts.monthlyPayment, freshRentCF);
      if (!freshApproval.ok || freshState.cash < freshCosts.totalCashNeed) return;

      setState((s) => {
        const finalCosts = estimatePurchaseCosts(offer, currentDownPct, rate, currentTermMonths, currentIncludeKNK);
        purchaseOffer(s, offer, finalCosts);
        return s;
      });
      closeDialog();
      navigate('/portfolio');
    });
  }

  render(currentDownPct, currentTermMonths, currentIncludeKNK);
  dlg?.showModal();

  // ESC schließt Dialog
  dlg?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDialog();
  }, { once: true });
}

/**
 * Öffnet einen einfachen Info-Dialog.
 * @param {string} title
 * @param {string} message
 */
export function openInfoDialog(title, message) {
  dlg.innerHTML = `
    <div class="dialog" role="alertdialog" aria-labelledby="dlg-info-title" aria-modal="true">
      <button class="dialog__close" id="dlg-info-close" aria-label="Schließen">✕</button>
      <h2 id="dlg-info-title" class="dialog__title">${title}</h2>
      <p class="dialog__body">${message}</p>
      <div class="dialog__actions">
        <button class="btn btn--primary" id="dlg-info-ok">OK</button>
      </div>
    </div>
  `;
  dlg.querySelector('#dlg-info-close')?.addEventListener('click', closeDialog);
  dlg.querySelector('#dlg-info-ok')?.addEventListener('click', closeDialog);
  dlg?.showModal();
}


