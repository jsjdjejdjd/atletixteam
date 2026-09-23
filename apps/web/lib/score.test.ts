// ============================================================
// ATLETIX Â· POWER FREE â€” TESTS DEL ENGINE DE SCORE
// ============================================================
// Prueba la funciÃ³n REAL calculateComboScore() (lib/score.ts)
// contra su propio catÃ¡logo POWER_FREE_CATALOG y la fÃ³rmula de
// lib/score.ts (L117-183). NO inventa valores: cada expectativa
// se deriva a mano de los nÃºmeros reales del catÃ¡logo (L60-89).
// Corre con Node nativo v24 (type stripping nativo):
//   node --test lib/score.test.ts
// ============================================================

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  calculateComboScore,
  POWER_FREE_CATALOG,
  EQUIPOS,
  type ComboItem,
} from "./score.ts";

const items = (raw: Record<string, unknown>[]): ComboItem[] =>
  raw.map((it) => ({
    elemento: it.elemento as string,
    unidad: it.segundos != null ? "segundos" : "reps",
    cantidad: (it.segundos ?? it.reps ?? 0) as number,
    esTransicion: it.esTransicion as boolean | undefined,
    incompleto: it.incompleto as boolean | undefined,
  }));

test("elemento con valor null en ese equipo se OMITE, no penaliza y no suma", () => {
  // Front Lever Full/Tuck = null en suelo_supino (L73-80) â†’ omitidos
  const combo = items([
    { elemento: "Front Lever Full", segundos: 5 },
    { elemento: "Front Lever Tuck", segundos: 3 },
    { elemento: "V_sit", reps: 4 }, // 0.8 en suelo_supino (L85)
  ]);
  const r = calculateComboScore(combo, "suelo_supino", POWER_FREE_CATALOG);
  assert.equal(r.total, 0.8 * 4 + 1.0); // solo V_sit aporta + variedad (1 skill)
  assert.deepEqual(r.omitidos.suelo_supino.sort(), ["Front Lever Full", "Front Lever Tuck"]);
  assert.equal(r.evaluableEn.includes("suelo_supino"), true);
});

test("valor real por equipo: Front Lever Full en barra_supino = 1.4 (L74)", () => {
  const combo = items([{ elemento: "Front Lever Full", segundos: 5 }]);
  const r = calculateComboScore(combo, "barra_supino", POWER_FREE_CATALOG);
  assert.equal(r.total, 1.4 * 5 + 1.0);
});

test("penalizaciÃ³n por incompleto + no terminado, con clamp total >= 0", () => {
  // 1.4Ã—1 + variedad 1.0 âˆ’ 0.5 (incompleto) âˆ’ 2.0 (no terminado) = -0.1 â†’ 0
  const combo = items([{ elemento: "Front Lever Full", segundos: 1, incompleto: true }]);
  const r = calculateComboScore(combo, "barra_supino", POWER_FREE_CATALOG);
  assert.equal(r.total, 0); // clamp: nunca negativo
});

test("bonus por transiciÃ³n encadenada (default 0.5) y variedad por skill distinto", () => {
  const combo = items([
    { elemento: "Front Lever Full", segundos: 2, esTransicion: true },
    { elemento: "V_sit", reps: 4 },
  ]);
  const r = calculateComboScore(combo, "barra_supino", POWER_FREE_CATALOG);
  assert.equal(r.total, 1.4 * 2 + 0.7 * 4 + 0.5 + 2.0);
});
