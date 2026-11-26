# 07 – KI-Workflow: Wie wir mit Claude Code bauen

**Stand:** 26.11.2026 · Das Projekt wird überwiegend von KI-Agenten umgesetzt. Damit das verlässlich, fachlich korrekt
und UX-stark bleibt, braucht es klare Regeln, spezialisierte Subagents, eigene Skills, passende Plugins und Prüf-Hooks.

---

## 1. Rollen

| Rolle | Wer | Aufgaben |
|---|---|---|
| **Product Owner** | du | Ziele, Freigaben an Phasen-Enden, Entscheidungen bei Weggabelungen, Usability-Tests |
| **Orchestrator / Hauptentwickler** | Claude Code (Hauptsitzung) | plant Phasen, schreibt Kern-Code und Architektur, delegiert, prüft, committet |
| **Spezial-Subagents** | `.claude/agents/*` | Fachprüfung, Tests, UX-Review, Datenpflege, mechanische Arbeit |
| **Wissens-Kurator** | IC-Agents (`vault-kurator`, `luna-worker`) | Lücken im Vault schließen (Strang W) |

**Wann der Orchestrator dich fragt:** fachliche Weggabelungen ohne Vault-Beleg, UX-Grundsatzfragen, Kosten/Konten/Lizenzen,
Abweichungen vom Plan. Nicht bei Routine.

---

## 2. `CLAUDE.md` im Immo-Repo (Gliederung, Entwurf in P0)

1. **Projektziel** in 3 Sätzen + Link auf `docs/plan/00-MASTERPLAN.md`.
2. **Befehle:** `pnpm i`, `pnpm dev`, `pnpm test`, `pnpm turbo lint typecheck test --affected`, `pnpm balance …`, `pnpm e2e`.
3. **Versionen und Muster** (verhindert veraltete APIs): React 19, TanStack Router/Table v9/Form, Tailwind 4, Zod 4,
   ECharts 6, Base UI – jeweils 1 Referenzdatei im Repo.
4. **Harte Regeln für `sim-core`:** kein DOM, kein `Date`, kein `Math.random/pow/exp/log`, `**` verboten; Geld in `Cents`;
   keine Fachzahl als Literal (→ Parameter-Registry mit Status und Quelle); jede neue Kennzahl mit `explain()`.
5. **Fachliche Regeln:** Fakten nur aus dem IC-Vault (Pfad `../IC/vault` bzw. Export); Lücken als GESCHÄTZT + Eintrag ins
   Lücken-Register; keine Steuer-/Rechtsberatung formulieren.
6. **UX-Regeln:** Screen-Raster und DoD aus `docs/plan/03-ux-ui.md`; deutsche Zahlenformate nur über `ui/format`;
   Status nie nur über Farbe; jede Aktion mit Folgenvorschau oder Undo.
7. **Tests:** Golden + Property für Formeln, Determinismus-Hash nie „aktualisieren“, ohne Ursache zu nennen.
8. **Git:** kleine Commits `P<phase>.<paket>: <kurz>`; ADR bei Architekturänderung; Phasenbericht am Phasenende.
9. **Verbote:** `legacy/` nicht ändern; keine Secrets; keine Portaldaten (ImmoScout & Co.).

---

## 3. Projekt-Subagents (`.claude/agents/`, in P0 anlegen)

| Agent | Zweck | Werkzeuge | Modell (Vorschlag) |
|---|---|---|---|
| **fach-pruefer** | prüft Formeln, Parameter, Ereignis- und Lerntexte gegen den IC-Vault; liefert Befunde mit Wikilinks, Stand, Status; ändert nichts | Read, Grep, Glob | stark (Opus) |
| **sim-tester** | schreibt Golden-/Property-Tests aus Spezifikation (`02-…`), führt `tools/balance` aus, meldet Band-Verletzungen | Read, Write, Edit, Bash | mittel (Sonnet) |
| **ux-reviewer** | startet App, macht Screenshots (Desktop/Tablet/Mobil, hell/dunkel), prüft gegen Screen-Raster + DoD aus `03-…`, axe, Tastaturpfade; liefert priorisierte Befunde | Read, Bash (Playwright), Glob | stark (Opus) |
| **daten-kurator** | IC-Export ausführen, `packages/data` aktualisieren, Lizenzvermerke pflegen, Datenqualität messen | Read, Bash, Edit | mittel (Sonnet) |
| **mechaniker** | klar abgegrenzte, mechanische Aufträge im AUFTRAG-Format (Umbenennen, Muster anwenden) – nach Vorbild `luna-worker` im IC | Read, Edit, Write, Glob, Grep, Bash | klein (Haiku) |

**Delegationsregeln** (übernommen und angepasst aus dem IC-Umsetzungs-Prompt):
- Nur Aufgaben mit eindeutiger Eingabeliste, exakter Regel und maschineller Prüfung delegieren.
- Nicht delegieren: Architektur, fachliche Bewertungen, Konfliktauflösung, Abschlussprüfungen.
- **Höchstens 3–4 parallele Subagents**, die keine gemeinsamen Dateien berühren (Lehre: 9 parallele Agents haben das
  5-Stunden-Limit in ~20 Minuten erschöpft).
- Jeder Auftrag nennt: Ziel · Dateien · Regeln mit Verweis auf Plan-Abschnitt · Verboten · Fertig-wenn-Befehl · Rückmeldeformat.

---

## 4. Projekt-Skills (`.claude/skills/`, in P0/P1 anlegen)

| Skill | Auslöser | Ablauf (Kurz) |
|---|---|---|
| **neue-kennzahl** | „Kennzahl/Formel hinzufügen“ | Vault-Beleg suchen → Parameter in Registry (Status, Quelle, Stand) → Funktion + `explain()` → Golden + Property-Test → Glossar-Eintrag → fach-pruefer |
| **neuer-screen** | „Screen/Ansicht bauen“ | Raster aus `03-…` ausfüllen → Komponenten aus `packages/ui` → Zustände (leer/laden/Fehler/Lernmodus) → Desktop/Tablet/Mobil → A11y → Snapshots → ux-reviewer |
| **ereignis-anlegen** | „Ereignis/Posteingang-Nachricht hinzufügen“ | Katalog-Format → Auslöser + Wahrscheinlichkeit (Status) → Optionen mit Folgenvorschau → Texte → Tests → fach-pruefer |
| **regel-anlegen** | „Rechtsregel/Frist/Satz hinzufügen“ | Vault-Regel mit gültig_ab/bis → Export → Registry → Tests je Stichtag |
| **adr** | „Architekturentscheidung festhalten“ | Vorlage Kontext/Entscheidung/Alternativen/Folgen → `docs/adr/NNNN-…md` |
| **phase-abschluss** | „Phase abschließen“ | Abnahmekriterien prüfen → Bericht → Demo-Anleitung → offene Punkte → Freigabe anfragen |
| **vault-abfrage** | „Was sagt der Vault zu …?“ | Regeln aus IC `AGENTS.md`: nur aus dem Vault antworten, Wikilinks, Stand nennen, Lücken melden |

**Im IC-Repo:** Die vorhandenen Skills `vault-ingest` und `vault-pflege` liegen unter `.github/skills/` (Copilot-Format).
Für Claude Code zusätzlich unter `.claude/skills/` bereitstellen (Kopie oder Verweis), damit Strang W sie nutzt.
Neuer IC-Skill **spiel-export** (Export erzeugen, gegen Schema prüfen, Version erhöhen).

---

## 5. Plugins und eingebaute Skills

### 5.1 Empfohlene Plugins (Anthropic-Verzeichnis, noch nicht installiert)

| Plugin | Herausgeber | Einsatz | Ab Phase |
|---|---|---|---|
| **frontend-design** | Anthropic | hochwertige UI-Umsetzung, visuelle Qualität | P0 |
| **Design** | Anthropic | `design-critique`, `design-system`, `accessibility-review`, `ux-copy`, `user-research`, `research-synthesis` | P0 |
| **code-review** | Anthropic | Multi-Agent-Review von PRs | P1 |
| **playwright** (MCP) | Microsoft | Browser steuern für E2E und UX-Review | P3 |
| **A11y Enforcer** | Community | WCAG-2.2-Prüfung und Kontrast | P3 |
| **Mobile Release Check** | Community | Store-Readiness (Signatur, SDK, Berechtigungstexte) | P9 |
| *optional* Data | Anthropic | `validate-data`, `data-visualization` für Datenpipeline | P2 |

Community-Plugins vor Installation kurz sichten (Rechte, Hooks).

### 5.2 Bereits verfügbare Skills
`dataviz` (vor jedem Chart lesen!), `run` (App starten/screenshotten), `code-review`, `simplify`, `security-review`,
`session-start-hook`, `update-config` (Hooks), `claude-automation-recommender` (nach P0 einmal laufen lassen).

---

## 6. Hooks (über `update-config`, in P0)

| Hook | Wirkung |
|---|---|
| PostToolUse (Edit/Write auf `*.ts,*.tsx`) | `biome format` auf die Datei |
| PreToolUse (Edit/Write auf `legacy/**`) | blockieren |
| Stop | `pnpm turbo typecheck test --affected` – bei Fehlern Hinweis statt stiller Abschluss |
| SessionStart (Cloud) | `pnpm install` falls `node_modules` fehlt (via `session-start-hook`) |

---

## 7. Ablauf je Feature (Definition of Done)

```
1. Spezifikation   Abschnitt in 02-/03-… lesen; Lücken prüfen (Register)
2. Fachbeleg       vault-abfrage / fach-pruefer → Parameter + Quellen
3. Tests zuerst    Golden + Property (sim-tester)
4. Kern            sim-core: Funktion, Registry, explain(), Events
5. UI              neuer-screen: Raster, Zustände, Responsive, A11y
6. Review          ux-reviewer (Screenshots, axe, Tastatur) + code-review
7. Abschluss       Snapshots aktualisieren, Commit „P<n>.<m>: …“, ggf. ADR, Lücken-Register pflegen
```

---

## 8. Umgebung (Cloud-Sitzungen)

- Beide Repos in der Sitzung (Immo + IC), damit `fach-pruefer` und Strang W den Vault lesen können.
- Setup-Skript für die Umgebung (nach P0): Node 24, `corepack enable`, `pnpm install` im Immo-Repo.
- iOS-Builds brauchen einen Mac (dein Rechner via Remote Control oder macOS-CI-Runner) – erst in P9.
- Netzwerk: Paket-Registries reichen; für Zeitreihen-Importe ggf. `api.statistiken.bundesbank.de`, `www-genesis.destatis.de` freigeben (P2).
