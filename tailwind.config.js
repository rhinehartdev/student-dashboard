/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // <-- This is essential
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
