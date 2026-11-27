import { parseDeZahl } from '@immo/ui';
import { type ReactNode, useId } from 'react';

/** Zahlenfeld (K-03, Entwurf): deutsche Eingabe, Einheit, Prüfung mit Fehlermeldung am Feld. */
export function Zahlenfeld({
  label,
  wert,
  onChange,
  einheit,
  min,
  max,
  ganzzahl = false,
  hinweis,
}: {
  label: string;
  wert: string;
  onChange: (v: string) => void;
  einheit: string;
  min: number;
  max: number;
  ganzzahl?: boolean;
  hinweis?: ReactNode;
}) {
  const id = useId();
  const zahl = parseDeZahl(wert);
  const fehler =
    zahl === null
      ? 'Bitte eine Zahl eingeben, z. B. 300.000 oder 4,5.'
      : zahl < min || zahl > max
        ? `Bitte einen Wert zwischen ${min.toLocaleString('de-DE')} und ${max.toLocaleString('de-DE')} eingeben.`
        : ganzzahl && !Number.isInteger(zahl)
          ? 'Bitte eine ganze Zahl eingeben.'
          : null;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <div className="mt-1 flex items-center rounded-md border border-border-control bg-page focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--focus-ring)]">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={wert}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={fehler ? true : undefined}
          aria-describedby={`${id}-info`}
          className="tabular min-h-11 w-full min-w-0 rounded-md bg-transparent px-3 text-right text-fg outline-none"
        />
        <span className="pr-3 text-muted">{einheit}</span>
      </div>
      <div id={`${id}-info`} className="mt-1 min-h-5 text-sm">
        {fehler ? (
          <span className="text-critical">✕ {fehler}</span>
        ) : (
          <span className="text-muted">{hinweis}</span>
        )}
      </div>
    </div>
  );
}

/** Wert eines Zahlenfelds, wenn gültig; sonst null. */
export function gueltig(wert: string, min: number, max: number, ganzzahl = false): number | null {
  const z = parseDeZahl(wert);
  if (z === null || z < min || z > max || (ganzzahl && !Number.isInteger(z))) return null;
  return z;
}
