/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-purple': '#a855f7',
        'custom-cyan': '#06b6d4',
        'custom-blue': '#3b82f6',
        'custom-indigo': '#8b5cf6',
        'custom-violet': '#a78bfa',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'line-flow': 'line-flow 10s linear infinite',
      },
      keyframes: {
        'line-flow': {
          '0%, 100%': { 'stroke-dashoffset': '1000' },
          '50%': { 'stroke-dashoffset': '0' },
        },
      },
    },
  },
  plugins: [],
}