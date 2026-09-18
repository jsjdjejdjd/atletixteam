import { requireProfile } from "@/lib/auth";
import { LinkButton, EmptyState } from "@/components/ui";
import EjerciciosBrowser, { type Exercise } from "@/components/ejercicios-browser";

export const dynamic = "force-dynamic";

const CAMPOS_COMPLETOS =
  "id, nombre, nombre_en, aliases, categoria, subcategoria, dificultad, tipo, disciplina, tipo_ejercicio, tipo_resistencia, equipamiento, patron, musculos_primarios, musculos_secundarios, objetivo, unilateral, movement_type, skill, muscle_group, estado_clasificacion, duplicado_de, video_url";

const CAMPOS_BASE =
  "id, nombre, categoria, dificultad, tipo, video_url";

export default async function EjerciciosPage() {
  const { supabase } = await requireProfile();

  let data: Exercise[] | null = (
    await supabase
      .from("exercises")
      .select(CAMPOS_COMPLETOS)
      .order("nombre", { ascending: true })
  ).data as Exercise[] | null;

  if (!data) {
    data = (
      await supabase
        .from("exercises")
        .select(CAMPOS_BASE)
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
          <p className="mt-1 text-sm text-zinc-400">
            Calistenia y musculación viven en la misma base pero separadas por
            disciplina. Usá las pestañas para no mezclarlas.
          </p>
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
