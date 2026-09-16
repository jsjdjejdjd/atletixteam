-- ============================================================
-- ATLETIX · FASE 2 · Base de datos + Auth + Roles + RLS
-- Ejecutar UNA sola vez en: Supabase → SQL Editor → Run
-- ============================================================

-- Extensiones útiles (moddatetime actualiza updated_at automáticamente)
create extension if not exists "pgcrypto";
create extension if not exists "moddatetime";

-- ============================================================
-- TABLA: profiles (todos los usuarios)
-- ============================================================
create table if not exists public.profiles (
  id                uuid primary key references auth.users (id) on delete cascade,
  email             text,
  nombre            text default '',
  apellido          text default '',
  telefono          text,
  fecha_nacimiento  date,
  foto_url          text,
  rol               text not null default 'alumno' check (rol in ('admin', 'alumno')),
  estado            text not null default 'activo' check (estado in ('activo', 'inactivo')),
  created_at        timestamptz not null default now()
);

-- ============================================================
-- TABLA: athletes (datos específicos del alumno)
-- ============================================================
create table if not exists public.athletes (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null unique references public.profiles (id) on delete cascade,
  entrenador_id     uuid references public.profiles (id) on delete set null,
  nivel             text default 'Principiante' check (nivel in ('Principiante', 'Intermedio', 'Avanzado', 'Competitivo')),
  objetivo          text,
  experiencia       text,
  peso              numeric,
  altura            numeric,
  frecuencia_semanal integer,
  observaciones     text,
  fecha_inicio      date default current_date,
  estado            text not null default 'activo' check (estado in ('activo', 'inactivo')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ============================================================
-- TABLA: exercises (biblioteca de ejercicios)
-- ============================================================
create table if not exists public.exercises (
  id                uuid primary key default gen_random_uuid(),
  nombre            text not null unique,
  categoria         text not null check (categoria in ('Tirón', 'Empuje', 'Piernas', 'Core', 'Planche', 'Front Lever', 'Muscle Up', 'Handstand', 'Street Lifting', 'Movilidad', 'Prehabilitación')),
  descripcion       text,
  dificultad        text default 'Principiante' check (dificultad in ('Principiante', 'Intermedio', 'Avanzado', 'Competitivo')),
  equipamiento      text,
  video_url         text,
  thumbnail_url     text,
  instrucciones     text,
  errores_comunes   text,
  activo            boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ============================================================
-- TABLA: programs (planificación)
-- ============================================================
create table if not exists public.programs (
  id                uuid primary key default gen_random_uuid(),
  nombre            text not null,
  descripcion       text,
  nivel             text default 'Principiante' check (nivel in ('Principiante', 'Intermedio', 'Avanzado', 'Competitivo')),
  objetivo          text,
  duracion_semanas  integer,
  entrenador_id     uuid references public.profiles (id) on delete set null,
  activo            boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ============================================================
-- TABLA: athlete_programs (alumno ↔ programa)
-- ============================================================
create table if not exists public.athlete_programs (
  id                uuid primary key default gen_random_uuid(),
  athlete_id        uuid not null references public.athletes (id) on delete cascade,
  program_id        uuid not null references public.programs (id) on delete cascade,
  fecha_inicio      date default current_date,
  estado            text not null default 'activo' check (estado in ('activo', 'finalizado')),
  created_at        timestamptz not null default now()
);

-- ============================================================
-- TABLA: weeks (semanas y bloques)
-- ============================================================
create table if not exists public.weeks (
  id                uuid primary key default gen_random_uuid(),
  program_id        uuid not null references public.programs (id) on delete cascade,
  numero            integer not null,
  bloque            integer,
  objetivo          text,
  notas             text,
  es_descarga       boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (program_id, numero)
);

-- ============================================================
-- TABLA: workouts (sesiones de entrenamiento)
-- ============================================================
create table if not exists public.workouts (
  id                uuid primary key default gen_random_uuid(),
  week_id           uuid not null references public.weeks (id) on delete cascade,
  nombre            text not null,
  dia               integer,
  orden             integer not null default 0,
  descripcion       text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ============================================================
-- TABLA: workout_exercises (ejercicio dentro de un entrenamiento)
-- ============================================================
create table if not exists public.workout_exercises (
  id                uuid primary key default gen_random_uuid(),
  workout_id        uuid not null references public.workouts (id) on delete cascade,
  exercise_id       uuid references public.exercises (id) on delete set null,
  orden             integer not null default 0,
  series            integer,
  repeticiones      text,
  tiempo            text,
  rir               integer,
  descanso_segundos integer,
  peso              text,
  tempo             text,
  asistencia        text,
  notas             text,
  video_url         text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ============================================================
-- TABLA: workout_logs (lo que realmente hizo el alumno)
-- series_data: JSON array, ej: [{"serie":1,"peso":25,"reps":5,"rir":3}]
-- ============================================================
create table if not exists public.workout_logs (
  id                  uuid primary key default gen_random_uuid(),
  workout_exercise_id uuid not null references public.workout_exercises (id) on delete cascade,
  athlete_id          uuid not null references public.profiles (id) on delete cascade,
  series_data         jsonb not null default '[]'::jsonb,
  comentarios         text,
  completado          boolean not null default false,
  fecha               date not null default current_date,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ============================================================
-- TABLA: progress (tests y evolución del alumno)
-- tests: JSON, ej: {"dominadas_max":12,"front_lever":"Tuck","planche":"Advanced Tuck"}
-- ============================================================
create table if not exists public.progress (
  id                uuid primary key default gen_random_uuid(),
  athlete_id        uuid not null references public.profiles (id) on delete cascade,
  fecha             date not null default current_date,
  peso_corporal     numeric,
  tests             jsonb not null default '{}'::jsonb,
  notas             text,
  created_at        timestamptz not null default now()
);

-- ============================================================
-- TABLA: videos (videos que sube el alumno para revisar)
-- ============================================================
create table if not exists public.videos (
  id                   uuid primary key default gen_random_uuid(),
  athlete_id           uuid not null references public.profiles (id) on delete cascade,
  workout_exercise_id  uuid references public.workout_exercises (id) on delete set null,
  storage_path         text not null,
  estado               text not null default 'pendiente' check (estado in ('pendiente', 'revisado')),
  comentario_entrenador text,
  created_at           timestamptz not null default now()
);

-- ============================================================
-- TABLA: conversations (chat entrenador ↔ alumno)
-- ============================================================
create table if not exists public.conversations (
  id                uuid primary key default gen_random_uuid(),
  entrenador_id     uuid not null references public.profiles (id),
  alumno_id         uuid not null references public.profiles (id),
  created_at        timestamptz not null default now(),
  unique (entrenador_id, alumno_id)
);

-- ============================================================
-- TABLA: messages
-- ============================================================
create table if not exists public.messages (
  id                uuid primary key default gen_random_uuid(),
  conversation_id   uuid not null references public.conversations (id) on delete cascade,
  sender_id         uuid not null references public.profiles (id),
  contenido         text not null,
  is_read           boolean not null default false,
  created_at        timestamptz not null default now()
);

-- ============================================================
-- TABLA: notifications
-- ============================================================
create table if not exists public.notifications (
  id                uuid primary key default gen_random_uuid(),
  profile_id        uuid not null references public.profiles (id) on delete cascade,
  tipo              text not null,
  titulo            text,
  cuerpo            text,
  is_read           boolean not null default false,
  created_at        timestamptz not null default now()
);

-- ============================================================
-- TABLAS PARA EL FUTURO: planes y suscripciones (pagos)
-- ============================================================
create table if not exists public.plans (
  id                uuid primary key default gen_random_uuid(),
  nombre            text not null,
  precio            numeric not null default 0,
  moneda            text not null default 'ARS',
  duracion_dias     integer,
  features          jsonb not null default '{}'::jsonb,
  activo            boolean not null default true,
  created_at        timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id                uuid primary key default gen_random_uuid(),
  profile_id        uuid not null references public.profiles (id) on delete cascade,
  plan_id           uuid references public.plans (id) on delete set null,
  estado            text not null default 'activa' check (estado in ('activa', 'cancelada', 'vencida')),
  fecha_inicio      date not null default current_date,
  fecha_fin         date,
  created_at        timestamptz not null default now()
);

-- ============================================================
-- ÍNDICES (aceleran las consultas más comunes)
-- ============================================================
create index if not exists idx_athletes_user on public.athletes (user_id);
create index if not exists idx_athletes_entrenador on public.athletes (entrenador_id);
create index if not exists idx_exercises_categoria on public.exercises (categoria);
create index if not exists idx_programs_entrenador on public.programs (entrenador_id);
create index if not exists idx_athlete_programs_athlete on public.athlete_programs (athlete_id);
create index if not exists idx_weeks_program on public.weeks (program_id);
create index if not exists idx_workouts_week on public.workouts (week_id);
create index if not exists idx_workout_exercises_workout on public.workout_exercises (workout_id);
create index if not exists idx_workout_logs_athlete on public.workout_logs (athlete_id);
create index if not exists idx_workout_logs_wwe on public.workout_logs (workout_exercise_id);
create index if not exists idx_progress_athlete on public.progress (athlete_id);
create index if not exists idx_videos_athlete on public.videos (athlete_id);
create index if not exists idx_messages_conversation on public.messages (conversation_id);
create index if not exists idx_notifications_profile on public.notifications (profile_id);
create index if not exists idx_subscriptions_profile on public.subscriptions (profile_id);

-- ============================================================
-- updated_at AUTOMÁTICO en las tablas de contenido
-- ============================================================
create trigger handle_updated_at_athletes before update on public.athletes
  for each row execute procedure moddatetime (updated_at);
create trigger handle_updated_at_exercises before update on public.exercises
  for each row execute procedure moddatetime (updated_at);
create trigger handle_updated_at_programs before update on public.programs
  for each row execute procedure moddatetime (updated_at);
create trigger handle_updated_at_weeks before update on public.weeks
  for each row execute procedure moddatetime (updated_at);
create trigger handle_updated_at_workouts before update on public.workouts
  for each row execute procedure moddatetime (updated_at);
create trigger handle_updated_at_workout_exercises before update on public.workout_exercises
  for each row execute procedure moddatetime (updated_at);
create trigger handle_updated_at_workout_logs before update on public.workout_logs
  for each row execute procedure moddatetime (updated_at);

-- ============================================================
-- CREAR PERFIL AUTOMÁTICAMENTE al registrarse un usuario
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, nombre, apellido)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'nombre', ''),
    coalesce(new.raw_user_meta_data ->> 'apellido', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- FUNCIÓN: ¿el usuario actual es entrenador/admin?
-- ============================================================
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and rol = 'admin' and estado = 'activo'
  );
$$;

-- ============================================================
-- SEGURIDAD RLS · Tabla: profiles
-- ============================================================
alter table public.profiles enable row level security;

create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (
    id = auth.uid()
    or exists (
      select 1 from public.athletes a
      where a.entrenador_id = auth.uid() and a.user_id = public.profiles.id
    )
    or public.is_admin()
  );

create policy "profiles_update_own_or_admin"
  on public.profiles for update
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- ============================================================
-- SEGURIDAD RLS · Tabla: athletes
-- ============================================================
alter table public.athletes enable row level security;

create policy "athletes_select_own_or_admin"
  on public.athletes for select
  using (user_id = auth.uid() or public.is_admin());

create policy "athletes_insert_admin"
  on public.athletes for insert
  with check (public.is_admin());

create policy "athletes_update_own_or_admin"
  on public.athletes for update
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

create policy "athletes_delete_admin"
  on public.athletes for delete
  using (public.is_admin());

-- ============================================================
-- SEGURIDAD RLS · Tabla: exercises
-- ============================================================
alter table public.exercises enable row level security;

create policy "exercises_select_auth"
  on public.exercises for select
  using (activo = true or public.is_admin());

create policy "exercises_insert_admin"
  on public.exercises for insert
  with check (public.is_admin());

create policy "exercises_update_admin"
  on public.exercises for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "exercises_delete_admin"
  on public.exercises for delete
  using (public.is_admin());

-- ============================================================
-- SEGURIDAD RLS · Tabla: programs
-- ============================================================
alter table public.programs enable row level security;

create policy "programs_select_assigned_or_admin"
  on public.programs for select
  using (
    public.is_admin()
    or exists (
      select 1
      from public.athlete_programs ap
      join public.athletes a on a.id = ap.athlete_id
      where ap.program_id = public.programs.id and a.user_id = auth.uid()
    )
  );

create policy "programs_insert_admin"
  on public.programs for insert
  with check (public.is_admin());

create policy "programs_update_admin"
  on public.programs for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "programs_delete_admin"
  on public.programs for delete
  using (public.is_admin());

-- ============================================================
-- SEGURIDAD RLS · Tabla: athlete_programs
-- ============================================================
alter table public.athlete_programs enable row level security;

create policy "athlete_programs_select_own_or_admin"
  on public.athlete_programs for select
  using (
    public.is_admin()
    or athlete_id in (
      select a.id from public.athletes a where a.user_id = auth.uid()
    )
  );

create policy "athlete_programs_insert_admin"
  on public.athlete_programs for insert
  with check (public.is_admin());

create policy "athlete_programs_update_admin"
  on public.athlete_programs for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "athlete_programs_delete_admin"
  on public.athlete_programs for delete
  using (public.is_admin());

-- ============================================================
-- SEGURIDAD RLS · Tabla: weeks
-- ============================================================
alter table public.weeks enable row level security;

create policy "weeks_select_assigned_or_admin"
  on public.weeks for select
  using (
    public.is_admin()
    or program_id in (
      select ap.program_id
      from public.athlete_programs ap
      join public.athletes a on a.id = ap.athlete_id
      where a.user_id = auth.uid()
    )
  );

create policy "weeks_insert_admin"
  on public.weeks for insert
  with check (public.is_admin());

create policy "weeks_update_admin"
  on public.weeks for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "weeks_delete_admin"
  on public.weeks for delete
  using (public.is_admin());

-- ============================================================
-- SEGURIDAD RLS · Tabla: workouts
-- ============================================================
alter table public.workouts enable row level security;

create policy "workouts_select_assigned_or_admin"
  on public.workouts for select
  using (
    public.is_admin()
    or week_id in (
      select w.id
      from public.weeks w
      join public.athlete_programs ap on ap.program_id = w.program_id
      join public.athletes a on a.id = ap.athlete_id
      where a.user_id = auth.uid()
    )
  );

create policy "workouts_insert_admin"
  on public.workouts for insert
  with check (public.is_admin());

create policy "workouts_update_admin"
  on public.workouts for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "workouts_delete_admin"
  on public.workouts for delete
  using (public.is_admin());

-- ============================================================
-- SEGURIDAD RLS · Tabla: workout_exercises
-- ============================================================
alter table public.workout_exercises enable row level security;

create policy "workout_exercises_select_assigned_or_admin"
  on public.workout_exercises for select
  using (
    public.is_admin()
    or workout_id in (
      select wo.id
      from public.workouts wo
      join public.weeks w on w.id = wo.week_id
      join public.athlete_programs ap on ap.program_id = w.program_id
      join public.athletes a on a.id = ap.athlete_id
      where a.user_id = auth.uid()
    )
  );

create policy "workout_exercises_insert_admin"
  on public.workout_exercises for insert
  with check (public.is_admin());

create policy "workout_exercises_update_admin"
  on public.workout_exercises for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "workout_exercises_delete_admin"
  on public.workout_exercises for delete
  using (public.is_admin());

-- ============================================================
-- SEGURIDAD RLS · Tabla: workout_logs
-- ============================================================
alter table public.workout_logs enable row level security;

create policy "workout_logs_select_own_or_admin"
  on public.workout_logs for select
  using (athlete_id = auth.uid() or public.is_admin());

create policy "workout_logs_insert_own"
  on public.workout_logs for insert
  with check (athlete_id = auth.uid() or public.is_admin());

create policy "workout_logs_update_own_or_admin"
  on public.workout_logs for update
  using (athlete_id = auth.uid() or public.is_admin())
  with check (athlete_id = auth.uid() or public.is_admin());

create policy "workout_logs_delete_own_or_admin"
  on public.workout_logs for delete
  using (athlete_id = auth.uid() or public.is_admin());

-- ============================================================
-- SEGURIDAD RLS · Tabla: progress
-- ============================================================
alter table public.progress enable row level security;

create policy "progress_select_own_or_admin"
  on public.progress for select
  using (athlete_id = auth.uid() or public.is_admin());

create policy "progress_insert_own"
  on public.progress for insert
  with check (athlete_id = auth.uid() or public.is_admin());

create policy "progress_update_own_or_admin"
  on public.progress for update
  using (athlete_id = auth.uid() or public.is_admin())
  with check (athlete_id = auth.uid() or public.is_admin());

create policy "progress_delete_own_or_admin"
  on public.progress for delete
  using (athlete_id = auth.uid() or public.is_admin());

-- ============================================================
-- SEGURIDAD RLS · Tabla: videos
-- ============================================================
alter table public.videos enable row level security;

create policy "videos_select_own_or_admin"
  on public.videos for select
  using (athlete_id = auth.uid() or public.is_admin());

create policy "videos_insert_own_or_admin"
  on public.videos for insert
  with check (athlete_id = auth.uid() or public.is_admin());

create policy "videos_update_own_or_admin"
  on public.videos for update
  using (athlete_id = auth.uid() or public.is_admin())
  with check (athlete_id = auth.uid() or public.is_admin());

create policy "videos_delete_own_or_admin"
  on public.videos for delete
  using (athlete_id = auth.uid() or public.is_admin());

-- ============================================================
-- SEGURIDAD RLS · Tabla: conversations
-- ============================================================
alter table public.conversations enable row level security;

create policy "conversations_select_participant"
  on public.conversations for select
  using (entrenador_id = auth.uid() or alumno_id = auth.uid());

create policy "conversations_insert_participant"
  on public.conversations for insert
  with check (entrenador_id = auth.uid() or alumno_id = auth.uid());

create policy "conversations_update_admin"
  on public.conversations for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "conversations_delete_admin"
  on public.conversations for delete
  using (public.is_admin());

-- ============================================================
-- SEGURIDAD RLS · Tabla: messages
-- ============================================================
alter table public.messages enable row level security;

create policy "messages_select_in_conversation"
  on public.messages for select
  using (
    conversation_id in (
      select c.id from public.conversations c
      where c.entrenador_id = auth.uid() or c.alumno_id = auth.uid()
    )
  );

create policy "messages_insert_sender"
  on public.messages for insert
  with check (sender_id = auth.uid());

create policy "messages_update_read_or_admin"
  on public.messages for update
  using (sender_id = auth.uid() or public.is_admin())
  with check (sender_id = auth.uid() or public.is_admin());

-- ============================================================
-- SEGURIDAD RLS · Tabla: notifications
-- ============================================================
alter table public.notifications enable row level security;

create policy "notifications_select_own"
  on public.notifications for select
  using (profile_id = auth.uid());

create policy "notifications_insert_admin"
  on public.notifications for insert
  with check (public.is_admin());

create policy "notifications_update_own"
  on public.notifications for update
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

-- ============================================================
-- SEGURIDAD RLS · Tablas futuras: plans y subscriptions
-- ============================================================
alter table public.plans enable row level security;

create policy "plans_select_auth"
  on public.plans for select
  using (auth.role() = 'authenticated');

create policy "plans_insert_admin"
  on public.plans for insert
  with check (public.is_admin());

create policy "plans_update_admin"
  on public.plans for update
  using (public.is_admin())
  with check (public.is_admin());

alter table public.subscriptions enable row level security;

create policy "subscriptions_select_own_or_admin"
  on public.subscriptions for select
  using (profile_id = auth.uid() or public.is_admin());

create policy "subscriptions_insert_own_or_admin"
  on public.subscriptions for insert
  with check (profile_id = auth.uid() or public.is_admin());

create policy "subscriptions_update_admin"
  on public.subscriptions for update
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- DATOS INICIALES · Biblioteca básica de ejercicios
-- ============================================================
insert into public.exercises (nombre, categoria, dificultad, descripcion) values
  ('Dominadas', 'Tirón', 'Intermedio', 'Dominadas con agarre prono a la barra.'),
  ('Dominadas lastradas', 'Tirón', 'Avanzado', 'Dominadas con disco o cadena anclada al cinturón.'),
  ('Fondos en paralelas', 'Empuje', 'Intermedio', 'Fondos en barras paralelas.'),
  ('Fondos lastrados', 'Empuje', 'Avanzado', 'Fondos en paralelas con carga adicional.'),
  ('Tuck Planche', 'Planche', 'Intermedio', 'Planche en posición de rodillas pegadas al pecho.'),
  ('Advanced Tuck Planche', 'Planche', 'Avanzado', 'Planche con rodillas abiertas, hips a la altura de los hombros.'),
  ('Front Lever Tuck', 'Front Lever', 'Intermedio', 'Front lever en posición agrupada.'),
  ('Front Lever One Leg', 'Front Lever', 'Avanzado', 'Front lever con una pierna extendida.'),
  ('Muscle Up', 'Muscle Up', 'Avanzado', 'Muscle up en barra.'),
  ('Pull Up explosiva', 'Muscle Up', 'Avanzado', 'Dominada explosiva hasta el pecho.'),
  ('Handstand Hold', 'Handstand', 'Intermedio', 'Equilibrio de pino contra pared o libre.'),
  ('Press to Handstand', 'Handstand', 'Avanzado', 'Subida de pino desde el suelo.') 
on conflict (nombre) do nothing;

-- ============================================================
-- FIN DE LA MIGRACIÓN · Verificación rápida
-- ============================================================
select 'TABLAS OK' as estado, count(*) as cantidad
from information_schema.tables
where table_schema = 'public' and table_type = 'BASE TABLE';