const fs = require("fs");
const b = "C:/Users/Gonzalo/Documents/Default Project/atletix/apps/web/app/(dashboard)/entrenador/programas/[id]/semanas/[weekId]/entrenamientos/[workoutId]";
const pg = fs.readFileSync(b + "/page.tsx", "utf8");
const we = fs.readFileSync(b + "/workout-editor.tsx", "utf8");

console.log("=== page.tsx: query biblioteca (libraryRes) ===");
const i = pg.indexOf('from("exercises")');
console.log(pg.substring(i - 120, i + 260));
console.log("");
console.log("=== page.tsx: tipo del library (tiene disciplina?) ===");
const j = pg.indexOf("disciplina");
console.log(pg.substring(j - 160, j + 80));
console.log("");
console.log("=== workout-editor.tsx: tipo prop library ===");
const k = we.indexOf("library:");
console.log(we.substring(k - 30, k + 160));
