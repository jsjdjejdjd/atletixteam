-- ============================================================
-- ATLETIX · FASE 7b · Autoselección de programas por el alumno
-- Se puede ejecutar más de una vez sin errores.
-- ============================================================

-- Cualquier alumno autenticado puede ver TODOS los programas
drop policy if exists "programs_select_all_authenticated" on public.programs;
create policy "programs_select_all_authenticated" on public.programs
  for select to authenticated
  using (true);

-- Un alumno puede crear su propia ficha al entrar a un programa
drop policy if exists "athletes_insert_own" on public.athletes;
create policy "athletes_insert_own" on public.athletes
  for insert to authenticated
  with check (user_id = auth.uid() and entrenador_id is null);

-- Un alumno se puede inscribir en programas por su cuenta
drop policy if exists "athlete_programs_insert_own" on public.athlete_programs;
create policy "athlete_programs_insert_own" on public.athlete_programs
  for insert to authenticated
  with check (
    athlete_id in (
      select a.id from public.athletes a where a.user_id = auth.uid()
    )
  );

drop policy if exists "athlete_programs_update_own" on public.athlete_programs;
create policy "athlete_programs_update_own" on public.athlete_programs
  for update to authenticated
  using (
    athlete_id in (
      select a.id from public.athletes a where a.user_id = auth.uid()
    )
  )
  with check (
    athlete_id in (
      select a.id from public.athletes a where a.user_id = auth.uid()
    )
  );

-- ============================================================
-- Verificación
-- ============================================================
select 'FASE 7b OK' as estado,
       (select count(*) from pg_policies where tablename = 'programs' and policyname = 'programs_select_all_authenticated') as pol_programas,
       (select count(*) from pg_policies where tablename = 'athlete_programs' and policyname = 'athlete_programs_insert_own') as pol_autoinscripcion;