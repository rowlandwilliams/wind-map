const colors = require("tailwindcss/colors");
module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        "tt-interfaces-regular": ["TTInterfaces-Regular"],
        "tt-interfaces-italic": ["TTInterfaces-Italic"],
        "tt-interfaces-demi": ["TTInterfaces-Demi"],
        "tt-interfaces-bold": ["TTInterfaces-Bold"],
      },
    },
    colors: {
      ...colors,
      transparent: "transparent",
      current: "currentColor",
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/forms"), // import tailwind forms
  ],
};
