/** S-41 Quellen, Datenstand & Lizenzen – Grundgerüst (vollständig ab Z4). */
export function Quellen() {
  return (
    <div className="max-w-prose">
      <h1 className="mt-0 text-3xl font-semibold">Quellen &amp; Datenstand</h1>

      <section aria-labelledby="hinweis" className="rounded-lg border border-border-decor bg-surface p-6">
        <h2 id="hinweis" className="mt-0 text-lg font-semibold">
          Wichtiger Hinweis
        </h2>
        <p className="mb-0">
          Dieses Spiel ist ein Trainingswerkzeug. Es vereinfacht Steuern und Recht bewusst und verwendet teils
          veraltete oder ungeprüfte Werte. Es ersetzt keine Steuer- oder Rechtsberatung. Triff reale
          Entscheidungen nur nach fachlicher Prüfung.
        </p>
      </section>

      <h2 className="text-lg font-semibold">Datenstand</h2>
      <p>Rechtsstand der Spieldaten: 30.09.2026.</p>

      <h2 className="text-lg font-semibold">Status-Kennzeichen</h2>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
        <dt className="font-semibold">BELEGT</dt>
        <dd className="m-0">Wert mit Quelle und Stand aus der Wissensbasis.</dd>
        <dt className="font-semibold">ABGELEITET</dt>
        <dd className="m-0">Aus belegten Werten berechnet.</dd>
        <dt className="font-semibold">GESCHÄTZT</dt>
        <dd className="m-0">Plausible Annahme ohne direkten Beleg – mit Vorsicht lesen.</dd>
        <dt className="font-semibold">DESIGN</dt>
        <dd className="m-0">Bewusste Vereinfachung oder Spielregel.</dd>
      </dl>

      <h2 className="text-lg font-semibold">Quellen und Lizenzen</h2>
      <p className="text-muted">
        Die Liste der Datenquellen mit Pflichtvermerken (z. B. Destatis, BKG) folgt mit den ersten echten
        Daten in Sprint Z3/Z4. Datenschutz: Spielstände bleiben lokal auf deinem Gerät, es gibt keine
        Telemetrie.
      </p>
    </div>
  );
}
