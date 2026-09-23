-- ============================================================
-- ATLETIX · 0072 · PROGRAMA ASESORÍA ONLINE "LUIS Y EZE" 4×4
-- ============================================================
-- Nuevo programa único para el entrenador 53184a73-8b1e-4e61-ad42-24bc3cae61d5:
--   · Asesoría online · luis y eze  (asesoria_online/Principiante)
-- 4 semanas × 4 sesiones vacías; la semana 4 es descarga (es_descarga = true).
-- NO borra los programas separados "Asesoría online · luis" / "· eze".
-- Idempotente por (entrenador_id, nombre); semanas por (program_id, numero)
-- y sesiones por (week_id, dia). No está en el catálogo TS.
-- ============================================================

do $$
declare
  v_entrenador uuid := '53184a73-8b1e-4e61-ad42-24bc3cae61d5';
  v_nombre text := 'Asesoría online · luis y eze';
  v_categoria text := 'asesoria_online';
  v_nivel text := 'Principiante';
  v_program_id uuid;
  v_week_id uuid;
  i integer;
  w integer;
  d integer;
  v_count integer;
begin
  select count(*) into v_count
    from public.programs
   where entrenador_id = v_entrenador and nombre = v_nombre;

  if v_count = 0 then
    insert into public.programs (entrenador_id, nombre, categoria, nivel, objetivo, descripcion, duracion_semanas, activo)
    values (v_entrenador, v_nombre, v_categoria, v_nivel,
            'Asesoría online de 4 semanas para luis y eze (última semana de descarga).',
            'Estructura de 4 semanas × 4 sesiones (sin ejercicios).',
            4, true)
    returning id into v_program_id;
  else
    select id into v_program_id
      from public.programs
     where entrenador_id = v_entrenador and nombre = v_nombre
     limit 1;
  end if;

  for w in 1..4 loop
    select id into v_week_id
      from public.weeks
     where program_id = v_program_id and numero = w;
    if v_week_id is null then
      insert into public.weeks (program_id, numero, objetivo, es_descarga)
      values (v_program_id, w,
              case when w = 4 then 'Semana de descarga.' else format('Semana %s', w) end,
              w = 4)
      returning id into v_week_id;
    end if;

    for d in 1..4 loop
      i := (select count(*) from public.workouts where week_id = v_week_id and dia = d);
      if i = 0 then
        insert into public.workouts (week_id, nombre, dia, orden, descripcion, es_combo)
        values (v_week_id, format('Día %s', d), d, d, 'Sesión sin ejercicios todavía.', false);
      end if;
    end loop;
  end loop;

  raise notice 'Atletix: programa "Asesoría online · luis y eze" 4×4 listo o ya existente.';
end $$;

-- Verificación
select p.nombre, p.categoria, p.nivel,
       count(distinct w.id) as semanas,
       count(wo.id) as sesiones,
       bool_or(w.numero = 4 and w.es_descarga) as descarga_s4
  from public.programs p
  left join public.weeks w on w.program_id = p.id
  left join public.workouts wo on wo.week_id = w.id
 where p.entrenador_id = '53184a73-8b1e-4e61-ad42-24bc3cae61d5'
   and p.nombre = 'Asesoría online · luis y eze'
 group by p.id, p.nombre, p.categoria, p.nivel;