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
          tertiary: "#999999",
          highlight: "#000000",
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
            hover: "#363636",
          },
          tertiary: {
            DEFAULT: "#232323",
            hover: "#2f2f2f",
          },
          text: {
            DEFAULT: "#ffffff",
            secondary: "#999999",
            tertiary: "#666666",
            highlight: "#bbbbbb",
          },
          border: "rgba(255, 255, 255, 0.1)",
        },
      },
      keyframes: {
        "float-large": {
          "0%, 100%": {
            transform: "translate(var(--mouse-x), calc(var(--mouse-y) + 0px))",
          },
          "50%": {
            transform: "translate(var(--mouse-x), calc(var(--mouse-y) - 10px))",
          },
        },
        "float-medium": {
          "0%, 100%": {
            transform: "translate(var(--mouse-x), calc(var(--mouse-y) + 0px))",
          },
          "50%": {
            transform: "translate(var(--mouse-x), calc(var(--mouse-y) - 6px))",
          },
        },
        "float-small": {
          "0%, 100%": {
            transform: "translate(var(--mouse-x), calc(var(--mouse-y) + 0px))",
          },
          "50%": {
            transform: "translate(var(--mouse-x), calc(var(--mouse-y) - 4px))",
          },
        },
        "slide-up": {
          "0%": { height: "var(--expanded-height)" },
          "100%": { height: "0px" },
        },
        "slide-down": {
          "0%": { height: "0px" },
          "100%": { height: "var(--expanded-height)" },
        },
        "slide-left": {
          "0%": { width: "var(--expanded-width)" },
          "100%": { width: "0px" },
        },
        "slide-right": {
          "0%": { width: "0px" },
          "100%": { width: "var(--expanded-width)" },
        },
      },
      animation: {
        "float-large": "float-large 3s ease-in-out infinite",
        "float-medium": "float-medium 3s ease-in-out 0.5s infinite",
        "float-small": "float-small 3s ease-in-out 1s infinite",
        "slide-up": "slide-up 0.2s ease-out forwards",
        "slide-down": "slide-down 0.2s ease-out forwards",
        "slide-left": "slide-left 0.2s ease-out forwards",
        "slide-right": "slide-right 0.2s ease-out forwards",
      },
    },
  },
  plugins: [],
};
