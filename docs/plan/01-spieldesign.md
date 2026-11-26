# 01 – Spieldesign

**Stand:** 26.11.2026 · Grundlagen: `../research/21-web-gamedesign-ux.md` (Teil B), `../research/14-ic-fallstudien-strategie-immocation.md`
(Strategien, Progression, Fallen, Schwierigkeit), `../research/01-audit-prototyp.md` (§7 Ideen, die bleiben).

Kennzeichnung: **[V]** = im Vault belegt · **[R]** = aus Vault-Zahlen abgeleitet · **[A]** = Design-Annahme (Spielbalance, im Spiel als Vereinfachung erkennbar).

---

## 1. Spielfantasie und Zielgruppe

**Fantasie:** „Ich baue mir neben dem Job Schritt für Schritt ein Immobilienvermögen auf – und lerne dabei, wie Banken,
Finanzamt, Mieter, WEG und Markt wirklich ticken.“

**Primäre Persona – du selbst:** lernt Immobilieninvestment ernsthaft, will realistisch üben, bevor echtes Geld fließt,
und später Strategien (ETW → MFH → Struktur) ausprobieren. Bevorzugt Desktop/Tablet zum Analysieren, Handy für kurze Runden.

**Sekundäre Personas:** Einsteiger aus der immocation-Community (Begriffe bekannt, Praxis fehlt); Fortgeschrittene,
die Skalierung, Anschlussfinanzierung oder GmbH-Strukturen durchspielen wollen.

**Nicht-Ziel:** Kein „Tycoon“ mit Fantasiezahlen, kein Echtzeit-Klickspiel, keine Anlageberatung.

---

## 2. Kernschleifen

```
MIKRO (jeder Monat, 1–3 Minuten)
  Posteingang sichten → Entscheidungen mit Folgenvorschau → [Weiter] → Monatsbericht → neue Ereignisse

MESO (pro Deal, Wochen bis Monate Spielzeit)
  Suchauftrag/Markt → Exposé → Schnellkalkulation (Bierdeckel) → Besichtigung → Unterlagen anfordern
  → Detailprüfung → Vollkalkulation (inkl. Steuer) → Finanzierungsanfrage → Gebot/Verhandlung
  → Reservierung → Notar → Kaufpreisfälligkeit → Nutzen-Lasten-Wechsel → Bewirtschaften
  → Kauf-Review nach 12 Monaten („erwartet vs. tatsächlich“)

MAKRO (pro Jahr / Strategie)
  Jahresabschluss (Nebenkostenabrechnungen, WEG-Abrechnung, Steuer) → Jahresbericht + Debrief
  → Ziele prüfen → Strategie: kaufen, halten, modernisieren, refinanzieren, verkaufen → nächstes Jahr
```

**Lernschleife quer dazu:** Erwartung notieren → entscheiden → Ergebnis (oft verzögert) → Rückmeldung → Reflexion.

**Gestaltungshebel, die die Schleifen lehrreich machen**
- **Information kostet** Zeit oder Geld (Teilungserklärung, Protokolle, Rücklagenstand, Energieausweis, Gutachten).
  Was man nicht prüft, bleibt verdeckt – und kann später als Ereignis auftauchen (Aufdeckungsmatrix, `02-simulationsmodell.md`).
- **Akteure mit Interessen** (Makler will verkaufen, Bankberater will Produkte verkaufen, Verkäufer schönt das Exposé).
  Der **Mentor** steht außerhalb der Spielwelt und ist neutral.
- **Zufall als sichtbares Risiko:** Schäden, Leerstand, Zinsänderungen haben Wahrscheinlichkeiten, die vor der
  Entscheidung sichtbar sind. Rückschläge sollen sich als nachvollziehbare Folge anfühlen, nicht als Willkür.

---

## 3. Zeitmodell

- **Rundenbasiert, Monat als Takt.** Mieten, Raten, Hausgeld und Vorauszahlungen sind monatlich.
- **Zeitleiste mit „Weiter“:** *1 Monat* · *bis zum nächsten Ereignis* (Stopp-Regeln) · *bis Datum/Quartal/Jahresende*.
  Optional **Auto-Weiter** mit Pause-Taste.
- **Stopp-Regeln** (voreingestellt, einzeln abschaltbar): Entscheidung mit Frist · neues Angebot passt zu Suchauftrag ·
  Liquidität unter Reserve-Schwelle · Zinsbindungsende in 12/6/3 Monaten · Mieterhöhung rechtlich möglich ·
  Ende Spekulationsfrist · Jahresabschluss · Ereignis mit hoher Auswirkung.
- **Prozesse dauern realistisch** (Finanzierungszusage, Notartermin, Grundbuch, Räumungsklage) und erscheinen als
  Fortschritts-Tracker. Gebotsrunden laufen als Dialog, nicht in Echtzeit.
- **Entwürfe bis zum Monatswechsel:** Innerhalb eines Monats sind Entscheidungen *vorgemerkt* und rückgängig machbar.
  Mit „Weiter“ werden sie wirksam (Lernmodus: Checkpoints vor großen Entscheidungen).
- **Zeitachse „Demnächst“** zeigt bekannte künftige Zahlungen und Fristen (Steuererstattung, NK-Abrechnung, Zinsbindungsende).

---

## 4. Spielmodi

| Modus | Zweck | Start | Besonderheiten |
|---|---|---|---|
| **Lernpfad** | geführtes Lernen | je Kapitel fest | 1–2 Lernziele, Musterlösungen, schrittweise sichtbare Systeme, Debrief |
| **Freies Spiel** | eigenes Training | **Nov. 2026**, echte Startwerte, Zukunft simuliert (Seed) | Startprofil wählbar oder **eigene echte Zahlen**, Region frei, alle Systeme |
| **Historische Szenarien** | Realismus erleben | echtes Startdatum | echte Zins-, Preis- und Mietzeitreihen; Ergebnis mit „Was hätten Profis getan?“ |
| **Challenges** | kurze, gezielte Übung (10–30 Min.) | fester Seed | klare Aufgabe, Vergleich mit Musterlösung, optional „Ironman“ (ein Spielstand) |

### 4.1 Lernpfad (Vorschlag, je Kapitel 20–60 Minuten)

| # | Kapitel | Lernziele | Neu sichtbare Systeme | Phase |
|---|---|---|---|---|
| K1 | **Bankfähig werden** | Haushaltsplan, Vermögensaufstellung, Kreditrahmen verstehen | Haushalt, Bank (Vorprüfung) | P6 (Vorstufe in P3) |
| K2 | **Die erste Wohnung** (= Onboarding) | Bierdeckel → Prüfung → Kalkulation → Kauf; Kaufnebenkosten | Markt, Exposé, Kalkulator, Kaufprozess | **P3** |
| K3 | **Vermieten** | Mieterauswahl, Mietvertrag, Kaution, Mietpreisbremse | Vermietung | P3/P4 |
| K4 | **Das erste Jahr** | Hausgeld, NK-Abrechnung, Anlage V, Steuer-Erstattung | Betriebskosten, WEG, Steuer | P4 |
| K5 | **Mieterhöhung rechtssicher** | § 558, Kappungsgrenze, Fristen, Begründungsmittel | Mieterhöhungs-Assistent | P4 |
| K6 | **Sanierungsstau im MFH** | Bauteile, 15-%-Grenze, Modernisierungsumlage, Übersanierung | Gebäude, Modernisierung | P5/P7 |
| K7 | **Anschlussfinanzierung nach Zinsanstieg** (historisch 2022) | Zinsbindung, Forward, Rate +50 % | Kredite, Anschluss | P5 |
| K8 | **Skalieren** | Portfoliobetrachtung, Beleihungsreserven, Puffer | Portfolio-Bank, Stresstest | P5 |
| K9 | **Krise** | Mietausfall + Großschaden überstehen | Krisen-Flow | P5/P6 |
| K10 | **Struktur: vvGmbH ja oder nein?** | Steuersatzgefälle, Strukturkosten, Bürgschaft | Rechtsformen | P7 |

### 4.2 Historische Szenarien

| # | Szenario | Zeitraum | Lernkern | Datenbedarf |
|---|---|---|---|---|
| H1 | **Finanzkrise und Erholung** | 2008–2012 | antizyklisch kaufen, Bankstrenge | Bundesbank-Zinsreihen, GREIX/Destatis HPI |
| H2 | **Niedrigzinsjahrzehnt** | 2012–2021 | Hebel, Wertsteigerung als Zusatz, Zinsbindung wählen | dto. + Mietindizes |
| H3 | **Corona-Schock** | 2020–2021 | Mietmoratorium, Liquidität | Vault `Corona-Mietmoratorium` (historisch) |
| H4 | **Zinswende** | 2021–2025 | Anschlussrisiko, Preisrückgang, GEG/GModG | Zinsreihen, GREIX, Regeländerungen |

Historische Szenarien laufen mit dem **damals geltenden Regelstand** (`rulesVersion` je Jahr) und den damaligen
Bankprofilen (Profil A „Niedrigzins 2021“ vs. Profil B „Markt 2026“, `../research/10-…` §0.3).

---

## 5. Spielstart

### 5.1 Startassistent (max. 3 Schritte)
1. **Modus** (Lernpfad / Freies Spiel / Szenario / Challenge)
2. **Startprofil** – Vorlage *oder* „Mein echtes Profil“ (eigene Zahlen, bleiben lokal auf dem Gerät)
3. **Ziel und Hilfestufe** (Lernmodus / Standard / Profi) + Marktschwierigkeit (getrennt einstellbar)

### 5.2 Startprofile für das freie Spiel 2026 [A, Werte mit Recherche abzugleichen]

| # | Profil | Haushalt | Netto/Monat | Eigenkapital | Besonderheit | Lernbogen |
|---|---|---|---|---|---|---|
| S1 | **Einsteiger 2026** (Standard) | Single, angestellt, unbefristet | 3.100 € | 45.000 € | Wohnort wählbar | erste ETW, Puffer, Bank 2026 |
| S2 | **Paar mit zwei Einkommen** | 2 Erwachsene | 5.600 € | 80.000 € | Splitting | schneller zum MFH |
| S3 | **Wenig EK, gutes Einkommen** | Single | 4.500 € | 20.000 € | EK reicht kaum für Nebenkosten | Kreditrahmen, Sparen, Hebel-Risiko |
| S4 | **Selbständig** | Single | schwankend (Ø 4.000 €) | 120.000 € | Bank verlangt 2–3 Jahre Historie [V] | strengere Bank, Puffer |
| S5 | **Mit Bestand** | Paar | 4.800 € | 30.000 € + geerbte ETW (schuldenfrei) | Beleihung des Bestands | Portfolio-Denken |
| S6 | **Mein echtes Profil** | eigene Angaben | eigene | eigene | Region = echter Wohnort | persönliches Training |

Fallstudien-Vorbilder (P1–P6 aus `../research/14-…` §4.2) werden als **Szenarien** genutzt, nicht als freie Profile,
weil ihre Zahlen aus der Niedrigzinsphase stammen.

---

## 6. Ressourcen des Spielers

| Ressource | Bedeutung | Realismus-Anker |
|---|---|---|
| **Liquidität** | Konto + Tagesgeld; Reserve-Schwelle (Puffer) | Liquiditätspuffer 10–20 T€ als Empfehlung [V, immocation] |
| **Einkommen & Lebenshaltung** | Netto, Ausgaben, Sparrate; ändert sich über die Jahre | Haushaltsrechnung der Bank [V] |
| **Kreditrahmen** | einkommensbasiert, später Portfoliobetrachtung (Beleihung < 80 %) | [V] `Kreditrahmen`, `Portfoliobetrachtung-der-Bank` |
| **Zeit** | Stunden pro Monat für Investments (Besichtigung, Mietersuche, Eigenverwaltung) | **DESIGN** – macht Delegation (Hausverwaltung) zur echten Abwägung „Zeit gegen Geld“ |
| **Wissen** | Lernpfad-Fortschritt; schaltet *Darstellungen* frei, nicht Regeln | DESIGN |
| **Netzwerk** | Kontakte zu Maklern, Banken, Handwerkern, Steuerberater → Off-Market-Chancen, bessere Angebote | Fallstudien Dominik, Sebastian N. [V] |

**Zeitbudget [A]:** z. B. 20 h/Monat neben dem Job. Besichtigung 2–4 h (+ Anfahrt nach Entfernung), Unterlagenprüfung
1–3 h, Mietersuche 4–8 h, Eigenverwaltung 1–2 h je Einheit und Monat. Hausverwaltung/SEV kostet Geld und spart Zeit.
Alle Werte DESIGN, bis Belege vorliegen.

---

## 7. Akteure (NPCs)

| Akteur | Interesse | Spielfunktion |
|---|---|---|
| **Makler** | Abschluss, Provision | Exposés (teils geschönt), Besichtigungstermine, Off-Market bei Beziehung |
| **Verkäufer** | hoher Preis, schneller Verkauf | Verhandlung, Fristen, Gegenangebote |
| **Banken** (mehrere Profile: Sparkasse/Volksbank regional, Direkt-/Hypothekenbank) | gute Kunden, Sicherheit | Kreditentscheidung mit Begründung, Konditionen, Portfoliobetrachtung |
| **Finanzierungsvermittler** | Provision | vergleicht Banken, schnellere Angebote |
| **Hausverwaltung / WEG-Verwalter / SEV** | Honorar | Hausgeld, Abrechnungen, Versammlungen, übernimmt Zeitaufwand |
| **Mieter** | Wohnen, faire Miete | Bewerbung, Zahlungsverhalten, Kündigung, Mängel, Minderung |
| **Handwerker** | Aufträge | Angebote, Termine, Qualität, Verzug |
| **Gutachter, Notar, Steuerberater, Anwalt** | Honorar | Prüfungen, Beurkundung, Steuererklärung/Struktur, Mietprozesse |
| **Finanzamt, Behörden, Kommune** | Recht | Bescheide, Vorkaufsrecht, Milieuschutz, Pflichten |
| **Mentor** (außerhalb der Spielwelt) | dein Lernen | neutrale Hinweise, Fragen statt Lösungen, abschaltbar |

---

## 8. Strategien als Spielpfade

Strategien sind **keine Knöpfe**, sondern ergeben sich aus Handlungen (gute Idee aus dem Prototyp).

| Strategie | Voraussetzungen (real) | Haupt-Risiken | Phase |
|---|---|---|---|
| Buy & Hold ETW | Bankfähigkeit, EK für Nebenkosten | WEG-Abhängigkeit, Sonderumlage, Klumpen | P3 |
| Mehrfamilienhaus | mehr EK/Bonität, Verwaltungszeit | Klumpenrisiko Standort, Gebäudezustand | P5 |
| Value-Add / Renovierung | Handwerker, Liquidität, 15-%-Grenze kennen | Kostenüberschreitung, Leerstand während Bau | P4/P7 |
| Aufteilung in WEG | MFH, Abgeschlossenheit, kein Milieuschutz | Genehmigungen, Zeit, Steuer (gewerblicher Handel) | P7 |
| Neubau / Bauträger-ETW | EK, Profi-Status für Eigenbau | Bauträgeraufschlag, Baukosten | P7 |
| Mikroapartment / möbliert | Standort mit Nachfrage, Möblierungskapital | Fluktuation, Regulierung (Mietrecht II offen) | P7 |
| Antizyklisch kaufen | Puffer, Bonität in der Krise | Timing, Bank zurückhaltend | P5/P6 |
| Standortstreuung | Fernverwaltung, Netzwerk | Standort-Hopping ohne Marktkenntnis | P5 |
| vvGmbH / Holding | Steuerberater, Cashflow-starke Objekte | Strukturkosten, Privatbürgschaft | P7 |

Vollständige Pfade mit Kennzahlen: `../research/14-…` §2.

---

## 9. Ziele, Meilensteine, Bewertung

- **Ziele selbst wählen**, mit Vorlagen: „1.000 € Netto-Cashflow/Monat bis 2035“, „Nettovermögen 300.000 €“,
  „Davon leben“ (Portfolio-CF nach Steuern ≥ Lebenshaltung), plus **Lernziele** („3 vollständige Prüfungen“, „Stresstest bestanden“).
  Fortschritt mit Prognose-Bandbreite.
- **Meilensteine** (aus `../research/14-…` §4.3): Bankfähig · Erstes Objekt · Selbst abzahlend (inkl. Rücklagen) ·
  Erstes MFH · 1.000 € Portfolio-CF · 10 Einheiten · Portfoliobetrachtung erreicht · 1 Mio. € Bestand ·
  Positiver CF nach Steuern (Jahr) · Erstes entschuldetes Objekt · Off-Market-Deal · Krise überstanden ·
  Steuerstruktur · Nettovermögen 1 Mio. € · „Davon leben“.
- **Nettovermögen (verbindliche Definition):** Σ Marktwerte (Wertmodell aus `02-…` §2.16, mit Bandbreite)
  − Σ Restschulden − latente Verkaufskosten (optional anzeigen) + Liquidität. Immer in Euro des Spieljahres;
  real (inflationsbereinigt) als zweite Ansicht.
- **Bewertungsraster statt Highscore:** Liquiditätsvorsorge · Prüfungssorgfalt · Finanzierungsstruktur · Risikostreuung ·
  Ertrag – jeweils mit Begründung. Kein Urteil über die Person.
- **Auszeichnungen sparsam**, nur für Sorgfalt/Kompetenz (z. B. „5 Käufe mit bestandenem Zinsstresstest“).
  Keine Streaks, keine Login-Belohnungen, keine Vermögens-Ranglisten.

---

## 10. Freischaltungen – Prinzip „echte Voraussetzungen statt Level“

Im **freien Spiel** gibt es keine künstlichen Level-Sperren. Was gesperrt ist, ist es aus realen Gründen
(fehlendes EK, Bank sagt nein, Steuerberater-Kontakt fehlt, Gebäude nicht abgeschlossen). Die UI erklärt jede Sperre
mit dem realen Grund und dem Weg dorthin.

Im **Lernpfad** werden Systeme schrittweise *sichtbar* (Modell-Progression), nicht verboten.

Beispiele realer Voraussetzungen (aus `../research/14-…` §4.4): Off-Market über Bank → bestehende Bankbeziehung ·
Portfoliobetrachtung → Kreditrahmen ausgeschöpft **und** Bestand < 80 % beliehen · vvGmbH → Steuerberater + Gründungskosten
+ sinnvolles Portfolio · Aufteilung → Abgeschlossenheitsbescheinigung, kein Milieuschutz.

---

## 11. Lernsystem

| Element | Wann | Inhalt |
|---|---|---|
| **Erklär-Karte** | jederzeit, jede Zahl | Aussage → Rechenweg mit echten Werten → Quelle, Stand, Status (BELEGT/…/DESIGN) |
| **Folgenvorschau** | vor jeder relevanten Entscheidung | Vorher/Nachher der Kernkennzahlen, Kosten, Fristen, Risiken |
| **Musterlösung (worked example)** | Lernpfad, erste Male | Schritt für Schritt vorgerechnet, danach ausgeblendet |
| **Mentor** | situativ, abschaltbar | Fragen statt Antworten („Hast du die Rücklage der WEG geprüft?“) |
| **Entscheidungstagebuch** | bei wichtigen Entscheidungen | ein Satz Erwartung + automatisch gespeicherter Informationsstand |
| **Kauf-Review** | 12 Monate nach Kauf | erwartet vs. tatsächlich, Abweichungen erklärt |
| **Jahres-Debrief** (After Action Review) | Jahresabschluss | geplant → passiert → warum (Entscheidung vs. Glück/Pech) → Vorsatz |
| **Schattenrechnung** | ausgewählte Entscheidungen | „Was wäre gewesen, wenn …?“ – und ob es damals erkennbar besser war |
| **Fallen als Lernmomente** | im Spielverlauf | 23 typische Fallen (`../research/14-…` §4.5), z. B. Sonderumlage, Zinsbindungsende, 15-%-Grenze, Spekulationsfrist, Kauf über Marktwert, kein Puffer |

**22 Kernlektionen** (`../research/14-…` §6) bilden den Inhalt der Akademie; jede ist mit Vault-Notizen verknüpft.

---

## 12. Scheitern und Erholung

1. **Frühwarnung:** Liquiditätsprognose zeigt Lücke in X Monaten (Status „beobachten“ → „kritisch“).
2. **Handlungsoptionen mit Folgenvorschau:** Kosten senken, Dispo (teuer), Bankgespräch (Stundung, Tilgungsaussetzung),
   Nachschuss aus Gehalt, Verkauf (Abschlag, Vorfälligkeitsentschädigung, Steuer).
3. **Erst dann:** Zwangsversteigerung bzw. Insolvenz als Ende **dieses Laufs**.
4. **Danach:** Krisen-Analyse (Zeitstrahl der Ursachen, Verweis aufs Tagebuch). Lernmodus: „Zurück zum Entscheidungspunkt“.
   Standard: neuer Lauf, mitgenommen werden Wissen, Meilensteine, Debriefs – kein Geld.

---

## 13. Schwierigkeit

**Zwei getrennte Regler** – das Rechenmodell bleibt immer realistisch:
- **Hilfestufe** (Lernmodus / Standard / Profi): Hinweise, Stopps, Mentor, Checkpoints, Informationsdichte.
- **Marktschwierigkeit** (Leicht / Mittel / Schwer / Experte): Marktpfad, Zinsumfeld, Bankstrenge, Ereignisdichte.

**Warum der Zins die Schwierigkeit bestimmt [R]:** Die Bruttomietrendite, ab der ein Objekt im ersten Jahr selbst
abzahlend ist, beträgt `(Zins + Tilgung) / (1 − Kostenquote)`. Bei 2 % Zins + 2 % Tilgung und 33 % Kostenquote sind das
**6 %** (die bekannte Faustregel), bei 4 % + 2 % sind es **9 %**. Das Freie Spiel 2026 ist deshalb von Natur aus „schwer“ –
das ist Absicht und wird im Lernpfad erklärt.

---

## 14. Balancing-Philosophie

- **Keine dominante Strategie.** Flips kosten Nebenkosten, Zeit, Steuer (Spekulationsfrist, ggf. gewerblicher Handel);
  Bank bremst über Haushaltsrechnung und Portfoliobetrachtung; Werte können fallen; Information kostet.
- **Kalibrieren statt erfinden:** Monte-Carlo-Läufe über Profile × Strategien × Marktpfade müssen Bänder aus Fallstudien
  und Marktdaten treffen (`02-…` §4). Abweichungen sind Fehler oder Lücken, keine Balance-Hebel.
- **Exploits des Prototyps als Regressionstests** (Gutachten-Bonus, Bonität ≥ 800 = unbegrenzt, Halten verliert immer).

---

## 15. Bewusst nicht (vorerst)

- Echtzeit, Mikrotransaktionen, Energiesysteme/Wartezeiten, Ranglisten nach Vermögen.
- Selbstgenutztes Eigenheim als Kauf (später als Option, beeinflusst Haushaltsrechnung).
- Reine Gewerbeimmobilien (nur Wohn- und Geschäftshaus mit Gewerbeanteil ab P7).
- Kauf aus Zwangsversteigerung (Kandidat für P7+).
- Mehrspieler.
