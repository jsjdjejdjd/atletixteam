-- ============================================================
-- ATLETIX · DESVINCULAR ALUMNO (baja / cuota vencida)
-- Permite que el entrenador vea, actualice y desvincule a sus
-- alumnos, y desactive el programa activo de ese alumno.
-- Idempotente.
-- ============================================================

-- 1) El entrenador puede LEER a sus alumnos vinculados
drop policy if exists "athletes_select_entrenador" on public.athletes;
create policy "athletes_select_entrenador" on public.athletes
  for select to authenticated
  using (entrenador_id = auth.uid());

-- 2) El entrenador puede ACTUALIZAR a sus alumnos vinculados
--    (nivel, y desvincular poniendo entrenador_id = null)
drop policy if exists "athletes_update_entrenador" on public.athletes;
create policy "athletes_update_entrenador" on public.athletes
  for update to authenticated
  using (entrenador_id = auth.uid())
  with check (
    entrenador_id = auth.uid() or entrenador_id is null or public.is_admin()
  );

-- 3) El entrenador puede DESACTIVAR el programa activo de su alumno
drop policy if exists "athlete_programs_update_entrenador" on public.athlete_programs;
create policy "athlete_programs_update_entrenador" on public.athlete_programs
  for update to authenticated
  using (
    athlete_id in (select a.id from public.athletes a where a.entrenador_id = auth.uid())
  )
  with check (
    athlete_id in (select a.id from public.athletes a where a.entrenador_id = auth.uid())
  );