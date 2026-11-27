# Übergabe – Stand 27.11.2026

> Zweck: In einem **neuen Chat** ohne Kontextverlust weitermachen und dabei Kosten sparen.
> Einfach den Start-Prompt unten (§6) in den neuen Chat kopieren.

---

## 1. Wo wir stehen

- **Repo:** `henrikbch1/immo`, Branch `claude/immobilien-sim-refactor-rtnhvk` (alles committet und gepusht).
- **Wissensbasis:** `henrikbch1/ic` (Obsidian-Vault, nur gelesen, nichts geändert).
- **Phase:** Planung fast fertig. Noch kein neuer Spielcode geschrieben. Der alte Prototyp (`index.html`, `root/`) liegt unverändert da
  und wird in P0 nach `legacy/prototyp-v0/` archiviert.

### Fertig
| Bereich | Dateien |
|---|---|
| Recherche (9 Dokumente, ~7.000 Zeilen) | `docs/research/01` Audit Prototyp · `10` Finanzierung/Bank · `11` Steuern/Recht/Regeln · `12` Bewirtschaftung · `13` Akquise/Markt/Gebiete · `14` Fallstudien/Strategie/immocation · `20` Marktdaten/Recht 2026/Datenquellen · `21` Game-Design/UX · `22` Tech-Stack |
| Plan | `docs/plan/00-MASTERPLAN.md` (Einstieg) · `01` Spieldesign · `04` Technik · `05` Daten & Wissen · `06` Roadmap · `07` KI-Workflow · `08` Entscheidungen & Risiken |
| Plan (Teile) | `02-simulationsmodell.md`: Überblick + Querschnitt fertig · `03-ux-ui.md`: IA + alle Screens + erste Overlays fertig |

### In Arbeit (am 27.11. an Sonnet-Agents gegeben)
- `02-simulationsmodell.md`: §2 Engines (2.1–2.18), §3 Balancing-Invarianten, §4 Kalibrierung, §5 Lücken-Register, §6 Umsetzungsreihenfolge
- `03-ux-ui.md`: §3.6–3.10 Flows, §4 Design-System, §5 Sprachstil, §6 Barrierefreiheit, §7 UX-QS, §8 UI-Reihenfolge

**Prüfen im neuen Chat:** `grep -n '^## ' docs/plan/02-simulationsmodell.md docs/plan/03-ux-ui.md` – fehlen Abschnitte, diese nachziehen (Sonnet reicht).

---

## 2. Getroffene Entscheidungen

| # | Entscheidung |
|---|---|
| E1 | React 19 + Vite + TypeScript als Offline-PWA, später Capacitor (iOS/Android) |
| E2 | Desktop/Tablet zuerst, Handy voll spielbar |
| E3 | Echte Regionen (12.588 Gebiete aus dem Vault), generierte Objekte; fehlende Werte sichtbar „geschätzt“ |
| E4 | Freies Spiel startet Nov. 2026 mit echten Werten, Zukunft simuliert (Seed) + historische Szenarien |
| E5 | Alten Code verwerfen, Ideen behalten |
| E6 | IC-Vault = einzige Quelle für Fakten; Spiel liest versionierten Export |

Offene Entscheidungen mit Empfehlung: `docs/plan/08-entscheidungen-und-risiken.md` §2 (wichtig vor P2: **O9 Fokusländer** – Vorschlag Bremen, Niedersachsen, NRW + dein Wohn-/Zielort).

---

## 3. Die wichtigsten Erkenntnisse (Kurzfassung)

1. **Der Vault liefert Regeln und Formeln gut**, aber **Häufigkeiten, Dauern und Marktpreise fehlen** (Leerstandsdauer,
   Ausfallquoten, Bauteil-Lebensdauern, regionale Preise/Mieten). → Strang W „Wissens-Härtung“ + Status GESCHÄTZT.
2. Viele Vault-Werte stammen von immocation 2020/21 (Niedrigzins). Für 2026: Bauzins 10 J. ≈ 4,0–4,5 %, EZB 2,50 %.
   **Die 6-%-Faustregel wird bei 4 % Zins zu ≈ 9 %** – das macht das freie Spiel 2026 bewusst „schwer“.
3. Größter schneller Datenhebel: Die Destatis-Importbasis im IC hat Einwohner, Fläche, Koordinaten, DEGURBA – nur nicht importiert.
4. Technik-Knackpunkt: **Determinismus** (eigenes `detmath`, kein `Math.pow` im Kern, Geld in Cent, PRNG-Ströme).
5. UX-Kern: rundenbasiert mit „Weiter“, Posteingang als Zentrale, **Erklär-Karte für jede Zahl**, Folgenvorschau vor jeder Entscheidung.

---

## 4. Nächste Schritte

1. **Abschluss Plan:** 02/03 auf Vollständigkeit prüfen, kurz querlesen (Widersprüche zu 00/01/04/06?), committen.
2. **Deine Freigabe** des Masterplans (`docs/plan/00-MASTERPLAN.md`) – Änderungswünsche gern als Liste.
3. **P0 Fundament** starten (`docs/plan/06-roadmap.md`): Legacy archivieren, Monorepo, CLAUDE.md ausbauen, ADRs, CI, App-Shell,
   Plugins installieren (frontend-design, Design, code-review, playwright, A11y Enforcer).
4. Danach **P1 Rechenkern** und **P2 Daten** (P2 braucht Änderungen im IC-Repo: Export-Skript + Import-Erweiterung).

---

## 5. Kosten sparen – Regeln für die nächsten Chats

| Aufgabe | Modell |
|---|---|
| Architektur, fachliche Entscheidungen, Reviews, schwierige Bugs | **Opus** (sparsam) |
| Umsetzung nach Spezifikation, Tests schreiben, Doku, UI-Screens | **Sonnet** (Standard) |
| Mechanisches: Umbenennen, Formatieren, Daten konvertieren, Dateien verschieben | **Haiku** |

- **Ein Chat pro Phase** (oder pro größerem Arbeitspaket). Am Ende: Phasenbericht in `docs/berichte/` = Übergabe für den nächsten Chat.
- **Höchstens 2–3 Subagents gleichzeitig**, jeweils mit passendem Modell (`model: sonnet`/`haiku`).
- **Große Dateien nie komplett lesen**, sondern gezielt: erst `grep -n '^## \|^### ' datei`, dann den Abschnitt mit `sed -n 'a,bp'`.
  (`03-ux-ui.md` hat > 150 KB, die Research-Dokumente je 60–100 KB.)
- Keine breiten Web-Recherchen mehr ohne konkreten Anlass – die Recherche ist gemacht; Lücken gezielt im Strang W schließen.
- Im neuen Chat mit `/model sonnet` starten; für Architekturfragen gezielt auf Opus wechseln.

---

## 6. Start-Prompt für den neuen Chat (kopieren)

```text
Wir bauen das Immobilien-Investment-Trainingsspiel im Repo henrikbch1/immo neu
(Branch claude/immobilien-sim-refactor-rtnhvk). Lies zuerst NUR docs/UEBERGABE.md
und docs/plan/00-MASTERPLAN.md. Große Dateien bitte nur abschnittsweise lesen.

Aufgabe jetzt:
1. Prüfe, ob docs/plan/02-simulationsmodell.md und docs/plan/03-ux-ui.md vollständig sind
   (Gliederung laut UEBERGABE.md §1). Fehlende Abschnitte ergänzen – gib das an einen
   Sonnet-Subagent ab.
2. Lies 02 und 03 nur quer auf Widersprüche zu 00/01/04/06 und behebe sie.
3. Committe und pushe. Fasse mir in max. 10 Zeilen zusammen, was ich freigeben soll.

Spar Kosten: max. 2 Subagents parallel, Sonnet/Haiku für Umsetzung und Mechanik,
Opus nur für Architektur- und Fachentscheidungen.
```

**Für den Start von P0 danach:**

```text
Der Plan in docs/plan/ ist freigegeben. Starte Phase P0 laut docs/plan/06-roadmap.md
(Arbeitspakete 0.1–0.8). Lies dafür docs/UEBERGABE.md, docs/plan/04-technik-architektur.md
und docs/plan/07-ki-workflow.md. Schreib zuerst docs/berichte/phase-0-plan.md, dann umsetzen,
am Ende docs/berichte/phase-0-bericht.md. Max. 2 Subagents parallel, Sonnet/Haiku bevorzugen.
```
