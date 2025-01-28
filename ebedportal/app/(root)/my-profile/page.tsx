import React from "react";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

const Page = async () => {
  const session = await auth();

  if (!session) {
    redirect("/");
  }
  return (
    <>
      <form
        action={async () => {
          "use server";

          await signOut();
        }}
      >
        <Button>logout</Button>
      </form>
    </>
  );
};
export default Page;
