# ADR 0001 – Plattform: React + Vite + PWA (+ Capacitor ab P9)

**Status:** angenommen (Z0, 27.11.2026) · Entscheidung E1/E2 · Details `docs/plan/04-technik-architektur.md` §1

## Kontext
Offline spielbares Trainingsspiel, Desktop/Tablet zuerst, später Store-Apps. Viel KI-gestützte Umsetzung → verbreiteter Stack.

## Entscheidung
React + Vite + TypeScript (strict) als installierbare PWA; Capacitor in P9. Versions-Spike Z0 (npm-Registry, 27.11.2026):

| Paket | Version | Abweichung zum Plan |
|---|---|---|
| react / react-dom | 19.3.1 | Plan 19.2 → neuere Minor |
| vite | 8.4.0 | – |
| typescript | 7.0.2 | Plan: TS 7 nur für `tsc --noEmit` – genügt, da Vite selbst transpiliert |
| @tanstack/react-router | 1.170.46 | code-basierte Routen statt Datei-Routing (weniger Werkzeug im Z0) |
| tailwindcss / @tailwindcss/vite | 4.3.5 | – |
| vite-plugin-pwa | 2.0.0 | – |
| vitest | 5.1.2 | Plan 4 → neuere Major |
| @biomejs/biome | 2.6.9 | – |
| lucide-react | 1.82.0 | – |

Node in CI: 24 (LTS); lokal ≥ 22.12.

## Folgen
- Hash-Routing (`/#/…`), damit GitHub Pages und Offline-Betrieb ohne Server-Rewrites funktionieren (11 §2).
- React Compiler, TanStack Form/Table, Zustand, Comlink, Dexie, ECharts, Paraglide kommen mit dem Sprint, der sie braucht.
