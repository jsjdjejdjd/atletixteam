-- ============================================================
-- ATLETIX · ELIMINAR USUARIO BRUNO (auth + dominio) · definitiva
-- ============================================================
-- Columnas REALES de tu esquema (verificadas en 0001_init.sql):
--   · public.profiles.id   uuid pk (mismo valor que auth.users.id)
--   · public.profiles NO tiene columna user_id  ← el 42703 previo
--   · auth.* user_id es varchar en tu versión → cast ::text
-- Orden FKs: refresh_tokens → sessions → identities →
--            profiles(id) → cascada → auth.users. Idempotente.
-- ============================================================

do $$
declare
  v_uid uuid := '22220000-0000-4000-8000-000000000001';
  v_t   text := '22220000-0000-4000-8000-000000000001';
begin
  -- 1) auth dependencias (user_id en auth es varchar → ::text)
  delete from auth.refresh_tokens where user_id::text = v_t;
  delete from auth.sessions       where user_id::text = v_t;
  delete from auth.identities     where user_id::text = v_t;

  -- 2) dominio → profiles POR id (única columna real; cascada a athletes/logs/combos)
  delete from public.profiles where id = v_uid or id::text = v_t;

  -- 3) auth.users
  delete from auth.users where id = v_uid;

  raise notice 'Bruno: auth + dominio eliminados (o ya no existían).';
end $$;
