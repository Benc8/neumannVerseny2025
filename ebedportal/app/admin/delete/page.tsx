"use client";

import React, { useState, useEffect } from "react";
import SmallFoodCard from "@/components/SmallFoodCard";
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
import { Trash2 } from "lucide-react";
import { removeFoodFromDailyMenu } from "@/lib/actions/foodFetch";

type Food = typeof foods.$inferSelect;

type TransformedDailyMenu = {
  foods: Food[];
};

const Page = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [dailyMenuData, setDailyMenuData] = useState<TransformedDailyMenu[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    fetchDailyMenu();
  }, [date]);

  const handleDelete = async (foodId: string) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    try {
      console.log("Deleting food:", foodId);
      console.log("Date:", formattedDate);
      await removeFoodFromDailyMenu(foodId, formattedDate);
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete food:", error);
    }
  };

  const changeDate = (days: number) => {
    setDate((prevDate) => addDays(prevDate, days));
  };

  const allFoods = dailyMenuData.flatMap((menu) => menu.foods);
  const soups = allFoods.filter((food) => food.category === "SOUP");
  const mainCourses = allFoods.filter(
    (food) => food.category === "MAIN_COURSE",
  );

  const showEmptyState = !loading && allFoods.length === 0;

  return (
    <div>
      {/* Date Selection */}
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

      {/* Content */}
      {showEmptyState ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">
            Nem találtunk ma menüt 😞
          </h2>
          <p className="text-gray-500">Kérjük próbálkozz másik dátummal!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Soups Section */}
          <div>
            <h2 className="text-4xl text-center font-bebas mb-4">Levesek</h2>
            <div className="space-y-2">
              {loading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-16 w-full rounded-lg" />
                  ))
                : soups.map((soup) => (
                    <div
                      key={soup.id}
                      className="flex items-center gap-2 w-full"
                    >
                      <SmallFoodCard food={soup} />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(soup.id)}
                        className="text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
            </div>
          </div>

          {/* Main Courses Section */}
          <div>
            <h2 className="text-4xl text-center font-bebas mb-4">Főételek</h2>
            <div className="space-y-2">
              {loading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="h-16 w-full rounded-lg" />
                  ))
                : mainCourses.map((mainCourse) => (
                    <div
                      key={mainCourse.id}
                      className="flex items-center gap-2 w-full"
                    >
                      <SmallFoodCard food={mainCourse} />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(mainCourse.id)}
                        className="text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
