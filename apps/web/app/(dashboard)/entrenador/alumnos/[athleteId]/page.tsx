import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { ProgressSections } from "@/components/progress-sections";

export const dynamic = "force-dynamic";

export default async function AlumnoDetallePage({
  params,
}: {
  params: Promise<{ athleteId: string }>;
}) {
  const { athleteId } = await params;

  const { supabase, user } = await requireProfile();

  const { data: athlete } = await supabase
    .from("athletes")
    .select("id, user_id, nivel, objetivo, estado, fecha_inicio")
    .eq("id", athleteId)
    .eq("entrenador_id", user.id)
    .maybeSingle();

  if (!athlete) {
    return <p className="text-zinc-500">Alumno no encontrado.</p>;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("nombre, apellido, email")
    .eq("id", athlete.user_id)
    .maybeSingle();

  const nombre =
    [profile?.nombre, profile?.apellido].filter(Boolean).join(" ") ||
    profile?.email ||
    "Alumno";

  return (
    <div className="flex flex-col gap-8">
      <section>
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/entrenador/alumnos" className="hover:text-zinc-300">
            Alumnos
          </Link>
          <span>/</span>
          <span className="text-zinc-300">{nombre}</span>
        </div>
        <h1 className="mt-2 text-3xl font-black tracking-tight">{nombre}</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Nivel: {athlete.nivel ?? "—"} · Objetivo: {athlete.objetivo ?? "—"} ·
          Desde el {athlete.fecha_inicio}
        </p>
      </section>

      <ProgressSections athleteId={athlete.user_id} />
    </div>
  );
}