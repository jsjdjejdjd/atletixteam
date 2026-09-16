"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Select } from "@/components/ui";

export function AthleteRow({
  athlete,
  programs,
  defaultProgramId,
}: {
  athlete: {
    id: string;
    paciente: string;
    nivel: string | null;
    estado: string | null;
    program_id_actual: string | null;
  };
  programs: { id: string; nombre: string }[];
  defaultProgramId?: string;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [programId, setProgramId] = useState(
    athlete.program_id_actual ?? defaultProgramId ?? ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAssign() {
    if (!programId) return;
    setSaving(true);
    setError(null);

    // Cerrar el programa activo actual (si hay) y asignar el nuevo
    const { error: updErr } = await supabase
      .from("athlete_programs")
      .update({ estado: "finalizado" })
      .eq("athlete_id", athlete.id)
      .eq("estado", "activo");

    if (updErr) {
      setError(updErr.message);
      setSaving(false);
      return;
    }

    const { error: insErr } = await supabase.from("athlete_programs").insert({
      athlete_id: athlete.id,
      program_id: programId,
      fecha_inicio: new Date().toISOString().slice(0, 10),
      estado: "activo",
    });

    if (insErr) {
      setError(insErr.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    router.refresh();
  }

  return (
    <li className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold">{athlete.paciente}</p>
        <p className="text-sm text-zinc-500">
          Nivel: {athlete.nivel ?? "—"} ·{" "}
          <span
            className={
              athlete.estado === "activo"
                ? "text-emerald-300"
                : "text-zinc-400"
            }
          >
            {athlete.estado === "activo" ? "Activo" : "Inactivo"}
          </span>
        </p>
      </div>

      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
        {error ? (
          <span className="text-xs text-red-300">{error}</span>
        ) : null}
        <Select
          value={programId}
          onChange={(e) => setProgramId(e.target.value)}
          className="sm:w-56"
        >
          <option value="">Sin programa</option>
          {programs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </Select>
        <Button
          type="button"
          onClick={handleAssign}
          disabled={saving || !programId}
        >
          {saving ? "Asignando…" : "Asignar"}
        </Button>
      </div>
    </li>
  );
}