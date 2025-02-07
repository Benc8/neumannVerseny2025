import React, { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getServerSideProps } from "@/lib/actions/foodFetch";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return (
    <main>
      <div className="block lg:fixed top-0 right-0 w-full h-52 lg:w-1/2 lg:h-full">
        <img
          src="/background.png"
          alt="Visual"
          className="object-cover w-full h-full"
        />
      </div>

      <div className="root-container">
        <div className="lg:fixed flex flex-row gap-3">
          <Image
            src="/background.png"
            alt="logo"
            width={37}
            height={37}
            className={"rounded-lg"}
          />
          <Link className={"text-3xl font-semibold font-bebas"} href={"/"}>
            EbédPortál
          </Link>
        </div>
        {children}
      </div>
    </main>
  );
};

export default Layout;
