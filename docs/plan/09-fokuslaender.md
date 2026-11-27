# 09 – Fokusländer Niedersachsen, Nordrhein-Westfalen, Bremen

**Stand:** 27.11.2026 · Entscheidung E7 · Grundlage: `../research/24-web-laender-nds-nrw-hb.md`, `../research/23-web-bundeswerte-2026.md`, Vault-Notizen `Regionale-Rechtsmatrix`, `Marktdaten-Bremen-und-Umland`.

> **Wichtig zur Belastbarkeit:** Alle Werte aus der Webrecherche stammen aus Suchtreffern, nicht aus gelesenen Primärtexten (Webzugriff auf amtliche Seiten war gesperrt). Sie gelten im Spiel zunächst als **GESCHÄTZT** und werden im Strang W gegen Primärquellen geprüft, bevor sie `BELEGT` werden. Spiel- und Lernwirkung (Regelmechanik) hängt davon kaum ab; Zahlenwerte schon.

---

## 1. Zweck und Prinzip

- Für die drei Länder soll das Spiel **regelseitig vollständig** (Landesregeln, Gemeindelisten) und **datenseitig am besten** (Kennzahlen, Bodenrichtwerte, Marktberichte) sein. Übrige Länder: Bundesregeln + Status GESCHÄTZT + sichtbarer Hinweis.
- **Regeln werden je Gemeinde modelliert, nicht je Land** (Mietpreisbremse, Zweckentfremdung, Hebesatz). Länderpauschalen wären falsch (Beispiel: Delmenhorst ≠ Achim, beide im Bremer Umland).
- Keine Rechtsberatung; jede Regel trägt `gueltig_ab/bis`, Quelle, Stand, Status.

## 2. Regelsteckbrief je Land

Spalten: **Wert** · Status (`B` = Sekundärquelle, `C` = unklar/widersprüchlich, `V` = Vault vorhanden). Alles → LR-Einträge in §10.

| Regel | Niedersachsen | NRW | Bremen |
|---|---|---|---|
| Grunderwerbsteuer | 5,0 % (B, V) | 6,5 % (B, V) | 5,5 % seit 01.07.2025 (V; Datum in Webrecherche nicht bestätigt) |
| Mietpreisbremse | Nds. Mieterschutz-VO, gilt 01.01.2026–31.12.2029; **57 Gemeinden** (Datum der Neufassung 27.11. oder 03.12.2025 unklar) (B/C) | MietSchVO NRW 28.01.2025, geändert 28.10.2025; 01.03.2025–31.12.2029; **57 Gemeinden** (vorher 18) (B) | Mietenbegrenzungs-VO 18.11.2025; 01.12.2025–31.12.2029; **nur Stadt Bremen** (B, V) |
| Kappungsgrenze 15 % | in Gebieten der Mieterschutz-VO (B) | 57 Gemeinden (B) | Stadt Bremen 15 %; Bremerhaven 20 % (V); Laufzeit unklar (C) |
| Kündigungssperrfrist § 577a Abs. 2 BGB | 10 Jahre (VO 2022), Inseln/Sonderfälle 5 J.; Fassung 2026 offen (C); Vault: 5 J. in gelisteten Umlandgemeinden | **nicht gefunden** | **nicht gefunden** |
| Umwandlungsgenehmigung § 250 BauGB | VO bis spätestens 31.12.2029 (C) | nicht gefunden; § 201a-Gebietsbestimmung bis 31.12.2026 (C) | keine § 250-VO (Senat 02/2026: kein Bedarf) (B) |
| Zweckentfremdung | Hannover: Satzung seit 11.07.2025 (nur frei finanziert); Göttingen nicht gefunden | Wohnraumstärkungsgesetz (WohnStG, seit 07/2021): Köln (Satzung 05/2026), Münster (2022), Bonn (2022), Düsseldorf unklar | Wohnraumschutzgesetz: > 90 Tage Ferienvermietung, Leerstand > 6 Monate (V, Stand 25.09.2026) |
| Grundsteuermodell | **Flächen-Lage-Modell** (Äquivalenz 0,04 €/m² Boden, 0,50 €/m² Gebäude, Messzahl 0,7 Wohnen, Lagefaktor) (B, V) | Bundesmodell; differenzierte Hebesätze Wohn/Nichtwohn zulässig, aber VG Gelsenkirchen 12/2025: in Bochum/Essen/Dortmund/Gelsenkirchen unzulässig, Rechtsmittel offen (B) | Bundesmodell laut Vault/Haufe (Haus & Grund widerspricht) (C) |
| Hebesatz Grundsteuer B | Hannover 700 **oder** 900 (C) | Düsseldorf 374, Bonn 680, Köln 475 oder 515, Dortmund ≈ 610–625, Essen 655–670 (C) | 695 oder 755 (C) |
| Solarpflicht Wohngebäude | § 32a NBauO seit 01.01.2025: Neubau, Dacherneuerung; ≥ 50 % Dachfläche ab 50 m² (V) | § 42a BauO NRW: Neubau seit 2025, Dachvollerneuerung ab 01.01.2026; 30 % der Netto-Dachfläche (B) | Neubau ab 07/2025, grundlegende Dachsanierung ab 07/2024 (V); Deckungsgrad uneinheitlich (C) |
| Straßenausbaubeiträge | Kann-Regel; viele Gemeinden erheben noch (V) | abgeschafft, Land trägt 100 % (B) | Bremen: keine; Bremerhaven: erhebt (B) |
| Rauchwarnmelder (Wartung Mietwohnung) | Bewohner, außer Eigentümer übernimmt (B) | überwiegend Bewohner (B) | widersprüchlich (C) |
| Besonderheiten | Samtgemeinde-Strukturen: Verordnungen nennen teils Samtgemeinden, teils Mitgliedsgemeinden (V) | WohnStG/Wohnungsaufsicht, landesweite Kontrollen gegen Problemimmobilien (B) | Stadtgemeinde Bremen ≠ Land ≠ Bremerhaven (V) |

**Spielmodell-Folgerungen** (→ `02` §2.8/2.13/2.14):
1. `rules` bekommt je Regel einen **Geltungsbereich auf Gemeindeebene** (`ags[]`), nicht nur `land`.
2. Grundsteuer: drei Rechenwege (NDS Flächen-Lage; Bundesmodell NRW/HB; Fallback andere Länder). Hebesatz als Parameter je Gemeinde mit Status.
3. Politik-Ereignisse mit Datum: **31.12.2026 § 201a NRW**, **31.12.2029 Ablauf Mietpreisbremse-Verordnungen aller drei Länder** (Verlängerung als Ereignis mit Wahrscheinlichkeit; vgl. 02 §2.14).
4. Gerichtsstreit NRW-Hebesätze → Politik-/Rechtsereignis „Differenzierung unzulässig“ als Lernfall (Vorsicht: nur nach Klärung des Standes).

## 3. Bundesvorgaben, die für alle drei Länder gelten (Kurz, aus `23`)

| Thema | Stand | Status |
|---|---|---|
| Mietpreisbremse bundesweit | verlängert bis 31.12.2029 | B |
| GModG | in Kraft seit 29.07.2026, EPBD-Teile ab 01.01.2027 | B (Bundesregierung-Seite: A-) |
| Mietrecht II | Kabinett 29.04.2026, 1. Lesung Juli 2026; **Beschluss nicht belegt** → Politik-Ereignis `zukünftig`, kein Rechtsstand | C |
| CO₂-Preis | 2026: 55–65 €/t; 2027: Korridor-Verlängerung **nur als Entwurf** belegt | B/C |
| EZB-Einlagesatz / Bauzins 10 J. | 2,50 % (seit 16.09.2026) / ≈ 4,3 % (Interhyp 4,3; Dr. Klein 4,29; Nov. 2026) | A-/B |
| ESt-Tarif 2026 | Grundfreibetrag 12.348 €; Zone 2 (914,51·y+1.400)·y; Zone 3 (173,10·z+2.397)·z+1.034,87; Zone 4 0,42·x−11.135,63; Zone 5 0,45·x−19.470,38 | **A – am 27.11.2026 gegen den Gesetzestext (gesetze-im-internet.de, § 32a) geprüft; Rundung: zvE und Steuerbetrag je auf volle Euro abgerundet** |
| Soli-Freigrenze 2026 | 20.350 € / 40.700 € | B |
| Degressive AfA § 7 Abs. 5a | 5 %, Bau-/Erwerbszeitfenster 01.10.2023–30.09.2029; Verlängerung nicht gefunden | B |
| WEG-Stimmrecht § 25 Abs. 2 | Kopfprinzip, durch Vereinbarung änderbar | B |

## 4. Referenzdaten und Quellen je Land

| Land | Stelle | Was vorhanden | Offene Punkte |
|---|---|---|---|
| NDS | Oberer Gutachterausschuss / LGLN; Landesgrundstücksmarktdaten 2026 (02.02.2026) | Umsätze, Verträge; Preise teils nur als Karte | WFS/Lizenz/Format **nicht gefunden**; Zugriff über Geoportal klären |
| NRW | Oberer Gutachterausschuss; Grundstücksmarktbericht 2026 (kostenlos, boris.nrw.de); open.nrw (Bodenrichtwerte, Grundstücksmarktdaten) | beste offene Lage; Lizenz vermutlich dl-de/zero-2.0, je Datensatz prüfen | WFS nicht belegt |
| HB | Gutachterausschuss (Landesamt GeoInformation) | Marktbericht 2026 als Auszug frei, Vollbericht kostenpflichtig; Mietspiegel 2024, Fortschreibung 2026 | Lizenz/WFS nicht gefunden; Vollbericht **nicht** nutzen ohne Vertrag |
| alle | Destatis (Einwohner, Fläche, Koordinaten, DEGURBA), Zensus 2022, BA, BBSR | siehe `05` §4 | Import in IC (Paket 2.1) |

Marktkennzahlen (alle B, nicht amtlich geprüft): ETW-Erstverkauf mittlere Lage 2025 (NRW-Bericht 2026): Düsseldorf ≈ 7.040, Münster 6.615, Köln 6.490, Bonn 6.295 €/m²; Dortmund Neubau ≈ 4.550. Bremen: ETW-Weiterverkauf Ø 2.520 €/m² (Vault, C), Angebotsmiete ≈ 10,5–12,5 €/m² (C). Für Hannover, Essen, Oldenburg, Osnabrück, Braunschweig: **nicht gefunden** – GESCHÄTZT über Kaskade (Einwohnerklasse, DEGURBA, Lageklasse).

## 5. Förderung (Kurz, nur als Spielhintergrund; Details P7)

- NDS: NBank, Richtlinie Förderung von Mietwohnraum 2026 (ab 01.07.2026).
- NRW: NRW.BANK Mietwohnraumförderung Modernisierung (Mietbindung, ≥ 4 Wohnungen, Konditionen unklar).
- HB: nicht gefunden.
- Spielwirkung: Förderung nur als Option mit Bindung (Miete/Belegung) – bildet den Zielkonflikt Rendite ↔ Bindung ab.

## 6. Kuratierte Referenzregionen (Vorschlag, [DES])

Zweck: Lernpfad-Orte, Balancing-Suite, Tests. Auswahl deckt alle Lageklassen und Rechtsfälle ab. Archetyp = Lernschwerpunkt, nicht Marktaussage.

| # | Region | Land | Lageklasse (02 §2.2) | Archetyp / Lernfall |
|---|---|---|---|---|
| R01 | Stadt Bremen | HB | A | Mietpreisbremse, Mietspiegel, Wohnraumschutz, Bremer Haus |
| R02 | Bremerhaven | HB | B | Kappung 20 %, Straßenbeiträge, schrumpfende Lagen |
| R03 | Hannover | NDS | A | Zweckentfremdungssatzung, Mietpreisbremse, Hebesatz hoch |
| R04 | Braunschweig | NDS | B | Mietpreisbremse, Uni-/Industriestadt |
| R05 | Osnabrück | NDS | B | Uni, Wachstum |
| R06 | Oldenburg | NDS | B | teuer für Größe, Uni |
| R07 | Göttingen | NDS | B | Studentenmarkt, Kleinwohnungen |
| R08 | Wolfsburg | NDS | B | Ein-Arbeitgeber-Risiko (VW) |
| R09 | Delmenhorst | NDS | B/C | ohne Mietpreisbremse im Bremer Umland |
| R10 | Weyhe/Stuhr/Achim (Umland HB) | NDS | C | Pendlerumland, MPB-Gemeinden |
| R11 | Emsland (Meppen/Lingen) | NDS | C/D | ländlich, niedrige Preise, Gewerbe |
| R12 | Cuxhaven / Küste | NDS | C | Tourismus, Zweitwohnung |
| R13 | Köln | NRW | A | teuer, Wohnraumschutzsatzung, Milieuschutz |
| R14 | Düsseldorf | NRW | A | Spitzenpreise, Kaufpreisfaktoren hoch |
| R15 | Münster | NRW | A/B | Uni, teuer, Satzung |
| R16 | Bonn | NRW | A/B | einheitlicher Hebesatz, Satzung |
| R17 | Dortmund | NRW | B | Ruhrgebiet, Umbau, Hebesatzstreit |
| R18 | Essen | NRW | B | Nord-Süd-Gefälle, Hebesatzstreit |
| R19 | Duisburg / Gelsenkirchen | NRW | B/C | Schrottimmobilien, hohe Rendite, hohes Risiko |
| R20 | Bielefeld / Paderborn | NRW | B | Mittelstadt, Uni |
| R21 | Aachen | NRW | B | Studentenmarkt, Grenzlage |
| R22 | Sauerland/Siegerland (Hagen, Siegen) | NRW | C | Bevölkerungsrückgang |
| R23 | Eifel / Kreis Euskirchen | NRW | D | ländlich, Hochwasserrisiko (Ahr/Erft) als Lernfall |

(23 Regionen; der Vorschlag lässt Raum für „dein Wohn-/Zielort“, siehe `RUECKFRAGEN.md`.) Je Referenzregion in P2: vollständige Kennzahlen mit Status, Mietrechtsflags, Hebesatz, Besonderheit; für die übrigen ca. 12.500 Gebiete nur Kaskaden-Schätzung.

## 7. Objektarchetypen je Region ([DES], vom Fachprüfer zu bestätigen)

Der Angebotsgenerator (02 §2.3) zieht Objekte aus Archetypen mit Baujahr-, Zustands- und Typverteilung. Regionale Prägung (qualitative Beschreibung, **keine** Marktprozentwerte; die Verteilungen sind in P3 als `[GES]` zu füllen):

| Archetyp | Typische Regionen | Lernpunkt |
|---|---|---|
| Altbau-ETW Gründerzeit/Vorkrieg | Hannover, Bremen, Köln | Instandhaltungsstau, WEG-Rücklage, Denkmal |
| Nachkriegs-Mehrfamilienblock 1950–70er | Ruhrgebiet, Hannover, Bremerhaven | Energie, Mietbindung, Modernisierung |
| Bremer Haus / Reihenhaus | Bremen | EFH/Mehrfamilien-Umbau, Wertstabilität |
| Zechensiedlung / Werkssiedlung | Ruhrgebiet | günstig, Sanierungsbedarf, soziale Lage |
| Neubau-ETW | Großstädte | Neubau-AfA, hohe Preise, KfW |
| Großwohnsiedlung 1970er | Duisburg, Bremen-Nord, Hannover | hohe Rendite, Klumpenrisiko, Verwaltung |
| Studentenapartment / Mikro | Münster, Göttingen, Aachen, Osnabrück | Möblierung, Fluktuation |
| Landhaus/EFH ländlich | Emsland, Eifel, Sauerland | Verkaufbarkeit, Heizöl, Leerstand |
| Ferien-/Zweitwohnung | Küste (Cuxhaven) | Zweckentfremdung, Nutzungsrecht |

## 8. Ergänzungen zur Wissens-Härtung (Strang W)

Priorität für Fokusländer (erster Batch ≤ 20 Notizen, Freigabe durch dich):

| # | Batch | Inhalt | Vault-Ziel | LR |
|---|---|---|---|---|
| W-A1 | Mietrecht Gemeindelisten | Primärtexte der drei Verordnungen, Gemeindelisten (Mietpreisbremse, Kappung, Sperrfrist, § 250) | `20-Regeln` | LR-41 |
| W-A2 | Grundsteuer | Modelle, Hebesätze 2026 der 23 Referenzregionen aus Satzungen | `40-Daten/hebesaetze.csv` | LR-32 |
| W-A3 | Bodenrichtwerte/Marktberichte | Zugang, Lizenz, Format; Kennzahlen für Referenzregionen | `40-Daten/datenpunkte.csv` | LR-05/06 |
| W-A4 | Zweckentfremdung/Wohnraumschutz | Satzungen NDS/NRW/HB | `30-Wissen/Recht` | LR-41 |
| W-A5 | Steuern Bund | ESt § 32a 2026 gegen Primärtext, Soli, AfA-Fenster | `20-Regeln` | LR-21/26 |
| W-A6 | Bund Mietrecht II/GModG/CO₂ | Stand und Inhalte aus Primärquellen | `30-Wissen` | LR-45/48 |

**Voraussetzung:** Für die Primärprüfung muss Webzugriff auf amtliche Seiten möglich sein (gesetze-im-internet.de, recht.nrw.de, gesetzblatt.bremen.de, niedersachsen.de, bundesbank.de, boris.*). In dieser Sitzung waren diese Hosts gesperrt → siehe `RUECKFRAGEN.md` Q3.

## 9. Datenbedarf der historischen Szenarien (Ergänzung zu `01` §4.2)

| Szenario | Zeitreihen | Regelstände (`rulesVersion`) | Regionalbezug |
|---|---|---|---|
| H1 2008–2012 | Bauzins (Bundesbank SUD119/SU0046), VPI, HPI (Destatis; GREIX nach Lizenz), Mietindex | ESt-Tarif 2008–12, AfA, GrESt-Sätze je Land und Jahr (Primärwerte erheben, LR-64), noch keine MPB | Referenzregionen R01, R03, R13 |
| H2 2012–2021 | wie H1 + Baupreisindex | MPB ab 2015 (Gemeinden je nach VO-Stand erheben), GrESt-Änderungen je Land (erheben), Kappung | Städte-HPI |
| H3 2020–2021 | Corona-Reihen, Zins | Mietmoratorium (Vault historisch), Kündigungsschutz | wenige Regionen |
| H4 2021–2025 | Zinsreihen, GREIX/HPI, Baupreise | GEG→GModG, CO₂-Preis, Reform Grundsteuer 2025, MPB-Verlängerung | alle Referenzregionen |

(Historische Landesregeln sind noch nicht erhoben → LR-22/40/64.)

## 10. Neue/geschärfte Lücken-Einträge (zum Lücken-Register in `02` §5)

| ID | Lücke | Phase |
|---|---|---|
| LR-57 | Gemeindelisten Mietpreisbremse/Kappung/Sperrfrist/§ 250 für NDS, NRW, HB aus Primärtext (inkl. Daten der Neufassungen) | P2 |
| LR-58 | Grundsteuer-Hebesätze 2026 der Referenzregionen (Satzungen), Bremer Grundsteuermodell, NRW-Rechtsstreit | P2 |
| LR-59 | Zugang/Lizenz/Format der Bodenrichtwerte und Marktdaten NDS, NRW (WFS), HB | P2 |
| LR-60 | Zweckentfremdung/Wohnraumschutz je Fokusstadt, Wohnungsaufsicht NDS/HB | P4 |
| LR-61 | Landesförderung (NBank, NRW.BANK, Bremen) Konditionen | P7 |
| LR-62 | Solarpflicht-Details je Land (Deckungsanteil, Auslöser, Ausnahmen); Rauchmelder-Zuständigkeit HB | P4 |
| LR-63 | Amtliche Kaufpreise/Mieten Hannover, Essen, Bremen, Oldenburg, Osnabrück, Braunschweig | P2/P3 |
| LR-64 | Historische Landesregeln (GrESt-Sätze, MPB-Verordnungen) für H1–H4 | P6 |

**Pflege (G-09):** Jahreswechsel (Hebesätze, Verordnungs-Änderungen), 31.12.2026 (§ 201a NRW), 2029 (Auslauf Verordnungen), Mietrecht II (Beschluss), GModG-Stufen 01.01.2027.
