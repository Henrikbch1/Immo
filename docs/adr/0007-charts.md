# ADR 0007 – Charts: Apache ECharts 6 mit Tabellen-Fallback

**Status:** Entwurf (erster Einsatz Z1 Darlehensrechner) · `04-…` §1

- Eine Engine für Zeitreihe, Wasserfall, Sankey, Heatmap, Choropleth; lazy geladen (Budget 250 KB Shell).
- Jedes Diagramm mit Tabellen-Alternative und Textzusammenfassung (A11y). Vor jedem Chart Skill `dataviz` lesen.
- Falls ein Sprint nur ein einfaches Diagramm braucht, ist schlankes SVG erlaubt (Bundle-Budget).
