"use client";

import React from "react";
import FoodAdd from "@/components/FoodAdd";
import DatePicker from "@/components/DatePicker";

const Page = () => {
  // Set today's date as the initial date
  let initialDate = new Date();

  // Function to handle date changes
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      console.log("Selected Date:", date.toISOString());
      initialDate = date;
      // You can send the updated date to your server or use it as needed
    }
  };

  return (
    <>
      {/* Pass today's date as the selected date to DatePicker */}
      <DatePicker selectedDate={initialDate} onDateChange={handleDateChange} />
      {/* Pass today's date to FoodAdd */}
      <FoodAdd
        date={initialDate.toISOString()}
        initialValues={{
          name: "Marhapörkölt",
          description: "Finom magyar pörkölt",
          category: "main",
          image: "https://example.com/image.jpg",
          allergens: ["gluten", "lactose", "nut"],
        }}
      />
    </>
  );
};

export default Page;
