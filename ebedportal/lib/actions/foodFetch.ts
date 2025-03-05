"use server";

import { db } from "@/database/drizzle";
import { dailyMenus, dailyMenuFoods, foods, users } from "@/database/schema";
import { and, eq, gte, ilike, lte, or, sql } from "drizzle-orm";
import { orders, orderItems } from "@/database/schema";
import config from "@/lib/config";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { date } from "drizzle-orm/pg-core";

interface foodSchema {
  name: string;
  description: string;
  category: string;
  image: string;
  allergens: string[];
  price: number;
  type: string;
}

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
      sql`CASE 
        WHEN ${foods.fullName} ILIKE ${pattern} THEN 1 
        ELSE 2 
      END`.mapWith(Number),
    )
    .limit(10)
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

export async function addFoodToDailyMenu(foodId: string, date: Date | string) {
  try {
    const selectedDate =
      typeof date === "string" ? date : date.toISOString().split("T")[0];

    // Check if daily menu exists for the date
    let dailyMenuEntry = await db
      .select()
      .from(dailyMenus)
      .where(eq(dailyMenus.date, selectedDate))
      .execute();

    let dailyMenuId: string;

    // Create new daily menu if none exists
    if (dailyMenuEntry.length === 0) {
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

    // Check if the food already exists in the daily menu
    const existingFoodEntry = await db
      .select()
      .from(dailyMenuFoods)
      .where(
        and(
          eq(dailyMenuFoods.dailyMenuId, dailyMenuId),
          eq(dailyMenuFoods.foodId, foodId),
        ),
      )
      .execute();

    if (existingFoodEntry.length > 0) {
      console.log("Food already exists in the daily menu.");
      return; // Exit the function if the food is already in the menu
    }

    // Add food to the daily menu
    await db
      .insert(dailyMenuFoods)
      .values({
        dailyMenuId: dailyMenuId,
        foodId: foodId,
      })
      .execute();

    console.log("Food successfully added to daily menu");
  } catch (error) {
    console.error("Error adding food to daily menu:", error);
  }
}

export async function removeFoodFromDailyMenu(
  foodId: string,
  date: Date | string,
) {
  try {
    const selectedDate =
      typeof date === "string" ? date : date.toISOString().split("T")[0];

    // Get the daily menu ID for the selected date
    const dailyMenuEntry = await db
      .select()
      .from(dailyMenus)
      .where(eq(dailyMenus.date, selectedDate))
      .execute();

    if (dailyMenuEntry.length === 0) {
      console.log("No daily menu found for the specified date");
      return;
    }

    const dailyMenuId = dailyMenuEntry[0].id;

    // Delete the food association from the daily menu
    await db
      .delete(dailyMenuFoods)
      .where(
        and(
          eq(dailyMenuFoods.dailyMenuId, dailyMenuId),
          eq(dailyMenuFoods.foodId, foodId),
        ),
      )
      .execute();

    console.log("Food successfully removed from daily menu");
  } catch (error) {
    console.error("Error removing food from daily menu:", error);
  }
}

export const createOrder = async (orderData: {
  userId: string;
  items: Array<{ foodId: string; quantity: number; price: number }>;
  totalAmount: number;
  date: Date;
}) => {
  try {
    // Create order
    const [newOrder] = await db
      .insert(orders)
      .values({
        userId: orderData.userId,
        totalAmount: orderData.totalAmount,
        status: "PENDING",
        createdAt: orderData.date,
        updatedAt: orderData.date,
      })
      .returning({ id: orders.id });

    if (!newOrder?.id) {
      throw new Error("Failed to create order");
    }

    // Create order items
    await Promise.all(
      orderData.items.map((item) =>
        db
          .insert(orderItems)
          .values({
            orderId: newOrder.id,
            foodId: item.foodId,
            quantity: item.quantity,
            price: item.price,
          })
          .execute(),
      ),
    );

    return newOrder.id;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error; // Re-throw the error for handling in the calling function
  }
};

export const getUserId = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login"); // Redirect to login page if not authenticated
  }
  return session.user.id;
};

export interface OrderSummary {
  foodId: string;
  foodName: string;
  category: string;
  totalQuantity: number;
  totalRevenue: number;
}

export async function getUserRole(userId: string): Promise<string> {
  try {
    console.log(userId);
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .execute();
    return user[0].role;
  } catch (error) {
    console.error("Error fetching user role:", error);
    throw new Error("Failed to fetch user role");
  }
}

export async function getCurrentUserOrderedFoodForDay(
  date: Date,
): Promise<OrderedFood[]> {
  // Get the current user's session.
  const session = await auth();
  if (!session?.user?.id) {
    // Redirect to login if not authenticated.
    redirect("/login");
  }
  const userId = session.user.id;

  try {
    // Calculate the start and end of the day.
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch the current user's order items for the day.
    const result = await db
      .select({
        foodId: foods.id,
        foodName: foods.fullName,
        quantity: orderItems.quantity,
        price: orderItems.price,
        totalAmount: sql<number>`${orderItems.quantity} * ${orderItems.price}`,
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .innerJoin(foods, eq(orderItems.foodId, foods.id))
      .where(
        and(
          eq(orders.userId, userId),
          gte(orders.createdAt, startOfDay),
          lte(orders.createdAt, endOfDay),
        ),
      )
      .execute();

    return result.map((item) => ({
      foodId: item.foodId,
      foodName: item.foodName,
      quantity: Number(item.quantity),
      price: Number(item.price),
      totalAmount: Number(item.totalAmount),
    }));
  } catch (error) {
    console.error(
      "Error fetching current user's ordered food for the day:",
      error,
    );
    throw new Error("Failed to fetch current user's ordered food for the day");
  }
}

export async function getUserStatus(userId: string): Promise<string> {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .execute();
    if (!user[0].status!) {
      return "";
    }
    return user[0].status!;
  } catch (error) {
    console.error("Error fetching user status:", error);
    throw new Error("Failed to fetch user status");
  }
}

export async function getUserImg(userId: string): Promise<string> {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .execute();
    if (!user[0].imageUrl!) {
      return "";
    }
    return user[0].imageUrl!;
  } catch (error) {
    console.error("Error fetching user status:", error);
    throw new Error("Failed to fetch user status");
  }
}

export async function getOrderStatistics(date?: Date): Promise<OrderSummary[]> {
  try {
    let dateFilter;
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      dateFilter = and(
        gte(orders.createdAt, startOfDay),
        lte(orders.createdAt, endOfDay),
      );
    }

    const result = await db
      .select({
        foodId: foods.id,
        foodName: foods.fullName,
        category: foods.category,
        totalQuantity: sql<number>`sum(${orderItems.quantity})`,
        totalRevenue: sql<number>`sum(${orderItems.quantity} * ${orderItems.price})`,
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .innerJoin(foods, eq(orderItems.foodId, foods.id))
      .where(dateFilter)
      .groupBy(foods.id, foods.fullName)
      .execute();

    return result.map((item) => ({
      ...item,
      totalQuantity: Number(item.totalQuantity),
      totalRevenue: Number(item.totalRevenue),
    }));
  } catch (error) {
    console.error("Error fetching order statistics:", error);
    throw new Error("Failed to fetch order statistics");
  }
}

export interface OrderedFood {
  foodId: string;
  foodName: string;
  quantity: number;
  price: number;
  totalAmount: number;
}

export async function getUserOrderedFoodForDay(
  userId: string,
  date: Date,
): Promise<OrderedFood[]> {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const result = await db
      .select({
        foodId: foods.id,
        foodName: foods.fullName,
        quantity: orderItems.quantity,
        price: orderItems.price,
        totalAmount: sql<number>`${orderItems.quantity} * ${orderItems.price}`,
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .innerJoin(foods, eq(orderItems.foodId, foods.id))
      .where(
        and(
          eq(orders.userId, userId), // Filter by user ID
          gte(orders.createdAt, startOfDay), // Filter by start of day
          lte(orders.createdAt, endOfDay), // Filter by end of day
        ),
      )
      .execute();

    return result.map((item) => ({
      foodId: item.foodId,
      foodName: item.foodName,
      quantity: Number(item.quantity),
      price: Number(item.price),
      totalAmount: Number(item.totalAmount),
    }));
  } catch (error) {
    console.error("Error fetching user's ordered food for the day:", error);
    throw new Error("Failed to fetch user's ordered food for the day");
  }
}

// Update user's image
export async function updateUserImage(userId: string, filePath: string) {
  try {
    const updatedUser = await db
      .update(users)
      .set({ imageUrl: config.env.imagekit.urlEndpoint + filePath })
      .where(eq(users.id, userId))
      .returning()
      .execute();

    if (updatedUser.length === 0) {
      throw new Error("User not found");
    }

    return updatedUser[0];
  } catch (error) {
    console.error("Error updating user image:", error);
    throw new Error("Failed to update user image");
  }
}

// Get pending users with profile images
export async function getPendingUsersWithImage() {
  try {
    const pendingUsers = await db
      .select()
      .from(users)
      .where(
        and(
          sql`${users.imageUrl} IS NOT NULL AND ${users.imageUrl} != ''`,
          eq(users.status, "PENDING"),
        ),
      )
      .execute();

    return pendingUsers;
  } catch (error) {
    console.error("Error fetching pending users with images:", error);
    throw new Error("Failed to fetch pending users with images");
  }
}
