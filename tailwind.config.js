/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx", "./src/**/*.js"],
  theme: {
    extend: {
      colors: {
        'primary': 'var(--primary-color)',
        'dark-primary': 'var(--dark-primary-color)',
        'secondary': 'var(--secondary-color)',
        'dark-secondary': 'var(--dark-secondary-color)',
        'warning': 'var(--warning-color)',
        'dark-warning': 'var(--dark-warning-color)',
        'success': 'var(--success-color)',
        'dark-success': 'var(--dark-success-color)',
        'info': 'var(--info-color)',
        'dark-info': 'var(--dark-info-color)',

        'header': 'var(--card-header-background)',
        'separator': 'var(--app-border-color)',
        'background': 'var(--app-background)',
        'muted': 'var(--app-text-muted-color)',
      },
      borderRadius: {
        '': '.25rem',
        'lg': '.5rem'
      },
      fontSize: {
        'xs': '.7rem',
        'sm': '.8rem',
        'lg': '1.1rem',
      }
    },
  },
  plugins: [],
}

