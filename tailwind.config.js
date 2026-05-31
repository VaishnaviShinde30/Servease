/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: { // Caramel
          50: '#fdf8f3',
          100: '#faece0',
          200: '#f3d3b7',
          400: '#e49c5e',
          500: '#da7b33', 
          600: '#cc6126',
          700: '#ab4a22',
          800: '#893d22',
          900: '#6f341f',
        },
        secondary: { // Raisin
          50: '#f5f4f5',
          100: '#ebe9ec',
          200: '#d3cdd5',
          400: '#9e91a3',
          500: '#7c6d83', 
          600: '#625368',
          700: '#4d4052',
          800: '#3e3443',
          900: '#242124',
        },
        accent: {
          400: '#fbbf24',
          500: '#f59e0b', // Amber/Caramel highlight
          600: '#d97706',
        }
      }
    },
  },
  plugins: [],
}
