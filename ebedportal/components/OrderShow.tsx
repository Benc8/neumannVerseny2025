"use client";

import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, addDays } from "date-fns";
import { getCurrentUserOrderedFoodForDay } from "@/lib/actions/foodFetch";

// Updated OrderedFood type based on the API response
export interface OrderedFood {
  foodId: string;
  foodName: string;
  price: number;
  quantity: number;
  totalAmount: number;
}

const OrderShow = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [userOrders, setUserOrders] = useState<OrderedFood[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const orders = await getCurrentUserOrderedFoodForDay(date);
        setUserOrders(orders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [date]);

  // Change the selected date by a number of days.
  const changeDate = (days: number) => {
    setDate((prevDate) => addDays(prevDate, days));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className={"text-center text-4xl font-bebas pb-4"}>Rendeléseid</h1>
      {/* Date Selector */}
      <div className="flex items-center justify-center mb-6 gap-4">
        <Button
          className="hidden sm:inline-block w-32"
          onClick={() => changeDate(-1)}
        >
          Előző nap
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex flex-col h-auto w-60 sm:w-40"
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
          className="hidden sm:inline-block w-32"
          onClick={() => changeDate(1)}
        >
          Következő nap
        </Button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : userOrders.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">
            Ma még nem rendeltél semmit 😞
          </h2>
          <p className="text-gray-500">
            Kérjük, válassz egy másik dátumot, vagy rendelj most!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {userOrders.map((order) => (
            <div
              key={order.foodId}
              className="flex items-center justify-between p-4 portalColors shadow-md rounded-lg"
            >
              <div>
                <p className="text-lg font-semibold">{order.foodName}</p>
                <p className="text-sm ">{order.price} Ft / adag</p>
              </div>
              <div className="text-right">
                <p className="text-sm ">Mennyiség:</p>
                <p className="text-lg font-bold">{order.quantity}x</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderShow;
