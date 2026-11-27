# ADR 0003 – Geld als Integer-Cent, Zinsen in Basispunkten, Rundungsstellen

**Status:** Entwurf (Umsetzung Z1) · `04-…` §3.1

- Geld: `Cents` (gebrandeter `number`, `Number.isSafeInteger`). Zinssätze: Basispunkte (Integer).
- Zwischenrechnungen dürfen Float sein; gerundet wird nur an Buchungsstellen mit benannten Regeln
  (`roundHalfAwayFromZero`, `floorToEuro` …).
- Formatierung ausschließlich in `@immo/ui` (de-DE, geschütztes Leerzeichen vor Einheit).
