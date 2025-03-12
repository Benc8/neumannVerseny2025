import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { foods } from "@/database/schema";
import {
  Soup,
  Beef,
  Salad,
  Pizza,
  Cake,
  Coffee,
  Beer,
  Candy,
  IceCream,
} from "lucide-react";
import config from "@/lib/config";

type Food = typeof foods.$inferSelect;

const SmallFoodCard = ({ food }: { food: Food }) => (
  <Card className="flex items-center justify-between p-2 h-16 w-auto">
    <div className="flex-1 min-w-0">
      <h3 className="font-medium truncate">{food.fullName}</h3>
      <p className="text-sm text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
        {food.description}
      </p>
    </div>
    {food.imageUrl !== config.env.imagekit.urlEndpoint ? (
      <Image
        src={food.imageUrl!}
        alt={food.fullName}
        width={48}
        height={48}
        className="w-12 h-12 rounded-md object-cover"
      />
    ) : (
      {
        soup: <Soup className="w-8 h-8 ml-2" />,
        beef: <Beef className="w-8 h-8 ml-2" />,
        salad: <Salad className="w-8 h-8 ml-2" />,
        pizza: <Pizza className="w-8 h-8 ml-2" />,
        dessert: <Cake className="w-8 h-8 ml-2" />,
        coffee: <Coffee className="w-8 h-8 ml-2" />,
        drink: <Beer className="w-8 h-8 ml-2" />,
        snack: <Candy className="w-8 h-8 ml-2" />,
        "ice-cream": <IceCream className="w-8 h-8 ml-2" />,
      }[food.type.toLowerCase()]
    )}
  </Card>
);

export default SmallFoodCard;
