import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { EmptyState, LinkButton, SectionCard } from "@/components/ui";
import { WeekForm } from "./week-form";

export const dynamic = "force-dynamic";

export default async function ProgramaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireProfile();

  const { data: program } = await supabase
    .from("programs")
    .select("id, nombre, objetivo, nivel, duracion_semanas, descripcion")
    .eq("id", id)
    .single();

  if (!program) {
    return <p className="text-zinc-500">Programa no encontrado.</p>;
  }

  const { data: weeks } = await supabase
    .from("weeks")
    .select("id, numero, bloque, objetivo, es_descarga, notas")
    .eq("program_id", id)
    .order("numero", { ascending: true });

  const list = (weeks ?? []) as {
    id: string;
    numero: number;
    bloque: number | null;
    objetivo: string | null;
    es_descarga: boolean;
    notas: string | null;
  }[];

  // Agrupar por bloque
  const bloques = new Map<number, typeof list>();
  for (const w of list) {
    const b = w.bloque ?? 1;
    if (!bloques.has(b)) bloques.set(b, []);
    bloques.get(b)!.push(w);
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Link href="/entrenador/programas" className="hover:text-zinc-300">
              Programas
            </Link>
            <span>/</span>
            <span className="text-zinc-300">{program.nombre}</span>
          </div>
          <h1 className="mt-2 text-3xl font-black tracking-tight">
            {program.nombre}
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            {program.objetivo ?? "Objetivo por definir"} · {program.nivel ?? "—"}
            · {program.duracion_semanas ?? "?"} semanas
          </p>
        </div>
        <LinkButton href={`/entrenador/alumnos?programa=${id}`} variant="secondary">
          Asignar a alumnos
        </LinkButton>
      </section>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 px-6 py-4 text-sm text-zinc-400">
        <p className="font-bold text-zinc-300">Cómo cargar ejercicio:</p>
        <ol className="mt-2 list-inside list-decimal space-y-1">
          <li>Creá una <strong>semana</strong> con el formulario de abajo.</li>
          <li>
            Entrá a la semana y creá una <strong>sesión</strong> (ej: Día 1 –
            Empuje).
          </li>
          <li>
            Abrí la sesión y usá <strong>Agregar ejercicio</strong> para cargar
            cada ejercicio con sus series, RIR, cargas y descansos.
          </li>
        </ol>
      </div>

      <SectionCard title="Agregar semana">
        <div className="p-6">
          <WeekForm programId={id} />
        </div>
      </SectionCard>

      {list.length === 0 ? (
        <EmptyState
          title="Este programa no tiene semanas todavía"
          description="Agregá la semana 1 usando el formulario de arriba."
        />
      ) : (
        <div className="flex flex-col gap-6">
          {[...bloques.entries()].map(([bloque, semanas]) => (
            <section key={bloque}>
              <h2 className="mb-3 text-sm font-bold tracking-[0.2em] text-zinc-500 uppercase">
                Bloque {bloque}
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {semanas.map((w) => (
                  <Link
                    key={w.id}
                    href={`/entrenador/programas/${id}/semanas/${w.id}`}
                    className={`group rounded-2xl border p-5 transition hover:border-zinc-600 ${
                      w.es_descarga
                        ? "border-amber-900/70 bg-amber-950/20"
                        : "border-zinc-800 bg-zinc-900/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-black">Semana {w.numero}</p>
                      {w.es_descarga ? (
                        <span className="rounded-full bg-amber-950 px-3 py-1 text-xs font-semibold text-amber-300">
                          Descarga
                        </span>
                      ) : null}
                    </div>
                    {w.objetivo ? (
                      <p className="mt-1 text-sm text-zinc-400">{w.objetivo}</p>
                    ) : null}
                    <p className="mt-3 text-xs font-medium text-zinc-500 transition group-hover:text-zinc-300">
                      Ver sesiones →
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}