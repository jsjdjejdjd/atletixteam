import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Encabezado */}
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white font-black tracking-tight text-zinc-950">
            A
          </span>
          <span className="text-lg font-extrabold tracking-widest">ATLETIX</span>
        </div>
        <nav className="flex items-center gap-3 text-sm font-medium">
          <Link
            href="/login"
            className="rounded-full border border-zinc-800 px-5 py-2.5 text-zinc-300 transition hover:border-zinc-600 hover:text-white"
          >
            Ingresar
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-white px-5 py-2.5 font-semibold text-zinc-950 transition hover:bg-zinc-200"
          >
            Crear cuenta
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="mx-auto flex flex-1 w-full max-w-5xl flex-col items-center px-6 pt-16 pb-24 text-center">
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 px-4 py-1.5 text-xs font-medium tracking-wide text-zinc-400 uppercase">
          Calistenia · Street Workout · Fuerza
        </p>

        <h1 className="max-w-3xl text-5xl font-black tracking-tight text-balance sm:text-7xl">
          DONDE LOS <span className="text-zinc-500">FUERTES</span> SE CREAN
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
          Entrená con un plan profesional, registrá tu desempeño y evolucioná
          con la guía de tu entrenador. Tu progreso, tu técnica y tus números,
          en un solo lugar.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className="w-full rounded-full bg-white px-8 py-4 text-base font-bold text-zinc-950 transition hover:bg-zinc-200 sm:w-auto"
          >
            Comenzar ahora
          </Link>
          <Link
            href="/login"
            className="w-full rounded-full border border-zinc-800 px-8 py-4 text-base font-semibold text-zinc-300 transition hover:border-zinc-600 hover:text-white sm:w-auto"
          >
            Ya tengo cuenta
          </Link>
        </div>

        {/* Pilares */}
        <div className="mt-20 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { t: "FUERZA", d: "Programas por bloques y descargas, con RIR, cargas y técnica controlada." },
            { t: "DISCIPLINA", d: "Registrá cada sesión para que nada quede librado al azar." },
            { t: "PROGRESIÓN", d: "Métricas de evolución en dominadas, planche, front lever y más." },
          ].map((f) => (
            <div
              key={f.t}
              className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 text-left"
            >
              <p className="text-sm font-black tracking-[0.25em] text-zinc-500">
                {f.t}
              </p>
              <p className="mt-3 leading-relaxed text-zinc-400">{f.d}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Pie */}
      <footer className="border-t border-zinc-900 py-8">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-2 px-6 text-center text-sm text-zinc-600">
          <p className="font-bold tracking-widest">ATLETIX</p>
          <p>Donde los fuertes se crean.</p>
        </div>
      </footer>
    </div>
  );
}