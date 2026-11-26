# 11 – Fachspezifikation Steuern, Rechtsformen, Recht & regionale Regeln (aus dem IC-Vault)

> Zweck: Umsetzbare Fachgrundlage für (a) eine **Steuer-Engine** (Privatperson und
> vermögensverwaltende GmbH/Holding) und (b) ein **Regel-/Regulierungsmodell** für das
> Immobilien-Investment-Simulationsspiel. Grundlage ist ausschließlich der Obsidian-Vault
> `/home/user/IC` (nur gelesen). Ausgewertet am 26.11.2026.
>
> Das Spiel ist ein Trainingswerkzeug und **keine Steuer- oder Rechtsberatung** (siehe Abschnitt 6.3).

---

## 0. Lesehilfe, Quellenlage und Kennzeichnungen

### 0.1 Kennzeichnungen in diesem Dokument

| Marker | Bedeutung |
|---|---|
| `[[Notiz]]` | Wikilink auf die Vault-Notiz, aus der der Wert stammt |
| **LÜCKE** | Der Vault gibt den Wert/die Regel nicht her. Nicht im Spiel als Fakt darstellen. |
| **WIDERSPRUCH** | Vault-Quellen widersprechen sich (Details in Abschnitt 7) |
| **ANNAHME (Design)** | Vereinfachung oder Spielbalance-Wert, **kein** Fachwert aus dem Vault. Muss im Spiel als Vereinfachung erkennbar sein. |
| `gueltigkeit` | Feld aus dem Frontmatter. Vault-Spezifikation v2: `aktuell` / `historisch` / `zukuenftig` / `unbekannt`. Den Wert `pruefen` gibt es in v2 nicht mehr; ob eine Prüfung fällig ist, wird aus `geprueft_am + pruef_intervall` berechnet ([[Vault-Spezifikation]] 4.1). Die ältere [[Vault-Regeln]] nennt noch `pruefen` – die Spezifikation hat Vorrang. |
| `stand` | Inhaltlicher Rechts-/Datenstand der Notiz |
| Sicherheit A/B/C | A = Primärquelle geprüft, B = datierte Sekundärquelle, C = Anbieterquelle/undatiert/abgeleitet ([[Vault-Spezifikation]] 4.1) |

### 0.2 Quellenlage – das Wichtigste vorab

1. **Alle 17 Steuer- und 6 Rechtsform-Notizen** haben `status: entwurf` und `gueltigkeit: unbekannt`.
   Nur [[Beteiligungsprivileg]] hat ein `geprueft_am` (2026-09-30). Für alle anderen ist die Prüfung
   nach Spezifikation **fällig** (leeres `geprueft_am`).
2. Hauptquellen sind **immocation-Blog/Podcast (Stufe 5, Sicherheit C)**, überwiegend Stand 2020/2021,
   die Podcasts 2025/2026 nur als Episodenbeschreibung/Kapitelmarken (kein Audio-Inhalt).
   Der Sprecher (Steuerberater Martin Richter) bietet kostenpflichtige Beratung/Webinare an –
   die Notizen weisen das jeweils aus.
3. Aktuelle Zahlen (AfA-Staffel, 15-%-Grenze, Freigrenze § 23, Kürzungsgrenzen) stammen aus dem
   internen Recherchebericht [Q-Interne-Recherche-Vault-Tiefenrecherche-2026-09-27] (Stufe 5, C).
   Laut [[Vault-Spezifikation]] 7.2 sind interne Recherchen „keine Wissensquelle“ – die Werte sind
   also Arbeitsstand, nicht primärquellengeprüft. Ausnahmen mit Gesetzestext-Prüfung: § 8b Abs. 4
   KStG und § 9 Nr. 2a GewStG ([[Beteiligungsprivileg]]), § 656b/§ 656c BGB ([[Kaufnebenkosten]],
   Sicherheit A), BFH II R 49/17 ([[Kaufnebenkosten]]).
4. **`20-Regeln/` ist leer**, `40-Daten/regeln-index.csv` enthält **nur die Kopfzeile**,
   [[Regel-Uebersicht]] meldet „Noch keine Regeln erfasst“. Regionale Regelwerte stehen derzeit nur
   in [[Regionale-Rechtsmatrix]], [[Mieterhoehung]], [[Kaufnebenkosten]] und in der Sicherung
   `99-Pflege/berichte/regelwerte-alt.csv` (118 Zeilen aus früheren Standortnotizen, vorgesehen für
   Phase P6 „Regeln herauslösen“, laut `99-Pflege/berichte/Verbesserungsplan-v2.md` noch nicht erfolgt).
5. Konsequenz: **Die Struktur einer Steuer-Engine ist belegbar, viele Parameterwerte nicht.** Jeder
   Parameter braucht im Spiel ein Status-Flag (Abschnitt 5).

---

## 1. Steuer-Engine Privatperson (Einkünfte aus Vermietung und Verpachtung)

### 1.1 Datenfluss je Steuerjahr (Überblick)

```text
für jedes Steuerjahr j:
  für jedes Objekt o im Privatvermögen:
    einnahmen[o,j]      = Zuflüsse im Jahr j                         // [[Zufluss-und-Abflussprinzip]]
    wk_sofort[o,j]      = sofort abziehbare Werbungskosten (Abfluss j) // [[Werbungskosten-bei-Vermietung]]
    afa[o,j]            = Absetzung für Abnutzung                     // [[AfA]]
    ergebnis_vv[o,j]    = einnahmen − wk_sofort − afa                 // [[Steuerliches-Ergebnis]]
  ergebnis_vv[j]        = Σ_o ergebnis_vv[o,j]                        // Anlage V je Objekt → [[Anlage-V]]
  pvg[j]                = private Veräußerungsgewinne (§ 23 EStG)     // [[Spekulationsfrist]]
  steuerwirkung[j]      = f(ergebnis_vv[j], pvg[j], übriges_einkommen, grenzsteuersatz)  // [[Grenzsteuersatz]]
  cashflow_n_st[j]      = cashflow_v_st[j] − steuerwirkung[j]         // [[Cashflow-vor-und-nach-Steuern]]
```

Grundprinzip laut [[Steuerliches-Ergebnis]] (stand 2021-02, gueltigkeit unbekannt): Besteuert wird der
**Überschuss der Einnahmen über die Werbungskosten einschließlich AfA und Schuldzinsen**; Tilgung wird
nicht abgezogen; das Ergebnis wird zum übrigen Einkommen addiert und mit dem persönlichen Steuersatz
belastet. Rechtsgrundlage laut Notiz: § 9 EStG, § 21 EStG.

**Zentrale Abgrenzung für die Engine** ([[Steuerliches-Ergebnis]], [[Cashflow-vor-und-nach-Steuern]]):

| Posten | mindert Cashflow | mindert steuerliches Ergebnis |
|---|---|---|
| Schuldzinsen | ja | ja |
| Tilgung | ja | **nein** |
| AfA | **nein** | ja |
| laufende Kosten | ja | ja (als Werbungskosten) |
| geplante Rücklagenzuführung | separat ausweisen | **nein** – steuerlich erst bei tatsächlichem Aufwand |

### 1.2 Einnahmen (Zufluss)

Quelle: [[Zufluss-und-Abflussprinzip]] (stand 2021-02, gueltigkeit unbekannt, § 11 EStG), [[Anlage-V]].

```text
einnahmen[o,j] = Σ zahlungen_eingegangen_in_j(o, typ ∈ {kaltmiete,
                                                       nk_vorauszahlung,
                                                       nk_nachzahlung})
// Maßgeblich ist das Zahlungsdatum, nicht der wirtschaftliche Zeitraum:
// eine NK-Nachzahlung für j−1, die in j eingeht, zählt in j.
```

- Nebenkostenvorauszahlungen der Mieter zählen **zu den Einnahmen**, obwohl sie wirtschaftlich
  durchgereicht werden ([[Zufluss-und-Abflussprinzip]]). Die bezahlten Betriebskosten stehen dann auf
  der Werbungskostenseite (laufende Kosten in [[Cashflow-vor-und-nach-Steuern]]).
- Selbstnutzung: keine Vermietungseinkünfte, keine abziehbaren Kosten ([[Anlage-V]]).
- **LÜCKE:** Ausnahmen/Sonderfälle des § 11 EStG (z. B. Zahlungen um den Jahreswechsel) – im Vault
  nicht beschrieben (Backlog „Zufluss- und Abflussprinzip“).
- **LÜCKE:** verbilligte Vermietung an Angehörige, Liebhaberei/Überschusserzielungsabsicht – nicht im Vault.

### 1.3 Werbungskosten (Abfluss)

Quelle: [[Werbungskosten-bei-Vermietung]] (stand 2021-02, gueltigkeit unbekannt, § 9 EStG).

| Kategorie im Spiel | Behandlung | Beleg |
|---|---|---|
| Schuldzinsen | sofort abziehbar (Abfluss) | [[Werbungskosten-bei-Vermietung]], [[Steuerliches-Ergebnis]] |
| laufende Objektkosten (bezahlte Betriebskosten, nicht umlagefähige Kosten, Verwaltung) | sofort abziehbar | [[Cashflow-vor-und-nach-Steuern]] („laufende Kosten … als Werbungskosten“) |
| Steuerberatungskosten | sofort abziehbar | [[Werbungskosten-bei-Vermietung]] |
| Fahrtkosten (Eigentümerversammlung, Mieter) | sofort abziehbar; Dokumentation nötig | [[Werbungskosten-bei-Vermietung]]; **LÜCKE:** Pauschalsätze |
| Sanierungs-/Erhaltungskosten | sofort abziehbar, **außer** 15-%-Fall (1.5) | [[Werbungskosten-bei-Vermietung]], [[Anschaffungsnahe-Herstellungskosten-15-Prozent]] |
| Maklergebühren | Quelle listet sie als Ausgabe; ob beim **Erwerb** sofort abziehbar oder Anschaffungskosten: **LÜCKE / offen** | [[Werbungskosten-bei-Vermietung]] (Offene Fragen) |
| Kaufnebenkosten (Notar, Grundbuch, GrESt) | **LÜCKE / offen**: ob Teil der AfA-Bemessungsgrundlage | [[AfA-Bemessungsgrundlage]] (Offene Fragen) |
| Kaufpreis Gebäude | nur über AfA | [[Werbungskosten-bei-Vermietung]] |
| Kaufpreis Grund und Boden | gar nicht | [[AfA-Bemessungsgrundlage]] |
| Tilgung | nicht abziehbar | [[Werbungskosten-bei-Vermietung]] |
| Rücklagenzuführung (eigene Instandhaltungsreserve) | nicht abziehbar, erst bei tatsächlichem Aufwand | [[Cashflow-vor-und-nach-Steuern]] |
| WEG-Hausgeld inkl. Erhaltungsrücklage | **LÜCKE** – steuerliche Behandlung im Vault nicht beschrieben | – |
| Abziehbare Vorsteuer (bei USt-Option) | keine Kosten, durchlaufender Posten | [[Vorsteuer]] |

**ANNAHME (Design) für MVP:** Makler und übrige Kaufnebenkosten werden anteilig (Gebäudeanteil) der
AfA-Bemessungsgrundlage zugeschlagen, der Bodenanteil bleibt unberücksichtigt. Das ist eine
Spielvereinfachung, bis die offene Vault-Frage geklärt ist; im Spiel mit „Vereinfachung“ kennzeichnen.

### 1.4 AfA (Absetzung für Abnutzung)

Quellen: [[AfA]] (stand 2026-09-27, gueltigkeit unbekannt, § 7 Abs. 4 und Abs. 5a EStG),
[[AfA-Bemessungsgrundlage]] (stand 2021-02), [[Kaufpreisaufteilung]] (stand 2026-09),
[[Restnutzungsdauergutachten]] (stand unbekannt).

#### 1.4.1 Bemessungsgrundlage und Kaufpreisaufteilung

```text
afa_bmg[o] = anschaffungskosten[o] − anteil_grund_und_boden[o]       // [[AfA-Bemessungsgrundlage]]
           (+ aktivierte anschaffungsnahe Herstellungskosten, siehe 1.5)
           (+ Kaufnebenkosten-Gebäudeanteil: LÜCKE → ANNAHME (Design), siehe 1.3)

gebaeudeanteil_quote = afa_bmg / anschaffungskosten
```

- Nur der Gebäudeanteil wird abgeschrieben; Grund und Boden nutzt sich nicht ab ([[AfA]]).
- Ein höherer Gebäudeanteil erhöht die AfA dauerhaft ([[Kaufpreisaufteilung]]); die Aufteilung im
  **Kaufvertrag** ist ein eigenes Gestaltungskapitel (Podcast #625 laut [[Kaufpreisaufteilung]]).
  Typischer Fehler: Aufteilung allein dem Finanzamt überlassen.
- Die Aufteilung muss **sachgerecht** sein; das Finanzamt kann unangemessene Aufteilungen verwerfen
  ([[Kaufpreisaufteilung]], „Worauf achten“).
- **LÜCKE:** Grenzen einer zulässigen Aufteilung, BMF-Arbeitshilfe, BFH-Rechtsprechung, Methode zur
  Bodenwertermittlung (Bodenrichtwert × Fläche o. Ä.) – nicht im Vault.
- **ANNAHME (Design):** Das Spiel ermittelt einen „Referenz-Bodenanteil“ aus den Objektdaten
  (Bodenrichtwert × Grundstücksanteil, sobald Datenpunkte `brw_wohnen` vorliegen) und lässt den
  Spieler eine vertragliche Aufteilung wählen. Weicht sie stark ab, steigt ein Prüfrisiko
  (Betriebsprüfungs-Ereignis, Abschnitt 4). Schwellen und Wahrscheinlichkeit sind Designwerte.

#### 1.4.2 AfA-Satz nach Fertigstellung

Laut [[AfA]] (Systematik des § 7 Abs. 4 EStG nach Recherchebericht, Sicherheit C, gueltigkeit unbekannt):

| Fertigstellung des Gebäudes | linearer Satz | Nutzungsdauer (rechnerisch 100/Satz) |
|---|---|---|
| vor 1925 | 2,5 % p. a. | 40 Jahre |
| 1925 bis 2022 | 2 % p. a. | 50 Jahre |
| nach 2022 | 3 % p. a. | 33⅓ Jahre |
| qualifizierte neue Wohngebäude, alternativ degressiv (§ 7 Abs. 5a EStG) | 5 % | „unter weiteren Voraussetzungen“ – **LÜCKE** |
| bestimmte Betriebsgebäude | eigene Regeln | **LÜCKE** |

Historischer Wert: [Q-immocation-Blog-3-wichtigste-Steuertipps] (01.02.2021) nennt pauschal 2 % /
50 Jahre für „Baujahr nach 1925“ – **WIDERSPRUCH** zur heutigen Staffel (Abschnitt 7).

```text
function afa_satz(o):
  if o.rnd_gutachten.anerkannt:                       // [[Restnutzungsdauergutachten]]
      return 1 / o.rnd_gutachten.restnutzungsdauer_jahre
  if o.afa_methode == "degressiv_5a":                 // Voraussetzungen + Rechenweg: LÜCKE
      return NICHT_IMPLEMENTIERT                      // MVP: Option ausgegraut, Tooltip „Vault unvollständig“
  if o.fertigstellungsjahr >= 2023: return 0.03       // [[AfA]]
  if o.fertigstellungsjahr >= 1925: return 0.02
  return 0.025

function afa(o, j):
  basis = o.afa_bmg
  roh   = basis × afa_satz(o) × zeitanteil(o, j)       // zeitanteil: LÜCKE → ANNAHME (Design): monatsgenau ab NLW
  return min(roh, restbuchwert(o, j))
```

- **Restnutzungsdauergutachten:** Eine nachgewiesene kürzere Restnutzungsdauer erhöht die jährliche AfA,
  ändert aber nicht die Bemessungsgrundlage ([[Restnutzungsdauergutachten]]). Anerkennung hängt von
  Rechtsprechung/Verwaltungspraxis ab. **LÜCKE:** Anerkennungskriterien, Gutachterkosten.
  **ANNAHME (Design):** Gutachten kostet einen Designbetrag und wird mit Designwahrscheinlichkeit
  anerkannt; Ablehnung = Rückfall auf gesetzlichen Satz.
- **LÜCKE:** Zeitanteil im Erwerbs- und Veräußerungsjahr, Sonder-AfA § 7b EStG (Backlog
  „Neubau-Sonder-AfA“), Denkmal-/Sanierungsgebiets-AfA (§§ 7h, 7i EStG; § 10f EStG nur als
  Backlog-Hinweis „im Vault nicht erfasst“).

### 1.5 Anschaffungsnahe Herstellungskosten (15 % / 3 Jahre)

Quelle: [[Anschaffungsnahe-Herstellungskosten-15-Prozent]] (Titel „15-Prozent-Grenze“, stand 2026-09-27,
gueltigkeit unbekannt, § 6 Abs. 1 Nr. 1a EStG).

Regel laut Notiz: Instandsetzungs- und Modernisierungsaufwendungen, die **innerhalb von drei Jahren nach
Anschaffung** anfallen und **ohne Umsatzsteuer 15 % der Gebäude-Anschaffungskosten übersteigen**, sind
grundsätzlich anschaffungsnahe Herstellungskosten. Vergleichsgröße ist **nicht** der Gesamtkaufpreis.
Erweiterungen und jährlich üblicherweise anfallende Erhaltungsarbeiten sind gesetzlich ausgenommen.

```text
schwelle[o]     = gebaeude_anschaffungskosten[o] × 0.15                    // Gebäudeanteil!
fenster[o]      = [anschaffung[o], anschaffung[o] + 3 Jahre]               // Stichtag: LÜCKE (Vertrag vs. NLW)
massgeblich[o]  = Σ netto(aufwand) für aufwand in fenster[o]
                   wenn aufwand.typ ∈ {instandsetzung, modernisierung}
                   und aufwand.typ ∉ {erweiterung, jaehrlich_uebliche_erhaltung}
if massgeblich[o] > schwelle[o]:                                            // „übersteigen“: 30.000 ≤ 30.000 ok, 30.001 nicht
    umklassifizieren(alle maßgeblichen Aufwendungen im Fenster → herstellungskosten)
    afa_bmg[o] += massgeblich[o]                                            // Rechtsfolge über Verweis auf [[AfA]]; s. u.
else:
    sofort_abziehbar
```

Rechenbeispiel des Vaults: 200.000 EUR Gebäude-Anschaffungskosten → Schwelle 30.000 EUR netto;
30.001 EUR übersteigen sie.

- Die Notiz verweist für die „steuerliche Behandlung anschaffungsnaher Herstellungskosten“ auf [[AfA]];
  die Aktivierung in die AfA-Basis ist dort **nicht ausdrücklich ausformuliert** → in der Engine als
  fachlich naheliegend, aber prüfbedürftig markieren.
- **LÜCKE:** Rückwirkung, wenn die Schwelle erst im dritten Jahr überschritten wird (Korrektur bereits
  erklärter Jahre); Zuordnung mehrerer Rechnungen/Zeitpunkte; maßgeblicher Stichtag
  ([[Nutzen-Lasten-Wechsel]] nennt die Frage ausdrücklich als offen).
- **ANNAHME (Design):** Die Engine bucht Erhaltungsaufwand im Fenster zunächst vorläufig sofort ab und
  korrigiert bei Überschreiten rückwirkend (Ereignis „Steuerbescheid geändert“ mit Nachzahlung). Das
  macht die Lernwirkung sichtbar („Fallstudie Dominik plante vor dem Kauf, die Grenze nicht zu
  überschreiten“, [[Fallstudie-Dominik-Neunkirchen]]).

### 1.6 Nutzen-Lasten-Wechsel und Zeitpunkte im Kaufprozess

Quelle: [[Nutzen-Lasten-Wechsel]] (stand unbekannt, gueltigkeit unbekannt), [[Regionale-Rechtsmatrix]].

| Datum im Kaufprozess | Wirkung in der Engine | Beleg |
|---|---|---|
| Beurkundung (Kaufvertrag) | **Grunderwerbsteuersatz** am Tag der Beurkundung | [[Regionale-Rechtsmatrix]] |
| Nutzen-Lasten-Wechsel | ab hier stehen Mieten dem Käufer zu, er trägt die Kosten; steuerliche Zuordnung richtet sich danach | [[Nutzen-Lasten-Wechsel]] |
| Grundbucheintragung | nicht verwechseln mit den beiden anderen Terminen | [[Nutzen-Lasten-Wechsel]] |
| „Anschaffung“ für 3-Jahres-Fenster und 10-Jahres-Frist | **LÜCKE** – welcher Stichtag gilt, erläutern die Quellen nicht | [[Nutzen-Lasten-Wechsel]], [[Spekulationsfrist]] |

**ANNAHME (Design):** Fristbeginn = Datum Kaufvertrag für § 23, NLW für AfA-Beginn und
Einnahmen-/Kostenzuordnung; im Spiel als „vereinfachte Annahme“ kennzeichnen.

### 1.7 Einkommensteuer, Grenzsteuersatz, Tarif

Quelle: [[Grenzsteuersatz]] (stand 2021-02, gueltigkeit unbekannt, Rechtsgrundlage genannt: § 32a EStG,
Solidaritätszuschlaggesetz), [[Cashflow-vor-und-nach-Steuern]].

- Vermietungseinkünfte werden zum Arbeitseinkommen addiert; maßgeblich ist der Satz auf den
  „obersten Euro“ ([[Grenzsteuersatz]]).
- Werte im Vault: **30–45 % je nach Einkommen** ([Q-immocation-Blog-3-wichtigste-Steuertipps],
  02/2021) und **42 % „inklusive Solidaritätszuschlag“** bei hohem Einkommen
  ([Q-immocation-Blog-Steuerberater-Tricks], 11/2020) – **WIDERSPRUCH** (die Notiz erklärt die
  Soli-Angabe als unpräzise).
- **LÜCKE:** § 32a-Tarif (Zonen, Grundfreibetrag, Formel), Solidaritätszuschlag, Kirchensteuer,
  Zuordnung Einkommen → Grenzsteuersatz.

Engine-Variante A (MVP, vault-konform):

```text
// [[Cashflow-vor-und-nach-Steuern]]: Näherung, vernachlässigt Soli und Kirchensteuer
steuerwirkung[j] ≈ (ergebnis_vv[j] + steuerpflichtiger_pvg[j]) × grenzsteuersatz_spieler
// grenzsteuersatz_spieler: Avatar-Parameter, wählbar aus dem Vault-Korridor 30 %…45 %
//                          (Stand 2020/2021, gueltigkeit unbekannt); Default z. B. 42 % (Vault-Beispiel)
```

Engine-Variante B (Ausbaustufe, erst nach Recherche):

```text
est(zve)          = tarif_32a(zve)                 // LÜCKE: Tarifformel nicht im Vault
steuerwirkung[j]  = est(übriges_einkommen + ergebnis_vv + pvg) − est(übriges_einkommen)
                    + soli(...) + kirchensteuer(...)   // LÜCKE
```

- **ANNAHME (Design):** Steuerwirkung wird kassenwirksam im Folgejahr (Erstattung/Nachzahlung nach
  Veranlagung). Timing im Vault nicht beschrieben (**LÜCKE**: Vorauszahlungen). Der Vault-Rat
  „großzügig planen und sich nicht zu sehr über die Steuererstattung freuen“
  ([[Steuerliches-Ergebnis]], Podcast #625) eignet sich als Tooltip.

### 1.8 Verlustverrechnung

- Belegt: Ein negatives steuerliches Ergebnis (etwa durch hohe AfA und Zinsen in den ersten Jahren)
  **mindert die Steuer auf das übrige Einkommen**; der Cashflow nach Steuern ist dann höher
  ([[Cashflow-vor-und-nach-Steuern]], [[Steuerliches-Ergebnis]]).
- Belegt: Die AfA-Wirkung ist zeitlich begrenzt, der Zinsanteil sinkt → Cashflow nach Steuern
  verschlechtert sich über die Jahre meist ([[Cashflow-vor-und-nach-Steuern]]).
- **LÜCKE:** Verlustvortrag/-rücktrag (§ 10d EStG), Grenzen bei geringem übrigen Einkommen,
  Verluste aus privaten Veräußerungsgeschäften, Liebhaberei.

```text
// MVP (Variante A): Verlust wird vollständig mit übrigem Einkommen verrechnet.
// Schutz: wenn übriges_einkommen + ergebnis_vv < 0 → Warnhinweis „Vereinfachung: Verlustvortrag
// nicht modelliert (Vault-Lücke)“ und Erstattung auf Steuer des übrigen Einkommens begrenzen
// (ANNAHME (Design)).
```

### 1.9 Spekulationsfrist / private Veräußerungsgeschäfte (§ 23 EStG)

Quelle: [[Spekulationsfrist]] (stand 2026-09-27, gueltigkeit unbekannt, § 23 EStG).

```text
function verkauf_privat(o, veraeusserung_datum, erloes):
  if o.im_betriebsvermoegen or o.eigentuemer ist Gesellschaft:
      → andere Besteuerung (siehe Abschnitt 2); § 23 „gilt nicht in gleicher Weise“
  haltedauer = veraeusserung_datum − o.anschaffung_datum      // bei unentgeltlichem Erwerb ggf.
                                                              // Anschaffungsdatum des Rechtsvorgängers
  if haltedauer > 10 Jahre: return steuerfrei_nach_23
  if eigennutzung_ausnahme(o): return steuerfrei_nach_23
      // ausschließlich eigene Wohnzwecke zwischen Anschaffung/Fertigstellung und Veräußerung
      // ODER im Veräußerungsjahr und den beiden vorangegangenen Kalenderjahren
      // (keine pauschale Mindestwohndauer von drei vollen Jahren)
  gewinn = erloes − (o.anschaffungskosten − Σ abgezogene_afa(o))   // § 23 Abs. 3: AfA mindert AK
           − veraeusserungskosten                                   // LÜCKE: im Vault nicht behandelt
  pvg_summe[jahr] += gewinn

am Jahresende:
  if pvg_summe[jahr] < 1000 EUR: steuerfrei      // FREIGRENZE (nicht Freibetrag) laut Recherchebericht
  else: steuerpflichtig in voller Höhe
```

- Zehn Jahre ist **kein Automatismus**: [Q-immocation-Podcast-627-Steuerguide-Teil-2] hinterfragt, ob
  Warten immer sinnvoll ist; [Q-immocation-Blog-9-Steuerkniffe-beim-Kauf] nutzt die Frist als Argument
  für den Privatkauf bei Wertsteigerungserwartung (**WIDERSPRUCH** in der Gewichtung, Abschnitt 7).
- **LÜCKE: gewerblicher Grundstückshandel** – mehrfach als Prüfpunkt genannt ([[Spekulationsfrist]],
  [[Aufteilung-in-Wohnungseigentum]], [[Fallstudie-Sebastian-Nuernberg]]), aber **keine Kriterien,
  keine Objektgrenze** im Vault. Im Spiel nur als Warnhinweis bei vielen Verkäufen in kurzer Zeit
  (Schwelle = ANNAHME (Design), ausdrücklich nicht als Rechtsgrenze bezeichnen).
- **LÜCKE:** maßgeblicher Stichtag (Kaufvertrag vs. NLW), Verlustverrechnung aus § 23.

### 1.10 Ehegatten-Themen

| Thema | Vault-Inhalt | Engine-Umsetzung | Status |
|---|---|---|---|
| [[Ehegattendarlehen]] | Ehepartner leiht Geld; Zinsen beim Darlehensnehmer als Werbungskosten; Anerkennung nur bei Fremdvergleich | Option „Darlehen vom Partner“: Zinsen = WK beim Vermieter. Wirkung beim darlehensgebenden Partner (Zinseinnahmen): **LÜCKE** | stand unbekannt, gueltigkeit unbekannt; Quelle nur Kapitelübersicht Podcast #625 |
| [[Ehegattenschaukel]] | Übertragung zwischen Ehegatten → neue, höhere AfA-Bemessungsgrundlage beim Erwerber; rechtlich heikel (Gestaltungsmissbrauch, BFH) | Nur als Lern-/Risiko-Karte; keine automatische Steuerersparnis ohne Prüfungs-Ereignis. Folgen für § 23-Frist: **LÜCKE** | stand 2026-09, gueltigkeit unbekannt |
| Zusammenveranlagung/Splitting | nicht im Vault | – | **LÜCKE** |

### 1.11 Umsatzsteuer und Vorsteuer bei Gewerbevermietung

Quellen: [[Umsatzsteuerpflichtige-Vermietung]] (stand 2021-05, gueltigkeit unbekannt, § 4 Nr. 12, § 9,
§ 15a UStG), [[Vorsteuer]] (stand 2021-05, § 15a UStG).

```text
// Grundsatz: Vermietung ist umsatzsteuerfrei (§ 4 Nr. 12 UStG) → keine USt, kein Vorsteuerabzug
option_moeglich(einheit) = einheit.nutzung == gewerbe
                           and einheit.mieter.nutzt_fuer_vorsteuerabzugsberechtigende_umsaetze
if option_moeglich and spieler_waehlt_option:                       // „Option“ nach § 9 UStG
    ust_ausgang[j] = nettomiete[j] × ust_satz                       // ust_satz: LÜCKE (Vault nennt keinen Satz)
    vst[j]         = Σ vorsteuer(eingangsrechnung) für rechnungen DESSELBEN Objekts  // objektbezogen
    zahllast[j]    = ust_ausgang[j] − vst[j]
    bindung_bis    = option_beginn + 10 Jahre                       // Mieter muss durchgehend
                                                                    // vorsteuerabzugsberechtigende Umsätze ausführen
    on mieterwechsel(neuer mieter ohne VSt-Abzug) vor bindung_bis:
        vorsteuerberichtigung_15a()                                  // Mechanik: LÜCKE
// Einkommensteuer: abziehbare Vorsteuer ist kein Aufwand (durchlaufender Posten)
```

Vault-Beispiel ([[Vorsteuer]]): Vermieter führt 190 EUR USt ab, Mieter holt 190 EUR zurück, Vermieter
zieht 95 EUR Vorsteuer aus Handwerkerrechnung ab → Vorteil 95 EUR. Nettobeträge und Steuersatz nennt die
Quelle nicht.

- **WIDERSPRUCH:** Podcast #627 spricht von „Wohnungen mit Umsatzsteuer“ – bei Wohnraum fehlt
  erkennbar der vorsteuerabzugsberechtigte Mieter ([[Umsatzsteuerpflichtige-Vermietung]]).
  Engine: Option **nur für Gewerbeeinheiten** zulassen.
- **LÜCKE:** USt-Satz, Formerfordernisse/Zeitpunkt der Option, ausgeschlossene Mietergruppen,
  Berichtigungsbetrag nach § 15a UStG.
- **ANNAHME (Design):** Berichtigung = anteilige Rückzahlung der Vorsteuer für die Restlaufzeit
  (Designformel, im Spiel als vereinfacht kennzeichnen).
- Spielwert: Fallbeispiel Stiftung/Industrieareal 8 Mio. EUR – Voreigentümer hatte die Option versäumt;
  Lerninhalt „vor dem Kauf alle Mietverträge auf Optionsfähigkeit prüfen“.

### 1.12 Komplettes Modul (Pseudocode, Privatperson)

```text
module SteuerPrivat(stichtag_jahr j, spieler s):
  for o in s.objekte where o.eigentuemer == s.privat:
     E  = Σ zufluss_j(o, {kaltmiete, nk_vz, nk_nz})
     WK = Σ abfluss_j(o, {zinsen, laufende_kosten, verwaltung, steuerberatung, fahrten})
        + Σ abfluss_j(o, erhaltung) wenn nicht ahk_15(o)                       // 1.5
     A  = afa(o, j)                                                            // 1.4
     ergebnis[o] = E − WK − A
     if o.ust_option: buche_ust(o, j)                                          // 1.11, ertragsteuerlich neutral
  vv = Σ ergebnis[o]
  pvg = pvg_summe[j] if pvg_summe[j] ≥ 1000 else 0                             // 1.9
  steuer_delta = (vv + pvg) × s.grenzsteuersatz                               // 1.7 Variante A
  if s.uebriges_einkommen + vv + pvg < 0: begrenze_erstattung()               // 1.8, ANNAHME (Design)
  plane_zahlung(jahr = j+1, betrag = steuer_delta)                            // ANNAHME (Design)
  protokolliere(werte, wikilinks, stand, gueltigkeit, sicherheit)             // für Tooltips/Transparenz
```

---

## 2. Rechtsformen: vvGmbH, erweiterte Kürzung, Holding

### 2.1 Vergleich der Haltestrukturen (was der Vault belegt)

| Merkmal | Privatperson | vermögensverwaltende GmbH | Holding über vvGmbH |
|---|---|---|---|
| Besteuerung laufender Überschüsse | persönlicher Grenzsteuersatz (Vault: 30–45 %, 42 % bei hohem Einkommen) – [[Grenzsteuersatz]] | Gesellschaftsebene; KSt 15 % (§ 23 KStG) – [[Beteiligungsprivileg]]; Gesamt laut Quelle **15 %** mit erweiterter Kürzung / **30 %** ohne (Stand 2020, unaufgeschlüsselt) – [[Steuersatzgefaelle]], [[Thesaurierung]] | wie vvGmbH; Ausschüttung an Holding zu 95 % steuerfrei – [[Beteiligungsprivileg]] |
| Spekulationsfrist § 23 | ja, 10 Jahre – [[Spekulationsfrist]] | gilt „nicht in gleicher Weise“ – [[Vermoegensverwaltende-GmbH]] | Anteilsveräußerung zwischen Kapitalgesellschaften zu 95 % freigestellt (§ 8b Abs. 2, 3 KStG) – [[Beteiligungsprivileg]] |
| Gewinn privat verfügbar | sofort | erst nach Ausschüttung (weitere Steuer) – [[Thesaurierung]] | Ausschüttung an Holding ≈ 1,5 % Belastung, danach erst an Privatperson – [[Beteiligungsprivileg]] |
| Haftung | privat | Gesellschaft; **aber** private Bürgschaft gegenüber Bank üblich → im Ernstfall doch Privathaftung – [[Vermoegensverwaltende-GmbH]] | wie vvGmbH |
| Transparenzpflichten | Name im Grundbuch | Gesellschaft im Grundbuch, Geschäftsführung im Handelsregister | mehrstufig → Ziel der Transparenzregister-Regel – [[Transparenzregister]] |
| Strukturkosten | – | **LÜCKE** (Gründung, Buchführung, Jahresabschluss nennen die Quellen nicht) | **LÜCKE** |

### 2.2 Vermögensverwaltende GmbH

Quelle: [[Vermoegensverwaltende-GmbH]] (stand 2026-09-27, gueltigkeit unbekannt, § 9 Nr. 1 GewStG, § 23 EStG).

- Keine eigene Rechtsform, sondern gewöhnliche GmbH mit vermögensverwaltender Tätigkeit.
- Zwei Entstehungswege: (1) Privatvermögen wird eingebracht, (2) vvGmbH als Tochter einer [[Holding]].
- **Nicht automatisch gewerbesteuerbefreit** (siehe 2.3); keine automatische Befreiung von KSt oder
  Ausschüttungsbesteuerung.
- Fallbeispiel Martin Richter: erste Wohnung privat (Erzgebirge, 25.000 EUR, 180 EUR Cashflow), dann
  Holding-Struktur mit vvGmbH, darin zwei Wohnungen Chemnitz (72.000 EUR für 120 m² = 600 EUR/m²).
- **LÜCKE:** Gewinnermittlung der GmbH (Bilanzierung statt Zufluss/Abfluss – [[Zufluss-und-Abflussprinzip]]
  nennt nur die Abgrenzung), AfA-Regeln in der GmbH, Mindestkapital, Gründungs-/laufende Kosten,
  Grunderwerbsteuer und § 23-Folgen bei Einbringung bestehender Privatobjekte, Bankfinanzierung der GmbH.

```text
module SteuerVvGmbH(gesellschaft g, jahr j):
  gewinn = mieten − kosten − zinsen − afa               // Gewinnermittlungsart: LÜCKE (Bilanzierung)
  kst    = max(gewinn, 0) × 0.15                         // § 23 KStG, [[Beteiligungsprivileg]]
  soli   = LÜCKE                                         // Backlog nennt 15,825 % (15 % + 5,5 % Soli auf KSt),
                                                         // ausdrücklich „im Vault fehlt die Zahl“
  if kuerzung_ok(g, j): gewst = 0 auf Grundbesitzertrag  // [[Erweiterte-Gewerbesteuerkuerzung]]; Rest: LÜCKE
  else:                 gewst = LÜCKE                    // Messzahl/Hebesatz fehlen; hebesaetze.csv existiert nicht
  // MVP-Ersatz (Sicherheit C, Stand 2020): belastung = 15 % mit Kürzung, 30 % ohne
  //   ([[Steuersatzgefaelle]], [[Thesaurierung]]) – im Spiel als „Pauschalsatz laut Anbieterquelle 2020“ zeigen
  g.kasse += gewinn_nach_steuern                         // Thesaurierung: bleibt in der Gesellschaft
```

### 2.3 Erweiterte Gewerbesteuerkürzung (§ 9 Nr. 1 GewStG)

Quelle: [[Erweiterte-Gewerbesteuerkuerzung]] (stand 2026-09-27, gueltigkeit unbekannt).

```text
function kuerzung_ok(g, j):
  return g.antrag_gestellt                                   // Antrag erforderlich
     and g.taetigkeit == nur_verwaltung_eigenen_grundbesitzes
     and einnahmen_stromlieferung(g,j) ≤ 0.20 × einnahmen_gebrauchsueberlassung(g,j)
     and einnahmen_sonstige_unmittelbare_mieterleistungen(g,j) ≤ 0.05 × BEZUG   // Bezugsgröße: LÜCKE
     and not dient_gewerbebetrieb_eines_gesellschafters(g)   // Ausschlussgrund laut Quelle
     and weitere_voraussetzungen(g)                           // LÜCKE (Ausschließlichkeit, Veräußerungen)
```

- Wirkung: kürzt den Gewerbeertrag aus Verwaltung und Nutzung eigenen Grundbesitzes; **keine**
  pauschale Befreiung aller Steuern, berührt nicht die KSt.
- **WIDERSPRUCH:** [Q-immocation-Blog-Einzelunternehmer-Gewerbeimmobilien] schlägt die Vermietung der
  Objektgesellschaft an eine operative Schwestergesellschaft vor, nennt aber selbst das Dienen für den
  Gewerbebetrieb eines Gesellschafters als Ausschlussgrund. Ob die Kürzung in der Schwesterstruktur
  bleibt, ist offen.
- Spielmechanik: „Kürzungsstatus“ als jährlicher Check mit Ampel; Verstoß (z. B. PV-Strom an Mieter
  über 20 %, Vermietung an eigenen Betrieb) → Status rot → Belastung springt von 15 % auf 30 %
  (Vault-Pauschalen, Sicherheit C).

### 2.4 Holding und Beteiligungsprivileg

Quellen: [[Holding]] (stand 2026-09, gueltigkeit unbekannt, § 8b KStG), [[Beteiligungsprivileg]]
(stand 2026-09, gueltigkeit unbekannt, **geprueft_am 2026-09-30**, § 8b KStG, § 23 KStG, § 9 Nr. 2a GewStG).

```text
function ausschuettung_an_holding(tochter t, holding h, betrag B, jahr j):
  kst_frei = beteiligung(h,t, beginn_kalenderjahr j) ≥ 10 %     // § 8b Abs. 4 KStG (Gesetzestext geprüft)
  gew_frei = beteiligung(h,t, beginn_erhebungszeitraum j) ≥ 15 % // § 9 Nr. 2a GewStG (Gesetzestext geprüft)
  if kst_frei and gew_frei:
      steuer = B × 0.05 × belastung_holding                       // 5 % gelten als nicht abziehbare BA
                                                                  // belastung_holding „rund 30 %“ → ≈ 1,5 % von B
  else:
      steuer = LÜCKE                                              // Folgen bei Unterschreiten nicht beschrieben
  h.kasse += B − steuer

function anteilsverkauf(holding h, anteile, gewinn G):
  steuer = G × 0.05 × belastung_holding                          // § 8b Abs. 2, 3 KStG: 95 % freigestellt
  // Grunderwerbsteuer bei Anteilsübertragung: LÜCKE ([[Holding]]: „nennen die Quellen nicht“)
```

- Vault-Rechnung: 5 % × 15 % = 0,75 % vs. Quelle 1,5 % → aufgelöst mit „Gesamtbelastung rund 30 %“
  (KSt + Soli + GewSt) → 5 % × 30 % ≈ 1,5 % ([[Beteiligungsprivileg]], Erklärung Stand 30.09.2026).
  Der Backlog führt die Frage dennoch weiter als offen.
- **LÜCKE:** Ausschüttung von der Holding an die **Privatperson** (Abgeltungsteuer/Teileinkünfteverfahren
  – Letzteres wird nur als „nicht verwechseln“ erwähnt). Gesamtbelastung bis zum Privatzufluss fehlt.
- Co-Investment-Muster ([Q-immocation-Blog-Co-Investor-steueroptimiert], 05/2021): je Partner eine
  eigene Holding, beide Holdings halten je 50 % an einer gemeinsamen vvGmbH (MFH Erzgebirge, 8 WE +
  Blumenladen, 10 % Rendite, ca. 1.400 EUR/Monat, 5 Jahre Haltedauer, dann Verkauf). Ausstieg per
  Anteilsverkauf zwischen den Holdings statt Objektverkauf.

### 2.5 Thesaurierung

Quelle: [[Thesaurierung]] (stand 2020-02, gueltigkeit unbekannt).

- Entscheidungsregel der Quelle: Kapitalgesellschaft ist sinnvoll, „immer wenn ich als Einzelperson das
  Geld, welches versteuert werden muss, privat nicht brauche“.
- Vorteil ist zunächst ein **Aufschub**: Bei Ausschüttung an eine Privatperson fällt weitere Steuer an.
- „In Summe weniger Steuern“ ist in der Quelle **nicht nachgerechnet** (kein Belastungsvergleich).
- Spielmechanik: **getrennte Kassen** (Privat / GmbH / Holding). Geld, das der Spieler privat braucht
  (Lebenshaltung, Eigenkapital für Privatkäufe), muss ausgeschüttet werden → Ausschüttungssteuer
  (Wert: **LÜCKE**, bis dahin Platzhalter mit Hinweis). So wird der Kernkonflikt der Thesaurierung
  erlebbar.

### 2.6 Betriebsaufspaltung

Quelle: [[Betriebsaufspaltung]] (stand 2020-02, gueltigkeit unbekannt).

```text
trigger_betriebsaufspaltung(o) =
     o.eigentuemer == privatperson P
 and o.mieter == betriebsgesellschaft G
 and P ist Gesellschafter von G                 // Voraussetzungen (personelle + sachliche Verflechtung): LÜCKE
folge:
  o und G-Anteile werden Betriebsvermögen (gewerblich)
  spekulationsfrist(o) entfällt als Vorteil
  bei späterer Auflösung: Entnahme der gesamten Anteile („Super-GAU“ laut Quelle)
  konkrete Steuerfolge (stille Reserven): LÜCKE
```

- Lösung laut Quelle: [[Holding]] mit Objekt- und operativer Gesellschaft **nebeneinander**; ob das die
  Betriebsaufspaltung sicher vermeidet und die Kürzung erhält: offen.
- Spielmechanik: „Falle“ im Unternehmer-Szenario (Spieler mit eigenem Betrieb will Halle kaufen). Die
  Engine warnt vor dem Kauf, wenn der Spieler privat kauft und an die eigene GmbH vermieten will.

### 2.7 Steuersatzgefälle

Quelle: [[Steuersatzgefaelle]] (stand 2020-02, gueltigkeit unbekannt).

```text
gefaelle_pp = satz_operative_gesellschaft − satz_objektgesellschaft   // Quelle: 30 % − 15 % = 15 Prozentpunkte
verlagerung = miete_von_operativ_an_objekt
ersparnis ≈ verlagerung × gefaelle_pp                                   // nur wenn Kürzung erhalten bleibt (WIDERSPRUCH 2.3)
```

Kein Belastungsvergleich in Euro in der Quelle; Sätze nicht aufgeschlüsselt.

### 2.8 „Ab wann lohnt sich was?“ – alle Aussagen des Vaults

| Heuristik | Quelle (Stand) | Einordnung |
|---|---|---|
| Erst muss der Cashflow stimmen, dann über Steuerkonstrukte nachdenken | [Q-immocation-Podcast-586-Steuer-Guide] (Ende 2025), zitiert in [[Vermoegensverwaltende-GmbH]], [[Steuerliches-Ergebnis]] | Voraussetzung für jede Freischaltung |
| Hoher Grenzsteuersatz ist das Hauptargument für eine Gesellschaftslösung | [[Grenzsteuersatz]] / [Q-immocation-Blog-Steuerberater-Tricks] (11/2020) | Trigger |
| Objekte mit Wertsteigerungserwartung privat kaufen (10-Jahres-Frist) | [Q-immocation-Blog-9-Steuerkniffe-beim-Kauf] (undatiert) | Gegenargument zur GmbH |
| Bei hoher Mietrendite (**9 %**) und geringer Wertsteigerung GmbH erwägen; Empfehlung im Text abgeschnitten | [Q-immocation-Blog-9-Steuerkniffe-beim-Kauf] | einziger Schwellenwert im Vault, Bezug (brutto/netto) offen |
| Kapitalgesellschaft, wenn Gewinne privat nicht gebraucht werden | [[Thesaurierung]] (2020) | Trigger |
| Steuerstruktur erst „ab einer gewissen Portfoliogröße“ – Schwelle nicht genannt | Webinar-Angebot laut [[Vermoegensverwaltende-GmbH]] | **LÜCKE** |
| vvGmbH bringt „in beiden Fällen einen bedeutenden Steuervorteil“ | [Q-immocation-Blog-Steuerberater-Tricks] (2020) | pauschal, ohne Gegenrechnung |
| Holding „essentiell“, „riesen Unterschied beim Vermögen“ | [Q-immocation-Podcast-678-20-Steuertricks-Teil-2] (15.09.2026) | pauschal; Sprecher verkauft Beratung |
| „Jede Immobilie braucht ihre eigene Entscheidung, nie etwas überstürzen“ | [Q-immocation-Podcast-627-Steuerguide-Teil-2] (2026) | relativiert die Pauschalaussagen |
| Co-Investment: je Partner eigene Holding | [Q-immocation-Blog-Co-Investor-steueroptimiert] (2021) | Strukturmuster |
| Unternehmer mit Betriebsimmobilie: Holding mit Schwestergesellschaften, nie privat kaufen und an eigene GmbH vermieten | [Q-immocation-Blog-Einzelunternehmer-Gewerbeimmobilien] (2020) | Strukturmuster + Falle |

**Fazit:** Eine **quantitative** Entscheidungsregel (Portfoliogröße, Rendite, Strukturkosten) gibt der
Vault **nicht** her ([[Vermoegensverwaltende-GmbH]], Offene Fragen; [[Holding]], Offene Fragen) →
**LÜCKE**. Das Spiel darf daher keine „richtige Antwort“ vorgeben, sondern muss den Vergleich
transparent rechnen und die Lücken offenlegen.

### 2.9 Kosten und Hürden

| Hürde | Vault | Spiel |
|---|---|---|
| Gründungskosten, laufende Buchführung/Jahresabschluss | **LÜCKE** | Designparameter, sichtbar als „Spielwert, nicht recherchiert“ |
| Private Bürgschaft gegenüber Bank | belegt ([[Vermoegensverwaltende-GmbH]]) | Flag `buergschaft_privat = true` (Default): GmbH-Schulden zählen im Risikoprofil privat mit |
| Kürzungsvoraussetzungen | belegt, unvollständig (2.3) | jährlicher Check |
| Betriebsaufspaltung | belegt, Voraussetzungen offen (2.6) | Warnung/Falle |
| Transparenzregister (§ 19a GwG seit 28.12.2022) | Pflichten im Detail **LÜCKE** ([[Transparenzregister]]) | Compliance-Aufgabe ohne Bußgeldzahl |
| Einbringung bestehender Privatobjekte (GrESt, § 23) | **LÜCKE** | MVP: nur Neuerwerb in der GmbH (ANNAHME (Design)); entspricht dem Vault-Fallbeispiel (zuerst privat, danach GmbH für Neukäufe) |
| Grunderwerbsteuer bei Anteilsübertragungen | **LÜCKE** | im Exit per Anteilsverkauf als „nicht modelliert“ markieren |
| Ausschüttung an Privatperson | **LÜCKE** | Platzhalter |

### 2.10 Spielmechanik: Freischaltung und Entscheidung

**Freischaltstufen (Vorschlag):**

| Stufe | Freischaltung | Bedingung (Vault-Heuristik → Spielregel) |
|---|---|---|
| 0 | Privatkauf | Start |
| 1 | Lernmodul „Steuerliches Ergebnis ≠ Cashflow“ | erstes Steuerjahr abgeschlossen ([[Steuerliches-Ergebnis]]) |
| 2 | Gesellschafts-Analyse („Strukturberater-Dialog“) | Modul 1 abgeschlossen **und** mind. ein Objekt mit positivem Cashflow vor Steuern (Podcast #586) **und** mindestens ein Signal: Grenzsteuersatz ≥ Designschwelle innerhalb 30–45 % / Objekt mit Mietrendite ≥ 9 % ([Q-immocation-Blog-9-Steuerkniffe-beim-Kauf]) / Spieler hat Überschüsse, die er privat nicht braucht ([[Thesaurierung]]) |
| 3 | vvGmbH gründen | Entscheidung in Stufe 2; Kosten = Designparameter; Bank verlangt Bürgschaft |
| 4 | Holding über vvGmbH | vvGmbH vorhanden; Lernmodul [[Beteiligungsprivileg]] (10-%/15-%-Schwellen) |
| 5 | Co-Investment / mehrere Objektgesellschaften | Holding vorhanden; Szenario nach [Q-immocation-Blog-Co-Investor-steueroptimiert] |
| S | Unternehmer-Szenario | eigener Betrieb im Avatar; Betriebsaufspaltungs-Falle, Steuersatzgefälle, Kürzungskonflikt |

**Entscheidungsdialog „privat oder GmbH“ (pro Objekt, nicht pauschal – Podcast #627):**

```text
zeige nebeneinander für Haltedauer H und Exit-Szenario:
  Privat:  Σ Steuer auf V+V × grenzsteuersatz  +  Steuer bei Verkauf (≤ 10 J. / > 10 J.)
  GmbH:    Σ Gesellschaftssteuer (15 % / 30 % Pauschale, Sicherheit C)
           + Ausschüttungssteuer (LÜCKE → „nicht berechnet“)
           + Strukturkosten (Designwert)
           + Verkauf (keine 10-Jahres-Freiheit)
  markiere jede Zeile mit: Quelle, Stand, gueltigkeit, Sicherheit, LÜCKE/Design
keine Empfehlung „richtig/falsch“; Fazit-Text nur: „Vergleich unter diesen Annahmen“
```

---

## 3. Recht & Regulierung, regionale Regeln, Datenvertrag

### 3.1 Regelmodell des Vaults (Grundlage für das Spiel)

Aus [[Vault-Spezifikation]] 1, 3, 4.2, 6.1, 8:

- **Regel** = Wert, der für mehrere Gebiete gleich gilt und sich per Rechtsakt ändert
  (`20-Regeln/<Gruppe>/<thema>--<kürzel>--<gueltig_ab>.md`).
- **Datenpunkt** = pro Gebiet unterschiedlich, regelmäßig neu erhoben (Hebesatz, Einwohner, Miete) → CSV.
- **Wissen** = Erklärung ohne Ortsbezug → `30-Wissen`.
- Gebiete über den **ARS (12-stellig)**: `LL R KK VVVV GGG`; `40-Daten/gebiete.csv` ist vollständig
  (12.588 Gebiete: 16 Länder, 29 Regierungsbezirke, 320 Kreise, 1.177 Gemeindeverbände, 8.374 Gemeinden;
  Quelle Destatis GV-ISys 2026-3Q, Stand 2026-09-30). Gebietsnotizen enthalten **keine** Regelwerte.
- **Präfix-Logik:** `geltungsbereich: ["03"]` gilt für alle ARS mit Präfix `03`; `ausgenommen` schneidet
  heraus; `"DE"` = bundesweit.
- **Versionierung:** nie überschreiben; alte Version bekommt `gueltig_bis`, `nachfolger`,
  `gueltigkeit: historisch`. Keine überlappenden Zeiträume je Thema und ARS.
- **Vorrang:** `vorrang: hoch` schlägt alles, sonst längster passender Präfix, sonst jüngstes `gueltig_ab`.

Exakter Auflösungsalgorithmus aus `tools/lib/vault.mjs` (`resolveRegeln`):

```text
function geltende_regeln(regeln, ars_ziel, stichtag):
  kandidaten = []
  for r in regeln:
    if r.status ∉ {entwurf, geprueft, veraltet}: continue          // geruest/leer/archiv ignorieren
    if not (r.gueltig_ab ≤ stichtag ≤ (r.gueltig_bis ?? ∞)): continue
    if any(ars_ziel.startsWith(a) for a in r.ausgenommen): continue
    spez = max(len(e) if ars_ziel.startsWith(e) else (0 if e == "DE" else −1) for e in r.geltungsbereich)
    if spez < 0: continue
    kandidaten[r.thema].append((r, spez))
  je thema: sortiere nach (vorrang == hoch) desc, spez desc, gueltig_ab desc → gewinner
  // Hinweis: objektarten wird im Tool NICHT gefiltert → im Spiel zusätzlich filtern:
  //          r.objektarten leer = alle, sonst objekt.objektart ∈ r.objektarten
```

### 3.2 Aufbau von `regeln-index.csv` und `regel.schema.json`

`40-Daten/regeln-index.csv` (generiert von `tools/build.mjs`, derzeit **ohne Datenzeilen**):

| Spalte | Inhalt | Format |
|---|---|---|
| `regel_id` | eindeutige, unveränderliche ID (Beispiel Spezifikation: `MSV-NI-2025`) | `^[A-Za-z0-9-]+$` |
| `thema` | aus `99-Pflege/schemas/themen.json` | Text |
| `geltungsbereich` | ARS-Präfixe oder IDs, mit `\|` getrennt; `DE` = bundesweit | Liste |
| `ausgenommen` | ARS-Präfixe, mit `\|` getrennt | Liste |
| `ebene_zustaendig` | `bund` / `land` / `kreis` / `gemeinde` | Enum |
| `wert` | boolean, Zahl, Text oder JSON-Objekt | beliebig |
| `einheit` | `prozent` / `jahre` / `eur` / `bool` / `text` | Enum |
| `objektarten` | leer = alle; sonst `etw\|efh\|zfh\|mfh\|wgh\|gewerbe\|grundstueck\|sonder` | Liste |
| `gueltig_ab` / `gueltig_bis` | ISO-Datum; `gueltig_bis` leer = unbefristet | Datum |
| `status`, `gueltigkeit`, `sicherheit`, `vorrang` | Bearbeitungsstand, zeitliche Geltung, A/B/C, `hoch` oder leer | Enum |
| `pfad` | Pfad der Regel-Notiz | Text |

Im Schema vorhanden, **im Index nicht exportiert**: `zusatz` (strukturierte Nebenwerte), `rechtsgrundlage`
(Pflicht), `fundstelle`, `monitor`, `vorgaenger`, `nachfolger`, `konflikt`, `geprueft_am`, `quellen`.

**Regel-Themen** (`themen.json`, Spezifikation 6.1):
Mietrecht: `mietpreisbremse`, `kappungsgrenze`, `kuendigungssperrfrist-umwandlung`, `mietspiegel-pflicht` ·
Kommunal: `umwandlungsverbot-250-baugb`, `erhaltungssatzung-milieuschutz`, `zweckentfremdung`,
`vorkaufsrecht-satzung`, `sanierungsgebiet`, `zweitwohnungsteuer`, `waermeplan` ·
Steuern: `grunderwerbsteuer-satz`, `grundsteuer-modell`, `grundsteuer-hebesatz` (→ CSV),
`spekulationsfrist`, `afa-satz`, `sonder-afa` ·
Bau/Energie: `landesbauordnung`, `solarpflicht`, `rauchwarnmelder`, `stellplatzpflicht`,
`heizungsanforderungen`, `co2-kostenaufteilung`, `energieausweis` ·
Kommunale Abgaben: `strassenausbaubeitraege`, `erschliessungsbeitraege` ·
Kauf/Notar: `maklerprovision-teilung`, `notar-grundbuch-gebuehren` ·
Förderung: `foerderprogramm-<kuerzel>` · Denkmal: `denkmalschutz-bescheinigung`.

### 3.3 Datenvertrag für das Spiel (Vorschlag)

Leitgedanke: **Vault-Daten unverändert übernehmen**, spielspezifische Wirkungen getrennt halten, fiktive
Szenarien klar markieren.

**(a) `regeln.csv`** – Import aus `regeln-index.csv`, erweitert um Schemafelder:

```text
regel_id, thema, geltungsbereich, ausgenommen, ebene_zustaendig, wert, einheit, zusatz_json,
objektarten, gueltig_ab, gueltig_bis, status, gueltigkeit, sicherheit, vorrang,
rechtsgrundlage, fundstelle, geprueft_am, konflikt, vault_pfad,
herkunft            // "vault" | "szenario"  (szenario = fiktiv, nie mit Vault-Regel mischen)
```

**(b) `regel_effekte.csv`** – Spiellogik je Thema (nicht im Vault):

```text
thema, effekt_typ, ziel_variable, operation, stichtag_bezug, objektarten, tooltip_id, wikilink
```

| thema | effekt_typ | ziel_variable | stichtag_bezug | Beleg der Logik |
|---|---|---|---|---|
| `grunderwerbsteuer-satz` | Kaufnebenkosten | `grest_satz` | Beurkundung | [[Regionale-Rechtsmatrix]], [[Kaufnebenkosten]] |
| `mietpreisbremse` | Deckel Neuvermietungsmiete | `neuvertragsmiete_max` | Mietvertragsschluss; Ausnahmen Neubau (erstmals nach 01.10.2014 genutzt und vermietet), erste Vermietung nach umfassender Modernisierung, Vormiete | [[Mieterhoehung]] |
| `kappungsgrenze` | Deckel Bestandsmieterhöhung | `kappung_3j_prozent` | Erhöhungsverlangen | [[Mieterhoehung]] |
| `kuendigungssperrfrist-umwandlung` | Sperre Eigenbedarfs-/Verwertungskündigung nach Umwandlung | `sperrfrist_jahre` | Umwandlung | [[Regionale-Rechtsmatrix]] |
| `erhaltungssatzung-milieuschutz` | Aufteilung untersagt/genehmigungspflichtig | `aufteilung_erlaubt` | Aufteilungsantrag | [[Milieuschutz]] |
| `umwandlungsverbot-250-baugb` | Umwandlung genehmigungspflichtig | `aufteilung_genehmigung` | Aufteilungsantrag | [[Regionale-Rechtsmatrix]] |
| `zweckentfremdung` | Kurzzeit-/Ferienvermietung, Leerstand | `kurzzeit_max_tage`, `leerstand_max_monate` | laufend | [[Regionale-Rechtsmatrix]] (Bremen) |
| `solarpflicht` | Investitionspflicht bei Auslöser | `pv_pflicht_bei` | Errichtung/Dachsanierung | [[Regionale-Rechtsmatrix]], [[Solarpflicht]] |
| `strassenausbaubeitraege` | Einmalbescheid, ggf. Jahre später | `ausbaubeitrag_risiko` | Bescheid | [[Regionale-Rechtsmatrix]] |
| `grundsteuer-modell` + Hebesatz (CSV) | laufende Kosten (umlagefähig nach § 2 Nr. 1 BetrKV) | `grundsteuer_eur` | Jahr | [[Betriebskosten]] |
| `maklerprovision-teilung` | Kaufnebenkosten Käuferanteil | `makler_kaeuferanteil` | Kauf; nur Wohnung/EFH an Verbraucher | [[Kaufnebenkosten]] |
| `spekulationsfrist` | Steuerpflicht Verkauf | `spekfrist_jahre` | Anschaffung/Veräußerung | [[Spekulationsfrist]] |
| `afa-satz` / `sonder-afa` | AfA-Satz | `afa_satz` | **Fertigstellungsjahr** des Gebäudes (nicht Spielstichtag) | [[AfA]] |
| `co2-kostenaufteilung` | Vermieteranteil CO₂-Kosten | `co2_vermieteranteil` | Abrechnungsjahr | [[CO2-Kostenaufteilung]] |

**(c) `hebesaetze.csv`** – Spalten laut Spezifikation 8: `ars,jahr,grundsteuer_a,grundsteuer_b,grundsteuer_c,gewerbesteuer,quelle_id,stand`.
Datei existiert im Vault **nicht** → **LÜCKE** (Grundsteuer- und Gewerbesteuerberechnung im Spiel
blockiert).

**(d) `ereignisse.csv`** – siehe Abschnitt 4.

**Kandidaten-Zeilen aus Vault-Werten** (noch **keine** Regel-Notizen im Vault; Sicherheit erst bei
Übernahme in `20-Regeln` zu vergeben; IDs nach Spezifikationsmuster vorgeschlagen):

| regel_id (Vorschlag) | thema | geltungsbereich | wert | gueltig_ab | gueltig_bis | Beleg |
|---|---|---|---|---|---|---|
| GREST-HB-2025 | grunderwerbsteuer-satz | 04 | 5.5 prozent | 2025-07-01 | – | [[Regionale-Rechtsmatrix]], [[Kaufnebenkosten]] („laut Service Bremen“) |
| GREST-TH-2024 | grunderwerbsteuer-satz | 16 | 5.0 prozent | 2024-01-01 | – | [[Regionale-Rechtsmatrix]] |
| GREST-NI | grunderwerbsteuer-satz | 03 | 5.0 prozent | **LÜCKE** | – | [[Regionale-Rechtsmatrix]] |
| (weitere 13 Länder) | grunderwerbsteuer-satz | 01…16 | siehe 3.4 | **LÜCKE** | – | [[Regionale-Rechtsmatrix]] |
| MPB-HB-2025 | mietpreisbremse | 04011 | true | 2025-12-01 | 2029-12-31 | [[Mieterhoehung]]; Mietenbegrenzungsverordnung vom 18.11.2025, Brem.GBl. 2025 S. 1254 |
| KG-HB-2024 | kappungsgrenze | 04011 | 15 prozent | 2024-09-01 (**konflikt**: 06.08.2024?) | 2029-08-31 | [[Mieterhoehung]] |
| KG-DE | kappungsgrenze | DE | 20 prozent | **LÜCKE** | – | [[Mieterhoehung]] (§ 558 Abs. 3 BGB) |
| MSV-NI-2025 (Mietpreisbremse) | mietpreisbremse | 033610001001, 033560005005, 033610009009, 032510037037, 032510047047 (nur die im Vault genannten Umlandgemeinden; vollständige Liste: **LÜCKE**) | true | 2025-01-01 | 2029-12-31 | [[Regionale-Rechtsmatrix]], [[Mieterhoehung]]; Nds. GVBl. 2024 Nr. 122, geändert Nds. GVBl. 2025 Nr. 93 |
| KG-NI-2025 | kappungsgrenze | wie MSV-NI-2025 | 15 prozent | 2025-01-01 | 2029-12-31 | dito |
| KSF-NI-2025 | kuendigungssperrfrist-umwandlung | wie MSV-NI-2025 | 5 jahre | 2025-01-01 | 2029-12-31 | [[Regionale-Rechtsmatrix]] (§ 577a Abs. 2 BGB) |
| KSF-DE | kuendigungssperrfrist-umwandlung | DE | 3 jahre | **LÜCKE** | – | `regelwerte-alt.csv` (Zeile Delmenhorst: „§ 577a Abs. 1 BGB, Regelfrist“) |
| SOLAR-NI-2025 | solarpflicht | 03 | true; zusatz `{ab_dachflaeche_m2: 50, belegung_min_prozent: 50, ausloeser: [neubau, dachhaut_erneuerung, aufstockung, anbau], stichtag: errichtung}` | 2025-01-01 | – | [[Regionale-Rechtsmatrix]] (§ 32a NBauO) |
| SOLAR-HB-2024 | solarpflicht | 04 | true; zusatz `{dachsanierung_ab: 2024-07, neubau_antraege_ab: 2025-07}` | 2024-07-01 | – | [[Regionale-Rechtsmatrix]] (BremSolarG) |
| MAKLER-DE | maklerprovision-teilung | DE | „Halbteilung“; objektarten etw, efh; nur Verbraucher | **LÜCKE** | – | [[Kaufnebenkosten]] (§ 656b, § 656c BGB, Sicherheit A) |
| SPEK-DE | spekulationsfrist | DE | 10 jahre | **LÜCKE** | – | [[Spekulationsfrist]] |
| AFA-DE | afa-satz | DE | zusatz `{fertig_vor_1925: 2.5, fertig_1925_2022: 2.0, fertig_ab_2023: 3.0}` | **LÜCKE** (Datum der Gesetzesänderung) | – | [[AfA]] |
| ZWECK-HB | zweckentfremdung | 04 (räumlich nur mit Ortsgesetz → Adresse prüfen) | zusatz `{ferienwohnung_max_tage: 90, leerstand_max_monate: 6}` | **LÜCKE** | – | [[Regionale-Rechtsmatrix]] (Sicherheit C) |

### 3.4 Regional variable Regeln – Übersicht mit Vault-Werten

Quelle Ebenen-Matrix: [[Regionale-Rechtsmatrix]] (stand 2026-09-30, gueltigkeit unbekannt,
geprueft_am 2026-09-30, `quellen: []`).

| Regel | Ebene | Vault-Werte | regional | Spielwirkung |
|---|---|---|---|---|
| Grunderwerbsteuersatz | Land | 16 Länder, s. u. | Land | Kaufnebenkosten, EK-Bedarf |
| Mietpreisbremse | Land bestimmt Gemeinden (VO) | HB-Stadt ja (01.12.2025–31.12.2029); Bremerhaven nein; NI: Achim, Lilienthal, Oyten, Stuhr, Weyhe ja; Delmenhorst nein | Gemeinde | Neuvermietungsmiete gedeckelt |
| Kappungsgrenze | Land bestimmt Gemeinden | 20 % Regel; 15 % HB-Stadt und gelistete NI-Gemeinden | Gemeinde | Bestandsmieterhöhung |
| Kündigungssperrfrist nach Umwandlung | Land bestimmt Gemeinden | 5 Jahre in gelisteten NI-Gemeinden; Regelfrist 3 Jahre | Gemeinde | Aufteilungsstrategie |
| Umwandlungsgenehmigung § 250 BauGB | Land-VO | nur wo VO erlassen; HB/NI: **LÜCKE** (Backlog) | Land/Gemeinde | Aufteilung |
| Milieuschutz § 172 BauGB | Gemeinde (Satzung) | keine konkrete Satzung im Vault | Gemeinde/Quartier | Aufteilung, Modernisierung |
| Zweckentfremdung / Kurzzeitvermietung | Land/Gemeinde | Bremen: > 90 Tage Ferienwohnung/Jahr, Leerstand > 6 Monate, Anzeige vs. Genehmigung, nur mit Ortsgesetz (Sicherheit C) | Land/Gemeinde | Kurzzeitvermietungsstrategie |
| Solarpflicht | Land, ab 2027 auch Bund (§ 106 GModG) | NI § 32a NBauO seit 01.01.2025; HB BremSolarG; NRW 2024 gewerblich / 2025 privat Neubau ([Q-immocation-Blog-Gesetzesaenderungen-2024]) | Land | Investitionspflicht |
| Rauchwarnmelder | Land | Pflicht überall; wer wartet: je Land (Sicherheit C) | Land | Umlage Nr. 17, Haftung |
| Grundsteuermodell / Hebesatz | Land / Gemeinde | NI Flächen-Lage-Modell, HB Bundesmodell (Sicherheit B); eigene Modelle u. a. BY, BW, HE, HH, NDS ([[Betriebskosten]]); Hebesätze **LÜCKE** | Land/Gemeinde | laufende Kosten (umlagefähig) |
| Straßenausbaubeiträge | Land-Rahmen, Gemeinde-Satzung | NI Kann-Regel (§ 6 NKAG, wiederkehrend § 6c); Backlog: ca. 56 % der NI-Gemeinden ohne Beiträge (Sicherheit B); Bescheide Jahre nach Maßnahme möglich | Gemeinde | Einmalkosten-Risiko |
| Baulastenverzeichnis | Land | in Bayern keine Baulasten (Dienstbarkeiten im Grundbuch) | Land | Prüfaufwand |
| Mietspiegel | Gemeinde | Bremen: qualifiziert, Indexfortschreibung seit 01.01.2026 (`regelwerte-alt.csv`) | Gemeinde | Vergleichsmiete |
| Bodenrichtwerte | Gutachterausschuss | Datenpunkte | Kreis/Stadt | Kaufpreisaufteilung |
| Maklerprovision Halbteilung | Bund | nur Wohnung/EFH an Verbraucher | – | Kaufnebenkosten |

**Grunderwerbsteuersätze laut [[Regionale-Rechtsmatrix]] (Stand 2026, gueltigkeit unbekannt):**

| ARS | Land | Satz | | ARS | Land | Satz |
|---|---|---|---|---|---|---|
| 01 | Schleswig-Holstein | 6,5 % | | 09 | Bayern | 3,5 % |
| 02 | Hamburg | 5,5 % | | 10 | Saarland | 6,5 % |
| 03 | Niedersachsen | 5,0 % | | 11 | Berlin | 6,0 % |
| 04 | Bremen | 5,5 % (seit 01.07.2025) | | 12 | Brandenburg | 6,5 % |
| 05 | Nordrhein-Westfalen | 6,5 % | | 13 | Mecklenburg-Vorpommern | 6,0 % |
| 06 | Hessen | 6,0 % | | 14 | Sachsen | 5,5 % |
| 07 | Rheinland-Pfalz | 5,0 % | | 15 | Sachsen-Anhalt | 5,0 % |
| 08 | Baden-Württemberg | 5,0 % | | 16 | Thüringen | 5,0 % (seit 01.01.2024) |

- Maßgeblich: Land des Grundstücks, Satz am Tag der Beurkundung. Vorwerte (implizit aus dem Hinweis
  auf veraltete Ratgeber): Bremen 5,0 %, Thüringen 6,5 % → für historische Szenarien nutzbar, Sicherheit C.
- Bemessungsgrundlage: Anteil an der WEG-Erhaltungsrücklage **nicht** abziehen (BFH, Urt. v. 16.09.2020 –
  II R 49/17); bewegliches Inventar (Einbauküche) mit realistischem Zeitwert separat ausweisbar
  ([[Kaufnebenkosten]], [[Regionale-Rechtsmatrix]]).
- **WIDERSPRUCH/Qualität:** Tabelle ohne Q-Notiz/Primärquelle (`quellen: []`); [[Kaufnebenkosten]]
  (`offen`) und Backlog sagen, die Sätze der übrigen Länder fehlen; Phase P6 sieht Primärquellen für
  alle 16 Länder vor. Im Spiel als „Stand 2026, Sicherheit C, vor Echtentscheidung prüfen“ zeigen.

### 3.5 Mietrechtliche Kernparameter (bundesweit, mit regionaler Ausprägung)

Quelle: [[Mieterhoehung]] (stand 2026-09-30, gueltigkeit unbekannt, geprueft_am 2026-09-30).

| Parameter | Wert | Norm laut Notiz |
|---|---|---|
| Wartefrist Vergleichsmiete | Miete 15 Monate unverändert bis Wirksamkeit; Verlangen frühestens 1 Jahr nach letzter Erhöhung | §§ 558–558b BGB |
| Kappungsgrenze in 3 Jahren | 20 %; 15 % in ausgewiesenen Gebieten | § 558 Abs. 3 BGB |
| Wirksamkeit Zustimmung | ab Beginn des dritten Kalendermonats nach Zugang | § 558b BGB |
| Indexmiete | Wirkung ab übernächstem Monat nach Erklärung in Textform | § 557b BGB |
| Staffelmiete | Beträge in Euro, mind. 1 Jahr je Staffel; Erhöhungen §§ 558–559b ausgeschlossen; in MPB-Gebiet muss jede Staffel die Bremse einhalten | § 557a BGB |
| Modernisierungsumlage | 8 % p. a. der anrechenbaren Kosten; Kappung 3 EUR/m² in 6 Jahren (2 EUR/m² bei Miete < 7 EUR/m²) | § 559, § 559 Abs. 3a BGB |
| Heizungstausch mit Förderung | wahlweise 10 % der Kosten nach Förderabzug; Kappung 0,50 EUR/m² in 6 Jahren | § 559e BGB |
| Vereinfachtes Verfahren | 5-Jahres-Sperre mit Ausnahmen | § 559c BGB |
| Mietpreisüberhöhung | > 20 % über üblichem Entgelt + Ausnutzen geringen Angebots | § 5 WiStrG |
| Mietpreisbremse Ausnahmen | Neubau (erstmals nach 01.10.2014 genutzt und vermietet); erste Vermietung nach umfassender Modernisierung; höhere Vormiete | § 556d ff. BGB |
| Ermächtigung Mietpreisbremse | bis 31.12.2029 | § 556d Abs. 2 BGB i. d. F. vom 17.07.2025 |

### 3.6 Weitere Rechtsthemen aus dem Fachgebiet

| Thema | Kernaussage im Vault | gueltigkeit / Stand | Spiel |
|---|---|---|---|
| [[Milieuschutz]] (§ 172 BauGB) | kommunales Instrument; kann Aufteilung in bestimmten Gebieten untersagen; als **erste** Prüfung vor Aufteilung | unbekannt / Stand ca. 2022 (Hinweis), Quelle undatiert | Gebietsattribut auf Ortsteil-/Quartiersebene (ARS-ID `<ARS12>-OT-…`); blockiert Aufteilung |
| [[Aufteilung-in-Wohnungseigentum]] | Aufteilungsgewinn = Σ Einzelverkaufspreise − Gesamtverkaufspreis − Aufteilungskosten; Voraussetzungen laut Quelle: Milieuschutzprüfung, [[Abgeschlossenheit]], [[Aufteilungsplan]]; Vorkaufsrecht Mieter, Sperrfrist, § 250, Grundstückshandel fehlen | unbekannt / undatiert | Strategie „Aufteilen“ mit Regel-Gates; Kosten/Gewinnspanne **LÜCKE** |
| [[Verwertungskuendigung]] | ordentliche Kündigung wegen Hinderung angemessener wirtschaftlicher Verwertung; höhere Miete reicht nicht; Hürden hoch; Norm/Fristen **LÜCKE** | unbekannt | nur als „hohe Hürde“-Aktion mit niedriger Erfolgschance (Designwert) oder gar nicht anbieten |
| [[Berechtigtes-Interesse]] | **im Vault: Voraussetzung der Grundbucheinsicht (§ 12 GBO)** | aktuell / 2021-11 | Recherche-Aktion „Eigentümer ermitteln“ nur mit berechtigtem Interesse; **WIDERSPRUCH**: [[Verwertungskuendigung]] verlinkt den Begriff im Kündigungssinn |
| [[Transparenzregister]], [[Wirtschaftlich-Berechtigte]] | § 19a GwG: seit SDG II (28.12.2022) Angaben zu Immobilien; Pflichten je Haltestruktur, Einsicht, Sanktionen **LÜCKE** | unbekannt / 2022-12 | Compliance-Aufgabe für Gesellschaften; Lerninhalt „Transparenz ≠ Meldepflicht“ |
| [[Mietendeckel]] | nur politisches Schlagwort; Quelle nennt ihn „nachweislich wirkungslos“ ohne Beleg; Rechtsgrundlage MietenWoG Bln, BVerfG 2 BvF 1/20 v. 25.03.2021 (Ergebnis im Text **nicht** beschrieben) | **historisch** / 2023-03 | Ereignistyp „Landesmietendeckel“ nur als Szenario |
| [[Corona-Mietmoratorium]] | Zahlungsaufschub 01.04.–30.06.2020, kein Erlass, Rückzahlung bis 30.06.2022, 4 % Zinsen (unbestätigt), Kündigungsschutz | **historisch** / 2020-04 | Krisenereignis (Abschnitt 4) |
| [[Stoerung-der-Geschaeftsgrundlage]] | Lockdown-Gewerbemiete: OLG Dresden 50/50 (11/2021) → BGH 12.01.2022, XII ZR 8/21: Einzelfallprüfung (Hilfen, Versicherungen) | unbekannt / 2022-01 | Gewerbemieter-Ereignis |
| [[Krisenregel-als-Dauerrecht]] | Videobesichtigung bei Beleihungswert: Krisenregel 2020, Lücke 30.06.–08.10.2022, dauerhaft mit Bedingungen | unbekannt / 2022-10 | Finanzierungsparameter |
| [[Widerrufsrecht-bei-unbesichtigter-Vermietung]] | vorsorgliche Widerrufsbelehrung empfohlen; Voraussetzungen/Folgen offen | unbekannt / 2020-03 | Lern-Tooltip bei „Vermietung ohne Besichtigung“ |
| [[BGH-Urteile-zu-Betriebskosten]] | 12-Monats-Abrechnungsfrist, formelle vs. materielle Fehler, Kürzungsrechte (3 % CO₂-Ausweis, 3 % Verbrauchsinfo, 15 % § 9 HKV) | **aktuell** / 2026-09-30 | Verwaltungsfehler-Ereignisse (Schnittstelle zum Vermietungs-Modul) |
| [[Regulatorisches-Bestandsrisiko]] | gesetzliche Pflichten lösen Investitionen aus; in Euro = Investitionsbetrag, den eine neue Pflicht auslöst; Rechenweg **LÜCKE**; Instandhaltungsreserve deckt es nicht ab | unbekannt / 2026-09-27 | eigene „Regulierungsreserve“ als Spielerentscheidung |

---

## 4. Politik- und Regulierungsereignisse als Spielmechanik

### 4.1 Ereignismodell

Der Vault liefert zwei Muster, die sich direkt als Mechanik eignen:

1. **Ankündigung ≠ Umsetzung** ([[Politische-Vorhaben-einschaetzen]], stand 2026-09-30): Vorhaben kamen
   früher (65-%-Regel: angekündigt für 2025, kam 2024), später und anders (CO₂-Aufteilung: Frist Mitte
   2022, kam 01.01.2023 als Stufenmodell statt 50/50), schneller und weitreichender
   (Transparenzregister: 13 Monate nach „zu früh für Schlüsse“) oder gar nicht wie geplant (Neubauziel
   400.000/Jahr nie erreicht). Drei qualitative Faktoren: Partei-Zuordnung, Erfahrung,
   Entscheidungskompetenz des Ressorts (nicht gewichtet).
2. **Krisenregeln laufen aus oder bleiben verändert** ([[Krisenregel-als-Dauerrecht]]): Das
   Mietmoratorium lief vollständig aus; die Videobesichtigung blieb dauerhaft, aber mit Bedingungen und
   nach einer Lücke von gut drei Monaten.

```text
Ereignis {
  ereignis_id, herkunft: historisch | szenario,       // szenario = fiktiv, im UI so beschriftet
  thema, geltungsbereich (ARS-Präfixe), objektarten,
  phasen: [ankuendigung, beschluss, inkraft, uebergang, auslauf],   // je mit Datum oder Verteilung
  effekte: [{ziel_variable, operation, wert, ab, bis}],
  abweichung: {verzoegerung, inhalt_anders, entfaellt}          // qualitativ belegt, Wahrscheinlichkeiten = Design
  lerntext, wikilinks
}
// Spieler sieht in der Ankündigungsphase nur die Ankündigung + Quelle; Wirkung erst ab Inkrafttreten.
// Entscheidungen in der Ankündigungsphase (z. B. „Heizung vorziehen“) sind die Lernchance.
```

### 4.2 Katalog historischer Ereignisse (für Zeitreise-/Kampagnenmodus)

| Datum | Ereignis | Effekt im Spiel | Beleg (gueltigkeit) |
|---|---|---|---|
| 27.03.2020 | Corona-Paket; Mietmoratorium für Mieten 01.04.–30.06.2020 | Anteil Mieter stoppt Zahlung 3 Monate (Glaubhaftmachung genügt), keine Kündigung wegen dieser Rückstände; Nachzahlung bis 30.06.2022 mit Zinsen (4 % laut Quelle, unbestätigt) | [[Corona-Mietmoratorium]] (historisch). Betroffenenquote: nur Anekdote 200/3.000 ≈ 6,7 % Mieterkontakte, **keine Ausfallquote** → Designparameter |
| 2020 | Freiwillige Teilstundung Gewerbe (1/3 Miete für 3 Monate, Rest über 6 Monate) | Verhandlungsoption statt Rechtsstreit; Mieter zahlt danach 6 Monate ≈ 133 % | [[Corona-Mietmoratorium]], [[Teilstundung]] |
| 2020 | BaFin lässt Videobesichtigung zu (Krisenregel) | schnellere Bewertung | [[Krisenregel-als-Dauerrecht]] |
| 30.06.2022 | COVID-Sonderregeln laufen aus | Lücke bis 08.10.2022 | dito |
| 08.10.2022 | BelWertV-Novelle (vom 07.10.2022) | Videobesichtigung nur Kleindarlehen (Grenze 400.000 → 600.000 EUR), Restnutzungsdauer ≥ 40 Jahre, Fotodokumentation, **Abschlag ≥ 5 % auf Beleihungswert** | dito (unbekannt, Stand 2022-10) |
| 11/2021 – 12.01.2022 | Lockdown-Gewerbemiete: OLG Dresden 50/50, BGH Einzelfall | Gewerbemieter fordert Mietanpassung; Ergebnis hängt von Hilfen/Versicherungen ab | [[Stoerung-der-Geschaeftsgrundlage]] |
| 25.03.2021 | BVerfG 2 BvF 1/20 zum Berliner MietenWoG | nur als Datum im Vault; Ausgang **LÜCKE** | [[Mietendeckel]] (historisch) |
| 24./25.11.2021 | Koalitionsvertrag: 65 % EE ab 2025, EH70 Umbau, EH40 Neubau, CO₂-Teilung, Teilwarmmiete, 400.000 Wohnungen | Ankündigungsphase; tatsächliche Folgen siehe unten; EH70/Teilwarmmiete Umsetzung **LÜCKE** | [Q-immocation-News-Koalitionsvertrag-2021], [[Politische-Vorhaben-einschaetzen]] |
| 2021–2025 | Neubauziel verfehlt: 293.393 / 295.275 / 294.399 / 251.937 / 206.586 Fertigstellungen | Marktvariable Angebot (Schnittstelle Markt-Modul) | [Q-immocation-News-Koalitionsvertrag-2021] |
| 28.12.2022 | SDG II: § 19a GwG – Immobilienangaben im Transparenzregister | Compliance-Pflicht für Gesellschaften | [[Transparenzregister]] |
| 01.01.2023 | CO2KostAufG: Stufenmodell Wohngebäude, Vermieteranteil 0–95 % | laufende Kosten abhängig von Gebäudeeffizienz | [[CO2-Kostenaufteilung]] (unbekannt, Stand 2026-09-30); **WIDERSPRUCH** 90 % vs. 95 % |
| ab 2023 | AfA 3 % für Gebäude mit Fertigstellung nach 2022 | Neubau-AfA steigt | [[AfA]]; Datum der Gesetzesänderung **LÜCKE** |
| 01.01.2024 | GEG-Novelle: 65 % EE bei neuen Heizungen; Bestand Fristen 30.06.2026 (> 100.000 EW) / 30.06.2028 | Heizungstausch-Kosten | [Q-immocation-Blog-Gesetzesaenderungen-2024], [[Heizungsregel-65-Prozent-EE]] (**historisch**) |
| 01.01.2024 | Thüringen GrESt 6,5 % → 5,0 % | Kaufnebenkosten | [[Regionale-Rechtsmatrix]] |
| 01.07.2024 | Kabel-Nebenkostenprivileg: Grundgebühren nicht mehr umlagefähig | nicht umlagefähige Kosten steigen | [[BGH-Urteile-zu-Betriebskosten]] |
| 07/2024 | Bremen Solarpflicht bei grundlegender Dachsanierung | Investitionspflicht | [[Regionale-Rechtsmatrix]] |
| 01.09.2024 | Bremen (Stadt) Kappungsgrenze 15 % bis 31.08.2029 | Mieterhöhungspfad | [[Mieterhoehung]] (Datum-**WIDERSPRUCH**) |
| 01.01.2025 | NI Mieterschutzverordnung (MPB, 15 %, Sperrfrist 5 J.) bis 31.12.2029; NI Solarpflicht § 32a NBauO; elektronische Belegeinsicht zulässig | mehrere | [[Regionale-Rechtsmatrix]], [[BGH-Urteile-zu-Betriebskosten]] |
| 01.07.2025 | Bremen GrESt 5,0 % → 5,5 %; Bremen Solarpflicht Neubau (Anträge ab 07/2025) | Kaufnebenkosten, Neubaukosten | [[Regionale-Rechtsmatrix]], [[Kaufnebenkosten]] |
| 17.07.2025 | § 556d Abs. 2 BGB: Ermächtigung Mietpreisbremse bis 31.12.2029 | Laufzeit aller MPB-Verordnungen begrenzt | [[Mieterhoehung]] |
| 01.12.2025 | Bremen (Stadt) Mietpreisbremse bis 31.12.2029 | Neuvermietung gedeckelt | [[Mieterhoehung]] |
| 03.12.2025 | Änderung NI-Mieterschutzverordnung | Gemeindeliste geändert (Inhalt der Änderung **LÜCKE**) | [[Mieterhoehung]] |
| 29.07.2026 | GModG ersetzt GEG-Regime: pauschale 65-%-Regel und Betriebsverbote entfallen; neue Heizungsanforderungen §§ 42–46 | Heizungsentscheidung neu bewerten | [[Gebaeudemodernisierungsgesetz]] (unbekannt, Stand 2026-09-27) |

### 4.3 Bekannte zukünftige Stichtage (gueltigkeit „zukuenftig“-fähig)

| Datum | Ereignis | Effekt | Beleg |
|---|---|---|---|
| 2027 | Bundes-Solarpflicht § 106 GModG gestuft | Investitionspflicht bundesweit | [[Gebaeudemodernisierungsgesetz]], [[Regionale-Rechtsmatrix]] |
| 01.01.2028 | Gas-/Öl-Heizungen nach § 43 Abs. 1 GModG: Netzentgelt und CO₂-Kosten hälftig (§ 5a CO2KostAufG) | Vermieterkosten | [[Gebaeudemodernisierungsgesetz]], [[Mieterhoehung]] |
| 2029 / 2030 / 2035 / 2040 | Brennstoffanteile 10 / 15 / 30 / 60 % für neue Gas-/Ölheizungen | Brennstoffkosten | [[Gebaeudemodernisierungsgesetz]] |
| 2028 / 2030 | Nullemissionsstandard öffentliche Neubauten / Neubauten allgemein | Neubaukosten | dito |
| 31.08.2029 | Ende Bremer Kappungsgrenzenverordnung | **Gabelung:** Verlängerung oder Auslaufen (Ausgang unbekannt → Szenario) | [[Mieterhoehung]] |
| 31.12.2029 | Ende Ermächtigung Mietpreisbremse, NI-VO, Bremer MPB | **Gabelung** (Szenario) | [[Mieterhoehung]], [[Regionale-Rechtsmatrix]] |

### 4.4 Szenario-Ereignistypen (fiktiv, nur mit Vault-Mustern begründet)

Alle Werte/Wahrscheinlichkeiten sind **ANNAHME (Design)**; im UI als „fiktives Szenario“ kennzeichnen.

| Typ | Vorbild im Vault | Effekt | Wertebereich ohne Erfindung |
|---|---|---|---|
| GrESt-Änderung eines Landes | HB 2025, TH 2024 | `grest_satz` ab Stichtag Beurkundung | Spannweite der realen Sätze 3,5–6,5 % ([[Regionale-Rechtsmatrix]], [[Kaufnebenkosten]]) |
| Neue / auslaufende Mieterschutz-VO für Gemeinde | NI 2025, HB 2025, Auslauf 2029 | MPB an/aus, Kappung 15 ↔ 20 %, Sperrfrist 5 ↔ 3 J. | Vault-Werte |
| Milieuschutzsatzung in Quartier | [[Milieuschutz]] | Aufteilung blockiert | bool |
| § 250 BauGB-Verordnung | [[Regionale-Rechtsmatrix]] | Aufteilung genehmigungspflichtig | bool |
| Zweckentfremdungssatzung | Bremen | Kurzzeitvermietung > 90 Tage anzeige-/genehmigungspflichtig | Bremer Werte |
| Krisenmoratorium | Corona 2020 | Zahlungsaufschub 3 Monate, Rückzahlung 2 Jahre, Kündigungsschutz | Corona-Werte; Betroffenenquote = Design |
| Krisenregel wird Dauerrecht mit Abschlag | BelWertV 2022 | z. B. Beleihungswertabschlag | ≥ 5 % |
| Energieauflage angekündigt | 65-%-Regel, GModG | Heizungs-/Solarpflicht; Ankündigung vs. Inkrafttreten ± Jahre | Muster aus [[Politische-Vorhaben-einschaetzen]] |
| AfA-Satz-Änderung (nur neue Fertigstellungen) | 3 % ab 2023 | `afa_satz` für Neubau | 2 / 2,5 / 3 % |
| Straßenausbaubeitragsbescheid | NI Kann-Regel | Einmalzahlung Jahre nach Maßnahme | Betrag **LÜCKE** |
| Betriebsprüfung (Kaufpreisaufteilung, RND-Gutachten, Ehegattenschaukel, 15-%-Grenze, Kürzung) | Anerkennungsrisiken in den jeweiligen Notizen | Nachzahlung / Rückfall auf Standardwerte | Wahrscheinlichkeit = Design |
| Gewerbemieter in Krise | [[Stoerung-der-Geschaeftsgrundlage]] | Mietanpassung verhandeln | Einzelfall |

---

## 5. Parameter-Tabelle

Legende „gueltigkeit“: Wert aus dem Frontmatter der Quellnotiz. „regional?“: ja = je Land/Gemeinde
verschieden. „zeitabhängig?“: ja = hat Stichtage/Versionen.

| Parameter | Wert | Einheit | Quelle | Stand / gueltigkeit | regional? | zeitabhängig? |
|---|---|---|---|---|---|---|
| **Privatperson – Einkommensteuer** | | | | | | |
| Grenzsteuersatz (Korridor) | 30–45 | % | [[Grenzsteuersatz]] | 2021-02 / unbekannt | nein | ja |
| Grenzsteuersatz Beispiel hohes Einkommen | 42 („inkl. Soli“, unpräzise) | % | [[Grenzsteuersatz]], [[Vermoegensverwaltende-GmbH]] | 2020-11 / unbekannt | nein | ja |
| ESt-Tarif § 32a, Grundfreibetrag | **LÜCKE** | – | – | – | nein | ja |
| Solidaritätszuschlag, Kirchensteuer | **LÜCKE** | % | – | – | KiSt: ja (Land) – nicht im Vault | ja |
| Verlustvortrag/-rücktrag | **LÜCKE** | – | – | – | nein | ja |
| **AfA** | | | | | | |
| AfA linear, Fertigstellung vor 1925 | 2,5 | % p. a. | [[AfA]] | 2026-09-27 / unbekannt (Sicherheit C) | nein | ja (Fertigstellungsjahr) |
| AfA linear, Fertigstellung 1925–2022 | 2,0 | % p. a. | [[AfA]] | dito | nein | ja |
| AfA linear, Fertigstellung nach 2022 | 3,0 | % p. a. | [[AfA]] | dito | nein | ja |
| AfA degressiv § 7 Abs. 5a (qualifizierte neue Wohngebäude) | 5 (Voraussetzungen/Rechenweg **LÜCKE**) | % | [[AfA]] | dito | nein | ja |
| AfA historisch (Quelle 2021) | 2 / 50 Jahre „Baujahr nach 1925“ | % / Jahre | [[AfA]], [[Restnutzungsdauergutachten]] | 2021-02 / überholt | nein | ja |
| AfA-Bemessungsgrundlage | Anschaffungskosten − Grund und Boden | EUR | [[AfA-Bemessungsgrundlage]] | 2021-02 / unbekannt | nein | nein |
| Kaufnebenkosten in AfA-BMG | **LÜCKE** (offen) | – | [[AfA-Bemessungsgrundlage]] | – | nein | – |
| RND-Gutachten: AfA = BMG / RND | Formel; Anerkennung offen | EUR/Jahr | [[Restnutzungsdauergutachten]] | unbekannt / unbekannt | nein | nein |
| Sonder-AfA § 7b, Denkmal §§ 7h/7i/10f | **LÜCKE** | – | Backlog | – | Denkmal: Land (Bescheinigung) | ja |
| **Anschaffungsnahe HK** | | | | | | |
| Schwelle | 15 % der Gebäude-Anschaffungskosten, netto ohne USt | % | [[Anschaffungsnahe-Herstellungskosten-15-Prozent]] | 2026-09-27 / unbekannt | nein | ja |
| Zeitfenster | 3 | Jahre nach Anschaffung | dito | dito | nein | ja |
| **Spekulationsfrist / § 23** | | | | | | |
| Frist | 10 (steuerbar wenn ≤ 10 Jahre) | Jahre | [[Spekulationsfrist]] | 2026-09-27 / unbekannt | nein | ja |
| Eigennutzungsausnahme | ausschließlich eigengenutzt **oder** Veräußerungsjahr + 2 Vorjahre | Kalenderjahre | dito | dito | nein | ja |
| Freigrenze private Veräußerungsgeschäfte | < 1.000 (Gesamtgewinn/Jahr; Freigrenze) | EUR | dito (Recherchebericht) | dito | nein | ja |
| AfA mindert Anschaffungskosten bei Verkauf | ja (§ 23 Abs. 3) | – | dito | dito | nein | – |
| Gewerblicher Grundstückshandel (Kriterien) | **LÜCKE** | – | – | – | nein | – |
| **Umsatzsteuer** | | | | | | |
| Vermietung umsatzsteuerfrei | Grundsatz | – | [[Umsatzsteuerpflichtige-Vermietung]] | 2021-05 / unbekannt | nein | – |
| Optionsvoraussetzung | Mieter mit vorsteuerabzugsberechtigenden Umsätzen (Gewerbe) | – | dito | dito | nein | – |
| Bindungsfrist Mieterqualität | 10 | Jahre | dito, [[Vorsteuer]] | 2021-05 / unbekannt | nein | ja |
| USt-Satz | **LÜCKE** | % | – | – | nein | ja |
| **GmbH / Holding** | | | | | | |
| Körperschaftsteuersatz | 15 | % | [[Beteiligungsprivileg]] (§ 23 KStG) | 2026-09 / unbekannt, geprüft 2026-09-30 | nein | ja |
| Soli auf KSt / 15,825 % | **LÜCKE** (nur Backlog-Hinweis) | % | Recherche-Backlog | – | nein | ja |
| Belastung Objektgesellschaft mit erweiterter Kürzung | 15 (unaufgeschlüsselt) | % | [[Steuersatzgefaelle]], [[Vermoegensverwaltende-GmbH]] | 2020-02 / unbekannt (C) | (GewSt-Hebesatz wäre regional) | ja |
| Belastung GmbH ohne Kürzung / operative GmbH | 30 (unaufgeschlüsselt); „rund 30 %“ | % | [[Thesaurierung]], [[Steuersatzgefaelle]], [[Beteiligungsprivileg]] | 2020-02 bzw. 2026-09 / unbekannt | ja (Hebesatz) – nicht modelliert | ja |
| Gewerbesteuer-Messzahl, Hebesätze | **LÜCKE** (`hebesaetze.csv` fehlt) | % | – | – | ja (Gemeinde) | ja |
| Kürzungsgrenze Stromlieferungen | 20 % der Einnahmen aus Gebrauchsüberlassung | % | [[Erweiterte-Gewerbesteuerkuerzung]] | 2026-09-27 / unbekannt (C) | nein | ja |
| Kürzungsgrenze sonstige unmittelbare Mieterleistungen | 5 (Bezugsgröße **LÜCKE**) | % | dito | dito | nein | ja |
| Steuerfreier Anteil Dividende/Veräußerungsgewinn zwischen Kapitalgesellschaften | 95 | % | [[Beteiligungsprivileg]] | 2026-09 / unbekannt, geprüft 2026-09-30 | nein | ja |
| Effektive Belastung Ausschüttung an Holding | ≈ 1,5 (= 5 % × rund 30 %) | % der Ausschüttung | dito | dito | nein | ja |
| Mindestbeteiligung KSt (§ 8b Abs. 4) | 10, zu Beginn des Kalenderjahres | % | dito (Gesetzestext geprüft) | dito | nein | ja |
| Mindestbeteiligung GewSt (§ 9 Nr. 2a) | 15, zu Beginn des Erhebungszeitraums | % | dito (Gesetzestext geprüft) | dito | nein | ja |
| Steuersatzgefälle (Beispiel) | 15 | Prozentpunkte | [[Steuersatzgefaelle]] | 2020-02 / unbekannt | nein | ja |
| Renditeschwelle GmbH-Überlegung | 9 (brutto/netto offen) | % Mietrendite | [[Vermoegensverwaltende-GmbH]] | undatiert / unbekannt | nein | – |
| Portfolioschwelle für Struktur | **LÜCKE** | – | [[Vermoegensverwaltende-GmbH]], [[Holding]] | – | nein | – |
| Gründungs-/laufende Strukturkosten | **LÜCKE** | EUR | – | – | nein | – |
| Ausschüttung Holding → Privat | **LÜCKE** | % | – | – | nein | ja |
| **Kaufnebenkosten / Kauf** | | | | | | |
| Grunderwerbsteuer je Land | 3,5–6,5 (Tabelle 3.4) | % Kaufpreis | [[Regionale-Rechtsmatrix]] | 2026 / unbekannt, geprüft 2026-09-30, `quellen: []` | ja (Land) | ja |
| GrESt Bremen | 5,5 seit 01.07.2025 (vorher 5,0) | % | [[Kaufnebenkosten]], [[Regionale-Rechtsmatrix]] | 2026-09-30 / unbekannt | ja | ja |
| GrESt Thüringen | 5,0 seit 01.01.2024 (vorher 6,5) | % | [[Regionale-Rechtsmatrix]] | 2026 / unbekannt | ja | ja |
| Stichtag GrESt-Satz | Tag der Beurkundung | – | [[Regionale-Rechtsmatrix]] | dito | – | – |
| Notar + Grundbuch (ältere Pauschale) | rund 2 (tatsächlich gestaffelt) | % Kaufpreis | [[Kaufnebenkosten]] | 2026-09-30 / unbekannt | nein | ja |
| Maklerprovision Halbteilung | nur Wohnung/EFH an Verbraucher; MFH frei | – | [[Kaufnebenkosten]] (A) | 2026-09-30 / unbekannt | nein | ja |
| **Mietrecht** | | | | | | |
| Kappungsgrenze Regel / Gebiet | 20 / 15 in 3 Jahren | % | [[Mieterhoehung]] | 2026-09-30 / unbekannt | ja (Gemeinde) | ja |
| Mietpreisbremse aktiv | HB-Stadt; NI-Gemeinden Achim, Lilienthal, Oyten, Stuhr, Weyhe | bool | [[Mieterhoehung]], [[Regionale-Rechtsmatrix]] | dito | ja | ja (bis 31.12.2029) |
| Kündigungssperrfrist nach Umwandlung | 3 Regel / 5 gelistete NI-Gemeinden | Jahre | [[Regionale-Rechtsmatrix]], `regelwerte-alt.csv` | 2026-09-30 / unbekannt | ja | ja |
| Modernisierungsumlage | 8 | % p. a. der Kosten | [[Mieterhoehung]] | dito | nein | ja |
| Modernisierungs-Kappung | 3 (2 bei Miete < 7 EUR/m²) in 6 Jahren | EUR/m² | dito | dito | nein | ja |
| § 559e Heizung gefördert | 10 % nach Förderabzug; Kappung 0,50 EUR/m² in 6 J. | % / EUR/m² | dito | dito | nein | ja |
| Mietpreisüberhöhung § 5 WiStrG | > 20 über üblichem Entgelt | % | dito | dito | nein | ja |
| **Kommunal / Land** | | | | | | |
| Zweckentfremdung Bremen: Ferienwohnung | > 90 | Tage/Kalenderjahr | [[Regionale-Rechtsmatrix]] (C) | 2026-09-25 geprüft extern / unbekannt | ja | ja |
| Zweckentfremdung Bremen: Leerstand | > 6 | Monate | dito | dito | ja | ja |
| Solarpflicht NI | ab 50 m² Dachfläche, mind. 50 % Belegung | m² / % | [[Regionale-Rechtsmatrix]] | seit 01.01.2025 / unbekannt | ja | ja |
| Straßenausbaubeiträge NI | Kann-Regel; ca. 56 % Gemeinden ohne Beiträge | % Gemeinden | [[Regionale-Rechtsmatrix]], Backlog (B) | 09/2026 / unbekannt | ja | ja |
| Grundsteuermodell | NI Flächen-Lage; HB Bundesmodell; eigene u. a. BY, BW, HE, HH, NDS | Text | [[Regionale-Rechtsmatrix]], [[Betriebskosten]] | 2026-09-30 / unbekannt bzw. aktuell | ja | ja |
| Grundsteuer-Hebesätze | **LÜCKE** | % | – | – | ja | ja |
| **Krisen / Finanzierung** | | | | | | |
| Corona-Moratorium Zeitraum | 01.04.–30.06.2020 | Datum | [[Corona-Mietmoratorium]] | 2020-04 / historisch | nein | ja |
| Rückzahlungsfrist | bis 30.06.2022 (2 Jahre) | Datum | dito | dito | nein | ja |
| Verzinsung Rückstände | 4 (unbestätigt) | % | dito | dito | nein | ja |
| Videobesichtigung: Kleindarlehensgrenze | 600.000 (vorher 400.000) | EUR | [[Krisenregel-als-Dauerrecht]] | 2022-10 / unbekannt | nein | ja |
| Videobesichtigung: Abschlag Beleihungswert | ≥ 5 | % | dito | dito | nein | ja |
| Videobesichtigung: Mindest-RND | 40 | Jahre | dito | dito | nein | ja |
| CO₂-Vermieteranteil Wohngebäude | 0–95 (10 Stufen) | % | [[CO2-Kostenaufteilung]] | 2026-09-30 / unbekannt | nein | ja |

---

## 6. Spielerentscheidungen, Lerninhalte, Disclaimer

### 6.1 Entscheidungen mit steuerlich-rechtlicher Wirkung

| Entscheidung | Optionen | Engine-Wirkung | Lernziel / Beleg |
|---|---|---|---|
| Kaufpreisaufteilung im Kaufvertrag | Finanzamt überlassen / eigene sachgerechte Aufteilung / aggressive Aufteilung | AfA-BMG ↑; Prüfrisiko ↑ bei Abweichung (Design) | [[Kaufpreisaufteilung]] |
| Restnutzungsdauergutachten | ja / nein | AfA-Satz ↑, Kosten (Design), Anerkennungsrisiko | [[Restnutzungsdauergutachten]] |
| Sanierungszeitpunkt | innerhalb 3 Jahre / nach 3 Jahren / gestaffelt unter 15 % | sofort abziehbar vs. AfA | [[Anschaffungsnahe-Herstellungskosten-15-Prozent]] |
| Halten oder Verkaufen | vor / nach 10 Jahren | § 23-Steuer; Freigrenze | [[Spekulationsfrist]] |
| Erwerbsvehikel je Objekt | privat / vvGmbH / vvGmbH unter Holding | Steuer laufend, Exit, Kassen-Trennung | [[Vermoegensverwaltende-GmbH]], [[Holding]] |
| Ausschütten oder thesaurieren | Betrag wählen | private Liquidität vs. Reinvestition | [[Thesaurierung]] |
| USt-Option für Gewerbeeinheit | ja / nein | Vorsteuer-Vorteil vs. 10-Jahres-Bindung | [[Umsatzsteuerpflichtige-Vermietung]], [[Vorsteuer]] |
| PV-Strom an Mieter in Kürzungs-GmbH | ja / nein | Kürzungsstatus (20-%-Grenze) | [[Erweiterte-Gewerbesteuerkuerzung]] |
| Betriebsimmobilie des eigenen Betriebs | privat + Vermietung an eigene GmbH / Schwesterstruktur | Betriebsaufspaltungs-Flag | [[Betriebsaufspaltung]] |
| Partnerdarlehen / Ehegattenschaukel | ja / nein | WK ↑ bzw. neue AfA-BMG; Prüfrisiko | [[Ehegattendarlehen]], [[Ehegattenschaukel]] |
| Standortwahl | Gemeinde mit/ohne MPB, Kappung 15/20 %, GrESt | Mietpfad, Kaufnebenkosten | [[Regionale-Rechtsmatrix]] |
| Aufteilungsstrategie MFH | aufteilen / halten | Regel-Gates (Milieuschutz, § 250, Sperrfrist) | [[Aufteilung-in-Wohnungseigentum]], [[Milieuschutz]] |
| Regulierungsreserve | Betrag/Jahr | Puffer für Pflichten | [[Regulatorisches-Bestandsrisiko]] |
| Reaktion auf Ankündigung | jetzt handeln / abwarten | Kosten vor/nach Inkrafttreten | [[Politische-Vorhaben-einschaetzen]] |

### 6.2 Tooltips (1–3 Sätze, mit Wikilink)

1. **Steuerliches Ergebnis ≠ Cashflow** – Zinsen mindern beides, die Tilgung nur den Cashflow, die AfA nur das steuerliche Ergebnis. Deshalb kann eine Wohnung steuerlich Verlust machen und trotzdem Geld kosten – oder umgekehrt. → [[Steuerliches-Ergebnis]]
2. **AfA** – Abgeschrieben wird nur der Gebäudeanteil, nicht Grund und Boden. Der Satz hängt vom Fertigstellungsjahr ab (vor 1925: 2,5 %, 1925–2022: 2 %, nach 2022: 3 %; Arbeitsstand 09/2026, vor Echtentscheidung prüfen). → [[AfA]]
3. **Kaufpreisaufteilung** – Je höher der Gebäudeanteil, desto höher die AfA über viele Jahre. Die Aufteilung muss aber sachgerecht sein; das Finanzamt kann sie verwerfen. → [[Kaufpreisaufteilung]]
4. **Restnutzungsdauergutachten** – Ein Gutachten kann eine kürzere Nutzungsdauer und damit eine höhere jährliche AfA belegen. Ob das Finanzamt es anerkennt, ist nicht sicher. → [[Restnutzungsdauergutachten]]
5. **15-%-Grenze** – Übersteigen Instandsetzungs- und Modernisierungskosten in den ersten drei Jahren netto 15 % der Gebäude-Anschaffungskosten, sind sie grundsätzlich nicht mehr sofort abziehbar. Sanierungen deshalb vor dem Kauf steuerlich planen. → [[Anschaffungsnahe-Herstellungskosten-15-Prozent]]
6. **Zufluss und Abfluss** – Steuerlich zählt das Jahr, in dem das Geld fließt, nicht der Zeitraum, für den es gedacht ist. Auch Nebenkostenvorauszahlungen sind Einnahmen. → [[Zufluss-und-Abflussprinzip]]
7. **Werbungskosten** – Zinsen, laufende Kosten, Steuerberatung und Fahrten mindern die Steuer; Tilgung und Rücklagenzuführung nicht. Belege sammeln, auch Kleinbeträge. → [[Werbungskosten-bei-Vermietung]]
8. **Grenzsteuersatz** – Entscheidend ist der Steuersatz auf den „obersten“ Euro, nicht der Durchschnittssatz. Das Spiel rechnet vereinfacht ohne Soli und Kirchensteuer. → [[Grenzsteuersatz]]
9. **Steuererstattung** – Eine Erstattung durch Anfangsverluste ist kein Cashflow der Immobilie; sie schrumpft, wenn die Zinsen sinken. Großzügig planen und sich nicht zu sehr über die Erstattung freuen. → [[Cashflow-vor-und-nach-Steuern]]
10. **Spekulationsfrist** – Im Privatvermögen ist ein Verkauf innerhalb von zehn Jahren grundsätzlich steuerpflichtig; dabei mindert die bereits genutzte AfA die Anschaffungskosten. Zehn Jahre zu warten ist nicht automatisch die beste Entscheidung. → [[Spekulationsfrist]]
11. **Gewerblicher Grundstückshandel** – Wer viele Objekte in kurzer Zeit kauft und verkauft, kann gewerblich werden. Die genauen Kriterien sind im Spiel nicht hinterlegt – dieser Hinweis ist nur eine Warnung. → [[Spekulationsfrist]]
12. **Nutzen-Lasten-Wechsel** – Kaufvertrag, Nutzen-Lasten-Wechsel und Grundbucheintrag sind drei verschiedene Termine. Ab dem Nutzen-Lasten-Wechsel gehören Mieten und Kosten dir. → [[Nutzen-Lasten-Wechsel]]
13. **Umsatzsteuer-Option** – Gewerbeflächen dürfen nur an Mieter mit Vorsteuerabzug umsatzsteuerpflichtig vermietet werden. Dann holst du die Vorsteuer aus Handwerkerrechnungen zurück – musst aber zehn Jahre auf die Mieterqualität achten. → [[Umsatzsteuerpflichtige-Vermietung]]
14. **Vermögensverwaltende GmbH** – In der GmbH wird der Gewinn auf Gesellschaftsebene besteuert, nicht mit deinem persönlichen Satz. Privat ausgeben kannst du ihn erst nach einer Ausschüttung, die erneut besteuert wird. → [[Vermoegensverwaltende-GmbH]]
15. **Erweiterte Kürzung** – Eine Immobilien-GmbH ist nicht automatisch gewerbesteuerfrei. Die Kürzung braucht einen Antrag und strenge Voraussetzungen, z. B. Grenzen für Stromlieferungen an Mieter. → [[Erweiterte-Gewerbesteuerkuerzung]]
16. **Holding / Beteiligungsprivileg** – Ausschüttungen an eine Holding sind zu 95 % steuerfrei, wenn die Beteiligungsschwellen erfüllt sind (10 % KSt, 15 % GewSt). Die Belastung liegt dann bei rund 1,5 % der Ausschüttung. → [[Beteiligungsprivileg]]
17. **Thesaurierung** – Gewinne in der Gesellschaft zu lassen ist zunächst ein Steueraufschub, keine endgültige Ersparnis. Sinnvoll vor allem, wenn du das Geld privat nicht brauchst. → [[Thesaurierung]]
18. **Betriebsaufspaltung** – Wer eine Immobilie privat kauft und an die eigene Betriebs-GmbH vermietet, macht Immobilie und Anteile steuerlich gewerblich. Das kann bei der späteren Auflösung teuer werden. → [[Betriebsaufspaltung]]
19. **Bürgschaft** – Die GmbH begrenzt die Haftung nur auf dem Papier, wenn die Bank eine private Bürgschaft verlangt. → [[Vermoegensverwaltende-GmbH]]
20. **Transparenzregister** – Seit 28.12.2022 sind Angaben zu Immobilien im Transparenzregister vorgeschrieben. Wer über mehrstufige Gesellschaften hält, sollte seine Pflichten prüfen lassen. → [[Transparenzregister]]
21. **Grunderwerbsteuer** – Der Satz hängt vom Bundesland des Grundstücks ab (3,5–6,5 %) und gilt am Tag der Beurkundung. → [[Regionale-Rechtsmatrix]]
22. **Mietpreisbremse vs. Kappungsgrenze** – Die Mietpreisbremse begrenzt die Miete bei Neuvermietung, die Kappungsgrenze Erhöhungen im laufenden Vertrag (20 % bzw. 15 % in drei Jahren). Ob sie gelten, entscheidet die Gemeinde in der Landesverordnung. → [[Mieterhoehung]]
23. **Milieuschutz** – In Milieuschutzgebieten kann die Aufteilung eines Mehrfamilienhauses untersagt sein. Vor einer Aufteilungsstrategie zuerst prüfen. → [[Milieuschutz]]
24. **Kündigungssperrfrist** – Nach Umwandlung in Eigentumswohnungen ist die Kündigung bestehender Mieter für mehrere Jahre gesperrt (Regel 3, in gelisteten Gemeinden 5 Jahre). → [[Regionale-Rechtsmatrix]]
25. **Verwertungskündigung** – Eine höhere Miete ist kein Kündigungsgrund. Die Hürden der Verwertungskündigung gelten als hoch. → [[Verwertungskuendigung]]
26. **Krisenrecht** – Krisenregeln laufen aus (Mietmoratorium) oder bleiben mit neuen Bedingungen (Videobesichtigung mit Beleihungsabschlag). Nicht darauf bauen, dass sie bleiben. → [[Krisenregel-als-Dauerrecht]]
27. **Corona-Mietmoratorium** – Die Miete wurde 2020 nur aufgeschoben, nicht erlassen; Rückstände waren bis 30.06.2022 nachzuzahlen. → [[Corona-Mietmoratorium]]
28. **Politische Ankündigungen** – Vorhaben kommen oft früher, später oder anders als angekündigt. Miss sie an ihrer Umsetzung. → [[Politische-Vorhaben-einschaetzen]]
29. **Regulatorisches Risiko** – Neue Pflichten (Heizung, Solar, CO₂-Kosten) lösen Investitionen aus, die die normale Instandhaltungsreserve nicht abdeckt. → [[Regulatorisches-Bestandsrisiko]]
30. **Quellenkritik** – Viele Steuer-Tipps im Spiel stammen von einem Steuerberater, der Strukturberatung verkauft. Pauschalurteile („Holding ist essentiell“) deshalb mit Gegenpositionen lesen. → [[Holding]]

### 6.3 Disclaimer-Konzept (Spiel ≠ Steuerberatung)

Grundlage: [[AGENTS]]-Regel 5 („Keine Steuer- oder Rechtsberatung im Einzelfall: auf Stand, Quelle und
fachliche Prüfung hinweisen“) und [[Vault-Spezifikation]] 0 („Ausdrücklich nicht: Rechts- oder
Steuerberatung im Einzelfall“).

1. **Start-Disclaimer (einmalig, bestätigen):** „Dieses Spiel ist ein Trainingswerkzeug. Es vereinfacht
   Steuern und Recht bewusst und verwendet teils veraltete oder ungeprüfte Werte. Es ersetzt keine
   Steuer- oder Rechtsberatung. Triff reale Entscheidungen nur nach fachlicher Prüfung.“
2. **Wert-Badge an jeder Zahl** (aus den Datenfeldern): `Stand`, `gueltigkeit`, `Sicherheit`,
   Fälligkeit (`geprueft_am + pruef_intervall < heute` → „Prüfung fällig“), Wikilink zur Vault-Notiz.
   Farbcodes: geprüft/aktuell – unbekannt – historisch – **Spielwert (Design)** – **nicht modelliert (Lücke)**.
3. **Vereinfachungs-Marker:** Jede Formel mit ANNAHME (Design) zeigt im Tooltip „Vereinfachung im
   Spiel: …“ (z. B. „ohne Soli/Kirchensteuer“, „Verlustvortrag nicht modelliert“).
4. **Keine personalisierte Empfehlung:** Dialoge zeigen Vergleiche „unter diesen Annahmen“, nie
   „Du solltest eine GmbH gründen“. Der Strukturberater-Dialog endet mit „Lass das von einer
   Steuerberatung prüfen“ statt mit einem Urteil.
5. **Fiktive Ereignisse kennzeichnen:** Szenario-Ereignisse tragen ein deutliches Label „fiktiv“ und
   werden nie mit realen Daten (historische Ereignisse) vermischt angezeigt.
6. **Rechtsstand-Datum im HUD:** „Rechtsstand der Spieldaten: 30.09.2026 (Vault)“; bei Spielzeit nach
   diesem Datum: „Spielwelt – reale Rechtslage kann abweichen“.
7. **Keine Eingabe echter Steuerdaten** (Einkommen, Steuer-ID) – Avatare arbeiten mit Archetypen.
8. **Quellenkritik als Spielinhalt:** Hinweis auf kommerzielle Interessen der Anbieterquellen (in den
   Vault-Notizen jeweils dokumentiert) als eigener Lerninhalt.

---

## 7. Lücken und Widersprüche

### 7.1 Widersprüche

| Nr. | Widerspruch | Fundstellen | Umgang im Spiel |
|---|---|---|---|
| W1 | AfA pauschal 2 %/50 J. „Baujahr nach 1925“ (2021) vs. Staffel 2,5/2/3 % nach Fertigstellung | [[AfA]], [[Restnutzungsdauergutachten]], [Q-immocation-Blog-3-wichtigste-Steuertipps] | Staffel verwenden; 2021-Wert nur historisch |
| W2 | Grenzsteuersatz 30–45 % vs. 42 % „inkl. Soli“ | [[Grenzsteuersatz]] | Korridor als Avatar-Parameter; Soli nicht modelliert |
| W3 | Ausschüttungsbelastung 1,5 % vs. 0,75 % | [[Beteiligungsprivileg]] (aufgelöst mit „rund 30 %“), Backlog weiterhin offen | 1,5 % mit Hinweis „rund 30 % Gesamtbelastung angenommen“ |
| W4 | Kürzung bei Vermietung an Schwestergesellschaft: Quelle empfiehlt und schließt zugleich aus | [[Erweiterte-Gewerbesteuerkuerzung]], [[Steuersatzgefaelle]], [[Betriebsaufspaltung]] | Kürzungsstatus „unsicher“ im Unternehmer-Szenario |
| W5 | Holding „essentiell“ / vvGmbH „immer Vorteil“ vs. „jede Immobilie eigene Entscheidung“ / Privatkauf bei Wertsteigerung / „erst ab Portfoliogröße“ | [[Holding]], [[Vermoegensverwaltende-GmbH]] | keine Pauschalempfehlung; Vergleichsrechner |
| W6 | „Dachgesellschaft“ einmal für vvGmbH unter den Holdings, einmal für Holding | [[Holding]] | Spiel: „Holding“ = oberste Ebene |
| W7 | Holding-Empfehlung vs. Firmengeflecht als Missstand (Transparenzregister) | [[Transparenzregister]] | Lerninhalt Steueroptimierung ≠ Verschleierung |
| W8 | USt-Vermietung „einzelner Wohnungen“ vs. Voraussetzung vorsteuerabzugsberechtigter Mieter | [[Umsatzsteuerpflichtige-Vermietung]] | Option nur für Gewerbeeinheiten |
| W9 | CO₂-Vermieteranteil max. 90 % (Einordnung in [Q-immocation-News-Koalitionsvertrag-2021]) vs. 95 % (Gesetzestabelle) | [[CO2-Kostenaufteilung]], [[Politische-Vorhaben-einschaetzen]] | 95 % (Tabelle mit Gesetzesbezug) |
| W10 | GrESt: Rechtsmatrix nennt 16 Länder, [[Kaufnebenkosten]] `offen` + Backlog: „übrige Länder fehlen“; Tabelle ohne Quelle (`quellen: []`) | [[Regionale-Rechtsmatrix]], [[Kaufnebenkosten]] | Werte nutzen, Sicherheit C anzeigen |
| W11 | Bremer Kappungsgrenzenverordnung: 06.08.2024 vs. 01.09.2024 (Verordnungsdatum oder Inkrafttreten?) | [[Mieterhoehung]] | `gueltig_ab` 2024-09-01, Feld `konflikt` setzen |
| W12 | „Berechtigtes Interesse“: Vault-Notiz = Grundbucheinsicht (§ 12 GBO); [[Verwertungskuendigung]] verlinkt sie als Kündigungsvoraussetzung | [[Berechtigtes-Interesse]], [[Verwertungskuendigung]] | im Spiel zwei getrennte Begriffe |
| W13 | Kalkulationsanleitung behandelt Steuer nur als Belastung, Steuernotizen kennen Erstattung bei Verlust | [[Steuerliches-Ergebnis]], [[Cashflow-vor-und-nach-Steuern]] | Erstattung modellieren |
| W14 | 10-Jahres-Frist als Argument für Privatkauf vs. „nicht immer sinnvoll“ | [[Spekulationsfrist]] | Entscheidung offen lassen |
| W15 | Aufteilung: Quelle stellt drei Voraussetzungen als vollständig dar; Vault ergänzt Vorkaufsrecht, Sperrfrist, § 250, Kosten | [[Milieuschutz]], [[Aufteilung-in-Wohnungseigentum]] | alle Gates anzeigen, fehlende als Lücke |
| W16 | Corona-Zins 4 % vs. evtl. gesetzliche Verzugszinsen (Backlog-Frage) | [[Corona-Mietmoratorium]] | 4 % mit Hinweis „unbestätigt“ |
| W17 | Methodisch: Interne Recherchen sind laut Spezifikation „keine Wissensquelle“, liefern aber die aktuellen Steuerwerte (AfA-Staffel, 15 %, Freigrenze, Kürzungsgrenzen) | [[Vault-Spezifikation]] 7.2, [[AfA]] u. a. | Sicherheit C anzeigen |
| W18 | `gueltigkeit: pruefen` in [[Vault-Regeln]] vs. abgeschafft in [[Vault-Spezifikation]] v2 | beide | Spezifikation gilt; Fälligkeit berechnen |
| W19 | [[Regel-Uebersicht]] trägt Alias „Regionale Rechtsmatrix“, die Notiz [[Regionale-Rechtsmatrix]] existiert parallel mit Werten (Übergangszustand vor P6) | beide | Regelwerte aus Rechtsmatrix als Kandidaten übernehmen |
| W20 | [[Mietendeckel]] ist `historisch`, Text erklärt nicht warum (BVerfG-Ausgang nicht beschrieben) | [[Mietendeckel]] | nur als Szenario-Ereignis |

### 7.2 Lücken (vom Auftrag ausdrücklich genannt und weitere)

**Privatperson / Einkommensteuer**
- L1 **Einkommensteuertarif § 32a EStG** (Zonen, Grundfreibetrag, Formel), Solidaritätszuschlag,
  Kirchensteuer – nicht im Vault (nur Korridor 30–45 %).
- L2 Zusammenveranlagung/Splitting; Verlustvortrag/-rücktrag § 10d; Grenzen der Verlustverrechnung.
- L3 Kaufnebenkosten und Makler: AfA-Bemessungsgrundlage oder sofort abziehbar.
- L4 AfA-Zeitanteil im Erwerbs-/Veräußerungsjahr; Methode der Bodenwertermittlung; Grenzen der
  Kaufpreisaufteilung (BMF-Arbeitshilfe, BFH).
- L5 **Degressive AfA** (§ 7 Abs. 5a: Voraussetzungen, Rechenweg), **Sonder-AfA § 7b**,
  **Denkmal-/Sanierungs-AfA §§ 7h, 7i, 10f** – nicht bzw. nur als Backlog-Hinweis vorhanden.
- L6 Anerkennungskriterien und Kosten des Restnutzungsdauergutachtens.
- L7 15-%-Grenze: Stichtag, Rückwirkung, Einbeziehung mehrerer Rechnungen; allgemeine Abgrenzung
  Erhaltungs- vs. Herstellungsaufwand außerhalb der drei Jahre.
- L8 § 23: Stichtag (Vertrag vs. NLW), Veräußerungskosten, Verluste; **gewerblicher Grundstückshandel**
  (keine Kriterien/Objektgrenze im Vault).
- L9 Steuerliche Behandlung von WEG-Hausgeld/Erhaltungsrücklage, Fahrtkosten-Pauschalen, verbilligte
  Vermietung, Liebhaberei, Sonderfälle § 11 EStG.
- L10 USt-Satz, Formvorschriften der Option, Berechnung der Vorsteuerberichtigung § 15a UStG.
- L11 Erbschaft/Schenkung, Nießbrauch, „Verkaufen statt vererben“ (Podcast #586 nur Kapitelmarke).
- L12 Steuerzahlungs-Timing (Vorauszahlungen, Erstattung im Folgejahr).

**Rechtsformen**
- L13 Soli auf KSt (15,825 % nur Backlog-Hinweis), Gewerbesteuer-Messzahl und -Hebesätze
  (`hebesaetze.csv` fehlt), Aufschlüsselung der Pauschalen 15 %/30 %.
- L14 Ausschüttung an Privatperson (Abgeltungsteuer/Teileinkünfteverfahren), Gesamtbelastung bis Privat.
- L15 Gründungs-, Verwaltungs-, Jahresabschlusskosten; Mindestkapital; Bankpraxis für GmbH-Finanzierung.
- L16 Einbringung bestehender Objekte (GrESt, § 23), Grunderwerbsteuer bei Anteilsübertragungen/Share Deals.
- L17 Gewinnermittlung der GmbH (Bilanzierung), AfA in der GmbH, Kürzung bei Veräußerungen.
- L18 Betriebsaufspaltung: Voraussetzungen, Steuerfolgen der Entnahme.
- L19 Quantitative Schwelle „ab wann lohnt sich GmbH/Holding“ (Portfoliogröße, Rendite, Kosten).
- L20 GbR/Familien-GbR, Familienstiftung – laut Spezifikation 6.2 Mindestumfang, aber keine Notizen.

**Regionales Recht / Daten**
- L21 `20-Regeln` leer, `regeln-index.csv` ohne Datenzeilen – Regelwerte nur in Fließtext/Sicherung.
- L22 Grunderwerbsteuer: Primärquellen und `gueltig_ab` je Land (außer HB, TH).
- L23 **Grundsteuer**: Modelle aller 16 Länder widerspruchsfrei, Hebesätze, Berechnung (Messbetrag) –
  nicht im Vault; Rechtsprechung zur Umlage der reformierten Grundsteuer offen.
- L24 Mietpreisbremse/Kappung/Sperrfrist außerhalb Bremen und der fünf NI-Umlandgemeinden;
  vollständige NI-Gemeindeliste und Inhalt der Änderung vom 03.12.2025.
- L25 Konkrete Milieuschutzsatzungen, § 250-BauGB-Verordnungen (HB/NI offen), Vorkaufsrechtssatzungen.
- L26 Zweckentfremdung außerhalb Bremens; Rauchwarnmelder-Wartungspflicht je Land;
  Straßenausbaubeiträge je Gemeinde.

**Mietrecht / sonstiges Recht**
- L27 Verwertungskündigung (Norm, Voraussetzungen, Fristen), Eigenbedarf, Kündigung bei Zahlungsverzug
  (Schwellen, Schonfrist), Vorkaufsrecht des Mieters bei Umwandlung.
- L28 Transparenzregister: Meldepflichten je Struktur, Einsicht, Sanktionen; Definition wirtschaftlich
  Berechtigter (Schwellen).
- L29 Ausgang BVerfG 2 BvF 1/20; aktuelle Mietbegrenzungsinstrumente; Evaluationsdaten.
- L30 Kriterien BGH XII ZR 8/21; Widerrufsrecht bei unbesichtigter Vermietung.

### 7.3 Vorschläge für den Recherche-Backlog des Vaults (nicht eingetragen – Vault nur gelesen)

Prio für das Spiel: (1) § 32a-Tarif + Soli, (2) Grunderwerbsteuer 16 Länder aus Primärquellen in
`20-Regeln`, (3) GmbH-Gesamtbelastung inkl. GewSt und Ausschüttung an Privat, (4) Strukturkosten
vvGmbH/Holding, (5) Kaufnebenkosten in der AfA-BMG, (6) degressive AfA/§ 7b, (7) Grundsteuer-Modelle
und Hebesätze (`hebesaetze.csv`), (8) gewerblicher Grundstückshandel, (9) Mieterschutzverordnungen
weiterer Länder, (10) Verlustverrechnung § 10d.

---

## Anhang: Ausgewertete Notizen (Status-Übersicht)

| Notiz | status | gueltigkeit | stand | geprueft_am |
|---|---|---|---|---|
| [[AfA]] | entwurf | unbekannt | 2026-09-27 | – |
| [[AfA-Bemessungsgrundlage]] | entwurf | unbekannt | 2021-02 | – |
| [[Anlage-V]] | entwurf | unbekannt | 2021-02 | – |
| [[Anschaffungsnahe-Herstellungskosten-15-Prozent]] | entwurf | unbekannt | 2026-09-27 | – |
| [[Ehegattendarlehen]] | entwurf | unbekannt | – | – |
| [[Ehegattenschaukel]] | entwurf | unbekannt | 2026-09 | – |
| [[Grenzsteuersatz]] | entwurf | unbekannt | 2021-02 | – |
| [[Kaufpreisaufteilung]] | entwurf | unbekannt | 2026-09 | – |
| [[Nutzen-Lasten-Wechsel]] | entwurf | unbekannt | – | – |
| [[Restnutzungsdauergutachten]] | entwurf | unbekannt | – | – |
| [[Spekulationsfrist]] | entwurf | unbekannt | 2026-09-27 | – |
| [[Steuerliches-Ergebnis]] | entwurf | unbekannt | 2021-02 | – |
| [[Steuersatzgefaelle]] | entwurf | unbekannt | 2020-02 | – |
| [[Umsatzsteuerpflichtige-Vermietung]] | entwurf | unbekannt | 2021-05 | – |
| [[Vorsteuer]] | entwurf | unbekannt | 2021-05 | – |
| [[Werbungskosten-bei-Vermietung]] | entwurf | unbekannt | 2021-02 | – |
| [[Zufluss-und-Abflussprinzip]] | entwurf | unbekannt | 2021-02 | – |
| [[Beteiligungsprivileg]] | entwurf | unbekannt | 2026-09 | 2026-09-30 |
| [[Betriebsaufspaltung]] | entwurf | unbekannt | 2020-02 | – |
| [[Erweiterte-Gewerbesteuerkuerzung]] | entwurf | unbekannt | 2026-09-27 | – |
| [[Holding]] | entwurf | unbekannt | 2026-09 | – |
| [[Thesaurierung]] | entwurf | unbekannt | 2020-02 | – |
| [[Vermoegensverwaltende-GmbH]] | entwurf | unbekannt | 2026-09-27 | – |
| [[Regionale-Rechtsmatrix]] | entwurf | unbekannt | 2026-09-30 | 2026-09-30 |
| [[Mieterhoehung]] | entwurf | unbekannt | 2026-09-30 | 2026-09-30 |
| [[Kaufnebenkosten]] | entwurf | unbekannt | 2026-09-30 | 2026-09-30 |
| [[Milieuschutz]] | entwurf | unbekannt | – | – |
| [[Mietendeckel]] | entwurf | historisch | 2023-03 | – |
| [[Corona-Mietmoratorium]] | entwurf | historisch | 2020-04 | – |
| [[Krisenregel-als-Dauerrecht]] | entwurf | unbekannt | 2022-10 | – |
| [[Stoerung-der-Geschaeftsgrundlage]] | entwurf | unbekannt | 2022-01 | – |
| [[Transparenzregister]] | entwurf | unbekannt | 2022-12 | – |
| [[Wirtschaftlich-Berechtigte]] | entwurf | unbekannt | 2022-12 | – |
| [[Berechtigtes-Interesse]] | entwurf | aktuell | 2021-11 | – |
| [[Widerrufsrecht-bei-unbesichtigter-Vermietung]] | entwurf | unbekannt | 2020-03 | – |
| [[BGH-Urteile-zu-Betriebskosten]] | entwurf | aktuell | 2026-09-30 | 2026-09-30 |
| [[Verwertungskuendigung]] | entwurf | unbekannt | – | – |
| [[Regulatorisches-Bestandsrisiko]] | entwurf | unbekannt | 2026-09-27 | – |
| [[Aufteilung-in-Wohnungseigentum]] | entwurf | unbekannt | – | – |
| [[Politische-Vorhaben-einschaetzen]] | entwurf | unbekannt | 2026-09-30 | 2026-09-30 |
| [[Cashflow-vor-und-nach-Steuern]] | entwurf | unbekannt | – | – |
| [[CO2-Kostenaufteilung]] | entwurf | unbekannt | 2026-09-30 | 2026-09-30 |
| [[Gebaeudemodernisierungsgesetz]] | entwurf | unbekannt | 2026-09-27 | 2026-09-30 |
| [[Betriebskosten]] | entwurf | aktuell | 2026-09-30 | 2026-09-30 |

Weitere gelesene Dateien: `AGENTS.md`, [[Vault-Regeln]], [[Vault-Spezifikation]], [[Regel-Uebersicht]],
`40-Daten/regeln-index.csv`, `40-Daten/gebiete.csv`, `40-Daten/datenpunkte.csv`,
`99-Pflege/schemas/{regel,recht,urteil,common}.schema.json`, `99-Pflege/schemas/themen.json`,
`99-Pflege/Recherche-Backlog.md`, `99-Pflege/berichte/regelwerte-alt.csv`,
`99-Pflege/berichte/Verbesserungsplan-v2.md`, `tools/lib/vault.mjs` (Regelauflösung),
`tools/build.mjs` (Index-Erzeugung) sowie die immocation-Quellnotizen 3-wichtigste-Steuertipps,
9-Steuerkniffe-beim-Kauf, Steuerberater-Tricks, Co-Investor-steueroptimiert,
Einzelunternehmer-Gewerbeimmobilien, Gewerbe-umsatzsteuerpflichtig-vermieten, Gesetzesaenderungen-2024,
Podcasts #586, #625, #627, #676, #678, News Koalitionsvertrag-2021, Bauministerium-2021,
Aenderungen-2022, Corona-Update-2/-3, Transparenzregister, Blog MFH-in-ETW-umwandeln und die interne
Tiefenrecherche 2026-09-27.
