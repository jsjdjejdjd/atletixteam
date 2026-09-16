-- ============================================================
-- ATLETIX · FASE 7 COMPLETA · Ejecutar UNA sola vez
-- Agrega: columna categoria, nivel Elite, y autoselección de programas.
-- No da error si ya se ejecutó antes.
-- ============================================================

-- ---- PARTE 1: Categorías (General / Planche / Front Lever) + Elite ----
alter table public.programs drop column if exists rama;
alter table public.programs drop column if exists especialidad;

alter table public.programs
  add column if not exists categoria text not null default 'general'
    check (categoria in ('general', 'planche', 'front_lever'));

alter table public.programs drop constraint if exists programs_nivel_check;
alter table public.programs add constraint programs_nivel_check
  check (nivel in ('Principiante', 'Intermedio', 'Avanzado', 'Elite', 'Competitivo'));

alter table public.athletes drop constraint if exists athletes_nivel_check;
alter table public.athletes add constraint athletes_nivel_check
  check (nivel in ('Principiante', 'Intermedio', 'Avanzado', 'Elite', 'Competitivo'));

alter table public.exercises drop constraint if exists exercises_dificultad_check;
alter table public.exercises add constraint exercises_dificultad_check
  check (dificultad in ('Principiante', 'Intermedio', 'Avanzado', 'Elite', 'Competitivo'));

-- ---- PARTE 2: el alumno ve todo y elige su programa ----
drop policy if exists "programs_select_all_authenticated" on public.programs;
create policy "programs_select_all_authenticated" on public.programs
  for select to authenticated
  using (true);

drop policy if exists "athletes_insert_own" on public.athletes;
create policy "athletes_insert_own" on public.athletes
  for insert to authenticated
  with check (user_id = auth.uid() and entrenador_id is null);

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
select 'FASE 7 COMPLETA OK' as estado,
       (select count(*) from information_schema.columns
        where table_schema = 'public' and table_name = 'programs' and column_name = 'categoria') as col_categoria,
       (select count(*) from pg_policies where tablename = 'programs' and policyname = 'programs_select_all_authenticated') as pol_programas,
       (select count(*) from pg_policies where tablename = 'athlete_programs' and policyname = 'athlete_programs_insert_own') as pol_autoinscripcion;