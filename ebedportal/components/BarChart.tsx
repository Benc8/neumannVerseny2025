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

interface BarChartProps {
  data: Array<{
    name: string;
    // Other keys can be numbers or strings; if a "quantity" field exists, it will be shown in the tooltip.
    [key: string]: number | string;
  }>;
  loading?: boolean;
  title?: string;
  bars: Array<{
    dataKey: string;
    name: string;
  }>;
  yAxisFormatter?: (value: number) => string;
}

// Custom tooltip that displays both the value and the quantity (if available)
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#808080",
          padding: "5px",
          borderRadius: "4px",
          boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
          color: "#fff",
        }}
      >
        <p style={{ margin: 0 }}>{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`}>
            <p style={{ margin: 0 }}>
              {entry.name}: {Number(entry.value).toLocaleString("hu-HU")}
            </p>
            {entry.payload && entry.payload.quantity !== undefined && (
              <p style={{ margin: 0 }}>Quantity: {entry.payload.quantity}</p>
            )}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function BarChart({
  data,
  loading,
  title,
  bars,
  yAxisFormatter,
}: BarChartProps) {
  return (
    <Card style={{ width: "100%" }}>
      {title && (
        <CardHeader>
          <CardTitle style={{ fontSize: "1.125rem" }}>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        {loading ? (
          <Skeleton style={{ height: "300px", width: "100%" }} />
        ) : (
          <div style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#808080" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#808080", fontSize: 12 }}
                  axisLine={{ stroke: "#808080" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#808080", fontSize: 12 }}
                  axisLine={{ stroke: "#808080" }}
                  tickLine={false}
                  tickFormatter={
                    yAxisFormatter || ((value) => value.toString())
                  }
                />
                <Tooltip
                  content={CustomTooltip}
                  cursor={{ fill: "transparent" }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: "20px",
                    color: "#808080",
                  }}
                />
                {bars.map((bar) => (
                  <Bar
                    key={bar.dataKey}
                    dataKey={bar.dataKey}
                    name={bar.name}
                    fill="#808080"
                    radius={[4, 4, 0, 0]}
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
