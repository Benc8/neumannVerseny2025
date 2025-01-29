"use server";

import { db } from "@/database/drizzle";
import { dailyMenus, dailyMenuFoods, foods } from "@/database/schema";
import { eq } from "drizzle-orm";

// Define types based on your database schema
type DailyMenu = typeof dailyMenus.$inferSelect;
type Food = typeof foods.$inferSelect;

// Type for the joined query result
interface DailyMenuJoinResult {
  daily_menus: DailyMenu;
  foods: Food | null;
}

// Type for the transformed result
export interface TransformedDailyMenu extends DailyMenu {
  foods: Food | null;
}

interface ServerSideProps {
  props: {
    dailyMenu: TransformedDailyMenu[];
    selectedDate: string;
  };
}

export async function getServerSideProps(
  date: string,
): Promise<ServerSideProps> {
  const selectedDate = date || new Date().toISOString().split("T")[0];

  const result = (await db
    .select()
    .from(dailyMenus)
    .where(eq(dailyMenus.date, selectedDate))
    .leftJoin(dailyMenuFoods, eq(dailyMenus.id, dailyMenuFoods.dailyMenuId))
    .leftJoin(foods, eq(dailyMenuFoods.foodId, foods.id))
    .execute()) as DailyMenuJoinResult[];

  return {
    props: {
      dailyMenu: result.map((menu) => ({
        ...menu.daily_menus,
        foods: menu.foods,
      })),
      selectedDate,
    },
  };
}
