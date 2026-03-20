# IMMOPATH – Immobilien-Simulation (SPA)

Eine vollständig clientseitige Immobilien-Simulation als Vanilla-JavaScript SPA.  
Kein Framework, kein Build-Schritt – läuft direkt im Browser.

---

## 🚀 Setup & Start

### Voraussetzung
Ein einfacher HTTP-Server (wegen ES-Modules; `file://` funktioniert nicht).

```bash
# Mit npx (Node.js erforderlich)
npx http-server game/immopath/public -o

# Alternativ: Python
python -m http.server 8080 --directory game/immopath/public

# Alternativ: VS Code → Live Server Extension → Rechtsklick auf public/index.html
```

Dann im Browser aufrufen: `http://localhost:8080`

### Browser-Support
- Chrome/Edge 92+ ✅
- Firefox 90+ ✅
- Safari 15+ ✅
- Kein Internet Explorer

---

## 📁 Ordnerstruktur

```
immopath/
├── public/
│   ├── index.html          # SPA-Shell, HUD, Nav, Dialog-Container
│   └── assets/
│       └── styles.css      # Dark Theme, CSS-Variablen, BEM
├── src/
│   ├── main.js             # Einstiegspunkt, Boot-Logik
│   ├── router.js           # Hash-Router (#/market, #/portfolio, #/log, #/property/:id)
│   ├── state.js            # Zentraler Spielzustand (getState/setState/save/load/reset)
│   ├── time.js             # Zeitraffer-Engine (1–60 Tage/Sekunde)
│   ├── market.js           # Marktentwicklung (Mean-Reversion + Rauschen)
│   ├── marketplace.js      # Angebotserzeugung (rollOffers, makeOffer, rentBand)
│   ├── financing.js        # Annuität, Nebenkosten, DTI-Prüfung
│   ├── properties.js       # Objekt-Lebenszyklus (Kauf, Reno, Betrieb, Verkauf)
│   ├── tenants.js          # Mieter-Logik (Bewerber, Vermietung, Auszug)
│   ├── events.js           # Seltene Zufalls-Events
│   ├── utils.js            # clamp, rnd, EUR-Formatter, uuid, Datumshelfer
│   ├── tests.js            # Unit-nahe Tests (kein Framework)
│   └── ui/
│       ├── hud.js          # HUD-Controller
│       ├── marketView.js   # Marktplatz-Ansicht
│       ├── portfolioView.js# Portfolio-Ansicht
│       ├── logView.js      # Ereignis-Log
│       ├── propertyDetailView.js # Detail-Tabs (Vermietung/Reno/Bewertung/Verkauf/Finanzen)
│       ├── dialogs.js      # Kauf-Dialog, Info-Dialog
│       └── components.js   # Badge, KPI-Box, Sparkline, Fortschrittsbalken
└── README.md
```

---

## 🎮 Spielanleitung

### Start
- Startzustand: 5.000 € Kapital, 2.000 € Nettoeinkommen, 620 Bonität
- **Start** drücken → Zeitraffer läuft (Standard: 3 Tage/Sekunde)
- **Tempo-Regler**: 1×–60× Zeitraffer
- **Leertaste**: Start/Pause (Fokus auf `<body>`)

### Kaufen
1. Marktplatz öffnen (`#/market`)
2. Angebot auswählen → **Kaufen**
3. Kauf-Dialog: Eigenkapital-Anteil anpassen, Rate & DTI prüfen
4. Bei grünem DTI und ausreichend Kapital → **Kaufen** bestätigen

### Nach dem Kauf (keine Strategie-Buttons!)
Die Strategie ergibt sich durch deine Handlungen:

| Handlung | Strategie |
|---|---|
| Mieter suchen → vermieten → halten | Buy & Hold |
| Renovieren → Gutachten → teuer verkaufen | Fix & Flip |
| Renovieren → vermieten → ARV erhöht Verkaufserlös | Fix & Hold |

### Vermietung
1. Portfolio → Objekt → **Details** → Tab **Vermietung**
2. Kaltmiete festlegen (Marktband sichtbar)
3. **Inserat starten** → Bewerber erscheinen stochastisch
4. Bewerber aus Liste auswählen → **Einziehen**

### Renovierung
1. Tab **Renovierung** → Scope wählen (Leicht / Mittel / Umfassend)
2. Kosten & Dauer werden angezeigt
3. **Starten** → Cash-Abfluss monatlich, Fortschritt sichtbar
4. Nach Abschluss: Zustand steigt, Mietpotenzial erhöht sich

### Bewertung (ARV)
- Tab **Bewertung** → **Gutachten beauftragen** (500–1.000 €)
- Setzt den ARV (After Repair Value) → Grundlage für Verkaufspreisbildung

### Verkauf
- Tab **Verkauf** → Mindestpreis festlegen → **Zum Verkauf einstellen**
- Monatliche Verkaufswahrscheinlichkeit abhängig von Preis vs. fairer Wert & Markt-Hitze
- Bei Erfolg: Erlös = Verkaufspreis − Verkaufskosten (~2,5 %) − Restschuld

---

## 🧮 Wichtige Formeln & Stellschrauben

### Annuität
```js
function monthlyRate(P, annualRate, n) {
  const r = annualRate / 12;
  if (r === 0) return P / n;
  const a = Math.pow(1 + r, n);
  return (P * r * a) / (a - 1);
}
```

### Effektiver Zins
```
annualRate = clamp(baseInterest + (700 - creditScore) / 10000, 0.02, 0.09)
```
Schlechte Bonität (unter 700) → Zinsaufschlag bis 4 %.

### DTI-Limit
```
DTI = Summe(Kreditraten) / netIncome ≤ 0.40
```
Über 40 % → Kredit wird blockiert.

### Angebotspreisbildung
```
Preis = areaM2 × zone.pricePerM2 × rnd(0.95, 1.12) × (1 + (heat - supply) / 300)
```

### Mietpotenzial
```
Miete = areaM2 × zone.rentPerM2 × rentIndex × (0.8 + condition / 200)
Band: ±15 % um Mittelpunkt
```

### Marktentwicklung (monatlich, Mean-Reversion)
```
heat        += rnd(-2, 2) + (50 - heat) × 0.02          → clamp 0..100
supply      += rnd(-1.5, 1.5) + (50 - supply) × 0.01    → clamp 0..100
baseInterest += (heat - 50) / 10000 + rnd(-0.0005, 0.0005) → clamp 0.01..0.08
rentIndex   += (heat - supply) / 10000 + rnd(-0.002, 0.002) → clamp 0.8..1.3
```

### Versteckter Leerstand (~3 % p.a. Baseline)
```
hiddenVacancyRate = zone.vacBase / 12 × (1 + (50 - heat) / 200)
```
Nie direkt sichtbar; reduziert den effektiven Mietertrag im Hintergrund.

### Bonität
```
cash < -200     → creditScore -= 12
DTI < 35 % && cash ≥ 0 → creditScore += 4
Bereich: 300..850
```

---

## 💾 Persistenz & Versionierung

- **Key**: `immo_sim_v1` in `localStorage`
- **Autosave**: Bei jedem Monatsabschluss und wichtigen Aktionen (Kauf, Reno-Start etc.)
- **Manuelle Kontrolle**: Buttons „Speichern" und „Reset" im HUD
- **Migration**: `migrate()` in `state.js` – alte Saves werden auf neue Version gehoben
  - Version 0 → 1: fehlende Felder werden mit Defaults ergänzt
  - Zukünftige Versionen: weitere `if (s.version < N)` Blöcke ergänzen

---

## 📋 Glossar

| Begriff | Erklärung |
|---|---|
| **DTI** | Debt-to-Income Ratio – Schuldendienstquote: Summe Kreditraten / Nettoeinkommen. Limit: 40 % |
| **ARV** | After Repair Value – Wert nach Renovierung; Grundlage für Verkaufspreisschätzung |
| **mgmt%** | Verwaltungskosten: 8 % der Kaltmiete (monatlich abgezogen) |
| **maint%** | Instandhaltung: 1 % p.a. des Kaufpreises (= ~0,083 %/Monat) |
| **heat** | Markt-Nachfrageindes (0–100); hoch = viele Käufer/Mieter, schnelle Verkäufe |
| **supply** | Markt-Angebotsindex (0–100); hoch = viele Objekte verfügbar |
| **EK** | Eigenkapital – eigener Kapitalanteil beim Kauf |
| **NK** | Nebenkosten – Makler + Notar + Grunderwerbsteuer + Sonstiges |
| **Buy & Hold** | Strategie: kaufen, vermieten, langfristig halten |
| **Fix & Flip** | Strategie: kaufen, renovieren, schnell verkaufen |

---

## 🧪 Manuelle Testszenarien

| Szenario | Erwartetes Ergebnis |
|---|---|
| Kauf mit zu wenig EK (Kapital < totalCashNeed) | Kaufen-Button deaktiviert, Fehlermeldung sichtbar |
| DTI nach Kauf > 40 % | Kaufen-Button deaktiviert, DTI rot markiert |
| Renovierung starten bei bestehendem Mieter | Warnung erscheint, Mieter wird ausquartiert |
| Renovierung abschließen → Zustand steigt | Zustand-KPI im Portfolio steigt, Log-Eintrag erscheint |
| Gutachten beauftragen → ARV gesetzt | ARV erscheint in Portfolio-Karte und Detail-Ansicht |
| Verkauf bei heat > 70 (heißer Markt) | Schnellere Verkaufsabwicklung (höhere monatliche Wahrscheinlichkeit) |
| Verkauf mit Mindestpreis weit über fairem Wert | Objekt bleibt lange auf dem Markt |
| Cash < -200 über Monat | Bonitäts-Score sinkt um 12 |
| DTI < 35 % und Cash positiv | Bonitäts-Score steigt um 4 pro Monat |
| Reset-Button | Alle Daten gelöscht, Neustart mit Startwerten |
| Speichern → Tab schließen → Wiedereröffnen | Spielstand vollständig wiederhergestellt |
| Zeitraffer auf 60× | Monatswechsel sehr schnell, kein Einfrieren |

---

## ⚠ Bekannte Limitierungen (MVP)

- Nur eine Stadt (Nordstadt) mit 3 Lagen – erweiterbar via `market.cities[]`
- Keine Steuern / AfA-Berechnung
- Keine Zinsbindungsfristen (Zins bleibt über gesamte Laufzeit)
- Keine Nachbeleihung / Auszahlung von Eigenkapital
- Sparkline/Chart nur als Canvas-Skelett (optional erweiterbar)
- Kein Offline-Service-Worker / PWA

---

## 🔮 Mögliche Erweiterungen

- **Zinsbindung**: Festzins für 5/10/15 Jahre, dann Anschlussfinanzierung zum dann gültigen Marktzins
- **Steuern & AfA**: Mieteinnahmen versteuern, lineare Abschreibung (2 % p.a. auf Gebäudeanteil)
- **Nachbeleihung**: Gesunkene Restschuld + ARV → neues Eigenkapital für nächsten Kauf hebeln
- **Stadtkarte**: Interaktive Karte mit Stadtvierteln und visueller Lage-Darstellung
- **Karriereziele**: Meilensteine (erstes Objekt, 10.000 € passiver CF, Schuldenfreiheit)
- **Mehrere Städte**: Verschiedene Märkte mit unterschiedlicher Dynamik
- **Mietspiegel-Sperrfrist**: Realistische 15-Monats-Sperre für Mieterhöhungen
- **Hausverwaltung**: Objekt-übergreifende Verwaltungskosten, eigene Hausverwaltung möglich
- **Marktplatzerweiterung**: Versteigerungen, Zwangsversteigerungen mit Risikoaufschlag

---

## 🧪 Unit-Tests ausführen

Die Tests befinden sich in `src/tests.js` (kein Framework, nur Browser-APIs):

```html
<!-- Temporär in index.html einfügen oder separate test.html erstellen: -->
<script type="module" src="../src/tests.js"></script>
```

Dann Konsole öffnen (F12) → Ergebnisse mit ✅/❌ erscheinen.

Getestete Funktionen:
- `monthlyRate` – Annuitätsberechnung
- `clamp` – Wertebereichsbegrenzung  
- `approveLoan` – DTI-Prüfung (4 Grenzfälle)
- `rollOffers` – Angebotspreisbildung
- `rentalProbability` – Vermietungs-Wahrscheinlichkeits-Grenzen (50 Zufallsdurchläufe)
- `estimatePurchaseCosts` – Nebenkosten & Kassenbedarf
- `rentBand` – Miet-Band-Berechnung

