/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          base: "#fff5ea",
          "gradient-start": "#F5D9A3",
          "calendar-surface": "#E8A33D",
          deep: "#412402",
          brown: "#633806",
          "holiday-section": "#FAEBD0",
          "holiday-card": "#FFF7E8",
          weekday: "#854F0B",
          national: "#EF9F27",
          "type-chip": "#F5D9A3",
          "rest-surface": "#2C2416",
          "rest-muted": "#D9C7A3",
          ink: "#2C2C2A",
          muted: "#7A7269",
          accent: "#C4715A",
          title: "#D67D1F",
          "accent-soft": "#E8D9CF",
        },
      },
    },
  },
  plugins: [],
};
