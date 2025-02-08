"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { foodSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ImageUpload from "@/components/ImageUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AllergenSelect from "@/components/AllergenSelect";
import { createFood } from "@/lib/actions/foodFetch";
import { toast } from "@/hooks/use-toast";
import IconSelect from "@/components/IconSelect";

type FoodAddProps = {
  date: Date; // Date passed as a required prop
  initialValues?: Partial<z.infer<typeof foodSchema>>; // Optional pre-filled values
};

const FoodAdd: React.FC<FoodAddProps> = ({ date, initialValues }) => {
  const form = useForm<z.infer<typeof foodSchema>>({
    resolver: zodResolver(foodSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      image: "",
      allergens: [],
      type: "",

      ...initialValues, // Merge default values with passed-in props
    },
  });

  const onSubmit = async (values: z.infer<typeof foodSchema>) => {
    try {
      console.log(date);
      // @ts-ignore
      await createFood(values, date);
      toast({
        title: "Étel sikeresen hozzáadva",
        description: "Az étel sikeresen hozzáadva a menühöz",
      });
      window.location.reload();
    } catch (error) {
      toast({
        title: "Hiba az étel hozzáadása során",
        description: "Az étel hozzáadása sikertelen",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bebas text-center mb-6">Étel hozzáadása</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-6 lg:gap-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Étel neve</FormLabel>
                  <FormControl>
                    <Input placeholder="Pl.: Marhapörkölt" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category Field */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategória</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Válasz kategóriát" />
                      </SelectTrigger>
                      <SelectContent className="bg-gradient-to-bl text-zinc-900 dark:text-zinc-100 dark:from-gray-800 dark:via-gray-900 dark:to-black">
                        <SelectItem value="SOUP">Leves</SelectItem>
                        <SelectItem value="MAIN_COURSE">Főétel</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Leírás</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Írj egy részletes leírást..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Allergen Selection */}
            <FormField
              control={form.control}
              name="allergens"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allergének</FormLabel>
                  <FormControl>
                    <AllergenSelect
                      selected={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Étel ára (opcionális)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))} // Convert to number
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image URL Field */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kép</FormLabel>
                  <FormControl>
                    <ImageUpload onFileChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Allergen Selection */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Válassz ikont kép hiánya esetén</FormLabel>
                  <FormControl>
                    <IconSelect
                      selected={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800
              text-white font-bold rounded-lg shadow-lg transition-all duration-300
              transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
          >
            Hozzáadás
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default FoodAdd;
