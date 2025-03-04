import React from "react";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUserRole, getUserStatus } from "@/lib/actions/foodFetch";
import OrderShow from "@/components/OrderShow";
import { ProfileImageDialog } from "@/components/ProfileImgDialog";
import { QrCodeGen } from "@/components/QrCodeGen";

const Page = async () => {
  const session = await auth();
  let img = "";
  if (!session) {
    redirect("/");
  }

  const role = await getUserRole(session.user?.id!);
  const status = await getUserStatus(session.user?.id!);

  return (
    <>
      <nav className="flex items-center justify-between pt-5 border-b">
        {/* Conditionally show admin link */}
        {role === "ADMIN" && (
          <div className="flex gap-4 items-center">
            <Link
              href="/admin"
              className="font-bebas text-2xl cursor-pointer underline-offset-4 hover:underline"
            >
              Admin Panel
            </Link>
          </div>
        )}

        <div className="flex gap-4 items-center">
          <ProfileImageDialog userId={session.user?.id!} />
        </div>

        {status === "APPROVED" && (
          <div className="flex gap-4 items-center">
            <QrCodeGen userId={session.user?.id!} />
          </div>
        )}

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
