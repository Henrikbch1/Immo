# Rückfragen an dich (Stand 27.11.2026)

Alles unten blockiert nichts Akutes; ich arbeite mit dem genannten Standard weiter, bis du antwortest. Kurz mit Nummer antworten reicht (z. B. „Q2 ja, Q4 B“).

| # | Frage | Mein Standard | Dringlichkeit |
|---|---|---|---|
| Q1 | **Soll ich 02 und 03 jetzt auf Widersprüche zu 00/01/04/06 querlesen?** (Teil des alten Übergabe-Auftrags, bisher nicht gemacht; kostet ca. 1 Sonnet-Subagent) | ja, als nächster Schritt | vor Freigabe |
| Q2 | **Dein Wohn-/Zielort** als zusätzliche Referenzregion (und ob Start „Mein echtes Profil“ dort sofort laufen soll)? | nur die 23 Regionen aus `09` §6 | vor P2 |
| Q3 | **Webzugriff auf amtliche Seiten:** In dieser Sitzung waren gesetze-im-internet.de, bundesbank.de, ecb.europa.eu, haufe.de u. a. gesperrt. Kannst du die Hosts in der Umgebung freischalten (Netzwerk-Allowlist)? Sonst bleiben alle Zahlen in `09` unbelegt. | bleiben GESCHÄTZT | vor Strang W |
| Q4 | **Referenzregionen** in `09` §6: Passt die Auswahl (23)? Fehlt etwas Wichtiges (z. B. Lüneburg, Oldenburger Münsterland, Kreis Heinsberg), oder soll etwas raus? | wie vorgeschlagen | vor P2 |
| Q5 | **Historische Szenarien** H1–H4: noch ein fünftes (z. B. „Boom 2015–2021“ oder „Ruhrgebiet-Strukturwandel“) für die Fokusländer? | nein | vor P6 |
| Q6 | **Mietrecht II / CO₂-Korridor 2027:** Ich führe sie als „zukünftig, mit Wahrscheinlichkeit“, nicht als geltendes Recht (Beschluss nicht belegt). Einverstanden? | ja | P4 |
| Q7 | **Anrede „du“ (O7), Hosting Cloudflare (O11), UI-Kit shadcn (O1):** Empfehlungen aus `08` einfach freigeben? | ja, wie empfohlen | P0 |
| Q8 | **Wann willst du die Freigabe des Masterplans** und P0 starten? Danach ginge es mit Code los. | nach Q1 | – |

Nicht gefragt, aber von dir bei Gelegenheit zu klären (spätere Phasen): O13 Monetarisierung, O14 Lizenzen, O18 Mobile-Konten, O19 Spielname.

## Nachtrag nach Querlesen (27.11.)

| # | Frage | Mein Standard |
|---|---|---|
| Q9 | Standardregion für Persona „Einsteiger 2026“ und Tests: **Stadt Bremen** (statt bisher Leipzig)? | ja |
| Q10 | Lernstufen (5 Stufen in 03) und Lernpfad-Kapitel (10 in 01) sind nicht deckungsgleich. Soll ich die Zuordnung vorschlagen (Steuern bekommt ein eigenes Kapitel)? | ja, Vorschlag in der Plan-Konsolidierung |
| Q11 | Plan-Konsolidierung (Querlese-Beschlüsse in 02/03/06 einarbeiten) jetzt machen oder erst nach deiner Durchsicht? | jetzt |

Die Sachentscheidungen O-1…O-19 des Querlesens stehen in `plan/10-…` §5 – bei Widerspruch bitte melden.

## Nachtrag Primärprüfung (27.11.)

| # | Frage | Standard |
|---|---|---|
| Q12 | Für die Primärprüfung NDS/Bremen fehlen noch Hosts: `www.mw.niedersachsen.de`, `www.verkuendung-niedersachsen.de`, `www.voris.niedersachsen.de`, `www.bremen.de`, `www.rathaus.bremen.de`, `www.transparenz.bremen.de`. Freischalten (ich schlage es per Umgebungs-Änderung vor, du bestätigst im Dialog)? | ja, beim nächsten Batch |

## Nachtrag Umsetzung/Demo (27.11.)

| # | Frage | Standard |
|---|---|---|
| **Q13** | **Vor Z0:** GitHub Pages aktivieren (*Settings → Pages → Source: GitHub Actions*). Deploy-Weg: **A** Sprint-Branch → PR nach `main` → Merge (Pages deployt von `main`) oder **B** Branch `claude/compassionate-hypatia-ty5f91` in *Settings → Environments → github-pages* als Deploy-Branch erlauben? | A |
| **Q14** | Ist das Repo öffentlich oder privat? Bei **privat** braucht Pages einen bezahlten GitHub-Plan, und die Seite ist trotzdem öffentlich im Web. Dürfen aggregierte Vault-/Datenpaket-Inhalte (Regeln, Kennzahlen mit Quelle) in die öffentliche Demo? | ja, nur aggregierte Daten mit Quellenvermerk; „Mein echtes Profil“ bleibt lokal |
| Q15 | Zielzeitpunkt/Tempo: ein Sprint pro 5-h-Fenster, also grob 1–2 Sprints pro Tag. Reihenfolge Z0→Z21 so recht (Meilenstein „Erste Wohnung“ = Z8)? | ja |
