"use client";

import React, { useState, useEffect } from "react";
import BigFoodCard from "@/components/BigFoodCard";
import { foods } from "@/database/schema";
import { getServerSideProps, getUserId } from "@/lib/actions/foodFetch";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, addDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { createOrder } from "@/lib/actions/foodFetch";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { router } from "next/client";

type Food = typeof foods.$inferSelect;

type TransformedDailyMenu = {
  foods: Food[];
};

const OrderDailyMenu = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [dailyMenuData, setDailyMenuData] = useState<TransformedDailyMenu[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isOrdering, setIsOrdering] = useState(false);

  useEffect(() => {
    const fetchDailyMenu = async () => {
      try {
        setLoading(true);
        const formattedDate = format(date, "yyyy-MM-dd");
        const response = await getServerSideProps(formattedDate);
        const data = response.props;

        const transformedData = data.dailyMenu.map((menu) => ({
          ...menu,
          foods: [
            {
              ...menu.foods,
              type: menu.foods.type.toUpperCase(),
              category: menu.foods.category || menu.foods.type.toUpperCase(),
            },
          ],
        }));

        setDailyMenuData(transformedData);
        setQuantities({}); // Reset quantities when date changes
      } catch (error) {
        console.error("Failed to fetch daily menu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyMenu();
  }, [date]);

  const changeDate = (days: number) => {
    setDate((prevDate) => addDays(prevDate, days));
  };

  const handleQuantityChange = (foodId: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [foodId]: Math.max(0, (prev[foodId] || 0) + delta),
    }));
  };

  const handleSubmitOrder = async () => {
    try {
      setIsOrdering(true);

      // Get authenticated user ID
      const userId = await getUserId();
      if (!userId) {
        router.push("/login"); // Redirect to login if not authenticated
        return;
      }

      const selectedItems = Object.entries(quantities)
        .filter(([_, qty]) => qty > 0)
        .map(([foodId, qty]) => {
          const food = allFoods.find((f) => f.id === foodId);
          return {
            foodId,
            quantity: qty,
            price: food?.price || 0,
          };
        });

      if (selectedItems.length === 0) {
        toast({
          title: "Hiba",
          description: "Válassz ki ételt a rendeléshez!",
          variant: "destructive",
        });
        return;
      }

      const total = selectedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      await createOrder({
        userId, // Use the actual user ID
        items: selectedItems,
        totalAmount: total,
        date: date,
      });

      toast({
        title: "Rendelés sikeres!",
        description: "A rendelésedet rögzítettük!",
      });
      setQuantities({});
    } catch (error) {
      toast({
        title: "Hiba",
        description: "A rendelés sikertelen volt",
        variant: "destructive",
      });
    } finally {
      setIsOrdering(false);
    }
  };

  const allFoods = dailyMenuData.flatMap((menu) => menu.foods);
  const soups = allFoods.filter((food) => food.category === "SOUP");
  const mainCourses = allFoods.filter(
    (food) => food.category === "MAIN_COURSE",
  );

  const showEmptyState = !loading && allFoods.length === 0;

  const renderFoodCard = (food: Food, color: string) => (
    <div className="flex flex-col gap-4">
      <BigFoodCard food={food} color={color} />
      <div className="flex items-center justify-center gap-3 bg-muted/50 p-2 rounded-lg">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleQuantityChange(food.id, -1)}
          disabled={!quantities[food.id]}
          className="h-8 w-8 p-0"
        >
          -
        </Button>
        <span className="w-8 text-center text-lg font-medium">
          {quantities[food.id] || 0}
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleQuantityChange(food.id, 1)}
          className="h-8 w-8 p-0"
        >
          +
        </Button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-center mb-4">
        <Button
          className={"hidden sm:inline-block w-32 m-0 p-0"}
          onClick={() => changeDate(-1)}
        >
          Előző
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex flex-col h-auto w-60 sm:w-40 "
            >
              {format(date, "eeee")}
              <span className="text-sm text-gray-500">
                {format(date, "yyyy-MM-dd")}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="portalColors">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => selectedDate && setDate(selectedDate)}
            />
          </PopoverContent>
        </Popover>
        <Button
          className={"hidden sm:inline-block w-32"}
          onClick={() => changeDate(1)}
        >
          Következő
        </Button>
      </div>

      {showEmptyState ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">
            Nem találtunk ma menüt 😞
          </h2>
          <p className="text-gray-500">Kérjük próbálkozz másik dátummal!</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          <div className="lg:col-span-1 xl:col-span-1">
            <h2 className="text-4xl text-center font-bebas mb-4">Levesek</h2>
            <div className="space-y-6">
              {loading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-24 w-full rounded-lg" />
                  ))
                : soups.map((soup) => renderFoodCard(soup, "orange"))}
            </div>
          </div>

          <div className="lg:col-span-1 xl:col-span-2">
            <h2 className="text-4xl text-center font-bebas mb-4">Főételek</h2>
            <div className="grid gap-6 sm:grid-cols-1 xl:grid-cols-2">
              {loading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="h-24 w-full rounded-lg" />
                  ))
                : mainCourses.map((mainCourse) =>
                    renderFoodCard(mainCourse, "green"),
                  )}
            </div>
          </div>
        </div>
      )}

      {!showEmptyState && (
        <div className="mt-8 flex justify-center ">
          <Button
            size="lg"
            onClick={handleSubmitOrder}
            disabled={
              isOrdering || Object.values(quantities).every((q) => q === 0)
            }
            className="w-full max-w-md"
          >
            {isOrdering ? (
              <span className="flex items-center gap-2 text-xl">
                <span className="animate-spin">⏳</span>
                Feldolgozás...
              </span>
            ) : (
              <span className={"text-xl"}>Rendelés leadása</span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrderDailyMenu;
