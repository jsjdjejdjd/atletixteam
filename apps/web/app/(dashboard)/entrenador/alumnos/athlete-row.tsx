"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Select } from "@/components/ui";
import { UnlinkAthleteButton } from "./unlink-athlete-button";

export function AthleteRow({
  athlete,
}: {
  athlete: {
    id: string;
    paciente: string;
    nivel: string | null;
    estado: string | null;
    programa_nombre: string | null;
  };
}) {
  const supabase = createClient();
  const router = useRouter();
  const [value, setValue] = useState(athlete.nivel ?? "Principiante");

  async function handleNivel(v: string) {
    setValue(v);
    const { error } = await supabase
      .from("athletes")
      .update({ nivel: v })
      .eq("id", athlete.id);
    if (!error) router.refresh();
  }

  return (
    <li className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold">{athlete.paciente}</p>
        <p className="text-sm text-zinc-500">
          {athlete.programa_nombre ? (
            <>
              Está siguiendo:{" "}
              <span className="font-bold text-zinc-300">
                {athlete.programa_nombre}
              </span>
            </>
          ) : (
            "Todavía no eligió un programa"
          )}
        </p>
      </div>

      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
        <Link
          href={`/entrenador/alumnos/${athlete.id}`}
          className="rounded-lg border border-zinc-800 px-4 py-2 text-center text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white"
        >
          Progreso
        </Link>
        <label className="flex items-center gap-2 text-xs font-medium text-zinc-500">
          Nivel
          <Select
            value={value}
            onChange={(e) => handleNivel(e.target.value)}
            className="sm:w-40"
          >
            {["Principiante", "Intermedio", "Avanzado", "Elite"].map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </Select>
        </label>
        <UnlinkAthleteButton athleteId={athlete.id} />
      </div>
    </li>
  );
}