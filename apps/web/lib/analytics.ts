import { parseNumber, parseWeight } from "@/lib/progress";

export type SerieRow = {
  serie?: number;
  reps?: unknown;
  peso?: unknown;
  rir?: number | null;
  descanso?: number | null;
};

export type WorkLogRaw = {
  workout_exercise_id: string;
  fecha: string;
  series_data: SerieRow[];
};

export type ExerciseMeta = {
  id: string;
  nombre: string;
  categoria: string | null;
  demanda_fuerza: number | null;
  dificultad: string | null;
};

export type FilterOption = { value: string; label: string };

export type WeeklyRow = {
  key: string;
  label: string;
  volumen: number;
  rpe: number | null;
  rirProm: number | null;
  pct1rmProm: number | null;
  carga: number;
  sesiones: number;
};

const NIVEL_FACTOR: Record<string, number> = {
  Principiante: 3,
  Intermedio: 5,
  Avanzado: 7,
  Elite: 10,
  Competitivo: 10,
};

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export function factorDeDificultad(meta: ExerciseMeta): number {
  if (typeof meta.demanda_fuerza === "number" && meta.demanda_fuerza > 0) {
    return clamp(meta.demanda_fuerza, 1, 10);
  }
  if (meta.dificultad && NIVEL_FACTOR[meta.dificultad] !== undefined) {
    return NIVEL_FACTOR[meta.dificultad];
  }
  return 5;
}

function volumenDeSerie(s: SerieRow, factor: number): number {
  const reps = parseNumber(s.reps);
  if (reps == null || reps <= 0) return 0;
  const kg = parseWeight(s.peso);
  return kg != null && kg > 0 ? reps * kg : reps * factor;
}

function intensidadDeSerie(
  s: SerieRow,
): { rpe: number | null; pct1rm: number | null } {
  const rir = parseNumber(s.rir);
  if (rir != null) return { rpe: clamp(10 - rir, 0, 10), pct1rm: null };
  const reps = parseNumber(s.reps);
  const kg = parseWeight(s.peso);
  if (reps != null && reps > 0 && kg != null && kg > 0) {
    const pct = 100 / (1 + reps / 30);
    return { rpe: clamp(pct / 10, 0, 10), pct1rm: Math.round(pct * 10) / 10 };
  }
  return { rpe: null, pct1rm: null };
}

function isoWeekKey(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00Z");
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
  return `${d.getUTCFullYear()}-S${String(weekNo).padStart(2, "0")}`;
}

function buildFilters(
  logs: WorkLogRaw[],
  metas: Map<string, ExerciseMeta>,
): FilterOption[] {
  const cats = new Set<string>();
  const exs = new Map<string, string>();
  for (const l of logs) {
    const meta = metas.get(l.workout_exercise_id);
    if (!meta) continue;
    if (meta.categoria) cats.add(meta.categoria);
    exs.set(meta.id, meta.nombre);
  }
  const filters: FilterOption[] = [{ value: "todos", label: "Todo el plan" }];
  for (const c of [...cats].sort()) {
    filters.push({ value: `cat:${c}`, label: c });
  }
  for (const [id, nombre] of [...exs.entries()].sort((a, b) =>
    a[1].localeCompare(b[1]),
  ) as [string, string][]) {
    filters.push({ value: `ex:${id}`, label: nombre });
  }
  return filters;
}

function matchFilter(
  log: WorkLogRaw,
  filter: string,
  metas: Map<string, ExerciseMeta>,
): boolean {
  if (filter === "todos") return true;
  const meta = metas.get(log.workout_exercise_id);
  if (!meta) return false;
  if (filter.startsWith("cat:")) return meta.categoria === filter.slice(4);
  if (filter.startsWith("ex:")) return meta.id === filter.slice(3);
  return true;
}

function avg(arr: (number | null)[]): number | null {
  const nums = arr.filter((n): n is number => n != null);
  if (nums.length === 0) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function buildAnalytics(
  logs: WorkLogRaw[],
  metas: Map<string, ExerciseMeta>,
) {
  const filters = buildFilters(logs, metas);

  const rowsByFilter: Record<string, WeeklyRow[]> = {};
  for (const { value } of filters) {
    rowsByFilter[value] = computeWeekly(logs, metas, value);
  }
  return { filters, rowsByFilter };
}

function computeWeekly(
  logs: WorkLogRaw[],
  metas: Map<string, ExerciseMeta>,
  filter: string,
): WeeklyRow[] {
  const byWeek = new Map<
    string,
    { volumen: number; rpeVals: number[]; rirVals: number[]; pctVals: number[]; sesiones: number }
  >();

  for (const log of logs) {
    if (!matchFilter(log, filter, metas)) continue;
    const week = isoWeekKey(log.fecha);
    const entry = byWeek.get(week) ?? {
      volumen: 0,
      rpeVals: [],
      rirVals: [],
      pctVals: [],
      sesiones: 0,
    };
    entry.sesiones++;

    const meta = metas.get(log.workout_exercise_id);
    const factor = meta ? factorDeDificultad(meta) : 5;

    for (const s of log.series_data ?? []) {
      entry.volumen += volumenDeSerie(s, factor);
      const { rpe, pct1rm } = intensidadDeSerie(s);
      if (rpe != null) entry.rpeVals.push(rpe);
      const rir = parseNumber(s.rir);
      if (rir != null) entry.rirVals.push(rir);
      if (pct1rm != null) entry.pctVals.push(pct1rm);
    }
    byWeek.set(week, entry);
  }

  return [...byWeek.keys()]
    .sort()
    .map((key) => {
      const d = byWeek.get(key)!;
      const rpe = avg(d.rpeVals);
      return {
        key,
        label: weekLabel(key),
        volumen: Math.round(d.volumen * 10) / 10,
        rpe: rpe != null ? Math.round(rpe * 10) / 10 : null,
        rirProm: avg(d.rirVals),
        pct1rmProm: avg(d.pctVals),
        carga:
          rpe != null ? Math.round(d.volumen * rpe * 10) / 10 : 0,
        sesiones: d.sesiones,
      };
    });
}

function weekLabel(key: string): string {
  const [y, s] = key.split("-S");
  return `S${s} ${y}`;
}
