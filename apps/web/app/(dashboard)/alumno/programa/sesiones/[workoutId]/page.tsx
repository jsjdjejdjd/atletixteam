import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { EmptyState } from "@/components/ui";
import { esProgramaPlanificable, labelSesion } from "@/lib/levels";
import { SesionEditor } from "./sesion-editor";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  exercise_id: string | null;
  orden: number;
  series: number | null;
  repeticiones: string | null;
  descanso_segundos: number | null;
};

type LibraryExercise = {
  id: string;
  nombre: string;
  categoria: string | null;
  dificultad: string | null;
};

export default async function EditarSesionPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { workoutId } = await params;
  const { supabase } = await requireProfile();

  const [workoutRes, itemsRes, libraryRes] = await Promise.all([
    supabase
      .from("workouts")
      .select("id, nombre, dia, week_id")
      .eq("id", workoutId)
      .single(),
    supabase
      .from("workout_exercises")
      .select("id, exercise_id, orden, series, repeticiones, descanso_segundos")
      .eq("workout_id", workoutId)
      .is("athlete_id", null)
      .order("orden", { ascending: true }),
    supabase
      .from("exercises")
      .select("id, nombre, categoria, dificultad")
      .eq("activo", true)
      .order("nombre", { ascending: true }),
  ]);

  const workout = workoutRes.data;
  if (!workout) {
    return <p className="text-zinc-500">Sesión no encontrada.</p>;
  }

  const { data: week } = await supabase
    .from("weeks")
    .select("id, numero, program_id")
    .eq("id", workout.week_id)
    .single();

  const { data: program } = week
    ? await supabase
        .from("programs")
        .select("id, nombre, categoria")
        .eq("id", week.program_id)
        .single()
    : { data: null };

  if (!program || !esProgramaPlanificable(program.nombre, program.categoria)) {
    return (
      <div className="flex flex-col gap-6">
        <EmptyState
          title="Esta sesión no es de planificación compartida"
          description="La edición conjunta está disponible solo para los programas de Planche / Front Lever."
        />
        <div>
          <Link
            href="/alumno/programa"
            className="rounded-lg border border-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white"
          >
            Volver a mi programa
          </Link>
        </div>
      </div>
    );
  }

  const items = (itemsRes.data ?? []) as Row[];
  const exerciseMap = new Map(
    ((libraryRes.data ?? []) as LibraryExercise[]).map((e) => [e.id, e])
  );

  const rows = items.map((it) => {
    const ex = it.exercise_id ? exerciseMap.get(it.exercise_id) : undefined;
    return {
      ...it,
      exercise_nombre: ex?.nombre ?? "Ejercicio eliminado de la biblioteca",
      exercise_categoria: ex?.categoria ?? "",
    };
  });

  return (
    <div className="flex flex-col gap-8">
      <section>
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/alumno/programa" className="hover:text-zinc-300">
            Mi programa
          </Link>
          <span>/</span>
          <span>Semana {week?.numero ?? "?"}</span>
          <span>/</span>
          <span className="text-zinc-300">{workout.nombre}</span>
        </div>
        <h1 className="mt-2 text-3xl font-black tracking-tight">
          {labelSesion(workout.dia, workout.nombre)}
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          {rows.length} ejercicio{rows.length === 1 ? "" : "s"} · planificación
          compartida del grupo
        </p>
      </section>

      <SesionEditor
        workoutId={workoutId}
        rows={rows}
        library={(libraryRes.data ?? []) as LibraryExercise[]}
      />
    </div>
  );
}