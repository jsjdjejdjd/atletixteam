import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { LinkButton, EmptyState } from "@/components/ui";
import { categoriaLabel } from "@/lib/levels";

export const dynamic = "force-dynamic";

type Program = {
  id: string;
  nombre: string;
  objetivo: string | null;
  descripcion: string | null;
  nivel: string | null;
  categoria: string | null;
  duracion_semanas: number | null;
  activo: boolean;
};

const ORDER = ["general", "power_free", "planche", "front_lever"];

export default async function ProgramasPage() {
  const { supabase, user } = await requireProfile();

  const { data: programs } = await supabase
    .from("programs")
    .select("id, nombre, objetivo, descripcion, nivel, categoria, duracion_semanas, activo")
    .eq("entrenador_id", user.id)
    .order("created_at", { ascending: false });

  const list = (programs ?? []) as Program[];
  const listAsesorias = list.filter((p) => (p.categoria ?? "general") === "asesoria_online");
  const visibles = list.filter((p) => (p.categoria ?? "general") !== "asesoria_online");

  const grupos = ORDER.map((cat) => ({
    cat,
    label: categoriaLabel(cat),
    items: visibles.filter((p) => (p.categoria ?? "general") === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="flex flex-col gap-8">
      <section className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-500">Panel del entrenador</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Programas</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Calistenia General · Planche · Front Lever — cada uno con niveles
            (Principiante, Intermedio, Avanzado, Elite).
          </p>
        </div>
        <LinkButton href="/entrenador/programas/nuevo" variant="primary">
          + Nuevo programa
        </LinkButton>
      </section>

      {visibles.length === 0 ? (
        <EmptyState
          title="Todavía no creaste programas"
          description="Creá tu primer programa eligiendo categoría (General, Planche o Front Lever) y su nivel."
        />
      ) : (
        <div className="flex flex-col gap-8">
          {grupos.map((grupo) => (
            <section key={grupo.cat}>
              <h2 className="mb-3 text-sm font-bold tracking-[0.2em] text-zinc-500 uppercase">
                {grupo.label}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {grupo.items.map((p) => (
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
                      <span className="rounded-full bg-white px-3 py-1 font-bold text-zinc-950">
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
            </section>
          ))}
        </div>
      )}
      {listAsesorias.length > 0 ? (
          <section>
            <h2 className="mb-3 text-sm font-bold tracking-[0.2em] text-zinc-500 uppercase">
              Asesorías online
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {listAsesorias.map((p) => (
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
                    <span className="rounded-full bg-white px-3 py-1 font-bold text-zinc-950">
                      {p.descripcion ?? p.nivel ?? "—"}
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
          </section>
        ) : null}
    </div>
  );
}