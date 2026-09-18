-- ============================================================
-- ATLETIX · FASE 18 · Biblioteca de MUSCULACIÓN · Lote 3
-- Tren inferior · G) CUÁDRICEPS  H) ISQUIOTIBIALES  I) GLÚTEOS
-- J) ADUCTORES / ABDUCTORES  K) PANTORRILLAS  L) TIBIAL ANTERIOR
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
-- G) CUÁDRICEPS
-- ============================================================
('Sentadilla trasera con barra', 'Barbell back squat', 'sentadilla profunda, squat', 'Musculación', 'Cuádriceps', 'Cuádriceps (general) y glúteo', 'Musculación', 'Intermedio', 2, 'Rack, barra y discos', 'Barra', 'Compuesto', 'Dominante de rodilla', array['Cuádriceps', 'Glúteo mayor'], array['Aductores', 'Isquiotibiales', 'Erectores espinales'], array['Core', 'Pantorrillas'], false, 'Cerrada', 'Fuerza', 5, '5-8', 180, 2,
 'El gran ejercicio de piernas: fuerza y masa global.',
 'Barra sobre la espalda alta, pies al ancho de hombros; bajá flexionando rodillas y cadera con torso firme hasta romper el paralelo si la movilidad lo permite y subí empujando el suelo.',
 'Rodillas colapsando hacia adentro; talones que se levantan; lumbar que se redondea; subir la cadera primero.',
 'Usá rack con seguros a la altura correcta; aprendé la técnica sin carga.', 'Subí 2,5-5 kg al completar 5x6 RIR 2 con técnica estable.',
 'Sentadilla frontal, goblet o en Smith.', array['Sentadilla frontal con barra', 'Sentadilla goblet', 'Zancadas'], array['Prensa de piernas', 'Hack squat', 'Sentadilla goblet']),

('Prensa de piernas', 'Leg press', 'prensa 45, leg press', 'Musculación', 'Cuádriceps', 'Cuádriceps (general)', 'Musculación', 'Principiante', 1, 'Prensa de piernas', 'Máquina', 'Compuesto', 'Dominante de rodilla', array['Cuádriceps', 'Glúteo mayor'], array['Isquiotibiales', 'Aductores'], array['Core'], false, 'Cerrada', 'Hipertrofia', 4, '10-15', 120, 2,
 'Empuje guiado que permite cargar piernas con baja exigencia técnica.',
 'Espalda y cadera apoyadas; bajá la plataforma hasta donde la cadera no se despegue y empujá sin bloquear con fuerza.',
 'Bajar demasiado y despegar la cadera; bloquear las rodillas de golpe; pies mal ubicados.',
 'Nunca bloquees los seguros durante el set; bajá la plataforma con control.', 'Sumá placas al completar 4x15 RIR 2.',
 'Hack squat o sentadilla goblet.', array['Prensa a una pierna', 'Prensa con pies altos'], array['Hack squat', 'Sentadilla goblet']),

('Hack squat', 'Hack squat', 'hack squat en máquina', 'Musculación', 'Cuádriceps', 'Cuádriceps (vasto lateral)', 'Musculación', 'Intermedio', 2, 'Máquina hack squat', 'Máquina', 'Compuesto', 'Dominante de rodilla', array['Cuádriceps'], array['Glúteo mayor'], array['Core'], false, 'Cerrada', 'Hipertrofia', 4, '8-12', 150, 2,
 'Sentadilla guiada que enfatiza el cuádriceps con mucha estabilidad.',
 'Espalda apoyada en el respaldo; bajá controlado y empujá sin bloquear bruscamente.',
 'Rango excesivo que despega la cadera; rodillas que colapsan; usar rebote.',
 'Ajustá el respaldo y la profundidad a tu movilidad.', 'Sumá discos al completar 4x10 RIR 2.',
 'Prensa o sentadilla goblet.', array['Sentadilla en Smith', 'Prensa de piernas'], array['Prensa de piernas', 'Sentadilla goblet']),

('Sentadilla en máquina Smith', 'Smith machine squat', 'sentadilla en smith', 'Musculación', 'Cuádriceps', 'Cuádriceps (general)', 'Musculación', 'Principiante', 1, 'Máquina Smith', 'Máquina', 'Compuesto', 'Dominante de rodilla', array['Cuádriceps', 'Glúteo mayor'], array['Aductores', 'Isquiotibiales'], array['Core'], false, 'Cerrada', 'Hipertrofia', 4, '8-12', 120, 2,
 'Sentadilla guiada ideal para aprender el patrón con carga.',
 'Barra en la espalda alta, pies ligeramente adelante; bajá recto y subí empujando con toda la planta.',
 'Pies demasiado atrás; rango parcial; perder el control del torso.',
 'Fijate los topes de seguridad.', 'Sumá discos al completar 4x10 RIR 2.',
 'Sentadilla goblet o prensa.', array['Sentadilla con barra', 'Sentadilla goblet'], array['Prensa de piernas', 'Sentadilla con barra']),

('Zancadas caminando', 'Walking lunge', 'lunges, zancadas', 'Musculación', 'Cuádriceps', 'Cuádriceps y glúteo (unilateral)', 'Musculación', 'Principiante', 1, 'Mancuernas o barra', 'Mancuernas', 'Compuesto', 'Dominante de rodilla', array['Cuádriceps', 'Glúteo mayor'], array['Isquiotibiales', 'Aductores'], array['Core', 'Glúteo medio'], true, 'Cerrada', 'Hipertrofia', 3, '10-12 por pierna', 90, 2,
 'Zancada dinámica que trabaja piernas y equilibrio.',
 'Con paso largo, bajá la rodilla de atrás casi al suelo y empujá para dar el paso siguiente.',
 'Paso corto; rodilla que pasa muy adelante del pie; torso que se desploma.',
 'Espacio libre para avanzar; controlá el equilibrio.', 'Añadí carga o pasos al completar 3x12 por pierna.',
 'Zancada inversa o en el lugar.', array['Zancada inversa', 'Zancada en el lugar'], array['Sentadilla búlgara', 'Step up']),

('Zancada inversa', 'Reverse lunge', 'zancada hacia atrás', 'Musculación', 'Cuádriceps', 'Cuádriceps y glúteo (unilateral)', 'Musculación', 'Principiante', 1, 'Mancuernas', 'Mancuernas', 'Compuesto', 'Dominante de rodilla', array['Cuádriceps', 'Glúteo mayor'], array['Isquiotibiales'], array['Core', 'Glúteo medio'], true, 'Cerrada', 'Hipertrofia', 3, '10-12 por pierna', 90, 2,
 'Zancada hacia atrás, más amigable para la rodilla.',
 'Dá un paso atrás, bajá la rodilla y volvé empujando con el pie de adelante.',
 'Paso corto; perder el equilibrio; redondear la espalda.',
 'Buena opción si la rodilla molesta en la zancada al frente.', 'Añadí carga al completar 3x12 por pierna.',
 'Zancada caminando o búlgara.', array['Zancada caminando', 'Sentadilla búlgara'], array['Sentadilla búlgara', 'Step up']),

('Step up con mancuernas', 'Dumbbell step-up', 'subida al cajón', 'Musculación', 'Cuádriceps', 'Cuádriceps y glúteo (unilateral)', 'Musculación', 'Principiante', 1, 'Cajón y mancuernas', 'Mancuernas', 'Compuesto', 'Dominante de rodilla', array['Cuádriceps', 'Glúteo mayor'], array['Isquiotibiales'], array['Core', 'Glúteo medio'], true, 'Cerrada', 'Hipertrofia', 3, '8-12 por pierna', 90, 2,
 'Subida a un cajón, gran transferencia funcional y unilateral.',
 'Pisá el cajón con todo el pie, subí sin impulsarte con la pierna de abajo y bajá controlado.',
 'Impulsarse con la pierna de abajo; altura excesiva; caer en la bajada.',
 'Elegí una altura que te permita controlar el descenso.', 'Añadí carga o altura al completar 3x12 por pierna.',
 'Zancada inversa o sentadilla búlgara.', array['Step up alto', 'Step up lateral'], array['Zancada inversa', 'Sentadilla búlgara']),

('Extensión de cuádriceps en máquina', 'Leg extension', 'extensión de piernas, leg extension', 'Musculación', 'Cuádriceps', 'Cuádriceps (vasto medial/lateral)', 'Musculación', 'Principiante', 1, 'Máquina de extensión', 'Máquina', 'Aislado', 'Dominante de rodilla', array['Cuádriceps'], array['Ancóneo'], array['Core'], false, 'Abierta', 'Hipertrofia', 3, '12-15', 60, 2,
 'Aislamiento puro de cuádriceps.',
 'Ajustá el rodillo sobre el empeine; extendé hasta casi bloquear y bajá con control.',
 'Rango excesivo con rebote; despegar la cadera; usar impulso.',
 'Cuidá la rodilla si hay molestia: rango parcial y carga liviana.', 'Sumá placa al completar 3x15 RIR 2.',
 'Extensión en máquina con menos carga y rango corto, o sentadilla goblet.',
 array['Extensión a una pierna', 'Extensión en máquina piramidal'], array['Prensa de piernas', 'Hack squat']),

('Sentadilla sissy', 'Sissy squat', 'sissy squat', 'Musculación', 'Cuádriceps', 'Cuádriceps (recto femoral y vasto)', 'Musculación', 'Avanzado', 3, 'Peso corporal o máquina', 'Peso corporal', 'Aislado', 'Dominante de rodilla', array['Cuádriceps'], array['Flexores de cadera'], array['Core'], false, 'Abierta', 'Hipertrofia', 3, '8-12', 90, 2,
 'Sentadilla que lleva la rodilla al frente, gran estiramiento del cuádriceps.',
 'Sujetate a un apoyo, elevá los talones y llevá las rodillas al frente inclinando el torso atrás.',
 'Forzar la rodilla con dolor; perder el equilibrio; rango excesivo.',
 'No apto si hay dolor de rodilla; progresá muy gradual.', 'Más rango y reps antes de lastre.',
 'Extensión de cuádriceps.', array['Sentadilla sissy asistida', 'Sentadilla sissy con lastre'], array['Extensión de cuádriceps', 'Sentadilla goblet']),

('Peso muerto rumano con mancuernas', 'Dumbbell Romanian deadlift', 'RDL con mancuernas', 'Musculación', 'Isquiotibiales', 'Isquiotibiales (bíceps femoral)', 'Musculación', 'Intermedio', 2, 'Mancuernas', 'Mancuernas', 'Compuesto', 'Bisagra de cadera', array['Isquiotibiales', 'Glúteo mayor'], array['Erectores espinales'], array['Core', 'Dorsal ancho'], false, 'Cerrada', 'Hipertrofia', 3, '8-12', 120, 2,
 'Bisagra de cadera con mancuernas que carga isquiotibiales y glúteo.',
 'Con rodillas levemente flexionadas, llevá la cadera atrás bajando las mancuernas por las piernas con espalda neutra y subí apretando el glúteo.',
 'Redondear la espalda; flexionar rodillas de más; bajar hasta el piso.',
 'Mantené la barra cerca del cuerpo y la espalda neutra.', 'Subí 2 kg por mancuerna al completar 3x10 RIR 2.',
 'Peso muerto rumano con barra.', array['Peso muerto rumano a una pierna', 'Buenos días'], array['Curl femoral', 'Peso muerto rumano con barra']),

-- ============================================================
-- H) ISQUIOTIBIALES
-- ============================================================
('Curl femoral tumbado en máquina', 'Lying leg curl', 'curl femoral tumbado', 'Musculación', 'Isquiotibiales', 'Isquiotibiales (general)', 'Musculación', 'Principiante', 1, 'Máquina de curl femoral', 'Máquina', 'Aislado', 'Flexión de rodilla', array['Isquiotibiales'], array['Gastrocnemio'], array['Core'], false, 'Abierta', 'Hipertrofia', 3, '12-15', 60, 2,
 'Aislamiento de isquiotibiales en máquina tumbado.',
 'Ajustá el rodillo bajo el tendón de Aquiles; flexioná llevando el talón al glúteo y bajá lento.',
 'Levantar la cadera; rango corto; soltar el peso en la bajada.',
 'Controlá la fase excéntrica de 2 s.', 'Sumá placa al completar 3x15 RIR 2.',
 'Curl femoral sentado.', array['Curl femoral sentado', 'Curl femoral a una pierna'], array['Curl femoral sentado', 'Peso muerto rumano']),

('Curl femoral sentado en máquina', 'Seated leg curl', 'curl femoral sentado', 'Musculación', 'Isquiotibiales', 'Isquiotibiales (porción proximal)', 'Musculación', 'Principiante', 1, 'Máquina de curl femoral sentado', 'Máquina', 'Aislado', 'Flexión de rodilla', array['Isquiotibiales'], array['Gastrocnemio'], array['Core'], false, 'Abierta', 'Hipertrofia', 3, '12-15', 60, 2,
 'Curl femoral sentado, con más estiramiento de la porción larga.',
 'Con el pad sobre los muslos, flexioná las rodillas llevando los talones atrás y bajá controlado.',
 'Rango corto; usar impulso; despegar los muslos.',
 'Ajustá el respaldo para alinear la rodilla con el eje.', 'Sumá placa al completar 3x15 RIR 2.',
 'Curl femoral tumbado.', array['Curl femoral tumbado', 'Curl femoral a una pierna'], array['Curl femoral tumbado', 'Peso muerto rumano']),

('Curl femoral de pie unilateral', 'Standing single-leg curl', 'curl femoral de pie', 'Musculación', 'Isquiotibiales', 'Isquiotibiales (unilateral)', 'Musculación', 'Intermedio', 2, 'Máquina de curl femoral de pie', 'Máquina', 'Aislado', 'Flexión de rodilla', array['Isquiotibiales'], array['Gastrocnemio'], array['Core', 'Glúteo medio'], true, 'Abierta', 'Hipertrofia', 3, '12-15 por pierna', 60, 2,
 'Curl femoral unilateral para corregir diferencias.',
 'Apoyá el torso, flexioná una rodilla llevando el talón al glúteo y bajá con control.',
 'Compensar con la cadera; rango corto; rebotar.',
 'Trabajá ambos lados con la misma carga.', 'Mejorá el control antes de subir placa.',
 'Curl femoral tumbado.', array['Curl femoral tumbado', 'Curl nórdico'], array['Curl femoral sentado', 'Peso muerto rumano a una pierna']),

('Curl nórdico', 'Nordic hamstring curl', 'nordic curl, curl nórdico', 'Musculación', 'Isquiotibiales', 'Isquiotibiales (excéntrico)', 'Musculación', 'Avanzado', 3, 'Compañero o soporte', 'Peso corporal', 'Accesorio', 'Flexión de rodilla', array['Isquiotibiales'], array['Glúteo mayor'], array['Core', 'Erectores espinales'], false, 'Abierta', 'Fuerza', 3, '5-8', 120, 2,
 'Ejercicio excéntrico de isquiotibiales con alta transferencia a la prevención de lesiones.',
 'Arrodillado con los tobillos fijados, caé al frente resistiendo con los isquios todo lo posible y empujá para volver.',
 'Caer sin control; dejar que la cadera se flexione; buscar solo la bajada.',
 'Muy exigente: empezá con rango corto y asistencia.', 'Aumentá el rango controlado antes de sumar reps.',
 'Curl femoral en máquina.', array['Nordic asistido con banda', 'Curl femoral excéntrico'], array['Curl femoral tumbado', 'Peso muerto rumano']),

('Peso muerto rumano a una pierna', 'Single-leg Romanian deadlift', 'RDL a una pierna', 'Musculación', 'Isquiotibiales', 'Isquiotibiales y glúteo (unilateral)', 'Musculación', 'Intermedio', 2, 'Mancuerna o kettlebell', 'Mancuernas', 'Compuesto', 'Bisagra de cadera', array['Isquiotibiales', 'Glúteo mayor'], array['Glúteo medio'], array['Core', 'Tobillo'], true, 'Cerrada', 'Control corporal', 3, '8-12 por pierna', 75, 2,
 'Bisagra a una pierna que suma equilibrio y control de cadera.',
 'Con una pierna de apoyo, llevá la cadera atrás bajando el peso mientras la otra pierna se extiende atrás.',
 'Perder el equilibrio; rotar la cadera; redondear la espalda.',
 'Empezá liviano y con apoyo de la mano libre.', 'Añadí carga al completar 3x12 por pierna con control.',
 'Peso muerto rumano a dos piernas.', array['RDL a una pierna con barra', 'Buenos días a una pierna'], array['Peso muerto rumano con mancuernas', 'Curl femoral']),

('Buenos días', 'Good morning', 'good morning, buenos días', 'Musculación', 'Isquiotibiales', 'Isquiotibiales y erectores', 'Musculación', 'Avanzado', 3, 'Barra y rack', 'Barra', 'Compuesto', 'Bisagra de cadera', array['Isquiotibiales', 'Erectores espinales'], array['Glúteo mayor'], array['Core'], false, 'Cerrada', 'Fuerza', 3, '8-12', 120, 2,
 'Bisagra con barra en la espalda que carga isquios y cadena posterior.',
 'Con la barra en la espalda, rodillas semi-flexionadas, llevá la cadera atrás inclinando el torso con espalda neutra y volvé apretando glúteos.',
 'Redondear la lumbar; cargar demasiado; flexionar rodillas de más.',
 'Empieza con barra vacía; ejercicio de alto riesgo lumbar.', 'Subí carga solo con técnica perfecta.',
 'Peso muerto rumano.', array['Buenos días con banda', 'Buenos días a una pierna'], array['Peso muerto rumano con barra', 'Curl femoral']),

-- ============================================================
-- I) GLÚTEOS
-- ============================================================
('Hip thrust con barra', 'Barbell hip thrust', 'empuje de cadera, hip thrust', 'Musculación', 'Glúteos', 'Glúteo mayor', 'Musculación', 'Intermedio', 2, 'Banco, barra y discos', 'Barra', 'Compuesto', 'Extensión de cadera', array['Glúteo mayor'], array['Isquiotibiales', 'Cuádriceps'], array['Core'], false, 'Cerrada', 'Hipertrofia', 4, '8-12', 120, 2,
 'El ejercicio más directo para el glúteo mayor con carga alta.',
 'Espalda alta apoyada en el banco, barra sobre la cadera; extendé la cadera hasta la horizontal y apretá el glúteo arriba.',
 'Hiperextender la lumbar; empujar con los pies lejos; rango corto.',
 'Usá almohadilla en la barra para la cadera.', 'Subí 5 kg al completar 4x10 RIR 2.',
 'Puente de glúteo con barra.', array['Hip thrust a una pierna', 'Puente de glúteo con barra'], array['Puente de glúteo', 'Patada de glúteo en polea']),

('Hip thrust en máquina', 'Machine hip thrust', 'hip thrust guiado', 'Musculación', 'Glúteos', 'Glúteo mayor', 'Musculación', 'Principiante', 1, 'Máquina de hip thrust', 'Máquina', 'Compuesto', 'Extensión de cadera', array['Glúteo mayor'], array['Isquiotibiales'], array['Core'], false, 'Cerrada', 'Hipertrofia', 4, '10-15', 90, 2,
 'Hip thrust guiado, cómodo y seguro.',
 'Ajustá el cinturón y el pad; extendé la cadera contra la resistencia y apretá arriba.',
 'Rango corto; compensar con la lumbar; usar impulso.',
 'Ajustá bien el respaldo.', 'Sumá placa al completar 4x15 RIR 2.',
 'Puente de glúteo.', array['Hip thrust con barra', 'Puente de glúteo'], array['Puente de glúteo', 'Patada de glúteo en máquina']),

('Puente de glúteo a una pierna', 'Single-leg glute bridge', 'puente a una pierna', 'Musculación', 'Glúteos', 'Glúteo mayor y medio', 'Musculación', 'Principiante', 1, 'Suelo o banco', 'Peso corporal', 'Compuesto', 'Extensión de cadera', array['Glúteo mayor', 'Glúteo medio'], array['Isquiotibiales'], array['Core'], true, 'Cerrada', 'Control corporal', 3, '12-15 por pierna', 60, 2,
 'Puente unilateral que suma estabilidad de cadera.',
 'Acostado, una pierna apoyada y la otra elevada; empujá la cadera arriba apretando el glúteo y bajá controlado.',
 'Arquear la lumbar; empujar con la otra pierna; rango corto.',
 'Mantené la pelvis nivelada.', 'Más reps o lastre sobre la cadera.',
 'Puente de glúteo a dos piernas.', array['Puente de glúteo con barra', 'Frog pump'], array['Hip thrust', 'Patada de glúteo']),

('Patada de glúteo en polea', 'Cable glute kickback', 'patada de glúteo', 'Musculación', 'Glúteos', 'Glúteo mayor', 'Musculación', 'Principiante', 1, 'Polea baja y tobillera', 'Polea', 'Aislado', 'Extensión de cadera', array['Glúteo mayor'], array['Isquiotibiales'], array['Core', 'Glúteo medio'], true, 'Abierta', 'Hipertrofia', 3, '12-15 por pierna', 45, 2,
 'Extensión de cadera en polea para aislar el glúteo.',
 'Con el torso estable, llevá la pierna hacia atrás y arriba apretando el glúteo, y volvé con control.',
 'Arquear la lumbar; usar mucho rango; balancear el torso.',
 'Mantené el core firme para aislar el glúteo.', 'Subí placa al completar 3x15 por pierna.',
 'Patada de glúteo en máquina.', array['Patada de glúteo en cuadrupedia', 'Patada en máquina'], array['Hip thrust', 'Puente de glúteo']),

('Patada de glúteo en máquina', 'Machine glute kickback', 'patada de glúteo en máquina', 'Musculación', 'Glúteos', 'Glúteo mayor', 'Musculación', 'Principiante', 1, 'Máquina de patada', 'Máquina', 'Aislado', 'Extensión de cadera', array['Glúteo mayor'], array['Isquiotibiales'], array['Core'], true, 'Abierta', 'Hipertrofia', 3, '12-15 por pierna', 45, 2,
 'Patada guiada para aislar glúteo con estabilidad.',
 'Apoyá el torso y la rodilla; empujá la plataforma hacia atrás con el pie hasta extender la cadera.',
 'Arquear la lumbar; rango corto; impulso.',
 'Ajustá la máquina para evitar compensaciones.', 'Sumá placa al completar 3x15 por pierna.',
 'Patada en polea.', array['Patada de glúteo en polea', 'Patada en cuadrupedia'], array['Hip thrust', 'Puente de glúteo']),

('Abducción de cadera en máquina', 'Hip abduction machine', 'abducción en máquina, glúteo medio', 'Musculación', 'Abductores', 'Glúteo medio y menor', 'Musculación', 'Principiante', 1, 'Máquina de abducción', 'Máquina', 'Aislado', 'Abducción de cadera', array['Glúteo medio', 'Glúteo menor'], array['Tensor de la fascia lata'], array['Core'], false, 'Abierta', 'Hipertrofia', 3, '15-20', 45, 2,
 'Aislamiento de abductores, clave para la salud de rodilla y cadera.',
 'Sentado en la máquina, empujá las piernas hacia afuera contra la resistencia y volvé con control.',
 'Usar impulso; inclinar el torso; rango corto.',
 'Controlá la vuelta para no perder tensión.', 'Sumá placa al completar 3x20 RIR 2.',
 'Abducción en polea.', array['Abducción en polea', 'Monster walk con banda'], array['Abducción en polea', 'Puente a una pierna']),

('Abducción de cadera en polea', 'Cable hip abduction', 'abducción en polea', 'Musculación', 'Abductores', 'Glúteo medio', 'Musculación', 'Principiante', 1, 'Polea baja y tobillera', 'Polea', 'Aislado', 'Abducción de cadera', array['Glúteo medio'], array['Glúteo menor', 'Tensor de la fascia lata'], array['Core'], true, 'Abierta', 'Hipertrofia', 3, '15-20 por pierna', 45, 2,
 'Abducción en polea con tensión constante.',
 'De costado a la polea, abducí la pierna contra la resistencia sin inclinar el torso.',
 'Inclinar el torso; rotar la cadera; impulso.',
 'Mantené la pelvis estable.', 'Subí placa al completar 3x20 por pierna.',
 'Abducción en máquina.', array['Abducción en máquina', 'Monster walk'], array['Abducción en máquina', 'Puente a una pierna']),

('Monster walk con banda', 'Band monster walk', 'caminata monster con banda', 'Musculación', 'Abductores', 'Glúteo medio', 'Musculación', 'Principiante', 1, 'Banda elástica', 'Banda', 'Estabilidad', 'Abducción de cadera', array['Glúteo medio'], array['Glúteo menor', 'Cuádriceps'], array['Core'], false, 'Cerrada', 'Control corporal', 3, '30-45 s', 45, 2,
 'Caminata lateral con banda para activar abductores.',
 'Con la banda sobre las rodillas o tobillos y media sentadilla, caminá en diagonal dando pasos cortos.',
 'Perder la postura; juntar los pies; usar banda muy liviana.',
 'Mantené las rodillas afuera durante todo el recorrido.', 'Banda más fuerte o más tiempo.',
 'Abducción en polea.', array['Monster walk lateral', 'Caminata lateral con banda'], array['Abducción en máquina', 'Puente a una pierna']),

('Sentadilla sumo con mancuerna', 'Dumbbell sumo squat', 'sentadilla sumo, plié', 'Musculación', 'Glúteos', 'Glúteo mayor y aductores', 'Musculación', 'Principiante', 1, 'Mancuerna o kettlebell', 'Mancuernas', 'Compuesto', 'Dominante de cadera', array['Glúteo mayor', 'Aductores'], array['Cuádriceps', 'Isquiotibiales'], array['Core'], false, 'Cerrada', 'Hipertrofia', 3, '10-15', 90, 2,
 'Sentadilla con pies anchos y punta afuera que suma aductores y glúteo.',
 'Pies anchos, punta hacia afuera; bajá manteniendo el torso vertical y empujá con los talones apretando el glúteo.',
 'Rodillas que colapsan; torso que se va al frente; talones que se levantan.',
 'Alineá rodillas con la dirección de los pies.', 'Subí peso al completar 3x15 RIR 2.',
 'Sentadilla goblet.', array['Peso muerto sumo', 'Sentadilla goblet'], array['Sentadilla goblet', 'Prensa de piernas']),

-- ============================================================
-- J) ADUCTORES
-- ============================================================
('Aducción de cadera en máquina', 'Hip adduction machine', 'aducción en máquina, aductores', 'Musculación', 'Aductores', 'Aductores (magno, largo, corto)', 'Musculación', 'Principiante', 1, 'Máquina de aducción', 'Máquina', 'Aislado', 'Aducción de cadera', array['Aductores'], array['Pectíneo', 'Grácil'], array['Core'], false, 'Abierta', 'Hipertrofia', 3, '15-20', 45, 2,
 'Aislamiento de aductores, importante para estabilidad de rodilla.',
 'Sentado, juntá las piernas contra la resistencia y volvé con control.',
 'Usar impulso; rango corto; cargas excesivas.',
 'No fuerces el rango si sentís tirón en la ingle.', 'Sumá placa al completar 3x20.',
 'Aducción en polea.', array['Aducción en polea', 'Sentadilla sumo'], array['Sentadilla sumo', 'Puente a una pierna']),

('Aducción de cadera en polea', 'Cable hip adduction', 'aducción en polea', 'Musculación', 'Aductores', 'Aductores', 'Musculación', 'Principiante', 1, 'Polea baja y tobillera', 'Polea', 'Aislado', 'Aducción de cadera', array['Aductores'], array['Grácil'], array['Core'], true, 'Abierta', 'Hipertrofia', 3, '15-20 por pierna', 45, 2,
 'Aducción en polea con tensión constante.',
 'De costado a la polea, llevá la pierna hacia la línea media contra la resistencia.',
 'Inclinar el torso; rotar; impulso.',
 'Mantené el torso estable.', 'Subí placa al completar 3x20 por pierna.',
 'Aducción en máquina.', array['Aducción en máquina', 'Sentadilla sumo'], array['Sentadilla sumo', 'Zancada lateral']),

-- ============================================================
-- K) PANTORRILLAS
-- ============================================================
('Elevación de talones de pie en máquina', 'Standing calf raise machine', 'gemelos de pie en máquina', 'Musculación', 'Pantorrillas', 'Gastrocnemio', 'Musculación', 'Principiante', 1, 'Máquina de gemelos de pie', 'Máquina', 'Aislado', 'Flexión plantar', array['Gastrocnemio'], array['Sóleo'], array['Tibial anterior', 'Core'], false, 'Cerrada', 'Hipertrofia', 4, '12-20', 60, 2,
 'Elevación de talones de pie, enfatiza el gastrocnemio.',
 'Con las puntas en el escalón, bajá los talones al máximo y elevá hasta la máxima contracción.',
 'Rebotar; rango corto; flexionar rodillas.',
 'Controlá la bajada de 2 s para maximizar el estiramiento.', 'Sumá placa al completar 4x15 RIR 2.',
 'Elevación de talones de pie con mancuernas.', array['Elevación de talones a una pierna', 'Elevación en prensa'], array['Elevación sentado', 'Elevación en prensa']),

('Elevación de talones sentado', 'Seated calf raise', 'gemelos sentado, sóleo', 'Musculación', 'Pantorrillas', 'Sóleo', 'Musculación', 'Principiante', 1, 'Máquina de gemelos sentado', 'Máquina', 'Aislado', 'Flexión plantar', array['Sóleo'], array['Gastrocnemio'], array['Tibial anterior'], false, 'Cerrada', 'Hipertrofia', 4, '15-20', 60, 2,
 'Elevación sentado, con rodillas flexionadas enfatiza el sóleo.',
 'Con los pads sobre los muslos, elevá los talones y bajá al máximo estiramiento.',
 'Rango corto; rebote; usar peso excesivo.',
 'El sóleo necesita más reps y control.', 'Sumá placa al completar 4x20.',
 'Elevación de talones de pie.', array['Elevación en prensa', 'Elevación a una pierna'], array['Elevación de talones de pie', 'Elevación en prensa']),

('Elevación de talones en prensa', 'Calf press on leg press', 'gemelos en prensa', 'Musculación', 'Pantorrillas', 'Gastrocnemio y sóleo', 'Musculación', 'Principiante', 1, 'Prensa de piernas', 'Máquina', 'Aislado', 'Flexión plantar', array['Gastrocnemio', 'Sóleo'], array['Tibial anterior'], array['Core'], false, 'Cerrada', 'Hipertrofia', 4, '15-20', 60, 2,
 'Elevación de talones con la carga de la prensa, muy escalable.',
 'Con las puntas en la plataforma, empujá con los talones sin bloquear las rodillas y bajá con estiramiento.',
 'Bloquear rodillas; rango corto; rebote.',
 'Mantené las rodillas ligeramente flexionadas.', 'Sumá placas al completar 4x20.',
 'Elevación de talones de pie.', array['Elevación sentado', 'Elevación a una pierna'], array['Elevación de talones de pie', 'Elevación sentado']),

('Elevación de talones a una pierna', 'Single-leg calf raise', 'gemelos a una pierna', 'Musculación', 'Pantorrillas', 'Gastrocnemio y sóleo (unilateral)', 'Musculación', 'Intermedio', 2, 'Mancuerna o peso corporal', 'Mancuernas', 'Aislado', 'Flexión plantar', array['Gastrocnemio', 'Sóleo'], array['Tibial anterior'], array['Core', 'Glúteo medio'], true, 'Cerrada', 'Hipertrofia', 3, '15-20 por pierna', 45, 2,
 'Gemelos a una pierna con mayor rango y corrección de asimetrías.',
 'Con la punta de un pie en un escalón, bajá el talón al máximo y elevá hasta la máxima contracción.',
 'Perder el equilibrio; rebotar; rango corto.',
 'Usá un apoyo para el equilibrio.', 'Añadí mancuerna al completar 3x20 por pierna.',
 'Elevación de talones de pie.', array['Elevación de talones de pie', 'Elevación sentado'], array['Elevación de talones de pie', 'Elevación en prensa']),

-- ============================================================
-- L) TIBIAL ANTERIOR
-- ============================================================
('Elevación de punta de pie', 'Tibialis raise', 'tibial anterior, dorsiflexión con peso', 'Musculación', 'Tibial anterior', 'Tibial anterior', 'Musculación', 'Principiante', 1, 'Peso corporal o máquina', 'Peso corporal', 'Aislado', 'Dorsiflexión', array['Tibial anterior'], array['Extensores de los dedos'], array['Core'], false, 'Abierta', 'Resistencia', 3, '15-20', 45, 2,
 'Fortalece el tibial anterior, clave para prevención de lesiones y equilibrio.',
 'De espaldas a una pared, llevá las puntas de los pies hacia arriba y bajá con control.',
 'Usar impulso; rango corto; inclinarse.',
 'Progresá con lastre cuando domines el rango completo.', 'Más reps o lastre gradual.',
 'Dorsiflexión con banda.', array['Tibialis raise en máquina', 'Dorsiflexión con banda'], array['Elevación de talones de pie', 'Elevación sentado']),

('Dorsiflexión con banda', 'Band dorsiflexion', 'tibial con banda', 'Musculación', 'Tibial anterior', 'Tibial anterior', 'Musculación', 'Principiante', 1, 'Banda elástica', 'Banda', 'Aislado', 'Dorsiflexión', array['Tibial anterior'], array['Extensores de los dedos'], array['Core'], true, 'Abierta', 'Resistencia', 3, '15-20', 45, 2,
 'Dorsiflexión con banda, ideal para prehabilitación de tobillo.',
 'Anclá la banda al frente y llevá la punta del pie hacia arriba contra la resistencia.',
 'Rango corto; usar el cuerpo; banda muy dura.',
 'Movimiento lento y controlado.', 'Banda más fuerte o más reps.',
 'Elevación de punta de pie con menos rango, o caminar en puntas.',
 array['Elevación de punta de pie', 'Elevación de talones de pie'], array['Elevación de punta de pie', 'Elevación de talones de pie'])

on conflict (nombre) do nothing;

-- ============================================================
-- Verificación
-- ============================================================
select 'FASE 18 lote 3 OK' as estado,
  (select count(*) from public.exercises where categoria = 'Cuádriceps') as cuadriceps,
  (select count(*) from public.exercises where categoria = 'Isquiotibiales') as isquios,
  (select count(*) from public.exercises where categoria in ('Glúteos','Aductores','Abductores')) as gluteos,
  (select count(*) from public.exercises where categoria in ('Pantorrillas','Tibial anterior')) as pantorrillas;
