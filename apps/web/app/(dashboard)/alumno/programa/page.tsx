import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { EmptyState } from "@/components/ui";
import { esProgramaPlanificable, labelSesion } from "@/lib/levels";

export const dynamic = "force-dynamic";

type ProgramaConDatos = {
  programa: {
    id: string;
    nombre: string;
    objetivo: string | null;
    nivel: string | null;
    duracion_semanas: number | null;
    descripcion: string | null;
    categoria: string | null;
  };
  semanas: {
    id: string;
    numero: number;
    objetivo: string | null;
    es_descarga: boolean;
    sesiones: {
      id: string;
      nombre: string;
      dia: number | null;
      descripcion: string | null;
      es_combo: boolean;
    }[];
  }[];
};

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
          description="Entrá al catálogo y elegí los programas que quieras empezar."
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

  const { data: assignments } = await supabase
    .from("athlete_programs")
    .select("program_id, estado, fecha_inicio")
    .eq("athlete_id", athlete.id)
    .eq("estado", "activo")
    .order("created_at", { ascending: true });

  const asignaciones = (assignments ?? []) as {
    program_id: string;
    estado: string;
    fecha_inicio: string | null;
  }[];

  if (asignaciones.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <EmptyState
          title="Todavía no elegiste ningún programa"
          description="Entrá al catálogo, mirá las opciones y empezá las que más te sirvan."
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

  const programIds = asignaciones.map((a) => a.program_id);

  const { data: programsRaw } = await supabase
    .from("programs")
    .select("id, nombre, objetivo, nivel, duracion_semanas, descripcion, categoria")
    .in("id", programIds);

  const programs = (programsRaw ?? []) as {
    id: string;
    nombre: string;
    objetivo: string | null;
    nivel: string | null;
    duracion_semanas: number | null;
    descripcion: string | null;
    categoria: string | null;
  }[];

  const { data: weeksRaw } = await supabase
    .from("weeks")
    .select("id, program_id, numero, objetivo, es_descarga")
    .in("program_id", programIds)
    .order("numero", { ascending: true });

  const weeks = (weeksRaw ?? []) as {
    id: string;
    program_id: string;
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

  const workouts = (workoutsRaw ?? []) as {
    id: string;
    week_id: string;
    nombre: string;
    dia: number | null;
    descripcion: string | null;
    es_combo: boolean;
  }[];

  const workoutsByWeek = new Map<string, typeof workouts>();
  for (const wo of workouts) {
    if (!workoutsByWeek.has(wo.week_id)) workoutsByWeek.set(wo.week_id, []);
    workoutsByWeek.get(wo.week_id)!.push(wo);
  }

  const semanasByProgram = new Map<string, ProgramaConDatos["semanas"]>();
  for (const w of weeks) {
    if (!semanasByProgram.has(w.program_id)) semanasByProgram.set(w.program_id, []);
    semanasByProgram.get(w.program_id)!.push({
      id: w.id,
      numero: w.numero,
      objetivo: w.objetivo,
      es_descarga: w.es_descarga,
      sesiones: workoutsByWeek.get(w.id) ?? [],
    });
  }

  const lista: ProgramaConDatos[] = programs.map((p) => ({
    programa: p,
    semanas: semanasByProgram.get(p.id) ?? [],
  }));

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-500">Tus programas</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Mis programas</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Podés tener varios programas activos a la vez. Abrí el que quieras
            para ver sus semanas y entrenar.
          </p>
        </div>
        <Link
          href="/alumno/programas"
          className="rounded-lg border border-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white"
        >
          Agregar / cambiar programas
        </Link>
      </section>

      {lista.length === 0 ? (
        <EmptyState
          title="No se encontraron tus programas"
          description="Pedile a tu entrenador o revisá el catálogo."
        />
      ) : (
        <div className="flex flex-col gap-6">
          {lista.map(({ programa, semanas }) => {
            const editable = esProgramaPlanificable(
              programa.nombre,
              programa.categoria
            );
            return (
              <section
                key={programa.id}
                className="flex flex-col gap-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6"
              >
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight">
                    {programa.nombre}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-400">
                    {programa.objetivo ?? "Objetivo por definir"} ·{" "}
                    {programa.duracion_semanas ?? "?"} semanas
                  </p>
                  {programa.descripcion ? (
                    <p className="mt-1 text-sm text-zinc-500">
                      {programa.descripcion}
                    </p>
                  ) : null}
                  {editable ? (
                    <p className="mt-3 rounded-xl border border-emerald-900/60 bg-emerald-950/20 px-4 py-3 text-sm text-emerald-200">
                      Este programa es de planificación compartida: los anotados
                      pueden abrir cada día y armar su rutina con los ejercicios
                      de la biblioteca (o crear uno nuevo si falta).
                    </p>
                  ) : null}
                </div>

                {semanas.length === 0 ? (
                  <EmptyState
                    title="Este programa todavía no tiene semanas"
                    description="Tu entrenador está armando la planificación."
                  />
                ) : (
                  <div className="flex flex-col gap-4">
                    {semanas.map((week) => (
                      <div
                        key={week.id}
                        className={`rounded-2xl border p-5 ${
                          week.es_descarga
                            ? "border-amber-900/70 bg-amber-950/20"
                            : "border-zinc-800 bg-zinc-900/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-extrabold">
                            Semana {week.numero}
                          </h3>
                          {week.es_descarga ? (
                            <span className="rounded-full bg-amber-950 px-3 py-1 text-xs font-semibold text-amber-300">
                              Descarga
                            </span>
                          ) : null}
                        </div>
                        {week.objetivo ? (
                          <p className="mt-1 text-sm text-zinc-400">
                            {week.objetivo}
                          </p>
                        ) : null}

                        <ul className="mt-3 flex flex-col gap-2">
                          {week.sesiones.length === 0 ? (
                            <li className="text-sm text-zinc-600">
                              Sin sesiones cargadas todavía.
                            </li>
                          ) : (
                            week.sesiones.map((s) => (
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
                                    <span className="text-sm text-emerald-300">
                                      ▶
                                    </span>
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
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}