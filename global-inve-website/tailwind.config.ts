import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: 'hsl(222 78% 22%)',
          glow: 'hsl(222 70% 38%)',
        },
        accent: {
          DEFAULT: 'hsl(28 96% 54%)',
          soft: 'hsl(36 100% 96%)',
        },
        foreground: {
          DEFAULT: 'hsl(222 47% 11%)',
        },
        'muted-foreground': 'hsl(215 16% 42%)',
        border: 'hsl(215 25% 90%)',
      },
      borderRadius: {
        base: '14px',
      },
      boxShadow: {
        elegant: '0 4px 30px hsla(222, 78%, 22%, 0.35)',
        soft: '0 2px 8px hsla(222, 47%, 11%, 0.12)',
        glow: '0 2px 8px hsla(28, 96%, 54%, 0.12)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
} satisfies Config
