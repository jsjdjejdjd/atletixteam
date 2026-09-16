import { requireProfile } from "@/lib/auth";
import Link from "next/link";
import { EmptyState, SectionCard } from "@/components/ui";
import { AthleteRow } from "./athlete-row";
import { LinkAthleteForm } from "./link-athlete-form";

export const dynamic = "force-dynamic";

type AthleteRowData = {
  id: string;
  user_id: string;
  nivel: string | null;
  estado: string | null;
  program_id_actual: string | null;
  paciente: string;
};

export default async function AlumnosPage({
  searchParams,
}: {
  searchParams: Promise<{ programa?: string }>;
}) {
  const { programa } = await searchParams;
  const { supabase, user } = await requireProfile();

  const [athletesRes, programsRes] = await Promise.all([
    supabase
      .from("athletes")
      .select("id, user_id, nivel, estado")
      .eq("entrenador_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("programs")
      .select("id, nombre")
      .eq("entrenador_id", user.id)
      .eq("activo", true)
      .order("created_at", { ascending: false }),
  ]);

  const athletes = (athletesRes.data ?? []) as Pick<
    AthleteRowData,
    "id" | "user_id" | "nivel" | "estado"
  >[];
  const programs = (programsRes.data ?? []) as { id: string; nombre: string }[];

  const ids = athletes.map((a) => a.user_id);

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, nombre, apellido, email")
    .in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);

  const profileMap = new Map(
    (profiles ?? []).map((p) => [
      p.id,
      [p.nombre, p.apellido].filter(Boolean).join(" ") || p.email || "Sin nombre",
    ])
  );

  const { data: assignments } = await supabase
    .from("athlete_programs")
    .select("athlete_id, program_id, estado")
    .eq("estado", "activo")
    .in("athlete_id", athletes.map((a) => a.id).length
      ? athletes.map((a) => a.id)
      : ["00000000-0000-0000-0000-000000000000"]);

  const athleteProgramMap = new Map<string, string>();
  for (const asg of assignments ?? []) {
    athleteProgramMap.set(asg.athlete_id, asg.program_id);
  }

  const rows: AthleteRowData[] = athletes.map((a) => ({
    ...a,
    paciente: profileMap.get(a.user_id) ?? "Sin nombre",
    program_id_actual: athleteProgramMap.get(a.id) ?? null,
  }));

  return (
    <div className="flex flex-col gap-8">
      <section>
        <p className="text-sm font-medium text-zinc-500">Panel del entrenador</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Alumnos</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Vinculá alumnos y asignales su programa.
        </p>
      </section>

      <SectionCard title="Vincular un alumno">
        <div className="p-6">
          <p className="mb-4 text-sm text-zinc-500">
            El alumno primero debe tener una cuenta en ATLETIX (registrarse o
            crearla desde Supabase). Después la vinculás acá con su email.
          </p>
          <LinkAthleteForm />
        </div>
      </SectionCard>

      {programs.length === 0 ? (
        <p className="rounded-lg border border-amber-900/60 bg-amber-950/30 px-4 py-3 text-sm text-amber-200">
          Para asignar programas, primero creá al menos uno en la sección{" "}
          <Link
            href="/entrenador/programas"
            className="font-semibold underline"
          >
            Programas
          </Link>
          .
        </p>
      ) : null}

      <SectionCard title={`Tus alumnos (${rows.length})`}>
        {rows.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="Todavía no tenés alumnos vinculados"
              description="Usá el formulario de arriba con el email de la cuenta."
            />
          </div>
        ) : (
          <ul className="divide-y divide-zinc-800">
            {rows.map((row) => (
              <AthleteRow
                key={row.id}
                athlete={row}
                programs={programs}
                defaultProgramId={programa ?? ""}
              />
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}