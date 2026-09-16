import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { SectionCard } from "@/components/ui";
import { CoachChatList } from "@/components/chat/coach-chat-list";

export const dynamic = "force-dynamic";

export default async function ChatEntrenadorPage() {
  const { user, profile } = await requireProfile();

  if (profile.rol !== "admin") redirect("/alumno");

  return (
    <div className="flex flex-col gap-8">
      <section>
        <p className="text-sm font-medium text-zinc-500">Panel del entrenador</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Chat</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Las conversaciones con tus alumnos. Los no leídos aparecen marcados.
        </p>
      </section>

      <SectionCard title="Conversaciones">
        <div className="p-6">
          <CoachChatList meId={user.id} />
          <p className="mt-4 text-xs text-zinc-600">
            Los mensajes se actualizan solos cada pocos segundos.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}