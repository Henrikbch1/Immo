/**
 * Deterministische Mathematik (ADR 0004): nur + − × ÷ und feste Termzahlen, damit Ergebnisse in allen
 * JavaScript-Engines bitgleich sind. Ersatz für Math.pow/exp/log im Kern.
 */
const LN2 = 0.6931471805599453;
const TAYLOR_TERME = 24;
const ATANH_TERME = 40;

/** x hoch n für ganzzahliges n (Quadrieren und Multiplizieren). */
export function powInt(x: number, n: number): number {
  if (!Number.isInteger(n)) throw new RangeError(`powInt braucht ganzzahligen Exponenten: ${n}`);
  if (n < 0) return 1 / powInt(x, -n);
  let ergebnis = 1;
  let basis = x;
  let e = n;
  while (e > 0) {
    if (e % 2 === 1) ergebnis *= basis;
    basis *= basis;
    e = Math.floor(e / 2);
  }
  return ergebnis;
}

/** e hoch x: x = k·ln2 + r mit |r| ≤ ln2/2, Taylor-Reihe für e^r, dann 2^k. */
export function expDet(x: number): number {
  if (x === 0) return 1;
  const k = Math.round(x / LN2);
  const r = x - k * LN2;
  let term = 1;
  let s = 1;
  for (let i = 1; i <= TAYLOR_TERME; i++) {
    term = (term * r) / i;
    s += term;
  }
  return s * powInt(2, k);
}

/** Natürlicher Logarithmus: x = m·2^e mit m ∈ [√½, √2), ln m = 2·atanh((m−1)/(m+1)). */
export function lnDet(x: number): number {
  if (!(x > 0)) throw new RangeError(`lnDet braucht x > 0: ${x}`);
  let m = x;
  let e = 0;
  const OBERGRENZE = 1.4142135623730951;
  const UNTERGRENZE = 0.7071067811865476;
  while (m >= OBERGRENZE) {
    m /= 2;
    e++;
  }
  while (m < UNTERGRENZE) {
    m *= 2;
    e--;
  }
  const z = (m - 1) / (m + 1);
  const z2 = z * z;
  let term = z;
  let s = 0;
  for (let i = 0; i < ATANH_TERME; i++) {
    s += term / (2 * i + 1);
    term *= z2;
  }
  return 2 * s + e * LN2;
}
