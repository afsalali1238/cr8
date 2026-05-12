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
        clay: {
          DEFAULT: '#B5603A',
          dark:    '#8F4628',
          light:   '#D4784E',
          pale:    '#F2DDD1',
        },
        cream:   '#FFFAF5',
        sand: {
          DEFAULT: '#F4EDE4',
          dark:    '#E8D5C0',
        },
        ink:     '#231209',
        charcoal:'#5C3520',
        muted:   '#9A7060',
        gold: {
          DEFAULT: '#C49A3C',
          light:   '#FBF3DC',
        },
        sage: {
          DEFAULT: '#6B8061',
          light:   '#EAF0E6',
        },
        footer: {
          bg:  '#1C0D04',
          mid: '#3A1C0C',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'Times New Roman', 'serif'],
        brand:   ['Caveat', 'cursive'],
        sans:    ['"DM Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl:  '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}

export default config
