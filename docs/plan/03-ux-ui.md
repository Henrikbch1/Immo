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


> **Querverweise (Nummerierung):** Frühere Abschnitte verweisen auf „Kap. 3.9“ (Jahresabschluss-Ablauf → hier **3.7**), „Kap. 3.11“ (Modell-Progression, Musterprüfung → hier **3.8.2** und **3.11**), „Kap. 5.2“ (Figuren siezen → **5.2**), „Kap. 5.4“ (Start-Disclaimer → **5.4**), „Kap. 4.4“ (Zielgrößen → **4.4**), „Kap. 7.1/7.3“ (DoD, Usability-Aufgaben → **7.1/7.3**). Die Kapitelnummern 4.4, 5.2, 5.4, 7.1 und 7.3 sind unten bewusst so vergeben.

### 3.6 O-08 Krisen-Flow · [P5] (Szenario „Erste Krise“ bereits in P3 als Skript)

**Zweck:** Scheitern ist ein Prozess mit Warnungen, Optionen und Lernertrag, nie ein plötzliches Game Over (B9, B13 Nr. 13, AK-S43-2). Der Flow verbindet Cockpit-Banner, Liquiditäts-Screen (S-27), Entscheidungsdialoge (O-04) und die Krisen-Analyse (S-43).

**Eskalationsstufen (Zustandsautomat des Rechenkerns, UI zeigt nur den Zustand):**

| Stufe | Auslöser (Beispiele, Schwellen aus Fachspezifikation 10/12) | Anzeige | Zeitleiste |
|---|---|---|---|
| **0 solide** | Reichweite ≥ Reserve-Schwelle (Standard 6 Monate Ausgaben) | nichts Besonderes | normal |
| **1 Frühwarnung („beobachten“)** | Prognose zeigt Lücke in ≤ 12 Monaten **oder** Reserve < Schwelle | Risiko-Indikator „beobachten“ (K-07), Mentor-Hinweis (Standard/Lernmodus), Eintrag im Posteingang „Liquidität: Lücke ab Aug. 2027 absehbar“ (Info, kein Badge) | Stopp-Regel „Liquiditätslücke absehbar“ (einmal je Lücke) |
| **2 Kritisch** | Lücke in ≤ 3 Monaten oder Reichweite < 1 Monat | Banner (K-24) in jedem Screen, Zeitleiste zeigt „Liquidität kritisch“ (Warn-Icon + Text) | **hält an**, jedes „Weiter“ fragt vorher nach Option (Menü: „Trotzdem weiter“ im Profi-Modus) |
| **3 Zahlungsstörung** | Rate/Hausgeld nicht bezahlbar | Pflicht-Entscheidung im Posteingang (O-04) mit Frist ≤ 1 Monat; Bank-Brief (Mahnung) | hält an |
| **4 Kündigung & Zwangsversteigerung** | Kreditkündigung nach Verzug, Terminbestimmung Versteigerung (realistische Monate Vorlauf) | Tracker (K-14) „Zwangsversteigerung“ mit Terminen; letzte Optionen (Freihandverkauf, Vergleich) | hält an bis Entscheidung |
| **5 Lauf-Ende** | Versteigerung vollzogen oder Insolvenz | Übergang zu S-43 | Spiel pausiert |

Zwischen jeder Stufe liegt mindestens ein Spielmonat, außer ein Einmalereignis (Großschaden) löst Stufe 2 direkt aus; dann steht die Frist im Dialog. Rückstufung ist möglich (Stufe 2 → 1, wenn Gegenmaßnahmen wirken); Banner und Zeitleiste folgen dem Zustand.

**3.6.1 Frühwarnung (Stufe 1)**

- Auftritt **dreifach, aber ruhig**: Risiko-Indikator in der Liquiditätskachel (S-06), Karte „Frühwarnung“ in S-27 mit Datum der Lücke und Bandbreite („Lücke ab Aug. 2027, −2.400 bis −5.800 €“), ein Mentor-Hinweis (O-03, max. einer). Kein Modal, kein Ton.
- Die Warnung nennt **Ursache und Hebel** in einem Satz: „Ab Aug. 2027 fehlen Geld für Rate und Hausgeld, weil die Zinsbindung von D2 endet (+121 €/Monat) und die Sonderumlage fällig wird.“ Jeder Wert öffnet O-01.
- Eingang jeder Frühwarnung wird mit Datum in der Chronik (S-10) abgelegt; S-43 liest sie von dort (AK-S43-1).

**3.6.2 Optionen mit Folgenvorschau (Stufen 2–3)**

Eine Entscheidung „Liquiditätslücke schließen“ im Format O-04: Optionskarten sind **kombinierbar** (Mehrfachauswahl, Summe wird live gezeigt), dazu eine Deckungsleiste „Lücke gedeckt: 71 %“ (Bullet Graph, K-07-Variante).

| Option | Einmalkosten / Preis | Monatseffekt | Risiko & Nebenwirkung | Lerninhalt |
|---|---|---|---|---|
| **Kosten senken** (Sparrate aussetzen, Maßnahmen verschieben) | 0 € | + Spielraum | Verschiebung kann Schaden vergrößern | Instandhaltung vs. Liquidität |
| **Kontokorrent/Dispo** | Zins ~11–13 % p. a. | − Zinsen | teuer, Limit begrenzt | Kosten kurzfristiger Liquidität |
| **Bankgespräch** (Tilgungsaussetzung, Stundung) | ggf. Gebühr, Bonitätsvermerk | − Tilgung, + Zinslast | schlechtere Konditionen im Rahmen (S-29) | Bankbeziehung |
| **Nachschuss aus Gehalt/Rücklagen** | – | − verfügbares Einkommen | Reserve privat sinkt | Haushaltsrechnung |
| **Objekt verkaufen** (Notverkauf) | Abschlag 5–15 %, Vorfälligkeitsentschädigung, ggf. Steuer | − Miete, − Rate | unumkehrbar → **Prüfschritt O-05**; Dauer realistisch 3–6 Monate | Verkaufsprozess unter Druck |
| **Nichts tun** | – | Standardfolge ausdrücklich: „Rate Aug. 2027 platzt, Mahnung durch die Bank“ | → Stufe 3 | Folgen von Untätigkeit |

Regeln: jede Option zeigt **Wirkungsbeginn** und die **Reichweite danach**; Optionen, die das Problem nur verschieben, tragen den Hinweis „löst die Lücke bis Nov. 2027, danach erneut“. Der Mentor-Check (Lernmodus) fragt: „Was passiert in 6 Monaten, wenn die Miete weiter ausfällt?“ Kein Druck-Countdown; die Frist steht als Datum (K-08).

**3.6.3 Zwangsversteigerung (Stufe 4) und Lauf-Ende (Stufe 5)**

- Erst erreichbar, wenn alle Optionen aus 3.6.2 **verbraucht oder abgelehnt** sind (Prüfung im Rechenkern, AK-O08-2). Der Flow zeigt im Tracker die realistischen Schritte (Verzug → Kündigung → Antrag → Verkehrswert → Termin) mit Monaten.
- Auf jeder Stufe gibt es die **letzte Option „Freihandverkauf mit Bank abstimmen“**; sie ist teuer, aber besser als Versteigerung (Folgenvorschau zeigt beide Erlöse).
- Übergang zu S-43 mit ruhigem Ton: Überschrift „Dieser Lauf endet hier. Das ist eine realistische Folge, kein persönliches Versagen.“ Kein Rot-Vollbild, keine Animation, kein Sound. Fokus auf die Überschrift, Screenreader-Ansage „Lauf beendet, Analyse verfügbar“.

**3.6.4 Krisen-Analyse (S-43) – Ablauf**

| Schritt | Inhalt | Regel |
|---|---|---|
| 1 Zeitstrahl | Entscheidungen, Tagebuch-Einträge, Frühwarnungen, Ereignisse (Zins, Leerstand, Schaden) in einer geordneten Liste | Unterscheidung **Entscheidung** vs. **Pech/Glück** nach Informationsstand damals |
| 2 Kennzahlen-Verlauf | Liquidität, Reichweite, Beleihung bis Lauf-Ende, mit Marken „Frühwarnung gegeben“ | Tabellen-Fallback |
| 3 Drei Lehren | konkret, mit Link zu Mikro-Lektion und Glossar | nie mehr als drei |
| 4 Schattenrechnung | „Mit 6 statt 3 Monaten Reserve wäre die Lücke gedeckt gewesen“ + „damals erkennbar: ja/nein“ | gleiche Regeln wie 3.7.4 |
| 5 Weiter | je Modus (nächste Tabelle) | Optionen immer sichtbar |

**3.6.5 Erholung je Modus**

| Modus | Angebot | Mitgenommen | Primärknopf |
|---|---|---|---|
| **Lernmodus** | Checkpoint-Liste (automatisch vor jeder Prüfschritt-Aktion und zu Jahresbeginn); Vorschlag: der letzte Checkpoint **vor** der ersten Entscheidung der Ursachenkette | alles; Tagebuch bleibt, Analyse wird an den Checkpoint „geheftet“ | **„Zurück zum Entscheidungspunkt (Mär. 2027, vor Kauf Lindenau)“** |
| **Standard** | „Szenario neu starten“ (gleicher Seed) oder „Neuer Lauf mit meinen Erkenntnissen“ (neuer Seed, Vorsatz als Lernziel) | Glossar-Fortschritt, Meilensteine, Debriefs, Analysen; **kein Geld** | **„Neuer Lauf mit Vorsatz starten“** |
| **Ironman** (Challenges) | kein Zurück; Analyse bleibt abrufbar | Analyse, Meilensteine | „Analyse speichern“ |
| **Gezieltes Krisenszenario** (Zinsanstieg, Großschaden, Mietausfall; S-32/S-33) | Wiederholung mit anderer Strategie, Vergleich der Läufe nebeneinander | Läufe im Debrief-Archiv | „Mit anderer Strategie erneut versuchen“ |

**Microcopy-Beispiele:** Frühwarnung „Reichweite: 2,1 Monate. Deine Reserve-Schwelle liegt bei 6.“ · Stufe 2 „Dir fehlen im Aug. 2027 voraussichtlich 2.400 bis 5.800 €. Du hast noch 4 Monate, das zu ändern.“ · Analyse „Das hättest du am 14. Jan. 2027 sehen können: Warnung ‚Lücke absehbar‘.“ (sachlich, keine Schuldzuweisung).

**Akzeptanzkriterien:**
- AK-O08-1: Jede Stufe 1–4 hat Anzeige, Optionen und Standardfolge; kein Lauf-Ende ohne Durchlauf von Stufe 2 (Ausnahme Ironman-Challenge mit Hinweis im Start-Dialog).
- AK-O08-2: Stufe 4 ist nur erreichbar, wenn jede Option aus 3.6.2 gewählt, verbraucht oder abgelehnt wurde; Test per Simulationslauf mit Zufallsstrategien (kein Game Over in < 3 Spielmonaten nach Stufe 1).
- AK-O08-3: Keine Warnung wird nur über Farbe, nur über Ton oder nur über Toast gegeben (Icon + Text + Banner, Live-Region „höflich“ bei Stufenwechsel, „bestimmt“ nur bei Stufe 3).
- AK-O08-4: Krisen-Banner ist einklappbar, aber nicht wegklickbar, solange Stufe ≥ 2; Tastatur: Banner-Aktion erreichbar in ≤ 3 Tab-Stopps vom Seitenanfang.
- AK-O08-5: Erholungs-Knöpfe nennen Ziel und Datum; Ironman zeigt keinen „Zurück“-Knopf.

### 3.7 O-09 Jahresabschluss-Sequenz · [P4 Abschluss · P6 Debrief vollständig]

**Zweck:** Der Jahreswechsel bündelt Pflichten (Abrechnungen, Steuer) und den wichtigsten Lernmoment (Debrief nach After Action Review, B8). Inhalte der fünf Debrief-Karten stehen in S-36; hier steht der **Ablauf** davor und darum.

**3.7.1 Auslöser und Ablauf**

| Phase | Auslöser | UI | Dauer |
|---|---|---|---|
| **A Vorankündigung** | Nov. des Jahres: Stopp-Regel „Jahresabschluss in 2 Monaten“ (Standard) | Posteingang-Info + Kalender-Einträge (S-40): NK-Abrechnungsfristen, WEG-Jahresabrechnung, Steuer | – |
| **B Abschluss-Monat** | „Weiter“ von Dez. auf Jan. | Simulation läuft durch, hält **vor** dem Debrief an: Zeitleiste „Jahresabschluss 2027 bereit“ | – |
| **C Pflichten (Entscheidungen)** | direkt nach B | Posteingang-Gruppe „Jahresabschluss 2027“ (gebündelt, 1 Badge-Einheit je Entscheidung): NK-Abrechnung je Objekt, WEG-Jahresabrechnung prüfen, Steuererklärung | beliebig, Frist je Item |
| **D Jahresbericht** | nach B, parallel zu C abrufbar | S-31 „Dein Investmentjahr 2027“ | 1–2 Min. lesen |
| **E Debrief** | nach B (ab Lernmodus automatisch angeboten, Standard: Einladung, Profi: Link im Bericht) | 5 Karten (S-36) | 3–5 Min. |

Reihenfolge ist nicht erzwungen: Debrief kann vor den Pflichten erfolgen; die Zeitleiste zeigt „2 Pflichten offen“ statt zu blockieren. Das Spiel läuft erst weiter, wenn Pflichten mit **Frist im Folgemonat** entschieden sind (Standardfolgen akzeptieren ist möglich).

**3.7.2 NK-/WEG-Abrechnung (Phase C)**

| Schritt | Inhalt | Regeln |
|---|---|---|
| 1 Prüfung der WEG-Abrechnung (WEG-Objekte) | Posten gegen Wirtschaftsplan, Umlagefähigkeit (umlagefähig / nicht umlagefähig), Instandhaltungsrücklage | Abweichungen > 10 % markiert; Beschluss-Hinweis |
| 2 Betriebskostenabrechnung erstellen | Umlageschlüssel, Vorauszahlungen, Heizkosten, CO₂-Kostenaufteilung; Ergebnis **Nachzahlung/Guthaben je Einheit** | Fristhinweis (12 Monate nach Abrechnungszeitraum, Spielwelt-Vereinfachungen gekennzeichnet) |
| 3 Versand | Option „versenden“ (umkehrbar bis Monatsende → Vormerken, O-14) | nach „Weiter“ wirksam; Mieterreaktion als Ereignis im Folgemonat |

Ansicht: Tabelle je Einheit (K-09) mit Spalten Vorauszahlung · Kosten · Saldo · Frist; Wasserfall (K-13) „Vorauszahlungen → Kosten → Saldo“; Fehler bei nicht umlagefähigen Posten zeigen **Regelverweis** (O-01 Ebene 3).

**3.7.3 Steuer (Phase C, S-30)**

Karte „Einkommensteuer 2027 (Vereinfachung: ohne Soli und Kirchensteuer)“: Einkünfte V+V je Objekt (Mieten − Werbungskosten − AfA), Effekt auf Steuer (Erstattung oder Nachzahlung im Folgejahr), Verweis auf Szenario-Hinweis. Primär **„Steuererklärung 2027 einreichen“** (vorgemerkt, Wirkung mit Bescheid in 3–6 Monaten, sichtbar im Kalender). Jede Zahl mit Erklär-Karte und Disclaimer-Kurzhinweis (5.4: „Spielvereinfachung, keine Steuerberatung“).

**3.7.4 Jahresbericht und Debrief (D, E)**

- **Jahresbericht** (S-31): Vermögens-Wasserfall, 4 Kernkennzahlen mit Δ, wichtigste Entscheidungen, Lernfortschritt, Fristen des nächsten Jahres, **eine** Reflexionsfrage; Export PDF/Bild optional [P8], ohne Rangliste.
- **Debrief** (S-36, nach AAR): 1 Was war geplant · 2 Was ist passiert · 3 Warum (Entscheidung vs. Pech/Glück) · 4 Was mache ich anders. Bewertungsraster statt Gesamtpunktzahl.
- **Schattenrechnung:** je Debrief höchstens 2 Entscheidungen; Auswahl nach Wirkung (größter Unterschied zur stärksten Alternative) und Lernwert. Darstellung: Zwei-Spalten-Karte „Dein Weg“ vs. „Alternative“ mit Δ in €/Monat und Vermögen nach 5 Jahren (Bandbreite), darunter die Zeile **„Damals erkennbar besser: nein/ja/teilweise“** mit Begründung („Zinsvorsprung ab März 2027 war im Dezember 2026 nicht absehbar“). Die Rechnung nutzt ausschließlich den **Informationsstand-Snapshot** der Entscheidung (Tagebuch).
- **Fehlerkultur:** Wortwahl „Lehrgeld“ erlaubt, kein „Fehler gemacht“ gegen die Person; Bewertungsebene Aufgabe/Prozess.

**3.7.5 Zustände und Abkürzungen**

| Zustand | Verhalten |
|---|---|
| Erstes Jahr ohne Objekt | Pflichten entfallen; kurze Sequenz (Zahlen, Lernfortschritt, Vorsatz) |
| Krisenjahr | Karte 3 mit Krisenverlauf, Link zu S-43 |
| Profi | Pflichten als Tabelle auf einer Seite, Debrief als eine Seite, überspringbar |
| Unterbrochen | „Später fortsetzen“ speichert Stand; Zeitleiste „Debrief offen“ (kein Badge) |
| Mobil | je Karte Vollseite, Fortschritt „3 von 5“, Knöpfe in Daumenzone |

**Akzeptanzkriterien:**
- AK-O09-1: Phase B hält immer an; Pflichten haben Frist, Standardfolge und Folgenvorschau; Jahresabschluss ist in ≤ 8 Minuten inkl. Debrief durchspielbar (Test).
- AK-O09-2: Debrief ist jederzeit überspringbar, fortsetzbar und über S-36 erneut abrufbar; Überspringen wird nicht bestraft (keine Sperren, kein Text mit Schuld).
- AK-O09-3: Schattenrechnung zeigt immer „damals erkennbar besser: …“ mit Begründung; fehlt der Snapshot, wird sie nicht angezeigt (statt zu raten).
- AK-O09-4: Steuer- und NK-Zahlen sind Kennzahl-Objekte (O-01) mit Vereinfachungen und Rechtsgrundlage.

### 3.8 Onboarding-Szenario „Die erste Wohnung“ (K1) · [P3 Ablauf · P6 Lernpfad-Einbindung]

**Ziel (B7):** In unter 2 Minuten zur ersten echten Entscheidung, ohne Textwand und ohne Registrierung. Das Tutorial **ist** ein Szenario im normalen Spiel, mit denselben Screens und Regeln. Kein separater Tutorial-Modus, keine Modal-Ketten, höchstens ein Hinweis (Coachmark, O-12) pro Bildschirm, immer überspringbar.

**3.8.1 Schritt für Schritt**

| Nr. | Schritt | Screen | Was die Spielerin tut | Hilfe (Lernmodus) | Lernziel |
|---|---|---|---|---|---|
| 0 | Start-Disclaimer (einmalig) | S-02 | liest drei Sätze, „Verstanden, los geht’s“ | – | Rahmen (5.4) |
| 1 | Startprofil in 3 Schritten | S-02 | Profil „Lena, 29“ wählen (oder „Mein echtes Profil“ / „Ich kenne mich aus“) | Zahlen sind fertig vorbelegt, Erklär-Karte an „Eigenkapital“ | Ausgangslage |
| 2 | Cockpit-Erstblick | S-06 | sieht 5 Kacheln, Zeitleiste „Nov. 2026 · 1 offen“ | **ein** Coachmark auf „Posteingang“ | Orientierung |
| 3 | Erster Posteingang-Eintrag | S-08/S-09 | „Suchauftrag anlegen?“ (Entscheidung mit Frist, Standard: „Vorschlag übernehmen“) | Optionen mit Lernhinweis | Entscheidung treffen |
| 4 | „Weiter“ → 3 Angebote | S-11 | Zeitleiste „Weiter“, Monat läuft, Treffer erscheinen | Coachmark „Weiter“ | Zeitmodell |
| 5 | **Angebot 1: Musterprüfung** | S-13/S-14 | folgt der Musterlösung (3.8.2), klickt „Weiter“ durch 5 Schritte | vollständig geführt | Bierdeckel → Vollkalkulation |
| 6 | **Angebot 2: Fading** | S-13/S-14 | füllt 2 von 5 Schritten selbst, Rest vorausgefüllt, „Prüfe meine Antwort“ | Hinweise nur auf Abruf | Kennzahlen deuten |
| 7 | **Angebot 3: allein** | S-13/S-14 | prüft ohne Führung, optional „Mentor-Check“ | nur Abruf | Transfer |
| 8 | Finanzierungsanfrage | S-17 | Anfrage stellen; erste Absage oder Zusage mit Begründung | Absage erklärt, „Finde heraus, warum die Bank abgelehnt hat“ funktioniert in < 60 s | Bankrechnung verstehen |
| 9 | Gebot und Kauf | S-18/S-19 | Gebot abgeben, Tracker beobachtet, Prüfschritt O-05 vor Beurkundung | Checkpoint vor Prüfschritt | Prozess, Dauern |
| 10 | Erste Vermietung | S-23 | Inserat, Bewerberauswahl | ein Coachmark | Vermieten |
| 11 | 12 Monate spielen | S-06/S-07 | „Weiter“ bis Ereignis, erster Monatsbericht | Monatsbericht-Coachmark „Was ist passiert?“ | Kennzahlen im Zeitverlauf |
| 12 | Kauf-Review und erster Debrief | S-42/S-36 | erwartet vs. tatsächlich, ein Vorsatz | Leitfragen sichtbar | Reflexion |

Erwartete Dauer: Schritte 0–4 ≤ 3 Minuten, bis zur ersten Kaufentscheidung ≤ 20 Minuten (Usability-Test 2 misst das). **Gezieltes Scheitern** (Productive Failure) kommt erst ab Szenario 2 (K2), nie in K1.

**3.8.2 Worked Example „Musterprüfung“ bei Angebot 1**

Fünf Schritte; links Angebot, rechts Musterlösung (Desktop: 2 Panes; mobil: Schritt-für-Schritt-Sheet). Jeder Schritt zeigt **Aufgabe, Musterlösung mit echten Werten, „Warum so?“ (O-01)**. Beispielwerte sind illustrativ.

| Schritt | Aufgabe | Musterlösung (Beispiel) | Gelernte Kennzahl |
|---|---|---|---|
| 1 Bierdeckel | Brutto-Mietrendite und Kaufpreisfaktor | „Kaltmiete 690 €/Monat × 12 = 8.280 € ÷ 189.000 € = 4,4 %. Faktor 22,8.“ | EK:rendite.brutto |
| 2 Nebenkosten | Kaufnebenkosten dazurechnen | „+ Grunderwerbsteuer, Notar, Makler (Spielwerte, Stand ausgewiesen) = 207.700 € Gesamtinvestition“ | EK:invest.gesamt |
| 3 Laufende Kosten | nicht umlagefähige Kosten, Instandhaltung, Mietausfallreserve | „− 95 € − 81 € = 514 € vor Zinsen“ | EK:cf.vorFinanzierung |
| 4 Finanzierung | Rate bei Zins und Tilgung | „Darlehen 170.000 €, 3,8 % + 2 % Tilgung → 822 €/Monat“ | EK:finanzierung.rate |
| 5 Ergebnis | Cashflow nach Steuern deuten | „−186 €/Monat vor Steuern, +38 € nach Steuern: Steuereffekt (vereinfacht) trägt den Cashflow. Frage: Reicht dir die Reserve, falls die Erstattung später kommt?“ | EK:cf.nachSteuern |

Darstellung: pro Schritt ein Mini-Wasserfall (K-13) mit Tabellen-Fallback; die Spielerin klickt auf Zahlen, um zu **entdecken**, woraus sie bestehen („Tippe auf *Cashflow*“). Im Fading-Schritt (Angebot 2) sind Schritte 1, 2 und 4 vorausgefüllt, 3 und 5 eigenständig mit **sofortiger, konkreter Rückmeldung** („Fast: Du hast die Mietausfallreserve vergessen, das sind 28 € im Monat.“). Bei Angebot 3 gibt es nur die Prüfliste (K-14) ohne Werte.

**3.8.3 Ausblenden der Hilfen (Fading) und Regeln**

| Hilfe | K1 Angebot 1 | Angebot 2 | Angebot 3 | ab Szenario 2 | Profi |
|---|---|---|---|---|---|
| Musterlösung | sichtbar | verborgen, „Lösung zeigen“ | verborgen | verborgen | aus |
| Coachmarks (O-12) | max. 1 je Screen, erstmalig | nur neue Screens | nur neue Screens | nur freigeschaltete Bereiche | aus |
| Mentor (O-03) | proaktiv bei Tragweite | auf Abruf + Prüffragen | auf Abruf | je Kompetenz | auf Abruf |
| Prüffragen im Dialog | 2–3 | 1–2 | 0–1 | nach Kompetenz | aus |
| Glossar-Unterstreichung | jedes erste Auftreten | wie Lernmodus | wie Lernmodus | jedes erste Auftreten | nur in Erklär-Karten |

Regel **Expertise-Umkehr:** Zeigen Prüfungen zweimal in Folge vollständig korrekte Antworten, wird die Hilfestufe für diese Aufgabe um eine Stufe gesenkt und das auch gesagt („Du prüfst sicher. Hinweise gibt es ab jetzt nur noch auf Abruf.“). Rücknahme jederzeit in S-04.

**Expertenweg:** „Ich kenne mich aus“ in S-02 → Einstufungs-Check mit 5 Fragen (Dauer ≤ 2 Minuten, überspringbar) oder direkt Sandbox mit allen Systemen (Hilfestufe Profi). Der Check **ersetzt** das Szenario nicht zwangsweise; K1 bleibt in der Akademie (S-33) jederzeit startbar.

**Skizze Schritt 5 (Desktop):**
```
┌ Angebot 1 · Muster-Prüfung · Schritt 3 von 5 ───────────────────────────── [Überspringen] ┐
│ Exposé: Gohlis, 52 m², 189.000 €    │ Laufende Kosten                                     │
│ Kaltmiete 690 €/M  [belegt]         │ Aufgabe: Was bleibt vor Zinsen?                      │
│ Hausgeld 240 €/M  [laut Exposé]     │ Musterlösung: 690 − 95 − 81 = 514 €/Monat  ›         │
│                                     │ [Warum so?]   [Zurück]            [Weiter: Finanzierung ▸] │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Akzeptanzkriterien:**
- AK-S02-5: Von „Neues Spiel“ bis zur ersten Entscheidung im Posteingang ≤ 2 Minuten (Median im Test 2).
- AK-K1-1: Kein Tutorial-Schritt blockiert die normale Navigation; Überspringen ist in jedem Schritt sichtbar; ein Coachmark höchstens einmal je Screen und Spielstand.
- AK-K1-2: Musterlösung nutzt die echten Werte des Angebots und dieselben Kennzahl-Schlüssel wie der Kalkulator (keine eigene Tutorial-Rechnung).
- AK-K1-3: Nach Abschluss von K1 sind Navigation und alle Bereiche unverändert sichtbar; neu Freigeschaltetes trägt „Neu“, taucht nie plötzlich auf (L8).

### 3.9 O-06 Befehlspalette & Tastenkürzel · [P3 Grundfunktion · P6 Aktionen vollständig]

**Zweck:** Schneller Zugriff für Profi-Persona PC; gleichberechtigter Weg für Tastaturnutzung (PE). Ersetzt keine Navigation und führt **keine Aktion mit Folgen direkt aus** (1.4).

**Öffnen:** `Strg+K` / `⌘K`, Suchsymbol in der App-Leiste (mobil: Vollbild-Sheet K-19), `/` in Listen fokussiert die **Listenfilterung**, nicht die Palette.

**Aufbau (Combobox + Listbox nach APG, `role="dialog"` mit `aria-modal`):**

| Bereich | Inhalt | Beispiele (Eingabe → Ergebnis) |
|---|---|---|
| Eingabefeld | Platzhalter „Suchen oder Befehl eingeben …“, Rücksetz-Knopf | – |
| Zuletzt benutzt | 5 Einträge, wenn Feld leer | „Kredite öffnen“, „Weiter bis Jahresende“ |
| **Aktionen** | Navigation und Befehle | „weiter jahr“ → „Weiter bis Jahresende“; „sondertilgung“ → öffnet Sondertilgungs-Assistent (S-28) |
| **Objekte & Einheiten** | nach Name/Adresse/Kürzel | „lindenau“ → Objekt-Detail Lindenau |
| **Angebote** | Merkliste und aktueller Markt | „gohlis 189“ → Exposé |
| **Glossar** | Begriffe | „afa“ → O-02 Glossar-Popover, Enter öffnet S-34 |
| **Einstellungen** | Schalter/Bereiche | „dunkel“ → S-04 Darstellung |

**Regeln**

- Suche tolerant (Umlaute, Teilwörter, Tippfehler ≤ 1), de-DE-Kollation; Ergebnisse gruppiert, max. 5 je Gruppe, „Alle anzeigen“ je Gruppe.
- Jeder Eintrag zeigt Icon, Titel, Kontext („Bestand › Lindenau“) und Tastenkürzel, falls vorhanden.
- Pfeiltasten wählen, Enter führt aus, `Strg+Enter` öffnet in neuem Pane (Desktop), Esc schließt, Fokus kehrt zum Auslöser zurück. `aria-activedescendant` für die aktive Option; Trefferzahl als Statusmeldung („7 Treffer“, entprellt).
- **Aktionen mit Folgen** (Sondertilgung, Kündigung, Verkauf) öffnen den zuständigen Dialog (O-04/O-05); Beträge sind nie über die Palette eingebbar.
- Befehle sind **verfügbarkeitsabhängig**: nicht verfügbare werden nicht angezeigt, sondern per Suche mit Begründung gefunden („Mieterhöhung: erst ab Nov. 2027 möglich“).
- Keine Tour-Befehle im Profi-Modus; im Lernmodus Befehl „Tour für diesen Bereich zeigen“.

**Tastenkürzel (Ergänzung zur Tabelle in 1.4, gleiche Regeln)**

| Kontext | Kürzel | Aktion |
|---|---|---|
| global | `Strg+K`, `?`, `Esc`, `Strg+Enter`, `Strg+Umschalt+Enter`, `g c/p/m/b/f/a` | siehe 1.4 |
| global | `Strg+,` | Einstellungen |
| Listen/Tabellen | `j`/`k`, Pfeile (Grid), `Enter` öffnen, `Leertaste` markieren, `Umschalt+Pfeil` Mehrfachauswahl | Navigation |
| Listen | `/`, `f` | Filter fokussieren / Filter-Sheet |
| Posteingang | `e` archivieren, `v` vormerken, `m` Mentor-Check (Einzeltasten) | Triage |
| Kalkulator | `Strg+1/2/3` | Szenario A/B/C |
| Erklär-Karte | `i`, `Pos1` zurück zur Wurzel, `Alt+←` Pfad zurück, `p` anheften | O-01 |
| Dialoge | `Strg+Enter` Primäraktion nur, wenn Option gewählt; nie im Prüfschritt (dort Standardfokus „Zurück“) | O-04/O-05 |

Alle Kürzel: in S-04 *Tastatur* umbelegbar, einzeln abschaltbar, Konfliktwarnung; Einzeltasten ruhen, solange der Fokus in einem Eingabefeld, in der Palette oder in einer Combobox liegt (WCAG 2.1.4). `?` zeigt die Übersicht (Dialog, gruppiert, durchsuchbar). Für Browser-Konflikte (Strg+K in Firefox-Adressleiste) gilt: `preventDefault` nur bei App-Fokus, Alternativkürzel `Strg+/`.

**Akzeptanzkriterien:** AK-O06-1 alle Hauptziele (Cockpit, Post, Markt, Bestand, Finanzen, Akademie) in ≤ 3 Tastenanschlägen erreichbar; AK-O06-2 Aktionen mit Folgen öffnen immer Dialog, nie direkte Ausführung; AK-O06-3 Palette per Screenreader bedienbar (Ansage von Gruppe, Trefferzahl, aktiver Option); AK-O06-4 jedes Kürzel hat Text-Alternative in der Oberfläche und kann abgeschaltet werden.

### 3.10 O-03 Mentor-Panel · [P3 Grundgerüst „Was kann ich hier tun?“ · P6 Mentor v1]

**Rolle (B5.9):** neutrale Coach-Figur außerhalb der Spielwelt, in Textform, du-Form. Der Mentor erklärt, stellt Prüffragen und verweist auf Lektionen. Er **entscheidet nie**, wählt nie eine Option vor und gibt keine Anlageempfehlung („unter diesen Annahmen …“, 5.2). Texte in P6 sind **vorgenerierte, fachlich geprüfte** Bausteine mit Auslöser-Regeln, kein Live-Modell.

**Zugang:** Fragezeichen-Knopf immer rechts in der App-Leiste (WCAG 3.2.6). Öffnet ein **nicht-modales Seitenpanel** (K-20) rechts (Desktop/Tablet) bzw. ein Bottom Sheet (mobil). Proaktive Hinweise (K-26) erscheinen als kleine Karte oben im Inhaltsbereich, nie als Modal, nie über Eingabefeldern, nie während Tippen.

**Panel-Inhalt (feste Reihenfolge):**

| Block | Inhalt |
|---|---|
| 1 Kontext | „Was kann ich hier tun?“ (3–5 Punkte, abhängig von Screen und Lage), je mit Aktion („Kalkulator öffnen“) |
| 2 Prüffragen | 2–3 Fragen zur aktuellen Lage („Wie viele Monate reicht deine Reserve nach dem Kauf?“), Antworten auf Wunsch eingeklappt, mit Link zur Kennzahl |
| 3 Lernen | passende Mikro-Lektion (Dauer), Glossar-Suche |
| 4 Hilfe | Tastenkürzel, „Tour für diesen Bereich zeigen“, Hilfestufe ändern |

**Proaktive Hinweise: Auslöser und Kalibrierung (nur hohe Tragweite und hohe Sicherheit, B5.9)**

| Auslöser | Lernmodus | Standard | Profi |
|---|---|---|---|
| Kauf ohne Liquiditätsreserve | Hinweis + Prüffragen | Hinweis | – |
| Zinsbindungsende in ≤ 12 Monaten ohne Anschlusslösung | Hinweis | Hinweis | – (Stopp-Regel reicht) |
| Frühwarnung Liquidität (Stufe 1, 3.6) | Hinweis | Hinweis | – |
| Erste Mieterhöhung zulässig | Hinweis | – | – |
| Abgelaufene Prüfpunkte vor Beurkundung (O-05) | in O-05 | in O-05 | in O-05 |

**Dämpfung:** höchstens **ein** proaktiver Hinweis je Bildschirmbesuch, höchstens 3 je Spielmonat. Jeder Hinweis bietet **„Warum zeigst du mir das?“**, **„Später“** und **„Nicht mehr zu diesem Thema“**. Häufigkeit sinkt mit nachgewiesener Kompetenz (Expertise-Umkehr, 3.8.3); ausgeblendete Themen sind in S-04 *Hilfe* wieder einschaltbar.

**Zustände:** *Leer* („Hier gibt es gerade nichts Besonderes. Frag mich gern etwas: …“ mit Glossar-Suche) · *Hinweis aktiv* (Karte + Badge-loser Punkt am Fragezeichen, nur mit Text im Tooltip/Namen) · *Profi* (Panel unverändert, keine Hinweise) · *Offline* (alles lokal, kein Unterschied).

**A11y:** Panel ist Region mit Überschrift, Fokus beim Öffnen auf die Panel-Überschrift, Esc schließt, Fokus zurück zum Auslöser; proaktive Karte ist `role="region"` ohne Fokusraub, höflich angekündigt („Hinweis vom Mentor: …“) und nur einmal.

**Akzeptanzkriterien:** AK-O03-1 Mentor wählt nie eine Option und formuliert nie „Du solltest“; AK-O03-2 jeder proaktive Hinweis hat die drei Knöpfe; AK-O03-3 höchstens ein Hinweis je Bildschirm; AK-O03-4 Panel verdeckt nie fokussierte Eingabefelder (WCAG 2.4.11); AK-O03-5 Textbausteine tragen Quelle/Prüfdatum im Content-Paket (`fach-pruefer`).

### 3.11 Modell-Progression im Lernpfad (Stufen der Darstellung) · [P3 Stufe 1–2 · P6 vollständig]

Der Rechenkern rechnet **immer** den vollen Realismus (L7). Die Oberfläche blendet gestuft ein; was noch nicht eingeführt ist, wird **als vereinfacht angezeigt**, nicht weggelassen.

| Stufe | Szenario/Lernpfad | Voll sichtbar | Vereinfacht angezeigt (Kennzeichnung) |
|---|---|---|---|
| 1 | K1 Erste Wohnung | Kaltmiete, Zins, Tilgung, Reserve | Nebenkosten, Instandhaltung, Leerstand als Pauschale („geschätzt, wird in K2 erklärt“); Steuern „vereinfacht: nach Steuern geschätzt“ |
| 2 | K2 Bewirtschaftung | + Nebenkosten, Instandhaltung, Leerstand, Mieterhöhung | Steuern pauschal |
| 3 | K3 Steuern | + AfA, Werbungskosten, Steuerwirkung | Anschluss/Zinsrisiko über Standardannahme |
| 4 | K4 Anschlussfinanzierung | + Zinsbindung, Prolongation, Umschuldung, Zinsstress | Bankrahmen für Portfolio vereinfacht |
| 5 | K5 Skalieren | + Beleihung, Kreditrahmen, Portfolio, Verkauf | – |

Kennzeichnung im UI: Status-Flag **DESIGN/„Vereinfachung“** (K-06) + Text „Steuern: pauschal geschätzt, wird in Szenario 3 erklärt“ + Link zur Lektion. In Standard/Profi sind alle Stufen sichtbar (0.5). Wechsel der Stufe: Banner „Neu: Steuern sind jetzt aufgeschlüsselt“ mit Link, Navigation unverändert.

---

## 4. Design-System (`packages/ui`, Tokens in `packages/config`)

**Prinzipien:** Tokens im DTCG-Format (2025.10) in drei Ebenen **Primitiv** (`color.blue.600`) → **Semantisch** (`color.text.default`, `color.status.critical.icon`) → **Komponente** (`kpi.tile.padding`). Build erzeugt CSS-Variablen für Tailwind 4 (`@theme`), Themes über `data-theme="hell|dunkel|kontrast"` und `data-dichte="komfortabel|kompakt"`. Komponenten verwenden **nur semantische Tokens** (Lint-Regel: keine Hex-Werte im Code). shadcn/ui-Bausteine auf Base UI werden über die Tokens umgestylt, nicht geforkt.

### 4.1 Farben (semantisch, hell/dunkel)

Kontrastziele: **Text ≥ 4,5:1** (großer Text ≥ 3:1), **UI-Elemente, Fokusring, Diagramm-Flächen und -Linien ≥ 3:1** gegenüber dem Hintergrund, jeweils in Hell **und** Dunkel. Die Werte unten sind der **Startvorschlag** (Kontrast gerechnet, WCAG-Formel); Designreview darf nachschärfen, nicht unterschreiten. CI prüft alle Token-Paare automatisch (Skript `tokens:kontrast`).

| Semantisches Token | Hell | Kontrast | Dunkel | Kontrast |
|---|---|---|---|---|
| `bg.page` / `bg.surface` | `#FFFFFF` / `#F4F6F8` | – | `#0F1318` / `#181D24` | – |
| `text.default` | `#14181F` | 17,8 : 1 auf Seite | `#E8EBEF` | 15,6 : 1 |
| `text.muted` | `#454F5C` | 8,3 : 1 | `#A8B0BC` | 8,5 : 1 |
| `text.subtle` (nur ≥ 14 px, nie für Pflichtinfo) | `#6B7482` | 4,7 : 1 | `#7C8695` | 5,1 : 1 |
| `border.control` (Felder, Schalter, Karten mit Funktion) | `#6B7482` | 4,7 : 1 (≥ 3) | `#7C8695` | 5,1 : 1 |
| `border.decor` (reine Trenner) | `#D5DAE1` | – | `#2B323C` | – |
| `action.primary` (Fläche) / Text darauf | `#1F4FD8` / `#FFFFFF` | 6,6 : 1 | `#8FB0FF` / `#0F1318` | 8,7 : 1 |
| `focus.ring` | `#1F4FD8` + 2 px Abstand | ≥ 3 : 1 | `#8FB0FF` | ≥ 3 : 1 |
| `status.positive` (Text/Icon) auf Tönung | `#0B6B3A` auf `#E6F4EC` | 5,8 : 1 | `#5FD08A` auf `#12301F` | 7,4 : 1 |
| `status.warning` | `#8A5300` auf `#FFF3DC` | 5,8 : 1 | `#F0B44C` auf `#37290F` | 7,6 : 1 |
| `status.critical` | `#B3261E` auf `#FDECEA` | 5,7 : 1 | `#FF8A80` auf `#3A1B1A` | 6,8 : 1 |
| `status.info` | `#1F4FD8` auf `#E8EEFD` | 5,7 : 1 | `#8FB0FF` auf `#16264A` | 7,0 : 1 |
| `status.design` (Vereinfachung/DESIGN) | `#6A3FA8` auf `#F1EAFB` | 6,2 : 1 | `#C4A4F0` auf `#2A1E40` | 7,3 : 1 |

**Regeln**

1. **Status-Farben stehen nie allein:** immer Icon (Form unterscheidbar) **und** Text. Beispiele: solide = Kreis mit Haken, beobachten = Dreieck mit !, kritisch = Quadrat mit ×; Status-Flags mit Kürzel (B/Ä/G/D, 4.8 K-06).
2. **Gut/schlecht ≠ Vorzeichen:** die Bewertungsfarbe folgt der Bewertungslogik der Kennzahl (steigende Beleihung ist `status.warning`, nicht grün). Delta-Pfeile sind neutral grau, Farbe nur bei Bewertung.
3. **Datenfarben** (Diagramme, K-13): 6 kategoriale Farben mit ≥ 3:1 untereinander **und** gegen den Hintergrund, zusätzlich Muster/Form-Marker und direkte Beschriftung; sequenzielle Skalen einfarbig in 5 Abstufungen. Wasserfall: Zunahme/Abnahme über **Richtung und Vorzeichen** plus Farbe, Summen in Neutral.
4. **Dunkel ist eigens abgestimmt** (keine Invertierung): geringere Sättigung, Tönungsflächen mit Fläche statt Linie, Elevation über hellere Fläche statt Schatten. Folgt `prefers-color-scheme`, manuell umschaltbar (S-04).
5. **Hoher Kontrast** (Thema `kontrast`): Text 7 : 1, Rahmen 4,5 : 1, Fokusring 3 px, keine Tönungsflächen für Status (nur Rahmen + Icon).
6. Verboten: Verläufe als Informationsträger, Rot/Grün als einzige Unterscheidung, Textfarbe `text.subtle` für Zahlen.

### 4.2 Typografie

| Token | Wert | Verwendung |
|---|---|---|
| Schriftfamilie | **Inter Variable** (Fallback IBM Plex Sans, `system-ui`), selbst gehostet, OpenType `tnum`, `cv11`, `ss01` aktiv wo sinnvoll (Lizenz prüfen: OFL) | alles |
| `font.size` Skala (rem, Basis 16 px, nutzerskalierbar 90–150 %) | 12 · 13 · 14 · **16 (Basis)** · 18 · 20 · 24 · 30 · 36 | – |
| `text.body` | 16/24 (kompakt 14/20) | Fließtext, Formulare |
| `text.label` | 13–14/20, Gewicht 500, **kein Versalsatz** (Audit 5.2: 10-px-Versalien) | Kennzahl-Beschriftungen |
| `text.kpi` | 30–36/1,1, Gewicht 600, `tabular-nums` | KPI-Kachel |
| `text.table` | 14/20 (kompakt 13/18), `tabular-nums`, rechtsbündig | Tabellen |
| `text.h1–h3` | 30 / 24 / 18, Gewicht 600 | Überschriften (genau eine `h1` je Screen) |
| Zeilenlänge | 60–75 Zeichen im Fließtext (`max-w-prose`) | Erklär-Karte, Lektionen |

Regeln: **`tabular-nums` nur in Tabellen, KPIs, Formularwerten, Diagrammachsen** und nie im Fließtext. Zahlenspalten rechtsbündig, gleiche Nachkommastellen je Spalte. Mindestschriftgröße 12 px (nur Fußnoten/Quellen), nie Pflichtinformation. Text auf 200 % und Textabstände (WCAG 1.4.12) ohne Verlust. Geschütztes Leerzeichen zwischen Zahl und Einheit; Zahl und Einheit brechen nie getrennt um (`white-space: nowrap`).

### 4.3 Abstand und Größen

| Token | Wert | Hinweis |
|---|---|---|
| `space` Skala (4-px-Raster) | 0 · 2 · 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 | Tailwind-Skala wird auf diese Werte beschränkt |
| `size.target.min` | **24 px** (WCAG 2.5.8 Minimum) | nur Dichte kompakt, Maus, nie Touch-Hauptaktion |
| `size.target.touch` | **44 × 44 px** (Hausstandard) | Touch-Hauptaktionen, „Weiter“, Tab-Leiste, Bottom-Sheet-Knöpfe |
| Container | Seite max. 1440 px, Lesespalte 720 px, Dialog 880 px, Erklär-Spalte 320–380 px | – |
| App-Leiste | 56 px (kompakt 48) · Zeitleiste mobil 48 px · Tab-Leiste 56 px + Safe Area | zusammen mobil ≤ 104 px + Safe Area |
| Breakpoints | 600 · 840 · 1200 (1.2) | Container Queries für Komponenten |

### 4.4 Zielgrößen und Dichte

| Merkmal | **Komfortabel** (Standard Lern/Standard) | **Kompakt** (Standard Profi) |
|---|---|---|
| Tabellenzeile | 48 px | 32 px |
| Textgröße Tabelle | 14 px | 13 px |
| Innenabstand Karten | 16–24 px | 8–12 px |
| Klickfläche Tabellenzeile/Icon-Knopf | ≥ 44 px (Zeile) / 44 px | ≥ 24 px (Maus), Zeile 32 px |
| Touch (Gerät mit grobem Zeiger, `pointer: coarse`) | Dichte wird **automatisch komfortabel** | gilt auch hier: Hauptaktionen 44 px |

Dichte ändert **nie** die Zielgröße von Touch-Hauptaktionen (0.5), nie die Reihenfolge oder Sichtbarkeit von Information, nur Abstände und Zeilenhöhen.

### 4.5 Radius, Rahmen, Elevation

| Token | Wert | Verwendung |
|---|---|---|
| `radius.sm / md / lg / full` | 4 · 8 · 12 · 9999 px | Felder, Karten, Dialoge/Sheets, Badges |
| `border.width` | 1 px (Funktion), 2 px (Fokus), 3 px (Kontrast-Thema) | – |
| `elevation.0` | Fläche + 1 px `border.decor` | Karten im Fluss |
| `elevation.1` | Schatten 0 1 2 / 0.08 | Sticky-Leisten (App-Leiste, Zeitleiste) |
| `elevation.2` | Schatten 0 4 12 / 0.12 | Popover, Menü |
| `elevation.3` | Schatten 0 8 24 / 0.16 + Scrim 40 % | Dialog, Bottom Sheet |
| Dunkel | Elevation über Flächenaufhellung (`bg.surface` → `bg.raised`), Schatten ≤ 50 % | – |

Maximal **eine** modale Ebene; Popover über Seite, nie über Sheet/Dialog (kein Stapeln, B13 Nr. 8).

### 4.6 Motion

| Token | Wert | Verwendung |
|---|---|---|
| `motion.duration.instant` | 0–80 ms | Fokus, Hover |
| `motion.duration.fast` | 120 ms | Chips, Badges, Toast-Ein |
| `motion.duration.base` | 200 ms | Panel öffnen, Aufklappen |
| `motion.duration.slow` | 320 ms | Bottom Sheet, Seitenwechsel (selten) |
| `motion.easing.standard` | `cubic-bezier(0.2, 0, 0, 1)` | Ein/Aus |
| `motion.easing.exit` | `cubic-bezier(0.4, 0, 1, 1)` | Verlassen |

**Reduced motion:** `prefers-reduced-motion: reduce` **und** eigener Schalter (S-04 *Bewegung*: System / reduziert / aus). Bei „reduziert“: alle Dauern → 0–80 ms, nur Überblendung statt Bewegung; **keine hochzählenden Zahlen**, kein Parallax, keine Konfetti-/Erfolgsanimation (auch sonst nicht vorgesehen). Nichts blinkt (WCAG 2.3.1). Auto-Weiter ist pausierbar (2.2.2). Layout-Verschiebungen beim Rechnen sind verboten (Skelett mit fester Höhe).

### 4.7 Weitere Tokens

| Bereich | Token |
|---|---|
| Icons | Lucide, 16/20/24 px, Strichstärke 1,75; Icon allein nur mit zugänglichem Namen; Status-Icons nie dekorativ |
| z-index | `base 0 · sticky 10 · popover 20 · sheet/dialog 30 · toast 40` |
| Layout-Rand | Seite 16 px (kompakt), 24 px (≥ 840), 32 px (≥ 1200) |
| Zustandsebenen | Hover `+4 %` Überlagerung, Aktiv `+8 %`, Deaktiviert 38 % (nur für nicht-informative Elemente; Begründung als Text) |

### 4.8 Komponenten-Katalog

Je Komponente: **Zweck · Varianten · Zustände · A11y**. Jede Komponente hat Storybook-Story (alle Zustände, hell/dunkel, beide Dichten), Playwright-Komponententest, axe-Test und einen Eintrag in `packages/ui/README`. Gemeinsame Zustände aller interaktiven Komponenten: *Standard · Hover · Fokus (sichtbar) · Aktiv · Deaktiviert (mit Grund) · Laden (Skelett) · Fehler (Text + Icon)*. Nur Abweichungen stehen unten.

| ID | Komponente | Zweck | Varianten | Besondere Zustände | A11y |
|---|---|---|---|---|---|
| **K-01** | **Geld/Prozent/Delta-Formatter** (`formatGeld`, `formatProzent`, `formatDelta`, `formatMonat`) | zentrale de-DE-Ausgabe (5.1), liefert `text` und `sprechtext` | Geld ganz/mit Cent/kompakt; Prozent 1 oder 2 Stellen; Prozentpunkte; Delta mit Vorzeichen; Zeitbezug | Bandbreite („290–350 €/Monat“); Wert fehlt („–“ mit Grund) | `sprechtext` ausgeschrieben („minus vier Komma zwei Prozent“, „1,5 Millionen Euro“), Minus U+2212, geschützte Leerzeichen; Unit-Tests je Format |
| **K-03** | **KPI-Kachel** | Hauptkennzahl mit Kontext (Cockpit, Objekt) | groß / kompakt / mit Sparkline / mit Bullet Graph | kritisch/beobachten (Icon+Text), Wert wird gerechnet (Skelett), Bandbreite | als Button/Link mit vollem Namen („Netto-Cashflow 318 Euro pro Monat nach Steuern, 120 Euro mehr als im Vormonat“); Sparkline hat Textäquivalent; Container-Query-Umbruch ohne Abschneiden |
| **K-04** | **Kennzahl mit Erklärung** (`<Kennzahl>`) | jede Zahl im UI; öffnet O-01 | inline / Wert+Label / in Tabellenzelle / Hero | Status-Flag B/Ä/G/D, Schätzungs-Marker, Spielwelt-Marker | `button`, Name enthält Wert+Einheit+Zeitbezug, `aria-haspopup="dialog"`, Enter/Leertaste öffnet, kein Nur-Hover |
| **K-05** | **NumberField + Slider** | Eingabe von Beträgen, Zinsen, Laufzeiten (B6, keine Nur-Regler) | Euro / Prozent / Monate / Ganzzahl; mit/ohne Slider; Stepper | Basiswert-Marker + „Zurücksetzen“; außerhalb Bereich (Warnung, nie stilles Klemmen); gerechnet-Hinweis | `type="text"` + `inputmode="decimal"`, Parser akzeptiert „250000 / 250.000 / 250.000,50 / 250000,5“, Einheit als Suffix (im Label), Fehler inline mit Lösung (`aria-describedby`), Slider `role="slider"` mit `aria-valuetext` („3,6 Prozent“), Pfeiltasten ±Schritt, Bild±10×, nie fokusverlierend beim Rechnen (G3) |
| **K-06** | **Status-Flag-Badge** | Herkunft: **BELEGT · ABGELEITET · GESCHÄTZT · DESIGN** | Kurz (Kürzel + Icon) / Lang (Text) | Prüfung fällig (zusätzliches Icon), Spielwelt | Text immer vorhanden (Kürzel hat `aria-label` „belegt, Quelle …“); Icons unterscheidbar bei Graustufen; Hit-Fläche öffnet O-01 Ebene 3 |
| **K-07** | **Risiko-Indikator** | solide / beobachten / kritisch mit Begründung | Badge · Bullet Graph (Wert, Zielmarke, Bereiche) · Zeile | mit/ohne Begründung (Begründung in O-01) | Icon + Text, Bereichswerte als Text, `meter`-Semantik oder Textwert, Kontrast ≥ 3:1 der Bereiche |
| **K-08** | **Fristen-Badge** | Frist in Spielmonaten, nie Echtzeit | „bis Feb. 2027“ / „in 3 Monaten“ / „überfällig seit Jan. 2027“ | überfällig (Icon), erledigt | Text vollständig („Frist: bis Februar 2027, in 3 Monaten“); keine Countdown-Animation; Farbe nur ergänzend |
| **K-09** | **DataTable** (TanStack Table v9 + virtuelle Zeilen) | Listen mit 1–200 Zeilen, sortieren, filtern, gruppieren, Spalten wählen, Massenaktionen | Tabelle · Karten-Liste (K-29) auf kompakten Breiten | leer · 1 Zeile · 200 Zeilen · Filter ohne Treffer („Keine Treffer – Filter lockern: …“) · Mehrfachauswahl | `role="grid"`/`table` je Bedarf (Grid nur mit Zellnavigation), Pfeiltasten, `aria-sort`, Spaltenüberschriften `scope`, Zeilenzahl-Ansage („83 von 214“), Spaltenauswahl als Menü mit Checkboxen, Hinweis „weitere Spalten →“ bei Scroll (B13 Nr. 19), Zahlen rechtsbündig `tabular-nums`, Fokus bleibt bei Neusortierung |
| **K-10** | **Filterleiste / Linsen** (+ **K-11** Linsen-Umschalter) | Filtern und Perspektivwechsel (Cashflow · Rendite · Lage · Risiko) | Chips + Popover (Desktop) · „Filter (3)“ → O-13 Bottom Sheet (mobil) | aktive Filter als entfernbare Chips; gespeicherte Ansicht; „Zurücksetzen“ | Linsen = Radiogruppe (Segmentierte Steuerung), Chips mit Entfernen-Knopf (Name „Filter Preis bis 200.000 € entfernen“), Trefferzahl als Statusmeldung, Filtern ändert Fokus nicht (Audit 5.2) |
| **K-12** | **Annahmen-Leiste** | alle Eingaben der Kalkulation gruppiert | groß (Seitenleiste) · kompakt (Sheet) | Basiswert vs. geändert (Marker), Flag je Annahme, Szenario A/B/C | Gruppen als `fieldset`/Überschriften, Reihenfolge nach Wirkung, Live-Ergebnis in Region mit `aria-live="off"` + Ansage nur auf Wunsch (Taste), Reset je Annahme und gesamt |
| **K-13** | **Diagramme:** Wasserfall · Zeitreihe · Tornado (+ Bullet Graph, Balken) | Herleitung, Verlauf, Sensitivität (ECharts 6, eigene Theme-Tokens) | Wasserfall Monat/Jahr, Objekt/Portfolio; Zeitreihe mit Prognose-Band; Tornado nach Wirkung sortiert | Rechnen (Skelett fester Höhe), keine Daten, Bandbreite, Punkt ausgewählt | **Titel + Textzusammenfassung** („Von 850 € Kaltmiete bleiben netto 112 €“) + **Tabellen-Umschalter** (immer vorhanden, Standard für Screenreader), direkte Beschriftung statt Legende, Muster/Marker, Tastaturnavigation durch Datenpunkte, Tooltip auch auf Fokus, Farbpalette ≥ 3:1, reduzierte Bewegung → keine Einblend-Animation |
| **K-14** | **Fortschritts-Tracker** | mehrmonatige Prozesse (Kauf, Finanzierung, Sanierung, Zwangsversteigerung) | horizontal (Desktop) · vertikal (mobil) | Schritt: erledigt / aktuell / ausstehend / verzögert / gescheitert; Monatsangaben | geordnete Liste, `aria-current="step"`, Status als Text, „Was passiert hier?“ → O-01, Verzögerung mit Grund |
| **K-15** | **Posteingang-Item** | eine Nachricht mit Entscheidung oder Info | Entscheidung · Info · gebündelt („3 Mieterhöhungen möglich“) · Krise | neu / gelesen / erledigt / verpasst (Text + Icon) | Liste mit `listitem`, Name „Entscheidung, Frist Feb. 2027, Anschlussfinanzierung, Gohlis ETW, ungelesen“, Wischaktionen nur als Abkürzung (sichtbare Knöpfe im Detail), `j/k` |
| **K-16** | **Optionskarte** | Option im Entscheidungsdialog | normal · empfohlen („Standard“) · deaktiviert (mit Grund) | gewählt (Rahmen + Haken + Text) | Radiogruppe mit Beschriftung, Kosten/Effekt/Risiko als Definitionsliste, nie vorausgewählt außer „Standard“ |
| **K-17** | **Vorher → Nachher** | Folgenvorschau | Tabelle 3–5 Zeilen · kompakt (Chips) | unsicher (Bandbreite), Wirkung ab Monat | echte Tabelle mit Spalten Vorher/Nachher/Δ; Δ mit Vorzeichen und Text („verschlechtert“); Wirkungsbeginn im Text |
| **K-18** | **Leerzustand** | erklärt, was hier steht, und bietet nächsten Schritt | Erstnutzung · Filter ohne Treffer · Fehler · „noch nicht freigeschaltet“ | – | Überschrift + Satz + genau ein primärer Knopf; Illustration dekorativ (`alt=""`) |
| **K-19** | **Bottom Sheet** | Erklärung, Filter, Details auf < 840 px | halbe Höhe · volle Höhe · Vollseite | gezogen, geschlossen; **nie gestapelt** | `role="dialog"`, Griff mit Knopf-Alternative (Ziehen immer ersetzbar, 2.5.7), Fokus hinein/zurück, Fokusfalle, Esc / System-Zurück schließt, Hintergrund inert, `scroll-padding` verhindert Verdeckung |
| **K-20** | **Seitenpanel** | nicht-modale Erklär-Spalte / Mentor (840–1199 px) und angeheftet (≥ 1200 px) | angeheftet · überlagernd | angeheftet aktualisiert live | `complementary`/Region mit Überschrift, Fokus auf Überschrift beim Öffnen, Esc schließt (nicht bei angeheftet), verdeckt nie fokussierte Felder (2.4.11) |
| **K-23/K-24** | **Toast / Banner** | Rückmeldung (3.5) | Toast mit Rückgängig · Banner Info/Warnung/Kritisch | Banner einklappbar | `role="status"` (höflich) / `role="alert"` nur Stufe 3 (3.6); Toast pausiert bei Fokus/Hover, ≥ 8 s |
| **K-26** | **Mentor-Hinweis** | proaktiver Hinweis (3.10) | Karte im Inhalt | gesehen / „Später“ / „nicht mehr“ | Region, kein Fokusraub, drei Knöpfe, höchstens einer je Screen |

**Querschnitts-Tests je Komponente:** (1) Tastatur komplett, (2) axe ohne Verstöße in Hell/Dunkel/Kontrast, (3) 320 px und 200 % Zoom, (4) Screenreader-Text prüfbar (`getByRole`-Name im Test), (5) reduzierte Bewegung, (6) beide Dichten, (7) Zustandsmatrix im Storybook (visuelle Regression, 7.2).

---

## 5. Zahlen-, Datums- und Sprachstil

### 5.1 Zahlen und Datum (de-DE, zentral über K-01)

Alle Ausgaben laufen über `Intl.NumberFormat('de-DE')` bzw. `Intl.DateTimeFormat('de-DE')`; **keine** Formatierung in Komponenten oder im Rechenkern. Rechenkern liefert Cents (Ganzzahl) und Raten, die UI rundet nur zur Anzeige (Rundung ändert nie den Rechenwert).

| Fall | Ausgabe | Regel |
|---|---|---|
| Betrag | `1.234.567,89 €` | Punkt Tausender, Komma Dezimal, geschütztes Leerzeichen vor `€` |
| Betrag Tabelle/KPI | `245.000 €` | ganze Euro; Cent nur, wo relevant (Miete, Hausgeld, Rate; Schalter „Cent in Tabellen“ in S-04) |
| Kompakt (Achsen, Karten) | `1,5 Mio. €` | nur bei Platzmangel; Screenreader-Text ausgeschrieben („1,5 Millionen Euro“) |
| Prozent | `3,8 %` | geschütztes Leerzeichen vor `%`; Rendite 1 Stelle, Zinssatz 2 Stellen |
| Prozentpunkte | `+0,50 Pp.` / „0,5 Prozentpunkte“ | nie „%“ für Differenzen von Prozentsätzen; Glossar-Eintrag |
| Vorzeichen/Delta | `+120 €`, `−4,2 %` | **immer mit Vorzeichen** (U+2212 Minus, `+` ausdrücklich); Null als `±0 €`; Pfeil neutral, Bewertung getrennt (4.1 Regel 2) |
| Zeitbezug | `318 €/Monat`, `3.816 €/Jahr` | **immer** angeben; „vor/nach Steuern“ angeben, wo ein Steuereffekt enthalten sein kann; nie mischen ohne Umschalter |
| Fläche, Prozent-Kennzahlen | `52 m²`, `22,8-fache Jahresmiete` | Einheit festes Suffix |
| Bandbreite | `290–350 €/Monat` (Halbgeviertstrich) | ab geschätzten Werten; Mittelwert nie ohne Spanne als „Prognose“ |
| Fehlend | `–` plus Grund im Tooltip/Text („noch nicht bekannt“) | nie `0` oder `NaN` |

**Monat vs. Jahr:** Spielzeit hat **Monat als kleinste Einheit** (kein Tag). Anzeige `Nov. 2026` (kurz), `November 2026` (lang), `2026-11` nur in URLs/Dateinamen. Fristen in Monaten („bis Feb. 2027“, „in 3 Monaten“). Zeitreihen Monat/Jahr per Umschalter, Standard je Kennzahl: Cashflow, Miete, Rate **monatlich**; Steuer, Vermögen, Rendite **jährlich**. Ein Screen mischt Zeitbezüge nur mit sichtbarem Etikett.

**Rundung je Kontext**

| Kontext | Rundung |
|---|---|
| Kontoauszug, Rate, Miete, Hausgeld | Cent |
| KPI, Tabellen Objekte, Kaufpreis | ganze Euro |
| Prognosen, Marktwerte, Verkaufserlös | auf 100 € bzw. als Bandbreite („~38–52 Tsd. €“) |
| Renditen | 1 Nachkommastelle; keine Scheingenauigkeit bei geschätzten Eingaben |
| Zinssätze | 2 Nachkommastellen |
| Herleitungs-Summen (O-01) | Summe der **gerundeten** Posten wird angezeigt; Abweichung ≤ 1 Cent/Euro durch Rundungsposten erklärt (AK-O01-2) |

**Eingabe:** Parser akzeptiert „250000“, „250.000“, „250.000,50“, „250000,5“ (letztes `,` oder `.` mit ≤ 2 Folgeziffern = Dezimaltrenner), formatiert beim Verlassen, Fehler nennt Lösung („Bitte einen Betrag wie 250.000 eingeben.“). Negative Beträge nur wo fachlich sinnvoll.

### 5.2 Sprache und UX-Writing

| Regel | Umsetzung |
|---|---|
| **du-Form**, sachlich, freundlich, kein Jargon-Ballast | „Dir bleiben 38 € im Monat.“ Mentor und UI duzen. **Spielwelt-Figuren (Bank, Notar, Verwaltung, Mieter) siezen** und sprechen in ihrer Rolle, mit Interessenhinweis. |
| Aktiv, konkret, mit Zahl | „Die Bank lehnt ab, weil die Rate 44 % deines Nettoeinkommens beträgt (Grenze 40 %).“ |
| **Knopftexte nennen Handlung und Objekt/Betrag** | „Sondertilgung 5.000 € buchen“, nie „OK“, „Ja“, „Bestätigen“, „Weiter“ (Ausnahme Zeitleiste) |
| Fehler nennen Ursache und Lösung | „Der Betrag liegt über deiner Reserve. Senke ihn auf höchstens 12.400 € oder entscheide dich für Nachschuss.“ |
| **Keine Anlageberatung** | „Unter diesen Annahmen …“, „Das Modell zeigt …“; nie „Du solltest kaufen/eine GmbH gründen“; Mentor stellt Fragen statt Empfehlungen |
| Keine Schuldzuweisung | Fehler beschreiben Ursache, nicht Person: „Die Reserve hat nicht gereicht“ statt „Du hast zu wenig Reserve geplant“ |
| Kein Druck | keine Ausrufezeichen-Ketten, kein „Nur noch!“, keine Countdown-Sprache, keine Streaks |
| Barrierearm | Satzlänge ≤ 20 Wörter in Ebene 1, aktive Verben, Abkürzungen beim ersten Auftreten ausgeschrieben (AfA = Absetzung für Abnutzung) |
| Konsistente Begriffe | Ein Wort je Konzept (Glossar S-34 ist Quelle): Kaltmiete (nicht Nettomiete), Reichweite (nicht Runway), Beleihung (nicht LTV im Fließtext, LTV im Glossar als Synonym) |
| Status-Wörter | belegt · abgeleitet · geschätzt · Vereinfachung (Flag DESIGN) |
| Inklusiv, ohne Gendersonderzeichen | neutrale Formulierungen („Mietende“ sparsam; Rollen wie „Mieter-Bewerbung“); Entscheidung dokumentiert im Glossar der Schreibregeln |
| Texte als Schlüssel | Paraglide/Inlang-Nachrichten, Plurale, Platzhalter für Formatter (K-01); kein String im Rechenkern |

**Beispiele**

| Schlecht | Besser |
|---|---|
| „Bestätigen?“ [Ja] [Nein] | „Kaufvertrag über 189.000 € beurkunden?“ [Zurück zur Bearbeitung] [Kaufvertrag über 189.000 € beurkunden] |
| „Der CF ist negativ.“ | „Dir bleiben nach Kosten, Rate und Steuer −83 € im Monat.“ |
| „Du solltest die GmbH nutzen.“ | „Unter diesen Annahmen liegt die Steuer in der GmbH 3.400 € niedriger. Lass das von einer Steuerberatung prüfen.“ |
| „Fehler 422“ | „Dieser Betrag passt nicht: Gib einen Betrag wie 250.000 ein.“ |

### 5.3 Glossar-Verlinkung

- Fachbegriffe im Fließtext erhalten eine **gepunktete Unterstreichung**; Klick/Tap/Enter öffnet O-02 (Popover mit 1–2 Sätzen, „Mehr im Glossar“ → S-34). Kein Hover-only; Esc schließt, Fokus zurück (WCAG 1.4.13).
- **Häufigkeit:** je Ansicht nur beim ersten Auftreten (Lern/Standard); Profi nur in Erklär-Karten (0.5). Nie in Überschriften, Knöpfen, Tabellenköpfen (dort stattdessen Info-Symbol in Spaltenmenü).
- Jeder Glossar-Eintrag: Kurzdefinition (≤ 25 Wörter), Beispiel mit Zahl, Rechtsgrundlage (falls zutreffend), Verweis auf Mikro-Lektion, Stand/Prüfdatum, Vereinfachung im Spiel.
- Build-Test: jeder in `content` verwendete Fachbegriff-Schlüssel existiert im Glossar (AK „alle Begriffe verlinkt“, Roadmap 6.4).

### 5.4 Disclaimer-Konzept (Spiel ≠ Steuer-/Rechtsberatung; Fachspezifikation 11, 6.3)

| Ort | Inhalt | Häufigkeit | Form |
|---|---|---|---|
| **Start-Disclaimer** (S-02 vor Schritt 1) | „Dieses Spiel ist ein Trainingswerkzeug. Es vereinfacht Steuern und Recht bewusst und verwendet teils veraltete oder ungeprüfte Werte. Es ersetzt keine Steuer- oder Rechtsberatung. Triff reale Entscheidungen nur nach fachlicher Prüfung.“ | **einmal** je Gerät/Spielstand-Neuanlage, danach in S-04 *Hilfe* und S-41 abrufbar | ruhige Karte, Knopf „Verstanden, los geht’s“, kein Pflichthäkchen |
| **Status-Flag je Zahl** (K-06) | Stand, Quelle, Prüfintervall („Prüfung fällig“) | überall, immer | Badge + O-01 Ebene 3 |
| **Vereinfachungs-Marker** | „Vereinfachung im Spiel: ohne Soli und Kirchensteuer.“ | an jeder betroffenen Zahl und in O-01 Ebene 3 | Flag DESIGN, ein Satz je Vereinfachung |
| **Rechtsstand** | „Rechtsstand der Spieldaten: 30.09.2026“; bei Spielzeit danach „Spielwelt – reale Rechtslage kann abweichen“ | Profilmenü, S-41, Zeitleisten-Label „Spielwelt“ | Text, nicht wegklickbar |
| **Steuer-/Rechtsdialoge** (S-30, S-22, Strukturvergleiche) | Kurzhinweis „Vergleich unter diesen Annahmen, keine Steuerberatung.“ | an Dialog-Fuß, **einmal je Dialog** (nicht je Zahl) | Fußzeile, ≤ 1 Zeile |
| **Kein Empfehlungsurteil** | Strukturvergleiche enden mit „Lass das von einer Steuerberatung prüfen.“ | immer | Text im Ergebnisblock |
| **Fiktive Ereignisse** | Label „fiktiv“ an Szenario-Ereignissen; nie mit realen historischen Daten vermischt | jedes Ereignis | Badge |
| **Quellenkritik** | Hinweis auf kommerzielle Interessen von Quellen als Lerninhalt | S-41, Lektion | Text |
| **Jahresbericht/Export** | Fußzeile „Trainingswerkzeug, keine Beratung. Rechtsstand …“ | jeder Export | Text im PDF/Bild |
| **Store/Landing (P8/P9)** | gleicher Kerntext, Impressum/Datenschutz (rechtlich geprüft durch den Auftraggeber) | – | – |

**Grundsätze:** Disclaimer informieren, sie blockieren nicht und nerven nicht (kein Modal bei jedem Start, keine Wiederholung je Zahl). Keine Eingabe echter Steuerdaten (Steuer-ID, Einkommensteuerbescheid) – Profile arbeiten mit Archetypen; „Mein echtes Profil“ nimmt nur grobe Angaben auf. AK: AK-DSC-1 Start-Disclaimer vor erster Entscheidung, AK-DSC-2 jede steuerliche/rechtliche Zahl trägt Stand und Quelle, AK-DSC-3 Rechtsstand ist von jedem Screen in ≤ 2 Interaktionen sichtbar.

---

## 6. Barrierefreiheit (WCAG 2.2 AA)

**Ziel:** WCAG 2.2 AA plus Game-Accessibility-Basics; Prüfstand P8 (Audit), laufend ab P0. Die Checkliste ist eine **Definition-of-Done-Zeile je Komponente** (Spalte „WCAG“); Screen-DoD in 7.1 verweist darauf.

### 6.1 Checkliste je Komponente

| Komponente | Konkrete Prüfpunkte | WCAG |
|---|---|---|
| **App-Shell / Navigation** | Landmarks (`banner`, `nav`, `main`, `complementary`), „Zum Inhalt springen“ als erstes Fokusziel, aktive Seite `aria-current="page"`, Reihenfolge der Navigation identisch auf allen Breiten, Fokus verdeckt nie von Zeitleiste/Tab-Leiste (`scroll-padding`), Hilfe-Knopf an gleicher Stelle | 1.3.1, 2.4.1, 2.4.11, 3.2.3, 3.2.6 |
| **Zeitleiste (K-02)** | Hauptknopf Name enthält Zustand („Weiter, 1 Monat“ / „2 Entscheidungen offen“); Fortschritt der Simulation als höfliche Statusmeldung, entprellt; „Anhalten“ erreichbar; Auto-Weiter pausierbar; Ziel ≥ 44 px | 2.2.2, 4.1.3, 2.5.8 |
| **Kennzahl (K-04) / KPI (K-03)** | Name als ganzer Satz mit Wert, Einheit, Zeitbezug, Delta; Vorzeichen und Einheit werden vorgelesen (NVDA/JAWS/VoiceOver/TalkBack Stichprobe); kein Nur-Hover; Status-Flag mit Text | 1.1.1, 1.4.1, 4.1.2 |
| **Erklär-Karte (O-01)** | Dialog/Popover nach APG, Fokus hinein und zurück, Esc, Pfad (Breadcrumb) als `nav`, überfahrbar/beständig, nie gestapelt; Herleitung als Tabelle | 1.4.13, 2.1.2, 2.4.3, 3.2.1 |
| **Dialoge/Sheets (O-04, O-05, K-19)** | `role="dialog"`/`aria-modal`, beschriftet, Fokusfalle, Hintergrund inert, Esc, Fokus zurück; Optionen als Radiogruppe; Standardfokus im Prüfschritt auf „Zurück“; Ziehen mit Alternative | 2.1.1, 2.4.3, 2.5.7, 3.3.4 |
| **Formulare (K-05, K-12)** | sichtbare Labels (kein Platzhalter als Label), `aria-describedby` für Hilfe/Fehler, Fehlermeldung nennt Lösung, Autocomplete wo sinnvoll, Eingaben werden wiederverwendet, Slider mit Alternative zum Ziehen, Zahlen als Text mit `inputmode` | 3.3.1, 3.3.2, 3.3.3, 3.3.7, 1.3.5, 2.5.7 |
| **DataTable (K-09)** | echte Tabelle oder Grid-Semantik mit Zellnavigation; `aria-sort`; Spaltenköpfe zugeordnet; Zeilenzahl-Ansage; Spaltenauswahl per Tastatur; Hinweis auf weitere Spalten; Reflow bei 320 px als Karten-Liste oder in sich scrollender Bereich mit Hinweis | 1.3.1, 1.4.10, 2.1.1, 4.1.2 |
| **Diagramme (K-13)** | Titel, Textzusammenfassung, **Datentabelle** (Umschalter), direkte Beschriftung, Muster/Marker, Farb-Kontrast ≥ 3:1, Datenpunkte per Tastatur, keine Info nur im Tooltip | 1.1.1, 1.4.1, 1.4.11 |
| **Filter/Linsen (K-10/11)** | Linsen als Radiogruppe, Chips mit benannten Entfernen-Knöpfen, Trefferzahl als Statusmeldung, Filtern lässt Fokus unverändert | 3.2.2, 4.1.3 |
| **Posteingang (K-15) / Listen** | Liste mit Semantik, Status als Text, Badge-Zahl im zugänglichen Namen, Wischaktionen mit sichtbaren Knöpfen, `j/k` abschaltbar | 2.1.4, 2.5.1 |
| **Toast/Banner (K-23/24)** | `role="status"` bzw. `alert` nur Stufe 3; Toast ≥ 8 s, pausiert bei Fokus; Banner einklappbar; keine Live-Region-Fluten (nur kleine Container, entprellt) | 2.2.1, 4.1.3 |
| **Status-Flag, Risiko, Frist (K-06/07/08)** | Icon + Text, Form unterscheidbar in Graustufen, Kontrast ≥ 3:1, Fristtext ausgeschrieben | 1.4.1, 1.4.11 |
| **Tracker (K-14)** | geordnete Liste, `aria-current="step"`, Status in Text | 1.3.1 |
| **Befehlspalette (O-06)** | Combobox/Listbox nach APG, `aria-activedescendant`, Trefferansage, Esc | 2.1.1, 4.1.2 |
| **Mentor/Coachmark (O-03/O-12)** | kein Fokusraub, schließbar, nicht blockierend, ruhig angekündigt, nicht über Eingabefeldern | 2.4.11, 3.2.6 |
| **Karte (S-11 Karte)** | Liste als gleichwertiger Zugang; Karte nicht zwingend; Fokus-Reihenfolge; Farbskala ≥ 3:1 mit Muster | 1.1.1, 2.1.1 |
| **Farbe & Theme** | beide Themen + Kontrast-Thema geprüft; Status nie nur Farbe | 1.4.1, 1.4.3, 1.4.11 |
| **Bewegung** | `prefers-reduced-motion` + Schalter, keine Zahlenzähler, nichts blinkt, keine Zeitlimits | 2.2.1, 2.3.1, 2.3.3 |
| **Reflow/Zoom** | 320 px ohne horizontales Scrollen der Seite, 200 % Text, Textabstände | 1.4.4, 1.4.10, 1.4.12 |
| **Sprache** | `lang="de"`, Fremdwörter/Eigennamen mit `lang` falls nötig, Titel je Route, Überschriftenhierarchie | 3.1.1, 2.4.2, 1.3.1 |
| **Spielspezifisch** | Autosave nach jedem Monat, Hilfestufen, getrennte Marktschwierigkeit, Schriftgröße 90–150 %, kein Ton als alleinige Information, Ton getrennt regelbar | – |

**Mobil/Touch:** Zielgröße ≥ 24 px (Minimum), Haupt-Touchaktionen **44 px**; kein Ziehen/Wischen ohne Alternative; Orientierung nicht gesperrt (1.3.4); Tastatur öffnen blendet Leisten aus, damit Fokus sichtbar bleibt.

### 6.2 Werkzeuge und Prozess

| Ebene | Werkzeug | Wann | Gate |
|---|---|---|---|
| **Statisch** | `eslint-plugin-jsx-a11y` (oder Biome-Äquivalente), Token-Kontrastskript (`tokens:kontrast`) | jeder Commit/CI | 0 Fehler |
| **Automatisiert** | **axe-core in Playwright** (`@axe-core/playwright`) auf jeder Route × {hell, dunkel, kontrast} × {Desktop, Handy}, in Storybook je Komponente | CI je PR | 0 kritische/ernste Verstöße; Ausnahmen mit Begründung in `a11y-baseline.json` (Review nötig) |
| **Tastatur-E2E** | Playwright-Spec je Top Task (T1–T10): Ziel nur mit Tastatur erreichen, Fokusreihenfolge, Fokus zurück nach Dialog, keine Fokusfalle, Fokus nie verdeckt (Prüfung `element.boundingBox` vs. Leisten) | CI je PR (Kern-Flows), nightly (alle) | bestanden |
| **Reflow/Zoom** | Playwright mit 320 px Viewport, 200 % Text, Prüfung auf `scrollWidth ≤ clientWidth` | CI | bestanden |
| **Reduzierte Bewegung** | Playwright `reducedMotion: 'reduce'`: keine Animation > 80 ms, keine Zähler | CI | bestanden |
| **Screenreader-Stichproben** | NVDA + Firefox/Chrome (Windows), VoiceOver + Safari (macOS/iOS), TalkBack (Android ab P9); je Release 8 Stichproben (Cockpit, Posteingang-Entscheidung, Erklär-Karte, Tabelle sortieren, Kalkulator-Eingabe, Wasserfall + Tabelle, Prüfschritt, Krisen-Banner) | P3 erste Runde, P6, **P8 Audit**, P9 | Protokoll in `docs/qa/a11y/` |
| **Manuell** | Zoom 400 %, Windows Kontrast, Textabstände-Bookmarklet, Farbenblindheits-Simulation, Tab-Durchlauf je Screen | je Screen-DoD | Checkliste 6.1 |
| **Nutzer** | Usability-Test mit mindestens 1 Person mit Screenreader/Sehschwäche/motorischer Einschränkung in Test 3 (P8) | P8 | Top-Befunde behoben |
| **Plugin-Review** | Design-Plugin `accessibility-review` (7.5) | je Screen vor „fertig“ | keine offenen kritischen Befunde |

**Regel:** Ein neuer Verstoß blockiert den Merge, nicht die nächste Phase. Baseline darf nur sinken.

---

## 7. UX-Qualitätssicherung

### 7.1 Definition of Done je Screen (alle MÜSSEN erfüllt sein)

| # | Kriterium | Prüfung |
|---|---|---|
| 1 | Alle Raster-Punkte aus 2.0 beschrieben und umgesetzt (Inhalte, Aktionen, Zustände, Layouts D/T/M, Tastatur, Microcopy, AK) | Review gegen Spezifikation |
| 2 | **Alle vier Fensterklassen** spielbar (≥ 1200, 840–1199, 600–839, < 600), 320 px ohne Seiten-Scrollbalken | Playwright-Viewports |
| 3 | Jede Zahl ist `Kennzahl` (K-04) mit Erklär-Karte; Status-Flag und Zeitbezug vorhanden | Registry-Test (AK-O01-1) |
| 4 | Zustände: leer, Rechnen (Skelett), Fehler (Inline-Banner mit Lösung), Lernmodus vs. Profi, Spielwelt-Kennzeichnung | Storybook/E2E |
| 5 | Teure Aktionen über O-05, billige mit Undo (O-07), Vormerken über O-14; Knopftexte konkret | Stichprobe + Regel „kein OK/Ja“ (Lint auf Text-Schlüssel) |
| 6 | **A11y:** axe 0 kritisch/ernst (hell/dunkel/kontrast), Tastatur-E2E, Fokus nie verdeckt, Live-Regionen nicht überladen | CI |
| 7 | Visuelle Regression: Screenshots je Fensterklasse × Thema × Dichte freigegeben | 7.2 |
| 8 | Performance: Interaktion < 100 ms spürbar, Berechnung im Worker, kein Layoutsprung (CLS < 0,05), Eingaben behalten Fokus beim Rechnen (G3) | Playwright-Test (Tippen während Neuberechnung) |
| 9 | Text: Schlüssel in Paraglide, du-Form, keine Anlageberatung, Glossar-Links, Disclaimer wo nötig (5.4) | Plugin `ux-copy` |
| 10 | Audit-5-Regression-Test: die jeweilige Fehlerklasse (Fokusverlust, Re-Render bei Tick, abgeschnittene Tabs, HUD-Umbruch, Kontrast) ist abgedeckt | Testliste |
| 11 | Design-Review (Plugin `design-critique`) ohne offenen kritischen Punkt | 7.5 |
| 12 | Usability-Aufgabe des Screens (7.3) mit Zielwert erfüllt, soweit in dieser Phase getestet | Test-Report |

### 7.2 Visuelle Regression

- **Werkzeug:** Playwright-Screenshots (`toHaveScreenshot`) auf Storybook-Stories (Komponenten) und auf Kern-Routen mit festem Seed/Datum (Spielstand-Fixture „Gohlis-Standard“). Schriften geladen, Animationen aus, Uhr eingefroren, Zufall per Seed.
- **Matrix:** Komponenten: Zustand × {hell, dunkel} × {komfortabel, kompakt}. Screens: {Desktop 1440, Tablet 1024, Tablet hoch 768, Handy 390} × {hell, dunkel}; Kontrast-Thema nur Komponenten.
- **Schwellen:** Pixeldifferenz-Schwelle 0,1 %; Änderungen nur per bewusster Aktualisierung mit Review im PR (Bildvergleich im PR-Kommentar). Schrift-Rendering fix auf CI-Container.
- **Zusätzlich:** Zahlenformat-Goldens (K-01 gegen Tabelle 5.1), Overflow-Test (kein abgeschnittener Text bei 200 % und langen Namen), Layout-Metriken (Höhe App-Leiste + Zeitleiste ≤ 104 px mobil).
- **Ablage:** Baselines im Repo (Git LFS oder separates Artefakt), Review-Rolle `ux-reviewer`.

### 7.3 Usability-Testplan

**Rahmen:** je Test 5 Personen (Test 1: Auftraggeber + 1–2 Personen; Test 2: Einsteiger; Test 3: gemischt inkl. Barrierefreiheit), Think-Aloud, Remote oder vor Ort, Aufzeichnung mit Einwilligung, keine echten Daten; Moderationsleitfaden in `docs/qa/usability/`.

| Test | Phase | Fokus | Aufgaben (Auszug) |
|---|---|---|---|
| **1** | P3 | Vertical Slice | A1–A5 unten |
| **2** | P6 | Onboarding Neulinge | A6–A8, Zeit bis zur ersten Kaufentscheidung |
| **3** | P8 | gesamt inkl. A11y | A9–A12, Screenreader/Tastatur-Variante der Kernaufgaben |

| ID | Aufgabe (Wortlaut an Testperson) | Top Task | Erfolgskriterium | Zielwert |
|---|---|---|---|---|
| A1 | „Finde heraus, wie es dir finanziell geht und was dringend ist.“ | T1 | nennt Liquidität/Reichweite und offene Entscheidung | ≥ 90 % Erfolg, < 30 s |
| A2 | „Triff die offene Entscheidung im Posteingang.“ | T2 | wählt Option, erkennt Standardfolge und Frist | ≥ 90 %, keine Fehlklicks auf „OK“ |
| A3 | „Finde ein Objekt mit positivem Cashflow nach Steuern und prüfe es.“ | T3 | Linse/Filter genutzt, Kalkulator geöffnet | ≥ 80 %, < 3 min |
| A4 | **„Finde heraus, warum die Bank abgelehnt hat.“** | T4 | benennt die Kennzahl/den Code (z. B. Rate/Nettoeinkommen) **und** eine Gegenmaßnahme | **≥ 80 % Erfolg in < 60 s** (AK-S17-3) |
| A5 | „Was ist die Zahl ‚Netto-Cashflow‘ und woraus besteht sie?“ | T1/L1 | öffnet Erklär-Karte, benennt ≥ 2 Posten | ≥ 85 %, < 20 s |
| A6 | „Starte ein neues Spiel und triff deine erste Entscheidung.“ | Onboarding | ≤ 2 min, keine Hilfe nötig | Median ≤ 2 min |
| A7 | „Prüfe Angebot 2 selbst und sag, ob du es kaufen würdest (und warum).“ | T3 | nutzt Bierdeckel + Cashflow, nennt Risiko | ≥ 75 % korrekte Einschätzung |
| A8 | „Mach den Kaufvertrag fertig.“ | T5 | liest Prüfschritt, nutzt „Zurück zur Bearbeitung“ oder Beurkunden bewusst | 0 versehentliche Beurkundungen |
| A9 | „Erhöhe die Miete in Einheit 2, so weit es erlaubt ist.“ | T6 | erkennt Frist/Kappungsgrenze, plant Versand | ≥ 70 %, Verständnis der Grenze |
| A10 | „Deine Liquidität wird knapp. Was tust du?“ | T7 | findet Frühwarnung und wählt Option mit Folgenvorschau | ≥ 80 %, kein Missverständnis „Game Over“ |
| A11 | „Entscheide über die Anschlussfinanzierung.“ | T8 | vergleicht Angebote, nennt Wirkung auf Liquidität | ≥ 80 % |
| A12 | „Sieh dir dein Jahr an und nenne, was du anders machst.“ | T9 | schließt Debrief, setzt Vorsatz | ≥ 75 %, Debrief nicht übersprungen aus Frust |

**Messen je Aufgabe:** Erfolg (ja/teilweise/nein), Zeit, Fehlklicks, Hilfegebrauch, Verständnis (kurze Rückfrage), SEQ (1–7), Zufriedenheit am Ende (SUS-Kurzform). Befunde werden in **Schweregrade** (kritisch/schwer/mittel/leicht) eingestuft und als Issues mit Screen-ID geführt; kritische/schwere Befunde sind **Gate** für die Phase.

### 7.4 Metriken

| Metrik | Quelle | Zielwert | Zeitpunkt |
|---|---|---|---|
| Aufgabenerfolg Kernaufgaben | Usability-Tests | ≥ 80 % je Aufgabe (7.3) | Test 1/2/3 |
| Zeit bis erste Entscheidung | Test + lokale Telemetrie (nur Opt-in) | ≤ 2 min | P6 |
| Zeit bis erste Kaufentscheidung | Test | ≤ 20 min im Lernmodus | P6 |
| SUS | Test | ≥ 75 | Test 3 |
| Anteil Kennzahlen mit Erklär-Karte | Registry-Test | 100 % | CI |
| A11y-Verstöße (kritisch/ernst) | axe | 0 | CI |
| Fokusverlust bei Neuberechnung | Playwright | 0 | CI |
| Layoutverschiebung (CLS) | Lighthouse/Playwright | < 0,05 | CI |
| INP / Interaktionsdauer | Messung | < 200 ms (Zielwert 100 ms) | Release |
| Abbruchquote Onboarding | lokale Telemetrie (Opt-in), anonym | < 15 % | P6–P8 |
| Debrief-Abschlussquote (nicht übersprungen) | Telemetrie/Test | beobachten (kein Zielwert, kein Druck) | P6 |
| Anteil Spielzeit mit offenen Fristen im Verzug | Spielstatistik | nur Auswertung | P8 |

**Telemetrie:** standardmäßig **aus**; Opt-in, nur anonymisierte Ereigniszähler, nie Spielstandinhalt; vollständig lokal exportierbar. Keine Metrik darf zu Manipulationsmustern führen (B11/B13 Nr. 15).

### 7.5 Review-Rituale mit Plugins

| Ritual | Wann | Plugin/Werkzeug | Ergebnis |
|---|---|---|---|
| **Design-Erstellung** | beim Bau jedes Screens/jeder Komponente | `frontend-design` (Plugin): Umsetzung gegen Tokens/Komponenten-Katalog, keine generischen Layouts | Umsetzung ohne Eigenfarben, Stories vollständig |
| **Design-Critique** | je Screen vor „fertig“; je Phase gebündelt | Design-Plugin `design-critique` mit Screenshots (D/T/M, hell/dunkel) | Befundliste nach Hierarchie, Konsistenz, Dichte; Maßnahmen im PR |
| **Accessibility-Review** | je Screen vor „fertig“; vor jedem Release | Design-Plugin `accessibility-review` + axe-Berichte (6.2) | WCAG-2.2-Befunde mit Schweregrad; kritische blockieren |
| **UX-Copy-Review** | je Screen/Dialog, besonders Entscheidungen, Fehler, Mentor-Texte | Design-Plugin `ux-copy` gegen Regeln 5.2 | du-Form, Knopftexte, keine Beratung, Glossar-Links |
| **Fach-Review der Texte** | Mentor-/Lektionstexte, Rechts-/Steuerhinweise | Agent `fach-pruefer` + Auftraggeber | geprüft/Datum im Content-Paket |
| **Code-Review UI** | je PR | `code-review`-Plugin + dependency-cruiser (nur `ui` → keine Rechenkernlogik) | Regeln: Tokens statt Hex, K-01 statt eigener Formatierung |
| **Wöchentlicher Walk-through** | je Sitzung/Woche | Playwright-Trace + Screenshot-Reihe der Top Tasks T1–T10 | „Tastatur-Durchlauf“ und „Mobil-Durchlauf“ je ein Top Task |
| **Phasen-Review** | Phasenende | Gesamtkontrolle gegen DoD 7.1, Audit-5-Regressionsliste, Anti-Pattern-Liste (B13) | Freigabe oder Nacharbeit |
| **Retrospektive** | nach Usability-Test | Befunde → Backlog, Regel-Updates in dieses Dokument | Änderungsprotokoll |

---

## 8. Reihenfolge der UI-Umsetzung je Phase (P0–P9)

Prinzip: **Design-System und Shell zuerst, Kern-Screens als vertikaler Schnitt (P3), dann Tiefe, dann Politur.** Jede Phase liefert nur Screens, die den DoD (7.1) erfüllen; unfertige Funktionen erscheinen nicht (L8: Navigation von Anfang an vollständig, Platzhalter „kommt in Phase …“ nur mit Leerzustand K-18).

| Phase | UI-Lieferung | Komponenten/Overlays | Prüfung |
|---|---|---|---|
| **P0 Fundament** | App-Shell (Router, Sidebar/Rail/Tab-Leiste, Zeitleiste als leere Hülle), **Design-Tokens hell/dunkel/Kontrast**, Schriften, PWA-Manifest, Storybook, Playwright + axe-Grundgerüst, `tokens:kontrast`-Skript, Leerzustände aller Bereiche (S-06 bis S-37 als Platzhalterrouten) | Tokens, K-02 (Hülle), K-18, K-19, K-20, K-23/24 (Grundform) | axe 0 auf Shell, Viewport-Matrix, Offline-Installation |
| **P1 Rechenkern** | **Datenvertrag `Kennzahl`**, Formatter K-01, Registry der Schlüssel, Formatierungs-Goldens; Entwickler-Ansicht „Kennzahl-Galerie“ (intern) | K-01, K-04 (Entwurf), K-06 | Goldens de-DE, Summentests Herleitung |
| **P2 Daten & Regionen** | S-38 Regionen-Profil, S-41 Quellen & Lizenzen, Karte Länder/Kreise (S-11 Karte-Grundlage), Status-Flags in realen Daten | K-06, K-13 (Karte/Balken), K-09 Grundform | Quellen/Stand überall sichtbar, Karte mit Listen-Alternative |
| **P3 Vertical Slice** | S-01–S-04 (basic), **S-02 Startassistent + Onboarding K1**, S-06 Cockpit, S-07 Monatsbericht, S-08/S-09 Posteingang, S-11 Liste+Kreis-Karte, S-13 Exposé, S-14 Bierdeckel+Vollkalkulation (ohne Steuer), S-16, S-17, S-18 Einzelgebot, S-19, S-20/21/23 (Basis), S-27 Kontostand, S-28 Übersicht, S-34 Glossar (Grundbestand), S-37 Ziel; **O-01, O-02, O-04, O-05, O-07, O-10, O-11, O-12 (leicht), O-13, O-14**, O-03 Grundgerüst, O-06 Grundfunktion, Krisen-Banner (Skript) | K-01–K-20, K-23/24, K-28/29 | Screen-DoD für alle; axe, Tastatur-E2E T1–T5, visuelle Regression, **Usability-Test 1** |
| **P4 Bewirtschaftung & Steuern** | S-10 Chronik, S-21 vollständig, S-22 + Mieterhöhungs-Assistent, S-23 vollständig, S-24, S-25, S-30 Steuern, S-31 Jahresbericht, S-36 Tagebuch, S-39, S-40 Kalender, **O-09 Jahresabschluss (3.7), Debrief v1**, Zeitbudget/Delegation | K-14 (komplexe Prozesse), K-17 | T6, T9, NK-/WEG-Abrechnung E2E, Screen-DoD |
| **P5 Skalierung & Finanzen** | S-12, S-15, S-18 Gebotsrunden, S-20 vollständig (Linsen, Gruppen), S-26 Verkauf, S-27 Prognose + Wasserfall Portfolio, S-28 Anschluss/Sondertilgung, S-29 Bank, S-32 Szenario-Labor, **S-43 + O-08 Krisen-Flow (3.6)** | K-10/11 gespeicherte Ansichten, K-13 Tornado/Szenarien, K-12 vollständig | T7, T8, T10, Krisen-Eskalationstests, Tabellen mit 200 Zeilen |
| **P6 Lernen & Szenarien** | S-33 Lernpfad/Challenges, S-34 vollständig, S-35 Mikro-Lektionen, S-36 Debrief-Archiv, S-37 vollständig, S-42 Kauf-Review, S-03 Checkpoints, **Mentor v1 (3.10)**, **Modell-Progression (3.11)**, Schattenrechnung | K-26, O-03 voll, Auszeichnungen (sparsam) | **Usability-Test 2** (Onboarding), Textreview `ux-copy` |
| **P7 Profi-Inhalte** | Struktur-Vergleiche (GmbH/vvGmbH) mit Disclaimer-Dialog, Aufteilung WEG, Modernisierung, Gemeinde-Karte (MapLibre), K10 | bestehende Komponenten; Karte neu | Disclaimer-Tests, Karten-A11y (Liste als Alternative) |
| **P8 Release Web** | S-04 vollständig, S-05 Konto/Sync (optional), S-31 Export, Update-Dialog, Backup-Erinnerung, Impressum/Datenschutz, Quellen vollständig, **A11y-Audit WCAG 2.2 AA** inkl. Screenreader-Runde, Performance-Politur | – | **Usability-Test 3**, SUS ≥ 75, axe 0 |
| **P9 Mobile** | Capacitor-Anpassungen: Safe Areas, Tastatur-Verhalten, Zurück-Geste, Haptik dezent, Store-Disclaimer, TalkBack/VoiceOver-Runden | – | Mobile Release Check, TalkBack-Stichproben |

**Abhängigkeiten:** O-01 und K-04 brauchen den Datenvertrag aus P1; Karte braucht P2-Daten; O-09 braucht P4-Rechenkern (NK, Steuern); O-08 braucht P5-Bank/Anschluss; Mentor und Debrief-Archiv brauchen P6-Content. Ohne die Voraussetzung wird die Funktion **nicht angedeutet**, sondern als Leerzustand mit Phasenhinweis geführt.

**Offene Punkte (zur Entscheidung):** (1) Schriftlizenz Inter/Plex final bestätigen (OFL); (2) Kontrastwerte in 4.1 im Designreview mit echten Flächen nachmessen; (3) Gender-/Inklusionsregel in 5.2 mit dem Auftraggeber abstimmen; (4) Telemetrie Opt-in ja/nein; (5) Reserve-Schwelle und Stufenschwellen in 3.6 aus Fachspezifikation 10/12 verbindlich verankern; (6) Schreibweise Plugin-Namen (`design-critique`, `accessibility-review`, `ux-copy`) beim Installieren in P0 verifizieren.
