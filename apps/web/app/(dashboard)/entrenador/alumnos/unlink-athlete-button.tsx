"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui";

export function UnlinkAthleteButton({ athleteId }: { athleteId: string }) {
  const router = useRouter();
  const supabase = createClient();

  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUnlink() {
    setLoading(true);
    setError(null);

    const { error: e1 } = await supabase
      .from("athletes")
      .update({ entrenador_id: null })
      .eq("id", athleteId);
    if (e1) {
      setError(e1.message);
      setLoading(false);
      return;
    }

    const { error: e2 } = await supabase
      .from("athlete_programs")
      .update({ estado: "inactivo" })
      .eq("athlete_id", athleteId)
      .eq("estado", "activo");
    if (e2) {
      setError(e2.message);
      setLoading(false);
      return;
    }

    setConfirming(false);
    setLoading(false);
    router.refresh();
  }

  if (confirming) {
    return (
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">
            ¿Desvincular? Perdés a este alumno y él deja de ver tus programas.
          </span>
          <Button
            type="button"
            variant="danger"
            onClick={handleUnlink}
            disabled={loading}
          >
            {loading ? "Desvinculando…" : "Sí, desvincular"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setConfirming(false)}
            disabled={loading}
          >
            No
          </Button>
        </div>
        {error ? <p className="text-xs text-red-300">{error}</p> : null}
      </div>
    );
  }

  return (
    <Button type="button" variant="danger" onClick={() => setConfirming(true)}>
      Desvincular
    </Button>
  );
}