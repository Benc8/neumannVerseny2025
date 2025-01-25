"use client";

import * as React from "react";
import {
  Check,
  ChevronsUpDown,
  Nut,
  Fish,
  Wheat,
  Milk,
  MilkOff,
  WheatOff,
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

// Allergen options with Lucide icons
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

type AllergenSelectProps = {
  selected?: string[];
  onChange?: (selectedAllergens: string[]) => void;
  placeholder?: string;
};

export default function AllergenSelect({
  selected = [],
  onChange,
  placeholder = "Válassz allergént...",
}: AllergenSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedValues, setSelectedValues] =
    React.useState<string[]>(selected);

  React.useEffect(() => {
    setSelectedValues(selected);
  }, [selected]);

  const handleSelect = (currentValue: string) => {
    const newSelectedValues = selectedValues.includes(currentValue)
      ? selectedValues.filter((value) => value !== currentValue) // Remove if already selected
      : [...selectedValues, currentValue]; // Add if not selected

    setSelectedValues(newSelectedValues);
    onChange?.(newSelectedValues);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-left px-4 py-2 rounded-md border border-gray-300 bg-white dark:bg-gray-900"
        >
          {selectedValues.length > 0
            ? selectedValues
                .map(
                  (val) =>
                    allergens.find((allergen) => allergen.value === val)?.label,
                )
                .join(", ")
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className="bg-gradient-to-bl text-zinc-900 from-white via-gray-100 to-gray-300 dark:text-zinc-100 dark:from-gray-800 dark:via-gray-900 dark:to-black">
          <CommandInput placeholder="Keresés..." />
          <CommandList>
            <CommandEmpty>Nincs találat.</CommandEmpty>
            <CommandGroup>
              {allergens.map((allergen) => (
                <CommandItem
                  key={allergen.value}
                  value={allergen.value}
                  onSelect={() => handleSelect(allergen.value)}
                  className="flex items-center cursor-pointer"
                >
                  <allergen.icon className="mr-2 h-5 w-5" />
                  <span>{allergen.label}</span>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedValues.includes(allergen.value)
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
