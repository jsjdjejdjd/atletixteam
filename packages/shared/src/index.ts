export const APP_NAME = "ATLETIX"
export const APP_TAGLINE = "DONDE LOS FUERTES SE CREAN"

export const ROLES = {
  ADMIN: "admin",
  ATHLETE: "alumno",
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const EXERCISE_CATEGORIES = [
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
] as const

export const SKILL_LEVELS = [
  "Principiante",
  "Intermedio",
  "Avanzado",
  "Competitivo",
] as const

export const RIR_INDEX = {
  PERFECT_TECHNIQUE: 0,
  CHALLENGING: 1,
  VERY_CHALLENGING: 2,
  VIRTUAL_FAILURE: 3,
} as const