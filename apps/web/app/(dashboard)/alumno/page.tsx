import { requireProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AlumnoPage() {
  const { supabase, user, profile } = await requireProfile();

  const [athleteRes, cvRes] = await Promise.all([
    supabase
      .from("athletes")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("videos")
      .select("id, estado")
      .eq("athlete_id", user.id)
      .eq("estado", "pendiente"),
  ]);

  const athlete = athleteRes.data;
  const videosPendientes = cvRes.data?.length ?? 0;

  const [programRes, weekRes] = await Promise.all([
    supabase
      .from("athlete_programs")
      .select("id, program_id, estado")
      .eq("athlete_id", athlete?.id ?? "")
      .eq("estado", "activo")
      .maybeSingle(),
    supabase
      .from("workout_logs")
      .select("id, fecha, completado")
      .eq("athlete_id", user.id)
      .order("fecha", { ascending: false })
      .limit(10),
  ]);

  const programId = programRes.data?.program_id ?? null;

  let program = null;
  if (programId) {
    const { data } = await supabase
      .from("programs")
      .select("id, nombre, objetivo, nivel, duracion_semanas")
      .eq("id", programId)
      .single();
    program = data;
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

      {program ? (
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <p className="text-xs font-bold tracking-[0.25em] text-zinc-500 uppercase">
            Tu programa actual
          </p>
          <h2 className="mt-2 text-2xl font-extrabold">{program.nombre}</h2>
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
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20 p-6">
          <h2 className="text-lg font-bold">Aún no tenés programa</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Elegí uno del catálogo o creá el tuyo con los ejercicios de la biblioteca.
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

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Videos pendientes de revisión" value={videosPendientes} />
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