import React from "react";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUserRole } from "@/lib/actions/foodFetch";
import OrderShow from "@/components/OrderShow";

const Page = async () => {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const role = await getUserRole(session.user?.id!);

  return (
    <>
      <nav className="flex items-center justify-between p-4 border-b">
        <div className="flex gap-4 items-center">
          {/* Conditionally show admin link */}
          {role === "ADMIN" && (
            <Link
              href="/admin"
              className="text-foreground hover:text-muted-foreground transition-colors cursor-pointer underline-offset-4 hover:underline"
            >
              Admin Panel
            </Link>
          )}
        </div>

        {/* Logout form */}
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <Button
            variant="link"
            className="text-foreground hover:text-muted-foreground p-0 h-auto cursor-pointer"
          >
            Kijelentkezés
          </Button>
        </form>
      </nav>
      <div className={"pt-2"}>
        <OrderShow />
      </div>
    </>
  );
};

export default Page;
