# ADR 0010 – Hosting und Datenschutz

**Status:** angenommen (Z0) · E9 (`11-…` §2), O11

- **Demo je Sprint:** GitHub Pages, `https://henrikbch1.github.io/Immo/`, Workflow `.github/workflows/pages.yml`
  (verify → build → deploy). Deployt bei Push auf `main` und `claude/*`; welche Branches dürfen, regelt das Environment
  `github-pages`. Damit muss nicht jeder Sprint erst nach `main` gemergt werden.
- **Release (P8):** Cloudflare Workers Static Assets (PR-Previews, Header) – Entscheidung bleibt bestehen.
- **Datenschutz:** Spielstände nur lokal (IndexedDB), keine Telemetrie, keine Konten bis P8.
