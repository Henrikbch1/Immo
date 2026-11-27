import { createHashHistory, createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { Einstellungen } from './seiten/Einstellungen.tsx';
import { NichtGefunden } from './seiten/NichtGefunden.tsx';
import { Platzhalter } from './seiten/Platzhalter.tsx';
import { Quellen } from './seiten/Quellen.tsx';
import { Start } from './seiten/Start.tsx';
import { AppShell } from './shell/AppShell.tsx';
import { BEREICHE } from './shell/navigation.ts';

const wurzel = createRootRoute({ component: AppShell, notFoundComponent: NichtGefunden });

const start = createRoute({ getParentRoute: () => wurzel, path: '/', component: Start });
const einstellungen = createRoute({
  getParentRoute: () => wurzel,
  path: '/einstellungen',
  component: Einstellungen,
});
const quellen = createRoute({ getParentRoute: () => wurzel, path: '/quellen', component: Quellen });

// Spielbereiche (03 §1.3): /spiel/$spielId/<bereich>. Bis Z5 nur Platzhalter mit Leerzustand (K-18).
const bereichsRouten = BEREICHE.map((b) =>
  createRoute({
    getParentRoute: () => wurzel,
    path: `/spiel/$spielId/${b.pfad}`,
    component: () => <Platzhalter bereich={b} />,
  }),
);

const routeTree = wurzel.addChildren([start, einstellungen, quellen, ...bereichsRouten]);

// Hash-Routing: Reload auf Unterseiten funktioniert auf GitHub Pages und offline ohne 404 (11 §2).
export const router = createRouter({ routeTree, history: createHashHistory(), defaultPreload: 'intent' });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
