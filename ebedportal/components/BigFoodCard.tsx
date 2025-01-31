import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { foods } from "@/database/schema";
import { Fish, Milk, MilkOff, Nut, Wheat, WheatOff } from "lucide-react";

const allergens = [
  { value: "nut", label: "Mogyorófélék", icon: Nut },
  { value: "fish", label: "Garnélarák", icon: Fish },
  { value: "gluten", label: "Glutén", icon: Wheat },
  { value: "lactose", label: "Tej", icon: Milk },
  { value: "gluten-free", label: "Gluténmentes", icon: WheatOff },
  { value: "lactose-free", label: "Laktózmentes", icon: MilkOff },
];

type Food = typeof foods.$inferSelect;

interface CardProps {
  key: string;
  food: Food;
  color?: string;
}

const BigFoodCard = ({ food, color }: CardProps) => {
  const getAllergenData = (allergenValue: string) =>
    allergens.find((a) => a.value === allergenValue);

  return (
    <TooltipProvider>
      <Card
        className={cn(
          color === "green" ? "card-bg-green" : "card-bg-orange",
          "flex flex-col sm:flex-row items-center md:items-start gap-6",
        )}
      >
        <CardContent className="flex-1 text-center md:text-left">
          <CardHeader className="text-2xl font-bold">
            {food.fullName}
          </CardHeader>
          <CardDescription className="secondary-text">
            {food.description}
          </CardDescription>
          {food.allergens && (
            <CardFooter className="flex gap-2 pt-5">
              {food.allergens.map((allergen) => {
                const allergenData = getAllergenData(allergen);
                return allergenData ? (
                  <Tooltip key={allergen}>
                    {" "}
                    {/* ✅ Moved key here */}
                    <TooltipTrigger asChild>
                      <span className="cursor-pointer">
                        {React.createElement(allergenData.icon, {
                          className: "w-5 h-5",
                        })}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="portalColors">
                      {allergenData.label}
                    </TooltipContent>
                  </Tooltip>
                ) : null;
              })}
            </CardFooter>
          )}
        </CardContent>

        <CardContent className="flex-1 flex flex-col items-center justify-center">
          <img
            src={food.imageUrl || "/sigma.png"}
            alt={"sigma"}
            className="w-full mt-6 max-w-xs rounded-lg shadow-lg"
          />
          {food.price && (
            <CardDescription className="secondary-text pt-1">
              {food.price.toString()} Ft
            </CardDescription>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default BigFoodCard;
