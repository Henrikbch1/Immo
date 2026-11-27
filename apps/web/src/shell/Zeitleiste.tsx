/** Zeitleiste (K-02, 03 §1.4) – in Z0 nur als Hülle; Spielzeit kommt in Z5. */
export function Zeitleiste() {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="tabular text-muted">Nov. 2026 · kein Spiel</span>
      <button
        type="button"
        aria-disabled="true"
        title="Weiter schaltet ab Sprint Z5 Monate weiter"
        className="min-h-9 cursor-not-allowed rounded-md border border-border-control px-3 text-muted"
      >
        Weiter ▸<span className="sr-only"> (noch nicht verfügbar, ab Sprint Z5)</span>
      </button>
    </div>
  );
}
