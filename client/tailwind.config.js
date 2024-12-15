/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#ffffff',
        secondary: '#bc6c25',
        accent: 'rgba(71, 85, 105, 1)',
        'body-light': '#FFFFFF',
        'text-primary-light': '#333333',
        'text-secondary-light': '#757575',
        'accent-light': '#008080',
        'accent-secondary-light': '#50C878', // Secondary accent (Emerald Green)
        'button-primary-light': '#008080', // Primary button (Teal)
        'button-hover-light': '#007373', // Hover effect for primary button (Darker Teal)
        'border-light': '#E0E0E0', // Borders for light mode

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
        'body-dark': '#121212', // Body background for dark mode
        'text-primary-dark': '#E0E0E0', // Primary text for dark mode
        'text-secondary-dark': '#B0B0B0', // Secondary text for dark mode
        'accent-dark': '#50C878', // Primary accent (Emerald Green)
        'accent-secondary-dark': '#008080', // Secondary accent (Teal)
        'button-primary-dark': '#50C878', // Primary button (Emerald Green)
        'button-hover-dark': '#3A9D66', // Hover effect for primary button (Darker Emerald Green)
        'border-dark': '#333333',
      },
    },
  },
  plugins: [],
};
