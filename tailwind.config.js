/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        'primary': '#0d6efd',
        'dark-primary': '#084bb4',
        'secondary': '#c7c5c5',
        'dark-secondary': '#7c7c7c',
        'warning': '#ef394e',
        'dark-warning': '#af2735',
        'success': '#24dc24',
        'dark-success': '#157347',


        'header': '#f0f3f5',
        'separator': '#d3c9c9'
      },
      borderRadius: {
        '': '.25rem',
        'lg': '.5rem'
      }
    },
  },
  plugins: [],
}

