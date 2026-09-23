// ============================================================
// ATLETIX · PROGRAMA LOADER (CLI)
// ============================================================
// Toma el catálogo de `lib/programas/catalog.ts` y lo materializa en
// Supabase: programs → weeks → workouts → workout_exercises de forma
// idempotente. Los ejercicios se resuelven por `nombre` EXACTO contra
// public.exercises; los que no existan se listan en los avisos.
//
// Uso:
//   npm run programas:cargar
// Env: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
//      (se leen de .env.local si no están en el entorno)
// ============================================================

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { cargarProgramas } from "../lib/programas/cargar-programas";

const envLocal = resolve(__dirname ?? process.cwd(), ".env.local");
if (existsSync(envLocal)) {
  for (const linea of readFileSync(envLocal, "utf-8").split(/\r?\n/)) {
    const m = linea.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
    }
  }
}

cargarProgramas()
  .then((r) => {
    console.log(`\nCarga completa · ${r.totalProgramas} programas · ${r.totalEjercicios} ejercicios · ${r.combos} combos`);
    for (const p of r.programas) {
      const estado = p.recienCreado ? "CREADO" : "actualizado";
      console.log(`  ${estado.padEnd(10)} ${p.nombre} · ${p.semanas} semanas · ${p.ejercicios} ejercicios`);
    }
    if (r.avisos.length) {
      console.log("\nAvisos:");
      for (const a of r.avisos) console.log(`  · ${a}`);
    }
    process.exit(0);
  })
  .catch((e: Error) => {
    console.error(`\n✖ ${e.message}`);
    process.exit(1);
  });