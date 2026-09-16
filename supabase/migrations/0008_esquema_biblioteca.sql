-- ============================================================
-- ATLETIX · FASE 12 · Esquema de la biblioteca profesional
-- Todo es ADITIVO: no modifica ni elimina nada existente.
-- Pegar en: Supabase → SQL Editor → Run (se puede correr 1 vez)
-- ============================================================

-- ============================================================
-- 1) EXTENDER exercises con 23 columnas nuevas (todas opcionales)
-- ============================================================
alter table public.exercises
  add column if not exists aliases             text,
  add column if not exists patron              text,
  add column if not exists agarre              text,
  add column if not exists agarre_ancho        text,
  add column if not exists empenaje_tipo       text,
  add column if not exists musculos_primarios  text[],
  add column if not exists musculos_secundarios text[],
  add column if not exists demanda_fuerza      smallint,
  add column if not exists demanda_estabilidad smallint,
  add column if not exists demanda_movilidad   smallint,
  add column if not exists series_sugeridas    smallint,
  add column if not exists reps_sugeridas      text,
  add column if not exists descanso_seg        smallint,
  add column if not exists tempo               text,
  add column if not exists rir_sugerido        smallint,
  add column if not exists rpe_sugerido        smallint,
  add column if not exists costo_fatiga        smallint,
  add column if not exists biomecanica         text,
  add column if not exists criterio_progresion text,
  add column if not exists detener_si          text,
  add column if not exists precauciones        text,
  add column if not exists evidencia           text,
  add column if not exists fuentes             text;

-- Restricciones de valores válidos (check) sobre las columnas nuevas
alter table public.exercises
  add constraint exercises_patron_check
    check (patron in ('Tiro vertical', 'Tiro horizontal', 'Empuje vertical', 'Empuje horizontal',
                      'Piernas', 'Carga axial', 'Muscle Up', 'Isometria estatica', 'Movilidad', 'Prehabilitacion'))
    not valid,
  add constraint exercises_agarre_check
    check (agarre in ('prono', 'supino', 'neutro', 'mixto', 'otro'))
    not valid,
  add constraint exercises_agarre_ancho_check
    check (agarre_ancho in ('ancho', 'hombros', 'estrecho', 'otro'))
    not valid,
  add constraint exercises_empenaje_check
    check (empenaje_tipo in ('peso corporal', 'lastre', 'banda', 'pesa', 'cinturon'))
    not valid,
  add constraint exercises_demanda_fuerza_check
    check (demanda_fuerza between 1 and 10)
    not valid,
  add constraint exercises_demanda_estabilidad_check
    check (demanda_estabilidad between 1 and 10)
    not valid,
  add constraint exercises_demanda_movilidad_check
    check (demanda_movilidad between 1 and 10)
    not valid,
  add constraint exercises_rir_check
    check (rir_sugerido between 0 and 4)
    not valid,
  add constraint exercises_rpe_check
    check (rpe_sugerido between 6 and 10)
    not valid,
  add constraint exercises_costo_fatiga_check
    check (costo_fatiga between 1 and 5)
    not valid,
  add constraint exercises_evidencia_check
    check (evidencia in ('ALTA', 'MODERADA', 'LIMITADA', 'PRACTICA', 'SIN_EVIDENCIA'))
    not valid;

alter table public.exercises
  validate constraint exercises_patron_check,
  validate constraint exercises_agarre_check,
  validate constraint exercises_agarre_ancho_check,
  validate constraint exercises_empenaje_check,
  validate constraint exercises_demanda_fuerza_check,
  validate constraint exercises_demanda_estabilidad_check,
  validate constraint exercises_demanda_movilidad_check,
  validate constraint exercises_rir_check,
  validate constraint exercises_rpe_check,
  validate constraint exercises_costo_fatiga_check,
  validate constraint exercises_evidencia_check;

-- ============================================================
-- 2) TABLA NUEVA: exercise_progression (pasos de escalera)
-- ============================================================
create table if not exists public.exercise_progression (
  id              uuid primary key default gen_random_uuid(),
  exercise_id     uuid not null references public.exercises (id) on delete cascade,
  orden           integer not null default 0,
  tipo            text not null default 'progresion'
                  check (tipo in ('progresion', 'regresion', 'variante', 'alternativa', 'complementaria')),
  paso_nombre     text not null,
  paso_descripcion text,
  criterio        text,
  created_at      timestamptz not null default now(),
  unique (exercise_id, orden)
);

-- ============================================================
-- 3) TABLA NUEVA: exercise_sources (referencias verificadas)
-- ============================================================
create table if not exists public.exercise_sources (
  id              uuid primary key default gen_random_uuid(),
  exercise_id     uuid not null references public.exercises (id) on delete cascade,
  autor           text,
  titulo          text not null,
  tipo            text check (tipo in ('estudio', 'metaanalisis', 'libro', 'reglamento', 'guia')),
  url             text,
  anio            integer,
  evidencia       text check (evidencia in ('ALTA', 'MODERADA', 'LIMITADA', 'PRACTICA', 'SIN_EVIDENCIA')),
  created_at      timestamptz not null default now(),
  unique (exercise_id, titulo)
);

-- ============================================================
-- 4) ÍNDICES
-- ============================================================
create index if not exists idx_exercise_progression_exercise on public.exercise_progression (exercise_id, orden);
create index if not exists idx_exercise_sources_exercise on public.exercise_sources (exercise_id);
create index if not exists idx_exercises_patron on public.exercises (patron);
create index if not exists idx_exercises_agarre on public.exercises (agarre);

-- ============================================================
-- 5) SEGURIDAD RLS (igual patrón que exercises: lectura auth, escritura admin)
-- ============================================================
alter table public.exercise_progression enable row level security;

create policy "exercise_progression_select_auth"
  on public.exercise_progression for select
  using (
    exists (
      select 1 from public.exercises e
      where e.id = exercise_id and (e.activo = true or public.is_admin())
    )
  );

create policy "exercise_progression_insert_admin"
  on public.exercise_progression for insert
  with check (public.is_admin());

create policy "exercise_progression_update_admin"
  on public.exercise_progression for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "exercise_progression_delete_admin"
  on public.exercise_progression for delete
  using (public.is_admin());

alter table public.exercise_sources enable row level security;

create policy "exercise_sources_select_auth"
  on public.exercise_sources for select
  using (
    exists (
      select 1 from public.exercises e
      where e.id = exercise_id and (e.activo = true or public.is_admin())
    )
  );

create policy "exercise_sources_insert_admin"
  on public.exercise_sources for insert
  with check (public.is_admin());

create policy "exercise_sources_update_admin"
  on public.exercise_sources for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "exercise_sources_delete_admin"
  on public.exercise_sources for delete
  using (public.is_admin());

-- ============================================================
-- Verificación
-- ============================================================
select 'FASE 12 OK' as estado,
  (select count(*) from information_schema.columns
   where table_schema = 'public' and table_name = 'exercises') as columnas_exercises,
  (select count(*) from information_schema.tables
   where table_schema = 'public' and table_name = 'exercise_progression') as tabla_progresiones,
  (select count(*) from information_schema.tables
   where table_schema = 'public' and table_name = 'exercise_sources') as tabla_fuentes;