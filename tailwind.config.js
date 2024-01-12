/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: false,
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        cust_navy: {
          700: '#082157', // ACTIVE COLOR FOR CONVERSATION-ITEMS
          800: '#061a46', // HOVER COLOR FOR CONVERSATION-ITEMS
          900: '#041331', // BASE COLOR FOR CONVERSATION-ITEMS
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
