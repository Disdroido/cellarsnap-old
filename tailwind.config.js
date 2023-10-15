/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        'cellarsnap-primary': '#1B998B',
        'cellarsnap-secondary': '#C82539',
        'cellarsnap-black': '#333333',
        'cellarsnap-offwhite': '#eefcfa'
      },
    },
  },
  plugins: [],
}

