import { requireProfile } from "@/lib/auth";
import { LinkButton, EmptyState } from "@/components/ui";
import EjerciciosBrowser from "@/components/ejercicios-browser";

export const dynamic = "force-dynamic";

type Exercise = {
  id: string;
  nombre: string;
  categoria: string;
  dificultad: string;
  tipo: string | null;
  video_url: string | null;
};

export default async function EjerciciosPage() {
  const { supabase } = await requireProfile();

  let data: Exercise[] | null = (
    await supabase
      .from("exercises")
      .select("id, nombre, categoria, dificultad, tipo, video_url")
      .order("nombre", { ascending: true })
  ).data as Exercise[] | null;

  if (!data) {
    data = (
      await supabase
        .from("exercises")
        .select("id, nombre, categoria, dificultad, video_url")
        .order("nombre", { ascending: true })
    ).data as Exercise[] | null;
  }

  const list = data ?? [];

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
        <EjerciciosBrowser exercises={list} />
      )}
    </div>
  );
}