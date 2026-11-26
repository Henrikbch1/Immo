# 13 – Akquise, Objektprüfung, Markt & Standort, Gebiete & Daten (Auswertung IC-Vault)

> Fachspezifikation für (a) Markt-/Regionsmodell, (b) Angebotsgenerator, (c) Akquise- und Kaufprozess
> eines realistischen Immobilien-Investment-Trainingsspiels für Deutschland.
> Stand der Auswertung: 2026-11-26. Grundlage: Obsidian-Vault `/home/user/IC/vault` (nur gelesen; nichts geändert).

## 0. Lesehinweise und Kennzeichnung

| Marke | Bedeutung |
|---|---|
| **BELEGT** | Wert/Aussage steht im Vault; Notiz als Wikilink genannt, `stand`/`gueltigkeit` beachten |
| **ABGELEITET** | aus Vault-Zahlen nachgerechnet (Rechenweg angegeben) – keine neue Tatsache |
| **DESIGN** | reine Spielmechanik/Abstraktion (z. B. „Aktionspunkte“), bewusst keine Behauptung über die reale Welt |
| **LÜCKE** | Wert fehlt im Vault – nicht geschätzt; Bezugsquelle (laut [[Marktdaten-Quellenkatalog]]) wird genannt |

Sicherheitsstufen nach `Vault-Spezifikation` 4.1 (hat Vorrang vor `Vault-Regeln` 4a):
**A** = Primärquelle Stufe 1–3 geprüft, Datum bekannt · **B** = datierte Sekundärquelle oder Primärquelle ohne erneute Prüfung ·
**C** = Anbieterquelle, undatiert oder abgeleitet. Fast alle Akquise-/Marktnotizen stützen sich auf immocation-Quellen
(Stufe 5 → Sicherheit C), viele mit `gueltigkeit: unbekannt` bzw. Zahlenstand der Niedrigzinsphase (2018–2021).

**Kernbefund vorweg:** Der Vault liefert eine vollständige, saubere **Gebietshierarchie** (12.588 Gebiete, Destatis, Stand 30.09.2026),
aber praktisch **keine regionalen Marktdaten** (2 Datenpunkte, beide Stadt Bremen, Sicherheit C) und **keine Regel-Notizen**
(`20-Regeln` leer). Fachlich stark ist er bei **Prozesslogik** (Objektprüfung, Unterlagen, Bank) und **Methodik**
(Datentypen trennen, Prognosen kritisch lesen). Quantitative Kalibrierwerte (Konversionsraten, Dauer, Verhandlungsspannen,
Mängelhäufigkeiten, Kaufpreisfaktoren je Lage) fehlen fast vollständig.

---

## 1. Datenbestand

### 1.1 `40-Daten/gebiete.csv` (vollständig, Stufe 3)

Spalten: `ars, ags, name, ebene, parent_ars, land_ars, kreistyp, gemeindetyp, gueltig_ab, gueltig_bis, quelle_id, stand`.
Alle 12.588 Zeilen: `quelle_id = Q-Destatis-GV-ISys-2026-3Q`, `stand = 2026-09-30`, `gueltig_ab/bis` leer (keine Historie).
Lizenz der Quelle: dl-de/by-2-0, Quellenvermerk „© Statistisches Bundesamt (Destatis), 2026“ (muss im Spiel erscheinen).

| Ebene | Anzahl | Details |
|---|---|---|
| land | 16 | |
| regbez | 29 | inkl. 4 „Statistische Regionen“ in NI (031–034); nur BW, BY, HE, NW, NI, SN |
| kreis | 401 | 291 Landkreise, 107 kreisfreie Städte, 3 Kommunalverbände (Region Hannover, Städteregion Aachen, Regionalverband Saarbrücken) |
| verband | 1.202 | Gemeindeverbände (SH, NI, RP, BW, BY, BB, MV, SN, ST, TH) |
| gemeinde | 10.940 | 8.301 gemeinde, 1.828 stadt, 386 markt, 193 gemeindefreies-gebiet, 125 große Kreisstadt, 107 kreisfreie Stadt |
| **Summe** | **12.588** | Import-Bericht `gebiete-import-2026-09-30.md`: neu/geändert/weggefallen = 0 |

Elternbeziehungen: 7.561 Gemeinden hängen an einem Verband, 3.379 direkt am Kreis (verbandsfrei); 314 Kreise an einem
Regierungsbezirk, 87 direkt am Land. Stadtstaaten: Berlin/Hamburg je 1 Land = 1 Kreis = 1 Gemeinde; Bremen 2 Kreise/2 Gemeinden.
Ausgeschlossen (Config `ausschluss`): 3 Gebiete ohne Kreis/Wohnbezug.

Je Land (Kreise / Gemeinden): SH 15/1.104 · HH 1/1 · NI 45/964 · HB 2/2 · NW 53/396 · HE 27/425 · RP 36/2.300 · BW 44/1.103 ·
BY 96/2.217 · SL 6/53 · BE 1/1 · BB 18/413 · MV 8/724 · SN 13/418 · ST 14/218 · TH 22/601.

**Achtung für das Spiel:** Die 193 „gemeindefreien Gebiete“ sind als `ebene: gemeinde` geführt, aber fast alle unbewohnt
(Importbasis: 194 von 196 mit 0 Einwohnern) → als nicht spielbare Regionen filtern.

### 1.2 In der Importbasis vorhanden, aber NICHT importiert (wichtigster Hebel)

Die Destatis-Rohdatei (`archiv/rohdaten/GV-Auszug-3Q-aktuell.xlsx`, Quellnotiz `Q-Destatis-GV-ISys-2026-3Q`) enthält je Gemeinde
weitere Spalten, die `tools/gebiete-import.mjs` verwirft. Der Vault verbietet `archiv/` als Wissensquelle – die Werte sind aber
durch die Stufe-3-Quellnotiz gedeckt; der saubere Weg ist eine **Erweiterung des Imports** (durch den Vault-Kurator, nicht durch das Spiel).

| Spalte | Stichtag | Abdeckung (Satzart 60) | Nutzen fürs Spiel |
|---|---|---|---|
| Fläche km² | 31.12.2025 | 10.943/10.943 | Dichte, Karte |
| Bevölkerung insgesamt / m / w / je km² (Zensus-2022-Basis) | 31.12.2025 | 10.943 | Marktgröße, Nachfragebasis, Größenklasse |
| PLZ des Verwaltungssitzes | – | 10.751 | Suche, Anzeige (nicht m:n!) |
| Geografische Mittelpunktkoordinaten | 31.12.2024 | 10.940 | Kartendarstellung, Entfernung zum Spieler (Fernkauf) |
| Reisegebiet (Schlüssel/Bezeichnung) | – | 10.939 | ggf. Ferienimmobilie |
| Grad der Verstädterung (DEGURBA 01/02/03) | – | 10.942 | **Proxy für Lageklasse** (siehe 2.3) |

Auswertung der Importbasis (ABGELEITET, nur zur Größenordnung; Summe Bevölkerung aller Gemeinden 83.467.117):

| Einwohnerklasse | Gemeinden | Einwohner | davon DEGURBA 01 dicht / 02 mittel / 03 gering |
|---|---|---|---|
| ≥ 500.000 | 15 | 14,59 Mio | 15 / 0 / 0 |
| 100.000–499.999 | 64 | 12,11 Mio | 63 / 1 / 0 |
| 50.000–99.999 | 116 | 7,89 Mio | 52 / 64 / 0 |
| 20.000–49.999 | 509 | 15,41 Mio | 9 / 478 / 22 |
| 5.000–19.999 | 2.231 | 21,96 Mio | 9 / 1.412 / 810 |
| 1.000–4.999 | 4.010 | 9,68 Mio | 0 / 729 / 3.281 |
| < 1.000 (inkl. unbewohnte) | 3.998 | 1,84 Mio | 0 / 168 / 3.829 |

DEGURBA gesamt: 148 dicht, 2.852 mittel, 7.942 gering besiedelt. Bevölkerung wurde mit dem Zensus 2022 umgestellt –
laut Fußnote der Datei nur bedingt mit Vorjahren vergleichbar (wichtig für Zeitreihen).

### 1.3 `40-Daten/datenpunkte.csv` (fast leer)

Spalten: `gebiet_id, kennzahl, wert, einheit, segment, datentyp, stichtag, zeitraum, fallzahl, quelle_id, abgerufen_am, sicherheit, bemerkung`.

| gebiet_id | kennzahl | wert | einheit | datentyp | Stichtag | Sicherheit |
|---|---|---|---|---|---|---|
| 040110000000 (Bremen, Stadt) | kaufvertraege_anzahl | 6.519 | anzahl | transaktion | 2025 | C |
| 040110000000 | kaufpreis_etw_transaktion_mittel (weiterverkaufte ETW) | 2.520 | eur_m2 | transaktion | 2025 | C |

Beide über `Q-Interne-Recherche-Vault-Tiefenrecherche-2026-09-27` (interne Recherche, Primärquelle Gutachterausschuss Bremen noch nicht als Q-Notiz).
**Abdeckung: 1 von 10.940 Gemeinden, 2 von 12 definierten Kennzahlen.**

Kennzahlenkatalog `99-Pflege/schemas/kennzahlen.json` (definiert, aber außer den zwei oben ohne Daten):
`einwohner` (struktur), `einwohner_prognose_2040` (prognose), `arbeitslosenquote` (struktur), `kaufkraft_index` (index),
`miete_angebot_median` (angebot, eur_m2_monat), `miete_mietspiegel_mittel` (mietspiegel), `kaufpreis_etw_angebot_median` (angebot),
`kaufpreis_transaktion_median` (transaktion), `brw_wohnen` (bodenrichtwert), `leerstandsquote_zensus` (struktur),
`kaufvertraege_anzahl`, `kaufpreis_etw_transaktion_mittel`.
Erlaubte `datentyp`: angebot | vertrag | mietspiegel | transaktion | bodenrichtwert | prognose | struktur | index – **nie mischen/verrechnen**.

### 1.4 Regeln und regionale Rechtswerte

- `20-Regeln/`: nur `Regel-Uebersicht.md`; **0 Regel-Notizen**; `40-Daten/regeln-index.csv` nur Kopfzeile. `resolve.mjs` liefert daher für jedes Gebiet „Keine Regel im Bestand“ (read-only getestet mit `040110000000`).
- `99-Pflege/berichte/regelwerte-alt.csv`: 118 Zeilen Altwerte für 10 Gebiete (Land Bremen, Bremen-Stadt, Bremerhaven, Land NI, Achim, Delmenhorst, Lilienthal, Oyten, Stuhr, Weyhe), noch nicht in Regeln überführt (geplant „P6“). Viele Felder `offen` (Hebesatz, Mietspiegel, Straßenausbau, Zweckentfremdung).
- [[Regionale-Rechtsmatrix]] (Wissen, Stand 30.09.2026): **Grunderwerbsteuer aller 16 Länder**, Mieterschutzwerte Bremer Raum, Solarpflicht HB/NI, Straßenausbau NI – derzeit die einzige bundesweit vollständige regionale Wertreihe.

### 1.5 `10-Gebiete/` (Notizen nur bei Bedarf)

76 Notizen: 1 staat, 16 land (2 `entwurf`: Bremen, Niedersachsen; 14 `leer`), 4 regbez (NI, leer), 47 kreis (alle 45 NI + 2 HB, `leer`),
8 gemeinde (`entwurf`: Bremen-Stadt, Bremerhaven, Achim, Delmenhorst, Lilienthal, Oyten, Stuhr, Weyhe).
Gebietsnotizen tragen laut Schema **keine Kennzahlen/Regelwerte im Frontmatter** (`additionalProperties: false`); Zahlen kommen
per AUTO-Block aus CSV. Inhaltlich: Kurzprofil (meist „Umlandgemeinde von Bremen … Mietrecht weicht ab“), `offen:`-Listen
(„Mietspiegel, Hebesatz, Straßenausbaubeitragssatzung, Gutachterausschuss … ergänzen“). Lage-Einschätzung nur Bremen-Stadt
(„B-Stadt laut Sekundärlisten zur bulwiengesa-Systematik“) bzw. Bremerhaven (D-Stadt, Altwert).
Vorlagen: `_templates/Gebiet.md` (Ortsteil-Gerüst), Pfadlogik in `gebiete-generate.mjs`.

### 1.6 Werkzeuge (Datenerzeugung)

| Tool | Funktion | Relevanz fürs Spiel |
|---|---|---|
| `gebiete-import.mjs` | Destatis-xlsx → `gebiete.csv` (Satzart-Mapping aus `gebiete-import.config.json`, verifiziert), Abgleich neu/geändert/weggefallen, Bericht | Basis der Regionsliste; Erweiterung um Fläche/Bevölkerung/Koordinaten/DEGURBA empfohlen |
| `gebiete-generate.mjs --ars X [--mit-eltern] [--mit-kindern]` | legt Gebietsnotizen an (Status `leer`) | für Spiel irrelevant (CSV genügt) |
| `build.mjs` | AUTO-Blöcke (DATEN = neuester Wert je `kennzahl|segment|datentyp`), `regeln-index.csv` | Logik „neuester Datenpunkt“ übernehmen |
| `resolve.mjs <ARS|Name> --json --stichtag` | Kette Gemeinde→…→DE, Regeln per **längstem ARS-Präfix** (Vorrang `hoch` vor Spezifität, dann jüngstes `gueltig_ab`), Daten der Kette | **Fast fertiger Prototyp des Exports** (JSON: `gebiet, kette[], regeln[], daten[]`) |
| `lib/vault.mjs` | `readCsv`, `gebietKette`, `resolveRegeln`, `regelGueltigAm` | wiederverwendbar für einen Exporter |
| `build-context.mjs` | Markdown-Exporte für Agenten | nicht maschinenlesbar genug fürs Spiel |

Im Spec vorgesehen, aber **nicht vorhanden**: `plz-gemeinde.csv`, `hebesaetze.csv`, `zinsen.csv`, `backlog.csv`, Ordner `35-Rechtsprechung`, `60-Vorlagen`, `70-Objekte`, `30-Wissen/Objektarten`.

### 1.7 Was für ein Spiel FEHLT

| Benötigt | Status im Vault | Ebene | Primärquelle laut [[Marktdaten-Quellenkatalog]] / Backlog |
|---|---|---|---|
| Einwohner, Fläche, Dichte | Importbasis ja, CSV nein | Gemeinde | Destatis GV-ISys (Import erweitern) |
| Kaufpreise €/m² (Transaktion) je Segment | 1 Wert (Bremen) | Kreis/Stadt | Gutachterausschüsse, Grundstücksmarktberichte (teils kostenpflichtig) |
| Bodenrichtwerte | LÜCKE | Zone | BORIS |
| Angebotspreise/-mieten | LÜCKE | variabel | Portale/Anbieterstudien, nur als `datentyp: angebot` |
| Mietspiegel | LÜCKE (Bremen nur textlich: qualifiziert, Index ab 01.01.2026) | Gemeinde | Gemeinde |
| Bestandsmiete, Leerstand, Wohnungsbestand | LÜCKE | bis Gitterzelle | Zensus 2022 (Stichtag 15.05.2022) |
| Bevölkerungs-/Haushaltsprognose regional | LÜCKE (nur Bund: Haushalte 2030) | Kreis | Kennzahl `einwohner_prognose_2040` definiert; Quelle offen (Backlog „Standortindikatoren“) |
| Arbeitslosenquote | LÜCKE | Kreis/Agenturbezirk | Bundesagentur für Arbeit |
| Kaufkraft | LÜCKE (Kennzahl definiert, keine freie Quelle im Vault benannt) | – | offen |
| Struktur-Indikatoren (Vergleich) | LÜCKE | Kreis/Verband | INKAR (BBSR), Regionalstatistik |
| Hochschulstandorte | LÜCKE | Gemeinde | nicht benannt |
| BBSR-Raumtyp, Wohnungsmarktregion | LÜCKE (nur als Querschnittsattribut im Spec) | – | BBSR |
| Hebesätze Grundsteuer/Gewerbesteuer | LÜCKE (`hebesaetze.csv` fehlt) | Gemeinde | Destatis/Landesämter |
| Zins-Zeitreihe | LÜCKE (`zinsen.csv` fehlt; nur Stützpunkte) | Bund | Bundesbank/EZB |
| Baupreisindex, Baukosten aktuell | LÜCKE (nur 2018) | Bund | Destatis Baupreisindex |
| Fertigstellungen regional | LÜCKE (nur Bund 2021–2025) | Kreis | Destatis/Landesämter |
| Lage A–D je Stadt | LÜCKE (nur Bremen B, Bremerhaven D aus Sekundärlisten) | Stadt | bulwiengesa RIWIS (127 Städte, kostenpflichtig) |
| Naturgefahren/Lärm | LÜCKE | Adresse | Gefahrenkarten der Länder, ZÜRS, EU-Lärmkartierung |
| PLZ ↔ Gemeinde (m:n) | LÜCKE | – | „lizenzkonforme Quelle (offen)“ |

### 1.8 Vorschlag Export-Datenvertrag Vault → Spiel

Grundsatz: Das Spiel liest **nie** Markdown, sondern ein versioniertes Paket, das ein (künftiges) Vault-Werkzeug
`export-spiel.mjs` aus `gebiete.csv`, `datenpunkte.csv`, Regeln und Quellnotizen erzeugt (Logik aus `resolve.mjs`/`lib/vault.mjs`).
Jeder Wert trägt Herkunft, Stichtag, Sicherheit und ob er gemessen oder geschätzt ist.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "immo-spiel/regionen-paket/1.0",
  "type": "object",
  "required": ["manifest", "quellen", "regionen"],
  "properties": {
    "manifest": {
      "type": "object",
      "required": ["schema_version", "vault_stand", "export_datum", "stichtag_regeln"],
      "properties": {
        "schema_version": {"const": "1.0"},
        "vault_stand": {"type": "string", "format": "date"},
        "export_datum": {"type": "string", "format": "date"},
        "stichtag_regeln": {"type": "string", "format": "date"},
        "lizenzhinweise": {"type": "array", "items": {"type": "string"}}
      }
    },
    "quellen": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["quelle_id", "stufe"],
        "properties": {
          "quelle_id": {"type": "string"}, "titel": {"type": "string"}, "herausgeber": {"type": "string"},
          "stufe": {"enum": [1, 2, 3, 4, 5]}, "url": {"type": "string"}, "lizenz": {"type": "string"},
          "veroeffentlicht": {"type": "string"}, "abgerufen_am": {"type": "string"}
        }
      }
    },
    "regionen": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "name", "ebene", "parent_id", "land_ars"],
        "properties": {
          "id": {"type": "string", "pattern": "^(DE|\\d{2}|\\d{3}|\\d{5}|\\d{9}|\\d{12})$"},
          "ags": {"type": ["string", "null"]},
          "name": {"type": "string"},
          "ebene": {"enum": ["staat", "land", "regbez", "kreis", "verband", "gemeinde"]},
          "parent_id": {"type": ["string", "null"]},
          "land_ars": {"type": "string"},
          "kreistyp": {"enum": ["landkreis", "kreisfreie-stadt", "kommunalverband", null]},
          "gemeindetyp": {"type": ["string", "null"]},
          "bewohnt": {"type": "boolean"},
          "gueltig_ab": {"type": ["string", "null"]}, "gueltig_bis": {"type": ["string", "null"]},
          "struktur": {
            "type": "object",
            "properties": {
              "flaeche_km2": {"$ref": "#/$defs/kennwert"}, "einwohner": {"$ref": "#/$defs/kennwert"},
              "dichte_ew_km2": {"$ref": "#/$defs/kennwert"}, "degurba": {"enum": ["01", "02", "03", null]},
              "lat": {"type": ["number", "null"]}, "lon": {"type": ["number", "null"]}, "plz_sitz": {"type": ["string", "null"]}
            }
          },
          "kennzahlen": {"type": "array", "items": {"$ref": "#/$defs/kennwert"}},
          "regeln": {"type": "array", "items": {"$ref": "#/$defs/regelwert"}},
          "spiel": {
            "type": "object",
            "properties": {
              "lageklasse": {"enum": ["A", "B", "C", "D", null]},
              "lageklasse_herkunft": {"enum": ["quelle", "abgeleitet", "design"]}
            }
          }
        }
      }
    },
    "zeitreihen": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["reihe", "gebiet_id", "einheit", "punkte", "quelle_id", "sicherheit"],
        "properties": {
          "reihe": {"type": "string"}, "gebiet_id": {"type": "string"}, "einheit": {"type": "string"},
          "punkte": {"type": "array", "items": {"type": "object", "properties": {"datum": {"type": "string"}, "wert": {"type": "number"}}}},
          "quelle_id": {"type": "string"}, "sicherheit": {"enum": ["A", "B", "C"]}
        }
      }
    }
  },
  "$defs": {
    "kennwert": {
      "type": "object",
      "required": ["kennzahl", "wert", "einheit", "datentyp", "stichtag", "sicherheit", "herkunft"],
      "properties": {
        "kennzahl": {"type": "string", "description": "Schlüssel aus 99-Pflege/schemas/kennzahlen.json"},
        "wert": {"type": ["number", "null"]},
        "einheit": {"type": "string"},
        "segment": {"type": "string"},
        "datentyp": {"enum": ["angebot", "vertrag", "mietspiegel", "transaktion", "bodenrichtwert", "prognose", "struktur", "index"]},
        "stichtag": {"type": "string"}, "zeitraum": {"type": "string"}, "fallzahl": {"type": ["integer", "null"]},
        "quelle_id": {"type": ["string", "null"]},
        "sicherheit": {"enum": ["A", "B", "C"]},
        "herkunft": {"enum": ["gemessen", "eltern", "typ_analogie", "design"]},
        "geschaetzt": {"type": "boolean"},
        "abgeleitet_von": {
          "type": ["object", "null"],
          "properties": {"gebiet_ids": {"type": "array", "items": {"type": "string"}}, "methode": {"type": "string"}, "faktor": {"type": ["number", "null"]}}
        },
        "geprueft_am": {"type": ["string", "null"]},
        "bemerkung": {"type": "string"}
      }
    },
    "regelwert": {
      "type": "object",
      "required": ["thema", "wert", "gueltig_ab", "sicherheit", "herkunft"],
      "properties": {
        "thema": {"type": "string", "description": "Schlüssel aus themen.json"},
        "regel_id": {"type": ["string", "null"]}, "wert": {}, "einheit": {"type": "string"}, "zusatz": {"type": "object"},
        "gueltig_ab": {"type": "string"}, "gueltig_bis": {"type": ["string", "null"]},
        "ebene_zustaendig": {"type": "string"}, "geltungsbereich_treffer": {"type": "string"},
        "rechtsgrundlage": {"type": "string"}, "sicherheit": {"enum": ["A", "B", "C"]},
        "herkunft": {"enum": ["regel", "bundesrecht_default", "design"]}, "konflikt": {"type": ["string", "null"]}
      }
    }
  }
}
```

**Umgang mit fehlenden Werten (Kaskade, strikt je Kennzahl-Klasse):**

| Klasse | Beispiele | Kaskade | Kennzeichnung |
|---|---|---|---|
| Rechtswerte | GrESt, Mietpreisbremse, Kappungsgrenze, Sperrfrist | nur Präfix-Match wie `resolveRegeln` (längster Präfix gewinnt). Fehlt eine Landes-/Gemeinderegel, darf das Spiel den **bundesrechtlichen Regelfall** nutzen (z. B. Kappungsgrenze 20 %, Sperrfrist 3 Jahre lt. [[Mieterhoehung]]/[[Regionale-Rechtsmatrix]]) | `herkunft: bundesrecht_default`, Sicherheit max. C, UI-Hinweis „Landesliste nicht geprüft“ |
| Strukturwerte | Einwohner, Fläche, DEGURBA | immer gemessen (Destatis) – keine Schätzung nötig, sobald Import erweitert | `gemessen`, A |
| Marktwerte | Kaufpreis €/m², Miete €/m², Leerstand | 1. gleiche Region, gleicher `datentyp`+`segment` (neuester Stichtag) → 2. **Elternkette** (Verband → Kreis → Land), optional mit Relativfaktor aus Typ-Peers → 3. **Typ-Analogie**: Median gemessener Gemeinden gleicher Gruppe (Land × DEGURBA × Einwohnerklasse × Kreistyp) → 4. `design`-Platzhalter | `geschaetzt: true`, Sicherheit **immer C**, `abgeleitet_von` mit Gebiets-IDs und Methode; UI-Badge „geschätzt“ |
| Prognosen | Einwohner 2040 | nie vererben, nie als Fakt verwenden; nur anzeigen | `datentyp: prognose` |

Verbote (aus [[Marktdaten-Quellenkatalog]], Vault-Regeln 4a): Angebot ≠ Kaufpreis; Angebotsmiete, Mietspiegel und Vertragsmiete nie in einer Kennzahl;
Bodenrichtwert ≠ Verkehrswert; Bundesdurchschnitt nicht auf Gemeinde übertragen; keine Umrechnung Angebot→Transaktion ohne
im selben Gebiet gemessenes Verhältnis (dann mit `methode` dokumentieren). Datenzeilen werden historisiert, nie überschrieben →
Export enthält alle Stichtage (Zeitreihe) plus „neuester Wert“.

---

## 2. Marktmodell

### 2.1 Was der Vault fachlich hergibt

| Konzept | Kernaussage (BELEGT) | Für das Modell |
|---|---|---|
| [[Standortklassifikation-A-bis-D]] | immocation: A = Großstädte mit hoher Nachfrage (München, Berlin, Hamburg), B = Ballungsräume mit guter Anbindung, C/D = kleinere Städte bis ländlich; „je größer der Wohlstand, desto höher die Preise“; in B–D Kaufpreis/Miete oft günstiger. bulwiengesa (RIWIS, 127 Städte): B = Großstädte nationaler Bedeutung (14, u. a. Bremen, Hannover). **Keine Abgrenzungskriterien**. | Lageklasse als Risikoprämie/Faktor-Treiber; Kriterien LÜCKE |
| [[Lohnenswerter-Standort]] | „lohnenswert“ = Kaufpreis-Miete-Verhältnis passt; „zukunftssicher“ = Miete ≥ Bankrate + laufende Kosten + Instandhaltungsrücklage. Indikatoren: Stadt statt Land, Hochschule, Bevölkerung nicht schrumpfend, Arbeitslosenquote positiv, Haushaltsstruktur – **ohne Schwellen/Gewichte**. Niedriger Preis + schwache Nachfrage = Leerstand. | Nachfrage-Treiber; Leerstandsrisiko steigt bei billigen, nachfrageschwachen Regionen |
| [[Mikrolage]] | Umfeld: Lärm/Hauptstraße/Autobahn, Leerstand im Viertel, Freizeit, Anbindung, Nahversorgung; qualitativ, keine Messkriterien | Objektebene: Mikrolage-Score verschiebt Miete/Leerstand innerhalb der Gemeinde |
| [[Haushaltsstrukturentwicklung]] | 2025: 41,126 Mio Haushalte, 17,327 Mio Single (42,1 %), 1–2-Personen 75,1 %; Trendvariante 2030: 42,343 Mio Haushalte, 77,0 % 1–2-Pers. (Quelle-Angabe 81 % übertrieben). Haushalte können steigen, obwohl Bevölkerung stagniert. | Nachfrage nach kleinen Wohnungen wächst; ABGELEITET: Haushalte +0,58 %/Jahr 2025–2030 (Bund) |
| [[Basiseffekt]] | hohe Rate nach Einbruch kann bloße Erholung sein; Raten verketten (0,73 × 1,44 = 1,051) | UI zeigt Index-Niveaus, nicht nur Vorjahresraten |
| [[Spekulationsblase]] | Preise über tatsächlichem Wert, Kredit verstärkt; Kette: Zinsen ↑ → Raten ↑ → weniger Käufer → Preisdruck → Preisrückgang; Platzen: Bank-Sicherheiten verlieren Wert → Nachforderung → Zwangsversteigerung; fallende Werte senken [[Beleihungswert]] und [[Kreditrahmen]]. Indikatoren 3–5 der Quelle fehlen. | Blasen-/Korrekturmechanik |
| [[Antizyklischer-Kauf]] | in Phasen geringer Nachfrage mehr Angebote, weniger Konkurrenz (Einzelbeleg Daniel 2008); Tiefpunkt erst im Rückblick erkennbar | Marktphase steuert Angebotsmenge und Konkurrenzdruck |
| [[Prognosen-kritisch-lesen]] | Rückblick auf 11 Prognosen: Richtung 8/9 richtig, Höhe 5/6 abweichend, Zeitpunkt 3/6 abweichend, 2/11 wertend; übernommene Fremdprognosen weichen häufiger ab; politische Ziele ≠ Prognose (400.000 Wohnungen/Jahr vs. 293.393 / 295.275 / 294.399 / 251.937 / 206.586 Fertigstellungen 2021–2025) | NPC-Prognosen mit Fehlerprofil; Lernziel „Richtung/Höhe/Zeitpunkt trennen“ |
| [[Politische-Vorhaben-einschaetzen]] | Ankündigungen an Umsetzung messen; Gesetze kamen früher/später/anders (65-%-Regel 1 Jahr früher, CO₂-Aufteilung ½ Jahr später und anders) | Regulierungsereignisse mit unsicherem Zeitpunkt |
| [[Investition-ohne-Wertsteigerung]] | Investition muss ohne Wertsteigerung Sinn ergeben | Bewertungslogik/Feedback |
| [[Risikostreuung-ueber-Standorte]] | MFH streut Standortrisiko nicht; Streuung über Standorte; aber Fokus erhöht Marktkenntnis | Portfolio-Risiko, Standortkenntnis-Mechanik |
| Q-immocation-Webinar-Marktupdate-2026 (C, Momentaufnahme) | 2026: Geopolitik → Inflation → Notenbanken; Banken „behäbiger“; nachgebende Preise → Kaufpreise wieder verhandelbar; keine Daten | Szenario-Ereignis „Bankzurückhaltung“, Verhandlungsspielraum ↑ |
| [[Neubaurendite]] / [[Baukosten-je-Quadratmeter]] | Baukosten Land ≈ Stadt, Nachfrage auf dem Land nicht gesichert | Neubau-Wirtschaftlichkeit regional stark unterschiedlich |

### 2.2 Modellvorschlag (Struktur; Koeffizienten = LÜCKE, zu kalibrieren)

**Simulationseinheit:** Kreis (401) als Markt; Gemeinde erbt Kreisdynamik + statischen Gemeinde-Offset (Größe, DEGURBA);
Objekt erbt Gemeinde + Mikrolage-Offset. Zeitschritt: Monat (Prozesse) bzw. Quartal (Markt). DESIGN.

**Zustandsgrößen je Kreis r, Zeit t:** Haushalte H, Wohnungsbestand W, Leerstand v = 1 − H_wohnend/W,
Neuvertragsmiete m_neu (€/m²), Bestandsmiete m_best, Kaufpreis p (€/m², Transaktion), Faktor F = p / (12 · m),
Angebotsmenge N (Inserate), Vermarktungsdauer, Konkurrenzdruck K, Marktphase φ ∈ {Erholung, Boom, Überhitzung, Korrektur, Tal}.

**Treiber und Wirkketten (Richtung BELEGT, Stärke LÜCKE):**

1. *Nachfrage:* ΔH = f(Bevölkerungstrend, Haushaltsgrößentrend, Arbeitsmarkt, Hochschule, Stadt/Land).
   Bundesanker: Haushalte +0,58 %/Jahr (ABGELEITET). Regionale Bevölkerungsprognose LÜCKE.
2. *Angebot:* ΔW = Fertigstellungen − Abgang; Bundesanker 2021–2025 (BELEGT, s. o.); regionale Verteilung LÜCKE.
   Neubau-Fertigstellungen sinken bei hohen Baukosten/Zinsen (Richtung aus [[Prognosen-kritisch-lesen]]).
3. *Miete:* m_neu(t+1) = m_neu(t) · (1 + a·(v* − v) + b·Inflation), Neuvermietung begrenzt durch Mietpreisbremse (wo Regel gilt),
   Bestandsmieten durch § 558 BGB: 15 Monate unverändert, frühestens 1 Jahr nach letzter Erhöhung, ≤ 20 % (bzw. 15 % in ausgewiesenen Gebieten) in 3 Jahren ([[Mieterhoehung]]).
   → Spread m_neu − m_best entsteht endogen = Quelle für „unter Markt vermietet“-Angebote.
4. *Preis/Faktor:* F(t) = F_lage · g(Zins) · (1 + Erwartungsterm). Zinsanstieg senkt F (Kette aus [[Spekulationsblase]]).
   Erwartungsterm = Momentum vergangener Preisänderungen × Kreditverfügbarkeit → erlaubt Überhitzung (Preis > fundamental).
   Korrektur wird durch Zins- oder Kreditschock ausgelöst; dann sinken Beleihungswerte → Kreditrahmen des Spielers sinkt.
5. *Transaktionen/Angebot:* N steigt in Korrektur/Tal (mehr Angebote, weniger Käufer → antizyklische Chancen), sinkt im Boom.
   Anker: Bremen 6.519 Kaufverträge 2025 (C); sonst LÜCKE.
6. *Bank:* Mietanrechnung, Stresszins, Beleihungswert reagieren auf φ (2026: „Banken zögerlicher“, C).
7. *Regulierung:* Ereignisse (Mietpreisbremse verlängert/ausgelaufen, Solarpflicht, Heizungsrecht) mit Ankündigung → Umsetzung zu
   unsicherem Zeitpunkt (DESIGN nach [[Politische-Vorhaben-einschaetzen]]).

**Prognose-Mechanik (Lernkern):** Im Spiel veröffentlichen NPC-Quellen (Makler-Newsletter, „Studie eines Marktteilnehmers“, Amt)
Prognosen. Fehlerprofil qualitativ nach der Vault-Bilanz: Richtung meist richtig, Höhe und Zeitpunkt oft falsch, Fremdprognosen
schlechter als amtliche Daten, Titelzahlen = Spitzenwerte. Die Vault-Bilanz ist ausdrücklich „ein Hinweis, keine Statistik“ (n = 11)
→ als Designvorlage, nicht als Wahrscheinlichkeit verwenden. Nach Ablauf zeigt das Spiel den Zielerreichungsgrad
(tatsächlich / angekündigt × 100).

**Benötigte Zeitreihen:**

| Reihe | Ebene | Vault-Status |
|---|---|---|
| Bauzins 10 J. effektiv | Bund | Stützpunkte: 1990er > 8 %, 2009 ~4,5 %, Artikelzeitpunkt ~1,5 % (Zinsart unklar, C); Ende 09/2026 ~3,9–4,5 % eff. (B/C); EZB-Einlagensatz 2,50 % seit 16.09.2026 (kein Kreditzins). Reihe LÜCKE |
| Inflation/VPI | Bund | LÜCKE |
| Baupreisindex | Bund | LÜCKE (nur 1.700–2.000 €/m² Stand 2018) |
| Fertigstellungen | Bund | 2021–2025 BELEGT (B); regional LÜCKE |
| Haushalte | Bund | 2025, 2030 (Trend) BELEGT (B); regional LÜCKE |
| Bevölkerung | Gemeinde | 31.12.2025 in Importbasis; Historie LÜCKE (Bruch durch Zensus 2022) |
| Kaufpreise/Mieten | Kreis/Gemeinde | LÜCKE (1 Punkt Bremen) |
| Leerstand | Gemeinde | LÜCKE (Zensus 2022) |
| Arbeitslosenquote | Kreis | LÜCKE |

### 2.3 Lageklasse im Spiel

Weil der Vault keine Kriterien liefert, schlage ich eine **transparent als DESIGN gekennzeichnete** Spiel-Lageklasse vor,
abgeleitet nur aus vorhandenen Stufe-3-Strukturdaten: DEGURBA × Einwohnerklasse × Kreistyp (+ später Bevölkerungstrend,
Arbeitslosigkeit, Hochschule). Beispiel-Zuordnung (DESIGN): ≥ 500.000 EW → „A-ähnlich“; 100.000–499.999 und DEGURBA 01 → „B-ähnlich“;
20.000–99.999 → „C-ähnlich“; Rest → „D-ähnlich“. Im UI nie als „A-Lage laut bulwiengesa“ ausgeben; bulwiengesa-Liste ist LÜCKE
(Backlog „A–D-Klassifikation“). Bekannte Sekundärzuordnung: Bremen = B, Bremerhaven = D (Sicherheit B).

---

## 3. Angebotsgenerator

### 3.1 Objektarten

| Objektart (`objekt.schema` enum) | Vault-Wissen | Generator-Hinweise |
|---|---|---|
| `etw` | [[Eigentumswohnung-oder-Mehrfamilienhaus]]: überschaubar, bessere Vermietbarkeit kleiner Wohnungen (C), WEG mit Verwaltung/Rücklage/Protokollen („gemachtes Nest“), aber Mehrheitsbeschlüsse, [[Sonderumlage]]; Einsteigerempfehlung (Stand 2020-11) | Hausgeld, WEG-Unterlagen, Rücklage, beschlossene Maßnahmen als verdeckte Merkmale |
| `mfh` | ganzes Gebäude, eigene Entscheidungen (Balkon, Energie), volles Mietpotenzial, Verantwortung für Dach/Fassade/Heizung, kein Streuungseffekt; Fallstudien Adele (7 WE, 428 m²), Dominik (3 WE + Gewerbe, Bj. 1940), Daniel (3 WE) | Mieterliste, mehrere Mietverträge, Baulasten/Altlasten relevant; Aufteilungsoption ([[Aufteilung-in-Wohnungseigentum]]) |
| `wgh` | keine eigene Notiz; Dominik-MFH mit leerstehender Gaststätte im EG ist nächstes Beispiel | LÜCKE Fachwissen (Gewerbemietrecht hier nicht ausgewertet) |
| `efh` / `zfh` | keine Notiz (`30-Wissen/Objektarten` fehlt); nur Maklerhalbteilung § 656c BGB gilt für Wohnung/EFH an Verbraucher | LÜCKE |
| Mikroapartment (`sonder`/`etw`) | [[Mikroapartment]]: 1 Zimmer, ca. 18–42 m², oft möbliert/temporär; Zielgruppen Studierende, Pendler, Singles; stark urban/zentral; Wirtschaftlichkeit unbelegt; Fallstudie Jochen: Kauf ~35.000 €, 180–250 € kalt, nach Wechsel möbliert ≥ 400 € | nur in DEGURBA 01/Hochschulstädten generieren; hohe Fluktuation → Leerstands-/Verwaltungsrisiko |
| Neubau / Bauträger | [[Bautraegeraufschlag]], [[Verkaufsmarge-im-Bautraegergeschaeft]] (10–30 %, Bezugsgröße unklar), [[Neubaurendite]] (Beispiel 6 %, Fazit-Schwelle 15 €/m² ≈ 9 %), [[Baukosten-je-Quadratmeter]] 1.700–2.000 €/m² inkl. Grundstück (2018); „Profigeschäft“ | Preis = Kosten + Marge → €/m² über Bestand bei ähnlicher Miete → niedrige Rendite; „komplett saniert“ schützt nicht vor Sonderumlage (Hildesheim: 3.000 € Dach) |

### 3.2 Merkmale: sichtbar (Exposé) vs. wahr (verdeckt)

Jedes generierte Objekt hat zwei Datensätze: `wahr` (Simulation) und `expose` (was der Verkäufer zeigt). Das Spiel deckt
`wahr` schrittweise auf (Aufdeckungsmatrix 3.4).

| Merkmal | Exposé | Wahrheit / typische Abweichung (BELEGT) | Quelle |
|---|---|---|---|
| Wohnfläche | Angabe | kann abweichen → mit WoFlV-Berechnung, Mietvertrag abgleichen | [[Prozess-Objektpruefung]], [[Prozess-Unterlagen-beim-Objektkauf]] |
| Ist-Miete | oft fehlend/wenig aussagekräftig; „Wunschmiete“ möglich | Exposé-Miete kann geschönt sein; „solide vermietet“ kann Miete weit unter Markt bedeuten | [[Ist-Miete]], [[Sollmiete]], Q-…-9-haeufigste-Fehler |
| Erzielbare Miete | Verkäuferaussage | Parteivortrag; begrenzt durch Kappungsgrenze/Sperrfristen, letzte Erhöhung des Verkäufers zählt weiter | [[Mieterhoehung]] |
| Zustand große Gewerke | „gepflegt“, „saniert“ | Heizung, Fenster, Elektrik, Dach (+ Leitungen, Bad) entscheiden finanziell; optische Mängel nicht | [[Detailpruefung]], [[Renovierungskosten]] |
| Feuchte/Risse | verschwiegen | Gutachter nötig | [[Detailpruefung]] |
| Übersanierung | als Vorteil verkauft | komplett abgedichteter Keller → Feuchte, Lüftungsanlage nötig (Daniel) | [[Uebersanierung]] |
| Heizung (Typ, Baujahr) | knapp | Tauschbedarf/Rechtsstand (GModG, Betriebsverbot) | [[Regulatorisches-Bestandsrisiko]] |
| Energieausweis | ggf. Kennwert | Art, Gültigkeit, Empfehlungen | Unterlagen-Liste |
| WEG-Rücklage / Maßnahmen | „solide Rücklage“ | Rücklage schließt Sonderumlage nicht aus; beschlossene Maßnahmen in Protokollen | [[Prozess-Objektpruefung]] Schritt 12 |
| Hausgeld | Betrag | nur teilweise umlagefähig (Rücklage, Verwalter, Sonderumlage nie) | [[Hausgeld-und-Nebenkosten]] |
| Grundbuch Abt. II/III | nicht im Exposé | Wegerecht, Nießbrauch, Vorkaufsrecht, Zwangsversteigerungsvermerk; Grundschulden | Unterlagen-Liste |
| Baulasten, Altlasten | – | Abstands-/Stellplatzbaulast; Heizöltank (Bayern: keine Baulasten) | Unterlagen-Liste, [[Regionale-Rechtsmatrix]] |
| Anliegerbeiträge | – | offene Erschließungs-/Straßenausbaubeiträge (NI gemeindeweise) | [[Regionale-Rechtsmatrix]] |
| Denkmal/Sanierungs-/Erhaltungsgebiet, Milieuschutz | – | Genehmigungspflichten, Aufteilungsverbot | [[Milieuschutz]], [[Aufteilung-in-Wohnungseigentum]] |
| Mietverhältnisse | „voll vermietet“ | Rückstände, Minderungen, Streit, Kaution, laufende Modernisierungsumlage, Miete vom Amt (Klumpenrisiko Dominik) | Unterlagen-Liste, Fallstudie Dominik |
| Gewerbeeinheit | „Potenzial“ | leerstehend (Dominik) | Fallstudie Dominik |
| Mikrolage | „ruhige Lage“ | Autobahn, Hauptstraße, Leerstand im Viertel | [[Mikrolage]] |

**Häufigkeiten** (wie oft ein Exposé geschönt ist, wie oft Feuchte/Sonderumlage vorkommt): **LÜCKE** – im Vault nur Einzelfälle.
Generator braucht Wahrscheinlichkeiten je Baujahr/Zustand/Objektart → zu kalibrieren oder als DESIGN-Parameter offen ausweisen.

### 3.3 Preisbildung

```text
Marktmiete_obj   = m_neu(Gemeinde) × Mikrolage-Faktor × Zustands-/Größenfaktor           [Faktoren LÜCKE]
Ist-Miete_obj    = Marktmiete_obj × Unterschreitung (endogen aus Mietvertragsalter, Kappung)
Fair-Preis_obj   = p(Gemeinde, Segment) × Wohnfläche − Barwert Sanierungsbedarf_wahr        [p LÜCKE außer Bremen]
Angebotspreis    = Fair-Preis_obj × (1 + Verkäufer-Aufschlag(Marktphase, Motiv))           [Spanne LÜCKE]
Bauträgerpreis   = Herstellungskosten inkl. Grundstück × (1 + Marge 10–30 %)                 [BELEGT 2018, Bezugsgröße unklar]
Kaufpreisfaktor  = Kaufpreis / Jahresnettokaltmiete ;  Bruttomietrendite = 100 / Faktor     [[Kaufpreisfaktor]]
```

Wichtige Konsequenzen für Realismus:
- Der Verkäufer preist mit der **Ist-Miete oder Wunschmiete**, der Spieler muss mit **erzielbarer Miete und Renovierung** nachrechnen (zweite Bierdeckelrechnung).
- Ein „Schnäppchen“ (hohe Rendite) ist oft durch **unter Markt vermietete** Wohnung, Sanierungsstau oder schwache Nachfrage erklärt ([[Lohnenswerter-Standort]]: niedriger Preis ≠ lohnenswert).
- Verteilung der Angebotsrenditen soll die Vault-Erfahrung abbilden: 3 % „schnell zu finden“, ~6 % typisch für selbst abzahlende Objekte, 10 % „so selten, dass die Suche sehr lange dauert“ (Q-…-9-haeufigste-Fehler, C, Niedrigzinsphase). Bei höherem Zinsniveau verschiebt sich das (ungeklärt, Backlog).
- Bauträger-/Neubauobjekte haben höheren €/m²-Preis bei ähnlicher Miete → niedrige Rendite; Hildesheim-Beispiel 1.533 vs. 1.000 €/m² ist **kein** sauberer Aufschlagsbeleg (andere Lage/Jahr).

### 3.4 Aufdeckungsmatrix (welcher Schritt deckt was auf)

| Verdecktes Merkmal | Exposé lesen | Karte/Standorttour | Erstgespräch (3 Fragen) | Besichtigung | Unterlagen | Gutachter | Bank |
|---|---|---|---|---|---|---|---|
| Mikrolage-Mängel | – | ✓ (Autobahn, Leerstand, Lärm) | Verkäuferaussage | ✓ | – | – | – |
| Ist-Miete / Wunschmiete | teilweise | – | Verkäuferaussage | – | ✓ Mietvertrag, Mieterliste, Zahlungseingänge | – | ✓ (Nachweis) |
| Wohnfläche | Angabe | – | – | grob | ✓ WoFlV | – | – |
| Große Gewerke | Hinweise | – | Verkäuferaussage | ✓ (sichtbar) | ✓ Modernisierungsnachweise, Heizungsdaten | ✓ | – |
| Feuchte/Risse/Übersanierung | – | – | – | Verdacht | – | ✓ Ursache | – |
| WEG-Maßnahmen/Sonderumlage | – | – | – | – | ✓ Protokolle 3–5 J., Beschlusssammlung, Wirtschaftsplan | – | – |
| Grundbuchlasten | – | – | – | – | ✓ Grundbuchauszug | – | ✓ |
| Baulasten/Altlasten/Anliegerbeiträge | – | – | – | – | ✓ Behördenauskünfte | – | – |
| Vorkaufsrechte | – | – | – | – | Teilungserklärung/Historie | – | Notar (Negativattest) |
| Beleihungswert < Kaufpreis | – | – | – | – | – | – | ✓ |

Regel aus dem Vault: Unterlagen von Verkäufer/Makler sind **Parteivortrag**; amtliche Auskünfte selbst/über Notar einholen; fehlende
Unterlagen ausdrücklich als Risiko führen ([[Prozess-Unterlagen-beim-Objektkauf]]).

### 3.5 Off-Market, Konkurrenz, Verhandlung

- **Off-Market** ([[Off-Market-Deal]]): Zugang über Bankberater (Dominik) oder Maklernetzwerk (gewerblich, Sebastian Nürnberg). Weniger Wettbewerb, aber Prüfung bleibt nötig; Vermittler kann Eigeninteresse haben (Bank will finanzieren). Mechanik (DESIGN): Beziehungswerte zu Bank/Maklern schalten Angebote vor Portalveröffentlichung frei.
- **Konkurrenz**: hängt von Marktphase ab (antizyklisch: viele Angebote, wenig Käufer). Verbindliches, zügiges Auftreten fördert Abschluss ([[Prozess-Objektpruefung]] Schritt 7). Wegkauf-Wahrscheinlichkeit/-Frist: LÜCKE.
- **Verhandlung**: 2026 „Kaufpreise wieder verhandelbar“ (C, Momentaufnahme); Hebel im Spiel: belegte Mängel (Gutachten), Beleihungswert der Bank unter Kaufpreis, Marktphase, Absagebereitschaft. Auch Zinsen sind verhandelbar (Hildesheim 4 % → 3 %). Typische Nachlassspannen: LÜCKE.
- **Aufteilung MFH→ETW** als Profi-Strategie: Milieuschutz prüfen, Abgeschlossenheit, Aufteilungsplan; Mehrerlös und Kosten unbeziffert; Mieterrechte (Vorkaufsrecht § 577 BGB, Sperrfrist § 577a BGB) nicht in der immocation-Quelle, aber in Unterlagen-Liste/Rechtsmatrix.

---

## 4. Akquise-Funnel und Kaufprozess als Zustandsautomat

Statusvokabular: `objekt.schema.json` → `sichtung | vorpruefung | besichtigung | detailpruefung | finanzierung | beurkundung | bestand | abgelehnt | verkauft`.
**Inkonsistenz im Vault:** [[Prozess-Objekt-Pipeline]] nennt `sichtung, anfrage, besichtigt, kalkuliert, bank, notar, bestand, abgelehnt` –
fürs Spiel das Schema-Vokabular verwenden und Unterzustände ergänzen.

```text
[Suchprofil/Standort] → SICHTUNG → VORPRUEFUNG{BD1 → Karte → Bewertung → Erstgespräch → BD2}
   → BESICHTIGUNG ∥ UNTERLAGEN_ANGEFORDERT → DETAILPRUEFUNG(+Vollkalkulation)
   → FINANZIERUNG(Anfrage → Zusage) → ANGEBOT/VERHANDLUNG → RESERVIERUNG?(LÜCKE)
   → BEURKUNDUNG(Entwurf → Termin → Vorkaufsrecht/Fälligkeit) → NUTZEN_LASTEN_WECHSEL → BESTAND
jeder Zustand ──(K.-o./Absage)──▶ ABGELEHNT     jeder Zustand ──(Konkurrent/Verkäufer zieht zurück)──▶ VERLOREN (DESIGN)
```

| # | Zustand | Tätigkeit (BELEGT) | Dauer | Kosten | Spieler lernt / deckt auf | Gate / K.-o. | Risiko wenn übersprungen |
|---|---|---|---|---|---|---|---|
| 0 | Suchprofil & Standort | Objektart, Strategie, Renditeschwelle festlegen; mehrere Standorte vergleichen, dann fokussieren; Standort vor Ort erleben; Finanzplan mit Bank **vor** Suche (Dominik) | LÜCKE | Reisekosten LÜCKE | Struktur-/Nachfragedaten, Lageklasse, Leerstand, Lärm | Renditeziel gesetzt | „Nur billig kaufen“ → Leerstand; ständiger Standortwechsel = Fehler Nr. 1 |
| 1 | Sichtung | Portal, Off-Market-Kanal; Anzeige/Exposé **vollständig** lesen, bevor man anruft | Minuten (DESIGN) | 0 | Exposé-Angaben, Sanierungshinweise | – | Makler anrufen ohne Vorbereitung |
| 2a | Bierdeckel 1 | Bruttomietrendite = Ist-Jahreskaltmiete / Kaufpreis × 100 | „Sekunden/Minuten“ (BELEGT) | 0 | Faktor/Rendite | Rendite ≥ eigene Schwelle | Zeit in ungeeignete Objekte |
| 2b | Mikrolage aus der Ferne | Kartendienst bei bekannter Adresse | Minuten | 0 | Autobahn, Umfeld | offensichtliche Lage-K.-o. | späte Enttäuschung bei Besichtigung |
| 2c | Bierdeckel-Bewertung | Schnelleinordnung „in Minuten“; Inhalt über Rendite hinaus **ungeklärt** (Backlog) | Minuten | 0 | – | – | – |
| 2d | Erstgespräch | genau 3 Fragen: Mikrolage-Nachteile? erzielbare Miete? Sanierungskosten direkt nach Kauf? | LÜCKE | 0 | Verkäuferaussagen (Parteivortrag!) | – | Annahmen ungeprüft |
| 2e | Bierdeckel 2 | Rendite mit erzielbarer Miete und (Kaufpreis + Renovierung) (Form abgeleitet) | Minuten | 0 | realistischere Rendite | Schwelle (für Stufe 2 nicht definiert) | Renovierung vergessen |
| 3 | Besichtigung | zügig terminieren; Checkliste; große Gewerke; Feuchte/Risse → Gutachter; Exposé-Abgleich; Küche/Bad/Boden; Keller/Lüftung bei Sanierten; Delegation per Video möglich, Fachurteil nicht | LÜCKE | Fahrt; Gutachter LÜCKE | sichtbarer Zustand, Verdachtsmomente | gravierende Mängel | Kauf mit verdeckten Mängeln; ohne Checkliste werden Punkte vergessen |
| 4 | Unterlagen anfordern | Liste 4.1; amtliche Auskünfte selbst/über Notar; jedes Datum notieren | LÜCKE (Behördenauskünfte, Vorkaufsrecht: „Verzögerung einplanen“) | Gebühren LÜCKE | Rechts-, Miet-, WEG-, Technikrisiken | fehlende Unterlage = dokumentiertes Risiko | Grundbuchlasten, Sonderumlagen, Baulasten, Mietrückstände übersehen |
| 5 | Detailprüfung + Vollkalkulation | Lage, Zustand, Ausstattung, Dokumente vollständig; Auffälligkeiten markieren; Cashflow mit Rücklagen; „zukunftssicher“-Test | LÜCKE | ggf. Gutachten LÜCKE | Liste markierter Auffälligkeiten (keine Kennzahl) | Miete ≥ Rate + Kosten + Rücklage; Investition ohne Wertsteigerung sinnvoll | Schönrechnen; Kauf aus persönlichen Gründen |
| 6 | Finanzierungsanfrage | Dossier als 1 PDF (Memo, Person, Vermögen, Objekt, Kalkulation); ≥ 3 Angebote mit identischen Eckdaten; Bankannahmen schriftlich | LÜCKE | – | Mietanrechnung 60–80 %, Stresszins 5–6 %, Beleihungswert ~10 % unter Verkehrswert, EK-Wunsch 20–30 % (2026, B/C) | Zusage **vor** Notartermin | „Finanzierungsbestätigung erst nach Notartermin“ = typischer Fehler |
| 7 | Angebot/Verhandlung | Kaufpreis, ggf. Inventar (Einbauküche mit Zeitwert separat; Rücklage **nicht** abziehbar, BFH II R 49/17), Regelung Anliegerbeiträge im Vertrag | LÜCKE | – | Spielraum je Marktphase | Absage, wenn Zahlen nicht passen | Überzahlung → höherer EK-Bedarf (Beleihungslücke) |
| 8 | Reservierung | **LÜCKE** – im Vault nicht behandelt | LÜCKE | LÜCKE | – | – | – |
| 9 | Notar/Beurkundung | Kaufvertragsentwurf; gemeindliches Vorkaufsrecht (Negativattest); Grundbuchauszug nicht älter als wenige Wochen; Kaufnebenkosten fällig: GrESt (Land, Satz am Beurkundungstag), Notar+Grundbuch ~2 % (Pauschale), Makler (Halbteilung nur ETW/EFH an Verbraucher), Grundschuldeintragung | LÜCKE | GrESt 3,5–6,5 % je Land; ~2 %; Makler LÜCKE | Vorkaufsrecht ausgeübt? | EK für Nebenkosten vorhanden | Rücktritt/Verzug, Liquiditätsengpass |
| 10 | Nutzen-Lasten-Wechsel | ab hier Mieten an Käufer, Kosten beim Käufer; ≠ Vertragsdatum, ≠ Grundbucheintragung; Kaution übergeben; Fristen (15-%-Grenze, Spekulationsfrist) hängen am Stichtag | – | – | Start Bewirtschaftung/AfA | – | falsche Zuordnung Einnahmen/Kosten |

**Unterzustand-Ereignisse (DESIGN, Wahrscheinlichkeiten LÜCKE):** Konkurrent kauft weg; Verkäufer erhöht/zieht zurück; Bank lehnt ab oder
setzt Beleihungswert niedriger; Gemeinde/Mieter übt Vorkaufsrecht aus; Gutachten findet Mangel → Nachverhandlung oder Absage.

### 4.1 Unterlagenliste (aus [[Prozess-Unterlagen-beim-Objektkauf]], Stand 2026-09-30)

| Bereich | Unterlage | ETW | MFH | Bezug / Prüfen auf |
|---|---|---|---|---|
| Recht | Grundbuchauszug aktuell | ✓ | ✓ | Abt. I Eigentümer; Abt. II Wegerecht, Nießbrauch, Vorkaufsrecht, ZV-Vermerk; Abt. III Grundschulden |
| Recht | Flurkarte | ✓ | ✓ | Grenzen, Überbau |
| Recht | Baulastenauskunft | (✓) | ✓ | untere Bauaufsicht; Bayern ohne Baulasten |
| Recht | Altlastenauskunft | – | ✓ | Verdachtsflächen, Heizöltank |
| Recht | Anliegerbescheinigung | ✓ | ✓ | offene/geplante Beiträge |
| Recht | Denkmal/Erhaltungs-/Sanierungsgebiet | ✓ | ✓ | Genehmigungen, Sonder-AfA, Ausgleichsbeträge |
| Recht | Baugenehmigung/Bauakte | ✓ | ✓ | Dachausbau, Nutzungsänderung, Stellplätze |
| Recht | Gemeindliches Vorkaufsrecht | ✓ | ✓ | Negativattest über Notar |
| Recht | Mieter-Vorkaufsrecht | ✓ | – | nach Umwandlung (§ 577 BGB) |
| Technik | Energieausweis | ✓ | ✓ | Art, Gültigkeit, Kennwert |
| Technik | Wohnflächenberechnung, Grundrisse | ✓ | ✓ | Abgleich Exposé/Mietvertrag |
| Technik | Heizung: Baujahr, Typ, Wartung, Feuerstättenbescheid | ✓ | ✓ | Tauschbedarf, GModG, CO₂-Kostenteilung |
| Technik | Modernisierungsnachweise | ✓ | ✓ | Dach, Fenster, Leitungen, Elektrik mit Jahr |
| Technik | Legionellen-Prüfberichte | – | ✓ (Großanlage) | Befunde |
| Technik | Versicherungspolice + Schadenhistorie | (WEG) | ✓ | |
| Technik | Gutachten (Feuchte, Statik, Schadstoffe) | bei Verdacht | bei Verdacht | Kosten in Kalkulation |
| WEG | Teilungserklärung, Gemeinschaftsordnung, Aufteilungsplan | ✓ | – | Sonder-/Gemeinschaftseigentum, Kostenverteilung, Vermietungsbeschränkungen |
| WEG | Beschlusssammlung, Protokolle 3–5 Jahre | ✓ | – | Maßnahmen, Sonderumlagen, Streit, Rückstände |
| WEG | Wirtschaftsplan, Jahresabrechnung, Vermögensbericht | ✓ | – | Hausgeld, Rücklage, umlagefähiger Anteil |
| WEG | Verwaltervertrag, Verwalterbestätigung | ✓ | – | ggf. Veräußerungszustimmung |
| Miete | Mietverträge inkl. Nachträge | ✓ | ✓ | Mietart, BK-Umlage, Klauseln |
| Miete | Mieterliste | ✓ | ✓ | Ist-Miete, Fläche, Mietbeginn |
| Miete | Mieterhöhungshistorie | ✓ | ✓ | Kappungsgrenze, Sperrfristen |
| Miete | NK-Abrechnungen 2–3 Jahre | ✓ | ✓ | Fristen, Nachzahlungen |
| Miete | Kautionsnachweis | ✓ | ✓ | Übergang regeln |
| Miete | Rückstände, Mängel, Minderungen, Rechtsstreite | ✓ | ✓ | Ausfallrisiko |
| Miete | Modernisierungsankündigungen | ✓ | ✓ | Umlagen § 559 BGB |

Bankseitig zusätzlich (Person): Selbstauskunft, 3 Gehaltsabrechnungen + Dezember, Arbeitsvertrag, ESt-Bescheide 1–2 Jahre,
Kontoauszüge 3 Monate, EK-Nachweis, Kredite, Vermögensaufstellung, SCHUFA; Selbständige 2–3 Jahresabschlüsse ([[Prozess-Finanzierungsdossier-Bank]]).

---

## 5. Pipeline-Management

- **Wie viele Objekte ansehen für einen Kauf? → LÜCKE.** Der Vault enthält keine Konversionsraten (gesucht nach Anzahl Besichtigungen/Exposés/Anfragen: kein Treffer).
- Qualitativ BELEGT: Bierdeckelrechnung dient dazu, „nicht zu viel Zeit in ungeeignete Objekte“ zu stecken; Fokus auf einen Standort erhöht die Trefferquote; strengere Renditeschwelle → längere Suche (10 % „sehr selten“); Adele kaufte neben Vollzeitjob in Randzeiten/Wochenende, laut Artikel-URL „in nur drei Monaten“ (C); Gründer kauften 500 km entfernt neben zwei Vollzeitjobs; Off-Market über Bankberater nach längerer Suche (Dauer nicht genannt).
- **Designempfehlung: Funnel emergent statt fester Quoten.** Wenn der Generator Angebote aus einer regionalen Rendite-/Zustandsverteilung zieht und der Spieler eine Schwelle setzt, ergibt sich der Anteil, der Bierdeckel 1 passiert, als P(Rendite ≥ Schwelle); Bierdeckel 2 filtert über aufgedeckte Ist-/Markt-Miete und Renovierung; Besichtigung/Unterlagen über verdeckte Mängel. Zu kalibrieren sind dann nur die Verteilungen (LÜCKE), nicht abstrakte Quoten.
- **Zeitbudget (DESIGN):** Spieler hat je Woche begrenzte Zeiteinheiten (Vollzeitjob-Modus vs. Vollzeitinvestor); Kosten in Zeiteinheiten je Schritt (Bierdeckel ≈ minimal, Besichtigung + Anreise abhängig von Entfernung, Unterlagenprüfung hoch). Delegation (Video-Besichtigung, Hausverwaltung, Finanzierungsvermittler, Gutachter) spart Zeit, kostet Geld und deckt nicht alles auf.
- Pipeline-Objekte tragen: Status, Entscheidungsdatum + Begründung, Unterlagen-Haken, Rechtsraum „von unten nach oben“ (Objekt → Ortsteil → Gemeinde → Land), keine Adresse/Privatdaten ([[Prozess-Objekt-Pipeline]]).

---

## 6. Parameter-Tabelle

| Parameter | Wert / Spanne | Einheit | Quelle | Stand | regional? | Sicherheit |
|---|---|---|---|---|---|---|
| Anzahl Gebiete land/regbez/kreis/verband/gemeinde | 16 / 29 / 401 / 1.202 / 10.940 | Anzahl | gebiete.csv (Q-Destatis-GV-ISys-2026-3Q) | 2026-09-30 | – | A |
| Bevölkerung, Fläche, Koordinaten, DEGURBA je Gemeinde | in Importbasis, nicht importiert | div. | Q-Destatis-GV-ISys-2026-3Q | 31.12.2025 | Gemeinde | A (nach Import) |
| DEGURBA-Verteilung | 148 dicht / 2.852 mittel / 7.942 gering | Gemeinden | Importbasis (ABGELEITET) | 2026-09-30 | Gemeinde | A |
| Grunderwerbsteuer | BW 5,0 · BY 3,5 · BE 6,0 · BB 6,5 · HB 5,5 (ab 01.07.2025) · HH 5,5 · HE 6,0 · MV 6,0 · NI 5,0 · NW 6,5 · RP 5,0 · SL 6,5 · SN 5,5 · ST 5,0 · SH 6,5 · TH 5,0 (ab 01.01.2024) | % Kaufpreis | [[Regionale-Rechtsmatrix]] | 2026-09-30 | Land | HB A/B; übrige B (keine Regel-Notizen) |
| Notar + Grundbuch | ~2 (ältere Pauschale, tatsächlich gestaffelt) | % Kaufpreis | [[Kaufnebenkosten]] | undatiert | nein | C |
| Maklerprovision | Satz LÜCKE; Halbteilung § 656c BGB nur Wohnung/EFH an Verbraucher, nicht MFH | – | [[Kaufnebenkosten]] | 2026-09-30 | nein | A (Regel) |
| Kaufnebenkosten-Finanzierung | i. d. R. aus EK; Mitfinanzierung selten | – | [[Kaufnebenkosten]] | undatiert | nein | C |
| Renditeschwellen brutto | 3 (leicht zu finden, nicht lohnend) · ~5 („genauerer Blick“) · ~6 (selbst abzahlend typisch) · 7 („könnte klappen“) · 8 (pers. Ziel) · ~9 (Neubau rechnerisch) · 10 (selten) | % | [[Bruttomietrendite]] | ~2018–2021 (Niedrigzins) | nein | C |
| Kaufpreisfaktor-Beispiele | 12,1 · 16,7 · 20,0 · 31,0 | Jahresmieten | [[Kaufpreisfaktor]] | div./undatiert | nein | C |
| Kaufpreisfaktor je Lage | **LÜCKE** | – | – | – | ja | – |
| Kaufpreis ETW (weiterverkauft), Transaktion Mittel | 2.520 | €/m² | datenpunkte.csv, [[Marktdaten-Bremen-und-Umland]] | Berichtsjahr 2025 | Bremen-Stadt | C |
| Kaufverträge | 6.519 | Anzahl/Jahr | datenpunkte.csv | 2025 | Bremen-Stadt | C |
| Mieten €/m², Leerstand, BRW je Region | **LÜCKE** | – | – | – | ja | – |
| Mietanrechnung Bank | 60–80 % der Nettokaltmiete (Planmiete oft 0 oder höherer Abschlag) | % | [[Prozess-Finanzierungsdossier-Bank]] | 2026-09-30 | nein (institutsabh.) | B/C |
| Sicherheitsabschlag Miete (alt) | 25 | % | [[Prozess-Bankgespraech-vorbereiten]] | 2021-04 | nein | C |
| Stresszins Bank | 5–6 (2026); 8 (2021) | % | Finanzierungsdossier / Bankgespräch | 2026-09 / 2021-04 | nein | B/C |
| Beleihungswert | ~10 % unter Verkehrswert (2026); „meist 80 % des Marktpreises“ (2021, prüfen) | – | Finanzierungsdossier; [[Kaufpreis]] | 2026-09 / 2021 | nein | B/C |
| EK-Wunsch Kapitalanlage | mind. Kaufnebenkosten, oft 20–30 | % | Finanzierungsdossier | 2026-09-30 | nein | B/C |
| Bauzins 10 J. effektiv | ~3,9–4,5 | % p. a. | Finanzierungsdossier | Ende 09/2026 | nein | B/C |
| EZB-Einlagensatz | 2,50 (seit 16.09.2026; kein Kreditzins) | % | [[Marktdaten-Bremen-und-Umland]] | 2026-09 | nein | C (intern) |
| Zinsniveau historisch | 1990er > 8; 2009 ~4,5; Artikelzeitpunkt ~1,5 | % | [[Spekulationsblase]] | ~2019–2021 | nein | C |
| Finanzierungsangebote | mind. 3 | Anzahl | Finanzierungsdossier | 2026-09-30 | nein | C |
| Liquiditätspuffer | 10.000–20.000 (pro Objekt oder Portfolio ungeklärt) | € | [[Prozess-Bankgespraech-vorbereiten]] | 2021 | nein | C |
| Beleihung Bestand | < 80 % (Bonitätsaufbau); 110 % „gewagt“ | % | [[Kaufnebenkosten]] | undatiert/~2022 | nein | C |
| Mietausfallreserve | ~3 der Kaltmiete | % | [[Mietausfallreserve]] | 2020-12 | lage-/objektabh. | C |
| Instandhaltung (II. BV, preisgebunden; Orientierung) | 11,50 (< 22 J.) · 14,58 (≥ 22 J.) · 18,62 (≥ 32 J.); Aufzug +1,63 | €/m² · Jahr | [[Instandhaltungsreserve]] | 2026-09-30 | nein | A (nur preisgeb.) |
| Laufende Kosten Modell | 2.000 bei 6.000 Jahresmiete (≈ 33 %) | €/Jahr | [[Instandhaltungsreserve]] | undatiert | nein | C |
| Kostentreiber-Gewerke | Heizung, Fenster, Elektrik, Dach; Leitungen; Bad | – | [[Renovierungskosten]] | 2021 / undatiert | nein | C |
| Heizkörper Material | 80–120 je Stück; ~1.000 für 70 m² | € | [[Renovierungskosten]] | 2021 | nein | C |
| Komplettsanierung Beispiel | 15.000 für 63 m² (≈ 238 €/m², ≈ 24 % des KP) | € | [[Fallstudie-Sebastian-Hildesheim]] | 2011 | nein | C (Einzelfall) |
| Sonderumlage Beispiel | 3.000 (Dach; ≈ 3,3 % des KP) | € | [[Sonderumlage]] | ~2013+ | nein | C (Einzelfall) |
| Baukosten inkl. Grundstück | 1.700–2.000 | €/m² Wfl. | [[Baukosten-je-Quadratmeter]] | 2018-10 (historisch) | nein | C |
| Bauträger-Verkaufsmarge | 10–30 (Bezugsgröße unklar) | % | [[Verkaufsmarge-im-Bautraegergeschaeft]] | 2018-10 | nein | C |
| Neubaurendite | Beispiel 6 (10 €/m² bei 2.000 €/m²); Fazit 15 €/m² nötig (≈ 9) | % | [[Neubaurendite]] | 2018-10 | nein | C |
| Mikroapartment Größe | 18–42, 1 Zimmer | m² | [[Mikroapartment]] | ~2021 | nein | C |
| Haushalte | 2025: 41,126 Mio (42,1 % Single; 75,1 % 1–2 Pers.); 2030 Trend: 42,343 Mio (77,0 %) | Mio / % | [[Haushaltsstrukturentwicklung]] | 2025 | Bund | B |
| Haushaltswachstum | +0,58 (ABGELEITET 2025–2030) | %/Jahr | aus obiger Zeile | – | Bund | B |
| Wohnungsfertigstellungen | 2021: 293.393 · 2022: 295.275 · 2023: 294.399 · 2024: 251.937 · 2025: 206.586 | Wohnungen | [[Prognosen-kritisch-lesen]] | 2025 | Bund | B |
| Prognose-Treffer | Richtung 8/9; Höhe abweichend 5/6; Zeitpunkt abweichend 3/6; wertend 2/11 | Fälle | [[Prognosen-kritisch-lesen]] | 2026-09-30 | nein | C (n klein) |
| Mietpreisbremse | Bremen-Stadt 01.12.2025–31.12.2029; NI-Liste (u. a. Achim, Lilienthal, Oyten, Stuhr, Weyhe) bis 31.12.2029; Bremerhaven, Delmenhorst nein | – | [[Regionale-Rechtsmatrix]], [[Mieterhoehung]] | 2026-09-30 | Gemeinde | A/B |
| Kappungsgrenze | 20 Regel; 15 in ausgewiesenen Gebieten; je 3 Jahre | % | [[Mieterhoehung]] | 2026-09-30 | Gemeinde | A/B |
| Kündigungssperrfrist nach Umwandlung | 3 Jahre Regel; 5 Jahre in gelisteten NI-Gemeinden | Jahre | [[Regionale-Rechtsmatrix]] | 2026-09-30 | Gemeinde | A/B |
| Solarpflicht NI | ab 50 m² neuer/erneuerter Dachfläche ≥ 50 % PV | – | [[Regionale-Rechtsmatrix]] | seit 01.01.2025 | Land | A/B |
| Straßenausbaubeiträge NI | Kann-Regel, gemeindeweise | – | [[Regionale-Rechtsmatrix]] | 09/2026 | Gemeinde | B |
| WEG-Protokolle prüfen | 3–5 | Jahre | [[Prozess-Unterlagen-beim-Objektkauf]] | 2026-09-30 | nein | C |
| NK-Abrechnungen prüfen | 2–3 | Jahre | dto. | 2026-09-30 | nein | C |
| Grundbuchauszug Alter | „nicht älter als wenige Wochen vor Beurkundung“ | – | dto. | 2026-09-30 | nein | C |
| Bierdeckel-Tool Regler | KP 20.000–500.000 €; Miete 200–1.500 €/Monat; 20–200 m²; Default 120.000/500/50 | – | [[Bierdeckelrechnung]] | undatiert | nein | C |
| Suchdauer Beispiel | ~3 Monate bis MFH-Kauf neben Vollzeit | Monate | [[Fallstudie-Adele-Fuerstenwalde]] | nach 2019 | nein | C |
| Konversionsraten Funnel, Schritt-Dauern, Gutachter-/Behördenkosten, Verhandlungsspannen, Mängelhäufigkeiten, Hausgeldhöhen | **LÜCKE** | – | – | – | teils | – |

---

## 7. UX-Ideen und Lerninhalte

**Werkzeuge im Spiel (aus den Prozessen):**
1. **Bierdeckel-Schieberegler** (Kaufpreis/Miete/Fläche → Rendite, Faktor, €/m²), zweistufig: Stufe 1 Ist-Miete, Stufe 2 erzielbare Miete + Renovierung. Bewertungstext nur dort, wo belegt („~5 %: genauerer Blick lohnt sich“).
2. **Exposé-Decoder**: markiert Phrasen wie „solide vermietet“, „saniert“, „gepflegt“ mit Tooltip-Fragen; zeigt Exposé-Wert neben aufgedecktem Wert (Fläche, Miete).
3. **Erstgesprächs-Karte** mit genau drei Fragen; Antworten als „Aussage des Verkäufers (Parteivortrag)“ gekennzeichnet.
4. **Besichtigungs-Checkliste** (Prozess-Objektpruefung): große Gewerke, Feuchte/Risse → „Gutachter beauftragen“-Button, Keller/Lüftung bei sanierten Objekten, Küche/Bad/Boden, Exposé-Abgleich. Unter Zeitdruck (Konkurrenz-Timer) wird ohne Checkliste zufällig ein Punkt übersprungen (DESIGN-Lerneffekt).
5. **Unterlagen-Board**: Kanban der Liste 4.1 mit ETW/MFH-Spalten, Quelle (Verkäufer vs. Amt/Notar), Datum, Status; fehlende Unterlage erscheint automatisch als Risiko im Prüfprotokoll.
6. **Prüfprotokoll / Entscheidungslog**: markierte Auffälligkeiten (Ergebnis der Detailprüfung ist eine Liste, keine Zahl), Entscheidung mit Datum und Begründung; Erfolg „Begründete Absage“ (Dominik lehnte 3,2 % ab).
7. **Datenpunkt-Badges** an jeder Marktzahl: Datentyp (Angebot/Transaktion/Mietspiegel …), Stichtag, Quelle, Sicherheit A/B/C, „geschätzt“; Warnung beim Vermischen („Angebotspreis ist kein Kaufpreis“).
8. **Rechtsraum-Leiste** „von unten nach oben“ (Objekt → Gemeinde → Land → Bund) mit geltender Regel und Prüfdatum; Hinweis bei `bundesrecht_default`.
9. **Prognose-Zeitung**: Meldungen mit Zerlegung Richtung/Höhe/Zeitpunkt, Herkunft (eigene vs. übernommene Prognose), Rückblick mit Zielerreichungsgrad; Basiseffekt-Umschalter (Vorjahresrate vs. Indexniveau).
10. **Standorttour-Minispiel** (Adele: Tour durch den Speckgürtel): Leerstand, Lärm, Freizeit beobachten; deckt Mikrolage-Merkmale auf; Kartenblick vor dem ersten Anruf.
11. **Bank-Simulator**: eigene Rechnung vs. Bankrechnung (Mietanrechnung, Stresszins, Beleihungswert) nebeneinander; Hinweis „Finanzierungszusage vor Notartermin“.
12. **Hausgeld-Übersetzer**: Tabelle WEG-Position → umlagefähig ja/nein ([[Hausgeld-und-Nebenkosten]]).

**Tooltips / Lernkarten (Wikilinks; `gueltigkeit`/`stand` im Tooltip anzeigen):**
[[Bierdeckelrechnung]] · [[Bruttomietrendite]] · [[Kaufpreisfaktor]] · [[Kaufpreis]] · [[Ist-Miete]] · [[Sollmiete]] · [[Kaufnebenkosten]] ·
[[Selbst-abzahlende-Immobilie]] · [[Investition-ohne-Wertsteigerung]] · [[Lohnenswerter-Standort]] · [[Standortklassifikation-A-bis-D]] ·
[[Mikrolage]] · [[Haushaltsstrukturentwicklung]] · [[Marktdaten-Quellenkatalog]] · [[Marktdaten-Bremen-und-Umland]] · [[Basiseffekt]] ·
[[Prognosen-kritisch-lesen]] · [[Politische-Vorhaben-einschaetzen]] · [[Spekulationsblase]] · [[Antizyklischer-Kauf]] ·
[[Risikostreuung-ueber-Standorte]] · [[Eigentumswohnung-oder-Mehrfamilienhaus]] · [[Mikroapartment]] · [[Bautraegeraufschlag]] ·
[[Verkaufsmarge-im-Bautraegergeschaeft]] · [[Neubaurendite]] · [[Baukosten-je-Quadratmeter]] · [[Off-Market-Deal]] · [[Detailpruefung]] ·
[[Uebersanierung]] · [[Renovierungskosten]] · [[Sonderumlage]] · [[Hausgeld-und-Nebenkosten]] · [[Aufteilung-in-Wohnungseigentum]] ·
[[Milieuschutz]] · [[Abgeschlossenheit]] · [[Regulatorisches-Bestandsrisiko]] · [[Regionale-Rechtsmatrix]] · [[Mieterhoehung]] ·
[[Nutzen-Lasten-Wechsel]] · [[Beleihungswert]] · [[Kreditrahmen]] · [[Mietausfallreserve]] · [[Instandhaltungsreserve]] ·
Prozesse: [[Prozess-Standortauswahl]] · [[Prozess-Objektpruefung]] · [[Prozess-Unterlagen-beim-Objektkauf]] · [[Prozess-Objekt-Pipeline]] ·
[[Prozess-Finanzierungsdossier-Bank]] · [[Prozess-Bankgespraech-vorbereiten]] · [[Prozess-Renovierung-planen]] ·
Fallstudien als Szenarien: [[Fallstudie-Dominik-Neunkirchen]] (Absage + Off-Market), [[Fallstudie-Adele-Fuerstenwalde]] (MFH als Einstieg),
[[Fallstudie-Daniel-Bad-Freienwalde]] (antizyklisch, Übersanierung), [[Fallstudie-Sebastian-Hildesheim]] (Bauträgerpreis, Sonderumlage),
[[Fallstudie-Marco-und-Stefan]] (Fernkauf 500 km), [[Fallstudie-Jochen]] (unter Markt vermietete Kleinwohnungen).
Hinweis: Fallstudien stammen von einem Bildungsanbieter und zeigen Erfolgsverläufe (Survivorship) – im Spiel auch Misserfolgsszenarien zulassen.

---

## 8. Lücken (priorisiert)

**A – blockiert ein realistisches Regionsmodell**
1. Regionale **Kaufpreise** (Transaktion, je Segment) und **Mieten** (Angebot/Mietspiegel/Bestand) – nur 1 Datenpunkt Bremen. Quellen: Gutachterausschüsse/BORIS, Mietspiegel, Zensus 2022.
2. **Einwohner/Fläche/Koordinaten/DEGURBA** nicht in `gebiete.csv` – liegen in der Importbasis; Import erweitern (Kurator-Aufgabe im IC-Repo).
3. **Leerstand, Wohnungsbestand** (Zensus 2022), **Bevölkerungsprognose** (Kennzahl `einwohner_prognose_2040` ohne Quelle), **Arbeitslosenquote** (BA), **Kaufkraft** (keine Quelle im Vault).
4. **Zins-, Inflations-, Baupreis-Zeitreihen** (`zinsen.csv` fehlt; Baukosten nur 2018).
5. **Regeln**: `20-Regeln` leer; 118 Altwerte nur für Bremer Raum; GrESt nur als Wissenstabelle. Bundesweite Mietpreisbremse-/Kappungsgemeindelisten fehlen.

**B – nötig für Angebotsgenerator und Prozess**
6. Kaufpreisfaktor/Rendite-Verteilung je Lage und Objektart; Kriterien A–D (bulwiengesa-Primärquelle), Gewichte/Schwellen der Standortindikatoren.
7. Häufigkeiten verdeckter Mängel, geschönter Exposés, Sonderumlagen; Hausgeldhöhen; aktuelle Renovierungskostensätze.
8. Konversionsraten des Funnels, Dauer je Schritt (Besichtigung, Behördenauskünfte, Bankzusage, Notar, Grundbuch), Kosten (Gutachter, Auskünfte, Notar/Grundbuch nach Gebührenrecht statt 2-%-Pauschale), Maklerprovisionssätze.
9. **Reservierung** (Ablauf, Kosten, Verbindlichkeit) – im Vault nicht behandelt; Kaufvertrag/Notar, Zwangsversteigerung, Erbbaurecht, Bauträgerkauf (MaBV) als Notizen fehlen (laut Spec vorgesehen).
10. Verhandlungsspannen je Marktphase; Wegkauf-Wahrscheinlichkeiten; Off-Market-Anteil.
11. Objektarten-Notizen EFH, ZFH, WGH, Gewerbe (Ordner `30-Wissen/Objektarten` fehlt).
12. Renditeschwellen nach Zinsanstieg 2022 (Backlog „Anpassung der immocation-Renditeschwellen“).

**C – Qualität/Konsistenz**
13. Pipeline-Statusvokabular uneinheitlich (Schema vs. [[Prozess-Objekt-Pipeline]]).
14. Bierdeckel-Bewertung: Inhalt und Schwelle der zweiten Stufe ungeklärt.
15. Blasen-Indikatoren 3–5 der Quelle fehlen.
16. Haushalts-Abgleich (77 %) ohne eigene Q-Notiz der amtlichen Primärquelle; Fertigstellungszahlen ebenso.
17. PLZ ↔ Gemeinde (m:n) fehlt (`plz-gemeinde.csv`); `resolve.mjs` findet PLZ daher nicht.
18. Quellnotiz Destatis nennt 10.943 Gemeinden/12.591 Gebiete, CSV enthält 10.940/12.588 (3 per `ausschluss` entfernt) – im Export dokumentieren.
