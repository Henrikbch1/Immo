/**
 * Zählerbasierter Zufall (ADR 0004): rand(seed, domain, monat, entitaet, k) ist eine reine Hash-Funktion.
 * Neue Ereignistypen verschieben dadurch keine anderen Zufallsfolgen.
 */
export type ZufallsDomaene =
  | 'macro'
  | 'region'
  | 'offers'
  | 'tenants'
  | 'building'
  | 'events'
  | 'negotiation'
  | 'test';

const ZWEI_HOCH_32 = 4294967296;

/** Finalizer aus MurmurHash3 (32 Bit). */
function fmix32(h0: number): number {
  let h = h0 >>> 0;
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

/** FNV-1a über einen String (für Domänen- und Entitätsnamen). */
export function hashString(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function mische(h: number, wert: number): number {
  return fmix32((h ^ (wert >>> 0)) + 0x9e3779b9);
}

/** Gleichverteilte Zahl in [0, 1) mit 53 Bit Auflösung. */
export function rand(
  seed: number,
  domain: ZufallsDomaene,
  monat: number,
  entitaet: number | string,
  k = 0,
): number {
  const ent = typeof entitaet === 'string' ? hashString(entitaet) : entitaet;
  let h = fmix32(seed);
  h = mische(h, hashString(domain));
  h = mische(h, monat);
  h = mische(h, ent);
  h = mische(h, k);
  const hoch = h >>> 11; // 21 Bit
  const tief = mische(h, 0x5bd1e995); // 32 Bit
  return (hoch * ZWEI_HOCH_32 + tief) / (2097152 * ZWEI_HOCH_32);
}

/** Ganze Zahl in [min, max] (beide inklusive). */
export function randInt(
  seed: number,
  domain: ZufallsDomaene,
  monat: number,
  entitaet: number | string,
  min: number,
  max: number,
  k = 0,
): number {
  return min + Math.floor(rand(seed, domain, monat, entitaet, k) * (max - min + 1));
}
