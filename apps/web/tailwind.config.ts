import type { Config } from 'tailwindcss'
import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette'
import typography from '@tailwindcss/typography'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const addVariablesForColors = ({ addBase, theme }: any) => {
  const allColors = flattenColorPalette(theme('colors'))
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  )

  addBase({
    ':root': newVars
  })
}

export default {
  darkMode: 'selector',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)'
      }
    }
  },
  plugins: [addVariablesForColors, typography()]
} satisfies Config
