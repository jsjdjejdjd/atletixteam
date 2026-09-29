import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { LogResumen, Serie } from "./resumen";

type LogRow = {
  id: string;
  workout_exercise_id: string;
  athlete_id: string;
  fecha: string;
  series_data: Serie[] | null;
  comentarios: string | null;
};

type WorkoutExerciseRow = {
  id: string;
  exercise_id: string | null;
  workout_id: string | null;
};

const VACIO = "00000000-0000-0000-0000-000000000000";

/** Trae los logs de uno o varios alumnos con el nombre del ejercicio y de la
 *  sesión resueltos. Se piden primero los workout_exercises porque de ahí salen
 *  los ids de exercises y workouts, y esas dos van juntas porque no dependen
 *  entre sí.
 *
 *  `limite` acota el total de logs. En la vista de todos los alumnos conviene
 *  acotar para no bajar el histórico entero; al filtrar por uno solo se puede
 *  dejar sin límite porque el resumen que se le manda al alumno tiene que
 *  estar completo.
 */
export async function cargarLogs(
  supabase: SupabaseClient,
  athleteIds: string[],
  limite?: number
): Promise<Map<string, LogResumen[]>> {
  const porAlumno = new Map<string, LogResumen[]>();
  if (athleteIds.length === 0) return porAlumno;

  let q = supabase
    .from("workout_logs")
    .select("id, workout_exercise_id, athlete_id, fecha, series_data, comentarios")
    .in("athlete_id", athleteIds)
    .order("fecha", { ascending: true });

  if (limite) q = q.limit(limite);

  const { data: raw } = await q;

  const logs = (raw ?? []) as LogRow[];
  if (logs.length === 0) return porAlumno;

  const weIds = [...new Set(logs.map((l) => l.workout_exercise_id))];
  const { data: weRaw } = await supabase
    .from("workout_exercises")
    .select("id, exercise_id, workout_id")
    .in("id", weIds);
  const we = (weRaw ?? []) as WorkoutExerciseRow[];

  const exIds = [...new Set(we.map((w) => w.exercise_id).filter((x): x is string => !!x))];
  const workoutIds = [...new Set(we.map((w) => w.workout_id).filter((x): x is string => !!x))];

  const [exRes, wRes] = await Promise.all([
    supabase
      .from("exercises")
      .select("id, nombre")
      .in("id", exIds.length ? exIds : [VACIO]),
    supabase
      .from("workouts")
      .select("id, nombre")
      .in("id", workoutIds.length ? workoutIds : [VACIO]),
  ]);

  const exNombre = new Map((exRes.data ?? []).map((e) => [e.id, e.nombre]));
  const workoutNombre = new Map((wRes.data ?? []).map((w) => [w.id, w.nombre]));
  const weMap = new Map(
    we.map((w) => [
      w.id,
      {
        ejercicio: (w.exercise_id && exNombre.get(w.exercise_id)) || "Ejercicio",
        workout: workoutNombre.get(w.workout_id) ?? "Entrenamiento",
      },
    ])
  );

  for (const l of logs) {
    const ref = weMap.get(l.workout_exercise_id);
    const lista = porAlumno.get(l.athlete_id) ?? [];
    lista.push({
      id: l.id,
      fecha: l.fecha,
      ejercicioNombre: ref?.ejercicio ?? "Ejercicio",
      workoutNombre: ref?.workout ?? "Entrenamiento",
      series: Array.isArray(l.series_data) ? l.series_data : [],
      comentarios: l.comentarios,
    });
    porAlumno.set(l.athlete_id, lista);
  }

  return porAlumno;
}
