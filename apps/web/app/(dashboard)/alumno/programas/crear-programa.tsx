"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Field, LinkButton, Select, TextInput } from "@/components/ui";
import { LEVELS, CATEGORIAS } from "@/lib/levels";

type LibraryExercise = {
  id: string;
  nombre: string;
  categoria: string | null;
  dificultad: string | null;
};

type DayExercise = {
  exercise_id: string;
  nombre: string;
  series: string;
  repeticiones: string;
  descanso: string;
};

type Day = {
  nombre: string;
  exercises: DayExercise[];
};

export function CrearProgramaForm({ exercises }: { exercises: LibraryExercise[] }) {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    nombre: "",
    objetivo: "",
    nivel: "Principiante",
    categoria: "general",
  });
  const [days, setDays] = useState<Day[]>([{ nombre: "", exercises: [] }]);
  const [pickerDay, setPickerDay] = useState<number | null>(null);
  const [pickerSearch, setPickerSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setDayName(idx: number, value: string) {
    setDays((d) => d.map((day, i) => (i === idx ? { ...day, nombre: value } : day)));
  }

  function addDay() {
    setDays((d) => [...d, { nombre: "", exercises: [] }]);
  }

  function removeDay(idx: number) {
    setDays((d) => d.filter((_, i) => i !== idx));
  }

  function addExerciseToDay(idx: number, ex: LibraryExercise) {
    setDays((d) =>
      d.map((day, i) =>
        i === idx
          ? { ...day, exercises: [...day.exercises, { exercise_id: ex.id, nombre: ex.nombre, series: "3", repeticiones: "8-12", descanso: "90" }] }
          : day
      )
    );
  }

  function removeExerciseFromDay(idx: number, exId: string) {
    setDays((d) =>
      d.map((day, i) =>
        i === idx ? { ...day, exercises: day.exercises.filter((e) => e.exercise_id !== exId) } : day
      )
    );
  }

  function patchDayExercise(idx: number, exId: string, patch: Partial<DayExercise>) {
    setDays((d) =>
      d.map((day, i) =>
        i === idx
          ? { ...day, exercises: day.exercises.map((e) => (e.exercise_id === exId ? { ...e, ...patch } : e)) }
          : day
      )
    );
  }

  const filtered = useMemo(() => {
    const q = pickerSearch.trim().toLowerCase();
    if (!q) return exercises;
    return exercises.filter((e) => e.nombre.toLowerCase().includes(q));
  }, [exercises, pickerSearch]);

  const totalExercises = days.reduce((acc, d) => acc + d.exercises.length, 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (totalExercises === 0) {
      setError("Agregá al menos un ejercicio en algún día.");
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("No se pudo identificar tu cuenta. Volvé a entrar.");
      setLoading(false);
      return;
    }

    // 1) Ficha del alumno
    const { data: athlete } = await supabase
      .from("athletes")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    let athleteId = athlete?.id ?? null;

    if (!athleteId) {
      const { error: insErr } = await supabase.from("athletes").insert({
        user_id: user.id,
        entrenador_id: null,
        nivel: form.nivel,
        estado: "activo",
        objetivo: form.objetivo.trim() || null,
      });
      if (insErr) {
        setError(insErr.message);
        setLoading(false);
        return;
      }
      const { data: created } = await supabase
        .from("athletes")
        .select("id")
        .eq("user_id", user.id)
        .single();
      athleteId = created?.id;
    }

    if (!athleteId) {
      setError("No se pudo crear tu ficha. Volvé a intentar.");
      setLoading(false);
      return;
    }

    // 2) Programa personal
    const { data: program, error: progErr } = await supabase
      .from("programs")
      .insert({
        nombre: form.nombre.trim(),
        objetivo: form.objetivo.trim() || null,
        nivel: form.nivel,
        duracion_semanas: 1,
        entrenador_id: null,
        activo: false,
        created_by: user.id,
        categoria: form.categoria,
        descripcion: "Programa creado por el alumno con ejercicios de la biblioteca.",
      })
      .select("id")
      .single();
    if (progErr) {
      setError(progErr.message);
      setLoading(false);
      return;
    }

    // 3) Semana 1
    const { data: week, error: weekErr } = await supabase
      .from("weeks")
      .insert({
        program_id: program.id,
        numero: 1,
        bloque: 1,
        objetivo: "Semana 1 · tu programa propio",
        es_descarga: false,
      })
      .select("id")
      .single();
    if (weekErr) {
      setError(weekErr.message);
      setLoading(false);
      return;
    }

    // 4) Días (sesiones) + ejercicios
    for (const [i, day] of days.entries()) {
      if (day.exercises.length === 0) continue;
      const { data: workout, error: woErr } = await supabase
        .from("workouts")
        .insert({
          week_id: week.id,
          nombre: day.nombre.trim() || `Día ${i + 1}`,
          dia: i + 1,
          orden: i + 1,
          descripcion: "Descanso: usá el cronómetro de la app.",
        })
        .select("id")
        .single();
      if (woErr) {
        setError(woErr.message);
        setLoading(false);
        return;
      }
      for (const [j, ex] of day.exercises.entries()) {
        const { error: weErr } = await supabase.from("workout_exercises").insert({
          workout_id: workout.id,
          exercise_id: ex.exercise_id,
          orden: j + 1,
          series: Number(ex.series) || 3,
          repeticiones: ex.repeticiones.trim() || null,
          descanso_segundos: Number(ex.descanso) || null,
        });
        if (weErr) {
          setError(weErr.message);
          setLoading(false);
          return;
        }
      }
    }

    // 5) Inscripción (puede sumar varios programas activos a la vez)
    const { error: enrollErr } = await supabase.from("athlete_programs").insert({
      athlete_id: athleteId,
      program_id: program.id,
      fecha_inicio: new Date().toISOString().slice(0, 10),
      estado: "activo",
    });
    if (enrollErr) {
      setError(enrollErr.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/alumno/programa");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6"
    >
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <Field label="Nombre del programa *">
          <TextInput
            required
            value={form.nombre}
            onChange={(e) => set("nombre", e.target.value)}
            placeholder="Ej: Mi rutina full body"
          />
        </Field>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Categoría">
            <Select value={form.categoria} onChange={(e) => set("categoria", e.target.value)}>
              {CATEGORIAS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Nivel">
            <Select value={form.nivel} onChange={(e) => set("nivel", e.target.value)}>
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Objetivo">
            <TextInput
              value={form.objetivo}
              onChange={(e) => set("objetivo", e.target.value)}
              placeholder="Ej: Mejorar mis dominadas"
            />
          </Field>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold">Tus días</h2>
          <Button type="button" variant="secondary" onClick={addDay}>
            + Agregar día
          </Button>
        </div>

        {days.map((day, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-extrabold text-emerald-300">Día {idx + 1}</h3>
              {days.length > 1 ? (
                <button
                  type="button"
                  onClick={() => removeDay(idx)}
                  className="text-xs text-zinc-500 transition hover:text-red-400"
                >
                  Eliminar día
                </button>
              ) : null}
            </div>

            <div className="mt-3">
              <Field label="Nombre del día (opcional)">
                <TextInput
                  value={day.nombre}
                  onChange={(e) => setDayName(idx, e.target.value)}
                  placeholder={`Ej: Empuje, Tirón, Full body…`}
                />
              </Field>
            </div>

            {day.exercises.length > 0 ? (
              <ul className="mt-4 flex flex-col gap-2">
                {day.exercises.map((ex) => (
                  <li
                    key={ex.exercise_id}
                    className="rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">{ex.nombre}</p>
                      <button
                        type="button"
                        onClick={() => removeExerciseFromDay(idx, ex.exercise_id)}
                        className="text-xs text-zinc-500 transition hover:text-red-400"
                      >
                        Quitar
                      </button>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      <label className="flex flex-col gap-1 text-xs text-zinc-500">
                        Series
                        <input
                          type="number"
                          min={1}
                          value={ex.series}
                          onChange={(e) => patchDayExercise(idx, ex.exercise_id, { series: e.target.value })}
                          className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-100 outline-none focus:border-zinc-500"
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-xs text-zinc-500">
                        Reps
                        <input
                          value={ex.repeticiones}
                          onChange={(e) => patchDayExercise(idx, ex.exercise_id, { repeticiones: e.target.value })}
                          placeholder="8-12"
                          className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-100 outline-none focus:border-zinc-500"
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-xs text-zinc-500">
                        Descanso (seg)
                        <input
                          type="number"
                          min={0}
                          value={ex.descanso}
                          onChange={(e) => patchDayExercise(idx, ex.exercise_id, { descanso: e.target.value })}
                          className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-100 outline-none focus:border-zinc-500"
                        />
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-zinc-600">
                Todavía no agregaste ejercicios a este día.
              </p>
            )}

            {pickerDay === idx ? (
              <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <TextInput
                    autoFocus
                    value={pickerSearch}
                    onChange={(e) => setPickerSearch(e.target.value)}
                    placeholder="Buscar ejercicio de la biblioteca…"
                    className="w-full"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setPickerDay(null);
                      setPickerSearch("");
                    }}
                  >
                    Cerrar
                  </Button>
                </div>
                <ul className="mt-3 flex max-h-72 flex-col gap-1 overflow-y-auto">
                  {filtered.length === 0 ? (
                    <li className="px-2 py-3 text-sm text-zinc-600">
                      No se encontraron ejercicios con ese nombre.
                    </li>
                  ) : (
                    filtered.slice(0, 40).map((ex) => {
                      const already = day.exercises.some(
                        (e) => e.exercise_id === ex.id
                      );
                      return (
                        <li key={ex.id}>
                          <button
                            type="button"
                            disabled={already}
                            onClick={() => addExerciseToDay(idx, ex)}
                            className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-zinc-900 disabled:opacity-40"
                          >
                            <span className="text-sm font-medium">{ex.nombre}</span>
                            <span className="text-xs text-zinc-500">
                              {ex.categoria ?? ""}
                              {ex.categoria && ex.dificultad ? " · " : ""}
                              {ex.dificultad ?? ""}
                            </span>
                          </button>
                        </li>
                      );
                    })
                  )}
                </ul>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setPickerDay(idx);
                  setPickerSearch("");
                }}
                className="mt-4 w-fit rounded-lg border border-zinc-800 px-3 py-2 text-xs font-medium text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-200"
              >
                + Agregar ejercicio de la biblioteca
              </button>
            )}
          </div>
        ))}
      </section>

      {error ? (
        <p className="rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-zinc-500">
          {totalExercises} ejercicio{totalExercises === 1 ? "" : "s"} en {days.length} día
          {days.length === 1 ? "" : "s"}
        </p>
        <div className="flex items-center gap-3">
          <LinkButton href="/alumno/programas">Cancelar</LinkButton>
          <Button type="submit" disabled={loading}>
            {loading ? "Creando tu programa…" : "Crear y empezar mi programa"}
          </Button>
        </div>
      </div>
    </form>
  );
}