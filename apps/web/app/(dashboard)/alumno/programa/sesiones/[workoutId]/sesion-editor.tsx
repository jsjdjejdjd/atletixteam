"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Field, Select, TextInput } from "@/components/ui";
import { LEVELS, DISCIPLINAS, categoriasDe } from "@/lib/levels";

type Row = {
  id: string;
  exercise_id: string | null;
  orden: number;
  series: number | null;
  repeticiones: string | null;
  descanso_segundos: number | null;
  exercise_nombre: string;
  exercise_categoria: string;
};

type LibraryExercise = {
  id: string;
  nombre: string;
  categoria: string | null;
  dificultad: string | null;
};

export function SesionEditor({
  workoutId,
  rows,
  library,
}: {
  workoutId: string;
  rows: Row[];
  library: LibraryExercise[];
}) {
  const router = useRouter();
  const supabase = createClient();

  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return library;
    return library.filter((e) => e.nombre.toLowerCase().includes(q));
  }, [library, search]);

  const nextOrder = Math.max(0, ...rows.map((r) => r.orden)) + 1;

  async function addExercise(ex: LibraryExercise) {
    setError(null);
    const { error } = await supabase.from("workout_exercises").insert({
      workout_id: workoutId,
      exercise_id: ex.id,
      orden: nextOrder,
      series: 3,
      descanso_segundos: 90,
    });
    if (error) {
      setError(error.message);
      return;
    }
    setSearch("");
    setPickerOpen(false);
    router.refresh();
  }

  async function handleCreateNew(
    name: string,
    disciplina: string,
    categoria: string,
    dificultad: string
  ) {
    setError(null);
    const { data: creado, error: insErr } = await supabase
      .from("exercises")
      .insert({
        nombre: name.trim(),
        disciplina,
        categoria,
        tipo: disciplina,
        dificultad,
        activo: true,
      })
      .select("id")
      .single();
    if (insErr || !creado) {
      setError(insErr?.message ?? "No se pudo crear el ejercicio.");
      return;
    }
    const { error: weErr } = await supabase.from("workout_exercises").insert({
      workout_id: workoutId,
      exercise_id: creado.id,
      orden: nextOrder,
      series: 3,
      descanso_segundos: 90,
    });
    if (weErr) {
      setError(weErr.message);
      return;
    }
    setCreateOpen(false);
    router.refresh();
  }

  async function handleReorder(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= rows.length) return;
    const a = rows[index];
    const b = rows[target];
    await Promise.all([
      supabase
        .from("workout_exercises")
        .update({ orden: b.orden })
        .eq("id", a.id),
      supabase
        .from("workout_exercises")
        .update({ orden: a.orden })
        .eq("id", b.id),
    ]);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-8">
      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20 px-6 py-12 text-center">
          <p className="text-sm font-semibold text-zinc-400">
            Esta sesión todavía no tiene ejercicios
          </p>
          <p className="mt-1 text-sm text-zinc-600">
            Agregá los primeros desde la biblioteca para empezar a planificar.
          </p>
        </div>
      ) : (
        <ol className="flex flex-col gap-4">
          {rows.map((row, index) => (
            <li
              key={row.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-sm font-bold text-zinc-300">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-bold">{row.exercise_nombre}</p>
                    <p className="text-xs text-zinc-500">
                      {row.exercise_categoria}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <IconButton
                    onClick={() => handleReorder(index, -1)}
                    disabled={index === 0}
                    title="Subir"
                  >
                    ↑
                  </IconButton>
                  <IconButton
                    onClick={() => handleReorder(index, 1)}
                    disabled={index === rows.length - 1}
                    title="Bajar"
                  >
                    ↓
                  </IconButton>
                  <DeleteButton row={row} />
                </div>
              </div>
              <RowFields row={row} />
            </li>
          ))}
        </ol>
      )}

      <section className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="text-lg font-bold">Agregar ejercicio</h2>

        {!pickerOpen && !createOpen ? (
          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={() => setPickerOpen(true)}>
              + De la biblioteca
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setCreateOpen(true)}
            >
              + Crear ejercicio que no existe
            </Button>
          </div>
        ) : null}

        {pickerOpen ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
            <div className="flex items-center justify-between gap-3">
              <TextInput
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar ejercicio de la biblioteca…"
                className="w-full"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => setPickerOpen(false)}
              >
                Cerrar
              </Button>
            </div>
            <ul className="mt-3 flex max-h-80 flex-col gap-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <li className="px-2 py-3 text-sm text-zinc-600">
                  No se encontraron ejercicios. Podés crear uno nuevo con el
                  botón de arriba.
                </li>
              ) : (
                    filtered.map((ex) => {
                  const yaEsta = rows.some((r) => r.exercise_id === ex.id);
                  return (
                    <li key={ex.id}>
                      <button
                        type="button"
                        disabled={yaEsta}
                        onClick={() => addExercise(ex)}
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
        ) : null}

        {createOpen ? (
          <NuevoEjercicioForm
            onCancel={() => setCreateOpen(false)}
            onSave={handleCreateNew}
          />
        ) : null}

        {error ? (
          <p className="rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        ) : null}
      </section>
    </div>
  );
}

function RowFields({ row }: { row: Row }) {
  const router = useRouter();
  const supabase = createClient();

  const [series, setSeries] = useState(row.series?.toString() ?? "3");
  const [repeticiones, setRepeticiones] = useState(row.repeticiones ?? "");
  const [descanso, setDescanso] = useState(
    row.descanso_segundos?.toString() ?? "90"
  );
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  async function handleSave() {
    setStatus("saving");
    const { error } = await supabase
      .from("workout_exercises")
      .update({
        series: series ? Number(series) : null,
        repeticiones: repeticiones.trim() || null,
        descanso_segundos: descanso ? Number(descanso) : null,
      })
      .eq("id", row.id);
    if (error) {
      setStatus("error");
      return;
    }
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2000);
    router.refresh();
  }

  return (
    <div className="mt-4">
      <div className="grid grid-cols-3 gap-3">
        <MiniField label="Series">
          <input
            type="number"
            min={0}
            value={series}
            onChange={(e) => setSeries(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-zinc-500"
          />
        </MiniField>
        <MiniField label="Repeticiones">
          <input
            value={repeticiones}
            onChange={(e) => setRepeticiones(e.target.value)}
            placeholder="Ej: 5 o 5x10s"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-zinc-500"
          />
        </MiniField>
        <MiniField label="Descanso (seg)">
          <input
            type="number"
            min={0}
            value={descanso}
            onChange={(e) => setDescanso(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-zinc-500"
          />
        </MiniField>
      </div>
      <div className="mt-3 flex items-center justify-end gap-3">
        {status === "saved" ? (
          <span className="text-xs font-medium text-emerald-300">Guardado ✓</span>
        ) : null}
        {status === "error" ? (
          <span className="text-xs font-medium text-red-300">Error al guardar</span>
        ) : null}
        <Button
          type="button"
          variant="secondary"
          onClick={handleSave}
          disabled={status === "saving"}
        >
          {status === "saving" ? "Guardando…" : "Guardar"}
        </Button>
      </div>
    </div>
  );
}

function DeleteButton({ row }: { row: Row }) {
  const router = useRouter();
  const supabase = createClient();
  const [confirm, setConfirm] = useState(false);

  if (!confirm) {
    return (
      <button
        onClick={() => setConfirm(true)}
        className="rounded-lg border border-red-900/70 px-3 py-1.5 text-xs text-red-300 transition hover:bg-red-950/40"
      >
        Quitar
      </button>
    );
  }

  return (
    <span className="flex items-center gap-2">
      <span className="text-xs text-zinc-500">¿Seguro?</span>
      <button
        onClick={async () => {
          await supabase.from("workout_exercises").delete().eq("id", row.id);
          router.refresh();
        }}
        className="rounded-lg bg-red-950 px-3 py-1.5 text-xs font-semibold text-red-200 transition hover:bg-red-900"
      >
        Sí, quitar
      </button>
      <button
        onClick={() => setConfirm(false)}
        className="rounded-lg border border-zinc-800 px-3 py-1.5 text-xs text-zinc-400 transition hover:border-zinc-600"
      >
        No
      </button>
    </span>
  );
}

function NuevoEjercicioForm({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: (
    nombre: string,
    disciplina: string,
    categoria: string,
    dificultad: string
  ) => Promise<void>;
}) {
  const [nombre, setNombre] = useState("");
  const [disciplina, setDisciplina] = useState("Calistenia");
  const [categoria, setCategoria] = useState("Planche");
  const [dificultad, setDificultad] = useState("Avanzado");
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);
    if (!nombre.trim()) {
      setLocalError("Poné el nombre del ejercicio.");
      return;
    }
    setLoading(true);
    await onSave(nombre, disciplina, categoria, dificultad);
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4"
    >
      <p className="text-sm text-zinc-400">
        El ejercicio se agrega a la biblioteca compartida y también a esta
        sesión.
      </p>
      <div className="mt-3 flex flex-col gap-3">
        <Field label="Nombre *">
          <TextInput
            autoFocus
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Negativa de plancha a hold"
          />
        </Field>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Disciplina">
            <Select
              value={disciplina}
              onChange={(e) => {
                const d = e.target.value;
                setDisciplina(d);
                setCategoria(categoriasDe(d)[0]);
              }}
            >
              {DISCIPLINAS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Categoría">
            <Select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              {categoriasDe(disciplina).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Dificultad">
            <Select value={dificultad} onChange={(e) => setDificultad(e.target.value)}>
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        {localError ? (
          <p className="rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {localError}
          </p>
        ) : null}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creando y agregando…" : "Crear y agregar"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function MiniField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-zinc-500">{label}</span>
      {children}
    </label>
  );
}

function IconButton({
  children,
  onClick,
  disabled,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 text-xs text-zinc-400 transition hover:border-zinc-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}