-- ============================================================
-- ATLETIX · 7 PROGRAMAS PARA BRUNO · uid real fe63b274-a127-441e-b3a6-15f14c2cf20b
-- ============================================================
-- · Idempotente por (nombre): si ya existe no duplica.
-- · Sin ejercicios todavía: los dictás vos después.
-- · Entrenador = Bruno (admin). Categorías/niveles = check real.
-- ============================================================

do $$
declare
  v_admin uuid := 'fe63b274-a127-441e-b3a6-15f14c2cf20b';
  prog text[][][] := array[
    array['Musculación 1','general','Principiante'],
    array['Musculación 2','general','Intermedio'],
    array['Musculación 3','general','Avanzado'],
    array['Calistenia 1','power_free','Principiante'],
    array['Calistenia 2','power_free','Intermedio'],
    array['Calistenia 3','power_free','Avanzado'],
    array['Street Lifting','power_free','Avanzado']
  ];
  i integer;
begin
  for i in 1..array_length(prog, 1) loop
    insert into public.programs (entrenador_id, nombre, categoria, nivel)
    values (v_admin, prog[i][1], prog[i][2], prog[i][3])
    on conflict do nothing;
  end loop;
  raise notice 'Bruno: 7 programas cargados (o ya existían).';
end $$;
