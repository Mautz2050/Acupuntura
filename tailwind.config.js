/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#635f40',
        'primary-dark': '#4b4830',
        'primary-container': '#b2ac88',
        secondary: '#9f402d',
        tertiary: '#156874',
        surface: '#fbfbe2',
        'surface-container': '#efefd7',
        'surface-low': '#f5f5dc',
        'on-surface': '#1b1d0e',
        'on-surface-variant': '#49473d',
        'outline-subtle': '#cbc6b9'
      },
      fontFamily: {
        headline: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
