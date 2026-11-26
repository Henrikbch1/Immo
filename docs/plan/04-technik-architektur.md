# 04 – Technik und Architektur

**Stand:** 26.11.2026 · Grundlage: `../research/22-web-tech-stack.md` (Vergleich, Versionen, Quellen).
Entscheidung E1: **React + Vite + TypeScript als Offline-PWA, später Capacitor**. Entscheidung E2: **Desktop/Tablet zuerst**.

---

## 1. Stack (verbindlich, Versionen über pnpm-Catalogs gepinnt)

| Schicht | Wahl | Begründung (Kurz) |
|---|---|---|
| Laufzeit/Tooling | Node 24 LTS, **pnpm 11** (Catalogs), **Turborepo 2** | Monorepo-Standard, zentrale Versionen |
| Sprache | **TypeScript strict** (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`); TS 6 für Tools, TS 7 für schnelles `tsc --noEmit` | Typsicherheit, KI-freundlich |
| Build | **Vite 8** (Rolldown) | schnell, PWA-Plugin, Worker-Support |
| UI | **React 19.2** + React Compiler | größtes Ökosystem, beste KI-Abdeckung |
| Routing | **TanStack Router v1** (dateibasiert, typsichere Search-Params) | Deep-Links in Filter/Ansichten |
| Komponenten | **shadcn/ui auf Base UI** + **Tailwind CSS 4.3** | eigener Code im Repo, zugängliche Primitives |
| Tabellen | **TanStack Table v9** + TanStack Virtual | 12.588 Gebiete, Portfolio-Tabellen virtualisiert |
| Charts | **Apache ECharts 6** (Zeitreihe, Wasserfall, Sankey, Heatmap, Choropleth) + Tabellen-Fallback | eine Engine für alles, ARIA-Unterstützung |
| Formulare | **TanStack Form v1** + Zod 4 (Standard Schema) | Live-Rechnung im Kalkulator |
| Client-State | **Zustand 5** (nur UI-State + Projektionen) | Spielzustand lebt im Worker |
| Validierung | **Zod 4** an Grenzen (Import, Datenpakete, Worker-Nachrichten im Dev) | nicht im Hot-Path |
| Worker | eigener `SimClient` über **Comlink** | UI bleibt flüssig |
| Speicher | **Dexie 4.4** (IndexedDB) im Web; nativ zusätzlich `@capacitor/filesystem` | iOS-WebView-Datenverluste abfangen |
| Animation | **Motion 12**, immer mit `prefers-reduced-motion` | dezente Übergänge |
| i18n | **Paraglide JS 2** (Deutsch zuerst) | typsichere Texte, kleiner Laufzeit-Code |
| Karte | Stufe 1: VG250 Länder/Kreise als TopoJSON in ECharts · Stufe 2 (P7): **MapLibre GL 6 + PMTiles** für Gemeinden | kein WebGL im MVP |
| Tests | **Vitest 4** (inkl. Browser-Modus), **fast-check 4**, **Playwright 1.65**, `@axe-core/playwright` | Formeln, Determinismus, E2E, A11y |
| Lint/Format | **Biome 2** (+ ESLint 10 minimal für React-Hooks/Compiler) | ein schnelles Werkzeug |
| Hosting | **Cloudflare Workers Static Assets** (PR-Previews, Header) | PWA, später KI-Proxy möglich |
| Mobile (P9) | **Capacitor 8/9** | gleiche Web-App als Store-App |

> Versionen vor dem Festschreiben in P0 per Spike prüfen (einige Angaben in der Recherche aus Sekundärquellen, markiert [S]).

---

## 2. Monorepo-Struktur

```
Immo/
├─ apps/
│  ├─ web/                 React-App (PWA); routes/, features/, stores/, sim/ (SimClient), e2e/
│  └─ mobile/              Capacitor (P9): capacitor.config.ts, ios/, android/
├─ packages/
│  ├─ sim-core/            reines TS, kein DOM, kein Date, kein Math.random/pow/exp/log
│  ├─ sim-worker/          Worker-Entry, Comlink-expose
│  ├─ data/                Import IC-Export → Zod → Datenpakete (+ Ableitung fehlender Werte)
│  ├─ geo/                 VG250 → mapshaper → TopoJSON; ARS-Mapping; Lizenzvermerk
│  ├─ storage/             StorageAdapter (Dexie/Filesystem), Export/Import .immosave, Migrationen
│  ├─ ui/                  shadcn-Komponenten, Tokens, DataTable, NumberField, Formatter (Intl de-DE)
│  ├─ charts/              ECharts-Presets + Tabellen-Fallback + Textzusammenfassung
│  ├─ content/             Glossar, Lektionen, Ereignistexte, Mentor-Texte (aus Vault abgeleitet, Paraglide)
│  └─ config/              tsconfig-Basen, Biome, Vitest-Presets
├─ tools/
│  ├─ balance/             Monte-Carlo-/Kalibrierungs-CLI (sim-core in Node)
│  └─ import/              Zeitreihen-Import (Bundesbank SDMX, Destatis GENESIS, GREIX)
├─ legacy/prototyp-v0/     alter Prototyp (read-only, Tag prototyp-v0)
├─ docs/  research/  plan/  adr/
├─ .claude/  agents/  skills/  settings.json
├─ CLAUDE.md  pnpm-workspace.yaml  turbo.json  biome.json  tsconfig.base.json
```

**Abhängigkeitsregeln (CI-geprüft, z. B. dependency-cruiser):**
- `sim-core` importiert **nichts** aus anderen Paketen außer Typen aus `data`.
- `ui`, `charts` kennen `sim-core` nicht – nur View-Model-Typen aus `sim-core/projection`.
- `apps/web` darf alles; `apps/mobile` enthält nur Hülle und native Adapter.

**Migration des alten Codes (P0):** `git tag prototyp-v0` → `git mv index.html root legacy/prototyp-v0/` →
README im Legacy-Ordner („nur Referenz, siehe docs/research/01-audit-prototyp.md“). `.idea/` in `.gitignore`.

---

## 3. Simulationskern (`packages/sim-core`) – technische Regeln

Fachliche Spezifikation: `02-simulationsmodell.md`. Hier nur die technischen Leitplanken.

### 3.1 Geld, Zahlen, Rundung
- `type Cents = number & { __brand: 'Cents' }`, Konstruktoren `cents()`, `eur()`, Assertion `Number.isSafeInteger`.
- Zinssätze in **Basispunkten** (Integer). Prozent nur im UI formatieren.
- Zwischenrechnungen dürfen Float sein; **gerundet wird nur an Buchungsstellen** mit benannten Regeln
  (`roundHalfAwayFromZero`, `floorToEuro` für das zu versteuernde Einkommen …).
- Annuitätendarlehen ohne `pow`: Rate = Darlehen × (Sollzins + anfängliche Tilgung) / 12, Restschuld monatlich iterativ.

### 3.2 Determinismus
- Im Kern nur `+ − × ÷`, `Math.sqrt/floor/round/imul`. Eigenes `detmath` (`powInt`, `expDet`, `lnDet`) mit fester Termzahl,
  gegen decimal.js als Orakel getestet.
- **PRNG zählerbasiert:** `rand(seed, domain, monthIndex, entityId, k)` per SplitMix-Hash → neue Ereignistypen verschieben
  keine anderen Zufallsfolgen. Domänen: `macro`, `region`, `offers`, `tenants`, `building`, `events`, `negotiation` …
- **Lint-Verbote** in `sim-core`: `Math.random`, `Math.pow`, `**`, `Math.exp`, `Math.log`, `Date`, `crypto`, I/O.
- **Golden-Hash-Test:** Seed X, Szenario Y, 480 Monate → SHA-256 des Zustands identisch in Node, Chromium, WebKit, Firefox.

### 3.3 Zustand, Befehle, Zeit
- **Kern-API:** `newGame`, `apply(state, cmd)`, `advance(state, months)`, `preview(state, plan)`, `explain(state, metricRef)`, `hash(state)`.
- **Befehle** sind validierte, serialisierbare Objekte (Kauf, Gebot, Mieterhöhung, Kredit, Sondertilgung …). Jede Ablehnung
  liefert einen **Grund-Code + Parameter** (für Erklär-Karte und Übersetzung).
- **Zeit:** `MonthIndex` (Integer, absolut ab 2000-01), Helfer für Quartal/Steuerjahr. Keine `Date`-Objekte im Kern.
- **Monats-Pipeline** mit fester Phasenreihenfolge (Inhalt in `02-…` §1).
- **Domain-Events** (Codes + Parameter, keine Texte) speisen Monatsbericht, Chronik und Posteingang.
- **Projektionen** (View-Models) für die UI; jede Kennzahl kann einen **Rechenweg** liefern (`explain`): Formel-ID,
  Eingabewerte, Zwischenergebnisse, Parameter-IDs mit Status und Quelle. Das ist die technische Grundlage der Erklär-Karte.

### 3.4 Parameter-Registry und Regelstände
- Alle Fach- und Balance-Parameter in einer Registry: `id, wert, einheit, status (BELEGT|ABGELEITET|GESCHÄTZT|DESIGN),
  quelle_id, stand, gueltig_ab, gueltig_bis, regional_schluessel?`.
- **`rulesVersion`** pro Steuer-/Rechtsjahr (z. B. `de-2026.2`). Historische Szenarien laden den passenden Regelstand.
- Keine Fachzahl als Literal im Code (Lint-Regel/Review-Check) – Ausnahmen nur mathematische Konstanten.

### 3.5 Ausführung
- Kern läuft im **Web Worker** (`sim-worker`), UI spricht über `SimClient` (Comlink, typisiert).
- `advance(…, 12)` für ein Jahr mit 50 Objekten: Ziel < 50 ms auf Mittelklasse-Handy (Budget in CI messen).
- Was-wäre-wenn (`preview`) rechnet auf einer Kopie, ohne Commit; Kalkulator nutzt dieselben Funktionen wie die Simulation.

---

## 4. Spielstände und Speicherung

- **Format:** Snapshot (maßgeblich) + Befehls-Log des laufenden Monats + jährliche Keyframes. Felder `schemaVersion`,
  `rulesVersion`, `dataVersion` (Version des Datenpakets), `seed`.
- **Undo:** nur innerhalb des laufenden Monats (Monatsanfangs-Snapshot + Befehle neu anwenden).
  **Lernmodus:** Checkpoints vor großen Entscheidungen (Keyframes). **Ironman:** kein Zurück.
- **Migrationen:** reine Funktionen `vN → vN+1`, je Version eine Fixture-Datei, Idempotenz- und Round-Trip-Tests.
- **Speicherorte:** Dexie (Autosave-Rotation: 3 Stände), `navigator.storage.persist()`; nativ zusätzlich Dateikopie.
- **Export/Import:** `.immosave` (gzip-JSON), beim Laden mit Zod validiert; Export-Erinnerung (Safari-Löschregeln).
- **Datenpakete im Spielstand:** Beim Spielstart werden die spielrelevanten Regionsparameter **in den Spielstand kopiert**
  (Empfehlung aus der Recherche), damit ein Daten-Update laufende Spiele nicht verändert.
- **Privatsphäre:** Alles lokal. „Mein echtes Profil“ verlässt das Gerät nie. Keine Telemetrie im MVP.

---

## 5. Daten-Pipeline (technisch)

```
IC-Repo: tools/export-spiel.mjs ──► spiel-export/<version>/ (JSON + manifest + quellen)
                                     │  (git: als Release-Artefakt oder Kopie nach Immo/packages/data/vendor/)
Immo:   packages/data/build.ts ──► Zod-Validierung ──► Ableitung fehlender Werte (markiert GESCHÄTZT)
                                     ──► apps/web/public/data/<dataVersion>/*.json(.gz)   (precached)
        tools/import/*  (Bundesbank SDMX, Destatis GENESIS, GREIX) ──► packages/data/zeitreihen/*.json
        packages/geo   (VG250 Shape/GeoPackage → mapshaper simplify → TopoJSON Länder/Kreise)
```

- Kopplung **über versionierte Snapshots**, nicht über Submodule: Das Spiel bleibt baubar, auch wenn der Vault sich ändert.
- Größenbudget: Regionenpaket (Kreise + Gemeinde-Kerndaten) < 1 MB gzip; Kreis-TopoJSON < 300 KB gzip.
- Lizenzvermerke wandern automatisch in den In-App-Screen „Datenquellen & Lizenzen“.
- Fachliche Seite (Datenvertrag, Lücken, Quellen): `05-daten-und-wissen.md`.

---

## 6. Qualitätssicherung

| Ebene | Werkzeug | Inhalt | Ab Phase |
|---|---|---|---|
| Formeln (Golden) | Vitest | Testvektoren T1–T13 aus `../research/10-…` §1.9, Kaufnebenkosten je Land, AfA-Fälle, ESt 2026 | P1 |
| Invarianten | fast-check | Σ Tilgung = Darlehen; Restschuld monoton; Steuer monoton im Einkommen; Cent-Rundungsfehler beschränkt; Save-Round-Trip | P1 |
| Determinismus | Vitest Node + Browser-Modus (Chromium/WebKit/Firefox) | Golden-Hash über 480 Monate | P1 |
| Balancing/Kalibrierung | `tools/balance` (Monte Carlo) | Bänder aus Fallstudien und Marktdaten; Anti-Exploit-Eigenschaften | P3 → P8 |
| Komponenten | Vitest-Browser + Testing Library (optional Storybook 10) | Tastatur, Zustände, Formatierung | P3 |
| Visuelle Regression | Playwright `toHaveScreenshot` im Container | Kernscreens hell/dunkel, Desktop/Tablet/Mobil | P3 |
| E2E | Playwright | Neues Spiel → Kauf → 12 Monate → Export → Import → gleicher Hash; Offline | P3 |
| Barrierefreiheit | `@axe-core/playwright` + Tastatur-E2E | 0 kritische Verstöße auf allen Screens | P3 |
| Architektur | dependency-cruiser / Biome-Importregeln | Paketgrenzen | P0 |
| Bundle | size-limit | Budgets aus §8 | P3 |

**Definition of Done (technisch) je Feature:** Typen + Tests (Golden/Property) grün · Parameter in Registry mit Status ·
`explain` für neue Kennzahlen · keine neuen A11y-Verstöße · visuelle Snapshots aktualisiert und geprüft · ADR bei Architekturänderung.

---

## 7. CI/CD (GitHub Actions)

```
verify   pnpm install (Cache) → turbo lint typecheck test --affected → dependency-cruiser
browser  Vitest-Browser-Modus (Chromium/WebKit/Firefox) → Determinismus-Hash
e2e      Playwright im Container: E2E, visuelle Snapshots, axe, Offline-Test
balance  (nightly) Monte-Carlo-Kalibrierung → Bericht als Artefakt, Warnung bei Band-Verletzung
build    vite build → size-limit → Preview-Deploy pro PR (Cloudflare)
deploy   main → Produktion (PWA)
mobile   (P9) Release-Tags: Android (Linux-Runner), iOS (macOS-Runner)
```

Renovate mit pnpm-Catalogs; ein ADR pro Major-Upgrade.

---

## 8. Performance- und Größenbudgets (Startwerte)

| Budget | Ziel |
|---|---|
| Initiales JS (gzip) | ≤ 250 KB bis App-Shell, Charts/Karte lazy |
| Time to Interactive (Mittelklasse-Handy, 4G) | ≤ 3 s, danach offline |
| `advance` 1 Monat, 50 Objekte | ≤ 5 ms (Worker) |
| `advance` 40 Jahre (Hash-Test) | ≤ 2 s in Node |
| Tabellen | 12.588 Zeilen flüssig (virtualisiert) |
| Speicherstand | ≤ 2 MB nach 40 Spieljahren (gzip) |

---

## 9. PWA und Mobile-Pfad

- **PWA (P3/P8):** Precache von App-Shell und Datenpaketen; „Update verfügbar“-Dialog nie mitten im Monat;
  Installationshinweis; Offline-Test in CI.
- **Capacitor (P9):** gleiche Web-App; native Speicherung, Status-Bar, Haptik dezent, Teilen/Export über native Dialoge.
  - **iOS:** Mac mit Xcode 26 nötig (dein Rechner oder macOS-CI-Runner), Apple Developer Program 99 USD/Jahr.
    Risiko Richtlinie 4.2 (Web-Wrapper) → echte Offline-App mit nativen Integrationen; Richtlinie 3.2.1(viii): keine echten
    Finanzdienstleistungen → klarer Simulations-Disclaimer.
  - **Android:** API-Level 36; private Google-Konten brauchen vor der Veröffentlichung 12 Tester über 14 Tage.
  - **EU/DSA:** Wer als Händler gilt, muss Adresse und Telefonnummer öffentlich zeigen → Konto-Frage früh klären (`08-…`).
- **Plugin-Unterstützung:** „Mobile Release Check“ vor Store-Einreichung.

---

## 10. KI-Mentor (optional, nachgelagert)

- **Stufe 1 (P6):** vorgenerierte, fachlich geprüfte Erklär- und Mentor-Texte im Paket `content` (offline, versioniert, mit Vault-Links).
- **Stufe 2 (nach P8, optional):** Live-Fragen über eigenen Proxy (Cloudflare Worker, Claude API, Ratenlimit, Cache).
  Der Mentor bekommt nur Projektionen, **nie Schreibzugriff** auf den Spielzustand. Kosten laut Recherche grob
  17 USD/Monat je 1.000 Nutzer mit dem kleinsten Modell, deutlich mehr mit größeren. Entscheidung offen (`08-…`).

---

## 11. Architekturentscheidungen (ADRs, in P0 anzulegen)

| ADR | Thema |
|---|---|
| 0001 | Plattform: React + Vite + PWA + Capacitor |
| 0002 | Monorepo: pnpm + Turborepo, Paketgrenzen |
| 0003 | Geld als Integer-Cent, Basispunkte, Rundungsstellen |
| 0004 | Determinismus: detmath, zählerbasierter PRNG, Lint-Verbote, Hash-Test |
| 0005 | Spielstand: Snapshot + Log + Keyframes, Versionen, Migrationen, Undo-Regeln |
| 0006 | UI-Kit: shadcn/ui + Base UI + Tailwind 4 |
| 0007 | Charts: ECharts 6 mit Tabellen-Fallback |
| 0008 | Daten: IC-Export-Snapshot, Datenvertrag, Status-Flags |
| 0009 | Parameter-Registry und rulesVersion |
| 0010 | Hosting: Cloudflare; Datenschutz: lokal, keine Telemetrie |
