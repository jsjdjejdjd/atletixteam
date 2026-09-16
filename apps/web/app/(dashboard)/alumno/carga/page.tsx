import { requireProfile } from "@/lib/auth";
import { buildAnalytics, type WorkLogRaw, type ExerciseMeta } from "@/lib/analytics";
import { LoadAnalysis } from "@/components/load-analysis";

export const dynamic = "force-dynamic";

export default async function CargaAlumnoPage() {
  const { supabase, user } = await requireProfile();

  const { data: logsRaw } = await supabase
    .from("workout_logs")
    .select("workout_exercise_id, fecha, series_data")
    .eq("athlete_id", user.id)
    .order("fecha", { ascending: false })
    .limit(500);

  const logs = (logsRaw ?? []) as WorkLogRaw[];

  const weIds = [...new Set(logs.map((l) => l.workout_exercise_id))];

  const { data: workEx } = weIds.length
    ? await supabase
        .from("workout_exercises")
        .select("id, exercise_id")
        .in("id", weIds)
    : { data: [] };

  const exerciseIds = [
    ...new Set(
      (workEx ?? [])
        .map((w) => w.exercise_id)
        .filter((id): id is string => Boolean(id)),
    ),
  ];

  let library: ExerciseMeta[] = [];
  if (exerciseIds.length > 0) {
    const { data: withDemanda, error } = await supabase
      .from("exercises")
      .select("id, nombre, categoria, dificultad, demanda_fuerza")
      .in("id", exerciseIds);

    if (error) {
      const { data: base } = await supabase
        .from("exercises")
        .select("id, nombre, categoria, dificultad")
        .in("id", exerciseIds);
      library = (((base ?? []) as Pick<
        ExerciseMeta,
        "id" | "nombre" | "categoria" | "dificultad"
      >[]).map((e) => ({ ...e, demanda_fuerza: null })) as ExerciseMeta[]);
    } else {
      library = (withDemanda ?? []) as ExerciseMeta[];
    }
  }

  const weToExercise = new Map<string, string | null>(
    (workEx ?? []).map((w) => [w.id, w.exercise_id]),
  );
  const exerciseById = new Map(library.map((e) => [e.id, e]));

  const metas = new Map<string, ExerciseMeta>();
  for (const l of logs) {
    const exId = weToExercise.get(l.workout_exercise_id);
    const meta = exId ? exerciseById.get(exId) : undefined;
    if (meta) metas.set(l.workout_exercise_id, meta);
  }

  const { filters, rowsByFilter } = buildAnalytics(logs, metas);

  return (
    <div className="flex flex-col gap-8">
      <section>
        <p className="text-sm font-medium text-zinc-500">Tu evolución</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">
          Análisis de carga
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Volumen, intensidad y carga semanal según tus sesiones registradas.
        </p>
      </section>

      <LoadAnalysis filters={filters} rowsByFilter={rowsByFilter} />
    </div>
  );
}