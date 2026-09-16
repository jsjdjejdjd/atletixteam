import { LinkButton } from "@/components/ui";
import { ProgramForm } from "../program-form";

export const dynamic = "force-dynamic";

export default function NuevoProgramaPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-500">Programas</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight">
            Nuevo programa
          </h1>
        </div>
        <LinkButton href="/entrenador/programas">Cancelar</LinkButton>
      </div>

      <ProgramForm />
    </div>
  );
}