-- ============================================================
-- ATLETIX · ELIMINAR USUARIO · BRUNO (idempotente, por UUID)
-- ============================================================
-- Borra por id exacto en orden que respeta las FKs:
--   1) auth:   refresh_tokens → sessions → identities
--   2) dominio: profiles (id o user_id = uid) → cascada
--   3) auth:   users
-- Idempotente: si el uid no existe, avisa y no falla.
--
-- TIPEO: auth.user_id es uuid en acceso reciente y varchar en
-- versiones viejas. Para no depender de la versión, comparamos
-- SIEMPRE contra ::text (columna casteada) → no da error de tipos.
-- UID: 22220000-0000-4000-8000-000000000001
-- ============================================================

do $$
declare
  v_uid uuid := '22220000-0000-4000-8000-000000000001';
  v_t   text := '22220000-0000-4000-8000-000000000001';
begin
  -- 1) auth (columna casteada a text → funciona uuid o varchar)
  delete from auth.refresh_tokens where user_id::text = v_t;
  delete from auth.sessions       where user_id::text = v_t;
  delete from auth.identities     where user_id::text = v_t;

  -- 2) dominio: profiles (id, user_id son uuid)
  delete from public.profiles where id = v_uid or user_id = v_uid;

  -- 3) auth.users (id es uuid)
  delete from auth.users where id = v_uid;

  raise notice 'Bruno eliminado (o ya no existía).';
end $$;
