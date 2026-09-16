"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { EmptyState } from "@/components/ui";

type AthleteRow = {
  id: string;
  user_id: string;
  nivel: string | null;
  nombre: string;
  email: string | null;
  conversationId: string | null;
  noLeidos: number;
  ultimoMensaje: { texto: string; mío: boolean; fecha: string } | null;
};

export function CoachChatList({ meId }: { meId: string }) {
  const supabase = createClient();
  const [rows, setRows] = useState<AthleteRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let activo = true;

    async function actualizar() {
      const { data: athletes } = await supabase
        .from("athletes")
        .select("id, user_id, nivel")
        .eq("entrenador_id", meId);

      if (!athletes || athletes.length === 0) {
        if (activo) {
          setRows([]);
          setLoading(false);
        }
        return;
      }

      const userIds = athletes.map((a) => a.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, nombre, apellido, email")
        .in("id", userIds);

      const profileMap = new Map(
        (profiles ?? []).map((p) => [
          p.id,
          {
            nombre:
              [p.nombre, p.apellido].filter(Boolean).join(" ") ||
              p.email ||
              "Sin nombre",
            email: p.email,
          },
        ])
      );

      const { data: conversations } = await supabase
        .from("conversations")
        .select("id, alumno_id")
        .eq("entrenador_id", meId);

      const convByAlumno = new Map(
        (conversations ?? []).map((c) => [c.alumno_id, c.id])
      );

      const nuevas: AthleteRow[] = [];
      for (const a of athletes) {
        const convId = convByAlumno.get(a.user_id) ?? null;
        let noLeidos = 0;
        let ultimoMensaje: AthleteRow["ultimoMensaje"] = null;

        if (convId) {
          const { data: msgs } = await supabase
            .from("messages")
            .select("id, sender_id, contenido, is_read, created_at")
            .eq("conversation_id", convId)
            .order("created_at", { ascending: false })
            .limit(50);
          const list = (msgs ?? []) as { sender_id: string; contenido: string; is_read: boolean; created_at: string }[];
          if (list.length) {
            noLeidos = list.filter(
              (m) => m.sender_id !== meId && !m.is_read
            ).length;
            const ultimo = list[0];
            ultimoMensaje = {
              texto: ultimo.contenido,
              mío: ultimo.sender_id === meId,
              fecha: ultimo.created_at,
            };
          }
        }

        nuevas.push({
          id: a.id,
          user_id: a.user_id,
          nivel: a.nivel,
          nombre: profileMap.get(a.user_id)?.nombre ?? "Sin nombre",
          email: profileMap.get(a.user_id)?.email ?? null,
          conversationId: convId,
          noLeidos,
          ultimoMensaje,
        });
      }

      nuevas.sort((x, y) => {
        const fx = x.ultimoMensaje?.fecha ?? "";
        const fy = y.ultimoMensaje?.fecha ?? "";
        return fy.localeCompare(fx);
      });

      if (activo) {
        setRows(nuevas);
        setLoading(false);
      }
    }

    actualizar();
    const timer = setInterval(actualizar, 5000);
    return () => {
      activo = false;
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meId]);

  return (
    <div>
      {loading ? (
        <p className="text-sm text-zinc-500">Cargando conversaciones…</p>
      ) : rows.length === 0 ? (
        <EmptyState
          title="Todavía no tenés alumnos para chatear"
          description="Vinculá alumnos desde la sección Alumnos y cuando ellos te escriban, aparece acá."
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map((r) => (
            <li key={r.id}>
              <Link
                href={`/entrenador/chat/${r.id}`}
                className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 px-5 py-4 transition hover:border-zinc-600"
              >
                <div className="min-w-0">
                  <p className="font-semibold">
                    {r.nombre}
                    {r.noLeidos > 0 ? (
                      <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs font-black text-zinc-950">
                        {r.noLeidos}
                      </span>
                    ) : null}
                  </p>
                  {r.ultimoMensaje ? (
                    <p className="truncate text-sm text-zinc-500">
                      {r.ultimoMensaje.mío ? "Vos: " : ""}
                      {r.ultimoMensaje.texto}
                    </p>
                  ) : (
                    <p className="text-sm text-zinc-600">
                      Sin mensajes todavía.
                    </p>
                  )}
                </div>
                <span className="shrink-0 text-xs text-zinc-600">
                  Abrir →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}