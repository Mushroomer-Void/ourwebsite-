/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'darkest':  '#190019',
        'dark':     '#2B124C',
        'primary':  '#522B5B',
        'accent':   '#854F6C',
        'soft':     '#DFB6B2',
        'light':    '#FBE4D8',
      },
      fontFamily: {
        'tajawal': ['Tajawal', 'sans-serif'],
      }
    },
  },
  plugins: [],
}