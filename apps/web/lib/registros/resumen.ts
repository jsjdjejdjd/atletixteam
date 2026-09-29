export type Serie = {
  serie: number;
  reps?: string | null;
  peso?: string | null;
  rir?: number | null;
  descanso?: number | null;
};

export type LogResumen = {
  id: string;
  fecha: string;
  ejercicioNombre: string;
  workoutNombre: string;
  series: Serie[];
  comentarios: string | null;
};

export type Marca = {
  ejercicio: string;
  primera: string;
  mejor: string;
  fechaMejor: string;
  veces: number;
  progreso: number | null;
};

export type ResumenAlumno = {
  nombre: string;
  desde: string | null;
  hasta: string | null;
  dias: string[];
  totalRegistros: number;
  ejerciciosDistintos: number;
  marcas: Marca[];
  comentarios: { fecha: string; ejercicio: string; texto: string }[];
};

function num(v: string | null | undefined): number | null {
  if (v == null) return null;
  const limpio = v.trim().replace(",", ".");
  if (!limpio) return null;
  const n = Number.parseFloat(limpio);
  return Number.isFinite(n) ? n : null;
}

/** Cuántas reps numericables tiene una serie. Lo que no es número ("Media") se
 *  descarta del cálculo pero se conserva para mostrar la marca cruda. */
function repsNumericas(series: Serie[]): number[] {
  return series
    .map((s) => num(s.reps))
    .filter((n): n is number => n !== null);
}

function pesoDe(series: Serie[]): number | null {
  const pesos = series
    .map((s) => num(s.peso))
    .filter((n): n is number => n !== null && n > 0);
  return pesos.length ? Math.max(...pesos) : null;
}

export function detalleSerie(series: Serie[]): string {
  if (series.length === 0) return "—";
  const reps = repsNumericas(series);
  const peso = pesoDe(series);
  const rir = series
    .map((s) => s.rir)
    .filter((r): r is number => r != null);

  const partes: string[] = [];
  if (reps.length) partes.push(`${Math.max(...reps)} reps`);
  if (peso != null) partes.push(`${peso} kg`);
  if (rir.length) partes.push(`RIR ${Math.min(...rir)}`);

  if (!partes.length) {
    // Sin números: mostramos el texto tal cual lo escribieron, sin inventar.
    const crudo = series.find((s) => s.reps && s.reps.trim());
    return crudo?.reps?.trim() ?? "—";
  }
  return partes.join(" · ");
}

/** Puntaje comparable entre sesiones del mismo ejercicio. El peso pesa más
 *  que las reps porque en calistenialoaded con banda o lastrado marca más. */
function puntaje(series: Serie[]): number {
  const reps = repsNumericas(series);
  const peso = pesoDe(series);
  return (peso ?? 0) * 1000 + (reps.length ? Math.max(...reps) : 0);
}

export function resumenDeAlumno(
  nombre: string,
  logs: LogResumen[]
): ResumenAlumno {
  const ordenados = [...logs].sort((a, b) =>
    a.fecha === b.fecha ? a.id.localeCompare(b.id) : a.fecha.localeCompare(b.fecha)
  );

  const porEjercicio = new Map<string, LogResumen[]>();
  for (const l of ordenados) {
    const lista = porEjercicio.get(l.ejercicioNombre) ?? [];
    lista.push(l);
    porEjercicio.set(l.ejercicioNombre, lista);
  }

  const marcas: Marca[] = [...porEjercicio.entries()].map(
    ([ejercicio, sesiones]) => {
      const primera = detalleSerie(sesiones[0].series);
      let mejorLog = sesiones[0];
      for (const l of sesiones) {
        if (puntaje(l.series) > puntaje(mejorLog.series)) mejorLog = l;
      }
      const mejor = detalleSerie(mejorLog.series);

      const pIni = repsNumericas(sesiones[0].series);
      const pFin = repsNumericas(sesiones[sesiones.length - 1].series);
      let progreso: number | null = null;
      if (pIni.length && pFin.length) {
        progreso = Math.max(...pFin) - Math.max(...pIni);
      }

      return {
        ejercicio,
        primera,
        mejor,
        fechaMejor: mejorLog.fecha,
        veces: sesiones.length,
        progreso,
      };
    }
  );

  marcas.sort((a, b) => b.veces - a.veces || a.ejercicio.localeCompare(b.ejercicio));

  const dias = [...new Set(ordenados.map((l) => l.fecha))].sort();

  return {
    nombre,
    desde: dias[0] ?? null,
    hasta: dias[dias.length - 1] ?? null,
    dias,
    totalRegistros: ordenados.length,
    ejerciciosDistintos: porEjercicio.size,
    marcas,
    comentarios: ordenados
      .filter((l) => l.comentarios && l.comentarios.trim())
      .map((l) => ({
        fecha: l.fecha,
        ejercicio: l.ejercicioNombre,
        texto: (l.comentarios ?? "").trim(),
      })),
  };
}

function fechaCorta(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}

/** Texto corto para mandar por WhatsApp. Sin markdown ni tablas. */
export function aWhatsApp(r: ResumenAlumno): string {
  if (r.totalRegistros === 0) {
    return `Hola ${r.nombre}! Todavía no tenés entrenamientos registrados. Cuando completes tu primera sesión me aparece acá. ¡Cualquier duda consultame!`;
  }

  const lineas: string[] = [];
  lineas.push(`Hola ${r.nombre}! Te paso el resumen de tus entrenamientos:`);
  lineas.push("");
  lineas.push(
    `Periodo: ${fechaCorta(r.desde!)} - ${fechaCorta(r.hasta!)}`
  );
  lineas.push(
    `Entrenaste ${r.dias.length} ${r.dias.length === 1 ? "día" : "días"} y cargaste ${r.totalRegistros} ${r.totalRegistros === 1 ? "registro" : "registros"} de ejercicios.`
  );

  const top = r.marcas.filter((m) => m.veces > 1).slice(0, 6);
  if (top.length) {
    lineas.push("");
    lineas.push("Tus mejores marcas:");
    for (const m of top) {
      const flecha =
        m.progreso != null && m.progreso > 0
          ? ` (subiste ${m.progreso} desde la primera)`
          : m.progreso != null && m.progreso < 0
            ? ` (bajaste ${Math.abs(m.progreso)} respecto a la primera)`
            : "";
      lineas.push(`• ${m.ejercicio}: ${m.mejor}${flecha}`);
    }
  }

  if (r.comentarios.length) {
    lineas.push("");
    lineas.push("Tus últimas notas:");
    for (const c of r.comentarios.slice(-3)) {
      lineas.push(`• ${fechaCorta(c.fecha)} ${c.ejercicio}: ${c.texto}`);
    }
  }

  lineas.push("");
  lineas.push("¡Buen trabajo, seguí así! 💪");
  return lineas.join("\n");
}
