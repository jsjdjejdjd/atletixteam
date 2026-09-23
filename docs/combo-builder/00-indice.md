
# ATLETIX · COMBO BUILDER / POWER FREE — ÍNDICE

> Este directorio documenta el módulo **Combos Power Free (Combo Builder)**,
> inspirado en el concepto de "elementos × 6 equipos" y score desglosado.
> Se sigue el mismo convenio que `docs/exercise-db/`: documentación aditiva,
> sin tocar el flujo actual de entrenamientos ni el editor de sesiones.

## Documentos

| Doc | Contenido |
|---|---|
| [00-indice.md](00-indice.md) | Esta página (mapa del módulo) |
| [01-catalogo-puntuacion.md](01-catalogo-puntuacion.md) | **FASE 3 · catálogo + libros + score.** Estructura de la tabla de puntuación de Power Free, `combo_elements`, `calculateComboScore()` y desglose |
| `02-score-calculator.md` *(futura)* | Detalle del desempeño del calculador de score (fórmula y reglas) |
| `03-drag-drop.md` *(futura)* | Mecánica del builder (drag & drop / reorden) sin tocar el editor actual |
| `04-historial-progresion.md` *(futura)* | Historial, comparación de versiones y evolución del score |

## Estado del módulo

- **FASE 3 (catálogo + libros + score):** documentada en [01](01-catalogo-puntuacion.md). → pendiente de espec implementación.
- **Base ya existente y pusheada (no es parte de esta fase):**
  - `programs.categoria = 'power_free'` — migración `0027_combos_power_free_categoria.sql` (+ check ampliado).
  - Catálogo del alumno con rama pública (`alumno/programas/page.tsx`, commit `f9dfaa0`): sin entrenador → biblioteca global.
  - Frase del catálogo del alumno: **"Estás desvinculado de tu entrenador. Pensá que los programas que verás son los de la biblioteca global. Así que Power Free será un programa de la biblioteca."** *(no tocar)*
- **FLUJO NO TOCADO (regla):** `workout-editor.tsx` y el editor de sesiones del alumno quedan intactos — el builder del módulo es una experiencia nueva, no una modificación del editor.

## Regla de oro

1. El módulo se construye como una **herramienta nueva** dentro de ATLETIX (catálogo + builder + score + historial), reutilizando componentes de la biblioteca.
2. **No copiar** diseño/código/estructura propietaria de Next Calisthenics: se toma solo el concepto de dato (elemento × 6 equipos), con puntuación propia y configurable.
3. Antes de crear tablas nuevas, **analizar el esquema existente** (Supabase) y reutilizar lo que ya existe (`programs`, `exercises`, RLS de `athletes`/`profiles`).
