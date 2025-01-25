"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signInSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const Page = () => {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof signInSchema>) => {
    console.log(values);
  };

  const [email, setEmail] = useState("");

  return (
    <div className="flex items-start pt-10 lg:pt-0 lg:items-center justify-center lg:min-h-screen lg:w-1/2">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <h1 className="font-bebas text-4xl text-center mb-4">
              Bejelentkezés
            </h1>

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="pelda@pelda.hu"
                      {...field}
                      //onChange={(e) => setEmail(e.target.value)}
                      className="border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jelszó</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="******"
                      {...field}
                      className="border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800
             text-white font-bold rounded-lg shadow-lg transition-all duration-300
             transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              Bejelentkezés
            </Button>
            <FormDescription className="text-gray-600 dark:text-gray-400 text-center text-sm mt-4">
              Nincs még fiókod?{" "}
              <Link
                href={"/sign-up"}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Regisztrálj itt
              </Link>
            </FormDescription>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
