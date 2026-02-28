/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-light': '#E0F2FE',
        'primary-main': '#0891B2',
        'primary-dark': '#0369A1',
        'secondary-light': '#CFFAFE',
        'secondary-main': '#06B6D4',
        'accent': '#0284C7',
      },
    },
  },
  plugins: [],
}
