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

export const PROGRAMA_PLANCHE_NOMBRE = "Planche / Front Lever";

export function esProgramaPlanificable(nombre: string | null): boolean {
  if (nombre === PROGRAMA_PLANCHE_NOMBRE) return true;
  return Object.prototype.hasOwnProperty.call(FAMILIA_ASESORIAS, nombre ?? "");
}

export function labelSesion(dia: number | null, nombre: string | null): string {
  const n = (nombre ?? "").trim();
  if (dia == null) return n || "Sesión";
  const base = `Día ${dia}`;
  if (!n) return base;
  const norm = n
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
  if (norm === `dia ${dia}`) return base;
  return `${base} · ${n}`;
}

export const EJERCICIO_CATEGORIAS = [
  "Tirón",
  "Empuje",
  "Piernas",
  "Core",
  "Planche",
  "Front Lever",
  "Muscle Up",
  "Handstand",
  "Street Lifting",
  "Movilidad",
  "Prehabilitación",
];