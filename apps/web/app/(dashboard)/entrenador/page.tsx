import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type AthleteRow = {
  id: string;
  user_id: string;
  nivel: string | null;
  objetivo: string | null;
  estado: string | null;
  fecha_inicio: string | null;
};

export default async function EntrenadorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p className="text-zinc-500">Sin sesión.</p>;
  }

  const [athletesRes, programsRes] = await Promise.all([
    supabase
      .from("athletes")
      .select("id, user_id, nivel, objetivo, estado, fecha_inicio")
      .eq("entrenador_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("programs")
      .select("id, nombre, activo")
      .eq("entrenador_id", user.id)
      .eq("activo", true),
  ]);

  const athletes = (athletesRes.data ?? []) as AthleteRow[];
  const programas = programsRes.data ?? [];

  const activos = athletes.filter((a) => a.estado === "activo").length;

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, nombre, apellido, email")
    .in(
      "id",
      athletes.map((a) => a.user_id)
    );

  const profileMap = new Map(
    (profiles ?? []).map((p) => [
      p.id,
      [p.nombre, p.apellido].filter(Boolean).join(" ") || p.email || "Alumno",
    ])
  );

  return (
    <div className="flex flex-col gap-8">
      <section>
        <p className="text-sm font-medium text-zinc-500">Panel del entrenador</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Dashboard</h1>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Alumnos totales" value={athletes.length} />
        <StatCard label="Alumnos activos" value={activos} />
        <StatCard label="Programas activos" value={programas.length} />
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40">
        <div className="border-b border-zinc-800 px-6 py-4">
          <h2 className="text-lg font-bold">Tus alumnos</h2>
        </div>

        {athletes.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-zinc-500">
            Todavía no tenés alumnos. En la próxima fase vas a poder crearlos
            y asignarles programas.
          </div>
        ) : (
          <ul className="divide-y divide-zinc-800">
            {athletes.map((athlete) => (
              <li
                key={athlete.id}
                className="flex items-center justify-between gap-4 px-6 py-4"
              >
                <div>
                  <p className="font-semibold">
                    {profileMap.get(athlete.user_id) ?? "Sin nombre"}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {athlete.nivel ?? "—"} {athlete.objetivo ? `· ${athlete.objetivo}` : ""}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    athlete.estado === "activo"
                      ? "bg-emerald-950 text-emerald-300"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {athlete.estado === "activo" ? "Activo" : "Inactivo"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}