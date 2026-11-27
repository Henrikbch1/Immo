# ADR 0002 – Monorepo: pnpm-Workspace, Catalogs, Paketgrenzen

**Status:** angenommen (Z0) · `04-…` §2

## Entscheidung
- pnpm-Workspace (`apps/*`, `packages/*`), alle Versionen zentral im `catalog:` (`pnpm-workspace.yaml`).
- **pnpm 10.28** statt Plan „pnpm 11“: in der Umgebung vorinstalliert, Catalogs voll unterstützt (aktuell wäre 12.x). Upgrade per ADR.
- **Turborepo noch nicht** (Z0 „erst wenn nötig“): `pnpm -r` und ein Vitest-Projektlauf reichen bei vier Paketen.
- Pakete in Z0: `config`, `sim-core`, `ui`, `apps/web`. Weitere (`data`, `geo`, `storage`, `charts`, `content`, `sim-worker`) bei Bedarf.

## Paketgrenzen
- `sim-core` importiert nichts außer (später) Typen aus `data`; geprüft vorerst durch `tools/check-sim-core.mjs`
  (Verbote) – dependency-cruiser folgt, sobald es mehr als zwei Laufzeitpakete gibt.
- `ui` kennt `sim-core` nicht. `apps/web` darf alles.
