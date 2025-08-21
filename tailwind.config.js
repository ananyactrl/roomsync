/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./{app,components,libs,pages,hooks}/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        wisteria: {
          50: '#f8f5fa',
          100: '#f0eaf5',
          200: '#e1d2eb',
          300: '#c69fd5',
          400: '#b37bc0',
          500: '#a05aab',
          600: '#8a3d96',
          700: '#6f2f78',
          800: '#5a2761',
          900: '#4a1f4f',
        },
        lemon: {
          50: '#fefefd',
          100: '#fdfdc9',
          200: '#fbfa9a',
          300: '#f7f56b',
          400: '#f2ef3c',
          500: '#ede91d',
          600: '#d4d00a',
          700: '#a5a208',
          800: '#767406',
          900: '#474604',
        }
      }
    },
  },
  plugins: [],
}

