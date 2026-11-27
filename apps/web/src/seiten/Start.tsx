import { Link } from '@tanstack/react-router';
import { BEREICHE, DEMO_SPIEL_ID } from '../shell/navigation.ts';

/** S-01 Startbildschirm – in Z0 Überblick über die Demo und den Sprint-Fahrplan. */
export function Start() {
  return (
    <div className="max-w-3xl">
      <h1 className="mt-0 text-3xl font-semibold">Immo – Immobilien-Trainingsspiel</h1>
      <p className="max-w-prose text-lg text-muted">
        Objekte finden, prüfen, finanzieren, kaufen und bewirtschaften – mit echten Regeln und echten
        Regionaldaten aus Deutschland. Diese Demo wächst Sprint für Sprint.
      </p>

      <section aria-labelledby="stand" className="mt-8 rounded-lg border border-border-decor bg-surface p-6">
        <h2 id="stand" className="mt-0 text-lg font-semibold">
          Was du in dieser Version siehst
        </h2>
        <ul className="mb-0 space-y-1 pl-5">
          <li>App-Gerüst mit Navigation für Desktop, Tablet und Handy</li>
          <li>Helles, dunkles und kontrastreiches Thema (Menü › Einstellungen)</li>
          <li>Installierbar als App, funktioniert offline</li>
          <li>Fußzeile mit Sprint, Commit und Build-Zeit</li>
        </ul>
      </section>

      <section aria-labelledby="bereiche" className="mt-8">
        <h2 id="bereiche" className="text-lg font-semibold">
          Bereiche
        </h2>
        <ul className="grid list-none gap-3 p-0 mittel:grid-cols-2">
          {BEREICHE.map((b) => (
            <li key={b.id}>
              <Link
                to={`/spiel/$spielId/${b.pfad}`}
                params={{ spielId: DEMO_SPIEL_ID }}
                className="flex h-full items-start gap-3 rounded-lg border border-border-decor p-4 text-fg no-underline hover:border-border-control"
              >
                <b.icon aria-hidden size={24} strokeWidth={1.75} className="mt-0.5 shrink-0 text-info" />
                <span>
                  <span className="block font-semibold">{b.titel}</span>
                  <span className="block text-sm text-muted">{b.beschreibung}</span>
                  <span className="block text-sm text-muted">Erste Inhalte ab Sprint {b.ab}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
