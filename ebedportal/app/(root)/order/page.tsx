"use client";

import React, { useState, useEffect } from "react";
import BigFoodCard from "@/components/BigFoodCard";
import { foods } from "@/database/schema";
import { getServerSideProps } from "@/lib/actions/foodFetch";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format, addDays } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { createOrder } from "@/lib/actions/orderActions"; // Assume this is created

type Food = typeof foods.$inferSelect;

type TransformedDailyMenu = {
    foods: Food[];
};

const OrderDailyMenu = () => {
    const { toast } = useToast();
    const [date, setDate] = useState<Date>(new Date());
    const [dailyMenuData, setDailyMenuData] = useState<TransformedDailyMenu[]>([]);
    const [loading, setLoading] = useState(false);
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [isOrdering, setIsOrdering] = useState(false);

    // ... keep existing useEffect and date handling ...

    const handleQuantityChange = (foodId: string, delta: number) => {
        setQuantities(prev => ({
            ...prev,
            [foodId]: Math.max(0, (prev[foodId] || 0) + delta)
        }));
    };

    const handleSubmitOrder = async () => {
        try {
            setIsOrdering(true);
            const selectedItems = Object.entries(quantities)
                .filter(([_, qty]) => qty > 0)
                .map(([foodId, qty]) => {
                    const food = allFoods.find(f => f.id === foodId);
                    return {
                        foodId,
                        quantity: qty,
                        price: food?.price || 0
                    };
                });

            if (selectedItems.length === 0) {
                toast({
                    title: "Hiba",
                    description: "Válassz ki ételt a rendeléshez!",
                    variant: "destructive"
                });
                return;
            }

            const total = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            // Assume currentUser is available from your auth system
            const orderData = {
                userId: "current_user_id", // Replace with actual user ID
                items: selectedItems,
                totalAmount: total,
                date: format(date, "yyyy-MM-dd")
            };

            await createOrder(orderData);

            toast({
                title: "Rendelés sikeres!",
                description: "A rendelésedet rögzítettük!",
            });
            setQuantities({}); // Reset quantities

        } catch (error) {
            toast({
                title: "Hiba",
                description: "A rendelés sikertelen volt",
                variant: "destructive"
            });
        } finally {
            setIsOrdering(false);
        }
    };

    // Modified render section for food cards
    const renderFoodCard = (food: Food, color: string) => (
        <div className="relative">
            <BigFoodCard key={food.id} food={food} color={color} />
            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-background/90 p-2 rounded-lg">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuantityChange(food.id, -1)}
                    disabled={!quantities[food.id]}
                >
                    -
                </Button>
                <span className="w-8 text-center">{quantities[food.id] || 0}</span>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuantityChange(food.id, 1)}
                >
                    +
                </Button>
            </div>
        </div>
    );

    return (
        <div>
            {/* Keep existing date picker code */}

            {showEmptyState ? (
                    /* Keep empty state */
                ) : (
                <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                    {/* Soup Section */}
                    <div className="lg:col-span-1 xl:col-span-1">
                        <h2 className="text-4xl text-center font-bebas mb-4">Levesek</h2>
                        <div className="space-y-6">
                            {loading ? /* skeletons */ : soups.map(soup => renderFoodCard(soup, "orange"))}
                        </div>
                    </div>

                    {/* Main Courses Section */}
                    <div className="lg:col-span-1 xl:col-span-2">
                        <h2 className="text-4xl text-center font-bebas mb-4">Főételek</h2>
                        <div className="grid gap-6 sm:grid-cols-1 xl:grid-cols-2">
                            {loading ? /* skeletons */ : mainCourses.map(mainCourse => renderFoodCard(mainCourse, "green"))}
                        </div>
                    </div>
                </div>
                )}

            {/* Order Button */}
            {!showEmptyState && (
                <div className="mt-8 flex justify-center">
                    <Button
                        size="lg"
                        onClick={handleSubmitOrder}
                        disabled={isOrdering || Object.values(quantities).every(q => q === 0)}
                    >
                        {isOrdering ? "Feldolgozás..." : "Rendelés leadása"}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default OrderDailyMenu;