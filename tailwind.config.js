/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sage: '#515A4E',
        cream: '#f0ede8',
        muted: '#b0ab9f',
        gold: '#c9a96e',
        golddark: '#a88754',
        ok: '#5cb85c',
        danger: '#d9534f',
        warn: '#f0c040',
      },
      fontFamily: {
        cairo: ['Cairo', 'Arial', 'sans-serif'],
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}
