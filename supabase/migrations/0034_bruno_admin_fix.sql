-- ============================================================
-- ATLETIX · BRUNO → ADMIN · FIX: crear perfil si NO existe
-- ============================================================
-- La 0033 solo hacía UPDATE y dio 0 filas → el UPDATE no crea.
-- Esta cubre AMBOS casos (idempotente):
--   · si ya hay fila en profiles → la pasa a admin
--   · si NO hay fila → la CREA como admin (id, email reales)
-- Columnas REALES de profiles (confirmadas por information_schema):
--   id, email, nombre, apellido, telefono, fecha_nacimiento,
--   foto_url, rol, estado, created_at  → NADA de user_id/updated_at
-- UID + email reales de brunosebacampanella@gmail.com:
--   22220000-0000-4000-8000-000000000001
-- ============================================================

do $$
declare
  v uuid := '22220000-0000-4000-8000-000000000001';
begin
  if exists (select 1 from public.profiles where id = v) then
    update public.profiles
       set rol = 'admin'
     where id = v;
    raise notice 'perfil EXISTÍA → Bruno rol admin';
  else
    insert into public.profiles (id, email, rol, estado)
    values (v, 'brunosebacampanella@gmail.com', 'admin', 'activo')
    on conflict (id) do nothing;
    raise notice 'perfil NO existía → Bruno creado como admin';
  end if;
end $$;
