"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import type { FilterOption, WeeklyRow } from "@/lib/analytics";

const EMERALD = "#34d399";
const AMBER = "#fbbf24";
const ZINC_TEXT = "#71717a";
const ZINC_GRID = "#27272a";

type Props = {
  filters: FilterOption[];
  rowsByFilter: Record<string, WeeklyRow[]>;
};

function fmt(n: number | null | undefined, decimals = 0) {
  if (n == null) return "—";
  return n.toLocaleString("es-AR", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;
  const row: WeeklyRow = payload[0]?.payload;
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm shadow-xl">
      <p className="font-bold text-white">{row.label}</p>
      {row.sesiones !== undefined && (
        <p className="mt-1 text-zinc-300">
          Sesiones: <span className="font-bold">{row.sesiones}</span>
        </p>
      )}
      {row.volumen !== undefined && (
        <p className="text-zinc-300">
          Volumen: <span className="font-bold text-emerald-300">{fmt(row.volumen)}</span>
        </p>
      )}
      {row.rpe != null && (
        <p className="text-zinc-300">
          Intensidad: <span className="font-bold text-amber-300">{fmt(row.rpe)}</span>/10
        </p>
      )}
      {row.rirProm != null && (
        <p className="text-zinc-300">
          RIR promedio: <span className="font-bold text-zinc-100">{fmt(row.rirProm, 1)}</span>
        </p>
      )}
      {row.pct1rmProm != null && (
        <p className="text-zinc-300">
          %1RM (Epley): <span className="font-bold text-zinc-100">{fmt(row.pct1rmProm, 1)}%</span>
        </p>
      )}
      {row.carga != null && (
        <p className="text-zinc-300">
          Carga: <span className="font-bold text-zinc-100">{fmt(row.carga)}</span>
        </p>
      )}
    </div>
  );
}

export function LoadAnalysis({ filters, rowsByFilter }: Props) {
  const [filter, setFilter] = useState(filters[0]?.value ?? "todos");
  const rows = rowsByFilter[filter] ?? [];

  const resumen = useMemo(() => {
    if (rows.length === 0) return null;
    const ultimo = rows[rows.length - 1];
    const previo = rows[rows.length - 2];
    let tendencia: { dir: "sube" | "baja" | "sostiene"; pct: number } | null = null;
    if (previo && previo.carga > 0) {
      const pct = ((ultimo.carga - previo.carga) / previo.carga) * 100;
      const dir = pct > 15 ? "sube" : pct < -15 ? "baja" : "sostiene";
      tendencia = { dir, pct: Math.round(Math.abs(pct)) };
    }
    return { ultimo, tendencia };
  }, [rows]);

  if (rows.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full max-w-xs rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-zinc-500"
        >
          {filters.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20 p-10 text-center">
          <p className="font-bold">Todavía no hay datos suficientes</p>
          <p className="mt-1 text-sm text-zinc-400">
            Registrá tu primera sesión y acá vas a ver tu volumen, intensidad y
            carga por semana.
          </p>
        </div>
      </div>
    );
  }

  const onlyExpanded = rows.length > 1 ? rows : rows;

  return (
    <div className="flex flex-col gap-6">
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-zinc-500 sm:max-w-xs"
      >
        {filters.map((f) => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>

      {resumen ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <ResumenCard
            titulo="Carga última semana"
            valor={fmt(resumen.ultimo.carga)}
            detalle={`${resumen.ultimo.sesiones} sesiones`}
          />
          <ResumenCard
            titulo="Volumen último"
            valor={fmt(resumen.ultimo.volumen)}
            detalle="unidades relativas (kg×reps o dificultad×reps)"
          />
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
            <p className="text-xs font-medium text-zinc-500">
              Tendencia vs. semana previa
            </p>
            {resumen.tendencia ? (
              <p
                className={`mt-2 text-2xl font-black ${
                  resumen.tendencia.dir === "sube"
                    ? "text-amber-300"
                    : resumen.tendencia.dir === "baja"
                      ? "text-emerald-300"
                      : "text-white"
                }`}
              >
                {resumen.tendencia.dir === "sube"
                  ? "Carga en alza"
                  : resumen.tendencia.dir === "baja"
                    ? "Carga en baja"
                    : "Estable"}{" "}
                <span className="text-base">({resumen.tendencia.pct}%)</span>
              </p>
            ) : (
              <p className="mt-2 text-xl font-bold text-zinc-300">
                Necesitás 2 semanas
              </p>
            )}
            <p className="mt-1 text-xs text-zinc-500">
              Bajas repentinas = estancamiento o descarga · subidas grandes =
              posible sobrecarga
            </p>
          </div>
        </div>
      ) : null}

      <ChartCard
        titulo="Volumen total por semana"
        detalle="Σ series × reps × carga (kg) o × dificultad (1-10)"
      >
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={onlyExpanded} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid stroke={ZINC_GRID} vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: ZINC_TEXT }} />
            <YAxis tick={{ fontSize: 11, fill: ZINC_TEXT }} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="volumen" fill={EMERALD} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        titulo="Intensidad promedio por semana"
        detalle="RPE 0-10 basada en RIR (10 − RIR). Con carga y sin RIR, %1RM por Epley /10."
      >
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={onlyExpanded} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid stroke={ZINC_GRID} vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: ZINC_TEXT }} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: ZINC_TEXT }} />
            <Tooltip content={<ChartTooltip />} />
            <Line
              type="monotone"
              dataKey="rpe"
              stroke={AMBER}
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: AMBER }}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="mt-2 text-xs text-zinc-500">
          Pasá el mouse o el dedo por los puntos para ver RIR promedio y %1RM,
          cuando estén registrados.
        </p>
      </ChartCard>

      <ChartCard
        titulo="Volumen vs. Intensidad"
        detalle="Clave de periodización: cuando la intensidad sube, el volumen debería bajar y viceversa."
      >
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={onlyExpanded} margin={{ top: 8, right: -10, left: -16, bottom: 0 }}>
            <CartesianGrid stroke={ZINC_GRID} vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: ZINC_TEXT }} />
            <YAxis yAxisId="vol" tick={{ fontSize: 11, fill: ZINC_TEXT }} />
            <YAxis
              yAxisId="rpe"
              orientation="right"
              domain={[0, 10]}
              tick={{ fontSize: 11, fill: ZINC_TEXT }}
            />
            <Tooltip content={<ChartTooltip />} />
            <Bar yAxisId="vol" dataKey="volumen" fill={EMERALD} radius={[6, 6, 0, 0]} />
            <Line
              yAxisId="rpe"
              type="monotone"
              dataKey="rpe"
              stroke={AMBER}
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: AMBER }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        titulo="Carga de entrenamiento semanal"
        detalle="Volumen × intensidad promedio. Indica cuánto estímulo real tuvo la semana."
      >
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={onlyExpanded} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid stroke={ZINC_GRID} vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: ZINC_TEXT }} />
            <YAxis tick={{ fontSize: 11, fill: ZINC_TEXT }} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="carga" radius={[6, 6, 0, 0]}>
              {rows.map((r, i) => {
                const prev = rows[i - 1];
                let fill = "#facc15";
                if (prev) {
                  if (r.carga > prev.carga * 1.25) fill = "#f87171";
                  else if (r.carga < prev.carga * 0.75) fill = "#818cf8";
                }
                return <Cell key={r.key} fill={fill} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ChartCard({
  titulo,
  detalle,
  children,
}: {
  titulo: string;
  detalle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
      <h3 className="text-base font-bold">{titulo}</h3>
      {detalle ? <p className="mt-0.5 text-xs text-zinc-500">{detalle}</p> : null}
      <div className="mt-4">{children}</div>
    </div>
  );
}

function ResumenCard({
  titulo,
  valor,
  detalle,
}: {
  titulo: string;
  valor: string;
  detalle?: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
      <p className="text-xs font-medium text-zinc-500">{titulo}</p>
      <p className="mt-2 text-3xl font-black">{valor}</p>
      {detalle ? <p className="mt-1 text-xs text-zinc-500">{detalle}</p> : null}
    </div>
  );
}