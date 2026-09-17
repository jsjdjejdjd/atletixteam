import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const SB_COOKIE_PREFIX = `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL!.split("//")[1].split(".")[0]}`;

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Self-heal: limpiar cookies de Supabase viejas/rotas cuando no hay sesión válida
  if (!user) {
    request.cookies
      .getAll()
      .filter((c) => c.name.startsWith(SB_COOKIE_PREFIX))
      .forEach((c) => response.cookies.set({ name: c.name, value: "", maxAge: 0 }));
  }

  const pathname = request.nextUrl.pathname;
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isProtected =
    pathname.startsWith("/alumno") || pathname.startsWith("/entrenador");

  // Sin sesión → no puede entrar a áreas privadas
  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirected", "true");
    return NextResponse.redirect(url);
  }

  // Con sesión → redirigir al dashboard de su rol (no a landing)
  if (user && isAuthPage) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("rol")
      .eq("id", user.id)
      .single();
    const url = request.nextUrl.clone();
    url.pathname = profile?.rol === "admin" ? "/entrenador" : "/alumno";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/alumno/:path*",
    "/entrenador/:path*",
    "/login",
    "/register",
  ],
};