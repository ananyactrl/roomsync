/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./{app,components,libs,pages,hooks}/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-pacifico)', 'cursive'],
      },
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
        },
        background: '#fefefd',
        foreground: '#1f2937',
        border: '#e5e7eb',
        muted: {
          DEFAULT: '#f9fafb',
          foreground: '#6b7280',
        },
        accent: {
          DEFAULT: '#f3f4f6',
          foreground: '#374151',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#1f2937',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#1f2937',
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'modern': '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 20px rgba(160, 90, 171, 0.3)',
        'glow-lg': '0 0 30px rgba(160, 90, 171, 0.6)',
        'inner-glow': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-scale': 'fadeInScale 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'pulse-glow': 'pulseGlow 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInScale: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(160, 90, 171, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(160, 90, 171, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-mesh': 'linear-gradient(45deg, #f0eaf5 0%, #e1d2eb 25%, #c69fd5 50%, #b37bc0 75%, #a05aab 100%)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [],
}

