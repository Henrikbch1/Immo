# Sprint Z1 – Rechenkern A + Darlehensrechner (27.11.2026)

## Gebaut
- `sim-core/geld.ts`: `Cents`, Basispunkte (`Bp`), `eur()`, `prozent()`, `roundHalfAwayFromZero`, `floorToEuro`, `anteil()`.
- `sim-core/detmath.ts`: `powInt`, `expDet`, `lnDet` mit fester Termzahl – gegen decimal.js getestet (rel. Fehler < 1e-12).
- `sim-core/zufall.ts`: zählerbasierter Zufall `rand(seed, domain, monat, entität, k)` (Murmur3-Finalizer, 53 Bit), Goldwerte fixiert.
- `sim-core/parameter.ts`: Parameter-Registry mit Status/Quelle/Stand, `RULES_VERSION = de-2026.1`, fünf Darlehensparameter.
- `sim-core/darlehen.ts`: Monatsrate (K21), Monatszins (K20), Tilgungsplan bis schuldenfrei mit jährlicher Sondertilgung (K22),
  Restschuld jährlich nachschüssig, Laufzeit jährlich/monatlich (K23, mit `lnDet`), Anschluss-Mehrbelastung (K24), Jahresübersicht.
- Tests: Golden **T2–T5** (research/10 §1.9), Property-Tests (Σ Tilgung + Rest = Darlehen, Restschuld monoton, Rate = Zins + Tilgung,
  Determinismus, Rundungsfehler ≤ ½ Cent), Formatter-Goldens. 28 Tests grün.
- `@immo/ui`: `parseDeZahl` (deutsche Eingabe), `formatJahreMonate`; Datenfarben `--series-1/2` (mit dataviz-Validator geprüft, hell/dunkel).
- Seite **Darlehensrechner** (`#/rechner/darlehen`, verlinkt von Start und Finanzen): Eingaben mit Prüfung am Feld, vier Kennzahlen
  mit Status-Badge (B/Ä/G/D, Quelle im Tooltip), Restschuld-Diagramm (SVG, eine Achse, Hover + Pfeiltasten, Legende bei 2 Reihen),
  Tilgungsplan nach Jahren (Tabelle = Alternative zum Diagramm), Vergleich mit/ohne Sondertilgung.

## Bewusst weggelassen / verschoben
- T1, T6–T13 (Bierdeckel, Kaufnebenkosten, Cashflow, Reserven) gehören fachlich zu Z2 und werden dort umgesetzt.
- `explain()`-Rechenweg und Erklär-Karte → Z2 (bis dahin Rechenweg als Text unter dem Rechner).
- ECharts: für eine Linie reicht SVG (ADR 0007 erlaubt das, spart Bundle). Browser-Matrix-Hash → Z2.

## Bekannte Punkte
- Deploy auf Pages hängt weiter an der Einstellung (STATUS, Q13). Verify läuft in GitHub Actions grün.
- Restschuld 10 J. bei 300.000 €, 4 %, 2 %: **226.375 €** (monatliche Verrechnung). Bankrechner mit anderer Verrechnung
  (z. B. vierteljährlich) weichen leicht ab.

## Abnahme-Checkliste
1. 300.000 €, 4,0 %, 2 % Tilgung → Rate **1.500,00 €**, Restschuld nach 10 Jahren **226.375 €** – mit deiner Vergleichsrechnung prüfen.
2. Sondertilgung 5.000 €/Jahr → Laufzeit sinkt von 27 J. 7 M. auf 18 J. 9 M., Zinsersparnis wird angezeigt.
3. Jeder Wert zeigt ein Status-Badge (Beispielzins „G Geschätzt“, Ergebnisse „Ä Abgeleitet“, Sondertilgungs-Zeitpunkt „D Design“).
4. Zahlen formatiert „1.234,56 €“; Eingabe „300.000“ und „4,5“ funktioniert, „abc“ zeigt eine Fehlermeldung am Feld.
5. Tastatur: Tab durch alle Felder; im Diagramm mit Pfeiltasten Jahre wählen.
6. Fußzeile zeigt Sprint „Z1“.
