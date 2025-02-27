import React from "react";
import DailyMenu from "@/components/DailyMenu";
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <>
      <DailyMenu />
    </>
  );
};
export default Home;
