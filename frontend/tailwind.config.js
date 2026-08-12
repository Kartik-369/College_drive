/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bodoni: ['"Libre Bodoni"', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
      },
    },
  },
  plugins: [],
}