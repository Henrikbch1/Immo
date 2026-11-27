import { ALLE_PARAMETER, type Kennzahl, type ParameterId } from '@immo/sim-core';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { formatWert, KENNZAHL_TEXTE, titelVon, VEREINFACHUNG_TEXTE, ZEITBEZUG } from '../texte/kennzahlen.ts';
import { StatusBadge } from './StatusBadge.tsx';

const MAX_PFAD = 5;

/**
 * Erklär-Karte O-01 (einfache Form, Z2): Ebene 1 Aussage, Ebene 2 Herleitung mit eingesetzten Werten
 * (Posten sind antippbar und ersetzen den Karteninhalt – nie gestapelt), Ebene 3 Grundlage.
 * Natives <dialog>: Fokus hinein und zurück zum Auslöser; Esc geht eine Pfadstufe zurück, dann schließt es.
 */
export function ErklaerKarte({
  kennzahlen,
  start,
  onClose,
}: {
  kennzahlen: Readonly<Record<string, Kennzahl>>;
  start: string | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [pfad, setPfad] = useState<string[]>([]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (start) {
      setPfad([start]);
      if (!d.open) d.showModal();
    } else if (d.open) {
      d.close();
    }
  }, [start]);

  const aktuell = pfad.at(-1);
  const k = aktuell ? kennzahlen[aktuell] : undefined;

  return (
    <dialog
      ref={ref}
      aria-labelledby="erklaer-titel"
      onClose={onClose}
      onCancel={(e) => {
        if (pfad.length > 1) {
          e.preventDefault();
          setPfad((p) => p.slice(0, -1));
        }
      }}
      className="fixed inset-x-0 bottom-0 top-auto m-0 max-h-[85vh] w-full max-w-none overflow-y-auto rounded-t-lg border border-border-decor bg-raised p-0 text-fg shadow-lg backdrop:bg-fg/30 mittel:inset-0 mittel:m-auto mittel:max-w-[440px] mittel:rounded-lg"
    >
      {k ? (
        <Inhalt
          k={k}
          kennzahlen={kennzahlen}
          pfad={pfad}
          setPfad={setPfad}
          schliessen={() => ref.current?.close()}
        />
      ) : null}
    </dialog>
  );
}

function Inhalt({
  k,
  kennzahlen,
  pfad,
  setPfad,
  schliessen,
}: {
  k: Kennzahl;
  kennzahlen: Readonly<Record<string, Kennzahl>>;
  pfad: string[];
  setPfad: (p: string[]) => void;
  schliessen: () => void;
}) {
  const text = KENNZAHL_TEXTE[k.schluessel];
  const opZeichen = (i: number, op: string) => (i === 0 && (op === '+' || op === '×') ? '' : op);
  const parameter = [...new Set(k.parameter)];

  return (
    <div className="p-4">
      {pfad.length > 1 ? (
        <nav aria-label="Pfad" className="mb-2 text-sm">
          <ol className="m-0 flex list-none flex-wrap gap-1 p-0 text-muted">
            {pfad.map((s, i) => (
              <li key={`${s}-${i}`} className="flex items-center gap-1">
                {i > 0 ? <span aria-hidden>›</span> : null}
                {i < pfad.length - 1 ? (
                  <button
                    type="button"
                    className="text-info underline"
                    onClick={() => setPfad(pfad.slice(0, i + 1))}
                  >
                    {titelVon(s)}
                  </button>
                ) : (
                  <span aria-current="page">{titelVon(s)}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <div className="flex items-start gap-2">
        <h2 id="erklaer-titel" className="m-0 flex-1 text-lg font-semibold">
          {text?.titel ?? k.schluessel}
        </h2>
        <button
          type="button"
          onClick={schliessen}
          className="-m-2 rounded-md p-2 text-muted hover:text-fg"
          aria-label="Erklärung schließen"
        >
          <X aria-hidden size={20} />
        </button>
      </div>

      {/* Ebene 1 */}
      <p className="mt-2 mb-1">
        <span className="tabular text-2xl font-semibold">{formatWert(k.wert, k.einheit)}</span>{' '}
        <span className="text-sm text-muted">{ZEITBEZUG[k.zeitbezug]}</span>
      </p>
      <p className="mt-0 flex flex-wrap items-center gap-2 text-sm">
        <StatusBadge status={k.status} />
        {k.enthaeltSchaetzung ? (
          <span className="text-warning">enthält mindestens einen geschätzten Wert (siehe Grundlage)</span>
        ) : null}
      </p>
      {text ? <p className="max-w-prose">{text.satz(k, kennzahlen)}</p> : null}

      {/* Ebene 2 */}
      <details open className="mt-3 rounded-md border border-border-decor">
        <summary className="cursor-pointer px-3 py-2 font-medium">Herleitung ansehen</summary>
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">Rechenweg mit eingesetzten Werten</caption>
          <tbody>
            {k.herleitung.map((p, i) => {
              const verschachtelt = p.schluessel in kennzahlen && pfad.length < MAX_PFAD;
              const param = p.parameter ? ALLE_PARAMETER[p.parameter] : undefined;
              return (
                <tr key={`${p.schluessel}-${i}`} className="border-t border-border-decor">
                  <td className="w-6 py-1.5 pl-3 text-center text-muted" aria-hidden>
                    {opZeichen(i, p.op)}
                  </td>
                  <td className="py-1.5 pr-2">
                    <span className="sr-only">{opText(i, p.op)}</span>
                    {verschachtelt ? (
                      <button
                        type="button"
                        className="text-left text-info underline"
                        onClick={() => setPfad([...pfad, p.schluessel])}
                      >
                        {titelVon(p.schluessel)} <span aria-hidden>›</span>
                      </button>
                    ) : (
                      titelVon(p.schluessel)
                    )}
                    {param ? (
                      <span className="ml-2 inline-block align-middle">
                        <StatusBadge status={param.status} quelle={param.quelle} stand={param.stand} />
                      </span>
                    ) : null}
                  </td>
                  <td className="tabular py-1.5 pr-3 text-right whitespace-nowrap">
                    {formatWert(p.wert, p.einheit)}
                  </td>
                </tr>
              );
            })}
            <tr className="border-t-2 border-border-control font-semibold">
              <td className="py-1.5 pl-3 text-center" aria-hidden>
                =
              </td>
              <td className="py-1.5 pr-2">
                {text?.titel ?? k.schluessel}
                {k.rundung === 'euroAb' ? (
                  <span className="ml-1 font-normal text-muted">(auf volle Euro abgerundet)</span>
                ) : null}
              </td>
              <td className="tabular py-1.5 pr-3 text-right whitespace-nowrap">
                {formatWert(k.wert, k.einheit)}
              </td>
            </tr>
          </tbody>
        </table>
      </details>

      {/* Ebene 3 */}
      {parameter.length > 0 || k.vereinfachungen.length > 0 ? (
        <details className="mt-3 rounded-md border border-border-decor">
          <summary className="cursor-pointer px-3 py-2 font-medium">Grundlage</summary>
          <div className="px-3 pb-3 text-sm">
            {parameter.map((id) => (
              <ParameterInfo key={id} id={id} />
            ))}
            {k.vereinfachungen.map((v) => (
              <p key={v} className="mb-0 max-w-prose">
                {VEREINFACHUNG_TEXTE[v] ?? v}
              </p>
            ))}
          </div>
        </details>
      ) : null}
    </div>
  );
}

function opText(i: number, op: string): string {
  if (i === 0) return '';
  return op === '+' ? 'plus ' : op === '−' ? 'minus ' : op === '×' ? 'mal ' : 'geteilt durch ';
}

function ParameterInfo({ id }: { id: ParameterId }) {
  const p = ALLE_PARAMETER[id];
  return (
    <div className="mt-2">
      <p className="m-0 flex flex-wrap items-center gap-2 font-medium">
        {p.titel} <StatusBadge status={p.status} />
      </p>
      <p className="m-0 text-muted">
        Quelle: {p.quelle} · Stand {p.stand}
        {p.gueltigAb ? ` · gültig ab ${p.gueltigAb}` : ''}
      </p>
      {p.hinweis ? <p className="m-0 text-muted">{p.hinweis}</p> : null}
    </div>
  );
}
