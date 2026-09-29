import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { EmptyState, SectionCard } from "@/components/ui";
import { CopiarResumen } from "@/components/copiar-resumen";
import { cargarLogs } from "@/lib/registros/cargar";
import { aWhatsApp, detalleSerie, resumenDeAlumno } from "@/lib/registros/resumen";

export const dynamic = "force-dynamic";

/** Sin filtro mostramos los últimos 150 registros de todos los alumnos. Al
 *  elegir uno, bajamos su historial completo: el resumen que le vas a mandar
 *  no puede cortarse a mitad. */
const LIMITE_TODOS = 150;

export default async function RegistrosPage({
  searchParams,
}: {
  searchParams: Promise<{ athlete?: string }>;
}) {
  const { athlete } = await searchParams;
  const { supabase, user } = await requireProfile();

  const { data: athletesRes } = await supabase
    .from("athletes")
    .select("user_id")
    .eq("entrenador_id", user.id);

  const todos = [...new Set((athletesRes ?? []).map((a) => a.user_id as string))];

  if (athlete && !todos.includes(athlete)) {
    // No es alumno tuyo: no le mostramos nada.
    return <SinAcceso />;
  }

  const { data: profilesRes } = await supabase
    .from("profiles")
    .select("id, nombre, apellido, email")
    .in("id", todos.length ? todos : ["00000000-0000-0000-0000-000000000000"]);

  const nombreDe = new Map(
    (profilesRes ?? []).map((p) => [
      p.id as string,
      ([p.nombre, p.apellido].filter(Boolean).join(" ") ||
        p.email ||
        "Alumno") as string,
    ])
  );

  const porAlumno = await cargarLogs(
    supabase,
    athlete ? [athlete] : todos,
    athlete ? undefined : LIMITE_TODOS
  );

  // Los chips salen de `athletes`, no de los logs: si no, los alumnos que
  // todavía no entrenaron ni siquiera aparecen y no los podés seleccionar.
  const opciones = todos
    .map((id) => [id, nombreDe.get(id) ?? "Alumno"] as const)
    .sort((a, b) => a[1].localeCompare(b[1]));

  const logueados = todos.filter((id) => (porAlumno.get(id) ?? []).length > 0);
  const sinRegistrar = todos.length - logueados.length;

  const filtroNombre = athlete ? nombreDe.get(athlete) ?? "Alumno" : null;

  if (athlete) {
    const logs = porAlumno.get(athlete) ?? [];
    const resumen = resumenDeAlumno(filtroNombre!, logs);
    return <DetalleAlumno nombre={filtroNombre!} resumen={resumen} />;
  }

  const lineas = [...porAlumno.entries()].flatMap(([id, logs]) =>
    logs.map((l) => ({ ...l, athleteId: id }))
  );
  const porFecha = new Map<string, typeof lineas>();
  for (const l of lineas) {
    const lista = porFecha.get(l.fecha) ?? [];
    lista.push(l);
    porFecha.set(l.fecha, lista);
  }

  return (
    <div className="flex flex-col gap-8">
      <section>
        <p className="text-sm font-medium text-zinc-500">Panel del entrenador</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Registros</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Lo que cargaron tus alumnos: cuántas series hicieron y su mejor serie.
        </p>
      </section>

      <div className="flex flex-wrap gap-2">
        <Chip href="/entrenador/registros" activo={!athlete}>
          Todos
        </Chip>
        {opciones.map(([id, nombre]) => {
          const n = (porAlumno.get(id) ?? []).length;
          return (
            <Chip key={id} href={`/entrenador/registros?athlete=${id}`} activo={athlete === id}>
              {nombre}
              <span className={n === 0 ? "ml-1.5 text-zinc-600" : "ml-1.5 text-zinc-500"}>
                {n === 0 ? "sin registros" : n}
              </span>
            </Chip>
          );
        })}
      </div>

      {sinRegistrar > 0 ? (
        <p className="text-sm text-zinc-500">
          {sinRegistrar} de {todos.length} alumnos todavía no registraron ningún
          entrenamiento.
        </p>
      ) : null}

      {lineas.length === 0 ? (
        <EmptyState
          title="Todavía no hay registros"
          description="Cuando tus alumnos completen entrenamientos con la app, acá vas a ver sus series, cargas y comentarios."
        />
      ) : (
        <div className="flex flex-col gap-6">
          {[...porFecha.entries()].reverse().map(([fecha, items]) => (
            <SectionCard key={fecha} title={fecha}>
              <ul className="divide-y divide-zinc-800">
                {items.map((l) => (
                  <li key={l.id} className="px-6 py-4">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <Link
                        href={`/entrenador/registros?athlete=${l.athleteId}`}
                        className="font-semibold hover:underline"
                      >
                        {nombreDe.get(l.athleteId) ?? "Alumno"}
                      </Link>
                      <span className="text-xs text-zinc-600">·</span>
                      <p className="text-sm font-medium text-zinc-400">
                        {l.ejercicioNombre}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-zinc-400">
                      {detalleSerie(l.series)}
                    </p>
                    {l.comentarios ? (
                      <p className="mt-2 rounded-lg bg-zinc-950/60 px-3 py-2 text-xs text-zinc-400">
                        {l.comentarios}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </SectionCard>
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({
  href,
  activo,
  children,
}: {
  href: string;
  activo: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        activo
          ? "bg-white text-zinc-950"
          : "border border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}

function DetalleAlumno({
  nombre,
  resumen,
}: {
  nombre: string;
  resumen: ReturnType<typeof resumenDeAlumno>;
}) {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <Link
          href="/entrenador/registros"
          className="text-sm text-zinc-400 hover:text-white"
        >
          ← Todos los registros
        </Link>
        <h1 className="mt-2 text-3xl font-black tracking-tight">{nombre}</h1>
      </section>

      {resumen.totalRegistros === 0 ? (
        <EmptyState
          title={`${nombre} todavía no registró entrenamientos`}
          description="Cuando complete entrenamientos con la app, acá vas a ver su historial y le vas a poder mandar el resumen."
        />
      ) : (
        <>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="rounded-full bg-zinc-800 px-3 py-1 text-zinc-200">
                  <strong>{resumen.dias.length}</strong> días
                </span>
                <span className="rounded-full bg-zinc-800 px-3 py-1 text-zinc-200">
                  <strong>{resumen.totalRegistros}</strong> registros
                </span>
                <span className="rounded-full bg-zinc-800 px-3 py-1 text-zinc-200">
                  <strong>{resumen.ejerciciosDistintos}</strong> ejercicios
                </span>
                <span className="rounded-full bg-zinc-800 px-3 py-1 text-zinc-300">
                  {resumen.desde} → {resumen.hasta}
                </span>
              </div>
              <CopiarResumen texto={aWhatsApp(resumen)} />
            </div>
          </div>

          <SectionCard title="Mejores marcas por ejercicio">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-left text-xs tracking-widest text-zinc-500 uppercase">
                    <th className="px-6 py-3 font-semibold">Ejercicio</th>
                    <th className="px-6 py-3 font-semibold">Primera vez</th>
                    <th className="px-6 py-3 font-semibold">Mejor</th>
                    <th className="px-6 py-3 font-semibold">Progreso</th>
                    <th className="px-6 py-3 font-semibold">Veces</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {resumen.marcas.map((m) => (
                    <tr key={m.ejercicio}>
                      <td className="px-6 py-3 font-medium">{m.ejercicio}</td>
                      <td className="px-6 py-3 text-zinc-400">{m.primera}</td>
                      <td className="px-6 py-3 font-semibold text-zinc-100">
                        {m.mejor}
                      </td>
                      <td className="px-6 py-3">
                        {m.progreso == null ? (
                          <span className="text-zinc-600">—</span>
                        ) : m.progreso > 0 ? (
                          <span className="text-emerald-400">+{m.progreso}</span>
                        ) : m.progreso < 0 ? (
                          <span className="text-zinc-500">{m.progreso}</span>
                        ) : (
                          <span className="text-zinc-600">igual</span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-zinc-500">{m.veces}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {resumen.comentarios.length ? (
            <SectionCard title="Lo que anotó el alumno">
              <ul className="divide-y divide-zinc-800">
                {resumen.comentarios.map((c, i) => (
                  <li key={i} className="px-6 py-3 text-sm">
                    <span className="text-zinc-500">{c.fecha.slice(5)}</span>{" "}
                    <span className="font-medium">{c.ejercicio}</span>
                    <p className="mt-1 text-zinc-400">{c.texto}</p>
                  </li>
                ))}
              </ul>
            </SectionCard>
          ) : null}
        </>
      )}
    </div>
  );
}

function SinAcceso() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-black tracking-tight">No es tu alumno</h1>
      <EmptyState
        title="Ese alumno no está en tu lista"
        description="Podés ver únicamente los registros de los alumnos que tenés asignados."
      />
      <Link href="/entrenador/registros" className="text-sm text-zinc-400 hover:text-white">
        ← Volver a tus registros
      </Link>
    </div>
  );
}
