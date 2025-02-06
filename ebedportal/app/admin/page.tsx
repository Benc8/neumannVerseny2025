// app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { BarChart } from "@/components/BarChart";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { hu } from "date-fns/locale";
import { getOrderStatistics } from "@/lib/actions/foodFetch";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AdminPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const stats = await getOrderStatistics(dateRange?.from, dateRange?.to);
      const chartData = stats.map((item) => ({
        name: format(new Date(item.date), "yyyy-MM-dd"),
        Értékesítés: item.totalRevenue,
        Rendelések: item.totalOrders,
      }));
      setData(chartData);
    } catch (error) {
      console.error("Hiba az adatok letöltésekor:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Értékesítési áttekintés</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd", { locale: hu })} -{" "}
                    {format(dateRange.to, "LLL dd", { locale: hu })}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd", { locale: hu })
                )
              ) : (
                "Dátum választása"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
              locale={hu}
            />
          </PopoverContent>
        </Popover>
      </div>

      <BarChart
        data={data}
        title="Napi értékesítési adatok"
        loading={loading}
        className="w-full"
        bars={[
          {
            dataKey: "Értékesítés",
            name: "Bevétel (HUF)",
            color: "hsl(var(--primary))",
          },
          {
            dataKey: "Rendelések",
            name: "Rendelések",
            color: "hsl(var(--secondary))",
          },
        ]}
        yAxisFormatter={(value) => `${value} Ft`}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Összes bevétel"
          value={data.reduce((sum, item) => sum + item.Értékesítés, 0)}
          format="currency"
          loading={loading}
        />
        <MetricCard
          title="Összes rendelés"
          value={data.reduce((sum, item) => sum + item.Rendelések, 0)}
          loading={loading}
        />
        <MetricCard
          title="Legnagyobb nap"
          value={
            data.sort((a, b) => b.Értékesítés - a.Értékesítés)[0]?.name || "-"
          }
          loading={loading}
        />
      </div>
    </div>
  );
}

// Modified Metric Card Component
function MetricCard({
  title,
  value,
  format,
  loading,
}: {
  title: string;
  value: any;
  format?: "currency" | "number";
  loading?: boolean;
}) {
  const formattedValue =
    format === "currency"
      ? `${Number(value).toLocaleString("hu-HU")} Ft`
      : typeof value === "number"
        ? value.toLocaleString("hu-HU")
        : value;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="text-sm text-muted-foreground">{title}</div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-[100px]" />
        ) : (
          <div className="text-2xl font-bold">{formattedValue}</div>
        )}
      </CardContent>
    </Card>
  );
}
