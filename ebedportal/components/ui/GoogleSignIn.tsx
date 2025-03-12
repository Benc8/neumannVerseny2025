"use client";

import { signIn } from "next-auth/react";

export default function GoogleSignIn() {
  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/" })}
      className="w-full py-3 px-4 bg-gradient-to-br text-black
             dark:text-white font-bold rounded-lg shadow-lg transition-all duration-300
             transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
    >
      Continue with Google
    </button>
  );
}
