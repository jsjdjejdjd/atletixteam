-- ============================================================
-- ATLETIX · PROMOVER A ADMIN/ENTRENADOR · brunosebacampanella@gmail.com
-- ============================================================
-- Por uuid REAL, idempotente, con `where id = v_uid` (única columna
-- de profiles — el 42703 de antes confirmó que SOLO tiene `id`).
-- NO crea el perfil si no existe (no inventa): solo actualiza `rol`.
-- UID: 22220000-0000-4000-8000-000000000001 · uid::text para auth
-- ============================================================

do $$
declare
  v_uid uuid := '22220000-0000-4000-8000-000000000001';
  v_t   text := '22220000-0000-4000-8000-000000000001';
begin
  update public.profiles
     set rol = 'admin'
   where id = v_uid
      or id::text = v_t;

  raise notice 'Bruno → admin (o ya lo era).';
end $$;
