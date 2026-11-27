import { gespeichertesThema, type Thema, wendeThemaAn } from '@immo/ui';
import { useState } from 'react';

const THEMEN: { wert: Thema; titel: string; text: string }[] = [
  { wert: 'system', titel: 'Wie das System', text: 'Folgt der Einstellung deines Geräts.' },
  { wert: 'hell', titel: 'Hell', text: 'Heller Hintergrund.' },
  { wert: 'dunkel', titel: 'Dunkel', text: 'Dunkler Hintergrund, eigens abgestimmt.' },
  { wert: 'kontrast', titel: 'Hoher Kontrast', text: 'Stärkere Kontraste und Rahmen.' },
];

/** S-04 Einstellungen – in Z0 nur „Darstellung“. */
export function Einstellungen() {
  const [thema, setThema] = useState<Thema>(gespeichertesThema);

  return (
    <div className="max-w-2xl">
      <h1 className="mt-0 text-3xl font-semibold">Einstellungen</h1>
      <fieldset className="rounded-lg border border-border-decor p-4">
        <legend className="px-1 text-lg font-semibold">Darstellung</legend>
        <div className="grid gap-2">
          {THEMEN.map((t) => (
            <label
              key={t.wert}
              className="flex min-h-11 cursor-pointer items-start gap-3 rounded-md p-2 hover:bg-surface"
            >
              <input
                type="radio"
                name="thema"
                value={t.wert}
                checked={thema === t.wert}
                onChange={() => {
                  setThema(t.wert);
                  wendeThemaAn(t.wert);
                }}
                className="mt-1 size-4 accent-[var(--action-primary)]"
              />
              <span>
                <span className="block font-medium">{t.titel}</span>
                <span className="block text-sm text-muted">{t.text}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
