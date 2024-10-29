/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Light theme colors
        primary: {
          DEFAULT: "#ffffff",
          hover: "#f3f4f6",
        },
        secondary: {
          DEFAULT: "#f3f4f6",
          hover: "#e5e7eb",
        },
        text: {
          DEFAULT: "#1f2937",
          secondary: "#4b5563",
        },
        border: "rgba(0, 0, 0, 0.1)",

        // Dark theme colors
        dark: {
          primary: {
            DEFAULT: "#1f2937",
            hover: "#374151",
          },
          secondary: {
            DEFAULT: "#111827",
            hover: "#1f2937",
          },
          text: {
            DEFAULT: "#f3f4f6",
            secondary: "#9ca3af",
          },
          border: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  },
  plugins: [],
};
