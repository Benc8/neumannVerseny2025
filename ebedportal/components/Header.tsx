import React from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import Image from "next/image";
import logo from "../public/logo.png";
import { getUserImg } from "@/lib/actions/foodFetch";

const Header = async () => {
  const session = await auth();
  let userImg = "";
  if (session) {
    userImg = await getUserImg(session?.user?.id!);
  }
  return (
    <header className="flex fixed top-1 justify-between w-full p-5 text-zinc-900 dark:text-zinc-100">
      {/* Logo */}
      <div className={"flex items-center gap-4"}>
        <Link href="/" className="cursor-pointer">
          <Image
            src={logo}
            alt="logo"
            width={60}
            height={60}
            className="rounded-xl cursor-pointer"
          />
        </Link>
        <h1 className="text-4xl font-semibold font-bebas text-center hidden lg:block">
          EbédPortál
        </h1>
      </div>

      {/* User Section */}
      <div>
        {!session ? (
          <Link
            href="/sign-in"
            className="cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
          >
            Bejelentkezés
          </Link>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              href="/order"
              className="cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors text-xl"
            >
              Rendelés
            </Link>
            <Link href="/my-profile" className="cursor-pointer">
              <Avatar className={"w-[3.7rem] h-[3.7rem] "}>
                <AvatarImage src={userImg} />
                <AvatarFallback className="text-white text-xl bg-zinc-500 cursor-pointer">
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
