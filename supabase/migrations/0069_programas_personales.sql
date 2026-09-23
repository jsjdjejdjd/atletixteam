-- ============================================================
-- ATLETIX · 5 PROGRAMAS PERSONALES + ESTRUCTURA 4 SEMANAS × 4 SESIONES
-- ============================================================
-- · Programas: nico / thiago y Asesoría online · luis, eze, isaac.
-- · Cada uno: 4 semanas × 4 sesiones por semana, SIN ejercicios
--   (el entrenador los carga después en el panel).
-- · Idempotente por (entrenador_id, nombre): si ya existe no duplica;
--   semanas y sesiones por unique (program_id, numero) y (week_id, dia).
-- · Entrenador = user 53184a73-8b1e-4e61-ad42-24bc3cae61d5.
-- ============================================================

do $$
declare
  v_entrenador uuid := '53184a73-8b1e-4e61-ad42-24bc3cae61d5';
  prog text[][][] := array[
    array['nico', 'general', 'Principiante'],
    array['thiago', 'general', 'Intermedio'],
    array['Asesoría online · luis', 'asesoria_online', 'Principiante'],
    array['Asesoría online · eze', 'asesoria_online', 'Intermedio'],
    array['Asesoría online · isaac', 'asesoria_online', 'Avanzado']
  ];
  p text[];
  v_program_id uuid;
  v_week_id uuid;
  i integer;
  w integer;
  d integer;
  v_count integer;
begin
  foreach p slice 1 in array prog loop
    -- programa (solo si no existe para este entrenador)
    select count(*) into v_count
      from public.programs
     where entrenador_id = v_entrenador and nombre = p[1];
    if v_count = 0 then
      insert into public.programs (entrenador_id, nombre, categoria, nivel, objetivo, descripcion, duracion_semanas, activo)
      values (v_entrenador, p[1], p[2], p[3],
              'Programa personalizado de entrenamiento.',
              'Estructura de 4 semanas × 4 sesiones (sin ejercicios).',
              4, true)
      returning id into v_program_id;
    else
      select id into v_program_id
        from public.programs
       where entrenador_id = v_entrenador and nombre = p[1]
       limit 1;
    end if;

    -- 4 semanas
    for w in 1..4 loop
      select id into v_week_id
        from public.weeks
       where program_id = v_program_id and numero = w;
      if v_week_id is null then
        insert into public.weeks (program_id, numero, objetivo)
        values (v_program_id, w, format('Semana %s', w))
        returning id into v_week_id;
      end if;

      -- 4 sesiones por semana (vacíos)
      for d in 1..4 loop
        i := (select count(*) from public.workouts where week_id = v_week_id and dia = d);
        if i = 0 then
          insert into public.workouts (week_id, nombre, dia, orden, descripcion, es_combo)
          values (v_week_id, format('Día %s', d), d, d, 'Sesión sin ejercicios todavía.', false);
        end if;
      end loop;
    end loop;
  end loop;

  raise notice 'Atletix: 5 programas personales (4 semanas × 4 sesiones c/u) listos o ya existentes.';
end $$;

-- Verificación
select p.nombre, p.categoria, p.nivel, count(distinct w.id) as semanas, count(wo.id) as sesiones
  from public.programs p
  left join public.weeks w on w.program_id = p.id
  left join public.workouts wo on wo.week_id = w.id
 where p.entrenador_id = '53184a73-8b1e-4e61-ad42-24bc3cae61d5'
   and p.nombre in ('nico', 'thiago', 'Asesoría online · luis', 'Asesoría online · eze', 'Asesoría online · isaac')
 group by p.id, p.nombre, p.categoria, p.nivel
 order by p.nombre;