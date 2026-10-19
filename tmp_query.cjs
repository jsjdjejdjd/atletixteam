const { createClient } = require("@supabase/supabase-js");
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

(async () => {
  const { data: profile } = await s.from("profiles").select("id, email, rol").ilike("email", "zarzuelorobertino@gmail.com").maybeSingle();
  console.log("PROFILE:", JSON.stringify(profile));

  if (!profile) { console.log("No existe perfil con ese email."); return; }

  const { data: athletes } = await s.from("athletes").select("id, user_id, entrenador_id, nivel, estado, created_at").eq("user_id", profile.id);
  console.log("ATHLETES (vinculos):", JSON.stringify(athletes, null, 1));

  const { data: entrenadores } = await athletes?.length
    ? await s.from("profiles").select("id, email, nombre").in("id", athletes.map(a => a.entrenador_id))
    : { data: [] };
  console.log("ENTRENADORES de esos vinculos:", JSON.stringify(entrenadores, null, 1));
})();
