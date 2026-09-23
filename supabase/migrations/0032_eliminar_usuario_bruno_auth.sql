-- ============================================================
-- ATLETIX · BORRAR USUARIO BRUNO · AUTH + DOMINIO (definitivo)
-- ============================================================
-- Idempotente, por UUID real bruno:
--   uid uuid = 22220000-0000-4000-8000-000000000001
-- Orden FKs: auth.refresh_tokens → sessions → identities
--           → profiles (SOLO id, NO tiene user_id) → auth.users
-- Casts ::text en auth (user_id varchar) y profiles.id::text.
-- ============================================================

do $$
declare
  v_uid uuid := '22220000-0000-4000-8000-000000000001';
  v_t   text := '22220000-0000-4000-8000-000000000001';
begin
  -- 1) auth dependencias (user_id es varchar en tu versión)
  delete from auth.refresh_tokens where user_id::text = v_t;
  delete from auth.sessions       where user_id::text = v_t;
  delete from auth.identities     where user_id::text = v_t;

  -- 2) dominio: profiles (SOLO id · user_id NO existe en tu esquema)
  delete from public.profiles where id::text = v_t;

  -- 3) auth.users
  delete from auth.users where id::text = v_t;

  raise notice 'Bruno: dominio + auth eliminados (o ya no existían).';
end $$;
