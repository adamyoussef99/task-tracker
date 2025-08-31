import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,         // needed for Docker to expose 0.0.0.0
    watch: {
      usePolling: true, // enables polling for file changes
      interval: 100,    // optional: check every 100ms
    },
  },
})
