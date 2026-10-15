/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef3fa',
          100: '#d9e4f3',
          200: '#b3c8e6',
          300: '#86a5d3',
          400: '#5a7fbb',
          500: '#3b61a0',
          600: '#2c4c82',
          700: '#223b66',
          800: '#172a4a',
          900: '#0f1d35',
          950: '#0a1426',
        },
        gold: {
          100: '#f6ecd0',
          300: '#e6cf94',
          400: '#d9b866',
          500: '#c9a24b',
          600: '#b08a38',
          700: '#8a6a28',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(10, 20, 38, 0.25)',
      },
    },
  },
  plugins: [],
};
