-- ============================================================
-- ATLETIX · 0070 · ELIMINAR PROGRAMAS ISOMÉTRICOS YA NO USADOS
-- ============================================================
-- Borra los programas del catálogo que ya no se quieren:
--   · Planche Avanzado        (planche/Avanzado)
--   · Planche Élite           (planche/Elite)
--   · Front Lever Intermedio  (front_lever/Intermedio)
--   · Front Lever Avanzado    (front_lever/Avanzado)
--   · Front Lever Élite       (front_lever/Elite)
-- Las FK on delete cascade limpian weeks → workouts →
-- workout_exercises → sets, y athlete_programs.
-- Idempotente: los que ya no existan simplemente no se tocan.
-- ============================================================

delete from public.programs
 where nombre in (
   'Planche Avanzado',
   'Planche Élite',
   'Front Lever Intermedio',
   'Front Lever Avanzado',
   'Front Lever Élite'
 );

-- Verificación: qué programas quedan y qué se eliminó
select '0070 OK' as estado;
select p.nombre, p.categoria, p.nivel, p.activo
  from public.programs p
 order by p.categoria, p.nivel, p.nombre;