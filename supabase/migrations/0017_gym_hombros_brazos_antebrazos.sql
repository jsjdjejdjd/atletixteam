-- ============================================================
-- ATLETIX · FASE 18 · Biblioteca de MUSCULACIÓN · Lote 2
-- Tren superior · C) HOMBROS  D) BÍCEPS  E) TRÍCEPS  F) ANTEBRAZOS
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
-- C) HOMBROS
-- ============================================================
('Press militar de pie con barra', 'Standing overhead press', 'press de hombros de pie, military press', 'Musculación', 'Hombros', 'Deltoides anterior', 'Musculación', 'Intermedio', 2, 'Barra y discos', 'Barra', 'Compuesto', 'Empuje vertical', array['Deltoides anterior'], array['Deltoides lateral', 'Tríceps braquial', 'Trapecio superior'], array['Core', 'Glúteos', 'Erectores espinales'], false, 'Abierta', 'Fuerza', 4, '5-8', 150, 2,
 'Empuje vertical de pie que exige estabilidad de todo el cuerpo.',
 'Barra a la altura de los hombros, core firme; empujá sobre la cabeza metiendo la cabeza cuando la barra pasa y terminá con la barra alineada con el cuerpo.',
 'Arquear la lumbar; empujar la barra hacia adelante; no bloquear arriba.',
 'Evitá hiperextender la espalda; si pasa, hacelo sentado.', 'Subí 2,5 kg al completar 4x8 RIR 2.',
 'Press sentado con mancuernas o en máquina.', array['Press Arnold', 'Press sentado con mancuernas', 'Press tras nuca'], array['Press de hombros en máquina', 'Press sentado con mancuernas']),

('Press de hombros sentado con mancuernas', 'Seated dumbbell shoulder press', 'press sentado con mancuernas', 'Musculación', 'Hombros', 'Deltoides anterior', 'Musculación', 'Principiante', 1, 'Banco con respaldo y mancuernas', 'Mancuernas', 'Compuesto', 'Empuje vertical', array['Deltoides anterior'], array['Deltoides lateral', 'Tríceps braquial', 'Trapecio superior'], array['Core', 'Manguito rotador'], false, 'Abierta', 'Hipertrofia', 4, '8-12', 90, 2,
 'Press vertical con mancuernas y respaldo, cómodo para el hombro.',
 'Sentado con respaldo, mancuernas a la altura de las orejas; empujá arriba sin chocarlas y bajá controlado.',
 'Bajar demasiado; abrir los codos en exceso; arquear la espalda.',
 'Apoyá bien la espalda en el respaldo.', 'Subí 1-2 kg por mancuerna al completar 4x10 RIR 2.',
 'Press militar o en máquina.', array['Press Arnold', 'Press en máquina'], array['Press de hombros en máquina', 'Press militar con barra']),

('Press Arnold', 'Arnold press', 'press arnold de hombros', 'Musculación', 'Hombros', 'Deltoides anterior y lateral', 'Musculación', 'Intermedio', 2, 'Banco con respaldo y mancuernas', 'Mancuernas', 'Compuesto', 'Empuje vertical', array['Deltoides anterior', 'Deltoides lateral'], array['Tríceps braquial', 'Trapecio superior'], array['Manguito rotador', 'Core'], false, 'Abierta', 'Hipertrofia', 4, '8-12', 90, 2,
 'Press con rotación que recorre deltoides anterior y lateral.',
 'Comenzá con las palmas hacia vos a la altura del mentón; rotá mientras empujás hasta arriba con palmas al frente.',
 'Perder la rotación; usar impulso; bajar de golpe.',
 'Requiere movilidad de hombro; empezá con carga liviana.', 'Mejorá la fluidez del gesto antes de subir peso.',
 'Press sentado con mancuernas.', array['Press sentado con mancuernas', 'Press militar'], array['Press sentado con mancuernas', 'Press en máquina']),

('Press de hombros en máquina', 'Shoulder press machine', 'press de hombros guiado', 'Musculación', 'Hombros', 'Deltoides anterior', 'Musculación', 'Principiante', 1, 'Máquina de press de hombros', 'Máquina', 'Compuesto', 'Empuje vertical', array['Deltoides anterior'], array['Deltoides lateral', 'Tríceps braquial'], array['Core'], false, 'Abierta', 'Hipertrofia', 4, '10-12', 90, 2,
 'Press guiado que permite trabajar el hombro con seguridad.',
 'Ajustá el asiento para que las asas queden a la altura de los hombros; empujá sin bloquear bruscamente y bajá controlado.',
 'Asiento mal regulado; rango corto; usar impulso.',
 'Ideal para principiantes o para entrenar con fatiga.', 'Sumá placa al completar 4x12 RIR 2.',
 'Press sentado con mancuernas.', array['Press militar', 'Press sentado con mancuernas'], array['Press sentado con mancuernas', 'Press militar con barra']),

('Elevaciones laterales con mancuernas', 'Dumbbell lateral raise', 'laterales, elevación lateral', 'Musculación', 'Hombros', 'Deltoides lateral', 'Musculación', 'Principiante', 1, 'Mancuernas', 'Mancuernas', 'Aislado', 'Abducción', array['Deltoides lateral'], array['Supraespinoso', 'Trapecio superior'], array['Manguito rotador', 'Core'], false, 'Abierta', 'Hipertrofia', 4, '12-15', 60, 2,
 'Aislamiento del deltoides lateral, clave para la amplitud del hombro.',
 'Codos levemente flexionados y fijos; elevá los brazos hacia los costados hasta la altura del hombro y bajá lento.',
 'Subir por encima del hombro con encogimiento; usar impulso; cargas excesivas.',
 'Evitá el "encogimiento" si buscás el deltoides medio.', 'Más reps y control antes que carga; subí 0,5-1 kg a la vez.',
 'Elevaciones laterales en polea o máquina.', array['Elevaciones laterales inclinado', 'Elevaciones laterales en polea'], array['Elevaciones laterales en máquina', 'Elevaciones laterales en polea']),

('Elevaciones laterales en polea', 'Cable lateral raise', 'laterales en polea', 'Musculación', 'Hombros', 'Deltoides lateral', 'Musculación', 'Intermedio', 2, 'Polea baja y maneral', 'Polea', 'Aislado', 'Abducción', array['Deltoides lateral'], array['Supraespinoso'], array['Core'], true, 'Abierta', 'Hipertrofia', 3, '12-15', 60, 2,
 'Laterales con tensión constante en todo el recorrido.',
 'Con la polea baja cruzando el cuerpo, elevá el brazo al costado hasta la altura del hombro y bajá con control.',
 'Inclinarse; usar el torso; subir el hombro.',
 'Mantené el torso estable.', 'Progresá con control y luego con la placa.',
 'Elevaciones laterales con mancuernas.', array['Elevaciones laterales en máquina', 'Elevaciones laterales con mancuernas'], array['Elevaciones laterales en máquina', 'Elevaciones laterales con mancuernas']),

('Elevaciones laterales en máquina', 'Machine lateral raise', 'laterales en máquina', 'Musculación', 'Hombros', 'Deltoides lateral', 'Musculación', 'Principiante', 1, 'Máquina de laterales', 'Máquina', 'Aislado', 'Abducción', array['Deltoides lateral'], array['Supraespinoso'], array['Core'], false, 'Abierta', 'Hipertrofia', 3, '12-15', 60, 2,
 'Laterales guiadas, muy fáciles de controlar.',
 'Ajustá el asiento; apoyá los brazos en los pads y elevá hasta la altura del hombro.',
 'Recorrido parcial; usar el cuerpo; bajar de golpe.',
 'Cuidá de no pasar la altura del hombro.', 'Sumá placa al completar 3x15 RIR 2.',
 'Elevaciones laterales con mancuernas.', array['Elevaciones laterales con mancuernas', 'Elevaciones laterales en polea'], array['Elevaciones laterales con mancuernas', 'Elevaciones laterales en polea']),

('Pájaros con mancuernas', 'Bent-over reverse fly', 'elevaciones posteriores, reverse fly', 'Musculación', 'Hombros', 'Deltoides posterior', 'Musculación', 'Intermedio', 2, 'Mancuernas', 'Mancuernas', 'Aislado', 'Abducción', array['Deltoides posterior'], array['Trapecio medio', 'Romboides', 'Infraespinoso'], array['Core', 'Erectores espinales'], false, 'Abierta', 'Hipertrofia', 3, '12-15', 60, 2,
 'Aislamiento del deltoides posterior y trapecio medio.',
 'Con el torso inclinado y espalda neutra, abrí los brazos hacia los costados con codos semi-flexionados.',
 'Redondear la espalda; usar impulso; encoger los hombros.',
 'Si la postura inclinada molesta, usá banco con apoyo.', 'Mejorá el control antes de subir peso.',
 'Reverse pec deck o face pull.', array['Pájaros en banco inclinado', 'Pájaros en polea'], array['Reverse pec deck', 'Face pull']),

('Reverse pec deck', 'Reverse pec deck machine', 'pec deck inverso, posterior en máquina', 'Musculación', 'Hombros', 'Deltoides posterior', 'Musculación', 'Principiante', 1, 'Máquina pec deck inverso', 'Máquina', 'Aislado', 'Abducción', array['Deltoides posterior'], array['Trapecio medio', 'Romboides'], array['Core'], false, 'Abierta', 'Hipertrofia', 3, '12-15', 60, 2,
 'Deltoides posterior guiado y seguro.',
 'Pecho apoyado, brazos al frente; abrí hacia los costados juntando las escápulas al final.',
 'Usar impulso; rango corto; encogerse.',
 'Ajustá el asiento para alinear los brazos con los hombros.', 'Subí placa al completar 3x15 RIR 2.',
 'Pájaros con mancuernas.', array['Pájaros con mancuernas', 'Face pull'], array['Pájaros con mancuernas', 'Face pull']),

('Elevación frontal con mancuernas', 'Dumbbell front raise', 'frontales, elevación frontal', 'Musculación', 'Hombros', 'Deltoides anterior', 'Musculación', 'Principiante', 1, 'Mancuernas', 'Mancuernas', 'Aislado', 'Flexión de hombro', array['Deltoides anterior'], array['Pectoral mayor (clavicular)'], array['Core'], false, 'Abierta', 'Hipertrofia', 3, '12-15', 60, 2,
 'Aislamiento del deltoides anterior.',
 'De pie, elevá la mancuerna al frente hasta la altura del hombro y bajá con control.',
 'Usar impulso; pasar la altura del hombro; balanceo.',
 'El deltoides anterior ya trabaja mucho en presses; dosificalo.', 'Más reps antes que carga.',
 'Elevación frontal en polea o con disco.', array['Elevación frontal con barra', 'Elevación frontal en polea'], array['Press militar', 'Elevación frontal en polea']),

('Elevación frontal con disco', 'Plate front raise', 'elevación frontal con disco', 'Musculación', 'Hombros', 'Deltoides anterior', 'Musculación', 'Principiante', 1, 'Disco', 'Barra', 'Aislado', 'Flexión de hombro', array['Deltoides anterior'], array['Pectoral mayor (clavicular)'], array['Core'], false, 'Abierta', 'Hipertrofia', 3, '12-15', 60, 2,
 'Elevación frontal con disco, fácil de escalar.',
 'Sostené el disco con ambas manos y elevá al frente hasta la altura de los ojos.',
 'Balancear el cuerpo; encoger los hombros.',
 'Cuidá la muñeca con discos grandes.', 'Añadí discos chicos o reps.',
 'Elevación frontal con mancuernas.', array['Elevación frontal con mancuernas', 'Elevación frontal en polea'], array['Elevación frontal con mancuernas', 'Press militar']),

('Remo al mentón con barra', 'Barbell upright row', 'remo al mentón', 'Musculación', 'Hombros', 'Deltoides lateral y trapecio', 'Musculación', 'Intermedio', 2, 'Barra y discos', 'Barra', 'Compuesto', 'Abducción', array['Deltoides lateral', 'Trapecio superior'], array['Deltoides anterior', 'Bíceps braquial'], array['Core'], false, 'Abierta', 'Hipertrofia', 3, '10-15', 75, 2,
 'Tirón vertical al mentón que carga deltoides lateral y trapecio.',
 'Con agarre al ancho de hombros, tirá la barra hacia el mentón liderando con los codos y bajá controlado.',
 'Tirar por encima del mentón (riesgo de pinzamiento); usar agarre muy estrecho; impulso.',
 'Si hay molestia de hombro, reemplazá por laterales.', 'Mejorá el rango antes que la carga.',
 'Remo al mentón con mancuernas o bandas.', array['Remo al mentón con mancuernas', 'Elevaciones laterales'], array['Elevaciones laterales con mancuernas', 'Encogimientos']),

('Press tras nuca con barra', 'Behind-the-neck press', 'press detrás de la cabeza', 'Musculación', 'Hombros', 'Deltoides lateral', 'Musculación', 'Avanzado', 3, 'Barra y rack', 'Barra', 'Compuesto', 'Empuje vertical', array['Deltoides lateral', 'Deltoides anterior'], array['Tríceps braquial', 'Trapecio superior'], array['Manguito rotador', 'Core'], false, 'Abierta', 'Hipertrofia', 3, '8-12', 120, 2,
 'Press por detrás de la cabeza; exige buena movilidad de hombro.',
 'Barra detrás de la cabeza, empujá arriba sin bajar más de lo que permite tu movilidad.',
 'Forzar el rango; bajar demasiado; perder el control.',
 'NO recomendado si hay dolor o falta de movilidad de hombro.', 'Priorizá rango cómodo y técnica.',
 'Press militar por delante.', array['Press militar de pie con barra', 'Press sentado con mancuernas'], array['Press militar con barra', 'Press en máquina']),

-- ============================================================
-- D) BÍCEPS
-- ============================================================
('Curl con barra', 'Barbell curl', 'curl de bíceps con barra', 'Musculación', 'Bíceps', 'Bíceps braquial (general)', 'Musculación', 'Principiante', 1, 'Barra recta o Z', 'Barra', 'Aislado', 'Flexión de codo', array['Bíceps braquial'], array['Braquial', 'Braquiorradial'], array['Deltoides anterior', 'Core'], false, 'Abierta', 'Hipertrofia', 3, '8-12', 90, 2,
 'Curl básico con barra para masa de bíceps.',
 'De pie, codos pegados al torso, subí la barra sin mover los codos y bajá controlando 2 s.',
 'Balancear el torso; mover los codos al frente; usar impulso de cadera.',
 'Si la muñeca molesta, usá barra Z.', 'Subí 2,5 kg al completar 3x10 RIR 2.',
 'Curl con mancuernas o en polea.', array['Curl con barra Z', 'Curl en polea baja', 'Curl 21s'], array['Curl con mancuernas', 'Curl en polea baja']),

('Curl con barra Z', 'EZ-bar curl', 'curl con barra z, curl romana', 'Musculación', 'Bíceps', 'Bíceps braquial', 'Musculación', 'Principiante', 1, 'Barra Z y discos', 'Barra', 'Aislado', 'Flexión de codo', array['Bíceps braquial'], array['Braquial', 'Braquiorradial'], array['Core'], false, 'Abierta', 'Hipertrofia', 3, '8-12', 90, 2,
 'Curl con barra Z, más amigable para muñecas y codos.',
 'Agarre en los ángulos de la barra Z; subí sin mover los codos y bajá con control.',
 'Balanceo; codos que viajan al frente; rango corto.',
 'Buena opción si la barra recta molesta.', 'Subí carga al completar 3x12 RIR 2.',
 'Curl con barra recta o mancuernas.', array['Curl con barra', 'Curl predicador con barra Z'], array['Curl con mancuernas', 'Curl en polea']),

('Curl alternado con mancuernas', 'Alternating dumbbell curl', 'curl alternado', 'Musculación', 'Bíceps', 'Bíceps braquial', 'Musculación', 'Principiante', 1, 'Mancuernas', 'Mancuernas', 'Aislado', 'Flexión de codo', array['Bíceps braquial'], array['Braquial'], array['Core'], true, 'Abierta', 'Hipertrofia', 3, '10-12', 75, 2,
 'Curl con supinación alternado lado a lado.',
 'Subí una mancuerna rotando la palma hacia arriba, apretá arriba y bajá lento; alterná.',
 'Rotar el hombro en vez del antebrazo; balanceo; bajar rápido.',
 'Controlá la rotación de muñeca.', 'Subí 1-2 kg al completar 3x12 RIR 2.',
 'Curl con barra o martillo.', array['Curl con mancuernas supino', 'Curl martillo cruzado'], array['Curl con barra', 'Curl en máquina']),

('Curl inclinado con mancuernas', 'Incline dumbbell curl', 'curl en banco inclinado', 'Musculación', 'Bíceps', 'Bíceps braquial (cabeza larga)', 'Musculación', 'Intermedio', 2, 'Banco inclinado y mancuernas', 'Mancuernas', 'Aislado', 'Flexión de codo', array['Bíceps braquial'], array['Braquial'], array['Deltoides anterior'], true, 'Abierta', 'Hipertrofia', 3, '10-12', 75, 2,
 'Curl en banco inclinado que estira la cabeza larga del bíceps.',
 'Sentado en banco inclinado con brazos colgando; subí sin mover el hombro y bajá buscando estiramiento.',
 'Adelantar los codos; usar impulso; rango corto.',
 'No busques rango excesivo si sentís el hombro.', 'Progresá con reps y control.',
 'Curl sentado o en polea.', array['Curl Bayesian', 'Curl sentado con mancuernas'], array['Curl con mancuernas', 'Curl en polea']),

('Curl en polea baja', 'Cable curl', 'curl en polea', 'Musculación', 'Bíceps', 'Bíceps braquial', 'Musculación', 'Principiante', 1, 'Polea baja y barra recta', 'Polea', 'Aislado', 'Flexión de codo', array['Bíceps braquial'], array['Braquial', 'Braquiorradial'], array['Core'], false, 'Abierta', 'Hipertrofia', 3, '12-15', 60, 2,
 'Curl con tensión constante en polea.',
 'De pie frente a la polea baja, codos fijos; subí el maneral y bajá controlado sin perder tensión.',
 'Tirar con el torso; mover los codos; usar impulso.',
 'La espalda recta evita compensaciones.', 'Subí placa al completar 3x15 RIR 2.',
 'Curl con barra o mancuernas.', array['Curl Bayesian', 'Curl con cuerda'], array['Curl con mancuernas', 'Curl con barra']),

('Curl araña', 'Spider curl', 'curl araña en banco', 'Musculación', 'Bíceps', 'Bíceps braquial (pico)', 'Musculación', 'Intermedio', 2, 'Banco y mancuernas o barra Z', 'Mancuernas', 'Aislado', 'Flexión de codo', array['Bíceps braquial'], array['Braquial'], array['Deltoides anterior'], false, 'Abierta', 'Hipertrofia', 3, '10-12', 75, 2,
 'Curl con brazos colgando perpendicular al suelo; gran pico de contracción.',
 'Apoyá el pecho en el banco inclinado con los brazos colgando; subí sin mover los codos.',
 'Balanceo por el apoyo; rango corto; usar demasiado peso.',
 'Mantené el pecho apoyado durante todo el set.', 'Mejorá la contracción antes de subir peso.',
 'Curl predicador.', array['Curl predicador', 'Curl inclinado'], array['Curl predicador', 'Curl con mancuernas']),

('Curl Bayesian', 'Bayesian cable curl', 'curl bayesian, curl en polea detrás del cuerpo', 'Musculación', 'Bíceps', 'Bíceps braquial (cabeza larga)', 'Musculación', 'Intermedio', 2, 'Polea baja', 'Polea', 'Aislado', 'Flexión de codo', array['Bíceps braquial'], array['Braquial'], array['Core'], true, 'Abierta', 'Hipertrofia', 3, '10-12', 75, 2,
 'Curl en polea con el brazo detrás del cuerpo: máximo estiramiento de la cabeza larga.',
 'De espaldas a la polea, llevá el brazo atrás y subí el maneral manteniendo el codo fijo detrás del torso.',
 'Mover el codo al frente; rotar el torso; rango corto.',
 'Cuidá la posición del hombro.', 'Progresá con control y placa.',
 'Curl inclinado con mancuernas.', array['Curl inclinado con mancuernas', 'Curl en polea baja'], array['Curl con mancuernas', 'Curl predicador']),

('Curl 21s', '21s curl', 'curl veintiuno', 'Musculación', 'Bíceps', 'Bíceps braquial', 'Musculación', 'Intermedio', 2, 'Barra Z o mancuernas', 'Barra', 'Aislado', 'Flexión de codo', array['Bíceps braquial'], array['Braquial'], array['Core'], false, 'Abierta', 'Hipertrofia', 3, '21 (7+7+7)', 90, 1,
 'Método de 21 repeticiones (rango inferior, superior y completo) para alta fatiga metabólica.',
 '7 reps de la mitad inferior, 7 de la mitad superior y 7 completas, con codos fijos.',
 'Usar peso excesivo; perder el rango; balanceo.',
 'Termina el set cuando la técnica se rompe.', 'Subí peso solo si completás las 21 con control.',
 'Curl con barra.', array['Curl con barra', 'Curl en polea'], array['Curl con mancuernas', 'Curl con barra']),

('Curl con banda elástica', 'Band biceps curl', 'curl con banda', 'Musculación', 'Bíceps', 'Bíceps braquial', 'Musculación', 'Principiante', 1, 'Banda elástica', 'Banda', 'Aislado', 'Flexión de codo', array['Bíceps braquial'], array['Braquial'], array['Core'], false, 'Abierta', 'Hipertrofia', 3, '15-20', 45, 2,
 'Curl con banda, tensión creciente y bajo impacto articular.',
 'Pisá la banda y subí las manos con codos fijos, apretando arriba.',
 'Elegir una banda muy dura; rango corto; balanceo.',
 'Revisá el estado de la banda antes de usarla.', 'Pasá a una banda más dura o más reps.',
 'Curl con mancuernas muy livianas.', array['Curl en polea', 'Curl con mancuernas'], array['Curl con mancuernas', 'Curl en polea']),

('Curl martillo cruzado', 'Cross-body hammer curl', 'curl cruzado, hammer cruzado', 'Musculación', 'Bíceps', 'Braquial y braquiorradial', 'Musculación', 'Principiante', 1, 'Mancuernas', 'Mancuernas', 'Aislado', 'Flexión de codo', array['Braquial', 'Braquiorradial'], array['Bíceps braquial'], array['Core'], true, 'Abierta', 'Hipertrofia', 3, '10-12', 60, 2,
 'Curl neutro que cruza al hombro opuesto, enfatizando braquial.',
 'Con agarre neutro, subí la mancuerna en diagonal hacia el hombro contrario y bajá controlado.',
 'Rotar el torso; mover el codo; usar impulso.',
 'Mantené el codo pegado al cuerpo.', 'Subí 1 kg al completar 3x12 RIR 2.',
 'Curl martillo.', array['Curl martillo', 'Curl en polea neutro'], array['Curl martillo', 'Curl con mancuernas']),

('Curl en máquina', 'Machine biceps curl', 'curl en máquina', 'Musculación', 'Bíceps', 'Bíceps braquial', 'Musculación', 'Principiante', 1, 'Máquina de curl de bíceps', 'Máquina', 'Aislado', 'Flexión de codo', array['Bíceps braquial'], array['Braquial'], array['Core'], false, 'Abierta', 'Hipertrofia', 3, '12-15', 60, 2,
 'Curl guiado ideal para terminar o para principiantes.',
 'Ajustá el asiento para que el codo quede alineado con el eje; subí sin despegar los brazos del pad.',
 'Despegar los codos; usar impulso; rango corto.',
 'Ajustá bien el asiento para no forzar el codo.', 'Sumá placa al completar 3x15 RIR 2.',
 'Curl en polea o con barra.', array['Curl predicador en máquina', 'Curl en polea'], array['Curl en polea', 'Curl con mancuernas']),

-- ============================================================
-- E) TRÍCEPS
-- ============================================================
('Extensión de tríceps en polea con barra', 'Cable pushdown', 'pushdown, extensión de tríceps en polea', 'Musculación', 'Tríceps', 'Tríceps (cabeza lateral y medial)', 'Musculación', 'Principiante', 1, 'Polea alta y barra recta', 'Polea', 'Aislado', 'Extensión de codo', array['Tríceps braquial'], array['Ancóneo'], array['Core'], false, 'Abierta', 'Hipertrofia', 3, '12-15', 60, 2,
 'Extensión de tríceps en polea con barra, básico y seguro.',
 'Codos pegados al torso; extendé hasta bloquear suave y volvé controlando sin mover los codos.',
 'Mover los codos; inclinarse sobre la barra; rango corto.',
 'Mantené los hombros relajados.', 'Subí placa al completar 3x15 RIR 2.',
 'Extensión con cuerda o mancuerna.', array['Extensión con cuerda', 'Extensión unilateral en polea'], array['Extensión con cuerda', 'Extensión sobre cabeza en polea']),

('Extensión de tríceps con cuerda', 'Rope pushdown', 'pushdown con cuerda', 'Musculación', 'Tríceps', 'Tríceps (cabeza lateral)', 'Musculación', 'Principiante', 1, 'Polea alta y cuerda', 'Polea', 'Aislado', 'Extensión de codo', array['Tríceps braquial'], array['Ancóneo'], array['Core'], false, 'Abierta', 'Hipertrofia', 3, '12-15', 60, 2,
 'Extensión con cuerda que permite separar las manos al final.',
 'Extendé la cuerda separando las puntas y apretá el tríceps abajo; volvé controlado.',
 'Abrir los codos; inclinarse; usar impulso.',
 'No dejes que la cuerda tire de tus hombros.', 'Subí placa al completar 3x15 RIR 2.',
 'Extensión con barra.', array['Extensión con barra', 'Extensión sobre cabeza en polea'], array['Extensión con barra', 'Patada de tríceps en polea']),

('Extensión de tríceps sobre cabeza en polea', 'Overhead cable extension', 'extensión sobre cabeza, tríceps sobre cabeza en polea', 'Musculación', 'Tríceps', 'Tríceps (cabeza larga)', 'Musculación', 'Intermedio', 2, 'Polea y cuerda o barra', 'Polea', 'Aislado', 'Extensión de codo', array['Tríceps braquial (cabeza larga)'], array['Ancóneo'], array['Core'], false, 'Abierta', 'Hipertrofia', 3, '12-15', 60, 2,
 'Extensión sobre la cabeza que estira y enfatiza la cabeza larga.',
 'De espaldas a la polea, codos altos; extendé hacia adelante y arriba sin bajar los codos.',
 'Bajar los codos; arquear la lumbar; rango corto.',
 'Mantené el core firme para no arquear la espalda.', 'Subí placa al completar 3x15 RIR 2.',
 'Press francés o extensión con mancuerna.', array['Press francés', 'Extensión con mancuerna sobre cabeza'], array['Press francés', 'Extensión con cuerda']),

('Extensión de tríceps unilateral en polea', 'Single-arm cable pushdown', 'pushdown unilateral', 'Musculación', 'Tríceps', 'Tríceps (cabeza lateral/medial)', 'Musculación', 'Principiante', 1, 'Polea alta y maneral', 'Polea', 'Aislado', 'Extensión de codo', array['Tríceps braquial'], array['Ancóneo'], array['Core'], true, 'Abierta', 'Hipertrofia', 3, '12-15', 45, 2,
 'Pushdown a una mano para corregir asimetrías.',
 'Con el codo fijo, extendé el brazo y apretá abajo; controlá la vuelta.',
 'Rotar el torso; mover el codo; usar impulso.',
 'Trabajá ambos lados con la misma carga.', 'Mejorá el control antes de subir placa.',
 'Pushdown con barra.', array['Pushdown con barra', 'Extensión con cuerda'], array['Pushdown con barra', 'Extensión con cuerda']),

('Fondos en máquina asistida', 'Assisted dip machine', 'fondos asistidos', 'Musculación', 'Tríceps', 'Tríceps (cabeza medial) y pecho', 'Musculación', 'Principiante', 1, 'Máquina de fondos asistidos', 'Máquina', 'Compuesto', 'Extensión de codo', array['Tríceps braquial', 'Pectoral mayor'], array['Deltoides anterior'], array['Core'], false, 'Cerrada', 'Hipertrofia', 3, '10-15', 90, 2,
 'Fondos con asistencia para progresar hacia el fondo libre.',
 'Con los brazos en las barras y rodillas en la plataforma, bajá flexionando codos y empujá hasta extender.',
 'Bajar demasiado; abrir los codos; balanceo.',
 'Ajustá la asistencia para poder completar el rango.', 'Reducí la asistencia cuando completás 3x15.',
 'Fondos en paralelas.', array['Fondos en paralelas', 'Fondo de tríceps en banco'], array['Fondo de tríceps en banco', 'Extensión en polea']),

('Extensión de tríceps en máquina', 'Triceps extension machine', 'extensión de tríceps en máquina', 'Musculación', 'Tríceps', 'Tríceps (general)', 'Musculación', 'Principiante', 1, 'Máquina de extensión de tríceps', 'Máquina', 'Aislado', 'Extensión de codo', array['Tríceps braquial'], array['Ancóneo'], array['Core'], false, 'Abierta', 'Hipertrofia', 3, '12-15', 60, 2,
 'Extensión guiada cómoda para aislar tríceps.',
 'Ajustá el asiento y extendé los codos contra el pad hasta bloquear suave.',
 'Rango corto; usar el cuerpo; soltar de golpe.',
 'Ajustá la máquina para alinear el codo con el eje.', 'Sumá placa al completar 3x15 RIR 2.',
 'Extensión en polea.', array['Extensión en polea', 'Pushdown con cuerda'], array['Extensión en polea', 'Press francés']),

('Patada de tríceps en polea', 'Cable kickback', 'patada en polea', 'Musculación', 'Tríceps', 'Tríceps (cabeza lateral)', 'Musculación', 'Intermedio', 2, 'Polea baja y maneral', 'Polea', 'Aislado', 'Extensión de codo', array['Tríceps braquial'], array['Ancóneo'], array['Core'], true, 'Abierta', 'Hipertrofia', 3, '12-15', 45, 2,
 'Patada en polea con máxima contracción del tríceps.',
 'Inclinate al frente, codo alto y fijo; extendé el brazo atrás y apretá.',
 'Bajar el codo; usar impulso; rango corto.',
 'Mantené la espalda neutra.', 'Mejorá la contracción antes de subir carga.',
 'Patada con mancuerna.', array['Patada de tríceps con mancuerna', 'Extensión unilateral en polea'], array['Extensión en polea', 'Pushdown con cuerda']),

('Press cerrado con mancuernas', 'Dumbbell close-grip press', 'press neutro para tríceps', 'Musculación', 'Tríceps', 'Tríceps + pecho interno', 'Musculación', 'Intermedio', 2, 'Banco y mancuernas', 'Mancuernas', 'Compuesto', 'Empuje horizontal', array['Tríceps braquial', 'Pectoral mayor'], array['Deltoides anterior'], array['Core'], false, 'Abierta', 'Hipertrofia', 4, '8-12', 90, 2,
 'Press con mancuernas en agarre neutro que carga fuerte el tríceps.',
 'Con las mancuernas juntas y agarre neutro, bajá pegado al torso y empujá sin separarlas.',
 'Abrir los codos; bajar al pecho alto; perder la trayectoria.',
 'Cuidá los hombros con cargas altas.', 'Subí 1-2 kg por mancuerna al completar 4x10 RIR 2.',
 'Press de banca agarre cerrado.', array['Press de banca agarre cerrado', 'Extensión en polea'], array['Press de banca agarre cerrado', 'Fondos']),

('JM press', 'JM press', 'jm press tríceps', 'Musculación', 'Tríceps', 'Tríceps (cabeza larga y lateral)', 'Musculación', 'Avanzado', 3, 'Banco plano y barra', 'Barra', 'Compuesto', 'Extensión de codo', array['Tríceps braquial'], array['Pectoral mayor', 'Deltoides anterior'], array['Core'], false, 'Abierta', 'Fuerza', 4, '6-10', 120, 2,
 'Híbrido entre press cerrado y skull crusher, gran sobrecarga de tríceps.',
 'Bajá la barra hacia el mentón/pecho alto con codos apuntando al frente y extendé.',
 'Trayectoria errática; bajar al pecho; perder el control.',
 'Ejercicio exigente para codos: empezá liviano.', 'Subí carga gradualmente con técnica estricta.',
 'Press francés con barra.', array['Extensión de tríceps tumbado con barra', 'Press cerrado'], array['Press francés', 'Extensión en polea']),

('Tate press', 'Tate press', 'tate press tríceps', 'Musculación', 'Tríceps', 'Tríceps (cabeza lateral/medial)', 'Musculación', 'Intermedio', 2, 'Banco plano y mancuernas', 'Mancuernas', 'Aislado', 'Extensión de codo', array['Tríceps braquial'], array['Ancóneo'], array['Core'], false, 'Abierta', 'Hipertrofia', 3, '10-15', 60, 2,
 'Extensión con mancuernas sobre el pecho, con codos hacia afuera.',
 'Acostado con mancuernas sobre el pecho y codos abiertos, bajá las mancuernas al pecho flexionando codos y extendé.',
 'Mover los codos; rango corto; usar peso excesivo.',
 'Empieza con cargas livianas por el estrés en el codo.', 'Progresá con reps controladas.',
 'Press francés con mancuernas.', array['Press francés', 'Extensión sobre cabeza con mancuerna'], array['Press francés', 'Extensión en polea']),

-- ============================================================
-- F) ANTEBRAZOS Y AGARRE
-- ============================================================
('Curl de muñeca con mancuernas', 'Dumbbell wrist curl', 'flexión de muñeca con mancuernas', 'Musculación', 'Antebrazos', 'Flexores de muñeca', 'Musculación', 'Principiante', 1, 'Mancuernas y banco', 'Mancuernas', 'Aislado', 'Trabajo de agarre', array['Flexores de muñeca'], array['Flexor superficial de los dedos'], array['Core'], false, 'Abierta', 'Hipertrofia', 3, '15-20', 45, 2,
 'Flexión de muñeca para los flexores del antebrazo.',
 'Con los antebrazos apoyados y las palmas hacia arriba, flexioná la muñeca y bajá lento.',
 'Usar impulso; rango corto; cargas que fuercen la muñeca.',
 'Movimientos lentos y controlados; evita el rebote.', 'Más reps antes que carga.',
 'Curl de muñeca con barra.', array['Curl de muñeca con barra', 'Rodillo de muñeca'], array['Curl de muñeca con barra', 'Colgado de barra']),

('Extensión de muñeca con barra', 'Barbell wrist extension', 'extensión de muñeca', 'Musculación', 'Antebrazos', 'Extensores de muñeca', 'Musculación', 'Principiante', 1, 'Barra y banco', 'Barra', 'Aislado', 'Trabajo de agarre', array['Extensores de muñeca'], array['Braquiorradial'], array['Core'], false, 'Abierta', 'Hipertrofia', 3, '15-20', 45, 2,
 'Extensión de muñeca para los extensores del antebrazo.',
 'Con antebrazos apoyados y palmas hacia abajo, elevá la muñeca y bajá con control.',
 'Usar impulso; cargar demasiado; rango parcial.',
 'Empezá liviano para evitar tendinitis.', 'Más reps y control.',
 'Extensión de muñeca con mancuernas.', array['Extensión de muñeca con mancuernas', 'Curl inverso'], array['Curl inverso', 'Rodillo de muñeca']),

('Extensión de muñeca con mancuernas', 'Dumbbell wrist extension', 'extensión de muñeca unilateral', 'Musculación', 'Antebrazos', 'Extensores de muñeca', 'Musculación', 'Principiante', 1, 'Mancuernas y banco', 'Mancuernas', 'Aislado', 'Trabajo de agarre', array['Extensores de muñeca'], array['Braquiorradial'], array['Core'], true, 'Abierta', 'Hipertrofia', 3, '15-20', 45, 2,
 'Extensión de muñeca a una mano.',
 'Apoyá el antebrazo y extendé la muñeca contra la mancuerna, bajando controlado.',
 'Impulso; cargas excesivas; rango corto.',
 'Cuidá el codo y la muñeca; parar si hay dolor.', 'Más reps antes que carga.',
 'Extensión con barra.', array['Extensión de muñeca con barra', 'Curl inverso'], array['Extensión de muñeca con barra', 'Curl inverso']),

('Pronación y supinación con mancuerna', 'Dumbbell pronation/supination', 'pronosupinación', 'Musculación', 'Antebrazos', 'Pronadores y supinadores', 'Musculación', 'Principiante', 1, 'Mancuerna', 'Mancuernas', 'Aislado', 'Rotación', array['Pronador redondo', 'Supinador'], array['Bíceps braquial', 'Braquiorradial'], array['Core'], true, 'Abierta', 'Control corporal', 3, '15-20', 45, 2,
 'Trabajo de rotación del antebrazo (pronación/supinación).',
 'Con el codo a 90° y pegado al torso, rotá la muñeca de palma arriba a palma abajo y viceversa.',
 'Mover el codo; usar cargas altas; rango corto.',
 'Empezá con una mancuerna liviana en un extremo.', 'Más reps; luego un poco de carga.',
 'Pronación con banda.', array['Pronación con banda', 'Curl de muñeca con mancuernas'], array['Curl de muñeca con mancuernas', 'Curl inverso']),

('Rodillo de muñeca', 'Wrist roller', 'rodillo de antebrazo, wrist roller', 'Musculación', 'Antebrazos', 'Flexores y extensores (agarre)', 'Musculación', 'Intermedio', 2, 'Rodillo de muñeca', 'Mixto', 'Aislado', 'Trabajo de agarre', array['Flexores de muñeca', 'Extensores de muñeca'], array['Flexores de los dedos'], array['Core', 'Deltoides anterior'], false, 'Abierta', 'Resistencia', 3, '1 serie por dirección', 60, 2,
 'Enrollado de peso con rodillo: resistencia y agarre.',
 'Con los brazos extendidos al frente, enrollá el peso subiendo y bajando con las muñecas.',
 'Mover los hombros; usar el torso; rango corto.',
 'Cuidá la espalda manteniéndola recta.', 'Añadí peso al completar 3 series.',
 'Curl de muñeca con barra.', array['Curl de muñeca con barra', 'Colgado de barra'], array['Curl de muñeca con barra', 'Extensión de muñeca con barra']),

('Pinza de discos', 'Plate pinch', 'pinza con discos, pinch grip', 'Musculación', 'Antebrazos', 'Fuerza de agarre (pinza)', 'Musculación', 'Intermedio', 2, 'Discos', 'Mixto', 'Estabilidad', 'Trabajo de agarre', array['Flexores de los dedos', 'Flexor del pulgar'], array['Antebrazo'], array['Core'], true, 'Cerrada', 'Fuerza', 3, '20-30 s', 60, 2,
 'Sostén de discos con los dedos para fuerza de pinza.',
 'Pellizcá dos discos por el borde liso y sostenelos el tiempo objetivo.',
 'Usar las palmas; no mantener la postura; cargas excesivas.',
 'Soltá de forma segura para no golpear los pies.', 'Más tiempo o discos más pesados.',
 'Colgado de barra con toalla.', array['Colgado de barra', 'Colgado con toalla'], array['Colgado de barra', 'Caminata del granjero']),

('Curl de dedos con barra', 'Barbell finger curl', 'curl de dedos', 'Musculación', 'Antebrazos', 'Flexores de los dedos', 'Musculación', 'Intermedio', 2, 'Barra y banco', 'Barra', 'Aislado', 'Trabajo de agarre', array['Flexores de los dedos'], array['Flexores de muñeca'], array['Core'], false, 'Abierta', 'Fuerza', 3, '15-20', 45, 2,
 'Curl de dedos sobre la barra para fuerza de agarre específica.',
 'Con los antebrazos apoyados y la barra solo en la última falange, cerrá los dedos y bajá lento.',
 'Usar la muñeca en vez de los dedos; cargas altas.',
 'Empezá con peso moderado; el tendón se adapta lento.', 'Añadí peso gradualmente.',
 'Colgado de barra.', array['Colgado de barra', 'Rodillo de muñeca'], array['Colgado de barra', 'Pinza de discos'])

on conflict (nombre) do nothing;

-- ============================================================
-- Verificación
-- ============================================================
select 'FASE 18 lote 2 OK' as estado,
  (select count(*) from public.exercises where categoria = 'Hombros') as hombros,
  (select count(*) from public.exercises where categoria = 'Bíceps') as biceps,
  (select count(*) from public.exercises where categoria = 'Tríceps') as triceps,
  (select count(*) from public.exercises where categoria = 'Antebrazos') as antebrazos;
