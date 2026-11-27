# 08 – Entscheidungen und Risiken

**Stand:** 26.11.2026

---

## 1. Getroffene Entscheidungen

| # | Datum | Entscheidung | Begründung / Quelle |
|---|---|---|---|
| E1 | 26.11.2026 | **React 19 + Vite + TypeScript als Offline-PWA, später Capacitor** | Punktevergleich 45/50 vor Svelte 40, Expo 38, Tauri 37, Flutter 35 (`../research/22-…` §2) |
| E2 | 26.11.2026 | **Desktop/Tablet zuerst**, Handy voll spielbar | datendichte Analyse, Multi-Pane |
| E3 | 26.11.2026 | **Echte Regionen, generierte Objekte**; fehlende Werte sichtbar „geschätzt“ | Trainingsbezug zur echten Suche; Vault hat 12.588 Gebiete |
| E4 | 26.11.2026 | **Start Nov. 2026 + simulierte Zukunft + historische Szenarien** | aktuelles Training + „Was wäre wenn 2012/2022“ |
| E5 | 26.11.2026 | **Alten Code verwerfen** (Ideen bleiben) | Audit: Architektur- und Balancing-Fehler (`../research/01-…`) |
| E7 | 27.11.2026 | **Fokusländer Niedersachsen, NRW, Bremen** (O9 erledigt) | Vorgabe Auftraggeber; Details `09-fokuslaender.md` |
| E8 | 27.11.2026 | **Kein Gendern** | Vorgabe Auftraggeber; ersetzt 03 §5.2-Regel |
| E6 | 26.11.2026 | **IC-Vault = Single Source of Truth** für Fakten, Export-Snapshot ans Spiel | Quellenpflicht, Trennung Fakt/Spielmechanik |

---

## 2. Offene Entscheidungen (mit Empfehlung als Standard)

Wenn du nichts anderes sagst, gilt die Empfehlung. **Fett** = vor der genannten Phase wirklich von dir zu klären.

| # | Frage | Empfehlung | Bis |
|---|---|---|---|
| O1 | UI-Kit | shadcn/ui + Base UI + Tailwind 4 (Alternative Mantine: schneller, weniger Eigenbau) | P0 |
| O2 | Formulare | TanStack Form v1 | P0 |
| O3 | Undo/Zeitreise | Undo nur im laufenden Monat; Checkpoints nur im Lernmodus; Ironman optional für Challenges | P3 |
| O4 | Datenpakete im Spielstand | Regionsparameter beim Spielstart in den Spielstand kopieren | P2 |
| O5 | Karte | MVP Länder/Kreise (ECharts), Gemeinde-Ebene in P7 (MapLibre) | P2 |
| O6 | Sprachen | nur Deutsch; i18n-Bibliothek trotzdem von Anfang an | P0 |
| O7 | Anrede in Texten | **du** (Lernspiel, Community-Ton) | P3 |
| O8 | Zeitbudget-Mechanik (Stunden/Monat) | ja, als DESIGN gekennzeichnet und abschaltbar | P4 |
| ~~O9~~ | ~~Fokusländer~~ → **entschieden als E7**; offen nur noch: dein Wohn-/Zielort als Startregion | – | P2 |
| O10 | Vault-Erweiterung durch Agents (Strang W) | Agents erweitern den Vault in Batches (≤ 20 Notizen), mit Lint und Bericht; Freigabe je Batch durch dich | P2 |
| O11 | Hosting | Cloudflare (Workers Static Assets); eigene Domain später | P0 |
| O12 | Repo-Sichtbarkeit | privat bis Release | P8 |
| **O13** | **Monetarisierung** | zunächst keine (privates Trainingswerkzeug); Entscheidung vor öffentlichem Release | **P8** |
| **O14** | **Lizenzen** (Code, Vault-Inhalte als Spieldaten) | Code proprietär/privat; Vault-Inhalte bleiben deine; Datenvermerke (BKG, Destatis, BA) Pflicht | **P8** |
| O15 | KI-Mentor | Stufe 1: vorgenerierte, geprüfte Texte (offline); Live-Mentor frühestens nach P8 (Kosten, Proxy) | P6 |
| O16 | Telemetrie | keine im MVP | P8 |
| O17 | Browser-Mindestanforderungen | letzte 2 Versionen von Safari, Chrome, Firefox, Edge | P0 |
| **O18** | **Mobile-Konten** | Mac vorhanden? Apple als Person oder Organisation (D-U-N-S)? DSA-Händlerstatus (öffentliche Adresse!)? Google privat (12 Tester/14 Tage) oder Organisation? | **P9** |
| O19 | Name des Spiels | Arbeitstitel „Immo“; Name vor P8 festlegen (Markenrecherche) | P8 |
| O20 | Historische Szenarien: GREIX-Daten | Lizenz beim Kiel Institut anfragen; bis dahin Destatis-HPI + Bundesbank | P6 |

---

## 3. Risiken

Bewertung: Wahrscheinlichkeit (W) und Wirkung (Wi) jeweils niedrig/mittel/hoch.

| # | Risiko | W | Wi | Gegenmaßnahme |
|---|---|---|---|---|
| R1 | **Fachliche Lücken** (Häufigkeiten, Dauern, Preise fehlen im Vault) | hoch | hoch | Strang W, Lücken-Register, sichtbarer Status GESCHÄTZT, Kennzahl „Anteil geschätzt“ je Engine |
| R2 | **Veraltete Quellen** (immocation 2020/21, Niedrigzins) | hoch | mittel | Profile 2021/2026, Abgleich mit Web-Recherche, `gueltigkeit: unbekannt` priorisiert prüfen |
| R3 | **Rechtsstand ändert sich** (Mietrecht II, ESt 2027, CO₂-Preis, GModG-Stufen) | hoch | mittel | `rulesVersion`, Jahreswechsel-Routine, offene Vorhaben als Politik-Ereignisse mit Wahrscheinlichkeit |
| R4 | **Komplexität überfordert Spieler** | mittel | hoch | Modell-Progression, Erklär-Karten, Monatsbericht-Bündelung, Hilfestufen, Usability-Tests in P3/P6/P8 |
| R5 | **Scope Creep** (zu viele Systeme vor dem ersten spielbaren Stand) | hoch | hoch | Vertical Slice P3 zuerst; jede Phase mit Demo und Freigabe; „Bewusst nicht“-Liste (`01-…` §15) |
| R6 | **Balancing kippt** (dominante Strategie, Exploits wie im Prototyp) | mittel | hoch | Anti-Exploit-Invarianten als Tests, Monte-Carlo-Bänder, Prototyp-Exploits als Regressionstests |
| R7 | **Determinismus bricht** zwischen Browsern/Geräten | mittel | hoch | `detmath`, PRNG-Ströme, Lint-Verbote, Hash-Test in 4 Engines |
| R8 | **Datenverlust** (IndexedDB unter Safari/iOS-WebView) | mittel | hoch | `persist()`, Autosave-Rotation, native Dateikopie, Export-Erinnerung |
| R9 | **Verwechslung mit Beratung** | mittel | hoch | Disclaimer-Konzept, Stand-Angaben, keine personalisierten Empfehlungen als „Rat“, Status-Flags |
| R10 | **Lizenzprobleme bei Daten** | mittel | mittel | nur offene Quellen (dl-de, BA mit Auflagen); GREIX/vdp/EPX vor Nutzung klären; keine Portaldaten |
| R11 | **Store-Ablehnung** (Apple 4.2 Web-Wrapper, 3.2.1(viii)) | mittel | mittel | echte Offline-App mit nativen Integrationen; Plan B iOS als PWA; Simulations-Disclaimer |
| R12 | **KI-Agenten nutzen veraltete APIs / erfinden Fachwerte** | hoch | mittel | CLAUDE.md mit Versionen + Referenzdateien; „keine Fachliterale“-Regel; fach-pruefer |
| R13 | **Rate-/Kostenlimits** bei parallelen Agents | hoch | niedrig | max. 3–4 parallele Agents; kleine Modelle für mechanische Arbeit |
| R14 | **Performance auf schwachen Handys** (Tabellen, Charts) | mittel | mittel | Virtualisierung, Canvas-Charts, Lazy-Routes, Messung auf Low-End-Gerät |
| R15 | **Bibliotheks-Umbrüche** (TanStack Table v9 jung, Capacitor 9, TS 7) | mittel | mittel | Pins über Catalogs, Renovate, dünne Wrapper, ADR je Upgrade |
| R16 | **Privatsphäre bei „Mein echtes Profil“** | niedrig | hoch | ausschließlich lokal, keine Telemetrie, Export nur auf Wunsch, Hinweis im Startassistenten |

---

## 4. Annahmen, die wir aktiv prüfen

| Annahme | Prüfung | Wann |
|---|---|---|
| Monatstakt reicht für alle Abläufe | Vertical Slice: Kaufprozess, Mietzahlung, Kündigungsfristen | P3 |
| Zeitbudget macht Delegation spannend, ohne zu nerven | Usability-Test 2 | P6 |
| Echte Regionen mit Teil-Schätzungen wirken glaubwürdig | Usability-Test 1 + Datenqualitäts-Indikator | P3 |
| Spieler lesen Erklär-Karten | Nutzung messen (lokal, im Test) | P3/P6 |
| Freies Spiel 2026 ist „schwer, aber fair“ | Monte Carlo: Anteil Profile, die in 10 Jahren 3+ Einheiten tragfähig halten | P5/P8 |
