import React, { ReactNode } from "react";
import Header from "@/components/Header";

import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: ReactNode }) => {
  return (
    <main className={"root-container"}>
      <Header />
      <div className={"mt-16 pb-16"}>{children}</div>
    </main>
  );
};
export default Layout;
