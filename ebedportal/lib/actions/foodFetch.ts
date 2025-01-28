import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { dailyMenus, dailyMenuFoods, foods } from "@/database/schema";
import { eq } from "drizzle-orm";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

export async function getServerSideProps(context: any) {
  const { date } = context.query; // Get the date from the query parameter

  // If no date is provided, default to today's date
  const selectedDate = date || new Date().toISOString().split("T")[0];

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
