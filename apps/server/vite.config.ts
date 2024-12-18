import { PrismaClient } from '@prisma/client'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    host: true,
    port: 5174,
    strictPort: true
  },
  define: {
    globalThis: {
      __prisma: PrismaClient
    }
  }
})
