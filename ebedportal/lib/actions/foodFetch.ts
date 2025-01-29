"use server";

import { db } from "@/database/drizzle";
import { dailyMenus, dailyMenuFoods, foods } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function getServerSideProps(date: string) {
  const selectedDate = date || new Date().toISOString().split("T")[0];
  console.log(selectedDate);
  const dailyMenu = await db
    .select()
    .from(dailyMenus)
    .where(eq(dailyMenus.date, selectedDate))
    .leftJoin(dailyMenuFoods, eq(dailyMenus.id, dailyMenuFoods.dailyMenuId))
    .leftJoin(foods, eq(dailyMenuFoods.foodId, foods.id))
    .execute();

  // @ts-ignore
  return {
    props: {
      dailyMenu: dailyMenu.map((menu) => ({
        ...menu.daily_menus,
        foods: menu.foods,
      })),
      selectedDate, // Pass the selected date to the component
    },
  };
}
