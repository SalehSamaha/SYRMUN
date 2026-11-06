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
          700: '#1b3158',
          800: '#11223e',
          900: '#081730',
          950: '#030d1e',
        },
        sky: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        gold: {
          100: '#f0f9ff',
          300: '#bae6fd',
          400: '#7dd3fc',
          500: '#38bdf8',
          600: '#0284c7',
          700: '#0369a1',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(1, 14, 48, 0.4)',
      },
    },
  },
  plugins: [],
};

