const plugin = require("tailwindcss/plugin");
const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class",
  theme: {
    colors: {
      gray: colors.coolGray,
      red: colors.red,
      green: colors.green,
      cyan: colors.cyan,
      sky: colors.sky,
      blue: colors.blue,
      violet: colors.violet,
      black: colors.black,
      white: colors.white,
    },
    extend: {
      colors: {
        "pale-white": "#fafafa",
        "dark-black": "#1A1A1B",
        "light-black": "#333F44",
        "accent-dark": "#37AA9C",
        "accent-light": "#94F3E4",
        "custom-blue": "#6495ED",
        cfblue: {
          50: "#f6f9fe",
          100: "#e8effc",
          200: "#d6e3fa",
          300: "#b6cdf6",
          400: "#91b3f2",
          500: "#6495ed",
          600: "#3674e7",
          700: "#1856c9",
          800: "#1346a4",
          900: "#113c8d",
        },
      },
      inset: {
        "1/5": "20%",
        "1/10": "10%",
      },
      maxHeight: {
        "1/4": "25%",
        "1/2": "50%",
        "3/4": "75%",
        "4/5": "80%",
      },
      maxWidth: {
        "1/4": "25%",
        "1/2": "50%",
        "3/4": "75%",
        "4/5": "80%",
      },
    },
  },
  variants: {
    extend: {
      opacity: ["disabled"],
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
        body: {
          "scrollbar-width": "8px",
          "scrollbar-color": "#4B5563 #111827",
        },
        "::-webkit-scrollbar": {
          width: "8px",
        },
        "::-webkit-scrollbar-track": {
          "background-color": "#111827",
          "border-radius": "100px",
        },
        "::-webkit-scrollbar-thumb": {
          "background-color": "#4B5563",
          "border-radius": "100px",
        },
      };

      addUtilities(newUtilities);
    }),
  ],
};
