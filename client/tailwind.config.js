/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ffffff",
        secondary: "#bc6c25",
        accent: "rgba(71, 85, 105, 1)",
      },
    },
  },
  plugins: [],
};
