export const LEVELS = ["Principiante", "Intermedio", "Avanzado", "Elite"];

export const CATEGORIAS = [
  { value: "general", label: "Calistenia General" },
  { value: "planche", label: "Planche" },
  { value: "front_lever", label: "Front Lever" },
] as const;

export function categoriaLabel(cat: string | null) {
  if (cat === "planche") return "Planche";
  if (cat === "front_lever") return "Front Lever";
  return "Calistenia General";
}

export const FAMILIA_ASESORIAS: Record<
  string,
  { titulo?: string; etiquetaOpcion: "nivel" | "descripcion" }
> = {
  "Planche y Front level": { titulo: "Asesorías online", etiquetaOpcion: "descripcion" },
};