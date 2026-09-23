# FASE 3 · COMBO BUILDER / POWER FREE — Catálogo y Puntuación

> Estado: **documentación** (aún no implementada). Define el modelo de datos y el
> algoritmo de score para el módulo **Power Free / Combos** dentro de ATLETIX.
> **No se toca** el editor de sesiones actual (`workout-editor` / `workout-editor.tsx`),
> ni el flujo de entrenamientos ya existente.

---

## 1. Objetivo

Poder, desde la cuenta de un **alumno**:

1. Explorar el **catálogo de elementos** (skills de calistenia) con su **dificultad real**.
2. Armar un **combo** (secuencia de elementos + transiciones) y obtener un **score**.
3. Guardar el combo, **registrar ejecuciones** y ver **historial/progresión**.

El score del combo se calcula con los valores de dificultad **por cada uno de los
6 equipos** (la tabla que definió el coach), combinados con transiciones y duración,
y se muestra con **desglose** (no un número solo).

---

## 2. Modelo de datos — REUTILIZAR vs CREAR

### Reutilizar (ya existe, NO crear)

| Tabla | Uso en el módulo |
|---|---|
| `programs` (categoria `power_free`) | El catálogo de **combos como programas** (power_free ya está en el check `0027`). |
| `exercises` | La **biblioteca de elementos**: cada elemento del combo apunta a un `exercise` (nombre, skill, `categoria`, `nivel`, `disciplina`). |
| `exercise_progression` / `exercise_sources` | Progresiones/regresiones por elemento (reutilizar para el builder). |
| `profiles` + RLS de `athletes` | Ownership y vínculo entrenador↔alumno (nada nuevo). |
| `workout_exercises` (+ `workout_exercise_overrides`) | Sesión con `es_combo`: 5-8 elementos en cadena (patrón existente `0003`/`0005`). |

### Crear (SOLO lo mínimo, por fase 3)

| Tabla nueva | Columnas esenciales | Por qué |
|---|---|---|
| `combo_catalog` | `id uuid pk`, `exercise_id uuid fk exercises`, `equipo text check (suelo_supino, suelo_prono, barra_supino, barra_prono, anillas, paralelas)`, `valor numeric(3,1)`, `unidad text check (reps, segundos)`, `nivel text`, `es_transicion boolean default false` | Los **valores de dificultad por equipo** (la tabla del coach). UNIQUE `(exercise_id, equipo, unidad, nivel)`. |
| `combo_definitions` | `id`, `nombre`, `nivel`, `objetivo`, `created_by fk profiles`, `es_publico boolean`, `score_config jsonb` | La **plantilla de combo** (lista de elementos) + config de score del coach. |
| `combo_definition_items` | `id`, `combo_definition_id fk`, `catalog_id fk combo_catalog`, `orden integer` | Elementos **ordenados** dentro del combo (el builder). `UNIQUE (combo_definition_id, orden)`. |
| `combo_executions` | `id`, `athlete_id fk athletes`, `combo_definition_id fk`, `score numeric`, `desglose jsonb`, `duracion_seg numeric`, `fecha`, `notas` | El **registro/historial** de cada ejecución del alumno. |

> **RLS:** 3 policies por tabla, siguiendo el patrón de `0004`/`0026`:
> select **propio o admin** (`created_by = auth.uid() or is_admin()`);
> insert/update/delete **propio o admin**. Para `combo_executions` el select es
> **propio del alumno o entrenador vinculado** (idéntico al patrón de `workout_logs`).
> Solo lectura/escritura de quien corresponde — nada global.

---

## 3. Algoritmo de score — `calculateComboScore()`

Función central, **independiente de la UI** (lib/score, sin hardcodear en componentes).

### Entrada
```ts
type ComboScoreInput = {
  items: ComboItem[];        // elementos ya ordenados
  equipo: Equipo;            // uno de los 6
  config: ScoreConfig;       // del coach (jsonb editable)
};
```

### Flujo
1. **Por cada elemento**: tomar su `valor` en `combo_catalog` para el `equipo` dado.
   - Si el elemento **no existe** para ese equipo (`–`/NULL) → **se excluye del total**
     (NO penaliza; es "no disponible en ese equipo"). Sumar `disponibles`.
2. **Factor de unidad**: `reps` multiplica `valor × reps`; `segundos` multiplica `valor × segundos`.
3. **Transiciones**: si el item siguiente es `es_transicion` → se suma su valor y un
   **bonus de transición** (config).
4. **Duración**: score_por_segundo × duración total (config).
5. **Subtotales por categoría** (elementos / transiciones / duración / variedad) →
   se exponen en `desglose`.

### Salida (desglose del score)
```ts
type ComboScore = {
  total: number;            // 78.5
  subtotales: { elementos; transiciones; duracion; variedad };
  disponibles: number;      // cuántos elementos aplican al equipo
  omitidos: string[];       // elementos descartados por `–` en ese equipo
  penalizaciones: number;
};
```

> El `desglose` se guarda en `combo_executions.desglose` → permite el **historial y
> la comparación entre versiones** sin recalcular (dato inmutable por ejecución).

---

## 4. Integración con el catálogo del alumno

- El combo publicado como programa (`power_free`) aparece en el **catálogo del alumno**
  (rama ya corregida en `f9dfaa0`: sin entrenador → biblioteca global públicas).
- Al abrir el combo, el alumno entra a la vista **`/alumno/power-free/[comboId]`**:
  - Biblioteca de elementos (con filtros por equipo, como la tabla del coach).
  - **Mis combos** (guardados).
  - **Score + desglose** en vivo mientras arma.
  - **Historial de ejecuciones**.

---

## 5. Fases internas de implementación (futura)

1. Migración (crear las 4 tablas + RLS) → sustituye este doc cuando se apruebe.
2. Carga del catálogo: los `valor` por equipo (la tabla del coach) en `combo_catalog`.
3. `calculateComboScore()` en `lib/score.ts` (+ tests unitarios).
4. UI builder (drag & drop / reordenar con ↑↓, agregar, duplicar, eliminar — patrón ya usado en `workout-editor.tsx` y `live-workout.tsx`).
5. Guardar combo + registrar ejecución + historial.

---

## 6. Lo que NO se hace (reglas firmes)

- **NO tocar** `workout-editor.tsx` / editor de sesiones / flujo de entrenamientos existente.
- **NO copiar** código, diseño ni estructura propietaria de Next Calisthenics. Solo se
  toma el **concepto de dato**: elemento × 6 equipos con su valor, puntuación propia.
- **NO crear** tablas que ya existan o que reemplacen `programs`/`exercises`.
- Solo se agregan las 4 tablas mínimas + RLS de la sección 2.
