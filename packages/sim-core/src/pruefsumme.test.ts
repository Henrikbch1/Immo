import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { kalkuliere } from './kalkulation.ts';
import { kanonisch, pruefsumme, sha256 } from './pruefsumme.ts';
import { BEISPIELOBJEKT, REFERENZ_MONATE, referenzPruefsumme, referenzZustand } from './referenz.ts';

describe('SHA-256 (ohne crypto)', () => {
  it('Testvektoren FIPS 180-2', () => {
    expect(sha256('')).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    expect(sha256('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
    expect(sha256('abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq')).toBe(
      '248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1',
    );
    expect(sha256('Grunderwerbsteuer € ä 🏠').length).toBe(64);
  });

  it('stimmt mit node:crypto überein (Umlaute, Emoji, lange Texte)', async () => {
    // Nur im Test: Vergleich mit der Node-Implementierung (Kern bleibt ohne Node-Typen).
    const modul: string = 'node:crypto';
    const { createHash } = await import(modul);
    fc.assert(
      fc.property(fc.string({ unit: 'binary', maxLength: 300 }), (s) => {
        expect(sha256(s)).toBe(createHash('sha256').update(s, 'utf8').digest('hex'));
      }),
      { numRuns: 300 },
    );
  });
});

describe('Kanonische Serialisierung', () => {
  it('Schlüsselreihenfolge egal, undefined weggelassen, NaN verboten', () => {
    expect(kanonisch({ b: 1, a: [1, 'x', null], c: undefined })).toBe('{"a":[1,"x",null],"b":1}');
    expect(pruefsumme({ a: 1, b: 2 })).toBe(pruefsumme({ b: 2, a: 1 }));
    expect(() => kanonisch({ a: Number.NaN })).toThrow();
  });
});

describe('Golden-Hash (Determinismus, ADR 0004)', () => {
  it(`Referenzszenario über ${REFERENZ_MONATE} Monate`, () => {
    const z = referenzZustand(42);
    expect(z.monate).toHaveLength(REFERENZ_MONATE);
    // Nie einfach „aktualisieren“: Änderung nur mit benannter Ursache (CLAUDE.md, Tests).
    expect(referenzPruefsumme(42)).toBe('a04be39d2899dfced591131755c3918ec14f5ce9bdfc47d70fb0f67ee4282f17');
  });

  it('gleiche Eingabe → gleiche Prüfsumme, anderer Seed → andere', () => {
    expect(referenzPruefsumme(7)).toBe(referenzPruefsumme(7));
    expect(referenzPruefsumme(7)).not.toBe(referenzPruefsumme(8));
  });

  it('Node = Browser: Prüfsumme der Demo-Seite mit Beispielobjekt (in Chromium gemessen, Z2)', () => {
    const eingabe = { ...BEISPIELOBJEKT, maklerSatz: null };
    const r = kalkuliere(eingabe);
    expect(pruefsumme({ eingabe, kennzahlen: r.kennzahlen })).toBe(
      '4c230e895411078b24e48ddca9682e88a460ee7fb21ee62be220aba7df0ccb56',
    );
  });
});
