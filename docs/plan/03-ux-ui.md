# 03 – UX/UI-Spezifikation (verbindlich)

**Stand:** 26.11.2026 · **Status:** verbindlich für P0–P9 · **Gilt für:** Web-App (Offline-PWA) und später Capacitor-Apps (iOS/Android)
**Grundlage:** Recherche 21 (Game-Design & UX), Audit 01 (Prototyp, Abschnitte 5, 7, 8), Fachspezifikationen 10–14, Tech-Stack 22 (Abschnitt 5).
**Was dieses Dokument ist:** die umsetzbare Spezifikation aller Bereiche, Screens, Überlagerungen, Komponenten und Qualitätsregeln. Begründungen und Belege stehen in den Recherche-Dokumenten. Hier steht, *was gebaut wird* und *woran wir prüfen, dass es richtig ist*.

### Lesehilfe

| Kennzeichen | Bedeutung |
|---|---|
| **MUSS / SOLL / KANN** | verbindlich / Standard, Abweichung nur begründet / optional |
| **S-nn** | Screen (eigene Route). S-01 bis S-37 entsprechen der Nummerierung in Recherche 21 (B4.2), S-38 bis S-43 sind neu |
| **O-nn** | Überlagerung (keine eigene Seite): Erklär-Karte, Dialoge, Sheets, Toasts |
| **F-nn** | Ablauf (Flow) über mehrere Screens |
| **K-nn** | Komponente des Design-Systems (`packages/ui`) |
| **AK-Sxx-n** | prüfbares Akzeptanzkriterium |
| **EK:schlüssel** | Erklär-Karte zu einer Kennzahl, z. B. `EK:cf.nachSteuern` (Schlüssel kommen aus dem Rechenkern) |
| **[P0] … [P9]** | Roadmap-Phase, in der ein Screen/Feature zuerst geliefert wird |
| **(Audit 5.4)** | Verweis auf einen dokumentierten Fehler des Prototyps, den die Regel verhindert |

Zahlen in Beispielen und Skizzen sind **illustrativ**. Maßgeblich sind immer die Werte des Rechenkerns und die Fachspezifikationen 10–14.

---

## 0. UX-Vision, Leitprinzipien, Personas

### 0.1 Vision

> **Ein ruhiges, präzises Trainingswerkzeug mit Spielwelt.** Es fühlt sich an wie eine gute Banking- und Analyse-Software, in der man ein echtes Immobilienleben in Monatsschritten führt. Jede Zahl ist erklärbar, jede Entscheidung zeigt ihre Folgen vorher, die Zeit läuft nur, wenn du es willst. Wer zehn Spieljahre durchhält, versteht, warum Banken Nein sagen, wann eine Mieterhöhung zulässig ist und wie ein Bestand an Liquidität scheitert.

Was das Spiel **nicht** ist: ein Klick-Idle-Spiel, ein Börsenticker, ein Ranglisten-Wettbewerb um maximalen Hebel, eine Anlageberatung.

### 0.2 Leitprinzipien (verbindlich, in Konfliktfällen gilt die Reihenfolge)

| # | Prinzip | Was es im Interface konkret heißt |
|---|---|---|
| L1 | **Erklären vor Beeindrucken** | Jede angezeigte Kennzahl öffnet per Klick/Tap/Enter eine Erklär-Karte (O-01) mit Herleitung aus echten Werten. Keine Zahl ohne Einheit, Zeitbezug und Herkunft. |
| L2 | **Die Spielerin bestimmt das Tempo** | Monatstakt, keine Echtzeit, kein Timer. Die Simulation verändert nie den Bildschirm, während jemand tippt oder entscheidet (Audit 5: Eingaben wurden durch Ticks zerstört). |
| L3 | **Entscheidungen sind der Inhalt** | Der Posteingang enthält nur Entscheidungen mit Frist. Routine landet gebündelt im Monatsbericht. Der Badge zählt nur Entscheidungen. |
| L4 | **Folgen vor dem Klick** | Jede relevante Aktion zeigt Vorher/Nachher der betroffenen Kennzahlen. Knopftexte nennen Handlung und Betrag. Billiges wird rückgängig gemacht statt bestätigt, Teures wird geprüft. |
| L5 | **Ehrlich über Unsicherheit und Herkunft** | Prognosen als Bandbreite. Jeder Wert trägt einen Status: **belegt · abgeleitet · geschätzt · Vereinfachung**, mit Quelle und Stand. Simulierte Zukunft ist als Spielwelt gekennzeichnet. |
| L6 | **Verzögerungen sichtbar machen** | „Demnächst“-Zeitachse, Fortschritts-Tracker für Kauf, Finanzierung, Sanierung. Debriefs verknüpfen Ursache und Wirkung über Monate. |
| L7 | **Voller Rechenkern, gestufte Darstellung** | Das Modell rechnet immer realistisch. Die Oberfläche blendet Systeme gestuft ein (Hilfestufe, Lernpfad, Dichte). Vereinfachte Anzeigen sind gekennzeichnet. |
| L8 | **Stabil und vorhersagbar** | Navigation von Anfang an vollständig und gleich. „Weiter“, Hilfe und Suche immer am selben Ort. Neues wird markiert, nicht plötzlich eingeblendet. |
| L9 | **Tabelle zuerst, Skalierung mitdenken** | Jede Liste funktioniert mit 1 und mit 200 Einträgen: sortieren, filtern, gruppieren, Spalten wählen, Massenaktionen. Desktop und Tablet sind die Primärgeräte (Multi-Pane). |
| L10 | **Barrierefrei und fair ab Tag 1** | WCAG 2.2 AA, Status nie nur über Farbe. Keine Streaks, Login-Boni, FOMO-Countdowns, Ranglisten nach Vermögen. |

### 0.3 Personas

| ID | Persona | Kontext & Geräte | Ziele | Frustrationen, die wir vermeiden | Was sie von der UI braucht |
|---|---|---|---|---|---|
| **PA** | **Der Auftraggeber selbst – „lernender Investor“** (Primärpersona) | Angestellt, plant reale Kapitalanlagen, lernt Immobilieninvestment systematisch. Spielt abends am Desktop/Tablet in 30–90-Minuten-Sitzungen, unterwegs kurz am Handy. | Realistisch trainieren: kaufen, finanzieren, bewirtschaften, skalieren. Fehler im Spiel machen statt im Leben. Verstehen, *warum* etwas passiert. | Black-Box-Zahlen, unrealistische Abkürzungen (Sofortkauf, unbegrenzter Kredit), Textwände, schlampige Bedienung (Fokusverlust, abgeschnittene Tabs) | Herleitung jeder Zahl, echte Regionen mit Stand/Quelle, Kalkulator auf Profi-Niveau, Bankrechnung transparent, Debriefs, durchdachte Menüs |
| **PB** | **Einsteigerin ohne Vorwissen** („Lena, 29“) | Kennt Begriffe wie AfA oder Beleihung nicht. Tablet/Handy. | Erste Wohnung verstehen, Angst vor Fehlern abbauen | Fachjargon ohne Erklärung, zu viele Zahlen auf einmal, Scheitern ohne Erklärung | Lernmodus, Musterlösungen, ein Hinweis pro Bildschirm, Glossar inline, Checkpoints |
| **PC** | **Erfahrener Investor** („Markus, 45“, real 6 Einheiten) | Desktop, Tastatur, großer Monitor | Szenarien durchspielen (Zinsschock, Anschluss, Skalierung), schnell sein | Gängelung, Pflicht-Tutorials, zu viele Stopps, Klickwege | Profi-Dichte, „Weiter bis Ereignis“, Befehlspalette, Tabellen mit gespeicherten Ansichten, Massenaktionen |
| **PD** | **Mobil-Pendler** (Variante von PA) | Handy, 5–10 Minuten, einhändig | Einen Monat abarbeiten, Posteingang leeren | Winzige Ziele, Filter, die den Bildschirm füllen (Audit 5.2), verdeckte Knöpfe | Zeitleiste in der Daumenzone, Karten statt Tabellen, Bottom Sheets, Fortsetzen in einem Tipp |
| **PE** | **Tastatur- und Screenreader-Nutzer** (Anforderungs-Persona) | NVDA/VoiceOver, keine Maus | Gleichwertig spielen | Nur-Hover-Infos, Live-Region-Fluten (Audit 5.7), Fokusfallen | Semantik, Fokusführung, ganze Sätze für Zahlen, Tabellen-Fallback für Diagramme |

### 0.4 Kernaufgaben (Top Tasks, Grundlage für Tests in Kap. 7)

| ID | Aufgabe | Haupt-Screens |
|---|---|---|
| T1 | Lage verstehen: „Wie stehe ich, was ist dringend?“ | S-06, S-07 |
| T2 | Eine Entscheidung mit Frist treffen | S-08, S-09, O-04 |
| T3 | Ein passendes Objekt finden und prüfen | S-11, S-13, S-14, S-38 |
| T4 | Eine Finanzierung bekommen und Ablehnungen verstehen | S-17, S-29 |
| T5 | Einen Kauf abwickeln bis zur ersten Miete | S-18, S-19 |
| T6 | Vermieten und die Miete rechtssicher erhöhen | S-22, S-23, S-39 |
| T7 | Liquidität steuern und eine Krise überstehen | S-27, O-08 |
| T8 | Anschlussfinanzierung entscheiden | S-28 |
| T9 | Ein Jahr auswerten und daraus lernen | O-09, S-36 |
| T10 | Den Bestand skalieren (Bankrahmen, Portfolio-Sicht) | S-20, S-29, S-32 |

### 0.5 Modi der Oberfläche: Hilfestufe, Dichte, Marktschwierigkeit

Drei **unabhängige** Einstellungen (S-04). Jeder Screen MUSS in allen Kombinationen funktionieren.

| Merkmal | **Lernmodus** | **Standard** | **Profi** |
|---|---|---|---|
| Mentor (O-03) | proaktiv bei hoher Tragweite, Prüffragen, „Mentor-Check“ in Dialogen | nur bei kritischen Lagen (z. B. Kauf ohne Reserve) | nur auf Abruf |
| Coachmarks (O-12) | beim ersten Besuch jedes Screens (max. 1) | nur für neu freigeschaltete Bereiche | aus |
| Modell-Progression | gestuft nach Lernpfad (Kap. 3.11), nicht eingeführte Systeme „vereinfacht angezeigt“ | alle Systeme sichtbar | alle Systeme sichtbar |
| Stopp-Regeln (Zeitleiste) | alle aktiv | Standardsatz | minimal (nur Pflichtentscheidungen, Liquidität kritisch) |
| Monatsbericht nach „Weiter“ | immer | bei Auffälligkeiten | nie (nur Toast mit Link) |
| Checkpoints | automatisch vor großen Entscheidungen, „Zurück zum Entscheidungspunkt“ | manuelle Spielstände | manuelle Spielstände, optional Ironman |
| Standard-Dichte | komfortabel | komfortabel | kompakt |
| Glossar-Unterstreichung | jedes erste Auftreten je Ansicht | jedes erste Auftreten je Ansicht | nur im Fließtext von Erklär-Karten |

**Dichte** (komfortabel/kompakt) ändert Zeilenhöhen, Abstände und Schriftgröße in Tabellen, nie die Zielgröße von Touch-Hauptaktionen (Kap. 4.4). **Marktschwierigkeit** (Zinsumfeld, Ereignisdichte) ist eine Spielregel und ändert die UI nicht.

---

## 1. Informationsarchitektur

### 1.1 Sitemap

Fünf Hauptbereiche plus Akademie, darüber die globale Zeitleiste. Rahmen-Screens liegen außerhalb eines laufenden Spiels.

```
RAHMEN (außerhalb eines Spielstands)
├─ S-01 Startbildschirm ...................................... [P3]
├─ S-02 Spielstart-Assistent ................................. [P3]
├─ S-03 Spielstände (Autosave, manuell, Checkpoints) .......... [P3 basic, P6 Checkpoints]
├─ S-04 Einstellungen ......................................... [P3 basic, P8 vollständig]
├─ S-05 Konto & Sync (optional) .............................. [P8]
└─ S-41 Quellen, Datenstand & Lizenzen  (neu) ................ [P2]

IM SPIEL  (App-Shell mit Zeitleiste)
├─ COCKPIT
│  ├─ S-06 Cockpit ............................................ [P3]
│  ├─ S-07 Monatsbericht (+ Archiv) ............................ [P3]
│  └─ S-40 Kalender „Demnächst“: Fristen & Termine (neu) ...... [P4]
├─ POSTEINGANG
│  ├─ S-08 Posteingang-Liste .................................. [P3]
│  ├─ S-09 Nachricht/Ereignis mit Entscheidungsdialog ......... [P3]
│  └─ S-10 Chronik (Archiv, durchsuchbar) ...................... [P4]
├─ MARKT
│  ├─ S-11 Angebote: Liste & Karte, Linsen ..................... [P3 Liste, P2/P5 Karte]
│  ├─ S-38 Regionen-Profil Land/Kreis/Gemeinde (neu) ......... [P2]
│  ├─ S-12 Suchaufträge ........................................ [P5]
│  ├─ S-13 Exposé-Detail ....................................... [P3]
│  ├─ S-14 Investitionsrechner/Kalkulator ..................... [P3 basic, P5 vollständig]
│  ├─ S-15 Vergleich (2–4 Objekte) ............................. [P5]
│  ├─ S-16 Merkliste ............................................ [P3]
│  ├─ S-17 Finanzierungsanfrage & Bankentscheidung ........... [P3]
│  ├─ S-18 Gebot & Verhandlung .................................. [P3 basic, P5 Gebotsrunden]
│  └─ S-19 Kaufabwicklungs-Tracker (+ Liste laufender Käufe) .. [P3]
├─ BESTAND
│  ├─ S-20 Portfolio-Übersicht (Tabelle/Karten/Karte, Linsen) . [P3 basic, P5 vollständig]
│  ├─ S-39 Einheiten & Mieter, portfolioweit (neu) ............ [P4]
│  ├─ S-21 Objekt-Detail ........................................ [P3 basic, P4 vollständig]
│  ├─ S-22 Einheit/Mietvertrag + Mieterhöhungs-Assistent ...... [P4]
│  ├─ S-23 Vermietung (Inserat, Bewerberauswahl) .............. [P3 basic, P4 vollständig]
│  ├─ S-24 Instandhaltung & Modernisierung ..................... [P4]
│  ├─ S-25 WEG-Bereich ........................................... [P4]
│  ├─ S-26 Verkauf-Assistent .................................... [P5]
│  └─ S-42 Kauf-Review nach 12 Monaten (neu) ................... [P6]
├─ FINANZEN
│  ├─ S-27 Liquidität & Kontoauszug ............................ [P3 basic, P5 Prognose]
│  ├─ S-28 Kredite & Anschlussfinanzierung .................... [P3 Übersicht, P5 Anschluss]
│  ├─ S-29 Bank: Bonität, Kreditrahmen, Gespräche ............. [P5]
│  ├─ S-30 Steuern .............................................. [P4]
│  ├─ S-31 Berichte & Export ................................... [P4 Jahresbericht, P8 Export]
│  ├─ S-32 Szenario-Labor/Stresstest ........................... [P5]
│  └─ S-43 Krisen-Analyse & Lauf-Ende (neu) .................... [P5]
└─ AKADEMIE
   ├─ S-33 Lernpfad & Challenges ............................... [P6]
   ├─ S-34 Glossar ............................................... [P3 basic, P6 vollständig]
   ├─ S-35 Mikro-Lektionen ...................................... [P6]
   ├─ S-36 Entscheidungstagebuch & Debrief-Archiv .............. [P4 Tagebuch, P6 Debriefs]
   └─ S-37 Ziele, Meilensteine, Statistiken .................... [P3 Ziel, P6 vollständig]

ÜBERLAGERUNGEN (keine eigenen Seiten, aber per Suchparameter verlinkbar)
O-01 Erklär-Karte · O-02 Glossar-Popover · O-03 Mentor-Panel · O-04 Entscheidungsdialog
O-05 Prüfschritt · O-06 Befehlspalette · O-07 Toast/Rückgängig · O-08 Krisen-Flow
O-09 Jahresabschluss-Sequenz · O-10 Weiter-Menü & Stopp-Regeln · O-11 Simulationslauf
O-12 Coachmark · O-13 Filter-Sheet · O-14 Entwürfe des Monats („vorgemerkt“)
```

Insgesamt **43 Screens** und **14 Überlagerungen**. Neu gegenüber Recherche 21 sind S-38 (echte Regionen brauchen ein eigenes Profil), S-39 (Skalierung auf 50+ Einheiten), S-40 (Fristen als Kalender), S-41 (Pflicht zur Quellen- und Lizenzangabe), S-42 (Kauf-Review als eigener Lernanlass) und S-43 (Scheitern als Prozess mit Analyse).

### 1.2 Navigation je Fensterbreite

**Breakpoints** (Material-3-Fensterklassen, Desktop zuerst entworfen):

| Klasse | Breite | Primäres Gerät | Navigation | Pane-Modell |
|---|---|---|---|---|
| **Groß** | ≥ 1200 px | Desktop, Tablet quer (12,9") | **Sidebar** 240 px (einklappbar auf 72 px), App-Leiste oben mit Zeitleiste rechts | bis zu **3 Panes: Liste │ Detail │ Erklärung** (Erklärung 320–380 px, anheftbar) |
| **Erweitert** | 840–1199 px | Tablet quer, kleines Notebook | **Rail** 72 px mit Beschriftung, App-Leiste oben mit Zeitleiste | **2 Panes: Liste │ Detail**; Erklärung als nicht-modales Seitenpanel über dem Detail (K-20) |
| **Mittel** | 600–839 px | Tablet hoch | **Rail** 72 px | 1 Pane, List-Detail per Push; in Querformat-ähnlichen Fenstern ≥ 720 px 50/50 für Posteingang |
| **Kompakt** | < 600 px | Handy | **Tab-Leiste unten** (5 Ziele) + **Zeitleiste darüber** in der Daumenzone | 1 Pane, Detail per Push, Erklärung/Filter im **Bottom Sheet** (nie gestapelt) |

Komponenten passen sich über **Container Queries** an ihren Platz an, nicht über die Fensterbreite (eine KPI-Kachel bricht in einer schmalen Spalte anders um als im Hauptbereich).

**Navigationsziele (identisch auf allen Breiten, Reihenfolge fest):**

| Ziel | Icon (Lucide) | Badge | Kurzbeschriftung mobil |
|---|---|---|---|
| Cockpit | `layout-dashboard` | – | Cockpit |
| Posteingang | `inbox` | Anzahl **offener Entscheidungen** (nicht Infos) | Post |
| Markt | `search` | Anzahl neuer Treffer aus Suchaufträgen (optional abschaltbar) | Markt |
| Bestand | `building-2` | – | Bestand |
| Finanzen | `landmark` | Punkt-Markierung bei kritischer Liquidität (mit Text im Tooltip und im Screenreader-Namen) | Finanzen |
| Akademie | `graduation-cap` | „Neu“ bei freigeschalteter Lektion | (mobil im Profilmenü) |

**Desktop (≥ 1200 px)**

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ ▣ Spielstand „Erste Wohnung“   Markt › Exposé       [⌕ Suchen  Strg+K]  ? │ Nov. 2026 · 2 offen │ [Weiter ▸][▾] │ ◯ │
├──────────┬───────────────────────────────────────────────────────────────────────────────┤
│ Cockpit  │                                                                               │
│ Post   2 │   Hauptbereich: Liste │ Detail │ Erklärung (angeheftet)                       │
│ Markt  ● │                                                                               │
│ Bestand  │                                                                               │
│ Finanzen │                                                                               │
│ ──────── │                                                                               │
│ Akademie │                                                                               │
│          │                                                                               │
│ « einkl. │                                                                               │
└──────────┴───────────────────────────────────────────────────────────────────────────────┘
```

- Die **Zeitleiste** sitzt rechts in der App-Leiste: Spieldatum, Status, Weiter-Knopf mit Menüpfeil (O-10). Sie bleibt beim Scrollen fix (die App-Leiste ist sticky, Audit 5: Navigation scrollte weg).
- Höhe App-Leiste 56 px (kompakt 48 px). Kein mehrzeiliger Umbruch (Audit 5.1: HUD brach auf 3 Zeilen um).

**Tablet (840–1199 px):** Rail links mit Icon + Beschriftung, App-Leiste wie Desktop, Seitentitel statt Breadcrumb. Erklärung als Seitenpanel (überdeckt das Detail, nicht die Liste).

**Mobil (< 600 px)**

```
┌──────────────────────────────┐
│ ‹  Exposé            ⌕  ?  ◯ │ ← App-Leiste 56 px: Zurück, Titel, Suche, Hilfe, Profil
│                              │
│   Inhalt (eine Spalte)       │
│                              │
├──────────────────────────────┤
│ Nov. 2026 · 2 offen [Weiter▸]│ ← Zeitleiste 48 px (Daumenzone), tippen = O-10
├──────────────────────────────┤
│ Cockpit Post Markt Bestand Fin│ ← Tab-Leiste 56 px + Safe Area
└──────────────────────────────┘
```

- Zeitleiste + Tab-Leiste zusammen höchstens 104 px + Safe Area (Audit 5: 150 px HUD mobil).
- Seitenspezifische Primäraktionen sitzen als **Aktionsleiste** über der Zeitleiste nur dort, wo sie den Kern der Seite bilden (Exposé: „Kalkulieren“ / „Finanzierung anfragen“). Nie mehr als zwei Knöpfe.
- Während Texteingabe (virtuelle Tastatur offen) werden Zeitleiste und Tab-Leiste ausgeblendet, damit der Fokus nicht verdeckt wird (WCAG 2.4.11).

### 1.3 Routen und Deep-Links (TanStack Router)

Regeln:
- Alles, was man teilen, als Lesezeichen setzen oder mit „Zurück“ erreichen will, steht in der URL: Bereich, Objekt, Reiter, Filter, Linse, Sortierung, Szenario, offene Erklär-Karte. **Nicht** in der URL: halb ausgefüllte Formulare (die liegen im Entwurfsspeicher des Monats, O-14).
- Suchparameter sind mit Zod typisiert und validiert. Ungültige Parameter fallen still auf Standardwerte zurück.
- Reiterzustand gilt **je Objekt** (Audit 5.4: globaler Tab-Zustand über alle Objekte).
- Spiel-Routen beginnen mit `/spiel/$spielId`. Öffnet jemand eine Route eines anderen Spielstands, fragt die App: „Spielstand ‚Zweiter Versuch‘ laden? Dein aktueller Stand ist gespeichert.“

| Screen | Route | Wichtige Suchparameter |
|---|---|---|
| S-01 | `/` | – |
| S-02 | `/neu` | `schritt=1..3`, `szenario=` |
| S-03 | `/spielstaende` | `ansicht=alle\|checkpoints` |
| S-04 | `/einstellungen/$bereich?` | Bereiche: `darstellung, bewegung, zahlen, zeit, hilfe, tastatur, realismus, daten` |
| S-05 | `/konto` | – |
| S-41 | `/quellen` | `quelle=` |
| S-06 | `/spiel/$spielId/cockpit` | – |
| S-07 | `/spiel/$spielId/monatsbericht/$monat` (z. B. `2026-12`) | `bis=2027-03` bei Sammelbericht |
| S-40 | `/spiel/$spielId/kalender` | `von=, bis=, art=` |
| S-08 | `/spiel/$spielId/post` | `filter=entscheidung\|info\|erledigt\|verpasst`, `kat=`, `objekt=` |
| S-09 | `/spiel/$spielId/post/$nachrichtId` | – |
| S-10 | `/spiel/$spielId/chronik` | `q=, objekt=, von=, bis=, art=` |
| S-11 | `/spiel/$spielId/markt` | `ansicht=liste\|karte`, `linse=cashflow\|rendite\|lage\|risiko`, `sort=`, `f.*` (Filter), `sicht=` (gespeicherte Ansicht) |
| S-38 | `/spiel/$spielId/markt/region/$ars` | `kennzahl=` |
| S-12 | `/spiel/$spielId/markt/suchauftraege(/$suchId)` | – |
| S-13 | `/spiel/$spielId/markt/angebot/$angebotId` | `reiter=ueberblick\|lage\|zahlen\|pruefung\|risiken\|verlauf` |
| S-14 | `/spiel/$spielId/markt/angebot/$angebotId/kalkulation` und `/spiel/$spielId/rechner` (ohne Objekt) | `szenario=A\|B\|C`, `zeitraum=monat\|jahr`, `horizont=` |
| S-15 | `/spiel/$spielId/markt/vergleich` | `ids=a,b,c`, `nurUnterschiede=1` |
| S-16 | `/spiel/$spielId/markt/merkliste` | – |
| S-17 | `/spiel/$spielId/markt/angebot/$angebotId/finanzierung` | `schritt=`, `antrag=` |
| S-18 | `/spiel/$spielId/markt/angebot/$angebotId/gebot` | – |
| S-19 | `/spiel/$spielId/markt/kaeufe(/$vorgangId)` | – |
| S-20 | `/spiel/$spielId/bestand` | `ansicht=tabelle\|karten\|karte`, `linse=cashflow\|finanzierung\|risiko\|steuern\|wert`, `gruppe=` |
| S-39 | `/spiel/$spielId/bestand/einheiten` | `f.status=`, `f.erhoehungMoeglich=1` |
| S-21 | `/spiel/$spielId/bestand/$objektId` | `reiter=ueberblick\|einheiten\|finanzierung\|kosten\|steuern\|wert\|dokumente\|chronik` |
| S-22 | `/spiel/$spielId/bestand/$objektId/einheit/$einheitId` | `assistent=mieterhoehung` |
| S-23 | `/spiel/$spielId/bestand/$objektId/einheit/$einheitId/vermietung` | – |
| S-24 | `/spiel/$spielId/bestand/$objektId/instandhaltung` | `massnahme=` |
| S-25 | `/spiel/$spielId/bestand/$objektId/weg` | – |
| S-26 | `/spiel/$spielId/bestand/$objektId/verkauf` | – |
| S-42 | `/spiel/$spielId/bestand/$objektId/review` | – |
| S-27 | `/spiel/$spielId/finanzen/liquiditaet` | `zeitraum=`, `ebene=objekt\|portfolio` |
| S-28 | `/spiel/$spielId/finanzen/kredite(/$darlehenId)` | `assistent=sondertilgung\|anschluss` |
| S-29 | `/spiel/$spielId/finanzen/bank(/$bankId)` | – |
| S-30 | `/spiel/$spielId/finanzen/steuern` | `jahr=`, `objekt=` |
| S-31 | `/spiel/$spielId/finanzen/berichte(/$berichtId)` | – |
| S-32 | `/spiel/$spielId/finanzen/szenario-labor` | `preset=` |
| S-43 | `/spiel/$spielId/krise` | – |
| S-33–S-37 | `/spiel/$spielId/akademie/{lernpfad,glossar/$begriff?,lektion/$id,tagebuch,ziele}`; außerhalb eines Spiels identisch unter `/akademie/...` | – |

**Überlagerungen per Suchparameter** (auf jeder Route): `?erklaere=cf.nachSteuern&ebene=2&kontext=objekt:o12`, `?glossar=afa`, `?entscheidung=$id`, `?palette=1` (nur intern). Auf kompakten Breiten legen Bottom Sheets einen History-Eintrag an, damit die System-Zurück-Geste sie schließt. Auf Desktop schließt Esc, ohne die History zu verändern.

### 1.4 Globale Elemente

**Zeitleiste (K-02, O-10, O-11)** – immer sichtbar im Spiel.

| Zustand | Anzeige | Klick auf Hauptknopf |
|---|---|---|
| Bereit | `Nov. 2026` · `alles erledigt` · **[Weiter ▸]** | simuliert 1 Monat |
| Entscheidungen offen | `Nov. 2026` · `2 Entscheidungen offen` · **[2 offen ›]** | führt zur ersten offenen Entscheidung (S-09); Menü bietet „Standardfolgen akzeptieren und weiter“ mit Liste der Folgen |
| Entwürfe vorhanden | zusätzlich `3 vorgemerkt` (öffnet O-14) | wie „Bereit“ |
| Simulation läuft (O-11) | `Simuliere … Feb. 2027 (3/12)` · **[Anhalten]** | hält nach dem laufenden Monat an |
| Gestoppt durch Regel | `Gestoppt: Zinsbindung endet in 6 Monaten` · [Ansehen] | öffnet Auslöser |
| Krise (Liquidität kritisch) | Warn-Icon + `Liquidität kritisch` | führt zu O-08 |

Menü (O-10, Pfeil neben „Weiter“): „1 Monat“ · „Bis zum nächsten Ereignis“ · „Bis Quartalsende / Jahresende / Datum …“ · „Auto-Weiter (Pause jederzeit)“ · „Stopp-Regeln bearbeiten“ · „Monatsbericht: immer / bei Auffälligkeiten / nie“. Zusätzlich zeigt die Zeitleiste ab Spielmonaten nach dem Datenstand ein kleines Label **„Spielwelt“** (Erklärung: „Werte ab Dez. 2026 sind simuliert (Startwert 4817). Bis Nov. 2026 echte Daten.“).

**Hilfe & Mentor** – Fragezeichen-Knopf rechts in der App-Leiste, auf allen Screens an derselben Stelle (WCAG 3.2.6). Öffnet das Mentor-Panel (O-03) mit: „Was kann ich hier tun?“ (kontextbezogen, 3–5 Punkte), Glossar-Suche, passende Mikro-Lektion, Tastenkürzel, „Tour für diesen Bereich zeigen“.

**Befehlspalette (O-06)** – `Strg+K` / `⌘K`, mobil über das Suchsymbol. Durchsucht in einer Liste, gruppiert: *Aktionen* („Sondertilgung …“, „Suchauftrag anlegen“, „Weiter bis Jahresende“), *Objekte & Einheiten*, *Angebote*, *Glossar*, *Einstellungen*. Aktionen mit Folgen öffnen ihren Dialog, führen nie direkt aus.

**Profilmenü** (Avatar rechts): Spielstand-Name und Speicherstatus („Gespeichert · Nov. 2026“), Speichern unter …, Spielstände (S-03), Ziele & Statistiken (S-37), Akademie (mobil), Einstellungen (S-04), Quellen & Datenstand (S-41), „Rechtsstand der Spieldaten: 30.09.2026“, Hauptmenü verlassen.

**Speicherstatus:** Autosave nach jedem Monat und nach jeder ausgeführten Aktion. Anzeige im Profilmenü und als Statusmeldung (Live-Region, höflich): „Gespeichert.“ Kein Toast für Autosave.

**Tastenkürzel** (alle umbelegbar, Einzeltasten-Kürzel in S-04 abschaltbar, WCAG 2.1.4; nie aktiv, solange der Fokus in einem Eingabefeld liegt):

| Kürzel | Aktion |
|---|---|
| `Strg+K` | Befehlspalette |
| `Strg+Enter` | Weiter (1 Monat) bzw. zur offenen Entscheidung |
| `Strg+Umschalt+Enter` | Weiter bis Ereignis |
| `Strg+Z` / `Strg+Umschalt+Z` | Rückgängig / Wiederholen (nur im laufenden Monat, O-07) |
| `Esc` | Überlagerung schließen, Fokus zurück zum Auslöser |
| `g` dann `c / p / m / b / f / a` | Gehe zu Cockpit / Posteingang / Markt / Bestand / Finanzen / Akademie (Einzeltasten) |
| `j` / `k` | Nächster / vorheriger Eintrag in Listen (Einzeltasten) |
| `i` | Erklär-Karte zur fokussierten Kennzahl (Einzeltaste; Enter auf der Kennzahl tut dasselbe) |
| `/` | Suche/Filter der aktuellen Liste fokussieren (Einzeltaste) |
| `?` | Übersicht der Tastenkürzel (Einzeltaste) |

---

## 2. Screen-Spezifikationen

### 2.0 Raster und gemeinsame Regeln

Jeder Screen ist nach demselben Raster beschrieben: **ID & Name · Phase · Zweck & Nutzerfragen · Inhalte/Daten (mit Erklär-Karte) · Aktionen · Zustände · Layout D/T/M · Tastatur & A11y · Microcopy · Akzeptanzkriterien.** Die 15 Kern-Screens (2.1) sind ausführlich, die übrigen (2.2) kompakt.

Für **alle** Screens gilt, ohne dass es je Screen wiederholt wird:

- **G1 Kennzahlen:** Jede Zahl ist eine `Kennzahl`-Komponente (K-04) mit Einheit, Zeitbezug, Status-Flag und Erklär-Karte. Klick, Tap oder Enter öffnet O-01.
- **G2 Zustände:** Jeder Screen definiert *Erstnutzung/leer* (K-18 mit nächstem Schritt), *Rechnen* (Skelett nach 300 ms, nie Layoutsprung), *Fehler* (Inline-Banner mit Lösung, nie Toast) und die Unterschiede *Lernmodus* vs. *Profi*.
- **G3 Rechnen im Hintergrund:** Berechnungen laufen im Web Worker. Eingabefelder behalten Fokus und Cursor; Ergebnisse aktualisieren sich daneben. Die Simulation läuft nie, während ein Screen offen bearbeitet wird (Audit 5).
- **G4 Responsiv:** Jeder Screen ist in allen vier Fensterklassen spielbar (Definition of Done, Kap. 7.1). Keine abgeschnittenen Reiter (Audit 5.4), kein horizontales Scrollen der Seite bei 320 px (Tabellen dürfen in sich scrollen, mit sichtbarem Hinweis).
- **G5 Fehlerbehandlung:** Kein `alert()`/`confirm()` (Audit 5.4/5.5). Validierung inline am Feld, Zusammenfassung oben bei Formularen mit Sprunglinks.
- **G6 Links zur Ursache:** Jede Warnung, jedes Delta und jeder Status verlinkt auf die Stelle, an der man etwas tun kann.
- **G7 Vereinfachte Anzeige:** Ist ein System im Lernpfad noch nicht eingeführt, zeigt der Screen den Wert mit Flag „Vereinfachung“ und dem Satz „wird in Szenario n erklärt“. Der Wert ist trotzdem korrekt gerechnet.

### 2.1 Kern-Screens (ausführlich)

---

#### S-02 Spielstart-Assistent · [P3]

**Zweck & Nutzerfragen:** „Womit fange ich an, wie viel Geld und Bonität habe ich, was ist mein Ziel?“ In unter 2 Minuten zu einem spielbaren Start, ohne Registrierung (Gradual Engagement). Gleichzeitig erster Lernmoment: Die Spielerin sieht schon hier, wie eine Bank ihr Profil grob einschätzt.

**Inhalte/Daten (3 Schritte, Fortschritt „Schritt 2 von 3“):**

| Schritt | Inhalt | Vorbelegung | Erklär-Karten |
|---|---|---|---|
| **1 Modus** | Karten: *Lernpfad: Die erste Wohnung* (empfohlen, ca. 20 Min.) · *Freies Spiel* (Start Nov. 2026 mit echten Marktwerten, Zukunft simuliert) · *Historisches Szenario* [P6] · *Challenge* [P6]. Je Karte: Dauer, was man lernt, Hilfestufe-Empfehlung | Lernpfad, wenn kein Spielstand existiert; sonst Freies Spiel | – |
| **2 Startprofil** | Vorlagen-Personas (Karten mit Kernzahlen) **oder** „Eigene Angaben“: Nettoeinkommen/Monat, Einmalzahlungen/Jahr, Beschäftigung, Haushaltsgröße, Wohnkosten, sonstige Raten, Eigenkapital (Giro/Tagesgeld/Depot), Wohnort/Region (Gemeindesuche), Grenzsteuersatz (aus Einkommen abgeleitet, änderbar im Korridor) | Persona „Einsteiger 2026“ (Recherche 14, P6) | `EK:profil.grenzsteuersatz`, `EK:bank.kreditrahmenSchaetzung`, `EK:profil.sparrate` |
| **3 Ziel & Hilfe** | Ziel-Vorlagen („Erste Wohnung, die sich selbst trägt“, „1.000 €/Monat Cashflow vor Steuern bis 2036“, „Nettovermögen 300.000 €“) oder eigenes Ziel; optional ein Lernziel. Hilfestufe (Lernmodus/Standard/Profi, Vergleichstabelle aus 0.5 aufklappbar). Marktschwierigkeit getrennt. Unter „Erweitert“: Startwert (Seed), Startdatum (nur Szenarien) | Ziel passend zum Modus; Hilfestufe Lernmodus bei Lernpfad | `EK:ziel.prognose` |

**Live-Seitenpanel „So sieht dich eine Bank“** (ab Schritt 2, Desktop rechts, mobil als einklappbare Leiste unten): Haushaltsüberschuss nach Bankansatz, grobe Kreditrahmen-Bandbreite („ungefähr 160.000–210.000 € Darlehen“), Liquiditätsreserve nach typischem Kauf, Hinweise („Probezeit: viele Banken finanzieren erst nach Ende der Probezeit“). Alles als Bandbreite mit Flag „abgeleitet“ bzw. „Vereinfachung“.

**Aktionen:** Primär je Schritt „Weiter“, im letzten Schritt **„Spiel starten – November 2026“** (bzw. Szenariodatum). Sekundär „Zurück“ (ohne Datenverlust), „Mit Standardwerten starten“ (ab Schritt 1 sichtbar, springt zur Zusammenfassung). Persona-Karte „Anpassen“ übernimmt deren Werte in die eigenen Angaben.

**Zustände:**
- *Erstnutzung:* vor Schritt 1 einmalig der Start-Disclaimer (Kap. 5.4) als ruhige Karte mit „Verstanden, los geht’s“.
- *Rechnen:* Bankschätzung aktualisiert sich nach Feldverlassen; während der Rechnung bleibt der alte Wert grau mit „wird berechnet“.
- *Fehler:* Feldvalidierung („Bitte ein Nettoeinkommen wie 2.850 eingeben“); unplausible Kombination als Hinweis, nicht als Sperre („Eigenkapital unter 5.000 €: Kaufnebenkosten wirst du kaum decken können. Du kannst trotzdem starten.“).
- *Lernmodus vs. Profi:* Profi sieht alle Felder direkt; Lernmodus zeigt Persona-Auswahl zuerst und eigene Angaben hinter „Eigene Zahlen eingeben“.

**Layout:**
```
Desktop/Tablet quer                                         Mobil
┌───────────────────────────────────────┬────────────────┐  ┌──────────────────────┐
│ Neues Spiel            Schritt 2 von 3│ So sieht dich  │  │ ‹ Neues Spiel   2/3  │
│ ○ Einsteiger 2026  ● Angestellte+Partner│ eine Bank     │  │ Persona-Karten (wisch)│
│ ○ Eigene Zahlen                       │ Überschuss     │  │ …                    │
│ Netto/Monat [ 2.850 €]  Beschäftigung ▾│  +640 €/Monat  │  │ Netto/Monat [2.850 €]│
│ Eigenkapital [48.000 €] Region [Leipzig…]│ Rahmen grob  │  ├──────────────────────┤
│ …                                     │ 160–210 Tsd. € │  │ Bank: Rahmen ~160–210│
│                 [Zurück] [Weiter ▸]   │ (abgeleitet)   │  │ [Zurück]   [Weiter ▸]│
└───────────────────────────────────────┴────────────────┘  └──────────────────────┘
```

**Tastatur & A11y:** Schritte als `<form>` je Schritt; Fortschritt als Text („Schritt 2 von 3: Startprofil“) und `aria-current="step"`. Persona-Auswahl als Radiogruppe (Pfeiltasten). Regionssuche als Combobox (APG). Bankpanel als `region` mit Überschrift, Aktualisierung nur bei Feldverlassen per höflicher Live-Region („Kreditrahmen jetzt etwa 160.000 bis 210.000 Euro“). Bereits eingegebene Werte werden beim Zurückgehen nie verworfen (WCAG 3.3.7).

**Microcopy:**
- Untertitel Schritt 2: „Mit welchem Leben startest du? Die Zahlen bestimmen, was dir eine Bank zutraut.“
- Hinweis Grenzsteuersatz: „Vereinfachung: ohne Soli und Kirchensteuer.“
- Persona-Karte: „Einsteiger 2026 · 2.850 € netto · 48.000 € Eigenkapital · Leipzig · angestellt, unbefristet“

**Akzeptanzkriterien:**
- AK-S02-1: Mit Standardwerten ist ein Spiel in ≤ 3 Aktivierungen und < 30 s gestartet; mit eigenen Angaben in < 2 Min. (Usability-Test, Median).
- AK-S02-2: Zurück/Vorwärts zwischen Schritten verliert keine Eingabe; Neuladen der Seite stellt den Assistenten-Entwurf wieder her.
- AK-S02-3: Die Bankschätzung ist eine Bandbreite, trägt Flag und Erklär-Karte und ändert sich nachvollziehbar bei Einkommen, Raten und Beschäftigung.
- AK-S02-4: Keine Registrierung, keine Pflichtfelder außer Modus; alle Felder haben sichtbare Beschriftungen.
- AK-S02-5: Vollständig per Tastatur bedienbar; axe ohne Verstöße der Stufe „serious“ oder „critical“.

---

#### S-06 Cockpit · [P3]

**Zweck & Nutzerfragen:** Lage auf einen Blick. „Wie viel bin ich wert? Reicht mein Geld? Was bringt mir der Bestand pro Monat? Was muss ich jetzt entscheiden? Was kommt demnächst? Komme ich meinem Ziel näher?“ Das Cockpit ist bewusst schlank und zieht den Posteingang hinein.

**Inhalte/Daten:**

| Block | Inhalt | Erklär-Karte / Hinweise |
|---|---|---|
| **KPI-Reihe** (5 Kacheln, K-03) | **Nettovermögen** (Marktwerte − Restschulden + Liquidität, Stichtag Monatsende) · **Liquidität** mit **Reichweite in Monaten** und Bullet Graph zur Reserve-Schwelle · **Netto-Cashflow/Monat nach Steuern** (laufender Monat + Sparkline 12 Monate + „Ø 12 Monate“) · **Beleihungsquote Portfolio** (Restschuld/Marktwert, Markierung bei 80 %) · **Leerstand** (Einheiten leer / gesamt, Mietausfall €/Monat) | `EK:vermoegen.netto`, `EK:liq.reichweite`, `EK:cf.nachSteuern`, `EK:bank.beleihungPortfolio`, `EK:bestand.leerstand` |
| **Zu entscheiden** | Top 3 offene Entscheidungen aus dem Posteingang (K-15, kompakt), sortiert nach Frist, Link „Alle 5 im Posteingang“ | Fristen-Badge (K-08) |
| **Laufende Vorgänge** | Mini-Tracker für Käufe, Finanzierungsanfragen, Sanierungen, Vermietungen (Schritt n von m, nächster Meilenstein, erwarteter Monat) | Link auf S-19/S-24/S-23 |
| **Demnächst** | Zeitachse der nächsten 6 Monate: bekannte Zahlungen und Fristen (Nebenkostenabrechnung, Zinsbindungsende, Steuererstattung, Sperrfrist Mieterhöhung endet) | Link „Kalender“ (S-40) |
| **Ziel-Fortschritt** | aktuelles Ziel mit Ist, Prognose-Band und Satz („Bei unveränderter Strategie erreichst du das Ziel voraussichtlich 2037–2040.“) | `EK:ziel.prognose` |
| **Marktlage** | Bauzins 10 J. (Spielwelt), Trend 3 Monate, Preis- und Mietindex der Hauptregion(en) | `EK:markt.zins10`, `EK:markt.preisindex` (Audit 5.1: Zins und Marktlage waren nur Debug-Infos) |
| **Mentor-Hinweis** | höchstens einer, nur nach Hilfestufe (K-26) | „Warum zeigst du mir das?“ |

KPI-Auswahl ist im Profi-Modus anpassbar (max. 8 Kacheln, z. B. zusätzlich „Kreditrahmen frei“, „EK-Rendite“, „Bruttomietrendite Bestand“). Die Bewertung (solide/beobachten/kritisch) richtet sich nach *gut/schlecht*, nicht nach dem Vorzeichen.

**Aktionen:** Primär hängt vom Zustand ab: „2 Entscheidungen ansehen“ (wenn offen) – sonst ist die Zeitleiste die Primäraktion. Sekundär: Kachel-Klick (Erklär-Karte), „Zum Posteingang“, „Kalender“, „Ziel ändern“, „Kacheln anpassen“ (Profi).

**Zustände:**
- *Spielbeginn ohne Objekt:* Nettovermögen = Eigenkapital; Cashflow-Kachel zeigt „noch kein Objekt“ statt 0 €; Leerstand-Kachel wird durch **„Erster Schritt“** ersetzt: „Lege einen Suchauftrag an oder sieh dir die drei Angebote aus deiner Region an.“ (Audit 5.2: erste Minute bestand aus Warten.)
- *Lernmodus:* oben eine Auftragskarte des Szenarios („Aufgabe 2 von 5: Prüfe das zweite Angebot mit dem Kalkulator.“) mit Fortschritt.
- *Krise:* Liquiditätskachel „kritisch“, Banner oben mit Link in den Krisen-Flow (O-08). Banner ist nicht wegklickbar, solange der Zustand anhält, aber einklappbar.
- *Rechnen:* nach „Weiter“ aktualisieren sich Werte einmal; Deltas werden für einen Monat als „ggü. Vormonat“ angezeigt.

**Layout:**
```
Desktop ≥ 1200 px (12-Spalten-Raster, ohne Scrollen bei 1280×800 bis einschließlich Zeile 2)
┌Nettovermögen──────┬Liquidität──────────┬Netto-CF/Monat n.St.┬Beleihung Portfolio┬Leerstand─────────┐
│ 84.200 €          │ 12.400 €           │ +318 €             │ 71 %              │ 0 von 3 Einh.    │
│ ▲ +1.240 € ggü. VM│ reicht 5,2 Monate  │ ▲ +120 € ggü. VM   │ ▼ −0,4 Pp.        │ ✓ solide         │
│ ⌁ Sparkline       │ ✓ solide ▕██████▏| │ Ø 12 M: +205 €     │ Ziel < 80 % ✓     │                  │
├───────────────────┴────────────────────┴──────────┬─────────┴───────────────────┴──────────────────┤
│ Zu entscheiden (2)                                │ Demnächst                                      │
│ ! Bank: Anschlussangebot · Frist Feb. 2027 ›      │ Dez. 26  Hausgeld-Abrechnung WEG               │
│ ! Mieter EG links kündigt · Frist Jan. 2027 ›     │ Mär. 27  Nebenkostenabrechnung fällig          │
│ Laufende Vorgänge                                 │ Mai 27   Steuererstattung (geschätzt 1.100 €)   │
│ Kauf ETW Leipzig ▕██░░░░▏ Notartermin ~Jan. 2027  │ Feb. 27  Zinsbindung endet · Darlehen D2        │
├───────────────────────────────────────────────────┼────────────────────────────────────────────────┤
│ Ziel: 1.000 €/Monat CF v. St. bis 2036  ▕███░░░░▏ │ Marktlage: Bauzins 10 J. 3,94 % ▲ · Index …     │
└───────────────────────────────────────────────────┴────────────────────────────────────────────────┘
Tablet: KPI-Reihe 3+2, darunter zwei Spalten. Mobil: Skizze in 1.2 / Recherche 21 B4.3 – 3 KPIs sichtbar,
weitere per horizontalem Kachel-Scroll mit Hinweis „+2 weitere“, danach „Zu entscheiden“, „Demnächst“.
```

**Tastatur & A11y:** Überschriftenhierarchie: h1 „Cockpit“, h2 je Block. KPI-Kacheln sind Buttons mit vollständigem Namen in ganzen Sätzen („Netto-Cashflow nach Steuern im November 2026: plus 318 Euro pro Monat, 120 Euro mehr als im Vormonat, Bewertung solide. Erklärung öffnen.“). Sparklines `aria-hidden`, ihre Aussage steht im Namen („steigend seit 4 Monaten“). Reihenfolge im DOM = visuelle Reihenfolge.

**Microcopy:** Leer „Zu entscheiden“: „Nichts offen. Du kannst den Monat abschließen.“ · Reichweite: „reicht 5,2 Monate“ · Beleihung: „Ziel unter 80 %“.

**Akzeptanzkriterien:**
- AK-S06-1: Bei 1280×800 sind KPI-Reihe, „Zu entscheiden“ und „Demnächst“ ohne Scrollen sichtbar; bei 390×844 sind mindestens 3 KPIs und die erste offene Entscheidung über der Zeitleiste sichtbar.
- AK-S06-2: Jede Kachel öffnet per Klick, Tap und Enter ihre Erklär-Karte; die Summe der Herleitung entspricht dem angezeigten Wert (Test gegen Rechenkern).
- AK-S06-3: Eine steigende Beleihungsquote wird nie als „gut“ eingefärbt; jede Bewertung hat Icon + Text.
- AK-S06-4: Im Spiel ohne Objekt zeigt das Cockpit einen konkreten nächsten Schritt und keine 0-€-Kacheln ohne Kontext.
- AK-S06-5: Nach „Weiter“ zeigen alle KPIs ein Delta „ggü. Vormonat“ mit Vorzeichen, Pfeil und Text.

---
#### S-07 Monatsbericht („Was ist passiert?“) · [P3]

**Zweck & Nutzerfragen:** Nach „Weiter“: „Was hat sich verändert und warum? Muss ich auf etwas reagieren?“ Ersetzt 30 Einzelmeldungen durch einen gebündelten Bericht. Im Archiv jederzeit wieder abrufbar.

**Inhalte/Daten:**
1. **Kopfsatz** in Alltagssprache: „Dezember 2026: Deine Liquidität ist um 412 € auf 12.812 € gestiegen. 1 Ereignis braucht deine Entscheidung.“
2. **Kontobewegung als Mini-Wasserfall** (K-13): Anfangsstand → + Mieten (Ist) → − Hausgeld/Betriebskosten → − Zinsen → − Tilgung → ± Sparrate aus Gehalt → ± Einmaliges → = Endstand. Umschalter „Diagramm | Tabelle“. Invariante: Summe der Posten = Δ Liquidität (`EK:liq.monatsbewegung`).
3. **Veränderungen der Kernkennzahlen:** Tabelle Wert · Δ ggü. Vormonat · Grund (Link). Nur Zeilen mit Änderung, Rest unter „unverändert (4)“.
4. **Ereignisse**, gebündelt und priorisiert: *Auffälliges* zuerst (Mietrückstand, Schaden, Kündigung, Bankschreiben) mit Kurzbeschreibung und Link; *Routine* zusammengefasst („3 Mieten pünktlich eingegangen · 2 Abbuchungen Hausgeld“, aufklappbar).
5. **Fortschritt laufender Vorgänge:** „Kauf ETW Leipzig: Notartermin für Jan. 2027 bestätigt.“
6. **Demnächst** (nächste 3 Monate).
7. **Lernmoment** (nur Lernmodus, max. 1): eine Reflexionsfrage oder ein Satz Ursache-Wirkung („Die Tilgung senkt deine Liquidität, erhöht aber dein Vermögen um 214 €.“).

**Sammelbericht** bei „Weiter bis Ereignis“: Kopf „4 Monate simuliert (Dez. 2026 – Mär. 2027). Gestoppt, weil: Ein neues Angebot passt zu deinem Suchauftrag.“ Darunter Summen über den Zeitraum und je Monat aufklappbare Abschnitte.

**Aktionen:** Primär kontextabhängig: **„Zur Entscheidung (1)“** oder **„Weiter zu Januar 2027“**. Sekundär: „Kontoauszug ansehen“ (S-27), „Zurück zu Exposé“ (zur vorherigen Ansicht), „Bericht-Einstellungen“ (immer/bei Auffälligkeiten/nie).

**Zustände:**
- *Ruhiger Monat* (Einstellung „bei Auffälligkeiten“): kein Bericht, stattdessen Toast „Dezember 2026 abgeschlossen · Liquidität +412 € · Bericht ansehen“.
- *Erster Monat überhaupt:* kurze Erklärung des Aufbaus als Coachmark (Lernmodus).
- *Lernmodus vs. Profi:* Profi sieht Tabelle statt Wasserfall als Standard und keinen Lernmoment.

**Layout:**
```
Desktop (Hauptbereich, vorherige Ansicht per „Zurück“; Zeitleiste bleibt bedienbar)
┌───────────────────────────────────────────────────────────────────────────────────┐
│ Monatsbericht Dezember 2026                         [Diagramm|Tabelle]  Archiv ▾ │
│ Deine Liquidität ist um 412 € auf 12.812 € gestiegen. 1 Ereignis braucht dich.   │
├──────────────────────────────────────────────┬────────────────────────────────────┤
│ Kontobewegung                                │ Auffälliges                        │
│ 12.400 ▕██████████▏ Anfang                   │ ! Heizung EG defekt · 1.840 €      │
│ +1.250 ▕   ███▏ Mieten                       │   Entscheidung bis Jan. 2027 ›     │
│   −410 ▕  ▔▔▏ Hausgeld                       │ Routine                            │
│   −388 ▕  ▔▏ Zinsen   −214 ▕ ▔▏ Tilgung      │ ✓ 3 Mieten pünktlich ›             │
│   +174 ▕ ▔▏ Sparrate ...  = 12.812 Ende      │ Vorgänge                           │
├──────────────────────────────────────────────┤ Kauf Leipzig: Notar Jan. 2027 ✓    │
│ Kennzahlen  Wert      Δ        Grund         │ Demnächst                          │
│ Netto-CF   +318 €    +120 €   Mieterhöhung › │ Mär. 27 NKA-Frist                  │
├──────────────────────────────────────────────┴────────────────────────────────────┤
│                                   [Kontoauszug]   [Zur Entscheidung (1) ▸]        │
└───────────────────────────────────────────────────────────────────────────────────┘
Mobil: eine Spalte in der Reihenfolge Kopfsatz → Auffälliges → Kontobewegung → Kennzahlen → Rest;
Primärknopf als Aktionsleiste über der Zeitleiste.
```

**Tastatur & A11y:** Beim Öffnen nach „Weiter“ Fokus auf die h1; der Kopfsatz wird **einmal** über eine höfliche Live-Region angesagt (keine Ansage-Flut, Audit 5.7). Wasserfall mit Textzusammenfassung und Tabelle (K-13). Ereignisgruppen als `<details>`.

**Microcopy:** Kopfsatz-Muster: „{Monat}: Deine Liquidität ist um {Δ} auf {Wert} {gestiegen|gesunken}. {n} {Ereignis braucht|Ereignisse brauchen} deine Entscheidung.“ · Routine: „Alles nach Plan: 3 Mieten pünktlich, 2 Abbuchungen.“

**Akzeptanzkriterien:**
- AK-S07-1: Summe der Kontobewegungen = Δ Liquidität, sichtbar als Endstand; Test gegen das Buchungsjournal.
- AK-S07-2: Standardmäßig höchstens 7 Ereigniszeilen auf oberster Ebene; Routine ist gebündelt.
- AK-S07-3: Jede Kennzahl-Veränderung hat einen Grund-Link, der zur Ursache führt (Buchung, Ereignis, Entscheidung).
- AK-S07-4: Jeder vergangene Bericht ist über das Archiv (Monatsauswahl) und über S-10 erreichbar.
- AK-S07-5: Screenreader hört nach „Weiter“ genau eine Zusammenfassung.

---

#### S-08 Posteingang · S-09 Nachricht mit Entscheidung · [P3]

**Zweck & Nutzerfragen:** „Was muss ich entscheiden, bis wann, und was passiert, wenn ich nichts tue?“ Die Zentrale des Spiels. Nur Handlungsbedarf zählt im Badge.

**Inhalte/Daten – Liste (S-08):**
- Filter-Reiter: **Zu entscheiden (n)** · Info · Erledigt · Verpasst. Standard: „Zu entscheiden“.
- Kategorie-Chips: Mieter · Bank · Markt · Behörde/Finanzamt · Handwerker · WEG · Verwaltung. Objekt-Filter.
- Gruppierung nach Frist: „Diesen Monat“ · „Nächster Monat“ · „Später“. Sortierung umschaltbar (Frist, Eingang, Betrag, Objekt).
- Eintrag (K-15): Typ-Icon · Absender mit Rolle · Betreff · **Frist** (K-08) · Objekt · betroffener Betrag (falls vorhanden) · Status (neu/gelesen/vorgemerkt/erledigt/verpasst als Icon + Text).
- **Bündel:** gleichartige Ereignisse als ein Eintrag („3 Mieterhöhungen möglich“, öffnet Sammel-Assistent).

**Inhalte/Daten – Detail (S-09):**
- Kopf: Betreff, Absender, **Interessenhinweis** bei Spielwelt-Figuren („Makler · bekommt Provision, wenn du kaufst“; „Bankberater · verkauft Finanzierungsprodukte“), Eingang, Frist, Objekt-Link.
- Nachricht in der Stimme der Figur (Figuren siezen, siehe Kap. 5.2), Fakten-Box mit Beträgen als Kennzahlen.
- **Entscheidungsdialog** (O-04, Kap. 3.2) eingebettet: Optionen, Vorher/Nachher, Standardfolge, Notiz fürs Tagebuch, konkrete Knöpfe.
- Info-Nachrichten haben stattdessen „Als erledigt markieren“ und ggf. „Zum Objekt“.

**Aktionen:** Primär im Detail: der konkrete Knopf der gewählten Option („Heizung reparieren lassen – 1.840 € (Angebot Firma Krause)“). Sekundär: „Vormerken bis Monatsende“, „Später erinnern“ (nur wenn Frist > aktueller Monat), „Mentor-Check“ (Lernmodus), „Zum Objekt“. Listen-Aktionen: „Alle Infos als gelesen markieren“ (mit Rückgängig). Wischen (mobil) = Abkürzung für „Erledigt“ und „Vormerken“, nie einziger Weg.

**Zustände:**
- *Leer:* „Keine offenen Entscheidungen. Du kannst den Monat abschließen.“ + Hinweis auf Zeitleiste.
- *Verpasst:* Einträge zeigen die eingetretene Standardfolge („Angebot verfallen am 30.11.“) und einen Link „Was ist passiert?“.
- *Vorgemerkt:* Entscheidung gilt erst zum Monatswechsel; Eintrag zeigt „vorgemerkt“ und „Ändern“.
- *Lernmodus:* Mentor-Check-Knopf; im ersten Szenario sind Optionen mit Lernhinweis versehen („Hier lernst du: Instandhaltung vs. Modernisierung“).

**Layout:**
```
Desktop: Liste │ Detail │ (Erklärung bei Bedarf)
┌Posteingang──────────────────────────┬─────────────────────────────────────────────────────┐
│ [Zu entscheiden 2|Info|Erledigt|Verp.]│ Heizung EG defekt                Frist: Jan. 2027 │
│ Mieter Bank Markt Behörde Handw. WEG │ Hausverwaltung Müller · für Wohnung EG, Lindenstr. │
│ ── Diesen Monat ──────────────────── │ „Die Gastherme ist ausgefallen. Der Mieter darf …“ │
│ ▸! Heizung EG defekt   Jan. 27 1.840€│ ┌Option A────────┐┌Option B────────┐┌Option C─────┐ │
│   ! Mieter EG kündigt  Jan. 27       │ │Reparieren      ││Neue Therme     ││Abwarten     │ │
│ ── Später ────────────────────────── │ │1.840 € einmalig││9.600 € einmalig││0 €          │ │
│   Bank: Anschlussangebot  Feb. 27    │ │Risiko: erneut  ││CO₂-Stufe besser││Minderung    │ │
│ ── Bündel ───────────────────────── │ │Ausfall 12 Mon. ││Umlage möglich  ││droht ~15 %  │ │
│   3 Mieterhöhungen möglich      ›    │ └────────────────┘└────────────────┘└─────────────┘ │
│                                      │ Vorher → Nachher: Liquidität 12.812 → 10.972 € …   │
│                                      │ Ohne Entscheidung: Mieter mindert ab Jan. 2027.     │
│                                      │ Erwartung notieren (optional) [__________________] │
│                                      │ [Mentor-Check]  [Heizung reparieren – 1.840 € ▸]   │
└──────────────────────────────────────┴─────────────────────────────────────────────────────┘
Mittel/Kompakt: Liste → Detail per Push; Optionen untereinander; Primärknopf in Aktionsleiste.
```

**Tastatur & A11y:** Liste als `listbox`-ähnliche Liste mit Pfeiltasten bzw. `j/k`, Enter öffnet; im Detail springt `Esc` zurück zur Liste mit Fokus auf dem Eintrag. Frist und Status sind Text, nicht nur Farbe. Badge-Name: „Posteingang, 2 offene Entscheidungen“. Optionen als Radiogruppe, Primärknopf-Beschriftung ändert sich mit der Auswahl (Live-Region nicht nötig, da Fokus auf Option).

**Microcopy:** Standardfolge: „Wenn du bis Ende Januar 2027 nichts tust: Der Mieter darf die Miete mindern (geschätzt 15 %).“ · Leer „Verpasst“: „Noch nichts verpasst.“ · Interessenhinweis: „Hinweis: Makler werden vom Verkauf bezahlt.“

**Akzeptanzkriterien:**
- AK-S08-1: Der Badge zählt ausschließlich Einträge mit Handlungsbedarf; Routinebuchungen erscheinen nie als eigene Nachricht.
- AK-S08-2: Jeder Entscheidungs-Eintrag zeigt Frist und Standardfolge vor dem Öffnen (Liste) bzw. oberhalb der Optionen (Detail).
- AK-S09-1: Primärknöpfe nennen Handlung und Betrag; kein „OK“, „Ja“, „Bestätigen“.
- AK-S09-2: Vorher/Nachher zeigt mindestens Liquidität und den betroffenen Cashflow; unsichere Werte als Bandbreite.
- AK-S09-3: Eine vorgemerkte Entscheidung lässt sich bis „Weiter“ ändern oder zurücknehmen (O-14).
- AK-S08-3: Posteingang mit 200 Einträgen bleibt flüssig (virtualisiert, Scrollen ohne Ruckeln auf Referenz-Tablet).

---
#### S-11 Markt: Angebote als Liste und Karte · [P3 Liste · P2 Karte Länder/Kreise · P7 Gemeinden]

**Zweck & Nutzerfragen:** „Welche Angebote passen zu meiner Strategie und meinem Geld? Wo in Deutschland lohnt sich der Blick? Was davon ist schnell weg?“

**Inhalte/Daten:**
- **Linsen** (Segmente, bestimmen Standardspalten und Karten-Kennzahl):

| Linse | Standardspalten (Desktop) | Mobil-Kartenwerte (3) |
|---|---|---|
| **Cashflow** (Standard) | Objekt (Titel, Gemeinde) · Preis · Kaltmiete Ist/Monat · CF n. Fin./Monat (Schätzung, Bandbreite) · EK-Bedarf (KNK + Puffer) · Finanzierbarkeit · inseriert seit | Preis · CF n. Fin. · EK-Bedarf |
| **Rendite** | Preis · €/m² vs. Gemeinde-Median · Bruttomietrendite · Kaufpreisfaktor · Nettomietrendite (Schätzung) | Bruttorendite · Faktor · €/m² |
| **Lage** | Gemeinde · Kreis · Lageklasse · Mietniveau €/m² · Leerstandsquote · Bevölkerungstrend · Mietpreisbremse/Kappung | Mietniveau · Leerstand · Trend |
| **Risiko** | Baujahr · Energieklasse · Zustand (bekannt/unbekannt) · offene Prüfpunkte · Risiko-Indikator · WEG-Rücklage bekannt? | Risiko · Baujahr · offene Prüfpunkte |

- **Finanzierbarkeit (Schätzung)** statt pauschal „Nicht genug Kapital“ (Audit 5.2: alle Angebote rot): drei Stufen mit Icon + Text – „passt“ · „knapp“ · „derzeit außer Reichweite“ – mit Begründung in der Erklär-Karte („EK-Bedarf 23.400 € vs. verfügbar 18.000 €“) und Hinweis, was helfen würde.
- **Angebotsdynamik:** „inseriert vor 3 Wochen“, „Interesse: hoch“ (Icon + Text), „voraussichtlich noch 2–4 Wochen verfügbar“ als Bandbreite, nie als Countdown.
- **Karte (Choropleth, K-13):** Länder ↔ Kreise; Kennzahl wählbar (Kaufpreisfaktor, Mietniveau, Leerstand, Angebotsanzahl, Bevölkerungstrend). Sequenzielle Ein-Farbton-Skala, Legende mit Klassen, Flag-Muster (Schraffur) für geschätzte Werte. Klick auf Kreis filtert die Liste und bietet „Regionen-Profil öffnen“ (S-38). Gemeinde-Ebene erst mit MapLibre [P7].
- **Filter** (K-10): Region (Land/Kreis/Gemeinde-Suche, Umkreis), Objektart, Preis, Wohnfläche, Zimmer, Baujahr, Bruttorendite min., Faktor max., vermietet/leer, provisionsfrei, nur „passt/knapp“. Filter-Chips zeigen aktive Filter; „Alle zurücksetzen“.
- **Gespeicherte Ansichten** (Linse + Filter + Spalten + Sortierung), z. B. „Leipzig Cashflow“. „Als Suchauftrag speichern“ (S-12).

**Aktionen:** Zeile anklicken = Exposé im Detail-Pane (S-13). Inline: Merken (Stern), Vergleichen (Checkbox → Vergleichsleiste unten „2 von 4 ausgewählt · Vergleichen“). Primär auf der Seite: keine; der Pfad geht über das Exposé. Sekundär: „Als Suchauftrag speichern“, „Ansicht speichern“, „Spalten“, „Karte ⇄ Liste“.

**Zustände:**
- *Keine Treffer:* „Keine Angebote mit diesen Filtern. Am meisten schließt ‚Bruttorendite ab 6 %‘ aus (41 Angebote). [Filter lockern]“.
- *Spielstart:* Liste vorsortiert nach Hauptregion und Finanzierbarkeit; im Lernpfad nur die drei Szenario-Angebote plus Hinweis „Weitere Angebote erscheinen nach Aufgabe 3“.
- *Rechnen:* Schätzspalten (CF, Finanzierbarkeit) zeigen Skelett, Basisdaten sofort.
- *Profi:* kompakte Zeilen (32 px), mehr Spalten, Tastaturnavigation im Grid.
- *Lernmodus:* Linse „Cashflow“ fest, Spalten reduziert auf 5; Erklär-Hinweis auf „Bruttomietrendite“.

**Layout:**
```
Desktop ≥ 1200 px
┌Filter ▾  Linse: [Cashflow|Rendite|Lage|Risiko]  Sortierung: CF ▾   Ansicht: [Liste|Karte]  Ansichten ▾ ┐
│ Chips: Leipzig ✕  ETW ✕  bis 200.000 € ✕   [Alle zurücksetzen]                     83 Angebote │
├──────────────────────────────────────────────┬───────────────────────────────┬──────────────────┤
│ ☆ □ Objekt            Preis    CF/Mon. Fin.bar│ Exposé (S-13)                 │ Erklärung        │
│ ☆ □ 2-Zi-ETW Gohlis  139.000  +40…+110 ✓ passt│                               │ (angeheftet)     │
│ ★ □ 3-Zi-ETW Lindenau 189.000 −60…+20 ◐ knapp │                               │                  │
│ …  (virtualisiert, tnum, rechtsbündig)        │                               │                  │
├──────────────────────────────────────────────┴───────────────────────────────┴──────────────────┤
│ Vergleich: 2 von 4 ausgewählt   [Auswahl leeren]  [Vergleichen ▸]                                │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
Kartenansicht: Karte ersetzt die Liste (Liste als schmale Spalte rechts mit Treffern der Region).
Mobil: Chips + „Filter (3)“ öffnet O-13 als Bottom Sheet; Karten-Liste (K-29) mit 3 Linsenwerten;
erste Angebotskarte beginnt oberhalb der Falz (Audit 5.2).
```

**Tastatur & A11y:** Tabelle als ARIA-Grid (Pfeiltasten, Pos1/Ende, Enter öffnet Exposé, Leertaste wählt für Vergleich); Sortierknöpfe mit `aria-sort` (Audit 5.2: Sortierbutton ohne Zustand). Filteränderungen aktualisieren die Trefferzahl über eine höfliche Live-Region („83 Angebote“), entprellt. Karte: jede Region per Tastatur erreichbar über die Tabelle „Regionen als Tabelle“; Kartenklick ist nie der einzige Weg.

**Microcopy:** Spaltenkopf „CF/Monat (Schätzung)“ · Finanzierbarkeit „knapp: es fehlen etwa 5.400 € Eigenkapital“ · Leere Merkliste-Spalte: „Merken“.

**Akzeptanzkriterien:**
- AK-S11-1: Beim Spielstart sind mindestens drei Angebote als „passt“ oder „knapp“ sichtbar, sofern das Profil überhaupt eine Finanzierung zulässt; andernfalls erklärt ein Banner, warum, und was zu tun ist.
- AK-S11-2: Linse, Filter, Sortierung und Ansicht stehen in der URL; Zurück-Navigation aus dem Exposé stellt Scrollposition und Fokus wieder her.
- AK-S11-3: 5.000 Angebote sortieren/filtern in < 100 ms auf dem Referenz-Notebook; Scrollen virtualisiert ohne Ruckeln.
- AK-S11-4: Jede Schätzspalte trägt Flag „geschätzt“/„abgeleitet“ und zeigt Bandbreiten statt Scheingenauigkeit.
- AK-S11-5: Karte hat Legende, Stand/Quelle der Kennzahl, Tabellen-Fallback und funktioniert offline.

---

#### S-13 Exposé-Detail · [P3]

**Zweck & Nutzerfragen:** „Was verspricht der Verkäufer, was davon ist geprüft, was ist unbekannt? Lohnt sich der nächste (kostenpflichtige) Prüfschritt?“ Das Exposé lehrt den Unterschied zwischen **Parteivortrag** und **geprüfter Tatsache**.

**Inhalte/Daten:**
- **Kopf:** Titel, Gemeinde (Link S-38), Objektart, Preis, Wohnfläche, Zimmer, Baujahr, Pipeline-Status (Sichtung → Vorprüfung → Besichtigung → Detailprüfung → Finanzierung → Beurkundung) als kleiner Stepper, Angebotsdynamik, Merken/Vergleichen.
- **Reiter:**

| Reiter | Inhalt |
|---|---|
| **Überblick** | Eckdaten-Tabelle mit Spalten *laut Exposé* · *geprüft* · *Abweichung* (z. B. Wohnfläche 68 m² → 64,3 m² WoFlV, −5,4 %); Maklertext mit **Exposé-Decoder** (Phrasen wie „solide vermietet“, „gepflegt“, „saniert“ unterstrichen → Prüffrage im Popover); schematischer Grundriss [P7] |
| **Lage & Region** | Gemeinde-/Kreiskennzahlen (Mietniveau, Kaufpreisniveau, Leerstand, Bevölkerungstrend, Kaufkraft) **mit Flag, Quelle und Stand**; Rechtsraum-Leiste „Objekt → Gemeinde → Land → Bund“ (Mietpreisbremse, Kappungsgrenze, Grunderwerbsteuersatz); Mikrolage „unbekannt – Standorttour möglich“ |
| **Zahlen** | Schnellkalkulation: Bierdeckel 1 (Ist-Miete) und 2 (erzielbare Miete + Renovierung), €/m², Faktor, Kaufnebenkosten nach Bundesland (aufgeschlüsselt), EK-Bedarf inkl. Puffer, CF-Schätzung als Bandbreite; „Im Kalkulator öffnen“ |
| **Unterlagen & Prüfung** | Checkliste nach Aufdeckungsmatrix (Recherche 13, 3.4 und 4.1): je Punkt Status (nicht angefordert / angefordert / erhalten / geprüft), Quelle (Verkäufer = Parteivortrag · Amt · Notar · Gutachter), Kosten, Dauer, Befund. Aktionen: „Unterlagen beim Makler anfordern“, „Besichtigung vereinbaren“, „Standorttour“, „Gutachter beauftragen“, „Grundbuchauszug anfordern“ |
| **Risiken** | Liste bekannter, vermuteter und **unbekannter** Risiken mit Schwere (Risiko-Indikator K-07) und Herkunft; „Unbekannt ist auch ein Risiko“-Abschnitt aus offenen Prüfpunkten |
| **Verlauf & Notizen** | Pipeline-Entscheidungen mit Datum, Gebote, Notizen, Tagebuch-Einträge; „Begründete Absage“ als Aktion |

**Aktionen:** Primär (kontextabhängig, max. eine): **„Kalkulieren“** (vor Prüfung) → **„Finanzierung anfragen“** (nach Kalkulation) → **„Gebot abgeben“** (nach Zusage oder bewusst ohne). Sekundär: Prüfaktionen (mit Kosten und Dauer im Knopf: „Gutachter beauftragen – 650 €, ca. 1 Monat“), Merken, Vergleichen, „Absagen und begründen“.

**Zustände:**
- *Neu gesehen:* Überblick aktiv, Prüf-Checkliste zeigt „0 von 14 geprüft“, Risiko-Bereich listet die offenen Prüfpunkte.
- *Prüfung läuft:* Punkte mit „angefordert · erwartet Jan. 2027“; Fortschritt im Kopf.
- *Angebot verloren/zurückgezogen:* Banner „Ein anderer Käufer hat den Zuschlag bekommen“ mit Lernlink; Daten bleiben lesbar (Audit 5.4: „Objekt nicht gefunden“).
- *Lernmodus:* Musterprüfung beim ersten Angebot (Kap. 3.11), Coachmark auf „laut Exposé/geprüft“.
- *Profi:* alle Reiter, kompakte Tabellen, Prüfaktionen als Mehrfachauswahl („3 Unterlagen anfordern“).

**Layout:**
```
Mobil (Push aus der Liste)
┌──────────────────────────────┐
│ ‹ Angebote          ☆  ⋯     │
│ 3-Zi-ETW · Leipzig-Lindenau  │
│ 189.000 € · 72 m² · Bj. 1928 │
│ Sichtung ● ○ ○ ○ ○ ○         │
│ inseriert vor 3 Wo. · hoch   │
│ [Überblick|Lage|Zahlen|Prüf›]│ ← scrollbare Reiter mit Überlauf-Schatten
│ Eckdaten   Exposé   geprüft  │
│ Fläche     72 m²    —        │
│ Kaltmiete  690 €    —        │
│ Zustand  „gepflegt“ unbekannt│
│ …                            │
├──────────────────────────────┤
│ [Kalkulieren] [Finanz. anfr.]│ ← Aktionsleiste
├──────────────────────────────┤
│ Nov. 2026 · 2 offen [Weiter▸]│
└──────────────────────────────┘
Desktop: Detail-Pane in S-11 oder eigene Seite; Reiter horizontal; Erklär-Pane rechts.
```

**Tastatur & A11y:** Reiter nach APG (Pfeiltasten, `aria-controls` auf existierende Panels, Audit 5.4). Vergleichstabelle „laut Exposé/geprüft“ als echte `<table>` mit Spaltenköpfen. Exposé-Decoder-Markierungen sind Buttons (fokussierbar), nicht nur Unterstreichung.

**Microcopy:** Spaltenköpfe „laut Exposé“ · „geprüft“ · Decoder-Popover zu „solide vermietet“: „Kann heißen: Miete deutlich unter Markt. Prüfe den Mietvertrag und die Mieterhöhungshistorie.“ · Unbekannt: „unbekannt – prüfen mit: Unterlagen (Protokolle WEG)“.

**Akzeptanzkriterien:**
- AK-S13-1: Jedes verdeckte Merkmal ist als „unbekannt“ mit dem aufdeckenden Prüfschritt sichtbar; nichts Unbekanntes wird leer oder als 0 angezeigt.
- AK-S13-2: Nach Aufdeckung stehen Exposé-Wert und geprüfter Wert nebeneinander mit Abweichung.
- AK-S13-3: Jede Prüfaktion nennt Kosten und Dauer im Knopf und erscheint nach Ausführung im Tracker/Verlauf.
- AK-S13-4: Reiter sind auf 360 px Breite alle erreichbar (scrollbar mit sichtbarem Überlauf oder „Mehr“-Menü).
- AK-S13-5: Regionalkennzahlen zeigen Flag, Quelle und Stand; geschätzte Werte sind inline markiert.

---
#### S-14 Investitionsrechner / Kalkulator · [P3 Grundfunktionen · P5 vollständig]

**Zweck & Nutzerfragen:** „Trägt sich das Objekt? Was bleibt mir pro Monat vor und nach Steuern? Wie viel Eigenkapital brauche ich? Welche Annahme entscheidet über Erfolg oder Misserfolg? Was darf ich höchstens zahlen?“ Das wichtigste Lernwerkzeug (Audit 7: Live-Kaufdialog war das stärkste Element des Prototyps) – jetzt mit deutschem Finanzierungsmodell und Steuerstufe.

**Inhalte/Daten:**

*Annahmen-Leiste (K-12), gruppiert, jede Annahme als NumberField + Slider + Basiswert-Markierung + Flag:*

| Gruppe | Annahmen (Vorbelegung) |
|---|---|
| Kauf | Kaufpreis (Angebot) · Kaufnebenkosten je Bundesland: GrESt, Notar/Grundbuch, Makler (aufklappbar) · Anfangsrenovierung · Inventar separat |
| Miete | Ist-Kaltmiete · erzielbare Kaltmiete (Schätzung aus Region, Flag „geschätzt“) · Mietausfall-Reserve % · Mietentwicklung p. a. (Standard 0 %) |
| Kosten | nicht umlagefähiges Hausgeld/Bewirtschaftung · Verwaltung · Instandhaltungsreserve €/m²·Jahr (nach Baujahr) |
| Finanzierung | Eigenkapital-Einsatz · Darlehen (abgeleitet) · Sollzins (aktuelle Spielwelt-Kondition, Flag) · Zinsbindung · anfängliche Tilgung · Sondertilgung p. a. · Anschlusszins-Szenario |
| Steuer | Grenzsteuersatz (Profil) · Gebäudeanteil (Kaufpreisaufteilung) · AfA-Satz (automatisch nach Baujahr, änderbar nur mit Begründung „Gutachten“) |
| Wert & Horizont | Wertentwicklung p. a. (Standard **0 %**, Hinweis „nicht einplanen“) · Betrachtungshorizont 10/20/30 Jahre |

*Live-Ergebnis (sticky, K-04):* Bruttomietrendite · Kaufpreisfaktor · Nettomietrendite · **EK-Bedarf gesamt** (KNK + Renovierung + Puffer) · **Rate/Monat** · **Cashflow-Kaskade**: operativ → nach Finanzierung → nach Rücklagen → nach Steuern (Umschalter **Monat | Jahr**, nie gemischt) · „selbst abzahlend?“ (Ja/Nein + Bedingung) · Restschuld bei Zinsbindungsende · **Break-even-Anschlusszins** · Bank-Schnellcheck (Beleihungsauslauf, Haushaltsüberschuss zum Prüfzins).

*Analyse-Bereich (Reiter):*
1. **Wasserfall** Cashflow (K-13): Kaltmiete → − nicht umlagefähige Kosten → − Rücklagen → − Zinsen → = CF vor Tilgung → − Tilgung → = CF vor Steuern → ± Steuer → = Netto. Umschalter Monat/Jahr, Jahr 1 / Jahr n.
2. **Zeitreihe** über den Horizont: Restschuld, Marktwert (Band), Eigenkapital im Objekt, kumulierter Cashflow; Markierung Zinsbindungsende und Spekulationsfrist.
3. **Tornado** (Sensitivität, K-13): jede Annahme ±Bandbreite, sortiert nach Wirkung auf die gewählte Zielgröße (Standard: CF nach Steuern Jahr 1).
4. **Szenarien A/B/C:** speichern und nebeneinander vergleichen (Tabelle + Differenzen), Stresstest-Voreinstellungen: „Anschlusszins +2 Pp.“, „6 Monate Leerstand“, „Sonderumlage 5.000 €“, „Wert −15 %“.
5. **Bankrechnung vs. deine Rechnung:** zwei Spalten (Mietanrechnung 60–80 %, Prüfzins, Lebenshaltungspauschale vs. eigene Werte).
6. **EK-Renditen** in vier Varianten mit ausgewiesenem Zähler (nur Cashflow · + Tilgung · nach Steuern · inkl. Wertänderung, „unrealisiert“).
7. **Rückwärtsrechnung:** „Höchstkaufpreis für Ziel: CF nach Finanzierung ≥ 0 €/Monat → 172.400 €“ (Zielgröße wählbar).

**Aktionen:** Primär: **„Annahmen in Finanzierungsanfrage übernehmen“** (wenn Objekt). Sekundär: „Szenario speichern (A/B/C)“, „Annahme zurücksetzen“ (je Feld) / „Alle auf Basiswerte“, „Stresstest anwenden“, „Als Notiz ins Tagebuch“, „Gebot mit diesem Preis vorbereiten“. Freier Rechner ohne Objekt über Befehlspalette/Akademie.

**Zustände:**
- *Ohne Objekt:* leere Annahmen mit Beispielwerten (Flag „Beispiel“) und Hinweis „Wähle ein Angebot, um echte Werte zu laden“.
- *Rechnen:* jede Eingabe rechnet im Worker (< 50 ms Ziel); Diagramme entprellt (150 ms); Ergebnis-Leiste nie leer.
- *Ungültige Eingabe:* Feld markiert, Ergebnis behält den letzten gültigen Stand mit Hinweis „Ergebnis bezieht sich auf 3,80 % (letzter gültiger Wert)“.
- *Lernmodus (Modell-Progression):* nur Stufe-1-Annahmen offen (Kaltmiete, Zins, Tilgung, Reserve); Kosten und Steuer als „pauschal geschätzt“ (Flag „Vereinfachung“, „wird in Szenario 2/3 erklärt“). Analyse nur Wasserfall.
- *Profi:* alle Gruppen offen, kompakte Felder, Tornado und Szenarien sichtbar, Tastenkürzel für Szenario-Wechsel (`1/2/3`).

**Layout:**
```
Desktop ≥ 1200 px
┌Kalkulation: 3-Zi-ETW Leipzig-Lindenau          Szenario [A|B|C]  Zeitraum [Monat|Jahr]  [Übernehmen ▸]┐
├Ergebnis (sticky) ─────────────────────────────────────────────────────────────────────────────────────┤
│ Brutto 4,4 % · Faktor 22,8 · EK-Bedarf 31.900 € · Rate 812 €/M · CF n.Fin. −64 €/M · CF n.St. +38 €/M │
│ Selbst abzahlend: nein (fehlen 64 €/Monat) · Break-even-Anschlusszins 3,1 % · Beleihungsauslauf 96 %   │
├Annahmen (K-12) ───────────────┬Analyse [Wasserfall|Zeitreihe|Tornado|Szenarien|Bank|EK-Rendite|Max.]──┤
│ ▾ Kauf                        │                                                                       │
│  Kaufpreis [189.000 €] ═══●══ │   Kaltmiete 690 ▕██████████▏                                          │
│  KNK Sachsen 5,5 %+2 %+3,57 % │   − nicht uml. 95 ▕  ▔▔▏ − Rückl. 81 ▕ ▔▏ − Zins 615 ▕▔▔▔▔▔▏ …          │
│ ▾ Miete                       │   = CF n. St. +38 €/Monat                                             │
│  Ist-Miete [690 €]  Basis ◆   │   Textzusammenfassung: „Von 690 € Kaltmiete bleiben nach allen …“     │
│ ▸ Kosten  ▸ Finanzierung      │   [Als Tabelle anzeigen]                                              │
│ ▸ Steuer  ▸ Wert & Horizont   │                                                                       │
└───────────────────────────────┴───────────────────────────────────────────────────────────────────────┘
Tablet: Ergebnis-Leiste zweizeilig, Annahmen links schmal (einklappbar), Analyse rechts.
Mobil: eigene Seite; Ergebnis-Leiste oben kompakt (3 Werte, antippen = alle), Annahmen als Akkordeon,
Analyse darunter mit Reitern als Auswahlliste; „Übernehmen“ als Aktionsleiste.
```

**Tastatur & A11y:** NumberField ist primär, Slider ist Zusatz (WCAG 2.5.7); Slider mit `aria-valuetext` („189.000 Euro“). Fokus bleibt bei jeder Neuberechnung im Feld (Audit 5.5). Ergebnis-Leiste ist eine `region` „Ergebnis“; **keine** Live-Ansage bei jedem Tastendruck – Ansage nur bei Feldverlassen und nur der wichtigsten Änderung („Cashflow nach Steuern jetzt plus 38 Euro pro Monat“), abschaltbar. Diagramme mit Zusammenfassung und Tabelle.

**Microcopy:** Basiswert-Markierung „Basis: 690 € (laut Exposé)“ · Wertentwicklung: „Rechne ohne Wertsteigerung. Wenn es sich nur mit Wertsteigerung lohnt, lohnt es sich nicht.“ · EK-Rendite: „Im Zähler: Cashflow + Tilgung. Wertsteigerung erst beim Verkauf real.“

**Akzeptanzkriterien:**
- AK-S14-1: Alle 13 Mindestfunktionen aus Recherche 14 (3.6) sind abgedeckt (P5); P3 umfasst Bierdeckel 1/2, Kapitalbedarf, Annuität, Cashflow-Kaskade, Bank-Schnellcheck.
- AK-S14-2: Die Golden-Tests T1–T13 (Recherche 10, 1.9) liefern in der UI dieselben Werte wie im Rechenkern (E2E-Test mit Fixtures).
- AK-S14-3: Eingabe von „250000“, „250.000“, „250.000,50“ wird korrekt gelesen; Fokus und Cursor bleiben stabil, kein Wert springt während des Tippens.
- AK-S14-4: Monat und Jahr werden nie in derselben Spalte/Tabelle gemischt; jede Zahl trägt ihren Zeitbezug.
- AK-S14-5: Tornado sortiert nach Wirkung, beschriftet Basiswert und Bandbreite jeder Annahme.
- AK-S14-6: Jede Ergebniszahl öffnet eine Erklär-Karte, deren Ebene 2 die eingesetzten Annahmen zeigt; Klick auf eine Annahme dort fokussiert das Feld im Kalkulator.

---

#### S-17 Finanzierungsanfrage & Bankentscheidung · [P3]

**Zweck & Nutzerfragen:** „Bekomme ich den Kredit, zu welchem Zins? Wenn nein: **warum** – und was kann ich ändern?“ Lehrt die Bankperspektive (Haushaltsrechnung, Beleihungswert, Prüfzins, Unterlagen) statt eines Zufalls-Ja/Nein (Audit 7: falsche DTI-Logik verworfen).

**Inhalte/Daten – Anfrage (4 Schritte):**

| Schritt | Inhalt |
|---|---|
| **1 Eckdaten** | Darlehensbetrag, EK-Einsatz, Zinsbindung, anfängliche Tilgung, Sondertilgungswunsch – vorbelegt aus Kalkulator; Anzeige von Finanzierungsquote und Beleihungsauslauf (geschätzt) |
| **2 Haushaltsrechnung** | zweispaltig **„Deine Rechnung“ vs. „So rechnet die Bank“**: Einnahmen (Netto, Einmalzahlungen anteilig, Bestandsmieten 60–80 %, neue Miete angerechnet), Ausgaben (Wohnkosten, Lebenshaltungspauschale, Raten, Rahmen von Dispo/Kreditkarte, Bestand), Kapitaldienst zum **Prüfzins** → **Überschuss**. Werte aus Profil vorbelegt (WCAG 3.3.7), editierbar |
| **3 Unterlagen** | Checkliste (Selbstauskunft, 3 Gehaltsnachweise, Arbeitsvertrag, Steuerbescheide, Kontoauszüge, EK-Nachweis, Exposé, Mietvertrag, Grundbuchauszug …) mit Status und Zeitbedarf; fehlende Unterlagen führen zur **Rückfrage** (Zeitverzug), nicht zur Sperre |
| **4 Banken wählen** | Hausbank · Direkt-/Hypothekenbank · Vermittler (fragt mehrere an) – je Karte Profil-Hinweise (z. B. „finanziert Nebenkosten selten“), Bearbeitungszeit; Tipp „Mindestens 3 Angebote mit identischen Eckdaten“ |

**Inhalte/Daten – Entscheidung (nach 1–2 Spielmonaten, über Posteingang):**
- Je Bank eine Ergebnis-Karte: **Zusage · Gegenangebot · Rückfrage · Absage** (Icon + Text).
- **Begründung in Klartext mit Zahlen** (aus den Begründungscodes, Recherche 10, 2.4), z. B. „Haushaltsüberschuss zum Prüfzins von 5,5 %: −184 €/Monat. Die Bank verlangt mindestens 0 €.“ · „Darlehen 201.000 € liegt über dem Beleihungswert von 170.100 €.“
- **„Was würde helfen?“** – Hebel mit Wirkung, berechnet: „+12.000 € Eigenkapital → Überschuss +66 €/Monat“ · „Dispo-Rahmen 5.000 € kündigen → +100 €/Monat im Bankansatz“ · „Kaufpreis um 8.000 € verhandeln → Darlehen unter Beleihungswert“ · „Zweiten Kreditnehmer aufnehmen“.
- **Angebotsvergleich** (K-28): Sollzins, Effektivzins, Zinsbindung, Rate, anfängliche Tilgung, Sondertilgungsrecht, bereitstellungszinsfreie Zeit, Auflagen, gültig bis.

**Aktionen:** Anfrage primär: **„Finanzierung bei 3 Banken anfragen“** (konkrete Zahl). Entscheidung primär: **„Angebot der Stadtsparkasse annehmen – 3,74 % für 10 Jahre“** (Prüfschritt O-05, weil bindend). Sekundär: „Nachverhandeln“ (Gebotsrunde Zins), „Unterlagen nachreichen“, „Mit geänderten Eckdaten neu anfragen“, „In Kalkulator übernehmen“, „Ablehnen“.

**Zustände:**
- *Anfrage läuft:* Tracker-Schritt „Bank prüft · Antwort erwartet Dez. 2026“; Anfrage-Eckdaten nur noch lesbar.
- *Rückfrage:* Liste fehlender Unterlagen mit „Jetzt nachreichen (verzögert um ca. 2 Wochen)“.
- *Alle Absagen:* Seite beginnt mit der häufigsten Ursache und dem stärksten Hebel; Link zur Lektion „Haushaltsrechnung der Bank“.
- *Lernmodus:* Schritt 2 mit Mentor-Erklärung, Prüfzins-Unterschied hervorgehoben; Vermittler empfohlen.
- *Profi:* Schritte als eine lange Seite mit Sprungmarken; Bankprofile mit Parametern sichtbar.

**Layout:**
```
Desktop: Bankentscheidung
┌Finanzierung: 3-Zi-ETW Leipzig-Lindenau · 3 Antworten (Dez. 2026)──────────────────────────────────┐
│ ┌Stadtsparkasse ✓ Zusage────┐ ┌Direktbank ◐ Gegenangebot───┐ ┌Regionalbank ✕ Absage────────────┐ │
│ │ 3,74 % · 10 J. · 2 % Tilg. │ │ max. 170.000 € (statt 201.000)│ │ Grund: Haushaltsüberschuss zum  │ │
│ │ Rate 961 €/Monat           │ │ + 31.000 € Eigenkapital nötig │ │ Prüfzins −184 €/Monat (≥ 0 nötig)│ │
│ │ Auflage: Mietvertrag vorl. │ │ 3,61 % · 10 J.                │ │ Was hilft? ▾                    │ │
│ └────────────────────────────┘ └───────────────────────────────┘ │ • +12.000 € EK → +66 €/Monat    │ │
│                                                                  │ • Dispo kündigen → +100 €/Monat │ │
│ Angebotsvergleich  [Nur Unterschiede]                            └─────────────────────────────────┘ │
│ Merkmal        Stadtsparkasse   Direktbank      …                                                │
│ Effektivzins   3,81 %           3,68 % ✓ best.                                                   │
│ …                                                                                                │
│                     [Nachverhandeln]  [Angebot Stadtsparkasse annehmen – 3,74 % für 10 Jahre ▸]  │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
Mobil: Ergebnis-Karten untereinander, Begründung jeweils offen; Vergleich als 2-Spalten-Tabelle mit „+1 weitere“.
```

**Tastatur & A11y:** Ergebnis-Karten als Artikel mit Überschrift „Stadtsparkasse: Zusage“. Begründungen als Liste, Hebel als Buttons, die den Kalkulator mit geänderter Annahme öffnen. „Bestes“ im Vergleich mit Icon + Text „günstigster Wert“, nicht nur Farbe.

**Microcopy:** Absage-Kopf: „Die Regionalbank sagt ab. Hauptgrund: Nach ihrer Rechnung bleibt dir zum Prüfzins nichts übrig.“ · Hinweis: „Prüfzins ≠ dein Zins: Die Bank testet, ob du die Rate auch nach der Zinsbindung trägst.“ · Tipp: „Hol dir die Zusage vor dem Notartermin.“

**Akzeptanzkriterien:**
- AK-S17-1: Bei jeder Absage oder jedem Gegenangebot steht der Hauptgrund mit konkreten Zahlen im sichtbaren Bereich ohne Scrollen (1280×800) bzw. als erstes Element (mobil).
- AK-S17-2: Mindestens ein Hebel mit berechneter Wirkung wird angeboten, sofern ein Hebel existiert; andernfalls steht „Mit diesem Profil finanziert keine Bank dieses Objekt“ mit Begründung.
- AK-S17-3: Usability-Aufgabe „Finde heraus, warum die Bank abgelehnt hat“: ≥ 80 % Erfolg in < 60 s (Kap. 7.3).
- AK-S17-4: Bankrechnung und eigene Rechnung sind nebeneinander und zeilenweise vergleichbar; jede Zeile öffnet eine Erklär-Karte.
- AK-S17-5: Das Annehmen eines Angebots ist ein Prüfschritt mit konkretem Knopftext; vor Annahme bleiben alle Angebote bis „gültig bis“ erhalten.

---
#### S-19 Kaufabwicklungs-Tracker · [P3]

**Zweck & Nutzerfragen:** „Wo steht mein Kauf? Was muss ich wann zahlen? Ab wann gehört mir die Miete? Was kann noch schiefgehen?“ Macht die realistische Dauer sichtbar (kein Sofortkauf, Recherche 21 B13 Punkt 17) und unterscheidet Kaufvertrag, Nutzen-Lasten-Wechsel und Grundbucheintrag.

**Inhalte/Daten:**
- **Liste laufender Käufe** (`/markt/kaeufe`): Objekt, aktueller Schritt, nächster Meilenstein, erwarteter Monat, offene Risiken, fällige Zahlungen.
- **Detail – Fortschritts-Tracker (K-14)** mit Schritten (Zustandsautomat Recherche 13, 4):

| # | Schritt | Typische Anzeige | Spieleraktion |
|---|---|---|---|
| 1 | Finanzierungszusage | „Zusage Stadtsparkasse, gültig bis Feb. 2027“ | Angebot annehmen (S-17) |
| 2 | Kaufvertragsentwurf (Notar) | „Entwurf liegt vor · 3 Punkte prüfen“ (Kaufpreisaufteilung, Inventar, Anliegerbeiträge) | „Entwurf prüfen“ |
| 3 | Beurkundung | „Termin Jan. 2027“ | **Prüfschritt O-05:** „Kaufvertrag über 189.000 € beurkunden“ |
| 4 | Vorkaufsrecht / Negativattest | „Gemeinde prüft · ca. 1–2 Monate“ | – (Risiko „Vorkaufsrecht ausgeübt“ angezeigt) |
| 5 | Auflassungsvormerkung | „eingetragen“ | – |
| 6 | Kaufpreisfälligkeit | „189.000 € fällig Mär. 2027 · Auszahlung Darlehen“ | Zahlung bestätigt sich automatisch; Liquiditätsprüfung |
| 7 | Grunderwerbsteuer-Bescheid & Nebenkosten | „GrESt 10.395 € fällig · Notar 3.780 €“ | – |
| 8 | **Nutzen-Lasten-Wechsel / Übergabe** | „Ab Apr. 2027 gehören dir Miete und Kosten“ · Kaution, Zählerstände | „Übergabe durchführen“ (Checkliste) |
| 9 | Grundbucheintrag (Eigentum) | „erwartet Jun.–Aug. 2027“ | – |

- Je Schritt: Status (erledigt / aktiv / wartet / blockiert / Risiko – Icon + Text), **erwarteter Monat als Bandbreite**, Kosten fällig, „Was passiert hier?“ (Erklär-Karte, Rechtsbezug), Akteur (Notar, Bank, Gemeinde, Verkäufer).
- **Zahlungsplan** mit Liquiditätsvorschau: wann welcher Betrag abgeht; Warnung, wenn Liquidität nach Fälligkeit unter die Reserve fällt.
- **Risiken in der Pipeline:** Vorkaufsrecht, Bank setzt Beleihungswert niedriger, Verkäufer zieht zurück, Gutachten-Befund → je mit Wahrscheinlichkeit als Text („selten“, „möglich“) und Folge.

**Aktionen:** Primär = Aktion des aktiven Schritts (z. B. „Entwurf prüfen“, „Kaufvertrag über 189.000 € beurkunden“, „Übergabe durchführen“). Sekundär: „Vom Kauf zurücktreten“ (vor Beurkundung, Kosten genannt; nach Beurkundung nicht verfügbar mit Begründung), „Notiz“, „Zahlungsplan exportieren“.

**Zustände:** *Blockiert* (z. B. Finanzierung fehlt vor Beurkundung: „Ohne Zusage riskierst du, den Kaufpreis nicht zahlen zu können. Erst Finanzierung klären.“ – Beurkundung bleibt möglich, aber der Prüfschritt zeigt das Risiko prominent) · *Abgebrochen* (Grund, Kosten bisher, Lernlink) · *Abgeschlossen* (Objekt erscheint im Bestand, Toast mit Link, Meilenstein) · *Lernmodus:* jeder Schritt mit einem Satz „Warum dauert das?“.

**Layout:**
```
Desktop
┌Kauf: 3-Zi-ETW Leipzig-Lindenau                      Status: Beurkundung steht an (Jan. 2027) ┐
│ ✓ Finanzierung ── ✓ Entwurf ── ● Beurkundung ── ○ Vorkaufsrecht ── ○ Fälligkeit ── ○ Übergabe ── ○ Grundbuch │
│   Nov. 26          Dez. 26       Jan. 27          Feb.–Mär. 27       Mär. 27         Apr. 27       Jun.–Aug. 27│
├──────────────────────────────────────────────┬───────────────────────────────────────────────┤
│ Aktiver Schritt: Beurkundung                 │ Zahlungsplan                                   │
│ Was passiert hier? Der Notar liest den …  ⓘ  │ Mär. 27  Kaufpreis 189.000 € (Darlehen 160.650)│
│ Offene Punkte: Kaufpreisaufteilung geprüft ✓ │ Mär. 27  Eigenanteil 28.350 €                  │
│ Risiken: Vorkaufsrecht Gemeinde (selten)     │ Apr. 27  GrESt 10.395 € · Notar 3.780 €         │
│ [Kaufvertrag über 189.000 € beurkunden ▸]    │ Liquidität danach: 9.120 € ◐ knapp über Reserve│
└──────────────────────────────────────────────┴───────────────────────────────────────────────┘
Mobil: vertikaler Stepper; aktiver Schritt aufgeklappt; Zahlungsplan als eigener Abschnitt darunter.
```

**Tastatur & A11y:** Stepper als geordnete Liste (`<ol>`), aktiver Schritt `aria-current="step"`; Status als Text im Listeneintrag. Bandbreiten-Daten vorlesbar („erwartet Juni bis August 2027“).

**Microcopy:** „Ab April 2027 gehören dir Mieten und Kosten (Nutzen-Lasten-Wechsel). Im Grundbuch stehst du erst einige Monate später.“

**Akzeptanzkriterien:**
- AK-S19-1: Nutzerinnen beantworten „Ab wann bekommst du die Miete?“ und „Wann bist du im Grundbuch?“ korrekt aus dem Tracker (Usability ≥ 80 %).
- AK-S19-2: Jeder Schritt zeigt erwarteten Monat (Bandbreite), Kosten und Akteur; Abweichungen vom Plan werden als Änderung mit Grund angezeigt.
- AK-S19-3: Die Beurkundung ist nur über den Prüfschritt mit Zusammenfassung, Zahlungsplan und konkretem Knopftext erreichbar.
- AK-S19-4: Liquiditätsunterschreitung durch fällige Zahlungen wird vor der Beurkundung angezeigt.

---

#### S-21 Objekt-Detail · [P3 Grundgerüst · P4 vollständig]

**Zweck & Nutzerfragen:** „Wie läuft dieses Objekt wirklich – Miete, Kosten, Finanzierung, Steuern, Wert? Was steht an? Was kann ich verbessern?“ Ein Objekt kann eine ETW oder ein MFH mit vielen Einheiten sein (Audit 8.11).

**Inhalte/Daten:**
- **Kopf:** Name/Adresse (fiktiv, Gemeinde echt), Objektart, Einheiten, Status-Chips („3 von 4 vermietet“, „1 Mieterhöhung möglich“, „Zinsbindung endet Feb. 2027“), KPI-Leiste: **Marktwert** (Bandbreite, Stand letzte Bewertung – nie inflationierter Kaufpreis, Audit 5.4) · Restschuld · Beleihung · CF n. Fin./Monat · CF n. St./Monat · Bruttomietrendite (Ist auf Kaufpreis).
- **Reiter** (Zustand je Objekt in der URL):

| Reiter | Inhalt |
|---|---|
| **Überblick** | Cashflow-Wasserfall des Objekts (Monat/Jahr), offene Entscheidungen zu diesem Objekt, „Demnächst“ dieses Objekts, Erwartet-vs.-Ist seit Kauf (Kurzform, Link S-42) |
| **Einheiten & Mieter** | Tabelle: Einheit · Fläche · Status (vermietet / gekündigt / leer – Herrichtung / inseriert / Bewerber) · Mieter · Kaltmiete · €/m² · Vergleichsmiete (Flag) · Potenzial · nächste mögliche Erhöhung · Vertragsart · Zahlungsstatus. Leer-Zustände unterschieden (Audit 5.3) |
| **Finanzierung** | Darlehen dieses Objekts (K-09), Zinsbindung, Rate, Restschuld-Verlauf, Sondertilgungsrecht; Links in S-28 |
| **Kosten & Instandhaltung** | Kostenaufstellung umlagefähig / nicht umlagefähig, Hausgeld-Übersetzer (WEG-Position → umlagefähig ja/nein), Instandhaltungsreserve vs. Bauteilplan (Bauteile mit Alter, erwarteter Erneuerung), laufende Aufträge |
| **Steuern** | AfA-Bemessung, Werbungskosten, Ergebnis V+V je Jahr, **Fristen:** 15-%-Grenze (verbraucht x von y €, bis Datum), Spekulationsfrist (steuerfrei ab …) |
| **Wertentwicklung** | Zeitreihe Marktwert (Band) vs. Restschuld → Eigenkapital im Objekt; Bewertungshistorie mit Quelle (Modell, Gutachten) |
| **Dokumente** | Kaufunterlagen, Mietverträge, Bescheide, Protokolle (aus Spielereignissen) |
| **Chronik** | alle Ereignisse und Entscheidungen zum Objekt (gefiltertes S-10) |

**Aktionen:** Primär kontextabhängig (höchstens eine hervorgehoben): „Miete erhöhen (2 Einheiten möglich)“ · „Leere Einheit vermieten“ · „Anschlussfinanzierung vorbereiten“. Sekundär (Menü „Aktionen“): „Instandhaltung planen“, „Verwaltung beauftragen/wechseln“, „Bewertung anfordern (Gutachten, Kosten)“, „Sondertilgung“, „Verkauf prüfen“, „Notiz“.

**Zustände:** *Frisch gekauft* (Übergabe-Checkliste oben, Hinweis „Erste Miete Apr. 2027“) · *Leerstand* (Banner mit Kosten pro Monat Leerstand und Aktion) · *in Sanierung* (Fortschritt, Mieteinfluss) · *Verkauf läuft* (Tracker) · *Lernmodus:* Reiter Steuern/Wert zeigen Vereinfachungs-Hinweis bis zur Einführung · *Profi:* kompakte Tabellen, Massenaktionen in „Einheiten“.

**Layout:**
```
Desktop (Bestand: Objektliste │ Objekt-Detail │ Erklärung)
┌Objekte (12)──────────┬Lindenstr. 8 · MFH · 6 Einheiten · Leipzig ─────────────────────────────┬Erklärung─────┐
│ ▸ Lindenstr. 8  +412 │ Marktwert 610–680 Tsd. € · Restschuld 498.200 € · Beleihung 77 % ✓     │ „Beleihung“   │
│   Gohlis ETW    +38  │ CF n.Fin. +412 €/M · CF n.St. +505 €/M · Brutto 6,1 %                   │ Restschuld /  │
│   …                  │ [3 von 6 Erhöhung möglich] [1 leer – Herrichtung] [Zinsbindung 02/27] │ Marktwert …   │
│                      │ [Überblick|Einheiten|Finanzierung|Kosten|Steuern|Wert|Dokumente|Chronik]│              │
│                      │ Einheit  m²  Status      Kaltm.  €/m²  Vgl.miete  Potenzial  Erhöhung ab│              │
│                      │ EG li    62  vermietet   540,00  8,71  9,40 ≈    +43 €      Feb. 27     │              │
│                      │ EG re    58  leer·Herr.  —       —     9,40 ≈    —          —           │              │
│                      │ [Miete erhöhen (3) ▸]                                                   │              │
└──────────────────────┴─────────────────────────────────────────────────────────────────────────┴──────────────┘
Mobil: Kopf + KPI-Karussell, Reiter als scrollbare Leiste mit Überlauf-Hinweis und „Abschnitte“-Menü;
Einheiten als Karten (Einheit, Status, Miete, nächste Aktion).
```

**Tastatur & A11y:** Reiter nach APG, Zustand je Objekt; Tabellen-Grid. Status-Chips sind Links zur zuständigen Stelle. Zahlen vorlesbar mit Zeitbezug.

**Microcopy:** Leerstands-Banner: „Einheit EG rechts steht leer. Das kostet dich etwa 160 €/Monat (Hausgeld, Heizung, entgangene Miete 520 €).“ · Marktwert: „610.000–680.000 € (Modellwert, Stand Nov. 2026)“.

**Akzeptanzkriterien:**
- AK-S21-1: Der angezeigte Marktwert stammt aus derselben Wertfunktion wie Beleihung und Verkauf (Audit 8.1), mit Stand und Bandbreite.
- AK-S21-2: Ein MFH mit 50 Einheiten ist im Reiter „Einheiten“ sortier-, filter- und gruppierbar; Massenaktion „Mieterhöhung prüfen“ für Auswahl verfügbar (P5).
- AK-S21-3: Leerstand unterscheidet „Herrichtung“, „inseriert“, „Bewerber ausgewählt“ und „gekündigt, Auszug geplant“.
- AK-S21-4: Reiterzustand ist je Objekt; Wechsel zwischen Objekten behält jeweils den letzten Reiter.

---

#### S-22 Einheit/Mietvertrag mit Mieterhöhungs-Assistent · [P4]

**Zweck & Nutzerfragen:** „Darf ich die Miete erhöhen, wann, um wie viel, mit welcher Begründung – und was riskiere ich?“ Mietrecht als Kernmechanik (Audit 8.8), mit sichtbaren rechtlichen Grenzen.

**Inhalte/Daten – Einheit:** Mieter (fiktiver Name, Haushalt, Zahlungsquelle), Vertrag (Mietart: Standard/Index/Staffel, Beginn, Kaltmiete, BK-Vorauszahlung, Kaution, Klauseln), **Zahlungshistorie** 24 Monate (Punktleiste mit Text: „pünktlich“, „7 Tage verspätet“), **Miethistorie** (Zeitreihe Miete vs. ortsübliche Vergleichsmiete), letzte Erhöhung, Aktionen (Mieterhöhung, Mahnung, Kündigung/Aufhebung, Mängel).

**Assistent (4 Schritte, Seite oder großes Seitenpanel):**

| Schritt | Inhalt |
|---|---|
| **1 Rechtsgrundlage** | Auswahl nur der zulässigen Wege: Vergleichsmiete (§ 558 BGB) · Indexanpassung (§ 557b) · Staffel (fällig?) · Modernisierung (§ 559, nur nach Maßnahme) · Betriebskostenanpassung. Nicht zulässige Wege sichtbar, aber deaktiviert **mit Grund** („Staffelmiete vereinbart: Erhöhung auf Vergleichsmiete ausgeschlossen“) |
| **2 Grenzen** | **Zahlenstrahl** (K-07-Variante): aktuelle Miete │ Kappungsgrenze (Miete vor 3 Jahren × 1,20 bzw. 1,15 – Gemeinde-Regel mit Stand und Quelle) │ ortsübliche Vergleichsmiete (Flag „geschätzt“, wenn kein Mietspiegel) → **zulässiges Maximum = Minimum**. Sperrfristen: „15 Monate unverändert bis Wirksamkeit: erfüllt ab Feb. 2027“, „12 Monate seit letzter Erhöhung: erfüllt“. Warnung bei Überschreitung der Mietpreisüberhöhungs-Schwelle |
| **3 Betrag & Folgen** | NumberField + Slider, begrenzt auf das Maximum; Folgen: CF +x €/Monat ab **Wirksamkeit (Beginn des 3. Kalendermonats nach Zugang)**, Zustimmungswahrscheinlichkeit (Flag „Vereinfachung“), Risiko Mieterwechsel (Text), Wirkung auf Kappung der nächsten 3 Jahre |
| **4 Begründung & Versand** | Begründungsmittel: Mietspiegel (falls vorhanden) · drei Vergleichswohnungen · Gutachten (Kosten) – je mit Hinweis zur Belegstärke; **Vorschau des Schreibens** (Textform); Versand wird **vorgemerkt** und geht zum Monatswechsel raus |

**Ergebnis** (Folgemonate, Posteingang): Zustimmung → neue Miete ab Wirksamkeit (Tracker); keine Zustimmung → Entscheidung „Klage auf Zustimmung (Kosten, Dauer – Flag Vereinfachung)“ oder „Verzichten“.

**Sammel-Assistent** (aus Posteingang-Bündel oder S-39): Tabelle aller Einheiten mit möglicher Erhöhung, je Zeile Maximum, vorgeschlagener Betrag, Wirksamkeit; Auswahl → gemeinsamer Versand (vorgemerkt).

**Aktionen:** Primär im letzten Schritt: **„Mieterhöhung auf 612,50 € vormerken (Versand Dez. 2026, wirksam ab Mär. 2027)“**. Sekundär: „Zurück“, „Abbrechen“, „Als Entwurf behalten“.

**Zustände:** *Noch nicht zulässig* (Assistent startet mit „Frühestens möglich: Versand Nov. 2027, wirksam Feb. 2028“ und Angebot „Erinnerung im Kalender“) · *Region mit Mietpreisbremse* (Hinweis, dass die Bremse bei Neuvermietung gilt, die Kappung im Bestand) · *Lernmodus:* jeder Schritt mit Mentor-Satz; Musterlösung beim ersten Mal · *Profi:* Schritte 1–3 auf einer Seite.

**Layout:**
```
Desktop (Seitenpanel 560 px über Objekt-Detail oder eigene Seite)
┌Mieterhöhung · Lindenstr. 8, EG links · Schritt 2 von 4: Grenzen────────────────────────────┐
│ Aktuelle Miete 540,00 € (8,71 €/m²) · unverändert seit Nov. 2025                           │
│                                                                                            │
│ 540 €        580 €                         622 €          648 €                           │
│ ●────────────◆─────────────────────────────▲──────────────■                               │
│ aktuell   Wunsch?                 Kappung 15 % (Leipzig)  Vergleichsmiete ≈ (geschätzt)  │
│ → zulässig höchstens 621,00 € (+81,00 €/Monat)                                            │
│ Sperrfrist 15 Monate: ✓ erfüllt ab Feb. 2027 (Versand frühestens Nov. 2026)               │
│ Rechtsgrundlage: § 558 BGB · Kappungsgrenze laut Landesverordnung, Stand 30.09.2026 ⓘ      │
│                                                      [Zurück]  [Weiter: Betrag wählen ▸]  │
└────────────────────────────────────────────────────────────────────────────────────────────┘
Mobil: Vollseite; Zahlenstrahl vertikal mit Textliste darunter.
```

**Tastatur & A11y:** Zahlenstrahl ist Grafik mit Textalternative als Liste („Aktuelle Miete 540 Euro, Kappungsgrenze 621 Euro, Vergleichsmiete etwa 648 Euro, zulässig höchstens 621 Euro“). Deaktivierte Optionen bleiben fokussierbar (`aria-disabled`) und lesen den Grund vor.

**Microcopy:** „Höchstens 621,00 €: Die Kappungsgrenze von 15 % in drei Jahren greift vor der Vergleichsmiete.“ · Disclaimer-Fußzeile: „Vereinfachte Spielregel – keine Rechtsberatung.“

**Akzeptanzkriterien:**
- AK-S22-1: Der Assistent bietet nie einen Betrag über dem rechtlich zulässigen Maximum an; das Maximum ist mit beiden Grenzen und Quelle hergeleitet.
- AK-S22-2: Wirksamkeitsdatum und Sperrfristen werden korrekt nach § 558 BGB berechnet (Tests mit Grenzfällen).
- AK-S22-3: Unzulässige Erhöhungswege sind sichtbar und begründet, nicht ausgeblendet.
- AK-S22-4: Usability-Aufgabe „Erhöhe die Miete der Wohnung EG links rechtssicher“: ≥ 80 % Erfolg ohne Hilfe im Standardmodus.
- AK-S22-5: Versand ist bis zum Monatswechsel als „vorgemerkt“ änderbar (O-14).

---
#### S-27 Liquidität & Kontoauszug · [P3 Kontostand/Auszug · P5 Prognose & Wasserfall Portfolio]

**Zweck & Nutzerfragen:** „Wie viel Geld habe ich, wie lange reicht es, wohin fließt es, und wann wird es knapp?“ Liquidität ist der häufigste Grund zu scheitern – deshalb früh, ehrlich und mit Vorlauf.

**Inhalte/Daten:**
- **Kopf-KPIs:** Kontostand · **Reichweite** in Monaten (Definition in Erklär-Karte: verfügbare Liquidität / Ø monatlicher Abfluss im Krisenfall) · **Reserve-Schwelle** (vom Spieler gesetzt, Standard aus Profil, Bullet Graph) · Dispo/Kontokorrent (Rahmen, genutzt, Zinssatz).
- **Kontoverlauf + Prognose** (Zeitreihe K-13): Vergangenheit 24 Monate durchgezogen, Prognose 12–36 Monate als **Band** (pessimistisch/realistisch/optimistisch) mit markierten bekannten Zahlungen (Steuererstattung, NKA, Zinsbindungsende, Sanierungsrate) und der Reserve-Linie. Unterschreitung als Textmarke „Unterschreitung ab Aug. 2027 möglich“.
- **Cashflow-Wasserfall** (Monat/Jahr, Objekt/Portfolio) und optional **Sankey** „Wohin fließt die Miete?“ [P7].
- **Kontoauszug** (K-09, virtualisiert): Datum (Monat), Buchungstext, Kategorie, Objekt, Betrag, Saldo. Filter Kategorie/Objekt/Zeitraum, Suche, Summenzeile. Invariante sichtbar: „Summe der Buchungen im Zeitraum = Saldoveränderung ✓“.
- **Frühwarnungen:** Banner bei prognostizierter Unterschreitung mit Ursachen („Steuernachzahlung Mai 2027 · Zinsbindung D2 endet Feb. 2027“).

**Aktionen:** Primär: keine dauerhafte; bei Frühwarnung **„Gegenmaßnahmen ansehen“** (O-08 Stufe 1). Sekundär: „Reserve-Schwelle ändern“, „Sparrate anpassen“ (private Haushaltsrechnung), „Kontokorrent bei Bank anfragen“, „Im Szenario-Labor testen“, „Auszug exportieren (CSV)“ [P8].

**Zustände:** *Spielbeginn* (nur Startkapital, Prognose aus Sparrate) · *beobachten/kritisch* (Status mit Icon + Text, Banner) · *Dispo genutzt* (Zinskosten pro Monat sichtbar) · *Lernmodus:* Prognose zuerst nur „realistisch“ mit Hinweis auf Bandbreite ab Szenario 2 · *Profi:* Auszug mit Spaltenauswahl und gespeicherten Filtern.

**Layout:**
```
Desktop
┌Liquidität──────────────────────────────────────────────────────────────────────────────────────┐
│ Kontostand 12.812 € · reicht 5,2 Monate ✓ solide · Reserve-Schwelle 8.000 € ▕████████░░│▏ · Dispo 0 / 5.000 € │
├────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Verlauf & Prognose [12|24|36 Monate]                            [Als Tabelle anzeigen]         │
│  20k ┤          ╭──────╮░░░░░░░░░░░ optimistisch                                              │
│  10k ┤──────────╯      ╰──────░░░░░ realistisch                                                │
│ Res. ┤- - - - - - - - - - - - -▼ - - pessimistisch unterschreitet Aug. 2027                     │
│      └ Nov 25 ……… Nov 26 │ Spielwelt → ……… Nov 27 (Marken: NKA, Steuer, Zinsbindung)          │
│ „In der pessimistischen Rechnung fällt dein Konto im August 2027 unter die Reserve.“           │
├───────────────────────────────────────────┬────────────────────────────────────────────────────┤
│ Wasserfall [Monat|Jahr] [Objekt|Portfolio]│ Kontoauszug  Filter ▾  ⌕                         │
│ …                                         │ Dez. 26  Miete EG li  Lindenstr. 8   +540,00  … │
└───────────────────────────────────────────┴────────────────────────────────────────────────────┘
Mobil: KPIs → Diagramm (Band, Tabellen-Umschalter) → Warnungen → Auszug als Liste mit Monatsgruppen.
```

**Tastatur & A11y:** Diagramm mit Text-Kernaussage über dem Chart (nicht nur in alt). Prognose-Band in Tabelle als drei Spalten. Auszug als Grid mit Monats-Gruppierung (`rowgroup`).

**Microcopy:** Reichweite: „reicht 5,2 Monate, wenn keine Miete eingeht und alle Kosten weiterlaufen“ · Band: „Bandbreite aus drei Spielwelt-Pfaden – keine Vorhersage der echten Zukunft.“

**Akzeptanzkriterien:**
- AK-S27-1: Σ Buchungen eines beliebigen Zeitraums = Δ Kontostand (automatischer Test gegen Journal, Anzeige mit Häkchen).
- AK-S27-2: Eine prognostizierte Unterschreitung der Reserve wird mindestens 3 Monate vorher als Text und im Cockpit angezeigt, sofern das Modell sie vorher kennt.
- AK-S27-3: Prognose ist als Band dargestellt, beschriftet und als Tabelle verfügbar; Spielwelt-Grenze markiert.
- AK-S27-4: Auszug mit 10.000 Buchungen bleibt flüssig (virtualisiert), Filter < 100 ms.

---

#### S-28 Kredite & Anschlussfinanzierung · [P3 Übersicht · P5 Sondertilgung & Anschluss]

**Zweck & Nutzerfragen:** „Was schulde ich wem, zu welchen Bedingungen? Wann laufen Zinsbindungen aus? Was passiert mit meiner Rate beim Anschluss, und welche Option ist robust?“

**Inhalte/Daten:**
- **Übersichtstabelle** (K-09): Bank · Objekt · Ursprungsbetrag · Restschuld · Sollzins · Zinsbindung bis (K-08) · Rate/Monat · aktuelle Tilgung % · Sondertilgung (Recht p. a., genutzt) · Beleihung. Summenzeile.
- **Zinsbindungs-Kalender:** Zeitleiste aller Bindungsenden → Klumpen sichtbar („3 Darlehen enden 2029“).
- **Darlehens-Detail:** Tilgungsplan (Jahreszeilen, Monate aufklappbar), Restschuld-Kurve, Zins-/Tilgungsanteil gestapelt, Konditionen, Grundschuld, Auflagen.
- **Sondertilgungs-Assistent:** Betrag → Restschuld neu, Zinsersparnis bis Bindungsende, Liquidität danach, Reichweite neu; Hinweis auf Reserve.
- **Anschluss-Assistent** (startet über Posteingang 36/12/6 Monate vor Ende): Optionen **Prolongation** (Angebot Hausbank) · **Umschuldung** (andere Bank, Kosten der Grundschuldabtretung als Flag „Vereinfachung“) · **Forward-Darlehen** (Aufschlag, Flag) · **Verkauf** (Link S-26) · **Sondertilgung zum Bindungsende**. Vergleich: neuer Zins, Rate neu, Δ Rate, Restschuld am neuen Bindungsende, CF neu, Stresswert („bei +2 Pp. in 10 Jahren“). **Break-even-Zins:** „Ab 4,9 % wird der Cashflow dieses Objekts negativ.“

**Aktionen:** Primär im Anschluss: **„Anschlussfinanzierung bei Bank B abschließen – 3,62 % für 10 Jahre“** (O-04 + O-05). Sondertilgung primär: **„8.000 € Sondertilgung vormerken (Dez. 2026)“**; über Reserve-Schwelle hinaus mit Prüfschritt. Sekundär: „Angebote einholen (3 Banken)“, „Tilgungssatz ändern“ (wenn Recht vorhanden), „Tilgungsplan exportieren“.

**Zustände:** *Keine Kredite* (Leerzustand mit Erklärung „Kredite entstehen über Finanzierungsanfragen“) · *Bindungsende < 12 Monate* (Fristen-Badge „beobachten“, Stopp-Regel) · *Bindungsende überschritten ohne Entscheidung* (Standardfolge: Prolongation der Hausbank zu deren Kondition – vorher im Posteingang genannt) · *Lernmodus:* Anschluss-Assistent mit Musterrechnung „Restschuld × (Zins + Tilgung) / 12“ · *Profi:* mehrere Szenarien parallel.

**Layout:**
```
Desktop: Anschluss-Assistent (Detail-Pane)
┌Anschlussfinanzierung · Darlehen D2 (Gohlis ETW) · Bindung endet Feb. 2027 · Restschuld 121.480 €┐
│ Option              Zins    Bindung  Rate neu   Δ Rate     Restschuld Ende  CF n.Fin. Stress +2 Pp.│
│ ○ Prolongation Hausb. 3,95 % 10 J.    603 €/M    +178 €/M   91.200 €        −86 €/M   −288 €/M     │
│ ● Umschuldung Bank B  3,62 % 10 J.    570 €/M    +145 €/M   90.400 €        −53 €/M   −255 €/M  ✓  │
│ ○ Forward (bereits)   —      …                                                                   │
│ ○ Verkauf             →  Verkauf-Assistent                                                       │
│ Vorher → Nachher: Liquidität … · Beleihung 74 % → 74 % · Break-even-Zins 4,9 %                    │
│ Ohne Entscheidung bis Jan. 2027: Prolongation Hausbank zu 3,95 %.                                 │
│                     [Mentor-Check]  [Anschlussfinanzierung bei Bank B abschließen – 3,62 % … ▸]  │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
Mobil: Optionen als Karten (Zins, Rate neu, Δ Rate), Vergleich „Nur Unterschiede“ als 2-Spalten-Tabelle.
```

**Tastatur & A11y:** Optionen-Tabelle als Radiogruppe mit Zeilen (jede Zeile ein Radio mit vollständigem Namen); „robusteste Option“ per Icon + Text, nicht Farbe.

**Microcopy:** „Deine Rate steigt um 145 € im Monat. Das ist die Folge von 1,45 Prozentpunkten mehr Zins auf 121.480 € Restschuld.“

**Akzeptanzkriterien:**
- AK-S28-1: Für jedes Darlehen ist das Bindungsende mindestens 36 Monate vorher im Kalender und 12 Monate vorher im Posteingang sichtbar (Stopp-Regel einstellbar).
- AK-S28-2: Der Tilgungsplan erfüllt die Rechenkern-Invarianten (Zins + Tilgung = Rate ± 1 Cent; Restschuld monoton fallend) und wird in Jahren/Monaten statt „360 Monate“ beschrieben (Audit 5.4).
- AK-S28-3: Der Anschlussvergleich zeigt Δ Rate, CF neu und einen Stresswert je Option; die Standardfolge ist genannt.
- AK-S28-4: Sondertilgung über die Reserve-Schwelle hinaus erfordert den Prüfschritt mit Reichweite danach.

---

#### S-30 Steuern · [P4]

**Zweck & Nutzerfragen:** „Was zahlt oder bekomme ich ans Finanzamt, warum, und wann? Warum unterscheidet sich das steuerliche Ergebnis vom Cashflow? Welche Fristen laufen?“ Vereinfacht, aber korrekt; keine Steuerberatung.

**Inhalte/Daten:**
- **Jahresauswahl** (laufendes Jahr = Vorschau, Vorjahre = Bescheide) und **Ebene** Gesamt/Objekt.
- **Anlage-V-ähnliche Aufstellung** je Objekt: Einnahmen (Zufluss, inkl. BK-Vorauszahlungen) · Werbungskosten (Schuldzinsen, Hausgeld nicht umlagefähig/umlagefähig, Verwaltung, Erhaltungsaufwand, Fahrten, Sonstiges) · AfA (Bemessungsgrundlage = Gebäudeanteil, Satz nach Fertigstellungsjahr, Quelle der Kaufpreisaufteilung) · **Ergebnis V+V**.
- **Steuerwirkung:** Ergebnis × Grenzsteuersatz (Variante A, Flag „Vereinfachung: ohne Soli/KiSt, ohne Verlustvortrag“) → Erstattung oder Nachzahlung, **kassenwirksam im Folgejahr** (Datum in „Demnächst“).
- **Brücke „Cashflow ≠ steuerliches Ergebnis“** (Lerngrafik): zwei Spalten mit den Posten, die nur den Cashflow (Tilgung, Rücklagen) bzw. nur das Ergebnis (AfA) mindern (Recherche 10, 1.7).
- **Fristen:** 15-%-Grenze je Objekt als Fortschrittsbalken („verbraucht 6.200 € von 14.700 € · bis Mär. 2030“), Spekulationsfrist („steuerfrei verkaufbar ab Apr. 2037“), Bescheide-Archiv.
- **Entscheidungen** mit steuerlicher Wirkung erscheinen als Links: Kaufpreisaufteilung (beim Kauf), Restnutzungsdauergutachten, Sanierungszeitpunkt (S-24).

**Aktionen:** Sekundär: „Jahresvorschau aktualisieren“ (automatisch), „Bescheid ansehen“, „Steuerjahr als Bericht“ (S-31), „Grenzsteuersatz im Profil ändern“. Keine Primäraktion – Steuern sind Folge, nicht Selbstzweck.

**Zustände:** *Vor dem ersten Objekt* (Erklärung, was hier erscheinen wird) · *Lernmodus vor Stufe 3* („Steuern: pauschal geschätzt – wird in Szenario 3 erklärt“, nur Endwert) · *Profi* (alle Posten, Mehrjahresvergleich) · *Fehlende Annahme* (z. B. Gebäudeanteil geschätzt → Flag + Link „Kaufpreisaufteilung prüfen“).

**Layout:** Desktop: Tabelle links (Posten × Objekte, Summenspalte), rechts Brücke und Fristen. Mobil: Objekt-Auswahl oben, Posten als gruppierte Liste, Brücke darunter.

**Tastatur & A11y:** Tabelle mit Zeilen- und Spaltenköpfen (`scope`), Summenzeilen als `<tfoot>`. Fortschrittsbalken der 15-%-Grenze mit Text („42 Prozent der Grenze verbraucht“).

**Microcopy:** „Steuerlich machst du 1.840 € Verlust – trotzdem bleiben dir 38 € im Monat. Grund: Die AfA mindert die Steuer, kostet aber kein Geld.“ · Fußzeile: „Vereinfachte Spielrechnung, Rechtsstand 30.09.2026 – keine Steuerberatung.“

**Akzeptanzkriterien:**
- AK-S30-1: Ergebnis V+V und Steuerwirkung stimmen mit Golden Test T11 (Recherche 10) überein.
- AK-S30-2: Jede Vereinfachung ist am betroffenen Wert als Flag sichtbar und in Ebene 3 der Erklär-Karte benannt.
- AK-S30-3: Bevor eine Sanierung beauftragt wird, zeigt S-24 den Stand der 15-%-Grenze aus S-30 an (gleiche Datenquelle).
- AK-S30-4: Erstattungen/Nachzahlungen erscheinen mit Monat im Kalender und in der Liquiditätsprognose.

---

#### S-36 / O-09 Jahresabschluss & Debrief · [P4 Jahresabschluss · P6 Debrief vollständig]

**Zweck & Nutzerfragen:** „Wie war mein Jahr? Was war geplant, was ist passiert, warum, und was mache ich anders?“ Das Debrief ist der wichtigste Lernmoment (Recherche 21 B8). Ablauf und Auslöser in Kap. 3.9; hier Inhalte und Darstellung.

**Inhalte/Daten (Sequenz aus 5 Karten, je eine Bildschirmseite):**

| Karte | Inhalt |
|---|---|
| **1 Dein Jahr in Zahlen** | Vermögens-Wasserfall: Anfangsvermögen → + Tilgung → ± Wertänderung → ± kumulierter Cashflow → ± Sonstiges → Endvermögen; 4 Kernkennzahlen mit Δ zum Vorjahr |
| **2 Was war geplant?** | Ziele und Tagebuch-Erwartungen des Jahres („Erwartet: CF +50 €/Monat nach Kauf Lindenau“) |
| **3 Was ist passiert – und warum?** | Ursachenkette als Zeitstrahl: Ereignis → Ursache → zugehörige Entscheidung (mit Informationsstand damals); Kennzeichnung **„Entscheidung“** vs. **„Pech/Glück“**; Schattenrechnung für bis zu 2 Entscheidungen („Mit 15 statt 10 Jahren Zinsbindung: −22 €/Monat heute, damals erkennbar besser: nein“) |
| **4 Bewertung als Raster** | Liquiditätsvorsorge · Prüfung · Finanzierungsstruktur · Risikostreuung · Ertrag – je Stufe (Icon + Text) und ein Satz Begründung, Feedback auf Aufgaben-/Prozessebene, nie über die Person |
| **5 Was machst du anders?** | ein Vorsatz (Freitext oder Vorschlag), wird Lernziel fürs nächste Jahr; Ausblick: Fristen des nächsten Jahres; Ziele prüfen/anpassen |

**Aktionen:** „Weiter“ zwischen Karten, „Debrief überspringen“ (immer sichtbar, ohne Schuldgefühl), „Später fortsetzen“; letzte Karte primär **„Vorsatz speichern und 2028 beginnen“**. Archiv (S-36): Liste der Debriefs und Kauf-Reviews, Tagebuch-Einträge, Volltextsuche.

**Zustände:** *Erstes Jahr ohne Objekt* (kürzere Sequenz: Zahlen, Lernfortschritt, Vorsatz) · *Krisenjahr* (Karte 3 mit Krisenverlauf) · *Lernmodus* (Leitfragen eingeblendet) · *Profi* (kompakt, auf einer Seite).

**Layout:** Desktop: zentrierte Karte max. 880 px, Schrittanzeige oben („3 von 5“), Diagramme mit Tabellen-Umschalter. Mobil: Vollseite je Karte, Wischen zwischen Karten nur als Abkürzung, Knöpfe unten.

**Tastatur & A11y:** Sequenz als Assistent mit Überschrift je Karte, Fokus auf Kartenüberschrift beim Wechsel; Zeitstrahl als geordnete Liste.

**Microcopy:** „Das war eine vernünftige Entscheidung mit Pech: Mit dem Wissen von März 2027 war die kürzere Zinsbindung vertretbar.“ · „Ein Vorsatz reicht. Er erscheint im nächsten Jahr als Lernziel.“

**Akzeptanzkriterien:**
- AK-S36-1: Die Sequenz dauert im Median 3–5 Minuten und ist jederzeit überspringbar und fortsetzbar.
- AK-S36-2: Jede Ursache verweist auf eine konkrete Entscheidung oder ein Ereignis mit Datum; Bewertungen nutzen den damaligen Informationsstand (Snapshot im Tagebuch).
- AK-S36-3: Keine Bewertung ohne Begründung; keine Gesamtpunktzahl.
- AK-S36-4: Der Vorsatz erscheint im Folgejahr im Cockpit (Ziel-Block) und im nächsten Debrief (Karte 2).

---
### 2.2 Weitere Screens (kompakt, gleiches Raster)

#### S-01 Startbildschirm · [P3]
- **Zweck/Fragen:** „Weiterspielen oder etwas Neues?“ Ein Klick zurück ins Spiel.
- **Inhalte:** Karte „Fortsetzen“ (Spielstand-Name, Spieldatum, Nettovermögen, Ziel-Fortschritt, zuletzt gespielt), „Neues Spiel“, „Lernpfad“, „Challenges“ [P6], „Akademie“, „Einstellungen“; Fußzeile: Datenstand, Quellen (S-41), Version.
- **Aktionen:** Primär **„Fortsetzen: Nov. 2027“** (wenn Stand vorhanden) sonst **„Die erste Wohnung starten (geführt, ca. 20 Min.)“**; sekundär „Freies Spiel“, „Spielstand importieren“.
- **Zustände:** Erststart → Disclaimer-Karte (Kap. 5.4) einmalig; beschädigter Spielstand → Hinweis mit „Letzten Autosave laden“ statt Absturz; offline → normal (PWA).
- **Layout:** Desktop zentriert 960 px, zweispaltig (Fortsetzen groß links, Optionen rechts); mobil eine Spalte, Fortsetzen oben.
- **A11y:** h1 „Immobilien-Investment-Simulator“ (Arbeitstitel); Karten als Links/Buttons mit vollständigem Namen.
- **Microcopy:** „Willkommen zurück. Dein Bestand wartet im November 2027.“
- **AK:** AK-S01-1 Fortsetzen in 1 Aktivierung; AK-S01-2 Erststart ohne Konto in < 10 s spielbereit (nach Laden).

#### S-03 Spielstände · [P3 · P6 Checkpoints]
- **Zweck/Fragen:** „Wo kann ich weitermachen, wohin zurück?“
- **Inhalte:** Tabelle/Karten: Name, Modus, Spieldatum, Nettovermögen, gespeichert am, Typ (Autosave/manuell/Checkpoint), Version; Checkpoints gruppiert je Spielstand mit Anlass („vor Beurkundung Lindenau“).
- **Aktionen:** Primär „Laden“; sekundär „Umbenennen“, „Duplizieren“, „Exportieren (.immosave)“, „Importieren“, „Löschen“ (Name-Bestätigung, Papierkorb 30 Tage).
- **Zustände:** leer („Noch kein Spielstand. Starte ein neues Spiel.“); Import fehlerhaft (Zod-Validierung) → verständliche Meldung + „Datei prüfen“; neuere Version → Migration mit Hinweis.
- **Layout:** Desktop Tabelle + Detail; mobil Karten.
- **A11y:** Löschen-Bestätigung als Dialog mit Eingabe des Namens nur bei manuellen Ständen; Fokus zurück.
- **AK:** AK-S03-1 Export → Import ergibt identischen Zustands-Hash; AK-S03-2 Gelöschtes ist 30 Tage wiederherstellbar.

#### S-04 Einstellungen · [P3 basic · P8 vollständig]
- **Zweck/Fragen:** „Wie passe ich das Spiel an mich an?“
- **Bereiche:** *Darstellung* (Hell/Dunkel/System, hoher Kontrast, Schriftgröße 90–150 %, Dichte) · *Bewegung* (System/reduziert/aus, Auto-Weiter-Tempo) · *Zahlen* (Cent in Tabellen an/aus, Kompaktzahlen in Diagrammen, Flags inline: nur auffällige/alle) · *Zeit* (Stopp-Regeln einzeln, Monatsbericht-Verhalten, Weiter-Verhalten bei ungelesenen Infos) · *Hilfe* (Hilfestufe, Mentor-Häufigkeit, Coachmarks zurücksetzen, „Hilfen wieder einblenden“) · *Tastatur* (Kürzel umbelegen, Einzeltasten aus) · *Realismus* (gekennzeichnete Vereinfachungen, Marktschwierigkeit nur bei Spielstart/Szenario) · *Daten* (Speicherort, Export, Telemetrie opt-in, Zurücksetzen nur dieses Spiels).
- **Aktionen:** Änderungen wirken sofort (kein „Speichern“-Knopf), mit Rückgängig-Toast; „Auf Standard zurücksetzen“ je Bereich.
- **Zustände:** Einstellungen, die das laufende Spiel betreffen, nennen das („Gilt ab dem nächsten Monat“).
- **Layout:** Desktop zweispaltig (Bereichsliste │ Formular), mobil Liste → Unterseite.
- **A11y:** Schalter als `switch` mit Text; Vorschau für Dichte/Schrift live.
- **AK:** AK-S04-1 Kein „Alles löschen“, das fremde Daten des Origins entfernt (Audit 5.6); AK-S04-2 Jede Einstellung ist per Tastatur erreichbar und wirkt ohne Neuladen.

#### S-05 Konto & Sync (optional) · [P8]
- **Zweck/Fragen:** „Kann ich auf mehreren Geräten spielen?“ Erst anbieten, wenn Wert erlebt wurde (Gradual Engagement).
- **Inhalte:** Vorteile, Datenschutz-Kurzfassung, Anmeldung per Passkey oder E-Mail-Link, Sync-Status je Spielstand, Konflikte.
- **Aktionen:** „Mit Passkey anmelden“, „Sync für diesen Spielstand einschalten“, „Abmelden“.
- **Zustände:** offline (Sync pausiert, sichtbar); Konflikt → Vergleich zweier Stände mit Spieldatum, Wahl ohne Datenverlust.
- **A11y:** WCAG 3.3.8: keine kognitiven Tests, Passwortmanager erlaubt.
- **AK:** AK-S05-1 Spielen ohne Konto bleibt voll möglich; AK-S05-2 Sync-Konflikte verlieren keinen Stand.

#### S-10 Chronik · [P4]
- **Zweck/Fragen:** „Wann ist was passiert, und was habe ich damals entschieden?“ Ersetzt das freie Text-Log (Audit 5.7).
- **Inhalte:** strukturierte Einträge: Monat, Typ (Entscheidung, Ereignis, Buchung > Schwelle, Statuswechsel, Bericht), Objekt, Betrag, Kurztext, Link; Gruppierung nach Monat; unbegrenzte Historie (im Spielstand, paginiert).
- **Aktionen:** Suche, Filter (Typ, Objekt, Zeitraum), „Zum Ursprung“, „Als Tagebuch-Notiz ergänzen“.
- **Zustände:** leer am Spielstart mit Erklärung; Filter ohne Treffer mit Lockerungsvorschlag.
- **Layout:** Desktop Liste │ Detail; mobil Liste mit Monats-Sticky-Headern.
- **A11y:** Monate als Überschriften (Navigation per Überschriftensprung), keine Live-Region auf der Liste.
- **AK:** AK-S10-1 Kauf, Verkauf, Einzug, Auszug, Sanierungsende, Kreditabschluss erscheinen immer (Audit 5.7); AK-S10-2 Suche über 20 Spieljahre < 200 ms.

#### S-12 Suchaufträge · [P5]
- **Zweck/Fragen:** „Sag mir Bescheid, wenn etwas Passendes kommt.“
- **Inhalte:** Liste der Aufträge (Name, Kriterien als Chips, Treffer bisher, letzter Treffer); Editor = Filter aus S-11 + Mindestwerte (z. B. Bruttorendite ≥ 5,5 %) + Benachrichtigung (Posteingang ja/nein, Stopp-Regel ja/nein).
- **Aktionen:** „Suchauftrag anlegen“, „Treffer ansehen“, „Pausieren“, „Löschen“ (Rückgängig).
- **Zustände:** leer: „Noch kein Suchauftrag – lege einen an, dann meldet sich der Markt bei dir.“
- **A11y:** Kriterien-Chips mit Entfernen-Knopf (Name „Filter Leipzig entfernen“).
- **AK:** AK-S12-1 Neue Treffer erzeugen genau einen gebündelten Posteingang-Eintrag pro Monat und Auftrag.

#### S-15 Vergleich · [P5]
- **Zweck/Fragen:** „Welches von 2–4 Objekten (oder Finanzierungsangeboten) ist unter meinen Annahmen besser – und worin?“
- **Inhalte:** fixierte Kopfzeile (Objekte) und Beschriftungsspalte; Gruppen Preis & Kosten · Ertrag · Finanzierung · Lage · Risiken · Prüfstand; „Nur Unterschiede zeigen“; bester Wert je Zeile mit Icon + Text; unbekannte Werte als „unbekannt“, nicht leer.
- **Aktionen:** „Objekt entfernen“, „Im Kalkulator öffnen“, „Merken“; Szenario-Annahmen gleich für alle (Hinweis).
- **Layout:** Desktop alle Spalten; mobil 2 Spalten sichtbar + „+2 weitere“ (Wischen oder Umschalter).
- **A11y:** echte Tabelle, `scope="col/row"`; „beste“ Markierung als Text im Zellnamen.
- **AK:** AK-S15-1 Vergleich nutzt identische Annahmen (Zins, Tilgung, Steuer) und nennt sie im Kopf.

#### S-16 Merkliste · [P3]
- **Zweck/Fragen:** „Was wollte ich mir genauer ansehen?“
- **Inhalte:** gemerkte Angebote mit Status (noch verfügbar / verkauft / Preis geändert ±), Notiz, Prüfstand.
- **Aktionen:** „Vergleichen“, „Entfernen“ (Rückgängig), „Notiz“.
- **Zustände:** leer: „Merke Angebote mit dem Stern, um sie hier zu sammeln.“; verkaufte Angebote bleiben lesbar mit Hinweis.
- **AK:** AK-S16-1 Preisänderungen seit dem Merken sind mit Delta sichtbar.

#### S-18 Gebot & Verhandlung · [P3 Einzelgebot · P5 Gebotsrunden]
- **Zweck/Fragen:** „Was biete ich, mit welchen Bedingungen, und wie reagiert der Verkäufer?“
- **Inhalte:** Angebotspreis, eigener Höchstpreis (aus Kalkulator-Rückwärtsrechnung), Verhandlungshebel (belegte Mängel, Beleihungswert unter Kaufpreis, Marktphase), Konkurrenzlage (Text, keine Countdowns); Gebotsrunden als Verlauf (Gebot → Gegenangebot → …), je Runde Antwort im Folgemonat oder sofort im Dialog (strukturierte Runde, keine Echtzeit).
- **Aktionen:** **„Gebot über 178.000 € abgeben (bindet dich nicht – erst der Notarvertrag)“**; „Gegenangebot annehmen – 183.500 €“; „Verhandlung beenden“.
- **Zustände:** Gebot ohne Finanzierungszusage → Warnhinweis mit Risiko, erlaubt; Konkurrent kauft weg → Erklärung und Lernlink.
- **A11y:** Verlauf als Liste, neue Antwort per höflicher Live-Region.
- **AK:** AK-S18-1 Der Höchstpreis aus dem Kalkulator ist neben dem Gebotsfeld sichtbar; AK-S18-2 Jedes Gebot erscheint im Exposé-Verlauf.

#### S-20 Portfolio-Übersicht · [P3 basic · P5 vollständig]
- **Zweck/Fragen:** „Wie steht mein ganzer Bestand da, wo sind Schwachstellen, wo Hebel?“ Muss 1 bis 200 Objekte tragen (Audit 5.3: Kartenwand).
- **Inhalte:** Summenleiste (Objekte, Einheiten, Marktwert, Restschuld, Beleihung gesamt, CF n. Fin., CF n. St., Leerstand); **Linsen**: Cashflow (CF je Objekt, Rate, Leerstand) · Finanzierung (Restschuld, Zins, Bindungsende, Beleihung) · Risiko (Zustand, Energie, Klumpen Region/Kostenträger, Risiko-Indikator) · Steuern (Ergebnis V+V, AfA, Fristen) · Wert (Marktwert-Band, Δ seit Kauf, EK im Objekt); Ansichten Tabelle / Karten / Karte (Kreise mit eigenen Objekten); Gruppierung nach Region, Objektart, Bank.
- **Aktionen:** Zeile → S-21; Massenaktionen auf Auswahl (Mieterhöhung prüfen, Verwaltung beauftragen, Bewertung anfordern); „Ansicht speichern“; „Stresstest auf Portfolio“ (S-32).
- **Zustände:** leer: „Noch kein Objekt. Im Markt findest du Angebote, die zu deinem Rahmen passen.“; 1 Objekt: Tabelle trotzdem, plus Objektkarte; Profi: kompakt, 20+ Spalten verfügbar.
- **Layout:** Desktop Liste │ Detail │ Erklärung; mobil Karten mit 3 Linsenwerten und Sortier-Chips.
- **A11y:** Grid mit Zeilenauswahl per Leertaste, Massenaktionsleiste als `toolbar` mit Anzahl („3 Objekte ausgewählt“).
- **AK:** AK-S20-1 200 Objekte / 1.000 Einheiten flüssig; AK-S20-2 Summenleiste = Summe der Zeilen (Test); AK-S20-3 jede Linse zeigt Bewertung mit Icon + Text.

#### S-23 Vermietung: Inserat & Bewerberauswahl · [P3 basic · P4 vollständig]
- **Zweck/Fragen:** „Zu welcher Miete inseriere ich, wen nehme ich, was riskiere ich?“ (Audit 7: Mietband und Bewerberliste behalten, mit Folgen.)
- **Inhalte:** Mietpreis-Festlegung mit Band (Nachfrage je Preis, Vergleichsmiete, **Mietpreisbremse der Gemeinde** mit Grenze und Stand), Live-Warnung bei Überschreitung; Vermarktungsweg (selbst/Makler, Kosten); Bewerberliste (Einkommen/Miete-Verhältnis, Beschäftigung, Haushalt, Unterlagen vollständig?, SCHUFA geprüft?, Einzugstermin) – Unterlagen-Prüfung kostet Zeit; Folgen der Auswahl als Risiko-Text.
- **Aktionen:** **„Inserat für 640 € kalt schalten (ab Dez. 2026)“**; „Bewerber prüfen“; **„Mietvertrag mit Familie Kaya schließen – 640 € kalt, Beginn Feb. 2027“** (O-04).
- **Zustände:** Inserat läuft (keine erneute Würfelmöglichkeit, Audit 5.4); keine geeigneten Bewerber → Optionen (Preis senken, länger warten, Makler); Mietpreisbremse greift → Maximum begründet.
- **A11y:** Bewerber als Tabelle/Karten mit Vergleichsmodus; Risiko nicht nur als Farbe.
- **AK:** AK-S23-1 Miete über der zulässigen Grenze ist nicht abschließbar und begründet; AK-S23-2 Bewerberwahl beeinflusst sichtbar dokumentierte Risikowerte.

#### S-24 Instandhaltung & Modernisierung · [P4]
- **Zweck/Fragen:** „Was ist wann fällig, was kostet es, was bringt es – Miete, Wert, Steuer, Energie?“
- **Inhalte:** Bauteilplan (Bauteil, Alter, Zustand, erwartete Erneuerung als Bandbreite, Kosten), Maßnahmen-Planer: Kosten, Dauer, Auswirkungen (Mietumlage § 559 mit Kappung, Wert, CO₂-Stufe, Energieklasse), **steuerliche Einordnung** (Erhaltungsaufwand vs. Herstellungskosten, Stand 15-%-Grenze aus S-30), Angebote von Handwerkern (Spielwelt-Figuren mit Interessenhinweis), Mieter betroffen?
- **Aktionen:** **„Badsanierung beauftragen – 14.800 €, ca. 2 Monate, Mieter wird informiert“** (vorgemerkt bis Monatsende, bei > Reserve Prüfschritt); „3 Angebote einholen“.
- **Zustände:** Maßnahme läuft (Tracker); Überschreitung 15-%-Grenze droht → Warnung mit Betrag und Alternative (zeitlich strecken); Mieter muss zustimmen/ankündigen → Fristen sichtbar (Audit 5.4: Mieter ohne Rückfrage gekündigt).
- **A11y:** Bauteilplan als Tabelle mit Zeitleiste als Zusatz.
- **AK:** AK-S24-1 Jede Maßnahme zeigt Wirtschaftlichkeit (Kosten vs. Mehrmiete/Wert/Steuer) vor Beauftragung; AK-S24-2 Auswirkung auf vermietete Einheiten wird vorher genannt.

#### S-25 WEG-Bereich · [P4]
- **Zweck/Fragen:** „Was zahlt meine Wohnung an die Gemeinschaft, wie gesund ist die Rücklage, was wird beschlossen?“
- **Inhalte:** Hausgeld (aufgeschlüsselt, umlagefähig ja/nein), Erhaltungsrücklage gesamt und anteilig (MEA), Wirtschaftsplan, Jahresabrechnung, Beschlusssammlung, anstehende Eigentümerversammlung mit Tagesordnung, Sonderumlagen.
- **Aktionen:** Abstimmungsverhalten je Beschluss (O-04 mit Folgen: Sonderumlage, Werterhalt), „Protokolle lesen“, „Verwalter kontaktieren“.
- **Zustände:** keine ETW im Bestand → Bereich erklärt, wann er relevant wird (Navigation bleibt stabil, Eintrag im Objekt-Menü nur bei ETW).
- **AK:** AK-S25-1 Hausgeld-Übersetzer zeigt für jede Position umlagefähig ja/nein mit Begründung.

#### S-26 Verkauf-Assistent · [P5]
- **Zweck/Fragen:** „Was bekomme ich netto, wenn ich verkaufe, und lohnt es sich jetzt?“
- **Inhalte:** Wertermittlung (Band, Methode, Gutachten-Option), Vermarktungsdauer (Band), **Erlös-Wasserfall**: Verkaufspreis → − Maklerkosten → − Vorfälligkeitsentschädigung (falls in Bindung) → − Restschuld → − Steuer (§ 23 EStG, falls innerhalb 10 Jahren; AfA-Rückrechnung) → = Netto-Erlös; Vergleich „verkaufen vs. halten“ über 5 Jahre; Hinweis gewerblicher Grundstückshandel bei vielen Verkäufen (nur Warnung).
- **Aktionen:** „Verkauf vorbereiten (Gutachten 900 €)“, **„Objekt für 645.000 € inserieren“**, später **„Kaufvertrag über 638.000 € beurkunden“** (O-05).
- **Zustände:** Spekulationsfrist läuft → prominenter Hinweis mit Datum der Steuerfreiheit; Verkauf läuft → Tracker.
- **AK:** AK-S26-1 Der geschätzte Wert entspricht der zentralen Wertfunktion (Audit 5.4: abweichende Schätzung); AK-S26-2 Netto-Erlös-Vorschau vor jedem Inserat.

#### S-29 Bank: Bonität, Kreditrahmen, Gespräche · [P5]
- **Zweck/Fragen:** „Wie viel traut mir die Bank noch zu, und wie wachse ich weiter?“
- **Inhalte:** Haushaltsrechnung nach Bankansatz (aktuell), **Kreditrahmen verbraucht/frei** je Bankprofil (Band), Beleihung je Objekt (< 80 %-Marke), Portfoliobetrachtung erreicht? (Bedingungen als Checkliste), Bankbeziehungen (Gespräche, Zahlungshistorie), Angebotsvergleich offener Anfragen.
- **Aktionen:** „Bankgespräch vereinbaren“ (Thema: Rahmen, Stundung, Kontokorrent), „Unterlagen aktualisieren“, „Dispo kündigen“.
- **Zustände:** Rahmen ausgeschöpft → Erklärung der zwei Hebel (Einkommen, Beleihungsdisziplin) mit Werten.
- **AK:** AK-S29-1 Die Anzeige „Rahmen frei“ stimmt mit der Entscheidungslogik der Bank überein (gleiche Funktion, Test).

#### S-31 Berichte & Export · [P4 Jahresbericht · P8 Export]
- **Zweck/Fragen:** „Gib mir die Zahlen schwarz auf weiß.“
- **Inhalte:** Monatsberichte (Archiv), Jahresberichte („Dein Investmentjahr 2027“), Vermögensaufstellung, Bank-Dossier (Lern-Artefakt), Steuerjahr.
- **Aktionen:** „Als PDF exportieren“, „Als CSV exportieren“, „Teilen“ (nur Bild/PDF, ohne Rangliste).
- **Zustände:** Export offline möglich; PDF trägt Disclaimer-Fußzeile.
- **AK:** AK-S31-1 CSV nutzt ASCII-Minus, Punkt als Dezimaltrenner nur auf Wunsch; Standard de-DE mit Semikolon.

#### S-32 Szenario-Labor / Stresstest · [P5]
- **Zweck/Fragen:** „Was passiert mit meinem ganzen Bestand, wenn …?“
- **Inhalte:** Voreinstellungen (Zins +2 Pp. bei allen Anschlüssen, 6 Monate Leerstand in 20 % der Einheiten, Mietausfall eines Kostenträgers, Sonderumlage, Wert −15 %, Heizungspflicht), eigene Kombination; Ergebnis: Liquiditätsverlauf (Band), Reichweite, Zeitpunkt der Unterschreitung, betroffene Objekte, Tornado über Portfolio-Treiber.
- **Aktionen:** „Stresstest ausführen“ (verändert das Spiel nicht – deutlich gekennzeichnet), „Als Szenario speichern“, „Gegenmaßnahme testen“.
- **Zustände:** Ergebnisse tragen Banner „Simulation außerhalb deines Spielstands“.
- **AK:** AK-S32-1 Stresstests verändern den Spielstand nachweislich nicht (Hash-Test).

#### S-33 Lernpfad & Challenges · [P6]
- **Zweck/Fragen:** „Was lerne ich als Nächstes?“
- **Inhalte:** Szenarien als Pfad (Die erste Wohnung → Nebenkosten & Leerstand → Steuern → Anschlussfinanzierung → Skalieren → Verkauf & Steuer; weitere: Sanierungsstau MFH, Mieterhöhung rechtssicher), je Szenario Lernziele, Dauer, Status, bestes Ergebnis im Raster; Challenges mit fester Frage und Musterlösung.
- **Aktionen:** „Szenario starten“, „Musterlösung ansehen“ (nach Abschluss), „Wiederholen“.
- **Zustände:** gesperrte Szenarien sichtbar mit Voraussetzung (keine versteckten Inhalte).
- **AK:** AK-S33-1 Jedes Szenario nennt vorher 1–2 Lernziele und endet mit einem Debrief.

#### S-34 Glossar · [P3 Grundbestand · P6 vollständig]
- **Zweck/Fragen:** „Was heißt das, wie rechnet man es, wo steht es?“
- **Inhalte:** Begriffe A–Z mit Kurzdefinition (1–3 Sätze, aus Recherche 10/11/12 Tooltips), Formel mit Beispiel, Rechtsgrundlage, Stand, verwandte Begriffe, Lektion; Suche mit Synonymen („LTV“ → Beleihungsauslauf).
- **Aktionen:** „In Erklär-Karte öffnen“, „Zur Lektion“.
- **AK:** AK-S34-1 Jeder inline verlinkte Begriff hat einen Glossar-Eintrag (Build-Test: keine toten Glossar-Links).

#### S-35 Mikro-Lektionen · [P6]
- **Zweck/Fragen:** „Erklär mir das in 3 Minuten an meinem Fall.“
- **Inhalte:** 2–4 Minuten, interaktiv (Regler, Mini-Rechnung mit Spielzahlen), Abschlussfrage; 22 Kernlektionen (Recherche 14, 6).
- **Aktionen:** „Lektion starten“, „Mit meinen Zahlen rechnen“, „Später“.
- **AK:** AK-S35-1 Jede Lektion ist ohne Maus und ohne Ton vollständig nutzbar.

#### S-37 Ziele, Meilensteine, Statistiken · [P3 Ziel · P6 vollständig]
- **Zweck/Fragen:** „Komme ich voran, und was folgt daraus?“
- **Inhalte:** aktive Ziele (Ist, Prognose-Band, Zieldatum), Lernziele, Meilensteine (Recherche 14, 4.3) mit verlinktem Wissen, Auszeichnungen für Sorgfalt (sparsam), Statistiken mit „Was folgt daraus?“-Satz.
- **Aktionen:** „Ziel anlegen/ändern“, „Meilenstein-Wissen öffnen“.
- **Zustände:** keine Streaks, keine Login-Belohnungen, keine Vermögens-Rangliste (B11).
- **AK:** AK-S37-1 Jede Statistik hat einen Interpretationssatz.

#### S-38 Regionen-Profil (Land/Kreis/Gemeinde) · [P2]
- **Zweck/Fragen:** „Wie ist diese Region – Preise, Mieten, Nachfrage, Regeln – und wie sicher sind die Daten?“
- **Inhalte:** Kopf mit Ebene und Breadcrumb (Bund → Land → Kreis → Gemeinde); Kennzahlen-Tabelle (Kaufpreis €/m², Mietniveau €/m², Kaufpreisfaktor, Leerstand, Bevölkerung/Prognose, Haushalte, Kaufkraft, Arbeitslosenquote) **je Wert mit Flag, Quelle, Stand**; Rechtsraum (Grunderwerbsteuer, Mietpreisbremse, Kappungsgrenze, Kündigungssperrfrist, Milieuschutz) mit Gültigkeit; Vergleich mit Kreis/Land/Bund; Angebote in der Region; Karte mit Lage.
- **Aktionen:** „Angebote hier ansehen“, „Suchauftrag für diese Region“, „Mit Region vergleichen“.
- **Zustände:** fehlende Werte als „geschätzt“ mit Methode („aus Kreiswert übertragen“) – nie leer; Gemeinde ohne eigene Daten → Hinweis auf Kreiswert.
- **A11y:** Kennzahlen als Tabelle mit Flag-Spalte (Text).
- **AK:** AK-S38-1 100 % der angezeigten Regionalwerte haben Flag, Quelle und Stand; AK-S38-2 geschätzte Werte sind visuell und textlich unterscheidbar.

#### S-39 Einheiten & Mieter (portfolioweit) · [P4]
- **Zweck/Fragen:** „Wo im ganzen Bestand ist Handlungsbedarf bei Mieten und Mietern?“ (Skalierung auf 50+ Einheiten.)
- **Inhalte:** Tabelle aller Einheiten: Objekt, Einheit, Status, Mieter, Kaltmiete, €/m², Vergleichsmiete, Potenzial, Erhöhung möglich ab, Zahlungsstatus, Vertragsart, Mietbeginn; Gruppierung nach Objekt/Status; Schnellfilter „Erhöhung jetzt möglich“, „Rückstand“, „leer“.
- **Aktionen:** Massenaktion „Mieterhöhung prüfen (Sammel-Assistent)“, „Mahnung vorbereiten“, „Inserate schalten“.
- **AK:** AK-S39-1 Filter „Erhöhung jetzt möglich“ entspricht exakt den Regeln aus S-22.

#### S-40 Kalender „Demnächst“ · [P4]
- **Zweck/Fragen:** „Was kommt in den nächsten Monaten und Jahren auf mich zu?“ (Verzögerungen sichtbar, L6.)
- **Inhalte:** Zeitachse (Monate/Quartale/Jahre) mit Zahlungen (bekannt/geschätzt), Fristen (Zinsbindung, NKA, Sperrfristen, 15-%-Grenze, Spekulationsfrist, regulatorische Stichtage), Vorgangs-Meilensteinen; Filter nach Art/Objekt; Listenansicht.
- **Aktionen:** „Erinnerung als Stopp-Regel“, „Zum Vorgang“.
- **A11y:** Listenansicht ist gleichwertig und Standard für Screenreader.
- **AK:** AK-S40-1 Jede Frist aus Rechenkern und Regelwerk erscheint hier und in der Stopp-Regel-Auswahl.

#### S-41 Quellen, Datenstand & Lizenzen · [P2]
- **Zweck/Fragen:** „Woher stammen die Daten, wie aktuell sind sie, was ist vereinfacht?“
- **Inhalte:** Datenquellen mit Stand und Lizenz (z. B. Geodaten BKG VG250, dl-de/by-2-0 – Vermerk nach Nutzungsbedingungen), Rechtsstand der Spieldaten, Liste der Vereinfachungen (Flag DESIGN) mit Erklärung, Version des Regelwerks, Disclaimer im Volltext.
- **AK:** AK-S41-1 Jede im Spiel zitierte Quelle ist hier gelistet; Lizenzvermerke vollständig.

#### S-42 Kauf-Review nach 12 Monaten · [P6]
- **Zweck/Fragen:** „Hat sich der Kauf so entwickelt, wie ich erwartet habe?“
- **Inhalte:** Erwartet (Kalkulator-Snapshot und Tagebuch beim Kauf) vs. tatsächlich (12 Monate): Miete, Kosten, Leerstand, Zins, Steuer, Wert; Abweichungen mit Ursache (Entscheidung/Pech/Glück); eine Lernfrage.
- **Aktionen:** „Notiz ins Tagebuch“, „Annahmen für künftige Käufe anpassen“ (übernimmt z. B. realistischere Kostenquote als Standard).
- **AK:** AK-S42-1 Jede Abweichung > 10 % wird mit Ursache erklärt.

#### S-43 Krisen-Analyse & Lauf-Ende · [P5]
- **Zweck/Fragen:** „Warum ist es schiefgegangen, und wie mache ich es beim nächsten Mal besser?“ (Scheitern als Prozess, B9.)
- **Inhalte:** Ursachen-Zeitstrahl mit Entscheidungen, Tagebuch und Frühwarnungen (wann sichtbar, was angeboten wurde); Kennzahlen-Verlauf bis zum Ende; drei wichtigste Lehren; Erholungsoptionen je Modus.
- **Aktionen:** Lernmodus **„Zurück zum Entscheidungspunkt (Mär. 2027, vor Kauf Lindenau)“**; Standard „Szenario neu starten“ / „Neuer Lauf mit meinen Erkenntnissen“; „Analyse speichern“.
- **Zustände:** Ironman → kein Zurück, Analyse bleibt.
- **AK:** AK-S43-1 Jede Frühwarnung, die das Spiel gegeben hat, ist mit Datum im Zeitstrahl; AK-S43-2 kein Game-Over ohne vorherige Krisen-Stufen (O-08).

---
## 3. Überlagerungen und Flows

### 3.1 O-01 Erklär-Karte („Warum?“) · [P1 Datenvertrag · P3 UI]

**Zweck:** Jede Zahl wird herleitbar, ohne den Kontext zu verlassen. Wichtigstes Lernmittel neben dem Debrief.

**Datenvertrag mit dem Rechenkern (Voraussetzung, P1):** Jede angezeigte Kennzahl kommt als Objekt, nicht als nackte Zahl:

```ts
interface Kennzahl {
  schluessel: string;            // z. B. "cf.nachSteuern" → EK:cf.nachSteuern
  wert: Cents | Rate | number;   // exakter Wert
  bandbreite?: { min; max };     // bei Unsicherheit
  einheit: 'EUR' | 'PROZENT' | 'M2' | 'MONATE' | …;
  zeitbezug?: 'MONAT' | 'JAHR' | 'STICHTAG';
  stichtag: Spielmonat;
  status: 'BELEGT' | 'ABGELEITET' | 'GESCHAETZT' | 'DESIGN';
  enthaeltSchaetzung?: boolean;  // abgeleitet aus mind. einer geschätzten Eingabe
  enthaeltVereinfachung?: boolean;
  quelle?: { name; stand; lizenz?; url? };   // bei BELEGT/GESCHAETZT
  spielwelt?: { simuliertAb: Spielmonat; seed: string };
  herleitung?: Herleitungsknoten[];          // Formel mit eingesetzten Werten (Ebene 2)
  rechtsgrundlage?: string[];                // z. B. ["§ 558 BGB"]
  vereinfachungen?: string[];                // Texte-Schlüssel (Paraglide)
  glossar?: string[];  lektion?: string;
}
```
Texte erzeugt der Rechenkern nie; er liefert Schlüssel und Parameter, die UI formuliert (Tech-Stack 22, 5.8).

**Drei Ebenen** (schrittweise aufklappbar, Standard: Ebene 1 offen, Ebene 2 als „Herleitung ansehen“):

| Ebene | Inhalt | Regeln |
|---|---|---|
| **1 Aussage** | Kopf: Name, Wert mit Einheit/Zeitbezug, **Status-Flag** (K-06), Bewertung (falls vorhanden). Ein Satz in Alltagssprache mit echten Zahlen. | ≤ 25 Wörter, du-Form, keine Fachbegriffe ohne Glossar-Link |
| **2 Herleitung** | Formel als kleine Tabelle oder Mini-Wasserfall mit **eingesetzten Werten**; jeder Posten ist wieder antippbar (verschachtelt); bei Bandbreite: was die Bandbreite treibt | Summe der Posten = Wert (getestet); max. 8 Zeilen, Rest gruppiert |
| **3 Grundlage** | Annahmen (bearbeitbar → öffnet Kalkulator/Einstellung), Quelle + Stand + Lizenz, Spielwelt-Hinweis, Rechtsgrundlage, **Vereinfachungen**, Glossar, Mikro-Lektion, ggf. „Prüfung fällig“ | jede Vereinfachung ein eigener Satz („Vereinfachung im Spiel: ohne Soli und Kirchensteuer.“) |

**Verschachtelung ohne Stapel:** Ein Klick auf einen Posten in Ebene 2 ersetzt den Inhalt der Karte durch die Karte des Postens. Oben erscheint ein Pfad („Netto-Cashflow › Steuereffekt › AfA“) mit Zurück. Es gibt **nie** zwei übereinanderliegende Popover oder Sheets (Recherche 21 B13 Punkt 8). Maximal 5 Pfadstufen, danach „Im Glossar weiterlesen“.

**Darstellung je Breite:**

| Breite | Form | Verhalten |
|---|---|---|
| ≥ 1200 px | **Popover** am Auslöser (max. 400 px breit) oder **angeheftet** in der Erklär-Spalte | „Anheften“ verschiebt die Karte in die rechte Spalte; sie bleibt dort beim Ändern von Annahmen und aktualisiert sich live (Wert und Herleitung) |
| 840–1199 px | Popover; angeheftet als nicht-modales Seitenpanel über dem Detail | wie oben |
| < 840 px | **Bottom Sheet** (halbe Höhe, ziehbar auf volle Höhe; Griff + Schließen-Knopf) | tiefere Ebenen im selben Sheet; „Als Seite öffnen“ für lange Inhalte; System-Zurück schließt bzw. geht eine Pfadstufe zurück |

**Öffnen und Schließen:** Öffnen per Klick/Tap/Enter/Leertaste auf die Kennzahl (bzw. `i`). Kein Öffnen nur per Hover; Hover zeigt nur einen Fokusring/Cursor-Hinweis. Esc schließt (bzw. geht eine Pfadstufe zurück, zweites Esc schließt), Fokus kehrt zum Auslöser zurück. Popover ist überfahrbar und bleibt, bis man es schließt (WCAG 1.4.13).

**Beispiel (Ebene 1–3, Desktop-Popover):**
```
┌ Netto-Cashflow · Dezember 2026 ───────────────── [abgeleitet ƒ] [Anheften] [×] ┐
│ +38 €/Monat nach Steuern                                     ✓ solide           │
│ Dir bleiben nach allen Kosten, der Bankrate und der Steuer 38 € im Monat.       │
│ ▾ Herleitung                                                                     │
│   Kaltmiete (Ist)                      690,00 €  ›                               │
│   − nicht umlagefähige Kosten           95,00 €  ›                               │
│   − Instandhaltungs-/Mietausfallreserve 81,00 €  ›  (nur Liquiditätssicht)       │
│   − Zinsen                             615,00 €  ›                               │
│   − Tilgung                            197,00 €  ›                               │
│   = Cashflow vor Steuern              −298,00 €                                  │
│   + Steuereffekt (Erstattung, anteilig) 336,00 €  ›  [Vereinfachung ⧉]           │
│   = Netto-Cashflow                     +38,00 €                                  │
│ ▸ Grundlage: Annahmen (Grenzsteuersatz 42 % – ändern), Stand Dez. 2026,          │
│   Vereinfachungen (2), Glossar: Cashflow, AfA · Lektion „Cashflow-Kaskade“ (3 Min.)│
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Akzeptanzkriterien:**
- AK-O01-1: 100 % der Kennzahlen im UI haben eine Erklär-Karte mit Ebene 1; alle berechneten Kennzahlen haben Ebene 2 (Build-Test über `schluessel`-Registry).
- AK-O01-2: Summe der Herleitungsposten = angezeigter Wert (± Rundung der Anzeige), automatisiert geprüft.
- AK-O01-3: Status-Flag, Quelle und Stand sind in Ebene 1 bzw. 3 immer vorhanden; Spielwelt-Werte sind als simuliert gekennzeichnet.
- AK-O01-4: Tastatur: öffnen, Pfad vor/zurück, anheften, schließen ohne Maus; Fokus kehrt zurück; mobil kein gestapeltes Sheet.
- AK-O01-5: Angeheftete Karte aktualisiert sich bei Annahmeänderung ohne Fokusverlust im Eingabefeld.

### 3.2 O-04 Entscheidungsdialog mit Folgenvorschau · [P3]

**Wo:** eingebettet im Posteingang-Detail (S-09); von anderen Orten als modaler Dialog (Desktop/Tablet, max. 880 px) bzw. Vollseiten-Sheet (mobil).

**Anatomie (feste Reihenfolge):**
1. **Kopf:** Was ist zu entscheiden · Frist (K-08) · Objekt · wer fragt, mit Interessenhinweis.
2. **Kontext:** 1–3 Sätze, Fakten mit Kennzahlen.
3. **Optionen als Karten** (2–4, K-16), je: Titel · Einmalkosten · monatlicher Effekt · Risikoveränderung (K-07) · Zeitbedarf · „Was du dabei lernst/aufdeckst“. Eine Option ist nie vorausgewählt, außer bei Folgeentscheidungen mit klarer Empfehlung des Modells – und dann gekennzeichnet als „Standard“.
4. **Vorher → Nachher** (K-17) der betroffenen Kernkennzahlen für die gewählte Option: Liquidität, Netto-Cashflow/Monat, Beleihung, Reichweite, ggf. Steuer/Jahr. Unsichere Werte als Bandbreite. Spalte „Δ“ mit Vorzeichen. Hinweis, **wann** die Wirkung eintritt („ab Mär. 2027“).
5. **Standardfolge** bei Nicht-Entscheidung, ausdrücklich und konkret.
6. **Erwartung notieren** (optional, ein Satz; Platzhalter-Beispiel, nie Pflicht) → Tagebuch mit Informationsstand-Snapshot.
7. **Fuß:** sekundär „Mentor-Check“ (Lernmodus), „Vormerken“, „Abbrechen“; primär **konkreter Knopftext** der gewählten Option.

**Regeln:**
- Primärknopf ist deaktiviert, bis eine Option gewählt ist, und benennt dann Handlung + Betrag + ggf. Zeitraum. Deaktivierte Knöpfe nennen den Grund im Fuß („Wähle eine Option.“).
- Teure/unumkehrbare Optionen führen nach dem Primärknopf in den **Prüfschritt** (O-05); umkehrbare werden **vorgemerkt** (O-14).
- Mentor-Check stellt 2–3 Prüffragen passend zur Lage („Wie viele Monate reicht deine Reserve nach dieser Zahlung?“) und zeigt Antworten erst auf Wunsch; er wählt nie eine Option.
- Der Dialog ist nicht zeitkritisch; Schließen ohne Entscheidung ist immer möglich.

```
┌ Anschlussfinanzierung Darlehen D2 · Frist Jan. 2027 · Gohlis ETW · von: Stadtsparkasse (verkauft Kredite) ┐
│ Deine Zinsbindung endet im Feb. 2027. Restschuld 121.480 €.                                                │
│ ┌○ Prolongation 3,95 %┐ ┌● Bank B 3,62 %──────┐ ┌○ Verkaufen───────────┐                                   │
│ │+178 €/M Rate        │ │+145 €/M Rate        │ │Erlös ~38–52 Tsd. €   │                                   │
│ │kein Aufwand         │ │Wechselkosten ~450 € │ │Steuer: keine (> 10 J.)│                                   │
│ └─────────────────────┘ └─────────────────────┘ └──────────────────────┘                                   │
│ Vorher → Nachher (ab Mär. 2027)   Liquidität 12.812 → 12.362 €  Δ −450 € │ CF n.St. +38 → −83 €/M Δ −121 € │
│ Ohne Entscheidung: Prolongation zu 3,95 % ab Feb. 2027.                                                     │
│ Erwartung notieren: [ z. B. „Zinsen sinken bis 2030 nicht.“                                   ]            │
│ [Mentor-Check] [Vormerken]                         [Anschlussfinanzierung bei Bank B abschließen – 3,62 % ▸] │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Akzeptanzkriterien:** AK-O04-1 jede Option zeigt Einmalkosten, Monatseffekt, Risiko und Zeit; AK-O04-2 Vorher/Nachher zeigt Δ mit Vorzeichen und Wirkungsbeginn; AK-O04-3 Standardfolge immer sichtbar; AK-O04-4 Knopftexte nie „OK/Ja/Bestätigen“; AK-O04-5 Dialog nach APG (Fokus hinein, Fokusfalle, Esc, Fokus zurück), Optionen als Radiogruppe.

### 3.3 O-05 Prüfschritt für teure oder unumkehrbare Aktionen · [P3]

**Wann (abschließende Liste, erweiterbar nur per Review):** Beurkundung Kauf/Verkauf · Annahme eines Darlehensangebots · Anschlussfinanzierung · Kündigung eines Darlehens/Vorfälligkeit · Sondertilgung oder Ausgabe, die die Reserve-Schwelle unterschreitet · Maßnahmen > 10.000 € · Mietvertrag kündigen/Räumung · Gründung einer Gesellschaft [P7] · Notverkauf. **Nicht** für Routine (Merken, Filter, Notizen, Inserat, vorgemerkte Mieterhöhung).

**Aufbau:**
- Titel als Frage nach dem Konkreten: „Kaufvertrag über 189.000 € beurkunden?“
- **Zusammenfassung** (5–8 Zeilen): was genau passiert, Beträge, Termine, Bindung.
- **Folgen** (Vorher/Nachher, kompakt) inkl. Reichweite danach.
- **Offene Punkte** aus der Prüfung (z. B. „Protokolle der Eigentümerversammlung nicht angefordert“, „Keine Finanzierungszusage“) mit Risiko-Indikator und Link „Jetzt nachholen“ – nicht blockierend, aber prominent.
- Lernmodus: Hinweis „Vor dieser Entscheidung wurde ein Checkpoint angelegt.“ und „Mentor-Check“.
- Fuß: sekundär **„Zurück zur Bearbeitung“** (Standardfokus!), primär konkreter Knopf („Kaufvertrag über 189.000 € beurkunden“). Kein Ja/Nein, keine Checkbox „Ich habe verstanden“.

**Akzeptanzkriterien:** AK-O05-1 Standardfokus liegt auf „Zurück zur Bearbeitung“, Enter löst nie versehentlich die teure Aktion aus; AK-O05-2 offene Prüfpunkte werden vollständig gelistet; AK-O05-3 Prüfschritt erscheint höchstens einmal pro Aktion (keine Bestätigungsketten).

### 3.4 Rückgängig, Vormerken, Bestätigen (O-07, O-14)

| Aktionstyp | Beispiele | Muster | Rücknahme |
|---|---|---|---|
| **billig & umkehrbar** | Merken, Notiz, Filter, Ansicht speichern, Info archivieren, Einstellung ändern | sofort ausführen + **Toast „Rückgängig“** (≥ 8 s, pausiert bei Fokus/Hover) | `Strg+Z` oder Toast, im laufenden Monat auch über O-14 |
| **umkehrbar bis Monatsende** | Instandhaltung beauftragen, Mieterhöhung versenden, Inserat schalten, Sondertilgung innerhalb Reserve, Entscheidung im Posteingang | Status **„vorgemerkt“**; gilt mit „Weiter“ | Liste **„Entwürfe des Monats“** (O-14) über die Zeitleiste („3 vorgemerkt“): ändern, zurücknehmen |
| **teuer/unumkehrbar** | siehe 3.3 | **Prüfschritt** | nach Ausführung nur im Lernmodus über Checkpoint |
| **destruktiv (Meta)** | Spielstand löschen | Bestätigung mit Namen, Papierkorb 30 Tage | Papierkorb in S-03 |

**Undo-Grenze:** Mit „Weiter“ werden alle Vormerkungen verbindlich; danach gibt es kein Undo (realistisch). Die Zeitleiste zeigt vor dem Weiterklicken „3 vorgemerkte Aktionen werden jetzt ausgeführt“ als Zeile im Weiter-Menü (keine Rückfrage). Lernmodus: automatische Checkpoints vor jeder Prüfschritt-Aktion und zu Jahresbeginn; „Zurück zum Entscheidungspunkt“ in S-03/S-43.

### 3.5 Rückmeldungen: Toast, Banner, Inline, Statusmeldung (O-07)

| Art | Wofür | Wofür nie | Verhalten |
|---|---|---|---|
| **Toast** (K-23) | Erfolg mit Rückgängig, Monatsabschluss im ruhigen Modus, „Inserat geschaltet“ | Fehler, Warnungen, Pflichtinfos | Desktop unten rechts, mobil über der Zeitleiste (verdeckt sie nie); max. 1 sichtbar, Warteschlange 3; ≥ 8 s, pausiert bei Hover/Fokus; `role="status"` |
| **Banner** (K-24) | Zustände, die anhalten: Liquidität kritisch, Spielwelt-Hinweis, Angebot verloren | kurzlebige Bestätigungen | oben im Inhaltsbereich, Icon + Text + Aktion; einklappbar, nicht wegklickbar solange Zustand besteht |
| **Inline** | Feldvalidierung, Hinweise an Ort und Stelle | – | unter dem Feld, verbunden über `aria-describedby`; Fehlertext nennt Lösung |
| **Statusmeldung** | „Gespeichert“, „83 Angebote“, „Simulation bei Feb. 2027“ | – | unsichtbare Live-Region (höflich), entprellt, nie auf großen Containern (Audit 5.7) |
| **Posteingang** | Ereignisse mit Handlungsbedarf | Routine | Badge + Stopp-Regel |

