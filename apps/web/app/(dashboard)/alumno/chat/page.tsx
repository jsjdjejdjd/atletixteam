import { requireProfile } from "@/lib/auth";
import { SectionCard } from "@/components/ui";
import { ChatRoom } from "@/components/chat/chat-room";

export const dynamic = "force-dynamic";

export default async function ChatAlumnoPage() {
  const { supabase, user } = await requireProfile();

  const { data: athlete } = await supabase
    .from("athletes")
    .select("entrenador_id")
    .eq("user_id", user.id)
    .maybeSingle();

  const titulo = "Tu entrenador";

  return (
    <div className="flex flex-col gap-8">
      <section>
        <p className="text-sm font-medium text-zinc-500">Mi cuenta</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Chat</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Hablemos directo con tu entrenador. Los mensajes llegan al instante y
          quedan guardados.
        </p>
      </section>

      <SectionCard title={titulo}>
        <div className="p-6">
          <ChatRoom
            meId={user.id}
            otroUserId={athlete?.entrenador_id ?? null}
            miRol="alumno"
            titulo={titulo}
          />
        </div>
      </SectionCard>
    </div>
  );
}