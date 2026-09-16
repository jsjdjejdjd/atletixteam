-- ============================================================
-- ATLETIX · FASE 7 · Categorías de programas (General / Planche / Front Lever) + nivel Elite
-- Ejecutar UNA sola vez en: Supabase → SQL Editor → Run
-- ============================================================

-- Si por error ya existieran las columnas de "rama", se eliminan
alter table public.programs drop column if exists rama;
alter table public.programs drop column if exists especialidad;

-- Categoría del programa
alter table public.programs
  add column if not exists categoria text not null default 'general'
    check (categoria in ('general', 'planche', 'front_lever'));

-- Nivel Elite sumado a los niveles válidos (se mantiene Competitivo por compatibilidad)
alter table public.programs drop constraint if exists programs_nivel_check;
alter table public.programs add constraint programs_nivel_check
  check (nivel in ('Principiante', 'Intermedio', 'Avanzado', 'Elite', 'Competitivo'));

alter table public.athletes drop constraint if exists athletes_nivel_check;
alter table public.athletes add constraint athletes_nivel_check
  check (nivel in ('Principiante', 'Intermedio', 'Avanzado', 'Elite', 'Competitivo'));

alter table public.exercises drop constraint if exists exercises_dificultad_check;
alter table public.exercises add constraint exercises_dificultad_check
  check (dificultad in ('Principiante', 'Intermedio', 'Avanzado', 'Elite', 'Competitivo'));

-- ============================================================
-- Verificación
-- ============================================================
select 'FASE 7 OK' as estado,
       (select count(*) from information_schema.columns
        where table_schema = 'public' and table_name = 'programs' and column_name = 'categoria') as col_categoria;