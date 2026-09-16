import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { LinkButton, EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

type Program = {
  id: string;
  nombre: string;
  objetivo: string | null;
  nivel: string | null;
  duracion_semanas: number | null;
  activo: boolean;
};

export default async function ProgramasPage() {
  const { supabase, user } = await requireProfile();

  const { data: programs } = await supabase
    .from("programs")
    .select("id, nombre, objetivo, nivel, duracion_semanas, activo")
    .eq("entrenador_id", user.id)
    .order("created_at", { ascending: false });

  const list = (programs ?? []) as Program[];

  return (
    <div className="flex flex-col gap-8">
      <section className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-500">Panel del entrenador</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Programas</h1>
        </div>
        <LinkButton href="/entrenador/programas/nuevo" variant="primary">
          + Nuevo programa
        </LinkButton>
      </section>

      {list.length === 0 ? (
        <EmptyState
          title="Todavía no creaste programas"
          description="Creá tu primer programa para organizar los bloques y semanas."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {list.map((p) => (
            <Link
              key={p.id}
              href={`/entrenador/programas/${p.id}`}
              className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 transition hover:border-zinc-600"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold">{p.nombre}</h2>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    p.activo
                      ? "bg-emerald-950 text-emerald-300"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {p.activo ? "Activo" : "Inactivo"}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
                {p.objetivo ?? "Objetivo por definir"}
              </p>
              <div className="mt-4 flex gap-2 text-xs">
                <span className="rounded-full border border-zinc-700 px-3 py-1 text-zinc-300">
                  {p.nivel ?? "—"}
                </span>
                <span className="rounded-full border border-zinc-700 px-3 py-1 text-zinc-300">
                  {p.duracion_semanas ?? "?"} semanas
                </span>
              </div>
              <p className="mt-4 text-xs font-medium text-zinc-500 transition group-hover:text-zinc-300">
                Ver programa →
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}