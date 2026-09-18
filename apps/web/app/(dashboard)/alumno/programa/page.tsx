import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { EmptyState } from "@/components/ui";
import { esProgramaPlanificable, labelSesion } from "@/lib/levels";

export const dynamic = "force-dynamic";

export default async function ProgramaAlumnoPage() {
  const { supabase, user } = await requireProfile();

  const { data: athlete } = await supabase
    .from("athletes")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!athlete) {
    return (
      <div className="flex flex-col gap-6">
        <EmptyState
          title="No estás anotado en ningún programa todavía"
          description="Entrá al catálogo y elegí el programa que quieras empezar."
        />
        <div>
          <Link
            href="/alumno/programas"
            className="rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-zinc-950"
          >
            Ver programas
          </Link>
        </div>
      </div>
    );
  }

  const { data: assignment } = await supabase
    .from("athlete_programs")
    .select("program_id, estado, fecha_inicio")
    .eq("athlete_id", athlete.id)
    .eq("estado", "activo")
    .maybeSingle();

  if (!assignment) {
    return (
      <div className="flex flex-col gap-6">
        <EmptyState
          title="Todavía no elegiste un programa"
          description="Entrá al catálogo, mirá las opciones y empezá la que más te sirva."
        />
        <div>
          <Link
            href="/alumno/programas"
            className="rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-zinc-950"
          >
            Ver programas
          </Link>
        </div>
      </div>
    );
  }

  const [programRes, weeksRes] = await Promise.all([
    supabase
      .from("programs")
      .select("id, nombre, objetivo, nivel, duracion_semanas, descripcion")
      .eq("id", assignment.program_id)
      .single(),
    supabase
      .from("weeks")
      .select("id, numero, objetivo, es_descarga")
      .eq("program_id", assignment.program_id)
      .order("numero", { ascending: true }),
  ]);

  const program = programRes.data;
  if (!program) {
    return <p className="text-zinc-500">Programa no encontrado.</p>;
  }

  const editable = esProgramaPlanificable(program.nombre);

  const weeks = (weeksRes.data ?? []) as {
    id: string;
    numero: number;
    objetivo: string | null;
    es_descarga: boolean;
  }[];

  const weekIds = weeks.map((w) => w.id);

const { data: workoutsRaw } = weekIds.length
    ? await supabase
        .from("workouts")
        .select("id, week_id, nombre, dia, descripcion, es_combo")
        .in("week_id", weekIds)
        .order("orden", { ascending: true })
    : { data: null };

  const workoutsByWeek = new Map<string, typeof workoutsRaw>();
  for (const wo of workoutsRaw ?? []) {
    if (!workoutsByWeek.has(wo.week_id)) workoutsByWeek.set(wo.week_id, []);
    workoutsByWeek.get(wo.week_id)!.push(wo);
  }

  return (
    <div className="flex flex-col gap-8">
      <section>
        <p className="text-sm font-medium text-zinc-500">Tu programa actual</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">
          {program.nombre}
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          {program.objetivo ?? "Objetivo por definir"} ·{" "}
          {program.duracion_semanas ?? "?"} semanas
        </p>
        <div className="mt-4">
          <Link
            href="/alumno/programas"
            className="inline-flex rounded-lg border border-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white"
          >
            Cambiar de programa
          </Link>
        </div>
        {editable ? (
          <p className="mt-4 rounded-xl border border-emerald-900/60 bg-emerald-950/20 px-4 py-3 text-sm text-emerald-200">
            Este programa es de planificación compartida: los anotados pueden
            abrir cada día y armar su rutina con los ejercicios de la biblioteca
            (o crear uno nuevo si falta).
          </p>
        ) : null}
      </section>

      {weeks.length === 0 ? (
        <EmptyState
          title="Tu programa todavía no tiene semanas"
          description="Tu entrenador está armando la planificación."
        />
      ) : (
        <div className="flex flex-col gap-6">
          {weeks.map((week) => {
            const sessions = workoutsByWeek.get(week.id) ?? [];
            return (
              <section
                key={week.id}
                className={`rounded-2xl border p-6 ${
                  week.es_descarga
                    ? "border-amber-900/70 bg-amber-950/20"
                    : "border-zinc-800 bg-zinc-900/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-extrabold">Semana {week.numero}</h2>
                  {week.es_descarga ? (
                    <span className="rounded-full bg-amber-950 px-3 py-1 text-xs font-semibold text-amber-300">
                      Descarga
                    </span>
                  ) : null}
                </div>
                {week.objetivo ? (
                  <p className="mt-1 text-sm text-zinc-400">{week.objetivo}</p>
                ) : null}

                <ul className="mt-4 flex flex-col gap-2">
                  {sessions.length === 0 ? (
                    <li className="text-sm text-zinc-600">
                      Sin sesiones cargadas todavía.
                    </li>
                  ) : (
                    sessions.map((s) => (
                      <li key={s.id}>
                        <Link
                          href={`/alumno/entrenamientos/${s.id}`}
                          className="group flex flex-col gap-3 rounded-xl border border-emerald-900/60 bg-emerald-950/20 px-5 py-4 transition hover:border-emerald-600"
                        >
                          <span className="flex items-center justify-between gap-3">
                            <span className="font-bold text-emerald-200">
                              {labelSesion(s.dia, s.nombre)}
                              {s.es_combo ? (
                                <span className="ml-2 rounded-full bg-amber-950 px-2 py-0.5 text-[11px] font-bold text-amber-300">
                                  Combo
                                </span>
                              ) : null}
                            </span>
                            <span className="text-sm text-emerald-300">▶</span>
                          </span>
                          <span className="inline-flex w-fit rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-zinc-950 transition group-hover:bg-zinc-200">
                            Empezar entrenamiento
                          </span>
                        </Link>
                        {editable ? (
                          <Link
                            href={`/alumno/programa/sesiones/${s.id}`}
                            className="mt-2 inline-flex w-fit rounded-lg border border-zinc-700 px-4 py-2 text-xs font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white"
                          >
                            Editar sesión · armar rutina
                          </Link>
                        ) : null}
                      </li>
                    ))
                  )}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}