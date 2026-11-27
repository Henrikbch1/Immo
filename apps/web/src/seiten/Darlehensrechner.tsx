import {
  berechneDarlehen,
  type Darlehensergebnis,
  eur,
  jahresuebersicht,
  PARAMETER,
  prozent,
} from '@immo/sim-core';
import { formatEuro, formatJahreMonate, formatProzentAusBp, formatZahl } from '@immo/ui';
import { useMemo, useState } from 'react';
import { Kennzahl } from '../komponenten/Kennzahl.tsx';
import { type Reihe, RestschuldDiagramm } from '../komponenten/RestschuldDiagramm.tsx';
import { StatusBadge } from '../komponenten/StatusBadge.tsx';
import { gueltig, Zahlenfeld } from '../komponenten/Zahlenfeld.tsx';

const P_ZINS = PARAMETER['darlehen.sollzins.beispiel2026'];
const P_TILGUNG = PARAMETER['darlehen.anfangstilgung.standard'];
const P_BINDUNG = PARAMETER['darlehen.zinsbindung.standard'];
const P_SONDER = PARAMETER['darlehen.sondertilgung.zeitpunkt'];
const P_VERRECHNUNG = PARAMETER['darlehen.verrechnung'];

const alsProzentText = (bp: number) => formatZahl(bp / 100, 1);

/** Darlehensrechner (Sprint Z1): Annuität, Tilgungsplan, Sondertilgung, Restschuld. */
export function Darlehensrechner() {
  const [betrag, setBetrag] = useState('300.000');
  const [zins, setZins] = useState(alsProzentText(P_ZINS.wert));
  const [tilgung, setTilgung] = useState(alsProzentText(P_TILGUNG.wert));
  const [bindung, setBindung] = useState(String(P_BINDUNG.wert));
  const [sonder, setSonder] = useState('0');

  const eingabe = {
    betrag: gueltig(betrag, 1_000, 10_000_000),
    zins: gueltig(zins, 0, 15),
    tilgung: gueltig(tilgung, 0.5, 20),
    bindung: gueltig(bindung, 1, 30, true),
    sonder: gueltig(sonder, 0, 1_000_000),
  };
  const alleGueltig = Object.values(eingabe).every((v) => v !== null);

  const ergebnis = useMemo(() => {
    if (!alleGueltig) return null;
    const basis = {
      betrag: eur(eingabe.betrag ?? 0),
      sollzins: prozent(eingabe.zins ?? 0),
      anfangstilgung: prozent(eingabe.tilgung ?? 0),
      zinsbindungJahre: eingabe.bindung ?? 10,
    };
    const ohne = berechneDarlehen(basis);
    const mit =
      (eingabe.sonder ?? 0) > 0
        ? berechneDarlehen({ ...basis, sondertilgungJahr: eur(eingabe.sonder ?? 0) })
        : null;
    return { ohne, mit };
  }, [alleGueltig, eingabe.betrag, eingabe.zins, eingabe.tilgung, eingabe.bindung, eingabe.sonder]);

  const zinsIstBeispiel = eingabe.zins !== null && prozent(eingabe.zins) === P_ZINS.wert;

  return (
    <div className="max-w-5xl">
      <h1 className="mt-0 text-3xl font-semibold">Darlehensrechner</h1>
      <p className="max-w-prose text-muted">
        Annuitätendarlehen mit monatlicher Zinsverrechnung: Rate, Tilgungsplan, Restschuld am Ende der
        Zinsbindung und Wirkung einer jährlichen Sondertilgung. Alle Werte gelten bei unverändertem Zins.
      </p>

      <form
        aria-label="Eingaben"
        onSubmit={(e) => e.preventDefault()}
        className="grid gap-x-6 gap-y-2 rounded-lg border border-border-decor bg-surface p-4 mittel:grid-cols-2 gross:grid-cols-3"
      >
        <Zahlenfeld
          label="Darlehensbetrag"
          einheit="€"
          wert={betrag}
          onChange={setBetrag}
          min={1_000}
          max={10_000_000}
        />
        <Zahlenfeld
          label="Sollzins pro Jahr"
          einheit="%"
          wert={zins}
          onChange={setZins}
          min={0}
          max={15}
          hinweis={
            zinsIstBeispiel ? (
              <span className="flex flex-wrap items-center gap-2">
                Beispielzins Ende 2026{' '}
                <StatusBadge status={P_ZINS.status} quelle={P_ZINS.quelle} stand={P_ZINS.stand} />
              </span>
            ) : (
              'Eigene Eingabe'
            )
          }
        />
        <Zahlenfeld
          label="Anfängliche Tilgung pro Jahr"
          einheit="%"
          wert={tilgung}
          onChange={setTilgung}
          min={0.5}
          max={20}
          hinweis="Anteil des Darlehens, der im ersten Jahr getilgt wird"
        />
        <Zahlenfeld
          label="Zinsbindung"
          einheit="Jahre"
          wert={bindung}
          onChange={setBindung}
          min={1}
          max={30}
          ganzzahl
        />
        <Zahlenfeld
          label="Sondertilgung pro Jahr"
          einheit="€"
          wert={sonder}
          onChange={setSonder}
          min={0}
          max={1_000_000}
          hinweis={
            <span className="flex flex-wrap items-center gap-2">
              jeweils am Ende eines Darlehensjahres{' '}
              <StatusBadge status={P_SONDER.status} quelle={P_SONDER.quelle} />
            </span>
          }
        />
      </form>

      {ergebnis ? (
        <Ergebnis ohne={ergebnis.ohne} mit={ergebnis.mit} bindung={eingabe.bindung ?? 10} />
      ) : (
        <p role="alert" className="mt-6 rounded-lg border border-critical bg-critical-tint p-4 text-critical">
          ✕ Bitte prüfe die markierten Eingaben – dann rechne ich sofort weiter.
        </p>
      )}

      <p className="mt-8 max-w-prose text-sm text-muted">
        Rechenweg: Monatsrate = Darlehen × (Sollzins + anfängliche Tilgung) ÷ 12. Jeden Monat Zins =
        Restschuld × Sollzins ÷ 12, Tilgung = Rate − Zins (Verrechnung monatlich nachschüssig,{' '}
        <StatusBadge
          status={P_VERRECHNUNG.status}
          quelle={P_VERRECHNUNG.quelle}
          stand={P_VERRECHNUNG.stand}
        />
        ). Sollzins ≈ Effektivzins, ohne Kreditnebenkosten. Kein Angebot einer Bank, keine Beratung.
      </p>
    </div>
  );
}

function startschuld(r: Darlehensergebnis): number {
  const erste = r.plan[0];
  return erste ? erste.restschuld + erste.tilgung + erste.sondertilgung : 0;
}

function Ergebnis({
  ohne,
  mit,
  bindung,
}: {
  ohne: Darlehensergebnis;
  mit: Darlehensergebnis | null;
  bindung: number;
}) {
  const haupt = mit ?? ohne;
  const jahreOhne = jahresuebersicht(ohne.plan);
  const jahreMit = mit ? jahresuebersicht(mit.plan) : null;
  const reihe = (name: string, farbe: string, r: Darlehensergebnis, jahre: typeof jahreOhne): Reihe => ({
    name,
    farbe,
    werte: [
      r.plan.length ? r.plan[0]!.restschuld + r.plan[0]!.tilgung + r.plan[0]!.sondertilgung : 0,
      ...jahre.map((j) => j.restschuld),
    ],
  });
  const reihen =
    jahreMit && mit
      ? [
          reihe('Ohne Sondertilgung', '--series-1', ohne, jahreOhne),
          reihe('Mit Sondertilgung', '--series-2', mit, jahreMit),
        ]
      : [reihe('Restschuld', '--series-1', ohne, jahreOhne)];

  const laufzeitText = (r: Darlehensergebnis) =>
    r.laufzeitMonate === null ? 'nicht absehbar (über 100 Jahre)' : formatJahreMonate(r.laufzeitMonate);
  const ersparnis =
    mit && ohne.laufzeitMonate !== null && mit.laufzeitMonate !== null
      ? ohne.laufzeitMonate - mit.laufzeitMonate
      : null;

  return (
    <>
      <h2 className="mt-8 text-xl font-semibold">Ergebnis</h2>
      {haupt.monatsrate <= (haupt.plan[0]?.zins ?? 0) ? (
        <p role="alert" className="rounded-lg border border-warning bg-warning-tint p-3 text-warning">
          ⚠ Die Rate deckt kaum die Zinsen – das Darlehen wird so praktisch nicht getilgt.
        </p>
      ) : null}
      <dl className="m-0 grid gap-3 mittel:grid-cols-2 gross:grid-cols-4">
        <Kennzahl
          titel="Monatsrate"
          wert={formatEuro(haupt.monatsrate)}
          status="ABGELEITET"
          quelle="berechnet aus deinen Eingaben"
          zusatz={<span>{formatEuro(haupt.jahresrate, { ganz: true })} im Jahr</span>}
        />
        <Kennzahl
          titel={`Restschuld nach ${bindung} Jahren`}
          wert={formatEuro(haupt.restschuldEndeZinsbindung, { ganz: true })}
          status="ABGELEITET"
          quelle="Tilgungsplan, monatlich"
          zusatz={
            mit ? (
              <span>ohne Sondertilgung {formatEuro(ohne.restschuldEndeZinsbindung, { ganz: true })}</span>
            ) : null
          }
        />
        <Kennzahl
          titel={`Zinsen in ${bindung} Jahren`}
          wert={formatEuro(haupt.zinsenInZinsbindung, { ganz: true })}
          status="ABGELEITET"
          quelle="Summe der Monatszinsen"
          zusatz={
            <span>
              Tilgung{' '}
              {formatEuro(haupt.tilgungInZinsbindung + haupt.sondertilgungInZinsbindung, { ganz: true })}
            </span>
          }
        />
        <Kennzahl
          titel="Schuldenfrei nach"
          wert={laufzeitText(haupt)}
          status="GESCHÄTZT"
          quelle="Annahme: Zins bleibt nach der Zinsbindung gleich"
          zusatz={
            ersparnis !== null && ersparnis > 0 ? (
              <span>
                {formatJahreMonate(ersparnis)} früher,{' '}
                {formatEuro(ohne.zinsenGesamt - (mit?.zinsenGesamt ?? 0), { ganz: true })} weniger Zinsen
              </span>
            ) : null
          }
        />
      </dl>

      <section aria-labelledby="verlauf" className="mt-8">
        <h2 id="verlauf" className="text-xl font-semibold">
          Restschuld im Zeitverlauf
        </h2>
        <RestschuldDiagramm reihen={reihen} zinsbindungJahre={bindung} />
      </section>

      <section aria-labelledby="plan" className="mt-8">
        <h2 id="plan" className="text-xl font-semibold">
          Tilgungsplan nach Jahren{mit ? ' (mit Sondertilgung)' : ''}
        </h2>
        <p className="text-sm text-muted">
          Anschluss nach {bindung} Jahren: Jeder Prozentpunkt mehr Zins kostet auf die Restschuld rund{' '}
          {formatEuro(Math.round(haupt.restschuldEndeZinsbindung / 100), { ganz: true })} im Jahr mehr (
          {formatProzentAusBp(100, 0)} von {formatEuro(haupt.restschuldEndeZinsbindung, { ganz: true })}).
        </p>
        <div className="max-h-[480px] overflow-auto rounded-lg border border-border-decor" tabIndex={-1}>
          <table className="tabular w-full border-collapse text-sm">
            <caption className="sr-only">
              Tilgungsplan: Zinsen, Tilgung, Sondertilgung und Restschuld je Darlehensjahr
            </caption>
            <thead className="sticky top-0 bg-surface">
              <tr>
                {(mit
                  ? ['Jahr', 'Zinsen', 'Tilgung', 'Sondertilgung', 'Restschuld']
                  : ['Jahr', 'Zinsen', 'Tilgung', 'Restschuld']
                ).map((t) => (
                  <th
                    key={t}
                    scope="col"
                    className="border-b border-border-decor px-3 py-2 text-right font-semibold first:text-left"
                  >
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(jahreMit ?? jahreOhne).map((j) => (
                <tr key={j.jahr} className={j.jahr === bindung ? 'bg-info-tint font-semibold' : ''}>
                  <th scope="row" className="border-b border-border-decor px-3 py-2 text-left font-normal">
                    {j.jahr}
                    {j.jahr === bindung ? <span className="ml-2 text-xs">Ende Zinsbindung</span> : null}
                  </th>
                  <td className="border-b border-border-decor px-3 py-2 text-right">
                    {formatEuro(j.zins, { ganz: true })}
                  </td>
                  <td className="border-b border-border-decor px-3 py-2 text-right">
                    {formatEuro(j.tilgung, { ganz: true })}
                  </td>
                  {mit ? (
                    <td className="border-b border-border-decor px-3 py-2 text-right">
                      {formatEuro(j.sondertilgung, { ganz: true })}
                    </td>
                  ) : null}
                  <td className="border-b border-border-decor px-3 py-2 text-right">
                    {formatEuro(j.restschuld, { ganz: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
