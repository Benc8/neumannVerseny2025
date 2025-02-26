import React from "react";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUserRole } from "@/lib/actions/foodFetch";
import OrderShow from "@/components/OrderShow";
import { LogOut } from "lucide-react";

const Page = async () => {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const role = await getUserRole(session.user?.id!);

  return (
    <>
      <nav className="flex items-center justify-between pt-5 border-b">
        <div className="flex gap-4 items-center">
          {/* Conditionally show admin link */}
          {role === "ADMIN" && (
            <Link
              href="/admin"
              className="font-bebas text-2xl cursor-pointer underline-offset-4 hover:underline"
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
            className="font-bebas text-2xl cursor-pointer underline-offset-4 hover:underlines"
          >
            Kijelentkezés
          </Button>
        </form>
      </nav>

      <div className={"pt-6"}>
        <OrderShow />
      </div>
    </>
  );
};

export default Page;
