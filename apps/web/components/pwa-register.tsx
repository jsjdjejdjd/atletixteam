"use client";

import { useEffect } from "react";

const RECOVERY_KEY = "atletix:chunk-reload";

function esErrorDeChunk(value: unknown): boolean {
  const msg =
    typeof value === "string"
      ? value
      : value instanceof Error
        ? `${value.name} ${value.message}`
        : "";
  return /ChunkLoadError|Loading chunk [\w-]+ failed|Failed to fetch dynamically imported module|Importing a module script failed/i.test(
    msg
  );
}

export function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const onLoad = () => {
        // updateViaCache "none": el sw.js siempre se revalida contra la red, así
        // una versión nueva se activa sin quedar pegada en el caché HTTP.
        navigator.serviceWorker
          .register("/sw.js", { updateViaCache: "none" })
          .catch(() => {
            // offline no disponible; la web sigue funcionando igual
          });
      };
      if (document.readyState === "complete") onLoad();
      else window.addEventListener("load", onLoad);
    }

    // Almacenamiento persistente: reduce el riesgo de que el navegador borre el
    // borrador del entrenamiento cuando necesita liberar espacio.
    try {
      void navigator.storage?.persist?.().catch(() => {});
    } catch {
      /* storage no disponible */
    }

    // Si la app quedó abierta en segundo plano y se deployó una versión nueva,
    // al volver puede fallar la carga de un chunk (página en blanco = "se
    // cerró"). Recargamos una sola vez para levantar el build actual.
    const recuperar = () => {
      try {
        const ultimo = Number(sessionStorage.getItem(RECOVERY_KEY) ?? 0);
        if (Date.now() - ultimo < 30_000) return; // evita un loop de recargas
        sessionStorage.setItem(RECOVERY_KEY, String(Date.now()));
      } catch {
        return;
      }
      window.location.reload();
    };

    const onError = (e: ErrorEvent) => {
      if (esErrorDeChunk(e.error) || esErrorDeChunk(e.message)) recuperar();
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      if (esErrorDeChunk(e.reason)) recuperar();
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
