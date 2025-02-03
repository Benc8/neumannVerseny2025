"use client";

import * as React from "react";
import {
  Check,
  ChevronsUpDown,
  Soup,
  Salad,
  Pizza,
  Cake,
  Coffee,
  Beer,
  Candy,
  IceCream,
  Beef,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

type IconSelectProps = {
  selected?: string;
  onChange?: (selectedIcon: string | null) => void;
  placeholder?: string;
};

export default function IconSelect({
  selected,
  onChange,
  placeholder = "Válassz ikont...",
}: IconSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState<string | undefined>(
    selected,
  );

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === selectedValue ? null : currentValue;
    setSelectedValue(newValue || undefined);
    onChange?.(newValue);
    setOpen(false);
  };

  const selectedIcon = foodIcons.find((icon) => icon.value === selectedValue);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-left px-4 py-2 rounded-md border border-gray-300 bg-white dark:bg-gray-900"
        >
          <div className="flex items-center">
            {selectedIcon ? (
              <>
                <selectedIcon.icon className="mr-2 h-4 w-4" />
                {selectedIcon.label}
              </>
            ) : (
              placeholder
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className="bg-gradient-to-bl text-zinc-900 from-white via-gray-100 to-gray-300 dark:text-zinc-100 dark:from-gray-800 dark:via-gray-900 dark:to-black">
          <CommandInput placeholder="Keresés..." />
          <CommandList>
            <CommandEmpty>Nincs találat.</CommandEmpty>
            <CommandGroup>
              {foodIcons.map((icon) => (
                <CommandItem
                  key={icon.value}
                  value={icon.value}
                  onSelect={() => handleSelect(icon.value)}
                  className="flex items-center cursor-pointer"
                >
                  <icon.icon className="mr-2 h-5 w-5" />
                  <span>{icon.label}</span>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedValue === icon.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
