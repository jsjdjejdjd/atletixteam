# Propuesta de estructura de datos para ATLETIX (aditiva)

## Objetivo

Guardar la biblioteca profunda sin romper nada de lo que ya funciona. **No se modifica ni elimina ninguna tabla ni columna existente**: solo se agregan columnas a `exercises` y dos tablas nuevas.

## La tabla `exercises` se extiende con estas columnas (todas opcionales)

| Columna nueva | Tipo | Qué guarda |
|---------------|------|------------|
| `aliases` | text | Nombres alternativos, separados por `\|` (p. ej. "chin up \| dominada supino") |
| `patron` | text | Patrón de movimiento (check: Tiro vertical, Tiro horizontal, Empuje vertical, Empuje horizontal, Zancada/Zapata, Carga axial, Musculos Up, Isometría estática, Movilidad, Prehabilitación) |
| `agarre` | text | prono / supino / neutro / mixto / chin / otro |
| `agarre_ancho` | text | ancho / hombros / estrecho |
| `empenaje_tipo` | text | peso corporal / lastre / banda / goma / compañero / pesa |
| `musculos_primarios` | text[] | Grupos musculares principales (p. ej. `{Dorsal ancho,Bíceps}`) |
| `musculos_secundarios` | text[] | Musculatura secundaria |
| `demanda_fuerza` | smallint | 1–10 |
| `demanda_estabilidad` | smallint | 1–10 |
| `demanda_movilidad` | smallint | 1–10 |
| `series_sugeridas` | smallint | Series por defecto |
| `reps_sugeridas` | text | "3–5", "30 s", "5×5 + hold" |
| `descanso_seg` | smallint | Descanso entre series |
| `tempo` | text | "2-1-1", "3-0-X"… |
| `rir_sugerido` | smallint | 0–4 |
| `rpe_sugerido` | smallint | 6–10 |
| `costo_fatiga` | smallint | 1–5 (sistema `03-prescripcion.md`) |
| `biomecanica` | text | Análisis de momento/ángulo y por qué se prescribe así |
| `criterio_progresion` | text | Condición objetiva para pasar al siguiente paso |
| `detener_si` | text | Señales de detención de la serie |
| `precauciones` | text | Precauciones (p. ej. muñeca, hombro anterior) |
| `evidencia` | text | Código ALTA/MODERADA/LIMITADA/PRACTICA/SIN_EVIDENCIA |
| `fuentes` | text | Resumen legible de referencias |

## Tabla nueva: `exercise_progression`

Cada fila es un paso dentro de una escalera de progresión (o una variante/alternativa).

| Columna | Tipo | Guarda |
|---------|------|--------|
| `id` | uuid PK | — |
| `exercise_id` | uuid FK `exercises` | El ejercicio al que pertenece el paso |
| `orden` | integer | Orden en la escalera |
| `tipo` | text | `progresion` · `regresion` · `variante` · `alternativa` · `complementaria` |
| `paso_nombre` | text | Nombre del paso (p. ej. "Advanced tuck") |
| `paso_descripcion` | text | Cómo ejecutarlo |
| `criterio` | text | Condición objetiva para lograrlo |

## Tabla nueva: `exercise_sources`

Referencias estructuradas por ejercicio (las de `01-evidencia.md`).

| Columna | Tipo | Guarda |
|---------|------|--------|
| `id` | uuid PK | — |
| `exercise_id` | uuid FK `exercises` | Ejercicio referido |
| `autor` | text | Autor/resp data |
| `titulo` | text | Título de la fuente |
| `tipo` | text | `estudio` · `metaanalisis` · `libro` · `reglamento` · `guia` |
| `url` | text | Enlace |
| `anio` | integer | Año |
| `evidencia` | text | Código |

## RLS

- Las tablas nuevas siguen el mismo patrón que `exercises`: lectura para usuarios autenticados (`activo = true`), escritura solo admin. Se incluye el trigger `moddatetime` si aplica y los índices.
- Los primeros lotes de datos (seed) los carga ATLETIX (admin) — no dependen del usuario.

## Fases de implementación propuestas

- **FASE 12 (esta):** esquema aditivo + verificación en Supabase (SQL a pegar en Editor) ✓ propuesta lista
- **FASE 13:** lotes de seed por patrones (tirones, empujes, core, planche, front lever, handstand, streetlifting/mu) con las 23 columnas nuevas + pasos + fuentes
- **FASE 14 (futura):** pantallas de exploración/recomendación inteligente usando la nueva estructura sin tocar el flujo actual de entrenamientos