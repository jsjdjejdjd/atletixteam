-- ============================================================
-- ATLETIX · FASE 18 · Biblioteca de MUSCULACIÓN · Lote 4
-- M) CORE  N) CUERPO COMPLETO  Ñ) ACCESORIOS  O) PREHABILITACIÓN
-- Todo aditivo e idempotente (on conflict (nombre) do nothing).
-- ============================================================

insert into public.exercises
  (nombre, nombre_en, aliases, disciplina, categoria, subcategoria, tipo, dificultad, nivel_dificultad,
   equipamiento, tipo_resistencia, tipo_ejercicio, patron, musculos_primarios, musculos_secundarios,
   musculos_estabilizadores, unilateral, cadena_cinetica, objetivo, series_sugeridas, reps_sugeridas,
   descanso_seg, rir_sugerido, descripcion, instrucciones, errores_comunes, precauciones,
   criterio_progresion, regresion, variantes, sustitutos)
values

-- ============================================================
-- M) CORE
-- ============================================================
('Crunch en máquina', 'Machine crunch', 'abdominal en máquina', 'Musculación', 'Core', 'Recto abdominal (flexión de tronco)', 'Musculación', 'Principiante', 1, 'Máquina de crunch', 'Máquina', 'Aislado', 'Flexión de tronco', array['Recto abdominal'], array['Oblicuos'], array['Transverso abdominal'], false, 'Abierta', 'Hipertrofia', 3, '12-15', 60, 2,
 'Flexión de tronco guiada que permite cargar el recto abdominal.',
 'Ajustá el asiento; abrazá las asas y acercá el esternón a la pelvis sin tirar con los brazos.',
 'Tirar con los brazos; usar impulso; rango corto.',
 'No tracciones el cuello ni la cabeza.', 'Sumá placa al completar 3x15.',
 'Crunch en el suelo.', array['Crunch en polea', 'Crunch con disco'], array['Crunch', 'Crunch inverso']),

('Sit up', 'Sit-up', 'abdominal completo, incorporación', 'Musculación', 'Core', 'Recto abdominal y flexores de cadera', 'Musculación', 'Principiante', 1, 'Suelo', 'Peso corporal', 'Compuesto', 'Flexión de tronco', array['Recto abdominal', 'Flexores de cadera'], array['Oblicuos'], array['Transverso abdominal'], false, 'Cerrada', 'Resistencia', 3, '15-20', 45, 2,
 'Incorporación completa desde el suelo.',
 'Con pies fijos, subí el torso hasta sentarte y bajá controlando la columna.',
 'Tirar del cuello; usar impulso; bajar descontrolado.',
 'Si molesta la lumbar, preferí crunch o dead bug.', 'Más reps o disco al pecho.',
 'Crunch en máquina.', array['Sit up con disco', 'Sit up en banco declinado'], array['Crunch', 'Crunch en máquina']),

('Elevación de piernas tumbado', 'Lying leg raise', 'elevación de piernas en el suelo', 'Musculación', 'Core', 'Recto abdominal (porción inferior)', 'Musculación', 'Intermedio', 2, 'Suelo', 'Peso corporal', 'Aislado', 'Flexión de tronco', array['Recto abdominal'], array['Flexores de cadera', 'Oblicuos'], array['Transverso abdominal'], false, 'Cerrada', 'Control corporal', 3, '12-15', 60, 2,
 'Elevación de piernas con control para el abdomen bajo.',
 'Acostado, lumbar pegada al suelo; elevá las piernas rectas hasta 90° y bajá sin despegar la lumbar.',
 'Arquear la lumbar; usar impulso; bajar de golpe.',
 'Alejá los brazos del cuerpo para estabilizar.', 'Más reps o descenso más lento.',
 'Elevación de rodillas colgado.', array['Elevación de piernas en banco', 'Dead bug'], array['Elevaciones de piernas colgado', 'Crunch inverso']),

('Sit up con disco', 'Weighted sit-up', 'abdominal lastrado', 'Musculación', 'Core', 'Recto abdominal', 'Musculación', 'Intermedio', 2, 'Suelo y disco', 'Mixto', 'Aislado', 'Flexión de tronco', array['Recto abdominal'], array['Flexores de cadera', 'Oblicuos'], array['Transverso abdominal'], false, 'Cerrada', 'Hipertrofia', 3, '12-15', 60, 2,
 'Incorporación con disco al pecho para progresar el abdomen.',
 'Con el disco abrazado al pecho, subí el torso de forma controlada y bajá lento.',
 'Tirar del cuello; impulso; rango parcial.',
 'Controlá la posición del disco.', 'Añadí peso al completar 3x15.',
 'Crunch con disco.', array['Crunch con disco', 'Sit up declinado'], array['Crunch en máquina', 'Rueda abdominal']),

('Dead bug', 'Dead bug', 'bicho muerto', 'Musculación', 'Core', 'Transverso abdominal (anti-extensión)', 'Musculación', 'Principiante', 1, 'Suelo', 'Peso corporal', 'Estabilidad', 'Anti-extensión', array['Transverso abdominal'], array['Recto abdominal', 'Oblicuos'], array['Erectores espinales'], true, 'Cerrada', 'Control corporal', 3, '10-12 por lado', 45, 2,
 'Ejercicio de control lumbo-pélvico; enseña a mantener la columna neutra.',
 'Acostado con brazos y rodillas arriba; extendé un brazo y la pierna opuesta sin despegar la lumbar.',
 'Arquear la lumbar; apurar el movimiento; perder la respiración.',
 'La lumbar siempre pegada al suelo; si se despega, reducí el rango.', 'Más rango y control; luego pausas.',
 'Bird dog o plancha.', array['Dead bug con banda', 'Dead bug con extensión de piernas'], array['Plancha', 'Bird dog']),

('Bird dog', 'Bird dog', 'perro de caza', 'Musculación', 'Core', 'Estabilidad lumbo-pélvica', 'Musculación', 'Principiante', 1, 'Suelo', 'Peso corporal', 'Estabilidad', 'Estabilidad lumbo-pélvica', array['Transverso abdominal', 'Erectores espinales'], array['Glúteo mayor', 'Oblicuos'], array['Core'], true, 'Cerrada', 'Control corporal', 3, '8-10 por lado', 45, 2,
 'Estabilidad de tronco en cuadrupedia extendiendo brazo y pierna opuesta.',
 'En cuadrupedia, extendé un brazo y la pierna opuesta manteniendo la columna neutra; volvé y cambiá.',
 'Rotar la cadera; levantar la cabeza; perder la estabilidad.',
 'Calidad y control antes que velocidad.', 'Más pausas y rango.',
 'Dead bug.', array['Bird dog con banda', 'Bird dog isométrico'], array['Dead bug', 'Plancha']),

('Body saw', 'Body saw', 'sierra abdominal', 'Musculación', 'Core', 'Anti-extensión', 'Musculación', 'Avanzado', 3, 'Suelo y TRX o anillas', 'Peso corporal', 'Estabilidad', 'Anti-extensión', array['Recto abdominal', 'Transverso abdominal'], array['Oblicuos', 'Serrato anterior'], array['Glúteos'], false, 'Cerrada', 'Control corporal', 3, '8-12', 60, 2,
 'Plancha en anillas/TRX con desplazamiento que exige máximo control anti-extensión.',
 'En plancha con anillas, desplazá el cuerpo atrás y adelante manteniendo el core rígido.',
 'Arquear la lumbar; perder la línea; rango excesivo.',
 'Empezá con poco recorrido.', 'Más recorrido y pausas.',
 'Plancha con deslizamiento en silla.', array['Rueda abdominal', 'Plancha frontal'], array['Plancha', 'Rueda abdominal']),

('Rollout con barra', 'Barbell rollout', 'rollout con barra, abdominal con barra', 'Musculación', 'Core', 'Anti-extensión', 'Musculación', 'Avanzado', 3, 'Barra y disco', 'Barra', 'Estabilidad', 'Anti-extensión', array['Recto abdominal', 'Transverso abdominal'], array['Dorsal ancho', 'Oblicuos', 'Tríceps'], array['Glúteos', 'Erectores espinales'], false, 'Abierta', 'Control corporal', 3, '8-12', 75, 2,
 'Extensión desde rodillas con barra, potente anti-extensión.',
 'Arrodillado, rodá la barra hacia adelante manteniendo la pelvis neutra y volvé con el core.',
 'Arquear la lumbar; usar los brazos; rango excesivo.',
 'Empezá con rango corto y avanzá gradual.', 'Más rango o de pie.',
 'Rueda abdominal.', array['Rueda abdominal', 'Body saw'], array['Rueda abdominal', 'Plancha']),

('Plancha frontal con peso', 'Weighted plank', 'plancha lastrada', 'Musculación', 'Core', 'Anti-extensión', 'Musculación', 'Intermedio', 2, 'Suelo y disco', 'Mixto', 'Estabilidad', 'Anti-extensión', array['Recto abdominal', 'Transverso abdominal'], array['Oblicuos', 'Glúteos'], array['Erectores espinales'], false, 'Cerrada', 'Control corporal', 3, '30-60 s', 60, 2,
 'Plancha con lastre para progresar la isometría.',
 'En plancha sobre antebrazos, apoyá un disco en la espalda alta y sostené la línea.',
 'Caderas altas o bajas; apneas; perder la línea.',
 'Subí el peso gradualmente.', 'Más tiempo o peso.',
 'Plancha frontal.', array['Plancha frontal', 'Plancha con elevación de brazo'], array['Plancha', 'Dead bug']),

('Rotación en polea alta', 'High cable chop', 'leñador alto, chop', 'Musculación', 'Core', 'Oblicuos (rotación)', 'Musculación', 'Intermedio', 2, 'Polea alta', 'Polea', 'Aislado', 'Rotación', array['Oblicuos externos e internos'], array['Recto abdominal'], array['Core', 'Glúteos'], true, 'Abierta', 'Control corporal', 3, '12-15 por lado', 60, 2,
 'Rotación con polea alta que entrena los oblicuos.',
 'De costado, tirá el maneral en diagonal hacia la cadera opuesta rotando el torso con control.',
 'Tirar con los brazos; mover la cadera; rango excesivo.',
 'Rotá desde el tronco, no desde la lumbar.', 'Subí placa al completar 3x15 por lado.',
 'Rotación en polea baja.', array['Leñador bajo', 'Giro ruso'], array['Giro ruso', 'Pallof press']),

('Leñador bajo en polea', 'Low cable chop', 'leñador bajo, lift', 'Musculación', 'Core', 'Oblicuos (rotación)', 'Musculación', 'Intermedio', 2, 'Polea baja', 'Polea', 'Aislado', 'Rotación', array['Oblicuos externos e internos'], array['Recto abdominal', 'Deltoides'], array['Core', 'Glúteos'], true, 'Abierta', 'Control corporal', 3, '12-15 por lado', 60, 2,
 'Rotación ascendente desde polea baja.',
 'De costado, tirá el maneral en diagonal hacia arriba y al lado opuesto con control.',
 'Usar los brazos; movimientos bruscos; rango excesivo.',
 'Mantené la cadera estable.', 'Subí placa al completar 3x15 por lado.',
 'Rotación en polea alta.', array['Leñador alto', 'Giro ruso'], array['Pallof press', 'Giro ruso']),

('Flexión lateral con mancuerna', 'Dumbbell side bend', 'crunch lateral, flexión lateral', 'Musculación', 'Core', 'Oblicuos y cuadrado lumbar', 'Musculación', 'Principiante', 1, 'Mancuerna', 'Mancuernas', 'Aislado', 'Flexión lateral', array['Oblicuos', 'Cuadrado lumbar'], array['Erectores espinales'], array['Core'], true, 'Abierta', 'Hipertrofia', 3, '12-15 por lado', 45, 2,
 'Flexión lateral de tronco con mancuerna.',
 'De pie, con una mancuerna, incliná el tronco al costado y volvé con el oblicuo.',
 'Rotar el torso; usar impulso; rango excesivo.',
 'Evitá cargas altas si hay molestia lumbar.', 'Subí peso al completar 3x15 por lado.',
 'Rotación en polea.', array['Flexión lateral en polea', 'Giro ruso'], array['Rotación en polea alta', 'Pallof press']),

('Plancha lateral con peso', 'Weighted side plank', 'plancha lateral lastrada', 'Musculación', 'Core', 'Anti-flexión lateral', 'Musculación', 'Avanzado', 3, 'Suelo y disco', 'Mixto', 'Estabilidad', 'Anti-flexión lateral', array['Oblicuos', 'Cuadrado lumbar'], array['Glúteo medio'], array['Core', 'Hombro'], true, 'Cerrada', 'Control corporal', 3, '20-40 s', 45, 2,
 'Plancha lateral con lastre en la cadera.',
 'En plancha lateral, sostené el disco sobre la cadera manteniendo el cuerpo alineado.',
 'Cadera que cae; rotar el torso; hombro desalineado.',
 'Empezá sin peso y progresá.', 'Más tiempo, luego lastre.',
 'Plancha lateral.', array['Plancha lateral', 'Plancha lateral con elevación'], array['Plancha lateral', 'Pallof press']),

('Paseo del granjero unilateral', 'Suitcase carry', 'suitcase carry, maleta', 'Musculación', 'Core', 'Anti-flexión lateral y agarre', 'Musculación', 'Intermedio', 2, 'Mancuerna o kettlebell', 'Mancuernas', 'Estabilidad', 'Anti-flexión lateral', array['Oblicuos', 'Cuadrado lumbar', 'Flexores de los dedos'], array['Trapecio', 'Glúteo medio', 'Core'], array['Erectores espinales'], true, 'Cerrada', 'Fuerza', 3, '30-45 s por lado', 60, 2,
 'Acarreo con una sola pesa que obliga a resistir la inclinación.',
 'Caminá con una mancuerna en una mano manteniendo el torso recto y los hombros nivelados.',
 'Inclinarse hacia la carga; encoger el hombro; rotar el torso.',
 'Empezá liviano; el reto es no inclinarse.', 'Más peso o más tiempo.',
 'Caminata del granjero.', array['Caminata del granjero', 'Pallof press caminando'], array['Pallof press', 'Plancha lateral']),

-- ============================================================
-- N) CUERPO COMPLETO
-- ============================================================
('Peso muerto convencional', 'Conventional deadlift', 'peso muerto, deadlift', 'Musculación', 'Cuerpo completo', 'Cadena posterior completa', 'Musculación', 'Avanzado', 3, 'Barra y discos', 'Barra', 'Compuesto', 'Bisagra de cadera', array['Glúteo mayor', 'Isquiotibiales', 'Erectores espinales'], array['Cuádriceps', 'Dorsal ancho', 'Trapecio', 'Antebrazos'], array['Core', 'Dorsal ancho'], false, 'Cerrada', 'Fuerza', 4, '4-6', 180, 2,
 'El levantamiento integral de cadena posterior y agarre.',
 'Con la barra sobre los medios pies, bisagra de cadera, pecho arriba; empujá el suelo y elevá la barra pegada al cuerpo hasta bloquear la cadera.',
 'Redondear la lumbar; barra lejos del cuerpo; subir la cadera primero.',
 'Aprendé la técnica sin carga; usá barra con discos y no rebotes.', 'Subí 5 kg al completar 4x5 RIR 2 con técnica estable.',
 'Peso muerto con trap bar o rumano.', array['Peso muerto sumo', 'Peso muerto con trap bar'], array['Peso muerto rumano', 'Hip thrust']),

('Peso muerto sumo', 'Sumo deadlift', 'peso muerto sumo', 'Musculación', 'Cuerpo completo', 'Cadena posterior y aductores', 'Musculación', 'Avanzado', 3, 'Barra y discos', 'Barra', 'Compuesto', 'Bisagra de cadera', array['Glúteo mayor', 'Cuádriceps', 'Aductores'], array['Isquiotibiales', 'Erectores espinales'], array['Core', 'Dorsal ancho'], false, 'Cerrada', 'Fuerza', 4, '4-6', 180, 2,
 'Peso muerto con stance ancho, más vertical y con más aductores.',
 'Pies anchos y punta afuera, agarre por dentro de las piernas; empujá el suelo abriendo las rodillas.',
 'Rodillas hacia adentro; cadera muy baja; barra alejada.',
 'Requiere movilidad de cadera; técnica progresiva.', 'Subí 5 kg al completar 4x5 RIR 2.',
 'Peso muerto convencional.', array['Peso muerto convencional', 'Sentadilla sumo'], array['Peso muerto convencional', 'Hip thrust']),

('Peso muerto con trap bar', 'Trap bar deadlift', 'peso muerto con barra hexagonal', 'Musculación', 'Cuerpo completo', 'Cadena posterior', 'Musculación', 'Intermedio', 2, 'Trap bar y discos', 'Barra', 'Compuesto', 'Bisagra de cadera', array['Cuádriceps', 'Glúteo mayor', 'Isquiotibiales'], array['Erectores espinales', 'Trapecio'], array['Core'], false, 'Cerrada', 'Fuerza', 4, '5-8', 150, 2,
 'Peso muerto con barra hexagonal, más amigable para la espalda.',
 'Dentro de la barra, empujá el suelo y subí manteniendo el torso alto y el core firme.',
 'Redondear la espalda; subir con los brazos; perder la línea.',
 'Buena opción para aprender el patrón de empuje desde el suelo.', 'Subí 5 kg al completar 4x6 RIR 2.',
 'Peso muerto convencional.', array['Peso muerto convencional', 'Peso muerto rumano'], array['Peso muerto convencional', 'Sentadilla con barra']),

('Swing con kettlebell', 'Kettlebell swing', 'swing ruso, KB swing', 'Musculación', 'Cuerpo completo', 'Bisagra de cadera explosiva', 'Musculación', 'Intermedio', 2, 'Kettlebell', 'Kettlebell', 'Potencia', 'Bisagra de cadera', array['Glúteo mayor', 'Isquiotibiales'], array['Erectores espinales', 'Hombros'], array['Core', 'Dorsal ancho'], false, 'Cerrada', 'Potencia', 4, '10-15', 90, 2,
 'Movimiento explosivo de cadera con kettlebell.',
 'Con la pesa entre las piernas, llevá la cadera atrás y explotá extendiendo hasta que la pesa flote a la altura del pecho.',
 'Usar los brazos; sentadilla en vez de bisagra; redondear la espalda.',
 'Dominá la bisagra antes de usar cargas altas.', 'Más peso o reps; cuidá la técnica.',
 'Peso muerto rumano.', array['Swing americano', 'Swing a una mano'], array['Peso muerto rumano', 'Thruster']),

('Thruster', 'Thruster', 'sentadilla y press, thruster', 'Musculación', 'Cuerpo completo', 'Sentadilla + empuje vertical', 'Musculación', 'Avanzado', 3, 'Barra o mancuernas', 'Barra', 'Compuesto', 'Cuerpo completo', array['Cuádriceps', 'Glúteo mayor', 'Deltoides anterior'], array['Tríceps braquial', 'Trapecio'], array['Core'], false, 'Cerrada', 'Potencia', 4, '8-10', 120, 2,
 'Combinación de sentadilla frontal y press sobre la cabeza.',
 'Desde sentadilla frontal, subí y encadená el press sobre la cabeza en un solo movimiento fluido.',
 'Perder el torso; encadenar mal; usar solo brazos en el press.',
 'Alta demanda cardiovascular; empezá liviano.', 'Subí carga cuando el encadenado sea fluido.',
 'Press militar + sentadilla.', array['Thruster con mancuernas', 'Clean and press'], array['Press militar', 'Sentadilla frontal con barra']),

('Clean de potencia', 'Power clean', 'cargada de potencia, clean', 'Musculación', 'Cuerpo completo', 'Levantamiento olímpico (potencia)', 'Musculación', 'Avanzado', 3, 'Barra y discos', 'Barra', 'Potencia', 'Cuerpo completo', array['Glúteo mayor', 'Cuádriceps', 'Trapecio'], array['Isquiotibiales', 'Erectores espinales', 'Deltoides'], array['Core'], false, 'Cerrada', 'Potencia', 5, '3-5', 180, 2,
 'Levantamiento explosivo desde el suelo al hombro.',
 'Desde el suelo, explotá extendiendo cadera y rodillas y recibí la barra en los hombros flexionando ligeramente.',
 'Tirar con los brazos; no extender la cadera; recibir con mala postura.',
 'Requiere enseñanza técnica; empezá con barra vacía.', 'Subí carga solo con técnica sólida.',
 'High pull con barra.', array['Clean and press', 'Hang power clean'], array['Swing con kettlebell', 'Peso muerto']),

('Turkish get-up', 'Turkish get-up', 'levantamiento turco', 'Musculación', 'Cuerpo completo', 'Estabilidad y control', 'Musculación', 'Avanzado', 3, 'Kettlebell', 'Kettlebell', 'Estabilidad', 'Estabilidad lumbo-pélvica', array['Core', 'Glúteo medio', 'Hombro'], array['Cuádriceps', 'Glúteo mayor', 'Deltoides'], array['Erectores espinales'], true, 'Cerrada', 'Control corporal', 3, '3-5 por lado', 90, 2,
 'Secuencia de levantarse del suelo con peso sobre la cabeza.',
 'Con la pesa sobre la cabeza, pasá por todas las etapas (rodillo, cuadrupedia, medio arrodillado) y volvé igual.',
 'Perder la mirada de la pesa; apurar; mala postura.',
 'Aprendé cada paso sin peso primero.', 'Más peso o más reps por lado.',
 'Get-up sin peso.', array['Get-up sin peso', 'Carry unilateral'], array['Pallof press', 'Paseo del granjero unilateral']),

('Empuje de trineo', 'Sled push', 'prowler push, empuje de trineo', 'Musculación', 'Cuerpo completo', 'Empuje cargado', 'Musculación', 'Intermedio', 2, 'Trineo y peso', 'Mixto', 'Potencia', 'Cuerpo completo', array['Cuádriceps', 'Glúteo mayor', 'Pantorrillas'], array['Deltoides anterior', 'Core'], array['Core'], false, 'Cerrada', 'Resistencia', 4, '15-20 m', 90, 2,
 'Empuje de trineo, potencia y acondicionamiento de piernas.',
 'Con el trineo cargado, inclinate y empujá con pasos cortos y potentes manteniendo el torso firme.',
 'Torso que colapsa; pasos largos; perder ritmo.',
 'Elegí peso que te permita avanzar con buena técnica.', 'Añadí peso o distancia.',
 'Arrastre de trineo.', array['Arrastre de trineo', 'Peso muerto con empuje'], array['Swing con kettlebell', 'Thruster']),

('Arrastre de trineo', 'Sled drag', 'arrastre de trineo', 'Musculación', 'Cuerpo completo', 'Tracción cargada', 'Musculación', 'Intermedio', 2, 'Trineo y arnés', 'Mixto', 'Accesorio', 'Cuerpo completo', array['Isquiotibiales', 'Glúteo mayor', 'Pantorrillas'], array['Dorsal ancho', 'Core'], array['Core'], false, 'Cerrada', 'Resistencia', 4, '20-30 m', 90, 2,
 'Arrastre de trineo para cadena posterior y acondicionamiento.',
 'Con el arnés, caminá hacia adelante resistiendo la carga con pasos controlados.',
 'Tirones bruscos; redondear la espalda; perder postura.',
 'Ajustá bien el arnés.', 'Añadí peso o distancia.',
 'Empuje de trineo.', array['Arrastre hacia atrás', 'Caminata con arrastre'], array['Peso muerto rumano', 'Swing con kettlebell']),

-- ============================================================
-- Ñ) ACCESORIOS
-- ============================================================
('Rotación externa en polea', 'Cable external rotation', 'rotación externa de hombro', 'Musculación', 'Accesorios', 'Manguito rotador (infraespinoso)', 'Musculación', 'Principiante', 1, 'Polea baja', 'Polea', 'Accesorio', 'Rotación externa', array['Infraespinoso', 'Redondo menor'], array['Deltoides posterior'], array['Escápula'], true, 'Abierta', 'Control corporal', 3, '12-15 por lado', 45, 2,
 'Rotación externa para el manguito rotador.',
 'Con el codo a 90° pegado al cuerpo, rotá el antebrazo hacia afuera contra la polea y volvé lento.',
 'Mover el codo; usar más peso del que controlás; rango excesivo.',
 'Movimiento lento y de carga liviana.', 'Aumentá placa solo si no perdés el codo pegado.',
 'Rotación externa con banda.', array['Rotación externa con mancuerna', 'Rotación externa con banda'], array['Face pull', 'YTW']),

('Rotación externa con banda', 'Band external rotation', 'rotación de hombro con banda', 'Musculación', 'Accesorios', 'Manguito rotador', 'Musculación', 'Principiante', 1, 'Banda elástica', 'Banda', 'Accesorio', 'Rotación externa', array['Infraespinoso', 'Redondo menor'], array['Deltoides posterior'], array['Escápula'], true, 'Abierta', 'Control corporal', 3, '15-20 por lado', 45, 2,
 'Versión con banda, ideal para calentar el hombro.',
 'Codo a 90° pegado al cuerpo; abrí contra la banda y volvé controlando.',
 'Separar el codo; compensar con el torso; banda muy dura.',
 'Usá banda liviana y foco en el control.', 'Banda más dura o más reps.',
 'Rotación externa en polea.', array['Rotación externa en polea', 'Rotación externa con mancuerna'], array['Face pull', 'YTW']),

('Rotación interna con banda', 'Band internal rotation', 'rotación interna de hombro', 'Musculación', 'Accesorios', 'Subescapular', 'Musculación', 'Principiante', 1, 'Banda elástica', 'Banda', 'Accesorio', 'Rotación interna', array['Subescapular'], array['Pectoral mayor', 'Dorsal ancho'], array['Escápula'], true, 'Abierta', 'Control corporal', 3, '15-20 por lado', 45, 2,
 'Rotación interna para el subescapular.',
 'Codo a 90° pegado al cuerpo; llevá la mano hacia el abdomen contra la banda y volvé lento.',
 'Mover el codo; usar banda muy dura; rango excesivo.',
 'Trabajá el manguito completo (externa + interna).', 'Banda más dura o más reps.',
 'Rotación interna en polea.', array['Rotación interna en polea', 'Pallof press'], array['Rotación externa con banda', 'Face pull']),

('YTW con mancuernas', 'YTW raises', 'ytw, y-t-w', 'Musculación', 'Accesorios', 'Escápula y deltoides posterior', 'Musculación', 'Principiante', 1, 'Mancuernas livianas o banda', 'Mancuernas', 'Accesorio', 'Elevación escapular', array['Trapecio inferior', 'Deltoides posterior'], array['Romboides', 'Infraespinoso'], array['Core'], true, 'Abierta', 'Control corporal', 3, '10-12 por letra', 45, 2,
 'Trabajo escapular en Y, T y W para hombro y postura.',
 'Con el torso inclinado, formá las letras Y, T y W con los brazos elevándolos y apretando la escápula.',
 'Usar peso excesivo; encoger los hombros; rango corto.',
 'Cargas muy livianas; prioridad a la sensación escapular.', 'Más control y pausas antes de peso.',
 'Face pull.', array['YTW en banco inclinado', 'WTW con banda'], array['Face pull', 'Pájaros con mancuernas']),

('Clamshell con banda', 'Banded clamshell', 'almeja con banda, clamshell', 'Musculación', 'Accesorios', 'Glúteo medio', 'Musculación', 'Principiante', 1, 'Banda elástica', 'Banda', 'Accesorio', 'Abducción de cadera', array['Glúteo medio'], array['Glúteo menor'], array['Core'], true, 'Cerrada', 'Control corporal', 3, '15-20 por lado', 45, 2,
 'Activación de glúteo medio en decúbito lateral.',
 'Con la banda sobre las rodillas y caderas a 45°, abrí la rodilla de arriba sin mover la pelvis.',
 'Rotar la pelvis; usar impulso; banda muy dura.',
 'Mantené los pies juntos.', 'Banda más dura o más reps.',
 'Monster walk con banda.', array['Monster walk con banda', 'Abducción en polea'], array['Abducción en máquina', 'Puente a una pierna']),

-- ============================================================
-- O) PREHABILITACIÓN
-- ============================================================
('Plancha de Copenhague', 'Copenhagen plank', 'copenhagen, plancha aductores', 'Musculación', 'Prehabilitación', 'Aductores y estabilidad de cadera', 'Musculación', 'Avanzado', 3, 'Banco o cajón', 'Peso corporal', 'Estabilidad', 'Anti-flexión lateral', array['Aductores'], array['Oblicuos', 'Glúteo medio'], array['Core', 'Hombro'], true, 'Cerrada', 'Control corporal', 3, '15-30 s por lado', 60, 2,
 'Plancha lateral con apoyo en la pierna de arriba: gran prevención de lesiones de ingle.',
 'De costado con el pie de arriba apoyado en el banco, sostené la cadera en línea con el cuerpo.',
 'Cadera que cae; rotar el torso; aguantar la respiración.',
 'Empezá con la rodilla apoyada y progresá a la pierna completa.', 'Más tiempo o pierna estirada.',
 'Plancha lateral.', array['Copenhagen con rodilla apoyada', 'Plancha lateral con peso'], array['Plancha lateral', 'Dead bug']),

('Rotación externa en posición tumbado', 'Side-lying external rotation', 'rotación externa acostado', 'Musculación', 'Prehabilitación', 'Manguito rotador (infraespinoso)', 'Musculación', 'Principiante', 1, 'Mancuerna liviana', 'Mancuernas', 'Accesorio', 'Rotación externa', array['Infraespinoso', 'Redondo menor'], array['Deltoides posterior'], array['Escápula'], true, 'Abierta', 'Control corporal', 3, '12-15 por lado', 45, 2,
 'Rotación externa tumbado de costado para el infraespinoso.',
 'Acostado de costado con el codo a 90° pegado al cuerpo, rotá el antebrazo hacia arriba y volvé lento.',
 'Mover el codo; usar peso excesivo; rango corto.',
 'Carga muy liviana; el objetivo es control y salud.', 'Más reps y control antes de peso.',
 'Rotación externa en polea.', array['Rotación externa con banda', 'Rotación externa en polea'], array['Face pull', 'YTW con mancuernas']),

('Flexión de rodilla en pared', 'Wall slide', 'wall slide, deslizamiento en pared', 'Musculación', 'Prehabilitación', 'Escápula y serrato', 'Musculación', 'Principiante', 1, 'Pared', 'Peso corporal', 'Movilidad', 'Movilidad', array['Serrato anterior', 'Trapecio inferior'], array['Deltoides'], array['Core'], false, 'Cerrada', 'Control corporal', 3, '10-15', 45, 2,
 'Deslizamiento de brazos en pared para movilidad y control escapular.',
 'Espalda y brazos en la pared; deslizá los brazos arriba y abajo manteniendo el contacto.',
 'Arquear la lumbar; despegar los brazos; encogerse.',
 'Cuidá el rango sin dolor de hombro.', 'Más rango y control.',
 'YTW en pared.', array['Wall slide con banda', 'W con banda'], array['YTW con mancuernas', 'Face pull']),

('Estocada isométrica en pared', 'Wall sit', 'sentadilla isométrica en pared, wall sit', 'Musculación', 'Prehabilitación', 'Cuádriceps (isométrico)', 'Musculación', 'Principiante', 1, 'Pared', 'Peso corporal', 'Estabilidad', 'Dominante de rodilla', array['Cuádriceps'], array['Glúteo mayor'], array['Core'], false, 'Cerrada', 'Resistencia', 3, '30-60 s', 45, 2,
 'Isometría de sentadilla contra la pared.',
 'Espalda en la pared, rodillas a 90°; sostené la posición el tiempo objetivo.',
 'Rodillas más allá de los pies; aguantar la respiración; bajar la cadera.',
 'Evitá si hay dolor de rodilla; ajustá el ángulo.', 'Más tiempo o una sola pierna.',
 'Sentadilla goblet.', array['Wall sit a una pierna', 'Sentadilla isométrica'], array['Sentadilla goblet', 'Prensa de piernas']),

('Caminata lateral con banda', 'Banded lateral walk', 'lateral walk, caminata con banda', 'Musculación', 'Prehabilitación', 'Glúteo medio', 'Musculación', 'Principiante', 1, 'Banda elástica', 'Banda', 'Accesorio', 'Abducción de cadera', array['Glúteo medio'], array['Glúteo menor', 'Cuádriceps'], array['Core'], false, 'Cerrada', 'Control corporal', 3, '30-45 s', 45, 2,
 'Activación de abductores caminando lateralmente.',
 'Con la banda sobre las rodillas, media sentadilla y pasos laterales cortos sin juntar los pies.',
 'Juntar los pies; perder la postura; banda muy liviana.',
 'Mantené las rodillas afuera.', 'Banda más fuerte o más tiempo.',
 'Monster walk con banda.', array['Monster walk con banda', 'Clamshell con banda'], array['Abducción en máquina', 'Abducción en polea']),

('Estiramiento de pectoral en pared', 'Doorway pec stretch', 'estiramiento de pecho, movilidad de hombro', 'Musculación', 'Prehabilitación', 'Movilidad de hombro y pectoral', 'Musculación', 'Principiante', 1, 'Marco de puerta o pared', 'Peso corporal', 'Movilidad', 'Movilidad', array['Pectoral mayor'], array['Deltoides anterior', 'Bíceps braquial'], array['Core'], true, 'Abierta', 'Técnica', 3, '30-45 s por lado', 30, 2,
 'Estiramiento de pecho para mejorar la movilidad de hombro.',
 'Apoyá el antebrazo en el marco con el codo a 90° y girate suavemente al lado opuesto hasta sentir estiramiento.',
 'Forzar el rango; rotar la lumbar; dolor en el hombro.',
 'Sin dolor: estiramiento cómodo, no agresivo.', 'Más tiempo o ángulo más alto.',
 'Estiramiento de pectoral tumbado.', array['Estiramiento en banco', 'Estiramiento de pecho con banda'], array['Wall slide', 'YTW con mancuernas'])

on conflict (nombre) do nothing;

-- ============================================================
-- Verificación
-- ============================================================
select 'FASE 18 lote 4 OK' as estado,
  (select count(*) from public.exercises where categoria = 'Core') as core,
  (select count(*) from public.exercises where categoria = 'Cuerpo completo') as full_body,
  (select count(*) from public.exercises where categoria = 'Accesorios') as accesorios,
  (select count(*) from public.exercises where categoria = 'Prehabilitación') as prehab;
