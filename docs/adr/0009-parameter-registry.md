# ADR 0009 – Parameter-Registry und rulesVersion

**Status:** Entwurf (Umsetzung Z1) · `04-…` §3.4

- Registry-Eintrag: `id, wert, einheit, status, quelle_id, stand, gueltig_ab, gueltig_bis, regional_schluessel?`.
- `rulesVersion` je Steuer-/Rechtsjahr (z. B. `de-2026.2`); historische Szenarien laden den passenden Stand.
- Keine Fachzahl als Literal im Kern (Review-Check; Lint folgt).
