-- ============================================================
-- ATLETIX · 0075 · SEMANA 5 · LUIS (Avanzado) + EZE (Intermedio)
-- ============================================================
-- Reemplaza TODO el contenido previo (mal cargado) de la semana 5 de:
--   · Plancha / Front Level Avanzado  → LUIS  (día 1 y 3 nuevos;
--     días 2 y 4 se copian de la semana 3, a pedido del entrenador —
--     la semana 4 es descarga y solo tiene contenido en días 1 y 3)
--   · Plancha / Front Level Intermedio → EZE  (días 1-4 nuevos)
-- Reglas: series = valor base del rango (ej. "4-5 series" → 4, con el
--   rango en `notas`); reps/tiempo/peso/RIR van a su columna; cues del
--   entrenador en `notas`; descanso 180 s (igual que las semanas 1-4).
-- Idempotente: ejercicios por (nombre, disciplina); el contenido de la
--   semana 5 se borra y se recarga completo en cada corrida.
-- Copias de la semana 3 (Luis, días 2 y 4): se recargan en cada corrida
--   sobre los workouts destino ya vacíos, sin duplicar.
-- ============================================================

-- ============================================================
-- 1) EJERCICIOS NUEVOS (los que no existen en la biblioteca)
-- ============================================================
insert into public.exercises
  (nombre, disciplina, categoria, subcategoria, skill, dificultad, activo, descripcion)
values
  ('half hold 3" + push-up negativo a 90° hold ( 3-5" ) ( banda fina )', 'Calistenia', 'Empuje', 'Planche', 'Planche', 'Avanzado', true,
   'Half planche hold 3" + negativa a 90° hold de 3-5" con banda fina (RIR 1).'),
  ('Press y negativa de half planche + intento de hold', 'Calistenia', 'Empuje', 'Planche', 'Planche', 'Avanzado', true,
   'Press a half planche, negativa controlada e intento de hold (RIR 1).'),
  ('push-ups con dead stop ( bloquear y pausa de 0.5 arriba )', 'Calistenia', 'Empuje', 'Planche', 'Planche', 'Intermedio', true,
   'Push-ups con pausa dead stop de 0.5 s arriba: bloquear y pausar en cada repetición.'),
  ('Lean planche a press ( semi supino )', 'Calistenia', 'Empuje', 'Planche', 'Planche', 'Avanzado', true,
   'Desde lean planche presionar hacia el press con agarre semi supino (RIR 1).'),
  ('10 extensiones de lumbar +2kg , Hollow con 2 kg por lado + rechazos escapulares en lean planche', 'Calistenia', 'Core', 'Compresión', 'Core', 'Intermedio', true,
   'Combo: extensiones de lumbar con 2 kg, hollow con 2 kg por lado y rechazos escapulares en lean planche.'),
  ('Negativa de tuck a tuck avanzado con tobilleras a hold 3"-5"', 'Calistenia', 'Empuje', 'Planche', 'Planche', 'Intermedio', true,
   'Negativa de tuck a tuck avanzado con tobilleras, terminando en hold de 3-5 s.'),
  ('Raises en half front lever (enfasis en retraccion en palanca)', 'Calistenia', 'Tirón', 'Front Lever', 'Front Lever', 'Intermedio', true,
   'Raises en half front lever con énfasis en la retracción y la palanca.'),
  ('Retracciones en tuck front lever (bien protaida y bien retraida)', 'Calistenia', 'Tirón', 'Front Lever', 'Front Lever', 'Intermedio', true,
   'Retracciones en tuck front lever con protracción y retracción marcadas.'),
  ('Dragon flag isométrico +2kg tobilleras', 'Calistenia', 'Core', 'Anti-extensión', 'Dragon Flag', 'Intermedio', true,
   'Dragon flag isométrico con 2 kg extra en tobilleras.'),
  ('Negativa de straddle planche / half straddle asistida a hold 3"', 'Calistenia', 'Empuje', 'Planche', 'Planche', 'Avanzado', true,
   'Negativa de straddle o half straddle asistida terminando en hold de 3 s.'),
  ('Lean planche straddle a straddle hold 2-3" (banda media gruesa , enfasis en transicion)', 'Calistenia', 'Empuje', 'Planche', 'Planche', 'Avanzado', true,
   'Transición de lean planche a straddle hold de 2-3 s con banda media gruesa.'),
  ('Handstand push ups profundas', 'Calistenia', 'Empuje', 'Empuje vertical', 'Handstand', 'Avanzado', true,
   'Handstand push-ups con rango profundo de movimiento.'),
  ('Press de front full a negativa de half a hold 3"', 'Calistenia', 'Tirón', 'Front Lever', 'Front Lever', 'Avanzado', true,
   'Press de front full, negativa a half y hold de 3 s.'),
  ('Pull up en tuck avanzado', 'Calistenia', 'Tirón', 'Front Lever', 'Front Lever', 'Intermedio', true,
   'Pull up manteniendo tuck avanzado de front lever (calidad, no cantidad).'),
  ('L sit 3" a front 3" ( barra alta , repetir 2-3 veces , procurar palanca y retraccion )', 'Calistenia', 'Tirón', 'Front Lever', 'Front Lever', 'Avanzado', true,
   'L sit 3" a front 3" en barra alta, repetir 2-3 veces buscando palanca y retracción.'),
  ('Dominadas lastradas 10-15kg', 'Calistenia', 'Tirón', 'Dominadas', null, 'Avanzado', true,
   'Dominadas lastradas con 10-15 kg: pausa de 3" arriba, negativa lenta y subida explosiva.')
on conflict (nombre, disciplina) do nothing;

-- ============================================================
-- 2) REEMPLAZO DE LA SEMANA 5 (idempotente)
-- ============================================================
do $$
declare
  v_entrenador uuid := '53184a73-8b1e-4e61-ad42-24bc3cae61d5';
  v_programa   text;
  v_program_id uuid;
  v_week5      uuid;
  v_week4      uuid;
  v_workout_id uuid;
  v_week4_id   uuid;
  v_d          integer;
  v_fila       record;
  v_ej         uuid;
  v_copia      record;
  v_total      integer;
begin
  -- 2.1) contenido nuevo: (programa, dia, orden, ejercicio, series,
  --      repeticiones, tiempo, rir, peso, notas)
  create temp table tmp_w5 (
    programa text, dia int, orden int, ejercicio text, series int,
    repeticiones text, tiempo text, rir int, peso text, notas text
  ) on commit drop;

  insert into tmp_w5 values
  -- ===== LUIS · Plancha / Front Level Avanzado =====
  -- Día 1 · fuerza específica de plancha
  ('Plancha / Front Level Avanzado', 1, 1, 'Intentos de full planche desde cajón (desde lean planche)', 3, null, '3 seg', null, null, null),
  ('Plancha / Front Level Avanzado', 1, 2, 'Half planche', 3, null, '4-5 seg', null, null, null),
  ('Plancha / Front Level Avanzado', 1, 3, 'Negativa a hold de half planche (banda fina)', 5, null, '1 + 3 s', null, null, null),
  ('Plancha / Front Level Avanzado', 1, 4, 'half hold 3" + push-up negativo a 90° hold ( 3-5" ) ( banda fina )', 3, null, '3 s + 3-5 s', null, null, null),
  ('Plancha / Front Level Avanzado', 1, 5, 'Wide handstand push-up', 3, '3,5 pasos', null, 1, null, null),
  ('Plancha / Front Level Avanzado', 1, 6, 'Lean planche semisupino', 5, null, '10 s', null, null, null),
  -- Día 3 · presses
  ('Plancha / Front Level Avanzado', 3, 1, 'Press y negativa de half planche + intento de hold', 4, '1 rep', null, null, null, '4-5 series'),
  ('Plancha / Front Level Avanzado', 3, 2, 'push-ups con dead stop ( bloquear y pausa de 0.5 arriba )', 3, '2 a 3', null, null, null, 'calidad no cantidad'),
  ('Plancha / Front Level Avanzado', 3, 3, '90° hold / 90 degree con lastre', 3, null, null, 1, '+2 kg', null),
  ('Plancha / Front Level Avanzado', 3, 4, 'Press militar a 90° con mancuernas', 3, null, null, 1, '10 kg', null),
  ('Plancha / Front Level Avanzado', 3, 5, 'Lean planche a press ( semi supino )', 5, '5', null, null, null, null),
  ('Plancha / Front Level Avanzado', 3, 6, 'Zanetti isométrico + reps Zanetti', 3, '10', '15–20 s', null, '7,5–10 kg', null),
  ('Plancha / Front Level Avanzado', 3, 7, '10 extensiones de lumbar +2kg , Hollow con 2 kg por lado + rechazos escapulares en lean planche', 3, '10', '30 s', null, '2 kg', null),
  -- ===== EZE · Plancha / Front Level Intermedio =====
  -- Día 1 · plancha
  ('Plancha / Front Level Intermedio', 1, 1, 'Straddle planche con banda', 4, null, '3 s', null, null, null),
  ('Plancha / Front Level Intermedio', 1, 2, 'Negativa de tuck a tuck avanzado con tobilleras a hold 3"-5"', 4, null, null, null, null, null),
  ('Plancha / Front Level Intermedio', 1, 3, 'Negativa de 90° a hold', 3, '2', '3 s', null, null, null),
  ('Plancha / Front Level Intermedio', 1, 4, 'Lean planche con paralelas y cajón', 5, null, '10 s', null, null, 'buscar inclinacion y exigirse en la palanca'),
  -- Día 2 · front lever
  ('Plancha / Front Level Intermedio', 2, 1, 'Front lever full asistido / half (énfasis en retracción)', 3, null, '10 s', null, null, null),
  ('Plancha / Front Level Intermedio', 2, 2, 'Negativa de half front lever', 3, '2', null, null, null, null),
  ('Plancha / Front Level Intermedio', 2, 3, 'Touch advanced tuck + negativa lenta', 4, null, '3 s', null, null, 'negativa lenta sin perder retracción'),
  ('Plancha / Front Level Intermedio', 2, 4, 'Raises en half front lever (enfasis en retraccion en palanca)', 3, '2–3', null, null, null, null),
  ('Plancha / Front Level Intermedio', 2, 5, 'Retracciones en tuck front lever (bien protaida y bien retraida)', 5, '4–5', null, null, null, 'lentas'),
  ('Plancha / Front Level Intermedio', 2, 6, 'Dragon flag isométrico +2kg tobilleras', 4, null, '15–20 s', null, '2 kg', null),
  -- Día 3 · plancha
  ('Plancha / Front Level Intermedio', 3, 1, 'Negativa de straddle planche / half straddle asistida a hold 3"', 4, '1', null, null, null, null),
  ('Plancha / Front Level Intermedio', 3, 2, 'Lean planche straddle a straddle hold 2-3" (banda media gruesa , enfasis en transicion)', 4, '2–4', null, null, null, null),
  ('Plancha / Front Level Intermedio', 3, 3, 'Press desde tuck a negativa de advanced tuck', 5, '1', null, null, null, null),
  ('Plancha / Front Level Intermedio', 3, 4, 'Handstand push ups profundas', 3, null, null, 2, null, null),
  ('Plancha / Front Level Intermedio', 3, 5, 'Press militar a 90°', 3, null, null, 1, '10–20 kg', null),
  ('Plancha / Front Level Intermedio', 3, 6, 'Lean planche a press con paralelas y cajón', 5, '5', null, null, null, null),
  ('Plancha / Front Level Intermedio', 3, 7, 'Zanetti isométrico + reps', 3, '10', '30 s', null, '5 kg', null),
  ('Plancha / Front Level Intermedio', 3, 8, 'Rechazos escapulares en lean planche con banda + plancha de antebrazos', 4, '10', '40 s', null, null, 'protracción y depresión escapular'),
  -- Día 4 · front lever
  ('Plancha / Front Level Intermedio', 4, 1, 'Press de front full a negativa de half a hold 3"', 4, '1', null, null, null, 'hold de 3 s'),
  ('Plancha / Front Level Intermedio', 4, 2, 'Pull up en tuck avanzado', 3, null, null, 2, null, 'calidad no cantidad'),
  ('Plancha / Front Level Intermedio', 4, 3, 'L sit 3" a front 3" ( barra alta , repetir 2-3 veces , procurar palanca y retraccion )', 3, null, null, null, null, null),
  ('Plancha / Front Level Intermedio', 4, 4, 'Retracciones en tuck front lever', 3, '4–5', null, null, null, 'lentas'),
  ('Plancha / Front Level Intermedio', 4, 5, 'Dominadas lastradas 10-15kg', 3, null, null, 2, '10-15 kg', '3" pausa arriba de la pera, negativa lenta y subida explosiva; repetir en cada una'),
  ('Plancha / Front Level Intermedio', 4, 6, 'Carusos: mantenimiento + reps', 3, '10', '20 s', null, '5 kg', null),
  ('Plancha / Front Level Intermedio', 4, 7, 'Dragon flag completo con lastre', 3, '2–4', null, null, '1 kg por pierna', null);

  -- 2.2) recorrer ambos programas
  for v_programa in
    select distinct programa from tmp_w5 order by programa
  loop
    select id into v_program_id
      from public.programs
     where entrenador_id = v_entrenador and nombre = v_programa.programa;
    if v_program_id is null then
      raise warning 'Programa no encontrado: %', v_programa.programa;
      continue;
    end if;

    select id into v_week5 from public.weeks
     where program_id = v_program_id and numero = 5;
    if v_week5 is null then
      raise warning 'Sin semana 5: %', v_programa.programa;
      continue;
    end if;

    -- 2.3) vaciar TODO el contenido previo de la semana 5 (días 1-4)
    delete from public.workout_exercises
     where workout_id in (
       select id from public.workouts where week_id = v_week5 and dia between 1 and 4
     );
    raise notice 'Semana 5 vaciada: %', v_programa.programa;

    -- 2.4) garantizar las 4 sesiones
    for v_d in 1..4 loop
      select id into v_workout_id from public.workouts
       where week_id = v_week5 and dia = v_d;
      if v_workout_id is null then
        insert into public.workouts (week_id, nombre, dia, orden, es_combo)
        values (v_week5,
                case v_d when 1 then 'Día 1 · Plancha' when 2 then 'Día 2 · Front Lever' when 3 then 'Día 3 · Plancha' else 'Día 4 · Front Lever' end,
                v_d, v_d, false)
        returning id into v_workout_id;
      end if;

      -- 2.5) días con contenido nuevo (1 y 3 de Luis; 1-4 de Eze)
      if exists (select 1 from tmp_w5 where programa = v_programa.programa and dia = v_d) then
        for v_fila in
          select * from tmp_w5
           where programa = v_programa.programa and dia = v_d
           order by orden
        loop
          select e.id into v_ej from public.exercises e
           where e.nombre = v_fila.ejercicio and e.disciplina = 'Calistenia'
           limit 1;
          if v_ej is null then
            raise warning 'Ejercicio no encontrado: %', v_fila.ejercicio;
            continue;
          end if;

          insert into public.workout_exercises
            (workout_id, exercise_id, orden, series, repeticiones, tiempo, rir, descanso_segundos, peso, notas)
          values (v_workout_id, v_ej, v_fila.orden, v_fila.series, v_fila.repeticiones,
                  v_fila.tiempo, v_fila.rir, 180, v_fila.peso, v_fila.notas);
        end loop;

      elsif v_programa.programa = 'Plancha / Front Level Avanzado' and v_d in (2, 4) then
        -- 2.6) LUIS: días 2 y 4 → copiar el contenido de la semana 3
        --   (la semana 4 es descarga: solo días 1 y 3 tienen trabajo)
        select id into v_week4 from public.weeks
         where program_id = v_program_id and numero = 3;
        select id into v_week4_id from public.workouts
         where week_id = v_week4 and dia = v_d;

        select count(*) into v_total
          from public.workout_exercises where workout_id = v_week4_id;

        if v_week4_id is not null and v_total > 0 then
          insert into public.workout_exercises
            (workout_id, exercise_id, orden, series, repeticiones, tiempo, rir,
             descanso_segundos, peso, tempo, asistencia, notas, video_url)
          select v_workout_id, exercise_id, orden, series, repeticiones, tiempo, rir,
                 descanso_segundos, peso, tempo, asistencia, notas, video_url
            from public.workout_exercises
           where workout_id = v_week4_id;
          raise notice '%: día % copiado de la semana 3 (% filas)', v_programa.programa, v_d, v_total;
        else
          raise notice '%: día % SIN contenido en la semana 3 (queda vacío)', v_programa.programa, v_d;
        end if;
      end if;
    end loop;
  end loop;

  raise notice 'Atletix: semana 5 de Luis (Avanzado) y Eze (Intermedio) recargada.';
end $$;

-- ============================================================
-- Verificación
-- ============================================================
select p.nombre, w.numero, wo.dia, wo.nombre as sesion,
       count(we.id) as ejercicios
  from public.programs p
  join public.weeks w on w.program_id = p.id and w.numero = 5
  join public.workouts wo on wo.week_id = w.id
  left join public.workout_exercises we on we.workout_id = wo.id
 where p.entrenador_id = '53184a73-8b1e-4e61-ad42-24bc3cae61d5'
   and p.nombre in ('Plancha / Front Level Avanzado', 'Plancha / Front Level Intermedio')
 group by p.id, p.nombre, w.numero, wo.dia, wo.nombre, wo.orden
 order by p.nombre, wo.dia;