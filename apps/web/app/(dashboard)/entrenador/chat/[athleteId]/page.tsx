import { redirect } from "next/navigation";
import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { SectionCard } from "@/components/ui";
import { ChatRoom } from "@/components/chat/chat-room";

export const dynamic = "force-dynamic";

export default async function ChatConAlumnoPage({
  params,
}: {
  params: Promise<{ athleteId: string }>;
}) {
  const { athleteId } = await params;
  const { supabase, user, profile } = await requireProfile();

  if (profile.rol !== "admin") redirect("/alumno");

  const { data: athlete } = await supabase
    .from("athletes")
    .select("user_id")
    .eq("id", athleteId)
    .maybeSingle();

  if (!athlete) {
    return <p className="text-zinc-500">Alumno no encontrado.</p>;
  }

  const { data: profileData } = await supabase
    .from("profiles")
    .select("nombre, apellido, email")
    .eq("id", athlete.user_id)
    .maybeSingle();

  const nombre =
    [profileData?.nombre, profileData?.apellido].filter(Boolean).join(" ") ||
    profileData?.email ||
    "Alumno";

  return (
    <div className="flex flex-col gap-8">
      <section>
        <p className="text-sm font-medium text-zinc-500">
          <Link href="/entrenador/chat" className="hover:text-zinc-300">
            Chat
          </Link>{" "}
          / Conversación
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">{nombre}</h1>
      </section>

      <SectionCard title={nombre}>
        <div className="p-6">
          <ChatRoom
            meId={user.id}
            otroUserId={athlete.user_id}
            miRol="entrenador"
            titulo={`Conversación con ${nombre}`}
          />
        </div>
      </SectionCard>
    </div>
  );
}