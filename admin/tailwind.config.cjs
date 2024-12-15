/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#f0f2f5',
        'body-light': '#FFFFFF',
        'text-primary-light': '#333333',
        'text-secondary-light': '#757575',
        'accent-light': '#008080',
        'accent-secondary-light': '#50C878',
        'button-primary-light': '#008080',
        'button-hover-light': '#007373',
        'border-light': '#E0E0E0',

        // Form Colors
        'input-light': '#F9F9F9',
        'input-dark': '#1A1A1A',
        'border-light': '#E0E0E0',
        'border-dark': '#333333',
        'placeholder-light': '#757575',
        'placeholder-dark': '#B0B0B0',
        'text-light': '#333333',
        'text-dark': '#E0E0E0',

        // Dark Mode Colors
        'dark-light': '#1A1A1A',
        'dark-secondary': '#0d0d0d',
        'body-dark': '#121212',
        'text-primary-dark': '#E0E0E0',
        'text-secondary-dark': '#B0B0B0',
        'accent-dark': '#50C878',
        'accent-secondary-dark': '#008080',
        'button-primary-dark': '#50C878',
        'button-hover-dark': '#3A9D66',
        'border-dark': '#333333',
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
};
