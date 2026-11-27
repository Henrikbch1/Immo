import { useSyncExternalStore } from 'react';

/** Prüfsumme der aktuell angezeigten Rechnung (Abnahme Z2: Anzeige in der Fußzeile). */
let aktuell: string | null = null;
const hoerer = new Set<() => void>();

export function setzePruefsumme(wert: string | null): void {
  if (wert === aktuell) return;
  aktuell = wert;
  for (const h of hoerer) h();
}

export function usePruefsumme(): string | null {
  return useSyncExternalStore(
    (h) => {
      hoerer.add(h);
      return () => hoerer.delete(h);
    },
    () => aktuell,
  );
}
