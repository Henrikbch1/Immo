import Decimal from 'decimal.js';
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { expDet, lnDet, powInt } from './detmath.ts';

const relFehler = (a: number, b: number) => Math.abs(a - b) / Math.max(Math.abs(b), Number.MIN_VALUE);

describe('detmath gegen decimal.js als Orakel', () => {
  it('powInt', () => {
    expect(powInt(2, 10)).toBe(1024);
    expect(powInt(1.0025, 0)).toBe(1);
    expect(powInt(2, -2)).toBe(0.25);
    fc.assert(
      fc.property(fc.double({ min: 0.5, max: 2, noNaN: true }), fc.integer({ min: 0, max: 480 }), (x, n) => {
        const soll = new Decimal(x).pow(n).toNumber();
        return relFehler(powInt(x, n), soll) < 1e-12;
      }),
    );
  });

  it('expDet', () => {
    fc.assert(
      fc.property(fc.double({ min: -30, max: 30, noNaN: true }), (x) => {
        return relFehler(expDet(x), new Decimal(x).exp().toNumber()) < 1e-13;
      }),
    );
  });

  it('lnDet', () => {
    expect(lnDet(1)).toBe(0);
    expect(() => lnDet(0)).toThrow(RangeError);
    fc.assert(
      fc.property(fc.double({ min: 1e-6, max: 1e9, noNaN: true }), (x) => {
        const soll = new Decimal(x).ln().toNumber();
        return Math.abs(lnDet(x) - soll) < 1e-13 * Math.max(1, Math.abs(soll));
      }),
    );
  });
});
