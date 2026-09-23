-- ============================================================
-- ATLETIX · 0071 · PROGRAMAS ISOMÉTRICOS 4×4 (vacíos, semana 4 descarga)
-- ============================================================
-- Crea 4 programas para el entrenador 53184a73-8b1e-4e61-ad42-24bc3cae61d5:
--   · Planche Intermedio    (planche/Intermedio)  → reemplaza el del catálogo
--   · Planche Avanzado      (planche/Avanzado)
--   · Front Lever Avanzado  (front_lever/Avanzado)
--   · Front Lever Élite     (front_lever/Elite)
-- Cada uno: 4 semanas × 4 sesiones vacías; la semana 4 es descarga
--   (es_descarga = true). Sin ejercicios: el entrenador los carga después.
-- Idempotente por (entrenador_id, nombre); semanas por (program_id, numero)
-- y sesiones por (week_id, dia). El catálogo TS ya no incluye estos
-- programas, así que el loader no los recrea.
-- ============================================================

do $$
declare
  v_entrenador uuid := '53184a73-8b1e-4e61-ad42-24bc3cae61d5';
  prog text[][][] := array[
    array['Planche Intermedio', 'planche', 'Intermedio'],
    array['Planche Avanzado', 'planche', 'Avanzado'],
    array['Front Lever Avanzado', 'front_lever', 'Avanzado'],
    array['Front Lever Élite', 'front_lever', 'Elite']
  ];
  p text[];
  v_program_id uuid;
  v_week_id uuid;
  i integer;
  w integer;
  d integer;
  v_count integer;
begin
  -- reemplazo del Planche Intermedio del catálogo: borra todas las copias
  -- existentes de ese programa (las FK cascade limpian semanas/sesiones).
  delete from public.programs p
   where p.nombre = 'Planche Intermedio'
     and (p.entrenador_id is distinct from v_entrenador);

  foreach p slice 1 in array prog loop
    select count(*) into v_count
      from public.programs
     where entrenador_id = v_entrenador and nombre = p[1];
    if v_count = 0 then
      insert into public.programs (entrenador_id, nombre, categoria, nivel, objetivo, descripcion, duracion_semanas, activo)
      values (v_entrenador, p[1], p[2], p[3],
              'Programa isométrico de 4 semanas (última semana de descarga).',
              'Estructura de 4 semanas × 4 sesiones (sin ejercicios).',
              4, true)
      returning id into v_program_id;
    else
      select id into v_program_id
        from public.programs
       where entrenador_id = v_entrenador and nombre = p[1]
       limit 1;
    end if;

    -- 4 semanas (la 4ª es descarga)
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

  raise notice 'Atletix: 4 programas isométricos 4×4 listos o ya existentes.';
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
   and p.nombre in ('Planche Intermedio', 'Planche Avanzado', 'Front Lever Avanzado', 'Front Lever Élite')
 group by p.id, p.nombre, p.categoria, p.nivel
 order by p.nombre;