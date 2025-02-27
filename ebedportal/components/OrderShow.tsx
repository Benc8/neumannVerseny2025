"use client";

import React, { useState, useEffect } from "react";
import BigFoodCard from "@/components/BigFoodCard";
import { foods } from "@/database/schema";
import {
  getServerSideProps,
  getOrderStatistics,
} from "@/lib/actions/foodFetch";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, addDays } from "date-fns";

type Food = typeof foods.$inferSelect;
type OrderSummary = Awaited<ReturnType<typeof getOrderStatistics>>[number];

type TransformedDailyMenu = {
  foods: Food[];
};

const OrderShow = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [dailyMenuData, setDailyMenuData] = useState<TransformedDailyMenu[]>(
    [],
  );
  const [orderStats, setOrderStats] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const formattedDate = format(date, "yyyy-MM-dd");

        // Fetch both menu and order statistics
        const [menuResponse, stats] = await Promise.all([
          getServerSideProps(formattedDate),
          getOrderStatistics(date),
        ]);

        const transformedData = menuResponse.props.dailyMenu.map((menu) => ({
          ...menu,
          foods: [
            {
              ...menu.foods,
              type: menu.foods.type.toUpperCase(),
              category: menu.foods.category || menu.foods.type.toUpperCase(),
            },
          ],
        }));

        setDailyMenuData(transformedData);
        setOrderStats(stats);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date]);

  const changeDate = (days: number) => {
    setDate((prevDate) => addDays(prevDate, days));
  };

  const getQuantityForFood = (foodId: string) => {
    return (
      orderStats.find((stat) => stat.foodId === foodId)?.totalQuantity || 0
    );
  };

  const allFoods = dailyMenuData.flatMap((menu) => menu.foods);
  const soups = allFoods.filter((food) => food.category === "SOUP");
  const mainCourses = allFoods.filter(
    (food) => food.category === "MAIN_COURSE",
  );

  const showEmptyState = !loading && allFoods.length === 0;

  return (
    <div>
      {/* Date Selector */}
      <div className="flex items-center justify-center mb-4">
        <Button
          className={"hidden sm:inline-block w-32 m-0 p-0"}
          onClick={() => changeDate(-1)}
        >
          Előző
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex flex-col h-auto w-60 sm:w-40 "
            >
              {format(date, "eeee")}
              <span className="text-sm text-gray-500">
                {format(date, "yyyy-MM-dd")}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="portalColors">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => selectedDate && setDate(selectedDate)}
            />
          </PopoverContent>
        </Popover>
        <Button
          className={"hidden sm:inline-block w-32"}
          onClick={() => changeDate(1)}
        >
          Következő
        </Button>
      </div>

      {/* Empty State */}
      {showEmptyState ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">
            Nem találtunk ma menüt 😞
          </h2>
          <p className="text-gray-500">Kérjük próbálkozz másik dátummal!</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {/* Soups Section */}
          <div className="lg:col-span-1 xl:col-span-1">
            <h2 className="text-4xl text-center font-bebas mb-4">Levesek</h2>
            <div className="space-y-6">
              {loading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-24 w-full rounded-lg" />
                  ))
                : soups.map((soup) => (
                    <div key={soup.id} className="relative">
                      <BigFoodCard food={soup} color="orange" />
                      <div className="absolute bottom-2 left-2 bg-background/80 px-2 py-1 rounded-md text-sm">
                        Rendelt mennyiség: {getQuantityForFood(soup.id)}
                      </div>
                    </div>
                  ))}
            </div>
          </div>

          {/* Main Courses Section */}
          <div className="lg:col-span-1 xl:col-span-2">
            <h2 className="text-4xl text-center font-bebas mb-4">Főételek</h2>
            <div className="grid gap-6 sm:grid-cols-1 xl:grid-cols-2">
              {loading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="h-24 w-full rounded-lg" />
                  ))
                : mainCourses.map((mainCourse) => (
                    <div key={mainCourse.id} className="relative">
                      <BigFoodCard food={mainCourse} color="green" />
                      <div className="absolute bottom-2 left-2 bg-background/80 px-2 py-1 rounded-md text-sm">
                        Rendelt mennyiség: {getQuantityForFood(mainCourse.id)}
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderShow;
