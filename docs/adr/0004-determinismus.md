# ADR 0004 – Determinismus: detmath, zählerbasierter PRNG, Lint-Verbote, Hash-Test

**Status:** angenommen (Verbote Z0, detmath + PRNG Z1; Hash-Test Z2) · `04-…` §3.2

- Im Kern nur `+ − × ÷`, `Math.sqrt/floor/round/imul`; `detmath` (`powInt`, `expDet`, `lnDet`) mit fester Termzahl.
- PRNG zählerbasiert: `rand(seed, domain, monthIndex, entityId, k)` (SplitMix-Hash).
- Verbote in `sim-core` (geprüft durch `tools/check-sim-core.mjs` in `pnpm lint`): `Math.random/pow/exp/log`, `**`,
  `Date`, `crypto`, DOM/I/O.
- Golden-Hash-Test über 480 Monate in Node und Browsern (ab Z2).
