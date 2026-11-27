import type { ParameterStatus } from '@immo/sim-core';

const STIL: Record<ParameterStatus, { kuerzel: string; klasse: string; text: string }> = {
  BELEGT: { kuerzel: 'B', klasse: 'bg-positive-tint text-positive', text: 'Belegt' },
  ABGELEITET: { kuerzel: 'Ä', klasse: 'bg-info-tint text-info', text: 'Abgeleitet' },
  GESCHÄTZT: { kuerzel: 'G', klasse: 'bg-warning-tint text-warning', text: 'Geschätzt' },
  DESIGN: { kuerzel: 'D', klasse: 'bg-design-tint text-design', text: 'Design' },
};

/** Status-Flag (K-06): Kürzel + Text, nie nur Farbe. Quelle und Stand im Tooltip und für Screenreader. */
export function StatusBadge({
  status,
  quelle,
  stand,
}: {
  status: ParameterStatus;
  quelle?: string;
  stand?: string;
}) {
  const s = STIL[status];
  const info = [quelle && `Quelle: ${quelle}`, stand && `Stand: ${stand}`].filter(Boolean).join(' · ');
  return (
    <span
      title={info || undefined}
      className={`inline-flex items-center gap-1 rounded-full border border-current px-2 py-0.5 text-xs font-medium whitespace-nowrap ${s.klasse}`}
    >
      <span aria-hidden className="font-bold">
        {s.kuerzel}
      </span>
      {s.text}
      {info ? <span className="sr-only"> ({info})</span> : null}
    </span>
  );
}
