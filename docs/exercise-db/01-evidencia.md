# Sistema de clasificación de evidencia y fuentes

## Códigos de evidencia

Cada ejercicio y cada afirmación clave de la biblioteca lleva un código de evidencia.

| Código | Clase | Definición | Color sugerido |
|--------|-------|------------|----------------|
| `ALTA` | Evidencia alta (meta-análisis, revisiones sistemáticas, múltiples RCT consistentes) | La conclusión está respaldada por varios estudios controlados de buena calidad y es consistente. | Verde |
| `MODERADA` | Evidencia moderada (RCT aislado, ensayos controlados limitados) | Hay 1–2 estudios controlados de calidad, pero el tema no está resuelto. | Amarillo |
| `LIMITADA` | Evidencia limitada (estudios observacionales, modelos biomecánicos computacionales, laboratorio) | Indicios plausibles, mediciones indirectas o modelos; útiles para entender el "cómo", no para afirmar efectos definitivos. | Naranja |
| `PRACTICA` | Práctica de entrenamiento (consenso deportivo, reglamentos oficiales, tradición de método) | No hay estudios directos, pero es la práctica aceptada del deporte (p. ej. gimnasia, streetlifting). | Celeste |
| `SIN_EVIDENCIA` | Sin evidencia suficiente | Afirmación popular de internet sin respaldo verificable. Se marca para no tomarla como cierta. | Gris |

## Fuentes base (verificadas en investigación)

| # | Fuente | Tipo | Aporta |
|---|--------|------|--------|
| 1 | Modelo biomecánico computacional de planche y planche→handstand (9 segmentos, PMC10376746) | Modelo computacional (LIMITADA) | Geometría de planche: control de línea de gravedad sobre la base de apoyo; apertura progresiva de cadera; planche exigencia isométrica de tríceps/deltoides anterior y L-sit como paso previo. La FIG (Código de Puntos de Gimnasia Artística) clasifica planche como "Static Strength Element" (PRACTICA). |
| 2 | Oranchuk et al., 2019, *Scand J Med Sci Sports* — revisión sistemática de entrenamiento isométrico (Wiley) | Revisión sistemática (ALTA) | Isometría a intensidad ≥70% de MVIC: mejoras de fuerza y de propiedades tendinosas; la isometría submáxima hasta cerca del fallo produce hipertrofia; la fuerza ganada es específica del ángulo articular entrenado → usar isometrías en los ángulos débiles (lock-off de dominada, planche abierto, front lever horizontal). |
| 3 | Proximidad al fallo e hipertrofia — meta-análisis, *Sports Medicine* 2023 (PubMed 36334240) | Meta-análisis (ALTA) | Entrenar hasta el fallo momentáneo produce hipertrofia solo trivialmente mayor que quedarse 1–3 repeticiones antes del fallo, PERO el fallo sistemático puede perjudicar el desarrollo de fuerza y aumentar fatiga → prescribir con RIR 1–3 y no fallar siempre (excepto para test/competencia). |
| 4 | USA Streetlifting — reglamento oficial (PDF) | Reglamento oficial (PRACTICA) | Formato Classic = Weighted Pull-Up + Weighted Dip; formato All4 = + Weighted Muscle-Up + Back Squat; progresión de carga en incrementos de 1.25 kg; intentos válidos en rangos fijos (pull: barbilla sobre la barra con cadera sin rebotar; dip: shoulders a la altura del codo, sin apoyo). |
| 5 | Momentos de fuerza del pectoral mayor — estudio anatómico (PMC2644775) | Estudio de mandíbulas/laboratorio (LIMITADA) | El brazo de momento del pectoral es mayor en aducción horizontal y rotación interna, no en el empuje puro vertical u horizontal → los fondos/dips con torso inclinado (aducción horizontal) reclutan más pectoral que dips verticales de tríceps. |
| 6 | Preparación física para handstand — guía de S&C gimnástico (gymnasticsdirect.com.au) | Guía de práctica (PRACTICA) | El pino requiere: fuerza de flexión de hombro (hollow + press), condicionamiento progresivo de muñecas, y tiempo de tensión; progresión típica: contra pared → chest-to-wall → freestanding con manos abiertas. |
| 7 | Muscle up en barra vs anillas — comparación técnica (PMC10824315) | Estudio observacional biomecánico (LIMITADA) | El muscle up de anillas es mecánicamente una variación del Front Up-Rise (elevación frontal); el de barra usa un glide kip (balanceo invertido). Son técnicamente distintos: no son intercambiables y requieren rutas de entrenamiento diferentes. |
| 8 | Cinemática escapular en dominadas y riesgo de hombro — estudio de agarres (PMC4916995) | Estudio de laboratorio (LIMITADA) | El agarre ancho y el agarre supino/reverse modifican la cinemática escapular y los patrones de activación; el agarre ancho sobrecarga la abducción escapular y aumenta las fuerzas anteriores del hombro → progresar el ancho del agarre con cuidado; señales de detención ante dolor anterior de hombro. |

## Cómo se usa en la base de datos

- Cada ejercicio lleva `evidencia` (código) y `fuentes` (lista legible) en la tabla `exercises`.
- La tabla `exercise_sources` guarda cada referencia de forma estructurada (autor, título, tipo, URL, año).
- Una afirmación sin fuente va como `SIN_EVIDENCIA` o se omite; nunca se presenta como cierta.