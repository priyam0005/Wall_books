/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        gray: {
          700: '#282828',
          800: '#1a1a1a',
          900: '#111111',
        },
        yellow: {
          400: '#d4af37', // subtle gold accent
          500: '#bfa430',
          600: '#a68a2f',
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
