// components/charts/bar-chart.tsx
"use client";

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface BarChartProps {
  data: Array<{
    name: string;
    [key: string]: number | string;
  }>;
  className?: string;
  loading?: boolean;
  title?: string;
  bars: Array<{
    dataKey: string;
    name: string;
  }>;
  yAxisFormatter?: (value: number) => string;
}

export function BarChart({
  data,
  className,
  loading,
  title,
  bars,
  yAxisFormatter,
}: BarChartProps) {
  // Tailwind colors for bars (light and dark theme compatible)
  const colors = [
    "hsl(var(--zinc-600))", // Light theme primary
    "hsl(var(--zinc-400))", // Light theme secondary
    "hsl(var(--zinc-200))", // Light theme tertiary
    "hsl(var(--zinc-800))", // Dark theme primary
    "hsl(var(--zinc-500))", // Dark theme secondary
  ];

  return (
    <Card className={cn("w-full portalColors", className)}>
      {title && (
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        {loading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={data}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-zinc-200 dark:stroke-zinc-800"
                />
                <XAxis
                  dataKey="name"
                  className="fill-zinc-700 dark:fill-zinc-300"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  className="fill-zinc-700 dark:fill-zinc-300"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={
                    yAxisFormatter || ((value) => value.toString())
                  }
                />
                <Tooltip
                  cursor={{ fill: "transparent" }} // Transparent hover background
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "calc(var(--radius) - 2px)",
                    boxShadow: "var(--tw-shadow)",
                    color: "hsl(var(--foreground))",
                  }}
                  formatter={(value) => [
                    Number(value).toLocaleString("hu-HU"),
                    yAxisFormatter ? yAxisFormatter(Number(value)) : value,
                  ]}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: "20px",
                    color: "hsl(var(--foreground))",
                  }}
                />
                {bars.map((bar, index) => (
                  <Bar
                    key={bar.dataKey}
                    dataKey={bar.dataKey}
                    name={bar.name}
                    fill={colors[index % colors.length]}
                    radius={[4, 4, 0, 0]}
                    className="transition-opacity hover:opacity-80" // Smooth hover effect
                  />
                ))}
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
