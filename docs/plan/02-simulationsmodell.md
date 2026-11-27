# 02 – Simulationsmodell: verbindliche Architektur- und Fachspezifikation von `packages/sim-core`

| | |
|---|---|
| Stand | 26.11.2026 |
| Status | Entwurf v1 zur Abnahme – nach Abnahme **verbindlich** für P0–P9 |
| Geltungsbereich | Simulationskern (`packages/sim-core`), Datenvertrag zum Exportpaket, Balancing-Werkzeuge (`tools/`) |
| Fachquellen (nicht neu recherchiert, sondern zusammengeführt) | `docs/research/10-…` (Finanzierung, Bank, Kennzahlen) · `11-…` (Steuern, Recht, Regeln) · `12-…` (Bewirtschaftung) · `13-…` (Akquise, Markt, Gebiete) · `14-…` (Fallstudien, Strategie, Kalibrierung) · `20-…` (Marktwerte Nov. 2026, Rechtsänderungen, Datenquellen) · `22-…` Abschn. 3 (sim-core-Technik) · `01-…` Abschn. 4 und 7 (Fehler des Prototyps) |
| Nicht Gegenstand | UI-Gestaltung, Komponenten, Routing, Store (eigene Planteile) |

---

## Lesehinweise

**Verweise.** „→ 10 §2.4“ bedeutet: Dokument `docs/research/10-ic-finanzierung-wirtschaftlichkeit.md`, Abschnitt 2.4.
Detailformeln stehen dort; hier stehen die **verbindlichen Modellentscheidungen**, Schnittstellen und zentralen Formeln.

**MUSS / SOLL / KANN.** „MUSS“ ist verbindlich, „SOLL“ ist der Standard, von dem nur mit ADR abgewichen wird,
„KANN“ ist eine Option.

**Status-Flags** (gelten für jeden Parameter, jede Regel, jede Kennzahl und jede Ereigniswahrscheinlichkeit):

| Flag | Kürzel | Bedeutung | Herkunft | UI-Badge |
|---|---|---|---|---|
| BELEGT | `[BEL]` | Wert steht im IC-Vault mit Quelle und Stand (Sicherheit A/B/C wird mitgeführt, z. B. `[BEL·C]`) | nur aus dem Vault-Exportpaket | „belegt · Stand … · Quelle …“ |
| ABGELEITET | `[ABG]` | aus belegten Werten nachgerechnet oder aus belegten Zeitreihen geschätzt (Rechenweg gespeichert) | Vault-Export oder Spiel-Tool (`tools/calibrate-*`) | „abgeleitet · Rechenweg“ |
| GESCHÄTZT | `[GES]` | Platzhalter für eine **reale** Größe, die nicht belegt ist (Lücke) | Spiel-Repo, `params/geschaetzt/` | „geschätzt“ (auffällig) |
| DESIGN | `[DES]` | reine Spielmechanik, keine Aussage über die Realität (z. B. Aktionspunkte) | Spiel-Repo, `params/design/` | „Spielmechanik“ |

**Übersetzung der Research-Marker:** Vault-Wert → `[BEL]`; „[R]“/„ABGELEITET“/Nachrechnung → `[ABG]`;
„LÜCKE“ mit Platzhalter für eine reale Größe → `[GES]`; „ANNAHME (Design)“/„DESIGN“ für reine Mechanik → `[DES]`;
„ANNAHME“ für eine reale Größe → `[GES]`.

**Sonderfall Web-Recherche (Dok. 20).** Werte, die nur in Dok. 20 stehen (z. B. ESt-Tarif-Eckwerte 2026, BEG-Reform 2026,
Mietpreisbremse „+10 %“), sind fachlich gut gestützt, aber **noch nicht im Vault**. Weil der Vault die einzige Quelle der Wahrheit
ist, laufen sie im Spiel als `[GES]` mit dem Zusatz „extern belegt, Vault-Übernahme ausstehend“. Notation in diesem Dokument:
`[WEB→W]`. Mit der Übernahme durch den Strang W werden sie automatisch `[BEL]` (siehe 1.7).

**Phasen-Tags:** P0 Fundament · P1 Rechenkern · P2 Daten & Regionen · P3 Vertical Slice „Die erste Wohnung“ ·
P4 Bewirtschaftung & Steuern · P5 Skalierung & Finanzen · P6 Lernen & Szenarien · P7 Profi-Inhalte · P8 Release Web ·
P9 Mobile · W Wissens-Härtung (parallel).

**Lücken-IDs:** `LR-nn` verweist auf das Lücken-Register (Abschnitt 5). Vault-Lücken-IDs der Research-Dokumente
(z. B. „L-03“ aus Dok. 12) stehen dort in der Spalte „Herkunft“.

### Leitplanken (gelten für alle Engines)

1. **Deterministisch:** gleicher Seed + gleiches Datenpaket + gleiche Befehle ⇒ bitgleicher Zustand auf allen Engines
   (V8, JavaScriptCore, SpiderMonkey). Geld als Integer-Cent, Sätze in Basispunkten, keine `Math.pow/exp/log`, kein `Date`,
   kein `Math.random` im Kern (→ 22 §3.2–3.3).
2. **Eine Wahrheit je Größe:** ein Hauptbuch für Geld (1.3), ein Wertmodell für Immobilien (2.16), ein Regelauflöser für
   Recht (2.14). Der Prototyp scheiterte an drei Wertmodellen und an Geld ohne Buchungen (→ 01 §3.8, §6.1).
3. **Erklärbar:** Jede angezeigte Kennzahl kann ihren Rechenweg mit Eingabewerten, Status und Quelle liefern (1.8).
4. **Information kostet:** Verdeckte Merkmale werden nur durch Handlungen mit Zeit- oder Geldkosten sichtbar (1.9).
5. **Die Bank ist ein System, kein Würfel:** Kreditentscheidungen sind deterministisch und begründet (2.6).
6. **Werte können fallen:** Kein Preis, keine Miete, kein Bankparameter hat eine eingebaute Aufwärtsgarantie (2.1, 3).
7. **Recht als Daten:** Regionale und zeitabhängige Regeln kommen aus Regeldaten mit Gültigkeit, nicht aus Code-Konstanten (2.14).
8. **Lücken sind sichtbar:** Nichts Geschätztes wird als Fakt angezeigt; jede Lücke hat ein Ziel im Strang W (5).
9. **Kein Survivorship-Bias:** Realistische Risiken führen in einem messbaren Anteil der Läufe zu Zuzahlung, Notverkauf oder
   Scheitern (→ 14 §5.3 S10).
10. **Leistungsbudget (Ziel, [DES]):** `advance(1)` mit 50 Objekten / 250 Einheiten < 5 ms im Worker;
    ein Monte-Carlo-Lauf über 480 Monate < 2 s in Node.

---

## 0. Überblick

### 0.1 Domänenkarte

```mermaid
flowchart TB
  subgraph DATEN["Statische Daten (versioniert, nie Markdown)"]
    VX["Vault-Exportpaket<br/>Regionen · Kennzahlen · Zeitreihen · Regeln · Quellen"]
    SP["Spiel-Parameter<br/>GESCHÄTZT · DESIGN · Szenarien · Ereigniskatalog"]
  end
  subgraph UMWELT["Umwelt (exogen, seedbasiert)"]
    MAK["2.1 Makro & Marktpfade"] --> REG["2.2 Regionalmarkt"]
    REGL["2.14 Regeln & Politik"]
  end
  subgraph ZUGANG["Marktzugang"]
    ANG["2.3 Angebotsgenerator"] --> AKQ["2.4 Akquise & Kaufprozess"]
    BEW["2.16 Bewertung & Verkauf"]
  end
  subgraph FIN["Finanzen & Person"]
    BANK["2.6 Bank & Kredit"]
    STEU["2.13 Steuer"]
    SPI["2.7 Spieler & Haushalt"]
  end
  subgraph BESTAND["Bestand & Bewirtschaftung"]
    VERM["2.8 Vermietung"]
    BK["2.9 Betriebskosten & NKA"]
    WEG["2.10 WEG & Verwaltung"]
    GEB["2.11 Gebäude & Energie"]
    VERS["2.12 Versicherung & Schäden"]
  end
  subgraph FOLGEN["Steuerung & Folgen"]
    EVT["2.15 Ereignisse & Posteingang"]
    KRI["2.17 Scheitern & Krise"]
    ZIEL["2.18 Ziele & Scoring"]
  end
  CALC["2.5 Kalkulation & Kennzahlen<br/>(reine Funktionen, auch synchron im UI)"]
  LED[("1.3 Hauptbuch<br/>jede Geldbewegung")]

  VX --> REG & REGL & MAK
  SP --> MAK & ANG & EVT & BANK
  REG --> ANG & BEW & VERM
  REGL --> AKQ & VERM & BK & GEB & STEU
  AKQ --> BANK
  AKQ -- "Nutzen-Lasten-Wechsel" --> BESTAND
  BEW --> BANK & ZIEL
  BANK & VERM & BK & WEG & GEB & VERS & STEU & SPI & AKQ --> LED
  LED --> STEU & BK & KRI & ZIEL
  EVT -. "Optionen wirken über Engine-Befehle" .-> BESTAND & FIN & ZUGANG
  CALC -. "genutzt von" .-> AKQ & BANK & BEW & ZIEL
```

Lesart: Die Umwelt (Makro, Region, Regeln) läuft unabhängig vom Spieler. Der Spieler greift über Befehle in Marktzugang,
Finanzen und Bestand ein. Alle Geldflüsse laufen durch das Hauptbuch; Steuer, Nebenkostenabrechnung, Krise und Scoring lesen
ausschließlich daraus.

### 0.2 Modul-Layout von `packages/sim-core/src`

```
sim-core/src/
├─ kernel/        Grundtypen & Werkzeuge ohne Fachwissen
│   ├─ money.ts        Cents, Bp, mulBp, roundHalfAwayFromZero, floorToEuro
│   ├─ detmath.ts      powInt, expDet, lnDet, sqrt (nur IEEE-Grundoperationen)
│   ├─ rng.ts          zählerbasierter PRNG, Verteilungen (1.6)
│   ├─ calendar.ts     MonthIndex, Quartal, Steuerjahr, Fristrechnung in Monaten
│   ├─ ids.ts          typisierte IDs, deterministische ID-Vergabe
│   ├─ explain.ts      Tracer/Erklaerung (1.8)
│   └─ result.ts       Result/Validierung, Begründungscodes
├─ params/        Parameter-Registry, Status-Flags, Auflösung nach Zeit/Region, Rechtsjahrgänge (1.7)
├─ world/         Datenpaket-Typen + Lookups: Gebiete (ARS), Struktur, Kennzahlen mit Schätzkaskade, Zeitreihen
├─ rules/         Regelauflösung (Präfix, Vorrang, Stichtag, Objektart), Regel-Effekte, Politik-Ereignisphasen (2.14)
├─ ledger/        Konten, Buchungen, Buchungsarten, Invarianten, Monats-/Jahresaggregate (1.3)
├─ macro/         nationale Pfade: historisches Replay, Regime-Modell, Schocks, Szenario-Overrides (2.1)
├─ region/        Kreis-Indizes, Gemeinde-Offsets, Mikrolage, Vergleichsmiete, Leerstand, Prognose-Zeitung (2.2)
├─ calc/          reine Finanzmathematik & Kennzahlen K01–K35, Kaufnebenkosten, Annuität, Kaskade (2.5)
├─ valuation/     EIN Wertmodell (wertKern) mit Sichten: wahr, Spieler, Gutachter, Beleihung (2.16, Teil 1)
├─ offers/        Angebotsgenerator, Exposé-Schönung, Konkurrenz, Verfall, Off-Market (2.3)
├─ acquisition/   Kaufprozess-Automat, Aufdeckung, Verhandlung, Notar, Nutzen-Lasten-Wechsel (2.4)
├─ sale/          Verkaufsprozess, Notverkauf, Zwangsversteigerung (2.16, Teil 2)
├─ bank/          Bankprofile, Kreditprüfung P0–P9, Konditionen, Darlehen, Anschluss, Sondertilgung, Dispo (2.6)
├─ player/        Haushalt, Einkommen, Lebenshaltung, Rechtsträger (privat/GmbH/Holding), Zeitbudget, Wissen, Netzwerk (2.7)
├─ lease/         Mieter-Automat, Bewerber, Mietverträge, Mieterhöhung, Zahlungsstörung, Kündigung, Kaution (2.8)
├─ opex/          Betriebskosten-Positionen, Umlage-Prüfkette, Heizkosten, CO₂, NKA, Fristen (2.9)
├─ weg/           WEG, Wirtschaftsplan, Hausgeld, Rücklage, Sonderumlage, ETV, Verwalter/SEV (2.10)
├─ building/      Bauteilmodell, Alterung, Ausfälle, Energie, Maßnahmen/Projekte, GModG, Förderung (2.11)
├─ insurance/     Policen, Gefahren, Schadenfälle, Obliegenheiten (2.12)
├─ tax/           Steuerjahr, V+V, AfA, 15-%-Prüfung, § 23, ESt-Tarif, Veranlagung, GmbH/Holding (2.13)
├─ events/        Ereigniskatalog-Laufzeit, Auslöser, Optionen, Folgenvorschau, Posteingang, Fristen (2.15)
├─ crisis/        Liquiditätsüberwachung, Frühwarnung, Rücklastschrift, Eskalation, Verwertung (2.17)
├─ scoring/       Nettovermögen, Meilensteine, Szenario-Bewertung (2.18)
├─ time/          Monats-Pipeline, Zeitplan-Queue (Termine), „Weiter“-Modi, Stoppbedingungen (1.5)
├─ commands/      Befehlskatalog, Validierung, Dispatch, Undo-Barrieren (1.4)
├─ projection/    View-Models, Erklärungen, Vorschau/Was-wäre-wenn (1.8)
├─ save/          Snapshot, Befehls-Log, Keyframes, Migrationen, kanonische Serialisierung, Hash (1.10)
└─ index.ts       öffentliche SimApi
```

### 0.3 Abhängigkeitsrichtung

```
L7  index.ts · projection/ · save/
L6  time/ · commands/
L5  events/ · crisis/ · scoring/
L4  offers/ · acquisition/ · sale/ · bank/ · player/ · lease/ · opex/ · weg/ · building/ · insurance/ · tax/
L3  calc/ · valuation/                       (zustandsfrei: Eingaben → Ergebnis + Erklärung)
L2  macro/ · region/ · rules/ · ledger/
L1  params/ · world/
L0  kernel/
```

- **MUSS:** Importe nur nach unten. Zyklen verboten. CI prüft das (dependency-cruiser oder Biome-Importregeln; → 22 §9).
- **MUSS:** Engines derselben Ebene L4 importieren voneinander **nur** die exportierten Selektoren (`<engine>/select.ts`,
  rein lesend) und Typen. Schreiben dürfen sie nur den eigenen Teilbaum des Zustands, Geld nur über `ledger.post()`,
  Folgen für andere Engines nur über **Domain-Events** an die Pipeline (z. B. `MIETVERTRAG_BEENDET` → `opex` stellt
  Zwischenablesung ein).
- **MUSS:** `calc/` und `valuation/` sind reine Funktionen ohne Zustandszugriff; sie sind die einzigen Module, die das UI
  synchron im Main-Thread aufrufen darf (Live-Rechnung in Formularen, → 22 §3.1).
- **Engine-Vertrag** (jede L4/L5-Engine):

```ts
interface Engine {
  id: EngineId;                                       // 'lease', 'bank', …
  schritte: Partial<Record<PipelineSchritt, (ctx: SchrittKontext) => void>>; // 1.5
  befehle: Partial<Record<CommandType, CommandHandler>>;                     // 1.4
  reaktionen: Partial<Record<DomainEventType, (ctx: SchrittKontext, e: DomainEvent) => void>>;
  invarianten: Array<(s: GameState) => InvariantVerletzung | null>;          // 3
}
interface SchrittKontext {
  readonly s: Readonly<GameState>;      // Lesesicht (vor dem Schritt)
  draft: Draft<GameState>;              // lokale Kopie, nur eigener Teilbaum beschreibbar (Dev-Proxy prüft)
  monat: MonthIndex;
  rng: RngFabrik;                       // 1.6
  p: ParamSicht;                        // 1.7, bereits für Monat/Region auflösbar
  regeln: RegelSicht;                   // 2.14
  ledger: LedgerSchreiber;              // 1.3
  emit(e: DomainEvent): void;           // an Pipeline und Chronik
  post(n: Nachricht): void;             // Posteingang (2.15)
  plane(t: Termin): void;               // Zeitplan-Queue (1.5)
}
```

- **Öffentliche API** (verfeinert gegenüber → 22 §3.7; Fachbegriffe deutsch, technische Verben englisch):

```ts
export interface SimApi {
  newGame(input: NeuesSpiel, daten: DatenPaket): GameState;
  validate(s: GameState, cmd: Command): Validierung;              // ohne Anwendung (Buttons, Formulare)
  apply(s: GameState, cmd: Command): ApplyResult;                 // validiert + wendet an + Events
  advance(s: GameState, modus: WeiterModus): AdvanceResult;       // 1.5
  undo(s: GameState): GameState | UndoVerweigert;                 // 1.10
  preview(s: GameState, plan: WasWaereWenn): Projektion;          // nie mit Spiel-RNG (1.6, 1.9)
  project<K extends ProjektionsTyp>(s: GameState, k: K, a: ProjArgs<K>): ViewModel<K>;
  explain(s: GameState, ref: KennzahlRef): Erklaerung;            // 1.8
  hash(s: GameState): { gesamt: string; jeEngine: Record<EngineId, string> };
  save(s: GameState): SaveEnvelope;  load(e: SaveEnvelope, daten: DatenPaket): GameState | LadeFehler;
}
```

---

## 1. Querschnitt

### 1.1 Grundtypen, Rundung, Kalender

```ts
type Cents  = number & { readonly __b: 'Cents' };  // Integer, Number.isSafeInteger; ±9·10^15 Cent
type Bp     = number & { readonly __b: 'Bp' };     // Basispunkte: 1 bp = 0,01 %; 10_000 = 100 %
type Qm100  = number & { readonly __b: 'Qm100' };  // Fläche in 1/100 m² (Integer)
type CentProQm = number & { readonly __b: 'CentProQm' }; // z. B. 1.862 = 18,62 €/m²
type MonthIndex = number;                          // jahr * 12 + (monat − 1); Nov. 2026 = 24.322
```

- **MUSS:** Zustand, Buchungen und Parameter enthalten nur Integer. Zwischenrechnungen dürfen Float sein (nur `+ − × ÷`,
  `Math.sqrt/floor/round/imul`, `detmath`). Gerundet wird **nur an Buchungsstellen** nach zentral benannten Regeln:

| Buchungsstelle | Regel | Status |
|---|---|---|
| Monatszins Darlehen | `roundHalfAwayFromZero(restschuld × sollzinsBp / 10.000 / 12)` | [DES] (Bankpraxis variiert) |
| Tilgung | `rate − zins`; letzte Rate = Restschuld + Zins | [ABG] → 10 §K22 |
| Miete, Index-/Staffelmiete, Umlage § 559 | Cent, kaufmännisch | [DES] |
| BK-Anteil je Mieter | Cent, kaufmännisch; Rundungsdifferenz trägt der Eigentümer | [DES] |
| Grunderwerbsteuer | auf volle Euro abrunden | [GES] (§ 11 Abs. 2 GrEStG, vom Strang W zu bestätigen, LR-09) |
| Einkommensteuer | zvE und Steuerbetrag auf volle Euro abrunden (`floorToEuro`) | [GES] (§ 32a, LR-21) |
| AfA | Jahresbetrag in Cent; Teiljahr in vollen Monaten (n/12) | [GES] (LR-25) |
| Konto-/Dispozinsen | auf den Monatsend-Saldo | [DES] (Vereinfachung) |

- **Kalender:** Der Kern kennt nur Monate. Tagesgenaue Rechtsfristen werden auf Monate abgebildet; die Abbildung ist je
  Regel dokumentiert. Beispiele: Zugang eines Mieterhöhungsverlangens im Monat *t* ⇒ Wirksamkeit „Beginn des dritten
  Kalendermonats nach Zugang“ = *t+3* (§ 558b BGB, → 12 §1.4); Indexanpassung „übernächster Monat“ = *t+2* (§ 557b);
  Nutzen-Lasten-Wechsel immer am Monatsersten. Quartalstermine (Grundsteuer 15.2./5./8./11., ESt-Vorauszahlung
  10.3./6./9./12.) fallen in den jeweiligen Monat.
- **Zeitmodell:** rundenbasiert, Takt = 1 Monat. Spieleraktionen sind Befehle **zwischen** Monatsabschlüssen.
  Es gibt keine Echtzeit und keine Tagesticks (Lehre aus → 01 §2).

### 1.2 Zustand (GameState-Skizze)

Der Zustand ist **normalisiert** (Entitäten in `Record<Id, …>`), damit 50+ Objekte, Massenaktionen und Teil-Hashes je Engine
effizient sind. Texte stehen nie im Zustand, nur Codes und Parameter (Übersetzung im UI, → 22 §3.6).

```ts
interface GameState {
  meta: {
    schemaVersion: number; rulesVersion: string; dataVersion: string; paramPackHash: string;
    seed: string;                                   // 128 Bit hex
    szenarioId: string; modus: 'FREI' | 'SZENARIO' | 'TUTORIAL';
    schwierigkeit: SchwierigkeitsId; ironman: boolean; lernmodus: boolean;
    startMonat: MonthIndex; endMonat?: MonthIndex;
    eingefroreneParameter: ParamSnapshot;           // 1.7 – aufgelöste Werte, mit denen dieser Spielstand rechnet
  };
  uhr: { monat: MonthIndex; befehlNr: number; undoBarriere: number };
  welt: { regionen: Record<Ars, RegionStatisch> };  // beim Spielstart kopierte, spielrelevante Gebietsparameter (→ 22 §4.3)
  makro: MakroZustand;                              // 2.1
  regionen: Record<KreisArs, RegionZustand>;        // 2.2 (401 Kreise, dynamisch)
  regeln: { politik: Record<PolitikId, PolitikInstanz>; szenarioOverrides: RegelOverride[] }; // 2.14
  markt: { angebote: Record<AngebotId, Angebot>; suchprofile: Record<SuchprofilId, Suchprofil>;
           beobachtet: KreisArs[]; prognosen: Record<PrognoseId, NpcPrognose> };            // 2.3, 2.2
  deals: Record<DealId, Deal>;                      // 2.4 Kaufvorgänge
  verkaeufe: Record<VerkaufId, Verkaufsvorgang>;    // 2.16
  spieler: Spieler;                                 // 2.7 Haushalt, Personen, Zeitbudget, Wissen, Netzwerk
  rechtstraeger: Record<RtId, Rechtstraeger>;       // PRIVAT (1–2 Personen), GMBH, HOLDING (2.7, 2.13)
  konten: Record<KontoId, Konto>;                   // 1.3
  journal: Journal;                                 // 1.3 Buchungen (Detail: laufendes + 2 Vorjahre), Aggregate
  objekte: Record<ObjektId, Objekt>;                // Grundstück + Gebäude + Bauteile (2.11), Lage, Rechtsraum
  einheiten: Record<EinheitId, Einheit>;            // Wohnung/Gewerbe/Stellplatz; SE/GE-Zuordnung
  mietvertraege: Record<MvId, Mietvertrag>;         // 2.8
  mieter: Record<MieterId, Mieter>;                 // 2.8 (sichtbare + latente Merkmale)
  bewerber: Record<BewerberId, Bewerber>;           // 2.8 (nur während Vermarktung)
  wegs: Record<WegId, Weg>;                         // 2.10 inkl. NPC-Eigentümer, Rücklage, Beschlüsse
  dienstleister: Record<DlId, Dienstleister>;       // Verwaltung, SEV, Handwerker, Gutachter, Anwalt, StB
  projekte: Record<ProjektId, Bauprojekt>;          // 2.11 Renovierung/Modernisierung
  policen: Record<PoliceId, Police>;                // 2.12
  schaeden: Record<SchadenId, Schadenfall>;         // 2.12
  banken: Record<BankId, Bank>;                     // 2.6 Profile (beim Start aus Spannen gezogen)
  kreditantraege: Record<AntragId, Kreditantrag>;
  darlehen: Record<DarlehenId, Darlehen>;
  grundschulden: Record<GsId, Grundschuld>;
  abrechnungen: Record<NkaId, Nebenkostenabrechnung>; // 2.9
  steuer: { jahre: Record<number, Steuerjahr>; verlustvortrag: Record<RtId, Cents>;
            bescheide: Record<BescheidId, Bescheid> };                                // 2.13
  ereignisse: { aktiv: Record<EvInstId, EreignisInstanz>; cooldowns: Record<string, MonthIndex> }; // 2.15
  posteingang: Record<NachrichtId, Nachricht>;
  termine: TerminQueue;                             // 1.5 Zeitplan (wirksame Mietänderungen, Fristabläufe, NLW …)
  krise: Krisenzustand;                             // 2.17
  ziele: { meilensteine: Record<MeilensteinId, MeilensteinStatus>; checkpointsGenutzt: number }; // 2.18
  historie: KennzahlenHistorie;                     // spaltenorientiert: Monatswerte je Objekt/Portfolio (Int32)
  wissen: Record<WissensKey, Wissensstand>;         // 1.9 – was der Spieler über verdeckte Merkmale weiß
}
```

Verdeckte Merkmale liegen **im selben Entitätsobjekt** unter `wahr` (z. B. `Angebot.wahr`, `Mieter.latent`,
`Bauteil.zustandWahr`); die Sicht des Spielers ergibt sich nur aus `wissen` (1.9). `projection/` erhält keinen Zugriff auf
`wahr`-Felder (Typ-Trennung, 1.9).

### 1.3 Hauptbuch (Ledger) – die eine Wahrheit für Geld

Jede Geldbewegung ist eine **Buchung**. Kontostände sind die Summe der Buchungen. Cashflow-Kaskade (Ist), Steuer
(Zufluss/Abfluss), Nebenkostenabrechnung, Kontoauszug und Scoring lesen ausschließlich das Hauptbuch.

```ts
interface Buchung {
  id: BuchungId; monat: MonthIndex; konto: KontoId; gegen: KontoId | 'EXTERN';
  betrag: Cents;                      // Vorzeichen aus Sicht von `konto`
  art: BuchungsArt;                   // steuert alle Auswertungen (Tabelle unten)
  rt: RtId;                           // Rechtsträger (privat / GmbH / Holding) – getrennte Kassen
  objekt?: ObjektId; einheit?: EinheitId; mv?: MvId; darlehen?: DarlehenId; projekt?: ProjektId;
  betrkvNr?: BetrKVNr;                // bei Betriebskosten: Position § 2 BetrKV
  ustAnteil?: Cents;                  // für 15-%-Prüfung „netto“ (2.13)
  ursache: UrsacheRef;                // Befehl, Pipeline-Schritt, Ereignis → für Erklärung & Chronik
}
```

| Kontoklasse | Beispiele | Hinweis |
|---|---|---|
| liquide (Aktiva) | Girokonto privat, Tagesgeld, Depot (Kurswert), GmbH-Konto | Dispo nur am Girokonto |
| Treuhand | Kautionskonto je Mietvertrag | **nie** Spielerliquidität (INV-24) |
| Forderungen | Mietrückstände, Erstattungsansprüche (Steuer, Versicherung), Stundungen | für Scoring und Krise |
| Verbindlichkeiten | Darlehen (Restschuld), offene Rechnungen, Steuerschulden | Darlehen werden nur von `bank/` gebucht |
| kalkulatorisch | „Rücklagen-Unterkonto“ (freiwillig vom Spieler gebildet) | reine Umbuchung, kein Aufwand |

**Buchungsarten** (Auszug; vollständiger Katalog in `ledger/arten.ts`). Jede Art trägt drei Klassifikationen:

| BuchungsArt | Cashflow-Stufe (→ 10 §1.7) | Steuer (→ 11 §1.1–1.3) | Umlage (→ 12 §2) |
|---|---|---|---|
| MIETE_KALT | operativ | Einnahme V+V (Zufluss) | – |
| BK_VORAUSZAHLUNG, BK_NACHZAHLUNG_EIN | operativ (durchlaufend) | Einnahme V+V | Gegenstück NKA |
| BK_GUTHABEN_AUS | operativ | Einnahme mindernd | NKA |
| BK_LIEFERANT (je BetrKV-Nr.) | operativ | WK sofort | Prüfkette 2.9 |
| HAUSGELD_UMLAGEF / HAUSGELD_NICHT_UMLAGEF | operativ | WK sofort | Übersetzung 2.10 |
| HAUSGELD_RUECKLAGE_ZUFUEHRUNG | operativ | **[GES]** nicht sofort abziehbar (LR-31) | nie |
| SONDERUMLAGE | operativ | nach Verwendung (Erhaltung/Modernisierung) | nie |
| VERWALTUNG, VERMARKTUNG, RECHTSKOSTEN | operativ | WK sofort | nie |
| INSTANDHALTUNG | operativ | WK sofort **oder** 15-%-Fall | nie |
| MODERNISIERUNG, ANSCHAFFUNG_GEBAEUDETEIL | Investition | 15-%-Prüfung / Herstellungskosten | § 559-Basis |
| VERSICHERUNG_PRAEMIE / _LEISTUNG | operativ | WK / Einnahme | Nr. 13 wenn umlagefähig |
| GRUNDSTEUER | operativ | WK sofort | Nr. 1 |
| ZINS_DARLEHEN, BEREITSTELLUNGSZINS | Finanzierung | WK sofort | nie |
| TILGUNG, SONDERTILGUNG | Finanzierung | nicht abziehbar | nie |
| VORFAELLIGKEITSENTSCHAEDIGUNG | Finanzierung | **[GES]** Veräußerungskosten (LR-29) | nie |
| KAUFPREIS (Gebäude/Boden getrennt) | Investition | AK Gebäude → AfA / AK Boden | nie |
| GREST, NOTAR_GRUNDBUCH, MAKLER_KAUF | Investition | **[GES]** anteilig AK (LR-24) | nie |
| VERKAUFSERLOES, VERKAUFSKOSTEN | Investition | § 23 / GmbH-Gewinn | nie |
| GEHALT_NETTO, LEBENSHALTUNG, EIGENE_WOHNKOSTEN | privat | außerhalb V+V | – |
| EST_NACHZAHLUNG / EST_ERSTATTUNG, KST, GEWST | Steuer | – | – |
| DISPOZINS, GUTHABENZINS | privat | privat / Kapitalerträge [DES: nicht besteuert] | – |
| KAUTION_EIN / KAUTION_AUS | Treuhand | neutral | – |
| FOERDERZUSCHUSS | Investition | mindert AK/Erhaltungsaufwand [GES] | mindert § 559-Basis |

**Invarianten (MUSS, nach jedem Befehl und jedem Pipeline-Schritt im Dev-/Test-Modus):**
Σ Buchungen je Konto = Saldo; jede Buchung hat genau eine BuchungsArt und einen Rechtsträger; Geld entsteht nur über
definierte externe Quellen (Gehalt, Miete, Darlehensauszahlung, Verkauf, Erstattung, Förderung, Versicherungsleistung);
Treuhandkonten fließen nie in Liquiditätskennzahlen.

### 1.4 Befehle

**Lebenszyklus:** `validate` (Ressourcen, Zustand, Recht) → bei Fehler `Validierung{ok:false, gruende:[Code…]}` mit
erklärbaren Gründen → `apply` (Zustandsänderung, Buchungen, Termine, Domain-Events) → Eintrag im Befehls-Log.
Jeder Befehl hat Kosten in **Aktionspunkten (AP, [DES], 2.7)** und ggf. Geld. Befehle mit **Informationsgewinn** oder
**Gegenreaktion eines Akteurs** (Besichtigung, Gutachten, Kaufangebot, Bankanfrage, Mieterhöhungsverlangen) sind
`irreversibel` und setzen eine **Undo-Barriere** (1.10) – sonst wäre Information per Undo gratis (INV-06).

```ts
interface CommandBase { type: CommandType; id: CmdId; monat: MonthIndex; }   // id deterministisch: monat + befehlNr
interface CommandDef<C> {
  validate(s: GameState, c: C, p: ParamSicht): Validierung;
  apply(ctx: SchrittKontext, c: C): void;
  kosten(s: GameState, c: C): { ap: number; geld: Cents };
  irreversibel: boolean | ((s: GameState, c: C) => boolean);
  phase: Phase;
}
```

**Befehlskatalog** (Auszug, verbindlich als Mindestumfang je Phase; Details im jeweiligen Engine-Abschnitt):

| Bereich | Befehl | Validierung (Auszug) | Effekte | AP/Geld | Undo | Phase |
|---|---|---|---|---|---|---|
| Suche | `regionBeobachten(ars)` / `regionEntfernen` | max. N beobachtete Kreise [DES]; Gebiet bewohnt | Angebotsstrom für Region startet nächste Runde | 0 | ja | P3 |
| Suche | `suchprofilSetzen(profil)` | Objektarten freigeschaltet | filtert Angebote, steuert Off-Market-Hinweise | 0 | ja | P3 |
| Suche | `angebotVerwerfen(id, begruendung)` | – | Entscheidungslog (Meilenstein „begründete Absage“) | 0 | ja | P3 |
| Akquise | `dealStarten(angebotId)` | Angebot aktiv | Deal in SICHTUNG | 0 | ja | P3 |
| Akquise | `pruefschritt(dealId, schritt)` | Reihenfolge-Gates (2.4), AP, Geld | deckt Merkmale gemäß Aufdeckungsmatrix auf | je Schritt | **nein** | P3 |
| Akquise | `kaufangebot(dealId, preis, bedingungen)` | Unterlagen-/Finanzierungsstand frei wählbar (Risiko trägt Spieler) | Verkäuferreaktion nächste Runde (2.4) | 1 AP | **nein** | P3 |
| Akquise | `kaufvertragGestalten(dealId, aufteilung, inventar, nlw)` | Einigung erzielt | Vertragsentwurf; Aufteilung → Steuer | 1 AP | ja | P3/P4 |
| Akquise | `beurkunden(dealId)` | Liquidität für KNK; Warnung ohne Zusage | KNK fällig, Fristen starten | 1 AP | **nein** | P3 |
| Akquise | `dealAbbrechen(dealId, grund)` | vor Beurkundung frei; danach Rücktrittsfolgen | Deal ABGELEHNT/Vertragsstrafe | 0 | nein | P3 |
| Bank | `kreditanfrage(ziel, banken \| 'VERMITTLER', wunsch)` | Unterlagen (Rückfrage sonst) | Entscheidung nach Bearbeitungsdauer (2.6) | 2/1 AP | **nein** | P3 |
| Bank | `kreditangebotAnnehmen(angebotId)` | Angebot gültig | Darlehen + Grundschuld angelegt, Auszahlung bei Fälligkeit | 1 AP | ja (vor Auszahlung) | P3 |
| Bank | `sondertilgung(darlehenId, betrag)` | ≤ Sondertilgungsrecht; sonst nur mit VFE | Restschuld ↓ | 0 | ja | P3/P5 |
| Bank | `anschlussWaehlen(darlehenId, option)` | Fenster offen (2.6) | Prolongation/Umschuldung/Forward/Ablösung | 1 AP | ja | P5 |
| Bank | `nachbeleihung(objektId, betrag)` | freier Beleihungsraum; Haushaltsrechnung | neues Darlehen [GES-Mechanik] | 2 AP | **nein** | P5 |
| Bank | `bonitaetPflegen(aktion)` | – | SCHUFA prüfen, Dispo/Kreditkarte kündigen (Haushaltsrechnung) | 1 AP | ja | P3 |
| Vermietung | `inserieren(einheitId, miete, mietart, klauseln)` | Mietpreisbremse/§ 5 WiStrG (Warnung/Block) | Einheit INSERIERT | 1 AP | ja | P3 |
| Vermietung | `bewerberPruefen(id, pruefungen[])` | Einwilligung (DES), AP | deckt Merkmale auf | 0,5 AP je Prüfung | **nein** | P3 |
| Vermietung | `mietvertragSchliessen(einheitId, bewerberId, vertrag)` | Obergrenzen, Kaution ≤ Grenze | Vertrag, Mietbeginn-Termin | 1 AP | ja | P3 |
| Vermietung | `mieterhoehung(mvId, art, betrag, begruendung)` | Fristen, Kappung, Mietart (2.8) | Verlangen zugestellt, Antwort t+2 | 1 AP | **nein** | P4 |
| Vermietung | `mahnen / stundungVereinbaren / kuendigen / raeumungsklage(mvId, …)` | Rückstand, Stufe, Rechtslage | Eskalationspfad (2.8) | 0,5–2 AP + Kosten | **nein** | P4 |
| Betrieb | `nkaErstellen(objektId, jahr)` / `nkaDelegieren` | Periode abgeschlossen | Abrechnung, Zugang, Fristen (2.9) | 3 AP / Gebühr | **nein** | P4 |
| Betrieb | `vorauszahlungAnpassen(mvId, betrag)` | nach Zugang NKA | ab nächstem Monat | 0,5 AP | ja | P4 |
| Betrieb | `verwaltungBeauftragen(objektId, rolle, dlId)` / `kuendigen` | Vertragslaufzeit [DES] | Delegationsmatrix (2.10) | 1 AP | ja | P4 |
| WEG | `wegAbstimmen(beschlussId, stimme)` | ETV offen | Stimme nach MEA (2.10) | 1 AP | ja (bis ETV) | P4 |
| Gebäude | `massnahmePlanen / angeboteEinholen / beauftragen(projekt)` | Duldung/Ankündigung (2.11), Liquidität | Projekt, Kosten, Dauer, Umlagebasis | 1–2 AP | Beauftragung **nein** | P4 |
| Gebäude | `modernisierungAnkuendigen / umlageErklaeren(projektId)` | § 559-Voraussetzungen, Kappung | Mieterhöhung zum Termin | 1 AP | **nein** | P4 |
| Versicherung | `policeAbschliessen / kuendigen / schadenMelden` | Objekt, Deckung | Prämie, Deckung, Regulierung | 0,5–1 AP | ja / **nein** | P4 |
| Steuer | `steuererklaerungAbgeben(jahr, mitStB)` | Jahr abgeschlossen | Bescheid nach Bearbeitungsdauer (2.13) | 3 AP / Honorar | **nein** | P4 |
| Steuer | `rndGutachten`, `gmbhGruenden`, `ausschuetten`, `kuerzungBeantragen` | Freischaltung | 2.13 | variabel | **nein** | P7 |
| Verkauf | `verkaufStarten(objektId, kanal, preis)` / `preisAendern` / `angebotAnnehmen` / `abbrechen` | Objekt im Bestand, keine Sperre | Verkaufsprozess (2.16) | 1 AP | Annahme **nein** | P5 |
| Spieler | `umbuchen(von, nach, betrag)`, `lebenshaltungAnpassen`, `depotVerkaufen` | Grenzen [DES] | Liquidität | 0 | ja | P3 |
| Spieler | `weiterbildung(modul)`, `netzwerkPflegen(kontakt)`, `nebenjob(an/aus)` | Geld/AP | Wissen, Netzwerk, Einkommen | variabel | ja | P5 |
| Ereignis | `ereignisoption(instanzId, optionId)` | Option zulässig, Frist offen | Folgen laut Katalog (2.15) | laut Option | laut Option | P3 |
| Meta | `checkpointSetzen()` | nur Lernmodus | Keyframe (1.10) | 0 | – | P6 |

### 1.5 Monats-Pipeline

Ein Aufruf „Weiter“ führt für den aktuellen Monat *t* den **Abschluss** (Teil A: Flüsse und Zustände von *t*) und danach die
**Eröffnung** von *t+1* (Teil B: neue Umwelt, Termine, Angebote, Posteingang) aus. Der Zustand „Monat *t*“ ist also immer:
Umwelt von *t* bekannt, Entscheidungsfenster offen. Die Reihenfolge ist **verbindlich** und Teil der `rulesVersion`.

**Teil A – Abschluss Monat t**

| Nr. | Schritt | Engine | Inhalt | RNG-Strom |
|---|---|---|---|---|
| A01 | Einkommen & Lebenshaltung | player | Nettogehalt(er), sonstige Einkünfte, Lebenshaltung, eigene Wohnkosten, bestehende Privatkredite | `PLAYER` |
| A02 | Mieteingänge | lease | je Mietvertrag Sollmiete + BK-Vorauszahlung → Zahlungswurf nach Mieterzustand → Ist-Buchung, Rückstände | `PAYMENT` |
| A03 | Objekt- & Betriebskosten | opex, weg, insurance | Hausgeld, BK an Versorger, nicht umlagefähige Kosten, Verwaltung, fällige Prämien, Grundsteuer (Feb/Mai/Aug/Nov), Leerstandsanteile | – |
| A04 | Gebäude | building, insurance | Alterung, Ausfall-/Schadenswürfe, Projektfortschritt + Abschlagszahlungen, Schadenregulierung | `BUILDING`, `INSURANCE` |
| A05 | Kapitaldienst | bank | Zins, Tilgung, Bereitstellungszins, Sondertilgungen, Auszahlungen fälliger Darlehen | – |
| A06 | Mieter-Lebenszyklus | lease | Fluktuation/Kündigungen, Verzugseskalation, Vermarktung → Bewerber, Auszüge, Kautionsabrechnung | `TURNOVER`, `TENANT` |
| A07 | Kaufvorgänge | acquisition, bank | Fortschritt, Verkäuferreaktionen, Wegkauf durch Konkurrenz, fällige Bankentscheidungen, Kaufpreisfälligkeit | `NEGOTIATION`, `COMPETITION`, `BANK` |
| A08 | Verkaufsvorgänge | sale | Interessenten, Gebote, Vollzug, Darlehensablösung | `SALE` |
| A09 | WEG | weg | ETV-Termine, Beschlüsse, Sonderumlagen, Jahresabrechnung (Saison) | `WEG` |
| A10 | Ereignisse | events, rules | Hazard-/Zustands-/Timer-Auslöser, Politik-Phasen, Ereignisinstanzen erzeugen | `EVENTS`, `POLICY` |
| A11 | Steuerzahlungen | tax | fällige Bescheide, Vorauszahlungen (Mrz/Jun/Sep/Dez), GmbH-Steuern | – |
| A12 | Kontozinsen | ledger, bank | Guthabenzins, Dispozins auf Monatsend-Saldo | – |
| A13 | Liquidität & Krise | crisis | Dispo-Grenze, Rücklastschriften nach Priorität, Mahnstufen, Frühwarnstufe, Verwertungsfolgen | `CRISIS` |
| A14 | Monatsabschluss | ledger, scoring | Invarianten, Monatsaggregate (Historie), Meilensteine, Monatsbericht | – |
| A15 | **nur Dezember:** Jahresabschluss *j* | tax, opex, weg, building, scoring | Steuerjahr vorläufig schließen (AfA, 15-%-Prüfung, § 23-Freigrenze), NKA-Perioden schließen → Aufgaben, WEG-Jahresabrechnung planen, Bauteilplan, Jahres-Meilensteine, Keyframe | – |

**Teil B – Eröffnung Monat t+1**

| Nr. | Schritt | Engine | Inhalt | RNG-Strom |
|---|---|---|---|---|
| B01 | Kalender & Rechtsstand | time, rules, params | `monat = t+1`; im Januar neuen Rechtsjahrgang laden; Regeln mit `gueltig_ab = t+1` aktivieren; Politik-Phasenwechsel | `POLICY` |
| B02 | Makro | macro | nationaler Pfad *t+1* (Replay oder Modell) | `MACRO` |
| B03 | Regionen | region | Kreis-Indizes *t+1*, Vergleichsmiete, Leerstand, Prognose-Zeitung | `REGION` |
| B04 | Bankkonditionen | bank | Basiszinsen je Bindung, Spreads, zyklische Profilparameter | `BANK` |
| B05 | **nur Januar:** Jahreseröffnung | player, bank, lease, tax | Gehaltsanpassung, Lebenshaltung indexieren, Sondertilgungsrechte erneuern, Steuererklärungs-Aufgabe *j−1*, II.-BV-/Pauschalen laut Jahrgang | `PLAYER` |
| B06 | Termine | time (alle) | fällige Termine aus der Queue in fester Ordnung: Wirksamkeiten (Miete, Umlage, Vorauszahlung) → Vertragsbeginne/-enden → Zinsbindungsenden (Standardoption) → NLW → Fristabläufe (Standardoptionen) | – |
| B07 | Angebotsmarkt | offers | Verfall, Preissenkungen, neue Angebote je beobachteter Region und Suchprofil, Off-Market-Hinweise | `OFFERS`, `OFFER_TRUTH` |
| B08 | Posteingang & Zeit | events, player | AP-Budget auffrischen, Erinnerungen, offene Entscheidungen, Stoppbedingungen auswerten | – |
| B09 | Sicherung | save | Undo-Snapshot (Monatsanfang), Autosave-Signal | – |

**„Weiter“-Modi.** `{ typ: 'MONAT' }` · `{ typ: 'BIS_EREIGNIS' }` · `{ typ: 'BIS_DATUM', ziel: MonthIndex }`.
Stoppbedingungen nach B08 (jede stoppt jeden Modus außer `MONAT`): neue Nachricht mit `stoppt: true` (Entscheidung mit
Frist ≤ 1 Monat, Kaufvorgang braucht Eingabe, Bankangebot, Bescheid mit Nachzahlung), Frühwarnstufe ≥ ORANGE (2.17),
Szenario-Meilenstein. Nicht stoppende Entscheidungen laufen bis zur Frist und lösen dann ihre **Standardoption** aus
(z. B. Mieterhöhungsfenster ungenutzt = keine Erhöhung; Zinsbindungsende ohne Wahl = variable Anschlusskondition, 2.6).

**MUSS:** `advance(BIS_DATUM, t+n)` ohne Stopp ist bitgleich zu *n* × `advance(MONAT)` (INV-22).

### 1.6 Zufall (RNG-Ströme)

Zählerbasierte Ableitung statt eines fortlaufenden Generators (→ 22 §3.3):

```ts
u = hash128to32(seed, strom, monat, entitaetSchluessel, k) / 2^32   // SplitMix-artig, nur Math.imul/Shifts
```

- **Strom-Registry** (append-only, IDs nie wiederverwenden): `MACRO`, `REGION`, `POLICY`, `OFFERS` (Anzahl/Art neuer
  Angebote), `OFFER_TRUTH` (verdeckte Wahrheit eines Angebots), `EXPOSE` (Schönung), `NEGOTIATION`, `COMPETITION`, `BANK`
  (Profilziehung beim Start, Bearbeitungsdauer), `TENANT` (Bewerber), `PAYMENT`, `TURNOVER`, `BUILDING`, `INSURANCE`, `WEG`,
  `EVENTS`, `TAX_AUDIT`, `SALE`, `PLAYER` (Lebensereignisse, Gehalt), `CRISIS`, `PROGNOSE` (NPC-Prognosefehler), `SETUP`.
- **Schlüsselregel:** Jeder Wurf ist an `(strom, monat, entität, k)` gebunden. Ein neues Objekt verschiebt keine Würfe anderer
  Objekte; neue Ereignistypen verschieben keine anderen Systeme; jeder Monat ist ohne Replay reproduzierbar.
- **Wahrheit vor Blick:** Verdeckte Merkmale eines Angebots werden **bei seiner Erzeugung** aus `OFFER_TRUTH` gezogen
  (Schlüssel `angebotId`) und ändern sich durch Prüfen nicht. Prüfen deckt nur auf.
- **Undo kann nicht neu würfeln:** Gleicher Monat + gleiche Entität + gleicher Zähler ⇒ gleiches Ergebnis (INV-07).
- **Vorschau ohne Spielzufall:** `preview()` und Folgenvorschauen nutzen Erwartungswerte oder einen **eigenen** Vorschau-Seed
  (Hash aus Plan), nie den Spiel-Seed der Zukunft (INV-08).
- **Verteilungen** (`kernel/rng.ts`, nur `detmath`): Bernoulli(p in bp), Gleich, Dreieck(min, modus, max) – Standard für
  `[GES]`-Spannen, PERT, Normal (inverse CDF-Näherung mit `lnDet`/`sqrt`), Lognormal (`expDet`), Poisson (Inversion,
  λ < 30), Kategorial (Gewichte), korrelierte Normale (Cholesky, beim Laden berechnet).

### 1.7 Parameter-Registry, Status und Rechtsjahrgänge

```ts
interface ParamDef<T = number> {
  id: string;                         // 'bank.stresszins', 'lease.fluktuation.etw', 'knk.grest'
  wert: T | ParamZeitreihe<T> | ParamTabelle<T>;   // skalar, zeitabhängig oder je Region/Bank/Objekt
  einheit: Einheit;                   // 'bp' | 'cents' | 'centProQm' | 'monate' | 'jahre' | 'anzahl' | 'ap' | …
  status: 'BELEGT' | 'ABGELEITET' | 'GESCHAETZT' | 'DESIGN';
  sicherheit?: 'A' | 'B' | 'C';       // nur BELEGT/ABGELEITET aus Vault
  quellen: QuellenRef[];              // Vault-Notiz-ID / Q-ID / Datensatz-URI / Research-Abschnitt
  stand?: string;                     // ISO-Datum des inhaltlichen Stands
  gueltigAb?: string; gueltigBis?: string;
  regional?: 'KEIN' | 'LAND' | 'KREIS' | 'GEMEINDE' | 'BANK' | 'OBJEKT';
  spanne?: { min: T; modus?: T; max: T };   // Pflicht bei GESCHAETZT/DESIGN → Sensitivitätsanalyse (4.3)
  herleitung?: string;                // Pflicht bei ABGELEITET: Formel-ID + Eingangs-Param-IDs
  luecke?: string;                    // LR-ID bei GESCHAETZT
  vaultZiel?: string;                 // Zielnotiz/Datei im Vault (Strang W)
  extern?: { dok: '20'; abschnitt: string; sicherheitWeb: 'A' | 'B' | 'C' }; // [WEB→W]
  herkunft: 'VAULT' | 'SPIEL';
}
```

**Zusammenführung (Build-Zeit, `packages/data`):** Vault-Exportpaket (nur `[BEL]`/`[ABG]`) + Spiel-Parameter (`[GES]`/`[DES]`
und vom Spiel kalibrierte `[ABG]`) → `ParamPack` mit Hash. Regeln:

1. Liefert der Vault einen Wert für eine ID, **gewinnt der Vault** immer; der Build meldet „Lücke LR-nn geschlossen“.
2. Ein `[GES]`-Parameter ohne `spanne`, `luecke` und `vaultZiel` bricht den Build.
3. Ein `[BEL]`-Parameter mit `herkunft: 'SPIEL'` bricht den Build (nur der Vault belegt).
4. `[WEB→W]`-Werte sind `GESCHAETZT` mit Feld `extern`; die UI zeigt „extern belegt, Vault-Übernahme ausstehend“.

**Auflösung zur Laufzeit:** `p.get(id, { monat, ars?, bankId?, objektId? })` → Wert + `ParamRef` (für Erklärungen).
Zeitabhängige Werte nach `gueltigAb/Bis`, regionale über die Gebietskette (Gemeinde → Verband → Kreis → Land → DE).

**Versionen – drei Ebenen, sauber getrennt:**

| Ebene | Bedeutung | Wo | Wirkung |
|---|---|---|---|
| `rulesVersion` (z. B. `2026.3`) | Version von Engine-Logik + Pipeline-Reihenfolge + Regelwerk-Code | Save-Envelope | Replay des Befehls-Logs nur innerhalb gleicher `rulesVersion` garantiert (→ 22 §3.6) |
| `paramPackHash` / `dataVersion` | konkrete Parameter- und Datenwerte | Save-Envelope | Ein Spielstand rechnet mit **seinen eingefrorenen Werten** (`meta.eingefroreneParameter`); neues Paket nur auf Wunsch („Spielstand auf neue Daten aktualisieren“ → Log verliert Replay-Garantie) |
| **Rechtsjahrgang** (z. B. `DE-2026`) | in der Spielwelt geltendes Recht eines Steuer-/Rechtsjahres | Daten: `rules/jahrgaenge/<jahr>.json` + datierte Regeln (2.14) | wird im Januar (B01) bzw. zum `gueltig_ab` gewechselt |

Ein **Rechtsjahrgang** bündelt jahresgebundene Werte: ESt-Tarif (Eckwerte, Formel), Soli, Kirchensteuer-Optionen, AfA-Tabelle,
Freigrenze § 23, II.-BV-Sätze, CO₂-Preis bzw. -Korridor, Förderbedingungen, Pauschalen. Datierte regionale Regeln
(GrESt-Satz, Mietpreisbremse, Kappung, Solarpflicht) kommen aus dem Regelauflöser mit Stichtag.

**Jahre ohne belegtes Recht** (Freies Spiel ab 2027, historische Lücken): Jahrgang wird **fortgeschrieben** – Tarif-Eckwerte
mit der simulierten Inflation indexiert, alle anderen Werte konstant – Status `[DES]` „Fortschreibung“; bekannte Vorhaben
(ESt-Reform 2027, Mietrecht II, CO₂ 2027, BEG-Abschmelzung, Ende Mietpreisbremse 2029) laufen als Politik-Ereignisse mit
Ankündigung und Gabelung (2.14). Historische Szenarien brauchen belegte historische Jahrgänge (LR-22, LR-40).

### 1.8 Projektionen und Erklärung

Der Worker liefert dem UI **View-Models**, nie den Gesamtzustand (→ 22 §3.1). Mindestkatalog:

| Projektion | Inhalt | Phase |
|---|---|---|
| `hud` | Datum, Liquidität, Frühwarnstufe, Nettovermögen (Spielersicht), Cashflow Monat, Zins 10 J., AP | P3 |
| `monatsbericht` / `kontoauszug` | Buchungen gruppiert nach Cashflow-Stufe, Objekt, Ursache | P3 |
| `angebotsliste`, `angebotDetail` | nur Exposé + aufgedecktes Wissen mit Wissensstand-Badges | P3 |
| `dealRechner` | Kaufnebenkosten, Kapitalbedarf, Finanzierung, Kaskade Jahr 1, Bierdeckel 1/2, Break-even-Rendite | P3 |
| `bankpruefung` | eigene Rechnung vs. Bankrechnung (P0–P9) mit Begründungscodes | P3 |
| `portfolio` | Tabelle (50+ Objekte): Wert, Restschuld, Beleihung, CF-Stufen, Zinsbindungsende, Leerstand | P3/P5 |
| `objektDetail`, `einheitDetail`, `mieterDetail` | Mietverlauf, Fristen, Rückstände, Bauteilplan | P3/P4 |
| `darlehen` + `zinsbindungskalender` | Tilgungsplan, Restschuld zum Bindungsende, Anschluss-Szenarien | P3/P5 |
| `steuerjahr` | Anlage-V-artige Aufstellung je Objekt, AfA, 15-%-Status, § 23-Fristen | P4 |
| `nka`, `weg`, `bauteilplan` | Abrechnung mit Prüfkette, Hausgeld-Übersetzer, Fälligkeiten | P4 |
| `marktRegion` / `karte` | Kreis-Indizes, Lageklasse, Regeln, Datenpunkt-Badges, Choropleth-Arrays | P2/P3 |
| `posteingang`, `fristen` | Nachrichten, Entscheidungen, Fristenkalender | P3 |
| `risiko` | Liquiditätsreichweite, Stresstests (→ 14 §3.6 Nr. 10), Klumpen, gleichzeitige Bindungsenden | P5 |
| `ziele`, `chronik` | Meilensteine, Score, Ereignisverlauf | P3/P6 |
| `quellen` / `parameter` | Datenquellen & Lizenzen; alle Parameter mit Status | P3/P8 |

**Erklärung (Erklär-Karte der UI).** Jede Kennzahl ist ein `Kennzahl<T>`:

```ts
interface Kennzahl<T> {
  id: KennzahlId; wert: T; einheit: Einheit;
  bezug: 'MONAT' | 'JAHR' | 'STICHTAG';             // Monats- und Jahreswerte nie mischen (→ 10 §0.4)
  art: 'PLAN' | 'IST';                              // Prognose vs. Buchung, immer getrennt
  status: StatusAggregat;                           // schwächstes Glied der Eingaben (s. u.)
  erklaerung?: Erklaerung;                          // lazy: nur auf Anforderung (explain)
}
interface Erklaerung {
  formelId: string;                                 // z. B. 'K26' → 10 §1.7; Formeltext-Key für i18n
  eingaben: Array<{ name: string; wert: number; einheit: Einheit;
                    herkunft: ParamRef | KennzahlRef | ZustandRef | BuchungsSumme;
                    status: Status; wissensstand?: Wissensstand }>;
  schritte: Erklaerung[];                           // Baum, z. B. CF n. Fin. ← op. CF ← Miete, Kosten
  quellen: QuellenRef[]; hinweise: HinweisCode[];   // 'VEREINFACHUNG_OHNE_SOLI', 'LUECKE_LR_21', …
}
```

- **Tracer statt Doppelcode:** Jede `calc/`-Funktion nimmt optional einen `Tracer`. Im Pipeline-Lauf ist er ein No-op
  (keine Kosten); `explain()` ruft dieselbe Funktion mit aufzeichnendem Tracer auf. So kann die Erklärung nie vom Ergebnis
  abweichen.
- **Status-Aggregation:** `BELEGT > ABGELEITET > GESCHAETZT`; das Aggregat ist das Minimum aller Eingaben.
  Zusätzlich Flags `enthaeltDesign` und `enthaeltUnbekannt` (Wissensstand UNBEKANNT/SCHÄTZUNG). Die UI zeigt
  „enthält geschätzte Werte“ bzw. „enthält Spielmechanik“.
- **PLAN vs. IST:** IST-Kennzahlen kommen nur aus dem Hauptbuch; PLAN-Kennzahlen aus `calc/` mit Spielerannahmen.
  Beides nebeneinander ist ein Lernziel (→ 01 §8 Nr. 13).

### 1.9 Sichtbare und verdeckte Wahrheit – Information als Ressource

```ts
type Wissensstand =
  | { stufe: 'UNBEKANNT' }
  | { stufe: 'ANGABE'; quelle: 'EXPOSE' | 'VERKAEUFER' | 'MAKLER' | 'MIETER'; wert: number }      // Parteivortrag
  | { stufe: 'SCHAETZUNG'; spanne: [number, number]; basis: 'REGION' | 'TYP' | 'BESICHTIGUNG' }
  | { stufe: 'GEPRUEFT'; wert: number; genauigkeitBp: Bp; quelle: 'UNTERLAGE' | 'GUTACHTEN'; monat: MonthIndex }
  | { stufe: 'AMTLICH'; wert: number; quelle: 'GRUNDBUCH' | 'BEHOERDE' | 'NOTAR'; monat: MonthIndex };
```

- **Was ist verdeckt?** Bauteilzustände, Feuchte/Übersanierung, wahre Wohnfläche, wahre Ist-Miete und Rückstände,
  latente Mieterqualität, WEG-Rücklage und anstehende Beschlüsse, Grundbuch-/Baulasten, Anliegerbeiträge, Mikrolage-Mängel,
  Reservationspreis und Motiv des Verkäufers, Qualität von Dienstleistern, **die Zukunft** (Makro- und Ereignispfad).
- **Aufdecken kostet** AP und/oder Geld (Aufdeckungsmatrix 2.4, Mieterprüfung 2.8, Gutachten 2.11/2.16). Genauigkeit hängt
  von Wissen und Dienstleisterqualität ab ([DES]).
- **Marktkenntnis je Region** (0–100, [DES]) wächst mit Beobachtungsdauer, Besichtigungen und Bestand vor Ort und verengt die
  Schätzspannen (Lektion „erst vergleichen, dann fokussieren“, → 14 §2.8).
- **MUSS (Leak-Schutz):** `projection/` arbeitet auf einem Typ `SpielerSicht`, der `wahr`-Felder nicht enthält. Property-Test:
  Zustände, die sich nur in verdeckten Werten unterscheiden, liefern identische Projektionen (INV-09). Nettovermögen und
  Portfolio-Werte nutzen den **Spieler-Erwartungswert** (2.16), damit ein plötzlicher Wertsprung keinen verdeckten Mangel verrät.
- **Zukunft bleibt verdeckt:** Auch im historischen Szenario sieht der Spieler nur die Vergangenheit bis *t* (KANN-Option
  „Blindmodus“: Jahreszahlen verfremdet, [DES], P6).

### 1.10 Spielstand, Undo, Checkpoints

- **Format:** Envelope nach → 22 §4.3 (`schemaVersion`, `rulesVersion`, `dataVersion`, `seed`, `snapshot`, `keyframes`,
  `commandLog`, `checksum`). Der Snapshot ist maßgeblich; das Log dient Replay, Debug und Undo.
- **Kanonische Serialisierung:** Schlüssel sortiert, Zahlen als Integer, Records nach ID sortiert → Grundlage von `hash()`
  (SHA-256, gesamt und je Engine-Teilbaum, 4.4).
- **Undo nur im laufenden Monat:** Undo = Monatsanfangs-Snapshot (B09) + Befehle 0…n−1 erneut anwenden. Zurück nur bis zur
  letzten **Undo-Barriere** (irreversibler Befehl, 1.4). Kein Undo über „Weiter“ hinweg.
- **Lernmodus:** Checkpoints (Keyframes) frei setzbar und ladbar; jede Nutzung zählt in `ziele.checkpointsGenutzt` und wird in
  der Bewertung ausgewiesen. **Ironman:** keine Checkpoints, ein Speicherplatz.
- **Keyframes:** automatisch jährlich nach A15 (Zeitreise im Lernmodus, Fehlersuche).
- **Historie:** spaltenorientiert (Int32/Float64-Arrays), Monatswerte der letzten 120 Monate, ältere als Jahreswerte;
  Buchungsdetails für laufendes und zwei Vorjahre (NKA- und Steuerfristen), ältere aggregiert.
- **Migration:** reine Vorwärtsfunktionen je `schemaVersion` mit Fixture-Tests (→ 22 §4.3).

---

## 2. Engines

**Einheitliches Raster** je Engine: Zweck · Zustand · Ablauf (Pipeline-Schritte aus 1.5) · Kernlogik · Parameter (mit Status) ·
Spielerentscheidungen · Ereignisse/Posteingang · LÜCKEN (→ Register, Abschnitt 5) · Tests (→ Abschnitt 3/4) · Phase.
Zentrale Formeln stehen hier; Herleitungen und Randfälle per Verweis. Parameter-IDs folgen 1.7 (`<engine>.<name>`).
Alle Spannen `[GES]`/`[DES]` sind Platzhalter mit Pflicht-`spanne` (1.7 Regel 2) und laufen in die Sensitivitätsanalyse (4.3).

### 2.1 Makro & Marktpfade (`macro/`)

**Zweck.** Exogene nationale Pfade: Bauzins, Inflation, Preis-, Miet-, Baupreisindex. Dreimodus: historisches Replay,
stochastisches Modell ab Nov. 2026, Szenario-Overrides. Keine eingebaute Aufwärtsgarantie (Leitplanke 6).

**Zustand.**
```ts
interface MakroZustand {
  modus: 'REPLAY' | 'MODELL';                         // Replay bis Szenario-Startmonat bzw. historische Szenarien
  regime: 'NORMAL' | 'BOOM' | 'STRESS'; regimeSeit: MonthIndex;   // Markov-Kette im Monatstakt
  leitzinsBp: Bp; bund10Bp: Bp; spreadBp: Bp;         // Bauzins10 = Bund10 + Spread (Bank-Aufschlag, mean-reverting)
  bauzins10Bp: Bp;                                    // effektiv, Konvention Bundesbank SUD119/SU0046 (Bruch 2003 markiert)
  vpiIdx: number; vpiJahresrateBp: Bp;                // Indizes als Integer ×100 (Basis 100,00 = 10.000)
  preisIdxNat: number; mietIdxNat: number; baupreisIdx: number;
  overrides: Array<{ var: MakroVar; op: 'SET'|'ADD'|'MUL'; wert: number; ab: MonthIndex; dauer: number; abklingBp: Bp }>;
}
```

**Ablauf.** Schritt B02 (`MACRO`-Strom, ein Wurfvektor je Monat). Replay: Monatswert aus `zeitreihen/*.json`
(Quartalswerte in log-linearer Interpolation, deterministisch). Modell: Zustandsübergang unten. Overrides werden nach
dem Modellschritt angewandt (Szenario hat Vorrang). Der Pfad ist **nicht** vom Spieler abhängig (INV-18).

**Kernlogik (Modellvorschlag).** Regime-Switching mit regimeabhängigem AR(1) und Mean-Reversion, korrelierte Innovationen:
```text
P(regime_{t+1} = j | regime_t = i) = Π[i][j]                      // 3×3, Verweildauer NORMAL ≈ 5–8 J., STRESS ≈ 1–3 J. [GES→ABG]
bund10_{t+1}   = bund10_t + κ_b·(μ_b[r] − bund10_t) + σ_b[r]·ε₁
spread_{t+1}   = spread_t + κ_s·(μ_s − spread_t) + σ_s·ε₂        // Bank-Aufschlag; Kreditverknappung in STRESS: μ_s ↑
π_{t+1}        = π_t + κ_π·(μ_π[r] − π_t) + σ_π·ε₃              // Inflationsrate, Ziel ≈ 2 % in NORMAL
Δln P_nat,t+1  = α[r] − β_z·Δbauzins_t − β_π·(π_t − π̄) + ρ·Δln P_nat,t + σ_P·ε₄     // Zinswirkung + Momentum (Blase möglich)
Δln M_nat,t+1  = λ·π_t + δ·(Δln P_nat,t) + σ_M·ε₅                // Mieten träge, an Inflation und verzögert an Preisen
Δln B_nat,t+1  = π_t + ξ + σ_B·ε₆                               // Baupreisindex
ε = L·z,  z ~ N(0,I) aus `MACRO`;  L = chol(Σ_corr)   (Σ_corr: Zins↔π +, Zins↔Preis −, π↔Miete +, Preis↔Bau +)
```
Nur `+ − × ÷`, `expDet`, `lnDet` (1.1, 1.6). Regimeübergang aus `u = Bernoulli`-Wurf je Zeile der Matrix (kategorial).
STRESS koppelt an Zinsschock (Δbauzins > 150 bp/12 M) oder Preiskorrektur; BOOM an Momentum + niedrigen Zins.
Kalibrierung (`tools/calibrate-makro`, Status `[ABG]`, Rechenweg im Paket): Bundesbank SUD119 + SU0046 (verkettet,
Bruch 2003), Destatis VPI 61111, HPI 61262, GREIX (Lizenz klären, LR-03), VPI-Teilindex Nettokaltmiete; Regime-Label
regelbasiert auf der Historie 1990–2026 (→ 20 §B.8, §B.9; 05 §5). Backtest: Historie liegt in P5–P95-Band der
Monte-Carlo-Läufe (4.5).

**Startzustand Nov. 2026** `[WEB→W]` (→ 20 Kurzfazit): Leitzins (Einlagesatz) 250 bp; Bund10 ≈ 350 bp; Bauzins10 eff. 400–450 bp
(Startwert 430 bp, Spanne); VPI 2,8 % ggü. Vorjahr; Nettokaltmieten +1,9 %; GREIX ETW −0,2 % ggü. Vorjahr; vdp Neuvertragsmieten +3,5 %;
Regime: NORMAL mit Tendenz STRESS (Zinsanstieg 2026). Ein Szenario kann Startregime und Overrides setzen.

**Szenario-Dateiformat** (`szenarien/<id>.json`, JSON-Schema im Datenpaket, Hash in `meta.paramPackHash`):
```jsonc
{ "id": "H2-zinswende-2022", "schema": 1, "titel": "…", "lernziele": ["ZINSBINDUNG","ANSCHLUSS"],
  "start": "2021-09", "ende": "2026-12", "modus": "HISTORISCH | MODELL | GEMISCHT",   // GEMISCHT: Replay bis `replayBis`, danach Modell
  "makro": { "replayBis": "2026-11", "regimeStart": "NORMAL",
             "overrides": [ { "var": "bauzins10", "op": "ADD", "wert": 200, "ab": "2027-03", "dauer": 12, "abkling": 3000 } ],
             "schocks": [ { "typ": "ZINSSCHOCK", "ab": "2027-03", "staerkeBp": 200 } ] },
  "regeln": { "jahrgangStart": "DE-2021", "politik": ["…"] },            // 2.14
  "startprofil": "S1", "bank": "A | B | AUTO", "ereignisse": { "filter": ["…"], "dichte": "NORMAL" },
  "ziele": [ "…" ], "bewertung": { "raster": "STANDARD" }, "sichtbarkeit": { "blindmodus": false } }
```
Szenario-Overrides sind Daten, kein Code (Leitplanke 7). Ein Szenario ohne `seedFix` erhält den Spiel-Seed.

**Parameter.**

| ID | Wert / Spanne | Status |
|---|---|---|
| `macro.start.*` (Zinsen, VPI, Indexraten Nov. 2026) | siehe oben | `[WEB→W]` LR-01/02 |
| `macro.reihen.*` (Zins, VPI, HPI, Mietindex, Baupreis 1990/2003–2026) | Zeitreihen | `[BEL]` nach W; bis dahin `[GES]` LR-01..04 |
| `macro.regime.matrix`, `κ`, `μ[r]`, `σ[r]`, `Σ_corr` | aus Kalibrierung | `[ABG]` (nach LR-01..03), Platzhalter `[GES]` |
| `macro.preis.beta_zins` (Δln P je 100 bp Zins) | −3 … −8 % (modus −5 %) | `[GES]` aus Historie 2021–24 kalibrierbar |
| `macro.spread.stress_aufschlag` | +30 … +120 bp | `[GES]` |
| `macro.schock.katalog` (Zinsschock, Preiskorrektur, Inflationsschub) | Form + Stärken | `[DES]` |

**Spielerentscheidungen.** Keine direkten; indirekt Zinsbindungswahl, Zeitpunkt von Kauf/Verkauf, Stresstest-Szenarien (`preview`, 2.18).

**Ereignisse.** Nachrichtenstrom „Marktlage“ (Zins-/Preis-/Mietmeldungen mit Quelle `[DES]`, ohne Zukunft); Regimewechsel erscheint **nicht** direkt, nur als Indikatoren
(Zukunft bleibt verdeckt, 1.9). STRESS erzeugt gehäuft Politik-/Bank-Ereignisse (2.14, 2.6).

**LÜCKEN.** LR-01 Zinsreihe, LR-02 VPI/Mietindex, LR-03 HPI/GREIX-Lizenz, LR-04 Baupreisindex, LR-55 Renditeschwellen nach Zinswende.

**Tests.** Replay = Reihe exakt (Golden); Modell: Momente/Quantile im Band (4.5); INV-18 (Pfad unabhängig von Spielerbefehlen); gleicher Seed → gleicher Pfad
auf allen Engines; kein Pfad mit dauerhaftem Drift ohne Rücksprung (Langläufe 40 J.: Realpreis-Drift ∈ Band, 3).

**Phase.** P3 (Startzustand + einfacher Pfad: Replay-frei, AR(1) ohne Regime), P5 (Regime-Modell, Korrelationen, Kalibrierung), P6 (Replay, Szenario-Format).

### 2.2 Regionalmarkt (`region/`)

**Zweck.** Kreis- und Gemeinde-Indizes aus nationalem Pfad × regionalen Faktoren; Quelle von Marktpreis, Marktmiete, Leerstand, Konkurrenzdruck
und Prognosen je Region (→ 13 §2).

**Zustand.**
```ts
interface RegionZustand {                       // je Kreis (401), dynamisch; Gemeinde = Kreis × statischer Offset
  ars: KreisArs; lageklasse: 'A'|'B'|'C'|'D';   // [DES]-Zuordnung aus Struktur (13 §2.3); nie als „bulwiengesa A“ bezeichnen
  preisIdx: number; mietNeuIdx: number; mietBestandIdx: number;     // Basis = Startwert; Niveau in cent/m² aus Kennzahl × Idx
  leerstandBp: Bp; haushalte: number; wohnungen: number;             // v = 1 − H_wohnend/W
  kaufpreisfaktorBp: number; phase: 'ERHOLUNG'|'BOOM'|'UEBERHITZUNG'|'KORREKTUR'|'TAL';
  angebotsdruck: Bp; konkurrenzdruck: Bp; marktkenntnis?: never;    // Marktkenntnis gehört zum Spieler (2.7)
  prognosen: PrognoseId[];                                           // NPC-Prognosen (Zeitung)
}
interface RegionStatisch { /* aus Datenpaket: Einwohner, Fläche, DEGURBA, Kreistyp, bevPrognose2040, Leerstand 2022, alqProxy, hochschule */ }
```

**Ablauf.** B03 (`REGION`): je Kreis `ε_k` aus `(REGION, monat, ars)`; neue Monatswerte. Gemeinden und Mikrolage ändern keinen Zustand (Offsets).

**Kernlogik.**
```text
Δln P_k,t = β_k·Δln P_nat,t + a_k + θ·(v*_k − v_k,t) + η_k,t          β_k = Zyklus-Beta(Lageklasse, DEGURBA): A/B > 1, C/D ≈ 0,6–1 [GES]
a_k = Trendterm aus Bevölkerungs-/Haushaltsprognose (Haushalte +0,58 %/J. Bund [ABG] → 13 §2.1, regional LR-07)
η_k = idiosynkratisch, AR(1), σ_η größer in kleinen Kreisen
m_neu,k,t+1 = m_neu,k,t·(1 + a_m·(v*_k − v_k,t) + b·π_t)             Neuvertragsmiete; Mietpreisbremse deckelt in 2.8, nicht hier
m_best,k,t+1 → konvergiert träge gegen m_neu (§ 558: 15 Mon., Kappung 20/15 %) ⇒ Spread m_neu − m_best entsteht endogen
v_k,t+1 = v_k,t + c·(Fertigstellungen_k − Abgang_k − ΔH_k)/W_k         // Fertigstellungen: Bund 2021–25 BELEGT (13 §2.2), regional LR-06
F_k = p_k / (12·m_k)  = F_lage·g(Zins)·(1 + Erwartungsterm);  Erwartungsterm = Momentum × Kreditverfügbarkeit (bankStrenge aus 2.6)
Phase φ_k: Zustandsautomat aus (ΔP 12M, Zinsänderung, v, Momentum); Korrektur wird durch Zins-/Kreditschock ausgelöst
Angebotsdruck N_k ↑ in KORREKTUR/TAL, ↓ im BOOM (antizyklische Chancen, → 13 §2.1)
```
**Schätzkaskade** (→ 05 §3): Kennzahl der Gemeinde `[BEL]` → sonst Kreis × Strukturfaktor `[GES]` → sonst Bund × Faktor `[GES]` (Erklär-Karte zeigt den Weg).
**Kaufpreisfaktoren:** Startniveau Kreis aus `kennzahlen.json` (Gutachterausschüsse, BORIS, Mietspiegel-Parameter; LR-05); Spanne je Lageklasse [GES]: A 25–35, B 20–28, C 16–24, D 12–20 (Bruttomietrendite 100/F).
**Prognose-Zeitung:** NPC-Quellen (Makler, „Studie“, Amt) publizieren Prognosen mit Fehlerprofil nach 13 §2.2: Richtung meist richtig, Höhe/Zeitpunkt oft falsch, Fremdprognosen schlechter als Amtsdaten (`PROGNOSE`-Strom; Wahrscheinlichkeiten `[DES]`, ausdrücklich keine Statistik, n = 11); nach Ablauf Zielerreichungsgrad.

**Parameter.**

| ID | Wert / Spanne | Status |
|---|---|---|
| `region.start.*` (Preis €/m², Miete €/m², Leerstand, Haushalte je Kreis) | Kennzahlen | `[BEL]`/`[ABG]`/`[GES]` je Region, Fokusländer zuerst (LR-05/06) |
| `region.lageklasse.regel` (EW-Klassen, DEGURBA) | ≥ 500 k EW → A-ähnlich; 100–499 k + DEGURBA 01 → B; 20–99 k → C; sonst D | `[DES]` |
| `region.beta.*`, `region.theta`, `region.a_m`, `region.sigma_eta` | Spannen je Lageklasse | `[GES]` → `[ABG]` (GREIX/HPI-Städte) |
| `region.phase.schwellen` | Regeln aus ΔP, Δzins, v | `[DES]` |
| `region.prognose.fehlerprofil` | Richtung 80 %, Höhe/Zeitpunkt ±-Verteilung | `[DES]` (Vorlage 13 §2.2) |

**Entscheidungen.** `regionBeobachten`; Marktkenntnis-Aufbau (2.7). **Ereignisse.** „Region kippt“ (Phasenwechsel als Zeitungsmeldung mit Verzug), Prognose erschienen/verfehlt, Regelwechsel (2.14).
**LÜCKEN.** LR-05..08. **Tests.** Σ-Konsistenz Kreis → Bund (gewichteter Mittelwert ≈ nat. Index, Toleranz 1 %); kein Kreis mit F < 5 oder > 60; Leerstand ∈ [0, 25 %]; Spread-Entstehung ohne Mietpreisbremse; Fallback-Kaskade liefert Status korrekt.
**Phase.** P2 (statische Region + Datenpaket), P3 (dynamisch v1, Fokusländer), P5 (Phasenautomat, Prognosen), P7 (Gemeinde-/Quartiersebene).

### 2.3 Angebotsgenerator (`offers/`)

**Zweck.** Stetiger Strom realistischer Angebote je beobachteter Region/Suchprofil mit Informationsasymmetrie (Leitplanke 4; → 13 §3).

**Zustand.**
```ts
interface Angebot {
  id: AngebotId; kreis: KreisArs; gemeinde: Ars; objektart: 'ETW'|'MFH'|'EFH'|'WGH'|'MIKRO'|'NEUBAU';
  kanal: 'PORTAL'|'MAKLER'|'OFFMARKET'; eingestelltMonat: MonthIndex; verfallMonat: MonthIndex;
  preisCent: Cents; expose: ExposeDaten;            // was der Verkäufer zeigt (Schönung angewandt)
  wahr: AngebotWahrheit;                            // verdeckt: Zustand je Bauteil, wahre Fläche/Ist-Miete, Mängel, WEG-Lage, Verkäufermotiv, Reservationspreis
  verkaeufer: { motiv: 'EILIG'|'NORMAL'|'FISHING'|'ERBE'|'BAUTRAEGER'; reservationBp: Bp; verhandlungsbereitBp: Bp };
  konkurrenz: { interessenten: number; wegkaufRateBp: Bp };
}
```

**Ablauf.** B07 (`OFFERS` Anzahl/Art, `OFFER_TRUTH` Wahrheit, `EXPOSE` Schönung; Schlüssel `angebotId`). Je Region/Monat:
`N_neu ~ Poisson(λ(kreis, phase, größe, suchprofil))`, Off-Market-Anteil nach Beziehungswert (2.7). Verfall/Preissenkung monatlich.

**Kernlogik.**
```text
Marktmiete_obj   = m_neu(Gemeinde) × f_mikro × f_zustand × f_größe                      // 13 §3.3
Fair-Preis_obj   = p(Gemeinde,Segment) × Fläche_wahr × f_mikro − BarwertStau_wahr       // = wertKern (2.16), nie ein zweites Modell
Angebotspreis    = Fair-Preis × (1 + Aufschlag(phase, motiv))         Aufschlag: BOOM +5…+15 %, TAL −5…+3 % [GES]
Ist-Miete_obj    = Marktmiete × Unterschreitung(Vertragsalter, Kappung)  → „Schnäppchen“ endogen (unter Markt vermietet / Stau / schwache Nachfrage)
Exposé-Schönung  : je Merkmal m: expose_m = wahr_m ⊕ Δ_m,  Δ_m ~ Verteilung(schoenungsgrad(Verkäufertyp, Kanal));
                   Fläche (+0…+8 %), Ist-Miete (Wunschmiete statt Ist, +0…+25 %), Zustand („gepflegt“ trotz Stau), Rücklage („solide“), Lage („ruhig“)
Renditeverteilung: Angebots-Bruttorendite-Mix so, dass ≈ 3 % schnell, ≈ 6 % typisch, ≈ 10 % selten (13 §3.3, Niedrigzins-Beleg; bei 4 % Zins verschoben, LR-16)
Konkurrenz       : wegkaufRate/Monat = f(Preis/Fair, Rendite, phase, Kanal);  OFFMARKET niedriger, PORTAL höher; Kaufangebot erhöht Rate nicht
Verfall          : Alter > τ(phase): Preissenkung −2…−6 %/Stufe, nach Stufe 3 Rücknahme; „Ladenhüter“-Signal als Information
Häufigkeit verdeckter Mängel: Feuchte, Sonderumlage, Mietrückstand, Baulast … je Baujahr/Zustand/Objektart (LR-12)
```
**Aufdeckung** erfolgt nur in `acquisition/` (2.4); der Generator liefert keine UI-Daten außer `expose`. Verteilung der Objektarten: ETW dominant (P3); MFH P5;
EFH/WGH/Mikro/Neubau P7 (Fachwissen LÜCKE → 13 §3.1).

**Parameter.**

| ID | Wert / Spanne | Status |
|---|---|---|
| `offers.lambda.*` (Angebote je 10 k Einwohner/Monat nach Phase) | je Lageklasse | `[GES]` LR-13 |
| `offers.aufschlag.*` | s. o. | `[GES]` LR-14 |
| `offers.schoenung.*` (Anteil geschönter Exposés, Betrag) | 20–60 % der Exposés, Δ s. o. | `[GES]` LR-12 |
| `offers.maengel.*` (Raten verdeckter Mängel) | je Baujahr | `[GES]` LR-12 |
| `offers.wegkauf.*`, `offers.verfall.*`, `offers.offmarket.anteil` | 5–20 %/Mon.; 3–8 % | `[GES]` LR-14 |
| `offers.rendite.mix` | s. o. | `[ABG]` aus 13 §3.3 (Einzelbeleg, Niedrigzins) |

**Entscheidungen.** Suchprofil, Beobachtung, Verwerfen mit Begründung. **Ereignisse.** „Neues Angebot im Suchprofil“ (nicht stoppend), „Angebot weg“ (stoppend nur bei laufendem Deal), Off-Market-Hinweis.
**LÜCKEN.** LR-12..16. **Tests.** Wahrheit unabhängig vom Prüfen (1.6); `expose` leakt `wahr` nicht (INV-09); Renditemix im Band; Fair-Preis-Erwartungswert = wertKern (INV-17); Determinismus bei neuem Objekt (Schlüsselregel).
**Phase.** P3 (ETW, 6–8 Merkmale), P5 (MFH, Konkurrenz-Ausbau), P7 (Off-Market über Netzwerk, Sonderobjekte).

### 2.4 Akquise & Kaufprozess (`acquisition/`)

**Zweck.** Zustandsautomat vom Angebot bis zum Nutzen-Lasten-Wechsel; Prüfschritte decken verdeckte Merkmale gegen Zeit/Geld auf (→ 13 §3.4, §4).

**Zustand.**
```ts
type DealStatus = 'SICHTUNG'|'VORPRUEFUNG'|'BESICHTIGUNG'|'DETAILPRUEFUNG'|'FINANZIERUNG'|'VERHANDLUNG'|'BEURKUNDUNG'|'BESTAND'|'ABGELEHNT'|'VERLOREN'|'VERKAUFT';
interface Deal { id: DealId; angebotId: AngebotId; rt: RtId; status: DealStatus; seit: MonthIndex;
  gepruefteSchritte: PruefSchritt[]; unterlagen: Record<UnterlageId, 'ANGEFORDERT'|'EINGEGANGEN'|'AMTLICH'|'FEHLT'>;
  gebote: Array<{ monat: MonthIndex; preis: Cents; bedingungen: Bedingung[]; antwort?: 'ANGENOMMEN'|'GEGEN'|'ABGELEHNT' }>;
  finanzierung?: AntragId; beurkundungMonat?: MonthIndex; nlwMonat?: MonthIndex; kaufvertrag?: Kaufvertrag; }
```
Statusvokabular = `objekt.schema.json` (13 §4); Unterzustände nur intern. `VERLOREN` = Konkurrent/Verkäufer zieht zurück [DES].

**Ablauf.** Befehle (1.4) schieben `Deal` voran; A07 (`NEGOTIATION`, `COMPETITION`) wertet Verkäuferreaktionen, Wegkauf, Fristen aus; Gebote laufen in
**Runden** (Monatstakt; Gegenangebot = nächste Runde). Beurkundung → Termin: KNK fällig (A07), Kaufpreisfälligkeit nach `kaufpreisFristMonate`, **Nutzen-Lasten-Wechsel
(NLW) immer am Monatsersten** (B06); ab NLW starten Miete, BK, AfA, 15-%-Fenster (2.13).

**Kernlogik.**
- **Aufdeckungsmatrix** (verbindlich; ✓ deckt auf, ◐ nur Parteivortrag/Schätzspanne; Genauigkeit nach 1.9):

| Merkmal ↓ / Schritt → | Exposé | Karte | Erstgespräch (3 Fragen) | Besichtigung | Unterlagen | Gutachter | Bank |
|---|---|---|---|---|---|---|---|
| Mikrolage | – | ✓ | ◐ | ✓ | – | – | – |
| Ist-Miete / Rückstände | ◐ | – | ◐ | – | ✓ Mietverträge, Mieterliste, Zahlungseingang | – | ✓ (Nachweis) |
| Wohnfläche | ◐ | – | – | grob | ✓ WoFlV | – | – |
| Große Gewerke (Heizung, Fenster, Elektrik, Dach) | ◐ | – | ◐ | ◐ sichtbar | ✓ Nachweise | ✓ | – |
| Feuchte/Risse/Übersanierung | – | – | – | Verdacht | – | ✓ Ursache | – |
| WEG-Rücklage, Beschlüsse, Sonderumlagen | ◐ | – | – | – | ✓ Protokolle 3–5 J., Wirtschaftsplan, Vermögensbericht | – | – |
| Grundbuch Abt. II/III, Baulasten, Altlasten, Anliegerbeiträge | – | – | – | – | ✓ Auszug, Behördenauskünfte | – | ✓ (GB) |
| Beleihungswert < Kaufpreis | – | – | – | – | – | – | ✓ |

- **Reihenfolge-Gates** (Warnung, kein Verbot): Finanzierungszusage **vor** `beurkunden` (sonst Risiko-Flag „ohne Zusage“, Folge 2.6/2.17); Unterlagen vor Gebot empfohlen.
- **Verkäuferreaktion:** `reservationspreis` (verdeckt) ← Fair-Preis × (1 − verhandlungsbereitBp(motiv, phase, Verweildauer)); Gebot ≥ Reservation → Annahme (Wahrscheinlichkeit nach Abstand und Bedingungen), sonst
  Gegenangebot (Mitte, gerundet) oder Ablehnung; belegte Mängel (Gutachten) und Beleihungswert unter Kaufpreis wirken als **Verhandlungshebel** (Nachlass auf Mängelbarwert).
- **Konkurrenz:** je Monat Wegkaufwurf (`COMPETITION`) mit `wegkaufRateBp`; zügiges, verbindliches Auftreten senkt die Rate (Bonus `[DES]`).
- **Beurkundung:** Entwurf → Termin → Vorkaufsrecht (Gemeinde-Negativattest; Mieter bei Umwandlung) → Fälligkeit. KNK = 2.5. Aufteilung Kaufpreis Gebäude/Boden/Inventar im Vertrag (`kaufvertragGestalten`) steuert AfA und GrESt-Bemessung (Rücklage-Anteil **nicht** abziehbar, BFH II R 49/17).
- **Kosten/Dauer (Basis, `[GES]`):** Besichtigung 1 Monat inkl. Terminierung; Unterlagen 1–2 Monate (Behördenauskünfte, Vorkaufsrecht); Bankzusage 1–2 Monate; Notarentwurf bis Termin 1 Monat; Fälligkeit 1–2 Monate nach Beurkundung; Gutachter-Honorar nach Objektart.

**Parameter.**

| ID | Wert / Spanne | Status |
|---|---|---|
| `acq.dauer.*` (Besichtigung, Unterlagen, Bank, Notar, Fälligkeit) | s. o. | `[GES]` LR-13 |
| `acq.kosten.*` (Gutachter, Auskünfte, Fahrt, Grundbuch) | je Objektart | `[GES]` LR-10, LR-13 |
| `acq.genauigkeit.*` (Schätzspanne je Schritt/Kenntnis) | z. B. Besichtigung ±20 %, Gutachten ±5 % | `[DES]` |
| `acq.verhandlung.*` (Nachlassspanne je Phase), `acq.wegkauf.*` | TAL 3–10 %, BOOM 0–3 % | `[GES]` LR-14 |
| `acq.ap.*` (AP je Schritt) | Matrix 1.4 | `[DES]` |

**Entscheidungen.** Reihenfolge und Tiefe der Prüfung (jeder Schritt irreversibel, INV-06), Gebotshöhe/Bedingungen, Abbruch, Vertragsgestaltung, Reservierung (im Vault nicht behandelt: nur Mechanik „Option mit Vertragsstrafe“, `[GES]` LR-15).
**Ereignisse.** „Konkurrent kauft weg“, „Verkäufer zieht zurück/erhöht“, „Gutachten findet Mangel“, „Vorkaufsrecht ausgeübt“, „Bank senkt Beleihungswert“, Beurkundungstermin, Fälligkeitsfrist (stoppend).
**LÜCKEN.** LR-10, LR-12..15. **Tests.** Jeder Schritt ändert `wissen`, nie `wahr` (INV-16, INV-32); Undo über irreversiblen Schritt verweigert (INV-06); Gate-Warnungen; NLW immer Monatserster; Zustandsautomat ohne tote Zustände (Property-Test: jeder Zustand erreicht `BESTAND|ABGELEHNT|VERLOREN`).
**Phase.** P3 (ETW-Funnel komplett), P5 (MFH, Paketkauf, Verhandlungsausbau), P7 (Off-Market, Aufteilung, Bauträger/MaBV).

### 2.5 Kalkulation & Kennzahlen (`calc/`, `valuation/` Teil)

**Zweck.** Reine, zustandsfreie Funktionen (Tracer-fähig, 1.8): Kaufnebenkosten, Kapitalbedarf, Annuität, Kennzahlen K01–K35, Kaskade (→ 10 §1).

**Zustand.** Keiner (Eingaben → `Kennzahl<T>`). **Ablauf.** Synchron im UI (Live-Rechnung) und intern von Bank/Scoring/Deal aufgerufen; **dieselbe** Funktion rechnet Plan (Spielerannahmen) und Prüfung.

**Kernlogik.**
```ts
kaufnebenkosten(o, p) = { grest: floorToEuro((kaufpreis − inventarSeparat) × grest[land]),   // Rücklage nicht abziehen; Rundung LR-09
                          notarGb: kaufpreis × qNotarGb [GES: Pauschale ≈ 2 %, später GNotKG-Staffel LR-10],
                          makler: maklerPflichtig ? kaufpreis × käuferSatz : 0 }            // § 656c: ETW/EFH an Verbraucher halbiert; MFH frei
kapitalbedarf = kaufpreis + knk + sofortsanierung + finanzierungskosten + startreserve        // K07; Puffer ≠ Eigenkapital im Objekt (K08 A/B getrennt)
```
**Grunderwerbsteuer je Land, Stand Nov. 2026** (`regeln.json`, Regelauflöser mit Stichtag Beurkundung; `[BEL·C]` Vault 30.09.2026, in 20 §C.2 `[WEB→W]` bestätigt):

| BW | BY | BE | BB | HB | HH | HE | MV | NI | NW | RP | SL | SN | ST | SH | TH |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 5,0 | 3,5 | 6,0 | 6,5 | 5,5 (ab 01.07.2025) | 5,5 | 6,0 | 6,0 | 5,0 | 6,5 | 5,0 | 6,5 | 5,5 | 5,0 | 6,5 | 5,0 (ab 01.01.2024) |

Vorwerte für historische Szenarien: HB 5,0 %, TH 6,5 % (bis 2023), SN 3,5 % (bis 2022). Primärquellen je Land `gueltig_ab` offen → LR-09.
**Cashflow-Kaskade** (Pflichtdarstellung, → 10 §1.7): operativer CF → CF nach Finanzierung → Liquidität nach Rücklagen → CF nach Steuern; PLAN (aus `calc/`) und IST (nur Ledger) getrennt (1.8).
**Kennzahlen:** K01–K35 gemäß 10 §1 (Bierdeckel 1/2, Kaufpreisfaktor, Brutto-/Nettorendite, EK-Rendite, K22 Annuität/Restschuld, K25–K30 Cashflow, K31–K35 Bankkennzahlen).
**Break-even-Rendite** (Lerninstrument): `(Zins + Tilgung)/(1 − Kostenquote)`; Referenztabelle 14 §4.6 ist Testorakel (4).
**Haushalts-/Bankkennzahlen** (K31–K35) liegen in `calc/`, die **Entscheidung** in `bank/` (2.6).

**Parameter.**

| ID | Wert | Status |
|---|---|---|
| `knk.grest.<land>` | Tabelle oben | `[BEL·C]` → LR-09 |
| `knk.notar_grundbuch` | ≈ 2 % (1,5–2 %) | `[GES]` LR-10 |
| `knk.makler.kaeufer_satz` | ETW/EFH oft 3,57 % inkl. MwSt. (Halbteilung), MFH verhandelbar | `[GES]` LR-11 (→ 01 §4) |
| `calc.kostenquote.default` | 25–33 % der Kaltmiete (Rücklagen/nicht umlagef.) | `[GES]`/`[ABG]` 10 W12 |
| `calc.bierdeckel.schwellen` (Ampel) | 5/6/8/10 % | `[DES]` (LR-55) |

**Entscheidungen.** Annahmen im Rechner setzen (Miete erzielbar, Kosten, Zins, Tilgung); Rechner **bewertet nie** (kein „gut/schlecht“ außer Bank-/Break-even-Info).
**Ereignisse.** keine. **LÜCKEN.** LR-09..11, LR-55. **Tests.** Golden T1–T13 (→ 10 §1.9, 14 §5.1) bit-/cent-genau; Property: Monats- vs. Jahreswerte nie gemischt, Σ Kaskade konsistent (INV-35); Tracer-Ergebnis = Direktergebnis.
**Phase.** P1 (alles), P3 (UI-Anbindung, `dealRechner`), P4 (Steuerstufe), P5 (Portfolio-Aggregate).

### 2.6 Bank & Kredit (`bank/`)

**Zweck.** Deterministische, erklärbare Kreditentscheidung (Leitplanke 5), Konditionen, Darlehensverwaltung, Anschluss, Portfoliobetrachtung (→ 10 §2).

**Zustand.**
```ts
interface Bank { id: BankId; typ: 'REGIONAL'|'DIREKT_HYPO'|'VERMITTLER'; profil: BankProfil;       // beim Start aus Spannen gezogen (BANK-Strom), Zyklusfaktor strenge
                 beziehung: { score: number; seit: MonthIndex; kredite: DarlehenId[] }; bearbeitungsMonate: [min: number, max: number]; }
interface Darlehen { id: DarlehenId; bank: BankId; objekt: ObjektId; restschuld: Cents; sollzinsBp: Bp; anfTilgungBp: Bp; ratePlan: Cents;
                     bindungEnde: MonthIndex; sondertilgungBp: Bp; stLimitJahr: Cents; bereitstellungsFreiBis?: MonthIndex; status: 'ZUGESAGT'|'AUSGEZAHLT'|'GEKUENDIGT'|'ABGELOEST'; }
```
**Profile** (Auszug → 10 §2.3; Werte aus Vault, Spannen `[BEL·C]`):

| Parameter | A „2021“ (leicht/historisch) | B „2026“ (Standard, Schwer) |
|---|---|---|
| `bwFaktor` (Beleihungswert/Marktwert) | 0,80 | ≈ 0,90 |
| Mietbasis · Anrechnung | Jahresbrutto-Kaltmiete · 75 % | Jahresnetto-Kaltmiete · 60–80 % (ohne Vertrag ≤ anrechenbar, `[GES]` 0) |
| Stresszins · Modus | 8 % · `NUR_STRESSZINS` (`[GES]` Annahme) | 5–6 % · `NUR_STRESSZINS` |
| EK-Anforderung | KNK aus EK, 100 % KP finanzierbar | KNK + 20–30 %; Vollfinanzierung nur bei sehr guter Bonität (Aufschlag) |
| KNK mitfinanziert | nein (Ausnahme sehr kleiner KP) | selten (Ausnahme Kleinpreis, Schwelle `[GES]` LR-17) |
| Portfolio-Schwelle | alle Bestandsobjekte < 80 % beliehen | wie A (Bezugswert offen, `[GES]` LR-19) |
| Person | unbefristet nach Probezeit, Selbständige 2–3 Abschlüsse | wie A, strenger bei Selbständigen |
| Min. Puffer nach Kauf | 10–20 T€ | 10–20 T€ |

Profilzuordnung: Szenario `bank: A|B|AUTO`; `AUTO` interpoliert nach Zinsumfeld/Regime (STRESS ⇒ strenger; „Banken behäbiger“, 20 §A). Zyklusparameter in B04.

**Ablauf.** Befehl `kreditanfrage` → Entscheidung nach `bearbeitungsMonate` (A07, `BANK` für Dauer, nie für Entscheidung). Monatlich A05: Zins/Tilgung/Auszahlung. B04: Basiszins je Bindung, Spreads. B06: Zinsbindungsenden.
**Kernlogik.** Entscheidungsfunktion `pruefe(antrag, bank, markt)` **exakt** wie → 10 §2.4 mit Prüfschritten **PS0–PS9** (dort „P0–P9“; Umbenennung wegen Phasen-Tags):
PS0 Vollständigkeit (Rückfrage = Zeitverlust) · PS1 Person/SCHUFA · PS2 Sicherheit/Beleihungswert (Video-Abschlag 5 % ≤ 600 T€, RND ≥ 40 J.) · PS3 EK/KNK · PS4 Mietansatz · PS5 Haushaltsrechnung zum Stresszins ·
PS6 Liquidität nach Kauf · PS7 Portfoliobetrachtung (nur bei Haushaltsunterdeckung und Bestand; alle Objekte < 80 %, Gesamt-LTV ≤ 100 %, Portfolio-CF zum **Vertragszins** ≥ 0 `[GES]`) · PS8 Konditionen · PS9 Ergebnis
(`ZUSAGE | GEGENANGEBOT | ABSAGE | RUECKFRAGE`, Begründungscodes aus 10 §2.4). `maxDarlehen = min(formal, sehrGuteBonität ? formal : bw, portfolioTraegt ? ∞ : haushaltsMax)`; Gegenangebot nur mit ausreichender Restliquidität.
```text
Zins = Basis(bindung) + Spread_beleihung(LTV) + Spread_überMarktwert + Spread_vollfin − Rabatt_paket ± Verhandlung(≤ Cap)     // Zielband B: 10 J. ≈ 3,9–4,5 % (Nov. 2026)
Staffel Beleihungsauslauf (Aufschlag vs. 80 %, `[GES]`, LR-18): ≤ 60 %: −15 bp (−25…−5) · ≤ 80 %: 0 · ≤ 90 %: +20 (10…40) · ≤ 100 %: +45 (25…80) · ≤ 110 %: +80 (50…150)
```
- **Anschlussfinanzierung** (Fenster 12/6/3 Monate vor `bindungEnde`, Stopp-Regel): Optionen **Prolongation** (Neuprüfung vereinfacht: Beleihung + Zahlungshistorie, `[GES]`), **Umschuldung** (Bankwechsel; Kosten Grundschuldabtretung/-neu `[GES]`), **Forward** (Vorlauf ≤ 60 Mon., Aufschlag `[GES]` LR-20), **Ablösung/Verkauf**; Standardoption bei Nichtwahl: variable Anschlusskondition (= Basiszins + Spread, jederzeit kündbar).
- **Sondertilgung:** jährliches Recht `stLimit` (Vertragsmerkmal 0/5/10 % `[GES]`, 01 §4: „meist 5–10 %“); darüber nur mit **Vorfälligkeitsentschädigung** `VFE = Σ_{Restlaufzeit} Restschuld_t × max(0, Sollzins − Wiederanlagezins(Restlaufzeit))` abgezinst (Näherung Zinsmargenschaden, `[GES]` LR-20); ordentliches Kündigungsrecht nach 10 Jahren (6 Monate Frist, § 489 BGB `[GES]` LR-20). Stichtag Jahresrecht: B05.
- **Nachbeleihung/Cash-out (Eigenkapital-Recycling):** im Vault **nicht beschrieben** (→ 14 §7). Mechanik als eigenes Darlehen auf freien Beleihungsraum mit voller PS5-Prüfung; Status **`[GES]`-Mechanik, im UI Badge „nicht belegt – Spielannahme“**; Befehl `nachbeleihung` erst P5, ohne Lernbehauptung (LR-20).
- **Vermittler:** `viaVermittler` = Anfrage an k aus den Profilspannen gezogene Banken, Spieler sieht beste Angebote; Kosten 0 € (Standard, gekennzeichnet, LR-20). **Bankberater als Deal-Quelle:** Beziehungswert ≥ Schwelle schaltet Off-Market frei (2.3).
- **Preisverfall/Nachbesicherung** (Wertverfall → LTV ↑): nur bei Anschluss oder Zahlungsverzug, selten, Schwellen `[GES]` LR-54; Kreditkündigung → 2.17.

**Parameter.**

| ID | Wert | Status |
|---|---|---|
| `bank.profil.A.*`, `bank.profil.B.*` | Tabelle oben | `[BEL·C]` (10 §2.3) |
| `bank.lebenshaltung.pauschale(personen)` | 1.100 / 1.700 / 2.200 € (1/2/4 Pers., Spanne ±25 %) | `[GES]` LR-17 |
| `bank.einmalzahlung.anrechnung`, `bank.rahmen.belastungsquote`, `bank.depot.abschlag` | 0–50 %, 2–5 %, 20–30 % | `[GES]` LR-17 |
| `bank.spread.*`, `bank.verhandlung.cap` | s. o.; ≤ 50 bp (Einzelfall −100 bp) | `[GES]` LR-18 |
| `bank.sondertilgung.*`, `bank.vfe.*`, `bank.forward.aufschlag` | s. o. | `[GES]` LR-20 |
| `bank.portfolio.*` (Gesamt-LTV, CF-Kriterium, Bezugswert) | s. o. | `[GES]` LR-19 |
| `bank.bearbeitung.monate` | 1–2 (B: „behäbiger“ 2–3) | `[GES]` LR-17 |

**Entscheidungen.** Bankwahl/Vermittler, Zinsbindung, Anfangstilgung, Sondertilgungsrecht, EK-Einsatz, Unterlagen, Bonitätspflege (Dispo/Karten kündigen), Anschlussoption, Nachbeleihung.
**Ereignisse.** Zusage/Gegenangebot/Absage mit Code + Zahlen (Pflicht-Erklärung 1.8), Rückfrage, Bindungsende-Fenster (stoppend), Konditionsänderung, Nachbesicherungsforderung (selten).
**LÜCKEN.** LR-17..20, LR-53, LR-54. **Tests.** Golden-Fälle PS0–PS9 aus 10 §2.4; INV-10..14 (deterministisch, begründet, keine unbegrenzte Vergabe, monotoner Zins, Sondertilgung nur bis Recht); Profil-A- vs. B-Vergleich (14 K12); S1/S2/S4/S5 (14 §5.3).
**Phase.** P3 (Profile A/B, PS0–PS6 + PS8/9, Konditionen), P5 (PS7 Portfolio, Kreditrahmen, Anschluss, Sondertilgung/VFE, Vermittler, Nachbeleihung), P7 (Gewerbe-/GmbH-Finanzierung, Bürgschaft).

### 2.7 Spieler & Haushalt (`player/`)

**Zweck.** Person(en), Einkommen, Lebenshaltung, Zeitbudget, Wissen, Netzwerk, Rechtsträger; Quelle von Liquidität und Bankbonität (→ 14 §4.2, 01-spieldesign Startprofile S1–S6).

**Zustand.**
```ts
interface Spieler { personen: Person[];                        // 1–2 Erwachsene (+ Kinder als Haushaltsgröße)
  einkommen: { nettoMonat: Cents; einmalzahlungJahr: Cents; art: 'UNBEFRISTET'|'PROBEZEIT'|'BEFRISTET'|'SELBSTSTAENDIG'; jahreSelbst?: number; zveUebrigJahr: Cents };
  lebenshaltung: { basisMonat: Cents; wohnkostenMonat: Cents; dispoRahmen: Cents; kartenRahmen: Cents };
  zeit: { apBudget: number; apFrei: number; delegiert: Record<ObjektId, Delegation> };           // [DES]
  netzwerk: Record<KontaktId, { rolle: 'BANKBERATER'|'MAKLER'|'HANDWERKER'|'STEUERBERATER'|'ANWALT'|'GUTACHTER'; beziehung: number /*0–100*/ }>;
  marktkenntnis: Record<KreisArs, number /*0–100*/>; kompetenzen: Record<ModulId, number>;     // Weiterbildung (Wissen), schmälert Fehlerraten
  rechtstraegerIds: RtId[]; }
```
**Ablauf.** A01 monatlich: Netto-Gehalt (+ ½ Einmalzahlung im Dez. [DES]), Lebenshaltung (inkl. eigene Wohnkosten, bestehende Raten) über Ledger; B05 jährlich: Gehaltsanpassung `Δ = π·γ ± Lebensereignis`, Lebenshaltung indexiert (`PLAYER`); B08: AP-Budget auffrischen.
**Kernlogik.**
- **Einkommen:** Startprofile S1–S6 (3.100 € netto/45 T€ EK … ; „S6 Mein echtes Profil“ mit Validierungsgrenzen). **Steuerbezug:** `nettoMonat` ist nach Lohnsteuer; für 2.13 wird `zveUebrigJahr` als Eingabe des Profils geführt (kein Brutto-Netto-Rechner im MVP, Hinweis `VEREINFACHUNG_OHNE_BRUTTO_NETTO`).
- **Lebenshaltung:** Bankpauschale ≠ Ist-Ausgaben; Ist = Basis × Haushaltsfaktor × Preisindex (VPI). Zuzahlungen aus Objekten (negativer CF) laufen ins Girokonto; Dispo → 2.17.
- **Zeitbudget (DESIGN):** AP/Monat (Vollzeit-Angestellter 12 AP `[DES]`, Selbständig 14, Teilzeit 16; Spanne), Kosten je Befehl 1.4; Verwaltung Selbst: Objekt-Zeitbedarf `AP/Monat = a + b·Einheiten` `[DES]`; Delegation tauscht AP gegen Geld und Kontrollverlust (Fehlerrate Dienstleister nach Qualität). Nicht verbrauchte AP verfallen (kein Ansparen über 1 AP hinaus [DES]). Zeit ist **keine Realitätsaussage** → Badge „Spielmechanik“.
- **Netzwerk:** Beziehung wächst durch `netzwerkPflegen`, Geschäfte und Zeit; schaltet Off-Market (Bank/Makler), Handwerker-Preisabschlag (≤ 10 % [DES]), Gutachter-Termine.
- **Marktkenntnis je Region** (1.9): +Beobachtung, +Besichtigung, +Bestand vor Ort; verengt Schätzspannen; Verfall bei Nichtbeachtung [DES].
- **Lebensereignisse** (`PLAYER`): Jobverlust/Kurzarbeit, Gehaltssprung, Kind, Trennung/Scheidung, Krankheit, Erbschaft; Raten `[GES]` LR-56; jeweils Entscheidungsereignis mit Frist.
- **Rechtsträger:** `PRIVAT` (1–2 Personen, Splitting-Option), `GMBH`, `HOLDING` (P7); getrennte Kassen (1.3).

**Parameter.**

| ID | Wert | Status |
|---|---|---|
| `player.start.S1..S6` (Einkommen, EK, Haushalt) | → 01-spieldesign | `[DES]` (Vorbilder 14 §4.2, `[GES]` Zahlenwerte) LR-51 |
| `player.gehalt.anpassung` (γ·π, σ) | γ 0,6–1,0 | `[GES]` LR-51 |
| `player.lebenshaltung.basis(haushalt)` | 1.100–2.600 €/Mon. | `[GES]` LR-17/51 |
| `player.ap.*`, `player.netzwerk.*`, `player.kenntnis.*` | s. o. | `[DES]` |
| `player.lebensereignis.raten` | z. B. Jobverlust 1–3 %/J. | `[GES]` LR-56 |

**Entscheidungen.** Sparen/Umbuchen, Lebenshaltung anpassen, Depot verkaufen, Weiterbildung, Netzwerk pflegen, Nebenjob, Delegation, Rechtsträger gründen (P7).
**Ereignisse.** Gehalts-/Lebensereignisse, Beziehung wächst/verfällt, AP-Engpass-Hinweis. **LÜCKEN.** LR-17, LR-51, LR-56. **Tests.** Σ Liquidität = Ledger; AP nie negativ (INV-31); Lebensereignisse deterministisch je `(PLAYER, monat, k)`; S9-Tempo-Plausibilität (14 §5.3).
**Phase.** P3 (Profile S1–S6, Einkommen, Lebenshaltung, AP-Basis), P5 (Weiterbildung, Netzwerk, Delegation), P7 (Rechtsträger).

### 2.8 Vermietung (`lease/`)

**Zweck.** Mieter-Automat, Vertragsarten, Mieterhöhung, Zahlungsstörung, Kündigung/Räumung, Leerstand (→ 12 §1).

**Zustand.**
```ts
type EinheitStatus = 'LEER_HERRICHTUNG'|'INSERIERT'|'AUSWAHL'|'VERTRAG'|'AKTIV'|'KUENDIGUNG'|'RAEUMUNG'|'AUSZUG';
type AktivUnter = 'REGULAER'|'VERZUG'|'STUNDUNG'|'MINDERUNG'|'STREIT';
interface Mietvertrag { id: MvId; einheit: EinheitId; mieter: MieterId; art: 'STANDARD'|'STAFFEL'|'INDEX'|'MOEBLIERT'|'GEWERBE'|'PREISGEBUNDEN';
  kaltMiete: Cents; bkVorauszahlung: Cents; kaution: Cents; beginn: MonthIndex; letzteErhoehung?: MonthIndex;
  klauseln: { bkUmlage: boolean; nr17Einzeln: string[]; kleinrepKosten: boolean; heizSchluessel: SchluesselId }; staffel?: Staffel[]; indexBasis?: number; unter: AktivUnter; rueckstand: Cents; }
interface Mieter { id: MieterId; sichtbar: { beruf: string; haushalt: HaushaltTyp; angabenEinkommen?: Cents };
  latent: { zahlungsneigungBp: Bp; zahlungsfaehigkeitBp: Bp; quelle: 'ARBEIT'|'AMT'|'FIRMA'; fluktuationBp: Bp; streitBp: Bp; ursacheAusfall?: 'UNFAEHIG'|'UNWILLIG' }; }
```
**Ablauf.** A02 Mieteingang (`PAYMENT`), A06 Lebenszyklus (`TURNOVER`, `TENANT`), B06 Termine (Wirksamkeit Mieterhöhung t+3, Index t+2, Staffelstufe), Befehle 1.4.
**Kernlogik.**
- **Zahlungswurf** je Vertrag/Monat: `P(voll) = 1 − h(latent, zustand, Einkommensschock)`, sonst Teil-/Nullzahlung; Rückstand sammelt; Ursache `UNFAEHIG/UNWILLIG` verdeckt, beeinflusst Eskalationserfolg (Stundung wirkt nur bei Fähigkeit). Bewerberprüfung (Gehaltsnachweis, SCHUFA, Amtsvollmacht) deckt `latent` mit Genauigkeit auf (1.9).
- **Eskalation:** `VERZUG → Mahnung → Mahnung+Abmahnung → Kündigung → Räumung`; Stundung = Ratenplan (`Rückstand = Monate × Anteil × Miete`, `Zusatzrate = Rückstand/Rückzahlungsmonate`, 12 §1.5). Schwellen/Fristen/Schonfrist `[GES]` LR-38; Räumungsdauer 6–18 Mon., Anwalts-/Gerichtskosten `[GES]`; **keine Eigenmacht** (Befehl nicht verfügbar).
- **Mieterhöhung** (Rechtsgrundlage zuerst bestimmen, keine „Minimum-Formel“, 12 §1.4):
  Vergleichsmiete § 558: zulässig, wenn ≥ 15 Mon. unverändert bis Wirksamkeit und ≥ 12 Mon. seit letzter Erhöhung; `Obergrenze = min(Vergleichsmiete[Region, 2.2], Miete vor 3 J. × (1 + Kappung))`, Kappung 20 % bzw. 15 % (Gemeindeliste, 2.14); Zugang *t* ⇒ wirksam *t+3* bei Zustimmung, sonst Klage (Quote `[GES]` LR-39);
  Index § 557b: `Miete_neu = Miete_alt × VPI_neu/VPI_alt` (VPI aus 2.1; Beispiel 720 × 125,8/119,8 = 756,06 €), wirksam *t+2*; Staffel § 557a: Euro-Beträge, ≥ 1 Jahr/Stufe, §§ 558–559b gesperrt; Modernisierung → 2.11.
- **Mietpreisbremse (Neuvertrag):** wo Regel aktiv (2.14) `Miete ≤ ortsübliche Vergleichsmiete × 1,10` (`[WEB→W]`, bis 31.12.2029) außer Neubau (erstmals ab 01.10.2014 genutzt+vermietet), erste Vermietung nach umfassender Modernisierung, höhere Vormiete; Staffel: jede Staffel; § 5 WiStrG (> 20 % über üblich bei geringem Angebot) → Warnung/Rüge-Ereignis. `validate(inserieren)` blockt Verstoß **oder** warnt (Härte `[DES]` je Schwierigkeit).
- **Kaution:** ≤ 3 Nettokaltmieten, Treuhand (INV-24), Abrechnung bei Auszug; Übergang beim Kauf (Vertrag geht über, Kaution mitübernehmen/übergeben `[GES]` LR-39).
- **Fluktuation/Leerstand:** Jahresrate je Segment (≈ 8–10 % p. a. als Anker 01 §4; kleine/möblierte Einheiten höher) `TURNOVER`; Leerstandsdauer = f(Nachfrage-Score Region, Mikrolage, Miete/Markt, Zustand, Inseratsqualität); während Leerstand trägt Eigentümer **alle** Betriebskosten (INV-36). Mietminderung Quote je Mangel `[GES]` LR-39.
- **Gewerbe/Amt/möbliert:** eigene Profile (Ausfall, Leerstand, Fluktuation `[GES]` LR-36/37); Mietrecht II (Index/Möblierung) nur als Politik-Ereignis (2.14).

**Parameter.**

| ID | Wert | Status |
|---|---|---|
| `lease.mieterhoehung.fristen` (15/12/3-Monate, Kappung 20/15 %, Index t+2) | → 11 §3.5 | `[BEL·C]` |
| `lease.mpb.zuschlag` (+10 %), `lease.wistrg.grenze` (20 %) | | `[WEB→W]` / `[BEL·C]` LR-41 |
| `lease.fluktuation.*`, `lease.leerstand.dauer.*`, `lease.vermarktung.*` | Spannen je Segment | `[GES]` LR-36 |
| `lease.zahlung.*` (Verzugs-/Ausfallraten, Anker 3 % Reserve), `lease.eskalation.*`, `lease.raeumung.*` | | `[GES]` LR-37/38 |
| `lease.kaution.*`, `lease.minderung.*` | ≤ 3 NKM; Quoten | `[BEL·C]`/`[GES]` LR-39 |

**Entscheidungen.** Inserat/Miete/Mietart/Klauseln, Bewerberauswahl und -prüfung, Mieterhöhung (Art, Zeitpunkt), Mahn-/Stundungs-/Kündigungspfad, Delegation.
**Ereignisse.** E-01 Zahlungsverzug, E-02 Totalausfall/Räumung, Kündigung Mieter, Mangelanzeige, Mieterhöhung zugestimmt/abgelehnt, Rüge Mietpreisüberhöhung, NKA-Streit (12 §6).
**LÜCKEN.** LR-36..41. **Tests.** INV-27 (Bremse/Kappung), Fristen t+3/t+2, Golden Staffel/Index, Treuhand, Zahlungs-Langzeitquote ≈ Reservenanker (Band 4), Eskalation erreicht immer `AKTIV|AUSZUG`.
**Phase.** P3 (Inserat, Bewerber, Vertrag, Zahlung), P4 (Vollautomat, Erhöhung, Störungen), P5 (MFH), P7 (Gewerbe, möbliert/Mikro, Amt-Profile).

### 2.9 Betriebskosten & Abrechnung (`opex/`)

**Zweck.** Umlagefähigkeit korrekt prüfen, Heiz-/CO₂-Kosten verteilen, NKA fristgerecht erstellen (→ 12 §2).

**Zustand.** `Nebenkostenabrechnung { id, objekt, periode: [von, bis], positionen: Array<{ betrkvNr, betrag, schluessel, umlagefaehig: UmlageErgebnis }>, co2: { kgProQm, stufe, vermieterAnteilBp }, status: 'OFFEN'|'ERSTELLT'|'ZUGEGANGEN'|'FRIST_VERSTRICHEN', fehler: AbrFehler[] }`; je Mietvertrag Anteil/Vorauszahlung/Saldo.
**Ablauf.** A03 monatlich Kosten (Ledger `BK_LIEFERANT` mit `betrkvNr`); A15 Dezember: Periode schließen → Aufgabe `nkaErstellen` (Frist 12 Monate nach Periodenende); `nkaErstellen` → Zugang → Vorauszahlungsanpassung ab Folgemonat (§ 560 Abs. 4); Einwendungsfrist 12 Monate; Verjährung 3 Jahre.
**Kernlogik – Umlagefähigkeits-Prüfkette** (Position bleibt beim Eigentümer, sobald eine Stufe scheitert; Ergebnis mit Code):
`1` in § 2 BetrKV genannt → `2` im Mietvertrag vereinbart (Nr. 17 nur einzeln benannt) → `3` zulässiger Schlüssel (Default Wohnfläche, tatsächliche Fläche maßgeblich; Verbrauch erfasst ⇒ verbrauchsabhängig; WEG-Schlüssel; Wechsel nur zum Verbrauch, vor Periodenbeginn) → `4` Heizkosten-/CO₂-Sonderregeln (HeizkostenV, Warmwasser getrennt, Fernablesung ab 01.01.2027) → `5` formell/fristgerecht (4 Mindestangaben, BGH VIII ZR 93/15).
- **Nicht umlagefähig (Konten):** Verwaltung, Instandhaltung, Modernisierung, Anschaffung, Leerstandsanteile, Rücklagenzuführung, Sonderumlage, Rechtsschutz/Mietausfallpolicen, CO₂-Vermieteranteil, Kabel-Grundgebühr (seit 01.07.2024), Rauchmelder-**Miete**; „Verwaltungspauschale“ unzulässig.
- **CO₂-Stufenmodell** (10 Stufen; Vermieteranteil 0 % bei < 12 kg/(m²·a) bis 95 % bei ≥ 52; Schwellen 12/17/…/52; → 12 §2.5):
  `spez = Brennstoffmenge × Emissionsfaktor / Wohnfläche` (Erdgas 0,201 kg/kWh; Heizöl 2,68 kg/l) → Stufe → `Vermieteranteil = CO₂-Kosten × %`; CO₂-Preis 2026 Korridor 55–65 €/t, 2027 **unverändert** `[WEB→W]` (Bundesrat offen), Sonderfälle Etagenheizung, Denkmal (½), NWG; ab 01.01.2028 § 5a CO2KostAufG (hälftig bei Anlagen nach § 43 Abs. 1 GModG) nur ab diesem Datum. Beispiel (12 §2.5): 500 m², 45.000 kWh → 18,1 kg → Stufe 3 → 99,50 €.
- **Fehlerklassen:** formell (Frist, Mindestangabe, Zeitraum > 12 Mon. ⇒ Nachforderung entfällt, Guthaben bleibt), materiell (Position streichen), HKV/CO₂ (Kürzung 15 %/3 %/3 %), WEG-Übernahme 1:1 (häufigster Fehler); Fehlerrisiko je Position steigt mit Komplexität (Gewerbe, WEG, Nr. 17), sinkt mit Wissen/Verwaltung `[DES]`; Entdeckung durch Mieter innerhalb 12 Monaten.
- Grundsteuer: Land-Modell × Hebesatz (Feb/Mai/Aug/Nov), umlagefähig Nr. 1.

**Parameter.**

| ID | Wert | Status |
|---|---|---|
| `opex.betrkv.katalog`, `opex.fristen.*` (12/12/3-Jahre, 30 Tage Prüffrist) | → 12 §2.1, §2.6 | `[BEL]`/`[BEL·C]` |
| `opex.co2.stufen`, `opex.co2.emissionsfaktoren`, `opex.co2.preis(jahr)` | Tabelle 12 §2.5; 55–65 €/t | `[BEL]`; Preis 2026/27 `[WEB→W]` LR-45 |
| `opex.kuerzung.hkv/co2/verbrauchsinfo` | 15 / 3 / 3 % | `[BEL·C]`, Widerspruch L-39 beachten |
| `opex.fehler.basisrate`, `opex.fehler.komplexitaetsfaktoren` | Raten je Position | `[GES]` LR-36 (Teil von 12 L-39-Familie) |
| `opex.grundsteuer.*` (Modell, Messzahl, Hebesatz) | je Land/Gemeinde | `[GES]` LR-32 |
| `opex.heizkosten.eur_qm.*` | je Energieträger/Zustand | `[GES]` LR-45 |

**Entscheidungen.** Erstellen selbst/delegiert (Gebühr), Zeitpunkt, Schlüsseländerung, Vorauszahlungshöhe, Verbrauchserfassung nachrüsten (Fernablesung), Belegeinsicht, Widerspruchsbearbeitung.
**Ereignisse.** NKA fällig/Frist droht (stoppend ≤ 1 Mon.), Mieterwiderspruch, Nachzahlung/Guthaben, Fehlerfolge, CO₂-Stufenwechsel. **LÜCKEN.** LR-32, LR-36, LR-45. **Tests.** Golden CO₂-Beispiel; Prüfkette je Position (Property: Scheitern ⇒ Eigentümerkonto); Frist verpasst ⇒ Nachforderung 0 (INV-26); Σ Umlage + Eigentümeranteil = Σ Kosten; Leerstand (INV-36).
**Phase.** P3 (Hausgeld-Übersetzung ETW minimal), P4 (komplett), P5 (MFH, Gewerbe-Vorwegabzug), P7 (Contracting, NWG).

### 2.10 WEG & Verwaltung (`weg/`)

**Zweck.** WEG-Rahmen der ETW: Hausgeld, Wirtschaftsplan, Rücklage, Sonderumlage, ETV, Verwalter/SEV/Asset-Manager (→ 12 §3).

**Zustand.** `Weg { id, einheiten: Array<{ eigentuemer: RtId | NpcId; meaBp: Bp }>, ruecklage: Cents, ruecklageSoll: Cents, wirtschaftsplan: Positionen[], beschluesse: Beschluss[], verwalter: DlId, npcProfile: Record<NpcId, 'SPARSAM'|'NEUTRAL'|'SANIERUNGSFREUDIG'> }`; Dienstleister `{ rolle, qualitaetBp, kostenModell, vertragBis }`.
**Ablauf.** A03 monatlich Hausgeld (`HAUSGELD_UMLAGEF/NICHT_UMLAGEF`, `…_RUECKLAGE_ZUFUEHRUNG`); A09 Saison: Wirtschaftsplan, **ETV jährlich** (Quartal je WEG `[DES]`), Jahresabrechnung; Sonderumlage nach Beschluss mit Fälligkeit.
**Kernlogik.**
- `hausgeld = Σ Positionen × MEA-Anteil`; **Übersetzungstabelle** Hausgeld → Mieter-NKA: umlagefähiger Teil (Betriebskosten) → opex-Prüfkette; Verwaltervergütung, Rücklage, Reparaturen, Kontoführung, Versammlung, SEV, Prozesskosten → Eigentümer (nie umlagefähig). Modernisierungs-Sonderumlage nur über § 559.
- **Beschlüsse** (Erneuerung Heizung/Dach, Elementarschutz, Umlageschlüssel § 16 Abs. 2, Solaranlage): Stimme nach `weg.stimmrecht` (Standard `MEA` [DES] bis LR-42 geklärt; Alternative `KOPF`), einfache Mehrheit `[GES]`; NPC stimmen nach Profil × Finanzlage; Ergebnis wahrscheinlichkeitsbasiert aus Profilen (`WEG`-Strom), **verdeckt** bis ETV (WEG-Unterlagen decken Historie auf, 2.4).
- **Rücklage vs. Eigentümer-Reserve:** WEG-Rücklage (Gemeinschaftseigentum) ≠ kalkulatorische `Instandhaltungsreserve` des Spielers; Sondereigentum (Bad, Boden, Küche, Therme) trägt der Eigentümer allein.
- **Verwalter-Qualität** beeinflusst Fehlerraten (opex), Rücklagenplanung, Ausschreibungsdisziplin; **SEV/Hausverwalter/Asset-Manager** gemäß Delegationsmatrix 12 §8.3 (Aufgaben ↔ Kosten ↔ AP).
- **MFH:** keine WEG; Eigentümer allein (Verwaltungsrolle direkt); **Aufteilung MFH → ETW** (P7): Gates Milieuschutz → Abgeschlossenheit → Aufteilungsplan, Vorkaufsrecht § 577, Sperrfrist § 577a (5 J. in gelisteten NI-Gemeinden), § 250 BauGB nur mit VO; Gewinn `Σ Einzelpreise − Gesamtpreis − Kosten`; **gewerblicher Grundstückshandel**-Warnung (2.13).

**Parameter.**

| ID | Wert | Status |
|---|---|---|
| `weg.hausgeld.eur_qm`, `weg.umlagequote` | je Baujahr/Ausstattung | `[GES]` LR-42 |
| `weg.ruecklage.soll`, `weg.sonderumlage.rate/hoehe` | aus Bauteilmodell (2.11) | `[GES]` LR-42/43 |
| `weg.verwaltung.kosten.*` (Hausverwalter, SEV, Asset-Mgr, WEG-Verwalter) | €/Einheit/Mon. | `[GES]` LR-42 (II.-BV-§-26-Sätze nur preisgebunden, **nicht** übernehmen) |
| `weg.beschluss.quorum`, `weg.stimmrecht` | einfache Mehrheit; MEA | `[GES]`/`[DES]` LR-42 |
| `weg.aufteilung.*` (Kosten, Dauer) | | `[GES]` LR-49 |

**Entscheidungen.** Abstimmung, Verwalterwechsel/-kündigung, Verwalter-/SEV-Beauftragung, Rücklagenhöhe beantragen, Aufteilung (P7).
**Ereignisse.** E-22 Sonderumlage, ETV-Einladung (stoppend), Beschluss gefasst/abgelehnt, Verwalterproblem, Abrechnung verspätet. **LÜCKEN.** LR-42, LR-43, LR-49. **Tests.** Σ MEA = 100 %; Hausgeld-Übersetzung vollständig (jede Position genau einmal); Sonderumlage nie umlagefähig; Beschluss deterministisch je `(WEG, monat, beschluss)`.
**Phase.** P3 (Hausgeld ETW), P4 (Wirtschaftsplan, Rücklage, Sonderumlage, ETV, Delegation), P5 (MFH-Verwaltung), P7 (Aufteilung).
