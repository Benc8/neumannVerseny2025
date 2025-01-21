import React from "react";
import BigFoodCard from "@/components/BigFoodCard";
import { intersection } from "ts-interface-checker";

const DailyMenu = () => {
  return (
    <section className={"flex flex-row gap-3"}>
      <div className={"flex flex-col gap-2 min-w-1/3"}>
        <BigFoodCard />
        <BigFoodCard />
        <BigFoodCard />
      </div>
      <div className={"flex flex-col gap-2 min-w-1/3"}>
        <BigFoodCard />
        <BigFoodCard />
        <BigFoodCard />
      </div>
      <div className={"flex flex-col gap-2 min-w-1/3"}>
        <BigFoodCard />
        <BigFoodCard />
        <BigFoodCard />
      </div>
    </section>
  );
};
export default DailyMenu;
