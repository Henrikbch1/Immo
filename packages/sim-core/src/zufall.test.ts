import { describe, expect, it } from 'vitest';
import { rand, randInt } from './zufall.ts';

describe('Zählerbasierter Zufall', () => {
  it('ist reproduzierbar und unabhängig von Aufrufreihenfolge', () => {
    const a = rand(4817, 'offers', 322, 'o1', 0);
    rand(4817, 'events', 322, 'x', 3);
    expect(rand(4817, 'offers', 322, 'o1', 0)).toBe(a);
  });

  it('Goldwerte bleiben stabil (Determinismus über Engines)', () => {
    expect(rand(1, 'test', 0, 0, 0)).toMatchInlineSnapshot(`0.38054949797128645`);
    expect(rand(4817, 'macro', 322, 'de', 7)).toMatchInlineSnapshot(`0.44606740303633263`);
  });

  it('liefert Werte in [0, 1) mit plausibler Verteilung', () => {
    let summe = 0;
    const n = 20_000;
    for (let i = 0; i < n; i++) {
      const x = rand(42, 'test', i % 480, i, 0);
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(1);
      summe += x;
    }
    expect(Math.abs(summe / n - 0.5)).toBeLessThan(0.01);
  });

  it('randInt bleibt in den Grenzen', () => {
    for (let k = 0; k < 1000; k++) {
      const w = randInt(7, 'test', 1, 1, 3, 9, k);
      expect(w).toBeGreaterThanOrEqual(3);
      expect(w).toBeLessThanOrEqual(9);
    }
  });
});
