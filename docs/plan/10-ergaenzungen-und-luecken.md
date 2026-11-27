# 10 – Ergänzungen, Entscheidungen und neue Lücken (Stand 27.11.2026)

> Ergebnis der Durchsicht von 00–08 nach deinen Vorgaben (Fokusländer, Gendern). Ergänzt, ändert 00–08 aber nur dort, wo unten ausdrücklich vermerkt.
> Fachwerte stehen in `09-fokuslaender.md`; Fragen an dich in `../RUECKFRAGEN.md`.

---

## 1. Neu entschieden (durch dich, 27.11.2026)

| # | Entscheidung | Konsequenz |
|---|---|---|
| E7 | **Fokusländer: Niedersachsen, Nordrhein-Westfalen, Bremen** (löst O9 ab) | P2/Strang W härtet Daten und Regeln zuerst für diese drei Länder; **Sachsen entfällt** aus der Fokusliste (`06` P2, `05` §6.2). Alle übrigen Länder bleiben im Spiel, aber mit Status GESCHÄTZT und ohne Regionalregeln (Fallback: Bundesregeln + Hinweis „Landesregeln nicht hinterlegt“). |
| E8 | **Kein Gendern.** Normale Schreibweise ohne Sonderzeichen (kein Stern, Doppelpunkt, Binnen-I); Personenbezeichnungen im üblichen generischen Maskulinum oder, wo ohne Verrenkung möglich, neutral („Mietinteressenten“, „Person“). | Löst Punkt 5.2 in `03-ux-ui.md` ab (Zeile „Inklusiv, ohne Gendersonderzeichen …“ ist zu ersetzen durch „keine Gender-Sonderzeichen; neutral formulieren, wo natürlich“). Persona-Namen („Lena, 29“) bleiben. |

## 2. Von mir entschieden (Standard, jederzeit änderbar)

| # | Offener Punkt | Entscheidung | Begründung |
|---|---|---|---|
| D1 | WEG-Stimmrecht (LR-42) | **Kopfprinzip** als Standard (§ 25 Abs. 2 WEG, gesetzlicher Regelfall); Wertprinzip/MEA nur als Variante der Teilungserklärung eines Objekts (`[DES]`, im Exposé erkennbar) | gesetzlicher Regelfall; MEA-Standard wäre sachlich falsch |
| D2 | Nachbeleihung/Cash-out (LR-20) | optionale **Profi-Mechanik ab P5**, als `[DES]` gekennzeichnet, ausschaltbar | im Vault unbelegt |
| D3 | Schrift (03, Punkt 1) | Inter (OFL) bleibt Standard; Entscheidung in P0 per Lizenzvermerk festhalten | geringe Wirkung |
| D4 | Telemetrie (03, Punkt 4) | **aus**, wie O16; später Opt-in für anonyme Spieldaten prüfen | Privatsphäre, R16 |
| D5 | ESt-Tarif 2026 (LR-21) | **geprüft gegen § 32a (27.11.2026)**, kann als `[BEL]` in den Vault (Batch W-A5) | schließt Kernlücke für P4 |

Offen für dich: nur das, was in `RUECKFRAGEN.md` steht.

## 3. Neu gefundene Plan-Lücken

Nicht in 00–08 ausgearbeitet. Priorität: **K** = vor der genannten Phase zwingend, **S** = sollte, **O** = optional.

| ID | Lücke | Warum nötig | Phase | Prio | Wo ausgearbeitet |
|---|---|---|---|---|---|
| G-01 | **Fokusländer-Steckbriefe** (Regeln, Daten, Quellen, Besonderheiten je Land) | E7; bisher nur Vault-Rechtsmatrix für Bremen/Umland | P2 | K | `09` §2–5 |
| G-02 | **Kuratierte Referenzregionen** (ca. 30 Kreise/Städte mit Archetyp) | 12.588 Gebiete sind zu viel für Tests, Balancing und Lernpfad-Orte | P2/P3 | K | `09` §6 |
| G-03 | **Objektarchetypen je Region** (Bremer Haus, Zechenhaus, Gründerzeit, 60er-Block …) | Angebotsgenerator (02 §2.3) kennt nur Objektart und Baujahr, nicht die regionale Prägung | P3 | S | `09` §7 |
| G-04 | **Datenbedarf je historischem Szenario** (H1–H4): Zeitreihen, Regelstände, Regionen | 01 §4.2 nennt Szenarien und grobe Datenbasis, nicht Regelstände und Regionalbezug je Szenario | P6 | S | `09` §9 |
| G-05 | **Exposé-Textbausteine / Content-Pipeline** (Makler-Sprache, „Übersetzer“-Funktion, Variantenzahl, Qualitätsprüfung) | Exposé-Texte tragen den Lerneffekt der Aufdeckung; bisher nur Struktur | P3 | S | offen (Spezifikation als erstes P3-Paket vorschlagen) |
| G-06 | **Glossar-Inhaltsliste** (ca. 150 Begriffe, Quelle: Vault) | S-34 verlangt Vollständigkeit ohne tote Links | P3 | S | offen; Begriffsliste aus Vault-Aliasen ableiten (mechanisch, Haiku) |
| G-07 | **Usability-Testplan** (Aufgaben, Rekrutierung, Messgrößen für Test 1–3) | R4/R5 verlassen sich darauf | P3 | S | offen |
| G-08 | **Rechtstext-Entwürfe** (Impressum, Datenschutz, Nutzungshinweis „Lernspiel, keine Beratung“) | Pflicht vor jedem öffentlichen Zugang (P8) | P8 | S | offen; Rechtsprüfung durch dich/Anwalt |
| G-09 | **Datenpflege-Takt** (Jahreswechsel, Hebesätze, Mietspiegel-Updates, Verordnungsverlängerungen) | Rechtsstand R3; Verordnungen laufen 2029 aus | laufend | S | `09` §10 |
| G-10 | **Kosten-/Betriebsmodell** (Hosting, Domain, evtl. Stores) | O11/O18 | P8 | O | offen |

## 4. Unstimmigkeiten zwischen den Plänen (zum Nacharbeiten)

| Fundstelle | Befund | Vorschlag |
|---|---|---|
| `06-roadmap.md` P2, Strang W | „Bremen, Niedersachsen, NRW, Sachsen“ | erledigt (auf drei Länder gekürzt) |
| `05-daten-und-wissen.md` §6.2 | Fokusländer-Bezug unspezifisch | offen: Verweis auf `09` beim nächsten Überarbeiten |
| `03-ux-ui.md` 5.2, Offene Punkte (3) | Gender-Regel offen | erledigt (E8, in 03 eingetragen) |
| `08` O9 | als offen/fett geführt | erledigt |
| `00-MASTERPLAN.md` §10 | Dokumentenkarte kennt 09/10 nicht | ergänzt |
| `docs/UEBERGABE.md` | Stand, offene Punkte | aktualisiert |

(Die inhaltliche Querlese-Prüfung von 02/03 gegen 00/01/04/06 ist noch nicht gemacht – siehe `RUECKFRAGEN.md` Q1.)

## 5. Entscheidungen aus dem Querlesen 02/03 (Standard, ohne Rückfrage; Bericht `../berichte/querlese-02-03.md`)

10 Widersprüche wurden direkt behoben, 19 waren offen. Für die offenen gilt bis zu deinem Widerspruch:

| Fall | Entscheidung | Umsetzen in |
|---|---|---|
| O-1 `rulesVersion` | **`rulesVersion` = Rechtsjahrgang** (00/01/04); die Engine-/Pipeline-Version in 02 heißt **`engineVersion`** | 02 §1.7, ADR 0009 (P0) |
| O-2 Krisenmodell | 02 §2.17 (GRÜN…SCHWARZ, Reichweite in Monaten) ist **technische Quelle**; 03 §3.6 übernimmt die Stufen und Schwellen; Euro-Puffer (01) nur als Startwert-Hilfe | 03 §3.6 (P3) |
| O-3 Telemetrie | **aus** bis P8; Opt-in frühestens danach; Schalter in S-04 erst dann | 03 |
| O-4 Storybook | optional (04 gilt); Komponentenkatalog über Playwright-Screens | 03 §4.8 |
| O-5 Tagebuch | P6 (06 gilt) | 03 §1.1/§8 |
| O-6 Steuer in P3 | **keine** Steuerrechnung in P3 (06 gilt); Onboarding-Beispiel ohne „nach Steuern“ | 03 §3.8.2 |
| O-7 Splitting S2 | in P3 nur Profildaten, Wirkung ab P4/P5 | 01 §5.2 Hinweis |
| O-8 Zeit | **Aktionspunkte (AP)** maßgeblich; Anzeige in Stunden entfällt | 01 §6 |
| O-9 Teilkrise P3 | als Vorstufe erlaubt (Dispo, Rücklastschrift); 06 um Hinweis ergänzen | 06 P3 |
| O-12/18 Onboarding P3 | Onboarding K2 mit **Skript-Platzhaltern** für Suchauftrag, Checkpoint, Review; eigenes Arbeitspaket „3.x Onboarding-Szenario“ in 06 ergänzen | 06, 03 §3.8.1 |
| O-14 Standardregion | Persona S1 und Test-Fixture: **Stadt Bremen** (R01) statt Leipzig | 03 S-02 |
| O-15 „die Spielerin“ | auf „du“/neutral umformulieren (E8) | 03 |
| O-19 M16 | entfällt | 02 §2.18 |
| O-10, O-11, O-13, O-16, O-17 | offen bis P0 bzw. P3-Planung (Komponentenspezifikation K-02/28/29, Stufe↔Kapitel, Konten, Phasenzuordnung S-14/S-27, Replay-Lader-Formulierung) | – |

Diese Anpassungen sind **beschlossen, aber noch nicht in 02/03/06 eingearbeitet** (sonst Gefahr neuer Brüche); sie gehören in ein Sonnet-Arbeitspaket „Plan-Konsolidierung“ vor P0.
