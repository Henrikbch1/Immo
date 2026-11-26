# 05 – Daten und Wissen

**Stand:** 26.11.2026 · Grundlagen: `../research/13-ic-akquise-markt-gebiete.md` (§1 Datenbestand, §1.8 Datenvertrag, §8 Lücken),
`../research/20-web-markt-daten-immocation.md` (§B Marktwerte, §C Rechtsänderungen, §D Datenquellen + Lizenzen),
`../research/10/11/12-…` (Lücken je Fachgebiet). Entscheidungen E3 (echte Regionen, generierte Objekte), E4 (Start heute + Historie), E6 (IC = Wissensquelle).

---

## 1. Grundsatz: Zwei Repos, klare Rollen

| | **IC-Repo (Vault)** | **Immo-Repo (Spiel)** |
|---|---|---|
| Rolle | Single Source of Truth für **Fakten**: Regeln, Sätze, Fristen, Kennzahlen, Regionaldaten, Quellen | **Spielmechanik**: Modelle, Balancing-Annahmen (DESIGN), Zufall, UI-Texte |
| Format | Markdown + Frontmatter, `40-Daten/*.csv`, Schemas | TypeScript, JSON-Datenpakete |
| Qualität | `vault-lint`, Sicherheit A/B/C, `gueltigkeit`, `stand` | Tests, Kalibrierung, Status-Flags |
| Pflege | Skills `vault-ingest`, `vault-pflege`; Agents `vault-kurator`, `immo-wissen` | Skills/Agents aus `07-ki-workflow.md` |
| Schnittstelle | `tools/export-spiel.mjs` → versioniertes Paket | `packages/data` importiert Snapshot |

**Regel:** Eine Fachzahl, die im Spiel als Fakt erscheint, muss im Vault stehen (oder ist sichtbar **GESCHÄTZT**).
Neue Fachwerte werden **zuerst im Vault** mit Quelle erfasst, dann exportiert – nie direkt im Spielcode „gefixt“.

---

## 2. Bestand heute (Ergebnis der Recherche)

| Datenbestand | Zustand | Nutzbarkeit |
|---|---|---|
| `gebiete.csv` – 12.588 Gebiete (16 Länder, ~400 Kreise, Gemeindeverbände, 10.940 Gemeinden), Destatis-Stand 30.09.2026 | vollständig, Stufe 3 | **sofort** als Regionsgerüst + Karte (mit VG250) |
| Destatis-Importbasis (Einwohner, Fläche, Koordinaten, PLZ des Sitzes, DEGURBA) | vorhanden, aber **nicht importiert** | **größter schneller Hebel** – Import im IC erweitern |
| `datenpunkte.csv` | 2 Werte (Stadt Bremen) | praktisch leer |
| `20-Regeln/`, `regeln-index.csv` | leer (118 Altwerte nur Bremer Raum in `berichte/regelwerte-alt.csv`) | Regeln bisher nur in Fließtext-Notizen |
| Fachnotizen Finanzierung/Steuern/Vermietung/WEG/Bau | Struktur sehr gut, viele Werte Stand 2020/21, oft `gueltigkeit: unbekannt` | Regeln und Formeln belegbar; Häufigkeiten/Dauern/Preise meist **Lücke** |
| Marktwerte Nov. 2026 (Web-Recherche) | Bauzins 10 J. ≈ 4,0–4,5 %, EZB 2,50 %, GREIX ETW −0,2 % ggü. Vorjahr, Angebotsmieten +3,7 %, GrESt-Tabelle aller Länder, ESt-Eckwerte 2026 | **in den Vault übernehmen** (Strang W) |

**Konsequenz:** Für das freie Spiel ab Nov. 2026 brauchen wir vor allem **regionale Kaufpreise, Mieten, Leerstand,
Bevölkerungsentwicklung** und **Zeitreihen** (Zins, Preise, Mieten, Inflation). Ohne sie bleibt das Regionsmodell geschätzt.

---

## 3. Export-Datenvertrag Vault → Spiel (Kurzfassung)

Volle JSON-Schema-Skizze: `../research/13-…` §1.8. Kernpunkte:

```
spiel-export/<version>/
├─ manifest.json     schema_version, vault_stand, export_datum, stichtag_regeln, lizenzhinweise[]
├─ quellen.json      quelle_id, titel, herausgeber, stufe 1–5, url, lizenz, veroeffentlicht, abgerufen_am
├─ regionen.json     id (ARS), name, ebene, parent_id, land_ars, kreistyp, gemeindetyp, degurba, einwohner, flaeche, koordinaten
├─ kennzahlen.json   region_id, kennzahl, wert, einheit, segment, datentyp (transaktion|angebot|bestand|prognose),
│                    stichtag, zeitraum, fallzahl, quelle_id, sicherheit A/B/C, status (gemessen|abgeleitet)
├─ regeln.json       regel_id, thema, geltungsbereich (Region/Land/Bund), wert, einheit, objektarten, gueltig_ab/bis, quelle_id
├─ parameter.json    fachliche Parameter (Bankprofile, AfA-Sätze, Fristen, Kostensätze) mit Status, Quelle, Stand
├─ zeitreihen/       zins_10j.json, vpi.json, hpi_etw.json, mietindex.json … (Monat/Quartal, Quelle)
└─ glossar.json      Begriff, Kurzerklärung, Vault-Notiz, Stand (für Erklär-Karten und Akademie)
```

**Umgang mit fehlenden Werten (im Spiel, `packages/data`):**
1. Wert der Region vorhanden → verwenden (BELEGT, mit Sicherheit A/B/C).
2. Sonst: Ableitung aus übergeordneter Ebene × Strukturfaktor (Kreistyp, DEGURBA, Einwohnerklasse, Lageklasse) →
   **GESCHÄTZT**, mit Ableitungsweg in der Erklär-Karte („geschätzt aus Kreis Diepholz × Faktor ländlich“).
3. Sonst: Bundeswert × Faktor → GESCHÄTZT (niedrigste Stufe), deutlich markiert.
4. Die UI zeigt pro Region einen **Datenqualitäts-Indikator** (z. B. „5 von 8 Kennzahlen gemessen“).

---

## 4. Datenquellen für die Lücken (mit Lizenz)

Aus `../research/20-…` §D; Bewertung für eine spätere kommerzielle App.

| Bedarf | Quelle | Granularität | Lizenz | Status |
|---|---|---|---|---|
| Verwaltungsgrenzen (Karte) | **BKG VG250 / VG250-EW** | Land → Gemeinde | dl-de/by-2.0, Pflichtvermerk „© BKG (Jahr) dl-de/by-2-0“ | ✅ nutzbar |
| Bevölkerung, Haushalte, Wohnungsbestand, Bautätigkeit | **Destatis GENESIS** / Regionaldatenbank | Bund … Gemeinde | dl-de/by-2.0 (Regionaldatenbank: prüfen) | ✅ / prüfen |
| Bestandsmiete, Leerstand, Baujahr, Heizung | **Zensus 2022** (Gitter 100 m/1 km, Gemeinde) | sehr fein | „frei mit Namensnennung“, Lizenzname offen | prüfen |
| Strukturindikatoren (Demografie, Wirtschaft, Erreichbarkeit) | **INKAR (BBSR)** | Kreise, Verbände | „kostenfrei, auch kommerziell“ (lt. Aussage), formal offen | prüfen |
| Bevölkerungsprognose | **BBSR Raumordnungsprognose 2045** | Kreise | offen | prüfen |
| Arbeitslosenquote | **Statistik der BA** | Kreise | frei mit Quellformel + Link | ✅ mit Auflagen |
| Zinsen (Wohnungsbaukredite), Bundrenditen | **Bundesbank SDMX-API** (SUD116/118/119, SU0046) | Bund, monatlich, ab 2003 | ESZB-Weiterverwendungsregeln (Wortlaut prüfen) | voraussichtlich ✅ |
| Preisindizes | **Destatis HPI**, **GREIX** (ab 1960, Städte), vdp, Europace EPX | Bund/Städte | Destatis ✅; GREIX/vdp/EPX: **Lizenz klären** | teils prüfen |
| Bodenrichtwerte | **BORIS-D**; NRW/Berlin dl-de/zero-2.0; Bayern **nicht** offen | Zone | je Land | gemischt |
| Kaufpreise/Rohertragsfaktoren | Gutachterausschüsse (NRW offen, andere oft kostenpflichtig) | Kreis/Stadt | gemischt | nur offene Länder |
| Mietspiegel | Gemeinden | Gemeinde | Urheberrecht unklar | nur als Parameter-Inspiration, nicht 1:1 |
| **Nicht verwenden** | Portaldaten (ImmoScout24, Immowelt), RIWIS, kostenpflichtige Berichte ohne Vertrag | – | – | ❌ |

**In-App-Screen „Datenquellen & Lizenzen“** (P8, Grundgerüst P2): je Datensatz Herausgeber, Datensatz/URI, Stand,
Lizenzkürzel + Link, Hinweis „bearbeitet/aggregiert“. Spielwerte nur aggregiert/abgeleitet speichern.

---

## 5. Zeitreihen für Marktpfade und historische Szenarien

| Reihe | Quelle | Zeitraum | Nutzung |
|---|---|---|---|
| Effektivzins Wohnungsbaukredite (fest 5–10 J., > 10 J.) | Bundesbank | 2003– (monatlich) | Zinspfad, Szenarien H1–H4, Kalibrierung Zinsmodell |
| Umlaufrendite / 10-j. Bund | Bundesbank | lange Reihen | Treiber des Bauzinses |
| VPI, Nettokaltmietenindex | Destatis | lange Reihen | Inflation, Mietentwicklung |
| Häuserpreisindex | Destatis | 2000– (quartalsw.) | Preis-Zyklen |
| GREIX (ETW/MFH/EFH, Städte) | Kiel Institut | 1960– | lange Zyklen, Stadtunterschiede (Lizenz klären) |
| Baupreisindex | Destatis | lange Reihen | Renovierungs-/Baukosten |
| Bevölkerung, Haushalte | Destatis/BBSR | jährlich + Prognose | regionale Nachfrage |

Die Reihen werden über `tools/import/` abgerufen, im Vault als Quelle (Q-Notiz) + CSV in `40-Daten/` abgelegt
und exportiert. Das stochastische Marktmodell der Zukunft wird an ihnen **kalibriert** (`02-…` §2.1).

---

## 6. Strang W – Wissens-Härtung (parallel zu allen Phasen)

**Ziel:** Jede Phase startet mit belegten Parametern für die Systeme, die sie baut. Lücken werden nicht im Spiel geraten,
sondern im Vault geschlossen.

### 6.1 Ablauf je Lücke
1. Lücke steht im **Lücken-Register** (`02-simulationsmodell.md` §5) mit Priorität = Phase, die sie blockiert.
2. Recherche (Web, Primärquelle bevorzugt) → **Q-Notiz** im Vault (`vault-ingest`), Wert in Fachnotiz/CSV mit Stand und Sicherheit.
3. `node tools/build-uebersichten.mjs vault` und `node tools/vault-lint.mjs vault` → 0 Befunde.
4. `export-spiel.mjs` → neue Paketversion → `packages/data` aktualisieren → Status im Spiel wechselt von GESCHÄTZT auf BELEGT.

### 6.2 Priorisierte Lücken (Auszug; vollständig im Lücken-Register)

| Prio | Lücke | Blockiert | Quelle (Vorschlag) |
|---|---|---|---|
| A1 | Einwohner/Fläche/Koordinaten/DEGURBA in `gebiete.csv` | P2 | Destatis-Importbasis (Import erweitern) |
| A2 | Zins-, VPI-, HPI-, Mietindex-Zeitreihen | P2 | Bundesbank, Destatis, GREIX |
| A3 | Regionale Kaufpreise und Mieten (Kreisebene, Segmente) | P2/P3 | Zensus 2022 (Bestandsmiete), Gutachterausschüsse (offen), BORIS, Mietspiegel-Parameter |
| A4 | Leerstand, Wohnungsbestand, Bevölkerungsprognose, Arbeitslosenquote | P2/P3 | Zensus 2022, BBSR, BA |
| A5 | Grunderwerbsteuer-Tabelle, ESt-Tarif 2026, AfA-Sätze, Kappungs-/Mietpreisbremse-Gebiete als **Regeln** | P1/P3 | Web-Recherche Nov. 2026 + Landesverordnungen |
| B1 | Leerstandsdauer, Fluktuation, Mietausfallquoten, Räumungsdauer/-kosten | P4 | Studien (GdW, Haus & Grund, Destatis), Gerichtsstatistik |
| B2 | Bauteil-Lebensdauern, Instandhaltungskosten je m², Renovierungskostensätze 2026 | P4 | Paritätische Lebensdauertabellen, II. BV, Baupreisindex |
| B3 | Hausgeldhöhen, Verwalterkosten je Einheit, Versicherungsprämien | P4 | Verbände, Marktübersichten |
| B4 | Funnel-Dauern (Bankzusage, Notar, Grundbuch), Notar-/Grundbuchkosten nach GNotKG statt Pauschale | P3 | GNotKG-Tabellen, Praxisquellen |
| B5 | Verhandlungsspannen je Marktphase, Kaufpreisfaktoren je Lage/Objektart | P3 | Gutachterausschüsse (Rohertragsfaktoren), Marktberichte |
| C1 | Steuer: Drei-Objekt-Grenze/gewerblicher Grundstückshandel, Grundsteuer-Modelle je Land, Hebesätze | P4/P7 | BMF-Schreiben, Destatis Hebesätze |
| C2 | Renditeschwellen nach Zinswende, Fallstudien 2023–2026 | P6 | immocation 2025/26, eigene Recherche |

### 6.3 Aktualität und Rechtsstände
- **Jahreswechsel-Routine** (jeden Dezember): ESt-Tarif, GrESt-Sätze, CO₂-Preis, Förderprogramme, Mietrecht prüfen →
  neue `rulesVersion` (z. B. `de-2027.1`).
- **Offene Rechtsvorhaben** (Stand Nov. 2026): Mietrecht II (Indexmiete, Möblierung), ESt-Reform 2027, CO₂-Preis 2027
  (Bundesrat), GModG-Stufen 2027/2028/2030, §§ 5/6 GrEStG – als **Politik-Ereignisse mit Wahrscheinlichkeit** im freien Spiel,
  nicht als Fakt.
- Vault-Werte mit `gueltigkeit: unbekannt` werden priorisiert geprüft, bevor sie in einen Release gehen.

---

## 7. Content aus dem Vault

- **Glossar und Erklär-Karten:** Kurzerklärungen (1–3 Sätze) aus den Tooltip-Abschnitten der Recherche
  (`10-…` §5, `11-…` §6, `12-…` §8, `13-…` §7) → `glossar.json` → Paket `content`.
- **Lektionen:** 22 Kernlektionen (`14-…` §6) → Mikro-Lektionen in der Akademie, je mit Vault-Link und Stand.
- **Ereignistexte:** aus Ereigniskatalogen (`12-…` §6, `11-…` §4), fachlich geprüft durch Subagent `fach-pruefer`.
- **Disclaimer:** zentral, mit Stand der Daten („Rechtsstand de-2026.2, Datenstand Vault 30.09.2026“).
