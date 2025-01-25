import React from "react";
import BigFoodCard from "@/components/BigFoodCard";

const DailyMenu = () => {
  return (
    <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {/* First section: Soups */}
      <div className="lg:col-span-1 xl:col-span-1">
        <h2 className="text-4xl text-center font-bebas mb-4">Levesek</h2>
        <div className="space-y-6">
          <BigFoodCard color={"orange"} />
          <BigFoodCard color={"orange"} />
          <BigFoodCard color={"orange"} />
        </div>
      </div>

      {/* Second section: Main courses */}
      <div className="lg:col-span-1 xl:col-span-2">
        <h2 className="text-4xl text-center font-bebas mb-4">Főételek</h2>
        <div className="grid gap-6 sm:grid-cols-1 xl:grid-cols-2">
          <BigFoodCard />
          <BigFoodCard />
          <BigFoodCard />
          <BigFoodCard />
          <BigFoodCard />
          <BigFoodCard />
        </div>
      </div>
    </div>
  );
};

export default DailyMenu;
