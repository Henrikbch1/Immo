# 20 – Web-Recherche: immocation, Marktlage, Recht/Steuern, offene Daten, Vergleichs-Tools

> **Stand:** 26.11.2026 (alle Web-Abrufe an diesem Tag, sofern nicht anders vermerkt)
> **Zweck:** Grundlagen für den Neuaufbau eines realistischen Immobilien-Investment-Trainingsspiels (Deutschland).
> **Ergänzt** den internen Vault `/home/user/IC/vault` (57 immocation-Quellennotizen in `90-Quellen/Anbieter/immocation/`, `30-Wissen/Markt-und-Standort/Marktdaten-Quellenkatalog.md`, `30-Wissen/Recht/Regionale-Rechtsmatrix.md`, `30-Wissen/Bau-und-Energie/Gebaeudemodernisierungsgesetz.md` u. a.). Was dort schon steht, wird hier nur referenziert („→ Vault“) und – wo nötig – aktualisiert.

## Methode, Grenzen, Legende

- **Werkzeuge:** Ausschließlich WebSearch (Standard/„extended“). WebFetch war für Hosts außerhalb der Netzwerk-Allowlist der Sitzung gesperrt (z. B. `it-boltwise.de`, `hausbesitzer-news.de`); Primärseiten wurden daher **nicht vollständig gelesen**, sondern über Suchergebnis-Auszüge ausgewertet. Zahlen, die im Spiel als Kalibrierwerte dienen, sollten vor Übernahme einmal direkt an der Primärquelle (Destatis, Bundesbank, Kiel Institut, vdp, Europace, BGBl./Bundestag) gegengeprüft werden.
- **Keine Rechts- oder Steuerberatung.** Gesetzesstände sind Momentaufnahmen.
- **Sicherheitsstufen** (in Tabellen Spalte „S“):
  - **A** – Primär-/Amtsquelle im Suchergebnis direkt zitiert (Destatis, Bundesbank, BaFin, Bundestag, Kiel Institut, vdp, Europace, KfW, BKG)
  - **B** – mehrere unabhängige Sekundärquellen übereinstimmend
  - **C** – einzelne Sekundärquelle oder widersprüchliche Angaben → **unsicher**
  - **T** – Trainingswissen/Vault, in dieser Sitzung **nicht** web-verifiziert → **offen**
- Quellen werden als `[Kürzel]` zitiert; vollständige URL-Liste mit Abrufdatum am Ende.

---

## Kurzfazit (die wichtigsten Zahlen auf einen Blick)

| Größe | Wert | Datum/Zeitraum | S | Quelle |
|---|---|---|---|---|
| EZB-Einlagesatz | **2,50 %** (Hauptrefi 2,65 %, Spitzenrefi 2,90 %), am 29.10.2026 unverändert; Anhebungen im Juni und Sept. 2026 (2,00 → 2,25 → 2,50 %) | 29.10.2026; nächste Sitzung 17.12.2026 | B | [M6][M7][M8][M9][M5] |
| Bauzins 10 J. (effektiv, Vermittler) | **ca. 4,0–4,5 %** (Dr. Klein Topzins 4,07 % am 25.11.; Interhyp 4,3 % am 12.11. bzw. 4,26 %; Finanztip 4,4 %/4,5 % bei 60/80 % Beleihung) | Nov. 2026 | B | [M1][M2][M3][M4][Z1] |
| Bauzins 15 J. | **ca. 4,2–4,55 %** (nur Beispielrechnung/Grafik, kein sauberer Marktdurchschnitt) | Nov. 2026 bzw. unklar | C | [Z1][M3] |
| 10-j. Bundesanleihe | ca. **3,5 %**; im Juni/Juli 2026 15-Jahres-Hoch, Okt. laut Baufi24 17-Jahres-Hoch | Okt. 2026 | B/C | [M34][M35][Z2] |
| Inflation DE (VPI) | **2,8 %**; Nettokaltmieten **+1,9 %** ggü. Vorjahr | Okt. 2026 | A | [M20] |
| GREIX ETW | **−0,2 % ggü. Vorjahr** (erstes Minus seit Q2 2024), +0,5 % ggü. Vorquartal; real −3,0 % | Q3 2026 (veröff. 05.11.2026) | A | [M10] |
| GREIX MFH / EFH | MFH **−2,4 %** ggü. Vorjahr (real −5,2 %, wenige Fälle); EFH +0,9 % | Q3 2026 | A/B | [M10][M12] |
| vdp Wohnen gesamt | **+1,0 %** ggü. Vorjahr, −0,1 % ggü. Vorquartal; Neuvertragsmieten **+3,5 %** | Q3 2026 (veröff. 10.11.2026) | A | [M13] |
| Europace EPX ETW | **216,49 Pkt.**, −0,87 % ggü. Vormonat, −1,24 % ggü. Vorjahr; Gesamtindex 221,61 | Okt. 2026 | A/B | [M15][M16][M17] |
| Destatis Häuserpreisindex | **+0,6 %** ggü. Vorjahr, +0,3 % ggü. Vorquartal | Q2 2026 (veröff. 24.09.2026) | A | [M18] |
| GREIX Angebotsmieten | **+3,7 %** ggü. Vorjahr, +1,2 % ggü. Vorquartal; Ø 37 Städte/Regionen **14,60 €/m²** | Q3 2026 | A | [M11] |
| Baugenehmigungen | Sept. 2026: **20.800 Whg.** (−14,8 %); Jan.–Sept.: **190.200** (+8,4 %) | veröff. 18.11.2026 | A | [M19] |
| Wohn-Investmentvolumen | Q1–Q3 2026 ca. **5,75–6,2 Mrd. €** (je nach Makler), etwa Vorjahresniveau bis −5 % | Q3 2026 | B | [M24]–[M27] |
| Leerstand | Zensus 2022: **4,3 %** aller Wohnungen; CBRE-empirica marktaktiv Ende 2024: **2,2 %** (≈ 522.000 WE) | 15.05.2022 / 31.12.2024 | A/B | [M29][M31] |

---

## A) immocation – Methodik, Aussagen 2025/2026, Übernahme ins Spiel

### A.1 Angebot und Formate (Stand Nov. 2026)

| Format | Inhalt laut Anbieter | S | Quelle |
|---|---|---|---|
| **Masterclass** („in 180 Tagen zum Immobilien-Profi“) | 6 Monate, 12 Module: u. a. *Den richtigen Standort wählen*, *Finanzierung sichern*, *Immobilien suchen und finden*, *Kaufvorgang und Betrieb*, *Solide Kalkulation und Investitionsplanung*, *Erfolgreicher Bestandsaufbau*, *Fix & Flip, Bauträger, Aufteiler*, *Masterplan & Abschluss-Workshop*; >65 h Video (an anderer Stelle >50 h), Coaching-Webinare alle 2 Wochen, Mastermind-Gruppen, >20 Coaches (Investoren, Anwälte, Steuerberater, Gutachter); „TÜV-zertifiziert“; ZFU-Eintrag mit institutsinterner Prüfung | B (Anbieter-Eigenangaben) | [I1][I13][I12] |
| Einstiegsfaustregel Masterclass | Eigenkapital **mind. 20.000–25.000 €**, Netto-Einkommen **mind. 2.000 €/Monat**; zusätzlich Liquiditätspuffer **10.000–20.000 €** für Mietausfall/Reparaturen | C (Suchauszug) | [I1][I4] |
| **Steuerclass** | eigenes 12-Wochen-Programm (Steuern sind kein Masterclass-Modul) | B | [I2] |
| **Kalkulationstool** (Excel) | gratis gegen Newsletter-Anmeldung, „mit ausführlichen Erklärungen (inkl. Steuer)“; kostenpflichtige Variante im Shop; Rendite, Cashflow, Kaufpreisfaktor inkl. Steuer; Darstellung für die Bank | B | [I6][I7] → Vault `Q-immocation-Tool-Kalkulationstool` |
| **Bierdeckelrechnung** (Web + App) | Schnellfilter Bruttomietrendite; App mit „Bierdeckel-Rente“ | B | → Vault `Q-immocation-Tool-Bierdeckelrechnung`, `Q-immocation-Tool-App` |
| Kooperationen | Objektsuche mit **ImmoMetrica** (Landingpage „Objekte finden“); digitale Bewertung über **PriceHubble** für Absolventen; Finanzierung über **Interhyp** | C (nur Seitentitel/Partnermeldung) | [I11][I12][I19] |
| **Webinare 2026** | 10.07.2026 „Marktupdate/Immobilien 2026“ (Marktchancen, Finanzierung, Zinsen, Geopolitik); 05.08.2026 „KI für Immobilienprofis“ (Exposés bewerten, Cashflow rechnen, Dokumente prüfen); 14.10.2026 „So würden wir heute starten“ (Normalverdiener mit ~20.000 € EK: Suchprofil, Objektgrößen, Finanzierung); 28.10.2026 Steuerwebinar mit StB Martin Richter (Holding, Steuerstrategie) | B | [I3][I5][I4][I21][I17] |
| **Podcast** (2026) | u. a. #665 (08.07.2026) Politik-/Marktupdate mit Jürgen Michael Schick; #669 KI für Investoren; **#670 (04.08.2026) „Zinsen auf 15-Jahres-Hoch – was tun?“** (Bundesanleihe ↔ Bauzins); #676/#678 Steuertricks (→ Vault); #677 Photovoltaik-Marktupdate | B/C | [I14] → Vault |
| Weitere | YouTube („immocation TV“), Festival 2026/2027, „Longevity Masterclass“, 10×10-Min-Videokurs | C | [I15][I8][I18][I22] |
| Buch | „Die Do-it-yourself-Rente“ (Ursprung der Bierdeckelrechnung lt. Vault); Neuauflage 2025/26 **nicht belegt** | T/offen | → Vault |

Hinweis: Fast alle Angaben sind Eigenwerbung (Erfolgszahlen, „400+ eigene Immobilien“ der Gründer lt. Vault nicht unabhängig geprüft).

### A.2 Kernmethodik (synthetisiert aus Vault + Web)

Prüftrichter in Stufen – jede Stufe filtert, bevor Zeit/Geld investiert wird:

1. **Standort** (A–D-Lagen, „lohnenswert und zukunftssicher“; → Vault `Q-immocation-Blog-Standortanalyse`).
2. **Schnellfilter „Bierdeckel“**: Bruttomietrendite = Jahreskaltmiete / Kaufpreis. Faktor 20 ≙ 5 % brutto; ab ≈ 5 % „realistische Chance“, dass sich die Wohnung selbst abzahlt (ältere Quelle: ≈ 6 %) [I9] → Vault. Die Schwelle ist **zinsabhängig** (formuliert in der Niedrigzinsphase).
3. **Zweite Bierdeckelrechnung** nach Erstgespräch/Besichtigung (→ Vault `Q-immocation-Blog-Wohnungsbesichtigung`).
4. **Vollkalkulation** (Kalkulationstool): Miete − Bewirtschaftungskosten − Rücklagen − Bankrate = Cashflow vor Steuern; danach Steuer → Cashflow nach Steuern [I16] → Vault.
5. **Objektprüfung** (Unterlagen, WEG, Technik) und **Bankgespräch** (Haushaltsrechnung, Beleihungswert, Portfoliobetrachtung; → Vault `Q-immocation-Blog-Wie-lange-macht-die-Bank-mit`).
6. **Bestandsaufbau/Skalierung**: Kaufpreis voll finanzieren, Nebenkosten aus EK; Puffer; später Holding/vermögensverwaltende GmbH, Aufteiler-, Fix-&-Flip- und Bauträgermodelle als Fortgeschrittenen-Strategien [I1] → Vault.

### A.3 Gelehrte Kennzahlen und Rechenwege

| Kennzahl | Rechenweg (wie bei immocation beschrieben) | Beleg | S |
|---|---|---|---|
| Bruttomietrendite | Jahresnettokaltmiete / Kaufpreis × 100 | Vault, [I9] | B |
| Kaufpreisfaktor | Kaufpreis / Jahresnettokaltmiete (= 1 / Bruttorendite) | [I9] | B |
| Nettomietrendite | (Jahresmiete − nicht umlagefähige Kosten) / (Kaufpreis + Kaufnebenkosten) | Vault `Q-immocation-Blog-9-Steuerkniffe-beim-Kauf` | T |
| Kaufnebenkosten | **5–15 %** des Kaufpreises (GrESt 3,5–6,5 %, Notar/Grundbuch ≈ 2 %, ggf. Makler) | [I9] + Vault | B |
| Bankrate (Annuität, Jahr 1) | Darlehen × (Sollzins + anfängl. Tilgung) / 12 | Vault | B |
| Cashflow vor Steuern | Miete − Bewirtschaftungskosten − Rücklagen (Instandhaltung, Mietausfall) − Rate | [I16] | B |
| Steuerliches Ergebnis | Miete − Werbungskosten (Zinsen, AfA, nicht umlagef. Kosten); Tilgung **nicht** abziehbar | Vault | B |
| Beispiel-Steuerannahmen | Kaufpreisaufteilung 50 % Gebäude / 50 % Boden, AfA 2 % p. a. (Baujahr nach 1925), Grenzsteuersatz 38 % → Beispiel: +65 €/Monat vor Steuern, −9 €/Monat nach Steuern | [I9]/[I10] (Suchauszug) | C |
| Cashflow nach Steuern | Cashflow vor Steuern − Steuerlast (bzw. + Erstattung) | [I16] | B |
| Eigenkapitalrendite | Endvermögen nach 10 Jahren (Wert − Restschuld + kumulierte Cashflows) relativ zum eingesetzten EK, annualisiert | [I10] (Suchauszug) | C |
| Bankperspektive | Mietansatz 75 % (25 % Abschlag), Stresszins 8 %, Beleihungswert ≈ 80 % Marktwert (Stand 2021; laut Vault **keine allgemeingültigen Regeln**) | Vault | T |

### A.4 Aussagen zu Markt, Zinsen, Strategie 2025–2026

- **Mitte 2026** (Webinar 10.07.2026): Markt „fast wöchentlich“ in Bewegung; Iran-Krieg → Inflationssorgen → Notenbanken; Ölpreis; Banken „behäbiger“ mit geänderten Konditionen/Prozessen; **Kaufpreise wieder verhandelbar**; Frage „kaufen, verkaufen oder abwarten?“ (→ Vault `Q-immocation-Webinar-Marktupdate-2026`, S: C, keine Daten).
- **Aug. 2026** (Podcast #670): Einordnung des Zinsanstiegs auf ein 15-Jahres-Hoch über die Bundesanleihe-Rendite [I14] (Inhalt nur aus Titel/Beschreibung, S: C).
- **Okt. 2026**: Botschaft „Einstieg auch mit ~20.000 € EK und normalem Job möglich“ – Fokus auf passendes Suchprofil/Objektgröße und Finanzierung [I4] (S: B).
- **2026 allgemein**: Steuerstrategie (Holding, Kaufpreisaufteilung, Denkmal, Verkäuferdarlehen) wird stark betont, aber mit der Regel „erst Cashflow, dann Steuerkonstrukte“ (→ Vault Podcasts #586, #676, #678).
- Zahlen zu erwarteten Preisen/Zinsen nennt immocation in den gefundenen Quellen **nicht** → offen.

### A.5 Begriffe (Spiel-Glossar, eigene Formulierungen verwenden)

Bierdeckelrechnung (→ im Spiel z. B. „Schnellcheck“), Kaufpreisfaktor, Brutto-/Nettomietrendite, Cashflow vor/nach Steuern, „Wohnung zahlt sich selbst ab“, Rücklagen (Instandhaltung/Mietausfall), Bewirtschaftungskosten, Hausgeld (umlagefähig/nicht umlagefähig), Kaufnebenkosten, Hebel/Leverage, Beleihungswert, Haushaltsrechnung, Portfoliobetrachtung, Kreditrahmen, Liquiditätspuffer, A–D-Lage, Buy & Hold, Fix & Flip, Aufteiler, vermögensverwaltende GmbH/Holding, Kaufpreisaufteilung, AfA, anschaffungsnahe Herstellungskosten (15 %-Grenze), Spekulationsfrist.

### A.6 Was das Trainingsspiel übernehmen sollte (als Lehrinhalt, keine Kopie)

| Lehrinhalt | Spielmechanik-Vorschlag | Abgrenzung/Kritik |
|---|---|---|
| Gestufter Prüftrichter | Jeder Deal durchläuft „Schnellcheck → Besichtigung → Vollkalkulation → Due Diligence → Bank“; jede Stufe kostet Zeit/Geld und deckt verdeckte Infos auf | Eigene Bezeichnungen; keine immocation-Texte/Grafiken übernehmen |
| Zinsabhängige Renditeschwelle | Spiel zeigt live, welche Bruttorendite bei aktuellem Zins für Cashflow ≥ 0 nötig ist (statt fixer „5 %“) | immocation-Faustregeln stammen aus Niedrigzinsphase |
| Cashflow **und** Steuer getrennt | Zwei Kennzahlen-Spalten; Tilgung ≠ Aufwand, AfA ≠ Ausgabe als Lernmoment | Vault kritisiert, dass immocation Steuer nur als Belastung darstellt |
| Bank als Gegenspieler | Haushaltsrechnung mit Mietabschlag, Stresszins, Beleihungswert, Portfoliobetrachtung ab Kreditrahmen-Grenze; Bankverhalten zyklisch (2026: zögerlicher) | Parameter als einstellbare Annahmen, nicht als „Regel“ |
| Puffer/Risiko | Mietausfall-, Reparatur-, Zinsänderungs-Events; Pflicht-Puffer als Schwierigkeitsregler | – |
| Skalierung | Freischaltbare Strategien: Holding/GmbH, Aufteiler, Fix & Flip, Neubau mit Sonder-AfA | Rechtlich/steuerlich vereinfachen, Disclaimer |
| Marktzyklus-Lesen | Szenario „2026: steigende Zinsen, verhandelbare Preise“ als Lernlevel | Eigene, datenbasierte Szenarien (Abschnitt B) statt Anbieter-Narrativ |

---

## B) Aktuelle Marktlage Deutschland (Q3/Q4 2026)

### B.1 Zinsen

| Reihe | Aktueller Wert | Datum | S | Quelle |
|---|---|---|---|---|
| EZB Einlagesatz / HRG / SRF | 2,50 / 2,65 / 2,90 % | seit Sept. 2026 (Vault: ab 16.09.2026); bestätigt 29.10.2026 | B | [M6]–[M9] |
| Inflation Euroraum (Begründung EZB) | 3,8 % (lt. einer Quelle) | Okt. 2026 | C | [M9] |
| Bauzins 10 J. (Vermittler/Portale) | 3,90 % (60 % Bel.) bis 4,33 % (90 % Bel.) Baufivergleich 30.10.; 4,07 % Dr. Klein Topzins 25.11.; 4,3 % Interhyp 12.11.; 4,4/4,5 % Finanztip; Okt.-Durchschnitt knapp 4,5 % (Baufi24) | Okt./Nov. 2026 | B | [M1]–[M4][Z1][Z2] |
| Bauzins 15 J. | 4,20 % (Dr.-Klein-Beispielrechnung Nov. 2026); Interhyp-Grafik 4,20–4,55 % (Datum unklar); Finanztip Juli 2026 4,2/4,3 % | – | C | [Z1][M1][M3] |
| Bundesbank-Statistik DE (Neugeschäft, Effektivzins Wohnungsbau) | aktueller Monatswert **nicht ermittelt** (offen). Achtung: die in Suchauszügen genannten 3,43 % (>10 J.) / 3,80 % (5–10 J.) für Aug. 2026 stammen aus der **Euroraum**-Meldung der EZB, nicht DE | Aug. 2026 | C | [M22] |
| 10-j. Bund | ≈ 3,5 % (JLL Okt. 2026); 3,27 % am 19.06.2026 = 15-Jahres-Hoch | 2026 | B | [M34][M35] |

Einordnung: Der zweite Zinsanstieg (2026) folgt auf die Zinswende 2022/23; ein Bericht nennt den Oktober-Stand den höchsten seit 2009 (S: C) [Z3].

### B.2 Kaufpreise

| Index | Segment | Veränderung | Stand | S | Quelle |
|---|---|---|---|---|---|
| GREIX (Kiel Institut; notarielle Kaufpreise der Gutachterausschüsse) | ETW | −0,2 % J/J; +0,5 % Q/Q; real −3,0 % J/J | Q3 2026 | A | [M10] |
| GREIX | EFH | +0,9 % J/J; −0,5 % Q/Q | Q3 2026 | A | [M10] |
| GREIX | MFH | −2,4 % J/J; −0,2 % Q/Q; real −5,2 % (geringe Fallzahl!) | Q3 2026 | A/B | [M10][M12] |
| GREIX Marktliquidität | ETW-Verkäufe Q2 2026 −1,7 % J/J; Angebotsdauer ETW ≈ 94 Tage | Q2/Q3 2026 | C | [M10] (Suchauszug) |
| vdp (Bankdaten >700 Institute) | Wohnen gesamt | +1,0 % J/J; −0,1 % Q/Q | Q3 2026 | A | [M13] |
| vdp | MFH | +0,5 % (vermutl. J/J); Liegenschaftszins-Index MFH +2,9 % | Q3 2026 | C | [M13] |
| vdp | Gesamtindex inkl. Gewerbe | +0,2 % J/J; Büro −3,9 % J/J | Q3 2026 | A | [M13] |
| Europace EPX (Transaktionsdaten der Plattform) | ETW | 216,49 Pkt.; −0,87 % M/M; −1,24 % J/J (zweiter Rückgang in Folge) | Okt. 2026 | A/B | [M15][M16] |
| Europace EPX | Neubau-EZFH / Gesamt | 246,60 Pkt. (Rekord, +0,33 %) / 221,61 Pkt. (−0,07 %) | Okt. 2026 | B | [M15][M17] |
| Destatis Häuserpreisindex | Wohnimmobilien gesamt | +0,6 % J/J; +0,3 % Q/Q; Index 100,6 (Basis lt. Suchauszug 2025 = 100, **prüfen**); Q1 2026 revidiert auf +1,2 % | Q2 2026 | A | [M18] |
| ImmoScout24 WohnBarometer (Angebotspreise) | ETW Bestand | Werte uneindeutig beschriftet (z. B. 2.653 €/m² bzw. 4.196 €/m²) → **nicht verwenden ohne PDF-Prüfung** | Q3 2026 | C | [M32] |

**Gesamtbild Q3/Q4 2026:** Nominale Seitwärtsbewegung, real fallende Preise in allen Segmenten (GREIX), MFH am schwächsten, Neubau-Häuser stark (EPX). Passt zum immocation-Narrativ „Preise wieder verhandelbar“.

### B.3 Mieten

| Reihe | Typ | Wert | Stand | S | Quelle |
|---|---|---|---|---|---|
| GREIX-Mietpreisindex (37 Städte/Regionen) | Angebotsmiete | +3,7 % J/J, +1,2 % Q/Q; Ø **14,60 €/m²**; Treiber Bestandswohnungen | Q3 2026 | A | [M11] |
| GREIX-Mietpreisindex | Angebotsmiete | Q2 2026: +3,0 % J/J; Köln +6,0 %, Hamburg +5,1 %, Berlin −0,8 % | Q2 2026 | B | [M39b] |
| vdp | Neuvertragsmiete | +3,5 % J/J; Top-7 +3,0 %, Hamburg +4,1 % | Q3 2026 | A/B | [M13] |
| Destatis VPI | Bestandsmiete (Nettokaltmiete) | **+1,9 % J/J** | Okt. 2026 | A | [M20] |
| Zensus 2022 | Bestandsmiete (vertraglich) | Ø **7,28 €/m²** (Wohnungen in Wohngebäuden); Sachsen-Anhalt 5,38 €, Bayern 8,74 €; (Destatis: 7,34 € bezogen auf alle Haushalte) | 15.05.2022 | B | [M30] |
| ImmoScout24 | Angebotsmiete Bestand / Neubau | 9,01 €/m² (+2,5 % J/J) / 13,42 €/m² | Q3 2026 | C | [M32] |

Spielrelevanz: Angebots- vs. Bestandsmiete klar trennen (Angebot ≈ +3–4 % p. a., Bestand ≈ +2 % p. a.) – deckt sich mit der Datentyp-Warnung im Vault-Quellenkatalog.

### B.4 Kaufpreisfaktoren / Renditen nach Stadttyp

Belastbare, amtliche Faktoren nach Stadttyp wurden **nicht** gefunden (offen). Verfügbare Anhaltspunkte:

| Quelle | Aussage | S |
|---|---|---|
| JLL/Haufe | Spitzenrendite Wohnen Top-7 Ende H1 2026 ≈ **3,4–3,5 %** (junge Bestände 4,1 %) | B [M33] |
| Cushman & Wakefield / CBRE | Spitzenrendite MFH Top-7 3,81 % bzw. 3,59 % (Stichtage unklar) | C [M33] |
| Ratgeber-/Rechnerseiten (Methodik unklar, teils Angebotsdaten) | A-Städte ≈ 25–35-fach (München bis 45), B-Städte ≈ 18–25, C-Städte ≈ 10–20; Berlin Q1 2026 Ø 22,4-fach (Transaktionen, Einzelquelle) | C [M40] |
| Ratgeber 2026 | „Solide“ Nettorenditen 2,5–4 % | C [E3] |

**Empfehlung fürs Spiel:** Faktoren als Spannen je Stadttyp parametrisieren und mit **Rohertragsfaktoren/Liegenschaftszinsen der Gutachterausschüsse** (NRW offen verfügbar, siehe D) kalibrieren; Rückrechnung Faktor ≈ 1 / Bruttorendite (Spitzen-Nettorendite 3,5 % entspricht grob einem Netto-Faktor von ≈ 28,6).

### B.5 Transaktionsvolumen

| Quelle | Wert | Stand | S |
|---|---|---|---|
| CBRE | Wohn-Investment Q1–Q3 2026 knapp 5,9 Mrd. € (−4 %), Q3 ≈ 2,3 Mrd. €; Gesamtjahr-Erwartung ≈ 8 Mrd. € | Okt. 2026 | B [M24] |
| Cushman & Wakefield | Q3 1,65 Mrd. €; Q1–Q3 5,75 Mrd. € (−1,6 %); Portfoliodeals erstmals vorn | Okt. 2026 | B [M25] |
| BNP Paribas RE | Q3 1,6 Mrd. €; Q1–Q3 ≈ 5,9 Mrd. € (−5 %) | Okt. 2026 | B [M26] |
| JLL | Q3 1,9 Mrd. €; 53 Deals (−18,5 %); Q1–Q3 6,2 Mrd. € (engl. Seite abweichend 7,9 Mrd. „Living“) | Okt. 2026 | C [M27] |
| AK OGA / BBSR (Immobilienmarktbericht Deutschland 2025, alle Kauffälle aller Gutachterausschüsse) | Geldumsatz 2024 ≈ **247 Mrd. €** (+15 %), Kauffälle +9 % (Kompaktfassung spricht nur von „leicht“ – Widerspruch, offen) | Dez. 2025 | B/C [M28] |

Hinweis: Makler-Zahlen erfassen nur institutionelle Wohnportfolios (ab ca. 30/50 WE); für ein Privatinvestoren-Spiel ist die Gutachterausschuss-Statistik (Kauffälle, Geldumsatz je Teilmarkt) die passendere Basis.

### B.6 Bautätigkeit

- Baugenehmigungen Sept. 2026: 20.800 Wohnungen (−14,8 % J/J), davon Neubau 16.800 (−19,9 %), Umbau 4.000 (+15,8 %); Jan.–Sept. 2026: 190.200 (+8,4 %); Nachmeldungen möglich [M19] (S: A).
- Fertigstellungen 2025/2026: **nicht recherchiert** (offen; GENESIS 31111/31121).

### B.7 Leerstand

- Zensus 2022: 4,3 % aller Wohnungen leer (Stichtag 15.05.2022); zusätzlich „marktaktive Leerstandsquote“ (innerhalb von 3 Monaten verfügbar) auf Gitter-/Gemeindeebene [M29][D3] (S: A/B). Absolute Zahl (≈ 1,9 Mio.) **nicht bestätigt** (offen).
- CBRE-empirica-Leerstandsindex: marktaktiver Leerstand Geschosswohnungen Ende 2024 ≈ 522.000 WE = 2,2 %; Ost (ohne Berlin) deutlich höher als West (6,2 % vs. 2,1 % – Zuordnung zur Ausgabe unsicher); Ausgabe 2026 nicht gefunden [M31] (S: B/C).

### B.8 Zeitreihen für Marktzyklen 2000–2026 (Verfügbarkeit)

| Reihe | Quelle / Kennung | Beginn | Frequenz | Zugriff | Lizenz | S |
|---|---|---|---|---|---|---|
| Effektivzins Wohnungsbaukredite, Zinsbindung >10 J. | Bundesbank **SUD119** (`BBIM1.M.DE.B.A2C.P.R.A.2250.EUR.N`) | 01/2003 | monatlich | SDMX-REST-API, CSV | ESZB-Weiterverwendungsregeln (Details offen) | A [M21][D14] |
| … 5–10 J. / ≤1 J. | Bundesbank **SUD118** / **SUD116** | 01/2003 | monatlich | dto. | dto. | A [M21] |
| Hypothekarkredite Wohngrundstücke, 10 J. Festzins (Altreihe) | Bundesbank **SU0046** (`BBIB1.M.DE.B.S.DNB.HYP.F10J.A.E1.11A`) | 06/1967 – 06/2003 (Strukturbruch 2003!) | monatlich | dto. | dto. | A/C (Startdatum nicht voll bestätigt) [M23] |
| EZB-Leitzinsen | EZB Data Portal | 1999 | ereignisbezogen | API/CSV | EZB-Nutzungsbedingungen | T |
| Rendite 10-j. Bund | Bundesbank Zinsstrukturdaten | Jahrzehnte | täglich/monatlich | API | ESZB | T |
| Häuserpreisindex | Destatis GENESIS **61262-0001/-0002** (+ Stat. Bericht nach Kreistypen) | 2000 (lt. Trainingswissen; Bundesbank-Grafiken zeigen ab ~2004/05) | quartalsweise | GENESIS-API/CSV | dl-de/by-2.0 | A/T [M18][Z4] |
| VPI inkl. Teilindex Nettokaltmiete | Destatis GENESIS 61111 | 1991 (T) | monatlich | API | dl-de/by-2.0 | T |
| GREIX Kaufpreise (ETW/EFH/MFH, Städte) | Kiel Institut, greix.de | **1960** (einzelne Städte), Kerndaten seit 1995 | quartalsweise | Download (XLSX/CSV) | frei zugänglich, **Lizenz offen** | B [M37][M38][M39] |
| GREIX Mietpreisindex | Kiel Institut | jünger (Q-Daten; Start offen) | quartalsweise | XLSX/CSV, Jahres-/Quartals-/Monatswerte | Lizenz offen | B [D19] |
| vdp-Immobilienpreisindex | vdpResearch | 2003 (T; Basis 2010 = 100) | quartalsweise | XLSX-Rohdaten | Lizenz offen | B/T [M14][Z4] |
| Europace EPX | Europace/Hypoport | 2005 (T) | monatlich | Pressemitteilung/Charts | Lizenz offen | T |
| Wohnimmobilienpreise (bulwiengesa-basiert, 127 Städte) | Bundesbank „Preise für Wohnimmobilien“ / „Indikatorensystem Wohnungsmarkt“ | lange Reihen (Start offen) | jährlich | PDF/Zeitreihendatenbank | ESZB/Datenlieferant – **prüfen** | C [Z4] |
| Baugenehmigungen/-fertigstellungen | Destatis 31111/31121 | 1990er (T) | monatlich/jährlich | GENESIS | dl-de/by-2.0 | T |
| Bevölkerung, Haushalte (Kreise) | Destatis/Regionaldatenbank 12411 ff. | 1995+ (T) | jährlich | API | dl-de/by-2.0 | T |
| Arbeitslosenquote (Kreise) | Statistik der BA | lange Reihen | monatlich | Download | BA-Nutzungsbedingungen | B [D11] |
| Umsatz/Kauffälle je Teilmarkt | Gutachterausschüsse, AK OGA (alle 2 Jahre) | regional sehr unterschiedlich; Wuppertal ab 2000 offen | jährlich | PDF/CSV | NRW: dl-de/zero-2.0; sonst oft © | B [D10][M28] |

Lücken (offen): Eurostat-HPI, OECD- und BIS-Langreihen wurden in dieser Sitzung nicht geprüft (Lizenzen lt. Trainingswissen offen/CC BY – vor Nutzung verifizieren).

### B.9 Grobe Zyklus-Chronologie als Szenario-Rohgerüst

| Phase | Kennzeichen | Beleg | S |
|---|---|---|---|
| 1990er | Hypothekenzinsen „weit über 8 %“ | Vault `Zins` (immocation) | T |
| ca. 2000–2009 | Stagnation, real fallende Preise; 2009 Bauzins ≈ 4,5 % | Vault | T |
| ca. 2010–2021 | Boom, Zinsen ≈ 3–4 % (2013) → 2,5 % (2018) → ≈ 1,5 % (2019–21) | Vault | T |
| 2022–2024 | Zinswende, Preiskorrektur | Vault, [M10] (ETW-Minus bis Q2 2024) | B/T |
| 2025 – H1 2026 | Erholung/Seitwärts, steigende Mieten; BaFin senkt SyRB (2025) | [M18][R32] | A/B |
| H2 2026 | EZB-Anhebungen (Juni/Sept.), Bauzins 10 J. ≈ 4–4,5 % (höchster Stand seit 2009 lt. Einzelquelle), real fallende Preise, MFH schwach, Genehmigungen kippen | Abschnitte B.1–B.6 | A/B |

Für das Spiel: exakte historische Werte aus den Reihen in B.8 ziehen (SU0046 + SUD119 verketten, Bruch 2003 kennzeichnen; GREIX/Destatis für Preise).

---

## C) Rechts- und Steueränderungen 2024–2027 mit Spielrelevanz

### C.1 Übersicht

| # | Thema | Stand 26.11.2026 | Gültig ab | Spielrelevanz | S | Quelle |
|---|---|---|---|---|---|---|
| 1 | **Mietpreisbremse** | Verlängert bis **31.12.2029** (Bundesrat 11.07.2025 gebilligt; § 556d Abs. 2 BGB „2025“ → „2029“; Fünfjahres-Grenze je Verordnung gestrichen); Länder müssen Verordnungen erneuern (z. B. Bremen 01.12.2025–31.12.2029, NI bis 31.12.2029 → Vault) | Tag nach Verkündung (2025; BGBl.-Fundstelle offen) | Neuvermietungsmiete ≤ ortsübliche Vergleichsmiete +10 % in Gebieten | A/B | [R1][R2][R3] → Vault `Regionale-Rechtsmatrix` |
| 2 | **Kappungsgrenze** | unverändert: 20 % in 3 Jahren, 15 % in Gebieten per Landesverordnung (§ 558 Abs. 3 BGB) | – | Bestandsmieterhöhung | T | → Vault |
| 3 | **„Mietrecht II“** (Regierungsentwurf, BT-Drs. 21/6807) | **nicht beschlossen**; eingebracht 01.07.2026, 1. Lesung 09.07.2026, Anhörung Okt. 2026 (09. oder 14.10., widersprüchlich) | offen (Quellen spekulieren 2027) | **Indexmiete:** in Gebieten per Landesverordnung nur halbe Weitergabe des VPI-Anstiegs über 3 % p. a.; **Möblierungszuschlag** vor Vertragsschluss gesondert ausweisen, max. 1 % des Zeitwerts der Möbel/Monat (eine Quelle) bzw. Pauschale 10 % der Nettokaltmiete bei Vollmöblierung (andere Quelle) – **widersprüchlich**; **Kurzzeitvermietung** nur bis 6 Monate von Schutzvorschriften ausgenommen; **Schonfristzahlung** heilt einmalig auch ordentliche Kündigung | B/C | [R4][R5][R7] |
| 4 | Bundesrats-Entwurf möbliertes Wohnen/Kurzzeitvermietung | BT-Drs. 21/3509 (07.01.2026) – parallel, Status offen | – | wie #3 | A | [R6] |
| 5 | **GEG → Gebäudemodernisierungsgesetz (GModG)** | Bundestag 10.07.2026, verkündet 28.07.2026 (BGBl. 2026 I Nr. 226 lt. Einzelquelle), **in Kraft 29.07.2026**; 65-%-EE-Pflicht entfällt, Technologiefreiheit; „Bio-Treppe“ für neue Gas-/Ölheizungen (lt. Vault 10 % 2029, 15 % 2030, 30 % 2035, 60 % 2040); weitere Stufen 01.01.2027 (Art. 2, 7), Nullemissionsgebäude 2030 (Art. 4; Daten teils widersprüchlich); Bundes-Solarpflicht § 106 GModG gestuft ab 2027 (Vault) | 29.07.2026 ff. | Heizungstausch-Events, Brennstoffkosten, Sanierungsentscheidungen | A/B | [R8]–[R12] → Vault `Gebaeudemodernisierungsgesetz` |
| 6 | **BEG-Heizungsförderung (KfW 458)** | Reform seit **21.07.2026**: Grundförderung 30 %; förderfähige Kosten 1. WE 28.000 € (statt 30.000 €); Effizienzbonus entfällt; Einkommensbonus gestaffelt (40/30/10 % bis 30/40/50 T€ zvE); **Klimageschwindigkeitsbonus 16 %** (nur Selbstnutzer), ab 01.02.2027 12 %, danach alle 6 Monate −4 Pp.; Förderhöchstbetrag 1. WE sinkt ab 01.02.2027 halbjährlich um 750 €; max. 80 % / 22.400 €; Merkblatt Stand 09/2026 („gültig ab 24.09.2026“) | 21.07.2026 / 2027 | Vermieter: i. d. R. nur Grundförderung → Spiel-Förderlogik | B/C | [R13]–[R15] |
| 7 | **CO₂-Preis BEHG / EU-ETS2** | 2026: Korridor 55–65 €/t; **2027 bleibt Korridor 55–65 €/t** (Bundestag 15.10.2026, 303:210; Überschussmengen-/Nachkaufpreis 71/73 € lt. Einzelquelle); Bundesrat-Abschluss 20.11.2026 **nicht bestätigt (offen)**; **ETS2 startet erst 2028** | 01.01.2027 / 2028 | Heizkosten, CO₂-Kostenaufteilung (Stufenmodell → Vault) | B | [R16]–[R20] |
| 8 | **Grundsteuerreform** | seit 01.01.2025: Bundesmodell (11 Länder, Sachsen/Saarland mit abweichenden Messzahlen), eigene Modelle BW (Bodenwert), BY (Fläche), HH (Wohnlage), HE (Flächen-Faktor), NI (Flächen-Lage); **BFH 12.11.2025 (veröff. 10.12.2025, II R 25/24, II R 31/24, II R 3/25): Bundesmodell verfassungsgemäß**; Verfassungsbeschwerde (BdSt) anhängig; BFH-Verfahren BW-Modell (II R 26/24, 27/24) – Ergebnis offen; Thüringen senkt Messzahl Wohnen ab 2027 (0,31 → 0,23 ‰, Einzelquelle) | 2025 / 2027 | Grundsteuer = umlagefähige Betriebskosten, aber Mietbelastung/Standortwahl | B/C | [R21]–[R24] |
| 9 | **Grunderwerbsteuer** | Sätze siehe C.2; keine verkündete Satzänderung für 2027 (Stand 17.10.2026); NRW: FDP-Entwurf 6,5 → 5,0 % (nicht beschlossen) | – | Kaufnebenkosten je Land | B | [R25]–[R27] |
| 10 | **Share Deals / GrEStG-Reform** (9. StBerÄndG) | verkündet 02.07.2026; ab 03.07.2026 Signing vor Closing, einheitliche Anzeigefrist 1 Monat, Subsidiarität § 1 Abs. 3a entfällt; Schwellen 90 % / 10 Jahre (seit 2021); Gesamthandsfiktion § 24 GrEStG entfristet → §§ 5, 6 GrEStG gelten über 31.12.2026 hinaus (eine Kanzlei behauptet Gegenteil → **widersprüchlich**) | 03.07.2026 | nur Late-Game (GmbH/Holding, Portfolio-Deals) | B/C | [R28][R29] |
| 11 | **AfA Wohngebäude** | linear 3 % (Fertigstellung ab 2023), 2 % (1925–2022), 2,5 % (vor 1925) → Vault; **degressiv 5 %** vom Restwert (§ 7 Abs. 5a EStG) bei Baubeginn 01.10.2023–30.09.2029, Wechsel zu linear möglich | – | Neubau-Strategie, Steuerlogik | B | [R30] → Vault `AfA` |
| 12 | **Sonder-AfA § 7b EStG** | 5 % p. a. über 4 Jahre zusätzlich, kombinierbar mit degressiver AfA (Jahr 1: 10 %); Baukostenobergrenze **5.200 €/m²** (vorher 4.800 €); EH40/QNG-Anforderung; Bemessungsgrundlage max. 4.000 €/m² und Antragszeitraum bis 30.09.2029 (T); Änderung § 7b Abs. 5 durch Gesetz v. 22.12.2025 – Inhalt offen | – | Neubau-Strategie | B/C/T | [R30] |
| 13 | **Einkommensteuer 2026** | Grundfreibetrag **12.348 €** (Splitting 24.696 €); Eingangssatz 14 %; Ende 1. Progressionszone ≈ 17.800 €; 42 % ab **69.879 €**; 45 % ab **277.826 €** | 01.01.2026 | Steuer im Cashflow | B | [R31] |
| 14 | **ESt-Reformgesetz 2027** (BT-Drs. 21/8235, Kabinett 02.09.2026) | **nicht beschlossen** (1. Lesung 08.10.2026, Anhörung 04.11.2026; Bundesrat zustimmungspflichtig, letzte BR-Sitzung 18.12.2026): Grundfreibetrag 12.564 € (2027) / 12.900 € (2028); 42 % ab 70.601 €; 45 % ab 250.000 €, neue Stufe **47 % ab 280.000 €** (Angaben teils widersprüchlich) | geplant 01.01.2027 | Szenario-Parameter | B/C | [R31] |
| 15 | **Bankregulierung** | BaFin: sektoraler **Systemrisikopuffer Wohnimmobilienkredite 2 % → 1 %** (Entscheidung 30.04.2025); antizyklischer Kapitalpuffer **0,75 %** (auch Q4 2026); Bundesbank-FSB 2026: ≈ 40 % des Neugeschäftsvolumens Q2 2026 mit Beleihung >90 % (Sekundärquelle); behauptete Abschaffung des SyRB zum 01.01.2027 nur in Blog → **unbelegt** | 2025 | Kreditvergabe-Strenge als Spielparameter | A/C | [R32][R33][M36] |
| 16 | Wohnimmobilienkreditrichtlinie / makroprudenzielle Instrumente | Kreditwürdigkeitsprüfung §§ 505a ff. BGB, ImmoKWPLV; BaFin-Instrumente (LTV-/Tilgungsvorgaben, § 48u KWG) nach Kenntnisstand **nicht aktiviert** | – | Bank-Mechanik | T (offen) | – |

### C.2 Grunderwerbsteuer je Bundesland (Stand Nov. 2026)

| Land | Satz | Land | Satz |
|---|---|---|---|
| Baden-Württemberg | 5,0 % | Niedersachsen | 5,0 % |
| Bayern | **3,5 %** | Nordrhein-Westfalen | **6,5 %** |
| Berlin | 6,0 % | Rheinland-Pfalz | 5,0 % |
| Brandenburg | **6,5 %** | Saarland | **6,5 %** |
| Bremen | 5,5 % (seit 01.07.2025) | Sachsen | 5,5 % (seit 01.01.2023) |
| Hamburg | 5,5 % (seit 01.01.2023) | Sachsen-Anhalt | 5,0 % |
| Hessen | 6,0 % | Schleswig-Holstein | **6,5 %** |
| Mecklenburg-Vorpommern | 6,0 % | Thüringen | 5,0 % (seit 01.01.2024) |

S: B (mehrere Übersichten übereinstimmend; identisch mit Vault-Tabelle vom 30.09.2026) [R25][R26]. Einzelne Ratgeber nennen veraltete Werte (Sachsen 3,5 %, Bremen 5,0 %, Thüringen 6,5 %) → nicht verwenden. Primärquelle (Landesgesetze) für das Spiel einmal direkt prüfen.

### C.3 Abgleich mit dem Vault (Aktualisierungen)

- **Bestätigt:** EZB 2,50 % (Sept. 2026), Bauzins-Korridor 3,9–4,5 %, GModG in Kraft 29.07.2026, GrESt-Tabelle, Mietpreisbremse bis 2029.
- **Neu gegenüber Vault:** Mietrecht II (Drs. 21/6807) noch nicht beschlossen; BEG-Reform 21.07.2026 mit Abschmelzpfad 2027; CO₂-Preis 2027 eingefroren (Bundesrat offen), ETS2 erst 2028; Share-Deal-Reform (9. StBerÄndG); ESt-Reform 2027 (Entwurf, 47-%-Stufe); BFH-Urteile Grundsteuer Bundesmodell; Q3-2026-Marktdaten.
- **Widerspruch/offen:** §§ 5, 6 GrEStG ab 2027; Möblierungszuschlag-Formel; Bundesrat-Ergebnis BEHG; GModG-Artikel-Inkrafttreten 2028/2030.

---

## D) Offene Datenquellen für das Spiel (Lizenz, Zugriff, Eignung)

### D.1 Übersicht

| Quelle | Inhalt (Spielbezug) | Granularität | Zeitraum/Aktualisierung | Zugriff/Format | Lizenz & Attribution | Kommerziell (App Store) | S |
|---|---|---|---|---|---|---|---|
| **Destatis GENESIS-Online** | HPI 61262, VPI/Nettokaltmiete 61111, Baugenehmigungen 31111, Bevölkerung | Bund/Länder, teils Kreistypen | laufend (monatl./quartalsw.) | REST/JSON-API (SOAP abgeschaltet; Doku v5.1 Stand 01.06.2026); Weboberfläche ohne Registrierung; **API-Token nur mit Nutzerkonto**; CSV/XLSX | **dl-de/by-2.0**; Vermerk z. B. „Datenquelle: Statistisches Bundesamt (Destatis), Genesis-Online, Abrufdatum; Datenlizenz by-2-0“ | ja (mit Namensnennung, Änderungen kennzeichnen) | A [D1][D16][D17] |
| **Regionaldatenbank Deutschland** (regionalstatistik.de) | Bevölkerung, Haushalte, Wohnungsbestand, Bautätigkeit, Einkommen | Kreise, Gemeinden | jährlich | GENESIS-API (Konto/Token) | dl-de/by-2.0 (für diese DB nicht explizit bestätigt → **prüfen**) | voraussichtlich ja | C [D2] |
| **Zensus 2022** | Nettokaltmiete (Bestand), Leerstand + marktaktiver Leerstand, Baujahr, Heizung, Eigentumsform | **Gitter 100 m / 1 km / 10 km** (CSV + XLSX-Beschreibung); Zensusdatenbank Bund–Gemeinde (mit API) | Stichtag 15.05.2022, **einmalig** | ZIP/CSV-Download, Zensus-Atlas, Datenbank-API | „freie Nutzung mit Namensnennung als OpenData“; konkrete Lizenz (vermutl. dl-de/by-2.0) **offen** | voraussichtlich ja | B [D3] |
| **INKAR (BBSR)** | >600 Indikatoren: Demografie, Wohnen, Wirtschaft, Erreichbarkeit | Kreise, Gemeindeverbände, Raumordnungsregionen | meist ab **1995**, einheitlicher Gebietsstand | Web-Export | Daten/Karten/Webdienste „kostenfrei für kommerzielle und nicht-kommerzielle Zwecke“ (lt. IHK unter Berufung auf BBSR); formale Lizenz **offen** | ja (lt. Aussage) | B/C [D13] |
| **BKG VG250 / VG250-EW** | Verwaltungsgrenzen (Spielkarte), VG250-EW mit Einwohnerzahlen | Staat → Gemeinde | jährlich (Stand 31.12.) | **Shape, GeoPackage** (kein offizielles GeoJSON → selbst konvertieren), WFS | **dl-de/by-2.0**; Pflichtvermerk „© BKG (Jahr des letzten Datenbezugs) dl-de/by-2-0“ + Link Datenquellen-PDF (Nutzungsbedingungen 19.08.2025). Achtung: VG25 steht unter CC BY 4.0 | ja | A [D4] |
| **Bundesbank Zeitreihen** | Bauzinsen (SUD116/118/119, SU0046), Bundrenditen, Wohnimmobilien-Indikatoren | Deutschland | 1967/2003 bis heute, monatlich | **SDMX-REST** `https://api.statistiken.bundesbank.de/rest` (JSON/CSV/SDMX-ML) | „Regelung für die Weiterverwendung von ESZB-Statistiken“ (Wortlaut nicht gelesen → **offen**; üblich: frei mit Quellenangabe) | voraussichtlich ja | A/C [D14] |
| **BORIS-D** (bundesweit) | Bodenrichtwerte | Zone | jährlich/zweijährlich | WMS/WFS | **dl-de/by-2.0**; Quellenvermerk Gutachterausschüsse + bodenrichtwerte-boris.de | ja (Namensnennung) | B [D7] |
| BORIS **NRW** | Bodenrichtwerte, Grundstücksmarktberichte, Immobilienrichtwerte | Zone/Gemeinde | jährlich (Shapefiles mehrerer Stichtage) | Download, WFS | **dl-de/zero-2.0** (keine Bedingungen) | ja | A/B [D5][D10] |
| BORIS **Berlin** | Bodenrichtwerte (u. a. 01.01.2026) | Zone | jährlich | WFS/WMS | **dl-de/zero-2.0** | ja | B [D6] |
| BORIS **Niedersachsen/Bremen** | Bodenrichtwerte | Zone | jährlich | WFS | dl-de/by-2.0 lt. LGLN-Nutzungsbedingungen/AdV-MIS; GDI-NI-Eintrag nennt CC BY 4.0 + kostenpflichtigen Dienst → **widersprüchlich** | vermutl. ja | B/C [D8] |
| BORIS **Hamburg** | Bodenrichtwerte (01.01.2026) | Zone | jährlich | WFS | dl-de/by-2.0 (Drittquelle) | vermutl. ja | C [D9] |
| BORIS **Hessen** | Bodenrichtwerte | Zone | Stichtag 01.01.2024 lt. Drittquelle | – | dl-de/zero-2.0 (Drittquelle) | vermutl. ja | C [D9] |
| BORIS **Bayern** | Bodenrichtwerte | – | – | nur Online-Auskunft | **keine offene Massendatenlizenz** | nein (ohne Vertrag) | C [D9] |
| Übrige Länder | – | – | – | – | **offen** | prüfen | – |
| **Gutachterausschüsse / Grundstücksmarktberichte** | Kauffälle, Umsätze, Rohertragsfaktoren, Liegenschaftszinsen, Vergleichsfaktoren | Kreis/Stadt | jährlich; AK-OGA-Bundesbericht zweijährlich | PDF (NRW teils CSV) | NRW: dl-de/zero-2.0 (z. B. Wuppertal alle Berichte ab Bezugsjahr 2000); andere Länder oft © und kostenpflichtig; BGH 2006 „Bodenrichtwertsammlung“: **kein amtliches Werk** i. S. v. § 5 UrhG → Datenbankschutz möglich | NRW ja, sonst Einzelprüfung | B [D10][D15] |
| **Mietspiegel** | ortsübliche Vergleichsmiete | Gemeinde/Wohnlage | 2–4 Jahre | PDF/Online-Rechner | Urheberrechtsstatus **unklar** (§ 5 UrhG nicht eindeutig; Analogie BGH 2006 spricht gegen „amtliches Werk“) | nur als Parameter-Inspiration, nicht 1:1 übernehmen | C [D15] |
| **Statistik der Bundesagentur für Arbeit** | Arbeitslosenquote, Beschäftigte | Kreise/Agenturbezirke (Gemeinde teils) | monatlich | Download (XLSX/CSV) | frei mit Quelle „© Statistik der Bundesagentur für Arbeit“, keine Verfälschung, eigene Berechnungen kennzeichnen, online auf BA-Statistik verlinken; Sonderauswertungen kostenpflichtig | ja | B [D11] |
| **BBSR Raumordnungsprognose 2045** | Bevölkerung (85,5 Mio. 2045; nach Zensus-Korrektur ≈ 1,4 Mio. weniger Basis), Haushalte (Juli 2025), Wohnungsbedarf, Erwerbspersonen (2026) | Kreise (≈ 400) | einmalig mit Updates | Dashboard, Berichte | **offen** (CC BY-SA 4.0 nur für andere BBSR-Publikation belegt) | prüfen | C [D12] |
| **GREIX** | Transaktionspreisindizes, Mietindex, Stadtteile | Städte/Stadtteile (19–37 Städte je Index) | ab 1960 / quartalsweise | XLSX/CSV | „öffentlich und kostenfrei“; **Lizenz offen** | vor kommerzieller Nutzung Kiel Institut fragen | B/C [M37][M38][D19] |
| **vdp-Index** | Preis-/Mietindizes, Liegenschaftszins | Bund/Top-7/Segmente | quartalsweise | XLSX-Rohdaten | **offen** | fragen | B [M14] |

### D.2 Bewertung für ein (später kommerzielles) Spiel

- **Unproblematisch:** dl-de/zero-2.0 (NRW, Berlin, ggf. Hessen) – keine Bedingungen; dl-de/by-2.0 (Destatis, BKG, BORIS-D, NI/HB, HH) – kommerziell erlaubt, aber **Namensnennung mit Lizenzhinweis und Verweis auf Datensatz (URI)**, Änderungen als solche kennzeichnen [D16].
- **Mit Auflagen:** BA-Statistik (Quellenformel + Link), Bundesbank (ESZB-Regeln lesen).
- **Klären vor Release:** GREIX, vdp, Europace, Zensus-Lizenzname, INKAR-Lizenzname, BBSR-Prognose, Regionaldatenbank.
- **Nicht verwenden ohne Vertrag:** Bayern-BRW, Portal-Angebotsdaten (ImmoScout24, Immowelt), kostenpflichtige Grundstücksmarktberichte, Mietspiegel-Tabellen 1:1.
- **Umsetzungsempfehlung:** Ein In-App-Screen „Datenquellen & Lizenzen“ mit je Datensatz: Herausgeber, Datensatzname/URI, Abrufdatum/Stand, Lizenz-Kürzel + Link, Hinweis „bearbeitet/aggregiert“. Spielwerte nur aggregiert/abgeleitet speichern (z. B. Kreis-Indizes, Spannen), Rohdaten-Pipeline versionieren.

---

## E) Vergleichbare Analyse-/Kalkulationswerkzeuge (Funktionsumfang)

### E.1 Gefundene Werkzeuge

| Werkzeug | Typ | Funktionen (laut Quelle) | S | Quelle |
|---|---|---|---|---|
| immocation Kalkulationstool | Excel, gratis/kostenpflichtig | Rendite, Cashflow, Kaufpreisfaktor **inkl. Steuer**, Erklärungen, Bankdarstellung | B | [I6][I7] → Vault |
| immocation Bierdeckel (Web/App) | Schnellrechner | Bruttorendite mit Schiebereglern (Kaufpreis, Miete, Fläche), €/m²-Werte, Bewertungstext; „Bierdeckel-Rente“ (Sparrate/Verzinsung) | B | → Vault |
| ImmoMetrica (immocation-Partner) | Objektsuche/Marktdaten | „Objekte finden“ (nur Titelbeleg) | C | [I11] |
| PriceHubble (immocation-Partner) | Bewertung | digitale Immobilienbewertung | C | [I12] |
| rechner-hub.de Mietrendite-Rechner | Web | Brutto-/Nettorendite, Kaufpreisfaktor, **vor Steuern**, Bewirtschaftungskosten (Verwaltung, Rücklage, Mietausfall) | C | [E1] |
| Interhyp Kapitalanlage | Portal | Preisbewertung „nach Bankenstandard“, Mikro-/Makro-Standortanalyse, Bruttorendite | C | [E2] |
| Stiftung Warentest „Immobilie als Kapitalanlage“ | Web-Rechner | Rechner + Praxistest acht Städte (Details nicht gelesen) | C | [E4] |
| ING Kapitalanlagerechner | Web | nur Titelbeleg | C | [E5] |
| immo-rechner.net, renditerechner24.de, steuerschroeder.de, deutschland-rechner.de | Einzelrechner | Kaufpreisfaktor-, GrESt-, Sonder-AfA-§-7b-, ESt- (inkl. „Steuerreform 2027“), Grundsteuer-Rechner (Titelbelege) | C | [E6][E7][E8] |
| immocloud | Vermieter-/Verwaltungssoftware (Cloud) | Objekt-/Mieterverwaltung, Buchhaltung mit Bankanbindung (automatische Zuordnung Mieteingänge), Nebenkostenabrechnung, Mieterkommunikation/-portal, Dokumente, Instandhaltung, Reporting, „Investitionsrechnung“ (Drittangabe); 4 Tarife, z. B. bis 30 bzw. 50 WE | B/C | [E9][E10] |
| objego, Vermietet.de, WISO Vermieter, DealCheck/Stessa (US) | Verwaltung/Analyse | in dieser Sitzung **nicht verifiziert** (offen) | – | – |

### E.2 Abgeleitete Mindestfunktionen unseres Rechners

1. **Schnellcheck** (Kaufpreis, Kaltmiete, Fläche → Bruttorendite, Faktor, €/m² Kauf/Miete) mit **zinsabhängiger** Ampel statt fixer 5-%-Regel.
2. **Kaufnebenkosten** automatisch je Bundesland (GrESt-Tabelle C.2, Notar/Grundbuch ≈ 1,5–2 %, Makler optional; Halbteilung nur ETW/EFH an Verbraucher → Vault).
3. **Finanzierung:** mehrere Darlehen, Sollzins, anfängliche Tilgung, Zinsbindung, Sondertilgung, Tilgungsplan, **Anschlusszins-Szenario**; KfW-Förderdarlehen/Zuschüsse optional.
4. **Bewirtschaftung:** Hausgeld umlagefähig/nicht umlagefähig, Verwaltung, Instandhaltungsrücklage (WEG + eigene), Mietausfallwagnis.
5. **Cashflow vor und nach Steuern** (monatlich/jährlich, Jahr 1 und Verlauf über Haltedauer).
6. **Steuer:** Kaufpreisaufteilung Gebäude/Boden, AfA-Satz nach Baujahr (2/2,5/3 %, degressiv 5 %, § 7b), Zinsen als Werbungskosten, 15-%-Grenze anschaffungsnaher Herstellungskosten als Warnung, ESt-Tarif 2026 (+ 2027-Szenario), Spekulationsfrist 10 Jahre.
7. **Kennzahlen:** Brutto-/Nettorendite, Faktor, Cashflow, EK-Rendite (10 Jahre, inkl. Restschuld und Wert), DSCR/Mietdeckung, Beleihungsauslauf (LTV), Break-even-Miete/-Zins.
8. **Bankprüfung:** Haushaltsrechnung mit Mietabschlag, Stresszins, Beleihungswert-Abschlag, Kreditrahmen → Portfoliobetrachtung (alle Parameter editierbar).
9. **Szenarien/Sensitivität:** Zins ±, Miete ±, Leerstand, Instandhaltungsschock, Wertentwicklung (aus Marktzyklus-Daten).
10. **Mietrecht-Grenzen:** Mietpreisbremse (Gebietsflag), Kappungsgrenze 15/20 %, Index-/Staffelmiete (inkl. möglicher Mietrecht-II-Kappung als Szenario).
11. **Energie/Regulatorik:** Heizungsart, CO₂-Kosten-Vermieteranteil (Stufenmodell), GModG-Bio-Treppe, BEG-Zuschuss, Grundsteuer (Ländermodell, Hebesatz).
12. **Portfolio-Ebene:** Summen-Cashflow, Gesamtschulden, Beleihung, Eigenkapitalbindung, Konzentrationsrisiko (Standorte), Verkaufs-/Refinanzierungsoptionen.
13. **Export/Bank-Exposé** (PDF/CSV) und **Annahmen-Transparenz** (jede Eingabe mit Quelle/Stand – analog Datenpunkt-Schema des Vaults).

---

## F) Offene Punkte / Nachrecherche

1. Bundesrat-Ergebnis 20.11.2026 zur BEHG-Änderung (CO₂-Preis 2027).
2. Bundesbank-DE-Wert SUD119/SUD118 für Sept./Okt. 2026 (API-Abruf).
3. Bauzins 15 J. als sauberer Marktdurchschnitt (z. B. FMH/Interhyp-Zeitreihe; Lizenz klären).
4. Mietrecht II: finaler Text (Drs. 21/6807, Ausschussfassung), Möblierungsformel, Inkrafttreten.
5. ESt-Reform 2027: Beschluss Bundestag/Bundesrat (bis 18.12.2026?), finale Tarifeckwerte.
6. §§ 5, 6 GrEStG ab 2027 (Widerspruch), § 7b-Änderung vom 22.12.2025.
7. GModG: genaue Inkrafttretensstufen der Artikel (2027/2028/2030), § 106 Solarpflicht.
8. Lizenzen: Zensus 2022, INKAR, Regionaldatenbank, GREIX, vdp, BBSR-Prognose, Bundesbank-ESZB-Text; BORIS der übrigen 10 Länder.
9. Zeitreihen-Startjahre Destatis-HPI, vdp, EPX; Eurostat/OECD/BIS-Langreihen.
10. Kaufpreisfaktoren nach Stadttyp aus Gutachterausschuss-Rohertragsfaktoren (NRW-Berichte auswerten).
11. Funktionsvergleich objego/Vermietet.de/WISO, internationale Vorbilder (DealCheck, Stessa).
12. Primärseiten-Gegenprüfung aller A/B-Zahlen, sobald WebFetch für die Hosts freigegeben ist.

---

## Quellenliste (alle abgerufen am 26.11.2026 über WebSearch; „Auszug“ = nur Suchergebnis-Snippet ausgewertet)

**Vault (intern, nur gelesen):** `/home/user/IC/vault/90-Quellen/Anbieter/immocation/*` (insb. `Q-immocation-Tool-Kalkulationstool.md`, `Q-immocation-Tool-Bierdeckelrechnung.md`, `Q-immocation-Tool-App.md`, `Q-immocation-Seite-Richtig-kalkulieren.md`, `Q-immocation-Blog-Kalkulation-in-6-Schritten.md`, `Q-immocation-Blog-Wie-lange-macht-die-Bank-mit.md`, `Q-immocation-Webinar-Marktupdate-2026.md`, `Q-immocation-Podcast-676/678-…`), `30-Wissen/Markt-und-Standort/Marktdaten-Quellenkatalog.md`, `30-Wissen/Recht/Regionale-Rechtsmatrix.md`, `30-Wissen/Bau-und-Energie/Gebaeudemodernisierungsgesetz.md`, `30-Wissen/Finanzierung/Zins.md`, `30-Wissen/Steuern/AfA.md`, `30-Wissen/Vermietung/CO2-Kostenaufteilung.md`.

### immocation
- [I1] https://immocation.de/masterclass/
- [I2] https://immocation.de/steuerclass/
- [I3] https://start.immocation.de/2026
- [I4] https://start.immocation.de/starten
- [I5] https://start.immocation.de/ki-webinar
- [I6] https://immocation.de/downloads-und-tools/
- [I7] https://immocation.de/shop/
- [I8] https://immocation.de/Festival/ ; https://immocation.de/festival
- [I9] https://immocation.de/finanzierung/was-ist-ein-guter-kaufpreis/
- [I10] https://immocation.de/strategie/buy-and-hold/passives-einkommen-mit-immobilien-aufbauen-so-geht-es/
- [I11] https://start.immocation.de/objekte-finden
- [I12] https://www.pricehubble.com/en/pricehubble-news/immocation-pricehubble-digital-property-valuation
- [I13] https://zfu.de/download-pdf/lehrgangssuche-uebersicht/7592526
- [I14] https://podcasts.apple.com/dk/podcast/der-immocation-podcast-lerne-immobilien/id1506078883 ; https://immocation.podigee.io/feed/mp3 ; https://www.deezer.com/en/show/1022052
- [I15] https://immocation.de/tv/
- [I16] https://start.immocation.de/kalkulation
- [I17] https://start.immocation.de/marktupdate26 ; https://start.immocation.de/marktupdate
- [I18] https://start.immocation.de/lmc
- [I19] https://www.interhyp.de/media/files/interhyp-production/ddc9291151e41d23d2f66f3b361df5f65b960e87/interhyp-immocation-info-pdf-kapitalanleger.pdf
- [I21] https://start.immocation.de/de-de/steuern/webinar-martin-richter
- [I22] https://start.immocation.de/videokurs/anmelden

### Markt
- [M1] https://www.finanztip.de/baufinanzierung/hypothekenzinsen/
- [M2] https://www.drklein.de/zinsentwicklung-prognose.html
- [M3] https://www.interhyp.de/zinsen/
- [M4] https://baufivergleich.de/aktuelle-zinsen/
- [M5] https://bau-szene.de/bauzinsen-aktuell/
- [M6] https://www.lbbw.de/artikel/news-und-einschaetzungen/ezb-zinsentscheid-oktober-2026_ann4hvgfja_d.html
- [M7] https://orf.at/stories/3446508/
- [M8] https://www.biallo.de/geldanlage/ratgeber/ezb-leitzins/
- [M9] https://ms-aktuell.de/welt/ezb-zinsentscheid-29-10-2026/
- [M10] https://www.kielinstitut.de/media/news/apartment-prices-below-prior-year-level-for-the-first-time-in-more-than-two-years
- [M11] https://www.kielinstitut.de/media/news/greix-rental-price-index-q3-2026-asking-rents-pick-up-again-existing-stock-apartments-drive-the-trend/ ; PDF https://www.kielinstitut.de/fileadmin/Dateiverwaltung/IfW-Publications/fis-import/0ed55a67-12ea-4348-ae8a-3446d5024451-mietpreisindex_2026q3_de.pdf
- [M12] https://www.konii.de/?p=219143 ; https://ms-aktuell.de/welt/immobilienpreise-mieten-06-11-2026/
- [M13] https://www.pfandbrief.de/wohnimmobilienpreis-anstieg-verliert-an-dynamik/ ; https://www.immobilienmanager.de/vdp-bueropreise-sinken-wohnimmobilienpreise-stagnieren-10112026
- [M14] https://www.vdpresearch.de/preisindizes/
- [M15] https://europace.de/epx-10-26-wohnungspreise-lassen-aufhorchen-waehrend-neubau-und-bestandshaeuser-zulegen/
- [M16] https://www.asscompact.de/nachrichten/europace-wohnungspreise-sinken-erneut
- [M17] https://www.cash-online.de/a/europace-hauspreisindex-eigentumswohnungen-guenstiger-haeuser-teurer-730272/
- [M18] https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/09/PD26_336_61262.html
- [M19] https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/11/PD26_402_3111.html
- [M20] https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/11/PD26_392_611.html
- [M21] https://www.bundesbank.de/de/statistiken/geld-und-kapitalmaerkte/zinssaetze-und-renditen/wohnungsbaukredite-an-private-haushalte-hypothekarkredite-auf-wohngrundstuecke-615036
- [M22] https://www.bundesbank.de/resource/blob/964884/37fc1e33c4e286356ad5b89489fb2a46/472B63F073F071307366337C94F8C870/2026-10-01-mfi-zinsstatistik-download.pdf
- [M23] https://bundesbank.de/resource/blob/615036/b889715b42ceb285461697dd634d6a07/mL/s510athyp-data.pdf
- [M24] https://www.cbre.de/insights/figures/deutschland-wohnungsmarkt-q3-2026
- [M25] https://www.cushmanwakefield.com/de-de/germany/news/2026/10/residential-investmentmarket-germany
- [M26] https://www.realestate.bnpparibas.de/presse/immobilienmaerkte/investmentmarkt-bleibt-unter-vorjahresergebnis
- [M27] https://www.jll.com/de-de/insights/market-dynamics/germany-living
- [M28] https://redaktion-akoga.niedersachsen.de/download/220707/Immobilienmarkt_2024_Pressetext.pdf ; https://redaktion-akoga.niedersachsen.de/download/224011/Immobilienmarktbericht_2025_Pressetext.pdf ; https://redaktion-akoga.niedersachsen.de/download/220680/Immobilienmarkt_2024_KOMPAKT.pdf
- [M29] https://www.zensus2022.de/EN/News/2022_census_4.3_percent_of_all_dewllings_are_vacant.html
- [M30] https://statistik-nord.de/fileadmin/Dokumente/Presseinformationen/SI24_085.pdf ; https://www.destatis.de/DE/Themen/Gesellschaft-Umwelt/Bevoelkerung/Zensus2022/_inhalt.html ; https://www.statistik-bw.de/fileadmin/user_upload/Service/Veroeff/Statistisches_Monatsheft/PDF/11152500403.pdf
- [M31] https://www.cash-online.de/a/wohnungsleerstand-sinkt-deutlich-auf-522-000-einheiten-708662/ ; https://www.empirica-institut.de/fileadmin/Redaktion/Publikationen_Referenzen/PDFs/CBRE-empirica-Leerstandsindex-Methode-2025.pdf
- [M32] https://www.immobilienscout24.de/unternehmen/fileadmin/user_upload/ImmoScout24_WohnBarometer_Q3_2026.pdf
- [M33] https://www.haufe.de/immobilien/entwicklung-vermarktung/marktanalysen/wohnimmobilien-investmentmarkt-deutschland_84324_527002.html
- [M34] https://www.jll.com/de-de/newsroom/zinsanstieg-bremst-erholung-am-deutschen-immobilieninvestmentmarkt
- [M35] https://www.biallo.de/geldanlage/news/bundesanleihe-15-jahreshoch/ ; https://www.boersen-zeitung.de/kapitalmaerkte/bund-renditen-steigen-auf-15-jahres-hoch
- [M36] https://www.cash-online.de/a/bundesbank-finanzstabilitaetsbericht-2026-risiken-bleiben-hoch-730255/
- [M37] https://www.ifw-kiel.de/fileadmin/Dateiverwaltung/IfW-Publications/fis-import/54eeb904-b7ff-4963-aa0d-893d58a01b86-GREIX_Documentation_de.pdf ; https://www.greix.de/
- [M38] https://econtribute.de/?p=11451
- [M39] https://www.kielinstitut.de/fileadmin/Dateiverwaltung/IfW-Publications/fis-import/6e683ec7-4bc0-4729-b7dd-fd09fa54da33-Greix_portfolio_analysis_de.pdf ; https://idw-online.de/de/news869840
- [M39b] https://www.boerse-express.com/news/articles/mietpreise-koeln-schiesst-um-60-nach-oben-berlin-bricht-ein-931132
- [M40] https://mehrfamilienhaus-bewerten.de/ratgeber/multiplikator-mehrfamilienhaus/ ; https://www.david-gramzow.de/immobilien-news/mehrfamilienhaus-verkaufen-berlin/ (Methodik unklar)
- [Z1] https://www.drklein.de/bauzinsen.html ; https://www.interhyp.de/zinsen/?pid=1370&wmid=316
- [Z2] https://www.baufi24.de/presse/pressemitteilungen/zinskommentar-112026
- [Z3] https://www.wetterauer-zeitung.de/wirtschaft/bauzinsen-ueber-prozent-so-viel-mehr-kostet-ein-kredit-ueber-300-000-euro-als-vor-einem-jahr-zr-94606903.html ; https://www.netz-trends.de/bauzinsen-fallen-auf-4-24-prozent-immobilienpreise-sinken-dritten-monat-in-folge/
- [Z4] https://www.bundesbank.de/resource/blob/615214/9309f1a221c5afc34f1b0b953c6d2b8e/472B63F073F071307366337C94F8C870/01-preise-fuer-wohnimmoblien-in-deutschland-data.pdf ; https://www.bundesbank.de/resource/blob/615188/ebd917fa6cab6640922b643b2b38b1c5/472B63F073F071307366337C94F8C870/indikatorensystem-zum-deutschen-wohnungsmarkt-data.pdf

### Recht/Steuern
- [R1] https://www.haufe.de/immobilien/wirtschaft-politik/gesetzentwurf-mietpreisbremse-wird-nachgebessert_84342_472902.html
- [R2] https://dserver.bundestag.de/btd/21/003/2100322.pdf ; https://dserver.bundestag.de/btd/21/000/2100017.pdf
- [R3] https://www.bundesregierung.de/breg-de/service/fragen-und-anworten/verlaengerung-mietpreisbremse-2350648
- [R4] https://www.bundestag.de/presse/hib/kurzmeldungen-1224894
- [R5] https://www.deubner-recht.de/themen/neues-mietrecht/mietrechtsreform-2026/ ; https://mietwatch.de/blog/mietrecht-ii-gesetzentwurf-2026
- [R6] https://dserver.bundestag.de/btd/21/035/2103509.pdf
- [R7] https://www.netz-trends.de/mietrechtsreform-indexmiete-moeblierung-november-2026/ ; https://www.mietervereinigung-berlin.de/news/mietrechtspaket-ii-moeblierte-wohnungen-mietpreisbremse.html
- [R8] https://www.bundesregierung.de/breg-de/aktuelles/neues-gebaeudemodernisierungsgesetz-2430284
- [R9] https://www.bmwsb.bund.de/DE/bauen/innovation-klimaschutz/gebaeudemodernisierungsgesetz/gebaeudemodernisierungsgesetz_node.html
- [R10] https://www.gmodg.bund.de/GEGPortal/DE/Home/startseite/GModG_News/GModG_startseite.html
- [R11] https://www.ingenieurkammer.de/en/aktuelles/detail/gebaeudemodernisierungsgesetz-in-kraft
- [R12] https://bingk.de/gebaeudemodernisierungsgesetz-gmodg-tritt-in-kraft/
- [R13] https://www.kfw.de/PDF/Download-Center/F%C3%B6rderprogramme-(Inlandsf%C3%B6rderung)/PDF-Dokumente/6000005131_M_458.pdf
- [R14] https://www.adac.de/rund-ums-haus/energie/spartipps/foerderung-heizung/
- [R15] https://www.interhyp.de/ratgeber/news/heizungsgesetz-neue-foerderbedingungen/ ; https://baukostenplan.de/ratgeber/kfw-beg-reform-juli-2026-heizungsfoerderung
- [R16] https://www.bundestag.de/presse/hib/kurzmeldungen-1210950 ; https://www.bundestag.de/presse/hib/kurzmeldungen-1218118
- [R17] https://www.bundestag.de/dokumente/textarchiv/2026/kw42-de-brennstoffemissionshandelsgesetz-1223608 ; https://www.bundestag.de/dokumente/textarchiv/2026/kw39-de-brennstoffemissionshandelsgesetz-1211312
- [R18] https://www.encadi.de/news/co2-preis-2027-bundestag-beschliesst-preiskorridor-von-55-bis-65-euro ; https://www.abgeordnetenwatch.de/bundestag/21/abstimmungen/aenderung-des-brennstoffemissionshandelsgesetzes-co2-preis
- [R19] https://dserver.bundestag.de/brd/2026/0462-26.pdf ; https://dserver.bundestag.de/brd/2026/0462-1-26.pdf
- [R20] https://www.c-ober.de/blog/ets-2-verschiebung-behg-co2-kosten-2027/
- [R21] https://www.lto.de/recht/nachrichten/n/bfh-grundsteuer-bundesmodell-verfassungsgemaess ; https://www.beck-aktuell.de/daily/meldung/detail/bfh-iir2524-iir3124-iir325-reform-grundsteuer-verfassungsmaessigkeit ; https://www.etl.de/aktuelles/bfh-grundsteuerreform-verfassungsgemaess/
- [R22] https://www.datev.de/web/de/berufsgruppenuebergreifend/nachrichten/praxis/karlsruhe-als-letzte-hoffnung
- [R23] https://grundsteuer.de/bundesland ; https://www.immowelt.de/ratgeber/wohnen/grundsteuer-berechnung
- [R24] https://www.uhlstaedt-kirchhasel.de/images/content/files/Mitteilung_zur_Grundsteuer_ab_2027.pdf ; https://finanzen.thueringen.de/aktuelles/medieninfo/detailseite/grundsteuer-gesetzesaenderung-macht-weg-frei-fuer-entlastung-der-buergerinnen-und-buerger
- [R25] https://www.baufachinformationen.de/grunderwerbsteuer/ ; https://kapitalanlageimmobilien.net/news/immobilien/grunderwerbsteuer/
- [R26] https://steuerberater-tabak.com/steueraenderungen-2027/
- [R27] https://www.hausundgrund-verband.de/aktuelles/einzelansicht/gesetzentwurf-vorgelegt-fdp-will-grunderwerbsteuer-in-nrw-senken
- [R28] https://www.roedl.com/insights/grunderwerbsteuer-ende-signing-closing-problematik-share-deals/ ; https://www.noerr.com/de/insights/gesetz-zur-modernisierung-des-steuerberatungsrechts-bringt-weitreichende-anderungen-bei-der-grunderwerbsteuer ; https://www.kleeberg.de/en/2026/06/29/aenderung-des-grunderwerbsteuergesetzes-das-ende-der-signing-closing-problematik/ ; https://www.ffg-stb.de/blog/grunderwerbsteuerreform-2026/
- [R29] https://erlanger-treuhand.de/aktuelles/News-Grunderwerbssteuer-ab-2027
- [R30] https://www.haufe.de/immobilien/wirtschaft-politik/afa-im-wohnungsbau-moeglichkeiten-und-nutzen_84342_657666.html ; https://www.zdh.de/ueber-uns/fachbereich-steuern-und-finanzen/lohn-und-einkommensteuer/zeitliche-voraussetzungen-inanspruchnahme-degressive-gebaeude-afa/ ; https://www.gesetze-im-internet.de/estg/__7b.html ; https://www.kreditwesen.de/mimas/system/files/content/inserts/2025/if_2025-06_dsd_creydt.pdf
- [R31] https://www.finanz.de/steuern/einkommensteuertabelle/ ; https://ecovis-kso.com/blog/einkommensteuerreform-2027-was-der-regierungsentwurf-vorsieht/ ; https://www.bundestag.de/resource/blob/1230168/09-ZEW.pdf ; https://www.finanz.de/steuern/steuerreform-2027/
- [R32] https://www.bafin.de/SharedDocs/Veroeffentlichungen/DE/Meldung/2025/meldung_2025_04_30_BaFin_senkt_Systemrisikopuffer.html ; https://www.bundesbank.de/de/aufgaben/themen/ausschuss-fuer-finanzstabilitaet-begruesst-die-entscheidung-der-bundesanstalt-fuer-finanzdienstleistungsaufsicht-den-sektoralen-systemrisikopuffer-auf-1-zu-senken-956564
- [R33] https://nextconcept-immo.com/blog/kapitalpuffer-immobilienkredite-abschaffung-2027 (unbelegte Einzelquelle)

### Daten/Lizenzen
- [D1] https://www.destatis.de/EN/Service/OpenData/api-webservice.html ; https://destatis.de/EN/Service/Legal-Notice/CopyrightGENESISOnlineDatabase.html ; https://genesis.destatis.de/datenbank/online/docs/GENESIS-Webservices_Einfuehrung.pdf
- [D2] https://www.statistikportal.de/de/open-data
- [D3] https://www.zensus2022.de/EN/Census_results/02-release-of-results.html ; https://zensus2022.de/EN/News/Hinweis_Zensusatlas_VOE_en.html ; https://www.destatis.de/DE/Themen/Gesellschaft-Umwelt/Bevoelkerung/Zensus2022/_inhalt.html
- [D4] https://sgx.geodatenzentrum.de/web_public/gdz/lizenz/deu/nutzungsbedingungen_vg250.pdf ; https://sg.geodatenzentrum.de/web_public/gdz/dokumentation/deu/vg250.pdf ; https://gdk.gdi-de.org/geonetwork/srv/api/records/cfbe95dc-81b9-4704-a61c-d71070d15fd3 ; https://sg.geodatenzentrum.de/web_public/gdz/lizenz/deu/nutzungsbedingungen_vg25.pdf
- [D5] https://open.nrw/dataset/bodenrichtwerte-nrw-w ; https://immobilienwerte.nrw/lexikon/datenlizenz-zero-2-0/
- [D6] https://daten.berlin.de/datensaetze/bodenrichtwerte-01-01-2026-wfs-0933be9c
- [D7] https://gdk.gdi-de.org/geonetwork/srv/api/records/3c75402d-0c48-4e0e-89aa-d16fc4f4e345
- [D8] https://www.gag.niedersachsen.de/startseite/bodenrichtwerte/allgemeine_infos/nutzungsbedingungen-197308.html ; https://advmis.geodatenzentrum.de/trefferanzeige?docuuid=2e512a1a-2fec-4094-8a52-a265d1571864 ; https://gdk.gdi-de.org/geonetwork/srv/api/records/debc02be-9ec4-417e-a6a6-1246cdfc87ff
- [D9] https://grundradar.de/quellen ; https://bodenrichtwert-direkt.de/quellen (Drittanbieter-Zusammenstellungen)
- [D10] https://ckan.open.nrw.de/id/dataset/a4fd5a1f-6770-4d96-90fc-3c8618f0bed7
- [D11] https://statistik.arbeitsagentur.de/DE/Home/Service/Impressum/impressum_node.html
- [D12] https://www.bbsr.bund.de/BBSR/DE/forschung/fachbeitraege/raumentwicklung/raumordnungsprognose/rop/01-start.html ; https://www.bay-landkreistag.de/media/103280/vwi-11072024-bbsr-veroeffentlicht-bevoelkerungsprognose-bis-2045.pdf
- [D13] https://www.ihk.de/hannover/hauptnavigation/standort/planen-bauen/raumordnung/landesplanung/landesentwicklung/bundesinstitut-liefert-online-kostenlose-karten-5180796
- [D14] https://www.bundesbank.de/de/statistiken/zeitreihen-datenbanken/-/hilfe-zu-sdmx-webservice-855720 ; https://statistiken.bundesbank.de/content/991448 ; https://www.bundesbank.de/de/startseite/benutzerhinweise/nutzungsbedingungen-regelung-fuer-die-weiterverwendung-von-eszb-statistiken-613500
- [D15] https://www.gesetze-im-internet.de/urhg/__5.html ; https://lexetius.com/2006,3016
- [D16] https://spdx.org/licenses/DL-DE-BY-2.0.html
- [D17] https://search.r-project.org/CRAN/packages/restatis/restatis.pdf
- [D19] https://www.kielinstitut.de/research/research-centers/macroeconomics/macrofinance/rental-price-index/

### Tools
- [E1] https://rechner-hub.de/mietrendite-rechner/
- [E2] https://www.interhyp.de/kapitalanlage-in-immobilien/ ; https://www.interhyp.de/kapitalanlage-in-immobilien/rendite-berechnen/
- [E3] https://www.miet-check.de/Mietblog/2026/07/29/immobilien-kapitalanlage-vermieter-leitfaden/
- [E4] https://www.test.de/immobilien-als-kapitalanlage-rechner-1179772-6296378/
- [E5] https://www.ing.de/baufinanzierung/kapitalanlage/kapitalanlagerechner/
- [E6] https://immo-rechner.net/rechner/kaufpreisfaktor-rechner ; https://immo-rechner.net/ratgeber/grunderwerbsteuer-2026 ; https://renditerechner24.de/kaufpreisfaktor-immobilien-tabelle
- [E7] https://www.steuerschroeder.de/Steuerrechner/Sonder-Afa-Mietwohnung.html ; https://www.steuerschroeder.de/Steuerrechner/Einkommensteuer.html
- [E8] https://www.deutschland-rechner.de/grundsteuer-rechner ; https://www.deutschland-rechner.de/steuerreform-2027-rechner
- [E9] https://www.heise.de/download/specials/immocloud-im-Test-Immobilienverwaltung-fuer-Vermieter-und-Hausverwalter-11226206
- [E10] https://www.capterra.com.de/software/1039512/immocloud ; https://omr.com/de/reviews/product/immocloud
