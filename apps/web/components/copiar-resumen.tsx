"use client";

import { useState } from "react";

export function CopiarResumen({ texto }: { texto: string }) {
  const [estado, setEstado] = useState<"idle" | "ok" | "error">("idle");

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setEstado("ok");
    } catch {
      setEstado("error");
    }
    setTimeout(() => setEstado("idle"), 2500);
  }

  return (
    <button
      type="button"
      onClick={copiar}
      className="rounded-full border border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white"
    >
      {estado === "ok"
        ? "Copiado"
        : estado === "error"
          ? "No se pudo copiar"
          : "Copiar para WhatsApp"}
    </button>
  );
}
