# POWER FREE · SCORE — CÁLCULO COMPLETO

> **Fase 3 · Documentación.** Este doc describe cómo se calcula el score de un
> Combo Power Free en ATLETIX. No modifica nada del código existente.
> La función central es **`calculateComboScore()`** (documentada, aún no
> implementada como módulo: primero se define el contrato acá).

---

## 1. Fuente de los valores

El puntaje de cada elemento sale de **una sola fuente**: la tabla de puntuación del
coach (`combo_elements`), donde **cada elemento tiene un valor por los 6 equipos**.

Ejemplo real (fragmento de tu tabla):

| Elemento / Skill | Suelo Supino | Suelo Prono | Barra Supino | Barra Prono | Anillas | Paralelas |
|---|---|---|---|---|---|---|
| Plancha Full | 2.5 | 2.5 | 2.5 | 2.3 | 3.5 | 2.3 |
| Plancha Tuck | 0.3 | 0.3 | 0.3 | 0.3 | 0.3 | 0.3 |
| Plancha Straddle | 1.3 | 1.3 | 1.5 | 1.5 | 2.5 | 1.3 |
| Front Lever Full | – | – | 1.4 | 1.2 | 1.4 | 1.2 |
| Back Lever Full | – | – | 1.0 | 0.8 | 1.0 | 0.8 |
| V-sit | 0.8 | 0.6 | 0.7 | 0.6 | 0.8 | 0.4 |

**Reglas de lectura:**

- `–` (guion) = **ese elemento NO se puede ejecutar en ese equipo**. No vale cero:
  queda **omitido de la suma** para ese combo (si el combo es de un solo equipo,
  el elemento con `–` en ese equipo se descarta de ese combo, sin penalizar).
- Un elemento **puede** tener valor en los 6 equipos (p. ej. `Plancha Full` indicada
  arriba) o solo en algunos (`Front Lever Full` no aplica en Suelo).

---

## 2. Unidades por elemento (REPS vs SEGUNDOS)

Cada elemento del combo se declara con una **unidad de ejecución**, que multiplica
su valor:

| Unidad | Qué mide | Ejemplo |
|---|---|---|
| `reps` | repeticiones completadas | `Full Planche push up` → 3 reps |
| `segundos` | tiempo sostenido (holD) | `Full Planche` → 8 s |

El multiplicador por defecto es **1 unidad = 1 punto base del elemento** (configurable
por el coach con `ConfigScore`). Esto permite decir:

```
Plancha Full · 8 s  →  valor 2.5  ×  (8 / 1)  = 20.0
Front Lever Full · 3 reps → valor 1.4 × 3 = 4.2
```

---

## 3. Fórmula central — `calculateComboScore()`

```
SCORE TOTAL = ELEMENTOS + TRANSICIONES + DURACION + VARIEDAD − PENALIZACIONES
```

Donde:

### 3.1 Elementos (subtotal principal)

```
ELEMENTOS = Σ ( valor(elemento, equipo) × unidades_ejecutadas )
             para cada elemento del combo en ese equipo
```

- `valor(elemento, equipo)` = el coeficiente de la columna de ese equipo.
- Solo suman los elementos con valor en ese equipo; los `–` se omiten.
- Si el combo usa **varios equipos** (mixto), cada elemento se puntúa en su **propio**
  equipo.

### 3.2 Transiciones

Cada **transición** entre dos elementos (o al inicio, p. ej. `Planche → Front Lever`)
suma su valor de dificultad de transición:

```
TRANSICIONES = Σ valor_transicion(transicion, equipo)
               + BONUS_transiciones (si el coach lo activa)
```

El `BONUS_transiciones` es opcional y configurable (p. ej. `+0.5` por transición
encadenada sin pausa).

### 3.3 Duración

Bonificación por el **tiempo total sostenido** del combo (si el coach la activa):

```
DURACION = duracion_total_seg × valor_por_segundo
           (constante configurable, por defecto 0.0 = desactivada)
```

### 3.4 Variedad

Premia usar **elementos de distintos niveles/skills** dentro de un mismo combo:

```
VARIEDAD = nº de elementos distintos usados × factor_variedad
           (o: nº de categorías distintas representadas)
```

`solo_mismo_skill` cae en variedad 0 (no premia combos monótonos).

### 3.5 Penalizaciones

Restan del total (configurables):

```
PENALIZACIONES = Σ por incumplimiento:
  - elemento incompleto       → penalización (p. ej. −0.5)
  - combo no terminado        → penalización del total
  - repetición repetida/serie sin completar → según config
  - transición rota / sin transición → penalización
```

---

## 4. Desglose (lo que ve el alumno y el coach)

El score **nunca** es un número suelto: se muestra con su desglose.

```
# PUNTUACIÓN POWER FREE

    82.4

Desglose:
  ELEMENTOS       42.0
  TRANSICIONES    18.0
  DURACIÓN        10.5
  VARIEDAD         8.0
  PENALIZACIONES  −4.1
  ─────────────────────
  TOTAL           74.4
```

Ejemplo numérico completo (mock):

Combo: `Plancha Tuck → Front Lever Tuck → V-sit` en **Barra Prono** (equipo = Barra Prono),

| Elemento | unidad | unidades | valor | score |
|---|---|---|---|---|
| Plancha Tuck | s | 6 | 0.3 | 1.8 |
| Front Lever Tuck | s | 4 | 0.2 | 0.8 |
| V-sit | s | 5 | 0.6 | 3.0 |
| **SUB ELEMENTOS** | | | | **5.6** |

| Transición | valor | score |
|---|---|---|
| Plancha Tuck → Front Lever Tuck | 0.3 | 0.3 |
| Front Lever Tuck → V-sit | 0.2 | 0.2 |
| **SUB TRANSICIONES** | | | **0.5** |

Duración total = 15 s → **DURACIÓN = 15 × 0.2 = 3.0**
Variedad (3 skills distintos) = **2.0**

```
TOTAL = 5.6 + 0.5 + 3.0 + 2.0 = 11.1
```

Este desglose se persiste en `combo_executions.desglose` (jsonb) para el historial
y la comparación entre ejecuciones sin recalcular.

---

## 5. Regla: NO hardcodear

- El score se calcula **siempre** con la función central `calculateComboScore()`
  (definida en `lib/score.ts` en la implementación futura).
- NINGÚN componente visual puede recalcular ni "inventar" la fórmula: solo **lee**
  el resultado de la función y muestra `total` + `desglose`.
- Todos los factores (valor por segundo, bonus transición, factor variedad,
  penalizaciones) son **configurables por el coach** (`ConfigScore`), no constantes
  quemadas.

---

## 6. Configuración del score (coach)

```
ConfigScore {
  multiplicador_unidad: number     // default 1
  valor_por_segundo: number        // default 0 (desactivado)
  bonus_transicion: number         // default 0.5
  factor_variedad: number          // default 𝖓º skills × 1.0
  penalizacion_incompleto: number  // default 0.5
  penalizacion_no_terminado: number// default 2.0
  penalizacion_rep_incompleta: number // default 0.5
}
```

| Parámetro | Default | Efecto |
|---|---|---|
| `multiplicador_unidad` | 1 | `valor × unidades` por elemento |
| `valor_por_segundo` | 0 | duración como bonus (opcional) |
| `bonus_transicion` | 0.5 | suma por cada transición |
| `factor_variedad` | 1.0 | × nº de skills distintos |
| `penalizacion_incompleto` | 0.5 | resta por elemento no completado |
| `penalizacion_no_terminado` | 2.0 | resta si el combo no llega al final |
| `penalizacion_rep_incompleta` | 0.5 | resta por repetición sin terminar |

---

## 7. Score por equipo (el "desglose por columna")

Si el alumno registra el combo en un equipo (p. ej. solo Barra Prono), el score se
calcula **tomando de cada elemento el valor de la columna de ese equipo**; los
elementos con `–` en esa columna quedan omitidos. Esto permite:

- comparar el **mismo combo en 2 equipos** → se ve la dificultad real por equipo;
- el coach ve **qué equipo favorece/penaliza** cada combo.

Si el combo es mixto (multi-equipo), el score por equipo se muestra como
desglose secundario: `[Barra Supino: 22.1] [Anillas: 30.0]`.

---

## 8. Extremos e invariantes

- **Score no puede ser negativo** → se clamp a `>= 0` después de penalizaciones.
- Si **todos** los elementos del combo son `–` en el equipo elegido →
  el combo **no es evaluable** en ese equipo: se muestra "No aplicable en este equipo".
- Un elemento sin valor declarado (nulo) cuenta como `–` (omitido).
- El score **nunca** está hardcodeado por nombre de ejercicio → se puede renombrar
  cualquier skill sin romper el cálculo.
