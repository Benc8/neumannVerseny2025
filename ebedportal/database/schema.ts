import {
  integer,
  text,
  boolean,
  pgTable,
  uuid,
  varchar,
  pgEnum,
  timestamp,
  date,
} from "drizzle-orm/pg-core";

export const STATUS_EMUM = pgEnum("status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);
export const ROLE_EMUM = pgEnum("role", ["USER", "ADMIN"]);

export const users = pgTable("users", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  status: STATUS_EMUM("status").notNull().default("PENDING"),
  role: ROLE_EMUM("role").notNull().default("USER"),
});

export const foods = pgTable("foods", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  description: text("description"),
  type: text("type").notNull().default("soup"),
  allergens: text("allergens").array(),
  price: integer("price"),
  imageUrl: text("image_url"),
  category: varchar("category", { length: 100 }),
});

export const dailyMenus = pgTable("daily_menus", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  date: date("date").notNull().unique(), // Date of the menu (accurate to the day)
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const dailyMenuFoods = pgTable("daily_menu_foods", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  dailyMenuId: uuid("daily_menu_id")
    .notNull()
    .references(() => dailyMenus.id), // Reference to dailyMenus
  foodId: uuid("food_id")
    .notNull()
    .references(() => foods.id), // Reference to foods
});

export const orders = pgTable("orders", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id), // Reference to users
  totalAmount: integer("total_amount").notNull(), // Total amount of the order
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id),
  foodId: uuid("food_id")
    .notNull()
    .references(() => foods.id),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(),
});
