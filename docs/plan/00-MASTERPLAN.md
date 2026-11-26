# Masterplan: Neuaufbau der Immobilien-Investment-Simulation

**Stand:** 26.11.2026 · **Status:** Entwurf zur Freigabe · **Branch:** `claude/immobilien-sim-refactor-rtnhvk`

> Dieses Dokument ist der Einstieg. Es fasst Ziel, Entscheidungen, Architektur und Fahrplan zusammen
> und verweist auf die Detailpläne (`01`–`08`) und die Recherche (`../research/`).

---

## 1. Worum es geht

Ein **realistisches Trainingsspiel für Immobilieninvestments in Deutschland**: Du übst, Objekte zu finden,
zu prüfen, zu finanzieren, zu kaufen, zu bewirtschaften und einen Bestand aufzubauen und zu skalieren –
mit echten Regeln (Bankprüfung, Kaufnebenkosten, AfA, Mietrecht, Betriebskosten, WEG, Gebäudemodernisierungsgesetz)
und echten Regionaldaten. Fehler kosten Spielgeld statt echtes Geld; jede Zahl ist erklärbar.

**Zielbild in einem Satz:** *„Ein Flugsimulator für Immobilieninvestoren – realistisch im Rechenkern,
verständlich in der Bedienung, ehrlich bei Unsicherheit.“*

### Was „realistisch“ konkret heißt

| Bereich | Prototyp (alt) | Neuaufbau |
|---|---|---|
| Bank | US-Bonitätsscore 300–850, ab 800 unbegrenzter Kredit | Haushaltsrechnung, Beleihungswert, Mietanrechnung 60–80 %, Stresszins, Eigenkapital für Nebenkosten, Portfoliobetrachtung, Bankprofile |
| Finanzierung | Zins über die gesamte Laufzeit | Zinsbindung, anfängliche Tilgung, Sondertilgung, Anschlussfinanzierung, Forward, Vorfälligkeitsentschädigung |
| Kauf | Klick auf „Kaufen“ | Exposé → Besichtigung → Unterlagen → Prüfung → Finanzierungszusage → Gebot → Notar → Nutzen-Lasten-Wechsel (Monate, Kosten, Risiken) |
| Kaufnebenkosten | pauschal | Grunderwerbsteuer je Bundesland (3,5–6,5 %), Notar/Grundbuch, Makler nach §§ 656b/c BGB |
| Steuern | keine | Einkünfte aus V+V, AfA (linear/degressiv/§ 7b), 15-%-Grenze, ESt-Tarif 2026, Spekulationsfrist, später vvGmbH/Holding |
| Vermietung | Mieten eingefroren | Mieter-Lebenszyklus, Mieterhöhung nach § 558 mit Kappungsgrenze, Index/Staffel, Mietpreisbremse regional, Zahlungsstörungen |
| Kosten | 8 % Verwaltung + 1 % Instandhaltung | Hausgeld (umlagefähig/nicht), Betriebskostenabrechnung mit Fristen, CO₂-Stufenmodell, Bauteil-Alterung, Rücklagen, Sonderumlagen |
| Markt | eine fiktive Stadt | echte Länder/Kreise/Gemeinden (12.588 Gebiete), Start mit echten Werten Nov. 2026, simulierte Zukunft + historische Szenarien |
| Lernen | keines | Erklär-Karten mit Formel und Quelle, Lernpfad, Debriefs, Entscheidungstagebuch, Musterlösungen |

Belege für die alten Mängel: `../research/01-audit-prototyp.md` (u. a.: Kaufen-und-Halten verliert Geld,
Flip mit Gutachten-Bonus bringt +46 T€ in 7 Monaten, 23 Objekte und 7,8 Mio. € Schulden bei 2.000 € Nettoeinkommen).

---

## 2. Getroffene Entscheidungen (26.11.2026)

| # | Entscheidung | Gewählt | Konsequenz |
|---|---|---|---|
| E1 | Plattform | **React 19 + Vite + TypeScript als Offline-PWA, später Capacitor (iOS/Android)** | eine Codebasis; Mobile ohne Neuschreiben |
| E2 | Zielgerät | **Desktop/Tablet zuerst**, Handy voll spielbar | Multi-Pane-Layouts (Liste │ Detail │ Erklärung); Mobil mit Tab-Leiste und Bottom Sheets |
| E3 | Spielwelt | **Echte Regionen, generierte Objekte** | Kennzahlen mit Quelle/Stand; fehlende Werte sichtbar „geschätzt“; Objekte passend zur Region erzeugt |
| E4 | Marktverlauf | **Start heute (Nov. 2026) mit simulierter Zukunft + historische Szenarien** | stochastisches, seed-basiertes Marktmodell + echte Zeitreihen (Bundesbank, Destatis, GREIX …) |
| E5 | Alter Code | **verwerfen** (Ideen bleiben, siehe Audit §7) | Archiv-Tag `prototyp-v0`, Code nach `legacy/` |
| E6 | Wissensquelle | **IC-Vault = Single Source of Truth** für Fakten und Parameter | Export-Datenpaket IC → Spiel; Lücken werden im Vault geschlossen |

Weitere Entscheidungen mit Empfehlung (UI-Kit, Undo-Regeln, Hosting, Konten, Monetarisierung, KI-Mentor …):
`08-entscheidungen-und-risiken.md`.

---

## 3. Leitprinzipien

1. **Realistisch in der Sache, gestuft in der Darstellung.** Das Rechenmodell ist immer voll realistisch;
   der Lernpfad schaltet Teilsysteme schrittweise sichtbar. Vereinfachungen sind gekennzeichnet.
2. **Jede Zahl ist erklärbar.** Antippen → Aussage → Rechenweg mit echten Werten → Quelle, Stand, Status.
3. **Ehrlich bei Unsicherheit.** Jeder Parameter trägt einen Status: **BELEGT · ABGELEITET · GESCHÄTZT · DESIGN**.
   Prognosen als Bandbreite. Keine Scheingenauigkeit.
4. **Entscheidungen sind der Spielinhalt.** Routine wird gebündelt (Monatsbericht), Aufmerksamkeit gehört Entscheidungen
   mit Folgenvorschau.
5. **Information kostet.** Unterlagen, Gutachten, Besichtigungen kosten Zeit/Geld – wer sie weglässt, trägt verdeckte Risiken.
6. **Du bestimmst das Tempo.** Rundenbasiert, Monat als Takt, „Weiter“ bis zum nächsten Ereignis. Keine Echtzeit.
7. **Lernen durch Reflexion.** Kauf-Review nach 12 Monaten, Jahres-Debrief, Entscheidungstagebuch, Schattenrechnung.
8. **Motivation ohne Manipulation.** Keine Streaks, keine FOMO-Timer, keine Ranglisten nach reinem Vermögen.
9. **Barrierefrei und responsiv ab Tag 1** (WCAG 2.2 AA).
10. **Keine Anlage-, Steuer- oder Rechtsberatung.** Trainingsumgebung mit Stand-Angaben und Disclaimer.

---

## 4. Architektur auf einen Blick

```
┌──────────────────────────── IC-Repo (Wissens-Vault) ───────────────────────────┐
│ vault/ (Fachnotizen, 40-Daten/*.csv, Regeln, Quellen)                           │
│ tools/export-spiel.mjs  ──►  spiel-export/  (versioniertes JSON-Datenpaket)      │
└──────────────────────────────────────┬──────────────────────────────────────────┘
                                       │ Snapshot (versioniert, mit Quellen/Status)
┌──────────────────────────── Immo-Repo (Spiel, pnpm-Monorepo) ───────────────────┐
│ packages/data      Import + Zod-Validierung + Ableitung fehlender Werte          │
│ packages/geo       VG250 → TopoJSON (Länder/Kreise), später PMTiles (Gemeinden)   │
│ packages/sim-core  reines TS, deterministisch: Markt, Angebote, Bank, Steuer,     │
│                    Vermietung, Kosten, Gebäude, Ereignisse, Regeln, Projektionen  │
│ packages/sim-worker  Web Worker + Comlink                                        │
│ packages/storage   Dexie (Web) / Dateien (nativ), Export .immosave, Migrationen  │
│ packages/ui        shadcn/ui + Base UI + Tailwind 4, Tokens, DataTable, Formatter │
│ packages/charts    ECharts-Presets (Wasserfall, Zeitreihe, Choropleth) + Tabellen │
│ apps/web           React-App (PWA)        apps/mobile  Capacitor (P9)            │
│ tools/             Balancing-/Monte-Carlo-CLI, Datenimport                       │
└─────────────────────────────────────────────────────────────────────────────────┘
```

Details: `04-technik-architektur.md` (Stack, Monorepo, Determinismus, Speicherung, Tests, CI, Mobile)
und `05-daten-und-wissen.md` (Datenvertrag, Lücken, Datenquellen, Lizenzen).

---

## 5. Das Spiel in drei Schleifen

```
MIKRO  (jeder Monat)   Posteingang → Entscheidungen mit Folgenvorschau → [Weiter] → Monatsbericht
MESO   (pro Deal)      Suche → Exposé → Kalkulator → Prüfung → Bank → Gebot → Notar → Übergabe → Kauf-Review
MAKRO  (pro Jahr)      Jahresabschluss (Steuer, Abrechnungen) → Jahresbericht + Debrief → Strategie → nächstes Jahr
```

Spielmodi: **Lernpfad** (geführte Szenarien), **Freies Spiel** (Start Nov. 2026, simulierte Zukunft),
**Historische Szenarien** (z. B. Niedrigzins 2012–2021, Zinswende 2022), **Challenges** (kurz, fester Seed, Musterlösung).
Details: `01-spieldesign.md`.

---

## 6. Hauptbereiche der App

| Bereich | Zweck |
|---|---|
| **Cockpit** | Lage auf einen Blick: Nettovermögen, Liquidität + Reichweite, Cashflow nach Steuern, Beleihungsquote, „Zu entscheiden“, „Demnächst“ |
| **Posteingang** | Alles, was eine Entscheidung braucht – mit Frist und Objektbezug |
| **Markt** | Angebote (Liste/Karte), Suchaufträge, Exposé, Kalkulator, Vergleich, Finanzierungsanfrage, laufende Käufe |
| **Bestand** | Objekte, Einheiten, Mieter, Instandhaltung, WEG, Verkauf |
| **Finanzen** | Liquidität, Kredite, Bank, Steuern, Berichte, Szenario-Labor/Stresstest |
| **Akademie** | Lernpfad, Glossar, Mikro-Lektionen, Entscheidungstagebuch, Debriefs, Ziele |

Global: **Zeitleiste** mit Datum und „Weiter“, Hilfe/Mentor, Befehlspalette (Strg+K), Profilmenü.
Vollständige Screen-Spezifikation: `03-ux-ui.md`.

---

## 7. Fahrplan (Kurzfassung)

| Phase | Ergebnis | Demo am Ende |
|---|---|---|
| **P0 Fundament** | Monorepo, CI, CLAUDE.md, ADRs, Design-Tokens, alter Code archiviert | leere App-Shell läuft als PWA |
| **P1 Rechenkern** | Geld/detmath/RNG/Kalender, Darlehen, Kaufnebenkosten, Kennzahlen, Golden Tests | CLI rechnet ein Objekt vollständig durch |
| **P2 Daten & Regionen** | IC-Export, Datenpaket, Kreis-Karte, Makro-Zeitreihen, Parameter-Registry | Regionen-Explorer mit Quellen |
| **P3 Vertical Slice „Die erste Wohnung“** | Markt → Exposé → Kalkulator → Bank → Kauf → Vermietung → Monatsbericht, Speichern | erste Wohnung spielbar, UX in Endqualität |
| **P4 Bewirtschaftung & Steuern** | Mieter-Automat, Mieterhöhung, BK-Abrechnung, WEG, Gebäude, Ereignisse, Steuer privat, Jahresabschluss | ein Jahr mit allen Pflichten durchspielen |
| **P5 Skalierung & Finanzen** | MFH, Portfoliobetrachtung, Anschlussfinanzierung, Verkauf, Stresstest, Krisen-Flow | 10 Einheiten aufbauen, Zinswende überstehen |
| **P6 Lernen & Szenarien** | Lernpfad, Debriefs, Akademie, historische Szenarien, Challenges, Ziele | Lernpfad Kapitel 1–5 |
| **P7 Profi-Inhalte** | vvGmbH/Holding, Aufteilung, Modernisierung/GModG/Förderung, Neubau-AfA, Off-Market, Gemeinde-Karte | Profi-Strategien spielbar |
| **P8 Release Web** | Kalibrierung (Monte Carlo), Usability-Tests, A11y-Audit, Performance, Datenquellen-Screen | öffentliche PWA |
| **P9 Mobile** | Capacitor iOS/Android, native Speicherung, Store-Vorbereitung | TestFlight / interner Android-Test |
| **W Wissens-Härtung** (parallel) | Lücken im IC-Vault mit Quellen schließen, Export pflegen | Lücken-Register schrumpft je Phase |

Arbeitspakete, Abnahmekriterien und Abhängigkeiten: `06-roadmap.md`.

---

## 8. Wie wir bauen (KI-gestützt)

- **Claude Code als Hauptentwickler**, du als Product Owner: Freigaben an Phasen-Enden, Entscheidungen bei Weggabelungen.
- **Projektregeln in `CLAUDE.md`** (Versionen, Muster, Verbote wie `Math.pow` im Kern, Statusflags, Quellenpflicht).
- **Eigene Subagents** für Fachprüfung gegen den Vault, UX-Review, Simulations-Tests, Datenpflege.
- **Plugins:** frontend-design, Design (Kritik, Design-System, Barrierefreiheit, UX-Texte), code-review, playwright,
  A11y Enforcer; später Mobile Release Check. Eingebaut: `dataviz`, `run`, `code-review`, `simplify`, `security-review`.
- **Lehre aus der Recherche:** höchstens 3–4 parallele Subagents (das 5-Stunden-Limit wurde mit 9 parallelen erreicht).

Details: `07-ki-workflow.md`.

---

## 9. Die größten Risiken (Top 5)

| Risiko | Gegenmaßnahme |
|---|---|
| **Fachliche Lücken:** Häufigkeiten, Dauern, Marktpreise fehlen im Vault (z. B. Leerstandsdauer, Ausfallquoten, Bauteil-Lebensdauern, regionale Preise) | Strang W: Lücken-Register, Werte mit Quelle in den Vault, bis dahin sichtbar „geschätzt“ |
| **Veraltete Quellen:** viele Vault-Werte aus immocation 2020/21 (Niedrigzins) | zwei Parameterprofile (2021/2026), Abgleich mit Web-Recherche Nov. 2026, `rulesVersion` je Jahr |
| **Komplexität überfordert** | Modell-Progression im Lernpfad, Erklär-Karten, Bündelung im Monatsbericht, Hilfestufen |
| **Determinismus über Browser/Geräte** | `detmath`, PRNG-Ströme, Hash-Test in Node/Chromium/WebKit/Firefox |
| **Verwechslung mit Beratung / Store-Ablehnung** | Disclaimer-Konzept, keine echten Finanzfunktionen, Stand-Angaben; Store-Strategie in P9 |

Vollständige Risikoliste: `08-entscheidungen-und-risiken.md`.

---

## 10. Dokumentenkarte

| Datei | Inhalt |
|---|---|
| `00-MASTERPLAN.md` | dieses Dokument |
| `01-spieldesign.md` | Spielprinzip, Schleifen, Zeitmodell, Modi, Startprofile, Ziele, Freischaltungen, Lernsystem, Scheitern, Schwierigkeit |
| `02-simulationsmodell.md` | Fach- und Architekturspezifikation aller Engines, Monats-Pipeline, Parameter-Registry, Balancing-Invarianten, Lücken-Register |
| `03-ux-ui.md` | Informationsarchitektur, alle Screens im einheitlichen Raster, Überlagerungen/Flows, Design-System, Sprachstil, Barrierefreiheit, UX-QS |
| `04-technik-architektur.md` | Stack, Monorepo, sim-core-Technik, Speicherung, Tests, CI/CD, PWA, Mobile-Pfad |
| `05-daten-und-wissen.md` | IC als Wissensquelle, Export-Datenvertrag, Datenquellen & Lizenzen, Zeitreihen, Lücken-Strategie |
| `06-roadmap.md` | Phasen P0–P9 + W mit Arbeitspaketen, Abnahmekriterien, Abhängigkeiten |
| `07-ki-workflow.md` | Claude-Code-Setup: CLAUDE.md, Skills, Subagents, Plugins, Hooks, Ablauf je Feature |
| `08-entscheidungen-und-risiken.md` | Entscheidungslog (ADR-Liste), offene Entscheidungen mit Empfehlung, Risiken |
| `../research/01–22` | Recherche-Grundlagen (Audit, IC-Fachspezifikationen, Web-Recherche) |

---

## 11. Nächster Schritt

Nach deiner Freigabe dieses Plans startet **P0 Fundament** (ca. 1 Sitzung): alten Code archivieren, Monorepo aufsetzen,
CLAUDE.md und ADRs schreiben, CI einrichten, Plugins installieren. Danach P1 und P2 parallel (Rechenkern und Datenpaket).
