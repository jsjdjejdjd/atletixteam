"use client";

import { useState } from "react";
import type { Producto } from "@/lib/supplements";
import { formatearPrecio, linkWhatsApp } from "@/lib/supplements";

export function ProductCard({ producto }: { producto: Producto }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-900">
        {producto.etiqueta ? (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-emerald-400 px-2.5 py-1 text-xs font-bold text-zinc-950">
            {producto.etiqueta}
          </span>
        ) : null}
        {imgError ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-zinc-600">
            <span className="text-3xl font-black text-zinc-700">
              {producto.marca.charAt(0)}
            </span>
            <span className="text-xs uppercase tracking-wider">Foto en breve</span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
          {producto.marca}
        </p>
        <h3 className="mt-1 font-bold">{producto.nombre}</h3>
        <p className="mt-1 text-sm leading-relaxed text-zinc-400">{producto.descripcion}</p>
        <p className="mt-3 text-lg font-black">{formatearPrecio(producto.precio)}</p>
        <a
          href={linkWhatsApp(producto.nombre)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block w-full rounded-full bg-white px-4 py-2.5 text-center text-sm font-bold text-zinc-950 transition hover:bg-zinc-200"
        >
          Pedir por WhatsApp
        </a>
      </div>
    </div>
  );
}