# 06 – Roadmap

**Stand:** 26.11.2026 · Phasen P0–P9 plus paralleler Strang W (Wissens-Härtung).
Jede Phase endet mit einer **Demo**, einem **Phasenbericht** (`docs/berichte/phase-<N>-bericht.md`) und deiner **Freigabe**.
Feature-Details: `02-simulationsmodell.md` (Engines mit Phase-Tags) und `03-ux-ui.md` (Screens mit Phase-Tags).

**Arbeitsweise je Phase:** Plan (`phase-<N>-plan.md`, Arbeitspakete + Abnahmekriterien) → Umsetzung in kleinen PR-großen
Schritten → Tests/Reviews → Bericht → Freigabe. Schätzungen in **Sitzungen** (eine fokussierte Claude-Code-Sitzung
≈ 2–4 Stunden); sie sind grob und werden je Phase nachgeschärft.

```
P0 ─► P1 ─┬─► P3 ─► P4 ─► P5 ─► P6 ─► P7 ─► P8 ─► P9
          │    ▲
P0 ─► P2 ─┘────┘
W  ═══════════════════════════════════════════════════► (parallel, liefert Daten je Phase)
```

---

## P0 – Fundament (≈ 1–2 Sitzungen)

**Ziel:** Saubere Basis, auf der Agents zuverlässig arbeiten können.

| # | Arbeitspaket | Abnahme |
|---|---|---|
| 0.1 | Alten Code archivieren: Tag `prototyp-v0`, `git mv` nach `legacy/prototyp-v0/`, `.idea/` ignorieren | Tag existiert; Root sauber |
| 0.2 | Monorepo: pnpm-Workspace + Catalogs, Turborepo, `tsconfig.base`, Biome, Paket-Skelette (`sim-core`, `sim-worker`, `data`, `geo`, `storage`, `ui`, `charts`, `content`, `config`), `apps/web` | `pnpm i && pnpm turbo build test lint` grün |
| 0.3 | Versions-Spike: Versionen aus `04-…` §1 prüfen und festschreiben | ADR 0001/0002 mit echten Versionen |
| 0.4 | `CLAUDE.md` (Projektregeln, Versionen, Muster, Verbote), `.claude/agents/*`, `.claude/skills/*` (siehe `07-…`) | Agents/Skills auffindbar |
| 0.5 | ADRs 0001–0010 als Entwürfe | in `docs/adr/` |
| 0.6 | CI: verify, build, Preview-Deploy; dependency-cruiser | PR zeigt grüne Checks + Preview-Link |
| 0.7 | App-Shell: Router, Layout-Gerüst (Sidebar/Rail/Tab-Leiste), Design-Tokens (hell/dunkel), Schriften, PWA-Manifest | leere Shell offline installierbar |
| 0.8 | Plugins installieren (frontend-design, Design, code-review, playwright, A11y Enforcer) | in Sitzung verfügbar |

**Demo:** Shell läuft als installierbare PWA auf Desktop und Handy, CI grün.

---

## P1 – Rechenkern (≈ 3–4 Sitzungen)

**Ziel:** Deterministischer Kern mit allen Grundformeln, vollständig getestet.

| # | Arbeitspaket | Abnahme |
|---|---|---|
| 1.1 | `Cents`, Basispunkte, Rundungsregeln, Formatter-Verträge | Property-Tests grün |
| 1.2 | `detmath` (`powInt`, `expDet`, `lnDet`), zählerbasierter PRNG, Lint-Verbote | Genauigkeit vs. decimal.js; Verbote greifen |
| 1.3 | Kalender (`MonthIndex`, Quartal, Steuerjahr), Monats-Pipeline-Gerüst, Befehls-/Event-Infrastruktur | `advance` mit leerer Welt deterministisch |
| 1.4 | Parameter-Registry (Status-Flags, Quelle, Stand, gültig ab/bis), `rulesVersion` | Registry-Schema + Lint „keine Fachliterale“ |
| 1.5 | Darlehen: Annuität, Zinsbindung, Sondertilgung, Restschuld, Tilgungsplan | Golden Tests T1–T13 (`../research/10-…` §1.9) |
| 1.6 | Kaufnebenkosten (GrESt je Land, Notar/Grundbuch, Makler §§ 656b/c) | Tabelle 16 Länder korrekt |
| 1.7 | Kennzahlen + Cashflow-Kaskade (operativ → n. Finanzierung → n. Steuern → n. Rücklagen) inkl. `explain()` | jede Kennzahl liefert Rechenweg |
| 1.8 | Determinismus-Hash-Test in Node + Browser-Modus (Chromium/WebKit/Firefox) | CI-Job grün |
| 1.9 | Balancing-CLI-Gerüst (`tools/balance`) | rechnet ein Objekt über 30 Jahre durch |

**Demo:** `pnpm balance --objekt beispiel-etw` gibt eine vollständige Objektrechnung mit Rechenwegen aus.

---

## P2 – Daten & Regionen (≈ 3 Sitzungen, parallel zu P1 möglich)

**Ziel:** Echte Regionen und Zeitreihen im Spiel, mit Quellen und Status.

| # | Arbeitspaket | Abnahme |
|---|---|---|
| 2.1 | **IC:** `tools/export-spiel.mjs` (Datenvertrag v1) + Import-Erweiterung (Einwohner, Fläche, Koordinaten, DEGURBA) – über Vault-Prozess | Export validiert gegen Schema; vault-lint 0 Befunde |
| 2.2 | `packages/data`: Import, Zod, Ableitung fehlender Werte (GESCHÄTZT), Datenqualitäts-Indikator | Paket < 1 MB gzip |
| 2.3 | `packages/geo`: VG250 → TopoJSON Länder/Kreise, ARS-Mapping, Lizenzvermerk | Karte < 300 KB gzip |
| 2.4 | Zeitreihen-Import (Bundesbank, Destatis; GREIX nach Lizenzklärung) → Vault → Export | Zins-/VPI-/HPI-Reihen im Paket |
| 2.5 | Regel-Daten v1: GrESt, Kappungsgrenze/Mietpreisbremse-Gebiete (mind. Fokusländer), AfA-Sätze, ESt 2026 | Regeln mit gültig_ab/bis |
| 2.6 | Regionen-Explorer (Debug-/Lern-Screen): Karte + Tabelle + Kennzahl-Erklärung mit Quelle | 12.588 Gebiete flüssig |
| 2.7 | Screen „Datenquellen & Lizenzen“ (Grundgerüst) | Pflichtvermerke vollständig |

**Demo:** Auf der Karte einen Kreis anklicken → Kennzahlen mit Stand, Quelle, Status „gemessen/geschätzt“.

**Strang W in P2:** Lücken A1–A5 (`05-…` §6.2) schließen, mindestens für 2–3 Fokusländer (entschieden E7: Niedersachsen, NRW, Bremen – Details `09-fokuslaender.md`).

---

## P3 – Vertical Slice „Die erste Wohnung“ (≈ 6–8 Sitzungen)

**Ziel:** Ein vollständiger, realistischer Durchlauf in **UX-Endqualität** – der Maßstab für alles Weitere.

| # | Arbeitspaket | Abnahme |
|---|---|---|
| 3.1 | Makro-Startzustand Nov. 2026 + einfacher Marktpfad (Zins, Preise, Mieten) | Startwerte = Recherche Nov. 2026 |
| 3.2 | Regionalmarkt v1 + Angebotsgenerator (ETW; sichtbar vs. verdeckt; Exposé-Schönung) | Angebote plausibel je Region (Kalibrierungsband) |
| 3.3 | Spieler/Haushalt (Startprofile S1–S6 inkl. „Mein echtes Profil“) | Startassistent in ≤ 3 Schritten |
| 3.4 | Kaufprozess-Automat (Besichtigung, Unterlagen, Gebot, Notar, Übergang) mit Dauern/Kosten | Tracker zeigt realistische Monate |
| 3.5 | Bank v1: Profile A/B, Prüfschritte P0–P6, Begründungen, Konditionen | jede Absage mit Code + Zahlen + Erklärung |
| 3.6 | Vermietung v1: Inserat, Bewerber, Auswahl, Vertrag, Mietzahlung; Hausgeld | Wohnung nach Kauf vermietbar |
| 3.7 | UI: Cockpit, Zeitleiste/„Weiter“, Posteingang, Monatsbericht, Markt (Liste + Kreis-Karte), Exposé, Kalkulator (Bierdeckel + Vollkalkulation ohne Steuer), Finanzierungsanfrage, Kauf-Tracker, Objekt-Detail (Basis) | Screen-DoD aus `03-…` erfüllt |
| 3.8 | Erklär-Karte, Entscheidungsdialog mit Folgenvorschau, Prüfschritt für teure Aktionen, Undo im Monat | auf allen Kennzahlen/Aktionen verfügbar |
| 3.9 | Speichern/Laden/Export/Import, Autosave, Migration v1 | E2E Round-Trip mit gleichem Hash |
| 3.10 | Visuelle Regression, axe, Tastatur-E2E, size-limit | 0 kritische A11y-Verstöße |
| 3.11 | Usability-Test 1 (du + 1–2 Personen, 5 Aufgaben) | Befunde eingearbeitet |

**Demo:** Neues Spiel (S1, Region frei) → Wohnung finden, prüfen, finanzieren, kaufen, vermieten → 12 Monate spielen → Kauf-Review.

---

## P4 – Bewirtschaftung & Steuern (≈ 6–7 Sitzungen)

| # | Arbeitspaket | Abnahme |
|---|---|---|
| 4.1 | Mieter-Automat vollständig (Zahlungsstörungen, Mahnung, Kündigung, Räumung, Leerstand) | Ereignisse mit Optionen + Folgen |
| 4.2 | Mieterhöhung: § 558 (Fristen, Kappungsgrenze regional), Index, Staffel; Mietpreisbremse bei Neuvermietung | Assistent zeigt rechtliche Grenzen |
| 4.3 | Betriebskosten-Engine: Umlagefähigkeits-Prüfkette, Schlüssel, Heizkosten, CO₂-Stufenmodell, Fristen | Jahresabrechnung erzeugt Nachzahlung/Guthaben |
| 4.4 | WEG: Hausgeld, Wirtschaftsplan, Rücklage, Sonderumlage, Eigentümerversammlung | Beschluss-Ereignisse |
| 4.5 | Gebäude: Bauteile mit Alter/Zustand/Ausfall, Instandhaltung, Renovierung, Versicherungen/Schäden | Schadensfälle mit Deckungsprüfung |
| 4.6 | Ereignissystem + Ereigniskatalog v1 (Datenformat, Fristen, Standardfolgen) | ≥ 25 Ereignistypen |
| 4.7 | Steuer-Engine privat: V+V, AfA, 15-%-Grenze, Werbungskosten, ESt-Tarif 2026, Erstattung im Folgejahr | Golden Tests Steuerfälle |
| 4.8 | Jahresabschluss-Sequenz + Jahresbericht + Debrief v1 | ein Jahr mit allen Pflichten spielbar |
| 4.9 | Zeitbudget + Delegation (Hausverwaltung/SEV) | Abwägung Zeit/Geld sichtbar |
| 4.10 | UI: Objekt-Detail komplett, Einheit/Mietvertrag, Mieterhöhungs-Assistent, Vermietung, Instandhaltung, WEG-Bereich, Steuern, Liquidität | Screen-DoD |

**Demo:** Zwei Jahre mit Mieterwechsel, Mieterhöhung, NK-Abrechnung, Sonderumlage und Steuerbescheid.

---

## P5 – Skalierung & Finanzen (≈ 5–6 Sitzungen)

| # | Arbeitspaket | Abnahme |
|---|---|---|
| 5.1 | MFH (mehrere Einheiten, ein Gebäude, eigene BK-Abrechnung) | MFH kaufbar und bewirtschaftbar |
| 5.2 | Bank v2: Portfoliobetrachtung, Kreditrahmen, Bankbeziehung, Vermittler | Bremse greift realistisch |
| 5.3 | Anschlussfinanzierung (Prolongation, Umschuldung, Forward), Sondertilgung, Vorfälligkeitsentschädigung | Stopp-Regeln 12/6/3 Monate |
| 5.4 | Bewertung & Verkauf (ein Wertmodell, Verkaufsprozess, Spekulationsfrist, Erlös-Wasserfall) | kein Gratis-Flip (Anti-Exploit-Test) |
| 5.5 | Marktpfad v2: stochastisches Makromodell, kalibriert an Zeitreihen; Regionalpfade | Monte-Carlo-Bänder eingehalten |
| 5.6 | Szenario-Labor/Stresstest (Zins +2 Pp., Leerstand, Mietausfall, Sanierung) | wirkt aufs ganze Portfolio |
| 5.7 | Krisen-Flow (Frühwarnung → Optionen → Zwangsversteigerung) | Eskalationsstufen testbar |
| 5.8 | UI: Bestand-Übersicht mit Linsen, Kredite, Bank, Berichte, Verkauf-Assistent, Vergleich, Suchaufträge | Screen-DoD |

**Demo:** Von 1 ETW zu 10 Einheiten; Zinsbindungsende bei höherem Zins überstehen.

---

## P6 – Lernen & Szenarien (≈ 5 Sitzungen)

| # | Arbeitspaket | Abnahme |
|---|---|---|
| 6.1 | Lernpfad K1–K9 (Szenario-Format, Lernziele, Modell-Progression, Musterlösungen) | K1–K5 vollständig spielbar |
| 6.2 | Historische Szenarien H1–H4 mit echten Zeitreihen und Regelständen | H2 + H4 spielbar |
| 6.3 | Challenges (fester Seed, Musterlösung, optional Ironman) | 5 Challenges |
| 6.4 | Akademie: Glossar, Mikro-Lektionen (22), Entscheidungstagebuch, Debrief-Archiv | alle Begriffe verlinkt |
| 6.5 | Kauf-Review, Schattenrechnung, Bewertungsraster | in Jahres-Debrief integriert |
| 6.6 | Ziele/Meilensteine/Statistiken, Jahresbericht „Dein Investmentjahr“ | ohne Manipulationsmuster |
| 6.7 | Mentor v1: vorgenerierte, geprüfte Texte | fachlich geprüft (fach-pruefer) |
| 6.8 | Usability-Test 2 (Onboarding mit Neulingen) | Zeit bis erste Kaufentscheidung gemessen |

---

## P7 – Profi-Inhalte (≈ 5–6 Sitzungen)

vvGmbH/Holding (Gründung, Steuersatzgefälle, Strukturkosten, Bürgschaft) · Aufteilung in WEG · Modernisierung mit
§ 559-Umlage, GModG-Pflichten, BEG-Förderung · Neubau/Bauträger-ETW (degressive AfA, § 7b) · Mikroapartment/möbliert ·
Off-Market über Bank/Netzwerk · Wohn- und Geschäftshaus · Gemeinde-Karte (MapLibre + PMTiles) · Lernpfad K10.

---

## P8 – Release Web (≈ 4 Sitzungen)

| # | Arbeitspaket | Abnahme |
|---|---|---|
| 8.1 | Kalibrierung: Monte Carlo über Profile × Strategien × Marktpfade; Fallstudien-Bänder | Bericht ohne Band-Verletzung |
| 8.2 | A11y-Audit (WCAG 2.2 AA), Screenreader-Stichproben | 0 kritische Befunde |
| 8.3 | Performance auf Low-End-Gerät, Bundle-Budgets | Budgets aus `04-…` §8 |
| 8.4 | Datenquellen & Lizenzen vollständig, Disclaimer, Impressum/Datenschutz | rechtlich geprüft (durch dich) |
| 8.5 | Usability-Test 3 (5 Personen), Fehlerbehebung | Top-10-Befunde gelöst |
| 8.6 | Produktions-Deploy (Cloudflare), Update-Dialog, Backup-Erinnerung | öffentliche PWA |

---

## P9 – Mobile (≈ 3–4 Sitzungen + Store-Wartezeiten)

Capacitor-Projekt · native Speicherung (Dateien) · Safe Areas, Tastatur, Zurück-Geste · Haptik dezent · Icons/Splash ·
Store-Texte + Disclaimer · Mobile Release Check · TestFlight (Mac nötig) · Android interner Test (12 Tester/14 Tage bei Privatkonto).

---

## Strang W – Wissens-Härtung (laufend)

| Vor Phase | Lücken schließen (Auszug, `05-…` §6.2) |
|---|---|
| P1 | GrESt, ESt 2026, AfA-Sätze, Notar/Grundbuch-Gebühren als Parameter im Vault |
| P2 | A1–A4: Gebietsattribute, Zeitreihen, regionale Preise/Mieten (Fokusländer), Leerstand/Prognose |
| P3 | B4/B5: Funnel-Dauern, Verhandlungsspannen, Kaufpreisfaktoren; Bankparameter 2026 als Q-Notizen |
| P4 | B1–B3: Leerstand/Fluktuation/Ausfall, Bauteil-Lebensdauern, Hausgeld/Verwalter/Versicherung |
| P5 | Vorfälligkeitsentschädigung, Anschlusskonditionen, Bewertungsverfahren |
| P7 | C1: gewerblicher Grundstückshandel, Grundsteuer je Land, GmbH-Kosten, GModG-Details |

**Kennzahl:** Anteil GESCHÄTZT-Parameter je Engine – soll je Phase sinken; Ziel zum Release < 20 % in Kern-Engines.

---

## Meilenstein-Übersicht

| Meilenstein | nach | Was du dann kannst |
|---|---|---|
| **M-A „Rechnet richtig“** | P1 | ein Objekt fachlich korrekt durchrechnen (CLI) |
| **M-B „Erste Wohnung“** | P3 | realistisch eine Wohnung kaufen und vermieten |
| **M-C „Vermieter-Alltag“** | P4 | Jahre mit allen Pflichten und Steuern spielen |
| **M-D „Skalieren“** | P5 | Bestand aufbauen, Krisen überstehen |
| **M-E „Lernspiel“** | P6 | geführt lernen, Historie nachspielen |
| **M-F „Release“** | P8 | öffentliche Web-App |
| **M-G „App“** | P9 | Testversion auf dem Handy |
