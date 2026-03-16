/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        "primary-200" : "#f59e0b",
        "primary-100" : "#d97706",
        "secondary-200" : "#10b981",
        "secondary-100" : "#1e3a8a",
        "neutral-800" : "#1f2937",
        "neutral-600" : "#4b5563",
        "neutral-700" : "#374151"
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

