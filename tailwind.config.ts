// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        clay:    { DEFAULT: '#c2440f', light: '#e8601e', pale: '#fdf0e8' },
        cream:   '#fdf8f3',
        sand:    { DEFAULT: '#f5ead8', dark: '#e8d5b7' },
        ink:     '#1a1208',
        charcoal:'#3d3020',
        muted:   '#8a7560',
      },
      fontFamily: {
        display: ['Caveat', 'cursive'],
        sans:    ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}

export default config
