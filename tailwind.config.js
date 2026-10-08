/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          deep: '#102A43',
          midnight: '#0B2135',
          harbour: '#1E3A5F',
          DEFAULT: '#102A43'
        },
        ivory: {
          warm: '#F7F3EA',
          DEFAULT: '#F7F3EA',
          cream: '#E9E1D4',
          border: '#E9E1D4'
        },
        'warm-white': '#FFFDF8',
        stone: {
          soft: '#E9E1D4',
          DEFAULT: '#E9E1D4'
        },
        brass: {
          champagne: '#B08D57',
          DEFAULT: '#B08D57'
        },
        gold: {
          soft: '#D8C3A5',
          DEFAULT: '#B08D57',
          light: '#D8C3A5',
          hover: '#9B7A49'
        },
        slate: {
          text: '#3E4852',
          DEFAULT: '#3E4852'
        },
        grey: {
          muted: '#6B7280',
          DEFAULT: '#6B7280'
        },
        sage: {
          muted: '#5D7A65',
          DEFAULT: '#5D7A65'
        },
        charcoal: {
          DEFAULT: '#102A43',
          deep: '#0B2135',
          border: '#E9E1D4',
          muted: '#3E4852',
          light: '#1E3A5F'
        },
        'soft-black': '#0B2135'
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'Arial', 'sans-serif'],
        ui: ['"DM Sans"', 'Arial', 'sans-serif']
      }
    },
  },
  plugins: [],
};
