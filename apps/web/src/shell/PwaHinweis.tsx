import { useRegisterSW } from 'virtual:pwa-register/react';

/** Hinweise des Service Workers: Offline bereit / Update verfügbar (04 §9). */
export function PwaHinweis() {
  const {
    offlineReady: [offlineBereit, setOfflineBereit],
    needRefresh: [updateDa],
    updateServiceWorker,
  } = useRegisterSW();

  if (!offlineBereit && !updateDa) return <output aria-live="polite" className="sr-only" />;

  return (
    <output
      aria-live="polite"
      className="flex items-center gap-3 border-b border-border-decor bg-info-tint px-4 py-2 text-sm text-info erweitert:px-6 gross:px-8"
    >
      {updateDa ? (
        <>
          <span>Eine neue Version ist verfügbar.</span>
          <button
            type="button"
            onClick={() => updateServiceWorker(true)}
            className="min-h-9 rounded-md bg-primary px-3 text-on-primary"
          >
            Neu laden
          </button>
        </>
      ) : (
        <>
          <span>Die App ist jetzt auch offline nutzbar.</span>
          <button
            type="button"
            onClick={() => setOfflineBereit(false)}
            className="min-h-9 rounded-md px-3 underline"
          >
            Ausblenden
          </button>
        </>
      )}
    </output>
  );
}
