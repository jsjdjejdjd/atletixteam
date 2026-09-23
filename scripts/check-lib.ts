const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "..", "supabase", "migrations");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".sql"));

console.log("=== 1) UNIQUE constraint en workout_exercises ===");
for (const f of files) {
  const c = fs.readFileSync(path.join(dir, f), "utf8");
  // busca unique(...) cerca de workout_exercises
  const m = c.match(/create\s+unique\s+index[^;]*workout[_ ]exercises[^;]*;/gi) || [];
  const u = c.match(/constraint\s+\w*\s*unique\s*\([^)]*workout_id[^)]*orden[^)]*\)/gi) || [];
  if (m.length || u.length) {
    console.log("--- " + f + " ---");
    m.forEach((x) => console.log("UNIQUE INDEX: " + x));
    u.forEach((x) => console.log("UNIQUE CONS: " + x));
  }
}

console.log("");
console.log("=== 2) alter table workout_exercises (constraints) ===");
for (const f of files) {
  const c = fs.readFileSync(path.join(dir, f), "utf8");
  const i = c.indexOf("workout_exercises");
  while (i >= 0 && i < c.length) {
    const seg = c.substring(i, i + 200);
    if (/alter table public\.workout_exercises/i.test(seg) && /unique/i.test(seg)) {
      console.log("--- " + f + " ---");
      const idx = c.indexOf("alter table public.workout_exercises", 0);
      console.log(c.substring(Math.max(0, idx - 50), idx + 250).split("\n").slice(0, 8).join("\n"));
      break;
    }
    break;
  }
}

console.log("");
console.log("=== 3) exists trainer biblioteca page con filter ===");
const walk = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/page\.(tsx|ts)$/.test(e.name) && /entrenador/.test(p)) {
      const c = fs.readFileSync(p, "utf8");
      if (c.includes("from(\"exercises\")")) {
        const hasDisc = /disciplina|disciplina(?:\s*=|:)|musculación|esCalistenia|soloCalistenia/.test(c);
        console.log(`[${hasDisc ? "FILTRADO" : "sin-filtro"}] ${p.replace(/^.*atletix[\\\/]/, "").replace(/_dashboard/g, "")}`);
      }
    }
  }
};
walk(path.join(__dirname, "apps", "web"));
console.log("--- fin ---");
