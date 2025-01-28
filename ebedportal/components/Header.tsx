import React from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

const Header = async () => {
  const session = await auth();
  return (
    <header
      className={
        "flex fixed top-1 justify-between w-full p-5 text-zinc-900 dark:text-zinc-100"
      }
    >
      <div>
        <h2>Logo</h2>
      </div>
      <div>
        <h1 className={"text-4xl font-semibold font-bebas"}>EbédPortál</h1>
      </div>
      <div>
        {!session ? (
          <Link href={"/sign-in"}>Bejelentkezés</Link>
        ) : (
          <Link href={"/my-profile"}>
            <Avatar>
              <AvatarFallback className={"text-white bg-zinc-500"}>
                {getInitials(session?.user?.email || "EE")}
              </AvatarFallback>
            </Avatar>
          </Link>
        )}
      </div>
    </header>
  );
};
export default Header;
