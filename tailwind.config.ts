import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        orange: {
          25: '#fffaf4',
          75: '#fff0df',
          950: 'oklch(26.6% .079 36.259)'
        },
        stone: {
          300: 'oklch(86.9% .005 56.366)',
          800: 'oklch(26.8% .007 34.298)',
          900: 'oklch(21.6% .006 56.043)',
          950: 'oklch(14.7% .004 49.25)'
        },
        purple: {
          300: 'oklch(82.7% .119 306.383)',
          400: 'oklch(71.4% .203 305.504)'
        },
        teal: {
          400: 'oklch(77.7% .152 181.912)'
        },
        rose: {
          300: 'oklch(81% .117 11.638)',
          400: 'oklch(71.2% .194 13.428)'
        }
      },
      fontFamily: {
        numeric: ['ui-rounded', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        '5xl': '2.5rem'
      },
      screens: {
        '3xl': '108rem'
      },
      maxWidth: {
        'screen-3xl': '108rem'
      },
      spacing: {
        13: '3.25rem',
        15: '3.75rem',
        18: '4.5rem',
        21: '5.25rem',
        23: '5.75rem',
        25: '6.25rem',
        37: '9.25rem'
      },
      size: {
        13: '3.25rem',
        18: '4.5rem',
        21: '5.25rem',
        25: '6.25rem',
        37: '9.25rem'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        draw: {
          to: { strokeDashoffset: '0' }
        },
        rotate: {
          '0%': { transform: 'rotate(0)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        shine: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' }
        },
        shake: {
          '25%, 75%': { transform: 'translate(4px)' },
          '50%': { transform: 'translate(-4px)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.3s ease-out',
        'accordion-up': 'accordion-up 0.3s ease-out',
        draw: 'draw 0.8s ease-in forwards',
        rotate: 'rotate 3s linear infinite',
        'rotate-slow': 'rotate 10s linear infinite',
        shine: 'shine 2s linear infinite',
        shake: 'shake 0.25s ease-out both'
      }
    }
  },
  plugins: []
} satisfies Config
