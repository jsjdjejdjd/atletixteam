-- ============================================================
-- ATLETIX · FASE 15 · Sesiones personalizadas por alumno
-- Permite que CADA alumno ajuste su propio entrenamiento (agregar,
-- quitar y reordenar ejercicios) SIN afectar a los demas.
--   · La sesion "base" (la que arma el entrenador) queda compartida.
--   · Los ejercicios que agrega un alumno se guardan como fila personal
--     (workout_exercises.athlete_id = alumno) y solo los ve el.
--   · Para "quitar" un ejercicio de la base sin borrarlo para todos, se
--     usa la tabla de overrides (oculto = true).
--   · La BIBLIOTECA (tabla exercises) sigue siendo compartida: un
--     ejercicio nuevo que crea un alumno lo ven todos.
-- Todo es ADITIVO: no modifica ni borra datos existentes.
-- Pegar en: Supabase → SQL Editor → Run (se puede correr mas de una vez)
-- ============================================================

-- ============================================================
-- 1) Fila personal vs. base en workout_exercises
--    athlete_id NULL  -> ejercicio de la sesion base (compartido)
--    athlete_id = uid -> ejercicio propio del alumno
-- ============================================================
alter table public.workout_exercises
  add column if not exists athlete_id uuid references public.profiles (id) on delete cascade;

create index if not exists idx_workout_exercises_athlete
  on public.workout_exercises (athlete_id);

-- ============================================================
-- 2) Overrides por alumno (ocultar / reordenar ejercicios de la base)
-- ============================================================
create table if not exists public.workout_exercise_overrides (
  id                   uuid primary key default gen_random_uuid(),
  athlete_id           uuid not null references public.profiles (id) on delete cascade,
  workout_exercise_id  uuid not null references public.workout_exercises (id) on delete cascade,
  oculto               boolean not null default false,
  orden                integer,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  unique (athlete_id, workout_exercise_id)
);

create index if not exists idx_we_overrides_athlete
  on public.workout_exercise_overrides (athlete_id);

drop trigger if exists handle_updated_at_we_overrides on public.workout_exercise_overrides;
create trigger handle_updated_at_we_overrides before update on public.workout_exercise_overrides
  for each row execute procedure moddatetime (updated_at);

alter table public.workout_exercise_overrides enable row level security;

drop policy if exists "we_overrides_select_own" on public.workout_exercise_overrides;
create policy "we_overrides_select_own" on public.workout_exercise_overrides
  for select to authenticated
  using (athlete_id = auth.uid() or public.is_admin());

drop policy if exists "we_overrides_insert_own" on public.workout_exercise_overrides;
create policy "we_overrides_insert_own" on public.workout_exercise_overrides
  for insert to authenticated
  with check (athlete_id = auth.uid());

drop policy if exists "we_overrides_update_own" on public.workout_exercise_overrides;
create policy "we_overrides_update_own" on public.workout_exercise_overrides
  for update to authenticated
  using (athlete_id = auth.uid())
  with check (athlete_id = auth.uid());

drop policy if exists "we_overrides_delete_own" on public.workout_exercise_overrides;
create policy "we_overrides_delete_own" on public.workout_exercise_overrides
  for delete to authenticated
  using (athlete_id = auth.uid());

-- ============================================================
-- 3) SELECT de workout_exercises: que un alumno NO vea las filas
--    personales de otro (si la base + las propias).
-- ============================================================
drop policy if exists "workout_exercises_select_assigned_or_admin" on public.workout_exercises;
create policy "workout_exercises_select_assigned_or_admin"
  on public.workout_exercises for select
  using (
    public.is_admin()
    or (
      (athlete_id is null or athlete_id = auth.uid())
      and workout_id in (
        select wo.id
        from public.workouts wo
        join public.weeks w on w.id = wo.week_id
        join public.athlete_programs ap on ap.program_id = w.program_id
        join public.athletes a on a.id = ap.athlete_id
        where a.user_id = auth.uid()
      )
    )
  );

-- ============================================================
-- 4) El alumno asignado puede crear/editar/borrar SUS filas personales
-- ============================================================
drop policy if exists "workout_exercises_insert_personal" on public.workout_exercises;
create policy "workout_exercises_insert_personal" on public.workout_exercises
  for insert to authenticated
  with check (
    athlete_id = auth.uid()
    and workout_id in (
      select wo.id
      from public.workouts wo
      join public.weeks w on w.id = wo.week_id
      join public.athlete_programs ap on ap.program_id = w.program_id
      join public.athletes a on a.id = ap.athlete_id
      where a.user_id = auth.uid()
    )
    and (
      exercise_id is null
      or exists (
        select 1 from public.exercises e
        where e.id = exercise_id and e.activo = true
      )
    )
  );

drop policy if exists "workout_exercises_update_personal" on public.workout_exercises;
create policy "workout_exercises_update_personal" on public.workout_exercises
  for update to authenticated
  using (athlete_id = auth.uid())
  with check (athlete_id = auth.uid());

drop policy if exists "workout_exercises_delete_personal" on public.workout_exercises;
create policy "workout_exercises_delete_personal" on public.workout_exercises
  for delete to authenticated
  using (athlete_id = auth.uid());

-- ============================================================
-- Verificacion
-- ============================================================
select 'FASE 15 OK' as estado,
  (select count(*) from information_schema.columns
   where table_schema = 'public' and table_name = 'workout_exercises'
     and column_name = 'athlete_id') as col_athlete_id,
  (select count(*) from pg_policies
   where tablename = 'workout_exercise_overrides') as pol_overrides,
  (select count(*) from pg_policies
   where tablename = 'workout_exercises' and policyname like '%personal') as pol_personales;
