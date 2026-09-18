-- ============================================================
-- ATLETIX · COMBOS / CIRCUITOS DE EJERCICIOS
-- 1) workouts: columna es_combo (sesión marcada como circuito).
-- 2) workout_combo_logs: lo que hizo el alumno (rondas + descanso).
-- Corre sobre 0011+ (necesita workouts, profiles e is_admin()).
-- Idempotente.
-- ============================================================

-- 1) FLAG de combo en la sesión
alter table public.workouts
  add column if not exists es_combo boolean not null default false;

-- 2) REGISTRO DE COMBO (por alumno, por sesión, por día)
create table if not exists public.workout_combo_logs (
  id               uuid primary key default gen_random_uuid(),
  workout_id       uuid not null references public.workouts (id) on delete cascade,
  athlete_id       uuid not null references public.profiles (id) on delete cascade,
  rondas           integer,
  descanso_rondas  integer,
  completado       boolean not null default false,
  fecha            date not null default current_date,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (athlete_id, workout_id, fecha)
);

create index if not exists idx_workout_combo_logs_athlete
  on public.workout_combo_logs (athlete_id);

create index if not exists idx_workout_combo_logs_workout
  on public.workout_combo_logs (workout_id);

alter table public.workout_combo_logs enable row level security;

create policy "workout_combo_logs_select_own_or_admin"
  on public.workout_combo_logs for select
  using (athlete_id = auth.uid() or public.is_admin());

create policy "workout_combo_logs_insert_own_or_admin"
  on public.workout_combo_logs for insert
  with check (athlete_id = auth.uid() or public.is_admin());

create policy "workout_combo_logs_update_own_or_admin"
  on public.workout_combo_logs for update
  using (athlete_id = auth.uid() or public.is_admin())
  with check (athlete_id = auth.uid() or public.is_admin());

create policy "workout_combo_logs_delete_own_or_admin"
  on public.workout_combo_logs for delete
  using (athlete_id = auth.uid() or public.is_admin());