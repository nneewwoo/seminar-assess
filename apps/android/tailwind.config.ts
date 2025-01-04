import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif']
      },
      boxShadow: {
        box: `
          inset 0 1px 0 0 black, 
          inset 1px 0 0 0 black, 
          0 1px 0 0 black, 
          1px 0 0 0 black !important
        `
      }
    }
  },

  plugins: []
} satisfies Config
