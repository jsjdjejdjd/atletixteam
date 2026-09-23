-- ============================================================
-- ATLETIX · NUEVA CATEGORÍA · 'musculacion'
-- ============================================================
-- Amplía el check de programs.categoria para aceptar 'musculacion'
-- (programas de musculación / gimnasio) además de:
--   general · planche · front_lever · power_free
-- Idempotente e inofensivo: solo reemplaza el check, no toca filas.
-- ============================================================

alter table public.programs drop constraint if exists programs_categoria_check;

alter table public.programs add constraint programs_categoria_check
  check (categoria in ('general', 'planche', 'front_lever', 'power_free', 'musculacion'));

-- Verificación
select categoria, count(*) as total
  from public.programs
 group by categoria
 order by total desc, categoria;
