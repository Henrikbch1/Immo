import { describe, expect, it } from 'vitest';
import { formatEuro, formatMonat, formatProzentAusBp, formatZahl } from './format.ts';

const NBSP = ' ';

describe('Formatter de-DE (K-01)', () => {
  it('formatiert Euro aus Cent mit geschütztem Leerzeichen', () => {
    expect(formatEuro(123456)).toBe(`1.234,56${NBSP}€`);
    expect(formatEuro(-5000)).toBe(`-50,00${NBSP}€`);
    expect(formatEuro(30000000, { ganz: true })).toBe(`300.000${NBSP}€`);
  });

  it('formatiert Zahlen und Prozent', () => {
    expect(formatZahl(1234.5, 1)).toBe('1.234,5');
    expect(formatProzentAusBp(400)).toBe(`4,00${NBSP}%`);
  });

  it('formatiert Monate', () => {
    expect(formatMonat(2026, 11)).toBe('Nov. 2026');
  });
});
