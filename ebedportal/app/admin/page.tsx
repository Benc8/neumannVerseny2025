// app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { BarChart } from "@/components/BarChart";
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
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [date]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (!date) {
        setData([]);
        return;
      }

      const stats = await getOrderStatistics(date);
      const chartData = stats.map((item) => ({
        name: item.foodName,
        Mennyiség: item.totalQuantity,
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
              {date
                ? format(date, "LLL dd", { locale: hu })
                : "Dátum választása"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              locale={hu}
              className="portalColors"
            />
          </PopoverContent>
        </Popover>
      </div>

      {data.length > 0 || loading ? (
        <BarChart
          data={data}
          title="Étel szerinti eladott mennyiség"
          loading={loading}
          className="w-full"
          bars={[
            {
              dataKey: "Mennyiség",
              name: "Eladott mennyiség",
            },
          ]}
          yAxisFormatter={(value) => `${value.toLocaleString("hu-HU")}`}
        />
      ) : (
        !loading && (
          <div className="flex h-[300px] items-center justify-center rounded-lg border bg-muted/50">
            <p className="text-muted-foreground">
              Nincs adat a kiválasztott dátumhoz
            </p>
          </div>
        )
      )}

      {data.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            title="Összes eladott mennyiség"
            value={data.reduce((sum, item) => sum + item.Mennyiség, 0)}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
}

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
    value === undefined
      ? "-"
      : format === "currency"
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
