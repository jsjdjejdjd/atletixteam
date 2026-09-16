import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { WorkoutEditor } from "./workout-editor";

export const dynamic = "force-dynamic";

type WorkoutExercise = {
  id: string;
  exercise_id: string | null;
  orden: number;
  series: number | null;
  repeticiones: string | null;
  tiempo: string | null;
  rir: number | null;
  descanso_segundos: number | null;
  peso: string | null;
  tempo: string | null;
  asistencia: string | null;
  notas: string | null;
  video_url: string | null;
  sugerencia_progresion: string | null;
};

export default async function EntrenamientoPage({
  params,
}: {
  params: Promise<{ id: string; weekId: string; workoutId: string }>;
}) {
  const { id, weekId, workoutId } = await params;
  const { supabase } = await requireProfile();

  const [workoutRes, exercisesRes, libraryRes, logsRes] = await Promise.all([
    supabase
      .from("workouts")
      .select("id, nombre, dia, week_id")
      .eq("id", workoutId)
      .single(),
    supabase
      .from("workout_exercises")
      .select("*")
      .eq("workout_id", workoutId)
      .order("orden", { ascending: true }),
    supabase
      .from("exercises")
      .select("id, nombre, categoria")
      .order("nombre", { ascending: true }),
    (async () => {
      const weIds = (
        await supabase.from("workout_exercises").select("id").eq("workout_id", workoutId)
      ).data?.map((w) => w.id);
      if (!weIds || weIds.length === 0) return { data: [] };
      return supabase
        .from("workout_logs")
        .select("id, workout_exercise_id, athlete_id, series_data, comentarios, completado, fecha")
        .in("workout_exercise_id", weIds)
        .order("fecha", { ascending: false })
        .limit(30);
    })(),
  ]);

  const workout = workoutRes.data;
  if (!workout) {
    return <p className="text-zinc-500">Entrenamiento no encontrado.</p>;
  }

  const raw = (exercisesRes.data ?? []) as WorkoutExercise[];
  const library = (libraryRes.data ?? []) as {
    id: string;
    nombre: string;
    categoria: string;
  }[];

  const exerciseMap = new Map(
    library.map((l) => [l.id, { nombre: l.nombre, categoria: l.categoria }])
  );

  const exercises = raw.map((ex) => ({
    ...ex,
    exercise_nombre: ex.exercise_id
      ? exerciseMap.get(ex.exercise_id)?.nombre ?? "Sin nombre"
      : "Sin nombre",
    exercise_categoria: ex.exercise_id
      ? exerciseMap.get(ex.exercise_id)?.categoria ?? ""
      : "",
  }));

  const athleteIds = (logsRes.data ?? []).map((l) => l.athlete_id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, nombre, apellido, email")
    .in("id", athleteIds.length ? athleteIds : ["00000000-0000-0000-0000-000000000000"]);

  const profileMap = new Map(
    (profiles ?? []).map((p) => [
      p.id,
      [p.nombre, p.apellido].filter(Boolean).join(" ") || p.email || "Alumno",
    ])
  );

  const exerciseLabelMap = new Map(
    exercises.map((ex) => [ex.id, ex.exercise_nombre])
  );

  const logs = (logsRes.data ?? []).map((l) => ({
    id: l.id,
    fecha: l.fecha as string,
    series_data: (l.series_data ?? []) as {
      serie: number;
      reps?: string | null;
      peso?: string | null;
    }[],
    comentarios: l.comentarios as string | null,
    athlete: profileMap.get(l.athlete_id) ?? "Alumno",
    exercise: exerciseLabelMap.get(l.workout_exercise_id) ?? "Ejercicio",
    workout_exercise_id: l.workout_exercise_id,
  }));

  return (
    <div className="flex flex-col gap-8">
      <section>
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/entrenador/programas" className="hover:text-zinc-300">
            Programas
          </Link>
          <span>/</span>
          <Link
            href={`/entrenador/programas/${id}`}
            className="hover:text-zinc-300"
          >
            Programa
          </Link>
          <span>/</span>
          <Link
            href={`/entrenador/programas/${id}/semanas/${weekId}`}
            className="hover:text-zinc-300"
          >
            Semana
          </Link>
          <span>/</span>
          <span className="text-zinc-300">{workout.nombre}</span>
        </div>
        <h1 className="mt-2 text-3xl font-black tracking-tight">
          {workout.nombre}
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          {workout.dia ? `Día ${workout.dia}` : ""} · {exercises.length} ejercicios
        </p>
      </section>

      <WorkoutEditor
        workoutId={workoutId}
        exercises={exercises}
        library={library}
        logs={logs}
      />
    </div>
  );
}