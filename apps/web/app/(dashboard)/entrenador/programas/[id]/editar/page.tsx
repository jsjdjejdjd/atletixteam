import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { ProgramForm } from "../../program-form";

export const dynamic = "force-dynamic";

export default async function EditarProgramaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireProfile();

  const { data: program } = await supabase
    .from("programs")
    .select("id, nombre, objetivo, nivel, duracion_semanas, descripcion, categoria")
    .eq("id", id)
    .single();

  if (!program) {
    return <p className="text-zinc-500">Programa no encontrado.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/entrenador/programas" className="hover:text-zinc-300">
            Programas
          </Link>
          <span>/</span>
          <Link href={`/entrenador/programas/${id}`} className="hover:text-zinc-300">
            {program.nombre}
          </Link>
          <span>/</span>
          <span className="text-zinc-300">Editar</span>
        </div>
        <h1 className="mt-2 text-3xl font-black tracking-tight">
          Editar programa
        </h1>
      </div>

      <ProgramForm
        programId={id}
        initial={{
          nombre: program.nombre,
          objetivo: program.objetivo ?? "",
          nivel: program.nivel ?? "Intermedio",
          duracion_semanas: program.duracion_semanas?.toString() ?? "",
          descripcion: program.descripcion ?? "",
          categoria: program.categoria ?? "general",
        }}
      />
    </div>
  );
}