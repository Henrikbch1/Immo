import { describe, expect, it } from 'vitest';
import {
  formatEuro,
  formatJahreMonate,
  formatMonat,
  formatProzentAusBp,
  formatZahl,
  parseDeZahl,
} from './format.ts';

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

describe('Eingaben de-DE', () => {
  it('liest deutsche Zahlen', () => {
    expect(parseDeZahl('300.000')).toBe(300000);
    expect(parseDeZahl('4,5')).toBe(4.5);
    expect(parseDeZahl('1.234,56 €')).toBe(1234.56);
    expect(parseDeZahl('2 %')).toBe(2);
    expect(parseDeZahl('0')).toBe(0);
  });

  it('lehnt Unsinn ab', () => {
    expect(parseDeZahl('')).toBeNull();
    expect(parseDeZahl('abc')).toBeNull();
    expect(parseDeZahl('1.23,4')).toBeNull();
    expect(parseDeZahl('4.5.6')).toBeNull();
  });

  it('formatiert Laufzeiten', () => {
    expect(formatJahreMonate(417)).toBe(`34${NBSP}Jahre 9${NBSP}Monate`);
    expect(formatJahreMonate(12)).toBe(`1${NBSP}Jahr`);
    expect(formatJahreMonate(1)).toBe(`1${NBSP}Monat`);
  });
});
