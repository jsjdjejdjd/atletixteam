"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const onLoad = () => {
        navigator.serviceWorker.register("/sw.js").catch(() => {
          // offline no disponible; la web sigue funcionando igual
        });
      };
      if (document.readyState === "complete") onLoad();
      else window.addEventListener("load", onLoad);
    }
  }, []);

  return null;
}