-- ============================================================
-- ATLETIX · Biblioteca de ACCESORIOS DE CALISTENIA · ESQUEMA
-- Requiere 0015 y 0020 corridas.
-- 1) Amplia el check de disciplina con 'Accesorios Calistenia'.
-- 1b) Amplia el check del campo legacy 'tipo' con la nueva disciplina.
-- 2) Cambia la unicidad global de nombre por unicidad (nombre, disciplina),
--    para permitir el mismo ejercicio en disciplinas distintas.
-- 3) Crea indice de apoyo por disciplina/categoria.
-- Idempotente y reversible.
-- ============================================================

-- 1) DISCIPLINA
alter table public.exercises drop constraint if exists exercises_disciplina_check;
alter table public.exercises
  add constraint exercises_disciplina_check
  check (disciplina in ('Calistenia', 'Musculación', 'General', 'Accesorios Calistenia'));

-- 1b) TIPO legacy (debe incluir la nueva disciplina, la app lo usa como espejo)
alter table public.exercises drop constraint if exists exercises_tipo_check;
alter table public.exercises
  add constraint exercises_tipo_check
  check (tipo in ('Calistenia', 'Musculación', 'Core', 'Piernas', 'Accesorios Calistenia'));

-- 2) UNICIDAD (nombre, disciplina) en lugar de nombre solo
alter table public.exercises drop constraint if exists exercises_nombre_key;
alter table public.exercises drop constraint if exists exercises_nombre_disciplina_key;
alter table public.exercises
  add constraint exercises_nombre_disciplina_key unique (nombre, disciplina);

-- 3) INDICE de apoyo
create index if not exists idx_exercises_disciplina_categoria
  on public.exercises (disciplina, categoria);

-- Verificacion rapida
do $acc_schema$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'exercises_nombre_disciplina_key'
  ) then
    raise exception 'No se creo la unicidad (nombre, disciplina)';
  end if;
  raise notice 'ACCESORIOS ESQUEMA OK';
end
$acc_schema$;
