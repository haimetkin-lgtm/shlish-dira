import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6fb",
          100: "#d8eaf5",
          600: "#2471a3",
          700: "#1a5a85",
          800: "#144866",
        },
        gold: { 500: "#c9a227", 600: "#b08d1f" },
      },
    },
  },
  plugins: [],
};

export default config;
