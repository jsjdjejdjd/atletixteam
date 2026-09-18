"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DISCIPLINAS } from "@/lib/levels";
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
  movement_type?: string | null;
  skill?: string | null;
  muscle_group?: string | null;
  estado_clasificacion?: string | null;
  duplicado_de?: string | null;
  video_url: string | null;
};

const ALL = "todas";
const SIN_DISCIPLINA = "Sin clasificar";

type Pestaña = "todas" | "Sin clasificar" | (typeof DISCIPLINAS)[number];

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
  const [movementType, setMovementType] = useState(ALL);
  const [skill, setSkill] = useState(ALL);
  const [muscleGroup, setMuscleGroup] = useState(ALL);
  const [objetivo, setObjetivo] = useState(ALL);
  const [dificultad, setDificultad] = useState(ALL);
  const [unilateral, setUnilateral] = useState(ALL);
  const [mostrarDuplicados, setMostrarDuplicados] = useState(false);
  const [mostrarRevisar, setMostrarRevisar] = useState(false);

  const [editing, setEditing] = useState<Exercise | null>(null);
  const [editNombre, setEditNombre] = useState("");
  const [editVideo, setEditVideo] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const esJerarquica =
    pestana === "Calistenia" || pestana === "Accesorios Calistenia";

  const conteos = useMemo(() => {
    const c: Record<string, number> = { todas: exercises.length };
    for (const d of DISCIPLINAS) c[d] = 0;
    c[SIN_DISCIPLINA] = 0;
    for (const e of exercises) {
      const d = disciplinaDe(e);
      c[d] = (c[d] ?? 0) + 1;
    }
    return c;
  }, [exercises]);

  const porDisciplina = useMemo(() => {
    let base = exercises;
    if (pestana !== "todas") base = base.filter((e) => disciplinaDe(e) === pestana);
    if (!mostrarDuplicados) base = base.filter((e) => !e.duplicado_de);
    if (!mostrarRevisar) base = base.filter((e) => e.estado_clasificacion !== "revisar");
    return base;
  }, [exercises, pestana, mostrarDuplicados, mostrarRevisar]);

  const categorias = useMemo(
    () => uniqueSorted(porDisciplina.map((e) => e.categoria)),
    [porDisciplina]
  );
  const subcategorias = useMemo(
    () =>
      uniqueSorted(
        porDisciplina
          .filter((e) => categoria === ALL || e.categoria === categoria)
          .map((e) => e.subcategoria)
      ),
    [porDisciplina, categoria]
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
  const movementTypes = useMemo(
    () => uniqueSorted(porDisciplina.map((e) => e.movement_type)),
    [porDisciplina]
  );
  const skills = useMemo(
    () => uniqueSorted(porDisciplina.map((e) => e.skill)),
    [porDisciplina]
  );
  const muscleGroups = useMemo(
    () => uniqueSorted(porDisciplina.map((e) => e.muscle_group)),
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

  const conteosCat = useMemo(() => {
    const c: Record<string, number> = {};
    for (const e of porDisciplina) c[e.categoria] = (c[e.categoria] ?? 0) + 1;
    return c;
  }, [porDisciplina]);

  const conteosSub = useMemo(() => {
    const c: Record<string, number> = {};
    for (const e of porDisciplina) {
      if (categoria !== ALL && e.categoria !== categoria) continue;
      if (!e.subcategoria) continue;
      c[e.subcategoria] = (c[e.subcategoria] ?? 0) + 1;
    }
    return c;
  }, [porDisciplina, categoria]);

  function cambiarPestana(p: Pestaña) {
    setPestana(p);
    setCategoria(ALL);
    setSubcategoria(ALL);
    setEquipamiento(ALL);
    setTipoEjercicio(ALL);
    setTipoResistencia(ALL);
    setMovementType(ALL);
    setSkill(ALL);
    setMuscleGroup(ALL);
    setObjetivo(ALL);
    setDificultad(ALL);
    setUnilateral(ALL);
  }

  function elegirCategoria(c: string) {
    setCategoria(c);
    setSubcategoria(ALL);
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
      if (movementType !== ALL && e.movement_type !== movementType) return false;
      if (skill !== ALL && e.skill !== skill) return false;
      if (muscleGroup !== ALL && e.muscle_group !== muscleGroup) return false;
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
          e.skill ?? "",
          e.muscle_group ?? "",
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
    movementType,
    skill,
    muscleGroup,
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

  const pestanas: Pestaña[] = [...DISCIPLINAS, "Sin clasificar", "todas"];

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

      {esJerarquica ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            {pestana} · Categoría
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => elegirCategoria(ALL)}
              className={
                "rounded-full px-3 py-1.5 text-sm transition " +
                (categoria === ALL
                  ? "bg-emerald-500 text-zinc-950"
                  : "border border-zinc-800 text-zinc-400 hover:text-white")
              }
            >
              Todas
            </button>
            {categorias.map((c) => (
              <button
                key={c}
                onClick={() => elegirCategoria(c)}
                className={
                  "rounded-full px-3 py-1.5 text-sm transition " +
                  (categoria === c
                    ? "bg-emerald-500 text-zinc-950"
                    : "border border-zinc-800 text-zinc-400 hover:text-white")
                }
              >
                {c}
                <span className="ml-1.5 text-xs opacity-70">
                  {conteosCat[c] ?? 0}
                </span>
              </button>
            ))}
          </div>

          {categoria !== ALL && subcategorias.length > 0 ? (
            <>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {categoria} · Subcategoría
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSubcategoria(ALL)}
                  className={
                    "rounded-full px-3 py-1.5 text-xs transition " +
                    (subcategoria === ALL
                      ? "bg-white text-zinc-900"
                      : "border border-zinc-800 text-zinc-400 hover:text-white")
                  }
                >
                  Todas
                </button>
                {subcategorias.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSubcategoria(s)}
                    className={
                      "rounded-full px-3 py-1.5 text-xs transition " +
                      (subcategoria === s
                        ? "bg-white text-zinc-900"
                        : "border border-zinc-800 text-zinc-400 hover:text-white")
                    }
                  >
                    {s}
                    <span className="ml-1.5 opacity-70">{conteosSub[s] ?? 0}</span>
                  </button>
                ))}
              </div>
            </>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <TextInput
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre, skill, músculo o alias…"
          className="w-full sm:w-72"
        />

        {!esJerarquica ? (
          <Select
            aria-label="Filtrar por categoría"
            value={categoria}
            onChange={(e) => elegirCategoria(e.target.value)}
            className="w-auto"
          >
            <option value={ALL}>Categoría: todas</option>
            {categorias.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        ) : null}

        {esJerarquica && subcategorias.length > 0 ? (
          <Select
            aria-label="Filtrar por subcategoría"
            value={subcategoria}
            onChange={(e) => setSubcategoria(e.target.value)}
            className="w-auto"
          >
            <option value={ALL}>Subcategoría: todas</option>
            {subcategorias.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        ) : null}

        {skills.length > 0 ? (
          <Select
            aria-label="Filtrar por skill"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="w-auto"
          >
            <option value={ALL}>Skill: todos</option>
            {skills.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        ) : null}

        {movementTypes.length > 0 ? (
          <Select
            aria-label="Filtrar por tipo de movimiento"
            value={movementType}
            onChange={(e) => setMovementType(e.target.value)}
            className="w-auto"
          >
            <option value={ALL}>Tipo: todos</option>
            {movementTypes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        ) : null}

        {muscleGroups.length > 0 ? (
          <Select
            aria-label="Filtrar por grupo muscular"
            value={muscleGroup}
            onChange={(e) => setMuscleGroup(e.target.value)}
            className="w-auto"
          >
            <option value={ALL}>Músculo: todos</option>
            {muscleGroups.map((c) => (
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

        {tipoEjercicio.length > 0 ? (
          <Select
            aria-label="Filtrar por tipo de ejercicio"
            value={tipoEjercicio}
            onChange={(e) => setTipoEjercicio(e.target.value)}
            className="w-auto"
          >
            <option value={ALL}>Tipo ejercicio: todos</option>
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

        <label className="flex items-center gap-2 text-xs text-zinc-400">
          <input
            type="checkbox"
            checked={mostrarDuplicados}
            onChange={(e) => setMostrarDuplicados(e.target.checked)}
          />
          Mostrar duplicados
        </label>
        <label className="flex items-center gap-2 text-xs text-zinc-400">
          <input
            type="checkbox"
            checked={mostrarRevisar}
            onChange={(e) => setMostrarRevisar(e.target.checked)}
          />
          Mostrar a revisar
        </label>

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
                  <p className="font-semibold">
                    {ex.nombre}
                    {ex.estado_clasificacion === "revisar" ? (
                      <span className="ml-2 rounded-full bg-amber-500/20 px-2 py-0.5 align-middle text-[10px] font-semibold text-amber-300">
                        A revisar
                      </span>
                    ) : null}
                    {ex.duplicado_de ? (
                      <span className="ml-2 rounded-full bg-zinc-700/50 px-2 py-0.5 align-middle text-[10px] font-semibold text-zinc-300">
                        Duplicado
                      </span>
                    ) : null}
                  </p>
                  {ex.nombre_en ? (
                    <p className="text-xs italic text-zinc-600">{ex.nombre_en}</p>
                  ) : null}
                  <p className="mt-0.5 text-sm text-zinc-500">
                    {ex.categoria}
                    {ex.subcategoria ? ` › ${ex.subcategoria}` : ""} ·{" "}
                    {ex.dificultad}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5 text-[11px]">
                    {ex.disciplina ? (
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-zinc-300">
                        {ex.disciplina}
                      </span>
                    ) : null}
                    {ex.skill ? (
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-300">
                        Skill: {ex.skill}
                      </span>
                    ) : null}
                    {ex.movement_type ? (
                      <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-zinc-400">
                        {ex.movement_type}
                      </span>
                    ) : null}
                    {ex.muscle_group ? (
                      <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-zinc-400">
                        {ex.muscle_group}
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
