# 11 – Umsetzungs-Sprints (ein Sprint = ein Chat = ein 5-Stunden-Fenster)

**Stand:** 27.11.2026 · setzt `06-roadmap.md` (Phasen/Pakete) in **startbare Einzelschritte** um. Jeder Sprint endet mit einer **Live-Demo auf GitHub Pages**, die du in ca. 10 Minuten anhand einer **Checkliste** testen kannst. Danach startest du einen **neuen Chat** mit dem Start-Prompt des nächsten Sprints.

---

## 1. Spielregeln für jeden Sprint

| Regel | Inhalt |
|---|---|
| Größe | passt in ein 5-h-Limit-Fenster (ca. 2–3 Std. reine Arbeit + Puffer). Lieber Umfang streichen als überziehen. |
| Einstieg | Neuer Chat, **nur** Start-Prompt (§ 5) einfügen. Der Chat liest `docs/STATUS.md`, `CLAUDE.md`, den Sprint-Abschnitt hier und nur die darin genannten Plan-Abschnitte (abschnittsweise). |
| Modelle | Sonnet für Umsetzung; Opus nur bei Architekturfragen; Haiku für Mechanisches. Höchstens 2 Subagents parallel. |
| 80-%-Regel | Bei ca. 80 % des Limits: Arbeit stoppen, Stand committen, **Notfall-Bericht** schreiben (was fertig, was offen), Demo nur deployen, wenn der Build grün ist. Restumfang wandert in den nächsten Sprint (`docs/STATUS.md`). |
| Ende-Ritual | (1) Tests grün (`pnpm verify`), (2) Deploy auf GitHub Pages, (3) `docs/berichte/sprint-ZNN.md` (max. 1 Seite: gebaut, bewusst weggelassen, bekannte Fehler, Testhinweise), (4) `docs/STATUS.md` aktualisieren, (5) commit + push, (6) deine Abnahme-Checkliste in der Antwort wiederholen. |
| Abnahme | Du testest die Live-URL mit der Checkliste. Befunde als Liste in den nächsten Chat; was blockiert, wird zuerst gefixt (Sprint-Abschnitt „Fix-Runde“). |
| Fachwerte | Nur aus Vault/Plan/Recherche, Status-Flags BELEGT · ABGELEITET · GESCHÄTZT · DESIGN, nichts erfinden (`CLAUDE.md`). Keine Rechts-/Steuerberatung. |
| Kein Gendern, du-Anrede | E8, O7. |

## 2. Hosting der Demo: GitHub Pages (Entscheidung E9)

- **E9 (neu, 27.11.2026):** Live-Demo auf **GitHub Pages**; Cloudflare (O11) bleibt für das Release P8. Ziel-URL: `https://henrikbch1.github.io/Immo/` (Pfad **mit großem I**, Vite `base: '/Immo/'`).
- **Routing:** Hash-Routing (`/#/…`) oder `404.html`-Kopie von `index.html`, damit Reload auf Unterseiten funktioniert. Service Worker mit Scope `/Immo/`.
- **Workflow:** `.github/workflows/pages.yml` — bei Push auf `main` (und manuell per `workflow_dispatch`): `pnpm i --frozen-lockfile` → `pnpm verify` → Build → `actions/upload-pages-artifact` → `actions/deploy-pages`. Jeder Sprint-Stand ist dadurch auch als Version erkennbar: Fußzeile zeigt **Sprint-Nr., Commit-Hash, Build-Zeit**.
- **Branches:** Pages deployt standardmäßig nur von `main`. Zwei Wege (Q13): **A (empfohlen)** Sprint-Branch → am Sprint-Ende **PR nach `main` und Merge** (du klickst oder bittest den Chat darum); **B** Branch in *Settings → Environments → github-pages → Deployment branches* erlauben und direkt von dort deployen.
- **Voraussetzungen von dir (einmalig, Q13/Q14):** Pages aktivieren (*Settings → Pages → Source: GitHub Actions*). **Achtung:** Bei einem privaten Repo ist die Pages-Seite nur mit bezahltem Plan (Pro/Team) verfügbar, und die veröffentlichte Seite ist dann trotzdem **öffentlich im Web** – inklusive der in der App enthaltenen Daten. Es dürfen daher nur aggregierte, lizenzkonforme Daten und Vault-Inhalte in die Demo, die du freigibst (siehe O14).
- **Rollback:** Jeder Deploy ist ein Commit; Vorversion über „Re-run deploy“ eines älteren Workflow-Laufs.

## 3. Übersicht

| Sprint | Inhalt | Roadmap-Pakete | Live-Demo (was du siehst) | Meilenstein |
|---|---|---|---|---|
| **Z0** | Fundament + Deploy-Pipeline | 0.1–0.8 (verschlankt) | App-Shell live, installierbar, Build-Info | – |
| **Z1** | Rechenkern A: Geld, detmath, Zufall, Kalender, Parameter, Darlehen | 1.1–1.5 | Seite „Darlehensrechner“ (Annuität, Tilgungsplan, Sondertilgung) | – |
| **Z2** | Rechenkern B: Kaufnebenkosten 16 Länder, Kennzahlen, Cashflow-Kaskade, Erklärweg | 1.6–1.9 | Seite „Bierdeckel & Kalkulator“ mit Rechenweg je Zahl | **M-A** |
| **Z3** | Daten I: IC-Export, Datenpaket, Zeitreihen | 2.1, 2.2, 2.4, 2.5 | Seite „Daten“: Zeitreihen, Regelstände, Qualitätsindikator | – |
| **Z4** | Daten II: Karte, Regionen-Explorer, 23 Referenzregionen, Landesregeln NDS/NRW/HB, Quellenscreen | 2.3, 2.6, 2.7 | Karte → Kreis klicken → Kennzahlen mit Quelle/Status, Mietrechts-Flags | – |
| **Z5** | Spiel I: Spielstand, Startassistent, Zeit/„Weiter“, Cockpit, Posteingang | 3.3, Teile 3.7 | Neues Spiel starten, Monate weiterschalten, Post lesen | – |
| **Z6** | Spiel II: Markt, Angebotsgenerator, Exposé, Kalkulator im Spiel | 3.1, 3.2, Teile 3.7 | Angebote ansehen, prüfen, rechnen (Aufdeckung verdeckter Mängel) | – |
| **Z7** | Spiel III: Bank v1, Finanzierungsanfrage, Kaufprozess-Tracker | 3.4, 3.5 | Finanzierung anfragen (Zusage/Absage mit Begründung), Wohnung kaufen | – |
| **Z8** | Spiel IV: Vermietung, Monatsbericht, Erklär-Karten, Speichern, Onboarding, A11y | 3.6, 3.8–3.11 | **Erste Wohnung** komplett: kaufen → vermieten → 12 Monate | **M-B** |
| **Z9–Z13** | P4: Mieter/Mieterhöhung · Betriebskosten/WEG · Gebäude/Ereignisse · Steuern/Jahresabschluss · Zeitbudget/UI-Politur | 4.1–4.10 | ein volles Jahr mit allen Pflichten | **M-C** |
| **Z14–Z17** | P5: MFH · Bank v2/Anschluss · Verkauf/Bewertung · Marktpfad v2/Stresstest/Krise | 5.1–5.8 | 10 Einheiten, Zinswende überstehen | **M-D** |
| **Z18–Z21** | P6: Lernpfad K1–K5 · Szenarien H2/H4 · Akademie/Mentor · Challenges/Ziele | 6.1–6.8 | Lernpfad + historische Szenarien | **M-E** |
| **Z22+** | P7/P8 (Profi-Inhalte, Release); Details später | 7, 8 | – | – |

Strang W läuft nicht als eigener Sprint, sondern **als Vorbedingung/Teilaufgabe** (Abschnitte unten); größere Vault-Batches bekommen bei Bedarf einen halben Sprint („Z3W“) und dein Freigabe-Okay je Batch (O10).

---

## 4. Sprint-Beschreibungen

Aufbau je Sprint: **Ziel · Umfang · Nicht dabei · Vorbedingung · Demo · Abnahme-Checkliste (für dich) · Fix-Runde**.

### Z0 – Fundament + Deploy-Pipeline
- **Ziel:** Sauberes Repo, das bei jedem Merge automatisch live geht; Agents finden Regeln und Befehle.
- **Umfang:** Legacy nach `legacy/prototyp-v0/` (Tag `prototyp-v0`) · pnpm-Workspace, Vite + React 19 + TS, Biome, Vitest, Paket-Skelette `sim-core`, `ui`, `config`, `apps/web` (übrige Pakete erst bei Bedarf) · Versions-Spike (echte Versionen in ADR 0001/0002) · `CLAUDE.md` ausbauen (`07-…` §2), `pnpm verify` = lint + typecheck + test + build · `pages.yml` (siehe § 2) · App-Shell: Router, Layout (Sidebar/Tab-Leiste), Design-Tokens hell/dunkel, Fußzeile mit Build-Info, PWA-Manifest + Offline-Cache · `docs/STATUS.md` · ADRs 0001–0010 als Kurzentwürfe.
- **Nicht dabei:** Storybook, Plugins-Feinschliff, Monorepo-Pakete ohne Inhalt, Turborepo (erst wenn nötig).
- **Vorbedingung (du):** Pages aktivieren, Branch-Weg A/B wählen (Q13), Repo-Sichtbarkeit klären (Q14).
- **Demo:** `https://henrikbch1.github.io/Immo/` zeigt Shell mit Navigation (Platzhalterseiten), hell/dunkel, Build-Info.
- **Abnahme:** (1) URL öffnet auf Desktop **und** Handy. (2) Fußzeile zeigt aktuelle Sprint-Nr. und Commit. (3) Hell/dunkel wechselt, Seitenleiste/Tab-Leiste passt sich an. (4) Reload auf einer Unterseite gibt keine 404. (5) Seite lässt sich installieren und startet offline (Flugmodus). (6) GitHub-Actions-Lauf ist grün.

### Z1 – Rechenkern A + Darlehensrechner
- **Ziel:** Deterministische Basis und die erste echte Rechnung, im Browser nutzbar.
- **Umfang:** `Cents`/Basispunkte/Rundung, Formatter (de-DE) · `detmath` (`powInt`, `expDet`, `lnDet`), zählerbasierter PRNG, Lint-Verbote (`Math.pow`, `Math.random`, Float-Geld) · Kalender (`MonthIndex`) · Parameter-Registry mit Status/Quelle/Stand (Schema + wenige Parameter) · Darlehen: Annuität, Tilgungsplan, Sondertilgung, Restschuld · Golden Tests T1–T13 (`../research/10-…` §1.9).
- **Demo-Seite „Darlehensrechner“:** Eingaben (Darlehen, Zins, Tilgung, Zinsbindung, Sondertilgung), Tilgungstabelle, Restschuld am Zinsbindungsende, Diagramm.
- **Abnahme:** (1) 300.000 €, 4,0 %, 2 % Tilgung → Rate und Restschuld nach 10 Jahren stimmen mit deiner Vergleichsrechnung (z. B. Bank-Rechner). (2) Sondertilgung verkürzt die Laufzeit nachvollziehbar. (3) Jeder Wert zeigt Status-Badge (z. B. „GESCHÄTZT“ beim Zinsbeispiel). (4) Zahlen formatiert „1.234,56 €“. (5) Seite funktioniert per Tastatur.

### Z2 – Rechenkern B + Kalkulator (**M-A**)
- **Ziel:** Ein Objekt fachlich korrekt durchrechnen, mit Rechenweg.
- **Umfang:** Kaufnebenkosten (GrESt 16 Länder, Notar/Grundbuch, Makler §§ 656b/c) · Kennzahlen (Faktor, Brutto-/Nettorendite, Cashflow-Kaskade operativ → nach Finanzierung) · `explain()`-Pfad + einfache Erklär-Karte · Determinismus-Hash-Test (Node; Browser-Matrix wenn Zeit) · Balancing-CLI-Gerüst `pnpm balance`.
- **Nicht dabei:** Steuer (P4), Rücklagenmodell (P4).
- **Demo-Seite „Bierdeckel & Kalkulator“:** Objekt eingeben (Preis, Fläche, Miete, Hausgeld, Bundesland), Bierdeckel-Ampel, Vollkalkulation, Erklär-Karte je Zahl.
- **Abnahme:** (1) Bundesland wechseln → GrESt ändert sich korrekt (NDS 5,0 / NRW 6,5 / HB 5,5 %). (2) Beispielobjekt: Nebenkosten und Kennzahlen gegen deine Rechnung prüfen. (3) „Wie wurde das berechnet?“ öffnet nachvollziehbaren Rechenweg. (4) Zwei Läufe mit gleicher Eingabe → gleicher Hash (Anzeige in Fußzeile „Prüfsumme“).
- **Strang W vorab:** GrESt-Tabelle, AfA-Sätze, Notar/Grundbuch als Parameter (`09` §8 W-A5).

### Z3 – Daten I (IC-Export, Datenpaket, Zeitreihen)
- **Ziel:** Echte Daten kommen aus dem Vault ins Spiel, mit Quelle/Status.
- **Umfang:** **Im IC-Repo** (Branch dort `claude/compassionate-hypatia-ty5f91`): `tools/export-spiel.mjs` (Datenvertrag v1, `05-…` §3) + Import der Destatis-Felder (Einwohner, Fläche, Koordinaten, DEGURBA) nach Vault-Regeln, `vault-lint` 0 Befunde · `packages/data`: Import, Zod-Schema, Schätzkaskade, Qualitätsindikator · Zeitreihen (Bundesbank-Zins, VPI, HPI) · Regeln v1 mit `gültig_ab/bis` (GrESt, ESt 2026, AfA, Kappung/MPB nur Struktur).
- **Vorbedingung:** Freigabe des ersten Vault-Batches (O10, ≤ 20 Notizen) und Q12 (Hosts) für Primärprüfung.
- **Demo-Seite „Daten“:** Zeitreihen-Charts (Bauzins, VPI, HPI) mit Stand/Quelle, Regelliste mit Gültigkeit, Anteil „gemessen/geschätzt“.
- **Abnahme:** (1) Jede Kurve zeigt Quelle + Stand. (2) Regel „GrESt NRW“ zeigt Satz, Gültigkeit, Quelle. (3) Datenpaket < 1 MB gz (Anzeige). (4) Qualitätsindikator nennt, wie viel geschätzt ist.

### Z4 – Daten II (Karte, Explorer, Landesregeln)
- **Ziel:** Echte Regionen erkundbar; Landes-/Gemeinderegeln für NDS, NRW, HB.
- **Umfang:** VG250 → TopoJSON (Länder/Kreise, ARS-Mapping, Lizenzvermerk) · Regionen-Explorer (Karte + Tabelle + Erklärung je Kennzahl) · **23 Referenzregionen** (`09` §6) mit Kennzahlen, Archetyp, Mietrechtsflags (Gemeindelisten aus `research/25`) · Screen „Datenquellen & Lizenzen“ (Grundgerüst) · Hebesätze als Bandbreite GESCHÄTZT.
- **Demo:** Karte; Kreis anklicken → Einwohner, Fläche, Preis/Miete (geschätzt/gemessen), Mietpreisbremse ja/nein, Kappung, Quelle.
- **Abnahme:** (1) Stadt Bremen: MPB ja, 15 %; Bremerhaven: MPB nein, 20 %. (2) Delmenhorst vs. Achim zeigen unterschiedliche Regeln. (3) Köln: Zweckentfremdungs-Hinweis. (4) 12.588 Gebiete scrollen/suchen ohne Ruckeln. (5) Datenquellen-Seite listet Pflichtvermerke (BKG, Destatis).

### Z5 – Spiel I (Zustand, Start, Zeit, Cockpit, Post)
- **Ziel:** Das Spiel hat einen Zustand und eine Zeit.
- **Umfang:** Spielstand/Befehle/Ereignisse (Kern von `02` §1) · Startassistent ≤ 3 Schritte, Startprofile S1–S6 (S1 Standard, Region **Stadt Bremen**) · „Weiter“-Monatsschleife (leere Welt + Gehalt/Lebenshaltung) · Cockpit, Zeitleiste, Posteingang · Autosave (IndexedDB).
- **Demo:** Neues Spiel → Cockpit → Weiter (Monat für Monat; Konto verändert sich) → Posteingang.
- **Abnahme:** (1) Start in ≤ 3 Klicks. (2) 12 × Weiter: Kontostand nachvollziehbar (Gehalt − Lebenshaltung). (3) Seite neu laden → Spiel ist noch da. (4) S1…S6 laden jeweils passende Startwerte.

### Z6 – Spiel II (Markt, Angebote, Exposé)
- **Ziel:** Eine Wohnung finden und beurteilen wie in echt.
- **Umfang:** Makro-Startzustand Nov. 2026 · Regionalmarkt v1 · Angebotsgenerator ETW (sichtbar vs. verdeckt, Exposé-Schönung, Archetypen `09` §7) · Marktliste + Kreis-Karte · Exposé-Screen · Kalkulator mit Spielobjekt · Besichtigung/Unterlagen als Aufdeckung verdeckter Mängel.
- **Demo:** In Stadt Bremen/Hannover/Dortmund Angebote durchsehen, Exposé lesen, Kalkulator, Besichtigung buchen.
- **Abnahme:** (1) Angebotspreise je Region plausibel (Stichprobe gegen dein Gefühl, mit Status „geschätzt“). (2) Gleiches Spiel (Seed) → gleiche Angebote. (3) Besichtigung/Unterlagen decken Mängel auf; Exposé-Angaben können abweichen. (4) Hilfestufe schaltbar.

### Z7 – Spiel III (Bank, Finanzierung, Kaufprozess)
- **Ziel:** Von der Finanzierungsanfrage bis zum Notartermin.
- **Umfang:** Bank v1 (Profile A/B, Prüfschritte PS0–PS6/8/9, Begründungen mit Code + Zahlen), Konditionen · Finanzierungsanfrage-Flow · Kaufprozess-Automat (Gebot, Unterlagen, Notar, Übergang) mit Dauern/Kosten · Entscheidungsdialog mit Folgenvorschau.
- **Demo:** Anfrage → Zusage oder begründete Absage → Gebot → Notar → Eigentümer.
- **Abnahme:** (1) Mit S3 (wenig EK) kommt eine begründete Absage mit Zahlen. (2) Mit S1 kleines Objekt: Zusage, Kaufnebenkosten stimmen mit Z2 überein. (3) Tracker zeigt Monate je Schritt. (4) Folgenvorschau vor teuren Aktionen.

### Z8 – Spiel IV (Vermietung, Monatsbericht, Review) – **M-B**
- **Ziel:** Die erste Wohnung vollständig durchspielen.
- **Umfang:** Vermietung v1 (Inserat, Bewerber, Auswahl, Vertrag, Mietzahlung, Hausgeld) · Monatsbericht · Erklär-Karten überall · Speichern/Laden/Export/Import (Round-Trip-Hash) · Onboarding K2 (skriptiert) · Kauf-Review · A11y-Prüfung (axe) + Tastatur · Usability-Test 1 (du).
- **Demo:** S1 → Wohnung finden → kaufen → vermieten → 12 Monate → Review.
- **Abnahme:** siehe `06` P3-Demo; zusätzlich: Export/Import erzeugt identischen Stand; 0 kritische axe-Befunde; Monatsbericht erklärt jede Veränderung.

### Z9–Z13 (P4 Bewirtschaftung & Steuern, je ein Sprint)
| Sprint | Umfang | Demo-Abnahme (Kern) |
|---|---|---|
| Z9 | Mieter-Automat (Zahlungsstörung, Mahnung, Kündigung, Leerstand) + Mieterhöhung § 558/Index/Staffel, Kappung/MPB regional | Mieterhöhungs-Assistent zeigt Grenzen; in Bremen 15 % Kappung, in Delmenhorst 20 % |
| Z10 | Betriebskosten (Umlagefähigkeit, Heizkosten, CO₂) + WEG (Hausgeld, Plan, Rücklage, Sonderumlage, Versammlung) | Jahresabrechnung erzeugt Nachzahlung/Guthaben; Sonderumlage-Beschluss |
| Z11 | Gebäude (Bauteile, Ausfall, Instandhaltung), Versicherung, Ereignissystem (≥ 25 Typen) | Schadensfall mit Deckungsprüfung; Ereignis mit Optionen + Folgen |
| Z12 | Steuer privat (V+V, AfA, 15-%-Grenze, ESt 2026), Jahresabschluss, Jahresbericht, Debrief v1 | Steuerbescheid im Folgejahr; Erklär-Karte zur AfA |
| Z13 | Zeitbudget/Delegation (AP), UI-Politur P4, Regression, Usability-Check | Hausverwaltung vs. selbst machen; zwei Jahre ohne Absturz |

### Z14–Z17 (P5 Skalierung & Finanzen)
| Sprint | Umfang | Demo-Abnahme (Kern) |
|---|---|---|
| Z14 | MFH, Portfolio-Übersicht mit Linsen | MFH kaufen, Einheiten vermieten |
| Z15 | Bank v2 (Portfolio, Kreditrahmen), Anschlussfinanzierung, Sondertilgung, Vorfälligkeitsentschädigung | Zinsbindungsende: Prolongation vs. Umschuldung mit Zahlen |
| Z16 | Bewertung & Verkauf, Erlös-Wasserfall, Spekulationsfrist | Verkauf ohne Gratis-Gewinn (Anti-Exploit-Test) |
| Z17 | Marktpfad v2 (stochastisch), Stresstest, Krisen-Flow, Szenario-Labor | Zins +2 Pp. → Frühwarnung → Optionen |

### Z18–Z21 (P6 Lernen & Szenarien)
| Sprint | Umfang | Demo-Abnahme (Kern) |
|---|---|---|
| Z18 | Lernpfad-Format + Kapitel K1–K3 (Modell-Progression, Lernziele, Musterlösung) | Kapitel 1–3 durchspielbar |
| Z19 | Historische Szenarien H2 + H4 (echte Reihen, damalige Regelstände) | „Zinswende 2021–25“ läuft mit historischen Daten |
| Z20 | Akademie (Glossar, Mikro-Lektionen), Mentor v1, Kauf-Review/Schattenrechnung | alle Begriffe verlinkt, Mentor wählt nie für dich |
| Z21 | Challenges (Seed + Musterlösung), Ziele/Meilensteine, Jahresbericht, Usability-Test 2 | 5 Challenges, Vergleich mit Musterlösung |

**Z22+** (P7 Profi-Inhalte, P8 Release, später P9 Mobile) werden erst nach Z17 im gleichen Format detailliert (Annahmen ändern sich bis dahin).

---

## 5. Start-Prompt (Vorlage; `NN` ersetzen, in neuen Chat einfügen)

```text
Immobilien-Trainingsspiel, Repo henrikbch1/Immo. Starte Sprint ZNN laut docs/plan/11-umsetzung-sprints.md.
Lies nur: docs/STATUS.md, CLAUDE.md, den Abschnitt „ZNN“ in docs/plan/11-umsetzung-sprints.md
und die dort genannten Plan-Abschnitte (große Dateien nur abschnittsweise mit grep -n '^## ' und sed -n).
Regeln: Sonnet für Umsetzung, max. 2 Subagents, kein Gendern, du-Anrede, Fachwerte nur aus Vault/Plan mit Status-Flag.
Ende: pnpm verify grün, Deploy auf GitHub Pages, docs/berichte/sprint-ZNN.md, docs/STATUS.md, commit + push,
dann meine Abnahme-Checkliste ausgeben. Bei ca. 80 % Limit: stoppen, Notfall-Bericht schreiben, pushen.
Befunde aus dem letzten Test: <hier einfügen oder „keine“>
```

## 6. Abnahme-Protokoll (für dich, 10 Minuten je Sprint)

1. Live-URL öffnen, Fußzeile: stimmt Sprint-Nr./Commit?
2. Checkliste des Sprints durchgehen; jeden Punkt mit ✔/✘ notieren.
3. Auf dem Handy mindestens Punkt 1–3 gegenprüfen.
4. Befunde als kurze Liste („Seite – was erwartet – was passiert“) in den nächsten Chat einfügen.
5. Blockierende Befunde → Fix-Runde zuerst; sonst weiter mit dem nächsten Sprint.

## 7. Risiken und Gegenmaßnahmen speziell für die Sprint-Taktung

| Risiko | Gegenmaßnahme |
|---|---|
| Sprint sprengt das Limit | 80-%-Regel, Umfang mit „Nicht dabei“-Liste, Rest in `STATUS.md` |
| Ein Chat kennt den vorigen nicht | `STATUS.md` + Sprint-Bericht + feste Start-Prompts; Entscheidungen in `10-…` und ADRs |
| Demo deployt kaputten Stand | Pages-Workflow läuft nur nach grünem `pnpm verify`; Rollback über älteren Lauf |
| Öffentliche Seite mit Daten | nur freigegebene, lizenzierte Daten (O14, Q14); Disclaimer-Banner „Lernspiel, keine Beratung“ ab Z0 |
| Fachwerte unbelegt (Länder-Recherche) | Status GESCHÄTZT sichtbar; Primärprüfung vor Z3/Z4 (Strang W) |
| Kosten steigen durch Subagents | max. 2 parallel; Recherche nur gezielt |
