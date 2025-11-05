module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 1. Definicja keyframes (dla animacji)
      keyframes: {
        slideInScale: {
          "0%": { transform: "translateY(10px) scale(0.9)", opacity: "0" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "1" },
        },
      },
      // 2. Definicja nazwy animacji
      animation: {
        slideInScale: "slideInScale 0.4s ease-out forwards",
      },
    },
  },
  plugins: [],
};
