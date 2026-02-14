/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pacman-yellow': '#FFFF00',
        'ghost-red': '#FF0000',
        'ghost-pink': '#FFB8FF',
        'ghost-cyan': '#00FFFF',
        'ghost-orange': '#FFB852',
        'maze-blue': '#2121DE',
      },
      animation: {
        'pulse-fast': 'pulse 0.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
