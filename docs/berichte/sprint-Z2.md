# Sprint Z2 – Rechenkern B + Kalkulator, Meilenstein M-A (27.11.2026)

## Gebaut
- `sim-core/kennzahl.ts`: Datenvertrag `Kennzahl` (03 §3.1) mit Herleitung (Posten mit Operator, Wert, Einheit, Parameter-ID),
  Status, Schätz-Markierung (pflanzt sich fort), Rundung, Vereinfachungen; `explain(kennzahlen, schluessel)`.
  Der Wert wird **aus** der Herleitung gerechnet – Rechenweg und Zahl können nicht auseinanderlaufen.
- `sim-core/kalkulation.ts`: Kaufnebenkosten K05 (GrESt 16 Länder, auf volle Euro abgerundet, Inventar mindert nur die
  Basis; Notar/Grundbuch-Pauschale; Makler optional), Bierdeckel K02/K09–K11 mit Ampel, Instandhaltung II. BV K13,
  Mietausfall K14, Gesamtkosten/Darlehen/Quote K06–K08, Nettorendite K17, Cashflow-Kaskade K25–K26 (+ Steuerstufe nur
  als Näherung für T11), Bank-Mindestrendite K34 (T9), `kalkuliere()` für die Vollkalkulation.
- Parameter-Registry: 16 GrESt-Sätze (NW **BELEGT**, übrige GESCHÄTZT bis Primärtext, research/25), Notar 2 %, Makler 3,57 %,
  Mietausfall 3 % (GESCHÄTZT), II.-BV-Sätze (BELEGT), Ampel-Schwellen 5/6/8/10 % (DESIGN, LR-55).
- `sim-core/pruefsumme.ts`: SHA-256 in reinem TS + kanonische Serialisierung; `referenz.ts`: Beispielobjekt und
  Referenzszenario über 480 Monate → **Golden-Hash-Test** (Node). Chromium liefert für die Demo-Seite dieselbe Prüfsumme
  wie Node (als Test festgehalten).
- Tests: Golden **T1, T6–T13** (research/10 §1.9), GrESt NDS/NRW/HB, Property-Tests (Herleitung = Wert für jede Kennzahl,
  Kaskade konsistent, Bundesland ändert nur GrESt), SHA-256 gegen FIPS-Vektoren und `node:crypto`. 55 Tests grün.
- `pnpm balance`: Balancing-CLI-Gerüst (Monte-Carlo über 2.000 Zufallsobjekte, Quantile, Ampel-Verteilung,
  Platzhalter-Bänder, `--json`, Exit-Code 2 bei Bandverletzung).
- Seite **Bierdeckel & Kalkulator** (`#/rechner/kalkulator`, verlinkt von Start und Markt): Objekt-Eingaben, Bierdeckel-Ampel
  (Icon + Text), vier Kennzahl-Kacheln, Annahmen, KNK-Tabelle, Renditen, Cashflow-Kaskade (Jahr/Monat), Leerzustand Steuer.
  **Erklär-Karte** (O-01, einfache Form): jede Zahl per Klick/Enter, Ebene 1–3, verschachtelte Posten mit Pfad (nie gestapelt),
  Esc geht eine Stufe zurück, Fokus kehrt zurück; mobil als Bottom Sheet. Fußzeile zeigt die **Prüfsumme**.

## Bewusst weggelassen / verschoben
- Steuer (P4) und Rücklagenmodell (P4) laut Plan; Cashflow nach Steuern als Leerzustand.
- Browser-Matrix Firefox/WebKit: in der Cloud-Umgebung nicht installiert → nur Chromium geprüft. Vitest-Browser-Modus folgt mit Z3+.
- Erklär-Karte ohne „Anheften“, Glossar und Lektion (P3-Umfang).

## Bekannte Punkte
- GrESt NI/HB und die 13 übrigen Länder bleiben GESCHÄTZT, bis die Landesgesetze im Wortlaut geprüft sind (LR-09).
- Nicht umlagefähiger Hausgeldanteil ist Eingabe (kein Vault-Wert, LR-42). Hausgeld-Rücklage und Instandhaltungsreserve
  können sich überschneiden (K13) – im Text der Karte nicht eigens erklärt.
- Kapitaldienst der Kaskade = erstes Darlehensjahr (12 Raten), als Vereinfachung markiert.

## Abnahme-Checkliste
1. Bundesland wechseln: Niedersachsen **10.000 €** (5,0 %), Nordrhein-Westfalen **13.000 €** (6,5 %, „B Belegt“), Bremen **11.000 €** (5,5 %) bei 200.000 €.
2. Beispielobjekt (Bremen, 200.000 €, 65 m², 750 € Miete, Hausgeld 280 € davon 110 € nicht umlagefähig, BJ 1972, EK 30.000 €,
   4 %/2 %) mit deiner Rechnung prüfen: KNK **15.000 €**, Gesamt **215.000 €**, Darlehen **185.000 €** (Rate 925 €),
   Brutto **4,50 %**, Faktor **22,22**, Netto **3,57 %**, operativer CF **7.680 €/Jahr**, CF nach Finanzierung **−3.420 €/Jahr**,
   Instandhaltung **1.210,30 €**, Mietausfall **270 €**, Liquidität nach Rücklagen **−4.900,30 €/Jahr**.
3. Auf eine Zahl klicken → „Wie wurde das berechnet?“ öffnet die Karte; Posten mit › öffnen die nächste Ebene, Esc geht zurück.
4. Fußzeile zeigt „Prüfsumme 4c230e895411“ für das Beispielobjekt; Kaufpreis ändern und zurück auf 200.000 → wieder dieselbe.
5. Ampel ist rot mit Text „Unter 5 %“; bei 900 € Miete (5,4 %) gelb, bei 1.100 € (6,6 %) grün.
6. Fußzeile zeigt Sprint „Z2“.
