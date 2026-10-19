"use client";

import { useState } from "react";
import { Button, Field, Select, TextInput } from "@/components/ui";
import { DISCIPLINAS, LEVELS, categoriasDe } from "@/lib/levels";

export function NuevoEjercicioForm({
  onCancel,
  onSave,
  descripcion = "El ejercicio se agrega a la biblioteca compartida.",
  boton = "Crear y agregar",
}: {
  onCancel: () => void;
  onSave: (
    nombre: string,
    disciplina: string,
    categoria: string,
    dificultad: string
  ) => Promise<void>;
  descripcion?: string;
  boton?: string;
}) {
  const [nombre, setNombre] = useState("");
  const [disciplina, setDisciplina] = useState("Calistenia");
  const [categoria, setCategoria] = useState(categoriasDe("Calistenia")[0]);
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
      <p className="text-sm text-zinc-400">{descripcion}</p>
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
            {loading ? `${boton}…` : boton}
          </Button>
        </div>
      </div>
    </form>
  );
}
