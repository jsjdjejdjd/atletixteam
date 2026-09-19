export const LEVELS = ["Principiante", "Intermedio", "Avanzado", "Elite"];

export const CATEGORIAS = [
  { value: "general", label: "Calistenia General" },
  { value: "planche", label: "Planche" },
  { value: "front_lever", label: "Front Lever" },
  { value: "power_free", label: "Combos Power Free" },
] as const;

export function categoriaLabel(cat: string | null) {
  if (cat === "planche") return "Planche";
  if (cat === "front_lever") return "Front Lever";
  return "Calistenia General";
}

export function esProgramaCombo(categoria: string | null, nombre: string | null): boolean {
  if (categoria === "planche" || categoria === "front_lever" || categoria === "power_free")
    return true;
  const norm = (nombre ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  return (
    norm.includes("planche") ||
    norm.includes("plancha") ||
    norm.includes("front lever") ||
    norm.includes("frontlevel")
  );
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
  "Empuje",
  "Tirón",
  "Core",
  "Piernas",
  "Skills",
  "Dinámicos",
  "Agarre",
];

export const SUBCATEGORIAS_CALISTENIA: Record<string, string[]> = {
  Empuje: [
    "Empuje horizontal",
    "Empuje vertical",
    "Fondos",
    "Planche",
    "Estáticos avanzados",
    "Accesorios de empuje",
  ],
  Tirón: [
    "Dominadas",
    "Remos",
    "Front Lever",
    "Back Lever",
    "Fuerza de tirón",
    "Bíceps / accesorios",
  ],
  Core: [
    "Flexión de tronco",
    "Elevación de piernas",
    "Anti-extensión",
    "Anti-rotación",
    "Rotación",
    "Compresión",
    "Estabilidad",
  ],
  Piernas: [
    "Dominante de rodilla",
    "Dominante de cadera",
    "Isquiotibiales",
    "Pantorrillas",
    "Potencia",
  ],
  Skills: ["Handstand", "Human Flag", "Press to Handstand", "Otros"],
  Dinámicos: ["Muscle Up", "Transiciones", "Kips / Swings", "Freestyle"],
  Agarre: ["Colgados", "Fuerza de dedos", "Muñeca / antebrazo"],
};

export const EJERCICIO_CATEGORIAS_ACCESORIOS = [
  "Empuje",
  "Tirón",
  "Hombros",
  "Bíceps",
  "Tríceps",
  "Antebrazos",
  "Core",
  "Piernas",
  "Agarre",
  "Prehabilitación",
  "Cuerpo completo",
  "Movilidad",
];

export const SUBCATEGORIAS_ACCESORIOS: Record<string, string[]> = {
  Empuje: ["Empuje horizontal", "Empuje vertical", "Flexiones", "Fondos", "Planche"],
  Tirón: ["Dominadas", "Remos", "Front lever", "Back lever", "Accesorios de tirón"],
  Hombros: ["Deltoides anterior", "Deltoides", "Deltoides posterior", "Press de hombros", "Manguito rotador"],
  Bíceps: ["Curl bíceps", "Curl bíceps (cabeza larga)", "Braquial / braquiorradial"],
  Tríceps: ["Extensiones", "Extensiones (cabeza larga)", "Fondos cerrados"],
  Antebrazos: [
    "Flexores de muñeca",
    "Extensores de muñeca",
    "Braquiorradial",
    "Braquial y braquiorradial",
    "Flexores de los dedos",
    "Pronadores y supinadores",
    "Flexores y extensores",
  ],
  Core: [
    "Recto abdominal (porción inferior)",
    "Recto abdominal (flexión de tronco)",
    "Anti-extensión",
    "Anti-rotación",
    "Oblicuos (rotación)",
  ],
  Piernas: [
    "Cuádriceps",
    "Cuádriceps + glúteo",
    "Cuádriceps + glúteo (unilateral)",
    "Cuádriceps (recto femoral)",
    "Isquiotibiales",
    "Isquiotibiales (unilateral)",
    "Isquiotibiales (excéntrico)",
    "Glúteo mayor",
    "Glúteo mayor (unilateral)",
    "Cadena posterior",
    "Gastrocnemio",
    "Gastrocnemio y sóleo",
    "Gastrocnemio y sóleo (unilateral)",
  ],
  Agarre: ["Agarre de barra", "Agarre unilateral", "Agarre de pinza", "Agarre de anillas"],
  Prehabilitación: [
    "Escápula y manguito rotador",
    "Manguito rotador",
    "Trapecio inferior",
    "Trapecio inferior y medio",
    "Serrato anterior y escápula",
    "Glúteo medio",
    "Aductores y core",
    "Tibial anterior",
  ],
  "Cuerpo completo": ["Potencia y empuje", "Potencia de cadera", "Potencia unilateral", "Resistencia y potencia", "Acarreo y core"],
  Movilidad: ["Movilidad de hombro", "Movilidad de cadera", "Movilidad de cadera y tobillo", "Movilidad torácica"],
};

export function subcategoriasDe(
  disciplina: string | null | undefined,
  categoria: string | null | undefined
): string[] {
  if (!categoria) return [];
  if (disciplina === "Accesorios Calistenia") return SUBCATEGORIAS_ACCESORIOS[categoria] ?? [];
  if (disciplina !== "Calistenia") return [];
  return SUBCATEGORIAS_CALISTENIA[categoria] ?? [];
}

export const MOVEMENT_TYPES = [
  "Isométrico",
  "Dinámico",
  "Fuerza",
  "Explosivo",
  "Excéntrico",
  "Técnica",
  "Movilidad",
  "Accesorio",
];

export const SKILLS_CALISTENIA = [
  "Planche",
  "Front Lever",
  "Back Lever",
  "Handstand",
  "Human Flag",
  "Muscle Up",
  "L-Sit",
  "V-Sit",
  "I-Sit",
  "Maltese",
  "Victorian",
  "Iron Cross",
  "Inverted Cross",
  "Hefesto",
  "SAT",
  "Mana",
  "Azarian",
  "Pelicano",
  "Prayer",
  "Bruja/Iguana",
  "Dragon Press",
  "Cross Press",
  "Impossible Dip",
  "Dragon Flag",
  "Skin the Cat",
  "Turtle",
  "Pistol",
  "90 Degree",
  "Ángel",
];

export const MUSCLE_GROUPS = [
  "Pecho",
  "Espalda",
  "Hombros",
  "Tríceps",
  "Bíceps",
  "Antebrazo",
  "Core",
  "Cuádriceps",
  "Isquiotibiales",
  "Glúteos",
  "Pantorrillas",
  "Cuerpo completo",
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

export const DISCIPLINAS = ["Calistenia", "Musculación", "Accesorios Calistenia"] as const;
export type Disciplina = (typeof DISCIPLINAS)[number];

export function categoriasDe(disciplina: string | null | undefined): string[] {
  if (disciplina === "Musculación") return EJERCICIO_CATEGORIAS_MUSCULACION;
  if (disciplina === "Accesorios Calistenia") return EJERCICIO_CATEGORIAS_ACCESORIOS;
  return EJERCICIO_CATEGORIAS_CALISTENIA;
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
