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
import { foods } from "@/database/schema";
import {
  Beef,
  Beer,
  Cake,
  Candy,
  Coffee,
  Fish,
  IceCream,
  Milk,
  MilkOff,
  Nut,
  Pizza,
  Salad,
  Soup,
  Wheat,
  WheatOff,
} from "lucide-react";
import config from "@/lib/config";

type Food = typeof foods.$inferSelect;

interface CardProps {
  key: string;
  food: Food;
  color?: string;
}

const allergens = [
  { value: "nut", label: "Mogyorófélék", icon: Nut },
  { value: "fish", label: "Garnélarák", icon: Fish },
  { value: "gluten", label: "Glutén", icon: Wheat },
  { value: "lactose", label: "Laktóz", icon: Milk },
  { value: "gluten-free", label: "Gluténmentes", icon: WheatOff },
  { value: "lactose-free", label: "Laktózmentes", icon: MilkOff },
];

const foodIcons = [
  { value: "beef", label: "Hús", icon: Beef },
  { value: "soup", label: "Leves", icon: Soup },
  { value: "salad", label: "Saláta", icon: Salad },
  { value: "pizza", label: "Pizza", icon: Pizza },
  { value: "dessert", label: "Desszert", icon: Cake },
  { value: "coffee", label: "Kávé", icon: Coffee },
  { value: "drink", label: "Ital", icon: Beer },
  { value: "snack", label: "Nasi", icon: Candy },
  { value: "ice-cream", label: "Fagylalt", icon: IceCream },
];

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
          {food.imageUrl !== config.env.imagekit.urlEndpoint ? (
            <div className={"pt-3"}>
              <img
                src={food.imageUrl}
                alt={food.fullName}
                className="w-full h-full object-cover rounded-lg h8"
              />
            </div>
          ) : (
            food.type &&
            foodIcons.find((icon) => icon.value.toUpperCase() === food.type)
              ?.icon &&
            React.createElement(
              foodIcons.find((icon) => icon.value.toUpperCase() === food.type)!
                .icon,
              {
                className:
                  "h-32 w-32 lg:w-[80%] lg:h-[80%] text-white w-full h-full object-cover rounded-lg",
              },
            )
          )}

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
