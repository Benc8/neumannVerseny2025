"use server";

import { db } from "@/database/drizzle";
import { dailyMenus, dailyMenuFoods, foods } from "@/database/schema";
import { eq, ilike, or, sql } from "drizzle-orm";
import config from "@/lib/config";

interface foodSchema {
  name: string;
  description: string;
  category: string;
  image: string;
  allergens: string[];
  price: number;
  type: string;
}

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

export async function getFirst8Foods(): Promise<Food[]> {
  const result = await db.select().from(foods).limit(8).execute();

  return result;
}

export async function searchFoods(searchTerm: string): Promise<Food[]> {
  const pattern = `%${searchTerm}%`;

  const result = await db
    .select()
    .from(foods)
    .where(
      or(
        ilike(foods.fullName, pattern), // Case-insensitive search in name
        ilike(foods.description, pattern), // Case-insensitive search in description
      ),
    )
    .orderBy(
      // Prioritize name matches over description matches
      sql`CASE 
        WHEN ${foods.fullName} ILIKE ${pattern} THEN 1 
        ELSE 2 
      END`.mapWith(Number), // Ensure the result is mapped to a number
    )
    .limit(10) // Optional limit
    .execute();

  return result;
}

export async function getServerSideProps(
  date: string,
): Promise<ServerSideProps> {
  const selectedDate = date;

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

export async function createFood(data: foodSchema, date: Date) {
  try {
    const selectedDate = date?.toISOString().split("T")[0];

    // Construct the food image URL
    const imageUrl = config.env.imagekit.urlEndpoint + data.image;

    // Insert the food and return its ID
    const [newFood] = await db
      .insert(foods)
      .values({
        fullName: data.name,
        description: data.description,
        category: data.category,
        imageUrl: imageUrl,
        allergens: data.allergens,
        type: data.type,
        price: data.price,
      })
      .returning({ foodId: foods.id }) // Get the inserted food's ID
      .execute();

    if (!newFood?.foodId) {
      throw new Error("Failed to insert food.");
    }

    // Check if a daily menu exists for the selected date
    let dailyMenuEntry = await db
      .select()
      .from(dailyMenus)
      .where(eq(dailyMenus.date, selectedDate))
      .execute();

    let dailyMenuId: string;

    if (dailyMenuEntry.length === 0) {
      // Create a new daily menu for the date
      const [newDailyMenu] = await db
        .insert(dailyMenus)
        .values({ date: selectedDate })
        .returning({ dailyMenuId: dailyMenus.id })
        .execute();

      if (!newDailyMenu?.dailyMenuId) {
        throw new Error("Failed to create daily menu.");
      }
      dailyMenuId = newDailyMenu.dailyMenuId;
    } else {
      dailyMenuId = dailyMenuEntry[0].id;
    }

    // Insert the relation into dailyMenuFoods
    await db
      .insert(dailyMenuFoods)
      .values({
        dailyMenuId: dailyMenuId,
        foodId: newFood.foodId,
      })
      .execute();

    console.log("Food and relation added successfully");
  } catch (error) {
    console.error("Error creating food:", error);
  }
}
