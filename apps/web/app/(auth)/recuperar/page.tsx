"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button, Field, TextInput } from "@/components/ui";

export default function RecuperarPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(false);
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError("No se pudo enviar el email. Revisá el correo y volvé a intentar.");
      setLoading(false);
      return;
    }

    setOk(true);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="text-center">
        <h2 className="text-lg font-bold">Recuperar contraseña</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Escribí tu email y te mandamos un link para crear una contraseña nueva.
        </p>
      </div>

      <Field label="Email">
        <TextInput
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
        />
      </Field>

      {error ? (
        <p className="rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      {ok ? (
        <p className="rounded-lg border border-emerald-900/60 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-300">
          Si ese email tiene una cuenta en ATLETIX, ya te llegó el link para
          resetear la contraseña. Revisá también la carpeta de spam.
        </p>
      ) : null}

      <Button type="submit" disabled={loading} className="py-3">
        {loading ? "Enviando…" : "Enviar link"}
      </Button>

      <p className="text-center text-sm text-zinc-500">
        <Link href="/login" className="font-semibold text-white transition hover:text-zinc-300">
          Volver al ingreso
        </Link>
      </p>
    </form>
  );
}
