/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tea: {
          50: '#f2f8f4',
          100: '#e1f0e6',
          500: '#2d6a4f',
          600: '#1b4332',
          700: '#081c15',
          800: '#05110d',
          gold: '#d4a373'
        }
      }
    },
  },
  plugins: [],
}
