"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui";

export function EnrollButton({
  programId,
  isCurrent,
}: {
  programId: string;
  isCurrent: boolean;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleEnroll() {
    if (isCurrent) return;
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("No se pudo identificar tu cuenta. Volvé a entrar.");
      setLoading(false);
      return;
    }

    const { data: athlete } = await supabase
      .from("athletes")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    let athleteId = athlete?.id;

    if (!athleteId) {
      const { error: insErr } = await supabase.from("athletes").insert({
        user_id: user.id,
        entrenador_id: null,
        nivel: "Principiante",
        estado: "activo",
        objetivo: null,
      });
      if (insErr) {
        setError(insErr.message);
        setLoading(false);
        return;
      }
      const { data: created } = await supabase
        .from("athletes")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      athleteId = created?.id;
    }

    if (!athleteId) {
      setError("No se pudo crear tu perfil. Volvé a intentar.");
      setLoading(false);
      return;
    }

    const { data: yaInscripto } = await supabase
      .from("athlete_programs")
      .select("id")
      .eq("athlete_id", athleteId)
      .eq("program_id", programId)
      .eq("estado", "activo")
      .maybeSingle();

    if (yaInscripto) {
      setLoading(false);
      router.push("/alumno/programa");
      router.refresh();
      return;
    }

    const { error: enrollErr } = await supabase.from("athlete_programs").insert({
      athlete_id: athleteId,
      program_id: programId,
      fecha_inicio: new Date().toISOString().slice(0, 10),
      estado: "activo",
    });
    if (enrollErr) {
      setError(enrollErr.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/alumno/programa");
    router.refresh();
  }

  return (
    <div>
      <Button
        type="button"
        onClick={handleEnroll}
        disabled={loading || isCurrent}
      >
        {loading
          ? "Anotándote…"
          : isCurrent
            ? "Ya estás en este programa"
            : "Empezar este programa"}
      </Button>
      {error ? (
        <p className="mt-2 text-xs text-red-300">{error}</p>
      ) : null}
    </div>
  );
}