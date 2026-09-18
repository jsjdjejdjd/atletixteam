-- ============================================================
-- ATLETIX · FASE 18 · Biblioteca de MUSCULACIÓN · Lote 1
-- Tren superior · A) PECHO  B) ESPALDA
-- Todo aditivo e idempotente (on conflict (nombre) do nothing).
-- Requiere haber corrido 0015 (columnas nuevas).
-- ============================================================

insert into public.exercises
  (nombre, nombre_en, aliases, disciplina, categoria, subcategoria, tipo, dificultad, nivel_dificultad,
   equipamiento, tipo_resistencia, tipo_ejercicio, patron, musculos_primarios, musculos_secundarios,
   musculos_estabilizadores, unilateral, cadena_cinetica, objetivo, series_sugeridas, reps_sugeridas,
   descanso_seg, rir_sugerido, descripcion, instrucciones, errores_comunes, precauciones,
   criterio_progresion, regresion, variantes, sustitutos)
values

-- ============================================================
-- A) PECHO
-- ============================================================
('Press banca con barra', 'Barbell bench press', 'press de banca plano, bench press', 'Musculación', 'Pecho', 'Pectoral mayor (porción media)', 'Musculación', 'Intermedio', 2, 'Banco plano, barra y discos', 'Barra', 'Compuesto', 'Empuje horizontal', array['Pectoral mayor'], array['Deltoides anterior', 'Tríceps braquial'], array['Romboides', 'Manguito rotador', 'Serrato anterior'], false, 'Abierta', 'Fuerza', 4, '6-10', 150, 2,
 'Ejercicio rey de empuje horizontal para pecho, hombro anterior y tríceps.',
 'Acostado, pies firmes, omóplatos retraídos y algo deprimidos, agarre algo más ancho que los hombros. Bajá la barra controlada al esternón y empujá hasta extender sin perder la retracción escapular.',
 'Rebotar la barra en el pecho; perder la retracción escapular; codos a 90° abiertos; talones levantados.',
 'Usá seguridad o alguien que asista; no bajes la barra al cuello; controlá la barra en todo momento.',
 'Cuando dominás 4x8 con RIR 2, subí 2,5-5 kg totales manteniendo la técnica.', 'Press banca con mancuernas o en máquina a la misma altura, o flexiones lastradas.',
 array['Press banca con pausa (2 s en pecho)', 'Press banca agarre cerrado', 'Press banca inclinado', 'Press banca declinado'],
 array['Press de banca con mancuernas', 'Press en máquina de pecho', 'Flexiones lastradas']),

('Press banca inclinado con barra', 'Incline barbell bench press', 'press inclinado con barra', 'Musculación', 'Pecho', 'Pectoral mayor (porción clavicular/superior)', 'Musculación', 'Intermedio', 2, 'Banco inclinado, barra y discos', 'Barra', 'Compuesto', 'Empuje horizontal', array['Pectoral mayor (clavicular)'], array['Deltoides anterior', 'Tríceps braquial'], array['Romboides', 'Serrato anterior'], false, 'Abierta', 'Hipertrofia', 4, '8-12', 120, 2,
 'Empuje inclinado que enfatiza la porción superior del pecho y el deltoides anterior.',
 'Banco a 30-45°. Omóplatos retraídos y pies firmes. Bajá la barra a la parte alta del pecho y empujá en línea ligeramente hacia atrás.',
 'Inclinación excesiva (>45°) que convierte el ejercicio en un press de hombros; bajar al esternón; perder la retracción.',
 'Evitá inclinaciones muy altas si hay molestia en el hombro anterior.',
 'Subí carga cuando completás 4x10 con RIR 2 sin perder el ángulo.', 'Press inclinado con mancuernas o en máquina inclinada.',
 array['Press inclinado con mancuernas', 'Press inclinado en máquina', 'Press inclinado con pausa'],
 array['Press inclinado con mancuernas', 'Press inclinado en máquina', 'Press militar (si no hay banco)']),

('Press banca declinado con barra', 'Decline barbell bench press', 'press declinado con barra', 'Musculación', 'Pecho', 'Pectoral mayor (porción abdominal/inferior)', 'Musculación', 'Intermedio', 2, 'Banco declinado, barra y discos', 'Barra', 'Compuesto', 'Empuje horizontal', array['Pectoral mayor (abdominal)'], array['Tríceps braquial', 'Deltoides anterior'], array['Serrato anterior'], false, 'Abierta', 'Hipertrofia', 4, '8-12', 120, 2,
 'Press con inclinación negativa que enfatiza la porción inferior del pectoral.',
 'Fijate en el banco declinado con las piernas aseguradas. Bajá la barra a la parte baja del pecho y empujá sin perder el apoyo de la espalda.',
 'Bajar la barra al cuello; despegar la cadera; usar un recorrido parcial.',
 'La posición declinada puede elevar la presión arterial; evitá si hay riesgo cardiovascular.',
 'Progresá igual que el press plano, priorizando el control de la bajada.', 'Press declinado con mancuernas o fondos en paralelas con énfasis en pecho.',
 array['Press declinado con mancuernas', 'Fondos en paralelas (énfasis pecho)', 'Press en máquina declinada'],
 array['Fondos en paralelas (énfasis pecho)', 'Press en máquina de pecho']),

('Press banca con mancuernas', 'Dumbbell bench press', 'press plano con mancuernas', 'Musculación', 'Pecho', 'Pectoral mayor (porción media)', 'Musculación', 'Principiante', 1, 'Banco plano y mancuernas', 'Mancuernas', 'Compuesto', 'Empuje horizontal', array['Pectoral mayor'], array['Deltoides anterior', 'Tríceps braquial'], array['Romboides', 'Manguito rotador'], false, 'Abierta', 'Hipertrofia', 4, '8-12', 120, 2,
 'Versión con mancuernas que permite mayor rango y corrige asimetrías.',
 'Con una mancuerna en cada mano, omóplatos retraídos. Bajá hasta sentir estiramiento del pecho y empujá juntando ligeramente las manos sin chocarlas.',
 'Bajar demasiado y forzar el hombro; abrir los codos en cruz; perder la retracción.',
 'Controlá las mancuernas al soltarlas; no uses cargas que no puedas estabilizar.',
 'Aumentá 1-2 kg por mancuerna cuando completás 4x10 con RIR 2.', 'Press con mancuernas sobre el suelo o máquina de pecho.',
 array['Press inclinado con mancuernas', 'Press neutro (agarre martillo)', 'Press con mancuernas a una mano'],
 array['Press en máquina de pecho', 'Press banca con barra', 'Flexiones lastradas']),

('Press inclinado con mancuernas', 'Incline dumbbell press', 'press arnold, press inclinado mancuernas', 'Musculación', 'Pecho', 'Pectoral mayor (porción clavicular)', 'Musculación', 'Intermedio', 2, 'Banco inclinado y mancuernas', 'Mancuernas', 'Compuesto', 'Empuje horizontal', array['Pectoral mayor (clavicular)'], array['Deltoides anterior', 'Tríceps braquial'], array['Serrato anterior'], false, 'Abierta', 'Hipertrofia', 4, '8-12', 120, 2,
 'Press inclinado con mancuernas, excelente para el pecho superior y el control del hombro.',
 'Banco a 30°. Bajá las mancuernas a la línea del pecho alto y empujá hacia arriba y ligeramente adentro, sin choque brusco.',
 'Inclinación excesiva; bajar demasiado; perder el control por fatiga.', 'Elevá las mancuernas con ayuda si la carga es alta.',
 'Subí carga o reps al llegar a 4x10 RIR 2.', 'Press inclinado en máquina o con barra a menor ángulo.',
 array['Press Arnold', 'Press inclinado neutro', 'Press inclinado en máquina'], array['Press inclinado en máquina', 'Press banca inclinado con barra']),

('Press declinado con mancuernas', 'Decline dumbbell press', 'press declinado mancuernas', 'Musculación', 'Pecho', 'Pectoral mayor (porción inferior)', 'Musculación', 'Intermedio', 2, 'Banco declinado y mancuernas', 'Mancuernas', 'Compuesto', 'Empuje horizontal', array['Pectoral mayor (abdominal)'], array['Tríceps braquial', 'Deltoides anterior'], array['Serrato anterior'], false, 'Abierta', 'Hipertrofia', 4, '8-12', 120, 2,
 'Press declinado con mancuernas para el pecho inferior con mayor rango.',
 'Fijate y bajá las mancuernas hacia la línea baja del pecho, empujá hasta casi juntarlas arriba.',
 'Bajar demasiado; perder el control de la mancuerna; incomodidad por la posición.',
 'Requiere asistencia para acomodar las mancuernas.', 'Cargá cuando completás 4x12 RIR 2.',
 'Fondos con inclinación de pecho o press declinado con barra.',
 array['Fondos en paralelas', 'Press declinado con barra'], array['Press en máquina de pecho', 'Fondos en paralelas']),

('Press de pecho en máquina', 'Chest press machine', 'press en máquina, máquina de pecho', 'Musculación', 'Pecho', 'Pectoral mayor (general)', 'Musculación', 'Principiante', 1, 'Máquina de press de pecho', 'Máquina', 'Compuesto', 'Empuje horizontal', array['Pectoral mayor'], array['Deltoides anterior', 'Tríceps braquial'], array['Serrato anterior'], false, 'Abierta', 'Hipertrofia', 4, '10-15', 90, 2,
 'Press guiado ideal para principiantes o para entrenar pecho sin estabilizar la barra.',
 'Ajustá el asiento para que las asas queden a la altura del pecho. Empujá sin bloquear bruscamente y volvé controlado.',
 'Asiento mal regulado; rango incompleto; soltar las manijas de golpe.',
 'Es una buena opción si tenés molestias de hombro con barra libre.',
 'Sumá una placa cuando llegás a 4x15 RIR 2.', 'Press con mancuernas ligeras o flexiones.',
 array['Press en Smith', 'Press en máquina inclinada'], array['Press con mancuernas', 'Flexiones']),

('Aperturas con mancuernas', 'Dumbbell fly', 'aperturas planas, fly', 'Musculación', 'Pecho', 'Pectoral mayor (porción esternocostal)', 'Musculación', 'Intermedio', 2, 'Banco plano y mancuernas', 'Mancuernas', 'Aislado', 'Aducción', array['Pectoral mayor'], array['Deltoides anterior', 'Bíceps braquial'], array['Manguito rotador'], false, 'Abierta', 'Hipertrofia', 3, '10-15', 90, 2,
 'Apertura con codos semi-flexionados que busca la aducción y el estiramiento del pecho.',
 'Con las mancuernas arriba, codos levemente flexionados y fijos; abrí en arco amplio hasta sentir estiramiento y cerrá apretando el pecho.',
 'Flexionar y extender los codos (se vuelve press); bajar demasiado forzando el hombro; usar cargas altas con mala técnica.',
 'No bajes más allá del plano del cuerpo si sentís tirón en el hombro anterior.',
 'Aumentá el rango y las reps antes que la carga.', 'Aperturas en polea o peck deck con menor carga.',
 array['Aperturas inclinadas', 'Crossover en polea', 'Pec deck'], array['Pec deck', 'Crossover en polea', 'Press con mancuernas']),

('Aperturas inclinadas con mancuernas', 'Incline dumbbell fly', 'aperturas inclinadas', 'Musculación', 'Pecho', 'Pectoral mayor (porción clavicular)', 'Musculación', 'Intermedio', 2, 'Banco inclinado y mancuernas', 'Mancuernas', 'Aislado', 'Aducción', array['Pectoral mayor (clavicular)'], array['Deltoides anterior'], array['Manguito rotador'], false, 'Abierta', 'Hipertrofia', 3, '10-15', 90, 2,
 'Apertura en banco inclinado para el pecho superior.',
 'Banco a 30°, codos fijos semi-flexionados; abrí en arco y cerrá apretando arriba.',
 'Convertirlo en press; inclinación excesiva; rango exagerado.',
 'Usá cargas moderadas por la palanca sobre el hombro.', 'Más reps y mejor conexión antes que más peso.',
 'Aperturas planas o en máquina.', array['Aperturas planas', 'Crossover bajo en polea'], array['Crossover en polea', 'Press inclinado en máquina']),

('Crossover en polea', 'Cable crossover', 'aperturas en polea alta', 'Musculación', 'Pecho', 'Pectoral mayor (porción esternocostal)', 'Musculación', 'Intermedio', 2, 'Polea doble alta', 'Polea', 'Aislado', 'Aducción', array['Pectoral mayor'], array['Deltoides anterior'], array['Serrato anterior', 'Core'], false, 'Abierta', 'Hipertrofia', 3, '12-15', 60, 2,
 'Aducción en polea con tensión constante en todo el recorrido.',
 'Un pie adelante, ligera inclinación del torso; llevá las manos a juntarse delante del pecho bajo, apretando el pectoral.',
 'Encoger los hombros; usar solo los brazos; balancear el torso.',
 'Mantené el torso estable para no cargar la lumbar.', 'Progresá con reps y control, luego un punto de polea.',
 'Aperturas con mancuernas o pec deck con menos carga.',
 array['Crossover bajo', 'Crossover desde polea media', 'Aperturas en polea a una mano'], array['Pec deck', 'Aperturas con mancuernas']),

('Crossover bajo en polea', 'Low cable crossover', 'crossover bajo, aperturas polea baja', 'Musculación', 'Pecho', 'Pectoral mayor (porción clavicular)', 'Musculación', 'Intermedio', 2, 'Polea doble baja', 'Polea', 'Aislado', 'Aducción', array['Pectoral mayor (clavicular)'], array['Deltoides anterior'], array['Core'], false, 'Abierta', 'Hipertrofia', 3, '12-15', 60, 2,
 'Crossover desde abajo que enfatiza la porción superior del pecho.',
 'Con poleas bajas, llevá las manos hacia arriba y adentro hasta juntarlas a la altura del pecho alto.',
 'Tirar con los brazos; subir los hombros; perder la postura.',
 'Evitá rangos que provoquen molestia en el hombro.', 'Más control y reps antes que carga.',
 'Crossover en polea alta.', array['Crossover en polea alta', 'Aperturas inclinadas'], array['Pec deck', 'Press inclinado en máquina']),

('Pec deck (mariposa)', 'Pec deck machine', 'mariposa, aperturas en máquina', 'Musculación', 'Pecho', 'Pectoral mayor (general)', 'Musculación', 'Principiante', 1, 'Máquina pec deck', 'Máquina', 'Aislado', 'Aducción', array['Pectoral mayor'], array['Deltoides anterior'], array['Manguito rotador'], false, 'Abierta', 'Hipertrofia', 3, '12-15', 60, 2,
 'Apertura guiada que aísla el pectoral con gran seguridad.',
 'Ajustá el asiento y el respaldo; apoyá los codos o antebrazos y cerrá apretando al centro.',
 'Asiento mal ajustado; usar impulso; abrir de golpe.',
 'Buen ejercicio si el hombro es sensible con peso libre.', 'Sumá placa al llegar a 3x15 RIR 2.',
 'Crossover en polea o aperturas con mancuernas.', array['Crossover en polea', 'Aperturas con mancuernas'], array['Aperturas con mancuernas', 'Press en máquina']),

('Press en máquina Smith', 'Smith machine bench press', 'press en smith', 'Musculación', 'Pecho', 'Pectoral mayor (porción media)', 'Musculación', 'Principiante', 1, 'Máquina Smith y banco', 'Máquina', 'Compuesto', 'Empuje horizontal', array['Pectoral mayor'], array['Deltoides anterior', 'Tríceps braquial'], array['Romboides'], false, 'Abierta', 'Hipertrofia', 4, '8-12', 120, 2,
 'Press en máquina guiada que permite entrenar pecho con carga alta y poca exigencia de estabilidad.',
 'Ajustá el banco para que la barra baje al esternón; retraé omóplatos y empujá en la trayectoria fija.',
 'Banco mal ubicado; rango parcial; colocar los pies mal.',
 'Fijate siempre los seguros de la máquina.', 'Añadí discos al completar 4x10 RIR 2.',
 'Press en máquina de pecho o con mancuernas.', array['Press banca con barra', 'Press inclinado en Smith'], array['Press con barra', 'Press en máquina de pecho']),

('Press banca con pausa', 'Pause bench press', 'press con pausa', 'Musculación', 'Pecho', 'Pectoral mayor (porción media)', 'Musculación', 'Avanzado', 3, 'Banco plano, barra y discos', 'Barra', 'Compuesto', 'Empuje horizontal', array['Pectoral mayor'], array['Deltoides anterior', 'Tríceps braquial'], array['Romboides', 'Manguito rotador'], false, 'Abierta', 'Fuerza', 5, '3-6', 180, 2,
 'Variante de fuerza que elimina el rebote y exige control posicional.',
 'Bajá la barra al pecho, pausá 1-3 s sin perder tensión y empujá sin rebote.',
 'Rebotar; perder tensión en la pausa; mover los pies.',
 'Usá cargas menores a las del press normal.', 'Mejorá la pausa y la velocidad de salida antes de subir peso.',
 'Press banca con barra o agarre cerrado.', array['Press banca con barra', 'Press banca tempo'], array['Press banca con barra', 'Press en máquina']),

('Flexiones lastradas', 'Weighted push-up', 'flexión con lastre', 'Musculación', 'Pecho', 'Pectoral mayor (general)', 'Musculación', 'Intermedio', 2, 'Disco o chaleco lastrado', 'Peso corporal', 'Compuesto', 'Empuje horizontal', array['Pectoral mayor'], array['Deltoides anterior', 'Tríceps braquial'], array['Serrato anterior', 'Core', 'Glúteos'], false, 'Cerrada', 'Fuerza', 4, '8-15', 90, 2,
 'Flexión con carga externa para progresar el empuje horizontal en peso corporal.',
 'Cuerpo en línea, manos a la altura del pecho; bajá hasta casi tocar y empujá manteniendo el core rígido.',
 'Cadera que cae; rango corto; cuello adelante.',
 'Cargá el lastre de forma segura sobre la espalda alta.', 'Sumá reps o lastre cuando dominás 4x15.',
 'Flexiones en anillas o con pies elevados.', array['Flexiones con pies elevados', 'Flexiones en anillas', 'Flexiones arqueras'], array['Press banca con mancuernas', 'Press en máquina de pecho']),

-- ============================================================
-- B) ESPALDA
-- ============================================================
('Remo con barra', 'Barbell bent-over row', 'remo con barra inclinado, pendlay row', 'Musculación', 'Espalda', 'Dorsal ancho y trapecio medio', 'Musculación', 'Intermedio', 2, 'Barra y discos', 'Barra', 'Compuesto', 'Tirón horizontal', array['Dorsal ancho', 'Trapecio medio', 'Romboides'], array['Deltoides posterior', 'Bíceps braquial', 'Erectores espinales'], array['Core', 'Isquiotibiales'], false, 'Abierta', 'Fuerza', 4, '6-10', 150, 2,
 'Tirón horizontal pesado con barra, base del desarrollo de espalda.',
 'Bisagra de cadera con espalda neutra y torso a ~30-45°; tirá la barra al abdomen bajo y bajá controlado.',
 'Redondear la lumbar; usar impulso de cadera; tirar con los brazos.',
 'Si hay fatiga lumbar, usá banco de apoyo (chest-supported).', 'Subí carga al completar 4x8 RIR 2 con espalda neutra.',
 'Remo con mancuerna a una mano o en máquina.',
 array['Remo Pendlay', 'Remo con barra agarre supino', 'Remo con barra apoyado en banco'],
 array['Remo con mancuerna a una mano', 'Remo en máquina', 'Remo en polea baja']),

('Remo con mancuerna a una mano', 'One-arm dumbbell row', 'remo unilateral con mancuerna', 'Musculación', 'Espalda', 'Dorsal ancho', 'Musculación', 'Principiante', 1, 'Banco y mancuerna', 'Mancuernas', 'Compuesto', 'Tirón horizontal', array['Dorsal ancho'], array['Trapecio medio', 'Romboides', 'Bíceps braquial', 'Deltoides posterior'], array['Core', 'Oblicuos'], true, 'Abierta', 'Hipertrofia', 4, '8-12', 90, 2,
 'Remo unilateral que permite gran rango y corregir diferencias entre lados.',
 'Apoyá una mano y rodilla en el banco, espalda neutra; tirá la mancuerna hacia la cadera y bajá con control.',
 'Rotar el torso; tirar con el bíceps; redondear la espalda.',
 'Evitá rotación excesiva de la cadera.', 'Mejorá el rango y el control antes de subir peso.',
 'Remo con barra o en polea una mano.', array['Remo con barra con apoyo', 'Remo en polea a una mano'], array['Remo en máquina', 'Remo con barra']),

('Remo en polea baja', 'Seated cable row', 'remo sentado en polea, remo bajo', 'Musculación', 'Espalda', 'Dorsal ancho y trapecio medio', 'Musculación', 'Principiante', 1, 'Polea baja y banco', 'Polea', 'Compuesto', 'Tirón horizontal', array['Dorsal ancho', 'Trapecio medio'], array['Romboides', 'Bíceps braquial', 'Deltoides posterior'], array['Erectores espinales', 'Core'], false, 'Abierta', 'Hipertrofia', 4, '10-12', 90, 2,
 'Remo sentado con tensión constante, ideal para técnica y control escapular.',
 'Pecho alto, rodillas algo flexionadas; tirá el maneral al abdomen juntando las escápulas y volvé sin perder el control.',
 'Balancear el torso; encoger los hombros; redondear la espalda.',
 'No hiperextiendas la columna al final del tirón.', 'Subí placa al completar 4x12 RIR 2.',
 'Remo con banda o mancuerna.', array['Remo con agarre neutro', 'Remo unilateral en polea', 'Remo con cuerda'], array['Remo con mancuerna a una mano', 'Remo en máquina']),

('Remo en máquina', 'Machine row', 'remo en máquina de apoyo', 'Musculación', 'Espalda', 'Dorsal ancho y romboides', 'Musculación', 'Principiante', 1, 'Máquina de remo (chest-supported)', 'Máquina', 'Compuesto', 'Tirón horizontal', array['Dorsal ancho', 'Trapecio medio'], array['Romboides', 'Deltoides posterior', 'Bíceps braquial'], array['Core'], false, 'Abierta', 'Hipertrofia', 4, '10-15', 90, 2,
 'Remo guiado con apoyo de pecho que descarga la lumbar.',
 'Pecho apoyado, tirá los codos hacia atrás y juntá las escápulas sin despegar el pecho del pad.',
 'Despegar el pecho; usar impulso; rango corto.',
 'Ajustá el asiento para alinear las asas con el pecho.', 'Sumá placa al llegar a 4x15 RIR 2.',
 'Remo en polea baja o con mancuerna.', array['Remo en polea baja', 'Remo con barra apoyado'], array['Remo en polea baja', 'Remo unilateral con mancuerna']),

('Jalón al pecho', 'Lat pulldown', 'dominada en polea, lat pull', 'Musculación', 'Espalda', 'Dorsal ancho (porción ancha)', 'Musculación', 'Principiante', 1, 'Polea alta y barra larga', 'Polea', 'Compuesto', 'Tirón vertical', array['Dorsal ancho'], array['Trapecio inferior', 'Romboides', 'Bíceps braquial', 'Redondo mayor'], array['Core'], false, 'Abierta', 'Hipertrofia', 4, '8-12', 90, 2,
 'Tirón vertical en polea, progresión directa hacia la dominada.',
 'Sentado con muslos fijados, pecho alto; tirá la barra a la parte alta del pecho llevando los codos hacia abajo y atrás.',
 'Tirar la barra detrás de la nuca; usar balanceo; encoger los hombros al inicio.',
 'Bajá la barra al pecho, nunca detrás del cuello.', 'Subí placa al completar 4x10 RIR 2.',
 'Dominadas asistidas o jalón unilateral.', array['Jalón agarre cerrado', 'Jalón agarre supino', 'Jalón unilateral'], array['Dominadas asistidas', 'Jalón en máquina']),

('Jalón agarre cerrado', 'Close grip lat pulldown', 'jalón agarre estrecho', 'Musculación', 'Espalda', 'Dorsal ancho y redondo mayor', 'Musculación', 'Intermedio', 2, 'Polea alta y maneral en V', 'Polea', 'Compuesto', 'Tirón vertical', array['Dorsal ancho', 'Redondo mayor'], array['Trapecio inferior', 'Bíceps braquial'], array['Core'], false, 'Abierta', 'Hipertrofia', 4, '10-12', 90, 2,
 'Jalón con agarre neutro cerrado que enfatiza la parte baja y el espesor del dorsal.',
 'Con el maneral en V, pecho alto y codos apuntando abajo; tirá hasta el pecho y controlá la subida.',
 'Inclinarse demasiado atrás; tirar con los brazos; rango corto.',
 'Evitá tirones bruscos con cargas altas.', 'Subí placa al completar 4x12 RIR 2.',
 'Jalón al pecho o dominadas neutras.', array['Jalón unilateral', 'Jalón agarre supino'], array['Jalón al pecho', 'Dominadas']),

('Jalón agarre supino', 'Underhand lat pulldown', 'jalón supino, chin pulldown', 'Musculación', 'Espalda', 'Dorsal ancho (porción inferior)', 'Musculación', 'Intermedio', 2, 'Polea alta y barra recta', 'Polea', 'Compuesto', 'Tirón vertical', array['Dorsal ancho', 'Bíceps braquial'], array['Trapecio inferior', 'Romboides'], array['Core'], false, 'Abierta', 'Hipertrofia', 4, '8-12', 90, 2,
 'Jalón con agarre supino que suma bíceps al trabajo de dorsal.',
 'Agarre supino al ancho de hombros, pecho alto; tirá llevando los codos abajo y atrás hasta el pecho.',
 'Encoger los hombros; tirar con la espalda baja; usar impulso.',
 'Cuidá las muñecas con agarre supino y cargas altas.', 'Subí placa al completar 4x10 RIR 2.',
 'Jalón al pecho o dominada supina.', array['Jalón al pecho', 'Jalón unilateral'], array['Dominadas supinas', 'Jalón al pecho']),

('Jalón unilateral en polea', 'Single-arm lat pulldown', 'jalón a una mano', 'Musculación', 'Espalda', 'Dorsal ancho (unilateral)', 'Musculación', 'Intermedio', 2, 'Polea alta y maneral', 'Polea', 'Compuesto', 'Tirón vertical', array['Dorsal ancho'], array['Redondo mayor', 'Trapecio inferior', 'Bíceps braquial'], array['Core', 'Oblicuos'], true, 'Abierta', 'Hipertrofia', 3, '10-12', 75, 2,
 'Jalón a una mano que permite más rango y mejor conexión con el dorsal.',
 'Con el maneral en una mano, tirá el codo hacia la cadera y sentí el estiramiento del dorsal arriba.',
 'Rotar el torso; tirar con el bíceps; encoger el hombro.',
 'Mantené el torso estable para no compensar.', 'Mejorá rango y control antes de subir carga.',
 'Jalón con las dos manos.', array['Jalón al pecho', 'Remo unilateral en polea'], array['Jalón al pecho', 'Dominadas asistidas']),

('Pullover en polea alta', 'Straight-arm pulldown', 'pullover en polea, jalón a brazos rectos', 'Musculación', 'Espalda', 'Dorsal ancho', 'Musculación', 'Intermedio', 2, 'Polea alta y barra recta', 'Polea', 'Aislado', 'Tirón vertical', array['Dorsal ancho'], array['Redondo mayor', 'Tríceps braquial (cabeza larga)'], array['Core'], false, 'Abierta', 'Hipertrofia', 3, '12-15', 60, 2,
 'Aislamiento del dorsal con brazos rectos y tensión constante.',
 'Con brazos casi extendidos, llevá la barra desde arriba de la cabeza hasta los muslos manteniendo el codo fijo.',
 'Flexionar los codos; usar el torso; rango corto.',
 'Evitá cargas altas que fuercen el hombro.', 'Más reps y control antes de subir placa.',
 'Pullover con mancuerna o remo en polea.', array['Pullover con mancuerna', 'Remo en polea baja'], array['Pullover con mancuerna', 'Jalón al pecho']),

('Pullover con mancuerna', 'Dumbbell pullover', 'pullover acostado', 'Musculación', 'Espalda', 'Dorsal ancho y pectoral', 'Musculación', 'Intermedio', 2, 'Banco plano y una mancuerna', 'Mancuernas', 'Aislado', 'Tirón vertical', array['Dorsal ancho', 'Pectoral mayor'], array['Redondo mayor', 'Tríceps braquial'], array['Core'], false, 'Abierta', 'Hipertrofia', 3, '10-15', 75, 2,
 'Clásico que combina estiramiento de dorsal y pecho.',
 'Acostado, sostené la mancuerna con ambas manos y bajala por detrás de la cabeza con codos semi-flexionados; volvé con control.',
 'Bajar demasiado forzando el hombro; flexionar y extender los codos.',
 'Cuidá el hombro anterior si hay molestias.', 'Mejorá el rango antes de subir peso.',
 'Pullover en polea alta.', array['Pullover en polea', 'Aperturas con mancuernas'], array['Pullover en polea', 'Jalón al pecho']),

('Remo Pendlay', 'Pendlay row', 'remo desde el suelo', 'Musculación', 'Espalda', 'Dorsal ancho y trapecio', 'Musculación', 'Avanzado', 3, 'Barra y discos', 'Barra', 'Compuesto', 'Tirón horizontal', array['Dorsal ancho', 'Trapecio medio'], array['Romboides', 'Deltoides posterior', 'Erectores espinales'], array['Core', 'Isquiotibiales'], false, 'Abierta', 'Potencia', 5, '3-6', 150, 2,
 'Remo explosivo con la barra partiendo del suelo en cada repetición.',
 'Torso paralelo al piso, espalda neutra; tirá la barra explosiva al abdomen bajo y volvé a apoyarla en el suelo.',
 'Redondear la espalda; usar la cadera como impulso; perder la posición del torso.',
 'Alta demanda lumbar: exige técnica antes que carga.', 'Aumentá carga cuando la técnica se mantiene a velocidad alta.',
 'Remo con barra o en máquina.', array['Remo con barra', 'Remo con barra agarre supino'], array['Remo con barra', 'Remo en máquina']),

('Face pull', 'Face pull', 'tirón a la cara, polea a la cara', 'Musculación', 'Espalda', 'Trapecio medio/inferior y deltoides posterior', 'Musculación', 'Intermedio', 2, 'Polea con cuerda', 'Polea', 'Accesorio', 'Tirón horizontal', array['Trapecio medio', 'Deltoides posterior'], array['Romboides', 'Infraespinoso', 'Redondo menor'], array['Core'], false, 'Abierta', 'Control corporal', 3, '15-20', 60, 2,
 'Ejercicio de salud de hombro y postura; tira al rostro separando las manos.',
 'Con la polea a la altura de la cara, tirá la cuerda hacia la frente separando las manos y llevando los codos altos.',
 'Encoger los hombros; usar demasiado peso; tirar hacia el pecho.',
 'Priorizá la técnica y el rango sobre la carga.', 'Progresá con más reps y pausas antes que peso.',
 'Pájaros con mancuernas o banda.', array['Reverse pec deck', 'Pájaros con mancuernas', 'Banda a la cara'], array['Reverse pec deck', 'Pájaros con mancuernas']),

('Encogimientos con barra', 'Barbell shrug', 'shrug, encogimientos de trapecio', 'Musculación', 'Espalda', 'Trapecio superior', 'Musculación', 'Principiante', 1, 'Barra y discos', 'Barra', 'Aislado', 'Elevación escapular', array['Trapecio superior'], array['Elevador de la escápula', 'Romboides'], array['Core', 'Antebrazos'], false, 'Abierta', 'Hipertrofia', 4, '10-15', 75, 2,
 'Encogimiento de hombros para el trapecio superior.',
 'Con la barra al frente, elevá los hombros hacia las orejas sin flexionar los codos y bajá controlado con estiramiento.',
 'Rotar los hombros; flexionar los codos; usar impulso.',
 'Evitá tirones y cargas excesivas que fuercen el cuello.', 'Sumá peso al completar 4x15 RIR 2.',
 'Encogimientos con mancuernas.', array['Encogimientos con mancuernas', 'Encogimientos en Smith'], array['Encogimientos con mancuernas', 'Face pull']),

('Encogimientos con mancuernas', 'Dumbbell shrug', 'shrug con mancuernas', 'Musculación', 'Espalda', 'Trapecio superior', 'Musculación', 'Principiante', 1, 'Mancuernas', 'Mancuernas', 'Aislado', 'Elevación escapular', array['Trapecio superior'], array['Elevador de la escápula'], array['Antebrazos'], false, 'Abierta', 'Hipertrofia', 4, '12-15', 60, 2,
 'Variante con mancuernas que permite un recorrido más natural.',
 'Con una mancuerna a cada lado, elevá los hombros recto hacia arriba y bajá con control.',
 'Rotar; flexionar codos; balancear el cuerpo.',
 'No fuerces el cuello hacia adelante.', 'Subí peso al completar 4x15 RIR 2.',
 'Encogimientos con barra.', array['Encogimientos con barra', 'Encogimientos inclinado'], array['Encogimientos con barra', 'Remo al mentón'])

on conflict (nombre) do nothing;

-- ============================================================
-- Verificación
-- ============================================================
select 'FASE 18 OK' as estado,
  (select count(*) from public.exercises where disciplina = 'Musculación') as musculacion,
  (select count(*) from public.exercises where categoria = 'Pecho') as pecho,
  (select count(*) from public.exercises where categoria = 'Espalda') as espalda;
