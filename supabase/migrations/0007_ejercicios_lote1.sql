-- ============================================================
-- ATLETIX · FASE 11 · Lote 1 de ejercicios con variantes
-- Se puede ejecutar las veces que quieras (no duplica nada).
-- Supino / Prono / Semi supino / Anillas / Barra / Paralelas
-- ============================================================

-- ---------------- DOMINADAS (Tirón) ----------------
insert into public.exercises (nombre, categoria, dificultad, equipamiento, descripcion, instrucciones, errores_comunes) values
  ('Dominada prono', 'Tirón', 'Intermedio', 'Barra',
   'Dominada clásica con agarre prono (palmas mirando hacia adelante), ancho de hombros o un poco más.',
   'Agarrá la barra con palmas al frente. Colgá con los hombros activos (deprimidos). Tirá con el codo hacia las costillas hasta pasar la barbilla. Bajá controlado hasta el colgado completo.',
   'No subir con impulso ni dar patada; bajar rápido sin control; hombros subidos al inicio; no completar el recorrido.'),
  ('Dominada supino', 'Tirón', 'Intermedio', 'Barra',
   'Dominada con agarre supino (palmas hacia vos), también llamada chin up. Mayor activación de bíceps.',
   'Agarrá la barra con palmas hacia vos y las manos a la altura de los hombros. Tirá intentando llevar el pecho a la barra. Bajá con control hasta colgar.',
   'Separar demasiado los codos; pecho que no llega a la barra; usar impulso de piernas.'),
  ('Dominada semi supino', 'Tirón', 'Intermedio', 'Barra',
   'Dominada con agarre semi supino (palmas en diagonal), posición intermedia entre prono y supino.',
   'Agarrá la barra con las manos en neutro y las palmas mirando en diagonal. Ejecutá el movimiento apretando desde el comienzo. Bajá lento hasta el colgado.',
   'Agarrarse muy ancho; tirar solo con los brazos sin activar la espalda.'),
  ('Dominada anillas', 'Tirón', 'Avanzado', 'Anillas',
   'Dominada en anillas con agarre neutro. Mayor exigencia de estabilidad en hombros y core.',
   'Ajustá las anillas a la altura y colgate con los brazos extendidos. Tirá manteniendo las anillas juntas y estables, sin que roten. Bajá controlado.',
   'Anillas que se separan durante el movimiento; balanceo del cuerpo; hombros sin activar.'),
  ('Dominada lastrada prono', 'Tirón', 'Avanzado', 'Barra',
   'Dominada prono con disco o cadena anclada al cinturón. Ejercicio principal de fuerza.',
   'Anclá la carga al cinturón. Tirá con control absoluto, sin balanceo, hasta pasar la barbilla. Bajá en al menos 2 segundos.',
   'Usar impulso con las piernas; bajar muy rápido; carga excesiva que rompe la técnica.'),
  ('Dominada lastrada supino', 'Tirón', 'Avanzado', 'Barra',
   'Dominada supino con carga en el cinturón, combinando fuerza de espalda y bíceps.',
   'Colgá con carga y tirá manteniendo el pecho alto. Bajá con control total hasta el colgado completo.',
   'Quiebre de técnica por exceso de carga; no completar el rango.'),
  ('Dominada lastrada anillas', 'Tirón', 'Elite', 'Anillas',
   'Dominada en anillas con carga. Exigencia máxima de fuerza y estabilidad.',
   'Con carga anclada, realizá la dominada en anillas manteniéndolas firmes. Movimiento estricto, sin balanceo.',
   'Rotación de anillas; compensación con las piernas.'),
-- ---------------- REMOS (Tirón) ----------------
  ('Remo australiano', 'Tirón', 'Principiante', 'Barra',
   'Remo con el cuerpo inclinado bajo una barra fija (tipo australiano). Base para aprender la dominada.',
   'Acostate debajo de la barra, cuerpo rígido, manos a la altura de los hombros. Tirá el pecho a la barra manteniendo el cuerpo en línea recta. Bajá controlado.',
   'Caderas que caen; subir solo con los brazos; hombros subidos al inicio.'),
  ('Remo australiano supino', 'Tirón', 'Principiante', 'Barra',
   'Variante del remo australiano con agarre supino (palmas hacia vos), enfatizando bíceps.',
   'Acostate bajo la barra con agarre supino. Cuerpo en línea recta y tirá el pecho a la barra. Bajá con control.',
   'Flexión de caderas; barra que no llega al pecho.'),
  ('Remo anillas', 'Tirón', 'Intermedio', 'Anillas',
   'Remo en anillas con el cuerpo inclinado. Permite progresar al front lever y a la dominada.',
   'Colgá de las anillas con el cuerpo inclinado. Tirá llevando los hombros hacia atrás y el pecho a las anillas. Bajá sin soltar la tensión.',
   'Anillas que se separan; rotación del tronco; no estirar los brazos abajo.'),
-- ---------------- FONDOS (Empuje) ----------------
  ('Fondos paralelas', 'Empuje', 'Intermedio', 'Paralelas',
   'Fondo clásico en barras paralelas. Inclina el torso según el enfoque (tríceps o pecho).',
   'Colocate entre las paralelas y extendé los brazos. Bajá flexionando codos hasta tener los hombros a la altura o un poco más. Empujá hasta volver a extender.',
   'Bajar demasiado cargando el hombro; codos abiertos; balanceo de piernas.'),
  ('Fondos anillas', 'Empuje', 'Avanzado', 'Anillas',
   'Fondo en anillas con agarre neutro. Exige estabilidad de hombros y muñecas.',
   'Sobre anillas con los brazos extendidos, bajá manteniendo las anillas firmes junto al cuerpo. Empujá hasta bloqueo sin rotar.',
   'Anillas que rotan hacia afuera; hombros adelante en la bajada; profundidad excesiva.'),
  ('Fondos lastrados paralelas', 'Empuje', 'Avanzado', 'Paralelas',
   'Fondo en paralelas con disco o cadena. Ejercicio principal de empuje en calistenia.',
   'Anclá la carga y realizá el fondo estricto, con movimiento controlado en la bajada y explosivo en la subida.',
   'Rebote en la bajada; codos demasiado abiertos; técnica que se rompe por la carga.'),
  ('Fondos lastrados anillas', 'Empuje', 'Elite', 'Anillas',
   'Fondo en anillas con carga. Exigencia máxima de empuje y estabilidad.',
   'Con carga anclada, profundizá en las anillas manteniéndolas estables y extendete sin rotación.',
   'Pérdida de estabilidad; compensaciones del core.'),
-- ---------------- FLEXIONES (Empuje) ----------------
  ('Flexión inclinada', 'Empuje', 'Principiante', 'Suelo',
   'Flexión apoyado sobre una superficie elevada (banco, pared o barra baja).',
   'Apoyá las manos en la superficie a la altura de los hombros. Cuerpo rígido, bajá el pecho hacia la superficie y volvé a empujar.',
   'Caderas que caen o sobresalen; cabeza adelante.'),
  ('Flexión de pecho', 'Empuje', 'Intermedio', 'Suelo',
   'Flexión clásica en el suelo, base del empuje horizontal.',
   'Manos ancho de hombros, cuerpo en línea recta. Bajá con el pecho hasta casi tocar el suelo y empujá con fuerza.',
   'Codos muy abiertos; lumbar que se hunde; subir primero la cadera.'),
  ('Flexión diamante', 'Empuje', 'Intermedio', 'Suelo',
   'Flexión con las manos juntas formando un rombo. Enfoca el tríceps.',
   'Formá un rombo con dedos y pulgares bajo el pecho. Bajá el cuerpo manteniendo los codos pegados al torso. Empujá hasta extender.',
   'Codos abiertos; lumbar hundida; torso que cae muy rápido.'),
-- ---------------- CORE ----------------
  ('Plancha', 'Core', 'Principiante', 'Suelo',
   'Plancha frontal sobre antebrazos. Fundamental para toda la calistenia.',
   'Apoyá antebrazos y puntas de pies, cuerpo en línea recta. Apretá glúteos y abdomen, y mantené la respiración.',
   'Caderas caídas; glúteos altos; contener la respiración.'),
  ('L-Sit', 'Core', 'Intermedio', 'Paralelas',
   'Sostén en L sobre paralelas. Fuerza de core, pectoral y tríceps.',
   'Sentate en las paralelas, extendé los brazos y elevá las piernas hasta los 90 grados. Mantené el pecho arriba y el abdomen fuerte.',
   'Piernas que caen; hombros adelante; balanceo.'),
  ('Hollow hold', 'Core', 'Principiante', 'Suelo',
   'Posición hueca en el suelo. La base de la rigidez de cuerpo para planche y front lever.',
   'Acostate boca arriba, apretá abdomen y glúteos, elevá hombros y piernas del suelo manteniendo la lumbar pegada.',
   'Lumbar que se despega; piernas muy bajas que quiebran la posición.');

-- ============================================================
-- Verificación
-- ============================================================
select 'FASE 11 OK' as estado, count(*) as ejercicios
from public.exercises;