"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Field, TextInput } from "@/components/ui";

type Serie = {
  serie: number;
  reps?: string | null;
  peso?: string | null;
  rir?: number | null;
  descanso?: number | null;
};

type Exercise = {
  id: string;
  exercise_id: string | null;
  athlete_id: string | null;
  orden: number;
  name: string;
  target: {
    series: number | null;
    repeticiones: string | null;
    tiempo: string | null;
    rir: number | null;
    descanso_segundos: number | null;
    peso: string | null;
    tempo: string | null;
    asistencia: string | null;
    notas: string | null;
    video_url: string | null;
    sugerencia_progresion: string | null;
  };
  log: { id: string; series: Serie[]; comentarios: string | null } | null;
};

type Row = { done: boolean; reps: string; peso: string; rir: string; descanso: string };

type DraftData = Record<
  string,
  { rows: Row[]; comentario: string; rondas?: string; descanso?: string }
>;
type Draft = { data: DraftData; updatedAt: string };

const DRAFT_MAX_AGE_MS = 3 * 24 * 60 * 60 * 1000;

function initFromExercises(exercises: Exercise[]): DraftData {
  const init: DraftData = {};
  for (const ex of exercises) {
    const fromLog = (ex.log?.series ?? []).map((s) => ({
      done: true,
      reps: s.reps ?? "",
      peso: s.peso ?? "",
      rir: s.rir != null ? String(s.rir) : "",
      descanso: s.descanso != null ? String(s.descanso) : "",
    }));
    if (fromLog.length > 0) {
      init[ex.id] = { rows: fromLog, comentario: ex.log?.comentarios ?? "" };
    } else {
      const n = ex.target.series ?? 1;
      init[ex.id] = {
        rows: Array.from({ length: n }, () => ({
          done: false,
          reps: "",
          peso: "",
          rir: "",
          descanso: "",
        })),
        comentario: "",
      };
    }
  }
  return init;
}

function aplicarDraft(base: DraftData, draft: DraftData): DraftData {
  const next = { ...base };
  for (const [k, v] of Object.entries(draft)) {
    if (v && Array.isArray(v.rows)) {
      next[k] = {
        rows: v.rows,
        comentario: v.comentario ?? "",
        rondas: v.rondas,
        descanso: v.descanso,
      };
    }
  }
  return next;
}

function playBeep() {
  try {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.type = "sine";
    o.frequency.value = 880;
    g.gain.setValueAtTime(0.25, 0);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    o.start();
    o.stop(ctx.currentTime + 0.5);
  } catch {
    /* sin audio */
  }
}

function formatTimerTime(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function LiveWorkout({
  workoutId,
  workoutName,
  athleteId,
  exercises,
  canEdit = false,
  esCombo = false,
  draft = null,
  library = [],
}: {
  workoutId: string;
  workoutName: string;
  athleteId: string;
  exercises: Exercise[];
  canEdit?: boolean;
  esCombo?: boolean;
  draft?: Draft | null;
  library?: { id: string; nombre: string; video_url: string | null }[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typing, setTyping] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const draftKey = `atletix:live:${athleteId}:${workoutId}`;
  const hoy = new Date().toISOString().slice(0, 10);

  const supabaseRef = useRef(supabase);
  const draftTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestRef = useRef<DraftData>({});
  const finishedRef = useRef(false);

  const [items, setItems] = useState<Exercise[]>(exercises);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const onFocusIn = () => {
      const el = document.activeElement;
      setTyping(
        !!el &&
          (el.tagName === "INPUT" ||
            el.tagName === "TEXTAREA" ||
            el.tagName === "SELECT")
      );
    };
    window.addEventListener("focusin", onFocusIn);
    window.addEventListener("focusout", onFocusIn);
    return () => {
      window.removeEventListener("focusin", onFocusIn);
      window.removeEventListener("focusout", onFocusIn);
    };
  }, []);

  const [data, setData] = useState<DraftData>(() => {
    const base = initFromExercises(exercises);
    const applied = draft ? aplicarDraft(base, draft.data) : base;
    if (esCombo) {
      applied.combo = {
        rows: [],
        comentario: "",
        rondas: applied.combo?.rondas ?? "",
        descanso: applied.combo?.descanso ?? "",
      };
    } else {
      delete applied.combo;
    }
    return applied;
  });

  useEffect(() => {
    latestRef.current = data;
  }, [data]);

  const guardarEnServidor = useCallback(() => {
    if (finishedRef.current) return;
    void supabaseRef.current
      .from("workout_drafts")
      .upsert(
        {
          athlete_id: athleteId,
          workout_id: workoutId,
          data: latestRef.current,
          fecha: hoy,
        },
        { onConflict: "athlete_id,workout_id" }
      )
      .then(() => undefined);
  }, [athleteId, workoutId, hoy]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          savedAt?: number;
          data?: DraftData;
        };
        const serverTs = draft ? Date.parse(draft.updatedAt) : 0;
        const localTs = parsed?.savedAt ?? 0;
        const fresco = Date.now() - localTs < DRAFT_MAX_AGE_MS;
        if (parsed?.data && fresco && localTs > serverTs) {
          const guardado = parsed.data;
          // Restauramos el borrador una sola vez al montar para no perder
          // lo cargado si el navegador descarta la pestaña.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setData((prev) => aplicarDraft(prev, guardado));
        } else if (!fresco) {
          localStorage.removeItem(draftKey);
        }
      }
    } catch {
      /* sin borrador */
    }
    setHydrated(true);
  }, [draftKey, draft]);

  useEffect(() => {
    if (!hydrated) return;
    finishedRef.current = false;
    try {
      localStorage.setItem(
        draftKey,
        JSON.stringify({ savedAt: Date.now(), data })
      );
    } catch {
      /* almacenamiento lleno o bloqueado */
    }
    if (draftTimer.current) clearTimeout(draftTimer.current);
    draftTimer.current = setTimeout(guardarEnServidor, 1500);
  }, [data, draftKey, hydrated, guardarEnServidor]);

  useEffect(() => {
    const flush = () => {
      if (draftTimer.current) clearTimeout(draftTimer.current);
      guardarEnServidor();
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
    };
    window.addEventListener("pagehide", flush);
    window.addEventListener("beforeunload", flush);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", flush);
      window.removeEventListener("beforeunload", flush);
      document.removeEventListener("visibilitychange", onVisibility);
      flush();
    };
  }, [guardarEnServidor]);

  function setRow(exId: string, idx: number, patch: Partial<Row>) {
    setData((d) => {
      const rows = d[exId].rows.map((r, i) => (i === idx ? { ...r, ...patch } : r));
      return { ...d, [exId]: { ...d[exId], rows } };
    });
  }

  function addRow(exId: string) {
    setData((d) => ({
      ...d,
      [exId]: {
        ...d[exId],
        rows: [...d[exId].rows, { done: false, reps: "", peso: "", rir: "", descanso: "" }],
      },
    }));
  }

  function removeRow(exId: string, idx: number) {
    setData((d) => ({
      ...d,
      [exId]: { ...d[exId], rows: d[exId].rows.filter((_, i) => i !== idx) },
    }));
  }

  function setCombo(patch: Partial<{ rondas: string; descanso: string }>) {
    setData((d) => {
      const prev = d.combo ?? { rows: [], comentario: "" };
      return { ...d, combo: { ...prev, ...patch } };
    });
  }

  const filteredLibrary = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return library;
    return library.filter((l) => l.nombre.toLowerCase().includes(q));
  }, [library, search]);

  async function addExercise(lib: {
    id: string;
    nombre: string;
    video_url: string | null;
  }) {
    setError(null);
    const nextOrden = Math.max(0, ...items.map((i) => i.orden)) + 1;
    const { data: creado, error: insErr } = await supabase
      .from("workout_exercises")
      .insert({
        workout_id: workoutId,
        exercise_id: lib.id,
        athlete_id: athleteId,
        orden: nextOrden,
        series: 3,
        descanso_segundos: 90,
      })
      .select("id")
      .single();
    if (insErr || !creado) {
      setError(insErr?.message ?? "No se pudo agregar el ejercicio.");
      return;
    }
    const nuevo: Exercise = {
      id: creado.id,
      exercise_id: lib.id,
      athlete_id: athleteId,
      orden: nextOrden,
      name: lib.nombre,
      target: {
        series: 3,
        repeticiones: null,
        tiempo: null,
        rir: null,
        descanso_segundos: 90,
        peso: null,
        tempo: null,
        asistencia: null,
        notas: null,
        video_url: lib.video_url,
        sugerencia_progresion: null,
      },
      log: null,
    };
    setItems((prev) => [...prev, nuevo]);
    setData((prev) => ({
      ...prev,
      [nuevo.id]: {
        rows: Array.from({ length: 3 }, () => ({
          done: false,
          reps: "",
          peso: "",
          rir: "",
          descanso: "",
        })),
        comentario: "",
      },
    }));
    setSearch("");
    setPickerOpen(false);
  }

  async function removeExercise(exercise: Exercise) {
    setError(null);
    if (exercise.athlete_id === athleteId) {
      const { error: delErr } = await supabase
        .from("workout_exercises")
        .delete()
        .eq("id", exercise.id);
      if (delErr) {
        setError(delErr.message);
        return;
      }
    } else {
      const { error: ovErr } = await supabase
        .from("workout_exercise_overrides")
        .upsert(
          {
            athlete_id: athleteId,
            workout_exercise_id: exercise.id,
            oculto: true,
          },
          { onConflict: "athlete_id,workout_exercise_id" }
        );
      if (ovErr) {
        setError(ovErr.message);
        return;
      }
    }
    setItems((prev) => prev.filter((i) => i.id !== exercise.id));
    setData((prev) => {
      const copy = { ...prev };
      delete copy[exercise.id];
      return copy;
    });
  }

  async function moveExercise(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const reordered = [...items];
    [reordered[index], reordered[target]] = [
      reordered[target],
      reordered[index],
    ];
    const conOrden = reordered.map((it, i) => ({ ...it, orden: i + 1 }));
    setItems(conOrden);
    await Promise.all(
      conOrden.map((it) =>
        it.athlete_id === athleteId
          ? supabase
              .from("workout_exercises")
              .update({ orden: it.orden })
              .eq("id", it.id)
          : supabase
              .from("workout_exercise_overrides")
              .upsert(
                {
                  athlete_id: athleteId,
                  workout_exercise_id: it.id,
                  orden: it.orden,
                },
                { onConflict: "athlete_id,workout_exercise_id" }
              )
      )
    );
  }

  const anyDone = useMemo(
    () =>
      Object.values(data).some((g) => g.rows.some((r) => r.done) || g.comentario.trim()),
    [data]
  );

  const [timerRemaining, setTimerRemaining] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    if (timerRemaining === null || !timerRunning) return;
    const id = setInterval(() => {
      setTimerRemaining((r) => {
        if (r === null) return null;
        const next = Math.max(r - 1, 0);
        if (next === 0) playBeep();
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timerRemaining, timerRunning]);

  function startTimer(seconds: number) {
    setTimerRemaining(seconds);
    setTimerRunning(true);
  }

  function toggleTimer() {
    setTimerRunning((r) => !r);
  }

  function stopTimer() {
    setTimerRunning(false);
    setTimerRemaining(null);
  }

  async function handleFinish() {
    setSaving(true);
    setError(null);

    const ids = items.map((e) => e.id);

    await supabase
      .from("workout_logs")
      .delete()
      .eq("athlete_id", athleteId)
      .eq("fecha", hoy)
      .in("workout_exercise_id", ids);

    try {
      for (const ex of items) {
        const g = data[ex.id] ?? { rows: [], comentario: "" };
        const series = g.rows
          .filter((r) => r.done)
          .map((r, i) => ({
            serie: i + 1,
            reps: r.reps.trim() || null,
            peso: r.peso.trim() || null,
            rir: r.rir ? Number(r.rir) : null,
            descanso: r.descanso ? Number(r.descanso) : null,
          }));

        if (series.length === 0 && !g.comentario.trim()) continue;

        const { error } = await supabase.from("workout_logs").insert({
          workout_exercise_id: ex.id,
          athlete_id: athleteId,
          series_data: series,
          comentarios: g.comentario.trim() || null,
          completado: true,
          fecha: hoy,
        });

        if (error) throw error;
      }

      if (esCombo) {
        const comboG = data.combo;
        const { error: cbErr } = await supabase
          .from("workout_combo_logs")
          .upsert(
            {
              workout_id: workoutId,
              athlete_id: athleteId,
              rondas: comboG?.rondas ? Number(comboG.rondas) : null,
              descanso_rondas: comboG?.descanso ? Number(comboG.descanso) : null,
              completado: true,
              fecha: hoy,
            },
            { onConflict: "athlete_id,workout_id,fecha" }
          );
        if (cbErr) throw cbErr;
      }
    } catch (err) {
      setError((err as { message?: string }).message ?? "Error al guardar.");
      setSaving(false);
      return;
    }

    finishedRef.current = true;
    if (draftTimer.current) clearTimeout(draftTimer.current);
    setSaving(false);
    setSaved(true);
    try {
      localStorage.removeItem(draftKey);
    } catch {
      /* nada */
    }
    await supabase
      .from("workout_drafts")
      .delete()
      .eq("athlete_id", athleteId)
      .eq("workout_id", workoutId);
    setTimeout(() => setSaved(false), 4000);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      {esCombo ? (
        <div className="rounded-2xl border border-amber-900/60 bg-amber-950/20 px-5 py-4">
          <p className="text-sm font-bold text-amber-200">
            Combo / circuito · {items.length} ejercicios
          </p>
          <p className="mt-1 text-sm text-amber-300/80">
            Hacé los ejercicios uno atrás de otro. Al terminar, anotá las rondas
            que completaste y el descanso entre rondas.
          </p>
        </div>
      ) : null}
      {canEdit ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-zinc-400">
              Ajustá tu rutina mientras entrenás (los cambios son solo para
              vos): reordená con ↑ ↓, quitá o agregá ejercicios de la
              biblioteca.
            </p>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setPickerOpen((v) => !v)}
            >
              {pickerOpen ? "Cerrar" : "+ Agregar ejercicio"}
            </Button>
          </div>
          {pickerOpen ? (
            <div>
              <TextInput
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar en la biblioteca…"
              />
              <ul className="mt-3 flex max-h-72 flex-col gap-1 overflow-y-auto">
                {filteredLibrary.length === 0 ? (
                  <li className="px-2 py-3 text-sm text-zinc-600">
                    No se encontraron ejercicios.
                  </li>
                ) : (
                  filteredLibrary.slice(0, 60).map((l) => {
                    const yaEsta = items.some((i) => i.exercise_id === l.id);
                    return (
                      <li key={l.id}>
                        <button
                          type="button"
                          disabled={yaEsta}
                          onClick={() => addExercise(l)}
                          className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-zinc-900 disabled:opacity-40"
                        >
                          <span className="font-medium">{l.nombre}</span>
                          {yaEsta ? (
                            <span className="text-xs text-zinc-500">ya está</span>
                          ) : null}
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20 px-6 py-10 text-center">
          <p className="text-sm font-semibold text-zinc-400">
            Esta sesión todavía no tiene ejercicios
          </p>
          {canEdit ? (
            <p className="mt-1 text-sm text-zinc-600">
              Usá “+ Agregar ejercicio” para armar tu rutina.
            </p>
          ) : null}
        </div>
      ) : (
        <ol className="flex flex-col gap-3">
          {items.map((ex, i) => {
            const g = data[ex.id] ?? { rows: [], comentario: "" };
            return (
              <ExerciseCard
                key={ex.id}
                index={i}
                exercise={ex}
                rows={g.rows}
                onRow={(idx, patch) => setRow(ex.id, idx, patch)}
                onAddRow={() => addRow(ex.id)}
                onRemoveRow={(idx) => removeRow(ex.id, idx)}
                onRestStart={() => startTimer(ex.target.descanso_segundos ?? 90)}
                comentario={g.comentario}
                onComentario={(v) =>
                  setData((d) => ({
                    ...d,
                    [ex.id]: { rows: d[ex.id]?.rows ?? [], comentario: v },
                  }))
                }
                canEdit={canEdit}
                total={items.length}
                onMoveUp={() => moveExercise(i, -1)}
                onMoveDown={() => moveExercise(i, 1)}
                onRemove={() => removeExercise(ex)}
              />
            );
          })}
        </ol>
      )}

      {esCombo ? (
        <div className="grid grid-cols-1 gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:grid-cols-2">
          <Field label="Rondas completadas">
            <input
              type="number"
              min={0}
              value={data.combo?.rondas ?? ""}
              onChange={(e) => setCombo({ rondas: e.target.value })}
              placeholder="Ej: 3"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-zinc-500"
            />
          </Field>
          <Field label="Descanso entre rondas (min)">
            <input
              type="number"
              min={0}
              value={data.combo?.descanso ?? ""}
              onChange={(e) => setCombo({ descanso: e.target.value })}
              placeholder="Ej: 2"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-zinc-500"
            />
          </Field>
        </div>
      ) : null}

      <div
        className={`${typing ? "relative" : "sticky bottom-4"} flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/95 p-3 backdrop-blur`}
      >
        <RestTimerBar
          remaining={timerRemaining}
          running={timerRunning}
          onStart={startTimer}
          onToggle={toggleTimer}
          onStop={stopTimer}
        />
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 pt-3">
          <div>
            {anyDone ? (
              <p className="text-sm text-zinc-400">
                Vas guardando {workoutName} · marcá cada serie cuando la completes
              </p>
            ) : (
              <p className="text-sm text-zinc-500">
                Marcá las series que vayas completando.
              </p>
            )}
          </div>
          <Button type="button" onClick={handleFinish} disabled={saving || !anyDone}>
            {saving ? "Guardando…" : "Finalizar y guardar ✓"}
          </Button>
        </div>
      </div>

      {saved && (
        <div className="rounded-2xl border border-emerald-800/70 bg-emerald-950/40 px-6 py-4 text-center">
          <p className="font-bold text-emerald-300">
            Entrenamiento guardado ✓
          </p>
          <p className="text-sm text-emerald-400/80">
            Tu entrenador ya puede ver tu registro.
          </p>
        </div>
      )}

      {error && (
        <p className="rounded-xl border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

const REST_PRESETS_MIN = [1, 2, 3, 5];

function RestTimerBar({
  remaining,
  running,
  onStart,
  onToggle,
  onStop,
}: {
  remaining: number | null;
  running: boolean;
  onStart: (s: number) => void;
  onToggle: () => void;
  onStop: () => void;
}) {
  const idle = remaining === null;
  const finished = remaining === 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
          Descanso
        </span>
        {idle ? (
          <span className="text-xs text-zinc-600">
            marcá una serie y arranca solo
          </span>
        ) : (
          <>
            <span
              className={`font-mono text-xl font-black tabular-nums ${
                finished ? "text-emerald-300" : "text-white"
              }`}
            >
              {formatTimerTime(remaining)}
            </span>
            <div className="flex items-center gap-1.5">
              {finished ? (
                <span className="rounded-lg bg-emerald-950 px-2 py-1 text-xs font-bold text-emerald-300">
                  ¡Descanso listo!
                </span>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    type="button"
                    className="px-2.5 py-1 text-xs"
                    onClick={onToggle}
                  >
                    {running ? "Pausa" : "Reanudar"}
                  </Button>
                  <Button
                    variant="secondary"
                    type="button"
                    className="px-2.5 py-1 text-xs"
                    onClick={() => onStart(remaining + 60)}
                  >
                    +1 min
                  </Button>
                </>
              )}
              <button
                onClick={onStop}
                className="rounded-lg px-2 py-1 text-xs text-zinc-500 transition hover:text-red-400"
                title="Detener cronómetro"
              >
                ✕
              </button>
            </div>
          </>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] text-zinc-600">Rápido:</span>
        {REST_PRESETS_MIN.map((m) => (
          <button
            key={m}
            onClick={() => onStart(m * 60)}
            className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition hover:border-zinc-500 ${
              remaining === m * 60 ? "border-white bg-white text-zinc-950" : "border-zinc-800 text-zinc-300"
            }`}
          >
            {m} min
          </button>
        ))}
      </div>
    </div>
  );
}

function ExerciseCard({
  index,
  exercise,
  rows,
  onRow,
  onAddRow,
  onRemoveRow,
  onRestStart,
  comentario,
  onComentario,
  canEdit = false,
  total = 1,
  onMoveUp,
  onMoveDown,
  onRemove,
}: {
  index: number;
  exercise: Exercise;
  rows: Row[];
  onRow: (idx: number, patch: Partial<Row>) => void;
  onAddRow: () => void;
  onRemoveRow: (idx: number) => void;
  onRestStart: () => void;
  comentario: string;
  onComentario: (v: string) => void;
  canEdit?: boolean;
  total?: number;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRemove?: () => void;
}) {
  const t = exercise.target;

  const [confirmRemove, setConfirmRemove] = useState(false);

  return (
    <li className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
      <div className="flex items-center gap-2.5">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-800 text-xs font-bold text-zinc-300">
          {index + 1}
        </span>
        <h2 className="text-base font-bold uppercase">{exercise.name}</h2>
        {canEdit ? (
          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={onMoveUp}
              disabled={index === 0}
              title="Subir"
              className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-800 text-sm text-zinc-400 transition hover:border-zinc-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={onMoveDown}
              disabled={index === total - 1}
              title="Bajar"
              className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-800 text-sm text-zinc-400 transition hover:border-zinc-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              ↓
            </button>
            {confirmRemove ? (
              <span className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={onRemove}
                  className="rounded-md bg-red-950 px-2 py-1 text-xs font-semibold text-red-200 transition hover:bg-red-900"
                >
                  Quitar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmRemove(false)}
                  className="rounded-md border border-zinc-800 px-2 py-1 text-xs text-zinc-400 transition hover:border-zinc-600"
                >
                  No
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmRemove(true)}
                title="Quitar ejercicio"
                className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-800 text-xs text-zinc-500 transition hover:border-red-800 hover:text-red-300"
              >
                ✕
              </button>
            )}
          </div>
        ) : null}
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs">
        {t.series ? (
          <span className="rounded-md bg-white px-2.5 py-1 font-bold text-zinc-950">
            {t.series}× {t.repeticiones || (t.tiempo ? "" : "—")}
          </span>
        ) : null}
        {t.repeticiones ? (
          <span className="rounded-md border border-zinc-700 px-2.5 py-1 text-zinc-300">
            {t.repeticiones} reps
          </span>
        ) : null}
        {t.tiempo ? (
          <span className="rounded-md border border-zinc-700 px-2.5 py-1 text-zinc-300">
            {t.tiempo}
          </span>
        ) : null}
        {t.rir != null ? (
          <span className="rounded-md border border-zinc-700 px-2.5 py-1 text-zinc-300">
            RIR {t.rir}
          </span>
        ) : null}
        {t.peso ? (
          <span className="rounded-md border border-zinc-700 px-2.5 py-1 font-semibold text-zinc-300">
            {t.peso}
          </span>
        ) : null}
        {t.tempo ? (
          <span className="rounded-md border border-zinc-700 px-2.5 py-1 text-zinc-400">
            Tempo {t.tempo}
          </span>
        ) : null}
        {t.asistencia ? (
          <span className="rounded-md border border-zinc-700 px-2.5 py-1 text-zinc-400">
            Asistencia: {t.asistencia}
          </span>
        ) : null}
      </div>

      {t.sugerencia_progresion ? (
        <p className="mt-2.5 rounded-lg border border-amber-800/70 bg-amber-950/40 px-3 py-2.5 text-sm text-amber-200">
          <span className="font-bold">Sugerencia de tu entrenador:</span>{" "}
          {t.sugerencia_progresion}
        </p>
      ) : null}

      {t.notas ? (
        <p className="mt-2.5 text-sm text-zinc-400">
          <span className="font-semibold text-zinc-300">Notas:</span> {t.notas}
        </p>
      ) : null}

      <div className="mt-3.5 flex flex-col gap-2">
        <div className="grid grid-cols-[2rem_minmax(5rem,1.2fr)_4rem_3rem_3.5rem] items-center gap-2 rounded-t-xl border border-zinc-800 bg-zinc-950/60 px-2 py-1.5 text-[11px] font-semibold text-zinc-500">
          <span>✓</span>
          <span>Reps / Tiempo</span>
          <span>Peso</span>
          <span>RIR</span>
          <span className="text-right">Desc. (min)</span>
        </div>
        {rows.map((r, idx) => (
          <div
            key={idx}
            className={`grid grid-cols-[2rem_minmax(5rem,1.2fr)_4rem_3rem_3.5rem] items-center gap-2 rounded-xl border px-2 py-1.5 ${
              r.done
                ? "border-emerald-800/70 bg-emerald-950/30"
                : "border-zinc-800 bg-zinc-950/40"
            }`}
          >
            <input
              type="checkbox"
              checked={r.done}
              onChange={(e) => {
                onRow(idx, { done: e.target.checked });
                if (e.target.checked) onRestStart();
              }}
              className="h-4 w-4 accent-emerald-500"
            />
            <input
              value={r.reps}
              onChange={(e) => onRow(idx, { reps: e.target.value })}
              placeholder={t.repeticiones || "—"}
              className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-2 py-2 text-base text-zinc-100 outline-none focus:border-zinc-500"
            />
            <div className="flex items-center gap-1">
              <input
                value={r.peso}
                onChange={(e) => onRow(idx, { peso: e.target.value })}
                placeholder={t.peso || "0"}
                className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-100 outline-none focus:border-zinc-500"
              />
            </div>
            <input
              type="number"
              value={r.rir}
              onChange={(e) => onRow(idx, { rir: e.target.value })}
              placeholder={t.rir != null ? String(t.rir) : "0"}
              className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-100 outline-none focus:border-zinc-500"
            />
            <div className="flex items-center justify-end gap-1">
              <input
                type="number"
                step="0.5"
                min="0"
                value={r.descanso}
                onChange={(e) => onRow(idx, { descanso: e.target.value })}
                placeholder="2"
                className="w-14 rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-100 outline-none focus:border-zinc-500"
              />
              <button
                onClick={() => onRemoveRow(idx)}
                className="text-xs text-zinc-600 transition hover:text-red-400"
                title="Eliminar serie"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={onAddRow}
          className="w-fit rounded-md border border-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-200"
        >
          + Agregar serie
        </button>
      </div>

      <div className="mt-3.5 flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between">
        <input
          value={comentario}
          onChange={(e) => onComentario(e.target.value)}
          placeholder="Comentario de la sesión (opcional)"
          className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-sm text-zinc-100 outline-none focus:border-zinc-500 sm:max-w-md"
        />

        {t.video_url ? (
          <a
            href={t.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-zinc-700 px-2.5 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-zinc-500"
          >
            ▶ Ver video
          </a>
        ) : null}
      </div>
    </li>
  );
}