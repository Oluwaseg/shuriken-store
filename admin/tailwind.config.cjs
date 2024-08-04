/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#f0f2f5",
        secondary: "#ff813f",
        tertiary: "#222222",
      },
      variants: {
        extend: {
          backgroundColor: ["hover"],
        },
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
