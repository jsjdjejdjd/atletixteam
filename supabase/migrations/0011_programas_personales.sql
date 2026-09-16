-- ============================================================
-- ATLETIX · FASE 13 · Programas personales de los alumnos
-- Permite que cada alumno cree SU PROPIO programa, armado con días
-- y ejercicios de la biblioteca, y luego entrene con cronómetro.
-- Todo es ADITIVO: no modifica ni borra datos existentes. Solo ajusta
-- una policy de lectura para que los programas personales no queden
-- expuestos a otros alumnos.
-- Pegar en: Supabase → SQL Editor → Run (se puede correr más de una vez)
-- ============================================================

-- ============================================================
-- 1) Columna created_by en programs (dueño del programa)
--    null = programa creado por el entrenador
--    <uuid> = programa personal del alumno
-- ============================================================
alter table public.programs
  add column if not exists created_by uuid references public.profiles (id) on delete cascade;

create index if not exists idx_programs_created_by on public.programs (created_by);

-- ============================================================
-- 2) Lectura pública de programas:
--    · los programas `activo = true` (los del catálogo)
--    · los tuyos propios (created_by = auth.uid())
--    · el admin siempre ve todo
--    Reemplaza la policy anterior de "ver todo" para que los
--    programas personales (activo = false) no queden visibles.
-- ============================================================
drop policy if exists "programs_select_all_authenticated" on public.programs;
create policy "programs_select_all_authenticated" on public.programs
  for select to authenticated
  using (activo = true or public.is_admin() or created_by = auth.uid());

-- ============================================================
-- 3) programs · CRUD de programas propios
-- ============================================================
drop policy if exists "programs_insert_own" on public.programs;
create policy "programs_insert_own" on public.programs
  for insert to authenticated
  with check (created_by = auth.uid());

drop policy if exists "programs_select_own" on public.programs;
create policy "programs_select_own" on public.programs
  for select to authenticated
  using (created_by = auth.uid());

drop policy if exists "programs_update_own" on public.programs;
create policy "programs_update_own" on public.programs
  for update to authenticated
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

drop policy if exists "programs_delete_own" on public.programs;
create policy "programs_delete_own" on public.programs
  for delete to authenticated
  using (created_by = auth.uid());

-- ============================================================
-- 4) weeks · CRUD sobre programas propios
-- ============================================================
drop policy if exists "weeks_insert_own_program" on public.weeks;
create policy "weeks_insert_own_program" on public.weeks
  for insert to authenticated
  with check (
    exists (
      select 1 from public.programs p
      where p.id = program_id and p.created_by = auth.uid()
    )
  );

drop policy if exists "weeks_select_own_program" on public.weeks;
create policy "weeks_select_own_program" on public.weeks
  for select to authenticated
  using (
    exists (
      select 1 from public.programs p
      where p.id = program_id and p.created_by = auth.uid()
    )
  );

drop policy if exists "weeks_update_own_program" on public.weeks;
create policy "weeks_update_own_program" on public.weeks
  for update to authenticated
  using (
    exists (
      select 1 from public.programs p
      where p.id = program_id and p.created_by = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.programs p
      where p.id = program_id and p.created_by = auth.uid()
    )
  );

drop policy if exists "weeks_delete_own_program" on public.weeks;
create policy "weeks_delete_own_program" on public.weeks
  for delete to authenticated
  using (
    exists (
      select 1 from public.programs p
      where p.id = program_id and p.created_by = auth.uid()
    )
  );

-- ============================================================
-- 5) workouts (sesiones) · CRUD sobre programas propios
-- ============================================================
drop policy if exists "workouts_insert_own_program" on public.workouts;
create policy "workouts_insert_own_program" on public.workouts
  for insert to authenticated
  with check (
    exists (
      select 1 from public.weeks w
      join public.programs p on p.id = w.program_id
      where w.id = week_id and p.created_by = auth.uid()
    )
  );

drop policy if exists "workouts_select_own_program" on public.workouts;
create policy "workouts_select_own_program" on public.workouts
  for select to authenticated
  using (
    exists (
      select 1 from public.weeks w
      join public.programs p on p.id = w.program_id
      where w.id = week_id and p.created_by = auth.uid()
    )
  );

drop policy if exists "workouts_update_own_program" on public.workouts;
create policy "workouts_update_own_program" on public.workouts
  for update to authenticated
  using (
    exists (
      select 1 from public.weeks w
      join public.programs p on p.id = w.program_id
      where w.id = week_id and p.created_by = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.weeks w
      join public.programs p on p.id = w.program_id
      where w.id = week_id and p.created_by = auth.uid()
    )
  );

drop policy if exists "workouts_delete_own_program" on public.workouts;
create policy "workouts_delete_own_program" on public.workouts
  for delete to authenticated
  using (
    exists (
      select 1 from public.weeks w
      join public.programs p on p.id = w.program_id
      where w.id = week_id and p.created_by = auth.uid()
    )
  );

-- ============================================================
-- 6) workout_exercises · CRUD sobre programas propios
-- ============================================================
drop policy if exists "workout_exercises_insert_own_program" on public.workout_exercises;
create policy "workout_exercises_insert_own_program" on public.workout_exercises
  for insert to authenticated
  with check (
    exists (
      select 1 from public.workouts wo
      join public.weeks w on w.id = wo.week_id
      join public.programs p on p.id = w.program_id
      where wo.id = workout_id and p.created_by = auth.uid()
    )
  );

drop policy if exists "workout_exercises_select_own_program" on public.workout_exercises;
create policy "workout_exercises_select_own_program" on public.workout_exercises
  for select to authenticated
  using (
    exists (
      select 1 from public.workouts wo
      join public.weeks w on w.id = wo.week_id
      join public.programs p on p.id = w.program_id
      where wo.id = workout_id and p.created_by = auth.uid()
    )
  );

drop policy if exists "workout_exercises_update_own_program" on public.workout_exercises;
create policy "workout_exercises_update_own_program" on public.workout_exercises
  for update to authenticated
  using (
    exists (
      select 1 from public.workouts wo
      join public.weeks w on w.id = wo.week_id
      join public.programs p on p.id = w.program_id
      where wo.id = workout_id and p.created_by = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.workouts wo
      join public.weeks w on w.id = wo.week_id
      join public.programs p on p.id = w.program_id
      where wo.id = workout_id and p.created_by = auth.uid()
    )
  );

drop policy if exists "workout_exercises_delete_own_program" on public.workout_exercises;
create policy "workout_exercises_delete_own_program" on public.workout_exercises
  for delete to authenticated
  using (
    exists (
      select 1 from public.workouts wo
      join public.weeks w on w.id = wo.week_id
      join public.programs p on p.id = w.program_id
      where wo.id = workout_id and p.created_by = auth.uid()
    )
  );

-- ============================================================
-- 7) Verificación
-- ============================================================
select 'FASE 13 OK' as estado,
  (select count(*) from information_schema.columns
   where table_schema = 'public' and table_name = 'programs'
     and column_name = 'created_by') as col_created_by,
  (select count(*) from pg_policies
   where tablename = 'programs' and policyname = 'programs_insert_own') as pol_insert_programa,
  (select count(*) from pg_policies
   where tablename = 'weeks' and policyname = 'weeks_insert_own_program') as pol_insert_semana,
  (select count(*) from pg_policies
   where tablename = 'workouts' and policyname = 'workouts_insert_own_program') as pol_insert_sesion,
  (select count(*) from pg_policies
   where tablename = 'workout_exercises' and policyname = 'workout_exercises_insert_own_program') as pol_insert_ejercicio;