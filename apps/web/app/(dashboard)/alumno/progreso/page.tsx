import { requireProfile } from "@/lib/auth";
import { ProgressSections } from "@/components/progress-sections";

export const dynamic = "force-dynamic";

export default async function ProgresoAlumnoPage() {
  const { user } = await requireProfile();

  return (
    <div className="flex flex-col gap-8">
      <section>
        <p className="text-sm font-medium text-zinc-500">Tu evolución</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Mi progreso</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Pesajes, tests y récords de tus entrenamientos registrados.
        </p>
      </section>

      <ProgressSections athleteId={user.id} />
    </div>
  );
}