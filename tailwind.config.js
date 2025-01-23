/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,tsx,ts,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#2C3E50', //Dark Blue
        secondary: '#ECF0F1', //Lght Gray
        accent: '#1ABC9C', //Cyan
        light: {
          cardBackground: '#fed7aa',
          text: '#1f2937'
        }
      },
    },
  },
  plugins: [],
}

