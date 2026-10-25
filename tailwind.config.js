/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        doom: {
          950: '#060907',
          900: '#0a0f0d',
          850: '#0f1713',
          800: '#14201a',
          750: '#1a2a22',
          700: '#21362c',
          emerald: '#10b981',
          emeraldHover: '#059669',
          neon: '#34d399',
          gold: '#d4af37',
          goldLight: '#e6c762',
          goldDim: '#997e28',
          red: '#ef4444',
          redDim: '#7f1d1d',
        }
      },
      fontFamily: {
        display: ['Rajdhani', 'Orbitron', 'Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'emerald-glow': '0 0 20px -3px rgba(16, 185, 129, 0.35)',
        'emerald-glow-lg': '0 0 35px -2px rgba(16, 185, 129, 0.5)',
        'gold-glow': '0 0 20px -3px rgba(212, 175, 55, 0.35)',
        'red-glow': '0 0 20px -3px rgba(239, 68, 68, 0.4)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
