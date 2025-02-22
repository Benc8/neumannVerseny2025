"use client";

import React, { useState, useEffect } from "react";
import BigFoodCard from "@/components/BigFoodCard";
import { foods } from "@/database/schema";
import { getServerSideProps } from "@/lib/actions/foodFetch";
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

type TransformedDailyMenu = {
  foods: Food[];
};

const DailyMenu = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [dailyMenuData, setDailyMenuData] = useState<TransformedDailyMenu[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDailyMenu = async () => {
      try {
        setLoading(true);
        const formattedDate = format(date, "yyyy-MM-dd");
        const response = await getServerSideProps(formattedDate);
        const data = response.props;

        const transformedData = data.dailyMenu.map((menu) => ({
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
      } catch (error) {
        console.error("Failed to fetch daily menu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyMenu();
  }, [date]);

  const changeDate = (days: number) => {
    setDate((prevDate) => addDays(prevDate, days));
  };

  const allFoods = dailyMenuData.flatMap((menu) => menu.foods);
  const soups = allFoods.filter((food) => food.category === "SOUP");
  const mainCourses = allFoods.filter(
    (food) => food.category === "MAIN_COURSE",
  );

  // Check if we should show the empty state
  const showEmptyState = !loading && allFoods.length === 0;

  return (
    <div>
      <div className="flex items-center justify-center space-x-4 mb-4">
        <Button onClick={() => changeDate(-1)}>Előző</Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex flex-col h-auto">
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
        <Button onClick={() => changeDate(1)}>Következő</Button>
      </div>

      {showEmptyState ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">
            Nem találtunk ma menüt 😞
          </h2>
          <p className="text-gray-500">Kérjük próbálkozz másik dátummal!</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          <div className="lg:col-span-1 xl:col-span-1">
            <h2 className="text-4xl text-center font-bebas mb-4">Levesek</h2>
            <div className="space-y-6">
              {loading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-80 w-full rounded-lg" />
                  ))
                : soups.map((soup) => (
                    <BigFoodCard key={soup.id} food={soup} color="orange" />
                  ))}
            </div>
          </div>

          <div className="lg:col-span-1 xl:col-span-2">
            <h2 className="text-4xl text-center font-bebas mb-4">Főételek</h2>
            <div className="grid gap-6 sm:grid-cols-1 xl:grid-cols-2">
              {loading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="h-80 w-full rounded-lg" />
                  ))
                : mainCourses.map((mainCourse) => (
                    <BigFoodCard
                      key={mainCourse.id}
                      food={mainCourse}
                      color="green"
                    />
                  ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyMenu;
