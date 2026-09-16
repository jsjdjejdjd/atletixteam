-- ============================================================
-- ATLETIX · FASE 9 · Chat alumno ↔ entrenador (seguridad)
-- Ejecutar UNA sola vez en: Supabase → SQL Editor → Run
-- ============================================================

-- Al enviar un mensaje, el remitente debe ser participante de la conversación
drop policy if exists "messages_insert_sender" on public.messages;
create policy "messages_insert_participant" on public.messages
  for insert to authenticated
  with check (
    sender_id = auth.uid()
    and conversation_id in (
      select c.id from public.conversations c
      where c.entrenador_id = auth.uid() or c.alumno_id = auth.uid()
    )
  );

-- Cualquier participante puede marcar como leidos los mensajes de su charla
drop policy if exists "messages_update_participant" on public.messages;
create policy "messages_update_participant" on public.messages
  for update to authenticated
  using (
    conversation_id in (
      select c.id from public.conversations c
      where c.entrenador_id = auth.uid() or c.alumno_id = auth.uid()
    )
  )
  with check (
    conversation_id in (
      select c.id from public.conversations c
      where c.entrenador_id = auth.uid() or c.alumno_id = auth.uid()
    )
  );

-- Índice para las charlas con no leidos
create index if not exists idx_messages_conversation_read
  on public.messages (conversation_id, is_read, created_at desc);

-- ============================================================
-- Verificación
-- ============================================================
select 'FASE 9 OK' as estado,
       (select count(*) from pg_policies where tablename = 'messages' and policyname = 'messages_insert_participant') as pol_insert,
       (select count(*) from pg_policies where tablename = 'messages' and policyname = 'messages_update_participant') as pol_update;