import { describe, expect, it } from 'vitest';
import { jahrVon, monatsSchluessel, monatVon, monthIndex, plusMonate, quartalVon } from './kalender.ts';

describe('Kalender (MonthIndex)', () => {
  it('bildet Jahr und Monat hin und zurück ab', () => {
    const m = monthIndex(2026, 11);
    expect(m).toBe(322);
    expect(jahrVon(m)).toBe(2026);
    expect(monatVon(m)).toBe(11);
    expect(quartalVon(m)).toBe(4);
    expect(monatsSchluessel(plusMonate(m, 2))).toBe('2027-01');
  });

  it('lehnt ungültige Monate ab', () => {
    expect(() => monthIndex(2026, 13)).toThrow(RangeError);
    expect(() => monthIndex(2026, 0)).toThrow(RangeError);
  });
});
