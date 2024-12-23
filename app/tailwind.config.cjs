/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["index.html", "./src/**/*.{html,ts,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['Golos Text', 'sans-serif'], // Configura Libre Franklin como fuente principal
      },
    },
  },
  plugins: [require("daisyui")],
  variants: {
    extend: {
      boxShadow: ["dark"],
    },
  },
  daisyui: {
    styled: true,
    themes: ["business"],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
  },
  safelist: [{ pattern: /^alert-/ }],
};
