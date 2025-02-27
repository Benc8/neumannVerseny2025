import React from "react";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUserRole } from "@/lib/actions/foodFetch";
import OrderShow from "@/components/OrderShow";
import { FilePenLine } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

        <div className="flex gap-4 items-center">
          <Dialog>
            <DialogTrigger>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <FilePenLine />
                  </TooltipTrigger>
                  <TooltipContent>
                    <h4>
                      Állíts be felhasználóképet, hogy a fiókodat el tudják
                      fogadni!
                    </h4>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DialogTrigger>
            <DialogContent className={"bg-main"}>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
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
