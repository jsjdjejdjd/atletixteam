"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Field, LinkButton, Select, TextArea, TextInput } from "@/components/ui";

const LEVELS = ["Principiante", "Intermedio", "Avanzado", "Competitivo"];

export default function NuevoProgramaPage() {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    nombre: "",
    objetivo: "",
    nivel: "Intermedio",
    duracion_semanas: "8",
    descripcion: "",
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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: program, error } = await supabase
      .from("programs")
      .insert({
        nombre: form.nombre.trim(),
        objetivo: form.objetivo.trim() || null,
        nivel: form.nivel,
        duracion_semanas: Number(form.duracion_semanas) || null,
        descripcion: form.descripcion.trim() || null,
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
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-500">Programas</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight">
            Nuevo programa
          </h1>
        </div>
        <LinkButton href="/entrenador/programas">Cancelar</LinkButton>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6"
      >
        <Field label="Nombre *">
          <TextInput
            required
            value={form.nombre}
            onChange={(e) => set("nombre", e.target.value)}
            placeholder="Ej: Bloque Fuerza Planche"
          />
        </Field>

        <Field label="Objetivo">
          <TextInput
            value={form.objetivo}
            onChange={(e) => set("objetivo", e.target.value)}
            placeholder="Ej: Lograr el full planche"
          />
        </Field>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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

          <Field label="Duración (semanas)">
            <TextInput
              type="number"
              min={1}
              value={form.duracion_semanas}
              onChange={(e) => set("duracion_semanas", e.target.value)}
            />
          </Field>
        </div>

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
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/entrenador/programas")}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creando…" : "Crear programa"}
          </Button>
        </div>
      </form>
    </div>
  );
}