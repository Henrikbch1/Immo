import { formatEuro } from '@immo/ui';
import { useEffect, useRef, useState } from 'react';

export interface Reihe {
  name: string;
  /** CSS-Variable der Datenfarbe, z. B. „--series-1“. */
  farbe: string;
  /** Restschuld in Cent je Jahresende; Index 0 = Auszahlung. */
  werte: number[];
}

const RAND = { oben: 16, rechts: 16, unten: 36, links: 64 };
const HOEHE = 280;

function schoeneSchritte(max: number): number[] {
  if (max <= 0) return [0];
  const roh = max / 4;
  const zehner = 10 ** Math.floor(Math.log10(roh));
  const schritt = [1, 2, 2.5, 5, 10].map((f) => f * zehner).find((s) => s >= roh) ?? roh;
  const ticks: number[] = [];
  for (let t = 0; t <= max + schritt * 0.001; t += schritt) ticks.push(t);
  return ticks;
}

const kurzEuro = (cents: number) =>
  cents >= 100_000_000
    ? `${(cents / 100_000_000).toLocaleString('de-DE', { maximumFractionDigits: 1 })} Mio. €`
    : `${Math.round(cents / 100_000).toLocaleString('de-DE')} T€`;

/** Restschuld über die Jahre (Linie, eine y-Achse). Hover/Tastatur zeigen Werte; Tabelle ist die Alternative. */
export function RestschuldDiagramm({
  reihen,
  zinsbindungJahre,
}: {
  reihen: Reihe[];
  zinsbindungJahre: number;
}) {
  const huelle = useRef<HTMLDivElement>(null);
  const [breite, setBreite] = useState(640);
  const [aktiv, setAktiv] = useState<number | null>(null);

  useEffect(() => {
    const el = huelle.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => e && setBreite(Math.max(280, e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const jahre = Math.max(...reihen.map((r) => r.werte.length - 1), 1);
  const maxWert = Math.max(...reihen.flatMap((r) => r.werte), 1);
  const yTicks = schoeneSchritte(maxWert);
  const yMax = yTicks.at(-1) ?? maxWert;
  const innenB = breite - RAND.links - RAND.rechts;
  const innenH = HOEHE - RAND.oben - RAND.unten;
  const x = (j: number) => RAND.links + (j / jahre) * innenB;
  const y = (v: number) => RAND.oben + innenH - (v / yMax) * innenH;
  const xSchritt = jahre > 30 ? 10 : 5;
  const xTicks = Array.from({ length: Math.floor(jahre / xSchritt) + 1 }, (_, i) => i * xSchritt);

  const setzeAusZeiger = (clientX: number) => {
    const box = huelle.current?.getBoundingClientRect();
    if (!box) return;
    const j = Math.round(((clientX - box.left - RAND.links) / innenB) * jahre);
    setAktiv(Math.min(Math.max(j, 0), jahre));
  };

  return (
    <div ref={huelle} className="relative">
      {reihen.length > 1 ? (
        <ul className="m-0 mb-2 flex list-none flex-wrap gap-4 p-0 text-sm">
          {reihen.map((r, i) => (
            <li key={r.name} className="flex items-center gap-2">
              <svg width="24" height="8" aria-hidden>
                <line
                  x1="0"
                  y1="4"
                  x2="24"
                  y2="4"
                  stroke={`var(${r.farbe})`}
                  strokeWidth="2"
                  strokeDasharray={i === 1 ? '6 3' : undefined}
                />
              </svg>
              {r.name}
            </li>
          ))}
        </ul>
      ) : null}
      <div
        role="slider"
        tabIndex={0}
        aria-label="Jahr im Diagramm wählen (Pfeiltasten links/rechts)"
        aria-valuemin={0}
        aria-valuemax={jahre}
        aria-valuenow={aktiv ?? 0}
        aria-valuetext={
          aktiv === null
            ? 'Kein Jahr gewählt'
            : `${aktiv === 0 ? 'Auszahlung' : `Ende Jahr ${aktiv}`}: ${reihen
                .map((r) => `${r.name} ${formatEuro(r.werte[aktiv] ?? 0, { ganz: true })}`)
                .join(', ')}`
        }
        className="rounded-md"
        onBlur={() => setAktiv(null)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowUp') setAktiv((a) => Math.min((a ?? -1) + 1, jahre));
          else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') setAktiv((a) => Math.max((a ?? 1) - 1, 0));
          else if (e.key === 'Home') setAktiv(0);
          else if (e.key === 'End') setAktiv(jahre);
          else if (e.key === 'Escape') setAktiv(null);
          else return;
          e.preventDefault();
        }}
      >
        <svg
          width={breite}
          height={HOEHE}
          aria-hidden
          className="block touch-pan-y"
          onPointerMove={(e) => setzeAusZeiger(e.clientX)}
          onPointerDown={(e) => setzeAusZeiger(e.clientX)}
          onPointerLeave={() => setAktiv(null)}
        >
          {yTicks.map((t) => (
            <g key={t}>
              <line
                x1={RAND.links}
                x2={breite - RAND.rechts}
                y1={y(t)}
                y2={y(t)}
                stroke="var(--border-decor)"
              />
              <text
                x={RAND.links - 8}
                y={y(t)}
                dy="0.32em"
                textAnchor="end"
                fontSize="12"
                fill="var(--text-muted)"
              >
                {kurzEuro(t)}
              </text>
            </g>
          ))}
          {xTicks.map((t) => (
            <text key={t} x={x(t)} y={HOEHE - 12} textAnchor="middle" fontSize="12" fill="var(--text-muted)">
              {t === 0 ? 'Start' : `${t}. J.`}
            </text>
          ))}
          {zinsbindungJahre <= jahre ? (
            <g>
              <line
                x1={x(zinsbindungJahre)}
                x2={x(zinsbindungJahre)}
                y1={RAND.oben}
                y2={RAND.oben + innenH}
                stroke="var(--text-muted)"
                strokeDasharray="3 3"
              />
              <text x={x(zinsbindungJahre) + 6} y={RAND.oben + 12} fontSize="12" fill="var(--text-muted)">
                Ende Zinsbindung
              </text>
            </g>
          ) : null}
          {reihen.map((r, i) => (
            <polyline
              key={r.name}
              fill="none"
              stroke={`var(${r.farbe})`}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeDasharray={i === 1 ? '6 3' : undefined}
              points={r.werte.map((v, j) => `${x(j)},${y(v)}`).join(' ')}
            />
          ))}
          {aktiv !== null ? (
            <g>
              <line
                x1={x(aktiv)}
                x2={x(aktiv)}
                y1={RAND.oben}
                y2={RAND.oben + innenH}
                stroke="var(--text-muted)"
              />
              {reihen.map((r) =>
                r.werte[aktiv] !== undefined ? (
                  <circle
                    key={r.name}
                    cx={x(aktiv)}
                    cy={y(r.werte[aktiv] ?? 0)}
                    r="4.5"
                    fill={`var(${r.farbe})`}
                    stroke="var(--bg-page)"
                    strokeWidth="2"
                  />
                ) : null,
              )}
            </g>
          ) : null}
        </svg>
      </div>
      {aktiv !== null ? (
        <div
          role="status"
          className="pointer-events-none absolute top-8 rounded-md border border-border-decor bg-raised px-3 py-2 text-sm shadow-lg"
          style={x(aktiv) > breite / 2 ? { right: breite - x(aktiv) + 12 } : { left: x(aktiv) + 12 }}
        >
          <div className="font-semibold">{aktiv === 0 ? 'Auszahlung' : `Ende Jahr ${aktiv}`}</div>
          {reihen.map((r) => (
            <div key={r.name} className="tabular flex justify-between gap-4">
              <span className="text-muted">{reihen.length > 1 ? r.name : 'Restschuld'}</span>
              <span>{formatEuro(r.werte[aktiv] ?? 0, { ganz: true })}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
