"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Field, Select } from "@/components/ui";
import { NIVELES_ORDER } from "@/lib/progress";

export function RegistroProgresoForm({ athleteId }: { athleteId: string }) {
  const router = useRouter();
  const supabase = createClient();

  const [peso, setPeso] = useState("");
  const [prDominadas, setPrDominadas] = useState("");
  const [prFondos, setPrFondos] = useState("");
  const [planche, setPlanche] = useState("");
  const [frontLever, setFrontLever] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(false);
    setLoading(true);

    const tests: Record<string, unknown> = {};
    if (prDominadas.trim()) tests.pr_dominadas = Number(prDominadas);
    if (prFondos.trim()) tests.pr_fondos = Number(prFondos);
    if (planche) tests.planche = planche;
    if (frontLever) tests.front_lever = frontLever;

    const { error } = await supabase.from("progress").insert({
      athlete_id: athleteId,
      fecha: new Date().toISOString().slice(0, 10),
      peso_corporal: peso ? Number(peso) : null,
      tests,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setPeso("");
    setPrDominadas("");
    setPrFondos("");
    setPlanche("");
    setFrontLever("");
    setOk(true);
    setLoading(false);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:grid-cols-3"
    >
      <Field label="Peso corporal (kg)">
        <input
          type="number"
          step="0.1"
          min={0}
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
          placeholder="Ej: 74.5"
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-zinc-500"
        />
      </Field>
      <Field label="PR Dominadas">
        <input
          type="number"
          min={0}
          value={prDominadas}
          onChange={(e) => setPrDominadas(e.target.value)}
          placeholder="Ej: 12"
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-zinc-500"
        />
      </Field>
      <Field label="PR Fondos">
        <input
          type="number"
          min={0}
          value={prFondos}
          onChange={(e) => setPrFondos(e.target.value)}
          placeholder="Ej: 20"
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-zinc-500"
        />
      </Field>
      <Field label="Planche (nivel)">
        <Select value={planche} onChange={(e) => setPlanche(e.target.value)}>
          <option value="">— Sin medir —</option>
          {NIVELES_ORDER.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Front Lever (nivel)">
        <Select value={frontLever} onChange={(e) => setFrontLever(e.target.value)}>
          <option value="">— Sin medir —</option>
          {NIVELES_ORDER.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </Select>
      </Field>

      <div className="flex items-end gap-3 sm:col-span-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando…" : "Registrar medición"}
        </Button>
        {ok ? <span className="text-sm text-emerald-300">Medición guardada ✓</span> : null}
      </div>

      {error && (
        <p className="rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300 sm:col-span-3">
          {error}
        </p>
      )}
    </form>
  );
}