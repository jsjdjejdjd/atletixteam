"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Field, LinkButton, Select, TextArea, TextInput } from "@/components/ui";
import { LEVELS, CATEGORIAS } from "@/lib/levels";

type ProgramFormProps = {
  programId?: string;
  initial?: {
    nombre: string;
    objetivo: string;
    nivel: string;
    duracion_semanas: string;
    descripcion: string;
    categoria: string;
  };
};

export function ProgramForm({ programId, initial }: ProgramFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const esEdicion = !!programId;

  const [form, setForm] = useState({
    nombre: initial?.nombre ?? "",
    objetivo: initial?.objetivo ?? "",
    nivel: initial?.nivel ?? "Intermedio",
    duracion_semanas: initial?.duracion_semanas ?? "8",
    descripcion: initial?.descripcion ?? "",
    categoria: initial?.categoria ?? "general",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      nombre: form.nombre.trim(),
      objetivo: form.objetivo.trim() || null,
      nivel: form.nivel,
      duracion_semanas: Number(form.duracion_semanas) || null,
      descripcion: form.descripcion.trim() || null,
      categoria: form.categoria,
    };

    if (esEdicion) {
      const { error } = await supabase
        .from("programs")
        .update(payload)
        .eq("id", programId);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      router.push(`/entrenador/programas/${programId}`);
      router.refresh();
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: program, error } = await supabase
      .from("programs")
      .insert({
        ...payload,
        entrenador_id: user?.id ?? null,
        activo: true,
      })
      .select("id")
      .single();

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(`/entrenador/programas/${program!.id}`);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6"
    >
      <Field label="Nombre *">
        <TextInput
          required
          value={form.nombre}
          onChange={(e) => set("nombre", e.target.value)}
          placeholder="Ej: Intermedio Fuerza Total"
        />
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Categoría de programa">
          <Select
            value={form.categoria}
            onChange={(e) => set("categoria", e.target.value)}
          >
            {CATEGORIAS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Nivel">
          <Select
            value={form.nivel}
            onChange={(e) => set("nivel", e.target.value)}
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Objetivo">
        <TextInput
          value={form.objetivo}
          onChange={(e) => set("objetivo", e.target.value)}
          placeholder="Ej: Lograr el full planche"
        />
      </Field>

      <Field label="Duración (semanas)">
        <TextInput
          type="number"
          min={1}
          value={form.duracion_semanas}
          onChange={(e) => set("duracion_semanas", e.target.value)}
        />
      </Field>

      <Field label="Descripción">
        <TextArea
          value={form.descripcion}
          onChange={(e) => set("descripcion", e.target.value)}
          placeholder="Resumen del programa"
        />
      </Field>

      {error && (
        <p className="rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <LinkButton href={esEdicion ? `/entrenador/programas/${programId}` : "/entrenador/programas"}>
          Cancelar
        </LinkButton>
        <Button type="submit" disabled={loading}>
          {loading
            ? esEdicion
              ? "Guardando…"
              : "Creando…"
            : esEdicion
              ? "Guardar cambios"
              : "Crear programa"}
        </Button>
      </div>
    </form>
  );
}