"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Button,
  Field,
  LinkButton,
  Select,
  TextArea,
  TextInput,
} from "@/components/ui";
import {
  CADENAS_CINETICAS,
  DISCIPLINAS,
  LEVELS,
  MOVIMIENTOS,
  MOVEMENT_TYPES,
  MUSCLE_GROUPS,
  OBJETIVOS,
  SKILLS_CALISTENIA,
  TIPOS_EJERCICIO,
  TIPOS_RESISTENCIA,
  categoriasDe,
} from "@/lib/levels";

function toArr(value: string): string[] | null {
  const items = value
    .split(/[;,]/)
    .map((v) => v.trim())
    .filter(Boolean);
  return items.length > 0 ? items : null;
}

export default function NuevoEjercicioPage() {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    nombre: "",
    nombre_en: "",
    aliases: "",
    disciplina: "Musculación",
    categoria: "Pecho",
    subcategoria: "",
    dificultad: "Intermedio",
    equipamiento: "",
    tipo_resistencia: "Barra",
    tipo_ejercicio: "Compuesto",
    patron: "Empuje horizontal",
    musculos_primarios: "",
    musculos_secundarios: "",
    musculos_estabilizadores: "",
    unilateral: false,
    cadena_cinetica: "Abierta",
    objetivo: "Hipertrofia",
    movement_type: "Dinámico",
    skill: "",
    muscle_group: "",
    series_sugeridas: "4",
    reps_sugeridas: "8-12",
    descanso_seg: "120",
    rir_sugerido: "2",
    descripcion: "",
    instrucciones: "",
    errores_comunes: "",
    precauciones: "",
    criterio_progresion: "",
    regresion: "",
    variantes: "",
    sustitutos: "",
    video_url: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function cambiarDisciplina(disciplina: string) {
    const cats = categoriasDe(disciplina);
    setForm((f) => ({ ...f, disciplina, categoria: cats[0] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.from("exercises").insert({
      nombre: form.nombre.trim(),
      nombre_en: form.nombre_en.trim() || null,
      aliases: form.aliases.trim() || null,
      disciplina: form.disciplina,
      categoria: form.categoria,
      subcategoria: form.subcategoria.trim() || null,
      tipo: form.disciplina,
      dificultad: form.dificultad,
      equipamiento: form.equipamiento.trim() || null,
      tipo_resistencia: form.tipo_resistencia,
      tipo_ejercicio: form.tipo_ejercicio,
      patron: form.patron,
      musculos_primarios: toArr(form.musculos_primarios),
      musculos_secundarios: toArr(form.musculos_secundarios),
      musculos_estabilizadores: toArr(form.musculos_estabilizadores),
      unilateral: form.unilateral,
      cadena_cinetica: form.cadena_cinetica,
      objetivo: form.objetivo,
      movement_type: form.movement_type,
      skill: form.skill || null,
      muscle_group: form.muscle_group || null,
      series_sugeridas: form.series_sugeridas ? Number(form.series_sugeridas) : null,
      reps_sugeridas: form.reps_sugeridas.trim() || null,
      descanso_seg: form.descanso_seg ? Number(form.descanso_seg) : null,
      rir_sugerido: form.rir_sugerido ? Number(form.rir_sugerido) : null,
      descripcion: form.descripcion.trim() || null,
      instrucciones: form.instrucciones.trim() || null,
      errores_comunes: form.errores_comunes.trim() || null,
      precauciones: form.precauciones.trim() || null,
      criterio_progresion: form.criterio_progresion.trim() || null,
      regresion: form.regresion.trim() || null,
      variantes: toArr(form.variantes),
      sustitutos: toArr(form.sustitutos),
      video_url: form.video_url.trim() || null,
      activo: true,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/entrenador/ejercicios");
    router.refresh();
  }

  const categorias = categoriasDe(form.disciplina);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-500">Biblioteca</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight">
            Nuevo ejercicio
          </h1>
        </div>
        <LinkButton href="/entrenador/ejercicios">Cancelar</LinkButton>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Disciplina">
            <Select
              value={form.disciplina}
              onChange={(e) => cambiarDisciplina(e.target.value)}
            >
              {DISCIPLINAS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Categoría">
            <Select
              value={form.categoria}
              onChange={(e) => set("categoria", e.target.value)}
            >
              {categorias.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Nombre (español) *">
          <TextInput
            required
            value={form.nombre}
            onChange={(e) => set("nombre", e.target.value)}
            placeholder="Ej: Press banca con barra"
          />
        </Field>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Nombre en inglés">
            <TextInput
              value={form.nombre_en}
              onChange={(e) => set("nombre_en", e.target.value)}
              placeholder="Ej: Barbell bench press"
            />
          </Field>
          <Field label="Alias / nombres alternativos" hint="Separados por coma.">
            <TextInput
              value={form.aliases}
              onChange={(e) => set("aliases", e.target.value)}
              placeholder="press de banca plano, bench press"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Field label="Subcategoría / músculo específico">
            <TextInput
              value={form.subcategoria}
              onChange={(e) => set("subcategoria", e.target.value)}
              placeholder="Pectoral mayor (porción media)"
            />
          </Field>
          <Field label="Dificultad">
            <Select
              value={form.dificultad}
              onChange={(e) => set("dificultad", e.target.value)}
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Equipamiento">
            <TextInput
              value={form.equipamiento}
              onChange={(e) => set("equipamiento", e.target.value)}
              placeholder="Banco plano, barra y discos"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Field label="Tipo de ejercicio">
            <Select
              value={form.tipo_ejercicio}
              onChange={(e) => set("tipo_ejercicio", e.target.value)}
            >
              {TIPOS_EJERCICIO.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Tipo de resistencia">
            <Select
              value={form.tipo_resistencia}
              onChange={(e) => set("tipo_resistencia", e.target.value)}
            >
              {TIPOS_RESISTENCIA.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Patrón de movimiento">
            <Select
              value={form.patron}
              onChange={(e) => set("patron", e.target.value)}
            >
              {MOVIMIENTOS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Field label="Cadena cinética">
            <Select
              value={form.cadena_cinetica}
              onChange={(e) => set("cadena_cinetica", e.target.value)}
            >
              {CADENAS_CINETICAS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Objetivo principal">
            <Select
              value={form.objetivo}
              onChange={(e) => set("objetivo", e.target.value)}
            >
              {OBJETIVOS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Uni / bilateral">
            <Select
              value={form.unilateral ? "si" : "no"}
              onChange={(e) => set("unilateral", e.target.value === "si")}
            >
              <option value="no">Bilateral</option>
              <option value="si">Unilateral</option>
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Field label="Tipo de movimiento" hint="Isométrico, dinámico, explosivo…">
            <Select
              value={form.movement_type}
              onChange={(e) => set("movement_type", e.target.value)}
            >
              {MOVEMENT_TYPES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Skill" hint="Planche, Front Lever, Handstand…">
            <Select value={form.skill} onChange={(e) => set("skill", e.target.value)}>
              <option value="">Sin skill</option>
              {SKILLS_CALISTENIA.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Grupo muscular principal">
            <Select
              value={form.muscle_group}
              onChange={(e) => set("muscle_group", e.target.value)}
            >
              <option value="">Sin definir</option>
              {MUSCLE_GROUPS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Field label="Músculos principales" hint="Separados por coma.">
            <TextInput
              value={form.musculos_primarios}
              onChange={(e) => set("musculos_primarios", e.target.value)}
              placeholder="Pectoral mayor, Deltoides anterior"
            />
          </Field>
          <Field label="Músculos secundarios" hint="Separados por coma.">
            <TextInput
              value={form.musculos_secundarios}
              onChange={(e) => set("musculos_secundarios", e.target.value)}
              placeholder="Tríceps braquial"
            />
          </Field>
          <Field label="Estabilizadores" hint="Separados por coma.">
            <TextInput
              value={form.musculos_estabilizadores}
              onChange={(e) => set("musculos_estabilizadores", e.target.value)}
              placeholder="Romboides, Manguito rotador"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          <Field label="Series">
            <TextInput
              type="number"
              value={form.series_sugeridas}
              onChange={(e) => set("series_sugeridas", e.target.value)}
            />
          </Field>
          <Field label="Repeticiones">
            <TextInput
              value={form.reps_sugeridas}
              onChange={(e) => set("reps_sugeridas", e.target.value)}
              placeholder="8-12"
            />
          </Field>
          <Field label="Descanso (seg)">
            <TextInput
              type="number"
              value={form.descanso_seg}
              onChange={(e) => set("descanso_seg", e.target.value)}
            />
          </Field>
          <Field label="RIR sugerido">
            <TextInput
              type="number"
              value={form.rir_sugerido}
              onChange={(e) => set("rir_sugerido", e.target.value)}
            />
          </Field>
        </div>

        <Field label="URL del video demostrativo (opcional)">
          <TextInput
            type="url"
            value={form.video_url}
            onChange={(e) => set("video_url", e.target.value)}
            placeholder="https://..."
          />
        </Field>

        <Field label="Descripción">
          <TextArea
            value={form.descripcion}
            onChange={(e) => set("descripcion", e.target.value)}
            placeholder="Explicación breve del ejercicio"
          />
        </Field>

        <Field label="Ejecución paso a paso">
          <TextArea
            value={form.instrucciones}
            onChange={(e) => set("instrucciones", e.target.value)}
            placeholder="Posición inicial y ejecución"
          />
        </Field>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Errores frecuentes">
            <TextArea
              value={form.errores_comunes}
              onChange={(e) => set("errores_comunes", e.target.value)}
            />
          </Field>
          <Field label="Indicaciones de seguridad / precauciones">
            <TextArea
              value={form.precauciones}
              onChange={(e) => set("precauciones", e.target.value)}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Cómo progresar">
            <TextArea
              value={form.criterio_progresion}
              onChange={(e) => set("criterio_progresion", e.target.value)}
            />
          </Field>
          <Field label="Cómo regresionar">
            <TextArea
              value={form.regresion}
              onChange={(e) => set("regresion", e.target.value)}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Variantes" hint="Separadas por coma.">
            <TextArea
              value={form.variantes}
              onChange={(e) => set("variantes", e.target.value)}
            />
          </Field>
          <Field label="Ejercicios sustitutos" hint="Separados por coma.">
            <TextArea
              value={form.sustitutos}
              onChange={(e) => set("sustitutos", e.target.value)}
            />
          </Field>
        </div>

        {error && (
          <p className="rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/entrenador/ejercicios")}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Guardando…" : "Guardar ejercicio"}
          </Button>
        </div>
      </form>
    </div>
  );
}
