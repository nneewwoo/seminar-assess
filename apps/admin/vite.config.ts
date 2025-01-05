import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import generouted from '@generouted/react-router/plugin'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), generouted()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: true
  },
  clearScreen: false,
  build: {
    outDir: './dist'
  }
})
