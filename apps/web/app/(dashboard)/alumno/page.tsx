import { requireProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Igual que en la pantalla de entrenamiento: un borrador más viejo que esto ya
// no se restaura, así que tampoco tiene sentido ofrecer "continuar".
const DRAFT_MAX_AGE_MS = 3 * 24 * 60 * 60 * 1000;

export default async function AlumnoPage() {
  const { supabase, user, profile } = await requireProfile();

  const athleteRes = await supabase
    .from("athletes")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const athlete = athleteRes.data;

  const [programRes, weekRes, draftRes] = await Promise.all([
    supabase
      .from("athlete_programs")
      .select("id, program_id, estado")
      .eq("athlete_id", athlete?.id ?? "")
      .eq("estado", "activo"),
    supabase
      .from("workout_logs")
      .select("id, fecha, completado")
      .eq("athlete_id", user.id)
      .order("fecha", { ascending: false })
      .limit(10),
    // Borrador más reciente = sesión que quedó a medias (app cerrada, batería,
    // cambio de app). Sirve para ofrecer "continuar entrenamiento" al volver.
    supabase
      .from("workout_drafts")
      .select("workout_id, updated_at")
      .eq("athlete_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const draftRow = draftRes.data as
    | { workout_id: string; updated_at: string }
    | null;

  let draftActual: {
    workoutId: string;
    nombre: string;
    dia: number | null;
    actualizado: string;
  } | null = null;

  if (draftRow) {
    const edad = new Date().getTime() - new Date(draftRow.updated_at).getTime();
    if (edad < DRAFT_MAX_AGE_MS) {
      const { data: workout } = await supabase
        .from("workouts")
        .select("id, nombre, dia")
        .eq("id", draftRow.workout_id)
        .maybeSingle();
      if (workout) {
        draftActual = {
          workoutId: workout.id,
          nombre: workout.nombre,
          dia: workout.dia,
          actualizado: draftRow.updated_at,
        };
      }
    }
  }


  const programIds = (programRes.data ?? [])
    .map((a) => a.program_id)
    .filter((x): x is string => !!x);

  let programs: {
    id: string;
    nombre: string;
    objetivo: string | null;
    nivel: string | null;
    duracion_semanas: number | null;
  }[] = [];
  if (programIds.length > 0) {
    const { data } = await supabase
      .from("programs")
      .select("id, nombre, objetivo, nivel, duracion_semanas")
      .in("id", programIds);
    programs = (data ?? []) as typeof programs;
  }

  const ultimosLogs = weekRes.data ?? [];

  const nombre = [profile.nombre, profile.apellido].filter(Boolean).join(" ");

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8">
        <p className="text-sm font-medium text-zinc-500">
          ATLETIX · Tu espacio
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">
          Hola, {nombre || "atleta"} 👋
        </h1>
        <p className="mt-3 max-w-lg text-zinc-400">
          Acá vas a encontrar tu programa, tus entrenamientos y tu evolución.
        </p>
      </section>

      {draftActual ? (
        <section className="rounded-2xl border border-emerald-800/70 bg-emerald-950/30 p-6">
          <p className="text-xs font-bold tracking-[0.25em] text-emerald-400 uppercase">
            Entrenamiento en curso
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight">
            {draftActual.nombre}
            {draftActual.dia ? (
              <span className="ml-2 text-base font-semibold text-emerald-300/80">
                · Día {draftActual.dia}
              </span>
            ) : null}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-emerald-100/70">
            Lo que cargaste quedó guardado automáticamente. Retomá la sesión
            donde la dejaste, aunque la app se haya cerrado.
          </p>
          <a
            href={`/alumno/entrenamientos/${draftActual.workoutId}`}
            className="mt-4 inline-flex rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-zinc-950 transition hover:bg-zinc-200"
          >
            Continuar entrenamiento →
          </a>
        </section>
      ) : null}

      {programs.length > 0 ? (
        <section className="flex flex-col gap-4">
          <p className="text-xs font-bold tracking-[0.25em] text-zinc-500 uppercase">
            Tus programas
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {programs.map((program) => (
              <div
                key={program.id}
                className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6"
              >
                <h2 className="text-xl font-extrabold">{program.nombre}</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  {program.objetivo ?? "Objetivo por definir"}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full border border-zinc-700 px-3 py-1 text-zinc-300">
                    Nivel: {program.nivel ?? "—"}
                  </span>
                  <span className="rounded-full border border-zinc-700 px-3 py-1 text-zinc-300">
                    {program.duracion_semanas ?? "?"} semanas
                  </span>
                </div>
                <p className="mt-6 text-sm text-zinc-500">
                  Abrí tu programa para ver las semanas y cada sesión de
                  entrenamiento.
                </p>
                <a
                  href="/alumno/programa"
                  className="mt-4 inline-flex rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-zinc-950 transition hover:bg-zinc-200"
                >
                  Ver mi programa →
                </a>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20 p-6">
          <h2 className="text-lg font-bold">Aún no tenés programas</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Elegí los programas del catálogo o creá los tuyos con los ejercicios de la biblioteca.
          </p>
          <div className="mt-4">
            <a
              href="/alumno/programas"
              className="inline-flex rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-zinc-950 transition hover:bg-zinc-200"
            >
              Ver programas y crear el mío →
            </a>
          </div>
        </section>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="Entrenamientos registrados" value={ultimosLogs.length} />
        <StatCard
          label="Último entrenamiento"
          value={ultimosLogs[0]?.completado ? "Completado" : "Sin registrar"}
        />
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}