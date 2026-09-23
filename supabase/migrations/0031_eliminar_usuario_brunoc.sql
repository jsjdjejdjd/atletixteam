-- ============================================================
-- ATLETIX · ELIMINAR USUARIO · BRUNO (idempotente, por UUID)
-- ============================================================
-- Borra por id exacto, en orden que respeta las FKs:
--   1) auth:  refresh_tokens → sessions → identities
--   2) dominio: profiles (id = uid, o user_id = uid) → cascada
--   3) auth:  users
-- Idempotente: si el uid no existe, avisa y no falla.
-- UID: 22220000-0000-4000-8000-000000000001
-- ============================================================

do $$
declare
  v_uid uuid := '22220000-0000-4000-8000-000000000001';
begin
  -- 1) auth dependencias (delete silencioso si no hay filas)
  delete from auth.refresh_tokens where user_id = v_uid::text;
  delete from auth.sessions     where user_id = v_uid::text;
  delete from auth.identities   where user_id = v_uid::text;

  -- 2) dominio: profiles → cascada a athletes/logs/combos
  delete from public.profiles
   where id = v_uid or user_id = v_uid;

  -- 3) el usuario de auth
  delete from auth.users where id = v_uid;

  raise notice 'Bruno eliminado (o ya no existía).';
end $$;
