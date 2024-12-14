/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["index.html","./src/**/*.{html,ts,vue}"],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  variants: {
    extend: {
      boxShadow: ["dark"],
    },
  },
  daisyui: {
    styled: true,
    themes: ["cmyk"],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "dracula",
  },
  safelist: [{ pattern: /^alert-/ }],
};
