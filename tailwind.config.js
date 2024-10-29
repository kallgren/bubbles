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
      keyframes: {
        "float-large": {
          "0%, 100%": {
            transform:
              "translate(var(--mouse-x), calc(var(--mouse-y) + 0px)) scale(1.01, 0.99)",
          },
          "50%": {
            transform:
              "translate(var(--mouse-x), calc(var(--mouse-y) - 10px)) scale(0.99, 1.01)",
          },
        },
        "float-medium": {
          "0%, 100%": {
            transform:
              "translate(var(--mouse-x), calc(var(--mouse-y) + 0px)) scale(1.007, 0.993)",
          },
          "50%": {
            transform:
              "translate(var(--mouse-x), calc(var(--mouse-y) - 6px)) scale(0.993, 1.007)",
          },
        },
        "float-small": {
          "0%, 100%": {
            transform:
              "translate(var(--mouse-x), calc(var(--mouse-y) + 0px)) scale(1.005, 0.995)",
          },
          "50%": {
            transform:
              "translate(var(--mouse-x), calc(var(--mouse-y) - 4px)) scale(0.995, 1.005)",
          },
        },
      },
      animation: {
        "float-large": "float-large 3s ease-in-out infinite",
        "float-medium": "float-medium 3s ease-in-out 0.5s infinite",
        "float-small": "float-small 3s ease-in-out 1s infinite",
      },
    },
  },
  plugins: [],
};
