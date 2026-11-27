# CLAUDE.md – Immo (Neuaufbau)

Realistisches Trainingsspiel für Immobilieninvestments in Deutschland: Objekte finden, prüfen, finanzieren, kaufen und
bewirtschaften – mit echten Regeln und Regionaldaten. Offline-PWA (React + Vite + TS), später Capacitor.
Plan: `docs/plan/00-MASTERPLAN.md` · Sprints: `docs/plan/11-umsetzung-sprints.md` · **Stand: `docs/STATUS.md`**.

## Einstieg in einen Sprint
1. `docs/STATUS.md` lesen → nächster Sprint.
2. **Arbeitsstand holen:** Der neueste Stand liegt nicht unbedingt auf `main`, sondern auf dem zuletzt aktiven
   `claude/*`-Branch. Vor Arbeitsbeginn: `git fetch origin && git branch -r --sort=-committerdate | head` und den
   neuesten Branch in den eigenen Sitzungsbranch mergen (`git merge origin/<branch>`). Nie auf alten Stand aufbauen.
3. Sprint-Abschnitt in `11-…` und nur die dort genannten Plan-Abschnitte lesen.

## Befehle
| Befehl | Zweck |
|---|---|
| `pnpm i` | Abhängigkeiten (pnpm-Workspace, Versionen im `catalog:` von `pnpm-workspace.yaml`) |
| `pnpm dev` | Web-App lokal (`http://localhost:5173/Immo/`) |
| `pnpm test` | Vitest (alle Pakete) |
| `pnpm lint` / `pnpm format` | Biome + Determinismus-Verbote für `sim-core` (`tools/check-sim-core.mjs`) |
| `pnpm typecheck` | `tsc` je Paket (TypeScript 7, strict) |
| **`pnpm verify`** | lint + typecheck + test + build – muss vor jedem Push grün sein |

## Struktur
`apps/web` (React-App, Routen in `src/router.tsx`, Shell in `src/shell/`, Seiten in `src/seiten/`) ·
`packages/sim-core` (reiner Rechenkern) · `packages/ui` (Tokens, Formatter, Thema) · `packages/config` (tsconfig-Basis) ·
`tools/` (Skripte) · `legacy/prototyp-v0/` (alter Prototyp, **nicht ändern**) · `docs/adr/` (Architekturentscheidungen).
Weitere Pakete (`data`, `geo`, `storage`, `charts`, `content`, `sim-worker`) erst anlegen, wenn ein Sprint sie braucht.

## Versionen und Muster (Stand Z0, ADR 0001/0002)
React 19.3 · Vite 8 · TypeScript 7 · TanStack Router 1.170 (**Hash-History**, Routen code-basiert) · Tailwind 4.3
(Tokens als `@theme` in `packages/ui/src/tokens.css`) · Biome 2.6 · Vitest 5 · vite-plugin-pwa 2 · lucide-react · pnpm 10.
Referenzdateien: Route `apps/web/src/router.tsx`, Seite `apps/web/src/seiten/Einstellungen.tsx`, Kernmodul
`packages/sim-core/src/kalender.ts` + Test.

## Harte Regeln für `sim-core`
- Kein DOM, kein `Date`, kein `Math.random/pow/exp/log`, kein `**`, kein `crypto`, keine I/O (Lint prüft).
- Geld als Integer-**Cent**, Zinsen in **Basispunkten**; gerundet wird nur an Buchungsstellen (ADR 0003).
- Keine Fachzahl als Literal → Parameter-Registry mit Status/Quelle/Stand (ADR 0009). Jede Kennzahl mit `explain()`.

## Fachliche Regeln
- Fakten nur aus dem IC-Vault (Repo `henrikbch1/ic`, `vault/`, Regeln in dessen `AGENTS.md`) oder als GESCHÄTZT
  markieren und ins Lücken-Register (`docs/plan/02-…` LR-xx). Keine Steuer-/Rechtsberatung formulieren.
- Status-Flags für jeden Parameter: BELEGT · ABGELEITET · GESCHÄTZT · DESIGN.

## UX-Regeln
- Screen-Raster und DoD: `docs/plan/03-ux-ui.md` §2.0/§7.1. Deutsch, **du-Anrede, kein Gendern** (E8, O7).
- Zahlen nur über `@immo/ui` formatieren (`formatEuro`, `formatProzentAusBp` …), Zahl und Einheit mit geschütztem Leerzeichen.
- Nur semantische Tokens (`bg-surface`, `text-muted`, `text-info` …), keine Hex-Werte in Komponenten.
- Status nie nur über Farbe; jede Aktion mit Folgenvorschau oder Rückgängig; unfertige Bereiche als Leerzustand mit Sprint-Hinweis.

## Tests
Golden + Property für Formeln; Determinismus-Hash nie „aktualisieren“, ohne die Ursache zu nennen.

## Git und Deploy
- Kleine Commits `Z<sprint>: <kurz>` bzw. `P<phase>.<paket>: <kurz>`; `docs(...)` für Doku; ADR bei Architekturänderung.
- Live-Demo: GitHub Pages (`.github/workflows/pages.yml`), `https://henrikbch1.github.io/Immo/`. Deployt nach grünem
  `pnpm verify` bei Push auf `main` oder `claude/*` (sofern in *Settings → Environments → github-pages* erlaubt).
- Sprint-Ende: `pnpm verify` → push → `docs/berichte/sprint-ZNN.md` → `docs/STATUS.md` → `apps/web/src/sprint.ts` hochzählen.

## Kosten
Max. 2 Subagents parallel; Sonnet für Umsetzung/Tests/Doku, Haiku für Mechanisches, Opus nur für Architektur/Fachentscheidungen.
Große Plan-/Research-Dateien abschnittsweise lesen (`grep -n '^## \|^### '`, dann `sed -n 'a,bp'`).

## Verbote
`legacy/` nicht ändern · keine Secrets · keine Portaldaten (ImmoScout & Co.) · keine ungeprüften Fachwerte ohne Status-Flag.
