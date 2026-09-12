/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#18181A',
          deep: '#121214',
          border: '#2A2A2D',
          muted: '#3E3E42',
          light: '#262629'
        },
        'soft-black': '#0B0B0C',
        ivory: {
          DEFAULT: '#F7F5F0',
          warm: '#FDFCF9',
          cream: '#EFECE6',
          border: '#E5E0D8'
        },
        gold: {
          light: '#E6D5BE',
          DEFAULT: '#C5A880',
          hover: '#B8976C',
          deep: '#9E7E55',
          accent: '#D4AF37'
        }
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif']
      }
    },
  },
  plugins: [],
};
