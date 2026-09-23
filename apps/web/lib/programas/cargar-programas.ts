import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { PROGRAMAS_CATALOGO, type ProgramaDef, type SesionPrograma } from "./catalog";

// ============================================================
// ATLETIX · LOADER DE PROGRAMAS · idempotente por (categoria, nivel)
// ============================================================
// Contrato:
//  · Nunca inventa ejercicios: los resuelve por `nombre` EXACTO contra
//    public.exercises. Un programa que referencie ejercicios inexistentes
//    se OMITE y se lista en los avisos (no frena a los demás).
//  · Programas: busca por (categoria, nivel). Si ya existe CON EL MISMO
//    nombre, actualiza sus metadatos. Si existe con OTRO nombre
//    (programa hecho a mano o de otro catálogo), NO lo pisa: avisa y salta.
//  · Semanas/sesiones: upsert por (program_id, numero) y (week_id, dia);
//    marcan es_combo cuando la sesión es un circuito Power Free.
//  · workout_exercises de una sesión TRADICIONAL solo se rellenan si la
//    sesión está vacía (no pisa lo que el entrenador ya armó a mano).
//    Las sesiones COMBO no se materializan acá (se arman en el editor).
// Env: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
// Uso: npm run programas:cargar
// ============================================================

/**
 * Resuelve el id de un ejercicio por nombre. Los nombres pueden existir
 * en más de una disciplina (ej: "Curl con barra" en Musculación y en
 * Accesorios); se toma una fila cualquiera (la más "calistenia" primero).
 */
async function resolverNombre(sb: SupabaseClient, nombre: string): Promise<string> {
  const prioridades = ["Calistenia", "Accesorios Calistenia", "Musculación", "General"];
  for (const disciplina of prioridades) {
    const { data, error } = await sb
      .from("exercises")
      .select("id")
      .eq("nombre", nombre)
      .eq("disciplina", disciplina)
      .maybeSingle();
    if (error) throw new Error(`Consulta exercises [${nombre}] falló: ${error.message}`);
    if (data) return data.id;
  }
  const { data, error } = await sb
    .from("exercises")
    .select("id")
    .eq("nombre", nombre)
    .limit(1);
  if (error) throw new Error(`Consulta exercises [${nombre}] falló: ${error.message}`);
  if (data?.[0]) return data[0].id;
  throw new Error(`Ejercicio NO existe en la biblioteca: ${nombre}`);
}

async function resolverBiblioteca(sb: SupabaseClient, nombres: Set<string>): Promise<Map<string, string>> {
  const mapa = new Map<string, string>();
  for (const nombre of nombres) {
    const id = await resolverNombre(sb, nombre).catch(() => null);
    if (id) mapa.set(nombre, id);
  }
  return mapa;
}

/** Nombres de ejercicios referenciados por un programa (solo sesiones tradicionales). */
function nombresDePrograma(p: ProgramaDef): Set<string> {
  const set = new Set<string>();
  for (const s of p.semanas)
    for (const ses of s.sesiones)
      for (const ej of ses.ejercicios ?? []) set.add(ej.nombre);
  return set;
}

/**
 * Nombres "legado" que el loader puede ADOPTAR de forma explícita: cuando
 * (categoria, nivel) ya está ocupado por un programa con otro nombre de esta
 * lista, se reutiliza la copia ligada a un alumno (y renombra), las copias
 * huérfanas se borran. Es la decisión tomada para los programas que el
 * entrenador creó a mano como "Planche y Front level" antes del catálogo.
 * key = `${categoria}/${nivel}`.
 */
const ADOPTAR_LEGACY: Record<string, string[]> = {
  "planche/Intermedio": ["Planche y Front level", "Planche / Front Lever"],
  "planche/Avanzado": ["Planche y Front level", "Planche / Front Lever"],
  "planche/Elite": ["Planche y Front level", "Planche / Front Lever"],
  "front_lever/Intermedio": ["Planche y Front level", "Planche / Front Lever"],
  "front_lever/Avanzado": ["Planche y Front level", "Planche / Front Lever"],
  "front_lever/Elite": ["Planche y Front level", "Planche / Front Lever"],
};

/** ¿Este programa tiene algún alumno ligado (athlete_programs)? */
async function tieneAlumnos(sb: SupabaseClient, programId: string): Promise<boolean> {
  const { data, error } = await sb
    .from("athlete_programs")
    .select("id")
    .eq("program_id", programId)
    .limit(1);
  if (error) throw new Error(`Consulta athlete_programs [${programId}]: ${error.message}`);
  return (data?.length ?? 0) > 0;
}

/** ¿Todas las sesiones del programa están vacías (sin ejercicio alguno)? */
async function estructuraVacia(sb: SupabaseClient, programId: string): Promise<boolean> {
  const { data: weeks, error: errW } = await sb
    .from("weeks")
    .select("id")
    .eq("program_id", programId);
  if (errW) throw new Error(`Consulta weeks [${programId}]: ${errW.message}`);
  if (!weeks?.length) return true;
  const { data: workouts, error: errWo } = await sb
    .from("workouts")
    .select("id")
    .in("week_id", weeks.map((w) => w.id));
  if (errWo) throw new Error(`Consulta workouts [${programId}]: ${errWo.message}`);
  if (!workouts?.length) return true;
  const { count, error: errWe } = await sb
    .from("workout_exercises")
    .select("id", { count: "exact", head: true })
    .in("workout_id", workouts.map((w) => w.id));
  if (errWe) throw new Error(`Contar workout_exercises [${programId}]: ${errWe.message}`);
  return (count ?? 0) === 0;
}

/** Borra un programa completo (weeks/workouts cuelgan por FK on delete cascade). */
async function borrarPrograma(sb: SupabaseClient, programId: string, motivo: string, avisos: string[]) {
  const { error: errW } = await sb.from("weeks").delete().eq("program_id", programId);
  if (errW) throw new Error(`Fallo borrado weeks [${programId}]: ${errW.message}`);
  const { error: errP } = await sb.from("programs").delete().eq("id", programId);
  if (errP) throw new Error(`Fallo borrado programs [${programId}]: ${errP.message}`);
  avisos.push(`Duplicado ELIMINADO ("${motivo}") · ${programId}`);
}

/**
 * Adopta un programa existente con nombre legado (copia ligada a alumno si la
 * hay): renombra a `p.nombre`, actualiza metadatos y limpia su estructura si
 * está vacía (el loader la reconstruye desde el catálogo). Las copias
 * duplicadas huérfanas se borran. Devuelve undefined si no hubo adopción.
 */
async function adoptarPrograma(
  sb: SupabaseClient,
  p: ProgramaDef,
  filas: { id: string; nombre: string }[],
  avisos: string[]
): Promise<string | undefined> {
  const legados = ADOPTAR_LEGACY[`${p.categoria}/${p.nivel}`];
  if (!legados?.length) return undefined;
  const candidatas = filas.filter((f) => legados.includes(f.nombre));
  if (!candidatas.length) return undefined;

  let activa: { id: string; nombre: string } | undefined;
  for (const c of candidatas) {
    if (await tieneAlumnos(sb, c.id)) {
      activa = c;
      break;
    }
  }
  const elegida = activa ?? candidatas[0];

  avisos.push(
    `ADOPTADA copia legada "${elegida.nombre}" (${elegida.id}) → se rellena y renombra a "${p.nombre}".`
  );

  if (await estructuraVacia(sb, elegida.id)) {
    avisos.push(`Reconstruyo la estructura de "${p.nombre}" (todas sus sesiones estaban vacías).`);
    const { error: errW } = await sb.from("weeks").delete().eq("program_id", elegida.id);
    if (errW) throw new Error(`Fallo limpieza weeks [${elegida.id}]: ${errW.message}`);
  }

  const { error: updErr } = await sb
    .from("programs")
    .update({
      nombre: p.nombre,
      objetivo: p.objetivo,
      descripcion: p.descripcion,
      duracion_semanas: p.duracion_semanas,
      activo: p.activo,
    })
    .eq("id", elegida.id);
  if (updErr) throw new Error(`Fallo rename programs [${elegida.id}]: ${updErr.message}`);

  for (const c of candidatas) {
    if (c.id === elegida.id) continue;
    if (await tieneAlumnos(sb, c.id)) {
      avisos.push(`Duplicado "${c.nombre}" TIENE alumnos; no lo toco (${c.id}).`);
      continue;
    }
    if (!(await estructuraVacia(sb, c.id))) {
      avisos.push(`Duplicado "${c.nombre}" tiene contenido; no lo borro (${c.id}).`);
      continue;
    }
    await borrarPrograma(sb, c.id, c.nombre, avisos);
  }

  return elegida.id;
}

/** Busca el programa por (categoria, nivel); si no existe lo crea. Devuelve su id. */
async function obtenerPrograma(
  sb: SupabaseClient,
  p: ProgramaDef,
  avisos: string[]
): Promise<{ id: string; recienCreado: boolean }> {
  const { data: filas, error } = await sb
    .from("programs")
    .select("id, nombre")
    .eq("categoria", p.categoria)
    .eq("nivel", p.nivel)
    .order("created_at");
  if (error) throw new Error(`Consulta programs [${p.nombre}]: ${error.message}`);

  const coinciden = (filas ?? []).filter((f) => f.nombre === p.nombre);
  if (coinciden.length) {
    await sb
      .from("programs")
      .update({
        objetivo: p.objetivo,
        descripcion: p.descripcion,
        duracion_semanas: p.duracion_semanas,
        activo: p.activo,
      })
      .eq("id", coinciden[0].id);
    for (const extra of coinciden.slice(1)) {
      if (!(await tieneAlumnos(sb, extra.id)) && (await estructuraVacia(sb, extra.id))) {
        await borrarPrograma(sb, extra.id, extra.nombre, avisos);
      }
    }
    return { id: coinciden[0].id, recienCreado: false };
  }

  const adoptada = await adoptarPrograma(sb, p, filas ?? [], avisos);
  if (adoptada) return { id: adoptada, recienCreado: false };

  if ((filas?.length ?? 0) > 0) {
    throw new Error(
      `Colisión (${p.categoria}/${p.nivel}): ya existe "${filas![0].nombre}" y el catálogo define "${p.nombre}". No lo pisé: revisalo en el panel o cambiá el nombre en catalog.ts.`
    );
  }

  const { data: creado, error: insErr } = await sb
    .from("programs")
    .insert({
      nombre: p.nombre,
      categoria: p.categoria,
      nivel: p.nivel,
      objetivo: p.objetivo,
      descripcion: p.descripcion,
      duracion_semanas: p.duracion_semanas,
      activo: p.activo,
    })
    .select("id")
    .single();
  if (insErr || !creado) throw new Error(`Fallo insert programs [${p.nombre}]: ${insErr?.message}`);
  return { id: creado.id, recienCreado: true };
}

/** Upsert de semana por (program_id, numero). Devuelve el id. */
async function obtenerSemana(
  sb: SupabaseClient,
  programId: string,
  numero: number,
  objetivo: string | undefined,
  bloque: number | undefined,
  esDescarga: boolean
): Promise<string> {
  const { data, error } = await sb
    .from("weeks")
    .select("id")
    .eq("program_id", programId)
    .eq("numero", numero)
    .maybeSingle();
  if (error) throw new Error(`Consulta weeks [${programId}/${numero}]: ${error.message}`);
  if (data) return data.id;

  const { data: creada, error: insErr } = await sb
    .from("weeks")
    .insert({
      program_id: programId,
      numero,
      objetivo,
      bloque,
      es_descarga: esDescarga,
    })
    .select("id")
    .single();
  if (insErr || !creada) throw new Error(`Fallo insert weeks [${programId}/${numero}]: ${insErr?.message}`);
  return creada.id;
}

/** Upsert de sesión por (week_id, dia). Devuelve el id + si es combo. */
async function obtenerSesion(
  sb: SupabaseClient,
  weekId: string,
  dia: number,
  sesion: SesionPrograma
): Promise<{ id: string; esCombo: boolean; orden: number }> {
  const esCombo = sesion.tipo === "combo";
  const { data, error } = await sb
    .from("workouts")
    .select("id, es_combo")
    .eq("week_id", weekId)
    .eq("dia", dia)
    .maybeSingle();
  if (error) throw new Error(`Consulta workouts [${weekId}/${dia}]: ${error.message}`);
  if (data) {
    if (Boolean(data.es_combo) !== esCombo) {
      await sb.from("workouts").update({ es_combo: esCombo }).eq("id", data.id);
    }
    return { id: data.id, esCombo, orden: dia };
  }

  const { data: creada, error: insErr } = await sb
    .from("workouts")
    .insert({
      week_id: weekId,
      nombre: sesion.nombre,
      dia,
      orden: dia,
      objetivo: sesion.objetivo,
      es_combo: esCombo,
    })
    .select("id")
    .single();
  if (insErr || !creada) throw new Error(`Fallo insert workouts [${weekId}/${dia}]: ${insErr?.message}`);
  return { id: creada.id, esCombo, orden: dia };
}

/** Rellena los ejercicios de una sesión tradicional SOLO si está vacía. */
async function rellenarSesion(
  sb: SupabaseClient,
  workoutId: string,
  sesion: SesionPrograma,
  ejercicioIds: Map<string, string>,
  avisos: string[]
): Promise<number> {
  const { count, error } = await sb
    .from("workout_exercises")
    .select("id", { count: "exact", head: true })
    .eq("workout_id", workoutId)
    .is("athlete_id", null);
  if (error) throw new Error(`Contar workout_exercises [${workoutId}]: ${error.message}`);
  if ((count ?? 0) > 0) {
    avisos.push(`Sesión "${sesion.nombre}" ya tiene ${count} ejercicios; se respetaron (no pisé).`);
    return 0;
  }
  if (!sesion.ejercicios?.length) return 0;

  const filas = sesion.ejercicios.map((ex, i) => ({
    workout_id: workoutId,
    exercise_id: ejercicioIds.get(ex.nombre)!,
    orden: i,
    series: ex.series,
    repeticiones: ex.repeticiones,
    rir: ex.rir ?? null,
    descanso_segundos: ex.descanso_segundos ?? null,
    peso: ex.peso ?? null,
    tempo: ex.tempo ?? null,
    asistencia: ex.asistencia ?? null,
    notas: ex.notas ?? null,
  }));

  const { error: insErr } = await sb.from("workout_exercises").insert(filas);
  if (insErr) throw new Error(`Fallo insert workout_exercises [${workoutId}]: ${insErr.message}`);
  return filas.length;
}

export interface ResultadoCarga {
  programas: { nombre: string; semanas: number; ejercicios: number; recienCreado: boolean }[];
  combos: number;
  avisos: string[];
  totalProgramas: number;
  totalEjercicios: number;
}

export async function cargarProgramas(opts?: {
  url?: string;
  key?: string;
  catalog?: ProgramaDef[];
}): Promise<ResultadoCarga> {
  const url = opts?.url ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = opts?.key ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!url || !key) throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.");
  const sb = createClient(url, key, { auth: { persistSession: false } });

  const catálogo = opts?.catalog ?? PROGRAMAS_CATALOGO;
  const nombresTotales = new Set<string>();
  for (const p of catálogo) for (const n of nombresDePrograma(p)) nombresTotales.add(n);
  const ejercicioIds = await resolverBiblioteca(sb, nombresTotales);

  const resultado: ResultadoCarga = { programas: [], combos: 0, avisos: [], totalProgramas: 0, totalEjercicios: 0 };

  for (const p of catálogo) {
    try {
      const faltantes = [...nombresDePrograma(p)].filter((n) => !ejercicioIds.has(n));
      if (faltantes.length > 0) {
        resultado.avisos.push(
          `Programa "${p.nombre}" OMITIDO: faltan ejercicios en la biblioteca → ${faltantes.join(" · ")}`
        );
        continue;
      }

      const { id: programId, recienCreado } = await obtenerPrograma(sb, p, resultado.avisos);
      let ejercicios = 0;

      for (const semana of p.semanas) {
        const weekId = await obtenerSemana(
          sb,
          programId,
          semana.numero,
          semana.objetivo,
          semana.bloque,
          semana.es_descarga ?? false
        );
        for (let i = 0; i < semana.sesiones.length; i++) {
          const sesion = semana.sesiones[i];
          const dia = sesion.dia ?? i + 1;
          const { id: workoutId, esCombo } = await obtenerSesion(sb, weekId, dia, sesion);
          if (esCombo) {
            resultado.combos++;
            continue;
          }
          ejercicios += await rellenarSesion(sb, workoutId, sesion, ejercicioIds, resultado.avisos);
        }
      }

      resultado.programas.push({ nombre: p.nombre, semanas: p.semanas.length, ejercicios, recienCreado });
      resultado.totalProgramas++;
      resultado.totalEjercicios += ejercicios;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.startsWith("Colisión (")) {
        resultado.avisos.push(msg);
        continue;
      }
      throw e;
    }
  }

  return resultado;
}