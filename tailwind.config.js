/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        custom_navy: {
          700: '#082157',
          800: '#061a46',
          900: '#041331',
          950: '#040f2d',
        }
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
        fadeOut: 'fadeOut 0.3s ease-in-out',
      },
      fontFamily: {
        'varela-round': ['Varela Round', 'sans-serif'],
      }
    },
  },
  variants: {},
  plugins: [],
};
