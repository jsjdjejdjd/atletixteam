"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Button,
  EmptyState,
  SectionCard,
  Select,
  TextInput,
} from "@/components/ui";

export type Exercise = {
  id: string;
  nombre: string;
  nombre_en?: string | null;
  aliases?: string | null;
  categoria: string;
  subcategoria?: string | null;
  dificultad: string;
  tipo: string | null;
  disciplina?: string | null;
  tipo_ejercicio?: string | null;
  tipo_resistencia?: string | null;
  equipamiento?: string | null;
  patron?: string | null;
  musculos_primarios?: string[] | null;
  musculos_secundarios?: string[] | null;
  objetivo?: string | null;
  unilateral?: boolean | null;
  video_url: string | null;
};

const ALL = "todas";
const SIN_DISCIPLINA = "Sin clasificar";

type Pestaña = "todas" | "Calistenia" | "Musculación" | "Sin clasificar";

function disciplinaDe(e: Exercise): string {
  return e.disciplina ?? SIN_DISCIPLINA;
}

function uniqueSorted(values: (string | null | undefined)[]): string[] {
  return Array.from(new Set(values.filter((v): v is string => !!v))).sort();
}

export default function EjerciciosBrowser({
  exercises,
}: {
  exercises: Exercise[];
}) {
  const router = useRouter();
  const supabase = createClient();

  const [pestana, setPestana] = useState<Pestaña>("Musculación");
  const [q, setQ] = useState("");
  const [categoria, setCategoria] = useState(ALL);
  const [subcategoria, setSubcategoria] = useState(ALL);
  const [equipamiento, setEquipamiento] = useState(ALL);
  const [tipoEjercicio, setTipoEjercicio] = useState(ALL);
  const [tipoResistencia, setTipoResistencia] = useState(ALL);
  const [objetivo, setObjetivo] = useState(ALL);
  const [dificultad, setDificultad] = useState(ALL);
  const [unilateral, setUnilateral] = useState(ALL);

  const [editing, setEditing] = useState<Exercise | null>(null);
  const [editNombre, setEditNombre] = useState("");
  const [editVideo, setEditVideo] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const conteos = useMemo(() => {
    const c: Record<string, number> = {
      todas: exercises.length,
      Calistenia: 0,
      Musculación: 0,
      "Sin clasificar": 0,
    };
    for (const e of exercises) {
      const d = disciplinaDe(e);
      c[d] = (c[d] ?? 0) + 1;
    }
    return c;
  }, [exercises]);

  const porDisciplina = useMemo(() => {
    if (pestana === "todas") return exercises;
    return exercises.filter((e) => disciplinaDe(e) === pestana);
  }, [exercises, pestana]);

  const categorias = useMemo(
    () => uniqueSorted(porDisciplina.map((e) => e.categoria)),
    [porDisciplina]
  );
  const subcategorias = useMemo(
    () => uniqueSorted(porDisciplina.map((e) => e.subcategoria)),
    [porDisciplina]
  );
  const equipamientos = useMemo(
    () => uniqueSorted(porDisciplina.map((e) => e.equipamiento)),
    [porDisciplina]
  );
  const tiposEjercicio = useMemo(
    () => uniqueSorted(porDisciplina.map((e) => e.tipo_ejercicio)),
    [porDisciplina]
  );
  const tiposResistencia = useMemo(
    () => uniqueSorted(porDisciplina.map((e) => e.tipo_resistencia)),
    [porDisciplina]
  );
  const objetivos = useMemo(
    () => uniqueSorted(porDisciplina.map((e) => e.objetivo)),
    [porDisciplina]
  );
  const dificultades = useMemo(
    () => uniqueSorted(porDisciplina.map((e) => e.dificultad)),
    [porDisciplina]
  );

  function cambiarPestana(p: Pestaña) {
    setPestana(p);
    setCategoria(ALL);
    setSubcategoria(ALL);
    setEquipamiento(ALL);
    setTipoEjercicio(ALL);
    setTipoResistencia(ALL);
    setObjetivo(ALL);
    setDificultad(ALL);
    setUnilateral(ALL);
  }

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return porDisciplina.filter((e) => {
      if (categoria !== ALL && e.categoria !== categoria) return false;
      if (subcategoria !== ALL && e.subcategoria !== subcategoria) return false;
      if (equipamiento !== ALL && e.equipamiento !== equipamiento) return false;
      if (tipoEjercicio !== ALL && e.tipo_ejercicio !== tipoEjercicio) return false;
      if (tipoResistencia !== ALL && e.tipo_resistencia !== tipoResistencia)
        return false;
      if (objetivo !== ALL && e.objetivo !== objetivo) return false;
      if (dificultad !== ALL && e.dificultad !== dificultad) return false;
      if (unilateral === "si" && !e.unilateral) return false;
      if (unilateral === "no" && e.unilateral) return false;
      if (term) {
        const blob = [
          e.nombre,
          e.nombre_en ?? "",
          e.aliases ?? "",
          e.subcategoria ?? "",
          ...(e.musculos_primarios ?? []),
          ...(e.musculos_secundarios ?? []),
        ]
          .join(" ")
          .toLowerCase();
        if (!blob.includes(term)) return false;
      }
      return true;
    });
  }, [
    porDisciplina,
    q,
    categoria,
    subcategoria,
    equipamiento,
    tipoEjercicio,
    tipoResistencia,
    objetivo,
    dificultad,
    unilateral,
  ]);

  function openEdit(ex: Exercise) {
    setEditing(ex);
    setEditNombre(ex.nombre);
    setEditVideo(ex.video_url ?? "");
    setEditError(null);
  }

  async function saveEdit() {
    if (!editing) return;
    setEditError(null);
    if (!editNombre.trim()) {
      setEditError("El nombre no puede quedar vacío.");
      return;
    }
    setEditSaving(true);
    const { error } = await supabase
      .from("exercises")
      .update({
        nombre: editNombre.trim(),
        video_url: editVideo.trim() || null,
      })
      .eq("id", editing.id);
    if (error) {
      setEditError(error.message);
      setEditSaving(false);
      return;
    }
    setEditSaving(false);
    setEditing(null);
    router.refresh();
  }

  const pestanas: Pestaña[] = ["Musculación", "Calistenia", "Sin clasificar", "todas"];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-2">
        {pestanas.map((p) => {
          const activa = pestana === p;
          const label = p === "todas" ? "Todas" : p;
          return (
            <button
              key={p}
              onClick={() => cambiarPestana(p)}
              className={
                "rounded-xl px-4 py-2 text-sm font-semibold transition " +
                (activa
                  ? "bg-white text-zinc-900"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white")
              }
            >
              {label}
              <span
                className={
                  "ml-2 rounded-full px-2 py-0.5 text-xs " +
                  (activa ? "bg-zinc-900/10 text-zinc-600" : "bg-zinc-800 text-zinc-400")
                }
              >
                {conteos[p] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <TextInput
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre, músculo o alias…"
          className="w-full sm:w-72"
        />

        <Select
          aria-label="Filtrar por categoría"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-auto"
        >
          <option value={ALL}>Categoría: todas</option>
          {categorias.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>

        {subcategorias.length > 0 ? (
          <Select
            aria-label="Filtrar por músculo"
            value={subcategoria}
            onChange={(e) => setSubcategoria(e.target.value)}
            className="w-auto"
          >
            <option value={ALL}>Músculo: todos</option>
            {subcategorias.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        ) : null}

        {equipamientos.length > 0 ? (
          <Select
            aria-label="Filtrar por equipamiento"
            value={equipamiento}
            onChange={(e) => setEquipamiento(e.target.value)}
            className="w-auto"
          >
            <option value={ALL}>Equipamiento: todo</option>
            {equipamientos.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        ) : null}

        {tiposEjercicio.length > 0 ? (
          <Select
            aria-label="Filtrar por tipo de ejercicio"
            value={tipoEjercicio}
            onChange={(e) => setTipoEjercicio(e.target.value)}
            className="w-auto"
          >
            <option value={ALL}>Tipo: todos</option>
            {tiposEjercicio.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        ) : null}

        {tiposResistencia.length > 0 ? (
          <Select
            aria-label="Filtrar por tipo de resistencia"
            value={tipoResistencia}
            onChange={(e) => setTipoResistencia(e.target.value)}
            className="w-auto"
          >
            <option value={ALL}>Resistencia: toda</option>
            {tiposResistencia.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        ) : null}

        {objetivos.length > 0 ? (
          <Select
            aria-label="Filtrar por objetivo"
            value={objetivo}
            onChange={(e) => setObjetivo(e.target.value)}
            className="w-auto"
          >
            <option value={ALL}>Objetivo: todos</option>
            {objetivos.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        ) : null}

        <Select
          aria-label="Filtrar por dificultad"
          value={dificultad}
          onChange={(e) => setDificultad(e.target.value)}
          className="w-auto"
        >
          <option value={ALL}>Dificultad: todas</option>
          {dificultades.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </Select>

        <Select
          aria-label="Filtrar unilateral o bilateral"
          value={unilateral}
          onChange={(e) => setUnilateral(e.target.value)}
          className="w-auto"
        >
          <option value={ALL}>Uni/bilateral: todo</option>
          <option value="si">Unilateral</option>
          <option value="no">Bilateral</option>
        </Select>

        <p className="ml-auto text-sm text-zinc-500">
          {list.length} ejercicio{list.length === 1 ? "" : "s"}
        </p>
      </div>

      {list.length === 0 ? (
        <EmptyState
          title="No hay ejercicios con esos filtros"
          description="Cambiá la pestaña o los filtros para ver más ejercicios."
        />
      ) : (
        <SectionCard>
          <ul className="divide-y divide-zinc-800">
            {list.map((ex) => (
              <li
                key={ex.id}
                className="flex items-start justify-between gap-4 px-6 py-4"
              >
                <div className="min-w-0">
                  <p className="font-semibold">{ex.nombre}</p>
                  {ex.nombre_en ? (
                    <p className="text-xs italic text-zinc-600">{ex.nombre_en}</p>
                  ) : null}
                  <p className="mt-0.5 text-sm text-zinc-500">
                    {ex.categoria}
                    {ex.subcategoria ? ` · ${ex.subcategoria}` : ""} ·{" "}
                    {ex.dificultad}
                    {ex.tipo_ejercicio ? ` · ${ex.tipo_ejercicio}` : ""}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5 text-[11px]">
                    {ex.disciplina ? (
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-zinc-300">
                        {ex.disciplina}
                      </span>
                    ) : null}
                    {ex.tipo_resistencia ? (
                      <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-zinc-400">
                        {ex.tipo_resistencia}
                      </span>
                    ) : null}
                    {ex.equipamiento ? (
                      <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-zinc-400">
                        {ex.equipamiento}
                      </span>
                    ) : null}
                    {ex.unilateral ? (
                      <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-zinc-400">
                        Unilateral
                      </span>
                    ) : null}
                    {ex.objetivo ? (
                      <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-zinc-400">
                        {ex.objetivo}
                      </span>
                    ) : null}
                  </div>
                  {ex.musculos_primarios && ex.musculos_primarios.length > 0 ? (
                    <p className="mt-1 text-xs text-zinc-600">
                      {ex.musculos_primarios.join(" · ")}
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-2 text-xs">
                  {ex.video_url ? (
                    <a
                      href={ex.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-zinc-800 px-3 py-1 text-zinc-300 transition hover:bg-zinc-700"
                    >
                      ▶ Video
                    </a>
                  ) : null}
                  <button
                    onClick={() => openEdit(ex)}
                    className="rounded-full border border-zinc-800 px-3 py-1 text-zinc-400 transition hover:border-zinc-600 hover:text-white"
                  >
                    ✎ Editar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="flex w-full max-w-md flex-col gap-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <div>
              <p className="text-sm font-medium text-zinc-500">Biblioteca</p>
              <h3 className="mt-1 text-xl font-bold">Editar ejercicio</h3>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="edit-nombre"
                className="text-sm font-medium text-zinc-300"
              >
                Nombre *
              </label>
              <input
                id="edit-nombre"
                value={editNombre}
                onChange={(e) => setEditNombre(e.target.value)}
                className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-zinc-500"
                placeholder="Ej: Dominadas lastradas"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="edit-video"
                className="text-sm font-medium text-zinc-300"
              >
                URL del video demostrativo
              </label>
              <input
                id="edit-video"
                type="url"
                value={editVideo}
                onChange={(e) => setEditVideo(e.target.value)}
                className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-zinc-500"
                placeholder="https://..."
              />
              <p className="text-xs text-zinc-600">
                Dejalo vacío para quitar el video.
              </p>
            </div>

            {editError && (
              <p className="rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300">
                {editError}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditing(null)}
                disabled={editSaving}
              >
                Cancelar
              </Button>
              <Button type="button" onClick={saveEdit} disabled={editSaving}>
                {editSaving ? "Guardando…" : "Guardar"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
