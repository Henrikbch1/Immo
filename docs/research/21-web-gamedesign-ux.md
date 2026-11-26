# 21 – Game-Design & UX: Recherche und Design-Empfehlungen

**Stand:** 26.11.2026
**Zweck:** Grundlage für den Neuaufbau eines realistischen Immobilien-Investment-Simulationsspiels für Deutschland (Trainingswerkzeug: kaufen, Bestand aufbauen, skalieren). Web-first, später evtl. Mobile-App.
**Fokus dieses Dokuments:** Spielmechanik-Muster, Lernwirksamkeit, UX für Finanzdaten, Informationsarchitektur, Barrierefreiheit, Motivation. Fachinhalte (Steuern, Mietrecht, Finanzierung, Regionaldaten) stehen in anderen Recherche-Dokumenten.

> **Hinweis zu anderen Spielen:** Titel wie Football Manager, Paradox-Spiele oder Into the Breach dienen nur als Referenz für allgemeine Muster (z. B. „Weiter“-Knopf, verschachtelte Erklärungen, Folgenvorschau). Wir bauen nichts nach, weder Optik noch Struktur noch Begriffe.

### Methodik und Grenzen

- Recherche per Websuche (Stand Nov. 2026). Das direkte Abrufen einzelner Seiten (WebFetch) war in dieser Sitzung für mehrere Hosts (z. B. forum.paradoxplaza.com, footballmanager.com, gamedeveloper.com) **netzwerkseitig gesperrt**. Aussagen zu diesen Quellen beruhen auf Suchergebnis-Auszügen. Stellen, die vor einer verbindlichen Verwendung am Original geprüft werden sollten, sind mit **(prüfen)** markiert.
- Die deutschen Zahlenformate wurden lokal mit Node 22 (`Intl.NumberFormat('de-DE')`) **getestet** (siehe B6).
- Belegstärke: **[F]** = Forschung/Meta-Analyse, **[S]** = Standard/offizielle Leitlinie, **[P]** = Praxis/Fachartikel/Entwicklerbericht. Quellen-Kürzel (z. B. [L1]) verweisen auf das Quellenverzeichnis am Ende.

---

## 0. Kurzfassung – die wichtigsten Empfehlungen

1. **Zeitmodell:** rundenbasiert mit dem **Monat als Takt**, ohne Zeitdruck. Ein globaler **„Weiter“-Knopf** mit drei Modi: *1 Monat*, *bis zum nächsten Ereignis* (mit einstellbaren Stopp-Regeln), *bis Datum*. Echtzeit gibt es nicht. Ein optionales „Auto-Weiter“ ist jederzeit pausierbar.
2. **Der Posteingang ist die Zentrale.** Nur Dinge, die eine Entscheidung brauchen, landen dort mit Frist. Alles Routinemäßige geht in einen **Monatsbericht** (gebündelt statt 30 Einzelmeldungen).
3. **Jede Zahl ist erklärbar:** Antippen öffnet eine **Erklär-Karte** in drei Ebenen (Aussage → Aufschlüsselung/Formel mit echten Werten → Quelle, Annahmen, Rechtsgrundlage). Fachbegriffe darin sind wieder antippbar (verschachtelt, aber per Klick/Tap, nicht nur per Hover).
4. **Entscheidungen mit Folgenvorschau:** Vor jeder relevanten Aktion zeigen wir ein Vorher/Nachher der Kernkennzahlen, Kosten, Fristen und Risiken. Teure, unumkehrbare Aktionen bekommen einen Prüfschritt mit **konkretem Knopftext** („Kaufvertrag über 245.000 € beurkunden“), billige Aktionen bekommen **Rückgängig** statt Rückfrage.
5. **Lernen braucht Anleitung, Wiederholung und Nachbesprechung.** Forschung zeigt: Simulationen wirken, wenn Lernende aktiv handeln, beliebig oft wiederholen können, die Simulation in Lernangebote eingebettet ist und es ein **Debriefing** gibt. Daraus folgen: ein Lernpfad mit Szenarien, ein Entscheidungstagebuch, Jahres-Debriefs nach dem Muster der After Action Review und „Zurück zum Entscheidungspunkt“ im Lernmodus.
6. **Modell-Progression statt Textwand:** Das Onboarding ist das erste Szenario („Die erste Wohnung“). Systeme wie Steuern, Mieterhöhung oder Refinanzierung werden dann eingeführt, wenn sie zum ersten Mal gebraucht werden. Am Anfang stehen **Musterlösungen** (worked examples), die schrittweise ausgeblendet werden.
7. **Scheitern ist ein Prozess, kein Bildschirm:** Frühwarnung → Gegenmaßnahmen (Bankgespräch, Stundung, Notverkauf) → erst dann Zwangsversteigerung oder Insolvenz. Danach folgt eine Krisen-Analyse, und man kann ab einem Checkpoint neu versuchen (Lernmodus) oder einen neuen Lauf mit den gewonnenen Erkenntnissen starten.
8. **Informationsarchitektur:** fünf Hauptbereiche – **Cockpit, Posteingang, Markt, Bestand, Finanzen**. Dazu kommen die globale **Zeitleiste** (Datum + Weiter) und die **Akademie** (Lernen, Glossar, Debriefs). Mobil gibt es eine Tab-Leiste mit Zeitleiste darüber, auf Tablets eine Navigation Rail, auf dem Desktop eine Sidebar mit List-Detail-Layout und Erklär-/Mentor-Spalte.
9. **Barrierefreiheit ab Tag 1 (WCAG 2.2 AA):** Status nie nur über Farbe, Zielgrößen ≥ 24 px (bei uns 44 px), Regler immer mit Eingabefeld, Erklär-Popover per Tastatur erreichbar und schließbar, Diagramme mit Textzusammenfassung und Tabelle, `prefers-reduced-motion` und Dark Mode über Design-Tokens.
10. **Motivation ohne Manipulation:** selbst gewählte Ziele, Lernziele, informative Meilensteine und ein Jahresbericht zum Nachdenken. **Keine** Streaks, Login-Belohnungen, FOMO-Timer oder Ranglisten nach reinem Vermögen (die würden übermäßigen Hebel und Glück belohnen).

---

# Teil A – Erkenntnisse je Thema

## A1. Wirtschafts-/Management-Simulationen und Serious Games

### A1.1 Lernwirksamkeit von Simulationen (Forschung)

| Befund | Kernaussage | Quelle |
|---|---|---|
| Sitzmann (2011), Meta-Analyse, 65 Studien, ~6.500 Lernende | Simulationsspiele verbessern Selbstwirksamkeit (d≈0,52), deklaratives (d≈0,28) und prozedurales Wissen (d≈0,37) sowie das Behalten (d≈0,22). **Moderatoren:** aktives statt passives Lernen, **unbegrenzte Wiederholbarkeit**, **Einbettung in weiteren Unterricht**. Ist der Unterricht im Spiel überwiegend passiv, lernt die Vergleichsgruppe mehr. | [F] [L1] |
| Wouters et al. (2013), 77 Vergleiche | Serious Games: Lernen d=0,29, Behalten d=0,36 besser als konventionelle Instruktion. **Motivation nicht signifikant höher** (d=0,26, n.s.). Größere Effekte bei Kombination mit anderer Instruktion, **mehreren Sitzungen** und Gruppenarbeit. | [F] [L2] |
| Clark, Tanner-Smith & Killingsworth (2016) | Spiele g=0,33 gegenüber Nicht-Spiel; **Design ist wichtiger als das Medium**; „angereicherte“ Spieldesigns (z. B. mit Erklärungen) bringen zusätzlich g=0,34. Einfachere, schematische Visualisierung ist mindestens so wirksam wie aufwendige Grafik. | [F] [L3] |
| Kirschner, Sweller & Clark (2006) | Minimal angeleitetes Entdeckungslernen ist für Anfänger weniger effektiv als angeleitetes Lernen. Der Vorteil der Anleitung verschwindet erst mit ausreichendem Vorwissen (Expertise-Umkehr-Effekt). | [F] [L4] |
| Kapur, „Productive Failure“ | Wer erst an einem gut gestalteten Problem scheitert und danach gezielt angeleitet wird, lernt oft tiefer. Meta-Analyse mit 53 Studien und 166 Vergleichen. Voraussetzung: Probleme mit mehreren Lösungswegen und eine **anschließende Instruktion**. | [F] [L5] |
| Alessi (1988) und Folgearbeiten zur Wiedergabetreue (Fidelity) | Mehr Realismus ist für Anfänger nicht automatisch besser. Zu viel Detail kann das anfängliche Lernen bremsen, Realismus sollte mit der Kompetenz wachsen. | [F] [L10] |
| de Jong & van Joolingen (1998) | Lernende in Simulationen haben Mühe, Hypothesen zu bilden, Experimente zu planen, Daten zu interpretieren und sich selbst zu steuern. Hilfen: **konkrete Aufträge**, Aktivierung von Vorwissen, Modell-Progression. | [F] [L11] |
| Renkl: Worked-Example-Effekt | Am Anfang lernt man mehr aus ausgearbeiteten Beispielen als aus eigenem Problemlösen. Musterlösungen **schrittweise ausblenden** (Fading). | [F] [L12] |
| Sterman (1989): Fehlwahrnehmung von Rückkopplung | In dynamischen Entscheidungsumgebungen mit **Verzögerungen** erzeugen die meisten Versuchspersonen teure Schwingungen und Fehlentscheidungen. Verzögerte Wirkungen werden systematisch unterschätzt. | [F] [L13] |
| Pädagogische Agenten (Schroeder et al. 2013) | Kleiner positiver Lerneffekt. Agenten mit **Bildschirmtext** wirkten besser als solche mit Sprachausgabe. | [F] [L14] |
| Finanzbildungsspiele | Ein RCT mit 2.220 Lernenden in vier Ländern ergab +0,31 SD Finanzwissen. Andere Studien zeigen Effekte etwa auf dem Niveau klassischer Materialien. **Reflexionsaufforderungen** zusammen mit strategischer Spielmechanik erhöhten den wahrgenommenen Nutzen. | [F] [L15] |
| Debriefing (Crookall) | „Das eigentliche Lernen geschieht im Debriefing.“ Simulationen ohne Debriefing seien unvollständig. Neuere Ansätze verteilen Reflexionsmomente über die gesamte Sitzung. **Aber:** Die empirische Evidenz speziell zum Debriefing ist dünner als die Theorie (Feinberg). | [F]/[P] [L6] [L7] |

**Konsequenz:** Realismus allein lehrt nicht. Lernwirksam sind die **Hilfen um die Simulation herum**: Anleitung am Anfang, Wiederholbarkeit, Einbettung in Lerninhalte, sichtbare Ursache-Wirkungs-Ketten (gerade bei Verzögerungen) und strukturierte Reflexion.

### A1.2 Zeitmodell

- **Rundenbasiert erlaubt eigenes Lerntempo.** Soren Johnson: Ohne Zeitdruck passen Spieler die Lernkurve an ihre Bedürfnisse an. Mit gemeinsamer Uhr ist es schwerer, eine Oberfläche zu lernen. Jon Shafer: Rundenbasiert belohnt Analyse und Vorbereitung, Echtzeit belohnt Mustererkennung und Ausführung. Zeitdruck erzeugt Angst. [P] [G4]
- **Echtzeit mit Pause** ist ein Mittelweg, verschiebt das Spiel aber zu reaktiven Kommandos. [P] [G4]
- **„Weiter“-Knopf als Zeitmotor (Referenz Football Manager):** Die Zeit läuft nur auf Klick weiter, danach „steht die Uhr“. Der Knopf ist kontextabhängig: Bei offenen Pflichtentscheidungen ändert sich die Beschriftung, und man wird zuerst zu ihnen geführt. Neuere Versionen machen konfigurierbar, ob „Weiter“ durch ungelesene Nachrichten führt oder sie überspringt. Es gibt außerdem eine Einstellung zum automatischen Weiterlaufen, die trotzdem stoppt, wenn eine Entscheidung nötig ist. [P] [G1] (prüfen)
- **Barrierefreiheit:** Zeitlimits müssen abschaltbar, anpassbar oder verlängerbar sein (WCAG 2.2.1, Stufe A). Automatisch aktualisierte Inhalte müssen pausierbar sein (2.2.2). Ein rundenbasiertes Modell erfüllt das von Natur aus. [S] [A4]

### A1.3 Ereignis- und Posteingang-Systeme

- In der Referenz Football Manager ist der Posteingang der Mittelpunkt der Spielwelt. Die Entwickler berichten, dass der Home-Screen kaum genutzt und die meiste Zeit im Posteingang verbracht wurde. Das floss in die Neugestaltung ein, deren Prinzipien Effizienz, Vertrautheit und Vorhersagbarkeit heißen. [P] [G1] (prüfen)
- Benachrichtigungen sind per Definition Unterbrechungen. **Zusammengehörige Meldungen bündeln** ist besser als mehrere Einzelunterbrechungen. Toasts eignen sich nicht für Fehler, weil sie verschwinden. Statusindikatoren, Validierungen und Benachrichtigungen sind verschiedene Dinge. [P]/[S] [U7]
- Referenz Paradox: Alerts erklären, was sie anzeigen, und führen per Klick direkt zur zuständigen Oberfläche. Wichtiges lässt sich im „Outliner“ anheften. [P] [G2] (prüfen)

### A1.4 Berater- und Mentor-Figuren

- **Unaufgeforderte Hilfe kann schaden.** Proaktive Assistenten (Beispiel Clippy) wirken aufdringlich, wenn sie ohne gute Einschätzung der Absicht unterbrechen. Eine Studie von 2025 fand, dass vorausschauende Hilfe das Kompetenzgefühl bedroht und die Akzeptanz senkt. [F] [L17]
- **Horvitz' Prinzipien für Mixed-Initiative-Systeme:** Eingreifen nur abhängig von Zuversicht, Nutzerziel und Fehlerkosten. Höfliche Standardvorgaben, die sozialen Erwartungen entsprechen, und ein Gedächtnis für jüngste Interaktionen (z. B. was schon weggeklickt wurde). [F] [L17]
- Pädagogische Agenten bringen einen kleinen Lerneffekt, **Text wirkt besser als Sprachausgabe**. [F] [L14]

### A1.5 Umgang mit Informationsflut

- **Progressive Disclosure:** Fortgeschrittenes und Seltenes auf sekundäre Ebenen verschieben, das macht Software leichter erlernbar und weniger fehleranfällig. Risiko: Versteckte Funktionen müssen auffindbar bleiben. Was versteckt wird, sollte sich nach beobachtetem Nutzerverhalten richten. [S]/[P] [U1]
- **Verschachtelte Tooltips (Referenz Paradox):** Spielkonzepte und Zahlen-Aufschlüsselungen in Ebenen, sodass jeder Tooltip nur das Wesentliche zeigt und Spieler selbst entscheiden, wie tief sie gehen. Ein „Konzept“-Glossar verlinkt verwandte Begriffe. Offene Probleme sind, wie ein Tooltip offen bleibt (Maus-Tendenz, Timer-Sperre, Aktions-Sperre), und dass Spieler sich anfangs von Tooltip-Kaskaden „zugeschüttet“ fühlen. Ergänzend gibt es „Linsen“: thematische Sichten mit passender Kartenansicht. [P] [G2] (prüfen)
- **Klarheit vor Cleverness (Referenz Into the Breach):** Das Team „opfert coole Ideen jedes Mal zugunsten der Klarheit“. Gegner kündigen ihre Züge an, Folgen sind vor der Entscheidung sichtbar. Niederlagen fühlen sich dadurch wie eigene Fehler an, nicht wie unfaire Überraschungen. [P] [G3]
- **Dashboards nach Stephen Few:** Alles Nötige auf einen Bildschirm, auf einen Blick lesbar. Tachos und Gauges zeigen zu wenig auf zu viel Fläche. **Bullet Graphs** (Wert + Ziel + qualitative Bereiche in Abstufungen eines Farbtons) und **Sparklines** (Mini-Verlauf neben dem aktuellen Wert) sind besser. [P] [U11]

### A1.6 Tutorial und Onboarding ohne Textwand

- „Show, don't tell“: Text gibt eine Ursache vor, der Spieler entdeckt die Wirkung durch Handeln. Mechaniken schrittweise einführen, kontextbezogene und optionale Hinweise geben, überspringbar machen. Viel Text wird gerade von denen übersprungen, die ihn bräuchten. [P] [G5]
- **Gradual Engagement:** Erst Wert erleben, dann registrieren (Wroblewski, „lazy registration“). [P] [U16]
- Lernforschung dazu: Für Anfänger Anleitung und Musterlösungen [L4] [L12], aber Probieren vor Erklären nur in gezielt gestalteten Problemen [L5]. Realismus in Stufen steigern [L10] [L11].

### A1.7 Sandbox vs. Szenarien/Kampagne vs. Challenges

- Konkrete Aufträge sind eine wirksame Hilfe in Simulationen [L11]. Kurze, wiederholbare Einheiten und mehrere Sitzungen verstärken Lerneffekte [L1] [L2].
- **Lernziele schlagen bei komplexen Aufgaben reine Leistungsziele:** Ein festes Leistungsziel bei neuen, komplexen Aufgaben kann „Tunnelblick“ erzeugen, Lernziele führen eher zu besseren Strategien (Locke & Latham). [F] [M6]
- Folgerung: **Szenarien** mit Lernzielen (geführt), **Sandbox** für freies Üben und **Challenges** als kurze, vergleichbare Aufgaben mit klar umrissener Fragestellung.

### A1.8 Scheitern und Erholung

- Juul, „The Art of Failure“: Scheitern im Spiel trifft den Spieler selbst. Es motiviert, wenn man sich für das Scheitern **verantwortlich** fühlt und so auch für dessen Überwindung. Rückmeldung entscheidet, ob Scheitern als vorübergehend und behebbar erlebt wird. [P] [L16]
- **Ironman vs. Neuladen:** Ironman (kein Neuladen) macht Entscheidungen bedeutsam, kann aber frustrieren. Manche Designs nutzen bewusstes Neuladen als Lernwerkzeug. Spiele werden teils um Neuladen herum balanciert. [P] [G6]
- Kapur: Scheitern ist produktiv, wenn danach erklärt wird [L5]. Sitzmann: beliebige Wiederholbarkeit steigert den Lerneffekt [L1].

### A1.9 Feedback-Schleifen, Debriefing und Reflexion

- **Hattie & Timperley (2007):** Gutes Feedback beantwortet drei Fragen: *Wohin will ich?* (feed up), *Wo stehe ich?* (feed back), *Was ist der nächste Schritt?* (feed forward). Es wirkt auf vier Ebenen (Aufgabe, Prozess, Selbstregulation, Person), wobei Feedback zur Person am wenigsten hilft. Feedback kann auch schaden. [F] [L8]
- **After Action Review (Militär, später Unternehmen):** vier Fragen – Was sollte passieren? Was ist passiert? Warum? Was machen wir nächstes Mal anders? Erst Fakten (Fragen 1–2), dann Deutung (3–4). Etwa die Hälfte der Zeit entfällt auf die Frage „Was tun wir anders?“. Die Haltung ist ausdrücklich nicht strafend. [P] [L9]
- **Personal Informatics (Li, Dey & Forlizzi 2010):** Vorbereitung → Sammeln → Integrieren → **Reflektieren** → **Handeln**. Die Stufen wiederholen sich, und Hürden in frühen Stufen pflanzen sich fort. Das gilt für Statistiken und Jahresberichte: Daten nützen nur, wenn sie zur Reflexion und zu Handlungen führen. [F] [M7]
- Sterman: Verzögerte Wirkungen werden falsch wahrgenommen [L13]. Debriefs müssen deshalb **Ursachen über die Zeit verknüpfen** („Diese Liquiditätslücke stammt aus der Entscheidung im März 2027“).

## A2. UX für komplexe Finanzdaten

### A2.1 Zahlenformatierung (Deutschland)

- **Webstandard:** `Intl.NumberFormat('de-DE')` liefert `1.234.567,89 €` mit **geschütztem Leerzeichen** (U+00A0) vor dem €, `3,8 %` ebenfalls mit U+00A0 und kompakt `1,5 Mio. €`. Das Minus ist das ASCII-Zeichen U+002D, nicht das typografische Minus U+2212. (Lokal getestet, Node 22.) [S] [U13]
- **DIN 5008 / Duden:** Leerzeichen zwischen Zahl und Einheit bzw. %-Zeichen, laut Duden möglichst schmal und geschützt. Die DIN 5008 (Fassung 2020) bevorzugt für mehrstellige Zahlen die Gliederung mit Leerzeichen in Dreiergruppen. Für Geldbeträge ist die Gliederung mit Punkt verbreitet und in Banking-Oberflächen üblich (Detail **prüfen**, Quellen widersprechen sich teils). [P] [U13]
- **Eingabe:** `<input type="number">` ist für deutsche Dezimalkommas unzuverlässig. Browser speichern intern mit Punkt, iOS-Safari setzt teils falsche Trennzeichen, Kommas werden mitunter abgelehnt. Empfehlung aus den Fehlerberichten: `type="text"` + `inputmode="decimal"` + eigener Parser, der Komma und Punkt akzeptiert. [P] [U14]

### A2.2 Tabellen vs. Karten

- Datentabellen dienen vier Aufgaben: Datensätze nach Kriterien **finden**, Daten **vergleichen**, einen Datensatz **ansehen/bearbeiten**, **Aktionen** auf Datensätzen ausführen. Eine nicht-modale Seitenleiste erlaubt Bearbeiten, ohne die Tabelle aus dem Blick zu verlieren. [S] [U5]
- Mobil: Erst eine gute Desktop-Tabelle bauen, dann übersetzen. Horizontales Scrollen ist für große Tabellen akzeptabel, wenn **erkennbar** ist, dass rechts weitere Daten folgen. Kopfzeilen fixieren, Spaltenauswahl erlauben. Muster: Prioritätsspalten, gestapelte Zeilen bzw. Karten, aufklappbare Zeilen. [S]/[P] [U5]
- **Zahlenspalten rechtsbündig mit Tabellenziffern** (`font-variant-numeric: tabular-nums`, OpenType `tnum`). Gleich breite Ziffern stehen untereinander und erleichtern das Vergleichen. Nur in Zahlenkontexten einsetzen, nicht global. [S]/[P] [U12]

### A2.3 Wasserfall-Diagramme für Cashflow

- Wasserfälle eignen sich, um vom Anfangs- zum Endwert über positive und negative Beiträge zu kommen, also genau für Mietcashflows und Vermögensentwicklung. Anfangs- und Endwert als volle Balken, Zwischenschritte schwebend, Zwischensummen möglich, Verbindungslinien helfen, jeder Balken ist beschriftet. **Nur ein linearer Fluss pro Diagramm**, nicht für Daten, die sich nicht zu einer Summe addieren. [P] [U9]

### A2.4 Was-wäre-wenn und Szenario-Vergleich

- **Tornado-Diagramm** für die Sensitivitätsanalyse: Jede Annahme wird einzeln variiert, die Balken sind nach Wirkung sortiert. Man sieht sofort, welche Annahme am meisten zählt. Es ergänzt Spinnen- bzw. Liniendiagramme, die den Verlauf über die Bandbreite zeigen. Wechselwirkungen erfasst es nicht, dafür braucht es Mehrfach-Szenarien. [P] [U10]
- Regler brauchen eine Alternative ohne Ziehen (WCAG 2.5.7) [S] [A1]. Eingabefelder neben Reglern erlauben außerdem präzise Werte.

### A2.5 Erklärbarkeit, Tooltips, Glossar

- Tooltips dürfen **keine Informationen enthalten, die zum Erledigen der Aufgabe unverzichtbar sind**. Viele Tooltips wären unnötig, wenn Icons beschriftet wären. Mobil gibt es kein Hover, also per Tap öffnen, kurz halten und leicht schließbar machen. Auf nicht-interaktiven Elementen sind Tooltips für Tastatur- und Screenreader-Nutzer nicht erreichbar. [S]/[P] [U4]
- **WCAG 1.4.13:** Inhalte, die bei Hover oder Fokus erscheinen, müssen **schließbar** sein (z. B. mit Esc, ohne Maus oder Fokus zu bewegen), **überfahrbar** (die Maus darf auf das Popover wandern) und **beständig** (bleiben sichtbar, bis man sie schließt). [S] [A3]
- Verschachtelte Begriffserklärungen nach dem Paradox-Muster sind ein bewährtes Mittel gegen Textwände, siehe A1.5 [G2].

### A2.6 Vergleichsansichten

- Statische Vergleichstabellen eignen sich für wenige Optionen (unter 5), dynamische (Nutzer wählt selbst aus) für mehr. Gute Vergleichstabellen sind einfach, konsistent und informativ. Attribute, die nur bei einem Teil der Objekte vorhanden sind, schwächen den Vergleich (prüfen). [S] [U3]

### A2.7 Ampel- und Risiko-Indikatoren ohne Farbe als einziges Signal

- **WCAG 1.4.1:** Farbe darf nicht das einzige Mittel sein, Information zu vermitteln. Form oder Text ergänzen. **WCAG 1.4.11:** Bedeutungstragende Grafiken und Zustände brauchen 3:1 Kontrast zu Nachbarfarben. In Diagrammen gilt das für Linien, Balken, Segmente und Datenpunkte. Rot/Grün ist für Farbsehschwache problematisch, helle Trennränder zwischen Flächen helfen. [S] [A2]
- Bullet Graphs nach Few verwenden Abstufungen **eines** Farbtons für die Bereiche schlecht/ok/gut und sind damit robuster bei Farbsehschwäche [U11].

### A2.8 Rückgängig und Bestätigung bei teuren Aktionen

- „Never use a warning when you mean undo“ (Raskin): Warndialoge verhindern versehentliches Bestätigen nicht, weil Menschen Gewohnheiten bilden. Nur Rückgängig schützt wirklich. [P] [U6]
- NN/g: Bestätigungsdialoge **sparsam** einsetzen (Übernutzung trainiert Wegklicken) und **so konkret**, dass klar ist, was man bestätigt. Statt „Ja/Nein“ konkrete Beschriftungen wie „Löschen“ oder „100 € zahlen“. [S]/[P] [U6]
- **WCAG 3.3.4** (Stufe AA): Bei rechtlich bindenden oder finanziellen Transaktionen muss die Aktion umkehrbar, geprüft oder bestätigt sein. Wir übertragen das sinngemäß auf Spielaktionen. [S] [A1]

## A3. Muster guter Finanz-, Banking- und Investment-Apps

- **Vertrauen durch Transparenz:** Gebühren, Laufzeiten und Status früh und eindeutig zeigen. Menschen vertrauen Finanz-Apps, wenn sie verstehen, was passiert. Klare Fehlermeldungen nennen den nächsten Schritt. Begriffe werden mit kontextbezogenen Mikro-Erklärungen erläutert. Konsistenz sorgt dafür, dass man nach Updates nichts neu lernen muss. [P] [U15]
- **Startbildschirm:** Saldo, letzte Bewegungen und wichtige Hinweise in klarer Hierarchie, Onboarding schnell mit Progressive Disclosure. [P] [U15]
- **Formulare mit Live-Berechnung:** Ein durchgängiges Muster sind Kredit- und Sparrechner, bei denen jede Eingabe das Ergebnis sofort aktualisiert. Für uns ergänzen das Eingabefeld-Regeln (A2.1) und die Regler-Alternative (A2.4). *(Eigene Synthese, keine Einzelquelle.)*
- **Hinweis zur Quellenlage:** Die Literatur zur Fintech-UX besteht überwiegend aus Agentur-Blogs. Die Prinzipien sind plausibel und konsistent, aber nicht empirisch belastbar wie die Lernforschung.

## A4. Mobile-first-Informationsarchitektur für datendichte Anwendungen

- **Navigation nach Fensterbreite (Material 3 / Android):** kompakt < 600 dp → **Navigationsleiste unten** (3–5 Ziele). Mittel ≥ 600 dp und groß ≥ 840 dp → **Navigation Rail**, bei sehr großen Fenstern eine dauerhafte Seitenleiste (Drawer bzw. erweiterte Rail; der Drawer wird in M3 Expressive teils durch die erweiterte Rail ersetzt). [S] [U17]
- **Kanonische Layouts:** *List-Detail* (breit: Liste und Detail nebeneinander, schmal: nacheinander mit Zurück), *Supporting Pane* (breit: 70/30, mittel: 50/50, kompakt: Zusatzinhalt unten oder im **Bottom Sheet**), *Feed*. [S] [U17]
- **Apple HIG:** Tab-Leisten mit möglichst wenigen Tabs, „Mehr“-Überlauf vermeiden. Auf dem iPad eine Seitenleiste oder eine Tab-Leiste, die sich in eine Seitenleiste verwandeln lässt. Eine Fiori-Ableitung empfiehlt höchstens 5 Tabs in kompakter Breite. [S] [U18]
- **Bottom Sheets (NN/g):** Teil-Overlays für Kontext oder Steuerelemente, modal oder nicht-modal. Probleme sind **gestapelte Sheets** und verdeckte relevante Inhalte. Sheets müssen per Zurück und Wischen schließbar sein und einen Griff haben. [S] [U2]
- **Daumenzone (Hoober 2013):** 1.333 Beobachtungen; von den Personen, die den Bildschirm berührten, bedienten 49 % das Gerät einhändig, 36 % „gewiegt“ und 15 % mit beiden Händen. Häufige Aktionen gehören in den unteren Bildschirmbereich. Die Zahlen sind alt, Hoober hat seine Grafik später selbst relativiert (prüfen). Die Grundregel bleibt gültig. [F]/[P] [U19]
- **Gesten** sind Abkürzungen, nie der einzige Weg (WCAG 2.5.7 Ziehbewegungen, 2.5.1 Zeigergesten). [S] [A1]

## A5. Barrierefreiheit (WCAG 2.2 AA) und Design-Systeme

- **WCAG 2.2 (W3C-Empfehlung seit 5.10.2023), neu auf Stufe A/AA:** 2.4.11 Fokus nicht verdeckt, 2.5.7 Ziehbewegungen, 2.5.8 Zielgröße mind. 24×24 CSS-px, 3.2.6 Konsistente Hilfe, 3.3.7 Redundante Eingaben, 3.3.8 Barrierefreie Authentifizierung. [S] [A1]
- **Rechtlicher Rahmen DE:** Das Barrierefreiheitsstärkungsgesetz (BFSG) gilt seit 28.06.2025 für bestimmte Produkte und Dienstleistungen. Maßstab ist EN 301 549 (die WCAG enthält). **Ob ein Lernspiel darunter fällt, ist nach den gefundenen Quellen offen (prüfen).** Unabhängig davon empfehlen wir WCAG 2.2 AA als Ziel. [S] [A9]
- **Spielspezifisch:** Die Game Accessibility Guidelines gliedern Empfehlungen in Basic, Intermediate und Advanced. Dazu gehören z. B. ausreichend große Bedienelemente, Speichern jederzeit, Schwierigkeitsoptionen, anpassbares Spieltempo und vollständige Screenreader-Unterstützung. [S]/[P] [G7]
- **Bewegung reduzieren:** `prefers-reduced-motion` ist eine anerkannte Technik (W3C C39) für SC 2.3.3 (AAA). Nicht-essenzielle Bewegung wie Parallax kann Schwindel und Übelkeit auslösen. Reduzieren heißt nicht, alles zu entfernen, aber die Seite muss ohne Animation funktionieren. [S] [A5]
- **Dark Mode:** Die Forschung, die NN/g zusammenfasst, spricht für Dunkel-auf-Hell bei normaler Sehkraft, besonders bei kleiner Schrift. Viele wünschen sich trotzdem Dark Mode. Empfehlung: Systemeinstellung (`prefers-color-scheme`) übernehmen und einen manuellen Umschalter anbieten. [S]/[P] [U8]
- **Design-Tokens:** Das Format der W3C Design Tokens Community Group ist seit 28.10.2025 als **Version 2025.10 stabil** (Community-Group-Report, kein W3C-Standard). Ein Resolver-Modul behandelt Kontexte wie Hell/Dunkel. [S] [A8]
- **Tabellenziffern:** siehe A2.2 [U12].
- **Tastaturbedienung:** WAI-ARIA Authoring Practices: Ein Dialog setzt beim Öffnen den Fokus hinein, hält Tab darin gefangen, schließt mit Esc und gibt den Fokus an den Auslöser zurück. Das Grid-Muster bietet Pfeiltasten-Navigation für Datentabellen. [S] [A6]
- **Barrierefreie Diagramme:** Chartability bietet 50 Heuristiken, und WCAG-Konformität allein macht Diagramme nicht zugänglich. Datentabellen sind eine gängige Alternative, aber nicht immer gleichwertig. GOV.UK empfiehlt oft eine **Textbeschreibung** der Kernaussage, ergänzt durch eine Tabelle. [S]/[F] [A7]

## A6. Motivation ohne Manipulation

- **Selbstbestimmungstheorie (Ryan, Rigby & Przybylski 2006):** Spiele motivieren in dem Maß, in dem sie **Autonomie, Kompetenz und soziale Eingebundenheit** erlebbar machen. Erlebte Autonomie und Kompetenz hängen mit Spaß, Präferenz und Wohlbefinden zusammen. [F] [M1]
- **Belohnungen können intrinsische Motivation untergraben (Deci, Koestner & Ryan 1999, 128 Experimente):** Erwartete, greifbare Belohnungen, die an Teilnahme, Abschluss oder Leistung gekoppelt sind, senken die freiwillige Beschäftigung (d = −0,40/−0,36/−0,28). **Informatives** Feedback, das Kompetenz bestätigt, stärkt sie dagegen. Die Debatte darüber ist nicht abgeschlossen. [F] [M2]
- **Gamification-Meta-Analyse (Sailer & Homner 2020):** kleine positive Effekte auf kognitive (g = 0,49), motivationale (0,36) und Verhaltensergebnisse (0,25). Nur der kognitive Effekt ist in methodisch strengen Studien stabil. [F] [M3]
- **Abzeichen** steigerten in einem Feldexperiment die Aktivität (Hamari 2017). In einer früheren Studie wirkten sie nur bei Nutzern, die Abzeichen aktiv verfolgten. [F] [M4]
- **Dark Patterns in Spielen (Zagal, Björk & Lewis 2013):** Gestaltungsmuster, deren Zweck gegen die Interessen der Spieler gerichtet ist. Der Begriff ist umstritten (Deterding et al. 2020), als Prüfraster aber nützlich. [F] [M5]
- **Streaks:** Alles-oder-nichts-Serien nutzen Verlustaversion. Sie werden für Angst und Ausbrennen kritisiert, „Streak-Freeze“-Mechaniken behandeln das Symptom (Quellen sind überwiegend Kommentare) [P] [M8].
- **Ziele:** Spezifische, schwierige Ziele steigern Leistung. Bei **neuen, komplexen** Aufgaben sind **Lernziele** besser als feste Leistungsziele (Locke & Latham). [F] [M6]

---

# Teil B – Konkrete Empfehlungen für unser Spiel

## B1. Leitprinzipien (für alle Design-Entscheidungen)

1. **Erklären vor Beeindrucken.** Jede Zahl lässt sich herleiten, jede Folge ist vorher abschätzbar, Klarheit schlägt Effekt (vgl. [G3]).
2. **Realistisch in der Sache, gestuft in der Darstellung.** Das Rechenmodell ist voll realistisch. Im Lernpfad werden Teilsysteme schrittweise sichtbar [L10] [L11]. Vereinfachungen sind **immer gekennzeichnet**.
3. **Die Spielerin bestimmt das Tempo.** Kein Zeitdruck außerhalb der Spielwelt [G4] [A4].
4. **Entscheidungen sind der Spielinhalt.** Routine wird automatisiert oder gebündelt, Aufmerksamkeit gehört Entscheidungen mit Gewicht [U7].
5. **Verzögerungen sichtbar machen.** Was heute entschieden wird, wirkt oft erst in Monaten oder Jahren. Das Spiel zeigt die „Pipeline“ künftiger Effekte und verknüpft im Debrief Ursache und Wirkung [L13].
6. **Unsicherheit ehrlich zeigen.** Keine Scheingenauigkeit: Prognosen als Bandbreite, Annahmen mit Stand und Quelle.
7. **Lernen durch Reflexion.** Jede größere Phase endet mit einer kurzen, strukturierten Nachbesprechung [L6] [L9].
8. **Barrierefrei und responsiv von Anfang an**, nicht nachträglich.

## B2. Zeitmodell

**Empfehlung: rundenbasiert, der Monat als Simulationstakt, ohne Echtzeit.**

Begründung: Mieten, Raten, Hausgeld und Nebenkostenvorauszahlungen sind monatlich. Rundenbasiertes Spiel erlaubt eigenes Lerntempo und Analyse [G4], erfüllt WCAG 2.2.1 von Natur aus [A4] und passt zu einem Trainingswerkzeug, in dem Analyse geübt werden soll und nicht Reaktionsgeschwindigkeit.

### B2.1 Bedienung: die Zeitleiste mit „Weiter“

| Aktion | Verhalten |
|---|---|
| **Weiter (1 Monat)** | Standardaktion. Simuliert einen Monat und zeigt danach den Monatsbericht (einstellbar: immer / nur bei Auffälligkeiten / nie). |
| **Weiter bis Ereignis** | Simuliert Monat für Monat, bis eine **Stopp-Regel** greift (s. u.). Das ist der Hauptmodus für erfahrene Spieler. |
| **Weiter bis …** | Bis zu einem Datum, Quartals- oder Jahresende. Stoppt trotzdem bei Pflichtentscheidungen. |
| **Auto-Weiter** (optional) | Läuft Monat für Monat mit sichtbarer Pause-Taste. Die Geschwindigkeit ist einstellbar, bei reduzierter Bewegung gibt es keine Animationen (WCAG 2.2.2) [A4]. |

- **Kontextabhängiger Zustand** (Muster nach [G1]): Gibt es offene Entscheidungen mit Frist im aktuellen Monat, heißt der Knopf „2 Entscheidungen offen“ und führt zu ihnen. Ein Nebenmenü bietet „Standardfolge akzeptieren und weiter“ mit klarer Angabe der Folge (z. B. „Angebot verfällt“).
- **Stopp-Regeln (voreingestellt, einzeln abschaltbar):** Entscheidung mit Frist · neues Angebot passt zu einem Suchauftrag · Liquidität unter der Reserve-Schwelle · Ende der Zinsbindung in 12/6/3 Monaten · ein rechtlich möglicher Zeitpunkt für eine Mieterhöhung ist erreicht · Fristen wie das Ende der Spekulationsfrist · Jahresabschluss · Ereignis mit hoher Auswirkung (Schaden, Mietausfall, Kündigung).
- **Innerhalb eines Monats** gibt es keine weiteren Ticks. Abläufe wie Besichtigung, Finanzierungszusage, Notartermin oder Grundbuch dauern eine realistische Zahl von Monaten und erscheinen als **Fortschritts-Tracker**. Bieterverfahren laufen als strukturierte Gebotsrunden im Dialog ab, nicht in Echtzeit.
- **Entwürfe bis zum Monatswechsel:** Entscheidungen innerhalb eines Monats sind bis zum Klick auf „Weiter“ als *vorgemerkt* änderbar. Danach gelten sie, so realistisch und konsequent wie im echten Leben (Ausnahme: Lernmodus, siehe B9).
- **Verzögerte Wirkungen** werden in der **Zeitachse „Demnächst“** sichtbar: bekannte künftige Zahlungen und Fristen, zum Beispiel die Steuererstattung im Folgejahr, die Nebenkostenabrechnung oder das Zinsbindungsende.

## B3. Kern-Spielschleife(n)

Drei verschachtelte Schleifen, jede mit eigenem Feedback:

```
MIKRO (jeder Monat, 1–3 Min.)
  Posteingang sichten → Entscheidungen treffen (mit Folgenvorschau)
  → [Weiter] → Monatsbericht („Was ist passiert?“) → neue Ereignisse

MESO (pro Deal, Wochen bis Monate Spielzeit)
  Markt/Suchauftrag → Exposé prüfen → Analyse (Kalkulator, Szenarien)
  → Due Diligence (kostet Zeit/Geld, deckt Verborgenes auf)
  → Finanzierung anfragen (Bank prüft Bonität) → Gebot/Verhandlung
  → Kaufabwicklung (Tracker) → Übergabe → Bewirtschaften
  → Kauf-Review nach 12 Monaten („erwartet vs. tatsächlich“)

MAKRO (pro Jahr / Strategie)
  Jahresabschluss (Steuern, Abrechnungen) → Jahresbericht + Debrief
  → Ziele prüfen/anpassen → Strategie: kaufen, halten, modernisieren,
    refinanzieren/beleihen, verkaufen → nächstes Jahr
```

**Lernschleife quer dazu:** Erwartung notieren (optional) → entscheiden → Ergebnis (oft verzögert) → Rückmeldung → Reflexion → nächste Entscheidung. Das ist das Entscheidungstagebuch in B8.

**Gestaltungshebel, die die Schleife lehrreich machen:**
- **Information kostet:** Teilungserklärung, Protokolle der Eigentümerversammlungen, Rücklagenstand, Energieausweis und Gutachten kosten Zeit und/oder Geld. Wer sie weglässt, riskiert verdeckte Mängel. So lernt man durch Erfahrung, was man prüfen muss.
- **Figuren mit eigenen Interessen in der Spielwelt:** Makler (will verkaufen), Bankberater (will Produkte verkaufen), Verkäufer, Hausverwaltung, Handwerker, Mieter. Ihre Nachrichten sind plausibel, aber interessengeleitet. Das trainiert Urteilsvermögen. Der **Mentor** steht außerhalb der Spielwelt und ist neutral (B5.9).
- **Zufall ist erlaubt, aber vorhersehbar als Wahrscheinlichkeit:** Schäden, Leerstand und Zinsänderungen kommen mit Risikoprofilen, die vor der Entscheidung sichtbar sind. Rückschläge sollen sich als **eigene, nachvollziehbare Entscheidung** anfühlen, nicht als unfaire Überraschung (vgl. [G3] [L16]).

## B4. Informationsarchitektur

### B4.1 Hauptnavigation

| # | Bereich | Zweck | Mobil-Icon-Label |
|---|---|---|---|
| 1 | **Cockpit** | Lage auf einen Blick: 4–6 Kernkennzahlen, „Zu entscheiden“ (Top 3 aus dem Posteingang), „Demnächst“ (Zeitachse), Zielfortschritt | Cockpit |
| 2 | **Posteingang** | Alles, was eine Entscheidung braucht, mit Frist und Bezug zum Objekt | Posteingang (Badge = Anzahl offener Entscheidungen) |
| 3 | **Markt** | Angebote, Karte/Regionen, Suchaufträge, Merkliste, Vergleich, laufende Käufe | Markt |
| 4 | **Bestand** | Objekte, Einheiten, Mieter, Instandhaltung, Verkauf | Bestand |
| 5 | **Finanzen** | Liquidität, Kredite und Bank, Steuern, Berichte, Szenario-Labor | Finanzen |

**Global, immer sichtbar:**
- **Zeitleiste:** aktuelles Spieldatum, Status („2 Entscheidungen offen“) und Weiter-Knopf. Desktop: oben rechts in der App-Leiste. Mobil: als **schmale Leiste über der Tab-Leiste** in der Daumenzone, nach dem Muster eines Mini-Players.
- **Hilfe/Mentor** (Fragezeichen) immer an derselben Stelle (WCAG 3.2.6 Konsistente Hilfe).
- **Suche/Befehlspalette** (Desktop `Strg+K`): Objekte, Glossarbegriffe und Aktionen („Sondertilgung“).
- **Profilmenü:** Akademie, Ziele & Statistiken, Spielstände, Einstellungen.

**Akademie** (Lernen) ist auf dem Desktop ein eigener Eintrag im unteren Sidebar-Abschnitt, mobil liegt sie im Profilmenü und ist zusätzlich über jede Erklär-Karte erreichbar. Begründung: Fünf Tabs sind mobil das Maximum [U17] [U18], und die Hauptaufgaben im Spiel sind Entscheiden, Kaufen, Verwalten und Finanzieren. Das Cockpit bleibt bewusst schlank und zieht den Posteingang hinein, denn im Referenzspiel wurde der Home-Screen kaum genutzt, der Posteingang dagegen ständig [G1].

### B4.2 Screen-Inventar (vollständig)

**A. Rahmen und Meta**
1. Startbildschirm: Fortsetzen · Neues Spiel · Lernpfad (Szenarien) · Challenges · Akademie
2. Spielstart-Assistent (max. 3 Schritte): Modus → Startprofil (Vorlagen-Personas oder eigene Angaben: Nettoeinkommen, Eigenkapital, Wohnort/Region, Ausgaben) → Ziel (Vorlage oder eigenes) → Hilfestufe (Lernmodus/Standard/Profi)
3. Spielstände (Autosave, manuelle Stände, Checkpoints im Lernmodus)
4. Einstellungen: Darstellung (Hell/Dunkel/System, Schriftgröße, Dichte kompakt/komfortabel), Bewegung, Zahlenformat-Details, Stopp-Regeln, Monatsbericht-Verhalten, Mentor-Häufigkeit, Tastenkürzel (anpassbar/abschaltbar), Realismus-Optionen (gekennzeichnete Vereinfachungen)
5. Konto/Sync (optional, erst später anbieten, „Gradual Engagement“ [U16]); Anmeldung ohne Rätsel, Passkeys möglich (WCAG 3.3.8)

**B. Cockpit**
6. Cockpit: KPI-Kacheln (Nettovermögen, Liquidität + Reichweite in Monaten, Netto-Cashflow/Monat nach Steuern, Beleihungsquote, Leerstand), „Zu entscheiden“, „Demnächst“-Zeitachse, Ziel-Fortschritt, ggf. ein Mentor-Hinweis
7. Monatsbericht („Was ist passiert?“): Veränderungen mit Deltas, Ereignisse, Drill-down. Wird nach „Weiter“ angezeigt und ist im Archiv wieder abrufbar

**C. Posteingang**
8. Liste mit Filtern (Entscheidung nötig · Info · Erledigt · Verpasst) und Kategorien (Mieter, Bank, Markt, Behörde/Finanzamt, Handwerker, WEG)
9. Nachricht/Ereignis-Detail mit Entscheidungsdialog (B5.3)
10. Archiv/Chronik (durchsuchbar, verknüpft mit Objekten)

**D. Markt**
11. Angebote: Liste und Karte (Regionen mit Kennzahlen wie Kaufpreisfaktor, Mietniveau, Leerstand), Filter, Sortierung, „Linsen“ (Rendite · Cashflow · Lage · Risiko)
12. Suchaufträge (gespeicherte Suchen → erzeugen Posteingang-Ereignisse)
13. Exposé-Detail mit Reitern: Überblick · Lage & Region · Zahlen (Schnellkalkulation) · Unterlagen & Prüfung (Due Diligence) · Risiken · Verlauf/Notizen
14. Investitionsrechner/Kalkulator (Was-wäre-wenn, Annahmen-Leiste, Wasserfall, Tornado, Szenarien A/B/C)
15. Vergleich (2–4 Objekte)
16. Merkliste
17. Finanzierungsanfrage (Bank auswählen, Unterlagen, Haushaltsrechnung → Angebot(e))
18. Angebot/Gebot und Verhandlung (Gebotsrunden, Gegenangebote)
19. Kaufabwicklung-Tracker (Reservierung → Finanzierungszusage → Notartermin → Vormerkung → Kaufpreisfälligkeit → Übergabe)

**E. Bestand**
20. Portfolio-Übersicht: Tabelle (Desktop) bzw. Karten (mobil), Karte, Linsen (Cashflow · Finanzierung · Risiko · Steuern · Wert)
21. Objekt-Detail mit Reitern: Überblick · Einheiten & Mieter · Finanzierung · Kosten & Instandhaltung · Steuern · Wertentwicklung · Dokumente · Chronik
22. Einheit/Mietvertrag: Miete, Historie, Assistent für Mieterhöhung (zeigt rechtliche Grenzen und Begründung), Kündigung/Mieterwechsel
23. Vermietung: Inserat, Bewerberauswahl
24. Instandhaltung/Modernisierung: Planer, Angebote, Auswirkungen (Kosten, Miete, Steuer, Wert)
25. WEG-Bereich (bei Eigentumswohnungen): Hausgeld, Rücklage, Beschlüsse/Eigentümerversammlung
26. Verkauf-Assistent (Wertermittlung, Steuerfolgen, Vorfälligkeitsentschädigung, Erlös-Wasserfall)

**F. Finanzen**
27. Liquidität: Kontoverlauf, Cashflow-Wasserfall (Monat/Jahr), Prognose 12–36 Monate mit Bandbreite, Reserve-Schwelle
28. Kredite: Übersicht aller Darlehen, Tilgungsplan, Zinsbindung, Sondertilgung, Anschlussfinanzierung (Prolongation/Umschuldung/Forward)
29. Bank: Bonität/Haushaltsrechnung, Bankgespräche, Angebotsvergleich
30. Steuern: pro Objekt (AfA, Werbungskosten, Ergebnis), Jahresvorschau, Bescheide
31. Berichte: Monats- und Jahresberichte, Vermögensaufstellung, Export (PDF/CSV)
32. Szenario-Labor/Stresstest: Zins +2 Prozentpunkte, Leerstand, Mietausfall, Sanierung; wirkt auf das ganze Portfolio

**G. Akademie**
33. Lernpfad (Szenarien mit Lernzielen) und Challenges
34. Glossar (verlinkte Begriffe, Formeln, Rechtsgrundlagen)
35. Mikro-Lektionen (2–4 Min., interaktiv, an Spielsituationen gekoppelt)
36. Entscheidungstagebuch und Debrief-Archiv
37. Ziele, Meilensteine, Statistiken, Jahresberichte

**H. Überlagerungen (keine eigenen Seiten)**
- Erklär-Karte (Popover/Bottom Sheet/Seitenpanel), Mentor-Panel, Entscheidungsdialog, Prüfschritt für teure Aktionen, Befehlspalette, Toasts (nur Erfolg/Undo, nie Fehler), Krisen-Flow, Jahresabschluss-Sequenz.

### B4.3 Layouts je Fensterbreite

| Breite | Navigation | Layout-Muster | Beispiele |
|---|---|---|---|
| **Kompakt** (< 600 px) | Tab-Leiste unten (5) + Zeitleiste darüber | eine Spalte; Detail per Push-Navigation; Erklärungen und Filter im **Bottom Sheet** (nie gestapelt; tiefer geht es auf eine Vollseite) | Exposé → Kalkulator als eigene Seite |
| **Mittel** (600–839 px) | Navigation Rail links | List-Detail bei Bedarf; Zusatzpanel 50/50 | Posteingang: Liste + Detail |
| **Groß** (≥ 840 px) | Sidebar (erweiterte Rail), Zeitleiste oben rechts | **List-Detail + Supporting Pane (≈70/30)** für Erklär- und Mentor-Spalte; Tabellen mit Spaltenauswahl | Markt: Filter │ Liste │ Exposé; Bestand: Objekte │ Detail │ Erklärung |

Breakpoints nach Material 3 [U17]. Für Komponenten empfehlen wir **Container Queries**, damit eine KPI-Kachel in der Sidebar und im Hauptbereich jeweils passend umbricht.

**Skizze mobil (Cockpit):**
```
┌──────────────────────────────┐
│ Cockpit                 ?  ◯ │  ← Hilfe, Profil
│ Nettovermögen   84.200 €  ▲  │
│ Liquidität      12.400 €     │
│   reicht 5,2 Monate  ✓ solide│
│ Cashflow/Monat  +318 € n.St. │
│ ── Zu entscheiden (2) ────── │
│ ! Bank: Anschlussangebot     │
│   Frist: Feb 2027        ›   │
│ ! Mieter EG links kündigt ›  │
│ ── Demnächst ─────────────── │
│ Mär 27 Nebenkostenabrechnung │
├──────────────────────────────┤
│ Nov 2026 · 2 offen  [Weiter▸]│  ← Zeitleiste (Daumenzone)
├──────────────────────────────┤
│ Cockpit Post Markt Bestand Fin│  ← Tab-Leiste
└──────────────────────────────┘
```

**Skizze Desktop (Markt):**
```
┌Sidebar──┬─────────────────────────────────────────────── Nov 2026 · [Weiter ▸ ▾]┐
│Cockpit  │ Filter ▾  Linse: [Cashflow|Rendite|Risiko]   Sortierung ▾   Karte ⇄  │
│Posteing.├──────────────────────┬──────────────────────────────┬────────────────┤
│Markt  ● │ Ergebnisliste        │ Exposé: 3-Zi-ETW Leipzig     │ Erklärung      │
│Bestand  │ (Tabelle, tnum)      │ [Überblick|Zahlen|Prüfung…]  │ „Cashflow“     │
│Finanzen │                      │ Schnellkalkulation, Risiken  │ Formel, Werte, │
│─────    │                      │ [Vergleichen] [Kalkulieren]  │ Quelle, Glossar│
│Akademie │                      │                              │                │
└─────────┴──────────────────────┴──────────────────────────────┴────────────────┘
```

## B5. Komponenten-Muster

### B5.1 KPI-Kachel
- Inhalt: Bezeichnung, Wert (tnum), Einheit/Zeitraum („/Monat“, „nach Steuern“), Veränderung mit **Vorzeichen + Pfeil + Text** („+120 € ggü. Vormonat“), optional Sparkline [U11] und Bewertung mit Icon und Text (B5.8).
- **Wichtig:** Bewertungsfarbe richtet sich nach *gut/schlecht*, nicht nach dem Vorzeichen. Eine steigende Beleihungsquote ist eine positive Zahl, aber nicht „grün“.
- Tap/Klick öffnet die Erklär-Karte. Screenreader-Text in ganzen Sätzen („Netto-Cashflow 318 Euro pro Monat nach Steuern, 120 Euro mehr als im Vormonat“).

### B5.2 Erklär-Karte („Warum?“)
Drei Ebenen, schrittweise aufklappbar [U1] [G2]:
1. **Aussage:** ein Satz in Alltagssprache („Dir bleiben nach allen Kosten und Steuern 318 € pro Monat.“)
2. **Herleitung:** Formel mit **eingesetzten Werten** als kleine Tabelle bzw. Mini-Wasserfall; jeder Posten ist wieder antippbar.
3. **Grundlage:** Annahmen (editierbar → öffnet den Kalkulator), Datenquelle und Stand (z. B. Regionaldaten), Rechtsgrundlage (§§), Vereinfachungen gekennzeichnet, Link zu Glossar und Mikro-Lektion.

Verhalten: per Klick/Tap öffnen (nicht nur Hover). Desktop: Popover oder rechte Spalte, mobil: Bottom Sheet (eine Ebene, tiefer per Vollseite). Esc und Schließen-Knopf, Fokus zurück zum Auslöser [A3] [A6]. **Anheften** an die Seitenspalte, um Werte beim Ändern zu beobachten.

### B5.3 Entscheidungsdialog mit Folgenvorschau
- **Kopf:** Was ist zu entscheiden, bis wann, welches Objekt, wer fragt (inkl. Interessenhinweis bei Spielwelt-Figuren).
- **Optionen als Karten** (2–4), jeweils mit: Einmalkosten · monatlicher Effekt · Risikoveränderung · Zeitbedarf · was man dabei lernt bzw. aufdeckt.
- **Vorher → Nachher** der betroffenen Kernkennzahlen (Liquidität, Cashflow, Beleihungsquote, Steuer) **als Bandbreite**, wenn unsicher.
- **Standardfolge** bei Nicht-Entscheidung ausdrücklich nennen.
- Optional: **„Begründung/Erwartung notieren“** (ein Satz, wird im Debrief wieder vorgelegt).
- Lernmodus: Knopf **„Mentor-Check“** (stellt Prüffragen, entscheidet nicht).
- **Primärknopf mit konkreter Beschriftung** („Anschlussfinanzierung bei Bank B abschließen – 3,62 % für 10 Jahre“), kein „OK/Ja“ [U6].

### B5.4 Posteingang-Eintrag
- Zeile: Typ-Icon + Absender + Betreff + **Frist** („Antwort bis Feb 2027“) + Objekt + Status (neu/gelesen/erledigt/verpasst) als Text bzw. Icon.
- **Nur Entscheidungen zählen im Badge.** Infos ohne Handlungsbedarf (Mietzahlungseingang, Routine-Abbuchungen) gehen in den Monatsbericht, ähnliche Ereignisse werden gebündelt („3 Mieterhöhungen möglich“) [U7].
- Wischgesten (archivieren, vormerken) nur als Abkürzung, sichtbare Knöpfe im Detail [A1].

### B5.5 Zeitleiste/Weiter-Leiste
Siehe B2.1. Zusätzlich: Fortschrittsanzeige bei „Weiter bis Ereignis“ (Monate zählen hoch, **abbrechbar**). Ergebnis wird über eine Live-Region angesagt (WCAG 4.1.3 Statusmeldungen). Tastenkürzel ist konfigurierbar, Einzeltasten-Kürzel sind abschaltbar (WCAG 2.1.4).

### B5.6 Was-wäre-wenn-Panel (Szenario-Regler)
- Jede Annahme als **Regler + Eingabefeld + Stepper** (keine reinen Regler: WCAG 2.5.7, Präzision) mit Markierung des Basiswerts und „Zurücksetzen“.
- **Live-Ergebnis** oben fixiert: Cashflow, Rendite, Liquiditätsbedarf, Beleihungsquote, Vermögen nach N Jahren.
- **Szenarien A/B/C** speichern und nebeneinander zeigen, **Tornado-Diagramm** für die einflussreichsten Annahmen [U10], plus Stresstest-Voreinstellungen.
- Ergebnis als Bandbreite (pessimistisch/realistisch/optimistisch) statt einer einzigen Zahl.

### B5.7 Cashflow-Wasserfall
- Standardfolge: Kaltmiete → − nicht umlagefähige Kosten → − Instandhaltungsrücklage → − Zinsen → **= Cashflow vor Tilgung** → − Tilgung → **= Cashflow vor Steuern** → ± Steuereffekt → **= Netto-Cashflow**. Umschalter Monat/Jahr, Objekt/Portfolio.
- Zweiter Wasserfall „Vermögensentwicklung“ (Jahr): Anfangsvermögen → + Tilgung (Vermögensaufbau) → ± Wertänderung → ± kumulierter Cashflow → = Endvermögen.
- Barrierefrei: Textzusammenfassung („Von 850 € Kaltmiete bleiben nach allen Posten 112 € netto.“) + Tabelle [A7] [U9].

### B5.8 Status- und Risiko-Indikator (Ampel ohne Farbe als einziges Signal)
| Stufe | Form/Icon | Text | Farbe (zusätzlich) |
|---|---|---|---|
| Solide | Kreis mit Haken | „solide“ | Grün-Ton |
| Beobachten | Dreieck mit ! | „beobachten“ | Gelb/Orange-Ton |
| Kritisch | Achteck/Quadrat mit × | „kritisch“ | Rot-Ton |

- Immer mit **Begründung** in der Erklär-Karte („Reserve reicht 1,8 Monate, Ziel sind mind. 3“).
- Für Kennzahlen mit Schwellen: **Bullet Graph** (Wert, Zielmarke, Bereiche in Abstufungen eines Farbtons) [U11]. Kontraste ≥ 3:1 [A2].

### B5.9 Mentor-Hinweis
- **Rolle:** neutrale Coach-Figur außerhalb der Spielwelt, in Textform [L14]. Sie stellt Prüffragen, erklärt und verweist auf Lektionen, **entscheidet aber nie**.
- **Initiative kalibrieren** [L17]: proaktiv nur bei hoher Tragweite und hoher Sicherheit (z. B. Kauf ohne Liquiditätsreserve, Zinsbindungsende ohne Anschlusslösung). Sonst nur auf Abruf.
- Jeder Hinweis bietet „Warum zeigst du mir das?“, „Später“ und „Nicht mehr zu diesem Thema“. Die Häufigkeit hängt von der Hilfestufe ab und **sinkt mit nachgewiesener Kompetenz** (Expertise-Umkehr [L4]).
- Nicht blockierend (kein Modal), Platzierung konstant (WCAG 3.2.6).

### B5.10 Vergleichsansicht
- 2–4 Objekte oder Finanzierungsangebote, fixierte Kopfzeile und Beschriftungsspalte, **„Nur Unterschiede zeigen“**, gruppierte Zeilen (Preis & Kosten · Ertrag · Finanzierung · Lage · Risiken).
- Beste Werte je Zeile mit Icon und Text markiert, nicht nur farbig. Mobil: zwei Spalten sichtbar, weitere per Wischen mit Hinweis „+2 weitere“, alternativ Umschalter [U3] [U5].

### B5.11 Datentabelle ↔ Kartenliste
- Desktop: Tabelle mit sortierbaren Spalten, Spaltenauswahl, gespeicherten Ansichten und Linsen, Zahlen rechtsbündig mit tnum, ARIA-Grid für Pfeiltasten-Navigation [A6].
- Mobil: Karten mit 2–3 Prioritätswerten je Linse, Filter und Sortierung als Chips + Bottom Sheet [U2] [U5].

### B5.12 Fortschritts-Tracker (Prozesse über Monate)
Für Kauf, Verkauf, Sanierung und Anschlussfinanzierung: Schritte mit Status, erwartetem Monat, Kosten und „Was passiert hier?“ (Erklär-Karte). Das macht Verzögerungen sichtbar [L13].

### B5.13 Bestätigung, Entwurf und Rückgängig – Entscheidungsmatrix
| Aktionstyp | Beispiel | Muster |
|---|---|---|
| billig & umkehrbar | Merkliste, Notiz, Filter, Archivieren | sofort ausführen + **Rückgängig** (Toast mit ausreichender Dauer, zusätzlich im Verlauf) [U6] |
| umkehrbar bis Monatsende | Instandhaltung beauftragen, Mieterhöhung vorbereiten | Status **„vorgemerkt“**, bis „Weiter“ änderbar |
| teuer/unumkehrbar | Kaufvertrag, Verkauf, Kreditkündigung, große Sondertilgung | **Prüfschritt** mit Zusammenfassung und Folgenvorschau, konkreter Knopftext, kein Ja/Nein; Lernmodus: „Mentor-Check“ angeboten (WCAG 3.3.4) |
| destruktiv (Meta) | Spielstand löschen | Bestätigung mit Namen des Spielstands; Papierkorb mit 30 Tagen |

### B5.14 Leere Zustände
Jede leere Liste erklärt, was hier künftig steht, und bietet den nächsten sinnvollen Schritt an („Noch kein Suchauftrag – lege einen an, dann meldet sich der Markt bei dir.“).

### B5.15 Glossar-Begriff (inline)
Gepunktete Unterstreichung, per Tap/Klick ein kurzes Popover (1–2 Sätze) mit „Mehr im Glossar“. Abkürzungen (AfA, LTV, DSCR) beim ersten Auftreten ausgeschrieben.

## B6. Zahlen- und Formatierungs-Styleguide

**Technik:** Alle Ausgaben laufen zentral über `Intl.NumberFormat('de-DE')` bzw. `Intl.DateTimeFormat('de-DE')` (getestet, Node 22):

| Fall | Ausgabe | Regel |
|---|---|---|
| Betrag | `1.234.567,89 €` | Punkt als Tausendertrenner, Komma als Dezimaltrenner, **geschütztes Leerzeichen** vor € (Intl erzeugt U+00A0) |
| Betrag in Tabellen/KPIs | `245.000 €` | ganze Euro, außer wo Cent relevant sind (Miete, Hausgeld, Rate) |
| Kompakt (nur Platzmangel, z. B. Achsen, Karten) | `1,5 Mio. €` | im Screenreader-Text ausgeschrieben („1,5 Millionen Euro“) |
| Prozent | `3,8 %` | Leerzeichen vor % (Intl: U+00A0) |
| Zinssätze | `3,62 %` | 2 Nachkommastellen; Renditen 1 Nachkommastelle |
| Zinsänderung | `+0,50 Prozentpunkte` (kurz „Pp.“) | Prozentpunkte ≠ Prozent, im Glossar erklärt |
| Veränderungen | `+120 €`, `−4,2 %` | **immer mit Vorzeichen**; typografisches Minus U+2212 prüfen (Intl liefert U+002D) und mit Screenreadern testen |
| Zeitraum | `318 €/Monat`, `3.816 €/Jahr` | Zeitbezug immer angeben; „vor/nach Steuern“ angeben |
| Datum (Spielzeit) | `Nov. 2026`, lang `November 2026` | Monat als kleinste Einheit; Fristen in Monaten |
| Unsicherheit | `290–350 €/Monat` | Bandbreite statt Scheingenauigkeit |

**Typografie:** Schrift mit Tabellenziffern (OpenType `tnum`), z. B. Inter, IBM Plex Sans oder Source Sans 3 (Lizenz prüfen). `font-variant-numeric: tabular-nums` **nur** in Tabellen, KPIs und Formularwerten, im Fließtext proportionale Ziffern [U12]. Zahlenspalten rechtsbündig mit gleicher Anzahl Nachkommastellen je Spalte.

**Eingabe:** `type="text"` + `inputmode="decimal"` + eigener Parser: akzeptiert „250000“, „250.000“, „250.000,50“, „250000,5“ (das letzte Komma oder der letzte Punkt mit ≤ 2 Folgeziffern gilt als Dezimaltrenner). Beim Verlassen des Feldes formatiert anzeigen, Einheit als festes Suffix, Fehlermeldung mit Lösung („Bitte einen Betrag wie 250.000 eingeben“) [U14] [U7].

## B7. Onboarding-Konzept

**Ziel:** In unter 2 Minuten die erste echte Entscheidung treffen, ohne Textwand und ohne Registrierung.

1. **Startprofil in 3 Schritten** (Vorlagen-Personas mit realistischen Zahlen oder eigene Werte). Registrierung erst, wenn Sync gewünscht ist [U16].
2. **Das Tutorial ist ein Szenario: „Die erste Wohnung“.** Ein Suchauftrag liefert drei Angebote. Der Mentor zeigt bei Angebot 1 eine **Musterprüfung** (worked example), bei Angebot 2 füllt die Spielerin einzelne Schritte selbst aus (Fading), Angebot 3 prüft sie allein [L12].
3. **Interaktive Hinweise statt Text:** „Tippe auf *Cashflow*, um zu sehen, woraus er besteht“, dann entdeckt sie den Wasserfall selbst [G5]. Pro Bildschirm höchstens ein Hinweis, jeweils nur beim ersten Mal und immer überspringbar.
4. **Modell-Progression im Lernpfad** [L10] [L11]: Stufe 1 Kaltmiete, Zins, Tilgung, Reserve → Stufe 2 Nebenkosten, Instandhaltung, Leerstand → Stufe 3 Steuern (AfA, Werbungskosten) → Stufe 4 Anschlussfinanzierung und Zinsrisiko → Stufe 5 Skalieren (Beleihung, Portfolio-Steuerung, Verkauf). Noch nicht eingeführte Systeme laufen realistisch im Hintergrund mit und werden **als vereinfacht gekennzeichnet** angezeigt („Steuern: pauschal geschätzt – wird in Szenario 3 erklärt“).
5. **„Neu“-Markierungen** bei neu freigeschalteten Bereichen statt Funktionen, die plötzlich auftauchen. Die Navigation bleibt von Anfang an stabil (Vorhersagbarkeit).
6. **Expertenweg:** „Ich kenne mich aus“ führt zu einem kurzen Einstufungs-Check (5 Fragen) oder direkt zur Sandbox mit allen Systemen. Hilfestufe Profi bedeutet weniger Stopps und einen Mentor nur auf Abruf.
7. **Gezieltes Scheitern** (Productive Failure, [L5]) erst ab Szenario 2, in klar gerahmten Aufgaben mit anschließender Erklärung, nie im allerersten Kontakt.

## B8. Feedback, Debriefing und Reflexion

**Feedback auf vier Zeitskalen**, jeweils nach dem Schema *Ziel – Stand – nächster Schritt* [L8]:

| Zeitpunkt | Form | Inhalt |
|---|---|---|
| vor der Entscheidung | Folgenvorschau (B5.3) | erwartete Wirkung, Bandbreite, Risiken |
| direkt danach | Bestätigung + Zeitachse | „Gebucht. Wirkt ab Jan 2027 auf den Cashflow.“ |
| monatlich | Monatsbericht | was sich geändert hat und warum (Drill-down) |
| ereignisbezogen | **Kauf-Review nach 12 Monaten** | erwartet vs. tatsächlich, Abweichungen erklärt |
| jährlich | **Jahresbericht + Debrief** | siehe unten |

**Entscheidungstagebuch:** Bei wichtigen Entscheidungen kann die Spielerin in einem Satz ihre Erwartung und Begründung festhalten. Das Spiel speichert dazu automatisch den **Informationsstand zum Entscheidungszeitpunkt**.

**Jahres-Debrief nach dem Muster der After Action Review** [L9] (3–5 Minuten, überspringbar, aber prominent):
1. *Was war geplant?* Ziele und Erwartungen aus dem Tagebuch.
2. *Was ist passiert?* Fakten: Kennzahlen, Ereignisse, Abweichungen.
3. *Warum?* Ursachenkette über die Zeit, Unterscheidung **„Entscheidung“ vs. „Pech/Glück“** (bewertet nach dem damals verfügbaren Wissen, nicht im Rückblick).
4. *Was mache ich anders?* Ein konkreter Vorsatz, der als Lernziel ins nächste Jahr übernommen wird (feed forward).

**Schattenrechnung („Was wäre gewesen, wenn …?“):** Für ausgewählte Entscheidungen rechnet das Spiel die stärkste Alternative nach (z. B. 15 statt 10 Jahre Zinsbindung) und zeigt die Differenz mit dem Hinweis, ob diese Alternative **damals erkennbar besser** war. Ziel ist Lernen, nicht Selbstvorwürfe.

**Bewertung als Raster statt Einzelpunktzahl:** z. B. Liquiditätsvorsorge · Prüfung (Due Diligence) · Finanzierungsstruktur · Risikostreuung · Ertrag. Jeweils mit Begründung, kein Urteil über die Person (Feedback-Ebene Aufgabe/Prozess statt Person, [L8]).

**Reflexion über das Jahr verteilt** [L6]: kurze Ein-Frage-Impulse an natürlichen Stellen (nach dem Kauf, nach einer Krise), nie mehr als einer pro Spielsitzung.

## B9. Scheitern und Erholung

**Eskalation statt plötzlichem Ende:**
1. Frühwarnung: Prognose zeigt eine Liquiditätslücke in X Monaten, die Reserve unterschreitet die Schwelle (Status „beobachten“ → „kritisch“).
2. Handlungsoptionen mit Folgenvorschau: Kosten senken, Dispo/Kontokorrent (teuer), Bankgespräch (Stundung, Tilgungsaussetzung), Nachschuss aus dem Gehalt, Verkauf eines Objekts (Abschlag, Vorfälligkeitsentschädigung, Steuerfolgen).
3. Erst wenn alle Optionen erschöpft sind: Zwangsversteigerung bzw. Insolvenz als realistisches Ende **dieses Laufs**.

**Danach:**
- **Krisen-Analyse:** Zeitstrahl der Ursachen mit Verweisen auf konkrete Entscheidungen und das Tagebuch [L13] [L16].
- **Erholung je nach Modus:**
  - *Lernmodus:* „Zurück zum Entscheidungspunkt“ lädt automatisch erstellte Checkpoints vor großen Entscheidungen. Das unterstützt Wiederholung [L1] und produktives Scheitern [L5].
  - *Standard:* Neustart des Szenarios oder neuer Lauf. Mitgenommen werden Glossar-Fortschritt, Meilensteine und Debriefs, **kein Geld**.
  - *Ironman (optional, für Challenges):* ein Spielstand, kein Zurück [G6].
- Krisen gibt es auch als **gezielte Szenarien** (Zinsanstieg, Großschaden, Mietausfall), um Erholung zu üben.

## B10. Spielmodi

| Modus | Zweck | Merkmale |
|---|---|---|
| **Lernpfad (Kampagne)** | geführtes Lernen | Szenarien mit 1–2 Lernzielen, Modell-Progression, Musterlösungen, Debrief am Ende. Beispiele: „Die erste Wohnung“, „Sanierungsstau im Mehrfamilienhaus“, „Anschlussfinanzierung nach Zinsanstieg“, „Mieterhöhung rechtssicher“, „Skalieren mit Beleihungsreserven“, „Verkauf und Steuer“ |
| **Freies Spiel (Sandbox)** | eigenes Üben, Strategie | frei wählbarer Start (Profil, Region, Startjahr), Marktpfad historisch oder simuliert, alle Systeme, Hilfestufe frei |
| **Challenges** | kurze, gezielte Aufgaben (10–30 Min.) | feste Startbedingungen (Seed), klare Frage („Finde in 6 Monaten ein Objekt mit positivem Netto-Cashflow in Region X“), Vergleich mit einer **Musterlösung** statt mit anderen Spielern |
| **Historische Szenarien** | Realismus erleben | z. B. Zinsphasen 2021–2024 mit echten Datenreihen (Daten aus den Fachrecherchen) |

**Hilfestufe und Marktschwierigkeit sind getrennt einstellbar.** Die Hilfestufe regelt Hinweise, Stopps, Mentor und Checkpoints, die Marktschwierigkeit regelt Konjunktur, Zinsen und Schadenshäufigkeit. So bleibt das Rechenmodell immer realistisch.

## B11. Motivation und Fortschritt (ohne Manipulation)

Grundlage: Autonomie, Kompetenz und Eingebundenheit [M1]. Belohnungen informieren statt kontrollieren [M2]. Lernziele haben bei komplexen Aufgaben Vorrang [M6].

- **Ziele:** selbst gewählt, mit Vorlagen (z. B. „1.000 € Netto-Cashflow/Monat bis 2035“, „Nettovermögen 300.000 €“) **plus Lernziele** („3 vollständige Prüfungen durchführen“, „einen Stresstest bestehen“). Der Fortschritt zeigt Prognose und Bandbreite.
- **Meilensteine** mit Bezug zur Praxis: erste Vermietung, erste Anschlussfinanzierung, erstes Jahr mit positivem Netto-Cashflow, erste Krise überstanden. Jeder Meilenstein verlinkt das zugehörige Wissen.
- **Auszeichnungen (sparsam)** nur für Kompetenz und Sorgfalt (z. B. „Fünf Käufe mit bestandenem Zinsstresstest“), nicht für Wiederholung oder Spielzeit. Ruhig gestaltet und informativ [M3] [M4]. Auch „Lehrgeld“-Momente dürfen gewürdigt werden, um Scheitern zu normalisieren.
- **Statistiken:** Portfolio-Entwicklung, Entscheidungsqualität nach Raster, gelernte Konzepte. Jede Statistik beantwortet „Was folgt daraus?“ [M7].
- **Jahresbericht („Dein Investmentjahr 2027“):** Vermögens-Wasserfall, wichtigste Entscheidungen, Lernfortschritt, Ausblick auf die Fristen des nächsten Jahres und **eine** Reflexionsfrage. Optional als PDF oder Bild teilbar (Eingebundenheit), ohne Rangliste.
- **Eingebundenheit ohne Wettbewerbsdruck:** Teilen von Szenario-Ergebnissen und Debriefs, spätere Option für Lerngruppen [L2]. Ranglisten höchstens bei Challenges, **risikobereinigt** bewertet und optional.

## B12. Barrierefreiheit-Checkliste (Ziel: WCAG 2.2 AA + Game Accessibility Basics)

**Wahrnehmbar**
- [ ] Kontrast Text ≥ 4,5:1 (großer Text ≥ 3:1), UI-Elemente, Grafiken und Diagramme ≥ 3:1 (1.4.3, 1.4.11), in **Hell und Dunkel** geprüft
- [ ] Status, Risiko, Gewinn/Verlust **nie nur über Farbe**: immer Icon/Form + Text (1.4.1)
- [ ] Diagramme mit Titel, Textzusammenfassung der Kernaussage, Datentabelle und direkten Beschriftungen statt reiner Legenden; Muster bzw. Trennränder zwischen Flächen (Chartability) [A7]
- [ ] Umbruch bei 320 CSS-px ohne horizontales Scrollen der Seite (1.4.10); Text auf 200 % ohne Verlust (1.4.4); Textabstände anpassbar (1.4.12)
- [ ] Hover-/Fokus-Inhalte (Erklär-Karten, Glossar) schließbar (Esc), überfahrbar, beständig (1.4.13)
- [ ] Sprache `lang="de"`; Abkürzungen beim ersten Auftreten ausgeschrieben bzw. verlinkt
- [ ] Kompakte Zahlen („1,5 Mio. €“) mit ausgeschriebener Screenreader-Fassung; Vorzeichen und Einheiten werden vorgelesen (mit NVDA, JAWS, VoiceOver und TalkBack testen)

**Bedienbar**
- [ ] Alles per Tastatur bedienbar, keine Tastaturfallen (2.1.1, 2.1.2); sichtbarer Fokus (2.4.7)
- [ ] Fokus wird **nicht** von Zeitleiste, Tab-Leiste oder Bottom Sheets verdeckt (2.4.11), z. B. über `scroll-padding`
- [ ] Einzeltasten-Kürzel abschaltbar bzw. umbelegbar (2.1.4); Befehlspalette per Tastatur
- [ ] Dialoge, Tabs, Grids und Menüs nach den WAI-ARIA-APG-Mustern (Fokus hinein, Esc, Fokus zurück) [A6]
- [ ] Zielgröße ≥ 24×24 CSS-px (2.5.8); **Hausstandard 44×44 px** für Touch-Hauptaktionen
- [ ] Ziehen und Wischen immer mit Alternative: Regler mit Eingabefeld/Stepper, Wischaktionen auch als Knöpfe (2.5.7, 2.5.1)
- [ ] Keine Zeitlimits (2.2.1); Auto-Weiter und Animationen pausierbar (2.2.2)
- [ ] Bewegung: `prefers-reduced-motion` + eigener Schalter; kein Parallax, keine hochzählenden Zahlen bei reduzierter Bewegung (2.3.3, C39) [A5]
- [ ] Nichts blinkt mehr als 3-mal pro Sekunde (2.3.1)

**Verständlich**
- [ ] Konsistente Navigation und Benennung (3.2.3, 3.2.4); Hilfe/Mentor immer an derselben Stelle (3.2.6)
- [ ] Fehlermeldungen nennen die Lösung (3.3.1, 3.3.3); Bezeichnungen sichtbar, nicht nur Platzhalter (3.3.2)
- [ ] Bereits eingegebene Daten (Haushaltsrechnung, Profil) werden wiederverwendet (3.3.7)
- [ ] Teure, unumkehrbare Aktionen: Prüfschritt bzw. Bestätigung (3.3.4, sinngemäß)
- [ ] Anmeldung ohne kognitive Tests, Passwortmanager und Passkeys möglich (3.3.8)
- [ ] Einfache Sprache in Aussage-Ebenen, Fachsprache nur mit Glossar-Verknüpfung

**Robust**
- [ ] Semantisches HTML zuerst, ARIA nur wo nötig; Statusmeldungen (Monatswechsel, gespeichert) über Live-Regionen (4.1.2, 4.1.3)

**Spielspezifisch** [G7]
- [ ] Speichern jederzeit (Autosave nach jedem Monat), Hilfestufen, getrennt einstellbare Marktschwierigkeit
- [ ] Einstellbare Informationsdichte (kompakt/komfortabel) und Schriftgröße innerhalb der App
- [ ] Keine Information nur über Ton; Ton optional und getrennt regelbar
- [ ] Usability-Tests auch mit Menschen mit Behinderungen (Screenreader, Sehschwäche, motorische Einschränkungen, Konzentrationsschwierigkeiten)

**Design-System (technisch)**
- [ ] Tokens im DTCG-Format 2025.10: Primitive (`color.blue.600`) → Semantik (`color.text.default`, `color.status.critical.icon`) → Komponenten; Themes Hell, Dunkel und hoher Kontrast über Resolver bzw. Modi [A8]
- [ ] Dark Mode folgt `prefers-color-scheme`, mit manuellem Umschalter, eigens abgestimmt (keine reine Invertierung) [U8]
- [ ] Typo-Tokens mit `tnum` für Zahlenkontexte; Bewegungs-Tokens (Dauer, Easing) mit „reduziert“-Variante

## B13. Anti-Patterns, die wir vermeiden

1. **Textwand-Tutorials** und Ketten von Tutorial-Modals; Pflichtlektüre vor dem ersten Klick [G5].
2. **Echtzeit- oder Timerdruck** für Finanzentscheidungen; automatisch weiterlaufende Zeit ohne Pause [G4] [A4].
3. **Posteingang-Spam:** jede Routinebuchung als Nachricht, Badges für Unwichtiges [U7].
4. **Black-Box-Ergebnisse:** Kennzahlen oder Bewertungen ohne Herleitung; Punktzahlen ohne Begründung.
5. **Scheingenauigkeit:** Renditen mit zwei Nachkommastellen ohne Bandbreite; verborgene Annahmen; nicht gekennzeichnete Vereinfachungen.
6. **Farbe als einziges Signal**; Rot/Grün ohne Icon und Text; „grün“ für eine Zahl, die steigt, aber schlecht ist [A2].
7. **Nur-Hover-Informationen** (mobil und per Tastatur unerreichbar), Tooltips mit unverzichtbaren Informationen [U4] [A3].
8. **Gestapelte Bottom Sheets** oder Modal auf Modal [U2].
9. **Ja/Nein-Dialoge** und Bestätigungen für Routine; fehlendes Rückgängig [U6].
10. **Nur-Regler-Eingaben** und `type="number"` für Geldbeträge [U14].
11. **Gauges/Tachos und Deko-Diagramme**; Dashboards, die nicht auf einen Bildschirm passen [U11].
12. **Clippy-Mentor:** ungefragte, häufige Unterbrechungen; Mentor, der Entscheidungen abnimmt [L17].
13. **Plötzliches Game Over** ohne Frühwarnung und Handlungsoptionen; unfaire, nicht vorhersehbare Schocks [G3] [L16].
14. **Rückblick-Urteile im Debrief:** Entscheidungen nur nach dem Ergebnis bewerten statt nach dem damaligen Informationsstand.
15. **Grind und Manipulation:** tägliche Serien, Login-Boni, künstliche Wartezeiten, FOMO-Countdowns, Push-Köder, Lootboxen, Bezahlen für Beschleunigung [M5] [M8].
16. **Ranglisten nach reinem Vermögen:** belohnen maximalen Hebel und Glück, also das Gegenteil des Lernziels.
17. **Realismus-Lücken, die Falsches lehren:** Sofortkauf ohne Finanzierungszusage, Notar oder Fristen; Mieterhöhung ohne rechtliche Grenzen. Wo vereinfacht wird, steht das dran.
18. **Unvorhersehbare Navigation:** Bereiche, die je nach Fortschritt auftauchen und verschwinden; wechselnde Platzierung von „Weiter“ und Hilfe.
19. **Mobile Tabellen ohne Hinweis** auf weitere Spalten; abgeschnittene Zahlen [U5].
20. **Dark Mode als reine Invertierung** oder als erzwungene Voreinstellung [U8].

## B14. Offene Fragen und nächste Schritte

1. **Prototyp der Monatsschleife** (Posteingang → Entscheidung → Weiter → Monatsbericht) als klickbares Modell; Test mit 5–8 Personen aus der Zielgruppe (Einsteiger und Erfahrene getrennt).
2. **Stopp-Regeln kalibrieren:** Wie viele Stopps pro Spieljahr empfinden Einsteiger bzw. Profis als angenehm? Lässt sich per Telemetrie messen (opt-in).
3. **Lernwirkung messen:** Vorher-nachher-Wissenscheck in Szenarien; Vergleich mit und ohne Debrief, um die Wirkung der Debriefs zu prüfen (die Evidenz dazu ist dünn [L7]).
4. **Zahlen und Screenreader:** U+2212 gegen U+002D, „Mio.“, „Pp.“, Bandbreiten mit Gedankenstrich; testen mit NVDA, JAWS, VoiceOver und TalkBack.
5. **BFSG-Anwendbarkeit** juristisch klären (A5); unabhängig davon WCAG 2.2 AA anstreben.
6. **Quellen prüfen,** die nur über Suchauszüge gelesen werden konnten (FM-, Paradox- und Game-Developer-Artikel, DIN-5008-Detail zur Betragsgliederung, NN/g-Volltexte).
7. **Mobile App später:** Die Informationsarchitektur ist bereits für kompakte Fenster entworfen. Bei einer nativen Umsetzung gelten dieselben Muster plus Plattformkonventionen (Zurück-Geste, Tab-Leiste/Sidebar-adaptiv auf dem iPad) [U18].

---

## Quellenverzeichnis

### Lernforschung und Simulationen
- **[L1]** Sitzmann (2011), Meta-Analyse Simulationsspiele – Zusammenfassungen: https://pmc.ncbi.nlm.nih.gov/articles/PMC4748544 · https://business-news.ucdenver.edu/2010/10/20/business-school-professors-study-finds-video-games-highly-effective-training-tool
- **[L2]** Wouters, van Nimwegen, van Oostendorp & van der Spek (2013): https://research-portal.uu.nl/en/publications/a-meta-analysis-of-the-cognitive-and-motivational-effects-of-seri/ · https://www.e-teaching.org/materialien/literatur/wouters-van-nimwegen-van-ooostendorp-van-der-spek-2013
- **[L3]** Clark, Tanner-Smith & Killingsworth (2016): https://sri.com/publication/digital-games-design-and-learning-a-systematic-review-and-meta-analysis-brief · https://joanganzcooneycenter.org/?p=16779
- **[L4]** Kirschner, Sweller & Clark (2006): https://research.ou.nl/en/publications/why-minimal-guidance-during-instruction-does-not-work-an-analysis/
- **[L5]** Kapur, Productive Failure: https://www.unh.edu/teaching-learning-resource-hub/sites/default/files/media/2023-06/itow-productive-failure-kapor.pdf · https://edutopia.org/article/if-youre-not-failing-youre-not-learning
- **[L6]** Crookall, Debriefing: https://econpapers.repec.org/RePEc:sae:simgam:v:41:y:2010:i:6:p:898-920 · https://ideas.repec.org/a/sae/simgam/v45y2014i4-5p416-427.html · https://meetingorganizer.copernicus.org/EGU24/EGU24-2605.html
- **[L7]** Feinberg (2003), Debriefing in Ökonomie-Simulationen: https://getd.libs.uga.edu/pdfs/feinberg_joseph_r_200308_phd.pdf
- **[L8]** Hattie & Timperley (2007), The Power of Feedback: https://www.uky.edu/~gmswan3/575/Hattie_Timperly_2007.pdf
- **[L9]** After Action Review: https://ascd.org/blogs/how-a-military-feedback-model-could-foster-instructional-change · https://knowledge.wharton.upenn.edu/article/action-reviews-simple-yet-powerful-tool/
- **[L10]** Alessi (1988), Fidelity: https://learntechlib.org/p/170285 · https://ntrs.nasa.gov/citations/20020074981
- **[L11]** de Jong & van Joolingen, Discovery Learning mit Simulationen: https://cir.nii.ac.jp/crid/1362825895302716928 · https://link.springer.com/article/10.1007/s11251-012-9220-y
- **[L12]** Renkl, Worked Examples/Fading: https://asu.elsevierpure.com/en/publications/structuring-the-transition-from-example-study-to-problem-solving--2 · https://en.wikipedia.org/wiki/Worked-example_effect
- **[L13]** Sterman (1989), Misperceptions of Feedback: https://econpapers.repec.org/RePEc:inm:ormnsc:v:35:y:1989:i:3:p:321-339 · https://link.springer.com/chapter/10.1007/978-3-642-74946-9_3
- **[L14]** Schroeder, Adesope & Gilbert (2013), Pädagogische Agenten: https://rex.libraries.wsu.edu/esploro/outputs/journalArticle/How-Effective-are-Pedagogical-Agents-for/99900601056901842
- **[L15]** Finanzbildungsspiele: https://cris.maastrichtuniversity.nl/en/publications/the-impact-of-an-online-game-based-financial-education-course-mul/ · https://clear.dol.gov/Study/Can-games-build-financial-capability-Financial-entertainment-research-overview-Maynard-et-al · https://wiwi.uni-konstanz.de/en/schumann/research/research-projects/current-projects/game-based-learning-and-financial-literacy
- **[L16]** Juul, The Art of Failure: https://jesperjuul.net/artoffailure/about.html
- **[L17]** Horvitz, Mixed-Initiative UI: https://www.microsoft.com/en-us/research/publication/principles-mixed-initiative/ · Proaktive Hilfe als Bedrohung: https://arxiv.org/html/2509.09309v1

### Spieldesign (nur Muster-Referenzen)
- **[G1]** Football Manager – Handbuch Posteingang und Bedienung: https://community.sports-interactive.com/sigames-manual/football-manager-2024/inbox-and-news-r4956 · https://community.sports-interactive.com/sigames-manual/football-manager-2024/introduction-to-football-manager%E2%84%A2-2024-r4952 · UI-Neugestaltung: https://footballmanager.com/fm26/features/fm26s-reimagined-user-interface · https://www.footballmanager.com/fm27/features/deeper-more-immersive-world · https://fmprojects.substack.com/p/speed-up-football-manager (Seiten nicht direkt abrufbar, prüfen)
- **[G2]** Paradox – Victoria 3 Dev Diary #29 (UX), #74: https://admin-forum.paradoxplaza.com/forum/developer-diary/victoria-3-dev-diary-29-user-experience.1506484 · https://www.paradoxinteractive.com/games/victoria-3/news/dev-diary-74-ux-improvements · https://pcgamer.com/the-crusader-kings-3-team-is-working-hard-to-make-the-game-easier-to-learn (prüfen)
- **[G3]** Into the Breach – Klarheit und Telegraphing: https://gamedeveloper.com/design/-i-into-the-breach-i-dev-on-ui-design-sacrifice-cool-ideas-for-the-sake-of-clarity-every-time- · https://kotaku.com/into-the-breach-the-kotaku-review-1823365331
- **[G4]** Rundenbasiert vs. Echtzeit: https://www.gamedeveloper.com/game-platforms/analysis-turn-based-versus-real-time · https://gamedeveloper.com/design/turn-based-vs-real-time
- **[G5]** Tutorials: https://www.smashingmagazine.com/2014/04/rethinking-mobile-tutorials-which-patterns-really-work/ · https://gdevelop.io/blog/improve-game-tutorials
- **[G6]** Ironman/Neuladen: https://popmatters.com/165288-2495798406.html · https://gamedeveloper.com/design/alternatives-to-the-game-over-screen · https://www.gamedeveloper.com/game-platforms/opinion-quicksaves-versus-sense-of-urgency
- **[G7]** Game Accessibility Guidelines: https://gameaccessibilityguidelines.com/

### UX, Daten, Navigation
- **[U1]** Progressive Disclosure: https://www.nngroup.com/videos/progressive-disclosure/ · https://ixdf.org/encyclopedia/progressive_disclosure.html
- **[U2]** NN/g Bottom Sheets: https://www.nngroup.com/articles/bottom-sheet/
- **[U3]** NN/g Comparison Tables: https://nngroup.com/articles/comparison-tables/
- **[U4]** NN/g Tooltip Guidelines: https://nngroup.com/articles/tooltip-guidelines · Mobil: https://smashingmagazine.com/2021/02/designing-tooltips-mobile-user-interfaces · https://primer.style/accessibility/tooltips/
- **[U5]** NN/g Data Tables / Mobile Tables: https://nngroup.com/articles/data-tables · https://www.nngroup.com/articles/mobile-tables/
- **[U6]** Bestätigung und Rückgängig: https://www.nngroup.com/articles/confirmation-dialog/ · https://alistapart.com/article/neveruseawarning · https://www.smashingmagazine.com/2024/09/how-manage-dangerous-actions-user-interfaces
- **[U7]** Indikatoren und Benachrichtigungen: https://nngroup.com/articles/indicators-validations-notifications · https://smashingmagazine.com/2025/07/design-guidelines-better-notifications-ux/
- **[U8]** NN/g Dark Mode: https://www.nngroup.com/articles/dark-mode/
- **[U9]** Wasserfall-Diagramme: https://www.datawrapper.de/blog/waterfall-charts-guide · https://corporatefinanceinstitute.com/resources/excel/study-guide/waterfall-chart/
- **[U10]** Tornado-Diagramm: https://en.wikipedia.org/wiki/Tornado_diagram · https://pubsonline.informs.org/doi/fpi/10.1287/inte.22.6.40
- **[U11]** Stephen Few, Dashboards/Bullet Graph: https://blogs.ischool.berkeley.edu/i247s13/files/2013/02/WhyMostDashboardsFail.pdf · https://www.telerik.com/docs/default-source/blogs-docs/bullet_graph_design_spec-pdf
- **[U12]** Tabellenziffern: https://developer.mozilla.org/docs/Web/CSS/font-variant-numeric · https://design.alberta.ca/examples/display-numbers-in-a-table-so-they-can-be-scanned-easily
- **[U13]** Zahlenformat: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat · https://www.w3.org/International/questions/qa-number-format · https://www.haufe-akademie.de/blog/themen/assistenz-und-office-management/din-5008/ · https://dewiki.de/Lexikon/%25
- **[U14]** Zahleneingabe und Locale: https://slightfuture.com/webdev/html5-input-number-localization · https://developer.apple.com/forums/thread/818268
- **[U15]** Fintech-UX (Praxis): https://www.mindtheproduct.com/ux-that-builds-trust-what-top-fintechs-get-right/ · https://phenomenonstudio.com/article/fintech-ux-design-patterns-that-build-trust-and-credibility/
- **[U16]** Gradual Engagement: https://articles.centercentre.com/?p=223 · https://appcues.com/blog/gradual-engagement-mobile-app-first-screen
- **[U17]** Material 3 / Android adaptive Layouts: https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts · https://developer.android.com/design/ui/mobile/guides/layout-and-content/layout-and-nav-patterns · https://www.sap.com/design-system/fiori-design-android/v26-4/components/m3-standard-components/navigation-rail/usage · https://9to5google.com/2025/05/14/material-3-expressive-navigation/
- **[U18]** Apple HIG: https://developer.apple.com/design/human-interface-guidelines/tab-bars · https://developer.apple.com/design/human-interface-guidelines/sidebars · https://www.sap.com/design-system/fiori-design-ios/v25-4/components/navigation-and-search/tab-bar/usage
- **[U19]** Daumenzone: https://uxmatters.com/mt/archives/2013/02/how-do-users-really-hold-mobile-devices.php · https://smashingmagazine.com/2020/02/design-mobile-apps-one-hand-usage/

### Barrierefreiheit und Design-System
- **[A1]** WCAG 2.2 – Neuerungen: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- **[A2]** 1.4.1 Use of Color / 1.4.11 Non-text Contrast: https://w3.org/WAI/WCAG22/Understanding/use-of-color.html · https://w3.org/WAI/WCAG22/Understanding/non-text-contrast
- **[A3]** 1.4.13 Content on Hover or Focus: https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus
- **[A4]** 2.2.1 Timing Adjustable / 2.2.2 Pause, Stop, Hide: https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html · https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide
- **[A5]** Bewegung reduzieren: https://w3c.github.io/wcag/understanding/animation-from-interactions · https://w3c.github.io/wcag/techniques/css/C39 · https://web.dev/learn/accessibility/motion
- **[A6]** WAI-ARIA APG: https://www.w3.org/WAI/ARIA/apg/patterns/dialogmodal/ · https://www.w3.org/WAI/ARIA/apg/patterns/grid
- **[A7]** Barrierefreie Diagramme: https://dig.cmu.edu/publications/2022-chartability.html · https://accessibility.blog.gov.uk/2023/04/13/text-descriptions-for-data-visualisations/
- **[A8]** Design Tokens (DTCG 2025.10): https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/ · https://www.designtokens.org/tr/2025.10/
- **[A9]** BFSG/BFSGV: https://www.gesetze-im-internet.de/bfsg/__1.html · https://www.gesetze-im-internet.de/bfsgv/BJNR092800022.html

### Motivation
- **[M1]** Ryan, Rigby & Przybylski (2006), SDT und Spiele: https://www.rochester.edu/warner/lida/wp-content/uploads/2022/11/02bfe513dd59366750000000.pdf · https://selfdeterminationtheory.org/player-experience-of-needs-satisfaction-pens/
- **[M2]** Deci, Koestner & Ryan (1999): https://pubmed.ncbi.nlm.nih.gov/10589297/
- **[M3]** Sailer & Homner (2020): https://link.springer.com/article/10.1007/s10648-019-09498-w
- **[M4]** Hamari (2017), Badges: https://research.utu.fi/converis/portal/detail/Publication/27336812?lang=en_US
- **[M5]** Zagal, Björk & Lewis (2013): https://research.chalmers.se/en/publication/177148 · Kritik Deterding et al. (2020): https://eprints.whiterose.ac.uk/156460/1/DiGRA_2020_paper_189.pdf
- **[M6]** Locke & Latham, Zielsetzung: https://home.ubalt.edu/tmitch/642/Articles%20syllabus/locke%20latham%20new%20dir%20GS%20curr%20dir%20psy%20sci%202006.pdf
- **[M7]** Li, Dey & Forlizzi (2010), Personal Informatics: https://courses.cs.washington.edu/courses/cse440/15au/readings/PersonalInformatics-Li2010.pdf
- **[M8]** Kritik an Streaks: https://yukaichou.com/gamification-analysis/streak-design-gamification-motivation-burnout/ · https://uxmag.com/articles/gamification-or-manipulation-understanding-the-ethics-of-engagement-loops
