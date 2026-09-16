"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Field, Select } from "@/components/ui";

export function WeekForm({ programId }: { programId: string }) {
  const router = useRouter();
  const supabase = createClient();

  const [numero, setNumero] = useState("1");
  const [objetivo, setObjetivo] = useState("");
  const [notas, setNotas] = useState("");
  const [esDescarga, setEsDescarga] = useState("no");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.from("weeks").insert({
      program_id: programId,
      numero: Number(numero),
      objetivo: objetivo.trim() || null,
      notas: notas.trim() || null,
      es_descarga: esDescarga === "si",
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setNumero(String(Number(numero) + 1));
    setObjetivo("");
    setNotas("");
    setEsDescarga("no");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:grid-cols-6"
    >
      <Field label="Semana N°">
        <input
          type="number"
          min={1}
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-zinc-500"
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Objetivo">
          <input
            value={objetivo}
            onChange={(e) => setObjetivo(e.target.value)}
            placeholder="Ej: Volumen de empuje"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-zinc-500"
          />
        </Field>
      </div>
      <Field label="Tipo">
        <Select
          value={esDescarga}
          onChange={(e) => setEsDescarga(e.target.value)}
        >
          <option value="no">Normal</option>
          <option value="si">Descarga</option>
        </Select>
      </Field>
      <div className="flex items-end">
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "…" : "+ Semana"}
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