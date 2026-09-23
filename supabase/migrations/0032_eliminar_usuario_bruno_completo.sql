-- ============================================================
-- ATLETIX · ELIMINAR USUARIO · BRUNO (auth + dominio) · POR UUID REAL
-- ============================================================
-- Borra definivo, en orden de FKs, con cast a ::text para que no
-- dependa de si auth.user_id es uuid o varchar:
--   1) auth:   refresh_tokens → sessions → identities (user_id)
--   2) dominio: profiles (id o user_id = uid) → cascada total
--   3) auth:   users (id)
-- Idempotente: si el uid no existe, avisa y NO falla.
-- ============================================================

do $$
declare
  v_uid uuid := '22220000-0000-4000-8000-000000000001';
  v_t   text := '22220000-0000-4000-8000-000000000001';
begin
  -- 1) auth · dependencias (columna casteada a text)
  delete from auth.refresh_tokens where user_id::text = v_t;
  delete from auth.sessions       where user_id::text = v_t;
  delete from auth.identities     where user_id::text = v_t;

  -- 2) dominio · profiles (id y user_id son uuid; cascada al resto)
  delete from public.profiles
   where id = v_uid or user_id = v_uid;

  -- 3) auth · users (id es uuid)
  delete from auth.users where id = v_uid;

  raise notice 'Bruno eliminado de auth y dominio (o ya no existía).';
end $$;
