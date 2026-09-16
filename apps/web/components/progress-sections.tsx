import { requireProfile } from "@/lib/auth";
import { EmptyState, SectionCard } from "@/components/ui";
import { LineChart, BarChart } from "@/components/charts";
import { RegistroProgresoForm } from "@/components/registro-progreso-form";
import { TestChart } from "@/components/test-chart";
import {
  weightSeries,
  testSeries,
  bestRepsSeries,
  bestWeightSeries,
  type ProgressRow,
  type SerieRaw,
} from "@/lib/progress";

export async function ProgressSections({ athleteId }: { athleteId: string }) {
  const { supabase } = await requireProfile();

  const { data: progressRaw } = await supabase
    .from("progress")
    .select("fecha, peso_corporal, tests")
    .eq("athlete_id", athleteId)
    .order("fecha", { ascending: true })
    .limit(200);

  const progress = (progressRaw ?? []) as ProgressRow[];

  const { data: logs } = await supabase
    .from("workout_logs")
    .select("workout_exercise_id, fecha, series_data")
    .eq("athlete_id", athleteId)
    .order("fecha", { ascending: false })
    .limit(500);

  const logList = (logs ?? []) as {
    workout_exercise_id: string;
    fecha: string;
    series_data: SerieRaw[];
  }[];

  const weIds = [...new Set(logList.map((l) => l.workout_exercise_id))];

  const { data: workEx } = weIds.length
    ? await supabase
        .from("workout_exercises")
        .select("id, exercise_id")
        .in("id", weIds)
    : { data: [] };

  const exerciseIds = [
    ...new Set((workEx ?? []).map((w) => w.exercise_id).filter(Boolean)),
  ];

  const { data: library } = exerciseIds.length
    ? await supabase
        .from("exercises")
        .select("id, nombre")
        .in("id", exerciseIds as string[])
    : { data: [] };

  const exIdToName = new Map<string, string>(
    (library ?? []).map((l) => [l.id, l.nombre])
  );
  const weIdToName = new Map<string, string>();
  for (const w of workEx ?? []) {
    if (w.exercise_id && exIdToName.has(w.exercise_id)) {
      weIdToName.set(w.id, exIdToName.get(w.exercise_id)!);
    }
  }

  const logsByWe = new Map<string, { fecha: string; series_data: SerieRaw[] }[]>();
  for (const l of logList) {
    const name = weIdToName.get(l.workout_exercise_id);
    if (!name) continue;
    const list = logsByWe.get(name) ?? [];
    list.push(l);
    logsByWe.set(name, list);
  }

  const exercisesTop = [...logsByWe.entries()]
    .map(([name, ls]) => ({
      name,
      logs: ls,
      reps: bestRepsSeries(ls),
      weight: bestWeightSeries(ls),
    }))
    .sort((a, b) => b.logs.length - a.logs.length)
    .slice(0, 5);

  const peso = weightSeries(progress);
  const tests = testSeries(progress);

  return (
    <div className="flex flex-col gap-8">
      <SectionCard title="Peso corporal">
        <div className="p-6">
          {peso.values.length > 0 ? (
            <>
              <LineChart labels={peso.labels} values={peso.values} unit=" kg" />
              <p className="mt-2 text-sm text-zinc-400">
                Mediciones registradas: {peso.values.length}
              </p>
            </>
          ) : (
            <p className="text-sm text-zinc-600">
              Todavía no hay mediciones de peso registradas.
            </p>
          )}
        </div>
      </SectionCard>

      <SectionCard title="Tests de fuerza / habilidades">
        <div className="p-6">
          {tests.length > 0 ? (
            <TestChart series={tests} />
          ) : (
            <p className="text-sm text-zinc-600">
              Registrá tus PR y tests (dominadas, fondos, planche, front lever)
              y acá va a aparecer la evolución.
            </p>
          )}
        </div>
      </SectionCard>

      <SectionCard title={`Récords por ejercicio (${exercisesTop.length})`}>
        {exercisesTop.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="Todavía no hay récords"
              description="Cuando el alumno complete entrenamientos con la app, acá van a aparecer sus mejores marcas."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 p-6 lg:grid-cols-2">
            {exercisesTop.map((ex) => (
              <div
                key={ex.name}
                className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5"
              >
                <p className="font-extrabold uppercase">{ex.name}</p>
                <div className="mt-1 flex flex-wrap gap-2 text-sm">
                  {ex.reps.best ? (
                    <span className="rounded-full bg-zinc-800 px-3 py-1 text-zinc-200">
                      Récord reps: <strong>{ex.reps.best.value}</strong> (el{" "}
                      {ex.reps.best.fecha.slice(5)})
                    </span>
                  ) : null}
                  {ex.weight.best ? (
                    <span className="rounded-full bg-zinc-800 px-3 py-1 text-zinc-200">
                      Récord peso: <strong>{ex.weight.best.value} kg</strong> (el{" "}
                      {ex.weight.best.fecha.slice(5)})
                    </span>
                  ) : null}
                </div>
                <div className="mt-3">
                  {ex.reps.values.length > 1 ? (
                    <LineChart
                      labels={ex.reps.labels}
                      values={ex.reps.values}
                      color="#a1a1aa"
                    />
                  ) : (
                    <p className="text-xs text-zinc-600">
                      Necesitás más sesiones para ver la curva.
                    </p>
                  )}
                </div>
                {ex.weight.values.length > 1 ? (
                  <div className="mt-3 border-t border-zinc-800 pt-3">
                    <p className="mb-1 text-xs font-semibold tracking-widest text-zinc-500 uppercase">
                      Carga máxima (kg)
                    </p>
                    <BarChart
                      unit=" kg"
                      bars={ex.weight.labels.map((label, i) => ({
                        label: label.slice(5),
                        value: ex.weight.values[i],
                      }))}
                    />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Registrar medición">
        <div className="p-6">
          <RegistroProgresoForm athleteId={athleteId} />
        </div>
      </SectionCard>
    </div>
  );
}