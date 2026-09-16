"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui";

type Serie = {
  serie: number;
  reps?: string | null;
  peso?: string | null;
  rir?: number | null;
  descanso?: number | null;
};

type Exercise = {
  id: string;
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
  miVideo: string | null;
};

type Row = { done: boolean; reps: string; peso: string; rir: string; descanso: string };

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
  workoutName,
  athleteId,
  exercises,
}: {
  workoutName: string;
  athleteId: string;
  exercises: Exercise[];
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [data, setData] = useState<Record<string, { rows: Row[]; comentario: string }>>(() => {
    const init: Record<string, { rows: Row[]; comentario: string }> = {};
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
  });

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
    const supabase = createClient();

    const hoy = new Date().toISOString().slice(0, 10);
    const ids = exercises.map((e) => e.id);

    await supabase
      .from("workout_logs")
      .delete()
      .eq("athlete_id", athleteId)
      .eq("fecha", hoy)
      .in("workout_exercise_id", ids);

    try {
      for (const ex of exercises) {
        const g = data[ex.id];
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
    } catch (err) {
      setError((err as { message?: string }).message ?? "Error al guardar.");
      setSaving(false);
      return;
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-8">
      <ol className="flex flex-col gap-6">
        {exercises.map((ex, i) => (
          <ExerciseCard
            key={ex.id}
            index={i}
            exercise={ex}
            athleteId={athleteId}
            rows={data[ex.id].rows}
            onRow={(idx, patch) => setRow(ex.id, idx, patch)}
            onAddRow={() => addRow(ex.id)}
            onRemoveRow={(idx) => removeRow(ex.id, idx)}
            onRestStart={() => startTimer(ex.target.descanso_segundos ?? 90)}
            comentario={data[ex.id].comentario}
            onComentario={(v) =>
              setData((d) => ({ ...d, [ex.id]: { ...d[ex.id], comentario: v } }))
            }
          />
        ))}
      </ol>

      <div className="sticky bottom-4 flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/95 p-4 backdrop-blur">
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

const REST_PRESETS = [30, 60, 90, 120, 180, 300];

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
              className={`font-mono text-2xl font-black tabular-nums ${
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
                    onClick={() => onStart(remaining + 30)}
                  >
                    +30s
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
        {REST_PRESETS.map((s) => (
          <button
            key={s}
            onClick={() => onStart(s)}
            className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition hover:border-zinc-500 ${
              remaining === s ? "border-white bg-white text-zinc-950" : "border-zinc-800 text-zinc-300"
            }`}
          >
            {s >= 60 ? `${s / 60} min` : `${s}s`}
          </button>
        ))}
      </div>
    </div>
  );
}

function ExerciseCard({
  index,
  exercise,
  athleteId,
  rows,
  onRow,
  onAddRow,
  onRemoveRow,
  onRestStart,
  comentario,
  onComentario,
}: {
  index: number;
  exercise: Exercise;
  athleteId: string;
  rows: Row[];
  onRow: (idx: number, patch: Partial<Row>) => void;
  onAddRow: () => void;
  onRemoveRow: (idx: number) => void;
  onRestStart: () => void;
  comentario: string;
  onComentario: (v: string) => void;
}) {
  const supabase = createClient();
  const t = exercise.target;

  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(exercise.miVideo);
  const [videoError, setVideoError] = useState<string | null>(null);

  async function handleVideo(file: File) {
    setVideoError(null);
    setUploading(true);
    const ext = file.name.split(".").pop() || "mp4";
    const path = `${athleteId}/${exercise.id}/${Date.now()}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from("videos")
      .upload(path, file);

    if (upErr) {
      setVideoError(upErr.message);
      setUploading(false);
      return;
    }

    await supabase.from("videos").insert({
      athlete_id: athleteId,
      workout_exercise_id: exercise.id,
      storage_path: path,
    });

    setVideoUrl(supabase.storage.from("videos").getPublicUrl(path).data.publicUrl);
    setUploading(false);
  }

  return (
    <li className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-sm font-bold text-zinc-300">
          {index + 1}
        </span>
        <h2 className="text-lg font-extrabold uppercase">{exercise.name}</h2>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        {t.series ? (
          <span className="rounded-lg bg-white px-3 py-1.5 font-bold text-zinc-950">
            {t.series}× {t.repeticiones || (t.tiempo ? "" : "—")}
          </span>
        ) : null}
        {t.repeticiones ? (
          <span className="rounded-lg border border-zinc-700 px-3 py-1.5 text-zinc-300">
            {t.repeticiones} reps
          </span>
        ) : null}
        {t.tiempo ? (
          <span className="rounded-lg border border-zinc-700 px-3 py-1.5 text-zinc-300">
            {t.tiempo}
          </span>
        ) : null}
        {t.rir != null ? (
          <span className="rounded-lg border border-zinc-700 px-3 py-1.5 text-zinc-300">
            RIR {t.rir}
          </span>
        ) : null}
        {t.peso ? (
          <span className="rounded-lg border border-zinc-700 px-3 py-1.5 font-semibold text-zinc-300">
            {t.peso}
          </span>
        ) : null}
        {t.tempo ? (
          <span className="rounded-lg border border-zinc-700 px-3 py-1.5 text-zinc-400">
            Tempo {t.tempo}
          </span>
        ) : null}
        {t.asistencia ? (
          <span className="rounded-lg border border-zinc-700 px-3 py-1.5 text-zinc-400">
            Asistencia: {t.asistencia}
          </span>
        ) : null}
      </div>

      {t.sugerencia_progresion ? (
        <p className="mt-3 rounded-xl border border-amber-800/70 bg-amber-950/40 px-4 py-3 text-sm text-amber-200">
          <span className="font-bold">Sugerencia de tu entrenador:</span>{" "}
          {t.sugerencia_progresion}
        </p>
      ) : null}

      {t.notas ? (
        <p className="mt-3 text-sm text-zinc-400">
          <span className="font-semibold text-zinc-300">Notas:</span> {t.notas}
        </p>
      ) : null}

      <div className="mt-4 flex flex-col gap-2">
        <div className="grid grid-cols-[2rem_1fr_5rem_4rem_3rem] items-center gap-2 rounded-t-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-xs font-semibold text-zinc-500">
          <span>✓</span>
          <span>Reps / Tiempo</span>
          <span>Peso</span>
          <span>RIR</span>
          <span className="text-right">Desc.(s)</span>
        </div>
        {rows.map((r, idx) => (
          <div
            key={idx}
            className={`grid grid-cols-[2rem_1fr_5rem_4rem_3rem] items-center gap-2 rounded-xl border px-3 py-2 ${
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
              className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-100 outline-none focus:border-zinc-500"
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
                value={r.descanso}
                onChange={(e) => onRow(idx, { descanso: e.target.value })}
                placeholder="180"
                className="w-12 rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-100 outline-none focus:border-zinc-500"
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
          className="w-fit rounded-lg border border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-200"
        >
          + Agregar serie
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <input
          value={comentario}
          onChange={(e) => onComentario(e.target.value)}
          placeholder="Comentario de la sesión (opcional)"
          className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-500 sm:max-w-md"
        />

        <div className="flex items-center gap-3">
          {videoUrl ? (
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-emerald-950 px-3 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-900"
            >
              ▶ Mi video ✓
            </a>
          ) : null}
          {t.video_url ? (
            <a
              href={t.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-zinc-700 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-zinc-500"
            >
              ▶ Demo
            </a>
          ) : null}
          <label className="cursor-pointer rounded-lg border border-zinc-700 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-zinc-500">
            {uploading ? "Subiendo…" : "Subir video"}
            <input
              type="file"
              accept="video/*"
              className="hidden"
              disabled={uploading}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) await handleVideo(file);
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </div>

      {videoError ? (
        <p className="mt-2 text-xs text-red-300">{videoError}</p>
      ) : null}
    </li>
  );
}