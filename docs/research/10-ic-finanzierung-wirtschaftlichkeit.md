# 10 – Fachspezifikation: Finanzierung, Banklogik & Wirtschaftlichkeitsrechnung

> Grundlage für (a) die **Kalkulations-Engine** und (b) das **Bank-/Kreditmodell** des
> Immobilien-Investment-Simulationsspiels. Alle Fachaussagen stammen aus dem Obsidian-Vault
> `/home/user/IC/vault` (nur gelesen, nicht verändert). Wo der Vault nichts hergibt, steht
> **LÜCKE**; wo für das Spiel eine Festlegung nötig ist, die der Vault nicht trägt, steht
> **ANNAHME**.

| | |
|---|---|
| Ausgewertet am | 2026-11-26 |
| Vault-Stand | Notizen bis `aktualisiert: 2026-10-01` |
| Fachgebiet | Finanzierung, Banklogik, Wirtschaftlichkeitsrechnung |
| Gelesene Kernnotizen | alle 18 Notizen in `30-Wissen/Finanzierung`, alle 24 in `30-Wissen/Wirtschaftlichkeit` (inkl. [[Formelsammlung]]), `99-Pflege/schemas/kennzahlen.json`, vier Bank-Prozessnotizen, 20 immocation-Quellnotizen, zwei interne Recherchequellen, verlinkte Notizen (u. a. [[Regionale-Rechtsmatrix]], [[Instandhaltungsplanung]], [[Verwaltungskosten]], [[Nicht-umlagefaehige-Kosten]], [[Steuerliches-Ergebnis]], [[AfA]], [[Grenzsteuersatz]], [[Portfolio-Risiko]], [[Recherche-Backlog]], Fallstudien) |

---

## 0. Lesehinweise und Konventionen

### 0.1 Quellenlage – wichtig für das Spieldesign

- **Fast alle Fachaussagen stammen von einem einzigen Anbieter (immocation, Quellstufe 5,
  Sicherheit C)**, überwiegend aus 2020–2021, also der Niedrigzinsphase. immocation ist über
  eine Vermittlungspartnerschaft (Interhyp) kommerziell mit dem Thema Finanzierung verbunden
  ([[Finanzierungsvermittler]], [[Q-immocation-Seite-Finanzierung-mit-Interhyp]]).
- **Bankparameter 2026** (Mietanrechnung 60–80 %, Stresszins 5–6 %, Beleihungswert ~10 % unter
  Verkehrswert, EK 20–30 %, Zins 3,9–4,5 %) stehen in [[Prozess-Finanzierungsdossier-Bank]] und
  [[Haushaltsrechnung]] als „Marktbeobachtung aus Vermittler-Übersichten, Sicherheit B, Stand
  30.09.2026“. Die Prozessnotiz hat **`quellen: []`** – die Übersichten sind im Vault nicht als
  Quellnotiz hinterlegt.
- Der Vault betont mehrfach: Stresszins, Mietabschlag, Beleihungswert oder DSCR **nicht als
  allgemeine Bankvorschrift darstellen** ([[Kalkulatorischer-Stresszins]], [[Portfolio-Risiko]]).
  Für das Spiel heißt das: Bankparameter sind **institutsabhängige Profilwerte**, keine Gesetze.
- Rechtlich belegt ist nur: Die Bank muss bei Verbraucher-Immobiliendarlehen die
  Kreditwürdigkeit prüfen (§§ 505a, 505b BGB); die Prüfmethoden legt sie selbst fest
  ([[Prozess-Finanzierungsdossier-Bank]]).

### 0.2 Frontmatter-Lesart

`gueltigkeit` wird wie im Vault angegeben. Viele Notizen tragen `gueltigkeit: unbekannt` – dieser
Wert ist laut [[Vault-Regeln]] nicht vorgesehen (erlaubt: aktuell | pruefen | historisch) und
wird hier als „ungeprüft“ behandelt. `stand` ist der inhaltliche Stand der Aussage.

### 0.3 Zwei Parameterprofile

Weil der Vault für zentrale Bankgrößen zwei Datenstände liefert, sieht die Spezifikation zwei
umschaltbare Profile vor:

| Profil | Bedeutung | Einsatz im Spiel |
|---|---|---|
| **A „Niedrigzins 2021“** | Werte aus [[Q-immocation-Blog-Wie-lange-macht-die-Bank-mit]] (16.04.2021) u. a. | historisches Szenario / Lernmodus „so war es 2021“ |
| **B „Markt 2026“** | Werte aus [[Prozess-Finanzierungsdossier-Bank]], [[Haushaltsrechnung]], [[Zins]] (Stand 30.09.2026) | Standard für ein Spiel „heute“ |

### 0.4 Code-Konventionen (ANNAHME, nicht aus dem Vault)

```ts
type EUR  = number;   // Euro; intern ungerundet, Ausgabe auf Cent bzw. ganze Euro gerundet
type Rate = number;   // Dezimal: 0.035 = 3,5 %; „% p. a.“ immer als Jahreswert
type Monat = number;  // Simulationstakt = 1 Monat
// Jahreswerte = Summe der 12 Monatswerte. Monats- und Jahreswerte nie mischen
// (Warnung aus [[Cashflow]]: „Monats- und Jahreswerte nicht mischen“).
```

Der Vault verlangt für genaue Werte einen Tilgungsplan mit monatlicher Verrechnung
([[Annuitaet]], [[Tilgung]]); die Engine rechnet deshalb monatlich nachschüssig.

---

## 1. Begriffe und Kennzahlen

Format je Kennzahl: Formel (TypeScript-artig) · Einheit · typische Spanne · Interpretation ·
Quelle · Stand/gueltigkeit.

### 1.1 Mietbegriffe und Eingangsgrößen

#### K01 Kaufpreis und Kaufpreis je m²
```ts
kaufpreisJeM2 = kaufpreis / wohnflaeche_m2;          // EUR/m²
```
- **Einheit:** EUR bzw. EUR/m² · **Spanne (Datenpunkte, nicht repräsentativ):** 600 EUR/m²
  (Chemnitz-Randlage, Fall 2020), 1.000–1.533 EUR/m² (Hildesheim 2011/2013), 2.400 EUR/m²
  (Voreinstellung Bierdeckelrechner), Bremen ETW-Transaktionen 2025 Ø rund 2.520 EUR/m²
  ([[Marktdaten-Bremen-und-Umland]]).
- **Deutung:** Preis laut Kaufvertrag **ohne** Erwerbsnebenkosten. Bezugsgröße der
  Schnellkennzahlen, nicht der Kapitalbedarf. Aus Banksicht nicht über Marktwert kaufen.
- **Quelle:** [[Kaufpreis]] (stand unbekannt, gueltigkeit unbekannt)

#### K02 Jahresnettokaltmiete (JNKM)
```ts
jnkm = nettokaltmieteMonat * 12;                     // EUR/Jahr
```
- **Spanne:** Beispiele 4.200–14.400 EUR/Jahr. **Deutung:** wirtschaftlich „verdiente“ Miete;
  Basis von Brutto-/Nettorendite und Faktor. Keine Warmmiete einsetzen; „× 12“ unterstellt
  Vollvermietung.
- **Quelle:** [[Jahresnettokaltmiete]] (stand 2026-09, aktuell)

#### K03 Jahresbruttokaltmiete (JBKM)
```ts
jbkm = (nettokaltmieteMonat + kalteBetriebskostenMonat) * 12;   // EUR/Jahr
```
- **Deutung:** Nettokaltmiete plus kalte Betriebskosten (ohne Heizung). Nur relevant, weil die
  Bank laut Quelle 2021 hierauf ihren Mietabschlag rechnet. Ob die Quelle den Begriff wirklich so
  meint oder einfach „Kaltmiete“, ist offen (siehe Widerspruch W4).
- **Quelle:** [[Jahresbruttokaltmiete]] (stand 2021-04, gueltigkeit unbekannt)

#### K04 Ist-Miete / Sollmiete
```ts
istMieteMonat   // tatsächlich vereinbarte (Kauf) bzw. tatsächlich eingegangene Miete (Betrieb)
sollMieteMonat  // geschuldete bzw. nach Kauf erzielbare Miete (Szenario)
mietluecke = sollMiete - istMiete;   // Leerstand, Zahlungsausfall (Betrieb) bzw. Potenzial (Kauf)
```
- **Deutung:** Zwei Lesarten (Kauf vs. laufende Vermietung) sauber trennen. Exposé-Miete kann
  Wunschmiete sein; eine niedrige Ist-Miete lässt sich nur im Rahmen des Mietrechts anheben.
  Die Bank rechnet mit der **nachweisbaren** Miete (siehe B04).
- **Quelle:** [[Ist-Miete]], [[Sollmiete]] (stand 2026-09, aktuell)

### 1.2 Erwerbskosten und Kapitalbedarf

#### K05 Kaufnebenkosten (KNK)
```ts
function kaufnebenkosten(o: Objekt, p: Params) {
  const basisGrESt = o.kaufpreis - (o.inventarSeparat ?? 0);   // bewegl. Inventar (z. B. Einbauküche)
                                                              // mit realistischem Zeitwert; WEG-Rücklage NICHT abziehen
  const grest   = basisGrESt * p.grest[o.bundesland];          // Landessatz am Grundstücksort
  const notarGb = o.kaufpreis * p.qNotarGrundbuch;             // 0.015–0.02
  const makler  = o.makler ? o.kaufpreis * o.maklerQuoteKaeufer : 0;  // Satz: LÜCKE
  return { grest, notarGb, makler, summe: grest + notarGb + makler };
}
```
- **Einheit:** EUR · **Spanne:** GrESt 3,5–6,5 % (siehe Tabelle unten); Notar + Grundbuch
  „rund 2 %“ bzw. „ca. 1,5–2 %“; Makler **LÜCKE** (kein Satz im Vault).
- **Deutung:** Werden „in der Regel“ aus Eigenkapital bezahlt, weil ihnen kein Gegenwert
  gegenübersteht; nur wenige Banken finanzieren sie mit. Der Notar-/Grundbuchsatz ist eine
  Pauschale, die Gebühren sind tatsächlich gestaffelt (degressiv). Kosten der
  Grundschuldeintragung kommen hinzu, sind aber nicht beziffert.
- **Regeln:** Maßgeblich ist das Bundesland des Grundstücks, Satz am Tag der Beurkundung.
  Maklerhalbteilung (§ 656c BGB) gilt nur für Wohnung/Einfamilienhaus an Verbraucher, nicht für
  Mehrfamilienhäuser (§ 656b/c BGB, im Vault mit Sicherheit A geprüft). Anteil an der
  WEG-Erhaltungsrücklage darf die GrESt-Bemessung nicht mindern (BFH, Urt. v. 16.09.2020 –
  II R 49/17).
- **Quelle:** [[Kaufnebenkosten]] (stand 2026-09-30, gueltigkeit unbekannt),
  [[Regionale-Rechtsmatrix]] (stand 2026-09-30, gueltigkeit unbekannt, `quellen: []`),
  [[Prozess-Haushaltsplan-und-Vermoegensaufstellung]] (stand 2026-09-30, aktuell),
  [[Q-immocation-Blog-Kalkulation-in-6-Schritten]] (2020-11-10)

**Grunderwerbsteuer je Bundesland** (aus [[Regionale-Rechtsmatrix]], „Stand 2026“; Notiz ohne
Quellenangabe):

```ts
const GREST: Record<Bundesland, Rate> = {
  BW: 0.050, BY: 0.035, BE: 0.060, BB: 0.065, HB: 0.055 /* seit 01.07.2025 */,
  HH: 0.055, HE: 0.060, MV: 0.060, NI: 0.050, NW: 0.065, RP: 0.050, SL: 0.065,
  SN: 0.055, ST: 0.050, SH: 0.065, TH: 0.050 /* seit 01.01.2024 */,
};
```
Der Vault warnt: Mehrere Ratgeber 2026 nennen Bremen noch mit 5,0 % oder Thüringen mit 6,5 % –
veraltet. Für Steuersätze nur Landes- und Finanzamtsquellen verwenden.

#### K06 Gesamtkaufkosten
```ts
gesamtkaufkosten = kaufpreis + knk.summe;            // EUR
kreditsumme      = gesamtkaufkosten - eigenkapitalEingesetzt;
```
- **Deutung:** Was für den Erwerb insgesamt aufzubringen ist; Nenner der Nettomietrendite.
  Sofortsanierung, Finanzierungskosten und Startreserve sind **getrennt** zu führen und nicht
  zusätzlich als laufende Ausgabe anzusetzen.
- **Quelle:** [[Gesamtkaufkosten]] (stand 2026-09-27, gueltigkeit unbekannt)

#### K07 Kapitalbedarf (Liquiditätsplanung)
```ts
kapitalbedarf = gesamtkaufkosten + sofortsanierung + finanzierungskosten + startreserve;
```
- **Quelle:** [[Gesamtkaufkosten]]; Beispiel 300.000 EUR in [[Cashflow]] (hypothetisch,
  Tiefenrecherche 2026-09-27). Finanzierungskosten: **LÜCKE** (keine Werte im Vault).

#### K08 Eigenkapitalbedarf und Finanzierungsquote
```ts
// Definition A – Eigenkapital im Objekt ([[Eigenkapital]]):
ekImObjekt          = kaufpreis + knk.summe - darlehen;
finanzierungsquote  = darlehen / kaufpreis;            // Bezug: Kaufpreis OHNE Nebenkosten
// Definition B – gesamter Bedarf an eigenen Mitteln ([[Prozess-Haushaltsplan-und-Vermoegensaufstellung]]):
eigeneMittelBedarf  = knk.summe + (kaufpreis - darlehen) + anfangsrenovierung + liquiditaetspuffer;
```
- **Spanne:** Finanzierungsquote 50 % („sehr gesund, ohne Weiteres“) bis 100 % (2021: Bank prüft
  genau); 2026: EK „mindestens Kaufnebenkosten, oft 20–30 % gewünscht“.
- **Deutung:** „Anker“ der Finanzierung: bestimmt EK-Rendite (Hebel), Kredithöhe/Restschuld und
  Prüfintensität der Bank. **Engine trennt A und B** (siehe W22) – der Puffer ist ausdrücklich
  **kein** Eigenkapital im Objekt.
- **Quelle:** [[Eigenkapital]] (stand unbekannt, Warnung 2020–2021), [[Prozess-Haushaltsplan-und-Vermoegensaufstellung]] (2026-09-30, aktuell), [[Prozess-Finanzierungsdossier-Bank]] (2026-09-30)

### 1.3 Schnellkennzahlen

#### K09 Bruttomietrendite
```ts
bruttomietrendite = jnkm / kaufpreis;                // Rate
```
- **Spanne/Schwellen laut Vault** (alle ohne Angabe brutto/netto, überwiegend 2018–2021):

  | Wert | Aussage | Quelle |
  |---|---|---|
  | 3 % | leicht zu finden, ohne Wertsteigerungsspekulation nicht lohnend | [[Q-immocation-Blog-9-haeufigste-Fehler-beim-Kauf]] |
  | ~5 % | „ein genauerer Blick lohnt sich“, könnte sich selbst abbezahlen | [[Q-immocation-Tool-Bierdeckelrechnung]] |
  | ~6 % | typisch für selbst abzahlende Objekte | [[Q-immocation-Blog-9-haeufigste-Fehler-beim-Kauf]] |
  | 7 % | „das könnte klappen“ | [[Fallstudie-Adele-Fuerstenwalde]] |
  | 8 % | persönliches Ziel | [[Fallstudie-Dominik-Neunkirchen]] |
  | 10 % | Bankrechnung 2021 / „rar, Suche langwierig“ | [[Q-immocation-Blog-Wie-lange-macht-die-Bank-mit]] |
- **Deutung:** Erstfilter; ignoriert Nebenkosten, laufende Kosten, Finanzierung, Steuern. Hohe
  Bruttorendite garantiert keinen positiven Cashflow (Hildesheim: 8 % Rendite, −26 EUR/Monat).
  Schwellen hängen vom Zinsniveau ab; ob immocation sie nach 2022 angepasst hat: **LÜCKE**.
- **Quelle:** [[Bruttomietrendite]] (stand 2026-09, aktuell)

#### K10 Kaufpreisfaktor
```ts
kaufpreisfaktor = kaufpreis / jnkm;                  // Jahresmieten (dimensionslos)
// = 1 / bruttomietrendite
```
- **Spanne (Beispiele):** 12,1 (8,3 %) bis 31,0 (3,2 %). **Deutung:** keine Amortisationsdauer.
  Bezugsgröße (mit/ohne Nebenkosten, Ist/Soll-Miete) immer angeben.
- **Quelle:** [[Kaufpreisfaktor]] (stand 2026-09, aktuell)

#### K11 Bierdeckelrechnung (zweistufig)
```ts
stufe1 = (istMieteMonat * 12) / kaufpreis;                              // Inserat
stufe2 = (sollMieteMonat * 12) / (kaufpreis + renovierungskosten);      // nach Erstgespräch
mieteJeM2 = mieteMonat / wohnflaeche_m2;                                // Zusatzkennzahl
```
- **Deutung:** Vorfilter „in Minuten“; ersetzt keine Vollkalkulation. Stufe 2 ist aus der
  Beschreibung abgeleitet; **Schwelle für Stufe 2: LÜCKE**. Rechner-Regler (für UI-Spannen
  nutzbar): Kaufpreis 20.000–500.000 EUR, Miete 200–1.500 EUR/Monat, 20–200 m².
- **Quelle:** [[Bierdeckelrechnung]] (stand unbekannt, gueltigkeit unbekannt),
  [[Q-immocation-Tool-Bierdeckelrechnung]] (undatiert)

### 1.4 Laufende Kosten und Reserven

#### K12 Nicht umlagefähige laufende Kosten / Bewirtschaftungskosten
```ts
nuKostenJahr =
    verwaltungJahr                    // Hausverwaltung, SEV, Kontoführung, Buchhaltung …
  + hausgeldNichtUmlagefaehigJahr     // bei ETW: Verwaltervergütung, Erhaltungsrücklage-Zuführung …
  + tatsaechlicheReparaturenJahr      // Instandsetzung (bezahlt)
  + leerstandsBetriebskostenJahr      // BK leerstehender Einheiten trägt der Vermieter
  + sonstigeNichtUmlagefaehigJahr;
```
- **Spanne:** Kein Vault-Wert für frei finanzierten Wohnraum. Modellpauschale immocation:
  2.000 EUR bei 6.000 EUR Miete = **33 % der Miete** (inkl. „Rücklagen, Instandhaltung usw.“);
  Rückrechnung Erstkauf Gründer: ~70 EUR/Monat bei 400 EUR Miete (≈ 17,5 %). Orientierung
  Verwaltung nach § 26 II. BV (nur preisgebunden!): 372,46 EUR/Wohnung·a, 445,32 EUR/ETW·a,
  48,58 EUR/Garage·a (ab 01.01.2026).
- **Deutung:** Umlagefähige Betriebskosten sind durchlaufend (Netto 0 für den Vermieter, außer
  bei Leerstand). Pauschalen prüfen, ob Rücklagen enthalten sind – sonst Doppelzählung.
- **Quelle:** [[Bewirtschaftungskosten]] (stand unbekannt), [[Nicht-umlagefaehige-Kosten]]
  (2026-09, aktuell), [[Verwaltungskosten]] (2026-09-30, aktuell), [[Hausgeld-und-Nebenkosten]]
  (2026-09, aktuell)

#### K13 Instandhaltungsreserve (kalkulatorisch)
```ts
// Variante 1 – Pauschale je m² (II. BV, Orientierung, gilt rechtlich nur für preisgebundenen Wohnraum)
function iiBvSatz(alterJahre: number, opt: {aufzug?: boolean; waermelieferung?: boolean;
                  kleinrepMieter?: boolean; schoenheitsrepVermieter?: boolean}): number {
  let s = alterJahre < 22 ? 11.50 : alterJahre < 32 ? 14.58 : 18.62;   // EUR/m²·a ab 01.01.2026
  if (opt.aufzug) s += 1.63;
  if (opt.waermelieferung) s -= 0.31;
  if (opt.kleinrepMieter) s -= 1.70;
  if (opt.schoenheitsrepVermieter) s += 13.75;
  return s;
}
instandhaltungJahr = wohnflaeche_m2 * iiBvSatz(...);
// Variante 2 – Quote auf Miete: instandhaltungJahr = jnkm * quote;  // Quote: LÜCKE
// Variante 3 – Peterssche Formel (alte Faustregel, keine Norm):
//   (herstellungskostenJeM2 * 1.5 / 80) * wohnflaeche_m2 * (istETW ? anteilGE /*0.65–0.70*/ : 1)
// Variante 4 – Bauteilplan: Σ (Erneuerungskosten Bauteil / Restnutzungsdauer Bauteil)
```
- **Deutung:** Planungsgröße, **kein** steuerlicher Aufwand und keine bereits bezahlte Ausgabe.
  Bei ETW teilweise über die Erhaltungsrücklage im Hausgeld gedeckt; Sondereigentum (Bad, Boden,
  Küche) plant der Eigentümer selbst. Große Kostentreiber: Heizung, Fenster, Elektrik, Dach.
  Empfehlung des Vaults: Bauteilplan als Hauptrechnung, II.-BV-Satz als Plausibilitätsgrenze.
- **Beispiel:** 65 m², Baujahr 1972 → 65 × 18,62 = 1.210,30 EUR/Jahr ≈ 101 EUR/Monat.
- **Quelle:** [[Instandhaltungsreserve]] (2026-09-30, aktuell), [[Instandhaltungsplanung]]
  (2026-09-30, gueltigkeit unbekannt). Voreingestellter Satz des immocation-Kalkulationstools:
  **LÜCKE**.

#### K14 Mietausfallreserve
```ts
mietausfallreserveJahr = jnkm * p.mietausfallQuote;   // 0.03 laut Quelle, lage-/objektabhängig
```
- **Deutung:** Rücklage für Leerstand/Zahlungsausfall; deckt die Lücke Soll→Ist im
  Durchschnitt, aber nicht den Totalausfall einer Einheit (dafür Puffer). Bezug „3 % der
  Kaltmiete“ – ob monatlich oder jährlich: offen; die Lesart „3 % jeder Mieteinnahme“ ist im
  Ergebnis identisch. **Beispiel:** 500 EUR × 3 % = 15 EUR/Monat = 180 EUR/Jahr.
- **Quelle:** [[Mietausfallreserve]] (stand 2020-12, aktuell), [[Q-immocation-Blog-Risiken-der-Kapitalanlage]] (2020-12-22)

#### K15 Sonderumlage
```ts
// einmaliger Abfluss beim Eigentümer einer ETW, nicht umlagefähig
cashEvent({ typ: 'SONDERUMLAGE', betrag });
```
- **Datenpunkt:** 3.000 EUR Dach bei 92.000 EUR Kaufpreis (≈ 3,3 %), Fall Hildesheim.
- **Quelle:** [[Sonderumlage]] (gueltigkeit aktuell, stand fehlt)

#### K16 Liquiditätspuffer
```ts
startpuffer = 10_000 … 20_000;        // EUR, einmalig, „gerade zu Beginn“, nicht für den Kauf
// Robustheitsregel (eigene Faustregel der Vorlage):
robust = ueberschussNachNeuemObjekt(mietausfallMonate = 3, reparatur = jahresruecklage) >= 0;
```
- **Deutung:** Praktische Grenze des Hebels; bleibt nach dem Kauf unangetastet. Pauschale ohne
  Bezug zu Objektgröße/Portfolio; ob je Objekt oder je Bestand: **LÜCKE**. Nominal (keine
  Inflationsanpassung).
- **Quelle:** [[Liquiditaetspuffer]] (gueltigkeit aktuell, stand fehlt),
  [[Q-immocation-Blog-Finanzierung-in-4-Schritten]] (undatiert, vermutl. 2020–2021),
  [[Prozess-Haushaltsplan-und-Vermoegensaufstellung]] (2026-09-30)

### 1.5 Renditen und Hebel

#### K17 Nettomietrendite
```ts
nettomietrendite = (jnkm - nuKostenJahr) / (kaufpreis + knk.summe);   // Rate
```
- **Spanne (Beispiele):** 3,1–3,6 % bei 4,5–6 % brutto. **Deutung:** „die relevante Kennzahl
  zur Bewertung der Investition“ (immocation); ohne Finanzierung und Steuern. Ob kalkulatorische
  Rücklagen im Zähler abgezogen werden, legt die Quelle nicht fest → **Engine-Schalter**
  `nettoInklRuecklagen` (ANNAHME, Standard: `false`, Rücklagen separat ausweisen).
- **Quelle:** [[Nettomietrendite]] (2026-09-27, aktuell)

#### K18 Eigenkapitalrendite (vier getrennte Varianten)
```ts
ek = ekImObjekt (+ aus EK bezahlte Sofortsanierung);
if (ek <= p.ekMinFuerRendite) return undefined;   // Vault: bei sehr wenig EK „riesig oder unendlich“
ekRendite_cf        =  cfNachFinanzierungJahr                              / ek;
ekRendite_cfTilgung = (cfNachFinanzierungJahr + tilgungJahr)               / ek;
ekRendite_nachSteuer= (cfNachSteuernJahr      + tilgungJahr)               / ek;
ekRendite_inklWert  = (cfNachFinanzierungJahr + tilgungJahr + wertaenderung) / ek; // unrealisiert!
```
- **Spanne laut Quelle:** 20 % (10.000 EUR EK) vs. 6 % (50.000 EUR EK) – Eingangswerte nicht
  nachvollziehbar. Eigene Veranschaulichung des Vaults: Modellwohnung, 10.000 EUR EK → 0 % (nur
  Cashflow) bzw. 20 % (Cashflow + Tilgung).
- **Deutung:** Zähler, Nenner, Zeitraum immer offenlegen; Wertsteigerung erst beim Verkauf
  realisiert. Nur sinnvoll zusammen mit dem Cashflow.
- **Quelle:** [[Eigenkapitalrendite]] (stand unbekannt), [[Q-immocation-Blog-Hebel-mit-Fremdkapital]] (2021-01-18)

#### K19 Hebeleffekt
```ts
// Vault-Bedingung (qualitativ): positiver Hebel, solange Objektrendite > Fremdkapitalkosten
hebelPositiv = nettomietrendite > sollzins;           // Objektrendite: ANNAHME = Nettomietrendite
wertsteigerungsBetrag      = kaufpreis * wertsteigerungsQuote;
zusatzEkRendite_aus_Wert   = wertsteigerungsBetrag / ek;   // 1 % auf 100.000 bei 10.000 EK = 10 %
// Lehrbuchformel – NICHT im Vault belegt, nur als Erklärhilfe (vor Übernahme fachlich prüfen):
// rEK = rGK + (rGK - i) * FK / EK
```
- **Deutung:** Fremdkapital wirkt nicht automatisch positiv; mehr Hebel = höherer Kapitaldienst,
  mehr Anschlussrisiko. Zweite Grenze: Liquidität („ohne im Schuldenberg zu versinken“).
  Prüfkriterium: Investition muss auch **ohne** Wertsteigerung Sinn ergeben
  ([[Investition-ohne-Wertsteigerung]], 2021-11, aktuell).
- **Quelle:** [[Hebeleffekt]] (stand 2021-01, aktuell)

### 1.6 Darlehen: Zins, Tilgung, Annuität, Restschuld

#### K20 Zins (Sollzins)
```ts
zinsMonat = restschuld * sollzins / 12;
```
- **Spanne (historisch, ohne Angabe Zinsbindung/Produkt):** 1990er „weit über 8 %“; 2009 4,5 %;
  2013 4 % gefordert / 3 % verhandelt (5 J. Bindung); 2018 2,5 % Anschluss; um 2019–2021 „rund
  1,5 %“; **Ende 09/2026: 10 J. Zinsbindung ca. 3,9–4,5 % effektiv** je Beleihung/Bonität
  (Marktbeobachtung, Sicherheit B). EZB-Einlagenzins 2,50 % ab 16.09.2026 ist **kein**
  Kreditzins. 2022–2025: **LÜCKE**.
- **Deutung:** Quellen unterscheiden nicht zwischen Soll- und Effektivzins (Engine: ANNAHME
  Sollzins ≈ Effektivzins, keine Kreditnebenkosten). Zinsänderungsrisiko ist eines der drei
  Hauptrisiken (neben Mietausfall, unerwarteten Kosten).
- **Quelle:** [[Zins]] (stand 2026-09, aktuell)

#### K21 Annuität, Monatsrate, Kapitaldienst
```ts
annuitaetJahr = darlehen * (sollzins + anfTilgung);   // konstant während der Zinsbindung
rateMonat     = annuitaetJahr / 12;
kapitaldienstJahr = zinsenJahr + tilgungJahr;         // = annuitaetJahr bei Annuitätendarlehen
```
- **Beispiel:** 100.000 EUR, 2 %/2 % → 4.000 EUR/Jahr, 333,33 EUR/Monat; bei 4 %/2 % → 500 EUR.
- **Deutung:** Regelfall der Immobilienfinanzierung in Deutschland; größter Einzelabzug in der
  Objektrechnung. Sondertilgungen und Kreditnebenkosten: ob sie zum Kapitaldienst zählen, offen.
- **Quelle:** [[Annuitaet]] (2020-11, aktuell), [[Kapitaldienst]] (2026-09-30, aktuell)

#### K22 Tilgungsplan und Restschuld
```ts
function monatsschritt(d: Darlehen): { zins: EUR; tilgung: EUR } {
  const zins = d.restschuld * d.sollzins / 12;
  const tilgung = Math.min(d.rateMonat - zins, d.restschuld);
  d.restschuld -= tilgung;
  return { zins, tilgung };
}
// geschlossene Form (finanzmathematische Standardformel; Herleitung, durch Vault-Beispiel validiert)
function restschuld(D: EUR, i: Rate, t: Rate, monate: number): EUR {
  const q = 1 + i / 12, R = D * (i + t) / 12;
  return D * q ** monate - R * (q ** monate - 1) / (q - 1);
}
```
- **Deutung:** Anfangstilgung + eingesetztes EK bestimmen die Restschuld am Ende der Zinsbindung
  und damit das Anschlussrisiko. Tilgung ist Vermögensaufbau, aber Geldabfluss.
- **Validierung:** Backlog-Beispiel 192.000 EUR, 3,9 %, 2,0 %: Rate 11.328 EUR/Jahr,
  Restschuld nach 10 Jahren **146.110 EUR** bei jährlich nachschüssiger Zahlung
  (Engine monatlich: 145.128 EUR).
- **Quelle:** [[Tilgung]] (2020-11, aktuell), [[Recherche-Backlog]] („Restschuld-Beispiel“)

#### K23 Gesamtlaufzeit bis schuldenfrei
```ts
laufzeitJahre_jaehrlich = Math.log(1 + i / t) / Math.log(1 + i);           // Vault-Formel
laufzeitJahre_monatlich = Math.log(R / (R - D * i / 12)) / Math.log(1 + i / 12) / 12;
```
- **Werte:** 2 %/2 % → 35,0 J. (monatlich 34,7); 4 %/2 % → 28,0 J.; 2,5 %/3,5 % → 21,8 J.;
  3,9 %/2 % → 28,3 J. **Gilt nur bei unverändertem Zins nach der Zinsbindung** – Annahme,
  keine Zusage der Bank. Steigt der Zins bei gleicher Rate, verlängert sich die Laufzeit.
- **Quelle:** [[Annuitaet]] (2020-11, aktuell); Widersprüche W1/W2.

#### K24 Anschlussfinanzierung
```ts
neueRateJahr   = restschuldEndeZinsbindung * (anschlusszins + neueTilgung);
mehrbelastung  ≈ restschuldEndeZinsbindung * (anschlusszins - alterSollzins);  // bei gleicher Tilgung
```
- **Beispiel:** 146.110 EUR Restschuld, +1 Prozentpunkt → ≈ 1.461 EUR/Jahr Mehrbelastung.
- **Deutung:** Restschuld schon beim Kauf planen (typischer Fehler). Seit der Zinswende 2022
  kann der Anschluss deutlich teurer sein als der Erstkredit. Bei Ablauf stellt sich „halten
  oder verkaufen“. Zinsen sind verhandelbar.
- **Quelle:** [[Anschlussfinanzierung]] (2020-11, aktuell)

### 1.7 Cashflow-Kaskade

```ts
// Stufe 1 – operativ (finanzierungsunabhängig)
operativerCF        = vereinnahmteNettokaltmiete - nuKostenBezahlt;
// Stufe 2 – nach Finanzierung (= „Cashflow vor Steuern“)
cfNachFinanzierung  = operativerCF - zins - tilgung;
// Liquiditätssicht (separat ausweisen, kein bezahlter Aufwand)
liquiditaetNachRuecklagen = cfNachFinanzierung - ruecklagenZufuehrung; // Instandhaltung + Mietausfall
// Stufe 3 – nach Steuern (Jahreswert)
steuerlichesErgebnis = einnahmen - werbungskosten - afa;  // Werbungskosten inkl. Schuldzinsen, ohne Tilgung,
                                                          // ohne Rücklagenzuführung
steuerwirkung        = steuerlichesErgebnis * grenzsteuersatz;  // negativ = Erstattung
cfNachSteuern        = cfNachFinanzierung - steuerwirkung;
```

| Posten | mindert Cashflow | mindert steuerliches Ergebnis |
|---|---|---|
| laufende Kosten, Zins | ja | ja |
| Tilgung | ja | nein |
| AfA | nein | ja |
| geplante Rücklagenzuführung | nur Liquiditätssicht | nein (erst tatsächlicher Aufwand) |

#### K25 Operativer Cashflow
- **Deutung:** Was das Objekt aus eigener Kraft erwirtschaftet; operativer CF / Gesamtkaufkosten
  ≈ Nettomietrendite. Nach Entschuldung = passives Einkommen.
- **Quelle:** [[Operativer-Cashflow]] (2026-09-30, aktuell)

#### K26 Cashflow nach Finanzierung (vor Steuern)
- **Deutung:** > 0 Überschuss; = 0 „selbst abzahlend“; < 0 Zuzahlung aus Einkommen. Ein niedriger
  CF bei hoher Tilgung ist Vermögensaufbau, nicht schlechtere Wirtschaftlichkeit.
- **Quelle:** [[Cashflow-nach-Finanzierung]] (2026-09, aktuell), [[Cashflow]] (2026-09-27, aktuell)

#### K27 Cashflow nach Steuern
- **Deutung:** Hängt vom übrigen Einkommen ab (Grenzsteuersatz); Steuer kann Belastung **oder**
  Erstattung sein (immocation-Seite modelliert nur Belastung). AfA-Effekt und Zinsanteil sinken
  über die Zeit → CF nach Steuern verschlechtert sich meist. Näherung ohne Soli/Kirchensteuer.
- **Quelle:** [[Cashflow-vor-und-nach-Steuern]] (stand unbekannt), [[Steuerliches-Ergebnis]]
  (2021-02, unbekannt), [[AfA]] (2026-09-27: 3 % ab Fertigstellung nach 2022, 2 % 1925–2022,
  2,5 % vor 1925; degressiv 5 % nach § 7 Abs. 5a EStG unter Voraussetzungen),
  [[Grenzsteuersatz]] (2021-02: 30–45 %). Detailregeln: Steuer-Recherche.

#### K28 Negativer Cashflow / tragbare Zuzahlung
```ts
zuzahlungMonat = Math.max(0, -cfNachFinanzierungMonat);
```
- **Deutung:** Kein Ausschlusskriterium an sich, solange dauerhaft tragbar; schmälert aber den
  Spielraum in der Haushaltsrechnung. **Tragbare Obergrenze: LÜCKE** (keine Quelle nennt eine).
- **Quelle:** [[Negativer-Cashflow]] (stand unbekannt, aktuell)

#### K29 Selbst abzahlende Immobilie
```ts
selbstAbzahlend = mieteinnahmen >= bankrate + laufendeKosten + instandhaltungsruecklage;
// ⇔ cfNachFinanzierung - instandhaltungsruecklage >= 0  (strenge Fassung inkl. Rücklage)
```
- **Deutung:** Zielbild, keine Pflicht; muss auch nach der Zinsbindung halten.
- **Quelle:** [[Selbst-abzahlende-Immobilie]] (stand unbekannt)

#### K30 Passives Einkommen (nach Entschuldung)
```ts
passivesEinkommenJahr = mieteinnahmen - laufendeKostenBezahlt;   // = operativerCF, vor Steuern, nominal
```
- **Beispiel:** Modell 6.000 − 2.000 = 4.000 EUR/Jahr nach ~30 Jahren.
- **Quelle:** [[Passives-Einkommen]] (2026-09-30, aktuell)

### 1.8 Bankkennzahlen

#### K31 Beleihungswert
```ts
beleihungswert = marktwert * bank.bwFaktor;     // Profil A: 0.80 („meist 80 % des Marktpreises“)
                                                // Profil B: ≈ 0.90 („oft rund 10 % unter Verkehrswert“)
if (videobesichtigung) beleihungswert *= 0.95;  // max., Novelle 07.10.2022: nur Kleindarlehen ≤ 600.000 EUR,
                                                // Restnutzungsdauer ≥ 40 J., Dokumentation
maxDarlehenSicherheit ≈ beleihungswert;          // „in den meisten Fällen“ (Profil A)
```
- **Deutung:** Wert „auch in schlechteren Zeiten“; von der Bank selbst ermittelt; Rechtsrahmen
  BelWertV/PfandBG. Bewertungsverfahren (Ertrags-/Sachwert, Kapitalisierungszins): **LÜCKE**.
  Kauf über Marktwert → BW-Lücke muss mit EK gefüllt werden, Zinskonditionen schlechter.
- **Quelle:** [[Beleihungswert]] (stand 2022-10, gueltigkeit unbekannt),
  [[Prozess-Finanzierungsdossier-Bank]] (2026-09-30)

#### K32 Beleihung / Beleihungsauslauf
```ts
beleihung = restschuld / bezugswert;   // bezugswert: Beleihungswert ODER Marktwert – im Vault offen
// Zielgröße: jedes Bestandsobjekt < 0.80
```
- **Deutung:** Sinkt durch Tilgung und Wertsteigerung, steigt bei Preisverfall ohne
  Schuldänderung. 110 % für den Gesamtbestand nennt ein Coach „gewagt“. Engine führt drei
  Varianten parallel: `darlehen/beleihungswert`, `darlehen/marktwert` (= LTV, so im
  [[Prozess-Investment-Memo-fuer-die-Bank]]), `darlehen/kaufpreis` (= Finanzierungsquote).
- **Quelle:** [[Beleihungsgrenze]] (stand 2021-04, gueltigkeit unbekannt)

#### K33 Anrechenbare Miete (Sicherheitsabschlag)
```ts
// Profil A (2021): auf Jahresbruttokaltmiete
anrechenbareMiete = jbkm * (1 - 0.25);
// Profil B (2026): auf Nettokaltmiete, 60–80 %
anrechenbareMiete = jnkm * bank.mietAnrechnung;             // 0.60 … 0.80
if (!mietvertragVorhanden) anrechenbareMiete = jnkm * bank.mietAnrechnungOhneVertrag; // 0 oder höherer Abschlag
if (mietpool) anrechenbareMiete = bank.mietpoolAnerkannt ? anrechenbareMiete : 0;    // „teils 0 EUR“
```
- **Deutung:** Prüfgröße der Bank, ersetzt nicht die Mietausfallreserve der Investorenrechnung.
- **Quelle:** [[Sicherheitsabschlag-auf-Mieteinnahmen]] (2021-04, unbekannt),
  [[Haushaltsrechnung]] (2021-04 + Ergänzung 2026-09-30), [[Prozess-Finanzierungsdossier-Bank]]

#### K34 Kalkulatorische Stressbelastung und bankseitige Mindestrendite
```ts
stressbelastungJahr = darlehen * bank.stresszins;      // Profil A: 0.08, Profil B: 0.05–0.06
// Rekonstruktion (Darlehen ≈ Kaufpreis, Miete trägt Stress allein):
erforderlicheMietrendite = bank.stresszins / anrechnungsquote;
// A: 0.08 / 0.75 = 10,67 % (Bruttokaltmiete)   B: 0.05/0.80 = 6,25 % … 0.06/0.60 = 10,0 % (Nettokaltmiete)
```
- **Deutung:** Prüft Tragfähigkeit **nach** Ablauf der Zinsbindung; reine Prüfgröße. Die
  10-%-Schwelle ist eine Ableitung aus einer Einzelzahl; übriges Einkommen ist nicht
  berücksichtigt – ein Objekt mit weniger Rendite ist deshalb nicht automatisch unfinanzierbar.
  Ob der Stresszins nur als Zinssatz oder als Gesamtbelastung inkl. Tilgung gemeint ist: offen
  (Engine-Schalter `stressModus`, siehe W21). Profil-B-Werte (6,25–10 %) sind **eigene
  Nachrechnung** dieser Spezifikation.
- **Quelle:** [[Kalkulatorischer-Stresszins]] (2021-04, unbekannt)

#### K35 Haushaltsüberschuss der Bank (Kapitaldienstfähigkeit)
```ts
ueberschussBank = Σ anrechenbareEinnahmen − Σ ausgabenBankansatz − kapitaldienstNeuZumStresszins;
tragfaehig = ueberschussBank >= 0 && liquiditaetspufferVorhanden;
```
- **Deutung:** Kern der Kreditentscheidung; Details in Kapitel 2. „Kapitaldienstfähigkeit“ nennt
  der Vault nur als Begriff ([[Prozess-Investment-Memo-fuer-die-Bank]]); die Operationalisierung
  über diese Formel ist **ANNAHME** auf Basis von [[Prozess-Haushaltsplan-und-Vermoegensaufstellung]].
  Ein DSCR (Kapitaldienstdeckungsgrad) ist im Vault **nicht** definiert (LÜCKE).

### 1.9 Testvektoren (Golden Tests für die Engine)

| # | Eingabe | Erwartung | Herkunft |
|---|---|---|---|
| T1 | KP 120.000, NKM 500/Monat, 50 m² | Brutto 5,00 %, Faktor 20,0, 2.400 EUR/m², 10 EUR/m² Miete | [[Q-immocation-Tool-Bierdeckelrechnung]] |
| T2 | D 100.000, 2 %/2 % | 4.000 EUR/a; 333,33 EUR/Monat; Laufzeit 35,0 J. (jährl.) / 34,7 J. (monatl.); RS nach 10 J. monatl. 77.880 | [[Annuitaet]], eigene Nachrechnung |
| T3 | D 100.000, 4 %/2 % | 500,00 EUR/Monat; Laufzeit 28,0 J. (jährl.) | [[Annuitaet]] |
| T4 | D 58.000, 2,5 %/3,5 %, NKM 400 | KD 3.480 EUR/a = 290 EUR/Monat; Brutto 8,28 %; Laufzeit 21,8 J. (Quelle: 27 J.) | [[Fallstudie-Marco-und-Stefan]] |
| T5 | D 192.000, 3,9 %/2,0 % | Rate 11.328 EUR/a; RS 10 J. jährl. nachschüssig 146.110; +1 Pp. → +1.461 EUR/a | [[Recherche-Backlog]] |
| T6 | KP 250.000, NKM 1.200, Ausfall 5 %, lfd. Kosten 1.800, Instandh. 2.000, D 220.000, 4 %/2 % | op. CF 9.880; KD 13.200 (vereinfacht auf Anfangsdarlehen); CF n. Fin. −3.320 EUR/a; Brutto 5,76 % | [[Cashflow]] (hypothetisch) |
| T7 | KP 240.000, JNKM 10.800, nuK 2.700, KNK 18.000 (HB) | Brutto 4,50 %, Faktor 22,22, Netto 3,14 %; mit NI (KNK 16.800) 3,15 % | [[Nettomietrendite]] |
| T8 | KP 200.000 HB, Notar 2 %, D 180.000, Renov. 5.000, Puffer 10.000 | GrESt 11.000; KNK 15.000; eigene Mittel 50.000 | [[Prozess-Haushaltsplan-und-Vermoegensaufstellung]] |
| T9 | Stress 8 %, Abschlag 25 % | Mindestrendite 10,67 % | [[Kalkulatorischer-Stresszins]] |
| T10 | Miete 6.000, Kosten 2.000, Zins 2.000, Tilg. 2.000 | CF n. Fin. 0; nach Entschuldung 4.000 EUR/a | [[Passives-Einkommen]] |
| T11 | Miete 6.000, tats. Kosten 1.500, Zins 2.000, Tilg. 2.000, AfA 2.000, GSS 42 %, Rücklage 500 | CF v. St. 500; st. Ergebnis 500; Steuer 210; CF n. St. 290; Liquidität n. Rücklage −210 | [[Cashflow-vor-und-nach-Steuern]] (eigene Rechnung des Vaults) |
| T12 | 65 m², BJ 1972, kein Aufzug | 1.210,30 EUR/a Instandhaltung | [[Instandhaltungsplanung]] |
| T13 | NKM 500 | Mietausfallreserve 15 EUR/Monat, 180 EUR/a | [[Mietausfallreserve]] |

---

## 2. Bankmodell

### 2.1 Grundprinzipien (aus dem Vault)

1. **Die Bank rechnet vorsichtiger als der Investor**: Mietabschlag, Stresszins, Beleihungswert
   unter Marktwert, Lebenshaltungspauschalen ([[Haushaltsrechnung]]).
2. **Immobilien sind gute Sicherheit**: Grundschuld im Grundbuch, „echter Gegenwert“ – deshalb
   finanzieren Banken Immobilien bereitwillig, Aktien kaum ([[Grundschuld]], [[Hebeleffekt]]).
3. **Kaufnebenkosten haben keinen Gegenwert** → in der Regel aus EK ([[Kaufnebenkosten]]).
4. **Je höher die Finanzierungsquote, desto genauer die Bonitätsprüfung** (50 % „ohne Weiteres“,
   100 % genau) ([[Kreditrahmen]]).
5. **Zwei Prüfperspektiven**: zuerst einkommensbasiert (Haushaltsrechnung → Kreditrahmen), nach
   Ausschöpfung vermögensbasiert ([[Portfoliobetrachtung-der-Bank]]).
6. **Institutsabhängig**: Werte unterscheiden sich zwischen Banken; 2026 werden Banken als
   „behäbiger“ beschrieben, Konditionen und Prozesse ändern sich
   ([[Q-immocation-Webinar-Marktupdate-2026]], 10.07.2026).

### 2.2 Bausteine

| Baustein | Vault-Inhalt | Engine-Umsetzung | Quelle (stand, gueltigkeit) |
|---|---|---|---|
| **Beleihungswert vs. Marktwert** | BW < Marktwert; A: ≈ 80 %, B: ≈ 90 %; Kauf über Marktwert → mehr EK, schlechtere Zinsen; Video-Abschlag ≥ 5 % | K31; `bank.bwFaktor` je Profil/Bank | [[Beleihungswert]] (2022-10, unbekannt) |
| **Beleihungsgrenze/-auslauf** | Bestand < 80 % beliehen stärkt Bonität; Bezugswert offen | K32; Portfolio-Prüfung P7 | [[Beleihungsgrenze]] (2021-04, unbekannt) |
| **Sicherheitsabschlag Miete** | A: 25 % auf JBKM; B: Anrechnung 60–80 % der NKM; ohne Mietvertrag 0/höherer Abschlag; Mietpool teils 0 | K33 | [[Sicherheitsabschlag-auf-Mieteinnahmen]] (2021-04), [[Prozess-Finanzierungsdossier-Bank]] (2026-09-30) |
| **Haushaltsrechnung (Pauschalen)** | Einkommen netto ohne Einmalzahlungen (diese „oft nicht oder anteilig“); Wohnkosten, Mobilität, bestehende Raten voll; Lebenshaltung = Bankpauschale je Haushaltsgröße (Werte: **LÜCKE**); ungenutzte Dispo-/Kreditkartenrahmen „teils/oft“ als Belastung; freiwillige Sparraten zählen nicht | P5 | [[Prozess-Haushaltsplan-und-Vermoegensaufstellung]] (2026-09-30, aktuell) |
| **Stresszins** | A: 8 % pauschal; B: 5–6 %; prüft Zeit nach der Zinsbindung | K34 | [[Kalkulatorischer-Stresszins]] (2021-04, unbekannt) |
| **Kapitaldienstfähigkeit** | Überschuss (Bank) ≥ 0 **und** Puffer vorhanden | K35, P5/P6 | [[Prozess-Haushaltsplan-und-Vermoegensaufstellung]] |
| **EK-Anforderung** | mindestens KNK; B: oft 20–30 % gewünscht, Vollfinanzierung nur bei sehr guter Bonität mit Zinsaufschlag; A: 100 % KP finanzierbar, KNK aus EK; KNK-Mitfinanzierung selten (Ausnahme sehr niedriger Kaufpreis, Fall 25.000 EUR) | P3 | [[Eigenkapital]], [[Kaufnebenkosten]], [[Prozess-Finanzierungsdossier-Bank]] |
| **Vermögensansatz** | Giro/Tagesgeld voll; Festgeld voll, wenn vor Zahlungstermin fällig; Depot „teils mit Abschlag“; Kapital-LV meist nur Rückkaufswert; Immobilien zum Beleihungswert | P6 | [[Prozess-Haushaltsplan-und-Vermoegensaufstellung]] |
| **Portfoliobetrachtung** | greift, wenn Kreditrahmen ausgeschöpft; positiv: alle Objekte < 80 % beliehen, getilgte Kredite, gestiegene Werte; kehrt sich bei Preisverfall um; weitere Kriterien **LÜCKE** | P7 | [[Portfoliobetrachtung-der-Bank]] (2021-04, unbekannt) |
| **Kreditrahmen** | individuell nach Vermögen und Gehalt; Ergebnis der Haushaltsrechnung; Spanne im Quelltext abgeschnitten (**LÜCKE**) | `kreditrahmenRest` = max. Darlehen aus P5 | [[Kreditrahmen]] (2021-04, unbekannt) |
| **„Wie lange macht die Bank mit“** | bis Rahmen ausgeschöpft, dann Portfoliobetrachtung | emergent aus P5/P7, siehe 2.6 | [[Q-immocation-Blog-Wie-lange-macht-die-Bank-mit]] (2021-04-16) |
| **Grundschuld** | Sicherungsrecht im Grundbuch; Bank kann Objekt verwerten lassen; Eintragungskosten Teil der Erwerbskosten (nicht beziffert); bei Preisverfall Nachforderung von Sicherheiten bis Zwangsversteigerung; Rechtsgrundlage, Löschung/Weiterverwendung **LÜCKE** | jedes Darlehen hängt an einer Grundschuld auf einem Objekt | [[Grundschuld]] (aktuell, stand fehlt), [[Q-immocation-Blog-Immobilienblase]] |
| **Verkäuferdarlehen** | Verkäufer stundet Teil des KP; Bankbehandlung, Rang, Steuer **LÜCKE** | optional; als „bestehende Verpflichtung“ voll in P5 (Ableitung) | [[Verkaeuferdarlehen]] (2026-09, aktuell) |
| **Vermittler** | bündelt Unterlagen, fragt viele Banken parallel an (Interhyp: > 500 Darlehensgeber), ein oder mehrere Angebote; Vergütung **LÜCKE** | 2.7 | [[Finanzierungsvermittler]] (2026-09, aktuell) |
| **Anschlussfinanzierung** | neue Konditionen auf Restschuld; Risiko steigender Zinsen; halten oder verkaufen | 2.6 | [[Anschlussfinanzierung]] (2020-11, aktuell) |
| **Zinsbindung** | Beispiele 5 J. (2013) und 10 J. (Marktzins 2026); „lange Zinsbindung“ als Gegenmaßnahme gegen Zinsanstieg; Aufpreis je Länge **LÜCKE** | Spielerwahl | [[Zins]], [[Prozess-Investment-Memo-fuer-die-Bank]] |
| **Sondertilgung** | nur als Vergleichskriterium von Angeboten genannt; Umfang **LÜCKE** | Angebotsmerkmal (ANNAHME) | [[Prozess-Finanzierungsdossier-Bank]] |
| **Weitere Angebotsmerkmale** | Effektivzins, bereitstellungszinsfreie Zeit, Tilgungssatzwechsel, Auflagen – Werte **LÜCKE** | Angebotsfelder | [[Prozess-Finanzierungsdossier-Bank]] |
| **Liquiditätspuffer** | 10.000–20.000 EUR nach dem Kauf | P6 | [[Liquiditaetspuffer]] |
| **Person** | viele Banken verlangen unbefristetes Arbeitsverhältnis nach Probezeit; Hilfen: Übernahmezusage, zweiter Kreditnehmer, Ansparphase; Selbständige 2–3 Jahresabschlüsse/BWA; SCHUFA vorab prüfen; Kontoauszüge ohne Rücklastschriften, Dispo nicht ausgereizt | P1 | [[Prozess-Finanzierungsdossier-Bank]] |
| **Konditionen** | Zins abhängig von Beleihung und Bonität; Kauf über Marktwert verschlechtert Zins; Vollfinanzierung mit Aufschlag (B); Paketkauf mehrerer Wohnungen kann Konditionen verbessern; Zins verhandelbar (4 % → 3 %) | P8 | [[Zins]], [[Q-immocation-Blog-9-Steuerkniffe-beim-Kauf]], [[Fallstudie-Sebastian-Hildesheim]] |

### 2.3 Parameterprofile der simulierten Bank

```ts
interface BankProfil {
  id: string; typ: 'REGIONALBANK' | 'DIREKT_HYPOTHEKENBANK';      // Typen laut Dossier-Schritt 3
  bwFaktor: Rate;                       // A 0.80 | B ~0.90
  mietBasis: 'JBKM' | 'JNKM';           // A JBKM | B JNKM
  mietAnrechnung: Rate;                 // A 0.75 | B 0.60–0.80
  mietAnrechnungOhneVertrag: Rate;      // B: 0 oder < mietAnrechnung        (Höhe: LÜCKE → ANNAHME 0)
  mietpoolAnerkannt: boolean;           // B: „teils 0 EUR“
  stresszins: Rate;                     // A 0.08 | B 0.05–0.06
  stressModus: 'NUR_STRESSZINS' | 'STRESSZINS_PLUS_TILGUNG';     // offen → ANNAHME Standard NUR_STRESSZINS
  lebenshaltungPauschale: (personen: number) => EUR;             // LÜCKE (bankintern)
  einmalzahlungAnrechnung: Rate;        // „oft nicht oder anteilig“ → 0 … <1   (LÜCKE)
  rahmenBelastungsquote: Rate;          // Dispo/Kreditkarte „teils/oft“      (LÜCKE)
  depotAbschlag: Rate;                  // „teils mit Abschlag“                (LÜCKE)
  ekMinimum: 'KNK';                     // A und B
  ekQuoteWunsch: Rate;                  // A 0 (100 % KP) | B 0.20–0.30
  vollfinanzierungNurBeiSehrGuterBonitaet: boolean;  // B true
  finanziertKNK: (kaufpreis: EUR) => boolean;        // „nur wenige“; Ausnahme sehr niedrige KP (Schwelle: LÜCKE)
  portfolioBeleihungsSchwelle: Rate;    // 0.80
  portfolioBezugswert: 'BELEIHUNGSWERT' | 'MARKTWERT';  // offen
  verlangtUnbefristet: boolean;         // „viele Banken“
  minJahreSelbststaendig: number;       // 2–3
  minPuffer: EUR;                       // 10_000–20_000 (immocation-Empfehlung, keine belegte Banknorm)
  zinsSpreads: ZinsSpreads;             // LÜCKE – kalibrieren auf Marktspanne
}
```

### 2.4 Entscheidungslogik eines Kreditantrags

**Eingaben**

```ts
interface Kreditantrag {
  objekt: { kaufpreis: EUR; marktwert: EUR; bundesland: Bundesland; wohnflaeche_m2: number;
            nkmIstMonat: EUR; kalteBkMonat: EUR; mietvertragVorhanden: boolean; mietpool: boolean;
            makler: boolean; maklerQuoteKaeufer: Rate; inventarSeparat?: EUR;
            objektart: 'ETW' | 'MFH' | 'EFH' | …; restnutzungsdauerJahre?: number };
  darlehenWunsch: EUR; zinsbindungJahre: number; anfTilgung: Rate;
  ekEinsatz: EUR; paketkauf: boolean; videobesichtigung: boolean;
  person: { nettoEinkommenMonat: EUR; einmalzahlungenJahr: EUR; sonstigeEinnahmenMonat: EUR;
            beschaeftigung: 'UNBEFRISTET' | 'PROBEZEIT' | 'BEFRISTET' | 'AUSBILDUNG' | 'SELBSTSTAENDIG';
            jahreSelbststaendig?: number; uebernahmezusage?: boolean; haushaltsgroesse: number;
            wohnkostenMonat: EUR; mobilitaetMonat: EUR; versicherungVorsorgeMonat: EUR;
            lebenshaltungIstMonat?: EUR; bestehendeRatenMonat: EUR;
            dispoRahmen: EUR; kreditkartenRahmen: EUR; schufaNegativ: boolean; zweiterKreditnehmer?: boolean };
  vermoegen: { giroTagesgeld: EUR; festgeld: EUR; festgeldRechtzeitigFaellig: boolean;
               depot: EUR; lvRueckkaufswert: EUR; bausparen: EUR };
  bestand: Array<{ marktwert: EUR; restschuld: EUR; nkmIstMonat: EUR; kalteBkMonat: EUR;
                   kapitaldienstMonat: EUR; nuKostenMonat: EUR }>;
  unterlagen: Set<UnterlagenId>;
  viaVermittler: boolean;
}
```

**Prüfschritte** (Reihenfolge ANNAHME; Inhalte je Schritt aus dem Vault)

```ts
function pruefe(a: Kreditantrag, bank: BankProfil, markt: Marktlage): Entscheidung {
  const gruende: Grund[] = [], auflagen: Auflage[] = [];

  // P0 – Vollständigkeit ([[Prozess-Finanzierungsdossier-Bank]])
  const fehlend = pflichtUnterlagen(a).filter(u => !a.unterlagen.has(u));
  if (fehlend.length) return { typ: 'RUECKFRAGE', fehlend };        // Folge = Zeitverzug (ANNAHME)

  // P1 – Person
  if (a.person.schufaNegativ) return absage('SCHUFA');               // Wirkung im Vault nicht beschrieben → ANNAHME
  const ungefestigt = ['PROBEZEIT','BEFRISTET','AUSBILDUNG'].includes(a.person.beschaeftigung);
  if (ungefestigt && bank.verlangtUnbefristet && !a.person.uebernahmezusage && !a.person.zweiterKreditnehmer)
    return absage('BESCHAEFTIGUNG_NICHT_GEFESTIGT');
  if (a.person.beschaeftigung === 'SELBSTSTAENDIG' && (a.person.jahreSelbststaendig ?? 0) < bank.minJahreSelbststaendig)
    return absage('SELBSTSTAENDIG_ZU_KURZ');

  // P2 – Sicherheit / Beleihungswert
  const videoZulaessig = a.videobesichtigung && a.darlehenWunsch <= 600_000 && (a.objekt.restnutzungsdauerJahre ?? 0) >= 40;
  const bw = a.objekt.marktwert * bank.bwFaktor * (videoZulaessig ? 0.95 : 1);
  const ueberMarktwert = a.objekt.kaufpreis > a.objekt.marktwert;
  if (ueberMarktwert) gruende.push('KAUFPREIS_UEBER_MARKTWERT');     // → mehr EK, Zinsaufschlag

  // P3 – Eigenkapital
  const knk = kaufnebenkosten(a.objekt).summe;
  const darlehenMaxFormal = bank.finanziertKNK(a.objekt.kaufpreis) ? a.objekt.kaufpreis + knk : a.objekt.kaufpreis;
  const ekImObjekt = a.objekt.kaufpreis + knk - a.darlehenWunsch;
  const ekQuote = 1 - a.darlehenWunsch / a.objekt.kaufpreis;
  if (a.darlehenWunsch > darlehenMaxFormal) gruende.push('NEBENKOSTEN_NICHT_FINANZIERBAR');
  if (a.darlehenWunsch > bw)               gruende.push('DARLEHEN_UEBER_BELEIHUNGSWERT');
  const vollfinanzierung = ekQuote < bank.ekQuoteWunsch;

  // P4 – Mietansatz (K33) für neues Objekt
  const mieteNeu = anrechenbareMiete(a.objekt, bank);                // EUR/Monat

  // P5 – Haushaltsrechnung / Kapitaldienstfähigkeit (K35)
  const hh = haushalt(a, bank, mieteNeu);                            // {einnahmen, ausgaben} je Monat
  const stressSatz = bank.stresszins + (bank.stressModus === 'STRESSZINS_PLUS_TILGUNG' ? a.anfTilgung : 0);
  const ueberschuss = hh.einnahmen - hh.ausgaben - a.darlehenWunsch * stressSatz / 12;
  const darlehenMaxHaushalt = Math.max(0, (hh.einnahmen - hh.ausgaben) * 12 / stressSatz); // = Kreditrahmen-Rest

  // P6 – Liquidität nach Kauf
  const liquideNachKauf = anrechenbaresVermoegen(a.vermoegen, bank) - a.ekEinsatz;
  const pufferOk = liquideNachKauf >= bank.minPuffer;

  // P7 – Kreditrahmen ausgeschöpft? → Portfoliobetrachtung ([[Portfoliobetrachtung-der-Bank]])
  let portfolioTraegt = false;
  if (ueberschuss < 0 && a.bestand.length > 0) {
    const alleUnter80 = a.bestand.every(o => o.restschuld / bezugswert(o, bank) < bank.portfolioBeleihungsSchwelle);
    // Zusatzbedingungen = ANNAHME (Vault nennt keine weiteren Kriterien):
    const gesamtLtv = (Σ restschuld + a.darlehenWunsch) / (Σ marktwert + a.objekt.marktwert);
    const portfolioCfVertrag = Σ (nkmIst - kapitaldienst - nuKosten) /* Vertragszins */ ;
    portfolioTraegt = alleUnter80 && gesamtLtv <= 1.0 /* „110 % gewagt“ */ && portfolioCfVertrag >= 0;
  }

  // P8 – Konditionen
  const sollzins = konditionen(markt, bank, {
    zinsbindung: a.zinsbindungJahre, beleihungsauslauf: a.darlehenWunsch / bw,
    ueberMarktwert, vollfinanzierung, paketkauf: a.paketkauf,
  });

  // P9 – Ergebnis
  const sehrGuteBonitaet = ueberschuss >= bank.reserveFuerSehrGuteBonitaet; // Definition: LÜCKE → ANNAHME
  const harteMaengel =
       (ueberschuss < 0 && !portfolioTraegt) ? 'HAUSHALT_UNTERDECKUNG_STRESS'
     : !pufferOk ? 'KEIN_LIQUIDITAETSPUFFER'
     : (ekImObjekt < knk && !bank.finanziertKNK(a.objekt.kaufpreis)) ? 'EK_DECKT_NEBENKOSTEN_NICHT'
     : (vollfinanzierung && bank.vollfinanzierungNurBeiSehrGuterBonitaet && !sehrGuteBonitaet) ? 'VOLLFINANZIERUNG_OHNE_TOP_BONITAET'
     : (a.darlehenWunsch > bw && !sehrGuteBonitaet) ? 'DARLEHEN_UEBER_BELEIHUNGSWERT'
     : null;

  if (!harteMaengel) return { typ: 'ZUSAGE', darlehen: a.darlehenWunsch, sollzins,
       zinsbindungJahre: a.zinsbindungJahre, anfTilgung: a.anfTilgung,
       rateMonat: a.darlehenWunsch * (sollzins + a.anfTilgung) / 12, auflagen, gruende };

  const maxDarlehen = Math.min(darlehenMaxFormal,
                               sehrGuteBonitaet ? darlehenMaxFormal : bw,
                               portfolioTraegt ? Infinity : darlehenMaxHaushalt);
  const zusaetzlichesEK = a.darlehenWunsch - maxDarlehen;
  if (maxDarlehen > 0 && zusaetzlichesEK <= liquideNachKauf - bank.minPuffer)
    return { typ: 'GEGENANGEBOT', maxDarlehen, zusaetzlichesEK, sollzins: /* neu berechnen */ …, gruende: [harteMaengel, ...gruende] };
  return { typ: 'ABSAGE', gruende: [harteMaengel, ...gruende] };
}
```

**Haushaltsrechnung im Detail** (Positionen aus [[Prozess-Haushaltsplan-und-Vermoegensaufstellung]]):

```ts
function haushalt(a: Kreditantrag, bank: BankProfil, mieteNeuMonat: EUR) {
  const p = a.person;
  const einnahmen =
      p.nettoEinkommenMonat                                       // ohne Einmalzahlungen
    + p.einmalzahlungenJahr / 12 * bank.einmalzahlungAnrechnung   // „oft nicht oder anteilig“
    + p.sonstigeEinnahmenMonat                                    // Kindergeld u. Ä.
    + Σ a.bestand.map(o => mietbasisMonat(o, bank) * bank.mietAnrechnung)  // Bestandsmieten 60–80 %
    + mieteNeuMonat;
  const ausgaben =
      p.wohnkostenMonat                                           // Warmmiete/eigene Wohnkosten: voll
    + Math.max(bank.lebenshaltungPauschale(p.haushaltsgroesse), p.lebenshaltungIstMonat ?? 0) // Bankpauschale; max = ANNAHME
    + p.mobilitaetMonat                                           // voll
    + p.versicherungVorsorgeMonat
    + p.bestehendeRatenMonat                                      // voll
    + (p.dispoRahmen + p.kreditkartenRahmen) * bank.rahmenBelastungsquote
    + Σ a.bestand.map(o => o.kapitaldienstMonat + o.nuKostenMonat); // Bestand: Vertragsrate + nicht umlagef. Bewirtschaftung
  // freiwillige Sparraten: zählen nicht als Pflicht → nicht enthalten
  // Bewirtschaftung des NEUEN Objekts: in der Vorlage keine eigene Zeile → durch Mietabschlag abgedeckt (ANNAHME)
  return { einnahmen, ausgaben };
}
```

**Ergebnis-Typen und Begründungscodes**

| Code | Bedeutung für den Spieler | Vault-Grundlage |
|---|---|---|
| `RUECKFRAGE` | Unterlagen fehlen | Dossier: „Unterlagen tröpfchenweise nachgereicht“ als typischer Fehler |
| `BESCHAEFTIGUNG_NICHT_GEFESTIGT` | Probezeit/befristet | Dossier, Sonderfälle der Person |
| `SELBSTSTAENDIG_ZU_KURZ` | < 2–3 Jahresabschlüsse | Dossier |
| `SCHUFA` | negativer Eintrag | nur „vorab prüfen“ belegt; Absage = ANNAHME |
| `KAUFPREIS_UEBER_MARKTWERT` | mehr EK, schlechterer Zins | [[Beleihungswert]] |
| `DARLEHEN_UEBER_BELEIHUNGSWERT` | Darlehen > BW | [[Beleihungswert]], Dossier |
| `EK_DECKT_NEBENKOSTEN_NICHT` | KNK nicht aus EK gedeckt | [[Kaufnebenkosten]], Dossier |
| `VOLLFINANZIERUNG_OHNE_TOP_BONITAET` | EK-Quote unter Bankwunsch | Dossier (Profil B) |
| `HAUSHALT_UNTERDECKUNG_STRESS` | Überschuss < 0 zum Stresszins | [[Haushaltsrechnung]] |
| `KEIN_LIQUIDITAETSPUFFER` | zu wenig Reserve nach Kauf | Haushaltsplan „und zusätzlich ein Liquiditätspuffer“ |
| `PORTFOLIO_BELEIHUNG_ZU_HOCH` | Bestandsobjekt ≥ 80 % beliehen | [[Beleihungsgrenze]] |

**Auflagen** (Beispiele, ANNAHME in der Ausgestaltung): Mietvertrag nachreichen; Dispo-/
Kreditkartenrahmen kündigen (Dossier: „vorher kündigen oder reduzieren“); Finanzierungsbestätigung
**vor** dem Notartermin (Dossier: typischer Fehler, sie danach einzuholen).

### 2.5 Konditionenmodell (Zins)

```ts
function konditionen(markt, bank, x): Rate {
  let z = markt.basiszins(x.zinsbindung);              // B: 10 J. 3,9–4,5 % eff. (Ende 09/2026)
  z += bank.zinsSpreads.beleihung(x.beleihungsauslauf); // Richtung belegt („je nach Beleihung“), Stufen: LÜCKE
  if (x.ueberMarktwert)   z += bank.zinsSpreads.ueberMarktwert;   // Richtung belegt, Höhe LÜCKE
  if (x.vollfinanzierung) z += bank.zinsSpreads.vollfinanzierung; // Richtung belegt (B), Höhe LÜCKE
  if (x.paketkauf)        z -= bank.zinsSpreads.paket;            // „günstiger“, Höhe LÜCKE
  return z;                                            // anschließend Verhandlung (2.8)
}
```
**ANNAHME zur Kalibrierung:** Für Profil B so wählen, dass typische Anträge (10 J.) in
3,9–4,5 % landen – die einzige belegte Marktspanne. Zinsstruktur für 5/15/20 J.: LÜCKE.

### 2.6 Laufende Bankbeziehung und „Wie lange macht die Bank mit?“

**Mechanik (emergent aus P5/P7):**

```ts
// Wirkung eines Objekts auf den Haushaltsüberschuss der Bank (Monat):
deltaBeiNeukauf   = anrechenbareMiete/12 - darlehen * stressSatz / 12;          // Antrag: Stress
deltaImBestand    = anrechenbareMiete/12 - kapitaldienstVertrag/12 - nuKosten/12; // Folgeanträge: Vertragsrate
```
- Mit Profil A trägt sich ein voll finanziertes Objekt in der Bankrechnung erst ab ≈ 10,7 %
  Bruttokaltrendite (K34); darunter verbraucht **jeder Kauf** Haushaltsüberschuss → nach einigen
  Objekten ist der Kreditrahmen ausgeschöpft. Danach entscheidet die Portfoliobetrachtung:
  Tilgung und Wertsteigerung senken die Beleihung und können weitere Finanzierungen ermöglichen.
  Fallende Preise kehren den Effekt um ([[Portfoliobetrachtung-der-Bank]]).
- Lernziel: Die Bank finanziert nicht unbegrenzt; Beleihungsdisziplin (< 80 %) und Einkommen
  sind die zwei Hebel für weiteres Wachstum.

**Anschlussfinanzierung (Ende Zinsbindung):**
```ts
onZinsbindungsende(d: Darlehen, t: Datum) {
  const rs = d.restschuld;
  const angebot = konditionen(markt(t), bank, { zinsbindung: wahl, beleihungsauslauf: rs / bw(t), … });
  // Spieler wählt: neue Tilgung, neue Zinsbindung | Bankwechsel (ANNAHME, Kosten LÜCKE) | Verkauf
  d.rateMonat = rs * (angebot + neueTilgung) / 12;
}
```
Vereinfachte Neuprüfung bei Anschluss (nur Beleihung und Zahlungshistorie) = ANNAHME; der Vault
beschreibt keine erneute Vollprüfung. Forward-Darlehen nur als Stichwort („Forward prüfen“) →
LÜCKE.

**Preisverfall:** Laut [[Q-immocation-Blog-Immobilienblase]] fordern Banken bei fallenden Preisen
zusätzliche Sicherheiten, im Extremfall bis zur Zwangsversteigerung (Referenz USA 2008).
Auslöseschwellen und rechtliche Voraussetzungen: LÜCKE → im Spiel nur als seltenes Ereignis
mit klar gekennzeichneter ANNAHME (z. B. nur bei Anschlussfinanzierung oder Zahlungsverzug).

**Zahlungsunfähigkeit:** Kontostand < 0 → Dispo → bei anhaltendem Verzug Kündigung/Verwertung.
Fristen, Schwellen: LÜCKE (Recherche: BGB, ZVG).

### 2.7 Vermittler und Bankwahl

- Dossier-Empfehlung: **mindestens 3 Angebote** mit identischen Eckdaten (Regionalbank,
  Direkt-/Hypothekenbank, Vermittler); vergleichen nach Effektivzins, Zinsbindung,
  Sondertilgung, bereitstellungszinsfreier Zeit, Tilgungssatzwechsel, Auflagen.
- Vermittler fragt viele Banken gleichzeitig an und legt ein oder mehrere Angebote vor; „senkt
  die Einstiegshürde“. Vermittlerempfehlung: schon **vor** der Objektsuche Bonität klären.
- Engine (ANNAHME): `viaVermittler = true` → Antrag geht parallel an `k` zufällig aus den
  Profilspannen gezogene Banken; Spieler sieht die besten Angebote. Kosten für den Kunden: LÜCKE
  (Standard 0 EUR, kennzeichnen).
- Bankberater als Deal-Quelle: Off-Market-Objekt über den Bankberater ([[Fallstudie-Dominik-Neunkirchen]]).

### 2.8 Verhandlung

Zins ist verhandelbar: Einzelfall 2013 von 4 % auf 3 % (−1 Pp.) bei 5 J. Bindung
([[Fallstudie-Sebastian-Hildesheim]]). Ein Prozentpunkt ist ein Einzelfall, keine Regel →
Spiel: Verhandlungsbonus zufällig und klein, Obergrenze als Parameter (ANNAHME).

---

## 3. Parameter-Tabelle für die Spielkonfiguration

Legende Spalte „regional“: **Land** = je Bundesland, **Bank** = je Institut, **Zeit** = je
Marktphase, **Objekt** = je Objekt/Lage. Spalte „Spieler“: ob der Spieler den Wert direkt oder
indirekt beeinflussen soll (Empfehlung dieser Spezifikation).

| Parameter (Key) | Wert/Spanne | Einheit | Quelle | Stand | regional variabel? | Spieler beeinflussbar? |
|---|---|---|---|---|---|---|
| `knk.grest[BW]` | 5,0 | % KP | [[Regionale-Rechtsmatrix]] | 2026-09-30 (ohne Quellenangabe) | Land | indirekt (Standortwahl) |
| `knk.grest[BY]` | 3,5 | % KP | dto. | dto. | Land | indirekt |
| `knk.grest[BE]` | 6,0 | % KP | dto. | dto. | Land | indirekt |
| `knk.grest[BB]` | 6,5 | % KP | dto. | dto. | Land | indirekt |
| `knk.grest[HB]` | 5,5 (seit 01.07.2025) | % KP | dto., [[Kaufnebenkosten]] | 2026-09-30 | Land | indirekt |
| `knk.grest[HH]` | 5,5 | % KP | dto. | dto. | Land | indirekt |
| `knk.grest[HE]` | 6,0 | % KP | dto. | dto. | Land | indirekt |
| `knk.grest[MV]` | 6,0 | % KP | dto. | dto. | Land | indirekt |
| `knk.grest[NI]` | 5,0 | % KP | dto. | dto. | Land | indirekt |
| `knk.grest[NW]` | 6,5 | % KP | dto. | dto. | Land | indirekt |
| `knk.grest[RP]` | 5,0 | % KP | dto. | dto. | Land | indirekt |
| `knk.grest[SL]` | 6,5 | % KP | dto. | dto. | Land | indirekt |
| `knk.grest[SN]` | 5,5 | % KP | dto. | dto. | Land | indirekt |
| `knk.grest[ST]` | 5,0 | % KP | dto. | dto. | Land | indirekt |
| `knk.grest[SH]` | 6,5 | % KP | dto. | dto. | Land | indirekt |
| `knk.grest[TH]` | 5,0 (seit 01.01.2024) | % KP | dto. | dto. | Land | indirekt |
| `knk.grestInventarAbzug` | realistischer Zeitwert bewegl. Inventar; WEG-Rücklage nicht abziehbar | EUR | [[Kaufnebenkosten]] (BFH II R 49/17) | 2026-09-30 | nein | ja (Inventar ausweisen) |
| `knk.qNotarGrundbuch` | 1,5–2,0 (Pauschale 2,0) | % KP | [[Kaufnebenkosten]], [[Prozess-Haushaltsplan-und-Vermoegensaufstellung]] | 2020-11 / 2026-09-30 | nein (degressiv; Tabelle LÜCKE) | nein |
| `knk.grundschuldkosten` | LÜCKE | EUR | [[Grundschuld]] | – | nein | nein |
| `knk.qMaklerKaeufer` | LÜCKE (Satz); Halbteilung nur ETW/EFH an Verbraucher | % KP | [[Kaufnebenkosten]], [[Regionale-Rechtsmatrix]] | 2026-09-30 | LÜCKE | ja (maklerfreie Objekte, Verhandlung bei MFH) |
| `kost.mietausfallQuote` | 3 | % Kaltmiete | [[Mietausfallreserve]] | 2020-12 | Objekt/Lage („stark abhängig“) | ja (Rücklagenpolitik) |
| `kost.instandhaltung.iiBv` | 11,50 (< 22 J.), 14,58 (≥ 22 J.), 18,62 (≥ 32 J.) | EUR/m²·a | [[Instandhaltungsplanung]], [[Instandhaltungsreserve]] | ab 01.01.2026 (Stand 2026-09-30) | nein (nur Orientierung) | ja (Rücklagenhöhe) |
| `kost.instandhaltung.zuschlaege` | Aufzug +1,63; Wärmelieferung −0,31; Kleinrep. Mieter −1,70; Schönheitsrep. Vermieter +13,75 | EUR/m²·a | dto. | dto. | nein | ja (Mietvertragsgestaltung) |
| `kost.instandhaltung.peters` | HK/m² × 1,5 / 80; ETW × 65–70 % GE-Anteil | EUR/m²·a | [[Instandhaltungsplanung]] | 2026-09-30 | nein | nein |
| `kost.verwaltung.iiBv` | 372,46 (Whg), 445,32 (ETW), 48,58 (Garage) – nur preisgebunden | EUR/Einheit·a | [[Verwaltungskosten]] | ab 01.01.2026 | nein | ja (selbst verwalten vs. Verwalter) |
| `kost.pauschaleModell` | 33 (2.000 von 6.000) | % Miete | [[Bewirtschaftungskosten]] | unbekannt | nein | nein |
| `kost.hauswartKuerzung` | 20–50 | % Hauswartkosten | [[Nicht-umlagefaehige-Kosten]] | 2026-09 | nein | nein |
| `kost.sanierung.datenpunkt` | 15.000 EUR / 63 m² (≈ 238 EUR/m², 24 % KP), 2011 | EUR | [[Renovierungskosten]] | 2011 / Stand 2021 | Zeit | ja (Sanierungsentscheidung) |
| `liq.startpuffer` | 10.000–20.000 | EUR | [[Liquiditaetspuffer]] | 2020–2021 (undatiert) | nein | ja |
| `markt.zins10J` | 3,9–4,5 eff. | % p. a. | [[Zins]], [[Prozess-Finanzierungsdossier-Bank]] | 2026-09-30 | Zeit, Bank | indirekt (Bonität, EK) |
| `markt.zinsHistorie` | 1990er > 8; 2009 4,5; 2013 4→3 (5 J.); 2018 2,5; 2019–21 ~1,5; 2022–25 LÜCKE | % p. a. | [[Zins]] | 2026-09 | Zeit | nein |
| `markt.ezbEinlagenzins` | 2,50 ab 16.09.2026 (kein Kreditzins) | % p. a. | [[Zins]], [[Marktdaten-Bremen-und-Umland]] | 2026-09 | Zeit | nein |
| `kredit.anfTilgung` | Beispiele 2,0 / 3,5; Min/Max LÜCKE | % p. a. | [[Tilgung]], [[Annuitaet]] | 2020-11 | nein | **ja** |
| `kredit.zinsbindung` | Beispiele 5 und 10; Auswahl/Aufpreis LÜCKE | Jahre | [[Zins]], [[Anschlussfinanzierung]] | 2013 / 2026 | Bank | **ja** |
| `kredit.sondertilgung` | LÜCKE | % p. a. | [[Prozess-Finanzierungsdossier-Bank]] | – | Bank | ja (wenn angeboten) |
| `kredit.bereitstellungszins` | LÜCKE | % p. M. | dto., [[Nicht-umlagefaehige-Kosten]] | – | Bank | indirekt |
| `kredit.verhandlungMax` | Einzelfall −1,0 | Pp. | [[Fallstudie-Sebastian-Hildesheim]] | 2013 | nein | ja |
| `bank.bwFaktor` | A 0,80 / B ≈ 0,90 | Anteil Marktwert | [[Beleihungswert]], [[Prozess-Finanzierungsdossier-Bank]] | 2021-04 / 2026-09-30 | Bank | indirekt (nicht über Marktwert kaufen) |
| `bank.videoAbschlag` | ≥ 5; nur Darlehen ≤ 600.000 EUR, RND ≥ 40 J. | % BW | [[Beleihungswert]] | 2022-10 | nein | ja (optional) |
| `bank.mietBasis/mietAnrechnung` | A: 75 % JBKM / B: 60–80 % NKM | % | [[Sicherheitsabschlag-auf-Mieteinnahmen]], [[Haushaltsrechnung]] | 2021-04 / 2026-09-30 | Bank | indirekt (Mietvertrag vorlegen) |
| `bank.mietAnrechnungOhneVertrag` | 0 oder höherer Abschlag | % | [[Prozess-Finanzierungsdossier-Bank]] | 2026-09-30 | Bank | ja (vermietet kaufen) |
| `bank.mietpool` | teils 0 EUR angerechnet | – | dto. | dto. | Bank | ja |
| `bank.stresszins` | A 8 / B 5–6 | % p. a. | [[Kalkulatorischer-Stresszins]] | 2021-04 / 2026-09-30 | Bank, Zeit | nein |
| `bank.stressModus` | offen: nur Zinssatz oder inkl. Tilgung | – | [[Haushaltsrechnung]] vs. Haushaltsplan | – | Bank | nein |
| `bank.lebenshaltungPauschale` | LÜCKE (bankintern je Haushaltsgröße) | EUR/Monat | [[Prozess-Finanzierungsdossier-Bank]] | 2026-09-30 | Bank | nein |
| `bank.einmalzahlungAnrechnung` | „oft nicht oder anteilig“ (Quote LÜCKE) | % | [[Prozess-Haushaltsplan-und-Vermoegensaufstellung]] | 2026-09-30 | Bank | nein |
| `bank.rahmenBelastung` | ungenutzte Dispo-/Kreditkartenrahmen „teils/oft“ (Quote LÜCKE) | % Rahmen | dto., Dossier | 2026-09-30 | Bank | **ja** (Rahmen kündigen) |
| `bank.depotAbschlag` | „teils mit Abschlag“ (Höhe LÜCKE) | % | Haushaltsplan | 2026-09-30 | Bank | nein |
| `bank.lvAnsatz` | Rückkaufswert | EUR | Haushaltsplan | 2026-09-30 | nein | nein |
| `bank.ekMinimum` | Kaufnebenkosten | EUR | [[Eigenkapital]], Dossier | 2020–2026 | Bank | **ja** |
| `bank.ekQuoteWunsch` | A 0 % des KP (100 %-Finanzierung) / B 20–30 % | % KP | [[Eigenkapital]], Dossier | 2020–21 / 2026-09-30 | Bank, Zeit | **ja** |
| `bank.finanzierungsquoteProblemlos` | 50 % „ohne Weiteres“ | % KP | [[Kreditrahmen]] | 2020–21 | nein | ja |
| `bank.knkMitfinanzierung` | „nur wenige Banken“; Ausnahme sehr niedrige KP (Fall 25.000 EUR) | – | [[Kaufnebenkosten]] | 2020-11 | Bank | nein |
| `bank.portfolioSchwelle` | < 80 % je Objekt | % Bezugswert | [[Beleihungsgrenze]], [[Portfoliobetrachtung-der-Bank]] | 2021-04 | Bank | ja (Tilgung, keine Überbeleihung) |
| `bank.bestandGewagt` | 110 % Gesamtbestand „gewagt“ | % | [[Q-immocation-Blog-MFH-in-ETW-umwandeln]] | undatiert | nein | ja |
| `bank.selbststaendigJahre` | 2–3 | Jahresabschlüsse | Dossier | 2026-09-30 | Bank | nein |
| `bank.unbefristetNachProbezeit` | „viele Banken“ verlangen es | – | Dossier | 2026-09-30 | Bank | ja (Timing, Übernahmezusage, 2. Kreditnehmer) |
| `bank.angeboteMin` | ≥ 3 Angebote vergleichen | Anzahl | Dossier | 2026-09-30 | nein | **ja** |
| `bank.vermittlerUniversum` | > 500 Darlehensgeber (Interhyp, Eigenangabe) | Anzahl | [[Finanzierungsvermittler]] | 2026-09 | nein | ja (Vermittler nutzen) |
| `bank.vermittlerKosten` | LÜCKE | EUR | [[Finanzierungsvermittler]] | – | nein | nein |
| `stress.anschlusszinsPlus` | +2 | Pp. | [[Prozess-Investment-Memo-fuer-die-Bank]] (Vorlage, `quellen: []`) | 2026-09-30 | nein | nein |
| `stress.leerstandMonate` | 3 | Monate | dto., Haushaltsplan | 2026-09-30 | nein | nein |
| `stress.kostenPlus` | +30 | % auf nuK + Rücklagen | Investment-Memo | 2026-09-30 | nein | nein |
| `stress.wertMinus` | −10 | % Verkehrswert | Investment-Memo | 2026-09-30 | nein | nein |
| `stress.reparatur` | 1 Jahresrücklage | EUR | Haushaltsplan | 2026-09-30 | nein | nein |
| `steuer.afa` | 3 (fertig nach 2022), 2 (1925–2022), 2,5 (vor 1925); degressiv 5 unter Voraussetzungen | % p. a. | [[AfA]] | 2026-09-27 | nein | indirekt (Objektwahl, Kaufpreisaufteilung) |
| `steuer.grenzsteuersatz` | 30–45 (ohne Soli/KiSt) | % | [[Grenzsteuersatz]] | 2021-02 | nein | indirekt (Einkommen) |
| `steuer.spekulationsfrist` | 10 | Jahre | [[Spekulationsfrist]] | – | nein | ja (Verkaufszeitpunkt) |
| `ziel.renditeschwellen` | 3 / 5 / 6 / 7 / 8 / 10 | % brutto | [[Bruttomietrendite]] | 2018–2021 | Zeit | ja (eigene Zielvorgabe) |
| `ui.bierdeckelRegler` | KP 20.000–500.000; Miete 200–1.500/Monat; 20–200 m² | EUR, m² | [[Q-immocation-Tool-Bierdeckelrechnung]] | undatiert | nein | – |

---

## 4. Spielerentscheidungen und Trade-offs

| # | Entscheidung | Pro | Contra | Vault-Grundlage |
|---|---|---|---|---|
| E1 | **EK-Einsatz** niedrig (nur KNK) | höhere EK-Rendite bei positivem Hebel; EK frei für weitere Objekte | höhere Restschuld, Anschlussrisiko, (B) Zinsaufschlag/strengere Prüfung, Hebel kippt bei Zins > Objektrendite | [[Eigenkapital]], [[Hebeleffekt]], [[Q-immocation-Blog-Optimale-Tilgung]] |
| E2 | **Anfangstilgung** hoch | niedrige Restschuld, Verhandlungsspielraum beim Anschluss, Beleihung sinkt schneller (Portfolio-Bonität) | weniger Cashflow, weniger Liquidität für Rücklagen und Zukäufe | [[Tilgung]] („Es kommt darauf an“) |
| E3 | **Zinsbindung** lang | Schutz gegen Zinsanstieg (Gegenmaßnahme laut Memo-Vorlage) | Aufpreis (Höhe LÜCKE); bei fallenden Zinsen war kurze Bindung vorteilhaft (Hildesheim 2013→2018) | [[Anschlussfinanzierung]], [[Prozess-Investment-Memo-fuer-die-Bank]] |
| E4 | **Kaufpreis vs. Marktwert** | Verhandlung senkt KP unter Marktwert → kein BW-Gap | Überzahlen → mehr EK, schlechterer Zins | [[Beleihungswert]], [[Kaufpreis]] |
| E5 | **Bundesland/Standort** | niedrige GrESt (BY 3,5 %) senkt EK-Bedarf | Standortqualität wichtiger als Nebenkosten (Leerstand) | [[Regionale-Rechtsmatrix]], [[Kaufpreis]] |
| E6 | **Makler/Inventar** | maklerfreie Objekte, Inventar separat ausweisen → weniger KNK | Angebotsauswahl kleiner; Inventar nur mit realistischem Zeitwert | [[Kaufnebenkosten]] |
| E7 | **Puffer vs. Expansion** | Puffer fängt Mietausfall/Reparatur ab und ist Bank-Voraussetzung | gebundenes Geld bremst Wachstum | [[Liquiditaetspuffer]] |
| E8 | **Rücklagenpolitik** | ehrliche Rücklagen verhindern „Schönrechnen“ | Liquidität nach Rücklagen sinkt | [[Instandhaltungsreserve]], [[Mietausfallreserve]] |
| E9 | **Negativen Cashflow akzeptieren** | Vermögensaufbau über Tilgung; ggf. Steuererstattung | Zuzahlung belastet Haushaltsrechnung und Kreditrahmen | [[Negativer-Cashflow]] |
| E10 | **Vermietet vs. leer kaufen / Mietpool** | nachweisbare Ist-Miete wird angerechnet | Leerkauf: Bank rechnet geplante Miete oft mit 0 | [[Prozess-Finanzierungsdossier-Bank]] |
| E11 | **Bankwahl / Vermittler / ≥ 3 Angebote** | bessere Konditionen, Profile unterscheiden sich | Aufwand, Zeit | Dossier, [[Finanzierungsvermittler]] |
| E12 | **Unterlagen und Bonitätspflege** | Dispo kündigen, SCHUFA prüfen, Dossier vollständig → schnellere, bessere Zusage | Aufwand | Dossier, [[Prozess-Haushaltsplan-und-Vermoegensaufstellung]] |
| E13 | **Paketkauf** | gemeinsame Finanzierung günstiger | Klumpenrisiko | [[Q-immocation-Blog-9-Steuerkniffe-beim-Kauf]], [[Portfolio-Risiko]] |
| E14 | **Beleihungsdisziplin im Bestand** (< 80 %) | erschließt Portfoliobetrachtung, weiteres Wachstum | erfordert Tilgung/EK | [[Portfoliobetrachtung-der-Bank]] |
| E15 | **Halten oder verkaufen bei Zinsbindungsende** | Verkauf nach 10 J. steuerfrei (privat), Kapital für Neues | Transaktionskosten, Verlust des Objekts | [[Anschlussfinanzierung]], [[Spekulationsfrist]] |
| E16 | **Cashflow- vs. Wertsteigerungsstrategie** | Wertsteigerung erhöht EK-Rendite | darf Kaufentscheidung nicht tragen | [[Investition-ohne-Wertsteigerung]], [[Q-immocation-Podcast-654-Cashflow-oder-Wertsteigerung]] |
| E17 | **Selbst verwalten vs. Hausverwaltung** | spart Verwaltungskosten | Zeitaufwand („passiv“ ist relativ) | [[Verwaltungskosten]], [[Passives-Einkommen]] |
| E18 | **Sanierung bei Kauf** | höhere erzielbare Miete (Bierdeckel Stufe 2) | Kapitalbedarf, ggf. 15-%-Grenze (Steuer) | [[Renovierungskosten]], [[Bierdeckelrechnung]] |
| E19 | **Erster Kauf: ETW statt MFH** | überschaubar, WEG-Strukturen | weniger Entscheidungsfreiheit, Sonderumlagen | [[Q-immocation-Blog-ETW-oder-MFH]] |

---

## 5. Lerninhalte: Tooltips (1–3 Sätze)

| Begriff | Tooltip | Link |
|---|---|---|
| Kaufnebenkosten | Grunderwerbsteuer (je Bundesland 3,5–6,5 %), Notar und Grundbuch (rund 2 %) und ggf. Makler. Sie werden in der Regel aus Eigenkapital bezahlt, weil ihnen kein Gegenwert gegenübersteht. | [[Kaufnebenkosten]] |
| Gesamtkaufkosten | Kaufpreis plus Kaufnebenkosten – das, was du wirklich aufbringen musst. Nenner der Nettomietrendite. | [[Gesamtkaufkosten]] |
| Jahresnettokaltmiete | Kaltmiete ohne Nebenkosten mal zwölf. Warmmiete ist kein Ertrag: Nebenkosten reichst du durch. | [[Jahresnettokaltmiete]] |
| Bruttomietrendite | Jahresnettokaltmiete geteilt durch Kaufpreis. Schneller Filter, der Kosten, Finanzierung und Steuern ignoriert. | [[Bruttomietrendite]] |
| Kaufpreisfaktor | Wie viele Jahresmieten kostet das Objekt? Kehrwert der Bruttomietrendite – keine Amortisationsdauer. | [[Kaufpreisfaktor]] |
| Bierdeckelrechnung | Zweistufiger Schnelltest: erst mit der Inseratsmiete, nach dem Erstgespräch mit erzielbarer Miete und Renovierungskosten. Ersetzt keine Vollkalkulation. | [[Bierdeckelrechnung]] |
| Nettomietrendite | Miete minus nicht umlagefähiger Kosten, geteilt durch Kaufpreis plus Nebenkosten. Aussagekräftiger als brutto, aber ohne Zins und Steuer. | [[Nettomietrendite]] |
| Nicht umlagefähige Kosten | Was du nicht auf den Mieter umlegen darfst: Verwaltung, Reparaturen, Rücklagen, Finanzierung. Sie mindern Rendite und Cashflow. | [[Nicht-umlagefaehige-Kosten]] |
| Instandhaltungsreserve | Planbetrag für künftige Reparaturen; kein Steueraufwand und noch keine Ausgabe. Orientierung: 11,50–18,62 EUR/m² und Jahr je nach Gebäudealter (II. BV). | [[Instandhaltungsreserve]] |
| Mietausfallreserve | Rücklage für Leerstand und säumige Mieter, laut immocation rund 3 % der Kaltmiete. Deckt den Durchschnitt, nicht den Totalausfall. | [[Mietausfallreserve]] |
| Liquiditätspuffer | 10.000–20.000 EUR, die nach dem Kauf auf dem Konto bleiben. Er ist nicht Teil des Eigenkapitals und die Grenze deines Hebels. | [[Liquiditaetspuffer]] |
| Eigenkapital | Dein eigenes Geld im Deal – mindestens die Kaufnebenkosten. Weniger EK hebt die EK-Rendite, erhöht aber Restschuld und Risiko. | [[Eigenkapital]] |
| Zins | Entgelt an die Bank, berechnet auf die Restschuld. Gilt nur bis zum Ende der Zinsbindung. | [[Zins]] |
| Tilgung | Der Teil der Rate, der deine Schuld senkt. Baut Vermögen auf, fließt aber trotzdem vom Konto ab. | [[Tilgung]] |
| Annuität | Gleichbleibende Rate aus Zins und Tilgung; der Tilgungsanteil wächst jeden Monat. Jahresrate = Darlehen × (Zins + Anfangstilgung). | [[Annuitaet]] |
| Kapitaldienst | Zins plus Tilgung pro Jahr – meist der größte Abzug von deiner Miete. | [[Kapitaldienst]] |
| Restschuld | Was am Ende der Zinsbindung noch offen ist. Je höher, desto stärker trifft dich ein höherer Anschlusszins. | [[Tilgung]] |
| Anschlussfinanzierung | Neue Konditionen für die Restschuld nach Ablauf der Zinsbindung. Steigt der Zins, steigt die Rate oder die Laufzeit. | [[Anschlussfinanzierung]] |
| Operativer Cashflow | Miete minus tatsächlich bezahlter Objektkosten, vor der Bank. Zeigt, wie viel Spielraum das Objekt für die Rate lässt. | [[Operativer-Cashflow]] |
| Cashflow nach Finanzierung | Was nach Zins und Tilgung übrig bleibt (= Cashflow vor Steuern). Negativ heißt: du zahlst monatlich zu. | [[Cashflow-nach-Finanzierung]] |
| Cashflow nach Steuern | Cashflow vor Steuern minus Steuer bzw. plus Erstattung. AfA senkt die Steuer, aber nicht den Cashflow; Tilgung umgekehrt. | [[Cashflow-vor-und-nach-Steuern]] |
| Selbst abzahlende Immobilie | Miete deckt Kosten, Rücklagen und Bankrate – der Mieter zahlt den Kredit ab. Ziel, keine Pflicht; muss auch nach der Zinsbindung halten. | [[Selbst-abzahlende-Immobilie]] |
| Eigenkapitalrendite | Ertrag bezogen auf dein eigenes Geld. Immer prüfen, was im Zähler steht – Cashflow, Tilgung oder Wertsteigerung. | [[Eigenkapitalrendite]] |
| Hebeleffekt | Fremdkapital steigert die EK-Rendite, solange das Objekt mehr abwirft als der Kredit kostet. Ist der Zins höher, wirkt der Hebel gegen dich. | [[Hebeleffekt]] |
| Beleihungswert | Was die Bank als Sicherheit ansetzt – unter dem Marktwert (2021: ~80 %, 2026: ~90 %). Darüber finanziert die Bank meist nicht oder nur teurer. | [[Beleihungswert]] |
| Beleihungsgrenze | Restschuld im Verhältnis zum Objektwert. Liegt jedes Bestandsobjekt unter 80 %, stärkt das deine Bonität. | [[Beleihungsgrenze]] |
| Sicherheitsabschlag | Die Bank rechnet nicht mit deiner vollen Miete, 2026 typischerweise mit 60–80 % der Nettokaltmiete. Ohne Mietvertrag oft gar nicht. | [[Sicherheitsabschlag-auf-Mieteinnahmen]] |
| Stresszins | Hoher Prüfzins (2021: 8 %, 2026: 5–6 %), mit dem die Bank testet, ob du die Rate auch nach der Zinsbindung trägst. Nicht der Zins, den du zahlst. | [[Kalkulatorischer-Stresszins]] |
| Haushaltsrechnung | Die Bank stellt dein Einkommen gegen Lebenshaltungspauschalen, Raten und den Kapitaldienst zum Stresszins. Bleibt nichts übrig, gibt es keinen Kredit. | [[Haushaltsrechnung]] |
| Kreditrahmen | Wie viel Kredit dir eine Bank insgesamt gibt – abhängig von Einkommen und Vermögen. Jeder Kauf verbraucht davon. | [[Kreditrahmen]] |
| Portfoliobetrachtung | Ist dein Rahmen ausgeschöpft, schaut die Bank auf deinen Bestand: niedrige Beleihung, getilgte Kredite und Wertzuwächse helfen. | [[Portfoliobetrachtung-der-Bank]] |
| Grundschuld | Sicherungsrecht der Bank im Grundbuch; zahlst du nicht, kann sie das Objekt verwerten lassen. | [[Grundschuld]] |
| Finanzierungsvermittler | Fragt mit deinen Unterlagen viele Banken gleichzeitig an und legt Angebote vor. Unabhängig ist der Vergleich, nicht unbedingt die Beratung. | [[Finanzierungsvermittler]] |
| Verkäuferdarlehen | Der Verkäufer stundet einen Teil des Kaufpreises. Es ist eine Schuld, kein Eigenkapital. | [[Verkaeuferdarlehen]] |
| Negativer Cashflow | Du zahlst monatlich zu. Vertretbar, wenn es an der Tilgung liegt und dauerhaft tragbar ist – nicht, wenn Kosten oder Leerstand die Ursache sind. | [[Negativer-Cashflow]] |
| Passives Einkommen | Miete minus laufende Kosten nach vollständiger Tilgung – vor Steuern und ohne Inflation. | [[Passives-Einkommen]] |

---

## 6. Lücken und Widersprüche im Vault

### 6.1 Widersprüche und Inkonsistenzen

| # | Thema | Befund | Notizen |
|---|---|---|---|
| W1 | Laufzeit 2 %/2 % | Quellen nennen 36, 28 und 30 Jahre; nachgerechnet 35,0 J. (monatl. 34,7). Die Quellnotiz [[Q-immocation-Blog-Optimale-Tilgung]] behauptet, die 28 J. passten „eher zur Kombination 2 % Zins und 2 % Tilgung“, und [[Q-immocation-Blog-Finanzierung-in-4-Schritten]] wiederholt das – **falsch**: 28 J. gelten für 4 %/2 %, wie [[Annuitaet]] und der Audit korrekt rechnen. | [[Annuitaet]] |
| W2 | Laufzeit Gründerfall | Quelle: 27 J. bei 2,5 %/3,5 %; nachgerechnet ≈ 21,8 J. | [[Annuitaet]], [[Fallstudie-Marco-und-Stefan]] |
| W3 | Finanzierungshöhe | 100-%-Finanzierung empfohlen (2020–21) vs. „max. Darlehen ≈ Beleihungswert ≈ 80 % Marktpreis“ (2021, gleicher Anbieter) vs. 2026 EK 20–30 % gewünscht. 110 % für den Bestand „gewagt“. | [[Eigenkapital]], [[Beleihungswert]], [[Kreditrahmen]] |
| W4 | Mietbezug Bankabschlag | 25 % Abschlag auf **Jahresbrutto**kaltmiete (2021) vs. Anrechnung 60–80 % der **Netto**kaltmiete (2026); Begriff „Jahresbruttokaltmiete“ in der Quelle ungeklärt. | [[Sicherheitsabschlag-auf-Mieteinnahmen]], [[Jahresbruttokaltmiete]] |
| W5 | Stresszins / Mindestrendite | 8 % (2021) vs. 5–6 % (2026); abgeleitete 10-%-Mindestrendite der Bank vs. Investorenschwellen 5–6 %. | [[Kalkulatorischer-Stresszins]] |
| W6 | Beleihungswert-Faktor | „meist 80 % des Marktpreises“ (2021) vs. „oft rund 10 % unter Verkehrswert“ (2026). | [[Beleihungswert]], [[Prozess-Finanzierungsdossier-Bank]] |
| W7 | Bezugswert der Beleihung | Beleihungswert (offen), Verkehrswert (Investment-Memo: „Darlehen / Verkehrswert“), Kaufpreis (Haushaltsplan-Beispiel „90 % Beleihung“ = Darlehen/KP). | [[Beleihungsgrenze]], [[Prozess-Investment-Memo-fuer-die-Bank]], [[Prozess-Haushaltsplan-und-Vermoegensaufstellung]] |
| W8 | Stressbelastung | „Darlehen × 8 %“ ([[Haushaltsrechnung]]) vs. „Kapitaldienst zum Stresszins“ (Haushaltsplan) – ob die Tilgung zusätzlich angesetzt wird, bleibt offen. | – |
| W9 | KNK-Mitfinanzierung | „nur wenige Banken“ vs. Fall 25.000 EUR mit Mitfinanzierung. | [[Kaufnebenkosten]] |
| W10 | GrESt-Sätze | [[Kaufnebenkosten]] (`offen`) und [[Recherche-Backlog]] melden die Sätze der übrigen Länder als fehlend, [[Regionale-Rechtsmatrix]] enthält alle 16 – allerdings mit `quellen: []`. | – |
| W11 | Notar/Grundbuch | „rund 2 %“ vs. „ca. 1,5–2 %“; ob Grundschuldkosten enthalten sind oder hinzukommen, ist uneinheitlich. | [[Kaufnebenkosten]], Haushaltsplan |
| W12 | Rücklagenhöhe | 3 % der Kaltmiete (Mietausfall) vs. 33 % Pauschale für alle laufenden Kosten; Verhältnis offen. | [[Instandhaltungsreserve]] |
| W13 | Puffer-Logik | Einmaliger Startpuffer 10–20 T EUR vs. laufende 3-%-Rücklage; je Objekt oder Bestand offen. | [[Liquiditaetspuffer]] |
| W14 | Cashflow-Definition | immocation zieht Rücklagen vor der Bankrate ab (Quellnotiz [[Q-immocation-Seite-Richtig-kalkulieren]]), die Vault-Fachnotizen (2026) rechnen zahlungsbasiert und weisen Rücklagen separat aus. | [[Cashflow]], [[Kapitaldienst]] |
| W15 | Eigenkapitalbedarf | [[Eigenkapital]]: Puffer ist **kein** EK; Haushaltsplan rechnet Puffer und Renovierung in den „Eigenkapitalbedarf“ ein. | – |
| W16 | Steuerstufe | immocation-Seite: Steuer nur als Belastung; Fachnotizen: auch Erstattung möglich. | [[Cashflow-vor-und-nach-Steuern]] |
| W17 | Grenzsteuersatz | 30–45 % vs. 42 % „inklusive Soli“ (ungenau). | [[Grenzsteuersatz]] |
| W18 | Renditeschwellen | 3/5/6/7/8/9/10 % ohne brutto/netto-Angabe, aus verschiedenen Jahren. | [[Bruttomietrendite]] |
| W19 | Selbstabzahlung | harte Bedingung (Standortanalyse) vs. „großteils“ (Richtig kalkulieren). | [[Selbst-abzahlende-Immobilie]] |
| W20 | EK-Rendite 20 % vs. 6 % | Eingaben nur in einer Grafik, Zähler unklar. | [[Eigenkapitalrendite]] |
| W21 | Fall Hildesheim | 8 % Rendite, aber −26 EUR/Monat Cashflow; ungeklärt. | [[Negativer-Cashflow]] |
| W22 | Frontmatter | `gueltigkeit: unbekannt` in vielen Notizen, obwohl [[Vault-Regeln]] nur aktuell/pruefen/historisch erlauben; mehrere `aktuell`-Notizen ohne `geprueft_am` (Pflicht laut Regeln), z. B. [[Annuitaet]], [[Tilgung]], [[Zins]]. Die 2026-Bankwerte ([[Prozess-Finanzierungsdossier-Bank]]) und die GrESt-Tabelle haben `quellen: []`. | – |

### 6.2 Lücken (mit Rechercheziel)

| # | Fehlt | Wofür im Spiel nötig | Wo recherchieren |
|---|---|---|---|
| L1 | Lebenshaltungspauschalen der Banken je Haushaltsgröße | P5 Haushaltsrechnung | Selbstauskunftsformulare/Kalkulationsrichtlinien von Banken, Vermittler; Backlog „Bankpraxis“ |
| L2 | Zinsaufschläge nach Beleihungsauslauf, Bonität, Vollfinanzierung, Kauf über Marktwert; Paketrabatt | P8 Konditionen | Vermittler-Zinstabellen nach Beleihungsauslauf; Bundesbank MFI-Zinsstatistik |
| L3 | Zinsstruktur nach Zinsbindung (5/10/15/20 J.) | Wahl der Zinsbindung | Bundesbank-Zeitreihen Wohnungsbaukredite nach Zinsbindung |
| L4 | Zinsreihe 2022–2025 | historische Szenarien | Bundesbank-Zinsstatistik (Backlog „Zinsreihe“) |
| L5 | Sondertilgung, Tilgungssatzwechsel, Bereitstellungszins und -freie Zeit | Angebotsmerkmale | Bankangebote, Verbraucherzentrale |
| L6 | Forward-Darlehen (Vorlauf, Aufschlag), Prolongation vs. Umschuldung, Kosten des Bankwechsels | Anschlussfinanzierung | Bank-/Vermittlerinformationen, Fachliteratur |
| L7 | Kündigungsrechte, Vorfälligkeitsentschädigung | Verkauf vor Ablauf der Zinsbindung | BGB (§ 489, § 502), Fachliteratur – im Vault gar nicht behandelt |
| L8 | Grundschuld: Rechtsgrundlage, Kosten, Rang, Löschung/Weiterverwendung | Besicherung, Nachfinanzierung | BGB, GNotKG (Backlog „Grundschuld Rechtsrahmen“) |
| L9 | Notar-/Grundbuchgebühren als Staffel | genauere KNK | GNotKG-Tabelle |
| L10 | Maklerprovision (übliche Käufersätze, regional) | KNK | Marktberichte; Rechtsrahmen § 656c BGB ist vorhanden |
| L11 | Kreditrahmen-Spanne (abgeschnitten) | Plausibilisierung | Originalartikel „Wie lange macht die Bank mit?“ |
| L12 | Kriterien/Schwellen der Portfoliobetrachtung; Bezugswert der 80 % | P7 | Bankpraxis, Vermittler (Backlog) |
| L13 | Definition „sehr gute Bonität“; Wirkung von SCHUFA-Einträgen | P1, P9 | Bankpraxis |
| L14 | DSCR/Kapitaldienstdeckung | ggf. MFH-/Gewerbefinanzierung | Fachliteratur gewerbliche Immobilienfinanzierung |
| L15 | Zahlungsverzug Darlehen: Kündigung, Verwertung, Zwangsversteigerung; Nachbesicherung bei Preisverfall | Krisenmechanik | BGB, ZVG, AGB-Banken |
| L16 | Verkäuferdarlehen: Bankbehandlung, Rang, Steuer | Deal-Strukturierung | Backlog „Verkäuferdarlehen“ |
| L17 | Vermittlervergütung/Kosten für Kunden | Vermittler-Mechanik | Interhyp-Vergütungsinformationen |
| L18 | Instandhaltungsquote für frei finanzierten Wohnraum (immocation-Tool) | K13 | [[Q-immocation-Tool-Kalkulationstool]] |
| L19 | Übliche Hausverwaltungs-/SEV-Gebühren, Hausgeldhöhen | K12 | Marktübersichten Verwalterverbände |
| L20 | Zahlenbeispiel Steuerstufe (immocation) | Plausibilisierung K27 | Podcast #536, #625 (Transkripte) |
| L21 | Förderdarlehen (KfW) in der Finanzierung | Energetische Sanierung | KfW-Merkblätter (nur Heizungsförderung im Vault) |
| L22 | Finanzierung von Sanierung/Modernisierung, Zwischenfinanzierung | Value-Add-Strategien | Bankpraxis |
| L23 | Min./max. Anfangstilgung, maximale Laufzeit, Alter des Kreditnehmers | Grenzen der Spielerwahl | Bankpraxis |
| L24 | Inflation/Mietsteigerung/Kostensteigerung für Projektionen | Langfristsimulation | Statistik (Destatis VPI, Mietindizes) – Markt-Recherche |
| L25 | Beleihungswertmethodik (Ertragswert, Kapitalisierungszins nach BelWertV-Novelle 2022) | realistischere BW-Ermittlung | BelWertV im Wortlaut (Backlog) |
| L26 | Bewertung „behäbiger Banken“ 2026 in Zahlen (Bearbeitungszeit, Ablehnungsquoten) | Zeitverzug-Mechanik | Bundesbank Bank Lending Survey |

---

## Anhang: Empfehlungen für die Umsetzung

1. **Profil B als Standard**, Profil A als historischer Lernmodus; beide Werte im UI mit Stand
   und Quelle anzeigen (Vault-Regel: Stand bei `pruefen`/unklarer Gültigkeit ausdrücklich nennen).
2. **Alle LÜCKE-Parameter** in eine eigene Konfigurationsdatei mit Feld `annahme: true` und
   Begründung, damit sie später durch Rechercheergebnisse ersetzt werden können.
3. **Cashflow immer stufenweise anzeigen** (operativ → nach Finanzierung → nach Steuern) plus
   separat „Liquidität nach Rücklagen“ – das ist die im Vault 2026 vereinheitlichte Lesart.
4. **Bankentscheidung erklären**: jede Absage/jedes Gegenangebot mit Code, Zahlen (Überschuss,
   BW, EK-Lücke) und Tooltip-Link; das ist der eigentliche Lerneffekt.
5. **Golden Tests T1–T13** als Unit-Tests der Engine.
