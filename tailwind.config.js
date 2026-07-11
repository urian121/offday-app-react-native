/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          base: "#F7F5F1",
          surface: "#EFEBE4",
          ink: "#2B2622",
          muted: "#7A7269",
          accent: "#C4715A",
          "accent-soft": "#E8D9CF",
          gold: "#DAA428",
          cream: "#F7EED8",
        },
      },
    },
  },
  plugins: [],
};
