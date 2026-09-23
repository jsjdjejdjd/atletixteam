// ============================================================
// ATLETIX · PROGRAMAS · CATÁLOGO EN CÓDIGO (única fuente de verdad)
// ============================================================
// Este archivo es el "editor general de todos los programas":
// general (principiante / intermedio / avanzado) y Asesoría online
// Planche / Front Lever (intermedio / avanzado).
//
// Regla: cada ejercicio se referencia por su `nombre` EXACTO de la
// biblioteca de exercises. El loader resuelve el id por nombre y
// FALLA si el ejercicio no existe (jamás inventa). Los combos se
// puntúan con `calculateComboScore` del catálogo Power Free.
//
// Para cambiar un programa: editá la definición acá y corré
//   npm run programas:cargar
// El loader hace upsert idempotente (por nombre), así que no
// duplica ni rompe lo que ya cargaste en el panel.
// ============================================================

import {
  POWER_FREE_CATALOG,
  calculateComboScore,
  type ComboItem,
  type Equipo,
} from "@/lib/score";

// ============================================================
// TIPOS
// ============================================================
export type NivelPrograma = "Principiante" | "Intermedio" | "Avanzado" | "Elite";

export type CategoriaPrograma =
  | "general"
  | "planche"
  | "front_lever"
  | "asesoria_online";

export type EjercicioPrograma = {
  /** nombre EXACTO en public.exercises */
  nombre: string;
  series: number;
  repeticiones: string;
  rir?: number;
  descanso_segundos?: number;
  peso?: string;
  tempo?: string;
  asistencia?: string;
  notas?: string;
};

export type TipoSesion = "tradicional" | "combo";

export type SesionPrograma = {
  nombre: string;
  dia?: number;
  objetivo?: string;
  tipo: TipoSesion;
  /** solo si tipo === "combo": elementos del catálogo Power Free */
  combo?: (ComboItem & { equipo: Equipo })[];
  /** solo si tipo === "tradicional" */
  ejercicios?: EjercicioPrograma[];
};

export type SemanaPrograma = {
  numero: number;
  bloque?: number;
  objetivo?: string;
  es_descarga?: boolean;
  sesiones: SesionPrograma[];
};

export type ProgramaDef = {
  nombre: string;
  categoria: CategoriaPrograma;
  nivel: NivelPrograma;
  objetivo: string;
  descripcion: string;
  duracion_semanas: number;
  activo: boolean;
  semanas: SemanaPrograma[];
};

export type ProgramaCargado = {
  programaId: string;
  semanas: number;
  sesiones: number;
  ejerciciosTradicionales: number;
  combos: number;
  scoreCombos: { sesion: string; total: number }[];
};

// ============================================================
// PROGRAMA GENERAL · PRINCIPIANTE
// ============================================================
export const PROGRAMA_GENERAL_PRINCIPIANTE: ProgramaDef = {
  nombre: "Calistenia General · Principiante",
  categoria: "general",
  nivel: "Principiante",
  objetivo: "Fundamentos de empuje, tirón, core y piernas en 4 semanas.",
  descripcion: "Base para construir el primer cuerpo de calistenia.",
  duracion_semanas: 4,
  activo: true,
  semanas: [
    {
      numero: 1,
      objetivo: "Familiarizarse con la técnica básica.",
      sesiones: [
        {
          nombre: "Empuje + core",
          dia: 1,
          tipo: "tradicional",
          ejercicios: [
            { nombre: "Flexión de pecho", series: 3, repeticiones: "8-12", rir: 2, descanso_segundos: 90 },
            { nombre: "Fondos en paralelas", series: 3, repeticiones: "6-10", rir: 2, descanso_segundos: 120 },
            { nombre: "Plancha", series: 3, repeticiones: "30-45 s", rir: 2, descanso_segundos: 60 },
          ],
        },
        {
          nombre: "Tirón + core",
          dia: 2,
          tipo: "tradicional",
          ejercicios: [
            { nombre: "Dominadas", series: 3, repeticiones: "5-8", rir: 2, descanso_segundos: 120 },
            { nombre: "Remo australiano", series: 3, repeticiones: "8-12", rir: 2, descanso_segundos: 90 },
            { nombre: "Elevaciones de rodillas colgado", series: 3, repeticiones: "10-15", rir: 2, descanso_segundos: 60 },
          ],
        },
        {
          nombre: "Piernas + full body",
          dia: 3,
          tipo: "tradicional",
          ejercicios: [
            { nombre: "Sentadilla con peso corporal", series: 3, repeticiones: "12-20", rir: 2, descanso_segundos: 90 },
            { nombre: "Puente de glúteo", series: 3, repeticiones: "12-15", rir: 2, descanso_segundos: 90 },
            { nombre: "Flexión inclinada", series: 3, repeticiones: "10-15", rir: 2, descanso_segundos: 90 },
          ],
        },
      ],
    },
    {
      numero: 2,
      objetivo: "Subir volumen de trabajo.",
      sesiones: [
        {
          nombre: "Empuje + core",
          dia: 1,
          tipo: "tradicional",
          ejercicios: [
            { nombre: "Flexión de pecho", series: 4, repeticiones: "10-12", rir: 2, descanso_segundos: 90 },
            { nombre: "Fondos en paralelas", series: 4, repeticiones: "6-10", rir: 2, descanso_segundos: 120 },
            { nombre: "Plancha", series: 4, repeticiones: "30-45 s", rir: 2, descanso_segundos: 60 },
          ],
        },
        {
          nombre: "Tirón + core",
          dia: 2,
          tipo: "tradicional",
          ejercicios: [
            { nombre: "Dominadas", series: 4, repeticiones: "5-8", rir: 2, descanso_segundos: 120 },
            { nombre: "Remo australiano supino", series: 4, repeticiones: "8-12", rir: 2, descanso_segundos: 90 },
            { nombre: "Abdominal bicicleta", series: 3, repeticiones: "15-20", rir: 2, descanso_segundos: 60 },
          ],
        },
        {
          nombre: "Piernas + full body",
          dia: 3,
          tipo: "tradicional",
          ejercicios: [
            { nombre: "Sentadilla con peso corporal", series: 4, repeticiones: "12-20", rir: 2, descanso_segundos: 90 },
            { nombre: "Zancada caminando", series: 3, repeticiones: "10-12", rir: 2, descanso_segundos: 90 },
            { nombre: "Fondos en banco", series: 3, repeticiones: "10-15", rir: 2, descanso_segundos: 90 },
          ],
        },
      ],
    },
    {
      numero: 3,
      objetivo: "Primer acercamiento a skills.",
      sesiones: [
        {
          nombre: "Empuje + skills",
          dia: 1,
          tipo: "tradicional",
          ejercicios: [
            { nombre: "Flexión de pecho", series: 4, repeticiones: "10-12", rir: 2, descanso_segundos: 90 },
            { nombre: "Tuck Planche", series: 4, repeticiones: "10-20 s", rir: 2, descanso_segundos: 90 },
            { nombre: "Handstand Hold", series: 4, repeticiones: "20-30 s", rir: 2, descanso_segundos: 90 },
          ],
        },
        {
          nombre: "Tirón + skills",
          dia: 2,
          tipo: "tradicional",
          ejercicios: [
            { nombre: "Dominadas", series: 4, repeticiones: "5-8", rir: 2, descanso_segundos: 120 },
            { nombre: "Front Lever Tuck", series: 4, repeticiones: "10-20 s", rir: 2, descanso_segundos: 90 },
            { nombre: "L-Sit", series: 4, repeticiones: "5-15 s", rir: 2, descanso_segundos: 60 },
          ],
        },
        {
          nombre: "Combina + combo test",
          dia: 3,
          tipo: "combo",
          combo: [
            { elemento: "Plancha Tuck", unidad: "segundos", cantidad: 10, equipo: "suelo_supino" },
            { elemento: "Front lever tuck avanzado", unidad: "segundos", cantidad: 10, equipo: "barra_supino" },
            { elemento: "Dominadas", unidad: "reps", cantidad: 5, equipo: "barra_supino" },
          ],
        },
      ],
    },
    {
      numero: 4,
      objetivo: "Consolidación y test final.",
      sesiones: [
        {
          nombre: "Empuje + core",
          dia: 1,
          tipo: "tradicional",
          ejercicios: [
            { nombre: "Flexión de pecho", series: 4, repeticiones: "12-15", rir: 2, descanso_segundos: 90 },
            { nombre: "Fondos en paralelas", series: 4, repeticiones: "8-10", rir: 2, descanso_segundos: 120 },
            { nombre: "Plancha", series: 4, repeticiones: "45-60 s", rir: 1, descanso_segundos: 60 },
          ],
        },
        {
          nombre: "Tirón + core",
          dia: 2,
          tipo: "tradicional",
          ejercicios: [
            { nombre: "Dominadas", series: 4, repeticiones: "6-8", rir: 2, descanso_segundos: 120 },
            { nombre: "Remo anillas", series: 4, repeticiones: "8-12", rir: 2, descanso_segundos: 90 },
            { nombre: "Elevación de piernas colgado", series: 4, repeticiones: "8-12", rir: 2, descanso_segundos: 60 },
          ],
        },
        {
          nombre: "Combo final",
          dia: 3,
          tipo: "combo",
          combo: [
            { elemento: "Plancha Tuck", unidad: "segundos", cantidad: 15, equipo: "suelo_supino" },
            { elemento: "Front lever tuck avanzado", unidad: "segundos", cantidad: 15, equipo: "barra_supino" },
            { elemento: "Dominadas", unidad: "reps", cantidad: 8, equipo: "barra_supino" },
            { elemento: "Fondos en paralelas", unidad: "reps", cantidad: 8, equipo: "paralelas" },
          ],
        },
      ],
    },
  ],
};

// ============================================================
// PROGRAMA GENERAL · INTERMEDIO
// ============================================================
export const PROGRAMA_GENERAL_INTERMEDIO: ProgramaDef = {
  nombre: "Calistenia General · Intermedio",
  categoria: "general",
  nivel: "Intermedio",
  objetivo: "Aumentar fuerza hacia skills de tirón y empuje.",
  descripcion: "Volumen intermedio con primer contacto serio a planche y front lever.",
  duracion_semanas: 6,
  activo: true,
  semanas: [
    {
      numero: 1,
      objetivo: "Bloque de fuerza base.",
      sesiones: [
        {
          nombre: "Empuje pesado",
          dia: 1,
          tipo: "tradicional",
          ejercicios: [
            { nombre: "Flexiones lastradas", series: 4, repeticiones: "6-10", rir: 2, descanso_segundos: 120 },
            { nombre: "Fondos en paralelas", series: 4, repeticiones: "6-10", rir: 2, descanso_segundos: 120 },
            { nombre: "Pike push up", series: 4, repeticiones: "6-10", rir: 2, descanso_segundos: 120 },
          ],
        },
        {
          nombre: "Tirón pesado",
          dia: 2,
          tipo: "tradicional",
          ejercicios: [
            { nombre: "Dominadas lastradas", series: 4, repeticiones: "5-8", rir: 2, descanso_segundos: 150 },
            { nombre: "Remo en anillas", series: 4, repeticiones: "8-12", rir: 2, descanso_segundos: 120 },
            { nombre: "Curl con barra", series: 3, repeticiones: "8-12", rir: 2, descanso_segundos: 90 },
          ],
        },
        {
          nombre: "Skill + core",
          dia: 3,
          tipo: "tradicional",
          ejercicios: [
            { nombre: "Advanced Tuck Planche", series: 5, repeticiones: "10-20 s", rir: 2, descanso_segundos: 90 },
            { nombre: "Front Lever One Leg", series: 5, repeticiones: "10-20 s", rir: 2, descanso_segundos: 90 },
            { nombre: "Dragon flag", series: 3, repeticiones: "5-8", rir: 2, descanso_segundos: 120 },
          ],
        },
        {
          nombre: "Piernas + combo test",
          dia: 4,
          tipo: "combo",
          combo: [
            { elemento: "Plancha Straddle", unidad: "segundos", cantidad: 10, equipo: "suelo_supino" },
            { elemento: "Front Lever Straddle", unidad: "segundos", cantidad: 10, equipo: "barra_supino" },
            { elemento: "Dominadas", unidad: "reps", cantidad: 10, equipo: "barra_supino" },
          ],
        },
      ],
    },
    {
      numero: 6,
      objetivo: "Test intermedio completo.",
      sesiones: [
        {
          nombre: "Combo final intermedio",
          dia: 3,
          tipo: "combo",
          combo: [
            { elemento: "Plancha Straddle", unidad: "segundos", cantidad: 15, equipo: "suelo_supino" },
            { elemento: "Front Lever Straddle", unidad: "segundos", cantidad: 15, equipo: "barra_supino" },
            { elemento: "Dominadas lastradas", unidad: "reps", cantidad: 6, equipo: "barra_prono" },
            { elemento: "Fondos en anillas", unidad: "reps", cantidad: 6, equipo: "anillas" },
          ],
        },
      ],
    },
  ],
};

// ============================================================
// PROGRAMA GENERAL · AVANZADO
// ============================================================
export const PROGRAMA_GENERAL_AVANZADO: ProgramaDef = {
  nombre: "Calistenia General · Avanzado",
  categoria: "general",
  nivel: "Avanzado",
  objetivo: "Compilar fuerza de planche, front lever y skills dinámicos.",
  descripcion: "Entrenamiento avanzado integrando estáticos altos y musculación.",
  duracion_semanas: 8,
  activo: true,
  semanas: [
    {
      numero: 1,
      objetivo: "Arranque de bloque avanzado.",
      sesiones: [
        {
          nombre: "Empuje + planche",
          dia: 1,
          tipo: "combo",
          combo: [
            { elemento: "Plancha Straddle", unidad: "segundos", cantidad: 15, equipo: "suelo_supino" },
            { elemento: "Plancha Full", unidad: "segundos", cantidad: 5, equipo: "suelo_supino" },
            { elemento: "Fondos paralelas", unidad: "reps", cantidad: 10, equipo: "paralelas" },
          ],
        },
        {
          nombre: "Tirón + front lever",
          dia: 2,
          tipo: "combo",
          combo: [
            { elemento: "Front Lever Full", unidad: "segundos", cantidad: 10, equipo: "barra_supino" },
            { elemento: "Front Lever Straddle", unidad: "segundos", cantidad: 15, equipo: "barra_supino" },
            { elemento: "Dominadas lastradas", unidad: "reps", cantidad: 8, equipo: "barra_prono" },
          ],
        },
        {
          nombre: "Fuerza dinámica",
          dia: 3,
          tipo: "tradicional",
          ejercicios: [
            { nombre: "Muscle Up", series: 4, repeticiones: "3-5", rir: 2, descanso_segundos: 180 },
            { nombre: "Pull Up explosiva", series: 4, repeticiones: "4-6", rir: 2, descanso_segundos: 150 },
            { nombre: "Fondos lastrados", series: 4, repeticiones: "5-8", rir: 2, descanso_segundos: 150 },
          ],
        },
        {
          nombre: "Core + agarre",
          dia: 4,
          tipo: "tradicional",
          ejercicios: [
            { nombre: "Front Lever Full", series: 5, repeticiones: "5-15 s", rir: 2, descanso_segundos: 120 },
            { nombre: "L-Sit", series: 4, repeticiones: "10-30 s", rir: 2, descanso_segundos: 90 },
            { nombre: "Elevación de piernas colgado", series: 4, repeticiones: "10-15", rir: 2, descanso_segundos: 90 },
          ],
        },
      ],
    },
    {
      numero: 8,
      objetivo: "Test avanzado completo.",
      sesiones: [
        {
          nombre: "Combo final avanzado",
          dia: 4,
          tipo: "combo",
          combo: [
            { elemento: "Plancha Full", unidad: "segundos", cantidad: 10, equipo: "suelo_supino" },
            { elemento: "Front Lever Full", unidad: "segundos", cantidad: 10, equipo: "barra_supino" },
            { elemento: "Muscle Up", unidad: "reps", cantidad: 4, equipo: "barra_supino" },
            { elemento: "Fondos en anillas", unidad: "reps", cantidad: 8, equipo: "anillas" },
          ],
        },
      ],
    },
  ],
};

// ============================================================
// PROGRAMA · ASESORÍA ONLINE · PLANCHE / FRONT LEVER · INTERMEDIO
// ============================================================
export const PROGRAMA_ASESORIA_ONLINE_PLANCHE_INTERMEDIO: ProgramaDef = {
  nombre: "Asesoría online · Planche / Front Lever · Intermedio",
  categoria: "asesoria_online",
  nivel: "Intermedio",
  objetivo: "Rutina de asesoría online (intermedio) para Planche / Front Lever.",
  descripcion: "Variante de asesoría online del módulo Planche / Front Lever.",
  duracion_semanas: 6,
  activo: true,
  semanas: [
    {
      numero: 1,
      objetivo: "Semana 1 online · sesiones guiadas.",
      sesiones: [
        {
          nombre: "Sesión 1 · empuje + planche",
          dia: 1,
          tipo: "tradicional",
          ejercicios: [
            { nombre: "Fondos en paralelas", series: 4, repeticiones: "6-10", rir: 2, descanso_segundos: 120 },
            { nombre: "Advanced Tuck Planche", series: 4, repeticiones: "10-20 s", rir: 2, descanso_segundos: 90 },
            { nombre: "Flexión inclinada", series: 3, repeticiones: "10-15", rir: 2, descanso_segundos: 90 },
          ],
        },
        {
          nombre: "Sesión 2 · tirón + front lever",
          dia: 2,
          tipo: "tradicional",
          ejercicios: [
            { nombre: "Dominadas", series: 4, repeticiones: "6-10", rir: 2, descanso_segundos: 150 },
            { nombre: "Front Lever One Leg", series: 4, repeticiones: "10-20 s", rir: 2, descanso_segundos: 90 },
            { nombre: "Remo anillas", series: 3, repeticiones: "8-12", rir: 2, descanso_segundos: 120 },
          ],
        },
      ],
    },
  ],
};

// ============================================================
// PROGRAMA · ASESORÍA ONLINE · PLANCHE / FRONT LEVER · AVANZADO
// ============================================================
export const PROGRAMA_ASESORIA_ONLINE_PLANCHE_AVANZADO: ProgramaDef = {
  nombre: "Asesoría online · Planche / Front Lever · Avanzado",
  categoria: "asesoria_online",
  nivel: "Avanzado",
  objetivo: "Rutina de asesoría online (avanzada) para Planche / Front Lever.",
  descripcion: "Variante avanzada de asesoría online del módulo Planche / Front Lever.",
  duracion_semanas: 6,
  activo: true,
  semanas: [
    {
      numero: 1,
      objetivo: "Semana 1 online · estáticos altos.",
      sesiones: [
        {
          nombre: "Sesión 1 · planche alto",
          dia: 1,
          tipo: "combo",
          combo: [
            { elemento: "Plancha Straddle", unidad: "segundos", cantidad: 15, equipo: "suelo_supino" },
            { elemento: "Plancha Full", unidad: "segundos", cantidad: 5, equipo: "suelo_supino" },
            { elemento: "Fondos en anillas", unidad: "reps", cantidad: 6, equipo: "anillas" },
          ],
        },
        {
          nombre: "Sesión 2 · front lever alto",
          dia: 2,
          tipo: "combo",
          combo: [
            { elemento: "Front Lever Straddle", unidad: "segundos", cantidad: 15, equipo: "barra_supino" },
            { elemento: "Front Lever Full", unidad: "segundos", cantidad: 5, equipo: "barra_supino" },
            { elemento: "Dominadas lastradas", unidad: "reps", cantidad: 6, equipo: "barra_prono" },
          ],
        },
      ],
    },
  ],
};

export const PROGRAMAS_CATALOGO: ProgramaDef[] = [
  PROGRAMA_GENERAL_PRINCIPIANTE,
  PROGRAMA_GENERAL_INTERMEDIO,
  PROGRAMA_GENERAL_AVANZADO,
  PROGRAMA_ASESORIA_ONLINE_PLANCHE_INTERMEDIO,
  PROGRAMA_ASESORIA_ONLINE_PLANCHE_AVANZADO,
];

export function scoreDeCombo(sesion: SesionPrograma): {
  total: number;
  equipos: Record<Equipo, number | null>;
} | null {
  if (sesion.tipo !== "combo" || !sesion.combo?.length) return null;
  const items = sesion.combo.map(({ equipo, ...it }) => it);
  const scores = {} as Record<Equipo, number | null>;
  let total = 0;
  for (const e of Object.keys(POWER_FREE_CATALOG["Plancha Full"]) as Equipo[]) {
    const r = calculateComboScore(items, e);
    // conservamos el total solo si al menos un elemento aplica en ese equipo
    scores[e] = r.total > 0 ? r.total : null;
    if (scores[e] != null) total = Math.max(total, scores[e]);
  }
  return { total, equipos: scores };
}
