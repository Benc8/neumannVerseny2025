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
import { format, addDays, subDays } from "date-fns";

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
        const formattedDate = date.toLocaleDateString("en-CA"); // Ensure correct format
        const response = await getServerSideProps(formattedDate);
        const data = response.props;
        setDailyMenuData(data.dailyMenu);
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

  // Flatten foods from all menu entries
  const allFoods = dailyMenuData.flatMap((menu) => menu.foods);

  const soups = allFoods.filter((food) => food.type === "SOUP");
  const mainCourses = allFoods.filter((food) => food.type === "MAIN_COURSE");

  return (
    <div>
      <div className="flex items-center justify-center space-x-4 mb-4">
        <Button onClick={() => changeDate(-1)}>Previous</Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex flex-col h-auto">
              {format(date, "eeee")}
              <span className="text-sm text-gray-500">
                {format(date, "yyyy-MM-dd")}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className={"portalColors"}>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => {
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          </PopoverContent>
        </Popover>
        <Button onClick={() => changeDate(1)}>Next</Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        <div className="lg:col-span-1 xl:col-span-1">
          <h2 className="text-4xl text-center font-bebas mb-4">Levesek</h2>
          <div className="space-y-6">
            {loading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-24 w-full rounded-lg" />
                ))
              : soups.map((soup) => (
                  <BigFoodCard key={soup.id} food={soup} color={"orange"} />
                ))}
          </div>
        </div>

        <div className="lg:col-span-1 xl:col-span-2">
          <h2 className="text-4xl text-center font-bebas mb-4">Főételek</h2>
          <div className="grid gap-6 sm:grid-cols-1 xl:grid-cols-2">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-24 w-full rounded-lg" />
                ))
              : mainCourses.map((mainCourse) => (
                  <BigFoodCard
                    key={mainCourse.id}
                    food={mainCourse}
                    color={"green"}
                  />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyMenu;
