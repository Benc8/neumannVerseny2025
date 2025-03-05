"use client";

import { usePathname } from "next/navigation";

const items = [
  {
    title: "Home",
    url: "/admin",
  },
  {
    title: "Létrehozás",
    url: "/admin/create",
  },
  {
    title: "Eltávolítás",
    url: "/admin/delete",
  },
  {
    title: "Elfogadás",
    url: "/admin/approve",
  },
  {
    title: "Beolvasás",
    url: "/admin/scan",
  },
];

export default function DashboardTitle() {
  const pathname = usePathname();

  // Find the active item
  const activeItem = items.find((item) => pathname === item.url);

  // If no active item is found, default to "Home"
  const title = activeItem ? activeItem.title : "Home";

  return <h1 className="text-2xl font-bold">{title}</h1>;
}
