-- ============================================================
-- ATLETIX · FASE 5 · Videos + Sugerencias de progresión
-- Ejecutar UNA sola vez en: Supabase → SQL Editor → Run
-- ============================================================

-- 1) Bucket público para los videos de los alumnos
insert into storage.buckets (id, name, public)
values ('videos', 'videos', true)
on conflict (id) do update set public = true;

-- 2) Columna para que el entrenador deje sugerencias de progresión
alter table public.workout_exercises
  add column if not exists sugerencia_progresion text;

-- 3) Políticas de seguridad para los videos
create policy "storage_videos_insert_own_or_admin" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'videos'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
    )
  );

create policy "storage_videos_select_own_or_admin" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'videos'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
    )
  );

create policy "storage_videos_update_own_or_admin" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'videos'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
    )
  );

create policy "storage_videos_delete_own_or_admin" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'videos'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
    )
  );

-- ============================================================
-- Verificación rápida
-- ============================================================
select 'FASE 5 OK' as estado,
       (select count(*) from storage.buckets where id = 'videos') as bucket_videos,
       (select count(*) from information_schema.columns
        where table_schema = 'public' and table_name = 'workout_exercises'
          and column_name = 'sugerencia_progresion') as columna_sugerencia;