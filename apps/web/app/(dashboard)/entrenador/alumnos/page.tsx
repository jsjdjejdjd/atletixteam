import { requireProfile } from "@/lib/auth";
import { EmptyState, SectionCard } from "@/components/ui";
import { AthleteRow } from "./athlete-row";
import { LinkAthleteForm } from "./link-athlete-form";

export const dynamic = "force-dynamic";

type AthleteRowData = {
  id: string;
  user_id: string;
  nivel: string | null;
  estado: string | null;
  paciente: string;
  programa_nombre: string | null;
};

export default async function AlumnosPage() {
  const { supabase, user } = await requireProfile();

  const { data: athletesRes } = await supabase
    .from("athletes")
    .select("id, user_id, nivel, estado")
    .eq("entrenador_id", user.id)
    .order("created_at", { ascending: false });

  const athletes = (athletesRes ?? []) as Pick<
    AthleteRowData,
    "id" | "user_id" | "nivel" | "estado"
  >[];

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

  const activeProgramIds = [
    ...new Set((assignments ?? []).map((asg) => asg.program_id)),
  ];

  const { data: programs } = activeProgramIds.length
    ? await supabase
        .from("programs")
        .select("id, nombre")
        .in("id", activeProgramIds)
    : { data: [] };

  const programNameMap = new Map<string, string>(
    (programs ?? []).map((p) => [p.id, p.nombre])
  );

  const athleteProgramMap = new Map<string, string>();
  for (const asg of assignments ?? []) {
    const name = programNameMap.get(asg.program_id);
    if (name) athleteProgramMap.set(asg.athlete_id, name);
  }

  const rows: AthleteRowData[] = athletes.map((a) => ({
    ...a,
    paciente: profileMap.get(a.user_id) ?? "Sin nombre",
    programa_nombre: athleteProgramMap.get(a.id) ?? null,
  }));

  return (
    <div className="flex flex-col gap-8">
      <section>
        <p className="text-sm font-medium text-zinc-500">Panel del entrenador</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Alumnos</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Tus alumnos eligen su programa desde su cuenta. Acá ves su nivel y en
          qué programa están.
        </p>
      </section>

      <SectionCard title="Vincular un alumno">
        <div className="p-6">
          <p className="mb-4 text-sm text-zinc-500">
            El alumno primero debe tener una cuenta en ATLETIX. Después la
            vinculás acá con su email.
          </p>
          <LinkAthleteForm />
        </div>
      </SectionCard>

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
              <AthleteRow key={row.id} athlete={row} />
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}