"use client";

import { usePathname } from "next/navigation";

export default function DashboardTitle() {
  const pathname = usePathname();

  // You can modify this to display different titles based on the route
  const title = pathname === "/admin" ? "Főoldal" : "Létrehozás";

  return <h1 className="text-2xl font-bold">{title}</h1>;
}
