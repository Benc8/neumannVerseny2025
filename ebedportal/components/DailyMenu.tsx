"use client";

import React, { useState } from "react";
import BigFoodCard from "@/components/BigFoodCard";
import { dailyMenus } from "@/database/schema";
import { getServerSideProps } from "@/lib/actions/foodFetch";

const DailyMenu = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const dailyMenus = await getServerSideProps();

  const soups = dailyMenu.foods.filter((food) => food.type === "SOUP");
  const mainCourses = dailyMenu.foods.filter(
    (food) => food.type === "MAIN_COURSE",
  );

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
