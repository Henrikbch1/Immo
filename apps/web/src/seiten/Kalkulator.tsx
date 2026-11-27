import {
  ALLE_PARAMETER,
  BEISPIELOBJEKT,
  type BierdeckelStufe,
  BUNDESLAENDER,
  type Bundesland,
  eur,
  grestParameter,
  type Kalkulation,
  type KalkulationsEingabe,
  type Kennzahl as KennzahlDaten,
  kalkuliere,
  PARAMETER,
  prozent,
  pruefsumme,
} from '@immo/sim-core';
import { formatEuro, formatProzentAusBp, formatZahl } from '@immo/ui';
import { Link } from '@tanstack/react-router';
import { CircleAlert, CircleCheck, CircleX, Info, type LucideIcon } from 'lucide-react';
import { type ReactNode, useEffect, useId, useMemo, useState } from 'react';
import { ErklaerKarte } from '../komponenten/ErklaerKarte.tsx';
import { Kennzahl } from '../komponenten/Kennzahl.tsx';
import { StatusBadge } from '../komponenten/StatusBadge.tsx';
import { gueltig, Zahlenfeld } from '../komponenten/Zahlenfeld.tsx';
import { setzePruefsumme } from '../shell/pruefsumme.ts';
import { formatWert, KENNZAHL_TEXTE } from '../texte/kennzahlen.ts';

export const LAENDER: Record<Bundesland, string> = {
  BW: 'Baden-Württemberg',
  BY: 'Bayern',
  BE: 'Berlin',
  BB: 'Brandenburg',
  HB: 'Bremen',
  HH: 'Hamburg',
  HE: 'Hessen',
  MV: 'Mecklenburg-Vorpommern',
  NI: 'Niedersachsen',
  NW: 'Nordrhein-Westfalen',
  RP: 'Rheinland-Pfalz',
  SL: 'Saarland',
  SN: 'Sachsen',
  ST: 'Sachsen-Anhalt',
  SH: 'Schleswig-Holstein',
  TH: 'Thüringen',
};

const P_ZINS = PARAMETER['darlehen.sollzins.beispiel2026'];
const P_TILGUNG = PARAMETER['darlehen.anfangstilgung.standard'];
const P_MAKLER = ALLE_PARAMETER['knk.makler.kaeuferSatz'];

const euroText = (c: number) => formatZahl(c / 100, c % 100 === 0 ? 0 : 2);
const prozentText = (bp: number) => formatZahl(bp / 100, bp % 100 === 0 ? 1 : 2);

const AMPEL: Record<
  BierdeckelStufe,
  { titel: string; text: string; icon: LucideIcon; klasse: string; schwelle: string }
> = {
  unter: {
    titel: 'Unter 5 %',
    text: 'Laut Faustregel lohnt ein genauerer Blick meist erst ab etwa 5 % Bruttorendite.',
    icon: CircleX,
    klasse: 'border-critical bg-critical-tint text-critical',
    schwelle: 'kalk.bierdeckel.genauerBlick',
  },
  genauerBlick: {
    titel: '5 bis unter 6 %',
    text: 'Ein genauerer Blick lohnt sich – die Vollkalkulation zeigt, ob es trägt.',
    icon: CircleAlert,
    klasse: 'border-warning bg-warning-tint text-warning',
    schwelle: 'kalk.bierdeckel.genauerBlick',
  },
  selbsttragend: {
    titel: '6 bis unter 8 %',
    text: 'Typischer Bereich für Objekte, die sich selbst tragen können.',
    icon: CircleCheck,
    klasse: 'border-positive bg-positive-tint text-positive',
    schwelle: 'kalk.bierdeckel.selbsttragend',
  },
  hoch: {
    titel: '8 bis unter 10 %',
    text: 'Hohe Bruttorendite. Sie garantiert keinen positiven Cashflow – prüfe Lage, Zustand und Kosten genau.',
    icon: CircleCheck,
    klasse: 'border-positive bg-positive-tint text-positive',
    schwelle: 'kalk.bierdeckel.hoch',
  },
  selten: {
    titel: '10 % und mehr',
    text: 'Sehr selten. Finde heraus, warum das Objekt so günstig ist.',
    icon: Info,
    klasse: 'border-info bg-info-tint text-info',
    schwelle: 'kalk.bierdeckel.selten',
  },
};

/** Seite „Bierdeckel & Kalkulator“ (Sprint Z2, Meilenstein M-A): ein Objekt fachlich durchrechnen, mit Rechenweg. */
export function Kalkulator() {
  const b = BEISPIELOBJEKT;
  const [kaufpreis, setKaufpreis] = useState(euroText(b.kaufpreis));
  const [flaeche, setFlaeche] = useState(formatZahl(b.flaeche));
  const [miete, setMiete] = useState(euroText(b.mieteMonat));
  const [hausgeld, setHausgeld] = useState(euroText(b.hausgeldMonat));
  const [nichtUmlagefaehig, setNichtUmlagefaehig] = useState(euroText(b.hausgeldNichtUmlagefaehigMonat));
  const [land, setLand] = useState<Bundesland>(b.bundesland);
  const [baujahr, setBaujahr] = useState(String(b.baujahr));
  const [aufzug, setAufzug] = useState(false);
  const [mitMakler, setMitMakler] = useState(false);
  const [maklerSatz, setMaklerSatz] = useState(prozentText(P_MAKLER.wert));
  const [eigenkapital, setEigenkapital] = useState(euroText(b.eigenkapital));
  const [zins, setZins] = useState(prozentText(P_ZINS.wert));
  const [tilgung, setTilgung] = useState(prozentText(P_TILGUNG.wert));
  const [offen, setOffen] = useState<string | null>(null);

  const kp = gueltig(kaufpreis, 10_000, 20_000_000);
  const hg = gueltig(hausgeld, 0, 10_000);
  const werte = {
    kaufpreis: kp,
    flaeche: gueltig(flaeche, 10, 2_000),
    miete: gueltig(miete, 50, 100_000),
    hausgeld: hg,
    nichtUmlagefaehig: gueltig(nichtUmlagefaehig, 0, hg ?? 10_000),
    baujahr: gueltig(baujahr, 1800, 2026, true),
    maklerSatz: mitMakler ? gueltig(maklerSatz, 0, 10) : 0,
    eigenkapital: gueltig(eigenkapital, 0, 20_000_000),
    zins: gueltig(zins, 0, 15),
    tilgung: gueltig(tilgung, 0.5, 20),
  };
  const alleGueltig = Object.values(werte).every((v) => v !== null);

  const eingabe: KalkulationsEingabe | null = alleGueltig
    ? {
        kaufpreis: eur(werte.kaufpreis ?? 0),
        flaeche: werte.flaeche ?? 0,
        mieteMonat: eur(werte.miete ?? 0),
        hausgeldMonat: eur(werte.hausgeld ?? 0),
        hausgeldNichtUmlagefaehigMonat: eur(werte.nichtUmlagefaehig ?? 0),
        bundesland: land,
        baujahr: werte.baujahr ?? 0,
        ...(aufzug ? { aufzug: true } : {}),
        maklerSatz: mitMakler ? prozent(werte.maklerSatz ?? 0) : null,
        eigenkapital: eur(werte.eigenkapital ?? 0),
        sollzins: prozent(werte.zins ?? 0),
        anfangstilgung: prozent(werte.tilgung ?? 0),
        zinsbindungJahre: 10,
      }
    : null;
  const schluesselEingabe = eingabe ? JSON.stringify(eingabe) : null;

  const ergebnis = useMemo(() => {
    if (!schluesselEingabe) return null;
    const e = JSON.parse(schluesselEingabe) as KalkulationsEingabe;
    const r = kalkuliere(e);
    return { r, hash: pruefsumme({ eingabe: e, kennzahlen: r.kennzahlen }) };
  }, [schluesselEingabe]);

  useEffect(() => {
    setzePruefsumme(ergebnis?.hash ?? null);
  }, [ergebnis?.hash]);
  useEffect(() => () => setzePruefsumme(null), []);

  const erklaere = (k: KennzahlDaten) => () => setOffen(k.schluessel);

  return (
    <div className="max-w-5xl">
      <h1 className="mt-0 text-3xl font-semibold">Bierdeckel &amp; Kalkulator</h1>
      <p className="max-w-prose text-muted">
        Rechne eine Wohnung in zwei Stufen durch: erst der schnelle Bierdeckel-Filter, dann die
        Vollkalkulation mit Kaufnebenkosten, Rücklagen und Cashflow. Jede Zahl zeigt dir per Klick, wie sie
        entsteht.
      </p>

      <form
        aria-label="Objekt"
        onSubmit={(e) => e.preventDefault()}
        className="grid gap-x-6 gap-y-2 rounded-lg border border-border-decor bg-surface p-4 mittel:grid-cols-2 gross:grid-cols-3"
      >
        <Zahlenfeld
          label="Kaufpreis"
          einheit="€"
          wert={kaufpreis}
          onChange={setKaufpreis}
          min={10_000}
          max={20_000_000}
        />
        <Zahlenfeld
          label="Wohnfläche"
          einheit="m²"
          wert={flaeche}
          onChange={setFlaeche}
          min={10}
          max={2_000}
        />
        <Zahlenfeld
          label="Kaltmiete pro Monat (Ist)"
          einheit="€"
          wert={miete}
          onChange={setMiete}
          min={50}
          max={100_000}
          hinweis="Nettokaltmiete laut Mietvertrag"
        />
        <Zahlenfeld
          label="Hausgeld pro Monat"
          einheit="€"
          wert={hausgeld}
          onChange={setHausgeld}
          min={0}
          max={10_000}
          hinweis="Gesamtes Hausgeld an die WEG"
        />
        <Zahlenfeld
          label="davon nicht umlagefähig"
          einheit="€"
          wert={nichtUmlagefaehig}
          onChange={setNichtUmlagefaehig}
          min={0}
          max={hg ?? 10_000}
          hinweis="z. B. Verwaltung, Erhaltungsrücklage – trägst du selbst"
        />
        <Auswahl label="Bundesland" wert={land} onChange={(v) => setLand(v as Bundesland)}>
          {BUNDESLAENDER.map((l) => (
            <option key={l} value={l}>
              {LAENDER[l]} – Grunderwerbsteuer {formatProzentAusBp(ALLE_PARAMETER[grestParameter(l)].wert, 1)}
            </option>
          ))}
        </Auswahl>
      </form>

      {ergebnis ? (
        <>
          <BierdeckelTeil r={ergebnis.r} erklaere={erklaere} />
          <section aria-labelledby="voll" className="mt-10">
            <h2 id="voll" className="text-2xl font-semibold">
              Vollkalkulation
            </h2>
            <Annahmen
              baujahr={baujahr}
              setBaujahr={setBaujahr}
              aufzug={aufzug}
              setAufzug={setAufzug}
              mitMakler={mitMakler}
              setMitMakler={setMitMakler}
              maklerSatz={maklerSatz}
              setMaklerSatz={setMaklerSatz}
              eigenkapital={eigenkapital}
              setEigenkapital={setEigenkapital}
              zins={zins}
              setZins={setZins}
              tilgung={tilgung}
              setTilgung={setTilgung}
            />
            <Vollkalkulation r={ergebnis.r} land={land} erklaere={erklaere} />
          </section>
        </>
      ) : (
        <>
          <p
            role="alert"
            className="mt-6 rounded-lg border border-critical bg-critical-tint p-4 text-critical"
          >
            ✕ Bitte prüfe die markierten Eingaben – dann rechne ich sofort weiter.
          </p>
          <Annahmen
            baujahr={baujahr}
            setBaujahr={setBaujahr}
            aufzug={aufzug}
            setAufzug={setAufzug}
            mitMakler={mitMakler}
            setMitMakler={setMitMakler}
            maklerSatz={maklerSatz}
            setMaklerSatz={setMaklerSatz}
            eigenkapital={eigenkapital}
            setEigenkapital={setEigenkapital}
            zins={zins}
            setZins={setZins}
            tilgung={tilgung}
            setTilgung={setTilgung}
          />
        </>
      )}

      <p className="mt-8 max-w-prose text-sm text-muted">
        Steuern (Cashflow nach Steuern, AfA) kommen in Sprint Z9. Für Rate und Tilgungsplan im Detail:{' '}
        <Link to="/rechner/darlehen" className="text-info underline">
          Darlehensrechner
        </Link>
        .
      </p>

      <ErklaerKarte kennzahlen={ergebnis?.r.kennzahlen ?? {}} start={offen} onClose={() => setOffen(null)} />
    </div>
  );
}

function Auswahl({
  label,
  wert,
  onChange,
  children,
}: {
  label: string;
  wert: string;
  onChange: (v: string) => void;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        value={wert}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 min-h-11 w-full rounded-md border border-border-control bg-page px-3 text-fg"
      >
        {children}
      </select>
      <div className="mt-1 min-h-5 text-sm text-muted">Satz am Tag des Erwerbs</div>
    </div>
  );
}

type Erklaere = (k: KennzahlDaten) => () => void;

function KennzahlKachel({ k, erklaere, zusatz }: { k: KennzahlDaten; erklaere: Erklaere; zusatz?: string }) {
  return (
    <Kennzahl
      titel={KENNZAHL_TEXTE[k.schluessel]?.titel ?? k.schluessel}
      wert={formatWert(k.wert, k.einheit)}
      status={k.status}
      onErklaeren={erklaere(k)}
      zusatz={
        <>
          {k.enthaeltSchaetzung ? <span>enthält Schätzung</span> : null}
          {zusatz ? <span>{zusatz}</span> : null}
        </>
      }
    />
  );
}

function BierdeckelTeil({ r, erklaere }: { r: Kalkulation; erklaere: Erklaere }) {
  const bd = r.bierdeckel;
  const a = AMPEL[bd.stufe];
  const schwelle = ALLE_PARAMETER[a.schwelle as keyof typeof ALLE_PARAMETER];
  return (
    <section aria-labelledby="bierdeckel" className="mt-8">
      <h2 id="bierdeckel" className="text-2xl font-semibold">
        Bierdeckel
      </h2>
      <div role="status" className={`flex items-start gap-3 rounded-lg border p-4 ${a.klasse}`}>
        <a.icon aria-hidden size={28} className="shrink-0" />
        <div>
          <p className="m-0 font-semibold">
            Bruttorendite {formatWert(bd.bruttorendite.wert, 'BP')}: {a.titel}
          </p>
          <p className="m-0 text-fg">{a.text}</p>
          <p className="mt-1 mb-0 flex flex-wrap items-center gap-2 text-sm text-muted">
            Schwellen 5 / 6 / 8 / 10 % <StatusBadge status={schwelle.status} quelle={schwelle.quelle} />
            Erstfilter – ersetzt keine Vollkalkulation.
          </p>
        </div>
      </div>
      <dl className="mt-4 grid gap-4 mittel:grid-cols-2 gross:grid-cols-4">
        <KennzahlKachel k={bd.bruttorendite} erklaere={erklaere} />
        <KennzahlKachel k={bd.faktor} erklaere={erklaere} zusatz="Jahreskaltmieten" />
        <KennzahlKachel k={bd.preisJeM2} erklaere={erklaere} />
        <KennzahlKachel k={bd.mieteJeM2} erklaere={erklaere} />
      </dl>
    </section>
  );
}

function Annahmen(p: {
  baujahr: string;
  setBaujahr: (v: string) => void;
  aufzug: boolean;
  setAufzug: (v: boolean) => void;
  mitMakler: boolean;
  setMitMakler: (v: boolean) => void;
  maklerSatz: string;
  setMaklerSatz: (v: string) => void;
  eigenkapital: string;
  setEigenkapital: (v: string) => void;
  zins: string;
  setZins: (v: string) => void;
  tilgung: string;
  setTilgung: (v: string) => void;
}) {
  const zinsIstBeispiel =
    gueltig(p.zins, 0, 15) !== null && prozent(gueltig(p.zins, 0, 15) ?? 0) === P_ZINS.wert;
  return (
    <form
      aria-label="Annahmen"
      onSubmit={(e) => e.preventDefault()}
      className="mt-4 grid gap-x-6 gap-y-2 rounded-lg border border-border-decor bg-surface p-4 mittel:grid-cols-2 gross:grid-cols-3"
    >
      <Zahlenfeld
        label="Baujahr"
        einheit=""
        wert={p.baujahr}
        onChange={p.setBaujahr}
        min={1800}
        max={2026}
        ganzzahl
        hinweis="bestimmt den Instandhaltungssatz"
      />
      <Zahlenfeld
        label="Eigenkapital"
        einheit="€"
        wert={p.eigenkapital}
        onChange={p.setEigenkapital}
        min={0}
        max={20_000_000}
        hinweis="Rest finanziert die Bank"
      />
      <Zahlenfeld
        label="Sollzins pro Jahr"
        einheit="%"
        wert={p.zins}
        onChange={p.setZins}
        min={0}
        max={15}
        hinweis={
          zinsIstBeispiel ? (
            <span className="flex flex-wrap items-center gap-2">
              Beispielzins Ende 2026{' '}
              <StatusBadge status={P_ZINS.status} quelle={P_ZINS.quelle} stand={P_ZINS.stand} />
            </span>
          ) : (
            'Eigene Eingabe · Zinsbindung 10 Jahre'
          )
        }
      />
      <Zahlenfeld
        label="Anfängliche Tilgung pro Jahr"
        einheit="%"
        wert={p.tilgung}
        onChange={p.setTilgung}
        min={0.5}
        max={20}
      />
      <fieldset className="m-0 min-w-0 border-0 p-0">
        <legend className="text-sm font-medium">Ausstattung und Makler</legend>
        <label className="mt-2 flex min-h-11 items-center gap-2">
          <input type="checkbox" checked={p.aufzug} onChange={(e) => p.setAufzug(e.target.checked)} />
          Haus mit Aufzug
        </label>
        <label className="flex min-h-11 items-center gap-2">
          <input type="checkbox" checked={p.mitMakler} onChange={(e) => p.setMitMakler(e.target.checked)} />
          Kauf über Makler
        </label>
      </fieldset>
      {p.mitMakler ? (
        <Zahlenfeld
          label="Maklerprovision (dein Anteil)"
          einheit="%"
          wert={p.maklerSatz}
          onChange={p.setMaklerSatz}
          min={0}
          max={10}
          hinweis={
            <span className="flex flex-wrap items-center gap-2">
              inkl. MwSt.{' '}
              <StatusBadge status={P_MAKLER.status} quelle={P_MAKLER.quelle} stand={P_MAKLER.stand} />
            </span>
          }
        />
      ) : null}
    </form>
  );
}

function WertKnopf({
  k,
  erklaere,
  monat = false,
}: {
  k: KennzahlDaten;
  erklaere: Erklaere;
  monat?: boolean;
}) {
  const titel = KENNZAHL_TEXTE[k.schluessel]?.titel ?? k.schluessel;
  const wert = monat ? formatEuro(Math.round(k.wert / 12)) : formatWert(k.wert, k.einheit);
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-label={`${titel}: ${wert}${monat ? ' pro Monat' : ''} – Wie wurde das berechnet?`}
      onClick={erklaere(k)}
      className="tabular rounded-sm text-info underline decoration-dotted underline-offset-4 hover:decoration-solid"
    >
      {wert}
    </button>
  );
}

function Vollkalkulation({ r, land, erklaere }: { r: Kalkulation; land: Bundesland; erklaere: Erklaere }) {
  const grestSatz = ALLE_PARAMETER[grestParameter(land)];
  const zeilenKnk: { k: KennzahlDaten; zusatz?: ReactNode }[] = [
    {
      k: r.knk.grest,
      zusatz: (
        <span className="flex flex-wrap items-center gap-2">
          {formatProzentAusBp(grestSatz.wert, 1)} in {LAENDER[land]}
          <StatusBadge status={grestSatz.status} quelle={grestSatz.quelle} stand={grestSatz.stand} />
        </span>
      ),
    },
    { k: r.knk.notarGrundbuch, zusatz: 'Pauschale 2 %' },
    { k: r.knk.makler },
  ];

  const kaskade: { op: string; k: KennzahlDaten; titel?: string; summe?: boolean }[] = [
    { op: '', k: r.bierdeckel.jahresmiete, titel: 'Kaltmiete' },
    { op: '−', k: r.nuKostenJahr },
    { op: '=', k: r.kaskade.operativ, summe: true },
    { op: '−', k: r.zinsJahr1, titel: 'Zinsen' },
    { op: '−', k: r.tilgungJahr1, titel: 'Tilgung' },
    { op: '=', k: r.kaskade.nachFinanzierung, summe: true },
    { op: '−', k: r.instandhaltung.jahr },
    { op: '−', k: r.mietausfall },
    { op: '=', k: r.kaskade.liquiditaetNachRuecklagen, summe: true },
  ];

  return (
    <div className="mt-6 grid gap-8">
      <section aria-labelledby="knk">
        <h3 id="knk" className="text-lg font-semibold">
          Kaufnebenkosten und Kapital
        </h3>
        <table className="w-full max-w-2xl border-collapse">
          <caption className="sr-only">Kaufnebenkosten, Gesamtkaufkosten und Darlehen</caption>
          <tbody>
            {zeilenKnk.map(({ k, zusatz }) => (
              <tr key={k.schluessel} className="border-b border-border-decor">
                <th scope="row" className="py-2 pr-4 text-left font-normal">
                  {KENNZAHL_TEXTE[k.schluessel]?.titel}
                  {zusatz ? <span className="block text-sm text-muted">{zusatz}</span> : null}
                </th>
                <td className="py-2 text-right">
                  <WertKnopf k={k} erklaere={erklaere} />
                </td>
              </tr>
            ))}
            <tr className="border-b-2 border-border-control font-semibold">
              <th scope="row" className="py-2 pr-4 text-left">
                = Kaufnebenkosten
                <span className="block text-sm font-normal text-muted">
                  {formatProzentAusBp(
                    (r.knk.summe.wert * 10_000) / (r.gesamtkosten.wert - r.knk.summe.wert),
                    1,
                  )}{' '}
                  des Kaufpreises
                </span>
              </th>
              <td className="py-2 text-right">
                <WertKnopf k={r.knk.summe} erklaere={erklaere} />
              </td>
            </tr>
            <tr className="border-b border-border-decor">
              <th scope="row" className="py-2 pr-4 text-left font-normal">
                Gesamtkaufkosten
              </th>
              <td className="py-2 text-right">
                <WertKnopf k={r.gesamtkosten} erklaere={erklaere} />
              </td>
            </tr>
            <tr className="border-b border-border-decor">
              <th scope="row" className="py-2 pr-4 text-left font-normal">
                Darlehen
                <span className="block text-sm text-muted">
                  Rate {formatEuro(r.darlehensplan?.monatsrate ?? 0)} im Monat
                </span>
              </th>
              <td className="py-2 text-right">
                <WertKnopf k={r.darlehen} erklaere={erklaere} />
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section aria-labelledby="renditen">
        <h3 id="renditen" className="text-lg font-semibold">
          Renditen
        </h3>
        <dl className="grid gap-4 mittel:grid-cols-2 gross:grid-cols-3">
          <KennzahlKachel k={r.bierdeckel.bruttorendite} erklaere={erklaere} />
          <KennzahlKachel k={r.nettorendite} erklaere={erklaere} />
          <KennzahlKachel k={r.finanzierungsquote} erklaere={erklaere} />
        </dl>
      </section>

      <section aria-labelledby="kaskade">
        <h3 id="kaskade" className="text-lg font-semibold">
          Cashflow-Kaskade (erstes Jahr)
        </h3>
        <table className="w-full max-w-2xl border-collapse">
          <caption className="sr-only">Cashflow vom Mietertrag bis zur Liquidität nach Rücklagen</caption>
          <thead>
            <tr className="border-b border-border-control text-sm text-muted">
              <th scope="col" className="w-6" />
              <th scope="col" className="py-2 text-left font-medium">
                Posten
              </th>
              <th scope="col" className="py-2 text-right font-medium">
                pro Jahr
              </th>
              <th scope="col" className="py-2 text-right font-medium">
                pro Monat
              </th>
            </tr>
          </thead>
          <tbody>
            {kaskade.map(({ op, k, titel, summe }) => (
              <tr
                key={k.schluessel}
                className={
                  summe ? 'border-b-2 border-border-control font-semibold' : 'border-b border-border-decor'
                }
              >
                <td className="py-2 text-center text-muted" aria-hidden>
                  {op}
                </td>
                <th scope="row" className={`py-2 pr-4 text-left ${summe ? '' : 'font-normal'}`}>
                  {titel ?? KENNZAHL_TEXTE[k.schluessel]?.titel}
                </th>
                <td className="py-2 text-right">
                  <WertKnopf k={k} erklaere={erklaere} />
                </td>
                <td className="py-2 pl-4 text-right">
                  <WertKnopf k={k} erklaere={erklaere} monat />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="max-w-prose text-sm text-muted">
          Rücklagen sind kein bezahlter Aufwand, sondern Geld, das du für Reparaturen und Leerstand
          beiseitelegst (Liquiditätssicht). Die Tilgung mindert den Cashflow, baut aber dein Vermögen auf.
        </p>
        <div className="mt-4 rounded-lg border border-dashed border-border-control p-4 text-muted">
          <p className="m-0 font-semibold">Cashflow nach Steuern</p>
          <p className="m-0">
            Noch leer – Steuern (AfA, Werbungskosten, Grenzsteuersatz) kommen ab Sprint Z9.
          </p>
        </div>
      </section>
    </div>
  );
}
