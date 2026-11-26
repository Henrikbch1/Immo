# 14 – IC-Vault: Fallstudien, Strategie & Portfolio, immocation-Methodik

> Grundlage für Spielprogression, Szenarien und Realismus-Kalibrierung eines
> Immobilien-Investment-Simulationsspiels (Deutschland). Abgeleitet ausschließlich aus dem
> Obsidian-Vault `/home/user/IC/vault` (nur gelesen, nichts geändert).

| | |
|---|---|
| Erstellt | 2026-11-26 |
| Vault-Stand | Notizen bis 2026-10-01 (Karten), Marktwerte bis 30.09.2026 |
| Gelesen (vollständig) | `80-Fallstudien` (7), `00-Start` (Start + 5 Karten), `30-Wissen/Strategie-und-Portfolio` (6), [[Eigentumswohnung-oder-Mehrfamilienhaus]], [[Portfoliobetrachtung-der-Bank]], [[Kreditrahmen]] |
| Gelesen (gezielt/überflogen) | alle 57 Quellennotizen in `90-Quellen/Anbieter/immocation`; ergänzend [[Cashflow]], [[Cashflow-vor-und-nach-Steuern]], [[Negativer-Cashflow]], [[Selbst-abzahlende-Immobilie]], [[Passives-Einkommen]], [[Bruttomietrendite]], [[Kaufpreisfaktor]], [[Bierdeckelrechnung]], [[Hebeleffekt]], [[Liquiditaetspuffer]], [[Zins]], [[Kalkulatorischer-Stresszins]], [[Haushaltsrechnung]], [[Beleihungsgrenze]], [[Instandhaltungsreserve]], [[Kaufnebenkosten]], [[Vermoegensverwaltende-GmbH]], [[Mikroapartment]], [[Sondervermietung]], [[Bautraegeraufschlag]], [[Off-Market-Deal]], [[Standortklassifikation-A-bis-D]], [[Gebaeudemodernisierungsgesetz]], [[Prozess-Haushaltsplan-und-Vermoegensaufstellung]], [[Recherche-Backlog]] |

**Kennzeichnung in diesem Dokument**

- **[V]** = im Vault belegt (Notiz als Wikilink genannt)
- **[R]** = eigene Nachrechnung mit Vault-Zahlen und Vault-Formeln
- **[A]** = Annahme oder Designvorschlag – **nicht** im Vault belegt, vor Verwendung als Spielwert prüfen

**Gültigkeit – bitte beachten**

- Alle fünf Quellennotizen zu Fallstudien (`Q-immocation-Blog-Fallstudie-*`) tragen `gueltigkeit: historisch`,
  Sicherheit C, Stufe 5 (Anbieter-Ratgeber). Die Fallstudiennotizen selbst sind `status: entwurf` und
  tragen `gueltigkeit: aktuell` (Adele, Dominik, Sebastian Nürnberg) oder `unbekannt` (Daniel, Jochen,
  Marco und Stefan, Sebastian Hildesheim). Die Zahlen stammen aus 2001–2021, überwiegend aus der
  Niedrigzinsphase, und sind **nicht** auf 2026 übertragbar.
- Alle Fallstudien sind Erfolgsgeschichten aus dem Umfeld eines kostenpflichtigen Bildungsanbieters
  (Survivorship Bias). Gescheiterte Verläufe fehlen vollständig.
- Bankparameter (25 % Mietabschlag, 8 % Stresszins, 80 % Beleihungswert) sind Stand 04/2021
  ([[Kreditrahmen]], [[Haushaltsrechnung]]: `gueltigkeit: unbekannt`). Abweichende Marktübersichten
  2026 (Sicherheit B, Stand 30.09.2026) sind jeweils dazugeschrieben.
- Keine Steuer- oder Rechtsberatung; steuerliche und rechtliche Spielregeln müssen gegen die
  Steuer-/Recht-Recherchen (andere Dokumente dieser Reihe) abgeglichen werden.

---

## 0. Kurzfazit

1. **Nur eine der sieben Fallstudien ist vollständig durchrechenbar** ([[Fallstudie-Marco-und-Stefan]]).
   Bei den anderen fehlen Kaufpreis, Miete oder Finanzierung – sie taugen als **Größenordnungs-
   und Verhaltens-Benchmarks**, nicht als exakte Zielwerte.
2. **Muster:** Einstieg neben dem Vollzeitjob, oft nach einer Weiterbildung; eine Phase „ohne
   Strategie“ geht dem systematischen Aufbau voraus; drei von sieben starten (entgegen der
   eigenen Anbieter-Empfehlung) mit einem Mehrfamilienhaus; Off-Market-Zugang (Bank, Netzwerk)
   wirkt als Beschleuniger.
3. **Cashflow-Größenordnung (Niedrigzinsphase):** Einzel-ETW ca. −40 bis +40 EUR/Monat; MFH ca.
   150–170 EUR je Einheit und Monat vor Steuern (Adele, Co-Investment) [R]; Dominiks rechnerische
   ≈ 333 EUR je Wohneinheit sind mit den bekannten Zahlen nicht plausibel.
4. **Die Bank bremst in keiner Fallstudie sichtbar.** Die Bremse ist nur im Bank-Artikel beschrieben
   (Kreditrahmen → Portfoliobetrachtung, Beleihung < 80 %) – ohne Schwellenwert „ab X Einheiten“.
   Das Spiel muss die Bremse aus den Bank-Notizen modellieren, nicht aus Fallstudien kalibrieren.
5. **Wertsteigerung ist im Vault Zusatz, nicht Kaufgrund** ([[Investition-ohne-Wertsteigerung]]);
   keine Fallstudie beziffert eine realisierte Wertsteigerung. **Eigenkapital-Recycling** durch
   Nachbeleihung (Cash-out) ist **nicht** beschrieben – nur Cashflow-Recycling (Jochen), Bonität
   über niedrige Beleihung und Verkauf.
6. **Zentraler Kalibrierungsbefund [R]:** Die immocation-Schwelle „rund 6 % Bruttomietrendite =
   selbst abzahlend“ ergibt sich exakt aus 2 % Zins + 2 % Tilgung bei einem Drittel Kostenquote.
   Bei 4 % Zins + 2 % Tilgung (Größenordnung 2026) braucht dieselbe Logik ca. 9 %. Diese
   Verschiebung ist der Kern des Schwierigkeitsgrads „Zinsumfeld“.

---

## 1. Fallstudien-Matrix

### 1.1 Die sieben Fallstudien

| Person | Startsituation | Objekte (Art, Ort, Preis, Miete, Finanzierung) | Zeitachse | Strategie | Ergebnis | Fehler / Hürden | Quelle (Stand, Gültigkeit) |
|---|---|---|---|---|---|---|---|
| **Adele** | Vollzeit angestellt, leitende Position im Kundenservice eines Mobilitätsunternehmens; vorher nur Sparen (Robo-Advisor-Sparplan); verheiratet, Aufgabenteilung Aktien (Mann) / Immobilien (sie). Alter, Einkommen, EK: nicht genannt | MFH, 7 WE, 428 m² (≈ 61 m²/WE [R]), Fürstenwalde (Berliner Speckgürtel, entspricht B-Lage-Beschreibung), über Portal gefunden. Kaufpreis, Miete, Finanzierung, Baujahr: nicht genannt. Bierdeckel: 7 % (brutto/netto offen) | Weiterbildung Ende 2019 → Kauf nach ca. 3 Monaten (laut URL) → Artikel 05/2021 | Buy & Hold, MFH als Erstobjekt; Standorttour durch den Speckgürtel; [[Bierdeckelrechnung]] als Filter; Akquise am Wochenende und vor/nach der Arbeit | 1.200 EUR/Monat Cashflow **vor Steuern** (≈ 171 EUR/WE [R]); 7 Einheiten | Doppelbelastung neben Vollzeit (nicht problematisiert); ob Rücklagen im Cashflow stecken, offen; Zustand unbekannt | [[Fallstudie-Adele-Fuerstenwalde]], [[Q-immocation-Blog-Fallstudie-Adele]] (2021-05; Q: historisch) |
| **Daniel** | 41 (Artikelzeitpunkt), 18 Jahre Großkonzern (Azubi bis Projektmanager für Projekte > 100 Mio. EUR), Berlin; schriftliches Ziel „in 13 Jahren Millionär“ mit Vermögensbilanz. Einkommen, EK: nicht genannt | (1) 2001: MFH, 3 WE, 100.000 DM, 1.400 DM/Monat (≈ 16,8 % brutto [R], historisch), mit einem Freund gekauft, 2008 verkauft. (2) 2008: MFH Bad Freienwalde, 100.000 EUR; WE, Miete, Finanzierung: nicht genannt | 2001 Erstkauf → 2008 Verkauf (Geld für Eigenheim) und Kauf in der Wirtschaftskrise; 1. Million mit 35 (in DM), in EUR mit 37 | Zielsetzung + Vermögensbilanz; [[Antizyklischer-Kauf]] (viele Angebote, wenig Nachfrage 2008); Co-Investment beim Erstobjekt | „Millionär“ – Vermögensbegriff, Zusammensetzung und Bewertungsbasis nicht genannt | [[Uebersanierung]]: isolierter Keller → Feuchte → Lüftungsanlage (Kosten n. g.); Ziel ohne Währung formuliert; Erstobjekt für Eigenheim verkauft (Kapitalabzug) | [[Fallstudie-Daniel-Bad-Freienwalde]], [[Q-immocation-Blog-Fallstudie-Daniel]] (undatiert; Q: historisch) |
| **Dominik** | Saarland (Tholey-Hasborn), Sicherheit wichtig; Beruf, Alter, Einkommen, EK: nicht genannt | (abgelehnt, 2018) ETW 78 m², 130.000 EUR, 350 EUR kalt → 3,2 % brutto, Faktor 31 [R]. (gekauft) MFH Bj. 1940, Neunkirchen, 3 WE + 1 leere Gewerbeeinheit (ehem. Gaststätte), [[Off-Market-Deal]] über den Bankberater; 2 WE à 480 EUR (Miete vom Amt); Kaufpreis, 3. Miete, Finanzierung: nicht genannt; Ölheizung „gut“ | 2018 Absage → Weiterbildung → Standortanalyse (Radius: Landau, Saarbrücken, Neunkirchen) → Finanzplan mit der Bank → Kauf (Jahr n. g.) → Artikel 02/2021 | Renditeziel 8 % vor der Suche; MFH als Erstobjekt; Off-Market; [[Anschaffungsnahe-Herstellungskosten-15-Prozent|15-Prozent-Grenze]] vor dem Kauf geprüft | 1.000 EUR/Monat Cashflow laut Titel (Stufe offen); 3 WE + 1 GE | Leerstand Gewerbe; zwei WE an einem Kostenträger (Klumpen); Ölheizung (Regulierung); ob 8 % erreicht, offen; 1.000 EUR mit bekannten Zahlen nicht plausibel reproduzierbar (siehe 5.2) | [[Fallstudie-Dominik-Neunkirchen]], [[Q-immocation-Blog-Fallstudie-Dominik]] (2021-02; Q: historisch) |
| **Jochen** | 2006 erste Wohnung per Zwangsversteigerung, zweite zur Eigennutzung – beides ohne Strategie; 2014 Immobilienseminar. Beruf, Alter, Einkommen, EK: nicht genannt | Überwiegend 1-Zimmer-Wohnungen, Ø ca. 35.000 EUR, Bestandsmiete 180–250 EUR kalt (6,2–8,6 % brutto [R]) → möbliert neu vermietet ab 400 EUR (≥ 13,7 % [R]); Heilbronn, Ludwigsburg, Stuttgart; Anzahl, Finanzierung: nicht genannt | 2014–2017: Aufbau in 3 Jahren | Buy & Hold kleiner Einheiten, Cashflow-Fokus; Mieterwechsel nutzen → möblierte Neuvermietung ([[Sondervermietung]]); Cashflow finanziert weitere Käufe; Rat: anfangs mehrere Standorte vergleichen | „Kann davon leben“ (Betrag, Einheitenzahl n. g.) | Möblierungskosten, Leerstand bei Wechsel, Verwaltungsaufwand, Mietrecht möbliert und steuerliche Einordnung – alles offen | [[Fallstudie-Jochen]], [[Q-immocation-Blog-In-3-Jahren-zum-Investor]] (undatiert) |
| **Marco & Stefan** (Gründer) | Zwei Vollzeitstellen (Konzernkarrieren 2017 beendet laut [[Q-immocation-Webinar-Marktupdate-2026]]); EK 7.000 EUR. Alter, Einkommen: nicht genannt | 1-Zi-DG-Wohnung bei Stuttgart, 58.000 EUR, **100 % des Kaufpreises finanziert**, EK 7.000 EUR für Nebenkosten; 2,5 % Zins, 3,5 % Tilgung, „27 Jahre“; 400 EUR kalt (8,3 % brutto, Faktor 12,1 [R]); 500 km vom Wohnort | Kaufjahr n. g.; 2017 Gründung des Anbieters; 2026 „400+ eigene Immobilien“ | Buy & Hold, [[Selbst-abzahlende-Immobilie]], Fernkauf, Vollfinanzierung, Nebenkosten aus EK | +40 EUR/Monat im 1. Jahr; 300 EUR/Monat ab Jahr 28 (nominal); 2026: > 400 Immobilien (Zusammensetzung, Finanzierung n. g.) | Kein Puffer im Modell; laufende Kosten nicht genannt (rückgerechnet ≈ 70 EUR/Monat [R]); Laufzeit 27 J. passt nicht zur Nachrechnung (≈ 22 J. [R]) | [[Fallstudie-Marco-und-Stefan]], [[Q-immocation-Blog-Passives-Einkommen-aufbauen]], [[Q-immocation-Blog-Standortanalyse]] (undatiert) |
| **Sebastian (Hildesheim)** | 13 J. Informatiker, dann selbständig in der Friseurbranche; Motiv Altersvorsorge; kein Vorwissen. Alter, Einkommen, EK: nicht genannt | (1) 2011: 2 Zi., 63 m², Hochparterre + Garage, gute Wohnlage, 63.000 EUR (1.000 EUR/m² [R]) + 15.000 EUR Komplettsanierung (≈ 24 % des KP [R]); heute 8 % Mietrendite. (2) 2013: 60 m² in einem vom Bauträger umgebauten Kirchenzentrum (11 WE), 92.000 EUR (≈ 1.533 EUR/m² [R]); 4,7 % → 5,1 %; Zins 4 % gefordert → 3 % verhandelt (5 J. Bindung) → 2018 Anschluss 2,5 %; Sonderumlage Dach 3.000 EUR | 2011 → 2013 → 2018 Anschlussfinanzierung | Zunächst ohne Strategie (Objekt 1 zur Eigennutzung gedacht), später bewusst Buy & Hold | Objekt 1: −26 EUR/Monat; Objekt 2: anfangs −30 bis −40, heute +10 EUR/Monat; gesamt ≈ −16 EUR/Monat [R] | [[Negativer-Cashflow]], [[Bautraegeraufschlag]], [[Sonderumlage]], [[Spekulationsfrist]] unbekannt; Titel „36 WE in einem Jahr“ im Text nicht belegt | [[Fallstudie-Sebastian-Hildesheim]], [[Q-immocation-Blog-Fallstudie-Sebastian-Hildesheim]] (undatiert; Q: historisch) |
| **Sebastian (Nürnberg)** | 8 J. Informatiker im Großkonzern → kleinere Firma → 2009 selbständiger Makler (Kaltakquise, Neubaugeschäft) → Aufbau einer Bestandsabteilung bei einem Bauträger | MFH kaufen, sanieren, weiterverkaufen; 2011 Quelle-Liegenschaften → [[Mikroapartment]]s an Kapitalanleger; eigener Bestand > 40 Objekte, bis zu 80 gehandelt; Schwerpunkt Sondervermietung; keine Objektkennzahlen | 2009 → 2011 → Artikel 11/2020 | Netzwerk / Off-Market, Value-Add + Verkauf, Umnutzung Gewerbe → Wohnen, Unternehmens-EK | 40 Mio. EUR Umsatz der Abteilung im 1. Jahr (≠ Gewinn); > 40 Objekte (≈ 3,6 Objekte/Jahr über 2009–2020 [R]) | Gewerblicher Grundstückshandel und Baurecht der Umnutzung nicht thematisiert; nicht auf Privatanleger übertragbar | [[Fallstudie-Sebastian-Nuernberg]], [[Q-immocation-Blog-Fallstudie-Sebastian-Nuernberg]] (2020-11; Q: historisch) |

### 1.2 Ergänzende Investorenprofile aus den Quellennotizen

Keine eigenen Fallstudiennotizen, aber mit Zahlen; nützlich für Profile und Endgame-Benchmarks.

| Person | Daten laut Quelle | Quelle (Stand) |
|---|---|---|
| Martin Richter (Steuerberater, Coach) | 1. Wohnung: Plattenbau Erzgebirge 25.000 EUR, 180 EUR Cashflow (Zeitraum n. g.), privat; Bank finanzierte bei dem niedrigen Preis auch die Nebenkosten. Danach Holding + vvGmbH: 2 WE Chemnitz im Paket, 72.000 EUR / 120 m² (600 EUR/m² [R]). Außerdem privat: 2 ETW (Pirna, Dresden 33 m²), je 7 % Mietrendite, 134.000 EUR Kredit gemeinsam (Gesamtfinanzierung günstiger), privat wegen Wertsteigerung und 10-Jahres-Frist | [[Q-immocation-Blog-Steuerberater-Tricks]] (2020-11), [[Q-immocation-Blog-9-Steuerkniffe-beim-Kauf]] (undatiert) |
| Co-Investment Richter + Partner | MFH Erzgebirge, 8 WE + 1 Gewerbe, über Mandantennetzwerk angeboten; 10 % Rendite (Art n. g.), ≈ 1.400 EUR/Monat erwartet (≈ 156 EUR/Einheit [R]); 5 J. finanzieren, sanieren, Miete erhöhen, dann verkaufen; 50/50 über zwei Holdings + gemeinsame vvGmbH | [[Q-immocation-Blog-Co-Investor-steueroptimiert]] (2021-05) |
| Markus Rehkugler (Bauträger, Makler, Coach) | Erste ETW mit 24 (vom Vater übernommen); 2006 mit Partner zwei Objekte für 12 Mio. EUR (Hochhaus 66 WE); Bauträgerprojekte; 2017 Maklerbüro; > 80 WE; warnt vor 110 % Beleihung des Gesamtbestands | [[Q-immocation-Blog-MFH-in-ETW-umwandeln]] (undatiert, vermutlich ~2022) |
| Gründer (aktuell) | „400+ eigene Immobilien“, Konzernkarrieren 2017 beendet | [[Q-immocation-Webinar-Marktupdate-2026]] (2026) |
| „Daniel“ (Neubau-Runde) | Eigene Neubaukalkulation für einen Ort mit 40.000 EW und 8 EUR/m² Miete ging nicht auf; ob identisch mit Daniel (Bad Freienwalde), ist offen | [[Q-immocation-Blog-Neubau-als-Kapitalanlage]] (Video 10/2018) |

### 1.3 Muster über alle Fallstudien

**a) Einstiegsobjekt.** Drei Einstiege mit MFH (Adele 7 WE, Dominik 3 WE + GE, Daniel 3 WE),
drei mit kleinen Wohnungen (Marco & Stefan, Jochen, Sebastian H.), einer gewerblich
(Sebastian N.). Die Anbieter-Empfehlung lautet dagegen: erst 1–2 kleine ETW, dann MFH
([[Eigentumswohnung-oder-Mehrfamilienhaus]], Stand 2020-11). Der Vault erklärt den Widerspruch
mit Begleitung durch ein Coaching-Programm und Erfolgsauswahl; keine Quelle nennt Kapital- oder
Erfahrungsschwellen für ein MFH als Erstobjekt.
→ *Spiel:* MFH als Erstobjekt **möglich, aber riskanter**, nicht gesperrt.

**b) Auslöser und Lernkurve.** Fünf von sieben haben eine Phase „ohne Strategie“ oder einen
externen Auslöser: Weiterbildung (Adele, Dominik), Seminar (Jochen 2014, acht Jahre nach dem
ersten Kauf), Ratgeberbuch (Daniel), Rentenangst ohne Vorwissen (Sebastian H.). Der systematische
Aufbau beginnt erst danach.
→ *Spiel:* Wissensstufen, die Werkzeuge freischalten (Bierdeckel → Vollkalkulation → Standortanalyse
→ Steuerstruktur), statt alles ab Start verfügbar.

**c) Zeitbudget.** Fast alle investieren neben einem Vollzeitjob (Adele, Gründer mit zwei Jobs,
Daniel im Konzern) oder einer Selbständigkeit (Sebastian H.). Adele erledigt die Akquise in
Randzeiten; die Gründer kaufen 500 km entfernt mit delegierter Besichtigung
([[Q-immocation-Blog-Standortanalyse]]).
→ *Spiel:* begrenzte Aktionspunkte pro Monat; Delegation (Besichtigung durch Bekannte, Hausverwaltung)
als Ressource.

**d) Renditeziele als Filter.** 7 % „könnte klappen“ (Adele), 8 % Ziel (Dominik), 8,3 % (Gründer),
13,7 % nach möblierter Neuvermietung (Jochen), 4,7 % bei Kauf (Sebastian H. – führte zu negativem
Cashflow), 3,2 % abgelehnt (Dominik). Die Quellen nennen als Schwellen 5 % (Bierdeckel-Tool),
rund 6 % (selbst abzahlend), 10 % (selten / Bankrechnung) ([[Bruttomietrendite]]).

**e) Wachstumstempo.** Kein Fall nennt „Einheiten pro Jahr“. Ableitbare Tempo-Benchmarks:

| Fall | Tempo | Belegqualität |
|---|---|---|
| Adele | ~3 Monate von der Weiterbildung bis zum ersten MFH (7 WE) | nur URL-Angabe |
| Jochen | 3 Jahre systematischer Aufbau bis „davon leben“ | Anzahl fehlt |
| Sebastian H. | 2 WE in 2 Jahren (2011, 2013), danach kein weiterer Kauf berichtet | belegt |
| Daniel | 2001 erstes Objekt, 2008 zweites (als Investor) | belegt |
| Sebastian N. | > 40 Objekte in ~11 Jahren ≈ 3,6/Jahr [R] (Profi, Unternehmens-EK) | Objekte ≠ Einheiten |
| Rehkugler | > 80 WE; Zeitraum ab erster ETW mit 24 (heutiges Alter n. g.) | Zeitraum unklar |
| Gründer | von 1 WE auf > 400 Immobilien bis 2026 | Startjahr unbekannt |

**f) Wann die Bank bremst.** In **keiner** Fallstudie wird eine Ablehnung oder ein Finanzierungsstopp
beschrieben. Die Bank tritt nur als Ermöglicher auf: 100-%-Finanzierung (Gründer), Zinsverhandlung
4 → 3 % (Sebastian H.), Finanzplan und Off-Market-Kontakt (Dominik), Mitfinanzierung der
Nebenkosten bei 25.000 EUR Kaufpreis und günstigere Gesamtfinanzierung für zwei Wohnungen
(Richter). Die Bremse beschreibt nur [[Q-immocation-Blog-Wie-lange-macht-die-Bank-mit]] (04/2021):
[[Haushaltsrechnung]] → individueller [[Kreditrahmen]] aus Vermögen und Gehalt → ist er ausgeschöpft,
[[Portfoliobetrachtung-der-Bank]]; Bestand mit Beleihung < 80 % zählt positiv. Kriterien und
Schwellen nennt die Quelle nicht; die angekündigte Spanne des Rahmens ist abgeschnitten. 2026
werden Banken als „behäbiger“ beschrieben ([[Q-immocation-Webinar-Marktupdate-2026]]).
→ *Spiel:* Die Bremse muss aus der Bankmechanik entstehen (Haushaltsrechnung, Beleihung,
Kreditrahmen), nicht aus einer Fallstudien-Kalibrierung „nach X Einheiten“.

**g) Rolle der Wertsteigerung.** Alle Fallstudien argumentieren mit Rendite und Cashflow. Laut
[[Investition-ohne-Wertsteigerung]] muss sich ein Kauf ohne Wertsteigerung rechnen. Wertsteigerung
taucht nur auf als (1) Bonitätshebel – gesunkene Beleihung durch Tilgung und gestiegene Werte bis
2021 ([[Beleihungsgrenze]]); (2) Argument für den Privatkauf mit steuerfreiem Verkauf nach zehn
Jahren (Richter, Pirna/Dresden; [[Spekulationsfrist]]); (3) Hebelrechnung: 1 % auf 100.000 EUR bei
10.000 EUR EK = +10 % EK-Rendite ([[Hebeleffekt]]); (4) Exit nach Value-Add (Co-Investment nach
5 Jahren, Sebastian N.). **Keine Fallstudie beziffert eine realisierte Wertsteigerung.**
→ *Spiel:* Wertentwicklung als unsicherer Zusatz mit Abwärtsrisiko (fallende Preise erhöhen die
Beleihung und kehren den Bonitätsvorteil um), nicht als Basisannahme.

**h) Eigenkapital-Recycling.** Eine Nachbeleihung zur Freisetzung von Eigenkapital (Cash-out) ist im
Vault **nicht** beschrieben. Vorhanden sind: Cashflow-Recycling (Jochen), Eigenkapital schonen statt
recyceln („freies Kapital lieber in eine zweite Immobilie“, 100 % Kaufpreis finanzieren,
[[Q-immocation-Blog-Finanzierung-in-4-Schritten]]), Bonität über Beleihung < 80 %
([[Portfoliobetrachtung-der-Bank]]), Verkauf (Daniel 2008 – allerdings für das Eigenheim;
Sebastian N. als Händler; Co-Investment-Exit), Aufteilung ([[Aufteilung-in-Wohnungseigentum]]).
Gegenposition: 110 % Beleihung des Gesamtbestands sei „ein gewagtes Unterfangen“ (Rehkugler).

**i) Off-Market und Netzwerk als Beschleuniger.** Bankberater (Dominik), Maklernetzwerk
(Sebastian N.), Mandantennetzwerk (Richter, Co-Investment) ([[Off-Market-Deal]]). Der Vault warnt:
Vermittler können eigene Interessen haben, fehlender Wettbewerb ersetzt keine Prüfung.

**j) Cashflow-Größenordnungen (vor Steuern, Niedrigzinsphase).** Einzel-ETW: −40 bis +40 EUR/Monat
(Gründer +40, Sebastian H. −26 / −40 → +10); Ausreißer Plattenbau Erzgebirge 180 EUR (Zeitraum n. g.).
MFH: ≈ 156–171 EUR je Einheit (Adele, Co-Investment erwartet) [R]; Dominik rechnerisch ≈ 333 EUR je
Wohneinheit, aber unplausibel (siehe 5.2).

**k) Datenqualität.** Kaufpreis fehlt bei Adele, Dominik (MFH), Jochen (je Einheit nur Ø), Sebastian N.;
Mieten fehlen bei Daniel 2008 und Sebastian H.; Finanzierung fehlt überall außer bei den Gründern.
Fast nie ist angegeben, ob Cashflow vor/nach Steuern und mit/ohne Rücklagen gemeint ist.

---

## 2. Strategien als Spielpfade

Jeder Pfad: Voraussetzungen · Risiken · typische Kennzahlen · wann sinnvoll · Spielmechanik-Vorschlag.

### 2.1 Buy & Hold Eigentumswohnung (Startpfad)

- **Voraussetzungen:** Eigenkapital für [[Kaufnebenkosten]] (Notar/Grundbuch ≈ 2 % als ältere Pauschale,
  Grunderwerbsteuer je Land – ältere Quellen 3,5–6,5 %, Bremen seit 01.07.2025 5,5 %; Makler je
  Vereinbarung); Liquiditätspuffer 10.000–20.000 EUR ([[Liquiditaetspuffer]]); tragfähige
  [[Haushaltsrechnung]]; Standort „lohnenswert und zukunftssicher“ ([[Lohnenswerter-Standort]]).
- **Risiken:** Mietausfall, unerwartete Kosten, Zinsänderung ([[Q-immocation-Blog-Risiken-der-Kapitalanlage]]);
  WEG-Beschlüsse und [[Sonderumlage]] (Sebastian H.: 3.000 EUR Dach); nicht umlagefähiges Hausgeld.
- **Kennzahlen:** Bruttomietrendite 5–6 % als Schwelle (Niedrigzins); Gründer 8,3 % / Faktor 12,1;
  Sebastian H. 4,7–8 %; Cashflow −40 bis +40 EUR/Monat.
- **Wann sinnvoll:** Einstieg (Anbieter-Empfehlung: „gemachtes Nest“ mit Verwaltung, Rücklagen,
  Protokollen), Streuung über Standorte, wenig Zeit.
- **Mechanik:** Standardpfad im Tutorial. WEG als Akteur mit Ereignissen (Sonderumlage,
  Beschlüsse); WEG-Protokolle als kaufbare Information in der Due Diligence [A]; Fernkauf mit
  delegierter Besichtigung = höhere Informationsunsicherheit [A].

### 2.2 Mehrfamilienhaus

- **Voraussetzungen:** mehr Zeit und Verantwortung für das ganze Gebäude (Dach, Fassade, Heizung);
  laut Anbieter nach 1–2 Wohnungen; Fallstudien zeigen MFH auch als Erstobjekt (mit Begleitung).
  Bankkonditionen für Erstinvestoren-MFH: **offen** ([[Eigentumswohnung-oder-Mehrfamilienhaus]]).
- **Risiken:** kein Streueffekt – alle Einheiten an einem Standort ([[Risikostreuung-ueber-Standorte]]);
  Gesamtsanierung; Gewerbe-Leerstand (Dominik); [[Regulatorisches-Bestandsrisiko]] (Heizung,
  Solarpflicht, CO₂-Kosten); Maklerhalbteilung nach § 656c BGB gilt nicht für MFH ([[Kaufnebenkosten]]).
- **Kennzahlen:** Adele 7 % / 7 WE / 1.200 EUR; Dominik Ziel 8 % / 1.000 EUR (Stufe offen);
  Co-Investment 10 % / 9 Einheiten / ≈ 1.400 EUR erwartet; Daniel 2001 16,8 % (historisch).
- **Wann sinnvoll:** Skalierung, eigenständige Entscheidungen (Balkonanbau, energetische Maßnahmen),
  Mietpotenzial „soweit gesetzlich zulässig“ voll ausschöpfen.
- **Mechanik:** Objekt mit Einheiten **und** Gebäudekomponenten (Dach, Heizung, Fassade mit
  Restlebensdauer) [A]; Gewerbeeinheit als eigener Einheitentyp mit eigenem Leerstandsrisiko [A];
  Erstkauf eines MFH ohne Vorerfahrung erlaubt, aber mit strengeren Bankbedingungen und höherem
  Fehlerrisiko [A].

### 2.3 Value-Add / Renovierung

- **Voraussetzungen:** Kapital für Kaufnebenkosten **und** Renovierung (Banken finanzieren Nebenkosten
  selten mit, [[Q-immocation-Blog-Kalkulation-in-6-Schritten]]); Kostenschätzung durch Fachleute;
  [[Sollmiete]] kennen; 15-Prozent-Grenze (anschaffungsnahe Herstellungskosten, Drei-Jahres-Zeitraum,
  netto) planen.
- **Risiken:** Kostentreiber Heizung, Leitungen, Elektrik; Bad als eigener Block
  ([[Q-immocation-Blog-Wohnung-renovieren]]); [[Uebersanierung]] mit Bauphysik-Schäden (Daniel);
  Überschreiten der 15-%-Grenze; Leerstand während der Arbeiten.
- **Kennzahlen:** Sebastian H.: 15.000 EUR Sanierung = 24 % des Kaufpreises → 8 % Rendite, aber
  Cashflow −26; Heizkörper 80–120 EUR/Stück, ≈ 1.000 EUR Material für 70 m²; Jochen: Miete
  180–250 → ≥ 400 EUR möbliert; Bierdeckel Stufe 2 = erzielbare Jahresmiete / (Kaufpreis +
  Renovierung) ([[Bierdeckelrechnung]]).
- **Wann sinnvoll:** Objekte unter Marktmiete („solide vermietet“, [[Q-immocation-Blog-9-haeufigste-Fehler-beim-Kauf]]),
  Mieterwechsel, optische Mängel (kein Ausschlusskriterium).
- **Mechanik:** Gewerke-Auswahl mit Kostenstreuung [A]; Mieterwechsel-Ereignis als Fenster für
  Neuvermietung; Drei-Jahres-Zähler für die 15-%-Grenze mit Warnung; Übersanierungs-Ereignis bei
  „zu viel“ Maßnahmen ohne Bauphysik-Prüfung [A].

### 2.4 Aufteilung in Wohnungseigentum

- **Voraussetzungen:** MFH im Bestand; kein [[Milieuschutz]]; [[Abgeschlossenheit]] (Wände/Decken,
  eigener Zugang, Kochstelle, Bad, WC); [[Aufteilungsplan]] bei der Baubehörde; nachfragestarke Lage.
- **Risiken:** Kosten und Dauer unbekannt; Genehmigungspflichten, Mietervorkaufsrecht,
  Kündigungssperrfrist im Vault nur als offene Frage; gewerblicher Grundstückshandel bei mehreren
  Verkäufen; außerhalb attraktiver Lagen möglicherweise keine Nachfrage.
- **Kennzahlen:** `Aufteilungsgewinn = Σ Einzelverkaufspreise − Gesamtverkaufspreis − Aufteilungskosten`;
  **keine Zahlen** im Vault (Quelle undatiert, ~2022; `gueltigkeit: unbekannt`).
- **Wann sinnvoll:** Profi-Geschäft (Sprecher ist Bauträger und Makler).
- **Mechanik:** Spätes Freischalten; Projekt mit Dauer, Kosten und Genehmigungsrisiko abhängig vom
  Gebietsstatus (Milieuschutz-Flag aus den Regel-Daten) [A]; Prämie beim Einzelverkauf [A];
  Steuerwarnung „gewerblicher Grundstückshandel“.

### 2.5 Neubau

- **Voraussetzungen:** Profi-Know-how und Unternehmens-EK; Baukosten inkl. Grundstück ≤ 2.000 EUR/m²
  und Mieten um 15 EUR/m² (nur Großstädte wie München, Stuttgart, Frankfurt) – Stand 2018
  ([[Neubaurendite]], [[Q-immocation-Blog-Neubau-als-Kapitalanlage]]).
- **Risiken:** Baukostensteigerungen (seit 2021), Bauzeit, Zwischenfinanzierung; fehlende Nachfrage auf
  dem Land; beim Kauf vom Bauträger der [[Bautraegeraufschlag]] (Sebastian H.: Cashflow dauerhaft gedrückt);
  Regulatorik: Nullemissionsstandard für Neubauten ab 2030 laut [[Gebaeudemodernisierungsgesetz]]
  (Rechtsstand 27.09.2026, `gueltigkeit: unbekannt`).
- **Kennzahlen:** 10 EUR/m² × 12 / 2.000 EUR/m² = 6 %; Fazit-Forderung 15 EUR/m² ≈ 9 % [R]; Ort mit
  8 EUR/m² ≈ 4,8 % [R]; Baukosten 1.700–2.000 EUR/m² (2018); Bauträgermarge 10–30 %
  ([[Verkaufsmarge-im-Bautraegergeschaeft]]).
- **Wann sinnvoll:** laut Fazit nicht für Normalinvestoren.
- **Mechanik:** (a) Neubau-ETW vom Bauträger kaufen = höherer EUR/m², geringe Anfangsinstandhaltung,
  Cashflow-Malus; (b) Bauträger-Modus als Endgame-Freischaltung mit Projektrisiko und Marge
  10–30 % [A für Spielwerte].

### 2.6 Mikroapartment / möblierte Sondervermietung

- **Voraussetzungen:** urbane, zentrale Lage, Hochschul- oder Metropolregion; Kapital für Möblierung;
  Verwaltungskapazität ([[Mikroapartment]], [[Sondervermietung]]).
- **Risiken:** Fluktuation und Leerstand beim Wechsel; Verwaltungsaufwand; Wettbewerb (> 1.700
  spezialisierte Anbieter); Mietrecht möbliert/befristet und gewerbliche Nähe ungeklärt; in der
  Corona-Phase waren Firmenmieter möblierter Wohnungen betroffen ([[Q-immocation-News-Corona-Update-3]], historisch).
- **Kennzahlen:** 18–42 m²; Jochen 35.000 EUR, 6,2–8,6 % → ≥ 13,7 % [R]; Nachfrage: Singlehaushalte 42 %
  (amtlich 2025: 42,1 %), Ein-/Zweipersonenhaushalte 2030 laut amtlicher Vorausberechnung ≈ 77 %
  (Studie: 81 %) ([[Q-immocation-Blog-Microliving]]).
- **Wann sinnvoll:** Cashflow-Strategie mit wenig Kapital je Einheit.
- **Mechanik:** Einheitentyp „möbliert/Mikro“ mit höherer Miete, höherer Wechselrate,
  Möblierungs-Capex und Leerstandsmonaten je Wechsel [A – Werte fehlen im Vault]; Standortfilter
  Stadt + Hochschule.

### 2.7 Antizyklisch kaufen

- **Voraussetzungen:** Liquidität und Finanzierungszugang in der Krise (ob Finanzierung dann leichter
  oder schwerer ist, beschreibt der einzige Beleg nicht); Bewertungskompetenz ([[Antizyklischer-Kauf]]).
- **Risiken:** Tiefpunkt nur im Rückblick erkennbar; Verwechslung mit Notverkauf oder notleidendem
  Objekt; einziger Beleg ist eine Anekdote (Daniel 2008).
- **Kennzahlen:** Daniel: MFH für 100.000 EUR in der Krise 2008; 2026: „nachgebende Preise, wieder
  verhandelbar“, Banken „behäbiger“ – ohne Daten ([[Q-immocation-Webinar-Marktupdate-2026]]).
- **Mechanik:** Marktphasen-System: in der Krise mehr Angebote, weniger Konkurrenz, Preisnachlass
  verhandelbar, aber strengere Bank [A]; nur wer Puffer und Bonität bewahrt hat, kann zugreifen.

### 2.8 Standortstreuung

- **Voraussetzungen:** Kenntnis mehrerer Märkte; Verwaltung an mehreren Orten.
- **Risiken:** Mehraufwand; „Standort-Hopping“ ist laut [[Q-immocation-Blog-9-haeufigste-Fehler-beim-Kauf]]
  Fehler Nr. 1.
- **Kennzahlen:** keine im Vault. Sequenz laut Vault-Erklärung: erst mehrere Standorte vergleichen
  (Jochen), dann fokussieren, über die Jahre streuen ([[Risikostreuung-ueber-Standorte]]).
- **Mechanik:** „Marktkenntnis“ je Standort, die mit Beobachtungszeit steigt (bessere Deals, weniger
  Informationsasymmetrie) [A]; Portfolio-Risikoanzeige nach [[Portfolio-Risiko]]: Region,
  Arbeitgeber, gleichzeitige Zinsbindungsenden, Sanierungsjahre, Liquidität.

### 2.9 GmbH-Struktur (vvGmbH, Holding, Co-Investment)

- **Voraussetzungen:** Steuerberatung; „ab einer gewissen Portfoliogröße“ (Schwelle n. g.); Gewinne
  privat nicht benötigt ([[Thesaurierung]]); hohe Mietrendite und geringe Wertsteigerungserwartung
  (Heuristik 9 %, Empfehlung abgeschnitten); Voraussetzungen der [[Erweiterte-Gewerbesteuerkuerzung]]
  ([[Vermoegensverwaltende-GmbH]], Stand 27.09.2026, `gueltigkeit: unbekannt`).
- **Risiken:** private Bürgschaft gegenüber der Bank (Haftung trotz GmbH); Gründungs- und laufende
  Kosten n. g.; keine private 10-Jahres-Frist; Ausschüttungsbesteuerung; [[Betriebsaufspaltung]];
  Meldepflichten [[Transparenzregister]] (offen).
- **Kennzahlen:** 15 % Objektgesellschaft vs. 42 % Grenzsteuersatz privat (laut Quelle); 15,825 %
  KSt + Soli nur auf Gesellschaftsebene (Backlog); Ausschüttung an Holding zu 95 % steuerfrei →
  0,75 % [R] vs. 1,5 % laut Quelle; 30 % operative Gesellschaft.
- **Wann sinnvoll:** Cashflow-starke Objekte mit Reinvestition; nicht für Wertsteigerungsobjekte;
  „zuerst muss der Cashflow stimmen“ ([[Q-immocation-Podcast-586-Steuer-Guide]]).
- **Mechanik:** Freischaltung über Steuerberater-Kontakt + Mindestportfolio [A]; je Kauf Wahl privat
  oder GmbH; GmbH: niedrigere Steuer auf einbehaltene Überschüsse, fixe Jahreskosten [A], kein
  steuerfreier Verkauf nach 10 Jahren, Ausschüttungssteuer, Bank verlangt weiter Privatbürgschaft;
  Co-Investment mit Partner und Ausstieg über Anteilsverkauf.

### 2.10 Übersicht

| Pfad | Freischaltung (Vorschlag) | Kapitalbedarf | Zeitaufwand | Hauptrisiko | Belegdichte im Vault |
|---|---|---|---|---|---|
| Buy & Hold ETW | Start | niedrig | niedrig | Sonderumlage, Zins | gut (Gründer vollständig) |
| MFH | nach 1–2 ETW oder Wissensstufe | mittel–hoch | hoch | Klumpen, Gebäude | mittel (Zahlen lückenhaft) |
| Value-Add | Fachmann-Kontakt | mittel | hoch | Kostenüberschreitung, 15-%-Grenze | mittel |
| Aufteilung | MFH im Bestand + Profi-Stufe | hoch | hoch | Recht, Genehmigung | schwach (keine Zahlen) |
| Neubau / Bauträger | Profi-Status | sehr hoch | sehr hoch | Baukosten, Nachfrage | schwach (Stand 2018) |
| Mikro / möbliert | Standort mit Hochschule | niedrig je Einheit | hoch | Fluktuation, Mietrecht | schwach (keine Kosten) |
| Antizyklisch | Marktphase „Krise“ | Liquidität | mittel | Timing | Anekdote |
| Standortstreuung | ab 2. Standort | – | mittel | Aufwand | qualitativ |
| GmbH / Holding | Steuerberater + Portfoliogröße | Strukturkosten | mittel | Haftung, Kosten | mittel (Steuersätze), Schwellen fehlen |

Querschnitts-Modifikatoren: Off-Market-Zugang, Fernkauf, Vollfinanzierung/Hebel, Tilgungswahl
([[Q-immocation-Blog-Optimale-Tilgung]]), Finanzierungsvermittler.

---

## 3. immocation-Methodik

### 3.1 Kalkulation

**Prüfablauf (Trichter)** laut [[Q-immocation-Blog-Wohnungsbesichtigung]] und
[[Q-immocation-Seite-Objektpruefung]]:

1. Erste Bierdeckelrechnung (Ist-Miete aus dem Inserat)
2. „Bierdeckel-Bewertung“ (Vorprüfung in Minuten; Inhalt im Vault ungeklärt)
3. Erstgespräch: Mikrolage? Erzielbare Miete? Sanierungskosten direkt nach Kauf?
4. Zweite Bierdeckelrechnung mit erzielbarer Miete und Renovierungskosten
5. Besichtigung und Dokumentenanforderung
6. Detailprüfung (Vollständigkeit) und Kaufentscheidung mit Vollkalkulation

**Bierdeckelrechnung** ([[Bierdeckelrechnung]], [[Q-immocation-Tool-Bierdeckelrechnung]], undatiert):
`Bruttomietrendite = Kaltmiete × 12 / Kaufpreis × 100`. Erstfilter, ersetzt keine Kalkulation.
Bei ≈ 5 %: „Es könnte sein, dass die Wohnung sich von selbst abbezahlt.“ Andere Quellen: rund 6 %
für selbst abzahlende Wohnungen; 3 % nur mit Wertsteigerungsspekulation; 10 % selten.

**Kalkulation in 6 Schritten** ([[Q-immocation-Blog-Kalkulation-in-6-Schritten]], 2020-11):
belegt sind (1) Mieteinnahmen im ersten Jahr, (2) Bankrate = Darlehen × (Sollzins + Anfangstilgung),
(3) Eigenkapitalbedarf (Kaufpreis zu 100 % finanziert, Nebenkosten aus EK), (4) Kaufnebenkosten
(Notar/Grundbuch ≈ 2 %, GrESt 3,5–6,5 %, Makler; auch die Grundschuldeintragung kostet).
Die späteren Schritte (Bewirtschaftungskosten, Steuer, Cashflow-Ergebnis) sind im frei zugänglichen
Text nicht vollständig; Ziel ist der monatliche Überschuss oder die Zuzahlung aus dem Einkommen.

**Cashflow richtig rechnen** ([[Q-immocation-Seite-Richtig-kalkulieren]], [[Q-immocation-Podcast-536-Cashflow-richtig-rechnen]] 01/2025, [[Cashflow]]):

```text
Mieteinnahmen − Bewirtschaftungskosten (nicht umlagefähig) = operativer Cashflow
− Zins − Tilgung                                          = Cashflow nach Finanzierung (= „vor Steuern“)
∓ Steuerzahlung / Steuererstattung                         = Cashflow nach Steuern
(geplante Rücklagenzuführung separat ausweisen)
Kreditsumme = Kaufpreis + Kaufnebenkosten − Eigenkapital
```

Stellschrauben: Miethöhe, Kreditsumme, Konditionen, Betriebskosten (z. B. Hausverwaltung),
Rücklagen. Entscheidungsregel: nur Wohnungen kaufen, die sich „großteils“ selbst abzahlen, an
zukunftssicheren Standorten; Zuzahlung muss tragbar sein (Grenze nennt keine Quelle). Die
Podcastfolge rechnet zusätzlich rückwärts, welcher **Kaufpreis** nötig ist, um die eigenen Ziele zu
erreichen (Inhalt nur aus der Episodenbeschreibung bekannt).

**Guter Kaufpreis** ([[Q-immocation-Podcast-528-Guter-Kaufpreis]], 2025): Bierdeckel als erster Filter,
lokales Kaufpreisniveau als zweiter Maßstab, weitere Indikatoren (unbekannt).

**Steuer:** zuerst Cashflow, dann Steuerkonstrukte (#586); steuerlicher Überschuss ≠ Cashflow (#625);
Kaufpreisaufteilung „auf jeden Fall“ (#676, 09/2026); AfA wirkt auf die Steuer, nicht auf den
Cashflow; Tilgung umgekehrt ([[Cashflow-vor-und-nach-Steuern]]). [[Nettomietrendite]] mit
Kaufnebenkosten im Nenner und nicht umlagefähigen Kosten im Zähler gilt als maßgebliche Kennzahl
([[Q-immocation-Blog-9-Steuerkniffe-beim-Kauf]]).

**Rücklagen – uneinheitlich:** 3 % der Kaltmiete als Mietrücklage ([[Mietausfallreserve]]) vs.
33 % „laufende Kosten“ im Modell (2.000 von 6.000 EUR); Instandhaltungs-Orientierungswerte der
II. BV ab 01.01.2026: 11,50 / 14,58 / 18,62 EUR/m² und Jahr (Gebäude < 22 / ab 22 / ab 32 Jahre;
rechtlich nur preisgebundener Wohnraum, Sicherheit A) ([[Instandhaltungsreserve]]).

### 3.2 Finanzierung

**„4 Schritte“** ([[Q-immocation-Blog-Finanzierung-in-4-Schritten]], undatiert, ~2020–2021; Schritte 3–4
im Text nicht vollständig erkennbar):
1. Annuitätendarlehen: konstante Rate, sinkender Zins-, steigender Tilgungsanteil; 2 % + 2 % → 333 EUR/Monat
   je 100.000 EUR, Laufzeit „36 Jahre“ (Nachrechnung ≈ 35 J. [R]).
2. Eigenkapital: „je weniger, desto lohnender – aus rein rechnerischer Sicht“; freies Kapital lieber in
   eine zweite Immobilie.
3. Liquiditätspuffer mindestens 10.000–20.000 EUR zu Beginn (pro Objekt oder Portfolio: offen).
4. Grundschuld als Sicherheit; bei 50 % Finanzierung „ohne Weiteres“, bei 100 % genaue Bonitätsprüfung.
Fazit: **Kaufpreis zu 100 % finanzieren, Nebenkosten aus Eigenkapital.**

**Bankperspektive** ([[Q-immocation-Blog-Wie-lange-macht-die-Bank-mit]], 04/2021):

| Parameter | 2021 laut Quelle | 2026 laut Marktübersichten (Sicherheit B, 30.09.2026) |
|---|---|---|
| Mietanrechnung | 75 % der Jahresbruttokaltmiete (25 % Abschlag) | meist 60–80 % der **Nettokalt**miete |
| Stresszins | pauschal 8 % | vielfach 5–6 % |
| Beleihungswert | meist 80 % des Marktpreises | oft rund 10 % unter Verkehrswert |
| Kaufnebenkosten | selten mitfinanziert | aus Eigenkapital erwartet |
| Effektivzins (10 J. Bindung) | ~1,5 % (Zinsniveau um 2019–2021) | ≈ 3,9–4,5 %, je nach Beleihung und Bonität |

Quellen: [[Haushaltsrechnung]], [[Kalkulatorischer-Stresszins]], [[Zins]]. Weitere Regeln aus dem Artikel:
Kauf über Marktwert → schlechtere Konditionen und mehr Eigenkapital; Kreditrahmen aus Vermögen
und Gehalt; jenseits davon Portfoliobetrachtung; Bestand < 80 % beliehen stärkt die Bonität.
Abgeleitete Mindestrendite, wenn die Miete allein den Stress tragen soll: 8 % / 0,75 ≈ 10,7 % [R] –
laut Quelle „nur schwer umsetzbar“; in der echten Haushaltsrechnung zählt auch das übrige Einkommen.

**Tilgung** ([[Q-immocation-Blog-Optimale-Tilgung]], 2020-11): Zielkonflikt – hohe Tilgung senkt das
Anschlussrisiko, niedrige Tilgung lässt Liquidität für Rücklagen und weitere Käufe. Keine pauschale
Empfehlung.

**Hebel** ([[Q-immocation-Blog-Hebel-mit-Fremdkapital]], 2021-01): EK-Rendite 20 % (10.000 EUR EK) vs.
6 % (50.000 EUR EK); Bedingung im Vault ergänzt: Objektrendite > Kreditkosten **und** Liquidität
vorhanden ([[Hebeleffekt]]). Spannung zu „Optimale Tilgung“ und zur 110-%-Warnung.

**Finanzierungsvermittler** ([[Q-immocation-Seite-Finanzierung-mit-Interhyp]]): parallele Anfrage bei
vielen Banken; vom Anbieter geschulte Berater – Interessenlage beachten.

### 3.3 Risiken

- Drei Hauptrisiken: Mietausfall/Leerstand, unerwartet hohe Kosten, steigende Zinsen; Gegenmittel:
  attraktives Objekt am lohnenswerten Standort, Mieterprüfung (Gehalt, SCHUFA), konsequentes
  Mahnwesen, Mietrücklage ≈ 3 % der Kaltmiete, Unterlagen von Verwaltung und Verkäufer
  ([[Q-immocation-Blog-Risiken-der-Kapitalanlage]], 2020-12).
- Mietnomade: Förderzusage eines Amtes ist keine Zahlungsgarantie; kein Auskunftsanspruch gegenüber
  dem Amt; Verfahren dauern Monate ([[Q-immocation-Blog-Mietnomade]]).
- Zinsanstieg-Kette: höhere Raten → weniger Käufer → Preisdruck → Preisrückgang
  ([[Q-immocation-Blog-Immobilienblase]]); Prognosen sind unsicher ([[Prognosen-kritisch-lesen]]).
- Regulierung: Heizung, Solarpflicht, CO₂-Kosten – in den Anbieter-Kalkulationen nicht eingepreist
  ([[Regulatorisches-Bestandsrisiko]]).
- Portfolioebene: gleichzeitige Zinsbindungsenden, gebündelte Sanierungen, Konzentration
  ([[Portfolio-Risiko]], 2026-09).
- Historisch (Krisenereignis-Vorlage): Corona-Mietmoratorium 01.04.–30.06.2020; bei einer Verwaltung
  mit ≈ 3.000 Einheiten meldeten sich ≈ 200 Mieter (≈ 6,7 % [R], Betroffenen-, keine Ausfallquote)
  ([[Q-immocation-News-Corona-Update-3]], historisch).

### 3.4 Passives Einkommen – realistisch

[[Q-immocation-Seite-Passives-Einkommen-realistisch]] und [[Passives-Einkommen]]: Stellgrößen sind
Mietrendite, Zins und Tilgungsrate. Kurzfristig davon leben erfordert „sehr viel Geld“; mit wenig
Kapital ist es möglich, dauert aber Jahrzehnte (Gründer: 40 EUR/Monat im 1. Jahr, 300 EUR/Monat
nach Entschuldung). Jochens „davon leben nach 3 Jahren“ ist die Ausnahme mit Hochrendite-Kleineinheiten
und unbekannter Einheitenzahl. „Passiv“ ist relativ (Verwaltung, Instandhaltung).

### 3.5 Was die immocation-Tools berechnen

| Tool | Eingaben | Ausgaben | Offen |
|---|---|---|---|
| Bierdeckelrechnung (Web) | Kaufpreis 20.000–500.000 EUR, Kaltmiete 200–1.500 EUR/Monat, Wohnfläche 20–200 m² (Schieberegler) | Bruttomietrendite, EUR/m² Kauf und Miete, Bewertungstext | Texte für andere Werte; Aktualisierung |
| App | wie Web-Rechner | Bierdeckel + „Bierdeckel-Rente“ (nötige Sparleistung und Verzinsung für eine eigene Rente) | Rechenlogik und Zinsannahme der Rente |
| Kalkulationstool (Excel) | nicht offengelegt | Rendite, Cashflow, Kaufpreisfaktor „inkl. Steuer“; Darstellung für die Bank | Renditeart, Rücklagensätze, Steuerannahmen |
| Passives-Einkommen-Rechner | Mietrendite, Zins, Tilgungsrate | Hochrechnung passives Einkommen heute/künftig | ob Kosten, Leerstand, Steuer enthalten |
| Bewertungstool Objektprüfung | nicht offengelegt | Bierdeckel-Bewertung / Prüfung | Kriterienkatalog |
| Standort-Tool | Ort | Angebotsdaten (PriceHubble), Prognos-Rang, Bruttorendite | Abweichung Berlin 5,87 % vs. Nachrechnung 3,07 % ungeklärt ([[Recherche-Backlog]]) |

### 3.6 Mindestfunktionen des Spiel-Rechners

1. **Bierdeckel Stufe 1 und 2** (Ist-Miete / erzielbare Miete inkl. Renovierung im Nenner), EUR/m²,
   [[Kaufpreisfaktor]].
2. **Gesamtkapitalbedarf und Eigenkapitalbedarf:** Kaufpreis + Kaufnebenkosten je Bundesland (GrESt,
   Notar/Grundbuch, Makler; Halbteilung nur ETW/EFH) + Anfangsrenovierung + Puffer
   ([[Prozess-Haushaltsplan-und-Vermoegensaufstellung]]).
3. **Annuität:** Rate, Zins-/Tilgungsanteil, Restschuld nach n Jahren, Laufzeit
   `ln(1 + z/t) / ln(1 + z)` ([[Annuitaet]]), Sondertilgung, Anschlusszins-Szenario.
4. **Cashflow-Kaskade in drei Stufen** mit getrennter Rücklagenzuführung (nicht mit tatsächlichen
   Reparaturen vermischen) – Monat und Jahr nie mischen.
5. **Steuerliches Ergebnis** (Miete − Werbungskosten − Zins − AfA; Tilgung zählt nicht) × Grenzsteuersatz
   → Cashflow nach Steuern; Verlustverrechnung mit dem übrigen Einkommen.
6. **Renditen:** brutto, netto (mit Kaufnebenkosten), Eigenkapitalrendite mit und ohne Tilgung und
   Wertänderung – Zähler immer ausweisen.
7. **Bankprüfung:** Haushaltsrechnung mit Mietanrechnungsquote und Stresszins (parametrisierbar nach
   Marktphase), Beleihungswert/Beleihungsauslauf, Kreditrahmen, Portfoliobetrachtung; Malus bei
   Kauf über Marktwert.
8. **Rückwärtsrechnung:** maximaler Kaufpreis für eine Zielrendite oder einen Ziel-Cashflow (wie in #536).
9. **Portfolio-Aggregation:** Summen, Beleihung je Objekt und gesamt, Zinsbindungs-Kalender,
   Klumpen (Region, Kostenträger), Liquiditätsreichweite ([[Portfolio-Risiko]]).
10. **Stresstests:** Mietausfall n Monate, Sonderumlage, Anschlusszins +x Prozentpunkte, Wertrückgang.
11. **Hochrechnung passives Einkommen** (Entschuldungszeitpunkt, operativer Cashflow danach; nominal und real).
12. **Fristen-Timer:** 15-%-Grenze (3 Jahre), private Veräußerungsfrist (10 Jahre, [[Spekulationsfrist]]),
    Zinsbindungsende.
13. **Bank-Dossier-Export** (Objekt- und Haushaltsdaten) als Lern-Artefakt
    ([[Prozess-Finanzierungsdossier-Bank]]).

Über immocation hinaus nötig (im Vault als Lücke markiert): regulatorische Kostenposition,
Inflation/Mietentwicklung, tragbare Zuzahlungsgrenze.

---

## 4. Spielprogression – Vorschlag

### 4.1 Designprinzipien (fachlich begründet)

- **Cashflow vor Struktur:** Steuerkonstrukte erst freischalten, wenn das Objekt-Cashflow-Verständnis
  sitzt ([[Q-immocation-Podcast-586-Steuer-Guide]]).
- **Lernen durch Fehler:** Die Fallstudien zeigen typische Fehlerphasen (ohne Strategie kaufen,
  Bauträgerpreise, Spekulationsfrist unbekannt) – diese sollen im Spiel passieren **können** und
  erklärt werden.
- **Bank als Systemgegner, nicht als Zufall:** Finanzierbarkeit entsteht aus Haushaltsrechnung,
  Beleihung und Bonität.
- **Wertsteigerung nicht einplanen** ([[Investition-ohne-Wertsteigerung]]); Marktpreise schwanken
  in beide Richtungen.
- **Kein Erfolgsversprechen:** Startprofile basieren auf Erfolgsgeschichten; das Spiel braucht
  Gegenbeispiele (Leerstand, Zinsschock, Sonderumlage), sonst reproduziert es den Survivorship Bias.

### 4.2 Startprofile

Personenwerte (Alter, Einkommen, Eigenkapital) fehlen in fast allen Fallstudien. Alle Zahlen mit [A]
sind Designparameter und mit der Einkommens-/Steuer-Recherche abzugleichen.

| # | Profil (Vorbild) | Belegte Merkmale [V] | Startparameter [A] | Marktphase | Typisches Ziel / Lernbogen |
|---|---|---|---|---|---|
| P1 | **Gründer-Duo, wenig EK** ([[Fallstudie-Marco-und-Stefan]]) | zwei Vollzeitstellen; EK 7.000 EUR für Nebenkosten; 100 % Kaufpreis finanziert; Fernkauf 500 km | Haushalt mit zwei Angestellteneinkommen; Puffer 10.000 EUR (an Vault-Empfehlung 10–20k angelehnt); Wissen: Bierdeckel | Niedrigzins (2,5 % [V]) | erste selbst abzahlende Wohnung; lernt: Vollfinanzierung braucht trotzdem EK; Cashflow ≈ 0 |
| P2 | **Vollzeit-Angestellte mit Partner, MFH-Einstieg** ([[Fallstudie-Adele-Fuerstenwalde]]) | leitende Angestellte, Vollzeit; vorher Sparplan; Partner baut Aktien-Säule; Akquise nur in Randzeiten | Sparvermögen mittel; Aktionspunkte knapp; Wissen nach Weiterbildung | Ende 2019 / Niedrigzins (~1,5 % [V]) | 7-WE-MFH in B-Lage mit ≈ 1.200 EUR/Monat CF vor Steuern; lernt: MFH = Klumpen, Gebäudeverantwortung |
| P3 | **Sicherheitsorientierter Regionalsucher** ([[Fallstudie-Dominik-Neunkirchen]]) | Heimatregion mit ~3 % Renditen; Renditeziel 8 %; gute Bankbeziehung | mittleres EK; Bankbeziehung → Off-Market-Chance | 2018–2021 | lernt: Absage ist eine Entscheidung; Suchradius erweitern; Gewerbe-Leerstand und Kostenträger-Klumpen |
| P4 | **Cashflow-Stratege kleine Einheiten** ([[Fallstudie-Jochen]]) | Vorerfahrung: 1 Wohnung aus Zwangsversteigerung, 1 selbstgenutzt; ab 2014 systematisch; Ø 35.000 EUR je Einheit | geringes EK, Bestand als Startkapital; hoher Zeiteinsatz | 2014–2017 (Zins im Vault für diese Jahre nicht belegt; 2013: 3 %, 2018: 2,5 % [V]) | „davon leben“ in 3 Jahren; lernt: Fluktuation als Chance und Risiko, Möblierungskapital |
| P5 | **Selbständiger Altersvorsorger ohne Plan** ([[Fallstudie-Sebastian-Hildesheim]]) | selbständig (vorher 13 J. IT); kein Vorwissen; kauft 2011 und 2013 | Einkommen schwankend (Bank strenger) [A]; kein Puffer | 2011–2018; 2013: 4 % gefordert / 3 % verhandelt [V] | „Hard Mode durch Fehler“: negativer Cashflow, Bauträgeraufschlag, Sonderumlage, Spekulationsfrist |
| P6 | **Einsteiger 2026** (Vault-Rechenbeispiele) | Beispiele: 200.000 EUR Kaufpreis in Bremen, 90 % Beleihung → 50.000 EUR EK-Bedarf ([[Prozess-Haushaltsplan-und-Vermoegensaufstellung]], eigene Vault-Rechnung); 250.000 EUR / 80.000 EUR Eigenmittel → CF −3.320 EUR/Jahr ([[Cashflow]], hypothetisch) | EK 50.000–80.000 EUR; Angestelltenhaushalt | 2026: 3,9–4,5 % eff. [V, Sicherheit B] | lernt: alte 5–6-%-Faustregeln tragen nicht mehr; Verhandlung, Tilgungswahl, Zuzahlung |
| (B) | **Profi / Endgame-Benchmark** ([[Fallstudie-Sebastian-Nuernberg]], Rehkugler, Gründer heute, ggf. [[Fallstudie-Daniel-Bad-Freienwalde]]) | > 40 Objekte (Sebastian N.), > 80 WE (Rehkugler), > 400 Immobilien (Gründer); Daniel: Konzern-PM, Zielsetzung, Co-Investment 2001, Krisenkauf 2008 | nicht spielbar als Start; Rivalen-NPC oder „Legendenstufe“ | – | Bauträger, Aufteilung, Netzwerk-Deals |

Daniel kann alternativ als **P7 „Zielsetzer im Konzern, antizyklisch“** (Start 2001 mit Co-Investor,
Krisenszenario 2008) dienen; für 2001 fehlt im Vault ein Zinswert (belegt: 1990er > 8 %, 2009 4,5 %).

### 4.3 Meilensteine / Ziele

| # | Meilenstein | Messgröße im Spiel | Fachliche Begründung | Benchmark |
|---|---|---|---|---|
| M1 | Bankfähig | Haushaltsplan + Vermögensaufstellung vollständig; Bankprüfung bestanden | Finanzplan mit der Bank vor der Suche (Dominik) | [[Prozess-Haushaltsplan-und-Vermoegensaufstellung]] |
| M2 | Erstes Objekt | Kauf nach Bierdeckel → Detailprüfung → Vollkalkulation | Prüftrichter | alle Fallstudien |
| M3 | Selbst abzahlend | Cashflow nach Finanzierung ≥ 0 **inkl.** Rücklagen | Zielbild immocation | [[Selbst-abzahlende-Immobilie]] |
| M4 | Erstes MFH | ≥ 3 WE in einem Gebäude | ETW → MFH | Adele, Dominik, Daniel |
| M5 | 1.000 EUR Portfolio-Cashflow/Monat vor Steuern | Summe CF n. Fin. | Größenordnung Adele/Dominik | 1.000–1.200 EUR |
| M6 | 10 Einheiten | Anzahl WE | Skalierungsschwelle [A] | – |
| M7 | Portfoliobetrachtung | einkommensbasierter Kreditrahmen ausgeschöpft **und** Bestand < 80 % beliehen → Bank finanziert weiter | Mechanik der Bank | [[Portfoliobetrachtung-der-Bank]] |
| M8 | 1 Mio. EUR Bestand | Summe Marktwerte | Größenordnung [A] | Adele-MFH vermutlich 0,6–1 Mio. (Rückrechnung, siehe 5.2) |
| M9 | Positiver Cashflow nach Steuern (Portfolio) | CF n. St. ≥ 0 über ein ganzes Jahr | Steuerstufe ehrlich rechnen | [[Cashflow-vor-und-nach-Steuern]] |
| M10 | Erstes entschuldetes Objekt | Restschuld = 0 | passives Einkommen = operativer Cashflow | Gründer: 300 EUR/Monat |
| M11 | Off-Market-Deal | Kauf über Bank/Netzwerk | Beschleuniger | Dominik, Sebastian N. |
| M12 | Krise überstanden | Anschlussfinanzierung oder Marktabschwung ohne Zwangsverkauf | Zinsrisiko | [[Anschlussfinanzierung]] |
| M13 | Steuerstruktur | vvGmbH/Holding gegründet und wirtschaftlich (nach Strukturkosten) | erst ab Portfoliogröße | [[Vermoegensverwaltende-GmbH]] |
| M14 | Nettovermögen 1 Mio. EUR | Marktwerte − Schulden + Liquidität (Währung und Definition festlegen!) | Daniels Ziel | [[Fallstudie-Daniel-Bad-Freienwalde]] |
| M15 | „Davon leben“ | Portfolio-CF nach Steuern ≥ Lebenshaltung des Haushalts über 12 Monate | Jochens Ziel | [[Fallstudie-Jochen]] |
| M16 | Legendenstufen | 40 Objekte / 80 WE / 400 Immobilien | Profi-Benchmarks | Sebastian N., Rehkugler, Gründer |

### 4.4 Freischaltungen

| Freischaltung | Bedingung (Vorschlag [A]) | Fachliche Begründung |
|---|---|---|
| Vollkalkulation (Steuerstufe) | nach erstem Bierdeckel-Durchlauf | Trichter: Bierdeckel ersetzt keine Kalkulation |
| MFH | 1–2 ETW im Bestand **oder** Wissensstufe „Weiterbildung“ | Anbieter-Empfehlung vs. Fallstudien mit Coaching |
| Off-Market über Bank | Finanzierung oder Finanzplan bei derselben Bank | Dominik |
| Off-Market über Netzwerk | Netzwerkpunkte (Branchenrolle, Steuerberater, Makler) | Sebastian N., Richter |
| Möblierte / Mikro-Vermietung | Standort mit Hochschule/Metropole + Möblierungskapital | Jochen, [[Mikroapartment]] |
| Größere Sanierungen | Fachmann-Kontakt + Wissen zur 15-%-Grenze | [[Q-immocation-Blog-Wohnung-renovieren]] |
| Portfoliobetrachtung | automatisch bei ausgeschöpftem Kreditrahmen und Beleihung < 80 % | Bank-Artikel |
| vvGmbH / Holding | Steuerberater + Mindestportfolio + Cashflow-starke Objekte | [[Vermoegensverwaltende-GmbH]], [[Holding]] |
| Co-Investment | Partner + (optional) Holding | Daniel 2001, Richter 2021 |
| Aufteilung in WEG | MFH im Bestand + Abgeschlossenheit + kein Milieuschutz | [[Aufteilung-in-Wohnungseigentum]] |
| Bauträger / Neubau-Projekt | Profi-Status (Netzwerk, hohes EK, Erfahrung) | [[Neubaurendite]], Sebastian N. |
| Antizyklischer Zugriff | Marktphase „Krise“ + Puffer + Bonität | [[Antizyklischer-Kauf]] |

### 4.5 Typische Fallen als Lernmomente

| Falle | Auslöser im Spiel | Konsequenz | Lektion / Quelle |
|---|---|---|---|
| Kaufen ohne Strategie | Kauf ohne Kalkulation (P5) | negativer Cashflow über Jahre | [[Fallstudie-Sebastian-Hildesheim]] |
| Bauträgerpreis | Neubau-/Umbau-ETW mit hohem EUR/m² | Cashflow dauerhaft gedrückt | [[Bautraegeraufschlag]] |
| Sonderumlage | WEG-Ereignis am Gemeinschaftseigentum | Einmalzahlung (3.000 EUR im Beispiel) | [[Sonderumlage]] |
| Übersanierung | Maßnahme ohne Bauphysik-Prüfung | Feuchte, Folgekosten | [[Uebersanierung]] |
| Geschönte Exposé-Miete / „solide vermietet“ | Inserat ohne Mietprüfung | Rendite niedriger als gedacht oder Chance | [[Q-immocation-Blog-9-haeufigste-Fehler-beim-Kauf]] |
| 3 % kaufen und auf Wertsteigerung hoffen | Kauf unter Schwelle | Zuzahlung, Preisrisiko | [[Investition-ohne-Wertsteigerung]] |
| Standort-Hopping | ständiger Standortwechsel | keine Marktkenntnis, schlechtere Deals | [[Risikostreuung-ueber-Standorte]] |
| MFH = Streuung (Irrtum) | Konzentration an einem Ort | Standortschock trifft alles | [[Eigentumswohnung-oder-Mehrfamilienhaus]] |
| Kein Puffer | Kauf ohne Liquidität | Rate aus Einkommen bei erster Reparatur | [[Liquiditaetspuffer]] |
| Zinsbindungsende | Anschluss bei höherem Zins | Rate steigt (4 % statt 2 % → +50 % Rate im Beispiel) | [[Q-immocation-Blog-Optimale-Tilgung]] |
| 110 % Beleihung | maximale Fremdfinanzierung im ganzen Bestand | Bonität und Krisenfestigkeit sinken | [[Q-immocation-Blog-MFH-in-ETW-umwandeln]] |
| Kauf über Marktwert | Überzahlung | schlechtere Konditionen, mehr EK | [[Q-immocation-Blog-Wie-lange-macht-die-Bank-mit]] |
| Mietnomade / Amtszusage | Mieter mit Förderzusage zahlt nicht | Monate ohne Miete, Verfahrenskosten | [[Q-immocation-Blog-Mietnomade]] |
| Kostenträger-Klumpen | mehrere Einheiten mit demselben Amt | Ausfall trifft mehrere Einheiten | [[Fallstudie-Dominik-Neunkirchen]] |
| Gewerbe-Leerstand | gemischtes Objekt | fehlende Miete | Dominik |
| Alte Ölheizung / Regulatorik | Heizungsereignis, neue Pflicht | Investition, CO₂-Kosten | [[Regulatorisches-Bestandsrisiko]] |
| Spekulationsfrist übersehen | Verkauf < 10 Jahre im Privatvermögen | Steuer auf Gewinn | [[Spekulationsfrist]] |
| 15-%-Grenze überschritten | große Sanierung in 3 Jahren | Kosten nicht sofort abziehbar | [[Anschaffungsnahe-Herstellungskosten-15-Prozent]] |
| Steuerkonstrukt vor Cashflow | GmbH für ein schwaches Objekt | Strukturkosten ohne Nutzen | [[Q-immocation-Podcast-586-Steuer-Guide]] |
| GmbH = keine Haftung (Irrtum) | Bank verlangt Privatbürgschaft | Privatvermögen haftet | [[Vermoegensverwaltende-GmbH]] |
| Neubau als Nicht-Profi | Selbstbau-Projekt | Baukosten > Mietertrag | [[Neubaurendite]] |
| Ziel unklar formuliert | Vermögensziel ohne Definition | falscher Erfolg (DM statt EUR) | Daniel |
| Prognose-Gläubigkeit | Kauf wegen Marktgerücht | Fehlentscheidung | [[Prognosen-kritisch-lesen]] |

### 4.6 Schwierigkeitsgrade, Marktphasen, Zinsumfeld

**Marktphasen mit Vault-Belegen**

| Phase | Zins (Vault) | Bank | Markt | Quelle |
|---|---|---|---|---|
| Hochzins 1990er | „weit über 8 %“ | – | – | [[Zins]] |
| Krise 2008/2009 | 4,5 % (2009) | unklar | viele Angebote, wenig Nachfrage | [[Antizyklischer-Kauf]] |
| 2013–2018 | 4 % gefordert / 3 % (2013), 2,5 % (2018) | verhandelbar | – | [[Fallstudie-Sebastian-Hildesheim]] |
| Niedrigzins 2019–2021 | ≈ 1,5 % | 25 % Abschlag, 8 % Stress, 80 % Beleihungswert, 100 % KP-Finanzierung verbreitet | steigende Werte bis 2021 | [[Kalkulatorischer-Stresszins]], [[Beleihungsgrenze]] |
| Schock 2020 (Ereignis) | – | – | Mietmoratorium 04–06/2020 (historisch) | [[Corona-Mietmoratorium]] |
| 2026 | eff. 3,9–4,5 % (10 J.); EZB-Einlagenzins 2,50 % ab 16.09.2026 | 60–80 % Mietanrechnung, 5–6 % Stress, Beleihungswert ~10 % unter Verkehrswert, „behäbiger“ | Preise verhandelbar; GModG seit 29.07.2026 | [[Zins]], [[Haushaltsrechnung]], [[Q-immocation-Webinar-Marktupdate-2026]] |

**Warum der Zins die Schwierigkeit bestimmt [R]** – Bruttomietrendite, ab der ein Objekt im ersten
Jahr selbst abzahlend ist (Darlehen = Kaufpreis, Nebenkosten aus EK, Kostenquote = nicht
umlagefähige Kosten + Rücklagen in % der Kaltmiete, ohne Steuer):

```text
Break-even-Bruttorendite = (Zins + Tilgung) / (1 − Kostenquote)
```

| Zins | Tilgung 1 %, Kosten 25 % | Tilgung 2 %, Kosten 25 % | Tilgung 2 %, Kosten 33 % | Tilgung 3 %, Kosten 33 % |
|---|---|---|---|---|
| 1,5 % | 3,3 % | 4,7 % | 5,2 % | 6,7 % |
| 2,0 % | 4,0 % | 5,3 % | **6,0 %** | 7,5 % |
| 2,5 % | 4,7 % | 6,0 % | 6,7 % | 8,2 % |
| 3,0 % | 5,3 % | 6,7 % | 7,5 % | 9,0 % |
| 4,0 % | 6,7 % | 8,0 % | **9,0 %** | 10,5 % |
| 4,5 % | 7,3 % | 8,7 % | 9,7 % | 11,2 % |

Die Kostenquote von ≈ 33 % ist zweifach im Vault gestützt (Modell 2.000/6.000 EUR; Tiefenrecherche-
Beispiel ≈ 31 % [R]); 25 % ist [A]. Die fett markierten Zellen zeigen: Die 6-%-Faustregel entspricht
2 % + 2 %; bei 4 % + 2 % werden ≈ 9 % nötig. (Dass immocation die Schwellen angepasst hat, ist im
Vault nicht belegt – Backlog-Punkt „Renditeschwellen nach der Zinswende“.)

**Schwierigkeitsgrade [A]**

| Stufe | Marktphase | Bankparameter | Ereignisdichte |
|---|---|---|---|
| Leicht (Tutorial) | Niedrigzins (1,5–2,5 %) | 2021-Werte, 100 % KP-Finanzierung möglich | gering |
| Mittel | 3 % (2013-artig) | Verhandlungsspielraum | normal |
| Schwer | 2026 (≈ 4 %), Preise verhandelbar | 2026-Werte, Nebenkosten aus EK | normal + Regulierung |
| Experte | Zinsschock / Krise (Wechsel 1,5 % → 4 % während des Spiels; Preisrückgang) | strenger | hoch (Mietausfall, Sonderumlagen, Anschlussrisiko) |

---

## 5. Kalibrierungs-Ziele (Testfälle)

Toleranzen sind [A]. „Deterministisch“ heißt: Der Rechenkern muss das Ergebnis mit identischen
Eingaben exakt treffen.

### 5.1 Deterministische Rechentests

| ID | Testfall | Erwartung | Herleitung |
|---|---|---|---|
| T1 | Bierdeckel-Voreinstellung: 120.000 EUR, 500 EUR/Monat, 50 m² | 5,0 %; 2.400 EUR/m²; 10 EUR/m² Miete; Faktor 20 | [[Q-immocation-Tool-Bierdeckelrechnung]] |
| T2 | Dominik-Absage: 130.000 EUR, 350 EUR/Monat | 3,2 %; Faktor 31; bei jedem Zins ≥ 1,5 % und Kosten ≥ 20 % **nicht** selbst abzahlend | [[Fallstudie-Dominik-Neunkirchen]] + Tabelle 4.6 [R] |
| T3 | Modell: 100.000 EUR, 6.000 EUR Miete/Jahr, Kosten 2.000, 2 % Zins, 2 % Tilgung, 100 % finanziert | CF Jahr 1 = 0; Laufzeit ≈ 35 J.; Restschuld nach 10 J. ≈ 78.100 EUR; danach 4.000 EUR/Jahr (nominal) | [[Passives-Einkommen]], [R] |
| T4 | Rate 100.000 EUR: 2 % + 2 % vs. 4 % + 2 % | 333,34 vs. 500,00 EUR/Monat; Laufzeit ≈ 35 vs. ≈ 28 J. | [[Q-immocation-Blog-Optimale-Tilgung]], [[Annuitaet]] |
| T5 | Restschuld 192.000 EUR, 3,9 % Zins, 2,0 % Tilgung, jährliche Zahlung | ≈ 146.110 EUR nach 10 J.; +1 Prozentpunkt Zins ≈ +1.461 EUR im 1. Folgejahr | [[Recherche-Backlog]] (Nachrechnung) |
| T6 | Tiefenrecherche-Beispiel 2026: KP 250.000, GrESt 13.750, Erwerbskosten 6.250, Sanierung 20.000, Reserve 10.000; Darlehen 220.000 (4 % + 2 %), Miete 1.200 EUR/Monat, 5 % Ausfall, 1.800 laufende Kosten, 2.000 Instandhaltung | operativer CF 9.880 EUR/Jahr; Kapitaldienst 13.200; **CF n. Fin. −3.320 EUR/Jahr**; Bruttorendite 5,76 % | [[Cashflow]] (hypothetisch) |
| T7 | Kaufnebenkosten Bremen: KP 200.000, 5,5 % GrESt, 2 % Notar/Grundbuch, 90 % Beleihung, 5.000 Renovierung, 10.000 Puffer | Nebenkosten 15.000; EK-Bedarf 50.000 EUR | [[Prozess-Haushaltsplan-und-Vermoegensaufstellung]] |
| T8 | Hebel: 100.000 EUR Objekt, 10.000 EUR EK, Wertänderung ±1 % | ±1.000 EUR = ±10 % auf das EK | [[Hebeleffekt]] |
| T9 | Bank-Mindestrendite, wenn die Miete allein den Stress tragen muss | 2021: 8 % / 0,75 ≈ 10,7 %; 2026: 5–6 % / 0,6–0,8 = 6,25–10,0 % | [[Kalkulatorischer-Stresszins]] [R] |
| T10 | Steuerstufe Modell: Miete 6.000, tats. Kosten 1.500, Zins 2.000, Tilgung 2.000, AfA 2.000, Grenzsteuersatz 42 % | CF vor St. 500; steuerl. Ergebnis 500; Steuer 210; CF n. St. 290 | [[Cashflow-vor-und-nach-Steuern]] |

### 5.2 Reproduktion der Fallstudien (Toleranzband)

| ID | Profil / Strategie / Zeitraum | Die Simulation sollte ungefähr … | Herleitung, Qualität |
|---|---|---|---|
| K1 | P1 Gründer: 58.000 EUR, 100 % finanziert, 2,5 % + 3,5 %, Miete 400 EUR, Jahr 1 | CF n. Fin. ≈ +40 EUR/Monat (±30), wenn laufende Kosten ≈ 70 EUR/Monat (≈ 17,5 % der Miete) angesetzt werden | Kapitaldienst 290 EUR/Monat [R]; voll belegt |
| K2 | P1 nach 10 Jahren, Wert konstant, Miete konstant | Restschuld ≈ 35.300 EUR; getilgt ≈ 22.700 EUR; Entschuldung nach ≈ 22 J. (Quelle sagt 27 – Abweichung im Spiel dokumentieren) | [R]; Laufzeitkonflikt im [[Recherche-Backlog]] |
| K3 | P1 nach Entschuldung | ≈ 300 EUR/Monat operativer CF (nominal) – impliziert Kosten ≈ 100 EUR/Monat, also höher als in K1 | Quelle; innere Unschärfe |
| K4 | P5 Objekt 2: 92.000 EUR, 4,7 % (≈ 360 EUR/Monat [R]), 3 % Zins, 100 % finanziert, Tilgung 1–2 % | CF n. Fin. leicht negativ, Band −100 bis 0 EUR/Monat (Quelle: −30 bis −40) | [R]; Tilgung und Kosten [A] |
| K5 | P5 Objekt 2 nach 5 Jahren: Anschluss 2,5 %, Miete auf 5,1 % (≈ 391 EUR [R]) | CF verbessert sich um ≈ +50 bis +70 EUR/Monat und wird leicht positiv (Quelle: +10) | Zinsersparnis ≈ 36 + Miete +31 EUR [R] |
| K6 | P5 Objekt 1: 63.000 EUR + 15.000 Sanierung, 8 % auf den KP (≈ 420 EUR [R]) | Die Simulation muss **8 % Rendite mit leicht negativem CF** zulassen (z. B. Sanierung mitfinanziert, hohe Tilgung oder hohe Kosten) | Ursache im Vault ungeklärt |
| K7 | P2 Adele: 7-WE-MFH, 428 m², 7 % brutto, Niedrigzins (1,5 % + 2 % Tilgung [A]), 100 % finanziert [A], Kosten 20–30 % [A] | 1.200 EUR/Monat CF vor Steuern erreichbar bei einem Kaufpreis von ≈ 0,69–1,03 Mio. EUR (≈ 1.600–2.400 EUR/m²); ≈ 171 EUR je WE | Rückrechnung `KP = 14.400 / (0,07 × (1 − c) − 0,035)` [R], Kaufpreis nicht belegt |
| K8 | P3 Dominik-MFH: 3 WE à 480 EUR [A für die 3. WE], 8 % brutto (KP ≈ 216.000 [R]), Gewerbe leer, Zins + Tilgung 3,5–4 %, Kosten 20–25 % | CF ≈ 360–520 EUR/Monat – die 1.000 EUR laut Titel sind **nicht** reproduzierbar. **Nicht als Kalibrierungsziel verwenden**; stattdessen prüfen, dass Gewerbe-Leerstand sichtbar wirkt | [R]; Titel-Angabe, Stufe unklar |
| K9 | P4 Jochen: 35.000 EUR je Einheit, 180–250 → 400 EUR möbliert | Bruttorendite 6,2–8,6 % → ≥ 13,7 %; Neuvermietung nur bei Mieterwechsel | [R]; belegt |
| K10 | P4 Jochen „davon leben in 3 J.“ | Bei 2,5 % + 2 % [A], 100 % finanziert [A], Kosten 25 % [A]: CF ≈ 30 EUR (Bestandsmiete) bzw. ≈ 170 EUR (möbliert) je Einheit und Monat → für 2.000 EUR/Monat [A] ≈ 12 möblierte Einheiten, vor Möblierungs- und Leerstandskosten | Illustration; Einheitenzahl fehlt im Vault |
| K11 | P6 Einsteiger 2026 kauft zu 5–6 % brutto bei ≈ 4 % + 2 % | CF n. Fin. negativ in der Größenordnung von T6 (−3.000 EUR/Jahr bei 250.000 EUR); selbst abzahlend erst ab ≈ 8–9 % brutto | T6, Tabelle 4.6 [R] |
| K12 | Bank 2021 vs. 2026, gleiches Objekt und Einkommen | 2026 kleinerer finanzierbarer Betrag; Nebenkosten müssen aus EK kommen | [[Haushaltsrechnung]] |

### 5.3 System- und Verhaltenstests

| ID | Test | Erwartetes Verhalten |
|---|---|---|
| S1 | Spieler kauft fortlaufend ETW mit 100 % KP-Finanzierung | Einkommensbasierter Kreditrahmen wird erreicht; weitere Finanzierung nur über Portfoliobetrachtung (Beleihung < 80 % durch Tilgung/Wertzuwachs) – Schwelle ist Designparameter, nicht aus Fallstudien |
| S2 | Wertverfall nach Kauf mit hoher Beleihung | Beleihung steigt ohne neue Schulden; Bonitätsvorteil kehrt sich um |
| S3 | MFH vs. drei ETW an drei Standorten, Standortschock | MFH-Portfolio verliert stärker (Klumpen) |
| S4 | Zinsbindungsende in einer Hochzinsphase | Rate steigt; niedrigere Restschuld (höhere Tilgung) dämpft den Anstieg |
| S5 | Kauf über Marktwert | schlechtere Konditionen und höherer EK-Anteil |
| S6 | Möblierte Einheiten | höhere Miete, häufigere Wechsel, Leerstandsmonate, Möblierungskosten |
| S7 | Krise | mehr Angebote, Preisnachlass verhandelbar, Bank strenger; Spieler ohne Puffer kann nicht zugreifen |
| S8 | Mieterwechsel-Ereignisse | Neuvermietung zur Sollmiete möglich (im Rahmen der Mietrechtsregeln anderer Recherchen) |
| S9 | Tempo-Plausibilität | Normaler Privathaushalt erreicht ohne Netzwerk/Profi-Status nicht das Tempo von Sebastian N. (≈ 3,6 Objekte/Jahr); Jochen-Tempo (Bestand zum Leben in 3 J.) nur mit Hochrendite-Kleineinheiten und hohem Zeiteinsatz |
| S10 | Survivorship-Gegentest | Mit realistischen Ereignissen muss ein Teil der Spieldurchläufe mit Zuzahlungen, Notverkäufen oder Stillstand enden – sonst ist das Spiel zu optimistisch kalibriert |

### 5.4 Nicht als Kalibrierungsziel geeignet

- Dominiks 1.000 EUR (Stufe unklar, rechnerisch nicht plausibel).
- Daniels „Millionär“ (Vermögensbegriff, Bewertung, Zusammensetzung unbekannt).
- Sebastian N.s 40 Mio. EUR Umsatz (Umsatz ≠ Gewinn, Unternehmens-EK).
- „400+ Immobilien“ der Gründer (Startjahr, Finanzierung, Zusammensetzung unbekannt).
- Titel „36 Wohneinheiten in einem Jahr“ (Hildesheim; im Text nicht belegt).

---

## 6. Lerninhalte – 22 Kernlektionen

1. **Erst rechnen, dann anrufen.** Die Bierdeckelrechnung (Jahreskaltmiete / Kaufpreis) sortiert in
   Sekunden aus; sie ersetzt aber keine Vollkalkulation. – [[Bierdeckelrechnung]]
2. **Zweimal Bierdeckel.** Nach dem Erstgespräch mit erzielbarer Miete und Renovierungskosten neu
   rechnen – Exposé-Mieten können geschönt oder zu niedrig sein. – [[Prozess-Objektpruefung|Leitfaden-Objektpruefung]]
3. **Brutto ist nicht netto.** Die Nettomietrendite berücksichtigt Kaufnebenkosten und nicht
   umlagefähige Kosten; viele Angaben sagen nicht, welche gemeint ist. – [[Nettomietrendite]]
4. **Cashflow in drei Stufen.** Operativ, nach Finanzierung, nach Steuern; Rücklagen separat ausweisen,
   Monat und Jahr nie mischen. – [[Cashflow]]
5. **Tilgung ist Vermögensaufbau, kostet aber Liquidität.** Sie mindert den Cashflow, nicht das
   steuerliche Ergebnis; die AfA umgekehrt. – [[Cashflow-vor-und-nach-Steuern]]
6. **Selbst abzahlend heißt: Miete ≥ Bankrate + Kosten + Rücklagen** – und muss auch nach der
   Zinsbindung noch gelten. – [[Selbst-abzahlende-Immobilie]]
7. **Faustregeln hängen am Zins.** 5–6 % Bruttorendite passten zu 2 % Zins; bei ≈ 4 % braucht dieselbe
   Logik deutlich mehr. – [[Bruttomietrendite]], [[Zins]]
8. **Ein negativer Cashflow ist kein Tabu, aber eine Zuzahlung.** Sie muss dauerhaft tragbar sein und
   schmälert den Spielraum bei der Bank. – [[Negativer-Cashflow]]
9. **Eine Absage ist eine Entscheidung.** 3 % Rendite für eine Wohnung mit persönlichem Bezug
   abzulehnen, war Dominiks erster richtiger Schritt. – [[Fallstudie-Dominik-Neunkirchen]]
10. **Kaufnebenkosten kommen aus dem Eigenkapital.** Auch eine Vollfinanzierung des Kaufpreises
    braucht Geld für Grunderwerbsteuer, Notar, Grundbuch und Makler. – [[Kaufnebenkosten]]
11. **Kein Kauf ohne Puffer.** 10.000–20.000 EUR Liquidität sind die praktische Grenze des Hebels. –
    [[Liquiditaetspuffer]]
12. **Der Hebel wirkt in beide Richtungen.** Er steigert die EK-Rendite nur, solange die Objektrendite
    über den Kreditkosten liegt. – [[Hebeleffekt]]
13. **Die Bank rechnet vorsichtiger als du.** Mietabschlag, Stresszins und Beleihungswert bestimmen,
    was finanzierbar ist; Parameter ändern sich mit der Zinsphase. – [[Haushaltsrechnung]]
14. **Wachstum braucht Bonität.** Ist der Kreditrahmen ausgeschöpft, zählt der Bestand – niedrige
    Beleihung durch Tilgung macht weitere Käufe möglich. – [[Portfoliobetrachtung-der-Bank]]
15. **Tilgungshöhe ist ein Zielkonflikt.** Hohe Tilgung senkt das Anschlussrisiko, niedrige lässt
    Liquidität für Rücklagen und Wachstum. – [[Tilgung]], [[Anschlussfinanzierung]]
16. **Ohne Wertsteigerung rechnen.** Wertzuwachs ist ein Bonus, kein Kaufgrund. –
    [[Investition-ohne-Wertsteigerung]]
17. **Ein MFH streut kein Standortrisiko.** Echte Streuung entsteht über mehrere Standorte; zuerst
    vergleichen, dann fokussieren. – [[Risikostreuung-ueber-Standorte]]
18. **Lohnenswert und zukunftssicher.** Ein günstiger Preis ohne Nachfrage führt zu Leerstand;
    entscheidend ist das Verhältnis von Kaufpreis und Miete. – [[Lohnenswerter-Standort]]
19. **Auch „komplett saniert“ heißt nicht kostenfrei.** Sonderumlagen am Gemeinschaftseigentum und
    Übersanierung kosten Geld. – [[Sonderumlage]], [[Uebersanierung]]
20. **Bauträgerpreise drücken den Cashflow über Jahre.** EUR/m² mit Bestandswohnungen am Ort
    vergleichen. – [[Bautraegeraufschlag]]
21. **Regulierung ist ein Kostenrisiko.** Heizung, Solarpflicht und CO₂-Kosten gehören in die
    Objektprüfung, auch wenn klassische Kalkulationen sie nicht enthalten. – [[Regulatorisches-Bestandsrisiko]]
22. **Struktur kommt nach dem Cashflow.** Eine vvGmbH lohnt sich erst ab Portfoliogröße und
    Cashflow-Stärke; die Privatbürgschaft bleibt oft. – [[Vermoegensverwaltende-GmbH]]

---

## 7. Lücken

**Fallstudien**
- Nur [[Fallstudie-Marco-und-Stefan]] ist vollständig durchrechenbar; bei allen anderen fehlen Kaufpreis,
  Miete oder Finanzierung. Alter, Einkommen und Eigenkapital der Personen fehlen fast überall →
  Startprofile beruhen auf Annahmen.
- Keine Fallstudie aus 2022–2026 (Zinswende); keine gescheiterten Verläufe.
- Inkonsistente Gültigkeitskennzeichnung: Quellennotizen `historisch`, Fallstudiennotizen
  `aktuell`/`unbekannt`; `unbekannt` steht nicht im Vokabular der [[Vault-Regeln]]
  (`aktuell | pruefen | historisch`).
- Ungeklärt: Dominiks 1.000 EUR, Hildesheim (8 % bei negativem Cashflow), Laufzeit der Gründer
  (27 vs. ≈ 22 J.), Identität der beiden „Daniel“.

**Bank und Wachstum**
- Keine belegten Schwellen, ab wann die Bank bremst (Einheiten, Volumen, Verschuldungsquote); Spanne
  des Kreditrahmens im Quelltext abgeschnitten; Kriterien der Portfoliobetrachtung fehlen.
- Bezugsgröße der 80-%-Beleihung (Beleihungswert oder Marktwert) offen.
- Ob 100-%-Finanzierungen und Mitfinanzierung der Nebenkosten 2026 noch vergeben werden: offen.
- **Eigenkapital-Recycling (Nachbeleihung, Cash-out)** im Vault nicht beschrieben.

**Methodik und Tools**
- Renditeschwellen nach der Zinswende (Anbieter-Update fehlt); tragbare Zuzahlungsgrenze;
  Inhalt der „Bierdeckel-Bewertung“; Voreinstellungen des Kalkulationstools; Logik des
  Passives-Einkommen-Rechners und der „Bierdeckel-Rente“; „Bewirtschaftungskosteneffekt“ (#654);
  Schritte 5–6 der Kalkulation und 3–4 der Finanzierung nur unvollständig.
- Rücklagensätze uneinheitlich (3 % vs. 33 %); keine Position für regulatorische Investitionen.

**Strategiepfade**
- Aufteilung: Kosten, Dauer, Gewinn, Mieterschutzrecht fehlen.
- Mikro/möbliert: Kaufpreise, Mieten, Auslastung, Möblierungskosten, Mietrecht fehlen.
- Neubau: Baukosten und Mieten nur Stand 2018; Sonder-AfA offen.
- GmbH: Entscheidungsregel privat vs. GmbH, Strukturkosten, Portfolioschwelle fehlen.
- Antizyklik: nur eine Anekdote; keine Daten zur Finanzierbarkeit in Krisen.
- Wertentwicklung: keine Preisindizes oder realisierten Wertsteigerungen in diesem Teil des Vaults
  (für Marktpfade andere Recherchen heranziehen).

**Vorschläge für den [[Recherche-Backlog]]** (nur Vorschlag, nicht eingetragen)
- Kreditrahmen- und Portfolioschwellen 2026 bei mehreren Banken/Vermittlern erheben.
- Nachbeleihung / Eigenkapitalfreisetzung als eigene Fachnotiz.
- Fallstudien 2023–2026 mit vollständigen Zahlen (Kaufpreis, Miete, Finanzierung, CF-Stufe).
- Renditeschwellen der Anbieter nach 2022.
- Wirtschaftlichkeit möblierter Kleinwohnungen inkl. Mietrecht.
