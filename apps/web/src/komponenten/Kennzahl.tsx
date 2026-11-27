import type { ParameterStatus } from '@immo/sim-core';
import type { ReactNode } from 'react';
import { StatusBadge } from './StatusBadge.tsx';

/**
 * KPI-Kachel (K-04): Beschriftung, Wert, Status, Zusatz. Mit `onErklaeren` ist der Wert ein Knopf,
 * der die Erklär-Karte öffnet (Klick, Tap, Enter, Leertaste).
 */
export function Kennzahl({
  titel,
  wert,
  status,
  quelle,
  zusatz,
  onErklaeren,
}: {
  titel: string;
  wert: string;
  status: ParameterStatus;
  quelle?: string;
  zusatz?: ReactNode;
  onErklaeren?: () => void;
}) {
  return (
    <div className="rounded-lg border border-border-decor bg-page p-4">
      <dt className="text-sm font-medium text-muted">{titel}</dt>
      <dd className="m-0">
        {onErklaeren ? (
          <button
            type="button"
            aria-haspopup="dialog"
            aria-label={`${titel}: ${wert} – Wie wurde das berechnet?`}
            onClick={onErklaeren}
            className="group block w-full rounded-md text-left"
          >
            <span className="tabular block text-2xl font-semibold">{wert}</span>
            <span className="block text-sm text-info underline group-hover:no-underline">
              Wie wurde das berechnet?
            </span>
          </button>
        ) : (
          <span className="tabular block text-2xl font-semibold">{wert}</span>
        )}
        <span className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted">
          <StatusBadge status={status} {...(quelle ? { quelle } : {})} />
          {zusatz}
        </span>
      </dd>
    </div>
  );
}
