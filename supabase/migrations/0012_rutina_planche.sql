-- ============================================================
-- ATLETIX · FASE 14 · Rutina compartida Planche / Front Lever
-- Permite que los alumnos anotados en los programas "Planche / Front Lever"
-- (Intermedio / Avanzado / Elite) armen las sesiones en conjunto con su
-- entrenador, y creen ejercicios nuevos en la biblioteca si no existen.
-- El entrenador (admin) ya podia hacer todo; esto amplia los permisos al grupo.
-- Todo es ADITIVO: no modifica ni borra datos existentes.
-- Pegar en: Supabase → SQL Editor → Run (se puede correr mas de una vez)
-- ============================================================

-- ============================================================
-- 1) Helper: usuario es admin o esta anotado (estado activo) en un
--    programa llamado "Planche / Front Lever"
-- ============================================================
create or replace function public.is_planche_member()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.athlete_programs ap
    join public.programs p on p.id = ap.program_id
      and p.nombre = 'Planche / Front Lever'
    join public.athletes a on a.id = ap.athlete_id
      and a.user_id = auth.uid()
    where ap.estado = 'activo'
  );
$$;

-- ============================================================
-- 2) exercises · los miembros del grupo pueden crear ejercicios
--    nuevos en la biblioteca (siempre activos para que se vean).
--    El admin conserva su policy original (sin la condicion de activo).
-- ============================================================
drop policy if exists "exercises_insert_planche" on public.exercises;
create policy "exercises_insert_planche" on public.exercises
  for insert to authenticated
  with check (activo = true and public.is_planche_member());

-- ============================================================
-- 3) weeks · CRUD de semanas de programas "Planche / Front Lever"
-- ============================================================
drop policy if exists "weeks_insert_planche" on public.weeks;
create policy "weeks_insert_planche" on public.weeks
  for insert to authenticated
  with check (
    public.is_planche_member()
    and exists (
      select 1 from public.programs p
      where p.id = program_id and p.nombre = 'Planche / Front Lever'
    )
  );

drop policy if exists "weeks_update_planche" on public.weeks;
create policy "weeks_update_planche" on public.weeks
  for update to authenticated
  using (
    public.is_planche_member()
    and exists (
      select 1 from public.programs p
      where p.id = program_id and p.nombre = 'Planche / Front Lever'
    )
  )
  with check (
    public.is_planche_member()
    and exists (
      select 1 from public.programs p
      where p.id = program_id and p.nombre = 'Planche / Front Lever'
    )
  );

drop policy if exists "weeks_delete_planche" on public.weeks;
create policy "weeks_delete_planche" on public.weeks
  for delete to authenticated
  using (
    public.is_planche_member()
    and exists (
      select 1 from public.programs p
      where p.id = program_id and p.nombre = 'Planche / Front Lever'
    )
  );

-- ============================================================
-- 4) workouts (sesiones) · CRUD de sesiones de esos programas
-- ============================================================
drop policy if exists "workouts_insert_planche" on public.workouts;
create policy "workouts_insert_planche" on public.workouts
  for insert to authenticated
  with check (
    public.is_planche_member()
    and exists (
      select 1 from public.weeks w
      join public.programs p on p.id = w.program_id
      where w.id = week_id and p.nombre = 'Planche / Front Lever'
    )
  );

drop policy if exists "workouts_update_planche" on public.workouts;
create policy "workouts_update_planche" on public.workouts
  for update to authenticated
  using (
    public.is_planche_member()
    and exists (
      select 1 from public.weeks w
      join public.programs p on p.id = w.program_id
      where w.id = week_id and p.nombre = 'Planche / Front Lever'
    )
  )
  with check (
    public.is_planche_member()
    and exists (
      select 1 from public.weeks w
      join public.programs p on p.id = w.program_id
      where w.id = week_id and p.nombre = 'Planche / Front Lever'
    )
  );

drop policy if exists "workouts_delete_planche" on public.workouts;
create policy "workouts_delete_planche" on public.workouts
  for delete to authenticated
  using (
    public.is_planche_member()
    and exists (
      select 1 from public.weeks w
      join public.programs p on p.id = w.program_id
      where w.id = week_id and p.nombre = 'Planche / Front Lever'
    )
  );

-- ============================================================
-- 5) workout_exercises · CRUD de ejercicios dentro de esas sesiones
-- ============================================================
drop policy if exists "workout_exercises_insert_planche" on public.workout_exercises;
create policy "workout_exercises_insert_planche" on public.workout_exercises
  for insert to authenticated
  with check (
    public.is_planche_member()
    and exists (
      select 1 from public.workouts wo
      join public.weeks w on w.id = wo.week_id
      join public.programs p on p.id = w.program_id
      where wo.id = workout_id and p.nombre = 'Planche / Front Lever'
    )
  );

drop policy if exists "workout_exercises_update_planche" on public.workout_exercises;
create policy "workout_exercises_update_planche" on public.workout_exercises
  for update to authenticated
  using (
    public.is_planche_member()
    and exists (
      select 1 from public.workouts wo
      join public.weeks w on w.id = wo.week_id
      join public.programs p on p.id = w.program_id
      where wo.id = workout_id and p.nombre = 'Planche / Front Lever'
    )
  )
  with check (
    public.is_planche_member()
    and exists (
      select 1 from public.workouts wo
      join public.weeks w on w.id = wo.week_id
      join public.programs p on p.id = w.program_id
      where wo.id = workout_id and p.nombre = 'Planche / Front Lever'
    )
  );

drop policy if exists "workout_exercises_delete_planche" on public.workout_exercises;
create policy "workout_exercises_delete_planche" on public.workout_exercises
  for delete to authenticated
  using (
    public.is_planche_member()
    and exists (
      select 1 from public.workouts wo
      join public.weeks w on w.id = wo.week_id
      join public.programs p on p.id = w.program_id
      where wo.id = workout_id and p.nombre = 'Planche / Front Lever'
    )
  );

-- ============================================================
-- Verificacion
-- ============================================================
select 'FASE 14 OK' as estado,
  (select count(*) from pg_policies
   where tablename = 'exercises' and policyname = 'exercises_insert_planche') as pol_insert_ejercicio,
  (select count(*) from pg_policies
   where tablename = 'weeks' and policyname like 'weeks_%_planche') as pol_semanas,
  (select count(*) from pg_policies
   where tablename = 'workouts' and policyname like 'workouts_%_planche') as pol_sesiones,
  (select count(*) from pg_policies
   where tablename = 'workout_exercises' and policyname like 'workout_exercises_%_planche') as pol_ejercicios_sesion;