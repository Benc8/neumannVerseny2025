import React from "react";
import { Github } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gradient-to-r text-zinc-900 from-white via-gray-100 to-gray-300 dark:text-zinc-100 dark:from-gray-900 dark:to-black py-4">
      <div className="mx-auto flex flex-col sm:flex-row max-w-7xl items-center justify-around px-4 sm:px-6 lg:px-8">
        <div className={"flex flex-col gap-4 mb-4 sm:mb-0"}>
          <span className="text-center font-bebas text-xl">
            © {currentYear} EbédPortál
          </span>
          <span className="text-center font-bebas text-xl">
            All rights reserved.
          </span>
        </div>
        <div className={"flex flex-col gap-4"}>
          <span className="text-center font-bebas text-xl">
            By: Menyhért Bence
          </span>
          <div className={"grid justify-center"}>
            <a
              href="https://github.com/Benc8"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm dark:text-white text-black hover:underline"
            >
              <Github />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
