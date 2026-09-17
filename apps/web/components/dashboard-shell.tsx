"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type NavLink = {
  href: string;
  label: string;
};

const ADMIN_LINKS: NavLink[] = [
  { href: "/entrenador", label: "Dashboard" },
  { href: "/entrenador/programas", label: "Programas" },
  { href: "/entrenador/ejercicios", label: "Ejercicios" },
  { href: "/entrenador/alumnos", label: "Alumnos" },
  { href: "/entrenador/registros", label: "Registros" },
  { href: "/entrenador/chat", label: "Chat" },
];

const ATHLETE_LINKS: NavLink[] = [
  { href: "/alumno", label: "Entrenar" },
  { href: "/alumno/programa", label: "Mi Programa" },
  { href: "/alumno/programas", label: "Programas" },
  { href: "/alumno/progreso", label: "Progreso" },
  { href: "/alumno/carga", label: "Análisis de carga" },
  { href: "/alumno/chat", label: "Chat" },
];

export function DashboardShell({
  rol,
  nombre,
  children,
}: {
  rol: string;
  nombre: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const links = rol === "admin" ? ADMIN_LINKS : ATHLETE_LINKS;

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white font-black text-zinc-950">
              A
            </span>
            <span className="hidden text-base font-extrabold tracking-widest sm:block">
              ATLETIX
            </span>
          </Link>

          <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition sm:px-4 ${
                    active
                      ? "bg-white text-zinc-950"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden text-sm text-zinc-500 lg:block">
              {nombre}
            </span>
            <button
              onClick={handleLogout}
              className="shrink-0 rounded-full border border-zinc-800 px-3 py-2 text-sm font-medium text-zinc-400 transition hover:border-zinc-600 hover:text-white sm:px-4"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10">
        {children}
      </main>
    </div>
  );
}