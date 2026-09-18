import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { EmptyState, SectionCard } from "@/components/ui";

export const dynamic = "force-dynamic";

type Serie = {
  serie: number;
  reps?: string | null;
  peso?: string | null;
  rir?: number | null;
  descanso?: number | null;
};

type LogRow = {
  id: string;
  athlete_id: string;
  workout_exercise_id: string;
  fecha: string;
  series_data: Serie[];
  comentarios: string | null;
};

function resumenSeries(series: Serie[]) {
  if (series.length === 0) return "Sin series registradas";

  let mejor = series[0];
  let mejorPuntaje = -1;
  for (const s of series) {
    const peso = parseFloat((s.peso ?? "").replace(",", ".")) || 0;
    const reps = parseFloat((s.reps ?? "").replace(",", ".")) || 0;
    const puntaje = peso * 1000 + reps;
    if (puntaje > mejorPuntaje) {
      mejorPuntaje = puntaje;
      mejor = s;
    }
  }

  const partes: string[] = [];
  if (mejor.reps) partes.push(`${mejor.reps} reps`);
  if (mejor.peso) partes.push(`${mejor.peso} kg`);
  let detalle = partes.join(" × ") || "—";
  if (mejor.rir != null) detalle += ` · RIR ${mejor.rir}`;

  const n = series.length;
  return `${n} ${n === 1 ? "serie" : "series"} · mejor: ${detalle}`;
}

export default async function RegistrosPage({
  searchParams,
}: {
  searchParams: Promise<{ athlete?: string }>;
}) {
  const { athlete } = await searchParams;
  const { supabase, user } = await requireProfile();

  const { data: athletesRes } = await supabase
    .from("athletes")
    .select("user_id")
    .eq("entrenador_id", user.id);

  const athleteIds = [...new Set((athletesRes ?? []).map((a) => a.user_id))];

  let logsQuery = supabase
    .from("workout_logs")
    .select(
      "id, athlete_id, workout_exercise_id, fecha, series_data, comentarios, created_at"
    )
    .in(
      "athlete_id",
      athleteIds.length ? athleteIds : ["00000000-0000-0000-0000-000000000000"]
    )
    .order("created_at", { ascending: false })
    .limit(150);

  if (athlete) logsQuery = logsQuery.eq("athlete_id", athlete);

  const { data: logsRaw } = await logsQuery;
  const logs = (logsRaw ?? []) as LogRow[];

  const weIds = [...new Set(logs.map((l) => l.workout_exercise_id))];
  const athleteUserIds = [...new Set(logs.map((l) => l.athlete_id))];

  const [weRes, profilesRes] = await Promise.all([
    weIds.length
      ? supabase.from("workout_exercises").select("id, exercise_id").in("id", weIds)
      : Promise.resolve({ data: [] as { id: string; exercise_id: string | null }[] }),
    athleteUserIds.length
      ? supabase
          .from("profiles")
          .select("id, nombre, apellido, email")
          .in("id", athleteUserIds)
      : Promise.resolve({ data: [] as { id: string; nombre: string | null; apellido: string | null; email: string | null }[] }),
  ]);

  const exIds = [
    ...new Set(
      (weRes.data ?? [])
        .map((w) => w.exercise_id)
        .filter((x): x is string => !!x)
    ),
  ];

  const { data: library } = exIds.length
    ? await supabase.from("exercises").select("id, nombre").in("id", exIds)
    : { data: [] as { id: string; nombre: string }[] };

  const exNameMap = new Map((library ?? []).map((e) => [e.id, e.nombre]));
  const weNameMap = new Map<string, string>();
  for (const w of weRes.data ?? []) {
    if (w.exercise_id && exNameMap.has(w.exercise_id)) {
      weNameMap.set(w.id, exNameMap.get(w.exercise_id)!);
    }
  }

  const profileMap = new Map(
    (profilesRes.data ?? []).map((p) => [
      p.id,
      [p.nombre, p.apellido].filter(Boolean).join(" ") || p.email || "Alumno",
    ])
  );

  const athleteOptions = [
    ...new Map(
      logs.map((l) => [l.athlete_id, profileMap.get(l.athlete_id) ?? "Alumno"])
    ).entries(),
  ].sort((a, b) => a[1].localeCompare(b[1]));

  const byDate = new Map<string, LogRow[]>();
  for (const l of logs) {
    const list = byDate.get(l.fecha) ?? [];
    list.push(l);
    byDate.set(l.fecha, list);
  }

  const filtroNombre = athlete ? profileMap.get(athlete) ?? "Alumno" : null;

  return (
    <div className="flex flex-col gap-8">
      <section>
        <p className="text-sm font-medium text-zinc-500">Panel del entrenador</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Registros</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Lo que cargaron tus alumnos: cuántas series hicieron y su mejor serie.
        </p>
      </section>

      {athleteOptions.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          <Link
            href="/entrenador/registros"
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              !athlete
                ? "bg-white text-zinc-950"
                : "border border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white"
            }`}
          >
            Todos
          </Link>
          {athleteOptions.map(([id, nombre]) => (
            <Link
              key={id}
              href={`/entrenador/registros?athlete=${id}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                athlete === id
                  ? "bg-white text-zinc-950"
                  : "border border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white"
              }`}
            >
              {nombre}
            </Link>
          ))}
        </div>
      ) : null}

      {logs.length === 0 ? (
        <EmptyState
          title={
            filtroNombre
              ? `${filtroNombre} todavía no registró entrenamientos`
              : "Todavía no hay registros"
          }
          description="Cuando tus alumnos completen entrenamientos con la app, acá vas a ver sus series, cargas y comentarios."
        />
      ) : (
        <div className="flex flex-col gap-6">
          {[...byDate.entries()].map(([fecha, items]) => (
            <SectionCard key={fecha} title={fecha}>
              <ul className="divide-y divide-zinc-800">
                {items.map((log) => (
                  <li key={log.id} className="px-6 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-baseline gap-2">
                        <p className="font-semibold">
                          {profileMap.get(log.athlete_id) ?? "Alumno"}
                        </p>
                        <span className="text-xs text-zinc-600">·</span>
                        <p className="text-sm font-medium text-zinc-400">
                          {weNameMap.get(log.workout_exercise_id) ?? "Ejercicio"}
                        </p>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-zinc-400">
                      {resumenSeries(log.series_data ?? [])}
                    </p>
                    {log.comentarios ? (
                      <p className="mt-2 rounded-lg bg-zinc-950/60 px-3 py-2 text-xs text-zinc-400">
                        💬 {log.comentarios}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </SectionCard>
          ))}
        </div>
      )}
    </div>
  );
}
