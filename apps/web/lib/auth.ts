import { redirect } from "next/navigation";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  email: string | null;
  nombre: string | null;
  apellido: string | null;
  rol: string | null;
};

export type AuthContext = {
  supabase: Awaited<ReturnType<typeof createClient>>;
  user: { id: string };
  profile: Profile;
};

/**
 * cache() deduplica la llamada dentro de un mismo render. El layout raiz, el
 * layout de area y la pagina piden el perfil en cadena, asi que sin esto se
 * hacia getUser() + SELECT profiles una vez por capa (6 viajes). Con esto se
 * resuelve una sola vez y las tres capas comparten el resultado.
 *
 * No cachea entre requests: la sesion se sigue validando en cada peticion.
 * Devuelve null en vez de redirigir para que cada capa decida a donde va.
 */
export const getAuthContext = cache(async (): Promise<AuthContext | null> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, nombre, apellido, rol")
    .eq("id", user.id)
    .single<Profile>();

  if (!profile) return null;

  return { supabase, user, profile } as AuthContext;
});

export async function requireProfile() {
  const ctx = await getAuthContext();
  if (!ctx) redirect("/login");
  return ctx;
}
