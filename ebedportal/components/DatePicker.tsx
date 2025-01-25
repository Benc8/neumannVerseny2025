"use client";

import React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date | undefined) => void;
}

export default function DatePicker({
  selectedDate,
  onDateChange,
}: DatePickerProps) {
  const handleSelectDate = (date: Date | undefined) => {
    onDateChange(date); // Pass the selected date back to the parent
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2" />
          {selectedDate ? (
            format(selectedDate, "PPP")
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelectDate}
          initialFocus
          className={
            "bg-gradient-to-bl text-zinc-900 dark:text-zinc-100 dark:from-gray-800 dark:via-gray-900 dark:to-black"
          }
        />
      </PopoverContent>
    </Popover>
  );
}
