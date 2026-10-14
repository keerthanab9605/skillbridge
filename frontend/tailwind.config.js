/** Palette: ink (text/dark surfaces), span (bridge-steel teal, primary), signal (amber, highlights) */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'], sans: ['"Source Sans 3"', 'system-ui', 'sans-serif'] },
      colors: {
        ink: { 900: '#0F1B2D', 800: '#16263D', 700: '#22364F', 500: '#5B6B80', 200: '#D5DCE5', 100: '#E9EEF4', 50: '#F4F7FA' },
        span: { 600: '#0B7A83', 700: '#09646C', 400: '#2FB3BC' },
        signal: { 500: '#F2A33A', 100: '#FDF0DC' },
      },
    },
  },
  plugins: [],
};
