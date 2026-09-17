export const NIVELES_ORDER = [
  "Tuck Trainer",
  "Advanced Tuck Trainer",
  "Tuck",
  "Tuck Hold",
  "Advanced Tuck",
  "Advanced Tuck Hold",
  "One Leg",
  "Straddle",
  "Half Lay",
  "Full",
];

export function nivelToValue(s: string): number | null {
  const t = s.toLowerCase().trim();
  if (!t) return null;
  const idx = NIVELES_ORDER.findIndex((n) => t.includes(n.toLowerCase()));
  return idx >= 0 ? idx + 1 : null;
}

export function parseNumber(s: unknown): number | null {
  if (s == null || s === "") return null;
  const n = typeof s === "number" ? s : Number(String(s).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export type ProgressRow = {
  fecha: string;
  peso_corporal: number | null;
  tests: Record<string, unknown>;
};

export function weightSeries(rows: ProgressRow[]) {
  const sorted = [...rows]
    .filter((r) => r.peso_corporal != null)
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
  return {
    labels: sorted.map((r) => r.fecha),
    values: sorted.map((r) => Number(r.peso_corporal)),
  };
}

export function testSeries(rows: ProgressRow[]) {
  const keys = new Set<string>();
  for (const r of rows) {
    if (r.tests) for (const k of Object.keys(r.tests)) keys.add(k);
  }

  const series = [...keys].map((key) => {
    const points = [...rows]
      .sort((a, b) => a.fecha.localeCompare(b.fecha))
      .flatMap((r) => {
        const raw = (r.tests ?? {})[key];
        if (raw == null || raw === "") return [];
        const num = parseNumber(raw);
        if (num !== null) return [{ fecha: r.fecha, value: num, label: String(raw) }];
        const nivel = nivelToValue(String(raw));
        if (nivel !== null) return [{ fecha: r.fecha, value: nivel, label: String(raw) }];
        return [];
      });
    return { key, points };
  });

  return series.filter((s) => s.points.length > 0);
}

export type SerieRaw = { reps?: unknown; peso?: unknown };

export function bestRepsSeries(logs: { fecha: string; series_data: SerieRaw[] }[]) {
  const byDate = aggregate(logs);
  const data = [...byDate.entries()]
    .map(([fecha, series]) => ({
      fecha,
      value: best(series, (s) => parseNumber(s.reps)),
    }))
    .filter((d) => d.value != null);
  return {
    labels: data.map((d) => d.fecha),
    values: data.map((d) => d.value as number),
    best: data.reduce(
      (acc: { value: number; fecha: string } | null, d) =>
        !acc || (d.value as number) > acc.value
          ? { value: d.value as number, fecha: d.fecha }
          : acc,
      null
    ),
  };
}

export function bestWeightSeries(logs: { fecha: string; series_data: SerieRaw[] }[]) {
  const byDate = aggregate(logs);
  const data = [...byDate.entries()]
    .map(([fecha, series]) => ({
      fecha,
      value: best(series, (s) => parseWeight(s.peso)),
    }))
    .filter((d) => d.value != null);
  return {
    labels: data.map((d) => d.fecha),
    values: data.map((d) => d.value as number),
    best: data.reduce(
      (acc: { value: number; fecha: string } | null, d) =>
        !acc || (d.value as number) > acc.value
          ? { value: d.value as number, fecha: d.fecha }
          : acc,
      null
    ),
  };
}

export function sessionResumen(
  logs: { fecha: string; series_data: SerieRaw[] }[]
) {
  const byDate = aggregate(logs);
  const rows = [...byDate.entries()].map(([fecha, series]) => ({
    fecha,
    reps: best(series, (s) => parseNumber(s.reps)),
    peso: best(series, (s) => parseWeight(s.peso)),
  }));
  rows.sort((a, b) => b.fecha.localeCompare(a.fecha));
  return rows;
}

function aggregate(logs: { fecha: string; series_data: SerieRaw[] }[]) {
  const byDate = new Map<string, SerieRaw[]>();
  for (const log of logs) {
    const list = byDate.get(log.fecha) ?? [];
    list.push(...(log.series_data ?? []));
    byDate.set(log.fecha, list);
  }
  return byDate;
}

function best(series: SerieRaw[], pick: (s: SerieRaw) => number | null): number | null {
  let bestV: number | null = null;
  for (const s of series) {
    const v = pick(s);
    if (v != null && (bestV == null || v > bestV)) bestV = v;
  }
  return bestV;
}

export function parseWeight(raw: unknown): number | null {
  if (raw == null) return null;
  const s = String(raw)
    .replace(/[,\s]/g, (m) => (m === "," ? "." : ""))
    .replace(/[^\d.-]/g, "");
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}