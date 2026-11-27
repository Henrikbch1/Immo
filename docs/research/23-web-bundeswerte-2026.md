# 23 – Bundeswerte Stand 27.11.2026 (Web, nicht primärquellen-geprüft)

> Alle Werte stammen aus Suchtreffern; amtliche Texte (gesetze-im-internet.de, EZB, Bundesbank) waren nicht abrufbar. Vor Übernahme in den Vault gegen die Primärquelle prüfen (Strang W, LR-21/45/46/48).


Hinweis: WebFetch auf gesetze-im-internet.de, ecb.europa.eu, bundesbank.de, lxgesetze.de war im Netzwerk nicht erreichbar (Host nicht freigegeben). Alle Werte stammen daher aus WebSearch-Treffern/Snippets. Sicherheit: A amtliche Primärquelle (Treffer auf amtlicher Seite), B Sekundär, C unklar. Amtliche Texte wurden NICHT direkt gelesen -> vor Verwendung gegen Primärquelle prüfen.

## 1. Einkommensteuertarif § 32a EStG 2026
Quelle: https://www.gesetze-im-internet.de/estg/__32a.html (Treffer-Auszug), Gegenprüfung https://www.finanz-tools.de/einkommensteuer/berechnung-formeln/2026 (B)

| Parameter | Wert | Stand | Sicherheit |
|---|---|---|---|
| Grundfreibetrag | 12.348 EUR (Zone 1: Steuer 0 bis 12.348) | 2026 | A (Gesetzestext-Zitat im Treffer) |
| Zone 2 | 12.349 – 17.799 EUR: (914,51 · y + 1.400) · y, y = (zvE − 12.348) / 10.000 | 2026 | A (Koeffizient 914,51 und 1.400 im Treffer); y-Definition B |
| Zone 3 | 17.800 – 69.878 EUR: (173,10 · z + 2.397) · z + 1.034,87, z = (zvE − 17.799) / 10.000 | 2026 | B (Konstante 1.034,87 aus Suchzusammenfassung, mehrere Rechner übereinstimmend) |
| Zone 4 | 69.879 – 277.825 EUR: 0,42 · x − 11.135,63 | 2026 | B |
| Zone 5 | ab 277.826 EUR: 0,45 · x − 19.470,38 | 2026 | B |
| Rundung | x = zvE auf volle Euro abgerundet; Steuerbetrag auf volle Euro abgerundet (aus Rechnerangabe bzw. Gesetzesstruktur, nicht im Treffer wörtlich bestätigt) | 2026 | C/B |
| Abweichende Konstanten | steuerschroeder.de nennt 10.911,92 (Zone 4) / 19.246,67 (Zone 5): laut Suchzusammenfassung vermutlich fehlerhaft | – | C |
| Gesetzesänderung | § 32a 2026 geändert durch Standortfördergesetz (BGBl. 2026 I Nr. 33, 04.02.2026) bzw. „Art. 2 SteFeG“: Quellen widersprüchlich | – | C |

Soli 2026 (Freigrenze, auf Einkommensteuer): 20.350 EUR (Einzel), 40.700 EUR (Zusammenveranlagung); Milderungszone 11,9 % des Überschusses, max. 5,5 %. Quelle: https://www.tk.de/firmenkunden/service/fachthemen/fachthema-beitraege/solidaritaetszuschlag-bundesfinanzhof-2075802 und https://www.finanz.de/steuern/solidaritaetszuschlag/ ; Rechtsgrundlage Steuerfortentwicklungsgesetz vom 30.12.2024. Stand 2026. Sicherheit B.

## 2. Zinsen
| Wert | Ergebnis | Quelle | Stand | Sich. |
|---|---|---|---|---|
| EZB Einlagefazilität | 2,50 % (Hauptrefi 2,65 %, Spitzenrefi 2,90 %); Anhebung um 25 BP im Sept. 2026 (wirksam 16.09.), am 29.10.2026 unverändert; nächste Sitzung 17.12.2026 | https://www.bundesbank.de/resource/blob/959126/5e186f26f006772bbfb1bb528ff8b547/472B63F073F071307366337C94F8C870/2026-10-29-beschluesse-download.pdf (Bundesbank-Kopie EZB-Pressemitteilung, nur Treffer-Auszug) | 29.10.2026 | A- (Auszug, nicht voll gelesen) |
| Bauzins 10 J. Interhyp | 4,3 % (Zinscheck 12.11.2026); Chart Nov. 2026: 4,26 %; Okt. 2026: 4,42 % | https://www.interhyp.de/ratgeber/was-muss-ich-wissen/zinsen/zins-charts/ | 11/2026 | B |
| Bauzins 10 J. Dr. Klein | Effektivzins 4,29 % (10 J. Bindung, 2 % Tilgung, Abschluss Nov. 2026); Prognose Top-Zins 4,0–4,5 % | https://www.drklein.de/bauzinsen.html | 11/2026 | B |
| Bundesbank-Statistik Effektivzins | nicht gefunden | – | – | – |

Ältere Treffer (EZB 2,00 % seit 11.06.2025; Trading Economics Stand 03/2026 2,0 %) sind überholt.

## 3. CO2-Preis BEHG
| Wert | Ergebnis | Quelle | Stand | Sich. |
|---|---|---|---|---|
| 2026 | Preiskorridor 55–65 EUR/t (Auktion) | https://www.advant-beiten.com/en/news/behg-novelle-co2-preis-bleibt-2027-im-korridor-von-55-bis-65-euro ; https://vdiv.de/news-details/co2-preis-bleibt-2027-gedeckelt-bundesregierung-verlaengert-preiskorridor | 2026 | B |
| 2027 | Korridor 55–65 EUR/t soll beibehalten werden (Drittes BEHG-Änderungsgesetz; Kabinett 12.08.2026; BT-Drs. 21/…, https://www.bundestag.de/1210950). Verabschiedung/Verkündung nicht bestätigt | s. o. | 09/2026 | B (Entwurf), Verabschiedung C |
| Auktionsparameter | Überschussmengenpreis 68 (2026) / 73 (2027); Nachkaufpreis 70 / 75 EUR | https://www.ey.com/de_de/technical/steuernachrichten/referentenentwurf-zum-dritten-behg-aenderungsgesetz-stabilisierung-des-co2-preises-fuer-2027 | 2026 | B |
| ETS2 | Start auf 2028 verschoben (Auslöser der Korridor-Verlängerung) | vdiv/Advant Beiten | 2026 | B |

## 4. Mietrecht / GModG
| Thema | Stand | Quelle | Sich. |
|---|---|---|---|
| Mietpreisbremse | Verlängerung bis 31.12.2029; BT Juni 2025, BR 11.07.2025 beschlossen | https://www.lto.de/recht/nachrichten/n/bundestag-verlaengert-mietpreisbremse-bis-2029 ; https://www.bundestag.de/dokumente/textarchiv/2025/kw23-de-mietpreisbremse-1083644 | A/B |
| Mietrecht II (Mietrechtsreform 2026) | Kabinett 29.04.2026; 1. Lesung BT Juli 2026; Beschluss/Inkrafttreten nicht belegt (ein Treffer „Bundestag beschließt Deckelung Möblierungszuschläge“ boerse-express, unbestätigt). Geplant: Möblierungszuschlag max. 1 % des Zeitwerts/Monat bzw. 10 % Pauschale, gesonderte Ausweisung; weitere Punkte Kurzzeitverträge, Schonfrist | https://www.berliner-mieterverein.de/magazin/online/mm0626/mietrechtsreform.htm ; https://www.immowelt.de/ratgeber/mieten/mietrechtsreform-2026 ; https://dserver.bundestag.de/brd/2026/0265-26.pdf | B/C |
| Indexmiete | Widersprüchlich: KPMG Law „Deckel“, VDIV „keine Deckelung von Indexmieten“ | https://vdiv.de/news-details/mietrecht-reformiert-keine-deckelung-von-indexmieten-neue-regeln-fuer-moebliertes-wohnen ; https://kpmg-law.de/mietrechtsreform-2026-setzt-engere-rahmenbedingungen-fuer-vermieter/ | C |
| GModG (löst GEG ab) | Bundestag 10.07.2026, BR zugestimmt; in Kraft seit 29.07.2026 (Haufe/gegen-hartz; BDEW erwartete Ende Juli/Anfang Aug.); EPBD-Teile ab 01.01.2027. Kernpunkte: freie Heizungswahl, „Bio-Treppe“ für neue Heizungen im Bestand, Kostenverteilung Vermieter/Mieter bei neuen fossilen Heizungen, Härtefallregel (bis 6 Wohnungen, nicht angespannte Märkte), Bestandsanlagen laufen weiter | https://www.bundesregierung.de/breg-de/suche/neues-gebaeudemodernisierungsgesetz-2430284 ; https://www.goerg.de/de/aktuelles/veroeffentlichungen/17-07-2026/gebaeudemodernisierungsgesetz-gmodg-schafft-geg-ab-was-sich-aendert-und-was-bleibt ; https://www.haufe.de/wissen/immobilien/gebaeudemodernisierungsgesetz | B (Bundesregierung-Seite bestätigt Verabschiedung: A-) |

Lücke: exakte Modernisierungsumlage-Änderungen und BGBl-Datum nicht gefunden.

## 5. AfA
| Thema | Wert | Quelle | Sich. |
|---|---|---|---|
| Degressive AfA § 7 Abs. 5a EStG | 5 % vom Restwert, Wohngebäude; Baubeginn (Herstellung: Bauantrag/Bauanzeige-Datum nach Anwendungsregel, laut Quellen „angezeigter Baubeginn“) 01.10.2023 – 30.09.2029 (Zeitfenster 6 Jahre); Kauf: Erwerb bis Ende Fertigstellungsjahr; Wechsel zur linearen AfA zulässig; keine Kombination mit Sonder-AfA nach § 7b nach Haufe widersprüchlich (Quelle sagt kombinierbar) | https://www.haufe.de/immobilien/wirtschaft-politik/abschreibung-in-der-steuer-degressive-afa-beim-wohnungsbau_84342_602294.html ; https://www.zdh.de/ueber-uns/fachbereich-steuern-und-finanzen/lohn-und-einkommensteuer/zeitliche-voraussetzungen-inanspruchnahme-degressive-gebaeude-afa/ | B |
| Verlängerung über 2029 | nicht gefunden. Investitionssofortprogramm 2025: 30 % degressiv nur für bewegliche WG 2025–2027, nicht Gebäude | https://www.iww.de/pbp/auftragsbeschaffung/auftragsbeschaffung-impulse-fuer-planer-und-bauunternehmer-im-wohnungsbau-degressive-afa-ist-beschlossen-f155403 | B |
| Sonder-AfA § 7b EStG | 5 % p. a. 4 Jahre zusätzlich; Bauantrag/Bauanzeige bis 01.10.2029 (Wachstumschancengesetz 27.03.2024); BMF-Schreiben 21.05.2025; BFH 12.08.2025: kein Neubau bei Abriss ohne zusätzlichen Wohnraum. lxgesetze nennt letzte Gesetzesänderung 29.06.2026 (Inhalt unbekannt). Hinweis: Prozentsatz/Baukostengrenze 5 % / 5.200 bzw. 4.000 EUR aus Vorwissen, nicht in Treffern bestätigt | https://www.haufe.de/immobilien/wirtschaft-politik/abschreibung-beim-mietwohnungsbau_84342_572146.html ; https://kpmg.com/de/de/home/themen/2025/10/bfh-sonderabschreibung-abriss-neubau.html | B |

## 6. WEG § 25 Abs. 2
Satz 1: Jeder Wohnungseigentümer hat eine Stimme (Kopfprinzip); Wortlaut nicht direkt gelesen. Abweichung durch Vereinbarung (Teilungserklärung/Gemeinschaftsordnung, § 10 Abs. 1 WEG) zulässig: Objektprinzip (Stimme je Einheit) oder Wertprinzip (nach MEA), auch Majorisierung hinzunehmen; bloßer Verweis aufs WEG = Kopfprinzip. Quellen: BGH V ZR 253/10 (https://rewis.io/urteile/urteil/sc7-28-10-2011-v-zr-25310/), BGH V ZR 198/14 (https://rewis.io/urteile/urteil/ugs-10-07-2015-v-zr-19814/), https://vdiv.de/aktuelles/urteile/details/stimmrechtsmehrung-bei-kopfstimmrecht . Sicherheit B (Rechtsprechung aus Sekundärportalen; Treffer verweisen teils noch auf § 10 Abs. 2 S. 2 WEG a. F.).
