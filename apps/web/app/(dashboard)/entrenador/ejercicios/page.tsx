import { requireProfile } from "@/lib/auth";
import { LinkButton, EmptyState, SectionCard } from "@/components/ui";

export const dynamic = "force-dynamic";

type Exercise = {
  id: string;
  nombre: string;
  categoria: string;
  dificultad: string;
  video_url: string | null;
};

export default async function EjerciciosPage() {
  const { supabase } = await requireProfile();

  const { data: exercises } = await supabase
    .from("exercises")
    .select("id, nombre, categoria, dificultad, video_url")
    .order("nombre", { ascending: true });

  const list = (exercises ?? []) as Exercise[];

  return (
    <div className="flex flex-col gap-8">
      <section className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-500">Panel del entrenador</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">
            Biblioteca de ejercicios
          </h1>
        </div>
        <LinkButton href="/entrenador/ejercicios/nuevo" variant="primary">
          + Nuevo ejercicio
        </LinkButton>
      </section>

      {list.length === 0 ? (
        <EmptyState
          title="Todavía no hay ejercicios"
          description="Creá el primero para empezar a armar tus programas."
        />
      ) : (
        <SectionCard>
          <ul className="divide-y divide-zinc-800">
            {list.map((ex) => (
              <li
                key={ex.id}
                className="flex items-center justify-between gap-4 px-6 py-4"
              >
                <div>
                  <p className="font-semibold">{ex.nombre}</p>
                  <p className="text-sm text-zinc-500">
                    {ex.categoria} · {ex.dificultad}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {ex.video_url ? (
                    <a
                      href={ex.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-zinc-800 px-3 py-1 text-zinc-300 transition hover:bg-zinc-700"
                    >
                      ▶ Video
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}
    </div>
  );
}