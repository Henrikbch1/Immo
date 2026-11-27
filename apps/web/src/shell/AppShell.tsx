import { Link, Outlet, useParams } from '@tanstack/react-router';
import { Info } from 'lucide-react';
import { Fusszeile } from './Fusszeile.tsx';
import { Menue } from './Menue.tsx';
import { BEREICHE, DEMO_SPIEL_ID } from './navigation.ts';
import { PwaHinweis } from './PwaHinweis.tsx';
import { Zeitleiste } from './Zeitleiste.tsx';

const navLink =
  'flex items-center gap-3 rounded-md text-muted no-underline hover:bg-surface hover:text-fg ' +
  'data-[status=active]:bg-info-tint data-[status=active]:text-info data-[status=active]:font-semibold';

/** App-Shell (03 §1.2): Sidebar ≥ 1200 px, Rail 600–1199 px, Tab-Leiste + Zeitleiste unten < 600 px. */
export function AppShell() {
  const params = useParams({ strict: false }) as { spielId?: string };
  const spielId = params.spielId ?? DEMO_SPIEL_ID;

  return (
    <div className="flex min-h-dvh bg-page text-fg">
      <a
        href="#inhalt"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:p-3 focus:text-on-primary"
      >
        Zum Inhalt springen
      </a>

      <nav
        aria-label="Hauptnavigation"
        className="sticky top-0 hidden h-dvh w-[72px] shrink-0 flex-col gap-1 border-r border-border-decor bg-page px-2 py-3 mittel:flex gross:w-60"
      >
        <Link
          to="/"
          className="mb-3 flex items-center gap-2 px-2 py-1 font-semibold text-fg no-underline"
          aria-label="Immo – Startseite"
        >
          <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="" width={32} height={32} />
          <span className="hidden gross:inline">Immo</span>
        </Link>
        {BEREICHE.map((b, i) => (
          <div key={b.id}>
            {b.id === 'akademie' && i > 0 ? <hr className="my-2 border-border-decor" /> : null}
            <Link
              to={`/spiel/$spielId/${b.pfad}`}
              params={{ spielId }}
              className={`${navLink} min-h-11 flex-col justify-center px-1 py-1 text-xs gross:flex-row gross:justify-start gross:px-3 gross:text-sm`}
            >
              <b.icon aria-hidden size={20} strokeWidth={1.75} />
              <span className="gross:hidden">{b.kurz}</span>
              <span className="hidden gross:inline">{b.titel}</span>
            </Link>
          </div>
        ))}
      </nav>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-border-decor bg-page px-4 shadow-[var(--elevation-1)] erweitert:px-6 gross:px-8">
          <Link to="/" className="flex items-center gap-2 font-semibold text-fg no-underline mittel:hidden">
            <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="" width={28} height={28} />
            Immo
          </Link>
          <span className="hidden text-sm text-muted mittel:inline">Kein Spielstand geladen</span>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden mittel:block">
              <Zeitleiste />
            </div>
            <Menue spielId={spielId} />
          </div>
        </header>

        <p
          role="note"
          className="m-0 flex items-start gap-2 border-b border-border-decor bg-surface px-4 py-2 text-sm text-muted erweitert:px-6 gross:px-8"
        >
          <Info aria-hidden size={16} className="mt-0.5 shrink-0" />
          <span>
            Lernspiel, keine Anlage-, Steuer- oder Rechtsberatung. Werte vereinfacht, teils geschätzt –{' '}
            <Link to="/quellen" className="text-info underline">
              Quellen &amp; Datenstand
            </Link>
          </span>
        </p>

        <PwaHinweis />

        <main
          id="inhalt"
          tabIndex={-1}
          className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 erweitert:px-6 gross:px-8"
        >
          <Outlet />
        </main>

        <Fusszeile />
        {/* Platzhalter für die feste Leiste unten auf kompakten Breiten */}
        <div aria-hidden className="h-[calc(104px+env(safe-area-inset-bottom))] mittel:hidden" />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-border-decor bg-page pb-[env(safe-area-inset-bottom)] mittel:hidden">
        <div className="flex h-12 items-center justify-end border-b border-border-decor px-4">
          <Zeitleiste />
        </div>
        <nav aria-label="Hauptnavigation" className="grid h-14 grid-cols-5">
          {BEREICHE.filter((b) => !b.nurMenueMobil).map((b) => (
            <Link
              key={b.id}
              to={`/spiel/$spielId/${b.pfad}`}
              params={{ spielId }}
              className={`${navLink} flex-col justify-center gap-0.5 rounded-none text-xs`}
            >
              <b.icon aria-hidden size={20} strokeWidth={1.75} />
              <span>{b.kurz}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
