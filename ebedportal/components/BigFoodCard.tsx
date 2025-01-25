import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CardProps {
  color?: string;
}

const BigFoodCard = ({ color = "green" }: CardProps) => {
  return (
    <Card
      className={cn(
        color === "green" ? "card-bg-green" : "card-bg-orange",
        "flex flex-col sm:flex-row items-center md:items-start gap-6",
      )}
    >
      <CardContent className="flex-1 text-center md:text-left">
        <CardHeader className="text-2xl font-bold">
          Responsive Layout
        </CardHeader>
        <CardDescription className="secondary-text">
          This is a responsive section where text and image adjust layout based
          on screen size.
        </CardDescription>
      </CardContent>

      <CardContent className="flex-1 flex items-center justify-center">
        <img
          src={"/testImg.jpg"}
          alt={"sigma"}
          className="w-full mt-6 max-w-xs rounded-lg shadow-lg "
        />
      </CardContent>
    </Card>
  );
};
export default BigFoodCard;
