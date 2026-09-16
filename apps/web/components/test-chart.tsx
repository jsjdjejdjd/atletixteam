"use client";

import { useState } from "react";
import { LineChart } from "@/components/charts";

type Point = { fecha: string; value: number; label: string };

export function TestChart({
  series,
}: {
  series: { key: string; points: Point[] }[];
}) {
  const [key, setKey] = useState(series[0]?.key ?? "");
  const current = series.find((s) => s.key === key) ?? series[0];

  if (!current || current.points.length === 0) {
    return <p className="text-sm text-zinc-600">Sin tests todavía.</p>;
  }

  const last = current.points[current.points.length - 1];

  return (
    <div className="flex flex-col gap-3">
      <select
        value={current.key}
        onChange={(e) => setKey(e.target.value)}
        className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-zinc-500 sm:max-w-xs"
      >
        {series.map((s) => (
          <option key={s.key} value={s.key}>
            {pretty(s.key)}
          </option>
        ))}
      </select>

      <LineChart
        labels={current.points.map((p) => p.fecha)}
        values={current.points.map((p) => p.value)}
      />

      <p className="text-sm text-zinc-400">
        Último: <span className="font-bold text-white">{last.label}</span> · el{" "}
        {last.fecha}
      </p>
    </div>
  );
}

function pretty(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}