import { LinkButton } from "@/components/ui";
import { requireProfile } from "@/lib/auth";
import { CrearProgramaForm } from "../crear-programa";

export const dynamic = "force-dynamic";

export default async function NuevoProgramaAlumnoPage() {
  const { supabase } = await requireProfile();

  const { data: exercises } = await supabase
    .from("exercises")
    .select("id, nombre, categoria, dificultad")
    .eq("activo", true)
    .order("nombre", { ascending: true });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-500">Programas</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight">
            Crear mi programa
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Armá tus días con los ejercicios de la biblioteca y empezá a entrenar
            cuando quieras.
          </p>
        </div>
        <LinkButton href="/alumno/programas">Cancelar</LinkButton>
      </div>

      <CrearProgramaForm
        exercises={
          (exercises ?? []) as {
            id: string;
            nombre: string;
            categoria: string | null;
            dificultad: string | null;
          }[]
        }
      />
    </div>
  );
}