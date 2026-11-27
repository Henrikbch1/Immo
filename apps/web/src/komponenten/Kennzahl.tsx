import type { ParameterStatus } from '@immo/sim-core';
import type { ReactNode } from 'react';
import { StatusBadge } from './StatusBadge.tsx';

/** KPI-Kachel (K-04, Entwurf): Beschriftung, Wert, Status, Zusatz. Die Erklär-Karte folgt in Z2. */
export function Kennzahl({
  titel,
  wert,
  status,
  quelle,
  zusatz,
}: {
  titel: string;
  wert: string;
  status: ParameterStatus;
  quelle?: string;
  zusatz?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border-decor bg-page p-4">
      <dt className="text-sm font-medium text-muted">{titel}</dt>
      <dd className="m-0">
        <span className="tabular block text-2xl font-semibold">{wert}</span>
        <span className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted">
          <StatusBadge status={status} {...(quelle ? { quelle } : {})} />
          {zusatz}
        </span>
      </dd>
    </div>
  );
}
