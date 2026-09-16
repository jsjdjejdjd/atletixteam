# Prescripción: RIR/RPE, series, isometría, hipertrofia y fatiga

Base de prescripción de la biblioteca y del registro de entrenamiento de ATLETIX.

## RIR y RPE

- **RPE** (esfuerzo percibido): escala 1–10 de esfuerzo por REP.
- **RIR** (repeticiones en reserva): cuántas reps *más* podrías hacer con buena técnica.

| Regla | Código | Guía |
|-------|--------|------|
| Fuerza (1–5 reps) | RIR 1–2 | Fallo puntual en **test/competencia**; entrenar con 1–2 de reserva |
| Hipertrofia (6–12 reps) | RIR 1–3 | La proximidad al fallo da hipertrofia **trivialmente mayor** que terminar 1–3 reps antes, pero el fallo sistemático perjudica fuerza y suma fatiga (meta-análisis Sports Med 2023, PubMed 36334240) |
| Isometría | RIR 0–1 en sostén submáximo | Ver abajo |

**Recomendación práctica (meta 36334240, ALTA):** la mayoría de las series terminan en **RIR 1–3**. El fallo se reserva para PR, tests y algún bloque específico — nunca en cada serie.

## Isometría (Oranchuk 2019 — revisión sistemática, ALTA)

| Hallazgo | Aplicación |
|----------|------------|
| Intensidad ≥70% de máxima contracción voluntaria (MVIC) mejora fuerza y propiedades del tendón | Planche/front lever/holds = isometrías por naturaleza: sostener con tensión alta (ángulo libre) |
| Isometría submáxima hasta cerca del fallo produce hipertrofia | Sostener submáximos 30–60 s con calidad es también estímulo de crecimiento |
| La ganancia es específica del ángulo entrenado | Entrenar el **ángulo débil** (p. ej. lock-off a mitad de dominada, planche con apertura justo al punto de quiebre, front lever a −20°) |
| Volumen típico | 3–5 sostenes, 2–3 sesiones/semana; total de tensión diario 10–20 min de sostén acumulado |

## Hipertrofia (triángulo de volumen + proximidad)

- **Volumen semanal por grupo:** ~10–20 series efectivas (peso corporal realista: 8–15).
- **Fallo:** solo trivialmente superior para hipertrofia; perjudica fuerza si es crónico (meta `36334240`).
- **Frecuencia:** cada grupo 2×/semana con al menos 48 h entre sesiones del mismo patrón.
- **Tempo:** bajar en 2–3 s y sin rebote = mejor señal de crecimiento con menos carga articular.

## Fatiga y seguridad (sistema `costo_fatiga` 1–5)

| Costo | Significado | Ejemplo |
|-------|-------------|---------|
| 1 | Mínimo; se puede poner temprano y recuperar igual | Hollow, muñecas, movilidad |
| 2 | Bajo | Flexión inclinada, remo australiano |
| 3 | Medio; respetar el descanso entre series | Dominada, fondos, plancha |
| 4 | Alto; no encadenar muchos en la misma sesión | Dominada lastrada, planche avanzado |
| 5 | Muy alto; priorizar calidad sobre volumen | Front lever full, planche full, press a pino |

## Señales de detención (`detener_si`)

Estas condiciones cancelan la serie sin discusión (seguridad > rendimiento):

1. Dolor articular agudo (hombro, codo, muñeca, lumbar) — no "ardor muscular", sino dolor punzante.
2. Pérdida técnica estructural (rebote de cadera en pull, quiebre lumbar en lever, rotación de anillas fuera de control).
3. Mareo, visión borrosa o inestabilidad severa.
4. Dolor anterior de hombro en dominada/fondo ancho (agarrar más estrecho y revisar; PMC4916995, LIMITADA).
5. Dolor de muñeca que no cede con 5 min de calentamiento específico.

## Unión con ATLETIX

- `workout_exercises` ya trae `series`, `repeticiones`, `rir`, `descanso_segundos`, `tempo`, `asistencia`.
- La biblioteca sugiere valores por defecto (`series_sugeridas`, `reps_sugeridas`, `rir_sugerido`, `rpe_sugerido`, `tempo`, `descanso_seg`) que el entrenador puede ajustar.
- El registro del alumno (`workout_logs.series_data`) captura `rir` por serie real para hacer seguimiento de fatiga.