// ============================================================
// ATLETIX — RESÚMENES PARA WHATSAPP (CLI)
// ============================================================
// Genera un .txt con el resumen de cada alumno que tiene registros
// cargados, listo para copiar y mandar. Al final lista los alumnos
// sin registros y los que tienen registros pero no están asignados
// a ningún entrenador (esos no aparecen en /entrenador/registros).
//
// Usa la misma lógica que el botón "Copiar para WhatsApp" de la web
// (lib/registros/resumen.ts), pero con service role para poder ver
// alumnos de todos los entrenadores y los que no tienen ninguno.
//
// Uso:
//   npm run registros:resumenes
// Env: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
//      (se leen de .env.local si no están en el entorno)
// ============================================================

import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { homedir } from "node:os";
import { createClient } from "@supabase/supabase-js";
import { aWhatsApp, resumenDeAlumno, type LogResumen } from "../lib/registros/resumen";

const envLocal = resolve(__dirname, "..", ".env.local");
if (existsSync(envLocal)) {
  for (const linea of readFileSync(envLocal, "utf-8").split(/\r?\n/)) {
    const m = linea.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}

async function main() {
const VACIO = "00000000-0000-0000-0000-000000000000";
const EMAIL_ENTRENADOR = "gonzassjyt@gmail.com";
const SALIDA = process.env.SALIDA ?? resolve(homedir(), "Downloads", "resumenes-alumnos-atletix.txt");

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
});

function nombreDe(p: { nombre: string | null; apellido: string | null; email: string | null } | undefined, id: string) {
  if (!p) return id;
  return [p.nombre, p.apellido].filter(Boolean).join(" ") || p.email || id;
}

const { data: adm } = await supabase
  .from("profiles")
  .select("id")
  .eq("rol", "admin")
  .eq("email", EMAIL_ENTRENADOR)
  .single<{ id: string }>();

if (!adm) {
  console.error(`No encontré el entrenador ${EMAIL_ENTRENADOR}`);
  process.exit(1);
}

const { data: athletesRes } = await supabase
  .from("athletes")
  .select("user_id")
  .eq("entrenador_id", adm.id);

const todos = [...new Set((athletesRes ?? []).map((a) => a.user_id as string))];

const { data: profilesRes } = await supabase
  .from("profiles")
  .select("id, nombre, apellido, email")
  .in("id", todos.length ? todos : [VACIO]);
const perfiles = new Map((profilesRes ?? []).map((p) => [p.id as string, p]));
const nombre = (id: string) => nombreDe(perfiles.get(id), id);
const email = (id: string) => perfiles.get(id)?.email ?? "sin email";

const { data: logsRaw } = await supabase
  .from("workout_logs")
  .select("id, workout_exercise_id, athlete_id, fecha, series_data, comentarios")
  .in("athlete_id", todos)
  .order("fecha", { ascending: true });

const logs = (logsRaw ?? []) as {
  id: string;
  workout_exercise_id: string;
  athlete_id: string;
  fecha: string;
  series_data: LogResumen["series"] | null;
  comentarios: string | null;
}[];

const weIds = [...new Set(logs.map((l) => l.workout_exercise_id))];
const { data: weRaw } = await supabase
  .from("workout_exercises")
  .select("id, exercise_id, workout_id")
  .in("id", weIds);
const we = (weRaw ?? []) as { id: string; exercise_id: string | null; workout_id: string | null }[];

const exIds = [...new Set(we.map((w) => w.exercise_id).filter((x): x is string => !!x))];
const wIds = [...new Set(we.map((w) => w.workout_id).filter((x): x is string => !!x))];

const [exRes, wRes] = await Promise.all([
  supabase.from("exercises").select("id, nombre").in("id", exIds.length ? exIds : [VACIO]),
  supabase.from("workouts").select("id, nombre").in("id", wIds.length ? wIds : [VACIO]),
]);
const exN = new Map((exRes.data ?? []).map((e) => [e.id, e.nombre as string]));
const wN = new Map((wRes.data ?? []).map((w) => [w.id, w.nombre as string]));
const weMap = new Map(
  we.map((w) => [
    w.id,
    {
      ejercicio: (w.exercise_id && exN.get(w.exercise_id)) || "Ejercicio",
      workout: wN.get(w.workout_id) ?? "Entrenamiento",
    },
  ])
);

const porAlumno = new Map<string, LogResumen[]>();
for (const l of logs) {
  const ref = weMap.get(l.workout_exercise_id);
  const lista = porAlumno.get(l.athlete_id) ?? [];
  lista.push({
    id: l.id,
    fecha: l.fecha,
    ejercicioNombre: ref?.ejercicio ?? "Ejercicio",
    workoutNombre: ref?.workout ?? "Entrenamiento",
    series: Array.isArray(l.series_data) ? l.series_data : [],
    comentarios: l.comentarios,
  });
  porAlumno.set(l.athlete_id, lista);
}

const cmp = (a: string, b: string) => nombre(a).localeCompare(nombre(b), "es");
const conLogs = todos.filter((id) => (porAlumno.get(id) ?? []).length > 0).sort(cmp);
const sinLogs = todos.filter((id) => (porAlumno.get(id) ?? []).length === 0).sort(cmp);

const L: string[] = [];
L.push("RESÚMENES PARA WHATSAPP — Atletix");
L.push("Generado el " + new Date().toLocaleDateString("es-AR"));
L.push(`${conLogs.length} alumnos con registros, ${sinLogs.length} sin registros.`);
L.push("=".repeat(60));

for (const id of conLogs) {
  const resumen = resumenDeAlumno(nombre(id), porAlumno.get(id) ?? []);
  L.push("", "-".repeat(60), `ALUMNO: ${nombre(id)}  (${email(id)})`, "-".repeat(60));
  L.push(aWhatsApp(resumen));
}

if (sinLogs.length) {
  L.push("", "=".repeat(60), `SIN REGISTROS TODAVÍA (${sinLogs.length})`);
  for (const id of sinLogs) L.push(`  - ${nombre(id)} (${email(id)})`);
}

// Alumnos con registros pero sin entrenador: no salen en /entrenador/registros.
const { data: huerfanos } = await supabase
  .from("athletes")
  .select("user_id")
  .is("entrenador_id", null);
const sinEnt = (huerfanos ?? []).map((a) => a.user_id as string);
if (sinEnt.length) {
  const { data: l2 } = await supabase.from("workout_logs").select("athlete_id").in("athlete_id", sinEnt);
  const conteo = new Map<string, number>();
  for (const l of (l2 ?? []) as { athlete_id: string }[]) {
    conteo.set(l.athlete_id, (conteo.get(l.athlete_id) ?? 0) + 1);
  }
  if (conteo.size) {
    const { data: pr2 } = await supabase
      .from("profiles")
      .select("id, nombre, apellido, email")
      .in("id", [...conteo.keys()]);
    const pm = new Map((pr2 ?? []).map((p) => [p.id as string, p]));
    L.push("", "=".repeat(60), `CON REGISTROS PERO SIN ENTRENADOR ASIGNADO (${conteo.size})`);
    for (const [uid, n] of conteo) {
      const p = pm.get(uid);
      L.push(`  - ${nombreDe(p, uid)} (${p?.email ?? "sin email"}) · ${n} registros`);
    }
  }
}

writeFileSync(SALIDA, L.join("\n"), "utf8");
console.log(`${conLogs.length} resúmenes escritos en:\n${SALIDA}`);
}

main().catch((e: Error) => {
  console.error(`Error: ${e.message}`);
  process.exit(1);
});
