"use client";

import React, { useState, useEffect } from "react";
import BigFoodCard from "@/components/BigFoodCard";
import { getServerSideProps } from "@/lib/actions/foodFetch";

interface Food {
  id: string;
  fullName: string;
  description?: string;
  type: string;
  price?: number;
  imageUrl?: string;
}

interface DailyMenu {
  foods: Food[];
}

const DailyMenu = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [dailyMenu, setDailyMenu] = useState<DailyMenu>({ foods: [] });
  const [loading, setLoading] = useState(true);

  const data = await getServerSideProps("2025-01-28");
  console.log(data);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };

  useEffect(() => {
    const fetchDailyMenu = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/daily-menu?date=${date}`);
        const data = await response.json();
        setDailyMenu(data);
      } catch (error) {
        console.error("Failed to fetch daily menu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyMenu();
  }, [date]); // Re-fetch when the date changes

  const soups = dailyMenu.foods.filter((food) => food.type === "SOUP");
  const mainCourses = dailyMenu.foods.filter(
    (food) => food.type === "MAIN_COURSE",
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Date Picker */}
      <div className="mb-6">
        <label
          htmlFor="date"
          className="block text-lg font-medium text-gray-700"
        >
          Select Date:
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={handleDateChange}
          className="mt-1 p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Menu Grid */}
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {/* First section: Soups */}
        <div className="lg:col-span-1 xl:col-span-1">
          <h2 className="text-4xl text-center font-bebas mb-4">Levesek</h2>
          <div className="space-y-6">
            {soups.map((soup) => (
              <BigFoodCard key={soup.id} food={soup} color={"orange"} />
            ))}
          </div>
        </div>

        {/* Second section: Main courses */}
        <div className="lg:col-span-1 xl:col-span-2">
          <h2 className="text-4xl text-center font-bebas mb-4">Főételek</h2>
          <div className="grid gap-6 sm:grid-cols-1 xl:grid-cols-2">
            {mainCourses.map((mainCourse) => (
              <BigFoodCard key={mainCourse.id} food={mainCourse} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyMenu;
