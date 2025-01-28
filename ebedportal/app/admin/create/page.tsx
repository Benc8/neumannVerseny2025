"use client";

import React from "react";
import FoodAdd from "@/components/FoodAdd";
import { Calendar } from "@/components/ui/calendar";

const Page = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
        <div className={"flex items-start justify-center"}>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border shadow"
          />
        </div>
      </div>
      <FoodAdd
        date={date}
        initialValues={{
          name: "Marhapörkölt",
          description: "Finom magyar pörkölt",
          category: "SOUP",
          image: "https://example.com/image.jpg",
          allergens: ["gluten", "lactose", "nut"],
        }}
      />
    </>
  );
};

export default Page;
