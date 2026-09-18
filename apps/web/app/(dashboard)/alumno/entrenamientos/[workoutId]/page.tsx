import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { LiveWorkout } from "./live-workout";

export const dynamic = "force-dynamic";

const DRAFT_MAX_AGE_MS = 3 * 24 * 60 * 60 * 1000;

type We = {
  id: string;
  athlete_id: string | null;
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

type Serie = {
  serie: number;
  reps?: string | null;
  peso?: string | null;
  rir?: number | null;
  descanso?: number | null;
};

export default async function EntrenamientoAlumnoPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { workoutId } = await params;
  const { supabase, user } = await requireProfile();

  const hoy = new Date().toISOString().slice(0, 10);

  const [workoutRes, weRes, libRes] = await Promise.all([
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
      .select("id, nombre, video_url")
      .order("nombre", { ascending: true }),
  ]);

  const workout = workoutRes.data;
  if (!workout) {
    return <p className="text-zinc-500">Entrenamiento no encontrado.</p>;
  }

  const raw = (weRes.data ?? []) as We[];
  const baseIds = raw.filter((w) => !w.athlete_id).map((w) => w.id);

  const { data: overridesData } = baseIds.length
    ? await supabase
        .from("workout_exercise_overrides")
        .select("workout_exercise_id, oculto, orden")
        .eq("athlete_id", user.id)
        .in("workout_exercise_id", baseIds)
    : {
        data: [] as {
          workout_exercise_id: string;
          oculto: boolean;
          orden: number | null;
        }[],
      };

  const overrideMap = new Map(
    (overridesData ?? []).map((o) => [o.workout_exercise_id, o])
  );

  const items = raw
    .filter((w) => !overrideMap.get(w.id)?.oculto)
    .sort((a, b) => {
      const oa = overrideMap.get(a.id)?.orden ?? a.orden;
      const ob = overrideMap.get(b.id)?.orden ?? b.orden;
      if (oa !== ob) return oa - ob;
      return a.orden - b.orden;
    });

  const ids = items.map((w) => w.id);
  const lib = new Map(
    (libRes.data ?? []).map(
      (l: { id: string }) => [l.id, l] as const
    )
  );

  const [logsRes, videosRes] = ids.length
    ? await Promise.all([
        supabase
          .from("workout_logs")
          .select("id, workout_exercise_id, series_data, comentarios, completado")
          .eq("athlete_id", user.id)
          .eq("fecha", hoy)
          .in("workout_exercise_id", ids),
        supabase
          .from("videos")
          .select("workout_exercise_id, storage_path")
          .eq("athlete_id", user.id)
          .in("workout_exercise_id", ids)
          .order("created_at", { ascending: false }),
      ])
    : [
        { data: [] as { id: string; workout_exercise_id: string; series_data: unknown; comentarios: string | null; completado: boolean }[] },
        { data: [] as { workout_exercise_id: string | null; storage_path: string }[] },
      ];

  const logMap = new Map(
    (logsRes.data ?? []).map((l) => [l.workout_exercise_id, l])
  );
  const videoMap = new Map<string, string>();
  for (const v of videosRes.data ?? []) {
    if (!videoMap.has(v.workout_exercise_id)) {
      videoMap.set(v.workout_exercise_id, v.storage_path);
    }
  }

  const { data: draftRow } = await supabase
    .from("workout_drafts")
    .select("data, updated_at")
    .eq("athlete_id", user.id)
    .eq("workout_id", workoutId)
    .maybeSingle();

  let draft: {
    data: Record<
      string,
      {
        rows: {
          done: boolean;
          reps: string;
          peso: string;
          rir: string;
          descanso: string;
        }[];
        comentario: string;
      }
    >;
    updatedAt: string;
  } | null = null;

  if (draftRow) {
    const updatedAt = draftRow.updated_at as string;
    const edad = new Date().getTime() - new Date(updatedAt).getTime();
    if (edad < DRAFT_MAX_AGE_MS) {
      const data = draftRow.data as {
        [k: string]: {
          rows: {
            done: boolean;
            reps: string;
            peso: string;
            rir: string;
            descanso: string;
          }[];
          comentario: string;
        };
      };
      draft = { data, updatedAt };
    }
  }

  const exercises = items.map((w) => {
    const info = w.exercise_id ? lib.get(w.exercise_id) : null;
    const log = logMap.get(w.id);
    const path = videoMap.get(w.id);
    return {
      id: w.id,
      exercise_id: w.exercise_id,
      athlete_id: w.athlete_id,
      orden: w.orden,
      name: (info as { nombre?: string } | null)?.nombre ?? "Sin nombre",
      target: {
        series: w.series,
        repeticiones: w.repeticiones,
        tiempo: w.tiempo,
        rir: w.rir,
        descanso_segundos: w.descanso_segundos,
        peso: w.peso,
        tempo: w.tempo,
        asistencia: w.asistencia,
        notas: w.notas,
        video_url: w.video_url ?? (info as { video_url?: string | null } | null)?.video_url ?? null,
        sugerencia_progresion: w.sugerencia_progresion,
      },
      log: log
        ? {
            id: log.id,
            series: (log.series_data ?? []) as Serie[],
            comentarios: log.comentarios,
          }
        : null,
      miVideo:
        path !== undefined
          ? supabase.storage.from("videos").getPublicUrl(path).data.publicUrl
          : null,
    };
  });

  return (
    <div className="flex flex-col gap-8">
      <section>
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/alumno/programa" className="hover:text-zinc-300">
            Programa
          </Link>
          <span>/</span>
          <span className="text-zinc-300">{workout.nombre}</span>
        </div>
        <h1 className="mt-2 text-3xl font-black tracking-tight">
          {workout.nombre}
        </h1>
        {workout.dia ? (
          <p className="mt-1 text-sm text-zinc-400">Día {workout.dia}</p>
        ) : null}
      </section>

      <LiveWorkout
        workoutId={workoutId}
        workoutName={workout.nombre}
        athleteId={user.id}
        exercises={exercises}
        canEdit
        draft={draft}
        library={
          (libRes.data ?? []) as {
            id: string;
            nombre: string;
            video_url: string | null;
          }[]
        }
      />
    </div>
  );
}