/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brutal-yellow': '#FFC700',
        'brutal-yellow-hover': '#F5B700',
        'brutal-bg': '#FAF9F6',
        'brutal-black': '#121212',
        'brutal-card': '#FFFFFF',
        'brutal-teal': '#2DD4BF',
        'brutal-purple': '#A78BFA',
        'brutal-coral': '#FB7185',
        'brutal-emerald': '#34D399',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Impact', 'sans-serif'],
      },
      boxShadow: {
        'brutal-xs': '1.5px 1.5px 0px #000000',
        'brutal-sm': '2.5px 2.5px 0px #000000',
        'brutal': '4px 4px 0px #000000',
        'brutal-lg': '6px 6px 0px #000000',
        'brutal-xl': '8px 8px 0px #000000',
      },
    },
  },
  plugins: [],
}
