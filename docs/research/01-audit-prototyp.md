# 01 – Audit des Prototyps „IMMOPATH“ (Vanilla JS)

Stand: 26.11.2026 · Grundlage: vollständige Lektüre aller 22 Dateien (4.787 Zeilen: `index.html`, `root/src/*.js`, `root/src/ui/*.js`, `root/assets/styles.css`, dazu `README.md` und `.idea/`), Ausführung von `root/src/tests.js` unter Node 22, Monte-Carlo-Simulationen der Spielmechanik in Node (Skripte nur im Scratchpad, nicht im Repo) und Playwright-Screenshots (Chromium, 1440×900 und 390×844, deviceScaleFactor 1) unter `docs/research/screenshots-prototyp/`.

Zeilenangaben beziehen sich auf den Commit `959c984`. Am Prototyp wurde nichts geändert.

---

## 0. Kurzfazit

- Technisch ist der Prototyp eine kleine SPA mit ES-Modulen, ohne Bundler und ohne Abhängigkeiten. Er ist ordentlich gegliedert, aber das State-Konzept ist fehlerhaft: Jeder Zugriff klont den gesamten Zustand per JSON, verschachtelte `setState`-Aufrufe überschreiben sich gegenseitig, und jeder Tageszeitschritt baut die komplette Ansicht neu auf.
- Spielmechanisch steckt dahinter ein generischer „Tycoon“ mit deutschen Begriffen (Grunderwerbsteuer, Mietspiegel, Sondertilgung). Das deutsche System selbst ist aber kaum abgebildet: keine Steuern/AfA, kein Mietrecht, keine Zinsbindung, ein Bonitätsscore nach US-Vorbild, Bankentscheidungen mit „Kasse/12 als Einkommen“.
- Das Balancing ist kaputt. Wer kauft und hält, verliert im Schnitt Geld. Ein Fix-&-Flip mit Komplettsanierung plus Gutachten bringt dagegen etwa +46 T€ in rund 7 Monaten. Wer 4 Jahre lang nichts tut, erreicht Bonität ≥ 800 und darf dann ohne Eigenkapital unbegrenzt kaufen (Simulation: 23 Objekte, 7,8 Mio. € Schulden bei 2.000 € Nettoeinkommen).
- Die UX hat eine solide Grundoptik: Dark Theme, KPI-Kacheln, ein transparenter Kaufdialog. Es gibt aber gravierende Bedienfehler: Eingaben gehen während der laufenden Zeit verloren, Slider lassen sich nicht ziehen, der „Details“-Button ist defekt, der Dialog ist nicht zentriert, der Log verschluckt fast alle Ereignisse, und mobil verdeckt der Filter den ganzen ersten Bildschirm.
- Empfehlung: Den Code verwerfen. Einige Ideen und UI-Muster lohnen sich als Konzept (siehe Abschnitt 7).

---

## 1. Architektur & Modulkarte

### 1.1 Technischer Rahmen

- `index.html` liefert ein statisches Gerüst: HUD (`header.hud`), Navigation (4 Hash-Links), `main#app` als Render-Ziel und ein natives `<dialog id="dlg">`. Der Einstieg erfolgt über `<script type="module" src="root/src/main.js">` (`index.html:57`).
- Es gibt kein Build-System, kein `package.json` und keine Abhängigkeiten. Gerendert wird per Template-Strings und `innerHTML`.
- `.idea/` enthält IntelliJ-Projektdateien und ist irrelevant. `README.md` besteht nur aus „# Immo“.

### 1.2 Modulkarte

| Datei | Zeilen | Verantwortung | importiert |
|---|---:|---|---|
| `root/src/main.js` | 53 | Boot: Spielstand laden, Startangebote würfeln, Routen registrieren, HUD-Throttle, globales Re-Render bei jeder State-Änderung | state, router, time, marketplace, ui/* |
| `root/src/state.js` | 249 | Zentraler Store (`getState`/`setState`/`subscribe`), `save`/`load`/`migrate`/`reset` (localStorage), Log-Helfer | – |
| `root/src/time.js` | 200 | Zeitraffer (setTimeout-Tagesticks), Monatsabschluss, Tempo | state, market, marketplace, properties, events, utils |
| `root/src/market.js` | 98 | Markt-Random-Walk, Zonen-Lookup, Marktdruck, effektiver Zins | utils |
| `root/src/marketplace.js` | 259 | Angebotsgenerator (Kategorie, Lage, Gebäude, Preis, Miete, Gebühren, Ablauf), Mietband | utils, market |
| `root/src/financing.js` | 211 | Annuität, EK-Staffel nach Bonität, Kaufnebenkosten, „DTI“-Kreditprüfung, Amortisation | utils, market |
| `root/src/properties.js` | 452 | Objekt-Lebenszyklus: Kauf, Renovierung, Monatsbetrieb, Gutachten, Verkauf, Vermietung, Cashflow | utils, market, financing, tenants, events, **state** (`addLog`) |
| `root/src/tenants.js` | 131 | Bewerber, Vermietungs- und Auszugswahrscheinlichkeit, verdeckter Leerstand, Bewerber-Score | utils |
| `root/src/events.js` | 189 | Globale und objektbezogene Zufallsereignisse | utils |
| `root/src/router.js` | 106 | Hash-Router (`#/market`, `#/portfolio`, `#/log`, `#/property/:id`, `#/settings`) | – (DOM) |
| `root/src/utils.js` | 157 | clamp, rnd, Formatter (de-DE), uuid, Datumshelfer | – |
| `root/src/tests.js` | 234 | Selbstgebaute Assertions für financing, rentBand, rentalProbability, rollOffers | financing, utils, tenants, marketplace |
| `root/src/ui/hud.js` | 153 | Statusleiste, Start/Pause, Tempo, Speichern, Leertaste | state, time, utils |
| `root/src/ui/components.js` | 115 | Badge, KPI, Sparkline (ungenutzt), Fortschrittsbalken, Icon (ungenutzt, Pfad existiert nicht) | – |
| `root/src/ui/marketView.js` | 252 | Marktplatz mit Filter, Sortierung und Angebotskarten | state, marketplace, financing, utils, components, dialogs, router |
| `root/src/ui/dialogs.js` | 262 | Kaufdialog, Info-Dialog (ungenutzt) | state, financing, properties, utils, router |
| `root/src/ui/portfolioView.js` | 175 | Portfolio-Zusammenfassung und Objektkarten | state, properties, utils, components, router |
| `root/src/ui/propertyDetailView.js` | 477 | Objektdetail mit 5 Tabs (Vermietung, Renovierung, Bewertung, Verkauf, Finanzen) und Angebotsdetail | state, properties, marketplace, utils, components, tenants, router |
| `root/src/ui/logView.js` | 63 | Ereignisliste | state, utils |
| `root/src/ui/settingsView.js` | 91 | Tempo, Reset, Debug-Infos | state, time, utils |
| `root/assets/styles.css` | 800 | Dark Theme mit CSS-Variablen, BEM-ähnliche Klassen, 2 Breakpoints | – |

Zur Kopplung: Die Domänenlogik (`properties.js`) importiert den Store (`state.js:245 addLog`) und erzeugt damit Seiteneffekte mitten in der Simulation. `dialogs.js:11` greift schon beim Modul-Import auf das DOM zu. UI-Views rufen Domänenfunktionen direkt in `setState`-Callbacks auf.

### 1.3 State-Modell (`state.js:11-94`)

```
{ version: 3, dateISO: '2026-01-01', running, daysPerSecond: 3,
  cash: 5000, netIncome: 2000, livingCosts: 1200, creditScore: 620,
  market: { heat: 55, supply: 50, baseInterest: 0.045, rentIndex: 1.0,
            cities: [ Nordstadt{A,B,C}, Landkreis Heide{rural-A, rural-B} ] },
  offers: Offer[], portfolio: Property[], applicants: [] (ungenutzt),
  history: [{t, cash, credit}] (max 120, nie angezeigt),
  log: [{id, t, text, severity}] (max 200) }
```

- `Property` (`properties.js:167-192`) enthält Stammdaten, `price` (inflationierter „Zeitwert“), `purchasePrice`, `rentPotentialM2` (beim Angebot eingefroren), `mortgage {principal, annualRate, monthlyPayment, termMonths}`, `occupied`, `rentCurrent`, `reno`, `appraisal`, `selling`, `autoMgmt` und `mgmtPct`. Ungenutzt sind `strategy`, `vacancyHiddenRisk` und `fromOfferId`. Hinzu kommen „private“ Felder mit Unterstrich, die ebenfalls gespeichert werden (`_seekingTenant`, `_tenantWearFactor`, `state._renosCostFactor`).
- Mieter existieren nicht als Entität. Nach dem Einzug bleibt nur `occupied=true` und `rentCurrent` übrig, Bewerberdaten werden verworfen (`properties.js:425-427`).
- Ein MFH mit 2–8 Einheiten hat genau einen `occupied`-Status und eine Miete.

### 1.4 Store-Mechanik

- `getState()` und `setState()` erzeugen bei jedem Aufruf eine Tiefenkopie per `JSON.parse(JSON.stringify())` (`state.js:100-114`). Jede Änderung ruft alle Subscriber auf.
- `main.js:37-43`: Jede Änderung, auch jeder Tages-Tick, rendert die aktive View komplett neu per `innerHTML`, sofern kein Dialog offen ist. Bei Tempo 60 sind das 60 vollständige Neuaufbauten pro Sekunde, jeweils mit mehreren JSON-Klonen.
- **Kritischer Fehler „verschachteltes setState“:** `addLog()` ruft selbst `setState` auf (`state.js:245-247`). Es wird aber innerhalb von `setState`-Callbacks benutzt, etwa beim Kauf (`dialogs.js:222-226` → `properties.js:196`) und im Monatsabschluss (`properties.js:38, 55, 75, 86, 99, 114, 123, 142, 378`). Der äußere Updater schreibt danach seinen eigenen Draft zurück, und der Log-Eintrag geht verloren. Nachgewiesen in Node und im Browser: Nach einem Kauf hat das Log 0 Einträge. Kauf, Mietereinzug, Renovierungsende, abbezahlter Kredit und sogar **Verkauf** erscheinen nie im Log. Übrig bleiben nur „Monatsabschluss“ und Zufallsereignisse, die über `addLogToDraft` laufen.

### 1.5 Router (`router.js`)

- Hash-basiert, mit Regex-Tabelle (`router.js:7-13`). Unbekannte Routen führen zu `market`. `aria-current` wird gepflegt (`router.js:45-49`).
- **Fehler:** Der Button „Details“ auf einer Angebotskarte navigiert zu `#/property/<id>?from=market` (`marketView.js:207`). Das Regex `[^/]+` übernimmt `?from=market` in die ID, die Ansicht meldet „Objekt nicht gefunden“ (Screenshot `*-02-angebot-details-defekt.png`).
- Der aktive Detail-Tab ist ein modulglobales `_activeTab` (`propertyDetailView.js:15`) und gilt deshalb objektübergreifend.

### 1.6 Speicherung

- Persistiert wird in localStorage unter dem Schlüssel `immo_sim_v1`, als kompletter State als JSON mit Versionsnummer 3 und linearer Migration v0→v3 (`state.js:172-211`). Das Migrationskonzept ist sinnvoll.
- Autosave läuft beim Monatsabschluss (`time.js:180`). Weil `save()` innerhalb des Updaters aufgerufen wird, speichert es den Zustand **vor** dem Monatsabschluss. Messung: Gespeichert ist der 31.01.2032, das Spiel steht am 12.02.2032. Außerdem wird `running: true` mitgespeichert. Nach einem Reload zeigt der Button deshalb „Pause“, obwohl kein Timer läuft, und der erste Klick bewirkt nur ein Umschalten des Labels (aus `time.js:60-67` und `hud.js:105-109` abgeleitet).
- Manuelles Speichern erfolgt über den HUD-Button. Der Reset in den Einstellungen ruft `localStorage.clear()` auf und löscht damit **alles** auf dem Origin, nicht nur den Spielstand (`settingsView.js:86`). `state.reset()` existiert, wird aber nicht benutzt.
- Es gibt keinen Export/Import, keine Speicherslots und keinen Seed, daher keine reproduzierbaren Spiele.

---

## 2. Spielschleife & Zeitmodell

| Aspekt | Umsetzung | Fundstelle |
|---|---|---|
| Tick | 1 Spieltag pro `setTimeout(1000/daysPerSecond)`, Tempo 1–60 Tage/s (Default 3) | `time.js:69-73, 78-104, 189-198` |
| Tagesebene | Ohne Inhalt: Pro Tag wird nur das Datum weitergezählt, alles Relevante passiert am Monatsersten. Damit sind 30 von 31 Ticks „leer“, lösen aber ein komplettes Re-Render aus. | `time.js:84-93` |
| Monatsabschluss | 1) Gehalt minus Lebenshaltung (+800 €), 2) Markt entwickeln, 3) abgelaufene Angebote entfernen und 3–8 neue erzeugen (max. 25), 4) jedes Objekt betreiben, 5) Verkaufsversuche, 6) globales Ereignis würfeln, 7) Bonität anpassen, 8) History-Snapshot, 9) Log-Eintrag, 10) Autosave | `time.js:120-183` |
| Jahr | Keine Jahresebene: keine Nebenkostenabrechnung, keine Steuererklärung, keine Gehaltsentwicklung, keine Mieterhöhungsrunde | – |
| Pause | Start/Pause im HUD und per Leertaste, nur wenn `document.body` fokussiert ist (`hud.js:49-57`). Kein Auto-Pause bei Ereignissen oder Entscheidungen; es fehlt ein „Nächster Monat“-Schritt. Bei offenem Dialog läuft die Zeit weiter, nur das Re-Render wird unterdrückt (`main.js:40-41`). | |
| Tempo | Bei Tempo 3 dauert ein Spielmonat etwa 10 s, bei 60 etwa 0,5 s. Der Start mit 5.000 € erzwingt Monate bis Jahre des Wartens. | |
| Ereignisse | Global mit 1 % pro Monat (Kommentar sagt 8 %), objektbezogen mit 3 % pro Objekt und Monat (Kommentar sagt 5 %) | `events.js:153-166` |

---

## 3. Formeln & Mechaniken (mit Fundstelle)

### 3.1 Markt (`market.js`)

- **Nachfrage `heat`:** `heat += U(-2,2) + (50-heat)·0,02`, begrenzt auf [0,100] (`market.js:16-20`).
- **Angebot `supply`:** `supply += U(-1,5;1,5) + (50-supply)·0,01` (`:23-27`).
- **„Leitzins“ `baseInterest`:** `+= (heat-50)/10000 + U(±0,0005)`, begrenzt auf [1 %, 8 %], Start bei 4,5 % (`:30-34`). Gemeint ist offenbar das Bauzinsniveau, nicht der EZB-Leitzins.
- **Mietindex:** `rentIndex += (heat-supply)/10000 + U(±0,002)`, begrenzt auf [0,8; 1,3] (`:37-41`).
- **Marktdruck:** `(heat-supply)/300` (`:80-82`).
- **Effektivzins:** `baseInterest + (700-creditScore)/10000`, begrenzt auf [2 %, 9 %] (`:91-97`). Beim Startscore 620 ergibt das 5,30 %. Der Beleihungsauslauf hat **keinen** Einfluss.
- **Zonenpreise (`pricePerM2`, `rentPerM2`) sind statisch** und entwickeln sich nie (`state.js:30-80`). Die Bruttomietrenditen liegen über alle Lagen nahezu gleich bei 4,0–4,5 % (Kaufpreisfaktor 22–25):

| Zone | €/m² Kauf | €/m² Miete | Bruttorendite |
|---|---:|---:|---:|
| A-Lage | 4.200 | 14,0 | 4,00 % |
| B-Lage | 3.200 | 11,0 | 4,13 % |
| C-Lage | 2.400 | 8,0 | 4,00 % |
| Dorfkern | 1.700 | 6,0 | 4,24 % |
| Außenlage | 1.200 | 4,5 | 4,50 % |

### 3.2 Angebotsgenerierung (`marketplace.js`)

- **Anzahl:** 3–8 pro Monat, im Bestand max. 25, ältere fallen raus (`marketplace.js:229-243`, `time.js:128-130`).
- **Lage:** 40 % ländlich (gleichverteilt), 60 % Stadt mit Gewichtung A 20 %, B 45 %, C 35 % (`:208-227`).
- **Typ:** ETW 65 %, EFH 25 %, MFH 10 % (`:10-14`).
- **Fläche:** ETW in der Stadt 35–120 m², ländlich zu 70 % 40–70 m² und zu 30 % 20–39 m². EFH 80–220 m², MFH 200–600 m² (`:32-37, 152-159`).
- **Gebäude:** Baujahr gleichverteilt 1960–2022. Zustand `U(20,95)·(0,7+0,3·Attraktivität)`. **Energieklasse wird aus dem Zustand abgeleitet** (`floor((100-Zustand)/15)` → A…G) und ist unabhängig vom Baujahr. MFH-Einheiten 2–8, Etage 0–5, Stellplätze 0–2 (`:59-76`).
- **Preis:** `Fläche · Zonenpreis · U(0,95;1,12) · (1+Marktdruck)` (`:86-90`). Im Mittel liegt das rund 5 % über dem Zonenwert, der beim Verkauf maßgeblich ist.
- **Mietpotenzial pro m²:** `round(Zonenmiete · rentIndex · (0,8+Zustand/200))` (`:101-104, 162`). Gerundet wird auf **ganze Euro pro m²**, was einen Fehler von bis zu ±0,50 €/m² ergibt. Danach bleibt der Wert für immer eingefroren.
- **Gebühren:** Makler U(1,5–3 %), Notar 1,5 %, Grunderwerbsteuer **fix 3 %**, Sonstiges 0,5 % (`:111-118`).
- **Laufzeit:** Bei heat ≥ 70 sind es 1–2 Monate, bei ≥ 45 dann 2–4, sonst 4–6 (`:130-134`). Eine gute Idee, im UI aber nicht sichtbar.
- **Mietband:** Mitte `Fläche·rentPotentialM2`, Spanne ±15 % (`:250-257`).
- Der Namenszähler `_offerCounter` ist modulglobal und beginnt nach jedem Reload wieder bei 1000, deshalb entstehen doppelte Namen (`:121`).

### 3.3 Finanzierung (`financing.js`)

- **Annuität:** Standardformel `P·r·(1+r)^n/((1+r)^n-1)` (`financing.js:16-21`). Das ist korrekt. Die Rate wird auf ganze Euro gerundet (`:102`).
- **Mindest-EK nach Bonität** (`:26-35`, Spalten ETW/EFH/MFH):

| Score ≥ | 830 | 800 | 700 | 680 | 620 | 550 | 500 | <500 |
|---|---|---|---|---|---|---|---|---|
| ETW | 0 % | 0 % | 5 % | 10 % | 15 % | 20 % | 40 % | 60 % |
| EFH | 0 % | 0 % | 5 % | 10 % | 15 % | 20 % | 50 % | 100 % |
| MFH | 2 % | 5 % | 5 % | 12 % | 15 % | 25 % | 75 % | 100 % |

  Der Default liegt bei Minimum + 5 % (`:42-47`). Die Marktkarte nutzt stattdessen die veraltete Funktion `equityRange()` mit fixen 10–25 % (`:55-64`, `marketView.js:153`). Deshalb zeigt die Karte einen anderen Kassenbedarf als der Dialog (Beispiel Screenshot: Karte 18.432 €, Dialog 26.275 € für dasselbe Objekt).
- **Kaufnebenkosten:** `closingCosts = Preis·(Makler+Notar+GrESt+Sonstiges)`. Mit „100 % + KNK“ gilt `Kredit = Preis − EK + NK` und Kassenbedarf = nur EK, ohne Zinsaufschlag (`:89-118`).
- **Laufzeit:** Slider für 5–30 Jahre. Der Zins ist über die **gesamte** Laufzeit fest; es gibt weder Zinsbindung, anfängliche Tilgung noch Anschlussfinanzierung (`dialogs.js:73-76`).
- **Kreditprüfung „erweiterter DTI“** (`financing.js:143-180`):
  - `DTI = max(Σ Raten + neue Rate − Σ max(Miete−Rate,0) − max(Neumiete−neueRate,0), 0) / (Nettoeinkommen + Kasse/12)`.
  - Genehmigt wird, wenn `DTI ≤ 40 %` **oder Bonität ≥ 800**. Ab 800 entfällt die Prüfung also komplett.
  - Kasse/12 zählt als Einkommen; Mieten werden zu 100 % angerechnet; Bewirtschaftungskosten fehlen.
- **Amortisation:** Zins = Restschuld·r, Tilgung = Rate − Zins (`:189-195`). Die Restlaufzeit wird per Logarithmus neu berechnet (`properties.js:143-147`).
- **Sondertilgung:** unbegrenzt, Rate bleibt gleich, kein Log-Eintrag, keine Kosten (`propertyDetailView.js:442-456`).
- **Bonität** (`time.js:153-161`): Ist die Kasse unter −200 €, gibt es −12 pro Monat. Andernfalls gibt es +4 pro Monat, wenn `Σ Raten / Nettoeinkommen < 0,35` ist (Mieten bleiben dabei unberücksichtigt), sonst bleibt sie unverändert. Die Skala reicht von 300 bis 850 wie beim US-FICO-Score.

### 3.4 Mieter (`tenants.js`, `properties.js`)

- **Bewerber:** Anzahl `round(1 + Attraktivität·3 + heat/20) + U{-1..2}`, begrenzt auf [0,12]. Bei Überpreis über 110/120/130 % der Marktmitte reduziert sich die Zahl auf ×0,5, ×0,2 bzw. meist 0 (`tenants.js:32-53`). Attribute sind Bonität 0,3–1, Einkommen 1.200–5.500 €, Haushalt 1–4, Haustier 30 % und einzugsbereit 75 % (`:12-21`).
- **Bewerber-Score:** `0,6·Bonität + 0,3·min(Einkommen/(3·Miete),1) + 0,1·einzugsbereit` (`:124-129`). Er dient nur der Sortierung, die Bewerberwahl hat **keine** Spielwirkung.
- **Vermietungswahrscheinlichkeit pro Monat:** `heat/120 + Attraktivität/4 − Preis-Strafe` mit gestaffelter Strafe ab 110 % Marktmitte, begrenzt auf [1 %, 85 %] (`:71-89`). Bei Erfolg zieht automatisch ein Mieter ein, auch ohne Auto-Verwaltung und ohne Bewerberwahl (`properties.js:118-123`).
- **Auszug:** Basis `0,25 % + max(0,(50-heat)/10000)` pro Monat, also etwa 3 % p.a. (`tenants.js:97-100`). Dazu kommt das Ereignis „Mieter kündigt fristlos“ mit 1 % pro Monat. Zusammen ergibt das etwa 14 % Fluktuation p.a.
- **Verdeckter Mietausfall:** Von der Miete wird monatlich `vacBase/12·(1+(50-heat)/200)` abgezogen (`tenants.js:109-115`, `properties.js:68-70`). Dieser Abzug fehlt in den angezeigten Cashflows (`hud.js:118-136`, `properties.js:437-451`).
- **Verwaltung:** pauschal 8 % der Miete, immer (`properties.js:184`). Mit Auto-Verwaltung kommen 5 € pro Monat hinzu (`:298-300`). Die Auto-Verwaltung inseriert zur Marktmitte, nimmt den besten Bewerber und stößt bei Zustand < 40 nach einem Auszug eine leichte Renovierung an (`:41-58, 77-87, 94-116`).
- **Mieterhöhung existiert nicht.** `rentCurrent` bleibt für die gesamte Mietdauer konstant, und `rentPotentialM2` ändert sich auch nach Renovierung oder steigendem Mietindex nie. Das Ereignis „Mieterhöhungspotenzial“ ist reiner Text (`events.js:134-145`).
- **Abnutzung:** Bei Vermietung `U(0,05;0,15) + Mieterfaktor U(0;0,4)` Zustandspunkte pro Monat, bei Leerstand `U(0,01;0,05)` (`properties.js:268-271`). Der Zustand fällt in 10–15 Jahren auf 0 (Simulation: 3,8 nach 6 Jahren) – **ohne jede Folge** für Miete, Wert oder Mieter.

### 3.5 Instandhaltung & Renovierung

- **Instandhaltung:** `1 % p.a. des aktuellen Zeitwerts / 12`, bei Leerstand 40 % davon (`properties.js:264-265`). Hausgeld, Rücklage und nicht umlagefähige Nebenkosten gibt es nicht.
- **Renovierungsstufen** (`properties.js:17-21`):

| Stufe | €/m² | Zustand | Dauer |
|---|---|---|---|
| leicht | 50–90 | +10–30 | 1 Monat |
| mittel | 80–120 | +20–50 | 1–3 Monate |
| umfassend | 120–180 | +35–80 | 3–6 Monate |

  Hinzu kommt der Materialpreisfaktor aus Ereignissen. Kosten fließen als `weeklySpend·4` pro Monat ab. Ab einem Zustandsplus von 30 verbessert sich die Energieklasse um eine Stufe (`:26-37, 207-221`). Ein Renovierungsstart **wirft den Mieter sofort hinaus** (`:218-219`).
- Fortschrittsbalken: Die Formel `remainingCost/(weeklySpend·16)` ist falsch, weil sie 4 Monate unterstellt. Bei leichter Renovierung zeigt der Balken zum Start schon 75 % (`propertyDetailView.js:293-294`, `portfolioView.js:120-122`).

### 3.6 Ereignisse (`events.js`)

- **Global (1 %/Monat):**
  - Zinsschock +0,5–1,5 pp
  - Marktboom heat +5–15
  - Marktkorrektur heat −8–20 (Titel-Tippfehler „Marktkorrrektur“, `:46`)
  - Off-Market-Deal: **ohne Wirkung**, nur ein Log-Eintrag (`:58-68`)
  - Materialpreise +5–20 %
  - Materialpreise −5–20 %: Das Log zeigt „sinken um ca. −12 %“ (doppelte Negation, `:90-95`)
- **Objektbezogen (3 %/Objekt/Monat):**
  - Baumangel 200–2.000 € und −1–4 Zustand
  - Mieter zieht „fristlos“ aus
  - Mieterhöhungspotenzial, nur Text (`:102-146`)

### 3.7 Steuern

Es gibt keine Steuern: keine Einkommensteuer auf Mieteinkünfte, keine AfA, keine Werbungskosten, keine Grundsteuer, keine Spekulationsfrist und keinen gewerblichen Grundstückshandel. Die Grunderwerbsteuer taucht nur als fixer Nebenkostensatz von 3 % auf.

### 3.8 Wertentwicklung, Gutachten, Verkauf

Es existieren **drei unabhängige Wertmodelle**:

1. **`property.price` („Zeitwert“):** wächst monatlich um `clamp((heat−40)/1000 + (rentIndex−1)·0,02, 0, 4 %)/12` (`properties.js:277-283`). Es kann nur steigen oder stagnieren, ein Wertverlust ist ausgeschlossen. Die Instandhaltung, das Portfolio („Ges. Zeitwert“), der Detail-KPI „Kaufpreis“ und der „faire Schätzwert“ im Verkaufstab bauen darauf auf.
2. **Gutachten-ARV:** `Fläche · statischer Zonenpreis · rentIndex · (1 + letztes Renovierungs-Zustandsplus/150)` bei Kosten von 500–1.000 € (`properties.js:310-327`). Der aktuelle Zustand, Baujahr, Energieklasse und Renovierungskosten spielen keine Rolle. Das Plus aus der letzten Renovierung (+35–80 bei „umfassend“) bringt **+23 % bis +53 % Wert**.
3. **Verkaufs-Engine:** Der faire Wert ist `(ARV oder Fläche·Zonenpreis·rentIndex) · (1+(heat−50)/500)`. Die Verkaufswahrscheinlichkeit beträgt `(0,15+heat/200)`, skaliert nach dem Verhältnis Mindestpreis/fairer Wert und begrenzt auf [2 %, 60 %]. Der Erlös ist `max(Mindestpreis, fair·U(0,97;1,03)) − 2,5 % Kosten − Restschuld` (`properties.js:349-384`). Es gibt keine Verhandlung, keine Vorfälligkeitsentschädigung und keine Steuern.

**Simulationsergebnisse** (Node, Monte Carlo, B-Lage-ETW, Ø Kaufpreis etwa 260 T€, 20 % EK):

| Strategie | Ergebnis |
|---|---|
| Kaufen und sofort weiterverkaufen | Ø −36.800 € |
| Fix & Flip, leichte Renovierung + Gutachten | Ø −9.800 € |
| **Fix & Flip, umfassende Renovierung + Gutachten** | **Ø +45.800 € in Ø 7,3 Monaten** (P10 +9.400 €, P90 +90.200 €) |
| Buy & Hold 10 Jahre mit Auto-Verwaltung | Ø Miete 894 €, Rate 1.152 €, Cashflow **−597 € pro Monat**; nach Verkauf **Ø −66.700 €** bei 70.600 € Einsatz |
| Angezeigter „Zeitwert“ nach 10 Jahren vs. tatsächlicher Verkaufswert | Ø 293 T€ vs. Ø 252 T€: **die UI überschätzt um etwa 16 %** |
| 48 Monate nichts tun, dann alles kaufen (Bonität 812) | Lauf 1: **23 Objekte, 7,82 Mio. € Restschuld, 31.798 € Raten pro Monat** bei 2.000 € netto. Lauf 2: 10 Objekte, 1,69 Mio. €; nach 3 weiteren Jahren Kasse −167 T€, Bonität 452, **kein Game Over** |

### 3.9 Score & Ziele

Es gibt keine. Weder Ziel, Sieg-/Niederlagebedingung, Nettovermögen-KPI, Meilensteine noch Tutorial. Eine negative Kasse hat keine Folgen außer einer sinkenden Bonität; es gibt keine Dispozinsen, keine Mahnung und keine Zwangsversteigerung. `history` wird gesammelt, aber nie angezeigt (`drawSparkline` ist ungenutzt, `components.js:52-76`).

---

## 4. Realitätscheck (Deutschland)

| Mechanik | Prototyp-Annahme | Deutsche Realität (kurz) | Schwere |
|---|---|---|---|
| Grunderwerbsteuer | fix 3 % | je Bundesland 3,5 % (BY) bis 6,5 % (u. a. NRW, BB, SL, SH) | hoch |
| Notar/Grundbuch | 1,5 % + 0,5 % Sonstiges | etwa 1,5–2,0 % zusammen; plausibel | gering |
| Maklerprovision Kauf | 1,5–3 % | ETW/EFH seit 12/2020 Halbteilung, Käuferanteil oft 3,57 % inkl. MwSt.; MFH frei verhandelbar | mittel |
| Kaufprozess | sofort, ein Klick | Exposé, Besichtigung, Unterlagen (Teilungserklärung, ETV-Protokolle, Wirtschaftsplan), Finanzierungszusage, Notar, Vormerkung, Kaufpreisfälligkeit nach Wochen | hoch |
| Informationslage | Zustand und Energieklasse exakt bekannt | asymmetrisch: versteckte Mängel, Gutachten oder Besichtigung decken auf | mittel |
| Preisverhandlung | keine (Kauf und Verkauf) | zentraler Hebel, abhängig von Marktlage und Vermarktungsdauer | mittel |
| Bonität | FICO-artig 300–850; +4 pro Monat fürs Nichtstun | SCHUFA-Score (Prozent bzw. neuer Score); die Bank entscheidet über Haushaltsrechnung und Objektbewertung, nicht über den Score allein | hoch |
| Kreditentscheidung | „DTI“ ≤ 40 % mit Kasse/12 als Einkommen, Mieten zu 100 %; ab Score 800 unbegrenzt | Haushaltsrechnung (Einnahmen/Ausgaben, Pauschalen), Mieten nur anteilig (oft 60–80 %), Beleihungswert, Kapitaldienstfähigkeit, Gesamtverschuldung | hoch |
| Beleihung/Zins | Zins hängt nur vom Score ab, nicht vom Beleihungsauslauf; 100 % + NK ohne Aufschlag | Zinsstaffeln nach Beleihungsauslauf (z. B. ≤60/80/90/100/110 %); Vollfinanzierung selten und teurer | hoch |
| 0 % EK bei MFH | ab Score 830 nur 2 % EK | Banken verlangen bei Kapitalanlage meist mindestens die Nebenkosten, bei MFH oft 20–30 % EK | hoch |
| Zinsbindung | Zins fix über 5–30 Jahre Laufzeit | Sollzinsbindung meist 10–15 Jahre, danach Anschlussfinanzierung zum Marktzins (Zinsänderungsrisiko als Kernlektion) | hoch |
| Tilgung | Laufzeit-Slider bestimmt die Rate | Gewählt werden anfängliche Tilgung (1–3 %) und Zinsbindung; die Laufzeit ergibt sich | mittel |
| Zinsniveau | „Leitzins“ 4,5 % + Score-Aufschlag → 5,3 % zum Start | EZB-Leitzins ≠ Bauzins; 10-jährige Bauzinsen lagen 2024/25 grob bei 3–4 % | mittel |
| Sondertilgung | unbegrenzt, kostenlos | vertraglich meist 5–10 % p.a. vereinbart; darüber hinaus Vorfälligkeitsentschädigung | mittel |
| Mieterhöhung | gibt es nicht, Miete für immer eingefroren | § 558 BGB bis ortsübliche Vergleichsmiete, Kappungsgrenze 20 % bzw. 15 % in 3 Jahren; Index- und Staffelmiete | hoch |
| Neuvermietung | freie Miete, nur Nachfrage-Strafe | Mietpreisbremse in angespannten Märkten (max. 10 % über Vergleichsmiete, verlängert bis 2029), Mietspiegel | hoch |
| Modernisierung | Mieter wird sofort „hinausgeworfen“ | Duldungspflicht (§ 555d BGB), Modernisierungsumlage 8 % p.a. (§ 559 BGB) mit Kappung; Ankündigungsfristen | hoch |
| Kündigung | „Mieter kündigt fristlos“ als Zufall; Auszug sofort | Mieter 3 Monate Frist; Vermieter nur mit berechtigtem Interesse (z. B. Eigenbedarf), Fristen 3–9 Monate | mittel |
| Kaution / Mietausfall | keine Kaution; Ausfall pauschal und unabhängig vom Mieter | Kaution max. 3 Nettokaltmieten; Ausfallrisiko hängt von der Mieterauswahl ab (Bonität, Einkommen, Räumungsdauer) | mittel |
| Bewerberwahl | rein kosmetisch | Mieterauswahl ist eine der wichtigsten Vermieterentscheidungen | mittel |
| Fluktuation | etwa 3 % + 12 % (Ereignis) p.a. | etwa 8–10 % p.a.; Größenordnung plausibel, aber falsch modelliert | gering |
| Bewirtschaftung | 8 % Verwaltung + 1 % Wert p.a. Instandhaltung; Leerstand 40 % davon | Hausgeld (ETW, umlagefähig/nicht umlagefähig), Instandhaltungsrücklage, Verwaltung etwa 25–40 €/Einheit/Monat; bei Leerstand trägt der Eigentümer **alle** Betriebskosten | hoch |
| Instandhaltung | proportional zum (inflationierten) Wert, Zustand ohne Folgen | Faustwerte etwa 10–20 €/m² p.a. je nach Alter (II. BV, Peters’sche Formel); verschleppte Instandhaltung führt zu Großschäden, Mietminderung und Wertverlust | mittel |
| Großschäden | Baumangel 200–2.000 € | Dach, Heizung, Fassade, Leitungen: fünfstellig; bei ETW Sonderumlagen | mittel |
| Energie | Klasse A–G aus dem Zustand abgeleitet; Renovierung verbessert sie pauschal | Energieausweis A+ bis H, abhängig von Baujahr und Technik; GEG-Pflichten (Heizung, Nachrüstpflichten nach Eigentümerwechsel), Einfluss auf Preis, Miete und Förderung (KfW) | mittel |
| Steuern | keine | Einkünfte aus V+V zum persönlichen Grenzsteuersatz; AfA 2 % (Baujahr ab 1925), 2,5 % (vor 1925), 3 % (Fertigstellung ab 2023), Grund und Boden nicht abschreibbar; Zinsen als Werbungskosten; Grundsteuer | hoch |
| Verkauf/Steuern | 2,5 % Kosten, steuerfrei | Spekulationsfrist 10 Jahre (§ 23 EStG); gewerblicher Grundstückshandel (Drei-Objekt-Grenze); Vorfälligkeitsentschädigung; Maklerprovision | hoch |
| Wertermittlung | Gutachten 500–1.000 €, Renovierung bis +53 % Wert | ImmoWertV (Vergleichs-, Ertrags-, Sachwert); Renovierung hebt den Wert in der Regel nur um einen Teil ihrer Kosten plus Mietpotenzial | hoch |
| Wertmodell | 3 inkonsistente Werte; Zeitwert kann nie fallen | Preise schwanken mit Zins und Nachfrage (2022–2024 deutliche Korrektur) | hoch |
| Lagerenditen | alle Lagen etwa 4 % brutto | A-Lagen deutlich niedrigere Bruttorenditen, ländliche oder C-Lagen deutlich höhere bei höherem Leerstandsrisiko | hoch |
| Marktdynamik | Zonenpreise statisch; nur heat, supply, Zins, Mietindex wandern zufällig | regionale Zyklen; Zins wirkt auf Preise; Mieten steigen mittelfristig | mittel |
| MFH | ein Mieter für das ganze Haus, Einheiten wirkungslos | mehrere Mietverhältnisse, Teilleerstand, Skaleneffekte bei Verwaltung | hoch |
| Persönliche Finanzen | 2.000 € netto und 1.200 € Lebenshaltung konstant für immer | Gehaltsentwicklung, Inflation, Lebensereignisse, Rücklagen | mittel |
| Liquiditätskrise | negative Kasse ohne Folgen | Dispozins, Kreditkündigung, Zwangsversteigerung, Privatinsolvenz | hoch |
| Prognose vs. Ist | Cashflow-Anzeige ohne verdeckten Mietausfall, „Zeitwert“ ≠ Verkaufswert | Lernspiel braucht nachvollziehbare, ehrliche Kennzahlen | hoch |

---

## 5. UX/UI-Review pro Ansicht

Screenshots: `docs/research/screenshots-prototyp/{desktop,mobile}-NN-*.png`.

Gemessene Probleme (Playwright):

- **Zeit läuft + Formulare.**
  - Wer bei laufender Zeit „1234“ ins Mietfeld tippt, erhält „354“ bzw. „235“; der Fokus springt auf `BODY`.
  - Aus „150000“ im Preisfilter wird „1“.
  - Ursache: Re-Render bei jedem Tick (`main.js:37-43`).
- **Kaufdialog-Slider.**
  - Ein Drag über 60 % der Breite bleibt beim ersten Wert hängen (20 → 15).
  - Nach einer Pfeiltaste liegt der Fokus auf `BODY`.
  - Ursache: Jede Eingabe baut den Dialog neu auf (`dialogs.js:49, 198-211`).
- **JS-Fehler** `Cannot set properties of null (setting 'innerHTML')` nach „Inserat starten“ oder dem Umschalten der Auto-Verwaltung. `panel.closest('#app')` ist nach dem Re-Render `null` (`propertyDetailView.js:197, 231`).
- **Platzbedarf von HUD + Navigation:** 100 px auf dem Desktop, 150 px mobil (18 % der Höhe). Nur das HUD ist sticky; die Navigation scrollt weg.

### 5.1 HUD (`*-18-hud-nahaufnahme.png`)

- **Informationsarchitektur:**
  - Das tagesgenaue Datum flackert ständig, während der Monat die eigentliche Einheit ist.
  - „CF“ ist unerklärt. Er schließt Gehalt und verdeckten Mietausfall aus und passt daher nicht zur tatsächlichen Kassenveränderung.
  - Es fehlen Nettovermögen, Gesamtschulden, Zinsniveau und Marktlage; heat und Zins stehen nur in den Debug-Infos.
- **Zahlen:** Die Bonität erscheint als nackte Zahl ohne Skala oder Erklärung. „Tempo 3ד ist missverständlich, gemeint sind Tage pro Sekunde.
- **Feedback:**
  - Ein Monatsabschluss ist nicht wahrnehmbar: kein Delta, kein Toast.
  - Der Autosave ist unsichtbar.
  - Nach einem Reload zeigt der Button einen falschen Zustand („Pause“ trotz Stillstand).
- **Mobil:** Das HUD bricht auf 3 Zeilen um.
- **Barrierefreiheit:**
  - Weiß auf dem Primärbutton hat nur **2,82:1** Kontrast (AA verlangt 4,5:1).
  - `aria-label` auf `<span>` ohne Rolle wird ignoriert bzw. ist unzulässig.
  - Der Tempo-Slider hat ein statisches `aria-valuenow="3"` (`index.html:29`), das den echten Wert für Screenreader überschreibt.
  - Die Leertaste funktioniert nur bei Fokus auf `body`.
- **Konsistenz:** `className`-Zuweisungen entfernen die Klasse `hud__item` bei Kasse, CF und Bonität, nicht aber beim Sparbetrag (`hud.js:79, 87, 102`). Die CF-Formel ist in `hud.js:118-136` dupliziert.

### 5.2 Marktplatz (`*-01-*`, `*-15-*`)

- **Informationsarchitektur:**
  - 10 gleichgewichtete KPI-Kacheln pro Karte. Unwichtiges wie „Einheiten 1“ oder „Stellplätze 0“ steht neben dem Wichtigen.
  - Die investitionsrelevanten Kennzahlen fehlen: Bruttorendite, Kaufpreisfaktor, Cashflow-Prognose, €/m² im Vergleich zum Lageschnitt, Ablaufdatum des Angebots, Zeit seit Einstellung.
  - Es gibt keine Merkliste, keinen Vergleich und keine Kartenansicht.
- **Lesbarkeit:** Die Labels sind 10 px in Großbuchstaben. Beträge sind ordentlich deutsch formatiert, aber nicht in Tabellenziffern (`tabular-nums`) gesetzt.
- **Erste Minute:**
  - Mit 5.000 € Startkapital sind **alle** Angebote rot markiert („Nicht genug Kapital“): 4 von 4 auf dem Desktop, 7 von 7 mobil.
  - Es gibt keinen Hinweis, was zu tun ist; das Spiel besteht anfangs aus Warten.
- **Fehler:**
  - „Details“ führt zu „Objekt nicht gefunden“.
  - Der Kassenbedarf auf der Karte weicht vom Dialog ab.
  - Ländliche Lagen fehlen im Lagefilter (`marketView.js:73-80`). Ihr Badge „rural-A-Lage“ ist ungestylt, die CSS-Klasse existiert nicht.
- **Mobil:**
  - Der Filterblock füllt den gesamten ersten Bildschirm und ist rechtsbündig mit großer Leerfläche links. Ursache: `align-items:flex-end` bei `flex-direction:column`, `styles.css:327-332, 705`.
  - Die erste Angebotskarte beginnt unterhalb des Falzes.
  - Die Navigation läuft horizontal über, „Einstellungen“ ist abgeschnitten.
- **Barrierefreiheit:** Der Sortierbutton „▲“ hat keinen Zustand (`aria-label` statisch). Jedes Filter-Input löst einen kompletten Neuaufbau aus.

### 5.3 Portfolio (`*-04-*`, `*-08-*`, `*-17-*`)

- **Informationsarchitektur:**
  - Die Zusammenfassung zeigt Objekte, Gesamt-CF, Restschuld, Zeitwert und ARV.
  - Es fehlen Nettovermögen, Beleihungsauslauf, EK-Rendite und Mietrendite.
  - „Zeitwert“ ist irreführend, weil er etwa 16 % über dem realisierbaren Wert liegt.
- **Skalierung:** Jedes Objekt erscheint als Karte mit 10 Kacheln plus Zustandsbalken. Ab 10–20 Objekten wird das eine Kartenwand ohne Tabelle, Sortierung, Filter oder Gruppierung. Für ein Spiel über „Bestand aufbauen und skalieren“ ist das das zentrale Defizit.
- **Fehler:**
  - Das Auto-Badge zeigt „🤖 Auto-Lage“, weil `createBadge` „-Lage“ anhängt (`portfolioView.js:163`).
  - „Zeitwert“ wird auch ohne Änderung grün eingefärbt, da die Bedingung `>= 0` lautet (`:97`).
  - Der Renovierungsfortschritt ist falsch.
  - „Leer“ unterscheidet nicht zwischen „Mietersuche läuft“ und „inaktiv“.
- **Feedback:** Statuswechsel wie Einzug oder Auszug erscheinen nur still in der Karte; der Log verliert sie.

### 5.4 Objektdetail (`*-09…14-*`)

- **Kopfbereich:** Der KPI „Kaufpreis“ zeigt in Wahrheit den inflationierten Zeitwert (`propertyDetailView.js:70`).
- **Tabs:**
  - `role="tab"` ist gesetzt, aber es gibt keine Pfeiltasten-Navigation (gemessen: der Fokus bleibt stehen).
  - `aria-controls` verweist auf nicht existierende Panels.
  - Mobil laufen die Tabs über, „Verkauf“ ist abgeschnitten und „Finanzen“ unsichtbar.
  - Der Tab-Zustand gilt global über alle Objekte hinweg.
- **Vermietung:**
  - „Mietersuche läuft…“ und „Inserat starten“ erscheinen gleichzeitig. Ein erneuter Klick würfelt die Bewerber kostenlos neu.
  - Die Bewerberwahl bleibt ohne Folgen.
  - Für Bestandsmieter gibt es keine Möglichkeit zur Mieterhöhung, obwohl das Mietfeld editierbar angezeigt wird.
  - „Mietspiegel“ wird als Begriff für ein Zufallsband missbraucht.
  - Die Live-Überpreiswarnung ist eine gute Idee.
- **Renovierung:**
  - Kosten, Dauer und Zustandsplus stehen in einer Tabelle. Es fehlen eine Wirtschaftlichkeitsaussage (Miet- und Wertsteigerung) und eine Bestätigung.
  - Bei vermieteten Objekten wird der Mieter ohne Rückfrage gekündigt.
  - „Scope“ ist ein Anglizismus; „1–1 Monate“ ist unschön.
- **Bewertung und Finanzen:** Hier wird `alert()` verwendet (`:367, :446`). Die Prüfung „Kasse < 500“ greift, obwohl das Gutachten bis 1.000 € kosten kann. Die Restlaufzeit steht in Monaten („360 Monate“). Eine Sondertilgung gibt kein Feedback.
- **Verkauf:**
  - Der „faire Schätzwert“ wird anders berechnet als von der Verkaufs-Engine.
  - Es fehlt eine Vorschau auf den Nettoerlös (Restschuld, Kosten, Steuern).
  - Es gibt keine Bestätigung, und ein Verkauf erscheint nie im Log.
- **Angebotsdetail:** Es zeigt nur 6 Kacheln. Der Button „Zurück zum Marktplatz (Kaufen)“ kauft nicht.

### 5.5 Dialoge (`*-03-*`, `*-07-*`)

- **Layout:**
  - Der Dialog ist **nicht zentriert**, sondern klebt oben links. Ursache: Der globale Reset `* { margin:0 }` (`styles.css:39`) hebt das native `margin:auto` von `<dialog>` auf.
  - Inhalt 1.111 px bei 864 px Höhe auf dem Desktop, 1.147 px bei 810 px mobil. Der Kauf-Button liegt deshalb außerhalb des sichtbaren Bereichs.
- **Informationsarchitektur:**
  - Über 20 Zahlen stehen in einer flachen Liste; Label und Wert sind nicht bündig ausgerichtet.
  - Die Kernaussage „Kann ich mir das leisten, und was bringt es pro Monat?“ fehlt; Cashflow und Rendite des Objekts werden nicht gezeigt.
  - Jargon wie „DTI (erweitert)“ oder „Effektives Einkommen (E + Cash/12)“ bleibt unerklärt.
  - Fehlermeldungen stehen erst ganz unten.
- **Positiv:** Die Nebenkosten-Aufschlüsselung, der KNK-Schalter mit Erklärung und die Live-Neuberechnung von Rate und Genehmigung sind das stärkste UI-Element des Prototyps.
- **Feedback:** Nach dem Kauf geht es ohne Erfolgsmeldung direkt ins Portfolio, und der Log-Eintrag fehlt.
- **Barrierefreiheit:**
  - Der Fokus geht bei jeder Eingabe verloren.
  - Der Escape-Listener ist `{once:true}`, ist aber durch das native `<dialog>` ohnehin redundant.
  - `aria-modal` auf `<dialog>` ist redundant.
  - `openInfoDialog` existiert, wird aber nicht genutzt; stattdessen kommen `alert`/`confirm` zum Einsatz.

### 5.6 Einstellungen (`*-06-*`)

- Der Bereich enthält nur Tempo (doppelt zum HUD, mit demselben Re-Render-Problem), Reset und Debug.
- Der Reset löscht den kompletten localStorage des Origins.
- Es fehlen Export/Import, Speicherslots, Szenario- oder Schwierigkeitswahl, Zahlenformat- und Bewegungsoptionen.
- Die Debug-Daten (Markt-heat, Zins, Mietindex) wären eigentlich wichtige Spielinformationen.

### 5.7 Log (`*-05-*`, `*-16-*`)

- **Informationsarchitektur:** Es gibt nur Freitext. Jeder Monat erzeugt einen Eintrag „Monatsabschluss …“, der dasselbe Datum zweimal zeigt. Bei maximal 200 Einträgen reicht der Log nur etwa 16 Jahre zurück. Filter, Gruppierung nach Monat, strukturierte Beträge und Verlinkung zum Objekt fehlen.
- **Fehler:** Wichtige Ereignisse wie Kauf, Verkauf, Einzug, Renovierungsende und Kredittilgung fehlen wegen des verschachtelten `setState` (siehe 1.4). Gemessen: Nach 9 Monaten mit 2 Objekten stehen ausschließlich „Monatsabschluss“-Zeilen im Log.
- **Barrierefreiheit:** `aria-live` sitzt auf der Liste **und** auf `main#app` (`index.html:46`). Weil `main` bei jedem Tick neu gerendert wird, entsteht eine Flut von Screenreader-Ansagen.

### 5.8 Querschnitt

- **Icons:** Emojis dienen als Icons und Semantik (Navigation, Status, Log) und werden von Screenreadern vorgelesen. Die Darstellung hängt von der Plattform ab.
- **Typografie:** Basis 13–14 px, Labels 10–11 px; zu klein für zahlenlastige Ansichten.
- **Kontraste:** Gedämpfter Text auf Karten hat 4,04:1, Rot auf Karten 4,13:1. Beides fällt für kleinen Text durch AA.
- **Vorzeichen und Einheiten:** uneinheitlich („CF: +0 €“, „/Mo.“ vs. „/Monat“). Monats- und Jahreswerte sind nicht klar getrennt.
- **Bestätigung und Rückgängig:** Es gibt kein Undo. Destruktive Aktionen (Renovierung mit Auszug, Verkauf, Sondertilgung) laufen ohne Bestätigung; nur der Reset fragt per `confirm` nach.
- **Positiv:** konsistentes Dark Theme mit Design-Tokens, deutsche Zahlenformate über `Intl`, sichtbarer Fokusrahmen (`:focus-visible`), semantische `<table>` mit `scope`, natives `<dialog>`.

---

## 6. Code-Qualität

### 6.1 Bugs (verifiziert)

| # | Bug | Fundstelle | Nachweis |
|---|---|---|---|
| 1 | Verschachteltes `setState` über `addLog` verwirft Log-Einträge (Kauf, Verkauf, Einzug usw.) | `state.js:245`, `properties.js:38 ff.`, `dialogs.js:222` | Node und Browser: 0 Einträge nach Kauf |
| 2 | Autosave speichert den Zustand vor dem Monatsabschluss, mit `running:true` | `time.js:180` | Speicherstand 31.01. bei Spielstand 12.02. |
| 3 | Re-Render bei jedem Tick zerstört Eingaben und Fokus | `main.js:37-43` | Playwright |
| 4 | Kaufdialog baut sich bei jeder Slider-Eingabe neu auf → Drag und Tastatur kaputt | `dialogs.js:49, 198-211` | Playwright |
| 5 | „Details“ eines Angebots: Query-String landet in der Routen-ID | `marketView.js:207`, `router.js:11` | Playwright |
| 6 | `panel.closest('#app')` ist `null` → TypeError | `propertyDetailView.js:197, 231` | pageerror |
| 7 | Dialog nicht zentriert durch globalen Margin-Reset | `styles.css:39` | Screenshot |
| 8 | Renovierungsfortschritt falsch (`weeklySpend·16`) | `propertyDetailView.js:293`, `portfolioView.js:121` | Rechnung |
| 9 | Auto-Badge „🤖 Auto-Lage“ | `portfolioView.js:163` | Code |
| 10 | Kassenbedarf Karte ≠ Dialog (veraltete `equityRange`) | `marketView.js:153` | Screenshot |
| 11 | Drei inkonsistente Wertmodelle (Zeitwert, Gutachten-ARV, Verkaufswert) | `properties.js:277-283, 316-318, 353-355`; `propertyDetailView.js:377-378` | Simulation (−16 %) |
| 12 | Ereigniswahrscheinlichkeiten widersprechen den Kommentaren (1 % statt 8 %, 3 % statt 5 %) | `events.js:150-166` | Code |
| 13 | Off-Market-Deal ohne Wirkung; „sinken um −12 %“; Tippfehler | `events.js:46, 58-68, 90-95` | Code |
| 14 | `rentPotentialM2` auf ganze €/m² gerundet und danach eingefroren | `marketplace.js:103, 162` | Code |
| 15 | Bonität ≥ 800 schaltet jede Kreditprüfung ab (unbegrenzter Hebel) | `financing.js:145, 172` | Simulation |
| 16 | Angebotszähler beginnt nach Reload neu → doppelte Namen | `marketplace.js:121` | Code |
| 17 | Reset löscht den gesamten localStorage | `settingsView.js:86` | Code |
| 18 | Statisches `aria-valuenow` überschreibt den Slider-Wert | `index.html:29`, `settingsView.js:37` | Code |
| 19 | Gutachten-Kostenprüfung (< 500 €) passt nicht zu den Kosten (bis 1.000 €) | `propertyDetailView.js:366` vs. `properties.js:311` | Code |
| 20 | `createIcon` verweist auf nicht existierendes `../public/assets/icons.svg` | `components.js:110` | Dateisystem |

### 6.2 Tote Pfade

- Ungenutzte Funktionen: `reset`, `drawSparkline`, `createKPI`, `createIcon`, `openInfoDialog`, `currentRoute`, `yearMonth`, `sameMonth`, `formatDateShort`, `allZones`.
- Ungenutzte Felder: `state.applicants`, `history` (wird nur geschrieben), `strategy`, `vacancyHiddenRisk`, `fromOfferId`, `_lastDate` (`time.js:15, 41`).
- Ungenutzte Bewerberattribute: `householdSize` und `pets` werden nur angezeigt.
- `equityRange` ist als veraltet markiert, wird aber noch benutzt.
- In `components.js:96` ist `clamp` doppelt implementiert.

### 6.3 Tests

- **Lauf:** `node root/src/tests.js` funktioniert unter Node 22 dank automatischer ESM-Erkennung. Es gibt keine HTML-Testseite, keinen Runner, kein `package.json` und kein CI.
- **Ergebnis in 4 Läufen:** 81–82 Assertions, davon **34–42 fehlgeschlagen**. Die Zahlen schwanken, weil die Tests auf Zufall beruhen.
  - Deterministisch scheitern 3 DTI-Tests: Das Mock-State hat kein `cash`, daher wird `effectiveIncome` zu `NaN` und `dti` zu 9,99. Die Tests passen nicht mehr zur „erweiterten“ Formel (`tests.js:88-107`).
  - Zufällig scheitern 30–40 der 50 Läufe „p ∈ [0,05; 0,85]“, weil der Code auf 0,01 begrenzt (`tests.js:173-179` vs. `tenants.js:88`).
  - Der Kommentar „closingCosts ≈ 14,76 %“ ist falsch, real sind es 7,38 % (`tests.js:199`).
- **Abdeckung:** Nur `monthlyRate`, `clamp`, `approveLoan`, `rollOffers`, `rentalProbability`, `estimatePurchaseCosts` und `rentBand` sind getestet. Für Zeit, Objekte, Ereignisse, Store, Migration und UI gibt es keine Tests.
- Ohne Seed oder injizierbares RNG (`Math.random` direkt in `utils.js:23-24`, `tenants.js`, `marketplace.js`) sind keine deterministischen Tests oder Replays möglich.

### 6.4 Kopplung & Struktur

- Die Domänenlogik schreibt über `addLog` direkt in den Store und kennt damit die UI-Infrastruktur.
- Funktionen mutieren Drafts und geben gleichzeitig Werte zurück (`purchaseOffer`), und Seiteneffekte sind gemischt.
- Views rufen Domänenlogik ohne Anwendungsschicht auf. Validierungen wie Kasse-Checks sind über die UI verteilt (`dialogs.js:220`, `propertyDetailView.js:366, 445`).
- Die Cashflow-Formel existiert doppelt und weicht von der tatsächlichen Abrechnung ab.
- Modulglobale UI-Zustände (`_filters`, `_activeTab`) gehen bei einem Reload verloren und gelten objektübergreifend.
- Render per `innerHTML` mit unescapeten Template-Daten. Bei intern generierten Daten ist das unkritisch, wird aber bei Spielernamen oder Importen zum XSS-Risiko.

### 6.5 Geld & Rundung

- Geld wird als JS-Float in Euro geführt. Es gibt gemischte Rundungen: Rate auf ganze Euro, Zins auf Cent, Miete und Instandhaltung je Posten auf Euro.
- Die Restschuld driftet: Ein Messwert war `219626.09000000003`.
- Der Zustand ist ein Float (`3.8174193521196162`).
- Weil die Rate auf Euro gerundet ist, stimmt die Schlussrate nicht.
- Es gibt keine zentrale Geldarithmetik und keine Invariante wie „Summe der Buchungen = Kassenänderung“. Eine Buchungshistorie oder ein Kontoauszug fehlt ganz.

### 6.6 Speicherformat

- Der komplette Zustand liegt als ein JSON-Blob in localStorage (inklusive Angebote, 200 Logtexte, 120 History-Punkte und interne `_`-Felder).
- Positiv: Versionierung und Migrationskette.
- Negativ:
  - kein Schema und keine Validierung beim Laden
  - kein Export
  - Seiteneffekt-State (`running`) wird persistiert
  - Log-Texte mit eingebetteten Zahlen und Emojis, statt strukturierter Ereignisse
- Größenprobleme sind nicht akut, aber das Format skaliert nicht für längere Spiele mit vielen Objekten oder Einheiten.

### 6.7 Performance

- Pro Tick laufen mehrere JSON-Tiefenkopien des gesamten Zustands (in `setState` und in jedem `getState` der Views und des HUD) sowie ein vollständiges `innerHTML`-Re-Render.
- Bei Tempo 60 sind das 60 Neuaufbauten pro Sekunde. Bei kleinem Zustand funktioniert das noch, skaliert aber nicht.

---

## 7. Behalten (als Idee) vs. Verwerfen

### Behalten – als Konzept, nicht als Code

| Idee | Begründung |
|---|---|
| Kaufdialog mit transparenter NK-Aufschlüsselung, EK-Regler, KNK-Option und Live-Rate/Genehmigung | stärkstes Lernelement; mit echten Regeln (Beleihungsauslauf, Zinsbindung, Tilgung, Haushaltsrechnung) neu aufbauen |
| Mietband mit gestufter Nachfrage und Live-Warnung bei Überpreis | lehrt Mietpreisfindung; mit Vergleichsmiete und Mietpreisbremse verbinden |
| Bewerberliste mit Attributen (Bonität, Einkommen, Haushalt, Haustier, Einzugstermin) | gutes Entscheidungsmuster; Auswahl muss Folgen haben (Ausfall, Abnutzung, Mietdauer) |
| Renovierungsstufen mit Kosten, Dauer und Zustandswirkung | guter Value-Add-Hebel; Wirkung auf Miete, Wert, Energie, Mietrecht (Modernisierungsumlage) realistisch koppeln |
| Angebots-Ablauf abhängig von der Marktlage | erzeugt Zeitdruck und Marktgefühl; im UI sichtbar machen |
| Lagen A/B/C plus ländliche Region | gute Grundstruktur; mit unterschiedlichen Rendite- und Risikoprofilen und eigener Preisentwicklung ausstatten |
| Marktvariablen (Nachfrage, Angebot, Zins, Mietindex) mit Mean-Reversion | taugt als Basis für ein Marktmodell, muss aber sichtbar sein und auf Preise wirken |
| Monatsabschluss als zentraler Takt plus Ereignislog | richtige Granularität; als strukturierte Monatsabrechnung bzw. Kontoauszug ausbauen |
| Zufallsereignisse (Zinsschock, Baumangel, Auszug, Materialpreise) | gut für Spannung; mit realistischen Größenordnungen und Entscheidungsoptionen ausstatten |
| Auto-Verwaltung bzw. Delegation an eine Hausverwaltung | Kernmechanik fürs Skalieren (Zeit gegen Geld) |
| Sondertilgung, Gutachten, Verkauf mit Mindestpreis und Vermarktungsdauer | sinnvolle Aktionen; regelkonform und mit Vorschau umsetzen |
| Startphase „Sparen aus Gehalt“ | realistischer Einstieg, braucht aber einen spielbaren Startpunkt (Szenario oder Startkapital, Tutorial) |
| Versionierter Speicherstand mit Migration | richtiges Prinzip |
| Dark Theme mit Design-Tokens, KPI-Kacheln, Badges für Lage und Typ | visuelle Grundsprache brauchbar; Kontrast und Hierarchie überarbeiten |

### Verwerfen

| Element | Begründung |
|---|---|
| Gesamter Code (Store mit JSON-Klon, `innerHTML`-Re-Render, verschachteltes `setState`, Tagesticks) | Architekturfehler mit vielen Folgebugs; ein Umbau lohnt nicht |
| FICO-Score 300–850, +4 pro Monat, ab 800 unbegrenzter Kredit | unrealistisch und spielbrechend |
| „DTI“ mit Kasse/12 und 100 % Mietanrechnung | lehrt falsche Bankenlogik |
| Laufzeit-Slider mit Zins über die gesamte Laufzeit | ersetzen durch Zinsbindung, anfängliche Tilgung und Anschlussfinanzierung |
| Drei getrennte Wertmodelle; Zeitwert, der nie fällt; Gutachten-Bonus aus Renovierung | Kern des Exploits, irreführende Anzeige |
| Eingefrorene Mieten ohne Mieterhöhungsmechanik | widerspricht dem Kern der Vermietung |
| Pauschale 8 % Verwaltung plus 5 € Auto; 1 % Wert als Instandhaltung | durch Hausgeld, Verwaltung pro Einheit und Instandhaltung pro m² ersetzen |
| MFH als ein Mietverhältnis | blockiert Skalierung |
| Energieklasse aus dem Zustand | fachlich falsch |
| Emojis als Icons und Semantik; `alert`/`confirm` | Barrierefreiheit und Konsistenz |
| Inhaltsleere Tagesticks | Rauschen ohne Spielwert |

---

## 8. Lehren für den Neuaufbau

1. **Eine Wahrheit für den Wert:** Pro Objekt gibt es genau ein Wertmodell (Markt × Lage × Objektmerkmale, angelehnt an das Vergleichs- oder Ertragswertverfahren). Anzeige, Beleihung und Verkauf greifen auf dieselbe Funktion zurück.
2. **Simulation als reine, deterministische Funktion** `next(state, actions, rng)` mit Seed. Ereignisse und Log sind Rückgabewerte, keine Seiteneffekte. Das ermöglicht Unit-Tests, Replays und Balancing-Läufe.
3. **Balancing per Monte-Carlo im CI:** Strategien wie Buy & Hold, Value-Add, Flip und hoher Hebel müssen plausible, unterschiedliche Rendite-/Risikoprofile liefern. Exploits werden automatisiert gesucht, etwa Flip mit +46 T€ in 7 Monaten oder unbegrenzter Kredit.
4. **Geld in ganzzahligen Cent** mit zentralen Rundungsregeln. Jede Kassenbewegung ist eine Buchung (Kontoauszug), und die Invariante Σ Buchungen = Δ Kasse wird geprüft.
5. **Zeitmodell monatlich und rundenbasiert:** „Nächster Monat“ als Standard, optional Auto-Play mit automatischer Pause bei Entscheidungen oder Ereignissen. Kein Re-Render während Eingaben; Dialoge pausieren die Zeit.
6. **Deutsches Finanzierungsmodell:** Beleihungswert und -auslauf mit Zinsstaffel, Sollzinsbindung plus Anschlussfinanzierung, anfängliche Tilgung, Sondertilgungsrecht, Haushaltsrechnung mit anteiliger Mietanrechnung. Ablehnungen werden begründet („Warum sagt die Bank nein?“).
7. **Kaufnebenkosten nach Bundesland** und ein Kaufprozess mit Dauer und Schritten: Exposé, Besichtigung oder Gutachten mit Informationsasymmetrie, Verhandlung, Finanzierungszusage, Notar, Übergang von Nutzen und Lasten.
8. **Mietrecht als Kernmechanik:** Vergleichsmiete und Mietspiegel, Kappungsgrenze, Mietpreisbremse je Region, Index- und Staffelmiete, Modernisierungsumlage, Kündigungsfristen, Kaution. Die Mieterauswahl beeinflusst das Ausfallrisiko.
9. **Steuern vereinfacht, aber korrekt:** AfA nach Baujahr (Gebäudeanteil), Zinsen und Kosten als Werbungskosten, persönlicher Steuersatz, 10-Jahres-Frist nach § 23 EStG, Hinweis auf den gewerblichen Grundstückshandel.
10. **Laufende Kosten realistisch:** Hausgeld (umlagefähig und nicht umlagefähig), Instandhaltungsrücklage und Sonderumlage, Verwaltung pro Einheit, volle Kosten bei Leerstand, Großschäden. Verschleppte Instandhaltung hat Folgen.
11. **Mehrfamilienhaus = Einheiten mit eigenen Mietverhältnissen.** Die Portfolio-UI muss 50+ Einheiten tragen (Tabelle, Filter, Sortierung, Gruppierung, Massenaktionen).
12. **Konsequenzen und Ziele:** Ein Liquiditätsengpass führt zu Dispo, Mahnung und im Extremfall zur Zwangsversteigerung bzw. zum Game Over. Ziele und Meilensteine messen sich an Nettovermögen, Cashflow, EK-Rendite und Beleihungsauslauf. Ein Szenario- oder Tutorialstart ist in der ersten Minute spielbar.
13. **Ehrliche, erklärte Kennzahlen:** Jede Zahl hat eine Formel per Klick oder Tooltip. Prognose und Ist sind getrennt; Monats- und Jahreswerte sind klar gekennzeichnet; es gibt einen Vergleich mit dem Lageschnitt.
14. **UI-Architektur mit komponentenbasiertem Rendering** (Diffing bzw. Signals): Fokus, Slider und Eingaben bleiben stabil. Echte ARIA-Patterns (Tabs mit Pfeiltasten, Dialog mit Fokusfalle), Toasts statt `alert`, keine `aria-live`-Fluten, Kontrast mindestens AA, SVG-Icons statt Emojis, Tabellenziffern.
15. **Mobile-first entwerfen:** kompaktes HUD (eine Zeile plus Detail-Sheet), Bottom-Navigation, Filter als Sheet und Karten als kompakte Listen. Prüfung per Playwright-Screenshot-Regression und automatischen A11y-Checks (axe).
