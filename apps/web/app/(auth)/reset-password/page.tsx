"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Field, TextInput } from "@/components/ui";

export default function ResetPasswordPage() {
  const supabase = createClient();
  const router = useRouter();

  const [listo, setListo] = useState(false);
  const [tieneLink, setTieneLink] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let vivo = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!vivo) return;
      setTieneLink(Boolean(data.session));
      setListo(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_evento, sesion) => {
      if (!vivo) return;
      setTieneLink(Boolean(sesion));
      setListo(true);
    });

    return () => {
      vivo = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("La contraseña tiene que tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError("No se pudo cambiar la contraseña. Volvé a pedir el link e intentá de nuevo.");
      setLoading(false);
      return;
    }

    setOk(true);
    setLoading(false);
    setTimeout(() => {
      router.push("/login");
      router.refresh();
    }, 1500);
  }

  if (!listo) {
    return (
      <p className="py-8 text-center text-sm text-zinc-500">
        Verificando el link…
      </p>
    );
  }

  if (!tieneLink) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <h2 className="text-lg font-bold">El link no es válido</h2>
        <p className="text-sm text-zinc-500">
          Este link ya se usó o venció. Pedí uno nuevo y abrilo desde el mismo
          correo.
        </p>
        <Link
          href="/recuperar"
          className="mx-auto mt-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
        >
          Pedir un link nuevo
        </Link>
      </div>
    );
  }

  if (ok) {
    return (
      <p className="rounded-lg border border-emerald-900/60 bg-emerald-950/40 px-4 py-3 text-center text-sm text-emerald-300">
        Contraseña actualizada. Te llevamos al ingreso…
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="text-center">
        <h2 className="text-lg font-bold">Crear contraseña nueva</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Elegí una contraseña de al menos 6 caracteres.
        </p>
      </div>

      <Field label="Contraseña nueva">
        <TextInput
          id="password"
          type="password"
          required
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </Field>

      <Field label="Repetí la contraseña">
        <TextInput
          id="confirm"
          type="password"
          required
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="••••••••"
        />
      </Field>

      {error ? (
        <p className="rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={loading} className="py-3">
        {loading ? "Guardando…" : "Guardar contraseña"}
      </Button>
    </form>
  );
}
