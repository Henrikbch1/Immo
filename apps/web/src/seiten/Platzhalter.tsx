import { Link } from '@tanstack/react-router';
import type { Bereich } from '../shell/navigation.ts';

/** Leerzustand (K-18) für Bereiche ohne Inhalt – mit Phasenhinweis statt angedeuteter Funktion (03 §8). */
export function Platzhalter({ bereich }: { bereich: Bereich }) {
  return (
    <div className="max-w-2xl">
      <h1 className="mt-0 text-3xl font-semibold">{bereich.titel}</h1>
      <div className="mt-6 rounded-lg border border-dashed border-border-control p-8 text-center">
        <bereich.icon aria-hidden size={40} strokeWidth={1.5} className="mx-auto text-muted" />
        <p className="mb-1 text-lg font-semibold">Noch leer</p>
        <p className="mt-0 text-muted">{bereich.beschreibung}</p>
        <p className="text-muted">Dieser Bereich bekommt erste Inhalte ab Sprint {bereich.ab}.</p>
        <Link to="/" className="text-info underline">
          Zur Startseite
        </Link>
      </div>
      {bereich.id === 'markt' ? (
        <section aria-labelledby="werkzeuge" className="mt-6">
          <h2 id="werkzeuge" className="text-lg font-semibold">
            Schon nutzbar
          </h2>
          <Link
            to="/rechner/kalkulator"
            className="block rounded-lg border border-border-decor p-4 text-fg no-underline hover:border-border-control"
          >
            <span className="block font-semibold">Bierdeckel &amp; Kalkulator</span>
            <span className="block text-sm text-muted">
              Eine Wohnung durchrechnen – mit Rechenweg zu jeder Zahl
            </span>
          </Link>
        </section>
      ) : null}
      {bereich.id === 'finanzen' ? (
        <section aria-labelledby="werkzeuge" className="mt-6">
          <h2 id="werkzeuge" className="text-lg font-semibold">
            Schon nutzbar
          </h2>
          <Link
            to="/rechner/darlehen"
            className="block rounded-lg border border-border-decor p-4 text-fg no-underline hover:border-border-control"
          >
            <span className="block font-semibold">Darlehensrechner</span>
            <span className="block text-sm text-muted">Rate, Tilgungsplan, Restschuld und Sondertilgung</span>
          </Link>
        </section>
      ) : null}
    </div>
  );
}
