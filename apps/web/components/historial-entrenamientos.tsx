import { requireProfile } from "@/lib/auth";
import { EmptyState, SectionCard } from "@/components/ui";
import { CopiarResumen } from "@/components/copiar-resumen";
import { cargarLogs } from "@/lib/registros/cargar";
import { aWhatsApp, detalleSerie, resumenDeAlumno } from "@/lib/registros/resumen";

function diaLargo(iso: string): string {
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}

export async function HistorialEntrenamientos({ athleteId }: { athleteId: string }) {
  const { supabase, profile } = await requireProfile();

  const porAlumno = await cargarLogs(supabase, [athleteId]);
  const logs = porAlumno.get(athleteId) ?? [];
  const nombre = [profile?.nombre, profile?.apellido].filter(Boolean).join(" ") || "vos";

  const resumen = resumenDeAlumno(nombre, logs);
  const whatsapp = aWhatsApp(resumen);

  const porDia = new Map<string, typeof logs>();
  for (const l of logs) {
    const lista = porDia.get(l.fecha) ?? [];
    lista.push(l);
    porDia.set(l.fecha, lista);
  }
  const dias = [...porDia.entries()].reverse();

  return (
    <>
      <SectionCard title="Historial de entrenamientos">
        <div className="flex flex-col gap-4 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-zinc-800 px-3 py-1 text-zinc-200">
                <strong>{resumen.dias.length}</strong> días entrenados
              </span>
              <span className="rounded-full bg-zinc-800 px-3 py-1 text-zinc-200">
                <strong>{resumen.ejerciciosDistintos}</strong> ejercicios
              </span>
              {resumen.desde ? (
                <span className="rounded-full bg-zinc-800 px-3 py-1 text-zinc-300">
                  {diaLargo(resumen.desde)} → {diaLargo(resumen.hasta!)}
                </span>
              ) : null}
            </div>
            <CopiarResumen texto={whatsapp} />
          </div>

          {dias.length === 0 ? (
            <EmptyState
              title="Todavía no entrenaste con la app"
              description="Cuando completes una sesión, acá queda guardado día por día qué hiciste, con qué cargas y a cuántas reps."
            />
          ) : (
            <div className="flex flex-col gap-4">
              {dias.map(([fecha, items]) => {
                const sesiones = [...new Set(items.map((i) => i.workoutNombre))];
                return (
                  <div
                    key={fecha}
                    className="rounded-2xl border border-zinc-800 bg-zinc-950/50"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-zinc-800 px-5 py-3">
                      <p className="font-bold">{diaLargo(fecha)}</p>
                      <p className="text-xs text-zinc-500">
                        {sesiones.join(" · ")}
                      </p>
                    </div>
                    <ul className="divide-y divide-zinc-900">
                      {items.map((l) => (
                        <li key={l.id} className="px-5 py-3">
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <p className="font-medium">{l.ejercicioNombre}</p>
                            <p className="text-sm text-zinc-400">
                              {detalleSerie(l.series)}
                            </p>
                          </div>
                          {l.comentarios ? (
                            <p className="mt-1.5 rounded-lg bg-zinc-950/60 px-3 py-1.5 text-xs text-zinc-400">
                              {l.comentarios}
                            </p>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </SectionCard>
    </>
  );
}
