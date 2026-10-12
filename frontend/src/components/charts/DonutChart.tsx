import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface DonutChartProps<T> {
  data: T[];
  nameKey: keyof T & string;
  valueKey: keyof T & string;
  colors?: string[];
  height?: number;
}

const DEFAULT_COLORS = [
  "hsl(var(--primary))",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

export function DonutChart<T extends Record<string, unknown>>({
  data,
  nameKey,
  valueKey,
  colors = DEFAULT_COLORS,
  height = 260,
}: DonutChartProps<T>) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey={valueKey}
          nameKey={nameKey}
          innerRadius="55%"
          outerRadius="80%"
          paddingAngle={2}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}
          verticalAlign="bottom"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
