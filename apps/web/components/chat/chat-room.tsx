"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  contenido: string;
  is_read: boolean;
  created_at: string;
};

export function ChatRoom({
  meId,
  otroUserId,
  miRol,
  titulo,
}: {
  meId: string;
  otroUserId: string | null;
  miRol: "entrenador" | "alumno";
  titulo: string;
}) {
  const supabase = createClient();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let activo = true;

    async function arrancar() {
      if (!otroUserId) {
        setLoading(false);
        setError(
          "Todavía no tenés un entrenador asignado para chatear. Elegí un programa y cuando tu entrenador te vincule aparece acá."
        );
        return;
      }

      const esEntrenador = miRol === "entrenador";

      const { data: existing } = await supabase
        .from("conversations")
        .select("id, entrenador_id, alumno_id")
        .eq("entrenador_id", esEntrenador ? meId : otroUserId)
        .eq("alumno_id", esEntrenador ? otroUserId : meId)
        .maybeSingle();

      let convId = existing?.id ?? null;

      if (!convId) {
        const { data: created } = await supabase
          .from("conversations")
          .insert({
            entrenador_id: esEntrenador ? meId : otroUserId,
            alumno_id: esEntrenador ? otroUserId : meId,
          })
          .select("id")
          .single();
        convId = created?.id ?? null;
      }

      if (!convId) {
        if (activo) {
          setLoading(false);
          setError("No se pudo iniciar la conversación. Intentalo de nuevo.");
        }
        return;
      }

      setConversationId(convId);
      await refrescar(convId);
      if (activo) setLoading(false);
    }

    arrancar();

    return () => {
      activo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otroUserId, meId, miRol]);

  async function refrescar(convId: string) {
    const { data, error: err } = await supabase
      .from("messages")
      .select("id, conversation_id, sender_id, contenido, is_read, created_at")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true })
      .limit(200);

    if (!err && data) {
      setMessages((prev) => {
        const ids = new Set(prev.map((m) => m.id));
        const nuevos = (data as Message[]).filter((m) => !ids.has(m.id));
        return nuevos.length ? [...prev, ...nuevos] : prev;
      });
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("conversation_id", convId)
        .eq("is_read", false)
        .neq("sender_id", meId);
    }
  }

  useEffect(() => {
    if (!conversationId) return;
    const timer = setInterval(async () => {
      await refrescar(conversationId);
    }, 4000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!conversationId || !texto.trim() || enviando) return;

    const contenido = texto.trim();
    setEnviando(true);
    const { error: err } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: meId,
      contenido,
    });

    if (err) {
      setError(err.message);
      setEnviando(false);
      return;
    }

    setTexto("");
    setEnviando(false);
    await refrescar(conversationId);
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <p className="font-semibold">{titulo}</p>
        {error ? null : (
          <span className="text-xs text-zinc-600">Actualizando…</span>
        )}
      </div>

      <div className="flex max-h-[50vh] min-h-[320px] flex-col gap-3 overflow-y-auto py-4">
        {loading ? (
          <p className="text-sm text-zinc-500">Cargando conversación…</p>
        ) : error ? (
          <p className="rounded-lg border border-amber-900/60 bg-amber-950/30 px-4 py-3 text-sm text-amber-300">
            {error}
          </p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-zinc-500">
            Sin mensajes todavía. Escribí lo primero que quieras compartir.
          </p>
        ) : (
          messages.map((m) => {
            const mio = m.sender_id === meId;
            return (
              <div
                key={m.id}
                className={`flex ${mio ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    mio
                      ? "rounded-br-md bg-white text-zinc-950"
                      : "rounded-bl-md border border-zinc-800 bg-zinc-900 text-zinc-100"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{m.contenido}</p>
                  <p className="mt-1 text-[10px] text-zinc-500">
                    {new Date(m.created_at).toLocaleString("es-AR", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={enviar} className="mt-2 flex items-center gap-2">
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribí tu mensaje…"
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-zinc-500"
        />
        <button
          type="submit"
          disabled={!texto.trim() || enviando}
          className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}