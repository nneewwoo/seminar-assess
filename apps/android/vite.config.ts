import { sveltekit } from '@sveltejs/kit/vite'
import { internalIpV4Sync } from 'internal-ip'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [sveltekit(), tailwindcss()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: true,
    hmr: {
      protocol: 'ws',
      host: internalIpV4Sync(),
      port: 1421
    }
  },
  envPrefix: ['VITE_', 'TAURI_']
})
