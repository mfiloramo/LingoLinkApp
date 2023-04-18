/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: false,
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'varela-round': ['Varela Round', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
