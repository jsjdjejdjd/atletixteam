"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Field } from "@/components/ui";

export function WorkoutForm({ weekId }: { weekId: string }) {
  const router = useRouter();
  const supabase = createClient();

  const [nombre, setNombre] = useState("");
  const [dia, setDia] = useState("1");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.from("workouts").insert({
      week_id: weekId,
      nombre: nombre.trim(),
      dia: Number(dia),
      orden: Number(dia),
      descripcion: descripcion.trim() || null,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setNombre("");
    setDia(String(Number(dia) + 1));
    setDescripcion("");
    setLoading(false);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:grid-cols-6"
    >
      <Field label="Nombre *">
        <input
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Espalda + Front Lever"
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-zinc-500"
        />
      </Field>
      <Field label="Día">
        <input
          type="number"
          min={1}
          value={dia}
          onChange={(e) => setDia(e.target.value)}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-zinc-500"
        />
      </Field>
      <div className="sm:col-span-3">
        <Field label="Descripción">
          <input
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Opcional"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-zinc-500"
          />
        </Field>
      </div>
      <div className="flex items-end">
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "…" : "+ Sesión"}
        </Button>
      </div>
      {error && (
        <p className="rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300 sm:col-span-6">
          {error}
        </p>
      )}
    </form>
  );
}