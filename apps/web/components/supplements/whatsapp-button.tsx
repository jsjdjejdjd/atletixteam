"use client";

import { linkWhatsApp } from "@/lib/supplements";

type Props = {
  productoNombre?: string;
  className?: string;
  children: React.ReactNode;
};

export function WhatsAppButton({ productoNombre, className, children }: Props) {
  function abrir() {
    const url = linkWhatsApp(productoNombre);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <button type="button" onClick={abrir} className={className}>
      {children}
    </button>
  );
}