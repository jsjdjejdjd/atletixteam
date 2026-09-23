-- ============================================================
-- ATLETIX · 0073 · PLANCHA / FRONT LEVEL COMBINADOS (con contenido)
-- ============================================================
-- Crea los 3 programas combinados del entrenador
-- 53184a73-8b1e-4e61-ad42-24bc3cae61d5:
--   · Plancha / Front Level Intermedio (planche/Intermedio)
--   · Plancha / Front Level Avanzado   (planche/Avanzado)
--   · Plancha / Front Level Elite      (planche/Elite)
-- Cada uno: 4 semanas × 4 sesiones; la semana 4 es descarga.
--   Día 1 y 3 → Plancha (empuje) · Día 2 y 4 → Front Lever (tirón).
--   En Elite los días 2 y 4 quedan vacíos (sin contenido provisto).
-- Todo el contenido se replica en las 4 semanas.
-- Reglas de carga: todo técnico a RIR 2 · asistidos 4 series ·
--   resto 3 series · descanso 2-4 min (180 s) · reps de calidad,
--   no buscar el fallo. Los cues del entrenador quedan en `notas`.
-- Borra además los 4 programas isométricos separados vacíos
--   (Planche Intermedio/Avanzado, Front Lever Avanzado/Élite).
-- Idempotente: ejercicios por (nombre, disciplina), programas por
--   (entrenador_id, nombre), semanas por (program_id, numero),
--   sesiones por (week_id, dia) y ejercicios SOLO si la sesión
--   está vacía (no pisa lo que el entrenador ya cargó a mano).
-- ============================================================

-- ============================================================
-- 1) EJERCICIOS NUEVOS necesarios para el contenido
-- ============================================================
insert into public.exercises
  (nombre, disciplina, categoria, subcategoria, skill, dificultad, activo, descripcion)
values
  ('Negativa de tuck avanzado', 'Calistenia', 'Empuje', 'Planche', 'Planche', 'Intermedio', true,
   'Negativa controlada desde tuck avanzado volviendo a la posición de hold (RIR 2).'),
  ('90 degree / (-) 90 degree', 'Calistenia', 'Empuje', 'Planche', 'Planche', 'Avanzado', true,
   'Retención a 90° combinada con la negativa a 90° (RIR 2).'),
  ('Lean a press', 'Calistenia', 'Empuje', 'Planche', 'Planche', 'Avanzado', true,
   'Transición desde lean planche presionando hacia el press (RIR 2).'),
  ('V sit sentado + superman lumbar', 'Calistenia', 'Core', 'Compresión', 'Core', 'Intermedio', true,
   'Compresión y extensión lumbar: V sit sentado + superman lumbar (RIR 2).'),
  ('Retracciones en tuck', 'Calistenia', 'Tirón', 'Front Lever', 'Front Lever', 'Intermedio', true,
   'Retracción escapular manteniendo tuck de front lever (RIR 2).'),
  ('Retracciones en tuck avanzado', 'Calistenia', 'Tirón', 'Front Lever', 'Front Lever', 'Avanzado', true,
   'Retracción escapular manteniendo tuck avanzado de front lever (RIR 2).'),
  ('L sit a full front lever', 'Calistenia', 'Tirón', 'Front Lever', 'Front Lever', 'Avanzado', true,
   'Desde L sit elongar hasta el full front lever en barra alta (RIR 2).')
on conflict (nombre, disciplina) do nothing;

-- ============================================================
-- 2) CARGA DE PROGRAMAS (idempotente)
-- ============================================================
do $$
declare
  v_entrenador uuid := '53184a73-8b1e-4e61-ad42-24bc3cae61d5';
  v_programa record;
  v_fila record;
  v_program_id uuid;
  v_week_id uuid;
  v_workout_id uuid;
  v_total integer;
  v_old integer;
begin
  -- 2.0) borrar los programas isométricos separados vacíos del entrenador
  for v_programa in
    select pr.id, pr.nombre
      from public.programs pr
     where pr.entrenador_id = v_entrenador
       and pr.nombre in ('Planche Intermedio', 'Planche Avanzado', 'Front Lever Avanzado', 'Front Lever Élite')
  loop
    select count(*) into v_total
      from public.athlete_programs
     where program_id = v_programa.id;
    if v_total = 0 then
      delete from public.programs where id = v_programa.id;
      raise notice 'Borrado separado vacío: %', v_programa.nombre;
    else
      raise notice 'No se borra % (tiene alumnos).', v_programa.nombre;
    end if;
  end loop;

  -- 2.1) contenido: (programa, dia, orden, ejercicio, cue, peso)
  create temp table tmp_plancha_content (
    programa text, dia int, orden int, ejercicio text, cue text, peso text
  ) on commit drop;

  insert into tmp_plancha_content values
  -- Plancha / Front Level Intermedio
  ('Plancha / Front Level Intermedio', 1, 1, 'hold tuck adv 12"', 'Tuck avanzado hold', null),
  ('Plancha / Front Level Intermedio', 1, 2, 'Negativa de tuck avanzado', 'Negativa de tuck avanzado + hold', null),
  ('Plancha / Front Level Intermedio', 1, 3, '90 degree / (-) 90 degree', '90 degree / (-) 90 degree', null),
  ('Plancha / Front Level Intermedio', 1, 4, 'Lean planche + hold en pseudoplanche', 'Lean planche', null),
  ('Plancha / Front Level Intermedio', 1, 5, 'Rechazos escapulares en lean planche', '10 rechazos en lean planche + 10" palanca (lean)', null),
  ('Plancha / Front Level Intermedio', 1, 6, 'Hollow hold', '30" hollow + 2,5kg', '2,5 kg'),
  ('Plancha / Front Level Intermedio', 2, 1, 'Front Lever Full', 'Front hold half / full', null),
  ('Plancha / Front Level Intermedio', 2, 2, 'Negativas de Front', '(-) half / full reps', null),
  ('Plancha / Front Level Intermedio', 2, 3, 'L a tuck front lever (repetir)', 'L sit a tuck avanzado hold', null),
  ('Plancha / Front Level Intermedio', 2, 4, 'Raises en tuck', 'Raises', null),
  ('Plancha / Front Level Intermedio', 2, 5, 'Retracciones en tuck', 'Retracciones en tuck', null),
  ('Plancha / Front Level Intermedio', 2, 6, 'Dragon flag (tuck avanzado o full)', '(-) dragon / max L sit +2kg', '2 kg'),
  ('Plancha / Front Level Intermedio', 3, 1, 'Planche Straddle con banda', 'Half / straddle asistido', null),
  ('Plancha / Front Level Intermedio', 3, 2, 'Negativas de Plancha', '(-) half / straddle reps', null),
  ('Plancha / Front Level Intermedio', 3, 3, '90 Degree push up', 'Flex pino +90 grados', null),
  ('Plancha / Front Level Intermedio', 3, 4, 'Lean a press', 'Lean a press', null),
  ('Plancha / Front Level Intermedio', 3, 5, 'V sit sentado + superman lumbar', '15 V sit sentado + 15 superman lumbar sobre banco', null),
  ('Plancha / Front Level Intermedio', 4, 1, 'Negativa de Front a Hold', '(-) + hold asistido', null),
  ('Plancha / Front Level Intermedio', 4, 2, 'Front Lever Touch', 'Touch tuck avanzado + (-) lenta', null),
  ('Plancha / Front Level Intermedio', 4, 3, 'Negativas de Front', '(-) desde vela half / full', null),
  ('Plancha / Front Level Intermedio', 4, 4, 'retracciones en posicion de remo', 'Retracciones en pos. de remo, lastre en cadera (2kg - 5kg)', 'lastre cadera 2-5 kg'),
  ('Plancha / Front Level Intermedio', 4, 5, 'toques de barra + max L sit o rodillas a 90', '5 toques de barra + max L sit', null),
  -- Plancha / Front Level Avanzado
  ('Plancha / Front Level Avanzado', 1, 1, 'Planche Straddle', 'Straddle / half / full libre', null),
  ('Plancha / Front Level Avanzado', 1, 2, 'Negativas de Plancha', '(-) half libre, buscar control sin hold', null),
  ('Plancha / Front Level Avanzado', 1, 3, '90 Degree push up', '90 degree', null),
  ('Plancha / Front Level Avanzado', 1, 4, 'lean planche profunda', 'Lean planche pesado', null),
  ('Plancha / Front Level Avanzado', 1, 5, 'Rechazos escapulares en lean planche', '10 rechazos en lean planche + 10" palanca (lean)', null),
  ('Plancha / Front Level Avanzado', 1, 6, 'V sit sentado + superman lumbar', '15 V sit sentado + 15 superman lumbar sobre banco + tobilleras 3kg', 'tobilleras 3 kg'),
  ('Plancha / Front Level Avanzado', 2, 1, 'Front Lever Touch', 'Touch 3" libre/asistido', null),
  ('Plancha / Front Level Avanzado', 2, 2, 'Front Lever press', 'Press y (-) wide', null),
  ('Plancha / Front Level Avanzado', 2, 3, 'L sit a full front lever', 'L sit a full hold (barra alta)', null),
  ('Plancha / Front Level Avanzado', 2, 4, 'Retracciones en tuck avanzado', 'Retracciones en tuck avanzado', null),
  ('Plancha / Front Level Avanzado', 2, 5, 'Dragon flag (tuck avanzado o full)', 'Dragon flag reps completas', null),
  ('Plancha / Front Level Avanzado', 3, 1, 'Planche con banda elástica', 'Half / full asistido', null),
  ('Plancha / Front Level Avanzado', 3, 2, 'Plancha Full press', 'Press y (-) asistido', null),
  ('Plancha / Front Level Avanzado', 3, 3, '90 Degree push up', '(-) push up a hold 90 degree 3" (3 reps)', null),
  ('Plancha / Front Level Avanzado', 3, 4, 'Lean a press', 'Lean a press semi supino', null),
  ('Plancha / Front Level Avanzado', 3, 5, '90 Degree push up', 'Flex pino +90 grados', null),
  ('Plancha / Front Level Avanzado', 3, 6, 'V sit sentado + superman lumbar', '15 V sit sentado + 15 superman lumbar', null),
  ('Plancha / Front Level Avanzado', 4, 1, 'Front Lever pull up to touch', 'Pull up / to touch asistido', null),
  ('Plancha / Front Level Avanzado', 4, 2, 'Negativa de Front a Hold', 'Negativa + hold (wide)', null),
  ('Plancha / Front Level Avanzado', 4, 3, 'retracciones en posicion de remo', 'Retracciones en pos. de remo', null),
  ('Plancha / Front Level Avanzado', 4, 4, 'Dragon flag (tuck avanzado o full)', '(-) dragon flag +2kg opcional', 'opcional 2 kg'),
  -- Plancha / Front Level Elite
  ('Plancha / Front Level Elite', 1, 1, 'Plancha Full push up', 'Push up + hold', null),
  ('Plancha / Front Level Elite', 1, 2, 'Negativa de Plancha a Hold', '(-) a hold', null),
  ('Plancha / Front Level Elite', 1, 3, 'Lean planche + hold en pseudoplanche', '3" lean + 3" 90 degree', null),
  ('Plancha / Front Level Elite', 1, 4, 'lean planche profunda', 'Lean planche semi supino', null),
  ('Plancha / Front Level Elite', 1, 5, 'Rechazos escapulares en lean planche', '10 rechazos en lean planche + 10" palanca (lean)', null),
  ('Plancha / Front Level Elite', 1, 6, 'Hollow hold', '30" hollow + 2,5kg', '2,5 kg'),
  ('Plancha / Front Level Elite', 3, 1, 'Full planche supina', 'Plancha supina (asistida)', null),
  ('Plancha / Front Level Elite', 3, 2, 'Full planche supina push ups', 'Push ups supina (asistido)', null),
  ('Plancha / Front Level Elite', 3, 3, 'Negativa de Plancha a Hold', '(-) plancha wide a hold', null),
  ('Plancha / Front Level Elite', 3, 4, 'Lean a press', 'Lean a press sobre cajón', null),
  ('Plancha / Front Level Elite', 3, 5, 'Rechazos escapulares en lean planche', '10 rechazos en lean planche + 10" palanca (lean)', null),
  ('Plancha / Front Level Elite', 3, 6, 'superman', '10 superman lumbar + tobilleras 2kg', 'tobilleras 2 kg');

  -- 2.2) recorrer cada programa combinado
  for v_programa in
    select distinct programa from tmp_plancha_content order by programa
  loop
    select id into v_program_id
      from public.programs
     where entrenador_id = v_entrenador and nombre = v_programa.programa;
    if v_program_id is null then
      insert into public.programs (entrenador_id, nombre, categoria, nivel, objetivo, descripcion, duracion_semanas, activo)
      values (v_entrenador, v_programa.programa,
              'planche',
              case v_programa.programa
                when 'Plancha / Front Level Intermedio' then 'Intermedio'
                when 'Plancha / Front Level Avanzado' then 'Avanzado'
                else 'Elite'
              end,
              'Plancha + Front Lever · 4 semanas (semana 4 de descarga).',
              'Todo técnico a RIR 2 · asistidos 4 series · resto 3 series · descanso 2-4 min · reps de calidad, no buscar el fallo.',
              4, true)
      returning id into v_program_id;
      raise notice 'Creado programa: %', v_programa.programa;
    else
      raise notice 'Programa existente: %', v_programa.programa;
    end if;

    -- 2.3) 4 semanas (la 4ª descarga)
    for w in 1..4 loop
      select id into v_week_id
        from public.weeks
       where program_id = v_program_id and numero = w;
      if v_week_id is null then
        insert into public.weeks (program_id, numero, objetivo, es_descarga)
        values (v_program_id, w,
                case when w = 4
                     then 'Semana de descarga (mismo esquema, priorizá técnica y RIR 2).'
                     else format('Semana %s', w)
                end,
                w = 4)
        returning id into v_week_id;
      end if;

      -- 2.4) garantizar las 4 sesiones (nombre que distingue el enfoque)
      for d in 1..4 loop
        select id into v_workout_id
          from public.workouts
         where week_id = v_week_id and dia = d;
        if v_workout_id is null then
          insert into public.workouts (week_id, nombre, dia, orden, es_combo)
          values (v_week_id,
                  case d when 1 then 'Día 1 · Plancha' when 2 then 'Día 2 · Front Lever' when 3 then 'Día 3 · Plancha' else 'Día 4 · Front Lever' end,
                  d, d, false)
          returning id into v_workout_id;
        end if;

        -- 2.5) rellenar SOLO si la sesión está vacía
        select count(*) into v_old
          from public.workout_exercises
         where workout_id = v_workout_id;
        if v_old > 0 then
          continue;
        end if;

        for v_fila in
          select * from tmp_plancha_content
           where programa = v_programa.programa and dia = d
           order by orden
        loop
          insert into public.workout_exercises
            (workout_id, exercise_id, orden, series, rir, descanso_segundos, peso, notas)
          select v_workout_id, e.id, v_fila.orden,
                 case when lower(v_fila.cue || ' ' || v_fila.ejercicio) like '%asistid%' then 4 else 3 end,
                 2, 180, v_fila.peso, v_fila.cue
            from public.exercises e
           where e.nombre = v_fila.ejercicio
             and e.disciplina = 'Calistenia'
           limit 1;
        end loop;
      end loop;
    end loop;
  end loop;

  raise notice 'Atletix: Plancha / Front Level Intermedio, Avanzado y Elite cargados (o ya existentes).';
end $$;

-- ============================================================
-- Verificación
-- ============================================================
select p.nombre, p.categoria, p.nivel,
       count(distinct w.id) as semanas,
       count(wo.id) as sesiones,
       count(we.id) as ejercicios,
       bool_or(w.numero = 4 and w.es_descarga) as descarga_s4
  from public.programs p
  left join public.weeks w on w.program_id = p.id
  left join public.workouts wo on wo.week_id = w.id
  left join public.workout_exercises we on we.workout_id = wo.id
 where p.entrenador_id = '53184a73-8b1e-4e61-ad42-24bc3cae61d5'
   and p.nombre in ('Plancha / Front Level Intermedio', 'Plancha / Front Level Avanzado', 'Plancha / Front Level Elite')
 group by p.id, p.nombre, p.categoria, p.nivel
 order by p.nombre;