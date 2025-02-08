import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: [
      'speech-Appli-zUWoLIz6kwpm-62646098.ap-southeast-1.elb.amazonaws.com',
      '.ap-southeast-1.elb.amazonaws.com',
    ]
  }
})
