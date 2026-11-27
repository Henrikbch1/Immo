/**
 * Objektkalkulation (research/10 K01–K17, K25–K27; 02 §2.5): Kaufnebenkosten, Bierdeckel, Renditen,
 * Reserven und Cashflow-Kaskade. Reine Funktionen; jede Kennzahl trägt ihren Rechenweg (`kennzahl.ts`).
 */
import { berechneDarlehen, type Darlehensergebnis } from './darlehen.ts';
import { type Bp, type Cents, cents } from './geld.ts';
import { abgeleitet, aus, ausParameter, eingabe, type Kennzahl, type Posten } from './kennzahl.ts';
import { type Bundesland, type ParameterId, pw } from './parameter.ts';

const MONATE = 12;

// ---------------------------------------------------------------------------------------------
// K05 Kaufnebenkosten
// ---------------------------------------------------------------------------------------------

export interface KnkEingabe {
  kaufpreis: Cents;
  bundesland: Bundesland;
  /** Bewegliches Inventar mit eigenem Preis (mindert nur die GrESt-Basis); WEG-Rücklage nie abziehen. */
  inventarSeparat?: Cents;
  /** Käuferanteil der Maklerprovision; null/undefiniert = kein Makler. */
  maklerSatz?: Bp | null;
  /** Abweichender Notar-/Grundbuchsatz (sonst Parameter `knk.notarGrundbuch`). */
  notarSatz?: Bp;
}

export interface Kaufnebenkosten {
  grest: Kennzahl;
  notarGrundbuch: Kennzahl;
  makler: Kennzahl;
  summe: Kennzahl;
}

export function grestParameter(land: Bundesland): ParameterId {
  return `knk.grest.${land}`;
}

export function kaufnebenkosten(e: KnkEingabe): Kaufnebenkosten {
  const kp = eingabe('kaufpreis', e.kaufpreis, 'EUR');
  const inventar = e.inventarSeparat ?? 0;
  const basis =
    inventar > 0
      ? abgeleitet({
          schluessel: 'knk.grestBasis',
          einheit: 'EUR',
          zeitbezug: 'EINMALIG',
          rechenart: 'summe',
          herleitung: [kp, eingabe('inventarSeparat', inventar, 'EUR', '−')],
        })
      : null;
  // GrESt auf volle Euro abgerundet (02 §2.5, LR-09).
  const grest = abgeleitet({
    schluessel: 'knk.grest',
    einheit: 'EUR',
    zeitbezug: 'EINMALIG',
    rechenart: 'produkt',
    rundung: 'euroAb',
    herleitung: [basis ? aus(basis) : kp, ausParameter(grestParameter(e.bundesland))],
    ...(basis ? { aus: [basis] } : {}),
  });
  const notarGrundbuch = abgeleitet({
    schluessel: 'knk.notarGrundbuch',
    einheit: 'EUR',
    zeitbezug: 'EINMALIG',
    rechenart: 'produkt',
    rundung: 'cent',
    herleitung: [
      kp,
      e.notarSatz === undefined
        ? ausParameter('knk.notarGrundbuch')
        : eingabe('notarSatz', e.notarSatz, 'BP', '×'),
    ],
    vereinfachungen: ['notarPauschale'],
  });
  const makler = abgeleitet({
    schluessel: 'knk.makler',
    einheit: 'EUR',
    zeitbezug: 'EINMALIG',
    rechenart: 'produkt',
    rundung: 'cent',
    herleitung: [kp, eingabe('maklerSatz', e.maklerSatz ?? 0, 'BP', '×')],
  });
  const summe = abgeleitet({
    schluessel: 'knk.summe',
    einheit: 'EUR',
    zeitbezug: 'EINMALIG',
    rechenart: 'summe',
    herleitung: [aus(grest), aus(notarGrundbuch), aus(makler)],
    aus: [grest, notarGrundbuch, makler],
  });
  return { grest, notarGrundbuch, makler, summe };
}

// ---------------------------------------------------------------------------------------------
// K02, K09–K11 Bierdeckel
// ---------------------------------------------------------------------------------------------

export type BierdeckelStufe = 'unter' | 'genauerBlick' | 'selbsttragend' | 'hoch' | 'selten';

export interface Bierdeckel {
  jahresmiete: Kennzahl;
  bruttorendite: Kennzahl;
  faktor: Kennzahl;
  preisJeM2: Kennzahl;
  mieteJeM2: Kennzahl;
  stufe: BierdeckelStufe;
}

/** Ampelstufe aus der Bruttorendite (Schwellen `kalk.bierdeckel.*`, DESIGN, LR-55). */
export function bierdeckelStufe(bruttoBp: number): BierdeckelStufe {
  if (bruttoBp >= pw('kalk.bierdeckel.selten')) return 'selten';
  if (bruttoBp >= pw('kalk.bierdeckel.hoch')) return 'hoch';
  if (bruttoBp >= pw('kalk.bierdeckel.selbsttragend')) return 'selbsttragend';
  if (bruttoBp >= pw('kalk.bierdeckel.genauerBlick')) return 'genauerBlick';
  return 'unter';
}

export function jahresnettokaltmiete(mieteMonat: Cents): Kennzahl {
  return abgeleitet({
    schluessel: 'miete.jahr',
    einheit: 'EUR',
    zeitbezug: 'JAHR',
    rechenart: 'produkt',
    herleitung: [eingabe('mieteMonat', mieteMonat, 'EUR'), eingabe('monate', MONATE, 'ANZAHL', '×')],
  });
}

export function bierdeckel(e: { kaufpreis: Cents; mieteMonat: Cents; flaeche: number }): Bierdeckel {
  const kp = eingabe('kaufpreis', e.kaufpreis, 'EUR');
  const fl = eingabe('flaeche', e.flaeche, 'M2', '÷');
  const jahresmiete = jahresnettokaltmiete(e.mieteMonat);
  const bruttorendite = abgeleitet({
    schluessel: 'rendite.brutto',
    einheit: 'BP',
    zeitbezug: 'JAHR',
    rechenart: 'quotient',
    herleitung: [aus(jahresmiete), { ...kp, op: '÷' }],
    aus: [jahresmiete],
  });
  const faktor = abgeleitet({
    schluessel: 'rendite.faktor',
    einheit: 'FAKTOR',
    zeitbezug: 'JAHR',
    rechenart: 'quotient',
    herleitung: [kp, aus(jahresmiete, '÷')],
    aus: [jahresmiete],
  });
  const preisJeM2 = abgeleitet({
    schluessel: 'objekt.preisJeM2',
    einheit: 'EUR_JE_M2',
    zeitbezug: 'EINMALIG',
    rechenart: 'quotient',
    rundung: 'cent',
    herleitung: [kp, fl],
  });
  const mieteJeM2 = abgeleitet({
    schluessel: 'miete.jeM2',
    einheit: 'EUR_JE_M2',
    zeitbezug: 'MONAT',
    rechenart: 'quotient',
    rundung: 'cent',
    herleitung: [eingabe('mieteMonat', e.mieteMonat, 'EUR'), fl],
  });
  return {
    jahresmiete,
    bruttorendite,
    faktor,
    preisJeM2,
    mieteJeM2,
    stufe: bierdeckelStufe(bruttorendite.wert),
  };
}

// ---------------------------------------------------------------------------------------------
// K13, K14 Reserven
// ---------------------------------------------------------------------------------------------

/** K13 Variante 1: II.-BV-Satz je m² und Jahr nach Gebäudealter (Bezugsjahr `kalk.rechenjahr`). */
export function instandhaltungIiBv(e: { flaeche: number; baujahr: number; aufzug?: boolean }): {
  satz: Kennzahl;
  jahr: Kennzahl;
} {
  const alter = pw('kalk.rechenjahr') - e.baujahr;
  const stufe: ParameterId =
    alter < pw('kalk.instandhaltung.iiBv.grenze1')
      ? 'kalk.instandhaltung.iiBv.unter22'
      : alter < pw('kalk.instandhaltung.iiBv.grenze2')
        ? 'kalk.instandhaltung.iiBv.unter32'
        : 'kalk.instandhaltung.iiBv.ab32';
  const satz = abgeleitet({
    schluessel: 'reserve.instandhaltungSatz',
    einheit: 'EUR_JE_M2',
    zeitbezug: 'JAHR',
    rechenart: 'summe',
    herleitung: [
      ausParameter(stufe, '+'),
      ...(e.aufzug ? [ausParameter('kalk.instandhaltung.iiBv.aufzug', '+')] : []),
    ],
    vereinfachungen: ['iiBvOrientierung'],
  });
  const jahr = abgeleitet({
    schluessel: 'reserve.instandhaltungJahr',
    einheit: 'EUR',
    zeitbezug: 'JAHR',
    rechenart: 'produkt',
    rundung: 'cent',
    herleitung: [eingabe('flaeche', e.flaeche, 'M2'), aus(satz, '×')],
    aus: [satz],
  });
  return { satz, jahr };
}

/** K14: Mietausfallreserve = Jahresnettokaltmiete × Quote. */
export function mietausfallreserve(jahresmiete: Kennzahl, quote?: Bp): Kennzahl {
  return abgeleitet({
    schluessel: 'reserve.mietausfallJahr',
    einheit: 'EUR',
    zeitbezug: 'JAHR',
    rechenart: 'produkt',
    rundung: 'cent',
    herleitung: [
      aus(jahresmiete),
      quote === undefined
        ? ausParameter('kalk.mietausfall.quote')
        : eingabe('mietausfallQuote', quote, 'BP', '×'),
    ],
    aus: [jahresmiete],
  });
}

// ---------------------------------------------------------------------------------------------
// K06–K08, K17 Kapital und Nettorendite
// ---------------------------------------------------------------------------------------------

export function gesamtkaufkosten(kaufpreis: Cents, knk: Kennzahl): Kennzahl {
  return abgeleitet({
    schluessel: 'kauf.gesamtkosten',
    einheit: 'EUR',
    zeitbezug: 'EINMALIG',
    rechenart: 'summe',
    herleitung: [eingabe('kaufpreis', kaufpreis, 'EUR'), aus(knk)],
    aus: [knk],
  });
}

/** K17: (JNKM − nicht umlagefähige Kosten) ÷ (Kaufpreis + KNK). Rücklagen separat (Schalter aus). */
export function nettomietrendite(jahresmiete: Kennzahl, nuKostenJahr: Kennzahl, gesamt: Kennzahl): Kennzahl {
  return abgeleitet({
    schluessel: 'rendite.netto',
    einheit: 'BP',
    zeitbezug: 'JAHR',
    rechenart: 'quotient',
    herleitung: [aus(jahresmiete), aus(nuKostenJahr, '−'), aus(gesamt, '÷')],
    aus: [jahresmiete, nuKostenJahr, gesamt],
  });
}

/** K08 Definition B: eigene Mittel = KNK + (Kaufpreis − Darlehen) + Anfangsrenovierung + Liquiditätspuffer. */
export function eigeneMittelBedarf(e: {
  kaufpreis: Cents;
  knk: Kennzahl;
  darlehen: Cents;
  renovierung?: Cents;
  puffer?: Cents;
}): Kennzahl {
  return abgeleitet({
    schluessel: 'kauf.eigeneMittel',
    einheit: 'EUR',
    zeitbezug: 'EINMALIG',
    rechenart: 'summe',
    herleitung: [
      aus(e.knk),
      eingabe('kaufpreis', e.kaufpreis, 'EUR'),
      eingabe('darlehen', e.darlehen, 'EUR', '−'),
      eingabe('renovierung', e.renovierung ?? 0, 'EUR'),
      eingabe('puffer', e.puffer ?? 0, 'EUR'),
    ],
    aus: [e.knk],
  });
}

/** K34: bankseitige Mindest-Bruttorendite = Stresszins ÷ (1 − Mietabschlag), in Basispunkten. */
export function bankMindestrendite(stresszins: Bp, mietabschlag: Bp): number {
  return (stresszins * 10_000) / (10_000 - mietabschlag);
}

// ---------------------------------------------------------------------------------------------
// K25–K27 Cashflow-Kaskade (research/10 §1.7)
// ---------------------------------------------------------------------------------------------

export interface KaskadeEingabe {
  nettokaltmieteJahr: Kennzahl;
  /** Tatsächlicher Mietausfall (mindert die vereinnahmte Miete). */
  mietausfallJahr?: Cents;
  nuKostenJahr: Kennzahl;
  /** Zins und Tilgung im Jahr: Betrag oder Kennzahl (dann in der Erklär-Karte verschachtelt antippbar). */
  zinsJahr: Cents | Kennzahl;
  tilgungJahr: Cents | Kennzahl;
  /** Kalkulatorische Rücklagen (nur Liquiditätssicht, kein bezahlter Aufwand). */
  ruecklagen?: Kennzahl[];
  /** Näherung der Steuerstufe (vollständige Steuer ab P4): ohne Soli/Kirchensteuer. */
  steuer?: { afaJahr: Cents; grenzsteuersatz: Bp };
}

export interface Kaskade {
  operativ: Kennzahl;
  nachFinanzierung: Kennzahl;
  ruecklagenSumme: Kennzahl;
  liquiditaetNachRuecklagen: Kennzahl;
  steuerlichesErgebnis?: Kennzahl;
  steuerwirkung?: Kennzahl;
  nachSteuern?: Kennzahl;
}

function posten(name: string, x: Cents | Kennzahl, op: '+' | '−'): Posten {
  return typeof x === 'number' ? eingabe(name, x, 'EUR', op) : aus(x, op);
}

export function cashflowKaskade(e: KaskadeEingabe): Kaskade {
  const mietausfall = e.mietausfallJahr ?? 0;
  const zins = posten('zinsJahr', e.zinsJahr, '−');
  const tilgung = posten('tilgungJahr', e.tilgungJahr, '−');
  const ausKapitaldienst = [e.zinsJahr, e.tilgungJahr].filter((x): x is Kennzahl => typeof x !== 'number');
  const operativ = abgeleitet({
    schluessel: 'cf.operativ',
    einheit: 'EUR',
    zeitbezug: 'JAHR',
    rechenart: 'summe',
    herleitung: [
      aus(e.nettokaltmieteJahr),
      ...(mietausfall ? [eingabe('mietausfallJahr', mietausfall, 'EUR', '−')] : []),
      aus(e.nuKostenJahr, '−'),
    ],
    aus: [e.nettokaltmieteJahr, e.nuKostenJahr],
  });
  const nachFinanzierung = abgeleitet({
    schluessel: 'cf.nachFinanzierung',
    einheit: 'EUR',
    zeitbezug: 'JAHR',
    rechenart: 'summe',
    herleitung: [aus(operativ), zins, tilgung],
    aus: [operativ, ...ausKapitaldienst],
  });
  const ruecklagen = e.ruecklagen ?? [];
  const ruecklagenSumme = abgeleitet({
    schluessel: 'reserve.summeJahr',
    einheit: 'EUR',
    zeitbezug: 'JAHR',
    rechenart: 'summe',
    herleitung: ruecklagen.map((r) => aus(r)),
    aus: ruecklagen,
  });

  let steuerlichesErgebnis: Kennzahl | undefined;
  let steuerwirkung: Kennzahl | undefined;
  let nachSteuern: Kennzahl | undefined;
  if (e.steuer) {
    steuerlichesErgebnis = abgeleitet({
      schluessel: 'steuer.ergebnis',
      einheit: 'EUR',
      zeitbezug: 'JAHR',
      rechenart: 'summe',
      herleitung: [aus(operativ), zins, eingabe('afaJahr', e.steuer.afaJahr, 'EUR', '−')],
      aus: [operativ],
      vereinfachungen: ['steuerNaeherung'],
    });
    steuerwirkung = abgeleitet({
      schluessel: 'steuer.wirkung',
      einheit: 'EUR',
      zeitbezug: 'JAHR',
      rechenart: 'produkt',
      rundung: 'cent',
      herleitung: [
        aus(steuerlichesErgebnis),
        eingabe('grenzsteuersatz', e.steuer.grenzsteuersatz, 'BP', '×'),
      ],
      aus: [steuerlichesErgebnis],
      vereinfachungen: ['steuerNaeherung'],
    });
    nachSteuern = abgeleitet({
      schluessel: 'cf.nachSteuern',
      einheit: 'EUR',
      zeitbezug: 'JAHR',
      rechenart: 'summe',
      herleitung: [aus(nachFinanzierung), aus(steuerwirkung, '−')],
      aus: [nachFinanzierung, steuerwirkung],
      vereinfachungen: ['steuerNaeherung'],
    });
  }
  const basis = nachSteuern ?? nachFinanzierung;
  const liquiditaetNachRuecklagen = abgeleitet({
    schluessel: 'cf.liquiditaetNachRuecklagen',
    einheit: 'EUR',
    zeitbezug: 'JAHR',
    rechenart: 'summe',
    herleitung: [aus(basis), aus(ruecklagenSumme, '−')],
    aus: [basis, ruecklagenSumme],
  });
  return {
    operativ,
    nachFinanzierung,
    ruecklagenSumme,
    liquiditaetNachRuecklagen,
    ...(steuerlichesErgebnis ? { steuerlichesErgebnis } : {}),
    ...(steuerwirkung ? { steuerwirkung } : {}),
    ...(nachSteuern ? { nachSteuern } : {}),
  };
}

// ---------------------------------------------------------------------------------------------
// Vollkalkulation eines Objekts (Seite „Bierdeckel & Kalkulator“)
// ---------------------------------------------------------------------------------------------

export interface KalkulationsEingabe {
  kaufpreis: Cents;
  flaeche: number;
  /** Nettokaltmiete (Ist) pro Monat. */
  mieteMonat: Cents;
  /** Hausgeld gesamt pro Monat (informativ; umlagefähiger Teil ist durchlaufend). */
  hausgeldMonat: Cents;
  /** Davon nicht umlagefähig (Verwaltung, Erhaltungsrücklage, Reparaturen …) pro Monat. */
  hausgeldNichtUmlagefaehigMonat: Cents;
  /** Weitere nicht umlagefähige Kosten pro Monat (z. B. Sondereigentumsverwaltung). */
  sonstigeKostenMonat?: Cents;
  bundesland: Bundesland;
  baujahr: number;
  aufzug?: boolean;
  maklerSatz?: Bp | null;
  eigenkapital: Cents;
  sollzins: Bp;
  anfangstilgung: Bp;
  zinsbindungJahre: number;
}

export interface Kalkulation {
  knk: Kaufnebenkosten;
  bierdeckel: Bierdeckel;
  gesamtkosten: Kennzahl;
  darlehen: Kennzahl;
  finanzierungsquote: Kennzahl;
  nuKostenJahr: Kennzahl;
  instandhaltung: { satz: Kennzahl; jahr: Kennzahl };
  mietausfall: Kennzahl;
  nettorendite: Kennzahl;
  zinsJahr1: Kennzahl;
  tilgungJahr1: Kennzahl;
  kaskade: Kaskade;
  darlehensplan: Darlehensergebnis | null;
  /** Alle Kennzahlen nach Schlüssel – Grundlage für `explain()` und die Erklär-Karte. */
  kennzahlen: Record<string, Kennzahl>;
}

export function kalkuliere(e: KalkulationsEingabe): Kalkulation {
  const knk = kaufnebenkosten({
    kaufpreis: e.kaufpreis,
    bundesland: e.bundesland,
    maklerSatz: e.maklerSatz ?? null,
  });
  const bd = bierdeckel({ kaufpreis: e.kaufpreis, mieteMonat: e.mieteMonat, flaeche: e.flaeche });
  const gesamtkosten = gesamtkaufkosten(e.kaufpreis, knk.summe);

  const darlehensbetrag = Math.max(0, gesamtkosten.wert - e.eigenkapital);
  const darlehen = abgeleitet({
    schluessel: 'kauf.darlehen',
    einheit: 'EUR',
    zeitbezug: 'EINMALIG',
    rechenart: 'summe',
    herleitung: [
      aus(gesamtkosten),
      eingabe('eigenkapital', Math.min(e.eigenkapital, gesamtkosten.wert), 'EUR', '−'),
    ],
    aus: [gesamtkosten],
  });
  const finanzierungsquote = abgeleitet({
    schluessel: 'kauf.finanzierungsquote',
    einheit: 'BP',
    zeitbezug: 'EINMALIG',
    rechenart: 'quotient',
    herleitung: [aus(darlehen), eingabe('kaufpreis', e.kaufpreis, 'EUR', '÷')],
    aus: [darlehen],
  });

  const nuKostenJahr = abgeleitet({
    schluessel: 'kosten.nichtUmlagefaehigJahr',
    einheit: 'EUR',
    zeitbezug: 'JAHR',
    rechenart: 'produkt',
    herleitung: [
      eingabe(
        'nichtUmlagefaehigMonat',
        e.hausgeldNichtUmlagefaehigMonat + (e.sonstigeKostenMonat ?? 0),
        'EUR',
      ),
      eingabe('monate', MONATE, 'ANZAHL', '×'),
    ],
  });
  const instandhaltung = instandhaltungIiBv({
    flaeche: e.flaeche,
    baujahr: e.baujahr,
    ...(e.aufzug ? { aufzug: true } : {}),
  });
  const mietausfall = mietausfallreserve(bd.jahresmiete);
  const nettorendite = nettomietrendite(bd.jahresmiete, nuKostenJahr, gesamtkosten);

  const darlehensplan =
    darlehensbetrag > 0
      ? berechneDarlehen({
          betrag: cents(darlehensbetrag),
          sollzins: e.sollzins,
          anfangstilgung: e.anfangstilgung,
          zinsbindungJahre: e.zinsbindungJahre,
        })
      : null;
  let zins1 = 0;
  let tilgung1 = 0;
  for (const z of darlehensplan?.plan.slice(0, MONATE) ?? []) {
    zins1 += z.zins;
    tilgung1 += z.tilgung;
  }
  const zinsJahr1 = abgeleitet({
    schluessel: 'darlehen.zinsJahr1',
    einheit: 'EUR',
    zeitbezug: 'JAHR',
    rechenart: 'summe',
    herleitung: [eingabe('zinsenMonate1bis12', zins1, 'EUR')],
    vereinfachungen: ['ersterJahrKapitaldienst'],
  });
  const tilgungJahr1 = abgeleitet({
    schluessel: 'darlehen.tilgungJahr1',
    einheit: 'EUR',
    zeitbezug: 'JAHR',
    rechenart: 'summe',
    herleitung: [eingabe('tilgungMonate1bis12', tilgung1, 'EUR')],
    vereinfachungen: ['ersterJahrKapitaldienst'],
  });

  const kaskade = cashflowKaskade({
    nettokaltmieteJahr: bd.jahresmiete,
    nuKostenJahr,
    zinsJahr: zinsJahr1,
    tilgungJahr: tilgungJahr1,
    ruecklagen: [instandhaltung.jahr, mietausfall],
  });

  const alle: Kennzahl[] = [
    knk.grest,
    knk.notarGrundbuch,
    knk.makler,
    knk.summe,
    bd.jahresmiete,
    bd.bruttorendite,
    bd.faktor,
    bd.preisJeM2,
    bd.mieteJeM2,
    gesamtkosten,
    darlehen,
    finanzierungsquote,
    nuKostenJahr,
    instandhaltung.satz,
    instandhaltung.jahr,
    mietausfall,
    nettorendite,
    zinsJahr1,
    tilgungJahr1,
    kaskade.operativ,
    kaskade.nachFinanzierung,
    kaskade.ruecklagenSumme,
    kaskade.liquiditaetNachRuecklagen,
  ];
  const kennzahlen: Record<string, Kennzahl> = {};
  for (const k of alle) kennzahlen[k.schluessel] = k;

  return {
    knk,
    bierdeckel: bd,
    gesamtkosten,
    darlehen,
    finanzierungsquote,
    nuKostenJahr,
    instandhaltung,
    mietausfall,
    nettorendite,
    zinsJahr1,
    tilgungJahr1,
    kaskade,
    darlehensplan,
    kennzahlen,
  };
}
