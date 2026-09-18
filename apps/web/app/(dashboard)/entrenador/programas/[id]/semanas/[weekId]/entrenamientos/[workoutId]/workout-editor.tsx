"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Field, SectionCard } from "@/components/ui";

type ExerciseItem = {
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
  exercise_nombre: string;
  exercise_categoria: string;
};

type LogItem = {
  id: string;
  fecha: string;
  series_data: {
    serie: number;
    reps?: string | null;
    peso?: string | null;
    rir?: number | null;
  }[];
  comentarios: string | null;
  athlete: string;
  exercise: string;
  workout_exercise_id: string;
};

export function WorkoutEditor({
  workoutId,
  exercises,
  library,
  logs = [],
  esCombo = false,
}: {
  workoutId: string;
  exercises: ExerciseItem[];
  library: { id: string; nombre: string; categoria: string }[];
  logs?: LogItem[];
  esCombo?: boolean;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-8">
      {esCombo ? (
        <div className="rounded-2xl border border-amber-900/60 bg-amber-950/20 px-5 py-4">
          <p className="text-sm font-bold text-amber-200">
            Esta sesión es un combo / circuito
          </p>
          <p className="mt-1 text-sm text-amber-300/80">
            Agregá entre 5 y 8 ejercicios en orden. El alumno los va a hacer uno
            atrás de otro y al final va a anotar las rondas y el descanso.
          </p>
        </div>
      ) : null}
      {exercises.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20 px-6 py-12 text-center">
          <p className="text-sm font-semibold text-zinc-400">
            Esta sesión no tiene ejercicios todavía
          </p>
          <p className="mt-1 text-sm text-zinc-600">
            Usá el formulario de abajo para agregar el primero.
          </p>
        </div>
      ) : null}

      <ol className="flex flex-col gap-4">
        {exercises.map((ex, index) => (
          <ExerciseRow key={ex.id} index={index} exercise={ex} />
        ))}
      </ol>

      <AddExerciseForm
        workoutId={workoutId}
        library={library}
        nextOrder={exercises.length + 1}
        onSaved={() => router.refresh()}
      />

      {logs.length > 0 ? (
        <SectionCard title="Registros de tus alumnos">
          <ul className="divide-y divide-zinc-800">
            {logs.map((log) => {
              const resumen = log.series_data
                .map((s) => {
                  const partes: string[] = [];
                  if (s.reps) partes.push(`${s.reps} reps`);
                  if (s.peso) partes.push(`${s.peso} kg`);
                  if (s.rir != null) partes.push(`RIR ${s.rir}`);
                  return `S${s.serie}: ${partes.join(" · ") || "—"}`;
                })
                .join("  |  ");
              return (
                <li key={log.id} className="px-6 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{log.exercise}</p>
                    <p className="text-xs text-zinc-500">
                      {log.fecha} · {log.athlete}
                    </p>
                  </div>
                  <p className="text-sm text-zinc-400">{resumen || "—"}</p>
                  {log.comentarios ? (
                    <p className="mt-1 rounded-lg bg-zinc-950/60 px-3 py-2 text-xs text-zinc-400">
                      💬 {log.comentarios}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </SectionCard>
      ) : null}
    </div>
  );
}

function AddExerciseForm({
  workoutId,
  library,
  nextOrder,
  onSaved,
}: {
  workoutId: string;
  library: { id: string; nombre: string; categoria: string }[];
  nextOrder: number;
  onSaved: () => void;
}) {
  const supabase = createClient();
  const [exerciseId, setExerciseId] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [series, setSeries] = useState("3");
  const [repeticiones, setRepeticiones] = useState("");
  const [rir, setRir] = useState("");
  const [descanso, setDescanso] = useState("");
  const [peso, setPeso] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const seleccionado = library.find((l) => l.id === exerciseId) ?? null;
  const q = busqueda.trim().toLowerCase();
  const filtrados = library
    .filter(
      (l) =>
        !q ||
        l.nombre.toLowerCase().includes(q) ||
        l.categoria.toLowerCase().includes(q)
    )
    .sort((a, b) => a.nombre.localeCompare(b.nombre))
    .slice(0, 80);

  async function handleAdd() {
    if (!exerciseId) {
      setError("Elegí un ejercicio de la biblioteca.");
      return;
    }
    setError(null);
    setLoading(true);

    const { error } = await supabase.from("workout_exercises").insert({
      workout_id: workoutId,
      exercise_id: exerciseId,
      orden: nextOrder,
      series: series ? Number(series) : null,
      repeticiones: repeticiones.trim() || null,
      rir: rir ? Number(rir) : null,
      descanso_segundos: descanso ? Number(descanso) : null,
      peso: peso.trim() || null,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setRepeticiones("");
    setRir("");
    setDescanso("");
    setPeso("");
    setLoading(false);
    onSaved();
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
      <h2 className="text-lg font-bold">Agregar ejercicio</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Buscá el ejercicio en la biblioteca y cargá los parámetros de la sesión.
      </p>

      <div className="mt-4 flex flex-col gap-4">
        <Field label="Buscar ejercicio *">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Escribí para buscar (ej: plancha, dominada, fondos…)"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-zinc-500"
          />
        </Field>

        {seleccionado ? (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-emerald-800/70 bg-emerald-950/20 px-4 py-3">
            <p className="text-sm font-semibold text-emerald-200">
              {seleccionado.nombre}
              <span className="ml-2 text-xs font-normal text-emerald-300/70">
                ({seleccionado.categoria})
              </span>
            </p>
            <button
              type="button"
              onClick={() => {
                setExerciseId("");
                setBusqueda("");
              }}
              className="rounded-lg border border-zinc-700 px-2 py-1 text-xs text-zinc-300 transition hover:border-zinc-500"
            >
              Quitar
            </button>
          </div>
        ) : (
          <div className="max-h-64 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-950/60">
            {filtrados.length === 0 ? (
              <p className="px-4 py-3 text-sm text-zinc-500">
                No encontré ejercicios con ese nombre.
              </p>
            ) : (
              filtrados.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => {
                    setExerciseId(l.id);
                    setBusqueda("");
                  }}
                  className="flex w-full items-center justify-between gap-3 border-b border-zinc-800/70 px-4 py-2.5 text-left transition last:border-b-0 hover:bg-zinc-900"
                >
                  <span className="text-sm font-medium text-zinc-100">
                    {l.nombre}
                  </span>
                  <span className="shrink-0 text-xs text-zinc-500">
                    {l.categoria}
                  </span>
                </button>
              ))
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          <Field label="Series">
            <input
              type="number"
              min={0}
              value={series}
              onChange={(e) => setSeries(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-zinc-500"
            />
          </Field>
          <Field label="Repeticiones">
            <input
              value={repeticiones}
              onChange={(e) => setRepeticiones(e.target.value)}
              placeholder="Ej: 5 o 5x"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-zinc-500"
            />
          </Field>
          <Field label="RIR">
            <input
              type="number"
              min={0}
              value={rir}
              onChange={(e) => setRir(e.target.value)}
              placeholder="0-4"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-zinc-500"
            />
          </Field>
          <Field label="Descanso (seg)">
            <input
              type="number"
              min={0}
              value={descanso}
              onChange={(e) => setDescanso(e.target.value)}
              placeholder="180"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-zinc-500"
            />
          </Field>
          <Field label="Peso">
            <input
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              placeholder="Ej: +20kg"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-zinc-500"
            />
          </Field>
        </div>

        {error && (
          <p className="rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <div className="flex justify-end">
          <Button type="button" onClick={handleAdd} disabled={loading}>
            {loading ? "Agregando…" : "+ Agregar ejercicio"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ExerciseRow({ index, exercise }: { index: number; exercise: ExerciseItem }) {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    series: exercise.series?.toString() ?? "",
    repeticiones: exercise.repeticiones ?? "",
    tiempo: exercise.tiempo ?? "",
    rir: exercise.rir?.toString() ?? "",
    descanso_segundos: exercise.descanso_segundos?.toString() ?? "",
    peso: exercise.peso ?? "",
    tempo: exercise.tempo ?? "",
    asistencia: exercise.asistencia ?? "",
    notas: exercise.notas ?? "",
    video_url: exercise.video_url ?? "",
    sugerencia: exercise.sugerencia_progresion ?? "",
  });

  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    setStatus("saving");
    const { error } = await supabase
      .from("workout_exercises")
      .update({
        series: form.series ? Number(form.series) : null,
        repeticiones: form.repeticiones.trim() || null,
        tiempo: form.tiempo.trim() || null,
        rir: form.rir ? Number(form.rir) : null,
        descanso_segundos: form.descanso_segundos
          ? Number(form.descanso_segundos)
          : null,
        peso: form.peso.trim() || null,
        tempo: form.tempo.trim() || null,
        asistencia: form.asistencia.trim() || null,
        notas: form.notas.trim() || null,
        video_url: form.video_url.trim() || null,
        sugerencia_progresion: form.sugerencia.trim() || null,
      })
      .eq("id", exercise.id);

    if (error) {
      setStatus("error");
      return;
    }
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2000);
    router.refresh();
  }

  async function handleDelete() {
    await supabase.from("workout_exercises").delete().eq("id", exercise.id);
    router.refresh();
  }

  return (
    <li className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-sm font-bold text-zinc-300">
            {index + 1}
          </span>
          <div>
            <p className="font-bold">{exercise.exercise_nombre}</p>
            <p className="text-xs text-zinc-500">{exercise.exercise_categoria}</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="rounded-lg border border-red-900/70 px-3 py-1.5 text-xs text-red-300 transition hover:bg-red-950/40"
        >
          Eliminar
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <RowField label="Series" value={form.series} onChange={(v) => set("series", v)} />
        <RowField
          label="Repeticiones"
          value={form.repeticiones}
          onChange={(v) => set("repeticiones", v)}
        />
        <RowField label="Tiempo" value={form.tiempo} onChange={(v) => set("tiempo", v)} />
        <RowField label="RIR" value={form.rir} onChange={(v) => set("rir", v)} />
        <RowField
          label="Descanso (seg)"
          value={form.descanso_segundos}
          onChange={(v) => set("descanso_segundos", v)}
        />
        <RowField label="Peso" value={form.peso} onChange={(v) => set("peso", v)} />
        <RowField label="Tempo" value={form.tempo} onChange={(v) => set("tempo", v)} />
        <RowField
          label="Asistencia"
          value={form.asistencia}
          onChange={(v) => set("asistencia", v)}
        />
        <RowField label="Video URL" value={form.video_url} onChange={(v) => set("video_url", v)} />
        <div className="col-span-2 lg:col-span-5">
          <RowField label="Notas" value={form.notas} onChange={(v) => set("notas", v)} />
        </div>
        <div className="col-span-2 lg:col-span-5">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-zinc-500">
              Sugerencia de progresión para el alumno (opcional)
            </span>
            <textarea
              value={form.sugerencia}
              onChange={(e) => set("sugerencia", e.target.value)}
              rows={2}
              placeholder="Dejalo vacío si no querés sugerir nada"
              className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-zinc-500"
            />
            <span className="text-[11px] text-zinc-600">
              Si queda vacío, no se muestra nada en la vista del alumno.
            </span>
          </label>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-3">
        {status === "saved" ? (
          <span className="text-xs font-medium text-emerald-300">Guardado ✓</span>
        ) : null}
        {status === "error" ? (
          <span className="text-xs font-medium text-red-300">Error al guardar</span>
        ) : null}
        <Button type="button" variant="secondary" onClick={handleSave} disabled={status === "saving"}>
          {status === "saving" ? "Guardando…" : "Guardar cambios"}
        </Button>
      </div>
    </li>
  );
}

function RowField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-zinc-500">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-zinc-500"
      />
    </label>
  );
}