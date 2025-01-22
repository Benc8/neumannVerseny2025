import type { Config } from "tailwindcss";

export default {
  darkMode: "media",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bebas: "var(--bebas-Neue), sans-serif", // Use your custom variable
      },
      colors: {
        // Base Colors
        zinc: {
          50: "#fafafa",
          100: "#f4f4f5",
          200: "#e4e4e7",
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a",
          600: "#52525b",
          700: "#3f3f46",
          800: "#27272a",
          900: "#18181b",
        },
        // Accent Colors (fresh and energetic)
        emerald: {
          50: "#d6f8f1",
          100: "#a3f3d0",
          200: "#66e0a0",
          300: "#33d17f",
          400: "#0db566",
          500: "#009c55",
          600: "#008944",
          700: "#007933",
          800: "#006722",
          900: "#005611",
        },
        orange: {
          50: "#fff7e6",
          100: "#ffecb3",
          200: "#ffd480",
          300: "#ffbb4d",
          400: "#ffa31a",
          500: "#ff8c00",
          600: "#e77a00",
          700: "#cc6900",
          800: "#b35800",
          900: "#9f4700",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
