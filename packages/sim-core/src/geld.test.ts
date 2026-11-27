import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { anteil, bp, cents, eur, floorToEuro, prozent, roundHalfAwayFromZero } from './geld.ts';

describe('Geld und Basispunkte', () => {
  it('rundet kaufmännisch', () => {
    expect(roundHalfAwayFromZero(0.5)).toBe(1);
    expect(roundHalfAwayFromZero(-0.5)).toBe(-1);
    expect(roundHalfAwayFromZero(2.4999)).toBe(2);
  });

  it('wandelt Euro und Prozent', () => {
    expect(eur(1234.565)).toBe(123457);
    expect(prozent(3.9)).toBe(390);
    expect(floorToEuro(cents(12399))).toBe(12300);
    expect(anteil(eur(200_000), bp(550))).toBe(eur(11_000));
  });

  it('lehnt nicht-ganzzahlige Cent ab', () => {
    expect(() => cents(1.5)).toThrow(RangeError);
  });

  it('Rundungsfehler bei Prozentanteilen ist höchstens ein halber Cent', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 1e10 }), fc.integer({ min: 0, max: 10_000 }), (c, b) => {
        return Math.abs(anteil(cents(c), bp(b)) - (c * b) / 10_000) <= 0.5;
      }),
    );
  });
});
