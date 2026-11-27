# ADR 0006 – UI-Kit: Tailwind 4 + Design-Tokens, shadcn/ui auf Base UI

**Status:** angenommen (Tokens Z0), shadcn/Base-UI-Komponenten ab dem ersten Bedarf · `03-…` §4

- Tokens: semantische CSS-Variablen je Thema (`data-theme="hell|dunkel|kontrast"`), über Tailwind `@theme` als Utilities.
  Quelle der Werte: `03-…` §4.1 (Kontraste dort gerechnet).
- Komponenten verwenden nur semantische Tokens; shadcn-Bausteine werden über Tokens gestylt, nicht geforkt.
- Schrift: Systemschrift als Rückfall; Inter Variable (OFL) wird selbst gehostet, sobald die Lizenzfrage (03 §8 Nr. 1) bestätigt ist.
