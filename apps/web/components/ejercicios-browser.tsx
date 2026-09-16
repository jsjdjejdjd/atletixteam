"use client";

import { useMemo, useState } from "react";
import { EmptyState, SectionCard, Select } from "@/components/ui";

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
  const [categoria, setCategoria] = useState(ALL);
  const [dificultad, setDificultad] = useState(ALL);
  const [tipo, setTipo] = useState(ALL);

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
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}
    </div>
  );
}