/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#f0f2f5",
        secondary: "#ff813f",
        primaryLight: "#ff9e6f",
        primaryDark: "#e65a1e",
        tertiary: "#222222",
      },
      variants: {
        extend: {
          backgroundColor: ["hover"],
        },
      },
      keyframes: {
        wave: {
          "0%": {
            transform: "scale(0)",
            opacity: "1",
          },
          "100%": {
            transform: "scale(1.5)",
            opacity: "0",
          },
        },
      },
      animation: {
        wave: "wave 1.5s ease-out infinite",
        waveDelay: "wave 1.5s ease-out infinite 0.5s",
        waveDelayMore: "wave 1.5s ease-out infinite 1s",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
