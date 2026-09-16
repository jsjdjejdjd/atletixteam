-- ============================================================
-- ATLETIX · FASE 14 · Lote 3 de la biblioteca de ejercicios
-- Ampliación: A) Calistenia · B) Musculación de brazos
--             C) Core · D) Piernas
-- TODO ES ADITIVO: no modifica ni borra nada existente.
-- Se puede correr las veces que quieras (no duplica nada).
-- No requiere ejecutar 0008 antes: agrega las columnas por su cuenta
-- (add column if not exists). Los valores respetan los checks de FASE 12.
-- ============================================================

-- ============================================================
-- 0) CAMPO NUEVO: tipo (clasificación para filtros y navegación)
-- ============================================================
alter table public.exercises
  add column if not exists tipo text;

alter table public.exercises
  drop constraint if exists exercises_tipo_check;

alter table public.exercises
  add constraint exercises_tipo_check
    check (tipo in ('Calistenia', 'Musculación', 'Core', 'Piernas'))
    not valid;

alter table public.exercises
  validate constraint exercises_tipo_check;

-- ============================================================
-- 1) COLUMNAS DE LA BIBLIOTECA (por si FASE 12/0008 aún no se corrió)
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

-- ============================================================
-- 2) SECCIÓN A · CALISTENIA
-- ============================================================
insert into public.exercises
  (nombre, categoria, tipo, dificultad, equipamiento, video_url, descripcion, instrucciones, errores_comunes,
   aliases, patron, agarre, agarre_ancho, empenaje_tipo,
   musculos_primarios, musculos_secundarios,
   demanda_fuerza, demanda_estabilidad, demanda_movilidad,
   series_sugeridas, reps_sugeridas, descanso_seg, tempo,
   rir_sugerido, rpe_sugerido, costo_fatiga,
   biomecanica, criterio_progresion, detener_si, precauciones, evidencia, fuentes)
values
  ('Flexión pike', 'Empuje', 'Calistenia', 'Intermedio', 'Suelo o superficie elevada', null,
   'Flexión con la cadera alta y el cuerpo en pica (pike push up). Primer escalón del empuje vertical de peso corporal.',
   'Apoyá las manos un poco más ancho que los hombros y subí la cadera formando una pica con el cuerpo. Bajá la cabeza hacia el suelo doblando los codos hacia atrás. Empujá hasta volver a extender.',
   'Codos hacia afuera; cabeza no llega al suelo; lumbar que se hunde.',
   'pike push up|flexión en pica',
   'Empuje vertical', 'otro', 'hombros', 'peso corporal',
   array['Deltoides anterior','Tríceps'], array['Pectoral mayor','Serrato anterior','Core'],
   5, 4, 4,
   3, '8-12', 90, '2-1-1',
   2, 7, 2,
   'La cadera alta y la flexión de hombro desplazan la carga hacia el deltoides anterior: es el peldaño previo a la flexión de pino.',
   '3x10 con la frente tocando el suelo.',
   'Dolor de hombro o muñeca.', 'Progresar elevando los pies para aumentar la inclinación.',
   'PRACTICA', 'Preparación de handstand (gymnasticsdirect.com.au)'),

  ('Flexión de pino', 'Empuje', 'Calistenia', 'Avanzado', 'Pared o superficie libre', null,
   'Handstand push up: empuje vertical con el cuerpo invertido. Exige pino estable previo.',
   'Entrá al pino contra la pared (pecho a la pared) o libre. Bajá la cabeza hacia el suelo doblando codos hasta que el cráneo casi toque. Empujá hasta el bloqueo completo.',
   'Lumbar que se abre; bajada sin control; hombros que se desploman.',
   'handstand push up|flexión de pino',
   'Empuje vertical', 'otro', 'hombros', 'peso corporal',
   array['Deltoides anterior','Tríceps','Serrato anterior','Trapecio'], array['Pectoral mayor','Core','Rotadores del hombro'],
   8, 7, 5,
   3, '3-8', 150, '3-0-1',
   1, 9, 4,
   'El cuerpo invertido suma el peso completo sobre hombros y tríceps en flexión vertical; exige hombros abiertos y core rígido.',
   '5 reps con el cráneo tocando el suelo y bloqueo arriba.',
   'Pérdida de línea; dolor de muñeca; lumbar que se abre.',
   'Solo con pino estable; progresar desde la flexión pike.',
   'PRACTICA', 'Preparación de handstand (gymnasticsdirect.com.au)'),

  ('Flexión arquera', 'Empuje', 'Calistenia', 'Avanzado', 'Suelo', null,
   'Archer push up: una mano empuja mientras la otra queda extendida. Empuje horizontal asimétrico.',
   'Ponete en posición de flexión con las manos separadas. Bajá el peso hacia una mano flexionando ese codo y extendiendo el otro brazo hacia el costado. Alterná el lado en cada serie.',
   'Cadera que se rota; no completar el rango; codo que se abre.',
   'archer push up|flexión arquera',
   'Empuje horizontal', 'otro', 'ancho', 'peso corporal',
   array['Pectoral mayor','Tríceps','Deltoides anterior'], array['Serrato anterior','Core'],
   6, 5, 4,
   3, '5-8', 120, '2-0-1',
   2, 8, 3,
   'El desplazamiento lateral del peso concentra la carga en un solo brazo: prepara el camino del empuje unimanual.',
   '6 reps por lado sin dejar caer la cadera.',
   'Cadera que rota; dolor de codo.', 'Agarre amplio y control en la bajada.',
   'PRACTICA', 'Práctica estandarizada de calistenia'),

  ('Dominada arquera', 'Tirón', 'Calistenia', 'Avanzado', 'Barra', null,
   'Archer pull up: el peso se desplaza hacia un brazo mientras el otro apoya. Puente hacia la dominada a un brazo.',
   'Colgate con las manos bien separadas. Tirá llevando el peso hacia una mano mientras el otro brazo queda casi extendido. Alterná el lado en cada serie.',
   'Balanceo de piernas; rotación excesiva; codo que se quiebra.',
   'archer pull up|dominada arquera',
   'Tiro vertical', 'prono', 'ancho', 'peso corporal',
   array['Dorsal ancho','Bíceps','Braquial'], array['Romboides','Deltoides posterior','Core'],
   8, 6, 4,
   3, '3-6', 150, '2-1-1',
   2, 8, 4,
   'El desplazamiento lateral del tiro concentra la carga en un solo brazo y agrega exigencia de estabilidad escapular.',
   '5 reps por lado sin balanceo.',
   'Dolor de codo; rotación excesiva.', 'Solo con dominadas estrictas previas.',
   'PRACTICA', 'Práctica estandarizada de calistenia'),

  ('Planche Straddle', 'Planche', 'Calistenia', 'Avanzado', 'Suelo', null,
   'Planche con las piernas abiertas en straddle. Escalón entre la Advanced Tuck y la planche completa.',
   'Desde el suelo o en posición, aterrizá el peso en las manos con los brazos extendidos y el cuerpo horizontal. Abrí las piernas en straddle para acortar el brazo de palanca. Sostén la posición.',
   'Lumbar en extensión; codos en candado débil; caída de cadera.',
   'straddle planche|planche con piernas abiertas',
   'Isometria estatica', 'otro', 'hombros', 'peso corporal',
   array['Deltoides anterior','Tríceps','Serrato anterior','Recto abdominal'], array['Pectoral mayor','Aductores','Flexores de cadera'],
   9, 8, 5,
   3, '8-10 s', 120, 'isométrico',
   1, 8, 4,
   'Abrir las piernas en straddle reduce la longitud efectiva del brazo de palanca entre el tuck y la planche completa.',
   '3x10 s con la espalda plana y los hombros adelante.',
   'Lumbar extendida; dolor de muñeca.', 'Progresar abriendo cada vez más las piernas.',
   'LIMITADA', 'Modelo biomecánico de planche (PMC10376746)'),

  ('Planche completa', 'Planche', 'Calistenia', 'Elite', 'Suelo', null,
   'Full planche: cuerpo horizontal completo con las piernas juntas. Elemento de fuerza estática máximo.',
   'Sobre las manos con los brazos extendidos, incliná el cuerpo hacia adelante hasta la línea horizontal, piernas juntas y puntas de pie en punta. Mantené la tensión y la lumbar neutra.',
   'Cadera caída; lumbar extendida; codos flexionados; dolor de muñeca.',
   'full planche|planche completa',
   'Isometria estatica', 'otro', 'hombros', 'peso corporal',
   array['Deltoides anterior','Tríceps','Serrato anterior','Recto abdominal'], array['Pectoral mayor','Flexores de cadera','Aductores'],
   10, 9, 5,
   3, '3-5 s', 180, 'isométrico',
   1, 9, 5,
   'Cuerpo horizontal completo con la línea de gravedad sobre las manos: máxima demanda de hombro y tríceps del empuje estático.',
   '3x5 s con piernas juntas y línea neutra.',
   'Cadera caída; dolor de muñeca.', 'Respetar la escalera tuck → advanced tuck → straddle. Tensión alta en el ángulo débil.',
   'LIMITADA', 'Modelo biomecánico de planche (PMC10376746)'),

  ('Front Lever Completo', 'Front Lever', 'Calistenia', 'Elite', 'Barra o anillas', null,
   'Full front lever: cuerpo horizontal suspendido de espaldas con la cadera neutra.',
   'Colgate de la barra con agarre prono. Contraé dorsal y core y subí las piernas hasta dejar el cuerpo en línea horizontal, sin arquear la lumbar. Mantené la posición.',
   'Hiperextensión lumbar; caída de cadera; hombros subidos.',
   'full front lever|front lever completo',
   'Isometria estatica', 'prono', 'hombros', 'peso corporal',
   array['Dorsal ancho','Recto abdominal','Transverso'], array['Romboides','Deltoides posterior','Glúteos','Isquiosurales'],
   10, 8, 5,
   3, '3-5 s', 180, 'isométrico',
   1, 9, 5,
   'Cuerpo horizontal desde la barra con cadera neutra: dorsal y core trabajan contra el brazo de palanca completo.',
   '3x5 s sin quiebre lumbar y a la altura de los hombros.',
   'Hiperextensión lumbar; caída de cadera.',
   'Seguir la escalera tuck → one leg → straddle antes de intentar el full.',
   'ALTA', 'Isometría y adaptación muscular y tendinosa (Oranchuk 2019)'),

  ('Muscle Up anillas', 'Muscle Up', 'Calistenia', 'Elite', 'Anillas', null,
   'Muscle up en anillas: de la dominada al apoyo sin girar sobre una barra. Variante de gimnasia (front up-rise).',
   'Ajustá las anillas altas. Hacé una dominada explosiva y, en vez de rodear una barra, subí el tronco hacia las manos elevando los hombros sobre las anillas. Terminá en apoyo con los brazos extendidos.',
   'Kip de piernas; golpes de muñeca en la transición; anillas que se separan.',
   'ring muscle up|muscle up en aros',
   'Muscle Up', 'neutro', 'hombros', 'peso corporal',
   array['Dorsal ancho','Bíceps','Pectoral mayor','Tríceps'], array['Core','Serrato anterior'],
   9, 9, 4,
   3, '1-3', 180, 'explosivo',
   2, 9, 5,
   'A diferencia del muscle up de barra, en anillas el cuerpo sube hacia las manos con los hombros flexionados, exigiendo control del tronco sobre el punto de apoyo.',
   '3x2 en anillas con transición limpia y sin kip de piernas.',
   'Golpes de muñeca; pérdida de control de anillas.',
   'Dominar dominadas y fondos en anillas antes de intentarlo.',
   'LIMITADA', 'Muscle up de barra vs anillas (PMC10824315)');

-- ============================================================
-- 3) SECCIÓN B · MUSCULACIÓN DE BRAZOS
-- ============================================================
insert into public.exercises
  (nombre, categoria, tipo, dificultad, equipamiento, video_url, descripcion, instrucciones, errores_comunes,
   aliases, patron, agarre, agarre_ancho, empenaje_tipo,
   musculos_primarios, musculos_secundarios,
   demanda_fuerza, demanda_estabilidad, demanda_movilidad,
   series_sugeridas, reps_sugeridas, descanso_seg, tempo,
   rir_sugerido, rpe_sugerido, costo_fatiga,
   biomecanica, criterio_progresion, detener_si, precauciones, evidencia, fuentes)
values
  ('Curl con mancuernas', 'Tirón', 'Musculación', 'Intermedio', 'Mancuernas', null,
   'Curl de bíceps clásico con mancuernas, alternado o bilateral.',
   'De pie con mancuernas y palmas hacia adelante. Flexioná el codo hasta llevar la mancuerna al hombro sin mover el codo del costado. Bajá controlado.',
   'Balanceo del tronco; hombros que se elevan; bajar sin control.',
   'dumbbell curl|curl de bíceps',
   null, 'supino', 'hombros', 'pesa',
   array['Bíceps braquial','Braquial'], array['Braquiorradial','Flexores de muñeca'],
   4, 2, 2,
   3, '8-12', 60, '2-0-1',
   2, 8, 1,
   'Flexión de codo con supinación: el agarre supino maximiza la activación del bíceps respecto de prono o neutro.',
   'Subir el peso manteniendo el codo fijo al costado.',
   'Balanceo del tronco; dolor de muñeca.', 'Codos pegados al torso, sin abrir los hombros.',
   'PRACTICA', 'Práctica estandarizada de musculación'),

  ('Curl martillo', 'Tirón', 'Musculación', 'Principiante', 'Mancuernas', null,
   'Hammer curl: flexión de codo con agarre neutro. Desarrolla braquial y antebrazo.',
   'De pie con mancuernas y palmas mirándose entre sí. Flexioná los codos manteniendo el agarre neutro. Bajá controlado.',
   'Supinar la muñeca al subir; balanceo; bajar muy rápido.',
   'hammer curl|curl neutro',
   null, 'neutro', 'hombros', 'pesa',
   array['Braquial','Braquiorradial','Bíceps braquial'], array['Flexores de muñeca'],
   4, 2, 2,
   3, '10-15', 60, '2-1-1',
   2, 7, 1,
   'El agarre neutro aumenta el protagonismo del braquial y el braquiorradial, base del grosor del brazo (ExRx: DB Hammer Curl).',
   '10-15 reps controladas sin balanceo.',
   'Dolor de muñeca por agarre forzado.', 'No supinar la palma durante el recorrido.',
   'PRACTICA', 'ExRx Dumbbell Hammer Curl (exrx.net)'),

  ('Curl de concentración', 'Tirón', 'Musculación', 'Principiante', 'Mancuerna', null,
   'Curl sentado con el codo apoyado en el muslo. Aisla el bíceps y elimina el balanceo.',
   'Sentate con las piernas abiertas y apoyá el codo del brazo de trabajo en el muslo interno. Curleá la mancuerna sin despegar el codo. Bajá lento.',
   'Despegar el codo; usar impulso del tronco; rango incompleto.',
   'concentration curl|curl de concentración',
   null, 'supino', 'hombros', 'pesa',
   array['Bíceps braquial','Braquial'], array['Braquiorradial'],
   3, 1, 2,
   3, '10-12', 45, '2-1-2',
   2, 8, 1,
   'El codo apoyado en el muslo fija el brazo y maximiza la tensión en la fase concéntrica.',
   '10-12 reps estrictas por brazo.',
   'Dolor de codo.', 'No despegar el codo del muslo.',
   'PRACTICA', 'Práctica estandarizada de musculación'),

  ('Curl predicador', 'Tirón', 'Musculación', 'Intermedio', 'Banco predicador', null,
   'Preacher curl: el brazo apoyado en el pad aísla el movimiento y estira bien la cabeza larga del bíceps.',
   'Sentate en el banco predicador con el brazo apoyado sobre el pad y la axila cerca del borde. Curleá la barra o mancuerna hasta el antebrazo vertical. Bajá hasta la extensión casi completa.',
   'Despegar el brazo del pad; subir con el tronco; no completar la extensión.',
   'preacher curl|curl scott',
   null, 'supino', 'hombros', 'pesa',
   array['Braquial','Bíceps braquial (cabeza larga)'], array['Braquiorradial','Flexores de muñeca'],
   4, 1, 2,
   3, '8-10', 60, '2-1-2',
   2, 8, 1,
   'El apoyo del brazo lleva el hombro adelante y el bíceps entra en ineficiencia activa: el braquial toma protagonismo y el recorrido queda fijo (ExRx: BB Preacher Curl).',
   '8-10 reps estrictas sin despegar el brazo.',
   'Dolor de codo.', 'Ajustar la altura del asiento para que la axila quede cerca del borde del pad.',
   'PRACTICA', 'ExRx Barbell Preacher Curl (exrx.net)'),

  ('Curl inverso', 'Tirón', 'Musculación', 'Intermedio', 'Barra o mancuernas', null,
   'Reverse curl: flexión de codo con agarre prono. Trabaja el braquiorradial y el antebrazo.',
   'De pie con la barra y las palmas hacia abajo (prono). Flexioná el codo llevando la barra al pecho sin abrir los codos. Bajá controlado.',
   'Abrir los codos; balanceo; dolor de muñeca por pronación forzada.',
   'reverse curl|curl prono',
   null, 'prono', 'hombros', 'pesa',
   array['Braquiorradial','Braquial'], array['Extensores de muñeca'],
   3, 1, 2,
   3, '10-15', 45, '2-1-1',
   2, 7, 1,
   'Con agarre prono el braquiorradial se convierte en el flexor principal del codo: complemento del curl supino.',
   '10-15 reps controladas con muñeca firme.',
   'Dolor de muñeca.', 'Usar carga moderada para cuidar la muñeca.',
   'PRACTICA', 'Práctica estandarizada de musculación'),

  ('Curl Zottman', 'Tirón', 'Musculación', 'Intermedio', 'Mancuernas', null,
   'Zottman curl: supinación en la subida y pronación en la bajada. Trabaja bíceps y extensores del antebrazo.',
   'Subí las mancuernas como un curl con palmas supinas. En el punto más alto rotá las palmas a pronación y bajá lento. Repetí rotando de nuevo en el siguiente rep.',
   'No rotar en el punto alto; bajar rápido; balanceo.',
   'zottman curl',
   null, 'otro', 'hombros', 'pesa',
   array['Bíceps braquial','Braquial','Braquiorradial'], array['Extensores de muñeca'],
   4, 2, 2,
   3, '8-10', 60, '3-0-1',
   2, 8, 2,
   'La fase excéntrica en pronación convierte al antebrazo en protagonista: un movimiento, dos estímulos.',
   '8-10 reps con rotación limpia y bajada lenta.',
   'Dolor de muñeca.', 'Carga moderada y rotación sin tirones.',
   'PRACTICA', 'Práctica estandarizada de musculación'),

  ('Extensión de tríceps en polea', 'Empuje', 'Musculación', 'Intermedio', 'Polea con cuerda o barra', null,
   'Pushdown de tríceps: extensión del codo con la cuerda. Trabajo aislado del tríceps.',
   'Parate frente a la polea alta con la cuerda. Codos pegados al torso, empujá hacia abajo hasta extender y abrí los extremos al final. Subí controlado.',
   'Codos que se separan; usar el pecho para empujar; no abrir los extremos.',
   'pushdown|extensión de tríceps en polea',
   null, 'neutro', 'hombros', 'pesa',
   array['Tríceps braquial'], array['Ancóneo'],
   4, 2, 2,
   3, '10-15', 45, '2-0-1',
   1, 8, 1,
   'El agarre con cuerda permite la pronación final del antebrazo que acentúa la extensión completa del codo (ExRx: Cable Rope Pushdown).',
   '10-15 reps con bloqueo completo de codos.',
   'Dolor de codo.', 'Codear el torso con los codos fijos.',
   'PRACTICA', 'ExRx Cable Rope Pushdown (exrx.net)'),

  ('Press francés', 'Empuje', 'Musculación', 'Intermedio', 'Barra Z o barra', null,
   'Press con la barra desde detrás de la cabeza hasta la frente sin abrir los codos.',
   'Acostate en un banco o de pie con la barra arriba. Flexioná los codos bajando la barra hacia la frente manteniéndolos juntos. Extendé hasta el bloqueo.',
   'Codos que se abren; bajar la barra detrás de la cabeza en exceso; impulso con los hombros.',
   'french press|extensión de tríceps acostado',
   null, 'supino', 'estrecho', 'pesa',
   array['Tríceps braquial (cabeza larga)'], array['Ancóneo'],
   4, 2, 3,
   3, '8-10', 60, '3-0-1',
   2, 8, 2,
   'La cabeza larga del tríceps cruza el hombro: el press francés la estira al máximo con el codo apuntando al techo.',
   '8-10 reps sin abrir los codos.',
   'Dolor de codo o muñeca.', 'Codos juntos en todo el recorrido.',
   'PRACTICA', 'Práctica estandarizada de musculación'),

  ('Patada de tríceps', 'Empuje', 'Musculación', 'Principiante', 'Mancuerna', null,
   'Kickback: extensión del codo con el tronco inclinado. Aisla el tríceps sin carga pesada.',
   'Incliná el tronco hacia adelante con el codo pegado al costado y el brazo paralelo al piso. Extendé el codo hasta el bloqueo manteniendo el brazo quieto. Bajá controlado.',
   'Mover el hombro; balanceo; bloqueo incompleto.',
   'kickback|patada de tríceps',
   null, 'otro', 'hombros', 'pesa',
   array['Tríceps braquial'], array[]::text[],
   3, 1, 1,
   3, '12-15', 45, '2-1-1',
   2, 7, 1,
   'Fijar el hombro aísla la extensión del codo: ideal para aprender el bloqueo del tríceps.',
   '12-15 reps por brazo con bloqueo completo.',
   'Dolor de codo.', 'No mover el hombro.',
   'PRACTICA', 'Práctica estandarizada de musculación'),

  ('Fondo de tríceps en banco', 'Empuje', 'Musculación', 'Principiante', 'Banco o silla', null,
   'Bench dip con los pies en el suelo: extensión de codo trasera, entrada al fondo.',
   'Apoyá las manos en el borde del banco detrás de vos con los dedos hacia adelante. Bajá flexionando los codos hasta unos 90 grados. Empujá hasta extender.',
   'Bajar demasiado cargando el hombro; codos abiertos; hombros que suben.',
   'bench dip|fondo de banco',
   'Empuje vertical', 'otro', 'hombros', 'peso corporal',
   array['Tríceps braquial','Deltoides anterior'], array['Pectoral mayor'],
   3, 2, 3,
   3, '10-15', 60, '2-1-1',
   2, 7, 1,
   'El apoyo trasero con los pies en el suelo reduce la carga: primer peldaño del fondo para tríceps.',
   '3x12 con codos pegados al torso.',
   'Dolor de hombro.', 'Subir los pies para progresar hacia el fondo completo.',
   'PRACTICA', 'Práctica estandarizada de musculación'),

  ('Extensión de tríceps sobre cabeza', 'Empuje', 'Musculación', 'Intermedio', 'Mancuerna', null,
   'Overhead triceps extension con una o dos mancuernas. Estiramiento máximo de la cabeza larga.',
   'De pie o sentado con la mancuerna por encima de la cabeza, codos apuntando al techo. Bajá la mancuerna detrás de la nuca flexionando los codos. Extendé hasta el bloqueo.',
   'Abrir los codos; usar la espalda; no bloquear arriba.',
   'overhead triceps extension|extensión sobre cabeza',
   null, 'otro', 'hombros', 'pesa',
   array['Tríceps braquial (cabeza larga)'], array['Ancóneo'],
   4, 2, 2,
   3, '10-12', 60, '3-0-1',
   2, 8, 2,
   'La posición sobre la cabeza lleva la cabeza larga al estiramiento completo antes de la contracción.',
   '10-12 reps con codos juntos.',
   'Dolor de codo.', 'Mantener el abdomen firme para cuidar la lumbar.',
   'PRACTICA', 'Práctica estandarizada de musculación'),

  ('Press de banca agarre cerrado', 'Empuje', 'Musculación', 'Intermedio', 'Barra y banco', null,
   'Close grip bench press: press de pecho con las manos a ancho de hombros para enfocar el tríceps.',
   'Acostate en el banco con las manos a la altura de los hombros. Bajá la barra al pecho con los codos pegados al torso. Empujá hasta el bloqueo manteniendo los codos aducentes.',
   'Codos muy abiertos; la barra no baja al pecho; balanceo del banco.',
   'close grip bench press|press agarre cerrado',
   'Empuje horizontal', 'prono', 'estrecho', 'pesa',
   array['Tríceps braquial','Pectoral mayor','Deltoides anterior'], array['Ancóneo'],
   5, 3, 2,
   3, '6-10', 90, '2-0-1',
   2, 8, 3,
   'El agarre cerrado (ancho de hombros) traslada la carga del pectoral al tríceps y mantiene los codos cerca del torso.',
   '6-10 reps con codos pegados y rango completo.',
   'Dolor de muñeca; mientras el agarre sea demasiado estrecho.', 'No bajar el agarre por debajo de la anchura de hombros.',
   'PRACTICA', 'Práctica estandarizada de musculación'),

  ('Curl de muñeca con barra', 'Tirón', 'Musculación', 'Principiante', 'Barra y banco', null,
   'Flexión de muñeca con el antebrazo apoyado. Hipertrofia de los flexores del antebrazo.',
   'Sentate con el antebrazo apoyado en el muslo o banco y la muñeca fuera del borde, palmas hacia arriba. Flexioná la muñeca subiendo la barra sin mover el antebrazo. Bajá controlado.',
   'Mover el antebrazo; subir con el hombro; bajar rápido.',
   'wrist curl|flexión de muñeca',
   null, 'supino', 'hombros', 'pesa',
   array['Flexores de muñeca y dedos'], array['Flexores palmares'],
   2, 1, 1,
   3, '12-20', 45, '2-0-1',
   2, 7, 1,
   'Flexión de muñeca con el antebrazo fijo: aisla los flexores y fortalece el agarre de dominadas y lastres.',
   '12-20 reps con rango completo.',
   'Dolor de muñeca.', 'Antebrazo apoyado y muñeca libre.',
   'PRACTICA', 'Práctica estandarizada de musculación'),

  ('Curl de muñeca inverso', 'Tirón', 'Musculación', 'Principiante', 'Barra y banco', null,
   'Extensión de muñeca con el antebrazo apoyado. Equilibra los flexores y previene lesiones de codo.',
   'Igual que el curl de muñeca pero con las palmas hacia abajo. Extendé la muñeca subiendo el dorso de la mano. Bajá controlado.',
   'Mover el antebrazo; carga excesiva.',
   'reverse wrist curl|extensión de muñeca',
   null, 'prono', 'hombros', 'pesa',
   array['Extensores de muñeca y dedos'], array['Extensores laterales'],
   2, 1, 1,
   3, '12-20', 45, '2-0-1',
   2, 7, 1,
   'Extensión de muñeca: compensa el trabajo de los flexores y cuida el codo del corredor (codo de golfista).',
   '12-20 reps controladas.',
   'Dolor de muñeca.', 'Carga liviana y rango completo sin dolor.',
   'PRACTICA', 'Práctica estandarizada de musculación'),

  ('Colgado de barra', 'Tirón', 'Musculación', 'Principiante', 'Barra', null,
   'Dead hang: cuelgue pasivo o activo sobre la barra para desarrollar el agarre.',
   'Colgate de la barra con las manos a la altura de los hombros. En el modo activo, deprimí los hombros y mantene la tensión. Sostén el tiempo indicado.',
   'Hombros subidos al inicio; soltar de golpe; contener la respiración.',
   'dead hang|colgado',
   'Isometria estatica', 'prono', 'hombros', 'peso corporal',
   array['Flexores de dedos','Braquiorradial'], array['Dorsal ancho','Trapecio'],
   3, 2, 2,
   3, '30-60 s', 60, 'isométrico',
   1, 7, 1,
   'Isometría de agarre: base para dominadas, front lever y lastres a cinturón.',
   '3x45 s con hombros activos.',
   'Dolor de hombro por hombros pasivos.', 'Descender siempre con control.',
   'PRACTICA', 'Práctica estandarizada de calistenia'),

  ('Caminata del granjero', 'Tirón', 'Musculación', 'Intermedio', 'Mancuernas o kettlebells', null,
   'Farmer carry: caminata manteniendo una carga pesada de pie. Trabaja agarre, core y piernas.',
   'Levantá la carga del piso con la espalda neutra y caminá con pasos cortos y controlados, torso erecto. Llegá a la distancia indicada y bajá la carga con control.',
   'Echarse hacia atrás; girar el torso; soltar la carga en el aire.',
   'farmer carry|caminata del granjero',
   'Carga axial', 'otro', 'hombros', 'pesa',
   array['Flexores de dedos','Transverso del abdomen','Cuádriceps','Glúteos'], array['Trapecio','Tibiales anteriores'],
   5, 4, 2,
   3, '20-40 m', 90, 'lento', 
   1, 8, 2,
   'Carga asimétrica de pie con marcha: entrena el agarre bajo fatiga y la rigidez del core contra la extensión.',
   'Caminatas de 20-40 m sin inclinar el torso.',
   'Dolor de espalda; hombros caídos.', 'Empezar con cargas de marcha controlada.',
   'PRACTICA', 'Práctica estandarizada de preparación física');

-- ============================================================
-- 4) SECCIÓN C · CORE
-- ============================================================
insert into public.exercises
  (nombre, categoria, tipo, dificultad, equipamiento, video_url, descripcion, instrucciones, errores_comunes,
   aliases, patron, agarre, agarre_ancho, empenaje_tipo,
   musculos_primarios, musculos_secundarios,
   demanda_fuerza, demanda_estabilidad, demanda_movilidad,
   series_sugeridas, reps_sugeridas, descanso_seg, tempo,
   rir_sugerido, rpe_sugerido, costo_fatiga,
   biomecanica, criterio_progresion, detener_si, precauciones, evidencia, fuentes)
values
  ('V-Sit', 'Core', 'Core', 'Avanzado', 'Suelo', null,
   'Sostén en V equilibrado sobre los glúteos con piernas y tronco elevados.',
   'Sentate, apoyá las manos y elevá piernas y tronco formando una V. Mantené el pecho alto, la lumbar erguida y las piernas extendidas.',
   'Lumbar caída; rodillas flexionadas; redondear la espalda.',
   'v-sit|sentadilla en V',
   'Isometria estatica', 'otro', null, 'peso corporal',
   array['Recto abdominal','Flexores de cadera','Aductores'], array['Transverso','Tríceps (fijación)'],
   6, 5, 6,
   3, '10-20 s', 90, 'isométrico',
   1, 8, 3,
   'Abrir las piernas reduce la carga del abdomen superior y exige flexibilidad de isquios; el pecho alto mantiene el equilibrio.',
   '3x15 s sin arquear la lumbar.',
   'Lumbar despegada; calambres de isquios.',
   'Progresar desde el L-sit y el hollow hold.',
'LIMITADA', 'Escalera de core de la calistenia'),

  ('Plancha lateral', 'Core', 'Core', 'Principiante', 'Suelo', null,
   'Side plank: isometría lateral de pie sobre un antebrazo.',
   'Apoyate de costado sobre un antebrazo con los pies apilados o escalonados. Elevá la cadera hasta dejar el cuerpo en línea recta. Mantené la posición y repetí del otro lado.',
   'Cadera caída; cabeza adelante; rotar el tronco.',
   'side plank|plancha de costado',
   'Isometria estatica', null, null, 'peso corporal',
   array['Oblicuos','Transverso','Glúteo medio'], array['Cuadrado lumbar'],
   3, 4, 2,
   3, '30-45 s', 60, 'isométrico',
   1, 7, 1,
   'La isometría lateral trabaja los oblicuos y el glúteo medio: estabilidad anti-lateral para cargas en una sola mano.',
   '3x40 s por lado con cadera alineada.',
   'Dolor de hombro o de costilla.', 'Empezar con los pies escalonados si se abren.',
   'PRACTICA', 'Práctica estandarizada de calistenia'),

  ('Dragon Flag', 'Core', 'Core', 'Avanzado', 'Banco', null,
   'Dragon flag: elevación y descenso controlado del cuerpo entero desde un banco, sujeto con las manos detrás de la cabeza.',
   'Acostate en el banco y sujetate del borde por encima de la cabeza. Elevá el cuerpo en línea recta y bajalo lento sin apoyar la espalda hasta completar la repetición.',
   'Flexionar las rodillas; arquear la lumbar; bajar rápido.',
   'dragon flag',
   'Isometria estatica', 'otro', null, 'peso corporal',
   array['Recto abdominal','Transverso','Dorsal ancho (fijación)'], array['Flexores de cadera'],
   7, 6, 4,
   3, '5-8', 120, 'lento',
   1, 9, 4,
   'El cuerpo descendente crea un brazo de palanca enorme: el recto abdominal trabaja en excéntrica controlada contra la caída.',
   '3x6 con descenso de 3 segundos sin apoyar la espalda.',
   'Dolor lumbar; no poder frenar el descenso.',
   'Progresar desde el crunch inverso y las elevaciones de piernas.',
   'PRACTICA', 'Práctica estandarizada de calistenia'),

  ('Elevaciones de rodillas colgado', 'Core', 'Core', 'Principiante', 'Barra', null,
   'Hanging knee raises: elevación de rodillas al pecho colgado de la barra.',
   'Colgate de la barra con agarre firme. Elevá las rodillas hacia el pecho sin balancear el cuerpo. Bajá controlado.',
   'Balanceo del cuerpo; subir con impulso; soltar tensión abajo.',
   'hanging knee raises',
   'Isometria estatica', 'prono', 'hombros', 'peso corporal',
   array['Recto abdominal','Flexores de cadera'], array['Transverso','Dorsal ancho (fijación)'],
   4, 3, 3,
   3, '10-15', 60, '2-1-1',
   2, 8, 2,
   'La suspensión agrega trabajo de agarre y dorsal mientras el abdomen flexiona la cadera.',
   '3x12 sin balanceo.',
   'Dolor lumbar; balanceo.', 'Empezar con las piernas semi flexionadas.',
   'PRACTICA', 'Práctica estandarizada de calistenia'),

  ('Elevaciones de piernas colgado', 'Core', 'Core', 'Intermedio', 'Barra', null,
   'Hanging leg raises: elevación de piernas extendidas hasta la horizontal o por encima.',
   'Colgate con la cadera estable. Elevá las piernas extendidas hasta la horizontal (o los dedos a la barra) sin balancear. Bajá lento.',
   'Balanceo; lumbar que arquea; piernas flexionadas.',
   'hanging leg raises|toes to bar',
   'Isometria estatica', 'prono', 'hombros', 'peso corporal',
   array['Recto abdominal','Flexores de cadera','Dorsal ancho (fijación)'], array['Transverso'],
   6, 4, 4,
   3, '8-12', 90, '2-1-1',
   2, 8, 3,
   'Piernas extendidas alargan el brazo de palanca del abdomen y suman control de cadera.',
   '8-12 reps con piernas rectas; progresión a toes to bar.',
   'Dolor lumbar; balanceo excesivo.', 'Domar las elevaciones de rodillas primero.',
   'PRACTICA', 'Práctica estandarizada de calistenia'),

  ('Abdominal bicicleta', 'Core', 'Core', 'Principiante', 'Suelo', null,
   'Bicycle crunch: rotación alternada de codo a rodilla contraria.',
   'Acostate boca arriba y llevá la rodilla contraria al codo rotando el tronco, sin tirar de la cabeza. Alterná los lados a ritmo constante.',
   'Tirar de la cabeza; alzar el cuello; moverse solo con los codos.',
   'bicycle crunch|abdominal bicicleta',
   null, null, null, 'peso corporal',
   array['Oblicuos','Recto abdominal'], array['Flexores de cadera'],
   3, 3, 2,
   3, '30-60 s', 45, 'ritmo continuo',
   2, 7, 2,
   'La rotación alternada trabaja los oblicuos de forma dinámica y el recto abdominal en estabilización.',
   '30-60 s de ritmo controlado.',
   'Dolor cervical.', 'Mirada al techo y cuello relajado.',
   'PRACTICA', 'Práctica estandarizada de calistenia'),

  ('Crunch', 'Core', 'Core', 'Principiante', 'Suelo', null,
   'Crunch clásico: flexión corta del tronco sin elevación completa de la espalda.',
   'Acostate con las rodillas flexionadas y las manos en el pecho. Elevá los hombros del suelo contrayendo el abdomen. Bajá controlado.',
   'Tirar de la cabeza; alzar la lumbar completa; rebote.',
   'crunch abdominal',
   null, null, null, 'peso corporal',
   array['Recto abdominal'], array['Oblicuos'],
   3, 1, 1,
   3, '15-25', 45, '2-0-2',
   2, 7, 1,
   'El rango corto (solo la porción superior) hornea el recto abdominal sin cargar la lumbar.',
   '25 reps sin despegar la lumbar.',
   'Dolor lumbar; dolor cervical.', 'Cabeza alineada y manos sin tracción.',
   'PRACTICA', 'Práctica estandarizada de calistenia'),

  ('Crunch inverso', 'Core', 'Core', 'Principiante', 'Suelo', null,
   'Reverse crunch: flexión del tronco elevando la cadera desde abajo.',
   'Acostate con las manos a los costados y las rodillas flexionadas. Elevá la cadera llevando las rodillas al pecho sin impulso. Bajá controlado.',
   'Impulso de piernas; lumbar que se despega; soltar el abdomen abajo.',
   'reverse crunch|crunch inverso',
   null, null, null, 'peso corporal',
   array['Recto abdominal','Flexores de cadera'], array['Transverso'],
   3, 2, 2,
   3, '12-20', 45, '2-0-1',
   2, 7, 1,
   'Enfatiza la porción inferior del recto abdominal en la flexión de cadera.',
   '20 reps sin impulso.',
   'Dolor lumbar.', 'Controlar la bajada.',
   'PRACTICA', 'Práctica estandarizada de calistenia'),

  ('Pallof Press', 'Core', 'Core', 'Intermedio', 'Polea o banda elástica', null,
   'Pallof press: empuje frontal contra una resistencia lateral que intenta rotarte.',
   'Parate de costado a la polea a la altura del pecho. Apretá la resistencia contra el torso y empujá hacia adelante hasta extender los brazos sin girar el tronco. Volvé y repetí del otro lado.',
   'Rotar el tronco; arquear la lumbar; empujar con impulso.',
   'pallof press|anti-rotación',
   'Isometria estatica', null, null, 'banda',
   array['Oblicuos','Transverso'], array['Recto abdominal'],
   4, 5, 2,
   3, '10-12', 60, '2-0-1',
   1, 8, 1,
   'La resistencia lateral genera un par que el core debe frenar de forma isométrica: es el ejercicio anti-rotación por excelencia.',
   '10-12 reps por lado sin girar el tronco.',
   'Dolor lumbar; giro del tronco.', 'Pesos moderados y tensión constante.',
   'PRACTICA', 'Práctica estandarizada de preparación física'),

  ('Giro ruso con peso', 'Core', 'Core', 'Intermedio', 'Mancuerna o disco', null,
   'Russian twist: rotación del tronco sentado con carga.',
   'Sentate con el torso inclinado unos 45 grados y elevá los pies. Con la carga al pecho, rotá el tronco de un lado al otro manteniendo la espalda recta.',
   'Arquear la lumbar; mover solo los brazos; bajar el pecho.',
   'russian twist|giro ruso',
   null, null, null, 'pesa',
   array['Oblicuos','Recto abdominal','Flexores de cadera'], array['Transverso'],
   4, 3, 3,
   3, '10-15', 60, '2-0-1',
   2, 8, 2,
   'La rotación cargada recluta los oblicuos de forma dinámica y desafía el control de la lumbar.',
   '3x15 por lado con espalda recta.',
   'Dolor lumbar.', 'Carga progresiva y cadera estable.',
   'PRACTICA', 'Práctica estandarizada de calistenia'),

  ('Leñador con polea', 'Core', 'Core', 'Intermedio', 'Polea alta', null,
   'Woodchop: rotación diagonal de arriba hacia abajo contra la polea.',
   'Parate de costado a la polea alta. Bajá la cuerda en diagonal cruzando el cuerpo hasta la cadera contraria rotando el tronco. Volvé controlado y repetí del otro lado.',
   'Usar solo los brazos; arquear la lumbar; tirar de golpe.',
   'woodchop|leñador',
   null, 'otro', 'otro', 'pesa',
   array['Oblicuos','Dorsal ancho','Deltoides'], array['Recto abdominal'],
   4, 4, 3,
   3, '10-12', 60, '2-0-1',
   2, 7, 2,
   'La rotación diagonal entrena la transferencia de fuerza del tren inferior al superior con control del core.',
   '3x10 por lado con cadera estable.',
   'Dolor lumbar.', 'Carga moderada y rotación desde el tronco.',
   'PRACTICA', 'Práctica estandarizada de preparación física'),

  ('Abdominal en polea de rodillas', 'Core', 'Core', 'Intermedio', 'Polea con cuerda', null,
   'Kneeling cable crunch: flexión del tronco contra la polea de rodillas.',
   'Arrodillate frente a la polea alta con la cuerda a las sienes. Flexioná el tronco llevando los codos abajo sin mover la cadera. Volvé controlando.',
   'Flexionar la cadera en lugar del tronco; usar los brazos; rebote.',
   'cable crunch|abdominal en polea',
   null, 'otro', null, 'pesa',
   array['Recto abdominal','Oblicuos'], array['Flexores de cadera'],
   5, 3, 3,
   3, '10-15', 60, '2-1-1',
   1, 8, 2,
   'La flexión contra carga externa es progresivamente sobrecargable: versión pesada del crunch.',
   '3x12 flexionando solo el tronco.',
   'Dolor lumbar.', 'Ajustar la cuerda a las sienes y el movimiento lento.',
   'PRACTICA', 'Práctica estandarizada de musculación'),

  ('Rueda abdominal', 'Core', 'Core', 'Avanzado', 'Rueda abdominal o banda', null,
   'Ab wheel rollout: rueda desde las rodillas o parado, controlando la extensión de cadera.',
   'Arrodillate con la rueda al frente. Rodá hacia adelante manteniendo la lumbar neutra hasta donde puedas, y volvé contrayendo el abdomen. Repetí.',
   'Lumbar que se hunde; hombros que se separan; rodar muy lejos.',
   'ab wheel|rueda abdominal',
   null, 'otro', null, 'peso corporal',
   array['Recto abdominal','Transverso','Dorsal ancho (excéntrica)'], array['Deltoides anterior','Tríceps'],
   7, 7, 4,
   3, '6-10', 90, '3-0-1',
   1, 9, 3,
   'La rueda separa el apoyo del cuerpo y obliga a frenar la extensión lumbar con el core: máxima antic-extensión del catálogo.',
   '10 reps de rodillas sin hundir la lumbar.',
   'Dolor lumbar.', 'Progresar desde la posición de rodillas antes de pararte.',
   'PRACTICA', 'Práctica estandarizada de calistenia');

-- ============================================================
-- 5) SECCIÓN D · PIERNAS
-- ============================================================
insert into public.exercises
  (nombre, categoria, tipo, dificultad, equipamiento, video_url, descripcion, instrucciones, errores_comunes,
   aliases, patron, agarre, agarre_ancho, empenaje_tipo,
   musculos_primarios, musculos_secundarios,
   demanda_fuerza, demanda_estabilidad, demanda_movilidad,
   series_sugeridas, reps_sugeridas, descanso_seg, tempo,
   rir_sugerido, rpe_sugerido, costo_fatiga,
   biomecanica, criterio_progresion, detener_si, precauciones, evidencia, fuentes)
values
  ('Sentadilla con peso corporal', 'Piernas', 'Piernas', 'Principiante', 'Suelo', null,
   'Air squat: sentadilla a fondo sin carga. Base de todos los patrones de pierna.',
   'Parate con los pies a la altura de los hombros. Bajá llevando cadera atrás y rodillas hacia afuera hasta el fondo. Empujá por el centro del pie hasta volver a pararte.',
   'Rodillas que se juntan; talones que se levantan; lumbar que se redondea.',
   'air squat|sentadilla sin carga',
   'Piernas', null, 'otro', 'peso corporal',
   array['Cuádriceps','Glúteos'], array['Isquiosurales','Sóleo','Transverso'],
   3, 2, 2,
   3, '15-20', 60, '2-0-1',
   2, 7, 2,
   'Patrón fundamental de cadera y rodilla: a menor altura de la cadera, mayor demanda de movilidad de tobillo y cadera.',
   '20 reps a fondo con rodillas alineadas.',
   'Rodillas en valgo; dolor de rodilla.', 'Control del pie y la rodilla en el eje del segundo dedo.',
   'PRACTICA', 'Práctica estandarizada de musculación'),

  ('Sentadilla búlgara', 'Piernas', 'Piernas', 'Intermedio', 'Suelo y banco', null,
   'Bulgarian split squat: sentadilla unipodal con el pie trasero apoyado en un banco.',
   'Parate de frente al banco con el pie trasero apoyado. Bajá con la pierna delantera hasta el fondo controlado. Empujá con el talón hasta volver a pararte. Alterná de pierna.',
   'Rodilla delantera en valgo; inclinar el tronco adelante; pierna trasera que no trabaja.',
   'bulgarian split squat|sentadilla búlgara',
   'Piernas', null, 'otro', 'peso corporal',
   array['Cuádriceps','Glúteos'], array['Isquiosurales','Core'],
   5, 4, 3,
   3, '8-12', 60, '2-0-1',
   2, 8, 3,
   'Al ser unipodal, cada pierna soporta el peso entero y el trabajo es más equilibrado que en la bilateral.',
   '12 reps por pierna con el torso vertical.',
   'Dolor de rodilla; pérdida de equilibrio.', 'Empezar cerca del banco y corregir el valgo.',
   'PRACTICA', 'Práctica estandarizada de musculación'),

  ('Sentadilla búlgara con mancuernas', 'Piernas', 'Piernas', 'Intermedio', 'Mancuernas y banco', null,
   'Variante cargada de la sentadilla búlgara para sobrecargar el trabajo unipodal.',
   'Igual que la búlgara pero sosteniendo mancuernas a los costados. Bajá con control y empujá con el talón. Alterná de pierna.',
   'Inclinar el tronco; rodilla en valgo.', 
   'weighted bulgarian split squat',
   'Piernas', null, 'otro', 'pesa',
   array['Cuádriceps','Glúteos'], array['Isquiosurales','Core'],
   6, 4, 3,
   3, '6-10', 90, '2-0-1',
   2, 8, 3,
   'La carga externa permite progresar el estímulo una vez dominado el peso corporal.',
   '10 reps por pierna sin romper la técnica.',
   'Dolor de rodilla; pérdida de equilibrio por exceso de carga.', 'Añadir carga solo con peso corporal dominado.',
   'PRACTICA', 'Práctica estandarizada de musculación'),

  ('Sentadilla pistola', 'Piernas', 'Piernas', 'Avanzado', 'Suelo', null,
   'Pistol squat: sentadilla sobre una sola pierna con la otra extendida al frente.',
   'Parate en una pierna con la otra extendida. Bajá flexionando la rodilla hasta el fondo con la otra pierna al frente. Empujá con el talón hasta volver. Alterná de pierna.',
   'Rodilla en valgo; talón que se levanta; caída sin control.',
   'pistol squat|sentadilla pistola',
   'Piernas', null, 'otro', 'peso corporal',
   array['Cuádriceps','Glúteos'], array['Isquiosurales','Sóleo','Core (estabilizadores)'],
   8, 7, 5,
   3, '5-8', 120, '3-0-1',
   1, 9, 4,
   'Una sola pierna soporta el peso completo en fondo profundo: máxima exigencia de fuerza y movilidad de tobillo (progresión de Squat University).',
   'Repetición controlada a fondo sin apoyo.',
   'Dolor de rodilla; valgo marcado.', 'Progresar por etapas: cajón, asistida, excéntrica.',
   'PRACTICA', 'Pistol squat 6 pasos (SquatUniversity); Progresión bottom-up (gmb.io)'),

  ('Zancada caminando', 'Piernas', 'Piernas', 'Principiante', 'Suelo', null,
   'Walking lunge: paso largo hacia adelante con descenso controlado.',
   'Parate con las manos en la cintura. Adelantá una pierna y bajá hasta que ambas rodillas casi toquen el piso. Empujá con la pierna adelantada y pasá a la otra. Repetí caminando.',
   'Rodilla adelantada en valgo; perder el equilibrio; paso corto.',
   'walking lunge|zancada',
   'Piernas', null, 'otro', 'peso corporal',
   array['Cuádriceps','Glúteos'], array['Isquiosurales','Sóleo'],
   4, 3, 3,
   3, '10-15', 60, '2-0-1',
   2, 7, 2,
   'El paso largo desarrolla el patrón de estocada con un componente rítmico de trabajo unilateral.',
   '12 pasos por pierna con rodilla alineada.',
   'Dolor de rodilla o de cadera.', 'Controlar la rodilla en el eje del pie.',
   'PRACTICA', 'Práctica estandarizada de musculación'),

  ('Puente de glúteo', 'Piernas', 'Piernas', 'Principiante', 'Suelo', null,
   'Glute bridge: elevación de cadera en piso. Activa glúteos e isquios.',
   'Acostate boca arriba con las rodillas flexionadas y los pies apoyados. Elevá la cadera apretando los glúteos hasta la línea hombros-rodillas. Bajá controlado.',
   'Arquear la lumbar; empujar con los pies separados; no apretar el glúteo.',
   'glute bridge|puente de glúteos',
   'Piernas', null, null, 'peso corporal',
   array['Glúteo mayor','Isquiosurales'], array['Transverso','Aductores'],
   3, 1, 1,
   3, '12-20', 45, '2-0-1',
   2, 7, 1,
   'La extensión de cadera en piso activa el glúteo sin carga vertical y es la base de la cadena posterior.',
   '20 reps con bloqueo de glúteo arriba.',
   'Dolor lumbar.', 'No arquear; apretar el glúteo en el tope.',
   'PRACTICA', 'Práctica estandarizada de musculación'),

  ('Elevación de talones de pie', 'Piernas', 'Piernas', 'Principiante', 'Suelo o escalón', null,
   'Standing calf raise: elevación sobre las puntas de los pies.',
   'Parate con las puntas de los pies en un escalón y los talones libres. Elevá lo más alto posible sobre las puntas, sostén un instante y bajá hasta estirar la pantorrilla.',
   'Rebotar; rango corto; doblar las rodillas.',
   'standing calf raise|elevación de talones',
   'Piernas', null, null, 'peso corporal',
   array['Sóleo','Gastrocnemios'], array[]::text[],
   3, 2, 2,
   4, '15-20', 45, '2-0-2',
   2, 8, 1,
   'Bajar con el talón bajo el escalón estira la pantorrilla al máximo antes de subir.',
   '4x15 con rango completo.',
   'Dolor de tendón de Aquiles.', 'Movimiento lento y controlado en el estiramiento.',
   'PRACTICA', 'Práctica estandarizada de musculación'),

  ('Sentadilla goblet', 'Piernas', 'Piernas', 'Principiante', 'Mancuerna o kettlebell', null,
   'Goblet squat: sentadilla sosteniendo la carga frente al pecho.',
   'Sostené la mancuerna frente al pecho con ambas manos. Bajá la cadera hasta el fondo manteniendo el torso erguido. Empujá con el pie completo hasta volver a pararte.',
   'Codos que caen; talones que se levantan; lumbar redondeada.',
   'goblet squat|sentadilla goblet',
   'Piernas', null, null, 'pesa',
   array['Cuádriceps','Glúteos'], array['Isquiosurales','Core'],
   3, 2, 2,
   3, '10-15', 60, '2-0-1',
   2, 7, 2,
   'La carga al frente enseña el torso vertical: es la mejor iniciación a la sentadilla frontal con barra.',
   '15 reps a fondo con el codo alto.',
   'Dolor de muñeca; rodilla en valgo.', 'Empezar liviano y profundizar a medida que crece.',
   'PRACTICA', 'Práctica estandarizada de musculación'),

  ('Sentadilla frontal con barra', 'Street Lifting', 'Piernas', 'Avanzado', 'Barra y jaula', null,
   'Front squat: sentadilla profunda con la barra en la posición frontal (rack). Disciplina de Street Lifting.',
   'Colocá la barra sobre los deltoides anteriores con los codos altos. Descolgala y bajá con el torso vertical hasta el fondo controlado. Empujá con el pie completo hasta el bloqueo.',
   'Codos caídos; torso adelante; valgo; no llegar a fondo.',
   'front squat|sentadilla frontal',
   'Piernas', 'prono', 'hombros', 'pesa',
   array['Cuádriceps','Glúteos','Trapecio (soporte)'], array['Isquiosurales','Recto abdominal','Deltoides (fijación)'],
   7, 4, 3,
   4, '3-6', 180, '2-0-1',
   1, 9, 4,
   'La carga delantera obliga a un torso vertical: máximo cuádriceps y tronco, con menos compresión lumbar que la sentadilla trasera (guías de Squat University y Catalyst Athletics).',
   'PR con rango completo y torso vertical.',
   'Dolor de muñeca por rack forzado; rodilla en valgo.',
   'Dominar la goblet primero; movilidad de muñeca y dorsal antes de cargar.',
   'PRACTICA', 'Front squat (SquatUniversity); Parallel front squat (Catalyst Athletics)'),

  ('Peso muerto rumano con barra', 'Piernas', 'Piernas', 'Intermedio', 'Barra y discos', null,
   'Romanian deadlift: flexión de cadera con las piernas casi extendidas. Foco en cadena posterior.',
   'De pie con la barra: bajá la cadera hacia atrás deslizando la barra pegada a las piernas hasta sentir el estiramiento de isquios. Volvé extendiendo la cadera y apretando el glúteo.',
   'Redondear la espalda; doblar mucho la rodilla; la barra se separa de las piernas.',
   'romanian deadlift|peso muerto rumano',
   'Piernas', 'prono', 'hombros', 'pesa',
   array['Isquiosurales','Glúteo mayor','Erectores espinales'], array['Trapecio','Romboides'],
   5, 3, 3,
   3, '6-10', 120, '2-0-1',
   2, 8, 3,
   'La flexión de cadera con piernas casi extendidas genera tensión excéntrica máxima en los isquios.',
   '10 reps con espalda neutra y balanceo mínimo de cadera.',
   'Dolor lumbar; espalda redondeada.', 'Empezar descalzo o con suela fina y carga controlada.',
   'PRACTICA', 'Práctica estandarizada de musculación');

-- ============================================================
-- 6) ESCALERAS DE PROGRESIÓN (exercise_progression)
-- ============================================================
insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 1, 'regresion', 'Planche Straddle',
  'Piernas abiertas para acortar el brazo de palanca.',
  '3x10 s antes de intentar el full'
from public.exercises e where e.nombre = 'Planche completa'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 2, 'regresion', 'Advanced Tuck Planche',
  'Rodillas abiertas, espalda a la altura de los hombros.',
  '3x10 s'
from public.exercises e where e.nombre = 'Planche completa'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 3, 'regresion', 'Tuck Planche',
  'Posición agrupada inicial de la escalera.',
  '3x10 s'
from public.exercises e where e.nombre = 'Planche completa'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 1, 'progresion', 'Planche completa',
  'Cuerpo horizontal con piernas juntas.',
  '3x5 s'
from public.exercises e where e.nombre = 'Planche Straddle'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 1, 'regresion', 'Front Lever Straddle',
  'Piernas abiertas para reducir el brazo de palanca.',
  '3x8 s'
from public.exercises e where e.nombre = 'Front Lever Completo'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 2, 'regresion', 'Front Lever One Leg',
  'Una pierna extendida, cadera neutra.',
  '3x8 s'
from public.exercises e where e.nombre = 'Front Lever Completo'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 3, 'regresion', 'Front Lever Tuck',
  'Posición agrupada inicial.',
  '3x12 s'
from public.exercises e where e.nombre = 'Front Lever Completo'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 1, 'regresion', 'Flexión pike',
  'Cadera alta y cuerpo en pica.',
  '3x10 con la frente al suelo'
from public.exercises e where e.nombre = 'Flexión de pino'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 2, 'regresion', 'Flexión con pies elevados',
  'Aumentar la inclinación y la carga de hombro.',
  '3x10'
from public.exercises e where e.nombre = 'Flexión de pino'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 3, 'regresion', 'Pino contra pared (pecho a pared)',
  'Posición estable previa al empuje.',
  '3x30 s estables'
from public.exercises e where e.nombre = 'Flexión de pino'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 1, 'regresion', 'Dominada arquera (pie de apoyo)',
  'Agarre ancho, dominada con apoyo mínimo de una pierna.',
  '5 reps'
from public.exercises e where e.nombre = 'Dominada arquera'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 1, 'progresion', 'Dominada a un brazo (asistida)',
  'Banda o polea de asistencia, camino a la unimanual.',
  '3x3 asistidas'
from public.exercises e where e.nombre = 'Dominada arquera'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 1, 'regresion', 'Sentadilla búlgara',
  'Unipodal con el pie trasero apoyado.',
  '3x12 por pierna'
from public.exercises e where e.nombre = 'Sentadilla pistola'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 2, 'regresion', 'Sentadilla a cajón',
  'Descenso a una superficie de altura decreciente.',
  '3x8 cayendo hasta el cajón'
from public.exercises e where e.nombre = 'Sentadilla pistola'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 3, 'regresion', 'Pistol asistida con banda',
  'Banda que ayuda en la subida.',
  '3x8 por pierna'
from public.exercises e where e.nombre = 'Sentadilla pistola'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 1, 'regresion', 'Dragón flag con rodillas (tuck)',
  'Rodillas flexionadas para acortar el brazo de palanca.',
  '3x6 con descenso controlado'
from public.exercises e where e.nombre = 'Dragon Flag'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 2, 'regresion', 'Crunch inverso',
  'Elevación de cadera sin carga del cuerpo entero.',
  '3x15'
from public.exercises e where e.nombre = 'Dragon Flag'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 3, 'regresion', 'Elevaciones de piernas colgado',
  'Control de la cadera en suspensión.',
  '3x10'
from public.exercises e where e.nombre = 'Dragon Flag'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 1, 'regresion', 'Elevaciones de rodillas colgado',
  'Primera etapa de la elevación en barra.',
  '3x12'
from public.exercises e where e.nombre = 'Elevaciones de piernas colgado'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 2, 'progresion', 'Toes to bar',
  'Llevar los dedos hasta la barra sin balanceo.',
  '3x8 toes to bar'
from public.exercises e where e.nombre = 'Elevaciones de piernas colgado'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 1, 'regresion', 'L-Sit',
  'Sostén en L previo al V-sit.',
  '3x20 s'
from public.exercises e where e.nombre = 'V-Sit'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 2, 'regresion', 'V-Sit agrupado (tuck)',
  'Rodillas flexionadas para acortar palanca.',
  '3x15 s'
from public.exercises e where e.nombre = 'V-Sit'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 3, 'regresion', 'Hollow hold',
  'Rigidez de cuerpo previa al equilibrio.',
  '3x40 s'
from public.exercises e where e.nombre = 'V-Sit'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 1, 'variante', 'Curl con mancuernas',
  'Versión bilateral de pie.',
  '3x10'
from public.exercises e where e.nombre = 'Curl predicador'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 2, 'variante', 'Curl de concentración',
  'Versión sentada con el codo apoyado.',
  '3x10'
from public.exercises e where e.nombre = 'Curl predicador'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 1, 'variante', 'Extensión de tríceps sobre cabeza',
  'Misma cabeza larga en estiramiento máximo.',
  '3x10'
from public.exercises e where e.nombre = 'Press francés'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 2, 'variante', 'Extensión de tríceps en polea',
  'Versión con cable y codos fijos.',
  '3x12'
from public.exercises e where e.nombre = 'Press francés'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 1, 'progresion', 'Fondos paralelas',
  'El fondo completo supera la exigencia del banco.',
  '3x8 en paralelas'
from public.exercises e where e.nombre = 'Fondo de tríceps en banco'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 1, 'regresion', 'Sentadilla goblet',
  'Carga frontal con torso vertical.',
  '3x12'
from public.exercises e where e.nombre = 'Sentadilla frontal con barra'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 2, 'progresion', 'Sentadilla frontal con pausa',
  'Pausa en el fondo para ganar fuerza en el punto débil.',
  '3x4 con 2 s de pausa'
from public.exercises e where e.nombre = 'Sentadilla frontal con barra'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 1, 'regresion', 'Muscle Up (barra)',
  'Versión de barra con técnica de glide kip.',
  '3x1'
from public.exercises e where e.nombre = 'Muscle Up anillas'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 2, 'regresion', 'Dominada anillas',
  'Tirón vertical en anillas estables.',
  '3x6'
from public.exercises e where e.nombre = 'Muscle Up anillas'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 3, 'regresion', 'Fondos anillas',
  'Empuje vertical en anillas estables.',
  '3x6'
from public.exercises e where e.nombre = 'Muscle Up anillas'
on conflict (exercise_id, orden) do nothing;

-- ============================================================
-- 7) FUENTES ESTRUCTURADAS (exercise_sources)
-- ============================================================
insert into public.exercise_sources (exercise_id, autor, titulo, tipo, url, anio, evidencia)
select e.id, 'ExRx.net',
  'Barbell Preacher Curl — clasificación y ejecución',
  'guia', 'https://exrx.net/WeightExercises/Brachialis/BBPreacherCurl', null, 'PRACTICA'
from public.exercises e where e.nombre = 'Curl predicador'
on conflict (exercise_id, titulo) do nothing;

insert into public.exercise_sources (exercise_id, autor, titulo, tipo, url, anio, evidencia)
select e.id, 'ExRx.net',
  'Dumbbell Hammer Curl — clasificación y ejecución',
  'guia', 'https://exrx.net/WeightExercises/Brachialis/DBHammerCurl', null, 'PRACTICA'
from public.exercises e where e.nombre = 'Curl martillo'
on conflict (exercise_id, titulo) do nothing;

insert into public.exercise_sources (exercise_id, autor, titulo, tipo, url, anio, evidencia)
select e.id, 'ExRx.net',
  'Cable Rope Pushdown — clasificación y ejecución',
  'guia', 'https://exrx.net/WeightExercises/Triceps/CBRopePushdown', null, 'PRACTICA'
from public.exercises e where e.nombre = 'Extensión de tríceps en polea'
on conflict (exercise_id, titulo) do nothing;

insert into public.exercise_sources (exercise_id, autor, titulo, tipo, url, anio, evidencia)
select e.id, 'Squat University',
  'Cómo perfeccionar la sentadilla frontal (Front Squat)',
  'guia', 'https://squatuniversity.com/2016/04/07/how-to-perfect-the-front-squat', null, 'PRACTICA'
from public.exercises e where e.nombre = 'Sentadilla frontal con barra'
on conflict (exercise_id, titulo) do nothing;

insert into public.exercise_sources (exercise_id, autor, titulo, tipo, url, anio, evidencia)
select e.id, 'Catalyst Athletics',
  'Parallel Front Squat — biblioteca de ejercicios de levantamiento olímpico',
  'guia', 'https://www.catalystathletics.com/exercise/438/Parallel-Front-Squat', null, 'PRACTICA'
from public.exercises e where e.nombre = 'Sentadilla frontal con barra'
on conflict (exercise_id, titulo) do nothing;

insert into public.exercise_sources (exercise_id, autor, titulo, tipo, url, anio, evidencia)
select e.id, 'Squat University',
  '6 pasos para perfeccionar el pistol squat',
  'guia', 'https://squatuniversity.com/2016/06/24/6-steps-to-perfecting-your-pistol-squat', null, 'PRACTICA'
from public.exercises e where e.nombre = 'Sentadilla pistola'
on conflict (exercise_id, titulo) do nothing;

insert into public.exercise_sources (exercise_id, autor, titulo, tipo, url, anio, evidencia)
select e.id, 'GMB',
  'Progresión del pistol squat método bottom-up',
  'guia', 'https://gmb.io/pistol', null, 'PRACTICA'
from public.exercises e where e.nombre = 'Sentadilla pistola'
on conflict (exercise_id, titulo) do nothing;

insert into public.exercise_sources (exercise_id, autor, titulo, tipo, url, anio, evidencia)
select e.id, null,
  'Preparación física y progresión del handstand (gymnasticsdirect.com.au)',
  'guia', 'https://www.gymnasticsdirect.com.au/', null, 'PRACTICA'
from public.exercises e where e.nombre = 'Flexión de pino'
on conflict (exercise_id, titulo) do nothing;

insert into public.exercise_sources (exercise_id, autor, titulo, tipo, url, anio, evidencia)
select e.id, null,
  'Modelo biomecánico de planche y planche→handstand, 9 segmentos (PMC10376746)',
  'estudio', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10376746/', null, 'LIMITADA'
from public.exercises e where e.nombre = 'Planche completa'
on conflict (exercise_id, titulo) do nothing;

insert into public.exercise_sources (exercise_id, autor, titulo, tipo, url, anio, evidencia)
select e.id, 'Oranchuk DJ et al.',
  'Isometric exercise and implications for muscle and tendon adaptation (2019)',
  'estudio', 'https://onlinelibrary.wiley.com/', 2019, 'ALTA'
from public.exercises e where e.nombre = 'Front Lever Completo'
on conflict (exercise_id, titulo) do nothing;

insert into public.exercise_sources (exercise_id, autor, titulo, tipo, url, anio, evidencia)
select e.id, null,
  'Muscle up de barra vs anillas (PMC10824315)',
  'estudio', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10824315/', null, 'LIMITADA'
from public.exercises e where e.nombre = 'Muscle Up anillas'
on conflict (exercise_id, titulo) do nothing;

insert into public.exercise_sources (exercise_id, autor, titulo, tipo, url, anio, evidencia)
select e.id, null,
  'Guía práctica de core y agarre',
  'guia', null, null, 'PRACTICA'
from public.exercises e where e.nombre = 'Dragon Flag'
on conflict (exercise_id, titulo) do nothing;

insert into public.exercise_sources (exercise_id, autor, titulo, tipo, url, anio, evidencia)
select e.id, 'ExRx.net',
  'Romanian Deadlift — clasificación y ejecución',
  'guia', 'https://exrx.net/WeightExercises/Hamstrings/BBRomanianDeadlift', null, 'PRACTICA'
from public.exercises e where e.nombre = 'Peso muerto rumano con barra'
on conflict (exercise_id, titulo) do nothing;

-- ============================================================
-- Verificación
-- ============================================================
select 'FASE 14 OK' as estado,
  (select count(*) from public.exercises) as ejercicios_total,
  (select count(*) from public.exercises where tipo = 'Calistenia') as calistenia,
  (select count(*) from public.exercises where tipo = 'Musculación') as musculacion,
  (select count(*) from public.exercises where tipo = 'Core') as core,
  (select count(*) from public.exercises where tipo = 'Piernas') as piernas;