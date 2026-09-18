-- ============================================================
-- ATLETIX · FASE 18.1 · CIERRE DE LA CLASIFICACION DE CALISTENIA
-- ------------------------------------------------------------
-- Decisiones tomadas:
--   · Los 6 ejercicios REALES que quedaron "a revisar" se clasifican.
--   · Los 17 combos / "a eleccion" / "repetir" se dejan en 'revisar'.
--   · Los 12 duplicados se dejan marcados.
--   · No se borra ni se oculta (activo) nada.
--
-- Pegar en: Supabase -> SQL Editor -> Run
-- ============================================================

-- superman -> Core / Anti-extensión
update public.exercises set
  categoria = 'Core', subcategoria = 'Anti-extensión', movement_type = 'Dinámico',
  skill = null, muscle_group = 'Core', objetivo = 'Fuerza', estado_clasificacion = 'clasificado'
where disciplina = 'Calistenia' and nombre = 'superman';

-- Dead Push up -> Empuje / Empuje vertical (90 Degree)
update public.exercises set
  categoria = 'Empuje', subcategoria = 'Empuje vertical', movement_type = 'Excéntrico',
  skill = '90 Degree', muscle_group = 'Hombros', objetivo = 'Fuerza', estado_clasificacion = 'clasificado'
where disciplina = 'Calistenia' and nombre = 'Dead Push up';

-- Press militar con mancuernas -> Empuje / Accesorios de empuje
update public.exercises set
  categoria = 'Empuje', subcategoria = 'Accesorios de empuje', movement_type = 'Dinámico',
  skill = null, muscle_group = 'Hombros', objetivo = 'Hipertrofia', estado_clasificacion = 'clasificado'
where disciplina = 'Calistenia' and nombre = 'Press militar con mancuernas';

-- Elevaciones frontales supinas + laterales -> Empuje / Accesorios de empuje
update public.exercises set
  categoria = 'Empuje', subcategoria = 'Accesorios de empuje', movement_type = 'Dinámico',
  skill = null, muscle_group = 'Hombros', objetivo = 'Hipertrofia', estado_clasificacion = 'clasificado'
where disciplina = 'Calistenia' and nombre = 'Elevaciones frontales supinas + laterales';

-- Front Straddle Touch -> Tirón / Front Lever
update public.exercises set
  categoria = 'Tirón', subcategoria = 'Front Lever', movement_type = 'Dinámico',
  skill = 'Front Lever', muscle_group = 'Espalda', objetivo = 'Fuerza', estado_clasificacion = 'clasificado'
where disciplina = 'Calistenia' and nombre = 'Front Straddle Touch';

-- Back Tuck -> Skills / Otros (skill / dinámico)
update public.exercises set
  categoria = 'Skills', subcategoria = 'Otros', movement_type = 'Dinámico',
  skill = null, muscle_group = 'Cuerpo completo', objetivo = 'Skill', estado_clasificacion = 'clasificado'
where disciplina = 'Calistenia' and nombre = 'Back Tuck';

-- VERIFICACION: a_revisar debe quedar en 17 y clasificados en 235
select 'FASE 18.1 OK' as estado,
  (select count(*) from public.exercises where disciplina = 'Calistenia') as calistenia,
  (select count(*) from public.exercises where disciplina = 'Calistenia' and estado_clasificacion = 'revisar') as a_revisar,
  (select count(*) from public.exercises where disciplina = 'Calistenia' and estado_clasificacion = 'clasificado') as clasificados;
