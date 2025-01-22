import React from "react";
import Link from "next/link";

const Header = () => {
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
        <Link href={"/sign-in"}>sign in</Link>
      </div>
    </header>
  );
};
export default Header;
