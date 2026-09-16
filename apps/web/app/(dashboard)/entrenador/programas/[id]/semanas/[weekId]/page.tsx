import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { EmptyState, SectionCard } from "@/components/ui";
import { WorkoutForm } from "./workout-form";

export const dynamic = "force-dynamic";

export default async function SemanaPage({
  params,
}: {
  params: Promise<{ id: string; weekId: string }>;
}) {
  const { id, weekId } = await params;
  const { supabase } = await requireProfile();

  const { data: week } = await supabase
    .from("weeks")
    .select("id, numero, objetivo, es_descarga, program_id")
    .eq("id", weekId)
    .single();

  if (!week) {
    return <p className="text-zinc-500">Semana no encontrada.</p>;
  }

  const { data: workouts } = await supabase
    .from("workouts")
    .select("id, nombre, dia, descripcion")
    .eq("week_id", weekId)
    .order("orden", { ascending: true });

  const list = (workouts ?? []) as {
    id: string;
    nombre: string;
    dia: number | null;
    descripcion: string | null;
  }[];

  return (
    <div className="flex flex-col gap-8">
      <section>
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/entrenador/programas" className="hover:text-zinc-300">
            Programas
          </Link>
          <span>/</span>
          <Link href={`/entrenador/programas/${id}`} className="hover:text-zinc-300">
            Programa
          </Link>
          <span>/</span>
          <span className="text-zinc-300">
            Semana {week.numero}
            {week.es_descarga ? " (Descarga)" : ""}
          </span>
        </div>
        <h1 className="mt-2 text-3xl font-black tracking-tight">
          Semana {week.numero}
        </h1>
        {week.objetivo ? (
          <p className="mt-1 text-sm text-zinc-400">{week.objetivo}</p>
        ) : null}
      </section>

      <SectionCard title="Agregar sesión de entrenamiento">
        <div className="p-6">
          <WorkoutForm weekId={weekId} />
        </div>
      </SectionCard>

      {list.length === 0 ? (
        <EmptyState
          title="Esta semana no tiene sesiones"
          description="Agregá la primera sesión (ej: Día 1 – Empuje)."
        />
      ) : (
        <SectionCard title="Sesiones">
          <ul className="divide-y divide-zinc-800">
            {list.map((wo) => (
              <li key={wo.id}>
                <Link
                  href={`/entrenador/programas/${id}/semanas/${weekId}/entrenamientos/${wo.id}`}
                  className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-zinc-900/60"
                >
                  <div>
                    <p className="font-semibold">
                      Día {wo.dia ?? "?"} · {wo.nombre}
                    </p>
                    {wo.descripcion ? (
                      <p className="text-sm text-zinc-500">{wo.descripcion}</p>
                    ) : null}
                  </div>
                  <span className="text-xs font-medium text-zinc-500">
                    Armar ejercicios →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}
    </div>
  );
}