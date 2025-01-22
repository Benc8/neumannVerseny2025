import React, { ReactNode } from "react";
import Image from "next/image";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      <div className="block lg:fixed top-0 right-0 w-full h-52 lg:w-1/2 lg:h-full">
        <img
          src="/testImg.jpg"
          alt="Visual"
          className="object-cover w-full h-full"
        />
      </div>

      <div className="root-container">
        <div className="lg:fixed flex flex-row gap-3">
          <Image src="/testImg.jpg" alt="logo" width={37} height={37} />
          <h1 className={"text-3xl font-semibold font-bebas"}>EbédPortál</h1>
        </div>
        {children}
      </div>
    </main>
  );
};

export default Layout;
