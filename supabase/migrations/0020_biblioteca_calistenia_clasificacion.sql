-- ============================================================
-- ATLETIX · FASE 18 · CLASIFICACION JERARQUICA DE CALISTENIA
-- ------------------------------------------------------------
-- Reorganiza los 252 ejercicios de Calistenia en la estructura:
--   CATEGORIA (7): Empuje / Tiron / Core / Piernas / Skills / Dinamicos / Agarre
--   + subcategoria, movement_type, skill, muscle_group, objetivo
--   + estado_clasificacion, duplicado_de, progresion_de
--
-- NO borra ni duplica nada:
--   · Guarda la categoria vieja en 'categoria_anterior' (reversible).
--   · Los duplicados NO se borran: se marcan con 'duplicado_de'.
--   · Las entradas que no son ejercicios (combos, "a eleccion") quedan
--     con estado_clasificacion = 'revisar'.
--
-- Pegar en: Supabase -> SQL Editor -> Run
-- ============================================================

-- 1) COLUMNAS NUEVAS
alter table public.exercises
  add column if not exists movement_type        text,
  add column if not exists skill                text,
  add column if not exists muscle_group         text,
  add column if not exists estado_clasificacion text not null default 'clasificado',
  add column if not exists categoria_anterior   text,
  add column if not exists duplicado_de         uuid references public.exercises (id) on delete set null,
  add column if not exists progresion_de        uuid references public.exercises (id) on delete set null;

-- 2) CHECKS
alter table public.exercises drop constraint if exists exercises_movement_type_check;
alter table public.exercises add constraint exercises_movement_type_check
  check (movement_type in ('Isométrico', 'Dinámico', 'Fuerza', 'Explosivo', 'Excéntrico', 'Técnica', 'Movilidad', 'Accesorio'));

alter table public.exercises drop constraint if exists exercises_estado_clasificacion_check;
alter table public.exercises add constraint exercises_estado_clasificacion_check
  check (estado_clasificacion in ('clasificado', 'revisar'));

alter table public.exercises drop constraint if exists exercises_categoria_check;
alter table public.exercises add constraint exercises_categoria_check
  check (categoria in (
    -- Calistenia (nuevas)
    'Empuje', 'Tirón', 'Core', 'Piernas', 'Skills', 'Dinámicos', 'Agarre',
    -- Calistenia (historicas, por compatibilidad)
    'Planche', 'Front Lever', 'Muscle Up', 'Handstand', 'Street Lifting', 'Movilidad', 'Prehabilitación',
    -- Musculacion
    'Pecho', 'Espalda', 'Hombros', 'Bíceps', 'Tríceps', 'Antebrazos',
    'Cuádriceps', 'Isquiotibiales', 'Glúteos', 'Aductores', 'Abductores',
    'Pantorrillas', 'Tibial anterior', 'Cuerpo completo', 'Accesorios',
    'Prehabilitación y core'
  ));

alter table public.exercises drop constraint if exists exercises_objetivo_check;
alter table public.exercises add constraint exercises_objetivo_check
  check (objetivo in ('Fuerza', 'Hipertrofia', 'Resistencia', 'Potencia', 'Técnica', 'Control corporal', 'Skill', 'Movilidad'));

-- 3) BACKUP de la categoria vieja (solo Calistenia, sin pisar si ya se corrio)
update public.exercises
set categoria_anterior = categoria
where disciplina = 'Calistenia' and categoria_anterior is null;

-- 4) MAPA DE RECLASIFICACION
drop table if exists _mapa_cal;
create temporary table _mapa_cal (
  nombre text primary key, categoria text, subcategoria text, movement_type text,
  skill text, muscle_group text, objetivo text, estado text, duplicado_de text, progresion_de text
);

insert into _mapa_cal (nombre, categoria, subcategoria, movement_type, skill, muscle_group, objetivo, estado, duplicado_de, progresion_de) values
  ('5 toques de barra + L sit + 5 elevaciones en barra', 'Core', 'Revisar', 'Técnica', null, 'Core', 'Técnica', 'revisar', null, null),
  ('90 Degree push up', 'Empuje', 'Empuje vertical', 'Dinámico', '90 Degree', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Abdominal bicicleta', 'Core', 'Rotación', 'Dinámico', null, 'Core', 'Fuerza', 'clasificado', null, null),
  ('Abdominal en polea de rodillas', 'Core', 'Flexión de tronco', 'Dinámico', null, 'Core', 'Hipertrofia', 'clasificado', null, null),
  ('Advanced Tuck Planche', 'Empuje', 'Planche', 'Isométrico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, 'Tuck Planche'),
  ('Aguante en L sit o rodillas a 90°', 'Core', 'Compresión', 'Isométrico', 'L-Sit', 'Core', 'Fuerza', 'clasificado', null, null),
  ('Aguantes con agarre falso (anillas o barra)', 'Agarre', 'Colgados', 'Isométrico', null, 'Antebrazo', 'Fuerza', 'clasificado', null, null),
  ('Aguantes en fondos con depresión de hombros', 'Empuje', 'Fondos', 'Isométrico', null, 'Tríceps', 'Fuerza', 'clasificado', null, null),
  ('Azarian', 'Empuje', 'Estáticos avanzados', 'Isométrico', 'Azarian', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Back Lever a un brazo', 'Tirón', 'Back Lever', 'Isométrico', 'Back Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Back Lever a una pierna', 'Tirón', 'Back Lever', 'Isométrico', 'Back Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Back lever a una pierna press', 'Tirón', 'Back Lever', 'Dinámico', 'Back Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Back lever a una pierna pull up', 'Tirón', 'Back Lever', 'Dinámico', 'Back Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Back Lever Full', 'Tirón', 'Back Lever', 'Isométrico', 'Back Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Back Lever Full Wide', 'Tirón', 'Back Lever', 'Isométrico', 'Back Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Back Lever Hefesto', 'Tirón', 'Back Lever', 'Dinámico', 'Back Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Back Lever Hefesto Cripta', 'Tirón', 'Back Lever', 'Dinámico', 'Back Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Back Lever press', 'Tirón', 'Back Lever', 'Dinámico', 'Back Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Back Lever pull up', 'Tirón', 'Back Lever', 'Dinámico', 'Back Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Back Lever Pull Up Cripta', 'Tirón', 'Back Lever', 'Dinámico', 'Back Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Back Lever pull up to touch', 'Tirón', 'Back Lever', 'Dinámico', 'Back Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Back Lever SAT', 'Tirón', 'Back Lever', 'Dinámico', 'Back Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Back Lever Straddle', 'Tirón', 'Back Lever', 'Isométrico', 'Back Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Back Lever Straddle press', 'Tirón', 'Back Lever', 'Dinámico', 'Back Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Back Lever Straddle pull up', 'Tirón', 'Back Lever', 'Dinámico', 'Back Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Back Lever Straight arm PU to touch', 'Tirón', 'Back Lever', 'Dinámico', 'Back Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Back Lever Straight arm Pull Up', 'Tirón', 'Back Lever', 'Dinámico', 'Back Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Back Lever Touch', 'Tirón', 'Back Lever', 'Dinámico', 'Back Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Back Lever tuck adv. press', 'Tirón', 'Back Lever', 'Dinámico', 'Back Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Back Lever tuck adv. pull up', 'Tirón', 'Back Lever', 'Dinámico', 'Back Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Back Lever tuck press', 'Tirón', 'Back Lever', 'Dinámico', 'Back Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Back Lever tuck pull up', 'Tirón', 'Back Lever', 'Dinámico', 'Back Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Back Lever Wide', 'Tirón', 'Back Lever', 'Isométrico', 'Back Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Back pull up to touch cripta', 'Tirón', 'Fuerza de tirón', 'Accesorio', null, 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Back Tuck', 'Core', 'Revisar', 'Técnica', null, 'Core', 'Técnica', 'revisar', null, null),
  ('Bruja Full', 'Empuje', 'Estáticos avanzados', 'Dinámico', 'Bruja/Iguana', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Bruja/Iguana Straddle', 'Empuje', 'Estáticos avanzados', 'Dinámico', 'Bruja/Iguana', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Caminata a vertical en pared', 'Skills', 'Handstand', 'Dinámico', 'Handstand', 'Hombros', 'Skill', 'clasificado', null, null),
  ('Caruso', 'Core', 'Flexión de tronco', 'Dinámico', null, 'Core', 'Hipertrofia', 'clasificado', null, null),
  ('Cross Press', 'Empuje', 'Estáticos avanzados', 'Dinámico', 'Cross Press', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Crunch', 'Core', 'Flexión de tronco', 'Dinámico', null, 'Core', 'Hipertrofia', 'clasificado', null, null),
  ('crunch con peso', 'Core', 'Flexión de tronco', 'Dinámico', null, 'Core', 'Hipertrofia', 'clasificado', null, null),
  ('Crunch inverso', 'Core', 'Elevación de piernas', 'Dinámico', null, 'Core', 'Fuerza', 'clasificado', null, null),
  ('Curl de bíceps + rompecráneos', 'Tirón', 'Bíceps / accesorios', 'Accesorio', null, 'Bíceps', 'Hipertrofia', 'revisar', null, null),
  ('Curl de bíceps en anillas', 'Tirón', 'Bíceps / accesorios', 'Accesorio', null, 'Bíceps', 'Hipertrofia', 'clasificado', null, null),
  ('Curl de bíceps en anillas + curl martillo con rotaciones', 'Tirón', 'Bíceps / accesorios', 'Accesorio', null, 'Bíceps', 'Hipertrofia', 'revisar', null, null),
  ('Dead Push up', 'Empuje', 'Empuje vertical', 'Dinámico', '90 Degree', 'Hombros', 'Fuerza', 'revisar', null, null),
  ('Dips supinos con hollow', 'Empuje', 'Fondos', 'Dinámico', null, 'Tríceps', 'Fuerza', 'clasificado', null, null),
  ('Dominada anillas', 'Tirón', 'Dominadas', 'Dinámico', null, 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Dominada arquera', 'Tirón', 'Dominadas', 'Dinámico', null, 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Dominada lastrada anillas', 'Tirón', 'Dominadas', 'Dinámico', null, 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Dominada lastrada prono', 'Tirón', 'Dominadas', 'Dinámico', null, 'Espalda', 'Fuerza', 'clasificado', 'Dominadas lastradas', null),
  ('Dominada lastrada supino', 'Tirón', 'Dominadas', 'Dinámico', null, 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Dominada prono', 'Tirón', 'Dominadas', 'Dinámico', null, 'Espalda', 'Fuerza', 'clasificado', 'Dominadas', null),
  ('Dominada semi supino', 'Tirón', 'Dominadas', 'Dinámico', null, 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Dominada supino', 'Tirón', 'Dominadas', 'Dinámico', null, 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Dominadas', 'Tirón', 'Dominadas', 'Dinámico', null, 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Dominadas asistidas con goma', 'Tirón', 'Dominadas', 'Dinámico', null, 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Dominadas lastradas', 'Tirón', 'Dominadas', 'Dinámico', null, 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Dominadas lastradas / transiciones muscle up', 'Dinámicos', 'Muscle Up', 'Dinámico', 'Muscle Up', 'Cuerpo completo', 'Skill', 'revisar', null, null),
  ('Dominadas lastradas supinas', 'Tirón', 'Dominadas', 'Dinámico', null, 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Dragon Flag', 'Core', 'Anti-extensión', 'Dinámico', 'Dragon Flag', 'Core', 'Fuerza', 'clasificado', null, null),
  ('Dragon flag (tuck avanzado o full)', 'Core', 'Anti-extensión', 'Dinámico', 'Dragon Flag', 'Core', 'Fuerza', 'clasificado', null, null),
  ('Dragon Press', 'Empuje', 'Estáticos avanzados', 'Dinámico', 'Dragon Press', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Elbow Plancha a un brazo', 'Empuje', 'Planche', 'Isométrico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Elbow Plancha Straddle', 'Empuje', 'Planche', 'Isométrico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', 'Plancha Antebrazos Straddle', null),
  ('Elbow Planche Full', 'Empuje', 'Planche', 'Isométrico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', 'Plancha Antebrazos Full', null),
  ('Elbow Planche Straddle a un brazo', 'Empuje', 'Planche', 'Isométrico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Elevación de talones de pie', 'Piernas', 'Pantorrillas', 'Dinámico', null, 'Pantorrillas', 'Hipertrofia', 'clasificado', null, null),
  ('Elevaciones de piernas colgado', 'Core', 'Elevación de piernas', 'Dinámico', null, 'Core', 'Fuerza', 'clasificado', null, null),
  ('Elevaciones de piernas o rodillas en barra + aguantes L', 'Core', 'Elevación de piernas', 'Isométrico', null, 'Core', 'Fuerza', 'revisar', null, null),
  ('Elevaciones de rodillas colgado', 'Core', 'Elevación de piernas', 'Dinámico', null, 'Core', 'Fuerza', 'clasificado', null, null),
  ('Elevaciones frontales supinas + laterales', 'Empuje', 'Accesorios de empuje', 'Dinámico', null, 'Hombros', 'Hipertrofia', 'revisar', null, null),
  ('Entrada de angel', 'Empuje', 'Estáticos avanzados', 'Dinámico', 'Ángel', 'Hombros', 'Skill', 'clasificado', null, null),
  ('Flag a un brazo / OA Flag', 'Skills', 'Human Flag', 'Isométrico', 'Human Flag', 'Core', 'Fuerza', 'clasificado', null, null),
  ('Flexión arquera', 'Empuje', 'Empuje horizontal', 'Dinámico', null, 'Pecho', 'Fuerza', 'clasificado', null, null),
  ('Flexión de pecho', 'Empuje', 'Empuje horizontal', 'Dinámico', null, 'Pecho', 'Fuerza', 'clasificado', null, null),
  ('Flexión de pino', 'Empuje', 'Empuje vertical', 'Dinámico', 'Handstand', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Flexión diamante', 'Empuje', 'Empuje horizontal', 'Dinámico', null, 'Pecho', 'Fuerza', 'clasificado', null, null),
  ('Flexión inclinada', 'Empuje', 'Empuje horizontal', 'Dinámico', null, 'Pecho', 'Fuerza', 'clasificado', null, null),
  ('Flexión pike', 'Empuje', 'Empuje vertical', 'Dinámico', null, 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Flexiones en barra media o suelo', 'Empuje', 'Empuje horizontal', 'Dinámico', null, 'Pecho', 'Fuerza', 'clasificado', null, null),
  ('Flexiones pronas en anillas con rotación', 'Empuje', 'Empuje horizontal', 'Dinámico', null, 'Pecho', 'Fuerza', 'clasificado', null, null),
  ('Fondos anillas', 'Empuje', 'Fondos', 'Dinámico', null, 'Tríceps', 'Fuerza', 'clasificado', null, null),
  ('Fondos en anillas con supino', 'Empuje', 'Fondos', 'Dinámico', null, 'Tríceps', 'Fuerza', 'clasificado', null, null),
  ('Fondos en paralelas', 'Empuje', 'Fondos', 'Dinámico', null, 'Tríceps', 'Fuerza', 'clasificado', null, null),
  ('Fondos lastrados', 'Empuje', 'Fondos', 'Dinámico', null, 'Tríceps', 'Fuerza', 'clasificado', 'Fondos lastrados paralelas', null),
  ('Fondos lastrados anillas', 'Empuje', 'Fondos', 'Dinámico', null, 'Tríceps', 'Fuerza', 'clasificado', null, null),
  ('Fondos lastrados paralelas', 'Empuje', 'Fondos', 'Dinámico', null, 'Tríceps', 'Fuerza', 'clasificado', null, null),
  ('Fondos libres / asistidos / negativas', 'Empuje', 'Fondos', 'Excéntrico', null, 'Tríceps', 'Fuerza', 'revisar', null, null),
  ('Fondos libres / lastrados / press banca (a elección)', 'Empuje', 'Fondos', 'Dinámico', null, 'Tríceps', 'Fuerza', 'revisar', null, null),
  ('Fondos paralelas', 'Empuje', 'Fondos', 'Dinámico', null, 'Tríceps', 'Fuerza', 'clasificado', 'Fondos en paralelas', null),
  ('Fondos sentados', 'Empuje', 'Fondos', 'Dinámico', null, 'Tríceps', 'Fuerza', 'clasificado', null, null),
  ('Front Lever a un brazo', 'Tirón', 'Front Lever', 'Isométrico', 'Front Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Front Lever a un brazo press', 'Tirón', 'Front Lever', 'Dinámico', 'Front Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Front Lever a una pierna', 'Tirón', 'Front Lever', 'Isométrico', 'Front Lever', 'Espalda', 'Fuerza', 'clasificado', null, 'Front Lever Tuck Adv.'),
  ('Front Lever a una pierna press', 'Tirón', 'Front Lever', 'Dinámico', 'Front Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Front Lever a una pierna pull up', 'Tirón', 'Front Lever', 'Dinámico', 'Front Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Front Lever archer pull up', 'Tirón', 'Front Lever', 'Dinámico', 'Front Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Front Lever Completo', 'Tirón', 'Front Lever', 'Isométrico', 'Front Lever', 'Espalda', 'Fuerza', 'clasificado', 'Front Lever Full', 'Front Lever Straddle'),
  ('Front Lever Full', 'Tirón', 'Front Lever', 'Isométrico', 'Front Lever', 'Espalda', 'Fuerza', 'clasificado', null, 'Front Lever Straddle'),
  ('Front Lever One Leg', 'Tirón', 'Front Lever', 'Isométrico', 'Front Lever', 'Espalda', 'Fuerza', 'clasificado', 'Front Lever a una pierna', 'Front Lever Tuck Adv.'),
  ('Front Lever press', 'Tirón', 'Front Lever', 'Dinámico', 'Front Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Front Lever pull up', 'Tirón', 'Front Lever', 'Dinámico', 'Front Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Front Lever pull up to touch', 'Tirón', 'Front Lever', 'Dinámico', 'Front Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Front Lever Straddle', 'Tirón', 'Front Lever', 'Isométrico', 'Front Lever', 'Espalda', 'Fuerza', 'clasificado', null, 'Front Lever a una pierna'),
  ('Front Lever Straddle Press', 'Tirón', 'Front Lever', 'Dinámico', 'Front Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Front Lever Touch', 'Tirón', 'Front Lever', 'Dinámico', 'Front Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Front Lever Touch Press', 'Tirón', 'Front Lever', 'Dinámico', 'Front Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Front Lever Tuck', 'Tirón', 'Front Lever', 'Isométrico', 'Front Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Front Lever Tuck Adv.', 'Tirón', 'Front Lever', 'Isométrico', 'Front Lever', 'Espalda', 'Fuerza', 'clasificado', null, 'Front Lever Tuck'),
  ('Front Lever tuck adv. press', 'Tirón', 'Front Lever', 'Dinámico', 'Front Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Front Lever tuck adv. pull up', 'Tirón', 'Front Lever', 'Dinámico', 'Front Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Front lever tuck avanzado asistido o 1 pierna', 'Tirón', 'Front Lever', 'Isométrico', 'Front Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Front Lever tuck press', 'Tirón', 'Front Lever', 'Dinámico', 'Front Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Front Lever tuck pull up', 'Tirón', 'Front Lever', 'Dinámico', 'Front Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Front Straddle pull up', 'Tirón', 'Front Lever', 'Dinámico', 'Front Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Front Straddle Touch', 'Tirón', 'Front Lever', 'Dinámico', 'Front Lever', 'Espalda', 'Fuerza', 'revisar', null, null),
  ('Full planche supina', 'Empuje', 'Planche', 'Isométrico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Full planche supina push ups', 'Empuje', 'Planche', 'Dinámico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Giro ruso con peso', 'Core', 'Rotación', 'Dinámico', null, 'Core', 'Fuerza', 'clasificado', null, null),
  ('Handstand Hold', 'Skills', 'Handstand', 'Isométrico', 'Handstand', 'Hombros', 'Skill', 'clasificado', null, null),
  ('Hefesto', 'Empuje', 'Estáticos avanzados', 'Dinámico', 'Hefesto', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Hefesto Archer', 'Empuje', 'Estáticos avanzados', 'Dinámico', 'Hefesto', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Hefesto Cripta', 'Empuje', 'Estáticos avanzados', 'Dinámico', 'Hefesto', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('hold tuck adv 12"', 'Empuje', 'Planche', 'Isométrico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Hollow + vuelos zanetti', 'Empuje', 'Accesorios de empuje', 'Dinámico', null, 'Hombros', 'Hipertrofia', 'revisar', null, null),
  ('hollow con peso', 'Core', 'Anti-extensión', 'Dinámico', null, 'Core', 'Fuerza', 'clasificado', null, null),
  ('Hollow hold', 'Core', 'Anti-extensión', 'Isométrico', null, 'Core', 'Fuerza', 'clasificado', null, null),
  ('I-sit', 'Core', 'Compresión', 'Isométrico', 'I-Sit', 'Core', 'Fuerza', 'clasificado', null, null),
  ('Impossible Dip', 'Empuje', 'Estáticos avanzados', 'Dinámico', 'Impossible Dip', 'Tríceps', 'Fuerza', 'clasificado', null, null),
  ('Inverted Cross', 'Empuje', 'Estáticos avanzados', 'Isométrico', 'Inverted Cross', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Iron Cross', 'Empuje', 'Estáticos avanzados', 'Isométrico', 'Iron Cross', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Isométrico de flexión a 90° con rodillas apoyadas', 'Empuje', 'Empuje horizontal', 'Isométrico', null, 'Pecho', 'Fuerza', 'clasificado', null, null),
  ('L a tuck front lever (repetir)', 'Tirón', 'Front Lever', 'Isométrico', 'Front Lever', 'Espalda', 'Fuerza', 'revisar', null, null),
  ('L-Sit', 'Core', 'Compresión', 'Isométrico', 'L-Sit', 'Core', 'Fuerza', 'clasificado', null, null),
  ('L-sit a un brazo', 'Core', 'Compresión', 'Isométrico', 'L-Sit', 'Core', 'Fuerza', 'clasificado', null, null),
  ('Lean planche + hold en pseudoplanche', 'Empuje', 'Planche', 'Isométrico', 'Planche', 'Hombros', 'Fuerza', 'revisar', null, null),
  ('Lean planche a tuck asistido', 'Empuje', 'Planche', 'Isométrico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('lean planche profunda', 'Empuje', 'Planche', 'Isométrico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Leñador con polea', 'Core', 'Rotación', 'Dinámico', null, 'Core', 'Fuerza', 'clasificado', null, null),
  ('Maltese Elevator REP', 'Empuje', 'Estáticos avanzados', 'Dinámico', 'Maltese', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Maltese Full', 'Empuje', 'Estáticos avanzados', 'Dinámico', 'Maltese', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Maltese Full Elevator', 'Empuje', 'Estáticos avanzados', 'Dinámico', 'Maltese', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Maltese Full Press', 'Empuje', 'Estáticos avanzados', 'Dinámico', 'Maltese', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Maltese push up', 'Empuje', 'Estáticos avanzados', 'Dinámico', 'Maltese', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Maltese Straddle', 'Empuje', 'Estáticos avanzados', 'Dinámico', 'Maltese', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Maltese Straddle Elevator', 'Empuje', 'Estáticos avanzados', 'Dinámico', 'Maltese', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Maltese Straddle Press', 'Empuje', 'Estáticos avanzados', 'Dinámico', 'Maltese', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Maltese to Full Planche', 'Empuje', 'Estáticos avanzados', 'Dinámico', 'Maltese', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Maltese to Straddle Planche', 'Empuje', 'Estáticos avanzados', 'Dinámico', 'Maltese', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Mana', 'Empuje', 'Estáticos avanzados', 'Isométrico', 'Mana', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Muscle Up', 'Dinámicos', 'Muscle Up', 'Dinámico', 'Muscle Up', 'Cuerpo completo', 'Skill', 'clasificado', null, 'Pull Up explosiva'),
  ('Muscle up / dominadas explosivas', 'Dinámicos', 'Muscle Up', 'Explosivo', 'Muscle Up', 'Cuerpo completo', 'Skill', 'revisar', null, null),
  ('Muscle Up anillas', 'Dinámicos', 'Muscle Up', 'Dinámico', 'Muscle Up', 'Cuerpo completo', 'Skill', 'clasificado', null, null),
  ('Muscle up brazos estirados', 'Dinámicos', 'Muscle Up', 'Dinámico', 'Muscle Up', 'Cuerpo completo', 'Skill', 'clasificado', null, null),
  ('negativa a 90°', 'Empuje', 'Empuje vertical', 'Excéntrico', '90 Degree', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Negativa de back lever', 'Tirón', 'Back Lever', 'Excéntrico', 'Back Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Negativa de Front a Hold', 'Tirón', 'Front Lever', 'Excéntrico', 'Front Lever', 'Espalda', 'Fuerza', 'clasificado', 'Negativas de Front', null),
  ('Negativa de Plancha a Hold', 'Empuje', 'Planche', 'Excéntrico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Negativas de Front', 'Tirón', 'Front Lever', 'Excéntrico', 'Front Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Negativas de Plancha', 'Empuje', 'Planche', 'Excéntrico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Pallof Press', 'Core', 'Anti-rotación', 'Isométrico', null, 'Core', 'Control corporal', 'clasificado', null, null),
  ('Pelicano Straddle', 'Empuje', 'Estáticos avanzados', 'Dinámico', 'Pelicano', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Pikas con altura', 'Empuje', 'Empuje vertical', 'Dinámico', null, 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Pino a una mano full', 'Skills', 'Handstand', 'Isométrico', 'Handstand', 'Hombros', 'Skill', 'clasificado', null, null),
  ('Pino a una mano straddle', 'Skills', 'Handstand', 'Isométrico', 'Handstand', 'Hombros', 'Skill', 'clasificado', null, null),
  ('Pino Archer push up', 'Empuje', 'Empuje vertical', 'Dinámico', 'Handstand', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Pino Full', 'Skills', 'Handstand', 'Isométrico', 'Handstand', 'Hombros', 'Skill', 'clasificado', null, 'Handstand Hold'),
  ('Pino push up', 'Empuje', 'Empuje vertical', 'Dinámico', 'Handstand', 'Hombros', 'Fuerza', 'clasificado', null, 'Pino Full'),
  ('Pino push up profunda', 'Empuje', 'Empuje vertical', 'Dinámico', 'Handstand', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Pino Straddle', 'Skills', 'Handstand', 'Isométrico', 'Handstand', 'Hombros', 'Skill', 'clasificado', null, null),
  ('Plancha', 'Core', 'Anti-extensión', 'Dinámico', null, 'Core', 'Fuerza', 'clasificado', null, null),
  ('Plancha + elevaciones de rodillas en barra + crunch', 'Core', 'Anti-extensión', 'Dinámico', null, 'Core', 'Fuerza', 'revisar', null, null),
  ('Plancha a un brazo Straddle', 'Empuje', 'Planche', 'Isométrico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Plancha a una pierna', 'Empuje', 'Planche', 'Isométrico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Plancha a una pierna press', 'Empuje', 'Planche', 'Dinámico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Plancha a una pierna push up', 'Empuje', 'Planche', 'Dinámico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Plancha Antebrazos Full', 'Empuje', 'Planche', 'Isométrico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Plancha Antebrazos Straddle', 'Empuje', 'Planche', 'Isométrico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Plancha Carpada', 'Empuje', 'Planche', 'Isométrico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Plancha de hombros + crunch', 'Core', 'Anti-extensión', 'Dinámico', null, 'Core', 'Fuerza', 'revisar', null, null),
  ('Plancha Full', 'Empuje', 'Planche', 'Isométrico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, 'Planche Straddle'),
  ('Plancha Full Dead', 'Empuje', 'Planche', 'Isométrico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Plancha Full press', 'Empuje', 'Planche', 'Dinámico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Plancha Full push up', 'Empuje', 'Planche', 'Dinámico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Plancha Full push up 1/2', 'Empuje', 'Planche', 'Dinámico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Plancha Full push up archer', 'Empuje', 'Planche', 'Dinámico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Plancha Full push up profunda', 'Empuje', 'Planche', 'Dinámico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Plancha lateral', 'Core', 'Estabilidad', 'Isométrico', null, 'Core', 'Control corporal', 'clasificado', null, null),
  ('Plancha lateral + crunch', 'Core', 'Estabilidad', 'Isométrico', null, 'Core', 'Control corporal', 'revisar', null, null),
  ('Plancha Rana Buda', 'Empuje', 'Planche', 'Isométrico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Plancha Straddle press', 'Empuje', 'Planche', 'Dinámico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, 'Planche Straddle'),
  ('Plancha Straddle push up', 'Empuje', 'Planche', 'Dinámico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Plancha Straddle push up archer', 'Empuje', 'Planche', 'Dinámico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Plancha Tuck', 'Empuje', 'Planche', 'Isométrico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', 'Tuck Planche', 'Pseudo plancha'),
  ('Plancha tuck adv. push up', 'Empuje', 'Planche', 'Dinámico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Plancha Tuck Avanzada', 'Empuje', 'Planche', 'Isométrico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', 'Advanced Tuck Planche', 'Tuck Planche'),
  ('Plancha tuck press', 'Empuje', 'Planche', 'Dinámico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Plancha tuck push up', 'Empuje', 'Planche', 'Dinámico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Plancha Wide', 'Empuje', 'Planche', 'Isométrico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Planchas laterales con rotación', 'Core', 'Estabilidad', 'Dinámico', null, 'Core', 'Control corporal', 'clasificado', null, null),
  ('Planche completa', 'Empuje', 'Planche', 'Isométrico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', 'Plancha Full', 'Planche Straddle'),
  ('Planche Straddle', 'Empuje', 'Planche', 'Isométrico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, 'Advanced Tuck Planche'),
  ('Planche Straddle Dead', 'Empuje', 'Planche', 'Isométrico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Prayer Full', 'Empuje', 'Estáticos avanzados', 'Dinámico', 'Prayer', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Prayer Straddle', 'Empuje', 'Estáticos avanzados', 'Dinámico', 'Prayer', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('press + negativa d tuck', 'Empuje', 'Planche', 'Dinámico', 'Planche', 'Hombros', 'Fuerza', 'revisar', null, null),
  ('Press de banca (a elección)', 'Empuje', 'Accesorios de empuje', 'Dinámico', null, 'Hombros', 'Hipertrofia', 'revisar', null, null),
  ('Press Full a Pino', 'Skills', 'Press to Handstand', 'Dinámico', 'Handstand', 'Hombros', 'Skill', 'clasificado', null, null),
  ('Press militar con mancuernas', 'Empuje', 'Accesorios de empuje', 'Dinámico', null, 'Hombros', 'Hipertrofia', 'revisar', null, null),
  ('Press Straddle a Pino', 'Skills', 'Press to Handstand', 'Dinámico', 'Handstand', 'Hombros', 'Skill', 'clasificado', null, null),
  ('Press to Handstand', 'Skills', 'Press to Handstand', 'Dinámico', 'Handstand', 'Hombros', 'Skill', 'clasificado', null, null),
  ('Pseudo plancha', 'Empuje', 'Planche', 'Isométrico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Pseudo plancha straddle', 'Empuje', 'Planche', 'Isométrico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Puente de glúteo', 'Piernas', 'Dominante de cadera', 'Dinámico', null, 'Glúteos', 'Fuerza', 'clasificado', null, null),
  ('Pull Over', 'Dinámicos', 'Transiciones', 'Dinámico', null, 'Cuerpo completo', 'Skill', 'clasificado', null, null),
  ('Pull Up explosiva', 'Dinámicos', 'Muscle Up', 'Explosivo', 'Muscle Up', 'Espalda', 'Potencia', 'clasificado', null, null),
  ('Pull Up Ultra Wide', 'Tirón', 'Dominadas', 'Dinámico', null, 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Raises en tuck', 'Tirón', 'Front Lever', 'Dinámico', 'Front Lever', 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Rechazos escapulares en lean planche', 'Empuje', 'Planche', 'Isométrico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Remo anillas', 'Tirón', 'Remos', 'Dinámico', null, 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Remo australiano', 'Tirón', 'Remos', 'Dinámico', null, 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Remo australiano supino', 'Tirón', 'Remos', 'Dinámico', null, 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Remo en anillas con pies elevados', 'Tirón', 'Remos', 'Dinámico', null, 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Remos en L (asistidos o libres)', 'Tirón', 'Remos', 'Dinámico', null, 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Remos supinos en anillas con pies elevados', 'Tirón', 'Remos', 'Dinámico', null, 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Retracciones escapulares en barra', 'Tirón', 'Fuerza de tirón', 'Accesorio', null, 'Espalda', 'Fuerza', 'clasificado', null, null),
  ('Reverse Muscle up', 'Dinámicos', 'Muscle Up', 'Dinámico', 'Muscle Up', 'Cuerpo completo', 'Skill', 'clasificado', null, null),
  ('Rueda abdominal', 'Core', 'Anti-extensión', 'Dinámico', null, 'Core', 'Fuerza', 'clasificado', null, null),
  ('SAT', 'Empuje', 'Estáticos avanzados', 'Dinámico', 'SAT', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('SAT inverse pull up to hefesto straight arms', 'Empuje', 'Estáticos avanzados', 'Dinámico', 'Hefesto', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Sat Press', 'Empuje', 'Estáticos avanzados', 'Dinámico', 'SAT', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('SAT pull up', 'Empuje', 'Estáticos avanzados', 'Dinámico', 'SAT', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Sentadilla búlgara', 'Piernas', 'Dominante de rodilla', 'Dinámico', null, 'Cuádriceps', 'Fuerza', 'clasificado', null, null),
  ('Sentadilla con peso corporal', 'Piernas', 'Dominante de rodilla', 'Dinámico', null, 'Cuádriceps', 'Fuerza', 'clasificado', null, null),
  ('Sentadilla pistola', 'Piernas', 'Dominante de rodilla', 'Dinámico', 'Pistol', 'Cuádriceps', 'Fuerza', 'clasificado', null, null),
  ('Skin the cat profundas en anillas', 'Skills', 'Otros', 'Movilidad', 'Skin the Cat', 'Hombros', 'Movilidad', 'clasificado', null, null),
  ('superman', 'Core', 'Revisar', 'Técnica', null, 'Core', 'Técnica', 'revisar', null, null),
  ('Toques de hombros en pika o pikas parciales', 'Empuje', 'Empuje vertical', 'Dinámico', null, 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Tuck Planche', 'Empuje', 'Planche', 'Isométrico', 'Planche', 'Hombros', 'Fuerza', 'clasificado', null, 'Pseudo plancha'),
  ('Turtle Full', 'Core', 'Compresión', 'Isométrico', 'Turtle', 'Core', 'Fuerza', 'clasificado', null, null),
  ('Turtle Full One Arm', 'Core', 'Compresión', 'Isométrico', 'Turtle', 'Core', 'Fuerza', 'clasificado', null, null),
  ('V-Sit', 'Core', 'Compresión', 'Isométrico', 'V-Sit', 'Core', 'Fuerza', 'clasificado', null, null),
  ('Victorian a una pierna', 'Empuje', 'Estáticos avanzados', 'Dinámico', 'Victorian', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Victorian Asistido', 'Empuje', 'Estáticos avanzados', 'Dinámico', 'Victorian', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Victorian Cross Full', 'Empuje', 'Estáticos avanzados', 'Dinámico', 'Victorian', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Victorian Elevator', 'Empuje', 'Estáticos avanzados', 'Dinámico', 'Victorian', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Victorian Press', 'Empuje', 'Estáticos avanzados', 'Dinámico', 'Victorian', 'Hombros', 'Fuerza', 'clasificado', null, null),
  ('Vuelos zanetti en banco + rechazos escapulares en flexión', 'Empuje', 'Empuje horizontal', 'Dinámico', null, 'Pecho', 'Fuerza', 'revisar', null, null),
  ('Vueltas al mundo en barra', 'Skills', 'Otros', 'Movilidad', 'Skin the Cat', 'Hombros', 'Movilidad', 'clasificado', null, null),
  ('Zancada caminando', 'Piernas', 'Dominante de rodilla', 'Dinámico', null, 'Cuádriceps', 'Fuerza', 'clasificado', null, null);

-- 5) APLICAR LA CLASIFICACION
update public.exercises e set
  categoria             = m.categoria,
  subcategoria          = m.subcategoria,
  movement_type         = m.movement_type,
  skill                 = m.skill,
  muscle_group          = m.muscle_group,
  objetivo              = m.objetivo,
  estado_clasificacion  = m.estado
from _mapa_cal m
where e.nombre = m.nombre and e.disciplina = 'Calistenia';

-- 6) RESOLVER RELACIONES (duplicado_de / progresion_de) por nombre
update public.exercises e
set duplicado_de = d.id
from _mapa_cal m
join public.exercises d on d.nombre = m.duplicado_de and d.disciplina = 'Calistenia'
where m.duplicado_de is not null and e.nombre = m.nombre and e.disciplina = 'Calistenia';

update public.exercises e
set progresion_de = p.id
from _mapa_cal m
join public.exercises p on p.nombre = m.progresion_de and p.disciplina = 'Calistenia'
where m.progresion_de is not null and e.nombre = m.nombre and e.disciplina = 'Calistenia';

-- cualquier Calistenia que no haya entrado al mapa queda para revisar
update public.exercises set estado_clasificacion = 'revisar'
where disciplina = 'Calistenia' and nombre not in (select nombre from _mapa_cal);

drop table if exists _mapa_cal;

-- 7) INDICES
create index if not exists idx_exercises_movement_type on public.exercises (movement_type);
create index if not exists idx_exercises_skill         on public.exercises (skill);
create index if not exists idx_exercises_muscle_group  on public.exercises (muscle_group);
create index if not exists idx_exercises_estado_clas   on public.exercises (estado_clasificacion);
create index if not exists idx_exercises_duplicado     on public.exercises (duplicado_de);
create index if not exists idx_exercises_skill_trgm    on public.exercises using gin (skill gin_trgm_ops);

-- 8) VERIFICACION
select 'FASE 18 OK' as estado,
  (select count(*) from public.exercises where disciplina = 'Calistenia') as calistenia,
  (select count(*) from public.exercises where disciplina = 'Calistenia' and estado_clasificacion = 'revisar') as a_revisar,
  (select count(*) from public.exercises where disciplina = 'Calistenia' and duplicado_de is not null) as duplicados_marcados,
  (select count(*) from public.exercises where disciplina = 'Calistenia' and estado_clasificacion = 'clasificado') as clasificados;
