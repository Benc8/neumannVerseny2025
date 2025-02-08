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
              className="cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              Rendelés
            </Link>
            <Link href="/my-profile" className="cursor-pointer">
              <Avatar>
                <AvatarFallback className="text-white bg-zinc-500 cursor-pointer">
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
