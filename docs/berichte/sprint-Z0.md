# Sprint Z0 – Fundament + Deploy-Pipeline (27.11.2026)

## Gebaut
- Alter Prototyp nach `legacy/prototyp-v0/` (Tag `prototyp-v0` auf Commit `959c984` nur lokal – Tag-Push ist in der Cloud-Umgebung gesperrt), `.idea/` ignoriert.
- pnpm-Workspace mit zentralen Versionen (`catalog:`), Pakete `config`, `sim-core`, `ui`, `apps/web`.
- TypeScript 7 strict, Biome 2 (Lint + Format), Vitest 5; **`pnpm verify`** = lint + typecheck + test + build.
- Determinismus-Verbote für `sim-core` (`tools/check-sim-core.mjs`), erstes Kernmodul `kalender.ts` (MonthIndex) mit Tests.
- `@immo/ui`: Design-Tokens hell/dunkel/kontrast (03 §4.1), Formatter de-DE (Euro aus Cent, Prozent aus Basispunkten, Monat).
- App-Shell: Sidebar (≥ 1200 px), Rail (600–1199 px), Tab-Leiste + Zeitleiste unten (< 600 px), Profilmenü,
  Disclaimer-Zeile, Platzhalter für alle Bereiche (Leerzustand mit Sprint-Hinweis), Einstellungen (Thema), Quellen-Seite.
- Hash-Routing (Reload auf Unterseiten ohne 404), PWA-Manifest + Service Worker (offline, installierbar, Update-Hinweis).
- Fußzeile mit Sprint, Commit-Link, Build-Zeit.
- GitHub-Pages-Workflow `.github/workflows/pages.yml` (verify → build → deploy).
- `CLAUDE.md` ausgebaut, ADRs 0001–0010, Projekt-Subagents in `.claude/agents/`.

## Bewusst weggelassen
Turborepo, Storybook, dependency-cruiser, Playwright-/axe-Tests in CI, Projekt-Skills, Hooks, Plugins, Schrift Inter
(Lizenzfrage offen) – jeweils erst, wenn ein Sprint sie braucht.

## Bekannte Punkte
- **Deploy braucht einmalig deine Einstellung** (siehe STATUS, Q13): Pages aktivieren und `claude/*` als Deploy-Branch erlauben
  (oder nach `main` mergen).
- pnpm 10 statt 11 (ADR 0002), Vitest 5 statt 4, React 19.3 statt 19.2 (ADR 0001).

## Lokal geprüft
`pnpm verify` grün (6 Tests). Playwright: Desktop 1280, Tablet 900, Handy 390, Dunkel, Kontrast; Reload auf
`#/spiel/demo/markt` zeigt die Seite; offline (nach erstem Besuch) lädt `#/einstellungen`; keine Konsolenfehler.

## Abnahme-Checkliste
1. URL öffnet auf Desktop **und** Handy.
2. Fußzeile zeigt Sprint „Z0“ und Commit.
3. Menü › Einstellungen: Hell/Dunkel/Kontrast wechselt; Seitenleiste (breit), Rail (Tablet), Tab-Leiste (Handy).
4. Reload auf einer Unterseite (z. B. Markt) gibt keine 404.
5. Seite lässt sich installieren und startet offline (Flugmodus).
6. GitHub-Actions-Lauf „Pages“ ist grün.
