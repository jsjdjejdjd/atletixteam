import { requireProfile } from "@/lib/auth";
import { EmptyState, LinkButton } from "@/components/ui";
import { categoriaLabel } from "@/lib/levels";
import { EnrollButton } from "./enroll-button";

export const dynamic = "force-dynamic";

const ORDER = ["general", "planche", "front_lever"] as const;

type Program = {
  id: string;
  nombre: string;
  objetivo: string | null;
  descripcion: string | null;
  nivel: string | null;
  categoria: string | null;
  duracion_semanas: number | null;
};

export default async function ProgramasCatalogoPage() {
  const { supabase, user } = await requireProfile();

  const { data: programs } = await supabase
    .from("programs")
    .select("id, nombre, objetivo, descripcion, nivel, categoria, duracion_semanas")
    .eq("activo", true)
    .order("nombre", { ascending: true });

  const { data: mine } = await supabase
    .from("programs")
    .select("id, nombre, objetivo, descripcion, nivel, categoria, duracion_semanas")
    .eq("created_by", user.id)
    .order("created_at", { ascending: false });

  const list = (programs ?? []) as Program[];
  const misProgramas = (mine ?? []) as Program[];

  let miProgramaId: string | null = null;
  const { data: athlete } = await supabase
    .from("athletes")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (athlete) {
    const { data: active } = await supabase
      .from("athlete_programs")
      .select("program_id")
      .eq("athlete_id", athlete.id)
      .eq("estado", "activo")
      .maybeSingle();
    miProgramaId = active?.program_id ?? null;
  }

  const grupos = ORDER.map((cat) => ({
    cat,
    label: categoriaLabel(cat),
    items: list.filter((p) => (p.categoria ?? "general") === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-500">Catálogo de entrenamiento</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Programas</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Elegí un programa ya armado por tu entrenador, o creá el tuyo propio con
            los ejercicios de la biblioteca. Podés cambiar en cualquier momento.
          </p>
        </div>
        <LinkButton href="/alumno/programas/nuevo" variant="primary">
          + Crear mi programa
        </LinkButton>
      </section>

      {misProgramas.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-bold tracking-[0.2em] text-zinc-500 uppercase">
            Mis programas
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {misProgramas.map((p) => {
              const esMio = p.id === miProgramaId;
              return (
                <div
                  key={p.id}
                  className={`flex flex-col rounded-2xl border p-6 ${
                    esMio
                      ? "border-emerald-800/70 bg-emerald-950/20"
                      : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-600"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-bold">{p.nombre}</h3>
                    <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-semibold text-zinc-300">
                      Propio
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-white px-3 py-1 font-bold text-zinc-950">
                      {p.nivel ?? "—"}
                    </span>
                    <span className="rounded-full border border-zinc-700 px-3 py-1 text-zinc-300">
                      1 semana
                    </span>
                  </div>
                  {p.objetivo ? (
                    <p className="mt-3 text-sm text-zinc-400">{p.objetivo}</p>
                  ) : null}
                  <div className="mt-4 flex justify-end">
                    <EnrollButton programId={p.id} isCurrent={esMio} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="flex items-center justify-between gap-4 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20 p-6">
          <div>
            <h2 className="text-lg font-bold">Armalo a tu gusto</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Elegí los días y los ejercicios de la biblioteca que más te sirvan.
            </p>
          </div>
          <LinkButton href="/alumno/programas/nuevo" variant="primary">
            + Crear mi programa
          </LinkButton>
        </section>
      )}

      {grupos.length === 0 ? (
        <EmptyState
          title="Todavía no hay programas de tu entrenador"
          description="Mientras tanto podés crear tu propio programa con los ejercicios de la biblioteca."
        />
      ) : (
        <div className="flex flex-col gap-8">
          {grupos.map((grupo) => (
            <section key={grupo.cat}>
              <h2 className="mb-3 text-sm font-bold tracking-[0.2em] text-zinc-500 uppercase">
                {grupo.label}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {grupo.items.map((p) => {
                  const esMio = p.id === miProgramaId;
                  return (
                    <div
                      key={p.id}
                      className={`flex flex-col rounded-2xl border p-6 transition ${
                        esMio
                          ? "border-emerald-800/70 bg-emerald-950/20"
                          : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-600"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-lg font-bold">{p.nombre}</h3>
                        {esMio ? (
                          <span className="rounded-full bg-emerald-950 px-3 py-1 text-xs font-semibold text-emerald-300">
                            Mi programa
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-white px-3 py-1 font-bold text-zinc-950">
                          {p.nivel ?? "—"}
                        </span>
                        <span className="rounded-full border border-zinc-700 px-3 py-1 text-zinc-300">
                          {p.duracion_semanas ?? "?"} semanas
                        </span>
                      </div>
                      {p.objetivo ? (
                        <p className="mt-3 text-sm text-zinc-400">{p.objetivo}</p>
                      ) : null}
                      {p.descripcion ? (
                        <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
                          {p.descripcion}
                        </p>
                      ) : null}
                      <div className="mt-4 flex justify-end">
                        <EnrollButton programId={p.id} isCurrent={esMio} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}