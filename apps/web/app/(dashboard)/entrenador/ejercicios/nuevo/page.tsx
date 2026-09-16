"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Button,
  Field,
  LinkButton,
  Select,
  TextArea,
  TextInput,
} from "@/components/ui";

const CATEGORIES = [
  "Tirón",
  "Empuje",
  "Piernas",
  "Core",
  "Planche",
  "Front Lever",
  "Muscle Up",
  "Handstand",
  "Street Lifting",
  "Movilidad",
  "Prehabilitación",
];

const LEVELS = ["Principiante", "Intermedio", "Avanzado", "Competitivo"];

export default function NuevoEjercicioPage() {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    nombre: "",
    categoria: "Tirón",
    dificultad: "Intermedio",
    equipamiento: "",
    video_url: "",
    descripcion: "",
    instrucciones: "",
    errores_comunes: "",
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

    const { error } = await supabase.from("exercises").insert({
      nombre: form.nombre.trim(),
      categoria: form.categoria,
      dificultad: form.dificultad,
      equipamiento: form.equipamiento.trim() || null,
      video_url: form.video_url.trim() || null,
      descripcion: form.descripcion.trim() || null,
      instrucciones: form.instrucciones.trim() || null,
      errores_comunes: form.errores_comunes.trim() || null,
      activo: true,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/entrenador/ejercicios");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-500">Biblioteca</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight">
            Nuevo ejercicio
          </h1>
        </div>
        <LinkButton href="/entrenador/ejercicios">Cancelar</LinkButton>
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
            placeholder="Ej: Dominadas lastradas"
          />
        </Field>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Categoría">
            <Select
              value={form.categoria}
              onChange={(e) => set("categoria", e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Dificultad">
            <Select
              value={form.dificultad}
              onChange={(e) => set("dificultad", e.target.value)}
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="URL del video demostrativo (opcional)">
          <TextInput
            type="url"
            value={form.video_url}
            onChange={(e) => set("video_url", e.target.value)}
            placeholder="https://..."
          />
        </Field>

        <Field label="Equipamiento (opcional)">
          <TextInput
            value={form.equipamiento}
            onChange={(e) => set("equipamiento", e.target.value)}
            placeholder="Barra, paralelas, anillas…"
          />
        </Field>

        <Field label="Descripción">
          <TextArea
            value={form.descripcion}
            onChange={(e) => set("descripcion", e.target.value)}
            placeholder="Explicación breve del ejercicio"
          />
        </Field>

        <Field label="Instrucciones">
          <TextArea
            value={form.instrucciones}
            onChange={(e) => set("instrucciones", e.target.value)}
            placeholder="Paso a paso de la ejecución correcta"
          />
        </Field>

        <Field label="Errores comunes">
          <TextArea
            value={form.errores_comunes}
            onChange={(e) => set("errores_comunes", e.target.value)}
            placeholder="Qué evitar al hacer el ejercicio"
          />
        </Field>

        {error && (
          <p className="rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => router.push("/entrenador/ejercicios")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Guardando…" : "Guardar ejercicio"}
          </Button>
        </div>
      </form>
    </div>
  );
}