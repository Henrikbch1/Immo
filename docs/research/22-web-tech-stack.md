# 22 – Tech-Stack für den Neuaufbau (Web-first, später iOS/Android)

**Stand:** 26.11.2026 · **Status:** Empfehlung zur Entscheidung · **Gilt für:** Neuaufbau des Immobilien-Investment-Simulationsspiels (Deutschland); der alte Prototyp (`/home/user/Immo/root`, Vanilla JS, ca. 3.900 Zeilen) wird verworfen.

> **Quellen-Kennzeichnung:** [P] = Primärquelle (Hersteller-Blog, offizielle Doku, Release-Notes). [S] = Sekundärquelle (Fachpresse, Aggregatoren, Blogs). Versionsangaben mit [S] vor dem Festschreiben per `npm view <paket> version` prüfen. Grenzen der Recherche stehen in Abschnitt 14.

---

## 0. Kurzfassung

**Empfehlung:** **React 19 + Vite 8 + TypeScript als Offline-PWA**, verpackt mit **Capacitor 8** (später 9) für iOS/Android. Dazu ein **framework-unabhängiger, deterministischer Simulations-Kern in reinem TypeScript** in einem **pnpm-Monorepo mit Turborepo**, der im **Web Worker** läuft.

Die zehn Kernpunkte:

1. **Plattform (a) React + Vite + PWA + Capacitor.** Datendichte Tabellen und Charts sind im DOM/Canvas des Browsers am stärksten. React hat das größte Ökosystem und den meisten Trainingsstoff für KI-Agenten. Capacitor macht aus derselben Codebasis Store-Apps. Alternativen und Gründe dagegen: Abschnitt 2.
2. **`packages/sim-core`:** reine Funktionen, keine DOM-Typen, läuft identisch in Node (Tests, Balancing-CLI), im Web Worker und in der Capacitor-WebView.
3. **Geld als ganze Cent in einer `number` mit Marken-Typ (`Cents`).** Zinssätze in Basispunkten, Rundung nur an definierten Buchungsstellen. Keine Dezimal-Bibliothek im Hot-Path.
4. **Determinismus ausdrücklich absichern.** Eigener seedbarer PRNG (zählerbasiert, getrennte Ströme je Domäne). Eine `detmath`-Schicht ohne `Math.pow`/`exp`/`log`, weil deren Ergebnisse je JS-Engine abweichen dürfen. Engine-übergreifende CI-Tests (V8, JavaScriptCore, SpiderMonkey).
5. **Spielstand = Snapshot + Befehls-Log (+ Keyframes).** Der Snapshot ist maßgeblich, das Log dient Replay, Debugging und Undo innerhalb eines Monats. Jede Datei trägt `schemaVersion` und `rulesVersion`; Migrationen sind reine Funktionen mit Fixture-Tests.
6. **Persistenz:** Dexie 4.4 (IndexedDB) im Web; auf iOS/Android zusätzlich echte Dateien über `@capacitor/filesystem`. Export/Import als gzip-JSON (`.immosave`), beim Laden mit Zod 4 validiert.
7. **UI:** shadcn/ui (Base UI ist seit 07/2026 Standard) + Tailwind CSS 4.3, TanStack Table v9 + TanStack Virtual, Apache ECharts 6 als Chart-Engine (Wasserfall, Zeitreihen, Sankey, Choropleth, ARIA), Motion 12, TanStack Form v1, TanStack Router v1, Paraglide JS 2 (Deutsch zuerst), Lucide-Icons.
8. **Karte stufenweise.** Stufe 1: Länder/Kreise als vereinfachtes VG250-GeoJSON/TopoJSON direkt in ECharts, ohne WebGL. Stufe 2, optional: MapLibre GL JS 6 + PMTiles für die Gemeinde-Ebene, lazy geladen.
9. **Qualität:** TypeScript strict (TS 6 für Werkzeuge, TS 7 „native“ für schnelles Typprüfen), Vitest 4 (inkl. Browser-Modus), fast-check 4, Playwright 1.65, Biome 2, GitHub Actions. Hosting über Cloudflare (Workers Static Assets) als PWA.
10. **KI-Mentor optional und nachgelagert.** Zuerst vorgenerierte, geprüfte Erklärtexte (offline, Batch-API). Live-Mentor erst später über einen eigenen Proxy (Cloudflare Worker), nie mit Schreibzugriff auf den Spielzustand.

### 0.1 Versions-Snapshot (Ende November 2026)

| Baustein | Empfohlene Version | Stand / Datum | Q |
|---|---|---|---|
| Node.js | 24 LTS (Capacitor 8 braucht Node ≥ 22) | – | [S] |
| Paketmanager | **pnpm 11.x** (mit Catalogs); pnpm 12 (Rust-Neuschreibung) ist seit 26.08.2026 stabil, `latest` zeigte Anfang Sept. noch auf 11 | 12.0: 08/2026 | [P]/[S] |
| Monorepo-Tasks | Turborepo 2.x (Linie 2.10/2.11) | 2026 | [S] |
| TypeScript | **6.x als `typescript`** (Compiler-API für Tools) + **7.0 als Alias** für `tsc --noEmit` | 7.0: 08.07.2026 | [P] |
| Build | **Vite 8.x** (Rolldown) | 8.0: 12.03.2026; 8.1: 23.06.2026 | [P] |
| UI-Framework | **React 19.2.x** + React Compiler 1.0 | 19.2: 01.10.2025; Compiler 1.0: 07.10.2025 | [P] |
| Router | TanStack Router v1 (SPA, dateibasiert, typsichere Search-Params) | – | [S] |
| Native Hülle | **Capacitor 8.x** (8.5: 31.07.2026); Capacitor 9 in Beta (laut Drittquelle 28.10.2026) | 8.0: 08.12.2025 | [P]/[S] |
| Styling | **Tailwind CSS 4.3.x** | 4.3.0: 08.05.2026 | [P] |
| Komponenten | **shadcn/ui** (CLI v4, Base UI seit 07/2026 Standard, Radix weiter unterstützt) | 07/2026 | [P] |
| Headless-Primitives | **Base UI 1.x** (`@base-ui/react`) | 1.0: 11.12.2025; 1.6: 06/2026 | [P] |
| Tabellen | **TanStack Table v9** + TanStack Virtual | v9 stabil: 04.08.2026 | [P] |
| Charts | **Apache ECharts 6.x** (6.1 verfügbar) | 6.0: 08/2025 | [P]/[S] |
| Formulare | **TanStack Form v1** (Alternative: React Hook Form 7; v8 erst Beta) | v1: 03.03.2025 | [P] |
| Validierung | **Zod 4.x** (Alternative: Valibot 1.x) | 4.x | [P]/[S] |
| Client-State | **Zustand 5.x** | – | [S] |
| Speicher | **Dexie 4.4.x** | 4.4: 27.03.2026 | [P] |
| Worker-RPC | Comlink 4.4.x (hinter eigener Schnittstelle) | – | [S] |
| Animation | Motion 12.x (`motion/react`) | – | [S] |
| Karte (Stufe 2) | MapLibre GL JS 6.x (ESM-only, WebGL2) + PMTiles | 6.0: 22.07.2026 | [S] |
| i18n | Paraglide JS 2.x (Alternative: Lingui 5) | – | [S] |
| Unit/Browser-Tests | **Vitest 4.x** (Browser-Modus stabil, `toMatchScreenshot`) | 4.0: 22.10.2025 | [P] |
| Property-Tests | **fast-check 4.x** (4.9: 07/2026) + `@fast-check/vitest` | – | [P] |
| E2E | **Playwright 1.65** | 05.11.2026 | [S] |
| Komponenten-Katalog | Storybook 10.x (optional; 10.5: 07/2026) | – | [P] |
| Lint/Format | **Biome 2.x**; ESLint 10 nur für React-Hooks/Compiler-Regeln | ESLint 10: 02/2026 | [P]/[S] |
| PWA | vite-plugin-pwa 1.3.x (Vite-8-Support, Linie im Wartungsmodus) oder Serwist | – | [S] |

---

## 1. Ausgangslage und Bewertungsmaßstab

- **Produkt:** realistische Immobilien-Investment-Simulation für Deutschland. Monatsschritte über Jahrzehnte (z. B. 40 Jahre = 480 Schritte), Finanzierung, Steuern, Mieten, Markt, Ereignisse. Reproduzierbar per Seed.
- **Daten:** Obsidian-Vault mit Node-Tools (`/home/user/IC/tools/*.mjs`). `vault/40-Daten/gebiete.csv` hat 12.588 Gebiete (Land/RegBez/Kreis/Verband/Gemeinde mit ARS/AGS); gemessen sind das **1,30 MB roh und 173 KB gzip**. Dazu kommen 7 Fallstudien in `vault/80-Fallstudien` (geeignet als Golden-Master-Tests).
- **Entwicklung überwiegend durch KI-Agenten.** Deshalb zählen verbreitete, gut dokumentierte, typsichere Bibliotheken mit stabilen APIs, eine klare Paketgrenze und schnelle, deterministische Tests besonders. Neue Major-Versionen (TanStack Table v9, Zod 4, Tailwind 4, TS 7) kennen KI-Modelle oft schlechter als die Vorgänger. Gegenmaßnahme: Versions-Pins und Beispielcode im Repo (`CLAUDE.md`, `docs/adr`, `llms.txt` der Bibliotheken).
- **Bewertung:** 1 (schwach) bis 5 (stark), bezogen auf *dieses* Projekt.

---

## 2. App-Plattform

### 2.1 Stand der Kandidaten (11/2026)

| Option | Aktueller Stand | Q |
|---|---|---|
| (a) React + Vite + TS, PWA + Capacitor | React 19.2.x; Vite 8 mit Rolldown (03/2026); Capacitor 8 (12/2025, SPM als iOS-Standard, Xcode 26+, iOS ≥ 15), 8.5 (07/2026), Capacitor 9 in Beta | [P]/[S] |
| (b) Expo / React Native + Web | Expo SDK 56 (21.05.2026, RN 0.85, Expo UI stabil), SDK 57 (30.06.2026, RN 0.86), **SDK 58 (15.10.2026, RN 0.88, iOS 27)**; DOM-Components (`"use dom"`) betten Web-React per WebView ein | [P]/[S] |
| (c) Flutter | **Flutter 3.50 (11.11.2026)**; Web nur mit CanvasKit/Skwasm (HTML-Renderer entfernt); Web-Barrierefreiheit standardmäßig aus | [P] |
| (d) SvelteKit / Svelte 5 + Capacitor | Svelte 5.57; **SvelteKit 3 + `sv` 1.0 im Oktober 2026 erschienen**; LayerChart 2 (Svelte 5) noch auf `@next` | [P]/[S] |
| (e) Tauri 2 (Desktop + Mobile) | Tauri 2.11.x (2.11.0: 30.04.2026; 2.11.5: 01.07.2026). Mobile ist laut Team „production ready“, aber nicht „first class“; nicht alle Plugins sind portiert | [P] |

### 2.2 Vergleichstabelle

| Kriterium | (a) React+Capacitor | (b) Expo/RN+Web | (c) Flutter | (d) Svelte+Capacitor | (e) Tauri 2 |
|---|---|---|---|---|---|
| Datendichte UI im **Web** | **5** (DOM-Tabellen, Canvas-Charts, CSS-Grid) | 3 (RN-Web-Primitives; dichte Tabellen und Charts schwächer) | 2 (Canvas, A11y/SEO eingeschränkt, große Erstlast) | 4 | 5 (Frontend frei wählbar; Web separat) |
| Datendichte UI **mobil** | 4 (WebView, gut bei Virtualisierung) | **5** (native Views) | **5** | 4 | 3 |
| Komponenten- und Chart-Ökosystem | **5** | 3 (Victory Native/Skia, wenige Grids) | 3 (fl_chart; Syncfusion kommerziell) | 3 | 5/3 (Frontend/Plugins) |
| Performance | 4 | 4–5 | 4 (mobil 5, Web 3) | 5 | 4 |
| Offline | **5** (Service Worker + lokale DB) | 4 | 4 | 5 | 5 |
| Store-Veröffentlichung | 3 (Risiko Apple 4.2 „Web-Wrapper“, beherrschbar) | **5** (EAS Build/Submit, iOS-Builds ohne eigenen Mac) | 5 | 3 | 3 |
| Aufwand Solo + KI | **5** | 3 | 3 (Dart statt TS) | 4 (weniger Trainingsstoff zu Runes, SvelteKit-3-Umbruch) | 2–3 (Rust-Toolchain) |
| Testbarkeit | **5** (Vitest, Playwright, Storybook) | 3 (Jest/Maestro/Detox + Web) | 4 (Widget-/Golden-Tests) | 4 | 3 |
| Langzeitstabilität | 4 | 4 (drei SDKs pro Jahr) | 4 | 3–4 | 3–4 |
| Wiederverwendung mit Node-Tools/Vault (TS) | **5** | 4 (Hermes-Engine: Determinismus extra prüfen) | **1** (Kern müsste in Dart neu geschrieben werden) | 5 | 4 |
| **Summe (max. 50)** | **45** | 38 | 35 | 40 | 37 |

### 2.3 Begründung

- **(a) gewinnt, weil der Schwerpunkt Web-first und datendicht ist.** Tabellen mit Sortierung, Filtern, Sticky-Spalten, Tastaturbedienung und Copy/Paste sowie interaktive Charts mit Tooltips sind im Browser ausgereift. Capacitor nutzt denselben Build (`dist/`), deshalb sind mobil kein Neuschreiben und kein zweites UI nötig. Eine spätere Desktop-Hülle mit Tauri oder Electron bleibt möglich, weil das Frontend reines Web ist.
- **(b) Expo** ist die richtige Wahl, falls sich *mobil-native Haptik* (native Listen, Gesten, Widgets) als wichtiger erweist als Web-Dichte. Für dichte Web-Dashboards müsste man auf DOM-Components ausweichen (WebView im nativen App-Fenster). Damit landet man wieder bei Web-Technik, nur mit mehr Schichten. Vorteil: iOS-Builds über EAS ohne eigenen Mac.
- **(c) Flutter** scheidet aus. Das Web rendert in Canvas mit standardmäßig deaktivierter Barrierefreiheit, und Dart trennt den Simulationskern von der TS/Node-Wissensbasis.
- **(d) Svelte** ist technisch attraktiv (schnell, wenig Boilerplate). Aktuell ist das Ökosystem aber im Umbruch (SvelteKit 3 gerade erschienen, LayerChart 2 noch `@next`), und KI-Agenten erzeugen dafür weniger verlässlichen Code als für React.
- **(e) Tauri** lohnt sich nur als *zusätzliche* Desktop-Hülle. Für Mobile ist es jünger als Capacitor und bringt eine Rust-Toolchain mit.
- **Ausstiegsoption:** Weil `sim-core`, `data` und `storage` UI-frei sind, ließe sich das UI später auf Expo/RN portieren, ohne die Simulation neu zu schreiben.

---

## 3. Simulations-Kern (`packages/sim-core`)

### 3.1 Paketgrenzen und Ausführung

- **Reines TypeScript, ESM, `"sideEffects": false`.** In `tsconfig` gilt `"lib": ["ES2023"]` ohne `"DOM"` und `"types": []`. Damit bricht der Build, sobald jemand `window`, `document` oder `Date.now()` verwendet. Erlaubte Laufzeit-Abhängigkeiten: nur Zod (Grenzen) und ggf. ein PRNG.
- **Funktionaler Kern:** `step(state, ctx) → { state, events }`. Innerhalb eines Schritts darf auf einer lokalen Kopie mutiert werden (Performance); nach außen ist der Zustand unveränderlich. Kein I/O, keine Uhrzeit, kein globaler Zufall.
- **Ausführung:** im **Dedicated Web Worker** (`packages/sim-worker`), damit 480 Monate × Portfolio × Markt das UI nicht blockieren. RPC über **Comlink 4.4**: ca. 1 KB und stabil, aber wenig Aktivität. Deshalb hinter einer eigenen Schnittstelle `SimClient` kapseln, um es bei Bedarf durch ein handgeschriebenes `postMessage`-Protokoll ersetzen zu können.
- **Datenfluss zum UI:** Der Worker sendet **Projektionen/View-Models**, nicht den Gesamtzustand. Beispiele: KPIs, Tabellenzeilen, Zeitreihen. Große Arrays gehen als `Float64Array`/`Int32Array` (übertragbar).
- **Live-Rechnung in Formularen** (z. B. „Kaufpreis ändern → Rendite, Cashflow, Annuität sofort sehen“) ruft reine Finanzfunktionen aus `sim-core` **synchron im Main-Thread** auf, weil das im Mikrosekundenbereich liegt. **Mehrjahres-Vorschauen** („30 Jahre Cashflow“) laufen entprellt (ca. 150 ms) im Worker.
- **Balancing:** Derselbe Kern läuft in Node für Monte-Carlo-Läufe (`tools/balance.ts`), z. B. 10.000 Seeds → Verteilung der Endvermögen.

### 3.2 Geldbeträge

| Variante | Genauigkeit | Performance | Serialisierung | Ergonomie/KI | Urteil |
|---|---|---|---|---|---|
| `number` in Euro (Float) | Rundungsfehler summieren sich | ++ | ++ | ++ | ungeeignet |
| **`number` in ganzen Cent** (Marken-Typ `Cents`) | exakt bis ±9·10¹⁵ Cent (≈ 90 Billionen €) | ++ | ++ (JSON-Zahl) | + | **Empfehlung** |
| `bigint` in Cent | exakt, unbegrenzt | – (langsamer, Mischtyp-Fehler) | – (kein JSON-Typ) | – | unnötig |
| big.js | exakte Dezimalarithmetik, kein `exp`/`ln` | – | String | o | nur Spezialfälle |
| decimal.js | beliebige Präzision inkl. `exp`/`ln`/`pow` | – – | String | o | nur als Referenz/Test-Orakel |
| Dinero.js v2 (stabil seit 03/2026, Minor-Units) | exakt | o | Objekt | o | Overhead; Formatierung macht `Intl` |

**Regeln (Vorschlag für ein ADR):**

- `type Cents = number & { readonly __brand: 'Cents' }`. Konstruktoren `cents(…)`, `eur(…)`; Assertion `Number.isSafeInteger`.
- Zinssätze als **Basispunkte (Integer)**, Prozentwerte im UI über `Intl.NumberFormat('de-DE')`.
- Zwischenrechnungen dürfen Float sein. **Gerundet wird nur an Buchungsstellen**: Monatszins, Tilgung, Miete, Steuer. Rundungsarten sind zentral benannt, z. B. `roundHalfAwayFromZero` (kaufmännisch) und `floorToEuro` (Abrundung des zu versteuernden Einkommens auf volle Euro im Steuertarif). Welche Rundung wo gilt, legt der Fach-Plan fest, nicht der Stack.
- Deutsche Annuitätendarlehen lassen sich ohne `pow` rechnen: Rate = Darlehen × (Sollzins + anfängliche Tilgung) / 12. Restschuld und Laufzeit ergeben sich iterativ Monat für Monat. Effektivzins nur per Iteration mit ganzzahligen Potenzen (`powInt` durch Multiplikation).
- Formatierung ausschließlich im UI: `Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })`.

### 3.3 Determinismus (wichtigster technischer Punkt)

- **Problem:** Nach ECMAScript-Spezifikation sind `Math.pow`, `Math.exp`, `Math.log`, `Math.sin` usw. *implementation-approximated*. V8 (Chrome/Android-WebView/Node), JavaScriptCore (Safari/iOS-WKWebView) und SpiderMonkey dürfen im letzten Bit abweichen. Abweichungen sind dokumentiert, z. B. Mozilla-Bug 1775254 und V8-`**`-Inkonsistenz. Bei Monatsschritten über Jahrzehnte schaukeln sich solche Differenzen auf, und ein Seed liefert auf iPhone und PC unterschiedliche Spielverläufe.
- **Lösung:**
  1. Im Kern nur IEEE-754-Grundoperationen (`+ − × ÷`, `Math.sqrt`, `Math.floor/round`, `Math.imul`) und Literale verwenden.
  2. Modul `detmath.ts` mit `powInt`, `expDet`, `lnDet`. Bereichsreduktion plus Polynom/Taylor mit fester Termzahl, nur Grundoperationen, deshalb engine-unabhängig. Gegen `Math.*` und decimal.js auf Genauigkeit testen.
  3. Lint-Regel (Biome `noRestrictedGlobals`/eigene Regel) gegen `Math.random`, `Math.pow`, `Math.exp`, `Math.log`, `**` und `Date` in `sim-core`.
- **PRNG:** kleiner, seedbarer 32-Bit-Generator (z. B. sfc32/xoshiro128** mit `Math.imul`) oder `pure-rand` 8.x (xoroshiro128+, `getState`/`fromState`, `jump`). **Empfehlung: zählerbasiert ableiten** über `rand(seed, domain, monthIndex, entityId, k)` per Hash (SplitMix-artig). Vorteile: Neue Ereignistypen verschieben die Zufallsfolgen anderer Systeme nicht, die Verarbeitungsreihenfolge ist egal, und jeder Monat ist ohne Replay reproduzierbar. Verteilungen (Normal/Lognormal) über `detmath`, z. B. Normal-Näherung per Inverser-CDF-Approximation oder Irwin-Hall; das reicht für ein Spiel.
- **Absicherung:** CI-Test „Seed X, Szenario Y, 480 Monate → SHA-256 des Zustands = Golden-Hash“, ausgeführt in **Node (V8)** und im **Vitest-Browser-Modus mit Playwright-Providern Chromium, WebKit und Firefox**.

### 3.4 Zeit- und Kalendermodell

- `MonthIndex` als Integer (0 = Januar des Startjahres oder absolut ab 2000-01). Helfer für Jahr/Monat/Quartal/Steuerjahr. **Keine `Date`-Objekte im Kern.**
- Feste **Phasenreihenfolge pro Monat** (z. B. Markt → Mieten → Kosten → Zins/Tilgung → Ereignisse → Jahresabschluss im Dezember). Spieleraktionen sind Befehle *zwischen* Monaten. Der Inhalt der Phasen gehört in den Fach-Plan.
- **Temporal API:** Chrome 144 (01/2026) und Firefox liefern sie aus, Safari/iOS noch nicht (Status „Limited availability“). Im Kern unnötig; im UI reichen `Intl.DateTimeFormat` und ggf. ein Polyfill.

### 3.5 Schema-Validierung

| | **Zod 4** | Valibot 1.x |
|---|---|---|
| Bundle (einfaches Schema) | Zod Mini ≈ 1,9 KB gzip; Standard deutlich größer [P] | kleiner als Zod Mini [S] |
| Ökosystem / KI-Vertrautheit | sehr hoch | mittel |
| JSON-Schema-Export | ja (`z.toJSONSchema`) | über Zusatzpaket |
| Standard Schema (für TanStack Form/Router) | ja | ja |

**Empfehlung: Zod 4**, eingesetzt **nur an Grenzen**: Spielstand-Import, statische Datenpakete (bereits zur Build-Zeit), Worker-Nachrichten im Dev-Modus, Formulare. Nicht im Simulations-Hot-Path. Valibot nur, falls das Bundle-Budget es erzwingt.

### 3.6 Event-Sourcing vs. Snapshot vs. Undo

| Ansatz | Vorteile | Nachteile |
|---|---|---|
| Nur Snapshot | einfach, schnelles Laden | keine Nachvollziehbarkeit, Bug-Reports schwer reproduzierbar |
| Nur Event-Sourcing (Seed + Befehle) | winzige Saves, perfektes Replay | Ladezeit wächst; **jede Regeländerung bricht alte Replays** |
| **Hybrid (Empfehlung)** | Snapshot maßgeblich, Befehls-Log für Replay/Debug/Undo, Keyframes (z. B. jährlich) für Zeitreise | etwas mehr Speicher |

- **Undo innerhalb eines Monats** (vor „Monat abschließen“): Monatsanfangs-Snapshot plus Befehlsliste. Undo heißt, den Snapshot wiederherzustellen und die Befehle 0…n-1 erneut anzuwenden. Billig und robust, kein Immer-Patch-System nötig.
- **Zurückspulen über Monate** (Keyframes) ist eine **Spieldesign-Entscheidung** (z. B. nur im Lernmodus, im „Ironman“-Modus gesperrt).
- Replay wird nur innerhalb derselben `rulesVersion` garantiert. Bei neuer Regelversion bleibt der Snapshot die Wahrheit, und das Log ist nur noch Historie.
- Der **Ereignis-Log fürs UI** (Kontoauszug, Chronik) speichert Codes und Parameter, keine Texte (Übersetzung im UI).

### 3.7 Skizze der Kern-API

```ts
// packages/sim-core/src/index.ts (Skizze)
export interface SimApi {
  newGame(input: NewGameInput): GameState;               // Szenario + Seed
  apply(state: GameState, cmd: Command): ApplyResult;    // validiert, reine Funktion
  advance(state: GameState, months: number): AdvanceResult; // Zustand + Domain-Events
  preview(state: GameState, plan: WhatIfPlan): Projection; // Was-wäre-wenn, ohne Commit
  hash(state: GameState): string;                         // Determinismus-Check
}
export type Command =
  | { type: 'buyProperty'; listingId: string; financing: FinancingInput }
  | { type: 'setRent'; propertyId: string; rentCents: Cents }
  | { type: 'refinance'; loanId: string; offerId: string };
```

---

## 4. State-Management und Daten

### 4.1 UI-State

| Bibliothek | Rolle hier | Urteil |
|---|---|---|
| **Zustand 5** | UI-Zustand (Filter, Auswahl, Panels) und Abo auf Projektionen aus dem Worker | **Empfehlung** (klein, wenig Boilerplate, KI-freundlich) |
| Redux Toolkit 2 | – | zu viel Struktur für den Nutzen; die Domänenlogik lebt ohnehin in `sim-core` |
| XState 5 | optional für klar abgegrenzte Abläufe (Tutorial, Kauf-Wizard) | nicht als globaler Store |
| TanStack Query 5 | nur für echte Async-Quellen (KI-Proxy, ggf. Daten-Downloads) | nicht für Spielzustand |

Die URL ist Zustand: Tabellenfilter und Sortierung stehen über **TanStack Router** typsicher in den Search-Params. Das ergibt teilbare Links, und der Zurück-Button funktioniert.

### 4.2 Lokale Speicherung

| Option | Pro | Contra | Einsatz |
|---|---|---|---|
| **Dexie 4.4** (IndexedDB) | überall verfügbar, typisiert, `liveQuery`, Migrationen | Safari löscht skriptbaren Speicher nicht installierter Websites nach 7 Tagen ohne Interaktion (gilt **nicht** für Home-Screen-Web-Apps); Berichte über IndexedDB-Verbindungsabbrüche/Datenverlust in WKWebView/Capacitor (WebKit-Bug 277615) | **Web: primär** |
| OPFS + SQLite WASM (sqlite.org 3.53, VFS `opfs`/`opfs-wl`/`opfs-sahpool`) | SQL, große Daten, schnell | ca. 1 MB WASM, nur im Worker; COOP/COEP-Header für manche VFS; Worker1/Promiser1-API seit 04/2026 deprecated | erst bei Bedarf (Analysen) |
| `@capacitor-community/sqlite` 8.x | natives SQLite, SQLCipher | Web-Pfad über jeep-sqlite/sql.js in IndexedDB; Plugin-Abhängigkeit | nicht nötig |
| **`@capacitor/filesystem`** (JSON.gz im App-Dokumente-Verzeichnis) | vom OS verwaltete Dateien, Backup | nur nativ | **nativ: maßgebliche Kopie der Spielstände** |

**Empfehlung:** Ein Interface `StorageAdapter` (`listSlots`, `load`, `save`, `delete`, `export`, `import`) mit zwei Implementierungen:

- `WebStorage`: Dexie, Metadaten-Tabelle plus Blob-Tabelle.
- `NativeStorage`: Filesystem für die Spielstand-Dateien, Preferences für Einstellungen; Dexie nur als Cache.

Zusätzlich: nach dem ersten Speichern `navigator.storage.persist()` anfordern, Autosave mit Rotation (die letzten 3) und eine Export-Erinnerung im Web.

### 4.3 Spielstand-Format, Versionierung, Migration, Export/Import

```jsonc
{
  "format": "immo-save",
  "schemaVersion": 7,          // Struktur der Datei → Migrationskette
  "rulesVersion": "2026.4",    // Spielregeln/Steuerlogik → Replay-Garantie
  "dataVersion": "gebiete-2026-09-30",
  "appVersion": "1.3.0",
  "seed": "…", "scenarioId": "…",
  "snapshot": { /* GameState @ MonthIndex */ },
  "keyframes": [ /* optional, z. B. jährlich */ ],
  "commandLog": [ /* Befehle seit Spielstart */ ],
  "checksum": "sha256:…"       // Erkennung von Beschädigung, kein Schummelschutz
}
```

- **Migrationen:** `migrations/0007-to-0008.ts` als reine Funktionen, nur vorwärts, nie löschen. Jede Version bekommt eine **Fixture-Datei** (`test/fixtures/saves/v1…vN`). Test: „jede Fixture → aktuelle Version → Zod-valide → deterministischer Hash nach 12 Monaten“. Schlägt eine Migration fehl, bleibt das Original unverändert und wird zum Export angeboten.
- **Export:** JSON → `CompressionStream('gzip')` → Datei `*.immosave`. Im Web per Download-Link (in Chromium optional File System Access API), nativ per Filesystem und Share-Sheet.
- **Import:** Datei wählen → entpacken → `SaveEnvelope.safeParse` → migrieren → validieren → laden.
- **Statische Daten:** `gebiete.csv` (173 KB gzip) wird zur Build-Zeit in `packages/data` validiert und in ein spaltenorientiertes, versioniertes JSON-Datenpaket mit `quelle_id`/`stand` umgewandelt. Der Service Worker cacht es vor. Ein Save referenziert `dataVersion`. **Entscheidung nötig:** Datenpakete ewig mitliefern, oder spielrelevante Gebietsparameter beim Spielstart in den Save kopieren (empfohlen, weil robuster bei Gebietsreformen).

---

## 5. UI

### 5.1 Komponentenbibliothek

| | **shadcn/ui + Base UI/Radix + Tailwind 4** | Mantine 9 | MUI v9 | Ark UI 5 / Park UI |
|---|---|---|---|---|
| Modell | Code liegt im Repo (Copy-in), Primitives headless | fertige Bibliothek (100+ Komponenten, Dates, Charts auf Recharts-Basis) | fertige Bibliothek, Material-Optik; MUI X Grid teils kostenpflichtig | headless (Zag.js) + Panda-CSS-Rezepte |
| Datendichte / Anpassbarkeit | **sehr hoch** (eigene kompakte Varianten) | hoch | mittel (Material-Abstände) | hoch |
| Barrierefreiheit | Base UI 1.x / Radix: gut | gut | gut | gut |
| KI-Vertrautheit | **sehr hoch** (offizielle Agent-Skills, Registry) | hoch | hoch | gering |
| Lock-in | gering | mittel | hoch | gering |
| Stand | Base UI Standard seit 07/2026 | 9.x (benötigt React ≥ 19.2) | v9 (04/2026, kein v8) | Ark 5.x, Park UI unter Chakra-Org |

**Empfehlung: shadcn/ui mit Base UI + Tailwind CSS 4.3**, ergänzt um ein eigenes `packages/ui` mit Design-Tokens, Dichte-Stufen (kompakt/normal), `tabular-nums`, Zahl-/Währungs-Komponenten und Ampel-/Delta-Badges. **Alternative bei Zeitdruck: Mantine 9** (mehr fertige Bausteine, weniger Eigenbau).

### 5.2 Tabellen

- **TanStack Table v9** (stabil seit 04.08.2026; Hook `useTable`, Features und Row-Models explizit, tree-shakable), kombiniert mit **TanStack Virtual** für die 12.588 Gebiete und lange Buchungsjournale. Weil es headless ist, bleibt die Optik voll unter Kontrolle.
  - Achtung: Viele Beispiele, auch die shadcn-„data-table“-Vorlagen, und KI-Trainingsdaten basieren noch auf v8. Deshalb früh eine Referenz-Tabelle als Muster ins Repo legen.
- **AG Grid Community 35/36** (MIT) ist die Alternative für Tabellenkalkulations-Komfort. Gruppierung, Pivot und integrierte Charts sind kostenpflichtig (Enterprise ab 999 USD pro Entwickler). Lohnt sich erst, wenn Pivot-Analysen Spielinhalt werden.

### 5.3 Charts

| | **Apache ECharts 6** | Recharts 3 | visx 4 | Observable Plot 0.6 | uPlot 1.6 |
|---|---|---|---|---|---|
| Rendering | Canvas oder SVG | SVG | SVG (Low-Level) | SVG | Canvas |
| Wasserfall (Cashflow-Brücke) | ja (gestapelte Balken mit transparentem Sockel) | per Trick | selbst bauen | per Trick | nein |
| Zeitreihen über 480 Monate × n Serien | sehr gut, Data-Zoom, Brush | ok | gut | gut (statisch) | **exzellent**, nur Linien/Bänder |
| Sankey/Treemap/Heatmap/Karte | **ja, alles eingebaut** | Sankey, Treemap | teils | teils | nein |
| Barrierefreiheit | `aria` (automatische Beschreibung, Decal-Muster für Farbsehschwäche) | `accessibilityLayer` seit 3.0 Standard (Tastatur) | manuell | manuell | manuell |
| React-Integration | dünner Wrapper (eigener `useECharts`) | idiomatisch, Basis der shadcn-Charts | idiomatisch | imperativ | imperativ |
| Größe (grob, **nicht verifiziert**) | modular über `echarts/core`; Vollpaket ca. 1 MB min | mittel | modular | mittel | ca. 45 KB min |

**Empfehlung:** ECharts 6 als **einzige Chart-Engine**, gekapselt in `packages/charts` mit typisierten Presets:

- Vermögens-/Schulden-Zeitreihe mit Szenario-Bändern
- Cashflow-Wasserfall (Miete → Bewirtschaftung → Zins → Tilgung → Steuer → Netto)
- Sankey „Wohin fließt die Miete“
- Heatmap Rendite × Region
- Choropleth (Abschnitt 5.7)

Theme aus den Design-Tokens (Light/Dark). Jeder Chart erhält **„Als Tabelle anzeigen“** als barrierefreien Fallback. Sparklines in Tabellenzellen als winzige eigene SVG-Komponente. uPlot nur, falls Echtzeit-Zeitreihen mit sehr vielen Punkten nötig werden.

### 5.4 Animation

**Motion 12** (`motion/react`) mit `LazyMotion` + `m` (ca. 5 KB initial statt ca. 34 KB) für Seitenübergänge, Listen-Umordnung und Zahl-Animationen. `prefers-reduced-motion` respektieren; bei Monats-Fast-Forward Animationen abschalten.

### 5.5 Formulare mit Live-Rechnung

- **TanStack Form v1** (stabil, Standard-Schema-Validierung mit Zod, feingranulare Subscriptions). Abgeleitete Werte wie Kaufnebenkosten, Eigenkapitalquote und Monatsrate berechnen reine `sim-core`-Funktionen pro Feldänderung. Die Ergebnisleiste abonniert nur die benötigten Felder, damit nicht das ganze Formular neu rendert.
- **Alternative: React Hook Form 7** (größte Verbreitung, shadcn-Field-Komponenten unterstützen beide; RHF v8 noch Beta). Entscheidung für den Nutzer, Default TanStack Form.
- Zahleneingabe deutsch: Komma als Dezimaltrenner, Tausenderpunkte, Einheiten-Suffix (€, %, m²). Eigene `NumberField`-Komponente mit Parser/Formatter auf Basis von `Intl` und Tests.

### 5.6 Routing

TanStack Router v1 im SPA-Modus mit dateibasierten Routen und Code-Splitting je Route (Karte, Charts, Steuer-Detail lazy). In Capacitor funktioniert History-Routing. Für Hosting ist ein SPA-Fallback nötig (Abschnitt 6.4).

### 5.7 Karte Deutschlands

- **Daten:** BKG **VG250** (Verwaltungsgebiete 1:250.000), Lizenz **dl-de/by-2-0**, Quellenvermerk laut BKG-Katalogeintrag sinngemäß „© BKG (Jahr des letzten Datenbezugs) dl-de/by-2-0“. Den genauen Text bitte den Nutzungsbedingungen (PDF) entnehmen. Download als Shapefile/GeoPackage oder per WFS als GML; GeoJSON muss man selbst erzeugen.
- **Pipeline (`packages/geo`):** VG250 → `mapshaper` (vereinfachen mit `keep-shapes`, Attribute auf ARS/AGS/Name reduzieren) → TopoJSON/GeoJSON je Ebene. Für Gemeinden optional `tippecanoe` → **PMTiles**.
- **Größenbudget (Schätzung, im Spike messen):**

| Ebene | Anzahl | Format | geschätzt gzip |
|---|---|---|---|
| Länder | 16 | TopoJSON | < 30 KB |
| Kreise | ca. 400 | TopoJSON, stark vereinfacht | ca. 60–150 KB |
| Gemeinden | ca. 10.800 | GeoJSON vereinfacht / PMTiles | 1–2 MB / 5–15 MB (kachelweise) |
| MapLibre GL JS 6 | – | JS-Chunk, lazy | ca. 200–300 KB |

- **Stufe 1 (MVP):** Choropleth auf Länder- und Kreisebene mit **ECharts `map`-Serie**. Kein WebGL, keine Basiskarte, voll offline, ARIA plus Tabellen-Fallback, gleiche Theme-Logik.
- **Stufe 2 (optional):** **MapLibre GL JS 6** (07/2026; ESM-only, **WebGL2 Pflicht**) mit PMTiles-Protokoll für Gemeinde-Zoom, als „Kartenpaket herunterladen“ offline verfügbar. Kein externer Kachel-Dienst nötig.
- **Gebietsstand beachten:** VG250 hat einen Stichtag (31.12./01.01.), `gebiete.csv` steht auf 30.09.2026. Gemeindefusionen erzeugen ARS-Abweichungen, deshalb wird eine Zuordnungstabelle in `packages/geo` mit Test „jede Spiel-ARS hat eine Geometrie“ gebraucht.

### 5.8 i18n (Deutsch zuerst)

- **Paraglide JS 2**: Compiler-basiert, typisierte Message-Funktionen, tree-shakable, null Laufzeit-Overhead. **Lingui 5** (Makros, ICU, Extraktion) ist die gleichwertige Alternative; react-i18next 17 ist am verbreitetsten, braucht aber zur Laufzeit mehr und ist schwächer typisiert.
- `sim-core` erzeugt **nie Texte**, nur Codes und Parameter.
- Zahlen, Währungen und Daten zentral über `Intl` (`de-DE`). Ein Fachbegriffs-Glossar wird aus dem Vault generiert und als Tooltip „Was ist das?“ angezeigt.

### 5.9 Icons und Schrift

**Lucide** (shadcn-Standard, tree-shakable). Schriften **selbst gehostet** (offline, DSGVO; z. B. über `@fontsource`) mit tabellarischen Ziffern, kein Google-Fonts-CDN.

---

## 6. Qualität, CI, Deployment

### 6.1 Test-Strategie

| Ebene | Werkzeug | Inhalt |
|---|---|---|
| Finanzformeln | **Vitest 4** + **fast-check 4** (`@fast-check/vitest`) | Invarianten, z. B.: Σ Tilgungen = Darlehen; Restschuld monoton fallend; Zins + Tilgung = Rate (± 1 Cent); Steuer monoton im Einkommen; Cent-Rundungsfehler beschränkt; Serialisierung als Round-Trip; Migrationen idempotent |
| Golden Master | Vitest + Fixtures | die 7 Vault-Fallstudien als Referenzszenarien (erwartete Kennzahlen mit Toleranz und Quelle) |
| Determinismus | Vitest (Node) + **Vitest-Browser-Modus** (Chromium/WebKit/Firefox) | gleicher Seed → gleicher Hash, engine-übergreifend |
| Komponenten | Vitest-Browser-Modus + Testing Library; optional **Storybook 10** mit `addon-vitest` | Tabellen-Sortierung, Formular-Validierung, Tastaturbedienung |
| Visuelle Regression | Vitest `toMatchScreenshot` oder Playwright `toHaveScreenshot` **im Docker-Container** (stabile Fonts) | Dashboards, Charts, Dark Mode, mobile Viewports |
| E2E | **Playwright 1.65** | Neues Spiel → Kauf mit Finanzierung → 12 Monate → Speichern → Export → Import → gleicher Hash; Offline-Modus (Service Worker) |
| Barrierefreiheit | `@axe-core/playwright` | keine kritischen Verstöße auf Kernseiten |

### 6.2 Statische Qualität

- **TypeScript strict** plus `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`.
- TypeScript 7.0 ist ein Go-Port, ca. 10× schneller, unterstützt die alte Compiler-API aber nicht. Daher **`typescript@6`** als reguläre Abhängigkeit für Werkzeuge, die die TS-API brauchen (typescript-eslint type-aware, Docgen, Codegen), und TS 7 über einen Alias (Microsoft-Beispiel: `@typescript/native` → `npm:typescript@^7`) für `tsc --noEmit` in CI und Editor.
- **Biome 2** für Formatierung und Linting (schnell, ein Werkzeug, eigene Typinferenz). **ESLint 10** nur minimal für `eslint-plugin-react-hooks`/React-Compiler-Regeln, falls Biome sie nicht abdeckt. Oxlint ist schnell, aber sein type-aware Modus ist noch jung.
- **Architektur-Wächter:** TS-Project-References plus Importregeln (Biome `noRestrictedImports` oder `dependency-cruiser`). `sim-core` darf nichts aus `ui`/`web` importieren.
- **Bundle-Budget** in CI (z. B. `size-limit`): Werte siehe Abschnitt 7.4.

### 6.3 CI (GitHub Actions), Skizze

```yaml
jobs:
  verify:   # pnpm install (Cache) → turbo run lint typecheck test --affected
  browser:  # Vitest-Browser-Modus mit Playwright (chromium, webkit, firefox) → Determinismus-Hash
  e2e:      # Playwright im offiziellen Container, visuelle Snapshots, Offline-Test
  build:    # vite build → Artefakt → Preview-Deploy pro PR
  deploy:   # main → Produktion (PWA)
  mobile:   # später: macOS-Runner (iOS) / Linux (Android), nur bei Release-Tags
```

Renovate oder Dependabot mit **pnpm-Catalogs** (Versionen zentral in `pnpm-workspace.yaml`), dazu ein ADR pro Major-Upgrade.

### 6.4 Deployment als PWA

| | GitHub Pages | **Cloudflare (Workers Static Assets)** | Netlify |
|---|---|---|---|
| Kosten/Limits | kostenlos; Site ≤ 1 GB, ca. 100 GB/Monat (weiches Limit) | statische Requests kostenlos | Free-Plan mit 300 Credits/Monat (pausiert bei Überschreitung) |
| Eigene Header (CSP, COOP/COEP) | nein | ja | ja |
| SPA-Fallback | nur per `404.html`-Trick | Konfiguration | `_redirects` |
| PR-Previews | nur über Umwege | ja | ja |
| Serverless für KI-Proxy | nein | ja (Worker) | ja (Functions) |

**Empfehlung: Cloudflare.** Cloudflare empfiehlt für neue Projekte Workers Static Assets statt Pages; Pages läuft weiter. GitHub Pages reicht für einen allerersten Prototyp.

**PWA:** `vite-plugin-pwa` 1.3 (Vite-8-Support; Linie im Wartungsmodus, Nachfolger modular) oder **Serwist**, mit:

- Precache von App-Shell und Datenpaketen
- „Update verfügbar“-Dialog statt stiller Aktualisierung mitten im Spiel
- Runtime-Cache für Kartenkacheln
- Installationshinweis (unter iOS 26 öffnen Home-Screen-Lesezeichen standardmäßig als Web-App; installierte Web-Apps sind von Safaris 7-Tage-Löschung ausgenommen)

---

## 7. Mobile-Pfad konkret

### 7.1 iOS

- **Hardware/Software:** Mac mit **Xcode 26+**. Pflicht für App-Store-Uploads seit 28.04.2026 (iOS-26-SDK), Capacitor 8 verlangt es ebenfalls. Deployment-Target ≥ iOS 15. Ohne eigenen Mac: macOS-Runner in GitHub Actions, Codemagic oder Capawesome Cloud. Ionic Appflow nimmt keine Neukunden mehr und endet am 31.12.2027.
- **Konto:** Apple Developer Program **99 USD/Jahr**. Einzelperson oder Organisation (Organisation braucht eine D-U-N-S-Nummer).
- **EU-DSA-Händlerstatus:** Wer als „Trader“ gilt (z. B. bei Monetarisierung), dessen Adresse, Telefonnummer und E-Mail werden im EU-App-Store öffentlich angezeigt. Apps ohne Angabe hat Apple seit 18.02.2025 aus dem EU-Store entfernt. Das ist für Solo-Entwickler eine Datenschutzfrage (Geschäftsadresse/Postfach?).
- **Pflichtangaben:**
  - Datenschutzerklärung in App und Metadaten (5.1.1)
  - App-Privacy-Angaben
  - Privacy-Manifest (`PrivacyInfo.xcprivacy`) für „Required Reason APIs“
  - Altersfreigabe-Fragebogen
- **TestFlight** für Betatests.

### 7.2 Android

- **Software:** Android Studio (für Capacitor 8: Otter 2025.2.1+), JDK 21. **compile/targetSdk 36**: Google Play verlangt seit 31.08.2026 für neue Apps und Updates Android 16 (API 36).
- **Konto:** Play Console **25 USD einmalig** mit Identitätsprüfung. **Private Konten, die nach dem 13.11.2023 angelegt wurden, brauchen vor dem Produktionszugang einen geschlossenen Test mit mindestens 12 Testern über 14 Tage ohne Unterbrechung.** Organisationskonten sind laut Drittquellen ausgenommen.
- **Android Developer Verification:** greift ab 30.09.2026 in BR/ID/SG/TH, global ab 2027. Apps, die über Google Play vertrieben werden, werden automatisch registriert.
- **Formulare:**
  - Data-Safety-Formular
  - **Financial-Features-Deklaration**: auch ohne Finanzfunktionen auszufüllen, hier „Meine App bietet keine Finanzfunktionen“
  - Zielgruppe
  - IARC-Einstufung

### 7.3 Store-Richtlinien für Finanz-/Lern-Simulationen

- **Apple 3.2.1(viii):** Apps für Finanzhandel, Investment oder Geldverwaltung müssen vom lizenzierten Institut eingereicht werden [P]. Konsequenz: keine echten Transaktionen, keine Broker-, Bank- oder Kreditanbindung, keine Partner-Logos, kein Begriff „Anlageberatung“. In Store-Text und App muss klar stehen, dass es eine **Simulation / ein Lernspiel** ist (Kategorie: Spiele/Simulation oder Bildung).
- **Apple 4.2 (Minimum Functionality):** Apps müssen mehr bieten als eine „umverpackte Website“. Gegenmaßnahmen:
  - vollständig offline lauffähig (Prüfer testen Flugmodus)
  - keine externen Webseiten im WebView
  - nativ wirkende Navigation und Safe-Areas
  - Haptik
  - Share-Sheet für Spielstand-Export
  - Speichern als Dateien (Backup)
  - App-Icon/Splash; später ggf. Widgets
  - langfristiger Unterhaltungswert durch Spielinhalte
  - Restrisiko bleibt; Ablehnungen sind mit Nachbesserung und Einspruch lösbar.
- **Apple 5.1.2(i):** Wenn personenbezogene Daten an Dritt-KI gehen (KI-Mentor), braucht es Offenlegung und **ausdrückliche Einwilligung**.
- **Monetarisierung:** Digitale Freischaltungen in der iOS-App laufen über In-App-Kauf (3.1.1). Die Entscheidung beeinflusst DSA-Status, Steuern und Lizenzen.
- **Over-the-Air-Updates der Web-Assets** (Capgo, Capawesome) sind verbreitet, dürfen den Zweck der App aber nicht ändern. Konservativ nutzen.
- **Disclaimer-Vorschlag (Onboarding, Einstellungen, Store-Text):**
  > „Dieses Spiel ist eine vereinfachte Simulation zu Lern- und Unterhaltungszwecken. Es bietet keine Anlage-, Finanzierungs-, Steuer- oder Rechtsberatung und vermittelt keine Finanzprodukte. Zahlen, Steuerregeln und Marktdaten sind modellhaft und haben den angegebenen Stand; sie können veraltet oder unvollständig sein. Für echte Entscheidungen fachkundigen Rat einholen.“

### 7.4 Größenbudget und Offline

| Teil | Budget (Ziel) |
|---|---|
| Initial-JS der Startroute | ≤ 250 KB gzip |
| Chart-Chunk (ECharts, modular) | ≤ 200 KB gzip, lazy |
| Karten-Chunk (MapLibre, Stufe 2) | ≤ 300 KB gzip, lazy |
| Gebiete-Datenpaket | ca. 175 KB gzip (gemessen an der CSV) |
| Offline-Precache gesamt (ohne Gemeinde-Kacheln) | ≤ 10 MB |
| Native App-Download | Ziel < 30 MB (Schätzung) |

Offline ist die Grundannahme: Kein Spielfeature braucht Netz. Netz ist nur optional (KI-Mentor, Datenpaket-Updates).

---

## 8. Optional: KI-Features (z. B. Mentor-Erklärungen per Claude API)

**Grundsatz:** Das Sprachmodell **erklärt, entscheidet aber nichts**. Es liest eine von `sim-core` deterministisch erzeugte Zusammenfassung des Spielstands, verändert den Zustand nie und beeinflusst keinen Zufall. Damit bleiben Reproduzierbarkeit und Testbarkeit erhalten.

| Variante | Beschreibung | Pro | Contra |
|---|---|---|---|
| **A: Vorgeneriert (Empfehlung MVP)** | Erklärtexte, Glossar und Feedback-Bausteine aus Vault-Notizen zur Build-Zeit erzeugen (Message-Batches-API, 50 % Rabatt), redaktionell prüfen und als Datenpaket ausliefern | offline, kostenlos zur Laufzeit, prüfbar, mit Quellenlinks | nicht individuell |
| **B: Eigener Proxy** | Cloudflare Worker hält den API-Key; Ratenlimit pro Installation, Antwort-Cache, Prompt-Caching für System-Prompt und Glossar | Key sicher, Kosten steuerbar | Betreiber trägt Kosten; Auth/Abuse; DSGVO-Pflichten (Auftragsverarbeitung) |
| C: BYOK direkt aus dem Browser | Nutzer trägt eigenen API-Key ein; das offizielle TS-SDK verlangt dafür ein explizites Browser-Opt-in | kein Backend | Key liegt im Gerät; Support-Aufwand; für Laien ungeeignet |
| D: On-Device-Modell | lokales Kleinmodell (WebGPU/OS-Modelle) | offline | Qualität/Größe; nur Ausblick |

**Kosten (Anthropic-Listenpreise laut Doku, Stand 03.11.2026, je 1 Mio. Tokens Eingabe/Ausgabe):**

| Modell | Preis | Beispielaufruf 3.000 Ein- + 500 Ausgabe-Tokens | 1.000 Nutzer × 30 Fragen/Monat |
|---|---|---|---|
| Claude Haiku 5.5 (`claude-haiku-5-5`), Prompts ≤ 100K | 0,10 $ / 0,50 $ | ca. 0,00055 $ | ca. 17 $/Monat |
| Claude Sonnet 5.5 (`claude-sonnet-5-5`) | 2 $ / 10 $ | ca. 0,011 $ | ca. 330 $/Monat |
| Claude Opus 5.5 (`claude-opus-5-5`) | 4 $ / 20 $ | ca. 0,022 $ | ca. 660 $/Monat |

Denk-Tokens werden als Ausgabe abgerechnet; bei Opus 5.5 ist Denken immer aktiv und wird über `effort` gesteuert. Prompt-Caching senkt die Eingabekosten. Für Variante A, z. B. 2.000 Texte mit Opus 5.5 über Batch: grob 25 $ einmalig.

**Risiken:**

- Falsche Steuer- oder Rechtsaussagen. Gegenmittel: nur aus Vault-Notizen mit Stand und Quelle antworten lassen (RAG), Disclaimer, keine Einzelfallberatung.
- Datenschutz: nur anonymisierte Spielzusammenfassung senden; Einwilligung nach Apple 5.1.2(i) und DSGVO.
- Kostenmissbrauch: Ratenlimits, Tagesbudget.
- Offline: Feature degradiert sauber auf Variante A.
- Modellwechsel: Modell-ID serverseitig konfigurieren.

---

## 9. Monorepo-Struktur (Vorschlag)

```
immo/
├─ apps/
│  ├─ web/                      # React 19 + Vite 8 SPA/PWA; zugleich Web-Assets für Capacitor
│  │  ├─ src/
│  │  │  ├─ routes/             # TanStack Router (dateibasiert): dashboard, markt, objekt/$id, finanzierung, steuern, karte, einstellungen
│  │  │  ├─ features/           # fachliche UI-Module (portfolio, deal-wizard, chronik, mentor)
│  │  │  ├─ stores/             # Zustand-Stores (UI-State, Worker-Projektionen)
│  │  │  ├─ sim/                # SimClient (Comlink-Proxy), Hooks useProjection()
│  │  │  └─ styles/             # Tailwind-Einstieg, Tokens-Import
│  │  ├─ public/                # Icons, Manifest, Datenpakete (aus packages/data gebaut)
│  │  ├─ e2e/                   # Playwright-Tests + Snapshots
│  │  └─ vite.config.ts
│  └─ mobile/                   # Capacitor 8: capacitor.config.ts, ios/, android/ (webDir → ../web/dist)
├─ packages/
│  ├─ sim-core/                 # reines TS, kein DOM: model/, finance/, tax/, rent/, market/, events/,
│  │                            # rng/, detmath/, calendar/, commands/, projection/, save/ (Schemas + Migrationen)
│  ├─ sim-worker/               # Worker-Entry, Comlink-expose, Transfer-Optimierung
│  ├─ data/                     # Build-Pipeline: Vault-CSV → Zod-validierte, versionierte Datenpakete + Quellenvermerke
│  ├─ geo/                      # VG250 → mapshaper → TopoJSON/PMTiles; ARS-Mapping; Lizenzhinweis
│  ├─ storage/                  # StorageAdapter: Dexie (Web), Capacitor Filesystem (nativ), Export/Import, gzip
│  ├─ ui/                       # shadcn-Komponenten (Base UI), Tokens, DataTable (TanStack Table v9), NumberField, Formatter (Intl de-DE)
│  ├─ charts/                   # ECharts-Presets (Zeitreihe, Wasserfall, Sankey, Heatmap, Choropleth) + Tabellen-Fallback
│  ├─ i18n/                     # Paraglide-Messages (de; später en), Glossar aus dem Vault
│  ├─ mentor/                   # optional: Prompt-Bausteine, vorgenerierte Texte, Proxy-Client
│  └─ config/                   # tsconfig-Basen, Biome-Konfiguration, Vitest-Presets
├─ services/
│  └─ mentor-proxy/             # optional: Cloudflare Worker für Claude API (Key, Ratenlimit, Cache)
├─ tools/                       # Balancing-/Monte-Carlo-CLI (sim-core in Node), Datenimport-Skripte
├─ docs/                        # research/, plan/, adr/ (Architekturentscheidungen), CLAUDE.md-Verweise
├─ .github/workflows/
├─ pnpm-workspace.yaml          # inkl. Catalogs (zentrale Versionen)
├─ turbo.json  biome.json  tsconfig.base.json  CLAUDE.md
```

**Abhängigkeitsregeln:**

- `sim-core` ← `sim-worker`, `storage`, `data` (nur Typen), `mentor`
- `ui` und `charts` kennen `sim-core` **nicht** (nur View-Model-Typen aus `sim-core/projection`)
- `apps/web` darf alles

Das CI prüft diese Regeln.

---

## 10. Risiken und Alternativen

| Risiko | Wahrscheinlichkeit / Wirkung | Gegenmaßnahme / Alternative |
|---|---|---|
| Apple lehnt die Capacitor-App nach 4.2 ab | mittel / mittel | Offline-first, native Integrationen, kein Web-Browsing-Gefühl; notfalls iOS zunächst nur als PWA; Plan B Expo-UI auf demselben `sim-core` |
| WebView-Performance auf schwachen Android-Geräten (dichte Tabellen, viele Charts) | mittel / mittel | Virtualisierung, Canvas-Charts, Lazy-Routes; früh auf einem Low-End-Gerät messen |
| Engine-Unterschiede brechen den Determinismus (V8/JSC/SpiderMonkey) | hoch, falls ignoriert / hoch | `detmath`, Lint-Verbote, engine-übergreifender Hash-Test in CI |
| Datenverlust in IndexedDB (Safari, WKWebView) | mittel / hoch | `persist()`, native Dateikopie, Autosave-Rotation, Export-Erinnerung |
| Regeländerungen machen alte Replays ungültig | hoch / niedrig | `rulesVersion`, Snapshot maßgeblich |
| Migrationen werden komplex | mittel / mittel | reine Funktionen, Fixture pro Version, nie löschen |
| Bibliotheks-Umbrüche (TanStack Table v9 jung, TS-7-Werkzeuglücken, vite-plugin-pwa im Wartungsmodus, Capacitor 9) | mittel / mittel | Pins über pnpm-Catalogs, Renovate, ADR je Upgrade, dünne Wrapper (`ui`, `charts`, `storage`) |
| KI-Agenten nutzen veraltete APIs (Table v8, Zod 3, Tailwind 3) | hoch / mittel | `CLAUDE.md` mit Versionen und Mustern, Referenz-Implementierungen im Repo, Doku-Links (`llms.txt`) |
| Veraltete Steuer- und Rechtsdarstellung | mittel / hoch (Vertrauen) | Stand-Angaben aus dem Vault, Disclaimer, `rulesVersion` je Steuerjahr |
| Private Daten im Store (DSA-Adresse, Apple-Verkäufername) | sicher / mittel | Organisationskonto oder Geschäftsadresse vor dem Store-Start klären |
| Anbieter-Risiko Ionic/Capacitor | niedrig / mittel | Capacitor ist MIT-Open-Source; Cloud-Build-Dienste austauschbar (GitHub Actions) |
| Bundle wächst über Budget | mittel / niedrig | `size-limit` in CI, Lazy-Chunks |

---

## 11. Entscheidungen, die der Nutzer treffen sollte

Jeweils mit Empfehlung als Default:

1. **Plattform:** React + Vite + PWA + Capacitor *(Empfehlung)*, oder Expo, falls native Mobil-Haptik wichtiger ist als Web-Datendichte.
2. **Primäres Zielgerät:** Desktop/Tablet-first mit responsiven Phone-Ansichten *(Empfehlung bei datendichtem Spiel)*, oder Phone-first.
3. **UI-Kit:** shadcn/ui + Base UI *(Empfehlung)* oder Mantine 9 (schneller, weniger Eigenbau).
4. **Formulare:** TanStack Form *(Empfehlung)* oder React Hook Form.
5. **Undo-/Zeitreise-Regeln (Spieldesign):** Undo nur innerhalb des laufenden Monats *(Empfehlung)*; Zurückspulen per Keyframes nur im Lernmodus?
6. **Datenrealismus:** reale Gebiete, Preise und Kennzahlen aus dem Vault (mit Stand/Quelle) oder eine fiktionalisierte Welt. Abwägung: Realismus gegen Pflegeaufwand und Fehlinterpretation als Beratung.
7. **Datenpakete im Save:** spielrelevante Gebietsparameter beim Spielstart kopieren *(Empfehlung)* oder versionierte Datenpakete dauerhaft mitliefern.
8. **Karte:** im MVP nur Länder/Kreise *(Empfehlung)*; Gemeinde-Ebene später?
9. **Sprachen:** nur Deutsch, oder Englisch geplant. Beeinflusst den i18n-Aufwand jetzt; die Bibliothek wird so oder so eingeführt.
10. **Hosting und Domain:** Cloudflare *(Empfehlung)* oder GitHub Pages; eigene Domain?
11. **Mobile-Zeitplan und Konten:** Ist ein Mac vorhanden? Apple-Konto als Person oder Organisation (D-U-N-S)? DSA-Händlerstatus und öffentliche Adresse? Google als Privatkonto (12-Tester-Regel) oder Organisation?
12. **Monetarisierung:** kostenlos/Open Source, Einmalkauf, In-App-Kauf oder Werbung. Wirkt auf Store-Regeln, DSA, Steuern und kostenpflichtige Bibliotheken.
13. **Lizenzen:** Code (z. B. MIT/AGPL/proprietär), Vault-Inhalte als Spieldaten, BKG-Attribution.
14. **KI-Mentor:** gar nicht, nur vorgeneriert *(Empfehlung MVP)*, Proxy (wer zahlt?) oder BYOK.
15. **Telemetrie/Fehlerberichte:** keine im MVP *(Empfehlung)* oder DSGVO-konform (Opt-in, ggf. selbst gehostet).
16. **Browser-Mindestanforderungen:** z. B. letzte 2 Versionen von Safari, Chrome, Firefox und Edge; WebGL2 nur für die Karten-Stufe 2.
17. **Werkzeug-Versionen** (kann ein Agent per Spike klären): pnpm 11 oder 12; TS 6 + 7-Alias oder rein TS 7.

---

## 12. Nächste Schritte (Vorschlag)

1. ADRs 0001–0006 anlegen: Plattform, Monorepo, Geld/Determinismus, Save-Format, UI-Kit, Charts.
2. **Spike 1:** `sim-core`-Skelett mit Annuitätendarlehen, PRNG, `detmath` und Hash-Test in Node, Chromium, WebKit und Firefox.
3. **Spike 2:** `packages/data`: `gebiete.csv` → validiertes Datenpaket, Größe messen.
4. **Spike 3:** App-Shell mit shadcn/Base UI, TanStack-Table-v9-Gebietstabelle (12.588 Zeilen, virtualisiert), ECharts-Wasserfall und Kreis-Choropleth.
5. **Spike 4:** Save → Export → Import → Migration als Round-Trip-E2E-Test.
6. **Spike 5 (später):** Capacitor-Build auf echtem iPhone und Low-End-Android, Offline-Test im Flugmodus.

---

## 13. Quellen

**Plattformen**
- Capacitor 8 Ankündigung [P]: https://ionic.io/blog/announcing-capacitor-8
- Capacitor 8.5 [P]: https://ionic.io/blog/capacitor-8-5-released
- Capacitor 9 Roadmap [P]: https://ionic.io/blog/capacitor-9-starts-here · https://ionic.io/blog/?p=6904
- Capacitor 8 Upgrade-Guide (Xcode 26, iOS 15) [P]: https://capacitorjs.com/docs/updating/8-0
- Capacitor-8-Anforderungen (Node 22, SDK 36, minSdk 24) [S]: https://capawesome.io/blog/how-to-upgrade-your-capacitor-app-to-capacitor-8/
- Appflow-Ende 31.12.2027 [S]: https://capawesome.io/blog/alternative-to-appflow/
- Expo SDK 56/57/58 [P]: https://expo.dev/changelog/sdk-56 · https://expo.dev/changelog/sdk-57 · https://expo.dev/changelog/sdk-58
- React Native 0.88 [P]: https://reactnative.dev/blog/2026/10/19/react-native-0.88
- Expo DOM Components [P]: https://docs.expo.dev/guides/dom-components/
- Flutter (What's new, 3.50) [P]: https://docs.flutter.dev/release/whats-new · Wasm/Renderer: https://docs.flutter.dev/to/wasm · Web-Barrierefreiheit: https://docs.flutter.dev/ui/accessibility/web-accessibility.html
- Svelte-Blog (Oktober 2026: SvelteKit 3, sv 1.0) [P]: https://svelte.dev/blog · https://svelte.dev/blog/whats-new-in-svelte-september-2026
- LayerChart Releases [S]: https://next.layerchart.com/docs/releases
- Tauri 2.0 RC (Mobile-Einordnung) [P]: https://v2.tauri.app/blog/tauri-2-0-0-release-candidate/
- Tauri Releases (2.10, 2.11) [P]: https://v2.tauri.app/release/tauri/v2.11.0/ · https://v2.tauri.app/release/core/
- React 19.2 [P]: https://react.dev/blog/2025/10/01/react-19-2
- React Compiler 1.0 [P]: https://react.dev/blog/2025/10/07/react-compiler-1
- React Compiler mit Vite 8 [S]: https://recca0120.github.io/en/2026/04/14/react-compiler-vite-v6/
- Vite 8 [P]: https://vite.dev/blog/announcing-vite8 · Vite 8.1: https://vite.dev/blog/announcing-vite8-1
- Rolldown 1.0 [P]: https://voidzero.dev/posts/announcing-rolldown-1-0
- TypeScript 7.0 [P]: https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/ · RC: https://devblogs.microsoft.com/typescript/announcing-typescript-7-0-rc/
- pnpm 11 [P]: https://pnpm.io/blog/releases/11.0 · pnpm 12 [P]: https://pnpm.io/blog/releases/12.0 · Einordnung [S]: https://infoq.com/news/2026/09/pnpm-12-rust
- React Native vs. Capacitor (Dashboards) [S]: https://vp0.com/blogs/react-native-vs-capacitor-2026-performance

**Simulations-Kern**
- Zod 4 / Zod Mini [P]: https://zod.dev/v4 · https://zod.dev/packages/mini
- Valibot vs. Zod [S]: https://www.pkgpulse.com/guides/valibot-vs-zod-v4-2026
- pure-rand [P]: https://redirect.github.com/dubzzz/pure-rand
- Comlink [P]: https://raw.githubusercontent.com/GoogleChromeLabs/comlink/main/README.md · Off-main-thread: https://web.dev/articles/off-main-thread
- Dinero.js v2 [P]: https://www.github.com/dinerojs/dinero.js/releases · https://v2.dinerojs.com/docs/getting-started/upgrade-guide
- Math.pow „implementation-approximated“ [P]: https://bugzilla.mozilla.org/show_bug.cgi?id=1775254 · https://bugs.webkit.org/show_bug.cgi?id=150403
- V8-Exponentiations-Inkonsistenz [S]: https://www.freecodecamp.org/news/i-found-a-bug-in-v8s-exponentiation-operator-dcddfa5b8482/
- Temporal [P]: https://caniuse.com/temporal · https://web-platform-dx.github.io/web-features-explorer/features/temporal
- Temporal in Chrome [S]: https://www.infoq.com/news/2026/02/chrome-temporal-date-api
- Immer-Patches/Undo [S]: https://medium.com/@mweststrate/distributing-state-changes-using-snapshots-patches-and-actions-part-1-2811a2fcd65f

**State und Daten**
- Dexie 4.4 [P]: https://dexie.org/blog/dexie-44-dexie-cloud-server-30-the-big-one · Dexie 5 Roadmap: https://dexie.org/roadmap/dexie5.0 · StorageManager: https://dexie.org/docs/StorageManager
- Speicher und Eviction [P]: https://web.dev/articles/storage-for-the-web · https://web.dev/articles/persistent-storage · https://developer.mozilla.org/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria · WebKit-Storage-Policy: https://webkit.org/?p=14403
- WKWebView/Capacitor IndexedDB-Probleme [P]: https://bugs.webkit.org/show_bug.cgi?id=277615 · https://developer.apple.com/forums/thread/750682
- SQLite WASM/OPFS [P]: https://sqlite.org/wasm/doc/tip/news.md · https://sqlite.org/wasm/doc/tip/persistence.md · https://developer.chrome.com/blog/sqlite-wasm-in-the-browser-backed-by-the-origin-private-file-system
- @capacitor-community/sqlite 8.x [P]: https://cdn.jsdelivr.net/npm/@capacitor-community/sqlite@8.1.0/README.md
- State-Management-Überblick 2026 [S]: https://www.pkgpulse.com/guides/state-of-react-state-management-2026
- XState Store [S]: https://tkdodo.eu/blog/introducing-x-state-store
- TanStack Query v5→v6 [P]: https://tanstack.com/query/v5/docs/framework/migrate-from-v5-to-v6

**UI**
- shadcn/ui Changelog [P]: https://ui.shadcn.com/docs/changelog · Base UI Default: https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default · Base UI Docs: https://ui.shadcn.com/docs/changelog/2026-01-base-ui · Tailwind v4: https://ui.shadcn.com/docs/tailwind-v4
- Base UI 1.0 [P]: https://base-ui.com/react/overview/releases/v1-0-0.md · Einordnung [S]: https://www.infoq.com/news/2026/02/baseui-v1-accessible
- Tailwind CSS 4.3 [P]: https://tailwindcss.com/blog/tailwindcss-v4-3
- Mantine 9 [P]: https://mantine.dev/changelog/9-0-0 · https://mantine.dev/guides/8x-to-9x
- MUI v9 [P]: https://mui.com/blog/introducing-mui-v9/ · Roadmap: https://mui.com/blog/2026-and-beyond/
- Ark UI / Park UI / Chakra v3 [P]: https://ark-ui.com/docs/overview/changelog.mdx · https://park-ui.com/blog/park-ui-joins-the-chakra-ui-organization · https://chakra-ui.com/blog/announcing-v3
- TanStack Table v9 [P]: https://tanstack.com/blog/announcing-tanstack-table-v9 · Migration: https://tanstack.com/table/v9/docs/framework/react/guide/migrating
- AG Grid Community vs. Enterprise [P]: https://www.ag-grid.com/javascript-data-grid/community-vs-enterprise.md · AG Grid 35: https://blog.ag-grid.com/whats-new-in-ag-grid-35/
- ECharts 6 [P]: https://echarts.apache.org/handbook/en/basics/release-note/v6-feature · ECharts-ARIA [P]: https://echarts.apache.org/handbook/en/best-practices/aria/
- Recharts 3 [S]: https://newreleases.io/project/npm/recharts/release/3.0.0 · https://newreleases.io/project/npm/recharts/release/3.10.0
- visx 4 [P]: https://cdn.jsdelivr.net/gh/airbnb/visx@master/MIGRATION.md
- Observable Plot [P]: https://npmjs.com/package/@observablehq/plot
- uPlot [P]: https://npmjs.com/package/uplot · https://leeoniya.github.io/uPlot
- Motion [P]: https://motion.dev/docs/react-reduce-bundle-size · https://motion.dev/docs/react-lazy-motion
- TanStack Form v1 [P]: https://tanstack.com/blog/announcing-tanstack-form-v1
- React Hook Form v8 Beta [S]: https://newreleases.io/project/npm/react-hook-form/release/8.0.0-beta.1
- TanStack Router vs. React Router [P]: https://tanstack.com/router/v1/docs/framework/react/comparison · [S]: https://www.pkgpulse.com/guides/tanstack-router-vs-react-router-v7-2026
- MapLibre GL JS 6 [P]: https://maplibre.org/news/2026-08-02-maplibre-newsletter-jul-2026/ · Migration v5→v6: https://maplibre.org/maplibre-gl-js/docs/guides/v5-to-v6-migration-guide/ · [S]: https://geo.malagis.com/maplibre-gl-js-v6-mandatory-webgl-and-esm-only.html
- PMTiles im Web (Newsletter 09/2025) [P]: https://maplibre.org/news/2025-10-04-maplibre-newsletter-september-2025/
- BKG VG250 Nutzungsbedingungen [P]: https://sgx.geodatenzentrum.de/web_public/gdz/lizenz/deu/nutzungsbedingungen_vg250.pdf · Doku: https://sg.geodatenzentrum.de/web_public/gdz/dokumentation/deu/vg250.pdf · Katalog (dl-de/by-2-0-Vermerk): https://gdk.gdi-de.org/geonetwork/srv/api/records/cfbe95dc-81b9-4704-a61c-d71070d15fd3
- Paraglide JS [P]: https://github.com/opral/paraglide-js · i18n-Vergleich [S]: https://simplelocalize.io/blog/posts/the-most-popular-react-localization-libraries/

**Qualität und Deployment**
- Vitest 4 [P]: https://voidzero.dev/posts/announcing-vitest-4 · Visuelle Regression: https://main.vitest.dev/guide/browser/visual-regression-testing
- fast-check 4.x [P]: https://fast-check.dev/blog/2025/03/10/whats-new-in-fast-check-4-0-0/ · https://fast-check.dev/blog/2026/07/24/whats-new-in-fast-check-4-9-0/
- Playwright 1.65 [S]: https://testdino.com/blog/playwright-1-65-release
- Storybook 10 [P]: https://storybook.js.org/blog/storybook-10/ · 10.3 (Vite 8): https://storybook.js.org/releases/10.3 · 10.5: https://storybook.js.org/releases/10.5
- ESLint 10 [P]: https://eslint.org/blog/2026/02/eslint-v10.0.0-released/
- Biome vs. ESLint vs. Oxlint [S]: https://tech-insider.org/eslint-vs-biome-vs-oxlint-2026/
- vite-plugin-pwa 1.3 [S]: https://newreleases.io/project/npm/vite-plugin-pwa/release/1.3.0
- Cloudflare Pages → Workers [P]: https://developers.cloudflare.com/workers/static-assets/migrate-from-pages/ · https://developers.cloudflare.com/workers/static-assets/compatibility-matrix
- GitHub-Pages-Limits [P]: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- Netlify Credits [P]: https://www.netlify.com/changelog/netlify-pricing-update-introducing-credit-based-plans/ · https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/
- iOS 26 Web-Apps vom Home-Screen [S]: https://heise.de/-10749652 · https://www.macrumors.com/guide/ios-26-safari-features/

**Mobile und Stores**
- App Review Guidelines (3.2.1(viii), 4.2, 5.1.1, 5.1.2(i), 4.7) [P]: https://developer.apple.com/app-store/review/guidelines/
- Apple SDK-Mindestanforderung (Xcode 26 ab 28.04.2026) [P]: https://developer.apple.com/news/upcoming-requirements/
- Apple DSA-Händlerstatus [P]: https://developer.apple.com/help/app-store-connect/manage-compliance-information/manage-european-union-digital-services-act-compliance-information · Entfernung 02/2025 [S]: https://techcrunch.com/2025/02/18/apple-purges-apps-without-contact-info-from-eu-app-store-as-dsa-deadline-hits
- 4.2-Ablehnungen bei Web-Wrappern [S]: https://capgo.app/blog/how-to-pass-app-store-review-2026/ · https://developer.apple.com/forums/thread/835422
- Google Play Target-API 36 [P]: https://developer.android.com/google/play/requirements/target-sdk · https://support.google.com/googleplay/android-developer/answer/11926878
- Google Play 12 Tester / 14 Tage [P]: https://support.google.com/googleplay/android-developer/answer/14151465
- Android Developer Verification [P]: https://android-developers.googleblog.com/2026/03/android-developer-verification.html · https://support.google.com/android-developer-console/answer/16561738
- Google Play Financial-Features-Deklaration [P]: https://support.google.com/googleplay/android-developer/answer/13849271
- Kontogebühren (99 $/Jahr, 25 $ einmalig) [S]: https://studio.adalo.com/blog/apple-developer-program-guide · https://magora-systems.com/google-play-developer-account-cost/

**KI**
- Claude-Modelle und Preise [P]: https://platform.claude.com/docs/en/about-claude/models/overview · https://platform.claude.com/docs/en/about-claude/pricing · Prompt-Caching: https://platform.claude.com/docs/en/build-with-claude/prompt-caching

---

## 14. Methodik und Grenzen dieser Recherche

- Recherche am 26.11.2026 per Websuche. Volltextabruf war nur für `developer.apple.com` möglich. Die Domains `expo.dev`, `ionic.io`, `echarts.apache.org`, `maplibre.org`, `ui.shadcn.com` und `react.dev` waren in dieser Umgebung für den Abruf gesperrt. Deren Aussagen stützen sich auf Suchergebnis-Auszüge der jeweiligen Primärseiten.
- Am Ende war das Suchbudget erschöpft. **Nicht erneut verifiziert:** dass Apple die EU-Abschaltung der Home-Screen-Web-Apps (iOS 17.4, Anfang 2024) zurückgenommen hat. Das entspricht dem Kenntnisstand, ist aber vor einer PWA-only-Strategie für EU-iOS-Nutzer zu prüfen.
- **Schätzwerte** (Bundle- und Geodatengrößen, App-Größe) sind als solche markiert und im Spike zu messen. Gemessen ist nur `gebiete.csv`: 1.304.102 Byte roh, 173.454 Byte gzip.
- Versionsnummern mit [S] vor dem Festschreiben in `pnpm-workspace.yaml` per `npm view` prüfen.
