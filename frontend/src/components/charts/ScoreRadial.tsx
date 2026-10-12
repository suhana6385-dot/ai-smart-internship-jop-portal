import { RadialBar, RadialBarChart, PolarAngleAxis } from "recharts";
import { cn } from "@/utils/cn";

interface ScoreRadialProps {
  score: number;
  label?: string;
  size?: number;
  className?: string;
}

function scoreColor(score: number) {
  if (score >= 75) return "#22c55e";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

export function ScoreRadial({ score, label, size = 160, className }: ScoreRadialProps) {
  const data = [{ value: score, fill: scoreColor(score) }];

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <RadialBarChart
          width={size}
          height={size}
          cx={size / 2}
          cy={size / 2}
          innerRadius={size * 0.34}
          outerRadius={size * 0.48}
          barSize={size * 0.14}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar background dataKey="value" cornerRadius={size} />
        </RadialBarChart>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-foreground">{score}</span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>
      {label && <p className="mt-2 text-sm font-medium text-muted-foreground">{label}</p>}
    </div>
  );
}
