-- ============================================================
-- ATLETIX · COMBOS POWER FREE · Categoría de programa
-- Amplía el check de programs.categoria con el nuevo valor
-- 'power_free' para los programas de Combos / Power Free
-- (planche, front lever, back lever, pistols, L-sit, dinámicos).
-- Sigue el patrón de 0003 y 0005. Idempotente.
-- ============================================================

-- 1) Ampliar el check de programs.categoria
alter table public.programs drop constraint if exists programs_categoria_check;
alter table public.programs add constraint programs_categoria_check
  check (categoria in ('general', 'planche', 'front_lever', 'power_free'));

-- ============================================================
-- Verificación
-- ============================================================
select 'COMBOS POWER FREE OK' as estado,
       (select count(*) from pg_constraint
        where conname = 'programs_categoria_check') as check_categoria,
       (select count(*) from information_schema.columns
        where table_schema = 'public' and table_name = 'programs'
          and column_name = 'categoria') as col_categoria;
