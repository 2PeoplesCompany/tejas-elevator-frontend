import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#16395b",
          "navy-dark": "#0d243a",
          "navy-light": "#1f4c78",
          steel: "#d4d8dd",
          "steel-light": "#f1f3f5",
          black: "#000000",
          white: "#ffffff",
          charcoal: "#111827",
          muted: "#4b5563",
          border: "#e5e7eb",
        },
      },
    },
  },
  plugins: [],
};
export default config;
