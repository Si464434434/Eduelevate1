/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#0E57C4',
        accent: '#FF8A00'
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif']
      }
    }
  },
  plugins: []
}
