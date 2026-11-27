/**
 * Determinismus-Prüfsumme (ADR 0004, 04 §3.2): SHA-256 über eine kanonische Serialisierung.
 * Reines TypeScript (kein `crypto`), damit Node und alle Browser bitgleich rechnen.
 */

const K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98,
  0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
  0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8,
  0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819,
  0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
  0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7,
  0xc67178f2,
];

/** UTF-8-Kodierung ohne TextEncoder (gleiches Ergebnis überall). */
export function utf8(s: string): number[] {
  const out: number[] = [];
  for (let i = 0; i < s.length; i++) {
    let c = s.charCodeAt(i);
    if (c >= 0xd800 && c <= 0xdbff && i + 1 < s.length) {
      const d = s.charCodeAt(i + 1);
      if (d >= 0xdc00 && d <= 0xdfff) {
        c = 0x10000 + ((c - 0xd800) << 10) + (d - 0xdc00);
        i++;
      }
    }
    if (c < 0x80) out.push(c);
    else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 63));
    else if (c < 0x10000) out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    else out.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
  }
  return out;
}

const rotr = (x: number, n: number) => (x >>> n) | (x << (32 - n));

/** SHA-256 eines Strings (UTF-8) als Hex. */
export function sha256(text: string): string {
  const bytes = utf8(text);
  const bitLaenge = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  const hoch = Math.floor(bitLaenge / 4294967296);
  const tief = bitLaenge >>> 0;
  bytes.push((hoch >>> 24) & 255, (hoch >>> 16) & 255, (hoch >>> 8) & 255, hoch & 255);
  bytes.push((tief >>> 24) & 255, (tief >>> 16) & 255, (tief >>> 8) & 255, tief & 255);

  const h = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  const w = new Array<number>(64).fill(0);
  for (let off = 0; off < bytes.length; off += 64) {
    for (let i = 0; i < 16; i++) {
      const j = off + i * 4;
      w[i] =
        (((bytes[j] ?? 0) << 24) |
          ((bytes[j + 1] ?? 0) << 16) |
          ((bytes[j + 2] ?? 0) << 8) |
          (bytes[j + 3] ?? 0)) >>>
        0;
    }
    for (let i = 16; i < 64; i++) {
      const w15 = w[i - 15] ?? 0;
      const w2 = w[i - 2] ?? 0;
      const s0 = rotr(w15, 7) ^ rotr(w15, 18) ^ (w15 >>> 3);
      const s1 = rotr(w2, 17) ^ rotr(w2, 19) ^ (w2 >>> 10);
      w[i] = ((w[i - 16] ?? 0) + s0 + (w[i - 7] ?? 0) + s1) >>> 0;
    }
    let [a, b, c, d, e, f, g, hh] = h as [number, number, number, number, number, number, number, number];
    for (let i = 0; i < 64; i++) {
      const s1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const t1 = (hh + s1 + ch + (K[i] ?? 0) + (w[i] ?? 0)) >>> 0;
      const s0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (s0 + maj) >>> 0;
      hh = g;
      g = f;
      f = e;
      e = (d + t1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) >>> 0;
    }
    const neu = [a, b, c, d, e, f, g, hh];
    for (let i = 0; i < 8; i++) h[i] = ((h[i] ?? 0) + (neu[i] ?? 0)) >>> 0;
  }
  return h.map((x) => x.toString(16).padStart(8, '0')).join('');
}

/**
 * Kanonische Serialisierung: Objekt-Schlüssel sortiert, `undefined` weggelassen, Zahlen nach
 * ECMAScript-Number::toString (in allen Engines identisch). NaN/Infinity sind verboten.
 */
export function kanonisch(wert: unknown): string {
  if (wert === null) return 'null';
  switch (typeof wert) {
    case 'number':
      if (!Number.isFinite(wert)) throw new RangeError(`Nicht serialisierbare Zahl: ${wert}`);
      return Object.is(wert, -0) ? '0' : String(wert);
    case 'string':
      return JSON.stringify(wert);
    case 'boolean':
      return wert ? 'true' : 'false';
    case 'object': {
      if (Array.isArray(wert))
        return `[${wert.map((x) => (x === undefined ? 'null' : kanonisch(x))).join(',')}]`;
      const o = wert as Record<string, unknown>;
      const teile: string[] = [];
      for (const k of Object.keys(o).sort()) {
        if (o[k] === undefined) continue;
        teile.push(`${JSON.stringify(k)}:${kanonisch(o[k])}`);
      }
      return `{${teile.join(',')}}`;
    }
    default:
      throw new TypeError(`Nicht serialisierbarer Typ: ${typeof wert}`);
  }
}

/** Prüfsumme eines Zustands oder Ergebnisses (SHA-256, hex). */
export function pruefsumme(wert: unknown): string {
  return sha256(kanonisch(wert));
}
