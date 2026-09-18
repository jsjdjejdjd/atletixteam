-- ============================================================
-- ATLETIX · FASE 17 · Esquema de la BIBLIOTECA DE MUSCULACIÓN
-- ------------------------------------------------------------
-- Separa la biblioteca en dos "disciplinas" (Calistenia / Musculación)
-- para que NO se mezclen, y agrega los campos profesionales que pide
-- un coach de gimnasio (músculos, patrón, tipo de ejercicio, tipo de
-- resistencia, unilateral, cadena cinética, objetivo, progresión,
-- regresión, variantes, sustitutos, etc.).
--
-- TODO ES ADITIVO:
--   · No borra ni pisa datos existentes.
--   · Los ejercicios viejos se etiquetan automáticamente como
--     'Calistenia' (o 'Musculación' si ya estaban marcados así).
--   · Se puede correr varias veces sin duplicar nada.
--
-- Pegar en: Supabase → SQL Editor → Run
-- ============================================================

-- ============================================================
-- 1) DISCIPLINA (separa las dos bibliotecas)
-- ============================================================
alter table public.exercises
  add column if not exists disciplina text;

-- ============================================================
-- 2) COLUMNAS NUEVAS DE LA BIBLIOTECA PROFESIONAL
-- ============================================================
alter table public.exercises
  add column if not exists subcategoria           text,
  add column if not exists nombre_en              text,
  add column if not exists musculos_estabilizadores text[],
  add column if not exists tipo_ejercicio         text,
  add column if not exists tipo_resistencia       text,
  add column if not exists unilateral             boolean not null default false,
  add column if not exists cadena_cinetica        text,
  add column if not exists objetivo               text,
  add column if not exists rango_movimiento       text,
  add column if not exists posicion_inicial       text,
  add column if not exists regresion              text,
  add column if not exists variantes              text[],
  add column if not exists sustitutos             text[],
  add column if not exists nivel_dificultad       smallint,
  add column if not exists detalle                jsonb;

-- ============================================================
-- 3) BACKFILL: etiquetar lo que ya existe como Calistenia/Musculación
--    (no pisa valor si ya tiene disciplina)
-- ============================================================
update public.exercises
set disciplina = case
  when tipo = 'Musculación' then 'Musculación'
  when nombre in (
    'Sentadilla goblet',
    'Sentadilla frontal con barra',
    'Sentadilla búlgara con mancuernas',
    'Peso muerto rumano con barra',
    'Caminata del granjero'
  ) then 'Musculación'
  else 'Calistenia'
end
where disciplina is null;

-- ============================================================
-- 4) VALORES VÁLIDOS (checks). Se recrean para ampliar las categorías.
-- ============================================================
alter table public.exercises
  drop constraint if exists exercises_disciplina_check;
alter table public.exercises
  add constraint exercises_disciplina_check
    check (disciplina in ('Calistenia', 'Musculación', 'General'));

alter table public.exercises
  drop constraint if exists exercises_tipo_ejercicio_check;
alter table public.exercises
  add constraint exercises_tipo_ejercicio_check
    check (tipo_ejercicio in ('Compuesto', 'Aislado', 'Accesorio', 'Estabilidad', 'Potencia', 'Movilidad'));

alter table public.exercises
  drop constraint if exists exercises_tipo_resistencia_check;
alter table public.exercises
  add constraint exercises_tipo_resistencia_check
    check (tipo_resistencia in ('Peso corporal', 'Barra', 'Mancuernas', 'Kettlebell', 'Máquina', 'Polea', 'Banda', 'Mixto'));

alter table public.exercises
  drop constraint if exists exercises_cadena_cinetica_check;
alter table public.exercises
  add constraint exercises_cadena_cinetica_check
    check (cadena_cinetica in ('Abierta', 'Cerrada'));

alter table public.exercises
  drop constraint if exists exercises_objetivo_check;
alter table public.exercises
  add constraint exercises_objetivo_check
    check (objetivo in ('Fuerza', 'Hipertrofia', 'Resistencia', 'Potencia', 'Técnica', 'Control corporal'));

alter table public.exercises
  drop constraint if exists exercises_nivel_dificultad_check;
alter table public.exercises
  add constraint exercises_nivel_dificultad_check
    check (nivel_dificultad between 1 and 5);

-- Ampliar PATRONES de movimiento (unión calistenia + musculación)
alter table public.exercises
  drop constraint if exists exercises_patron_check;
alter table public.exercises
  add constraint exercises_patron_check
    check (patron in (
      -- Calistenia (valores originales)
      'Tiro vertical', 'Tiro horizontal', 'Empuje vertical', 'Empuje horizontal',
      'Piernas', 'Carga axial', 'Muscle Up', 'Isometria estatica', 'Movilidad', 'Prehabilitacion',
      -- Tren superior
      'Tirón vertical', 'Tirón horizontal', 'Empuje vertical', 'Empuje horizontal',
      'Elevación', 'Aducción', 'Abducción', 'Rotación interna', 'Rotación externa',
      'Flexión de codo', 'Extensión de codo', 'Flexión de hombro', 'Trabajo de agarre', 'Elevación escapular',
      -- Tren inferior
      'Dominante de rodilla', 'Dominante de cadera', 'Bisagra de cadera', 'Extensión de cadera',
      'Flexión de rodilla', 'Aducción de cadera', 'Abducción de cadera',
      'Flexión plantar', 'Dorsiflexión',
      -- Core
      'Flexión de tronco', 'Extensión de tronco', 'Anti-extensión', 'Rotación',
      'Anti-rotación', 'Flexión lateral', 'Anti-flexión lateral', 'Estabilidad lumbo-pélvica',
      -- Globales
      'Acarreo (carry)', 'Cuerpo completo', 'Potencia'
    ));

-- Ampliar categorías: unión de calistenia + musculación
alter table public.exercises
  drop constraint if exists exercises_categoria_check;
alter table public.exercises
  add constraint exercises_categoria_check
    check (categoria in (
      -- Calistenia
      'Tirón', 'Empuje', 'Piernas', 'Core', 'Planche', 'Front Lever',
      'Muscle Up', 'Handstand', 'Street Lifting', 'Movilidad', 'Prehabilitación',
      -- Musculación
      'Pecho', 'Espalda', 'Hombros', 'Bíceps', 'Tríceps', 'Antebrazos',
      'Cuádriceps', 'Isquiotibiales', 'Glúteos', 'Aductores', 'Abductores',
      'Pantorrillas', 'Tibial anterior', 'Cuerpo completo', 'Accesorios',
      'Prehabilitación y core'
    ));

-- ============================================================
-- 5) ÍNDICES (para que los filtros de ATLETIX sean rápidos)
-- ============================================================
create extension if not exists pg_trgm;

create index if not exists idx_exercises_disciplina      on public.exercises (disciplina);
create index if not exists idx_exercises_subcategoria    on public.exercises (subcategoria);
create index if not exists idx_exercises_categoria       on public.exercises (categoria);
create index if not exists idx_exercises_tipo_ejercicio  on public.exercises (tipo_ejercicio);
create index if not exists idx_exercises_tipo_resistencia on public.exercises (tipo_resistencia);
create index if not exists idx_exercises_equipamiento    on public.exercises (equipamiento);
create index if not exists idx_exercises_unilateral      on public.exercises (unilateral);
create index if not exists idx_exercises_musculos_prim   on public.exercises using gin (musculos_primarios);
create index if not exists idx_exercises_equipamiento_trgm on public.exercises using gin (equipamiento gin_trgm_ops);

-- ============================================================
-- 6) ENRIQUECER los ejercicios de gimnasio que YA existían
--    (no se vuelven a crear para no duplicar; se completan datos)
-- ============================================================
update public.exercises set
  disciplina = 'Musculación',
  categoria = 'Bíceps',
  subcategoria = 'Bíceps braquial',
  tipo_ejercicio = 'Aislado',
  tipo_resistencia = 'Mancuernas',
  patron = 'Flexión de codo',
  musculos_primarios = array['Bíceps braquial'],
  musculos_secundarios = array['Braquial', 'Braquiorradial'],
  objetivo = 'Hipertrofia',
  unilateral = true,
  cadena_cinetica = 'Abierta'
where nombre in ('Curl con mancuernas', 'Curl de concentración');

update public.exercises set
  disciplina = 'Musculación',
  categoria = 'Bíceps',
  subcategoria = 'Braquial / braquiorradial',
  tipo_ejercicio = 'Aislado',
  tipo_resistencia = 'Mancuernas',
  patron = 'Flexión de codo',
  musculos_primarios = array['Braquial', 'Bíceps braquial'],
  musculos_secundarios = array['Braquiorradial'],
  objetivo = 'Hipertrofia',
  unilateral = true,
  cadena_cinetica = 'Abierta'
where nombre = 'Curl martillo';

update public.exercises set disciplina = 'Musculación', categoria = 'Bíceps',
  subcategoria = 'Bíceps braquial', tipo_ejercicio = 'Aislado',
  tipo_resistencia = 'Barra', patron = 'Flexión de codo',
  musculos_primarios = array['Bíceps braquial'], musculos_secundarios = array['Braquial'],
  objetivo = 'Hipertrofia', cadena_cinetica = 'Abierta'
where nombre = 'Curl predicador';

update public.exercises set disciplina = 'Musculación', categoria = 'Antebrazos',
  subcategoria = 'Braquiorradial / flexores', tipo_ejercicio = 'Aislado',
  tipo_resistencia = 'Barra', patron = 'Flexión de codo',
  musculos_primarios = array['Braquiorradial', 'Flexores de muñeca'],
  musculos_secundarios = array['Bíceps braquial'], objetivo = 'Hipertrofia',
  cadena_cinetica = 'Abierta'
where nombre in ('Curl inverso', 'Curl Zottman', 'Curl de muñeca con barra', 'Curl de muñeca inverso');

update public.exercises set disciplina = 'Musculación', categoria = 'Tríceps',
  subcategoria = 'Tríceps (cabeza lateral/medial)', tipo_ejercicio = 'Aislado',
  tipo_resistencia = 'Polea', patron = 'Extensión de codo',
  musculos_primarios = array['Tríceps braquial'],
  objetivo = 'Hipertrofia', cadena_cinetica = 'Abierta'
where nombre = 'Extensión de tríceps en polea';

update public.exercises set disciplina = 'Musculación', categoria = 'Tríceps',
  subcategoria = 'Tríceps (cabeza larga)', tipo_ejercicio = 'Aislado',
  tipo_resistencia = 'Barra', patron = 'Extensión de codo',
  musculos_primarios = array['Tríceps braquial'], objetivo = 'Hipertrofia',
  cadena_cinetica = 'Abierta'
where nombre in ('Press francés', 'Extensión de tríceps sobre cabeza');

update public.exercises set disciplina = 'Musculación', categoria = 'Tríceps',
  subcategoria = 'Tríceps (cabeza lateral)', tipo_ejercicio = 'Aislado',
  tipo_resistencia = 'Mancuernas', patron = 'Extensión de codo',
  musculos_primarios = array['Tríceps braquial'], objetivo = 'Hipertrofia',
  unilateral = true, cadena_cinetica = 'Abierta'
where nombre = 'Patada de tríceps';

update public.exercises set disciplina = 'Musculación', categoria = 'Tríceps',
  subcategoria = 'Tríceps (cabeza medial)', tipo_ejercicio = 'Compuesto',
  tipo_resistencia = 'Peso corporal', patron = 'Extensión de codo',
  musculos_primarios = array['Tríceps braquial'],
  musculos_secundarios = array['Pectoral mayor', 'Deltoides anterior'],
  objetivo = 'Hipertrofia', cadena_cinetica = 'Cerrada'
where nombre = 'Fondo de tríceps en banco';

update public.exercises set disciplina = 'Musculación', categoria = 'Tríceps',
  subcategoria = 'Tríceps + pecho (agarre cerrado)', tipo_ejercicio = 'Compuesto',
  tipo_resistencia = 'Barra', patron = 'Empuje horizontal',
  musculos_primarios = array['Tríceps braquial', 'Pectoral mayor'],
  musculos_secundarios = array['Deltoides anterior'], objetivo = 'Fuerza',
  cadena_cinetica = 'Abierta'
where nombre = 'Press de banca agarre cerrado';

update public.exercises set disciplina = 'Musculación', categoria = 'Antebrazos',
  subcategoria = 'Fuerza de agarre', tipo_ejercicio = 'Estabilidad',
  tipo_resistencia = 'Peso corporal', patron = 'Trabajo de agarre',
  musculos_primarios = array['Flexores de los dedos'],
  musculos_secundarios = array['Dorsal ancho'],
  objetivo = 'Fuerza', cadena_cinetica = 'Cerrada'
where nombre = 'Colgado de barra';

update public.exercises set disciplina = 'Musculación', categoria = 'Cuerpo completo',
  subcategoria = 'Acarreo / agarre', tipo_ejercicio = 'Compuesto',
  tipo_resistencia = 'Mancuernas', patron = 'Acarreo (carry)',
  musculos_primarios = array['Trapecio', 'Flexores de los dedos'],
  musculos_secundarios = array['Antebrazos', 'Core', 'Glúteo mayor', 'Cuádriceps'],
  musculos_estabilizadores = array['Erectores espinales', 'Oblicuos'],
  objetivo = 'Fuerza', unilateral = false, cadena_cinetica = 'Cerrada'
where nombre = 'Caminata del granjero';

update public.exercises set disciplina = 'Musculación', categoria = 'Cuádriceps',
  subcategoria = 'Cuádriceps (general)', tipo_ejercicio = 'Compuesto',
  tipo_resistencia = 'Mancuernas', patron = 'Dominante de rodilla',
  musculos_primarios = array['Cuádriceps'], musculos_secundarios = array['Glúteo mayor', 'Aductores'],
  musculos_estabilizadores = array['Erectores espinales'],
  objetivo = 'Hipertrofia', cadena_cinetica = 'Cerrada'
where nombre = 'Sentadilla goblet';

update public.exercises set disciplina = 'Musculación', categoria = 'Cuádriceps',
  subcategoria = 'Cuádriceps (general)', tipo_ejercicio = 'Compuesto',
  tipo_resistencia = 'Barra', patron = 'Dominante de rodilla',
  musculos_primarios = array['Cuádriceps'], musculos_secundarios = array['Glúteo mayor', 'Erectores espinales'],
  objetivo = 'Fuerza', cadena_cinetica = 'Cerrada'
where nombre = 'Sentadilla frontal con barra';

update public.exercises set disciplina = 'Musculación', categoria = 'Isquiotibiales',
  subcategoria = 'Bíceps femoral / semitendinoso', tipo_ejercicio = 'Compuesto',
  tipo_resistencia = 'Barra', patron = 'Bisagra de cadera',
  musculos_primarios = array['Isquiotibiales'], musculos_secundarios = array['Glúteo mayor', 'Erectores espinales'],
  objetivo = 'Hipertrofia', cadena_cinetica = 'Cerrada'
where nombre = 'Peso muerto rumano con barra';

update public.exercises set disciplina = 'Musculación', categoria = 'Cuádriceps',
  subcategoria = 'Cuádriceps + glúteo (unilateral)', tipo_ejercicio = 'Compuesto',
  tipo_resistencia = 'Mancuernas', patron = 'Dominante de rodilla',
  musculos_primarios = array['Cuádriceps', 'Glúteo mayor'],
  musculos_secundarios = array['Isquiotibiales', 'Aductores'],
  musculos_estabilizadores = array['Glúteo medio', 'Core'],
  objetivo = 'Hipertrofia', unilateral = true, cadena_cinetica = 'Cerrada'
where nombre = 'Sentadilla búlgara con mancuernas';

-- ============================================================
-- 7) TABLA DE APOYO: etiquetas libres (para escalar sin migrar)
-- ============================================================
create table if not exists public.exercise_tags (
  id          uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercises (id) on delete cascade,
  tag         text not null,
  created_at  timestamptz not null default now(),
  unique (exercise_id, tag)
);

alter table public.exercise_tags enable row level security;

drop policy if exists "exercise_tags_select_auth" on public.exercise_tags;
create policy "exercise_tags_select_auth" on public.exercise_tags for select
  using (exists (select 1 from public.exercises e where e.id = exercise_id and (e.activo or public.is_admin())));

drop policy if exists "exercise_tags_write_admin" on public.exercise_tags;
create policy "exercise_tags_write_admin" on public.exercise_tags for all
  using (public.is_admin()) with check (public.is_admin());

create index if not exists idx_exercise_tags_tag on public.exercise_tags (tag);
create index if not exists idx_exercise_tags_exercise on public.exercise_tags (exercise_id);

-- ============================================================
-- Verificación
-- ============================================================
select 'FASE 17 OK' as estado,
  (select count(*) from information_schema.columns
     where table_schema = 'public' and table_name = 'exercises') as columnas_exercises,
  (select count(*) from public.exercises where disciplina = 'Calistenia') as calistenia,
  (select count(*) from public.exercises where disciplina = 'Musculación') as musculacion,
  (select count(*) from information_schema.tables
     where table_schema = 'public' and table_name = 'exercise_tags') as tabla_tags;
