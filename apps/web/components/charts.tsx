const TH = 20;
const BOTTOM = 200;
const LEFT = 4;
const RIGHT = 4;

type Pt = { x: number; y: number };

export function LineChart({
  labels,
  values,
  unit = "",
  color = "#ffffff",
}: {
  labels: string[];
  values: number[];
  unit?: string;
  color?: string;
}) {
  const W = 600;
  const H = 220;

  if (values.length === 0) {
    return <p className="text-sm text-zinc-600">Sin datos todavía.</p>;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pad = range * 0.15;

  const toY = (v: number) =>
    BOTTOM - ((v - (min - pad)) / (range + pad * 2)) * (BOTTOM - TH);
  const toX = (i: number) =>
    LEFT + (i / (values.length - 1 || 1)) * (W - LEFT - RIGHT);

  const pts: Pt[] = values.map((v, i) => ({ x: toX(i), y: toY(v) }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1].x.toFixed(1)},${BOTTOM} L${pts[0].x.toFixed(1)},${BOTTOM} Z`;

  const showLabelEvery = Math.ceil(values.length / 6);

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {[0, 1, 2, 3].map((i) => {
          const y = TH + (i / 3) * (BOTTOM - TH);
          const v = min - pad + (range + pad * 2) * (1 - i / 3);
          return (
            <g key={i}>
              <line
                x1={LEFT}
                x2={W - RIGHT}
                y1={y}
                y2={y}
                stroke="#27272a"
                strokeWidth={1}
              />
              <text
                x={W - RIGHT - 2}
                y={y - 4}
                textAnchor="end"
                fontSize={9}
                fill="#71717a"
              >
                {Math.round(v * 10) / 10}
                {unit}
              </text>
            </g>
          );
        })}
        <path d={area} fill={color} opacity={0.08} />
        <path
          d={line}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3.5} fill={color} />
        ))}
        {labels.map((l, i) =>
          i % showLabelEvery === 0 || i === labels.length - 1 ? (
            <text
              key={i}
              x={toX(i)}
              y={H - 6}
              textAnchor="middle"
              fontSize={9}
              fill="#71717a"
            >
              {l.slice(5)}
            </text>
          ) : null
        )}
      </svg>
      <p className="mt-1 text-center text-[11px] text-zinc-600">
        Mín: {min}{unit} · Máx: {max}
        {unit}
      </p>
    </div>
  );
}

export function BarChart({
  bars,
  unit = "",
}: {
  bars: { label: string; value: number }[];
  unit?: string;
}) {
  const W = 600;
  const H = 210;

  if (bars.length === 0) {
    return <p className="text-sm text-zinc-600">Sin datos todavía.</p>;
  }

  const max = Math.max(...bars.map((b) => b.value)) || 1;
  const slot = W / bars.length;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {[0, 1, 2, 3].map((i) => {
          const y = TH + (i / 3) * (BOTTOM - TH);
          const v = max * (1 - i / 3);
          return (
            <g key={i}>
              <line
                x1={LEFT}
                x2={W - RIGHT}
                y1={y}
                y2={y}
                stroke="#27272a"
                strokeWidth={1}
              />
              <text
                x={W - RIGHT - 2}
                y={y - 4}
                textAnchor="end"
                fontSize={9}
                fill="#71717a"
              >
                {Math.round(v * 10) / 10}
                {unit}
              </text>
            </g>
          );
        })}
        {bars.map((b, i) => {
          const h = ((b.value / max) * (BOTTOM - TH)) || 2;
          const x = LEFT + slot * i + slot * 0.18;
          const w = slot * 0.64;
          return (
            <g key={i}>
              <rect x={x} y={BOTTOM - h} width={w} height={h} rx={4} fill="#ffffff" />
              <text
                x={x + w / 2}
                y={BOTTOM - h - 5}
                textAnchor="middle"
                fontSize={10}
                fontWeight={700}
                fill="#ffffff"
              >
                {b.value}
              </text>
              <text
                x={x + w / 2}
                y={H - 6}
                textAnchor="middle"
                fontSize={9}
                fill="#71717a"
              >
                {b.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}