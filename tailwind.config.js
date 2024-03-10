/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#343541",
        secondary: "black",
        tertiary: "#202123",
        white: "#ffffff",
        SecondaryWhite: "rgb(195,195,208)",
        TertiaryWhite: "rgb(195,195,208,0.2)",
      },
      spacing: {
        "100%": "100%",
        "50%": "50%",
        "25%": "25%",
        "25vh": "25vh",
        "1px": "1px",
      },
      animation: {
        "spin-slow": "spin 2s linear infinite",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
