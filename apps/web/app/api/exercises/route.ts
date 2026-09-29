import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth";

const LIMITE = 40;

/**
 * Busca ejercicios en la biblioteca. La pagina del editor ya no baja las 566
 * filas (eran ~250KB de payload); consulta aca mientras el entrenador escribe.
 * RLS sigue aplicando: el usuario solo ve lo que su sesion le permite.
 */
export async function GET(request: Request) {
  const ctx = await getAuthContext();
  if (!ctx) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const q = (new URL(request.url).searchParams.get("q") ?? "")
    // La sintaxis de .or() de PostgREST usa comas, parentesis y comillas como
    // separadores. Sin esto, escribir "front lever, plancha" rompe el filtro y
    // la consulta vuelve 500.
    .replace(/[,()"'\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const { supabase } = ctx;

  const { data, error } = await supabase
    .from("exercises")
    .select("id, nombre, categoria, disciplina")
    .or(`nombre.ilike.%${q}%,categoria.ilike.%${q}%`)
    .order("nombre", { ascending: true })
    .limit(LIMITE);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { results: data ?? [] },
    { headers: { "Cache-Control": "private, max-age=60" } }
  );
}
