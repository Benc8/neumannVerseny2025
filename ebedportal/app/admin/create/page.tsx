"use client";

import React, { useEffect, useState } from "react";
import FoodAdd from "@/components/FoodAdd";
import { Calendar } from "@/components/ui/calendar";
import SmallFoodCard from "@/components/SmallFoodCard";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getFirst8Foods,
  searchFoods,
  addFoodToDailyMenu,
} from "@/lib/actions/foodFetch";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Page = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [foods, setFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingFood, setEditingFood] = useState<any | null>(null);

  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true);
      try {
        const result = searchTerm
          ? await searchFoods(searchTerm)
          : await getFirst8Foods();
        setFoods(result);
      } catch (error) {
        console.error("Failed to fetch foods:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchFoods, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const localDate = new Date(selectedDate);
      localDate.setHours(3, 0, 0, 0);
      setDate(localDate);
    }
  };

  const handleAddToMenu = async (foodId: string) => {
    if (!date) return;
    try {
      await addFoodToDailyMenu(foodId, date);
      toast({
        title: "Étel sikeresen hozzáadva",
        description:
          "Az étel sikeresen hozzáadva a menühöz a kiválasztott dátumon",
      });
    } catch (error) {
      console.error("Error adding food to menu:", error);
      toast({
        title: "Az étel hozzáadása sikertelen",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
        {/* Calendar Column */}
        <div>
          <h1 className={"text-center text-3xl p-3 font-bebas"}>
            Válassz dátumot
          </h1>
          <div className="flex items-start justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="rounded-md border shadow"
            />
          </div>
        </div>

        {/* Search and Results Column */}
        <div className="flex flex-col gap-4 h-[350px]">
          <Input
            placeholder="Search foods..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full mb-2 rounded-lg" />
                ))
              : foods.map((food) => (
                  <div
                    key={food.id}
                    className="mb-4 space-y-2 w-full box-border"
                  >
                    <SmallFoodCard food={food} />
                    <div className="flex gap-2 ml-2">
                      <Button
                        size="sm"
                        className={
                          "bg-green-500 hover:bg-green-600 rounded-lg text-zinc-900"
                        }
                        onClick={() => handleAddToMenu(food.id)}
                      >
                        Hozzáadás a menühöz
                      </Button>
                    </div>
                  </div>
                ))}
            {!loading && foods.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No foods found
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      <FoodAdd
        date={date}
        initialValues={editingFood}
        onClose={() => setEditingFood(null)}
      />
    </div>
  );
};

export default Page;
