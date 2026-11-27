# CLAUDE.md – Immo (Neuaufbau)

Realistisches Trainingsspiel für Immobilieninvestments in Deutschland. Aktuell: **Planung abgeschlossen bzw. in Abschluss,
Umsetzung startet mit Phase P0.** Vorläufige Fassung – wird in P0 ausgebaut (Gliederung: `docs/plan/07-ki-workflow.md` §2).

## Einstieg
- Übergabe/aktueller Stand: `docs/UEBERGABE.md`
- Masterplan: `docs/plan/00-MASTERPLAN.md` (verweist auf alle Detailpläne `01`–`08`)
- Recherche: `docs/research/` (Fachspezifikationen aus dem IC-Vault, Web-Recherche)
- Wissensbasis (Fakten): Repo `henrikbch1/ic`, Vault unter `vault/` – Regeln in dessen `AGENTS.md`

## Arbeitsregeln
- **Große Dateien abschnittsweise lesen** (`grep -n '^## \|^### '`, dann `sed -n 'a,bp'`). Plan- und Research-Dateien sind 10–150 KB groß.
- **Kosten:** max. 2–3 Subagents parallel; Sonnet für Umsetzung/Tests/Doku, Haiku für Mechanisches, Opus nur für Architektur und Fachentscheidungen.
- **Fakten nur aus dem IC-Vault** (oder als GESCHÄTZT markieren und ins Lücken-Register). Keine Steuer-/Rechtsberatung formulieren.
- Status-Flags für jeden Parameter: BELEGT · ABGELEITET · GESCHÄTZT · DESIGN.
- Alter Prototyp (`index.html`, `root/`) ist nur Referenz und wird in P0 nach `legacy/prototyp-v0/` verschoben – nicht weiterentwickeln.
- Commits: `P<phase>.<paket>: <kurz>` bzw. `docs(...)` für Dokumentation; Branch `claude/immobilien-sim-refactor-rtnhvk`.
- Sprache: Deutsch für Doku und UI-Texte.
