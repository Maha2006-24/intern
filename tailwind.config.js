/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        brand: {
          50: '#fdf1f2',
          100: '#fbe6e8',
          200: '#f5c6cb',
          300: '#ec97a1',
          400: '#dd5a6e',
          500: '#b82a42',
          600: '#98233a',
          700: '#7a1e33',
          800: '#5c1627',
          900: '#3f0f1a',
        },
      },
      boxShadow: {
        soft: '0 18px 50px rgba(35, 20, 30, 0.08)',
        glow: '0 6px 30px rgba(184, 42, 66, 0.18)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
