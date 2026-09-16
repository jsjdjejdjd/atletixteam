import Link from "next/link";

function Logo() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white font-black tracking-tight text-zinc-950">
      A
    </span>
  );
}

const pasos = [
  { n: "01", t: "Creá tu cuenta", d: "Registrate gratis y contanos desde qué nivel arrancás." },
  { n: "02", t: "Elegí tu programa", d: "Calistenia General, Planche o Front Lever, con bloques pensados para vos." },
  { n: "03", t: "Entrená y registrá", d: "Cada sesión queda anotada: series, cargas, RIR y videos de tu técnica." },
  { n: "04", t: "Planificá y rompela", d: "Entrenar sin plan es entrenar a ciegas. Con una progresión clara, cada semana suma." },
];

const niveles = [
  { t: "Principiante (desde cero)", elite: false },
  { t: "Intermedio", elite: false },
  { t: "Avanzado", elite: false },
  { t: "Élite", elite: true },
];

const categorias = [
  {
    nombre: "Calistenia General",
    desc: "Dominadas, fondos y core. La base de todo cuerpo fuerte.",
    puntos: ["Bloques de fuerza con RIR y descargas", "Seguimiento de PR en dominadas y fondos"],
  },
  {
    nombre: "Planche",
    desc: "Del tuck al planche completo. Progresión real, sin atajos.",
    puntos: ["Escalera técnica: tuck, one leg, full", "Sostén y control medibles"],
  },
  {
    nombre: "Front Lever",
    desc: "Control total en suspensión. Paso a paso hasta el full.",
    puntos: ["Del tuck al full, paso a paso", "Fuerza de tirón específica"],
  },
];

const features = [
  { t: "Tu plan siempre a mano", d: "El programa completo en tu celular, sesión por sesión y semana por semana." },
  { t: "Registro de cada sesión", d: "Series, reps, cargas, RIR y descansos: tu entrenador ve exactamente lo que hiciste." },
  { t: "Videos para corregir técnica", d: "Filmá tus series y subí el video. Tu entrenador te da feedback puntual." },
  { t: "Progreso medible", d: "Peso corporal, PR de dominadas y fondos, y niveles de planche y front lever en gráficos." },
  { t: "Chat directo", d: "Consultá dudas de técnica, planificación o movilidad sin vueltas." },
  { t: "Sugerencias personalizadas", d: "Cada alumno recibe ajustes según su evolución real, no recetas copiadas." },
];

function SectionTitle({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <p className="text-sm font-bold tracking-[0.3em] text-zinc-500 uppercase">{kicker}</p>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {sub ? <p className="mt-3 max-w-2xl text-zinc-400">{sub}</p> : null}
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* ===== Encabezado ===== */}
      <header className="sticky top-0 z-10 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo />
            <span className="text-lg font-extrabold tracking-widest">ATLETIX</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-400 md:flex">
            <a href="#metodo" className="transition hover:text-white">Método</a>
            <a href="#categorias" className="transition hover:text-white">Programas</a>
            <a href="#para-quien" className="transition hover:text-white">Para quién</a>
            <a href="#contacto" className="transition hover:text-white">Contacto</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-full border border-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white sm:block"
            >
              Ingresar
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ===== Hero ===== */}
        <section className="mx-auto w-full max-w-6xl px-6 pt-20 pb-16 text-center sm:pt-28">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 px-4 py-1.5 text-xs font-semibold tracking-[0.25em] text-zinc-400 uppercase">
            ATLETIX TRAINING SYSTEM
          </p>
          <h1 className="mx-auto max-w-4xl text-5xl font-black tracking-tight text-balance sm:text-7xl">
            ENTRENÁ CON <span className="text-zinc-500">PROPÓSITO</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-300">
            No se trata solamente de entrenar más.
            <br />
            Se trata de <span className="font-bold text-white">entrenar mejor</span>.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            Planificación personalizada, seguimiento de tu rendimiento y progresiones
            diseñadas para que puedas avanzar de forma estructurada hacia tu
            próximo nivel.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="w-full rounded-full bg-white px-8 py-4 text-base font-bold text-zinc-950 transition hover:bg-zinc-200 sm:w-auto"
            >
              EMPEZAR MI PROGRAMA
            </Link>
            <Link
              href="/login"
              className="w-full rounded-full border border-zinc-800 px-8 py-4 text-base font-semibold text-zinc-300 transition hover:border-zinc-600 hover:text-white sm:w-auto"
            >
              INICIAR SESIÓN
            </Link>
          </div>

          <p className="mx-auto mt-16 text-xs font-bold tracking-[0.3em] text-zinc-500 uppercase">
            PLANIFICÁ. ENTRENÁ. MEDÍ. EVOLUCIONÁ.
          </p>
        </section>

        {/* ===== Método ===== */}
        <section id="metodo" className="border-t border-zinc-900 py-20">
          <div className="mx-auto w-full max-w-6xl px-6">
            <SectionTitle
              kicker="Cómo funciona"
              title="Cuatro pasos para transformar tu cuerpo"
            />
            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {pasos.map((p) => (
                <div key={p.n} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                  <p className="text-3xl font-black text-zinc-700">{p.n}</p>
                  <p className="mt-4 font-bold">{p.t}</p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{p.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Categorías ===== */}
        <section id="categorias" className="border-t border-zinc-900 py-20">
          <div className="mx-auto w-full max-w-6xl px-6">
            <SectionTitle
              kicker="Programas"
              title="Elegí tu camino, cada uno con su progresión"
              sub="Cuatro niveles. Elegí dónde empezás."
            />
            <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-3">
              {categorias.map((c) => (
                <div key={c.nombre} className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                  <p className="text-sm font-black tracking-[0.2em] text-zinc-500 uppercase">
                    Calistenia
                  </p>
                  <h3 className="mt-2 text-xl font-extrabold">{c.nombre}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{c.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {niveles.map((n) => (
                      <span
                        key={n.t}
                        className={
                          n.elite
                            ? "rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300"
                            : "rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-[11px] font-semibold text-zinc-300"
                        }
                      >
                        {n.t}
                      </span>
                    ))}
                  </div>
                  <ul className="mt-5 flex flex-col gap-2">
                    {c.puntos.map((pt) => (
                      <li key={pt} className="flex items-start gap-2 text-sm text-zinc-300">
                        <span className="mt-0.5 text-emerald-400">✓</span>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Para quién ===== */}
        <section id="para-quien" className="border-t border-zinc-900 py-20">
          <div className="mx-auto w-full max-w-6xl px-6">
            <SectionTitle
              kicker="Para quién"
              title="Todo lo que hace profesional tu entrenamiento"
            />
            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div key={f.t} className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6">
                  <p className="font-bold">{f.t}</p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className="border-t border-zinc-900 py-20">
          <div className="mx-auto w-full max-w-3xl px-6">
            <SectionTitle kicker="Preguntas frecuentes" title="Dudas que nos llegan seguido" />
            <div className="mt-10 flex flex-col gap-3">
              {[
                {
                  q: "¿Necesito equipo?",
                  a: "No. La base son los ejercicios con tu propio peso: dominadas, fondos y progresiones. Una barra fija alcanza para empezar.",
                },
                {
                  q: "¿Sirve para arrancar de cero?",
                  a: "Sí. Cada programa comienza por el nivel que te corresponde y las progresiones van subiendo de a poco, sin saltarte pasos.",
                },
                {
                  q: "¿Puedo cambiar de programa cuando quiera?",
                  a: "Por supuesto. Elegí el programa en el catálogo y empezá cuando quieras; podés cambiarlo en cualquier momento.",
                },
              ].map((f, i) => (
                <details key={i} className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
                  <summary className="cursor-pointer list-none font-bold">
                    <span className="flex items-center justify-between gap-4">
                      {f.q}
                      <span className="text-zinc-500 transition group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Cierre ===== */}
        <section className="border-t border-zinc-900 py-20">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-10 text-center sm:p-16">
              <h2 className="text-3xl font-black tracking-tight text-balance sm:text-5xl">
                Los fuertes no nacen, <span className="text-zinc-500">se entrenan</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-zinc-400">
                Elegí tu programa y entrená con un plan de verdad.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="w-full rounded-full bg-white px-8 py-4 text-base font-bold text-zinc-950 transition hover:bg-zinc-200 sm:w-auto"
                >
                  Empezá gratis
                </Link>
                <Link
                  href="/login"
                  className="w-full rounded-full border border-zinc-800 px-8 py-4 text-base font-semibold text-zinc-300 transition hover:border-zinc-600 hover:text-white sm:w-auto"
                >
                  Ingresar
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ===== Pie ===== */}
      <footer id="contacto" className="border-t border-zinc-900 py-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-6 text-center">
          <div className="flex items-center gap-2.5">
            <Logo />
            <span className="font-extrabold tracking-widest">ATLETIX</span>
          </div>
          <p className="max-w-md text-sm text-zinc-500">
            Donde los fuertes se crean. Asesoramiento online de calistenia y
            street workout.
          </p>
          <div className="flex flex-col items-center gap-2 text-sm text-zinc-400">
            <p className="text-zinc-600">
              ¿Querés tu propia web con ATLETIX? Consultá por tu plan.
            </p>
          </div>
          <p className="text-xs text-zinc-700">
            © {new Date().getFullYear()} ATLETIX · Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}