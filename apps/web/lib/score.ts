// ============================================================
// ATLETIX · POWER FREE — ENGINE DE SCORE
// ============================================================
// Única fuente de verdad del cálculo de combo scores.
// 100% puro: no importa framework, no importa supabase, no toca
// el editor de sesiones. La UI SIEMPRE lee el resultado (total +
// desglose) de acá; jamás vuelve a calcular ni "inventa" la fórmula.
// Contrato documentado en docs/combo-builder/02-score-power-free.md
// ============================================================

/** Los 6 equipos sobre los que se evalúa cada elemento. */
export const EQUIPOS = [
  "suelo_supino",
  "suelo_prono",
  "barra_supino",
  "barra_prono",
  "anillas",
  "paralelas",
] as const;
export type Equipo = (typeof EQUIPOS)[number];

export const esEquipo = (e: string | null | undefined): e is Equipo =>
  EQUIPOS.includes(e as Equipo);

export type ComboItem = {
  elemento: string;
  /** reps | segundos */
  unidad: "reps" | "segundos";
  /** cantidad de unidades ejecutadas */
  cantidad: number;
  /** true si este elemento funciona como transición hacia el siguiente */
  esTransicion?: boolean;
  /** true si la serie NO se completó entera */
  incompleto?: boolean;
};

export type ComboScoreConfig = {
  /** score por unidad ejecutada (multiplica el valor del elemento). Default 1 */
  multiplicadorUnidad?: number;
  /** bonus por segundos totales del combo. Default 0 (desactivado) */
  bonusDuracion?: number;
  /** bonus por cada transición encadenada. Default 0.5 */
  bonusTransicion?: number;
  /** factor de variedad por skill distinto. Default 1 */
  factorVariedad?: number;
  /** penalización por elemento incompleto. Default 0.5 */
  penalizacionIncompleto?: number;
  /** penalización por combo no terminado. Default 2.0 */
  penalizacionNoTerminado?: number;
};

export type TablaValores = Record<string, Partial<Record<Equipo, number | null>>>;

/**
 * Catálogo de valores por elemento × equipo (6 equipos).
 * `null` = el elemento NO aplica en ese equipo (equivale a "–" / se omite,
 * nunca penaliza, no aporta al total en ese equipo). Documentado en
 * docs/combo-builder/01-catalogo-puntuacion.md (mismos números, cero inventos).
 */
export const POWER_FREE_CATALOG: TablaValores = {
  "Plancha Full": {
    suelo_supino: 2.5, suelo_prono: 2.5, barra_supino: 2.5,
    barra_prono: 2.3, anillas: 3.5, paralelas: 2.3,
  },
  "Plancha Tuck": {
    suelo_supino: 0.3, suelo_prono: 0.3, barra_supino: 0.3,
    barra_prono: 0.3, anillas: 0.3, paralelas: 0.3,
  },
  "Plancha Straddle": {
    suelo_supino: 1.3, suelo_prono: 1.3, barra_supino: 1.5,
    barra_prono: 1.5, anillas: 2.5, paralelas: 1.3,
  },
  "Front Lever Full": {
    suelo_supino: null, suelo_prono: null, barra_supino: 1.4,
    barra_prono: 1.2, anillas: 1.4, paralelas: 1.2,
  },
  "Front Lever Tuck": {
    suelo_supino: null, suelo_prono: null, barra_supino: null,
    barra_prono: 0.2, anillas: null, paralelas: null,
  },
  "Back Lever Full": {
    suelo_supino: null, suelo_prono: null, barra_supino: 1.0,
    barra_prono: 0.8, anillas: 1.0, paralelas: 0.8,
  },
  V_sit: {
    suelo_supino: 0.8, suelo_prono: 0.6, barra_supino: 0.7,
    barra_prono: 0.6, anillas: 0.8, paralelas: 0.4,
  },
};

export type ScoreDesglose = {
  elementos: number;
  transiciones: number;
  duracion: number;
  variedad: number;
  penalizaciones: number;
};

export type ComboScore = {
  total: number;
  desglose: ScoreDesglose;
  /** Equipos/espacios donde el combo es evaluable (tiene algún elemento aplicable) */
  evaluableEn: Equipo[];
  /** Elementos omitidos en cada equipo por valor null ("–") — NO penalizan */
  omitidos: Record<Equipo, string[]>;
};

const CONFIG_DEFAULT: Required<ComboScoreConfig> = {
  multiplicadorUnidad: 1,
  bonusDuracion: 0,
  bonusTransicion: 0.5,
  factorVariedad: 1,
  penalizacionIncompleto: 0.5,
  penalizacionNoTerminado: 2.0,
};

export function calculateComboScore(
  combo: ComboItem[],
  equipo: Equipo,
  tabla: TablaValores = POWER_FREE_CATALOG,
  config: ComboScoreConfig = {}
): ComboScore {
  const cfg: Required<ComboScoreConfig> = { ...CONFIG_DEFAULT, ...config };

  // ---- ELEMENTOS: Σ (valor x cantidad) por unidad, solo donde aplica el equipo
  let elementos = 0;
  for (const it of combo) {
    const valor = tabla[it.elemento]?.[equipo];
    if (valor == null) continue; // null = "–": se omite, no penaliza
    elementos += valor * it.cantidad * cfg.multiplicadorUnidad;
  }

  // ---- TRANSICIONES: bonus por cada elemento marcado como transición
  const transiciones =
    combo.filter((it) => it.esTransicion).length * cfg.bonusTransicion;

  // ---- DURACIÓN: total de segundos si están activados
  const segundos = combo
    .filter((it) => it.unidad === "segundos")
    .reduce((s, it) => s + (it.cantidad || 0), 0);
  const duracion = segundos * cfg.bonusDuracion;

  // ---- VARIEDAD: nº de skills DISTINTOS ejecutados (aplica el equipo)
  const skillsDistintos = new Set(
    combo
      .filter((it) => tabla[it.elemento]?.[equipo] != null)
      .map((it) => it.elemento)
  ).size;
  const variedad = skillsDistintos * cfg.factorVariedad;

  // ---- PENALIZACIONES
  const incompletos =
    combo.filter((it) => it.incompleto).length * cfg.penalizacionIncompleto;
  const noTerminado = combo.some((it) => it.incompleto)
    ? cfg.penalizacionNoTerminado
    : 0;
  const penalizaciones = incompletos + noTerminado;

  // ---- CLAMP >= 0 (invariante del doc)
  const total = Math.max(0, elementos + transiciones + duracion + variedad - penalizaciones);

  // ---- INFO por equipo (omitidos / evaluable)
  const omitidos: Record<Equipo, string[]> = {
    suelo_supino: [], suelo_prono: [], barra_supino: [],
    barra_prono: [], anillas: [], paralelas: [],
  };
  for (const e of EQUIPOS) {
    omitidos[e] = combo
      .filter((it) => tabla[it.elemento]?.[e] == null)
      .map((it) => it.elemento);
  }

  return {
    total,
    desglose: { elementos, transiciones, duracion, variedad, penalizaciones },
    evaluableEn: EQUIPOS.filter((e) => combo.some((it) => tabla[it.elemento]?.[e] != null)),
    omitidos,
  };
}
