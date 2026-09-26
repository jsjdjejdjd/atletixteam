"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(translateError(error.message));
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("rol")
      .eq("id", (await supabase.auth.getUser()).data.user?.id ?? "")
      .single();

    router.push(profile?.rol === "admin" ? "/entrenador" : "/alumno");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-zinc-300">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-zinc-500"
          placeholder="tu@email.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-zinc-300">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-zinc-500"
          placeholder="••••••••"
        />
      </div>

      <div className="text-right">
        <Link
          href="/recuperar"
          className="text-xs text-zinc-500 transition hover:text-zinc-300"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      {error && (
        <p className="rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-1 rounded-lg bg-white py-3 text-sm font-bold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Ingresando…" : "Ingresar"}
      </button>

      <p className="text-center text-sm text-zinc-500">
        ¿No tenés cuenta?{" "}
        <Link href="/register" className="font-semibold text-white transition hover:text-zinc-300">
          Crear cuenta
        </Link>
      </p>
    </form>
  );
}

function translateError(message: string): string {
  if (message.includes("Invalid login credentials"))
    return "Email o contraseña incorrectos.";
  if (message.includes("Email not confirmed"))
    return "Todavía no confirmaste tu email. Revisá tu casilla de correo.";
  if (message.includes("rate limit"))
    return "Demasiados intentos. Esperá unos minutos y volvé a intentar.";
  return "No se pudo ingresar. Verificá tus datos.";
}