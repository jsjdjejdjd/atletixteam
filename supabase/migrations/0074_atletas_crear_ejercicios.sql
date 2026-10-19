-- ============================================================
-- 0074 · Los alumnos pueden crear ejercicios en la biblioteca
-- ------------------------------------------------------------
-- Antes solo los miembros del programa "Planche / Front Lever"
-- podian insertar en public.exercises (policy exercises_insert_planche).
-- Los alumnos que arman su propio programa ("Crear mi programa") o
-- editan una sesion necesitan crear un ejercicio que no este en la
-- biblioteca. Se habilitan los insert para cualquier usuario
-- autenticado, siempre activos para que se vean.
--
-- El admin conserva su policy original (exercises_insert_admin),
-- que no exige activo = true.
-- ============================================================

drop policy if exists "exercises_insert_atletas" on public.exercises;
create policy "exercises_insert_atletas" on public.exercises
  for insert to authenticated
  with check (activo = true);
