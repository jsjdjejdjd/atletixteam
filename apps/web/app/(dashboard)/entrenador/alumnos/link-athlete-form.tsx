"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Field } from "@/components/ui";

export function LinkAthleteForm() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Sin sesión activa.");
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, email, rol")
      .ilike("email", email.trim())
      .maybeSingle();

    if (!profile) {
      setError("No existe una cuenta con ese email en ATLETIX.");
      setLoading(false);
      return;
    }

    if (profile.rol === "admin") {
      setError("Ese email es de un entrenador, no de un alumno.");
      setLoading(false);
      return;
    }

    const { data: existing } = await supabase
      .from("athletes")
      .select("id, entrenador_id")
      .eq("user_id", profile.id)
      .maybeSingle();

    if (existing) {
      if (existing.entrenador_id === user.id) {
        setError("Ese alumno ya está vinculado a vos.");
      } else {
        setError("Ese alumno ya está vinculado a otro entrenador.");
      }
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("athletes").insert({
      user_id: profile.id,
      entrenador_id: user.id,
      nivel: "Principiante",
      objetivo: null,
      estado: "activo",
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setEmail("");
    setOk("Alumno vinculado correctamente.");
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Field label="Email de la cuenta del alumno">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="alumno@email.com"
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-zinc-500"
        />
      </Field>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Vinculando…" : "+ Vincular alumno"}
        </Button>
        {ok ? <span className="text-sm text-emerald-300">{ok}</span> : null}
      </div>
      {error ? (
        <p className="rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      ) : null}
    </form>
  );
}