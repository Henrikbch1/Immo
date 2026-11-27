# ADR 0008 – Daten: IC-Export-Snapshot, Datenvertrag, Status-Flags

**Status:** Entwurf (Umsetzung Z3) · `05-daten-und-wissen.md` §3

- Das Spiel liest nur einen versionierten Export aus dem IC-Vault (`tools/export-spiel.mjs` im IC-Repo), nie den Vault direkt.
- Jeder Wert trägt Status (BELEGT/ABGELEITET/GESCHÄTZT/DESIGN), Quelle und Stand. Fehlende Werte → Schätzkaskade, sichtbar.
- Öffentliche Demo: nur aggregierte, lizenzkonforme Daten mit Quellenvermerk (Q14).
