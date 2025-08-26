/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        loaderBg: "#111",
        loaderText: "#956afa",
        loaderGray: "rgb(124,124,124)"
      },
      keyframes: {
        spinWords: {
          "0%, 10%": { transform: "translateY(0%)" },
          "25%, 35%": { transform: "translateY(-100%)" },
          "50%, 60%": { transform: "translateY(-200%)" },
          "75%, 85%": { transform: "translateY(-300%)" },
          "100%": { transform: "translateY(-400%)" },
        },
      },
      animation: {
        spinWords: "spinWords 4s infinite",
      },
    },
  },
  plugins: [],
};
