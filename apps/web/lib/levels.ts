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

export const EJERCICIO_CATEGORIAS_CALISTENIA = [
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

export const EJERCICIO_CATEGORIAS_MUSCULACION = [
  "Pecho",
  "Espalda",
  "Hombros",
  "Bíceps",
  "Tríceps",
  "Antebrazos",
  "Cuádriceps",
  "Isquiotibiales",
  "Glúteos",
  "Aductores",
  "Abductores",
  "Pantorrillas",
  "Tibial anterior",
  "Cuerpo completo",
  "Accesorios",
  "Core",
  "Prehabilitación",
];

export const EJERCICIO_CATEGORIAS = Array.from(
  new Set([...EJERCICIO_CATEGORIAS_CALISTENIA, ...EJERCICIO_CATEGORIAS_MUSCULACION])
);

export const DISCIPLINAS = ["Calistenia", "Musculación"] as const;
export type Disciplina = (typeof DISCIPLINAS)[number];

export function categoriasDe(disciplina: string | null | undefined): string[] {
  return disciplina === "Musculación"
    ? EJERCICIO_CATEGORIAS_MUSCULACION
    : EJERCICIO_CATEGORIAS_CALISTENIA;
}

export const TIPOS_EJERCICIO = [
  "Compuesto",
  "Aislado",
  "Accesorio",
  "Estabilidad",
  "Potencia",
  "Movilidad",
] as const;

export const TIPOS_RESISTENCIA = [
  "Peso corporal",
  "Barra",
  "Mancuernas",
  "Kettlebell",
  "Máquina",
  "Polea",
  "Banda",
  "Mixto",
] as const;

export const CADENAS_CINETICAS = ["Abierta", "Cerrada"] as const;

export const OBJETIVOS = [
  "Fuerza",
  "Hipertrofia",
  "Resistencia",
  "Potencia",
  "Técnica",
  "Control corporal",
] as const;

export const MOVIMIENTOS = [
  "Tirón vertical",
  "Tirón horizontal",
  "Empuje vertical",
  "Empuje horizontal",
  "Elevación",
  "Aducción",
  "Abducción",
  "Rotación interna",
  "Rotación externa",
  "Flexión de codo",
  "Extensión de codo",
  "Flexión de hombro",
  "Trabajo de agarre",
  "Elevación escapular",
  "Dominante de rodilla",
  "Dominante de cadera",
  "Bisagra de cadera",
  "Extensión de cadera",
  "Flexión de rodilla",
  "Aducción de cadera",
  "Abducción de cadera",
  "Flexión plantar",
  "Dorsiflexión",
  "Flexión de tronco",
  "Anti-extensión",
  "Rotación",
  "Anti-rotación",
  "Flexión lateral",
  "Anti-flexión lateral",
  "Estabilidad lumbo-pélvica",
  "Acarreo (carry)",
  "Cuerpo completo",
  "Potencia",
] as const;
