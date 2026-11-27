import { Link } from '@tanstack/react-router';

export function NichtGefunden() {
  return (
    <div className="max-w-2xl">
      <h1 className="mt-0 text-3xl font-semibold">Seite nicht gefunden</h1>
      <p className="text-muted">Diese Adresse gibt es (noch) nicht.</p>
      <Link to="/" className="text-info underline">
        Zur Startseite
      </Link>
    </div>
  );
}
