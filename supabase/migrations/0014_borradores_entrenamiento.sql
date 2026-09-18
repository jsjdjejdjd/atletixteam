-- ============================================================
-- ATLETIX · FASE 16 · Borrador de entrenamiento en curso
-- Guarda lo que el alumno va cargando durante el entrenamiento para
-- que NO se pierda si cierra la pestaña, cambia de app o el celular
-- descarta la pagina. Se restaura al volver a entrar (mismo dispositivo
-- o cualquier otro).
--   · Es un borrador por alumno + sesion (se sobrescribe).
--   · Al tocar "Finalizar y guardar" el registro pasa a workout_logs
--     y el borrador se borra.
-- Todo es ADITIVO: no modifica ni borra datos existentes.
-- Pegar en: Supabase → SQL Editor → Run (se puede correr mas de una vez)
-- ============================================================

create table if not exists public.workout_drafts (
  athlete_id  uuid not null references public.profiles (id) on delete cascade,
  workout_id  uuid not null references public.workouts (id) on delete cascade,
  data        jsonb not null default '{}'::jsonb,
  fecha       date,
  updated_at  timestamptz not null default now(),
  primary key (athlete_id, workout_id)
);

drop trigger if exists handle_updated_at_workout_drafts on public.workout_drafts;
create trigger handle_updated_at_workout_drafts before update on public.workout_drafts
  for each row execute procedure moddatetime (updated_at);

alter table public.workout_drafts enable row level security;

drop policy if exists "workout_drafts_select_own" on public.workout_drafts;
create policy "workout_drafts_select_own" on public.workout_drafts
  for select to authenticated
  using (athlete_id = auth.uid() or public.is_admin());

drop policy if exists "workout_drafts_insert_own" on public.workout_drafts;
create policy "workout_drafts_insert_own" on public.workout_drafts
  for insert to authenticated
  with check (athlete_id = auth.uid());

drop policy if exists "workout_drafts_update_own" on public.workout_drafts;
create policy "workout_drafts_update_own" on public.workout_drafts
  for update to authenticated
  using (athlete_id = auth.uid())
  with check (athlete_id = auth.uid());

drop policy if exists "workout_drafts_delete_own" on public.workout_drafts;
create policy "workout_drafts_delete_own" on public.workout_drafts
  for delete to authenticated
  using (athlete_id = auth.uid());

-- ============================================================
-- Verificacion
-- ============================================================
select 'FASE 16 OK' as estado,
  (select count(*) from information_schema.tables
   where table_schema = 'public' and table_name = 'workout_drafts') as tabla,
  (select count(*) from pg_policies
   where tablename = 'workout_drafts') as policies;
