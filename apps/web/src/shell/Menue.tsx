import { Link } from '@tanstack/react-router';
import { CircleUserRound } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

/** Profilmenü (03 §1.4): Einstellungen, Quellen & Datenstand, Akademie (mobil), Rechtsstand. */
export function Menue({ spielId }: { spielId: string }) {
  const [offen, setOffen] = useState(false);
  const id = useId();
  const knopf = useRef<HTMLButtonElement>(null);
  const flaeche = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!offen) return;
    const beiTaste = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOffen(false);
        knopf.current?.focus();
      }
    };
    const beiKlick = (e: MouseEvent) => {
      const ziel = e.target as Node;
      if (!flaeche.current?.contains(ziel) && !knopf.current?.contains(ziel)) setOffen(false);
    };
    document.addEventListener('keydown', beiTaste);
    document.addEventListener('mousedown', beiKlick);
    return () => {
      document.removeEventListener('keydown', beiTaste);
      document.removeEventListener('mousedown', beiKlick);
    };
  }, [offen]);

  const schliessen = () => setOffen(false);
  const eintrag = 'block rounded-md px-3 py-2 text-fg no-underline hover:bg-surface';

  return (
    <div className="relative">
      <button
        ref={knopf}
        type="button"
        aria-expanded={offen}
        aria-controls={id}
        onClick={() => setOffen((o) => !o)}
        className="flex size-11 items-center justify-center rounded-full text-muted hover:bg-surface hover:text-fg"
      >
        <CircleUserRound aria-hidden size={24} strokeWidth={1.75} />
        <span className="sr-only">Menü</span>
      </button>
      {offen ? (
        <div
          ref={flaeche}
          id={id}
          className="absolute right-0 z-20 mt-2 w-64 rounded-lg border border-border-decor bg-raised p-2 shadow-lg"
        >
          <nav aria-label="Profilmenü">
            <Link to="/einstellungen" className={eintrag} onClick={schliessen}>
              Einstellungen
            </Link>
            <Link to="/quellen" className={eintrag} onClick={schliessen}>
              Quellen &amp; Datenstand
            </Link>
            <Link
              to="/spiel/$spielId/akademie"
              params={{ spielId }}
              className={`${eintrag} mittel:hidden`}
              onClick={schliessen}
            >
              Akademie
            </Link>
          </nav>
          <p className="m-0 mt-2 border-t border-border-decor px-3 pt-2 text-xs text-muted">
            Rechtsstand der Spieldaten: 30.09.2026
          </p>
        </div>
      ) : null}
    </div>
  );
}
