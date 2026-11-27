# 25 – Primärquellen-Prüfung Mieterschutz/Grunderwerbsteuer NDS, NRW, HB (Stand 27.11.2026)

Prüfung von `24-web-laender-nds-nrw-hb.md` (ungeprüfte Webrecherche) gegen Primärquellen. Keine Rechts-/Steuerberatung.

## 0. Methodik, Zugriff, Sicherheitsstufen

- **A** = Primärtext (Gesetz/Verordnung/Gesetzblatt/Begründung) von mir gelesen. **B** = Sekundärquelle (Haufe u. ä.) gelesen oder Treffer-Zusammenfassung mit amtlicher Fundstelle, Primärtext nicht gelesen. **C** = unklar/widersprüchlich/nur Snippet.
- Per curl erreichbar und gelesen: `gesetze-im-internet.de` (BGB, BauGB, GrEStG; Verbindung teils flaky, Wiederholung hilft), `recht.nrw.de` (vollständig), `niedersachsen.de` (nur ältere GVBl.-PDF unter `/download/ID/Name.pdf`), `haufe.de`.
- **Nicht erreichbar** (Proxy 403 bzw. nicht aufgelöst): `mw.niedersachsen.de`, `stk.niedersachsen.de`, `verkuendung-niedersachsen.de` (Nds. GVBl. 2024 Nr. 121/122, 2025 Nr. 91/93), `voris.wolterskluwer-online.de`, `bau.bremen.de`, `rathaus.bremen.de`, `transparenz.bremen.de`, `service.bremen.de`. `gesetzblatt.bremen.de` antwortet mit 403 (serverseitig). Ein Umgehen wurde bewusst nicht versucht.
- Folge: **NDS-Verordnungen 2024/2025 und alle Bremer Verordnungen sind nur über Sekundärquellen/Suchtreffer belegt (B/C).** NRW ist vollständig A. Zum Nachholen: die genannten Hosts in der Netzwerk-Allowlist freischalten.

## 1. Zusammenfassung der Abweichungen zu Datei 24

| Nr. | Datei 24 | Befund (Datei 25) | Stufe |
|---|---|---|---|
| 1 | NDS Mieterschutz-VO „Neufassung erlassen 27.11.2025, in Kraft 01.01.2026“ | **Falsch zugeordnet.** Die Nds. Mieterschutzverordnung ist vom 20.12.2024 (Nds. GVBl. 2024 Nr. 122, ausgegeben 23.12.2024), in Kraft 01.01.2025; Änderungs-VO vom 03.12.2025 (Nds. GVBl. 2025 Nr. 93, Kabinett 25.11.2025) verlängert bis 31.12.2029. Das Datum 27.11.2025 gehört zur separaten § 250-BauGB-VO (Nds. GVBl. 2025 Nr. 91). | B/C |
| 2 | NDS Kündigungssperrfrist „10 Jahre (VO 2022, GVBl. 30/2022)“ | **Falsch.** GVBl. 30/2022 ist die BauGB-VO (§ 201a/§ 250), nicht die Mieterschutz-VO. „zehn Jahre“ dort (Begründung) ist die **gesetzliche Höchstdauer** der Rechtsfolge nach § 577a Abs. 2 BGB, nicht die Frist. Aktuell: **5 Jahre** in den 57 Gemeinden, befristet bis **31.12.2031**. | A (2022-Text), B (aktuell) |
| 3 | NDS „Inselregelung befristet bis 01.01.2028“, Sonderfälle Baltrum/Langeoog/Spiekeroog | Stammt aus der **VO 2020** (Nds. GVBl. 49/2020): 5 Jahre für alle damaligen 18 Gebiete, außer Kraft 31.12.2027 – überholt. Keine Insel-Sonderregel in der aktuellen Fassung belegt (alle 57 einheitlich 5 Jahre, B). | A (2020), B |
| 4 | NRW Kündigungssperrfrist „nicht gefunden“ | **Gefunden, A:** 8 Jahre in den 57 Gemeinden der Anlage, § 1 Abs. 2 MietSchVO NRW. | A |
| 5 | NRW „ein Ort entfällt (Bad Honnef, ungeprüft)“ | **Bestätigt, A:** Bad Honnef steht nicht in der Anlage 2025 (war in der VO 2020). | A |
| 6 | NRW MPB „01.03.2025 bis 31.12.2029“ | Präzisiert: § 1 Abs. 1 (Mietpreisbremse) bis 31.12.2029; Rest der VO (Kappungsgrenze, Kündigungssperrfrist) bis **28.02.2030**. Änderung vom 28.10.2025 in Kraft seit 07.11.2025. | A |
| 7 | NRW „Gebietsverordnung § 201a BauGB befristet bis 31.12.2026“; § 250 „nicht gefunden“ | § 201a-VO bestätigt (A). Heute 27.11.2026: **läuft in 34 Tagen aus, keine Verlängerung gefunden.** § 250-VO: **keine** (Haufe B: „NRW hat keinen Genehmigungsvorbehalt nach § 250 BauGB eingeführt“; in recht.nrw.de keine gefunden). | A / B |
| 8 | HB Kappungsgrenzen-VO „vom 16.08.2024“ | Datumsproblem: Transparenzportal-Titel (Snippet) „vom 6. August 2024“ (Senatsbeschluss), Haufe „16.8.2024“; Fundstelle Brem.GBl. 2024 S. 598; gilt 01.09.2024 bis 31.08.2029 (Laufzeit damit aus Haufe belegt, vorher „nicht verifiziert“). | B/C |
| 9 | HB § 201a-VO „Änderungs-VO im Entwurf“ | **Inzwischen erlassen:** Senat 24.02.2026, Brem.GBl. 20.03.2026 Nr. 29: Befristung „2026“ → „2031“. Anwendung nur auf §§ 25, 175 BauGB. | C (Snippets) |
| 10 | HB § 250 „Senatsvorlage 24.02.2026 sagt kein Bedarf“ | Haufe (B, Stand 12.11.2026): Bremen hat **weder § 250- noch § 201a-VO** – widerspricht Nr. 9 (§ 201a-VO existiert seit 2021). Für § 250: **keine VO** (übereinstimmend). | B/C |
| 11 | HB Kündigungssperrfrist „nicht gefunden“ | Bremen: **keine Verlängerung**, es gilt 3 Jahre (§ 577a Abs. 1 BGB). Beleg: Senatsantwort Juni 2026 und Mieterbund-Liste (nur Snippets). | C |
| 12 | Grunderwerbsteuer HB „seit 01.07.2025 nicht bestätigt“ | **Bestätigt (B):** 5,5 % für Erwerbsvorgänge ab 01.07.2025. Gesetz vom 22.01.2025, Brem.GBl. 2025 Nr. 9 vom 05.02.2025. | B |
| 13 | Grunderwerbsteuer NRW/NDS „B, amtliches Gesetz nicht geöffnet“ | NRW jetzt **A** (Gesetzestext gelesen). NDS weiter B/C (Fundstelle Haushaltsbegleitgesetz 2014 vom 16.12.2013, uneinheitliche Datumsangaben). | A / B/C |

## 2. Mietpreisbremse (§ 556d BGB)

Rechtsrahmen (A): § 556d Abs. 2 BGB-Ermächtigung; die Befristung beträgt nach Gesetzesänderung vom 17.07.2025 (BGBl. 2025 I Nr. 163) längstens bis 31.12.2029 (so die amtliche Begründung der NRW-Änderungs-VO, `recht.nrw.de/system/files/2025-11/gv2025-43-1anlage.pdf`).

| | Niedersachsen | Nordrhein-Westfalen | Bremen |
|---|---|---|---|
| Titel | Verordnung zur Festlegung des Anwendungsbereichs bundesrechtlicher Mieterschutzvorschriften (Niedersächsische Mieterschutzverordnung, NMiSchuV) | Verordnung zur Festlegung des Anwendungsbereiches bundesrechtlicher Mieterschutzvorschriften im Land Nordrhein-Westfalen (Mieterschutzverordnung NRW – MietSchVO NRW) | Verordnung über die zulässige Miethöhe gemäß § 556d Absatz 2 BGB (Mietenbegrenzungsverordnung) |
| Datum | 20.12.2024 (Ausfertigung laut Suchtreffer); verkündet Nds. GVBl. 2024 Nr. 122 (Ausgabe 23.12.2024; Haufe nennt „23.12.2024“). Änderungs-VO 03.12.2025, Nds. GVBl. 2025 Nr. 93 | 28.01.2025, GV. NRW. 2025 S. 111; geändert durch VO vom 28.10.2025, GV. NRW. 2025 S. 848 (Nr. 43, veröffentlicht 06.11.2025) | Senatsbeschluss 18.11.2025; Brem.GBl. 2025 Nr. 127 vom 28.11.2025, S. 1254 |
| Inkrafttreten | 01.01.2025 | 01.03.2025 (Änderung: 07.11.2025) | 01.12.2025 |
| Außerkrafttreten | 31.12.2029 (nach Änderung; vorher 31.12.2025) | § 1 Abs. 1 (Mietpreisbremse): 31.12.2029; übrige VO: 28.02.2030 | 31.12.2029 |
| Gebiet | 57 Einheits-/Samtgemeinden (Liste unten) | 57 Gemeinden (Anlage, Liste unten) | Stadtgemeinde Bremen, ohne Bremerhaven |
| URL | Haufe: https://www.haufe.de/immobilien/verwaltung/mietpreisbremse-in-diesen-staedten-gilt-sie/mietpreisbremse-in-bremen-hamburg-niedersachsen-s-h-mv_258_334648.html ; Haufe 28.11.2025: https://www.haufe.de/immobilien/wirtschaft-politik/niedersachsen-fuehrt-mietpreisbremse-ein_84342_383998.html ; amtlich (nicht erreichbar): https://www.verkuendung-niedersachsen.de/api/ndsgvbl/2024/122/0/nds-gvbl-2024-122.pdf ; https://www.verkuendung-niedersachsen.de/ndsgvbl/2025/93/ | https://recht.nrw.de/lrgv/rechtsverordnung/07112025-mieterschutzverordnung-nrw-mietschvo-nrw/ ; Änderungs-VO: https://recht.nrw.de/gvnrw/2025-s848 ; Anlage: https://recht.nrw.de/system/files/BA/54532-52830-sgv_238_20250128_1_anlage1.pdf | Haufe: s. NDS-Link (Abschnitt Bremen); amtlich (403): https://www.gesetzblatt.bremen.de/fastmedia/218/2025_11_28_GBl_Nr_0127_signed.pdf |
| Stand/Sicherheit | 27.11.2026; **B** (Datum 20.12. vs. 23.12.2024: C; Haufe-Datum der Änderung stimmt mit Suchtreffer zum GVBl. überein) | 27.11.2026; **A** (Text und Anlage gelesen, Fassung gültig ab 07.11.2025) | 27.11.2026; **B** |

### 2.1 Gemeindeliste Niedersachsen (57, Haufe, B)

Die Liste ist in beiden Haufe-Artikeln (Stand 28.11.2025 bzw. fortgeschrieben) identisch; der Stand nach der Änderungs-VO vom 03.12.2025 gilt laut Haufe als unverändert („Gebietskulisse bleibt unverändert“). Primärliste (Anlage zur VO) nicht lesbar.

Achim, Adendorf, Bad Rothenfelde, Bad Zwischenahn, Baltrum, Bardowick, Bienenbüttel, Bleckede, Borkum, Bovenden, Braunschweig, Buchholz in der Nordheide, Buxtehude, Cuxhaven, Emsbüren, Garbsen, Gellersen, Göttingen, Hanstedt, Hannover, Hatten, Hemmingen, Hildesheim, Ilmenau, Isernhagen, Juist, Laatzen, Langeoog, Langenhagen, Leer (Ostfriesland), Lilienthal, Lingen (Ems), Lüneburg, Neu Wulmstorf, Norden, Norderney, Nordhorn, Oldenburg (Oldb), Osnabrück, Ostheide, Oyten, Rastede, Rotenburg (Wümme), Seevetal, Seelze, Spiekeroog, Stade, Stuhr, Tostedt, Uelzen, Wangerooge, Wedemark, Weyhe, Winsen (Aller), Winsen (Luhe), Wolfsburg, Wunstorf.

(Anzahl nachgezählt: 57. Datei 24 nennt Weyhe, Stuhr, Achim, Oyten, Rotenburg als neu – konsistent.)

**Samtgemeinde-Besonderheiten NDS:**
- Das Gutachten der Verordnung 2020 betrachtet ausdrücklich die „Ebene der Einheits- und Samtgemeinden“ (A, Nds. GVBl. 49/2020, Begründung). Die Gebietsbestimmung 2024 knüpft laut Suchtreffer (Ministerium) ebenfalls an „Einheits- und Samtgemeinden“ an (C).
- Namen in der Liste, die Samtgemeinden bezeichnen (eigene Fachkenntnis, nicht aus Primärtext der VO): Bardowick, Bienenbüttel, Gellersen, Hanstedt, Ilmenau, Ostheide, Tostedt (alle Lkr. Lüneburg/Harburg). Ob die VO die gesamte Samtgemeinde (alle Mitgliedsgemeinden) erfasst, ist anzunehmen, aber **nicht am Primärtext belegt (C)**. Spielmodell: Gebiet = Samtgemeinde als Ganzes führen, mit Flag GESCHÄTZT.
- Hildesheim, Cuxhaven, Rastede, Hatten u. a. kamen 2025 neu hinzu (vorher 18 Gebiete, siehe 5.1).

### 2.2 Gemeindeliste Nordrhein-Westfalen (57, A)

Quelle: Anlage zur MietSchVO NRW, https://recht.nrw.de/system/files/BA/54532-52830-sgv_238_20250128_1_anlage1.pdf (gelesen, 57 Einträge, identisch mit der GV-Anlage `gv6-3anlage1.pdf`; die Änderungs-VO ändert die Anlage nicht, ihre Begründung bestätigt „57 Gemeinden bleiben unberührt“).

Aachen, Alfter, Bad Lippspringe, Bergheim, Bergisch Gladbach, Bielefeld, Bonn, Bornheim, Brühl, Dormagen, Dortmund, Düren (Stadt), Düsseldorf, Elsdorf, Erftstadt, Erkrath, Frechen, Greven, Grevenbroich, Harsewinkel, Hennef, Hilden, Hürth, Kaarst, Kempen, Kerpen, Korschenbroich, Köln, Königswinter, Krefeld, Langenfeld, Leichlingen, Leverkusen, Lohmar, Lotte, Meckenheim, Meerbusch, Monheim, Münster, Neuss, Niederkassel, Ostbevern, Overath, Paderborn, Pulheim, Ratingen, Rheinbach, Rösrath, Rommerskirchen, Sankt Augustin, Siegburg, Swisttal, Telgte, Troisdorf, Wachtberg, Weilerswist, Wesseling.

Hinweis: In der amtlichen Anlage ist bei Kaarst fälschlich „Kreis Mettmann“ statt Rhein-Kreis Neuss angegeben (redaktioneller Fehler der Anlage, ohne Rechtswirkung). Essen, Gelsenkirchen, Bochum, Duisburg, Wuppertal, Bad Honnef sind **nicht** erfasst.

### 2.3 Bremen (B)

Gebiet: Stadtgemeinde Bremen; Bremerhaven nicht erfasst (Haufe, Senatsvorlage lt. Suchtreffer). Vorgänger-VO lief bis 30.11.2025 (Suchtreffer, C).

## 3. Kappungsgrenze (§ 558 Abs. 3 BGB, 15 % statt 20 %)

| | Niedersachsen | Nordrhein-Westfalen | Bremen |
|---|---|---|---|
| Regelung | In denselben 57 Gemeinden wie Mietpreisbremse (Haufe); Rechtsgrundlage laut Mietspiegeln § 2 NMiSchuV | Selbe VO wie Abschnitt 2 (§ 1 Abs. 2), dieselben 57 Gemeinden | Verordnung zur Senkung der Kappungsgrenze gemäß § 558 Absatz 3 BGB (Kappungsgrenzen-Verordnung), Brem.GBl. 2024 S. 598; Stadtgemeinde Bremen ohne Bremerhaven |
| Datum | wie MPB-VO | 28.01.2025 | Titel im Transparenzportal „vom 6. August 2024“ (Senat), Haufe „16.8.2024“ – **Datum offen (C)** |
| Laufzeit | 01.01.2025 bis 31.12.2029 (Haufe 28.11.2025) | 01.03.2025 bis 28.02.2030 (§ 3 Abs. 2) | 01.09.2024 bis 31.08.2029 |
| URL | https://www.haufe.de/immobilien/wirtschaft-politik/niedersachsen-fuehrt-mietpreisbremse-ein_84342_383998.html | https://recht.nrw.de/lrgv/rechtsverordnung/07112025-mieterschutzverordnung-nrw-mietschvo-nrw/ ; Haufe: https://www.haufe.de/immobilien/verwaltung/mietpreisdeckel-regelungen-der-bundeslaender-zur-kappungsgrenze/kappungsgrenze-in-hessen-nrw-rheinland-pfalz-saarland_258_275642.html | Haufe: https://www.haufe.de/immobilien/verwaltung/mietpreisdeckel-regelungen-der-bundeslaender-zur-kappungsgrenze/kappungsgrenze-in-bremen-hamburg-niedersachsen-s-h-m-v_258_275640.html |
| Stand/Sicherheit | 27.11.2026; B | 27.11.2026; **A** | 27.11.2026; B (Laufzeit), C (Datum) |

## 4. Kündigungssperrfrist § 577a Abs. 2 BGB

Rechtsrahmen (A, https://www.gesetze-im-internet.de/bgb/__577a.html): Grundfrist 3 Jahre (Abs. 1/1a); Abs. 2: Frist „bis zu zehn Jahre“, Gebiete und Frist per Landesverordnung, je Verordnung höchstens zehn Jahre Geltungsdauer.

| | Niedersachsen | Nordrhein-Westfalen | Bremen |
|---|---|---|---|
| Aktuelle VO | Niedersächsische Mieterschutzverordnung (s. Abschnitt 2), Teil zur Kündigungssperrfrist | MietSchVO NRW, § 1 Abs. 2 Satz 2 | **keine** Verordnung gefunden |
| Frist | **5 Jahre** (statt 3) | **8 Jahre** (statt 3) | 3 Jahre (Gesetz), keine Verlängerung |
| Gemeinden | dieselben 57 wie Abschnitt 2.1 (Haufe) | dieselben 57 wie Abschnitt 2.2 (Anlage) | – |
| Geltungsdauer | bis **31.12.2031** (Haufe; zwei Jahre länger als Mietpreisbremse/Kappungsgrenze) | bis 28.02.2030 (§ 3 Abs. 2); Übergang § 2: bei Veräußerung vor 01.03.2025 gilt weiter die VO vom 09.06.2020 | – |
| URL | https://www.haufe.de/immobilien/wirtschaft-politik/niedersachsen-fuehrt-mietpreisbremse-ein_84342_383998.html | https://recht.nrw.de/lrgv/rechtsverordnung/07112025-mieterschutzverordnung-nrw-mietschvo-nrw/ | Senatsantwort 16.06.2026 (Snippet): https://www.rathaus.bremen.de/sixcms/media.php/13/20260616_top_4_Schutz_vor_Wohnungsverlust.pdf ; Mieterbund (Snippet): https://mieterbund.de/service/mieterschutzverordnungen/kuendigungssperrfrist/ |
| Stand/Sicherheit | 27.11.2026; B (Frist/Datum aus Haufe; Primärtext nicht lesbar) | 27.11.2026; **A** | 27.11.2026; C |

Historie NDS (A): VO 2020 (Nds. GVBl. 49/2020 vom 23.12.2020) – 5 Jahre in 18 Gebieten, in Kraft 01.01.2021, außer Kraft 31.12.2027 (Mietpreisbremse/Kappung bis 31.12.2025). Von der Neufassung 2024 abgelöst (Datei 24: dies als „Inselregelung“ missverstanden).

## 5. Umwandlungsverordnung § 250 BauGB (Genehmigungsvorbehalt) und § 201a BauGB

Rechtsrahmen (A, https://www.gesetze-im-internet.de/bbaug/__250.html und `__201a.html`; Achtung Kürzel `bbaug`, nicht `baugb`): § 250 Abs. 1: Genehmigungspflicht bei Wohngebäuden, nicht bei höchstens fünf Wohnungen (Landesverordnung kann Schwelle 3–15 setzen); VO muss spätestens mit Ablauf **31.12.2030** außer Kraft treten (§ 201a: **31.12.2031**).

| | Niedersachsen | Nordrhein-Westfalen | Bremen |
|---|---|---|---|
| § 250-VO | Niedersächsische Verordnung zur Bestimmung von Gebieten mit angespannten Wohnungsmärkten im Sinne des § 250 des Baugesetzbuchs vom **27.11.2025**, Nds. GVBl. 2025 Nr. 91 (VORIS-Snippet); gilt ab **01.01.2026 bis 31.12.2029**; **57 Gemeinden** (dieselbe Gebietskulisse wie Abschnitt 2.1); Genehmigungspflicht ab 6 Wohnungen (= gesetzliche Schwelle, B) | **keine** § 250-VO (Haufe B; in recht.nrw.de keine gefunden) | **keine** § 250-VO (Haufe B, Stand 12.11.2026) |
| § 201a-VO | Abgelöst durch Fassungen 2024/2025 (Nr. 121/2024, Nr. 91/2025). Alt (A): VO vom 14.09.2022, Nds. GVBl. 30/2022: § 1 (§ 201a) bis 31.12.2026, § 2 (§ 250) bis 31.12.2025, 18 Gebiete | BaulandmobilisierungsVO NRW vom 21.12.2022, GV. NRW. 2023 S. 2; in Kraft 07.01.2023; **außer Kraft 31.12.2026** (A, einzige Fassung auf recht.nrw.de); Anlage 1: 95 Gemeinden; **Verlängerung nicht gefunden** | Änderungs-VO Senat 24.02.2026, Brem.GBl. 2026 Nr. 29 vom 20.03.2026: Befristung 2026 → 2031; gilt nur für §§ 25, 175 BauGB (C, Snippets) |
| URL | Haufe: https://www.haufe.de/immobilien/wirtschaft-politik/baulandmobilisierungsgesetz-das-planen-die-bundeslaender_84342_547308.html ; amtlich (nicht erreichbar): https://www.mw.niedersachsen.de/download/224034 ; 2022 (A): https://www.niedersachsen.de/download/188040/Nds._GVBl._Nr._30_2022_vom_23.09.2022_S._543-557.pdf | https://recht.nrw.de/lrgv/rechtsverordnung/07012023-verordnung-zur-bestimmung-von-gebieten-im-land-nordrhein-westfalen/ ; Haufe-Übersicht s. NDS | Gesetzblatt (403): https://www.gesetzblatt.bremen.de/fastmedia/218/2026_03_20_GBl_Nr_0029_signed.pdf ; Haufe-Übersicht s. NDS |
| Stand/Sicherheit | 27.11.2026; B (Datum: C, VORIS-Snippet) | 27.11.2026; **A** (201a) / B (kein § 250) | 27.11.2026; B/C |

Abweichung zu Datei 24 (NDS): „gültig bis spätestens 31.12.2029, Verordnung vom Nov. 2025, ab 01.01.2026“ – bestätigt (B). Zusatz: Haufe-Übersicht und Datei 24 widersprechen sich bei Bremen § 201a (Datei 24: läuft; Haufe: keine VO). Die Bremer Gesetzblatt-Treffer (Nr. 29/2026) sprechen für Existenz und Verlängerung.

### 5.1 Altbestand NDS (A): 18 Gebiete 2020/2022

Hannover, Buxtehude, Lüneburg, Borkum, Braunschweig, Buchholz in der Nordheide, Göttingen, Laatzen, Langenhagen, Norderney, Oldenburg (Oldb), Osnabrück, Wolfsburg, Juist, Wangerooge, Baltrum, Langeoog, Spiekeroog. Neu 2025 (gegenüber 2022): u. a. Achim, Adendorf, Bad Rothenfelde, Bad Zwischenahn, Bardowick, Bienenbüttel, Bleckede, Bovenden, Cuxhaven, Emsbüren, Garbsen, Gellersen, Hanstedt, Hatten, Hemmingen, Hildesheim, Ilmenau, Isernhagen, Leer, Lilienthal, Lingen (Ems), Neu Wulmstorf, Norden, Nordhorn, Ostheide, Oyten, Rastede, Rotenburg (Wümme), Seevetal, Seelze, Stade, Stuhr, Tostedt, Uelzen, Wedemark, Weyhe, Winsen (Aller), Winsen (Luhe), Wunstorf (Differenz der Listen, rechnerisch).

## 6. Grunderwerbsteuer

Bund (A, https://www.gesetze-im-internet.de/grestg_1983/__11.html): § 11 Abs. 1 GrEStG 3,5 % (Basissatz); die Länder setzen eigene Sätze per Landesgesetz (Art. 105 Abs. 2a GG), daher Landesgesetze maßgeblich.

| Land | Satz | Gesetz / Fundstelle | Letzte Änderung (Wirksamkeit) | URL | Stand | Stufe |
|---|---|---|---|---|---|---|
| NRW | **6,5 %** | Gesetz über die Festsetzung des Steuersatzes für die Grunderwerbsteuer vom 25.07.2011 (GV. NRW. S. 389), § 1 Abs. 1; geändert durch Gesetz vom 18.12.2014 (GV. NRW. S. 954, veröffentlicht 30.12.2014) | für Erwerbsvorgänge ab **01.01.2015** (zuvor 5,0 %) | https://recht.nrw.de/gvnrw/2014-s954 ; https://recht.nrw.de/system/files/pdf/state-law-and-regulations/2011/08/01/780c52/2015-01-01-gesetz-ueber-die-festsetzung-des-steuer.pdf | Fassung gültig ab 01.01.2015 (27.11.2026 als aktuelle Fassung abrufbar) | **A** |
| NDS | **5,0 %** | Gesetz über die Festsetzung des Steuersatzes für die Grunderwerbsteuer in Niedersachsen (vom 17.12.2010, 4,5 %), geändert durch Haushaltsbegleitgesetz 2014 vom 16.12.2013 (Nds. GVBl. vom 20.12.2013, lt. PwC) | ab **01.01.2014** (zuvor 4,5 % ab 01.01.2011) | https://www.pwc.de/de/steuerberatung/die-grunderwerbsteuersaetze-in-deutschland-im-ueberblick.html ; Gesetzestext nicht gefunden | 2026 | B/C (Datum des ÄndG und Fundstelle uneinheitlich) |
| HB | **5,5 %** | Zweites Gesetz zur Änderung des Gesetzes über die Festsetzung des Steuersatzes für die Grunderwerbsteuer vom **22.01.2025**, Brem.GBl. 2025 Nr. 9 vom 05.02.2025 (§ 1: 5,5 vom Hundert) | für Erwerbsvorgänge ab **01.07.2025** (zuvor 5,0 % seit 2014, vorher 4,5 %) | https://www.gesetzblatt.bremen.de/fastmedia/218/2025_02_05_GBl_Nr_0009_signed.pdf (403, nur Suchtreffer-Zusammenfassung); https://www.service.bremen.de/dienstleistungen/grunderwerbsteuer-9673 (nicht erreichbar) | 2026 | B |

Anmerkungen: Stichtag ist die Verwirklichung des Erwerbsvorgangs (NRW A; HB lt. Landesverwaltung), nicht pauschal der Beurkundungstag. Haufe-Schlagzeile vom 25.11.2026 („Neue Grunderwerbsteuer soll Tricks mit Share Deals stoppen“) betrifft Bundesrecht und wurde nicht ausgewertet; Änderungen der Länder-Sätze 2026 für NDS/NRW/HB wurden **nicht gefunden**. Datei 24: „Kein Länder-Freibetrag für Erstkäufer“ bleibt unverifiziert (C), hier nicht geprüft.

## 7. Nicht gefunden / offen

| Punkt | Status |
|---|---|
| Primärtext Nds. Mieterschutz-VO 2024 und Änderung 2025 inkl. § zur Kündigungssperrfrist und Anlage (Gemeindeliste) | nicht gefunden (Host `verkuendung-niedersachsen.de` gesperrt); Werte nur B |
| Primärtext § 250-VO NDS (Nr. 91/2025) und Ausfertigungsdatum 27.11.2025 | nicht gefunden (nur B/C) |
| Samtgemeinde-Details NDS am VO-Text | nicht gefunden |
| Bremer Texte (Mietenbegrenzungs-VO, Kappungsgrenzen-VO, § 201a-Änderung, GrESt-Gesetz) | nicht gefunden (403/Allowlist); Beschlussdaten nur B/C |
| Bremer Kappungsgrenzen-VO: eindeutiges Ausfertigungsdatum (06.08. vs. 16.08.2024) | nicht gefunden |
| Verlängerung der NRW-BaulandmobilisierungsVO über 31.12.2026 | nicht gefunden |
| Anlage 1 (95 Gemeinden) der NRW-BaulandmobilisierungsVO | Datei gelesen (https://recht.nrw.de/system/files/BA/50509-47915-sgv_231_20221221_1_anlage1.pdf), hier nicht ausgewertet (für Mieterschutz nicht erforderlich) |
| NDS-Gesetz zur Grunderwerbsteuer (Wortlaut) | nicht gefunden |

## 8. Spielmodell-Hinweise (DESIGN)

- Flag je Gemeinde: `mietpreisbremse`, `kappung15`, `kuendsperre_jahre` (NDS 5, NRW 8, HB 3), `umwandlung250` (nur NDS-57), `gueltig_bis` je Regelung; Samtgemeinde als Gebietsebene.
- Parameter bis Bestätigung der NDS/HB-Primärtexte als ABGELEITET/GESCHÄTZT führen (Quelle B), NRW und GrESt NRW als BELEGT.
- Ablaufdatum NRW-§ 201a-VO (31.12.2026) im Szenarioablauf berücksichtigen.
