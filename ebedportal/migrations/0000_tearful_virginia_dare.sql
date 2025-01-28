CREATE TYPE "public"."role" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('PENDING', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TABLE "daily_menu_foods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"daily_menu_id" uuid NOT NULL,
	"food_id" uuid NOT NULL,
	CONSTRAINT "daily_menu_foods_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "daily_menus" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "daily_menus_id_unique" UNIQUE("id"),
	CONSTRAINT "daily_menus_date_unique" UNIQUE("date")
);
--> statement-breakpoint
CREATE TABLE "foods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"description" text,
	"type" text DEFAULT 'MAIN_COURSE' NOT NULL,
	"allergens" text[],
	"price" integer,
	"image_url" text,
	"category" varchar(100),
	CONSTRAINT "foods_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"status" "status" DEFAULT 'PENDING' NOT NULL,
	"role" "role" DEFAULT 'USER' NOT NULL,
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "daily_menu_foods" ADD CONSTRAINT "daily_menu_foods_daily_menu_id_daily_menus_id_fk" FOREIGN KEY ("daily_menu_id") REFERENCES "public"."daily_menus"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_menu_foods" ADD CONSTRAINT "daily_menu_foods_food_id_foods_id_fk" FOREIGN KEY ("food_id") REFERENCES "public"."foods"("id") ON DELETE no action ON UPDATE no action;