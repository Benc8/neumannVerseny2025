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
import { foods } from "@/database/schema";
import { Fish, Milk, MilkOff, Nut, Wheat, WheatOff } from "lucide-react";

const allergens = [
  {
    value: "nut",
    label: "Mogyorófélék",
    icon: Nut,
  },
  {
    value: "fish",
    label: "Garnélarák",
    icon: Fish,
  },
  {
    value: "gluten",
    label: "Glutén",
    icon: Wheat,
  },
  {
    value: "lactose",
    label: "Tej",
    icon: Milk,
  },
  {
    value: "gluten-free",
    label: "Gluténmentes",
    icon: WheatOff,
  },
  {
    value: "lactose-free",
    label: "Laktózmentes",
    icon: MilkOff,
  },
];

type Food = typeof foods.$inferSelect;

interface CardProps {
  key: string;
  food: Food;
  color?: string;
}

const BigFoodCard = (CardProps: CardProps) => {
  const getAllergenIcon = (allergenValue: string) => {
    const allergen = allergens.find((a) => a.value === allergenValue);
    return allergen
      ? React.createElement(allergen.icon, { className: "w-5 h-5" })
      : allergenValue;
  };
  return (
    <Card
      className={cn(
        CardProps.color === "green" ? "card-bg-green" : "card-bg-orange",
        "flex flex-col sm:flex-row items-center md:items-start gap-6",
      )}
    >
      <CardContent className="flex-1 text-center md:text-left">
        <CardHeader className="text-2xl font-bold">
          {CardProps.food.fullName}
        </CardHeader>
        <CardDescription className="secondary-text">
          {CardProps.food.description}
        </CardDescription>
        {CardProps.food.allergens && (
          <CardFooter className="flex gap-2 pt-5">
            {CardProps.food.allergens.map((allergen) => (
              <span key={allergen} className="allergen">
                {getAllergenIcon(allergen)}
              </span>
            ))}
          </CardFooter>
        )}
      </CardContent>

      <CardContent className="flex-1 flex flex-col items-center justify-center">
        <img
          src={CardProps.food.imageUrl || "/sigma.png"}
          alt={"sigma"}
          className="w-full mt-6 max-w-xs rounded-lg shadow-lg "
        />
        {CardProps.food.price && (
          <CardDescription className="secondary-text pt-1">
            {CardProps.food.price.toString()} Ft
          </CardDescription>
        )}
      </CardContent>
    </Card>
  );
};
export default BigFoodCard;
