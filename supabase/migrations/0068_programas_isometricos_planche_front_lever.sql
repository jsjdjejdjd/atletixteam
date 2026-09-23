-- ============================================================
-- ATLETIX · 0068 · PROGRAMAS ISOMÉTRICOS PLANCHE / FRONT LEVER
-- ============================================================
-- 1) Ejercicios eslabón faltantes para las escaleras de Planche y
--    Front Lever (band assisted, One Leg, Straddle, ICE) — necesarios
--    para los niveles Intermedio/Avanzado/Élite.
-- 2) Amplía el check de programs.categoria con 'asesoria_online'
--    (el catálogo TS ya la define; sin esto el loader fallaría).
-- 3) Amplía is_planche_member() para matchear por categoría
--    (planche / front_lever) además del nombre exacto, de modo que
--    los programas separados por disciplina sigan teniendo RLS y
--    edición conjunta entrenador↔alumno.
-- Idempotente: on conflict (nombre, disciplina) do nothing.
-- ============================================================

-- ============================================================
-- 1) EJERCICIOS NUEVOS · formato de la biblioteca (col como 0024)
-- ============================================================
insert into public.exercises
  (nombre, nombre_en, aliases, disciplina, categoria, subcategoria, tipo, dificultad, nivel_dificultad,
   equipamiento, tipo_resistencia, tipo_ejercicio, patron, musculos_primarios, musculos_secundarios,
   musculos_estabilizadores, unilateral, cadena_cinetica, objetivo, series_sugeridas, reps_sugeridas,
   descanso_seg, rir_sugerido, descripcion, instrucciones, errores_comunes, precauciones,
   criterio_progresion, regresion, variantes, sustitutos)
values
('Planche con banda elástica', 'Band assisted planche', 'planche asistido con banda, band planche', 'Calistenia', 'Empuje', 'Planche', 'Calistenia', 'Intermedio', 2, 'Banda elástica larga', 'Banda', 'Estabilidad', 'Empuje horizontal', array['Deltoides anterior', 'Pectoral mayor'], array['Tríceps braquial', 'Serrato anterior'], array['Recto abdominal', 'Glúteos', 'Romboides'], false, 'Cerrada', 'Fuerza', 4, '15-30 s', 90, 2, 'Planche asistido con banda anclada arriba (cobra piernas y descarga parte del torque). Escalón del tuck al tuck avanzado sin perder el ángulo.', 'Anclá la banda a una paralela o punto alto, pasala por debajo de los hombros y buscá la posición de planche tuck sosteniendo la inclinación y la protracción.', 'Arquear la lumbar; encoger los hombros; dejar caer la cadera; apoyar peso en la banda.', 'Empezá con bandas de mucha resistencia y andá bajando de grosor.', 'Reducí la resistencia de la banda o subí el tiempo al completar 4x30 s.', 'Tuck Planche.', array['Planche con banda (tuck)', 'Tuck planche en paralelas'], array['Tuck Planche', 'Advanced Tuck Planche']),
('Planche One Leg', 'One leg planche', 'planche a una pierna, one leg planche', 'Calistenia', 'Empuje', 'Planche', 'Calistenia', 'Avanzado', 3, 'Suelo o paralelas', 'Peso corporal', 'Estabilidad', 'Empuje horizontal', array['Deltoides anterior', 'Pectoral mayor', 'Serrato anterior'], array['Tríceps braquial', 'Oblicuos'], array['Recto abdominal', 'Glúteos', 'Cuádriceps'], false, 'Cerrada', 'Fuerza', 4, '10-25 s', 120, 2, 'Una pierna extendida y la otra doblada: eslabón intermedio entre el tuck avanzado y el straddle planche.', 'En advanced tuck, extendé lentamente una pierna manteniendo cadera a la altura de los hombros y protracción fuerte.', 'Bajar la cadera al extender la pierna; rotar el torso; caer sobre la banda mental.', 'Mantené la pierna doblada pegada al pecho hasta dominar el equilibrio.', 'Extendé la segunda pierna hacia straddle al llegar a 4x20 s sólidos.', 'Advanced Tuck Planche.', array['Planche One Leg (pierna derecha)', 'Planche One Leg (pierna izquierda)'], array['Advanced Tuck Planche', 'Planche Straddle']),
('Planche Straddle con banda', 'Band assisted straddle planche', 'straddle con banda, band straddle', 'Calistenia', 'Empuje', 'Planche', 'Calistenia', 'Avanzado', 3, 'Banda elástica larga', 'Banda', 'Estabilidad', 'Empuje horizontal', array['Deltoides anterior', 'Pectoral mayor'], array['Serrato anterior', 'Tríceps braquial'], array['Recto abdominal', 'Aductores', 'Glúteos'], false, 'Cerrada', 'Fuerza', 4, '10-20 s', 120, 2, 'Straddle planche con banda que descarga parcialmente el torque de hombro. Puente hacia el straddle libre.', 'Con la banda anclada arriba pasando por los hombros, abrí piernas en straddle y sostené el cuerpo horizontal.', 'Cerrar muy las piernas (sin banda sería avanzar antes de tiempo); arquear la lumbar.', 'Solo avanzá a este nivel si mantenés 20 s de planche one leg sin dolor.', 'Sacá la banda o aumentá segundos al completar 4x20 s.', 'Planche One Leg.', array['Straddle con banda abierta', 'Straddle band en paralelas'], array['Planche Straddle', 'Planche One Leg']),
('Front Lever con banda elástica', 'Band assisted front lever', 'front lever asistido con banda, band front lever', 'Calistenia', 'Tirón', 'Front Lever', 'Calistenia', 'Intermedio', 2, 'Barra y banda elástica larga', 'Banda', 'Estabilidad', 'Tirón horizontal', array['Dorsal ancho', 'Recto abdominal', 'Transverso abdominal'], array['Oblicuos', 'Glúteos', 'Romboides'], array['Agarre', 'Pecho'], false, 'Cerrada', 'Fuerza', 4, '15-30 s', 90, 2, 'Front lever asistido con banda anclada al frente o a la espalda: descarga parte del peso y permite aprender la línea corporal completa.', 'Anclá la banda a la barra (nudo) o a un punto bajo con ayuda, colgate supino y extendé el cuerpo con la cadera a la altura.', 'Arquear la cadera (puente); doblar rodillas; encoger los hombros.', 'La banda debe quedar tensa PERO permitirte sentir la retracción escapular.', 'Reducí grosor de banda o subí el tiempo al completar 4x30 s.', 'Front Lever Tuck.', array['Front lever con banda (tuck)', 'Front lever tuck avanzado con banda'], array['Front Lever Tuck', 'Front Lever One Leg']),
('Front Lever Straddle', 'Straddle front lever', 'front lever con piernas abiertas', 'Calistenia', 'Tirón', 'Front Lever', 'Calistenia', 'Avanzado', 3, 'Barra o anillas', 'Peso corporal', 'Estabilidad', 'Tirón horizontal', array['Dorsal ancho', 'Recto abdominal', 'Transverso abdominal'], array['Oblicuos', 'Glúteos', 'Romboides'], array['Agarre', 'Trapecio medio'], false, 'Cerrada', 'Fuerza', 4, '10-25 s', 120, 2, 'Eslabón faltante entre el front lever a una pierna y el completo: abrir piernas en straddle acorta el brazo de palanca.', 'Desde front lever a una pierna, abrí la segunda pierna en straddle manteniendo cadera neutra y espalda en línea.', 'Arquear el torso; dejar caer la cadera; rotar hacia el agarre.', 'Abrí las piernas lo que necesites para mantener el cuerpo horizontal.', 'Cerralas gradualmente hasta piernas juntas al sostener 4x20 s.', 'Front Lever One Leg.', array['Front Lever Straddle (abierto)', 'Front Lever Straddle band'], array['Front Lever One Leg', 'Front Lever Completo']),
('Ice Cream Maker', 'Ice Cream Maker', 'ice cream maker planche', 'Calistenia', 'Dinámicos', 'Planche', 'Calistenia', 'Elite', 5, 'Paralelas o suelo', 'Peso corporal', null, 'Empuje horizontal', array['Deltoides anterior', 'Pectoral mayor', 'Serrato anterior'], array['Tríceps braquial', 'Oblicuos', 'Glúteos'], array['Recto abdominal', 'Cuádriceps'], false, 'Cerrada', 'Potencia', 4, '3-5', 180, 2, 'Variante dinámica de planche completa: desde planche tuck, solo girás la cadera (rodillas) de lado a lado como un péndulo de helado.', 'En planche tuck sobre paralelas, incliná piernas juntas a un costado sin que el torso rote, volvé al centro y lleválas al otro.', 'Rotar el torso; flexionar codo; soltar protracción; balanceo con rebote.', 'Exige planche Freehold sólido: nunca lo intentes sin 10 s de full planche.', 'Mayor amplitud o rodillas más abiertas al dominar 5x5.', 'Planche completa.', array['ICE con rodillas muy dobladas', 'ICE en suelo'], array['Planche completa', 'Planche Straddle'])
on conflict (nombre, disciplina) do nothing;

-- ============================================================
-- 2) CHECK programs.categoria · agrega 'asesoria_online'
-- ============================================================
alter table public.programs drop constraint if exists programs_categoria_check;
alter table public.programs add constraint programs_categoria_check
  check (categoria in ('general', 'planche', 'front_lever', 'power_free', 'musculacion', 'asesoria_online'));

-- ============================================================
-- 3) is_planche_member() · matchea por categoría O nombre
--    Mantiene compatibilidad con los nombres históricos y habilita
--    los programas separados "Planche …" / "Front Lever …".
-- ============================================================
create or replace function public.is_planche_member()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.athlete_programs ap
    join public.programs p on p.id = ap.program_id
      and (
        p.categoria in ('planche', 'front_lever')
        or p.nombre in ('Planche / Front Lever', 'Planche y Front level')
      )
    join public.athletes a on a.id = ap.athlete_id
      and a.user_id = auth.uid()
    where ap.estado = 'activo'
  );
$$;

-- Verificación
select '0068 OK' as estado,
  (select count(*) from public.exercises
   where nombre in ('Planche con banda elástica','Planche One Leg','Planche Straddle con banda','Front Lever con banda elástica','Front Lever Straddle','Ice Cream Maker')) as ejercicios_nuevos,
  (select count(*) from pg_constraint
   where conname = 'programs_categoria_check' and connamespace = 'public'::regnamespace) as check_categoria;