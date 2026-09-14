/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A4D8C',
          50: '#eef5fc',
          100: '#d6e6f6',
          200: '#aecdee',
          300: '#7eaee2',
          400: '#4d8bd3',
          500: '#1E88E5',
          600: '#0A4D8C',
          700: '#083d70',
          800: '#062A4D',
          900: '#041d36',
        },
        navy: '#062A4D',
        accent: '#1E88E5',
        light: '#F5F8FC',
        lightgray: '#E8EEF5',
        ink: '#0F172A',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(10, 77, 140, 0.18)',
        card: '0 18px 50px -18px rgba(6, 42, 77, 0.28)',
        glow: '0 0 0 1px rgba(255,255,255,0.5), 0 20px 60px -20px rgba(30, 136, 229, 0.45)',
        'glow-accent': '0 0 0 1px rgba(30,136,229,0.25), 0 24px 70px -24px rgba(30, 136, 229, 0.6)',
        float: '0 30px 80px -30px rgba(6, 42, 77, 0.45)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255,255,255,0.6)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(115deg, rgba(6,42,77,0.92) 0%, rgba(10,77,140,0.72) 45%, rgba(6,42,77,0.45) 100%)',
        'blue-gradient': 'linear-gradient(135deg, #0A4D8C 0%, #1E88E5 100%)',
        'navy-gradient': 'linear-gradient(135deg, #062A4D 0%, #0A4D8C 100%)',
        'mesh-light':
          'radial-gradient(at 0% 0%, rgba(30,136,229,0.12) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(10,77,140,0.10) 0px, transparent 50%), radial-gradient(at 80% 100%, rgba(30,136,229,0.10) 0px, transparent 50%)',
        'mesh-dark':
          'radial-gradient(at 10% 10%, rgba(30,136,229,0.35) 0px, transparent 45%), radial-gradient(at 90% 20%, rgba(10,77,140,0.4) 0px, transparent 45%), radial-gradient(at 50% 100%, rgba(30,136,229,0.25) 0px, transparent 45%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-22px) translateX(10px)' },
        },
        'slow-zoom': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.12)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        aurora: {
          '0%, 100%': { transform: 'translate(0,0) scale(1)', opacity: '0.6' },
          '33%': { transform: 'translate(30px,-30px) scale(1.15)', opacity: '0.85' },
          '66%': { transform: 'translate(-20px,20px) scale(0.9)', opacity: '0.5' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '70%, 100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 9s ease-in-out infinite',
        'slow-zoom': 'slow-zoom 18s ease-in-out infinite alternate',
        marquee: 'marquee 32s linear infinite',
        'marquee-slow': 'marquee 55s linear infinite',
        'gradient-x': 'gradient-x 6s ease infinite',
        aurora: 'aurora 14s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite',
      },
    },
  },
  plugins: [],
}
