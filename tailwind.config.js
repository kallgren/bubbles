/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        // Light theme colors
        primary: {
          DEFAULT: "#ffffff",
          hover: "#f5f5f5",
        },
        secondary: {
          DEFAULT: "#f5f5f5",
          hover: "#e5e5e5",
        },
        tertiary: {
          DEFAULT: "#fafafa",
          hover: "#f0f0f0",
        },
        text: {
          DEFAULT: "#000000",
          secondary: "#666666",
        },
        border: "rgba(0, 0, 0, 0.1)",

        // Dark theme colors
        dark: {
          primary: {
            DEFAULT: "#1e1e1e",
            hover: "#2a2a2a",
          },
          secondary: {
            DEFAULT: "#2a2a2a",
            hover: "#323232",
          },
          tertiary: {
            DEFAULT: "#232323",
            hover: "#2f2f2f",
          },
          text: {
            DEFAULT: "#ffffff",
            secondary: "#999999",
          },
          border: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  },
  plugins: [],
};
