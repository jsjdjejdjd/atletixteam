-- ============================================================
-- ATLETIX · FASE 13 · Seed de la biblioteca profesional
-- Enriquecer el catálogo existente con los campos nuevos de la
-- biblioteca (patrón, músculos, demandas, prescripción, evidencia,
-- criterio de progresión) + escaleras + fuentes verificadas.
-- Requiere ejecutar primero 0008_esquema_biblioteca.sql.
-- Se puede correr las veces que quieras (no duplica).
-- ============================================================

-- ============================================================
-- 1) DOMINADAS Y TIRONES
-- ============================================================
update public.exercises set
  aliases = 'pull-up|dominada clásica',
  patron = 'Tiro vertical', agarre = 'prono', agarre_ancho = 'hombros', empenaje_tipo = 'peso corporal',
  musculos_primarios = array['Dorsal ancho','Bíceps','Romboides'],
  musculos_secundarios = array['Redondo mayor','Deltoides posterior','Trapecio inferior','Pectoral menor'],
  demanda_fuerza = 7, demanda_estabilidad = 4, demanda_movilidad = 3,
  series_sugeridas = 3, reps_sugeridas = '5-8', descanso_seg = 120, tempo = '2-1-1',
  rir_sugerido = 2, rpe_sugerido = 8, costo_fatiga = 3,
  biomecanica = 'El agarre prono a ancho de hombros reduce la abducción escapular y las fuerzas anteriores del hombro (PMC4916995). El dorsal manda en el tiro vertical.',
  criterio_progresion = 'Barbilla sobre la barra sin rebote; 8+ reps estrictas, o lastre >7.5% del peso corporal.',
  detener_si = 'Dolor anterior de hombro; rebote de cadera; quiebre del codo.',
  precauciones = 'Empezar ancho de hombros; ampliar el agarre solo con técnica estable.',
  evidencia = 'LIMITADA',
  fuentes = 'Cinemática escapular en dominadas (PMC4916995); Proximidad al fallo-hipertrofia (meta Sports Med 2023)'
where nombre = 'Dominada prono';

update public.exercises set
  aliases = 'chin-up|dominada con agarre inverso',
  patron = 'Tiro vertical', agarre = 'supino', agarre_ancho = 'hombros', empenaje_tipo = 'peso corporal',
  musculos_primarios = array['Dorsal ancho','Bíceps','Braquial'],
  musculos_secundarios = array['Romboides','Redondo mayor','Deltoides posterior'],
  demanda_fuerza = 7, demanda_estabilidad = 4, demanda_movilidad = 3,
  series_sugeridas = 3, reps_sugeridas = '6-10', descanso_seg = 120, tempo = '2-1-1',
  rir_sugerido = 2, rpe_sugerido = 8, costo_fatiga = 3,
  biomecanica = 'El agarre supino rota el codo hacia fuera y aumenta la participación del bíceps; la cinemática escapular se modifica respecto al prono (PMC4916995).',
  criterio_progresion = 'Pecho a barra sin impulso; 8+ repeticiones estrictas.',
  detener_si = 'Dolor de codo (braquial/bíceps); molestar en la muñeca por supinación forzada.',
  precauciones = 'Agarre a ancho de hombros; no extender el codo del todo abajo si duele.',
  evidencia = 'LIMITADA',
  fuentes = 'Cinemática escapular en dominadas (PMC4916995)'
where nombre = 'Dominada supino';

update public.exercises set
  aliases = 'chin-up neutral|agarre martillo',
  patron = 'Tiro vertical', agarre = 'neutro', agarre_ancho = 'hombros', empenaje_tipo = 'peso corporal',
  musculos_primarios = array['Dorsal ancho','Bíceps','Braquial','Braquiorradial'],
  musculos_secundarios = array['Romboides','Redondo mayor','Deltoides posterior'],
  demanda_fuerza = 7, demanda_estabilidad = 4, demanda_movilidad = 3,
  series_sugeridas = 3, reps_sugeridas = '6-10', descanso_seg = 120, tempo = '2-1-1',
  rir_sugerido = 2, rpe_sugerido = 8, costo_fatiga = 3,
  biomecanica = 'Posición neutra intermedia entre prono y supino; amigable para codo y muñeca. Puente entre la dominada supino y la anillas.',
  criterio_progresion = '8+ repeticiones estrictas con agarre estable.',
  detener_si = 'Dolor de codo o muñeca.',
  precauciones = 'Evitar girar la palma durante el movimiento.',
  evidencia = 'PRACTICA',
  fuentes = 'Práctica estandarizada de calistenia'
where nombre = 'Dominada semi supino';

update public.exercises set
  aliases = 'dominada en aros',
  patron = 'Tiro vertical', agarre = 'neutro', agarre_ancho = 'hombros', empenaje_tipo = 'peso corporal',
  musculos_primarios = array['Dorsal ancho','Bíceps','Braquial'],
  musculos_secundarios = array['Romboides','Deltoides posterior','Core (estabilizadores)'],
  demanda_fuerza = 8, demanda_estabilidad = 7, demanda_movilidad = 4,
  series_sugeridas = 3, reps_sugeridas = '5-8', descanso_seg = 150, tempo = '2-1-2',
  rir_sugerido = 2, rpe_sugerido = 8, costo_fatiga = 4,
  biomecanica = 'Las anillas agregan un eje de rotación libre: exige control de la escápula y del core para no abrir el agarre (comparación con barra en PMC10824315).',
  criterio_progresion = 'Realizar la dominada en anillas sin rotación del agarre, 6+ reps.',
  detener_si = 'Rotación de anillas fuera de control; dolor de hombro; balanceo del cuerpo.',
  precauciones = 'Ajustar altura previamente; progresar desde agarre fijo antes de cargar.',
  evidencia = 'LIMITADA',
  fuentes = 'Muscle up barra vs anillas (PMC10824315)'
where nombre = 'Dominada anillas';

update public.exercises set
  aliases = 'weighted pull-up|pull lastrado',
  patron = 'Tiro vertical', agarre = 'prono', agarre_ancho = 'hombros', empenaje_tipo = 'cinturon',
  musculos_primarios = array['Dorsal ancho','Bíceps','Braquial'],
  musculos_secundarios = array['Romboides','Redondo mayor','Trapecio','Core'],
  demanda_fuerza = 10, demanda_estabilidad = 5, demanda_movilidad = 3,
  series_sugeridas = 4, reps_sugeridas = '1-5', descanso_seg = 180, tempo = '2-1-1',
  rir_sugerido = 1, rpe_sugerido = 9, costo_fatiga = 4,
  biomecanica = 'Ejercicio principal de fuerza del Street Lifting Classic. Reglamento: barbilla sobre la barra, cadera sin rebote, extensión completa abajo.',
  criterio_progresion = 'PR con incrementos de 1.25 kg manteniendo técnica estricta.',
  detener_si = 'Rebote de cadera; no completar el rango; dolor de hombro/codo.',
  precauciones = 'Progresar +1.25 kg (o +2.5% PC) por microciclo; no cargar si el hombro no tolera.',
  evidencia = 'PRACTICA',
  fuentes = 'Reglamento USA Streetlifting (Weighted Pull-Up); Proximidad al fallo (meta 36334240)'
where nombre = 'Dominada lastrada prono';

update public.exercises set
  aliases = 'weighted chin-up',
  patron = 'Tiro vertical', agarre = 'supino', agarre_ancho = 'hombros', empenaje_tipo = 'cinturon',
  musculos_primarios = array['Dorsal ancho','Bíceps'],
  musculos_secundarios = array['Romboides','Braquial','Redondo mayor'],
  demanda_fuerza = 10, demanda_estabilidad = 5, demanda_movilidad = 3,
  series_sugeridas = 4, reps_sugeridas = '1-5', descanso_seg = 180, tempo = '2-1-1',
  rir_sugerido = 1, rpe_sugerido = 9, costo_fatiga = 4,
  biomecanica = 'Mismo patrón que el prono lastrado pero con mayor componente de bíceps (alteración de cinemática escapular del supino, PMC4916995).',
  criterio_progresion = 'Técnica estricta con carga creciente en pasos de 1.25 kg.',
  detener_si = 'Dolor de codo; pérdida de rango.',
  precauciones = 'Igual que dominada lastrada prono; vigilar codo.',
  evidencia = 'PRACTICA',
  fuentes = 'Reglamento USA Streetlifting'
where nombre = 'Dominada lastrada supino';

update public.exercises set
  aliases = 'weighted ring pull-up',
  patron = 'Tiro vertical', agarre = 'neutro', agarre_ancho = 'hombros', empenaje_tipo = 'cinturon',
  musculos_primarios = array['Dorsal ancho','Bíceps','Braquial'],
  musculos_secundarios = array['Romboides','Core','Deltoides posteriores'],
  demanda_fuerza = 10, demanda_estabilidad = 8, demanda_movilidad = 4,
  series_sugeridas = 3, reps_sugeridas = '1-4', descanso_seg = 180, tempo = '3-0-1',
  rir_sugerido = 1, rpe_sugerido = 9, costo_fatiga = 5,
  biomecanica = 'La carga sobre anillas multiplica la exigencia de estabilidad: requiere control de rotación y core a máxima fuerza.',
  criterio_progresion = 'Realizar con carga y 60 s+ de descanso mínimo, sin que las anillas roten.',
  detener_si = 'Rotación de anillas; quiebre de línea de cuerpo; dolor de hombro.',
  precauciones = 'Requiere dominio previo de la dominada anillas sin carga.',
  evidencia = 'LIMITADA',
  fuentes = 'Muscle up barra vs anillas (PMC10824315)'
where nombre = 'Dominada lastrada anillas';

-- ---- REMOS (Tiro horizontal) ----
update public.exercises set
  aliases = 'inverted row|remo bajo la barra',
  patron = 'Tiro horizontal', agarre = 'prono', agarre_ancho = 'hombros', empenaje_tipo = 'peso corporal',
  musculos_primarios = array['Dorsal ancho','Romboides','Trapecio medio'],
  musculos_secundarios = array['Bíceps','Deltoides posterior','Braquial'],
  demanda_fuerza = 4, demanda_estabilidad = 3, demanda_movilidad = 3,
  series_sugeridas = 3, reps_sugeridas = '8-12', descanso_seg = 90, tempo = '2-1-1',
  rir_sugerido = 2, rpe_sugerido = 8, costo_fatiga = 2,
  biomecanica = 'Primer escalón del tiro: el cuerpo inclinado reduce la carga relativa del dorsal, ideal para aprender la retracción escapular.',
  criterio_progresion = '3x10 con el cuerpo rígido y el pecho a la barra (entrada a dominadas).',
  detener_si = 'Caderas caídas; lumbar en extensión; hombros subidos.',
  precauciones = 'Mantener el cuerpo en línea recta; la barra a la altura del pecho.',
  evidencia = 'PRACTICA',
  fuentes = 'Escalera de dominada (ver 02-progresiones.md)'
where nombre = 'Remo australiano';

update public.exercises set
  aliases = 'inverted chin-row',
  patron = 'Tiro horizontal', agarre = 'supino', agarre_ancho = 'hombros', empenaje_tipo = 'peso corporal',
  musculos_primarios = array['Dorsal ancho','Bíceps'],
  musculos_secundarios = array['Romboides','Braquial','Trapecio medio'],
  demanda_fuerza = 4, demanda_estabilidad = 3, demanda_movilidad = 3,
  series_sugeridas = 3, reps_sugeridas = '8-12', descanso_seg = 90, tempo = '2-1-1',
  rir_sugerido = 2, rpe_sugerido = 8, costo_fatiga = 2,
  biomecanica = 'Variante supino del remo: mantiene el eje de escápula estable mientras entrena el bíceps (PMC4916995 en supino).',
  criterio_progresion = '3x10 estrictas con el pecho a la barra.',
  detener_si = 'Caderas caídas; dolor de codo.',
  precauciones = 'Cuerpo rígido bajo la barra.',
  evidencia = 'PRACTICA',
  fuentes = 'Escalera de dominada (ver 02-progresiones.md)'
where nombre = 'Remo australiano supino';

update public.exercises set
  aliases = 'ring row',
  patron = 'Tiro horizontal', agarre = 'neutro', agarre_ancho = 'hombros', empenaje_tipo = 'peso corporal',
  musculos_primarios = array['Dorsal ancho','Romboides'],
  musculos_secundarios = array['Bíceps','Core','Deltoides posterior'],
  demanda_fuerza = 6, demanda_estabilidad = 6, demanda_movilidad = 4,
  series_sugeridas = 3, reps_sugeridas = '6-10', descanso_seg = 120, tempo = '2-1-1',
  rir_sugerido = 2, rpe_sugerido = 8, costo_fatiga = 3,
  biomecanica = 'Las anillas exigen estabilizar el tiro sin punto fijo: puente entre el remo de barra y las dominadas/isométricas en anillas.',
  criterio_progresion = '6+ reps con anillas firmes y el pecho entre los aros.',
  detener_si = 'Aros que se separan; torsión de tronco; soltar tensión abajo.',
  precauciones = 'No rotar el agarre al llegar arriba.',
  evidencia = 'PRACTICA',
  fuentes = 'Práctica estandarizada de calistenia'
where nombre = 'Remo anillas';

-- ============================================================
-- 2) FONDOS Y EMPUJES
-- ============================================================
update public.exercises set
  aliases = 'dips|paralelas',
  patron = 'Empuje vertical', agarre = 'neutro', agarre_ancho = 'hombros', empenaje_tipo = 'peso corporal',
  musculos_primarios = array['Tríceps','Pectoral mayor','Deltoides anterior'],
  musculos_secundarios = array['Serrato anterior','Core','Trapecio'],
  demanda_fuerza = 7, demanda_estabilidad = 5, demanda_movilidad = 4,
  series_sugeridas = 3, reps_sugeridas = '6-10', descanso_seg = 120, tempo = '2-1-1',
  rir_sugerido = 2, rpe_sugerido = 8, costo_fatiga = 3,
  biomecanica = 'El brazo de momento del pectoral es mayor en aducción horizontal: el dip con torso inclinado recluta más pecho; vertical aislado es más tríceps (PMC2644775).',
  criterio_progresion = 'Bajar hasta hombro=codo; 8+ reps, o lastre >7.5% peso corporal.',
  detener_si = 'Dolor anterior de hombro; profundidad excesiva con hombros adelantados; rebote.',
  precauciones = 'Ajustar el ancho de agarre; no bajar de más sin movilidad de hombro.',
  evidencia = 'LIMITADA',
  fuentes = 'Brazo de momento del pectoral (PMC2644775); Reglamento USA Streetlifting'
where nombre = 'Fondos paralelas';

update public.exercises set
  aliases = 'ring dip',
  patron = 'Empuje vertical', agarre = 'neutro', agarre_ancho = 'hombros', empenaje_tipo = 'peso corporal',
  musculos_primarios = array['Tríceps','Pectoral mayor','Deltoides anterior'],
  musculos_secundarios = array['Serrato anterior','Core'],
  demanda_fuerza = 8, demanda_estabilidad = 7, demanda_movilidad = 4,
  series_sugeridas = 3, reps_sugeridas = '5-8', descanso_seg = 150, tempo = '3-0-1',
  rir_sugerido = 2, rpe_sugerido = 8, costo_fatiga = 4,
  biomecanica = 'Las anillas suman el eje de rotación: exigen mantener el bloqueo y controlar la escápula durante el empuje (especificidad de estabilidad, PMC10824315).',
  criterio_progresion = '8+ reps sin rotar los aros y bloqueo completo arriba.',
  detener_si = 'Rotación de aros; hombros en protracción completa; dolor de muñeca.',
  precauciones = 'Progresar desde paralelas fijas; calentar muñecas.',
  evidencia = 'LIMITADA',
  fuentes = 'Muscle up barra vs anillas (PMC10824315)'
where nombre = 'Fondos anillas';

update public.exercises set
  aliases = 'weighted dip',
  patron = 'Empuje vertical', agarre = 'neutro', agarre_ancho = 'hombros', empenaje_tipo = 'cinturon',
  musculos_primarios = array['Tríceps','Pectoral mayor','Deltoides anterior'],
  musculos_secundarios = array['Serrato anterior','Core','Trapecio'],
  demanda_fuerza = 10, demanda_estabilidad = 5, demanda_movilidad = 4,
  series_sugeridas = 4, reps_sugeridas = '1-5', descanso_seg = 180, tempo = '2-1-1',
  rir_sugerido = 1, rpe_sugerido = 9, costo_fatiga = 4,
  biomecanica = 'Segundo ejercicio del Street Lifting Classic. Dip válido: hombro abajo hasta la altura del codo, sin apoyo, bloqueo arriba.',
  criterio_progresion = 'PR con incrementos de 1.25 kg manteniendo el rango completo.',
  detener_si = 'Dolor de hombro; bajar sin rango; rebote de excéntrica.',
  precauciones = 'Empezar easy con 5-6 reps estrictas antes de cargar.',
  evidencia = 'PRACTICA',
  fuentes = 'Reglamento USA Streetlifting (Weighted Dip); Proximidad al fallo (meta 36334240)'
where nombre = 'Fondos lastrados paralelas';

update public.exercises set
  aliases = 'ring weighted dip',
  patron = 'Empuje vertical', agarre = 'neutro', agarre_ancho = 'hombros', empenaje_tipo = 'cinturon',
  musculos_primarios = array['Tríceps','Pectoral mayor','Deltoides anterior'],
  musculos_secundarios = array['Core','Serrato anterior'],
  demanda_fuerza = 10, demanda_estabilidad = 8, demanda_movilidad = 4,
  series_sugeridas = 3, reps_sugeridas = '1-4', descanso_seg = 180, tempo = '3-0-1',
  rir_sugerido = 1, rpe_sugerido = 9, costo_fatiga = 5,
  biomecanica = 'Máxima exigencia de empuje + estabilidad del catálogo de fondos. No apto hasta dominar anillas sin carga.',
  criterio_progresion = 'Realizar con carga sin pérdida de control de los aros.',
  detener_si = 'Pérdida de control de aros; dolor de hombro/muñeca.',
  precauciones = 'Exigir bloqueo completo; progresar carga lento.',
  evidencia = 'LIMITADA',
  fuentes = 'Muscle up barra vs anillas (PMC10824315)'
where nombre = 'Fondos lastrados anillas';

-- ---- FLEXIONES (Empuje horizontal) ----
update public.exercises set
  aliases = 'push-up inclinado|flexión en banco',
  patron = 'Empuje horizontal', agarre = 'prono', agarre_ancho = 'hombros', empenaje_tipo = 'peso corporal',
  musculos_primarios = array['Pectoral mayor','Tríceps','Deltoides anterior'],
  musculos_secundarios = array['Serrato anterior','Core'],
  demanda_fuerza = 3, demanda_estabilidad = 2, demanda_movilidad = 2,
  series_sugeridas = 3, reps_sugeridas = '10-15', descanso_seg = 60, tempo = '2-0-1',
  rir_sugerido = 2, rpe_sugerido = 7, costo_fatiga = 1,
  biomecanica = 'La inclinación reduce la carga relativa: primer peldaño del empuje horizontal; a menor altura de apoyo, mayor carga de pecho.',
  criterio_progresion = '3x12 con el peso completo en las manos y cuerpo rígido.',
  detener_si = 'Cadera que cae; dolor de muñeca no calentada.',
  precauciones = 'Progresar bajando la altura de apoyo.',
  evidencia = 'PRACTICA',
  fuentes = 'Escalera de empuje (ver 02-progresiones.md)'
where nombre = 'Flexión inclinada';

update public.exercises set
  aliases = 'push-up|lagartija',
  patron = 'Empuje horizontal', agarre = 'prono', agarre_ancho = 'hombros', empenaje_tipo = 'peso corporal',
  musculos_primarios = array['Pectoral mayor','Tríceps','Deltoides anterior'],
  musculos_secundarios = array['Serrato anterior','Core','Trapecio'],
  demanda_fuerza = 5, demanda_estabilidad = 3, demanda_movilidad = 3,
  series_sugeridas = 3, reps_sugeridas = '10-15', descanso_seg = 90, tempo = '2-0-1',
  rir_sugerido = 2, rpe_sugerido = 8, costo_fatiga = 2,
  biomecanica = 'Base del empuje horizontal: carga parcial del peso corporal con línea de cuerpo; activa pecho y serrato al empujar hacia arriba.',
  criterio_progresion = '15+ reps estrictas y controladas (puente a fondos y planchas).',
  detener_si = 'Lumbar hundida; hombros que suben con la cabeza.',
  precauciones = 'Mantener escápula estable; no aventajar la cadera.',
  evidencia = 'PRACTICA',
  fuentes = 'Práctica estandarizada de calistenia'
where nombre = 'Flexión de pecho';

update public.exercises set
  aliases = 'diamond push-up|flexión rombo',
  patron = 'Empuje horizontal', agarre = 'otro', agarre_ancho = 'estrecho', empenaje_tipo = 'peso corporal',
  musculos_primarios = array['Tríceps','Pectoral mayor','Deltoides anterior'],
  musculos_secundarios = array['Serrato anterior','Core'],
  demanda_fuerza = 6, demanda_estabilidad = 5, demanda_movilidad = 5,
  series_sugeridas = 3, reps_sugeridas = '8-12', descanso_seg = 90, tempo = '2-1-1',
  rir_sugerido = 2, rpe_sugerido = 8, costo_fatiga = 2,
  biomecanica = 'El rombo limita el ancho del agarre y cambia el vector: mayor énfasis de tríceps y menor de pectoral, con mayor demanda de muñeca.',
  criterio_progresion = '12+ reps con control; puente al fondo/empuje estrecho.',
  detener_si = 'Dolor de muñeca o codo; hombro adelante en la bajada.',
  precauciones = 'Abrir bien los dedos para aliviar la muñeca.',
  evidencia = 'PRACTICA',
  fuentes = 'Práctica estandarizada de calistenia'
where nombre = 'Flexión diamante';

-- ============================================================
-- 3) CORE
-- ============================================================
update public.exercises set
  aliases = 'plank',
  patron = 'Isometria estatica', agarre = null, agarre_ancho = null, empenaje_tipo = 'peso corporal',
  musculos_primarios = array['Transverso del abdomen','Recto abdominal','Glúteos'],
  musculos_secundarios = array['Dorsal ancho','Trapecio','Cuádriceps'],
  demanda_fuerza = 3, demanda_estabilidad = 4, demanda_movilidad = 2,
  series_sugeridas = 3, reps_sugeridas = '30-60 s', descanso_seg = 60, tempo = 'isométrico',
  rir_sugerido = 1, rpe_sugerido = 8, costo_fatiga = 1,
  biomecanica = 'Isometría de extensión del tronco; base del hollow para habilidades estáticas. La isometría submáxima cercana al fallo también genera hipertrofia (Oranchuk 2019).',
  criterio_progresion = '3x60 s con línea neutra (lumbar sin hundir ni arquear).',
  detener_si = 'Lumbar que se despega; dolor lumbar; contener la respiración.',
  precauciones = 'Respirar de forma controlada; no arquear. Aplicar especificidad de ángulo (Oranchuk 2019).',
  evidencia = 'PRACTICA',
  fuentes = 'Revisión de isometría (Oranchuk et al. 2019, ALTA)'
where nombre = 'Plancha';

update public.exercises set
  aliases = 'L-sit en paralelas|flota en L',
  patron = 'Isometria estatica', agarre = 'neutro', agarre_ancho = 'hombros', empenaje_tipo = 'peso corporal',
  musculos_primarios = array['Recto abdominal','Pectoral mayor','Tríceps','Flexores de cadera'],
  musculos_secundarios = array['Serratos anteriores','Transverso'],
  demanda_fuerza = 6, demanda_estabilidad = 5, demanda_movilidad = 6,
  series_sugeridas = 3, reps_sugeridas = '15-30 s', descanso_seg = 90, tempo = 'isométrico',
  rir_sugerido = 1, rpe_sugerido = 8, costo_fatiga = 3,
  biomecanica = 'Fuerza de piernas/muñecas en suspensión: combina empuje (pecho/tríceps) y control de cadera; entrena el ángulo de planche (PMC10376746: L-sit como base de la línea de planche).',
  criterio_progresion = '2x30 s con piernas a 90° sin balanceo.',
  detener_si = 'Balanceo; caída de piernas; dolor de muñeca.',
  precauciones = 'Calentar muñecas; progresar desde tuck L-sit.',
  evidencia = 'LIMITADA',
  fuentes = 'Modelo biomecánico de planche (PMC10376746)'
where nombre = 'L-Sit';

update public.exercises set
  aliases = 'hollow body hold',
  patron = 'Isometria estatica', agarre = null, agarre_ancho = null, empenaje_tipo = 'peso corporal',
  musculos_primarios = array['Recto abdominal','Transverso','Glúteos'],
  musculos_secundarios = array['Flexores de cadera','Dorsal ancho (fijación)'],
  demanda_fuerza = 3, demanda_estabilidad = 5, demanda_movilidad = 3,
  series_sugeridas = 3, reps_sugeridas = '20-40 s', descanso_seg = 60, tempo = 'isométrico',
  rir_sugerido = 1, rpe_sugerido = 8, costo_fatiga = 1,
  biomecanica = 'La posición hueca (lumbar pegada al suelo) es el patrón de rigidez de cuerpo de planche y front lever (PMC10376746).',
  criterio_progresion = '3x40 s con lumbar pegada y piernas elevadas controladas.',
  detener_si = 'Lumbar que se despega; dolor cervical por tensión.',
  precauciones = 'Bajar las piernas solo hasta donde la lumbar quede pegada.',
  evidencia = 'LIMITADA',
  fuentes = 'Modelo biomecánico de planche (PMC10376746)'
where nombre = 'Hollow hold';

-- ============================================================
-- 4) HABILIDADES (planche, front lever, handstand, muscle up)
-- ============================================================
update public.exercises set
  aliases = 'planche agrupado|planche tuck',
  patron = 'Isometria estatica', agarre = 'otro', agarre_ancho = 'hombros', empenaje_tipo = 'peso corporal',
  musculos_primarios = array['Deltoides anterior','Tríceps','Serratos anteriores','Recto abdominal'],
  musculos_secundarios = array['Pectoral mayor','Flexores de cadera','Hombro completo'],
  demanda_fuerza = 8, demanda_estabilidad = 7, demanda_movilidad = 4,
  series_sugeridas = 3, reps_sugeridas = '10 s', descanso_seg = 120, tempo = 'isométrico',
  rir_sugerido = 1, rpe_sugerido = 8, costo_fatiga = 4,
  biomecanica = 'Elemento de fuerza estática según FIG. El tuck mantiene la línea de gravedad cerca de la base de apoyo; la escalera abre progresivamente la cadera (modelo de 9 segmentos, PMC10376746).',
  criterio_progresion = '3x10 s con línea neutra (pasar a Advanced Tuck).',
  detener_si = 'Lumbar en extensión; codo en candado frágil; dolor de hombro o muñeca.',
  precauciones = 'Sostener con tensión alta (>=70% MVIC) en el ángulo débil; 2-3 s/semana (Oranchuk 2019).',
  evidencia = 'LIMITADA',
  fuentes = 'Modelo biomecánico de planche (PMC10376746); FIG Code of Points; Isometría (Oranchuk 2019)'
where nombre = 'Tuck Planche';

update public.exercises set
  aliases = 'advanced tuck planche|planche rodilla abierta',
  patron = 'Isometria estatica', agarre = 'otro', agarre_ancho = 'hombros', empenaje_tipo = 'peso corporal',
  musculos_primarios = array['Deltoides anterior','Tríceps','Serratos anteriores','Recto abdominal'],
  musculos_secundarios = array['Pectoral mayor','Flexores de cadera'],
  demanda_fuerza = 9, demanda_estabilidad = 8, demanda_movilidad = 5,
  series_sugeridas = 3, reps_sugeridas = '10 s', descanso_seg = 120, tempo = 'isométrico',
  rir_sugerido = 1, rpe_sugerido = 8, costo_fatiga = 4,
  biomecanica = 'Abrir las rodillas aleja la línea de gravedad de la base: más carga en hombro y dorsal deltoide (escalera del modelo PMC10376746).',
  criterio_progresion = '3x10 s con la espalda a la altura de los hombros (pasar a One Leg).',
  detener_si = 'Cadera que cae; lumbar separada; dolor de muñeca.',
  precauciones = 'Abrir la rodilla solo con la espalda estable.',
  evidencia = 'LIMITADA',
  fuentes = 'Modelo biomecánico de planche (PMC10376746)'
where nombre = 'Advanced Tuck Planche';

update public.exercises set
  aliases = 'front lever agrupado',
  patron = 'Isometria estatica', agarre = 'prono', agarre_ancho = 'hombros', empenaje_tipo = 'peso corporal',
  musculos_primarios = array['Dorsal ancho','Recto abdominal','Transverso'],
  musculos_secundarios = array['Romboides','Deltoides posterior','Glúteos'],
  demanda_fuerza = 8, demanda_estabilidad = 7, demanda_movilidad = 4,
  series_sugeridas = 3, reps_sugeridas = '12 s', descanso_seg = 120, tempo = 'isométrico',
  rir_sugerido = 1, rpe_sugerido = 8, costo_fatiga = 4,
  biomecanica = 'Isometría de cadena posterior-horizontal: el tuck reduce el brazo de palanca; la escalera extiende las piernas alejando la masa del eje (especificidad de ángulo, Oranchuk 2019).',
  criterio_progresion = '3x12 s con lumbar neutra (pasar a Advanced Tuck).',
  detener_si = 'Lumbar hiperextendida; caída de cadera por debajo de hombros; dolor de hombro.',
  precauciones = 'Entrenar en el ángulo débil y sostener con tensión alta.',
  evidencia = 'LIMITADA',
  fuentes = 'Revisión de isometría (Oranchuk et al. 2019, ALTA); escalera de front lever (02-progresiones.md)'
where nombre = 'Front Lever Tuck';

update public.exercises set
  aliases = 'front lever a una pierna|one leg front lever',
  patron = 'Isometria estatica', agarre = 'prono', agarre_ancho = 'hombros', empenaje_tipo = 'peso corporal',
  musculos_primarios = array['Dorsal ancho','Recto abdominal','Transverso'],
  musculos_secundarios = array['Romboides','Deltoides posterior','Glúteos','Isquiosurales (pierna activa)'],
  demanda_fuerza = 9, demanda_estabilidad = 7, demanda_movilidad = 5,
  series_sugeridas = 3, reps_sugeridas = '8 s', descanso_seg = 150, tempo = 'isométrico',
  rir_sugerido = 1, rpe_sugerido = 9, costo_fatiga = 4,
  biomecanica = 'Una pierna extendida aleja la línea de gravedad: media altura entre tuck y full. Alternancia de pierna para balancear la carga.',
  criterio_progresion = '3x8 s sin rotar la cadera (pasar a Straddle/Full).',
  detener_si = 'Rotación de cadera; quiebre lumbar; dolor de hombro.',
  precauciones = 'No compensar la pierna caída.',
  evidencia = 'LIMITADA',
  fuentes = 'Escalera de front lever (02-progresiones.md)'
where nombre = 'Front Lever One Leg';

update public.exercises set
  aliases = 'pino|handstand contra pared',
  patron = 'Isometria estatica', agarre = 'otro', agarre_ancho = 'hombros', empenaje_tipo = 'peso corporal',
  musculos_primarios = array['Deltoides anterior','Serrato anterior','Trapecio','Core'],
  musculos_secundarios = array['Tríceps','Rotadores del hombro','Flexores de muñeca'],
  demanda_fuerza = 5, demanda_estabilidad = 9, demanda_movilidad = 6,
  series_sugeridas = 4, reps_sugeridas = '30 s', descanso_seg = 90, tempo = 'isométrico',
  rir_sugerido = 1, rpe_sugerido = 8, costo_fatiga = 3,
  biomecanica = 'El pino exige flexión completa del hombro (open shoulders) y extensión de muñeca bajo carga; la progre CON pared (chest-to-wall) primero (gymnasticsdirect.com.au).',
  criterio_progresion = '3x30 s estables contra pared con hombros abiertos.',
  detener_si = 'Dolor de muñeca persistente; pánico a la altura (usar pared); lumbar que hunde.',
  precauciones = 'Calentar y condicionar muñecas antes de sostener.',
  evidencia = 'PRACTICA',
  fuentes = 'Preparación física de handstand (gymnasticsdirect.com.au)'
where nombre = 'Handstand Hold';

update public.exercises set
  aliases = 'press to handstand|press de pino',
  patron = 'Isometria estatica', agarre = 'otro', agarre_ancho = 'hombros', empenaje_tipo = 'peso corporal',
  musculos_primarios = array['Deltoides anterior','Hombro completo','Serrato anterior','Core'],
  musculos_secundarios = array['Tríceps','Flexores de cadera','Trapecio'],
  demanda_fuerza = 9, demanda_estabilidad = 9, demanda_movilidad = 7,
  series_sugeridas = 3, reps_sugeridas = '1-3 reps stradle', descanso_seg = 150, tempo = 'lento',
  rir_sugerido = 1, rpe_sugerido = 9, costo_fatiga = 4,
  biomecanica = 'Combinación de fuerza isométrica/prensa de hombro: sube desde el suelo pivotando piernas; el presswork es progresión natural del pino (gymnasticsdirect.com.au).',
  criterio_progresion = 'Pressestricto desde el suelo con piernas juntas.',
  detener_si = 'Dolor de muñeca u hombro; pérdida de línea.',
  precauciones = 'Solo tras dominar pino estable; usar straddle al inicio.',
  evidencia = 'PRACTICA',
  fuentes = 'Preparación física de handstand (gymnasticsdirect.com.au)'
where nombre = 'Press to Handstand';

update public.exercises set
  aliases = 'muscle up barra|kip',
  patron = 'Muscle Up', agarre = 'prono', agarre_ancho = 'hombros', empenaje_tipo = 'peso corporal',
  musculos_primarios = array['Dorsal ancho','Bíceps','Pectoral mayor','Tríceps'],
  musculos_secundarios = array['Core','Deltoides','Serratos anteriores'],
  demanda_fuerza = 9, demanda_estabilidad = 6, demanda_movilidad = 4,
  series_sugeridas = 3, reps_sugeridas = '1-3', descanso_seg = 180, tempo = 'explosivo',
  rir_sugerido = 2, rpe_sugerido = 8, costo_fatiga = 4,
  biomecanica = 'El MU de barra usa la técnica del glide kip: es un movimiento distinto del MU de anillas (variación del Front Up-Rise). Entrenar por separado (PMC10824315).',
  criterio_progresion = '3x2 estrictas con rango completo (transición limpia).',
  detener_si = 'Golpes de muñequera/antebrazo en la transición; dolor de codo.',
  precauciones = 'Dominar glide kip y dominada explosiva antes; calentar muñecas para el apoyo.',
  evidencia = 'LIMITADA',
  fuentes = 'Muscle up barra vs anillas (PMC10824315)'
where nombre = 'Muscle Up';

update public.exercises set
  aliases = 'pull-up explosiva|high pull',
  patron = 'Tiro vertical', agarre = 'prono', agarre_ancho = 'hombros', empenaje_tipo = 'peso corporal',
  musculos_primarios = array['Dorsal ancho','Bíceps','Trapecio'],
  musculos_secundarios = array['Core','Deltoides posterior'],
  demanda_fuerza = 8, demanda_estabilidad = 5, demanda_movilidad = 3,
  series_sugeridas = 4, reps_sugeridas = '3-5 explosivas', descanso_seg = 150, tempo = 'X-0-1',
  rir_sugerido = 2, rpe_sugerido = 8, costo_fatiga = 3,
  biomecanica = 'Desarrolla velocidad de aceleración del tiro: prerrequisito del muscle up de barra (glide kip, PMC10824315).',
  criterio_progresion = '5 reps arriba del pecho con aceleración.',
  detener_si = 'Frenar el movimiento; balanceo no controlado.',
  precauciones = 'No sacrificar técnica por velocidad.',
  evidencia = 'LIMITADA',
  fuentes = 'Muscle up barra vs anillas (PMC10824315)'
where nombre = 'Pull Up explosiva';

-- ============================================================
-- 5) ESCALERAS DE PROGRESIÓN (exercise_progression)
-- ============================================================
-- Dominada (ancla: Dominada prono)
insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 1, 'regresion', 'Remo australiano',
  'Apoyo bajo en barra baja, tiro horizontal.',
  '3x10 con el pecho a la barra y cuerpo rígido'
from public.exercises e where e.nombre = 'Dominada prono'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 2, 'regresion', 'Remo australiano supino',
  'Misma base con agarre supino (bíceps).',
  '3x10 estrictas'
from public.exercises e where e.nombre = 'Dominada prono'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 3, 'regresion', 'Dominadas negativas',
  'Solo la bajada controlada de 3-4 s.',
  '3x5 controladas hasta el colgado sin caída'
from public.exercises e where e.nombre = 'Dominada prono'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 4, 'regresion', 'Dominada con banda',
  'Asistencia mínima de banda.',
  '3x8 con banda mínima'
from public.exercises e where e.nombre = 'Dominada prono'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 5, 'progresion', 'Dominada lastrada',
  'Añadir carga en cinturón, +1.25 kg por microciclo.',
  'PR con técnica estricta (Reglamento Streetlifting)'
from public.exercises e where e.nombre = 'Dominada prono'
on conflict (exercise_id, orden) do nothing;

-- Fondos (ancla: Fondos paralelas)
insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 1, 'regresion', 'Flexión en paralelas bajas (pies en suelo)',
  'Soportar parte del peso con los pies.',
  '3x10'
from public.exercises e where e.nombre = 'Fondos paralelas'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 2, 'regresion', 'Fondo excéntrico lento',
  'Bajada de 3 s hasta hombro=codo.',
  '3x5 con descenso controlado'
from public.exercises e where e.nombre = 'Fondos paralelas'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 3, 'progresion', 'Fondo lastrado',
  'Dips con carga estricta, +1.25 kg por microciclo.',
  'PR en rango completo (Reglamento Streetlifting)'
from public.exercises e where e.nombre = 'Fondos paralelas'
on conflict (exercise_id, orden) do nothing;

-- Planche (ancla: Tuck Planche)
insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 1, 'progresion', 'Advanced Tuck Planche',
  'Abrir las rodillas, espalda a la altura de los hombros.',
  '3x10 s con la espalda a la altura de los hombros'
from public.exercises e where e.nombre = 'Tuck Planche'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 2, 'progresion', 'One Leg Planche',
  'Tuck con una pierna extendida.',
  '3x8 s balanceado'
from public.exercises e where e.nombre = 'Tuck Planche'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 3, 'progresion', 'Full Planche',
  'Cuerpo horizontal completo, piernas juntas.',
  '3x5 s con la línea de gravedad sobre las manos'
from public.exercises e where e.nombre = 'Tuck Planche'
on conflict (exercise_id, orden) do nothing;

-- Front Lever (ancla: Front Lever Tuck)
insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 1, 'progresion', 'Advanced Tuck Front Lever',
  'Piernas hacia atrás, lumbar neutra.',
  '3x10 s'
from public.exercises e where e.nombre = 'Front Lever Tuck'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 2, 'progresion', 'One Leg Front Lever',
  'Una pierna extendida.',
  '3x8 s sin rotación'
from public.exercises e where e.nombre = 'Front Lever Tuck'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 3, 'progresion', 'Full Front Lever',
  'Cuerpo horizontal sin quiebre lumbar.',
  '3x5 s a la altura de los hombros'
from public.exercises e where e.nombre = 'Front Lever Tuck'
on conflict (exercise_id, orden) do nothing;

-- Handstand (ancla: Handstand Hold)
insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 1, 'regresion', 'Hollow + press contra pared',
  'Fuerza de hombro y rigidez de cuerpo previa.',
  '3x30 s estables'
from public.exercises e where e.nombre = 'Handstand Hold'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 2, 'regresion', 'Pino contra pared (pecho a pared)',
  'Hombros abiertos contra la pared.',
  '3x30 s con hombros abiertos'
from public.exercises e where e.nombre = 'Handstand Hold'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 3, 'progresion', 'Pino libre',
  'Sin apoyo, con control.',
  '10 s x 3 libres'
from public.exercises e where e.nombre = 'Handstand Hold'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 4, 'progresion', 'Press to Handstand',
  'Subir desde el suelo con press.',
  'Press estricto desde el suelo'
from public.exercises e where e.nombre = 'Handstand Hold'
on conflict (exercise_id, orden) do nothing;

-- Muscle Up barra (ancla: Muscle Up)
insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 1, 'regresion', 'Glide kip a apoyo',
  'Técnica de kip de la gimnasia para entrar al apoyo.',
  '5 ejecuciones limpias'
from public.exercises e where e.nombre = 'Muscle Up'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 2, 'regresion', 'Dominada explosiva a un brazo',
  'Aceleración del tiro.',
  '5 reps con la barra al pecho'
from public.exercises e where e.nombre = 'Muscle Up'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 3, 'regresion', 'Muscle up asistido (banda o anillas)',
  'Reducir la carga de la transición.',
  '3x3 asistidos'
from public.exercises e where e.nombre = 'Muscle Up'
on conflict (exercise_id, orden) do nothing;

-- Complementarias de competencia (Street Lifting)
insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 1, 'complementaria', 'Weighted Pull-Up (Street Lifting Classic)',
  'Dominada lastrada estricta según reglamento.',
  'PR con incrementos de 1.25 kg'
from public.exercises e where e.nombre = 'Dominada lastrada prono'
on conflict (exercise_id, orden) do nothing;

insert into public.exercise_progression (exercise_id, orden, tipo, paso_nombre, paso_descripcion, criterio)
select e.id, 1, 'complementaria', 'Weighted Dip (Street Lifting Classic)',
  'Fondo lastrado estricto según reglamento.',
  'PR con incrementos de 1.25 kg'
from public.exercises e where e.nombre = 'Fondos lastrados paralelas'
on conflict (exercise_id, orden) do nothing;

-- ============================================================
-- 6) FUENTES ESTRUCTURADAS (exercise_sources)
-- ============================================================
insert into public.exercise_sources (exercise_id, autor, titulo, tipo, url, anio, evidencia)
select e.id, null,
  'Cinemática escapular en dominadas y riesgo de pinzamiento según agarre (PMC4916995)',
  'estudio', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4916995/', null, 'LIMITADA'
from public.exercises e where e.nombre = 'Dominada prono'
on conflict (exercise_id, titulo) do nothing;

insert into public.exercise_sources (exercise_id, autor, titulo, tipo, url, anio, evidencia)
select e.id, null,
  'Proximidad al fallo e hipertrofia — meta-análisis, Sports Medicine 2023',
  'metaanalisis', 'https://pubmed.ncbi.nlm.nih.gov/36334240/', 2023, 'ALTA'
from public.exercises e where e.nombre = 'Dominada prono'
on conflict (exercise_id, titulo) do nothing;

insert into public.exercise_sources (exercise_id, autor, titulo, tipo, url, anio, evidencia)
select e.id, 'USA Streetlifting',
  'Reglamento oficial (Weighted Pull-Up y Weighted Dip)',
  'reglamento', null, null, 'PRACTICA'
from public.exercises e where e.nombre = 'Dominada lastrada prono'
on conflict (exercise_id, titulo) do nothing;

insert into public.exercise_sources (exercise_id, autor, titulo, tipo, url, anio, evidencia)
select e.id, 'USA Streetlifting',
  'Reglamento oficial (Weighted Dip)',
  'reglamento', null, null, 'PRACTICA'
from public.exercises e where e.nombre = 'Fondos lastrados paralelas'
on conflict (exercise_id, titulo) do nothing;

insert into public.exercise_sources (exercise_id, autor, titulo, tipo, url, anio, evidencia)
select e.id, null,
  'Brazos de momento del pectoral mayor (PMC2644775)',
  'estudio', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2644775/', null, 'LIMITADA'
from public.exercises e where e.nombre = 'Fondos paralelas'
on conflict (exercise_id, titulo) do nothing;

insert into public.exercise_sources (exercise_id, autor, titulo, tipo, url, anio, evidencia)
select e.id, null,
  'Modelo biomecánico de planche y planche→handstand, 9 segmentos (PMC10376746)',
  'estudio', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10376746/', null, 'LIMITADA'
from public.exercises e where e.nombre = 'Tuck Planche'
on conflict (exercise_id, titulo) do nothing;

insert into public.exercise_sources (exercise_id, autor, titulo, tipo, url, anio, evidencia)
select e.id, 'FIG',
  'Código de Puntos de Gimnasia Artística — Static Strength Elements',
  'reglamento', null, null, 'PRACTICA'
from public.exercises e where e.nombre = 'Tuck Planche'
on conflict (exercise_id, titulo) do nothing;

insert into public.exercise_sources (exercise_id, autor, titulo, tipo, url, anio, evidencia)
select e.id, 'Oranchuk DJ et al.',
  'Isometric exercise and implications for muscle and tendon adaptation (2019)',
  'estudio', 'https://onlinelibrary.wiley.com/', 2019, 'ALTA'
from public.exercises e where e.nombre = 'Front Lever Tuck'
on conflict (exercise_id, titulo) do nothing;

insert into public.exercise_sources (exercise_id, autor, titulo, tipo, url, anio, evidencia)
select e.id, null,
  'Preparación física y progresión del handstand (gymnasticsdirect.com.au)',
  'guia', 'https://www.gymnasticsdirect.com.au/', null, 'PRACTICA'
from public.exercises e where e.nombre = 'Handstand Hold'
on conflict (exercise_id, titulo) do nothing;

insert into public.exercise_sources (exercise_id, autor, titulo, tipo, url, anio, evidencia)
select e.id, null,
  'Muscle up en barra vs anillas: análisis técnico (PMC10824315)',
  'estudio', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10824315/', null, 'LIMITADA'
from public.exercises e where e.nombre = 'Muscle Up'
on conflict (exercise_id, titulo) do nothing;

-- ============================================================
-- Verificación
-- ============================================================
select 'FASE 13 OK' as estado,
  (select count(*) from public.exercises) as ejercicios,
  (select count(*) from public.exercises where patron is not null) as con_patron,
  (select count(*) from public.exercise_progression) as pasos,
  (select count(*) from public.exercise_sources) as fuentes;