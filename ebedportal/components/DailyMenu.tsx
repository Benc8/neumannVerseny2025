"use client";

import React, { useState, useEffect } from "react";
import BigFoodCard from "@/components/BigFoodCard";
import { dailyMenus, foods } from "@/database/schema";
import { getServerSideProps } from "@/lib/actions/foodFetch";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar"; // Import the Skeleton component

type Food = typeof foods.$inferSelect;

type TransformedDailyMenu = {
  foods: Food[];
};

const DailyMenu = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [dailyMenuData, setDailyMenuData] = useState<TransformedDailyMenu[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDailyMenu = async () => {
      try {
        setLoading(true);
        const response = await getServerSideProps(
          date?.toISOString().split("T")[0]!,
        );
        const data = response.props;
        // @ts-ignore
        setDailyMenuData(data.dailyMenu); // Ensure the API returns an array of TransformedDailyMenu
      } catch (error) {
        console.error("Failed to fetch daily menu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyMenu();
  }, [date]);

  // Flatten foods from all menu entries
  const allFoods = dailyMenuData.flatMap((menu) => menu.foods);

  const soups = allFoods.filter((food) => food.type === "SOUP");
  const mainCourses = allFoods.filter((food) => food.type === "MAIN_COURSE");

  return (
    <div>
      <div className={"flex items-start justify-center"}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border shadow"
        />
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
