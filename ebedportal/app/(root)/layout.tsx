import React, { ReactNode } from "react";
import Header from "@/components/Header";

import { redirect } from "next/navigation";
import Footer from "@/components/Footer";

const Layout = async ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      <main className={"root-container"}>
        <div className={"mt-16 pb-16"}>{children}</div>
      </main>
      <Footer />
    </>
  );
};
export default Layout;
