"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, EmptyState, SectionCard, Select } from "@/components/ui";

type Exercise = {
  id: string;
  nombre: string;
  categoria: string;
  dificultad: string;
  tipo: string | null;
  video_url: string | null;
};

const ALL = "todas";

export default function EjerciciosBrowser({
  exercises,
}: {
  exercises: Exercise[];
}) {
  const router = useRouter();
  const supabase = createClient();

  const [categoria, setCategoria] = useState(ALL);
  const [dificultad, setDificultad] = useState(ALL);
  const [tipo, setTipo] = useState(ALL);

  const [editing, setEditing] = useState<Exercise | null>(null);
  const [editNombre, setEditNombre] = useState("");
  const [editVideo, setEditVideo] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const categorias = useMemo(
    () => Array.from(new Set(exercises.map((e) => e.categoria))).sort(),
    [exercises]
  );
  const dificultades = useMemo(
    () => Array.from(new Set(exercises.map((e) => e.dificultad))).sort(),
    [exercises]
  );
  const tipos = useMemo(
    () =>
      Array.from(
        new Set(exercises.map((e) => e.tipo).filter((t): t is string => !!t))
      ).sort(),
    [exercises]
  );

  const list = useMemo(() => {
    return exercises.filter(
      (e) =>
        (categoria === ALL || e.categoria === categoria) &&
        (dificultad === ALL || e.dificultad === dificultad) &&
        (tipo === ALL || e.tipo === tipo)
    );
  }, [exercises, categoria, dificultad, tipo]);

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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
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

        {tipos.length > 0 ? (
          <Select
            aria-label="Filtrar por tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-auto"
          >
            <option value={ALL}>Tipo: todos</option>
            {tipos.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        ) : null}

        <p className="ml-auto text-sm text-zinc-500">
          {list.length} ejercicio{list.length === 1 ? "" : "s"}
        </p>
      </div>

      {list.length === 0 ? (
        <EmptyState
          title="No hay ejercicios con esos filtros"
          description="Cambiá los filtros para ver más ejercicios."
        />
      ) : (
        <SectionCard>
          <ul className="divide-y divide-zinc-800">
            {list.map((ex) => (
              <li
                key={ex.id}
                className="flex items-center justify-between gap-4 px-6 py-4"
              >
                <div>
                  <p className="font-semibold">{ex.nombre}</p>
                  <p className="text-sm text-zinc-500">
                    {ex.categoria} · {ex.dificultad}
                    {ex.tipo ? ` · ${ex.tipo}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
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
              <label htmlFor="edit-nombre" className="text-sm font-medium text-zinc-300">
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
              <label htmlFor="edit-video" className="text-sm font-medium text-zinc-300">
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