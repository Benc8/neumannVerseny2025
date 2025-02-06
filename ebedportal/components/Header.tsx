import React from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import Image from "next/image";
import logo from "../public/logo.png";

const Header = async () => {
  const session = await auth();
  return (
    <header
      className={
        "flex fixed top-1 justify-between w-full p-5 text-zinc-900 dark:text-zinc-100"
      }
    >
      <div>
        <Link href={"/"}>
          <Image
            src={logo}
            alt={"logo"}
            width={60}
            height={60}
            className={"rounded-xl"}
          />
        </Link>
      </div>
      <div className={"ml-2 pl-[5rem]"}>
        <h1 className={"text-4xl font-semibold font-bebas text-center"}>
          EbédPortál
        </h1>
      </div>
      <div>
        {!session ? (
          <Link href={"/sign-in"}>Bejelentkezés</Link>
        ) : (
          <div className={"flex items-center gap-4"}>
            <Link href={"/order"}>
              <h1>Rendelés</h1>
            </Link>
            <Link href={"/my-profile"}>
              <Avatar>
                <AvatarFallback className={"text-white bg-zinc-500"}>
                  {getInitials(session?.user?.email || "EE")}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
export default Header;
